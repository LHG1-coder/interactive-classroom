/* ═══════════════════════════════════════════════════════════════
   DS基础阶段可视化引擎 — ds-basic-viz.js
   覆盖 绪论/线性表/栈和队列/串/数组和广义表 共17个知识点
   ═══════════════════════════════════════════════════════════════ */

const DsBasicVizEngine = {
  canvas: null, ctx: null, W: 0, H: 0, dpr: 1,
  steps: [], stepIdx: 0, animId: null, playing: false, speed: 1,
  currentAlgo: '', currentData: null, currentKP: '',

  init(canvas) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;
    this._resize(); this.stepIdx = 0; this.playing = false;
    if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }
  },

  _resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.W = rect.width; this.H = Math.max(340, Math.min(500, rect.width * 0.55));
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
    const fn = this[fnKey];
    if (fn) { fn.call(this); } else { this.steps = [{ type: 'title', t: '演示准备中...', sub: '', info: '演示准备中...' }]; }
    this._updateProgress();
    this.draw();
  },

  /* ── 播放控制 ── */
  play() {
    if (this.playing) return; this.playing = true;
    const btn = document.getElementById('basicPlayBtn');
    if (btn) btn.innerHTML = '⏸ 暂停';
    this._tick();
  },
  pause() {
    this.playing = false;
    if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }
    const btn = document.getElementById('basicPlayBtn');
    if (btn) btn.innerHTML = '▶ 播放';
  },
  _tick() {
    if (!this.playing) return;
    this.animId = setTimeout(() => {
      if (this.stepIdx < this.steps.length - 1) { this.stepIdx++; this.draw(); this._updateProgress(); }
      else { this.pause(); return; }
      this._tick();
    }, 1100 - this.speed * 90);
  },
  next() { if (this.stepIdx < this.steps.length - 1) { this.stepIdx++; this.draw(); this._updateProgress(); } },
  prev() { if (this.stepIdx > 0) { this.stepIdx--; this.draw(); this._updateProgress(); } },
  reset() { this.pause(); this.stepIdx = 0; this.draw(); this._updateProgress(); },

  _updateProgress() {
    const bar = document.getElementById('basicProgressFill');
    const info = document.getElementById('basicStepInfo');
    if (bar) bar.style.width = this.steps.length > 1 ? (this.stepIdx / (this.steps.length - 1) * 100) + '%' : '0%';
    if (info) {
      const s = this.steps[this.stepIdx];
      info.textContent = (s && s.info) ? s.info : ('步骤 ' + (this.stepIdx + 1) + '/' + this.steps.length);
    }
  },

  /* ── 主绘制 ── */
  draw() {
    const step = this.steps[this.stepIdx];
    if (!step) return;
    const ctx = this.ctx, W = this.W, H = this.H;
    ctx.clearRect(0, 0, W, H);
    // 背景
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
    const fn = this['_draw_' + step.type];
    if (fn) fn.call(this, ctx, W, H, step);
  },

  /* ══════════════════════════════════════════════════════
     Ch1 绪论
     ══════════════════════════════════════════════════════ */

  /* ── 1-0 数据结构基本概念 ── */
  _gen_ds_1_0() {
    const steps = [
      { type:'title', t:'数据结构基本概念', sub:'数据、数据元素、数据对象、数据结构' },
    ];
    // 概念层次图
    const concepts = ['数据', '数据对象', '数据元素', '数据项'];
    for (let i = 0; i < concepts.length; i++) {
      steps.push({ type:'concept_layer', idx:i, total:concepts.length, labels:concepts, active:i,
        info: concepts[i] + (i===0?' — 所有能输入到计算机中的符号总称':
          i===1?' — 性质相同的数据元素的集合':
          i===2?' — 数据的基本单位，通常作为一个整体处理':
          ' — 构成数据元素的最小不可分割单位') });
    }
    // 数据结构三要素
    steps.push({ type:'title', t:'数据结构三要素', sub:'逻辑结构 · 存储结构 · 数据运算', info:'数据结构三要素关系' });
    steps.push({ type:'three_elements', phase:0, info:'逻辑结构：数据元素之间的逻辑关系' });
    steps.push({ type:'three_elements', phase:1, info:'存储结构：数据结构在计算机中的表示' });
    steps.push({ type:'three_elements', phase:2, info:'数据运算：施加在数据上的操作（增删改查）' });
    this.steps = steps;
  },

  _draw_title(ctx, W, H, s) {
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 22px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center'; ctx.fillText(s.t, W/2, H*0.35);
    if (s.sub) { ctx.fillStyle = '#94a3b8'; ctx.font = '14px "Microsoft YaHei", sans-serif'; ctx.fillText(s.sub, W/2, H*0.35+30); }
  },

  _draw_concept_layer(ctx, W, H, s) {
    const cx = W/2, labels = s.labels, total = s.total, active = s.active;
    // 倒金字塔
    const baseW = W * 0.7, topW = W * 0.2;
    for (let i = 0; i < total; i++) {
      const y = H*0.2 + i * H*0.17;
      const w = topW + (baseW - topW) * (i / (total-1));
      const x = cx - w/2;
      const isActive = i <= active;
      ctx.fillStyle = isActive ? (i===active?'#10b981':'rgba(16,185,129,0.25)') : 'rgba(255,255,255,0.05)';
      ctx.strokeStyle = isActive ? '#10b981' : 'rgba(255,255,255,0.15)';
      ctx.lineWidth = isActive ? 2 : 1;
      this._roundRect(ctx, x, y, w, 34, 6);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = isActive ? '#fff' : '#64748b';
      ctx.font = (isActive ? 'bold ':'') + '14px "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'center'; ctx.fillText(labels[i], cx, y+22);
      if (i < total-1 && i <= active) {
        ctx.strokeStyle = 'rgba(16,185,129,0.4)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cx, y+34); ctx.lineTo(cx, y+H*0.17);
        ctx.stroke();
      }
    }
  },

  _draw_three_elements(ctx, W, H, s) {
    const items = [
      { label:'逻辑结构', desc:'集合/线性/树形/图形', x:W*0.12, color:'#3b82f6' },
      { label:'存储结构', desc:'顺序/链式/索引/散列', x:W*0.38, color:'#8b5cf6' },
      { label:'数据运算', desc:'增删改查/排序/遍历', x:W*0.64, color:'#f59e0b' },
    ];
    const y = H*0.35;
    items.forEach((it, i) => {
      const active = i <= s.phase;
      ctx.fillStyle = active ? it.color : 'rgba(255,255,255,0.05)';
      ctx.strokeStyle = active ? it.color : 'rgba(255,255,255,0.15)';
      ctx.lineWidth = active ? 2.5 : 1;
      const bw = W*0.22, bh = 60;
      this._roundRect(ctx, it.x, y, bw, bh, 10);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = active ? '#fff' : '#64748b';
      ctx.font = (active ? 'bold ':'') + '15px "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(it.label, it.x+bw/2, y+26);
      ctx.font = '11px "Microsoft YaHei", sans-serif';
      ctx.fillStyle = active ? 'rgba(255,255,255,0.7)' : '#475569';
      ctx.fillText(it.desc, it.x+bw/2, y+48);
      if (i < 2) {
        ctx.strokeStyle = active ? it.color : 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(it.x+bw, y+bh/2); ctx.lineTo(items[i+1].x, y+bh/2);
        ctx.stroke();
        // arrow
        ctx.fillStyle = active ? it.color : 'rgba(255,255,255,0.2)';
        ctx.beginPath(); ctx.moveTo(items[i+1].x-8, y+bh/2-5);
        ctx.lineTo(items[i+1].x, y+bh/2); ctx.lineTo(items[i+1].x-8, y+bh/2+5);
        ctx.fill();
      }
    });
  },

  /* ── 1-1 逻辑结构与存储结构 ── */
  _gen_ds_1_1() {
    const steps = [
      { type:'title', t:'四种逻辑结构', sub:'集合 · 线性 · 树形 · 图形', info:'数据元素间的逻辑关系分类' },
    ];
    const structs = [
      { name:'集合', desc:'元素同属一个集合，无其他关系', pts:[{x:0.15,y:0.35},{x:0.3,y:0.28},{x:0.22,y:0.52},{x:0.35,y:0.45},{x:0.18,y:0.42}] },
      { name:'线性结构', desc:'一对一关系，前驱后继', pts:[{x:0.1,y:0.35},{x:0.22,y:0.35},{x:0.34,y:0.35},{x:0.46,y:0.35},{x:0.58,y:0.35}] },
      { name:'树形结构', desc:'一对多层次关系', pts:[{x:0.5,y:0.2},{x:0.25,y:0.4},{x:0.5,y:0.4},{x:0.75,y:0.4},{x:0.2,y:0.6},{x:0.4,y:0.6},{x:0.6,y:0.6}] },
      { name:'图形结构', desc:'多对多任意关系', pts:[{x:0.2,y:0.25},{x:0.5,y:0.2},{x:0.8,y:0.3},{x:0.3,y:0.55},{x:0.65,y:0.5}] },
    ];
    for (let i = 0; i < structs.length; i++) {
      steps.push({ type:'logic_struct', idx:i, data:structs[i], info:'逻辑结构：'+structs[i].name+' — '+structs[i].desc });
    }
    steps.push({ type:'title', t:'两种存储结构', sub:'顺序存储 vs 链式存储', info:'存储结构对比' });
    steps.push({ type:'storage_compare', phase:0, info:'顺序存储：逻辑相邻=物理相邻，随机存取' });
    steps.push({ type:'storage_compare', phase:1, info:'链式存储：通过指针链接，灵活插入删除' });
    steps.push({ type:'storage_compare', phase:2, info:'对比：顺序存储省空间但插入慢；链式存储灵活但占额外指针空间' });
    this.steps = steps;
  },

  _draw_logic_struct(ctx, W, H, s) {
    const d = s.data;
    const xOff = W*0.08, yOff = H*0.18, rW = W*0.84, rH = H*0.7;
    ctx.fillStyle = 'rgba(16,185,129,0.08)'; ctx.strokeStyle = 'rgba(16,185,129,0.3)'; ctx.lineWidth = 1;
    this._roundRect(ctx, xOff, yOff, rW, rH, 12); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 16px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center'; ctx.fillText(d.name, W*0.5, yOff+24);
    d.pts.forEach((p, i) => {
      const px = xOff + p.x * rW, py = yOff + p.y * rH + 10;
      ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = '11px sans-serif'; ctx.fillText(i+1, px, py+4);
    });
    // draw edges based on structure type
    ctx.strokeStyle = 'rgba(16,185,129,0.4)'; ctx.lineWidth = 1.5;
    if (s.idx === 3) { // tree - connect parent to children
      const edges = [[0,1],[0,2],[0,3],[1,4],[1,5],[2,6]];
      edges.forEach(([a,b]) => {
        const pa = d.pts[a], pb = d.pts[b];
        ctx.beginPath(); ctx.moveTo(xOff+pa.x*rW, yOff+pa.y*rH+10);
        ctx.lineTo(xOff+pb.x*rW, yOff+pb.y*rH+10); ctx.stroke();
      });
    } else if (s.idx === 4) { // graph - connect all
      for (let a = 0; a < d.pts.length; a++)
        for (let b = a+1; b < d.pts.length; b++) if (Math.random() > 0.3) {
          const pa = d.pts[a], pb = d.pts[b];
          ctx.beginPath(); ctx.moveTo(xOff+pa.x*rW, yOff+pa.y*rH+10);
          ctx.lineTo(xOff+pb.x*rW, yOff+pb.y*rH+10); ctx.stroke();
        }
    } else if (s.idx === 1) { // linear - chain
      for (let a = 0; a < d.pts.length-1; a++) {
        const pa = d.pts[a], pb = d.pts[a+1];
        ctx.beginPath(); ctx.moveTo(xOff+pa.x*rW, yOff+pa.y*rH+10);
        ctx.lineTo(xOff+pb.x*rW, yOff+pb.y*rH+10); ctx.stroke();
      }
    }
  },

  _draw_storage_compare(ctx, W, H, s) {
    const y0 = H*0.25;
    // Sequential storage
    const seqX = W*0.05, seqW = W*0.42;
    ctx.fillStyle = s.phase >= 0 ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)';
    ctx.strokeStyle = s.phase >= 0 ? '#3b82f6' : 'rgba(255,255,255,0.1)';
    this._roundRect(ctx, seqX, y0, seqW, H*0.6, 10); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#3b82f6'; ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center'; ctx.fillText('顺序存储', seqX+seqW/2, y0+22);
    for (let i = 0; i < 5; i++) {
      const bx = seqX + 15, by = y0 + 40 + i*36, bw = seqW - 30, bh = 28;
      ctx.fillStyle = s.phase >= 0 ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)';
      ctx.strokeStyle = s.phase >= 0 ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)';
      this._roundRect(ctx, bx, by, bw, bh, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('data['+i+']', bx+8, by+19);
    }
    // Linked storage
    const linkX = W*0.53, linkW = W*0.42;
    ctx.fillStyle = s.phase >= 1 ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)';
    ctx.strokeStyle = s.phase >= 1 ? '#8b5cf6' : 'rgba(255,255,255,0.1)';
    this._roundRect(ctx, linkX, y0, linkW, H*0.6, 10); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#8b5cf6'; ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center'; ctx.fillText('链式存储', linkX+linkW/2, y0+22);
    for (let i = 0; i < 5; i++) {
      const ly = y0 + 40 + i*36;
      const dW = 32, pW = 20, gap = 6, totalW = dW + gap + pW;
      const startX = linkX + (linkW - totalW*5 - gap*4)/2 + i*(totalW + gap);
      // data part
      ctx.fillStyle = s.phase >= 1 ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.04)';
      ctx.strokeStyle = s.phase >= 1 ? '#8b5cf6' : 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.fillRect(startX, ly, dW, 28); ctx.strokeRect(startX, ly, dW, 28);
      ctx.fillStyle = '#cbd5e1'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('d'+i, startX+dW/2, ly+19);
      // pointer part
      ctx.fillStyle = s.phase >= 1 ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.02)';
      ctx.fillRect(startX+dW+gap, ly, pW, 28); ctx.strokeRect(startX+dW+gap, ly, pW, 28);
      // arrows between nodes
      if (i < 4 && s.phase >= 1) {
        ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 1.5;
        const arrowX = startX+dW+gap+pW/2;
        ctx.beginPath(); ctx.moveTo(arrowX, ly+14);
        ctx.lineTo(arrowX, ly+36); ctx.stroke();
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath(); ctx.moveTo(arrowX-3, ly+30); ctx.lineTo(arrowX, ly+36); ctx.lineTo(arrowX+3, ly+30); ctx.fill();
      }
    }
    // comparison text
    if (s.phase === 2) {
      ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 12px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('⚡ 顺序：随机存取O(1)  |  🔗 链式：插入删除O(1)', W/2, H*0.92);
    }
  },

  /* ── 1-2 算法与算法分析 ── */
  _gen_ds_1_2() {
    const steps = [
      { type:'title', t:'算法五大特性', sub:'有穷性 · 确定性 · 可行性 · 输入 · 输出', info:'算法必备特性' },
    ];
    const props = ['有穷性','确定性','可行性','输入','输出'];
    for (let i = 0; i < props.length; i++) {
      steps.push({ type:'algo_props', idx:i, total:5, labels:props, active:i,
        info:props[i]+(i===0?' — 执行有限步后结束':i===1?' — 每一步有确切定义':i===2?' — 基本操作可实现':i===3?' — 零个或多个输入':' — 至少一个输出') });
    }
    // Big-O complexity
    steps.push({ type:'title', t:'时间复杂度增长曲线', sub:'O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)', info:'常见时间复杂度对比' });
    steps.push({ type:'bigo_chart', phase:0, info:'O(1) 常数阶 — 最理想' });
    steps.push({ type:'bigo_chart', phase:1, info:'O(log n) 对数阶 — 二分查找' });
    steps.push({ type:'bigo_chart', phase:2, info:'O(n) 线性阶 — 顺序查找' });
    steps.push({ type:'bigo_chart', phase:3, info:'O(n log n) — 快速排序/归并排序' });
    steps.push({ type:'bigo_chart', phase:4, info:'O(n²) 平方阶 — 冒泡排序/插入排序' });
    steps.push({ type:'bigo_chart', phase:5, info:'O(2ⁿ) 指数阶 — 穷举法，避免使用！' });
    // Space complexity
    steps.push({ type:'title', t:'空间复杂度', sub:'算法执行所需的存储空间', info:'空间复杂度 — 关注额外空间开销' });
    steps.push({ type:'space_info', info:'原地算法 O(1)：不需要额外空间（冒泡排序、选择排序）' });
    steps.push({ type:'space_info', info:'O(n)空间：需要辅助数组（归并排序、计数排序）' });
    this.steps = steps;
  },

  _draw_algo_props(ctx, W, H, s) {
    const cx = W/2, labels = s.labels;
    const colors = ['#ef4444','#f59e0b','#3b82f6','#8b5cf6','#10b981'];
    for (let i = 0; i < s.total; i++) {
      const angle = -Math.PI/2 + (i / s.total) * Math.PI*2;
      const r = W*0.3, ix = cx + Math.cos(angle)*r, iy = H*0.48 + Math.sin(angle)*r*0.7;
      const active = i <= s.active;
      ctx.fillStyle = active ? colors[i] : 'rgba(255,255,255,0.05)';
      ctx.strokeStyle = active ? colors[i] : 'rgba(255,255,255,0.1)';
      ctx.lineWidth = active ? 2.5 : 1;
      ctx.beginPath(); ctx.arc(ix, iy, active ? 28 : 22, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = active ? '#fff' : '#64748b';
      ctx.font = (active ? 'bold ':'') + '13px "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'center'; ctx.fillText(labels[i], ix, iy+5);
      if (i === s.active) {
        ctx.strokeStyle = colors[i]; ctx.lineWidth = 2; ctx.setLineDash([5,5]);
        ctx.beginPath(); ctx.moveTo(cx, H*0.48); ctx.lineTo(ix, iy); ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  },

  _draw_bigo_chart(ctx, W, H, s) {
    const curves = [
      { name:'O(1)', fn: (x,n) => 0.12, color:'#10b981', visible: s.phase>=0 },
      { name:'O(log n)', fn: (x,n) => 0.12 + Math.log2(x+1)*0.08, color:'#3b82f6', visible: s.phase>=1 },
      { name:'O(n)', fn: (x,n) => x/n*0.65, color:'#f59e0b', visible: s.phase>=2 },
      { name:'O(n log n)', fn: (x,n) => x/n*Math.log2(x+1)*0.13, color:'#8b5cf6', visible: s.phase>=3 },
      { name:'O(n²)', fn: (x,n) => (x/n)*(x/n)*0.7, color:'#ef4444', visible: s.phase>=4 },
      { name:'O(2ⁿ)', fn: (x,n) => Math.pow(2,x/n*6)/64*0.7, color:'#ec4899', visible: s.phase>=5 },
    ];
    const cx = W*0.1, cy = H*0.82, cw = W*0.8, ch = H*0.6;
    const n = 16;
    // axes
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx+cw, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy-ch); ctx.stroke();
    // labels
    ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('n (问题规模)', cx+cw/2, cy+18);
    ctx.save(); ctx.translate(cx-28, cy-ch/2); ctx.rotate(-Math.PI/2);
    ctx.fillText('时间 →', 0, 0); ctx.restore();
    // grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 0.5;
    for (let i = 1; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(cx, cy-ch*i/4); ctx.lineTo(cx+cw, cy-ch*i/4); ctx.stroke(); }
    // curves
    curves.forEach(c => {
      if (!c.visible) return;
      ctx.strokeStyle = c.color; ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x <= n; x++) {
        const px = cx + x/n*cw, py = cy - Math.min(c.fn(x,n), 0.75)*ch;
        if (x === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      // label at end
      const lx = cx + cw + 5, ly = cy - Math.min(c.fn(n,n), 0.75)*ch;
      ctx.fillStyle = c.color; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(c.name, lx, ly+4);
    });
  },

  _draw_space_info(ctx, W, H, s) {
    ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 16px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center'; ctx.fillText('💾 空间复杂度', W/2, H*0.3);
    ctx.fillStyle = '#e2e8f0'; ctx.font = '14px "Microsoft YaHei", sans-serif';
    ctx.fillText(s.info, W/2, H*0.55);
  },

  /* ══════════════════════════════════════════════════════
     Ch2 线性表
     ══════════════════════════════════════════════════════ */

  /* ── 2-0 线性表的顺序存储 ── */
  _gen_ds_2_0() {
    let arr = [12, 25, 8, 33, 19, 42, 7, 56];
    let len = 8, maxLen = 10;
    const steps = [
      { type:'title', t:'顺序表操作演示', sub:'插入/删除/查找', info:'顺序表 — 线性表的顺序存储结构' },
      { type:'seq_list', arr:[...arr], len, hl:[], info:'初始顺序表：['+arr.join(', ')+']，长度='+len },
    ];
    // Insert 99 at index 3
    let narr = [...arr]; narr.splice(3, 0, 99);
    steps.push({ type:'seq_list', arr:[...arr], len, hl:[3], action:'insert', val:99, pos:3,
      info:'在位置3插入99：需要将位置3~7的元素后移一位（从后往前移）' });
    for (let i = len-1; i >= 3; i--) {
      let tarr = [...arr]; tarr.splice(3,0,99);
      let shiftArr = [...arr]; shiftArr.length = maxLen;
      shiftArr[i+1] = shiftArr[i];
      steps.push({ type:'seq_shift', arr:[...arr], targetArr:tarr, shiftIdx:i, insertPos:3,
        info:'后移元素['+i+']='+arr[i]+' 到位置'+(i+1) });
      arr[i+1] = arr[i];
    }
    arr[3] = 99; len++;
    steps.push({ type:'seq_list', arr:[...arr], len, hl:[3], action:'done', val:99,
      info:'插入完成！新顺序表：['+arr.slice(0,len).join(', ')+']，长度='+len });
    // Delete at index 2 (value 8)
    const delVal = arr[2];
    steps.push({ type:'seq_list', arr:[...arr], len, hl:[2], action:'delete', val:delVal,
      info:'删除位置2的元素' + delVal + '：前移后续元素' });
    for (let i = 2; i < len-1; i++) {
      arr[i] = arr[i+1];
      let tarr = [...arr]; tarr[len-1] = undefined;
      steps.push({ type:'seq_shift', arr:[...arr], shiftIdx:i, delMode:true,
        info:'前移元素['+(i+1)+']='+arr[i]+' 到位置'+i });
    }
    len--;
    let finalArr = arr.slice(0, len);
    steps.push({ type:'seq_list', arr:finalArr, len, hl:[], action:'done',
      info:'删除完成！最终顺序表：['+finalArr.join(', ')+']，长度='+len });
    this.steps = steps;
  },

  _draw_seq_list(ctx, W, H, s) {
    const x0 = W*0.06, y0 = H*0.28, cellW = (W*0.88) / 10, cellH = 38, gap = 3;
    // index row
    ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    for (let i = 0; i < 10; i++) ctx.fillText(i, x0+i*(cellW+gap)+cellW/2, y0-8);
    // cells
    for (let i = 0; i < 10; i++) {
      const x = x0 + i*(cellW+gap);
      const inArr = i < s.len && s.arr[i] !== undefined;
      const hl = s.hl && s.hl.includes(i);
      const isInserted = s.action === 'done' && hl && i === s.hl[0];
      ctx.fillStyle = hl ? (isInserted ? '#10b981' : '#f59e0b') : (inArr ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.03)');
      ctx.strokeStyle = hl ? (isInserted ? '#10b981' : '#f59e0b') : (inArr ? '#3b82f6' : 'rgba(255,255,255,0.08)');
      ctx.lineWidth = hl ? 2 : 1;
      this._roundRect(ctx, x, y0, cellW, cellH, 4); ctx.fill(); ctx.stroke();
      if (inArr) {
        ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(s.arr[i], x+cellW/2, y0+cellH/2+5);
      }
    }
    // action label
    if (s.action) {
      ctx.fillStyle = '#94a3b8'; ctx.font = '12px "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'center';
      const txt = s.action === 'insert' ? '⬅ 在此插入 ' + s.val :
        s.action === 'delete' ? '➡ 删除此元素 ' + s.val : '✅ 操作完成';
      ctx.fillText(txt, W/2, y0+cellH*2+16);
    }
    // length indicator
    ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('length='+s.len, x0, y0+cellH*3-2);
  },

  _draw_seq_shift(ctx, W, H, s) {
    const x0 = W*0.06, cellW = (W*0.88) / 10, cellH = 38, gap = 3;
    const y0 = H*0.28;
    for (let i = 0; i < 10; i++) {
      const x = x0 + i*(cellW+gap);
      const isSrc = i === s.shiftIdx;
      const isDst = s.delMode ? (i === s.shiftIdx) : (i === s.shiftIdx + 1);
      const hasVal = s.arr[i] !== undefined;
      ctx.fillStyle = isSrc ? '#ef4444' : (isDst ? '#10b981' : (hasVal ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.03)'));
      ctx.strokeStyle = isSrc ? '#ef4444' : (isDst ? '#10b981' : 'rgba(255,255,255,0.08)');
      ctx.lineWidth = (isSrc || isDst) ? 2.5 : 1;
      this._roundRect(ctx, x, y0, cellW, cellH, 4); ctx.fill(); ctx.stroke();
      if (hasVal) {
        ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(s.arr[i], x+cellW/2, y0+cellH/2+5);
      }
    }
    // arrow
    const fromX = x0 + s.shiftIdx*(cellW+gap) + cellW/2;
    const toX = s.delMode ? fromX : fromX + cellW + gap;
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(fromX, y0-cellH*0.5);
    ctx.quadraticCurveTo((fromX+toX)/2, y0-cellH, toX, y0-cellH*0.5);
    ctx.stroke();
    ctx.fillStyle = '#f59e0b'; ctx.beginPath();
    ctx.moveTo(toX-6, y0-cellH*0.5-4); ctx.lineTo(toX, y0-cellH*0.5); ctx.lineTo(toX-6, y0-cellH*0.5+4); ctx.fill();
    ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(s.delMode ? '◀ 前移' : '后移 ▶', (fromX+toX)/2, y0-cellH*0.75);
  },

  /* ── 2-1 线性表的链式存储 ── */
  _gen_ds_2_1() {
    const nodes = [
      { val:12, x:0.08, y:0.35 }, { val:25, x:0.28, y:0.35 },
      { val:8, x:0.48, y:0.35 }, { val:33, x:0.68, y:0.35 },
      { val:19, x:0.85, y:0.35 },
    ];
    const steps = [
      { type:'title', t:'单链表结构与操作', sub:'头指针 · 结点 · 指针域', info:'单链表 — 线性表的链式存储结构' },
      { type:'linked_list', nodes, headIdx:0, info:'初始单链表：Head → 12 → 25 → 8 → 33 → 19 → NULL' },
      // Insert 99 after 25 (between index 1 and 2)
      { type:'linked_insert_prep', nodes, insPos:1, val:99,
        info:'在25之后插入99：先找到位置，修改指针' },
      { type:'linked_insert', nodes, insPos:1, val:99,
        info:'① 新结点99的next指向25的next(8)；② 25的next指向99' },
      { type:'linked_result', nodes, insPos:1, val:99,
        info:'插入完成！Head → 12 → 25 → 99 → 8 → 33 → 19 → NULL' },
      // Delete node with value 8 (will be at index 3 after insert)
      { type:'linked_delete', nodes, delIdx:3,
        info:'删除结点8：将其前驱(99)的next指向其后继(33)' },
      { type:'linked_delete_done', nodes, delIdx:3,
        info:'删除完成！释放8的内存，Head → 12 → 25 → 99 → 33 → 19 → NULL' },
    ];
    this.steps = steps;
  },

  _draw_linked_list(ctx, W, H, s) {
    const y0 = H*0.45;
    // draw nodes
    const renderNodes = (ns, hlIdx) => {
      ns.forEach((n, i) => {
        const x = n.x*W*0.85 + W*0.05, y = y0;
        const isHL = i === hlIdx;
        // data box
        ctx.fillStyle = isHL ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.25)';
        ctx.strokeStyle = isHL ? '#ef4444' : '#3b82f6';
        ctx.lineWidth = 2;
        ctx.fillRect(x, y, 38, 30); ctx.strokeRect(x, y, 38, 30);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(n.val, x+19, y+21);
        // pointer box
        ctx.fillStyle = 'rgba(139,92,246,0.2)';
        ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 1.5;
        ctx.fillRect(x+38, y, 22, 30); ctx.strokeRect(x+38, y, 22, 30);
        // arrow to next
        if (i < ns.length - 1) {
          const nextX = ns[i+1].x*W*0.85 + W*0.05;
          ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(x+60, y+15); ctx.lineTo(nextX, y+15); ctx.stroke();
          ctx.fillStyle = '#8b5cf6';
          ctx.beginPath(); ctx.moveTo(nextX-5, y+10); ctx.lineTo(nextX, y+15); ctx.lineTo(nextX-5, y+20); ctx.fill();
        }
      });
    };
    renderNodes(s.nodes, s.headIdx);
    // Head label
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('Head →', W*0.04, y0+20);
  },

  _draw_linked_insert_prep(ctx, W, H, s) {
    this._draw_linked_list(ctx, W, H, { nodes: s.nodes, headIdx: s.insPos });
    // show new node floating
    const x = s.nodes[s.insPos].x*W*0.85 + W*0.05 + 80;
    ctx.fillStyle = 'rgba(16,185,129,0.3)'; ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2;
    ctx.fillRect(x, H*0.25, 38, 30); ctx.strokeRect(x, H*0.25, 38, 30);
    ctx.fillRect(x+38, H*0.25, 22, 30); ctx.strokeRect(x+38, H*0.25, 22, 30);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(s.val, x+19, H*0.25+21);
    ctx.fillStyle = '#10b981'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('新结点: '+s.val, x+30, H*0.25-10);
  },

  _draw_linked_insert(ctx, W, H, s) {
    const y0 = H*0.45;
    s.nodes.forEach((n, i) => {
      const x = n.x*W*0.85 + W*0.05, y = y0;
      const isHL = i === s.insPos;
      ctx.fillStyle = isHL ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.25)';
      ctx.strokeStyle = isHL ? '#10b981' : '#3b82f6'; ctx.lineWidth = 2;
      ctx.fillRect(x, y, 38, 30); ctx.strokeRect(x, y, 38, 30);
      ctx.fillRect(x+38, y, 22, 30); ctx.strokeRect(x+38, y, 22, 30);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(n.val, x+19, y+21);
    });
    // new node at top
    const nx = W*0.48 + 80, ny = H*0.2;
    ctx.fillStyle = 'rgba(16,185,129,0.3)'; ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2;
    ctx.fillRect(nx, ny, 38, 30); ctx.strokeRect(nx, ny, 38, 30);
    ctx.fillRect(nx+38, ny, 22, 30); ctx.strokeRect(nx+38, ny, 22, 30);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(s.val, nx+19, ny+21);
    // curved arrows
    const fromX = s.nodes[s.insPos].x*W*0.85+W*0.05+60, fromY = y0+15;
    ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(fromX, fromY);
    ctx.quadraticCurveTo(fromX, ny-10, nx, ny+15); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(nx+60, ny+15);
    ctx.quadraticCurveTo(fromX+40, y0-5, s.nodes[s.insPos+1]&&s.nodes[s.insPos+1].x*W*0.85+W*0.05, y0+15);
    ctx.stroke();
  },

  _draw_linked_result(ctx, W, H, s) {
    const newNodes = [...s.nodes.slice(0, s.insPos+1), {val:s.val,x:0,y:0}, ...s.nodes.slice(s.insPos+1)];
    newNodes.forEach((n, i) => { n.x = (0.08 + i*0.15); });
    if (newNodes.length > 5) newNodes.forEach((n,i) => { n.x = 0.05 + i*(0.85/(newNodes.length-1)); });
    this._draw_linked_list(ctx, W, H, { nodes: newNodes, headIdx: s.insPos+1 });
  },

  _draw_linked_delete(ctx, W, H, s) {
    const y0 = H*0.45;
    s.nodes.forEach((n, i) => {
      const x = n.x*W*0.85 + W*0.05, y = y0;
      const isHL = i === s.delIdx, isPrev = i === s.delIdx-1;
      ctx.fillStyle = isHL ? 'rgba(239,68,68,0.3)' : (isPrev ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.25)');
      ctx.strokeStyle = isHL ? '#ef4444' : (isPrev ? '#10b981' : '#3b82f6'); ctx.lineWidth = 2;
      ctx.fillRect(x, y, 38, 30); ctx.strokeRect(x, y, 38, 30);
      ctx.fillRect(x+38, y, 22, 30); ctx.strokeRect(x+38, y, 22, 30);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(n.val, x+19, y+21);
      if (i < s.nodes.length-1 && i !== s.delIdx-1) {
        const nextX = s.nodes[i+1].x*W*0.85+W*0.05;
        ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(x+60, y+15); ctx.lineTo(nextX, y+15); ctx.stroke();
      }
    });
    // show new pointer from prev to successor (bypass deleted node)
    if (s.delIdx > 0 && s.delIdx < s.nodes.length-1) {
      const prevX = s.nodes[s.delIdx-1].x*W*0.85+W*0.05+60;
      const succX = s.nodes[s.delIdx+1].x*W*0.85+W*0.05;
      ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2; ctx.setLineDash([4,3]);
      ctx.beginPath(); ctx.moveTo(prevX, y0+15);
      ctx.quadraticCurveTo((prevX+succX)/2, y0-25, succX, y0+15); ctx.stroke();
      ctx.setLineDash([]);
    }
  },

  _draw_linked_delete_done(ctx, W, H, s) {
    const remain = s.nodes.filter((_,i) => i !== s.delIdx);
    remain.forEach((n,i) => { n.x = 0.08 + i*(0.78/(remain.length-1)); });
    this._draw_linked_list(ctx, W, H, { nodes: remain, headIdx: -1 });
  },

  /* ── 2-2 循环链表与双向链表 ── */
  _gen_ds_2_2() {
    const steps = [
      { type:'title', t:'循环单链表', sub:'尾结点指向头结点 · 判空条件 head->next==head', info:'循环单链表 — 从任意结点出发可访问全表' },
    ];
    // Circular list
    const cNodes = [{val:12},{val:25},{val:8},{val:33}];
    cNodes.forEach((n,i) => { n.x = 0.1 + i*0.22; n.y = 0.4; });
    steps.push({ type:'circ_list', nodes:cNodes, info:'循环单链表：尾(33)→头(12)，形成闭环' });
    // Doubly linked list
    steps.push({ type:'title', t:'双向链表', sub:'每个结点有 prior 和 next 两个指针', info:'双向链表 — 可双向遍历' });
    const dNodes = [{val:12},{val:25},{val:8}];
    dNodes.forEach((n,i) => { n.x = 0.12 + i*0.32; n.y = 0.45; });
    steps.push({ type:'dbl_list', nodes:dNodes, info:'双向链表：每个结点同时指向前驱和后继' });
    // Doubly insert
    steps.push({ type:'dbl_insert', nodes:dNodes, pos:1, val:99,
      info:'在25之前插入99：需修改4个指针（99的prior/next + 前驱的next + 后继的prior）' });
    this.steps = steps;
  },

  _draw_circ_list(ctx, W, H, s) {
    const y0 = H*0.45, r = 120, cx = W/2, cy = y0;
    s.nodes.forEach((n, i) => {
      const a = -Math.PI/2 + i*(Math.PI*2/s.nodes.length);
      const nx = cx + Math.cos(a)*r, ny = cy + Math.sin(a)*r;
      ctx.fillStyle = 'rgba(59,130,246,0.25)'; ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
      this._roundRect(ctx, nx-20, ny-15, 40, 30, 6); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(n.val, nx, ny+5);
    });
    // ring arrows
    ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI/2, Math.PI*1.5); ctx.stroke();
    // arrow head
    const arrowA = -Math.PI/2 + Math.PI*2*0.95;
    const ax = cx + Math.cos(arrowA)*r, ay = cy + Math.sin(arrowA)*r;
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath(); ctx.moveTo(ax+5, ay+8); ctx.lineTo(ax, ay); ctx.lineTo(ax-5, ay+8); ctx.fill();
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('🔁 循环', cx, cy-r-20);
  },

  _draw_dbl_list(ctx, W, H, s) {
    const y0 = H*0.45;
    s.nodes.forEach((n, i) => {
      const x = n.x*W*0.85 + W*0.05, y = y0;
      // prior box
      ctx.fillStyle = 'rgba(239,68,68,0.2)'; ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.5;
      ctx.fillRect(x, y, 20, 30); ctx.strokeRect(x, y, 20, 30);
      // data box
      ctx.fillStyle = 'rgba(59,130,246,0.25)'; ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
      ctx.fillRect(x+20, y, 34, 30); ctx.strokeRect(x+20, y, 34, 30);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(n.val, x+37, y+21);
      // next box
      ctx.fillStyle = 'rgba(16,185,129,0.2)'; ctx.strokeStyle = '#10b981'; ctx.lineWidth = 1.5;
      ctx.fillRect(x+54, y, 20, 30); ctx.strokeRect(x+54, y, 20, 30);
      // arrows
      if (i > 0) {
        const prevX = s.nodes[i-1].x*W*0.85+W*0.05+64;
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(prevX, y+8); ctx.lineTo(x, y+8); ctx.stroke();
      }
      if (i < s.nodes.length-1) {
        ctx.strokeStyle = '#10b981'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(x+74, y+22); ctx.lineTo(s.nodes[i+1].x*W*0.85+W*0.05, y+22); ctx.stroke();
      }
    });
    ctx.fillStyle = '#94a3b8'; ctx.font = '10px sans-serif';
    ctx.fillText('←prior', W*0.08, y0-5);
    ctx.fillText('next→', W*0.82, y0-5);
  },

  _draw_dbl_insert(ctx, W, H, s) {
    const y0 = H*0.45;
    // redraw with highlight
    s.nodes.forEach((n, i) => {
      const x = n.x*W*0.85 + W*0.05, y = y0;
      const isHL = i === s.pos || i === s.pos-1;
      ctx.fillStyle = 'rgba(239,68,68,0.2)'; ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.5;
      ctx.fillRect(x, y, 20, 30); ctx.strokeRect(x, y, 20, 30);
      ctx.fillStyle = isHL ? 'rgba(16,185,129,0.35)' : 'rgba(59,130,246,0.25)';
      ctx.strokeStyle = isHL ? '#10b981' : '#3b82f6'; ctx.lineWidth = 2;
      ctx.fillRect(x+20, y, 34, 30); ctx.strokeRect(x+20, y, 34, 30);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(n.val, x+37, y+21);
      ctx.fillStyle = 'rgba(16,185,129,0.2)'; ctx.strokeStyle = '#10b981'; ctx.lineWidth = 1.5;
      ctx.fillRect(x+54, y, 20, 30); ctx.strokeRect(x+54, y, 20, 30);
    });
    // new node
    const nx = W*0.38, ny = H*0.2;
    ctx.fillStyle = 'rgba(239,68,68,0.2)'; ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.5;
    ctx.fillRect(nx, ny, 20, 30); ctx.strokeRect(nx, ny, 20, 30);
    ctx.fillStyle = 'rgba(16,185,129,0.4)'; ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2.5;
    ctx.fillRect(nx+20, ny, 34, 30); ctx.strokeRect(nx+20, ny, 34, 30);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(s.val, nx+37, ny+21);
    ctx.fillStyle = 'rgba(16,185,129,0.2)'; ctx.strokeStyle = '#10b981';
    ctx.fillRect(nx+54, ny, 20, 30); ctx.strokeRect(nx+54, ny, 20, 30);
    ctx.fillStyle = '#f59e0b'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('修改4个指针', W/2, ny-8);
  },

  /* ── 2-3 线性表的应用 ── */
  _gen_ds_2_3() {
    const steps = [
      { type:'title', t:'约瑟夫环问题', sub:'n个人围坐一圈，每数到m的人出列', info:'约瑟夫环 — 循环链表经典应用' },
    ];
    // Show Josephus circle n=8, m=3
    const names = ['1','2','3','4','5','6','7','8'];
    for (let i = 0; i < names.length; i++) {
      const out = i%3 === 0;
      steps.push({ type:'josephus', n:8, m:3, current:i, outList: i<3?['3','6','1'].slice(0,i):['3','6','1'],
        info: '数到3：'+(out?'出列'+names[i]:'安全 ✓') });
    }
    steps.push({ type:'josephus_done', outList:['3','6','1','5','2','8','4','7'],
      info:'出列顺序：3→6→1→5→2→8→4→7（最后剩下7）' });
    // Polynomial addition
    steps.push({ type:'title', t:'多项式相加', sub:'用链表表示稀疏多项式', info:'多项式相加 — 链表合并算法' });
    const polyA = [{coef:3,exp:4},{coef:-2,exp:2},{coef:5,exp:0}];
    const polyB = [{coef:2,exp:3},{coef:4,exp:2},{coef:-1,exp:1}];
    steps.push({ type:'poly_add', polyA, polyB, idx:-1,
      info:'A: 3x⁴ - 2x² + 5    B: 2x³ + 4x² - x' });
    steps.push({ type:'poly_add', polyA, polyB, idx:0,
      info:'比较指数：4 > 3 → 保留 3x⁴' });
    steps.push({ type:'poly_add', polyA, polyB, idx:1,
      info:'比较指数：3 > 2 → 保留 2x³（来自B）' });
    steps.push({ type:'poly_add', polyA, polyB, idx:2,
      info:'指数相等：2=2 → -2x² + 4x² = 2x²' });
    const result = [{coef:3,exp:4},{coef:2,exp:3},{coef:2,exp:2},{coef:-1,exp:1},{coef:5,exp:0}];
    steps.push({ type:'poly_result', result,
      info:'结果：3x⁴ + 2x³ + 2x² - x + 5' });
    this.steps = steps;
  },

  _draw_josephus(ctx, W, H, s) {
    const cx = W/2, cy = H*0.42, r = Math.min(W,H)*0.3;
    for (let i = 0; i < s.n; i++) {
      const a = -Math.PI/2 + i*(Math.PI*2/s.n);
      const nx = cx + Math.cos(a)*r, ny = cy + Math.sin(a)*r;
      const isOut = s.outList.includes(String(i+1));
      ctx.fillStyle = isOut ? 'rgba(239,68,68,0.3)' : (i===s.current?'rgba(16,185,129,0.3)':'rgba(59,130,246,0.25)');
      ctx.strokeStyle = isOut ? '#ef4444' : (i===s.current?'#10b981':'#3b82f6');
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(nx, ny, 18, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(i+1, nx, ny+5);
      if (isOut) { ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(nx-8, ny-8); ctx.lineTo(nx+8, ny+8); ctx.moveTo(nx+8, ny-8); ctx.lineTo(nx-8, ny+8); ctx.stroke(); }
    }
    ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI/2, Math.PI*1.5); ctx.stroke();
    ctx.fillStyle = '#e2e8f0'; ctx.font = '13px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('n='+s.n+'  m='+s.m+'  每数到'+s.m+'出列', cx, cy-r-15);
  },

  _draw_josephus_done(ctx, W, H, s) {
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 16px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('出列顺序', W/2, H*0.25);
    const seq = s.outList.join(' → ');
    ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 18px sans-serif';
    ctx.fillText(seq, W/2, H*0.45);
    ctx.fillStyle = '#f59e0b'; ctx.font = '14px sans-serif';
    ctx.fillText('最后幸存者：' + s.outList[s.outList.length-1], W/2, H*0.6);
  },

  _draw_poly_add(ctx, W, H, s) {
    const cx = W/2;
    const renderPoly = (poly, y, label, color) => {
      ctx.fillStyle = color; ctx.font = 'bold 13px "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'left'; ctx.fillText(label, W*0.08, y);
      let x = W*0.08;
      poly.forEach((t,i) => {
        const txt = (i>0 && t.coef>0?' + ':'') + (t.coef<0?' - ':'') + (t.coef===1&&t.exp>0?'':Math.abs(t.coef)) + (t.exp>0?'x':'') + (t.exp>1?'<sup>'+t.exp+'</sup>':'');
        // simple rendering without sup
        const plain = (i>0 && t.coef>0?'+':'') + (t.coef<0?'-':'') + Math.abs(t.coef) + (t.exp>0?'x^'+t.exp:'');
        ctx.fillStyle = color; ctx.font = '13px sans-serif';
        ctx.fillText(plain, x, y);
        x += ctx.measureText(plain).width + 2;
      });
    };
    renderPoly(s.polyA, H*0.3, 'A:', '#3b82f6');
    renderPoly(s.polyB, H*0.42, 'B:', '#10b981');
    if (s.idx >= 0) {
      ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('逐项比较合并中...', cx, H*0.6);
    }
  },

  _draw_poly_result(ctx, W, H, s) {
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 16px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center'; ctx.fillText('✅ 合并结果', W/2, H*0.3);
    const text = s.result.map((t,i) => (i>0&&t.coef>0?'+':'')+(t.coef<0?'-':'')+Math.abs(t.coef)+(t.exp>0?'x^'+t.exp:'')).join('');
    ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 20px sans-serif';
    ctx.fillText(text, W/2, H*0.5);
  },

  /* ══════════════════════════════════════════════════════
     Ch3 栈和队列
     ══════════════════════════════════════════════════════ */

  /* ── 3-0 栈的定义与操作 ── */
  _gen_ds_3_0() {
    const stack = [];
    const steps = [
      { type:'title', t:'栈（Stack）', sub:'后进先出 LIFO · 只能在栈顶操作', info:'栈 — 限定仅在表尾进行插入和删除的线性表' },
    ];
    const ops = [
      { action:'push', val:10, info:'Push(10) — 10入栈，成为栈顶' },
      { action:'push', val:25, info:'Push(25) — 25入栈，成为新栈顶' },
      { action:'push', val:8, info:'Push(8) — 8入栈' },
      { action:'push', val:33, info:'Push(33) — 33入栈' },
      { action:'pop', val:33, info:'Pop() → 33 — 栈顶元素出栈' },
      { action:'pop', val:8, info:'Pop() → 8 — 新栈顶8出栈' },
      { action:'push', val:42, info:'Push(42) — 42入栈' },
      { action:'pop', val:42, info:'Pop() → 42 — 出栈' },
    ];
    let sArr = [];
    ops.forEach(op => {
      if (op.action === 'push') {
        sArr.push(op.val);
      } else {
        sArr.pop();
      }
      steps.push({ type:'stack_op', stack:[...sArr], top:sArr.length-1,
        action:op.action, val:op.val, info:op.info });
    });
    this.steps = steps;
  },

  _draw_stack_op(ctx, W, H, s) {
    const x0 = W*0.35, y0 = H*0.75, cellW = 70, cellH = 32;
    // stack container
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x0, y0-10); ctx.lineTo(x0, y0-10-s.stack.length*cellH);
    ctx.lineTo(x0+cellW, y0-10-s.stack.length*cellH); ctx.lineTo(x0+cellW, y0-10);
    ctx.stroke();
    // bottom label
    ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('栈底', x0+cellW/2, y0+4);
    // stack elements (bottom up)
    s.stack.forEach((v, i) => {
      const y = y0 - (i+1)*cellH;
      const isTop = i === s.stack.length - 1;
      ctx.fillStyle = isTop ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.25)';
      ctx.strokeStyle = isTop ? '#10b981' : '#3b82f6'; ctx.lineWidth = 2;
      ctx.fillRect(x0, y, cellW, cellH); ctx.strokeRect(x0, y, cellW, cellH);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(v, x0+cellW/2, y+cellH/2+5);
      if (isTop) { ctx.fillStyle = '#10b981'; ctx.font = '10px sans-serif'; ctx.fillText('← top', x0+cellW+5, y+cellH/2+4); }
    });
    // operation label
    ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 16px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'left';
    const opText = s.action === 'push' ? '⬇ Push(' + s.val + ')' : '⬆ Pop() → ' + s.val;
    ctx.fillText(opText, W*0.08, H*0.15);
  },

  /* ── 3-1 栈的应用 ── */
  _gen_ds_3_1() {
    const steps = [
      { type:'title', t:'表达式求值', sub:'中缀转后缀（逆波兰）· 运算符优先级栈', info:'表达式求值 — 栈的经典应用' },
    ];
    // Show infix: 3+5*2-8/4 → postfix: 3 5 2 * + 8 4 / -
    const exp = '3+5*2-8/4';
    const postfix = '3 5 2 * + 8 4 / -';
    steps.push({ type:'expr_eval', expr:exp, postfix:'', step:0, info:'中缀表达式：3+5*2-8/4' });
    steps.push({ type:'expr_eval', expr:exp, postfix:'3', step:1, info:'输出3；运算符栈空' });
    steps.push({ type:'expr_eval', expr:exp, postfix:'3', step:2, info:'+ 入栈' });
    steps.push({ type:'expr_eval', expr:exp, postfix:'3 5', step:3, info:'输出5' });
    steps.push({ type:'expr_eval', expr:exp, postfix:'3 5', step:4, info:'* 优先级 > 栈顶+，* 入栈' });
    steps.push({ type:'expr_eval', expr:exp, postfix:'3 5 2', step:5, info:'输出2' });
    steps.push({ type:'expr_eval', expr:exp, postfix:'3 5 2 *', step:6, info:'- 优先级 < 栈顶*，* 出栈输出' });
    steps.push({ type:'expr_eval', expr:exp, postfix:'3 5 2 * +', step:7, info:'- 优先级 = 栈顶+，+ 出栈；- 入栈' });
    steps.push({ type:'expr_eval', expr:exp, postfix:'3 5 2 * + 8', step:8, info:'输出8' });
    steps.push({ type:'expr_eval', expr:exp, postfix:'3 5 2 * + 8 4', step:9, info:'输出4' });
    steps.push({ type:'expr_eval', expr:exp, postfix:'3 5 2 * + 8 4 / -', step:10, info:'扫描完，栈中剩余运算符依次出栈' });
    // Bracket matching
    steps.push({ type:'title', t:'括号匹配', sub:'左括号入栈 · 右括号匹配栈顶', info:'括号匹配 — 栈的另一个经典应用' });
    const brackets = '{([])}';
    steps.push({ type:'bracket_match', str:brackets, pos:-1, stack:[], info:'待匹配：{([])}' });
    for (let i = 0; i < brackets.length; i++) {
      const ch = brackets[i];
      const isOpen = ch==='{' || ch==='(' || ch==='[';
      if (isOpen) {
        steps.push({ type:'bracket_match', str:brackets, pos:i, stack:[...steps[steps.length-1].stack,ch],
          info:ch+' 入栈（左括号）' });
      } else {
        const newStack = [...steps[steps.length-1].stack]; newStack.pop();
        steps.push({ type:'bracket_match', str:brackets, pos:i, stack:newStack,
          info:ch+' 匹配栈顶 '+steps[steps.length-1].stack[steps[steps.length-1].stack.length-1]+' → 出栈' });
      }
    }
    steps[steps.length-1].info = '✅ 匹配成功！栈为空';
    this.steps = steps;
  },

  _draw_expr_eval(ctx, W, H, s) {
    ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('中缀: ' + s.expr, W/2, H*0.2);
    ctx.fillStyle = '#10b981';
    ctx.fillText('后缀: ' + s.postfix, W/2, H*0.35);
    // operator stack visualization
    const ops = s.postfix.includes('*') && s.step >= 6 ? (s.step >= 8 ? ['-'] : ['+']) : (s.step >= 4 ? ['+','*'] : (s.step >= 2 ? ['+'] : []));
    const stackY = H*0.5;
    ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 2;
    ctx.strokeRect(W*0.35, stackY, 60, Math.max(30, ops.length*32));
    ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('运算符栈', W*0.35+30, stackY+ops.length*32+15);
    ops.forEach((op, i) => {
      ctx.fillStyle = 'rgba(139,92,246,0.3)'; ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 1.5;
      ctx.fillRect(W*0.35, stackY+ops.length*32-(i+1)*32, 60, 28); ctx.strokeRect(W*0.35, stackY+ops.length*32-(i+1)*32, 60, 28);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(op, W*0.35+30, stackY+ops.length*32-(i+1)*32+19);
    });
  },

  _draw_bracket_match(ctx, W, H, s) {
    const y0 = H*0.3, cx = W/2;
    // input string
    s.str.split('').forEach((ch, i) => {
      const x = cx - s.str.length*14 + i*28;
      const isHL = i === s.pos;
      ctx.fillStyle = isHL ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.15)';
      ctx.strokeStyle = isHL ? '#10b981' : 'rgba(59,130,246,0.5)'; ctx.lineWidth = isHL ? 2.5 : 1;
      ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
      this._roundRect(ctx, x-12, y0, 24, 32, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.fillText(ch, x, y0+22);
    });
    // stack
    const sx = W*0.35, sy = H*0.55;
    ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 2;
    ctx.strokeRect(sx, sy, 60, Math.max(30, s.stack.length*30));
    ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('栈', sx+30, sy+s.stack.length*30+15);
    s.stack.forEach((ch, i) => {
      ctx.fillStyle = 'rgba(139,92,246,0.3)'; ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 1.5;
      ctx.fillRect(sx, sy+s.stack.length*30-(i+1)*30, 60, 26); ctx.strokeRect(sx, sy+s.stack.length*30-(i+1)*30, 60, 26);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(ch, sx+30, sy+s.stack.length*30-(i+1)*30+18);
    });
  },

  /* ── 3-2 队列的定义与操作 ── */
  _gen_ds_3_2() {
    let queue = [];
    const steps = [
      { type:'title', t:'队列（Queue）', sub:'先进先出 FIFO · 队尾入队 · 队头出队', info:'队列 — 限定在表尾插入、表头删除的线性表' },
    ];
    const ops = [
      { action:'enq', val:10, info:'EnQueue(10) — 10入队（队尾）' },
      { action:'enq', val:25, info:'EnQueue(25) — 25入队' },
      { action:'enq', val:8, info:'EnQueue(8) — 8入队' },
      { action:'deq', val:10, info:'DeQueue() → 10 — 队头元素出队' },
      { action:'enq', val:33, info:'EnQueue(33) — 33入队' },
      { action:'deq', val:25, info:'DeQueue() → 25 — 队头出队' },
    ];
    let qArr = [];
    ops.forEach(op => {
      if (op.action === 'enq') qArr.push(op.val);
      else qArr.shift();
      steps.push({ type:'queue_op', queue:[...qArr], front:0, rear:qArr.length,
        action:op.action, val:op.val, info:op.info });
    });
    // Circular queue
    steps.push({ type:'title', t:'循环队列', sub:'解决假溢出 · 判满：(rear+1)%MAXSIZE==front', info:'循环队列 — 充分利用数组空间' });
    // Show circular queue state
    steps.push({ type:'circ_queue', arr:[10,25,8,33], front:1, rear:4, maxSize:6,
      info:'循环队列：[ , 25, 8, 33,  ,  ]  front=1  rear=4' });
    this.steps = steps;
  },

  _draw_queue_op(ctx, W, H, s) {
    const x0 = W*0.08, y0 = H*0.35, cellW = 48, cellH = 34, maxQ = 8;
    for (let i = 0; i < maxQ; i++) {
      const x = x0 + i*(cellW+4);
      const hasVal = i < s.queue.length;
      const isHL = (s.action === 'enq' && i === s.queue.length-1) || (s.action === 'deq' && i === 0 && s.queue.length > 0);
      ctx.fillStyle = isHL ? 'rgba(16,185,129,0.4)' : (hasVal ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.03)');
      ctx.strokeStyle = isHL ? '#10b981' : (hasVal ? '#3b82f6' : 'rgba(255,255,255,0.08)');
      ctx.lineWidth = isHL ? 2.5 : 1;
      this._roundRect(ctx, x, y0, cellW, cellH, 5); ctx.fill(); ctx.stroke();
      if (hasVal) {
        ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(s.queue[i], x+cellW/2, y0+cellH/2+5);
      }
    }
    // pointer arrows
    if (s.queue.length > 0) {
      ctx.fillStyle = '#10b981'; ctx.font = 'bold 10px sans-serif';
      ctx.fillText('← front', x0, y0-8);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('← rear', x0 + (s.queue.length-0.5)*(cellW+4), y0-8);
    }
    ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(s.action === 'enq' ? '⬅ EnQueue('+s.val+')' : 'DeQueue() → '+s.val+' ➡', W*0.5, y0+cellH*2.5-5);
  },

  _draw_circ_queue(ctx, W, H, s) {
    const cx = W/2, cy = H*0.5, r = 90;
    for (let i = 0; i < s.maxSize; i++) {
      const a = -Math.PI/2 + i*(Math.PI*2/s.maxSize);
      const nx = cx + Math.cos(a)*r, ny = cy + Math.sin(a)*r;
      const isFilled = s.arr[i] !== undefined;
      ctx.fillStyle = i===s.front?'rgba(16,185,129,0.3)':(i===s.rear?'rgba(245,158,11,0.3)':(isFilled?'rgba(59,130,246,0.25)':'rgba(255,255,255,0.03)'));
      ctx.strokeStyle = i===s.front?'#10b981':(i===s.rear?'#f59e0b':(isFilled?'#3b82f6':'rgba(255,255,255,0.1)'));
      ctx.lineWidth = (i===s.front||i===s.rear)?2:1;
      ctx.beginPath(); ctx.arc(nx, ny, 22, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      if (isFilled) { ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(s.arr[i], nx, ny+5); }
      else { ctx.fillStyle = '#475569'; ctx.font = '10px sans-serif'; ctx.fillText('空', nx, ny+4); }
    }
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('front='+s.front, cx, cy-r-28);
    ctx.fillStyle = '#f59e0b'; ctx.fillText('rear='+s.rear, cx, cy+r+28);
  },

  /* ── 3-3 队列的应用 ── */
  _gen_ds_3_3() {
    const steps = [
      { type:'title', t:'BFS — 广度优先搜索', sub:'队列实现逐层遍历', info:'BFS — 从起点出发，逐层扩展访问' },
    ];
    // Show BFS on a small graph
    const graph = { nodes:[{id:'A',x:0.5,y:0.2},{id:'B',x:0.2,y:0.5},{id:'C',x:0.5,y:0.5},{id:'D',x:0.8,y:0.5},{id:'E',x:0.35,y:0.8},{id:'F',x:0.65,y:0.8}],
      edges:[[0,1],[0,2],[0,3],[1,4],[2,4],[2,5],[3,5]] };
    const bfsOrder = ['A','B','C','D','E','F'];
    for (let i = 0; i < bfsOrder.length; i++) {
      steps.push({ type:'bfs', graph, visited:bfsOrder.slice(0,i+1), queue:bfsOrder.slice(i+1,i+3),
        info:'访问'+bfsOrder[i]+(i<bfsOrder.length-1?' → 将其未访问邻居入队':' → BFS完成！') });
    }
    this.steps = steps;
  },

  _draw_bfs(ctx, W, H, s) {
    const graph = s.graph;
    // edges
    graph.edges.forEach(([a,b]) => {
      const na = graph.nodes[a], nb = graph.nodes[b];
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(na.x*W, na.y*H); ctx.lineTo(nb.x*W, nb.y*H); ctx.stroke();
    });
    // nodes
    graph.nodes.forEach(n => {
      const visited = s.visited.includes(n.id);
      const queued = s.queue.includes(n.id);
      ctx.fillStyle = visited ? 'rgba(16,185,129,0.4)' : (queued ? 'rgba(245,158,11,0.3)' : 'rgba(59,130,246,0.2)');
      ctx.strokeStyle = visited ? '#10b981' : (queued ? '#f59e0b' : '#3b82f6'); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(n.x*W, n.y*H, 20, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(n.id, n.x*W, n.y*H+5);
      if (visited) {
        const idx = s.visited.indexOf(n.id);
        ctx.fillStyle = '#10b981'; ctx.font = 'bold 10px sans-serif';
        ctx.fillText('#'+(idx+1), n.x*W, n.y*H-24);
      }
    });
    // queue display
    if (s.queue.length > 0) {
      ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('等待队列: ['+s.queue.join(', ')+']', W*0.05, H*0.93);
    }
  },

  /* ══════════════════════════════════════════════════════
     Ch4 串
     ══════════════════════════════════════════════════════ */

  /* ── 4-0 串的基本概念 ── */
  _gen_ds_4_0() {
    const steps = [
      { type:'title', t:'串的定义与存储', sub:'零个或多个字符组成的有限序列', info:'串 — 一种特殊的线性表，数据元素为字符' },
      { type:'string_def', str:'Hello,DS!', info:'串 S = "Hello,DS!"  长度=9' },
      { type:'string_def', str:'', info:'空串 vs 空格串 " " — 空串长度为0，空格串长度为1' },
      { type:'string_storage', info:'顺序存储：连续的字符数组，C语言中以 \\0 结尾' },
      { type:'string_storage2', info:'链式存储：每个结点存一个或多个字符，存储密度低' },
    ];
    this.steps = steps;
  },

  _draw_string_def(ctx, W, H, s) {
    const x0 = W*0.08, cellW = (W*0.84) / Math.max(s.str.length||1, 9);
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 16px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center'; ctx.fillText('S = "' + (s.str||'(空串)') + '"', W/2, H*0.25);
    s.str.split('').forEach((ch, i) => {
      const x = x0 + i*cellW;
      ctx.fillStyle = 'rgba(59,130,246,0.25)'; ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 1.5;
      ctx.fillRect(x, H*0.42, cellW-3, 32); ctx.strokeRect(x, H*0.42, cellW-3, 32);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(ch, x+(cellW-3)/2, H*0.42+22);
    });
    // index
    for (let i = 0; i < s.str.length; i++) {
      ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(i, x0 + i*cellW + (cellW-3)/2, H*0.42+50);
    }
  },

  _draw_string_storage(ctx, W, H, s) {
    const str = 'Hello';
    const x0 = W*0.1, cellW = 60;
    str.split('').concat(['\\0']).forEach((ch, i) => {
      const x = x0 + i*(cellW+5);
      ctx.fillStyle = ch==='\\0' ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.25)';
      ctx.strokeStyle = ch==='\\0' ? '#ef4444' : '#3b82f6'; ctx.lineWidth = 1.5;
      ctx.fillRect(x, H*0.42, cellW, 34); ctx.strokeRect(x, H*0.42, cellW, 34);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(ch, x+cellW/2, H*0.42+23);
    });
    ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('地址: 0x1000 →', W*0.1 + 65, H*0.42-8);
    ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(s.info, W/2, H*0.78);
  },

  _draw_string_storage2(ctx, W, H, s) {
    const x0 = W*0.08;
    const blocks = ['H','e','l','l','o'];
    blocks.forEach((ch, i) => {
      const x = x0 + i*95;
      ctx.fillStyle = 'rgba(139,92,246,0.2)'; ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 1.5;
      ctx.fillRect(x, H*0.4, 30, 30); ctx.strokeRect(x, H*0.4, 30, 30);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(ch, x+15, H*0.4+21);
      ctx.fillStyle = 'rgba(16,185,129,0.2)'; ctx.strokeStyle = '#10b981';
      ctx.fillRect(x+30, H*0.4, 20, 30); ctx.strokeRect(x+30, H*0.4, 20, 30);
      if (i < blocks.length-1) {
        ctx.strokeStyle = '#10b981'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(x+50, H*0.4+15); ctx.lineTo(x+95, H*0.4+15); ctx.stroke();
      }
    });
    ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('存储密度 = 字符数 / 结点大小 （通常较低）', W/2, H*0.75);
  },

  /* ── 4-1 串的模式匹配 ── */
  _gen_ds_4_1() {
    const steps = [
      { type:'title', t:'BF暴力匹配算法', sub:'朴素模式匹配 · O(m×n)', info:'BF算法 — 从主串每个位置开始逐一比较' },
    ];
    const S = 'ababcabcacbab', T = 'abcac';
    // BF matching steps
    for (let i = 0; i <= S.length - T.length; i++) {
      let matched = 0;
      for (let j = 0; j < T.length && i+j < S.length; j++) {
        if (S[i+j] === T[j]) matched++; else break;
      }
      const isFullMatch = matched === T.length;
      steps.push({ type:'bf_match', S, T, pos:i, matched,
        info: isFullMatch ? '✅ 匹配成功！位置='+i : ('从位置'+i+'开始比对，匹配了'+matched+'个字符后失败') });
      if (isFullMatch) break;
    }
    // KMP
    steps.push({ type:'title', t:'KMP算法', sub:'Knuth-Morris-Pratt · O(m+n)', info:'KMP — 利用已匹配信息，避免回溯' });
    // Show next array
    const T2 = 'abcac';
    const next = [0,1,1,1,2]; // simplified next
    steps.push({ type:'kmp_next', T:T2, next, info:'next数组：记录模式串各位置的最长公共前后缀长度+1' });
    steps.push({ type:'kmp_demo', S:'ababcabcacbab', T:'abcac', pos:0, j:0, next,
      info:'开始匹配：i=0, j=0' });
    steps.push({ type:'kmp_demo', S:'ababcabcacbab', T:'abcac', pos:2, j:2, next,
      info:'i=2,j=2 时失配 → j=next[2]=1，i不动' });
    steps.push({ type:'kmp_demo', S:'ababcabcacbab', T:'abcac', pos:5, j:5, next,
      info:'i移动到5，完全匹配！j=5=模式串长度 ✅' });
    this.steps = steps;
  },

  _draw_bf_match(ctx, W, H, s) {
    const x0 = W*0.04, cellW = (W*0.92) / s.S.length;
    // S
    s.S.split('').forEach((ch, i) => {
      const x = x0 + i*cellW;
      const isHL = i >= s.pos && i < s.pos + s.matched;
      ctx.fillStyle = isHL ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.12)';
      ctx.strokeStyle = isHL ? '#10b981' : 'rgba(255,255,255,0.08)';
      ctx.fillRect(x, H*0.35, cellW-2, 26); ctx.strokeRect(x, H*0.35, cellW-2, 26);
      ctx.fillStyle = '#e2e8f0'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(ch, x+(cellW-2)/2, H*0.35+18);
    });
    // T aligned
    s.T.split('').forEach((ch, i) => {
      const x = x0 + (s.pos+i)*cellW;
      const isMatch = i < s.matched;
      ctx.fillStyle = isMatch ? 'rgba(16,185,129,0.5)' : (i===s.matched?'rgba(239,68,68,0.4)':'rgba(139,92,246,0.2)');
      ctx.strokeStyle = isMatch ? '#10b981' : (i===s.matched?'#ef4444':'#8b5cf6');
      ctx.fillRect(x, H*0.55, cellW-2, 26); ctx.strokeRect(x, H*0.55, cellW-2, 26);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(ch, x+(cellW-2)/2, H*0.55+18);
    });
  },

  _draw_kmp_next(ctx, W, H, s) {
    const x0 = W*0.08, cellW = 55;
    // T
    s.T.split('').forEach((ch, i) => {
      const x = x0 + i*cellW;
      ctx.fillStyle = 'rgba(59,130,246,0.2)'; ctx.strokeStyle = '#3b82f6';
      ctx.fillRect(x, H*0.3, cellW-3, 28); ctx.strokeRect(x, H*0.3, cellW-3, 28);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(ch, x+(cellW-3)/2, H*0.3+19);
    });
    // next
    s.next.forEach((v, i) => {
      const x = x0 + i*cellW;
      ctx.fillStyle = 'rgba(16,185,129,0.2)'; ctx.strokeStyle = '#10b981';
      ctx.fillRect(x, H*0.48, cellW-3, 28); ctx.strokeRect(x, H*0.48, cellW-3, 28);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('next['+i+']='+v, x+(cellW-3)/2, H*0.48+19);
    });
    ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('next[0]=0 (约定) | next[j]=最长公共前后缀长度+1', W/2, H*0.7);
  },

  _draw_kmp_demo(ctx, W, H, s) {
    const x0 = W*0.04, cellW = (W*0.92) / s.S.length;
    s.S.split('').forEach((ch, i) => {
      const x = x0 + i*cellW;
      const isHL = i === s.pos;
      ctx.fillStyle = isHL ? 'rgba(245,158,11,0.3)' : 'rgba(59,130,246,0.12)';
      ctx.strokeStyle = isHL ? '#f59e0b' : 'rgba(255,255,255,0.08)';
      ctx.fillRect(x, H*0.35, cellW-2, 26); ctx.strokeRect(x, H*0.35, cellW-2, 26);
      ctx.fillStyle = '#e2e8f0'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(ch, x+(cellW-2)/2, H*0.35+18);
    });
    // i marker
    if (s.pos < s.S.length) {
      const mx = x0 + s.pos*cellW + (cellW-2)/2;
      ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('i='+s.pos, mx, H*0.32);
    }
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('j=' + s.j + (s.j===s.T.length?' ✅完全匹配':''), W/2, H*0.7);
  },

  /* ── 4-2 串的基本操作 ── */
  _gen_ds_4_2() {
    const steps = [
      { type:'title', t:'串的基本操作', sub:'StrAssign · StrCopy · StrLen · Concat · SubStr', info:'串操作 — 与线性表类似但元素为字符' },
    ];
    const ops = [
      { name:'StrAssign', desc:'给串赋值', example:'S = "Data"', result:'S = "Data"' },
      { name:'StrCopy', desc:'复制串', example:'T = S', result:'T = "Data"' },
      { name:'StrLen', desc:'求串长度', example:'StrLen(S)', result:'4' },
      { name:'Concat', desc:'串连接', example:'Concat(S, "Struct")', result:'"DataStruct"' },
      { name:'SubStr', desc:'取子串', example:'SubStr(S, 2, 2)', result:'"at"' },
    ];
    ops.forEach((op, i) => {
      steps.push({ type:'str_op', op, info:op.name + ' — ' + op.desc });
    });
    this.steps = steps;
  },

  _draw_str_op(ctx, W, H, s) {
    const op = s.op;
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 18px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center'; ctx.fillText(op.name, W/2, H*0.2);
    ctx.fillStyle = '#64748b'; ctx.font = '13px sans-serif';
    ctx.fillText(op.desc, W/2, H*0.3);
    // example
    ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 1.5;
    this._roundRect(ctx, W*0.15, H*0.38, W*0.7, 40, 8); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('输入: ' + op.example, W/2, H*0.38+27);
    // result
    ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#10b981'; ctx.lineWidth = 1.5;
    this._roundRect(ctx, W*0.2, H*0.55, W*0.6, 40, 8); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 15px sans-serif';
    ctx.fillText('输出: ' + op.result, W/2, H*0.55+27);
  },

  /* ══════════════════════════════════════════════════════
     Ch5 数组和广义表
     ══════════════════════════════════════════════════════ */

  /* ── 5-0 数组的顺序存储 ── */
  _gen_ds_5_0() {
    const steps = [
      { type:'title', t:'数组的顺序存储', sub:'行优先 vs 列优先存储', info:'数组 — 一旦建立，结构不变（一般不插入删除）' },
    ];
    // Row-major
    const mat = [[1,2,3],[4,5,6],[7,8,9]];
    steps.push({ type:'array_storage', mat, mode:'row', idx:-1, info:'行优先存储：逐行连续存放' });
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        steps.push({ type:'array_storage', mat, mode:'row', idx:i*3+j,
          info:'地址计算：LOC(aᵢⱼ) = LOC(a₀₀) + (i×n+j)×L   →  a['+i+']['+j+']='+mat[i][j] });
      }
    }
    steps.push({ type:'title', t:'列优先存储', sub:'逐列连续存放', info:'列优先存储：FORTRAN语言采用' });
    steps.push({ type:'array_storage', mat, mode:'col', idx:-1, info:'列优先存储：逐列连续存放' });
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
        steps.push({ type:'array_storage', mat, mode:'col', idx:j*3+i,
          info:'地址计算：LOC(aᵢⱼ) = LOC(a₀₀) + (j×m+i)×L   →  a['+i+']['+j+']='+mat[i][j] });
      }
    }
    this.steps = steps;
  },

  _draw_array_storage(ctx, W, H, s) {
    const mat = s.mat;
    // Draw 2D matrix on left
    const mx = W*0.06, my = H*0.2, cellS = 32;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const x = mx + j*cellS, y = my + i*cellS;
        ctx.fillStyle = 'rgba(59,130,246,0.2)'; ctx.strokeStyle = '#3b82f6';
        ctx.fillRect(x, y, cellS, cellS); ctx.strokeRect(x, y, cellS, cellS);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(mat[i][j], x+cellS/2, y+cellS/2+4);
      }
    }
    ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif';
    ctx.fillText(s.mode==='row'?'行优先 ↓':'列优先 →', mx+cellS*3+10, my+cellS*1.5);
    // Linear storage on right
    const lx = W*0.52, ly = H*0.35;
    const flat = s.mode==='row' ? [].concat(...mat) : mat[0].map((_,c)=>mat.map(r=>r[c])).flat();
    flat.forEach((v, i) => {
      const x = lx + i*40;
      const isHL = i === s.idx;
      ctx.fillStyle = isHL ? 'rgba(16,185,129,0.4)' : 'rgba(139,92,246,0.2)';
      ctx.strokeStyle = isHL ? '#10b981' : '#8b5cf6'; ctx.lineWidth = isHL ? 2.5 : 1;
      this._roundRect(ctx, x, ly, 36, 30, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(v, x+18, ly+20);
    });
    // address labels
    flat.forEach((v, i) => {
      ctx.fillStyle = '#64748b'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('0x'+(1000+i*4).toString(16), lx+i*40+18, ly+50);
    });
  },

  /* ── 5-1 特殊矩阵的压缩存储 ── */
  _gen_ds_5_1() {
    const steps = [
      { type:'title', t:'对称矩阵压缩存储', sub:'只存储下三角(含对角线)元素', info:'对称矩阵 — aᵢⱼ = aⱼᵢ，只需存一半' },
    ];
    // Symmetric matrix
    const symMat = [[1,2,4],[2,3,5],[4,5,6]];
    steps.push({ type:'sym_matrix', mat:symMat, highlight:-1, info:'3×3对称矩阵，只需存储 n(n+1)/2 = 6 个元素' });
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j <= i; j++) {
        const k = i*(i+1)/2 + j;
        steps.push({ type:'sym_matrix', mat:symMat, highlight:k,
          info:'a['+i+']['+j+']='+symMat[i][j]+' → 压缩存储位置 k='+k+'(i≥j时 k=i(i+1)/2+j)' });
      }
    }
    // Sparse matrix
    steps.push({ type:'title', t:'稀疏矩阵三元组', sub:'只存储非零元的行、列、值', info:'稀疏矩阵 — 非零元占比很低的矩阵' });
    const sparseTriplets = [
      {row:0, col:1, val:3},
      {row:0, col:4, val:7},
      {row:2, col:0, val:5},
      {row:3, col:3, val:2},
    ];
    steps.push({ type:'sparse_triplet', triplets:sparseTriplets, rows:4, cols:5,
      info:'4×5矩阵只有4个非零元 → 三元组表节省大量空间' });
    this.steps = steps;
  },

  _draw_sym_matrix(ctx, W, H, s) {
    const mx = W*0.08, my = H*0.18, cellS = 38;
    let k = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const x = mx + j*cellS, y = my + i*cellS;
        const isStored = i >= j;
        const isHL = isStored && k === s.highlight;
        if (isStored) k++;
        ctx.fillStyle = isHL ? 'rgba(16,185,129,0.4)' : (isStored ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.03)');
        ctx.strokeStyle = isHL ? '#10b981' : (isStored ? '#3b82f6' : 'rgba(255,255,255,0.08)');
        ctx.lineWidth = isHL ? 2.5 : 1;
        ctx.fillRect(x, y, cellS, cellS); ctx.strokeRect(x, y, cellS, cellS);
        ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(s.mat[i][j], x+cellS/2, y+cellS/2+5);
      }
    }
    // Compressed array
    const comp = [1,2,3,4,5,6];
    const cx = W*0.55, cy = H*0.6;
    comp.forEach((v, i) => {
      const x = cx + i*38;
      const isHL = i === s.highlight;
      ctx.fillStyle = isHL ? 'rgba(16,185,129,0.4)' : 'rgba(139,92,246,0.2)';
      ctx.strokeStyle = isHL ? '#10b981' : '#8b5cf6'; ctx.lineWidth = isHL ? 2.5 : 1;
      this._roundRect(ctx, x, cy, 34, 28, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(v, x+17, cy+19);
      ctx.fillStyle = '#64748b'; ctx.font = '9px sans-serif';
      ctx.fillText('k='+i, x+17, cy+42);
    });
  },

  _draw_sparse_triplet(ctx, W, H, s) {
    // Draw the sparse matrix representation
    const mx = W*0.06, my = H*0.2, cellS = 30;
    const mm = new Array(s.rows).fill(0).map(() => new Array(s.cols).fill(0));
    s.triplets.forEach(t => { mm[t.row][t.col] = t.val; });
    for (let i = 0; i < s.rows; i++) {
      for (let j = 0; j < s.cols; j++) {
        const x = mx + j*cellS, y = my + i*cellS;
        const isNZ = mm[i][j] !== 0;
        ctx.fillStyle = isNZ ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.03)';
        ctx.strokeStyle = isNZ ? '#10b981' : 'rgba(255,255,255,0.08)';
        ctx.fillRect(x, y, cellS, cellS); ctx.strokeRect(x, y, cellS, cellS);
        if (isNZ) { ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(mm[i][j], x+cellS/2, y+cellS/2+4); }
      }
    }
    // Triplet table
    const tx = W*0.55, ty = H*0.25;
    ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('row col val', tx+45, ty-5);
    s.triplets.forEach((t, i) => {
      const y = ty + i*24;
      ctx.fillStyle = 'rgba(59,130,246,0.15)'; ctx.strokeStyle = '#3b82f6';
      ctx.fillRect(tx, y, 30, 20); ctx.strokeRect(tx, y, 30, 20);
      ctx.fillRect(tx+30, y, 25, 20); ctx.strokeRect(tx+30, y, 25, 20);
      ctx.fillRect(tx+55, y, 35, 20); ctx.strokeRect(tx+55, y, 35, 20);
      ctx.fillStyle = '#fff'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(t.row, tx+15, y+15);
      ctx.fillText(t.col, tx+42, y+15);
      ctx.fillText(t.val, tx+72, y+15);
    });
  },

  /* ── 5-2 广义表 ── */
  _gen_ds_5_2() {
    const steps = [
      { type:'title', t:'广义表（Generalized List）', sub:'元素可以是原子或子表的线性表', info:'广义表 — 线性表的推广，允许递归定义' },
    ];
    // Examples
    steps.push({ type:'glist_example', expr:'A = ()', desc:'空表，长度0', info:'空广义表' });
    steps.push({ type:'glist_example', expr:'B = (a,b,c)', desc:'纯原子表，长度3', info:'纯原子广义表（即普通线性表）' });
    steps.push({ type:'glist_example', expr:'C = (a,(b,c))', desc:'混合表，长度2', info:'元素可以是原子或子表' });
    steps.push({ type:'glist_example', expr:'D = (A,B,C)', desc:'子表共享，长度3', info:'广义表可以共享子表' });
    steps.push({ type:'glist_example', expr:'E = (a,E)', desc:'递归表，长度2', info:'递归广义表（无限深度）' });
    // Head/Tail
    steps.push({ type:'title', t:'Head 与 Tail 操作', sub:'取表头(第一个元素)与表尾(除第一个元素外的子表)', info:'Head/Tail — 广义表的基本操作' });
    steps.push({ type:'head_tail', glist:'(a,b,c)', head:'a', tail:'(b,c)',
      info:'Head((a,b,c)) = a    Tail((a,b,c)) = (b,c)' });
    steps.push({ type:'head_tail', glist:'((a,b),c,d)', head:'(a,b)', tail:'(c,d)',
      info:'Head(((a,b),c,d)) = (a,b)    Tail = (c,d)' });
    // Storage
    steps.push({ type:'title', t:'广义表的链式存储', sub:'头尾链表表示法', info:'广义表的链式存储 — 每个结点含tag/atom/hp/tp' });
    steps.push({ type:'glist_storage', info:'tag=0表示原子结点；tag=1表示子表结点\nhp指向表头，tp指向表尾' });
    this.steps = steps;
  },

  _draw_glist_example(ctx, W, H, s) {
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 18px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center'; ctx.fillText(s.expr, W/2, H*0.3);
    ctx.fillStyle = '#94a3b8'; ctx.font = '14px "Microsoft YaHei", sans-serif';
    ctx.fillText(s.desc, W/2, H*0.5);
  },

  _draw_head_tail(ctx, W, H, s) {
    ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('广义表: ' + s.glist, W/2, H*0.22);
    // Head
    ctx.fillStyle = 'rgba(16,185,129,0.15)'; ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2;
    this._roundRect(ctx, W*0.1, H*0.4, W*0.35, 50, 10); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Head', W*0.275, H*0.4+20);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 16px sans-serif';
    ctx.fillText(s.head, W*0.275, H*0.4+40);
    // Tail
    ctx.fillStyle = 'rgba(139,92,246,0.15)'; ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 2;
    this._roundRect(ctx, W*0.55, H*0.4, W*0.35, 50, 10); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#8b5cf6'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Tail', W*0.725, H*0.4+20);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 16px sans-serif';
    ctx.fillText(s.tail, W*0.725, H*0.4+40);
  },

  _draw_glist_storage(ctx, W, H, s) {
    // Draw a sample node structure
    const x0 = W*0.08, y0 = H*0.35, cellW = 60;
    // tag
    ctx.fillStyle = '#ef4444'; ctx.fillRect(x0, y0, cellW, 36);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('tag=1', x0+cellW/2, y0+23);
    // hp
    ctx.fillStyle = '#3b82f6'; ctx.fillRect(x0+cellW, y0, cellW, 36);
    ctx.fillStyle = '#fff'; ctx.fillText('hp →', x0+cellW*1.5, y0+23);
    // tp
    ctx.fillStyle = '#10b981'; ctx.fillRect(x0+cellW*2, y0, cellW, 36);
    ctx.fillStyle = '#fff'; ctx.fillText('tp →', x0+cellW*2.5, y0+23);
    // labels
    ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif';
    ctx.fillText('标志域', x0+cellW/2-10, y0-5);
    ctx.fillText('表头指针', x0+cellW*1.5-15, y0-5);
    ctx.fillText('表尾指针', x0+cellW*2.5-15, y0-5);
    // Atom node below
    const ay = H*0.6;
    ctx.fillStyle = '#f59e0b'; ctx.fillRect(x0, ay, cellW, 36);
    ctx.fillStyle = '#fff'; ctx.fillText('tag=0', x0+cellW/2, ay+23);
    ctx.fillStyle = 'rgba(59,130,246,0.3)'; ctx.strokeStyle = '#3b82f6';
    ctx.fillRect(x0+cellW, ay, cellW*2, 36); ctx.strokeRect(x0+cellW, ay, cellW*2, 36);
    ctx.fillStyle = '#fff'; ctx.fillText('atom 值', x0+cellW*2, ay+23);
    ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif';
    ctx.fillText('原子结点', x0+cellW/2-10, ay-5);
  },

  /* ══════════════════════════════════════════════════════
     工具方法
     ══════════════════════════════════════════════════════ */
  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x+r, y); ctx.lineTo(x+w-r, y);
    ctx.arcTo(x+w, y, x+w, y+r, r);
    ctx.lineTo(x+w, y+h-r); ctx.arcTo(x+w, y+h, x+w-r, y+h, r);
    ctx.lineTo(x+r, y+h); ctx.arcTo(x, y+h, x, y+h-r, r);
    ctx.lineTo(x, y+r); ctx.arcTo(x, y, x+r, y, r);
    ctx.closePath();
  },
};

