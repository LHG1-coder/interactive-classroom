/**
 * coding-lab.js — C/C++ 做题功能：代码编辑器 + 实时内存可视化
 * 
 * 渲染器对标 HowPointersWork 风格：
 * - 每个内存 cell 有橙色地址栏(#fd971f)、内容区、类型标签、变量名
 * - 栈区 / 堆区 分列展示
 * - 指针关系用 SVG 连线
 */

// ===================== 题目数据 =====================

const CODING_LAB_QUESTIONS = [
  {
    id: 'ptr-basics',
    title: '指针基础操作',
    difficulty: '⭐',
    category: '指针',
    description: '观察指针变量在内存中的存储和引用关系',
    code: `int main() {
    int x = 10;
    int *p = &x;
    *p = 20;
    return 0;
}`
  },
  {
    id: 'ptr-arith',
    title: '指针算术运算',
    difficulty: '⭐⭐',
    category: '指针',
    description: '观察指针加减运算时地址的变化',
    code: `int main() {
    int arr[5] = {1, 2, 3, 4, 5};
    int *p = arr;
    p = p + 2;
    int val = *p;
    return 0;
}`
  },
  {
    id: 'stack-frame',
    title: '函数调用栈帧',
    difficulty: '⭐⭐',
    category: '函数',
    description: '观察函数调用时栈帧的创建和销毁',
    code: `int add(int a, int b) {
    int sum = a + b;
    return sum;
}

int main() {
    int x = 5;
    int y = 3;
    int result = add(x, y);
    return 0;
}`
  },
  {
    id: 'heap-alloc',
    title: '动态内存分配',
    difficulty: '⭐⭐⭐',
    category: '内存',
    description: '观察 malloc/free 对堆内存的影响',
    code: `#include <stdlib.h>
int main() {
    int *p = (int*)malloc(sizeof(int));
    *p = 10;
    free(p);
    return 0;
}`
  },
  {
    id: 'struct-layout',
    title: '结构体内存布局',
    difficulty: '⭐⭐',
    category: '结构体',
    description: '观察结构体成员在内存中的排列',
    code: `struct Student {
    int id;
    char name[10];
    float score;
};

int main() {
    struct Student s;
    s.id = 1;
    s.score = 95.5;
    return 0;
}`
  },
  {
    id: 'linked-list',
    title: '链表节点操作',
    difficulty: '⭐⭐⭐',
    category: '链表',
    description: '观察链表节点的创建和指针连接',
    code: `struct Node {
    int data;
    struct Node *next;
};

int main() {
    struct Node *head = NULL;
    struct Node *n1 = (struct Node*)malloc(sizeof(struct Node));
    n1->data = 42;
    n1->next = head;
    head = n1;
    return 0;
}`
  },
  {
    id: 'array-decay',
    title: '数组退化与指针',
    difficulty: '⭐⭐',
    category: '数组',
    description: '观察数组名作为参数时的退化现象',
    code: `void print_arr(int arr[], int n) {
    int i;
    for (i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
}

int main() {
    int nums[3] = {10, 20, 30};
    print_arr(nums, 3);
    return 0;
}`
  },
  {
    id: 'double-ptr',
    title: '二级指针',
    difficulty: '⭐⭐⭐',
    category: '指针',
    description: '理解二级指针的多级引用链',
    code: `void set_ptr(int **pp, int *target) {
    *pp = target;
}

int main() {
    int x = 100;
    int *p = NULL;
    set_ptr(&p, &x);
    int val = *p;
    return 0;
}`
  }
];

// ===================== C/C++ 迷你解释器 =====================

class CMiniInterpreter {
  constructor() {
    this.stackFrames = [];    // [{ name, vars: Map, baseAddr }]
    this.heapBlocks = [];      // [{ addr, size, data, freed }]
    this.allVars = [];         // 所有变量扁平列表 (含堆上的)
    this.heapAddrCounter = 0x600000;
    this.stackAddrCounter = 0x7fffe000;
    this.steps = [];           // 每步的快照
    this.ptrTypeCache = new Map(); // varName -> baseType
    this.currentLineNum = 0;   // 当前执行行号（步骤高亮用）
  }

  reset() {
    this.stackFrames = [];
    this.heapBlocks = [];
    this.allVars = [];
    this.heapAddrCounter = 0x600000;
    this.stackAddrCounter = 0x7fffe000;
    this.steps = [];
    this.ptrTypeCache.clear();
    this.currentLineNum = 0;
  }

  _allocStackAddr(size) {
    const addr = this.stackAddrCounter;
    this.stackAddrCounter -= Math.max(size, 4);
    return '0x' + addr.toString(16).padStart(8, '0');
  }

