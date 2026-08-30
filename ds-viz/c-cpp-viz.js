/* ═══════════════════════════════════════════════════════════════
   C/C++ 交互式可视化引擎 — c-cpp-viz.js
   覆盖 C语言10章 + C++12章 核心知识点
   ═══════════════════════════════════════════════════════════════ */

const CCppVizEngine = {
  canvas: null, ctx: null, W: 0, H: 0, dpr: 1,
  steps: [], stepIdx: 0, animId: null, playing: false, speed: 3,
  currentKP: '', currentData: null,

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

  generateSteps(kpId, data) {
    this.currentKP = kpId; this.currentData = data || {};
    this.steps = []; this.stepIdx = 0;
    const fnKey = '_gen_' + kpId.replace(/-/g, '_');
    const fn = this[fnKey];
    if (fn) { fn.call(this); } else { this.steps = [{ type:'title', t:'演示准备中...', sub:kpId, info:'演示准备中...' }]; }
    this._updateProgress(); this.draw();
  },

  play() {
    if (this.playing) return; this.playing = true;
    const btn = document.getElementById('ccppPlayBtn');
    if (btn) btn.innerHTML = '⏸ 暂停';
    this._tick();
  },
  pause() {
    this.playing = false;
    if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }
    const btn = document.getElementById('ccppPlayBtn');
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
    const bar = document.getElementById('ccppProgressFill');
    const info = document.getElementById('ccppStepInfo');
    if (bar) bar.style.width = this.steps.length > 1 ? (this.stepIdx / (this.steps.length - 1) * 100) + '%' : '0%';
    if (info) {
      const s = this.steps[this.stepIdx];
      info.textContent = (s && s.info) ? s.info : ('步骤 ' + (this.stepIdx + 1) + '/' + this.steps.length);
    }
  },

  draw() {
    const step = this.steps[this.stepIdx];
    if (!step) return;
    const ctx = this.ctx, W = this.W, H = this.H;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
    const fn = this['_draw_' + step.type];
    if (fn) fn.call(this, ctx, W, H, step);
  },

  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x+r, y); ctx.arcTo(x+w, y, x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x, y+h, r); ctx.arcTo(x, y+h, x, y, r);
    ctx.arcTo(x, y, x+w, y, r); ctx.closePath();
  },

  _drawArrow(ctx, x1, y1, x2, y2, color) {
    ctx.strokeStyle = color || '#f59e0b'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    const ang = Math.atan2(y2-y1, x2-x1);
    ctx.beginPath(); ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 8*Math.cos(ang-0.4), y2 - 8*Math.sin(ang-0.4));
    ctx.lineTo(x2 - 8*Math.cos(ang+0.4), y2 - 8*Math.sin(ang+0.4));
    ctx.closePath(); ctx.fillStyle = color || '#f59e0b'; ctx.fill();
  },

  /* ═══════ 通用绘制函数 ═══════ */

  _draw_title(ctx, W, H, s) {
    ctx.fillStyle = s.color || '#0ea5e9';
    ctx.font = 'bold 22px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center'; ctx.fillText(s.t, W/2, H*0.35);
    if (s.sub) { ctx.fillStyle = '#94a3b8'; ctx.font = '14px "Microsoft YaHei", sans-serif'; ctx.fillText(s.sub, W/2, H*0.35+30); }
  },

  _draw_code(ctx, W, H, s) {
    const lines = s.lines || [];
    const bx = W*0.05, by = H*0.08, bw = W*0.9, bh = Math.max(lines.length*22+24, 60);
    ctx.fillStyle = '#1e293b'; this._roundRect(ctx, bx, by, bw, bh, 8); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1; ctx.stroke();
    lines.forEach((line, i) => {
      if (i === s.highlightLine) { ctx.fillStyle = 'rgba(245,158,11,0.15)'; ctx.fillRect(bx+4, by+6+i*22, bw-8, 20); }
      ctx.fillStyle = i === s.highlightLine ? '#fbbf24' : '#e2e8f0';
      ctx.font = '13px "JetBrains Mono", "Consolas", monospace';
      ctx.textAlign = 'left'; ctx.fillText(line, bx+12, by+18+i*22);
    });
    if (s.note) { ctx.fillStyle = '#94a3b8'; ctx.font = '12px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center'; ctx.fillText(s.note, W/2, by+bh+22); }
  },

  _draw_memory(ctx, W, H, s) {
    const blocks = s.blocks || [];
    const bx = W*0.08, bw = W*0.3, bh = 30, gap = 4;
    const startY = H*0.12;
    ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 13px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'left'; ctx.fillText(s.label || '内存', bx, startY-8);
    blocks.forEach((b, i) => {
      const y = startY + i*(bh+gap);
      const isHi = s.highlight === i;
      ctx.fillStyle = isHi ? (b.color||'#f59e0b') : '#1e293b';
      this._roundRect(ctx, bx, y, bw, bh, 4); ctx.fill();
      ctx.strokeStyle = isHi ? (b.color||'#f59e0b') : 'rgba(255,255,255,0.1)';
      ctx.lineWidth = isHi ? 2 : 1; ctx.stroke();
      ctx.fillStyle = isHi ? '#0f172a' : '#e2e8f0';
      ctx.font = '12px "JetBrains Mono", monospace'; ctx.textAlign = 'left';
      ctx.fillText(b.addr || ('0x'+(0x1000+i*4).toString(16)), bx+6, y+19);
      ctx.textAlign = 'right';
      ctx.fillText(b.val !== undefined ? String(b.val) : '?', bx+bw-6, y+19);
      if (b.name) {
        ctx.fillStyle = isHi ? '#0f172a' : '#94a3b8';
        ctx.font = '11px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'left';
        ctx.fillText(b.name, bx+bw+8, y+19);
      }
    });
    if (s.note) { ctx.fillStyle = '#f59e0b'; ctx.font = '12px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center'; ctx.fillText(s.note, W/2, H*0.92); }
  },

  _draw_pointer(ctx, W, H, s) {
    const sx = W*0.2, sy = H*0.35, dx = W*0.7, dy = H*0.35;
    ctx.fillStyle = '#1e293b'; this._roundRect(ctx, sx-50, sy-16, 100, 32, 6); ctx.fill();
    ctx.strokeStyle = '#0ea5e9'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#0ea5e9'; ctx.font = 'bold 13px "JetBrains Mono", monospace'; ctx.textAlign = 'center';
    ctx.fillText(s.srcLabel || 'ptr', sx, sy+5);
    this._drawArrow(ctx, sx+50, sy, dx-50, dy, '#f59e0b');
    ctx.fillStyle = '#1e293b'; this._roundRect(ctx, dx-50, dy-16, 100, 32, 6); ctx.fill();
    ctx.strokeStyle = '#34d399'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#34d399'; ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillText(s.dstLabel || 'var', dx, dy+5);
    if (s.note) { ctx.fillStyle = '#94a3b8'; ctx.font = '12px "Microsoft YaHei", sans-serif'; ctx.fillText(s.note, W/2, H*0.7); }
  },

  _draw_array(ctx, W, H, s) {
    const arr = s.array || [];
    const n = arr.length;
    const bw = Math.min(60, (W*0.85)/Math.max(n,1)), bh = 40;
    const totalW = n*bw;
    const startX = (W-totalW)/2, startY = H*0.3;
    arr.forEach((v, i) => {
      const x = startX + i*bw;
      const isHi = s.highlight === i;
      ctx.fillStyle = isHi ? '#f59e0b' : '#1e293b';
      this._roundRect(ctx, x, startY, bw-2, bh, 4); ctx.fill();
      ctx.strokeStyle = isHi ? '#fbbf24' : 'rgba(255,255,255,0.15)'; ctx.lineWidth = isHi ? 2 : 1; ctx.stroke();
      ctx.fillStyle = isHi ? '#0f172a' : '#e2e8f0';
      ctx.font = 'bold 14px "JetBrains Mono", monospace'; ctx.textAlign = 'center';
      ctx.fillText(String(v), x+(bw-2)/2, startY+bh/2+5);
      ctx.fillStyle = '#64748b'; ctx.font = '10px "Microsoft YaHei", sans-serif';
      ctx.fillText('['+i+']', x+(bw-2)/2, startY+bh+14);
    });
    if (s.pointerIdx !== undefined) {
      const px = startX + s.pointerIdx*bw + (bw-2)/2;
      this._drawArrow(ctx, px, startY-20, px, startY-2, '#0ea5e9');
      ctx.fillStyle = '#0ea5e9'; ctx.font = '11px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(s.pointerLabel || 'ptr', px, startY-24);
    }
    if (s.note) { ctx.fillStyle = '#94a3b8'; ctx.font = '12px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center'; ctx.fillText(s.note, W/2, H*0.85); }
  },

  _draw_flow(ctx, W, H, s) {
    const nodes = (s.nodes || []).map(n => ({
      ...n,
      x: typeof n.x === 'number' ? n.x : (n.xStr ? eval(n.xStr.replace(/W/g, 'W').replace(/H/g, 'H')) : W*0.5),
      y: typeof n.y === 'number' ? n.y : (n.yStr ? eval(n.yStr.replace(/W/g, 'W').replace(/H/g, 'H')) : H*0.5),
    }));
    const edges = s.edges || [];
    edges.forEach(e => {
      const n1 = nodes[e[0]], n2 = nodes[e[1]];
      this._drawArrow(ctx, n1.x, n1.y+16, n2.x, n2.y-16, 'rgba(255,255,255,0.2)');
    });
    nodes.forEach((n, i) => {
      const isHi = s.highlight === i;
      ctx.fillStyle = isHi ? (n.color||'#0ea5e9') : '#1e293b';
      this._roundRect(ctx, n.x-60, n.y-16, 120, 32, 6); ctx.fill();
      ctx.strokeStyle = isHi ? '#fff' : 'rgba(255,255,255,0.15)'; ctx.lineWidth = isHi ? 2 : 1; ctx.stroke();
      ctx.fillStyle = isHi ? '#0f172a' : '#e2e8f0';
      ctx.font = '12px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(n.label, n.x, n.y+4);
    });
    if (s.note) { ctx.fillStyle = '#94a3b8'; ctx.font = '12px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center'; ctx.fillText(s.note, W/2, H*0.92); }
  },

  _draw_class(ctx, W, H, s) {
    const cls = s.cls || {};
    const bx = W*0.15, by = H*0.1, bw = W*0.7;
    const members = cls.members || [], methods = cls.methods || [];
    const totalH = 36 + members.length*20 + methods.length*20 + 12;
    ctx.fillStyle = '#1e293b'; this._roundRect(ctx, bx, by, bw, totalH, 8); ctx.fill();
    ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#8b5cf6'; ctx.fillRect(bx, by, bw, 32);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 14px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(cls.name || 'Class', bx+bw/2, by+21);
    let y = by + 42;
    members.forEach(m => {
      ctx.fillStyle = '#94a3b8'; ctx.font = '12px "JetBrains Mono", monospace'; ctx.textAlign = 'left';
      ctx.fillText((m.access||'+')+' '+m.type+' '+m.name, bx+12, y); y += 20;
    });
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.beginPath(); ctx.moveTo(bx+8, y); ctx.lineTo(bx+bw-8, y); ctx.stroke();
    y += 8;
    methods.forEach(m => {
      ctx.fillStyle = m.highlight ? '#fbbf24' : '#e2e8f0'; ctx.font = '12px "JetBrains Mono", monospace'; ctx.textAlign = 'left';
      ctx.fillText((m.access||'+')+' '+m.sig, bx+12, y); y += 20;
    });
    if (s.note) { ctx.fillStyle = '#94a3b8'; ctx.font = '12px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center'; ctx.fillText(s.note, W/2, by+totalH+22); }
  },

  _draw_inherit(ctx, W, H, s) {
    const nodes = (s.nodes || []).map(n => ({
      ...n,
      x: typeof n.x === 'number' ? n.x : (n.xStr ? eval(n.xStr) : W*0.5),
      y: typeof n.y === 'number' ? n.y : (n.yStr ? eval(n.yStr) : H*0.5),
    }));
    const links = s.links || [];
    links.forEach(l => {
      const p = nodes[l[0]], c = nodes[l[1]];
      ctx.strokeStyle = 'rgba(139,92,246,0.4)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(p.x, p.y+16); ctx.lineTo(c.x, c.y-16); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(c.x-6, c.y-16); ctx.lineTo(c.x, c.y-10); ctx.lineTo(c.x+6, c.y-16);
      ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 1.5; ctx.stroke();
    });
    nodes.forEach((n, i) => {
      const isHi = s.highlight === i;
      ctx.fillStyle = isHi ? '#8b5cf6' : (n.abstract ? '#1e1b4b' : '#1e293b');
      this._roundRect(ctx, n.x-70, n.y-16, 140, 32, 6); ctx.fill();
      ctx.strokeStyle = isHi ? '#fff' : '#8b5cf6'; ctx.lineWidth = isHi ? 2 : 1; ctx.stroke();
      ctx.fillStyle = isHi ? '#fff' : '#e2e8f0';
      ctx.font = (n.abstract?'italic ':'')+'12px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(n.name, n.x, n.y+4);
    });
    if (s.note) { ctx.fillStyle = '#94a3b8'; ctx.font = '12px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center'; ctx.fillText(s.note, W/2, H*0.92); }
  },

  _draw_vtable(ctx, W, H, s) {
    const entries = s.entries || [];
    const bx = W*0.2, by = H*0.1, bw = W*0.6, bh = 26, gap = 3;
    ctx.fillStyle = '#8b5cf6'; ctx.font = 'bold 13px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('vtable (' + (s.className||'') + ')', bx, by-6);
    entries.forEach((e, i) => {
      const y = by + i*(bh+gap);
      const isHi = s.highlight === i;
      ctx.fillStyle = isHi ? '#8b5cf6' : '#1e293b';
      this._roundRect(ctx, bx, y, bw, bh, 4); ctx.fill();
      ctx.strokeStyle = isHi ? '#fff' : 'rgba(255,255,255,0.1)'; ctx.lineWidth = isHi ? 2 : 1; ctx.stroke();
      ctx.fillStyle = isHi ? '#fff' : '#e2e8f0';
      ctx.font = '12px "JetBrains Mono", monospace'; ctx.textAlign = 'left';
      ctx.fillText(e.sig || e.name, bx+8, y+17);
      if (e.impl) { ctx.fillStyle = isHi ? '#fef3c7' : '#64748b'; ctx.textAlign = 'right'; ctx.fillText('-> ' + e.impl, bx+bw-8, y+17); }
    });
    if (s.note) { ctx.fillStyle = '#94a3b8'; ctx.font = '12px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center'; ctx.fillText(s.note, W/2, H*0.9); }
  },

  _draw_compare(ctx, W, H, s) {
    const left = s.left || {}, right = s.right || {};
    const items = s.items || [];
    const colW = W*0.42, bx1 = W*0.04, bx2 = W*0.54;
    const startY = H*0.15, rowH = Math.min(28, (H*0.7)/Math.max(items.length+1,1));
    ctx.fillStyle = left.color || '#0ea5e9'; this._roundRect(ctx, bx1, startY, colW, rowH, 4); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 13px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(left.title || 'C', bx1+colW/2, startY+rowH/2+5);
    ctx.fillStyle = right.color || '#8b5cf6'; this._roundRect(ctx, bx2, startY, colW, rowH, 4); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.fillText(right.title || 'C++', bx2+colW/2, startY+rowH/2+5);
    items.forEach((it, i) => {
      const y = startY + (i+1)*rowH;
      ctx.fillStyle = i%2 ? 'rgba(255,255,255,0.02)' : 'transparent';
      ctx.fillRect(bx1, y, W*0.92, rowH);
      ctx.fillStyle = '#e2e8f0'; ctx.font = '12px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(it.left || '-', bx1+colW/2, y+rowH/2+4);
      ctx.fillText(it.right || '-', bx2+colW/2, y+rowH/2+4);
    });
    if (s.note) { ctx.fillStyle = '#94a3b8'; ctx.font = '12px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center'; ctx.fillText(s.note, W/2, H*0.92); }
  },

  _draw_list(ctx, W, H, s) {
    const nodes = s.nodes || [];
    const n = nodes.length;
    const nw = 70, nh = 36, gap = 30;
    const totalW = n*nw + (n-1)*gap;
    const startX = (W-totalW)/2, startY = H*0.3;
    nodes.forEach((node, i) => {
      const x = startX + i*(nw+gap);
      const isHi = s.highlight === i;
      ctx.fillStyle = isHi ? '#0ea5e9' : '#1e293b';
      this._roundRect(ctx, x, startY, nw, nh, 4); ctx.fill();
      ctx.strokeStyle = isHi ? '#fff' : 'rgba(255,255,255,0.15)'; ctx.lineWidth = isHi ? 2 : 1; ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.beginPath(); ctx.moveTo(x+nw-16, startY); ctx.lineTo(x+nw-16, startY+nh); ctx.stroke();
      ctx.fillStyle = isHi ? '#0f172a' : '#e2e8f0'; ctx.font = 'bold 13px "JetBrains Mono", monospace'; ctx.textAlign = 'center';
      ctx.fillText(String(node.val), x+(nw-16)/2, startY+nh/2+5);
      if (i < n-1) { this._drawArrow(ctx, x+nw-4, startY+nh/2, x+nw+gap-4, startY+nh/2, '#0ea5e9'); }
    });
    if (s.note) { ctx.fillStyle = '#94a3b8'; ctx.font = '12px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center'; ctx.fillText(s.note, W/2, H*0.8); }
  },

  _draw_stack(ctx, W, H, s) {
    const frames = s.frames || [];
    const bx = W*0.15, bw = W*0.7, bh = 30, gap = 2;
    const startY = H*0.1;
    ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 12px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('调用栈', bx, startY-6);
    frames.forEach((f, i) => {
      const y = startY + i*(bh+gap);
      const isHi = s.highlight === i;
      ctx.fillStyle = isHi ? (f.color||'#0ea5e9') : '#1e293b';
      this._roundRect(ctx, bx, y, bw, bh, 4); ctx.fill();
      ctx.strokeStyle = isHi ? '#fff' : 'rgba(255,255,255,0.1)'; ctx.lineWidth = isHi ? 2 : 1; ctx.stroke();
      ctx.fillStyle = isHi ? '#0f172a' : '#e2e8f0'; ctx.font = '12px "JetBrains Mono", monospace'; ctx.textAlign = 'left';
      ctx.fillText(f.name + '(' + (f.args||'') + ')', bx+8, y+bh/2+4);
      if (f.ret !== undefined) { ctx.fillStyle = isHi ? '#0f172a' : '#34d399'; ctx.textAlign = 'right'; ctx.fillText('-> '+f.ret, bx+bw-8, y+bh/2+4); }
    });
    if (s.note) { ctx.fillStyle = '#f59e0b'; ctx.font = '12px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center'; ctx.fillText(s.note, W/2, H*0.9); }
  },

  _draw_smartptr(ctx, W, H, s) {
    const boxes = s.boxes || [];
    const refs = s.refs || 0;
    boxes.forEach((b, i) => {
      const isHi = s.highlight === i;
      const x = b.x !== undefined ? b.x : (i===0 ? W*0.15 : (i===1 ? W*0.15 : W*0.6));
      const y = b.y !== undefined ? b.y : (i<2 ? H*0.25+i*60 : H*0.4);
      const w = b.w || 120, h = b.h || 40;
      ctx.fillStyle = isHi ? (b.color||'#8b5cf6') : '#1e293b';
      this._roundRect(ctx, x, y, w, h, 6); ctx.fill();
      ctx.strokeStyle = isHi ? '#fff' : 'rgba(255,255,255,0.15)'; ctx.lineWidth = isHi ? 2 : 1; ctx.stroke();
      ctx.fillStyle = isHi ? '#fff' : '#e2e8f0'; ctx.font = 'bold 13px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(b.label, x+w/2, y+h/2+5);
      if (b.sub) { ctx.fillStyle = isHi ? '#fef3c7' : '#64748b'; ctx.font = '11px "Microsoft YaHei", sans-serif'; ctx.fillText(b.sub, x+w/2, y+h+16); }
    });
    s.arrows && s.arrows.forEach(a => { this._drawArrow(ctx, a.x1, a.y1, a.x2, a.y2, a.color||'#f59e0b'); });
    if (refs > 0) { ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 16px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center'; ctx.fillText('ref_count = ' + refs, W/2, H*0.15); }
    if (s.note) { ctx.fillStyle = '#94a3b8'; ctx.font = '12px "Microsoft YaHei", sans-serif'; ctx.textAlign = 'center'; ctx.fillText(s.note, W/2, H*0.9); }
  },

  /* ══════════════════════════════════════════════════════
     C 语言知识点生成器
     ══════════════════════════════════════════════════════ */

  _gen_c_data_types() {
    const types = [
      {name:'char', size:1, range:'-128~127', color:'#ef4444'},
      {name:'short', size:2, range:'-32768~32767', color:'#f59e0b'},
      {name:'int', size:4, range:'-2^31~2^31-1', color:'#0ea5e9'},
      {name:'float', size:4, range:'7位有效数字', color:'#10b981'},
      {name:'double', size:8, range:'15位有效数字', color:'#8b5cf6'},
    ];
    this.steps = [
      { type:'title', t:'C语言基本数据类型', sub:'不同类型占用不同内存大小', color:'#0ea5e9', info:'数据类型概览' },
      { type:'code', lines:['char c = \'A\';','short s = 32767;','int i = 42;','float f = 3.14f;','double d = 3.14159265;'], note:'每种类型占用的内存大小不同', info:'变量声明示例' },
    ];
    types.forEach((t) => {
      this.steps.push({ type:'memory', label:t.name+' ('+t.size+'字节)', blocks:[{addr:'0x1000', val:t.size+'B', name:'sizeof('+t.name+')', color:t.color}], highlight:0, note:t.name+': '+t.range+', 占'+t.size+'字节', info:t.name+' 类型' });
    });
    this.steps.push({ type:'code', lines:['// sizeof 运算符','printf("%d", sizeof(int));  // 4','printf("%d", sizeof(char)); // 1'], highlightLine:1, note:'用 sizeof 获取类型大小', info:'sizeof 运算符' });
  },

  _gen_c_variables() {
    this.steps = [
      { type:'title', t:'变量与常量', sub:'变量声明 · 初始化 · const · #define', color:'#0ea5e9', info:'变量与常量' },
      { type:'code', lines:['int age = 20;','float pi = 3.14f;','char grade = \'A\';','// 变量 = 类型 + 名字 + 值'], highlightLine:0, note:'变量声明: 类型 变量名 = 初始值;', info:'变量声明' },
      { type:'memory', label:'变量内存布局', blocks:[
        {addr:'0x1000', val:'20', name:'age (int)', color:'#0ea5e9'},
        {addr:'0x1004', val:'3.14', name:'pi (float)', color:'#10b981'},
        {addr:'0x1008', val:'A', name:'grade (char)', color:'#ef4444'},
      ], highlight:0, note:'每个变量在内存中有固定地址和大小', info:'内存布局' },
      { type:'code', lines:['// const 常量','const double PI = 3.14159;','PI = 3.0; // 错误! 不可修改'], highlightLine:2, note:'const 修饰的变量不可修改', info:'const 常量' },
      { type:'code', lines:['// #define 宏常量','#define MAX_SIZE 100','#define PI 3.14159','int arr[MAX_SIZE];'], highlightLine:0, note:'#define 在预处理阶段替换文本', info:'#define 宏' },
      { type:'compare', left:{title:'const', color:'#0ea5e9'}, right:{title:'#define', color:'#f59e0b'}, items:[
        {left:'有类型检查', right:'无类型检查'},
        {left:'占内存空间', right:'不占内存(文本替换)'},
        {left:'调试可见', right:'调试不可见'},
        {left:'作用域限制', right:'全局替换'},
      ], note:'推荐使用 const 而非 #define', info:'const vs #define' },
    ];
  },

  _gen_c_operators() {
    this.steps = [
      { type:'title', t:'运算符与表达式', sub:'算术 · 关系 · 逻辑 · 位运算', color:'#0ea5e9', info:'运算符概览' },
      { type:'code', lines:['int a = 10, b = 3;','a + b  // 13','a - b  // 7','a * b  // 30','a / b  // 3 (整数除法)','a % b  // 1 (取模)'], highlightLine:4, note:'整数除法截断小数部分', info:'算术运算符' },
      { type:'code', lines:['// 关系运算符','a > b   // 1 (true)','a == b  // 0 (false)','a != b  // 1 (true)'], highlightLine:0, note:'关系运算结果: 1(true) 或 0(false)', info:'关系运算符' },
      { type:'code', lines:['// 逻辑运算符','(a > 0) && (b > 0)  // 1','(a < 0) || (b > 0)  // 1','!(a == b)            // 1'], highlightLine:0, note:'&& 且, || 或, ! 非', info:'逻辑运算符' },
      { type:'code', lines:['// 位运算符','  0b1100 & 0b1010  // 0b1000','  0b1100 | 0b1010  // 0b1110','  0b1100 ^ 0b1010  // 0b0110','  ~0b1100           // 0b...0011','  0b0001 << 3      // 0b1000'], highlightLine:0, note:'位运算直接操作二进制位', info:'位运算符' },
    ];
  },

  _gen_c_control_flow() {
    const W = this.W, H = this.H;
    this.steps = [
      { type:'title', t:'控制流程', sub:'if-else · for · while · switch', color:'#0ea5e9', info:'控制流程' },
      { type:'flow', nodes:[
        {x:W*0.5, y:H*0.15, label:'开始', color:'#34d399'},
        {x:W*0.5, y:H*0.35, label:'条件判断', color:'#f59e0b'},
        {x:W*0.25, y:H*0.55, label:'语句块A', color:'#0ea5e9'},
        {x:W*0.75, y:H*0.55, label:'语句块B', color:'#8b5cf6'},
        {x:W*0.5, y:H*0.75, label:'结束', color:'#34d399'},
      ], edges:[[0,1],[1,2],[1,3],[2,4],[3,4]], highlight:1, note:'if-else: 条件为真走A, 否则走B', info:'if-else 流程' },
      { type:'code', lines:['if (score >= 90) {','    grade = \'A\';','} else if (score >= 60) {','    grade = \'B\';','} else {','    grade = \'F\';','}'], highlightLine:0, note:'if-else if-else 链', info:'if-else 语法' },
      { type:'flow', nodes:[
        {x:W*0.5, y:H*0.12, label:'初始化 i=0', color:'#34d399'},
        {x:W*0.5, y:H*0.3, label:'i < n?', color:'#f59e0b'},
        {x:W*0.5, y:H*0.48, label:'循环体', color:'#0ea5e9'},
        {x:W*0.5, y:H*0.66, label:'i++', color:'#8b5cf6'},
        {x:W*0.5, y:H*0.84, label:'结束', color:'#34d399'},
      ], edges:[[0,1],[1,2],[2,3],[3,1],[1,4]], highlight:1, note:'for循环: 初始化->条件->循环体->更新->条件...', info:'for 循环流程' },
      { type:'code', lines:['for (int i = 0; i < 5; i++) {','    printf("%d ", i);','}','// 输出: 0 1 2 3 4'], highlightLine:0, note:'for (初始化; 条件; 更新)', info:'for 循环语法' },
      { type:'code', lines:['// switch-case','switch (day) {','  case 1: printf("周一"); break;','  case 2: printf("周二"); break;','  default: printf("其他");','}'], highlightLine:2, note:'break 跳出 switch, 否则继续执行', info:'switch-case' },
    ];
  },

  _gen_c_functions() {
    this.steps = [
      { type:'title', t:'函数与调用栈', sub:'值传递 · 栈帧 · 返回值', color:'#0ea5e9', info:'函数基础' },
      { type:'code', lines:['int add(int a, int b) {','    return a + b;','}','','int main() {','    int result = add(3, 5);','    return 0;','}'], highlightLine:0, note:'函数定义: 返回类型 函数名(参数列表)', info:'函数定义' },
      { type:'code', lines:['int main() {','    int result = add(3, 5);','    //        ↑ 值传递','    //  3和5被复制到add的栈帧','    return 0;','}'], highlightLine:1, note:'值传递: 实参的值被复制给形参', info:'值传递' },
      { type:'stack', frames:[{name:'main', args:'result=add(3,5)', color:'#0ea5e9'}], highlight:0, note:'main 函数的栈帧', info:'main 栈帧' },
      { type:'stack', frames:[{name:'main', args:'result=?', color:'#0ea5e9'},{name:'add', args:'a=3, b=5', color:'#f59e0b'}], highlight:1, note:'调用 add(3,5): 新栈帧压入栈顶', info:'压入 add 栈帧' },
      { type:'stack', frames:[{name:'main', args:'result=8', color:'#0ea5e9'},{name:'add', args:'a=3, b=5', ret:'8', color:'#f59e0b'}], highlight:1, note:'add 执行完毕, return 8', info:'add 返回' },
      { type:'stack', frames:[{name:'main', args:'result=8', color:'#0ea5e9'}], highlight:0, note:'add 栈帧弹出, result = 8', info:'栈帧弹出' },
    ];
  },

  _gen_c_recursion() {
    this.steps = [
      { type:'title', t:'递归函数', sub:'阶乘 factorial(n) = n * (n-1)!', color:'#0ea5e9', info:'递归概念' },
      { type:'code', lines:['int factorial(int n) {','    if (n <= 1) return 1;  // 基线条件','    return n * factorial(n - 1);','}','','// factorial(4) = 4*3*2*1 = 24'], highlightLine:2, note:'递归: 函数调用自身', info:'递归定义' },
      { type:'stack', frames:[{name:'main', args:'factorial(4)', color:'#0ea5e9'}], highlight:0, note:'调用 factorial(4)', info:'调用 factorial(4)' },
      { type:'stack', frames:[{name:'main', color:'#0ea5e9'},{name:'factorial(4)', args:'n=4', color:'#f59e0b'}], highlight:1, note:'4 > 1, 调用 factorial(3)', info:'factorial(4) 调用 factorial(3)' },
      { type:'stack', frames:[
        {name:'main', color:'#0ea5e9'},
        {name:'fact(4)', args:'n=4', color:'#f59e0b'},
        {name:'fact(3)', args:'n=3', color:'#f59e0b'},
        {name:'fact(2)', args:'n=2', color:'#f59e0b'},
        {name:'fact(1)', args:'n=1', color:'#34d399'},
      ], highlight:4, note:'n=1: 基线条件, return 1', info:'到达基线条件' },
      { type:'stack', frames:[
        {name:'main', color:'#0ea5e9'},
        {name:'fact(4)', args:'n=4', color:'#f59e0b'},
        {name:'fact(3)', args:'n=3', ret:'6', color:'#34d399'},
      ], highlight:2, note:'fact(2)=2*1=2, fact(3)=3*2=6', info:'回溯阶段' },
      { type:'stack', frames:[{name:'main', args:'result=24', color:'#34d399'}], highlight:0, note:'fact(4)=4*6=24, 递归完成', info:'递归完成' },
    ];
  },

  _gen_c_arrays() {
    this.steps = [
      { type:'title', t:'数组的内存布局', sub:'连续存储 · 下标访问 · 越界危险', color:'#0ea5e9', info:'数组基础' },
      { type:'code', lines:['int arr[5] = {10, 20, 30, 40, 50};','//  arr[0]  arr[1]  arr[2]  arr[3]  arr[4]','//   10      20      30      40      50'], highlightLine:0, note:'数组在内存中连续存储', info:'数组声明' },
      { type:'array', array:[10,20,30,40,50], highlight:0, note:'arr[0] = 10, 每个元素占4字节(int)', info:'下标访问' },
      { type:'array', array:[10,20,30,40,50], highlight:2, pointerIdx:2, pointerLabel:'ptr', note:'下标访问: arr[2] = 30', info:'arr[2] = 30' },
      { type:'memory', label:'内存地址', blocks:[
        {addr:'0x1000', val:'10', name:'arr[0]', color:'#0ea5e9'},
        {addr:'0x1004', val:'20', name:'arr[1]', color:'#0ea5e9'},
        {addr:'0x1008', val:'30', name:'arr[2]', color:'#0ea5e9'},
        {addr:'0x100c', val:'40', name:'arr[3]', color:'#0ea5e9'},
        {addr:'0x1010', val:'50', name:'arr[4]', color:'#0ea5e9'},
      ], highlight:2, note:'地址连续, 每个int占4字节', info:'内存地址' },
    ];
  },

  _gen_c_pointers() {
    this.steps = [
      { type:'title', t:'指针基础', sub:'取址 & · 解引用 * · 指针变量', color:'#0ea5e9', info:'指针概念' },
      { type:'code', lines:['int x = 42;','int *p = &x;  // p 存储x的地址','','printf("%d", *p);  // 42  解引用','printf("%p", p);   // 0x1000  地址'], highlightLine:1, note:'& 取地址, * 解引用(取值)', info:'指针基础语法' },
      { type:'pointer', srcLabel:'p (int*)', dstLabel:'x = 42', note:'p 指向 x 的内存地址', info:'指针指向' },
      { type:'memory', label:'内存', blocks:[
        {addr:'0x1000', val:'42', name:'x (int)', color:'#34d399'},
        {addr:'0x2000', val:'0x1000', name:'p (int*)', color:'#0ea5e9'},
      ], highlight:1, note:'p 的值是 x 的地址 0x1000', info:'指针的内存表示' },
      { type:'code', lines:['*p = 100;  // 通过指针修改x的值','printf("%d", x);  // 100'], highlightLine:0, note:'*p = 100 等价于 x = 100', info:'通过指针修改变量' },
      { type:'memory', label:'修改后的内存', blocks:[
        {addr:'0x1000', val:'100', name:'x (int)', color:'#ef4444'},
        {addr:'0x2000', val:'0x1000', name:'p (int*)', color:'#0ea5e9'},
      ], highlight:0, note:'通过 *p 修改了 x 的值', info:'修改后的内存' },
      { type:'code', lines:['// 指针的大小','sizeof(int*)   // 4 或 8','sizeof(char*)  // 4 或 8','// 32位系统: 4字节, 64位系统: 8字节','// 所有指针大小相同(存储地址)'], highlightLine:3, note:'所有指针大小相同(存储地址)', info:'指针大小' },
    ];
  },

  _gen_c_ptr_array() {
    this.steps = [
      { type:'title', t:'指针与数组', sub:'数组名即指针 · 指针算术', color:'#0ea5e9', info:'指针与数组' },
      { type:'code', lines:['int arr[5] = {10, 20, 30, 40, 50};','int *p = arr;  // 数组名 = 首元素地址','','*p        // 10  (= arr[0])','*(p+1)    // 20  (= arr[1])','*(p+2)    // 30  (= arr[2])'], highlightLine:1, note:'数组名就是指向首元素的指针', info:'数组名即指针' },
      { type:'array', array:[10,20,30,40,50], pointerIdx:0, pointerLabel:'p', highlight:0, note:'p 指向 arr[0]', info:'p -> arr[0]' },
      { type:'array', array:[10,20,30,40,50], pointerIdx:1, pointerLabel:'p+1', highlight:1, note:'p+1 指向 arr[1] (地址+sizeof(int))', info:'p+1 -> arr[1]' },
      { type:'array', array:[10,20,30,40,50], pointerIdx:2, pointerLabel:'p+2', highlight:2, note:'p+2 指向 arr[2]', info:'p+2 -> arr[2]' },
      { type:'code', lines:['// 指针遍历数组','int *p = arr;','for (int i = 0; i < 5; i++) {','    printf("%d ", *p);','    p++;  // 移动到下一个元素','}','// 输出: 10 20 30 40 50'], highlightLine:4, note:'p++ 每次移动 sizeof(int) 字节', info:'指针遍历数组' },
      { type:'compare', left:{title:'arr[i]', color:'#0ea5e9'}, right:{title:'*(p+i)', color:'#f59e0b'}, items:[
        {left:'下标访问', right:'指针访问'},
        {left:'编译器转为*(arr+i)', right:'直接地址计算'},
        {left:'arr 不可自增', right:'p 可以自增'},
        {left:'效率相同', right:'效率相同'},
      ], note:'arr[i] 和 *(p+i) 完全等价', info:'下标 vs 指针' },
    ];
  },

  _gen_c_structs() {
    this.steps = [
      { type:'title', t:'结构体', sub:'自定义类型 · 内存布局', color:'#0ea5e9', info:'结构体概念' },
      { type:'code', lines:['struct Student {','    int id;        // 4字节','    char name[20]; // 20字节','    float score;   // 4字节','};','','struct Student s1 = {1, "张三", 95.5};'], highlightLine:0, note:'struct 把多个变量打包在一起', info:'struct 定义' },
      { type:'memory', label:'struct Student 内存布局', blocks:[
        {addr:'0x1000', val:'1', name:'id (int, 4B)', color:'#0ea5e9'},
        {addr:'0x1004', val:'张三', name:'name (char[20], 20B)', color:'#f59e0b'},
        {addr:'0x1018', val:'95.5', name:'score (float, 4B)', color:'#10b981'},
      ], highlight:0, note:'成员在内存中按声明顺序排列', info:'结构体内存布局' },
      { type:'code', lines:['// 成员访问','s1.id       // 1','s1.name     // 张三','s1.score    // 95.5','','// 指针访问用 ->','struct Student *p = &s1;','p->id       // 1','p->score    // 95.5'], highlightLine:6, note:'. 用于变量, -> 用于指针', info:'成员访问' },
      { type:'code', lines:['// 联合体 union','union Data {','    int i;','    float f;','    char str[4];','};','// 所有成员共享同一块内存','// 同一时刻只能存一个值'], highlightLine:0, note:'union: 所有成员共享同一块内存', info:'联合体 union' },
    ];
  },

  _gen_c_linked_list() {
    this.steps = [
      { type:'title', t:'单链表', sub:'节点 · 指针连接 · 动态创建', color:'#0ea5e9', info:'链表概念' },
      { type:'code', lines:['struct Node {','    int data;','    struct Node *next;','};','','// 创建节点','struct Node *n1 = malloc(sizeof(Node));','n1->data = 10;','n1->next = NULL;'], highlightLine:0, note:'每个节点包含数据和指向下一个节点的指针', info:'节点定义' },
      { type:'list', nodes:[{val:10}], highlight:0, note:'创建第一个节点', info:'创建第一个节点' },
      { type:'list', nodes:[{val:10},{val:20}], highlight:1, note:'创建第二个节点并连接', info:'连接第二个节点' },
      { type:'list', nodes:[{val:10},{val:20},{val:30}], highlight:2, note:'继续添加节点', info:'添加第三个节点' },
      { type:'code', lines:['// 遍历链表','struct Node *p = head;','while (p != NULL) {','    printf("%d ", p->data);','    p = p->next;','}','// 输出: 10 20 30'], highlightLine:4, note:'p = p->next 移动到下一个节点', info:'遍历链表' },
      { type:'list', nodes:[{val:10},{val:20},{val:30}], highlight:0, note:'从头节点开始遍历', info:'遍历: 头节点' },
      { type:'list', nodes:[{val:10},{val:20},{val:30}], highlight:1, note:'p = p->next, 移动到第二个节点', info:'遍历: 第二个节点' },
      { type:'list', nodes:[{val:10},{val:20},{val:30}], highlight:2, note:'到达尾节点, next=NULL, 遍历结束', info:'遍历: 尾节点' },
    ];
  },

  _gen_c_memory() {
    this.steps = [
      { type:'title', t:'动态内存管理', sub:'malloc · calloc · realloc · free', color:'#0ea5e9', info:'动态内存' },
      { type:'code', lines:['// malloc: 分配内存(不初始化)','int *arr = malloc(5 * sizeof(int));','','// calloc: 分配并清零','int *arr2 = calloc(5, sizeof(int));','','// realloc: 调整大小','arr = realloc(arr, 10 * sizeof(int));','','// free: 释放内存','free(arr);'], highlightLine:0, note:'malloc 分配内存但不初始化', info:'malloc/calloc/realloc/free' },
      { type:'memory', label:'堆内存 (malloc后)', blocks:[
        {addr:'0x5000', val:'?', name:'arr[0]', color:'#f59e0b'},
        {addr:'0x5004', val:'?', name:'arr[1]', color:'#f59e0b'},
        {addr:'0x5008', val:'?', name:'arr[2]', color:'#f59e0b'},
        {addr:'0x500c', val:'?', name:'arr[3]', color:'#f59e0b'},
        {addr:'0x5010', val:'?', name:'arr[4]', color:'#f59e0b'},
      ], note:'malloc 分配的内存值不确定', info:'malloc: 值不确定' },
      { type:'memory', label:'堆内存 (calloc后)', blocks:[
        {addr:'0x5000', val:'0', name:'arr2[0]', color:'#10b981'},
        {addr:'0x5004', val:'0', name:'arr2[1]', color:'#10b981'},
        {addr:'0x5008', val:'0', name:'arr2[2]', color:'#10b981'},
        {addr:'0x500c', val:'0', name:'arr2[3]', color:'#10b981'},
        {addr:'0x5010', val:'0', name:'arr2[4]', color:'#10b981'},
      ], note:'calloc 分配的内存全部清零', info:'calloc: 全部清零' },
      { type:'code', lines:['// 内存泄漏!','int *p = malloc(100);','p = malloc(200);  // 丢失了第一个块的地址','// 第一个100字节永远无法free'], highlightLine:1, note:'内存泄漏: 丢失了已分配内存的地址', info:'内存泄漏!' },
      { type:'code', lines:['// 正确做法','int *p = malloc(100);','// ... 使用p ...','free(p);       // 先释放','p = malloc(200); // 再重新分配','// 或者: p = realloc(p, 200);'], highlightLine:3, note:'先 free 旧内存, 再分配新内存', info:'正确做法' },
    ];
  },

  _gen_c_strings() {
    this.steps = [
      { type:'title', t:'字符数组与字符串', sub:'C语言字符串 = char数组 + \\0', color:'#0ea5e9', info:'字符串概念' },
      { type:'code', lines:['char str[] = "Hello";','// 等价于:','// char str[] = {\'H\',\'e\',\'l\',\'l\',\'o\',\'\\0\'};','// sizeof(str) = 6 (含\\0)','// strlen(str) = 5 (不含\\0)'], highlightLine:0, note:'C字符串以 \\0 结尾', info:'字符串定义' },
      { type:'memory', label:'字符串内存', blocks:[
        {addr:'0x1000', val:'H', name:'str[0]', color:'#0ea5e9'},
        {addr:'0x1001', val:'e', name:'str[1]', color:'#0ea5e9'},
        {addr:'0x1002', val:'l', name:'str[2]', color:'#0ea5e9'},
        {addr:'0x1003', val:'l', name:'str[3]', color:'#0ea5e9'},
        {addr:'0x1004', val:'o', name:'str[4]', color:'#0ea5e9'},
        {addr:'0x1005', val:'\\0', name:'str[5]', color:'#ef4444'},
      ], highlight:5, note:'\\0 是字符串结束标志', info:'内存中的字符串' },
      { type:'code', lines:['// 常用字符串函数','strlen(str)   // 长度 5','strcpy(a, b)  // 把b复制到a','strcat(a, b)  // 把b拼接到a后面','strcmp(a, b)  // 比较: 0相等, >0前大, <0前小'], highlightLine:0, note:'string.h 中的常用函数', info:'字符串函数' },
    ];
  },

  /* ══════════════════════════════════════════════════════
     C++ 知识点生成器
     ══════════════════════════════════════════════════════ */

  _gen_cpp_reference() {
    this.steps = [
      { type:'title', t:'引用 (Reference)', sub:'变量的别名 · 必须初始化 · 不可重绑定', color:'#8b5cf6', info:'引用概念' },
      { type:'code', lines:['int x = 42;','int &r = x;  // r 是 x 的别名','','r = 100;','// x 现在也是 100','// r 和 x 是同一个变量'], highlightLine:1, note:'引用是已存在变量的别名', info:'引用定义' },
      { type:'memory', label:'引用的内存', blocks:[
        {addr:'0x1000', val:'42', name:'x / r (同一变量)', color:'#8b5cf6'},
      ], note:'引用不占用额外内存, r 和 x 指向同一地址', info:'引用的内存' },
      { type:'compare', left:{title:'引用 &', color:'#8b5cf6'}, right:{title:'指针 *', color:'#0ea5e9'}, items:[
        {left:'必须初始化', right:'可以不初始化'},
        {left:'不可为空', right:'可以为 NULL'},
        {left:'不可重绑定', right:'可以改变指向'},
        {left:'更安全', right:'更灵活'},
        {left:'使用像普通变量', right:'需要 * 和 &'},
      ], note:'引用比指针更安全, 适合函数参数传递', info:'引用 vs 指针' },
      { type:'code', lines:['// 引用传参 (避免拷贝)','void swap(int &a, int &b) {','    int t = a; a = b; b = t;','}','','int x=1, y=2;','swap(x, y);  // x=2, y=1'], highlightLine:0, note:'引用传参: 直接操作原变量', info:'引用传参' },
    ];
  },

  _gen_cpp_overload() {
    this.steps = [
      { type:'title', t:'函数重载', sub:'同名不同参 · 编译器自动选择', color:'#8b5cf6', info:'函数重载' },
      { type:'code', lines:['int abs(int x) {','    return x < 0 ? -x : x;','}','double abs(double x) {','    return x < 0 ? -x : x;','}','','abs(-5);     // 调用 int 版本','abs(-3.14);  // 调用 double 版本'], highlightLine:0, note:'同名函数, 参数类型/个数不同', info:'重载示例' },
      { type:'code', lines:['// 重载解析规则','// 1. 精确匹配 > 类型转换 > 模板','','void f(int x);','void f(double x);','','f(42);   // 精确匹配 f(int)','f(3.14); // 精确匹配 f(double)','f(\'A\');  // char->int, 调用 f(int)'], highlightLine:4, note:'编译器根据参数类型选择最佳匹配', info:'重载解析' },
      { type:'code', lines:['// 默认参数','void greet(string name, string prefix = "Hello") {','    cout << prefix << ", " << name;','}','','greet("World");        // Hello, World','greet("World", "Hi");   // Hi, World'], highlightLine:0, note:'默认参数: 调用时可省略', info:'默认参数' },
    ];
  },

  _gen_cpp_class() {
    this.steps = [
      { type:'title', t:'类与对象', sub:'封装 · 成员变量 · 成员函数', color:'#8b5cf6', info:'类与对象' },
      { type:'code', lines:['class Student {','private:','    int id;','    string name;','public:','    void setId(int i) { id = i; }','    int getId() { return id; }','};'], highlightLine:0, note:'class: 把数据和操作封装在一起', info:'class 定义' },
      { type:'class', cls:{name:'Student', members:[
        {access:'-', type:'int', name:'id'},
        {access:'-', type:'string', name:'name'},
      ], methods:[
        {access:'+', sig:'void setId(int)'},
        {access:'+', sig:'int getId()'},
      ]}, note:'private 私有成员, public 公开接口', info:'UML 类图' },
      { type:'code', lines:['// 创建对象','Student s1;','s1.setId(1);','// s1.id = 1;  // 错误! id是private','','cout << s1.getId();  // 1'], highlightLine:1, note:'通过 public 方法访问 private 数据', info:'对象使用' },
      { type:'memory', label:'对象内存布局', blocks:[
        {addr:'0x1000', val:'1', name:'id (int)', color:'#8b5cf6'},
        {addr:'0x1004', val:'张三', name:'name (string)', color:'#8b5cf6'},
      ], note:'对象只存储成员变量, 成员函数共享', info:'对象内存' },
    ];
  },

  _gen_cpp_constructor() {
    this.steps = [
      { type:'title', t:'构造函数与析构函数', sub:'对象生命周期 · 自动调用', color:'#8b5cf6', info:'构造与析构' },
      { type:'code', lines:['class Student {','    int id;','public:','    // 构造函数','    Student(int i) : id(i) {','        cout << "构造 " << id;','    }','    // 析构函数','    ~Student() {','        cout << "析构 " << id;','    }','};'], highlightLine:4, note:'构造: 对象创建时自动调用', info:'构造/析构函数' },
      { type:'code', lines:['{','    Student s1(1);  // 构造 1','    Student s2(2);  // 构造 2','}  // 析构 2, 析构 1 (逆序)'], highlightLine:0, note:'析构: 对象销毁时自动调用(逆序)', info:'生命周期' },
      { type:'stack', frames:[{name:'s1(1)', args:'构造', color:'#34d399'}], highlight:0, note:'s1 先构造', info:'s1 构造' },
      { type:'stack', frames:[{name:'s1(1)', args:'已构造', color:'#34d399'},{name:'s2(2)', args:'构造', color:'#34d399'}], highlight:1, note:'s2 后构造', info:'s2 构造' },
      { type:'stack', frames:[{name:'s1(1)', args:'已构造', color:'#34d399'},{name:'s2(2)', args:'析构', ret:'~s2', color:'#ef4444'}], highlight:1, note:'离开作用域: s2 先析构', info:'s2 析构' },
      { type:'stack', frames:[{name:'s1(1)', args:'析构', ret:'~s1', color:'#ef4444'}], highlight:0, note:'s1 后析构 (构造的逆序)', info:'s1 析构' },
      { type:'code', lines:['// 拷贝构造函数','Student(const Student &other) {','    id = other.id;','    cout << "拷贝构造";','}','','Student s2 = s1;  // 调用拷贝构造'], highlightLine:0, note:'用已有对象初始化新对象', info:'拷贝构造' },
    ];
  },

  _gen_cpp_inheritance() {
    const W = this.W, H = this.H;
    this.steps = [
      { type:'title', t:'继承', sub:'代码复用 · is-a 关系 · 访问控制', color:'#8b5cf6', info:'继承概念' },
      { type:'code', lines:['class Animal {','protected:','    string name;','public:','    void eat() { cout << name << " eat"; }','};','','class Dog : public Animal {','public:','    void bark() { cout << name << " bark"; }','};'], highlightLine:7, note:'Dog 继承 Animal, 拥有其成员', info:'继承语法' },
      { type:'inherit', nodes:[
        {x:W*0.5, y:H*0.2, name:'Animal'},
        {x:W*0.25, y:H*0.6, name:'Dog'},
        {x:W*0.75, y:H*0.6, name:'Cat'},
      ], links:[[0,1],[0,2]], highlight:0, note:'Animal 是基类, Dog/Cat 是派生类', info:'继承层次' },
      { type:'class', cls:{name:'Animal', members:[
        {access:'#', type:'string', name:'name'},
      ], methods:[
        {access:'+', sig:'void eat()'},
      ]}, note:'protected: 子类可访问, 外部不可', info:'Animal 类' },
      { type:'class', cls:{name:'Dog : public Animal', members:[], methods:[
        {access:'+', sig:'void bark()'},
        {access:'+', sig:'void eat() // 继承自Animal', highlight:true},
      ]}, note:'Dog 自动拥有 Animal 的成员', info:'Dog 类' },
      { type:'code', lines:['Dog d;','d.name = "Buddy";  // 错误! protected','d.eat();            // 正确, 继承的public方法','d.bark();           // 正确, 自己的方法'], highlightLine:2, note:'protected 成员在类外不可直接访问', info:'访问控制' },
      { type:'code', lines:['// 多重继承','class FlyingFish : public Fish, public Bird {','    // 同时拥有 Fish 和 Bird 的成员','};','','// 菱形继承问题','//   Animal','//   /    \\','//  Dog   Cat','//   \\    /','//   DogCat  // Animal成员重复!'], highlightLine:0, note:'多重继承可能导致菱形继承问题', info:'多重继承' },
      { type:'code', lines:['// 虚继承解决菱形继承','class Animal {};','class Dog : virtual public Animal {};','class Cat : virtual public Animal {};','class DogCat : public Dog, public Cat {};','// 只有一份Animal成员'], highlightLine:1, note:'virtual 继承: 共享基类', info:'虚继承' },
    ];
  },

  _gen_cpp_polymorphism() {
    const W = this.W, H = this.H;
    this.steps = [
      { type:'title', t:'多态与虚函数', sub:'virtual · 动态绑定 · vtable', color:'#8b5cf6', info:'多态概念' },
      { type:'code', lines:['class Animal {','public:','    virtual void speak() {','        cout << "...";','    }','};','','class Dog : public Animal {','public:','    void speak() override {','        cout << "汪汪!";','    }','};'], highlightLine:2, note:'virtual 声明虚函数, 实现动态绑定', info:'虚函数定义' },
      { type:'code', lines:['Animal *a = new Dog();','a->speak();  // 输出: 汪汪!','','// 没有 virtual 的话','// a->speak() 会调用 Animal::speak()','// 输出: ...'], highlightLine:1, note:'基类指针调用派生类方法 = 多态', info:'多态效果' },
      { type:'inherit', nodes:[
        {x:W*0.5, y:H*0.25, name:'Animal'},
        {x:W*0.5, y:H*0.65, name:'Dog'},
      ], links:[[0,1]], highlight:1, note:'Dog 重写了 Animal 的 speak()', info:'继承关系' },
      { type:'vtable', className:'Dog', entries:[
        {sig:'speak()', impl:'Dog::speak'},
      ], highlight:0, note:'vtable: 每个含虚函数的类都有一张虚函数表', info:'虚函数表' },
      { type:'code', lines:['// 纯虚函数与抽象类','class Shape {','public:','    virtual double area() = 0;  // 纯虚函数','};','// Shape 是抽象类, 不能实例化','','class Circle : public Shape {','    double r;','public:','    double area() override {','        return 3.14159 * r * r;','    }','};'], highlightLine:3, note:'= 0 纯虚函数: 必须由派生类实现', info:'纯虚函数' },
      { type:'inherit', nodes:[
        {x:W*0.5, y:H*0.15, name:'Shape {abstract}', abstract:true},
        {x:W*0.25, y:H*0.55, name:'Circle'},
        {x:W*0.75, y:H*0.55, name:'Rectangle'},
      ], links:[[0,1],[0,2]], highlight:0, note:'抽象类不可实例化, 只能被继承', info:'抽象类' },
      { type:'code', lines:['// 虚析构函数','class Base {','public:','    virtual ~Base() { }  // 虚析构','};','','Base *p = new Derived();','delete p;  // 正确调用 Derived 析构','// 没有虚析构: 只调 Base 析构, 内存泄漏!'], highlightLine:2, note:'基类析构函数应为 virtual', info:'虚析构函数' },
    ];
  },

  _gen_cpp_template() {
    this.steps = [
      { type:'title', t:'模板', sub:'泛型编程 · 类型参数化', color:'#8b5cf6', info:'模板概念' },
      { type:'code', lines:['// 函数模板','template <typename T>','T max_val(T a, T b) {','    return a > b ? a : b;','}','','max_val(3, 5);       // T=int, 返回5','max_val(3.14, 2.71); // T=double, 返回3.14'], highlightLine:0, note:'template: 让类型成为参数', info:'函数模板' },
      { type:'code', lines:['// 类模板','template <typename T>','class Stack {','    T data[100];','    int top;','public:','    void push(T val);','    T pop();','};','','Stack<int> si;       // int 栈','Stack<string> ss;    // string 栈'], highlightLine:0, note:'类模板: 生成不同类型的类', info:'类模板' },
      { type:'class', cls:{name:'Stack<T>', members:[
        {access:'-', type:'T', name:'data[100]'},
        {access:'-', type:'int', name:'top'},
      ], methods:[
        {access:'+', sig:'void push(T)'},
        {access:'+', sig:'T pop()'},
      ]}, note:'一份代码, 多种类型', info:'Stack 模板类' },
      { type:'code', lines:['// 模板特化','template <>','bool max_val<bool>(bool a, bool b) {','    return a || b;','}','// 对 bool 类型特殊处理'], highlightLine:0, note:'模板特化: 对特定类型自定义实现', info:'模板特化' },
    ];
  },

  _gen_cpp_stl() {
    this.steps = [
      { type:'title', t:'STL 标准库容器', sub:'vector · list · map · set', color:'#8b5cf6', info:'STL容器' },
      { type:'code', lines:['// vector: 动态数组','#include <vector>','vector<int> v = {1, 2, 3};','v.push_back(4);  // {1,2,3,4}','v[0];            // 1','v.size();        // 4'], highlightLine:0, note:'vector: 自动扩容的动态数组', info:'vector' },
      { type:'array', array:[1,2,3,4], highlight:3, note:'push_back 在末尾添加元素', info:'vector 操作' },
      { type:'code', lines:['// list: 双向链表','#include <list>','list<int> l = {1, 2, 3};','l.push_front(0);  // {0,1,2,3}','l.push_back(4);   // {0,1,2,3,4}'], highlightLine:0, note:'list: 双向链表, 头尾插入O(1)', info:'list' },
      { type:'list', nodes:[{val:0},{val:1},{val:2},{val:3},{val:4}], highlight:0, note:'链表结构', info:'list 结构' },
      { type:'code', lines:['// map: 键值对','#include <map>','map<string,int> m;','m["apple"] = 5;','m["banana"] = 3;','','for (auto& [k,v] : m)','    cout << k << ":" << v;'], highlightLine:0, note:'map: 有序键值对(红黑树)', info:'map' },
      { type:'compare', left:{title:'vector', color:'#0ea5e9'}, right:{title:'list', color:'#8b5cf6'}, items:[
        {left:'连续内存', right:'离散内存'},
        {left:'随机访问O(1)', right:'随机访问O(n)'},
        {left:'尾部插入O(1)均摊', right:'任意位置插入O(1)'},
        {left:'缓存友好', right:'缓存不友好'},
      ], note:'vector适合随机访问, list适合频繁插入删除', info:'vector vs list' },
      { type:'code', lines:['// STL 算法','#include <algorithm>','vector<int> v = {3,1,4,1,5};','','sort(v.begin(), v.end());   // {1,1,3,4,5}','auto it = find(v.begin(), v.end(), 4);','int sum = accumulate(v.begin(), v.end(), 0);  // 14'], highlightLine:0, note:'STL算法配合迭代器使用', info:'STL 算法' },
    ];
  },

  _gen_cpp_smart_ptr() {
    this.steps = [
      { type:'title', t:'智能指针', sub:'RAII · 自动释放 · 防内存泄漏', color:'#8b5cf6', info:'智能指针' },
      { type:'code', lines:['// unique_ptr: 独占所有权','#include <memory>','unique_ptr<int> p = make_unique<int>(42);','// unique_ptr<int> p2 = p;  // 错误! 不可拷贝','unique_ptr<int> p2 = move(p);  // 转移所有权','// p 现在为空, p2 指向42'], highlightLine:0, note:'unique_ptr: 独占, 不可拷贝', info:'unique_ptr' },
      { type:'smartptr', boxes:[
        {label:'p2', sub:'owns -> 42', color:'#8b5cf6'},
        {label:'42 (heap)', color:'#10b981'},
      ], note:'move 后 p2 拥有对象', info:'unique_ptr 转移' },
      { type:'code', lines:['// shared_ptr: 共享所有权','shared_ptr<int> a = make_shared<int>(42);','shared_ptr<int> b = a;  // 引用计数 = 2','','// 离开作用域:','// a 析构 -> ref_count = 1','// b 析构 -> ref_count = 0 -> 释放内存'], highlightLine:0, note:'shared_ptr: 可拷贝, 引用计数管理', info:'shared_ptr' },
      { type:'smartptr', boxes:[
        {label:'a', sub:'ref=2', color:'#8b5cf6'},
        {label:'b', sub:'ref=2', color:'#8b5cf6'},
        {label:'42 (heap)', color:'#10b981'},
      ], refs:2, note:'a 和 b 共享, ref_count=2', info:'shared_ptr 共享' },
      { type:'smartptr', boxes:[
        {label:'b', sub:'ref=1', color:'#8b5cf6'},
        {label:'42 (heap)', color:'#10b981'},
      ], refs:1, note:'a 析构, ref_count=1', info:'ref_count=1' },
      { type:'smartptr', boxes:[], refs:0, note:'b 析构, ref_count=0, 内存自动释放', info:'ref_count=0, 自动释放' },
      { type:'compare', left:{title:'unique_ptr', color:'#0ea5e9'}, right:{title:'shared_ptr', color:'#8b5cf6'}, items:[
        {left:'独占所有权', right:'共享所有权'},
        {left:'不可拷贝', right:'可拷贝'},
        {left:'零开销', right:'引用计数开销'},
        {left:'默认首选', right:'需要共享时用'},
      ], note:'优先用 unique_ptr, 需要共享时用 shared_ptr', info:'unique_ptr vs shared_ptr' },
    ];
  },

  _gen_cpp_lambda() {
    this.steps = [
      { type:'title', t:'Lambda 表达式', sub:'匿名函数 · 捕获列表 · STL配合', color:'#8b5cf6', info:'Lambda表达式' },
      { type:'code', lines:['// Lambda 语法','[捕获列表](参数列表) -> 返回类型 {','    函数体','}','','// 示例','auto add = [](int a, int b) -> int {','    return a + b;','};','add(3, 5);  // 8'], highlightLine:0, note:'Lambda: 内联定义的匿名函数', info:'Lambda 语法' },
      { type:'code', lines:['// 捕获方式','int x = 10, y = 20;','','[x]()     { return x; }      // 值捕获 x','[&x]()    { x++; }           // 引用捕获 x','[=]()     { return x+y; }    // 值捕获所有','[&]()     { x++; y++; }      // 引用捕获所有','[x,&y]()  { y += x; }        // 混合捕获'], highlightLine:0, note:'[] 值捕获, [&] 引用捕获', info:'捕获方式' },
      { type:'code', lines:['// 配合 STL 使用','vector<int> v = {3, 1, 4, 1, 5};','','// 用 lambda 排序(降序)','sort(v.begin(), v.end(), [](int a, int b) {','    return a > b;','});','// v = {5, 4, 3, 1, 1}','','// 用 lambda 遍历','for_each(v.begin(), v.end(), [](int x) {','    cout << x << " ";','});'], highlightLine:0, note:'Lambda 常用于 STL 算法的回调', info:'Lambda + STL' },
    ];
  },

  _gen_cpp_exception() {
    const W = this.W, H = this.H;
    this.steps = [
      { type:'title', t:'异常处理', sub:'try · catch · throw · RAII', color:'#8b5cf6', info:'异常处理' },
      { type:'code', lines:['double divide(int a, int b) {','    if (b == 0)','        throw runtime_error("除零错误");','    return (double)a / b;','}','','try {','    double r = divide(10, 0);','} catch (const exception &e) {','    cout << e.what();  // 除零错误','}'], highlightLine:2, note:'throw 抛出异常, catch 捕获', info:'try-catch-throw' },
      { type:'flow', nodes:[
        {x:W*0.5, y:H*0.12, label:'divide(10,0)', color:'#0ea5e9'},
        {x:W*0.5, y:H*0.3, label:'b==0?', color:'#f59e0b'},
        {x:W*0.2, y:H*0.5, label:'throw异常', color:'#ef4444'},
        {x:W*0.8, y:H*0.5, label:'返回结果', color:'#34d399'},
        {x:W*0.2, y:H*0.7, label:'catch捕获', color:'#8b5cf6'},
      ], edges:[[0,1],[1,2],[1,3],[2,4]], highlight:2, note:'异常抛出后, 沿调用链向上查找catch', info:'异常流程' },
      { type:'code', lines:['// RAII: 资源获取即初始化','class FileGuard {','    FILE *fp;','public:','    FileGuard(const char *path) {','        fp = fopen(path, "r");','    }','    ~FileGuard() {','        if (fp) fclose(fp);','    }','};','','// 无论是否异常, 析构都会自动关闭文件','{','    FileGuard fg("data.txt");','    // ... 可能抛异常的操作 ...','}  // fg 析构, 自动 fclose'], highlightLine:0, note:'RAII: 析构函数保证资源释放', info:'RAII' },
    ];
  },

  _gen_cpp_move() {
    this.steps = [
      { type:'title', t:'移动语义与右值引用', sub:'std::move · 移动构造 · 避免拷贝', color:'#8b5cf6', info:'移动语义' },
      { type:'code', lines:['// 左值 vs 右值','int a = 10;       // a 是左值, 10 是右值','int &lr = a;      // 左值引用','int &&rr = 10;    // 右值引用','','// std::move: 将左值转为右值','int b = move(a);  // a 的值被移动到 b'], highlightLine:0, note:'右值引用 && 绑定到临时对象', info:'左值与右值' },
      { type:'code', lines:['// 移动构造函数','class String {','    char *data;','    int len;','public:','    // 移动构造: 偷取资源','    String(String &&other) {','        data = other.data;','        len = other.len;','        other.data = nullptr;  // 源对象置空','    }','};','','String s1 = "Hello";','String s2 = move(s1);  // 移动而非拷贝'], highlightLine:0, note:'移动构造: 转移资源所有权, 不拷贝', info:'移动构造函数' },
      { type:'compare', left:{title:'拷贝构造', color:'#0ea5e9'}, right:{title:'移动构造', color:'#8b5cf6'}, items:[
        {left:'深拷贝数据', right:'转移指针'},
        {left:'O(n) 时间', right:'O(1) 时间'},
        {left:'源对象不变', right:'源对象置空'},
        {left:'安全', right:'高效'},
      ], note:'移动比拷贝快得多(指针转移vs数据拷贝)', info:'拷贝 vs 移动' },
    ];
  },

  _gen_c_scope() {
    this.steps = [
      { type:'title', t:'变量作用域', sub:'局部 · 全局 · static', color:'#0ea5e9', info:'变量作用域' },
      { type:'code', lines:['int g = 100;  // 全局变量','','void func() {','    int l = 10;  // 局部变量','    static int s = 0;  // 静态局部变量','    s++;','    // g 可访问, l 每次新建, s 保持上次值','}'], highlightLine:0, note:'全局变量: 所有函数可访问', info:'作用域类型' },
      { type:'compare', left:{title:'局部变量', color:'#0ea5e9'}, right:{title:'static变量', color:'#f59e0b'}, items:[
        {left:'函数内定义', right:'函数内定义'},
        {left:'每次调用重新创建', right:'只初始化一次'},
        {left:'函数退出销毁', right:'程序结束才销毁'},
        {left:'存在栈上', right:'存在全局数据区'},
      ], note:'static 变量保持值不变, 只初始化一次', info:'局部 vs static' },
    ];
  },

  _gen_c_file_io() {
    this.steps = [
      { type:'title', t:'文件操作', sub:'fopen · fclose · 读写 · 二进制', color:'#0ea5e9', info:'文件操作' },
      { type:'code', lines:['// 打开文件','FILE *fp = fopen("data.txt", "r");','if (fp == NULL) {','    perror("打开失败");','    return -1;','}','','// 读写操作...','','// 关闭文件','fclose(fp);'], highlightLine:0, note:'fopen 打开文件, fclose 关闭文件', info:'fopen/fclose' },
      { type:'code', lines:['// 文件模式','"r"  只读(文件必须存在)','"w"  只写(清空或创建)','"a"  追加(在末尾写入)','"r+" 读写(文件必须存在)','"w+" 读写(清空或创建)','"b"  二进制模式(如"rb")'], highlightLine:0, note:'不同模式对应不同操作', info:'文件模式' },
      { type:'code', lines:['// 文本读写','fgetc(fp);              // 读一个字符','fgets(buf, 100, fp);    // 读一行','fscanf(fp, "%d", &n);   // 格式化读','','fputc(\'A\', fp);         // 写一个字符','fputs("Hello", fp);     // 写字符串','fprintf(fp, "%d", 42);   // 格式化写'], highlightLine:0, note:'文本模式读写函数', info:'文本读写' },
      { type:'code', lines:['// 二进制读写','int data[5] = {1,2,3,4,5};','fwrite(data, sizeof(int), 5, fp);','','int buf[5];','fread(buf, sizeof(int), 5, fp);','','// 文件定位','fseek(fp, 0, SEEK_SET);  // 回到开头','ftell(fp);                // 当前位置'], highlightLine:0, note:'二进制模式读写整块数据', info:'二进制读写' },
    ];
  },

  _gen_c_preprocessor() {
    this.steps = [
      { type:'title', t:'预处理器', sub:'宏定义 · 条件编译 · 头文件', color:'#0ea5e9', info:'预处理器' },
      { type:'code', lines:['// 宏定义','#define PI 3.14159','#define MAX(a,b) ((a)>(b)?(a):(b))','#define SQUARE(x) ((x)*(x))','','int r = MAX(3, 5);     // 替换为 ((3)>(5)?(3):(5))','int s = SQUARE(4);     // 替换为 ((4)*(4))'], highlightLine:0, note:'宏在预处理阶段做文本替换', info:'宏定义' },
      { type:'code', lines:['// 条件编译','#define DEBUG','','#ifdef DEBUG','    printf("debug: x=%d", x);','#endif','','#ifndef HEADER_H','#define HEADER_H','// 头文件内容','#endif'], highlightLine:3, note:'#ifdef/#endif 控制编译', info:'条件编译' },
      { type:'code', lines:['// 头文件防重复包含','#ifndef STUDENT_H','#define STUDENT_H','','struct Student {','    int id;','};','','#endif // STUDENT_H'], highlightLine:0, note:'#ifndef/#define/#endif 防止重复包含', info:'头文件保护' },
    ];
  },

  _gen_c_intro() {
    const W = this.W, H = this.H;
    this.steps = [
      { type:'title', t:'C 语言历史与应用', sub:'1972 贝尔实验室 · Dennis Ritchie', color:'#0ea5e9', info:'C 语言历史' },
      { type:'code', lines:['// 第一个 C 程序','#include <stdio.h>','','int main() {','    printf("Hello, World!\\n");','    return 0;','}'], highlightLine:0, note:'main 函数是程序入口, 程序从这里开始执行', info:'Hello World' },
      { type:'flow', nodes:[
        {x:W*0.5, y:H*0.16, label:'C 语言', color:'#0ea5e9'},
        {x:W*0.24, y:H*0.5, label:'嵌入式', color:'#0ea5e9'},
        {x:W*0.76, y:H*0.5, label:'游戏引擎', color:'#0ea5e9'},
        {x:W*0.24, y:H*0.84, label:'系统编程', color:'#0ea5e9'},
        {x:W*0.76, y:H*0.84, label:'编译器/内核', color:'#0ea5e9'},
      ], edges:[[0,1],[0,2],[1,3],[2,4]], highlight:0, note:'C 语言应用领域极其广泛', info:'应用领域' },
      { type:'compare', left:{title:'C 语言优势', color:'#0ea5e9'}, right:{title:'学习要点', color:'#f59e0b'}, items:[
        {left:'高效 · 接近硬件', right:'指针与内存'},
        {left:'可移植性强', right:'函数与结构体'},
        {left:'语法简洁', right:'文件与预处理'},
        {left:'生态庞大', right:'算法思维'},
      ], note:'C 是系统级语言的基础', info:'语言特点' },
    ];
  },

  _gen_c_structure() {
    const W = this.W, H = this.H;
    this.steps = [
      { type:'title', t:'程序结构', sub:'预处理指令 · main 函数 · 注释规范', color:'#0ea5e9', info:'程序结构' },
      { type:'code', lines:['// 预处理指令(头文件)','#include <stdio.h>','','// 函数定义','int add(int a, int b) {','    return a + b;','}','','// 主函数: 程序入口','int main() {','    printf("%d\\n", add(3, 5));  // 输出 8','    return 0;','}'], highlightLine:8, note:'程序 = 预处理指令 + 函数 + main 入口', info:'程序骨架' },
      { type:'flow', nodes:[
        {x:W*0.2, y:H*0.25, label:'源代码 .c', color:'#0ea5e9'},
        {x:W*0.5, y:H*0.25, label:'预处理', color:'#f59e0b'},
        {x:W*0.8, y:H*0.25, label:'编译', color:'#8b5cf6'},
        {x:W*0.5, y:H*0.6, label:'链接', color:'#34d399'},
        {x:W*0.2, y:H*0.6, label:'可执行文件', color:'#f59e0b'},
      ], edges:[[0,1],[1,2],[2,3],[3,4]], highlight:1, note:'编译四阶段: 预处理→编译→汇编→链接', info:'编译流程' },
      { type:'code', lines:['// 注释规范','/* 这是块注释','   可以跨多行 */','','// 这是单行注释','','// 命名建议: 见名知意','int student_count = 30;  // 清晰','int sc = 30;             // 不推荐'], highlightLine:0, note:'良好的注释提高代码可读性', info:'注释规范' },
    ];
  },

  _gen_c_type_cast() {
    this.steps = [
      { type:'title', t:'类型转换', sub:'隐式转换 · 强制转换 · sizeof', color:'#0ea5e9', info:'类型转换' },
      { type:'code', lines:['// 隐式转换(自动)','int a = 10;','double b = a;      // int → double','','char c = \'A\';','int d = c;          // char → int (ASCII 65)','','// 整数提升','short s = 100;','int e = s + 200;    // s 提升为 int'], highlightLine:0, note:'隐式转换: 低精度自动转为高精度', info:'隐式转换' },
      { type:'code', lines:['// 强制类型转换','double pi = 3.14159;','int x = (int)pi;    // 截断为 3','','// 可能的精度丢失','int big = 300;','char small = (char)big;  // 溢出! 只取低 8 位','','// sizeof 运算符','printf("%zu", sizeof(int));    // 4','printf("%zu", sizeof(double)); // 8'], highlightLine:2, note:'强制转换: (类型)表达式, 可能丢失数据', info:'强制转换' },
      { type:'compare', left:{title:'隐式转换', color:'#0ea5e9'}, right:{title:'强制转换', color:'#f59e0b'}, items:[
        {left:'自动发生', right:'手动指定'},
        {left:'低→高精度', right:'任意类型'},
        {left:'无精度丢失', right:'可能溢出/截断'},
        {left:'int→double', right:'(int)3.14 = 3'},
      ], note:'隐式安全但有限, 强制灵活但需谨慎', info:'对比' },
    ];
  },

  _gen_c_assign_cond() {
    this.steps = [
      { type:'title', t:'赋值与条件运算符', sub:'复合赋值 · 三目运算符 ?:', color:'#0ea5e9', info:'赋值与条件运算符' },
      { type:'code', lines:['// 复合赋值运算符','int a = 10;','a += 5;   // a = a + 5 → 15','a -= 3;   // a = a - 3 → 12','a *= 2;   // a = a * 2 → 24','a /= 4;   // a = a / 4 → 6','a %= 4;   // a = a % 4 → 2','','// 自增自减','int i = 0;','i++;  // i = 1','++i;  // i = 2'], highlightLine:0, note:'复合赋值: 先运算再赋值, 写法更简洁', info:'复合赋值' },
      { type:'code', lines:['// 三目运算符','// 表达式 ? 值1 : 值2','int score = 85;','char grade = (score >= 60) ? \'P\' : \'F\';','','// 等价于','char grade2;','if (score >= 60) grade2 = \'P\';','else grade2 = \'F\';','','// 求最大值','int max = (a > b) ? a : b;'], highlightLine:2, note:'?: 是 if-else 的简洁形式, 返回一个值', info:'三目运算符' },
      { type:'compare', left:{title:'if-else', color:'#0ea5e9'}, right:{title:'三目 ?:', color:'#f59e0b'}, items:[
        {left:'语句, 不返回值', right:'表达式, 返回一个值'},
        {left:'可含多语句', right:'仅一个值'},
        {left:'可读性好', right:'简洁紧凑'},
        {left:'适合复杂逻辑', right:'适合简单判断'},
      ], note:'简单赋值用 ?:, 复杂逻辑用 if-else', info:'对比' },
    ];
  },

  _gen_c_multi_ptr() {
    const W = this.W, H = this.H;
    this.steps = [
      { type:'title', t:'多级指针', sub:'二级指针 · 指针数组 · 数组指针', color:'#0ea5e9', info:'多级指针' },
      { type:'code', lines:['// 二级指针: 指向指针的指针','int x = 10;','int *p = &x;    // 一级指针, 存 x 的地址','int **pp = &p;  // 二级指针, 存 p 的地址','','// 解引用','*p == 10;    // 一级解引用得 x','**pp == 10;  // 二级解引用得 x','*pp == p;    // 得一级指针 p'], highlightLine:3, note:'二级指针 pp → 一级指针 p → 变量 x', info:'二级指针' },
      { type:'flow', nodes:[
        {x:W*0.7, y:H*0.5, label:'x = 10', color:'#34d399'},
        {x:W*0.4, y:H*0.5, label:'p = &x', color:'#0ea5e9'},
        {x:W*0.1, y:H*0.5, label:'pp = &p', color:'#f59e0b'},
      ], edges:[[2,1],[1,0]], highlight:2, note:'pp → p → x 的指针链', info:'指针链' },
      { type:'code', lines:['// 指针数组 vs 数组指针','int *pa[5];   // 指针数组: 5个指针','int (*ap)[5]; // 数组指针: 指向含5元素的数组','','// 指针数组用途: 字符串数组','char *names[] = {"Tom", "Jerry", "Bob"};','','// 二级指针作函数参数(修改一级指针)','void change(int **pp) {','    static int y = 100;','    *pp = &y;  // 修改外部指针指向','}'], highlightLine:0, note:'指针数组是数组, 数组指针是指针', info:'区分' },
    ];
  },

  _gen_cpp_intro() {
    const W = this.W, H = this.H;
    this.steps = [
      { type:'title', t:'C++ 与 C 的区别', sub:'命名空间 · cin/cout · bool · 内联函数', color:'#8b5cf6', info:'C++ 与 C 区别' },
      { type:'code', lines:['// C++ 输入输出(对比 C 的 printf/scanf)','#include <iostream>','using namespace std;','','int main() {','    int age;','    cout << "请输入年龄: ";   // 输出','    cin >> age;               // 输入','    cout << "你 " << age << " 岁" << endl;','    return 0;','}'], highlightLine:6, note:'cout 输出, cin 输入, 无需格式符', info:'cin/cout' },
      { type:'flow', nodes:[
        {x:W*0.3, y:H*0.3, label:'C++ 特性', color:'#8b5cf6'},
        {x:W*0.75, y:H*0.2, label:'命名空间', color:'#8b5cf6'},
        {x:W*0.75, y:H*0.45, label:'面向对象', color:'#8b5cf6'},
        {x:W*0.75, y:H*0.7, label:'模板/STL', color:'#8b5cf6'},
        {x:W*0.75, y:H*0.85, label:'bool/引用', color:'#8b5cf6'},
      ], edges:[[0,1],[0,2],[0,3],[0,4]], highlight:0, note:'C++ 是 C 的超集, 兼容 C 代码', info:'C++ 特性' },
      { type:'compare', left:{title:'C', color:'#0ea5e9'}, right:{title:'C++', color:'#8b5cf6'}, items:[
        {left:'过程式编程', right:'面向对象'},
        {left:'printf/scanf', right:'cin/cout'},
        {left:'无命名空间', right:'namespace'},
        {left:'无模板', right:'模板/STL'},
        {left:'无 bool(用int)', right:'bool 类型'},
      ], note:'C++ 保留 C 全部特性并扩展新特性', info:'C vs C++' },
    ];
  },

  _gen_cpp_this() {
    this.steps = [
      { type:'title', t:'this 指针', sub:'this 指针的含义与使用场景', color:'#8b5cf6', info:'this 指针' },
      { type:'code', lines:['class Point {','    int x, y;','public:','    // 参数名与成员名冲突时用 this 区分','    void set(int x, int y) {','        this->x = x;   // this->x 是成员','        this->y = y;','    }','    // 链式调用: 返回自身引用','    Point& move(int dx) {','        x += dx;','        return *this;  // 返回对象自身','    }','};'], highlightLine:5, note:'this 是指向当前对象的指针', info:'this 指针' },
      { type:'code', lines:['// 链式调用示例','Point p;','p.set(3, 4).move(1).move(2);','// 等价于:','// p.set(3,4) 返回 p 本身','// 再 p.move(1) 又返回 p','// 再 p.move(2)','','// this 的本质','// 成员函数实际是:','// void set(Point* this, int x, int y)'], highlightLine:1, note:'return *this 实现链式调用', info:'链式调用' },
      { type:'compare', left:{title:'this 用途', color:'#8b5cf6'}, right:{title:'说明', color:'#f59e0b'}, items:[
        {left:'区分成员/参数', right:'this->x = x'},
        {left:'返回自身', right:'return *this'},
        {left:'访问成员', right:'this->member'},
        {left:'每个成员函数隐含', right:'编译器自动传入'},
      ], note:'this 只在成员函数内部有效', info:'this 总结' },
    ];
  },

  _gen_cpp_op_overload() {
    const W = this.W, H = this.H;
    this.steps = [
      { type:'title', t:'运算符重载', sub:'operator 关键字 · 成员/友元重载', color:'#8b5cf6', info:'运算符重载' },
      { type:'code', lines:['class Complex {','    double r, i;','public:','    Complex(double r=0, double i=0):r(r),i(i){}','','    // 成员函数重载 +','    Complex operator+(const Complex &c) {','        return Complex(r + c.r, i + c.i);','    }','    // 友元函数重载 <<','    friend ostream& operator<<(ostream &os, const Complex &c) {','        os << c.r << "+" << c.i << "i";','        return os;','    }','};'], highlightLine:6, note:'operator+ 让对象也能用 + 运算', info:'operator+' },
      { type:'code', lines:['// 使用重载运算符','Complex a(1, 2), b(3, 4);','Complex c = a + b;     // 调用 operator+','cout << c;             // 调用 operator<<','// 输出: 4+6i','','// 可重载: + - * / == < << >> ++ -- [ ]','// 不可重载: .  ::  sizeof  ?:  .*'], highlightLine:2, note:'重载让自定义类型像内置类型一样运算', info:'使用重载' },
      { type:'flow', nodes:[
        {x:W*0.3, y:H*0.35, label:'a + b', color:'#8b5cf6'},
        {x:W*0.7, y:H*0.35, label:'a.operator+(b)', color:'#0ea5e9'},
        {x:W*0.5, y:H*0.7, label:'返回 Complex', color:'#34d399'},
      ], edges:[[0,1],[1,2]], highlight:1, note:'a + b 被编译器改写为 a.operator+(b)', info:'调用过程' },
    ];
  },

  _gen_cpp_file_stream() {
    const W = this.W, H = this.H;
    this.steps = [
      { type:'title', t:'文件与字符串流', sub:'ifstream · ofstream · stringstream', color:'#8b5cf6', info:'文件与字符串流' },
      { type:'code', lines:['#include <fstream>','using namespace std;','','int main() {','    // 写文件','    ofstream out("data.txt");','    out << "Hello C++!" << endl;','    out.close();','','    // 读文件','    ifstream in("data.txt");','    string line;','    getline(in, line);','    cout << line;  // Hello C++!','}'], highlightLine:5, note:'ofstream 写, ifstream 读, fstream 读写', info:'文件流' },
      { type:'flow', nodes:[
        {x:W*0.2, y:H*0.3, label:'ofstream', color:'#8b5cf6'},
        {x:W*0.2, y:H*0.7, label:'ifstream', color:'#0ea5e9'},
        {x:W*0.7, y:H*0.5, label:'data.txt', color:'#34d399'},
      ], edges:[[0,2],[2,1]], highlight:2, note:'文件流在内存与磁盘之间传递数据', info:'读写流程' },
      { type:'code', lines:['#include <sstream>','// 字符串流: 在内存中读写字符串','','// 格式化(拼接)','stringstream ss;','ss << "年龄: " << 20 << ", 分数: " << 95.5;','string s = ss.str();  // "年龄: 20, 分数: 95.5"','','// 解析(拆分)','stringstream ss2("10 20 30");','int a, b, c;','ss2 >> a >> b >> c;   // a=10 b=20 c=30'], highlightLine:4, note:'stringstream 可格式化也可解析字符串', info:'字符串流' },
    ];
  },

  _gen_cpp_thread() {
    const W = this.W, H = this.H;
    this.steps = [
      { type:'title', t:'并发编程', sub:'std::thread · mutex · 条件变量', color:'#8b5cf6', info:'并发编程' },
      { type:'code', lines:['#include <thread>','using namespace std;','','void task(int id) {','    printf("线程 %d 运行\\n", id);','}','','int main() {','    thread t1(task, 1);  // 创建线程','    thread t2(task, 2);','','    t1.join();  // 等待线程结束','    t2.join();','    return 0;','}'], highlightLine:8, note:'thread 创建线程, join 等待其结束', info:'std::thread' },
      { type:'flow', nodes:[
        {x:W*0.5, y:H*0.15, label:'main 线程', color:'#0ea5e9'},
        {x:W*0.22, y:H*0.55, label:'t1 线程', color:'#8b5cf6'},
        {x:W*0.78, y:H*0.55, label:'t2 线程', color:'#8b5cf6'},
        {x:W*0.5, y:H*0.85, label:'join 汇合', color:'#34d399'},
      ], edges:[[0,1],[0,2],[1,3],[2,3]], highlight:1, note:'多线程并发执行, join 等待汇合', info:'线程并发' },
      { type:'code', lines:['#include <mutex>','// 互斥锁: 保护共享资源','int counter = 0;','mutex mtx;','','void add() {','    lock_guard<mutex> lock(mtx);  // 自动加锁/解锁','    counter++;                    // 临界区','}  // 离开作用域自动解锁','','// condition_variable: 线程间同步','condition_variable cv;','// cv.wait(lock, pred) / cv.notify_one()'], highlightLine:6, note:'lock_guard 自动管理锁的生命周期', info:'互斥锁' },
    ];
  },

  _gen_cpp_design_pattern() {
    this.steps = [
      { type:'title', t:'常用设计模式', sub:'单例 · 工厂 · 观察者', color:'#8b5cf6', info:'设计模式' },
      { type:'code', lines:['// 单例模式: 类只有一个实例','class Singleton {','private:','    Singleton() {}   // 构造私有, 禁止外部 new','    static Singleton *inst;','public:','    static Singleton* getInstance() {','        if (!inst) inst = new Singleton();','        return inst;','    }','};','Singleton* Singleton::inst = nullptr;','','// 使用: Singleton::getInstance() 全程序唯一'], highlightLine:4, note:'构造私有 + 静态实例 = 单例', info:'单例模式' },
      { type:'code', lines:['// 工厂模式: 统一创建对象','class Animal { public: virtual void speak()=0; };','class Dog : public Animal {','public: void speak(){ cout << "汪"; }','};','class Cat : public Animal {','public: void speak(){ cout << "喵"; }','};','','Animal* create(const string &type) {','    if (type == "dog") return new Dog();','    if (type == "cat") return new Cat();','    return nullptr;','}'], highlightLine:10, note:'工厂把对象的创建集中管理', info:'工厂模式' },
      { type:'compare', left:{title:'模式', color:'#8b5cf6'}, right:{title:'解决什么问题', color:'#f59e0b'}, items:[
        {left:'单例', right:'全局唯一实例'},
        {left:'工厂', right:'解耦创建逻辑'},
        {left:'观察者', right:'一对多通知'},
        {left:'策略', right:'算法可替换'},
      ], note:'设计模式是可复用的解决方案', info:'模式一览' },
    ];
  },

  _gen_cpp_best_practice() {
    this.steps = [
      { type:'title', t:'代码规范与调试', sub:'命名规范 · const 正确性 · 内存检测', color:'#8b5cf6', info:'代码规范与调试' },
      { type:'code', lines:['// 命名规范','class StudentInfo {      // 类: 大驼峰','public:','    int getAge() const;   // 函数: 小驼峰','private:','    int age_;            // 成员: 下划线后缀','};','','const int MAX_SIZE = 100;  // 常量: 全大写','int student_count = 0;     // 变量: 下划线'], highlightLine:0, note:'一致的命名规范提高可读性', info:'命名规范' },
      { type:'code', lines:['// const 正确性','// 不修改成员的函数声明为 const','int getAge() const { return age_; }','','// const 引用传参: 避免拷贝且不修改','void print(const StudentInfo &s) {','    cout << s.getAge();','}','','// const 指针: 指向内容不可改','const int *p = &x;   // *p 只读','int *const q = &x;   // q 只读'], highlightLine:2, note:'const 让编译器帮我们捕捉错误', info:'const 正确性' },
      { type:'code', lines:['// 内存检测 (Valgrind)','// 编译时加 -g 保留调试信息','// $ valgrind --leak-check=full ./program','','// 常见内存问题:','// 1. 内存泄漏: new 后未 delete','// 2. 野指针: 释放后未置空','// 3. 越界: 访问数组范围外','// 4. 重复释放: delete 两次','','// 防御: 释放后置空','delete p;','p = nullptr;'], highlightLine:0, note:'Valgrind 检测内存泄漏与非法访问', info:'内存检测' },
    ];
  },
};

