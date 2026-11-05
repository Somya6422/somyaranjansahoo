// Local static server that mimics vercel.json (security headers + clean URLs).
// Run from this folder:  node dev-server.js   then open http://localhost:4321
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const root = path.resolve(process.argv[2] || __dirname);
const port = Number(process.argv[3] || 4321);
const types = { '.wasm': 'application/wasm', '.py': 'text/plain; charset=utf-8', '.sql': 'text/plain; charset=utf-8', '.csv': 'text/plain; charset=utf-8', '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json', '.pdf': 'application/pdf', '.txt': 'text/plain' };
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const rules = (cfg.headers || []).map(r => ({ re: new RegExp('^' + r.source.replace(/\(\.\*\)/g, '(.*)') + '$'), headers: r.headers }));
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  for (const r of rules) if (r.re.test(p)) for (const h of r.headers) res.setHeader(h.key, h.value);
  if (p.endsWith('/')) p += 'index.html';
  let file = path.join(root, p);
  if (!path.extname(file) && fs.existsSync(file + '.html')) file += '.html'; // cleanUrls
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
    const type = types[path.extname(file).toLowerCase()] || 'application/octet-stream';
    const headers = { 'Content-Type': type, 'Cache-Control': 'no-store' };
    // Compress text like Vercel does in production.
    if (/text|javascript|json|svg/.test(type) && /gzip/.test(req.headers['accept-encoding'] || '')) {
      headers['Content-Encoding'] = 'gzip';
      data = zlib.gzipSync(data);
    }
    // Video players ask for byte ranges, and Vercel answers them.
    const range = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range || '');
    if (range && type.startsWith('video/')) {
      const start = +range[1], end = Math.min(range[2] ? +range[2] : data.length - 1, data.length - 1);
      if (start > end) { res.writeHead(416, { 'Content-Range': 'bytes */' + data.length }); return res.end(); }
      headers['Accept-Ranges'] = 'bytes';
      headers['Content-Range'] = 'bytes ' + start + '-' + end + '/' + data.length;
      res.writeHead(206, headers);
      return res.end(data.subarray(start, end + 1));
    }
    if (type.startsWith('video/')) headers['Accept-Ranges'] = 'bytes';
    res.writeHead(200, headers);
    res.end(data);
  });
}).listen(port, () => console.log('Serving ' + root + ' on http://localhost:' + port));
