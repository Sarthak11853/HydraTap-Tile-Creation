/* HydraTap website — interactions */
(function () {
  'use strict';

  var APK_URL = 'https://github.com/Sarthak11853/HydraTap/releases/latest/download/HydraTap.apk';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Helpers (same rules as the app) ---------- */
  function formatVolume(ml) {
    var v = Math.max(0, Math.round(ml));
    if (v < 1000) return v + ' ml';
    var l = v / 1000;
    return (Number.isInteger(l) ? l : l.toFixed(2).replace(/0$/, '')) + ' L';
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function clock(d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function minToClock(m) { return pad(Math.floor(m / 60) % 24) + ':' + pad(m % 60); }
  function store(key, val) { try { if (val === undefined) return localStorage.getItem(key); localStorage.setItem(key, val); } catch (e) { return null; } }

  /* ---------- Site toast ---------- */
  var siteToastTimer;
  function siteToast(msg) {
    var el = $('#siteToast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(siteToastTimer);
    siteToastTimer = setTimeout(function () { el.classList.remove('show'); }, 3600);
  }

  /* =========================================================
     Water bottle (SVG port of the app's WaterBottle component)
     ========================================================= */
  var VB_W = 200, VB_H = 380, BOTTOM = 360, TOP_FULL = 104;
  var BODY = 'M80 60 L120 60 L120 72 C120 90 172 98 172 132 L172 330 Q172 362 140 362 L60 362 Q28 362 28 330 L28 132 C28 98 80 90 80 72 Z';
  var TWO_PI = Math.PI * 2;
  var bottleCount = 0;

  function wavePath(level, phase, amplitude, wavelength, offset) {
    var c = Math.min(Math.max(level, 0), 1);
    if (c <= 0.001) return 'M0 ' + VB_H + ' L' + VB_W + ' ' + VB_H + ' Z';
    var y0 = BOTTOM - c * (BOTTOM - TOP_FULL);
    var amp = amplitude * Math.min(1, c * 6, (1.04 - c) * 6 + 0.35);
    var d = 'M0 ' + (y0 + amp * Math.sin(phase + offset)).toFixed(2);
    for (var x = 8; x <= VB_W; x += 8) {
      d += ' L' + x + ' ' + (y0 + amp * Math.sin((x / wavelength) * TWO_PI + phase + offset)).toFixed(2);
    }
    return d + ' L' + VB_W + ' ' + VB_H + ' L0 ' + VB_H + ' Z';
  }

  function Bottle(host) {
    var id = 'b' + (++bottleCount);
    host.innerHTML =
      '<svg viewBox="0 0 ' + VB_W + ' ' + VB_H + '" aria-hidden="true">' +
      '<defs>' +
      '<linearGradient id="' + id + 'w" x1="0" y1="0" x2="0" y2="1"><stop class="s1" offset="0"/><stop class="s2" offset=".55"/><stop class="s3" offset="1"/></linearGradient>' +
      '<linearGradient id="' + id + 'wb" x1="0" y1="0" x2="0" y2="1"><stop class="s4" offset="0"/><stop class="s5" offset="1"/></linearGradient>' +
      '<linearGradient id="' + id + 'g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".95"/><stop offset=".5" stop-color="#F0F9FF" stop-opacity=".7"/><stop offset="1" stop-color="#E0F2FE" stop-opacity=".95"/></linearGradient>' +
      '<linearGradient id="' + id + 'c" x1="0" y1="0" x2="0" y2="1"><stop class="s6" offset="0"/><stop class="s7" offset="1"/></linearGradient>' +
      '<radialGradient id="' + id + 'gl" cx="50%" cy="55%" r="50%"><stop offset="0" stop-color="#22D3EE" stop-opacity=".45"/><stop offset="1" stop-color="#22D3EE" stop-opacity="0"/></radialGradient>' +
      '<clipPath id="' + id + 'clip"><path d="' + BODY + '"/></clipPath>' +
      '</defs>' +
      '<rect class="glow" x="-30" y="30" width="260" height="360" fill="url(#' + id + 'gl)" opacity="0" style="transition:opacity .6s"/>' +
      '<path d="' + BODY + '" fill="url(#' + id + 'g)"/>' +
      '<g clip-path="url(#' + id + 'clip)">' +
      '<path class="back" fill="url(#' + id + 'wb)" opacity=".75"/>' +
      '<path class="front" fill="url(#' + id + 'w)"/>' +
      '<circle class="bA" cx="70" r="4" fill="#fff"/><circle class="bB" cx="128" r="3" fill="#fff"/>' +
      '</g>' +
      [0.25, 0.5, 0.75].map(function (t) {
        var y = BOTTOM - t * (BOTTOM - TOP_FULL);
        return '<rect x="150" y="' + (y - 1) + '" width="' + (t === 0.5 ? 14 : 9) + '" height="2" rx="1" fill="#0369A1" opacity=".18"/>';
      }).join('') +
      '<rect x="42" y="140" width="10" height="170" rx="5" fill="#fff" opacity=".55"/>' +
      '<rect x="42" y="322" width="10" height="14" rx="5" fill="#fff" opacity=".45"/>' +
      '<path d="' + BODY + '" fill="none" stroke="#9BD7F5" stroke-width="3.5" stroke-linejoin="round"/>' +
      '<rect x="72" y="14" width="56" height="44" rx="10" fill="url(#' + id + 'c)"/>' +
      [24, 32, 40, 48].map(function (y) { return '<rect x="78" y="' + y + '" width="44" height="2.2" rx="1.1" fill="#fff" opacity=".28"/>'; }).join('') +
      '<rect class="capring" x="68" y="52" width="64" height="10" rx="5"/>' +
      '</svg>';

    this.svg = host.firstChild;
    this.back = $('.back', host);
    this.front = $('.front', host);
    this.bA = $('.bA', host);
    this.bB = $('.bB', host);
    this.glow = $('.glow', host);
    this.stops = {};
    var self = this;
    ['s1', 's2', 's3', 's4', 's5', 's6', 's7'].forEach(function (k) { self.stops[k] = $('.' + k, host); });
    this.ringEl = $('.capring', host);
    this.level = 0; this.target = 0; this.vel = 0;
    this.phase = 0; this.bubble = 0;
    this.goal = null;
    this.visible = true;
    this.setGoal(false);
    Bottle.all.push(this);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { self.visible = es[0].isIntersecting; }).observe(host);
    }
  }
  Bottle.all = [];
  Bottle.prototype.set = function (progress, goalReached) {
    this.target = Math.min(Math.max(progress, 0), 1);
    this.setGoal(!!goalReached);
    if (reduceMotion) { this.level = this.target; this.draw(); }
  };
  Bottle.prototype.setGoal = function (on) {
    if (this.goal === on) return;
    this.goal = on;
    var c = on
      ? ['#5EEAD4', '#06B6D4', '#0891B2', '#99F6E4', '#22D3EE', '#2DD4BF', '#0D9488', '#0F766E']
      : ['#7DD3FC', '#38BDF8', '#0284C7', '#BAE6FD', '#7DD3FC', '#38BDF8', '#0284C7', '#0369A1'];
    var keys = ['s1', 's2', 's3', 's4', 's5', 's6', 's7'];
    for (var i = 0; i < keys.length; i++) this.stops[keys[i]].setAttribute('stop-color', c[i]);
    this.ringEl.setAttribute('fill', c[7]);
    this.glow.setAttribute('opacity', on ? '1' : '0');
  };
  Bottle.prototype.step = function (dt) {
    // Soft spring toward the target level (damping 16 / stiffness 70, like the app).
    var k = 70, damp = 16;
    var acc = k * (this.target - this.level) - damp * this.vel;
    this.vel += acc * dt;
    this.level += this.vel * dt;
    if (!reduceMotion) {
      this.phase = (this.phase + dt * TWO_PI / 3.8) % TWO_PI;
      this.bubble = (this.bubble + dt / 5.2) % 1;
    }
    this.draw();
  };
  Bottle.prototype.draw = function () {
    var L = this.level;
    this.back.setAttribute('d', wavePath(L, -this.phase, 5, 150, 1.4));
    this.front.setAttribute('d', wavePath(L, this.phase, 6, 120, 0));
    var surface = BOTTOM - Math.min(Math.max(L, 0), 1) * (BOTTOM - TOP_FULL);
    var t = this.bubble, t2 = (this.bubble + 0.45) % 1;
    var spanA = Math.max(0, BOTTOM - 32 - surface), spanB = Math.max(0, BOTTOM - 44 - surface);
    this.bA.setAttribute('cy', BOTTOM - 16 - spanA * t);
    this.bA.setAttribute('opacity', L > 0.12 ? 0.55 * (1 - t) : 0);
    this.bB.setAttribute('cy', BOTTOM - 24 - spanB * t2);
    this.bB.setAttribute('opacity', L > 0.12 ? 0.45 * (1 - t2) : 0);
  };

  var lastFrame = 0;
  function frame(ts) {
    var dt = lastFrame ? Math.min((ts - lastFrame) / 1000, 0.05) : 0.016;
    lastFrame = ts;
    if (!document.hidden) {
      for (var i = 0; i < Bottle.all.length; i++) if (Bottle.all[i].visible) Bottle.all[i].step(dt);
    }
    requestAnimationFrame(frame);
  }

  /* =========================================================
     Header, navigation and theme
     ========================================================= */
  function initHeader() {
    var header = $('.site-header');
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var menuBtn = $('#menuBtn'), links = $('#navLinks');
    function setMenu(open) {
      links.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    menuBtn.addEventListener('click', function (e) { e.stopPropagation(); setMenu(!links.classList.contains('open')); });
    $$('a', links).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('click', function (e) { if (!links.contains(e.target)) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

    // Highlight the section in view.
    if ('IntersectionObserver' in window) {
      var map = {};
      $$('.nav-links a[href^="#"]:not(.btn)').forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && map[en.target.id]) {
            $$('.nav-links a').forEach(function (a) { a.classList.remove('active'); });
            map[en.target.id].classList.add('active');
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
    }
  }

  function initTheme() {
    var root = document.documentElement;
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    function effective() { return root.getAttribute('data-theme') || (mq.matches ? 'dark' : 'light'); }
    function syncMeta() {
      var dark = effective() === 'dark';
      $$('meta[name="theme-color"]').forEach(function (m) { m.setAttribute('content', dark ? '#061826' : '#F2FAFF'); });
    }
    $('#themeToggle').addEventListener('click', function () {
      var next = effective() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store('hydratap-theme', next);
      syncMeta();
    });
    if (root.getAttribute('data-theme')) syncMeta();
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window) || reduceMotion) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (e, i) {
      if (e.classList.contains('feature')) e.style.transitionDelay = (i % 3) * 80 + 'ms';
      io.observe(e);
    });
  }

  /* ---------- Background bubbles ---------- */
  function initBubbles() {
    if (reduceMotion) return;
    var box = $('#bubbles');
    var n = window.innerWidth < 640 ? 8 : 16;
    for (var i = 0; i < n; i++) {
      var b = document.createElement('span');
      var s = 6 + Math.random() * 22;
      b.style.width = b.style.height = s + 'px';
      b.style.left = Math.random() * 100 + '%';
      b.style.animationDuration = 14 + Math.random() * 18 + 's';
      b.style.animationDelay = -Math.random() * 30 + 's';
      b.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
      b.style.opacity = 0.35 + Math.random() * 0.4;
      box.appendChild(b);
    }
  }

  /* ---------- Hero bottle ---------- */
  function initHero() {
    var host = $('#heroBottle');
    var b = new Bottle(host);
    var level = 0.62;
    setTimeout(function () { b.set(level, false); }, 300);
    host.addEventListener('click', function () {
      level = level >= 1 ? 0.15 : Math.min(1, level + 0.125);
      b.set(level, level >= 1);
      if (level >= 1) siteToast('Daily goal reached! 🎉 Beautifully hydrated today.');
    });
    host.setAttribute('tabindex', '0');
    host.setAttribute('title', 'Click me!');
    host.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); host.click(); } });
  }

  /* ---------- Feature cards ---------- */
  function initFeatures() {
    $$('.feature').forEach(function (card) {
      card.addEventListener('click', function () {
        var open = card.getAttribute('aria-expanded') === 'true';
        card.setAttribute('aria-expanded', String(!open));
      });
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* =========================================================
     Interactive demo
     ========================================================= */
  var GOALS = [1500, 2000, 2500, 3000, 3500];
  var AMOUNTS = [150, 200, 250, 330, 500, 750, 1000];
  var DUP_WINDOW = 8000;
  var DAY_MS = 86400000;
  var CHART_PLOT = 104, CHART_LABEL = 17; // px: bar area and day-label row (see .chart in CSS)

  var demo = {
    name: '',
    goal: 2000,
    amount: 250,
    open: true,
    entries: [],          // today: { at, ml, goal, src }
    pending: 0,           // taps logged while the app was closed
    lastTapAt: 0,
    // Previous six days, oldest first. Each keeps the goal it had at the time.
    past: [1750, 2250, 2000, 1500, 2500, 2000].map(function (ml, i) { return { ml: ml, goal: 2000, taps: Math.round(ml / 250), offset: 6 - i }; })
  };
  var demoBottle;
  var onDemoChange = [];

  function todayTotal() { return demo.entries.reduce(function (s, e) { return s + e.ml; }, 0); }

  function renderChips(host, values, current, onPick) {
    host.innerHTML = '';
    values.forEach(function (v) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'chip'; b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', String(v === current));
      b.textContent = formatVolume(v);
      b.addEventListener('click', function () { onPick(v); });
      host.appendChild(b);
    });
  }

  var phoneToastTimer, sysToastTimer;
  function phoneToast(tone, icon, title, msg) {
    var t = $('#phoneToast');
    t.className = 'phone-toast ' + tone;
    $('#ptIcon').textContent = icon; $('#ptTitle').textContent = title; $('#ptMsg').textContent = msg;
    void t.offsetWidth;
    t.classList.add('show');
    clearTimeout(phoneToastTimer);
    phoneToastTimer = setTimeout(function () { t.classList.remove('show'); }, 2800);
  }
  function sysToast(msg) {
    var t = $('#sysToast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(sysToastTimer);
    sysToastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }
  function logEvent(text) {
    var ul = $('#eventLog');
    var li = document.createElement('li');
    li.innerHTML = '<time>' + clock(new Date()) + '</time><span></span>';
    li.lastChild.textContent = text;
    ul.insertBefore(li, ul.firstChild);
    while (ul.children.length > 5) ul.removeChild(ul.lastChild);
  }
  function buzz(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }

  function addDrink(src) {
    var before = todayTotal();
    var entry = { at: Date.now(), ml: demo.amount, goal: demo.goal, src: src };
    demo.entries.push(entry);
    var total = before + entry.ml;
    var left = Math.max(0, demo.goal - total);
    var reachedNow = before < demo.goal && total >= demo.goal;

    if (!demo.open) {
      demo.pending++;
      sysToast('💧 +' + formatVolume(entry.ml) + (left > 0 ? ' · ' + formatVolume(left) + ' to go' : ' · goal reached 🎉'));
      logEvent('Background tap logged +' + formatVolume(entry.ml) + ' — app stayed closed');
    } else if (reachedNow) {
      phoneToast('success', '🎉', 'Daily goal reached! 🎉', '+' + formatVolume(entry.ml) + ' — beautifully hydrated today.');
      logEvent('Goal reached with ' + formatVolume(total) + '!');
    } else {
      phoneToast('success', '💧', '+' + formatVolume(entry.ml) + ' logged 💧', left > 0 ? formatVolume(left) + ' to go today' : 'Goal already reached — nice!');
      logEvent((src === 'manual' ? 'Manual log' : 'Sticker tap') + ' +' + formatVolume(entry.ml));
    }
    renderDemo(true);
  }

  function tapSticker() {
    var s = $('#stickerBtn');
    s.classList.remove('burst'); void s.offsetWidth; s.classList.add('burst');
    var p = $('#phone');
    p.classList.remove('bump'); void p.offsetWidth; p.classList.add('bump');
    buzz(35);
    var now = Date.now();
    if (now - demo.lastTapAt < DUP_WINDOW) {
      var wait = Math.ceil((DUP_WINDOW - (now - demo.lastTapAt)) / 1000);
      if (demo.open) phoneToast('info', 'ℹ️', 'Already logged', 'That tap was just counted.');
      else sysToast('Already logged — that tap was just counted');
      logEvent('Duplicate tap ignored (8 s protection, ' + wait + ' s left)');
      return;
    }
    demo.lastTapAt = now;
    addDrink(demo.open ? 'tap' : 'background');
  }

  function strangerTag() {
    buzz(20);
    if (demo.open) phoneToast('warning', '⚠️', 'Not your HydraTap sticker', 'This tag was ignored.');
    logEvent('Unknown tag (transit card) ignored' + (demo.open ? '' : ' silently'));
  }

  function setAppOpen(open) {
    if (demo.open === open) return;
    demo.open = open;
    $$('[data-app]').forEach(function (b) { b.setAttribute('aria-checked', String((b.dataset.app === 'open') === open)); });
    $('#appScreen').hidden = !open;
    $('#launcher').hidden = open;
    $('#phoneToast').classList.remove('show');
    if (open) {
      if (demo.pending) {
        phoneToast('success', '🔄', 'Welcome back', demo.pending + ' background tap' + (demo.pending > 1 ? 's' : '') + ' imported');
        logEvent('App opened — imported ' + demo.pending + ' background tap' + (demo.pending > 1 ? 's' : ''));
      } else {
        logEvent('App opened');
      }
      demo.pending = 0;
      renderDemo(true);
    } else {
      logEvent('App closed — tap the sticker anyway');
    }
  }

  function greeting(h) { return h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; }

  function renderDemo(fresh) {
    var now = new Date();
    var total = todayTotal();
    var goal = demo.goal;
    var progress = goal > 0 ? total / goal : 0;
    var reached = total >= goal;
    var left = Math.max(0, goal - total);

    $('#asDate').textContent = now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
    $('#asGreeting').textContent = greeting(now.getHours());
    $('#asName').textContent = demo.name.trim() || 'Friend';
    $('#bottleTotal').textContent = formatVolume(total);
    $('#bottleSub').textContent = 'of ' + formatVolume(goal);
    $('#bottleLabel').classList.toggle('on-water', progress >= 0.5);
    $('#statToday').textContent = formatVolume(total);
    $('#statLeft').textContent = formatVolume(left);
    $('#statPct').textContent = Math.round(Math.min(progress, 9.99) * 100) + '%';
    $('#goalBanner').hidden = !reached;
    $('#asReadyText').textContent = 'Each tap adds ' + formatVolume(demo.amount);
    $('#goalOut').textContent = formatVolume(goal);
    $('#amountOut').textContent = formatVolume(demo.amount);
    $('#tapsHint').innerHTML = 'About <b>' + Math.ceil(goal / demo.amount) + ' taps</b> to reach ' + formatVolume(goal);
    $('#demoBottle').setAttribute('aria-label', 'Water bottle ' + Math.round(Math.min(progress, 9.99) * 100) + ' percent full' + (reached ? ', daily goal reached' : ''));
    if (demoBottle) demoBottle.set(progress, reached);

    // Today's sips (newest first)
    var ul = $('#sipList');
    ul.innerHTML = '';
    if (!demo.entries.length) {
      ul.innerHTML = '<li class="empty">No sips yet — tap the sticker below.</li>';
    } else {
      demo.entries.slice().reverse().slice(0, 6).forEach(function (e, i) {
        var li = document.createElement('li');
        if (i === 0 && fresh) li.className = 'new';
        var label = e.src === 'manual' ? 'manual' : e.src === 'background' ? 'closed-app tap' : 'tap';
        li.innerHTML = '<span>' + clock(new Date(e.at)) + '<span class="src">' + label + '</span></span><b>+' + formatVolume(e.ml) + '</b>';
        ul.appendChild(li);
      });
    }

    renderHistory(now, total);
    onDemoChange.forEach(function (fn) { fn(); });
  }

  function renderHistory(now, total) {
    var days = demo.past.map(function (d) { return { ml: d.ml, goal: d.goal, date: new Date(now.getTime() - d.offset * DAY_MS), today: false }; });
    days.push({ ml: total, goal: demo.goal, date: now, today: true });
    var max = Math.max.apply(null, days.map(function (d) { return d.ml; }).concat([demo.goal * 1.2]));

    var chart = $('#weekChart');
    chart.innerHTML = '';
    var line = document.createElement('div');
    line.className = 'goal-line';
    // Chart bars sit above a ~16px label row.
    line.style.bottom = (CHART_LABEL + CHART_PLOT * demo.goal / max).toFixed(1) + 'px';
    line.innerHTML = '<span>goal ' + formatVolume(demo.goal) + '</span>';
    chart.appendChild(line);
    days.forEach(function (d) {
      var bar = document.createElement('div');
      bar.className = 'bar' + (d.ml >= d.goal ? ' hit' : '') + (d.today ? ' today' : '');
      var h = Math.max(3, CHART_PLOT * d.ml / max);
      bar.innerHTML = '<span class="tip">' + formatVolume(d.ml) + '</span><i style="height:' + h.toFixed(1) + 'px"></i><small>' +
        (d.today ? 'Today' : d.date.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 3)) + '</small>';
      chart.appendChild(bar);
    });
    var sum = days.reduce(function (s, d) { return s + d.ml; }, 0);
    $('#chartAvg').textContent = 'avg ' + formatVolume(sum / 7);
    $('#statAll').textContent = formatVolume(sum + 41250); // plus earlier sample history
    $('#statGoalDays').textContent = String(days.filter(function (d) { return d.ml >= d.goal; }).length + 14);
    $('#statTaps').textContent = String(demo.past.reduce(function (s, d) { return s + d.taps; }, 0) + demo.entries.length + 165);

    var g = $('#historyGroups');
    var html = '<div class="as-group-h">Today <small>' + formatVolume(total) + ' · ' + Math.round(total / demo.goal * 100) + '%</small></div><ul>';
    if (!demo.entries.length) html += '<li class="empty">Nothing yet today</li>';
    demo.entries.slice().reverse().slice(0, 4).forEach(function (e) {
      html += '<li><span>' + clock(new Date(e.at)) + '</span><b>+' + formatVolume(e.ml) + '</b></li>';
    });
    html += '</ul>';
    days.slice(0, 6).reverse().slice(0, 3).forEach(function (d) {
      html += '<div class="as-group-h">' + d.date.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' }) +
        ' <small>' + formatVolume(d.ml) + (d.ml >= d.goal ? ' · ✓ goal' : ' · ' + Math.round(d.ml / d.goal * 100) + '%') + '</small></div>';
    });
    g.innerHTML = html;
  }

  function initDemo() {
    demoBottle = new Bottle($('#demoBottle'));

    function pickGoal(v) {
      demo.goal = v;
      renderChips($('#goalChips'), GOALS, v, pickGoal);
      logEvent('Goal set to ' + formatVolume(v) + ' — past days keep their own goal');
      renderDemo(false);
    }
    function pickAmount(v) {
      demo.amount = v;
      renderChips($('#amountChips'), AMOUNTS, v, pickAmount);
      logEvent('Each tap now adds ' + formatVolume(v));
      renderDemo(false);
    }
    renderChips($('#goalChips'), GOALS, demo.goal, pickGoal);
    renderChips($('#amountChips'), AMOUNTS, demo.amount, pickAmount);

    $('#stickerBtn').addEventListener('click', tapSticker);
    $('#strangerBtn').addEventListener('click', strangerTag);
    $('#manualBtn').addEventListener('click', function () {
      if (!demo.open) setAppOpen(true);
      addDrink('manual');
    });
    $('#undoBtn').addEventListener('click', function () {
      var e = demo.entries.pop();
      if (e) { logEvent('Removed +' + formatVolume(e.ml)); demo.lastTapAt = 0; renderDemo(false); }
      else logEvent('Nothing to undo');
    });
    $('#resetBtn').addEventListener('click', function () {
      demo.entries = []; demo.lastTapAt = 0; demo.pending = 0;
      logEvent('Day reset');
      renderDemo(false);
    });
    $$('[data-app]').forEach(function (b) { b.addEventListener('click', function () { setAppOpen(b.dataset.app === 'open'); }); });
    $('#openAppIcon').addEventListener('click', function () { setAppOpen(true); });

    var nameInput = $('#nameInput');
    nameInput.addEventListener('input', function () { demo.name = nameInput.value; renderDemo(false); });

    // In-phone tabs
    var tabs = $$('.as-tabs [role="tab"]');
    function selectTab(btn) {
      tabs.forEach(function (t) {
        var on = t === btn;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.dataset.tab).hidden = !on;
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { selectTab(t); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
          selectTab(n); n.focus();
        }
      });
    });

    // Phone clock
    function tick() {
      var d = new Date();
      $('#phoneClock').textContent = clock(d);
      $('#launcherTime').textContent = clock(d);
      $('#launcherDate').textContent = d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
    }
    tick(); setInterval(tick, 15000);

    renderDemo(false);
  }

  /* ---------- Onboarding steps ---------- */
  function initSteps() {
    var tabs = $$('#stepsNav [role="tab"]');
    var panels = $$('.steps-body .step');
    var cur = 0;
    function go(i) {
      cur = (i + tabs.length) % tabs.length;
      tabs.forEach(function (t, k) {
        t.setAttribute('aria-selected', String(k === cur));
        t.classList.toggle('done', k < cur);
        t.tabIndex = k === cur ? 0 : -1;
      });
      panels.forEach(function (p, k) { p.hidden = k !== cur; p.classList.toggle('is-active', k === cur); });
      $('#stepsProgress').style.width = ((cur + 1) / tabs.length * 100) + '%';
      $('#stepPrev').disabled = cur === 0;
      $('#stepPrev').style.visibility = cur === 0 ? 'hidden' : 'visible';
      $('#stepNext').textContent = cur === tabs.length - 1 ? 'Try the demo →' : 'Next →';
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { go(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { go(cur + 1); tabs[cur].focus(); }
        if (e.key === 'ArrowLeft') { go(cur - 1); tabs[cur].focus(); }
      });
    });
    $('#stepPrev').addEventListener('click', function () { go(cur - 1); });
    $('#stepNext').addEventListener('click', function () {
      if (cur === tabs.length - 1) { document.getElementById('try').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); return; }
      go(cur + 1);
    });
    // Swipe between steps on touch screens.
    var body = $('.steps-body'), sx = null;
    body.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    body.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1));
      sx = null;
    });
    go(0);
  }

  /* ---------- Reminder planner (mirrors the app's planReminders) ---------- */
  function initPlanner() {
    var iv = $('#intervalRange'), st = $('#startRange'), en = $('#endRange'), gt = $('#goalReachedToggle');
    var userTouchedToggle = false;

    function fill(r) { r.style.setProperty('--p', ((r.value - r.min) / (r.max - r.min) * 100) + '%'); }

    function render() {
      var interval = +iv.value, start = +st.value, end = +en.value;
      [iv, st, en].forEach(fill);
      $('#intervalOut').textContent = interval >= 60 && interval % 60 === 0 ? (interval / 60) + ' h' : interval + ' min';
      $('#startOut').textContent = minToClock(start);
      $('#endOut').textContent = minToClock(end);

      var now = new Date(); var nowMin = now.getHours() * 60 + now.getMinutes();
      var lastDrink = demo.entries.length ? new Date(demo.entries[demo.entries.length - 1].at) : null;
      var lastMin = lastDrink ? lastDrink.getHours() * 60 + lastDrink.getMinutes() : null;
      var reached = gt.checked;

      var slots = [];
      for (var m = start; m <= end && m < 1440; m += interval) {
        var state = 'up';
        if (m <= nowMin) state = 'past';
        else if (reached) state = 'skip';
        else if (lastMin !== null && m - lastMin < interval) state = 'skip';
        slots.push({ m: m, state: state });
      }

      var box = $('#slots');
      box.innerHTML = '';
      slots.forEach(function (s, i) {
        var el = document.createElement('span');
        el.className = 'slot' + (s.state !== 'up' ? ' ' + s.state : '');
        el.style.animationDelay = Math.min(i * 18, 400) + 'ms';
        el.textContent = minToClock(s.m);
        el.title = s.state === 'past' ? 'Already passed' : s.state === 'skip' ? 'Skipped' : 'Upcoming';
        box.appendChild(el);
      });

      var tl = $('#timeline');
      var html = '<span class="win" style="left:' + (start / 1440 * 100) + '%;width:' + ((end - start) / 1440 * 100) + '%"></span>';
      slots.forEach(function (s) { html += '<span class="tick' + (s.state !== 'up' ? ' skip' : '') + '" style="left:' + (s.m / 1440 * 100) + '%"></span>'; });
      html += '<span class="now" style="left:' + (nowMin / 1440 * 100) + '%"></span>';
      tl.innerHTML = html;

      var up = slots.filter(function (s) { return s.state === 'up'; }).length;
      var skipped = slots.filter(function (s) { return s.state === 'skip'; }).length;
      var summary = '<b>' + slots.length + '</b> reminders a day · <b>' + up + '</b> still coming today';
      if (reached) summary += ' · today\'s reminders are skipped because the goal is reached 🎉';
      else if (skipped) summary += ' · ' + skipped + ' skipped because you drank recently';
      $('#plannerSummary').innerHTML = summary;

      var left = Math.max(0, demo.goal - todayTotal());
      $('#notifText').textContent = reached ? 'Goal reached — no more reminders today 🎉' : formatVolume(left) + ' left to reach your goal.';
    }

    [iv, st, en].forEach(function (r) { r.addEventListener('input', render); });
    gt.addEventListener('change', function () { userTouchedToggle = true; render(); });
    // Keep the toggle in sync with the demo above unless the visitor flipped it.
    var lastReached = false;
    onDemoChange.push(function () {
      var reached = todayTotal() >= demo.goal;
      if (reached !== lastReached) { lastReached = reached; if (!userTouchedToggle || reached) gt.checked = reached; }
      render();
    });
    render();
  }

  /* ---------- Device detection, download, QR ---------- */
  function initDownload() {
    var ua = navigator.userAgent || '';
    var isAndroid = /Android/i.test(ua);
    var isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    var note = $('#deviceNote');
    if (isAndroid) note.textContent = '✓ You\'re on Android — you\'re all set';
    else if (isIOS) { note.textContent = '⚠ You\'re on iPhone/iPad — not supported'; note.classList.add('warn'); }
    else note.textContent = '💻 On a computer? Scan the QR code below';

    $$('[data-download]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (isIOS) {
          e.preventDefault();
          siteToast('HydraTap is Android-only — the APK can\'t be installed on iPhone or iPad.');
        } else if (isAndroid) {
          siteToast('Downloading HydraTap.apk… open it and allow "Install unknown apps".');
        } else {
          siteToast('Downloading HydraTap.apk — move it to your Android phone, or scan the QR code.');
        }
      });
    });

    var copyBtn = $('#copyLink');
    copyBtn.addEventListener('click', function () {
      function done() { siteToast('Download link copied 📋'); }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(APK_URL).then(done, fallback);
      } else fallback();
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = APK_URL; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { siteToast(APK_URL); }
        document.body.removeChild(ta);
      }
    });

  }

  /* ---------- Boot ---------- */
  document.documentElement.classList.remove('no-js');
  initTheme();
  initHeader();
  initBubbles();
  initHero();
  initFeatures();
  initDemo();
  initSteps();
  initPlanner();
  initDownload();
  initReveal();
  requestAnimationFrame(frame);

  // Space/T taps the sticker while the demo is on screen (and focus isn't in a field).
  document.addEventListener('keydown', function (e) {
    if ((e.key === 't' || e.key === 'T') && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
      var r = document.getElementById('try').getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) tapSticker();
    }
  });
})();
