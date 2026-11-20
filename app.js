/* ============================================================
   COAL Coach — app logic (no dependencies, works from file://)
   ============================================================ */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const STORE = 'coal-coach-v1';
  let ACTIVE = COURSE;
  let ALLQ = [], BY_ID = {}, CARDS = [];

  /* ---------------- icons ---------------- */
  const PATHS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
    book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22z"/><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20"/>',
    cards: '<rect x="3" y="5" width="14" height="14" rx="2"/><path d="M7 2h12a2 2 0 0 1 2 2v14"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5v2a3 3 0 0 0 3 3M16 6h3v2a3 3 0 0 1-3 3"/><path d="M12 13v4M9 20h6M10 17h4"/>',
    bolt: '<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>',
    swap: '<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5M3 17l9 5 9-5"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    route: '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H14a3.5 3.5 0 0 0 0-7h-4a3.5 3.5 0 0 1 0-7h5.5"/>',
    code: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
    binary: '<path d="M7 4h3v6H7zM14 14h3v6h-3z"/><path d="M7 10h3v10H7zM14 4h3v6h-3z"/>',
    check: '<path d="m5 12 5 5L20 7"/>',
    play: '<path d="m7 4 12 8-12 8z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2 6"/><path d="M20 4v7h-7"/>',
    print: '<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 15h12v6H6z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    flag: '<path d="M5 21V4M5 5h12l-2 4 2 4H5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>'
  };
  function icon(name, cls) {
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (PATHS[name] || PATHS.book) + '</svg>';
  }

  /* ---------------- persistence & state ---------------- */
  function defaultProgress() {
    return {
      read: {}, quiz: {}, mockBest: 0, mockCount: 0,
      flash: { known: {}, again: {} },
      plan: [false, false, false, false, false, false],
      theme: 'dark', lang: 'ur', quizMode: 'practice',
      fontScale: 1, focus: false, examDate: '', dailyGoal: 10,
      activity: {}, mockHistory: [], bookmarks: [], notes: {}, pomoSessions: 0
    };
  }
  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORE);
      if (!raw) return defaultProgress();
      const p = JSON.parse(raw);
      return Object.assign(defaultProgress(), p, { flash: Object.assign({ known: {}, again: {} }, p.flash || {}) });
    } catch (e) { return defaultProgress(); }
  }
  const P = loadProgress();

  /* active language + derived references */
  function refreshDataRefs() {
    ACTIVE = (P.lang === 'en' && typeof COURSE_EN !== 'undefined') ? COURSE_EN : COURSE;
    ALLQ = ACTIVE.questions;
    BY_ID = Object.fromEntries(ACTIVE.topics.map((t) => [t.id, t]));
    CARDS = buildCards();
    document.documentElement.lang = P.lang === 'en' ? 'en' : 'ur';
    document.title = P.lang === 'en' ? 'COAL Coach — Midterm Prep (English)' : 'COAL Coach — Midterm Prep';
  }
  function saveProgress() { try { localStorage.setItem(STORE, JSON.stringify(P)); } catch (e) {} }

  const S = {
    tab: 'learn', topicId: null,
    vis: { scenario: {}, step: {} },
    quiz: null, mock: null,
    revTab: 'table', flash: { idx: 0, flipped: false, filter: 'all' },
    labState: {
      cache: { addrBits: 24, block: 4, lines: 16384, ways: 1, hit: 0.9, c: 1, m: 17, h2: 0.9, c2: 25, cmem: 500 },
      bus: { bits: 12 },
      instruction: { hex: '1940' },
      arithmetic: { mode: 'twos', n: 8, x: -18, a: 100, b: 50, mult: 3, mcant: 7, bn: 4, dividend: 7, divisor: 3, dn: 4 }
    },
    busTransfer: 'pc-ar',
    workspaceTab: 'notes', noteTopic: null,
    pomo: { mode: 'focus', seconds: 25 * 60, running: false },
    timer: null, mockTimer: null, pomoTimer: null, speech: null
  };

  function clearTimers() {
    if (S.timer) { clearInterval(S.timer); S.timer = null; }
    if (S.mockTimer) { clearInterval(S.mockTimer); S.mockTimer = null; }
  }

  /* ---------------- small helpers ---------------- */
  function route() { return (location.hash || '#/home').replace(/^#\/?/, '') || 'home'; }
  function go(path) {
    const target = '#/' + path;
    if (location.hash === target) render(true);
    else location.hash = target;
  }
  let toastTimer = null;
  function toast(msg) {
    const el = $('toast');
    el.textContent = P.lang === 'en' ? translateText(msg) : msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2300);
  }

  /* ---------------- localization ---------------- */
  function localize(root) {
    if (typeof UI_EN === 'undefined') return;
    const node = root || document.body;
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((n) => {
      if (n.parentElement && n.parentElement.closest('[data-no-i18n]')) return;
      if (P.lang !== 'en') {
        if (Object.prototype.hasOwnProperty.call(n, '__orig')) { n.nodeValue = n.__orig; delete n.__orig; }
        return;
      }
      const raw = n.nodeValue;
      if (!raw || !raw.trim()) return;
      if (!Object.prototype.hasOwnProperty.call(n, '__orig')) n.__orig = raw;
      const translated = translateText(raw);
      if (translated !== raw) n.nodeValue = translated;
    });
    if (node.querySelectorAll) {
      node.querySelectorAll('[placeholder],[title],[aria-label]').forEach((el) => {
        if (P.lang !== 'en') {
          if (el.__origAttrs) {
            Object.keys(el.__origAttrs).forEach((a) => el.setAttribute(a, el.__origAttrs[a]));
            delete el.__origAttrs;
          }
          return;
        }
        if (!el.__origAttrs) el.__origAttrs = {};
        ['placeholder', 'title', 'aria-label'].forEach((a) => {
          if (!el.hasAttribute(a)) return;
          const val = el.getAttribute(a);
          if (!(a in el.__origAttrs)) el.__origAttrs[a] = val;
          const t = translateText(val);
          if (t !== val) el.setAttribute(a, t);
        });
      });
    }
  }
  function localizeAll() { localize(document.body); }
  function setLang(lang) {
    if (lang !== 'ur' && lang !== 'en') return;
    P.lang = lang; saveProgress(); refreshDataRefs();
    S.flash.filter = 'all'; S.flash.idx = 0; S.flash.flipped = false;
    S.noteTopic = null;
    document.querySelectorAll('[data-lang]').forEach((b) => b.classList.toggle('active', b.dataset.lang === lang));
    stopReading();
    render(false);
    toast(lang === 'en' ? 'Language: English' : 'زبان: روم اردو');
  }

  /* ---------------- activity, streak, goals ---------------- */
  function todayKey() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function logActivity(n) {
    P.activity[todayKey()] = (P.activity[todayKey()] || 0) + (n || 1);
    saveProgress();
  }
  function streakDays() {
    let n = 0;
    const d = new Date();
    for (;;) {
      const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      if (P.activity[key]) { n++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return n;
  }
  function daysToExam() {
    if (!P.examDate) return null;
    const exam = new Date(P.examDate + 'T00:00:00');
    const now = new Date(); now.setHours(0, 0, 0, 0);
    return Math.ceil((exam - now) / 86400000);
  }
  function toggleBookmark(qid) {
    const i = P.bookmarks.indexOf(qid);
    if (i >= 0) { P.bookmarks.splice(i, 1); toast('Bookmark hata diya'); }
    else { P.bookmarks.push(qid); toast('Question bookmarked 🔖'); }
    saveProgress();
  }
  function bookmarkBtn(qid, active) {
    return `<button class="bm-btn${active ? ' on' : ''}" data-bm="${qid}" title="Bookmark">${active ? '🔖' : '☆'}</button>`;
  }
  function stopReading() {
    if (S.speech) { try { window.speechSynthesis.cancel(); } catch (e) {} S.speech = null; }
    document.querySelectorAll('.read-btn.speaking').forEach((b) => b.classList.remove('speaking'));
  }
  function speakText(text, btn) {
    if (!('speechSynthesis' in window)) { toast('Text-to-speech browser mein available nahi hai'); return; }
    const speaking = btn && btn.classList.contains('speaking');
    stopReading();
    if (speaking) { toast('Reading stopped'); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = 0.95;
    u.onend = () => { S.speech = null; if (btn) btn.classList.remove('speaking'); };
    S.speech = u;
    if (btn) btn.classList.add('speaking');
    try { window.speechSynthesis.speak(u); } catch (e) { toast('Audio start nahi hua'); }
  }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function quizAccuracy() {
    const vals = Object.values(P.quiz);
    if (!vals.length) return 0;
    return Math.round(vals.filter((v) => v.correct).length / vals.length * 100);
  }
  function topicQuestions(id) { return ALLQ.filter((q) => q.topic === id); }
  function topicProgress(t) {
    const qs = topicQuestions(t.id);
    const done = qs.filter((q) => P.quiz[q.id]).length;
    return Math.min(100, Math.round((P.read[t.id] ? 45 : 0) + (done / qs.length) * 55));
  }
  function readiness() {
    const read = Object.keys(P.read).length / ACTIVE.topics.length;
    const attempted = Math.min(30, Object.keys(P.quiz).length) / 30;
    const mock = P.mockBest / 100;
    return Math.min(100, Math.round(read * 60 + attempted * 25 + mock * 15));
  }
  function readinessHint(pct) {
    if (pct < 20) return 'Pehla topic padhkar shuru karein.';
    if (pct < 50) return 'Achha! Ab quiz ke saath pakka karein.';
    if (pct < 80) return 'Bahut badhiya — mock test ka time aa gaya.';
    return 'Exam-ready! Revision aur mock ke saath sharp rakhein.';
  }

  /* ---------------- navigation shell ---------------- */
  function navItem(path, label, ico, num, done) {
    const active = route() === path || (path !== 'home' && route().startsWith(path + '/'));
    return '<button class="nav-item' + (active ? ' active' : '') + (done ? ' done' : '') + '" data-go="' + path + '">' +
      '<span class="nav-ico">' + icon(ico) + '</span><span>' + label + '</span>' +
      (num ? '<span class="nav-num">' + num + '</span>' : '') + '</button>';
  }
  function renderNav() {
    $('nav').innerHTML =
      '<div class="nav-label">Study hub</div>' +
      navItem('home', 'Dashboard', 'home') +
      navItem('practice', 'Rapid Fire', 'bolt') +
      navItem('workspace', 'My Workspace', 'flag') +
      navItem('analytics', 'Analytics', 'target') +
      navItem('revision', 'Quick Revision', 'cards') +
      navItem('mock', 'Mock Test', 'trophy') +
      '<div class="nav-label">7 Topics · L1–L8</div>' +
      ACTIVE.topics.map((t) => navItem('topic/' + t.id, t.title.split(' (')[0], t.icon, t.num, !!P.read[t.id])).join('');
    const pct = readiness();
    $('miniPct').textContent = pct + '%';
    $('miniBar').style.width = pct + '%';
    $('miniHint').textContent = readinessHint(pct);
    const left = daysToExam();
    $('sideCountdown').innerHTML = left === null
      ? '<span class="small">' + (P.lang === 'en' ? 'Set exam date in Workspace' : 'Workspace me exam date set karein') + '</span>'
      : '<span class="cd-num">' + left + '</span><span class="small">' + (P.lang === 'en' ? 'days to exam' : 'din baqi exam mein') + '</span>';
  }
  function updateCrumb() {
    const r = route();
    let text = 'Dashboard';
    if (r.startsWith('topic/') && BY_ID[r.split('/')[1]]) text = BY_ID[r.split('/')[1]].title;
    else if (r === 'revision') text = 'Quick Revision';
    else if (r === 'mock') text = 'Mock Test';
    else if (r === 'practice') text = 'Rapid Fire';
    else if (r === 'workspace') text = 'My Workspace';
    else if (r === 'analytics') text = 'Analytics';
    $('crumb').innerHTML = '<b>COAL Coach</b> / ' + text;
  }

  /* ---------------- router ---------------- */
  function render(scroll) {
    clearTimers();
    const r = route();
    const parts = r.split('/');
    $('sidebar').classList.remove('open');
    renderNav();
    updateCrumb();
    if (parts[0] === 'topic' && BY_ID[parts[1]]) renderTopic(BY_ID[parts[1]]);
    else if (parts[0] === 'revision') renderRevision();
    else if (parts[0] === 'mock') renderMock();
    else if (parts[0] === 'practice') renderPractice();
    else if (parts[0] === 'workspace') renderWorkspace();
    else if (parts[0] === 'analytics') renderAnalytics();
    else renderHome();
    localizeAll();
    if (scroll !== false) window.scrollTo({ top: 0, behavior: 'auto' });
  }

  /* ---------------- Dashboard ---------------- */
  function renderHome() {
    const readCount = Object.keys(P.read).length;
    const attempted = Object.keys(P.quiz).length;
    const next = ACTIVE.topics.find((t) => !P.read[t.id]) || ACTIVE.topics[0];
    $('view').innerHTML = `
      <section class="hero-card">
        <span class="eyebrow">Midterm Exam Prep · Lectures 1–8</span>
        <h1>Exam acha chahiye? <span class="hero-gradient">Samajh kar padhein.</span></h1>
        <p class="lead">7 important topics — har ek <strong>Definition → Working → Example → Exam Tip</strong> ke flow mein. Saath me interactive visuals, quizzes, flashcards aur mock test.</p>
        <div class="btn-row">
          <button class="btn primary" data-go="topic/${next.id}">${readCount ? 'Padhai continue karein' : 'Padhai shuru karein'} ${icon('arrow')}</button>
          <button class="btn" data-go="mock">${icon('trophy')} Mock test do</button>
          <button class="btn" data-go="practice">${icon('bolt')} Rapid Fire</button>
          <button class="btn teal" data-go="revision">${icon('cards')} Revision sheet</button>
        </div>
      </section>

      <div class="grid grid-4" style="margin-bottom:22px">
        <div class="card stat-card"><div class="stat-ico">${icon('book')}</div><div><div class="stat-val">${readCount}/7</div><div class="stat-label">Topics padhe gaye</div></div></div>
        <div class="card stat-card"><div class="stat-ico teal">${icon('target')}</div><div><div class="stat-val">${quizAccuracy()}%</div><div class="stat-label">Quiz accuracy</div></div></div>
        <div class="card stat-card"><div class="stat-ico purple">${icon('trophy')}</div><div><div class="stat-val">${P.mockBest || '—'}</div><div class="stat-label">Best mock score</div></div></div>
        <div class="card stat-card"><div class="stat-ico green">${icon('check')}</div><div><div class="stat-val">${attempted}</div><div class="stat-label">Questions practice</div></div></div>
      </div>

      <div class="exam-strip card" style="margin-bottom:22px">
        <div class="strip-item">
          <span class="strip-ico">⏳</span>
          <div><span class="small muted">${P.lang === 'en' ? 'Exam Countdown' : 'Exam Countdown'}</span>
          <strong>${daysToExam() === null ? (P.lang === 'en' ? 'Set date' : 'Date set karein') : daysToExam() + (P.lang === 'en' ? ' days left' : ' din baqi')}</strong></div>
        </div>
        <div class="strip-item">
          <span class="strip-ico">🔥</span>
          <div><span class="small muted">${P.lang === 'en' ? 'Study streak' : 'Study streak'}</span>
          <strong>${streakDays()} ${P.lang === 'en' ? (streakDays() === 1 ? 'day' : 'days') : 'din'}</strong></div>
        </div>
        <div class="strip-item grow">
          <span class="strip-ico">🎯</span>
          <div style="flex:1"><span class="small muted">${P.lang === 'en' ? 'Today\'s goal' : 'Aaj ka target'}: ${P.activity[todayKey()] || 0}/${P.dailyGoal}</span>
          <div class="bar"><div class="bar-fill" style="width:${Math.min(100, ((P.activity[todayKey()] || 0) / P.dailyGoal) * 100)}%"></div></div></div>
        </div>
        <button class="btn sm" data-go="workspace">${P.lang === 'en' ? 'Settings' : 'Settings'}</button>
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:13px">
        <h2 style="margin:0">Sab topics</h2><span class="small muted"> lecture-wise arranged</span>
      </div>
      <div class="grid grid-3" style="margin-bottom:22px">
        ${ACTIVE.topics.map((t) => {
          const pg = topicProgress(t);
          return `<div class="card card hover topic-card">
            <div class="topic-top"><div class="topic-num">${String(t.num).padStart(2, '0')}</div><div><h3>${t.title}</h3><span class="chip" style="margin-top:3px">${t.lecture}</span></div></div>
            <p>${t.blurb}</p>
            <div class="topic-meta"><span class="topic-progress">${pg}% taiyar</span><button class="btn sm" data-go="topic/${t.id}">Padhein ${icon('arrow')}</button></div>
            <div class="bar"><div class="bar-fill" style="width:${pg}%"></div></div>
          </div>`;
        }).join('')}
      </div>

      <div class="grid grid-2">
        <section class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <h3 style="margin:0">⚡ Quick revision</h3><button class="btn sm" data-go="revision">Sab dekhein</button>
          </div>
          <div class="tbl-wrap"><table><tbody>
            ${ACTIVE.revision.slice(0, 6).map((r) => '<tr><td><strong>' + r.topic + '</strong></td><td>' + r.fact + '</td></tr>').join('')}
          </tbody></table></div>
        </section>
        <section class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <h3 style="margin:0">📅 3-din ka plan</h3><span class="chip">${P.plan.filter(Boolean).length}/${P.plan.length}</span>
          </div>
          ${ACTIVE.plan.map((item, i) => `<label class="plan-item${P.plan[i] ? ' done' : ''}"><input type="checkbox" data-plan="${i}" ${P.plan[i] ? 'checked' : ''}><span>${item}</span></label>`).join('')}
        </section>
      </div>`;
    $('view').querySelectorAll('[data-plan]').forEach((cb) => cb.addEventListener('change', () => {
      P.plan[+cb.dataset.plan] = cb.checked; saveProgress(); renderHome();
    }));
  }

  /* ---------------- Topic page ---------------- */
  function renderTopic(t) {
    if (S.topicId !== t.id) { S.tab = 'learn'; S.topicId = t.id; }
    if (S.tab === 'lab' && !t.lab) S.tab = 'learn';
    const tabs = [
      { k: 'learn', l: '📖 Padhein', i: 'book' },
      { k: 'visual', l: '🎬 Visual', i: 'play' },
      ...(t.lab ? [{ k: 'lab', l: '🧮 Lab / Numericals', i: 'target' }] : []),
      { k: 'quiz', l: '✅ Quiz', i: 'check' }
    ];
    const idx = ACTIVE.topics.indexOf(t);
    const prev = ACTIVE.topics[idx - 1], next = ACTIVE.topics[idx + 1];
    $('view').innerHTML = `
      <div class="topic-hero">
        <div class="topic-hero-main">
          <div class="big-num">${String(t.num).padStart(2, '0')}</div>
          <div>
            <span class="eyebrow">${t.lecture}</span>
            <h1>${t.title}</h1>
            <p class="lead small">${t.blurb}</p>
          </div>
        </div>
        <div class="btn-row">
          <button class="btn sm" id="printBtn">${icon('print')} Print</button>
          <button class="btn sm ${P.read[t.id] ? 'teal' : 'primary'}" id="completeBtn">${P.read[t.id] ? icon('check') + ' Padha hua' : 'Mark complete'}</button>
        </div>
      </div>
      <div class="tabs">${tabs.map((x) => `<button class="tab${S.tab === x.k ? ' active' : ''}" data-tab="${x.k}">${x.l}</button>`).join('')}</div>
      <div id="topicPane"></div>
      <div class="btn-row" style="margin-top:22px;justify-content:space-between">
        ${prev ? `<button class="btn sm" data-go="topic/${prev.id}">← ${prev.title.split(' (')[0]}</button>` : '<span></span>'}
        ${next ? `<button class="btn sm" data-go="topic/${next.id}">${next.title.split(' (')[0]} →</button>` : '<span></span>'}
      </div>`;

    $('view').querySelectorAll('[data-tab]').forEach((b) => b.addEventListener('click', () => { clearTimers(); S.tab = b.dataset.tab; renderTopic(t); }));
    $('completeBtn').addEventListener('click', () => {
      P.read[t.id] = !P.read[t.id]; saveProgress(); toast(P.read[t.id] ? 'Topic complete! ✓' : 'Mark complete hata diya'); render(false);
    });
    $('printBtn').addEventListener('click', () => window.print());
    renderTopicPane(t);
  }

  function renderTopicPane(t) {
    if (S.tab === 'learn') {
      $('topicPane').innerHTML =
        t.sections.map((s, i) => `<section class="section-block" id="sec-${i}"><div class="section-head"><span class="mark"></span><h3>${s.h}</h3><button class="read-btn" data-read="${i}" title="${P.lang === 'en' ? 'Read aloud' : 'Read aloud'}">🔊</button></div><div class="section-body" data-no-i18n>${s.body}</div></section>`).join('') +
        `<section class="card"><h3 style="margin-bottom:10px">🔑 Yaad rakhne wale points</h3><div class="keypoints">${t.keypoints.map((k) => `<div class="keypoint"><b>✦</b><span>${k}</span></div>`).join('')}</div></section>`;
      $('topicPane').querySelectorAll('[data-read]').forEach((b) => b.addEventListener('click', () => {
        const sec = t.sections[+b.dataset.read];
        const text = sec.h + '. ' + sec.body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        speakText(text, b);
      }));
    } else if (S.tab === 'visual') {
      if (t.specialVisual === 'bus') renderBusVisual();
      else renderStepPlayer(t);
    } else if (S.tab === 'lab') {
      $('topicPane').innerHTML = '<div id="labRoot"></div>';
      initLab(t.lab);
    } else if (S.tab === 'quiz') {
      startQuiz(t.id);
    }
  }

  /* ---------------- Generic step visual ---------------- */
  function renderStepPlayer(t) {
    const vis = t.visual;
    if (!vis) return;
    const si = Math.min(S.vis.scenario[t.id] || 0, vis.scenarios.length - 1);
    const sc = vis.scenarios[si];
    const step = Math.min(S.vis.step[t.id] || 0, sc.steps.length - 1);
    $('topicPane').innerHTML = `
      <div class="visual-head">
        <div><h2 style="margin:0">${vis.title}</h2><span class="small muted">Step-by-step animation — samajhne ke liye</span></div>
        <div class="scenario-tabs">${vis.scenarios.map((s, i) => `<button class="chip${i === si ? ' accent' : ''}" data-sc="${i}" style="cursor:pointer">${s.name}</button>`).join('')}</div>
      </div>
      <div class="step-stage">
        <div class="step-top"><div class="step-badge">${step + 1}</div><div><h3 id="stepTitle">${sc.steps[step].t}</h3><small>${sc.name}</small></div></div>
        <div class="step-body" id="stepBody">${sc.steps[step].body}</div>
        <div class="step-controls">
          <button class="btn sm" id="stepPrev" ${step === 0 ? 'disabled' : ''}>← Pehle</button>
          <button class="btn sm primary" id="stepPlay">${icon('play')} Auto play</button>
          <button class="btn sm" id="stepNext" ${step === sc.steps.length - 1 ? 'disabled' : ''}>Agle →</button>
          <span class="step-count" id="stepCount">Step ${step + 1} / ${sc.steps.length}</span>
          <div class="step-dots">${sc.steps.map((_, i) => `<button class="step-dot${i === step ? ' on' : ''}" data-step="${i}" aria-label="Step ${i + 1}"></button>`).join('')}</div>
        </div>
      </div>`;
    const showStep = (n) => { S.vis.step[t.id] = n; renderStepPlayer(t); };
    $('view').querySelectorAll('[data-sc]').forEach((b) => b.addEventListener('click', () => {
      S.vis.scenario[t.id] = +b.dataset.sc; S.vis.step[t.id] = 0; renderStepPlayer(t);
    }));
    $('stepPrev').addEventListener('click', () => showStep(step - 1));
    $('stepNext').addEventListener('click', () => showStep(step + 1));
    $('view').querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => showStep(+b.dataset.step)));
    $('stepPlay').addEventListener('click', () => {
      if (S.timer) { clearInterval(S.timer); S.timer = null; $('stepPlay').innerHTML = icon('play') + ' Auto play'; return; }
      $('stepPlay').innerHTML = icon('pause') + ' Rokein';
      S.timer = setInterval(() => {
        const cur = S.vis.step[t.id] || 0;
        const last = vis.scenarios[S.vis.scenario[t.id] || 0].steps.length - 1;
        if (cur >= last) { clearInterval(S.timer); S.timer = null; renderStepPlayer(t); return; }
        S.vis.step[t.id] = cur + 1; renderStepPlayer(t);
        const btn = $('stepPlay'); if (btn) btn.innerHTML = icon('pause') + ' Rokein';
      }, 2400);
    });
  }

  /* ---------------- Register bus visual ---------------- */
  const BUS_TRANSFERS = {
    'pc-ar': { src: 'PC', dst: 'AR', sel: '010', desc: 'S2 S1 S0 = 010 → PC bus par. AR ka LD enable → AR ← PC. Ye T0 par hota hai (instruction ka address).' },
    'dr-ac': { src: 'DR', dst: 'AC', sel: '001', desc: 'Memory se aaya operand pehle DR mein, phir bus se AC mein — yahi LDA ka T5 hai (AC ← DR).' },
    'ac-drmem': { src: 'AC', dst: 'Memory', sel: '000', desc: 'STA mein AC ka data seedha memory mein likha jata hai: M[AR] ← AC. Address hamesha AR se aata hai.' },
    'ir-addr': { src: 'IR', dst: 'AR', sel: '011', desc: 'T2 par instruction ke address bits IR(0–11) se AR mein jate hain; I bit alag save hoti hai.' },
    'inpr-out': { src: 'INPR', dst: 'OUTR', sel: '110', desc: 'INPR bus par data deta hai; OUTR sirf receive karta hai. Direct INPR → OUTR nahi — AC ke through hota hai.' }
  };
  function renderBusVisual() {
    const key = S.busTransfer;
    const tr = BUS_TRANSFERS[key];
    $('topicPane').innerHTML = `
      <div class="visual-head"><div><h2 style="margin:0">Common Bus System</h2><span class="small muted">Source select karo → bus → destination ka LD enable</span></div></div>
      <div class="bus-diagram">
        <div class="small muted" style="margin-bottom:10px">Register bank</div>
        <div class="reg-row">
          ${['DR', 'AR', 'AC', 'IR', 'PC', 'TR', 'INPR', 'OUTR'].map((r) => `<div class="reg-chip${r === tr.src ? ' src' : ''}${r === tr.dst ? ' dst' : ''}">${r}</div>`).join('')}
        </div>
        <div class="bus-line"></div>
        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px" class="small muted">
          <span>Selection lines: <code class="mono">S2 S1 S0 = ${tr.sel}</code></span>
          <span>Bus width: 16 bits · AR/PC = 12 bits</span>
        </div>
        <div class="callout tip" style="margin-bottom:0"><strong>${tr.src} → ${tr.dst}:</strong> ${tr.desc}</div>
        <div class="transfer-btns">${Object.entries(BUS_TRANSFERS).map(([k, v]) => `<button class="btn sm${k === key ? ' primary' : ''}" data-transfer="${k}">${v.src} → ${v.dst}</button>`).join('')}</div>
      </div>`;
    $('topicPane').querySelectorAll('[data-transfer]').forEach((b) => b.addEventListener('click', () => { S.busTransfer = b.dataset.transfer; renderBusVisual(); }));
  }

  /* ---------------- Rapid Fire drill ---------------- */
  function renderPractice() {
    $('view').innerHTML = `
      <div class="page-head"><span class="eyebrow">Mixed practice · 10 questions</span><h1>Rapid Fire ⚡</h1><p class="lead">Sab topics se 10 random questions — turant feedback ke saath. Exam se pehle mind warm karne ke liye best.</p></div>
      <div id="topicPane"></div>`;
    if (!S.quiz || S.quiz.topic !== null || S.quiz.finished) {
      S.quiz = { topic: null, list: shuffle(ALLQ).slice(0, 10), idx: 0, answers: {}, logged: {}, finished: false };
    }
    renderQuizPane();
  }

  /* ---------------- Quiz ---------------- */
  function startQuiz(topicId) {
    S.quiz = { topic: topicId, idx: 0, answers: {}, logged: {}, finished: false };
    renderQuizPane();
  }
  function renderQuizPane() {
    const qz = S.quiz;
    const list = qz.list || (qz.topic ? topicQuestions(qz.topic) : ALLQ);
    const exam = P.quizMode === 'exam';
    const titleText = (qz.topic && BY_ID[qz.topic]) ? BY_ID[qz.topic].title : 'Rapid Fire · 10 questions';
    if (qz.finished) {
      const correct = list.filter((q) => qz.answers[q.id] === q.a).length;
      const pct = Math.round(correct / list.length * 100);
      $('topicPane').innerHTML = `
        <div class="quiz-wrap"><div class="card result-card">
          <div class="score-ring" style="--pct:${pct}"><div><strong>${pct}%</strong><small>${correct} / ${list.length} sahi</small></div></div>
          <h2>${pct >= 80 ? 'Bahut badhiya! 🎉' : pct >= 50 ? 'Thoda aur practice karein 💪' : 'Revision zaroori hai 📖'}</h2>
          <p>${titleText} — quiz khatam.</p>
          <div class="btn-row" style="justify-content:center">
            <button class="btn primary" id="quizRetry">${icon('refresh')} Dobara karein</button>
            <button class="btn" id="quizLearn">Padhein wapas</button>
          </div>
        </div>
        <h3 style="margin-top:22px">Answer review</h3>
        ${list.map((q, i) => {
          const ans = qz.answers[q.id];
          return `<div class="review-item"><span class="${ans === q.a ? 'ok' : 'no'}">${ans === q.a ? '✓' : '✗'}</span> <strong>Q${i + 1}. ${q.q}</strong> ${bookmarkBtn(q.id, P.bookmarks.includes(q.id))}<br><span class="muted">Sahi: ${q.o[q.a]}</span>${ans !== q.a && ans !== undefined ? '<br><span class="muted">Aapne: ' + q.o[ans] + '</span>' : '<br><span class="muted">Aapne: — (attempt nahi kiya)</span>'}<br><span class="small muted">${q.why}</span></div>`;
        }).join('')}</div>`;
      $('quizRetry').addEventListener('click', () => startQuiz(qz.topic));
      $('quizLearn').addEventListener('click', () => {
        if (qz.topic && BY_ID[qz.topic]) { S.tab = 'learn'; renderTopic(BY_ID[qz.topic]); }
        else go('home');
      });
      return;
    }
    const q = list[qz.idx];
    const chosen = qz.answers[q.id];
    const answered = chosen !== undefined;
    const showFeedback = answered && !exam;
    $('topicPane').innerHTML = `
      <div class="quiz-wrap">
        <div class="quiz-top"><strong>${titleText}</strong><div class="bar"><div class="bar-fill" style="width:${(qz.idx / list.length) * 100}%"></div></div><span class="small muted">${qz.idx + 1}/${list.length}</span></div>
        <div class="mode-row">
          <div class="mode-switch">
            <button data-mode="practice" class="${!exam ? 'on' : ''}">Practice</button>
            <button data-mode="exam" class="${exam ? 'on' : ''}">Exam</button>
          </div>
          <span class="small muted">Practice mode: turant feedback. Exam mode: result par review.</span>
        </div>
        <div class="q-card">
          <div class="q-index" style="display:flex;align-items:center;justify-content:space-between;gap:10px">
            <span>Question ${qz.idx + 1} of ${list.length}</span>
            ${bookmarkBtn(q.id, P.bookmarks.includes(q.id))}
          </div>
          <div class="q-text">${q.q}</div>
          ${q.o.map((o, i) => {
            let cls = '';
            if (showFeedback) { if (i === q.a) cls = ' correct'; else if (i === chosen) cls = ' wrong'; }
            else if (exam && i === chosen) cls = ' selected';
            return `<button class="opt${cls}" data-opt="${i}" ${showFeedback ? 'disabled' : ''}><span class="letter">${'ABCD'[i]}</span><span>${o}</span></button>`;
          }).join('')}
          ${showFeedback ? `<div class="feedback ${chosen === q.a ? 'good' : 'bad'}"><b>${chosen === q.a ? '✓ Sahi!' : '✗ Galat — sahi jawab: ' + q.o[q.a]}</b>${q.why}</div>` : ''}
          ${exam ? '<div class="callout" style="margin-top:12px"><strong>Exam mode:</strong> feedback result ke baad milega. Jawab badalne ke liye doosra option dabayein.</div>' : ''}
          <div class="btn-row" style="margin-top:18px">
            ${qz.idx > 0 ? '<button class="btn sm" id="qPrev">← Pehle</button>' : ''}
            <button class="btn primary" id="qNext" ${!exam && !answered ? 'disabled' : ''}>${qz.idx === list.length - 1 ? 'Result dekhein' : 'Agle question →'}</button>
            <span class="small muted">Tip: option ke liye 1–4 dabayein</span>
          </div>
        </div>
      </div>`;
    $('topicPane').querySelectorAll('[data-opt]').forEach((b) => b.addEventListener('click', () => {
      const pick = +b.dataset.opt;
      if (exam) {
        qz.answers[q.id] = pick;
        if (!qz.logged[q.id]) {
          qz.logged[q.id] = true;
          const prevE = P.quiz[q.id] || { attempts: 0, correct: false };
          P.quiz[q.id] = { attempts: prevE.attempts + 1, correct: pick === q.a };
          logActivity(1); saveProgress();
        }
        renderQuizPane(); return;
      }
      if (answered) return;
      qz.answers[q.id] = pick;
      const prev = P.quiz[q.id] || { attempts: 0, correct: false };
      P.quiz[q.id] = { attempts: prev.attempts + 1, correct: pick === q.a };
      logActivity(1);
      saveProgress();
      toast(pick === q.a ? 'Sahi! ✓' : 'Galat — sahi jawab neeche diya gaya');
      renderQuizPane();
    }));
    if ($('qPrev')) $('qPrev').addEventListener('click', () => { qz.idx--; renderQuizPane(); });
    $('qNext').addEventListener('click', () => {
      if (qz.idx === list.length - 1) {
        qz.finished = true;
        P.quizMode = exam ? 'practice' : P.quizMode;
        saveProgress(); renderNav();
      } else qz.idx++;
      renderQuizPane();
    });
  }

  /* ---------------- Mock test ---------------- */
  function renderMock() {
    if (!S.mock) {
      $('view').innerHTML = `
        <div class="page-head"><span class="eyebrow">Exam simulation</span><h1>Mock Test</h1><p class="lead">20 random questions — 20 minute timer. Sab topics se mix, bilkul exam jaisa.</p></div>
        <div class="grid grid-3">
          <div class="card"><div style="font-size:26px">⏱️</div><h3 style="margin-top:8px">20 minutes</h3><p class="small">Timer khatam ya submit — jo pehle ho.</p></div>
          <div class="card"><div style="font-size:26px">🎯</div><h3 style="margin-top:8px">20 questions</h3><p class="small">Interrupts se lekar Binary Arithmetic tak.</p></div>
          <div class="card"><div style="font-size:26px">📊</div><h3 style="margin-top:8px">Detailed review</h3><p class="small">Har galat jawab ke saath explanation.</p></div>
        </div>
        ${P.mockBest ? `<div class="callout tip" style="margin-top:18px"><strong>Best score:</strong> ${P.mockBest}% · ${P.mockCount} mock${P.mockCount > 1 ? 's' : ''} diye. Target: 80%+.</div>` : ''}
        <div class="btn-row" style="margin-top:20px"><button class="btn primary" id="startMock">${icon('play')} Test shuru karein</button></div>`;
      $('startMock').addEventListener('click', startMock);
      return;
    }
    if (!S.mockTimer) {
      S.mockTimer = setInterval(() => {
        if (!S.mock || S.mock.finished) return;
        S.mock.seconds--;
        const el = $('timerText');
        if (el) {
          const m = Math.floor(S.mock.seconds / 60), s = S.mock.seconds % 60;
          el.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
          el.classList.toggle('low', S.mock.seconds < 120);
        }
        if (S.mock.seconds <= 0) { toast('Time ho gaya! Result...'); submitMock(); }
      }, 1000);
    }
    renderMockPane();
  }
  function startMock() {
    S.mock = {
      questions: shuffle(ALLQ).slice(0, 20), idx: 0, answers: {}, marked: {}, logged: {},
      seconds: 20 * 60, finished: false
    };
    S.mockTimer = setInterval(() => {
      if (!S.mock || S.mock.finished) return;
      S.mock.seconds--;
      const el = $('timerText');
      if (el) {
        const m = Math.floor(S.mock.seconds / 60), s = S.mock.seconds % 60;
        el.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
        el.classList.toggle('low', S.mock.seconds < 120);
      }
      if (S.mock.seconds <= 0) { toast('Time ho gaya! Result...'); submitMock(); }
    }, 1000);
    renderMockPane();
  }
  function renderMockPane() {
    const mk = S.mock;
    if (mk.finished) {
      const correct = mk.questions.filter((q) => mk.answers[q.id] === q.a).length;
      const pct = Math.round(correct / mk.questions.length * 100);
      $('view').innerHTML = `<div class="quiz-wrap"><div class="card result-card">
        <div class="score-ring" style="--pct:${pct}"><div><strong>${pct}%</strong><small>${correct} / ${mk.questions.length} sahi</small></div></div>
        <h2>${pct >= 80 ? 'Exam ke liye ready! 🎉' : pct >= 60 ? 'Accha hai, thoda aur revise karein 💪' : 'Revision + practice zaroori 📖'}</h2>
        <p>Best score: ${P.mockBest}%</p>
        <div class="btn-row" style="justify-content:center"><button class="btn primary" id="mockAgain">${icon('refresh')} Naya mock</button><button class="btn" data-go="revision">Revision sheet</button></div>
      </div>
      <h3 style="margin-top:22px">Detailed review</h3>
      ${mk.questions.map((q, i) => {
        const ans = mk.answers[q.id];
        return `<div class="review-item"><span class="${ans === q.a ? 'ok' : 'no'}">${ans === q.a ? '✓' : '✗'}</span> <strong>Q${i + 1}. ${q.q}</strong> ${bookmarkBtn(q.id, P.bookmarks.includes(q.id))}<br><span class="muted">Sahi: ${q.o[q.a]}</span>${ans !== undefined && ans !== q.a ? '<br><span class="muted">Aapne: ' + q.o[ans] + '</span>' : '<br><span class="muted">Aapne: — (attempt nahi kiya)</span>'}<br><span class="small muted">${q.why}</span></div>`;
      }).join('')}</div>`;
      $('mockAgain').addEventListener('click', () => { clearTimers(); startMock(); });
      return;
    }
    const q = mk.questions[mk.idx];
    const chosen = mk.answers[q.id];
    const m = Math.floor(mk.seconds / 60), s = mk.seconds % 60;
    $('view').innerHTML = `
      <div class="mock-bar">
        <span class="timer" id="timerText">${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}</span>
        <strong>Question ${mk.idx + 1} / ${mk.questions.length}</strong>
        <span class="chip">${BY_ID[q.topic].title.split(' (')[0]}</span>
        <button class="btn sm" id="markBtn" style="margin-left:auto">${mk.marked[q.id] ? '★ Marked' : '☆ Mark for review'}</button>
        <button class="btn sm primary" id="submitMock">Submit test</button>
      </div>
      <div class="palette">${mk.questions.map((qq, i) => `<button class="${mk.answers[qq.id] !== undefined ? 'answered ' : ''}${mk.marked[qq.id] ? 'marked ' : ''}${i === mk.idx ? 'current' : ''}" data-q="${i}">${i + 1}</button>`).join('')}</div>
      <div class="q-card">
        <div class="q-index" style="display:flex;align-items:center;justify-content:space-between;gap:10px"><span>${BY_ID[q.topic].title} · ${BY_ID[q.topic].lecture}</span>${bookmarkBtn(q.id, P.bookmarks.includes(q.id))}</div>
        <div class="q-text">${q.q}</div>
        ${q.o.map((o, i) => `<button class="opt${chosen === i ? ' selected' : ''}" data-opt="${i}"><span class="letter">${'ABCD'[i]}</span><span>${o}</span></button>`).join('')}
        <div class="btn-row" style="margin-top:18px">
          <button class="btn sm" id="mPrev" ${mk.idx === 0 ? 'disabled' : ''}>← Pehle</button>
          <button class="btn sm" id="mNext" ${mk.idx === mk.questions.length - 1 ? 'disabled' : ''}>Agle →</button>
          <span class="small muted">Jawab badalne ke liye dobara click karein. Palette se jump kar sakte hain.</span>
        </div>
      </div>`;
    $('view').querySelectorAll('[data-opt]').forEach((b) => b.addEventListener('click', () => {
      const pick = +b.dataset.opt;
      if (mk.answers[q.id] === pick) delete mk.answers[q.id]; else mk.answers[q.id] = pick;
      if (!mk.logged) mk.logged = {};
      if (mk.answers[q.id] !== undefined && !mk.logged[q.id]) { mk.logged[q.id] = true; logActivity(1); }
      renderMockPane();
    }));
    $('view').querySelectorAll('[data-q]').forEach((b) => b.addEventListener('click', () => { mk.idx = +b.dataset.q; renderMockPane(); }));
    if ($('mPrev')) $('mPrev').addEventListener('click', () => { mk.idx--; renderMockPane(); });
    if ($('mNext')) $('mNext').addEventListener('click', () => { mk.idx++; renderMockPane(); });
    $('markBtn').addEventListener('click', () => { if (mk.marked[q.id]) delete mk.marked[q.id]; else mk.marked[q.id] = true; renderMockPane(); });
    $('submitMock').addEventListener('click', submitMock);
  }
  function submitMock() {
    if (!S.mock || S.mock.finished) return;
    clearTimers();
    const mk = S.mock;
    mk.finished = true;
    const correct = mk.questions.filter((q) => mk.answers[q.id] === q.a).length;
    const pct = Math.round(correct / mk.questions.length * 100);
    P.mockBest = Math.max(P.mockBest, pct);
    P.mockCount = (P.mockCount || 0) + 1;
    P.mockHistory = (P.mockHistory || []).concat({ date: todayKey(), score: pct }).slice(-20);
    mk.questions.forEach((q) => {
      const prev = P.quiz[q.id] || { attempts: 0, correct: false };
      P.quiz[q.id] = { attempts: prev.attempts + 1, correct: mk.answers[q.id] === q.a };
    });
    saveProgress();
    toast('Test submit ho gaya!');
    render(false);
  }

  /* ---------------- Revision + flashcards ---------------- */
  function buildCards() {
    const cards = ACTIVE.revision.map((r) => ({ topic: r.topic, front: r.topic, back: r.fact }));
    ACTIVE.topics.forEach((t) => t.keypoints.forEach((k) => cards.push({ topic: t.title.split(' (')[0], front: t.title.split(' (')[0] + ' — ek aur yaad rakhne wali baat', back: k })));
    return cards;
  }
  function renderRevision() {
    $('view').innerHTML = `
      <div class="page-head"><span class="eyebrow">Exam ke pehle wala page</span><h1>Quick Revision</h1><p class="lead">Ek page mein poora summary — aur flashcards active recall ke liye.</p></div>
      <div class="mini-tabs">
        <button class="mini-tab${S.revTab === 'table' ? ' active' : ''}" data-rev="table">📋 Revision sheet</button>
        <button class="mini-tab${S.revTab === 'cards' ? ' active' : ''}" data-rev="cards">🃏 Flashcards (${CARDS.length})</button>
      </div>
      <div id="revPane"></div>`;
    $('view').querySelectorAll('[data-rev]').forEach((b) => b.addEventListener('click', () => { S.revTab = b.dataset.rev; renderRevision(); }));
    if (S.revTab === 'table') {
      $('revPane').innerHTML = `<div class="card"><div class="tbl-wrap"><table><thead><tr><th>Topic</th><th>Yaad rakhne wali cheez</th></tr></thead><tbody>
        ${ACTIVE.revision.map((r) => `<tr><td><strong>${r.topic}</strong></td><td>${r.fact}</td></tr>`).join('')}
      </tbody></table></div></div>
      <div class="callout tip" style="margin-top:16px"><strong>Exam tip:</strong> Is table ko subah aur shaam 5-5 minute dobara padhein. Flashcards se khud se test lein — sirf dekhna kaafi nahi.</div>`;
    } else renderFlash();
  }
  function renderFlash() {
    const topics = [...new Set(CARDS.map((c) => c.topic))];
    const filtered = S.flash.filter === 'all' ? CARDS : CARDS.filter((c) => c.topic === S.flash.filter);
    if (S.flash.idx >= filtered.length) S.flash.idx = 0;
    const c = filtered[S.flash.idx];
    $('revPane').innerHTML = `<div class="flash-wrap">
      <div class="btn-row" style="margin-bottom:14px">
        <select id="flashFilter" class="btn sm" style="padding:7px 10px">
          <option value="all">Sab topics</option>
          ${topics.map((t) => `<option value="${t}"${S.flash.filter === t ? ' selected' : ''}>${t}</option>`).join('')}
        </select>
        <span class="chip">${S.flash.idx + 1} / ${filtered.length}</span>
        <span class="small muted">Card par click karke flip karein</span>
      </div>
      <div class="flip-card${S.flash.flipped ? ' flipped' : ''}" id="flipCard">
        <div class="flip-inner">
          <div class="flip-face"><div class="face-label">${c.topic}</div><div class="face-text">${c.front}</div></div>
          <div class="flip-face back"><div class="face-label">Jawab</div><div class="face-text">${c.back}</div></div>
        </div>
      </div>
      <div class="flip-hint">Space dabayein ya card click karein</div>
      <div class="btn-row" style="justify-content:center;margin-top:16px">
        <button class="btn sm" id="fPrev">← Pehle</button>
        <button class="btn sm teal" id="fKnown">${icon('check')} Samajh gaya</button>
        <button class="btn sm" id="fAgain">${icon('refresh')} Dobara</button>
        <button class="btn sm" id="fNext">Agle →</button>
      </div>
    </div>`;
    $('flashFilter').addEventListener('change', (e) => { S.flash.filter = e.target.value; S.flash.idx = 0; S.flash.flipped = false; renderFlash(); });
    $('flipCard').addEventListener('click', () => { S.flash.flipped = !S.flash.flipped; renderFlash(); });
    const move = (d) => { S.flash.idx = (S.flash.idx + d + filtered.length) % filtered.length; S.flash.flipped = false; renderFlash(); };
    $('fPrev').addEventListener('click', () => move(-1));
    $('fNext').addEventListener('click', () => move(1));
    $('fKnown').addEventListener('click', () => { P.flash.known[c.back] = true; delete P.flash.again[c.back]; saveProgress(); toast('Known list mein add hua ✓'); move(1); });
    $('fAgain').addEventListener('click', () => { P.flash.again[c.back] = true; saveProgress(); toast('Dobara revise karenge — note kar liya'); move(1); });
  }

  /* ---------------- Lab helpers ---------------- */
  function log2int(n) { const v = Math.log2(n); return Number.isInteger(v) ? v : null; }
  function zeros(n) { return '0'.repeat(n); }
  function toBits(num, n) {
    const mask = Math.pow(2, n) - 1;
    return (num & mask >>> 0).toString(2).padStart(n, '0').slice(-n);
  }
  function fromBits(str) {
    const u = parseInt(str, 2);
    return str[0] === '1' ? u - Math.pow(2, str.length) : u;
  }
  function field(label, id, value, extra) {
    return `<div class="field"><label for="${id}">${label}</label><input id="${id}" type="${extra && extra.type || 'number'}" value="${value}" ${extra && extra.attrs || ''}></div>`;
  }

  function initLab(kind) {
    if (kind === 'cache') initCacheLab();
    else if (kind === 'bus') initBusLab();
    else if (kind === 'instruction') initInstructionLab();
    else if (kind === 'arithmetic') initArithmeticLab();
  }

  /* ---- Cache lab ---- */
  function initCacheLab() {
    const s = S.labState.cache;
    $('labRoot').innerHTML = `
      <div class="lab-grid">
        <div class="card">
          <h3 style="margin-bottom:12px">🧮 Cache Calculator</h3>
          ${field('Address bits', 'cAddr', s.addrBits, { attrs: 'min=4 max=64' })}
          ${field('Block size (bytes)', 'cBlock', s.block, { attrs: 'min=1 max=1024' })}
          ${field('Number of cache lines', 'cLines', s.lines, { attrs: 'min=1' })}
          <div class="field"><label for="cWays">Associativity</label><select id="cWays">
            <option value="1"${s.ways === 1 ? ' selected' : ''}>Direct mapped (1-way)</option>
            <option value="2"${s.ways === 2 ? ' selected' : ''}>2-way set associative</option>
            <option value="4"${s.ways === 4 ? ' selected' : ''}>4-way set associative</option>
            <option value="8"${s.ways === 8 ? ' selected' : ''}>8-way set associative</option>
            <option value="full"${s.ways === 'full' ? ' selected' : ''}>Fully associative</option>
          </select></div>
          <div class="field-row">
            ${field('Hit ratio h', 'cHit', s.hit, { attrs: 'min=0 max=1 step=0.01' })}
            ${field('Cache time C', 'cC', s.c, { attrs: 'min=0' })}
            ${field('Memory time M', 'cM', s.m, { attrs: 'min=0' })}
            ${field('L2 hit h₂', 'cH2', s.h2, { attrs: 'min=0 max=1 step=0.01' })}
            ${field('L2 time', 'cC2', s.c2, { attrs: 'min=0' })}
            ${field('Mem cycles (CPI)', 'cCM', s.cmem, { attrs: 'min=1' })}
          </div>
          <button class="btn primary sm" id="cCalc">${icon('refresh')} Hisaab karein</button>
        </div>
        <div class="card" id="cOut"></div>
      </div>`;
    const read = () => {
      s.addrBits = +$('cAddr').value || 24; s.block = +$('cBlock').value || 4; s.lines = +$('cLines').value || 16;
      s.ways = $('cWays').value === 'full' ? 'full' : +$('cWays').value;
      s.hit = +$('cHit').value; s.c = +$('cC').value; s.m = +$('cM').value;
      s.h2 = +$('cH2').value; s.c2 = +$('cC2').value; s.cmem = +$('cCM').value;
    };
    const calc = () => { read(); const out = computeCache(s); $('cOut').innerHTML = out; };
    $('cCalc').addEventListener('click', calc);
    $('labRoot').querySelectorAll('input,select').forEach((el) => el.addEventListener('change', calc));
    calc();
  }
  function computeCache(s) {
    const w = log2int(s.block), lineBits = log2int(s.lines);
    if (w === null || lineBits === null) return '<div class="callout warn"><strong>Input check karein:</strong> Block size aur number of lines dono 2 ki power hone chahiye (1, 2, 4, 8, 16...).</div>';
    const full = s.ways === 'full';
    const sets = full ? 1 : s.lines / s.ways;
    const setBits = full ? 0 : log2int(sets);
    if (setBits === null) return '<div class="callout warn"><strong>Input check karein:</strong> lines ÷ ways bhi 2 ki power hona chahiye.</div>';
    const tag = s.addrBits - setBits - w;
    if (tag < 0) return '<div class="callout warn"><strong>Address bits kam hain:</strong> tag negative aa raha hai — address bits badayein ya cache chhoti karein.</div>';
    const indexLabel = full ? 'Index' : (s.ways === 1 ? 'Line' : 'Set');
    const bitsHtml = `<div class="bits-box"><div class="bits-title">Address format (${s.addrBits} bits)</div>
      <div class="bits"><span class="f-tag">Tag ${tag}</span> ${!full ? '| <span class="f-idx">' + indexLabel + ' ' + setBits + '</span> |' : ''} <span class="f-word">Word ${w}</span></div></div>`;
    const formula = full ? `Tag = ${s.addrBits} − 0 − ${w} = ${tag} bits (fully associative: index bits nahi)` :
      `${indexLabel} bits = log₂(${sets}) = ${setBits} · Word = log₂(${s.block}) = ${w} · Tag = ${s.addrBits} − ${setBits} − ${w} = ${tag}`;
    const t1 = s.hit * s.c + (1 - s.hit) * s.m;
    const t2 = s.hit * s.c + (1 - s.hit) * s.h2 * s.c2 + (1 - s.hit) * (1 - s.h2) * s.m;
    const cpi0 = 1 + s.cmem, cpi1 = 1 + (1 - s.hit) * s.cmem, cpi2 = 1 + (1 - s.hit) * (s.c2 + (1 - s.h2) * s.cmem);
    return `<h3 style="margin-bottom:10px">Result</h3>${bitsHtml}
      <div class="result-line"><span>Total lines</span><strong>${s.lines.toLocaleString()}</strong></div>
      <div class="result-line"><span>Ways</span><strong>${full ? 'Fully associative' : s.ways + '-way'}</strong></div>
      <div class="result-line"><span>Sets</span><strong>${sets.toLocaleString()}</strong></div>
      <div class="result-line"><span>Tag bits</span><strong style="color:var(--accent)">${tag}</strong></div>
      <div class="result-line"><span>${indexLabel} bits</span><strong>${setBits}</strong></div>
      <div class="result-line"><span>Word/offset bits</span><strong>${w}</strong></div>
      <div class="formula">${formula}</div>
      <h3 style="margin:18px 0 8px">Performance</h3>
      <div class="tbl-wrap"><table><thead><tr><th>Case</th><th>Formula</th><th>Result</th></tr></thead><tbody>
      <tr><td>Single level</td><td>h·C + (1−h)·M</td><td><strong>${t1.toFixed(2)} cycles</strong></td></tr>
      <tr><td>Two level</td><td>h₁C₁ + (1−h₁)h₂C₂ + (1−h₁)(1−h₂)M</td><td><strong>${t2.toFixed(2)} cycles</strong></td></tr>
      <tr><td>CPI — no cache</td><td>1 + M</td><td><strong>${cpi0.toFixed(2)}</strong></td></tr>
      <tr><td>CPI — L1 only</td><td>1 + (1−h₁)·M</td><td><strong>${cpi1.toFixed(2)}</strong></td></tr>
      <tr><td>CPI — L1+L2</td><td>1 + (1−h₁)(C₂ + (1−h₂)M)</td><td><strong>${cpi2.toFixed(2)}</strong></td></tr>
      </tbody></table></div>
      <div class="callout tip" style="margin-bottom:0"><strong>Speedup (L1 vs no cache):</strong> ${(cpi0 / cpi1).toFixed(1)}× · Guide ke numbers check karne ke liye: address 24, block 4, lines 16384, direct, h = 0.95, C = 1, M = 500, h₂ = 0.90, L2 = 25.</div>`;
  }

  /* ---- Bus lab ---- */
  function initBusLab() {
    const s = S.labState.bus;
    $('labRoot').innerHTML = `
      <div class="lab-grid">
        <div class="card">
          <h3 style="margin-bottom:12px">🚌 Address bus calculator</h3>
          ${field('Address bus width (bits)', 'bBits', s.bits, { attrs: 'min=1 max=64' })}
          <div class="preset-row" style="margin-top:10px">
            ${[8, 12, 16, 20, 32].map((n) => `<button class="preset" data-bits="${n}">${n}-bit</button>`).join('')}
          </div>
          <div class="callout tip" style="margin-top:16px"><strong>Formula:</strong> addressable locations = 2<sup>n</sup>. High-order bits module select, low-order bits module ke andar location batate hain.</div>
        </div>
        <div class="card" id="bOut"></div>
      </div>`;
    const calc = () => {
      s.bits = +$('bBits').value || 12;
      const loc = Math.pow(2, s.bits);
      $('bOut').innerHTML = `<h3 style="margin-bottom:10px">Result</h3>
        <div class="result-line"><span>Address bus width</span><strong>${s.bits} bits</strong></div>
        <div class="result-line"><span>Addressable locations</span><strong style="color:var(--accent)">2^${s.bits} = ${loc.toLocaleString()}</strong></div>
        <div class="result-line"><span>Agar 1 word = 1 byte</span><strong>${(loc / 1024).toLocaleString()} KB</strong></div>
        <div class="formula">2^${s.bits} = ${loc.toLocaleString()} locations ${s.bits === 12 ? '→ 4K words (guide wala example ✓)' : ''}</div>
        <h3 style="margin:18px 0 8px">QPI layers (yaad rakhein)</h3>
        <div class="tbl-wrap"><table><thead><tr><th>Layer</th><th>Kaam</th><th>Unit</th></tr></thead><tbody>
          <tr><td>Physical</td><td>Wires + signaling</td><td><strong>Phit = 20 bits</strong></td></tr>
          <tr><td>Link</td><td>Flow + error control</td><td><strong>Flit = 80 bits</strong> (72 + 8 CRC)</td></tr>
          <tr><td>Routing</td><td>Packet ka path</td><td>—</td></tr>
          <tr><td>Protocol</td><td>Cache coherency</td><td>Packet</td></tr>
        </tbody></table></div>
        <h3 style="margin:18px 0 8px">QPI vs PCIe</h3>
        <div class="tbl-wrap"><table><thead><tr><th></th><th>QPI</th><th>PCIe</th></tr></thead><tbody>
          <tr><td>Lanes</td><td>Ek direction</td><td><strong>Bidirectional</strong></td></tr>
          <tr><td>Layers</td><td>4</td><td>3 (physical, data link, transaction)</td></tr>
          <tr><td>Transactions</td><td>Packetized</td><td>Split (request + completion), posted (no reply)</td></tr>
        </tbody></table></div>`;
    };
    $('bBits').addEventListener('change', calc);
    $('labRoot').querySelectorAll('[data-bits]').forEach((b) => b.addEventListener('click', () => { $('bBits').value = b.dataset.bits; calc(); }));
    calc();
  }

  /* ---- Instruction lab ---- */
  const MEM_INSTR = [
    { name: 'AND', exec: 'AC ← AC AND DR' },
    { name: 'ADD', exec: 'AC ← AC + DR, E ← Cout' },
    { name: 'LDA', exec: 'AC ← DR' },
    { name: 'STA', exec: 'M[AR] ← AC' },
    { name: 'BUN', exec: 'PC ← AR' },
    { name: 'BSA', exec: 'M[AR] ← PC, AR ← AR+1, PC ← AR' },
    { name: 'ISZ', exec: 'DR ← M[AR]+1, store back, agar 0 to PC ← PC+1' }
  ];
  function decodeInstruction(str) {
    const clean = String(str).trim().replace(/^0x/i, '').toUpperCase();
    if (!/^[0-9A-F]{1,4}$/.test(clean)) return { error: 'Sirf 1 se 4 hex digits daalein (0–9, A–F).' };
    const v = parseInt(clean, 16);
    const I = (v >> 15) & 1, op = (v >> 12) & 7, addr = v & 0xFFF;
    const bin = v.toString(2).padStart(16, '0');
    const D = 'D' + op;
    const hexPair = (opcode, mode) => ('0000' + (((mode << 15) | (opcode << 12)).toString(16).toUpperCase())).slice(-4);
    let type, name, exec, control, timing = ['T0: AR ← PC', 'T1: IR ← M[AR], PC ← PC+1', 'T2: decode, AR ← IR(0-11), I ← IR(15)'];
    if (op === 7 && I === 0) {
      type = 'Register-reference'; control = 'r = D7 I’ T3';
      if (addr === 0x080) { name = 'CIR — circulate right'; exec = 'AC ← shr AC, AC(15) ← E, E ← AC(0), SC ← 0'; timing.push('T3 (r B7): CIR execute'); }
      else if (addr === 0x040) { name = 'CIL — circulate left'; exec = 'AC ← shl AC, AC(0) ← E, E ← AC(15), SC ← 0'; timing.push('T3 (r B6): CIL execute'); }
      else { name = 'Register-reference operation / test'; exec = 'AC par operation ya test — B0…B11 bit decide karti hai'; timing.push('T3 (r): execute'); }
    } else if (op === 7 && I === 1) {
      type = 'Input-output'; control = 'p = D7 I T3'; name = 'I/O operation / test'; exec = 'I/O operation (hex Fxxx)'; timing.push('T3 (p): execute');
    } else {
      type = 'Memory-reference'; name = MEM_INSTR[op].name; exec = MEM_INSTR[op].exec;
      control = I ? D + ' T3 (indirect), phir T4/T5' : D + ' T4/T5';
      if (I) timing.push('T3: AR ← M[AR] (asal address)');
      if (name === 'STA') timing.push('T4: M[AR] ← AC, SC ← 0');
      else if (name === 'LDA') timing.push('T4: DR ← M[AR]', 'T5: AC ← DR, SC ← 0');
      else if (name === 'ADD') timing.push('T4: DR ← M[AR]', 'T5: AC ← AC + DR, E ← Cout, SC ← 0');
      else timing.push('T4 se: ' + exec);
    }
    return { v, I, op, addr, bin, D, type, name, exec, control, timing, hexPair: hexPair(op, 0), hexPairI: hexPair(op, 1) };
  }
  function initInstructionLab() {
    const s = S.labState.instruction;
    $('labRoot').innerHTML = `
      <div class="lab-grid">
        <div class="card">
          <h3 style="margin-bottom:12px">🔍 Instruction decoder</h3>
          ${field('16-bit instruction (hex)', 'iHex', s.hex, { attrs: 'maxlength=4 placeholder=1940', type: 'text' })}
          <div class="preset-row">${['7080', '7040', '1940', '2940', 'B940'].map((h) => `<button class="preset" data-hex="${h}">${h}</button>`).join('')}</div>
          <div class="callout" style="margin-top:16px"><strong>Format:</strong> IR(15)=I · IR(12–14)=opcode · IR(0–11)=address<br><strong>Direct:</strong> I=0 · <strong>Indirect:</strong> I=1 (T3 par AR ← M[AR])</div>
        </div>
        <div class="card" id="iOut"></div>
      </div>`;
    const calc = () => {
      s.hex = $('iHex').value;
      const d = decodeInstruction(s.hex);
      if (d.error) { $('iOut').innerHTML = '<div class="callout warn">' + d.error + '</div>'; return; }
      $('iOut').innerHTML = `
        <h3 style="margin-bottom:10px">Decode result</h3>
        <div class="bits-box"><div class="bits-title">Binary (I | opcode | address)</div>
          <div class="bits"><span class="f-tag">${d.bin[0]}</span> <span class="f-idx">${d.bin.slice(1, 4)}</span> <span class="f-word">${d.bin.slice(4)}</span></div>
        </div>
        <div class="result-line"><span>Hex</span><strong>0x${d.v.toString(16).toUpperCase().padStart(4, '0')}</strong></div>
        <div class="result-line"><span>I (mode bit)</span><strong>${d.I} — ${d.I ? 'Indirect' : 'Direct'}</strong></div>
        <div class="result-line"><span>Opcode</span><strong>${d.op.toString(2).padStart(3, '0')} → ${d.D}</strong></div>
        <div class="result-line"><span>Address IR(0–11)</span><strong>${d.addr.toString(16).toUpperCase().padStart(3, '0')} (${d.addr})</strong></div>
        <div class="result-line"><span>Type</span><strong style="color:var(--accent)">${d.type}</strong></div>
        <div class="result-line"><span>Hex pair (I=0 / I=1)</span><strong>${d.hexPair} / ${d.hexPairI}</strong></div>
        <div class="result-line"><span>Control</span><strong>${d.control}</strong></div>
        <div class="formula">Instruction: ${d.name}<br>Execution: ${d.exec}</div>
        <h3 style="margin:18px 0 8px">Timing sequence</h3>
        <div class="tbl-wrap"><table><thead><tr><th>#</th><th>Micro-operation</th></tr></thead><tbody>
          ${d.timing.map((t, i) => `<tr><td>${i + 1}</td><td><code>${t}</code></td></tr>`).join('')}
        </tbody></table></div>`;
    };
    $('iHex').addEventListener('input', calc);
    $('labRoot').querySelectorAll('[data-hex]').forEach((b) => b.addEventListener('click', () => { $('iHex').value = b.dataset.hex; calc(); }));
    calc();
  }

  /* ---- Arithmetic lab ---- */
  function initArithmeticLab() {
    const s = S.labState.arithmetic;
    $('labRoot').innerHTML = `<div class="card" style="margin-bottom:16px">
        <div class="mini-tabs" style="margin:0">
          ${[['twos', 'Twos complement'], ['add', 'Addition / Overflow'], ['booth', 'Booth multiply'], ['divide', 'Restoring divide']].map(([k, l]) => `<button class="mini-tab${s.mode === k ? ' active' : ''}" data-amode="${k}">${l}</button>`).join('')}
        </div>
      </div><div id="arithOut"></div>`;
    $('labRoot').querySelectorAll('[data-amode]').forEach((b) => b.addEventListener('click', () => { s.mode = b.dataset.amode; initArithmeticLab(); }));
    if (s.mode === 'twos') labTwos(s);
    else if (s.mode === 'add') labAdd(s);
    else if (s.mode === 'booth') labBooth(s);
    else labDivide(s);
  }
  function bitsFieldRow(nId, nVal, extraFields) {
    return `<div class="field"><label for="${nId}">Bits (n)</label><select id="${nId}"><option value="4"${nVal == 4 ? ' selected' : ''}>4 bits</option><option value="8"${nVal == 8 ? ' selected' : ''}>8 bits</option><option value="16"${nVal == 16 ? ' selected' : ''}>16 bits</option></select></div>${extraFields}`;
  }
  function labTwos(s) {
    $('arithOut').innerHTML = `<div class="lab-grid"><div class="card">
      <h3 style="margin-bottom:12px">➕/− Twos complement</h3>
      ${bitsFieldRow('aN', s.n, field('Decimal number', 'aX', s.x, { attrs: 'min=-32768 max=32767' }))}
      <button class="btn primary sm" id="aCalc">Hisaab karein</button>
      <div class="callout tip" style="margin-top:14px"><strong>Negation:</strong> saare bits complement + 1.</div>
    </div><div class="card" id="aOut"></div></div>`;
    const calc = () => {
      s.n = +$('aN').value; s.x = +$('aX').value || 0;
      const n = s.n, x = s.x, xb = toBits(x, n), nb = toBits(-x, n);
      const comp = xb.split('').map((b) => b === '0' ? '1' : '0').join('');
      const plus1 = toBits(fromBits(comp) + 1, n);
      const min = -Math.pow(2, n - 1), max = Math.pow(2, n - 1) - 1;
      const over = x < min || x > max;
      $('aOut').innerHTML = `<h3 style="margin-bottom:10px">Result</h3>
        <div class="bits-box"><div class="bits-title">${x} in ${n}-bit</div><div class="bits">${xb}</div></div>
        <div class="bits-box"><div class="bits-title">Step 1 — complement</div><div class="bits">${comp}</div></div>
        <div class="bits-box"><div class="bits-title">Step 2 — +1 → ${-x} represented</div><div class="bits">${plus1} ${nb === plus1 ? '✓' : ''}</div></div>
        <div class="result-line"><span>Range (${n}-bit)</span><strong>${min} … ${max}</strong></div>
        <div class="result-line"><span>Sign extend to 16-bit</span><strong>${x < 0 ? '1'.repeat(16 - n) : '0'.repeat(16 - n)}${xb}</strong></div>
        ${over ? '<div class="callout warn"><strong>Warning:</strong> ye number ' + n + '-bit range se bahar hai — answer galat hoga.</div>' : ''}
        <div class="callout purple" style="margin-bottom:0"><strong>Special case:</strong> ${n}-bit me ${min} ki negation wapas ${min} aati hai, kyunki ${-min} range se bahar hai.</div>`;
    };
    $('aCalc').addEventListener('click', calc);
    $('aN').addEventListener('change', calc);
    calc();
  }
  function labAdd(s) {
    $('arithOut').innerHTML = `<div class="lab-grid"><div class="card">
      <h3 style="margin-bottom:12px">➕ Addition & overflow</h3>
      ${bitsFieldRow('sN', s.n, field('Pehla number (A)', 'sA', s.a) + field('Doosra number (B)', 'sB', s.b))}
      <button class="btn primary sm" id="sCalc">Add karein</button>
      <div class="callout" style="margin-top:14px"><strong>Overflow rule:</strong> same-sign inputs ka result opposite sign → overflow. Top bit ka carry out ignore hota hai.</div>
    </div><div class="card" id="sOut"></div></div>`;
    const calc = () => {
      s.n = +$('sN').value; s.a = +$('sA').value || 0; s.b = +$('sB').value || 0;
      const n = s.n, a = s.a, b = s.b, ab = toBits(a, n), bb = toBits(b, n);
      const sum = a + b, sb = toBits(sum, n);
      const mask = Math.pow(2, n) - 1;
      const carry = ((a & mask) + (b & mask)) > mask;
      const sa = ab[0], sbb = bb[0], ss = sb[0];
      const overflow = (sa === sbb) && (ss !== sa);
      const signed = fromBits(sb);
      $('sOut').innerHTML = `<h3 style="margin-bottom:10px">Binary addition</h3>
        <div class="bits-box"><div class="bits">${ab} &nbsp; (${a})<br>${bb} &nbsp; (${b})<br>————————<br>${sb} &nbsp; (${signed})</div></div>
        <div class="result-line"><span>Carry out (ignore)</span><strong>${carry ? '1' : '0'}</strong></div>
        <div class="result-line"><span>Input signs</span><strong>${sa === '1' ? '−' : '+'} , ${sbb === '1' ? '−' : '+'}</strong></div>
        <div class="result-line"><span>Result sign</span><strong>${ss === '1' ? '−' : '+'}</strong></div>
        <div class="result-line"><span>Overflow</span><strong style="color:${overflow ? 'var(--red)' : 'var(--green)'}">${overflow ? 'HAA — wrong result' : 'Nahi ✓'}</strong></div>
        <div class="callout ${overflow ? 'warn' : 'tip'}" style="margin-bottom:0"><strong>${overflow ? 'Overflow!' : 'Sahi result:'}</strong> ${a} + ${b} = ${signed}${overflow ? ' — range se bahar, stored value galat hoga. Guide ka example: 100 + 50 (8-bit) → 10010110 (negative).' : ''}</div>`;
    };
    $('sCalc').addEventListener('click', calc);
    $('sN').addEventListener('change', calc);
    calc();
  }
  function labBooth(s) {
    $('arithOut').innerHTML = `<div class="lab-grid"><div class="card">
      <h3 style="margin-bottom:12px">✖️ Booth's algorithm</h3>
      ${bitsFieldRow('mN', s.bn, field('Multiplicand (M)', 'mM', s.mcant) + field('Multiplier (Q)', 'mQ', s.mult))}
      <button class="btn primary sm" id="mCalc">Steps dekhein</button>
      <div class="callout tip" style="margin-top:14px"><strong>Rule:</strong> 10 → A−M · 01 → A+M · 00/11 → shift. Shift hamesha arithmetic right.</div>
    </div><div class="card" id="mOut"></div></div>`;
    const calc = () => {
      s.bn = +$('mN').value; s.mcant = +$('mM').value || 0; s.mult = +$('mQ').value || 0;
      const n = s.bn, M = s.mcant, Q0 = s.mult;
      const lim = Math.pow(2, n - 1);
      if (M < -lim || M >= lim || Q0 < -lim || Q0 >= lim) { $('mOut').innerHTML = '<div class="callout warn">Numbers ' + n + '-bit signed range se bahar hain. Bits badayein.</div>'; return; }
      let A = zeros(n), Q = toBits(Q0, n), Qm = '0';
      const rows = [{ i: 'Initial', pair: '—', action: '—', A, Q, Qm }];
      for (let i = 1; i <= n; i++) {
        const pair = Q[n - 1] + Qm;
        let action;
        if (pair === '10') { A = toBits(fromBits(A) - M, n); action = 'A = A − M'; }
        else if (pair === '01') { A = toBits(fromBits(A) + M, n); action = 'A = A + M'; }
        else action = 'Sirf shift';
        const combo = A + Q + Qm;
        const shifted = combo[0] + combo.slice(0, -1);
        A = shifted.slice(0, n); Q = shifted.slice(n, 2 * n); Qm = shifted[2 * n];
        rows.push({ i, pair, action, A, Q, Qm });
      }
      const prodBits = A + Q, prod = fromBits(prodBits);
      $('mOut').innerHTML = `<h3 style="margin-bottom:10px">${M} × ${Q0} — ${n} cycles</h3>
        <div class="tbl-wrap"><table class="table-mono"><thead><tr><th>Cycle</th><th>Q0 Q−1</th><th>Action</th><th>A</th><th>Q</th><th>Q−1</th></tr></thead><tbody>
        ${rows.map((r) => `<tr${r.i === 'Initial' ? '' : ''}><td>${r.i}</td><td>${r.pair}</td><td>${r.action}</td><td>${r.A}</td><td>${r.Q}</td><td>${r.Qm}</td></tr>`).join('')}
        </tbody></table></div>
        <div class="formula">A Q = ${prodBits} → ${prod} &nbsp;|&nbsp; Expected ${M * Q0} ${prod === M * Q0 ? '✓' : '(overflow check karein)'}</div>
        <div class="callout" style="margin-bottom:0"><strong>Q−1</strong> extra bit hai jo Q ke right mein — shift out hone wali bit hold karti hai. Arithmetic right shift mein A ka sign bit copy hota hai.</div>`;
    };
    $('mCalc').addEventListener('click', calc);
    $('mN').addEventListener('change', calc);
    calc();
  }
  function labDivide(s) {
    $('arithOut').innerHTML = `<div class="lab-grid"><div class="card">
      <h3 style="margin-bottom:12px">➗ Restoring division</h3>
      ${bitsFieldRow('dN', s.dn, field('Dividend', 'dX', s.dividend) + field('Divisor', 'dV', s.divisor))}
      <button class="btn primary sm" id="dCalc">Steps dekhein</button>
      <div class="callout" style="margin-top:14px"><strong>Steps:</strong> left shift → A−M → non-negative ? Q0=1 : Q0=0 + restore. End mein sign fix karo.</div>
    </div><div class="card" id="dOut"></div></div>`;
    const calc = () => {
      s.dn = +$('dN').value; s.dividend = +$('dX').value || 0; s.divisor = +$('dV').value || 0;
      const n = s.dn, X = s.dividend, V = s.divisor;
      if (V === 0) { $('dOut').innerHTML = '<div class="callout warn">Divisor 0 nahi ho sakta.</div>'; return; }
      const D = Math.abs(X), W = Math.abs(V), lim = Math.pow(2, n);
      if (D >= lim || W >= lim) { $('dOut').innerHTML = '<div class="callout warn">Magnitude ' + n + '-bit range se bahar hai. Bits badayein.</div>'; return; }
      let A = zeros(n), Q = toBits(D, n);
      const rows = [{ i: 'Initial', shifted: A + ', ' + Q, sub: '—', action: '—', A, Q }];
      for (let i = 1; i <= n; i++) {
        const combo = A + Q;
        const sh = combo.slice(1) + '0';
        A = sh.slice(0, n); Q = sh.slice(n);
        const sub = toBits(fromBits(A) - W, n);
        let action, resA;
        if (fromBits(sub) >= 0) { Q = Q.slice(0, n - 1) + '1'; resA = sub; action = 'A−M ≥ 0 → Q0 = 1'; }
        else { Q = Q.slice(0, n - 1) + '0'; resA = toBits(fromBits(sub) + W, n); action = 'A−M < 0 → Q0 = 0, restore'; }
        A = resA;
        rows.push({ i, shifted: sh.slice(0, n) + ', ' + sh.slice(n), sub, action, A, Q });
      }
      let q = fromBits(Q), r = fromBits(A);
      if (X < 0) r = -r;
      if ((X < 0) !== (V < 0)) q = -q;
      $('dOut').innerHTML = `<h3 style="margin-bottom:10px">${X} ÷ ${V} — ${n} steps (magnitudes par)</h3>
        <div class="tbl-wrap"><table class="table-mono"><thead><tr><th>Step</th><th>Shift ke baad (A,Q)</th><th>A−M</th><th>Action</th><th>A,Q</th></tr></thead><tbody>
        ${rows.map((r) => `<tr><td>${r.i}</td><td>${r.shifted}</td><td>${r.sub}</td><td>${r.action}</td><td>${r.A}, ${r.Q}</td></tr>`).join('')}
        </tbody></table></div>
        <div class="formula">Quotient = ${q} · Remainder = ${r} &nbsp;|&nbsp; Expected ${Math.trunc(X / V)}, ${X % V} ${q === Math.trunc(X / V) && r === X % V ? '✓' : ''}</div>
        <div class="callout" style="margin-bottom:0"><strong>Sign rules:</strong> sign(R) = sign(dividend) = ${X < 0 ? '−' : '+'} · sign(Q) = sign(D) × sign(V) = ${((X < 0) !== (V < 0)) ? '−' : '+'}.</div>`;
    };
    $('dCalc').addEventListener('click', calc);
    $('dN').addEventListener('change', calc);
    calc();
  }

  /* ---------------- Workspace: notes, bookmarks, backup ---------------- */
  function renderWorkspace() {
    const tabs = [
      { k: 'notes', l: '📝 My Notes' },
      { k: 'bookmarks', l: '🔖 Bookmarks' },
      { k: 'goals', l: '⚙️ Goals & Backup' }
    ];
    $('view').innerHTML = `
      <div class="page-head"><span class="eyebrow">Personalize + data</span><h1>My Workspace</h1><p class="lead">Apne notes, bookmark kiye gaye questions, exam countdown aur progress ka backup — sab ek jagah.</p></div>
      <div class="mini-tabs">${tabs.map((x) => `<button class="mini-tab${S.workspaceTab === x.k ? ' active' : ''}" data-ws="${x.k}">${x.l}</button>`).join('')}</div>
      <div id="wsPane"></div>`;
    $('view').querySelectorAll('[data-ws]').forEach((b) => b.addEventListener('click', () => { S.workspaceTab = b.dataset.ws; renderWorkspace(); }));
    if (S.workspaceTab === 'notes') renderNotes();
    else if (S.workspaceTab === 'bookmarks') renderBookmarks();
    else renderGoals();
  }
  function renderNotes() {
    if (!S.noteTopic || !BY_ID[S.noteTopic]) S.noteTopic = ACTIVE.topics[0].id;
    const opts = ACTIVE.topics.map((t) => `<option value="${t.id}"${S.noteTopic === t.id ? ' selected' : ''}>${t.title}</option>`).join('');
    const text = P.notes[S.noteTopic] || '';
    $('wsPane').innerHTML = `<div class="card">
      <div class="field-row" style="align-items:flex-end">
        <div class="field"><label for="noteTopic">Select topic</label><select id="noteTopic">${opts}</select></div>
        <div class="field grow"><label for="noteText">Notes for this topic</label><textarea id="noteText" rows="12" placeholder="Type your own revision notes, formulas or doubts...">${escapeHtml(text)}</textarea></div>
      </div>
      <div class="btn-row" style="margin-top:14px">
        <button class="btn primary" id="noteSave">Save note</button>
        <button class="btn" id="noteDownload">Download .txt</button>
        <span class="chip" id="noteStatus">${text ? 'Saved' : 'Empty'}</span>
      </div>
    </div>`;
    $('noteTopic').addEventListener('change', (e) => { S.noteTopic = e.target.value; renderNotes(); });
    $('noteText').addEventListener('input', () => { $('noteStatus').textContent = 'Unsaved...'; });
    $('noteSave').addEventListener('click', () => {
      if (!S.noteTopic) return;
      P.notes[S.noteTopic] = $('noteText').value;
      saveProgress(); $('noteStatus').textContent = 'Saved just now'; toast('Note saved ✓');
    });
    $('noteDownload').addEventListener('click', () => {
      const t = BY_ID[S.noteTopic] ? BY_ID[S.noteTopic].title : 'notes';
      downloadFile(t.replace(/[^\w]+/g, '_') + '_notes.txt', P.notes[S.noteTopic] || '', 'text/plain');
      toast('File downloaded');
    });
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function downloadFile(name, content, type) {
    try {
      const blob = new Blob([content], { type: type || 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    } catch (e) { toast('Download available nahi hai'); }
  }
  function renderBookmarks() {
    const qs = ALLQ.filter((q) => P.bookmarks.includes(q.id));
    $('wsPane').innerHTML = qs.length ? `<div class="card"><div class="tbl-wrap"><table><thead><tr><th>Question</th><th>Topic</th><th></th></tr></thead><tbody>
      ${qs.map((q) => `<tr><td>${q.q}</td><td><span class="chip">${BY_ID[q.topic] ? BY_ID[q.topic].title.split(' (')[0] : q.topic}</span></td><td class="nowrap"><button class="btn sm" data-bopen="${q.topic}">Open quiz</button> <button class="btn sm" data-bremove="${q.id}">Remove</button></td></tr>`).join('')}
    </tbody></table></div></div>` : `<div class="card empty-state"><div style="font-size:34px">🔖</div><h3>No bookmarks yet</h3><p class="small muted">Bookmark questions from any quiz or mock — they will appear here.</p><button class="btn primary sm" data-go="mock">Mock Test do</button></div>`;
    $('wsPane').querySelectorAll('[data-bopen]').forEach((b) => b.addEventListener('click', () => { S.tab = 'quiz'; go('topic/' + b.dataset.bopen); }));
    $('wsPane').querySelectorAll('[data-bremove]').forEach((b) => b.addEventListener('click', () => { toggleBookmark(b.dataset.bremove); renderBookmarks(); }));
  }
  function renderGoals() {
    $('wsPane').innerHTML = `<div class="grid grid-2">
      <div class="card"><h3 style="margin-bottom:12px">🎯 Goals</h3>
        <div class="field"><label for="examDate">Exam date</label><input id="examDate" type="date" value="${P.examDate || ''}"></div>
        <div class="field"><label for="dailyGoal">Daily question goal</label><input id="dailyGoal" type="number" min="1" max="200" value="${P.dailyGoal || 10}"></div>
        <div class="callout tip" style="margin-bottom:0"><strong>Tip:</strong> ${daysToExam() === null ? 'Exam date set karein — countdown sidebar aur dashboard par dikhega.' : 'Exam tak ' + daysToExam() + ' din baqi hain. Roz goal complete karein.'}</div>
      </div>
      <div class="card"><h3 style="margin-bottom:12px">💾 Backup</h3>
        <p class="small muted">Progress ek browser mein save hoti hai. Doosre device par le jane ke liye export/import karein.</p>
        <div class="btn-row" style="margin-top:14px;flex-wrap:wrap">
          <button class="btn primary sm" id="exportBtn">Export backup (.json)</button>
          <button class="btn sm" id="importBtn">Import backup</button>
          <button class="btn sm danger" id="resetBtn">Reset all progress</button>
        </div>
        <input type="file" id="importFile" accept="application/json,.json" hidden>
      </div>
    </div>`;
    $('examDate').addEventListener('change', (e) => { P.examDate = e.target.value; saveProgress(); renderNav(); toast('Exam date saved'); });
    $('dailyGoal').addEventListener('change', (e) => { P.dailyGoal = Math.max(1, +e.target.value || 10); e.target.value = P.dailyGoal; saveProgress(); toast('Goal saved'); });
    $('exportBtn').addEventListener('click', () => {
      downloadFile('coal-coach-backup.json', JSON.stringify(P, null, 2), 'application/json');
      toast('Backup downloaded');
    });
    $('importBtn').addEventListener('click', () => $('importFile').click());
    $('importFile').addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          if (!data || typeof data !== 'object') throw new Error('bad');
          Object.assign(P, defaultProgress(), data);
          P.flash = Object.assign({ known: {}, again: {} }, data.flash || {});
          saveProgress(); applyDisplaySettings(); refreshDataRefs(); render(true); toast('Backup imported ✓');
        } catch (err) { toast('Invalid backup file'); }
      };
      reader.readAsText(f);
      e.target.value = '';
    });
    $('resetBtn').addEventListener('click', () => {
      if (!window.confirm('Reset confirmation? This cannot be undone.')) return;
      try { localStorage.removeItem(STORE); } catch (err) {}
      location.reload();
    });
  }

  /* ---------------- Analytics ---------------- */
  function renderAnalytics() {
    const totalAnswered = Object.values(P.quiz).reduce((n, v) => n + (v.attempts || 0), 0);
    const weak = [];
    const rows = ACTIVE.topics.map((t) => {
      const qs = topicQuestions(t.id);
      const attempted = qs.filter((q) => P.quiz[q.id]).length;
      const correct = qs.filter((q) => P.quiz[q.id] && P.quiz[q.id].correct).length;
      const acc = attempted ? Math.round(correct / attempted * 100) : 0;
      if (attempted >= 2 && acc < 60) weak.push(t.title.split(' (')[0]);
      return { t, attempted, total: qs.length, acc, pg: topicProgress(t) };
    });
    const badges = [
      { i: '🚀', n: 'First Steps', d: 'Pehla topic padha', ok: Object.keys(P.read).length >= 1 },
      { i: '📚', n: 'Topic Master', d: 'Saare 7 topics', ok: Object.keys(P.read).length >= 7 },
      { i: '🎯', n: 'Sharpshooter', d: '80%+ quiz accuracy', ok: Object.values(P.quiz).filter((v) => v.correct).length >= 8 },
      { i: '🏆', n: 'Mock Runner', d: 'Pehla mock diya', ok: (P.mockCount || 0) >= 1 },
      { i: '🔥', n: 'Consistent', d: '3 din ka streak', ok: streakDays() >= 3 },
      { i: '🔖', n: 'Curious', d: '5 questions bookmark kiye', ok: P.bookmarks.length >= 5 },
      { i: '📝', n: 'Note Maker', d: 'Apne notes likhe', ok: Object.values(P.notes).some((v) => v && v.trim()) },
      { i: '⭐', n: 'Exam Ready', d: 'Mock me 80%+ score', ok: (P.mockBest || 0) >= 80 }
    ];
    $('view').innerHTML = `
      <div class="page-head"><span class="eyebrow">Progress insights</span><h1>Analytics</h1><p class="lead">Kahan strong ho, kahan practice chahiye — ek nazar mein.</p></div>
      <div class="card" style="margin-bottom:20px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h3 style="margin:0">🏅 Achievements</h3><span class="chip">${badges.filter((b) => b.ok).length}/${badges.length} unlocked</span></div>
        <div class="badge-grid">${badges.map((b) => `<div class="badge${b.ok ? '' : ' locked'}"><span class="badge-ico">${b.i}</span><strong>${b.n}</strong><small>${b.d}</small></div>`).join('')}</div>
      </div>
      <div class="grid grid-4" style="margin-bottom:20px">
        <div class="card stat-card"><div class="stat-ico">${icon('check')}</div><div><div class="stat-val">${totalAnswered}</div><div class="stat-label">Questions answered</div></div></div>
        <div class="card stat-card"><div class="stat-ico purple">${icon('trophy')}</div><div><div class="stat-val">${P.mockCount || 0}</div><div class="stat-label">Mocks taken</div></div></div>
        <div class="card stat-card"><div class="stat-ico teal">${icon('target')}</div><div><div class="stat-val">${readiness()}%</div><div class="stat-label">Ready score</div></div></div>
        <div class="card stat-card"><div class="stat-ico green">🔥</div><div><div class="stat-val">${streakDays()}</div><div class="stat-label">Study streak</div></div></div>
      </div>
      <div class="grid grid-2">
        <section class="card"><h3 style="margin-bottom:14px">Topic-wise progress</h3>
          ${rows.map((r) => `<div class="metric-row"><div class="metric-head"><span>${r.t.title}</span><b>${r.pg}%</b></div><div class="bar"><div class="bar-fill" style="width:${r.pg}%"></div></div><small class="muted">${r.attempted}/${r.total} questions attempted · accuracy ${r.acc}%</small></div>`).join('')}
        </section>
        <section class="card"><h3 style="margin-bottom:14px">Quiz accuracy by topic</h3>
          ${rows.map((r) => `<div class="metric-row"><div class="metric-head"><span>${r.t.title.split(' (')[0]}</span><b>${r.attempted ? r.acc + '%' : '—'}</b></div><div class="bar"><div class="bar-fill ${r.acc && r.acc < 60 ? 'warn' : 'ok'}" style="width:${r.acc}%"></div></div></div>`).join('')}
          <div class="callout ${weak.length ? 'warn' : 'tip'}" style="margin-top:16px;margin-bottom:0"><strong>${weak.length ? 'Weak areas — revise these first' : 'Strong coverage!'} </strong>${weak.length ? weak.join(' · ') : 'Keep revising to stay sharp.'}</div>
        </section>
      </div>
      <section class="card" style="margin-top:20px"><h3 style="margin-bottom:14px">Mock score history</h3>
        ${(P.mockHistory && P.mockHistory.length) ? `<div class="history-chart">${P.mockHistory.map((h, i) => `<div class="hist-col"><div class="hist-bar" style="height:${Math.max(4, h.score)}%"><span>${h.score}%</span></div><small>#${i + 1}</small></div>`).join('')}</div>` : '<div class="empty-state small"><p class="muted">No mock attempts yet</p><button class="btn primary sm" data-go="mock">Mock Test do</button></div>'}
      </section>`;
  }

  /* ---------------- Pomodoro + display settings ---------------- */
  function updatePomoUI() {
    const s = S.pomo;
    const m = Math.floor(s.seconds / 60), sec = s.seconds % 60;
    if ($('pomoTime')) $('pomoTime').textContent = String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
    if ($('pomoMode')) $('pomoMode').textContent = s.mode === 'focus' ? 'Focus' : 'Break';
    if ($('pomoSessions')) $('pomoSessions').textContent = (P.pomoSessions || 0) + (P.pomoSessions === 1 ? ' session' : ' sessions');
    if ($('pomoToggle')) $('pomoToggle').textContent = s.running ? 'Pause' : 'Start';
    if ($('pomoSwitch')) $('pomoSwitch').textContent = s.mode === 'focus' ? 'Break' : 'Focus';
    const pct = 100 - (s.seconds / (s.mode === 'focus' ? 1500 : 300)) * 100;
    if ($('pomoRing')) $('pomoRing').style.setProperty('--pct', Math.max(0, Math.min(100, pct)));
  }
  function initPomodoro() {
    if (S.pomoTimer) return;
    S.pomoTimer = setInterval(() => {
      const s = S.pomo;
      if (!s.running) return;
      s.seconds--;
      if (s.seconds <= 0) {
        if (s.mode === 'focus') {
          P.pomoSessions = (P.pomoSessions || 0) + 1; saveProgress();
          s.mode = 'break'; s.seconds = 300; toast('Session complete — take a break!');
        } else {
          s.mode = 'focus'; s.seconds = 1500; toast('Break over — back to work!');
        }
      }
      updatePomoUI();
    }, 1000);
    updatePomoUI();
  }
  function applyDisplaySettings() {
    document.documentElement.style.fontSize = (16 * (P.fontScale || 1)) + 'px';
    document.body.classList.toggle('focus-mode', !!P.focus);
  }
  function resetAll() {
    try { localStorage.removeItem(STORE); } catch (e) {}
    location.reload();
  }

  /* ---------------- Search ---------------- */
  function doSearch(term) {
    const box = $('searchResults');
    const t = term.trim().toLowerCase();
    if (!t) { box.hidden = true; box.innerHTML = ''; return; }
    const topics = ACTIVE.topics.filter((x) => (x.title + ' ' + x.blurb + ' ' + x.lecture + ' ' + x.sections.map((s) => s.h).join(' ')).toLowerCase().includes(t)).slice(0, 5);
    const qs = ALLQ.filter((q) => (q.q + ' ' + q.o.join(' ')).toLowerCase().includes(t)).slice(0, 6);
    let html = '';
    if (topics.length) html += '<div class="nav-label">Topics</div>' + topics.map((x) => `<button class="search-result" data-sgo="topic/${x.id}">${x.title}<small>${x.lecture} · ${x.blurb}</small></button>`).join('');
    if (qs.length) html += '<div class="nav-label">Questions</div>' + qs.map((q) => `<button class="search-result" data-sq="${q.topic}">${q.q}<small>${BY_ID[q.topic].title} → quiz</small></button>`).join('');
    if (!html) html = '<div class="search-empty">Kuch nahi mila. Short words try karein — "cache", "dma", "booth".</div>';
    box.innerHTML = html; box.hidden = false;
    box.querySelectorAll('[data-sgo]').forEach((b) => b.addEventListener('click', () => { box.hidden = true; $('search').value = ''; go(b.dataset.sgo); }));
    box.querySelectorAll('[data-sq]').forEach((b) => b.addEventListener('click', () => { box.hidden = true; $('search').value = ''; S.tab = 'quiz'; go('topic/' + b.dataset.sq); }));
  }

  /* ---------------- Global events ---------------- */
  document.addEventListener('click', (e) => {
    const goBtn = e.target.closest('[data-go]');
    if (goBtn) { go(goBtn.dataset.go); return; }
    const bmBtn = e.target.closest('[data-bm]');
    if (bmBtn) { toggleBookmark(bmBtn.dataset.bm); if (S.quiz) renderQuizPane(); else if (S.mock && !S.mock.finished) renderMockPane(); return; }
    const modeBtn = e.target.closest('[data-mode]');
    if (modeBtn) { P.quizMode = modeBtn.dataset.mode; saveProgress(); renderQuizPane(); return; }
    const langBtn = e.target.closest('[data-lang]');
    if (langBtn) { setLang(langBtn.dataset.lang); return; }
    if (!$('searchResults').contains(e.target)) $('searchResults').hidden = true;
  });
  $('search').addEventListener('input', (e) => doSearch(e.target.value));
  $('search').addEventListener('keydown', (e) => { if (e.key === 'Escape') { $('search').value = ''; $('searchResults').hidden = true; $('search').blur(); } });
  $('menuBtn').addEventListener('click', () => $('sidebar').classList.toggle('open'));
  $('sidebarClose').addEventListener('click', () => $('sidebar').classList.remove('open'));
  $('themeBtn').addEventListener('click', () => {
    P.theme = P.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = P.theme;
    $('themeBtn').textContent = P.theme === 'dark' ? '◐' : '☀';
    saveProgress();
  });
  $('fontBtn').addEventListener('click', () => {
    P.fontScale = P.fontScale === 1 ? 1.12 : P.fontScale === 1.12 ? 1.24 : 1;
    saveProgress(); applyDisplaySettings();
    toast((P.lang === 'en' ? 'Font size:' : 'Font size:') + ' ' + Math.round(P.fontScale * 100) + '%');
  });
  $('focusBtn').addEventListener('click', () => {
    P.focus = !P.focus; saveProgress(); applyDisplaySettings();
    toast(P.focus ? 'Focus mode on — press ⛶ again to exit.' : 'Focus mode off');
  });
  $('pomoBtn').addEventListener('click', () => $('pomoWidget').classList.toggle('collapsed'));
  $('pomoClose').addEventListener('click', () => $('pomoWidget').classList.add('collapsed'));
  $('pomoToggle').addEventListener('click', () => { S.pomo.running = !S.pomo.running; updatePomoUI(); });
  $('pomoReset').addEventListener('click', () => { S.pomo.seconds = S.pomo.mode === 'focus' ? 1500 : 300; S.pomo.running = false; updatePomoUI(); });
  $('pomoSwitch').addEventListener('click', () => { S.pomo.mode = S.pomo.mode === 'focus' ? 'break' : 'focus'; S.pomo.seconds = S.pomo.mode === 'focus' ? 1500 : 300; S.pomo.running = false; updatePomoUI(); });
  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'select' || tag === 'textarea') return;
    if (e.key >= '1' && e.key <= '4') {
      const target = document.querySelectorAll('#topicPane [data-opt]:not([disabled])');
      if (target.length) { target[+e.key - 1]?.click(); return; }
      if (S.mock && !S.mock.finished) { const all = document.querySelectorAll('#view .q-card [data-opt]'); all[+e.key - 1]?.click(); }
    }
    if (e.code === 'Space' && S.revTab === 'cards' && route() === 'revision' && $('flipCard')) { e.preventDefault(); $('flipCard').click(); }
    if (e.key === 'Escape' && P.focus) { P.focus = false; saveProgress(); applyDisplaySettings(); toast('Focus mode off'); }
  });
  window.addEventListener('hashchange', () => render(true));

  /* ---------------- boot ---------------- */
  refreshDataRefs();
  document.documentElement.dataset.theme = P.theme || 'dark';
  $('themeBtn').textContent = P.theme === 'light' ? '☀' : '◐';
  document.querySelectorAll('[data-lang]').forEach((b) => b.classList.toggle('active', b.dataset.lang === P.lang));
  applyDisplaySettings();
  initPomodoro();
  if (!location.hash) location.hash = '#/home';
  render(true);
})();
