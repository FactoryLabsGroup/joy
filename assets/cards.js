/* Joy: the cards, as the app makes them.
   Ported from joy-ios: the games and their hues (GameID.swift), the card material
   (CardSurface, HoloFoil, CardBack, Emblem), the lean towards the hand (TiltSensor),
   and every game's living illustration, drawn in code (GameArtwork.swift). */
(function () {
  'use strict';

  var root = document.documentElement;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TAU = Math.PI * 2;
  var WHITE = '#FFFFFF';

  // ---------------------------------------------------------------------------
  // The deck, in the app's order. Each game owns a Hue: a deep gradient for the
  // cards it owns and a lifted glow for its small accents on the canvas.
  // ---------------------------------------------------------------------------
  var GAMES = [
    { id: 'truthOrDare', top: '#A21CAF', bottom: '#3B0764', glow: '#E879F9', symbol: 'flame', min: 2, intensity: true },
    { id: 'alias', top: '#0369A1', bottom: '#082F49', glow: '#38BDF8', symbol: 'text.bubble', min: 2 },
    { id: 'bomb', top: '#EA580C', bottom: '#431407', glow: '#FDBA74', symbol: 'burst', min: 2 },
    { id: 'neverHaveIEver', top: '#0F766E', bottom: '#042F2E', glow: '#2DD4BF', symbol: 'hand.raised', min: 2, intensity: true },
    { id: 'wouldYouRather', top: '#4338CA', bottom: '#1E1B4B', glow: '#818CF8', symbol: 'square.split.2x1', min: 2, intensity: true },
    { id: 'mostLikelyTo', top: '#B45309', bottom: '#451A03', glow: '#FBBF24', symbol: 'hand.point.right', min: 3, intensity: true },
    { id: 'hotSeat', top: '#B91C1C', bottom: '#450A0A', glow: '#F87171', symbol: 'chair', min: 3, intensity: true },
    { id: 'spy', top: '#475569', bottom: '#0B1220', glow: '#CBD5E1', symbol: 'eye', min: 3 }
  ];
  var byId = {};
  GAMES.forEach(function (g, i) { g.index = i; byId[g.id] = g; });

  // The players' tints (PlayerTint in Player.swift).
  var TINTS = {
    ruby: { top: '#E11D48', bottom: '#881337', glow: '#FB7185' },
    amber: { top: '#D97706', bottom: '#78350F', glow: '#FBBF24' },
    jade: { top: '#059669', bottom: '#064E3B', glow: '#34D399' },
    lagoon: { top: '#0891B2', bottom: '#164E63', glow: '#22D3EE' },
    azure: { top: '#2563EB', bottom: '#1E3A8A', glow: '#60A5FA' },
    iris: { top: '#7C3AED', bottom: '#4C1D95', glow: '#A78BFA' },
    orchid: { top: '#C026D3', bottom: '#701A75', glow: '#E879F9' },
    slate: { top: '#64748B', bottom: '#1E293B', glow: '#CBD5E1' }
  };

  // ---------------------------------------------------------------------------
  // Colour
  // ---------------------------------------------------------------------------
  var rgbCache = {};
  function rgb(hex) {
    var c = rgbCache[hex];
    if (!c) {
      var n = parseInt(hex.slice(1), 16);
      c = rgbCache[hex] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    return c;
  }
  function rgba(hex, a) {
    var c = rgb(hex);
    return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (a < 0 ? 0 : a > 1 ? 1 : +a.toFixed(4)) + ')';
  }
  /** The CSS custom properties a card in this hue wears. */
  function hueStyle(h) {
    return '--top:' + h.top + ';--bottom:' + h.bottom + ';--glow:' + h.glow + ';--shade:' + rgba(h.bottom, 0.7) + ';--glow55:' + rgba(h.glow, 0.55);
  }

  // ---------------------------------------------------------------------------
  // A damped spring, the way SwiftUI's .spring(response:dampingFraction:) moves.
  // ---------------------------------------------------------------------------
  function spring(opts) {
    var x = opts.from, v = opts.velocity || 0, to = opts.to;
    var k = Math.pow(TAU / (opts.response || 0.5), 2);
    var c = 2 * (opts.damping == null ? 0.82 : opts.damping) * Math.sqrt(k);
    var last = null, raf = 0, done = false;
    if (still) { opts.update(to); if (opts.done) opts.done(); return { stop: function () {} }; }
    function step(now) {
      if (done) return;
      // Real time, so a dropped frame never slows the motion down; small sub-steps keep it stable.
      var dt = last == null ? 1 / 60 : Math.min((now - last) / 1000, 0.1);
      last = now;
      var steps = Math.max(1, Math.ceil(dt * 240)), h = dt / steps;
      for (var i = 0; i < steps; i++) {
        var a = -k * (x - to) - c * v;
        v += a * h;
        x += v * h;
      }
      if (Math.abs(x - to) < (opts.epsilon || 0.001) && Math.abs(v) < (opts.epsilon || 0.001) * 10) {
        x = to; done = true;
        opts.update(x);
        if (opts.done) opts.done();
        return;
      }
      opts.update(x);
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return { stop: function () { done = true; cancelAnimationFrame(raf); } };
  }

  // ---------------------------------------------------------------------------
  // Tilt (TiltSensor): how far the hand leans, -1…1 each way. A mouse stands in
  // for the phone on a desk; a phone that reports its orientation without asking
  // is followed for real, relative to how it was first held. The foil sways on
  // its own when nothing leans, as it does in the simulator.
  // ---------------------------------------------------------------------------
  var tilt = { x: 0, y: 0, tx: 0, ty: 0, fx: 0, fy: 0, source: 'auto', ref: null };
  function clamp(v) { return v < -1 ? -1 : v > 1 ? 1 : v; }
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    tilt.source = 'pointer';
    tilt.tx = clamp((e.clientX / window.innerWidth) * 2 - 1);
    tilt.ty = clamp((e.clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });
  document.addEventListener('mouseleave', function () { tilt.tx = 0; tilt.ty = 0; });
  window.addEventListener('deviceorientation', function (e) {
    if (e.gamma == null || e.beta == null) return;
    if (!tilt.ref) { tilt.ref = { g: e.gamma, b: e.beta }; return; }
    tilt.source = 'device';
    // 0.5 rad of roll or pitch is a full lean, as in the app.
    tilt.tx = clamp((e.gamma - tilt.ref.g) / 28.6);
    tilt.ty = clamp((e.beta - tilt.ref.b) / 28.6);
  }, { passive: true });

  // ---------------------------------------------------------------------------
  // One clock for everything that moves: the lean, the foil, the artwork, and
  // whatever else asks to be called each frame.
  // ---------------------------------------------------------------------------
  var listeners = [];
  var arts = [];
  var lastPaint = 0;
  var written = { fx: null, fy: null, tx: null, ty: null };
  function writeVar(name, value) {
    var v = value.toFixed(3);
    if (written[name] === v) return;
    written[name] = v;
    root.style.setProperty('--' + name, v);
  }
  function frame(now) {
    var t = now / 1000;
    if (!still) {
      var leaning = tilt.source !== 'auto';
      if (leaning) {
        tilt.x += (tilt.tx - tilt.x) * 0.12;
        tilt.y += (tilt.ty - tilt.y) * 0.12;
        tilt.fx = tilt.x; tilt.fy = tilt.y;
      } else {
        tilt.fx = Math.sin(t * 0.45) * 0.8;
        tilt.fy = Math.cos(t * 0.31) * 0.4;
      }
      writeVar('fx', tilt.fx); writeVar('fy', tilt.fy);
      writeVar('tx', leaning ? tilt.x : 0); writeVar('ty', leaning ? tilt.y : 0);

      // The artwork plays at 30 fps, like the app's TimelineView.
      if (now - lastPaint > 31) {
        lastPaint = now;
        for (var i = 0; i < arts.length; i++) {
          var a = arts[i];
          if (a.visible && a.animated) paint(a, t);
        }
      }
    }
    for (var j = 0; j < listeners.length; j++) listeners[j](t, now);
    requestAnimationFrame(frame);
  }
  if (still) { writeVar('fx', -0.35); writeVar('fy', -0.2); writeVar('tx', 0); writeVar('ty', 0); }
  requestAnimationFrame(frame);

  // ---------------------------------------------------------------------------
  // The print grain: a fixed speckle, made once and tiled under every card.
  // ---------------------------------------------------------------------------
  (function grain() {
    try {
      var size = 128, c = document.createElement('canvas');
      c.width = c.height = size * 2;
      var g = c.getContext('2d');
      var seed = 7;
      function rand() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
      var count = Math.round(size * size / 90) * 4;
      for (var i = 0; i < count; i++) {
        var light = rand() > 0.5, alpha = 0.15 + rand() * 0.4;
        g.fillStyle = light ? 'rgba(255,255,255,' + alpha + ')' : 'rgba(0,0,0,' + alpha + ')';
        g.fillRect(Math.floor(rand() * size * 2), Math.floor(rand() * size * 2), 2, 2);
      }
      root.style.setProperty('--grain', 'url(' + c.toDataURL('image/png') + ')');
    } catch (e) {}
  })();

  // ---------------------------------------------------------------------------
  // The material's layers, under whatever a card carries: a drifting inner glow,
  // the grain, an inset frame, the holographic foil, and a light-catching edge.
  // ---------------------------------------------------------------------------
  function layers(opts) {
    opts = opts || {};
    return '<i class="m m--glow" aria-hidden="true"></i>' +
      '<i class="m m--grain" aria-hidden="true"></i>' +
      (opts.frame === false ? '' : '<i class="m m--frame" aria-hidden="true"></i>') +
      '<i class="m m--foil" aria-hidden="true"><i></i></i>' +
      '<i class="m m--edge" aria-hidden="true"></i>';
  }

  // ---------------------------------------------------------------------------
  // Symbols, drawn for the web in the spirit of the SF Symbols the app uses.
  // Strokes keep their weight at any size, so a watermark stays ultralight.
  // ---------------------------------------------------------------------------
  var ICONS = {
    'flame': '<path d="M12 3c2.6 2.4 6 6.3 6 10.6 0 3.8-2.7 6.9-6 6.9s-6-3.1-6-6.6c0-2.7 1.4-4.6 2.6-5.9.1 2.2 1 3.6 2.3 4.2-.5-3.6.1-6.6 1.1-9.2Z"/><path d="M12 20.5c-1.6 0-2.6-1.3-2.6-2.8 0-1.7 1.4-2.9 2.6-4.1 1.2 1.2 2.6 2.4 2.6 4.1 0 1.5-1 2.8-2.6 2.8Z"/>',
    'hand.raised': '<path d="M8 13V6a1.25 1.25 0 0 1 2.5 0v5M10.5 11V4.6a1.25 1.25 0 0 1 2.5 0V11M13 11V5.6a1.25 1.25 0 0 1 2.5 0V12M15.5 12V8a1.25 1.25 0 0 1 2.5 0v6.2c0 4-2.4 6.6-5.8 6.6-2.2 0-3.5-.8-4.6-2.4l-2.7-4c-.5-.8-.3-1.7.4-2.1.7-.4 1.5-.2 2 .5L8 14.4"/>',
    'square.split.2x1': '<rect x="3.5" y="5.5" width="17" height="13" rx="3"/><path d="M12 5.5v13"/>',
    'hand.point.right': '<path d="M20 10.6h-6.3l.4-.5c.5-.6.4-1.5-.2-1.9-.5-.4-1.3-.3-1.8.2l-2.8 2.9C8.5 12.1 8 13.2 8 14.4v1.3c0 2 1.6 3.6 3.6 3.6h2.8a1.15 1.15 0 0 0 0-2.3 1.2 1.2 0 0 0 0-2.4 1.25 1.25 0 0 0 0-2.5H20a1.25 1.25 0 0 0 0-2.5Z"/><path d="M4 12.2h2.2v6.2H4"/>',
    'chair': '<path d="M7.6 3.5h8.8a1 1 0 0 1 1 1V12H6.6V4.5a1 1 0 0 1 1-1Z"/><path d="M5.5 12h13v2.5h-13zM7 14.5v6M17 14.5v6"/>',
    'text.bubble': '<path d="M4 6.6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-6.3L7 19.5v-3.9a3 3 0 0 1-3-3Z"/><path d="M8 8.2h8M8 11.2h5"/>',
    'burst': '<path d="M12 2.8l1.9 4.6 4.6-1.9-1.9 4.6 4.6 1.9-4.6 1.9 1.9 4.6-4.6-1.9-1.9 4.6-1.9-4.6-4.6 1.9 1.9-4.6-4.6-1.9 4.6-1.9-1.9-4.6 4.6 1.9Z"/>',
    'eye': '<path d="M2.5 12C5 7.6 8.3 5.5 12 5.5s7 2.1 9.5 6.5c-2.5 4.4-5.8 6.5-9.5 6.5S5 16.4 2.5 12Z"/><circle cx="12" cy="12" r="3.2"/>',
    'trophy': '<path d="M7.5 4h9v5.5a4.5 4.5 0 0 1-9 0Z"/><path d="M7.5 6H5.2a2.2 2.2 0 0 0 2.6 3.9M16.5 6h2.3a2.2 2.2 0 0 1-2.6 3.9M12 14v3M8.5 20.5h7M9.5 17h5v3.5h-5z"/>',
    'questionmark': '<path d="M8.8 8.7a3.2 3.2 0 1 1 4.5 2.9c-.8.4-1.3 1-1.3 1.9v.9"/><circle cx="12" cy="17.8" r=".4"/>',
    'bolt': '<path d="M13.2 2.8 5.8 13.4h6l-1 7.8 7.4-10.6h-6Z"/>',
    'arrow.right': '<path d="M5 12h14M13.5 6.5 19 12l-5.5 5.5"/>',
    'chevron.left': '<path d="m14.5 5.5-6.5 6.5 6.5 6.5"/>',
    'chevron.right': '<path d="m9.5 5.5 6.5 6.5-6.5 6.5"/>',
    'shuffle': '<path d="M3.5 7.5h2.8c3.6 0 4.6 9 8.6 9h5M17.4 13.9l2.5 2.6-2.5 2.6M3.5 16.5h2.8c1.3 0 2.2-1.2 3-2.9M12.9 10c.6-1.4 1.5-2.5 2.6-2.5h4.4M17.4 4.9l2.5 2.6-2.5 2.6"/>',
    'arrow.counterclockwise': '<path d="M4.5 12a7.5 7.5 0 1 0 2.4-5.5"/><path d="M6.4 2.9v4.2h4.2"/>',
    'iphone': '<rect x="6.75" y="2.5" width="10.5" height="19" rx="2.6"/><path d="M10.6 4.9h2.8"/>',
    'cards': '<rect x="9" y="5.5" width="10" height="14" rx="2.2" transform="rotate(12 14 12.5)"/><rect x="5" y="4.5" width="10" height="14" rx="2.2"/>',
    'xmark': '<path d="m6 6 12 12M18 6 6 18"/>',
    'lock': '<rect x="5" y="10.5" width="14" height="10" rx="2.6"/><path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5"/>',
    'airplane': '<path transform="rotate(45 12 12)" d="M12 2.8c.9 0 1.5 1 1.5 2.2v4.4l7 4.2v1.9l-7-2.1v4.1l2 1.6v1.6L12 20l-3.5.9v-1.6l2-1.6v-4.1l-7 2.1v-1.9l7-4.2V5c0-1.2.6-2.2 1.5-2.2Z"/>',
    'checkmark.shield': '<path d="M12 3.2 5.2 5.9v5.3c0 4.2 2.8 7.7 6.8 9.1 4-1.4 6.8-4.9 6.8-9.1V5.9Z"/><path d="m8.9 12.1 2.2 2.2 4-4.3"/>',
    'eye.slash': '<path d="M2.5 12C5 7.6 8.3 5.5 12 5.5c1.6 0 3.1.4 4.5 1.2M21.5 12c-2.5 4.4-5.8 6.5-9.5 6.5-1.6 0-3.1-.4-4.5-1.2"/><path d="M9.7 14.3a3.2 3.2 0 0 1 4.6-4.6M4 20 20 4"/>',
    'plus': '<path d="M12 5v14M5 12h14"/>'
  };
  var FILLED = {
    'person.2.fill': '<circle cx="9" cy="7.8" r="3.2"/><path d="M2.6 19.3c0-3.5 2.9-5.9 6.4-5.9s6.4 2.4 6.4 5.9c0 .5-.4.7-.8.7H3.4c-.4 0-.8-.2-.8-.7Z"/><circle cx="16.6" cy="8.6" r="2.6"/><path d="M15.7 13.6c3.3-.4 5.8 1.8 5.8 5 0 .4-.3.7-.7.7h-3.6c.1-2.1-.4-4.1-1.5-5.7Z"/>',
    'bolt.fill': '<path d="M13.2 2.8 5.8 13.4h6l-1 7.8 7.4-10.6h-6Z"/>'
  };
  function icon(name, cls) {
    if (FILLED[name]) return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">' + FILLED[name] + '</svg>';
    var body = ICONS[name] || '';
    return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
      body.replace(/<(path|rect|circle)/g, '<$1 vector-effect="non-scaling-stroke"') + '</svg>';
  }

  /** The game's symbol set in a double ring, used on card backs. */
  function emblem(symbol, cls) {
    return '<span class="emblem ' + (cls || '') + '" aria-hidden="true">' + icon(symbol) + '</span>';
  }

  /** Engraved line-work: ellipses turned round a common centre, like a banknote. */
  var rosettes = {};
  function rosette(w, h) {
    var key = w + 'x' + h;
    if (rosettes[key]) return rosettes[key];
    var cx = w / 2, cy = h / 2, longest = Math.max(w, h), out = '';
    for (var ring = 0; ring < 3; ring++) {
      var rx = longest * (0.30 + 0.16 * ring), ry = rx * 0.42, petals = 18 + ring * 6;
      var op = (1 - ring * 0.25).toFixed(2);
      for (var i = 0; i < petals; i++) {
        var deg = (i / petals * 180).toFixed(2);
        out += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx.toFixed(1) + '" ry="' + ry.toFixed(1) + '" transform="rotate(' + deg + ' ' + cx + ' ' + cy + ')" stroke-opacity="' + op + '"/>';
      }
    }
    rosettes[key] = '<svg class="rosette" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="none" stroke="currentColor" stroke-width=".6">' + out + '</svg>';
    return rosettes[key];
  }

  /** A sprig of laurel, leaves along a curving stem, for the winner's card. */
  var laurels = {};
  function laurel(side) {
    if (laurels[side]) return laurels[side];
    // A quadratic stem from the foot of the sprig up and out, leaves either side of it.
    var p0 = [30, 92], p1 = [4, 62], p2 = [22, 8];
    function at(t) {
      var u = 1 - t;
      return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]];
    }
    function tangent(t) {
      return [2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]), 2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1])];
    }
    var leaves = '';
    var steps = [0.16, 0.3, 0.44, 0.58, 0.72, 0.86];
    steps.forEach(function (t, i) {
      var p = at(t), d = tangent(t), a = Math.atan2(d[1], d[0]) * 180 / Math.PI;
      var size = 1 - t * 0.35;
      [-38, 38].forEach(function (off, k) {
        if (k === 1 && i === steps.length - 1) return;
        var angle = a + off;
        leaves += '<path transform="translate(' + p[0].toFixed(2) + ' ' + p[1].toFixed(2) + ') rotate(' + angle.toFixed(1) + ') scale(' + size.toFixed(3) + ')" d="M0 0C3 -4.2 9 -4.2 14 0C9 4.2 3 4.2 0 0Z"/>';
      });
    });
    var tip = at(1), td = tangent(1), ta = Math.atan2(td[1], td[0]) * 180 / Math.PI;
    leaves += '<path transform="translate(' + tip[0] + ' ' + tip[1] + ') rotate(' + ta.toFixed(1) + ') scale(.7)" d="M0 0C3 -4.2 9 -4.2 14 0C9 4.2 3 4.2 0 0Z"/>';
    var svg = '<svg class="laurel laurel--' + side + '" viewBox="0 0 40 100" aria-hidden="true">' +
      '<g' + (side === 'r' ? ' transform="translate(40 0) scale(-1 1)"' : '') + '>' +
      '<path d="M' + p0 + 'Q' + p1 + ' ' + p2 + '" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' +
      '<g fill="currentColor">' + leaves + '</g></g></svg>';
    laurels[side] = svg;
    return svg;
  }

  // ---------------------------------------------------------------------------
  // Living artwork (GameArtwork): each game's own illustration on a canvas.
  // It plays while it's on screen and holds a composed still frame otherwise.
  // ---------------------------------------------------------------------------
  var dprCap = Math.min(window.devicePixelRatio || 1, 2);
  var STILL_TIME = 2.2;

  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var a = e.target.__art;
      if (!a) return;
      a.visible = e.isIntersecting;
      if (a.visible && (!a.animated || still)) paint(a, a.animated && !still ? performance.now() / 1000 : STILL_TIME);
    });
  }, { rootMargin: '120px' }) : null;
  var ro = 'ResizeObserver' in window ? new ResizeObserver(function (entries) {
    entries.forEach(function (e) { var a = e.target.__art; if (a) { size(a); paint(a, a.animated && !still ? performance.now() / 1000 : STILL_TIME); } });
  }) : null;

  function size(a) {
    var r = a.canvas.getBoundingClientRect();
    var w = Math.max(1, Math.round(r.width * dprCap)), h = Math.max(1, Math.round(r.height * dprCap));
    if (a.canvas.width !== w || a.canvas.height !== h) { a.canvas.width = w; a.canvas.height = h; }
    a.w = r.width; a.h = r.height;
  }

  function art(canvas, gameId, animated) {
    var a = { canvas: canvas, ctx: canvas.getContext('2d'), game: byId[gameId], visible: !io, animated: animated !== false, w: 0, h: 0 };
    canvas.__art = a;
    arts.push(a);
    size(a);
    paint(a, a.animated && !still ? performance.now() / 1000 : STILL_TIME);
    if (io) io.observe(canvas);
    if (ro) ro.observe(canvas);
    return a;
  }
  function setAnimated(canvas, on) {
    var a = canvas && canvas.__art;
    if (!a || a.animated === on) return;
    a.animated = on;
    if (!on) paint(a, STILL_TIME);
  }
  function setGame(canvas, gameId) {
    var a = canvas && canvas.__art;
    if (!a) return;
    a.game = byId[gameId];
    paint(a, a.animated && !still ? performance.now() / 1000 : STILL_TIME);
  }
  function release(canvas) {
    var a = canvas && canvas.__art;
    if (!a) return;
    arts.splice(arts.indexOf(a), 1);
    if (io) io.unobserve(canvas);
    if (ro) ro.unobserve(canvas);
    canvas.__art = null;
  }

  function paint(a, time) {
    if (!a.w || !a.h) size(a);
    if (!a.w || !a.h) return;
    var ctx = a.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, a.canvas.width, a.canvas.height);
    ctx.setTransform(a.canvas.width / a.w, 0, 0, a.canvas.height / a.h, 0, 0);
    Painter(ctx, a.w, a.h, time, a.game, a.canvas.width / a.w);
  }

  function fract(v) { return v - Math.floor(v); }
  function ease(v) { return v * v * (3 - 2 * v); }

  function Painter(ctx, w, h, time, hue, scale) {
    var unit = Math.min(w, h);
    var cx = w / 2, cy = h / 2;

    function circlePath(x, y, r) { ctx.beginPath(); ctx.arc(x, y, Math.max(r, 0), 0, TAU); }
    function glow(x, y, r, color, op) {
      if (r <= 0 || op <= 0.003) return;
      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, rgba(color, op));
      g.addColorStop(1, rgba(color, 0));
      ctx.fillStyle = g;
      circlePath(x, y, r);
      ctx.fill();
    }
    function ellipseGlow(x, y, ew, eh, color, op) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1, eh / ew);
      glow(0, 0, ew / 2, color, op);
      ctx.restore();
    }
    function dot(x, y, r, color, op) {
      if (op <= 0.01) return;
      glow(x, y, r * 3, color, op * 0.35);
      ctx.fillStyle = rgba(color, op);
      circlePath(x, y, r);
      ctx.fill();
    }
    function linear(x0, y0, x1, y1, stops) {
      var g = ctx.createLinearGradient(x0, y0, x1, y1);
      stops.forEach(function (s, i) { g.addColorStop(s[2] != null ? s[2] : i / (stops.length - 1), rgba(s[0], s[1])); });
      return g;
    }
    function radial(x, y, r, stops) {
      var g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(r, 0.001));
      stops.forEach(function (s, i) { g.addColorStop(i / (stops.length - 1), rgba(s[0], s[1])); });
      return g;
    }
    function strokeCircle(x, y, r, color, op, width) {
      ctx.strokeStyle = rgba(color, op);
      ctx.lineWidth = width;
      circlePath(x, y, r);
      ctx.stroke();
    }
    // A rounded rectangle traced clockwise, so overlapping ones fill as one silhouette.
    function roundRect(path, x, y, rw, rh, r) {
      r = Math.min(r, rw / 2, rh / 2);
      path.moveTo(x + r, y);
      path.lineTo(x + rw - r, y);
      path.arc(x + rw - r, y + r, r, -Math.PI / 2, 0);
      path.lineTo(x + rw, y + rh - r);
      path.arc(x + rw - r, y + rh - r, r, 0, Math.PI / 2);
      path.lineTo(x + r, y + rh);
      path.arc(x + r, y + rh - r, r, Math.PI / 2, Math.PI);
      path.lineTo(x, y + r);
      path.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
      path.closePath();
    }

    switch (hue.id) {
      case 'truthOrDare': flame(); break;
      case 'alias': cardOnForehead(); break;
      case 'bomb': bomb(); break;
      case 'neverHaveIEver': raisedHand(); break;
      case 'wouldYouRather': twoOrbs(); break;
      case 'mostLikelyTo': allEyesOnOne(); break;
      case 'hotSeat': heatRings(); break;
      case 'spy': watchfulEye(); break;
    }

    // Truth or Dare: a flickering flame throwing off embers.
    function flame() {
      var bx = cx, by = h * 0.8;
      glow(bx, by - unit * 0.22, unit * 0.58, hue.glow, 0.42 + 0.06 * Math.sin(time * 5.3));
      ellipseGlow(bx, by + unit * 0.02, unit * 0.62, unit * 0.09, hue.glow, 0.35);
      var layersSpec = [[0.48, 0.66, hue.glow, 0.55, 0], [0.33, 0.49, hue.glow, 0.85, 1.7], [0.17, 0.28, WHITE, 0.95, 3.1]];
      layersSpec.forEach(function (l) {
        var flicker = 1 + 0.05 * Math.sin(time * 7.3 + l[4]) + 0.03 * Math.sin(time * 12.1 + l[4] * 2);
        var sway = unit * 0.03 * Math.sin(time * 3.1 + l[4]);
        var fw = unit * l[0], fh = unit * l[1] * flicker;
        var tipX = bx + sway, tipY = by - fh;
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.bezierCurveTo(bx + fw * 0.12 + sway, by - fh * 0.74, bx + fw / 2, by - fh * 0.58, bx + fw / 2, by - fh * 0.33);
        ctx.bezierCurveTo(bx + fw / 2, by - fh * 0.08, bx + fw * 0.3, by, bx, by);
        ctx.bezierCurveTo(bx - fw * 0.3, by, bx - fw / 2, by - fh * 0.08, bx - fw / 2, by - fh * 0.33);
        ctx.bezierCurveTo(bx - fw / 2, by - fh * 0.58, bx - fw * 0.12 + sway, by - fh * 0.74, tipX, tipY);
        ctx.fillStyle = linear(bx, by - unit * l[1], bx, by, [[l[2], l[3] * 0.35], [l[2], l[3]]]);
        ctx.fill();
      });
      for (var i = 0; i < 16; i++) {
        var progress = fract(time * 0.32 + i * 0.137);
        var x = bx + (fract(i * 0.618) - 0.5) * unit * 0.42 + Math.sin(time * 2 + i) * unit * 0.03;
        var y = by - unit * 0.18 - progress * unit * 0.62;
        dot(x, y, unit * 0.013 * (1 - progress * 0.7), i % 3 === 0 ? WHITE : hue.glow, (1 - progress) * 0.9);
      }
    }

    // Never Have I Ever: a raised hand folding its fingers one by one.
    function raisedHand() {
      var fingerWidth = unit * 0.095, gap = unit * 0.022;
      var heights = [0.24, 0.36, 0.40, 0.36, 0.28];
      var totalWidth = fingerWidth * 5 + gap * 4;
      var left = cx - totalWidth / 2;
      var knuckles = h * 0.52, palmHeight = unit * 0.24;
      glow(cx, knuckles, unit * 0.55, hue.glow, 0.45);
      ctx.beginPath();
      roundRect(ctx, left, knuckles - unit * 0.02, totalWidth, palmHeight, unit * 0.1);
      var cycle = fract(time / 7);
      for (var i = 0; i < 5; i++) {
        var fh = unit * heights[i] * (1 - 0.72 * fold(i, cycle));
        roundRect(ctx, left + i * (fingerWidth + gap), knuckles - fh, fingerWidth, fh + unit * 0.06, fingerWidth / 2);
      }
      ctx.fillStyle = linear(cx, knuckles - unit * 0.4, cx, knuckles + palmHeight, [[WHITE, 0.95], [hue.glow, 0.85], [hue.glow, 0.25]]);
      ctx.fill('nonzero');
    }
    function fold(i, cycle) {
      var start = 0.06 + i * 0.1;
      if (cycle < start) return 0;
      if (cycle < 0.72) return ease(Math.min((cycle - start) / 0.08, 1));
      return 1 - ease(Math.min((cycle - 0.72) / 0.12, 1));
    }

    // Would You Rather: two orbs pulling against each other.
    function twoOrbs() {
      var pull = Math.sin(time * 1.1);
      var base = unit * 0.17;
      var lx = w * 0.29, rx = w * 0.71, y = cy;
      var lr = base * (1 + 0.16 * pull), rr = base * (1 - 0.16 * pull);
      glow(lx, y, lr * 2.3, hue.glow, 0.5);
      ctx.fillStyle = (function () {
        var g = ctx.createRadialGradient(lx - lr * 0.35, y - lr * 0.35, 0, lx - lr * 0.35, y - lr * 0.35, lr * 1.5);
        g.addColorStop(0, rgba(WHITE, 1)); g.addColorStop(0.5, rgba(hue.glow, 1)); g.addColorStop(1, rgba(hue.top, 1));
        return g;
      })();
      circlePath(lx, y, lr);
      ctx.fill();
      glow(rx, y, rr * 2.3, WHITE, 0.22);
      strokeCircle(rx, y, rr, WHITE, 0.9, 2);
      strokeCircle(rx, y, rr * 0.72, hue.glow, 0.7, 1);
      [[lx, lr, 1.4], [rx, rr, -1.1]].forEach(function (s) {
        var reach = s[1] * 1.45;
        dot(s[0] + Math.cos(time * s[2]) * reach, y + Math.sin(time * s[2]) * reach, unit * 0.013, WHITE, 0.85);
      });
      ctx.strokeStyle = linear(cx, cy - unit * 0.3, cx, cy + unit * 0.3, [[WHITE, 0], [WHITE, 0.4], [WHITE, 0]]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy - unit * 0.3);
      ctx.lineTo(cx, cy + unit * 0.3);
      ctx.stroke();
      var d = unit * 0.028;
      ctx.beginPath();
      ctx.moveTo(cx, cy - d); ctx.lineTo(cx + d, cy); ctx.lineTo(cx, cy + d); ctx.lineTo(cx - d, cy);
      ctx.closePath();
      ctx.fillStyle = rgba(WHITE, 0.9);
      ctx.fill();
    }

    // Most Likely To: every line leads to one.
    function allEyesOnOne() {
      var fx = cx, fy = cy + unit * 0.02;
      var ring = unit * 0.37, turn = time * 0.12;
      var core = unit * 0.075 * (1 + 0.08 * Math.sin(time * 3));
      glow(fx, fy, unit * 0.4, hue.glow, 0.55);
      for (var i = 0; i < 9; i++) {
        var ang = turn + i / 9 * TAU, dx = Math.cos(ang), dy = Math.sin(ang);
        var px = fx + dx * ring, py = fy + dy * ring;
        var stop = core * 1.7, sx = fx + dx * stop, sy = fy + dy * stop;
        ctx.strokeStyle = rgba(WHITE, 0.18);
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(sx, sy); ctx.stroke();
        var travel = fract(time * 0.5 + i * 0.11);
        dot(px + (sx - px) * travel, py + (sy - py) * travel, unit * 0.009, WHITE, Math.sin(travel * Math.PI) * 0.9);
        ctx.fillStyle = rgba(WHITE, 0.85);
        circlePath(px, py, unit * 0.032); ctx.fill();
        strokeCircle(px, py, unit * 0.05, hue.glow, 0.5, 1);
      }
      ctx.fillStyle = radial(fx, fy, core, [[WHITE, 1], [hue.glow, 1]]);
      circlePath(fx, fy, core); ctx.fill();
      strokeCircle(fx, fy, core * 1.45, WHITE, 0.5, 1);
    }

    // Hot Seat: heat pulsing out from one seat.
    function heatRings() {
      var sx = cx, sy = cy + unit * 0.04;
      glow(sx, sy, unit * 0.46, hue.glow, 0.5);
      for (var i = 0; i < 4; i++) {
        var p = fract(time * 0.28 + i / 4);
        strokeCircle(sx, sy, unit * (0.1 + 0.36 * p), hue.glow, (1 - p) * 0.8, 1.5);
      }
      for (var j = 0; j < 12; j++) {
        var q = fract(time * 0.4 + j * 0.29);
        var x = sx + (fract(j * 0.618) - 0.5) * unit * 0.16 + Math.sin(time * 3 + j) * unit * 0.02;
        var y = sy - unit * 0.1 - q * unit * 0.34;
        dot(x, y, unit * 0.008, WHITE, (1 - q) * 0.7);
      }
      var core = unit * 0.1 * (1 + 0.05 * Math.sin(time * 4));
      var g = ctx.createRadialGradient(sx, sy - core * 0.3, 0, sx, sy - core * 0.3, core * 1.3);
      g.addColorStop(0, rgba(WHITE, 1)); g.addColorStop(0.5, rgba(hue.glow, 1)); g.addColorStop(1, rgba(hue.top, 1));
      ctx.fillStyle = g;
      circlePath(sx, sy, core); ctx.fill();
      strokeCircle(sx, sy, core * 1.35, WHITE, 0.55, 1);
    }

    // Who Am I?: a card on the guesser's forehead, the clues arcing in from the room.
    function cardOnForehead() {
      var hx = cx, hy = h * 0.56, hr = unit * 0.16;
      // Every few seconds the guesser nods: the card tips towards the floor and a new word goes up.
      var beat = 4.2, cycle = fract(time / beat);
      var nod = cycle > 0.74 && cycle < 0.92 ? Math.sin((cycle - 0.74) / 0.18 * Math.PI) : 0;
      var word = Math.floor(time / beat);
      glow(hx, hy, unit * 0.46, hue.glow, 0.4);
      for (var i = 0; i < 8; i++) {
        var p = fract(time * 0.3 + i * 0.37);
        var startX = i % 2 === 0 ? w * 0.06 : w * 0.94, startY = hy + unit * (0.02 + 0.1 * fract(i * 0.618));
        var lift = Math.sin(p * Math.PI) * unit * 0.12;
        dot(startX + (hx - startX) * p * 0.78, startY + (hy - startY) * p - lift, unit * 0.008, WHITE, Math.sin(p * Math.PI) * 0.75);
      }
      // Head and shoulders as one silhouette, fading into the card below.
      var dip = nod * unit * 0.025;
      var shY = hy + hr * 1.12;
      ctx.beginPath();
      ctx.arc(hx, hy + dip, hr, 0, TAU);
      roundRect(ctx, hx - unit * 0.3, shY, unit * 0.56, unit * 0.4, unit * 0.2);
      ctx.fillStyle = linear(hx, hy - hr, hx, shY + unit * 0.2, [[WHITE, 0.55], [hue.glow, 0.35], [hue.glow, 0]]);
      ctx.fill();
      // The card, sideways on the forehead, facing the room. Tipping, it foreshortens.
      var cw = unit * 0.34, ch = unit * 0.17 * (1 - 0.35 * nod);
      var ccx = hx, ccy = hy - hr * 0.82 + dip * 1.6;
      var l = ccx - cw / 2, t = ccy - ch / 2;
      glow(ccx, ccy, unit * 0.3, WHITE, 0.16 + 0.2 * nod);
      ctx.beginPath();
      roundRect(ctx, l, t, cw, ch, unit * 0.035);
      ctx.fillStyle = linear(l, t, l + cw, t + ch, [[WHITE, 1], [hue.glow, 1]]);
      ctx.fill();
      // The word only the room can read: two strokes that change with every nod.
      var lh = unit * 0.022 * (1 - 0.35 * nod);
      for (var k = 0; k < 2; k++) {
        var len = cw * (k === 0 ? 0.5 + 0.22 * fract(word * 0.618) : 0.28 + 0.16 * fract(word * 0.382));
        var y = ccy + (k === 0 ? -1 : 1) * ch * 0.16 - lh / 2;
        ctx.beginPath();
        roundRect(ctx, ccx - len / 2, y, len, lh, lh / 2);
        ctx.fillStyle = rgba(hue.top, k === 0 ? 0.85 : 0.5);
        ctx.fill();
      }
      // A guess lands: a ring spreads off the card just after the nod.
      var since = cycle - 0.84;
      if (since > 0 && since < 0.16) {
        var q = since / 0.16, grow = unit * 0.1 * q;
        ctx.beginPath();
        roundRect(ctx, l - grow, t - grow, cw + grow * 2, ch + grow * 2, unit * (0.035 + 0.1 * q));
        ctx.strokeStyle = rgba(WHITE, (1 - q) * 0.7);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // Bomb: a glossy black bomb, its fuse lit and spitting sparks (BombPainter).
    function bomb() {
      var heat = 0.3, r = unit * 0.27;
      var bx = cx - unit * 0.04, by = cy + unit * 0.1;
      var nd = -0.95, ndx = Math.cos(nd), ndy = Math.sin(nd);
      var fsx = bx + ndx * r * 1.15, fsy = by + ndy * r * 1.15;
      var tx = fsx + r * 0.5, ty = fsy - r * 0.42;
      var flicker = 0.85 + 0.15 * Math.sin(time * 23) * Math.sin(time * 7.1);
      var lit = (0.4 + heat * 0.6) * flicker;
      glow(bx, by, r * 1.9, hue.glow, 0.1);
      glow(tx, ty, r * (1.1 + heat * 0.8), hue.glow, (0.35 + heat * 0.35) * flicker);
      // Its shadow on the table.
      ctx.save();
      ctx.translate(bx, by + r * 1.02);
      ctx.scale(1, 0.18);
      glow(0, 0, r * 1.05, '#000000', 0.45);
      ctx.restore();
      // The body, lit from the top left, with the spark's light caught on the rim nearest it.
      var lx = bx - r * 0.38, ly = by - r * 0.42;
      var body = ctx.createRadialGradient(lx, ly, 0, lx, ly, r * 1.55);
      body.addColorStop(0, '#5B5B66'); body.addColorStop(0.5, '#24242A'); body.addColorStop(1, '#09090B');
      ctx.fillStyle = body;
      circlePath(bx, by, r); ctx.fill();
      ctx.strokeStyle = linear(bx - r, by + r, bx + r * 0.7, by - r * 0.7, [[hue.glow, 0], [hue.glow, 0.75 * lit]]);
      ctx.lineWidth = r * 0.05;
      ctx.stroke();
      ctx.save();
      ctx.translate(bx - r * 0.42, by - r * 0.46);
      ctx.rotate(-35 * Math.PI / 180);
      ctx.scale(1, 0.55);
      glow(0, 0, r * 0.24, WHITE, 0.42);
      ctx.restore();
      ctx.fillStyle = rgba(WHITE, 0.85);
      circlePath(bx - r * 0.48, by - r * 0.5, r * 0.045); ctx.fill();
      // The metal collar the fuse comes out of.
      ctx.save();
      ctx.translate(bx + ndx * r * 1.02, by + ndy * r * 1.02);
      ctx.rotate(nd + Math.PI / 2);
      ctx.beginPath();
      roundRect(ctx, -r * 0.22, -r * 0.14, r * 0.44, r * 0.28, r * 0.05);
      ctx.fillStyle = linear(-r * 0.22, 0, r * 0.22, 0, [['#6B6B76', 1], ['#2A2A30', 1], ['#141417', 1]]);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-r * 0.22, -r * 0.14 + 1); ctx.lineTo(r * 0.22, -r * 0.14 + 1);
      ctx.strokeStyle = rgba(WHITE, 0.35); ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();
      // A twisted cord curling up from the collar, charred towards the burning end.
      var fw = r * 0.075;
      function cord() {
        ctx.beginPath();
        ctx.moveTo(fsx, fsy);
        ctx.bezierCurveTo(fsx + r * 0.05, fsy - r * 0.38, tx - r * 0.32, ty + r * 0.12, tx, ty);
      }
      cord();
      ctx.lineCap = 'round';
      ctx.strokeStyle = linear(fsx, fsy, tx, ty, [['#C9B48A', 1], ['#A8916A', 1], ['#2B2622', 1]]);
      ctx.lineWidth = fw;
      ctx.stroke();
      ctx.lineCap = 'butt';
      ctx.setLineDash([fw * 0.45, fw * 0.75]);
      ctx.strokeStyle = rgba('#000000', 0.28);
      ctx.lineWidth = fw * 0.5;
      ctx.stroke();
      ctx.setLineDash([]);
      // The spark: rays that flare and change every frame, like a sparkler, and embers falling away.
      var ss = r * (0.32 + heat * 0.22);
      glow(tx, ty, ss * 1.6, '#FFE7A3', 0.85 * flicker);
      var seed = Math.floor(time * 24) >>> 0;
      function rand() { seed = (seed + 0x6D2B79F5) >>> 0; var z = seed; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; }
      ctx.lineWidth = 1.2;
      for (var i = 0; i < 9; i++) {
        var a = rand() * TAU, len = ss * (0.45 + rand() * 0.65);
        var ex = tx + Math.cos(a) * len, ey = ty + Math.sin(a) * len;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ex, ey);
        ctx.strokeStyle = linear(tx, ty, ex, ey, [[WHITE, 0.95], ['#FDBA74', 0]]);
        ctx.stroke();
      }
      var embers = 12 + Math.floor(heat * 14);
      for (var j = 0; j < embers; j++) {
        var p = fract(time * (0.9 + fract(j * 0.37) * 0.8) + j * 0.173);
        var ang = -Math.PI / 2 + (fract(j * 0.618) - 0.5) * 2.6;
        var dist = r * 0.65 * p, fall = r * 0.35 * p * p;
        var px = tx + Math.cos(ang) * dist, py = ty + Math.sin(ang) * dist + fall;
        var color = j % 3 === 0 ? WHITE : j % 2 === 0 ? '#FDE68A' : hue.glow;
        var op = (1 - p) * 0.95, er = r * 0.022 * (1 - p * 0.6);
        if (op <= 0.01) continue;
        ctx.fillStyle = rgba(color, op * 0.25); circlePath(px, py, er * 2.6); ctx.fill();
        ctx.fillStyle = rgba(color, op); circlePath(px, py, er); ctx.fill();
      }
      ctx.fillStyle = WHITE;
      circlePath(tx, ty, r * 0.06); ctx.fill();
    }

    // Spy: an eye that keeps looking round the room.
    function watchfulEye() {
      var ex = cx, ey = cy + unit * 0.02, ew = unit * 0.62, eh = unit * 0.3;
      for (var i = 0; i < 3; i++) {
        var p = fract(time * 0.22 + i / 3);
        strokeCircle(ex, ey, unit * (0.2 + 0.3 * p), hue.glow, (1 - p) * 0.35, 1);
      }
      glow(ex, ey, unit * 0.42, hue.glow, 0.4);
      var cycle = fract(time / 4.2);
      var blink = cycle > 0.94 ? Math.sin((cycle - 0.94) / 0.06 * Math.PI) : 0;
      var open = 1 - 0.92 * blink;
      function lids() {
        ctx.beginPath();
        ctx.moveTo(ex - ew / 2, ey);
        ctx.quadraticCurveTo(ex, ey - eh * open, ex + ew / 2, ey);
        ctx.quadraticCurveTo(ex, ey + eh * open, ex - ew / 2, ey);
        ctx.closePath();
      }
      var glance = Math.sin(time * 0.8) * 0.6 + Math.sin(time * 0.37) * 0.4;
      var ix = ex + glance * ew * 0.16, iy = ey, ir = eh * 0.36;
      ctx.save();
      lids();
      ctx.clip();
      ctx.fillStyle = rgba(WHITE, 0.1);
      ctx.fill();
      ctx.fillStyle = radial(ix, iy, ir, [[hue.glow, 1], [hue.top, 1], [hue.bottom, 1]]);
      circlePath(ix, iy, ir); ctx.fill();
      ctx.fillStyle = rgba(hue.bottom, 1);
      circlePath(ix, iy, ir * 0.42); ctx.fill();
      ctx.fillStyle = rgba(WHITE, 0.95);
      circlePath(ix - ir * 0.3, iy - ir * 0.32, ir * 0.16); ctx.fill();
      ctx.restore();
      lids();
      ctx.strokeStyle = rgba(WHITE, 0.9);
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  window.JoyCards = {
    GAMES: GAMES, byId: byId, TINTS: TINTS, still: still,
    rgba: rgba, hueStyle: hueStyle, spring: spring, layers: layers,
    icon: icon, emblem: emblem, rosette: rosette, laurel: laurel,
    art: art, setAnimated: setAnimated, setGame: setGame, release: release,
    tilt: tilt,
    onFrame: function (fn) { listeners.push(fn); return function () { var i = listeners.indexOf(fn); if (i >= 0) listeners.splice(i, 1); }; }
  };
})();
