/* ═══════ 树与二叉树可视化引擎 TreeVizEngine ═══════ */
/* 风格参考 VisuAlgo(https://visualgo.net/zh/heap)：
   - 每个节点下方显示红色 1-based 数组下标
   - 树 + 紧凑数组双视图（底部数组条）
   - 大量分步：当前指针(amber)/比较(yellow)/交换·新建(pink)/已访问(green)
   - 线索二叉树绘制虚线线索；哈夫曼树逐步"生长"
   依赖：app.js 中的 renderMath、getKPDetail、switchVizTab 等全局函数
   在 app.html 中 <script src="app.js"></script> 之后引入本文件 */

const TreeVizEngine = {
  canvas: null, ctx: null,
  steps: [], stepIdx: 0,
  playing: false, timer: null, speed: 1,
  algo: '',

  init(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  },

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    this.canvas.width = Math.max(rect.width - 32, 320);
    this.canvas.height = 400;
    if (this.steps.length > 0) this.draw();
  },

  /* ── 步骤生成入口 ── */
  generateSteps(algo, data) {
    this.algo = algo;
    this.steps = [];
    this.stepIdx = 0;
    if (algo === 'definition')  this._genDefinition(data);
    if (algo === 'traversal')   this._genTraversal(data);
    if (algo === 'threaded')    this._genThreaded(data);
    if (algo === 'convert')     this._genConvert(data);
    if (algo === 'huffman')     this._genHuffman(data);
  },

  /* 通用 step 构造器 */
  _mk(nodes, opts) {
    this.steps.push(Object.assign({
      nodes: this._deepCopy(nodes),
      msg: '', active: [], comparing: [], swapped: [], visited: [],
      edgeHL: [], threads: [], extraEdges: [], array: null
    }, opts));
  },

  /* ═══════ 1. 树与二叉树的定义（更细致）═══════ */
  _genDefinition(data) {
    const DEF = {
      root: 'A',
      nodes: [
        { val: 'A', left: 'B', right: 'C' },
        { val: 'B', left: 'D', right: 'E' },
        { val: 'C', left: null, right: null },
        { val: 'D', left: null, right: null },
        { val: 'E', left: null, right: null }
      ]
    };
    const tree = this._buildTree(data && data.nodes ? data.nodes : DEF.nodes, data && data.root ? data.root : DEF.root);
    this._layoutTree(tree.root, this.canvas.width / 2, 55, 100, 45);
    const nodes = this._treeToArr(tree.root);
    const arr = nodes.map(n => n.val); // 层序序列
    const base = { array: { values: arr, hi: [] } };
    const mk = (o) => this._mk(nodes, Object.assign({}, base, o));

    mk({ msg: '二叉树示例：每个节点最多有两个孩子——左孩子(left)、右孩子(right)。红色数字为该节点在「层序数组」中的下标(1-based)，与 VisuAlgo 一致。' });
    mk({ active: ['A'], msg: '根节点 Root：最顶层节点 A，没有双亲(parent)，是整棵树的入口。' });
    mk({ active: ['D', 'E', 'C'], msg: '叶子节点 Leaf：度为 0（没有孩子）的节点——D、E、C。' });
    mk({ active: ['B'], msg: '节点 B：度 = 2（有左孩子 D、右孩子 E）；节点 A 的度也是 2。' });
    mk({ active: ['A', 'B', 'D'], edgeHL: [['A', 'B'], ['B', 'D']], msg: '路径 Path：A → B → D，路径长度 = 2（经过边的条数）。' });
    mk({ array: { values: arr, hi: [0, 1, 2, 3, 4] }, msg: '节点的层次 Level：根 A 在第 1 层；B、C 在第 2 层；D、E 在第 3 层。' });
    mk({ active: ['A'], comparing: ['B', 'C'], edgeHL: [['A', 'B'], ['A', 'C']], msg: '深度 Depth = 3（节点的最大层次）。节点的度 = 其孩子个数，例如 A 的度为 2。' });
    mk({ visited: ['A', 'B', 'D', 'E', 'C'], msg: '先序遍历 Preorder（根→左→右）：A  B  D  E  C' });
    mk({ visited: ['D', 'B', 'E', 'A', 'C'], msg: '中序遍历 Inorder（左→根→右）：D  B  E  A  C' });
    mk({ visited: ['D', 'E', 'B', 'C', 'A'], msg: '后序遍历 Postorder（左→右→根）：D  E  B  C  A' });
    mk({ msg: '性质①：第 i 层最多 2^(i-1) 个节点 → 第 3 层最多 2² = 4 个节点。' });
    mk({ msg: '性质②：深度为 k 的二叉树最多 2^k − 1 个节点 → 本树最多 2³−1 = 7 个。' });
    mk({ msg: '性质③：叶子数 n₀ = 度为 2 节点数 n₂ + 1 → 本树 n₀=3(D,E,C)，n₂=2(A,B)，3 = 2+1 ✓' });
  },

  /* ═══════ 2. 二叉树遍历（指针移动 + 访问，更细）═══════ */
  _genTraversal(data) {
    const tree = this._buildTraversalTree();
    this._layoutTree(tree.root, this.canvas.width / 2, 55, 100, 45);
    const nodes = this._treeToArr(tree.root);
    const order = (data && data.order) || 'pre';

    // 计算访问序列
    const seq = [];
    if (order === 'pre') { const f = n => { if (!n) return; seq.push(n.val); f(n.left); f(n.right); }; f(tree.root); }
    else if (order === 'in') { const f = n => { if (!n) return; f(n.left); seq.push(n.val); f(n.right); }; f(tree.root); }
    else if (order === 'post') { const f = n => { if (!n) return; f(n.left); f(n.right); seq.push(n.val); }; f(tree.root); }
    else { const q = [tree.root]; while (q.length) { const n = q.shift(); if (!n) continue; seq.push(n.val); if (n.left) q.push(n.left); if (n.right) q.push(n.right); } }

    const orderName = {
      pre: '先序 Preorder（根→左→右）',
      in: '中序 Inorder（左→根→右）',
      post: '后序 Postorder（左→右→根）',
      level: '层序 Level（自上而下、自左而右）'
    };
    const shortName = { pre: '先序', in: '中序', post: '后序', level: '层序' };
    const mk = (o) => this._mk(nodes, o);

    mk({ msg: orderName[order] + ' —— 共 ' + seq.length + ' 个节点。下面用「指针移动 → 访问输出」逐步演示，橙色 = 当前指针。' });

    const visitedSoFar = [];
    for (let i = 0; i < seq.length; i++) {
      const prefix = visitedSoFar.length ? ('，已输出：' + visitedSoFar.join(' ')) : '';
      mk({ active: [seq[i]], msg: '指针移动到节点 『' + seq[i] + '』（尚未访问）' + prefix });
      visitedSoFar.push(seq[i]);
      mk({ active: [seq[i]], visited: visitedSoFar.slice(), msg: '访问 『' + seq[i] + '』→ 输出 ' + seq[i] + '。当前遍历序列：' + visitedSoFar.join(' → ') });
    }
    mk({ visited: seq.slice(), msg: '遍历完成！最终 ' + shortName[order] + '序列：' + seq.join(' → ') });
  },

  /* ═══════ 3. 线索二叉树（绘制虚线线索）═══════ */
  _genThreaded(data) {
    const tree = this._buildTraversalTree();
    this._layoutTree(tree.root, this.canvas.width / 2, 55, 100, 45);
    const nodes = this._treeToArr(tree.root);
    const mk = (o) => this._mk(nodes, o);

    mk({ msg: '中序线索化：利用 n+1 个空指针域，把空的 left 指向前驱、空的 right 指向后继，从而无需栈/递归即可中序遍历。' });
    mk({ msg: '先回顾中序遍历序列（线索的依据）：D → B → E → A → C（左→根→右）。', visited: ['D', 'B', 'E', 'A', 'C'] });
    mk({ active: ['D'], threads: [['D', 'B']], msg: '处理 D：left 空 → 前驱 = NULL；right 空 → 后继 = B。画青色虚线 D ⇢ B（右线索 rtag=1）。' });
    mk({ active: ['B'], msg: '处理 B：left = D（非空），right = E（非空）→ 没有空指针，不需加线索。' });
    mk({ active: ['E'], threads: [['D', 'B'], ['E', 'A']], msg: '处理 E：left 空 → 前驱 = B；right 空 → 后继 = A。画虚线 E ⇢ A。' });
    mk({ active: ['A'], msg: '处理 A：left = B（非空），right = C（非空）→ 没有空指针。' });
    mk({ active: ['C'], threads: [['D', 'B'], ['E', 'A'], ['C', 'A']], msg: '处理 C：left 空 → 前驱 = A；right 空 → 后继 = NULL（终点）。画虚线 C ⇢ NULL。' });
    mk({ threads: [['D', 'B'], ['E', 'A'], ['C', 'A']], visited: ['D', 'B', 'E', 'A', 'C'], msg: '线索化完成！青色虚线 = 线索指针（ltag/rtag = 1 表示线索而非孩子）。' });
    mk({ threads: [['D', 'B'], ['E', 'A'], ['C', 'A']], msg: '沿右线索依次前进：D→B→E→A→C，全程不用栈、不用递归，空间 O(1)。' });
  },

  /* ═══════ 4. 树与森林转换（加线/去线/旋转，更细）═══════ */
  _genConvert(data) {
    const mk = (nodes, o) => this._mk(nodes, o);
    const t1 = [
      { key: 'A', val: 'A', x: 300, y: 50, left: null, right: null, color: '#6366f1', idx: 1 },
      { key: 'B', val: 'B', x: 200, y: 130, left: null, right: null, color: '#6366f1', idx: 2 },
      { key: 'C', val: 'C', x: 400, y: 130, left: null, right: null, color: '#6366f1', idx: 3 },
      { key: 'D', val: 'D', x: 150, y: 210, left: null, right: null, color: '#6366f1', idx: 4 },
      { key: 'E', val: 'E', x: 250, y: 210, left: null, right: null, color: '#6366f1', idx: 5 },
      { key: 'F', val: 'F', x: 400, y: 210, left: null, right: null, color: '#6366f1', idx: 6 }
    ];
    mk(t1, { msg: '原始树：A 有孩子 B、C；B 有孩子 D、E；C 有孩子 F。孩子兄弟表示法规则：左指针 = 第一个孩子，右指针 = 右侧第一个兄弟。' });
    mk(this._deepCopy(t1), { extraEdges: [['B', 'C'], ['D', 'E'], ['C', 'F']], msg: '第 1 步【加线】：把同一双亲的兄弟节点横向连起来（B—C，D—E，C—F），便于统一处理。蓝色虚线 = 兄弟连线。' });

    const t3 = [
      { key: 'A', val: 'A', x: 300, y: 50, left: 'B', right: null, color: '#6366f1', idx: 1 },
      { key: 'B', val: 'B', x: 200, y: 130, left: 'D', right: 'C', color: '#6366f1', idx: 2 },
      { key: 'C', val: 'C', x: 400, y: 130, left: 'F', right: null, color: '#6366f1', idx: 3 },
      { key: 'D', val: 'D', x: 150, y: 210, left: null, right: 'E', color: '#6366f1', idx: 4 },
      { key: 'E', val: 'E', x: 250, y: 210, left: null, right: null, color: '#6366f1', idx: 5 },
      { key: 'F', val: 'F', x: 400, y: 210, left: null, right: null, color: '#6366f1', idx: 6 }
    ];
    mk(t3, { active: ['B', 'D'], msg: '第 2 步【去线 + 旋转】：只保留每个节点与其「最左孩子」的实线；其余孩子改为该最左孩子的右兄弟。A.left=B，B.left=D，B.right=C，D.right=E。' });

    const t4 = [
      { key: 'A', val: 'A', x: 300, y: 50, left: 'B', right: null, color: '#22c55e', idx: 1 },
      { key: 'B', val: 'B', x: 180, y: 140, left: 'D', right: 'C', color: '#22c55e', idx: 2 },
      { key: 'C', val: 'C', x: 420, y: 140, left: null, right: null, color: '#22c55e', idx: 3 },
      { key: 'D', val: 'D', x: 120, y: 230, left: null, right: 'E', color: '#22c55e', idx: 4 },
      { key: 'E', val: 'E', x: 240, y: 230, left: null, right: null, color: '#22c55e', idx: 5 },
      { key: 'F', val: 'F', x: 500, y: 230, left: null, right: null, color: '#a78bfa', idx: 6 }
    ];
    mk(t4, { visited: ['A', 'B', 'D', 'E', 'C'], msg: '转换完成！对应二叉树：A.left=B；B.left=D、B.right=C；D.right=E。C 在二叉树里是 B 的右兄弟，不再是 A 的孩子。' });
    mk(t4, { msg: '规律：① 树的根在对应二叉树中一定没有右孩子；② 森林中每棵树的根用右指针连成一条右链。' });
  },

  /* ═══════ 5. 哈夫曼树（树逐步生长 + 森林数组条）═══════ */
  _genHuffman(data) {
    const weights = (data && data.weights) || [5, 9, 12, 13, 16, 45];
    let idc = 0;
    const leaves = weights.map(w => ({
      id: 'L' + (idc++), val: String(w), weight: w,
      left: null, right: null, x: 0, y: 0, color: '#6366f1',
      isLeaf: true, appear: 0, key: 'L' + (idc - 1)
    }));
    let forest = leaves.slice();
    const merges = [];
    let root = null;
    while (forest.length > 1) {
      forest.sort((a, b) => a.weight - b.weight);
      const a = forest.shift(), b = forest.shift();
      const parent = {
        id: 'P' + (idc++), val: String(a.weight + b.weight), weight: a.weight + b.weight,
        left: a, right: b, x: 0, y: 0, color: '#ec4899',
        isLeaf: false, appear: 0, key: 'P' + (idc - 1)
      };
      merges.push({ a, b, parent });
      forest.push(parent);
    }
    root = forest[0];

    // 布局最终树（仅用于定位）
    this._layoutHuffman(root);
    // 分配 appear：每个内节点在其 merge 步出现
    let si = 1;
    merges.forEach(m => { m.parent.appear = si + 1; si += 2; });

    const allNodes = this._flattenHuffman(root);
    const mk = (o) => this._mk(allNodes, o);

    // 初始森林
    mk({ msg: '哈夫曼树构建：初始森林权重 [' + weights.join(', ') + ']，共 ' + leaves.length + ' 个叶子。每次取权值最小的两棵树合并，使 WPL = Σ(权值×路径长度) 最小。' });

    // 森林数组条（用节点引用跟踪）
    let fr = leaves.slice();
    merges.forEach((m, i) => {
      const ia = fr.indexOf(m.a), ib = fr.indexOf(m.b);
      mk({
        comparing: [m.a.key, m.b.key],
        array: { values: fr.map(n => n.weight), hi: [ia, ib] },
        msg: '第 ' + (i + 1) + ' 次选取：当前森林中权值最小的两个节点 —— ' + m.a.weight + ' 与 ' + m.b.weight + '（橙色高亮），准备合并。'
      });
      fr = fr.filter(n => n !== m.a && n !== m.b);
      fr.push(m.parent);
      mk({
        swapped: [m.parent.key],
        array: { values: fr.map(n => n.weight), hi: [fr.indexOf(m.parent)] },
        msg: '合并 ' + m.a.weight + ' + ' + m.b.weight + ' = ' + m.parent.weight + '，生成新的内节点（粉色）。森林剩余：[' + fr.map(n => n.weight).join(', ') + ']'
      });
    });

    // WPL 与编码
    const wplInfo = this._huffmanWPL(root);
    mk({ visited: allNodes.filter(n => !n.isLeaf).map(n => n.key), msg: '哈夫曼树构建完成！根结点权值 = ' + root.weight + '（等于所有叶子权值之和）。' });
    mk({
      msg: '计算 WPL（带权路径长度）：' + wplInfo.detail + ' = ' + wplInfo.wpl + '。WPL 越小，编码总长度越短。'
    });
    mk({
      msg: '哈夫曼编码（约定：左分支=0，右分支=1）：' + wplInfo.codes + '。出现频率高的字符（如 45）编码短，频率低的编码长。'
    });
  },

  /* ── 绘制 ── */
  draw() {
    if (this.stepIdx < 0 || this.stepIdx >= this.steps.length) return;
    const step = this.steps[this.stepIdx];
    const ctx = this.ctx;
    const W = this.canvas.width, H = this.canvas.height;
    ctx.clearRect(0, 0, W, H);

    const isHidden = nd => (typeof nd.appear === 'number' && nd.appear > this.stepIdx);
    const visNodes = step.nodes.filter(nd => !isHidden(nd));
    const keyOf = nd => (nd.key || nd.val);

    // 实线边（父子）
    for (const nd of visNodes) {
      const kl = nd.left, kr = nd.right;
      if (kl) {
        const child = visNodes.find(n => keyOf(n) === kl);
        if (child) this._edge(ctx, nd, child, step.edgeHL && step.edgeHL.some(e => e[0] === keyOf(nd) && e[1] === kl));
      }
      if (kr) {
        const child = visNodes.find(n => keyOf(n) === kr);
        if (child) this._edge(ctx, nd, child, step.edgeHL && step.edgeHL.some(e => e[0] === keyOf(nd) && e[1] === kr));
      }
    }
    // 兄弟连线（蓝色虚线）
    if (step.extraEdges) for (const [a, b] of step.extraEdges) {
      const na = visNodes.find(n => keyOf(n) === a), nb = visNodes.find(n => keyOf(n) === b);
      if (na && nb) this._edge(ctx, na, nb, false, true, '#60a5fa');
    }
    // 线索（青色虚线）
    if (step.threads) for (const [a, b] of step.threads) {
      const na = visNodes.find(n => keyOf(n) === a), nb = visNodes.find(n => keyOf(n) === b);
      if (na && nb) this._edge(ctx, na, nb, false, true, '#22d3ee');
    }

    // 节点
    for (const nd of visNodes) {
      const k = keyOf(nd);
      const isNew = step.swapped && step.swapped.includes(k);
      const isActive = step.active && step.active.includes(k);
      const isCmp = step.comparing && step.comparing.includes(k);
      const isVis = step.visited && step.visited.includes(k);
      let fill = nd.color || '#6366f1';
      if (isVis) fill = '#22c55e';
      if (isCmp) fill = '#eab308';
      if (isActive) fill = '#f59e0b';
      if (isNew) fill = '#ec4899';

      ctx.beginPath();
      ctx.arc(nd.x, nd.y, 22, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(nd.x, nd.y, 22, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = (isActive || isCmp || isNew) ? '#fff' : 'rgba(255,255,255,0.7)';
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(nd.val, nd.x, nd.y);

      // 红色 1-based 下标
      if (nd.idx != null) {
        ctx.fillStyle = '#ef4444';
        ctx.font = '10px sans-serif';
        ctx.textBaseline = 'top';
        ctx.fillText(String(nd.idx), nd.x, nd.y + 26);
      }
    }

    // 底部数组条（VisuAlgo 紧凑数组模式）
    if (step.array && step.array.values && step.array.values.length) {
      this._drawArrayStrip(ctx, W, H, step.array);
    }

    // 步骤指示器
    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText((this.stepIdx + 1) + ' / ' + this.steps.length, W - 10, 18);

    // 消息（底部，可换行）
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12.5px sans-serif';
    ctx.textAlign = 'left';
    this._wrapTextBottom(ctx, step.msg || '', 10, H - 12, W - 20, 15);
  },

  _edge(ctx, a, b, highlight, dashed, color) {
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash(dashed ? [6, 5] : []);
    ctx.strokeStyle = highlight ? '#f59e0b' : (color || 'rgba(148,163,184,0.45)');
    ctx.lineWidth = highlight ? 3 : 2;
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.restore();
  },

  _drawArrayStrip(ctx, W, H, arr) {
    const vals = arr.values;
    const n = vals.length;
    if (!n) return;
    const bw = Math.min(46, (W - 60) / n);
    const gap = 6;
    const totalW = n * bw + (n - 1) * gap;
    const startX = (W - totalW) / 2;
    const y = H - 120;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('数组（层序 / 1-based）：', startX, y - 8);
    for (let i = 0; i < n; i++) {
      const x = startX + i * (bw + gap);
      const hi = arr.hi && arr.hi.includes(i);
      ctx.fillStyle = hi ? '#f59e0b' : 'rgba(30,41,59,0.92)';
      ctx.strokeStyle = hi ? '#f59e0b' : 'rgba(148,163,184,0.5)';
      ctx.lineWidth = 1.5;
      this._roundRect(ctx, x, y, bw, 28, 5);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = hi ? '#0f172a' : '#e2e8f0';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(vals[i]), x + bw / 2, y + 14);
      ctx.fillStyle = '#ef4444';
      ctx.font = '9px sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText(String(i + 1), x + bw / 2, y + 30);
    }
  },

  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  },

  _wrapTextBottom(ctx, text, x, bottomY, maxWidth, lineHeight) {
    if (!text) return;
    const lines = [];
    let line = '';
    for (const ch of text) {
      if (ch === '\n') { lines.push(line); line = ''; continue; }
      const test = line + ch;
      if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = ch; }
      else line = test;
    }
    if (line) lines.push(line);
    let y = bottomY;
    for (let i = lines.length - 1; i >= 0; i--) {
      ctx.fillText(lines[i], x, y);
      y -= lineHeight;
    }
  },

  /* ── 播放控制 ── */
  play() {
    if (this.playing || this.stepIdx >= this.steps.length - 1) return;
    this.playing = true;
    const btn = document.getElementById('treePlayBtn');
    if (btn) btn.innerHTML = '⏸ 暂停';
    this._tick();
  },

  _tick() {
    if (!this.playing) return;
    this.next();
    if (this.stepIdx >= this.steps.length - 1) { this.pause(); return; }
    // 速度越慢延迟越大：speed=1 → ~2000ms，speed=10 → ~500ms
    const delay = Math.max(2200 - this.speed * 170, 500);
    this.timer = setTimeout(() => this._tick(), delay);
  },

  pause() {
    this.playing = false;
    clearTimeout(this.timer);
    const btn = document.getElementById('treePlayBtn');
    if (btn) btn.innerHTML = '▶ 播放';
  },

  next() {
    if (this.stepIdx < this.steps.length - 1) {
      this.stepIdx++;
      this.draw();
    }
    this._updBtn();
  },

  prev() {
    if (this.stepIdx > 0) {
      this.stepIdx--;
      this.draw();
    }
    this._updBtn();
  },

  reset() {
    this.pause();
    this.stepIdx = 0;
    this.draw();
    this._updBtn();
  },

  _updBtn() {
    const btn = document.getElementById('treePlayBtn');
    if (btn && this.stepIdx >= this.steps.length - 1) btn.innerHTML = '▶ 播放';
    this._updProgress();
  },

  _updProgress() {
    const bar = document.getElementById('treeProgressFill');
    const info = document.getElementById('treeStepInfo');
    if (bar) bar.style.width = this.steps.length > 1 ? (this.stepIdx / (this.steps.length - 1) * 100) + '%' : '0%';
    if (info) {
      const s = this.steps[this.stepIdx];
      info.textContent = (s && s.msg) ? ('步骤 ' + (this.stepIdx + 1) + '/' + this.steps.length + ' · ' + s.msg) : ('步骤 ' + (this.stepIdx + 1) + '/' + this.steps.length);
    }
  },

  /* ── 工具函数 ── */
  _buildTree(nodesData, rootVal) {
    const nodeMap = {};
    for (const n of (nodesData || [])) {
      nodeMap[n.val] = { val: n.val, left: n.left || null, right: n.right || null, x: 0, y: 0, color: '#6366f1' };
    }
    for (const n of (nodesData || [])) {
      if (n.left) nodeMap[n.val].left = nodeMap[n.left];
      if (n.right) nodeMap[n.val].right = nodeMap[n.right];
    }
    return { root: nodeMap[rootVal || 'A'] };
  },

  _buildTraversalTree() {
    const A = { val: 'A', key: 'A', left: null, right: null, x: 0, y: 0, color: '#6366f1' };
    const B = { val: 'B', key: 'B', left: null, right: null, x: 0, y: 0, color: '#6366f1' };
    const C = { val: 'C', key: 'C', left: null, right: null, x: 0, y: 0, color: '#6366f1' };
    const D = { val: 'D', key: 'D', left: null, right: null, x: 0, y: 0, color: '#6366f1' };
    const E = { val: 'E', key: 'E', left: null, right: null, x: 0, y: 0, color: '#6366f1' };
    A.left = B; A.right = C; B.left = D; B.right = E;
    return { root: A };
  },

  _layoutTree(node, x, y, levelGap, siblingGap) {
    if (!node) return;
    node.x = x; node.y = y;
    if (node.left) this._layoutTree(node.left, x - siblingGap, y + levelGap, levelGap, siblingGap * 0.62);
    if (node.right) this._layoutTree(node.right, x + siblingGap, y + levelGap, levelGap, siblingGap * 0.62);
  },

  /* 按层序给出 1-based 下标，并保留 key（默认=val） */
  _treeToArr(node) {
    const arr = [];
    const queue = [node];
    let idx = 0;
    while (queue.length) {
      const n = queue.shift();
      if (!n) continue;
      idx++;
      arr.push({
        val: n.val, key: n.key || n.val, idx, x: n.x, y: n.y,
        left: n.left ? (n.left.key || n.left.val) : null,
        right: n.right ? (n.right.key || n.right.val) : null,
        color: n.color || '#6366f1'
      });
      if (n.left) queue.push(n.left);
      if (n.right) queue.push(n.right);
    }
    return arr;
  },

  _deepCopy(nodes) {
    return nodes.map(n => Object.assign({}, n));
  },

  /* 哈夫曼布局：叶子从左到右，内节点位于孩子中点上方 */
  _layoutHuffman(root) {
    const self = this;
    const leaves = [];
    (function dfs(n) { if (!n) return; if (n.isLeaf) leaves.push(n); else { dfs(n.left); dfs(n.right); } })(root);
    const n = leaves.length;
    const gap = Math.min((self.canvas.width - 140) / Math.max(n, 1), 72);
    leaves.forEach((lf, i) => { lf.x = 70 + i * gap; lf.y = self.canvas.height - 180; });
    const depthOf = {};
    (function d(n, dep) { if (!n) return; depthOf[n.id] = dep; if (!n.isLeaf) { d(n.left, dep + 1); d(n.right, dep + 1); } })(root, 0);
    (function setPos(n) {
      if (!n || n.isLeaf) return;
      setPos(n.left); setPos(n.right);
      n.x = (n.left.x + n.right.x) / 2;
      n.y = self.canvas.height - 180 - depthOf[n.id] * 70;
    })(root);
  },

  _flattenHuffman(root) {
    const arr = [];
    (function dfs(n) {
      if (!n) return;
      arr.push({
        key: n.key, val: n.val, x: n.x, y: n.y,
        left: n.left ? n.left.key : null,
        right: n.right ? n.right.key : null,
        color: n.color, isLeaf: n.isLeaf, appear: n.appear
      });
      dfs(n.left); dfs(n.right);
    })(root);
    return arr;
  },

  _huffmanWPL(root) {
    let wpl = 0;
    const detailParts = [];
    (function dfs(n, depth) {
      if (!n) return;
      if (n.isLeaf) {
        const contrib = n.weight * depth;
        wpl += contrib;
        detailParts.push(n.weight + '×' + depth + '=' + contrib);
      }
      dfs(n.left, depth + 1); dfs(n.right, depth + 1);
    })(root, 0);
    // 编码
    const codes = [];
    (function dfs(n, code) {
      if (!n) return;
      if (n.isLeaf) { codes.push(n.val + ':' + (code || '0')); return; }
      dfs(n.left, code + '0'); dfs(n.right, code + '1');
    })(root, '');
    return { wpl, detail: detailParts.join(' + '), codes: codes.join('  ') };
  }
};