  _allocHeapAddr(size) {
    const addr = this.heapAddrCounter;
    this.heapAddrCounter += Math.max(size, 4);
    return '0x' + addr.toString(16).padStart(8, '0');
  }

  _currentFrame() {
    return this.stackFrames[this.stackFrames.length - 1];
  }

  _snapshot(stepDesc) {
    // 深拷贝当前状态
    const snap = {
      desc: stepDesc,
      lineNum: this.currentLineNum,   // 记录当前执行行号（供 UI 高亮）
      stackFrames: this.stackFrames.map(f => ({
        name: f.name,
        vars: new Map(f.vars),
        baseAddr: f.baseAddr
      })),
      heapBlocks: this.heapBlocks.map(h => ({ ...h })),
    };
    this.steps.push(snap);
  }

  // 查找变量（从当前帧开始向上查）
  _findVar(name) {
    for (let i = this.stackFrames.length - 1; i >= 0; i--) {
      const v = this.stackFrames[i].vars.get(name);
      if (v) return v;
    }
    return null;
  }

  // 解析代码行
  parseLine(line, lineNum) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) return null;
    // 跳过结构体定义、return/for/while等（保留 } 用于递归出栈）
    if (/^(struct\s+\w+\s*\{|^\s*return\b|^\s*for\s*\(|^\s*while\s*\(|^\s*printf\b)/.test(trimmed)) return null;

    return { line: trimmed, lineNum };
  }

  // 执行一行
  executeLine(line, lineNum) {
    this.currentLineNum = lineNum;   // 记录当前行号，快照时写入
    // === 变量声明 ===
    // int x = 10;  int *p = &x;  int* p = &x;  int** pp;
    const declMatch = line.match(/^(int|char|float|double)\s*(\**)\s*(\w+)\s*(?:\[\s*(\d+)\s*\])?\s*(?:=\s*(.+?))?\s*;?\s*$/);
    if (declMatch) {
      const baseType = declMatch[1];
      const ptrLevel = declMatch[2].length;  // * = 1, ** = 2, ...
      const isPtr = ptrLevel > 0;
      const ptrStars = declMatch[2];
      const name = declMatch[3];
      const arrSize = declMatch[4] ? parseInt(declMatch[4]) : 0;
      const initVal = declMatch[5] ? declMatch[5].replace(/;$/, '').trim() : null;

      if (arrSize > 0) {
        // 数组声明
        const addr = this._allocStackAddr(arrSize * 4);
        const frame = this._currentFrame();
        if (!frame) return;
        // 解析初始化列表
        let vals = [];
        if (initVal && initVal.startsWith('{')) {
          vals = initVal.replace(/[{}]/g, '').split(',').map(s => s.trim());
        }
        for (let i = 0; i < arrSize; i++) {
          const elemAddr = '0x' + (parseInt(addr) + i * 4).toString(16).padStart(8, '0');
          const elemName = name + '[' + i + ']';
          frame.vars.set(elemName, {
            name: elemName, type: baseType, value: vals[i] || '?',
            address: elemAddr, size: 4, isPtr: false, isArrayElem: true,
            parentArray: name, elemIndex: i
          });
        }
        // 数组名本身
        frame.vars.set(name, {
          name: name, type: baseType + '[]',
          value: addr, address: addr, size: arrSize * 4,
          isPtr: true, ptrTarget: 'array_base', isArray: true, arraySize: arrSize
        });
        this._snapshot('声明数组 ' + baseType + ' ' + name + '[' + arrSize + ']');
        return;
      }

      if (isPtr) {
        const addr = this._allocStackAddr(8);
        const frame = this._currentFrame();
        if (!frame) return;
        let val = 'NULL';
        let ptrTarget = null;
        if (initVal) {
          if (initVal === 'NULL' || initVal === 'nullptr' || initVal === '0') {
            val = 'NULL';
          } else if (initVal.startsWith('&')) {
            ptrTarget = initVal.substring(1);
            // 查找被引用变量的地址
            const refVar = this._findVar(ptrTarget);
            if (refVar) {
              val = refVar.address;
            } else {
              val = '0x' + this._allocStackAddr(4); // fallback
            }
          } else if (initVal.includes('malloc')) {
            // malloc 调用
            const sizeMatch = initVal.match(/sizeof\s*\(\s*(\w+)\s*\)/);
            const heapSize = sizeMatch ? 4 : 8;
            const heapAddr = this._allocHeapAddr(heapSize);
            this.heapBlocks.push({ addr: heapAddr, size: heapSize, freed: false });
            val = heapAddr;
            ptrTarget = 'heap@' + heapAddr;
          }
        }
        frame.vars.set(name, {
          name: name,
          type: baseType + ptrStars,
          value: val,
          address: addr,
          size: 8,
          isPtr: true,
          ptrTarget: ptrTarget,
          baseType: baseType
        });
        this.ptrTypeCache.set(name, baseType);
      } else {
        const addr = this._allocStackAddr(4);
        const frame = this._currentFrame();
        if (!frame) return;
        let val = '?';
        if (initVal) {
          // 函数调用作初始值: int f = factorial(3);
          const fcMatch = initVal.match(/^(\w+)\s*\(([^)]*)\)$/);
          if (fcMatch && !/^(int|char|float|double|if|for|while|return|printf)$/.test(fcMatch[1])) {
            val = '?';  // 返回值未知
            // 声明完成后处理函数调用（push 新帧）
            const funcName = fcMatch[1];
            const argsRaw = fcMatch[2] ? fcMatch[2].split(',').map(a => a.trim()) : [];
            const resolvedArgs = argsRaw.map(a => {
              const v = this._findVar(a);
              return v ? v.value : a;
            });
            frame.vars.set(name, {
              name, type: baseType, value: val, address: addr, size: 4, isPtr: false
            });
            this._snapshot('声明 ' + baseType + ' ' + name + '（初始值待函数返回）');
            // 递归 push 帧
            if (funcName === (this.stackFrames.length > 0 ? this.stackFrames[this.stackFrames.length - 1].name : '')) {
              this._snapshot('递归调用 ' + funcName + '(' + resolvedArgs.join(', ') + ')');
            } else {
              this._snapshot('调用 ' + funcName + '(' + resolvedArgs.join(', ') + ')');
            }
            this.stackFrames.push({
              name: funcName,
              vars: new Map(),
              baseAddr: this._allocStackAddr(32)
            });
            return;
          }
          // 变量引用: int y = x;
          const refVar = this._findVar(initVal);
          if (refVar) {
            val = refVar.value;
          } else {
            val = initVal.replace(/[fF]$/, '');
          }
        }
        frame.vars.set(name, {
          name: name,
          type: baseType,
          value: val,
          address: addr,
          size: 4,
          isPtr: false
        });
      }
      this._snapshot('声明 ' + line);
      return;
    }

    // === 函数调用（进入函数）===
    const funcCallMatch = line.match(/^(\w+)\s*\(([^)]*)\)\s*;?\s*$/);
    if (funcCallMatch && !/^(int|char|float|double|if|for|while|return|printf)/.test(funcCallMatch[1])) {
      const funcName = funcCallMatch[1];
      const argsRaw = funcCallMatch[2] ? funcCallMatch[2].split(',').map(a => a.trim()) : [];
      // 解析实参值
      const resolvedArgs = argsRaw.map(a => {
        const v = this._findVar(a);
        return v ? v.value : a;
      });
      // push new frame
      this.stackFrames.push({
        name: funcName,
        vars: new Map(),
        baseAddr: this._allocStackAddr(32)
      });
      // 检测递归：如果栈中已有同名函数帧
      const isRecursive = this.stackFrames.filter(f => f.name === funcName).length > 1;
      if (isRecursive) {
        this._snapshot('↻ 递归: ' + funcName + '(' + resolvedArgs.join(', ') + ')');
      } else {
        this._snapshot('调用 ' + funcName + '(' + resolvedArgs.join(', ') + ')');
      }
      return;
    }

    // === 函数结束（隐式）===

    // === 赋值表达式 ===
    // *p = 20;  p = ...;  x = 5;  p[0] = 10;  s.id = 1;
    
    // 指针解引用赋值: *p = value
    const derefAssign = line.match(/^\*\s*(\w+)\s*=\s*(.+?)\s*;?\s*$/);
    if (derefAssign) {
      const ptrName = derefAssign[1];
      const rhs = derefAssign[2].replace(';', '').trim();
      const ptrVar = this._findVar(ptrName);
      if (ptrVar && ptrVar.isPtr && ptrVar.value !== 'NULL' && ptrVar.value !== '?') {
        const targetAddr = ptrVar.value;
        // 在堆上找对应块
        const heapBlock = this.heapBlocks.find(h => h.addr === targetAddr && !h.freed);
        if (heapBlock) {
          heapBlock.data = rhs;
        }
        // 创建一个代表 *p 的变量
        const derefName = '*' + ptrName;
        const frame = this._currentFrame();
        if (frame) {
          frame.vars.set(derefName, {
            name: derefName,
            type: ptrVar.baseType || 'int',
            value: rhs,
            address: targetAddr,
            size: 4,
            isPtr: false,
            isDeref: true
          });
        }
      }
      this._snapshot('*' + ptrName + ' = ' + rhs);
      return;
    }

    // 数组索引赋值: p[0] = value
    const arrAssign = line.match(/^(\w+)\[(\d+)\]\s*=\s*(.+?)\s*;?\s*$/);
    if (arrAssign) {
      const arrName = arrAssign[1];
      const idx = parseInt(arrAssign[2]);
      const val = arrAssign[3].replace(';', '').trim().replace(/;$/, '');
      const arrVar = this._findVar(arrName);
      if (arrVar && arrVar.isArray) {
        const elemAddr = '0x' + (parseInt(arrVar.address) + idx * 4).toString(16).padStart(8, '0');
        const elemName = arrName + '[' + idx + ']';
        const frame = this._currentFrame();
        if (frame) {
          frame.vars.set(elemName, {
            name: elemName,
            type: arrVar.type.replace('[]', ''),
            value: val,
            address: elemAddr,
            size: 4,
            isPtr: false,
            isArrayElem: true,
            parentArray: arrName,
            elemIndex: idx
          });
        }
      }
      this._snapshot(arrName + '[' + idx + '] = ' + val);
      return;
    }

    // 结构体成员赋值: s.id = 1  or ptr->data = 42
    const structAssign = line.match(/^(\w+)(?:->|\.)(\w+)\s*=\s*(.+?)\s*;?\s*$/);
    if (structAssign) {
      const objName = structAssign[1];
      const member = structAssign[2];
      const val = structAssign[3].replace(';', '').trim();
      const objVar = this._findVar(objName);
      if (objVar) {
        const memberName = objName + '.' + member;
        const frame = this._currentFrame();
        if (frame) {
          frame.vars.set(memberName, {
            name: memberName,
            type: 'int',
            value: val,
            address: objVar.address,
            size: 4,
            isPtr: false,
            isMember: true
          });
        }
      }
      this._snapshot(objName + '.' + member + ' = ' + val);
      return;
    }

    // 普通赋值: p = expr;  x = value;
    const assignMatch = line.match(/^(\w+)\s*=\s*(.+?)\s*;?\s*$/);
    if (assignMatch) {
      const target = assignMatch[1];
      const rawRhs = assignMatch[2].replace(';', '').trim();
      const var_ = this._findVar(target);
      if (!var_) return;

      let rhsVal = rawRhs;

      // 处理 &x
      if (rawRhs.startsWith('&')) {
        const refName = rawRhs.substring(1);
        const refVar = this._findVar(refName);
        if (refVar) {
          rhsVal = refVar.address;
          if (var_.isPtr) {
            var_.ptrTarget = refName;
          }
        }
      }
      // 处理 NULL
      else if (rawRhs === 'NULL' || rawRhs === 'nullptr') {
        rhsVal = 'NULL';
        if (var_.isPtr) var_.ptrTarget = null;
      }
      // 处理指针算术: p + 2
      else if (rawRhs.match(/^\w+\s*\+\s*\d+$/)) {
        const parts = rawRhs.split('+');
        const baseName = parts[0].trim();
        const offset = parseInt(parts[1].trim());
        const baseVar = this._findVar(baseName);
        if (baseVar) {
          rhsVal = '0x' + (parseInt(baseVar.address) + offset * 4).toString(16).padStart(8, '0');
          if (var_.isPtr) {
            var_.ptrTarget = baseVar.ptrTarget || baseName;
            var_.ptrOffset = offset;
          }
        }
      }
      // 函数调用: x = factorial(n-1);
      else if (rawRhs.match(/^\w+\s*\([^)]*\)$/)) {
        const fcMatch = rawRhs.match(/^(\w+)\s*\(([^)]*)\)$/);
        const funcName = fcMatch[1];
        const argsRaw = fcMatch[2] ? fcMatch[2].split(',').map(a => a.trim()) : [];
        const resolvedArgs = argsRaw.map(a => {
          const v = this._findVar(a);
          return v ? v.value : a;
        });
        rhsVal = '?';
        var_.value = rhsVal;
        this._snapshot(target + ' = ' + funcName + '(...), 返回值未知');
        // push 新帧处理函数调用
        this.stackFrames.push({
          name: funcName,
          vars: new Map(),
          baseAddr: this._allocStackAddr(32)
        });
        const isRecursive = this.stackFrames.filter(f => f.name === funcName).length > 1;
        if (isRecursive) {
          this._snapshot('↻ 递归: ' + funcName + '(' + resolvedArgs.join(', ') + ')');
        }
        return;
      }
      // 变量引用
      else {
        const refVar = this._findVar(rawRhs);
        if (refVar) {
          rhsVal = refVar.value;
          if (var_.isPtr && refVar.isPtr) {
            var_.ptrTarget = refVar.ptrTarget;
          }
        }
      }

      var_.value = rhsVal;
      this._snapshot(target + ' = ' + rhsVal);
      return;
    }

    // === free(p) ===
    const freeMatch = line.match(/^free\s*\(\s*(\w+)\s*\)/);
    if (freeMatch) {
      const ptrName = freeMatch[1];
      const ptrVar = this._findVar(ptrName);
      if (ptrVar && ptrVar.isPtr && ptrVar.value !== 'NULL') {
        const heapBlock = this.heapBlocks.find(h => h.addr === ptrVar.value);
        if (heapBlock) {
          heapBlock.freed = true;
        }
        ptrVar.value = 'NULL';
        ptrVar.ptrTarget = null;
      }
      this._snapshot('free(' + ptrName + ')');
      return;
    }

    // === 函数退出（当前帧出栈）===
    if (line === '}' && this.stackFrames.length > 1) {
      this.stackFrames.pop();
      this._snapshot('函数返回 (栈帧出栈)');
      return;
    }

    // === 函数定义头: int main() {  ===
    const funcDefMatch = line.match(/^(int\**|void|char|float|double|struct\s+\w+\s*\**)\s+(\w+)\s*\([^)]*\)\s*\{?\s*$/);
    if (funcDefMatch) {
      const funcName = funcDefMatch[2];
      this.stackFrames.push({
        name: funcName,
        vars: new Map(),
        baseAddr: this._allocStackAddr(64)
      });
      this._snapshot('进入函数 ' + funcName + '()');
      return;
    }
  }

  // 解析并执行全部代码
  parseAndExecute(code) {
    this.reset();
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const parsed = this.parseLine(lines[i], i + 1);
      if (parsed) {
        this.executeLine(parsed.line, parsed.lineNum);
      }
    }
    // 确保 main 的 } 也出栈
    if (this.stackFrames.length > 1) {
      this.stackFrames.pop();
      this._snapshot('程序结束');
    }
    return this.steps;
  }

  // 获取当前步骤的所有栈帧（含变量列表）
  getStackFramesAtStep(stepIdx) {
    if (stepIdx < 0 || stepIdx >= this.steps.length) return [];
    const snap = this.steps[stepIdx];
    return snap.stackFrames.map(f => ({
      name: f.name,
      vars: Array.from(f.vars.values())
    }));
  }

  // 获取当前步骤的堆变量
  getHeapVarsAtStep(stepIdx) {
    if (stepIdx < 0 || stepIdx >= this.steps.length) return [];
    const snap = this.steps[stepIdx];
    return snap.heapBlocks.map(h => ({
      name: 'heap',
      type: h.freed ? 'freed' : 'heap_block',
      value: h.data || '?',
      address: h.addr,
      size: h.size,
      isPtr: false,
      freed: h.freed
    }));
  }
}


