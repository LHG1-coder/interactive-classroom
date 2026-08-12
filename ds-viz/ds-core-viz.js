/* ═══════ 数据结构核心+进阶可视化引擎 ═══════
 * 覆盖: Ch7 图(6) + Ch8 动态存储(2) + Ch9 查找(4) + Ch11 外部排序(2) + Ch12 文件(2) = 16 KP
 */

const DsCoreVizEngine = {
  canvas: null, ctx: null, W: 0, H: 0,
  steps: [], currentStep: 0, totalSteps: 0,
  playing: false, speed: 1, animTimer: null, dpr: 1,

  init(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    this.W = rect.width;
    this.H = 320;
    canvas.width = this.W * this.dpr;
    canvas.height = this.H * this.dpr;
    canvas.style.height = this.H + 'px';
    this.ctx.scale(this.dpr, this.dpr);
    this.currentStep = 0;
    this.steps = [];
  },

  generateSteps(kpId, algoInfo) {
    this.steps = [];
    this.currentStep = 0;
    const fn = this['_gen_' + kpId.replace(/-/g, '_')];
    if (fn) { fn.call(this, algoInfo); } else { this.steps = [{ type: 'text', t: '演示准备中...' }]; }
    this.totalSteps = this.steps.length;
  },

  play() {
    if (this.currentStep >= this.totalSteps - 1) { this.currentStep = 0; }
    this.playing = true;
    const btn = document.getElementById('corePlayBtn');
    if (btn) btn.innerHTML = '&#9646;&#9646; 暂停';
    this._tick();
  },
  pause() {
    this.playing = false;
    if (this.animTimer) clearTimeout(this.animTimer);
    const btn = document.getElementById('corePlayBtn');
    if (btn) btn.innerHTML = '&#9654; 播放';
  },
  _tick() {
    if (!this.playing) return;
    this.draw();
    const pf = document.getElementById('coreProgressFill');
    if (pf) pf.style.width = ((this.currentStep + 1) / this.totalSteps * 100).toFixed(1) + '%';
    const si = document.getElementById('coreStepInfo');
    const s = this.steps[this.currentStep];
    if (si && s) si.textContent = '步骤 ' + (this.currentStep + 1) + '/' + this.totalSteps + ' · ' + (s.desc || '');
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
      this.animTimer = setTimeout(() => this._tick(), Math.max(80, 1200 - this.speed * 120));
    } else {
      this.playing = false;
      const btn = document.getElementById('corePlayBtn');
      if (btn) btn.innerHTML = '&#9654; 播放';
    }
  },
  next() {
    this.pause();
    if (this.currentStep < this.totalSteps - 1) { this.currentStep++; this.draw(); }
    const pf = document.getElementById('coreProgressFill');
    if (pf) pf.style.width = ((this.currentStep + 1) / this.totalSteps * 100).toFixed(1) + '%';
    const si = document.getElementById('coreStepInfo');
    const s = this.steps[this.currentStep];
    if (si && s) si.textContent = '步骤 ' + (this.currentStep + 1) + '/' + this.totalSteps + ' · ' + (s.desc || '');
  },
  prev() {
    this.pause();
    if (this.currentStep > 0) { this.currentStep--; this.draw(); }
    const pf = document.getElementById('coreProgressFill');
    if (pf) pf.style.width = ((this.currentStep + 1) / this.totalSteps * 100).toFixed(1) + '%';
    const si = document.getElementById('coreStepInfo');
    const s = this.steps[this.currentStep];
    if (si && s) si.textContent = '步骤 ' + (this.currentStep + 1) + '/' + this.totalSteps + ' · ' + (s.desc || '');
  },
  reset() {
    this.pause();
    this.currentStep = 0;
    this.draw();
    const pf = document.getElementById('coreProgressFill');
    if (pf) pf.style.width = '0%';
    const si = document.getElementById('coreStepInfo');
    if (si) si.textContent = '准备就绪';
  },
  draw() {
    const ctx = this.ctx, W = this.W, H = this.H;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
    // 网格线
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    // 调用步骤绘制函数
    const s = this.steps[this.currentStep];
    if (s && s.draw) { s.draw.call(this); }
    // 步骤描述文字
    ctx.fillStyle = '#94a3b8'; ctx.font = '11px "Segoe UI",system-ui,sans-serif';
    ctx.textAlign = 'center';
    const title = s ? (s.desc || '') : '';
    if (title) { ctx.fillText(title, W / 2, H - 10); }
  },

  /* ═══════ Ch7 图 ═══════ */

  // 7-0: 图的基本概念
  _gen_ds_7_0() {
    const ctx = this.ctx, W = this.W, H = this.H;
    const cx = W / 2, cy = H / 2 - 10;
    const r = 100;
    const coords = [
      { x: cx, y: cy - r, label: 'A', idx: 0 },
      { x: cx + r * 0.95, y: cy - r * 0.3, label: 'B', idx: 1 },
      { x: cx + r * 0.6, y: cy + r * 0.75, label: 'C', idx: 2 },
      { x: cx - r * 0.6, y: cy + r * 0.75, label: 'D', idx: 3 },
      { x: cx - r * 0.95, y: cy - r * 0.3, label: 'E', idx: 4 },
    ];
    // 有向边: A→B, A→C, B→D, C→D, D→E, E→B, C→E
    const edges = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [4, 1], [2, 4]];

    // 动画步骤: 1.顶点 2.有向边箭头 3.度/入度/出度标签 4.连通性说明
    this.steps = [
      { desc: '图 G=(V,E)——5个顶点，7条有向边', draw: function() {
        ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
        ctx.font = 'bold 13px "Segoe UI",system-ui,sans-serif'; ctx.textAlign = 'center';
        coords.forEach(c => {
          ctx.beginPath(); ctx.arc(c.x, c.y, 18, 0, Math.PI * 2);
          ctx.fillStyle = '#1e293b'; ctx.fill();
          ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2; ctx.stroke();
          ctx.fillStyle = '#fff'; ctx.fillText(c.label, c.x, c.y + 5);
        });
        ctx.fillStyle = '#94a3b8'; ctx.font = '11px "Segoe UI",system-ui,sans-serif';
      }},
      { desc: '顶点 A 出度:2 → B,C； 入度:0', draw: function() {
        ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
        coords.forEach(c => {
          ctx.beginPath(); ctx.arc(c.x, c.y, 18, 0, Math.PI * 2);
          ctx.fillStyle = c.label === 'A' ? '#10b98133' : '#1e293b'; ctx.fill();
          ctx.strokeStyle = c.label === 'A' ? '#10b981' : '#475569'; ctx.lineWidth = c.label === 'A' ? 3 : 1.5; ctx.stroke();
          ctx.fillStyle = '#fff'; ctx.font = 'bold 13px "Segoe UI",system-ui,sans-serif'; ctx.textAlign = 'center';
          ctx.fillText(c.label, c.x, c.y + 5);
        });
        const a = coords[0], b = coords[1], c2 = coords[2];
        [b, c2].forEach(t => { ctx.beginPath(); _drawArrow(ctx, a.x, a.y, t.x, t.y, '#f59e0b', 15); ctx.stroke(); });
        ctx.fillStyle = '#f59e0b'; ctx.font = '11px "Segoe UI",system-ui,sans-serif';
        ctx.fillText('出度=2 (A→B, A→C)', a.x, a.y - 28);
        ctx.fillText('入度=0', a.x, a.y + 40);
      }},
      { desc: '顶点 B 出度:1→D；入度:2←A,E', draw: function() {
        ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
        coords.forEach(c => {
          ctx.beginPath(); ctx.arc(c.x, c.y, 18, 0, Math.PI * 2);
          ctx.fillStyle = c.label === 'B' ? '#10b98133' : '#1e293b'; ctx.fill();
          ctx.strokeStyle = c.label === 'B' ? '#10b981' : '#475569'; ctx.lineWidth = c.label === 'B' ? 3 : 1.5; ctx.stroke();
          ctx.fillStyle = '#fff'; ctx.font = 'bold 13px "Segoe UI",system-ui,sans-serif'; ctx.textAlign = 'center';
          ctx.fillText(c.label, c.x, c.y + 5);
        });
        const b = coords[1], a = coords[0], d = coords[3], e = coords[4];
        [a, e].forEach(t => { ctx.beginPath(); _drawArrow(ctx, t.x, t.y, b.x, b.y, '#3b82f6', 15); ctx.stroke(); });
        ctx.beginPath(); _drawArrow(ctx, b.x, b.y, d.x, d.y, '#f59e0b', 15); ctx.stroke();
        ctx.fillStyle = '#f59e0b'; ctx.font = '11px "Segoe UI",system-ui,sans-serif';
        ctx.fillText('出度=1 (B→D)', b.x, b.y - 45);
        ctx.fillStyle = '#3b82f6'; ctx.fillText('入度=2 (A→B E→B)', b.x, b.y - 30);
      }},
      { desc: '度总和 = 2|E| = 14 (握手定理)', draw: function() {
        ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
        coords.forEach(c => {
          ctx.beginPath(); ctx.arc(c.x, c.y, 18, 0, Math.PI * 2);
          ctx.fillStyle = '#1e293b'; ctx.fill();
          ctx.strokeStyle = '#10b981'; ctx.lineWidth = 1.5; ctx.stroke();
          ctx.fillStyle = '#fff'; ctx.font = 'bold 13px "Segoe UI",system-ui,sans-serif'; ctx.textAlign = 'center';
          ctx.fillText(c.label, c.x, c.y + 5);
        });
        edges.forEach(([i, j]) => {
          ctx.beginPath(); _drawArrow(ctx, coords[i].x, coords[i].y, coords[j].x, coords[j].y, '#475569', 12); ctx.stroke();
        });
        const degrees = [2, 3, 3, 2, 4]; const labels = ['deg=2', 'deg=3', 'deg=3', 'deg=2', 'deg=4'];
        coords.forEach((c, i) => {
          ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 11px "Segoe UI",system-ui,sans-serif';
          ctx.fillText(labels[i], c.x, c.y + 35);
        });
        ctx.fillStyle = '#10b981'; ctx.font = 'bold 12px "Segoe UI",system-ui,sans-serif';
        ctx.fillText('Σ deg = 2+3+3+2+4 = 14 = 2×7 ✓ 握手定理成立', W / 2, H - 28);
      }},
    ];
  },

  // 7-1: 图的存储结构
  _gen_ds_7_1() {
    const W = this.W, H = this.H, ctx = this.ctx;
    this.steps = [
      { desc: '有向图 G——邻接矩阵与邻接表的对比', draw: function() {
        ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
        // 左侧: 简单图
        const nodes = [{x:50,y:90},{x:50,y:210},{x:150,y:150}];
        nodes.forEach(n => {ctx.beginPath();ctx.arc(n.x,n.y,16,0,Math.PI*2);ctx.fillStyle='#1e293b';ctx.fill();ctx.strokeStyle='#10b981';ctx.lineWidth=2;ctx.stroke();});
        ctx.fillStyle='#fff';ctx.font='bold 12px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
        ctx.fillText('1',50,95);ctx.fillText('2',50,215);ctx.fillText('3',150,155);
        ctx.beginPath();_drawArrow(ctx,48,100,48,200,'#f59e0b',14);ctx.stroke();
        ctx.beginPath();_drawArrow(ctx,60,95,140,148,'#f59e0b',14);ctx.stroke();
        ctx.beginPath();_drawArrow(ctx,138,138,60,85,'#3b82f6',14);ctx.stroke();
        ctx.fillStyle='#94a3b8';ctx.font='10px "Segoe UI",system-ui,sans-serif';
        ctx.fillText('有向图',100,260);
        // 右侧邻接矩阵
        const mx = 200, my = 40, cell = 50;
        ctx.strokeStyle='#475569';ctx.lineWidth=1;
        for(let i=0;i<=3;i++){ctx.beginPath();ctx.moveTo(mx,i*cell+my);ctx.lineTo(mx+3*cell,i*cell+my);ctx.stroke();}
        for(let i=0;i<=3;i++){ctx.beginPath();ctx.moveTo(i*cell+mx,my);ctx.lineTo(i*cell+mx,my+3*cell);ctx.stroke();}
        ctx.fillStyle='#94a3b8';ctx.font='11px "Segoe UI",system-ui,sans-serif';
        [['','1','2','3'],['1','0','1','1'],['2','0','0','0'],['3','1','0','0']].forEach((r,i)=>{
          r.forEach((c2,j)=>{ctx.fillText(c2,mx+j*cell+25,my+i*cell+30);});
        });
        ctx.fillStyle='#10b981';ctx.font='bold 11px "Segoe UI",system-ui,sans-serif';
        ctx.fillText('邻接矩阵 A[3][3]',mx+75,my-10);
        // 下方: 邻接表
        const lx = 380, ly = 40;
        ctx.fillStyle='#10b981';ctx.font='bold 11px "Segoe UI",system-ui,sans-serif';ctx.textAlign='left';
        ctx.fillText('邻接表',lx,ly-5);
        const list = ['1 → 2 → 3', '2 → ∅', '3 → 1'];
        list.forEach((s,i)=>{
          ctx.fillStyle='#fff';ctx.font='11px Consolas,monospace';
          ctx.fillText(s,lx,ly+25+i*35);
          ctx.beginPath();ctx.arc(lx-5,ly+22+i*35,4,0,Math.PI*2);ctx.fillStyle='#f59e0b';ctx.fill();
        });
        ctx.fillStyle='#94a3b8';ctx.font='10px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
        ctx.fillText('空间: O(n²) 适合稠密图',mx+75,my+3*cell+18);
        ctx.fillText('空间: O(n+e) 适合稀疏图',lx+80,ly+95);
      }},
      { desc: '邻接矩阵：a[1][2]=1，a[1][3]=1，a[3][1]=1', draw: function() {
        ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
        const mx = 60, my = 60, cell = 60;
        ctx.strokeStyle='#475569';ctx.lineWidth=1;
        for(let i=0;i<=3;i++){ctx.beginPath();ctx.moveTo(mx,i*cell+my);ctx.lineTo(mx+3*cell,i*cell+my);ctx.stroke();}
        for(let i=0;i<=3;i++){ctx.beginPath();ctx.moveTo(i*cell+mx,my);ctx.lineTo(i*cell+mx,my+3*cell);ctx.stroke();}
        ctx.fillStyle='#94a3b8';ctx.font='12px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
        [['','1','2','3'],['1','0','1','1'],['2','0','0','0'],['3','1','0','0']].forEach((r,i)=>{
          r.forEach((c2,j)=>{
            if(j>0&&i>0&&c2==='1'){ctx.fillStyle='#10b981';ctx.fillRect(mx+(j-1)*cell+2,my+(i-1)*cell+2,cell-4,cell-4);ctx.fillStyle='#000';}
            else ctx.fillStyle='#e2e8f0';
            ctx.fillText(c2,mx+j*cell-30,my+i*cell-28);
          });
        });
        ctx.fillStyle='#f59e0b';ctx.font='11px "Segoe UI",system-ui,sans-serif';ctx.textAlign='left';
        ctx.fillText('A[i][j] = 1  表示顶点 i 到 j 有边',mx,my+3*cell+25);
        ctx.fillText('A[1][2]=1 → 1→2   A[1][3]=1 → 1→3',mx,my+3*cell+45);
        ctx.fillStyle='#94a3b8';ctx.fillText('适合稠密图 (边数接近 n²)',mx,my+3*cell+65);
      }},
      { desc: '邻接表：顶点1→2→3，顶点3→1，顶点2无出边', draw: function() {
        ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle='#10b981';ctx.font='bold 12px "Segoe UI",system-ui,sans-serif';ctx.textAlign='left';
        ctx.fillText('邻接表 (链表实现)',30,30);
        const list = [
          {h:'1',nodes:[2,3]},{h:'2',nodes:[]},{h:'3',nodes:[1]}
        ];
        list.forEach((li,i)=>{
          const y = 60+i*65;
          ctx.fillStyle='#1e293b';ctx.fillRect(30,y-14,24,28);
          ctx.strokeStyle='#10b981';ctx.lineWidth=2;ctx.strokeRect(30,y-14,24,28);
          ctx.fillStyle='#fff';ctx.font='bold 12px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
          ctx.fillText(li.h,42,y+6);
          let cx2 = 80;
          ctx.beginPath();ctx.moveTo(54,y);ctx.lineTo(cx2,y);ctx.strokeStyle='#f59e0b';ctx.lineWidth=1.5;ctx.stroke();
          li.nodes.forEach(v=>{
            ctx.fillStyle='#1e293b';ctx.fillRect(cx2,y-12,22,24);
            ctx.strokeStyle='#475569';ctx.lineWidth=1.5;ctx.strokeRect(cx2,y-12,22,24);
            ctx.fillStyle='#10b981';ctx.font='11px "Segoe UI",system-ui,sans-serif';
            ctx.fillText(v,cx2+11,y+5);
            ctx.beginPath();ctx.moveTo(cx2+22,y);ctx.lineTo(cx2+35,y);ctx.strokeStyle='#f59e0b';ctx.lineWidth=1.5;ctx.stroke();
            cx2 += 35;
          });
          if(li.nodes.length===0){
            ctx.fillText('∅',cx2,y+5);
          }
        });
        ctx.fillStyle='#94a3b8';ctx.font='11px "Segoe UI",system-ui,sans-serif';ctx.textAlign='left';
        ctx.fillText('每个顶点维护一个出边链表  空间 O(n+e)',30,260);
        ctx.fillText('适合稀疏图 (边数远小于 n²)',30,280);
      }},
    ];
  },

  // 7-2: 图的遍历 (DFS/BFS)
  _gen_ds_7_2() {
    const W = this.W, H = this.H, ctx = this.ctx;
    const nodes = [
      {x:W/2,y:50,id:0},{x:W/2-100,y:130,id:1},{x:W/2+100,y:130,id:2},
      {x:W/2-140,y:230,id:3},{x:W/2-40,y:250,id:4},{x:W/2+80,y:260,id:5}
    ];
    const adj = [[1,2],[0,3,4],[0,5],[1],[1],[2]];

    // 底图 + 已访问(绿) + 当前(橙) + 遍历树边 + 可选队列
    const drawBase = (visitedArr, treeEdges, queueArr, current) => {
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
      adj.forEach((nei,i)=>{nei.forEach(j=>{if(j>i)_drawEdge(ctx,nodes[i].x,nodes[i].y,nodes[j].x,nodes[j].y,'#475569',12);});});
      (treeEdges||[]).forEach(([a,b])=>_drawEdge(ctx,nodes[a].x,nodes[a].y,nodes[b].x,nodes[b].y,'#10b981',18));
      nodes.forEach((n,i)=>{
        const isV = visitedArr.indexOf(i)>=0;
        const isCur = current===i;
        let stroke='#475569', fill='#1e293b', lw=1.5;
        if (isV){ stroke='#10b981'; fill='#10b98144'; }
        if (isCur){ stroke='#f59e0b'; fill='#f59e0b44'; lw=3; }
        _drawNode(ctx,n.x,n.y,''+i,fill,stroke,lw);
      });
      if (queueArr && queueArr.length){
        ctx.fillStyle='#f59e0b';ctx.font='bold 12px "Segoe UI",system-ui,sans-serif';ctx.textAlign='left';
        ctx.fillText('队列: ['+queueArr.join(', ')+']', W-150, 22);
      }
    };
    const topInfo = (txt)=>{ ctx.fillStyle='#94a3b8';ctx.font='11px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center'; ctx.fillText(txt, W/2, H-28); };

    this.steps = [];

    // ===== 一、DFS 深度优先 =====
    const dfsOrder = [0,1,3,4,2,5];
    const dfsEdges = [[0,1],[1,3],[1,4],[0,2],[2,5]];
    this.steps.push({ desc:'一、DFS 深度优先遍历（栈/递归，一条路走到底）', draw:function(){
      drawBase([], [], null, 0);
      topInfo('目标访问序: 0 → 1 → 3 → 4 → 2 → 5');
    }});
    let dV=[], dE=[];
    dfsOrder.forEach((v,idx)=>{
      if(idx>0) dE.push(dfsEdges[idx-1]);
      dV.push(v);
      const visitedSnap = dV.slice();
      const edgesSnap = dE.slice();
      this.steps.push({ desc:'DFS Step'+(idx+1)+': 访问顶点'+v+(idx>0?('（经 '+dfsEdges[idx-1][0]+' 到达）'):'（起点）'),
        draw:function(){
          drawBase(visitedSnap, edgesSnap, null, v);
          topInfo('已访问: '+visitedSnap.join(' → '));
        }});
    });
    this.steps.push({ desc:'DFS 完成：访问序 0,1,3,4,2,5  时间复杂度 O(n+e)', draw:function(){
      drawBase(dfsOrder.slice(), dfsEdges.slice(), null, -1);
      topInfo('DFS 完成!  时间复杂度 O(n+e)');
    }});

    // ===== 二、BFS 广度优先 =====
    const bfsOrder = [0,1,2,3,4,5];
    const bfsEdges = [[0,1],[0,2],[1,3],[1,4],[2,5]];
    const bfsQueuesAfter = [[1,2],[2,3,4],[3,4,5],[4,5],[5],[]];
    this.steps.push({ desc:'二、BFS 广度优先遍历（队列，逐层扩展）', draw:function(){
      drawBase([], [], [0], 0);
      topInfo('目标访问序: 0 → 1 → 2 → 3 → 4 → 5');
    }});
    let bV=[], bE=[];
    bfsOrder.forEach((v,idx)=>{
      if(idx>0) bE.push(bfsEdges[idx-1]);
      bV.push(v);
      const visitedSnap = bV.slice();
      const edgesSnap = bE.slice();
      const q = bfsQueuesAfter[idx];
      this.steps.push({ desc:'BFS Step'+(idx+1)+': 出队'+v+(idx>0?('，入队未访问邻居'):'（起点入队）'),
        draw:function(){
          drawBase(visitedSnap, edgesSnap, q, v);
          topInfo('已访问: '+visitedSnap.join(' → '));
        }});
    });
    this.steps.push({ desc:'BFS 完成：访问序 0,1,2,3,4,5  时间复杂度 O(n+e)', draw:function(){
      drawBase(bfsOrder.slice(), bfsEdges.slice(), [], -1);
      topInfo('BFS 完成!  时间复杂度 O(n+e)');
    }});
  },

  // 7-3: 最小生成树 Prim
  _gen_ds_7_3() {
    const W = this.W, H = this.H, ctx = this.ctx;
    const nodes = [
      {x:W/2,y:40,id:0},{x:W/2-120,y:120,id:1},{x:W/2+120,y:120,id:2},
      {x:W/2-120,y:240,id:3},{x:W/2+120,y:240,id:4}
    ];
    const edges = [[0,1,4],[0,2,8],[1,2,2],[1,3,7],[2,4,5],[3,4,3],[1,4,9]]; // [a,b,w]

    this.steps = [
      { desc: 'Prim算法：从顶点0开始构建最小生成树', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        nodes.forEach((n,i)=>{_drawNode(ctx,n.x,n.y,i.toString(),'#1e293b','#475569');});
        edges.forEach(([a,b,w])=>{
          const mx2=(nodes[a].x+nodes[b].x)/2,my2=(nodes[a].y+nodes[b].y)/2;
          ctx.beginPath();ctx.moveTo(nodes[a].x,nodes[a].y);ctx.lineTo(nodes[b].x,nodes[b].y);
          ctx.strokeStyle='#334155';ctx.lineWidth=1;ctx.stroke();
          ctx.fillStyle='#94a3b8';ctx.font='bold 10px "Segoe UI",system-ui,sans-serif';
          ctx.fillText(w,mx2-12,my2-4);
        });
        _drawNode(ctx,nodes[0].x,nodes[0].y,'0','#10b98144','#10b981',3);
        ctx.fillStyle='#fff';ctx.font='12px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
      }},
      { desc: 'Prim Step1: 选最小边 (1,2) 权=2 [不在同一连通分量内部]', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        nodes.forEach((n,i)=>{_drawNode(ctx,n.x,n.y,i.toString(),'#1e293b','#475569');});
        edges.forEach(([a,b,w])=>{
          ctx.beginPath();ctx.moveTo(nodes[a].x,nodes[a].y);ctx.lineTo(nodes[b].x,nodes[b].y);
          ctx.strokeStyle='#334155';ctx.lineWidth=1;ctx.stroke();
          const mx2=(nodes[a].x+nodes[b].x)/2,my2=(nodes[a].y+nodes[b].y)/2;
          ctx.fillStyle='#94a3b8';ctx.font='bold 10px "Segoe UI",system-ui,sans-serif';
          ctx.fillText(w,mx2-12,my2-4);
        });
        _drawEdge(ctx,nodes[0].x,nodes[0].y,nodes[1].x,nodes[1].y,'#f59e0b',16);
        _drawNode(ctx,nodes[0].x,nodes[0].y,'0','#10b98144','#10b981',3);
      }},
      { desc: 'Prim Step2: 选 (1,2) 权=2 → U={0,1,2}', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        nodes.forEach((n,i)=>{_drawNode(ctx,n.x,n.y,i.toString(),([0,1,2].includes(i))?'#10b98144':'#1e293b','#475569');});
        edges.forEach(([a,b,w])=>{
          ctx.beginPath();ctx.moveTo(nodes[a].x,nodes[a].y);ctx.lineTo(nodes[b].x,nodes[b].y);
          const inTree=([0,1,2].includes(a)&&[0,1,2].includes(b));
          ctx.strokeStyle=inTree?'#10b981':'#334155';ctx.lineWidth=inTree?2.5:1;ctx.stroke();
          const mx2=(nodes[a].x+nodes[b].x)/2,my2=(nodes[a].y+nodes[b].y)/2;
          ctx.fillStyle='#94a3b8';ctx.font='bold 10px "Segoe UI",system-ui,sans-serif';
          ctx.fillText(w,mx2-12,my2-4);
        });
        [0,1,2].forEach(i=>_drawNode(ctx,nodes[i].x,nodes[i].y,i.toString(),'#10b98144','#10b981',3));
      }},
      { desc: 'Prim Step3: 选 (2,4) 权=5 → U={0,1,2,4}', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        nodes.forEach((n,i)=>{_drawNode(ctx,n.x,n.y,i.toString(),([0,1,2,4].includes(i))?'#10b98144':'#1e293b','#475569');});
        edges.forEach(([a,b,w])=>{
          ctx.beginPath();ctx.moveTo(nodes[a].x,nodes[a].y);ctx.lineTo(nodes[b].x,nodes[b].y);
          const inTree=([0,1,2,4].includes(a)&&[0,1,2,4].includes(b));
          ctx.strokeStyle=inTree?'#10b981':'#334155';ctx.lineWidth=inTree?2.5:1;ctx.stroke();
          const mx2=(nodes[a].x+nodes[b].x)/2,my2=(nodes[a].y+nodes[b].y)/2;
          ctx.fillStyle='#94a3b8';ctx.font='bold 10px "Segoe UI",system-ui,sans-serif';
          ctx.fillText(w,mx2-12,my2-4);
        });
        [0,1,2,4].forEach(i=>_drawNode(ctx,nodes[i].x,nodes[i].y,i.toString(),'#10b98144','#10b981',3));
      }},
      { desc: 'Prim Step4: 选 (3,4) 权=3 → 生成树完成 总权=4+2+5+3=14', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        nodes.forEach((n,i)=>{_drawNode(ctx,n.x,n.y,i.toString(),'#10b98144','#10b981',3);});
        edges.forEach(([a,b,w])=>{
          ctx.beginPath();ctx.moveTo(nodes[a].x,nodes[a].y);ctx.lineTo(nodes[b].x,nodes[b].y);
          const inTree=[0,1,2,4,3].includes(a)&&[0,1,2,4,3].includes(b);
          ctx.strokeStyle=inTree?'#10b981':'#334155';ctx.lineWidth=inTree?2.5:1;ctx.stroke();
          const mx2=(nodes[a].x+nodes[b].x)/2,my2=(nodes[a].y+nodes[b].y)/2;
          ctx.fillStyle='#94a3b8';ctx.font='bold 10px "Segoe UI",system-ui,sans-serif';
          ctx.fillText(w,mx2-12,my2-4);
        });
        ctx.fillStyle='#10b981';ctx.font='bold 12px "Segoe UI",system-ui,sans-serif';
      }},
    ];
  },

  // 7-4: 最短路径 Dijkstra
  _gen_ds_7_4() {
    const W = this.W, H = this.H, ctx = this.ctx;
    const nodes = [
      {x:60,y:H/2,id:0},{x:W/2-60,y:60,id:1},{x:W/2+60,y:60,id:2},
      {x:W/2,y:H/2+30,id:3},{x:W-60,y:H/2,id:4}
    ];
    const edges = [[0,1,10],[0,3,5],[1,2,1],[1,3,2],[2,4,4],[3,1,3],[3,2,9],[3,4,2],[4,0,7],[4,2,6]];
    const dist = [0, Infinity, Infinity, Infinity, Infinity];
    const visited = [1,0,0,0,0];

    this.steps = [
      { desc: 'Dijkstra: 从0出发求单源最短路径', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        nodes.forEach((n,i)=>{_drawNode(ctx,n.x,n.y,i+'','#1e293b','#475569');});
        edges.forEach(([a,b,w])=>{
          ctx.beginPath();ctx.moveTo(nodes[a].x,nodes[a].y);ctx.lineTo(nodes[b].x,nodes[b].y);
          ctx.strokeStyle='#334155';ctx.lineWidth=1;ctx.stroke();
          const mx2=(nodes[a].x+nodes[b].x)/2,my2=(nodes[a].y+nodes[b].y)/2;
          ctx.fillStyle='#94a3b8';ctx.font='bold 10px "Segoe UI",system-ui,sans-serif';
          ctx.fillText(w,mx2-12,my2-4);
        });
        _drawNode(ctx,nodes[0].x,nodes[0].y,'0','#10b98144','#10b981',3);
        ctx.fillText('dist[0]=0, 其余=∞',W/2,H-28);
      }},
      { desc: 'Dijkstra Step1: 选0，更新0→1=10, 0→3=5', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        nodes.forEach((n,i)=>{_drawNode(ctx,n.x,n.y,i+'',(i===0)?'#10b98144':'#1e293b','#475569');});
        edges.forEach(([a,b,w])=>{
          ctx.beginPath();ctx.moveTo(nodes[a].x,nodes[a].y);ctx.lineTo(nodes[b].x,nodes[b].y);
          ctx.strokeStyle=(a===0)?'#3b82f6':'#334155';ctx.lineWidth=(a===0)?2:1;ctx.stroke();
          const mx2=(nodes[a].x+nodes[b].x)/2,my2=(nodes[a].y+nodes[b].y)/2;
          ctx.fillStyle='#94a3b8';ctx.font='bold 10px "Segoe UI",system-ui,sans-serif';
          ctx.fillText(w,mx2-12,my2-4);
        });
        _drawNode(ctx,nodes[0].x,nodes[0].y,'0','#10b98144','#10b981',3);
        ctx.fillStyle='#3b82f6';ctx.font='10px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
        ctx.fillText('dist=10',nodes[1].x,nodes[1].y-25);
        ctx.fillText('dist=5',nodes[3].x,nodes[3].y-25);
        ctx.fillStyle='#fff';ctx.font='12px "Segoe UI",system-ui,sans-serif';
      }},
      { desc: 'Dijkstra Step2: 选3(dist=5最小), 更新 dist[1]=8 dist[2]=14 dist[4]=7', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        nodes.forEach((n,i)=>{_drawNode(ctx,n.x,n.y,i+'',(i===0||i===3)?'#10b98144':'#1e293b','#475569');});
        edges.forEach(([a,b,w])=>{
          const highlight=(a===3&&b!==0)||a===0;
          ctx.beginPath();ctx.moveTo(nodes[a].x,nodes[a].y);ctx.lineTo(nodes[b].x,nodes[b].y);
          ctx.strokeStyle=highlight?'#3b82f6':'#334155';ctx.lineWidth=highlight?2:1;ctx.stroke();
          const mx2=(nodes[a].x+nodes[b].x)/2,my2=(nodes[a].y+nodes[b].y)/2;
          ctx.fillStyle='#94a3b8';ctx.font='bold 10px "Segoe UI",system-ui,sans-serif';
          ctx.fillText(w,mx2-12,my2-4);
        });
        [0,3].forEach(i=>_drawNode(ctx,nodes[i].x,nodes[i].y,i+'','#10b98144','#10b981',3));
        ctx.fillStyle='#3b82f6';ctx.font='10px "Segoe UI",system-ui,sans-serif';
        ctx.fillText('dist=8',nodes[1].x,nodes[1].y-25);
        ctx.fillText('dist=14',nodes[2].x,nodes[2].y-25);
        ctx.fillText('dist=7',nodes[4].x,nodes[4].y+45);
        ctx.fillStyle='#fff';ctx.font='12px "Segoe UI",system-ui,sans-serif';
      }},
      { desc: '最终: S={0,3,4,1,2} dist: 0,8,13,5,7', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        nodes.forEach((n,i)=>{_drawNode(ctx,n.x,n.y,i+'','#10b98144','#10b981',3);});
        const finalEdges = [[0,1],[0,3],[3,4],[1,2]];
        finalEdges.forEach(([a,b])=>{
          ctx.beginPath();ctx.moveTo(nodes[a].x,nodes[a].y);ctx.lineTo(nodes[b].x,nodes[b].y);
          ctx.strokeStyle='#10b981';ctx.lineWidth=2.5;ctx.stroke();
        });
        edges.forEach(([a,b,w])=>{
          if(finalEdges.some(e=>e[0]===a&&e[1]===b));
          else{ctx.beginPath();ctx.moveTo(nodes[a].x,nodes[a].y);ctx.lineTo(nodes[b].x,nodes[b].y);ctx.strokeStyle='#33415533';ctx.lineWidth=0.5;ctx.stroke();}
        });
        const ds = [0,8,13,5,7];
        nodes.forEach((n,i)=>{ctx.fillStyle='#fbbf24';ctx.font='bold 10px "Segoe UI",system-ui,sans-serif';ctx.fillText('dist='+ds[i],n.x,n.y-25);});
        ctx.fillStyle='#10b981';ctx.font='bold 12px "Segoe UI",system-ui,sans-serif';
        ctx.fillText('Dijkstra 完成! O(n²)',W/2,H-28);
      }},
    ];
  },

  // 7-5: 拓扑排序
  _gen_ds_7_5() {
    const W = this.W, H = this.H, ctx = this.ctx;
    const nodes = [
      {x:W/2,y:32,id:0,label:'C1',color:'#3b82f6'},{x:W/2-100,y:100,id:1,label:'C2',color:'#8b5cf6'},
      {x:W/2+100,y:100,id:2,label:'C3',color:'#f59e0b'},{x:W/2-60,y:200,id:3,label:'C4',color:'#10b981'},
      {x:W/2+60,y:200,id:4,label:'C5',color:'#ef4444'},{x:W/2,y:280,id:5,label:'C6',color:'#ec4899'}
    ];
    const edges2 = [[0,1],[0,2],[1,3],[2,3],[2,4],[3,5],[4,5]];
    this.steps = [
      { desc: 'AOV网：6门课程→拓扑排序', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        nodes.forEach(n=>{_drawNode(ctx,n.x,n.y,n.label,'#1e293b',n.color);});
        edges2.forEach(([a,b])=>{
          ctx.beginPath();_drawArrow(ctx,nodes[a].x,nodes[a].y+14,nodes[b].x,nodes[b].y-14,nodes[a].color,12);ctx.stroke();
        });
        ctx.fillStyle='#fff';ctx.font='12px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
      }},
      { desc: '拓扑排序 Step1: 选择入度为0的C1', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        nodes.forEach(n=>{_drawNode(ctx,n.x,n.y,n.label,'#1e293b',n.color);});
        edges2.forEach(([a,b])=>{
          ctx.beginPath();_drawArrow(ctx,nodes[a].x,nodes[a].y+14,nodes[b].x,nodes[b].y-14,nodes[a].color,12);ctx.stroke();
        });
        _drawNode(ctx,nodes[0].x,nodes[0].y,'C1','#10b98144','#10b981',3);
        ctx.textAlign='left';ctx.fillStyle='#10b981';ctx.fillText('输出序列: C1',18,16);ctx.textAlign='center';ctx.fillStyle='#fff';
      }},
      { desc: '拓扑排序 Step2: 去掉C1出边，C2,C3入度为0', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        nodes.forEach(n=>{_drawNode(ctx,n.x,n.y,n.label,[1,2].includes(n.id)?'#10b98144':'#1e293b',n.color);});
        edges2.slice(2).forEach(([a,b])=>{
          ctx.beginPath();_drawArrow(ctx,nodes[a].x,nodes[a].y+14,nodes[b].x,nodes[b].y-14,nodes[a].color,12);ctx.stroke();
        });
        [1,2].forEach(i=>_drawNode(ctx,nodes[i].x,nodes[i].y,nodes[i].label,'#10b98144','#10b981',3));
        ctx.textAlign='left';ctx.fillStyle='#10b981';ctx.fillText('输出序列: C1 → C2 → C3',18,16);ctx.textAlign='center';ctx.fillStyle='#fff';
      }},
      { desc: '最终拓扑序列: C1→C2→C3→C4→C5→C6', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        nodes.forEach(n=>{_drawNode(ctx,n.x,n.y,n.label,'#10b98144','#10b981',3);});
        edges2.forEach(([a,b])=>{
          ctx.beginPath();_drawArrow(ctx,nodes[a].x,nodes[a].y+14,nodes[b].x,nodes[b].y-14,'#10b981',12);ctx.stroke();
        });
        ctx.fillStyle='#10b981';ctx.font='bold 12px "Segoe UI",system-ui,sans-serif';
        ctx.fillText('时间复杂度 O(n+e)',W/2,H-28);
      }},
    ];
  },

  /* ═══════ Ch8 动态存储管理 ═══════ */

  _gen_ds_8_0() {
    const W = this.W, H = this.H, ctx = this.ctx;
    const memY = 60, memH = 48;
    const blk = (x, w, used, label, hi, sub) => {
      ctx.fillStyle = used ? 'rgba(59,130,246,0.27)' : (hi ? 'rgba(245,158,11,0.22)' : 'rgba(16,185,129,0.14)');
      ctx.fillRect(x, memY, w, memH);
      ctx.strokeStyle = hi ? '#f59e0b' : (used ? '#3b82f6' : '#10b981');
      ctx.lineWidth = hi ? 2.5 : 1.5;
      ctx.strokeRect(x, memY, w, memH);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 10px "Segoe UI",system-ui,sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(label, x + w / 2, memY + 21);
      if (sub) { ctx.font = '9px "Segoe UI",system-ui,sans-serif'; ctx.fillText(sub, x + w / 2, memY + 38); }
    };
    const note = (t) => { ctx.fillStyle = '#94a3b8'; ctx.font = '11px "Segoe UI",system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.fillText(t, W / 2, H - 28); };
    this.steps = [
      { desc: '连续内存按地址排列，分配=选一块空闲区', draw: function() {
        ctx.clearRect(0,0,W,H); ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);
        blk(40,130,true,'已分配'); blk(176,90,false,'空闲'); blk(271,150,true,'已分配'); blk(426,110,false,'空闲'); blk(541,70,true,'已分配');
        note('物理内存连续；空闲块用链表或位图记录，分配即占用、释放即归还');
      }},
      { desc: '边界标识法：每块头与尾均存大小与使用标记', draw: function() {
        ctx.clearRect(0,0,W,H); ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);
        const x=120,w=360;
        ctx.fillStyle='#1e293b'; ctx.fillRect(x,memY,w,memH);
        ctx.strokeStyle='#10b981'; ctx.lineWidth=1.5; ctx.strokeRect(x,memY,w,memH);
        ctx.fillStyle='#3b82f644'; ctx.fillRect(x,memY,w,16);
        ctx.fillStyle='#cbd5e1'; ctx.font='10px "Segoe UI",system-ui,sans-serif'; ctx.textAlign='left';
        ctx.fillText('Header: size=128  tag=1', x+8, memY+11);
        ctx.fillStyle='#94a3b8'; ctx.textAlign='center'; ctx.fillText('用户数据区', x+w/2, memY+34);
        ctx.fillStyle='#3b82f644'; ctx.fillRect(x,memY+memH-16,w,16);
        ctx.fillStyle='#cbd5e1'; ctx.textAlign='left';
        ctx.fillText('Footer: size=128  tag=1', x+8, memY+memH-4);
        note('边界标识法：块头尾冗余存 size/tag，便于 O(1) 判断相邻块空闲以合并');
      }},
      { desc: '分配时查块头 size 与 tag 找到可用空闲块', draw: function() {
        ctx.clearRect(0,0,W,H); ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);
        blk(40,120,false,'空闲 200'); blk(166,90,true,'已分配'); blk(261,140,false,'空闲 280', true); blk(406,80,true,'已分配'); blk(491,90,false,'空闲 120');
        const x=261;
        ctx.fillStyle='#f59e0b'; ctx.font='10px "Segoe UI",system-ui,sans-serif'; ctx.textAlign='left';
        ctx.fillText('^ Header.size=280 >= req -> 命中', x, memY-8);
        note('分配流程：遍历块头，比较 size 且 tag=0(空闲) 即命中');
      }},
      { desc: '空闲块过大则分割：已用块 + 剩余空闲块', draw: function() {
        ctx.clearRect(0,0,W,H); ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);
        blk(261,70,true,'已用 70'); blk(336,70,false,'剩余 210'); blk(40,120,false,'空闲 200'); blk(166,90,true,'已分配'); blk(411,80,true,'已分配'); blk(496,90,false,'空闲 120');
        note('分割后剩余部分作为新空闲块挂回空闲链表，避免浪费');
      }},
      { desc: '释放时先将本块 tag 改写为 0（空闲）', draw: function() {
        ctx.clearRect(0,0,W,H); ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);
        blk(261,70,false,'已用->空闲', true);
        const x=261;
        ctx.fillStyle='#f59e0b'; ctx.font='10px "Segoe UI",system-ui,sans-serif'; ctx.textAlign='left';
        ctx.fillText('tag: 1 -> 0', x, memY-8);
        note('释放只改标记；真正合并在下一步借前后块 Footer/Header 判断');
      }},
      { desc: '边界标识法 O(1) 合并前后空闲块', draw: function() {
        ctx.clearRect(0,0,W,H); ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);
        blk(176,80,false,'前空闲'); blk(261,70,false,'本块', true); blk(336,80,false,'后空闲');
        ctx.strokeStyle='#f59e0b'; ctx.lineWidth=2; ctx.setLineDash([5,4]);
        ctx.strokeRect(176, memY-6, 240, memH+12); ctx.setLineDash([]);
        note('查前块 Footer、后块 Header 的 tag，均为 0 即合并成 230B 大块');
      }},
      { desc: '伙伴系统：所有内存块大小均为 2 的幂', draw: function() {
        ctx.clearRect(0,0,W,H); ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);
        const bx=120,bw=360,by=memY,bh=memH;
        ctx.fillStyle='#1e293b'; ctx.fillRect(bx,by,bw,bh); ctx.strokeStyle='#475569'; ctx.lineWidth=1; ctx.strokeRect(bx,by,bw,bh);
        ctx.fillStyle='#fff'; ctx.font='bold 12px "Segoe UI",system-ui,sans-serif'; ctx.textAlign='center';
        ctx.fillText('1 MB 整块（2^10）', bx+bw/2, by+bh/2+4);
        note('伙伴系统：内存按 2^k 划分，分配前先向上取整到 2 的幂');
      }},
      { desc: '分配 128KB：1MB->512K->256K->128K 逐级二分', draw: function() {
        ctx.clearRect(0,0,W,H); ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);
        const bx=120,bw=360,by=memY,bh=memH;
        ctx.strokeStyle='#475569'; ctx.lineWidth=1;
        ctx.fillStyle='#1e293b'; ctx.fillRect(bx,by,bw,bh);
        ctx.beginPath(); ctx.moveTo(bx+bw/2,by); ctx.lineTo(bx+bw/2,by+bh); ctx.stroke();
        ctx.fillStyle='#1e293b'; ctx.fillRect(bx,by,bw/2,bh); ctx.fillRect(bx+bw/2,by,bw/2,bh);
        ctx.beginPath(); ctx.moveTo(bx+bw/4,by); ctx.lineTo(bx+bw/4,by+bh); ctx.moveTo(bx+3*bw/4,by); ctx.lineTo(bx+3*bw/4,by+bh); ctx.stroke();
        ctx.fillStyle='rgba(16,185,129,0.2)'; ctx.fillRect(bx,by,bw/4,bh);
        ctx.strokeStyle='#10b981'; ctx.lineWidth=2; ctx.strokeRect(bx,by,bw/4,bh);
        ctx.fillStyle='#fff'; ctx.font='bold 11px "Segoe UI",system-ui,sans-serif'; ctx.textAlign='center';
        ctx.fillText('128KB', bx+bw/8, by+bh/2+4);
        note('每级对半分；128KB = 2^7，从 1MB 递归分裂 3 次得到');
      }},
      { desc: '碎片问题与垃圾回收：外部碎片 / 内部碎片 / 标记-清除', draw: function() {
        ctx.clearRect(0,0,W,H); ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);
        blk(40,60,false,'10'); blk(105,40,true,'已用'); blk(150,30,false,'8'); blk(185,55,true,'已用'); blk(245,35,false,'12'); blk(285,50,true,'已用'); blk(340,25,false,'6');
        note('外部碎片：空闲块零散难利用 -> 紧凑(compaction)；内部碎片：分配块内浪费；GC 用标记-清除回收');
      }},
    ];

  },


  _gen_ds_8_1() {
    const W = this.W, H = this.H, ctx = this.ctx;
    const memY = 64, memH = 46;
    const blk = (x, w, used, label, hi, sub) => {
      ctx.fillStyle = used ? 'rgba(59,130,246,0.27)' : (hi ? 'rgba(245,158,11,0.22)' : 'rgba(16,185,129,0.14)');
      ctx.fillRect(x, memY, w, memH);
      ctx.strokeStyle = hi ? '#f59e0b' : (used ? '#3b82f6' : '#10b981');
      ctx.lineWidth = hi ? 2.5 : 1.5;
      ctx.strokeRect(x, memY, w, memH);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 10px "Segoe UI",system-ui,sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(label, x + w / 2, memY + 20);
      if (sub) { ctx.font = '9px "Segoe UI",system-ui,sans-serif'; ctx.fillText(sub, x + w / 2, memY + 36); }
    };
    const arrow = (x, y, t) => { ctx.strokeStyle='#f59e0b'; ctx.fillStyle='#f59e0b'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(x,y+18); ctx.lineTo(x,y+34); ctx.stroke(); ctx.beginPath(); ctx.arc(x,y+34,6,0,Math.PI*2); ctx.fill(); ctx.font='11px "Segoe UI",system-ui,sans-serif'; ctx.textAlign='center'; ctx.fillText(t, x, y+52); };
    const note = (t) => { ctx.fillStyle = '#94a3b8'; ctx.font = '11px "Segoe UI",system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.fillText(t, W / 2, H - 28); };
    this.steps = [
      { desc: '堆区由空闲链表管理，malloc/free 维护链表', draw: function() {
        ctx.clearRect(0,0,W,H); ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);
        blk(40,100,true,'已用'); blk(145,80,false,'空闲 80'); blk(230,150,true,'已用'); blk(385,120,false,'空闲 120'); blk(510,90,true,'已用');
        note('空闲链表串起所有空闲块；分配取下一块，释放归还并合并相邻');
      }},
      { desc: 'malloc：遍历链表找足够大的块，必要时分割', draw: function() {
        ctx.clearRect(0,0,W,H); ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);
        blk(40,100,true,'已用'); blk(145,80,false,'空闲 80', true); blk(230,150,true,'已用'); blk(385,120,false,'空闲 120'); blk(510,90,true,'已用');
        arrow(185, memY, '找块');
        note('找到后若块过大则分割，返回用户指针，剩余挂回链表');
      }},
      { desc: 'free：归还块并与前后空闲块合并(coalescing)', draw: function() {
        ctx.clearRect(0,0,W,H); ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);
        blk(145,80,false,'前空闲'); blk(230,70,false,'本块', true); blk(305,80,false,'后空闲');
        ctx.strokeStyle='#f59e0b'; ctx.setLineDash([5,4]); ctx.lineWidth=2; ctx.strokeRect(145,memY-6,240,memH+12); ctx.setLineDash([]);
        note('合并避免空闲块越切越碎，是减少外部碎片的关键');
      }},
      { desc: '首次适应 First Fit：选第一个够大的空闲块', draw: function() {
        ctx.clearRect(0,0,W,H); ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);
        blk(40,100,true,'已用'); blk(145,80,false,'空闲 80', true); blk(230,150,true,'已用'); blk(385,120,false,'空闲 120'); blk(510,90,true,'已用');
        arrow(185, memY, 'Req 70 -> 命中80');
        note('请求 70B：从低地址第一个 >=70 的块(80B)分配，O(n) 扫描');
      }},
      { desc: '首次适应分配后：剩 10B 挂链，低地址易生碎片', draw: function() {
        ctx.clearRect(0,0,W,H); ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);
        blk(145,70,true,'已用 70'); blk(220,10,false,'剩 10', true); blk(40,100,true,'已用'); blk(235,150,true,'已用'); blk(390,120,false,'空闲 120'); blk(515,90,true,'已用');
        note('首次适应：速度快，但低地址碎片多、大块被切小');
      }},
      { desc: '最佳适应 Best Fit：选最接近请求大小的块', draw: function() {
        ctx.clearRect(0,0,W,H); ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);
        blk(145,80,false,'空闲 80', true); blk(385,120,false,'空闲 120');
        blk(40,100,true,'已用'); blk(230,150,true,'已用'); blk(510,90,true,'已用');
        arrow(185, memY, 'Req 70 -> 选80(更近)');
        note('需扫描全部空闲块找最小满足者，碎片更小但更零散');
      }},
      { desc: '最佳适应分配后：剩 10B 小碎片难再利用', draw: function() {
        ctx.clearRect(0,0,W,H); ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);
        blk(145,70,true,'已用 70'); blk(220,10,false,'剩 10', true); blk(40,100,true,'已用'); blk(230,150,true,'已用'); blk(385,120,false,'空闲 120'); blk(510,90,true,'已用');
        note('最佳适应：保留大块但产生大量难以利用的小碎片');
      }},
      { desc: '下次适应 Next Fit：从上次位置继续，不回绕开头', draw: function() {
        ctx.clearRect(0,0,W,H); ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);
        blk(40,100,true,'已用'); blk(145,80,false,'空闲 80'); blk(230,150,true,'已用'); blk(385,120,false,'空闲 120', true); blk(510,90,true,'已用');
        arrow(445, memY, '从上次位置起');
        note('Next Fit：维护游标，分配更快，碎片分布更均匀');
      }},
      { desc: '三种算法对比：速度 / 碎片 / 实现复杂度', draw: function() {
        ctx.clearRect(0,0,W,H); ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);
        const rows = [
          ['算法', '扫描', '碎片', '特点'],
          ['首次适应', 'O(n)', '中', '最快，低址碎片多'],
          ['最佳适应', 'O(n)', '小但散', '省空间，小碎片多'],
          ['下次适应', '~O(1)', '较均匀', '速度优先'],
        ];
        ctx.textAlign='left'; ctx.font='11px "Segoe UI",system-ui,sans-serif';
        rows.forEach((r,yi)=>{ r.forEach((c,xi)=>{ ctx.fillStyle = yi===0?'#f59e0b':'#cbd5e1'; ctx.fillText(c, 70+xi*150, memY+14+yi*26); }); });
        note('实际系统(如 glibc)常用首次/下次适应的变体，并配合分离空闲链表');
      }},
    ];

  },


  /* ═══════ Ch9 查找 ═══════ */

  _gen_ds_9_0() {
    const W = this.W, H = this.H, ctx = this.ctx;
    const arr = [5,13,19,21,37,56,64,75,80,88,92];
    this.steps = [
      { desc: '顺序查找: 从左到右逐个比较 O(n)', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        const bw=52,start=20,my=60;
        arr.forEach((v,i)=>{
          ctx.fillStyle='#1e293b';ctx.fillRect(start+i*bw,my,bw-2,50);
          ctx.strokeStyle='#475569';ctx.lineWidth=1;ctx.strokeRect(start+i*bw,my,bw-2,50);
          ctx.fillStyle='#fff';ctx.font='bold 13px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
          ctx.fillText(v,start+i*bw+bw/2-1,my+32);
        });
        // Highlight search for 64
        ctx.fillStyle='#f59e0b44';ctx.fillRect(start+6*bw,my,bw-2,50);
        ctx.strokeStyle='#f59e0b';ctx.lineWidth=2.5;ctx.strokeRect(start+6*bw,my,bw-2,50);
        ctx.fillText('64',start+6*bw+bw/2-1,my+32);
        ctx.fillStyle='#fff';ctx.font='13px "Segoe UI",system-ui,sans-serif';
        ctx.fillText('找64: 比较1-6次成功, 平均比较(n+1)/2 = 6次',W/2,my+90);
        ctx.fillStyle='#94a3b8';ctx.font='11px "Segoe UI",system-ui,sans-serif';
        ctx.fillText('顺序查找 O(n)  适合无序表、小表',W/2,my+115);
      }},
      { desc: '折半查找 (二分): 有序表, O(log n)', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        const bw=52,start=20,my=60;
        arr.forEach((v,i)=>{
          ctx.fillStyle='#1e293b';ctx.fillRect(start+i*bw,my,bw-2,50);
          ctx.strokeStyle='#475569';ctx.lineWidth=1;ctx.strokeRect(start+i*bw,my,bw-2,50);
          ctx.fillStyle='#fff';ctx.font='bold 13px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
          ctx.fillText(v,start+i*bw+bw/2-1,my+32);
        });
        // Show binary search finding 64: mid=5(37)<64, lo=6; mid=8(80)>64, hi=7; mid=6(64) found
        ctx.fillStyle='#10b98144';ctx.fillRect(start+5*bw,my,bw-2,50);ctx.strokeStyle='#f59e0b';ctx.lineWidth=2.5;ctx.strokeRect(start+5*bw,my,bw-2,50);
        ctx.fillStyle='#10b98144';ctx.fillRect(start+8*bw,my,bw-2,50);ctx.strokeStyle='#3b82f6';ctx.lineWidth=2.5;ctx.strokeRect(start+8*bw,my,bw-2,50);
        ctx.fillStyle='#10b98144';ctx.fillRect(start+6*bw,my,bw-2,50);ctx.strokeStyle='#10b981';ctx.lineWidth=3;ctx.strokeRect(start+6*bw,my,bw-2,50);
        ctx.fillStyle='#fff';ctx.font='12px "Segoe UI",system-ui,sans-serif';
        ctx.fillText('中间值37<64→右半',start+5*bw+bw/2-1,my+75);
        ctx.fillText('中间值80>64→左半',start+8*bw+bw/2-1,my+75);
        ctx.fillText('中间值64=64✓',start+6*bw+bw/2-1,my+75);
        ctx.fillText('找64: 比较3次找到, 最多⌈log₂(11+1)⌉=4次',W/2,my+110);
        ctx.fillText('二分查找 仅有序表 O(log n)',W/2,my+130);
      }},
      { desc: '分块查找: 块内无序，块间有序 O(√n)', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        // 3 blocks
        const blocks = [
          {x:30,vals:[5,21,13],max:21},{x:190,vals:[37,56,64],max:64},{x:350,vals:[75,88,92,80],max:92}
        ];
        blocks.forEach(b=>{
          ctx.strokeStyle='#475569';ctx.lineWidth=1;ctx.strokeRect(b.x-5,50,140,60);
          ctx.fillStyle='#f59e0b';ctx.font='bold 10px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
          ctx.fillText('max='+b.max,b.x+65,40);
          b.vals.forEach((v,i)=>{
            ctx.fillStyle='#1e293b';ctx.fillRect(b.x+i*30,60,26,34);
            ctx.strokeStyle='#475569';ctx.lineWidth=1;ctx.strokeRect(b.x+i*30,60,26,34);
            ctx.fillStyle='#fff';ctx.font='bold 11px "Segoe UI",system-ui,sans-serif';
            ctx.fillText(v,b.x+i*30+13,82);
          });
        });
        ctx.fillStyle='#94a3b8';ctx.font='11px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
        ctx.fillText('分块查找: 先查索引表(块间)确定块→再查块内  O(√n)  折中方案',W/2,H-28);
      }},
    ];
  },

  _gen_ds_9_1() {
    const W = this.W, H = this.H, ctx = this.ctx;
    const tree = [
      {id:0,v:8,x:W/2,y:32},{id:1,v:3,x:W/2-90,y:90},{id:2,v:10,x:W/2+90,y:90},
      {id:3,v:1,x:W/2-140,y:160},{id:4,v:6,x:W/2-40,y:160},{id:5,v:14,x:W/2+120,y:160}
    ];
    const edges = [[0,1],[0,2],[1,3],[1,4],[2,5]];
    this.steps = [
      { desc: '二叉排序树 (BST): 左小右大, 中序遍历递增', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        edges.forEach(([p,c])=>{
          ctx.beginPath();ctx.moveTo(tree[p].x,tree[p].y+16);ctx.lineTo(tree[c].x,tree[c].y-16);
          ctx.strokeStyle='#475569';ctx.lineWidth=1.5;ctx.stroke();
        });
        tree.forEach(t=>{_drawNode(ctx,t.x,t.y,t.v.toString(),'#1e293b','#10b981');});
        ctx.fillStyle='#fff';ctx.font='12px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
        ctx.fillText('中序遍历: 1,3,6,8,10,14 → 递增有序',W/2,H-28);
      }},
      { desc: 'BST查找10: 8<10→右子树 → 找到! 比较2次', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        edges.forEach(([p,c])=>{
          ctx.beginPath();ctx.moveTo(tree[p].x,tree[p].y+16);ctx.lineTo(tree[c].x,tree[c].y-16);
          ctx.strokeStyle='#475569';ctx.lineWidth=1.5;ctx.stroke();
        });
        tree.forEach(t=>{_drawNode(ctx,t.x,t.y,t.v.toString(),'#1e293b','#475569');});
        // Highlight path
        _drawNode(ctx,tree[0].x,tree[0].y,'8','#f59e0b44','#f59e0b',3);
        _drawNode(ctx,tree[2].x,tree[2].y,'10','#10b98144','#10b981',3);
        ctx.beginPath();ctx.moveTo(tree[0].x,tree[0].y+16);ctx.lineTo(tree[2].x,tree[2].y-16);
        ctx.strokeStyle='#f59e0b';ctx.lineWidth=2.5;ctx.stroke();
        ctx.fillStyle='#fff';ctx.font='11px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
        ctx.fillText('8<10→右',tree[0].x+60,tree[0].y+8);
      }},
      { desc: 'BST插入5: 8>5左→3<5右→6>5左→插入空位', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        const with5 = tree.concat([{id:6,v:5,x:W/2-70,y:220}]);
        [[0,1],[0,2],[1,3],[1,4],[2,5],[4,6]].forEach(([p,c])=>{
          ctx.beginPath();ctx.moveTo(with5[p].x,with5[p].y+16);ctx.lineTo(with5[c].x,with5[c].y-16);
          ctx.strokeStyle='#475569';ctx.lineWidth=1.5;ctx.stroke();
        });
        with5.forEach(t=>{_drawNode(ctx,t.x,t.y,t.v.toString(),t.id===6?'#10b98144':'#1e293b',t.id===6?'#10b981':'#475569');});
        _drawNode(ctx,with5[6].x,with5[6].y,'5','#10b98144','#10b981',3);
      }},
      { desc: 'BST删除叶子6: 直接移除, 中序仍有序', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        const dxL=-190, dxR=190;
        const sh=(t,dx)=>({x:t.x+dx,y:t.y,v:t.v,id:t.id});
        // 删除前(左): 高亮6及其边
        edges.forEach(([p,c])=>{
          const a=sh(tree[p],dxL), b=sh(tree[c],dxL);
          ctx.beginPath();ctx.moveTo(a.x,a.y+16);ctx.lineTo(b.x,b.y-16);
          ctx.strokeStyle=(p===1&&c===4)?'#ef4444':'#475569';ctx.lineWidth=1.5;ctx.stroke();
        });
        tree.forEach(t=>{const s=sh(t,dxL);_drawNode(ctx,s.x,s.y,s.v.toString(), t.id===4?'#ef4444':'#1e293b', t.id===4?'#ef4444':'#475569');});
        // 删除后(右): 无6
        const after = tree.filter(t=>t.id!==4);
        const edgesA = edges.filter(([p,c])=>c!==4&&p!==4);
        edgesA.forEach(([p,c])=>{
          const a=sh(tree[p],dxR), b=sh(tree[c],dxR);
          ctx.beginPath();ctx.moveTo(a.x,a.y+16);ctx.lineTo(b.x,b.y-16);
          ctx.strokeStyle='#10b981';ctx.lineWidth=1.5;ctx.stroke();
        });
        after.forEach(t=>{const s=sh(t,dxR);_drawNode(ctx,s.x,s.y,s.v.toString(),'#1e293b','#10b981');});
        // 箭头
        ctx.fillStyle='#f59e0b';ctx.font='bold 14px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
        ctx.fillText('→ 删除 →',W/2,32);
        ctx.fillStyle='#fff';ctx.font='11px "Segoe UI",system-ui,sans-serif';
        ctx.fillText('叶子结点直接删; 双支用中序前驱/后继替换',W/2,H-28);
      }},
    ];
  },

  _gen_ds_9_2() {
    const W = this.W, H = this.H, ctx = this.ctx;
    const cx = W / 2;
    const edge = (a,b,c,lw)=>{ctx.beginPath();ctx.moveTo(a.x,a.y+14);ctx.lineTo(b.x,b.y-14);ctx.strokeStyle=c;ctx.lineWidth=lw||2;ctx.stroke();};
    const node = (n,c)=>_drawNode(ctx,n.x,n.y,n.v,'#1e293b',c);
    this.steps = [
      { desc: 'AVL树: 平衡因子BF=左高-右高, 要求|BF|≤1', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        const t=[{x:cx,y:30,v:'5'},{x:cx-70,y:90,v:'3'},{x:cx+70,y:90,v:'8'},{x:cx-120,y:160,v:'1'},{x:cx-30,y:160,v:'4'},{x:cx+130,y:160,v:'10'}];
        [[0,1],[0,2],[1,3],[1,4],[2,5]].forEach(([p,c])=>edge(t[p],t[c],'#475569',1.5));
        t.forEach(n=>node(n,'#10b981'));
        ctx.fillStyle='#10b981';ctx.font='10px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
        ctx.fillText('BF=0',t[0].x+22,t[0].y);ctx.fillText('BF=0',t[1].x+20,t[1].y);ctx.fillText('BF=-1',t[2].x+22,t[2].y);
        ctx.fillText('BF=0',t[3].x+20,t[3].y);ctx.fillText('BF=0',t[4].x+20,t[4].y);ctx.fillText('BF=0',t[5].x+22,t[5].y);
        ctx.fillStyle='#fff';ctx.font='12px "Segoe UI",system-ui,sans-serif';
        ctx.fillText('任意结点左右子树高度差 ≤ 1',cx,210);
      }},
      { desc: 'LL型: 左子树的左子树过高 → 对A右旋', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        const L=[{x:cx-180,y:140,v:'3'},{x:cx-220,y:190,v:'2'},{x:cx-240,y:240,v:'1'}];
        edge(L[0],L[1],'#ef4444',2);edge(L[1],L[2],'#ef4444',2);L.forEach(n=>node(n,'#ef4444'));
        const R=[{x:cx+180,y:160,v:'2'},{x:cx+130,y:210,v:'1'},{x:cx+230,y:210,v:'3'}];
        edge(R[0],R[1],'#10b981',2);edge(R[0],R[2],'#10b981',2);R.forEach(n=>node(n,'#10b981'));
        ctx.fillStyle='#f59e0b';ctx.font='bold 16px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
        ctx.fillText('→ 右旋 →',cx,180);
        ctx.fillText('LL → 单右旋',cx+180,265);
      }},
      { desc: 'RR型: 右子树的右子树过高 → 对A左旋', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        const L=[{x:cx+180,y:140,v:'1'},{x:cx+220,y:190,v:'2'},{x:cx+240,y:240,v:'3'}];
        edge(L[0],L[1],'#ef4444',2);edge(L[1],L[2],'#ef4444',2);L.forEach(n=>node(n,'#ef4444'));
        const R=[{x:cx-180,y:160,v:'2'},{x:cx-230,y:210,v:'1'},{x:cx-130,y:210,v:'3'}];
        edge(R[0],R[1],'#10b981',2);edge(R[0],R[2],'#10b981',2);R.forEach(n=>node(n,'#10b981'));
        ctx.fillStyle='#f59e0b';ctx.font='bold 16px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
        ctx.fillText('← 左旋 ←',cx,180);
        ctx.fillText('RR → 单左旋',cx-180,265);
      }},
      { desc: 'LR型: 左子树的右子树过高 → 先左旋B, 再右旋A', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        const L=[{x:cx-180,y:140,v:'5'},{x:cx-240,y:190,v:'3'},{x:cx-200,y:240,v:'4'}];
        edge(L[0],L[1],'#ef4444',2);edge(L[1],L[2],'#ef4444',2);L.forEach(n=>node(n,'#ef4444'));
        const R=[{x:cx+180,y:160,v:'4'},{x:cx+130,y:210,v:'3'},{x:cx+230,y:210,v:'5'}];
        edge(R[0],R[1],'#10b981',2);edge(R[0],R[2],'#10b981',2);R.forEach(n=>node(n,'#10b981'));
        ctx.fillStyle='#f59e0b';ctx.font='bold 15px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
        ctx.fillText('→ 先左旋B → 再右旋A →',cx,180);
        ctx.fillText('LR → 双旋转',cx+180,265);
      }},
      { desc: 'RL型: 右子树的左子树过高 → 先右旋B, 再左旋A', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        const L=[{x:cx-180,y:140,v:'5'},{x:cx-120,y:190,v:'8'},{x:cx-160,y:240,v:'6'}];
        edge(L[0],L[1],'#ef4444',2);edge(L[1],L[2],'#ef4444',2);L.forEach(n=>node(n,'#ef4444'));
        const R=[{x:cx+180,y:160,v:'6'},{x:cx+130,y:210,v:'5'},{x:cx+230,y:210,v:'8'}];
        edge(R[0],R[1],'#10b981',2);edge(R[0],R[2],'#10b981',2);R.forEach(n=>node(n,'#10b981'));
        ctx.fillStyle='#f59e0b';ctx.font='bold 15px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
        ctx.fillText('→ 先右旋B → 再左旋A →',cx,180);
        ctx.fillText('RL → 双旋转',cx+180,265);
      }},
      { desc: '四种失衡类型与调整方式对照', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        const rows=[['LL','在A的左子树的左子树插入','单右旋'],['RR','在A的右子树的右子树插入','单左旋'],['LR','在A的左子树的右子树插入','先左后右'],['RL','在A的右子树的左子树插入','先右后左']];
        ctx.textAlign='left';
        rows.forEach((r,i)=>{
          const y=60+i*50;
          ctx.fillStyle='#1e293b';ctx.fillRect(60,y-22,640,40);
          ctx.strokeStyle='#3b82f6';ctx.lineWidth=1;ctx.strokeRect(60,y-22,640,40);
          ctx.fillStyle='#f59e0b';ctx.font='bold 14px "Segoe UI",system-ui,sans-serif';
          ctx.fillText(r[0],80,y+4);
          ctx.fillStyle='#fff';ctx.font='12px "Segoe UI",system-ui,sans-serif';
          ctx.fillText(r[1],160,y+4);
          ctx.fillStyle='#10b981';ctx.font='bold 13px "Segoe UI",system-ui,sans-serif';ctx.textAlign='right';
          ctx.fillText('→ '+r[2],680,y+4);ctx.textAlign='left';
        });
      }},
    ];
  },

  _gen_ds_9_3() {
    const W = this.W, H = this.H, ctx = this.ctx;
    this.steps = [
      { desc: '哈希表: Hash(key) = key % 11, 链地址法处理冲突', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        const data = [25,14,36,47,58,69,80, 8, 19,30];
        const buckets = [[],[],[],[],[],[],[],[],[],[],[]];
        data.forEach(v=>buckets[v%11].push(v));
        const startX = 15, cellW = 55;
        for(let i=0;i<11;i++){
          const x=startX+i*(cellW+2);
          ctx.fillStyle='#1e293b';ctx.fillRect(x,25,cellW,28);
          ctx.strokeStyle='#10b981';ctx.lineWidth=1;ctx.strokeRect(x,25,cellW,28);
          ctx.fillStyle='#94a3b8';ctx.font='9px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
          ctx.fillText(i,x+cellW/2,19);
          if(buckets[i].length>0){
            const v=buckets[i][0];
            ctx.fillStyle='#10b98144';ctx.fillRect(x,60,cellW,24);
            ctx.strokeStyle='#10b981';ctx.lineWidth=1.5;ctx.strokeRect(x,60,cellW,24);
            ctx.fillStyle='#fff';ctx.font='bold 11px "Segoe UI",system-ui,sans-serif';
            ctx.fillText(v,x+cellW/2,77);
            // Chain
            for(let j=1;j<buckets[i].length;j++){
              const v2=buckets[i][j];
              ctx.fillStyle='#10b98122';ctx.fillRect(x,92+(j-1)*30,cellW,24);
              ctx.strokeStyle='#f59e0b';ctx.lineWidth=1.5;ctx.strokeRect(x,92+(j-1)*30,cellW,24);
              ctx.fillStyle='#fff';ctx.font='bold 11px "Segoe UI",system-ui,sans-serif';
              ctx.fillText(v2,x+cellW/2,109+(j-1)*30);
              ctx.beginPath();ctx.moveTo(x+cellW/2,84+(j-1)*30);ctx.lineTo(x+cellW/2,92+(j-1)*30);
              ctx.strokeStyle='#f59e0b';ctx.lineWidth=1;ctx.stroke();
            }
          }
        }
        ctx.fillStyle='#fff';ctx.font='11px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
        ctx.fillText('H(key)=key%11, 链地址法 O(1+α) α=装填因子',W/2,H-28);
      }},
      { desc: '开放地址法: 线性探测 H(key)+i 再散列', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        const ht = new Array(11).fill(null);
        const insertSeq = [25,14,36, 47, 58];
        const cellW=55, startX=15;
        // Full table
        ht[3]=25;ht[4]=14;ht[2]=47;ht[1]=58;ht[9]=36;
        for(let i=0;i<11;i++){
          const x=startX+i*(cellW+2);
          ctx.fillStyle=ht[i]!==null?'#10b98144':'#1e293b';ctx.fillRect(x,50,cellW,40);
          ctx.strokeStyle=ht[i]!==null?'#10b981':'#475569';ctx.lineWidth=1.5;ctx.strokeRect(x,50,cellW,40);
          ctx.fillStyle='#94a3b8';ctx.font='9px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
          ctx.fillText(i,x+cellW/2,44);
          if(ht[i]!==null){
            ctx.fillStyle='#fff';ctx.font='bold 12px "Segoe UI",system-ui,sans-serif';
            ctx.fillText(ht[i],x+cellW/2,76);
          }
        }
        // Show insertion of 47: 47%11=3 occupied, try 4 occupied, try 5 free
        ctx.fillStyle='#fff';ctx.font='11px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
        ctx.fillText('插入47: H(47)=3 (冲突!)→4 (冲突!)→5 (成功!)',W/2,H-28);
        ctx.fillText('开放地址法: 线性探测 H(key)+i mod m',W/2,130);
      }},
    ];
  },

  /* ═══════ Ch11 外部排序 ═══════ */

  _gen_ds_11_0() {
    const W = this.W, H = this.H, ctx = this.ctx;
    this.steps = [
      { desc: '外部排序: 内存排序→归并段→多路归并', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        // 3-row flow
        const rows = [
          {y:30,label:'磁盘初始文件',color:'#3b82f6',blocks:['R1','R2','R3','R4','R5','R6']},
          {y:95,label:'内存排序→归并段',color:'#f59e0b',blocks:['S1→排序','S2→排序','S3→排序']},
          {y:170,label:'多路归并到磁盘',color:'#10b981',blocks:['归并后有序文件']},
        ];
        rows.forEach(r=>{
          ctx.fillStyle=r.color;ctx.font='bold 10px "Segoe UI",system-ui,sans-serif';ctx.textAlign='left';
          ctx.fillText(r.label,25,r.y+14);
          r.blocks.forEach((b,i)=>{
            ctx.fillStyle=r.color+'33';ctx.fillRect(160+i*85,r.y,78,32);
            ctx.strokeStyle=r.color;ctx.lineWidth=1.5;ctx.strokeRect(160+i*85,r.y,78,32);
            ctx.fillStyle='#fff';ctx.font='10px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
            ctx.fillText(b,160+i*85+39,r.y+21);
          });
          // Arrow down
          if(r.y<150){
            ctx.beginPath();ctx.moveTo(199,r.y+35);ctx.lineTo(199,r.y+65);
            ctx.strokeStyle='#f59e0b';ctx.lineWidth=2;ctx.stroke();
            ctx.beginPath();ctx.moveTo(194,r.y+60);ctx.lineTo(199,r.y+65);ctx.lineTo(204,r.y+60);
            ctx.strokeStyle='#f59e0b';ctx.lineWidth=2;ctx.stroke();
          }
        });
        ctx.fillStyle='#fff';ctx.font='11px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
        ctx.fillText('外部排序核心: I/OmB次I/O 减少归并趟数可大幅加速',W/2,H-28);
      }},
    ];
  },

  _gen_ds_11_1() {
    const W = this.W, H = this.H, ctx = this.ctx;
    this.steps = [
      { desc: 'k路归并: 败者树选出最小值', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        // Draw merge segments
        const segs = [[3,5,8],[1,4,7],[2,6,9]];
        const segX=[80,260,440];
        segs.forEach((s,i)=>{
          ctx.fillStyle='#1e293b';ctx.fillRect(segX[i],30,80,24);
          ctx.strokeStyle='#3b82f6';ctx.lineWidth=1.5;ctx.strokeRect(segX[i],30,80,24);
          ctx.fillStyle='#fff';ctx.font='10px Consolas,monospace';ctx.textAlign='center';
          ctx.fillText(s.join(','),segX[i]+40,47);
        });
        // Current output
        ctx.fillStyle='#10b98144';ctx.fillRect(180,80,200,28);
        ctx.strokeStyle='#10b981';ctx.lineWidth=2;ctx.strokeRect(180,80,200,28);
        ctx.fillStyle='#10b981';ctx.font='11px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
        ctx.fillText('输出: 1,2,3,4,5,6,7,8,9',280,99);
        // Loser tree diagram
        ctx.fillStyle='#f59e0b';ctx.font='11px "Segoe UI",system-ui,sans-serif';
        ctx.fillText('败者树 (Loser Tree)',W/2,150);
        ctx.fillText('每趟比较: 败者树 O(k log k) → 传统 O(k²)',W/2,170);
        // Tree visualization
        const treeNodes = [
          {x:W/2,y:175,v:'最小=1'},{x:W/2-70,y:215,v:'段2①'},{x:W/2+70,y:215,v:'段3②'},
          {x:W/2-150,y:255,v:'段1③'},{x:W/2-30,y:255,v:'段2④'},{x:W/2+100,y:255,v:'段3⑤'}
        ];
        [[0,1],[0,2],[1,3],[1,4],[2,5]].forEach(([a,b])=>{
          ctx.beginPath();ctx.moveTo(treeNodes[a].x,treeNodes[a].y+10);ctx.lineTo(treeNodes[b].x,treeNodes[b].y-10);
          ctx.strokeStyle='#f59e0b';ctx.lineWidth=1;ctx.stroke();
        });
        treeNodes.forEach(t=>{
          ctx.fillStyle='#1e293b';ctx.fillRect(t.x-30,t.y-10,60,22);
          ctx.fillStyle='#f59e0b';ctx.font='10px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
          ctx.fillText(t.v,t.x,t.y+6);
        });
      }},
    ];
  },

  /* ═══════ Ch12 文件 ═══════ */

  _gen_ds_12_0() {
    const W = this.W, H = this.H, ctx = this.ctx;
    this.steps = [
      { desc: '顺序文件: 记录连续存放, 适合批量处理', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        const recs = [{id:101,name:'张三'},{id:102,name:'李四'},{id:103,name:'王五'},{id:104,name:'赵六'}];
        recs.forEach((r,i)=>{
          const y=40+i*55;
          ctx.fillStyle='#1e293b';ctx.fillRect(30,y,200,46);
          ctx.strokeStyle='#3b82f6';ctx.lineWidth=1;ctx.strokeRect(30,y,200,46);
          ctx.fillStyle='#94a3b8';ctx.font='10px "Segoe UI",system-ui,sans-serif';ctx.textAlign='left';
          ctx.fillText('Block '+i,35,y+14);
          ctx.fillStyle='#fff';ctx.font='bold 11px "Segoe UI",system-ui,sans-serif';
          ctx.fillText('ID:'+r.id+' | '+r.name,35,y+34);
        });
      }},
    ];
  },

  _gen_ds_12_1() {
    const W = this.W, H = this.H, ctx = this.ctx;
    this.steps = [
      { desc: '索引顺序文件: 稀疏索引 + 顺序区', draw: function() {
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
        // Index
        ctx.fillStyle='#f59e0b';ctx.font='bold 10px "Segoe UI",system-ui,sans-serif';ctx.textAlign='left';
        ctx.fillText('稀疏索引',30,25);
        const idx = [{key:100,ptr:'B0'},{key:200,ptr:'B3'},{key:300,ptr:'B6'}];
        idx.forEach((e,i)=>{
          const y=40+i*30;
          ctx.fillStyle='#1e293b';ctx.fillRect(30,y,140,22);
          ctx.strokeStyle='#f59e0b';ctx.lineWidth=1;ctx.strokeRect(30,y,140,22);
          ctx.fillStyle='#fff';ctx.font='10px Consolas,monospace';ctx.textAlign='center';
          ctx.fillText('key≤'+e.key+' → '+e.ptr,100,y+16);
        });
        // Data blocks
        ctx.fillStyle='#3b82f6';ctx.font='bold 10px "Segoe UI",system-ui,sans-serif';ctx.textAlign='left';
        ctx.fillText('数据块',200,25);
        [['B0:100-120','B1:130-150','B2:160-190'],
         ['B3:200-220','B4:230-260','B5:270-290'],
         ['B6:300-330','B7:340-360','B8:370-390']].forEach((row,i)=>{
          row.forEach((b,j)=>{
            const x=200+j*115,y=40+i*30;
            ctx.fillStyle='#1e293b';ctx.fillRect(x,y,108,22);
            ctx.strokeStyle='#3b82f6';ctx.lineWidth=1;ctx.strokeRect(x,y,108,22);
            ctx.fillStyle='#fff';ctx.font='9px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
            ctx.fillText(b,x+54,y+16);
          });
        });
        ctx.fillStyle='#fff';ctx.font='11px "Segoe UI",system-ui,sans-serif';ctx.textAlign='center';
        ctx.fillText('查找: 先查索引(块间)定位→再查块内  O(索引层数+块内)',W/2,H-28);
      }},
    ];
  },
};

