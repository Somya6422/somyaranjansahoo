// Runs the SQL playground away from the page, so a slow query can never freeze the tab.
importScripts('sql-wasm.js');

var db = null;

function load(m) {
  return initSqlJs({ locateFile: function (f) { return f; } }).then(function (SQL) {
    db = new SQL.Database();
    db.run('CREATE TABLE certificates (title TEXT, issuer TEXT, area TEXT, year INT, month TEXT); CREATE TABLE projects (name TEXT, tech TEXT); CREATE TABLE toll_plazas (code TEXT, name TEXT, funding TEXT, road_class TEXT, state TEXT, city TEXT, lat REAL, lon REAL, geo_ok INT, nearest_km REAL);');
    db.run('BEGIN');
    [['INSERT INTO certificates VALUES (?,?,?,?,?)', m.certificates], ['INSERT INTO projects VALUES (?,?)', m.projects], ['INSERT INTO toll_plazas VALUES (?,?,?,?,?,?,?,?,?,?)', m.plazas]].forEach(function (t) {
      var s = db.prepare(t[0]);
      t[1].forEach(function (row) { s.run(row); });
      s.free();
    });
    db.run('COMMIT');
  });
}

// Keeps only the rows the page will show, so a huge result cannot run out of memory.
function query(sql) {
  var res = { columns: [], rows: [], total: 0 };
  for (var s of db.iterateStatements(sql)) {
    var cols = s.getColumnNames(), rows = [], total = 0;
    while (s.step()) {
      total++;
      if (rows.length < 100) rows.push(s.get());
    }
    if (cols.length) res = { columns: cols, rows: rows, total: total };
  }
  return res;
}

self.onmessage = function (e) {
  var m = e.data;
  if (m.type === 'load') {
    load(m).then(function () { postMessage({ type: 'ready' }); }, function () { postMessage({ type: 'failed' }); });
    return;
  }
  try { postMessage({ type: 'result', result: query(m.sql) }); }
  catch (err) { postMessage({ type: 'error', message: err.message }); }
};