// ===================== DOM 内存渲染器（对标 HowPointersWork）=====================

class MemoryRenderer {
  constructor(container) {
    this.container = container;
    this.container.innerHTML = '';
    this._buildBaseLayout();
  }

  _buildBaseLayout() {
    // 精确对标 HowPointersWork 暗色主题
    // --background-color: #272822  --cell-border: #fd971f  --title-color: #d4d4dc
    this.container.style.cssText = `
      display: flex;
      flex-direction: column;
      height: 100%;
      font-family: 'Times New Roman', Times, serif;
      overflow: hidden;
      background: #272822;
      color: #d4d4dc;
    `;

    // 主体：栈区 + 堆区 （对标 #memoryContainer）
    this.memoryContainer = document.createElement('div');
    this.memoryContainer.id = 'clab-memory-container';
    this.memoryContainer.style.cssText = `
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 3rem;
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 8px 12px;
      position: relative;
      font-family: 'Cascadia Code', 'Consolas', monospace;
    `;
    this.container.appendChild(this.memoryContainer);

    // 栈区
    this.stackSection = document.createElement('div');
    this.stackSection.className = 'memory-section';
    this.stackSection.id = 'clab-stack';
    this.stackSection.style.cssText = `
      width: 40%;
      max-width: 15rem;
      overflow-y: auto;
      padding: 0 1px;
      display: flex;
      flex-direction: column;
      gap: 0;
    `;
    this.stackSection.innerHTML = '<h3 style="color:#f92672;text-align:center;margin:0 0 12px;font-family:Arial,sans-serif;font-weight:600;font-size:1rem;letter-spacing:2px">Stack</h3>';
    this.memoryContainer.appendChild(this.stackSection);

    // 堆区
    this.heapSection = document.createElement('div');
    this.heapSection.className = 'memory-section';
    this.heapSection.id = 'clab-heap';
    this.heapSection.style.cssText = `
      width: 40%;
      max-width: 15rem;
      overflow-y: auto;
      padding: 0 1px;
      display: flex;
      flex-direction: column;
      gap: 0;
    `;
    this.heapSection.innerHTML = '<h3 style="color:#f92672;text-align:center;margin:0 0 12px;font-family:Arial,sans-serif;font-weight:600;font-size:1rem;letter-spacing:2px">Heap</h3>';
    this.memoryContainer.appendChild(this.heapSection);

    // LeaderLine 已在全局 globalMemoryArrows 中管理，不需要 SVG overlay

    // 底部状态栏
    this.statusBar = document.createElement('div');
    this.statusBar.style.cssText = `
      padding: 6px 12px;
      border-top: 1px solid rgba(253,151,31,0.2);
      font-size: 11px;
      color: #8b949e;
      flex-shrink: 0;
      min-height: 22px;
    `;
    this.container.appendChild(this.statusBar);
  }