/* ── KP → 算法映射 ── */
const dsBasicAlgoMap = {
  '数据结构基本概念': { kpId:'ds-1-0', name:'数据结构概念' },
  '逻辑结构与存储结构': { kpId:'ds-1-1', name:'逻辑结构/存储结构' },
  '算法与算法分析': { kpId:'ds-1-2', name:'算法复杂度分析' },
  '线性表的顺序存储': { kpId:'ds-2-0', name:'顺序表操作' },
  '线性表的链式存储': { kpId:'ds-2-1', name:'链表操作' },
  '循环链表与双向链表': { kpId:'ds-2-2', name:'循环/双向链表' },
  '线性表的应用': { kpId:'ds-2-3', name:'约瑟夫环/多项式' },
  '栈的定义与操作': { kpId:'ds-3-0', name:'栈操作演示' },
  '栈的应用': { kpId:'ds-3-1', name:'表达式求值/括号匹配' },
  '队列的定义与操作': { kpId:'ds-3-2', name:'队列操作演示' },
  '队列的应用': { kpId:'ds-3-3', name:'BFS广度优先' },
  '串的基本概念': { kpId:'ds-4-0', name:'串定义与存储' },
  '串的模式匹配': { kpId:'ds-4-1', name:'BF/KMP算法' },
  '串的基本操作': { kpId:'ds-4-2', name:'串操作演示' },
  '数组的顺序存储': { kpId:'ds-5-0', name:'数组存储方式' },
  '特殊矩阵的压缩存储': { kpId:'ds-5-1', name:'压缩存储' },
  '广义表': { kpId:'ds-5-2', name:'广义表演示' },
};

