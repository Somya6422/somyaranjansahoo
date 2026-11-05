/* Data lab: charts for the toll-network case study and my own numbers, plus a SQL playground.
   Loaded only when someone scrolls near the section. The SQL engine (about 700 KB) waits for the first query. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  var nf = new Intl.NumberFormat('en-IN');

  // one shared tooltip for every mark
  var tip = el('div', 'dl-tip'); tip.hidden = true; document.body.appendChild(tip);
  function bindTip(node, text) {
    node.addEventListener('pointerenter', function () { tip.textContent = text; tip.hidden = false; });
    node.addEventListener('pointermove', function (e) {
      var x = Math.min(e.clientX + 14, window.innerWidth - tip.offsetWidth - 8);
      tip.style.transform = 'translate(' + x + 'px,' + (e.clientY - 34) + 'px)';
    });
    node.addEventListener('pointerleave', function () { tip.hidden = true; });
  }

  // every chart keeps a table of its numbers
  function table(host, head, rows) {
    var d = el('details', 'dl-table'), t = el('table'), tr = el('tr');
    d.appendChild(el('summary', null, 'See the numbers'));
    head.forEach(function (h) { var th = el('th', null, h); th.scope = 'col'; tr.appendChild(th); });
    var thead = el('thead'); thead.appendChild(tr); t.appendChild(thead);
    var tb = el('tbody');
    rows.forEach(function (r) { var x = el('tr'); r.forEach(function (c) { x.appendChild(el('td', null, c)); }); tb.appendChild(x); });
    t.appendChild(tb); d.appendChild(t); host.appendChild(d);
  }

  // ranked horizontal bars, one hue, value at the tip
  function bars(host, rows, unit, fmt) {
    host.textContent = '';
    var max = Math.max.apply(null, rows.map(function (r) { return r.v; })), list = el('div', 'dl-bars');
    rows.forEach(function (r) {
      var row = el('div', 'dl-bar'), track = el('div', 'dl-bar__track'), bar = el('div', 'dl-bar__fill' + (r.muted ? ' is-muted' : '')), val = fmt ? fmt(r.v) : nf.format(r.v);
      bar.style.width = (r.v / max * 100).toFixed(1) + '%';
      track.appendChild(bar); track.appendChild(el('span', 'dl-bar__val', val));
      row.appendChild(el('span', 'dl-bar__label', r.k)); row.appendChild(track);
      bindTip(row, r.k + ': ' + val + (unit ? ' ' + unit : '') + (r.note ? ' · ' + r.note : ''));
      list.appendChild(row);
    });
    host.appendChild(list);
    table(host, ['', unit || 'Value'], rows.map(function (r) { return [r.k, fmt ? fmt(r.v) : nf.format(r.v)]; }));
  }

  // columns over time
  function columns(host, rows, unit) {
    host.textContent = '';
    var max = Math.max.apply(null, rows.map(function (r) { return r.v; })), list = el('div', 'dl-cols');
    rows.forEach(function (r) {
      var col = el('div', 'dl-col'), area = el('div', 'dl-col__area'), bar = el('div', 'dl-col__fill');
      bar.style.height = (r.v / max * 100).toFixed(1) + '%';
      if (r.v) area.appendChild(el('span', 'dl-col__val', r.v));
      area.appendChild(bar); col.appendChild(area); col.appendChild(el('span', 'dl-col__label', r.k));
      bindTip(col, r.k + ': ' + r.v + ' ' + unit);
      list.appendChild(col);
    });
    host.appendChild(list);
    table(host, ['Year', unit], rows.map(function (r) { return [r.k, String(r.v)]; }));
  }

  // 100% stacked bars for comparing two wholes
  function stacked(host, groups, keys) {
    host.textContent = '';
    var legend = el('ul', 'dl-legend');
    keys.forEach(function (k, i) { var li = el('li'); li.appendChild(el('i', 'dl-sw dl-sw--' + (i + 1))); li.appendChild(document.createTextNode(k)); legend.appendChild(li); });
    host.appendChild(legend);
    groups.forEach(function (g) {
      var row = el('div', 'dl-stack'), track = el('div', 'dl-stack__track');
      row.appendChild(el('span', 'dl-bar__label', g.k));
      keys.forEach(function (k, i) {
        var v = g.v[k] || 0, seg = el('div', 'dl-seg dl-seg--' + (i + 1));
        seg.style.width = v + '%';
        if (v >= 12) seg.appendChild(el('span', null, Math.round(v) + '%'));
        bindTip(seg, g.k + ' roads · ' + k + ': ' + v.toFixed(1) + '%');
        track.appendChild(seg);
      });
      row.appendChild(track); host.appendChild(row);
    });
    table(host, ['Roads'].concat(keys), groups.map(function (g) { return [g.k].concat(keys.map(function (k) { return (g.v[k] || 0).toFixed(1) + '%'; })); }));
  }

  // ---- the toll case study ----
  fetch('assets/data/toll-results.json').then(function (r) { return r.json(); }).then(function (d) {
    var top = d.top_states.slice(0, 8), rest = d.top_states.slice(8).reduce(function (a, b) { return a + b.plazas; }, 0);
    var rows = top.map(function (s) { return { k: s.state, v: s.plazas, note: s.share_pct + '% of all plazas' }; });
    rows.push({ k: 'Other 18 states and UTs', v: rest, muted: true });
    bars($('chartStates'), rows, 'plazas');

    var mix = {};
    d.funding_mix.forEach(function (r) {
      var k = r.funding === 'Public Funded' || r.funding === 'Concession' ? r.funding : 'Other models';
      mix[r.road_class] = mix[r.road_class] || {};
      mix[r.road_class][k] = (mix[r.road_class][k] || 0) + r.share_of_class_pct;
    });
    stacked($('chartFunding'), [{ k: 'National', v: mix.National }, { k: 'State', v: mix.State }], ['Public Funded', 'Concession', 'Other models']);

    bars($('chartPrivate'), d.private_share.map(function (s) { return { k: s.state, v: s.private_pct, note: s.private_plazas + ' of ' + s.plazas + ' plazas' }; }), 'private', function (v) { return v + '%'; });
    bars($('chartSpacing'), d.spacing.map(function (s) { return { k: s.gap, v: s.plazas, note: s.share_pct + '%' }; }), 'plazas');
  }).catch(function () {});

  // ---- my own numbers, counted live from this page ----
  var creds = Array.prototype.map.call(document.querySelectorAll('#credList .cred'), function (c) {
    var t = c.querySelector('time'), cat = c.querySelector('.cred__cat'), iss = c.querySelector('.cred__issuer'), h = c.querySelector('h4');
    var m = t ? /([A-Za-z]{3})?\s*(\d{4})/.exec(t.textContent) : null;
    return { title: h ? h.textContent.trim() : '', issuer: iss ? iss.textContent.trim() : '', area: cat ? cat.textContent.trim() : 'Other', year: m ? +m[2] : null, mon: m ? m[1] : null };
  });
  var byYear = {}, byArea = {};
  creds.forEach(function (c) { if (c.year) byYear[c.year] = (byYear[c.year] || 0) + 1; byArea[c.area] = (byArea[c.area] || 0) + 1; });
  var years = Object.keys(byYear).map(Number), y0 = Math.min.apply(null, years), y1 = Math.max.apply(null, years), yr = [];
  for (var y = y0; y <= y1; y++) yr.push({ k: String(y), v: byYear[y] || 0 });
  if ($('chartYears')) columns($('chartYears'), yr, 'certificates');
  if ($('chartAreas')) bars($('chartAreas'), Object.keys(byArea).map(function (k) { return { k: k, v: byArea[k] }; }).sort(function (a, b) { return b.v - a.v; }), 'certificates');
  // The headline is worked out from the same numbers, so it stays true as certificates are added.
  var topArea = Object.keys(byArea).sort(function (a, b) { return byArea[b] - byArea[a]; })[0], finding = $('myFinding');
  if (finding && topArea) {
    var lead = document.createElement('strong'); lead.textContent = 'Main finding:';
    finding.appendChild(lead);
    finding.appendChild(document.createTextNode(' ' + byArea[topArea] + ' of my ' + creds.length + ' certificates are in ' + topArea + ', my largest group so far.'));
    finding.hidden = false;
  }
  if ($('chartLangs') && window.__ghRepos) window.__ghRepos().then(function (list) {
    if (!list) { $('chartLangs').textContent = 'GitHub is taking a break. See my repositories on GitHub directly.'; return; }
    var by = {};
    list.filter(function (r) { return !r.fork && r.lang; }).forEach(function (r) { by[r.lang] = (by[r.lang] || 0) + 1; });
    bars($('chartLangs'), Object.keys(by).map(function (k) { return { k: k, v: by[k] }; }).sort(function (a, b) { return b.v - a.v; }), 'repositories');
  });

  // ---- SQL playground ----
  var box = $('sqlBox');
  if (!box) return;
  var input = $('sqlIn'), out = $('sqlOut'), run = $('sqlRun'), worker = null, loading = null;
  var MON = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
  var TIME_LIMIT = 5000;
  function say(text, cls) { out.textContent = ''; out.appendChild(el('p', 'sql__msg' + (cls ? ' ' + cls : ''), text)); }
  function stop() { if (worker) worker.terminate(); worker = null; loading = null; }
  function start() {
    if (loading) return loading;
    say('Starting a real SQL database in your browser…');
    loading = fetch('assets/data/toll-plazas.json').then(function (r) { return r.json(); }).then(function (plazas) {
      return new Promise(function (res, rej) {
        worker = new Worker('assets/js/sql-worker.js');
        worker.onerror = rej;
        worker.onmessage = function (e) { if (e.data.type === 'ready') res(); else rej(); };
        worker.postMessage({
          type: 'load', plazas: plazas,
          certificates: creds.map(function (x) { return [x.title, x.issuer, x.area, x.year, x.year && x.mon ? x.year + '-' + MON[x.mon] : null]; }),
          projects: Array.prototype.filter.call(document.querySelectorAll('.case, .cards > .card'), function (n) { return n.querySelector('h3'); }).map(function (n) {
            return [n.querySelector('h3').textContent.trim(), Array.prototype.map.call(n.querySelectorAll('.chips li'), function (l) { return l.textContent; }).join(', ')];
          })
        });
      });
    });
    return loading;
  }
  function show(r) {
    out.textContent = '';
    if (!r.total) return say('The query ran and returned no rows.');
    var wrap = el('div', 'sql__scroll'), t = el('table'), head = el('tr');
    r.columns.forEach(function (c) { var th = el('th', null, c); th.scope = 'col'; head.appendChild(th); });
    var thead = el('thead'); thead.appendChild(head); t.appendChild(thead);
    var tb = el('tbody');
    r.rows.forEach(function (row) { var tr = el('tr'); row.forEach(function (v) { tr.appendChild(el('td', null, v == null ? 'NULL' : String(v))); }); tb.appendChild(tr); });
    t.appendChild(tb); wrap.appendChild(t); out.appendChild(wrap);
    out.appendChild(el('p', 'sql__count', r.total + (r.total === 1 ? ' row' : ' rows') + (r.total > 100 ? ', showing the first 100' : '')));
  }
  // The database is read-only; this also stops the commands that could switch that off.
  function blocked(q) {
    var code = q.replace(/'(?:[^']|'')*'|"(?:[^"]|"")*"|--[^\n]*|\/\*[\s\S]*?\*\//g, ' ');
    return /\b(pragma|attach|detach|vacuum|reindex)\b/i.test(code);
  }
  var READ_ONLY = 'This playground is read-only, so only SELECT queries run. Try an example above.';
  function ask(q) {
    return new Promise(function (done) {
      var timer = setTimeout(function () {
        stop();
        say('That query ran too long, so I stopped it. Add a LIMIT or try an example.', 'is-hint');
        done();
      }, TIME_LIMIT);
      worker.onerror = function () {
        clearTimeout(timer); stop();
        say('That query was too heavy to finish. Add a LIMIT or try an example.', 'is-hint');
        done();
      };
      worker.onmessage = function (e) {
        clearTimeout(timer);
        if (e.data.type === 'result') show(e.data.result);
        else if (/readonly/i.test(e.data.message)) say(READ_ONLY, 'is-hint');
        else say('That query didn’t run: ' + e.data.message + '. Check the table and column names listed below, or try an example.', 'is-hint');
        done();
      };
      worker.postMessage({ type: 'run', sql: q });
    });
  }
  function exec() {
    var q = input.value.trim();
    if (!q) return say('Type a query first, or pick an example above.');
    if (run.disabled) return;
    if (blocked(q)) return say(READ_ONLY, 'is-hint');
    run.disabled = true;
    start().then(function () { return ask(q); })
      .catch(function () { stop(); say('The database couldn’t start just now. Reload the page and try again.', 'is-hint'); })
      .then(function () { run.disabled = false; });
  }
  run.addEventListener('click', exec);
  input.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); exec(); } });
  Array.prototype.forEach.call(box.querySelectorAll('.sql__ex'), function (b) {
    b.addEventListener('click', function () { input.value = b.getAttribute('data-sql'); exec(); });
  });
})();