/* ═══════ 算法映射表 ═══════ */

const dsCoreAlgoMap = {
  '图的基本概念': { kpId: 'ds-7-0', name: '图概念' },
  '图的存储结构': { kpId: 'ds-7-1', name: '存储结构' },
  '图的遍历': { kpId: 'ds-7-2', name: 'DFS/BFS' },
  '最小生成树': { kpId: 'ds-7-3', name: 'Prim' },
  '最短路径': { kpId: 'ds-7-4', name: 'Dijkstra' },
  '拓扑排序与关键路径': { kpId: 'ds-7-5', name: '拓扑排序' },
  '动态存储分配': { kpId: 'ds-8-0', name: '内存管理' },
  '堆的管理': { kpId: 'ds-8-1', name: '堆分配' },
  '静态查找表': { kpId: 'ds-9-0', name: '静态查找' },
  '二叉排序树': { kpId: 'ds-9-1', name: 'BST' },
  '平衡二叉树': { kpId: 'ds-9-2', name: 'AVL' },
  '哈希表': { kpId: 'ds-9-3', name: '哈希表' },
  '外部排序概述': { kpId: 'ds-11-0', name: '外部排序' },
  '最佳归并树': { kpId: 'ds-11-1', name: '败者树' },
  '文件组织方式': { kpId: 'ds-12-0', name: '文件组织' },
  '索引文件与倒排文件': { kpId: 'ds-12-1', name: '索引文件' },
};

