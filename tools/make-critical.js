// Writes critical.css: only the rules the first screen needs on a phone, copied word for word from styles.css.
// Usage: node tools/make-critical.js http://localhost:4321/   (needs puppeteer-core and a local Chrome)
const fs = require('fs');
const puppeteer = require('puppeteer-core');

const url = process.argv[2] || 'http://localhost:4321/';
const chrome = process.env.CHROME_PATH || process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe';

// Splits CSS into its top-level pieces, keeping the original text of each one.
function parse(css) {
  const items = [];
  let i = 0;
  while (i < css.length) {
    while (i < css.length && /\s/.test(css[i])) i++;
    if (i >= css.length) break;
    const start = i;
    let quote = null, depth = 0, open = -1;
    for (; i < css.length; i++) {
      const c = css[i];
      if (quote) { if (c === '\\') i++; else if (c === quote) quote = null; continue; }
      if (c === '"' || c === "'") { quote = c; continue; }
      if (c === '{') { if (depth === 0) open = i; depth++; }
      else if (c === '}') { depth--; if (depth === 0) { i++; break; } }
      else if (c === ';' && depth === 0) { i++; break; }
    }
    const text = css.slice(start, i).trim();
    if (open === -1) { items.push({ kind: 'statement', text }); continue; }
    const head = css.slice(start, open).trim();
    const body = css.slice(open + 1, i - 1);
    if (/^@media|^@supports/.test(head)) items.push({ kind: 'group', head, children: parse(body) });
    else if (/^@font-face/.test(head)) items.push({ kind: 'font', text });
    else if (/^@(-webkit-)?keyframes/.test(head)) items.push({ kind: 'keyframes', name: head.split(/\s+/)[1], text });
    else if (head[0] === '@') items.push({ kind: 'other', text });
    else items.push({ kind: 'rule', selector: head, text });
  }
  return items;
}

const source = fs.readFileSync('styles.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const tree = parse(source);
const selectors = new Set();
(function collect(list) { for (const n of list) { if (n.kind === 'rule') selectors.add(n.selector); if (n.kind === 'group') collect(n.children); } })(tree);

function matchInPage(list) {
  const scope = new Set([document.documentElement, document.body]);
  for (const sel of ['.nav', '.stage', '.skip', '.ambient', '.progress', '.tabbar']) {
    document.querySelectorAll(sel).forEach((el) => { scope.add(el); el.querySelectorAll('*').forEach((c) => scope.add(c)); });
  }
  const pseudo = /::?(before|after|selection|placeholder|backdrop|marker|-webkit-[\w-]+)(\([^)]*\))?/g;
  const state = /:(hover|focus-visible|focus-within|focus|active|visited|target)\b/g;
  const hit = (part) => {
    const clean = part.replace(pseudo, '').replace(state, '').trim() || '*';
    try { return [...document.querySelectorAll(clean)].some((el) => scope.has(el)); } catch (e) { return false; }
  };
  const out = {};
  for (const s of list) {
    // Split on commas outside brackets, so :is(a, b) stays together.
    const parts = []; let d = 0, cur = '';
    for (const c of s) { if (c === '(') d++; if (c === ')') d--; if (c === ',' && d === 0) { parts.push(cur); cur = ''; } else cur += c; }
    parts.push(cur);
    out[s] = parts.some(hit);
  }
  return out;
}

(async () => {
  const browser = await puppeteer.launch({ executablePath: chrome, headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'load' });
  await new Promise((r) => setTimeout(r, 2000));
  const keep = await page.evaluate(matchInPage, [...selectors]);
  await browser.close();

  const faces = [], frames = {}, used = new Set();
  const noteAnimations = (text) => { (text.match(/animation(?:-name)?\s*:[^;}]+/g) || []).forEach((m) => m.split(/[\s:,]+/).forEach((w) => used.add(w))); };
  const wideOnly = (head) => /print|min-width:\s*(7[6-9]\d|[89]\d\d|\d{4})px/.test(head);
  const render = (list) => {
    let out = '';
    for (const n of list) {
      if (n.kind === 'font') faces.push(n.text);
      else if (n.kind === 'keyframes') frames[n.name] = n.text;
      else if (n.kind === 'rule' && keep[n.selector]) { noteAnimations(n.text); out += n.text + '\n'; }
      else if (n.kind === 'group' && !wideOnly(n.head)) { const inner = render(n.children); if (inner) out += `${n.head} {\n${inner}}\n`; }
    }
    return out;
  };
  const body = render(tree);
  const animations = Object.keys(frames).filter((k) => used.has(k)).map((k) => frames[k]).join('\n');
  // Everything below the hero waits for the full stylesheet, which ends by showing it again.
  const guard = 'main > :not(.stage), body > footer { visibility: hidden; }';
  const out = `${faces.join('\n')}\n@media (max-width: 760px) {\n${body}\n${animations}\n${guard}\n}\n`;
  fs.writeFileSync('critical.css', out);
  console.log('critical.css', out.length, 'bytes');
})().catch((e) => { console.error(e); process.exit(1); });