  _createCell(variable) {
    const addr = variable.address || '?';
    const cell = document.createElement('div');
    cell.className = 'mem-cell memory-cell memory-cell-' + (typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(addr) : addr.replace(/[^a-zA-Z0-9-]/g, '-'));

    // 精确对标 memory.css 中的 .memory-cell
    cell.style.cssText = `
      font-family: 'Cascadia Code', 'Consolas', monospace;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      justify-content: center;
      outline: 1px solid #fd971f;
      border-radius: 5px;
      color: #d4d4dc;
      width: 100%;
      max-width: 15rem;
      height: 5rem;
      position: relative;
      background-color: #272822;
      transition: box-shadow 0.2s ease-out;
      cursor: default;
      margin-bottom: 4px;
    `;

    // hover 效果
    cell.addEventListener('mouseenter', function() {
      if (!variable.freed) {
        this.style.boxShadow = '0 0 18px 1px #fd971f';
        this.style.zIndex = '2';
      }
    });
    cell.addEventListener('mouseleave', function() {
      this.style.boxShadow = '';
      this.style.zIndex = '';
    });

    // freed 的块半透明
    if (variable.freed) {
      cell.style.opacity = '0.2';
    }

    // 地址标签 — 对标 .memory-cell .address
    const addrDiv = document.createElement('div');
    addrDiv.style.cssText = `
      position: absolute;
      top: -1px;
      left: -1px;
      font-size: 0.6rem;
      color: #d4d4dc;
      background: #272822;
      border: 1px solid #fd971f;
      border-radius: 5px 0 5px 0;
      padding: 0.15rem 0.2rem;
    `;
    addrDiv.textContent = addr;
    cell.appendChild(addrDiv);

    // 内容区（居中）
    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `
      font-size: 1rem;
      color: #d4d4dc;
    `;
    let displayVal = variable.value;
    if (variable.isPtr && variable.value !== 'NULL' && variable.value !== '?') {
      displayVal = variable.value;
    }
    if (displayVal === '?') {
      contentDiv.style.color = '#6b7280';
      contentDiv.style.fontStyle = 'italic';
    }
    contentDiv.textContent = displayVal === '?' ? '?' : (displayVal || '?');
    cell.appendChild(contentDiv);

    // 类型标签 — 对标 .memory-cell .type （左下）
    const typeDiv = document.createElement('div');
    typeDiv.style.cssText = `
      position: absolute;
      bottom: 0.25rem;
      left: 0.4rem;
      font-size: 0.8rem;
      color: #6c757d;
      font-style: italic;
    `;
    let typeStr = variable.type || 'int';
    if (variable.isPtr && typeStr.indexOf('*') === -1) typeStr += '*';
    typeDiv.textContent = typeStr;
    cell.appendChild(typeDiv);

    // 变量名 — 对标 .memory-cell .name （右下）
    if (variable.name) {
      const nameDiv = document.createElement('div');
      nameDiv.style.cssText = `
        position: absolute;
        bottom: 0.25rem;
        right: 0.4rem;
        font-size: 0.9rem;
        color: #d4d4dc;
      `;
      nameDiv.textContent = variable.name;
      cell.appendChild(nameDiv);
    }

    cell.dataset.addr = addr;
    cell.dataset.name = variable.name || '';
    return cell;
  }

