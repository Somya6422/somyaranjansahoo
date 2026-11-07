/* Realistic 3D hands for the "live build" intro and the page's little moments.
   Built from photos of my own hands: each hand (back + palm photo) is cut into 16 parts
   (palm, thumb, 3 segments per finger) hung on a CSS 3D rig. Fingers bend at real joints, the rings
   move with them, and every part has my palm on its other side, so a hand can turn over and wave.
   Exposes window.RealHand = { load(), ready, create(layer, label, tone, opts) }. */
(function () {
  'use strict';
  var RIGS = { r: {"side":"right","atlas":[512,308],"palmAtlas":[512,312],"parts":[{"id":"palm","a":[0,0],"s":[155,240],"o":[-103,-198]},{"id":"thumb0","a":[157,0],"s":[66,131],"o":[32,82]},{"id":"thumb1","a":[351,0],"s":[59,73],"o":[26,63]},{"id":"thumb2","a":[106,242],"s":[42,51],"o":[19,42]},{"id":"index0","a":[267,0],"s":[42,78],"o":[20,69]},{"id":"index1","a":[38,242],"s":[33,64],"o":[17,56]},{"id":"index2","a":[223,242],"s":[29,43],"o":[16,36]},{"id":"middle0","a":[225,0],"s":[40,86],"o":[21,78]},{"id":"middle1","a":[412,0],"s":[37,72],"o":[19,64]},{"id":"middle2","a":[186,242],"s":[35,44],"o":[17,37]},{"id":"ring0","a":[311,0],"s":[38,77],"o":[19,70]},{"id":"ring1","a":[0,242],"s":[36,66],"o":[17,59]},{"id":"ring2","a":[150,242],"s":[34,46],"o":[17,39]},{"id":"little0","a":[451,0],"s":[38,69],"o":[21,61]},{"id":"little1","a":[73,242],"s":[31,53],"o":[15,46]},{"id":"little2","a":[254,242],"s":[29,36],"o":[15,30]}],"back":[{"id":"palm","a":[0,0],"s":[146,248],"o":[260,-194]},{"id":"thumb0","a":[148,0],"s":[56,116],"o":[30,80]},{"id":"thumb1","a":[379,0],"s":[54,69],"o":[30,60]},{"id":"thumb2","a":[37,250],"s":[39,51],"o":[20,42]},{"id":"index0","a":[297,0],"s":[41,75],"o":[24,67]},{"id":"index1","a":[0,250],"s":[35,62],"o":[18,55]},{"id":"index2","a":[141,250],"s":[29,37],"o":[14,31]},{"id":"middle0","a":[206,0],"s":[47,84],"o":[23,76]},{"id":"middle1","a":[435,0],"s":[38,68],"o":[19,61]},{"id":"middle2","a":[172,250],"s":[25,37],"o":[12,31]},{"id":"ring0","a":[255,0],"s":[40,79],"o":[18,71]},{"id":"ring1","a":[475,0],"s":[34,64],"o":[18,58]},{"id":"ring2","a":[111,250],"s":[28,41],"o":[16,35]},{"id":"little0","a":[340,0],"s":[37,72],"o":[17,63]},{"id":"little1","a":[78,250],"s":[31,51],"o":[15,45]},{"id":"little2","a":[199,250],"s":[27,33],"o":[15,28]}],"chains":{"thumb":{"j0":[103.4,343.2],"phi":[-18.1,-14.04,-7.17],"len":[60.18,40.82,38.8]},"index":{"j0":[132,222.2],"phi":[-9.04,-5.71,-3.01],"len":[49.01,37.59,33.49]},"middle":{"j0":[168.96,217.8],"phi":[-2.38,-1.4,-0.73],"len":[58.35,45.11,34.76]},"ring":{"j0":[202.4,226.6],"phi":[1.74,0.93,0],"len":[50.62,40.71,36.3]},"little":{"j0":[239.8,247.5],"phi":[7.31,6.58,6.08],"len":[43.25,28.79,26.99]}},"stones":{"blue":["middle0",-2.19,-32.02],"pearl":["little0",4.92,-22.15]},"center":[185.9,297],"height":358.16,"size":[331.5,440]}, l: {"side":"left","atlas":[512,308],"palmAtlas":[512,314],"parts":[{"id":"palm","a":[0,0],"s":[157,240],"o":[-88,-198]},{"id":"thumb0","a":[159,0],"s":[59,128],"o":[33,88]},{"id":"thumb1","a":[427,0],"s":[57,71],"o":[32,61]},{"id":"thumb2","a":[181,242],"s":[37,47],"o":[21,39]},{"id":"index0","a":[264,0],"s":[40,91],"o":[21,82]},{"id":"index1","a":[0,242],"s":[36,66],"o":[19,59]},{"id":"index2","a":[220,242],"s":[34,44],"o":[18,37]},{"id":"middle0","a":[220,0],"s":[42,96],"o":[21,86]},{"id":"middle1","a":[387,0],"s":[38,77],"o":[18,70]},{"id":"middle2","a":[112,242],"s":[34,48],"o":[17,41]},{"id":"ring0","a":[306,0],"s":[43,84],"o":[22,75]},{"id":"ring1","a":[351,0],"s":[34,79],"o":[16,71]},{"id":"ring2","a":[148,242],"s":[31,48],"o":[16,41]},{"id":"little0","a":[38,242],"s":[38,65],"o":[16,57]},{"id":"little1","a":[78,242],"s":[32,60],"o":[13,52]},{"id":"little2","a":[256,242],"s":[30,41],"o":[14,34]}],"back":[{"id":"palm","a":[0,0],"s":[148,246],"o":[236,-198]},{"id":"thumb0","a":[150,0],"s":[53,128],"o":[27,87]},{"id":"thumb1","a":[400,0],"s":[50,74],"o":[25,60]},{"id":"thumb2","a":[73,248],"s":[37,46],"o":[15,38]},{"id":"index0","a":[252,0],"s":[39,90],"o":[14,83]},{"id":"index1","a":[452,0],"s":[33,67],"o":[15,60]},{"id":"index2","a":[167,248],"s":[27,37],"o":[15,31]},{"id":"middle0","a":[205,0],"s":[45,97],"o":[25,88]},{"id":"middle1","a":[366,0],"s":[32,77],"o":[14,70]},{"id":"middle2","a":[141,248],"s":[24,40],"o":[11,34]},{"id":"ring0","a":[293,0],"s":[39,87],"o":[21,79]},{"id":"ring1","a":[334,0],"s":[30,83],"o":[14,74]},{"id":"ring2","a":[112,248],"s":[27,41],"o":[12,35]},{"id":"little0","a":[0,248],"s":[39,66],"o":[22,58]},{"id":"little1","a":[41,248],"s":[30,56],"o":[16,50]},{"id":"little2","a":[196,248],"s":[27,36],"o":[13,30]}],"chains":{"thumb":{"j0":[233.2,352],"phi":[25.71,19.86,16.19],"len":[65.93,42.1,35.51]},"index":{"j0":[217.8,228.8],"phi":[9.13,6.01,3.62],"len":[62.39,42.03,34.83]},"middle":{"j0":[181.5,217.8],"phi":[-1.91,-1.22,-1.66],"len":[66.04,51.71,38.08]},"ring":{"j0":[143,233.2],"phi":[-7.97,-4.14,-2.65],"len":[55.54,51.84,38.1]},"little":{"j0":[105.6,246.4],"phi":[-13.24,-7.59,-3.27],"len":[38.42,33.29,30.85]}},"stones":{},"center":[161.7,297],"height":375.76,"size":[331.5,440]} };
  var IMG = { r: '/assets/img/hand-r.webp', l: '/assets/img/hand-l.webp' };
  var PALM = { r: '/assets/img/hand-r-palm.webp', l: '/assets/img/hand-l-palm.webp' };
  var PERS = 900;      // rig perspective, in rig units
  var TILT = -10;      // fingers lean slightly toward the viewer so bent fingers stay readable
  var FINGERS = ['little', 'ring', 'middle', 'index'];
  // Poses: fingers [spread, base, middle, tip]; thumb [swing, mid, tip, under]. Degrees, written for the
  // right hand; in-plane angles are mirrored for the left hand.
  var POSES = {
    open:    { index: [-3, -4, 0, 0], middle: [0, -4, 0, 0], ring: [3, -4, 0, 0], little: [6, -4, 0, 0], thumb: [-4, 0, 0, 0] },
    relaxed: { index: [3, 12, 16, 8], middle: [0, 16, 20, 10], ring: [-3, 20, 24, 12], little: [-6, 24, 26, 14], thumb: [10, 6, 8, 6] },
    point:   { index: [2, -2, 2, 0], middle: [-1, 72, 96, 40], ring: [-5, 78, 96, 40], little: [-9, 82, 96, 40], thumb: [24, 16, 20, 18] },
    pinch:   { index: [2, 18, 30, 16], middle: [0, 62, 88, 34], ring: [-4, 68, 90, 34], little: [-8, 72, 92, 34], thumb: [16, 30, 40, 0] },
    press:   { index: [2, 14, 6, 0], middle: [-1, 76, 98, 40], ring: [-5, 80, 98, 40], little: [-9, 84, 98, 40], thumb: [26, 16, 20, 18] },
    peace:   { index: [-7, -2, 0, 0], middle: [6, -2, 0, 0], ring: [-4, 82, 98, 40], little: [-8, 86, 98, 40], thumb: [28, 18, 22, 20] },
    write:   { index: [2, 26, 30, 18], middle: [0, 44, 62, 30], ring: [-4, 70, 92, 34], little: [-8, 74, 92, 34], thumb: [18, 28, 32, 6] },
    type:    { index: [2, 30, 42, 20], middle: [0, 32, 44, 20], ring: [-3, 34, 46, 22], little: [-6, 36, 48, 22], thumb: [12, 10, 12, 10] }
  };
  var ORDER = ['thumb2', 'thumb1', 'thumb0'];
  FINGERS.forEach(function (f) { ORDER.push(f + '2', f + '1', f + '0'); });
  ORDER.push('palm');
  var R = Math.PI / 180;
  var root = document.documentElement, darkMq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function isDark() { var t = root.getAttribute('data-theme'); return t ? t === 'dark' : !!(darkMq && darkMq.matches); }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function sound(kind) { if (window.__sfx) window.__sfx(kind); }

  // ---- tiny 3D math that mirrors the CSS transform lists exactly ----
  function apply(ops, p, C) {
    var x = p[0], y = p[1], z = 0;
    for (var i = ops.length - 1; i >= 0; i--) {
      var o = ops[i], c, s, t;
      if (o[0] === 't') { x += o[1]; y += o[2]; }
      else if (o[0] === 'z') { c = Math.cos(o[1] * R); s = Math.sin(o[1] * R); t = x * c - y * s; y = x * s + y * c; x = t; }
      else if (o[0] === 'x') { c = Math.cos(o[1] * R); s = Math.sin(o[1] * R); t = y * c - z * s; z = y * s + z * c; y = t; }
      else { c = Math.cos(o[1] * R); s = Math.sin(o[1] * R); t = x * c + z * s; z = -x * s + z * c; x = t; }
    }
    var k = PERS / (PERS - z);
    return [C[0] + (x - C[0]) * k, C[1] + (y - C[1]) * k];
  }
  var FN = { z: 'rotate(', x: 'rotateX(', y: 'rotateY(' };
  function css(ops) {
    var s = '';
    for (var i = 0; i < ops.length; i++) {
      var o = ops[i];
      s += o[0] === 't' ? 'translate(' + o[1].toFixed(2) + 'px,' + o[2].toFixed(2) + 'px) ' : FN[o[0]] + o[1].toFixed(2) + 'deg) ';
    }
    return s;
  }

  var api = { ready: false, load: load, create: create, poses: POSES };
  var loading = null, palmLoading = null, palmReady = false, palmWaiters = [];
  function img(src) { return new Promise(function (res) { var i = new Image(); i.onload = function () { (i.decode ? i.decode() : Promise.resolve()).then(function () { res(true); }, function () { res(true); }); }; i.onerror = function () { res(false); }; i.src = src; }); }
  function load() {
    if (loading) return loading;
    loading = Promise.all([img(IMG.r), img(IMG.l)]).then(function (ok) {
      api.ready = ok[0] && ok[1];
      // the palm side is only needed once a hand turns or curls: fetch it after the backs
      palmLoading = Promise.all([img(PALM.r), img(PALM.l)]).then(function () { palmReady = true; palmWaiters.forEach(function (f) { f(); }); });
      return api.ready;
    });
    return loading;
  }

  function partEl(rig, p, cls, src, atlas) {
    var e = document.createElement('i');
    e.className = cls;
    e.style.width = p.s[0] + 'px';
    e.style.height = p.s[1] + 'px';
    var pos = (-p.a[0]) + 'px ' + (-p.a[1]) + 'px', size = atlas[0] + 'px ' + atlas[1] + 'px', url = 'url(' + src + ')';
    if (cls !== 'rh__s') {
      e.style.backgroundPosition = '0 0, ' + pos; e.style.backgroundSize = '100% 100%, ' + size;
      e.style.backgroundImage = 'linear-gradient(var(--shc), var(--shc)), ' + url;
    }
    e.style.webkitMaskImage = url; e.style.maskImage = url;
    e.style.webkitMaskPosition = pos; e.style.maskPosition = pos;
    e.style.webkitMaskSize = size; e.style.maskSize = size;
    return e;
  }

  var hands = [], raf = 0, last = 0;
  // phones and low-core devices: 30 frames a second is plenty for a hand, and halves the work
  var lowEnd = window.innerWidth <= 760 || (navigator.hardwareConcurrency || 8) <= 4;
  function tick(now) {
    if (lowEnd && last && now - last < 30) { raf = requestAnimationFrame(tick); return; }
    var dt = Math.min(48, now - (last || now)); last = now;
    var busy = false;
    for (var i = 0; i < hands.length; i++) {
      if (!hands[i].el.isConnected) { hands.splice(i--, 1); continue; }
      if (hands[i].update(now, dt)) busy = true;
    }
    raf = busy ? requestAnimationFrame(tick) : 0;
    if (!raf) last = 0;
  }
  function wake() { if (!raf) raf = requestAnimationFrame(tick); }

  // tone "design" = my right hand, "code" = my left hand
  function create(layer, label, tone, opts) {
    opts = opts || {};
    var key = tone === 'code' ? 'l' : 'r', rig = RIGS[key], S = key === 'r' ? 1 : -1;
    var PART = {}, BACK = {};
    rig.parts.forEach(function (p) { PART[p.id] = p; });
    rig.back.forEach(function (p) { BACK[p.id] = p; });
    var C = rig.center;
    var el = document.createElement('div');
    el.className = 'hand rhand hand--' + tone + (S < 0 ? ' rhand--left' : '');
    el.style.transition = 'opacity .25s ease';
    var wrap = document.createElement('div'); wrap.className = 'rh';
    // the shadow is a CSS drop-shadow on the whole rig: re-drawn only when the fingers change, not every frame
    var rg = document.createElement('div'); rg.className = 'rh__rig';
    rg.style.width = rig.size[0] + 'px'; rg.style.height = rig.size[1] + 'px'; rg.style.perspectiveOrigin = C[0] + 'px ' + C[1] + 'px';
    var lab = document.createElement('span'); lab.className = 'hand__label'; lab.setAttribute('data-t', label || '');
    var els = {}, bks = {};
    ORDER.forEach(function (id) {
      bks[id] = partEl(rig, BACK[id], 'rh__b', PALM[key], rig.palmAtlas); rg.appendChild(bks[id]);
      els[id] = partEl(rig, PART[id], 'rh__p', IMG[key], rig.atlas); rg.appendChild(els[id]);
    });
    if (!palmReady) { rg.classList.add('no-palm'); palmWaiters.push(function () { rg.classList.remove('no-palm'); }); }
    // glints that catch the light on the two stones
    var glints = [];
    Object.keys(rig.stones || {}).forEach(function (k) {
      var st = rig.stones[k], p = PART[st[0]], g = document.createElement('b');
      g.className = 'rh__glint rh__glint--' + k;
      g.style.left = (p.o[0] + st[1]) + 'px'; g.style.top = (p.o[1] + st[2]) + 'px';
      els[st[0]].appendChild(g); glints.push(g);
    });
    wrap.appendChild(rg);
    el.appendChild(wrap); el.appendChild(lab);
    layer.appendChild(el);

    // springs for every angle (+ the whole-hand turn)
    var ang = {}, vel = {}, tgt = {};
    Object.keys(POSES.open).forEach(function (f) { ang[f] = POSES.relaxed[f].slice(); vel[f] = [0, 0, 0, 0]; tgt[f] = POSES.relaxed[f].slice(); });
    var flip = 0, flipV = 0, flipT = 0;
    var pos = [-600, -600], from = [-600, -600], to = [-600, -600], t0 = 0, dur = 0, arc = 0, moving = false, autoPoint = false, path = null, pathDone = null;
    var pv = [0, 0], lean = [0, 0], lift = 0, liftT = 0, waveUntil = 0, posing = true, hidden = true, gripping = false, pokeUntil = 0, dirty = true;
    var ant = 0, ov = 0, lastBusy = 0, idleGap = 2000, trail = 0;
    var hot = [0, 0], baseTilt = opts.tilt == null ? -15 : opts.tilt;
    var small = window.innerWidth <= 760;
    var scale = (opts.size || (small ? 104 : 142)) / rig.height;

    function pose(name) { var P = POSES[name]; Object.keys(P).forEach(function (f) { tgt[f] = P[f].slice(); }); posing = true; wake(); }
    function move(x, y, ms) {
      path = null;
      if (hidden || ms <= 0) { from = [x + 90 * S, y + 140]; pos = from.slice(); if (ms <= 0) { pos = [x, y]; from = pos.slice(); } }
      else from = pos.slice();
      to = [x, y]; t0 = performance.now(); dur = Math.max(1, ms); moving = ms > 0;
      var d = Math.hypot(to[0] - from[0], to[1] - from[1]);
      arc = Math.min(46, d * 0.12) * S;
      ant = d > 140 ? 1 : 0; ov = gripping ? 0.012 : 0.035;
      if (!gripping && d > 60) { pose('relaxed'); autoPoint = true; }
      if (d > 260 && ms > 160) sound('whoosh');
      dirty = true;
      wake();
    }
    // follow a list of points (handwriting); resolves when the last point is reached
    function follow(pts, ms, onp) {
      return new Promise(function (res) {
        var lens = [0];
        for (var i = 1; i < pts.length; i++) lens.push(lens[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
        path = { pts: pts, lens: lens, total: lens[lens.length - 1] || 1, t0: performance.now(), ms: ms, onp: onp };
        pathDone = res; moving = false; autoPoint = false; pose('write'); dirty = true; wake();
      });
    }
    function grip(on) {
      gripping = on;
      el.classList.toggle('is-grab', on);
      liftT = on ? 1 : 0;
      if (on) pose('pinch');
      else { pose('open'); setTimeout(function () { if (!gripping) pose('point'); }, 150); }
    }
    function press() { pose('press'); sound('tap'); pokeUntil = performance.now() + 220; setTimeout(function () { pose('point'); }, 220); wake(); }
    // turn the palm to the viewer and wave
    function wave(ms) { ms = ms || 1000; pose('open'); flipT = 180; waveUntil = performance.now() + ms; setTimeout(function () { flipT = 0; }, ms - 260); wake(); }
    // one finger taps (typing)
    var TAPS = ['little', 'ring', 'middle', 'index'];
    function tap(finger) {
      var f = finger || TAPS[(Math.random() * 4) | 0];
      if (f === 'thumb') vel.thumb[3] += 420; else { vel[f][1] += 520; vel[f][2] += 380; }
      posing = true; wake();
    }

    function update(now, dt) {
      var gone = el.classList.contains('is-gone');
      hidden = gone;
      var s = dt / 1000, active = false;
      var px = pos[0], py = pos[1];
      if (path) {
        var tp = Math.min(1, (now - path.t0) / path.ms), e = tp < 0.5 ? 2 * tp * tp : 1 - Math.pow(-2 * tp + 2, 2) / 2;
        var want = path.total * (0.15 * tp + 0.85 * e), j = 1;
        while (j < path.lens.length - 1 && path.lens[j] < want) j++;
        var segL = path.lens[j] - path.lens[j - 1] || 1, f = (want - path.lens[j - 1]) / segL, a0 = path.pts[j - 1], a1 = path.pts[j];
        pos = [a0[0] + (a1[0] - a0[0]) * f, a0[1] + (a1[1] - a0[1]) * f];
        if (path.onp) path.onp(Math.min(1, want / path.total));
        active = true;
        if (tp >= 1) { var done = pathDone; path = null; pathDone = null; if (done) done(); }
      } else if (moving) {
        // minimum-jerk profile along a gentle arc, like a real arm
        var t = Math.min(1, (now - t0) / dur), m = t * t * t * (10 - 15 * t + 6 * t * t);
        // a little wind-up before a long reach, and a small overshoot that settles back, like a real arm
        if (ant) { if (t < 0.16) m -= 0.025 * Math.sin(Math.PI * t / 0.16); else if (t > 0.6) m += ov * Math.sin(Math.PI * (t - 0.6) / 0.4); }
        var dx = to[0] - from[0], dy = to[1] - from[1], d = Math.hypot(dx, dy) || 1, b = Math.sin(Math.PI * m) * arc;
        pos = [from[0] + dx * m - dy / d * b, from[1] + dy * m + dx / d * b];
        if (autoPoint && t > 0.62) { autoPoint = false; if (!gripping) pose('point'); }
        if (t >= 1) moving = false;
        active = true;
      }
      if (dt > 0) { pv[0] += ((pos[0] - px) / dt - pv[0]) * 0.35; pv[1] += ((pos[1] - py) / dt - pv[1]) * 0.35; }
      // lean into the motion, lift while holding something
      var lt0 = Math.max(-18, Math.min(18, pv[0] * 16)), lt1 = Math.max(-14, Math.min(14, -pv[1] * 12));
      lean[0] += (lt1 - lean[0]) * Math.min(1, dt / 110); lean[1] += (lt0 - lean[1]) * Math.min(1, dt / 110);
      lift += (liftT - lift) * Math.min(1, dt / 120);
      if (Math.abs(lean[0]) + Math.abs(lean[1]) > 0.05 || Math.abs(liftT - lift) > 0.01 || Math.abs(pv[0]) + Math.abs(pv[1]) > 0.002) active = true;
      // finger springs (slightly under-damped: a touch of natural overshoot)
      if (posing) {
        var still = true;
        Object.keys(ang).forEach(function (fi) {
          for (var i = 0; i < 4; i++) {
            var acc = -260 * (ang[fi][i] - tgt[fi][i]) - 22 * vel[fi][i];
            vel[fi][i] += acc * s; ang[fi][i] += vel[fi][i] * s;
            if (Math.abs(vel[fi][i]) > 0.5 || Math.abs(ang[fi][i] - tgt[fi][i]) > 0.2) still = false;
          }
        });
        if (still) posing = false; else active = true;
      }
      if (Math.abs(flip - flipT) > 0.3 || Math.abs(flipV) > 0.5) {
        flipV += (-90 * (flip - flipT) - 15 * flipV) * s; flip += flipV * s; active = true;
      } else { flip = flipT; flipV = 0; }
      var waving = now < waveUntil;
      if (waving) active = true;
      if (gone && !moving && !path) return false;
      if (active || posing || moving || path) lastBusy = now;
      else if (now - lastBusy > idleGap) {
        // a waiting hand is never perfectly still: one finger twitches now and then
        var ff = ['index', 'middle', 'ring', 'little'][(Math.random() * 4) | 0];
        vel[ff][1] += 110 + Math.random() * 90; posing = true; lastBusy = now; idleGap = 1600 + Math.random() * 2600;
      }
      if (posing || waving || active || dirty) {
        // fingers only when their angles (or the turn) actually change; position every frame
        trail += (Math.max(-6, Math.min(8, pv[1] * 7)) - trail) * 0.2;
        if (posing || rigDirty || Math.abs(flip - lastFlip) > 0.05 || Math.abs(trail - lastTrail) > 0.4) renderRig();
        render(now, waving); dirty = false;
      }
      return active || posing || moving || !!path || !gone;
    }

    var PRE = [];
    function chainOps(name, a, k) {
      var ch = rig.chains[name], ops = PRE.concat([['t', ch.j0[0], ch.j0[1]]]);
      var thumb = name === 'thumb';
      ops.push(['z', ch.phi[0] + a[0] * S], ['x', thumb ? a[3] : a[1]]);
      if (k >= 1) ops.push(['t', 0, -ch.len[0]], ['z', ch.phi[1] - ch.phi[0] + (thumb ? a[1] * S : 0)], ['x', thumb ? a[3] * 0.4 : a[2]]);
      if (k >= 2) ops.push(['t', 0, -ch.len[1]], ['z', ch.phi[2] - ch.phi[1] + (thumb ? a[2] * S : 0)], ['x', thumb ? a[3] * 0.3 : a[3]]);
      return ops;
    }
    function tipOf(name, a) { var ch = rig.chains[name]; return apply(chainOps(name, a, 2), [0, -ch.len[2] + 3], C); }
    var lastSh = {}, lastDark = null, lastVis = {}, rigDirty = true, lastFlip = 0, lastTrail = 0;
    function setSh(e, id, v) { v = Math.round(v * 50) / 50; if (lastSh[id] !== v) { e.style.setProperty('--sh', v); lastSh[id] = v; } }
    // a side that faces away is hidden and skipped (no transform work for it)
    function shown(e, id, on) { if (lastVis[id] !== on) { e.style.visibility = on ? '' : 'hidden'; lastVis[id] = on; } return on; }
    function renderRig() {
      rigDirty = false; lastFlip = flip; lastTrail = trail;
      PRE = [['t', C[0], C[1]], ['y', flip * S], ['x', TILT], ['t', -C[0], -C[1]]];
      var cf = Math.cos(flip * R);
      if (shown(els.palm, 'palm', cf > -0.2)) { els.palm.style.transform = css(PRE.concat([['t', -PART.palm.o[0], -PART.palm.o[1]]])); setSh(els.palm, 'palm', Math.max(0, Math.min(0.62, (1 - Math.max(0, cf)) * 0.8))); }
      if (shown(bks.palm, 'palmB', cf < 0.2)) { bks.palm.style.transform = css(PRE.concat([['y', 180], ['t', -BACK.palm.o[0], -BACK.palm.o[1]]])); setSh(bks.palm, 'palmB', Math.max(0, Math.min(0.62, (1 - Math.max(0, -cf)) * 0.8))); }
      FINGERS.concat(['thumb']).forEach(function (f) {
        var a = f === 'thumb' ? ang[f] : [ang[f][0], ang[f][1] + trail, ang[f][2] + trail * 0.6, ang[f][3]], acc = TILT;
        for (var k = 0; k < 3; k++) {
          var id = f + k, base = chainOps(f, a, k);
          acc += f === 'thumb' ? a[3] * (k ? 0.4 : 1) : a[k + 1];
          var facing = Math.cos(acc * R) * cf;
          if (shown(els[id], id, facing > -0.2)) {
            els[id].style.transform = css(base.concat([['t', -PART[id].o[0], -PART[id].o[1]]]));
            setSh(els[id], id, Math.max(0, Math.min(0.62, (1 - Math.max(0, facing)) * 0.8)));
          }
          if (shown(bks[id], id + 'B', facing < 0.2)) {
            bks[id].style.transform = css(base.concat([['y', 180], ['t', -BACK[id].o[0], -BACK[id].o[1]]]));
            setSh(bks[id], id + 'B', Math.max(0, Math.min(0.62, (1 - Math.max(0, -facing)) * 0.7)));
          }
        }
      });
      // the fingertip (or the pinch point) is the hotspot that lands on the target; frozen while the hand turns
      if (Math.abs(flip) < 1) {
        var it = tipOf('index', ang.index), tt = tipOf('thumb', ang.thumb), g = Math.max(0, Math.min(1, (ang.index[1] - 4) / 26));
        hot = [it[0] + (tt[0] - it[0]) * g * 0.5, it[1] + (tt[1] - it[1]) * g * 0.5];
      }
    }
    function render(now, waving) {
      var sway = Math.sin(now / 760) * 0.8 + (waving ? Math.sin(now / 90) * 16 : 0);
      var k2 = scale * (1 + 0.05 * lift) * (now < pokeUntil ? 0.96 : 1);
      var vx = pos[0] - (window.scrollX || 0), edge = S > 0 ? vx < 120 : vx > window.innerWidth - 120;
      if (edge !== el._edge) { el._edge = edge; el.classList.toggle('rh-lab-flip', edge); }
      el.style.transform = 'translate(' + pos[0].toFixed(1) + 'px,' + pos[1].toFixed(1) + 'px)';
      wrap.style.transform = 'perspective(1000px) rotateX(' + lean[0].toFixed(2) + 'deg) rotateY(' + lean[1].toFixed(2) + 'deg) rotate(' + ((baseTilt + sway) * S).toFixed(2) + 'deg) scale(' + k2.toFixed(4) + ') translate(' + (-hot[0]).toFixed(1) + 'px,' + (-hot[1]).toFixed(1) + 'px)';
      // daylight: a soft drop shadow; dark theme: a warm rim light instead (both in CSS)
      var dark = isDark();
      if (dark !== lastDark) { lastDark = dark; el.classList.toggle('rhand--rim', dark); }
      var gl = Math.min(1, 0.25 + Math.hypot(pv[0], pv[1]) * 0.9 + Math.abs(Math.sin(now / 900)) * 0.15);
      glints.forEach(function (gEl) { gEl.style.opacity = gl.toFixed(2); });
    }
    pose(opts.pose || 'relaxed');
    var h = { el: el, move: move, follow: follow, grip: grip, pose: pose, press: press, wave: wave, tap: tap, update: update, side: key };
    el._hand = h;
    hands.push(h);
    renderRig();
    render(performance.now(), false);
    return h;
  }
  api.reduced = reduce;
  window.RealHand = api;
  if (root.classList.contains('build-on')) load();
})();