/* ── KP → C代码映射 ── */
const dsBasicCodeMap = {
  '数据结构基本概念': '#include <stdio.h>\n#include <stdlib.h>\n\n// 数据结构示例：学生信息\ntypedef struct {\n    int id;\n    char name[20];\n    float score;\n} Student;\n\nint main() {\n    // 数据元素：一个学生的完整信息\n    Student s1 = {1001, "Zhang", 92.5};\n    // 数据项：s1.name 是最小单位\n    printf("数据元素: ID=%d, Name=%s, Score=%.1f\\n",\n           s1.id, s1.name, s1.score);\n    return 0;\n}',
  '逻辑结构与存储结构': '#include <stdio.h>\n\n// 逻辑结构示例：顺序存储线性表\n#define MAX 100\ntypedef struct {\n    int data[MAX];\n    int length;\n} SeqList;\n\nvoid init(SeqList *L) { L->length = 0; }\n\nvoid insert(SeqList *L, int pos, int val) {\n    if (pos < 0 || pos > L->length) return;\n    for (int i = L->length; i > pos; i--)\n        L->data[i] = L->data[i-1];\n    L->data[pos] = val;\n    L->length++;\n}\n\nint main() {\n    SeqList L; init(&L);\n    insert(&L, 0, 10); insert(&L, 1, 20);\n    insert(&L, 1, 15); // 在位置1插入15\n    printf("顺序表: ");\n    for (int i = 0; i < L.length; i++)\n        printf("%d ", L.data[i]);\n    printf("\\n长度=%d\\n", L.length);\n    return 0;\n}',
  '算法与算法分析': '#include <stdio.h>\n#include <time.h>\n\n// O(n) 线性查找\nint linearSearch(int arr[], int n, int target) {\n    for (int i = 0; i < n; i++)\n        if (arr[i] == target) return i;\n    return -1;\n}\n\n// O(log n) 二分查找\nint binarySearch(int arr[], int n, int target) {\n    int lo = 0, hi = n - 1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}\n\nint main() {\n    int arr[] = {2,5,8,12,16,23,38,45,56,67,78,89};\n    int n = 12, target = 38;\n    printf("线性查找 O(n): 位置=%d\\n",\n           linearSearch(arr, n, target));\n    printf("二分查找 O(log n): 位置=%d\\n",\n           binarySearch(arr, n, target));\n    return 0;\n}',
  '线性表的顺序存储': '#include <stdio.h>\n#define MAX 20\n\ntypedef struct {\n    int data[MAX];\n    int length;\n} SqList;\n\nint insert(SqList *L, int i, int e) {\n    if (i < 0 || i > L->length) return 0;\n    for (int j = L->length; j > i; j--)\n        L->data[j] = L->data[j-1];\n    L->data[i] = e; L->length++;\n    return 1;\n}\n\nint del(SqList *L, int i, int *e) {\n    if (i < 0 || i >= L->length) return 0;\n    *e = L->data[i];\n    for (int j = i; j < L->length-1; j++)\n        L->data[j] = L->data[j+1];\n    L->length--; return 1;\n}\n\nint main() {\n    SqList L = {{10,20,30,40,50}, 5};\n    insert(&L, 2, 99); // 在位置2插入99\n    printf("插入后: ");\n    for (int i = 0; i < L.length; i++)\n        printf("%d ", L.data[i]);\n    int e; del(&L, 1, &e); // 删除位置1\n    printf("\\n删除%d后: ", e);\n    for (int i = 0; i < L.length; i++)\n        printf("%d ", L.data[i]);\n    printf("\\n最终长度=%d\\n", L.length);\n    return 0;\n}',
  '线性表的链式存储': '#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct LNode {\n    int data;\n    struct LNode *next;\n} LNode, *LinkList;\n\nLNode* createNode(int val) {\n    LNode *p = (LNode*)malloc(sizeof(LNode));\n    p->data = val; p->next = NULL;\n    return p;\n}\n\nvoid insertAfter(LNode *p, int val) {\n    LNode *s = createNode(val);\n    s->next = p->next;\n    p->next = s;\n}\n\nvoid deleteAfter(LNode *p) {\n    if (!p->next) return;\n    LNode *q = p->next;\n    p->next = q->next;\n    free(q);\n}\n\nvoid print(LinkList L) {\n    for (LNode *p = L->next; p; p = p->next)\n        printf("%d -> ", p->data);\n    printf("NULL\\n");\n}\n\nint main() {\n    LinkList L = createNode(0); // 头结点\n    insertAfter(L, 10);\n    insertAfter(L->next, 30);\n    insertAfter(L->next, 20);   // 10→20→30\n    printf("链表: "); print(L);\n    deleteAfter(L->next);       // 删除20\n    printf("删除后: "); print(L);\n    return 0;\n}',
  '循环链表与双向链表': '#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct DNode {\n    int data;\n    struct DNode *prior, *next;\n} DNode;\n\nDNode* create(int val) {\n    DNode *p = (DNode*)malloc(sizeof(DNode));\n    p->data = val; p->prior = p->next = p;\n    return p;\n}\n\nvoid insertAfter(DNode *p, int val) {\n    DNode *s = create(val);\n    s->next = p->next; s->prior = p;\n    p->next->prior = s; p->next = s;\n}\n\nint main() {\n    DNode *head = create(0); // 双向循环链表头结点\n    insertAfter(head, 10); insertAfter(head, 20);\n    insertAfter(head->next, 15); // 10→15→20\n    printf("正向: ");\n    for (DNode *p = head->next; p != head; p = p->next)\n        printf("%d ", p->data);\n    printf("\\n反向: ");\n    for (DNode *p = head->prior; p != head; p = p->prior)\n        printf("%d ", p->data);\n    printf("\\n");\n    return 0;\n}',
  '线性表的应用': '#include <stdio.h>\n#include <stdlib.h>\n\n// 约瑟夫环 - 循环链表实现\ntypedef struct Node {\n    int data;\n    struct Node *next;\n} Node;\n\nint josephus(int n, int m) {\n    Node *head = (Node*)malloc(sizeof(Node));\n    head->data = 1; Node *tail = head;\n    for (int i = 2; i <= n; i++) {\n        Node *p = (Node*)malloc(sizeof(Node));\n        p->data = i; tail->next = p; tail = p;\n    }\n    tail->next = head; // 成环\n    Node *prev = tail, *cur = head;\n    printf("出列顺序: ");\n    while (cur->next != cur) {\n        for (int k = 1; k < m; k++) {\n            prev = cur; cur = cur->next;\n        }\n        printf("%d ", cur->data);\n        prev->next = cur->next;\n        free(cur); cur = prev->next;\n    }\n    printf("%d\\n", cur->data);\n    return cur->data;\n}\n\nint main() {\n    int last = josephus(8, 3);\n    printf("幸存者: %d\\n", last);\n    return 0;\n}',
  '栈的定义与操作': '#include <stdio.h>\n#define MAX 100\n\ntypedef struct {\n    int data[MAX];\n    int top;\n} SqStack;\n\nvoid init(SqStack *S) { S->top = -1; }\nint push(SqStack *S, int e) {\n    if (S->top == MAX-1) return 0;\n    S->data[++S->top] = e; return 1;\n}\nint pop(SqStack *S, int *e) {\n    if (S->top == -1) return 0;\n    *e = S->data[S->top--]; return 1;\n}\n\nint main() {\n    SqStack S; init(&S);\n    push(&S, 10); push(&S, 25); push(&S, 8);\n    printf("栈顶: %d\\n", S.data[S.top]);\n    int e; pop(&S, &e);\n    printf("出栈: %d, 新栈顶: %d\\n", e, S.data[S.top]);\n    return 0;\n}',
  '栈的应用': '#include <stdio.h>\n#include <string.h>\n#define MAX 100\n\n// 括号匹配\nint match(const char *s) {\n    char st[MAX]; int top = -1;\n    for (int i = 0; s[i]; i++) {\n        char c = s[i];\n        if (c == \'(\' || c == \'[\' || c == \'{\')\n            st[++top] = c;\n        else {\n            if (top == -1) return 0;\n            char t = st[top--];\n            if ((c == \')\' && t != \'(\') ||\n                (c == \']\' && t != \'[\') ||\n                (c == \'}\' && t != \'{\'))\n                return 0;\n        }\n    }\n    return top == -1;\n}\n\nint main() {\n    printf("{([])}: %s\\n", match("{([])}")?"OK":"FAIL");\n    printf("{([]}:  %s\\n", match("{([]}")?"OK":"FAIL");\n    return 0;\n}',
  '队列的定义与操作': '#include <stdio.h>\n#define MAX 10\n\ntypedef struct {\n    int data[MAX];\n    int front, rear;\n} SqQueue;\n\nvoid init(SqQueue *Q) { Q->front = Q->rear = 0; }\n\nint enQueue(SqQueue *Q, int e) {\n    if ((Q->rear+1) % MAX == Q->front) return 0;\n    Q->data[Q->rear] = e;\n    Q->rear = (Q->rear + 1) % MAX;\n    return 1;\n}\n\nint deQueue(SqQueue *Q, int *e) {\n    if (Q->front == Q->rear) return 0;\n    *e = Q->data[Q->front];\n    Q->front = (Q->front + 1) % MAX;\n    return 1;\n}\n\nint main() {\n    SqQueue Q; init(&Q);\n    enQueue(&Q, 10); enQueue(&Q, 25);\n    enQueue(&Q, 8);\n    int e;\n    deQueue(&Q, &e); printf("出队: %d\\n", e);\n    deQueue(&Q, &e); printf("出队: %d\\n", e);\n    enQueue(&Q, 33);\n    printf("队头: %d\\n", Q.data[Q.front]);\n    return 0;\n}',
  '队列的应用': '#include <stdio.h>\n#define MAX 50\n\n// BFS 邻接矩阵实现\nvoid BFS(int graph[][5], int n, int start) {\n    int visited[5] = {0};\n    int queue[MAX], front = 0, rear = 0;\n    queue[rear++] = start;\n    visited[start] = 1;\n    printf("BFS: ");\n    while (front < rear) {\n        int v = queue[front++];\n        printf("%d ", v);\n        for (int i = 0; i < n; i++) {\n            if (graph[v][i] && !visited[i]) {\n                queue[rear++] = i;\n                visited[i] = 1;\n            }\n        }\n    }\n    printf("\\n");\n}\n\nint main() {\n    int g[5][5] = {\n        {0,1,1,0,0}, {1,0,0,1,0},\n        {1,0,0,1,1}, {0,1,1,0,1},\n        {0,0,1,1,0}\n    };\n    BFS(g, 5, 0);\n    return 0;\n}',
  '串的基本概念': '#include <stdio.h>\n#include <string.h>\n\nint main() {\n    // 串的顺序存储\n    char s1[20] = "Hello,DS!";\n    char s2[] = "World";\n    printf("S1 = %s, len = %d\\n", s1, (int)strlen(s1));\n    printf("S2 = %s, len = %d\\n", s2, (int)strlen(s2));\n    // 空串 vs 空格串\n    char empty[] = "";\n    char space[] = "   ";\n    printf("空串 len = %d\\n", (int)strlen(empty));\n    printf("空格串 len = %d\\n", (int)strlen(space));\n    // C语言以 \\0 结尾\n    printf("s1[%d] = \\\\0 (结束符)\\n", (int)strlen(s1));\n    return 0;\n}',
  '串的模式匹配': '#include <stdio.h>\n#include <string.h>\n\n// BF暴力匹配\nint BF(const char *S, const char *T) {\n    int n = strlen(S), m = strlen(T);\n    for (int i = 0; i <= n-m; i++) {\n        int j;\n        for (j = 0; j < m; j++)\n            if (S[i+j] != T[j]) break;\n        if (j == m) return i; // 匹配成功\n    }\n    return -1;\n}\n\n// KMP getNext\nvoid getNext(const char *T, int next[]) {\n    int j = 0, k = -1, m = strlen(T);\n    next[0] = -1;\n    while (j < m-1) {\n        if (k == -1 || T[j] == T[k])\n            next[++j] = ++k;\n        else k = next[k];\n    }\n}\n\nint KMP(const char *S, const char *T) {\n    int n = strlen(S), m = strlen(T);\n    int next[100], i = 0, j = 0;\n    getNext(T, next);\n    while (i < n && j < m) {\n        if (j == -1 || S[i] == T[j])\n            { i++; j++; }\n        else j = next[j];\n    }\n    return j == m ? i-j : -1;\n}\n\nint main() {\n    printf("BF:  pos=%d\\n", BF("ababcabcacbab", "abcac"));\n    printf("KMP: pos=%d\\n", KMP("ababcabcacbab", "abcac"));\n    return 0;\n}',
  '串的基本操作': '#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s1[50] = "Data";\n    char s2[50];\n    // StrCopy\n    strcpy(s2, s1);\n    printf("Copy: s2 = %s\\n", s2);\n    // StrLen\n    printf("Len: %d\\n", (int)strlen(s1));\n    // Concat\n    strcat(s1, "Struct");\n    printf("Concat: %s\\n", s1);\n    // SubStr (s1[2]开始取2个字符)\n    char sub[10];\n    strncpy(sub, s1+2, 2); sub[2] = \'\\0\';\n    printf("SubStr(2,2): %s\\n", sub);\n    return 0;\n}',
  '数组的顺序存储': '#include <stdio.h>\n\nint main() {\n    int a[2][3] = {{1,2,3},{4,5,6}};\n    printf("行优先存储 (C语言):\\n");\n    int *p = &a[0][0];\n    for (int i = 0; i < 6; i++)\n        printf("addr[%d]=0x%p val=%d\\n",\n               i, (void*)(p+i), p[i]);\n    \n    // LOC(a[i][j]) = LOC(a[0][0]) + (i*n+j)*sizeof(int)\n    printf("\\na[1][2]=%d\\n", a[1][2]);\n    printf("公式: 1*3+2=%d\\n", 1*3+2);\n    return 0;\n}',
  '特殊矩阵的压缩存储': '#include <stdio.h>\n\n// 对称矩阵压缩存储 (下三角)\nint getSym(int B[], int i, int j) {\n    // i>=j时在下三角，否则利用对称性\n    if (i >= j) return B[i*(i+1)/2 + j];\n    else return B[j*(j+1)/2 + i];\n}\n\nint main() {\n    // 3x3对称矩阵: [[1,2,4],[2,3,5],[4,5,6]]\n    int B[] = {1, 2, 3, 4, 5, 6}; // 压缩存储\n    printf("B[0][1]=%d (压缩位置0*1/2+1=1)\\n",\n           getSym(B, 0, 1));\n    printf("B[2][0]=%d (利用对称: B[0][2])\\n",\n           getSym(B, 2, 0));\n    return 0;\n}',
  '广义表': '#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct GLNode {\n    int tag; // 0=原子, 1=子表\n    union {\n        char atom;\n        struct { struct GLNode *hp, *tp; } ptr;\n    };\n} GLNode;\n\nGLNode* createAtom(char c) {\n    GLNode *p = (GLNode*)malloc(sizeof(GLNode));\n    p->tag = 0; p->atom = c;\n    return p;\n}\n\nGLNode* createSublist(GLNode *hp, GLNode *tp) {\n    GLNode *p = (GLNode*)malloc(sizeof(GLNode));\n    p->tag = 1; p->ptr.hp = hp; p->ptr.tp = tp;\n    return p;\n}\n\n// Head: 取广义表第一个元素\nGLNode* head(GLNode *L) {\n    if (!L || L->tag == 0) return NULL;\n    return L->ptr.hp;\n}\n\nint main() {\n    // 构建广义表 B = (a, (b, c))\n    GLNode *a = createAtom(\'a\');\n    GLNode *b = createAtom(\'b\');\n    GLNode *c = createAtom(\'c\');\n    GLNode *bc = createSublist(b, createSublist(c, NULL));\n    GLNode *B = createSublist(a, createSublist(bc, NULL));\n    printf("广义表B构造完成\\n");\n    GLNode *h = head(B);\n    printf("Head(B) = %c\\n", h->atom);\n    return 0;\n}',
};