  _drawArrows(stackFrames, heapVars) {
    // 对标 memoryCell.js: 使用 LeaderLine + globalMemoryArrows Map
    // （旧箭头已在 render() 入口通过 _removeArrows() 清除）

    // 收集所有指针变量（栈帧中的）
    const allVars = [];
    for (const frame of stackFrames) {
      for (const v of frame.vars) {
        if (v.isPtr && v.value !== 'NULL' && v.value !== '?' && v.ptrTarget) {
          allVars.push(v);
        }
      }
    }

    // 对每个指针绘制 LeaderLine
    for (const ptrVar of allVars) {
      const fromCell = this.memoryContainer.querySelector(`.mem-cell[data-addr="${ptrVar.address}"]`);
      if (!fromCell) continue;

      // 查找目标 cell
      let toCell = null;
      if (ptrVar.ptrTarget && ptrVar.ptrTarget.startsWith('heap@')) {
        const heapAddr = ptrVar.ptrTarget.replace('heap@', '');
        toCell = this.memoryContainer.querySelector(`.mem-cell[data-addr="${heapAddr}"]`);
      } else if (ptrVar.ptrTarget) {
        // 按变量名找
        toCell = this.memoryContainer.querySelector(`.mem-cell[data-name="${ptrVar.ptrTarget}"]`);
      }

      if (!toCell) continue;

      // 判断目标是否在堆区
      const isTargetInHeap = toCell.closest('#clab-heap') !== null;
      const isSourceInHeap = fromCell.closest('#clab-heap') !== null;

      const arrowKey = ptrVar.address + '->' + (ptrVar.ptrTarget || ptrVar.value);
      const arrow = new LeaderLine(
        fromCell,
        toCell,
        {
          path: 'fluid',
          startSocket: 'right',
          endSocket: isTargetInHeap ? (isSourceInHeap ? 'right' : 'left') : 'right',
          startSocketGravity: isTargetInHeap ? [15, 0] : [15, 0],
          endSocketGravity: isTargetInHeap ? (isSourceInHeap ? [20, 0] : [-20, 0]) : [20, 0],
          endPlug: 'arrow3',
          size: 2,
          endPlugSize: 2,
          color: '#fd971f'
        }
      );
      globalMemoryArrows.set(arrowKey, arrow);
    }
  }

