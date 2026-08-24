/* ============================================================
   py-core-viz.js — Python 程序设计可视化引擎
   参考 DS 课程风格：Canvas逐步动画 + 播放控制 + 代码面板
   ============================================================ */

const PyVizEngine = {
  canvas: null, ctx: null, W: 0, H: 0, dpr: 1,
  steps: [], stepIdx: 0, animId: null, playing: false, speed: 3,
  currentAlgo: '', currentData: null, currentKP: '',

  startColor: '#3776AB',   // Python蓝
  accentColor: '#FFD43B',  // Python黄
  nodeColors: ['#3776AB','#FFD43B','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4'],

  init(canvas) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;
    this._resize(); this.stepIdx = 0; this.playing = false;
    if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }
  },

  _resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.W = rect.width; this.H = Math.max(340, Math.min(480, rect.width * 0.55));
    this.canvas.width = this.W * this.dpr;
    this.canvas.height = this.H * this.dpr;
    this.canvas.style.width = this.W + 'px';
    this.canvas.style.height = this.H + 'px';
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  },

  /* ── 步骤生成分发 ── */
  generateSteps(kpId, data) {
    this.currentKP = kpId; this.currentData = data || {};
    this.steps = []; this.stepIdx = 0;
    const fnKey = '_gen_' + kpId.replace(/-/g, '_');
    if (this[fnKey]) { this[fnKey].call(this); }
    else { this.steps = [{ type:'title', t:'Python 概念演示', sub:'', info:'请选择具体知识点' }]; }
    this._updateProgress();
    this.draw();
  },

  /* ── 播放控制 ── */
  play() {
    if (this.playing || this.stepIdx >= this.steps.length - 1) return;
    this.playing = true;
    const btn = document.getElementById('pyPlayBtn');
    if (btn) btn.innerHTML = '⏸ 暂停';
    this._tick();
  },
  pause() {
    this.playing = false;
    if (this.animId) { clearTimeout(this.animId); this.animId = null; }
    const btn = document.getElementById('pyPlayBtn');
    if (btn) btn.innerHTML = '▶ 播放';
  },
  _tick() {
    if (!this.playing) return;
    this.draw();
    if (this.stepIdx >= this.steps.length - 1) { this.pause(); return; }
    this.stepIdx++;
    this._updateProgress();
    this.animId = setTimeout(() => { if (this.playing) this._tick(); }, Math.max(300, 1100 - this.speed * 80));
  },
  next() { if (this.stepIdx < this.steps.length - 1) { this.stepIdx++; this.draw(); this._updateProgress(); } },
  prev() { if (this.stepIdx > 0) { this.stepIdx--; this.draw(); this._updateProgress(); } },
  reset() { this.pause(); this.stepIdx = 0; this.draw(); this._updateProgress(); },

  _updateProgress() {
    const bar = document.getElementById('pyProgressFill');
    const info = document.getElementById('pyStepInfo');
    if (bar && this.steps.length > 1) bar.style.width = (this.stepIdx/(this.steps.length-1)*100).toFixed(1) + '%';
    if (info) {
      const s = this.steps[this.stepIdx];
      info.textContent = (s && s.info) ? s.info : ('步骤 ' + (this.stepIdx+1) + '/' + this.steps.length);
    }
  },

  /* ── 主绘制 ── */
  draw() {
    const step = this.steps[this.stepIdx]; if (!step) return;
    const ctx = this.ctx, W = this.W, H = this.H;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
    // 网格背景
    ctx.strokeStyle = 'rgba(148,163,184,0.03)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    const fn = this['_draw_' + step.type];
    if (fn) fn.call(this, ctx, W, H, step);
  },

  /* ═══════════════ 绘制函数 ═══════════════ */
  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
    ctx.quadraticCurveTo(x+w,y,x+w,y+r); ctx.lineTo(x+w,y+h-r);
    ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h);
    ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r);
    ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
  },

  _drawArrow(ctx, x1, y1, x2, y2, color) {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = color || '#475569'; ctx.lineWidth = 1.5; ctx.stroke();
    const ang = Math.atan2(y2-y1, x2-x1), len = 7;
    ctx.fillStyle = color || '#475569';
    ctx.beginPath(); ctx.moveTo(x2, y2);
    ctx.lineTo(x2-len*Math.cos(ang-Math.PI/6), y2-len*Math.sin(ang-Math.PI/6));
    ctx.lineTo(x2-len*Math.cos(ang+Math.PI/6), y2-len*Math.sin(ang+Math.PI/6));
    ctx.closePath(); ctx.fill();
  },

  /* ═══════════════ 绘制类型 ═══════════════ */
  _draw_title(ctx, W, H, s) {
    ctx.fillStyle = '#3776AB'; ctx.font = 'bold 22px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center'; ctx.fillText(s.t, W/2, H*0.38);
    if (s.sub) { ctx.fillStyle = '#94a3b8'; ctx.font = '14px "Microsoft YaHei", sans-serif'; ctx.fillText(s.sub, W/2, H*0.38+30); }
    ctx.textAlign = 'start';
  },

  // 内存模型：变量存储可视化
  _draw_memory_box(ctx, W, H, s) {
    const vars = s.vars || [], cx = W/2, startY = H*0.2;
    let maxLen = 0; vars.forEach(v => { const tw = ctx.measureText(v.label||v.name).width; if (tw > maxLen) maxLen = tw; });
    const boxW = Math.max(maxLen+40, 120), boxH = 30, gap = 10;
    const totalH = vars.length * (boxH+gap) - gap;
    const offsetY = Math.max(startY, H/2 - totalH/2);
    vars.forEach((v, i) => {
      const y = offsetY + i*(boxH+gap);
      const active = s.activeIdx === undefined || i <= s.activeIdx;
      const col = v.color || this.nodeColors[i % this.nodeColors.length];
      const alpha = active ? 1 : 0.3;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = col + '22'; ctx.strokeStyle = col; ctx.lineWidth = active ? 2 : 1;
      this._roundRect(ctx, cx - boxW/2, y, boxW, boxH, 6);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#e2e8f0'; ctx.font = (active ? 'bold ' : '') + '13px "Fira Code", monospace';
      ctx.textAlign = 'center'; ctx.fillText(v.label || v.name, cx, y+boxH/2+4);
      if (v.value !== undefined && active) {
        ctx.fillStyle = this.accentColor; ctx.font = '11px "Fira Code", monospace';
        ctx.fillText('= ' + v.value, cx + boxW/2 + 12, y+boxH/2+4);
      }
      ctx.globalAlpha = 1;
    });
    ctx.textAlign = 'start';
  },

  // 控制流图：if/else/loop 可视化
  _draw_flow(ctx, W, H, s) {
    const blocks = s.blocks || [], activeIdx = s.activeIdx || -1;
    const blockW = Math.min(160, W*0.35), blockH = 28, vGap = 14;
    const startY = H*0.15;
    let y = startY;
    blocks.forEach((b, i) => {
      const col = b.color || this.nodeColors[i % this.nodeColors.length];
      const active = i <= activeIdx;
      ctx.globalAlpha = active ? 1 : 0.3;
      if (b.shape === 'diamond') {
        const cx = W/2, cy = y + blockH;
        ctx.fillStyle = col + '22'; ctx.strokeStyle = col; ctx.lineWidth = active ? 2 : 1;
        ctx.beginPath(); ctx.moveTo(cx, cy-blockH/2); ctx.lineTo(cx+blockW/2, cy);
        ctx.lineTo(cx, cy+blockH/2); ctx.lineTo(cx-blockW/2, cy);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#e2e8f0'; ctx.font = '11px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(b.label, cx, cy+4);
        if (b.trueBranch && active) {
          ctx.fillStyle = '#10b981'; ctx.font = '10px "Microsoft YaHei", sans-serif';
          ctx.fillText('True → ' + b.trueBranch, cx + blockW/2 + 40, cy);
        }
        if (b.falseBranch && active) {
          ctx.fillStyle = '#ef4444'; ctx.font = '10px "Microsoft YaHei", sans-serif';
          ctx.fillText('False → ' + b.falseBranch, cx + blockW/2 + 40, cy + 16);
        }
        y += blockH + vGap + 8;
      } else {
        this._roundRect(ctx, W/2-blockW/2, y, blockW, blockH, 6);
        ctx.fillStyle = col + '22'; ctx.strokeStyle = col; ctx.lineWidth = active ? 2 : 1;
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#e2e8f0'; ctx.font = '11px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(b.label, W/2, y+blockH/2+4);
        y += blockH + vGap;
      }
      ctx.globalAlpha = 1;
    });
    ctx.textAlign = 'start';
  },

  // 序列操作：列表/数组可视化
  _draw_sequence(ctx, W, H, s) {
    const items = s.items || [], cellW = Math.min(65, (W-60)/items.length), cellH = 36;
    const startX = (W - cellW*items.length)/2, startY = H*0.3;
    // 索引行
    ctx.fillStyle = '#64748b'; ctx.font = '10px "Fira Code", monospace'; ctx.textAlign = 'center';
    items.forEach((_, i) => { ctx.fillText('['+i+']', startX + i*cellW + cellW/2, startY-10); });
    // 数据行
    items.forEach((it, i) => {
      const x = startX + i*cellW, y = startY;
      const highlight = s.highlightIdx === i;
      const deleted = s.deletedIdx === i;
      if (deleted) { ctx.globalAlpha = 0.2; }
      const col = highlight ? this.accentColor : this.startColor;
      ctx.fillStyle = highlight ? '#FFD43B22' : col + '18';
      ctx.strokeStyle = col; ctx.lineWidth = highlight ? 2.5 : 1;
      this._roundRect(ctx, x+3, y, cellW-6, cellH, 6);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = highlight ? this.accentColor : '#e2e8f0';
      ctx.font = 'bold 14px "Fira Code", monospace';
      ctx.fillText(it, x+cellW/2, y+cellH/2+5);
      if (s.arrowFrom === i && s.insertPos !== undefined) {
        ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2; ctx.setLineDash([4,2]);
        ctx.beginPath(); ctx.moveTo(x+cellW/2, y-8); ctx.lineTo(startX+s.insertPos*cellW+cellW/2, y-8);
        ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.arc(startX+s.insertPos*cellW+cellW/2, y-8, 4, 0, Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    });
    ctx.textAlign = 'start';
    // 切片演示
    if (s.sliceStart !== undefined) {
      const sx = startX + s.sliceStart*cellW, sw = (s.sliceEnd-s.sliceStart)*cellW;
      ctx.strokeStyle = '#FFD43B'; ctx.lineWidth = 2; ctx.setLineDash([4,3]);
      ctx.beginPath(); this._roundRect(ctx, sx-2, startY-4, sw+4, cellH+8, 8); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = '#FFD43B'; ctx.font = '11px "Fira Code", monospace'; ctx.textAlign = 'center';
      ctx.fillText('切片 ['+s.sliceStart+':'+s.sliceEnd+']', sx+sw/2, startY+cellH+20);
    }
    ctx.textAlign = 'start';
  },

  // 递归树
  _draw_recursion_tree(ctx, W, H, s) {
    const nodes = s.nodes || [];
    nodes.forEach(n => {
      const col = n.active ? '#FFD43B' : (n.done ? '#10b981' : '#475569');
      ctx.fillStyle = n.active ? '#FFD43B22' : (n.done ? '#10b98118' : 'rgba(255,255,255,0.04)');
      ctx.strokeStyle = col; ctx.lineWidth = n.active ? 2.5 : 1.5;
      this._roundRect(ctx, n.x-35, n.y-12, 70, 26, 6);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = col; ctx.font = (n.active?'bold ':'') + '12px "Fira Code", monospace'; ctx.textAlign = 'center';
      ctx.fillText(n.label, n.x, n.y+4);
      if (n.children) {
        n.children.forEach(ch => {
          ctx.strokeStyle = '#475569'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(n.x, n.y+14); ctx.lineTo(ch.x, ch.y-14); ctx.stroke();
        });
      }
      if (n.result && n.done) {
        ctx.fillStyle = '#94a3b8'; ctx.font = '10px "Fira Code", monospace';
        ctx.fillText('→ '+n.result, n.x+42, n.y+4);
      }
    });
    ctx.textAlign = 'start';
  },

  // 数据流图
  _draw_dataflow(ctx, W, H, s) {
    const steps = s.steps || [], active = s.activeIdx || -1, padX = 40, padY = 30;
    const boxW = 110, boxH = 50, arrowLen = 50;
    const count = steps.length, totalW = count*boxW + (count-1)*arrowLen;
    const startX = (W - totalW)/2, y = H/2 - boxH/2;
    steps.forEach((st, i) => {
      const x = startX + i*(boxW+arrowLen);
      const act = i <= active;
      const col = st.color || this.nodeColors[i % this.nodeColors.length];
      ctx.globalAlpha = act ? 1 : 0.25;
      ctx.fillStyle = col + '22'; ctx.strokeStyle = col; ctx.lineWidth = act ? 2.5 : 1.5;
      this._roundRect(ctx, x, y, boxW, boxH, 8); ctx.fill(); ctx.stroke();
      ctx.fillStyle = act ? '#e2e8f0' : '#64748b';
      ctx.font = (act ? 'bold ':'') + '12px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(st.label, x+boxW/2, y+22);
      ctx.font = '10px "Fira Code", monospace';
      ctx.fillStyle = act ? '#94a3b8' : '#475569';
      ctx.fillText(st.value||'', x+boxW/2, y+38);
      if (i < count-1 && act) {
        ctx.strokeStyle = col; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x+boxW, y+boxH/2); ctx.lineTo(x+boxW+arrowLen, y+boxH/2); ctx.stroke();
        this._drawArrow(ctx, x+boxW+arrowLen-8, y+boxH/2-4, x+boxW+arrowLen, y+boxH/2, col);
      }
      ctx.globalAlpha = 1;
    });
    ctx.textAlign = 'start';
  },

  // 对比卡片
  _draw_compare(ctx, W, H, s) {
    const left = s.left || {}, right = s.right || {};
    const cardW = W*0.38, cardH = H*0.55, cardY = H*0.2;
    const leftX = W*0.08, rightX = W*0.54;

    [ {label:s.leftTitle||'类型A', items:left.items||[], x:leftX, color:this.startColor},
      {label:s.rightTitle||'类型B', items:right.items||[], x:rightX, color:this.accentColor}
    ].forEach(card => {
      ctx.fillStyle = card.color + '18'; ctx.strokeStyle = card.color; ctx.lineWidth = 2;
      this._roundRect(ctx, card.x, cardY, cardW, cardH, 12);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 14px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(card.label, card.x+cardW/2, cardY+26);
      const itemH = 28, itemStart = cardY + 50;
      card.items.forEach((item, i) => {
        const iy = itemStart + i*itemH;
        ctx.fillStyle = (i <= (s.activeIdx||0) ? card.color : 'rgba(255,255,255,0.06)') + '';
        ctx.globalAlpha = i <= (s.activeIdx||0) ? 1 : 0.3;
        this._roundRect(ctx, card.x+10, iy, cardW-20, itemH-4, 6);
        ctx.fillStyle = i <= (s.activeIdx||0) ? card.color+'33' : 'rgba(255,255,255,0.04)';
        ctx.strokeStyle = i <= (s.activeIdx||0) ? card.color : 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1; this._roundRect(ctx, card.x+10, iy, cardW-20, itemH-4, 6);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = i <= (s.activeIdx||0) ? '#e2e8f0' : '#64748b';
        ctx.font = '11px "Fira Code", monospace';
        ctx.fillText(item, card.x+cardW/2, iy+(itemH-4)/2+4);
      });
      ctx.globalAlpha = 1;
    });
    ctx.textAlign = 'start';
  },

  /* ═══════════════ 步骤生成：面向知识点 ═══════════════ */

  /* Ch1: Python 概述 */
  _gen_py_1_0() {
    const feats = ['简洁优雅','动态类型','解释执行','跨平台','丰富标准库','开源社区'];
    this.steps = [
      { type:'title', t:'Python 简介', sub:'创始人: Guido van Rossum (1991)', info:'Python 是最受欢迎的编程语言之一' },
      ...feats.map((f,i) => ({
        type:'memory_box', vars:feats.map((ff,j)=>({label:ff,color:this.nodeColors[j%8]})),
        activeIdx:i, info:'特性 '+(i+1)+': '+f
      })),
    ];
  },

  _gen_py_1_1() {
    this.steps = [
      { type:'title', t:'开发环境配置', sub:'Python解释器 / IDE / Shell', info:'三步完成Python环境搭建' },
      { type:'dataflow', steps:[
        {label:'下载安装',value:'python.org'},{label:'配置PATH',value:'环境变量'},{label:'验证安装',value:'python --version'}
      ], activeIdx:0, info:'步骤1：从官网下载Python安装包' },
      { type:'dataflow', steps:[
        {label:'下载安装',value:'python.org'},{label:'配置PATH',value:'环境变量'},{label:'验证安装',value:'python --version'}
      ], activeIdx:1, info:'步骤2：安装时勾选Add Python to PATH' },
      { type:'dataflow', steps:[
        {label:'下载安装',value:'python.org'},{label:'配置PATH',value:'环境变量'},{label:'验证安装',value:'python --version'}
      ], activeIdx:2, info:'步骤3：终端运行 python --version 验证' },
      { type:'title', t:'IDE推荐', sub:'PyCharm · VSCode · Jupyter', info:'选择适合自己的开发工具' },
    ];
  },

  _gen_py_1_2() {
    this.steps = [
      { type:'title', t:'第一个Python程序', sub:'Hello, Python!', info:'从print()开始你的Python之旅' },
      { type:'dataflow', steps:[
        {label:'源代码',value:'print("Hello")'},{label:'解释执行',value:'Python解释器'},{label:'输出',value:'Hello'}
      ], activeIdx:0, info:'Python是解释型语言——代码逐行翻译执行' },
      { type:'dataflow', steps:[
        {label:'源代码',value:'print("Hello")'},{label:'解释执行',value:'Python解释器'},{label:'输出',value:'Hello'}
      ], activeIdx:1, info:'解释器将代码翻译为字节码，PVM执行' },
      { type:'dataflow', steps:[
        {label:'源代码',value:'print("Hello")'},{label:'解释执行',value:'Python解释器'},{label:'输出',value:'Hello'}
      ], activeIdx:2, info:'最终输出：屏幕显示"Hello"' },
      { type:'title', t:'代码缩进规则', sub:'Python用缩进表示代码块（4空格）', info:'缩进是语法要求，不是风格建议' },
    ];
  },

  /* Ch2: 变量与数据类型 */
  _gen_py_2_0() {
    this.steps = [
      { type:'title', t:'变量与命名规则', sub:'动态类型·蛇形命名·多重赋值', info:'Python变量无需声明类型' },
      { type:'memory_box', vars:[
        {label:'name',value:'"张三"',color:this.startColor},
        {label:'age',value:'20',color:'#10b981'},
        {label:'score',value:'95.5',color:'#f59e0b'},
        {label:'is_pass',value:'True',color:'#8b5cf6'}
      ], activeIdx:0, info:'变量创建：直接赋值即可，Python自动推断类型' },
      { type:'memory_box', vars:[
        {label:'name',value:'"张三"',color:this.startColor},
        {label:'age',value:'20',color:'#10b981'},
        {label:'score',value:'95.5',color:'#f59e0b'},
        {label:'is_pass',value:'True',color:'#8b5cf6'}
      ], activeIdx:3, info:'动态类型：同一变量可随时指向不同类型的值' },
      { type:'title', t:'多重赋值', sub:'x, y = y, x — 一行完成交换', info:'Python特色：无需临时变量' },
      { type:'memory_box', vars:[
        {label:'x',value:'10',color:this.startColor},{label:'y',value:'20',color:'#FFD43B'}
      ], activeIdx:1, info:'交换前: x=10, y=20' },
      { type:'memory_box', vars:[
        {label:'x',value:'20',color:this.startColor},{label:'y',value:'10',color:'#FFD43B'}
      ], activeIdx:1, info:'交换后: x=20, y=10 (一行代码完成!)' },
    ];
  },

  _gen_py_2_1() {
    this.steps = [
      { type:'title', t:'基本数据类型', sub:'int · float · complex · bool · str', info:'Python六大标准数据类型' },
      { type:'memory_box', vars:[
        {label:'int',value:'42 (无限精度)',color:this.startColor},
        {label:'float',value:'3.14159',color:'#0ea5e9'},
        {label:'complex',value:'1+2j',color:'#10b981'},
        {label:'bool',value:'True/False',color:'#f59e0b'},
        {label:'str',value:'"Hello"',color:'#8b5cf6'},
      ], activeIdx:0, info:'数字类型：int无限精度、float双精度、complex复数' },
      { type:'memory_box', vars:[
        {label:'int',value:'42',color:this.startColor},
        {label:'float',value:'3.14159',color:'#0ea5e9'},
        {label:'complex',value:'1+2j',color:'#10b981'},
        {label:'bool ⊂ int',value:'True≈1',color:'#f59e0b'},
        {label:'str',value:'Unicode',color:'#8b5cf6'},
      ], activeIdx:3, info:'bool是int的子类：True==1, False==0' },
      { type:'dataflow', steps:[
        {label:'"42"',value:'str',color:this.accentColor},
        {label:'int()',value:'转换',color:'#10b981'},
        {label:'42',value:'int',color:this.startColor},
      ], activeIdx:2, info:'类型转换：int("42") + 8 = 50' },
    ];
  },

  _gen_py_2_2() {
    this.steps = [
      { type:'title', t:'运算符与表达式', sub:'算术·关系·逻辑·成员·同一性', info:'Python运算符体系' },
      { type:'dataflow', steps:[
        {label:'17 + 5',value:'→ 22',color:this.startColor},
        {label:'17 // 5',value:'→ 3',color:'#10b981'},
        {label:'17 ** 5',value:'→ 1419857',color:'#f59e0b'},
      ], activeIdx:2, info:'算术运算符：+ - * / // % **' },
      { type:'compare', leftTitle:'== (值相等)', rightTitle:'is (同一对象)',
        left:{items:['a=[1,2]','b=[1,2]','a == b → True']},
        right:{items:['a=[1,2]','b=[1,2]','a is b → False']},
        activeIdx:2, info:'== 比较值，is 比较内存地址 — 不要混淆!' },
      { type:'title', t:'短路求值', sub:'and/or 的惰性计算机制', info:'False and (10/0) — 不会报除零错误!' },
    ];
  },

  /* Ch3: 流程控制 */
  _gen_py_3_0() {
    this.steps = [
      { type:'title', t:'条件判断', sub:'if / elif / else 多分支', info:'根据条件选择执行路径' },
      { type:'flow', blocks:[
        {label:'开始',color:this.startColor},
        {label:'score >= 90?',shape:'diamond',color:'#f59e0b',trueBranch:'grade=A',falseBranch:'继续判断'},
        {label:'score >= 80?',shape:'diamond',color:'#10b981',trueBranch:'grade=B',falseBranch:'继续'},
        {label:'score >= 70?',shape:'diamond',color:'#0ea5e9',trueBranch:'grade=C',falseBranch:'继续'},
        {label:'grade=D',color:'#ef4444'}
      ], activeIdx:1, info:'if-elif-else：从上到下依次判断，命中即停止' },
      { type:'flow', blocks:[
        {label:'score=85',color:'#FFD43B'},
        {label:'>=90? No',shape:'diamond',color:'#f59e0b'},
        {label:'>=80? Yes!',shape:'diamond',color:'#10b981'},
        {label:'grade = B',color:'#3776AB'}
      ], activeIdx:3, info:'实际执行路径：score=85 → ≥80 → grade="B"' },
      { type:'title', t:'三元表达式', sub:'"成年" if age>=18 else "未成年"', info:'一行完成简单条件判断' },
    ];
  },

  _gen_py_3_1() {
    this.steps = [
      { type:'title', t:'循环语句', sub:'for-in · while · range()', info:'Python的两种循环方式' },
      { type:'sequence', items:['1','2','3','4','5'], highlightIdx:0,
        info:'for i in range(1,6): 遍历1到5的数字序列' },
      { type:'sequence', items:['1','2','3','4','5'], highlightIdx:1, info:'第2次迭代: i=2' },
      { type:'sequence', items:['1','2','3','4','5'], highlightIdx:2, info:'第3次迭代: i=3' },
      { type:'sequence', items:['1','2','3','4','5'], highlightIdx:4, info:'最后一次迭代: i=5' },
      { type:'title', t:'break / continue / pass', sub:'跳出循环 · 跳过本次 · 占位', info:'循环控制三剑客' },
    ];
  },

  _gen_py_3_2() {
    this.steps = [
      { type:'title', t:'流程控制综合练习', sub:'九九乘法表 · 斐波那契 · 素数', info:'综合应用条件与循环' },
      { type:'sequence', items:['1','2','3','4','5','6','7','8','9'],
        sliceStart:0, sliceEnd:3, highlightIdx:2, info:'外层循环 for i in range(1,10): 第i行' },
      { type:'dataflow', steps:[
        {label:'a,b=0,1',value:'初始化',color:this.startColor},
        {label:'a,b=b,a+b',value:'递推',color:'#10b981'},
        {label:'[0,1,1,2,...]',value:'斐波那契',color:this.accentColor},
      ], activeIdx:2, info:'斐波那契数列：一行Python代码完成递推更新' },
    ];
  },

  /* Ch4: 序列 */
  _gen_py_4_0() {
    this.steps = [
      { type:'title', t:'列表操作', sub:'索引·切片·增删改查·推导式', info:'Python最常用的序列类型' },
      { type:'sequence', items:['1','2','3','4','5'], highlightIdx:0, info:'nums = [1, 2, 3, 4, 5] — 索引从0开始' },
      { type:'sequence', items:['1','2','3','4','5'], highlightIdx:4, info:'nums[-1] = 5 — 负数索引从末尾计数' },
      { type:'sequence', items:['1','2','3','4','5'], sliceStart:1, sliceEnd:4,
        info:'nums[1:4] = [2, 3, 4] — 切片：左闭右开' },
      { type:'sequence', items:['1','2','99','3','4','5','6'], highlightIdx:2, arrowFrom:2, insertPos:2,
        info:'nums.insert(2, 99) — 在索引2处插入99' },
      { type:'sequence', items:['1','4','9','16','25','36','49','64','81','100'],
        info:'列表推导式：[x**2 for x in range(1,11)] — Python精髓!' },
    ];
  },

  _gen_py_4_1() {
    this.steps = [
      { type:'title', t:'元组 (Tuple)', sub:'不可变序列 · 打包解包 · 多返回值', info:'元组与列表的核心区别：不可变性' },
      { type:'compare', leftTitle:'列表 (mutable)', rightTitle:'元组 (immutable)',
        left:{items:['可以修改: nums[0]=99','支持append/remove','适合频繁变更的集合']},
        right:{items:['不可修改: t[0]=99 → 报错!','节省内存，哈希可用','适合固定数据/多返回值']},
        activeIdx:2, info:'核心区别：列表可变，元组不可变' },
      { type:'dataflow', steps:[
        {label:'def stats(n)',value:'',color:this.startColor},
        {label:'min(n),max(n)',value:'→ (1,5)',color:'#10b981'},
        {label:'a,b = result',value:'a=1,b=5',color:this.accentColor},
      ], activeIdx:2, info:'多返回值函数实际返回元组，一行解包获取各值' },
    ];
  },

  _gen_py_4_2() {
    this.steps = [
      { type:'title', t:'字符串处理', sub:'索引·切片·split/join·find/replace', info:'Python字符串是不可变序列' },
      { type:'sequence', items:['P','y','t','h','o','n'], highlightIdx:0, info:'s[0] = P — 字符串也是序列，支持索引' },
      { type:'sequence', items:['P','y','t','h','o','n'], sliceStart:0, sliceEnd:3,
        info:'s[0:3] = "Pyt" — 字符串切片返回新字符串' },
      { type:'dataflow', steps:[
        {label:'"张,85,95"',value:'',color:this.startColor},
        {label:'split(",")',value:'',color:'#10b981'},
        {label:'["张","85","95"]',value:'',color:this.accentColor},
      ], activeIdx:2, info:'split() 按分隔符拆分 → join() 按分隔符合并' },
      { type:'title', t:'f-string', sub:"f'{name}: {score}分'", info:'Python 3.6+ 最优雅的字符串格式化方式' },
    ];
  },

  _gen_py_4_3() {
    this.steps = [
      { type:'title', t:'序列通用操作', sub:'索引·切片·len·min·max·sum·enumerate', info:'所有序列类型共享的操作' },
      { type:'sequence', items:['10','20','30','40','50'], highlightIdx:2, info:'seq[2] = 30 — 通用索引' },
      { type:'sequence', items:['10','20','30','40','50'], sliceStart:1, sliceEnd:4,
        info:'seq[1:4] = [20,30,40] — 通用切片（左闭右开）' },
      { type:'memory_box', vars:[
        {label:'len(seq)',value:'5',color:'#3776AB'},
        {label:'min(seq)',value:'10',color:'#10b981'},
        {label:'max(seq)',value:'50',color:'#f59e0b'},
        {label:'sum(seq)',value:'150',color:'#8b5cf6'},
      ], activeIdx:3, info:'内置函数：len/min/max/sum — 适用所有序列' },
    ];
  },

  /* Ch5: 字典与集合 */
  _gen_py_5_0() {
    const dictViz = (keys, vals, active, info) => ({
      type:'sequence', items:keys.map((k,i)=>k+'→'+vals[i]), highlightIdx:active, info:info
    });
    this.steps = [
      { type:'title', t:'字典 (dict)', sub:'键值对·哈希表·O(1)查找', info:'Python最强大的数据结构之一' },
      { type:'sequence', items:['name→张三','age→20','score→95'],
        info:'student = {"name":"张三", "age":20, "score":95}' },
      { type:'sequence', items:['name→张三','age→20','score→95'], highlightIdx:0,
        info:'student["name"] = "张三" — 通过键快速查找值，O(1)' },
      { type:'dataflow', steps:[
        {label:'"name"',value:'hash()',color:this.startColor},
        {label:'→ 桶[3]',value:'',color:'#10b981'},
        {label:'→ "张三"',value:'',color:this.accentColor},
      ], activeIdx:2, info:'字典底层：键→哈希→存储桶→值 — O(1)查找!' },
      { type:'memory_box', vars:[
        {label:'.keys()',value:'所有键',color:this.startColor},
        {label:'.values()',value:'所有值',color:'#10b981'},
        {label:'.items()',value:'键值对',color:this.accentColor},
      ], activeIdx:2, info:'遍历字典：keys/values/items 三种方式' },
    ];
  },

  _gen_py_5_1() {
    this.steps = [
      { type:'title', t:'集合 (set)', sub:'去重·集合运算·O(1)成员检测', info:'无序·不重复·可哈希' },
      { type:'sequence', items:['1','2','2','3','3','3'], highlightIdx:5,
        info:'data = [1,2,2,3,3,3] — 有重复' },
      { type:'sequence', items:['1','2','3'],
        info:'set(data) = {1,2,3} — 自动去重!' },
      { type:'compare', leftTitle:'集合A={1,2,3,4}', rightTitle:'集合B={3,4,5,6}',
        left:{items:['A & B = {3,4}','A | B = {1..6}','A - B = {1,2}']},
        right:{items:['交集','并集','差集']},
        activeIdx:2, info:'集合运算：& | - ^ 对标数学集合' },
    ];
  },

  /* Ch6: 函数 */
  _gen_py_6_0() {
    this.steps = [
      { type:'title', t:'函数定义与参数', sub:'def · 返回值 · 参数类型', info:'函数是Python的一等公民' },
      { type:'dataflow', steps:[
        {label:'def add(a,b)',value:'',color:this.startColor},
        {label:'a+b',value:'处理',color:'#10b981'},
        {label:'return result',value:'',color:this.accentColor},
      ], activeIdx:2, info:'函数三要素：输入(参数) → 处理(函数体) → 输出(返回值)' },
      { type:'memory_box', vars:[
        {label:'位置参数',value:'func(a,b)',color:this.startColor},
        {label:'默认参数',value:'func(a,b=2)',color:'#10b981'},
        {label:'*args',value:'元组',color:this.accentColor},
        {label:'**kwargs',value:'字典',color:'#f59e0b'},
      ], activeIdx:3, info:'四种参数类型：位置→默认→可变位置→可变关键字' },
      { type:'title', t:'解包传参', sub:'print(*[10,20,30]) → 10 20 30', info:'用*解包序列为独立参数' },
    ];
  },

  _gen_py_6_1() {
    this.steps = [
      { type:'title', t:'递归函数', sub:'基线条件·递推·调用自身', info:'三要素缺一不可' },
      { type:'recursion_tree', nodes:[
        {label:'fact(3)',x:200,y:40,active:true,children:[{x:200,y:90},{x:200,y:90}]},
      ], info:'fact(3) = 3 × fact(2) — 递推：问题规模缩小' },
      { type:'recursion_tree', nodes:[
        {label:'fact(3)',x:200,y:40,active:true,
          children:[
            {label:'fact(2)',x:200,y:100,active:true,
              children:[{label:'fact(1)',x:200,y:160,done:true,result:'1'}]}
          ]},
      ], info:'fact(1) = 1 — 基线条件触发，开始回溯' },
      { type:'recursion_tree', nodes:[
        {label:'fact(3)',x:200,y:40,done:true,result:'6',
          children:[
            {label:'fact(2)',x:200,y:100,done:true,result:'2',
              children:[{label:'fact(1)',x:200,y:160,done:true,result:'1'}]}
          ]},
      ], info:'fact(3) = 3×2×1 = 6 — 递归结果逐级返回' },
    ];
  },

  _gen_py_6_2() {
    this.steps = [
      { type:'title', t:'变量作用域', sub:'LEGB规则·global·nonlocal', info:'Python查找变量的四个层次' },
      { type:'memory_box', vars:[
        {label:'Local',value:'函数内定义',color:this.startColor},
        {label:'Enclosing',value:'外层函数',color:'#10b981'},
        {label:'Global',value:'模块级',color:this.accentColor},
        {label:'Built-in',value:'内置函数',color:'#f59e0b'},
      ], activeIdx:0, info:'LEGB规则：Local→Enclosing→Global→Built-in 依次查找' },
      { type:'memory_box', vars:[
        {label:'Local',value:'优先',color:this.startColor},
        {label:'Enclosing',value:'次之',color:'#10b981'},
        {label:'Global',value:'需要global声明',color:this.accentColor},
        {label:'Built-in',value:'最后查找',color:'#f59e0b'},
      ], activeIdx:2, info:'修改全局变量需要 global 关键字声明' },
      { type:'title', t:'lambda 匿名函数', sub:'square = lambda x: x**2', info:'一行定义简单函数' },
    ];
  },

  /* Ch7: 模块 */
  _gen_py_7_0() {
    this.steps = [
      { type:'title', t:'模块导入机制', sub:'import · from-import · as别名', info:'模块是Python代码组织的基本单位' },
      { type:'dataflow', steps:[
        {label:'import math',value:'',color:this.startColor},
        {label:'搜索sys.path',value:'找到math.py',color:'#10b981'},
        {label:'math.sqrt(16)',value:'→ 4.0',color:this.accentColor},
      ], activeIdx:2, info:'import流程：搜索路径→加载模块→创建命名空间' },
      { type:'title', t:'__name__ == "__main__"', sub:'区分直接运行 vs 被导入', info:'Python程序的入口约定' },
    ];
  },

  _gen_py_7_1() { this.steps = [{ type:'title', t:'常用标准库', sub:'random · time · json · os/sys', info:'Python自带的标准库足够强大' }]; },

  /* Ch8: 文件与异常 */
  _gen_py_8_0() {
    this.steps = [
      { type:'title', t:'文件读写操作', sub:'open() · read/write · with语句', info:'Python文件操作简洁直观' },
      { type:'dataflow', steps:[
        {label:'open("f.txt","w")',value:'',color:this.startColor},
        {label:'f.write(data)',value:'',color:'#10b981'},
        {label:'磁盘存储',value:'',color:this.accentColor},
      ], activeIdx:0, info:'写入流程：打开文件→写入数据→自动关闭(with)' },
      { type:'dataflow', steps:[
        {label:'磁盘数据',value:'',color:this.startColor},
        {label:'f.read()',value:'',color:'#10b981'},
        {label:'程序内存',value:'',color:this.accentColor},
      ], activeIdx:2, info:'读取流程：with自动管理文件资源' },
      { type:'title', t:'with 语句', sub:'上下文管理器 — 自动关闭资源', info:'推荐做法：始终使用with操作文件' },
    ];
  },

  _gen_py_8_1() { this.steps = [{ type:'title', t:'CSV与JSON处理', sub:'csv模块 · json序列化 · 编码问题', info:'数据交换的两种标准格式' }]; },
  _gen_py_8_2() {
    this.steps = [
      { type:'title', t:'异常捕获与处理', sub:'try/except/else/finally', info:'优雅的错误处理机制' },
      { type:'flow', blocks:[
        {label:'try:',color:'#10b981'},
        {label:'可能出现异常的代码',color:'rgba(16,185,129,0.15)'},
        {label:'成功?',shape:'diamond',trueBranch:'else: 执行',falseBranch:'except: 捕获'},
        {label:'finally: 清理',color:'#3776AB'},
      ], activeIdx:4, info:'try→except/else→finally：无论是否异常，finally都会执行' },
    ];
  },

  /* Ch9: OOP */
  _gen_py_9_0() {
    this.steps = [
      { type:'title', t:'类与对象', sub:'class · __init__ · self · 实例', info:'Python面向对象编程基础' },
      { type:'dataflow', steps:[
        {label:'class Student:',value:'定义',color:this.startColor},
        {label:'__init__()',value:'构造',color:'#10b981'},
        {label:'s = Student()',value:'实例化',color:this.accentColor},
      ], activeIdx:2, info:'类→构造方法→实例对象：三步创建' },
      { type:'memory_box', vars:[
        {label:'s1.name',value:'"张三"',color:this.startColor},
        {label:'s1.age',value:'20',color:'#10b981'},
        {label:'s1.score',value:'85',color:this.accentColor},
      ], activeIdx:2, info:'实例属性：每个对象独立的属性副本' },
    ];
  },

  _gen_py_9_1() {
    this.steps = [
      { type:'title', t:'继承与多态', sub:'class Dog(Animal): · super() · 方法重写', info:'面向对象三大特性之继承' },
      { type:'dataflow', steps:[
        {label:'Animal(speak)',value:'',color:this.startColor},
        {label:'└ Dog("汪汪")',value:'子类',color:'#10b981'},
        {label:'└ Cat("喵喵")',value:'子类',color:this.accentColor},
      ], activeIdx:2, info:'继承层次：子类继承父类方法，可以重写' },
      { type:'title', t:'多态', sub:'同一方法，不同行为', info:'animals列表 → 遍历调用speak() → 各自输出' },
    ];
  },

  _gen_py_9_2() {
    this.steps = [
      { type:'title', t:'魔术方法', sub:'__add__ · __str__ · __len__', info:'双下划线方法，定制对象行为' },
      { type:'dataflow', steps:[
        {label:'Vector(3,4)',value:'',color:this.startColor},
        {label:'__add__(other)',value:'+',color:'#10b981'},
        {label:'Vector(4,6)',value:'',color:this.accentColor},
      ], activeIdx:2, info:'运算符重载：定义__add__即可用+号操作对象' },
      { type:'title', t:'@property', sub:'像访问属性一样调用方法', info:'c.radius → 实际调用getter; c.radius=10 → 调用setter(含验证)' },
    ];
  },

  /* Ch10: 实战 */
  _gen_py_10_0() { this.steps = [{ type:'title', t:'爬虫入门', sub:'requests · BeautifulSoup · 正则', info:'网络数据采集基础' }]; },
  _gen_py_10_1() { this.steps = [{ type:'title', t:'数据分析基础', sub:'pandas · matplotlib', info:'数据读取·清洗·可视化' }]; },
  _gen_py_10_2() { this.steps = [{ type:'title', t:'项目实战', sub:'综合运用Python技能', info:'数据获取→处理→分析→展示' }]; },
};

