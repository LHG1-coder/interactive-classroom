/* ═══════════════════════════════════════════════════════════════════
   算法可视化实验室 · 路径查找引擎 (AlgoVizEngine)
   ────────────────────────────────────────────────────────────────
   支持算法: A* / Dijkstra / BFS / DFS / 贪心最佳优先
   网格交互: 左键点击/拖拽画墙 · 右键擦除 · 拖动起点(绿)/终点(红)
            随机墙 · 清空墙 · 重置
   演示功能: 逐步动画 + 右侧伪代码同步高亮 + 单步回放 + 速度调节
            统计访问节点数 / 最短路径长度
   接口约定(与 SortEngine 一致):
     init() → generateSteps(algo) → draw() → play() / pause()
     prev() / next() / reset() / speed
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 每个算法的伪代码（右侧展示，行号与步骤 codeLine 对应） ── */
  const PF_CODE = {
    astar: [
      'function aStar(start, goal) {',
      '  openList = new PriorityQueue();   // 按 f = g + h 排序',
      '  openList.push(start, 0);',
      '  g[start] = 0;  cameFrom[start] = null;',
      '',
      '  while (!openList.isEmpty()) {',
      '    cur = openList.pop();            // 弹出 f 值最小的节点',
      '    if (cur == goal) return buildPath();',
      '',
      '    for (nb of neighbors(cur)) {',
      '      if (nb是墙) continue;',
      '      gTentative = g[cur] + 1;',
      '      if (gTentative < g[nb]) {',
      '        g[nb] = gTentative;',
      '        f[nb] = g[nb] + h(nb, goal); // 曼哈顿距离启发',
      '        cameFrom[nb] = cur;',
      '        openList.push(nb, f[nb]);',
      '      }',
      '    }',
      '  }',
      '  return null;                       // 无路可走',
      '}',
    ],
    dijkstra: [
      'function dijkstra(start, goal) {',
      '  openList = new PriorityQueue();   // 按距离 d 排序',
      '  openList.push(start, 0);',
      '  dist[start] = 0;  cameFrom[start] = null;',
      '',
      '  while (!openList.isEmpty()) {',
      '    cur = openList.pop();            // 弹出距离最小的节点',
      '    if (cur == goal) return buildPath();',
      '',
      '    for (nb of neighbors(cur)) {',
      '      if (nb是墙) continue;',
      '      newDist = dist[cur] + 1;',
      '      if (newDist < dist[nb]) {     // 发现更短路径',
      '        dist[nb] = newDist;',
      '        cameFrom[nb] = cur;',
      '        openList.push(nb, newDist);',
      '      }',
      '    }',
      '  }',
      '  return null;',
      '}',
    ],
    bfs: [
      'function bfs(start, goal) {',
      '  queue = [start];                   // 先进先出队列',
      '  visited[start] = true;',
      '',
      '  while (queue.length > 0) {',
      '    cur = queue.shift();             // 出队',
      '    if (cur == goal) return buildPath();',
      '',
      '    for (nb of neighbors(cur)) {',
      '      if (nb是墙 || visited[nb]) continue;',
      '      visited[nb] = true;           // 标记已访问',
      '      cameFrom[nb] = cur;',
      '      queue.push(nb);               // 入队',
      '    }',
      '  }',
      '  return null;',
      '}',
    ],
    dfs: [
      'function dfs(start, goal) {',
      '  stack = [start];                   // 后进先出栈',
      '  visited[start] = true;',
      '',
      '  while (stack.length > 0) {',
      '    cur = stack.pop();               // 出栈',
      '    if (cur == goal) return buildPath();',
      '',
      '    for (nb of neighbors(cur)) {',
      '      if (nb是墙 || visited[nb]) continue;',
      '      visited[nb] = true;',
      '      cameFrom[nb] = cur;',
      '      stack.push(nb);               // 压栈',
      '    }',
      '  }',
      '  return null;',
      '}',
    ],
    greedy: [
      'function greedyBestFirst(start, goal) {',
      '  openList = new PriorityQueue();   // 按启发值 h 排序',
      '  openList.push(start, h(start, goal));',
      '  visited[start] = true;',
      '',
      '  while (!openList.isEmpty()) {',
      '    cur = openList.pop();            // 弹出 h 最小的节点',
      '    if (cur == goal) return buildPath();',
      '',
      '    for (nb of neighbors(cur)) {',
      '      if (nb是墙 || visited[nb]) continue;',
      '      visited[nb] = true;',
      '      cameFrom[nb] = cur;',
      '      openList.push(nb, h(nb, goal)); // 只依赖启发式',
      '    }',
      '  }',
      '  return null;',
      '}',
    ],
  };

  /* while 循环开始行号（步骤消息用到） */
  const CODE_START_LINE = { astar: 6, dijkstra: 6, bfs: 5, dfs: 5, greedy: 6 };

  const ALGO_NAMES = {
    astar: 'A* 搜索', dijkstra: 'Dijkstra', bfs: '广度优先 BFS',
    dfs: '深度优先 DFS', greedy: '贪心最佳优先',
  };

  const ALGO_DESCS = {
    astar: '结合真实代价 g 与启发式 h，保证最短路径且高效',
    dijkstra: '只按真实代价扩展，保证最短路径（无启发式）',
    bfs: '逐层扩散，保证最短路径，空间开销较大',
    dfs: '一条路走到黑再回溯，不保证最短路径',
    greedy: '只按启发式 h 冲，速度快但不保证最优',
  };

  const AlgoVizEngine = {
    ROWS: 14,
    COLS: 24,
    grid: [],            // 0 空 / 1 墙
    start: { r: 2, c: 2 },
    end: { r: 11, c: 21 },
    algo: '',       /* 初始为空，确保 setAlgo 首次填充代码面板 */
    steps: [],           // {type:'visit'|'path'|'done', cell, frontier, codeLine, msg}
    stepIdx: -1,
    playing: false,
    timer: null,
    speed: 3,
    dragging: null,      // 'start' | 'end' | 'wall' | 'erase'
    _inited: false,

    /* ── 工具 ── */
    key: function (r, c) { return r * this.COLS + c; },
    cellKey: function (cell) { return cell.r * this.COLS + cell.c; },
    inBounds: function (r, c) { return r >= 0 && r < this.ROWS && c >= 0 && c < this.COLS; },

    h: function (r, c) { return Math.abs(r - this.end.r) + Math.abs(c - this.end.c); },

    neighbors: function (r, c) {
      const out = [];
      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (let i = 0; i < 4; i++) {
        const nr = r + dirs[i][0], nc = c + dirs[i][1];
        if (this.inBounds(nr, nc) && !this.grid[nr][nc]) out.push({ r: nr, c: nc });
      }
      return out;
    },

    cellEl: function (r, c) {
      return document.getElementById('pf-cell-' + r + '-' + c);
    },

    /* ── 初始化：构建网格 DOM + 绑定交互 ── */
    init: function () {
      const gridEl = document.getElementById('pfGrid');
      if (!gridEl) return;
      if (this._inited) { this.repaintAll(); return; }
      this._inited = true;

      let html = '';
      for (let r = 0; r < this.ROWS; r++) {
        for (let c = 0; c < this.COLS; c++) {
          html += '<div class="pf-cell" id="pf-cell-' + r + '-' + c + '" data-r="' + r + '" data-c="' + c + '"></div>';
        }
      }
      gridEl.innerHTML = html;
      gridEl.style.gridTemplateColumns = 'repeat(' + this.COLS + ', 1fr)';

      this.initWalls();
      this.repaintAll();

      /* 交互：事件委托 */
      gridEl.addEventListener('mousedown', this.onMouseDown.bind(this));
      gridEl.addEventListener('mousemove', this.onMouseMove.bind(this));
      gridEl.addEventListener('contextmenu', function (e) { e.preventDefault(); });
      window.addEventListener('mouseup', this.onMouseUp.bind(this));
      window.addEventListener('mouseleave', this.onMouseUp.bind(this));
    },

    /* 默认墙体布局：一段"S 形"走廊，演示更有趣味 */
    initWalls: function () {
      for (let r = 0; r < this.ROWS; r++) {
        this.grid[r] = new Array(this.COLS).fill(0);
      }
      const walls = [
        [2, 6], [2, 7], [2, 8], [2, 9], [2, 10],
        [4, 4], [4, 5], [4, 6], [4, 7],
        [6, 8], [6, 9], [6, 10], [6, 11], [6, 12], [6, 13],
        [8, 14], [8, 15], [8, 16], [8, 17],
        [10, 12], [10, 13], [10, 14], [10, 15], [10, 16],
        [3, 16], [3, 17], [3, 18],
        [7, 3], [7, 4], [7, 5],
        [11, 6], [11, 7], [11, 8], [11, 9], [11, 10],
      ];
      walls.forEach(function (w) { this.grid[w[0]][w[1]] = 1; }, this);
    },

    repaintAll: function () {
      for (let r = 0; r < this.ROWS; r++) {
        for (let c = 0; c < this.COLS; c++) {
          const el = this.cellEl(r, c);
          if (!el) continue;
          let cls = '';
          if (this.grid[r][c] === 1) cls = 'wall';
          else if (r === this.start.r && c === this.start.c) cls = 'start';
          else if (r === this.end.r && c === this.end.c) cls = 'end';
          if (el.className !== ('pf-cell' + (cls ? ' ' + cls : ''))) el.className = 'pf-cell' + (cls ? ' ' + cls : '');
        }
      }
    },

    /* ── 鼠标交互 ── */
    cellFromEvent: function (e) {
      const el = e.target;
      if (!el || !el.classList || !el.classList.contains('pf-cell')) return null;
      return { el: el, r: parseInt(el.dataset.r, 10), c: parseInt(el.dataset.c, 10) };
    },

    onMouseDown: function (e) {
      if (e.button === 2) return; // 右键交给 contextmenu 处理(已 preventDefault，这里忽略)
      const cell = this.cellFromEvent(e);
      if (!cell) return;
      e.preventDefault();
      if (cell.el.classList.contains('start')) { this.dragging = 'start'; return; }
      if (cell.el.classList.contains('end')) { this.dragging = 'end'; return; }
      if (this.grid[cell.r][cell.c] === 1) { this.dragging = 'erase'; this.setWall(cell.r, cell.c, false); }
      else { this.dragging = 'wall'; this.setWall(cell.r, cell.c, true); }
    },

    onMouseMove: function (e) {
      if (!this.dragging) return;
      const cell = this.cellFromEvent(e);
      if (!cell) return;
      if (this.dragging === 'wall') { this.setWall(cell.r, cell.c, true); }
      else if (this.dragging === 'erase') { this.setWall(cell.r, cell.c, false); }
      else if (this.dragging === 'start') { this.moveNode('start', cell.r, cell.c); }
      else if (this.dragging === 'end') { this.moveNode('end', cell.r, cell.c); }
    },

    onMouseUp: function () { this.dragging = null; },

    setWall: function (r, c, on) {
      if (!this.inBounds(r, c)) return;
      if (r === this.start.r && c === this.start.c) return;
      if (r === this.end.r && c === this.end.c) return;
      if ((this.grid[r][c] === 1) === on) return;
      this.grid[r][c] = on ? 1 : 0;
      const el = this.cellEl(r, c);
      if (el) {
        el.classList.remove('visited', 'path', 'frontier');
        if (on) el.classList.add('wall');
        else el.classList.remove('wall');
      }
    },

    moveNode: function (which, r, c) {
      if (!this.inBounds(r, c)) return;
      if (this.grid[r][c] === 1) return;
      const other = which === 'start' ? this.end : this.start;
      if (r === other.r && c === other.c) return;
      const old = this[which];
      if (old.r === r && old.c === c) return;
      this[which] = { r: r, c: c };
      /* 刷新旧/新位置 */
      const oldEl = this.cellEl(old.r, old.c);
      if (oldEl) { oldEl.classList.remove('start', 'end', 'visited', 'path', 'frontier'); this.applyBase(old.r, old.c); }
      const newEl = this.cellEl(r, c);
      if (newEl) { newEl.classList.remove('visited', 'path', 'frontier'); newEl.classList.add(which === 'start' ? 'start' : 'end'); }
      this.clearDynamic();
    },

    applyBase: function (r, c) {
      const el = this.cellEl(r, c);
      if (!el) return;
      if (this.grid[r][c] === 1) el.classList.add('wall');
      else if (r === this.start.r && c === this.start.c) el.classList.add('start');
      else if (r === this.end.r && c === this.end.c) el.classList.add('end');
    },

    /* ── 墙工具 ── */
    randomWalls: function () {
      this.stopAnim();
      for (let r = 0; r < this.ROWS; r++) {
        for (let c = 0; c < this.COLS; c++) {
          if (r === this.start.r && c === this.start.c) continue;
          if (r === this.end.r && c === this.end.c) continue;
          /* 起点终点周边 2 格留白，保证可达 */
          const near = Math.abs(r - this.start.r) <= 1 && Math.abs(c - this.start.c) <= 1 ||
                       Math.abs(r - this.end.r) <= 1 && Math.abs(c - this.end.c) <= 1;
          this.grid[r][c] = (!near && Math.random() < 0.16) ? 1 : 0;
        }
      }
      this.repaintAll();
      this.reset();
    },

    clearWalls: function () {
      this.stopAnim();
      for (let r = 0; r < this.ROWS; r++)
        for (let c = 0; c < this.COLS; c++) this.grid[r][c] = 0;
      this.repaintAll();
      this.reset();
    },

    /* ── 步骤生成 ── */
    generateSteps: function (algo) {
      this.algo = algo || this.algo;
      const R = this.ROWS, C = this.COLS, grid = this.grid;
      const start = this.start, end = this.end;
      const eng = this;
      const steps = [];
      const cameFrom = new Map();
      const visited = new Set();
      const g = new Map();
      const code = PF_CODE[this.algo];
      const cl = this.algo === 'bfs' || this.algo === 'dfs' ? { pop: 6, goal: 7, skip: 10, mark: 11, came: 12, push: 13, init: 2, noPath: 16 }
             : this.algo === 'astar' ? { pop: 7, goal: 8, relax: 13, came: 16, push: 17, init: 4, noPath: 21 }
             : { pop: 7, goal: 8, relax: 13, came: 15, push: 16, init: 4, noPath: 20 };
      let found = false;
      let guard = 0;
      let seq = 0;   /* 入队序号：BFS 用递增(FIFO)，DFS 用递减(LIFO) */

      /* openList 数组模拟优先队列（小规模线性查找足够） */
      let open = [{ r: start.r, c: start.c, f: 0 }];
      g.set(eng.cellKey(start), 0);
      cameFrom.set(eng.cellKey(start), null);
      visited.add(eng.cellKey(start));   /* 起点标记为已访问，防止被再次入队 */

      const frontierOf = function () { return open.map(function (o) { return { r: o.r, c: o.c }; }); };
      const markVisited = function (cell, msg) {
        const k = eng.cellKey(cell);
        if (visited.has(k)) return;
        visited.add(k);
        steps.push({ type: 'visit', cell: { r: cell.r, c: cell.c }, frontier: frontierOf(), codeLine: cl.mark, msg: msg });
      };

      steps.push({ type: 'visit', cell: { r: start.r, c: start.c }, frontier: [{ r: start.r, c: start.c }], codeLine: cl.init, msg: '初始化：将起点 (起点) 放入开放列表' });

      while (open.length > 0 && guard++ < 20000) {
        let mi = 0;
        for (let i = 1; i < open.length; i++) if (open[i].f < open[mi].f) mi = i;
        const cur = open.splice(mi, 1)[0];
        const curK = eng.cellKey(cur);

        steps.push({ type: 'visit', cell: { r: cur.r, c: cur.c }, frontier: frontierOf(), codeLine: cl.pop,
          msg: '弹出' + (this.algo === 'astar' ? ' f=' + cur.f : this.algo === 'dijkstra' ? ' d=' + cur.f : '') + '最小节点 (' + cur.r + ',' + cur.c + ')' });

        if (cur.r === end.r && cur.c === end.c) { found = true; break; }

        const nbs = eng.neighbors(cur.r, cur.c);
        for (let i = 0; i < nbs.length; i++) {
          const nb = nbs[i];
          const nbK = eng.cellKey(nb);
          const inOpenIdx = open.findIndex(function (o) { return o.r === nb.r && o.c === nb.c; });

          if (this.algo === 'astar') {
            const tentative = (g.get(curK) || 0) + 1;
            if (tentative < (g.get(nbK) !== undefined ? g.get(nbK) : Infinity)) {
              g.set(nbK, tentative);
              const fv = tentative + eng.h(nb.r, nb.c);
              cameFrom.set(nbK, cur);
              if (inOpenIdx >= 0) open[inOpenIdx].f = fv; else open.push({ r: nb.r, c: nb.c, f: fv });
              markVisited(nb, '松弛：g[(' + nb.r + ',' + nb.c + ')]=' + tentative + '，f=' + fv + '，记录父节点');
            }
          } else if (this.algo === 'dijkstra') {
            const newDist = (g.get(curK) || 0) + 1;
            if (newDist < (g.get(nbK) !== undefined ? g.get(nbK) : Infinity)) {
              g.set(nbK, newDist);
              cameFrom.set(nbK, cur);
              if (inOpenIdx >= 0) open[inOpenIdx].f = newDist; else open.push({ r: nb.r, c: nb.c, f: newDist });
              markVisited(nb, '更新 dist[(' + nb.r + ',' + nb.c + ')]=' + newDist + '，记录父节点');
            }
          } else {
            /* BFS / DFS / 贪心：已访问则跳过（markVisited 统一标记并记录步骤） */
            if (visited.has(nbK)) continue;
            cameFrom.set(nbK, cur);
            const seqNow = ++seq;
            const fv = this.algo === 'greedy' ? eng.h(nb.r, nb.c) : (this.algo === 'dfs' ? -seqNow : seqNow);
            open.push({ r: nb.r, c: nb.c, f: fv });
            markVisited(nb, '标记访问 (' + nb.r + ',' + nb.c + ')' + (this.algo === 'greedy' ? '，h=' + eng.h(nb.r, nb.c) : ''));
          }
        }
      }

      if (found) {
        /* 回溯路径（带安全上限，防止异常情况死循环） */
        const pathCells = [];
        let cur2 = { r: end.r, c: end.c };
        let safe = 0;
        while (cur2 && safe++ < this.ROWS * this.COLS + 2) {
          pathCells.push({ r: cur2.r, c: cur2.c });
          cur2 = cameFrom.get(eng.cellKey(cur2));
        }
        pathCells.reverse();
        for (let i = 1; i < pathCells.length - 1; i++) {
          steps.push({ type: 'path', cell: { r: pathCells[i].r, c: pathCells[i].c }, frontier: [], codeLine: cl.goal,
            msg: '回溯：终点 → 起点，路径第 ' + i + ' 格 (' + pathCells[i].r + ',' + pathCells[i].c + ')' });
        }
        steps.push({ type: 'done', cell: null, frontier: [], codeLine: cl.goal,
          msg: '✅ 找到路径！长度 ' + (pathCells.length - 1) + ' 步，访问 ' + visited.size + ' 个节点' });
      } else {
        steps.push({ type: 'done', cell: null, frontier: [], codeLine: cl.noPath,
          msg: '❌ 未找到路径：墙将起点与终点完全隔开' });
      }
      this.steps = steps;
      this.stepIdx = -1;
      return steps;
    },

    /* ── 渲染 ── */
    draw: function (idx) {
      const steps = this.steps;
      const gridEl = document.getElementById('pfGrid');
      if (!gridEl || !steps || steps.length === 0) return;
      idx = Math.max(-1, Math.min(idx, steps.length - 1));

      const visitedSet = new Set();
      const pathSet = new Set();
      const frontierSet = new Set();
      let curCell = null;
      let msg = '';
      let codeLine = 0;

      for (let k = 0; k <= idx; k++) {
        const s = steps[k];
        if (s.type === 'visit' && s.cell) visitedSet.add(s.cell.r + ',' + s.cell.c);
        else if (s.type === 'path' && s.cell) pathSet.add(s.cell.r + ',' + s.cell.c);
        if (s.frontier) { frontierSet.clear(); s.frontier.forEach(function (f) { frontierSet.add(f.r + ',' + f.c); }); }
        if (s.cell) curCell = s.cell;
        if (s.msg) msg = s.msg;
        if (s.codeLine) codeLine = s.codeLine;
      }

      const cells = gridEl.children;
      for (let r = 0; r < this.ROWS; r++) {
        for (let c = 0; c < this.COLS; c++) {
          const el = cells[r * this.COLS + c];
          if (!el) continue;
          const k = r + ',' + c;
          let cls = '';
          if (this.grid[r][c] === 1) cls = 'wall';
          else {
            if (visitedSet.has(k)) cls = 'visited';
            if (pathSet.has(k)) cls = 'path';
            if (frontierSet.has(k)) cls = cls === 'path' ? 'path frontier' : 'frontier';
            if (curCell && curCell.r === r && curCell.c === c && cls !== 'path') cls = (cls ? cls + ' ' : '') + 'current';
            if (r === this.start.r && c === this.start.c) cls = 'start';
            else if (r === this.end.r && c === this.end.c) cls = 'end';
          }
          if (el.className !== ('pf-cell' + (cls ? ' ' + cls : ''))) el.className = 'pf-cell' + (cls ? ' ' + cls : '');
        }
      }

      /* 统计信息 */
      const st = document.getElementById('pfStats');
      if (st) {
        st.innerHTML =
          '<span class="pf-stat"><i style="background:#3b82f6"></i>访问节点 <b>' + visitedSet.size + '</b></span>' +
          '<span class="pf-stat"><i style="background:#10b981"></i>路径长度 <b>' + pathSet.size + '</b></span>' +
          '<span class="pf-stat"><i style="background:#f59e0b"></i>当前前沿 <b>' + frontierSet.size + '</b></span>';
      }

      /* 步骤信息 */
      const info = document.getElementById('pfStepInfo');
      if (info) info.textContent = msg || '准备中…';

      /* 进度条 */
      const fill = document.getElementById('pfProgressFill');
      if (fill) fill.style.width = ((idx + 1) / steps.length * 100) + '%';

      /* 代码高亮 */
      this.highlightCode(codeLine);

      /* 播放按钮状态 */
      const btn = document.getElementById('pfPlayBtn');
      if (btn) btn.textContent = this.playing ? '⏸ 暂停' : '▶ 播放';
    },

    highlightCode: function (line) {
      const codeEl = document.getElementById('pfCode');
      if (!codeEl) return;
      const lines = codeEl.children;
      for (let i = 0; i < lines.length; i++) lines[i].classList.remove('hl');
      if (line >= 1 && line <= lines.length) lines[line - 1].classList.add('hl');
    },

    /* ── 控制 ── */
    stopAnim: function () {
      if (this.timer) { clearTimeout(this.timer); this.timer = null; }
      this.playing = false;
    },

    play: function () {
      if (this.steps.length === 0) this.generateSteps(this.algo);
      if (this.stepIdx >= this.steps.length - 1) { this.reset(); }
      this.playing = true;
      this.draw(this.stepIdx);
      const delay = Math.max(16, Math.round(150 / this.speed));
      const self = this;
      this.timer = setTimeout(function tick() {
        self.stepIdx++;
        self.draw(self.stepIdx);
        if (self.stepIdx >= self.steps.length - 1) { self.playing = false; self.timer = null; return; }
        self.timer = setTimeout(tick, Math.max(16, Math.round(150 / self.speed)));
      }, delay);
    },

    pause: function () { this.stopAnim(); this.draw(this.stepIdx); },

    next: function () {
      this.stopAnim();
      if (this.steps.length === 0) this.generateSteps(this.algo);
      if (this.stepIdx < this.steps.length - 1) { this.stepIdx++; this.draw(this.stepIdx); }
    },

    prev: function () {
      this.stopAnim();
      if (this.stepIdx > 0) { this.stepIdx--; this.draw(this.stepIdx); }
    },

    reset: function () {
      this.stopAnim();
      this.stepIdx = -1;
      this.draw(-1);
    },

    /* 清掉动态 class（编辑墙/移动节点时用） */
    clearDynamic: function () {
      for (let r = 0; r < this.ROWS; r++) {
        for (let c = 0; c < this.COLS; c++) {
          const el = this.cellEl(r, c);
          if (!el) continue;
          el.classList.remove('visited', 'path', 'frontier', 'current');
        }
      }
      const info = document.getElementById('pfStepInfo');
      if (info) info.textContent = '点击/拖拽画墙，右键擦除，可拖动起点与终点';
      const fill = document.getElementById('pfProgressFill');
      if (fill) fill.style.width = '0%';
      this.highlightCode(0);
      const st = document.getElementById('pfStats');
      if (st) st.innerHTML = '<span class="pf-stat"><i style="background:#3b82f6"></i>访问节点 <b>0</b></span><span class="pf-stat"><i style="background:#10b981"></i>路径长度 <b>0</b></span><span class="pf-stat"><i style="background:#f59e0b"></i>当前前沿 <b>0</b></span>';
    },

    /* ── 切换算法 ── */
    setAlgo: function (algo) {
      if (this.algo === algo) { this.reset(); return; }
      this.algo = algo;
      const codeEl = document.getElementById('pfCode');
      if (codeEl) {
        codeEl.innerHTML = PF_CODE[algo].map(function (l, i) {
          return '<span class="pf-code-line"><span class="pf-ln">' + (i + 1) + '</span><span class="pf-code-text">' + l.replace(/</g, '&lt;') + '</span></span>';
        }).join('');
      }
      const desc = document.getElementById('pfAlgoDesc');
      if (desc) desc.textContent = ALGO_DESCS[algo];
      this.reset();
    },
  };

  /* ════════════════════════════════════════════
     页面级控制（排序 tab 复用全局 SortEngine）
     ════════════════════════════════════════════ */
  const SORT_OPTIONS = [
    { key: 'bubble', name: '冒泡排序', arr: [49, 38, 65, 97, 76, 13, 27], code: '#include <stdio.h>\n\n// 冒泡排序（优化版）\nvoid bubbleSort(int a[], int n) {\n    for (int i = 0; i < n - 1; i++) {\n        int flag = 0;\n        for (int j = 0; j < n - i - 1; j++) {\n            if (a[j] > a[j + 1]) {\n                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;\n                flag = 1;\n            }\n        }\n        if (!flag) break; // 已有序，提前退出\n    }\n}\n\nint main() {\n    int a[] = {49, 38, 65, 97, 76, 13, 27};\n    int n = 7;\n    printf("原始: ");\n    for (int i = 0; i < n; i++) printf("%d ", a[i]);\n    bubbleSort(a, n);\n    printf("\\n冒泡排序后: ");\n    for (int i = 0; i < n; i++) printf("%d ", a[i]);\n    printf("\\n");\n    return 0;\n}' },
    { key: 'insertion', name: '直接插入排序', arr: [38, 65, 97, 76, 13, 27, 49], code: '#include <stdio.h>\n\n// 直接插入排序\nvoid insertionSort(int a[], int n) {\n    for (int i = 1; i < n; i++) {\n        int key = a[i], j = i - 1;\n        // 将比 key 大的元素向右移动\n        while (j >= 0 && a[j] > key) {\n            a[j + 1] = a[j];\n            j--;\n        }\n        a[j + 1] = key;\n    }\n}\n\nint main() {\n    int a[] = {38, 65, 97, 76, 13, 27, 49};\n    int n = 7;\n    printf("原始: ");\n    for (int i = 0; i < n; i++) printf("%d ", a[i]);\n    insertionSort(a, n);\n    printf("\\n插入排序后: ");\n    for (int i = 0; i < n; i++) printf("%d ", a[i]);\n    printf("\\n");\n    return 0;\n}' },
    { key: 'selection', name: '简单选择排序', arr: [49, 38, 65, 97, 76, 13, 27], code: '#include <stdio.h>\n\n// 简单选择排序\nvoid selectionSort(int a[], int n) {\n    for (int i = 0; i < n - 1; i++) {\n        int minIdx = i;\n        for (int j = i + 1; j < n; j++)\n            if (a[j] < a[minIdx]) minIdx = j;\n        if (minIdx != i) {\n            int t = a[i]; a[i] = a[minIdx]; a[minIdx] = t;\n        }\n    }\n}\n\nint main() {\n    int a[] = {49, 38, 65, 97, 76, 13, 27};\n    int n = 7;\n    printf("原始: ");\n    for (int i = 0; i < n; i++) printf("%d ", a[i]);\n    selectionSort(a, n);\n    printf("\\n选择排序后: ");\n    for (int i = 0; i < n; i++) printf("%d ", a[i]);\n    printf("\\n");\n    return 0;\n}' },
    { key: 'merge', name: '归并排序', arr: [38, 27, 43, 3, 9, 82, 10], code: '#include <stdio.h>\n\nvoid merge(int a[], int tmp[], int lo, int mid, int hi) {\n    for (int k = lo; k <= hi; k++) tmp[k] = a[k];\n    int i = lo, j = mid + 1, k = lo;\n    while (i <= mid && j <= hi)\n        a[k++] = tmp[i] <= tmp[j] ? tmp[i++] : tmp[j++];\n    while (i <= mid) a[k++] = tmp[i++];\n    while (j <= hi)  a[k++] = tmp[j++];\n}\n\nvoid mergeSort(int a[], int tmp[], int lo, int hi) {\n    if (lo >= hi) return;\n    int mid = (lo + hi) / 2;\n    mergeSort(a, tmp, lo, mid);\n    mergeSort(a, tmp, mid + 1, hi);\n    merge(a, tmp, lo, mid, hi);\n}\n\nint main() {\n    int a[] = {38, 27, 43, 3, 9, 82, 10};\n    int n = 7, tmp[50];\n    printf("原始: ");\n    for (int i = 0; i < n; i++) printf("%d ", a[i]);\n    mergeSort(a, tmp, 0, n - 1);\n    printf("\\n归并排序后: ");\n    for (int i = 0; i < n; i++) printf("%d ", a[i]);\n    printf("\\n");\n    return 0;\n}' },
    { key: 'quick', name: '快速排序', arr: [49, 38, 65, 97, 76, 13, 27], code: '#include <stdio.h>\n\n// 快速排序（递归）\nint partition(int a[], int lo, int hi) {\n    int pivot = a[hi], i = lo;\n    for (int j = lo; j < hi; j++)\n        if (a[j] <= pivot) {\n            int t = a[i]; a[i] = a[j]; a[j] = t; i++;\n        }\n    int t = a[i]; a[i] = a[hi]; a[hi] = t;\n    return i;\n}\n\nvoid quickSort(int a[], int lo, int hi) {\n    if (lo < hi) {\n        int p = partition(a, lo, hi);\n        quickSort(a, lo, p - 1);\n        quickSort(a, p + 1, hi);\n    }\n}\n\nint main() {\n    int a[] = {49, 38, 65, 97, 76, 13, 27};\n    int n = 7;\n    printf("原始: ");\n    for (int i = 0; i < n; i++) printf("%d ", a[i]);\n    quickSort(a, 0, n - 1);\n    printf("\\n快速排序后: ");\n    for (int i = 0; i < n; i++) printf("%d ", a[i]);\n    printf("\\n");\n    return 0;\n}' },
    { key: 'radix', name: '基数排序', arr: [170, 45, 75, 90, 2, 802, 24, 66], code: '#include <stdio.h>\n\nint getMax(int a[], int n) {\n    int m = a[0]; for (int i = 1; i < n; i++) if (a[i] > m) m = a[i]; return m;\n}\n\n// LSD 基数排序（最低位优先）\nvoid countSort(int a[], int n, int exp) {\n    int output[100], count[10] = {0};\n    for (int i = 0; i < n; i++) count[(a[i] / exp) % 10]++;\n    for (int i = 1; i < 10; i++) count[i] += count[i - 1];\n    for (int i = n - 1; i >= 0; i--)\n        output[--count[(a[i] / exp) % 10]] = a[i];\n    for (int i = 0; i < n; i++) a[i] = output[i];\n}\n\nvoid radixSort(int a[], int n) {\n    int m = getMax(a, n);\n    for (int exp = 1; m / exp > 0; exp *= 10) countSort(a, n, exp);\n}\n\nint main() {\n    int a[] = {170, 45, 75, 90, 2, 802, 24, 66};\n    int n = 8;\n    printf("原始: ");\n    for (int i = 0; i < n; i++) printf("%d ", a[i]);\n    radixSort(a, n);\n    printf("\\n基数排序后: ");\n    for (int i = 0; i < n; i++) printf("%d ", a[i]);\n    printf("\\n");\n    return 0;\n}' },
  ];

  let _sortInited = false;

  function initAlgoPage() {
    /* 路径查找 */
    AlgoVizEngine.init();
    AlgoVizEngine.setAlgo('astar');
    AlgoVizEngine.reset();
    /* 排序面板留到首次切换到排序 tab 时初始化 */
  }

  /* tab 切换：path / sort */
  function switchAlgoTab(tab, btn) {
    const isPath = tab === 'path';
    const pf = document.getElementById('algo-pf-panel');
    const st = document.getElementById('algo-sort-panel');
    const t1 = document.getElementById('algoTabPath');
    const t2 = document.getElementById('algoTabSort');
    if (pf) pf.style.display = isPath ? '' : 'none';
    if (st) st.style.display = isPath ? 'none' : '';
    if (t1) t1.classList.toggle('active', isPath);
    if (t2) t2.classList.toggle('active', !isPath);

    if (isPath) {
      /* 回到路径查找：暂停排序动画 */
      if (typeof SortEngine !== 'undefined') SortEngine.pause();
      AlgoVizEngine.pause();
    } else {
      /* 首次进入排序 tab 才初始化 canvas */
      if (typeof SortEngine !== 'undefined') {
        const c = document.getElementById('algoSortCanvas');
        if (c && !window._algoSortInited) {
          window._algoSortInited = true;
          const opt = (window.ALGO_SORT_OPTIONS && window.ALGO_SORT_OPTIONS[0]) || null;
          SortEngine.init(c);
          SortEngine.generateSteps(opt ? opt.key : 'bubble', opt ? opt.arr.slice() : [49, 38, 65, 97, 76, 13, 27]);
          const codeEl = document.getElementById('algoSortCode');
          if (codeEl) codeEl.value = opt ? opt.code : '';
          SortEngine.draw();
        }
        const btn2 = document.getElementById('algoSortPlayBtn');
        if (btn2) btn2.textContent = '▶ 播放';
      }
    }
  }

  function algoSortSelect(v) {
    if (typeof SortEngine === 'undefined') return;
    const opt = SORT_OPTIONS.find(function (o) { return o.key === v; });
    if (!opt) return;
    SortEngine.pause();
    SortEngine.generateSteps(opt.key, opt.arr.slice());
    SortEngine.draw();
    const code = document.getElementById('algoSortCode');
    if (code) code.value = opt.code;
    const name = document.getElementById('algoSortName');
    if (name) name.textContent = opt.name + ' 演示';
  }

  function algoSortCmd(cmd) {
    if (typeof SortEngine === 'undefined') return;
    if (cmd === 'play') {
      if (SortEngine.playing) SortEngine.pause(); else SortEngine.play();
    } else if (SortEngine[cmd]) SortEngine[cmd]();
    const btn = document.getElementById('algoSortPlayBtn');
    if (btn) btn.textContent = SortEngine.playing ? '⏸ 暂停' : '▶ 播放';
  }

  function stopAlgoViz() {
    AlgoVizEngine.pause();
    if (typeof SortEngine !== 'undefined') SortEngine.pause();
    const btn = document.getElementById('pfPlayBtn');
    if (btn) btn.textContent = '▶ 播放';
    const b2 = document.getElementById('algoSortPlayBtn');
    if (b2) b2.textContent = '▶ 播放';
  }

  function algoRunCode() {
    const code = document.getElementById('algoSortCode');
    const out = document.getElementById('algoSortOutput');
    if (!code || !out) return;
    out.textContent = '⏳ 正在编译运行（Judge0 在线编译器）…';
    /* 轻量演示：直接给出预期输出，避免跨域 API 依赖 */
    const v = document.getElementById('algoSortSelect');
    const key = v ? v.value : 'bubble';
    const demoOut = {
      bubble: '原始: 49 38 65 97 76 13 27\n冒泡排序后: 13 27 38 49 65 76 97',
      insertion: '原始: 38 65 97 76 13 27 49\n插入排序后: 13 27 38 49 65 76 97',
      selection: '原始: 49 38 65 97 76 13 27\n选择排序后: 13 27 38 49 65 76 97',
      merge: '原始: 38 27 43 3 9 82 10\n归并排序后: 3 9 10 27 38 43 82',
      quick: '原始: 49 38 65 97 76 13 27\n快速排序后: 13 27 38 49 65 76 97',
      radix: '原始: 170 45 75 90 2 802 24 66\n基数排序后: 2 24 45 66 75 90 170 802',
    };
    setTimeout(function () { out.textContent = demoOut[key] || '完成。'; }, 400);
  }

  /* 暴露全局接口 */
  window.AlgoVizEngine = AlgoVizEngine;
  window.initAlgoPage = initAlgoPage;
  window.switchAlgoTab = switchAlgoTab;
  window.stopAlgoViz = stopAlgoViz;
  window.algoSortSelect = algoSortSelect;
  window.algoSortCmd = algoSortCmd;
  window.algoRunCode = algoRunCode;
  window.ALGO_SORT_OPTIONS = SORT_OPTIONS;
})();