  render(stackFrames, heapVars, stepDesc) {
    // 先清除所有旧的 LeaderLine 箭头
    this._removeArrows();

    // 清理（保留 h3 标题）
    this.stackSection.querySelectorAll('.stack-frame, .mem-cell, .empty-hint').forEach(el => el.remove());
    this.heapSection.querySelectorAll('.mem-cell, .empty-hint').forEach(el => el.remove());

    // 渲染栈帧 — 对标 memory.js: stackFrame > [hr] + frame-name + cells-container
    if (stackFrames && stackFrames.length > 0) {
      for (const frame of stackFrames) {
        const frameDiv = document.createElement('div');
        frameDiv.className = 'stack-frame';
        frameDiv.style.cssText = 'position:relative;display:flex;flex-direction:row;';

        // <hr/> 分隔线 — 对标 .stack-frame hr
        const hr = document.createElement('hr');
        hr.style.cssText = 'background-color:#fd971f;border:none;height:1px;position:absolute;width:98%;top:-1px;margin:0;left:0;';
        frameDiv.appendChild(hr);

        // 帧名（竖向）— 对标 .stack-frame .frame-name
        const fnWrap = document.createElement('div');
        fnWrap.className = 'frame-name';
        fnWrap.style.cssText = 'height:100%;position:absolute;left:0;top:0;display:inline;white-space:nowrap;padding:0.5rem 0;box-sizing:border-box;width:1.7rem;';
        const fnH4 = document.createElement('h4');
        fnH4.style.cssText = 'overflow-y:hidden;text-overflow:ellipsis;color:#fd971f;margin:0;font-size:1rem;writing-mode:vertical-lr;transform:rotate(180deg);text-align:end;height:100%;';
        fnH4.textContent = frame.name || '';
        fnH4.title = frame.name || '';
        fnWrap.appendChild(fnH4);
        frameDiv.appendChild(fnWrap);

        // 变量容器 — 对标 .cells-container
        const cellsDiv = document.createElement('div');
        cellsDiv.className = 'cells-container';
        cellsDiv.style.cssText = 'flex-grow:1;margin-left:1.7rem;display:flex;flex-direction:column;';
        if (frame.vars && frame.vars.length > 0) {
          for (const v of frame.vars) {
            cellsDiv.appendChild(this._createCell(v));
          }
        } else {
          const e = document.createElement('div');
          e.className = 'empty-hint';
          e.style.cssText = 'color:#6b7280;font-size:11px;text-align:center;padding:8px;';
          e.textContent = '(empty)';
          cellsDiv.appendChild(e);
        }
        frameDiv.appendChild(cellsDiv);
        this.stackSection.appendChild(frameDiv);
      }
    } else {
      const e = document.createElement('div');
      e.className = 'empty-hint';
      e.style.cssText = 'color:#6b7280;font-size:11px;text-align:center;padding:16px;';
      e.textContent = '(no stack frames)';
      this.stackSection.appendChild(e);
    }

    // 渲染堆
    if (heapVars && heapVars.length > 0) {
      for (const v of heapVars) {
        this.heapSection.appendChild(this._createCell(v));
      }
    } else {
      const e = document.createElement('div');
      e.className = 'empty-hint';
      e.style.cssText = 'color:#6b7280;font-size:11px;text-align:center;padding:16px;';
      e.textContent = '(heap empty)';
      this.heapSection.appendChild(e);
    }

    // 绘制指针箭头
    this._drawArrows(stackFrames, heapVars);

    // 更新状态栏
    if (stepDesc) {
      this.statusBar.textContent = '\u25b6 ' + stepDesc;
    }
  }

