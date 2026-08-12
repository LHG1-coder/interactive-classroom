const $ = (id) => document.getElementById(id);

function showMsg(id, msg, type = 'success') {
    const box = $(id);
    if (!box) return;
    box.textContent = msg;
    box.className = 'message-box ' + (type === 'error' ? 'error-msg' : 'success-msg');
    setTimeout(() => {
        box.textContent = '';
        box.className = 'message-box';
    }, 2000);
}

function router(page) {
    document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
    document.querySelectorAll('nav button').forEach((b) => b.classList.remove('active'));

    $(`page-${page}`).classList.add('active');
    $(`nav-${page}`).classList.add('active');
}

function highlightNode(nodeEl) {
    if (!nodeEl) return;
    nodeEl.classList.add('highlight');
    setTimeout(() => {
        nodeEl.classList.remove('highlight');
    }, 2000);
}

const stack = {
    data: [],
    container: $('stack-container'),

    push() {
        const v = parseInt($('stack-input').value);
        if (isNaN(v)) return showMsg('msg-stack', 'Enter value', 'error');

        this.data.push(v);
        this.render();
        $('stack-input').value = '';
        showMsg('msg-stack', `Pushed ${v}`);
    },

    pop() {
        if (this.data.length === 0) return showMsg('msg-stack', 'Stack Empty', 'error');
        const el = this.container.lastElementChild;

        if (el) {
            el.classList.add('removing');
            el.addEventListener(
                'animationend',
                () => {
                    const val = this.data.pop();
                    this.render();
                    showMsg('msg-stack', `Popped ${val}`);
                },
                { once: true },
            );
        } else {
            const val = this.data.pop();
            this.render();
            showMsg('msg-stack', `Popped ${val}`);
        }
    },

    peek() {
        if (!this.data.length) return showMsg('msg-stack', 'Stack Empty', 'error');
        const topNode = this.container.lastElementChild;
        highlightNode(topNode);
    },

    clear() {
        this.data = [];
        this.render();
        showMsg('msg-stack', 'Cleared stack');
    },

    render() {
        this.container.innerHTML = '';
        this.data.forEach((v) => {
            const n = document.createElement('div');
            n.className = 'node';
            n.textContent = v;
            this.container.appendChild(n);
        });
    },
};

const queue = {
    data: [],
    container: $('queue-container'),

    enqueue() {
        const v = parseInt($('queue-input').value);
        if (isNaN(v)) return showMsg('msg-queue', 'Enter value', 'error');

        this.data.push(v);
        this.render();
        $('queue-input').value = '';
        showMsg('msg-queue', `Enqueued ${v}`);
    },

    dequeue() {
        if (!this.data.length) return showMsg('msg-queue', 'Queue Empty', 'error');

        const el = this.container.firstElementChild;
        if (el) {
            el.classList.add('removing');
            el.addEventListener(
                'animationend',
                () => {
                    const v = this.data.shift();
                    this.render();
                    showMsg('msg-queue', `Dequeued ${v}`);
                },
                { once: true },
            );
        } else {
            const v = this.data.shift();
            this.render();
            showMsg('msg-queue', `Dequeued ${v}`);
        }
    },

    front() {
        if (!this.data.length) return showMsg('msg-queue', 'Queue Empty', 'error');
        const frontNode = this.container.firstElementChild;
        highlightNode(frontNode);
    },

    rear() {
        if (!this.data.length) return showMsg('msg-queue', 'Queue Empty', 'error');
        const rearNode = this.container.lastElementChild;
        highlightNode(rearNode);
    },

    clear() {
        this.data = [];
        this.render();
        showMsg('msg-queue', 'Cleared queue');
    },

    render() {
        this.container.innerHTML = '';
        this.data.forEach((v) => {
            const div = document.createElement('div');
            div.className = 'node';
            div.textContent = v;
            this.container.appendChild(div);
        });
    },
};

class DSNode {
    constructor(v) {
        this.value = v;
        this.next = null;
    }
}