/* ═══════ Python 知识点到 KP-ID 的映射 ═══════ */

const pyVizMap = {
  'Python 简介与应用领域': { kpId:'py-1-0', name:'Python语言概述' },
  '开发环境配置':         { kpId:'py-1-1', name:'开发环境配置演示' },
  '第一个Python程序':     { kpId:'py-1-2', name:'第一个Python程序' },
  '变量与命名规则':       { kpId:'py-2-0', name:'变量与动态类型' },
  '基本数据类型':         { kpId:'py-2-1', name:'数据类型体系' },
  '类型转换与运算符':     { kpId:'py-2-2', name:'运算符与表达式' },
  '条件判断':             { kpId:'py-3-0', name:'条件分支流程' },
  '循环语句':             { kpId:'py-3-1', name:'循环迭代演示' },
  '流程控制综合':         { kpId:'py-3-2', name:'流程控制综合' },
  '列表操作':             { kpId:'py-4-0', name:'列表与索引' },
  '元组与不可变性':       { kpId:'py-4-1', name:'元组与解包' },
  '字符串处理':           { kpId:'py-4-2', name:'字符串操作' },
  '序列通用操作':         { kpId:'py-4-3', name:'序列通用方法' },
  '字典操作':             { kpId:'py-5-0', name:'字典与哈希表' },
  '集合与运算':           { kpId:'py-5-1', name:'集合与数学运算' },
  '函数定义与参数':       { kpId:'py-6-0', name:'函数定义与参数' },
  '递归函数':             { kpId:'py-6-1', name:'递归调用演示' },
  '变量作用域与lambda':  { kpId:'py-6-2', name:'作用域与lambda' },
  '模块导入机制':         { kpId:'py-7-0', name:'模块导入与加载' },
  '常用标准库实战':       { kpId:'py-7-1', name:'标准库一览' },
  '文件读写操作':         { kpId:'py-8-0', name:'文件读写流程' },
  'CSV与JSON处理':       { kpId:'py-8-1', name:'数据交换格式' },
  '异常捕获与处理':       { kpId:'py-8-2', name:'异常处理机制' },
  '类与对象':             { kpId:'py-9-0', name:'类与实例' },
  '继承与多态':           { kpId:'py-9-1', name:'继承体系' },
  '魔术方法与特性':       { kpId:'py-9-2', name:'魔术方法' },
  '爬虫入门':             { kpId:'py-10-0', name:'网络爬虫基础' },
  '数据分析基础':         { kpId:'py-10-1', name:'Pandas数据分析' },
  '项目实战':             { kpId:'py-10-2', name:'综合项目实战' },
};