  _removeArrows() {
    for (const [key, arrow] of globalMemoryArrows) {
      try { arrow.remove(); } catch(e) { /* already orphaned */ }
    }
    globalMemoryArrows.clear();
  }

  clear() {
    this._removeArrows();
    this.render([], [], '');
  }
}


// ===================== 做题引擎 =====================

class CodingLabEngine {
  constructor() {
    this.interpreter = new CMiniInterpreter();
    this.renderer = null;
    this.currentStepIdx = -1;
    this.totalSteps = 0;
    this.playing = false;
    this.speed = 1000;
    this._timer = null;
  }

  init(editorEl, memoryPanelEl) {
    this.editor = editorEl;
    this.renderer = new MemoryRenderer(memoryPanelEl);
  }

  loadQuestion(qid) {
    const q = CODING_LAB_QUESTIONS.find(q => q.id === qid);
    if (q && this.editor) {
      this.editor.value = q.code;
    }
    this.reset();
  }

  run() {
    const code = this.editor ? this.editor.value : '';
    this.interpreter.parseAndExecute(code);
    this.totalSteps = this.interpreter.steps.length;
    this.currentStepIdx = -1;
    this._showCurrentStep();
  }

  // 实时编辑模式：解析后跳到最终状态
  showFinalState() {
    try {
      this.run();
      this.currentStepIdx = Math.max(0, this.totalSteps - 1);
      this._showCurrentStep();
    } catch (e) {
      console.warn('CodingLab: 解析错误', e.message);
      this.renderer.render([], [], '⚠️ 代码解析出错: ' + e.message);
      this.totalSteps = 0;
      this.currentStepIdx = -1;
    }
  }