// ─────────────────────────────────────────────────────────────
// 知识点名 → 可视化 kpId 映射表 (与 app.js chaptersData 的 kp.name 对齐)
// ─────────────────────────────────────────────────────────────
const ccppVizMap = {
  // C 语言 (31 KP)
  'C 语言历史与应用':   { kpId:'c-intro',        name:'C语言历史与应用' },
  '开发环境配置':       { kpId:'c-intro',        name:'开发环境配置' },
  '程序结构':           { kpId:'c-structure',    name:'程序结构' },
  '基本数据类型':       { kpId:'c-data-types',   name:'基本数据类型' },
  '变量与常量':         { kpId:'c-variables',    name:'变量与常量' },
  '类型转换':           { kpId:'c-type-cast',    name:'类型转换' },
  '算术与关系运算符':   { kpId:'c-operators',    name:'算术与关系运算符' },
  '逻辑与位运算符':     { kpId:'c-operators',    name:'逻辑与位运算符' },
  '赋值与条件运算符':   { kpId:'c-assign-cond',  name:'赋值与条件运算符' },
  '条件语句':           { kpId:'c-control-flow', name:'条件分支' },
  '循环语句':           { kpId:'c-control-flow', name:'循环控制' },
  '跳转语句':           { kpId:'c-control-flow', name:'跳转语句' },
  '函数定义与调用':     { kpId:'c-functions',    name:'函数定义与调用' },
  '递归函数':           { kpId:'c-recursion',    name:'递归调用' },
  '变量作用域':         { kpId:'c-scope',        name:'变量作用域' },
  '一维与二维数组':     { kpId:'c-arrays',       name:'一维与二维数组' },
  '字符数组与字符串':   { kpId:'c-strings',      name:'字符数组与字符串' },
  '数组与函数':         { kpId:'c-arrays',       name:'数组与函数' },
  '指针基础':           { kpId:'c-pointers',     name:'指针基础' },
  '指针与数组':         { kpId:'c-ptr-array',    name:'指针与数组' },
  '指针与函数':         { kpId:'c-pointers',     name:'指针与函数' },
  '多级指针':           { kpId:'c-multi-ptr',    name:'多级指针' },
  '结构体':             { kpId:'c-structs',      name:'结构体' },
  '联合体与枚举':       { kpId:'c-structs',      name:'联合体与枚举' },
  '链表基础':           { kpId:'c-linked-list',  name:'链表基础' },
  '文件的打开与关闭':   { kpId:'c-file-io',      name:'文件打开与关闭' },
  '文件的读写':         { kpId:'c-file-io',      name:'文件读写' },
  '二进制文件':         { kpId:'c-file-io',      name:'二进制文件' },
  '动态内存管理':       { kpId:'c-memory',       name:'动态内存管理' },
  '预处理器':           { kpId:'c-preprocessor', name:'预处理器' },
  '常见编程错误':       { kpId:'c-memory',       name:'常见编程错误' },

  // C++ (33 KP)
  'C++ 与 C 的区别':    { kpId:'cpp-intro',          name:'C++ 与 C 的区别' },
  '引用':               { kpId:'cpp-reference',      name:'引用' },
  '函数重载与默认参数': { kpId:'cpp-overload',       name:'函数重载与默认参数' },
  '类的定义':           { kpId:'cpp-class',          name:'类的定义' },
  '构造与析构函数':     { kpId:'cpp-constructor',    name:'构造与析构函数' },
  'this 指针':          { kpId:'cpp-this',           name:'this 指针' },
  '运算符重载基础':     { kpId:'cpp-op-overload',    name:'运算符重载基础' },
  '常见运算符重载':     { kpId:'cpp-op-overload',    name:'常见运算符重载' },
  '赋值运算符与深拷贝': { kpId:'cpp-op-overload',    name:'赋值运算符与深拷贝' },
  '继承基础':           { kpId:'cpp-inheritance',    name:'继承基础' },
  '派生类':             { kpId:'cpp-inheritance',    name:'派生类' },
  '多重继承':           { kpId:'cpp-inheritance',    name:'多重继承' },
  '虚函数':             { kpId:'cpp-polymorphism',   name:'虚函数与动态绑定' },
  '纯虚函数与抽象类':   { kpId:'cpp-polymorphism',   name:'纯虚函数与抽象类' },
  '虚析构函数':         { kpId:'cpp-polymorphism',   name:'虚析构函数' },
  '函数模板':           { kpId:'cpp-template',       name:'函数模板' },
  '类模板':             { kpId:'cpp-template',       name:'类模板' },
  '模板元编程简介':     { kpId:'cpp-template',       name:'模板元编程' },
  '容器':               { kpId:'cpp-stl',            name:'STL 容器' },
  '迭代器':             { kpId:'cpp-stl',            name:'STL 迭代器' },
  '算法':               { kpId:'cpp-stl',            name:'STL 算法' },
  'try-catch-throw':    { kpId:'cpp-exception',      name:'异常抛出与捕获' },
  '标准异常类':         { kpId:'cpp-exception',      name:'标准异常类' },
  'RAII 资源管理':      { kpId:'cpp-exception',      name:'RAII 资源管理' },
  'unique_ptr 与 shared_ptr': { kpId:'cpp-smart-ptr', name:'智能指针' },
  '移动语义与右值引用': { kpId:'cpp-move',           name:'移动语义与右值引用' },
  'Lambda 表达式':      { kpId:'cpp-lambda',         name:'Lambda 表达式' },
  '文件流':             { kpId:'cpp-file-stream',    name:'文件流' },
  '字符串流':           { kpId:'cpp-file-stream',    name:'字符串流' },
  'std::thread':        { kpId:'cpp-thread',         name:'std::thread 线程' },
  '互斥与条件变量':     { kpId:'cpp-thread',         name:'互斥与条件变量' },
  '常用设计模式':       { kpId:'cpp-design-pattern', name:'常用设计模式' },
  '代码规范与调试':     { kpId:'cpp-best-practice',  name:'代码规范与调试' },
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CCppVizEngine, ccppVizMap };
}