const sll = {
    head: null,
    container: $('sll-container'),

    insertHead() {
        const v = parseInt($('sll-input').value);
        if (isNaN(v)) return;

        const n = new DSNode(v);
        n.next = this.head;
        this.head = n;

        this.render();
        $('sll-input').value = '';
    },

    insertTail() {
        const v = parseInt($('sll-input').value);
        if (isNaN(v)) return;

        const n = new DSNode(v);
        if (!this.head) this.head = n;
        else {
            let t = this.head;
            while (t.next) t = t.next;
            t.next = n;
        }
        this.render();
        $('sll-input').value = '';
    },

    deleteHead() {
        if (!this.head) return;

        const el = this.container.firstElementChild;
        if (el) {
            el.querySelector('.node')?.classList.add('removing');
            el.addEventListener(
                'animationend',
                () => {
                    this.head = this.head.next;
                    this.render();
                },
                { once: true },
            );
        } else {
            this.head = this.head.next;
            this.render();
        }
    },

    deleteTail() {
        if (!this.head) return;

        const single = !this.head.next;
        const el = this.container.lastElementChild;

        if (single) {
            if (el) {
                el.querySelector('.node')?.classList.add('removing');
                el.addEventListener(
                    'animationend',
                    () => {
                        this.head = null;
                        this.render();
                    },
                    { once: true },
                );
            } else {
                this.head = null;
                this.render();
            }
            return;
        }

        if (el) {
            el.querySelector('.node')?.classList.add('removing');
            el.addEventListener(
                'animationend',
                () => {
                    let t = this.head;
                    while (t.next.next) t = t.next;
                    t.next = null;
                    this.render();
                },
                { once: true },
            );
        } else {
            let t = this.head;
            while (t.next.next) t = t.next;
            t.next = null;
            this.render();
        }
    },

    render() {
        this.container.innerHTML = '';
        let t = this.head;

        if (!t) {
            this.container.innerHTML = "<span style='color:#777'>NULL</span>";
            return;
        }

        while (t) {
            let wrap = document.createElement('div');
            wrap.className = 'll-node-wrapper';

            if (t === this.head) {
                let headLbl = document.createElement('div');
                headLbl.className = 'head-label';
                headLbl.textContent = 'HEAD';
                wrap.appendChild(headLbl);
            }

            let n = document.createElement('div');
            n.className = 'node';
            n.textContent = t.value;

            wrap.appendChild(n);

            let arrow = document.createElement('div');
            arrow.className = 'll-arrow';

            if (t.next) {
                arrow.innerHTML = '→';
            } else {
                arrow.innerHTML = '<span class="ll-null">NULL</span>';
            }

            wrap.appendChild(arrow);
            this.container.appendChild(wrap);

            t = t.next;
        }
    },
};

const cll = {
    head: null,
    container: $('cll-container'),

    insertHead() {
        const v = parseInt($('cll-input').value);
        if (isNaN(v)) return;

        const n = new DSNode(v);

        if (!this.head) {
            this.head = n;
            n.next = n;
        } else {
            let t = this.head;
            while (t.next !== this.head) t = t.next;
            n.next = this.head;
            t.next = n;
            this.head = n;
        }
        this.render();
        $('cll-input').value = '';
    },

    insertTail() {
        const v = parseInt($('cll-input').value);
        if (isNaN(v)) return;

        const n = new DSNode(v);

        if (!this.head) {
            this.head = n;
            n.next = n;
        } else {
            let t = this.head;
            while (t.next !== this.head) t = t.next;
            t.next = n;
            n.next = this.head;
        }
        this.render();
        $('cll-input').value = '';
    },

    deleteHead() {
        if (!this.head) return;

        const el = this.container.firstElementChild;

        if (this.head.next === this.head) {
            if (el) {
                el.querySelector('.node')?.classList.add('removing');
                el.addEventListener(
                    'animationend',
                    () => {
                        this.head = null;
                        this.render();
                    },
                    { once: true },
                );
            } else {
                this.head = null;
                this.render();
            }
            return;
        }

        if (el) {
            el.querySelector('.node')?.classList.add('removing');
            el.addEventListener(
                'animationend',
                () => {
                    let t = this.head;
                    while (t.next !== this.head) t = t.next;
                    this.head = this.head.next;
                    t.next = this.head;
                    this.render();
                },
                { once: true },
            );
        } else {
            let t = this.head;
            while (t.next !== this.head) t = t.next;
            this.head = this.head.next;
            t.next = this.head;
            this.render();
        }
    },

    deleteTail() {
        if (!this.head) return;

        const el = this.container.lastElementChild;

        if (this.head.next === this.head) {
            if (el) {
                el.querySelector('.node')?.classList.add('removing');
                el.addEventListener(
                    'animationend',
                    () => {
                        this.head = null;
                        this.render();
                    },
                    { once: true },
                );
            } else {
                this.head = null;
                this.render();
            }
            return;
        }

        if (el) {
            el.querySelector('.node')?.classList.add('removing');
            el.addEventListener(
                'animationend',
                () => {
                    let t = this.head;
                    let prev = null;
                    while (t.next !== this.head) {
                        prev = t;
                        t = t.next;
                    }
                    prev.next = this.head;
                    this.render();
                },
                { once: true },
            );
        } else {
            let t = this.head;
            let prev = null;
            while (t.next !== this.head) {
                prev = t;
                t = t.next;
            }
            prev.next = this.head;
            this.render();
        }
    },

    render() {
        this.container.innerHTML = '';

        if (!this.head) {
            this.container.innerHTML = "<span style='color:#777'>Empty</span>";
            return;
        }

        let t = this.head;

        do {
            let wrap = document.createElement('div');
            wrap.className = 'll-node-wrapper';

            if (t === this.head) {
                let headLbl = document.createElement('div');
                headLbl.className = 'head-label';
                headLbl.textContent = 'HEAD';
                wrap.appendChild(headLbl);
            }

            let n = document.createElement('div');
            n.className = 'node';
            n.textContent = t.value;

            wrap.appendChild(n);

            let arrow = document.createElement('div');
            arrow.className = 'll-arrow';
            arrow.innerHTML = '→';

            wrap.appendChild(arrow);

            this.container.appendChild(wrap);

            t = t.next;
        } while (t !== this.head);

        this.container.lastChild.querySelector('.ll-arrow').innerHTML = '↻';
    },
};