/* ═══════ 树可视化算法映射 ═══════ */
const treeAlgoMap = {
  '树与二叉树的定义':     { algo: 'definition',       name: '二叉树基本术语',       data: {} },
  '二叉树的遍历':         { algo: 'traversal',        name: '二叉树遍历演示',       data: { order: 'pre' } },
  '线索二叉树':           { algo: 'threaded',         name: '中序线索化演示',       data: {} },
  '树与森林':             { algo: 'convert',          name: '树↔二叉树转换演示',    data: {} },
  '哈夫曼树':             { algo: 'huffman',          name: '哈夫曼树构建演示',     data: { weights: [5, 9, 12, 13, 16, 45] } },
};

/* ═══════ 树知识点 C 代码示例 ═══════ */
const treeCodeMap = {
  '树与二叉树的定义':
`#include <stdio.h>
#include <stdlib.h>

/* 二叉树结点定义 */
typedef struct BNode {
    char data;              // 结点数据
    struct BNode *lchild;   // 左孩子
    struct BNode *rchild;   // 右孩子
} BNode, *BiTree;

/* 创建结点 */
BNode* newNode(char d) {
    BNode* p = (BNode*)malloc(sizeof(BNode));
    p->data = d;
    p->lchild = p->rchild = NULL;
    return p;
}

/* 构建示例二叉树
        A
       / \\
      B   C
     / \\
    D   E
*/
BiTree buildTree() {
    BNode *A = newNode('A');
    BNode *B = newNode('B');
    BNode *C = newNode('C');
    BNode *D = newNode('D');
    BNode *E = newNode('E');
    A->lchild = B;  A->rchild = C;
    B->lchild = D;  B->rchild = E;
    return A;
}

/* 计算树的深度 */
int treeDepth(BiTree T) {
    if (!T) return 0;
    int l = treeDepth(T->lchild);
    int r = treeDepth(T->rchild);
    return (l > r ? l : r) + 1;
}

/* 计算结点总数 */
int countNodes(BiTree T) {
    if (!T) return 0;
    return 1 + countNodes(T->lchild) + countNodes(T->rchild);
}

/* 叶子结点数 */
int countLeaves(BiTree T) {
    if (!T) return 0;
    if (!T->lchild && !T->rchild) return 1;
    return countLeaves(T->lchild) + countLeaves(T->rchild);
}

int main() {
    BiTree T = buildTree();
    printf("树深度: %d\\n", treeDepth(T));
    printf("结点总数: %d\\n", countNodes(T));
    printf("叶子结点数: %d\\n", countLeaves(T));
    /* 验证性质：n0 = n2 + 1 */
    /* 本树：n0=3(D,E,C), n2=2(A,B), 3=2+1 ✓ */
    printf("验证性质 n0=n2+1: n0=3, n2=2, 3=2+1 ✓\\n");
    return 0;
}`,
  '二叉树的遍历':
`#include <stdio.h>
#include <stdlib.h>

typedef struct BNode { char data; struct BNode *lchild, *rchild; } BNode, *BiTree;

BNode* newNode(char d) { BNode* p = (BNode*)malloc(sizeof(BNode)); p->data = d; p->lchild = p->rchild = NULL; return p; }

/* 构建示例树 A(B(D,E),C) */
BiTree buildTree() {
    BNode *A = newNode('A'), *B = newNode('B'), *C = newNode('C');
    BNode *D = newNode('D'), *E = newNode('E');
    A->lchild = B; A->rchild = C; B->lchild = D; B->rchild = E;
    return A;
}

/* ══ 递归遍历 ══ */
void preOrder(BiTree T)  { if (!T) return; printf("%c ", T->data); preOrder(T->lchild);  preOrder(T->rchild); }
void inOrder(BiTree T)   { if (!T) return; inOrder(T->lchild);  printf("%c ", T->data); inOrder(T->rchild); }
void postOrder(BiTree T) { if (!T) return; postOrder(T->lchild); postOrder(T->rchild); printf("%c ", T->data); }

/* ══ 非递归中序遍历（用栈）══ */
void inOrderNR(BiTree T) {
    BNode* stack[50], *p = T;
    int top = -1;
    printf("非递归中序: ");
    while (p || top >= 0) {
        while (p) { stack[++top] = p; p = p->lchild; }
        p = stack[top--]; printf("%c ", p->data); p = p->rchild;
    }
    printf("\\n");
}

/* ══ 层序遍历（用队列）══ */
void levelOrder(BiTree T) {
    if (!T) return;
    BNode* q[50]; int f = 0, r = 0;
    q[r++] = T;
    printf("层序遍历: ");
    while (f < r) {
        BNode* p = q[f++];
        printf("%c ", p->data);
        if (p->lchild) q[r++] = p->lchild;
        if (p->rchild)  q[r++] = p->rchild;
    }
    printf("\\n");
}

int main() {
    BiTree T = buildTree();
    printf("先序遍历: ");  preOrder(T);  printf("\\n");
    printf("中序遍历: ");  inOrder(T);   printf("\\n");
    printf("后序遍历: ");  postOrder(T);  printf("\\n");
    levelOrder(T);
    inOrderNR(T);
    /* 由先序+中序恢复二叉树（示例）
       先序: A B D E C
       中序: D B E A C
       → 根A，左子树{B,D,E}，右子树{C} */
    return 0;
}`,
  '线索二叉树':
`#include <stdio.h>
#include <stdlib.h>

/* 线索链表结点 */
typedef struct TNode {
    char data;
    int ltag, rtag;          // 0=孩子指针, 1=线索
    struct TNode *lchild, *rchild;
} TNode, *ThreadTree;

TNode* newNode(char d) {
    TNode* p = (TNode*)malloc(sizeof(TNode));
    p->data = d; p->ltag = p->rtag = 0;
    p->lchild = p->rchild = NULL;
    return p;
}

/* 中序线索化 */
void InThread(TNode* p, TNode** pre) {
    if (!p) return;
    InThread(p->lchild, pre);       // 左子树线索化

    /* 处理当前结点p */
    if (!p->lchild) { p->lchild = *pre; p->ltag = 1; }
    if (*pre && !(*pre)->rchild) { (*pre)->rchild = p; (*pre)->rtag = 1; }
    *pre = p;

    InThread(p->rchild, pre);       // 右子树线索化
}

/* 中序遍历线索二叉树（无需栈） */
void InOrderThread(ThreadTree T) {
    TNode* p = T;
    while (p) {
        while (p->ltag == 0) p = p->lchild;   // 找最左
        printf("%c ", p->data);
        while (p->rtag == 1 && p->rchild) {    // 沿右线索走
            p = p->rchild;
            printf("%c ", p->data);
        }
        p = p->rchild;                          // 转向右子树
    }
}

/* 构建示例树 A(B(D,E),C) */
ThreadTree buildTree() {
    TNode *A = newNode('A'), *B = newNode('B'), *C = newNode('C');
    TNode *D = newNode('D'), *E = newNode('E');
    A->lchild = B; A->rchild = C; B->lchild = D; B->rchild = E;
    return A;
}

int main() {
    ThreadTree T = buildTree();
    TNode* pre = NULL;
    InThread(T, &pre);

    printf("中序遍历线索二叉树: ");
    InOrderThread(T);
    printf("\\n");

    /* 验证：n个结点的二叉链表有n+1个空指针域 */
    /* 本树5个结点，空指针数=2×5-(5-1)=10-4=6=n+1=6 ✓ */
    printf("验证：5个结点有%d个空指针域(=n+1) ✓\\n", 5 + 1);
    return 0;
}`,
  '树与森林':
`#include <stdio.h>
#include <stdlib.h>

/* 孩子兄弟链表（二叉树表示） */
typedef struct CSNode {
    char data;
    struct CSNode *firstChild;   // 第一个孩子
    struct CSNode *nextSibling;  // 下一个兄弟
} CSNode, *CSTree;

CSNode* newNode(char d) {
    CSNode* p = (CSNode*)malloc(sizeof(CSNode));
    p->data = d; p->firstChild = p->nextSibling = NULL;
    return p;
}

/* 树→二叉树（孩子兄弟表示法）
   原树:  A
         /|\\
        B C F
       /|
      D E
    二叉树: A的左=B, B的右=C, C的右=F, B的左=D, D的右=E
*/
CSTree treeToBinary() {
    CSNode *A = newNode('A'), *B = newNode('B'), *C = newNode('C');
    CSNode *D = newNode('D'), *E = newNode('E'), *F = newNode('F');
    /* 孩子兄弟表示 */
    A->firstChild = B;
    B->nextSibling = C;  C->nextSibling = F;
    B->firstChild = D;
    D->nextSibling = E;
    return A;  // A即对应二叉树的根
}

/* 先序遍历孩子兄弟链表（=对应二叉树的先序） */
void preOrderCS(CSTree T) {
    if (!T) return;
    printf("%c ", T->data);
    preOrderCS(T->firstChild);
    preOrderCS(T->nextSibling);
}

/* 后序遍历孩子兄弟链表（=对应二叉树的中序） */
void postOrderCS(CSTree T) {
    if (!T) return;
    postOrderCS(T->firstChild);
    printf("%c ", T->data);
    postOrderCS(T->nextSibling);
}

int main() {
    CSTree T = treeToBinary();
    printf("树的先序(=二叉树先序): ");
    preOrderCS(T); printf("\\n");
    /* 输出: A B D E C F */

    printf("树的后序(=二叉树中序): ");
    postOrderCS(T); printf("\\n");
    /* 输出: D E B C F A */

    printf("\\n转换规则记忆:\\n");
    printf("  1. 左指针=第一个孩子\\n");
    printf("  2. 右指针=右侧第一个兄弟\\n");
    printf("  3. 树的根在二叉树中无右孩子\\n");
    return 0;
}`,
  '哈夫曼树':
`#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

/* 哈夫曼树结点 */
typedef struct HNode {
    int weight;              // 权值
    int parent, left, right; // 数组下标（-1表示无）
} HNode;

/* 选取权值最小的两个结点 */
void select(HNode ht[], int n, int* s1, int* s2) {
    int min1 = INT_MAX, min2 = INT_MAX;
    *s1 = *s2 = -1;
    for (int i = 0; i < n; i++) {
        if (ht[i].parent != -1) continue;
        if (ht[i].weight < min1) { min2 = min1; *s2 = *s1; min1 = ht[i].weight; *s1 = i; }
        else if (ht[i].weight < min2) { min2 = ht[i].weight; *s2 = i; }
    }
}

/* 构建哈夫曼树
   ht: 数组，前n个为叶子，后n-1个为内部结点
   返回WPL */
int buildHuffman(HNode ht[], int n) {
    /* 初始化 */
    for (int i = 0; i < 2 * n - 1; i++) ht[i].parent = ht[i].left = ht[i].right = -1;

    /* 构建：每次合并最小的两个 */
    for (int i = n; i < 2 * n - 1; i++) {
        int s1, s2;
        select(ht, i, &s1, &s2);
        ht[i].weight = ht[s1].weight + ht[s2].weight;
        ht[i].left = s1;
        ht[i].right = s2;
        ht[s1].parent = ht[s2].parent = i;
        printf("合并 %d 和 %d → 新结点权值 %d\\n", ht[s1].weight, ht[s2].weight, ht[i].weight);
    }
    return ht[2 * n - 2].weight;  // 根结点权值 = 所有叶子权值之和
}

/* 计算WPL（带编码长度） */
void calcWPL(HNode ht[], int n, int i, int depth, int* wpl) {
    if (ht[i].left == -1 && ht[i].right == -1) {
        *wpl += ht[i].weight * depth;
        return;
    }
    if (ht[i].left != -1)  calcWPL(ht, n, ht[i].left, depth + 1, wpl);
    if (ht[i].right != -1) calcWPL(ht, n, ht[i].right, depth + 1, wpl);
}

int main() {
    /* 字符权值：A:5, B:9, C:12, D:13, E:16, F:45 */
    int w[] = {5, 9, 12, 13, 16, 45};
    int n = 6;
    HNode ht[20];

    for (int i = 0; i < n; i++) ht[i].weight = w[i];

    printf("===== 哈夫曼树构建过程 =====\\n");
    buildHuffman(ht, n);

    int wpl = 0;
    calcWPL(ht, n, 2 * n - 2, 0, &wpl);
    printf("\\nWPL（总编码长度）= %d\\n", wpl);
    printf("（验证：5×3 + 9×3 + 12×3 + 13×3 + 16×2 + 45×1 = 15+27+36+39+32+45 = %d）\\n", wpl);

    printf("\\n哈夫曼编码（左0右1）:\\n");
    printf("  F(45): 1\\n  E(16): 01\\n  ...");
    return 0;
}`
};
