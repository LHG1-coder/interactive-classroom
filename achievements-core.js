/* ============================================================
   achievements-core.js — Steam 风格成就弹窗系统
   跨页面全局生效：任意页面达成成就 → 右下角弹出提示
   ============================================================ */

(function() {

  'use strict';

  const STORAGE_KEY = 'ach_data_v3';
  const ACH_DEBUG = true; // true=每次刷新重置成就

  (function resetIfDebug() {
    if (ACH_DEBUG) { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem("ach_data_v2"); }
  })();

  // ═══════════════ ACHIEVEMENT DATA ═══════════════
  const achievements = [
    { id:'first_lesson', name:'第一步', desc:'完成第一节课', icon:'🎓', rarity:'common', cat:'入门', cond:{lessons:1} },
    { id:'three_courses', name:'学科探索者', desc:'浏览过全部三门课程', icon:'🗺️', rarity:'common', cat:'入门', cond:{courses:3} },
    { id:'daily_streak_3', name:'三日热度', desc:'连续 3 天登录学习', icon:'🔥', rarity:'common', cat:'入门', cond:{streak:3} },
    { id:'ten_lessons', name:'十课达人', desc:'完成 10 节课程', icon:'📚', rarity:'rare', cat:'入门', cond:{lessons:10} },
    { id:'fifty_lessons', name:'学海无涯', desc:'完成 50 节课程', icon:'🌊', rarity:'epic', cat:'入门', cond:{lessons:50} },
    { id:'hundred_lessons', name:'终身学习者', desc:'完成 100 节课程', icon:'🏛️', rarity:'legendary', cat:'入门', cond:{lessons:100} },

    { id:'first_quiz', name:'初试锋芒', desc:'完成第一道习题', icon:'✏️', rarity:'common', cat:'刷题', cond:{exercises:1} },
    { id:'perfect_quiz', name:'满分答卷', desc:'单次练习获得 100% 正确率', icon:'💯', rarity:'rare', cat:'刷题', cond:{perfect:1} },
    { id:'fifty_exercises', name:'刷题机器', desc:'累计完成 50 道习题', icon:'⚙️', rarity:'rare', cat:'刷题', cond:{exercises:50} },
    { id:'speed_demon', name:'闪电思维', desc:'3 分钟内完成 10 道题且正确率 ≥90%', icon:'⚡', rarity:'epic', cat:'刷题', cond:{speed_run:true} },
    { id:'no_mistakes', name:'滴水不漏', desc:'连续 20 道题无错误', icon:'🛡️', rarity:'epic', cat:'刷题', cond:{streak_correct:20} },
    { id:'hundred_exercises', name:'题海战术', desc:'累计完成 100 道习题', icon:'🎯', rarity:'epic', cat:'刷题', cond:{exercises:100} },
    { id:'all_perfect', name:'完美主义者', desc:'平均正确率 ≥95%（至少50题）', icon:'💎', rarity:'legendary', cat:'刷题', cond:{avg_acc:95} },

    { id:'first_code', name:'Hello World', desc:'运行第一段代码', icon:'💻', rarity:'common', cat:'编程', cond:{code_runs:1} },
    { id:'debug_master', name:'调试大师', desc:'成功修复 10 个编译/运行错误', icon:'🔧', rarity:'rare', cat:'编程', cond:{bugs_fixed:10} },
    { id:'three_langs', name:'多面手', desc:'使用过全部 3 种编程语言（C/C++/Python）', icon:'🌐', rarity:'rare', cat:'编程', cond:{langs:3} },
    { id:'code_marathon', name:'代码马拉松', desc:'单次 Coding Lab 编写超过 100 行代码', icon:'🏃', rarity:'epic', cat:'编程', cond:{code_lines:100} },
    { id:'no_compile_errors', name:'一气呵成', desc:'连续 5 次运行无编译错误', icon:'✨', rarity:'epic', cat:'编程', cond:{no_errors:5} },

    { id:'viz_master', name:'可视化鉴赏家', desc:'使用过全部 15 种高数可视化', icon:'📊', rarity:'rare', cat:'探索', cond:{viz_used:15} },
    { id:'ds_viz', name:'指针猎人', desc:'完成一次带内存可视化的DS编程', icon:'🔗', rarity:'rare', cat:'探索', cond:{ds_viz:1} },
    { id:'deep_dive', name:'深潜者', desc:'单日学习时长达 3 小时', icon:'⏱️', rarity:'epic', cat:'探索', cond:{daily_time:180} },
    { id:'night_owl', name:'夜猫子勋章', desc:'在 23:00-5:00 期间完成过一节课程', icon:'🦉', rarity:'rare', cat:'探索', cond:{night_study:true} },
    { id:'weekend_warrior', name:'周末战士', desc:'周六或周日完成 5 节以上课程', icon:'⚔️', rarity:'rare', cat:'探索', cond:{weekend:5} },
    { id:'all_courses_complete', name:'全通者', desc:'完成全部课程的所有章节', icon:'👑', rarity:'legendary', cat:'探索', cond:{all_complete:true} },

    { id:'easter_egg', name:'这就是答案', desc:'在搜索框输入 42', icon:'🥚', rarity:'legendary', cat:'隐藏', cond:{secret_42:true} },
    { id:'konami', name:'↑↑↓↓←→←→BA', desc:'使用 Konami Code 解锁', icon:'🎮', rarity:'legendary', cat:'隐藏', cond:{konami:true} },
    { id:'all_legendary', name:'传说收藏家', desc:'集齐全部传说级成就', icon:'🌟', rarity:'legendary', cat:'隐藏', cond:{all_legendary:true} },
    { id:'py_course', name:'蛇之学徒', desc:'完成 Python 程序设计课程的全部章节', icon:'🐍', rarity:'epic', cat:'编程', cond:{py_complete:true} },
  ];

  // ═══════════════ STATE ═══════════════
  let state = loadState();

  function defaultState() {
    return {
      lessons:0, courses:0, exercises:0, perfect:0, streak:0,
      lastLogin:'', streak_correct:0, max_streak_correct:0,
      code_runs:0, bugs_fixed:0, langs:[],
      code_lines:0, no_errors:0,
      viz_used:0, ds_viz:0, daily_time:0,
      night_study:false, weekend:0, avg_acc:0, total_acc_sum:0,
      speed_run:false, all_complete:false, py_complete:false,
      secret_42:false, konami:false,
      unlocked:{}, unlockedDates:{}, all_legendary:false,
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) { const s = JSON.parse(raw); s.langs = s.langs || []; return s; }
    } catch(e) {}
    return defaultState();
  }

  function saveState() {
    const toSave = { ...state, langs: state.langs };
    toSave.lastLogin = new Date().toISOString().split('T')[0];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }

  // ═══════════════ CHECK ═══════════════
  function checkAll() {
    achievements.forEach(a => checkAchievement(a.id));
    const legendaryIds = achievements.filter(a => a.rarity === 'legendary').map(a => a.id);
    if (legendaryIds.every(id => state.unlocked[id])) state.all_legendary = true;
    checkAchievement('all_legendary');
  }

  function checkAchievement(id) {
    const ach = achievements.find(a => a.id === id);
    if (!ach || state.unlocked[id]) return;
    const c = ach.cond;

    function ok(val, target) { return val >= target; }

    let earned = false;
    if (c.lessons !== undefined && ok(state.lessons, c.lessons)) earned = true;
    if (c.courses !== undefined && ok(state.courses, c.courses)) earned = true;
    if (c.streak !== undefined && ok(state.streak, c.streak)) earned = true;
    if (c.exercises !== undefined && ok(state.exercises, c.exercises)) earned = true;
    if (c.perfect !== undefined && ok(state.perfect, c.perfect)) earned = true;
    if (c.speed_run !== undefined && state.speed_run) earned = true;
    if (c.streak_correct !== undefined && ok(state.max_streak_correct, c.streak_correct)) earned = true;
    if (c.avg_acc !== undefined && state.exercises >= 50 && (state.total_acc_sum/state.exercises) >= c.avg_acc) earned = true;
    if (c.code_runs !== undefined && ok(state.code_runs, c.code_runs)) earned = true;
    if (c.bugs_fixed !== undefined && ok(state.bugs_fixed, c.bugs_fixed)) earned = true;
    if (c.langs !== undefined && ok(state.langs.length, c.langs)) earned = true;
    if (c.code_lines !== undefined && ok(state.code_lines, c.code_lines)) earned = true;
    if (c.no_errors !== undefined && ok(state.no_errors, c.no_errors)) earned = true;
    if (c.viz_used !== undefined && ok(state.viz_used, c.viz_used)) earned = true;
    if (c.ds_viz !== undefined && ok(state.ds_viz, c.ds_viz)) earned = true;
    if (c.daily_time !== undefined && ok(state.daily_time, c.daily_time)) earned = true;
    if (c.night_study !== undefined && state.night_study) earned = true;
    if (c.weekend !== undefined && ok(state.weekend, c.weekend)) earned = true;
    if (c.secret_42 !== undefined && state.secret_42) earned = true;
    if (c.konami !== undefined && state.konami) earned = true;
    if (c.all_complete !== undefined && state.all_complete) earned = true;
    if (c.all_legendary !== undefined && state.all_legendary) earned = true;
    if (c.py_complete !== undefined && state.py_complete) earned = true;

    if (earned) {
      state.unlocked[id] = true;
      state.unlockedDates[id] = new Date().toISOString().split('T')[0];
      saveState();
      showToast(ach);
    }
  }

  // ═══════════════ STEAM-STYLE TOAST ═══════════════
  let toastContainer = null;
  let activeToasts = [];

  function ensureContainer() {
    if (toastContainer) return;
    toastContainer = document.createElement('div');
    toastContainer.id = 'ach-toast-container';
    document.body.appendChild(toastContainer);
  }

  const rarityColors = {
    legendary: { bg:'#cfb53b', glow:'rgba(207,181,59,0.4)', label:'传说' },
    epic:      { bg:'#7b2fbe', glow:'rgba(123,47,190,0.4)', label:'史诗' },
    rare:      { bg:'#2196F3', glow:'rgba(33,150,243,0.4)', label:'稀有' },
    common:    { bg:'#4caf50', glow:'rgba(76,175,80,0.4)', label:'普通' },
  };

  function showToast(ach) {
    ensureContainer();

    // Push older toasts up
    activeToasts.forEach(t => {
      const current = parseInt(t.style.bottom) || 20;
      t.style.bottom = (current + 90) + 'px';
    });

    const c = rarityColors[ach.rarity] || rarityColors.common;
    const toast = document.createElement('div');
    toast.className = 'ach-toast';
    toast.style.cssText = `
      position:fixed; bottom:20px; right:20px; z-index:99999;
      width:340px; max-width:calc(100vw-40px);
      background:linear-gradient(135deg, #1a1a20 0%, #141418 100%);
      border:1px solid ${c.glow.replace('0.4','0.3')};
      border-left:4px solid ${c.bg};
      border-radius:12px; padding:14px 16px;
      display:flex; align-items:center; gap:12px;
      font-family:'Inter','Noto Sans SC',-apple-system,sans-serif;
      box-shadow:0 12px 40px rgba(0,0,0,0.5), 0 0 24px ${c.glow};
      animation:achToastIn 0.45s cubic-bezier(.34,1.56,.64,1);
      cursor:pointer;
      pointer-events:auto;
      color:#f5f5f7;
    `;
    toast.title = '点击关闭';
    toast.onclick = function() { dismissToast(toast); };

    const iconBox = document.createElement('div');
    iconBox.style.cssText = `
      width:44px;height:44px;border-radius:10px;
      background:linear-gradient(135deg, ${c.bg}, ${c.bg}dd);
      display:flex;align-items:center;justify-content:center;
      font-size:22px;flex-shrink:0;box-shadow:0 0 12px ${c.glow};
    `;
    iconBox.textContent = ach.icon;

    const body = document.createElement('div');
    body.style.flex = '1';
    body.innerHTML = `
      <div style="font-size:11px;color:#9a9aa6;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:2px">
        ${c.label}成就解锁
      </div>
      <div style="font-size:14px;font-weight:700;letter-spacing:-0.01em">
        ${ach.name}
      </div>
      <div style="font-size:11px;color:#56565f;margin-top:2px">
        ${ach.desc}
      </div>
    `;

    toast.appendChild(iconBox);
    toast.appendChild(body);
    toastContainer.appendChild(toast);

    // Play subtle pop sound effect (optional — via oscillator)
    tryPlaySound(ach.rarity);

    // Auto-dismiss
    const timer = setTimeout(() => dismissToast(toast), 7000);
    toast._timer = timer;

    activeToasts.push(toast);

    // Confetti for legendary
    if (ach.rarity === 'legendary') spawnConfetti();
  }

  function dismissToast(toast) {
    if (toast._dismissing) return;
    toast._dismissing = true;
    if (toast._timer) clearTimeout(toast._timer);
    toast.style.transition = 'all 0.3s ease-in';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    toast.style.pointerEvents = 'none';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
      activeToasts = activeToasts.filter(t => t !== toast);
      // Pull remaining toasts back down
      repositionToasts();
    }, 300);
  }

  function repositionToasts() {
    let bottom = 20;
    activeToasts.forEach(t => {
      t.style.transition = 'bottom 0.35s cubic-bezier(.4,0,.2,1)';
      t.style.bottom = bottom + 'px';
      bottom += 90;
    });
  }

        function tryPlaySound(rarity) {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var now = ctx.currentTime;

      if (rarity === 'legendary' || rarity === 'epic') {
        // Steam-style ascending chime
        var notes = rarity === 'legendary'
          ? [880, 1108.73, 1318.51, 1760]
          : [880, 1108.73, 1318.51];
        var master = ctx.createGain();
        master.gain.setValueAtTime(0.85, now);
        master.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
        master.connect(ctx.destination);
        notes.forEach(function(freq, i) {
          var t = now + i * 0.12;
          var osc = ctx.createOscillator();
          osc.type = 'triangle'; osc.frequency.value = freq;
          var g = ctx.createGain();
          g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.6, t + 0.01);
          g.gain.setValueAtTime(0.6, t + 0.1); g.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
          osc.connect(g); g.connect(master); osc.start(t); osc.stop(t + 0.9);
          var osc2 = ctx.createOscillator();
          osc2.type = 'sine'; osc2.frequency.value = freq * 2;
          var g2 = ctx.createGain();
          g2.gain.setValueAtTime(0, t); g2.gain.linearRampToValueAtTime(0.25, t + 0.01);
          g2.gain.setValueAtTime(0.25, t + 0.06); g2.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
          osc2.connect(g2); g2.connect(master); osc2.start(t); osc2.stop(t + 0.7);
          var osc3 = ctx.createOscillator();
          osc3.type = 'sine'; osc3.frequency.value = freq * 3;
          var g3 = ctx.createGain();
          g3.gain.setValueAtTime(0, t + 0.02); g3.gain.linearRampToValueAtTime(0.12, t + 0.03);
          g3.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
          osc3.connect(g3); g3.connect(master); osc3.start(t + 0.02); osc3.stop(t + 0.55);
        });
      } else {
        // Common/Rare: gentle stream-like water drop tones
        // Pentatonic spaced drops — soft sine, slow decay, subtle
        var drops = [587.33, 659.25, 783.99, 880];
        var master = ctx.createGain();
        master.gain.setValueAtTime(0.35, now);
        master.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
        master.connect(ctx.destination);
        // Gentle reverb-like spread via staggered drops
        drops.forEach(function(freq, i) {
          var t = now + 0.3 + i * 0.25;
          // Main drop: soft sine with slow attack
          var osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.value = freq;
          var g = ctx.createGain();
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(0.35, t + 0.06);
          g.gain.setValueAtTime(0.3, t + 0.2);
          g.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
          osc.connect(g); g.connect(master);
          osc.start(t); osc.stop(t + 1.3);
          // Subtle sub-octave for depth (underwater feel)
          var osc2 = ctx.createOscillator();
          osc2.type = 'sine';
          osc2.frequency.value = freq / 2;
          var g2 = ctx.createGain();
          g2.gain.setValueAtTime(0, t + 0.05);
          g2.gain.linearRampToValueAtTime(0.15, t + 0.1);
          g2.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
          osc2.connect(g2); g2.connect(master);
          osc2.start(t + 0.05); osc2.stop(t + 1.1);
        });
      }
    } catch(e) {}
  }

  // ═══════════════ CONFETTI ═══════════════
  function spawnConfetti() {
    const colors = ['#cfb53b','#ff5d3b','#fbbf24','#34d399','#60a5fa','#a78bfa','#f87171'];
    for (let i = 0; i < 50; i++) {
      const el = document.createElement('div');
      el.style.cssText = `
        position:fixed;z-index:99998;pointer-events:none;
        left:${Math.random()*100}vw;
        width:${5+Math.random()*8}px;
        height:${5+Math.random()*8}px;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        border-radius:${Math.random()>0.5?'50%':'2px'};
        animation:achConfetti ${2+Math.random()*3}s linear forwards;
        animation-delay:${Math.random()*0.5}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }
  }

  // ═══════════════ PUBLIC API ═══════════════
  window.Achievements = {
    completeLesson() { state.lessons++; saveState(); checkAll(); },
    viewCourse(id) {
      if (!state._viewed) state._viewed = {};
      state._viewed[id] = true; state.courses = Object.keys(state._viewed).length;
      saveState(); checkAll();
    },
    completeExercise(correct) {
      state.exercises++;
      if (correct) {
        state.streak_correct++; state.total_acc_sum += 100;
        if (state.streak_correct > state.max_streak_correct) state.max_streak_correct = state.streak_correct;
      } else { state.streak_correct = 0; }
      state.avg_acc = state.exercises > 0 ? state.total_acc_sum / state.exercises : 0;
      saveState(); checkAll();
    },
    perfectQuiz() { state.perfect++; saveState(); checkAll(); },
    login() {
      const today = new Date().toISOString().split('T')[0];
      if (state.lastLogin) {
        const diff = Math.floor((new Date(today) - new Date(state.lastLogin)) / 86400000);
        state.streak = diff === 1 ? state.streak + 1 : (diff > 1 ? 1 : state.streak);
      } else { state.streak = 1; }
      const h = new Date().getHours();
      if (h >= 23 || h < 5) state.night_study = true;
      const d = new Date().getDay();
      if (d === 0 || d === 6) state.weekend++;
      saveState(); checkAll();
    },
    runCode(lang, lines) {
      state.code_runs++;
      if (lang && !state.langs.includes(lang)) state.langs.push(lang);
      if (lines > state.code_lines) state.code_lines = lines;
      state.no_errors++;
      saveState(); checkAll();
    },
    codeError() { state.no_errors = 0; state.bugs_fixed++; saveState(); checkAll(); },
    useViz(n) { if (n > state.viz_used) state.viz_used = n; saveState(); checkAll(); },
    useDSViz() { state.ds_viz++; saveState(); checkAll(); },
    trackTime(m) { if (m > state.daily_time) state.daily_time = m; saveState(); checkAll(); },
    speedRun() { state.speed_run = true; saveState(); checkAll(); },
    secret42() { state.secret_42 = true; saveState(); checkAll(); },
    konamiCode() { state.konami = true; saveState(); checkAll(); },
    completeAll() { state.all_complete = true; saveState(); checkAll(); },
    completePython() { state.py_complete = true; saveState(); checkAll(); },
    testToast(rarity) {
      var r = rarity || "common";
      var icons = { legendary:"⭐", epic:"🔮", rare:"💠", common:"✅" };
      var names = { legendary:"test-legendary", epic:"test-epic", rare:"test-rare", common:"test-common" };
      showToast({ id:"test", name:names[r]||"test", desc:"Console: Achievements.testToast()", icon:icons[r]||"✅", rarity:r });
    },

    reset() { state = defaultState(); saveState(); },
    getState() { return state; },
    getUnlocked() { return Object.keys(state.unlocked); },
    getUnlockedCount() { return Object.keys(state.unlocked).length; },
    getTotal() { return achievements.length; },
  };

  // ═══════════════ INIT ═══════════════
  // Inject required CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes achToastIn {
      from { opacity:0; transform:translateX(60px) scale(0.9); }
      to { opacity:1; transform:translateX(0) scale(1); }
    }
    @keyframes achConfetti {
      0% { transform:translateY(-10vh) rotate(0deg); opacity:1; }
      100% { transform:translateY(110vh) rotate(720deg); opacity:0; }
    }
  `;
  document.head.appendChild(style);

  // Konami Code
  const konamiSeq = [38,38,40,40,37,39,37,39,66,65];
  let konamiIdx = 0;
  document.addEventListener('keydown', function(e) {
    if (e.keyCode === konamiSeq[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === konamiSeq.length) { window.Achievements.konamiCode(); konamiIdx = 0; }
    } else { konamiIdx = 0; }
  });

  // Auto-login on page load
  state.lastLogin = new Date().toISOString().split('T')[0];
  saveState();
  checkAll();

})();