class TreeNode {
    constructor(v) {
        this.value = v;
        this.left = null;
        this.right = null;
    }
}

const bst = {
    root: null,
    output: $('bst-output'),

    insert() {
        const v = parseInt($('bst-input').value);
        if (isNaN(v)) return;

        this.root = this._insertRec(this.root, v);
        this.traverse('in');
        this.render();
        $('bst-input').value = '';
    },

    _insertRec(node, v) {
        if (!node) return new TreeNode(v);
        if (v < node.value) node.left = this._insertRec(node.left, v);
        else node.right = this._insertRec(node.right, v);
        return node;
    },

    search() {
        const v = parseInt($('bst-input').value);
        if (isNaN(v)) return;

        let t = this.root;
        while (t) {
            if (t.value === v) return showMsg('msg-bst', 'Found!');
            t = v < t.value ? t.left : t.right;
        }
        showMsg('msg-bst', 'Not Found', 'error');
    },

    clear() {
        this.root = null;
        this.output.textContent = 'Traversal Output:';
        $('bst-visual').innerHTML = '';
        showMsg('msg-bst', 'Cleared BST');
    },

    traverse(order) {
        let res = [];

        function inOrder(n) {
            if (!n) return;
            inOrder(n.left);
            res.push(n.value);
            inOrder(n.right);
        }
        function pre(n) {
            if (!n) return;
            res.push(n.value);
            pre(n.left);
            pre(n.right);
        }
        function post(n) {
            if (!n) return;
            post(n.left);
            post(n.right);
            res.push(n.value);
        }

        if (order === 'in') inOrder(this.root);
        if (order === 'pre') pre(this.root);
        if (order === 'post') post(this.root);

        this.output.textContent = 'Traversal Output: ' + (res.length ? res.join(' → ') : '');
    },

    render() {
        const container = $('bst-visual');
        container.innerHTML = '';
        if (!this.root) return;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        container.appendChild(svg);

        const width = container.offsetWidth || 800;
        const x = width / 2;
        const y = 30;

        this.drawNode(this.root, x, y, width / 4, container, svg);
    },

    drawNode(node, x, y, offset, container, svg) {
        if (!node) return;

        const el = document.createElement('div');
        el.className = 'tree-node';
        el.textContent = node.value;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        container.appendChild(el);

        if (node.left) {
            const childX = x - offset;
            const childY = y + 60;
            this.drawLine(x, y + 20, childX, childY - 20, svg);
            this.drawNode(node.left, childX, childY, offset / 1.8, container, svg);
        }

        if (node.right) {
            const childX = x + offset;
            const childY = y + 60;
            this.drawLine(x, y + 20, childX, childY - 20, svg);
            this.drawNode(node.right, childX, childY, offset / 1.8, container, svg);
        }
    },

    drawLine(x1, y1, x2, y2, svg) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#555');
        line.setAttribute('stroke-width', '2');
        svg.appendChild(line);
    },
};