/* ═══════ C代码映射表 ═══════ */
const dsCoreCodeMap = {
  '图的基本概念': '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\n#define MAX_V 100\n#define INF 99999\n\ntypedef struct {\n    int n, e;              // 顶点数, 边数\n    int mat[MAX_V][MAX_V]; // 邻接矩阵\n} MGraph;\n\nvoid initGraph(MGraph *G, int n) {\n    G->n = n; G->e = 0;\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < n; j++)\n            G->mat[i][j] = (i == j) ? 0 : INF;\n}\n\nvoid addEdge(MGraph *G, int u, int v, int w) {\n    G->mat[u][v] = w;\n    G->e++;\n}\n\nvoid printDegree(MGraph *G) {\n    for (int i = 0; i < G->n; i++) {\n        int out = 0, in = 0;\n        for (int j = 0; j < G->n; j++) {\n            if (G->mat[i][j] != 0 && G->mat[i][j] != INF) out++;\n            if (G->mat[j][i] != 0 && G->mat[j][i] != INF) in++;\n        }\n        printf("顶点%d: 出度=%d 入度=%d 总度=%d\\n", i, out, in, out+in);\n    }\n}\n\nint main() {\n    MGraph G;\n    initGraph(&G, 5);\n    addEdge(&G, 0, 1, 10);\n    addEdge(&G, 0, 2, 5);\n    addEdge(&G, 1, 3, 3);\n    addEdge(&G, 2, 1, 4);\n    addEdge(&G, 2, 3, 8);\n    addEdge(&G, 3, 4, 1);\n    addEdge(&G, 4, 0, 7);\n    printf("图有%d个顶点 %d条边\\n", G.n, G.e);\n    printDegree(&G);\n    return 0;\n}',

  '图的存储结构': '#include <stdio.h>\n#include <stdlib.h>\n\n#define MAX_V 100\n\ntypedef struct ArcNode {\n    int adjvex;\n    int weight;\n    struct ArcNode *next;\n} ArcNode;\n\ntypedef struct {\n    int data;\n    ArcNode *first;\n} VNode, AdjList[MAX_V];\n\nvoid printMatrix(int mat[][MAX_V], int n) {\n    printf("邻接矩阵:\\n  ");\n    for (int i = 0; i < n; i++) printf("  %d", i);\n    printf("\\n");\n    for (int i = 0; i < n; i++) {\n        printf("%d ", i);\n        for (int j = 0; j < n; j++)\n            printf("%3d", mat[i][j]);\n        printf("\\n");\n    }\n}\n\nvoid printAdjList(AdjList G, int n) {\n    printf("\\n邻接表:\\n");\n    for (int i = 0; i < n; i++) {\n        printf("%d ->", i);\n        ArcNode *p = G[i].first;\n        while (p) {\n            printf(" %d(%d)", p->adjvex, p->weight);\n            p = p->next;\n        }\n        printf("\\n");\n    }\n}\n\nint main() {\n    int n = 3, mat[MAX_V][MAX_V] = {0};\n    mat[0][1] = 10; mat[0][2] = 5;\n    mat[1][2] = 3;\n    printMatrix(mat, n);\n\n    AdjList G;\n    for (int i = 0; i < n; i++) {\n        G[i].data = i;\n        G[i].first = NULL;\n    }\n    // Add edges to adjacency list\n    ArcNode *p;\n    p = (ArcNode*)malloc(sizeof(ArcNode)); p->adjvex=1; p->weight=10; p->next=G[0].first; G[0].first=p;\n    p = (ArcNode*)malloc(sizeof(ArcNode)); p->adjvex=2; p->weight=5;  p->next=G[0].first; G[0].first=p;\n    p = (ArcNode*)malloc(sizeof(ArcNode)); p->adjvex=2; p->weight=3;  p->next=G[1].first; G[1].first=p;\n    printAdjList(G, n);\n    return 0;\n}',

  '图的遍历': '#include <stdio.h>\n#include <stdlib.h>\n\n#define MAX_V 100\n\nint visited[MAX_V];\nint mat[MAX_V][MAX_V];\nint n = 6;\n\nvoid DFS(int v) {\n    visited[v] = 1;\n    printf(" -> %d", v);\n    for (int i = 0; i < n; i++) {\n        if (mat[v][i] && !visited[i])\n            DFS(i);\n    }\n}\n\nvoid BFS(int start) {\n    int q[MAX_V], front = 0, rear = 0;\n    for (int i = 0; i < n; i++) visited[i] = 0;\n    q[rear++] = start;\n    visited[start] = 1;\n    printf("BFS:");\n    while (front < rear) {\n        int v = q[front++];\n        printf(" -> %d", v);\n        for (int i = 0; i < n; i++) {\n            if (mat[v][i] && !visited[i]) {\n                visited[i] = 1;\n                q[rear++] = i;\n            }\n        }\n    }\n    printf("\\n");\n}\n\nint main() {\n    int edges[][2] = {{0,1},{0,2},{1,3},{1,4},{2,5},{3,4}};\n    for (int i = 0; i < 6; i++) {\n        mat[edges[i][0]][edges[i][1]] = 1;\n        mat[edges[i][1]][edges[i][0]] = 1;\n    }\n    printf("DFS 从0开始:");\n    DFS(0);\n    printf("\\n");\n    BFS(0);\n    return 0;\n}',

  '最小生成树': '#include <stdio.h>\n#include <stdlib.h>\n\n#define MAX_V 100\n#define INF 99999\n\nvoid prim(int g[][MAX_V], int n) {\n    int lowcost[MAX_V], closest[MAX_V];\n    int inTree[MAX_V] = {0};\n    int total = 0;\n    \n    inTree[0] = 1;\n    for (int i = 0; i < n; i++) {\n        lowcost[i] = g[0][i];\n        closest[i] = 0;\n    }\n    \n    printf("Prim MST:\\n");\n    for (int t = 1; t < n; t++) {\n        int min = INF, k = -1;\n        for (int j = 0; j < n; j++) {\n            if (!inTree[j] && lowcost[j] < min) {\n                min = lowcost[j]; k = j;\n            }\n        }\n        printf("边(%d,%d) 权=%d\\n", closest[k], k, min);\n        inTree[k] = 1;\n        total += min;\n        for (int j = 0; j < n; j++) {\n            if (!inTree[j] && g[k][j] < lowcost[j]) {\n                lowcost[j] = g[k][j];\n                closest[j] = k;\n            }\n        }\n    }\n    printf("MST总权=%d\\n", total);\n}\n\nint main() {\n    int g[MAX_V][MAX_V], n = 5;\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < n; j++)\n            g[i][j] = (i == j) ? 0 : INF;\n    g[0][1] = 4; g[1][0] = 4;\n    g[0][2] = 8; g[2][0] = 8;\n    g[1][2] = 2; g[2][1] = 2;\n    g[1][3] = 7; g[3][1] = 7;\n    g[2][4] = 5; g[4][2] = 5;\n    g[3][4] = 3; g[4][3] = 3;\n    g[1][4] = 9; g[4][1] = 9;\n    prim(g, n);\n    return 0;\n}',

  '最短路径': '#include <stdio.h>\n#include <stdlib.h>\n\n#define MAX_V 100\n#define INF 99999\n\nvoid dijkstra(int g[][MAX_V], int n, int start) {\n    int dist[MAX_V], visited[MAX_V] = {0};\n    int prev[MAX_V];\n    \n    for (int i = 0; i < n; i++) {\n        dist[i] = g[start][i];\n        prev[i] = (dist[i] < INF) ? start : -1;\n    }\n    dist[start] = 0;\n    visited[start] = 1;\n    \n    for (int t = 1; t < n; t++) {\n        int min = INF, u = -1;\n        for (int j = 0; j < n; j++) {\n            if (!visited[j] && dist[j] < min) {\n                min = dist[j]; u = j;\n            }\n        }\n        if (u == -1) break;\n        visited[u] = 1;\n        for (int v = 0; v < n; v++) {\n            if (!visited[v] && g[u][v] < INF && dist[u] + g[u][v] < dist[v]) {\n                dist[v] = dist[u] + g[u][v];\n                prev[v] = u;\n            }\n        }\n    }\n    \n    printf("Dijkstra 从顶点%d出发:\\n", start);\n    for (int i = 0; i < n; i++) {\n        printf("  到%d: 最短距离=%d\\n", i, dist[i]);\n    }\n}\n\nint main() {\n    int g[MAX_V][MAX_V], n = 5;\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < n; j++)\n            g[i][j] = (i == j) ? 0 : INF;\n    g[0][1] = 10; g[0][3] = 5;\n    g[1][2] = 1;  g[1][3] = 2;\n    g[2][4] = 4;\n    g[3][1] = 3;  g[3][2] = 9;  g[3][4] = 2;\n    g[4][0] = 7;  g[4][2] = 6;\n    dijkstra(g, n, 0);\n    return 0;\n}',

  '拓扑排序与关键路径': '#include <stdio.h>\n#include <stdlib.h>\n\n#define MAX_V 100\n\nint indegree[MAX_V];\nint mat[MAX_V][MAX_V];\n\nvoid topoSort(int n) {\n    int result[MAX_V], idx = 0;\n    int q[MAX_V], front = 0, rear = 0;\n    \n    // 找入度为0的点\n    for (int i = 0; i < n; i++) {\n        int d = 0;\n        for (int j = 0; j < n; j++) d += mat[j][i];\n        indegree[i] = d;\n        if (d == 0) q[rear++] = i;\n    }\n    \n    while (front < rear) {\n        int v = q[front++];\n        result[idx++] = v;\n        for (int i = 0; i < n; i++) {\n            if (mat[v][i]) {\n                indegree[i]--;\n                if (indegree[i] == 0) q[rear++] = i;\n            }\n        }\n    }\n    \n    if (idx < n) {\n        printf("图中有环，无拓扑序列!\\n");\n        return;\n    }\n    printf("拓扑序列: ");\n    for (int i = 0; i < idx; i++)\n        printf("C%d ", result[i] + 1);\n    printf("\\n");\n}\n\nint main() {\n    int n = 6;\n    // 课程依赖: C1→C2,C3  C2→C4  C3→C4,C5  C4→C6  C5→C6\n    mat[0][1] = 1; mat[0][2] = 1;\n    mat[1][3] = 1;\n    mat[2][3] = 1; mat[2][4] = 1;\n    mat[3][5] = 1; mat[4][5] = 1;\n    topoSort(n);\n    return 0;\n}',

  '动态存储分配': '#include <stdio.h>\n#include <stdlib.h>\n\n#define MIN_BLOCK 16\n\ntypedef struct Block {\n    size_t size;\n    int free;\n    struct Block *next, *prev;\n    char data[];\n} Block;\n\nBlock *freeList = NULL;\n\nvoid* myMalloc(size_t size) {\n    Block *cur = freeList;\n    while (cur) {\n        if (cur->free && cur->size >= size) {\n            if (cur->size >= size + sizeof(Block) + MIN_BLOCK) {\n                Block *newBlock = (Block*)(cur->data + size);\n                newBlock->size = cur->size - size - sizeof(Block);\n                newBlock->free = 1;\n                newBlock->next = cur->next;\n                newBlock->prev = cur;\n                if (cur->next) cur->next->prev = newBlock;\n                cur->next = newBlock;\n                cur->size = size;\n            }\n            cur->free = 0;\n            return cur->data;\n        }\n        cur = cur->next;\n    }\n    return NULL;\n}\n\nint main() {\n    // 简单演示伙伴系统思想\n    int total = 1024; // 1KB\n    int allocated = 0;\n    int sizes[] = {128, 256, 64, 512};\n    \n    for (int i = 0; i < 4; i++) {\n        if (allocated + sizes[i] <= total) {\n            allocated += sizes[i];\n            printf("分配 %d B → 剩余 %d B\\n", sizes[i], total - allocated);\n        } else {\n            printf("分配 %d B 失败! (不足)\\n", sizes[i]);\n        }\n    }\n    // 释放\n    allocated -= 256;\n    printf("释放 256 B → 剩余 %d B\\n", total - allocated);\n    allocated -= 128;\n    printf("释放 128 B → 剩余 %d B\\n", total - allocated);\n    return 0;\n}',

  '堆的管理': '#include <stdio.h>\n#include <stdlib.h>\n\n// 首次适应算法\nint firstFit(int blocks[], int n, int req) {\n    for (int i = 0; i < n; i++) {\n        if (blocks[i] >= req) {\n            blocks[i] -= req;\n            return i;\n        }\n    }\n    return -1;\n}\n\n// 最佳适应算法\nint bestFit(int blocks[], int n, int req) {\n    int bestIdx = -1, bestSize = 99999;\n    for (int i = 0; i < n; i++) {\n        if (blocks[i] >= req && blocks[i] < bestSize) {\n            bestSize = blocks[i];\n            bestIdx = i;\n        }\n    }\n    if (bestIdx >= 0) blocks[bestIdx] -= req;\n    return bestIdx;\n}\n\nint main() {\n    int ff[3] = {100, 80, 200};\n    int bf[3] = {100, 80, 200};\n    \n    printf("初始空闲块: 100 80 200\\n请求70B:\\n");\n    \n    int idx1 = firstFit(ff, 3, 70);\n    printf("  首次适应: 分配块%d → 剩余 %d\\n", idx1, ff[idx1]);\n    \n    int idx2 = bestFit(bf, 3, 70);\n    printf("  最佳适应: 分配块%d → 剩余 %d\\n", idx2, bf[idx2]);\n    \n    return 0;\n}',

  '静态查找表': '#include <stdio.h>\n\nint seqSearch(int a[], int n, int key, int *count) {\n    for (int i = 0; i < n; i++) {\n        (*count)++;\n        if (a[i] == key) return i;\n    }\n    return -1;\n}\n\nint binSearch(int a[], int n, int key, int *count) {\n    int lo = 0, hi = n - 1;\n    while (lo <= hi) {\n        (*count)++;\n        int mid = lo + (hi - lo) / 2;\n        if (a[mid] == key) return mid;\n        else if (a[mid] < key) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}\n\nint main() {\n    int sorted[] = {5, 13, 19, 21, 37, 56, 64, 75, 80, 88, 92};\n    int n = 11, key = 64, count = 0;\n    \n    int r1 = seqSearch(sorted, n, key, &count);\n    printf("顺序查找 %d: 位置=%d, 比较%d次\\n", key, r1, count);\n    \n    count = 0;\n    int r2 = binSearch(sorted, n, key, &count);\n    printf("折半查找 %d: 位置=%d, 比较%d次\\n", key, r2, count);\n    return 0;\n}',

  '二叉排序树': '#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct BSTNode {\n    int key;\n    struct BSTNode *left, *right;\n} BSTNode;\n\nBSTNode* insert(BSTNode *root, int key) {\n    if (!root) {\n        BSTNode *node = (BSTNode*)malloc(sizeof(BSTNode));\n        node->key = key;\n        node->left = node->right = NULL;\n        return node;\n    }\n    if (key < root->key) root->left = insert(root->left, key);\n    else if (key > root->key) root->right = insert(root->right, key);\n    return root;\n}\n\nBSTNode* search(BSTNode *root, int key) {\n    if (!root || root->key == key) return root;\n    if (key < root->key) return search(root->left, key);\n    return search(root->right, key);\n}\n\nvoid inorder(BSTNode *root) {\n    if (!root) return;\n    inorder(root->left);\n    printf("%d ", root->key);\n    inorder(root->right);\n}\n\nint main() {\n    int keys[] = {8, 3, 10, 1, 6, 14};\n    BSTNode *root = NULL;\n    for (int i = 0; i < 6; i++)\n        root = insert(root, keys[i]);\n    \n    printf("中序遍历: ");\n    inorder(root);\n    printf("\\n");\n    \n    BSTNode *res = search(root, 10);\n    printf("查找10: %s\\n", res ? "找到!" : "未找到");\n    res = search(root, 99);\n    printf("查找99: %s\\n", res ? "找到!" : "未找到");\n    return 0;\n}',

  '平衡二叉树': '#include <stdio.h>\n#include <stdlib.h>\n\n#define max(a,b) ((a)>(b)?(a):(b))\n\ntypedef struct AVLNode {\n    int key, height;\n    struct AVLNode *left, *right;\n} AVLNode;\n\nint height(AVLNode *n) { return n ? n->height : 0; }\nint getBF(AVLNode *n) { return n ? height(n->left) - height(n->right) : 0; }\n\nAVLNode* rightRotate(AVLNode *y) {\n    AVLNode *x = y->left, *T2 = x->right;\n    x->right = y; y->left = T2;\n    y->height = max(height(y->left), height(y->right)) + 1;\n    x->height = max(height(x->left), height(x->right)) + 1;\n    return x;\n}\n\nAVLNode* leftRotate(AVLNode *x) {\n    AVLNode *y = x->right, *T2 = y->left;\n    y->left = x; x->right = T2;\n    x->height = max(height(x->left), height(x->right)) + 1;\n    y->height = max(height(y->left), height(y->right)) + 1;\n    return y;\n}\n\nAVLNode* insert(AVLNode *node, int key) {\n    if (!node) {\n        AVLNode *n = (AVLNode*)malloc(sizeof(AVLNode));\n        n->key = key; n->height = 1; n->left = n->right = NULL;\n        return n;\n    }\n    if (key < node->key) node->left = insert(node->left, key);\n    else if (key > node->key) node->right = insert(node->right, key);\n    else return node;\n    \n    node->height = max(height(node->left), height(node->right)) + 1;\n    int bf = getBF(node);\n    \n    // LL\n    if (bf > 1 && key < node->left->key) return rightRotate(node);\n    // RR\n    if (bf < -1 && key > node->right->key) return leftRotate(node);\n    // LR\n    if (bf > 1 && key > node->left->key) {\n        node->left = leftRotate(node->left);\n        return rightRotate(node);\n    }\n    // RL\n    if (bf < -1 && key < node->right->key) {\n        node->right = rightRotate(node->right);\n        return leftRotate(node);\n    }\n    return node;\n}\n\nvoid printInOrder(AVLNode *root) {\n    if (!root) return;\n    printInOrder(root->left);\n    printf("%d(BF=%d) ", root->key, getBF(root));\n    printInOrder(root->right);\n}\n\nint main() {\n    AVLNode *root = NULL;\n    int keys[] = {10, 20, 30, 40, 50, 25};\n    for (int i = 0; i < 6; i++) {\n        root = insert(root, keys[i]);\n        printf("插入%d后: ", keys[i]);\n        printInOrder(root);\n        printf("\\n");\n    }\n    return 0;\n}',

  '哈希表': '#include <stdio.h>\n#include <stdlib.h>\n\n#define SIZE 11\n#define EMPTY -1\n\ntypedef struct HashTable {\n    int table[SIZE];\n    int chain[SIZE][5]; // 链表存储\n    int chainLen[SIZE];\n} HashTable;\n\nint hash(int key) { return key % SIZE; }\n\n// 链地址法插入\nvoid insertChain(HashTable *ht, int key) {\n    int h = hash(key);\n    if (ht->chainLen[h] < 5) {\n        ht->chain[h][ht->chainLen[h]++] = key;\n    }\n}\n\n// 线性探测法插入\nvoid insertLinear(int table[], int key) {\n    int h = hash(key);\n    while (table[h] != EMPTY)\n        h = (h + 1) % SIZE;\n    table[h] = key;\n}\n\nvoid printChain(HashTable *ht) {\n    printf("链地址法哈希表:\\n");\n    for (int i = 0; i < SIZE; i++) {\n        printf("[%2d] ->", i);\n        for (int j = 0; j < ht->chainLen[i]; j++)\n            printf(" %d", ht->chain[i][j]);\n        printf("\\n");\n    }\n}\n\nint main() {\n    HashTable ht = {0};\n    int linear[SIZE];\n    for (int i = 0; i < SIZE; i++) linear[i] = EMPTY;\n    \n    int keys[] = {25, 14, 36, 47, 58, 69, 80};\n    for (int i = 0; i < 7; i++) {\n        insertChain(&ht, keys[i]);\n        insertLinear(linear, keys[i]);\n    }\n    printChain(&ht);\n    \n    printf("\\n线性探测法: ");\n    for (int i = 0; i < SIZE; i++)\n        printf("%d ", linear[i]);\n    printf("\\n");\n    return 0;\n}',

  '外部排序概述': '#include <stdio.h>\n#include <stdlib.h>\n\n// 模拟3路归并\nvoid merge(int a[], int b[], int c[], int out[], int n) {\n    int i = 0, j = 0, k = 0, idx = 0;\n    while (idx < n * 3) {\n        int min = 99999, who = -1;\n        if (i < n && a[i] < min) { min = a[i]; who = 0; }\n        if (j < n && b[j] < min) { min = b[j]; who = 1; }\n        if (k < n && c[k] < min) { min = c[k]; who = 2; }\n        out[idx++] = min;\n        if (who == 0) i++; else if (who == 1) j++; else k++;\n    }\n}\n\nint main() {\n    int a[] = {3, 5, 8, 10};\n    int b[] = {1, 4, 7, 12};\n    int c[] = {2, 6, 9, 11};\n    int out[12], n = 4;\n    \n    merge(a, b, c, out, n);\n    \n    printf("外部排序-3路归并:\\n输入段: [3,5,8,10] [1,4,7,12] [2,6,9,11]\\n\\n输出: ");\n    for (int i = 0; i < 12; i++)\n        printf("%d ", out[i]);\n    printf("\\n\\nI/O分析: 每趟O(n)次读写, n为归并段数");\n    return 0;\n}',

  '最佳归并树': '#include <stdio.h>\n#include <stdlib.h>\n\n#define K 3  // K路归并\n\n// 败者树选出最小值\nint loserTreeSelect(int tree[], int leaves[], int *leafIdx, int n) {\n    int min = 99999, minIdx = -1;\n    for (int i = 0; i < n; i++) {\n        if (leafIdx[i] < 4 && leaves[i * 4 + leafIdx[i]] < min) {\n            min = leaves[i * 4 + leafIdx[i]];\n            minIdx = i;\n        }\n    }\n    if (minIdx >= 0) leafIdx[minIdx]++;\n    return min;\n}\n\nint main() {\n    printf("败者树加速多路归并:\\n");\n    printf(\"K=3路归并, 每趟取最小值比较次数:\\n\");\n    printf(\"  简单比较: K-1 = 2次/元素\\n\");\n    printf(\"  败者树:   log₂K ≈ 1.58次/元素\\n\");\n    printf(\"\\n归并段长度对I/O的影响:\\n\");\n    printf(\"  段数=8, 每段4记录, 2路归并 需 ⌈log₂8⌉=3趟\\n\");\n    printf(\"  段数=8, 每段4记录, 4路归并 需 ⌈log₄8⌉=2趟\\n\");\n    printf(\"  趟数越少, I/O越少, 性能越好!\");\n    return 0;\n}',

  '文件组织方式': '#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct {\n    int id;\n    char name[32];\n    float score;\n} Record;\n\nint main() {\n    Record r1 = {101, "张三", 85.5};\n    Record r2 = {102, "李四", 92.0};\n    Record r3 = {103, "王五", 78.3};\n    \n    printf("顺序文件: 记录连续存储\\n");\n    printf("  按主键ID顺序排列:\\n");\n    printf("  [%3d] %s %.1f\\n", r1.id, r1.name, r1.score);\n    printf("  [%3d] %s %.1f\\n", r2.id, r2.name, r2.score);\n    printf("  [%3d] %s %.1f\\n", r3.id, r3.name, r3.score);\n    printf("\\n  顺序查找: O(n)\\n\");\n    printf("  批量处理: 利用磁道连续存储, 顺序读取高效\\n");\n    return 0;\n}',

  '索引文件与倒排文件': '#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct {\n    int key;\n    int blockAddr;\n} IndexEntry;\n\ntypedef struct {\n    char word[32];\n    int docIDs[10];\n    int count;\n} InvertedEntry;\n\nint main() {\n    // 稀疏索引示例\n    IndexEntry idx[] = {{100, 0}, {200, 3}, {300, 6}};\n    printf("稀疏索引 (每块1个索引项):\\n\");\n    for (int i = 0; i < 3; i++)\n        printf("  key≤%d → 块% d\\n\", idx[i].key, idx[i].blockAddr);\n    \n    // 倒排文件示例\n    printf(\"\\n倒排索引 (关键字→文档列表):\\n\");\n    InvertedEntry inv[] = {{\"数据结构\", {1, 3, 5}, 3}, {\"算法\", {2, 4, 6}, 3}};\n    for (int i = 0; i < 2; i++) {\n        printf(\"  \'%s\' → 文档: \", inv[i].word);\n        for (int j = 0; j < inv[i].count; j++)\n            printf(\"%d \", inv[i].docIDs[j]);\n        printf(\"\\n\");\n    }\n    printf(\"\\nB树索引: 多路平衡查找树, 适合磁盘I/O优化\");\n    return 0;\n}',
};