  step() {
    if (this.currentStepIdx < this.totalSteps - 1) {
      this.currentStepIdx++;
      this._showCurrentStep();
      return true;
    }
    return false;
  }

  stepBack() {
    if (this.currentStepIdx > 0) {
      this.currentStepIdx--;
      this._showCurrentStep();
      return true;
    }
    return false;
  }

  play() {
    if (this.currentStepIdx === -1) this.run();
    this.playing = true;
    this._timer = setInterval(() => {
      if (!this.step()) {
        this.pause();
      }
    }, this.speed);
  }

  pause() {
    this.playing = false;
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  reset() {
    this.pause();
    this.currentStepIdx = -1;
    this.totalSteps = 0;
    this.interpreter.reset();
    if (this.renderer) this.renderer.clear();
  }

  setSpeed(ms) {
    this.speed = ms;
    if (this.playing) {
      this.pause();
      this.play();
    }
  }

  getCurrentStepDesc() {
    if (this.currentStepIdx >= 0 && this.currentStepIdx < this.totalSteps) {
      return this.interpreter.steps[this.currentStepIdx].desc;
    }
    return '';
  }

  // 当前步骤对应的源码行号（无则 0）
  getCurrentLineNum() {
    if (this.currentStepIdx >= 0 && this.currentStepIdx < this.totalSteps) {
      return this.interpreter.steps[this.currentStepIdx].lineNum || 0;
    }
    return 0;
  }

  _showCurrentStep() {
    if (!this.renderer) return;
    if (this.currentStepIdx < 0 || this.currentStepIdx >= this.totalSteps) {
      this.renderer.render([], [], '');
      return;
    }

    const frames = this.interpreter.getStackFramesAtStep(this.currentStepIdx);
    const heap = this.interpreter.getHeapVarsAtStep(this.currentStepIdx);
    const desc = this.interpreter.steps[this.currentStepIdx].desc;
    // 添加步骤计数
    const stepDesc = `[${this.currentStepIdx + 1}/${this.totalSteps}] ${desc}`;
    this.renderer.render(frames, heap, stepDesc);
  }
}


// ===================== 全局导出 =====================

if (typeof module !== 'undefined') {
  module.exports = { CodingLabEngine, CMiniInterpreter, MemoryRenderer, CODING_LAB_QUESTIONS };
}

window.CodingLabEngine = CodingLabEngine;
window.CMiniInterpreter = CMiniInterpreter;
window.MemoryRenderer = MemoryRenderer;
window.CODING_LAB_QUESTIONS = CODING_LAB_QUESTIONS;