/* ═══════ 辅助函数 ═══════ */

function _drawNode(ctx, x, y, label, fill, stroke, lw) {
  ctx.beginPath();
  ctx.arc(x, y, 16, 0, Math.PI * 2);
  ctx.fillStyle = fill || '#1e293b';
  ctx.fill();
  ctx.strokeStyle = stroke || '#475569';
  ctx.lineWidth = lw || 1.5;
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 12px "Segoe UI",system-ui,sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x, y);
}

function _drawEdge(ctx, x1, y1, x2, y2, stroke, margin) {
  margin = margin || 16;
  const dx = x2 - x1, dy = y2 - y1, dist = Math.sqrt(dx * dx + dy * dy);
  const mx = dx / dist * margin, my = dy / dist * margin;
  ctx.strokeStyle = stroke || '#475569';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x1 + mx, y1 + my);
  ctx.lineTo(x2 - mx, y2 - my);
  ctx.stroke();
}

function _drawArrow(ctx, x1, y1, x2, y2, color, margin) {
  margin = margin || 16;
  const dx = x2 - x1, dy = y2 - y1, dist = Math.sqrt(dx * dx + dy * dy);
  const mx = dx / dist * margin, my = dy / dist * margin;
  const ex = x2 - mx, ey = y2 - my;
  ctx.strokeStyle = color || '#475569';
  ctx.lineWidth = 1.5;
  ctx.moveTo(x1 + mx, y1 + my);
  ctx.lineTo(ex, ey);
  // arrowhead
  const alpha = 0.4, len = 10;
  const ux = -dx / dist, uy = -dy / dist;
  const px = -uy, py = ux;
  ctx.moveTo(ex, ey);
  ctx.lineTo(ex + ux * len + px * len * alpha, ey + uy * len + py * len * alpha);
  ctx.moveTo(ex, ey);
  ctx.lineTo(ex + ux * len - px * len * alpha, ey + uy * len - py * len * alpha);
}
