// fix: deployed 1779526199

/* ============================================================

   app.js — 互动课堂 · AI 智能学习平台

   高等数学（同济第八版）课程中心 · 交互式可视化引擎

   ============================================================ */



/* ═══════ 全局状态 ═══════ */

const state = {

  currentPage: 'dashboard',

  chatMessages: [],

  isTyping: false,

  sidebarCollapsed: false,

  courseView: 'select',     // select | chapters | kp | viz

  currentCourse: null,       // 当前选中课程

  currentChapter: null,      // 当前选中章节

  currentKP: null,           // 当前选中知识点

  vizAnimId: null,           // 可视化动画帧 ID

};



/* ═══════ 课程数据模型 ═══════ */

const coursesData = [

  {

    id: 'gaoshu', name: '高等数学', version: '同济第八版',

    desc: '涵盖微积分、级数、微分方程等核心内容，计算机专业必修基础课',

    color: '#6366f1', gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',

    chapters: 12, hours: 80, badge: '必修',

    available: true,

  },

  {

    id: 'clang', name: 'C 语言程序设计', version: '谭浩强版',

    desc: '从零开始掌握 C 语言，指针、内存管理、文件操作，配套在线编译运行环境',

    color: '#0ea5e9', gradient: 'linear-gradient(135deg,#0ea5e9,#38bdf8)',

    chapters: 10, hours: 60, badge: '编程基础',

    available: true,

  },

  {

    id: 'cpp', name: 'C++ 面向对象程序设计', version: '第4版',

    desc: '在 C 基础上掌握面向对象思想，类、继承、多态、STL 标准库',

    color: '#8b5cf6', gradient: 'linear-gradient(135deg,#8b5cf6,#a78bfa)',

    chapters: 12, hours: 72, badge: '进阶',

    available: true,

  },

  {

    id: 'ds', name: '数据结构与算法', version: '严蔚敏版 第三版',

    desc: '涵盖线性表、栈、队列、树、图、查找、排序等核心数据结构与算法，计算机专业核心基础课',

    color: '#10b981', gradient: 'linear-gradient(135deg,#10b981,#34d399)',

    chapters: 12, hours: 72, badge: '必修',

    available: true,

  },

  {

    id: 'la', name: '线性代数', version: '同济第七版',

    desc: '行列式、矩阵、向量空间、线性变换、特征值',

    color: '#f59e0b', gradient: 'linear-gradient(135deg,#f59e0b,#fbbf24)',

    chapters: 6, hours: 48, badge: '必修',

    available: true,

  },

  {

    id: 'prob', name: '概率论与数理统计', version: '浙大第五版',

    desc: '随机事件与概率、随机变量及其分布、数字特征、参数估计、假设检验、方差分析',

    color: '#ec4899', gradient: 'linear-gradient(135deg,#ec4899,#f472b6)',

    chapters: 9, hours: 64, badge: '必修',

    available: true,

  },

  {
    id: 'python', name: 'Python 程序设计', version: 'Python 3.x',
    desc: '涵盖Python语法基础、数据结构、函数、面向对象、文件操作与标准库，配套在线编程运行环境',
    color: '#3776AB', gradient: 'linear-gradient(135deg,#3776AB,#FFD43B)',
    chapters: 10, hours: 64, badge: '必修',
    available: true,
  },

  {

    id: 'os', name: '操作系统', version: '',

    desc: '进程管理、内存管理、文件系统、I/O系统',

    color: '#ef4444', gradient: 'linear-gradient(135deg,#ef4444,#f87171)',

    chapters: 0, hours: 0, badge: '即将推出',

    available: false,

  },

];



/* ═══════ 章节数据（高数同济第八版） ═══════ */

const chaptersData = [

  { courseId:'gaoshu', num:1, title:'函数与极限', vol:'上册', progress:100, level:'基础',

    kps:[

      {name:'映射与函数', desc:'函数概念、特性、反函数与复合函数', viz:'function-plotter'},

      {name:'数列的极限', desc:'数列极限的定义、收敛数列性质', viz:'sequence-limit'},

      {name:'函数的极限', desc:'函数极限定义、单侧极限、极限运算法则', viz:'epsilon-delta'},

      {name:'无穷小与无穷大', desc:'无穷小的比较、等价无穷小替换', viz:'infinitesimal'},

      {name:'极限存在准则与两个重要极限', desc:'夹逼准则、单调有界定理、sin(x)/x、(1+1/n)^n', viz:'important-limits'},

      {name:'函数的连续性与间断点', desc:'连续性定义、间断点分类、初等函数连续性', viz:'continuity'},

      {name:'闭区间上连续函数的性质', desc:'最大值最小值定理、零点定理、一致连续性', viz:'continuity'},

    ]},

  { courseId:'gaoshu', num:2, title:'导数与微分', vol:'上册', progress:100, level:'核心',

    kps:[

      {name:'导数概念', desc:'导数定义、几何意义与物理意义、可导与连续关系', viz:'secant-tangent'},

      {name:'函数的求导法则', desc:'四则运算、链式法则、反函数求导', viz:'derivative-plot'},

      {name:'高阶导数', desc:'二阶及高阶导数的定义与计算', viz:'higher-derivative'},

      {name:'隐函数及参数方程求导', desc:'隐函数求导法、对数求导法、参数方程求导', viz:'function-plotter'},

      {name:'函数的微分', desc:'微分定义、微分公式、微分在近似计算中的应用', viz:'secant-tangent'},

    ]},

  { courseId:'gaoshu', num:3, title:'微分中值定理与导数的应用', vol:'上册', progress:100, level:'核心',

    kps:[

      {name:'微分中值定理', desc:'罗尔定理、拉格朗日中值定理、柯西中值定理', viz:'mean-value'},

      {name:'洛必达法则', desc:'0/0型与∞/∞型未定式的求解', viz:'lhopital'},

      {name:'泰勒公式', desc:'泰勒展开、麦克劳林公式、常用展开式', viz:'taylor-series'},

      {name:'函数的单调性与曲线的凹凸性', desc:'一阶导数判单调性、二阶导数判凹凸性、拐点', viz:'monotonicity'},

      {name:'函数的极值与最大值最小值', desc:'极值的判定条件、最值问题', viz:'monotonicity'},

      {name:'曲率', desc:'弧微分、曲率公式、曲率圆与曲率半径', viz:'curvature'},

    ]},

  { courseId:'gaoshu', num:4, title:'不定积分', vol:'上册', progress:68, level:'重点',

    kps:[

      {name:'不定积分的概念与性质', desc:'原函数、不定积分定义、基本积分公式', viz:'riemann-sum'},

      {name:'换元积分法', desc:'第一类换元（凑微分）、第二类换元', viz:'function-plotter'},

      {name:'分部积分法', desc:'分部积分公式、选u口诀', viz:'riemann-sum'},

      {name:'有理函数的积分', desc:'部分分式分解、有理函数积分', viz:'function-plotter'},

      {name:'三角函数有理式的积分', desc:'万能代换、三角函数积分技巧', viz:'function-plotter'},

    ]},

  { courseId:'gaoshu', num:5, title:'定积分', vol:'上册', progress:15, level:'重点',

    kps:[

      {name:'定积分的概念与性质', desc:'分割求和取极限、可积条件、积分性质', viz:'riemann-sum'},

      {name:'微积分基本公式', desc:'Newton-Leibniz公式、变上限积分求导', viz:'riemann-sum'},

      {name:'定积分的换元法和分部积分法', desc:'定积分换元、奇偶性对称性', viz:'riemann-sum'},

      {name:'反常积分', desc:'无穷限反常积分、无界函数反常积分', viz:'improper-integral'},

      {name:'反常积分的审敛法', desc:'比较审敛法、极限审敛法、Γ函数', viz:'improper-integral'},

    ]},

  { courseId:'gaoshu', num:6, title:'定积分的应用', vol:'上册', progress:0, level:'应用',

    kps:[

      {name:'定积分的元素法', desc:'微元法思想与应用模式', viz:'riemann-sum'},

      {name:'定积分在几何学上的应用', desc:'面积、体积（旋转体）、弧长', viz:'riemann-sum'},

      {name:'定积分在物理学上的应用', desc:'变力做功、液体压力、引力', viz:'function-plotter'},

    ]},

  { courseId:'gaoshu', num:7, title:'微分方程', vol:'上册', progress:0, level:'进阶',

    kps:[

      {name:'微分方程的基本概念', desc:'微分方程、阶、解、通解与特解', viz:'direction-field'},

      {name:'可分离变量的微分方程', desc:'分离变量法求解', viz:'direction-field'},

      {name:'齐次方程', desc:'齐次方程的换元求解', viz:'direction-field'},

      {name:'一阶线性微分方程', desc:'常数变易法、一阶线性方程求解公式', viz:'direction-field'},

      {name:'可降阶的高阶微分方程', desc:'y\'\'=f(x)、y\'\'=f(x,y\')、y\'\'=f(y,y\')', viz:'function-plotter'},

      {name:'高阶线性微分方程', desc:'解的结构、叠加原理、Wronskian行列式', viz:'function-plotter'},

      {name:'常系数齐次线性微分方程', desc:'特征方程、特征根与通解形式', viz:'function-plotter'},

    ]},

  { courseId:'gaoshu', num:8, title:'向量代数与空间解析几何', vol:'上册', progress:0, level:'基础',

    kps:[

      {name:'向量及其运算', desc:'向量的加减、数乘、线性运算', viz:'surface-3d'},

      {name:'数量积 向量积 混合积', desc:'点乘、叉乘运算与几何意义', viz:'surface-3d'},

      {name:'曲面及其方程', desc:'旋转曲面、柱面、二次曲面', viz:'surface-3d'},

      {name:'空间曲线及其方程', desc:'参数方程、一般方程、投影柱面', viz:'surface-3d'},

      {name:'平面及其方程', desc:'点法式、一般式、截距式', viz:'surface-3d'},

      {name:'空间直线及其方程', desc:'点向式、参数式、一般式', viz:'surface-3d'},

    ]},

  { courseId:'gaoshu', num:9, title:'多元函数微分法及其应用', vol:'下册', progress:0, level:'进阶',

    kps:[

      {name:'多元函数的基本概念', desc:'平面点集、多元函数极限与连续', viz:'surface-3d'},

      {name:'偏导数', desc:'偏导数定义与计算、高阶偏导数', viz:'surface-3d'},

      {name:'全微分', desc:'全微分定义、可微条件', viz:'surface-3d'},

      {name:'复合函数的微分法', desc:'多元复合函数链式法则', viz:'function-plotter'},

      {name:'隐函数的微分法', desc:'隐函数存在定理、隐函数求导', viz:'function-plotter'},

      {name:'多元函数微分学的几何应用', desc:'空间曲线切线与法平面、曲面切平面与法线', viz:'surface-3d'},

      {name:'方向导数与梯度', desc:'方向导数定义、梯度向量', viz:'surface-3d'},

      {name:'多元函数的极值及其求法', desc:'无条件极值、条件极值与拉格朗日乘数法', viz:'surface-3d'},

    ]},

  { courseId:'gaoshu', num:10, title:'重积分', vol:'下册', progress:0, level:'重点',

    kps:[

      {name:'二重积分的概念与性质', desc:'曲顶柱体体积、二重积分定义与性质', viz:'volume-3d'},

      {name:'二重积分的计算法', desc:'直角坐标、极坐标下的计算', viz:'volume-3d'},

      {name:'三重积分', desc:'三重积分定义与计算', viz:'volume-3d'},

      {name:'重积分的应用', desc:'体积、曲面面积、质心、转动惯量', viz:'volume-3d'},

    ]},

  { courseId:'gaoshu', num:11, title:'曲线积分与曲面积分', vol:'下册', progress:0, level:'进阶',

    kps:[

      {name:'对弧长的曲线积分', desc:'第一类曲线积分的定义与计算', viz:'surface-3d'},

      {name:'对坐标的曲线积分', desc:'第二类曲线积分、Green公式', viz:'surface-3d'},

      {name:'格林公式及其应用', desc:'Green公式、曲线积分与路径无关的条件', viz:'function-plotter'},

      {name:'对面积的曲面积分', desc:'第一类曲面积分的定义与计算', viz:'surface-3d'},

      {name:'对坐标的曲面积分', desc:'第二类曲面积分、Gauss公式', viz:'surface-3d'},

      {name:'高斯公式与斯托克斯公式', desc:'Gauss公式、Stokes公式', viz:'function-plotter'},

    ]},

  { courseId:'gaoshu', num:12, title:'无穷级数', vol:'下册', progress:0, level:'重点',

    kps:[

      {name:'常数项级数的概念和性质', desc:'级数收敛定义、收敛级数性质', viz:'series-convergence'},

      {name:'常数项级数的审敛法', desc:'正项级数、比较法、比值法、根值法', viz:'series-convergence'},

      {name:'交错级数', desc:'Leibniz判别法、绝对收敛与条件收敛', viz:'series-convergence'},

      {name:'幂级数', desc:'收敛半径、收敛区间、幂级数运算', viz:'series-convergence'},

      {name:'函数展开成幂级数', desc:'Taylor级数、常用展开式', viz:'taylor-series'},

      {name:'傅里叶级数', desc:'三角级数、Fourier系数、收敛定理', viz:'fourier-series'},

    ]},

  /* ═══ C 语言章节 ═══ */

  { courseId:'clang', num:1, title:'C 语言概述与环境', vol:'基础', progress:0, level:'入门',

    kps:[

      {name:'C 语言历史与应用', desc:'C 语言发展历程、应用领域与特点', viz:'code-demo'},

      {name:'开发环境配置', desc:'编译器安装、IDE 使用、第一个 Hello World', viz:'code-demo'},

      {name:'程序结构', desc:'main 函数、预处理指令、注释规范', viz:'code-demo'},

    ]},

  { courseId:'clang', num:2, title:'数据类型与变量', vol:'基础', progress:0, level:'基础',

    kps:[

      {name:'基本数据类型', desc:'int、float、double、char 的范围与用法', viz:'code-demo'},

      {name:'变量与常量', desc:'变量声明、初始化、const 常量、#define 宏', viz:'code-demo'},

      {name:'类型转换', desc:'隐式转换、强制类型转换、sizeof 运算符', viz:'code-demo'},

    ]},

  { courseId:'clang', num:3, title:'运算符与表达式', vol:'基础', progress:0, level:'基础',

    kps:[

      {name:'算术与关系运算符', desc:'加减乘除取模、比较运算符与优先级', viz:'code-demo'},

      {name:'逻辑与位运算符', desc:'&&、||、!，按位与或非移位', viz:'code-demo'},

      {name:'赋值与条件运算符', desc:'复合赋值、三目运算符 ?:', viz:'code-demo'},

    ]},

  { courseId:'clang', num:4, title:'控制流程', vol:'基础', progress:0, level:'基础',

    kps:[

      {name:'条件语句', desc:'if-else、switch-case 的语法与使用', viz:'code-demo'},

      {name:'循环语句', desc:'for、while、do-while 的区别与应用', viz:'code-demo'},

      {name:'跳转语句', desc:'break、continue、goto 的使用场景', viz:'code-demo'},

    ]},

  { courseId:'clang', num:5, title:'函数', vol:'核心', progress:0, level:'核心',

    kps:[

      {name:'函数定义与调用', desc:'函数原型、参数传递（值传递）、返回值', viz:'code-demo'},

      {name:'递归函数', desc:'递归思想、递归条件、经典递归问题', viz:'code-demo'},

      {name:'变量作用域', desc:'局部变量、全局变量、static 静态变量', viz:'code-demo'},

    ]},

  { courseId:'clang', num:6, title:'数组与字符串', vol:'核心', progress:0, level:'核心',

    kps:[

      {name:'一维与二维数组', desc:'数组声明、初始化、遍历与操作', viz:'code-demo'},

      {name:'字符数组与字符串', desc:'字符串的存储、常用库函数 strlen/strcpy/strcmp', viz:'code-demo'},

      {name:'数组与函数', desc:'数组作为函数参数、返回数组', viz:'code-demo'},

    ]},

  { courseId:'clang', num:7, title:'指针', vol:'核心', progress:0, level:'重点',

    kps:[

      {name:'指针基础', desc:'指针的定义、取址运算 & 与解引用 *', viz:'code-demo'},

      {name:'指针与数组', desc:'指针算术、数组名即指针、指针遍历数组', viz:'code-demo'},

      {name:'指针与函数', desc:'指针传参（地址传递）、函数指针', viz:'code-demo'},

      {name:'多级指针', desc:'二级指针、指针数组与数组指针', viz:'code-demo'},

    ]},

  { courseId:'clang', num:8, title:'结构体与联合体', vol:'核心', progress:0, level:'重点',

    kps:[

      {name:'结构体', desc:'struct 定义、成员访问、结构体数组', viz:'code-demo'},

      {name:'联合体与枚举', desc:'union 共享内存特性、enum 枚举类型', viz:'code-demo'},

      {name:'链表基础', desc:'动态分配节点、单链表的创建与遍历', viz:'code-demo'},

    ]},

  { courseId:'clang', num:9, title:'文件操作', vol:'进阶', progress:0, level:'进阶',

    kps:[

      {name:'文件的打开与关闭', desc:'fopen/fclose、文件模式 r/w/a', viz:'code-demo'},

      {name:'文件的读写', desc:'fgetc/fputc、fgets/fputs、fscanf/fprintf', viz:'code-demo'},

      {name:'二进制文件', desc:'fread/fwrite、文件定位 fseek/ftell', viz:'code-demo'},

    ]},

  { courseId:'clang', num:10, title:'动态内存与预处理', vol:'进阶', progress:0, level:'进阶',

    kps:[

      {name:'动态内存管理', desc:'malloc/calloc/realloc/free 的用法与内存泄漏', viz:'code-demo'},

      {name:'预处理器', desc:'宏定义、条件编译、头文件包含与防重复', viz:'code-demo'},

      {name:'常见编程错误', desc:'越界、野指针、内存泄漏的调试技巧', viz:'code-demo'},

    ]},

  /* ═══ C++ 章节 ═══ */

  { courseId:'cpp', num:1, title:'C++ 基础与 C 扩展', vol:'基础', progress:0, level:'入门',

    kps:[

      {name:'C++ 与 C 的区别', desc:'命名空间、cin/cout、bool 类型、内联函数', viz:'code-demo'},

      {name:'引用', desc:'引用的定义与使用、引用传参、常量引用', viz:'code-demo'},

      {name:'函数重载与默认参数', desc:'重载规则、默认参数值、重载解析', viz:'code-demo'},

    ]},

  { courseId:'cpp', num:2, title:'类与对象', vol:'基础', progress:0, level:'核心',

    kps:[

      {name:'类的定义', desc:'class 关键字、成员变量与成员函数、访问控制', viz:'code-demo'},

      {name:'构造与析构函数', desc:'构造函数重载、拷贝构造、析构函数', viz:'code-demo'},

      {name:'this 指针', desc:'this 指针的含义与使用场景', viz:'code-demo'},

    ]},

  { courseId:'cpp', num:3, title:'运算符重载', vol:'基础', progress:0, level:'核心',

    kps:[

      {name:'运算符重载基础', desc:'operator 关键字、成员函数与友元函数重载', viz:'code-demo'},

      {name:'常见运算符重载', desc:'+、-、==、<<、>> 的重载实现', viz:'code-demo'},

      {name:'赋值运算符与深拷贝', desc:'operator= 与深拷贝、移动语义简介', viz:'code-demo'},

    ]},

  { courseId:'cpp', num:4, title:'继承', vol:'核心', progress:0, level:'核心',

    kps:[

      {name:'继承基础', desc:'public/protected/private 继承方式', viz:'code-demo'},

      {name:'派生类', desc:'基类与派生类关系、构造顺序、override', viz:'code-demo'},

      {name:'多重继承', desc:'多重继承语法、菱形继承问题与虚基类', viz:'code-demo'},

    ]},

  { courseId:'cpp', num:5, title:'多态与虚函数', vol:'核心', progress:0, level:'重点',

    kps:[

      {name:'虚函数', desc:'virtual 关键字、虚函数表、动态绑定', viz:'code-demo'},

      {name:'纯虚函数与抽象类', desc:'= 0 纯虚函数、抽象类不可实例化', viz:'code-demo'},

      {name:'虚析构函数', desc:'基类指针删除派生类对象时的正确析构', viz:'code-demo'},

    ]},

  { courseId:'cpp', num:6, title:'模板', vol:'核心', progress:0, level:'重点',

    kps:[

      {name:'函数模板', desc:'template<typename T> 函数模板语法与实例化', viz:'code-demo'},

      {name:'类模板', desc:'模板类的定义、成员函数模板、偏特化', viz:'code-demo'},

      {name:'模板元编程简介', desc:'编译期计算、enable_if 简介', viz:'code-demo'},

    ]},

  { courseId:'cpp', num:7, title:'STL 标准库', vol:'进阶', progress:0, level:'重点',

    kps:[

      {name:'容器', desc:'vector、list、map、set 的用法与选型', viz:'code-demo'},

      {name:'迭代器', desc:'迭代器分类、begin/end、范围 for 循环', viz:'code-demo'},

      {name:'算法', desc:'sort、find、transform、accumulate 常用算法', viz:'code-demo'},

    ]},

  { courseId:'cpp', num:8, title:'异常处理', vol:'进阶', progress:0, level:'进阶',

    kps:[

      {name:'try-catch-throw', desc:'异常的抛出、捕获与重新抛出', viz:'code-demo'},

      {name:'标准异常类', desc:'std::exception 体系、自定义异常', viz:'code-demo'},

      {name:'RAII 资源管理', desc:'构造获取资源、析构释放资源、智能指针简介', viz:'code-demo'},

    ]},

  { courseId:'cpp', num:9, title:'智能指针与现代 C++', vol:'进阶', progress:0, level:'进阶',

    kps:[

      {name:'unique_ptr 与 shared_ptr', desc:'独占与共享所有权、make_unique/make_shared', viz:'code-demo'},

      {name:'移动语义与右值引用', desc:'std::move、移动构造函数、完美转发', viz:'code-demo'},

      {name:'Lambda 表达式', desc:'捕获列表、参数类型推断、与 STL 配合', viz:'code-demo'},

    ]},

  { courseId:'cpp', num:10, title:'文件与字符串流', vol:'进阶', progress:0, level:'进阶',

    kps:[

      {name:'文件流', desc:'ifstream/ofstream/fstream 的使用', viz:'code-demo'},

      {name:'字符串流', desc:'stringstream 的解析与格式化应用', viz:'code-demo'},

    ]},

  { courseId:'cpp', num:11, title:'并发编程简介', vol:'进阶', progress:0, level:'进阶',

    kps:[

      {name:'std::thread', desc:'线程创建、join/detach、线程参数传递', viz:'code-demo'},

      {name:'互斥与条件变量', desc:'mutex、lock_guard、condition_variable', viz:'code-demo'},

    ]},

  { courseId:'cpp', num:12, title:'设计模式与最佳实践', vol:'进阶', progress:0, level:'进阶',

    kps:[

      {name:'常用设计模式', desc:'单例、工厂、观察者模式的 C++ 实现', viz:'code-demo'},

      {name:'代码规范与调试', desc:'命名规范、const 正确性、Valgrind 内存检测', viz:'code-demo'},

    ]},

  /* ═══ 数据结构与算法（严蔚敏版 第三版）章节 ═══ */

  { courseId:'ds', num:1, title:'绪论', vol:'基础', progress:0, level:'基础',

    kps:[

      {name:'数据结构基本概念', desc:'数据、数据元素、数据对象、数据结构的定义与关系', viz:'ds-basic-viz'},

      {name:'逻辑结构与存储结构', desc:'集合、线性、树形、图形四种逻辑结构；顺序与链式存储', viz:'ds-basic-viz'},

      {name:'算法与算法分析', desc:'算法五要素、时间复杂度O(n)、空间复杂度分析方法', viz:'ds-basic-viz'},

    ]},

  { courseId:'ds', num:2, title:'线性表', vol:'基础', progress:0, level:'重点',

    kps:[

      {name:'线性表的顺序存储', desc:'顺序表的定义、插入、删除、查找操作及时间复杂度', viz:'ds-basic-viz'},

      {name:'线性表的链式存储', desc:'单链表的结构、头节点、插入删除操作与指针操作', viz:'ds-basic-viz'},

      {name:'循环链表与双向链表', desc:'循环单链表、双向链表的结构特点与操作差异', viz:'ds-basic-viz'},

      {name:'线性表的应用', desc:'多项式相加、约瑟夫环问题、线性表的合并', viz:'ds-basic-viz'},

    ]},

  { courseId:'ds', num:3, title:'栈和队列', vol:'基础', progress:0, level:'重点',

    kps:[

      {name:'栈的定义与操作', desc:'栈的LIFO特性、顺序栈与链栈的实现、Push/Pop操作', viz:'ds-basic-viz'},

      {name:'栈的应用', desc:'表达式求值、括号匹配、进制转换、递归与栈帧', viz:'ds-basic-viz'},

      {name:'队列的定义与操作', desc:'队列的FIFO特性、循环队列的判满判空条件', viz:'ds-basic-viz'},

      {name:'队列的应用', desc:'BFS广度优先遍历、打印机队列、消息缓冲', viz:'ds-basic-viz'},

    ]},

  { courseId:'ds', num:4, title:'串', vol:'基础', progress:0, level:'核心',

    kps:[

      {name:'串的基本概念', desc:'串的定义、空串与空格串、串的顺序与链式存储', viz:'ds-basic-viz'},

      {name:'串的模式匹配', desc:'BF暴力匹配算法、KMP算法原理与next数组计算', viz:'ds-basic-viz'},

      {name:'串的基本操作', desc:'StrAssign、StrCopy、StrLen、Concat、SubStr实现', viz:'ds-basic-viz'},

    ]},

  { courseId:'ds', num:5, title:'数组和广义表', vol:'基础', progress:0, level:'了解',

    kps:[

      {name:'数组的顺序存储', desc:'一维与多维数组的地址计算、行优先与列优先存储', viz:'ds-basic-viz'},

      {name:'特殊矩阵的压缩存储', desc:'对称矩阵、三角矩阵、稀疏矩阵的压缩方法', viz:'ds-basic-viz'},

      {name:'广义表', desc:'广义表的定义、Head/Tail操作、广义表的链式存储结构', viz:'ds-basic-viz'},

    ]},

  { courseId:'ds', num:6, title:'树和二叉树', vol:'核心', progress:0, level:'重点',

    kps:[

      {name:'树与二叉树的定义', desc:'树的基本术语、二叉树五种形态、二叉树性质与推导', viz:'tree-visualizer'},

      {name:'二叉树的遍历', desc:'先序、中序、后序遍历递归与非递归实现、层次遍历', viz:'tree-visualizer'},

      {name:'线索二叉树', desc:'中序线索化、线索链表结构、线索遍历算法', viz:'tree-visualizer'},

      {name:'树与森林', desc:'树的孩子兄弟链表表示、树与二叉树的转换、森林遍历', viz:'tree-visualizer'},

      {name:'哈夫曼树', desc:'WPL最小原理、哈夫曼树构造、哈夫曼编码应用', viz:'tree-visualizer'},

    ]},

  { courseId:'ds', num:7, title:'图', vol:'核心', progress:0, level:'重点',

    kps:[

      {name:'图的基本概念', desc:'有向图无向图、完全图、度、路径、连通性基本定义', viz:'graph-visualizer'},

      {name:'图的存储结构', desc:'邻接矩阵、邻接表、十字链表、邻接多重表对比', viz:'graph-visualizer'},

      {name:'图的遍历', desc:'DFS深度优先与BFS广度优先遍历算法、时间复杂度分析', viz:'graph-visualizer'},

      {name:'最小生成树', desc:'Prim算法（加点法）与Kruskal算法（加边法）原理与实现', viz:'graph-visualizer'},

      {name:'最短路径', desc:'Dijkstra单源最短路径、Floyd多源最短路径算法', viz:'graph-visualizer'},

      {name:'拓扑排序与关键路径', desc:'AOV网拓扑排序、AOE网关键路径与最早最晚时间', viz:'graph-visualizer'},

    ]},

  { courseId:'ds', num:8, title:'动态存储管理', vol:'核心', progress:0, level:'了解',

    kps:[

      {name:'动态存储分配', desc:'边界标识法、伙伴系统、内存碎片问题与垃圾回收', viz:'graph-visualizer'},

      {name:'堆的管理', desc:'malloc/free原理、首次适应与最佳适应算法对比', viz:'graph-visualizer'},

    ]},

  { courseId:'ds', num:9, title:'查找', vol:'核心', progress:0, level:'重点',

    kps:[

      {name:'静态查找表', desc:'顺序查找、二分查找（折半查找）、分块查找及性能分析', viz:'graph-visualizer'},

      {name:'二叉排序树', desc:'BST的插入、删除、查找操作，平均查找长度ASL分析', viz:'graph-visualizer'},

      {name:'平衡二叉树', desc:'AVL树的定义、失衡类型（LL/RR/LR/RL）与旋转调整', viz:'graph-visualizer'},

      {name:'哈希表', desc:'散列函数设计、开放地址法与链地址法处理冲突、装填因子', viz:'graph-visualizer'},

    ]},

  { courseId:'ds', num:10, title:'内部排序', vol:'进阶', progress:0, level:'重点',

    kps:[

      {name:'插入排序', desc:'直接插入排序、折半插入排序、希尔排序原理与复杂度', viz:'sort-visualizer'},

      {name:'交换排序', desc:'冒泡排序与快速排序划分策略、Partition过程分析', viz:'sort-visualizer'},

      {name:'选择排序', desc:'简单选择排序、堆排序建堆过程与堆调整算法', viz:'sort-visualizer'},

      {name:'归并排序', desc:'二路归并递归与非递归实现、归并排序的稳定性', viz:'sort-visualizer'},

      {name:'基数排序', desc:'多关键字排序、LSD链式基数排序过程与复杂度分析', viz:'sort-visualizer'},

    ]},

  { courseId:'ds', num:11, title:'外部排序', vol:'进阶', progress:0, level:'了解',

    kps:[

      {name:'外部排序概述', desc:'磁盘排序、归并段生成、多路归并的I/O代价分析', viz:'code-demo'},

      {name:'最佳归并树', desc:'最佳归并树构造、败者树加速多路归并的原理', viz:'code-demo'},

    ]},

  { courseId:'ds', num:12, title:'文件', vol:'进阶', progress:0, level:'了解',

    kps:[

      {name:'文件组织方式', desc:'顺序文件、索引文件、散列文件的结构与适用场景', viz:'code-demo'},

      {name:'索引文件与倒排文件', desc:'稠密索引、稀疏索引、B树索引、倒排文件原理', viz:'code-demo'},

    ]},

  /* ═══ 概率论与数理统计（浙大第五版）章节 ═══ */

  { courseId:'prob', num:1, title:'概率论的基本概念', vol:'概率论', progress:0, level:'基础',

    kps:[

      {name:'随机试验与样本空间', desc:'随机现象、样本空间、随机事件的概念与分类', viz:'probability-basic'},

      {name:'事件的关系与运算', desc:'包含、相等、并、交、差、补、互斥、对立事件', viz:'probability-basic'},

      {name:'频率与概率', desc:'频率的稳定性、概率的公理化定义与基本性质', viz:'probability-basic'},

      {name:'等可能概型（古典概型）', desc:'有限样本空间、等可能性、排列组合计算概率', viz:'probability-basic'},

      {name:'条件概率', desc:'条件概率定义、乘法公式、全概率公式、贝叶斯公式', viz:'bayes-theorem'},

      {name:'独立性', desc:'两事件独立、多个事件独立、独立与互斥的区别', viz:'probability-basic'},

      {name:'几何概型', desc:'几何概型定义、约会问题、会面问题、有利区域计算', viz:'probability-basic'},

      {name:'概率的公理化定义', desc:'柯尔莫哥洛夫公理体系、可列可加性、概率性质严格推导', viz:'probability-basic'},

      {name:'全概率公式与贝叶斯公式再探', desc:'完备事件组、先验与后验、医学检测与商品检验应用', viz:'bayes-theorem'},

      {name:'伯努利概型', desc:'n重伯努利试验、二项分布、多项分布、分赌注问题', viz:'binom-normal'},

    ]},

  { courseId:'prob', num:2, title:'随机变量及其分布', vol:'概率论', progress:0, level:'核心',

    kps:[

      {name:'随机变量', desc:'随机变量的概念、离散型与连续型的分类', viz:'probability-distribution'},

      {name:'离散型随机变量', desc:'分布律、(0-1)分布、二项分布、泊松分布', viz:'probability-distribution'},

      {name:'随机变量的分布函数', desc:'分布函数定义、性质与计算', viz:'probability-distribution'},

      {name:'连续型随机变量', desc:'概率密度函数、均匀分布、指数分布、正态分布', viz:'normal-distribution'},

      {name:'随机变量的函数的分布', desc:'离散型函数分布、连续型函数分布（定理法与公式法）', viz:'probability-distribution'},

      {name:'几何分布、超几何分布与负二项分布', desc:'无记忆性、有限总体修正、分布对比与应用', viz:'probability-distribution'},

      {name:'正态分布的完整形态', desc:'标准正态、3σ原则、分位数、线性组合、与二项泊松关系', viz:'normal-distribution'},

      {name:'随机变量函数分布小结', desc:'F⁻¹法、公式法、非单调函数处理、典型例题', viz:'probability-distribution'},

    ]},

  { courseId:'prob', num:3, title:'多维随机变量及其分布', vol:'概率论', progress:0, level:'核心',

    kps:[

      {name:'二维随机变量', desc:'联合分布函数、联合分布律、联合概率密度', viz:'joint-distribution'},

      {name:'边缘分布', desc:'边缘分布函数、边缘分布律、边缘概率密度', viz:'joint-distribution'},

      {name:'条件分布', desc:'离散型条件分布律、连续型条件概率密度', viz:'joint-distribution'},

      {name:'相互独立的随机变量', desc:'独立性的定义与判断、独立与函数的关系', viz:'joint-distribution'},

      {name:'两个随机变量的函数的分布', desc:'Z=X+Y、Z=max/min(X,Y)等的分布求解', viz:'probability-distribution'},

      {name:'二维随机变量函数的分布', desc:'卷积公式、Z=X/Y、Z=XY、独立和分布', viz:'joint-distribution'},

      {name:'二维正态分布', desc:'五参数、边缘正态、不相关与独立等价、条件分布', viz:'joint-distribution'},

    ]},

  { courseId:'prob', num:4, title:'随机变量的数字特征', vol:'概率论', progress:0, level:'重点',

    kps:[

      {name:'数学期望', desc:'期望定义、性质、常见分布的期望', viz:'expectation-variance'},

      {name:'方差', desc:'方差定义、计算公式、性质、常见分布的方差', viz:'expectation-variance'},

      {name:'协方差与相关系数', desc:'协方差定义、相关系数、独立与不相关的关系', viz:'correlation'},

      {name:'矩与协方差矩阵', desc:'k阶矩、协方差矩阵的性质与应用', viz:'expectation-variance'},

      {name:'条件数学期望', desc:'全期望公式、全方差公式、回归分析中的条件期望', viz:'expectation-variance'},

      {name:'特征函数', desc:'特征函数定义、矩与特征函数、唯一性定理、常见分布特征函数', viz:'expectation-variance'},

    ]},

  { courseId:'prob', num:5, title:'大数定律及中心极限定理', vol:'概率论', progress:0, level:'进阶',

    kps:[

      {name:'大数定律', desc:'切比雪夫定理、伯努利大数定律、辛钦大数定律', viz:'clt-visualization'},

      {name:'中心极限定理', desc:'独立同分布中心极限定理、棣莫弗-拉普拉斯定理', viz:'clt-visualization'},

      {name:'切比雪夫不等式详解', desc:'不等式变形、概率估计、大数定律再探', viz:'clt-visualization'},

      {name:'拉普拉斯定理（棣莫弗-拉普拉斯）', desc:'二项分布正态近似、连续性修正、应用', viz:'clt-visualization'},

      {name:'大数定律与中心极限定理的联系', desc:'定性vs定量、极限分布、误差控制', viz:'clt-visualization'},

    ]},

  { courseId:'prob', num:6, title:'样本及抽样分布', vol:'数理统计', progress:0, level:'基础',

    kps:[

      {name:'随机样本', desc:'总体与样本、简单随机样本、统计量', viz:'sampling-distribution'},

      {name:'抽样分布', desc:'χ²分布、t分布、F分布的定义与性质', viz:'sampling-distribution'},

      {name:'正态总体的抽样分布', desc:'样本均值与方差的分布、重要定理', viz:'sampling-distribution'},

      {name:'经验分布函数', desc:'Fₙ(x)定义、格里文科定理、K-S检验', viz:'sampling-distribution'},

      {name:'顺序统计量', desc:'第k顺序统计量分布、极差、中位数渐近分布', viz:'sampling-distribution'},

    ]},

  { courseId:'prob', num:7, title:'参数估计', vol:'数理统计', progress:0, level:'重点',

    kps:[

      {name:'点估计', desc:'矩估计法、最大似然估计法', viz:'parameter-estimation'},

      {name:'估计量的评选标准', desc:'无偏性、有效性、一致性（相合性）', viz:'parameter-estimation'},

      {name:'区间估计', desc:'置信区间、正态总体参数的区间估计', viz:'parameter-estimation'},

      {name:'单侧置信区间', desc:'单侧置信上限与下限的求解', viz:'parameter-estimation'},

      {name:'双正态总体区间估计', desc:'均值差与方差比的置信区间、合并方差、Welch近似', viz:'parameter-estimation'},

      {name:'样本容量的确定', desc:'均值与比例的样本量公式、两类错误与功效', viz:'parameter-estimation'},

    ]},

  { courseId:'prob', num:8, title:'假设检验', vol:'数理统计', progress:0, level:'重点',

    kps:[

      {name:'假设检验基本概念', desc:'原假设与备择假设、检验统计量、显著性水平、拒绝域', viz:'hypothesis-test'},

      {name:'正态总体均值的假设检验', desc:'Z检验、t检验（单总体与双总体）', viz:'hypothesis-test'},

      {name:'正态总体方差的假设检验', desc:'χ²检验、F检验', viz:'hypothesis-test'},

      {name:'分布拟合检验', desc:'χ²拟合优度检验、独立性检验', viz:'hypothesis-test'},

      {name:'单侧检验', desc:'单侧vs双侧、Z/t单侧检验、实际应用选择', viz:'hypothesis-test'},

      {name:'双正态总体假设检验', desc:'两样本Z/t检验、配对t检验、F检验', viz:'hypothesis-test'},

      {name:'非参数检验', desc:'符号检验、Wilcoxon秩和检验、K-S检验、Kruskal-Wallis检验', viz:'hypothesis-test'},

    ]},

  { courseId:'prob', num:9, title:'方差分析及回归分析', vol:'数理统计', progress:0, level:'进阶',

    kps:[

      {name:'单因素方差分析', desc:'因素、水平、平方和分解、F检验', viz:'anova-visualization'},

      {name:'双因素方差分析', desc:'交互效应、有/无重复试验的双因素分析', viz:'anova-visualization'},

      {name:'一元线性回归', desc:'回归方程、最小二乘法、显著性检验', viz:'regression-plot'},

      {name:'多元线性回归', desc:'多元回归模型、回归系数估计、模型检验', viz:'regression-plot'},

      {name:'拟合优度与残差分析', desc:'R²与调整R²、残差图、异常值检测、异方差与自相关检验', viz:'regression-plot'},

      {name:'可线性化的非线性回归', desc:'双曲线/幂函数/指数/对数变换、多项式回归、非线性最小二乘', viz:'regression-plot'},

      {name:'回归诊断与模型选择', desc:'线性/方差齐性/独立性/正态性诊断、多重共线性、逐步回归、AIC/BIC', viz:'regression-plot'},

    ]},

  /* === Python 程序设计 === */
  { courseId:'python', num:1, title:'Python 概述与环境', vol:'基础', progress:0, level:'入门',
    kps:[
      {name:'Python 简介与应用领域', desc:'Python的发展历程、设计哲学、主要应用领域（Web/数据科学/AI/自动化）', viz:'py-viz'},
      {name:'开发环境配置', desc:'Python解释器安装、IDE选择（PyCharm/VSCode）、交互式Shell与pip包管理', viz:'py-viz'},
      {name:'第一个Python程序', desc:'print()函数、注释规范、代码缩进规则、程序运行方式', viz:'py-viz'},
    ]},
  { courseId:'python', num:2, title:'基本数据类型与变量', vol:'基础', progress:0, level:'基础',
    kps:[
      {name:'变量与命名规则', desc:'变量的动态类型特性、命名规范（蛇形命名法）、关键字、多重赋值与变量交换', viz:'py-viz'},
      {name:'基本数据类型', desc:'int、float、complex、bool、str的类型特性、字面量语法与type()函数', viz:'py-viz'},
      {name:'类型转换与运算符', desc:'算术/关系/逻辑/成员/同一性运算符、类型转换函数、运算符优先级', viz:'py-viz'},
    ]},
  { courseId:'python', num:3, title:'程序流程控制', vol:'基础', progress:0, level:'基础',
    kps:[
      {name:'条件判断', desc:'if/elif/else多分支结构、三元表达式、match-case模式匹配（Python 3.10+）', viz:'py-viz'},
      {name:'循环语句', desc:'for-in遍历、while循环、range()函数、break/continue/pass、循环else子句', viz:'py-viz'},
      {name:'流程控制综合', desc:'嵌套循环、九九乘法表、猜数字游戏、斐波那契数列、素数判断', viz:'py-viz'},
    ]},
  { courseId:'python', num:4, title:'序列类型', vol:'核心', progress:0, level:'核心',
    kps:[
      {name:'列表操作', desc:'列表的创建、索引与切片、增删改查、sort/reverse排序、列表推导式', viz:'py-viz'},
      {name:'元组与不可变性', desc:'元组特性与使用场景、打包与解包、命名元组、与列表的选择策略', viz:'py-viz'},
      {name:'字符串处理', desc:'字符串创建（单/双/三引号）、转义字符、常用方法（split/join/strip/replace）', viz:'py-viz'},
      {name:'序列通用操作', desc:'索引、切片、len/min/max/sum、in成员检测、+与*运算符、enumerate遍历', viz:'py-viz'},
    ]},
  { courseId:'python', num:5, title:'字典与集合', vol:'核心', progress:0, level:'核心',
    kps:[
      {name:'字典操作', desc:'dict创建（字面量/dict()/推导式）、增删改查、keys/values/items、get/setdefault默认值', viz:'py-viz'},
      {name:'集合与运算', desc:'set与frozenset、集合运算（并交差对称差）、去重应用、成员检测O(1)特性', viz:'py-viz'},
    ]},
  { courseId:'python', num:6, title:'函数', vol:'核心', progress:0, level:'核心',
    kps:[
      {name:'函数定义与参数', desc:'def定义、返回值、位置参数/默认参数/关键字参数/*args/**kwargs可变参数', viz:'py-viz'},
      {name:'递归函数', desc:'递归三要素（终止/递推/返回）、阶乘/斐波那契/汉诺塔、递归深度限制与优化', viz:'py-viz'},
      {name:'变量作用域与lambda', desc:'LEGB规则、global/nonlocal关键字、lambda匿名函数、map/filter高阶函数', viz:'py-viz'},
    ]},
  { courseId:'python', num:7, title:'模块与包管理', vol:'进阶', progress:0, level:'进阶',
    kps:[
      {name:'模块导入机制', desc:'import/from-import语法、自定义模块、主程序入口、包与__init__.py', viz:'py-viz'},
      {name:'常用标准库实战', desc:'random随机数、time/datetime时间处理、os/sys系统操作、json数据序列化', viz:'py-viz'},
    ]},
  { courseId:'python', num:8, title:'文件与异常处理', vol:'进阶', progress:0, level:'进阶',
    kps:[
      {name:'文件读写操作', desc:'open()函数、文件模式（r/w/a/x/b/+）、read/write/readline、with上下文管理器', viz:'py-viz'},
      {name:'CSV与JSON处理', desc:'csv模块读写、json.dumps/loads序列化、大文件分块读取、编码问题处理', viz:'py-viz'},
      {name:'异常捕获与处理', desc:'try/except/else/finally、常见异常类型、raise抛出、自定义异常类', viz:'py-viz'},
    ]},
  { courseId:'python', num:9, title:'面向对象基础', vol:'进阶', progress:0, level:'进阶',
    kps:[
      {name:'类与对象', desc:'class定义、__init__构造方法、self参数、实例属性与方法、__str__字符串表示', viz:'py-viz'},
      {name:'继承与多态', desc:'单继承、方法重写、super()调用父类、多态实现、isinstance/issubclass类型检查', viz:'py-viz'},
      {name:'魔术方法与特性', desc:'容器协议(__len__/__getitem__)、@property装饰器、__call__可调用对象', viz:'py-viz'},
    ]},
  { courseId:'python', num:10, title:'综合实战项目', vol:'实战', progress:0, level:'实战',
    kps:[
      {name:'爬虫入门', desc:'requests网络请求、BeautifulSoup解析HTML、正则表达式提取、反爬策略应对', viz:'py-viz'},
      {name:'数据分析基础', desc:'pandas数据读取与清洗、matplotlib可视化、数据透视与分组聚合、基本统计分析', viz:'py-viz'},
      {name:'项目实战', desc:'综合运用所学知识完成一个完整的Python应用项目，涵盖数据获取、处理、分析与展示', viz:'py-viz'},
    ]},

  { courseId:'la', num:1, title:'行列式', vol:'基础', progress:0, level:'基础',
    kps:[
      {name:'二阶与三阶行列式', desc:'对角线法则、三阶行列式计算', viz:'la-det2'},
      {name:'全排列与对换', desc:'排列逆序数、奇偶排列、对换与排列奇偶性', viz:'la-permutation'},
      {name:'n阶行列式的定义', desc:'n阶行列式的展开定义、项的符号决定', viz:'la-n-det'},
      {name:'行列式的性质', desc:'转置、互换、数乘、倍加、拆分等6条性质', viz:'la-det-prop'},
      {name:'行列式按行(列)展开', desc:'余子式与代数余子式、拉普拉斯展开定理', viz:'la-cofactor'},
      {name:'克拉默法则', desc:'用行列式解n元线性方程组、齐次与非齐次', viz:'la-cramer'},
    ]},
  { courseId:'la', num:2, title:'矩阵及其运算', vol:'基础', progress:0, level:'基础',
    kps:[
      {name:'矩阵的概念', desc:'矩阵定义、特殊矩阵（零/单位/对角/对称）', viz:'la-matrix-concept'},
      {name:'矩阵的线性运算', desc:'矩阵加减法、数乘运算及运算律', viz:'la-mat-add'},
      {name:'矩阵乘法', desc:'乘法定义、结合律分配律、不满足交换律', viz:'la-mat-mul'},
      {name:'矩阵的转置', desc:'转置定义、(AB)^T=B^TA^T、对称与反对称矩阵', viz:'la-transpose'},
      {name:'方阵的行列式', desc:'|AB|=|A||B|、伴随矩阵与逆矩阵公式', viz:'la-det-prod'},
      {name:'逆矩阵', desc:'逆矩阵定义与性质、伴随矩阵法、二阶矩阵求逆', viz:'la-inverse'},
      {name:'矩阵分块法', desc:'分块矩阵运算、分块对角阵、按行/列分块', viz:'la-block'},
    ]},
  { courseId:'la', num:3, title:'矩阵的初等变换与线性方程组', vol:'核心', progress:0, level:'核心',
    kps:[
      {name:'矩阵的初等变换', desc:'三种初等行变换、行阶梯形与行最简形', viz:'la-row-op'},
      {name:'初等矩阵', desc:'初等矩阵定义、左乘行变换右乘列变换', viz:'la-elem-mat'},
      {name:'矩阵的秩', desc:'秩的定义、初等变换求秩、秩的性质不等式', viz:'la-rank'},
      {name:'线性方程组的解', desc:'有解判定定理、唯一解与无穷多解条件', viz:'la-solution'},
      {name:'消元法解方程组', desc:'高斯消元法、回代求解、自由变量', viz:'la-gauss'},
    ]},
  { courseId:'la', num:4, title:'向量组的线性相关性', vol:'核心', progress:0, level:'核心',
    kps:[
      {name:'向量组与线性组合', desc:'线性组合与线性表出、等价向量组', viz:'la-lincomb'},
      {name:'线性相关与线性无关', desc:'定义与判定、相关性的几何意义', viz:'la-depend'},
      {name:'向量组的秩', desc:'极大无关组、秩与矩阵秩的关系', viz:'la-vec-rank'},
      {name:'线性方程组解的结构', desc:'齐次方程组的基础解系、非齐次解的结构', viz:'la-sol-struct'},
      {name:'向量空间', desc:'向量空间定义、子空间、基与维数、坐标', viz:'la-vec-space'},
    ]},
  { courseId:'la', num:5, title:'相似矩阵及二次型', vol:'核心', progress:0, level:'重点',
    kps:[
      {name:'向量的内积与正交', desc:'内积定义与性质、施密特正交化、正交矩阵', viz:'la-inner'},
      {name:'特征值与特征向量', desc:'定义与求法、特征值的性质、特征多项式', viz:'la-eigen'},
      {name:'相似矩阵', desc:'相似定义与性质、矩阵可对角化条件', viz:'la-similar'},
      {name:'对称矩阵的对角化', desc:'实对称矩阵的性质、正交对角化步骤', viz:'la-diag'},
      {name:'二次型及其标准形', desc:'二次型的矩阵表示、正交变换法化标准形', viz:'la-quadform'},
      {name:'配方法化标准形', desc:'拉格朗日配方法、惯性定理与规范形', viz:'la-completesq'},
      {name:'正定二次型', desc:'正定性定义、顺序主子式判定、应用', viz:'la-posdef'},
    ]},
  { courseId:'la', num:6, title:'线性空间与线性变换', vol:'进阶', progress:0, level:'进阶',
    kps:[
      {name:'线性空间的定义', desc:'八条公理、常见线性空间举例', viz:'la-linspace'},
      {name:'维数、基与坐标', desc:'基的定义、维数、向量在基下的坐标', viz:'la-basis'},
      {name:'基变换与坐标变换', desc:'过渡矩阵、坐标变换公式', viz:'la-basechange'},
      {name:'线性变换', desc:'线性变换定义与性质、核与像空间', viz:'la-lintrans'},
      {name:'线性变换的矩阵表示', desc:'线性变换在基下的矩阵、相似关系', viz:'la-transmat'},
    ]}];



/* 章节封面颜色 */

const chapterColors = {

  1:'#6366f1', 2:'#0ea5e9', 3:'#10b981', 4:'#f59e0b',

  5:'#ec4899', 6:'#ef4444', 7:'#8b5cf6', 8:'#06b6d4',

  9:'#6366f1', 10:'#0ea5e9', 11:'#10b981', 12:'#f59e0b',

  // 概率论章节配色

  p1:'#ec4899', p2:'#8b5cf6', p3:'#6366f1', p4:'#0ea5e9',

  p5:'#f59e0b', p6:'#10b981', p7:'#ef4444', p8:'#06b6d4',

  p9:'#14b8a6',

  'la': '#f59e0b'};



/* ═══════ 可视化引擎 ═══════ */

const VizEngine = {

  canvas: null, ctx: null, W: 0, H: 0,

  dpr: window.devicePixelRatio || 1,



  init(canvasEl) {

    this.canvas = canvasEl;

    this.ctx = canvasEl.getContext('2d');

    this.resize();

  },



  resize() {

    const rect = this.canvas.parentElement.getBoundingClientRect();

    this.W = rect.width;

    this.H = Math.min(420, Math.max(300, this.W * 0.45));

    this.canvas.width = this.W * this.dpr;

    this.canvas.height = this.H * this.dpr;

    this.canvas.style.width = this.W + 'px';

    this.canvas.style.height = this.H + 'px';

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

  },



  clear() {

    this.ctx.fillStyle = '#0a0c12';

    this.ctx.fillRect(0, 0, this.W, this.H);

  },



  // 坐标转换

  toScreen(x, y, xMin, xMax, yMin, yMax) {

    const pad = 40;

    const sx = pad + (x - xMin) / (xMax - xMin) * (this.W - 2 * pad);

    const sy = (this.H - pad) - (y - yMin) / (yMax - yMin) * (this.H - 2 * pad);

    return [sx, sy];

  },



  drawGrid(xMin, xMax, yMin, yMax) {

    const ctx = this.ctx;

    ctx.strokeStyle = 'rgba(255,255,255,0.04)';

    ctx.lineWidth = 1;

    const pad = 40;

    // vertical

    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {

      const [sx] = this.toScreen(x, 0, xMin, xMax, yMin, yMax);

      ctx.beginPath(); ctx.moveTo(sx, pad); ctx.lineTo(sx, this.H - pad); ctx.stroke();

    }

    // horizontal

    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {

      const [, sy] = this.toScreen(0, y, xMin, xMax, yMin, yMax);

      ctx.beginPath(); ctx.moveTo(pad, sy); ctx.lineTo(this.W - pad, sy); ctx.stroke();

    }

  },



  drawAxes(xMin, xMax, yMin, yMax) {

    const ctx = this.ctx;

    const pad = 40;

    ctx.strokeStyle = 'rgba(255,255,255,0.2)';

    ctx.lineWidth = 1.5;

    // x-axis

    const [, y0] = this.toScreen(0, 0, xMin, xMax, yMin, yMax);

    const yc = Math.max(pad, Math.min(this.H - pad, y0));

    ctx.beginPath(); ctx.moveTo(pad, yc); ctx.lineTo(this.W - pad, yc); ctx.stroke();

    // y-axis

    const [x0] = this.toScreen(0, 0, xMin, xMax, yMin, yMax);

    const xc = Math.max(pad, Math.min(this.W - pad, x0));

    ctx.beginPath(); ctx.moveTo(xc, pad); ctx.lineTo(xc, this.H - pad); ctx.stroke();



    // labels

    ctx.fillStyle = 'rgba(255,255,255,0.3)';

    ctx.font = '11px Inter, sans-serif';

    ctx.textAlign = 'center';

    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {

      if (x === 0) continue;

      const [sx] = this.toScreen(x, 0, xMin, xMax, yMin, yMax);

      ctx.fillText(x, sx, yc + 16);

    }

    ctx.textAlign = 'right';

    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {

      if (y === 0) continue;

      const [, sy] = this.toScreen(0, y, xMin, xMax, yMin, yMax);

      ctx.fillText(y, xc - 8, sy + 4);

    }

    // origin

    ctx.textAlign = 'right';

    ctx.fillText('O', xc - 6, yc + 16);

  },



  drawFunction(fn, xMin, xMax, yMin, yMax, color, width) {

    const ctx = this.ctx;

    ctx.strokeStyle = color || '#818cf8';

    ctx.lineWidth = width || 2;

    ctx.beginPath();

    const steps = 400;

    let started = false;

    for (let i = 0; i <= steps; i++) {

      const x = xMin + (xMax - xMin) * i / steps;

      let y;

      try { y = fn(x); } catch { continue; }

      if (!isFinite(y) || Math.abs(y) > 1e6) { started = false; continue; }

      const [sx, sy] = this.toScreen(x, y, xMin, xMax, yMin, yMax);

      if (!started) { ctx.moveTo(sx, sy); started = true; } else { ctx.lineTo(sx, sy); }

    }

    ctx.stroke();

  },



  drawPoint(x, y, xMin, xMax, yMin, yMax, color, r) {

    const ctx = this.ctx;

    const [sx, sy] = this.toScreen(x, y, xMin, xMax, yMin, yMax);

    ctx.fillStyle = color || '#f59e0b';

    ctx.beginPath();

    ctx.arc(sx, sy, r || 5, 0, Math.PI * 2);

    ctx.fill();

    // glow

    ctx.fillStyle = (color || '#f59e0b') + '40';

    ctx.beginPath();

    ctx.arc(sx, sy, (r || 5) * 2, 0, Math.PI * 2);

    ctx.fill();

  },



  drawLine(x1, y1, x2, y2, xMin, xMax, yMin, yMax, color, width, dash) {

    const ctx = this.ctx;

    const [sx1, sy1] = this.toScreen(x1, y1, xMin, xMax, yMin, yMax);

    const [sx2, sy2] = this.toScreen(x2, y2, xMin, xMax, yMin, yMax);

    ctx.strokeStyle = color || '#10b981';

    ctx.lineWidth = width || 1.5;

    ctx.setLineDash(dash || []);

    ctx.beginPath(); ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2); ctx.stroke();

    ctx.setLineDash([]);

  },



  drawRect(x1, y1, x2, y2, xMin, xMax, yMin, yMax, color, alpha) {

    const ctx = this.ctx;

    const [sx1, sy1] = this.toScreen(x1, y1, xMin, xMax, yMin, yMax);

    const [sx2, sy2] = this.toScreen(x2, y2, xMin, xMax, yMin, yMax);

    ctx.fillStyle = color + (alpha !== undefined ? alpha : '30');

    ctx.fillRect(Math.min(sx1,sx2), Math.min(sy1,sy2), Math.abs(sx2-sx1), Math.abs(sy2-sy1));

    ctx.strokeStyle = color + '80';

    ctx.lineWidth = 1;

    ctx.strokeRect(Math.min(sx1,sx2), Math.min(sy1,sy2), Math.abs(sx2-sx1), Math.abs(sy2-sy1));

  },



  drawText(text, x, y, xMin, xMax, yMin, yMax, color, size, align) {

    const ctx = this.ctx;

    const [sx, sy] = this.toScreen(x, y, xMin, xMax, yMin, yMax);

    ctx.fillStyle = color || '#f0f2f8';

    ctx.font = (size || 12) + 'px Inter, sans-serif';

    ctx.textAlign = align || 'left';

    ctx.fillText(text, sx, sy);

  },



  drawArrow(x1, y1, x2, y2, xMin, xMax, yMin, yMax, color, size) {

    const ctx = this.ctx;

    const [sx1, sy1] = this.toScreen(x1, y1, xMin, xMax, yMin, yMax);

    const [sx2, sy2] = this.toScreen(x2, y2, xMin, xMax, yMin, yMax);

    const angle = Math.atan2(sy2 - sy1, sx2 - sx1);

    const s = size || 8;

    ctx.strokeStyle = color || '#818cf8';

    ctx.fillStyle = color || '#818cf8';

    ctx.lineWidth = 1.5;

    ctx.beginPath(); ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2); ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(sx2, sy2);

    ctx.lineTo(sx2 - s * Math.cos(angle - 0.4), sy2 - s * Math.sin(angle - 0.4));

    ctx.lineTo(sx2 - s * Math.cos(angle + 0.4), sy2 - s * Math.sin(angle + 0.4));

    ctx.fill();

  },

};



/* 标准正态 CDF 与逆 CDF（probit），供概率论可视化模板复用 */
function normCdf(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989422804014327 * Math.exp(-0.5 * x * x);
  let p = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return x > 0 ? 1 - p : p;
}
function normInv(p) {
  let lo = -6, hi = 6;
  for (let i = 0; i < 60; i++) {
    const m = (lo + hi) / 2;
    if (normCdf(m) < p) lo = m; else hi = m;
  }
  return (lo + hi) / 2;
}

/* ═══════ 可视化类型定义 ═══════ */

const vizTypes = {

  'function-plotter': {

    title: '函数图像绘制器',

    formula: 'f(x) = a · sin(ωx + φ)',

    params: [

      { id:'a', label:'振幅 a', min:0.1, max:4, step:0.1, default:1 },

      { id:'w', label:'频率 ω', min:0.1, max:5, step:0.1, default:1 },

      { id:'phi', label:'相位 φ', min:-3.14, max:3.14, step:0.01, default:0 },

    ],

    range: { xMin:-8, xMax:8, yMin:-6, yMax:6 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-8,8,-6,6); V.drawAxes(-8,8,-6,6);

      V.drawFunction(x => p.a * Math.sin(p.w * x + p.phi), -8, 8, -6, 6, '#818cf8', 2.5);

      V.drawText('f(x) = ' + p.a.toFixed(1) + '·sin(' + p.w.toFixed(1) + 'x + ' + p.phi.toFixed(2) + ')', -7.5, 5.5, -8,8,-6,6, '#a5b4fc', 13);

    }

  },



  'sequence-limit': {

    title: '数列极限可视化',

    formula: 'aₙ = 1 + 1/n，lim(n→∞) = 1',

    params: [

      { id:'n', label:'项数 n', min:1, max:50, step:1, default:10 },

      { id:'speed', label:'动画速度', min:1, max:10, step:1, default:5 },

    ],

    range: { xMin:-1, xMax:52, yMin:0, yMax:2.5 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-1,52,0,2.5); V.drawAxes(-1,52,0,2.5);

      // draw limit line

      V.drawLine(-1,1,52,1,-1,52,0,2.5,'#ef4444',1.5,[6,4]);

      V.drawText('L = 1',53,1,-1,52,0,2.5,'#ef4444',12,'left');

      const n = Math.floor(p.n);

      for (let i = 1; i <= n; i++) {

        const val = 1 + 1/i;

        const alpha = Math.min(1, 0.3 + 0.7 * (i/n));

        V.drawPoint(i, val, -1,52,0,2.5, `rgba(129,140,248,${alpha})`, 4);

        if (i > 1) {

          const prev = 1 + 1/(i-1);

          V.drawLine(i-1,prev,i,val,-1,52,0,2.5,`rgba(129,140,248,${alpha * 0.5})`,1);

        }

      }

      V.drawText('n = ' + n, 40, 2.3, -1,52,0,2.5, '#8b9ab5', 12);

    }

  },



  'epsilon-delta': {

    title: 'ε-δ 极限定义可视化',

    formula: 'lim(x→x₀) f(x) = L，给定 ε → 找 δ',

    params: [

      { id:'eps', label:'ε (精度)', min:0.1, max:2, step:0.05, default:0.5 },

      { id:'x0', label:'x₀ (趋近点)', min:-3, max:3, step:0.1, default:1 },

    ],

    range: { xMin:-5, xMax:5, yMin:-2, yMax:5 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-5,5,-2,5); V.drawAxes(-5,5,-2,5);

      const fn = x => x * x;

      const L = p.x0 * p.x0;

      const eps = p.eps;

      // draw epsilon band

      V.drawFilledRegion(-5,5,L-eps,L+eps,-5,5,-2,5,'rgba(239,68,68,0.08)');

      V.drawLine(-5,L-eps,5,L-eps,-5,5,-2,5,'rgba(239,68,68,0.5)',1,[4,4]);

      V.drawLine(-5,L+eps,5,L+eps,-5,5,-2,5,'rgba(239,68,68,0.5)',1,[4,4]);

      V.drawText('L-ε',-4.5,L-eps,-5,5,-2,5,'#ef4444',11);

      V.drawText('L+ε',-4.5,L+eps,-5,5,-2,5,'#ef4444',11);

      // draw function

      V.drawFunction(fn,-5,5,-2,5,'#818cf8',2.5);

      // draw x0 and L

      V.drawPoint(p.x0, L, -5,5,-2,5,'#f59e0b',6);

      V.drawText('('+p.x0.toFixed(1)+','+L.toFixed(1)+')', p.x0+0.3, L+0.3, -5,5,-2,5, '#f59e0b', 12);

      V.drawText('ε = '+eps.toFixed(2), 2, 4.3, -5,5,-2,5, '#ef4444', 12);

      V.drawText('L = '+L.toFixed(2), 2, 3.8, -5,5,-2,5, '#f0f2f8', 12);

    }

  },



  'secant-tangent': {

    title: '割线逼近切线',

    formula: "f'(x₀) = lim(Δx→0) [f(x₀+Δx) - f(x₀)] / Δx",

    params: [

      { id:'x0', label:'切点 x₀', min:-3, max:3, step:0.1, default:1 },

      { id:'dx', label:'Δx (步长)', min:0.05, max:3, step:0.05, default:2 },

    ],

    range: { xMin:-5, xMax:5, yMin:-3, yMax:7 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-5,5,-3,7); V.drawAxes(-5,5,-3,7);

      const fn = x => 0.3 * x * x * x - x + 1;

      const dfn = x => 0.9 * x * x - 1;

      // draw function

      V.drawFunction(fn,-5,5,-3,7,'#818cf8',2.5);

      // tangent line

      const slope = dfn(p.x0);

      const y0 = fn(p.x0);

      const tLen = 4;

      V.drawLine(p.x0 - tLen, y0 - slope*tLen, p.x0 + tLen, y0 + slope*tLen, -5,5,-3,7,'#10b981',2);

      // secant line

      const y1 = fn(p.x0 + p.dx);

      const secSlope = (y1 - y0) / p.dx;

      V.drawLine(p.x0 - tLen, y0 - secSlope*tLen, p.x0 + p.dx + tLen, y1 + secSlope*tLen, -5,5,-3,7,'#f59e0b',1.5,[5,3]);

      // points

      V.drawPoint(p.x0, y0, -5,5,-3,7,'#10b981',6);

      V.drawPoint(p.x0 + p.dx, y1, -5,5,-3,7,'#f59e0b',5);

      // labels

      V.drawText('切线', p.x0+1.5, y0+slope*1.5+0.3, -5,5,-3,7, '#10b981', 12);

      V.drawText('割线', p.x0+p.dx+1, y1+secSlope+0.3, -5,5,-3,7, '#f59e0b', 12);

      V.drawText("斜率差: "+Math.abs(secSlope-slope).toFixed(3), -4.5, 6.3, -5,5,-3,7, '#8b9ab5', 11);

    }

  },



  'taylor-series': {

    title: '泰勒展开可视化',

    formula: 'f(x) ≈ Σ f⁽ⁿ⁾(a)/n! · (x-a)ⁿ',

    params: [

      { id:'order', label:'展开阶数 n', min:1, max:12, step:1, default:3 },

      { id:'a', label:'展开点 a', min:-2, max:2, step:0.1, default:0 },

    ],

    range: { xMin:-7, xMax:7, yMin:-4, yMax:4 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-7,7,-4,4); V.drawAxes(-7,7,-4,4);

      const fn = Math.sin;

      // colors for each order

      const colors = ['#ef4444','#f59e0b','#10b981','#06b6d4','#8b5cf6','#ec4899',

                       '#f97316','#14b8a6','#6366f1','#e11d48','#84cc16','#0ea5e9'];

      // draw original

      V.drawFunction(fn,-7,7,-4,4,'rgba(255,255,255,0.2)',2);

      // draw Taylor approximation

      const n = Math.floor(p.order);

      const a = p.a;

      // compute Taylor polynomial

      function taylor(x) {

        let sum = 0, term = 1, dk = Math.sin(a);

        for (let k = 0; k <= n; k++) {

          sum += term * dk;

          // advance derivative

          const nextDk = k % 4 === 0 ? Math.cos(a) : k % 4 === 1 ? -Math.sin(a) : k % 4 === 2 ? -Math.cos(a) : Math.sin(a);

          dk = k === 0 ? Math.cos(a) : (k % 4 === 0 ? Math.cos(a) : k % 4 === 1 ? -Math.sin(a) : k % 4 === 2 ? -Math.cos(a) : Math.sin(a));

          // simple approach: just use finite differences for derivative

          term *= (x - a) / (k + 1);

        }

        return sum;

      }

      // better taylor computation

      function taylorSin(x) {

        let sum = 0, term = 1;

        for (let k = 0; k <= n; k++) {

          sum += term;

          term *= (x - a) / (k + 1);

          // rotate derivative: sin→cos→-sin→-cos→sin

          // but we need to multiply by the correct derivative at a

        }

        // use built-in taylor for sin around a

        let result = 0, coeff = 1, factorial = 1;

        for (let k = 0; k <= n; k++) {

          if (k > 0) factorial *= k;

          const sign = Math.floor(k / 2) % 2 === 0 ? 1 : -1;

          const trig = k % 2 === 0 ? Math.sin(a) : Math.cos(a);

          coeff = trig;

          if (Math.floor(k / 2) % 2 === 1) coeff = -coeff;

          result += coeff / factorial * Math.pow(x - a, k);

        }

        return result;

      }

      V.drawFunction(taylorSin,-7,7,-4,4,colors[n % colors.length],2.5);

      V.drawText('sin(x) 原函数', -6.5, 3.5, -7,7,-4,4, 'rgba(255,255,255,0.3)', 11);

      V.drawText('泰勒 ' + n + ' 阶', -6.5, 3, -7,7,-4,4, colors[n % colors.length], 11);

      V.drawText('展开点 a = ' + a.toFixed(1), 3, 3.5, -7,7,-4,4, '#f0f2f8', 11);

    }

  },



  'riemann-sum': {

    title: '黎曼和 / 定积分可视化',

    formula: '∫ₐᵇ f(x)dx ≈ Σ f(xᵢ*)·Δx',

    params: [

      { id:'n', label:'分割数 n', min:2, max:60, step:1, default:10 },

      { id:'type', label:'类型', min:0, max:2, step:1, default:0 },

    ],

    range: { xMin:-1, xMax:8, yMin:-1, yMax:5 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-1,8,-1,5); V.drawAxes(-1,8,-1,5);

      const fn = x => 0.5 * x * Math.sin(x) + 1;

      const a = 0.5, b = 6;

      const n = Math.floor(p.n);

      const dx = (b - a) / n;

      const type = Math.floor(p.type); // 0=left, 1=right, 2=midpoint

      // draw rectangles

      let sum = 0;

      for (let i = 0; i < n; i++) {

        const xi = a + i * dx;

        let xSample;

        if (type === 0) xSample = xi;

        else if (type === 1) xSample = xi + dx;

        else xSample = xi + dx/2;

        const yi = fn(xSample);

        sum += yi * dx;

        V.drawRect(xi, 0, xi + dx, yi, -1,8,-1,5,'#6366f1', 25);

      }

      // draw function curve on top

      V.drawFunction(fn,-1,8,-1,5,'#10b981',2.5);

      // draw bounds

      V.drawLine(a,-1,a,5,-1,8,-1,5,'#f59e0b',1.5,[4,3]);

      V.drawLine(b,-1,b,5,-1,8,-1,5,'#f59e0b',1.5,[4,3]);

      const typeNames = ['左端点','右端点','中点'];

      V.drawText(typeNames[type]+'黎曼和 ≈ '+sum.toFixed(3), 0.5, 4.3, -1,8,-1,5, '#f0f2f8', 13);

      V.drawText('n = '+n, 5.5, 4.3, -1,8,-1,5, '#8b9ab5', 12);

    }

  },



  'mean-value': {

    title: '微分中值定理几何意义',

    formula: 'f(b)-f(a) = f\'(ξ)(b-a)，∃ ξ ∈ (a,b)',

    params: [

      { id:'a', label:'a', min:-4, max:0, step:0.1, default:-3 },

      { id:'b', label:'b', min:0.1, max:4, step:0.1, default:3 },

    ],

    range: { xMin:-5, xMax:5, yMin:-3, yMax:5 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-5,5,-3,5); V.drawAxes(-5,5,-3,5);

      const fn = x => 0.15 * x * x * x - 0.5 * x + 1;

      const a = p.a, b = p.b;

      const fa = fn(a), fb = fn(b);

      const secSlope = (fb - fa) / (b - a);

      // draw function

      V.drawFunction(fn,-5,5,-3,5,'#818cf8',2.5);

      // draw secant line

      V.drawLine(a, fa, b, fb, -5,5,-3,5,'#f59e0b',1.5,[5,3]);

      // draw points

      V.drawPoint(a, fa, -5,5,-3,5,'#10b981',5);

      V.drawPoint(b, fb, -5,5,-3,5,'#10b981',5);

      // find tangent point (approximate)

      const dfn = x => 0.45 * x * x - 0.5;

      // iterate to find xi where f'(xi) = secSlope

      let xi = (a + b) / 2;

      for (let iter = 0; iter < 50; iter++) {

        const err = dfn(xi) - secSlope;

        const ddfn = x => 0.9 * x;

        if (Math.abs(ddfn(xi)) < 0.01) break;

        xi -= err / ddfn(xi);

        if (xi < a || xi > b) { xi = (a+b)/2; break; }

      }

      if (xi >= a && xi <= b) {

        const yi = fn(xi);

        const tLen = 3;

        V.drawLine(xi - tLen, yi - secSlope*tLen, xi + tLen, yi + secSlope*tLen, -5,5,-3,5,'#ef4444',2);

        V.drawPoint(xi, yi, -5,5,-3,5,'#ef4444',6);

        V.drawText('ξ ≈ '+xi.toFixed(2), xi+0.2, yi+0.4, -5,5,-3,5, '#ef4444', 12);

      }

      V.drawText('割线斜率: '+secSlope.toFixed(3), -4.5, 4.3, -5,5,-3,5, '#f59e0b', 11);

      V.drawText('f\'(ξ) = 割线斜率', -4.5, 3.7, -5,5,-3,5, '#ef4444', 11);

    }

  },



  'monotonicity': {

    title: '单调性与极值分析',

    formula: "f'(x) > 0 → 递增；f'(x) < 0 → 递减",

    params: [

      { id:'a', label:'参数 a', min:0.5, max:3, step:0.1, default:1.5 },

      { id:'b', label:'参数 b', min:0, max:3, step:0.1, default:1 },

    ],

    range: { xMin:-5, xMax:5, yMin:-4, yMax:6 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-5,5,-4,6); V.drawAxes(-5,5,-4,6);

      const fn = x => p.a * x * x * x / 3 - p.b * x;

      const dfn = x => p.a * x * x - p.b;

      // shade increasing/decreasing regions

      // critical points

      const roots = p.b > 0 ? [-Math.sqrt(p.b/p.a), Math.sqrt(p.b/p.a)] : [0];

      // draw increasing regions (green tint)

      V.drawFilledRegion(-5,0,-4,6,-5,5,-4,6,'rgba(16,185,129,0.06)');

      // draw function

      V.drawFunction(fn,-5,5,-4,6,'#818cf8',2.5);

      // draw derivative

      V.drawFunction(dfn,-5,5,-4,6,'#f59e0b',1.5);

      // draw zero line for derivative

      V.drawLine(-5,0,5,0,-5,5,-4,6,'rgba(255,255,255,0.15)',1,[4,4]);

      // critical points

      roots.forEach(r => {

        if (r >= -5 && r <= 5) {

          V.drawPoint(r, fn(r), -5,5,-4,6,'#ef4444',5);

          V.drawText('x='+r.toFixed(1), r+0.2, fn(r)+0.4, -5,5,-4,6, '#ef4444', 11);

        }

      });

      V.drawText('f(x)', 4, dfn(4)+0.3, -5,5,-4,6, '#818cf8', 11);

      V.drawText("f'(x)", 4, fn(4)+0.3, -5,5,-4,6, '#f59e0b', 11);

    }

  },



  'lhopital': {

    title: '洛必达法则求解过程',

    formula: 'lim(x→a) f(x)/g(x) = lim(x→a) f\'(x)/g\'(x)',

    params: [

      { id:'x', label:'x 值', min:0.01, max:3, step:0.01, default:2 },

    ],

    range: { xMin:-0.5, xMax:3.5, yMin:-0.5, yMax:4 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-0.5,3.5,-0.5,4); V.drawAxes(-0.5,3.5,-0.5,4);

      const fn = x => Math.exp(x) - 1;

      const gn = x => x;

      const dfn = x => Math.exp(x);

      const dgn = x => 1;

      const x = p.x;

      // draw f(x)/g(x) - original ratio

      V.drawFunction(x => x > 0.01 ? fn(x)/gn(x) : 5, 0.01, 3.5, -0.5, 4, '#818cf8', 2.5);

      // draw f'(x)/g'(x) - after L'Hopital

      V.drawFunction(x => dfn(x)/dgn(x), 0.01, 3.5, -0.5, 4, '#10b981', 2, [5,3]);

      // current point

      const origVal = fn(x)/gn(x);

      const lhopVal = dfn(x)/dgn(x);

      V.drawPoint(x, origVal, -0.5,3.5,-0.5,4,'#818cf8',5);

      V.drawPoint(x, lhopVal, -0.5,3.5,-0.5,4,'#10b981',5);

      V.drawText('f(x)/g(x) = '+origVal.toFixed(4), 1.5, 3.5, -0.5,3.5,-0.5,4, '#818cf8', 11);

      V.drawText("f'(x)/g'(x) = "+lhopVal.toFixed(4), 1.5, 3, -0.5,3.5,-0.5,4, '#10b981', 11);

      V.drawText('(eˣ-1)/x → 洛必达 → eˣ', 0.3, -0.2, -0.5,3.5,-0.5,4, '#8b9ab5', 11);

    }

  },



  'infinitesimal': {

    title: '无穷小的阶的比较',

    formula: '当 x→0 时，比较 x, sin(x), x², 1-cos(x) 的趋近速度',

    params: [

      { id:'scale', label:'放大倍数', min:1, max:20, step:1, default:5 },

    ],

    range: { xMin:-0.5, xMax:2, yMin:-0.5, yMax:2 },

    render(p) {

      const V = VizEngine;

      const s = p.scale;

      V.clear(); V.drawGrid(-0.5,2,-0.5,2); V.drawAxes(-0.5,2,-0.5,2);

      // scale for visibility

      V.drawFunction(x => x*s, 0,2,-0.5,2, '#818cf8', 2.5);

      V.drawFunction(x => Math.sin(x)*s, 0,2,-0.5,2, '#10b981', 2.5);

      V.drawFunction(x => x*x*s, 0,2,-0.5,2, '#f59e0b', 2.5);

      V.drawFunction(x => (1-Math.cos(x))*s, 0,2,-0.5,2, '#ec4899', 2.5);

      // legend

      V.drawText('x (×'+s+')', 1.2, 1.8, -0.5,2,-0.5,2, '#818cf8', 11);

      V.drawText('sin(x) (×'+s+')', 1.2, 1.55, -0.5,2,-0.5,2, '#10b981', 11);

      V.drawText('x² (×'+s+')', 1.2, 1.3, -0.5,2,-0.5,2, '#f59e0b', 11);

      V.drawText('(1-cos(x)) (×'+s+')', 1.2, 1.05, -0.5,2,-0.5,2, '#ec4899', 11);

    }

  },



  'important-limits': {

    title: '两个重要极限',

    formula: 'lim(x→0) sin(x)/x = 1，lim(n→∞) (1+1/n)ⁿ = e',

    params: [

      { id:'tab', label:'选择极限', min:0, max:1, step:1, default:0 },

      { id:'x', label:'x 值', min:0.01, max:2, step:0.01, default:1 },

    ],

    range: { xMin:-0.5, xMax:4, yMin:-0.5, yMax:3 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-0.5,4,-0.5,3); V.drawAxes(-0.5,4,-0.5,3);

      const tab = Math.floor(p.tab);

      const x = p.x;

      if (tab === 0) {

        // sin(x)/x

        V.drawFunction(x2 => x2 > 0.01 ? Math.sin(x2)/x2 : 1, 0.01, 4, -0.5, 3, '#818cf8', 2.5);

        V.drawLine(-0.5,1,4,1,-0.5,4,-0.5,3,'#ef4444',1.5,[5,3]);

        const val = Math.sin(x)/x;

        V.drawPoint(x, val, -0.5,4,-0.5,3,'#f59e0b',6);

        V.drawText('sin('+x.toFixed(2)+')/'+x.toFixed(2)+' = '+val.toFixed(6), 0.3, 2.5, -0.5,4,-0.5,3, '#f0f2f8', 12);

        V.drawText('极限值 = 1', 0.3, 2.1, -0.5,4,-0.5,3, '#ef4444', 12);

      } else {

        // (1+1/x)^x

        V.drawFunction(x2 => x2 > 0.01 ? Math.pow(1+1/x2,x2) : 0, 0.01, 4, 0.5, 3, '#818cf8', 2.5);

        V.drawLine(-0.5,Math.E,4,Math.E,-0.5,4,0.5,3,'#ef4444',1.5,[5,3]);

        const val = Math.pow(1+1/x,x);

        V.drawPoint(x, val, -0.5,4,0.5,3,'#f59e0b',6);

        V.drawText('(1+1/'+x.toFixed(1)+')^'+x.toFixed(1)+' = '+val.toFixed(6), 0.3, 2.5, -0.5,4,0.5,3, '#f0f2f8', 12);

        V.drawText('极限值 = e ≈ 2.71828', 0.3, 2.1, -0.5,4,0.5,3, '#ef4444', 12);

      }

    }

  },



  'continuity': {

    title: '函数连续性可视化',

    formula: 'lim(x→x₀) f(x) = f(x₀) → 连续',

    params: [

      { id:'x0', label:'检测点 x₀', min:-3, max:3, step:0.1, default:1 },

      { id:'fnType', label:'函数类型', min:0, max:2, step:1, default:0 },

    ],

    range: { xMin:-4, xMax:4, yMin:-3, yMax:4 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-4,4,-3,4); V.drawAxes(-4,4,-3,4);

      const t = Math.floor(p.fnType);

      let fn, name;

      if (t === 0) { fn = x => Math.sin(x); name = 'sin(x) - 处处连续'; }

      else if (t === 1) { fn = x => x >= 0 ? x : x + 1; name = '跳跃间断点 x=0'; }

      else { fn = x => Math.abs(x) / x || 0; name = '可去间断点 x=0'; }

      V.drawFunction(fn, -4, 4, -3, 4, '#818cf8', 2.5);

      const val = fn(p.x0);

      V.drawPoint(p.x0, val, -4,4,-3,4, '#f59e0b', 6);

      V.drawText(name, -3.8, 3.5, -4,4,-3,4, '#f0f2f8', 12);

      V.drawText('f('+p.x0.toFixed(1)+') = '+val.toFixed(2), -3.8, 2.8, -4,4,-3,4, '#f59e0b', 11);

    }

  },



  'derivative-plot': {

    title: '导数可视化',

    formula: "f(x) 与 f'(x) 对比",

    params: [

      { id:'a', label:'系数 a', min:0.1, max:3, step:0.1, default:1 },

      { id:'b', label:'系数 b', min:0, max:3, step:0.1, default:0.5 },

    ],

    range: { xMin:-5, xMax:5, yMin:-5, yMax:6 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-5,5,-5,6); V.drawAxes(-5,5,-5,6);

      const fn = x => p.a * Math.sin(x) + p.b * x;

      const dfn = x => p.a * Math.cos(x) + p.b;

      V.drawFunction(fn,-5,5,-5,6,'#818cf8',2.5);

      V.drawFunction(dfn,-5,5,-5,6,'#f59e0b',2,[5,3]);

      V.drawText('f(x) = '+p.a.toFixed(1)+'sin(x) + '+p.b.toFixed(1)+'x', -4.5, 5.3, -5,5,-5,6, '#818cf8', 11);

      V.drawText("f'(x) = "+p.a.toFixed(1)+'cos(x) + '+p.b.toFixed(1), -4.5, 4.7, -5,5,-5,6, '#f59e0b', 11);

    }

  },



  'higher-derivative': {

    title: '高阶导数可视化',

    formula: "f(x), f'(x), f''(x), f'''(x) 逐阶对比",

    params: [

      { id:'x', label:'观察点 x', min:-3, max:3, step:0.1, default:1 },

    ],

    range: { xMin:-5, xMax:5, yMin:-4, yMax:4 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-5,5,-4,4); V.drawAxes(-5,5,-4,4);

      const fn = x => Math.sin(x);

      const d1 = x => Math.cos(x);

      const d2 = x => -Math.sin(x);

      const d3 = x => -Math.cos(x);

      V.drawFunction(fn,-5,5,-4,4,'#818cf8',2.5);

      V.drawFunction(d1,-5,5,-4,4,'#10b981',2,[5,3]);

      V.drawFunction(d2,-5,5,-4,4,'#f59e0b',1.5,[3,3]);

      V.drawFunction(d3,-5,5,-4,4,'#ec4899',1.5,[2,2]);

      const x = p.x;

      V.drawPoint(x, fn(x),-5,5,-4,4,'#818cf8',5);

      V.drawPoint(x, d1(x),-5,5,-4,4,'#10b981',5);

      V.drawPoint(x, d2(x),-5,5,-4,4,'#f59e0b',5);

      V.drawPoint(x, d3(x),-5,5,-4,4,'#ec4899',5);

      V.drawText('f('+x.toFixed(1)+')='+fn(x).toFixed(2), 2, 3.5, -5,5,-4,4, '#818cf8', 11);

      V.drawText("f'="+d1(x).toFixed(2)+" f''="+d2(x).toFixed(2), 2, 3, -5,5,-4,4, '#8b9ab5', 10);

    }

  },



  'curvature': {

    title: '曲率与曲率圆',

    formula: 'κ = |y\'\'| / (1+y\'²)^(3/2)',

    params: [

      { id:'x0', label:'曲率圆中心 x₀', min:-2, max:2, step:0.1, default:0.5 },

    ],

    range: { xMin:-4, xMax:4, yMin:-2, yMax:5 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-4,4,-2,5); V.drawAxes(-4,4,-2,5);

      const fn = x => 0.3*x*x + 0.5;

      const dfn = x => 0.6*x;

      const ddfn = x => 0.6;

      V.drawFunction(fn,-4,4,-2,5,'#818cf8',2.5);

      const x0 = p.x0;

      const y0 = fn(x0);

      const dy = dfn(x0);

      const ddy = ddfn(x0);

      const kappa = Math.abs(ddy) / Math.pow(1 + dy*dy, 1.5);

      const R = 1/kappa;

      // center of osculating circle

      const cx = x0 - dy * (1 + dy*dy) / ddy;

      const cy = y0 + (1 + dy*dy) / ddy;

      // draw osculating circle

      const ctx = V.ctx;

      const [scx, scy] = V.toScreen(cx, cy, -4,4,-2,5);

      const [px, py] = V.toScreen(x0, fn(x0), -4,4,-2,5);

      const scale = (V.W - 80) / 8; // pixels per unit

      ctx.strokeStyle = '#10b98180';

      ctx.lineWidth = 1.5;

      ctx.setLineDash([4,3]);

      ctx.beginPath();

      ctx.arc(scx, scy, R * scale, 0, Math.PI * 2);

      ctx.stroke();

      ctx.setLineDash([]);

      // draw normal line

      V.drawLine(x0,y0,cx,cy,-4,4,-2,5,'#10b981',1,[3,3]);

      V.drawPoint(x0,y0,-4,4,-2,5,'#f59e0b',6);

      V.drawPoint(cx,cy,-4,4,-2,5,'#10b981',4);

      V.drawText('κ = '+kappa.toFixed(3), 1, 4.3, -4,4,-2,5, '#f0f2f8', 12);

      V.drawText('R = '+R.toFixed(2), 1, 3.7, -4,4,-2,5, '#10b981', 12);

    }

  },



  'direction-field': {

    title: '微分方程方向场',

    formula: "y' = f(x,y)，拖动查看方向场",

    params: [

      { id:'type', label:'方程类型', min:0, max:2, step:1, default:0 },

    ],

    range: { xMin:-4, xMax:4, yMin:-4, yMax:4 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-4,4,-4,4); V.drawAxes(-4,4,-4,4);

      const t = Math.floor(p.type);

      let slopeFn, name;

      if (t === 0) { slopeFn = (x,y) => x - y; name = "y' = x - y"; }

      else if (t === 1) { slopeFn = (x,y) => -x/y; name = "y' = -x/y"; }

      else { slopeFn = (x,y) => y * Math.sin(x); name = "y' = y·sin(x)"; }

      // draw direction field

      const ctx = V.ctx;

      const step = 0.4;

      for (let xi = -3.5; xi <= 3.5; xi += step) {

        for (let yi = -3.5; yi <= 3.5; yi += step) {

          let m = slopeFn(xi, yi);

          if (!isFinite(m)) continue;

          m = Math.max(-3, Math.min(3, m));

          const angle = Math.atan(m);

          const len = 0.15;

          const [sx, sy] = V.toScreen(xi, yi, -4,4,-4,4);

          const scale = (V.W - 80) / 8;

          ctx.strokeStyle = 'rgba(99,102,241,0.4)';

          ctx.lineWidth = 1;

          ctx.beginPath();

          ctx.moveTo(sx - Math.cos(angle)*len*scale, sy + Math.sin(angle)*len*scale);

          ctx.lineTo(sx + Math.cos(angle)*len*scale, sy - Math.sin(angle)*len*scale);

          ctx.stroke();

          // arrowhead

          ctx.fillStyle = 'rgba(99,102,241,0.4)';

          const ax = sx + Math.cos(angle)*len*scale;

          const ay = sy - Math.sin(angle)*len*scale;

          ctx.beginPath();

          ctx.moveTo(ax, ay);

          ctx.lineTo(ax - 3*Math.cos(angle-0.5), ay + 3*Math.sin(angle-0.5));

          ctx.lineTo(ax - 3*Math.cos(angle+0.5), ay + 3*Math.sin(angle+0.5));

          ctx.fill();

        }

      }

      V.drawText(name, -3.8, 3.5, -4,4,-4,4, '#f0f2f8', 13);

    }

  },



  'series-convergence': {

    title: '级数收敛可视化',

    formula: '观察部分和 Sₙ 的收敛过程',

    params: [

      { id:'n', label:'前 n 项', min:1, max:40, step:1, default:10 },

      { id:'type', label:'级数类型', min:0, max:2, step:1, default:0 },

    ],

    range: { xMin:-1, xMax:42, yMin:-1, yMax:3 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-1,42,-1,3); V.drawAxes(-1,42,-1,3);

      const t = Math.floor(p.type);

      const n = Math.floor(p.n);

      let terms = [], limitVal, name;

      if (t === 0) {

        // geometric series: 1 + 1/2 + 1/4 + ...

        for (let i = 0; i < 40; i++) terms.push(Math.pow(0.5, i));

        limitVal = 2;

        name = 'Σ (1/2)ⁿ';

      } else if (t === 1) {

        // harmonic: 1 + 1/2 + 1/3 + ... (diverges)

        for (let i = 0; i < 40; i++) terms.push(1/(i+1));

        limitVal = null;

        name = 'Σ 1/n (发散)';

      } else {

        // alternating: 1 - 1/2 + 1/3 - ...

        for (let i = 0; i < 40; i++) terms.push(Math.pow(-1,i)/(i+1));

        limitVal = Math.log(2);

        name = 'Σ (-1)ⁿ/n = ln2';

      }

      let sum = 0;

      for (let i = 0; i < n && i < 40; i++) {

        sum += terms[i];

        V.drawPoint(i+1, sum, -1,42,-1,3, '#818cf8', 4);

        if (i > 0) {

          let prev = 0;

          for (let j = 0; j < i; j++) prev += terms[j];

          V.drawLine(i, prev, i+1, sum, -1,42,-1,3, 'rgba(129,140,248,0.4)', 1);

        }

      }

      if (limitVal !== null) {

        V.drawLine(-1, limitVal, 42, limitVal, -1,42,-1,3, '#ef4444', 1.5, [5,3]);

        V.drawText('极限 = '+limitVal.toFixed(4), 25, limitVal + 0.2, -1,42,-1,3, '#ef4444', 11);

      }

      V.drawText(name+'  S'+n+' = '+sum.toFixed(4), 1, 2.5, -1,42,-1,3, '#f0f2f8', 12);

    }

  },



  'improper-integral': {

    title: '反常积分可视化',

    formula: '∫₀^∞ 1/(1+x²) dx = π/2',

    params: [

      { id:'b', label:'积分上限 b', min:1, max:20, step:0.5, default:5 },

    ],

    range: { xMin:-0.5, xMax:22, yMin:-0.5, yMax:4 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-0.5,22,-0.5,4); V.drawAxes(-0.5,22,-0.5,4);

      const fn = x => 1/(1+x*x);

      const b = p.b;

      // shade area

      const steps = 200;

      for (let i = 0; i < steps; i++) {

        const x1 = b * i / steps;

        const x2 = b * (i+1) / steps;

        const y = fn((x1+x2)/2);

        V.drawRect(x1, 0, x2, y, -0.5,22,-0.5,4,'#6366f1', 20);

      }

      V.drawFunction(fn,0,22,-0.5,4,'#10b981',2.5);

      // compute integral

      const integral = Math.atan(b);

      V.drawText('∫₀^'+b.toFixed(1)+' 1/(1+x²)dx = '+integral.toFixed(4), 0.5, 3.5, -0.5,22,-0.5,4, '#f0f2f8', 12);

      V.drawText('π/2 ≈ '+(Math.PI/2).toFixed(4), 0.5, 2.9, -0.5,22,-0.5,4, '#ef4444', 12);

    }

  },



  'fourier-series': {

    title: '傅里叶级数可视化',

    formula: 'f(x) ≈ a₀/2 + Σ [aₙcos(nx) + bₙsin(nx)]',

    params: [

      { id:'n', label:'谐波数 n', min:1, max:15, step:1, default:3 },

    ],

    range: { xMin:-8, xMax:8, yMin:-2.5, yMax:2.5 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-8,8,-2.5,2.5); V.drawAxes(-8,8,-2.5,2.5);

      // square wave approximation

      const N = Math.floor(p.n);

      const origFn = x => x >= 0 ? 1 : -1;

      const fourierFn = x => {

        let sum = 0;

        for (let k = 0; k < N; k++) {

          const n2 = 2*k + 1;

          sum += Math.sin(n2 * x) / n2;

        }

        return sum * 4 / Math.PI;

      };

      V.drawFunction(origFn,-8,8,-2.5,2.5,'rgba(255,255,255,0.2)',2);

      V.drawFunction(fourierFn,-8,8,-2.5,2.5,'#818cf8',2.5);

      V.drawText('方波（原函数）', -7.5, 2.2, -8,8,-2.5,2.5, 'rgba(255,255,255,0.3)', 11);

      V.drawText('傅里叶 '+N+' 阶谐波', -7.5, 1.7, -8,8,-2.5,2.5, '#818cf8', 11);

    }

  },



  // 通用占位（用于暂未详细实现的知识点）

  'generic': {

    title: '交互式可视化',

    formula: '拖动参数，观察数学概念变化',

    params: [

      { id:'a', label:'参数 a', min:-5, max:5, step:0.1, default:1 },

      { id:'b', label:'参数 b', min:-5, max:5, step:0.1, default:1 },

    ],

    range: { xMin:-8, xMax:8, yMin:-6, yMax:6 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-8,8,-6,6); V.drawAxes(-8,8,-6,6);

      V.drawFunction(x => p.a * Math.sin(p.b * x), -8, 8, -6, 6, '#818cf8', 2.5);

      V.drawText('f(x) = ' + p.a.toFixed(1) + ' · sin(' + p.b.toFixed(1) + 'x)', -7.5, 5.3, -8,8,-6,6, '#a5b4fc', 13);

    }

  },



  /* ═══ 概率论专属可视化 ═══ */

  'probability-basic': {

    title: '概率基本概念可视化',

    formula: 'P(A) = m/n（古典概型）',

    params: [

      { id:'m', label:'有利事件数 m', min:1, max:36, step:1, default:6 },

      { id:'n', label:'样本点总数 n', min:1, max:36, step:1, default:36 },

    ],

    range: { xMin:-1, xMax:7, yMin:-0.2, yMax:1.2 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-1,7,-0.2,1.2); V.drawAxes(-1,7,-0.2,1.2);

      const prob = p.m / p.n;

      // draw probability bar

      V.drawRect(0,0,6*prob,prob,-1,7,-0.2,1.2,'#ec4899','40');

      V.drawRect(0,0,6,prob,-1,7,-0.2,1.2,'#ec4899','10');

      V.drawLine(6*prob,0,6*prob,prob,-1,7,-0.2,1.2,'#ec4899',2);

      V.drawText('P(A) = ' + p.m + '/' + p.n + ' = ' + prob.toFixed(4), 0.5, 1.05, -1,7,-0.2,1.2, '#f0f2f8', 13);

      V.drawText('有利: ' + p.m + '  总数: ' + p.n, 3.5, 0.7, -1,7,-0.2,1.2, '#8b9ab5', 11);

    }

  },



  'bayes-theorem': {

    title: '贝叶斯公式可视化',

    formula: 'P(Bᵢ|A) = P(Bᵢ)P(A|Bᵢ) / Σ P(Bj)P(A|Bj)',

    params: [

      { id:'p1', label:'P(B₁)', min:0.01, max:0.99, step:0.01, default:0.5 },

      { id:'p2', label:'P(B₂)', min:0.01, max:0.99, step:0.01, default:0.3 },

      { id:'pa1', label:'P(A|B₁)', min:0.01, max:0.99, step:0.01, default:0.8 },

      { id:'pa2', label:'P(A|B₂)', min:0.01, max:0.99, step:0.01, default:0.2 },

    ],

    range: { xMin:-1, xMax:7, yMin:-0.2, yMax:1.2 },

    render(p) {

      const V = VizEngine;

      const p3 = 1 - p.p1 - p.p2;

      const pa3 = 0.1; // default for B3

      const denom = p.p1*p.pa1 + p.p2*p.pa2 + p3*pa3;

      const post1 = (p.p1*p.pa1)/denom;

      const post2 = (p.p2*p.pa2)/denom;

      const post3 = (p3*pa3)/denom;

      V.clear(); V.drawGrid(-1,7,-0.2,1.2); V.drawAxes(-1,7,-0.2,1.2);

      const colors = ['#ec4899','#8b5cf6','#06b6d4'];

      const labels = ['P(B₁|A)','P(B₂|A)','P(B₃|A)'];

      const priors = [p.p1, p.p2, p3];

      const posteriors = [post1, post2, post3];

      for (let i = 0; i < 3; i++) {

        const x = 0.5 + i * 2;

        // prior bar

        V.drawRect(x, 0, x+1, priors[i], -1,7,-0.2,1.2, colors[i]+'30');

        // posterior bar (brighter)

        V.drawRect(x, 0, x+1, posteriors[i], -1,7,-0.2,1.2, colors[i]+'70');

        V.drawText(labels[i] + '=' + posteriors[i].toFixed(4), x, posteriors[i]+0.05, -1,7,-0.2,1.2, colors[i], 11);

        V.drawText('先验: ' + priors[i].toFixed(2), x+0.5, priors[i]+0.05, -1,7,-0.2,1.2, colors[i]+'80', 10);

      }

      V.drawText('贝叶斯公式：先验 → 后验', 1, 1.1, -1,7,-0.2,1.2, '#f0f2f8', 12);

    }

  },



  'probability-distribution': {

    title: '概率分布可视化',

    formula: 'P(X=k) 或 f(x)',

    params: [

      { id:'type', label:'分布类型', min:0, max:4, step:1, default:0 },

      { id:'param1', label:'参数1 (n/λ/μ)', min:0.1, max:20, step:0.1, default:5 },

      { id:'param2', label:'参数2 (p/σ)', min:0.01, max:5, step:0.01, default:1 },

    ],

    range: { xMin:-5, xMax:15, yMin:-0.05, yMax:0.8 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-5,15,-0.05,0.8); V.drawAxes(-5,15,-0.05,0.8);

      const type = Math.floor(p.type);

      const names = ['二项分布 B(n,p)','泊松分布 π(λ)','均匀分布 U(a,b)','指数分布 Exp(λ)','正态分布 N(μ,σ²)'];

      if (type === 0) { // Binomial

        const n = Math.floor(p.param1), pp = Math.min(p.param2, 0.99);

        for (let k = 0; k <= n; k++) {

          let prob = 1;

          for (let j = 0; j < k; j++) prob *= (n-j)/(j+1);

          prob *= Math.pow(pp,k) * Math.pow(1-pp,n-k);

          V.drawRect(k-0.35,0,k+0.35,prob,-5,15,-0.05,0.8,'#ec4899','60');

          V.drawPoint(k,prob,-5,15,-0.05,0.8,'#ec4899',4);

        }

      } else if (type === 1) { // Poisson

        const lam = p.param1;

        for (let k = 0; k <= 20; k++) {

          let prob = Math.exp(-lam) * Math.pow(lam,k);

          for (let j = 1; j <= k; j++) prob /= j;

          if (prob < 0.001) break;

          V.drawRect(k-0.35,0,k+0.35,prob,-5,15,-0.05,0.8,'#8b5cf6','60');

          V.drawPoint(k,prob,-5,15,-0.05,0.8,'#8b5cf6',4);

        }

      } else if (type === 2) { // Uniform

        const a = p.param1 - 3, b = p.param1 + 3;

        const h = 1/(b-a);

        V.drawRect(a,0,b,h,-5,15,-0.05,0.8,'#10b981','40');

        V.drawLine(a,h,b,h,-5,15,-0.05,0.8,'#10b981',2);

      } else if (type === 3) { // Exponential

        const lam = p.param2;

        V.drawFunction(x => (x>=0 ? lam*Math.exp(-lam*x) : 0), -5,15,-0.05,0.8,'#f59e0b',2.5);

      } else { // Normal

        const mu = p.param1, sigma = Math.max(0.1, p.param2);

        V.drawFunction(x => (1/(sigma*Math.sqrt(2*Math.PI)))*Math.exp(-0.5*((x-mu)/sigma)**2), -5,15,-0.05,0.8,'#ec4899',2.5);

      }

      V.drawText(names[type], -4, 0.72, -5,15,-0.05,0.8, '#f0f2f8', 13);

    }

  },



  'normal-distribution': {

    title: '正态分布可视化',

    formula: 'f(x) = (1/σ√2π)·exp[-(x-μ)²/(2σ²)]',

    params: [

      { id:'mu', label:'均值 μ', min:-3, max:3, step:0.1, default:0 },

      { id:'sigma', label:'标准差 σ', min:0.1, max:3, step:0.1, default:1 },

    ],

    range: { xMin:-6, xMax:6, yMin:-0.05, yMax:0.55 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-6,6,-0.05,0.55); V.drawAxes(-6,6,-0.05,0.55);

      const fn = x => (1/(p.sigma*Math.sqrt(2*Math.PI)))*Math.exp(-0.5*((x-p.mu)/p.sigma)**2);

      // filled area

      const steps = 300;

      for (let i = 0; i < steps; i++) {

        const x = -6 + 12*i/steps;

        const y = fn(x);

        if (y > 0.001) V.drawRect(x,0,x+12/steps,y,-6,6,-0.05,0.55,'#ec4899','15');

      }

      V.drawFunction(fn,-6,6,-0.05,0.55,'#ec4899',2.5);

      V.drawPoint(p.mu,fn(p.mu),-6,6,-0.05,0.55,'#f59e0b',5);

      V.drawText('μ=' + p.mu.toFixed(1) + ' σ=' + p.sigma.toFixed(1), -5.5, 0.5, -6,6,-0.05,0.55, '#f0f2f8', 13);

      // 3σ rule

      V.drawLine(p.mu-p.sigma,fn(p.mu-p.sigma),p.mu+p.sigma,fn(p.mu+p.sigma),-6,6,-0.05,0.55,'#f59e0b',1.5,[4,3]);

      V.drawText('68.27%', p.mu, fn(p.mu)*0.3, -6,6,-0.05,0.55, '#f59e0b', 11);

    }

  },



  'joint-distribution': {

    title: '联合分布可视化',

    formula: 'F(x,y) = P(X≤x, Y≤y)',

    params: [

      { id:'rho', label:'相关系数 ρ', min:-0.99, max:0.99, step:0.01, default:0.5 },

      { id:'view', label:'视角', min:0, max:1, step:1, default:0 },

    ],

    range: { xMin:-4, xMax:4, yMin:-0.05, yMax:0.5 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-4,4,-0.05,0.5); V.drawAxes(-4,4,-0.05,0.5);

      // Show marginal X distribution of bivariate normal

      const sigma = 1;

      const fnX = x => (1/(sigma*Math.sqrt(2*Math.PI)))*Math.exp(-0.5*x*x);

      V.drawFunction(fnX,-4,4,-0.05,0.5,'#ec4899',2.5);

      // conditional distribution

      const sigmaCond = sigma * Math.sqrt(1 - p.rho*p.rho);

      const fnCond = x => (1/(sigmaCond*Math.sqrt(2*Math.PI)))*Math.exp(-0.5*x*x/(sigmaCond*sigmaCond));

      V.drawFunction(fnCond,-4,4,-0.05,0.5,'#8b5cf6',2);

      V.drawText('ρ = ' + p.rho.toFixed(2), -3.5, 0.45, -4,4,-0.05,0.5, '#f0f2f8', 13);

      V.drawText('边缘分布(粉) vs 条件分布(紫)', 0.5, 0.45, -4,4,-0.05,0.5, '#8b9ab5', 11);

    }

  },



  'expectation-variance': {

    title: '期望与方差可视化',

    formula: 'E(X) = Σxᵢpᵢ, D(X) = E(X²)-[E(X)]²',

    params: [

      { id:'dist', label:'分布', min:0, max:3, step:1, default:0 },

      { id:'param1', label:'参数1', min:0.1, max:10, step:0.1, default:1 },

      { id:'param2', label:'参数2', min:0.01, max:0.99, step:0.01, default:0.5 },

    ],

    range: { xMin:-3, xMax:10, yMin:-0.05, yMax:0.6 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-3,10,-0.05,0.6); V.drawAxes(-3,10,-0.05,0.6);

      const type = Math.floor(p.dist);

      const names = ['二项分布','泊松分布','正态分布','指数分布'];

      let ex = 0, dx = 0;

      if (type === 0) {

        const n = Math.floor(p.param1), pp = p.param2;

        ex = n*pp; dx = n*pp*(1-pp);

        for (let k = 0; k <= n; k++) {

          let prob = 1; for (let j=0;j<k;j++) prob*=(n-j)/(j+1);

          prob *= Math.pow(pp,k)*Math.pow(1-pp,n-k);

          V.drawRect(k-0.3,0,k+0.3,prob,-3,10,-0.05,0.6,'#ec4899','60');

        }

      } else if (type === 1) {

        const lam = p.param1; ex = lam; dx = lam;

        for (let k = 0; k <= 20; k++) {

          let prob = Math.exp(-lam)*Math.pow(lam,k);

          for(let j=1;j<=k;j++) prob/=j;

          if(prob<0.001) break;

          V.drawRect(k-0.3,0,k+0.3,prob,-3,10,-0.05,0.6,'#8b5cf6','60');

        }

      } else if (type === 2) {

        ex = p.param1; dx = p.param2*p.param2;

        V.drawFunction(x=>(1/(p.param2*Math.sqrt(2*Math.PI)))*Math.exp(-0.5*((x-ex)/p.param2)**2),-3,10,-0.05,0.6,'#ec4899',2.5);

      } else {

        const lam = p.param1; ex = 1/lam; dx = 1/lam/lam;

        V.drawFunction(x=>(x>=0?lam*Math.exp(-lam*x):0),-3,10,-0.05,0.6,'#f59e0b',2.5);

      }

      // mark expectation

      V.drawLine(ex,-0.05,ex,0.5,-3,10,-0.05,0.6,'#10b981',2,[4,3]);

      V.drawText('E(X)='+ex.toFixed(2)+' D(X)='+dx.toFixed(2), -2.5, 0.55, -3,10,-0.05,0.6, '#f0f2f8', 13);

      V.drawText(names[type], 5, 0.55, -3,10,-0.05,0.6, '#8b9ab5', 11);

    }

  },



  'correlation': {

    title: '相关系数可视化',

    formula: 'ρ = Cov(X,Y) / √(D(X)D(Y))',

    params: [

      { id:'rho', label:'ρ (相关系数)', min:-0.99, max:0.99, step:0.01, default:0.6 },

      { id:'n', label:'散点数量', min:20, max:200, step:10, default:100 },

    ],

    range: { xMin:-4, xMax:4, yMin:-4, yMax:4 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-4,4,-4,4); V.drawAxes(-4,4,-4,4);

      // generate correlated scatter points

      const n = Math.floor(p.n);

      const rho = p.rho;

      for (let i = 0; i < n; i++) {

        const z1 = (Math.random()-0.5)*6;

        const z2 = (Math.random()-0.5)*6;

        const x = z1;

        const y = rho*z1 + Math.sqrt(1-rho*rho)*z2;

        V.drawPoint(x*0.6, y*0.6, -4,4,-4,4, '#ec489960', 2.5);

      }

      // regression line

      V.drawLine(-3*rho, -3, 3*rho, 3, -4,4,-4,4, '#10b981', 2);

      V.drawText('ρ = ' + rho.toFixed(2), 2.5, 3.5, -4,4,-4,4, '#f0f2f8', 13);

      V.drawText('散点图 + 回归线', -3.5, 3.5, -4,4,-4,4, '#8b9ab5', 11);

    }

  },



  'clt-visualization': {

    title: '中心极限定理可视化',

    formula: '(ΣXᵢ - nμ) / (σ√n) → N(0,1)',

    params: [

      { id:'n', label:'样本量 n', min:1, max:50, step:1, default:5 },

      { id:'src', label:'原始分布', min:0, max:2, step:1, default:0 },

      { id:'trials', label:'模拟次数', min:100, max:1000, step:100, default:500 },

    ],

    range: { xMin:-5, xMax:5, yMin:-0.05, yMax:0.55 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-5,5,-0.05,0.55); V.drawAxes(-5,5,-0.05,0.55);

      const n = Math.floor(p.n);

      const trials = Math.floor(p.trials);

      const srcNames = ['均匀分布 U(0,1)','指数分布 Exp(1)','伯努利分布 B(1,0.5)'];

      // histogram of sample means

      const bins = 40;

      const counts = new Array(bins).fill(0);

      const mu = (p.src===0)?0.5:(p.src===1)?1:0.5;

      const sigma = (p.src===0)?1/Math.sqrt(12):(p.src===1)?1:0.5;

      for (let t = 0; t < trials; t++) {

        let sum = 0;

        for (let i = 0; i < n; i++) {

          if (p.src===0) sum += Math.random();

          else if (p.src===1) sum += -Math.log(Math.random());

          else sum += (Math.random()<0.5?0:1);

        }

        const z = (sum/n - mu)/(sigma/Math.sqrt(n));

        const bin = Math.floor((z+5)*bins/10);

        if (bin >= 0 && bin < bins) counts[bin]++;

      }

      const maxCount = Math.max(...counts);

      const barW = 10/bins;

      for (let i = 0; i < bins; i++) {

        if (counts[i] > 0) {

          const h = counts[i]/maxCount*0.45;

          const x = -5 + i*barW;

          V.drawRect(x, 0, x+barW, h, -5,5,-0.05,0.55, '#ec4899', '50');

        }

      }

      // overlay standard normal

      V.drawFunction(x => (1/Math.sqrt(2*Math.PI))*Math.exp(-0.5*x*x), -5,5,-0.05,0.55, '#10b981', 2);

      V.drawText('CLT: n='+n+' 分布='+srcNames[Math.floor(p.src)], -4.5, 0.5, -5,5,-0.05,0.55, '#f0f2f8', 13);

      V.drawText('样本均值直方图 → 正态', -4.5, 0.44, -5,5,-0.05,0.55, '#8b9ab5', 11);

    }

  },



  'sampling-distribution': {

    title: '抽样分布可视化',

    formula: 'χ²、t、F 分布',

    params: [

      { id:'type', label:'分布类型', min:0, max:2, step:1, default:0 },

      { id:'n', label:'自由度 n', min:1, max:30, step:1, default:5 },

    ],

    range: { xMin:-5, xMax:15, yMin:-0.05, yMax:0.6 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-5,15,-0.05,0.6); V.drawAxes(-5,15,-0.05,0.6);

      const n = Math.floor(p.n);

      const type = Math.floor(p.type);

      const names = ['χ²(n) 分布','t(n) 分布','F(m,n) 分布'];

      if (type === 0) { // χ²

        const k = n;

        V.drawFunction(x => (x>0 ? (1/(Math.pow(2,k/2)*Math.exp(k/2*Math.log(2)/Math.log(2)*0+k/2*Math.log(2)))) * Math.pow(x,k/2-1)*Math.exp(-x/2)/1 : 0), -5,15,-0.05,0.6,'#ef4444',2.5);

        // simplified χ² density

        V.drawFunction(x => {

          if (x<=0) return 0;

          const k2=k/2, lk2=Math.log(2)*k2;

          const logPdf = (k2-1)*Math.log(x) - x/2 - lk2;

          return Math.exp(logPdf) / (1+k*0.05);

        }, -5,15,-0.05,0.6,'#ef4444',2.5);

      } else if (type === 1) { // t

        V.drawFunction(x => {

          const c = (n+1)/2;

          const coeff = Math.exp(c*Math.log(n) - 0.5*Math.log(n) - c*Math.log(n+1+x*x));

          return coeff * Math.pow(1+x*x/n, -(n+1)/2) * 0.8;

        }, -5,15,-0.05,0.6,'#06b6d4',2.5);

      } else { // F (simplified)

        const m = n;

        V.drawFunction(x => {

          if (x<=0) return 0;

          return Math.pow(x, m/2-1) * Math.pow(m*x+n, -(m+n)/2) * 0.5;

        }, -5,15,-0.05,0.6,'#f59e0b',2.5);

      }

      V.drawText(names[type] + ' n=' + n, 5, 0.55, -5,15,-0.05,0.6, '#f0f2f8', 13);

    }

  },



  'parameter-estimation': {
    title: '参数估计可视化',

    formula: 'θ̂ — 点估计与区间估计',

    params: [
      { id:'mu', label:'真实均值 μ', min:-3, max:3, step:0.1, default:0 },
      { id:'sigma', label:'真实标准差 σ', min:0.1, max:3, step:0.1, default:1 },
      { id:'n', label:'样本量 n', min:5, max:100, step:5, default:30 },
      { id:'alpha', label:'显著性水平 α', min:0.01, max:0.2, step:0.01, default:0.05 },
    ],

    range: { xMin:-5, xMax:5, yMin:-0.05, yMax:0.55 },

    render(p) {
      const V = VizEngine;
      V.clear(); V.drawGrid(-5,5,-0.05,0.55); V.drawAxes(-5,5,-0.05,0.55);
      const fnPop = x => (1/(p.sigma*Math.sqrt(2*Math.PI)))*Math.exp(-0.5*((x-p.mu)/p.sigma)**2);
      V.drawFunction(fnPop,-5,5,-0.05,0.55,'#8b9ab5',1.5);
      const se = p.sigma/Math.sqrt(p.n);
      const z = normInv(1 - p.alpha/2);
      const lower = p.mu - z*se, upper = p.mu + z*se;
      const fnSamp = x => (1/(se*Math.sqrt(2*Math.PI)))*Math.exp(-0.5*((x-p.mu)/se)**2);
      V.drawFunction(fnSamp,-5,5,-0.05,0.55,'#ec4899',2.5);
      V.drawRect(lower,0,upper,fnSamp(p.mu)*0.5,-5,5,-0.05,0.55,'#10b981','22');
      V.drawLine(lower,-0.02,lower,0.45,-5,5,-0.05,0.55,'#10b981',2,[4,3]);
      V.drawLine(upper,-0.02,upper,0.45,-5,5,-0.05,0.55,'#10b981',2,[4,3]);
      V.drawText('置信区间 ['+lower.toFixed(2)+', '+upper.toFixed(2)+']', -4.5, 0.5, -5,5,-0.05,0.55, '#10b981', 12);
      V.drawText('样本均值 X̄ ~ N(μ, σ²/n), n='+Math.floor(p.n), -4.5, 0.43, -5,5,-0.05,0.55, '#8b9ab5', 11);
      V.drawText('灰=总体  粉=抽样分布', -4.5, 0.36, -5,5,-0.05,0.55, '#f0f2f8', 11);
    }

  },



  'hypothesis-test': {
    title: '假设检验可视化',

    formula: 'H₀ vs H₁ — 拒绝域与检验功效',

    params: [
      { id:'mu0', label:'H₀: μ₀', min:-3, max:3, step:0.1, default:0 },
      { id:'mu1', label:'H₁: μ₁', min:-3, max:3, step:0.1, default:1.5 },
      { id:'sigma', label:'σ', min:0.1, max:3, step:0.1, default:1 },
      { id:'alpha', label:'显著性水平 α', min:0.01, max:0.2, step:0.01, default:0.05 },
      { id:'side', label:'检验类型(0单侧/1双侧)', min:0, max:1, step:1, default:0 },
    ],

    range: { xMin:-5, xMax:5, yMin:-0.05, yMax:0.55 },

    render(p) {
      const V = VizEngine;
      V.clear(); V.drawGrid(-5,5,-0.05,0.55); V.drawAxes(-5,5,-0.05,0.55);
      const fn0 = x => (1/(p.sigma*Math.sqrt(2*Math.PI)))*Math.exp(-0.5*((x-p.mu0)/p.sigma)**2);
      const fn1 = x => (1/(p.sigma*Math.sqrt(2*Math.PI)))*Math.exp(-0.5*((x-p.mu1)/p.sigma)**2);
      const twoSided = Math.round(p.side) === 1;
      const zHalf = normInv(1 - p.alpha/2), zOne = normInv(1 - p.alpha);
      const critL = p.mu0 - (twoSided ? zHalf : 5) * p.sigma;
      const critR = p.mu0 + (twoSided ? zHalf : zOne) * p.sigma;
      if (twoSided) {
        V.drawRect(-5,0,critL,0.5,-5,5,-0.05,0.55,'#ef4444','14');
        V.drawRect(critR,0,5,0.5,-5,5,-0.05,0.55,'#ef4444','14');
      } else {
        V.drawRect(critR,0,5,0.5,-5,5,-0.05,0.55,'#ef4444','14');
      }
      V.drawFunction(fn0,-5,5,-0.05,0.55,'#ec4899',2.5);
      V.drawFunction(fn1,-5,5,-0.05,0.55,'#8b5cf6',2);
      V.drawLine(critR,-0.03,critR,0.5,-5,5,-0.05,0.55,'#ef4444',2,[4,3]);
      V.drawText('c='+critR.toFixed(2), critR, -0.03, -5,5,-0.05,0.55, '#ef4444', 10);
      if (twoSided) { V.drawLine(critL,-0.03,critL,0.5,-5,5,-0.05,0.55,'#ef4444',2,[4,3]); V.drawText('c='+critL.toFixed(2), critL, -0.03, -5,5,-0.05,0.55, '#ef4444', 10); }
      const aTxt = twoSided ? ('α/2='+(p.alpha/2).toFixed(3)) : ('α='+p.alpha.toFixed(3));
      V.drawText((twoSided?'双侧 ':'单侧 ')+aTxt, -4.5, 0.5, -5,5,-0.05,0.55, '#ef4444', 12);
      let power = twoSided
        ? (normCdf((critL-p.mu1)/p.sigma) + (1-normCdf((critR-p.mu1)/p.sigma)))
        : (1 - normCdf((critR-p.mu1)/p.sigma));
      V.drawText('检验功效 1-β = '+power.toFixed(3), -4.5, 0.43, -5,5,-0.05,0.55, '#22c55e', 12);
      V.drawText('H₀(粉) vs H₁(紫)', -4.5, 0.36, -5,5,-0.05,0.55, '#f0f2f8', 13);
    }

  },



  'anova-visualization': {

    title: '方差分析可视化',

    formula: 'F = MS_A / MS_E',

    params: [

      { id:'k', label:'组数 k', min:2, max:6, step:1, default:3 },

      { id:'effect', label:'组间效应', min:0, max:3, step:0.1, default:1 },

      { id:'noise', label:'组内噪声', min:0.1, max:3, step:0.1, default:1 },

    ],

    range: { xMin:-5, xMax:15, yMin:-0.05, yMax:0.6 },

    render(p) {

      const V = VizEngine;

      V.clear(); V.drawGrid(-5,15,-0.05,0.6); V.drawAxes(-5,15,-0.05,0.6);

      const k = Math.floor(p.k);

      const colors = ['#ec4899','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444'];

      for (let g = 0; g < k; g++) {

        const groupMean = g * p.effect;

        const fn = x => (1/(p.noise*Math.sqrt(2*Math.PI)))*Math.exp(-0.5*((x-groupMean)/p.noise)**2);

        V.drawFunction(fn,-5,15,-0.05,0.6,colors[g%colors.length],2);

        V.drawPoint(groupMean, fn(groupMean), -5,15,-0.05,0.6, colors[g%colors.length], 5);

      }

      V.drawText('k='+k+'组, 组间效应='+p.effect.toFixed(1), -4.5, 0.55, -5,15,-0.05,0.6, '#f0f2f8', 13);

      V.drawText('F值越大 → 组间差异越显著', 5, 0.55, -5,15,-0.05,0.6, '#8b9ab5', 11);

    }

  },



  'regression-plot': {
    title: '回归分析可视化',

    formula: 'ŷ = a + bx (最小二乘法)',

    params: [
      { id:'slope', label:'斜率 b', min:-2, max:2, step:0.1, default:0.8 },
      { id:'intercept', label:'截距 a', min:-3, max:3, step:0.1, default:0.5 },
      { id:'noise', label:'噪声 σ', min:0, max:3, step:0.1, default:0.8 },
      { id:'n', label:'样本数', min:20, max:200, step:20, default:80 },
    ],

    range: { xMin:-4, xMax:4, yMin:-4, yMax:4 },

    render(p) {
      const V = VizEngine;
      V.clear(); V.drawGrid(-4,4,-4,4); V.drawAxes(-4,4,-4,4);
      const n = Math.floor(p.n);
      let seed = 12345;
      const rnd = () => { seed = (seed*1103515245+12345) & 0x7fffffff; return seed/0x7fffffff; };
      const pts = [];
      let sx=0, sy=0, sxx=0, sxy=0;
      for (let i=0;i<n;i++){
        const x=(rnd()-0.5)*7;
        const y=p.intercept+p.slope*x+(rnd()-0.5)*2*p.noise;
        pts.push([x,y]); sx+=x; sy+=y; sxx+=x*x; sxy+=x*y;
      }
      const bx=(n*sxy-sx*sy)/(n*sxx-sx*sx);
      const ax=(sy-bx*sx)/n;
      for (const [x,y] of pts) {
        V.drawPoint(x,y,-4,4,-4,4,'#ec4899',2.5);
        V.drawLine(x,y,x,ax+bx*x,-4,4,-4,4,'#f59e0b','30',[3,3]);
      }
      V.drawLine(-4, ax+bx*(-4), 4, ax+bx*4, -4,4,-4,4, '#10b981', 2.5);
      V.drawText('ŷ = '+ax.toFixed(2)+' + '+bx.toFixed(2)+'x', 2, 3.5, -4,4,-4,4, '#10b981', 13);
      V.drawText('橙虚线=残差', -3.5, 3.5, -4,4,-4,4, '#f59e0b', 11);
    }

  },

  'la-det2': {
    title: '二阶行列式计算器',
    formula: '|a b; c d| = ad \u2212 bc',
    params: [
      { id:'x11', label:'a', min:-5, max:5, step:0.5, default:2 },
      { id:'x12', label:'b', min:-5, max:5, step:0.5, default:1 },
      { id:'x21', label:'c', min:-5, max:5, step:0.5, default:3 },
      { id:'x22', label:'d', min:-5, max:5, step:0.5, default:4 },
    ],
    range: { xMin:-6, xMax:6, yMin:-6, yMax:6 },
    render(p) {
      const V = VizEngine; V.clear(); V.drawGrid(-6,6,-6,6); V.drawAxes(-6,6,-6,6);
      const v1=[p.x11,p.x21], v2=[p.x12,p.x22], det=v1[0]*v2[1]-v1[1]*v2[0];
      V.drawArrow(0,0,v1[0],v1[1],-6,6,-6,6,'#818cf8',8);
      V.drawArrow(0,0,v2[0],v2[1],-6,6,-6,6,'#10b981',8);
      V.drawLine(v1[0],v1[1],v1[0]+v2[0],v1[1]+v2[1],-6,6,-6,6,'rgba(255,255,255,0.15)',1,[4,3]);
      V.drawLine(v2[0],v2[1],v1[0]+v2[0],v1[1]+v2[1],-6,6,-6,6,'rgba(255,255,255,0.15)',1,[4,3]);
      V.drawText('|a b;c d| = '+det.toFixed(1), -5.5, 5.3, -6,6,-6,6, '#f0f2f8', 13);
      V.drawText('面积 = |det| = '+Math.abs(det).toFixed(1), -5.5, 4.5, -6,6,-6,6, det===0?'#ef4444':'#10b981', 12);
    },
    animate(setParam, hint) {
      var t0 = Date.now();
      function loop() {
        if (!vizAnimState || !vizAnimState.running) return;
        var t = (Date.now() - t0) / 1000;
        setParam({
          x11: 4 * Math.cos(t * 0.8), x12: 3 * Math.sin(t * 0.6),
          x21: -2 * Math.sin(t * 0.7), x22: 4 * Math.cos(t * 0.9),
        });
        if (hint) hint('蓝色向量 a 旋转 + 绿色向量 b 旋转 → 平行四边形面积 = |det| 不断变化');
        vizAnimState.frame = requestAnimationFrame(loop);
      }
      loop();
    },
  },
  'la-det3': {
    title: '三阶行列式演示',
    formula: '对角法则: 实线方向和 - 虚线方向和',
    params: [
      { id:'a', label:'a\u2081\u2081', min:-3, max:3, step:0.5, default:1 },
      { id:'b', label:'a\u2081\u2082', min:-3, max:3, step:0.5, default:0 },
      { id:'c', label:'a\u2081\u2083', min:-3, max:3, step:0.5, default:0 },
      { id:'d', label:'a\u2082\u2081', min:-3, max:3, step:0.5, default:0 },
    ],
    range: { xMin:-5, xMax:5, yMin:-5, yMax:5 },
    render(p) {
      const V=VizEngine;V.clear();V.drawGrid(-5,5,-5,5);V.drawAxes(-5,5,-5,5);
      const a=p.a,b=p.b,c=p.c,d=p.d,e=1,f=0,g=0,h=1,i=1;
      const det=a*e*i+b*f*g+c*d*h-c*e*g-b*d*i-a*f*h;
      V.drawArrow(0,0,a,d,-5,5,-5,5,'#818cf8',7);V.drawArrow(0,0,b,e,-5,5,-5,5,'#10b981',7);
      V.drawText('示例3阶det（调整左上角元素）',-4.5,4.5,-5,5,-5,5,'#f0f2f8',12);
      V.drawText('det = '+det.toFixed(1),-4.5,3.8,-5,5,-5,5,'#f59e0b',12);
    },
  },
  'la-n-det': {
    title: 'n阶行列式展开',
    formula: 'D = \u03a3 (\u22121)^{\u03c4} a_{1p1}a_{2p2}\u2026a_{npn}',
    params: [
      { id:'n', label:'阶数 n', min:2, max:4, step:1, default:3 },
      { id:'seed', label:'矩阵种子', min:1, max:10, step:1, default:5 },
    ],
    range: { xMin:0, xMax:6, yMin:0, yMax:6 },
    render(p) {
      const V=VizEngine;V.clear();const n=p.n;V.drawGrid(0,6,0,6);
      const cols=['818cf8','10b981','f59e0b','ec4899'];
      for(let i=0;i<n;i++)for(let j=0;j<n;j++){const val=((p.seed*(i+1)*(j+1))%10);V.drawText(val+'',1+j*1.2,5-i*1.2,0,6,0,6,'#'+cols[i],14);}
      V.drawText(n+'\u00d7'+n+' 矩阵',0.5,5.5,0,6,0,6,'#f0f2f8',13);
      V.drawText('n! = '+[1,1,2,6,24,120][n]+' 项展开',0.5,0.4,0,6,0,6,'#f59e0b',12);
    },
  },
  'la-block': {
    title: '矩阵分块法',
    formula: '分块对角阵: |A|=|A11||A22|',
    params: [ { id:'s', label:'分块大小', min:1, max:3, step:1, default:2 } ],
    range: { xMin:0, xMax:6, yMin:0, yMax:6 },
    render(p) {
      const V=VizEngine;V.clear();V.drawGrid(0,6,0,6);const s=p.s;
      const cols=['818cf8','10b981','f59e0b'];
      for(let i=0;i<4;i++)for(let j=0;j<4;j++){const sameBlock=(i<s&&j<s)||(i>=s&&j>=s);V.drawText(sameBlock?'b'+i+j:'0',1+j*1.1,5-i*1.1,0,6,0,6,'#'+(sameBlock?cols[0]:'666'),sameBlock?13:10);}
      V.drawText('分块对角阵(非零块为b)',0.5,5.5,0,6,0,6,'#f0f2f8',12);
      V.drawText('|A|=|A11|\u00b7|A22|, 可分别求逆',0.5,0.3,0,6,0,6,'#f59e0b',11);
    },
  },
  'la-rank': {
    title: '矩阵的秩',
    formula: 'r(A) = 行阶梯后非零行数',
    params: [ { id:'r', label:'秩 r', min:0, max:2, step:1, default:2 } ],
    range: { xMin:0, xMax:6, yMin:0, yMax:6 },
    render(p) {
      const V=VizEngine;V.clear();V.drawGrid(0,6,0,6);const r=p.r;
      const M=[2,1,3,0,(r>=1?1:0),(r>=1?2:0),0,0,(r>=2?0:0)];
      for(let i=0;i<3;i++)for(let j=0;j<3;j++){const v=M[i*3+j];V.drawText(v+'',1+j*1.5,5-i*1.3,0,6,0,6,'#'+(v===0?'666':'f59e0b'),v===0?10:14);}
      V.drawText('行阶梯形 r(A)='+r,0.5,5.5,0,6,0,6,'#f0f2f8',13);
      V.drawText('秩=非零行数=独立方程个数',0.5,0.4,0,6,0,6,'#10b981',11);
    },
  },
  'la-gauss': {
    title: '高斯消元法',
    formula: '增广矩阵 \u2192 行阶梯 \u2192 回代',
    params: [ { id:'step', label:'消元步骤', min:0, max:2, step:1, default:0 } ],
    range: { xMin:0, xMax:6, yMin:0, yMax:6 },
    render(p) {
      const V=VizEngine;V.clear();V.drawGrid(0,6,0,6);
      const steps=[[2,1,1,8,4,-1,2,6,1,1,-1,1],[2,1,1,8,0,-3,0,-10,0,0.5,-1.5,-3],[2,1,1,8,0,-3,0,-10,0,0,-1.5,-4.67]];
      const s=steps[p.step];const titles=['\u2460 初始增广矩阵','\u2461 消元中(r2-2r1)','\u2462 行阶梯形(准备回代)'];
      const vars=['x ','y ','z '];
      for(let i=0;i<3;i++){const row=s.slice(i*4,i*4+4);let line='';for(let j=0;j<3;j++)line+=(row[j]>=0&&j>0?'+':'')+row[j]+vars[j];line+='= '+row[3];V.drawText(line,0.5,5-i*1.3,0,6,0,6,'#f0f2f8',11);}
      V.drawText(titles[p.step],0.5,5.5,0,6,0,6,'#10b981',11);
    },
  },
  'la-inner': {
    title: '内积与施密特正交化',
    formula: '(a,b)=sum(a_i b_i); b_i=a_i-sum((a_i,b_j)/(b_j,b_j))b_j',
    params: [
      { id:'a1', label:'a1_x', min:-3, max:3, step:0.5, default:2 },
      { id:'a2', label:'a1_y', min:-3, max:3, step:0.5, default:1 },
      { id:'b1', label:'a2_x', min:-3, max:3, step:0.5, default:0 },
    ],
    range: { xMin:-5, xMax:5, yMin:-5, yMax:5 },
    render(p) {
      const V=VizEngine;V.clear();V.drawGrid(-5,5,-5,5);V.drawAxes(-5,5,-5,5);
      const a1=[p.a1,p.a2],a2=[p.b1,2];const aa=a1[0]*a1[0]+a1[1]*a1[1];
      const ab=a2[0]*a1[0]+a2[1]*a1[1];const coeff=ab/aa;
      const b1=[a1[0],a1[1]],b2=[a2[0]-coeff*a1[0],a2[1]-coeff*a1[1]];
      V.drawArrow(0,0,b1[0],b1[1],-5,5,-5,5,'#818cf8',7);
      V.drawArrow(0,0,a2[0],a2[1],-5,5,-5,5,'#10b981',5);
      V.drawArrow(0,0,b2[0],b2[1],-5,5,-5,5,'#f59e0b',7);
      V.drawLine(b2[0],b2[1],b1[0]*coeff,b1[1]*coeff,-5,5,-5,5,'rgba(255,255,255,0.1)',0.5,[3,3]);
      V.drawText('b1(蓝)=a1; b2(黄)=a2-proj(a2)',-4.5,4.5,-5,5,-5,5,'#f0f2f8',11);
      V.drawText('内积(a1,a2)='+ab.toFixed(1)+', proj系数='+coeff.toFixed(2),-4.5,-4.5,-5,5,-5,5,'#8b9ab5',10);
    },
  },
  'la-eigen': {
    title: '特征值与特征向量',
    formula: 'A\u03be = \u03bb\u03be, |\u03bb I - A| = 0',
    params: [
      { id:'lam1', label:'特征值 \u03bb\u2081', min:-3, max:5, step:0.5, default:2 },
      { id:'lam2', label:'特征值 \u03bb\u2082', min:-3, max:5, step:0.5, default:1 },
    ],
    range: { xMin:-8, xMax:8, yMin:-8, yMax:8 },
    render(p) {
      const V=VizEngine;V.clear();V.drawGrid(-8,8,-8,8);V.drawAxes(-8,8,-8,8);
      const l1=p.lam1,l2=p.lam2;
      V.drawArrow(0,0,2*l1,0,-8,8,-8,8,'#818cf8',8);
      V.drawArrow(0,0,0,3*l2,-8,8,-8,8,'#10b981',6);
      V.drawArrow(0,0,1,0,-8,8,-8,8,'rgba(255,255,255,0.15)',4);
      V.drawText('\u03bb1='+l1.toFixed(1)+'(蓝) \u03bb2='+l2.toFixed(1)+'(绿)',-7.5,7.5,-8,8,-8,8,'#f0f2f8',12);
      V.drawText('特征向量方向不变, 仅缩放\u03bb倍',-7.5,6.5,-8,8,-8,8,'#f59e0b',11);
    },
    animate(setParam, hint) {
      var t0 = Date.now();
      function loop() {
        if (!vizAnimState || !vizAnimState.running) return;
        var t = (Date.now() - t0) / 1000;
        setParam({
          lam1: 3 + 2 * Math.sin(t * 0.7), lam2: 2 + 1.5 * Math.cos(t * 0.9),
        });
        if (hint) hint('特征向量（蓝/绿方向）长度按特征值 λ 缩放：λ>1 变长，0<λ<1 变短，λ<0 反向');
        vizAnimState.frame = requestAnimationFrame(loop);
      }
      loop();
    },
  },
  'la-diag': {
    title: '实对称矩阵正交对角化',
    formula: 'A=A^T \u21d2 \u2203Q: Q^TAQ=\u039b',
    params: [ { id:'lam', label:'特征值差|\u03bb1-\u03bb2|', min:0, max:5, step:0.5, default:3 } ],
    range: { xMin:-6, xMax:6, yMin:-6, yMax:6 },
    render(p) {
      const V=VizEngine;V.clear();V.drawGrid(-6,6,-6,6);V.drawAxes(-6,6,-6,6);
      const d=p.lam/2;const t1=[1+d,0],t2=[0,1-d];
      V.drawArrow(0,0,1,0,-6,6,-6,6,'rgba(255,255,255,0.15)',4);
      V.drawArrow(0,0,0,1,-6,6,-6,6,'rgba(255,255,255,0.15)',4);
      V.drawArrow(0,0,t1[0],t1[1],-6,6,-6,6,'#818cf8',7);
      V.drawArrow(0,0,t2[0],t2[1],-6,6,-6,6,'#10b981',7);
      V.drawText('特征向量正交(垂直)',-5.5,5.5,-6,6,-6,6,'#f0f2f8',12);
      V.drawText('Q=[\u03be\u2081,\u03be\u2082] Q^TAQ=diag(\u03bb\u2081,\u03bb\u2082)',-5.5,4.5,-6,6,-6,6,'#f59e0b',11);
    },
  },
  'la-basis': {
    title: '维数、基与坐标',
    formula: 'dim V = r, a = sum(x_i*e_i)',
    params: [
      { id:'x', label:'坐标x', min:-3, max:3, step:0.5, default:2 },
      { id:'y', label:'坐标y', min:-3, max:3, step:0.5, default:1 },
    ],
    range: { xMin:-5, xMax:5, yMin:-5, yMax:5 },
    render(p) {
      const V=VizEngine;V.clear();V.drawGrid(-5,5,-5,5);V.drawAxes(-5,5,-5,5);
      const x=p.x,y=p.y;
      V.drawArrow(0,0,1,0,-5,5,-5,5,'rgba(255,255,255,0.15)',4);
      V.drawArrow(0,0,0,1,-5,5,-5,5,'rgba(255,255,255,0.15)',4);
      V.drawArrow(0,0,x,0,-5,5,-5,5,'#818cf8',6);
      V.drawArrow(x,0,0,y,-5,5,-5,5,'#10b981',6);
      V.drawArrow(0,0,x,y,-5,5,-5,5,'#f59e0b',8);
      V.drawText('坐标=('+x+','+y+')',-4.5,4.5,-5,5,-5,5,'#f59e0b',12);
      V.drawText('灰=基e1,e2(单位坐标向量)',-4.5,-4.5,-5,5,-5,5,'#8b9ab5',10);
    },
  }};



/* ═══ 新增：二项分布正态近似可视化 ═══ */
Object.assign(vizTypes, {
  'binom-normal': {
    title: '二项分布的正态近似',
    formula: 'B(n,p) ≈ N(np, np(1-p))',
    params: [
      { id:'n', label:'试验次数 n', min:5, max:40, step:1, default:20 },
      { id:'p', label:'成功概率 p', min:0.05, max:0.95, step:0.05, default:0.4 },
    ],
    range: { xMin:-0.5, xMax:42, yMin:-0.05, yMax:0.4 },
    render(p) {
      const V = VizEngine;
      V.clear(); V.drawGrid(-0.5,42,-0.05,0.4); V.drawAxes(-0.5,42,-0.05,0.4);
      const n = Math.floor(p.n), pp = p.p;
      const mean = n*pp, varc = n*pp*(1-pp), sd = Math.sqrt(varc);
      for (let k=0;k<=n;k++){
        let prob=1;
        for(let j=0;j<k;j++) prob*=(n-j)/(j+1);
        prob*=Math.pow(pp,k)*Math.pow(1-pp,n-k);
        V.drawRect(k-0.35,0,k+0.35,prob,-0.5,42,-0.05,0.4,'#8b5cf6','45');
        V.drawPoint(k,prob,-0.5,42,-0.05,0.4,'#8b5cf6',4);
      }
      const fn = x => (1/(sd*Math.sqrt(2*Math.PI)))*Math.exp(-0.5*((x-mean)/sd)**2);
      V.drawFunction(fn, 0, n, -0.05, 0.4, '#ef4444', 2.5);
      V.drawText('B('+n+', '+pp.toFixed(2)+')  (紫柱)', 1, 0.37, -0.5,42,-0.05,0.4, '#8b5cf6', 12);
      V.drawText('N('+mean.toFixed(1)+', '+varc.toFixed(1)+')  (红曲线)', 1, 0.34, -0.5,42,-0.05,0.4, '#ef4444', 12);
      V.drawText('np='+mean.toFixed(1)+', √np(1-p)='+sd.toFixed(2), 1, 0.31, -0.5,42,-0.05,0.4, '#8b9ab5', 11);
    }
  },
});

/* ═══════ 数学表达式解析器 ═══════ */

function parseMathExpr(input) {

  let s = input.trim();

  if (!s) return null;



  // 安全检查：只允许数学相关字符

  if (!/^[0-9x+\-*/().^ \t,sincotaqlgrebpPIE]+$/.test(s)) return null;



  s = s.replace(/\^/g, '**');



  // 先替换函数名（长名优先，避免子串冲突）

  const reps = [

    [/\basin\b/gi,'Math.asin'],[/\bacos\b/gi,'Math.acos'],[/\batan\b/gi,'Math.atan'],

    [/\bsinh\b/gi,'Math.sinh'],[/\bcosh\b/gi,'Math.cosh'],[/\btanh\b/gi,'Math.tanh'],

    [/\bsqrt\b/gi,'Math.sqrt'],[/\bcbrt\b/gi,'Math.cbrt'],[/\babs\b/gi,'Math.abs'],

    [/\bsin\b/gi,'Math.sin'],[/\bcos\b/gi,'Math.cos'],[/\btan\b/gi,'Math.tan'],

    [/\bexp\b/gi,'Math.exp'],[/\blog\b/gi,'Math.log'],[/\bln\b/gi,'Math.log'],

    [/\bpi\b/gi,'(Math.PI)'],[/\bPI\b/g,'(Math.PI)'],

  ];

  for (const [re, repl] of reps) s = s.replace(re, repl);

  // 单独的 e（非已被替换的）

  s = s.replace(/(?<![a-zA-Z.])e(?![a-zA-Z])/g, '(Math.E)');



  // 保护 Math. 不被隐式乘法破坏

  const _M = '\x01';

  s = s.replace(/Math\./g, _M);



  // 插入隐式乘号：2x→2*x, 2(→2*(, )(→)*)(, )x→)*x, x(→x*(, x)→x)* 不会出现

  s = s.replace(/(\d)([a-zA-Z_(])/g, '$1*$2');

  s = s.replace(/\)(\w)/g, ')*$1');

  s = s.replace(/\)\(/g, ')*(');



  // 恢复 Math.

  s = s.replace(new RegExp(_M, 'g'), 'Math.');

  // 清理多余 **

  while (s.includes('***')) s = s.replace(/\*\*\*/g, '**');



  try {

    const fn = new Function('x', '"use strict"; return (' + s + ')');

    const t0 = fn(0), t1 = fn(1), t2 = fn(-1);

    if ([t0,t1,t2].some(v => typeof v !== 'number')) return null;

    return fn;

  } catch { return null; }

}



function renderCustomExpr() {

  const input = document.getElementById('customExprInput');

  const expr = input ? input.value.trim() : '';

  if (!expr) return;

  const fn = parseMathExpr(expr);

  if (!fn) {

    const hint = document.getElementById('customExprHint');

    if (hint) { hint.textContent = '表达式无法识别，请检查语法'; hint.style.color = '#ef4444'; }

    return;

  }

  // 自动计算 y 范围

  let yMin = Infinity, yMax = -Infinity;

  const xMin = -10, xMax = 10;

  for (let i = 0; i <= 400; i++) {

    const x = xMin + (xMax - xMin) * i / 400;

    try {

      const y = fn(x);

      if (isFinite(y) && Math.abs(y) < 100) { yMin = Math.min(yMin, y); yMax = Math.max(yMax, y); }

    } catch {}

  }

  if (!isFinite(yMin)) { yMin = -5; yMax = 5; }

  const yPad = Math.max((yMax - yMin) * 0.2, 1);

  yMin -= yPad; yMax += yPad;



  const V = VizEngine;

  V.resize();

  V.clear(); V.drawGrid(xMin,xMax,yMin,yMax); V.drawAxes(xMin,xMax,yMin,yMax);

  V.drawFunction(fn, xMin, xMax, yMin, yMax, '#818cf8', 2.5);

  V.drawText('f(x) = ' + expr, xMin + 0.5, yMax - 0.5, xMin,xMax,yMin,yMax, '#a5b4fc', 13);



  const hint = document.getElementById('customExprHint');

  if (hint) { hint.textContent = '已绘制'; hint.style.color = '#10b981'; }

  state._customFn = fn;

  state._customRange = {xMin,xMax,yMin,yMax};

}



function clearCustomExpr() {

  state._customFn = null;

  state._customRange = null;

  const input = document.getElementById('customExprInput');

  if (input) input.value = '';

  updateViz();

  const hint = document.getElementById('customExprHint');

  if (hint) { hint.textContent = ''; }

}



/* ═══════ 知识点详解与练习题数据 ═══════ */

function getKPDetail(courseId, chNum, kpIndex) {

  return kpDetails[(courseId||'gaoshu') + '-' + chNum + '-' + kpIndex] || null;

}



const kpDetails = {

"gaoshu-1-0": {explanation:"映射是数学中描述两个集合元素对应关系的概念。函数是数集到数集的映射，是高等数学的基础研究对象。函数的定义域、对应法则和值域构成函数的三要素，两函数相等当且仅当定义域和对应法则均相同。\n\n常见函数类型包括常数函数、幂函数、指数函数、对数函数、三角函数和反三角函数，称为六类基本初等函数。由基本初等函数经过有限次四则运算和复合运算得到的函数称为初等函数。\n\n易错点：判断函数相等时，定义域和对应法则缺一不可；复合函数求定义域时需从外向内逐层分析。",problems:[{q:"设函数f(x)的定义域为[0,1]，求f(2x+1)的定义域",a:"令 0 ≤ 2x+1 ≤ 1，解得 -1/2 ≤ x ≤ 0，故定义域为 [-1/2, 0]",d:"easy"},{q:"判断函数 f(x)=ln(x+√(x²+1)) 的奇偶性",a:"f(-x) = ln(-x+√(x²+1)) = ln(1/(x+√(x²+1))) = -ln(x+√(x²+1)) = -f(x)，故为奇函数",d:"medium"},{q:"设f(x)是奇函数，g(x)是偶函数，讨论 f(g(x)) 和 g(f(x)) 的奇偶性",a:"f(g(-x)) = f(g(x))，故 f(g(x)) 为偶函数；g(f(-x)) = g(-f(x)) = g(f(x))，故 g(f(x)) 为偶函数",d:"hard"}]},

"gaoshu-1-1": {explanation:"数列是按一定顺序排列的一列数，记作 {xₙ}。数列的极限描述了当项数 n 无限增大时，数列项趋近的固定常数。\n\n收敛数列具有三个重要性质：唯一性（极限值唯一确定）、有界性（收敛数列必有界）、保号性（极限为正则从某项起都为正）。单调有界准则是判断数列收敛的重要方法。\n\n易错点：有界数列不一定收敛，但收敛数列一定有界。",problems:[{q:"求极限 lim(n→∞)(√(n+1)-√n)",a:"分子有理化：原式 = 1/(√(n+1)+√n) → 0",d:"easy"},{q:"判断数列 {(1+1/n)ⁿ} 的敛散性",a:"该数列为 e 的来源数列，利用二项展开可证其单调递增且有上界 3，故收敛于 e ≈ 2.71828",d:"medium"},{q:"用极限定义证明 lim(n→∞)(2n+1)/(3n-2) = 2/3",a:"|(2n+1)/(3n-2) - 2/3| = 7/(9n-6)，令其 < ε，取 N = ceil((7+6ε)/(9ε)) 即可",d:"hard"}]},

"gaoshu-1-2": {explanation:"函数的极限研究当自变量 x 无限趋近于某定点 x₀ 时，函数值的变化趋势。左极限和右极限分别从左侧和右侧趋近，二者相等是极限存在的必要条件。\n\n函数极限具有唯一性、局部有界性和局部保号性，四则运算和复合运算的极限法则同样适用。海涅定理（归结原则）将函数极限与数列极限联系起来。\n\n易错点：左极限不等于右极限时，函数极限不存在；极限存在不代表函数在该点有定义。",problems:[{q:"求极限 lim(x→0) x·sin(1/x)",a:"|x·sin(1/x)| ≤ |x| → 0，由夹逼准则，极限为 0",d:"easy"},{q:"讨论 f(x) = {x², x<1; ax+b, x≥1} 在 x=1 处极限存在的条件",a:"左极限 = 1，右极限 = a+b，存在极限需 1 = a+b",d:"medium"},{q:"求 lim(x→0) (eˣ - 1)/x",a:"令 t = eˣ - 1，则 x = ln(1+t)，当 x→0 时 t→0，原式 = lim(t→0) t/ln(1+t) = 1",d:"hard"}]},

"gaoshu-1-3": {explanation:"无穷小是极限为零的变量，无穷大是绝对值无限增大的变量（注意无穷大不是数）。二者呈倒数关系：若 f(x) 是无穷大，则 1/f(x) 是无穷小。\n\n无穷小的阶的比较：若 lim(α/β) = 1 则 α 与 β 等价（α~β），若 = 0 则 α 是 β 的高阶无穷小，若 = c≠0 则 α 与 β 同阶。等价无穷小替换是求极限的重要技巧。\n\n常用等价替换（x→0）：sin x ~ x，tan x ~ x，1-cos x ~ x²/2，ln(1+x) ~ x，eˣ-1 ~ x。",problems:[{q:"比较 x→0 时，x、sin x、x² 的阶数关系",a:"lim(sin x/x) = 1 故 sin x ~ x（同阶），lim(x²/x) = 0 故 x² 是 x 的高阶无穷小",d:"easy"},{q:"当 x→0 时，确定 a 使 (1-cos x)/x^a 有非零极限",a:"1-cos x ~ x²/2，令 a=2，极限为 1/2",d:"medium"},{q:"求 lim(x→0) (tan x - sin x)/x³",a:"= sin x(1-cos x)/(x³·cos x) ~ x·(x²/2)/x³ = 1/2",d:"medium"}]},

"gaoshu-1-4": {explanation:"两个重要极限：① $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$；② $\\lim_{x \\to \\infty} (1+\\frac{1}{x})^x = e$。\n\n夹逼准则：若 $g(x) \\le f(x) \\le h(x)$ 且 $\\lim g = \\lim h = A$，则 $\\lim f = A$。单调有界准则：单调有界数列必定收敛。\n\n易错点：第一个重要极限必须 $x \\to 0$ 且是 $\\sin x$ 与 $x$ 的比值形式；第二个重要极限中 $1+\\frac{1}{x}$ 的底数趋近 $1$，指数趋近 $\\infty$，构成 $1^\\infty$ 型。",problems:[{q:"求 lim(x→0) sin(x²)/(x·sin 3x)",a:"= lim x²/(x·3x) = 1/3",d:"easy"},{q:"求 lim(x→∞) (1-2/x)^(3x)",a:"= lim[(1-2/x)^(-x/2)]^(-6) = e^(-6)",d:"medium"},{q:"利用夹逼准则求 lim(n→∞) (1/√(n²+1) + 1/√(n²+2) + ... + 1/√(n²+n))",a:"n/√(n²+n) < Sₙ < n/√(n²+1)，两端极限均为 1，故原式 = 1",d:"hard"}]},

"gaoshu-1-5": {explanation:"函数在点 x₀ 连续需满足三个条件：f(x₀) 有定义、极限存在、极限值等于函数值。不满足任一条件则为间断点。\n\n间断点分类：第一类（左右极限均存在）：可去间断点（极限=函数值≠定义值或无定义）、跳跃间断点（左右极限不等）；第二类（至少一侧极限不存在）：无穷间断点、振荡间断点等。\n\n初等函数在其定义区间内都是连续的。连续函数的四则运算和复合运算仍为连续函数。",problems:[{q:"讨论 f(x) = {x², x≠1; 3, x=1} 在 x=1 处的连续性",a:"lim(x→1) f(x) = 1 ≠ f(1) = 3，故 x=1 为可去间断点",d:"easy"},{q:"指出 f(x) = 1/(x-1) 的间断点及其类型",a:"x=1 处无定义，lim f(x) = ∞，为无穷间断点（第二类）",d:"easy"},{q:"证明方程 x³-4x+1=0 在 (1,2) 内至少有一个实根",a:"设 f(x)=x³-4x+1，f(1)=-2<0，f(2)=1>0，由零点定理，存在 ξ∈(1,2) 使 f(ξ)=0",d:"medium"}]},

"gaoshu-1-6": {explanation:"闭区间上连续函数具有四个重要性质：有界性定理（必有最大值和最小值）、介值定理（能取得最大值和最小值之间的一切值）、零点定理（异号值之间必有零点）、一致连续性。\n\n注意：开区间内的连续函数不一定有界，也不一定有最大最小值。一致连续性是比连续性更强的概念。\n\n零点定理是证明方程有根的常用工具，关键在于构造合适的辅助函数并找到异号的两个端点。",problems:[{q:"证明方程 x⁵+x-1=0 在 (0,1) 内有唯一实根",a:"f(x)=x⁵+x-1，f(0)=-1<0，f(1)=1>0。又 f'(x)=5x⁴+1>0 恒成立（单调递增），故有唯一零点",d:"medium"},{q:"设 f(x) 在 [0,1] 上连续且 f(0)=f(1)，证明存在 ξ∈[0,1/2] 使 f(ξ)=f(ξ+1/2)",a:"令 g(x)=f(x)-f(x+1/2)，g(0)=f(0)-f(1/2)，g(1/2)=f(1/2)-f(1)=f(1/2)-f(0)，若 g(0)=0 则 ξ=0，否则 g(0)·g(1/2)<0，由零点定理得证",d:"hard"}]},

"gaoshu-2-0": {explanation:"导数描述函数在某一点处因变量相对于自变量的瞬时变化率：$f'(x_0) = \\lim_{\\Delta x \\to 0} \\frac{f(x_0+\\Delta x)-f(x_0)}{\\Delta x}$。\n\n导数的几何意义：曲线 $y=f(x)$ 在点 $(x_0, f(x_0))$ 处切线的斜率。物理意义：位移对时间的导数为速度。\n\n可导必连续，但连续不一定可导（如 $f(x)=|x|$ 在 $x=0$ 处）。可导的充要条件是左右导数存在且相等。",problems:[{q:"用定义求 f(x)=x³ 在 x=2 处的导数",a:"f'(2) = lim(Δx→0) [(2+Δx)³-8]/Δx = lim(12Δx+6Δx²+Δx³)/Δx = 12",d:"easy"},{q:"设 f(x) 可导，求 lim(h→0) [f(a+2h)-f(a)]/h",a:"= 2·lim(h→0) [f(a+2h)-f(a)]/(2h) = 2f'(a)",d:"medium"},{q:"证明 f(x)=|x| 在 x=0 处连续但不可导",a:"连续性：lim|x|=0=f(0)；不可导：左导数 = -1，右导数 = 1，不相等",d:"medium"}]},

"gaoshu-2-1": {explanation:"求导法则包括：四则运算 (u±v)'=u'±v'，(uv)'=u'v+uv'，(u/v)'=(u'v-uv')/v²；链式法则：若 y=f(u)，u=g(x)，则 dy/dx=f'(u)·g'(x)。\n\n基本求导公式：(xⁿ)'=nxⁿ⁻¹，(sin x)'=cos x，(cos x)'=-sin x，(eˣ)'=eˣ，(ln x)'=1/x 等，需熟练记忆。\n\n易错点：复合函数求导必须用链式法则逐层展开，不能漏掉任何一层。",problems:[{q:"求 y = xeˣ 的导数",a:"y' = eˣ + xeˣ = eˣ(1+x)",d:"easy"},{q:"求 y = ln(x²+1) 的导数",a:"y' = 2x/(x²+1)",d:"easy"},{q:"求 y = sin²(cos x) 的导数",a:"y' = 2sin(cos x)·cos(cos x)·(-sin x) = -2sin(cos x)·cos(cos x)·sin x",d:"medium"}]},

"gaoshu-2-2": {explanation:"高阶导数是导数的导数，f⁽ⁿ⁾(x) 表示 f(x) 的 n 阶导数。莱布尼茨公式：(uv)⁽ⁿ⁾ = Σ C(n,k)·u⁽ᵏ⁾·v⁽ⁿ⁻ᵏ⁾。\n\n常用高阶导数公式：sin(x) 的 n 阶导数为 sin(x+nπ/2)，cos(x) 为 cos(x+nπ/2)，eˣ 为 eˣ，1/(1+x) 为 (-1)ⁿn!/(1+x)ⁿ⁺¹。\n\n求高阶导数的常用方法：直接法（逐次求导找规律）、莱布尼茨公式（乘积形式）、分解法（化为已知公式）。",problems:[{q:"求 y = eˣcos x 的二阶导数",a:"y' = eˣ(cos x - sin x)，y'' = -2eˣsin x",d:"medium"},{q:"求 y = 1/(1+x) 的 n 阶导数",a:"f⁽ⁿ⁾(x) = (-1)ⁿn!/(1+x)ⁿ⁺¹",d:"medium"},{q:"用莱布尼茨公式求 y = x²eˣ 的三阶导数",a:"y''' = x²eˣ + 6xeˣ + 6eˣ = eˣ(x²+6x+6)",d:"hard"}]},

"gaoshu-2-3": {explanation:"隐函数求导：将 y 看作 x 的函数，对方程 F(x,y)=0 两边对 x 求导，解出 y'。参数方程求导：dy/dx = ψ'(t)/φ'(t)。\n\n对数求导法适用于多个函数乘除幂的运算，先取对数再求导可简化计算。二阶导数：d²y/dx² = [φ'(t)ψ''(t)-ψ'(t)φ''(t)]/[φ'(t)]³。\n\n易错点：隐函数求导时不要忘记 y 是 x 的函数，对含 y 的项要用链式法则。",problems:[{q:"求由 eʸ+xy-e=0 确定的 dy/dx",a:"eʸ·y' + y + xy' = 0，解得 y' = -y/(xeʸ+1)",d:"easy"},{q:"用对数求导法求 y = xˣ 的导数",a:"ln y = xln x，y'/y = ln x + 1，故 y' = xˣ(ln x + 1)",d:"medium"},{q:"求 {x=t-sin t, y=1-cos t} 的二阶导数 d²y/dx²",a:"dy/dx = sin t/cos t = tan t，d²y/dx² = (sec²t·cos t)/cos³t = 1/(cos²t·cos t)...需用公式",d:"hard"}]},

"gaoshu-2-4": {explanation:"函数的微分 dy = f'(x)dx 是函数增量的线性主部。可微与可导等价。\n\n一阶微分形式不变性：无论 u 是自变量还是中间变量，dy = f'(u)du 的形式不变。微分在近似计算中有重要应用：f(x₀+Δx) ≈ f(x₀) + f'(x₀)Δx。\n\n误差估计：绝对误差 |Δy| ≈ |f'(x₀)||Δx|，相对误差 ≈ |f'(x₀)/f(x₀)||Δx|。",problems:[{q:"求 y = x³ 在 x=1, dx=0.1 时的微分",a:"dy = 3x²dx = 3×1×0.1 = 0.3",d:"easy"},{q:"利用微分近似计算 ∛65",a:"设 f(x)=x^(1/3)，f(64)=4，f'(x)=1/(3x^(2/3))，∛65 ≈ 4+1/(3×16)×1 = 4+1/48 ≈ 4.0208",d:"medium"},{q:"设 y = e^(sin x²)，求 dy",a:"dy = e^(sin x²)·cos(x²)·2x dx",d:"medium"}]},

"gaoshu-3-0": {explanation:"三个微分中值定理：罗尔定理（$f(a)=f(b)$ 时存在 $\\xi$ 使 $f'(\\xi)=0$）、拉格朗日中值定理（$f'(\\xi)=\\frac{f(b)-f(a)}{b-a}$）、柯西中值定理（参数形式）。\n\n拉格朗日中值定理的几何意义：曲线上存在切线平行于连接两端点的弦。它是罗尔定理的推广，柯西中值定理是拉格朗日中值定理的进一步推广。\n\n中值定理是证明等式和不等式的重要工具，核心思想是构造辅助函数。",problems:[{q:"验证 f(x)=x² 在 [1,3] 上满足拉格朗日中值定理并求 ξ",a:"f'(x)=2x，令 2x=(9-1)/(3-1)=4，得 x=2∈(1,3)，验证成立",d:"easy"},{q:"证明 arcsin x + arccos x = π/2",a:"令 f(x)=arcsin x+arccos x，f'(x)=1/√(1-x²)-1/√(1-x²)=0，故 f(x) 为常数，代入 x=0 得 π/2",d:"hard"},{q:"证明：当 x>0 时，sin x < x",a:"令 f(t)=t-sin t，f(0)=0，f'(t)=1-cos t≥0，故 f(t) 单调递增，当 t>0 时 f(t)>f(0)=0，即 sin x < x",d:"medium"}]},

"gaoshu-3-1": {explanation:"洛必达法则：若 lim f(x)/g(x) 为 0/0 或 ∞/∞ 型，则 lim f/g = lim f'/g'（前提是后者极限存在或为无穷）。\n\n使用条件：(1) 必须是 0/0 或 ∞/∞ 型；(2) 每次使用前需检验仍是未定式；(3) 可多次使用。其他类型（0·∞、∞-∞、0⁰、1^∞、∞⁰）需先转化为 0/0 或 ∞/∞ 型。\n\n结合等价无穷小替换可大幅简化计算。注意：洛必达法则不是万能的，有时反而更复杂。",problems:[{q:"求 lim(x→0) (eˣ-1)/sin x",a:"0/0 型，洛必达：lim eˣ/cos x = 1/1 = 1",d:"easy"},{q:"求 lim(x→+∞) xⁿ/eˣ（n 为正整数）",a:"连续使用洛必达 n 次后得 n!/eˣ → 0",d:"medium"},{q:"求 lim(x→0⁺) x^sin x",a:"令 y = x^sin x，ln y = sin x · ln x = ln x/(1/sin x)→(洛必达)→ -sin²x/x·cos x → 0，故极限 = e⁰ = 1",d:"hard"}]},

"gaoshu-3-2": {explanation:"泰勒公式将函数在某点附近用多项式逼近：f(x) = Σ f⁽ⁿ⁾(a)/n! · (x-a)ⁿ + Rₙ(x)。麦克劳林公式是 a=0 的特例。\n\n常用展开式需熟记：eˣ = Σxⁿ/n!，sin x = Σ(-1)ⁿx²ⁿ⁺¹/(2n+1)!，cos x = Σ(-1)ⁿx²ⁿ/(2n)!，ln(1+x) = Σ(-1)ⁿ⁻¹xⁿ/n。\n\n泰勒公式在求极限（展开后比较系数）、近似计算（截断余项估计误差）、证明不等式等方面有广泛应用。",problems:[{q:"写出 eˣ 的 n 阶麦克劳林公式",a:"eˣ = 1 + x + x²/2! + ... + xⁿ/n! + e^(θx)·xⁿ⁺¹/(n+1)!（0<θ<1）",d:"easy"},{q:"利用泰勒公式求 lim(x→0) [x - ln(1+x)]/x²",a:"ln(1+x) = x - x²/2 + x³/3 - ...，代入得 (x - x + x²/2 - ...)/x² = 1/2",d:"medium"},{q:"求 cos 0.01 的近似值并估计误差",a:"cos x ≈ 1 - x²/2 + x⁴/24，cos 0.01 ≈ 1 - 0.00005 + ... ≈ 0.99995，误差 < x⁶/720 ≈ 1.4×10⁻¹⁵",d:"hard"}]},

"gaoshu-3-3": {explanation:"单调性：f'(x)>0 递增，f'(x)<0 递减。凹凸性：f''(x)>0 下凸（凹），f''(x)<0 上凸（凸）。拐点是凹凸性改变的点。\n\n极值判定：一阶充分条件（导数变号）和二阶充分条件（f'(x₀)=0 时 f''(x₀)>0 为极小值，f''(x₀)<0 为极大值）。\n\n注意：f'(x₀)=0 只是必要条件，驻点不一定是极值点（如 f(x)=x³ 在 x=0 处）。",problems:[{q:"求 f(x)=x³-3x 的单调区间和极值",a:"f'(x)=3x²-3=3(x+1)(x-1)，驻点 x=±1。递增(-∞,-1)∪(1,∞)，递减(-1,1)。极大值 f(-1)=2，极小值 f(1)=-2",d:"medium"},{q:"求 y=x⁴-2x³+1 的拐点",a:"y''=12x²-12x=12x(x-1)，拐点 (0,1) 和 (1,0)",d:"medium"},{q:"证明：若 f''(x₀)>0 且 f'(x₀)=0，则 x₀ 为极小值点",a:"f''(x₀)>0 说明 f' 在 x₀ 附近递增，结合 f'(x₀)=0，左侧 f'<0（递减），右侧 f'>0（递增），故 x₀ 为极小值点",d:"hard"}]},

"gaoshu-3-4": {explanation:"最值问题需比较驻点、不可导点和端点处的函数值。闭区间上连续函数必有最大最小值。\n\n实际应用题的一般步骤：(1) 建立目标函数；(2) 确定定义域；(3) 求导找驻点；(4) 比较得最值。\n\n对于实际问题，如果函数在区间内只有一个驻点，且根据实际意义知最值存在，则该驻点即为最值点，无需检验端点。",problems:[{q:"求 f(x)=x⁴-8x²+2 在 [-1,3] 上的最大值和最小值",a:"驻点 x=0,2（舍去 -2），比较 f(-1)=-5, f(0)=2, f(2)=-14, f(3)=11，最大 11，最小 -14",d:"medium"},{q:"将 8 分成两部分使其立方和最小",a:"设两数为 x 和 8-x，S=x³+(8-x)³，S'=192-48x=0，x=4，S_min=128",d:"medium"},{q:"在半径为 R 的半球内嵌入一个体积最大的长方体，求其尺寸",a:"设底面半边长为 x，高为 √(R²-x²)，V=2x²√(R²-x²)，求导令其为零得 x=√(2/3)R",d:"hard"}]},

"gaoshu-3-5": {explanation:"曲率 K = |y''|/(1+y'²)^(3/2) 描述曲线弯曲程度。曲率半径 R = 1/K。曲率圆（密切圆）与曲线在该点有相同切线、曲率和凹向。\n\n曲率处处为零的曲线是直线，曲率处处相同的曲线是圆。曲率中心的计算公式可由曲线的法线方向得出。\n\n实际应用中，铁路弯道和公路转弯处需要根据曲率设置合适的超高和加宽。",problems:[{q:"求 y=x² 在 (1,1) 处的曲率和曲率半径",a:"y'=2x=2, y''=2, K=2/(1+4)^(3/2)=2/(5√5), R=(5√5)/2",d:"easy"},{q:"求曲线 y=ln x 在何点曲率最大",a:"K(x) = |−1/x²|/(1+1/x²)^(3/2) = x/(1+x²)^(3/2)，求导令其为零得 x=1/√2",d:"hard"}]},

"gaoshu-4-0": {explanation:"若 F'(x)=f(x)，则 F(x) 为 f(x) 的原函数。连续函数必存在原函数（原函数存在定理）。全部原函数 F(x)+C 称为不定积分。\n\n基本积分公式：∫xⁿdx=xⁿ⁺¹/(n+1)+C，∫1/xdx=ln|x|+C，∫eˣdx=eˣ+C，∫cos xdx=sin x+C 等。\n\n不定积分性质：(∫f(x)dx)'=f(x)，∫f'(x)dx=f(x)+C。注意求不定积分后必须加常数 C。",problems:[{q:"求 ∫(x³+1/x²+2ˣ)dx",a:"= x⁴/4 - 1/x + 2ˣ/ln2 + C",d:"easy"},{q:"求 ∫tan²x dx",a:"= ∫(sec²x-1)dx = tan x - x + C",d:"easy"},{q:"求 ∫(eˣ+1/eˣ)² dx",a:"= ∫(e²ˣ+2+e⁻²ˣ)dx = e²ˣ/2 + 2x - e⁻²ˣ/2 + C",d:"medium"}]},

"gaoshu-4-1": {explanation:"第一类换元法（凑微分）：∫f(g(x))g'(x)dx = ∫f(u)du，关键是把被积式凑成 f(g(x))d(g(x)) 的形式。\n\n第二类换元法：令 x=φ(t)，则 ∫f(x)dx = ∫f(φ(t))φ'(t)dt。常用代换：三角代换（含 √(a²-x²)、√(a²+x²)、√(x²-a²)）、倒代换（u=1/x）、根式代换。\n\n凑微分技巧：dx = d(x+c)，xdx = d(x²/2)，eˣdx = d(eˣ) 等。",problems:[{q:"求 ∫x√(1-x²) dx",a:"令 u=1-x²，du=-2xdx，原式 = -1/2 ∫√u du = -1/3(1-x²)^(3/2) + C",d:"medium"},{q:"求 ∫dx/√(a²+x²)",a:"令 x=atan t，原式 = ∫sec t dt = ln|x+√(a²+x²)| + C",d:"hard"},{q:"求 ∫dx/(1+√x)",a:"令 t=√x，x=t²，dx=2tdt，原式 = ∫2t/(1+t)dt = 2t-2ln|1+t|+C = 2√x-2ln(1+√x)+C",d:"medium"}]},

"gaoshu-4-2": {explanation:"分部积分公式：∫udv = uv - ∫vdu。选择 u 和 dv 的原则：v 容易求出，且 ∫vdu 比 ∫udu 更简单。\n\n选 u 的口诀「反对幂三指」：反三角函数 > 对数函数 > 幂函数 > 三角函数 > 指数函数，靠前的做 u。\n\n循环分部积分：当 ∫vdu 中再次出现原积分时，移项解方程。表格法适用于幂函数与指数/三角函数乘积的积分。",problems:[{q:"求 ∫xeˣ dx",a:"u=x, dv=eˣdx, du=dx, v=eˣ, 原式 = xeˣ - eˣ + C = eˣ(x-1) + C",d:"easy"},{q:"求 ∫eˣcos x dx",a:"分部积分两次后出现循环，移项得原式 = eˣ(sin x + cos x)/2 + C",d:"hard"},{q:"求 ∫ln x dx",a:"u=ln x, dv=dx, 原式 = xln x - x + C",d:"easy"}]},

"gaoshu-4-3": {explanation:"有理函数积分的关键是真分式分解为部分分式。步骤：(1) 多项式除法（假分式化真分式）；(2) 分母因式分解；(3) 确定部分分式形式；(4) 待定系数法求参数。\n\n一次因式 (x-a)⁻¹ → A/(x-a)；k 重一次因式 → A₁/(x-a) + ... + Aₖ/(x-a)ᵏ。二次因式 (x²+px+q)⁻¹ → (Bx+C)/(x²+px+q)。\n\n最终归结为 ∫1/(x±a)dx、∫1/(x²+a²)dx、∫(2x+b)/(x²+px+q)dx 等基本类型。",problems:[{q:"求 ∫(x²+1)/(x²-1) dx",a:"= ∫[1+2/(x²-1)]dx = x + ln|(x-1)/(x+1)| + C",d:"medium"},{q:"求 ∫(x⁴+1)/(x²+1) dx",a:"多项式除法得 x²-1+2/(x²+1)，原式 = x³/3-x+2arctan x+C",d:"medium"},{q:"求 ∫dx/(x(x-1)²)",a:"设 1/(x(x-1)²) = A/x + B/(x-1) + C/(x-1)²，解得 A=1, B=-1, C=1，原式 = ln|x|-ln|x-1|-1/(x-1)+C",d:"hard"}]},

"gaoshu-4-4": {explanation:"三角函数有理式积分 ∫R(sin x,cos x)dx 可通过万能代换 t=tan(x/2) 化为有理函数积分：sin x=2t/(1+t²)，cos x=(1-t²)/(1+t²)，dx=2dt/(1+t²)。\n\n但万能代换往往复杂，应优先使用三角恒等变形：降幂公式 sin²x=(1-cos 2x)/2、和差化积、半角公式等。\n\n特殊技巧：被积函数含 sin²x 或 cos²x 时用降幂；含 1±sin x 时用分子分母同乘 1∓sin x。",problems:[{q:"求 ∫sin²x dx",a:"= ∫(1-cos 2x)/2 dx = x/2 - sin 2x/4 + C",d:"easy"},{q:"求 ∫sec x dx",a:"= ∫cos x/cos²x dx = ∫d(sin x)/(1-sin²x) = 1/2 ln|(1+sin x)/(1-sin x)| + C = ln|sec x+tan x|+C",d:"medium"},{q:"求 ∫dx/(2+sin x)",a:"万能代换 t=tan(x/2)，sin x=2t/(1+t²)，dx=2dt/(1+t²)，化简后积分",d:"hard"}]},

"gaoshu-5-0": {explanation:"定积分 ∫ₐᵇf(x)dx 是分割、求和、取极限的结果。几何意义：曲边梯形面积的代数和。\n\n基本性质：线性性、区间可加性、保序性、估值定理 m(b-a)≤∫f≤M(b-a)、积分中值定理。奇偶函数在对称区间上：奇函数积分为 0，偶函数积分为 2 倍正区间积分。\n\n沃利斯公式：∫₀^(π/2) sinⁿx dx 的递推关系。",problems:[{q:"比较 ∫₀¹ x²dx 和 ∫₀¹ x³dx 的大小",a:"在 (0,1) 内 x²>x³，故 ∫x²dx > ∫x³dx",d:"easy"},{q:"求 ∫₋₁¹ x·|x| dx",a:"x·|x| 是奇函数，在对称区间上积分为 0",d:"easy"},{q:"证明积分中值定理",a:"设 m≤f≤M，则 m(b-a)≤∫f≤M(b-a)，由介值定理存在 ξ 使 ∫f = f(ξ)(b-a)",d:"hard"}]},

"gaoshu-5-1": {explanation:"牛顿-莱布尼茨公式：$\\int_a^b f(x)dx = F(b)-F(a)$，其中 $F'(x)=f(x)$。微积分基本定理建立了定积分与不定积分的桥梁。\n\n变上限积分求导：$\\frac{d}{dx}[\\int_a^x f(t)dt] = f(x)$。若上限是复合函数 $x=\\varphi(t)$，则用链式法则。\n\n变上限积分的求导是考研重点题型，需熟练掌握。",problems:[{q:"计算 ∫₀¹ x² dx",a:"= [x³/3]₀¹ = 1/3",d:"easy"},{q:"设 F(x)=∫₀^(x²) e^(-t²) dt，求 F'(x)",a:"= e^(-x⁴) · 2x",d:"medium"},{q:"求 lim(x→0) (∫₀ˣ sin t² dt)/x³",a:"洛必达：= lim cos(x²)·x/(3x²)...直接用等价：sin t²~t²，∫₀ˣ t²dt=x³/3，原式=1/3",d:"hard"}]},

"gaoshu-5-2": {explanation:"定积分换元法：∫ₐᵇf(x)dx = ∫ₐᵝf(φ(t))φ'(t)dt，注意换元必须换限。分部积分：∫ₐᵇudv = [uv]ₐᵇ - ∫ₐᵇvdu。\n\n对称性：奇函数在对称区间积分为 0，偶函数为 2 倍正区间。周期函数 ∫₀ᵀf(x)dx = ∫ₐ^(a+T)f(x)dx。\n\n华里士公式：∫₀^(π/2) sinⁿx dx = ∫₀^(π/2) cosⁿx dx，有递推关系。",problems:[{q:"计算 ∫₀⁴ |x-2| dx",a:"= ∫₀²(2-x)dx + ∫₂⁴(x-2)dx = 2 + 2 = 4",d:"easy"},{q:"计算 ∫₀^(π/2) sin⁵x·cos x dx",a:"令 t=sin x，换限 t∈[0,1]，原式 = ∫₀¹ t⁵dt = 1/6",d:"medium"},{q:"计算 ∫₀^(2π) x·sin x dx",a:"分部积分：u=x, dv=sin x dx，= [-xcos x]₀^(2π) + ∫₀^(2π) cos x dx = -2π + 0 = -2π",d:"medium"}]},

"gaoshu-5-3": {explanation:"反常积分分两类：无穷区间积分 ∫ₐ^(+∞)f(x)dx = lim(b→+∞)∫ₐᵇf(x)dx，和无界函数积分（瑕积分）。\n\n敛散性判断：p-积分 ∫₁^(+∞)1/xᵖdx，p>1 收敛，p≤1 发散。瑕积分 ∫₀¹1/xᵖdx，p<1 收敛，p≥1 发散。\n\n注意：反常积分在计算前应先判断敛散性，不能直接套用牛顿-莱布尼茨公式。",problems:[{q:"判断 ∫₁^(+∞) 1/xᵖ dx 的敛散性",a:"p>1 时收敛于 1/(p-1)；p≤1 时发散",d:"easy"},{q:"计算 ∫₀^(+∞) xe^(-x) dx",a:"= [-xe^(-x)]₀∞ + ∫₀∞ e^(-x)dx = 0 + [-e^(-x)]₀∞ = 1",d:"medium"},{q:"判断 ∫₀¹ 1/√x dx 的敛散性并计算",a:"x=0 为瑕点，p=1/2<1，收敛。∫ = [2√x]₀¹ = 2",d:"medium"}]},

"gaoshu-5-4": {explanation:"审敛法：比较审敛法（与已知敛散的积分比较）、极限审敛法（lim xᵖf(x)=λ 时判断）、比值审敛法。\n\n绝对收敛与条件收敛：若 ∫|f| 收敛则 ∫f 绝对收敛；若 ∫f 收敛但 ∫|f| 发散则条件收敛。绝对收敛的积分可以重排。\n\nΓ 函数：Γ(s) = ∫₀^(+∞) x^(s-1)e^(-x)dx，性质 Γ(s+1)=sΓ(s)，Γ(n)=(n-1)!。",problems:[{q:"判断 ∫₁^(+∞) sin x/x² dx 的敛散性",a:"|sin x/x²| ≤ 1/x²，而 ∫1/x² dx 收敛，故绝对收敛",d:"medium"},{q:"判断 ∫₁^(+∞) 1/(x·lnᵖx) dx 的敛散性",a:"令 u=ln x，化为 ∫₀∞ 1/uᵖ du，p>1 收敛，p≤1 发散",d:"hard"}]},

"gaoshu-6-0": {explanation:"元素法（微元法）是将实际问题转化为定积分的通用方法。步骤：(1) 选取积分变量 x，确定区间 [a,b]；(2) 在 [x, x+dx] 上写出微元 dQ ≈ f(x)dx；(3) 积分得 Q = ∫ₐᵇf(x)dx。\n\n微元的选取原则：以直代曲、以不变代变，误差为高阶无穷小。元素法适用于几何（面积、体积、弧长）和物理（功、压力、引力、质心）问题。",problems:[{q:"用元素法推导圆面积公式",a:"取 x∈[-R,R]，面积微元 dA = 2√(R²-x²)dx，A = ∫ 2√(R²-x²)dx = πR²",d:"medium"},{q:"用元素法推导旋转体体积 V=π∫f²(x)dx",a:"取 x∈[a,b]，体积微元 dV = π[f(x)]²dx（薄片法）",d:"easy"},{q:"推导极坐标下面积公式 A=1/2∫r²dθ",a:"面积微元为扇形微元 dA = 1/2·r²(θ)dθ",d:"medium"}]},

"gaoshu-6-1": {explanation:"几何应用：面积 A=∫|f-g|dx（直角坐标）或 A=1/2∫r²dθ（极坐标）；弧长 s=∫√(1+y'²)dx；旋转体体积 V=π∫f²(x)dx（绕 x 轴）；旋转面面积 A=2π∫y√(1+y'²)dx。\n\n解题关键是正确建立坐标系、确定积分区间、选择合适的积分变量。有时交换积分变量可简化计算。",problems:[{q:"求 y=sin x (0≤x≤π) 绕 x 轴旋转的体积",a:"V = π∫₀π sin²x dx = π·π/2 = π²/2",d:"easy"},{q:"求椭圆 x²/a²+y²/b²=1 的面积",a:"A = 4∫₀ᵃ b√(1-x²/a²)dx = 4ab·(π/4) = πab",d:"medium"},{q:"求心形线 r=a(1+cos θ) 的面积",a:"A = 1/2∫₀^(2π) a²(1+cos θ)²dθ = 3πa²/2",d:"hard"}]},

"gaoshu-6-2": {explanation:"物理应用：变力做功 W=∫F(x)dx；液体压力 p=ρgh，F=∫ρg·h(h)·w(h)dh；引力 F=Gm₁m₂/r²（积分形式）；质心 x̄=∫xρdV/∫ρdV；转动惯量 I=∫r²dm。\n\n解题关键：(1) 建立合适坐标系；(2) 正确写出微元的物理表达式；(3) 确定积分限。",problems:[{q:"弹簧 k=100N/m，拉长 10cm，求弹力做功",a:"W = ∫₀^0.1 100x dx = 50x²|₀^0.1 = 0.5J",d:"easy"},{q:"求均匀半圆弧（半径 R）的质心",a:"由对称性 x̄=0，ȳ=2R/π",d:"medium"},{q:"一半径 R 的半球形容器装满水，求将水全部抽出的功",a:"W = ∫₀ᴿ ρgπ(R²-y²)·y dy = ρgπR⁴/4",d:"hard"}]},

"gaoshu-7-0": {explanation:"微分方程含未知函数及其导数。阶数 = 最高阶导数的阶数。解含独立任意常数个数等于阶数为通解，不含则为特解。初始条件确定常数。\n\n验证解的方法：将函数代入方程检验是否恒等。微分方程的阶数与通解中独立常数的个数必须相同。\n\n建立微分方程是应用的关键：根据实际问题的物理/几何规律建立方程。",problems:[{q:"验证 y=C₁eˣ+C₂e⁻ˣ 是 y''-y=0 的通解",a:"y'=C₁eˣ-C₂e⁻ˣ, y''=C₁eˣ+C₂e⁻ˣ=y，代入成立。含两个独立常数，阶数为2，故为通解",d:"easy"},{q:"求 y'=e^(x+y) 的通解",a:"分离变量：e^(-y)dy = eˣdx，积分得 -e^(-y) = eˣ + C",d:"medium"},{q:"求 y''+4y'+4y=0 满足 y(0)=1, y'(0)=0 的特解",a:"特征方程 r²+4r+4=0, r=-2(重根), y=(C₁+C₂x)e⁻²ˣ, 代入得 y=(1+2x)e⁻²ˣ",d:"hard"}]},

"gaoshu-7-1": {explanation:"可分离变量方程 dy/dx = f(x)g(y)。解法：分离变量 dy/g(y) = f(x)dx，两边积分。\n\n注意：若 g(y₀)=0 则 y=y₀ 也是解（常数解），检验时不能遗漏。分离变量时需 g(y)≠0，最后要检验常数解。",problems:[{q:"求 dy/dx = y/x 的通解",a:"dy/y = dx/x，ln|y| = ln|x|+C，即 y = Cx",d:"easy"},{q:"求 dy/dx = 1+y² 的通解",a:"dy/(1+y²) = dx，arctan y = x+C，即 y = tan(x+C)",d:"easy"},{q:"求 dN/dt = rN(N₀-N) 的通解（阻滞增长模型）",a:"分离变量并积分，得 N = N₀/(1+Ce^(-rN₀t))",d:"hard"}]},

"gaoshu-7-2": {explanation:"齐次方程 dy/dx = f(y/x)。解法：令 u=y/x，则 y=ux，dy/dx = u+x·du/dx，代入得可分离变量方程。\n\n方程 dy/dx = (ax+by+c)/(Ax+By+C) 当 aB-Ab≠0 时可通过平移变换化为齐次方程。",problems:[{q:"求 dy/dx = y/x + tan(y/x) 的通解",a:"令 u=y/x，得 u+x·du/dx = u+tan u，分离变量得 dx/x = cot u du，积分得 ln|x| = ln|sin u|+C",d:"medium"},{q:"求 dy/dx = (x+y)/(x-y) 的通解",a:"令 u=y/x，化简得 x·du/dx = (1+u²)/(1-u)，分离变量积分",d:"hard"}]},

"gaoshu-7-3": {explanation:"一阶线性方程 y'+P(x)y=Q(x)。通解公式：y = e^(-∫Pdx)[∫Qe^(∫Pdx)dx + C]。\n\n齐次方程 (Q=0) 通解 y=Ce^(-∫Pdx)。常数变易法：将 C 换成 u(x)，代入求解。伯努利方程 dy/dx+P(x)y=Q(x)yⁿ 可通过 z=y^(1-n) 化为线性方程。",problems:[{q:"求 y'+y/x = sin x/x 的通解",a:"P=1/x, μ=e^(∫Pdx)=x, y = C/x + (-cos x)/x",d:"medium"},{q:"求 y'+y=eˣ 的通解",a:"y = e^(-x)(e^(2x)/2+C) = eˣ/2+Ce⁻ˣ",d:"easy"},{q:"求伯努利方程 y'+y/x = y² 的通解",a:"令 z=y⁻¹，化为 z'-z/x = -1，解得 z = x(C-ln x)，即 y = 1/[x(C-ln x)]",d:"hard"}]},

"gaoshu-7-4": {explanation:"三类可降阶方程：(1) y''=f(x)：直接积分两次；(2) y''=f(x,y')（不显含 y）：令 p=y'，y''=p'；(3) y''=f(y,y')（不显含 x）：令 p=y'，y''=p·dp/dy。\n\n第三类变换后 p 是 y 的函数，需注意变量转换。降阶法的核心思想是将高阶方程转化为一阶方程。",problems:[{q:"求 y''=xeˣ 的通解",a:"y'=eˣ(x-1)+C₁，y=eˣ(x-2)+C₁x+C₂",d:"easy"},{q:"求 y''=1+y'² 的通解",a:"令 p=y'，p'=1+p²，arctan p=x+C₁，y=-ln|cos(x+C₁)|+C₂",d:"medium"},{q:"求 yy''=y'² 的通解",a:"令 p=y'，y''=p·dp/dy，分离变量得 p=C₁y，即 y=C₂e^(C₁x)",d:"hard"}]},

"gaoshu-7-5": {explanation:"高阶线性方程的解结构：齐次通解 = C₁y₁+C₂y₂（y₁,y₂ 线性无关），非齐次通解 = 齐次通解 + 非齐次特解。\n\n朗斯基行列式 W(y₁,y₂)=y₁y₂'-y₂y₁'，W≠0 时线性无关。常数变易法求特解：设 yₚ=u₁y₁+u₂y₂。\n\n叠加原理：若 y₁ 是 f₁ 的解，y₂ 是 f₂ 的解，则 y₁+y₂ 是 f₁+f₂ 的解。",problems:[{q:"验证 cos x 和 sin x 是 y''+y=0 的线性无关解",a:"代入均成立，W=cos x·cos x-(-sin x)·sin x=1≠0",d:"easy"},{q:"已知 y₁=eˣ 是 (x-1)y''-xy'+y=0 的解，求通解",a:"用降阶法设 y₂=ueˣ，代入得 u'(x-1)eˣ=0...求出 y₂=xeˣ，通解 y=(C₁+C₂x)eˣ",d:"hard"}]},

"gaoshu-7-6": {explanation:"常系数齐次方程 y''+py'+qy=0 的特征方程 r²+pr+q=0。两不等实根 r₁≠r₂：y=(C₁+C₂x)e^(rx)；共轭复根 α±βi：y=e^(αx)(C₁cos βx+C₂sin βx)。\n\nn 阶方程有 n 个特征根，按上述规则组合。求特解可用待定系数法：根据非齐次项的形式设定特解结构，代入求系数。",problems:[{q:"求 y''-3y'+2y=0 的通解",a:"r²-3r+2=0, r₁=1, r₂=2，y=C₁eˣ+C₂e²ˣ",d:"easy"},{q:"求 y''+4y=0 的通解",a:"r²+4=0, r=±2i，y=C₁cos 2x+C₂sin 2x",d:"easy"},{q:"求 y'''-6y''+12y'-8y=0 的通解",a:"(r-2)³=0, r=2(三重根)，y=(C₁+C₂x+C₃x²)e²ˣ",d:"hard"}]},

"gaoshu-8-0": {explanation:"向量 a=(aₓ,aᵧ,a_z) 的模 |a|=√(aₓ²+aᵧ²+a_z²)。加减法遵循平行四边形法则，数乘 λa 使向量伸缩 λ 倍。\n\n方向余弦 cos α=aₓ/|a|，cos β=aᵧ/|a|，cos γ=a_z/|a|，满足 cos²α+cos²β+cos²γ=1。两向量共线 ⟺ a=λb，共面 ⟺ 混合积为零。",problems:[{q:"已知 A(1,2,3), B(3,5,7)，求 AB 和 |AB|",a:"AB=(2,3,4)，|AB|=√(4+9+16)=√29",d:"easy"},{q:"化简 (a+2b)-(3a-b)",a:"= -2a+3b",d:"easy"},{q:"求与向量 a=(1,2,3) 同方向的单位向量",a:"e = a/|a| = (1,2,3)/√14",d:"medium"}]},

"gaoshu-8-1": {explanation:"数量积 a·b=|a||b|cos θ=aₓbₓ+aᵧbᵧ+a_zb_z（标量）。向量积 a×b 模=|a||b|sin θ（向量，方向右手系）。混合积 [a,b,c]=(a×b)·c（标量，绝对值为平行六面体体积）。\n\na·b=0 ⟺ a⊥b，|a×b|=0 ⟺ a∥b，[a,b,c]=0 ⟺ a,b,c 共面。",problems:[{q:"已知 a=(1,2,3), b=(3,0,1)，求 a·b",a:"= 1·3+2·0+3·1 = 6",d:"easy"},{q:"求以 A(1,0,0), B(0,1,0), C(0,0,1) 为顶点的三角形面积",a:"S = 1/2|AB×AC| = 1/2√6 = √6/2",d:"medium"},{q:"已知 |a|=3, |b|=4, 夹角 120°，求 (2a-b)·(a+3b)",a:"= 2a²+5a·b-3b² = 18+5·12·cos120°-48 = 18-30-48 = -60",d:"hard"}]},

"gaoshu-8-2": {explanation:"曲面方程 F(x,y,z)=0。常见曲面：球面 (x-x₀)²+(y-y₀)²+(z-z₀)²=R²；圆柱面 x²+y²=R²；圆锥面 z²=k²(x²+y²)；旋转曲面 f(x,z)=0 绕 z 轴得 f(√(x²+y²),z)=0。\n\n二次曲面：椭球面 x²/a²+y²/b²+z²/c²=1；单叶双曲面；双叶双曲面；椭圆抛物面；双曲抛物面（马鞍面）。",problems:[{q:"求球心(2,-1,3)、半径 5 的球面方程",a:"(x-2)²+(y+1)²+(z-3)² = 25",d:"easy"},{q:"xOz 平面曲线 z=x² 绕 z 轴旋转，求曲面方程",a:"f(x,z)=z-x²=0，旋转得 z = x²+y²",d:"medium"},{q:"指出 x²+y²-z²=1 的名称",a:"单叶双曲面",d:"easy"}]},

"gaoshu-8-3": {explanation:"空间曲线表示：一般式（两曲面交线）、参数式 x=φ(t),y=ψ(t),z=ω(t)。切线方向向量 T=(φ',ψ',ω')。\n\n投影曲线：消去 z 得投影柱面，令 z=0 得 xOy 面投影。注意参数方程和一般式的互化。",problems:[{q:"求螺旋线 {x=cos t, y=sin t, z=t} 在 t=0 处的切线方程",a:"T=(0,1,1)，切线 x/0=(y-1)/1=(z-0)/1",d:"medium"},{q:"求曲线 {x=t², y=1-t, z=t³} 在 t=1 处的切线方程",a:"T=(2,-1,3)，切线 (x-1)/2=(y-0)/(-1)=(z-1)/3",d:"medium"}]},

"gaoshu-8-4": {explanation:"平面一般式 Ax+By+Cz+D=0，法向量 n=(A,B,C)。点面距离 d=|Ax₀+By₀+Cz₀+D|/√(A²+B²+C²)。两平面夹角由法向量夹角决定。\n\n特殊平面：平行于坐标面、过原点、平行于坐标轴等。两平面平行 ⟺ 法向量平行，垂直 ⟺ 法向量垂直。",problems:[{q:"求过点(1,2,3)且法向量(1,0,1)的平面方程",a:"x+z+D=0，代入点得 D=-4，故 x+z-4=0",d:"easy"},{q:"求点(1,2,1)到平面 2x-y+2z+3=0 的距离",a:"d = |2-2+2+3|/√(4+1+4) = 5/3",d:"medium"},{q:"求两平面 x+y+z=6 和 x-y+z=0 的夹角",a:"cos θ = |1-1+1|/(√3·√3) = 1/3，θ = arccos(1/3)",d:"hard"}]},

"gaoshu-8-5": {explanation:"直线表示：一般式（两平面交线）、对称式/点向式 (x-x₀)/m=(y-y₀)/n=(z-z₀)/p、参数式 x=x₀+mt, y=y₀+nt, z=z₀+pt。\n\n直线与平面夹角 sin θ=|Am+Bn+Cp|/(√(A²+B²+C²)·√(m²+n²+p²))。两直线关系由方向向量判断。",problems:[{q:"求过点(1,-1,2)方向向量(2,1,-1)的直线方程",a:"(x-1)/2=(y+1)/1=(z-2)/(-1)",d:"easy"},{q:"判断直线 (x-1)/2=(y+1)/1=(z-1)/3 和 (x+1)/1=(y-2)/(-1)=(z-1)/2 是否异面",a:"s₁=(2,1,3), s₂=(1,-1,2), AB=(-2,3,0), [s₁,s₂,AB]≠0 故异面",d:"hard"}]},

"gaoshu-9-0": {explanation:"多元函数 z=f(x,y) 的定义域是平面上使表达式有意义的点的集合。极限 lim(x,y)→(x₀,y₀) f(x,y)=A 要求沿所有路径趋近都得到 A。\n\n证明极限不存在：找两条不同路径得到不同极限值。常用路径：y=kx、y=x²、x=0 等。连续 ⟺ 极限值等于函数值。",problems:[{q:"求 z=√(4-x²-y²) 的定义域",a:"4-x²-y²≥0，即 x²+y²≤4（单位圆内部含边界）",d:"easy"},{q:"证明 f(x,y)=xy/(x²+y²) 在 (0,0) 极限不存在",a:"沿 y=kx：极限 = k/(1+k²)，随 k 变化，故不存在",d:"medium"},{q:"求 lim(x,y)→(0,0) (x²y)/(x²+y²)",a:"|x²y|/(x²+y²) ≤ |x²y|/x² = |y| → 0，由夹逼准则极限为 0",d:"hard"}]},

"gaoshu-9-1": {explanation:"偏导数 fₓ=∂f/∂x 是对 x 求导（y 视为常数）。几何意义：曲面被 y=y₀ 截得的曲线在 (x₀,y₀) 处的切线斜率。\n\n混合偏导数 fₓᵧ=fᵧₓ 在连续时相等（ Schwarz 定理）。高阶偏导数的计算需逐次求导。\n\n注意：偏导数存在不能保证连续，连续也不能保证偏导数存在。",problems:[{q:"求 z=x⁴y³+sin x 的 fₓ 和 fᵧ",a:"fₓ=4x³y³+cos x, fᵧ=3x⁴y²",d:"easy"},{q:"求 z=e^(xy) 的 ∂²z/∂x∂y",a:"fₓ=ye^(xy), fₓᵧ=e^(xy)+xye^(xy)=(1+xy)e^(xy)",d:"medium"},{q:"设 z=f(x+y, xy)，求 ∂z/∂x",a:"令 u=x+y, v=xy，∂z/∂x=f₁·1+f₂·y=f₁+yf₂",d:"hard"}]},

"gaoshu-9-2": {explanation:"全微分 dz=fₓdx+fᵧdy 是全增量的线性主部。存在条件：偏导数连续。\n\n近似计算：Δz≈dz，即 f(x₀+Δx,y₀+Δy)≈f(x₀,y₀)+fₓΔx+fᵧΔy。误差估计：|Δz|≤|fₓ||Δx|+|fᵧ||Δy|。\n\n全微分形式不变性：无论 x,y 是自变量还是中间变量，dz=fₓdx+fᵧdy 形式不变。",problems:[{q:"求 z=e^(xy) 在 (1,1) 处的全微分",a:"dz = ye^(xy)dx+xe^(xy)dy，在(1,1)处 dz = e(dx+dy)",d:"easy"},{q:"用全微分近似计算 (1.02)^(2.98)",a:"设 z=xʸ, z(1,3)=1, zₓ=3, zᵧ=0，≈1+3×0.02=1.06",d:"medium"}]},

"gaoshu-9-3": {explanation:"链式法则：若 z=f(u,v), u=φ(x,y), v=ψ(x,y)，则 zₓ=f₁·uₓ+f₂·vₓ。全导数：z=f(x,y(x)) 时 dz/dx=fₓ+fᵧ·y'。\n\n关键：根据变量依赖关系画出树形图，每条路径求偏导再相加。",problems:[{q:"设 z=eᵘsin v, u=xy, v=x+y，求 zₓ",a:"zₓ=eᵘsin v·y+eᵘcos v = e^(xy)(ysin(x+y)+cos(x+y))",d:"medium"},{q:"设 z=f(x²-y², y/x)，求 ∂z/∂x",a:"zₓ=2xf₁-f₂·y/x²",d:"medium"}]},

"gaoshu-9-4": {explanation:"隐函数求导公式：F(x,y)=0 时 dy/dx=-Fₓ/Fᵧ；F(x,y,z)=0 时 ∂z/∂x=-Fₓ/F_z, ∂z/∂y=-Fᵧ/F_z。\n\n条件：Fᵧ(x₀,y₀)≠0（或 F_z≠0）保证隐函数存在且可导。",problems:[{q:"设 eᶻ=xyz，求 ∂z/∂x 和 ∂z/∂y",a:"F=eᶻ-xyz, Fₓ=-yz, Fᵧ=-xz, F_z=eᶻ, ∂z/∂x=yz/eᶻ, ∂z/∂y=xz/eᶻ",d:"medium"},{q:"设 x²+y²+z²=4z，求 ∂z/∂x",a:"∂z/∂x=x/(2-z)",d:"easy"}]},

"gaoshu-9-5": {explanation:"曲面 z=f(x,y) 的切平面：fₓ(x-x₀)+fᵧ(y-y₀)-(z-z₀)=0。法向量 (fₓ,fᵧ,-1)。隐式 F(x,y,z)=0 的法向量 (Fₓ,Fᵧ,F_z)。\n\n空间曲线切向量 T=(φ',ψ',ω')，切线方程和法平面方程可由此写出。",problems:[{q:"求 z=x²+y² 在 (1,1,2) 处的切平面",a:"fₓ=2, fᵧ=2, 切平面：2(x-1)+2(y-1)-(z-2)=0，即 2x+2y-z=2",d:"medium"},{q:"求 {x=t, y=t², z=t³} 在 t=1 处的切线",a:"T=(1,2,3)，切线 (x-1)/1=(y-1)/2=(z-1)/3",d:"easy"}]},

"gaoshu-9-6": {explanation:"方向导数 ∂f/∂l=fₓcos α+fᵧcos β（l 为单位向量）。梯度 grad f=(fₓ,fᵧ)，方向为函数增长最快的方向，|grad f| 为最大方向导数。\n\n方向导数与梯度的关系：∂f/∂l=|grad f|cos θ，θ 为 l 与 grad f 的夹角。等值线的法向量即为梯度方向。",problems:[{q:"求 f=x²+y² 在 (1,1) 沿 l=(1/√2,1/√2) 的方向导数",a:"grad f=(2,2)，∂f/∂l=2/√2+2/√2=2√2",d:"easy"},{q:"求 f=ln(x²+y²) 的梯度",a:"grad f=(2x,2y)/(x²+y²)",d:"medium"}]},

"gaoshu-9-7": {explanation:"无条件极值：驻点 fₓ=fᵧ=0，用 AC-B² 判定（A=fₓₓ,B=fₓᵧ,C=fᵧᵧ）。AC-B²>0,A>0 极小；AC-B²>0,A<0 极大；AC-B²<0 非极值。\n\n条件极值：拉格朗日乘数法。构造 L=f+λφ，解 ∇L=0。实际问题中结合实际意义判断最值。",problems:[{q:"求 f(x,y)=x³+y³-3xy 的极值",a:"驻点(0,0)和(1,1)。(0,0)处 AC-B²<0 非极值；(1,1)处 AC-B²>0,A<0 极大值 -1",d:"hard"},{q:"用拉格朗日乘数法求 xy 在 x+y=1 下的极值",a:"L=xy+λ(x+y-1)，解得 x=y=1/2，极小值 1/4",d:"medium"},{q:"求 f(x,y)=x²+y² 在约束 xy=1 下的最小值",a:"L=x²+y²+λ(xy-1)，解得 x=y=±1，最小值 f(1,1)=2",d:"medium"}]},

"gaoshu-10-0": {explanation:"二重积分 ∬_D f(x,y)dσ 是曲顶柱体体积的推广。性质：线性性、可加性、保序性、估值定理、中值定理。\n\n奇偶对称性简化计算。二重积分的几何意义：f≥0 时为曲顶柱体体积。",problems:[{q:"用定义求 ∬_D 1 dσ，D: x²+y²≤R²",a:"结果为圆面积 πR²",d:"easy"},{q:"比较 ∬_D ln(x+y)dσ 与 ∬_D [ln(x+y)]²dσ，D=[3,5]×[1,2]",a:"D 上 ln(x+y)>1，故 [ln(x+y)]²>ln(x+y)，第二个更大",d:"medium"}]},

"gaoshu-10-1": {explanation:"计算方法：直角坐标（先积 y 后积 x 或反之）、极坐标 ∬f(r cosθ, r sinθ)r dr dθ。\n\n选择积分顺序的原则：先积容易的变量；能利用对称性的优先用。交换积分次序需画图确定区域。含 x²+y² 时极坐标更方便。",problems:[{q:"计算 ∬_D xy dσ，D: y=x, y=0, x=1 围成",a:"= ∫₀¹xdx∫₀ˣydy = ∫₀¹x³/2dx = 1/8",d:"easy"},{q:"计算 ∬_D e^(-x²-y²) dσ，D: 1≤x²+y²≤4",a:"极坐标：= ∫₀^(2π)dθ∫₁²e^(-r²)rdr = π(e⁻¹-e⁻⁴)",d:"hard"}]},

"gaoshu-10-2": {explanation:"三重积分计算：直角坐标（投影法/截面法）、柱面坐标 r dr dθ dz（柱形区域）、球面坐标 r²sin φ dr dφ dθ（球形区域）。\n\n柱面坐标适用于含 x²+y²，球面坐标适用于含 x²+y²+z²。",problems:[{q:"计算 ∭_Ω x dV，Ω: 三坐标面与 x+2y+z=2 围成",a:"= ∫₀²dx∫₀^((2-x)/2)dy∫₀^(2-x-2y)x dz = 1/3",d:"medium"},{q:"计算 ∭_Ω (x²+y²) dV，Ω: x²+y²≤1, 0≤z≤2",a:"柱面坐标：= ∫₀^(2π)dθ∫₀¹r³dr∫₀²dz = π",d:"hard"}]},

"gaoshu-10-3": {explanation:"应用：曲面面积 A=∬√(1+fₓ²+fᵧ²)dσ，质心 x̄=∭xρdV/∭ρdV，转动惯量 I=∭r²ρdV。\n\n利用对称性简化计算。均匀物体的质心和转动惯量是常见考点。",problems:[{q:"求球面 x²+y²+z²=a² 的面积",a:"A = 4πa²（直接用公式）",d:"easy"},{q:"求均匀半球体的质心（设密度为1）",a:"由对称性 x̄=ȳ=0，ẑ=3a/8",d:"medium"}]},

"gaoshu-11-0": {explanation:"第一类曲线积分 ∫_L f ds，与路径方向无关。参数方程：∫ₐᵝf(φ(t),ψ(t))√(φ'²+ψ'²)dt。\n\n用于求曲线形构件的质量、质心等。ds 是弧长微元。",problems:[{q:"计算 ∫_L x ds，L 为圆 x²+y²=a²",a:"x=acos θ, y=asin θ, ds=adθ, ∫₀^(2π)acos θ·adθ=0",d:"easy"},{q:"求 y=x² 从 (0,0) 到 (1,1) 的弧长",a:"s=∫₀¹√(1+4x²)dx = [√2/4+ln(2+√2)/4]/2...",d:"hard"}]},

"gaoshu-11-1": {explanation:"第二类曲线积分 ∫_L Pdx+Qdy，与路径方向有关（反向变号）。与路径无关的条件：∂P/∂y=∂Q/∂x 且区域单连通。\n\n计算方法：直接代入参数方程，或利用格林公式，或选择更简单的路径。",problems:[{q:"计算 ∫_L y²dx+xdy，L: (0,0) 到 (1,1) 直线段",a:"y=x, dy=dx, = ∫₀¹(x²+x)dx = 5/6",d:"easy"},{q:"验证 ∫_L (2xcos y+y²)dx+(2ysin x-x²)dy 与路径无关",a:"∂P/∂y=-2xsin y+2y, ∂Q/∂x=2ycos x-2x，不一定相等",d:"hard"}]},

"gaoshu-11-2": {explanation:"格林公式 ∮_L Pdx+Qdy = ∬_D(∂Q/∂x-∂P/∂y)dσ。要求 L 是 D 的正向边界（区域在左侧）。\n\n用于求面积 A=1/2∮(xdy-ydx)，简化闭曲线积分，判断积分与路径无关。含奇点时需挖去小圆。",problems:[{q:"用格林公式计算 ∮_L xdy-ydx，L 为单位圆正向",a:"= ∬(1-(-1))dσ = 2πR² = 2π",d:"medium"},{q:"计算 ∮_L (x²-y)dx+(x+y²)dy，L: x²+y²=R² 正向",a:"∂Q/∂x-∂P/∂y = 1-(-1) = 2，= 2πR²",d:"medium"}]},

"gaoshu-11-3": {explanation:"第一类曲面积分 ∬_S f dS，与侧向无关。dS=√(1+zₓ²+zᵧ²)dxdy。\n\n用于求曲面面积、曲面质量等。选择投影面使计算简化。",problems:[{q:"计算 ∬_S z dS，S: x+y+z=1 第一卦限部分",a:"dS=√3 dσ，= √3∫₀¹dx∫₀^(1-x)(1-x-y)dy = √3/6",d:"medium"},{q:"计算 ∬_S (x²+y²) dS，S: 锥面 z=√(x²+y²) 被 z=1 截",a:"dS=√2 dσ，= √2∫₀^(2π)dθ∫₀¹r³dr = √2·π/2",d:"hard"}]},

"gaoshu-11-4": {explanation:"第二类曲面积分 ∬_S Pdydz+Qdzdx+Rdxdy，与侧向有关（换侧变号）。投影法：上侧取正，下侧取负。\n\n物理意义：流量、磁通量。高斯公式将闭曲面积分转化为三重积分。",problems:[{q:"计算 ∬_S z dxdy，S: x²+y²+z²=R² 外侧",a:"上球 + 下球，= 4πR³/3",d:"medium"},{q:"计算 ∬_S x dydz+y dzdx+z dxdy，S: x/a+y/b+z/c=1 第一卦限",a:"三个投影积分分别计算",d:"hard"}]},

"gaoshu-11-5": {explanation:"高斯公式 ∯_S Pdydz+Qdzdx+Rdxdy = ∭(∂P/∂x+∂Q/∂y+∂R/∂z)dV。斯托克斯公式 ∮_L Pdx+Qdy+Rdz = ∬_S curl F · dS。\n\n高斯公式用于闭曲面，不封闭时加辅助面。散度 div F=∇·F，旋度 curl F=∇×F。",problems:[{q:"用高斯公式计算 ∯_S x³dydz+y³dzdx+z³dxdy，S: x²+y²+z²=a² 外侧",a:"div = 3(x²+y²+z²)，∭3r²dV = 3·4πa⁵/5 = 12πa⁵/5",d:"hard"},{q:"计算 ∯_S yzdydz+xzdzdx+xydxdy，S: x²+y²+z²=1 外侧",a:"div = 0+0+0 = 0，积分 = 0",d:"easy"}]},

"gaoshu-12-0": {explanation:"级数 Σuₙ 的部分和 Sₙ=Σ(i=1~n)uᵢ，若 lim Sₙ=S 存在则收敛于 S。\n\n性质：收敛 ⟹ uₙ→0（必要条件但非充分，如调和级数）；收敛级数加括号仍收敛；Σuₙ收敛且 Σvₙ发散 ⟹ Σ(uₙ±vₙ)发散。",problems:[{q:"判断 Σ 1/(n(n+1)) 的敛散性",a:"Sₙ = 1-1/(n+1)→1，收敛，和为 1",d:"easy"},{q:"判断 Σ n/(n+1) 的敛散性",a:"uₙ→1≠0，发散",d:"easy"}]},

"gaoshu-12-1": {explanation:"正项级数审敛法：比较法、比值法（lim uₙ₊₁/uₙ=ρ, ρ<1 收敛）、根值法（lim ⁿ√uₙ=ρ）、积分法。\n\np-级数 Σ1/nᵖ：p>1 收敛，p≤1 发散。等比级数 Σaqⁿ：|q|<1 收敛于 a/(1-q)。\n\n选择审敛法的原则：含阶乘/幂次用比值法，含 n 次幂用根值法，可积函数用积分法。",problems:[{q:"判断 Σ n/2ⁿ 的敛散性",a:"lim uₙ₊₁/uₙ = 1/2 < 1，收敛",d:"easy"},{q:"判断 Σ 1/(n²+1) 的敛散性",a:"1/(n²+1) < 1/n²，Σ1/n² 收敛，故收敛",d:"easy"},{q:"判断 Σ (n!)²/(2n)! 的敛散性",a:"比值法：uₙ₊₁/uₙ = (n+1)²/((2n+2)(2n+1)) → 1/4 < 1，收敛",d:"hard"}]},

"gaoshu-12-2": {explanation:"交错级数 Σ(-1)ⁿuₙ (uₙ>0)。莱布尼茨定理：{uₙ} 递减且 →0 则收敛。\n\n绝对收敛 ⟺ Σ|uₙ| 收敛；条件收敛 ⟺ Σuₙ 收敛但 Σ|uₙ| 发散。绝对收敛级数可任意重排，条件收敛则不能。",problems:[{q:"判断 Σ (-1)ⁿ/n 的敛散性",a:"1/n 递减→0，莱布尼茨定理得收敛；Σ1/n 发散，故条件收敛",d:"medium"},{q:"判断 Σ (-1)ⁿ/n² 的敛散性",a:"Σ1/n² 收敛，故绝对收敛",d:"easy"}]},

"gaoshu-12-3": {explanation:"幂级数 Σaₙ(x-x₀)ⁿ 的收敛半径 R=lim|aₙ/aₙ₊₁|。收敛区间 (x₀-R, x₀+R)，需单独检验端点。\n\n阿贝尔定理：在收敛点绝对收敛。幂级数在收敛域内可逐项求导、积分（收敛半径不变）。",problems:[{q:"求 Σ xⁿ/n 的收敛域",a:"R=lim n/(n+1)=1，收敛区间(-1,1)。x=1: Σ1/n 发散；x=-1: Σ(-1)ⁿ/n 收敛。收敛域 [-1,1)",d:"medium"},{q:"求 Σ n!xⁿ 的收敛半径",a:"R=lim 1/((n+1)!)→0，仅 x=0 处收敛",d:"medium"}]},

"gaoshu-12-4": {explanation:"间接展开法：利用已知展开式通过变量代换、四则运算、逐项积分/求导得到新展开式。\n\n常用展开式：eˣ, sin x, cos x, ln(1+x), 1/(1-x), arctan x, (1+x)ᵅ。展开时务必注明收敛域。",problems:[{q:"将 f(x)=eˣ 展开为 x 的幂级数",a:"eˣ = 1+x+x²/2!+...+xⁿ/n!+...，收敛域 (-∞,+∞)",d:"easy"},{q:"将 f(x)=ln(1+x) 展开为幂级数",a:"= x-x²/2+x³/3-...+(-1)ⁿ⁻¹xⁿ/n+...，收敛域 (-1,1]",d:"medium"},{q:"将 sin²x 展开为幂级数",a:"= (1-cos2x)/2 = 1/2 - Σ(-1)ⁿ2²ⁿ⁻¹x²ⁿ/(2n)!，收敛域 (-∞,+∞)",d:"hard"}]},

"gaoshu-12-5": {explanation:"傅里叶级数将周期函数展开为三角函数之和。周期 2l 的函数：f(x)=a₀/2+Σ(aₙcos nπx/l+bₙsin nπx/l)。\n\n系数公式：aₙ=(1/l)∫₋ₗˡf(x)cos(nπx/l)dx, bₙ=(1/l)∫₋ₗˡf(x)sin(nπx/l)dx。\n\n奇函数只含正弦项，偶函数只含余弦项。在间断点级数收敛于左右极限的平均值。帕塞瓦尔等式联系了函数与系数的能量关系。",problems:[{q:"将 f(x)=x(-π<x<π) 展开为傅里叶级数",a:"奇函数 aₙ=0，bₙ=(-1)ⁿ⁺¹·2/n，f(x)=2Σ(-1)ⁿ⁺¹sin(nx)/n",d:"hard"},{q:"将 f(x)=x²(-π≤x≤π) 展开为傅里叶级数",a:"偶函数 bₙ=0，a₀=2π²/3，aₙ=(-1)ⁿ·4/n²，f(x)=π²/3+4Σ(-1)ⁿcos(nx)/n²",d:"hard"},{q:"将 f(x)=|x|(-π≤x≤π) 展开为傅里叶级数",a:"偶函数，a₀=π，a₂ₙ₋₁=0，a₂ₙ=-4/(π(2n)²)，f(x)=π/2-4/πΣcos(2nx)/(2n)²",d:"medium"}]},

  "la-1-0":{explanation:"二阶行列式：|a b; c d| = ad-bc。三阶：实线方向三乘积之和减虚线方向三乘积之和。行列式是数值而非矩阵，几何意义为有向面积/体积。对角线法则仅适用于二三阶！",problems:[{q:"计算 |2 3; 5 7|",a:"2*7-3*5 = 14-15 = -1",d:"easy"},{q:"按对角线法计算3阶 |1 0 2; 3 1 0; 2 1 1|",a:"=1*1*1+0*0*2+2*3*1-2*1*2-0*3*1-1*0*1=1+0+6-4-0-0=3",d:"medium"},{q:"证明 |a b; c d|=0 当且仅当两行成比例",a:"ad-bc=0 => (a,b)与(c,d)共线，存在k使(a,b)=k(c,d)或反",d:"medium"},{q:"计算 |3 1 0; -1 2 5; 0 4 -2| 的值",a:"按第一行展开 = 3*(-24) - 1*2 + 0 = -74",d:"medium"},{q:"计算 |1 2; 3 4| 的值",a:"1*4 - 2*3 = -2",d:"easy"},{q:"三阶行列式 |1 0 0; 0 2 0; 0 0 3| 的值是多少?为什么?",a:"6。这是对角矩阵，行列式=主对角线元素之积",d:"easy"}]},
  "la-1-1":{explanation:"排列逆序数tau是排列中前面大于后面的数对个数。对换改变排列奇偶性。n元排列n!个，奇偶各半(n>=2)。行列式各项符号由列标排列的逆序数决定: (-1)^tau。",problems:[{q:"求排列32514的逆序数",a:"3后:2,1(2个); 2后:1(1个); 5后:1,4(2个); 共2+1+2=5。tau=5",d:"easy"},{q:"证明对换改变排列的奇偶性",a:"相邻对换翻转一组逆序关系，奇偶性改变。一般对换通过奇数个相邻对换实现",d:"hard"},{q:"排列1,3,5,...,2n-1,2,4,...,2n的逆序数?",a:"每个奇数大于其后所有偶数。总逆序数=n(n+1)/2",d:"hard"},{q:"判断 6 元排列 243615 的逆序数并指出奇偶性",a:"逆序对: 24/21, 43/41/45, 36/35/31, 65/61, 15 共10个,偶排列",d:"medium"},{q:"求13 5427689的逆序数",a:"逐个统计: 1后无,3后无,5后42(2),4后2(1),2后无,7后无,6后无,8后无,9后无。共3个",d:"medium"},{q:"证明对换改变排列的奇偶性",a:"相邻对换: 翻转一组逆序关系, 奇偶性改变。一般对换=奇数个相邻对换, 故改变",d:"hard"}]},
  "la-1-2":{explanation:"n阶行列式定义为所有取自不同行不同列的n个元素乘积的代数和: D=sum(-1)^tau * a1p1*a2p2*...*anpn，共n!项。主对角线项符号为正(自然序)。上/下三角行列式=主对角元素之乘积。",problems:[{q:"4阶行列式共有多少项?",a:"共4!=24项，n>=2时正负各半(12项正、12项负)",d:"easy"},{q:"对角行列式diag(a1,...,an)的值?",a:"=a1*a2*...*an。仅自然序一项非零，符号为正",d:"easy"},{q:"a12*a23*a31项的符号?",a:"列标排列(2,3,1)，tau=2，符号(-1)^2=+1，该项为正",d:"medium"},{q:"5阶行列式共有多少项?其中正项多少?",a:"n!=5!=120项,正负各60项",d:"easy"},{q:"行列式等于零的充分必要条件是?",a:"行向量线性相关(或列向量线性相关)",d:"medium"},{q:"上三角行列式的值等于?",a:"主对角线元素之乘积",d:"easy"}]},
  "la-1-3":{explanation:"六大性质: (1)D=D^T; (2)互换两行变号; (3)全零行为0; (4)两行成比例/相等为0; (5)某行乘k则D乘k; (6)倍加变换不变。性质(6)是化简核心工具，将行列式化为三角型则主对角元乘积即值。口诀: 转置等，互换变，提公因，倍加不变。",problems:[{q:"已知D=5，互换第1行和第3行得到D'=?",a:"D'=-5(互换两行使行列式变号)",d:"easy"},{q:"计算|a b c; a+k b+k c+k; a+2k b+2k c+2k|",a:"r3-r2得(k,k,k),r2-r1也得(k,k,k)，两行成比例，行列式为0",d:"medium"},{q:"证明若A可逆则|A|不等于0",a:"若|A|=0，行向量相关，存在非零x使Ax=0，A不可逆。逆否命题:A可逆=>|A|不等于0",d:"hard"},{q:"已知 D=5, 求 |a21 a22 a23; 2a11 2a12 2a13; a31 a32 a33|",a:"r1与r2交换变号且r1乘2 => 2*(-D) = -10",d:"medium"},{q:"kA的行列式等于k^n|A|, 这里的n是什么?",a:"矩阵A的阶数(行数=列数)",d:"easy"},{q:"若|A|=2, 互换第1行和第2行后行列式为?",a:"-2（对换两行使行列式变号）",d:"easy"}]},
  "la-1-4":{explanation:"余子式Mij:划去第i行第j列后剩下的(n-1)阶行列式。代数余子式Aij=(-1)^(i+j)*Mij。拉普拉斯展开:D=sum(aij*Aij)按任一行/列。范德蒙德行列式=prod(xj-xi) 1<=i<j<=n。",problems:[{q:"|1 0 3; 2 1 0; 0 2 1|按第1列展开",a:"=1*A11+2*A21+0*31 = 1*1+2*(-6) = 1-12 = -11",d:"medium"},{q:"证明a_i1*A_j1+...+a_in*A_jn=0 (i!=j)",a:"把第j行换成第i行，有两行相同故为0，按第j行展开即得结论",d:"hard"},{q:"范德蒙德行列式|1 1 1; x1 x2 x3; x1^2 x2^2 x3^2|公式?",a:"= (x2-x1)(x3-x1)(x3-x2)",d:"medium"},{q:"证明 n+1 阶范德蒙德行列式 V = Π_{1<=i<j<=n+1}(xj-xi)",a:"数学归纳法:n=2成立;按最后一列展开递推",d:"hard"},{q:"代数余子式 Aij 和余子式 Mij 的关系?",a:"Aij = (-1)^(i+j) * Mij",d:"easy"},{q:"按第二列展开 |1 2 3; 4 5 6; 7 8 10| 需几个代数余子式?",a:"3个: A12, A22, A32",d:"medium"}]},
  "la-1-5":{explanation:"克拉默法则: Ax=b且|A|!=0时有唯一解xi=Di/D，Di为第i列替换为b所得行列式。对齐次方程组Ax=0，有非零解的充要条件为|A|=0。注意仅适用于方阵且需计算n+1个行列式。",problems:[{q:"用Cramer法则解{2x+y=5, x+3y=7}",a:"D=|2,1;1,3|=5, Dx=|5,1;7,3|=8, Dy=|2,5;1,7|=9 => x=8/5, y=9/5",d:"easy"},{q:"齐次方程组有非零解时系数行列式=?",a:"等于0。这是充要条件(Cramer法则推论)",d:"easy"},{q:"ax+by+cz=0,bx+ay+cz=0,cx+by+az=0有非零解(a,b,c互异)，求关系",a:"系数行列式为0 => (a+b+c)(a-b)(b-c)(c-a)=0，因互异 => a+b+c=0",d:"hard"},{q:"用克拉默法则解:x1+2x2+3x3=6, 2x1+3x2+x3=4, 3x1+x2+2x3=7",a:"D=0,无唯一解",d:"hard"},{q:"克拉默法则适用于什么条件?",a:"系数矩阵是方阵且行列式非零(有唯一解)",d:"easy"},{q:"齐次方程组有非零解的充要条件?",a:"系数矩阵行列式为零",d:"easy"}]},
  "la-2-0":{explanation:"矩阵是m*n数表A=(aij)。零矩阵O全0; 单位矩阵I主对角1; 对角矩阵; 对称矩阵A=A^T; 反对称A=-A^T(主对角必为0)。矩阵是数表而非常数，这是与行列式的根本区别。矩阵相等需同型且所有对应元素相等。",problems:[{q:"写出3阶单位矩阵",a:"I3 = diag(1,1,1) 主对角全1其余全0",d:"easy"},{q:"对称矩阵和反对称矩阵主对角线各有何特征?",a:"对称无特殊要求; 反对称主对角线必全为0 (因aii=-aii => aii=0)",d:"easy"},{q:"若A为反对称阵，证明I+A可逆",a:"(I+A)x=0 => Ax=-x。x^TAx=0且=-||x||^2，故x=0 => I+A可逆",d:"hard"},{q:"写出 3x4 矩阵 [[1,2,3,4],[5,6,7,8],[9,10,11,12]] 的转置",a:"A^T是4x3矩阵",d:"easy"},{q:"什么是转置矩阵?",a:"将矩阵的行变为列(或列变为行), 记作A^T",d:"easy"},{q:"写出3阶单位矩阵",a:"diag(1,1,1): 对角线全1, 其余全0",d:"easy"}]},
  "la-2-1":{explanation:"矩阵加减: 同型矩阵对应元素相加减。数乘: kA=(k*aij)。满足k(A+B)=kA+kB、(k+l)A=kA+lA。矩阵加减法和数乘构成线性运算，全体m*n矩阵构成向量空间。注意矩阵乘法AB一般不等于BA!分配律A(B+C)=AB+AC成立。",problems:[{q:"计算 2*[[1,0],[2,3]] + 3*[[0,1],[1,0]]",a:"=[[2,0],[4,6]]+[[0,3],[3,0]]=[[2,3],[7,6]]",d:"easy"},{q:"若A+B=A，能否得出B=O?",a:"能。(A+B)-A=A-A => B=O。注意: AB=A推不出B=I(除非A可逆)",d:"medium"},{q:"证明tr(A+B)=tr(A)+tr(B), tr(kA)=k*tr(A)",a:"tr(A+B)=sum(aii+bii)=sum(aii)+sum(bii)=tr(A)+tr(B); tr(kA)=sum(k*aii)=k*tr(A)",d:"medium"},{q:"设 A=[[1,2],[3,4]], 求 A+A^T",a:"[[2,5],[5,8]]",d:"easy"},{q:"什么是数乘矩阵? kA中每个元素如何变化?",a:"每个元素均乘以k: (kA)ij = k·aij",d:"easy"},{q:"A-B等于A+?",a:"A + (-B)",d:"easy"}]},
  "la-2-2":{explanation:"矩阵乘法: C=AB, Cij=sum(aik*bkj)。C的ij = A的第i行与B的第j列对应乘求和。结合律(AB)C=A(BC); 分配律; AI=IA=A。关键BUG: AB!=BA(一般不交换)! AB=AC不能推B=C(除非A可逆)!",problems:[{q:"计算[[1,2],[3,4]] * [[0,1],[1,0]]",a:"=[[2,1],[4,3]]。左乘交换了两列",d:"easy"},{q:"举一个AB!=BA的例子",a:"A=[[0,1],[0,0]], B=[[0,0],[1,0]]。AB=[[1,0],[0,0]], BA=[[0,0],[0,1]]",d:"medium"},{q:"若AB=0，是否A=0或B=0?",a:"不一定。如A=[[1,0],[0,0]], B=[[0,0],[0,1]]，AB=0但都非零。矩阵乘法有零因子",d:"medium"},{q:"计算 [[1,2],[3,4]]^2 = AA",a:"[[7,10],[15,22]]",d:"medium"},{q:"矩阵乘法不满足什么律?",a:"交换律(AB = BA一般不对)",d:"easy"},{q:"若A是m×n矩阵, B是n×m矩阵, AB的阶数是?",a:"m×m",d:"medium"}]},
  "la-2-3":{explanation:"转置:(A^T)ij=Aji。性质:(A^T)^T=A; (A+B)^T=A^T+B^T; (kA)^T=kA^T; (AB)^T=B^T A^T(顺序反转!)对称矩阵A^T=A。对任意A，AA^T和A^TA都是对称的。",problems:[{q:"证明(AB)^T = B^T A^T",a:"(AB)^T_ij = (AB)_ji = sum(ajk*bki) = sum((A^T)kj*(B^T)ik) = sum((B^T)ik*(A^T)kj) = (B^T A^T)ij",d:"hard"},{q:"验证AA^T是对称矩阵",a:"(AA^T)^T = (A^T)^T A^T = AA^T，故对称",d:"medium"},{q:"若A^T=-A，证明当n为奇数时|A|=0",a:"|A|=|A^T|=|-A|=(-1)^n|A|。n奇 => |A|=-|A| => |A|=0",d:"hard"},{q:"(A^T)^{-1} 用 A^{-1} 怎么表示?",a:"(A^T)^{-1} = (A^{-1})^T",d:"medium"},{q:"转置矩阵的行列式与原矩阵的关系?",a:"|A^T| = |A|",d:"easy"},{q:"(A+B)^T = ?",a:"A^T + B^T",d:"easy"}]},
  "la-2-4":{explanation:"方阵行列式: |A^T|=|A|; |kA|=k^n*|A|(n为阶); |AB|=|A||B|。伴随矩阵A*: (A*)ij=Aji(第i行第j列为原矩阵第j行第i列的代数余子式)。重要关系: AA*=A*A=|A|I。这是逆矩阵公式的基础。",problems:[{q:"若A为3阶方阵且|A|=2，求|2A|",a:"|2A| = 2^3 * |A| = 8*2 = 16",d:"easy"},{q:"已知|A|=3,|B|=2，求|AB|和|BA|",a:"|AB|=|A||B|=3*2=6。同理|BA|=|B||A|=6",d:"easy"},{q:"求2阶方阵[[a,b],[c,d]]的伴随矩阵",a:"A* = [[d,-b],[-c,a]]。主对角交换，副对角变号",d:"medium"},{q:"若 |A|=2,|B|=3, 求 |A^T·B^{-1}·A|",a:"|A|·(1/|B|)·|A| = 4/3",d:"hard"},{q:"|AB|和|A||B|有什么关系?",a:"相等: |AB| = |A|·|B|",d:"easy"},{q:"|A^-1|和|A|的关系?",a:"|A^-1| = 1/|A|",d:"medium"}]},
  "la-2-5":{explanation:"逆矩阵: 若AB=BA=I则B=A^-1唯一。求法一(伴随矩阵法): A^-1=A*/|A| (需|A|!=0)。性质:(A^-1)^-1=A;(AB)^-1=B^-1 A^-1;(A^T)^-1=(A^-1)^T;|A^-1|=1/|A|。二阶特例:[[a,b],[c,d]]^-1=1/(ad-bc)*[[d,-b],[-c,a]]。",problems:[{q:"判断[[1,2],[3,6]]是否可逆",a:"行列式=6-6=0，矩阵不可逆(奇异矩阵)",d:"easy"},{q:"求[[3,2],[2,1]]^-1",a:"|A|=3-4=-1，A^-1=-[[1,-2],[-2,3]]=[[-1,2],[2,-3]]",d:"medium"},{q:"证明(AB)^-1 = B^-1 A^-1",a:"(B^-1 A^-1)(AB)=B^-1(A^-1 A)B = B^-1 I B = I，同理(AB)(B^-1 A^-1)=I",d:"medium"},{q:"求 A=[[1,2],[3,4]] 的逆矩阵",a:"A^{-1}=[[-2,1],[1.5,-0.5]]",d:"medium"},{q:"什么样的方阵可逆?",a:"行列式不为零(即满秩)",d:"easy"},{q:"(AB)^-1 = ?",a:"B^-1·A^-1 (注意顺序反过来)",d:"medium"}]},
  "la-2-6":{explanation:"矩阵分块: 用虚线分割为若干子矩阵，把子块当元素运算(规则同普通矩阵)。分块对角阵行列式=各主对角块行列式之积; 逆=各块分别求逆。按行分块(每行为行向量)和按列分块(每列为列向量)在线性方程组和线性变换中极有用。",problems:[{q:"分块对角阵A=[[B,O],[O,C]]求A^-1",a:"A^-1=[[B^-1,O],[O,C^-1]](需B,C均可逆)",d:"medium"},{q:"若A按列分为[A1|A2|...|An]，Ax=b写成列向量组合?",a:"Ax = x1*A1 + x2*A2 + ... + xn*An = b。即b是A的列向量的线性组合",d:"medium"},{q:"分块矩阵乘法的条件?",a:"左矩阵列的分法与右矩阵行的分法一致(对应子块可乘)，且同行/列块尺寸需匹配",d:"hard"},{q:"分块对角阵 A=diag(B,C), 求 |A| 和 A^{-1}",a:"|A|=|B|·|C|, A^{-1}=diag(B^{-1},C^{-1})",d:"medium"},{q:"分块对角阵求逆和普通矩阵有何不同?",a:"各主对角块分别求逆即可: diag(A,B)^-1 = diag(A^-1, B^-1)",d:"medium"},{q:"分块矩阵乘法条件?",a:"左矩阵列分法与右矩阵行分法一致, 且对应块尺寸可乘",d:"hard"}]},
  "la-3-0":{explanation:"三种初等行变换:(1)互换两行ri<->rj;(2)某行乘非零常数ri*k;(3)某行k倍加到另一行rj+k*ri。行阶梯形:每行第一个非零元(主元)列号递增，全零行在底。行最简形:在阶梯形基础上每主元=1且主元列其余全0。任何非零矩阵可唯一化为行最简形(高斯-若尔当基)。",problems:[{q:"将[[1,2,3],[2,4,6]]化为行阶梯形",a:"r2-2r1得[[1,2,3],[0,0,0]]。已是行阶梯形",d:"easy"},{q:"将3阶矩阵化为行最简形",a:"r2-2r1,r3-r1可逐步化简到[[1,0,-1],[0,1,2],[0,0,0]]",d:"medium"},{q:"行最简形一定是行阶梯形吗?反呢?",a:"行最简形一定是行阶梯形(条件更严)。反不成立(主元不为1或主元上不全0)",d:"easy"},{q:"用初等行变换化 [[2,1,-1],[1,-1,2],[3,3,1]] 为行阶梯形",a:"逐步消元得 [[1,-1,2],[0,3,-5],[0,0,5]]",d:"medium"},{q:"三种初等行变换分别是什么?",a:"互换两行, 某行乘非零常数, 某行k倍加到另一行",d:"easy"},{q:"行阶梯形矩阵必须满足什么条件?",a:"每行第一个非零元(主元)列号递增, 全零行在底部",d:"medium"}]},
  "la-3-1":{explanation:"初等矩阵是单位矩阵经一次初等变换所得:(1)E(i,j)互换;(2)E(i(k))第i行乘k;(3)E(ij(k))第j行k倍加到第i行。核心:左乘=行变换，右乘=列变换。初等矩阵均可逆，逆仍为初等矩阵。可逆矩阵可分解为若干初等矩阵之积。",problems:[{q:"E(2,3)A和AE(2,3)分别对应什么操作?",a:"E(2,3)A:交换A的第2行第3行; AE(2,3):交换A的第2列第3列",d:"easy"},{q:"求3阶E(3,1(2))",a:"[[1,0,0],[0,1,0],[2,0,1]]。第3行第1列为2，余同单位阵",d:"medium"},{q:"证明可逆矩阵可分解为初等矩阵之积",a:"A可逆=>行变换化为I=>Pk...P1A=I=>A=P1^-1...Pk^-1。初等矩阵的逆也是初等=>A=初等矩阵乘积",d:"hard"},{q:"把第2行的3倍加到第1行的初等矩阵 E?",a:"E=[[1,3,0],[0,1,0],[0,0,1]]",d:"medium"},{q:"初等矩阵右乘表示什么操作?",a:"列变换(而左乘是行变换)",d:"medium"},{q:"初等矩阵可逆吗?",a:"可逆(因为初等变换均可逆)",d:"easy"}]},
  "la-3-2":{explanation:"矩阵秩r(A)是非零子式的最高阶数。求法:初等变换化行阶梯形，秩=非零行数。性质:0<=r(Am*n)<=min(m,n); r(A^T)=r(A); r(AB)<=min(r(A),r(B)); 若P,Q可逆则r(PAQ)=r(A)。满秩(r=n)时可逆；降秩(r<n)时不可逆(奇异)。",problems:[{q:"求[[1,2,3],[2,4,6],[1,1,1]]的秩",a:"r2-2r1,r3-r1得阶梯形，非零行2条，秩=2",d:"medium"},{q:"若A可逆(n阶方阵)，r(A)=?",a:"r(A)=n。可逆矩阵是满秩矩阵",d:"easy"},{q:"证明r(A+B) <= r(A)+r(B)",a:"A+B列向量可由A和B列向量并集线性表出，秩不超过并集秩，而并秩<=r(A)+r(B)",d:"hard"},{q:"求 [[1,2,3],[2,4,6],[1,2,3]] 的秩",a:"r2-2r1和r3-r1,秩=1",d:"medium"},{q:"满秩和可逆是什么关系?",a:"等价的: A满秩⇔A可逆⇔|A|≠0",d:"easy"},{q:"若A是3×5矩阵, 秩最大为多少?",a:"3 (秩不能超过行数和列数中较小者)",d:"medium"}]},
  "la-3-3":{explanation:"有解判定定理:Ax=b有解 <=> r(A)=r(A|b)。有解时: r=n(唯一解); r<n(无穷多解，n-r个自由未知量)。齐次Ax=0总有零解，有非零解 <=> r(A)<n。",problems:[{q:"当r(A|b)>r(A)时解的情况?",a:"无解(矛盾方程组)。增广矩阵秩大于系数矩阵秩",d:"easy"},{q:"齐次线性方程组一定有解吗?",a:"一定有零解。但r(A)<n时有非零解(构成基础解系)",d:"easy"},{q:"讨论{x1+2x2=3, 2x1+4x2=a}何时有解",a:"增广矩阵[[1,2,3],[2,4,a]]。a=6时有解(无穷多); a!=6时无解",d:"medium"},{q:"判断 x1+x2+x3=1, 2x1+2x2+2x3=3, x1+x2+x3=2 是否有解",a:"增广矩阵秩2>系数矩阵秩1,无解",d:"easy"},{q:"齐次线性方程组Ax=0一定有解吗?",a:"一定有零解。是否有非零解要看r(A)<n?",d:"medium"},{q:"Ax=b有解的充要条件?",a:"r(A) = r(A|b) (系数矩阵和增广矩阵同秩)",d:"easy"}]},
  "la-3-4":{explanation:"高斯消元: (1)写增广矩阵;(2)初等行变换化行阶梯形;(3)从末行回代求解。自由变量:阶梯形主元数少于未知数时，未对应主元的变量为自由变量。解=特解+齐次通解(解空间维度=n-r)。",problems:[{q:"用高斯消元解{x+y+z=6, 2x-y+z=3, x+2y-z=2}",a:"消元后回代得解 x=1, y=2, z=3",d:"medium"},{q:"方程数=未知数个数一定有唯一解?",a:"不一定。需系数矩阵满秩。降秩(行列式=0)则可能无解或无穷多解",d:"easy"},{q:"{x1+x2=0, x2+x3=0}的通解?",a:"x3自由，x2=-x3, x1=x3。通解=k(1,-1,1)^T",d:"medium"},{q:"高斯消元解4元4个方程线性方程组(系数矩阵满秩)",a:"x1=1/2, x2=1/2, x3=-1/2, x4=0",d:"hard"},{q:"什么是自由变量?",a:"在方程组化简后, 不对应主元的未知量为自由变量, 可取任意值",d:"easy"},{q:"n个未知数、r个有效方程的齐次系统, 解空间维数?",a:"n - r",d:"medium"}]},
  "la-4-0":{explanation:"向量beta可由向量组alpha1,...,alpham线性表出:存在ki使beta=sum(ki*alpha_i)。等价于方程组[alpha1,...,alpham]x=beta有解。两向量组等价:可互相表出。向量组全体线性组合构成张成空间(span)。",problems:[{q:"判断beta=(1,3,5)能否由alpha1=(1,1,1),alpha2=(0,1,2)表出?",a:"解方程组得x1=1,x2=2。beta=alpha1+2*alpha2，可以",d:"easy"},{q:"任一n维向量必可由哪些向量表出?",a:"可由n维标准基e1=(1,0,...,0),...,en=(0,...,0,1)线性表出，系数即分量",d:"easy"},{q:"线性表出的传递性?",a:"由等价关系传递性:beta由alpha组表出，alpha由gamma组表出 => beta由gamma组表出",d:"medium"},{q:"判断 beta=(2,3,5) 能否由 alpha1=(1,0,1),alpha2=(1,1,0),alpha3=(0,1,1) 线性表出",a:"x1=2,x2=0,x3=3: beta=2a1+3a3",d:"medium"},{q:"什么是线性组合?",a:"向量β能被α1,...,αm以系数k1,...,km表示: β=k1α1+...+kmαm",d:"easy"},{q:"两个向量组等价是什么意思?",a:"可以互相线性表出",d:"medium"}]},
  "la-4-1":{explanation:"向量组线性相关:存在不全为零的ki使sum(ki*alpha_i)=0。无关:仅全零系数能使组合为零。本质:相关=某向量可被其他表出; 无关=每向量贡献独立维度。判定:以向量为列构矩阵，秩=向量数<=>无关; 含零向量必相关; n+1个n维向量必相关。",problems:[{q:"判断alpha1=(1,1),alpha2=(2,2)的线性相关性?",a:"alpha2=2*alpha1，2*alpha1-alpha2=0，系数不全零，相关",d:"easy"},{q:"证明含零向量必相关",a:"设alpha1=0, 则1*alpha1+0*...=0，系数不全零",d:"easy"},{q:"alpha1,alpha2,alpha3无关，证alpha1+alpha2,alpha2+alpha3,alpha3+alpha1也无关",a:"设k1(a1+a2)+k2(a2+a3)+k3(a3+a1)=0，整理由无关得k=0",d:"hard"},{q:"判断 a1=(1,2,3),a2=(2,4,6),a3=(1,1,1) 的线性相关性",a:"a2=2a1,故a1,a2相关",d:"easy"},{q:"含零向量的向量组一定是什么?",a:"线性相关(零向量可被取系数1、其余0)",d:"easy"},{q:"n+1个n维向量必然什么?",a:"线性相关(超过维数, 必然相关)",d:"medium"}]},
  "la-4-2":{explanation:"极大无关组:向量组的一个部分组，自身无关且组中任意向量都可由该部分组表出。秩=极大无关组向量个数=矩阵秩。性质:极大无关组不唯一但向量个数唯一; 等价向量组同秩; 列秩=行秩=矩阵秩。",problems:[{q:"求alpha1=(1,0,1),alpha2=(2,1,0),alpha3=(4,1,2)的极大无关组",a:"构造矩阵化简后秩=2，取alpha1,alpha2(alpha3=2*alpha1+alpha2)",d:"medium"},{q:"极大无关组唯一吗?举例",a:"不唯一。如(1,0),(0,1),(1,1)秩=2，任意两个无关向量均可为极大无关组",d:"medium"},{q:"若(I)可由(II)表出，证明r(I)<=r(II)",a:"(I)每个向量是(II)的组合 => (I)生成子空间subseteq (II)生成子空间 => dim(I)<=dim(II)",d:"hard"},{q:"求 (1,2,3,4),(2,3,4,5),(3,4,5,6),(4,5,6,7) 的秩",a:"行阶梯形秩=2",d:"medium"},{q:"极大无关组唯一吗?",a:"不唯一, 但向量个数唯一(秩数)",d:"medium"},{q:"列秩和行秩的关系?",a:"相等, 都等于矩阵的秩",d:"medium"}]},
  "la-4-3":{explanation:"齐次Ax=0(r个有效方程，n个未知数)通解: x=k1*xi1+...+k_{n-r}*xi_{n-r}。基础解系求法:化行最简，自由变量分别取e1,e2,...代入求非自由变量，得n-r个无关解向量。非齐次通解=特解+齐次通解。",problems:[{q:"{x1+x2+x3=0, x2-x3=0}的基础解系?",a:"行最简[[1,0,2],[0,1,-1]]，x3自由，令x3=1得xi=(-2,1,1)^T。通解=k(-2,1,1)^T",d:"medium"},{q:"eta1,eta2是Ax=b的解，eta1-eta2是什么?",a:"A(eta1-eta2)=A*eta1-A*eta2=b-b=0，是齐次Ax=0的解",d:"easy"},{q:"n元非齐次r(A)=r时通解含几个任意常数?",a:"n-r个。基础解系含n-r个解，每对应一个自由变量",d:"medium"},{q:"求齐次方程组 x1+x2+x3=0, 2x1+3x2+x3=0 的基础解系",a:"基础解系=(2,-1,1)^T",d:"medium"},{q:"非齐次线性方程组的特解加什么得通解?",a:"加齐次方程组的基础解系(齐次通解)",d:"easy"},{q:"基础解系中应该包含多少个线性无关的解?",a:"n - r个",d:"medium"}]},
  "la-4-4":{explanation:"向量空间:对加法和数乘封闭的非空向量集合(R^n, 矩阵空间, 多项式空间P_n,...)。子空间验证:非空(含零元)+\封闭。基:子空间中无关且能张成空间的向量组。维数=基中向量个数。坐标:向量在基下的系数。",problems:[{q:"过原点的直线是R^2的子空间吗?",a:"是。零向量在线上;线上向量和仍在线上;数乘后仍在线上",d:"easy"},{q:"R^3自然基?向量(2,3,5)在自然基下坐标?",a:"自然基:e1=(1,0,0),e2=(0,1,0),e3=(0,0,1)。坐标即(2,3,5)本身",d:"easy"},{q:"次数恰好为n的多项式是否构成向量空间?",a:"否。两n次相加可能降次(n次项系数和=0)，不封闭。次数不超过n的多项式构成空间P_n",d:"medium"},{q:"验证多项式空间 P_3 中 {1,x,x^2,x^3} 构成基",a:"无关且张成P_3,维数=4,构成基",d:"medium"},{q:"R^n是什么线性空间?",a:"n维实向量空间, 由所有n维实向量构成",d:"easy"},{q:"过原点的平面是R^3的子空间吗?",a:"是的。平面是R^3的2维子空间",d:"medium"}]},
  "la-5-0":{explanation:"内积(点积):(alpha,beta)=sum(ai*bi)。性质:对称性、线性性、正定性((alpha,alpha)>=0)。向量长度:||alpha||=sqrt((alpha,alpha))。正交:(alpha,beta)=0。正交向量组线性无关。施密特正交化:beta_i=alpha_i-sum((alpha_i,beta_j)/(beta_j,beta_j)*beta_j)。正交矩阵:Q^T Q=I即Q^-1=Q^T。",problems:[{q:"求alpha=(1,2,3)与beta=(4,5,6)的内积",a:"(alpha,beta)=1*4+2*5+3*6=4+10+18=32",d:"easy"},{q:"用Schmidt法将(1,1,1),(0,1,1)正交化",a:"beta1=(1,1,1); beta2=(0,1,1)-2/3*(1,1,1)=(-2/3,1/3,1/3)",d:"hard"},{q:"正交矩阵的行列式值为?",a:"|Q^T||Q|=|Q|^2=1 => |Q|=+/-1",d:"medium"},{q:"将 (1,1,1),(1,2,3),(1,3,4) 施密特正交化",a:"b1=(1,1,1); b2正交化后=(-2/3,1/3,4/3); b3进一步正交",d:"hard"},{q:"什么是正交矩阵?",a:"Q^T Q = I 的矩阵, 列向量互相正交且长度=1",d:"easy"},{q:"正交矩阵的行列式值为?",a:"±1",d:"easy"}]},
  "la-5-1":{explanation:"特征值与特征向量: A*xi=lambda*xi (xi!=0)。特征多项式|lambdaI-A|=0的根即特征值。n阶方阵必有n个特征值(含重根，复数)。实对称阵特征值全为实数。性质:sum(lambda_i)=tr(A); prod(lambda_i)=|A|; A可逆<=>所有特征值非零。",problems:[{q:"求[[2,1],[1,2]]的特征值和特征向量",a:"lambda1=1(lambda=2: (1,-1)^T), lambda2=3(lambda=3: (1,1)^T)",d:"medium"},{q:"若A可逆，证明lambda^-1是A^-1的特征值",a:"A*xi=lambda*xi => 左乘A^-1得xi=lambda*A^-1*xi => A^-1*xi=lambda^-1*xi",d:"medium"},{q:"证明|A|=lambda1*lambda2*...*lambda_n",a:"f(0)=|A|; 又f(lambda)=prod(lambda_i-lambda)，令lambda=0得证",d:"hard"},{q:"求 A=[[3,1],[1,3]] 的特征值与特征向量",a:"λ1=2,λ2=4;对应特征向量(1,-1)^T,(1,1)^T",d:"medium"},{q:"特征多项式是λ的几次多项式?",a:"n次多项式",d:"easy"},{q:"特征值的乘积等于什么?",a:"|A|, 即行列式值",d:"medium"}]},
  "la-5-2":{explanation:"相似矩阵: P^-1AP=B, A~B。相似阵同特征值、行列式、迹和秩。对角化条件:A有n个线性无关特征向量<=>可对角化。若A有n个互异特征值则必可对角化。对角化步骤:(1)求特征值;(2)求特征向量;(3)若恰n个得P^-1AP=Lambda。",problems:[{q:"判断[[1,1],[0,1]]可否对角化",a:"lambda=1(二重)，仅1个无关特征向量，不足2个，不可对角化",d:"medium"},{q:"若A有n个互异特征值，证明A可对角化",a:"每特征值至少1个特征向量，互异特征向量线性无关 => n个无关特征向量 => 可对角化",d:"hard"},{q:"两矩阵同特征值一定相似吗?",a:"不一定。[[1,1],[0,1]]和[[1,0],[0,1]]同特征值但前者不可对角化，不相似",d:"hard"},{q:"判断 A=[[2,1],[0,2]] 是否可对角化",a:"特征值2二重但仅1个特征向量,不可对角化",d:"hard"},{q:"相似矩阵有相同的什么?",a:"特征值、行列式、迹、秩",d:"easy"},{q:"什么条件下矩阵可对角化?",a:"有n个线性无关的特征向量",d:"medium"}]},
  "la-5-3":{explanation:"实对称矩阵A=A^T完美性质:(1)特征值全实数;(2)不同特征值特征向量正交;(3)必可正交对角化——存在正交Q使Q^TAQ=Lambda。正交对角化步骤:求特征值->求基础解系->施密特正交化->构成正交矩阵Q。用于二次型化标准形、PCA、力学主轴问题等。",problems:[{q:"将[[0,1],[1,0]]正交对角化",a:"lambda=1,-1。Q=1/sqrt(2)*[[1,1],[1,-1]]。Q^TAQ=[[1,0],[0,-1]]",d:"hard"},{q:"实对称阵特征值为何一定是实数?",a:"用共轭论证: A*xi=lambda*xi, 取共轭后计算xi共轭^T*A*xi得lambda=conj(lambda)",d:"hard"},{q:"为何实对称阵必可正交对角化?",a:"不同特征值特征向量正交; 几何重数=代数重数; 正交化得完备正交特征向量系",d:"hard"},{q:"将 A=[[0,1],[1,0]] 正交对角化",a:"Q=(1/√2)[[1,1],[1,-1]], Q^TAQ=diag(1,-1)",d:"hard"},{q:"实对称矩阵的特征值一定是?",a:"实数",d:"easy"},{q:"实对称矩阵能否正交对角化?",a:"能。存在正交矩阵Q, 使Q^T A Q 为对角阵",d:"medium"}]},
  "la-5-4":{explanation:"二次型:n个变量的二次齐次多项式f=x^T A x，A为实对称矩阵(唯一)。用正交变换x=Qy化标准形: f=lambda1*y1^2+...+lambda_n*y_n^2。正交变换保持长度不变。合同:C^T A C = B。规范形系数为-1,0,1。",problems:[{q:"写出f=x1^2+2x1x2+3x2^2的矩阵",a:"A=[[1,1],[1,3]]（交叉项系数折半放对称位）",d:"easy"},{q:"用正交变换将f=3x1^2+2x1x2+3x2^2化标准形",a:"A=[[3,1],[1,3]]，特征值2,4 => f=2y1^2+4y2^2",d:"medium"},{q:"x^TAx中A必须是对称阵吗?",a:"不一定，但可取B=(A+A^T)/2使得B对称且x^TBx=x^TAx，约定用对称阵",d:"medium"},{q:"用正交变换化 f=x1^2+2x2^2+3x3^2+4x1x2+4x2x3 为标准形",a:"特征值0,2,4,标准形=2y2^2+4y3^2",d:"hard"},{q:"正交变换后向量长度如何?",a:"不变(正交变换保持长度)",d:"easy"},{q:"二次型标准形中系数是什么?",a:"矩阵的特征值",d:"medium"}]},
  "la-5-5":{explanation:"配方法(拉格朗日):(1)有平方项x_i^2 -> 以x_i为核心构造完全平方;(2)无平方项 -> 先做可逆变换(如x1=y1+y2,x2=y1-y2)产生平方项;(3)重复至只剩平方项。惯性定理:标准形中正负系数个数p,q唯一确定(不变量)。",problems:[{q:"用配方法将f=x1^2+2x1x2+2x2^2化标准形",a:"f=(x1+x2)^2+x2^2，令y1=x1+x2, y2=x2 => f=y1^2+y2^2",d:"easy"},{q:"用配方法将f=2x1x2化标准形",a:"令x1=y1+y2, x2=y1-y2 => f=2(y1^2-y2^2)=2y1^2-2y2^2",d:"medium"},{q:"惯性定理的实际意义?",a:"正负平方项个数是二次型内在属性。保证分类唯一:正定=全正,负定=全负,不定=有正有负",d:"medium"},{q:"用配方法化 f=2x1x2+2x1x3+2x2x3 为标准形",a:"换元后f=2y1^2-2y2^2+0·y3^2",d:"hard"},{q:"配方法和正交变换化标准形的区别?",a:"配方法可能改变几何形状, 正交变换保持长度/角度",d:"hard"},{q:"惯性定理告诉我们什么?",a:"二次型标准形中正平方项个数p和负平方项个数q是唯一的(不变量)",d:"medium"}]},
  "la-5-6":{explanation:"正定:对任意x!=0，f(x)>0恒成立。判定:(1)顺序主子式全>0;(2)特征值全>0;(3)合同于单位阵A=C^T C。性质:可逆、对角线元素全正、行列式>0。类似定义:半正定、负定、不定。",problems:[{q:"判断[[2,1],[1,3]]是否正定",a:"一阶主子式2>0，二阶|A|=5>0 => 正定",d:"medium"},{q:"正定矩阵对角线元素一定为正?",a:"是。取x=e_i => f(e_i)=a_ii>0(正定性定义)",d:"easy"},{q:"A,B正定，A+B一定正定?",a:"是。x^T(A+B)x=x^TAx+x^TBx>0+0=0 (任意x!=0)",d:"medium"},{q:"判断 f=x1^2+2x2^2+3x3^2+2x1x2+2x2x3 是否正定",a:"顺序主子式全>0,正定",d:"medium"},{q:"正定矩阵的主对角线元素符号?",a:"全为正(取x=ei, x^T A x = aii > 0)",d:"easy"},{q:"两个正定矩阵之和是否正定?",a:"是正定",d:"medium"}]},
  "la-6-0":{explanation:"线性空间V定义八条公理(加法4条+数乘4条)。常见:R^n,M_{m*n},P_n,连续函数空间C[a,b]。子空间验证:非空(含零)+加法封闭+数乘封闭。如Ax=0的解空间是R^n的子空间。",problems:[{q:"验证M_{2x2}(2阶方阵)构成线性空间",a:"加法满足结合律、零元、负元; 数乘满足四条分配/结合律。八条公理全满足",d:"easy"},{q:"{f in P_n | f(0)=0}是P_n的子空间吗?",a:"是。零多项式f=0满足;若f(0)=g(0)=0则(f+g)(0)=0;(kf)(0)=0",d:"medium"},{q:"举例:R^2中不过原点的直线非子空间",a:"直线y=2x+1，(0,1)在线。k=2:2*(0,1)=(0,2)但y=2!=2x+1=1，不封闭",d:"medium"},{q:"验证所有 2 阶对称矩阵构成 M_2(R) 的子空间",a:"加法封闭+数乘封闭+含零矩阵",d:"medium"},{q:"什么是子空间?",a:"线性空间的子集, 对加法和数乘封闭且含零元",d:"easy"},{q:"ax+by+cz=0是R^3的子空间吗?",a:"是。零向量在其中, 封闭, 是R^3的2维子空间",d:"medium"}]},
  "la-6-1":{explanation:"维数dimV=基所含向量个数。dimV=r则任意r个无关向量都是基。坐标:设B={epsilon1,...,epsilon_r}为基，任意alpha唯一表示为alpha=sum(x_i*epsilon_i)，(x1,...,xr)^T为alpha在基B下的坐标。",problems:[{q:"求P_2(次数<=2多项式)的标准基和维数",a:"标准基:{1,x,x^2}。dim P_2=3",d:"easy"},{q:"验证{1,x-1,(x-1)^2}是P_2的基",a:"这三多项式展开后的系数矩阵秩=3(满秩)=>构成基",d:"medium"},{q:"证明线性空间中坐标唯一性",a:"设alpha=sum(x_i*e_i)=sum(y_i*e_i) => sum((x_i-y_i)e_i)=0。由基无关=>x_i=y_i",d:"medium"},{q:"求 α=(3,5) 在基 ε1=(1,1),ε2=(-1,1) 下的坐标",a:"解方程得坐标(4,1)^T",d:"medium"},{q:"维数不同的基可构成同一空间吗?",a:"不可以。基的向量数=维数, 唯一确定",d:"medium"},{q:"P_2(次数≤2的多项式空间)的维数?",a:"3 (基: {1, x, x^2})",d:"easy"}]},
  "la-6-2":{explanation:"过渡矩阵: (beta1,...,beta_n)=(alpha1,...,alpha_n)*P，P为过渡矩阵(可逆)。逆为反向过渡。坐标变换:同一向量在不同基下坐标x,y关系: x=Py (或y=P^-1x)。二维中旋转坐标系时过渡矩阵为正交矩阵。",problems:[{q:"求基(1,0),(0,1)到(1,1),(1,-1)的过渡矩阵",a:"P=[[1,1],[1,-1]]",d:"medium"},{q:"证明过渡矩阵可逆",a:"若P不可逆，存在非零c使Pc=0 => (beta组)*c=0 => beta组相关，矛盾",d:"hard"},{q:"坐标变换公式的几何含义?",a:"同一向量在不同坐标系下坐标不同，过渡矩阵描述两种坐标间转换关系",d:"medium"},{q:"基 B={α1,α2} 到 B'={α1+α2,α1-α2} 的过渡矩阵 P",a:"P=[[1,1],[1,-1]]",d:"medium"},{q:"过渡矩阵P一定可逆吗?",a:"是的(否则新基线性相关, 矛盾)",d:"medium"},{q:"由基A到基B的过渡矩阵P, 坐标变换公式?",a:"在基A下的坐标x与基B下的坐标y满足: x=Py 或 y=P^{-1}x",d:"hard"}]},
  "la-6-3":{explanation:"线性变换T:V->V满足T(alpha+beta)=T(alpha)+T(beta)且T(k*alpha)=k*T(alpha)。性质:T(0)=0,T(-alpha)=-T(alpha),保持线性组合形式。核KerT={alpha|T(alpha)=0}(V的子空间);像ImT={T(alpha)}(V的子空间)。维数公式:dimV=dim(KerT)+dim(ImT)。",problems:[{q:"验证微分D(f)=f'是P_3上的线性变换",a:"D(f+g)=(f+g)'=f'+g'=D(f)+D(g);D(kf)=kf'=kD(f)。满足定义",d:"easy"},{q:"求T(x,y)=(x+y,x-y)的核与像",a:"Ker:解方程组得x=y=0 => Ker={0};Im:任意(a,b)可得x=(a+b)/2 => Im=R^2",d:"medium"},{q:"由维数公式证:dim(Im T)=dim V => Ker T={0}",a:"dim V=dim(Ker T)+dim(Im T)=dim(Ker T)+dim V => dim(Ker T)=0 => Ker T={0}",d:"medium"},{q:"求 T(x,y)=(2x+y,x+2y) 的核空间 Ker(T)",a:"Ker(T)={0},T可逆",d:"medium"},{q:"核空间Ker(T)是什么?",a:"被T映射到零向量的所有向量构成的子空间",d:"easy"},{q:"dim(Ker T)和可逆性关系?",a:"T可逆⇔Ker(T)={0}⇔dim(Ker T)=0",d:"medium"}]},
  "la-6-4":{explanation:"线性变换在基下的矩阵:T(alpha_j)=sum(a_ij*alpha_i)则A=(a_ij)为T在基B下矩阵。核心公式:T(alpha1,...,alpha_n)=(alpha1,...,alpha_n)*A。基变换与矩阵关系:若基变(过渡P)则T新矩阵=P^-1 A P(相似!)。同变换不同基下矩阵相似。",problems:[{q:"T(x,y)=(x+y,x-y)在标准基下矩阵?",a:"T(1,0)=(1,1)=1*e1+1*e2;T(0,1)=(1,-1)=1*e1+(-1)*e2。A=[[1,1],[1,-1]]",d:"medium"},{q:"同变换在不同基下矩阵关系?",a:"相似关系:A->P^-1 AP。解释了为何研究相似分类-不同基的矩阵本质代表同一变换",d:"hard"},{q:"证T可逆<=>任意基下矩阵可逆",a:"T可逆<=>存在T^-1使TT^-1=T^-1 T=I。基下A*B=I => A可逆(B=A^-1)",d:"hard"},{q:"T(x,y,z)=(x+2y,y+z,z-x) 在标准基下的矩阵",a:"矩阵=[[1,2,0],[0,1,1],[-1,0,1]]",d:"medium"},{q:"同变换在不同基下矩阵有什么关系?",a:"相似关系(A→P^{-1}AP), 解释了为何研究相似分类",d:"hard"},{q:"T在基B下矩阵A的列向量表示什么?",a:"基向量在T下变换后在基B中的坐标",d:"medium"}]}};



/* ═══════ C 语言知识点详解 ═══════ */

Object.assign(kpDetails, {

// 第1章 C语言概述

"clang-1-0":{explanation:"C语言诞生于1972年，由贝尔实验室的Dennis Ritchie开发，最初用于编写UNIX操作系统。C语言具有高效、可移植、底层控制能力强等特点，是操作系统、嵌入式开发、游戏引擎的基石。\n\nC语言标准经历了K&R C、ANSI C（C89/C90）、C99、C11、C17等版本。理解标准版本有助于编写可移植代码。\n\nC语言被称为'中级语言'：比汇编高级（有抽象），比Java/Python低级（可直接操作内存）。",problems:[{q:"列举C语言的三个主要特点",a:"1) 高效：编译后接近机器码速度；2) 可移植：跨平台编译；3) 底层控制：可直接操作内存和硬件",d:"easy"},{q:"C语言和C++的主要区别是什么？",a:"C是面向过程的，C++在C基础上增加了面向对象（类、继承、多态）、模板、异常处理等特性",d:"easy"},{q:"为什么操作系统内核通常用C语言而不是C++编写？",a:"C语言更轻量、无隐式开销（无虚函数表、无异常机制），运行时行为更可预测，适合对性能和可控性要求极高的系统级代码",d:"hard"}]},

"clang-1-1":{explanation:"主流C语言开发环境：Windows上使用MinGW-GCC或MSVC，Linux/Mac上使用GCC/Clang。常见IDE有VS Code、CLion、Dev-C++、Code::Blocks。\n\n编译过程四阶段：预处理（展开宏/头文件）→ 编译（生成汇编）→ 汇编（生成目标文件.o）→ 链接（生成可执行文件）。\n\n第一个程序：#include <stdio.h> 包含标准输入输出库，main函数是程序入口，printf打印文字，return 0表示程序正常退出。",problems:[{q:"写出最简单的Hello World程序",a:"#include <stdio.h>\nint main() {\n    printf(\"Hello, World!\\n\");\n    return 0;\n}",d:"easy"},{q:"gcc编译命令中，-o的作用是什么？",a:"-o 指定输出文件名，如 gcc hello.c -o hello 将 hello.c 编译为名为 hello 的可执行文件",d:"easy"},{q:"预处理、编译、链接各阶段分别生成什么文件？",a:"预处理→.i文件（展开后的C代码）；编译→.s文件（汇编代码）；汇编→.o文件（目标文件）；链接→可执行文件（.exe或无后缀）",d:"medium"}]},

"clang-1-2":{explanation:"C程序的基本结构：预处理指令（#include、#define）在最前面；然后是全局变量声明和函数原型；main函数是必须的入口；其他自定义函数可在main之前或之后定义。\n\n注释方式：// 单行注释（C99起）、/* */ 多行注释。良好的注释风格是专业代码的标志。\n\n语句以分号结尾，代码块用{}括起，缩进用于增强可读性（非强制但必须）。",problems:[{q:"以下代码中有几处语法错误？int main() { printf(\"hi\") return 0 }",a:"两处：printf语句后缺分号；return 0后缺分号（共两个分号缺失）",d:"easy"},{q:"#include <stdio.h> 和 #include \"myfile.h\" 的区别？",a:"<>从系统标准头文件目录搜索；\"\"先从当前目录搜索，再到系统目录。自定义头文件用\"\"，标准库用<>",d:"medium"},{q:"可以在函数内部定义另一个函数吗？",a:"标准C（C89/C99/C11）不允许嵌套函数定义。GCC有非标准扩展支持，但不推荐使用，会降低可移植性",d:"medium"}]},

// 第2章 数据类型

"clang-2-0":{explanation:"C语言基本数据类型：整型（char 1B, short 2B, int 4B, long 4/8B, long long 8B）、浮点型（float 4B, double 8B）、字符型（char 1B，本质是整数）。\n\n各类型占用字节数与平台/编译器相关，用sizeof()运算符获取确切大小。signed/unsigned修饰符改变数值范围（如unsigned int: 0~4294967295）。\n\n整型溢出是常见Bug：int最大值+1会变成最小负数（有符号），或从0开始（无符号）。",problems:[{q:"char类型的取值范围是多少（有符号）？",a:"-128 到 127（共256个值，1字节8位，最高位为符号位）",d:"easy"},{q:"为何浮点数比较不能用 == ？",a:"浮点数存储存在精度误差（如0.1+0.2不精确等于0.3），应使用 fabs(a-b) < 1e-6 的方式比较",d:"medium"},{q:"short a = 30000; a = a + 10000; 结果是多少？",a:"short最大32767，30000+10000=40000超出范围，发生溢出，结果为 40000-65536 = -25536（有符号short溢出）",d:"hard"}]},

"clang-2-1":{explanation:"变量声明：类型名 变量名 [= 初始值];。局部变量未初始化时值为垃圾值（未定义行为），全局变量自动初始化为0。\n\nconst关键字：const int MAX = 100; 声明只读变量，比#define更安全（有类型检查）。\n\n#define宏：#define PI 3.14159 是纯文本替换，无类型，无作用域。注意宏的副作用：#define SQUARE(x) x*x，SQUARE(2+3)展开为2+3*2+3=11而非25，应写成((x)*(x))。",problems:[{q:"const int x = 5 和 #define X 5 有什么区别？",a:"const有数据类型，有作用域，调试可见；#define是预处理文本替换，无类型，全局替换，不做类型检查",d:"medium"},{q:"以下代码输出什么？ int a; printf(\"%d\", a);",a:"输出不确定的垃圾值（未定义行为）。局部变量未初始化时包含内存中的随机数据",d:"easy"},{q:"为什么宏参数需要加括号？举例说明",a:"#define MUL(a,b) a*b，MUL(2+3,4)展开为2+3*4=14而非20。正确写法：#define MUL(a,b) ((a)*(b))",d:"medium"}]},

"clang-2-2":{explanation:"隐式类型转换（自动提升）：运算时低精度类型自动转为高精度，如int+double→double。整型提升：char/short参与运算会提升为int。\n\n强制类型转换：(type)expr，如(int)3.7得到3（截断小数部分，非四舍五入）。\n\nsizeof运算符：sizeof(type)或sizeof expr，返回字节数，类型为size_t（无符号整数）。注意sizeof不是函数，是编译期常量。",problems:[{q:"(int)(-3.7)的结果是什么？",a:"-3（强制转换截断小数部分，向0方向截断，不是向负方向）",d:"easy"},{q:"char c = 'A' + 1; printf(\"%c\", c); 输出什么？",a:"输出'B'。'A'的ASCII值是65，+1=66对应'B'，char参与运算时提升为int，赋值时再转回char",d:"medium"},{q:"sizeof('A')在C和C++中分别是多少？",a:"C语言中sizeof('A')=4（字符字面量在C中是int类型）；C++中sizeof('A')=1（字符字面量是char类型）",d:"hard"}]},

// 第3章 运算符

"clang-3-0":{explanation:"算术运算符：+、-、*、/（整除取整）、%（取模，仅整数）。注意整数除法：5/2=2而非2.5。关系运算符：==、!=、>、<、>=、<=，返回0或1（int类型）。\n\n运算符优先级（高→低）：() > 单目 > * / % > + - > 关系 > == != > && > || > 赋值。记不住时加括号。\n\n自增自减：a++（先用后增）vs ++a（先增后用），在复杂表达式中慎用，可能导致未定义行为。",problems:[{q:"7 % 3 和 -7 % 3 分别是多少？",a:"7%3=1；-7%3的结果依C标准：C99及以后规定结果符号与被除数相同，即-7%3=-1",d:"medium"},{q:"int a=5; printf(\"%d %d\", a++, ++a); 输出什么？",a:"未定义行为！同一语句中两次修改a（或读写）的顺序未定义。实际结果依编译器而异，不应这样写",d:"hard"},{q:"以下哪个表达式判断x是偶数？x%2==0 还是 !(x%2) ？",a:"两者等价，都正确。x%2==0更清晰；!(x%2)利用0为假的性质。对负数也适用（C99后%结果符号确定）",d:"easy"}]},

"clang-3-1":{explanation:"逻辑运算符：&&（与，短路）、||（或，短路）、!（非）。短路求值：a&&b中a为假则b不执行；a||b中a为真则b不执行。\n\n位运算符：&（按位与）、|（按位或）、^（按位异或）、~（按位取反）、<<（左移）、>>（右移）。位运算速度极快，常用于底层优化。\n\n实用技巧：x&1判断奇偶（结果1为奇，0为偶），x<<1相当于x*2，x>>1相当于x/2（正数），x^x=0（常用于交换）。",problems:[{q:"用位运算判断整数n的第k位（从0起）是否为1",a:"(n >> k) & 1，若结果为1则第k位为1，否则为0",d:"medium"},{q:"a=5(0101), b=3(0011)，求a&b, a|b, a^b",a:"a&b=1(0001), a|b=7(0111), a^b=6(0110)",d:"easy"},{q:"不用临时变量交换a和b（用异或）",a:"a=a^b; b=a^b; a=a^b;（利用异或的性质：a^b^b=a）注意a和b不能是同一变量",d:"medium"}]},

"clang-3-2":{explanation:"复合赋值运算符：+=、-=、*=、/=、%=、&=、|=、^=、<<=、>>=，是简化写法。\n\n三目（条件）运算符：条件 ? 表达式1 : 表达式2。条件为真执行表达式1，否则执行表达式2。可以嵌套，但影响可读性。\n\n逗号运算符：expr1, expr2，顺序求值，结果为最后一个表达式的值（实际中不常用，for循环的初始化/更新语句中常见）。",problems:[{q:"用三目运算符求a和b的较大值",a:"int max = (a > b) ? a : b;",d:"easy"},{q:"int x=10; x += 5; x *= 2; x的值是多少？",a:"x=10, +5后x=15, *2后x=30",d:"easy"},{q:"三目运算符能作为左值吗？(a>b?a:b) = 10 是否合法？",a:"在标准C中不合法（三目运算符的结果是右值）。C++中条件表达式的操作数是左值时结果可以是左值，但不推荐这样使用",d:"hard"}]},

// 第4章 控制流程

"clang-4-0":{explanation:"if-else：条件为非零值（包括负数）即为真。else if链可以模拟多路分支。注意else的归属（就近原则：else与最近的if配对）。\n\nswitch-case：只能判断整型/字符型，每个case后必须有break（否则穿透到下一个case）。default处理其他情况。\n\n常见错误：if(a=5)是赋值不是比较（应为if(a==5)）；else悬挂问题（嵌套if-else时大括号明确匹配关系）。",problems:[{q:"switch中不写break会怎样？举例说明",a:"会'穿透'：执行完当前case的代码后继续执行下一个case的代码，直到遇到break或switch结束。有时故意利用穿透（如多个case共享代码），但通常应加break",d:"medium"},{q:"if(x=0) printf(\"zero\"); 这段代码有什么问题？",a:"条件中是赋值x=0（不是比较x==0），赋值后x为0（假），printf永远不会执行。编译器通常给出警告",d:"easy"},{q:"以下if-else，else归属哪个if？ if(a) if(b) x=1; else x=2;",a:"else归属最近的if(b)，即 if(a){ if(b) x=1; else x=2; }。要让else归属if(a)，需给if(b)加大括号",d:"hard"}]},

"clang-4-1":{explanation:"for循环：for(初始化; 条件; 更新)，三部分都可省略。while：先判断后执行，可能一次不执行。do-while：先执行后判断，至少执行一次。\n\n选择准则：知道循环次数用for；条件循环用while；至少执行一次用do-while。\n\n常见Bug：死循环（条件永远为真）、差一错误（循环多/少一次，注意<和<=的区别）、在循环体内修改循环变量。",problems:[{q:"用for循环计算1到100的和",a:"int sum=0; for(int i=1; i<=100; i++) sum+=i; // 结果5050",d:"easy"},{q:"do-while和while的区别是什么？什么时候用do-while？",a:"do-while至少执行一次循环体，适合需要先执行再判断的场景，如用户输入验证（先读取输入再判断是否合法）",d:"medium"},{q:"for(;;)是什么意思？如何退出？",a:"三部分都省略，等价于 while(1)，是无限循环。通过break语句或return退出",d:"easy"}]},

"clang-4-2":{explanation:"break：立即退出最近的循环或switch，不执行循环剩余代码。continue：跳过本次循环剩余代码，直接进行下次迭代（for的更新部分仍执行）。\n\ngoto：跳转到标签位置，可跳出多层嵌套（唯一合理用法），但滥用会导致代码难以维护。\n\n多层嵌套退出：C语言没有labeled break，常用goto或设置标志变量。",problems:[{q:"break在嵌套循环中只退出哪一层？",a:"break只退出直接包含它的那一层循环（最内层）。要退出外层循环，需要goto或设置标志变量",d:"easy"},{q:"continue在for和while中分别跳到哪里？",a:"for中跳到更新语句（如i++）再判断条件；while中直接跳到条件判断",d:"medium"},{q:"用goto退出双重嵌套循环的写法",a:"for(...){ for(...){ if(cond) goto end; } } end:; // 跳到标签后继续执行",d:"medium"}]},

// 第5章 函数

"clang-5-0":{explanation:"函数由返回类型、函数名、参数列表、函数体组成。函数原型（声明）在调用前告知编译器函数签名。\n\nC语言只有值传递：函数内修改参数不影响调用者的变量。要修改外部变量需传递指针。\n\n返回值：return expr; 返回值并退出函数。void函数不返回值。函数只能返回一个值，多返回值需用指针参数或结构体。",problems:[{q:"为什么C语言函数只有值传递，如何实现修改外部变量？",a:"值传递只复制实参值，函数内的参数是副本。要修改外部变量，传入变量地址（指针），函数内通过*ptr修改",d:"medium"},{q:"函数原型声明有什么用？",a:"让编译器在看到函数调用时知道参数类型和返回类型，以便进行类型检查和正确生成调用代码",d:"easy"},{q:"递归函数求n!，当n很大时有什么问题？",a:"每次递归调用都会在栈上压入新的栈帧，n过大会导致栈溢出（stack overflow）",d:"medium"}]},

"clang-5-1":{explanation:"递归：函数调用自身解决同类子问题。必须有基本情况（递归终止条件）和递归情况（缩小问题规模）。\n\n经典递归：阶乘、Fibonacci、汉诺塔、二叉树遍历。递归易于理解，但效率可能低于迭代（重复计算、栈开销）。\n\n尾递归：递归调用是函数最后一步，编译器可优化为迭代（gcc -O2启用）。记忆化递归（memoization）避免重复计算。",problems:[{q:"用递归计算斐波那契数列第n项",a:"int fib(int n){ if(n<=1) return n; return fib(n-1)+fib(n-2); } // 时间复杂度O(2^n)，效率低",d:"easy"},{q:"汉诺塔问题：n个盘子需要移动多少次？",a:"2ⁿ-1次。递归：hanoi(n,A,C,B): if(n==1){move A→C;} else{hanoi(n-1,A,B,C); move A→C; hanoi(n-1,B,C,A);}",d:"medium"},{q:"如何将递归的Fibonacci优化到O(n)？",a:"用记忆化（数组存储已算结果）或改成迭代（用两个变量滚动计算）",d:"medium"}]},

"clang-5-2":{explanation:"局部变量：函数内声明，栈上分配，函数返回即销毁，仅函数内可见。全局变量：函数外声明，程序启动时分配，程序结束时销毁，所有函数可见。\n\nstatic局部变量：仅初始化一次，函数调用间保留值（存储在静态区而非栈）。static全局变量/函数：仅在当前文件可见（文件内私有）。\n\nregister关键字（已废弃）：建议将变量存入寄存器。extern关键字：声明在其他文件中定义的变量。",problems:[{q:"static局部变量和普通局部变量的区别",a:"普通局部变量每次函数调用时初始化并在函数退出时销毁；static局部变量只初始化一次，函数退出后值保留，下次调用仍存在",d:"medium"},{q:"以下函数有什么严重错误？int* foo(){ int a=5; return &a; }",a:"返回了局部变量的地址。局部变量在函数返回后被销毁，返回的指针成为悬空指针（dangling pointer），使用它是未定义行为",d:"hard"},{q:"全局变量的初始值是多少？",a:"全局变量和static变量自动初始化为0（整数）、0.0（浮点数）、NULL（指针）",d:"easy"}]},

// 第6章 数组与字符串

"clang-6-0":{explanation:"数组声明：类型 数组名[大小];，大小必须是编译期常量（C99前）。数组下标从0开始，最后一个元素下标为n-1。\n\n二维数组：类型 数组名[行][列];，存储方式为行优先（row-major）。多维数组可类比理解。\n\n数组不做越界检查（是C语言效率高的原因之一，也是缓冲区溢出漏洞的根源）。数组名是指向第一个元素的常量指针（不能被赋值）。",problems:[{q:"int a[5]={1,2,3};未初始化的元素值是多少？",a:"局部数组中未显式初始化的元素为0（只要有部分初始化列表，剩余元素自动补0）",d:"easy"},{q:"如何遍历二维数组 int m[3][4] 的所有元素？",a:"for(int i=0;i<3;i++) for(int j=0;j<4;j++) printf(\"%d \",m[i][j]);",d:"easy"},{q:"int a[5]; a[5]=10; 会发生什么？",a:"数组越界（越界写入），这是未定义行为，可能修改其他变量、触发段错误、或看似正常但留下安全漏洞",d:"medium"}]},

"clang-6-1":{explanation:"字符串是以'\\0'（空字符，ASCII 0）结尾的字符数组。char s[6]=\"hello\" 存储6个字节（h,e,l,l,o,\\0）。\n\n常用字符串函数（string.h）：strlen（长度，不含\\0）、strcpy（复制）、strcat（拼接）、strcmp（比较，返回0为相等）、strncpy/strncat（安全版本，限制长度）。\n\n字符串字面量存储在只读段，不可修改。char *s=\"hello\"; s[0]='H' 是未定义行为；应用 char s[]=\"hello\"; 。",problems:[{q:"char s[5]=\"hello\"; 有什么问题？",a:"'hello'需要6个字节（含\\0），但s只有5个字节，\\0被截断。字符串不再以\\0结尾，strlen等函数会越界读取",d:"medium"},{q:"strcmp返回0、正数、负数分别表示什么？",a:"0：两字符串相等；负数：第一个字符串字典序小于第二个；正数：大于。注意不能用==比较字符串",d:"easy"},{q:"为何推荐用strncpy而非strcpy？",a:"strcpy不限制复制长度，若源字符串比目标缓冲区长会发生缓冲区溢出。strncpy(dst,src,n)最多复制n个字符，更安全",d:"medium"}]},

"clang-6-2":{explanation:"数组作为函数参数时，自动退化为指向首元素的指针（数组退化），长度信息丢失，必须单独传递长度参数。\n\nvoid printArr(int *arr, int len) 和 void printArr(int arr[], int len) 等价。在函数内对参数做sizeof得到的是指针大小，而非数组大小。\n\n函数不能直接返回局部数组（因为局部变量栈上分配，返回后销毁），可以返回动态分配的数组或static数组（但static有线程安全问题）。",problems:[{q:"函数内sizeof(arr)为何不是数组大小？",a:"数组传入函数时退化为指针，sizeof计算的是指针大小（通常4或8字节），而非数组总大小",d:"medium"},{q:"如何在函数中修改数组元素并让调用者看到变化？",a:"数组退化为指针传递，函数内通过arr[i]=...直接修改，调用者的数组会改变（指针指向同一内存）",d:"easy"},{q:"如何在函数中返回一个动态创建的数组？",a:"使用malloc分配内存，返回指针：int* createArr(int n){ int *p=malloc(n*sizeof(int)); ... return p; } 调用者负责free()",d:"hard"}]},

// 第7章 指针

"clang-7-0":{explanation:"指针是存储内存地址的变量。&取址运算符获取变量地址，*解引用运算符访问地址处的值。\n\nint *p = &a; p存储a的地址，*p即a的值，修改*p也修改a。指针必须初始化（NULL或有效地址），野指针（未初始化或已释放的指针）是常见Bug来源。\n\nNULL指针（值为0/NULL）表示指针不指向任何有效地址，解引用NULL会导致段错误。使用指针前应检查是否为NULL。",problems:[{q:"int a=5, *p=&a; *p=10; printf(\"%d\",a); 输出什么？",a:"输出10。*p=10通过指针修改了a的值",d:"easy"},{q:"野指针和NULL指针的区别",a:"NULL指针明确表示'不指向任何对象'，是已知的安全状态；野指针指向不确定的内存位置（未初始化或已释放），解引用会导致未定义行为",d:"medium"},{q:"为什么指针类型要区分int*和char*？",a:"类型决定解引用时读取的字节数（int*读4字节，char*读1字节）和指针算术的步长（p+1移动的字节数）",d:"hard"}]},

"clang-7-1":{explanation:"数组名可视为指向首元素的指针（常量）。指针算术：p+n 移动 n*sizeof(*p) 个字节；p++ 移动一个元素的大小。\n\np[i] 等价于 *(p+i)，数组下标本质是指针运算。指针相减得到两指针间的元素个数（同类型指针才有意义）。\n\n注意：指针只有在指向同一数组（或末尾后一位）时运算才有意义，否则是未定义行为。",problems:[{q:"int a[]={1,2,3,4,5}; int *p=a; printf(\"%d\",*(p+2)); 输出什么？",a:"输出3。p+2指向a[2]，*(p+2)即a[2]=3",d:"easy"},{q:"*(a+i) 和 a[i] 是完全等价的吗？",a:"是的，完全等价。数组下标运算符[]本质上就是指针加法加解引用",d:"easy"},{q:"char *p=\"hello\"; p++; printf(\"%s\",p); 输出什么？",a:"输出\"ello\"。p++使指针移动1字节，指向第二个字符，printf从当前位置打印到\\0",d:"medium"}]},

"clang-7-2":{explanation:"通过指针传参实现地址传递：函数接收指针，通过*ptr修改原变量。这是C语言实现'输出参数'的唯一方式。\n\n函数指针：指向函数的指针，类型为 返回类型(*指针名)(参数类型列表)。如 int (*fp)(int,int) = add;，通过 fp(3,4) 调用。\n\n函数指针用途：回调函数（如qsort的比较函数）、实现多态（函数指针数组）、动态派发。",problems:[{q:"实现swap函数交换两个int变量",a:"void swap(int *a, int *b){ int t=*a; *a=*b; *b=t; }  调用：swap(&x,&y);",d:"easy"},{q:"int (*fp)(int,int) = add; fp(2,3) 和 add(2,3) 等价吗？",a:"等价。函数指针调用和直接调用结果相同，性能也几乎相同（间接调用略有开销）",d:"medium"},{q:"qsort如何用函数指针实现通用排序？",a:"qsort(arr, n, sizeof(int), compare)；compare是函数指针，签名为int compare(const void*, const void*)，实现两元素的比较逻辑",d:"hard"}]},

"clang-7-3":{explanation:"二级指针（指针的指针）：int **pp = &p; **pp 访问最终值。用于修改指针本身（如在函数内改变指针的指向）。\n\n指针数组：int *arr[5]; 5个int指针组成的数组（每个元素都是int*）。数组指针：int (*p)[5]; 指向含5个int的数组的指针。\n\n字符串数组：char *names[]=... 是指针数组，每个指针指向字符串字面量。二维数组和指针数组在内存布局上不同。",problems:[{q:"指针数组int *a[3]和数组指针int (*p)[3]有什么区别？",a:"int *a[3]：3个元素，每个元素是int*（指针数组）；int (*p)[3]：p是一个指针，指向含3个int的数组（数组指针）",d:"hard"},{q:"void func(int **pp){ *pp = malloc(sizeof(int)); **pp = 42; } 作用是什么？",a:"函数通过二级指针修改调用者的指针变量，让其指向新分配的内存，并设置值为42",d:"medium"},{q:"char *names[]={\"Alice\",\"Bob\",\"Carol\"};如何打印所有名字？",a:"for(int i=0;i<3;i++) printf(\"%s\\n\",names[i]);",d:"easy"}]},

// 第8章 结构体

"clang-8-0":{explanation:"struct定义自定义数据类型，将不同类型的数据组合在一起。访问成员用.（直接）或->（指针）。\n\n结构体内存对齐：编译器为提高访问效率会在成员间填充字节，使每个成员地址满足对齐要求。用#pragma pack(1)或__attribute__((packed))取消对齐（但影响性能）。\n\n结构体可以赋值（整体复制）、作为函数参数（值传递时整体复制，大结构体应传指针）。",problems:[{q:"struct { char a; int b; } s; sizeof(s)是多少？",a:"通常是8（不是5）。char占1字节，为使int对齐到4字节边界，编译器在a后填充3字节。具体值依平台而定",d:"hard"},{q:"Person *p; p->name 和 (*p).name 等价吗？",a:"完全等价，->是(*p).的语法糖，更简洁清晰",d:"easy"},{q:"结构体数组的每个元素也满足对齐要求吗？",a:"是的，编译器会在每个结构体末尾加填充，使数组中下一个元素也满足对齐要求",d:"medium"}]},

"clang-8-1":{explanation:"union（联合体）的所有成员共享同一块内存，大小等于最大成员的大小。同一时刻只能有效存储一个成员的值。用途：节省内存、查看不同类型的内存表示。\n\nenum（枚举）定义命名整数常量集合。enum Color {RED=0, GREEN=1, BLUE=2}; 枚举值默认从0开始，可以手动指定。枚举比#define有类型信息，比魔法数字（magic number）更可读。\n\ntypedef：为类型创建别名，如typedef struct Node Node; 或 typedef int (*FuncPtr)(int,int);。",problems:[{q:"union{int i; float f; char c[4];}u; u.i=65536; 此时u.f的值有意义吗？",a:"无确定意义。修改u.i后，u.f读取的是int的位模式按float解释的值，是类型双关（type punning），C语言允许但要注意字节序",d:"hard"},{q:"enum vs #define常量的优缺点",a:"enum优点：有类型，调试器可显示名称，有作用域；缺点：只能是整数。#define优点：可以是任意类型；缺点：无类型检查，调试难",d:"medium"},{q:"typedef struct Node { int data; struct Node *next; } Node; 如何理解？",a:"定义了一个自引用结构体（含指向同类型的指针，用于链表），同时用typedef为struct Node创建了Node别名，之后可用Node代替struct Node",d:"medium"}]},

"clang-8-2":{explanation:"链表是动态数据结构，由节点组成，每个节点包含数据和指向下一节点的指针。与数组相比：插入/删除O(1)但需找到位置，访问第i个元素O(n)。\n\n单链表基本操作：创建节点（malloc分配）、头插/尾插、遍历、查找、删除节点（需维护前驱指针）、释放所有节点。\n\n注意：每个malloc对应一个free，避免内存泄漏。删除节点时先保存next指针再free。",problems:[{q:"用C语言定义一个单链表节点",a:"typedef struct Node{ int data; struct Node *next; }Node; Node *head=NULL;",d:"easy"},{q:"头插法插入新节点的代码",a:"Node *newNode=malloc(sizeof(Node)); newNode->data=val; newNode->next=head; head=newNode;",d:"medium"},{q:"遍历链表并释放所有节点的代码",a:"Node *cur=head; while(cur){ Node *tmp=cur->next; free(cur); cur=tmp; } head=NULL;",d:"medium"}]},

// 第9章 文件操作

"clang-9-0":{explanation:"文件操作使用FILE*指针。fopen(filename, mode)打开文件，返回FILE*（失败返回NULL）。fclose(fp)关闭文件（必须关闭，否则数据可能未写入）。\n\n文件模式：\"r\"只读、\"w\"只写（清空原内容）、\"a\"追加、\"r+\"读写、\"rb\"/\"wb\"二进制读写。\n\n标准流：stdin（标准输入）、stdout（标准输出）、stderr（标准错误），都是FILE*类型，默认已打开。",problems:[{q:"fopen失败时返回什么？应如何处理？",a:"返回NULL。应检查：FILE *fp=fopen(\"a.txt\",\"r\"); if(fp==NULL){ perror(\"fopen\"); return -1; }",d:"easy"},{q:"\"w\"和\"a\"模式的区别？",a:"\"w\"：若文件存在则清空后写入，不存在则创建；\"a\"：若文件存在则在末尾追加，不存在则创建",d:"easy"},{q:"为什么一定要fclose？",a:"fclose刷新缓冲区（将缓冲的数据真正写入磁盘）并释放资源。不关闭可能导致数据丢失，也会消耗文件描述符",d:"medium"}]},

"clang-9-1":{explanation:"字符读写：fgetc(fp)/fputc(c,fp)，每次读写一个字符，EOF表示文件结束或错误。行读写：fgets(buf,n,fp)/fputs(str,fp)，fgets保留换行符并添加\\0。\n\n格式化读写：fscanf(fp,fmt,...)/fprintf(fp,fmt,...)，与scanf/printf类似但操作文件。\n\n读取文件直到结束的惯用法：while((c=fgetc(fp))!=EOF) 或 while(fgets(buf,SIZE,fp)!=NULL)。",problems:[{q:"用fgets逐行读取文件并打印",a:"FILE *fp=fopen(\"f.txt\",\"r\"); char buf[256]; while(fgets(buf,sizeof(buf),fp)) printf(\"%s\",buf); fclose(fp);",d:"easy"},{q:"fgets读取的字符串末尾会有'\\n'吗？",a:"如果行内容在缓冲区大小内，fgets会保留换行符\\n（和scanf不同）。如需去掉：buf[strcspn(buf,\"\\n\")]=0;",d:"medium"},{q:"fprintf可以写到stderr吗？",a:"可以：fprintf(stderr, \"Error: %s\\n\", msg); 比printf更好，因为错误信息输出到标准错误流，可单独重定向",d:"medium"}]},

"clang-9-2":{explanation:"二进制文件：fread(ptr,size,count,fp)/fwrite(ptr,size,count,fp) 读写原始字节。返回值是实际读写的count数（非字节数）。\n\nfseek(fp,offset,whence)定位文件指针：SEEK_SET从头、SEEK_CUR从当前、SEEK_END从尾。ftell(fp)返回当前位置（字节数）。rewind(fp)回到文件开头。\n\n二进制文件存储效率高，但不可读；文本文件可读但有换行符转换等问题（特别是在Windows和Linux之间）。",problems:[{q:"用fwrite写入一个int数组，fread读回",a:"fwrite(arr, sizeof(int), n, fp); // 写\nfread(arr, sizeof(int), n, fp);  // 读，返回实际读取的元素数",d:"medium"},{q:"如何获取文件大小？",a:"fseek(fp, 0, SEEK_END); long size = ftell(fp); rewind(fp); // 回到开头",d:"medium"},{q:"二进制文件在不同平台间传输有什么问题？",a:"字节序（大端/小端）不同、类型大小不同（int在32/64位下可能不同）、结构体对齐填充不同，需要序列化协议（如Protocol Buffers）保证兼容性",d:"hard"}]},

// 第10章 动态内存

"clang-10-0":{explanation:"动态内存管理函数（stdlib.h）：malloc(size)分配size字节（未初始化），calloc(n,size)分配n*size字节（初始化为0），realloc(ptr,newsize)调整大小，free(ptr)释放。\n\n内存泄漏：申请后未free，或free前指针被覆盖。野指针：free后继续使用，或未初始化的指针。double free：同一内存释放两次，导致堆损坏。\n\n防御性编程：free后将指针置NULL（free(p); p=NULL;），malloc后检查返回值是否为NULL。",problems:[{q:"malloc和calloc的区别？",a:"malloc(n)分配n字节，内容未定义（垃圾值）；calloc(n,s)分配n*s字节并清零。calloc速度略慢但更安全（避免意外使用垃圾值）",d:"easy"},{q:"为什么free后要把指针置NULL？",a:"防止悬空指针（dangling pointer）被意外使用。free后内存已归还，但指针变量仍指向原地址，再次解引用是未定义行为；置NULL后若意外解引用会立即崩溃（段错误），方便发现Bug",d:"medium"},{q:"realloc(ptr, 0)和free(ptr)等价吗？",a:"行为依实现：某些实现realloc(ptr,0)释放内存并返回NULL，某些返回非NULL指针。为了可移植性，应明确使用free(ptr)而非realloc(ptr,0)",d:"hard"}]},

"clang-10-1":{explanation:"预处理器在编译前处理：#define宏定义（函数宏、对象宏）、#include头文件包含、#ifdef/#ifndef/#endif条件编译。\n\n头文件防重复包含：#ifndef HEADER_H / #define HEADER_H / ... / #endif，或#pragma once（非标准但广泛支持）。防止同一头文件被多次包含导致重定义。\n\n条件编译应用：跨平台代码（#ifdef _WIN32 ... #else ... #endif）、调试开关（#ifdef DEBUG printf(...)#endif）。",problems:[{q:"头文件守卫（include guard）的作用是什么？",a:"防止头文件被多次包含（当A.h和B.h都包含C.h，main.c包含A.h和B.h时C.h会被包含两次导致重定义）",d:"medium"},{q:"#define MAX(a,b) (a)>(b)?(a):(b) 调用MAX(x++,y)有什么问题？",a:"x++会被展开两次（当x>y时），导致x被加2而非1。函数宏的参数副作用问题是常见陷阱，C++中应使用内联函数或模板",d:"hard"},{q:"如何用条件编译定义仅在Debug模式下打印的宏？",a:"#ifdef DEBUG\n#define LOG(msg) printf(\"[DEBUG] %s\\n\", msg)\n#else\n#define LOG(msg)\n#endif",d:"medium"}]},

"clang-10-2":{explanation:"越界访问（Buffer Overflow）：读写超出数组/缓冲区范围，可能破坏其他变量或返回地址（安全漏洞）。使用AddressSanitizer（-fsanitize=address）检测。\n\n野指针：使用未初始化或已释放的指针。内存泄漏：使用Valgrind（valgrind --leak-check=full）检测。\n\n调试工具：gdb（断点、单步、打印变量）、printf调试法、静态分析工具（cppcheck、Clang static analyzer）。",problems:[{q:"如何用gdb找到段错误的位置？",a:"gcc -g 编译，gdb ./a.out，run运行，崩溃后bt命令查看调用栈，找到出错行",d:"medium"},{q:"AddressSanitizer能检测哪些类型的内存错误？",a:"越界访问（heap/stack/global buffer overflow）、use-after-free（释放后使用）、use-after-return（返回后使用局部变量）、内存泄漏等",d:"medium"},{q:"什么是缓冲区溢出攻击？如何防范？",a:"攻击者通过溢出写入超长数据，覆盖返回地址，劫持程序控制流。防范：使用strncpy/snprintf等有边界检查的函数，开启栈保护（-fstack-protector），使用ASLR",d:"hard"}]},

});



/* ═══════ C++ 知识点详解 ═══════ */

Object.assign(kpDetails, {

// C++ 第1章

"cpp-1-0":{explanation:"C++在C基础上增加的核心扩展：命名空间（namespace）避免命名冲突；cin/cout替代scanf/printf（类型安全）；bool类型（true/false）；内联函数（inline）替代函数宏（有类型检查且无副作用问题）。\n\n命名空间：namespace MyLib{ void foo(); } 使用时MyLib::foo()或using namespace MyLib;。std是C++标准库命名空间。\n\nC++可以直接编译C代码，但混用时需注意extern \"C\"处理C函数的名字修饰。",problems:[{q:"using namespace std; 有什么弊端？",a:"可能引入命名冲突（如你自己定义了和std同名的函数）。在头文件中尤其危险（会污染所有包含该头文件的文件）。生产代码推荐明确写std::cout等",d:"medium"},{q:"inline函数和宏的区别？",a:"inline有类型检查、参数不会多次求值、可以调试；宏是纯文本替换，无类型，参数可能被求值多次。C++优先使用inline（或template）替代宏",d:"medium"},{q:"C++中可以在for循环初始化部分声明变量吗？",a:"可以：for(int i=0;i<n;i++) i的作用域限于循环体，这在C99前的C语言中不合法，C++一开始就支持",d:"easy"}]},

"cpp-1-1":{explanation:"引用是变量的别名，必须初始化（绑定后不可更改绑定）。int &r = a; r和a是同一个内存位置，修改r即修改a。\n\n引用传参（C++最常用）：void increment(int &x){ x++; } 比指针传参更简洁安全（无需检查NULL，无需解引用）。常量引用：const int &cr = expr; 可以绑定临时值，不可修改，常用于函数参数避免复制。\n\n引用和指针的区别：引用不能为null、不能重新绑定、使用时无需解引用语法。",problems:[{q:"引用和指针在传参时有什么区别？",a:"引用：语法简洁（直接用变量名），不可为空，不可重新绑定；指针：更灵活（可为NULL，可指向不同变量），需要*解引用",d:"medium"},{q:"const引用能绑定字面量吗？为什么？",a:"可以：const int &r=42; 编译器创建临时int对象存储42，const引用延长其生命期。非const引用不能绑定临时值（因为修改临时值无意义）",d:"hard"},{q:"以下代码输出什么？ int a=1,&r=a; r=2; cout<<a;",a:"输出2。r是a的别名，r=2即a=2",d:"easy"}]},

"cpp-1-2":{explanation:"函数重载：同名函数具有不同的参数列表（类型、数量或顺序），编译器根据调用时的参数选择最匹配的版本。返回类型不同不构成重载。\n\n默认参数：void foo(int a, int b=10, int c=20);，有默认值的参数必须在无默认值参数的右边，调用时可省略后面的参数。\n\n重载解析：编译器选择最佳匹配（精确匹配>类型提升>标准转换>用户自定义转换>...），若有歧义则报错。",problems:[{q:"以下重载是否合法？int f(int x); float f(int x);",a:"不合法。重载仅靠返回类型不同是不够的，编译器在调用f(5)时无法区分应调用哪个版本",d:"easy"},{q:"默认参数能在声明和定义中都写吗？",a:"不能重复，只能写一次。通常写在声明（头文件）中，定义（实现文件）中不重复写。重复写会导致编译错误",d:"medium"},{q:"void f(int a); void f(double a); 调用 f(3.14f) 会调用哪个？",a:"float实参，与double更接近（无需截断），调用f(double)版本",d:"hard"}]},

// C++ 第2章

"cpp-2-0":{explanation:"class关键字定义类，成员默认私有（struct默认公有）。访问控制：private（仅类内访问）、protected（类内和子类访问）、public（所有人访问）。\n\n封装原则：数据成员通常设为private，通过public成员函数（getter/setter）访问，防止外部直接修改破坏对象状态。\n\n成员函数在类外定义时需要ClassName::前缀。inline成员函数可在类内直接定义。",problems:[{q:"class和struct在C++中的唯一区别是什么？",a:"默认访问级别：class成员默认private，struct成员默认public。其他特性（继承、成员函数等）完全相同",d:"easy"},{q:"为什么数据成员要设为private而非public？",a:"封装性：外部代码无法直接修改内部状态（可能破坏类的不变量）。通过函数访问可以添加验证逻辑，也便于后续修改实现而不影响接口",d:"medium"},{q:"友元函数（friend）破坏封装吗？何时使用？",a:"从某种程度上破坏封装，但有时是必要的（如运算符重载、性能敏感代码、测试框架）。应谨慎使用，以最小化友元",d:"hard"}]},

"cpp-2-1":{explanation:"构造函数在对象创建时自动调用，与类同名，无返回类型。可以重载（多个构造函数）。初始化列表：冒号后、函数体前，如Point(int x,int y):x_(x),y_(y){}，比在函数体内赋值更高效。\n\n拷贝构造函数：ClassName(const ClassName &other)，默认是浅拷贝（逐成员复制）。若有动态内存，需要自定义深拷贝。\n\n析构函数：~ClassName()，对象生命期结束时自动调用，用于释放资源。",problems:[{q:"初始化列表和构造函数体内赋值有什么区别？",a:"初始化列表直接初始化成员（调用成员的构造函数），函数体内是先默认构造再赋值。对const成员和引用成员，只能用初始化列表",d:"medium"},{q:"什么情况下必须自定义拷贝构造函数？",a:"当类有动态分配的内存（裸指针指向heap）时，默认浅拷贝只复制指针值，两个对象指向同一内存，析构时double free。需要深拷贝（另外分配内存并复制内容）",d:"hard"},{q:"析构函数何时被调用？",a:"局部对象：出作用域时；堆对象：delete时；全局/static对象：程序结束时。不会被显式调用（一般情况）",d:"easy"}]},

"cpp-2-2":{explanation:"this指针是指向当前对象的隐式指针，每个非static成员函数都有一个隐式的this参数。通过this->访问成员，或直接用成员名（编译器自动加this->）。\n\nthis的典型用途：返回对象本身（链式调用：return *this;）、区分成员变量与同名参数（this->x = x;）、传递当前对象给其他函数。\n\nstatic成员函数没有this指针（不属于特定对象，通过类名调用）。const成员函数中this是const指针（不能修改成员）。",problems:[{q:"return *this 有什么用途？",a:"返回当前对象的引用，使成员函数可以链式调用：obj.setX(1).setY(2).print(); 类似于Builder模式",d:"medium"},{q:"const成员函数中为何不能修改成员变量？",a:"const成员函数的this指针是const Type*（指向常量），通过它不能修改成员。若某成员需要在const函数中修改，用mutable修饰",d:"hard"},{q:"静态成员函数和普通成员函数的区别",a:"静态成员函数没有this指针，不能访问非静态成员，通过类名而非对象调用（ClassName::func()），常用于工厂方法或辅助函数",d:"medium"}]},

// C++ 第3章

"cpp-3-0":{explanation:"运算符重载使自定义类型支持+、-、==等运算符，语法：RetType operator@(params)。可作为成员函数（隐含左操作数为this）或友元函数（两个参数显式）。\n\n可重载：算术、关系、逻辑、位、赋值、下标[]、函数调用()、类型转换等。不可重载：::、.、.*、?:、sizeof。\n\n建议：单目运算符作成员函数；双目运算符若左操作数可变则作成员函数，否则（如cout<<）作友元函数。",problems:[{q:"operator+作为成员函数和友元函数的区别？",a:"成员函数：左操作数是this（Vector v3 = v1+v2中v1是this）；友元函数：两个操作数都是显式参数（需要友元才能访问private）",d:"medium"},{q:"为什么operator<<通常作为友元而非成员函数？",a:"<<的左操作数是ostream（不是我们自己的类），成员函数的左操作数必须是该类对象，所以只能作非成员（友元）函数",d:"hard"},{q:"可以重载operator=但不重载operator+吗？",a:"可以，各运算符独立重载，互不依赖。但建议保持语义一致：若重载==，也应重载!=",d:"easy"}]},

"cpp-3-1":{explanation:"常见运算符重载：+/-（返回新对象）、+=/-=（修改并返回*this引用）、==/!=（返回bool）、<</>>(ostream/istream，返回流引用实现链式)、[]（返回引用可作左值）。\n\n一致性原则：a+b应该等价于a+=b的效果（可以用+=实现+）；==和!=应该互为否定关系。\n\n性能考虑：+运算符返回临时对象，频繁字符串拼接时考虑+=或string::append。",problems:[{q:"实现Vector类的operator+",a:"Vector operator+(const Vector &b) const { return Vector(x+b.x, y+b.y); } // const成员函数，返回新对象",d:"medium"},{q:"为什么operator+=返回引用而operator+返回值？",a:"+=修改自身并返回*this引用（支持a+=b+=c）；+创建新对象返回，不能返回局部变量的引用",d:"hard"},{q:"operator<<如何实现链式输出 cout<<a<<b<<c ？",a:"返回ostream&：ostream& operator<<(ostream&os, const T&t){ os<<t.val; return os; } 链式调用中每次返回同一os",d:"medium"}]},

"cpp-3-2":{explanation:"默认赋值运算符（=）是浅拷贝（逐成员赋值）。有动态内存时需要自定义：释放旧内存，深拷贝新内存，注意自赋值检查（if(this==&other) return *this;）。\n\n三/五法则：若自定义析构函数，通常也需要自定义拷贝构造和赋值运算符（三法则）。C++11加入移动语义后扩展为五法则（加上移动构造和移动赋值）。\n\n移动语义简介：右值引用T&&，std::move转移所有权（避免深拷贝），移动构造/赋值后源对象应处于有效但未指定状态。",problems:[{q:"赋值运算符为何需要自赋值检查？",a:"若a=a，先释放a的内存，再尝试从a（已释放）复制，导致悬空指针。检查：if(this==&other) return *this;",d:"medium"},{q:"移动语义解决什么问题？",a:"避免不必要的深拷贝。如函数返回大对象时，移动语义直接'转让'内部资源（如堆内存的所有权），而不是先复制再销毁",d:"hard"},{q:"什么是Rule of Three（三法则）？",a:"如果类需要自定义析构函数（通常因为有动态资源），则也应自定义拷贝构造函数和拷贝赋值运算符，三者应一起出现",d:"medium"}]},

// C++ 第4章

"cpp-4-0":{explanation:"继承允许派生类获得基类的属性和行为，实现代码复用和层次化设计。继承方式：public（最常用，保持访问级别）、protected（public变protected）、private（全变private）。\n\npublic继承表达'is-a'关系（Dog is an Animal），private继承表达'is-implemented-in-terms-of'（用基类实现的）。\n\n继承自基类的成员（根据访问控制）可在派生类中直接使用。派生类可以重写（override）基类的虚函数。",problems:[{q:"public、protected、private继承的主要区别",a:"public继承：基类的public/protected成员在派生类中保持原级别；protected继承：public成员变protected；private继承：public和protected成员变private",d:"medium"},{q:"C++中为什么用public继承而非private继承？",a:"public继承（is-a）是最常见的面向对象继承。派生类对象可以赋给基类指针（里氏替换原则）。private继承更像'利用基类实现'，不支持多态替换",d:"medium"},{q:"继承中访问控制与友元的关系",a:"友元关系不被继承：基类的友元不能访问派生类新增的private成员；派生类的友元不能访问基类的private成员",d:"hard"}]},

"cpp-4-1":{explanation:"构造顺序：基类构造函数先于派生类（从最顶层基类开始）。派生类构造函数的初始化列表中可以显式调用基类构造函数，否则调用默认构造函数。\n\n析构顺序：与构造相反（派生类先于基类）。\n\noverride关键字（C++11）：在派生类中标记虚函数覆盖，编译器检查基类中是否有对应虚函数（防止拼写错误导致创建新函数而非覆盖）。final关键字：禁止进一步继承或重写。",problems:[{q:"派生类构造函数如何传参给基类构造函数？",a:"通过初始化列表：Derived(int a, int b) : Base(a) { ... } 在冒号后调用Base构造函数并传入参数",d:"medium"},{q:"基类析构函数为什么要是virtual的？",a:"若不是virtual，通过基类指针delete派生类对象时只调用基类析构函数，派生类析构函数不被调用，导致资源泄漏",d:"hard"},{q:"C++11的override关键字有什么好处？",a:"编译器检查函数是否真正覆盖了基类的虚函数。若拼错函数名或参数不匹配，不加override编译器不报错（创建了新函数而非覆盖），加了override则报编译错误",d:"medium"}]},

"cpp-4-2":{explanation:"多重继承：class C : public A, public B {}; C继承A和B的所有成员。菱形问题：若A和B都继承自X，C继承A和B，则C有两份X的成员。\n\n虚继承解决菱形问题：class A : virtual public X {}; class B : virtual public X {}; class C : public A, public B {}; 此时C只有一份X的成员。\n\n多重继承使用时需谨慎（复杂性高），C++中interface（纯虚类）的多重继承是合理的（类似Java接口）。",problems:[{q:"菱形继承如何导致二义性？如何解决？",a:"C::func()若A和B都从X继承了func()，C中有两份，调用c.func()编译器不知道用哪个。用虚继承（virtual public）使X只有一份，或明确指定C::A::func()",d:"hard"},{q:"虚继承的构造顺序有什么特点？",a:"虚基类由最终派生类直接构造（绑过中间类），避免多次构造。即C直接调用X的构造函数，A和B的初始化列表中对X的调用在C中被忽略",d:"hard"},{q:"为什么说多重继承和接口（纯虚类）组合是C++的最佳实践？",a:"继承具体类可能有菱形问题；继承纯虚类（接口）没有数据成员，无菱形问题，符合接口隔离原则",d:"medium"}]},

// C++ 第5章

"cpp-5-0":{explanation:"虚函数（virtual）实现运行时多态：通过基类指针/引用调用虚函数时，根据实际对象类型调用对应版本。实现机制：虚函数表（vtable）——每个有虚函数的类都有一个vtable，对象有一个vptr指向vtable。\n\nvtable是函数指针数组，调用虚函数时通过vptr查vtable再调用，有一次间接跳转的开销（通常可忽略）。\n\n非虚函数（静态绑定/早绑定）：在编译时确定调用哪个函数，效率高但不能多态。虚函数（动态绑定/晚绑定）：运行时确定。",problems:[{q:"虚函数和普通函数在底层调用上有什么区别？",a:"普通函数：编译时直接确定调用地址（直接跳转）；虚函数：运行时通过vptr→vtable→函数指针间接调用",d:"medium"},{q:"构造函数能是虚函数吗？析构函数呢？",a:"构造函数不能是虚函数（对象尚未构造，vptr未设置）；析构函数应该是虚函数（当通过基类指针删除派生类对象时需要调用正确的析构函数）",d:"hard"},{q:"override关键字和virtual关键字在派生类中都需要写吗？",a:"virtual可以省略（派生类重写的虚函数自动是虚函数）；override强烈建议写（编译器验证是真正的重写）",d:"medium"}]},

"cpp-5-1":{explanation:"纯虚函数：virtual RetType func() = 0; 含纯虚函数的类是抽象类，不能实例化，只能作为基类。派生类必须实现所有纯虚函数才能实例化。\n\n抽象类作为接口：定义一组派生类必须实现的协议，基类指针可以多态地调用不同实现。类似Java/C#的接口（interface）。\n\n纯虚析构函数：可以存在但必须提供实现（否则链接错误），通常用于创建只能作为基类的抽象类。",problems:[{q:"抽象类能有非纯虚成员函数吗？",a:"可以，抽象类可以有普通成员函数、普通虚函数、纯虚函数、数据成员。派生类可以继承非纯虚实现",d:"medium"},{q:"如果派生类只实现了一部分纯虚函数，派生类还是抽象类吗？",a:"是的，仍有未实现的纯虚函数的类仍是抽象类，不能实例化，需要进一步派生并实现所有纯虚函数",d:"medium"},{q:"接口（纯抽象类）和普通基类的选择原则",a:"接口（全纯虚函数）适合定义行为契约；普通基类适合提供共享实现。'依赖接口而非实现'是面向对象设计原则",d:"hard"}]},

"cpp-5-2":{explanation:"若基类析构函数非虚，通过基类指针delete派生类对象时只调用基类析构函数，派生类成员（尤其是堆内存）不被释放——内存泄漏。\n\n解决方案：将基类析构函数声明为virtual，这样delete基类指针时会调用派生类析构函数（再自动调用基类析构函数）。\n\n指导原则：只要类有任何虚函数，就应该有虚析构函数（因为类已经支持多态）。",problems:[{q:"演示基类析构函数非虚时的内存泄漏",a:"class A{...}; class B:public A{ int *p; B(){p=new int;} ~B(){delete p;} };\nA *a=new B; delete a; // ~A()被调用，~B()不被调用，p未被delete，内存泄漏",d:"medium"},{q:"虚析构函数的开销是什么？",a:"为类引入虚函数表（若原本没有虚函数的话），每个对象多一个vptr指针（通常8字节）。对已有虚函数的类，几乎没有额外开销",d:"hard"},{q:"什么时候不需要虚析构函数？",a:"当类不作为多态基类使用（不通过基类指针/引用管理对象）时，如final类、值类型、CRTP中的基类。非多态基类（如std::iterator_traits）不需要虚析构",d:"hard"}]},

// C++ 第6章

"cpp-6-0":{explanation:"函数模板：template<typename T> T max(T a, T b){ return a>b?a:b; } 调用时编译器自动推导类型（或手动指定max<double>(1,2.5)）。\n\n模板在编译时实例化，为每种类型生成不同的函数代码（不同于运行时多态）。模板必须在头文件中定义（因为编译每个翻译单元时需要看到模板定义）。\n\n模板参数可以是类型（typename T）或非类型（如int N），如template<int N> 用于编译期常量。",problems:[{q:"template<typename T>和template<class T>有什么区别？",a:"在函数模板和类模板中两者完全等价（历史原因保留了class写法）。只有在模板模板参数时typename和class有区别（一般用class）",d:"easy"},{q:"模板为什么必须放在头文件中？",a:"编译器在实例化模板时需要看到完整的模板定义。如果定义在.cpp中，其他.cpp文件无法实例化，导致链接错误",d:"hard"},{q:"模板特化和重载有什么区别？",a:"重载是不同函数同名；模板特化是对模板的特定类型提供专门实现（全特化/偏特化）。编译器优先选择全特化>偏特化>主模板",d:"hard"}]},

"cpp-6-1":{explanation:"类模板：template<typename T> class Stack{ T data[100]; int top; ... }; 实例化：Stack<int> s;。\n\n成员函数在类外定义时：template<typename T> void Stack<T>::push(T val){ ... }，注意需要template<typename T>前缀。\n\n偏特化（partial specialization）：对类模板的部分参数特化，如template<typename T> class Vector<T*> 为所有指针类型提供专门实现。",problems:[{q:"Stack<int>和Stack<double>是同一个类吗？",a:"不是，它们是从同一个类模板实例化出的两个不同类，各有自己的代码和类型系统",d:"easy"},{q:"类模板能继承非模板类吗？反之呢？",a:"可以互相继承：template<typename T> class Derived : public Base 或 class Concrete : public Template<int>",d:"medium"},{q:"std::vector是如何实现的（概念层面）？",a:"大致是：动态数组，初始分配固定大小，元素增加超出容量时分配更大的数组（通常2倍）并移动元素，提供随机访问迭代器",d:"hard"}]},

"cpp-6-2":{explanation:"模板元编程（TMP）：利用模板在编译期执行计算。编译期计算：template<int N> struct Factorial{ static const int value = N * Factorial<N-1>::value; }; 在编译时算出N!。\n\nenable_if（C++11，<type_traits>）：template<typename T, typename=enable_if_t<is_integral_v<T>>> void f(T t){}; 只对整数类型启用此函数（SFINAE原则）。\n\nconstexpr（C++11）提供了更友好的编译期计算方式，很大程度上替代了TMP。",problems:[{q:"constexpr函数和模板元编程相比有什么优势？",a:"constexpr更易读易写（像普通函数），编译器支持好，调试方便；TMP语法复杂，错误信息难读。C++14/17的constexpr更强大，推荐优先使用",d:"medium"},{q:"SFINAE是什么？有什么用？",a:"Substitution Failure Is Not An Error：模板参数替换失败时不报错，只是忽略该重载。用于根据类型属性启用/禁用模板（enable_if）",d:"hard"},{q:"什么时候需要模板元编程？",a:"需要编译期计算（如维度检查）、根据类型选择不同算法（策略模式）、生成类型安全的代码（如tuple）等。现代C++优先用constexpr和if constexpr",d:"hard"}]},

// C++ 第7章 STL

"cpp-7-0":{explanation:"STL容器：sequence（vector、list、deque）、associative（map、set、multimap/multiset）、unordered（unordered_map、unordered_set）。\n\nvector：动态数组，随机访问O(1)，末尾插入均摊O(1)，中间插入O(n)。list：双向链表，插入删除O(1)，随机访问O(n)。map：红黑树，有序，操作O(log n)。unordered_map：哈希表，平均O(1)但最坏O(n)。\n\n选型原则：默认用vector；需要快速插入删除中间用list；需要按键查找用map或unordered_map。",problems:[{q:"vector的push_back为什么是'均摊O(1)'而非O(1)？",a:"vector满时会重新分配更大内存（通常2倍）并复制所有元素，这次操作是O(n)。但由于每次扩容后可以连续进行n次O(1)的push_back，均摊下来每次O(1)",d:"medium"},{q:"map和unordered_map如何选择？",a:"需要有序遍历或范围查询用map（红黑树，O(log n)）；只需要O(1)查找用unordered_map（哈希，但有最坏O(n)）。unordered_map需要key可哈希（基本类型自动支持，自定义类型需提供hash函数）",d:"medium"},{q:"什么时候用set而非vector+sort？",a:"频繁插入/删除+保持有序时用set；一次性排序后只读时用vector+sort（缓存友好，性能更好）",d:"hard"}]},

"cpp-7-1":{explanation:"迭代器是STL的核心抽象，统一访问不同容器的元素。分类：输入（只读一次）、输出（只写一次）、前向、双向（list）、随机访问（vector）。\n\n基本用法：auto it=v.begin(); ++it; *it访问元素; v.end()是末尾后一位（不可解引用）。\n\nC++11范围for循环：for(auto &x : v) 等价于迭代器遍历，更简洁。auto关键字让编译器推断类型。",problems:[{q:"end()迭代器能解引用吗？",a:"不能，end()指向末尾后一位（past-the-end），解引用是未定义行为。通常用 it != v.end() 作为循环终止条件",d:"easy"},{q:"vector的insert/erase操作后迭代器为何失效？",a:"insert可能触发扩容（重新分配内存），所有迭代器、指针和引用都失效；erase使被删除位置及其后的迭代器失效",d:"hard"},{q:"如何用迭代器反向遍历容器？",a:"用rbegin()/rend()：for(auto it=v.rbegin();it!=v.rend();++it) 或范围for加reverse_view（C++20）",d:"medium"}]},

"cpp-7-2":{explanation:"STL算法（<algorithm>）通过迭代器对容器操作，与容器类型无关。常用算法：sort（快排/堆排，O(n log n)）、find（线性查找）、binary_search（二分，需已排序）、transform（映射）、accumulate（折叠）。\n\nlambda表达式（C++11）：[capture](params)->ret{body}，用于算法的谓词/比较器。[=]按值捕获，[&]按引用捕获。\n\n算法不改变容器大小，insert_iterator（back_inserter）配合copy/transform向容器追加。",problems:[{q:"sort的自定义比较器如何写（降序排列）？",a:"sort(v.begin(), v.end(), [](int a, int b){ return a>b; }); 或 sort(v.begin(), v.end(), greater<int>());",d:"easy"},{q:"accumulate(v.begin(),v.end(),0)能用于哪些操作？",a:"求和（初始值0，默认+）；乘积：accumulate(v.begin(),v.end(),1,multiplies<int>())；连接字符串等。实际上是fold left",d:"medium"},{q:"STL算法为什么不直接修改容器大小而是用output iterator？",a:"算法与容器解耦是STL设计哲学。通过back_inserter等适配器，算法可以向任意容器追加，保持了算法的通用性",d:"hard"}]},

// C++ 第8章 异常处理

"cpp-8-0":{explanation:"异常处理：try包裹可能抛出异常的代码；catch捕获并处理异常；throw抛出异常（任意类型，通常是异常对象）。\n\n当异常抛出且无catch处理时，栈展开（stack unwinding）：依次调用栈上对象的析构函数，再向上传播。若未被捕获，调用std::terminate()终止程序。\n\ncatch(...)捕获所有类型的异常（通常作为最后的兜底）。noexcept（C++11）承诺函数不抛异常，编译器优化。",problems:[{q:"栈展开（stack unwinding）是什么？",a:"异常传播时，运行时自动调用所有已构造的局部对象的析构函数（按逆序），确保资源被释放，这就是RAII与异常安全的基础",d:"hard"},{q:"重新抛出异常（rethrow）如何写？有什么用？",a:"catch块中用 throw;（无参数）重新抛出当前异常。用途：catch记录日志后继续向上传播，或部分处理后交给上层",d:"medium"},{q:"noexcept函数中抛出异常会怎样？",a:"调用std::terminate()直接终止程序（不做栈展开）。移动构造函数标记noexcept可使vector等容器优先使用移动而非拷贝",d:"hard"}]},

"cpp-8-1":{explanation:"标准异常类层次（<stdexcept>）：std::exception（根）→ logic_error（程序逻辑错误，如invalid_argument、out_of_range）/ runtime_error（运行时错误，如overflow_error、range_error）。\n\n建议：catch时用引用（catch(const std::exception &e){}）避免切片（slicing）；从std::exception派生自定义异常（提供what()方法）。\n\n异常安全级别：无保证、基本保证（不泄漏资源，对象处于有效状态）、强保证（操作成功或无副作用）、不抛出保证。",problems:[{q:"为什么catch要用引用而非值？",a:"用值捕获时，若实际抛出的是子类异常，捕获为基类会发生切片（slicing，子类部分被截断）。引用捕获保留多态性（what()等虚函数正常工作）",d:"hard"},{q:"如何自定义异常类？",a:"继承std::exception并重写what()：class MyError:public std::exception{ string msg; public: MyError(string m):msg(m){} const char* what() const noexcept override{ return msg.c_str(); } };",d:"medium"},{q:"catch(...)在什么情况下使用？",a:"1)作为最后兜底防止程序崩溃（记录后terminate）；2)析构函数中防止异常传出（析构函数不应抛异常）；3)需要对所有异常做同样处理",d:"medium"}]},

"cpp-8-2":{explanation:"RAII（Resource Acquisition Is Initialization）：资源在构造函数中获取，在析构函数中释放。异常发生时，栈展开会调用析构函数，确保资源不泄漏。\n\n经典RAII：std::lock_guard（互斥锁）、std::unique_ptr（内存）、std::fstream（文件）。不再需要try-finally（C++没有finally）。\n\n智能指针简介：unique_ptr独占所有权、shared_ptr共享所有权（引用计数）、weak_ptr打破循环引用。",problems:[{q:"RAII如何确保异常安全？",a:"对象的析构函数即使在异常传播时也会被调用（栈展开），所以将资源释放放在析构函数中，无论正常退出还是异常退出，资源都会被释放",d:"medium"},{q:"unique_ptr和shared_ptr的主要区别",a:"unique_ptr：独占所有权，不可复制只可移动，零开销（与原始指针相同性能）；shared_ptr：引用计数共享所有权，可复制，有计数开销（原子操作）",d:"medium"},{q:"为什么应该用make_unique/make_shared而非直接new？",a:"异常安全（表达式中new的顺序问题）；效率（shared_ptr+new需要两次分配，make_shared一次）；语义清晰（表明所有权）",d:"hard"}]},

// C++ 第9章 现代C++

"cpp-9-0":{explanation:"unique_ptr：独占所有权，不可复制（只可移动），离开作用域自动delete。std::make_unique<T>(args)创建（C++14）。\n\nshared_ptr：引用计数，可复制，最后一个shared_ptr销毁时delete。std::make_shared<T>(args)创建，use_count()查询计数。\n\nweak_ptr：不增加引用计数，用于打破循环引用（A持有B的shared_ptr，B持有A的shared_ptr导致泄漏，改用weak_ptr）。用前需lock()转为shared_ptr。",problems:[{q:"unique_ptr能传入函数参数吗？如何传？",a:"传值需std::move（转移所有权）：func(std::move(ptr))后ptr为空；传引用（void func(unique_ptr<T>&)）保留所有权；也可直接传T*（func(ptr.get())）",d:"hard"},{q:"shared_ptr的循环引用如何产生？如何打破？",a:"A有shared_ptr<B>，B有shared_ptr<A>，双方引用计数永不为0，内存泄漏。解决：将B中的A改为weak_ptr<A>",d:"hard"},{q:"make_shared比new更好在哪里？",a:"一次内存分配（控制块和对象在一起），减少内存碎片；异常安全；代码更简洁",d:"medium"}]},

"cpp-9-1":{explanation:"右值引用（T&&）绑定到右值（临时对象、将亡值）。std::move将左值转为右值引用（允许移动语义，不真正移动）。\n\n移动构造函数：从右值'窃取'资源（如直接复制指针并将源指针置null），避免深拷贝。移动后源对象处于有效但未指定状态。\n\n完美转发：template<typename T> void wrapper(T&&arg){ func(std::forward<T>(arg)); } 将参数以原始值类别（左值/右值）转发。",problems:[{q:"std::move真的移动了什么吗？",a:"std::move本身不移动任何数据，只是将左值转型为右值引用（类型转换）。实际的资源转移发生在移动构造/赋值函数中",d:"medium"},{q:"什么情况下会自动调用移动构造函数而非拷贝构造函数？",a:"初始化对象用右值时（如函数返回值，std::move的结果）。RVO（返回值优化）可能跳过移动直接构造",d:"hard"},{q:"移动后的对象还能使用吗？",a:"可以，但状态未指定（valid but unspecified）。不应依赖其值，但可以对其再次赋值或销毁",d:"medium"}]},

"cpp-9-2":{explanation:"Lambda表达式：[capture](params) -> rettype { body }，创建匿名函数对象（闭包）。捕获列表：[]不捕获、[=]按值复制、[&]按引用捕获、[x, &y]混合。\n\nLambda配合STL算法极为强大：sort(v.begin(),v.end(),[](const T&a, const T&b){return a.key < b.key;})。\n\n可以将lambda存入auto变量、std::function<ret(args)>或作为模板参数传递。std::function有运行时开销，性能敏感时用auto或模板。",problems:[{q:"[=]和[&]捕获的区别？各有什么风险？",a:"[=]按值复制捕获（lambda有自己的副本，安全但可能开销大）；[&]按引用捕获（引用外部变量，高效但有悬空引用风险——若lambda生命期超过被捕获变量）",d:"medium"},{q:"lambda和std::function有什么关系？",a:"每个lambda是唯一类型（编译器生成的类），std::function可以存储任何可调用对象（lambda、函数指针、仿函数）。std::function有虚调用开销，auto更高效",d:"hard"},{q:"mutable lambda有什么用？",a:"默认lambda的operator()是const，不能修改按值捕获的变量。加mutable后可以修改：[x]() mutable { x++; return x; }，但不影响外部原变量",d:"medium"}]},

// C++ 第10章 文件流

"cpp-10-0":{explanation:"C++文件流（<fstream>）：ifstream读文件、ofstream写文件、fstream读写。比C的FILE*更安全（RAII，超出作用域自动关闭）、有类型安全（>>运算符）。\n\n打开：ifstream fin(\"file.txt\") 或 fin.open(\"file.txt\");。关闭：fin.close()（或让对象析构）。检查：fin.is_open()、fin.fail()。\n\n逐行读取：getline(fin, line)（不保留\\n，比fgets更方便）。",problems:[{q:"ifstream vs FILE*读文件，主要优势是什么？",a:"RAII（自动关闭）；类型安全（>>自动处理类型）；可以读写std::string（FILE*只能char*）；与STL算法集成；异常支持",d:"medium"},{q:"如何判断文件读取到末尾？",a:"while(getline(fin,line)) 读到EOF返回false自动退出；或 while(!fin.eof()) 但eof()在读取前不设置，容易多读一次，推荐用getline的返回值判断",d:"medium"},{q:"如何用fstream同时读写同一文件？",a:"fstream f(\"file.bin\", ios::in|ios::out|ios::binary); 用seekg/seekp移动读/写指针分别操作",d:"hard"}]},

"cpp-10-1":{explanation:"stringstream（<sstream>）：ostringstream用于将各类型格式化为字符串，istringstream用于从字符串解析数据。比sprintf更安全，比手动拼接更方便。\n\n常见用法：字符串分割（istringstream按空格/分隔符解析）、数字转字符串（ostringstream ss; ss<<num; ss.str()）、字符串转数字（stoi/stod/stoll，C++11更简单）。\n\nC++11起推荐用std::to_string()和std::stoi()等函数替代stringstream进行简单转换。",problems:[{q:"用stringstream将int和double拼接为字符串",a:"ostringstream ss; ss<<\"x=\"<<x<<\", y=\"<<y; string s=ss.str();",d:"easy"},{q:"用istringstream按空格分割字符串",a:"istringstream iss(str); string word; while(iss>>word) words.push_back(word);",d:"medium"},{q:"stringstream和sprintf的对比",a:"sprintf：C风格，缓冲区大小需手动管理（溢出风险），效率略高；stringstream：C++风格，自动管理内存，类型安全，可以处理任意类型",d:"medium"}]},

// C++ 第11章 并发

"cpp-11-0":{explanation:"std::thread（<thread>）：thread t(func, args...)创建线程，t.join()等待完成，t.detach()分离（后台运行，不再join）。\n\n线程参数传递：默认按值复制，传引用需std::ref(var)，传指针直接传。注意生命周期：线程引用的变量必须在线程完成前有效。\n\njoinable()检查线程是否可join（join或detach前应检查，否则析构时terminate）。",problems:[{q:"join和detach的区别？各适用什么场景？",a:"join()阻塞等待线程完成（适合需要结果或确保资源的场景）；detach()分离后台运行（适合不关心结果的后台任务，但要确保线程访问的资源生命期足够长）",d:"medium"},{q:"以下代码有什么问题？ void foo(){ int x=0; thread t([&x]{x++;}); t.detach(); }",a:"x是局部变量，foo()返回后x被销毁，但线程可能仍在运行并访问x（悬空引用，未定义行为）。detach的线程不能引用局部变量",d:"hard"},{q:"C++11的thread与POSIX pthread相比有什么优势？",a:"跨平台（Windows/Linux/Mac统一API）；RAII管理；与标准库集成（mutex、condition_variable、future均在std命名空间）；类型安全",d:"medium"}]},

"cpp-11-1":{explanation:"std::mutex互斥锁：lock()/unlock()，但直接调用容易忘unlock（异常安全问题）。std::lock_guard<mutex>：RAII，构造时lock，析构时unlock。std::unique_lock：更灵活，支持延迟加锁、手动解锁、timed_lock。\n\nstd::condition_variable：wait(lock, pred)等待（自动释放锁并阻塞，唤醒后重新获取锁检查谓词）；notify_one()/notify_all()唤醒等待线程。\n\ndeadlock（死锁）：A等B释放锁，B等A释放锁。预防：所有线程按相同顺序加锁，或用std::lock(mu1,mu2)同时锁多个。",problems:[{q:"为什么推荐lock_guard而非直接lock/unlock？",a:"lock_guard在析构时自动unlock，即使函数异常返回也能正确解锁（RAII）。直接lock/unlock若遗漏或异常会导致死锁",d:"easy"},{q:"condition_variable的wait为什么需要谓词（predicate）参数？",a:"防止虚假唤醒（spurious wakeup）：wait()可能无故返回，谓词确保只有条件真正满足时才继续执行。惯用法：cv.wait(lk, []{return condition;});",d:"hard"},{q:"std::atomic和mutex的选择原则",a:"atomic适合单个简单变量的原子操作（无锁，性能好）；mutex适合需要保护多个变量/复杂操作的临界区（保证复合操作的原子性）",d:"hard"}]},

// C++ 第12章 设计模式

"cpp-12-0":{explanation:"单例（Singleton）：保证一个类只有一个实例。C++11起用静态局部变量实现线程安全单例：static T& getInstance(){ static T instance; return instance; }。\n\n工厂（Factory）：将对象创建逻辑与使用分离。简单工厂：createProduct(type)根据参数创建；工厂方法：子类决定创建哪种产品；抽象工厂：创建一族相关产品。\n\n观察者（Observer）：一对多依赖，Subject维护Observer列表，状态变化时通知所有Observer。类似事件/回调机制。",problems:[{q:"为什么C++11的Meyers Singleton是线程安全的？",a:"C++11标准保证：静态局部变量的初始化（第一次到达时）是线程安全的，编译器会生成加锁的初始化代码",d:"hard"},{q:"工厂方法模式解决什么问题？",a:"将对象创建推迟到子类，使代码对扩展开放（添加新产品类型无需修改工厂基类）。客户端只依赖抽象工厂接口，不依赖具体类",d:"medium"},{q:"观察者模式的C++实现核心是什么？",a:"Subject有vector<Observer*>（或function<void()>列表）；notify()遍历并调用每个observer的update()；observer注册/注销时修改列表",d:"medium"}]},

"cpp-12-1":{explanation:"代码规范：命名清晰（驼峰或下划线一致）、const正确性（能const的参数/返回值都加const）、头文件防重复、避免裸new/delete（用智能指针）。\n\nValgrind内存检测：valgrind --tool=memcheck --leak-check=full ./program，检测内存泄漏、无效读写、使用未初始化变量等。\n\nClang-tidy / cppcheck：静态分析工具，不运行程序即可发现潜在Bug（内存安全、逻辑错误、风格问题）。",problems:[{q:"const正确性（const correctness）指什么？",a:"尽量将不修改的参数声明为const引用（const T&），不修改成员的函数声明为const成员函数，避免不必要的修改。好处：防止意外修改、编译器优化、更好的文档",d:"medium"},{q:"如何用Valgrind检测内存泄漏？",a:"gcc -g 编译，运行 valgrind --leak-check=full ./program，LEAK SUMMARY会显示泄漏的字节数和发生位置的调用栈",d:"medium"},{q:"RAII与异常安全代码有什么关系？",a:"RAII使资源管理异常安全：局部RAII对象（智能指针、lock_guard等）在栈展开时自动释放资源，无需try-finally，代码更简洁，也不会因异常导致资源泄漏",d:"hard"}]},

});



/* ═══════ 数据结构与算法知识点详解（严蔚敏版 第三版） ═══════ */

Object.assign(kpDetails, {

// 第1章 绪论

"ds-1-0":{explanation:"【数据与数据结构的核心概念】\n数据（Data）：能被计算机处理的符号集合。\n数据元素（Data Element）：数据的基本单位，如链表中的节点。\n数据对象（Data Object）：性质相同的数据元素的集合。\n数据结构（Data Structure）：数据元素之间存在的一种或多种特定关系。\n\n【四类逻辑结构】\n1. 集合：元素同属一个集合，无其他关系\n2. 线性结构：一对一关系（线性表、栈、队列、串）\n3. 树形结构：一对多关系（树、二叉树）\n4. 图形结构：多对多关系（图）\n\n【两类存储结构】\n顺序存储：逻辑相邻的元素物理也相邻，用地址连续的内存（数组）实现\n链式存储：逻辑相邻的元素物理不一定相邻，用指针链接节点\n\n【数据运算】\n针对某种逻辑结构定义的操作，如查找、插入、删除、修改",problems:[{q:"数据结构中'逻辑结构'和'存储结构'的关系是什么？",a:"逻辑结构是从问题出发抽象的数学关系（与存储无关），存储结构是逻辑结构在计算机中的实现方式。同一逻辑结构可有多种存储结构（如线性表可用顺序或链式）",d:"medium"},{q:"请列举四种基本数据结构及其特点",a:"集合（无关系）、线性表（一对一）、树（一对多）、图（多对多）",d:"easy"},{q:"为什么说算法分析与数据结构密不可分？",a:"同一问题选用不同的数据结构，算法的时间和空间效率差异可能极大。如查找操作：数组O(n)，有序数组二分O(logn)，哈希表O(1)",d:"hard"}]},

"ds-1-1":{explanation:"【逻辑结构四种形态】\n集合、线性结构、树形结构、图形结构（详见上一节）。\n\n【顺序存储结构】\n用连续的存储单元存储数据元素，物理位置反映逻辑关系。\n优点：随机访问O(1)，节省空间（无指针开销）\n缺点：插入/删除需移动大量元素O(n)\n\n【链式存储结构】\n每个节点存储数据+指针域，通过指针表达逻辑关系。\n优点：插入/删除O(1)（找到位置后），动态分配空间\n缺点：随机访问O(n)，额外指针空间\n\n【索引存储结构】\n建立一张索引表，通过索引表快速定位数据。如B树、哈希表\n\n【散列存储结构】\n通过哈希函数将关键字映射到存储地址，理想情况O(1)查找",problems:[{q:"顺序存储和链式存储各有什么优缺点？",a:"顺序存储：访问O(1)，插删O(n)，内存连续；链式存储：访问O(n)，插删O(1)（找到后），内存离散，有指针开销",d:"easy"},{q:"在什么情况下应选顺序存储，什么情况下选链式存储？",a:"查找频繁、插删少→顺序；插删频繁、查找少→链式；不确定大小、动态变化→链式",d:"medium"},{q:"举例说明同一逻辑结构的两种不同存储实现",a:"栈（LIFO线性结构）：顺序栈（数组+top指针）、链栈（链表+头节点）两种实现，逻辑功能相同，性能特性不同",d:"medium"}]},

"ds-1-2":{explanation:"【算法的五个基本要素】\n1. 有穷性：有限步骤内终止\n2. 确定性：每条指令有唯一含义，无二义性\n3. 可行性：每步操作均可实现\n4. 输入：0个或多个输入\n5. 输出：1个或多个输出\n\n【时间复杂度O分析】\n大O表示：忽略常数和低阶项，保留最高阶项\n常见复杂度排序：O(1)<O(logn)<O(n)<O(nlogn)<O(n²)<O(n³)<O(2ⁿ)\n\n最好/最坏/平均情况：\n- 顺序查找：最好O(1)、最坏O(n)、平均O(n/2)=O(n)\n- 快速排序：平均O(nlogn)、最坏O(n²)\n\n【空间复杂度】\n算法运行时额外占用的空间量\n原地算法：O(1)额外空间（如插入排序）\n递归算法：栈空间O(d)，d为递归深度\n\n【例题：计算复杂度】\nfor i=1..n: for j=1..n: O(n²)\nfor i=1..n: for j=1..i: O(n²)\nfor i=1..n: i=i*2: O(logn)",problems:[{q:"以下代码的时间复杂度是什么？for(int i=1;i<=n;i*=2){}",a:"O(logn)，每次i乘2，执行次数为log₂n",d:"easy"},{q:"递归求n!的时间和空间复杂度",a:"时间O(n)：调用n次；空间O(n)：递归栈深度为n",d:"medium"},{q:"双重循环 for(i=0;i<n;i++) for(j=i;j<n;j++) 的复杂度",a:"执行次数=n+(n-1)+...+1=n(n+1)/2，时间复杂度O(n²)",d:"medium"},{q:"O(1)的算法是否比O(n)快？举例说明",a:"不一定！O(1)的常数可能很大。如哈希表O(1)平均查找但常数大；数组O(n)顺序扫描如果n很小可能更快。大O分析仅在n足够大时有意义",d:"hard"}]},

// 第2章 线性表

"ds-2-0":{explanation:"【顺序表定义】\n用一组地址连续的存储单元依次存储线性表的数据元素。\ntypedef struct { ElemType data[MAXSIZE]; int length; } SqList;\n\n【基本操作及复杂度】\n初始化：O(1)\n取第i个元素：GetElem(L,i)，O(1)——随机访问优势\n\n插入 ListInsert(&L,i,e)：\n1. 判断i合法性（1≤i≤n+1）\n2. 判断是否满（length≥MAXSIZE）\n3. 将第i到第n个元素逐个后移\n4. 将e赋给第i个位置，length++\n时间复杂度：最好O(1)（尾部插入），最坏O(n)，平均O(n/2)=O(n)\n\n删除 ListDelete(&L,i,&e)：\n1. 判断i合法（1≤i≤n）\n2. 将第i+1到n个元素逐个前移\n3. length--\n时间复杂度：同插入O(n)\n\n【顺序表查找】\n按值查找（顺序查找）：O(n)\n若有序：折半查找O(logn)",problems:[{q:"顺序表第i个元素的地址计算公式",a:"LOC(aᵢ)=LOC(a₁)+(i-1)×d，其中d为每个元素占的字节数",d:"easy"},{q:"在长度为n的顺序表中插入一个元素，平均需要移动多少个元素？",a:"插入第i位需移动n-i+1个元素（i=1时最多移n个）。等概率下平均移动=(0+1+...+n)/(n+1)=n/2个",d:"medium"},{q:"顺序表长n，等概率删除，平均移动次数",a:"删除第i位需移动n-i个元素（i=1到n）。平均移动=(0+1+...+(n-1))/n=(n-1)/2个",d:"medium"},{q:"已知整数顺序表，设计原地去重算法（不使用额外空间，保持相对顺序）",a:"双指针法：j记录已去重部分末位，遍历i，a[i]≠a[j]时a[++j]=a[i]。时间O(n²)（或先排序O(nlogn)）",d:"hard"}]},

"ds-2-1":{explanation:"【单链表结构】\ntypedef struct LNode { ElemType data; struct LNode *next; } LNode, *LinkList;\n\n【头节点 vs 无头节点】\n带头节点：头节点L->next指向第一个元素，便于统一操作\n无头节点：L直接指向第一个元素，特判空链表\n\n【基本操作】\n头插法建表（逆序）：\nfor每个元素: 新节点->next=L->next; L->next=新节点;\n\n尾插法建表（顺序）：\n维护尾指针r，r->next=新节点; r=新节点;\n\n按序号查找第i个节点：O(n)遍历\np=L->next; j=1; while(p&&j<i){p=p->next;j++;}\n\n插入节点（在p之后插s）：s->next=p->next; p->next=s;\n删除p的后继节点：q=p->next; p->next=q->next; free(q);\n\n【与顺序表对比】\n查找：顺序表O(1) vs 链表O(n)\n插入/删除：顺序表O(n) vs 链表O(1)（找到位置后）\n空间：顺序表紧凑 vs 链表有指针开销",problems:[{q:"单链表删除第i个节点的算法步骤",a:"1.找第i-1个节点p；2.q=p->next；3.p->next=q->next；4.free(q)。注意边界：i=1时需修改头指针",d:"medium"},{q:"如何原地反转一个单链表？",a:"三指针法：pre=NULL,cur=head; while(cur){next=cur->next; cur->next=pre; pre=cur; cur=next;} 返回pre。时间O(n)空间O(1)",d:"hard"},{q:"如何判断单链表是否有环（Floyd判环）？",a:"快慢指针：slow每次走1步，fast每次走2步。若有环，fast和slow必然相遇；若fast到NULL说明无环",d:"hard"},{q:"头插法建链表得到的序列是原序列的什么？",a:"逆序！因为每次新节点插在头节点之后，最后插入的元素排在最前面",d:"easy"},{q:"设链表只知道某节点p（非最后节点），如何O(1)删除该节点？",a:"将p->next的data复制到p->data，然后删除p->next节点（p->next=p->next->next）",d:"hard"}]},

"ds-2-2":{explanation:"【循环单链表】\n最后一个节点的next指向头节点，形成环形结构。\n判空：L->next==L（带头节点）\n优点：从任意节点出发可遍历整个链表\n常用：只保留尾指针r（通过r可O(1)访问头节点r->next）\n\n合并两个循环链表（La尾接Lb）：\np=La->next; La->next=Lb->next->next; Lb->next=p; free(Lb头);\n\n【双向链表】\ntypedef struct DNode { ElemType data; struct DNode *prior, *next; } DNode;\n\n双向链表插入（在p之前插s）：\ns->prior=p->prior; p->prior->next=s;\ns->next=p; p->prior=s;\n\n双向链表删除节点p：\np->prior->next=p->next;\np->next->prior=p->prior; free(p);\n\n优点：既可前向遍历也可后向遍历\n缺点：每个节点多一个prior指针，操作更复杂",problems:[{q:"循环单链表判空的条件（带头节点）",a:"L->next == L，即头节点的next指回自身",d:"easy"},{q:"双向链表删除节点p的指针操作（写出两行代码）",a:"p->prior->next = p->next;\np->next->prior = p->prior;\nfree(p);",d:"medium"},{q:"循环链表比普通链表的优势在哪些应用中体现？",a:"约瑟夫环（循环遍历删除）、操作系统进程调度（循环轮转）、多边形表示（首尾相连）等",d:"medium"},{q:"如何用单链表实现双向链表的前驱查询（已知某节点p，找其前驱）？",a:"从头遍历，找到next==p的节点即为前驱。时间O(n)，这正是双向链表的优势所在",d:"hard"}]},

"ds-2-3":{explanation:"【多项式表示】\n用链表存储多项式P(x)=∑aᵢxⁱ，每个节点存系数和指数。\n相加操作：双指针同时遍历两个多项式链表，按指数大小合并。\n\n【约瑟夫环问题】\nn个人围圆圈，从第m个开始每隔k个删一人，最后剩下谁？\n用循环链表模拟：从第m个开始，每次跳k步，删除当前节点。\n\n【线性表的合并（集合求并）】\n将Lb中不在La中的元素插入La：\nfor b中每个元素e: if e不在La中: 将e插到La;\n时间复杂度O(La.length × Lb.length)\n\n【有序链表合并】\n双指针分别指向La和Lb头部，比较大小逐个归并。\n时间O(m+n)，空间O(1)（原地合并）\n\n【链表逆置】\n头插法：依次取原链表节点，头插到新链表。时间O(n)",problems:[{q:"两个有序顺序表合并的时间复杂度",a:"O(m+n)，m和n分别是两个顺序表的长度，最坏情况需比较m+n-1次",d:"easy"},{q:"约瑟夫环用循环链表模拟，n个人m个报数，时间复杂度",a:"O(n×m)：对每个被删除的节点，需要走m步找到它。",d:"medium"},{q:"链表实现的多项式加法比数组实现的优势",a:"链表只存非零项，对稀疏多项式（大量零系数）节省空间；插入排序按指数插入方便；缺点是指针额外开销",d:"hard"}]},

// 第3章 栈和队列

"ds-3-0":{explanation:"【栈的基本概念】\n栈（Stack）：限定仅在表尾进行插入和删除的线性表，LIFO（Last In First Out）。\n栈顶（top）：允许操作的一端；栈底（bottom）：不允许操作的一端。\n\n【顺序栈】\ntypedef struct { ElemType data[MAXSIZE]; int top; } SqStack;\n初始：S.top=-1（空栈）\nPush: S.data[++S.top]=e;\nPop: e=S.data[S.top--];\n满栈：S.top==MAXSIZE-1\n\n【链栈】\n以链表的头节点作为栈顶，头插法实现Push，头删法实现Pop。\n无须预先分配空间，不会溢出。\n\n【双栈共享空间】\n两个栈共享一个数组，从两端向中间增长。\ntop1初始=-1，top2初始=MAXSIZE\n满栈条件：top1+1==top2",problems:[{q:"顺序栈的Push操作（含满栈检测）",a:"if(S.top==MAXSIZE-1) return ERROR; S.data[++S.top]=e; return OK;",d:"easy"},{q:"顺序栈Pop操作（含空栈检测）",a:"if(S.top==-1) return ERROR; e=S.data[S.top--]; return OK;",d:"easy"},{q:"n个元素依次进栈后出栈的序列可能有多少种？",a:"卡特兰数C(2n,n)/(n+1)。n=3时有5种：123,132,213,231,312（不包括321等由于入栈顺序限制不可能的序列）",d:"hard"},{q:"已知入栈序列1,2,3，判断以下哪个不是合法出栈序列：A.3,2,1 B.2,1,3 C.1,3,2 D.3,1,2",a:"D不合法。3先出说明3最先入，意味着1,2已在栈中；3出后栈为[1,2]，下一个出的只能是2（栈顶），不能是1",d:"medium"}]},

"ds-3-1":{explanation:"【括号匹配】\n用栈检验括号是否匹配：遇左括号入栈，遇右括号弹出并检验是否配对。\n结束时栈空则匹配成功。\n\n【表达式求值】\n中缀转后缀（逆波兰表达式）：\n- 数字直接输出\n- 左括号入栈\n- 右括号：弹栈并输出直到遇到左括号\n- 运算符：弹出所有优先级≥当前的运算符，再将当前入栈\n后缀表达式求值：\n- 数字入栈\n- 运算符：弹两个操作数，计算后将结果入栈\n\n【递归与栈帧】\n每次递归调用时，系统在栈（调用栈）上保存：局部变量、返回地址、参数。\n递归深度 = 栈的最大深度\n\n【进制转换】\n十进制转N进制：反复取余并压栈，最后全部弹出。\nn=10转8进制：10%8=2,1%8=1（入栈），出栈得12（八进制）",problems:[{q:"如何用栈实现括号匹配检测？写出主要思路",a:"遍历字符串：左括号入栈；右括号时弹栈，若弹出的不匹配或栈空则不匹配。遍历结束后栈为空则匹配",d:"easy"},{q:"将中缀表达式 (A+B)*C-D/E 转为后缀表达式",a:"AB+C*DE/-（用运算符栈逐步处理：先处理括号内，再处理乘除，再处理减法）",d:"medium"},{q:"计算后缀表达式 23+4*56-/ 的值",a:"2+3=5，5*4=20，5-6=-1，20/-1=-20，结果为-20（步骤：2,3入栈→+弹出得5→5入栈，4入栈→*弹出得20→5,6入栈→-得-1→/得-20）",d:"hard"},{q:"递归求Fibonacci数列f(n)时，当n=20递归深度大约是多少？",a:"约20层（因为f(20)调用f(19)调用...f(1)，最深路径长度为n）",d:"easy"}]},

"ds-3-2":{explanation:"【队列基本概念】\n队列（Queue）：FIFO（先进先出），从队尾（rear）插入，从队头（front）删除。\n\n【循环队列（重点）】\n用数组模拟，解决假溢出问题：\ntypedef struct { ElemType data[MAXSIZE]; int front, rear; } SqQueue;\n初始：front=rear=0\nEnQueue: data[rear]=e; rear=(rear+1)%MAXSIZE;\nDeQueue: e=data[front]; front=(front+1)%MAXSIZE;\n判空：front==rear\n判满：(rear+1)%MAXSIZE==front （牺牲一个空间）\n元素个数：(rear-front+MAXSIZE)%MAXSIZE\n\n【链队列】\n用链表实现，头节点为队头，尾节点为队尾。\n带头节点：front指向头节点，rear指向最后一个节点。\n判空：front==rear（都指向头节点）",problems:[{q:"循环队列中，front=5, rear=3, MAXSIZE=8，队列中有多少个元素？",a:"(3-5+8)%8 = 6个",d:"medium"},{q:"循环队列判满和判空的条件（牺牲一个空间的方案）",a:"判空：front==rear；判满：(rear+1)%MAXSIZE==front",d:"easy"},{q:"如何用两个栈模拟一个队列？",a:"栈1用于入队，栈2用于出队。出队时若栈2为空，将栈1全部弹出压入栈2，再从栈2弹出。摊销时间O(1)",d:"hard"},{q:"双端队列（deque）与普通队列的区别",a:"双端队列两端都可插入和删除；普通队列只能从一端插入、另一端删除。C++的std::deque就是双端队列",d:"medium"}]},

"ds-3-3":{explanation:"【BFS广度优先遍历用队列】\n图和树的广度优先搜索使用队列实现，保证按层次顺序遍历。\n算法：根节点入队→队列不空时：弹队头、访问、将其所有未访问邻居入队\n\n【银行排队系统】\n队列的经典应用：顾客到来入队，柜台空闲则从队头取顾客。\n\n【消息队列】\n生产者-消费者模式：生产者将消息放入队列，消费者从队列取出处理。\n\n【打印机缓冲队列】\n多个打印任务按顺序排队，打印机依次处理。\n\n【CPU进程调度】\n时间片轮转：每个进程获得固定时间片，时间到后返回队尾等待。\n多级反馈队列：根据进程特性动态调整优先级。",problems:[{q:"用队列实现二叉树的层序遍历（写出主要代码框架）",a:"root入队; while(队不空){p=出队; 访问p; if(p->left)入队; if(p->right)入队;}",d:"medium"},{q:"队列在操作系统进程调度中有什么应用？",a:"就绪队列（FIFO或优先队列）、时间片轮转调度（循环队列）、I/O等待队列等",d:"medium"},{q:"BFS求最短路径为什么使用队列而不是栈？",a:"队列保证先访问距离短的节点（FIFO特性），栈会导致DFS（深度优先）而非BFS，无法保证最短路径",d:"hard"}]},

// 第4章 串

"ds-4-0":{explanation:"【串的基本概念】\n串（String）：零个或多个字符组成的有限序列，是线性表的特殊形式（元素为字符）。\n串的长度：串中字符个数\n空串：长度为0的串，记作 ''\n空格串：由一个或多个空格组成（不同于空串）\n子串：串中任意连续的字符组成的序列\n\n【串的存储结构】\n定长顺序存储：char S[MAXLEN+1]，S[0]存长度或用'\\0'结尾\n堆分配存储：动态分配字符数组，typedef struct{char*ch; int len;} HString\n块链存储：每个块存多个字符，适合大文本处理\n\n【串的基本操作定义】\nStrAssign(&T,chars)：赋值\nStrCopy(&T,S)：复制\nStrEmpty(S)：判空\nStrCompare(S,T)：比较\nStrLength(S)：求长度\nConcat(&T,S1,S2)：连接\nSubString(&Sub,S,pos,len)：求子串",problems:[{q:"空串和空格串有什么区别？",a:"空串：长度为0，不含任何字符；空格串：含一个或多个空格，长度≥1",d:"easy"},{q:"'abcde'的所有子串共有多少个？",a:"n(n+1)/2+1（含空串）=5×6/2+1=16个。不含空串则15个",d:"medium"},{q:"串的定长顺序存储中，用S[0]存长度与用'\\0'结尾各有什么优劣？",a:"S[0]存长度：可O(1)求长度，最大长度255字节；'\\0'结尾：C语言标准方式，长度不受限但求长度O(n)",d:"hard"}]},

"ds-4-1":{explanation:"【BF（Brute Force）暴力匹配】\n主串S与模式串P逐字符比较，失配时主串回退到下一起始位置。\n时间复杂度：最坏O(n×m)，n为主串长，m为模式串长\n\n【KMP算法原理】\n利用模式串自身的重复结构，失配时不回退主串，只移动模式串。\n核心：next数组（失败函数）\n\n【next数组计算】\nnext[1]=0，next[2]=1\nnext[j]=「模式串前j-1个字符的最长公共前后缀」+1\n\n例：模式串 a b a a b c\nnext:   0 1 1 2 2 3\n\n【KMP匹配过程】\n失配时：j=next[j]（不移动i，j回退）\n匹配成功时：i++, j++\n\n【nextval优化】\n修正next数组，消除KMP中「回退后仍不匹配」的冗余操作\nnextval[j]=若P[j]==P[next[j]]，则nextval[j]=nextval[next[j]]，否则nextval[j]=next[j]",problems:[{q:"计算模式串'ababc'的next数组",a:"next: 0,1,1,2,3 （从左到右：前缀=''，前缀='a'和后缀='a'最长1，前缀'a'后缀'b'不匹配为1，前缀'aba'后缀'aba'最长3但字符不等看前缀'ab'后缀'ab'得2）",d:"medium"},{q:"BF算法的时间复杂度最坏情况为何是O(nm)？举例说明",a:"主串'aaaaaab'，模式串'aab'：每次比较到倒数第二个字符才发现不匹配，需回退主串。比较次数≈(n-m+1)×m=O(nm)",d:"medium"},{q:"KMP算法中next数组有什么物理意义？",a:"next[j]表示：当第j个字符失配时，模式串应滑动到第next[j]个字符与主串的对应字符重新比较（等价于模式串最长公共前后缀长度+1）",d:"hard"},{q:"为什么KMP的时间复杂度是O(n+m)？",a:"主串指针i永远不后退，最多移动n次；j通过next数组移动，j增加n次则最多减少n次，故总操作O(n+m)",d:"hard"}]},

"ds-4-2":{explanation:"【串的基本操作C语言实现】\n\nStrLen（串的长度）：\nint StrLen(char *s){ int i=0; while(s[i]!=0) i++; return i; }\n\nConcat（串的连接）：\nvoid Concat(char *T, char *S1, char *S2){\n  int i=0,j=0;\n  while(S1[i]) T[i]=S1[i++];\n  while(S2[j]) T[i++]=S2[j++];\n  T[i]=0;\n}\n\nSubString（取子串）：\nvoid SubString(char *Sub, char *S, int pos, int len){\n  for(int i=0;i<len;i++) Sub[i]=S[pos-1+i];\n  Sub[len]=0;\n}\n\nStrCompare（串比较）：\n逐字符ASCII码比较，全相同返回0，字符小返回负数。\n\n【C语言中的串处理库函数】\nstrlen(s)、strcpy(t,s)、strcat(t,s)、strcmp(s,t)、strstr(s,pattern)",problems:[{q:"用C实现StrIndex(S,T,pos)——从pos位开始查T在S中的位置（BF）",a:"for(int i=pos-1;i<=StrLen(S)-StrLen(T);i++){int j=0;while(j<StrLen(T)&&S[i+j]==T[j])j++;if(j==StrLen(T))return i+1;} return 0;",d:"hard"},{q:"strcmp('abc','ab')的返回值是正数、负数还是0？",a:"正数（'c'的ASCII > '\\0'的ASCII，因为'abc'比'ab'多一个字符，第3个字符比较时'ab\\0'已结束）",d:"medium"},{q:"字符串反转的原地算法（O(1)空间）",a:"双指针：i=0,j=len-1; while(i<j){ swap(s[i],s[j]); i++; j--; }",d:"easy"}]},

// 第5章 数组和广义表

"ds-5-0":{explanation:"【数组的特性】\n数组是线性表的推广，是若干线性表的扩展。\n二维数组A[m][n]可视为m个行向量（每行是长为n的线性表）。\n\n【行优先（Row-major）存储】\na[0][0], a[0][1], ..., a[0][n-1], a[1][0], ..., a[m-1][n-1]\n地址：LOC(a[i][j]) = LOC(a[0][0]) + (i×n + j)×d\n（d为每个元素字节数）\n\n【列优先（Column-major）存储】\nFortran语言使用列优先\n地址：LOC(a[i][j]) = LOC(a[0][0]) + (j×m + i)×d\n\n【三维数组】\na[i][j][k]的行优先地址：\nLOC + (i×n₂×n₃ + j×n₃ + k)×d",problems:[{q:"设int a[5][4]，a的起始地址2000，int占4字节（行优先），a[2][3]的地址",a:"LOC(a[2][3]) = 2000 + (2×4+3)×4 = 2000+44 = 2044",d:"easy"},{q:"若按列优先存储a[5][4]，a的起始地址2000，int占4字节，a[2][3]的地址",a:"LOC(a[2][3]) = 2000 + (3×5+2)×4 = 2000+68 = 2068",d:"medium"},{q:"对于二维数组a[m][n]，行优先存储a[i][j]与a[i][j+1]的地址差？与a[i][j]和a[i+1][j]的地址差？",a:"同行相邻：差d（1个元素）；同列相邻：差n×d（n个元素）",d:"easy"}]},

"ds-5-1":{explanation:"【对称矩阵压缩】\na[i][j]=a[j][i]，只存下三角部分（含对角线）。\n共n(n+1)/2个元素，存储在一维数组S中。\n映射（i≥j）：S[i(i-1)/2+j-1] = a[i][j]（从1开始）\n\n【三角矩阵压缩】\n上（下）三角矩阵同对称矩阵，加上一个常数c存在S[n(n+1)/2]中。\n\n【稀疏矩阵】\n非零元素远少于零元素的矩阵（非零元个数t满足t<<m×n）。\n\n三元组表示：每个非零元存(i, j, v)三元组，附加总行数m、列数n、元素数t。\ntypedef struct { int i, j; ElemType e; } Triple;\ntypedef struct { Triple data[MAXSIZE]; int mu,nu,tu; } TSMatrix;\n\n十字链表：适合插入删除频繁的稀疏矩阵。\n\n【稀疏矩阵转置】\n算法1：按列扫描，时间O(n×t)\n算法2（快速转置）：先统计每列元素数，再确定各列在转置矩阵中的起始位置。时间O(n+t)",problems:[{q:"5阶对称矩阵，存储下三角共需多少空间？",a:"5×(5+1)/2 = 15个元素",d:"easy"},{q:"对称矩阵a[4][2]（从1开始）压缩后在数组S的下标（下三角，行优先）",a:"i=4,j=2，i≥j，下标 = i(i-1)/2+j-1 = 4×3/2+2-1 = 7",d:"medium"},{q:"为什么稀疏矩阵用三元组存储？它的转置如何进行？",a:"节省空间（只存非零元）。转置：扫描原矩阵三元组，行列互换；快速转置用辅助数组统计每列元素数，一次遍历完成",d:"hard"}]},

"ds-5-2":{explanation:"【广义表（Generalized List）】\n广义表是线性表的推广，允许其元素是原子或广义表（子表）。\n记法：A=(a₁, a₂, ..., aₙ)，其中aᵢ可以是原子或子表。\n\n【术语】\n长度：直接包含的元素个数（不含子表内部）\n深度：括号嵌套的最大层数，原子深度为0，空表深度为1\n头（Head）：第一个元素\n尾（Tail）：除第一个元素外的其余元素组成的广义表\n\n【例子】\nA=()：空表，长度0，深度1\nB=(a,(b,c))：长度2，深度2，Head=a，Tail=((b,c))\nC=(a,B,c)=(a,(a,(b,c)),c)：共享子表\n\n【广义表的链式存储】\n分两种节点：\n- 原子节点：tag=0，data域存值\n- 子表节点：tag=1，hp指针指向子表头，tp指针指向同级的下一元素",problems:[{q:"广义表L=(a,(b,c),d)的长度和深度分别是多少？",a:"长度=3（三个直接元素：a、(b,c)、d）；深度=2（最深嵌套一层子表）",d:"easy"},{q:"广义表L=(a,(b,(c,d)))，写出Head(L)和Tail(L)",a:"Head(L)=a；Tail(L)=((b,(c,d)))",d:"medium"},{q:"广义表允许共享和递归，这可能带来什么问题？如何解决？",a:"共享和递归可能导致深度或长度计算无限循环（递归广义表）。解决：设标志位标记已访问节点，或限制递归深度",d:"hard"}]},

// 第6章 树和二叉树

"ds-6-0":{explanation:"【树的基本术语】\n根节点（root）、双亲、孩子、兄弟、祖先、子孙\n节点的度：该节点的子树个数\n树的度：树中节点度的最大值\n叶子节点（leaf）：度为0的节点\n树的深度（高度）：从根到最远叶子的路径长度\n\n【二叉树的五种形态】\n空二叉树、只有根节点、只有左子树、只有右子树、左右子树均有\n\n【二叉树的重要性质】\n性质1：第i层最多有2^(i-1)个节点（i≥1）\n性质2：深度为k的二叉树最多有2^k-1个节点\n性质3：若叶子节点数n₀，度为2的节点数n₂，则n₀=n₂+1\n性质4：完全二叉树n个节点，深度=⌊log₂n⌋+1\n性质5（完全二叉树数组存储）：节点i的左孩子2i，右孩子2i+1，双亲⌊i/2⌋\n\n【满二叉树 vs 完全二叉树】\n满二叉树：每层节点都满\n完全二叉树：从左到右连续填充，只有最后一层可不满且叶子靠左",problems:[{q:"有10个节点的完全二叉树，深度是多少？",a:"⌊log₂10⌋+1=3+1=4",d:"easy"},{q:"证明二叉树的性质3：n₀=n₂+1",a:"总边数=n-1（n个节点）；边数=所有节点度之和=0×n₀+1×n₁+2×n₂；且n=n₀+n₁+n₂；联立得n₀=n₂+1",d:"hard"},{q:"完全二叉树共有17个节点，叶子节点有多少个？",a:"n₂个度为2的节点：前4层满（15个），第5层有2个节点，第4层编号7,8有孩子→n₂=... 实际上：17=n₀+n₁+n₂，n₀=n₂+1；17个节点完全二叉树，n₁=1（第9个节点只有左孩子），n₀=n₂+1，17=n₀+1+n₀-1解得n₀=9",d:"hard"},{q:"高度为h的满二叉树共有多少个节点？",a:"2^h - 1个",d:"easy"}]},

"ds-6-1":{explanation:"【三种遍历定义】\n先序（Preorder）：根-左-右 NLR\n中序（Inorder）：左-根-右 LNR\n后序（Postorder）：左-右-根 LRN\n层序（Level-order）：按层从上到下，每层从左到右\n\n【递归实现（先序为例）】\nvoid PreOrder(BiTree T){\n  if(T){\n    printf(\"%c \",T->data);\n    PreOrder(T->lchild);\n    PreOrder(T->rchild);\n  }\n}\n\n【非递归中序遍历（用栈）】\n1. p=T; 初始化栈\n2. while(p!=NULL||栈非空):\n   - while(p): 入栈,p=p->lchild\n   - p=弹栈; 访问; p=p->rchild\n\n【层序遍历（用队列）】\n根入队→队非空时：出队访问→左右孩子入队\n\n【由遍历序列恢复二叉树】\n先序+中序，或后序+中序可唯一确定二叉树\n先序+后序不能唯一确定！",problems:[{q:"已知二叉树先序A B D E C F，中序D B E A F C，画出二叉树",a:"先序首元素A为根；中序中A左边DBE为左子树，FC为右子树；递归：左子树先序BDE，中序DBE，根B；右子树先序CF，中序FC，根C",d:"medium"},{q:"中序遍历结果为ABCDE，先序为CBEAD，画出树并给出后序",a:"先序首C为根，中序AB在C左，DE在C右；先序BE为左子树，中序AB，根B，A为左；先序AD为右，中序DE，根D，E为右；后序：A B E D C",d:"hard"},{q:"非递归先序遍历的算法框架（用栈）",a:"p=T入栈; while(栈非空){p=出栈; 访问p; if(p->rchild)入栈右孩子; if(p->lchild)入栈左孩子;}（注意右孩子先入栈）",d:"hard"},{q:"二叉树先序和后序能唯一确定二叉树吗？为什么？",a:"不能。当节点只有左子树或只有右子树时，从先序和后序无法判断是左还是右（需要中序区分）",d:"medium"}]},

"ds-6-2":{explanation:"【线索化的意义】\nn个节点的二叉链表有n+1个空指针域，可利用来存储前驱/后继信息。\n\n【线索链表结构】\ntypedef struct TNode {\n  ElemType data;\n  int ltag, rtag; // 0=孩子指针, 1=线索\n  struct TNode *lchild, *rchild;\n} TNode;\n\nlchild: ltag=0时指左孩子，ltag=1时指中序前驱\nrchild: rtag=0时指右孩子，rtag=1时指中序后继\n\n【中序线索化算法】\n中序遍历过程中，用pre指针记录前驱节点：\n- 若p->lchild==NULL: p->lchild=pre; p->ltag=1\n- 若pre!=NULL && pre->rchild==NULL: pre->rchild=p; pre->rtag=1\n\n【线索二叉树遍历（不用栈递归）】\n1. 找最左节点（沿lchild到底）\n2. 访问节点\n3. 若rtag=1，后继为rchild（直接跳）\n4. 若rtag=0，后继为右子树的最左节点",problems:[{q:"n个节点的完全二叉链表有多少个空指针域？为什么？",a:"n+1个。总指针=2n，非空指针=n-1（n个节点有n-1条边），空指针=2n-(n-1)=n+1",d:"medium"},{q:"中序线索二叉树中，某节点P的右线索指向谁？",a:"P在中序遍历中的直接后继节点（即中序序列中P的下一个节点）",d:"easy"},{q:"线索二叉树的优势是什么？适用什么场景？",a:"可在O(1)找前驱/后继（不用递归），无需额外栈空间遍历。适合频繁遍历的场景，但线索化后结构修改困难",d:"medium"}]},

"ds-6-3":{explanation:"【树与二叉树转换】\n树→二叉树：孩子兄弟表示法\n- 节点的左孩子=原树第一个孩子\n- 节点的右孩子=原树下一个兄弟\n规律：树的根节点在对应二叉树中无右孩子\n\n森林→二叉树：\n- 各棵树转为二叉树\n- 各树根节点依次连为兄弟（右链）\n\n二叉树→树（反操作）：\n右指针改为兄弟指针，重新还原孩子关系\n\n【树的遍历与对应二叉树遍历的对应关系】\n树的先序遍历 = 对应二叉树的先序遍历\n树的后序遍历 = 对应二叉树的中序遍历\n\n【森林的遍历】\n先序：依次先序遍历每棵树\n后序：依次后序遍历每棵树",problems:[{q:"树转换为二叉树的规则是什么？",a:"1.加线：兄弟节点之间加连线；2.抹线：保留每个节点最左一条连线（第一个孩子），删去其余连线；3.旋转：调整成层次结构",d:"easy"},{q:"一棵3个节点的树（根A，两个孩子B和C）转换后的二叉树形状",a:"A为根，B为A的左孩子，C为B的右孩子（BC是兄弟关系，对应二叉树中B->rchild=C）",d:"medium"},{q:"为什么树的后序遍历等于对应二叉树的中序遍历？",a:"树转二叉树后，原树的后序=先递归处理左子树（子节点）→再处理当前节点→处理右子树（兄弟），与二叉树中序LNR对应",d:"hard"}]},

"ds-6-4":{explanation:"【带权路径长度WPL】\nWPL = Σ(wₖ × lₖ)，wₖ为权重，lₖ为叶子到根的路径长度\n哈夫曼树：WPL最小的二叉树（最优二叉树）\n\n【哈夫曼树构造（贪心算法）】\n1. 将n个权值初始化为n棵单节点树的森林\n2. 从森林中选两棵根权值最小的树\n3. 合并为一棵新树（两者之和为新根）\n4. 重复2-3直到只剩一棵树\n\n【哈夫曼编码】\n左分支0，右分支1（或相反），叶子对应字符\n特性：\n- 前缀码（任何编码不是另一个的前缀）\n- 最优编码（总编码长度=WPL最小）\n- n个字符的哈夫曼树有2n-1个节点\n\n【应用】\n数据压缩（文件压缩）、变长编码",problems:[{q:"权值为{3,6,7,8,12}，构造哈夫曼树并计算WPL",a:"合并3+6=9，再合并7+8=15，再合并9+12=21，再合并15+21=36。WPL=3×3+6×3+7×2+8×2+12×2=9+18+14+16+24=81",d:"medium"},{q:"为什么哈夫曼编码是前缀码？",a:"哈夫曼编码中字符只出现在叶子节点，一个字符的编码路径不可能是另一个字符路径的前缀（因为叶子没有孩子）",d:"medium"},{q:"字符集{a:5,b:2,c:3,d:9,e:1}，a的哈夫曼编码长度",a:"先合并e(1)+b(2)=3，再合并c(3)+eb(3)=6，再合并a(5)+d(9)=14，再合并ad(14)+ceb(6)=20。a在第2层，编码长度2；具体编码视0/1分配",d:"hard"},{q:"n个叶子节点的哈夫曼树共有多少个节点？",a:"2n-1个（每次合并减少1棵树，n棵合并到1棵需n-1次，每次新增1个内部节点）",d:"easy"}]},

// 第7章 图

"ds-7-0":{explanation:"【图的基本概念】\n图G=(V,E)，V顶点集（非空），E边集（可空）\n有向图：每条边有方向，<u,v>（弧）\n无向图：每条边无方向，(u,v)\n\n完全图：\n无向完全图：每对顶点间都有边，n个顶点有n(n-1)/2条边\n有向完全图：每对顶点间都有两条弧，n(n-1)条弧\n\n度（Degree）：\n无向图中顶点v的度=与v相关联的边数\n有向图：入度（In-degree）+出度（Out-degree）=度\n握手定理：所有顶点度之和=2×|E|\n\n路径与回路：\n简单路径：不重复顶点\n简单回路（环）：仅起终点重复\n\n连通性：\n无向图连通图：任意两顶点间有路径\n有向图强连通：任意顶点u到v，v到u均有路径\n\n生成树：连通图的极小连通子图（n个顶点n-1条边且连通）",problems:[{q:"n个顶点的无向完全图有多少条边？",a:"C(n,2)=n(n-1)/2",d:"easy"},{q:"有向图所有顶点的入度之和与出度之和有什么关系？",a:"入度之和=出度之和=|E|（每条弧贡献1个入度和1个出度）",d:"easy"},{q:"一个有n个顶点的连通无向图，至少需要多少条边？",a:"n-1条边，即生成树",d:"medium"},{q:"强连通图和连通图的区别？",a:"连通图（无向）：任意两顶点间有无向路径；强连通图（有向）：任意两顶点u,v均有u→v和v→u的有向路径",d:"medium"}]},

"ds-7-1":{explanation:"【邻接矩阵】\nA[n][n]，A[i][j]=1(有边)或0(无边)，或存权值。\n空间O(n²)，适合稠密图；判断是否有边O(1)\n无向图邻接矩阵是对称矩阵\n顶点i的度=第i行（或列）非零元素个数\n\n【邻接表（链表）】\n每个顶点对应一个链表，存储其所有邻接顶点。\n空间O(n+e)，适合稀疏图\n无向图：每条边存两次\n有向图：只存出边（也可同时存逆邻接表）\n\n【十字链表（有向图）】\n每条弧有弧节点，弧节点存：尾顶点、头顶点、同尾下弧、同头下弧\n可方便求入度和出度\n\n【邻接多重表（无向图）】\n每条边存一次，通过mark标记是否已访问\n适合需要对边操作的算法\n\n【对比】\n邻接矩阵：稠密图、判边快；邻接表：稀疏图、遍历快",problems:[{q:"邻接矩阵表示的无向图，顶点v的度如何计算？",a:"第v行（或第v列）的非零元素个数之和（因对称，行列相等）",d:"easy"},{q:"n个顶点e条边的有向图，邻接表共有多少个节点？",a:"n+e：n个顶点表头节点+e个弧节点",d:"medium"},{q:"什么时候使用邻接矩阵，什么时候使用邻接表？",a:"邻接矩阵：稠密图（e≈n²）、频繁判断两顶点是否相邻O(1)；邻接表：稀疏图（e<<n²）、需要遍历所有邻接点、节省空间",d:"medium"},{q:"如何用邻接表快速求有向图中每个顶点的入度？",a:"建逆邻接表（存入边）遍历即可，或建十字链表；若只有邻接表则需O(n+e)遍历所有弧统计",d:"hard"}]},

"ds-7-2":{explanation:"【DFS深度优先遍历】\n类似树的先序遍历，用栈（或递归）实现。\nvoid DFS(G, v):\n  visit(v); visited[v]=true;\n  for v的每个未访问邻居w: DFS(G,w)\n非连通图：对所有顶点，若未访问则调用DFS，生成DFS森林\n时间复杂度：邻接表O(n+e)，邻接矩阵O(n²)\n\n【BFS广度优先遍历】\n类似树的层序遍历，用队列实现。\nvoid BFS(G, v):\n  visit(v); 入队v;\n  while(队非空):\n    w=出队; for w的每个未访问邻居x: visit(x); 入队x;\n时间复杂度同DFS\n\n【生成树/生成森林】\nDFS/BFS遍历的边组成生成树（或森林）\n两种遍历方式生成的树不同\n\n【应用场景】\nDFS：拓扑排序、欧拉回路检测、关节点、强连通分量\nBFS：最短路径（无权图）、二部图检测",problems:[{q:"DFS和BFS得到的遍历序列有什么不同？哪种能求无权图的最短路径？",a:"DFS沿一个方向走到底再回溯，BFS按层扩展；BFS能求无权图最短路径（首次访问即为最短）",d:"medium"},{q:"有向图DFS时的4种边类型",a:"树边（DFS树上的边）、前向边（从祖先到子孙）、后向边（从子孙到祖先，即环）、横叉边（不相关节点间）",d:"hard"},{q:"如何用DFS判断无向图是否有环？",a:"DFS过程中，若访问到已访问的非父节点，则有环",d:"medium"},{q:"图的DFS生成树和BFS生成树有什么区别？",a:"DFS树通常更深（像一条长链）；BFS树通常更宽（层次分明）。两者的边集不同但都是生成树（n-1条边，连通）",d:"hard"}]},

"ds-7-3":{explanation:"【最小生成树（MST）概念】\n连通带权无向图的最小权值生成树。\nMST性质：图中任意一个环，去掉最大权边后仍有生成树。\n\n【Prim算法（加点法）】\n1. 从任意顶点v出发，将v加入集合U\n2. 找一条端点在U和V-U的最短边，将该端点加入U\n3. 重复2直到U=V\n时间复杂度：O(n²)（邻接矩阵），适合稠密图\n\n【Kruskal算法（加边法）】\n1. 将所有边按权值升序排序\n2. 依次取最小边，若加入后不构成环则加入MST\n3. 直到MST有n-1条边\n时间复杂度：O(e log e)，适合稀疏图\n判断是否构成环：使用并查集（Union-Find）\n\n【MST唯一性】\n若图中边权各不相同，则MST唯一。\n若有相同权值的边，MST可能不唯一但权值相同。",problems:[{q:"Prim算法和Kruskal算法各适合什么图？",a:"Prim：稠密图（O(n²)），适合边多顶点少；Kruskal：稀疏图（O(e log e)），适合边少的情况",d:"easy"},{q:"Kruskal算法用什么数据结构判断加边后是否有环？",a:"并查集（Union-Find）：初始每个顶点独立；加边时检查两端点是否在同一集合（有环），若不在则合并",d:"medium"},{q:"一个图有n个顶点e条边，用Kruskal算法的时间复杂度？",a:"O(e log e)：排序O(e log e) + 并查集操作O(e α(n))，总计O(e log e)",d:"medium"},{q:"Prim算法的主要思想，用文字描述",a:"从一个顶点出发，每次贪心地选择将集合U和V-U之间权值最小的边加入，同时把对应顶点加入U，直到所有顶点加入",d:"easy"}]},

"ds-7-4":{explanation:"【Dijkstra算法（单源最短路径）】\n求源点v₀到其他各顶点的最短路径（非负权图）\n\n过程：\n用dist[]存当前最短距离，visited[]标记已确定顶点\n1. dist[v₀]=0，其余为∞\n2. 选dist最小的未访问顶点u，标记为已访问\n3. 更新u的所有邻居v：if dist[u]+w(u,v)<dist[v]: dist[v]=dist[u]+w(u,v)\n4. 重复直到所有顶点已访问\n\n时间复杂度：O(n²)（邻接矩阵），O((n+e)log n)（优先队列）\n\n【Floyd算法（多源最短路径）】\n求任意两顶点间最短路径\n核心状态：D[k][i][j]=经过顶点1..k中继的i→j最短路径\n转移：D[k][i][j]=min(D[k-1][i][j], D[k-1][i][k]+D[k-1][k][j])\n时间复杂度：O(n³)\n空间可优化到O(n²)\n\n【对比】\nDijkstra：单源，要求非负权，O(n²)\nFloyd：多源，可处理负权（无负环），O(n³)",problems:[{q:"Dijkstra算法为什么不能处理负权边？举例说明",a:"当加入负权边后，之前已确定的最短路径可能不再最短。如v₀→A=3，v₀→B=5，A→B=-4，正常Dijkstra先确定A=3，B=5，而真实B的最短路径=3-4=-1",d:"hard"},{q:"Floyd算法的状态转移方程",a:"D[i][j]=min(D[i][j], D[i][k]+D[k][j])，对k=1..n依次更新（以k为中继顶点）",d:"medium"},{q:"n=5的图，Dijkstra需要多少次「选最小」操作？",a:"n-1=4次（每次选出一个最短路径确定的顶点）",d:"easy"},{q:"Floyd算法如何检测负权回路？",a:"执行完Floyd后，若D[i][i]<0（某顶点到自身的路径权值为负），则存在负权回路",d:"hard"}]},

"ds-7-5":{explanation:"【拓扑排序】\n有向无环图（DAG）中，将所有顶点排成线性序列，使得对每条有向边u→v，u在v前面。\n\n算法（基于入度的BFS）：\n1. 计算所有顶点的入度\n2. 将入度为0的顶点入队\n3. 出队顶点v，输出；将v的所有邻居入度-1\n4. 若邻居入度变为0，入队\n5. 重复直到队空\n若输出顶点数<n，说明图中有环（不能拓扑排序）\n\n应用：课程学习顺序、任务依赖调度、编译器依赖分析\n\n【关键路径（AOE网）】\nAOE网：有向加权图，顶点=事件，边=活动，边权=活动持续时间。\n关键路径：从源点到终点的最长路径（工程最短完成时间）\n\n事件最早发生时间ve[k]：ve[源]=0，ve[k]=max(ve[j]+w(j,k))\n事件最晚发生时间vl[k]：vl[终]=ve[终]，vl[k]=min(vl[j]-w(k,j))\n活动aᵢ=(vₖ,vⱼ)的松弛时间：vl[j]-ve[k]-w(k,j)\n松弛时间=0的活动在关键路径上",problems:[{q:"拓扑排序的结果唯一吗？",a:"不唯一（当图中有多个入度为0的顶点时，选择顺序不同导致不同的拓扑序列）。但若图是全序（只有一条拓扑路径）则唯一",d:"medium"},{q:"如何用拓扑排序判断有向图中是否有环？",a:"若拓扑排序完成后输出的顶点个数<n，则说明有环（被环中的顶点入度永远不会变0）",d:"easy"},{q:"AOE网关键路径的意义是什么？",a:"关键路径是工程完成的最短时间（瓶颈路径），只有缩短关键路径上活动的时间才能缩短工期",d:"medium"},{q:"关键活动的松弛时间等于多少？",a:"等于0。松弛时间=最晚开始时间-最早开始时间，为0意味着该活动不能有任何延误",d:"easy"}]},

// 第8章 动态存储管理

"ds-8-0":{explanation:"【动态存储分配的概念】\n程序运行时，根据需要申请和释放内存空间，大小、位置均不固定。\n内存碎片：\n内部碎片：分配的块比实际需要大，多余部分浪费\n外部碎片：许多小的空闲区域无法分配给较大请求\n\n【边界标识法（Boundary-Tag Method）】\n每个内存块头尾都有边界标记，记录块大小和状态（空闲/占用）\n空闲块用双向链表链接\n分配：从链表中找合适空闲块切割\n释放：合并相邻空闲块（通过边界标记O(1)找到相邻块）\n\n【伙伴系统（Buddy System）】\n所有块大小为2^k次幂\n分配：找最小的≥请求的2^k块，若过大则不断二分\n释放：检查是否可与其伙伴（兄弟块）合并，可以则合并\n优点：合并操作简单（地址异或即可找到伙伴）\n缺点：内部碎片较严重（可能浪费接近50%）\n\n【垃圾回收（GC）】\n标记-清除（Mark and Sweep）：\n1. 从根节点出发标记所有可达对象\n2. 清除所有未标记对象\n停止-复制（Stop and Copy）：\n将内存分两半，活对象复制到另一半，整理消除碎片",problems:[{q:"边界标识法释放内存块时如何合并相邻空闲块？",a:"通过块头部的边界标记O(1)找到前一块和后一块，若为空闲则合并，修改链表指针和标记",d:"medium"},{q:"伙伴系统请求17字节，实际分配多少？",a:"32字节（最小的≥17的2的幂是32），内部浪费15字节",d:"easy"},{q:"与边界标识法相比，伙伴系统的优缺点",a:"优点：合并伙伴块简单高效（按位异或即可定位伙伴地址）；缺点：内部碎片可能较大（最坏50%浪费）",d:"hard"}]},

"ds-8-1":{explanation:"【空闲内存分配策略】\n\n首次适应（First Fit）：\n从头开始，找第一个足够大的空闲块\n优点：简单快速；缺点：低地址产生大量小碎片\n\n最佳适应（Best Fit）：\n找最小的足够大的空闲块\n优点：减少大块的浪费；缺点：产生最多小碎片，搜索慢\n\n最坏适应（Worst Fit）：\n找最大的空闲块\n优点：剩余块较大，还能再分配；缺点：大块很快消耗殆尽\n\n循环首次适应（Next Fit）：\n从上次分配位置继续查找，分配更均匀\n\n【malloc/free 内部实现概要】\n大多数实现使用分离空闲链表（按大小分类）\nfree：将内存放回对应大小的链表，尝试合并相邻块\nmalloc：在对应大小链表中查找，若无则切割更大的块或向OS申请",problems:[{q:"三种分配策略（First Fit, Best Fit, Worst Fit）哪种产生的外部碎片最少？",a:"理论上Best Fit平均产生最小的外部碎片，但实验表明First Fit通常效果更好（Best Fit产生大量细小碎片）",d:"medium"},{q:"内部碎片和外部碎片的区别",a:"内部碎片：已分配块内的未使用空间（如请求5字节分配8字节）；外部碎片：未分配但太小而无法使用的空闲区域",d:"easy"},{q:"为什么操作系统使用伙伴系统而不是最佳适应策略管理内核内存？",a:"伙伴系统分配/回收速度快（O(log n)），合并操作简单，适合频繁的内核内存申请；最佳适应需要搜索链表O(n)，延迟不可控",d:"hard"}]},

// 第9章 查找

"ds-9-0":{explanation:"【顺序查找（Sequential Search）】\n从第一个元素开始逐一比较，时间O(n)\n平均比较次数：(n+1)/2\n改进：哨兵（将目标值放在0号位置，省去越界检查）\n\n【二分查找（Binary Search / 折半查找）】\n要求：有序表（顺序存储）\nlow=1, high=n; mid=(low+high)/2\n循环：比较a[mid]与key，相等返回，key<a[mid]则high=mid-1，key>a[mid]则low=mid+1\n时间复杂度：O(log n)\n\n判定树：二分查找过程对应一棵二叉判定树（最优二叉搜索树）\n最多比较次数=树的高度=⌊log₂n⌋+1\n\n【分块查找（索引顺序查找）】\n将表分为若干块，块内无序但块间有序，维护索引表\n分两步：先用二分或顺序找块，再在块内顺序查找\n时间复杂度：O(√n)（最优分块，每块√n个元素）\n\n【各查找方法比较】\n顺序查找：O(n)，无要求\n二分查找：O(logn)，要求有序顺序表\n分块查找：O(√n)，要求块间有序",problems:[{q:"在有序表[1,3,5,7,9,11,13,15]中，二分查找15需要比较几次？",a:"第1次：mid=4，a[4]=7<15，low=5；第2次：mid=6，a[6]=11<15，low=7；第3次：mid=7，a[7]=13<15，low=8；第4次：low>high，未找到？实际15在位置8：第4次mid=8，a[8]=15，找到，共4次",d:"medium"},{q:"二分查找适用于链式存储的线性表吗？为什么？",a:"不适用。二分查找需要O(1)的随机访问（计算中间位置并直接访问），链表的随机访问是O(n)，会使时间复杂度退化到O(n log n)",d:"medium"},{q:"顺序查找用哨兵的好处是什么？",a:"将key放在a[0]位置作为哨兵，循环中不需要判断i>=0（越界）的边界条件，减少一个判断操作，提升效率",d:"easy"},{q:"分块查找n个元素，分成√n块每块√n个，平均查找长度是多少？",a:"块索引顺序查找：(√n+1)/2；块内顺序查找：(√n+1)/2；总平均=(√n+1)，数量级O(√n)",d:"hard"}]},

"ds-9-1":{explanation:"【二叉排序树（BST）定义】\n满足：\n- 若左子树非空，左子树所有节点值<根节点值\n- 若右子树非空，右子树所有节点值>根节点值\n- 左右子树也分别是BST\n中序遍历BST得到升序序列\n\n【BST查找】\n从根出发，key<当前节点→左子树，key>→右子树，=→找到\n时间：O(h)，h为树高\n\n【BST插入】\n查找失败的位置即为插入位置\n\n【BST删除】\n情况1：叶子→直接删除\n情况2：只有左（右）子树→用左（右）子树代替\n情况3：有两棵子树→用右子树最小节点（中序后继）代替，并删除该后继\n\n【BST性能分析】\n最好：平衡时O(logn)\n最坏：退化为链表（有序插入）O(n)\n平均：O(logn)\n\n平均查找长度ASL：与关键字比较的平均次数，与树的形态有关",problems:[{q:"依次插入{5,3,7,1,4,6,8}，画出BST并写出其中序遍历",a:"根5，左3右7，3的左1右4，7的左6右8。中序：1,3,4,5,6,7,8（升序）",d:"medium"},{q:"从BST中删除有两个孩子的节点，应该用什么节点替代？",a:"用该节点的中序后继（右子树的最左节点）替代，然后删除右子树中的最左节点",d:"medium"},{q:"什么情况下BST的查找效率最差？如何避免？",a:"按有序序列插入时，BST退化为单链表，查找O(n)。解决方案：使用AVL树或红黑树等自平衡BST，保证高度O(logn)",d:"hard"}]},

"ds-9-2":{explanation:"【AVL树定义】\n高度平衡的二叉排序树，任意节点的左右子树高度差（平衡因子BF）≤1。\n平衡因子BF=左子树高-右子树高，BF∈{-1,0,1}。\n\n【失衡类型与旋转】\nLL型（左子树的左子树过高）→单右旋\nRR型（右子树的右子树过高）→单左旋\nLR型（左子树的右子树过高）→先左旋后右旋\nRL型（右子树的左子树过高）→先右旋后左旋\n\n【旋转操作（LL右旋）】\n设失衡节点A，A的左孩子B：\nB的右子树β成为A的左子树\nA成为B的右孩子\nB成为新的根\n\n【AVL树性能】\n高度O(logn)，查找/插入/删除均O(logn)\n插入/删除后需检查平衡，最多需要O(logn)次旋转\n\n【AVL节点数与高度关系】\n高度h的AVL树最少节点：N(h)=N(h-1)+N(h-2)+1（斐波那契递推）",problems:[{q:"什么是AVL树的平衡因子？最大允许值是多少？",a:"平衡因子=左子树高度-右子树高度，允许范围为{-1,0,1}",d:"easy"},{q:"插入节点导致LL失衡，如何修复？",a:"对失衡节点A进行单右旋：A的左孩子B提升为新根，B的右子树变为A的左子树，A变为B的右孩子",d:"medium"},{q:"插入{5,4,3}后发生LL失衡，画出旋转过程",a:"插入3后：5的BF=2（左高），4的BF=1（左高），LL型，对5右旋：4为新根，5为4的右孩子，3为4的左孩子",d:"medium"},{q:"AVL树插入一个元素最多需要几次旋转？",a:"最多需要2次旋转（LR或RL型需要先一次局部旋转再一次整体旋转），不是O(logn)次",d:"hard"}]},

"ds-9-3":{explanation:"【哈希表（散列表）】\n通过哈希函数H(key)将关键字映射到存储地址，实现O(1)平均查找。\n\n【常见哈希函数】\n除留余数法：H(k)=k mod p（p为质数，最常用）\n直接定址法：H(k)=a×k+b\n平方取中法：对k²取中间几位\n数字分析法：取关键字分布均匀的几位\n\n【冲突处理方法】\n1. 开放定址法：\n   线性探测：H(k)+i（i=0,1,...,m-1），有堆积问题\n   二次探测：H(k)+1²,-1²,2²,-2²,...\n   双重散列：H₂(k)作步长\n\n2. 链地址法（链接法）：\n   相同哈希值的元素用链表链接\n   优点：不产生堆积，删除方便\n\n【装填因子α】\nα=n/m（n=已存元素，m=表长）\n理想α<0.7，α越大冲突越多\n\n【哈希表性能分析】\n平均查找长度与α有关，和n无关\n查找成功ASL：与α成正比\n哈希表是以空间换时间的典型结构",problems:[{q:"用除留余数法，p=11，将{17,29,36,42}存入哈希表，计算地址",a:"17%11=6，29%11=7，36%11=3，42%11=9，无冲突",d:"easy"},{q:"开放定址法线性探测为什么会产生'堆积'问题？",a:"当多个不同哈希地址的元素争相占用同一区域时，查找路径越来越长，大量元素集中在相邻位置，导致性能退化",d:"medium"},{q:"链地址法和线性探测法各有什么优缺点？",a:"链地址法：不产生堆积，删除方便，但有指针开销；线性探测：空间紧凑，但有堆积问题，删除需标记（不能直接删除）",d:"medium"},{q:"哈希表的平均查找长度与表中元素个数n有关吗？",a:"无关！ASL只与装填因子α=n/m有关，m是表长。只要保持α不变（动态扩容），无论n多大ASL近似常数",d:"hard"}]},

// 第10章 内部排序

"ds-10-0":{explanation:"【直接插入排序（Straight Insertion Sort）】\n核心思想：将待排序序列逐个插入已排好序的部分。\n\n过程：\nfor i=2 to n:\n  L.r[0]=L.r[i]  // r[0]作哨兵\n  j=i-1\n  while r[0].key < r[j].key: r[j+1]=r[j]; j--\n  r[j+1]=r[0]\n\n性能分析：\n最好情况（已有序）：比较n-1次，移动0次，O(n)\n最坏情况（逆序）：比较n(n-1)/2次，移动n(n-1)/2次，O(n²)\n平均：O(n²)\n空间：O(1)，稳定排序\n\n【折半插入排序】\n查找插入位置时改用二分查找，减少比较次数但移动次数不变\n时间复杂度仍O(n²)（移动次数主导）\n\n【希尔排序（Shell Sort）】\n按增量序列 d₁>d₂>...>dₖ=1 进行分组直接插入排序\n各次d-间隔排序后最后一次d=1确保有序\n平均时间复杂度O(n^1.3)，空间O(1)，不稳定",problems:[{q:"对序列[5,3,6,1,4]进行直接插入排序，写出每步结果",a:"初始[5]|3,6,1,4\n插3:[3,5]|6,1,4\n插6:[3,5,6]|1,4\n插1:[1,3,5,6]|4\n插4:[1,3,4,5,6]",d:"easy"},{q:"直接插入排序最好情况下的时间复杂度，给出原因",a:"O(n)：序列已升序，每次插入只需比较1次（哨兵就是当前元素），不需要移动元素，共比较n-1次",d:"medium"},{q:"希尔排序为什么比直接插入排序快？",a:"分组后每组元素个数少，直接插入快；多次预排序后序列接近有序，最后一轮d=1时接近O(n)的最好情况",d:"medium"},{q:"为什么希尔排序是不稳定的排序？",a:"不同增量的分组排序可能改变相同关键字元素的相对顺序",d:"hard"}]},

"ds-10-1":{explanation:"【冒泡排序（Bubble Sort）】\n反复比较相邻元素，将较大者向后移动（像气泡上浮）\n\n过程（改进版，加标志位）：\nfor i=1 to n-1:\n  flag=false\n  for j=1 to n-i:\n    if a[j]>a[j+1]: swap; flag=true\n  if !flag: break（提前终止）\n\n性能：最好O(n)（已有序，flag优化），最坏O(n²)，稳定\n\n【快速排序（Quick Sort）】\n基于分治：选枢轴（pivot），将比枢轴小的放左，大的放右，递归\n\nPartition过程（双指针交替法）：\npivot=a[low]; i=low; j=high\nwhile(i<j):\n  while(i<j && a[j]>=pivot): j--\n  a[i]=a[j]\n  while(i<j && a[i]<=pivot): i++\n  a[j]=a[i]\na[i]=pivot; return i\n\n性能：平均O(nlogn)，最坏O(n²)（有序序列）\n最好：每次枢轴恰好分为等长两部分\n空间：递归栈O(logn)平均，O(n)最坏\n不稳定排序",problems:[{q:"对[3,1,4,1,5,9,2,6]进行冒泡排序第一趟的结果",a:"比较相邻：[1,3,4,1,5,9,2,6]→[1,3,1,4,5,9,2,6]→[1,3,1,4,5,2,9,6]→[1,3,1,4,5,2,6,9]，第一趟结束后9到最后",d:"easy"},{q:"快速排序最坏情况在什么条件下出现？如何避免？",a:"最坏：序列已有序（每次枢轴是最小或最大元素），T(n)=O(n²)。避免：随机选择枢轴，或取首中尾三元素的中位数作枢轴",d:"medium"},{q:"快速排序的平均时间复杂度推导",a:"T(n)=2T(n/2)+O(n)，由主定理得T(n)=O(nlogn)。枢轴平均分割时每层O(n)，共O(logn)层",d:"hard"},{q:"冒泡排序是稳定的，快速排序是不稳定的，用例子说明快排的不稳定性",a:"[3a,3b,1]，pivot=3b（取最后元素），partition后3b可能与前面的3a交换位置，导致相同键值元素的相对顺序改变",d:"hard"}]},

"ds-10-2":{explanation:"【简单选择排序（Selection Sort）】\n每次从未排序部分找最小元素，放到已排序末尾。\n\n过程：\nfor i=1 to n-1:\n  min=i\n  for j=i+1 to n: if a[j]<a[min]: min=j\n  if min!=i: swap(a[i],a[min])\n\n性能：O(n²)比较，O(n)交换，不稳定（交换可能改变相对顺序）\n空间：O(1)\n\n【堆排序（Heap Sort）】\n利用堆（完全二叉树，父节点≥子节点=大根堆）进行排序\n\n建堆过程：从最后一个非叶节点开始，逐个做向下调整（sift down）\n时间O(n)\n\n堆调整（sift down）：\nparent=i; child=2i\nwhile child<=n:\n  if child<n && a[child]<a[child+1]: child++ （选大孩子）\n  if a[parent]>=a[child]: break\n  swap; parent=child; child=2*child\n\n排序过程：\n1. 建大根堆O(n)\n2. 将堆顶（最大值）与末尾交换，堆大小-1\n3. 对新堆顶向下调整O(logn)\n4. 重复n-1次\n\n性能：O(nlogn)，最好最坏均如此，不稳定，空间O(1)",problems:[{q:"对[4,1,3,2]进行选择排序的第一步操作",a:"找最小值1（位置2），与a[1]=4交换，结果[1,4,3,2]",d:"easy"},{q:"建堆操作的时间复杂度为什么是O(n)而非O(nlogn)？",a:"从最后一个非叶节点到根，调整深度逐渐增加但节点数指数减少。精确分析：Σ高度×节点数=O(n)（几何级数）",d:"hard"},{q:"堆排序中，完成建堆后将堆顶元素与最后元素交换，然后做什么？",a:"将堆大小减1，对新的堆顶元素（根节点）进行向下调整（sift down），恢复堆性质，时间O(logn)",d:"medium"},{q:"为什么说选择排序不稳定？举例",a:"[3a,3b,1]，第一次选最小1，与3a交换得[1,3b,3a]，原来3a在3b前，现在3a在3b后，顺序改变",d:"medium"}]},

"ds-10-3":{explanation:"【归并排序（Merge Sort）】\n分治策略：将序列二分，分别递归排序，再合并两个有序子序列。\n\n【合并过程（Merge）】\n双指针分别指向两个有序子数组，比较取小者放入辅助数组。\nvoid Merge(R, T, low, mid, high):\n  i=low; j=mid+1; k=low\n  while(i<=mid && j<=high): T[k++]=R[i]<=R[j]?R[i++]:R[j++]\n  while(i<=mid): T[k++]=R[i++]\n  while(j<=high): T[k++]=R[j++]\n\n【递归归并排序】\nvoid MergeSort(R, T, low, high):\n  if(low==high): T[low]=R[low]; return\n  mid=(low+high)/2\n  MergeSort(R, S, low, mid)\n  MergeSort(R, S, mid+1, high)\n  Merge(S, T, low, mid, high)\n\n时间：O(nlogn)，稳定排序，空间O(n)（需辅助数组）\n\n【非递归（自底向上）归并排序】\nsublen=1,2,4,8,...\n每趟将相邻sublen长度的子数组两两合并\n\n【适用场景】\n外部排序常用归并（大文件排序），稳定性好",problems:[{q:"对[8,3,7,1,5]进行归并排序，写出分裂和合并过程",a:"分：[8,3,7]和[1,5]→[8,3],[7],[1],[5]→[8],[3],[7],[1],[5]\n合并：[3,8],[1,5]→[3,7,8],[1,5]→[1,3,5,7,8]",d:"medium"},{q:"归并排序为什么需要O(n)的额外空间？能否做到O(1)？",a:"合并操作需要辅助数组存储临时结果；原地归并排序可O(1)空间但时间退化到O(n²log n)；实用上通常用O(n)空间换时间",d:"hard"},{q:"归并排序与快速排序的对比",a:"归并：稳定，最坏O(nlogn)，空间O(n)；快排：不稳定，平均O(nlogn)最坏O(n²)，空间O(logn)。实践中快排更快（常数小）",d:"medium"},{q:"自底向上的非递归归并排序，第k趟归并后子数组长度为多少？",a:"每趟步长翻倍：第k趟（从1开始）子数组长度为2^k",d:"easy"}]},

"ds-10-4":{explanation:"【基数排序（Radix Sort）】\n非比较排序，利用关键字的组成部分（位）进行分配和收集。\n\n【LSD（最低位优先）基数排序过程】\n对n个d位r进制数排序：\n从最低位到最高位，每一位做一次计数排序（稳定）：\n1. Count[]统计每个桶（0~r-1）中的元素个数\n2. 计算各桶的起始位置（前缀和）\n3. 从后往前扫描，按当前位的值放入输出数组\n4. 将输出数组复制回原数组\n\n时间复杂度：O(d(n+r))\n空间复杂度：O(n+r)\n稳定排序！（关键：从后往前遍历保证稳定性）\n\n【链式基数排序（经典实现）】\n用r个链表（桶）代替数组辅助空间\n分配：将元素按当前位放入对应桶（链表）\n收集：将所有桶首尾相连，得到新序列\n重复d次\n\n【适用场景】\n关键字由多位组成（整数、字符串、日期）\n当d很小、r合理时，比O(nlogn)更快（线性时间！）\n\n【与其他排序对比】\n基数排序不进行元素比较，适合整数或可按位分析的数据\n不适合浮点数（内存结构复杂）",problems:[{q:"对[170,45,75,90,802,24,2,66]进行LSD基数排序，d=3位，r=10，写出第一趟（个位）结果",a:"按个位分桶：0->[170,90]，2->[802,2]，4->[24]，5->[45,75]，6->[66]；收集:[170,90,802,2,24,45,75,66]",d:"medium"},{q:"基数排序的时间复杂度是多少？什么情况下比O(nlogn)快？",a:"O(d(n+r))；当d和r是常数时为O(n)，比nlogn快。如对n个32位整数：d=10位（十进制），r=10，总O(10n)=O(n)",d:"medium"},{q:"为什么LSD基数排序中，从后往前遍历放入输出数组可以保证稳定性？",a:"相同位值的元素，后遍历的排在后面；由于前一趟已经排好序，从后往前保证了相同位值的元素保持前一趟的相对顺序",d:"hard"},{q:"比较冒泡、快速、堆、归并、基数五种排序的时间复杂度、空间复杂度和稳定性",a:"冒泡：O(n²)/O(n)最好/O(1)/稳定；快速：O(nlogn)平均/O(logn)/不稳定；堆：O(nlogn)/O(1)/不稳定；归并：O(nlogn)/O(n)/稳定；基数：O(d(n+r))/O(n+r)/稳定",d:"hard"}]},

// 第11章 外部排序

"ds-11-0":{explanation:"【外部排序概述】\n数据量超过内存容量，需借助外部存储（磁盘）进行排序。\n\n【基本过程】\n1. 生成归并段（Run）：将数据分批读入内存，用内部排序处理后写回磁盘，形成有序段\n2. 多路归并：将多个归并段逐步合并\n\n【磁盘I/O代价分析】\n总I/O次数=归并段数×归并趟数×2（读+写）\n归并趟数=⌈log_k(m)⌉，m=初始归并段数，k=归并路数\n减少总I/O：增大k（多路归并）或减少m（生成更少更长的归并段）\n\n【置换-选择排序（Replacement Selection）】\n比内存读入再排序方法生成更长的归并段：\n- 维护一个大小为M的内存堆\n- 每次输出堆中最小元素，然后读入新元素\n  - 若新元素≥上次输出元素：加入当前段\n  - 否则：放入下一段等待区\n- 平均段长=2M（理想情况下是内存大小的2倍）",problems:[{q:"外部排序的主要瓶颈是什么？",a:"磁盘I/O次数，因为磁盘读写速度比内存慢数量级，所以减少I/O次数是外部排序的关键",d:"easy"},{q:"用4路归并排序30个归并段，需要几趟归并？",a:"⌈log₄(30)⌉=⌈2.45⌉=3趟",d:"medium"},{q:"置换-选择排序生成的归并段平均长度是纯内存排序的几倍？",a:"约2倍（数学期望为2M，M为内存大小），因为输出元素后新读入的元素有约50%概率大于上次输出，继续留在当前段",d:"hard"}]},

"ds-11-1":{explanation:"【最佳归并树（Optimal Merge Tree）】\n思想：类似哈夫曼树，将归并段长度作为权值，构造最优k叉树以最小化I/O总次数。\n\n【构造规则】\n与哈夫曼树相同：每次选k个最小权值归并段合并\n对于k路归并，若归并段数m不满足(m-1)%(k-1)==0，需要添加长度为0的虚段补充。\n\n【败者树（Loser Tree）】\n实现k路归并时，每次从k个归并段中选最小元素需O(k)时间。\n败者树：完全二叉树，叶节点为各归并段当前元素，每次选胜者（最小元素）只需O(log k)。\n\n初始化：走一遍调整建树O(k log k)\n每次选出最小元素后，沿叶→根调整O(log k)\n总时间：O(n log k)（n=总元素数）\n\n【胜者树 vs 败者树】\n败者树：每个内部节点记录败者（较大者），胜者沿路继续比较\n优点：新元素加入后只需与沿路的败者比较，更新比胜者树更高效",problems:[{q:"什么是败者树？与胜者树相比有什么优势？",a:"败者树的内部节点存败者（较大元素）,胜者继续向上；新元素替换后只需O(log k)从叶到根更新，比胜者树少一半比较次数",d:"medium"},{q:"为什么外部排序要用败者树加速多路归并？",a:"k路归并每次从k个段选最小需O(k)，败者树优化到O(log k)，总归并时间从O(nk)降到O(n log k)",d:"medium"},{q:"构造最佳4路归并树时，若初始有10个归并段，需要补充几个虚段？",a:"(10-1)%(4-1)=9%3=0，整除不需要补充虚段",d:"hard"}]},

// 第12章 文件

"ds-12-0":{explanation:"【文件组织方式】\n\n顺序文件（Sequential File）：\n记录按物理顺序存放，如磁带文件\n特点：顺序访问快O(n)，随机访问慢O(n)\n适用：批量处理、日志文件\n\n索引文件（Indexed File）：\n在数据文件基础上建立索引表（key,address）\n通过索引快速定位记录\n\n散列文件（Hash File）：\n用哈希函数直接定位记录\n适合随机查找，不适合顺序扫描\n\n各种文件的查找效率对比：\n顺序文件：O(n)顺序、O(n)随机\n索引文件：O(logn)（索引二分）+O(1)（磁盘访问）\n散列文件：O(1)平均随机\n\n索引文件进一步分类：\n稠密索引：对每条记录建立一个索引项\n稀疏索引：只对部分记录（如每页第一个）建立索引，节省空间",problems:[{q:"顺序文件适用于什么场景？有什么局限性？",a:"适合：批量顺序处理（日志、账单批量结算）；局限：随机访问需从头扫描O(n)，插入删除困难（需重建）",d:"easy"},{q:"散列文件和索引文件各适合什么查询类型？",a:"散列文件：等值查询O(1)，不支持范围查询；索引文件：支持等值和范围查询，适合多种访问模式",d:"medium"},{q:"为什么文件系统中常用B+树而不是AVL树作为索引结构？",a:"B+树专为磁盘I/O优化：节点大小=磁盘块，每次I/O读一个节点包含多个键；B+树高度低（通常3-4层），而AVL树高度O(logn)但节点只含1个键，I/O次数多",d:"hard"}]},

"ds-12-1":{explanation:"【索引文件详解】\n\n稠密索引：对数据文件中每个记录都建立索引项\n优点：查找速度快；缺点：索引文件大\n\n稀疏索引：只对部分记录建立索引（如每页/每块的第一个记录）\n优点：索引小；缺点：定位后还需块内顺序查找\n\n【B树（多路平衡搜索树）】\nm阶B树：每个节点最多m-1个键和m个孩子\n所有叶节点在同一层（高度平衡）\n每个节点（除根）至少⌈m/2⌉个孩子\n\n【B+树（数据库索引标准）】\nB树的变形：\n- 叶节点链成链表，存储所有数据记录\n- 内部节点只存键值（不存记录），单纯作为索引\n- 一棵m阶B+树内部节点最多m个孩子，叶节点存m个键\n\n优点：范围查询只需遍历叶节点链表\n\n【倒排文件（Inverted Index）】\n每个词对应一个记录列表（Posting List），存储包含该词的文档ID\n全文检索的核心数据结构（搜索引擎、Elasticsearch）",problems:[{q:"什么是B+树？与B树的主要区别",a:"B+树：内部节点不存实际数据，只存键值；所有数据在叶节点，叶节点用链表连接。区别：B树内外节点都存数据，B+树查询效率更稳定且叶节点顺序访问高效",d:"medium"},{q:"倒排索引（Inverted Index）的基本原理",a:"为每个词建立一个文档列表（词→[doc1,doc2,doc3]），查询时取多个关键词的文档列表求交集或并集，实现高效全文检索",d:"easy"},{q:"为什么数据库系统普遍使用B+树而不是哈希索引？",a:"B+树支持范围查询（WHERE a BETWEEN 1 AND 100）和前缀匹配（LIKE 'abc%'）；哈希索引只支持等值查询，且不支持排序。大多数业务查询需要范围查询",d:"hard"}]},

});



/* ═══════ 概率论与数理统计知识点详解（浙大第五版） ═══════ */

Object.assign(kpDetails, {

// 第1章 概率论的基本概念

"prob-1-0":{explanation:"【核心概念】\n随机试验的特征：(1)可在相同条件下重复进行；(2)每次试验的结果不止一个，但所有可能结果事先已知；(3)每次试验前无法确定哪个结果出现。\n\n【样本空间与事件】\n样本空间S是所有可能结果的集合，样本点是S中的元素。随机事件A是S的子集。基本事件是仅含一个样本点的事件。\n\n必然事件Ω=S本身发生概率为1；不可能事件∅发生概率为0。\n\n【分类】\n样本空间分为两类：\n- 有限样本空间：如掷骰子S={1,2,3,4,5,6}\n- 无限样本空间：如连续测量长度S=(0,∞)\n\n【易错点】\n注意区分\"样本空间\"和\"随机事件\"：样本空间是最大的事件，空集是最小的事件。\n\n【应用场景】\n产品质量检测（合格/不合格）、天气预报（晴/阴/雨）、股票涨跌分析等都是随机试验。",problems:[{q:"掷一枚硬币，写出样本空间",a:"S = {正面, 反面} 或 S = {H, T}",d:"easy"},{q:"掷两枚骰子，样本空间有多少个样本点？",a:"36个样本点：(1,1),(1,2),...(6,6)，每个骰子6种结果，组合6×6=36",d:"easy"},{q:"连续掷硬币直到首次出现正面，写出样本空间",a:"S = {H, TH, TTH, TTTH, ...}，无限样本空间（可能出现无限次反面）",d:"medium"},{q:"口袋中有3红2白5个球，不放回取2球，写出样本空间（有序）",a:"有序样本空间：{(r₁,r₂),(r₁,r₃),(r₁,w₁),(r₁,w₂),(r₂,r₁),(r₂,r₃),(r₂,w₁),(r₂,w₂),...}共5×4=20个样本点",d:"medium"},{q:"随机试验E：在区间(0,1)上任取一点，样本空间是什么？",a:"S=(0,1)，这是一个连续的无限样本空间，不可列，样本点是(0,1)中的实数",d:"hard"}]},

"prob-1-1":{explanation:"【事件运算关系】\nA∪B（A或B至少一个发生）、A∩B=AB（A与B同时发生）、A-B=A\\\\bar{B}（A发生而B不发生）、\\\\bar{A}（A不发生，对立事件）。\n\n【运算律】\n交换律：A∪B=B∪A\n结合律：(A∪B)∪C=A∪(B∪C)\n分配律：A∪(BC)=(A∪B)(A∪C)，A(B∪C)=(AB)∪(AC)\n德摩根律：\\\\bar{A∪B}=\\\\bar{A}\\\\bar{B}，\\\\bar{AB}=\\\\bar{A}∪\\\\bar{B}\n\n推广德摩根律：\\\\bar{∪Aᵢ}=∩\\\\bar{Aᵢ}，\\\\bar{∩Aᵢ}=∪\\\\bar{Aᵢ}\n\n【互斥与对立】\n互斥（AB=∅）：A和B不可能同时发生\n对立（\\\\bar{A}=S-A）：A不发生则\\\\bar{A}必发生\n对立必互斥，但互斥不一定对立\n\n【例题解析】\n设A={掷骰子得偶数}={2,4,6}，B={得大于3}={4,5,6}\n则A∪B={2,4,5,6}，AB={4,6}，A-B={2}，\\\\bar{A}={1,3,5}",problems:[{q:"用德摩根律化简 \\\\bar{ABC}",a:"\\\\bar{ABC} = \\\\bar{A}∪\\\\bar{B}∪\\\\bar{C}",d:"easy"},{q:"若A与B互斥，P(A∪B)=？",a:"P(A∪B)=P(A)+P(B)（因为AB=∅，P(AB)=0）",d:"easy"},{q:"证明：A∪B = A∪\\\\bar{A}B",a:"A∪\\\\bar{A}B：A发生或A不发生但B发生，这恰好是A或B至少一个发生，即A∪B。也可验证：A∪\\\\bar{A}B = A∪(B-A) = A∪B",d:"medium"},{q:"证明：(A-B)∪(B-A)=(A∪B)-(AB)",a:"左边=A\\\\bar{B}∪\\\\bar{A}B，右边=(A∪B)\\\\overline{AB}=A\\\\bar{B}∪\\\\bar{A}B，两者相等",d:"medium"},{q:"若A⊂B，证明A∪B=B且AB=A",a:"A⊂B意味着A的每个元素都属于B，所以A∪B=B（B已包含A），AB=A（A与B交集恰好是A自身）",d:"hard"}]},

"prob-1-2":{explanation:"【柯尔莫哥洛夫公理体系】\n(1)非负性：P(A)≥0\n(2)规范性：P(S)=1\n(3)可列可加性：A₁,A₂,...互斥时P(∪Aᵢ)=ΣP(Aᵢ)\n\n【推导性质】\nP(∅)=0；P(\\\\bar{A})=1-P(A)；P(A)≤1\nA⊂B则P(A)≤P(B)\n加法公式：P(A∪B)=P(A)+P(B)-P(AB)\n广义加法公式：P(A∪B∪C)=P(A)+P(B)+P(C)-P(AB)-P(AC)-P(BC)+P(ABC)\n\n【频率与概率】\n频率fn(A)=nA/n是概率的经验近似\n当n→∞时fn(A)→P(A)（大数定律保证）\n\n【概率的计算方法】\n1. 古典概型：P(A)=m/n\n2. 几何概型：P(A)=A的测度/S的测度\n3. 统计概率：大量试验中的频率",problems:[{q:"设P(A)=0.4, P(B)=0.3, P(AB)=0.1，求P(A∪B)",a:"P(A∪B)=0.4+0.3-0.1=0.6",d:"easy"},{q:"证明P(A\\\\bar{B})=P(A)-P(AB)",a:"A=A\\\\bar{B}∪AB且A\\\\bar{B}与AB互斥，故P(A)=P(A\\\\bar{B})+P(AB)，移项得证",d:"medium"},{q:"设P(A)=0.7, P(B)=0.6，证明P(AB)≥0.3",a:"P(AB)=P(A)+P(B)-P(A∪B)≥0.7+0.6-1=0.3（因为P(A∪B)≤1）",d:"hard"},{q:"设P(A)=0.5, P(B)=0.4, P(C)=0.3, P(AB)=0.2, P(AC)=0.1, P(BC)=0.1, P(ABC)=0.05，求P(A∪B∪C)",a:"P(A∪B∪C)=0.5+0.4+0.3-0.2-0.1-0.1+0.05=0.85",d:"medium"},{q:"证明：P(A-B)=P(A)-P(AB)",a:"A=(A-B)∪AB且(A-B)与AB互斥，故P(A)=P(A-B)+P(AB)，移项得P(A-B)=P(A)-P(AB)",d:"easy"}]},

"prob-1-3":{explanation:"【古典概型定义】\n条件：(1)有限样本空间|S|=n；(2)等可能性——每个样本点概率1/n\n\nP(A)=A包含的样本点数m / 样本点总数n\n\n【排列组合基础】\n排列A(n,k)=n!/(n-k)!——有序选取\n组合C(n,k)=n!/[k!(n-k)!]——无序选取\n关键区分：排列有序、组合无序\n\n【组合重要性质】\nC(n,k)=C(n,n-k)\nC(n,k)=C(n-1,k-1)+C(n-1,k)（递推公式）\nΣC(n,k)=2ⁿ（k从0到n）\n\n【几何概型】\n当样本空间为连续区域时，P(A)=A的测度/S的测度\n如线段上取点：P(A)=A的长度/S的长度\n\n【常见题型】\n1. 摸球问题（口袋中取球）\n2. 分配问题（将物品分配给人）\n3. 占位问题（n个球放入m个盒子）\n4. 随机取数问题",problems:[{q:"从10人中选3人组成委员会，有多少种选法？",a:"C(10,3) = 10!/(3!7!) = 120",d:"easy"},{q:"从52张扑克牌中抽5张，求全是红心的概率",a:"有利事件C(13,5)=1287，总数C(52,5)=2598960，P=1287/2598960≈0.00049",d:"medium"},{q:"n个人随机坐n个座位，求恰好k个人坐到自己座位的概率",a:"这等价于n个元素的排列中恰有k个不动点。复杂公式，当k=0时为错排概率≈1/e（n较大时）",d:"hard"},{q:"5男5女随机排成一行，求男女相间的概率",a:"有利：5男5女相间排列，先排男(5!)再排女(5!)，或先排女再排男，共2×5!×5!种。总数10!，P=2×5!×5!/10!=2×120×120/3628800=1/126",d:"medium"},{q:"线段(0,2)上随机取两点，求两点距离小于1的概率",a:"设x,y∈(0,2)，P(|x-y|<1)。几何概型，总区域面积4，满足|xy|<1的区域面积为3。P=3/4",d:"hard"}]},

"prob-1-4":{explanation:"【条件概率】\nP(A|B)=P(AB)/P(B)（P(B)>0）\n含义：在B已发生的条件下A发生的概率\n注意：P(A|B)与P(AB)不同——前者是缩小了样本空间后的概率\n\n【乘法公式】\nP(AB)=P(B)P(A|B)=P(A)P(B|A)\n推广：P(ABC)=P(A)P(B|A)P(C|AB)\n\n【全概率公式】\n若B₁,...,Bₙ是S的划分（互斥且∪Bᵢ=S），则\nP(A)=ΣᵢP(Bᵢ)P(A|Bᵢ)\n应用：将复杂事件分解为简单条件下的组合\n\n【贝叶斯公式】\nP(Bᵢ|A)=P(Bᵢ)P(A|Bᵢ)/ΣP(Bj)P(A|Bj)\n由先验概率P(Bᵢ)和条件概率P(A|Bᵢ)计算后验概率\n\n【应用场景】\n贝叶斯公式的实际应用：\n- 医学诊断：已知检测结果，推断患病概率\n- 机器学习：朴素贝叶斯分类器\n- 信号检测：雷达识别目标真伪\n- 法律推理：证据对嫌疑人的影响",problems:[{q:"设P(A)=0.6, P(B|A)=0.8, P(B|\\\\bar{A})=0.3，求P(B)",a:"P(B)=P(A)P(B|A)+P(\\\\bar{A})P(B|\\\\bar{A})=0.6×0.8+0.4×0.3=0.6",d:"easy"},{q:"某病发病率0.1%，检测阳性率95%（有病），假阳性率2%（无病）。检测阳性时实际患病概率？",a:"P(病|阳)=0.001×0.95/(0.001×0.95+0.999×0.02)≈0.0456=4.56%（贝叶斯公式经典例题）",d:"medium"},{q:"三个盒子各含不同比例的红白球，随机选一个盒子再取球，已知取到红球，求来自第一个盒子的概率",a:"用贝叶斯公式，P(box₁|red)=P(box₁)P(red|box₁)/ΣP(boxᵢ)P(red|boxᵢ)，代入具体数值计算",d:"hard"},{q:"甲乙丙三厂生产同种产品，分别占60%、30%、10%，次品率分别为2%、3%、5%，随机取一件发现是次品，求是甲厂产品的概率",a:"P(甲|次品)=0.6×0.02/(0.6×0.02+0.3×0.03+0.1×0.05)=0.012/0.026≈0.462",d:"medium"},{q:"用乘法公式证明P(ABC)=P(A)P(B|A)P(C|AB)",a:"P(ABC)=P(AB)P(C|AB)=P(A)P(B|A)P(C|AB)，逐步缩小样本空间",d:"easy"}]},

"prob-1-5":{explanation:"【独立性定义】\n两事件独立：P(AB)=P(A)P(B)\n含义：A的发生不影响B的概率，即P(B|A)=P(B)\n\n【重要结论】\n独立≠互斥！互斥时P(AB)=0，若P(A)>0且P(B)>0则不可能独立\n\n【多事件独立】\n三事件独立需四个条件同时成立：\nP(AB)=P(A)P(B)、P(AC)=P(A)P(C)、P(BC)=P(B)P(C)、P(ABC)=P(A)P(B)P(C)\n两两独立不保证相互独立！\n\n【独立性的判断方法】\n1. 由题设直接给出\n2. 由实际意义判断（不同人掷硬币、不同批次产品）\n3. 验证P(AB)=P(A)P(B)\n\n【独立性的应用】\n若A,B独立，则：\nP(A∪B)=P(A)+P(B)-P(A)P(B)\nP(A|B)=P(A)\n\\\\bar{A}与\\\\bar{B}也独立\nA与\\\\bar{B}也独立\n\n【易错点】\n- 有P(AB)=P(A)P(B)但A,B未必独立（数值巧合）\n- 独立性是基于概率的定义，不是基于事件的\"因果关系\"",problems:[{q:"若P(A)=0.5, P(B)=0.4, P(AB)=0.2，A与B是否独立？",a:"P(AB)=0.2=P(A)P(B)=0.5×0.4=0.2，故独立",d:"easy"},{q:"若A与B互斥且P(A)>0, P(B)>0，A与B是否独立？",a:"P(AB)=0≠P(A)P(B)>0，故不独立。互斥且概率非零→必不独立",d:"medium"},{q:"举例说明两两独立但不相互独立的三事件",a:"掷两枚均匀硬币，A={第1枚H}, B={第2枚H}, C={两枚同面}。P(AB)=1/4=P(A)P(B), P(AC)=1/4=P(A)P(C), P(BC)=1/4=P(B)P(C)，但P(ABC)=1/4≠P(A)P(B)P(C)=1/8",d:"hard"},{q:"A,B独立，证明\\\\bar{A},\\\\bar{B}也独立",a:"P(\\\\bar{A}\\\\bar{B})=P(\\\\bar{A∪B})=1-P(A∪B)=1-P(A)-P(B)+P(A)P(B)=(1-P(A))(1-P(B))=P(\\\\bar{A})P(\\\\bar{B})",d:"medium"},{q:"三次独立射击，命中率分别为0.4, 0.5, 0.7，求至少命中一次的概率",a:"P(至少一次)=1-P(全未中)=1-(1-0.4)(1-0.5)(1-0.7)=1-0.6×0.5×0.3=1-0.09=0.91",d:"easy"}]},

// 第2章 随机变量及其分布

"prob-2-0":{explanation:"【随机变量定义】\n随机变量X是定义在样本空间S上的实值函数X:S→R\n\n【分类】\n离散型：取有限或可列个值，如掷骰子X∈{1,2,3,4,5,6}\n连续型：取值充满某区间，如测量误差X∈(-∞,+∞)\n\n【引入随机变量的意义】\n1. 将样本空间的抽象元素映射为实数，便于数学处理\n2. 可用微积分工具研究概率问题\n3. 随机变量的分布完整描述了取值的概率规律\n\n【分布的描述方式】\n离散型：分布律 P(X=xₖ)=pₖ\n连续型：概率密度函数 f(x)\n通用：分布函数 F(x)=P(X≤x)\n\n【常见随机变量举例】\n- 掷骰子X=点数→离散型\n- 测量误差X→连续型（正态分布）\n- 等车时间X→连续型（指数分布）\n- 产品合格数X→离散型（二项分布）",problems:[{q:"掷骰子，定义X=出现的点数，写出X的所有可能值",a:"X∈{1,2,3,4,5,6}",d:"easy"},{q:"掷两枚骰子，定义X=点数之和，X的可能值范围",a:"X∈{2,3,...,12}，最小1+1=2，最大6+6=12",d:"easy"},{q:"X表示n次伯努利试验中成功的次数，X可能取什么值？",a:"X∈{0,1,2,...,n}，离散型，服从二项分布B(n,p)",d:"medium"},{q:"定义X=灯泡寿命（小时），X属于什么类型？",a:"X∈(0,+∞)，连续型，通常服从指数分布或威布尔分布",d:"medium"}]},

"prob-2-1":{explanation:"【离散型分布律】\nP(X=xₖ)=pₖ，k=1,2,...，满足pₖ≥0且Σpₖ=1\n分布律可用表格表示：\n| X | x₁ | x₂ | ... | xₙ |\n| P | p₁ | p₂ | ... | pₙ |\n\n【常见离散分布】\n(0-1)分布B(1,p)：X取0或1，P(X=1)=p\n二项分布B(n,p)：n次独立伯努利试验的成功次数\nP(X=k)=C(n,k)pᵏ(1-p)ⁿ⁻ᵏ，k=0,1,...,n\n泊松分布π(λ)：用于稀有事件计数\nP(X=k)=λᵏe⁻λ/k!，k=0,1,2,...\n\n【泊松定理】\n当n大p小时，λ=np，B(n,p)≈π(λ)\n条件：n≥20且p≤0.05时近似效果好\n\n【各分布的关系】\n(0-1)分布是n=1的二项分布\n泊松分布是二项分布的极限近似\n超几何分布→二项分布（当N很大时）",problems:[{q:"X~B(5,0.3)，求P(X=2)",a:"P(X=2)=C(5,2)×0.3²×0.7³=10×0.09×0.343=0.3087",d:"easy"},{q:"X~π(2)，求P(X=0)",a:"P(X=0)=e⁻²≈0.1353",d:"easy"},{q:"用泊松分布近似计算B(100,0.02)的P(X=3)",a:"λ=100×0.02=2，P≈2³×e⁻²/6=8×0.1353/6≈0.1804",d:"medium"},{q:"X~B(10,0.2)，求P(X≥8)",a:"P(X≥8)=P(8)+P(9)+P(10)=C(10,8)×0.2⁸×0.8²+C(10,9)×0.2⁹×0.8+0.2¹⁰=45×0.00000256×0.64+10×0.000000512×0.8+0.0000001≈0.000078",d:"medium"},{q:"某路口每小时事故数X~π(0.5)，求一小时内无事故的概率",a:"P(X=0)=e⁻⁰·⁵≈0.6065",d:"easy"}]},

"prob-2-2":{explanation:"【分布函数定义】\nF(x)=P(X≤x)刻画随机变量取值不超过x的概率\n\n【基本性质】\n(1)单调递增：x₁<x₂→F(x₁)≤F(x₂)\n(2)0≤F(x)≤1\n(3)F(-∞)=0, F(+∞)=1\n(4)右连续：F(x⁺)=F(x)\n\n【概率计算】\nP(a<X≤b)=F(b)-F(a)\nP(X>a)=1-F(a)\nP(X≤a)=F(a)\n\n【离散型与连续型】\n离散型：F(x)是阶梯函数，在xₖ处有跳跃pₖ\n连续型：F(x)是连续函数，F'(x)=f(x)\n\n【分布函数的作用】\n统一描述离散型和连续型随机变量\n是研究随机变量的最基本工具",problems:[{q:"X的分布律P(X=1)=0.3, P(X=2)=0.5, P(X=3)=0.2，写出F(x)",a:"F(x)=0(x<1), 0.3(1≤x<2), 0.8(2≤x<3), 1(x≥3)",d:"easy"},{q:"已知F(x)=0(x<0), x²(0≤x<1), 1(x≥1)，求P(0.3<X≤0.7)",a:"P=F(0.7)-F(0.3)=0.49-0.09=0.4",d:"medium"},{q:"F(x)=1-e⁻²x(x≥0)，求P(X>1)",a:"P(X>1)=1-F(1)=1-(1-e⁻²)=e⁻²≈0.1353",d:"medium"},{q:"已知F(x)，证明P(X=x)=F(x)-F(x⁻)（x⁻表示左极限）",a:"P(X≤x)=F(x)，P(X<x)=F(x⁻)，P(X=x)=P(X≤x)-P(X<x)=F(x)-F(x⁻)，对连续型此值为0",d:"hard"}]},

"prob-2-3":{explanation:"【连续型随机变量】\n概率密度f(x)满足：(1)f(x)≥0；(2)∫₋∞⁺∞f(x)dx=1；(3)F(x)=∫₋∞ˣf(t)dt；(4)在f(x)连续点F'(x)=f(x)\n\n【重要性质】\nP(a<X<b)=∫ₐᵇf(x)dx（积分等于概率）\nP(X=x₀)=0（单点概率为零）\n因此P(a<X<b)=P(a≤X≤b)=P(a<X≤b)=P(a≤X<b)\n\n【常见连续分布】\n均匀分布U(a,b)：f(x)=1/(b-a), x∈(a,b)\n指数分布Exp(λ)：f(x)=λe⁻λx, x≥0，无记忆性P(X>s+t|X>s)=P(X>t)\n正态分布N(μ,σ²)：f(x)=(1/σ√2π)e⁻(x-μ)²/2σ²\n\n【正态分布】\n最重要的概率分布！\n标准化：Z=(X-μ)/σ→N(0,1)\n3σ法则：P(μ-3σ<X<μ+3σ)≈0.9974\n正态分布在自然界中广泛出现（身高、误差、成绩等）\n\n【指数分布的无记忆性】\nP(X>s+t|X>s)=P(X>t)\n含义：已经等待了s时间，再等t时间的概率与从头等t时间一样",problems:[{q:"X~U(0,5)，求P(1<X<3)",a:"P=(3-1)/(5-0)=2/5=0.4",d:"easy"},{q:"X~Exp(0.5)，求P(X>4)",a:"P(X>4)=e⁻⁰·⁵×⁴=e⁻²≈0.1353",d:"medium"},{q:"X~N(2,4)，求P(0<X<4)",a:"标准化Z=(X-2)/2，P(0<X<4)=P(-1<Z<1)=2Φ(1)-1≈0.6826",d:"medium"},{q:"X~U(-1,3)，求E(X)和D(X)",a:"E(X)=(−1+3)/2=1, D(X)=(3−(−1))²/12=16/12=4/3",d:"easy"},{q:"验证指数分布的无记忆性：X~Exp(λ)，证明P(X>s+t|X>s)=P(X>t)",a:"P(X>s+t|X>s)=P(X>s+t)/P(X>s)=e⁻λ(s+t)/e⁻λs=e⁻λt=P(X>t)",d:"hard"}]},

"prob-2-4":{explanation:"【随机变量函数的分布】\nY=g(X)的分布求解是概率论基本技巧\n\n【离散型】\n直接列出Y的可能值及对应概率\n例：X分布律P(X=-1)=0.2,P(X=0)=0.3,P(X=1)=0.5\nY=X²→P(Y=0)=0.3,P(Y=1)=0.2+0.5=0.7\n\n【连续型——定理法】\n步骤：\n1. 写出F_Y(y)=P(Y≤y)=P(g(X)≤y)\n2. 找出满足g(x)≤y的x的范围\n3. 在该范围上积分：F_Y(y)=∫f(x)dx\n4. 对F_Y(y)求导得f_Y(y)\n\n【连续型——公式法】\ng单调可导时：f_Y(y)=f_X(h(y))|h'(y)|\n其中h是g的反函数x=h(y)\n\n使用条件：g必须单调（否则需分段处理）\n\n【例题解析】\nX~U(0,1), Y=X²\n方法1：F_Y(y)=P(X²≤y)=P(X≤√y)=√y（0≤y≤1）\n方法2：h(y)=√y, h'(y)=1/(2√y)\nf_Y(y)=1·(1/(2√y))=1/(2√y)（0<y<1）",problems:[{q:"X~U(0,1)，Y=X²，求f_Y(y)",a:"y=x²单调（x≥0），h(y)=√y, h'(y)=1/(2√y)，f_Y(y)=1/(2√y)，0<y<1",d:"medium"},{q:"X~N(0,1)，Y=X²，求Y的分布",a:"Y~χ²(1)（自由度为1的χ²分布），这是χ²分布的定义来源",d:"hard"},{q:"X~Exp(1)，Y=eˣ，求Y的分布",a:"y=eˣ单调递增，x=ln y, f_Y(y)=1/y²(y>1)，Y服从参数为1的帕累托分布",d:"medium"},{q:"X~N(μ,σ²)，Y=aX+b(a≠0)，求Y的分布",a:"Y~N(aμ+b, a²σ²)，线性变换保持正态性，只是参数改变",d:"easy"},{q:"X~U(-1,1)，Y=X²，求f_Y(y)",a:"F_Y(y)=P(X²≤y)=P(-√y≤X≤√y)=2√y/2=√y(0≤y≤1)，f_Y(y)=1/(2√y)，注意：y=x²在(-1,1)上不单调，需用定理法分段处理",d:"hard"}]},

// 第3章 多维随机变量

"prob-3-0":{explanation:"【联合分布函数】\n二维随机变量(X,Y)的联合分布函数F(x,y)=P(X≤x,Y≤y)\n\n【性质】\n关于x和y单调递增、右连续\nF(-∞,y)=F(x,-∞)=0\nF(+∞,+∞)=1\n0≤F(x,y)≤1\n\n【联合分布律（离散型）】\nP(X=xᵢ,Y=yj)=pᵢj表示，ΣΣpᵢj=1\n\n【联合概率密度（连续型）】\nF(x,y)=∫∫f(u,v)dudv\n性质：f(x,y)≥0；∫∫f(x,y)dxdy=1\nP((X,Y)∈D)=∫∫_D f(x,y)dxdy\n\n【二维均匀分布】\n区域D上的均匀分布：f(x,y)=1/A(D)\n其中A(D)是D的面积\n\n【二维正态分布】\n(X,Y)~N(μ₁,μ₂,σ₁²,σ₂²,ρ)\nρ是相关系数，决定X,Y的线性关联程度\n二维正态的边缘分布仍为正态\n二维正态中独立与不相关等价",problems:[{q:"二维离散型随机变量，P(X=1,Y=1)=0.3, P(X=1,Y=0)=0.2, P(X=0,Y=1)=0.4, P(X=0,Y=0)=0.1，验证Σpᵢj=1",a:"0.3+0.2+0.4+0.1=1，验证成立",d:"easy"},{q:"二维均匀分布，区域D为0≤x≤1, 0≤y≤1，写出f(x,y)",a:"f(x,y)=1, (x,y)∈D；f(x,y)=0, 其他。面积=1故密度=1",d:"easy"},{q:"f(x,y)=4xy(0<x<1,0<y<1)，求P(X<0.5,Y<0.5)",a:"P=∫₀⁰·⁵∫₀⁰·⁵4xydydx=4∫₀⁰·⁵x[½y²]₀⁰·⁵dx=4×0.25×0.125×0.25=0.0625",d:"medium"},{q:"验证f(x,y)=6e⁻³ˣ⁻²ʸ(x>0,y>0)是否为合法密度",a:"∫₀⁺∞∫₀⁺∞6e⁻³ˣ⁻²ʸdxdy=6×(1/3)×(1/2)=1，验证成立",d:"easy"}]},

"prob-3-1":{explanation:"【边缘分布定义】\n从联合分布中提取单个变量的分布\nF_X(x)=F(x,+∞)\nF_Y(y)=F(+∞,y)\n\n【边缘密度】\nf_X(x)=∫₋∞⁺∞f(x,y)dy\nf_Y(y)=∫₋∞⁺∞f(x,y)dx\n\n【重要结论】\n联合分布唯一确定边缘分布\n但边缘分布不能唯一确定联合分布！\n\n【离散型边缘分布律】\npᵢ=Σj pᵢj（X的边缘）\npj=Σᵢ pᵢj（Y的边缘）\n\n【例题解析】\nf(x,y)=2e⁻ˣ⁻²ʸ(x>0,y>0)\nf_X(x)=∫₀⁺∞2e⁻ˣ⁻²ʸdy=2e⁻ˣ∫₀⁺∞e⁻²ʸdy=2e⁻ˣ×(1/2)=e⁻ˣ\n所以X~Exp(1)\n\n【为什么边缘不能确定联合？】\n因为联合分布还包含X和Y的关联信息（相关性），仅知道各自的分布无法推断它们之间的关联",problems:[{q:"已知f(x,y)=2e⁻ˣ⁻²ʸ(x>0,y>0)，求f_X(x)",a:"f_X(x)=∫₀⁺∞2e⁻ˣ⁻²ʸdy=2e⁻ˣ·(1/2)=e⁻ˣ(x>0)，X~Exp(1)",d:"medium"},{q:"举例说明相同边缘分布可对应不同联合分布",a:"设(X,Y)和(U,V)均为取值{0,1}的二元变量，联合分布律不同但边缘分布律相同。如：P(XY=11)=0.3和0.1，但P(X=1)=0.5相同",d:"hard"},{q:"f(x,y)=1(x²+y²≤1)，求f_X(x)",a:"f_X(x)=∫₋√(1-x²)到√(1-x²) 1 dy=2√(1-x²)，|x|≤1",d:"medium"},{q:"离散型P(X=0,Y=0)=0.1, P(X=0,Y=1)=0.4, P(X=1,Y=0)=0.2, P(X=1,Y=1)=0.3，求边缘分布",a:"P(X=0)=0.5, P(X=1)=0.5；P(Y=0)=0.3, P(Y=1)=0.7",d:"easy"}]},

"prob-3-2":{explanation:"【条件分布定义】\n已知Y=y条件下X的分布\n\n【离散型】\nP(X=xᵢ|Y=yj)=pᵢj/pj（pj>0）\n含义：在Y=yj已发生的条件下X取xᵢ的概率\n\n【连续型】\nf(x|y)=f(x,y)/f_Y(y)（f_Y(y)>0）\n含义：在Y=y条件下X的概率密度\n\n【性质】\n条件分布也是概率分布，满足分布的所有性质\n条件密度在y固定时是x的函数\n\n【条件期望】\nE(X|Y=y)=∫xf(x|y)dx\nE(X|Y)是Y的函数，仍是随机变量\nE[E(X|Y)]=E(X)（期望的期望等于原期望）\n\n【应用】\n条件分布用于：\n- 贝叶斯推断中的后验分布\n- 回归分析中Y对X的依赖关系\n- 信号处理中的条件估计",problems:[{q:"f(x,y)=x+y(0<x<1,0<y<1)，求f(x|y=0.5)",a:"f_Y(0.5)=∫₀¹(x+0.5)dx=0.75，f(x|0.5)=(x+0.5)/0.75",d:"medium"},{q:"离散型P(X=0,Y=0)=0.1, P(X=0,Y=1)=0.4, P(X=1,Y=0)=0.2, P(X=1,Y=1)=0.3，求P(X=1|Y=1)",a:"P(X=1|Y=1)=P(X=1,Y=1)/P(Y=1)=0.3/0.7≈0.429",d:"easy"},{q:"f(x,y)=2e⁻ˣ⁻²ʸ(x>0,y>0)，求f(x|y)",a:"f_Y(y)=∫₀⁺∞2e⁻ˣ⁻²ʸdx=2e⁻²ʸ∫₀⁺∞e⁻ˣdx=2e⁻²ʸ，f(x|y)=2e⁻ˣ⁻²ʸ/2e⁻²ʸ=e⁻ˣ，即X|Y=y~Exp(1)（独立时条件=边缘）",d:"medium"}]},

"prob-3-3":{explanation:"【独立性定义】\nX与Y独立：F(x,y)=F_X(x)F_Y(y)\n或f(x,y)=f_X(x)f_Y(y)\n等价条件：P(X≤x,Y≤y)=P(X≤x)P(Y≤y)对所有x,y成立\n\n【离散型独立性】\npᵢj=pᵢ·pj对所有i,j成立\n\n【连续型独立性】\nf(x,y)=f_X(x)·f_Y(y)\n判断方法：看f(x,y)能否分解为仅含x的函数与仅含y的函数的乘积\n\n【独立的重要推论】\n独立时条件分布=边缘分布：f(x|y)=f_X(x)\n独立时E(XY)=E(X)E(Y)\n独立时D(X+Y)=D(X)+D(Y)\n\n【独立性判断技巧】\n1. 密度能否分解？（连续型核心方法）\n2. 支撑区域是否为矩形？（非矩形区域→不独立）\n3. 实际意义判断（不同批次产品→独立）\n\n【二维正态分布的特殊性】\n(X,Y)~N(μ₁,μ₂,σ₁²,σ₂²,ρ)\nX,Y独立 ↔ ρ=0 ↔ X,Y不相关\n这是正态分布的重要性质！",problems:[{q:"f(x,y)=6e⁻²ˣ⁻³ʸ(x>0,y>0)，判断独立性",a:"f_X(x)=2e⁻²ˣ, f_Y(y)=3e⁻³ʸ, f(x,y)=f_X(x)·f_Y(y)，故独立",d:"easy"},{q:"f(x,y)=8xy(0<x<y<1)，判断独立性",a:"不独立，因为联合密度不能分解为边缘密度之积，且区域0<x<y<1不是矩形",d:"medium"},{q:"f(x,y)=1(0<x<2,0<y<1)，判断独立性",a:"独立！f(x,y)=1=½×1=f_X(x)·f_Y(y)，其中f_X(x)=½(0<x<2), f_Y(y)=1(0<y<1)，且支撑区域是矩形",d:"easy"},{q:"二维正态分布中ρ=0意味着什么？",a:"ρ=0意味着X,Y独立且不相关。二维正态分布中独立与不相关等价，这是正态分布的特殊性质",d:"medium"}]},

"prob-3-4":{explanation:"【随机变量函数的分布】\nZ=g(X,Y)的分布：求F_Z(z)=P(Z≤z)=P(g(X,Y)≤z)，然后在相应区域积分\n\n【Z=X+Y的分布——卷积公式】\n连续型：f_Z(z)=∫f(x,z-x)dx\nX,Y独立时：f_Z(z)=∫f_X(x)f_Y(z-x)dx（卷积）\n\n【Z=max(X,Y)的分布】\nF_Z(z)=P(max≤z)=P(X≤z,Y≤z)=F_X(z)F_Y(z)（独立时）\n\n【Z=min(X,Y)的分布】\nF_Z(z)=P(min≤z)=1-P(min>z)=1-P(X>z,Y>z)\n=1-[1-F_X(z)][1-F_Y(z)]（独立时）\n\n【应用场景】\n并联系统寿命=max(各元件寿命)\n串联系统寿命=min(各元件寿命)\n总支出=各项支出之和\n\n【解题步骤】\n1. 确定g(X,Y)的形式\n2. 写出F_Z(z)的表达式\n3. 找出g(X,Y)≤z对应的(X,Y)区域\n4. 在该区域上对f(x,y)积分\n5. 对F_Z(z)求导得f_Z(z)",problems:[{q:"X~Exp(1), Y~Exp(2)独立，求Z=X+Y的密度",a:"f_Z(z)=∫₀ᶻe⁻ˣ·2e⁻²⁽ᶻ⁻ˣ⁾dx=2e⁻²ᶻ∫₀ᶻeˣdx=2e⁻²ᶻ(eᶻ-1)=2(e⁻ᶻ-e⁻²ᶻ)，z>0",d:"hard"},{q:"X,Y独立均匀分布U(0,1)，求Z=X+Y的密度",a:"f_Z(z)=z(0<z≤1), f_Z(z)=2-z(1<z<2)（三角分布，卷积结果）",d:"medium"},{q:"X,Y独立，F_X(x)=1-e⁻ˣ, F_Y(y)=1-e⁻²ʸ，求Z=min的分布",a:"F_Z(z)=1-(e⁻ˣ)(e⁻²ᶻ)=1-e⁻³ᶻ，Z~Exp(3)",d:"medium"},{q:"X,Y独立，F_X(x)=x²(0<x<1), F_Y(y)=y²(0<y<1)，求Z=max的分布",a:"F_Z(z)=F_X(z)F_Y(z)=z⁴(0<z<1)",d:"easy"}]},

// 第4章 数字特征

"prob-4-0":{explanation:"【数学期望定义】\n数学期望E(X)是随机变量取值的加权平均（以概率为权重）\n\n离散型：E(X)=Σxₖpₖ\n连续型：E(X)=∫xf(x)dx\n\n【期望的性质】\nE(C)=C（常数的期望是常数本身）\nE(aX+bY)=aE(X)+bE(Y)（线性性质）\nX,Y独立时E(XY)=E(X)E(Y)\n\n【随机变量函数的期望】\nE[g(X)]无需先求Y=g(X)的分布！\n离散型：E[g(X)] = Σg(xₖ)pₖ\n连续型：E[g(X)] = ∫g(x)f(x)dx\n\n【常见分布期望速查】\nB(n,p)→np\nπ(λ)→λ\nU(a,b)→(a+b)/2\nExp(λ)→1/λ\nN(μ,σ²)→μ\n\n【应用】\n期望是决策论的核心指标：选择期望收益最大的方案\n保险精算：用期望损失计算保费\n投资分析：期望收益率评估投资方案",problems:[{q:"X分布律P(X=-1)=0.2, P(X=0)=0.3, P(X=2)=0.5，求E(X)",a:"E(X)=(-1)×0.2+0×0.3+2×0.5=0.8",d:"easy"},{q:"X~U(1,5)，求E(X)",a:"E(X)=(1+5)/2=3",d:"easy"},{q:"设Y=2X+3，已知E(X)=1，求E(Y)",a:"E(Y)=2E(X)+3=2×1+3=5",d:"easy"},{q:"X~N(3,4)，求E(2X²-1)",a:"E(X)=3, E(X²)=D(X)+[E(X)]²=4+9=13, E(2X²-1)=2×13-1=25",d:"medium"},{q:"某投资方案：盈利100万概率0.3，盈利50万概率0.5，亏损20万概率0.2，期望收益？",a:"E=100×0.3+50×0.5-20×0.2=30+25-4=51万",d:"easy"}]},

"prob-4-1":{explanation:"【方差定义】\nD(X)=E[X-E(X)]²=E(X²)-[E(X)]²\n方差衡量随机变量取值的离散程度\n标准差σ=√D(X)，与均值同量纲便于比较\n\n【方差的性质】\nD(C)=0（常数无波动）\nD(aX+b)=a²D(X)（线性变换中方差乘以系数平方）\nX,Y独立时D(X+Y)=D(X)+D(Y)\nD(X-Y)=D(X)+D(Y)（注意不是D(X)-D(Y)！）\n\n【常见分布方差速查】\nB(n,p)→np(1-p)\nπ(λ)→λ\nU(a,b)→(b-a)²/12\nExp(λ)→1/λ²\nN(μ,σ²)→σ²\n\n【方差的应用】\n- 风险评估：方差越大风险越高（金融投资）\n- 质量控制：方差越小产品一致性越好\n- 精度评价：测量方差反映测量精度\n\n【计算技巧】\n常用D(X)=E(X²)-[E(X)]²\n先算E(X)和E(X²)，再相减\n比直接用D(X)=Σ(xₖ-E(X))²pₖ更简便",problems:[{q:"X~B(10,0.3)，求D(X)",a:"D(X)=10×0.3×0.7=2.1",d:"easy"},{q:"X~U(0,2)，求D(X)",a:"D(X)=(2-0)²/12=4/12=1/3",d:"easy"},{q:"已知E(X)=2, E(X²)=5，求D(X)",a:"D(X)=E(X²)-[E(X)]²=5-4=1",d:"easy"},{q:"X~N(1,9)，Y=3X-2，求D(Y)",a:"D(Y)=9D(X)=9×9=81",d:"medium"},{q:"X,Y独立，D(X)=2, D(Y)=3，求D(2X-Y)",a:"D(2X-Y)=4D(X)+D(Y)=4×2+3=11",d:"medium"}]},

"prob-4-2":{explanation:"【协方差定义】\nCov(X,Y)=E[(X-E(X))(Y-E(Y))]=E(XY)-E(X)E(Y)\n衡量两个变量的线性关联程度\n\n【相关系数】\nρ=Cov(X,Y)/√(D(X)D(Y))，|ρ|≤1\nρ=0：X,Y不相关（但未必独立）\nρ=±1：X,Y完全线性相关（Y=aX+b）\nρ>0：正相关（X增大时Y倾向于增大）\nρ<0：负相关\n\n【重要结论】\n独立→不相关（ρ=0），但反之不一定成立\n例外：正态分布中独立与不相关等价！\n\n【协方差的性质】\nCov(X,X)=D(X)\nCov(aX,bY)=abCov(X,Y)\nCov(X+Y,Z)=Cov(X,Z)+Cov(Y,Z)\nD(X+Y)=D(X)+D(Y)+2Cov(X,Y)\n\n【|ρ|≤1的证明】\n由Cauchy-Schwarz不等式：\n[E(XY)]²≤E(X²)E(Y²)\n代入标准化变量即得ρ²≤1\n\n【应用】\n- 金融：股票收益率相关系数衡量关联性\n- 统计：回归分析中ρ反映线性关系强度\n- 机器学习：特征选择中去除高度相关特征",problems:[{q:"已知E(X)=1, E(Y)=2, E(XY)=3，求Cov(X,Y)",a:"Cov(X,Y)=E(XY)-E(X)E(Y)=3-1×2=1",d:"easy"},{q:"举例说明不相关但不独立",a:"设X~N(0,1), Y=X²，则Cov(X,Y)=E(X³)-0=0（不相关），但Y完全由X决定（不独立）",d:"hard"},{q:"|ρ|≤1如何证明？",a:"由Cauchy-Schwarz不等式：[E(XY)]²≤E(X²)E(Y²)，代入标准化变量即得ρ²≤1",d:"medium"},{q:"已知D(X)=4, D(Y)=9, Cov(X,Y)=6，求ρ",a:"ρ=Cov(X,Y)/√(D(X)D(Y))=6/√(36)=6/6=1，完全正相关",d:"easy"},{q:"D(X+Y)=D(X)+D(Y)+2Cov(X,Y)的含义",a:"两个变量之和的方差不仅等于各自方差之和，还要加上2倍协方差。独立时协方差为0才退化为方差之和",d:"medium"}]},

"prob-4-3":{explanation:"【矩的概念】\nk阶原点矩μₖ=E(Xᵏ)\nk阶中心矩=E[X-E(X)]ᵏ\n\n一阶原点矩=期望E(X)\n二阶中心矩=方差D(X)\n三阶中心矩反映偏度（不对称性）\n四阶中心矩反映峰度（尾部厚度）\n\n【协方差矩阵】\nC=(cᵢj)ₙₓₙ，cᵢj=Cov(Xᵢ,Xj)\n\n性质：\n- 对称矩阵：cᵢj=cjᵢ\n- 对角线cᵢᵢ=D(Xᵢ)≥0\n- 非负定矩阵（所有特征值≥0）\n\n【n维正态分布】\n由均值向量μ和协方差矩阵C完全确定\n\n密度：f(x)=(2π)⁻ⁿ/²|C|⁻¹/²exp[-½(x-μ)'C⁻¹(x-μ)]\n\n重要性质：\n- n维正态的边缘分布仍为正态\n- n维正态的线性变换仍为正态\n- n维正态中独立与不相关等价\n- Xᵢ独立↔C为对角矩阵\n\n【应用】\n协方差矩阵在PCA（主成分分析）、马氏距离、多元统计中是核心工具",problems:[{q:"X的分布律P(X=1)=0.4, P(X=2)=0.6，求二阶原点矩",a:"E(X²)=1²×0.4+2²×0.6=0.4+2.4=2.8",d:"easy"},{q:"X~N(0,1)，求三阶原点矩E(X³)",a:"E(X³)=0（正态分布关于均值对称，奇数阶中心矩为0）",d:"medium"},{q:"协方差矩阵为什么是非负定的？",a:"对任意向量a，a'Ca=Var(a'X)≥0（因为方差非负），因此C是非负定矩阵",d:"hard"}]},

// 第5章 大数定律及中心极限定理

"prob-5-0":{explanation:"【切比雪夫不等式】\nP(|X-E(X)|≥ε)≤D(X)/ε²\n给出偏差概率的上界，不需要知道分布类型\n\n应用举例：X~N(0,1)时P(|X|≥3)≤1/9≈0.111\n而实际P≈0.0027，说明切比雪夫估计较粗但普适\n\n【大数定律三种形式】\n\n切比雪夫大数定律：\nX₁,...,Xₙ独立，E(Xᵢ)=μᵢ, D(Xᵢ)≤C\n则(ΣXᵢ)/n-(Σμᵢ)/n→0(n→∞)\n\n辛钦大数定律（独立同分布）：\nX₁,...,Xₙ独立同分布E(Xᵢ)=μ\n则(ΣXᵢ)/n→μ(n→∞)（概率意义下）\n不需要方差存在！仅需要期望存在即可\n\n伯努利大数定律：\nfn(A)=nA/n→P(A)(n→∞)\n频率的稳定性——当试验次数增大时频率趋于概率\n\n【大数定律的意义】\n1. 为统计推断提供理论基础\n2. 保证样本均值可以作为总体均值的估计\n3. 解释了为什么大量重复试验的结果趋于稳定\n4. 是保险业大数法则的理论依据\n\n【易错点】\n大数定律说的是\"概率收敛\"不是\"必然收敛\"\n即概率趋近1但不等于1，个别极端情况仍可能发生",problems:[{q:"X~N(0,1)，用切比雪夫不等式估计P(|X|≥3)",a:"P(|X|≥3)≤1/9≈0.111，实际P≈0.0027（切比雪夫估计较粗）",d:"medium"},{q:"为什么大数定律是统计学的理论基础？",a:"大数定律保证了样本均值收敛于总体均值，使得用样本统计量估计总体参数成为可靠的推断方法",d:"medium"},{q:"辛钦大数定律与切比雪夫大数定律的区别",a:"辛钦要求独立同分布但不需方差存在；切比雪夫不要求同分布但需方差有界。辛钦条件更弱但适用范围也更窄",d:"hard"},{q:"用切比雪夫不等式估计：X̄(n=100, σ=2)偏离μ超过0.5的概率",a:"D(X̄)=σ²/n=4/100=0.04, P(|X̄-μ|≥0.5)≤0.04/0.25=0.16",d:"medium"}]},

"prob-5-1":{explanation:"【林德伯格-莱维中心极限定理(CLT)】\nX₁,...,Xₙ独立同分布E(Xᵢ)=μ, D(Xᵢ)=σ²\n则当n足够大时：(ΣXᵢ-nμ)/(σ√n)近似服从N(0,1)\n\n含义：大量独立随机因素的叠加近似服从正态分布\n这就是为什么正态分布如此普遍的原因！\n\n【棣莫弗-拉普拉斯定理】\nX~B(n,p)，当n大时X近似N(np,np(1-p))\n\n条件：n≥30且np≥5, n(1-p)≥5时近似效果好\n\n【CLT的应用】\n1. 用正态近似计算二项分布概率\n2. 估计大样本下的置信区间\n3. 计算随机误差的分布\n4. 解释为什么测量误差服从正态分布\n\n【使用注意事项】\n- CLT是近似结果，n越大近似越好\n- 连续性修正：离散分布用正态近似时加减0.5\n  如P(X≤k)≈P(Z≤(k+0.5-np)/√np(1-p))\n- 单个变量的分布可以是任意的，关键是\"大量叠加\"",problems:[{q:"X~B(100,0.3)，用CLT近似P(X≤35)",a:"μ=30, σ=√21≈4.58，P(X≤35)≈P(Z≤(35.5-30)/4.58)≈P(Z≤1.2)≈0.8849",d:"medium"},{q:"100次独立测量，每次误差~U(-0.5,0.5)，求总误差绝对值<5的概率",a:"μ=0, σ²=1/12，总误差~N(0,100/12)，P(|Σ|<5)=P(|Z|<5√12/10)≈P(|Z|<1.73)≈0.916",d:"hard"},{q:"某地区人均收入μ=5000元σ=1000元，随机调查100人，求平均收入在4800-5200的概率",a:"X̄~N(5000,1000²/100)=N(5000,10000)，P(4800<X̄<5200)=P(|Z|<2)≈0.9545",d:"medium"},{q:"为什么自然界中正态分布如此常见？",a:"因为CLT告诉我们：大量微小独立因素的叠加结果近似正态分布。身高=遗传+营养+运动+...，测量误差=环境+仪器+人为+...，这些叠加都近似正态",d:"easy"}]},

// 第6章 样本及抽样分布

"prob-6-0":{explanation:"【基本概念】\n总体：研究对象的全体，含未知参数θ\n样本：从总体中抽取的n个个体X₁,...,Xₙ\n简单随机样本要求：(1)独立性；(2)同分布（与总体同分布）\n\n【统计量】\n统计量是样本的不含未知参数的函数\n\n常用统计量：\n样本均值X̄=(ΣXᵢ)/n → 估计总体均值μ\n样本方差S²=Σ(Xᵢ-X̄)²/(n-1) → 估计总体方差σ²\n注意：分母是n-1而非n（贝塞尔校正）\n样本标准差S=√S²\n样本k阶矩Aₖ=ΣXᵢᵏ/n\n\n【为什么S²用n-1？】\nE(S²)=σ²（无偏）\n若用n：E(Σ(Xᵢ-X̄)²/n)≠σ²（有偏）\n偏差的原因：X̄本身是μ的估计，代替μ会减少自由度\n\n【自由度】\nn个数据点受Σ(Xᵢ-X̄)=0约束，自由度=n-1\n直观理解：已知X̄后，只有n-1个数据点是\"自由\"的\n\n【统计量的性质】\nX̄~N(μ,σ²/n)（总体正态时）\nD(X̄)=σ²/n（均值方差缩小n倍）\n这说明样本量越大，X̄越集中",problems:[{q:"为什么样本方差用n-1而非n作分母？",a:"用n时E(S²)≠σ²（有偏），用n-1时E(S²)=σ²（无偏），这是贝塞尔校正",d:"medium"},{q:"从正态总体N(μ,σ²)抽取n个样本，X̄的分布是什么？",a:"X̄~N(μ, σ²/n)，均值不变但方差缩小n倍",d:"easy"},{q:"样本X̄与总体均值μ的关系",a:"X̄是μ的点估计，E(X̄)=μ（无偏），D(X̄)=σ²/n（n越大越精确）",d:"easy"},{q:"为什么增大样本量可以提高估计精度？",a:"D(X̄)=σ²/n，n增大→D(X̄)减小→X̄更集中→估计更精确。这就是大样本的优势",d:"medium"},{q:"写出样本5阶矩的表达式",a:"A₅=ΣXᵢ⁵/n，即样本数据的5次方的平均",d:"easy"}]},

"prob-6-1":{explanation:"【三大抽样分布】\n\nχ²分布：\nχ²(n)=Σᵢ₌₁ⁿZᵢ²（Zᵢ~N(0,1)独立）\n期望=n，方差=2n\n性质：可加性χ²(m)+χ²(n)=χ²(m+n)\n\nt分布：\nt(n)=Z/√(V/n)（Z~N(0,1),V~χ²(n)独立）\n对称分布，n→∞时→N(0,1)\nn≥30时t分布与正态差异很小\n\nF分布：\nF(m,n)=(U/m)/(V/n)（U~χ²(m),V~χ²(n)独立）\n用于方差比检验\n性质：F₁₋α(m,n)=1/Fα(n,m)\n\n【三大分布的关系】\n正态→χ²→t和F\nχ²是正态变量的平方和\nt是正态/χ²的组合\nF是两个χ²之比\n\n【查表方法】\nχ²₀·₀₅(10)=18.307\nt₀·₀₂₅(10)=2.228\nF₀·₀₅(5,10)=4.24\n\n【应用场景】\nχ²分布→方差检验、拟合优度检验\nt分布→均值检验（σ未知时）\nF分布→方差比较、方差分析",problems:[{q:"χ²(10)的期望和方差是多少？",a:"E=n=10, D=2n=20",d:"easy"},{q:"t分布和正态分布的关系",a:"t(n)当n→∞时趋于标准正态N(0,1)。n≥30时t分布与正态分布差异很小，常用正态近似",d:"medium"},{q:"χ²分布的可加性含义",a:"若X~χ²(m)与Y~χ²(n)独立，则X+Y~χ²(m+n)。这使得多个χ²统计量可以合并",d:"medium"},{q:"F分布的分位数关系F₁₋α(m,n)=1/Fα(n,m)如何使用？",a:"已知F₀·₀₅(5,10)=4.24，则F₀·₉₅(10,5)=1/4.24≈0.236，无需查两个表",d:"hard"},{q:"为什么σ未知时用t检验而非Z检验？",a:"σ未知时用S代替σ，统计量T=(X̄-μ)/(S/√n)~t(n-1)而非N(0,1)。t分布比正态分布更宽（考虑了S的随机性）",d:"medium"}]},

"prob-6-2":{explanation:"【正态总体抽样分布四大定理】\n\n定理1：X̄与S²独立\n定理2：(n-1)S²/σ²~χ²(n-1)\n定理3：X̄~N(μ,σ²/n)\n定理4：(X̄-μ)/(S/√n)~t(n-1)\n\n【推导思路】\n定理4 = 定理1+定理2+定理3\nX̄~N(μ,σ²/n)→(X̄-μ)√n/σ~N(0,1)\n(n-1)S²/σ²~χ²(n-1)\n两者独立→(X̄-μ)/(S/√n)~t(n-1)\n\n【双正态总体】\nX̄₁-X̄₂~N(μ₁-μ₂,σ₁²/n₁+σ₂²/n₂)\nF=S₁²/S₂²~F(n₁-1,n₂-1)（σ₁²=σ₂²时）\n\n【这些定理的意义】\n1. 是参数估计的理论基础\n2. 是假设检验的理论基础\n3. 定理4即t统计量，σ未知时检验均值的核心\n4. 定理2使χ²可用于方差检验\n5. 定理1保证均值和方差可以分别处理\n\n【定理使用的条件】\n总体必须为正态分布！\n大样本时（n≥30）可用正态近似（CLT保证）",problems:[{q:"从N(5,4)抽取n=16的样本，X̄服从什么分布？",a:"X̄~N(5, 4/16)=N(5, 0.25)，即σ_X̄=0.5",d:"easy"},{q:"(X̄-μ)/(S/√n)服从什么分布？",a:"t(n-1)分布，这是σ未知时检验均值的核心统计量",d:"medium"},{q:"为什么X̄与S²独立很重要？",a:"独立性保证了均值检验和方差检验可以分开进行，互不影响。否则均值估计的误差会影响方差估计",d:"hard"},{q:"n=25, σ=3，求X̄的标准差",a:"σ_X̄=σ/√n=3/5=0.6",d:"easy"},{q:"双总体X̄₁-X̄₂的分布（σ₁²,σ₂²已知）",a:"X̄₁-X̄₂~N(μ₁-μ₂, σ₁²/n₁+σ₂²/n₂)",d:"medium"}]},

// 第7章 参数估计

"prob-7-0":{explanation:"【矩估计法】\n用样本矩替代总体矩\n一阶矩：E(X)=μ→用X̄估计μ\n二阶矩：E(X²)=μ²+σ²→用ΣXᵢ²/n估计\n\n步骤：\n1. 写出总体矩与参数的关系\n2. 用样本矩代替总体矩\n3. 解方程组得估计量\n\n【最大似然估计(MLE)】\n选择使似然函数L(θ)=Πf(xᵢ;θ)最大的θ\n\n步骤：\n1. 写出似然函数L(θ)\n2. 取对数lnL(θ)（简化计算）\n3. 对θ求导令其为0\n4. 解方程得θ̂\n\n【MLE性质】\n一致性：θ̂→θ(n→∞)\n渐近正态性：θ̂~N(θ,D(θ̂))\n渐近有效性：方差达到Cramer-Rao下界\n\n【矩估计vsMLE】\n矩估计简单但不一定最优\nMLE更优但计算可能复杂\n两者有时结果一致\n\n【例题解析】\nX~Exp(λ), 样本x₁,...,xₙ\n矩估计：E(X)=1/λ=X̄→λ̂=1/X̄\nMLE：L=λⁿe⁻λΣxᵢ→lnL=nlnλ-λΣxᵢ\n∂lnL/∂λ=n/λ-Σxᵢ=0→λ̂=1/X̄（两者一致）",problems:[{q:"X~Exp(λ)，样本x₁,...,xₙ，求λ的MLE",a:"L=λⁿe⁻λΣxᵢ，lnL=nlnλ-λΣxᵢ，d/dλ=0→n/λ-Σxᵢ=0→λ̂=n/Σxᵢ=1/X̄",d:"medium"},{q:"X~B(1,p)，求p的矩估计和MLE",a:"矩估计：p̂=X̄；MLE：p̂=X̄（两者一致）",d:"easy"},{q:"X~N(μ,σ²)，求μ和σ²的MLE",a:"μ̂=X̄, σ²̂=Σ(Xᵢ-X̄)²/n（MLE用n而非n-1）",d:"medium"},{q:"X~U(0,θ)，求θ的MLE",a:"L=1/θⁿ(所有xᵢ≤θ)，θ̂=max(X₁,...,Xₙ)=X₍ₙ₎。注意：MLE不是无偏的，E(X₍ₙ₎)=nθ/(n+1)",d:"hard"},{q:"X~U(a,b)，求a和b的矩估计",a:"E(X)=(a+b)/2=X̄, D(X)=(b-a)²/12=S²，解得â=X̄-√3S, b̂=X̄+√3S",d:"medium"}]},

"prob-7-1":{explanation:"【估计量评选三大标准】\n\n1. 无偏性：E(θ̂)=θ\n意义：估计量没有系统偏差\nX̄是μ的无偏估计：E(X̄)=μ\nS²是σ²的无偏估计：E(S²)=σ²（贝塞尔校正保证）\nMLE的σ²̂=Σ(Xᵢ-X̄)²/n是有偏的！\n\n2. 有效性：无偏估计中方差最小\n比较标准：D(θ̂₁)≤D(θ̂₂)→θ̂₁更有效\nX̄比中位数更有效（方差更小）\nMVUE=最小方差无偏估计\n\n3. 一致性（相合性）：θ̂→θ(n→∞)\n大数定律保证X̄是一致估计\n一致性是最基本的要求——不满足则估计量无意义\n\n【Cramer-Rao下界】\nD(θ̂)≥1/(nI(θ))（I(θ)是Fisher信息量）\n达到下界的估计量=有效估计\n\n【重要结论】\nX̄是μ的MVUE\nS²是σ²的无偏估计\nMLE通常是渐近有效的\n\n【实际选择原则】\n优先无偏性→再选有效性→一致性作为底线",problems:[{q:"X̄是μ的无偏估计吗？",a:"是的，E(X̄)=E(ΣXᵢ/n)=nμ/n=μ",d:"easy"},{q:"比较两个无偏估计的有效性需要比较什么？",a:"比较方差，方差小的更有效。D(X̄)=σ²/n比单次观测D(X₁)=σ²小",d:"medium"},{q:"证明S²是σ²的无偏估计",a:"E(S²)=E(Σ(Xᵢ-X̄)²/(n-1))=(n-1)σ²/(n-1)=σ²（利用Σ(Xᵢ-X̄)²=(n-1)S²和E(Σ(Xᵢ-X̄)²)=(n-1)σ²）",d:"hard"},{q:"为什么MLE的σ²̂不是无偏的？",a:"σ²̂=Σ(Xᵢ-X̄)²/n，E(σ²̂)=(n-1)σ²/n≠σ²，偏差为-σ²/n",d:"medium"},{q:"什么是一致估计？",a:"θ̂ₙ→θ(n→∞)，即当样本量无限增大时估计量趋于真实值。这是估计量最基本的合理性要求",d:"easy"}]},

"prob-7-2":{explanation:"【区间估计概念】\n构造置信区间(θ̂₁,θ̂₂)使P(θ̂₁<θ<θ̂₂)=1-α\n置信水平1-α反映区间包含真实参数的概率\n\n注意：不是\"参数落在区间内的概率\"\n而是\"反复抽样时，这样构造的区间有1-α的比例包含真实参数\"\n\n【σ已知时μ的置信区间】\nX̄±z_α/2·σ/√n\n常用z值：z₀·₀₂₅=1.96(α=0.05), z₀·₀₅=1.645(α=0.10)\n\n【σ未知时μ的置信区间】\nX̄±t_α/2(n-1)·S/√n\n小样本(n<30)必须用t分布\n\n【σ²的置信区间】\n[(n-1)S²/χ²_α/2(n-1), (n-1)S²/χ²₁₋α/2(n-1)]\n注意χ²分位数不对称！\n\n【区间长度与精度】\n置信区间长度L=2z_α/2·σ/√n\n增大n或降低1-α可缩短区间\n精度要求越高→需要更大样本量\n\n【样本量确定】\nn≥(z_α/2·σ/L)²（已知σ和允许误差L时）\n例：σ=5, L=2, α=0.05→n≥(1.96×5/1)²≈96",problems:[{q:"σ已知=2, n=25, X̄=10, α=0.05，求μ的置信区间",a:"10±1.96×2/5=10±0.784，即[9.216, 10.784]",d:"easy"},{q:"σ未知, S=3, n=16, X̄=50, α=0.05，求μ的置信区间",a:"50±t₀·₀₂₅(15)×3/4≈50±2.131×0.75=50±1.598=[48.4,51.6]",d:"medium"},{q:"置信水平从95%提高到99%，置信区间如何变化？",a:"区间变宽！z₀·₀₀₅=2.576>z₀·₀₂₅=1.96，更高置信水平→更大z值→更宽区间→精度降低。置信水平与精度是矛盾关系",d:"medium"},{q:"σ=10, 要求置信区间长度≤5, α=0.05, 求最小样本量n",a:"L=2×1.96×10/√n≤5→√n≥2×1.96×10/5=7.84→n≥61.5→n≥62",d:"hard"},{q:"σ²置信区间为什么不对称？",a:"因为χ²分布不对称（偏态分布），χ²_α/2(n-1)和χ²₁₋α/2(n-1)离中心的距离不同",d:"medium"}]},

"prob-7-3":{explanation:"【单侧置信区间】\n只提供一侧界限\nP(θ>θ̂_L)=1-α（下限）或P(θ<θ̂_U)=1-α（上限）\n\n【μ的单侧下限】\nθ̂_L=X̄-t_α(n-1)·S/√n\n含义：μ至少为θ̂_L的概率为1-α\n\n【μ的单侧上限】\nθ̂_U=X̄+t_α(n-1)·S/√n\n含义：μ不超过θ̂_U的概率为1-α\n\n【与双侧的区别】\n单侧只关心一个方向\n双侧关心两个方向\n单侧区间更窄（只控制一侧）\n\n【应用场景】\n1. 产品质量保证：均值不低于某值→单侧下限\n2. 安全标准：含量不超过某值→单侧上限\n3. 工程强度：承载力至少多少→单侧下限\n4. 污染控制：浓度不超过多少→单侧上限\n\n【σ²的单侧区间】\n上限：σ²<(n-1)S²/χ²₁₋α(n-1)\n下限：σ²>(n-1)S²/χ²_α(n-1)",problems:[{q:"某零件长度要求≥5mm，样本X̄=5.2, S=0.3, n=10，α=0.05，求单侧下限",a:"5.2-t₀·₀₅(9)×0.3/√10≈5.2-1.833×0.095≈5.2-0.174=5.026>5，达标",d:"medium"},{q:"食品添加剂含量要求≤3mg，样本X̄=2.5, S=0.4, n=15，α=0.05，求单侧上限",a:"2.5+t₀·₀₅(14)×0.4/√15≈2.5+1.761×0.103≈2.5+0.182=2.682<3，达标",d:"medium"},{q:"为什么单侧置信区间比双侧更窄？",a:"双侧区间同时控制上下两端，每个端用α/2；单侧只用α控制一端，另一端不限制。因此单侧在相同α下更窄（更精确）",d:"hard"}]},

// 第8章 假设检验

"prob-8-0":{explanation:"【假设检验基本思想】\n先假设H₀成立→在H₀下推导样本应有的表现→若实际观测结果与应有表现偏差过大→拒绝H₀\n\n【六步检验流程】\n1. 建立原假设H₀和备择假设H₁\n2. 选择检验统计量\n3. 给定显著性水平α\n4. 确定拒绝域（或P值）\n5. 计算统计量观测值\n6. 做出判断：落入拒绝域则拒绝H₀\n\n【两类错误】\n第一类（弃真）：P(拒H₀|H₀真)=α\n第二类（取伪）：P(受H₀|H₀假)=β\n降低α会增大β，需权衡\n检验功效=1-β（正确拒绝H₀的概率）\n\n【双侧与单侧】\n双侧：H₁:μ≠μ₀（关心偏离两个方向）\n单侧：H₁:μ>μ₀或μ<μ₀（只关心一个方向）\n\n【P值方法】\nP值=在H₀下观测到当前或更极端结果的概率\nP值<α→拒绝H₀\nP值≥α→不拒绝H₀\nP值越小→拒绝H₀的证据越强\n\n【假设检验与区间估计的关系】\nα=0.05的检验 ↔ 95%置信区间\nμ₀在置信区间外→拒绝H₀\nμ₀在置信区间内→不拒绝H₀",problems:[{q:"显著性水平α=0.05的含义",a:"如果H₀为真，拒绝H₀的概率为5%，即犯第一类错误的概率控制在5%",d:"easy"},{q:"什么时候用单侧检验？",a:"当只关心参数是否偏大或偏小一个方向时用单侧检验，如产品质量是否达标（均值是否不低于标准值）",d:"medium"},{q:"P值=0.03, α=0.05，应如何判断？",a:"P<α，拒绝H₀，证据较强。说明在H₀下出现当前结果的概率仅3%",d:"easy"},{q:"两类错误的关系",a:"α和β互相制约：减小α→增大β。同时减小两者的方法：增大样本量n",d:"medium"},{q:"检验功效1-β的含义",a:"当H₀确实不成立时，检验能正确拒绝H₀的概率。功效越高→检验越灵敏。通常要求功效≥0.8",d:"hard"}]},

"prob-8-1":{explanation:"【单总体均值检验】\n\nσ已知——Z检验：\nZ=(X̄-μ₀)/(σ/√n)~N(0,1)\n拒绝域：|Z|>z_α/2（双侧）\n\nσ未知——t检验：\nT=(X̄-μ₀)/(S/√n)~t(n-1)\n拒绝域：|T|>t_α/2(n-1)（双侧）\n\n【双总体均值比较】\nσ₁,σ₂已知——Z检验：\nZ=(X̄₁-X̄₂)/√(σ₁²/n₁+σ₂²/n₂)\n\nσ₁=σ₂未知——合并t检验：\nT=(X̄₁-X̄₂)/√[Sp²(1/n₁+1/n₂)]\nSp²=((n₁-1)S₁²+(n₂-1)S₂²)/(n₁+n₂-2)\n\nσ₁≠σ₂——近似t检验（Welch检验）\n\n【配对t检验】\n对差值dᵢ=Xᵢ-Yᵢ做单总体t检验\n条件：两组数据有配对关系（同一个人前后对比）\n\n【选择检验方法的决策】\nσ已知→Z检验\nσ未知→t检验\n两组独立→双总体t检验\n两组配对→配对t检验\n\n【例题】\nσ=2, n=25, X̄=10.2, H₀:μ=10\nZ=(10.2-10)/(2/5)=0.5<1.96\n结论：不拒绝H₀，数据支持μ=10",problems:[{q:"σ=2, n=25, X̄=10.2, H₀:μ=10，α=0.05，检验结果",a:"Z=(10.2-10)/(2/5)=0.5<1.96，不拒绝H₀",d:"easy"},{q:"σ未知, S=3, n=10, X̄=5.5, H₀:μ=5，α=0.05，检验结果",a:"T=(5.5-5)/(3/√10)=0.5/0.949≈0.527<t₀·₀₂₅(9)=2.262，不拒绝H₀",d:"medium"},{q:"什么时候用配对t检验？",a:"当数据有自然配对关系时：同一学生的前后成绩、同一病人的两种治疗方法、同一天的两地气温等",d:"medium"},{q:"X̄=48, S=6, n=20, H₀:μ=50, H₁:μ<50, α=0.05，检验结果",a:"T=(48-50)/(6/√20)=-2/1.342=-1.49<-t₀·₀₅(19)=-1.729？否，-1.49>-1.729，不拒绝H₀",d:"medium"},{q:"合并t检验中Sp²的计算",a:"Sp²=((n₁-1)S₁²+(n₂-1)S₂²)/(n₁+n₂-2)，是两组方差的加权平均（假设σ₁=σ₂）",d:"hard"}]},

"prob-8-2":{explanation:"【单总体方差检验】\nχ²=(n-1)S²/σ₀²~χ²(n-1)\n\n双侧拒绝域：χ²>χ²_α/2(n-1)或χ²<χ²₁₋α/2(n-1)\n单侧拒绝域（右侧）：χ²>χ²_α(n-1)\n\n【双总体方差比较——F检验】\nF=S₁²/S₂²~F(n₁-1,n₂-1)\n\n双侧拒绝域：F>F_α/2(n₁-1,n₂-1)或F<F₁₋α/2(n₁-1,n₂-1)\n利用F₁₋α/2(m,n)=1/F_α/2(n,m)简化计算\n\n【F检验的前提】\n两总体均为正态分布\n非正态时F检验可能不可靠\n\n【方差检验的应用】\n1. 产品一致性检验（方差是否超标）\n2. 两种工艺精度比较\n3. 方差分析前的方差齐性检验\n4. 测量仪器精度检验\n\n【检验步骤】\n1. H₀:σ²=σ₀² vs H₁:σ²≠σ₀²\n2. 计算χ²=(n-1)S²/σ₀²\n3. 查χ²分布分位数表\n4. 判断是否落入拒绝域",problems:[{q:"H₀:σ²=4, n=20, S²=6, α=0.05，检验结果",a:"χ²=19×6/4=28.5，双侧拒绝域>χ²₀·₀₂₅(19)≈33.7或<χ²₀·₉₇₅(19)≈8.9，28.5不在拒绝域，不拒绝H₀",d:"medium"},{q:"S₁²=10(n₁=15), S₂²=4(n₂=12), H₀:σ₁²=σ₂², α=0.05，检验结果",a:"F=10/4=2.5>F₀·₀₂₅(14,11)≈3.05？否，2.5<3.05，不拒绝H₀",d:"medium"},{q:"方差检验为什么用χ²和F分布？",a:"因为(n-1)S²/σ²~χ²(n-1)（第6章定理），S₁²/S₂²~F(n₁-1,n₂-1)（σ₁=σ₂时），这是抽样分布的直接应用",d:"hard"},{q:"F检验为何要求正态总体？",a:"因为F分布的推导依赖于χ²分布，而χ²分布要求总体正态。非正态总体下F统计量不服从F分布",d:"medium"}]},

"prob-8-3":{explanation:"【χ²拟合优度检验】\n检验总体分布是否符合某种理论分布\n\n统计量：χ²=Σ(fᵢ-npᵢ)²/(npᵢ)\nfᵢ=实际频数，npᵢ=理论频数\n自由度：df=k-r-1\nk=分组数，r=由样本估计的参数个数\n\n【检验步骤】\n1. 将数据分成k组\n2. 计算每组的理论频数npᵢ\n3. 计算χ²统计量\n4. 与χ²_α(df)比较\n\n【要求】\n每组npᵢ≥5，否则需合并相邻组\n\n【独立性检验】\n检验两个分类变量是否独立\n统计量同上，自由度=(行数-1)(列数-1)\n\n【列联表分析】\n建立r×c列联表\n计算每个格子的期望频数eᵢj=nᵢnj/n\nχ²=ΣΣ(fᵢj-eᵢj)²/eᵢj\n\n【应用】\n1. 检验数据是否符合正态分布\n2. 检验骰子是否均匀\n3. 检验性别与偏好是否独立\n4. 检验药物与疗效是否关联\n\n【例题】\n掷骰子60次，各面出现次数为9,10,8,12,11,10\nH₀:骰子均匀→每面概率1/6，期望频数10\nχ²=(9-10)²/10+...+(10-10)²/10=1\nχ²<χ²₀·₀₅(5)=11.07→不拒绝H₀",problems:[{q:"χ²拟合优度检验的自由度如何确定？",a:"df=k-r-1，k=分组数，r=由样本估计的参数个数。如检验正态分布(μ,σ²未知)，r=2",d:"medium"},{q:"独立性检验的自由度如何计算？",a:"df=(r-1)(c-1)，r=行数，c=列数。如3×4列联表，df=(3-1)(4-1)=6",d:"easy"},{q:"为什么要求每组的npᵢ≥5？",a:"npᵢ太小时，χ²统计量的分布与χ²分布近似效果差。合并相邻组可增大每组期望频数，提高近似精度",d:"hard"},{q:"掷骰子60次，各面次数9,10,8,12,11,10，是否均匀？",a:"χ²=Σ(fᵢ-10)²/10=1+0+4+4+1+0=10/10=1<11.07，不拒绝H₀，骰子可能均匀",d:"medium"},{q:"2×2列联表中，χ²=10.5, df=1, α=0.05，检验结果",a:"χ²₀·₀₅(1)=3.84, 10.5>3.84，拒绝H₀，两个变量不独立",d:"easy"}]},

// 第9章 方差分析及回归分析

"prob-9-0":{explanation:"【单因素方差分析概述】\n单因素方差分析（One-way ANOVA）用于检验k组数据的均值是否相等。\nH₀:μ₁=μ₂=...=μₖ（各组均值全等）\nH₁:至少有一组均值与其他不同\n\n【核心思想：平方和分解】\n总平方和S_T=ΣΣ(Xᵢj-X̄)²，反映全部数据波动\n分解：S_T=S_A+S_E\n\nS_A（组间平方和）=Σnᵢ(X̄ᵢ-X̄)²\n→ 反映各组均值之间的差异（因素A的影响）\n\nS_E（组内平方和）=ΣΣ(Xᵢj-X̄ᵢ)²\n→ 反映组内随机误差\n\n均方：MS_A=S_A/(k-1)，MS_E=S_E/(n-k)\n检验统计量：F=MS_A/MS_E~F(k-1,n-k)\n\n【F值的含义】\nF=组间变异/组内变异\nF接近1→组间差异与随机误差相当→因素无显著影响\nF远大于1→组间差异远大于随机误差→因素有显著影响\nF越大→拒绝H₀的证据越强\n拒绝域：F>Fα(k-1,n-k)\n\n【方差分析的三个前提条件】\n1. 独立性：各组样本相互独立\n2. 正态性：各组数据服从正态分布\n   （可用Shapiro-Wilk检验或Q-Q图验证）\n3. 方差齐性：各组方差相等\n   （核心假设！可用Bartlett检验或Levene检验）\n\n【方差齐性检验方法】\nBartlett检验：适用于正态数据\n  统计量χ²=（n-k)ln(Sp²)-Σ(nᵢ-1)ln(Sᵢ²))/(1+1/(3(k-1))((Σ1/(nᵢ-1))-1/(n-k)))\n  χ²>χ²α(k-1)→方差不齐\n\nLevene检验：对非正态数据更稳健\n  对|Xᵢj-X̄ᵢ|（或中位数）做ANOVA\n  适用范围更广，推荐使用\n\n方差不齐时→用Welch ANOVA（修正F检验）\n\n【方差分析表】\n来源 | 平方和 | 自由度 | 均方 | F值\n因素A | S_A | k-1 | MS_A=S_A/(k-1) | F=MS_A/MS_E\n误差 | S_E | n-k | MS_E=S_E/(n-k) |\n总和 | S_T | n-1 | |\n\n【例题：三种肥料对产量的影响】\n3组数据（每组n=5）：\nA肥:20,22,19,21,18 → X̄₁=20, S₁²=2.5\nB肥:25,23,24,26,22 → X̄₂=24, S₂²=2.5\nC肥:18,19,17,20,16 → X̄₃=18, S₃²=2.5\n\n计算：X̄=20.67\nS_A=5×(20-20.67)²+5×(24-20.67)²+5×(18-20.67)²=5×0.449+5×11.089+5×7.129=5×18.667=93.33\nS_E=4×2.5+4×2.5+4×2.5=30\nMS_A=93.33/2=46.67，MS_E=30/12=2.5\nF=46.67/2.5=18.67\nF₀·₀₁(2,12)=6.93\nF=18.67>6.93→拒绝H₀，三种肥料效果有显著差异\n\n【事后多重比较】\nANOVA拒绝H₀后，需进一步判断哪些组之间有差异\nLSD法：最小显著差异法（简单但易犯I类错误）\nTukey HSD法：控制整体错误率（推荐）\nBonferroni法：最保守，多重比较时调整α\n\n【应用场景】\n1. 比较多种药物疗效\n2. 不同教学方法对学生成绩的影响\n3. 不同工艺参数对产品质量的影响\n4. 不同地区消费者偏好比较",problems:[{q:"方差分析的基本思想",a:"将总变异分解为组间变异（因素影响）和组内变异（随机误差），比较两者大小来判断因素是否有显著影响",d:"easy"},{q:"S_T=S_A+S_E的证明思路",a:"Xᵢj-X̄=(X̄ᵢ-X̄)+(Xᵢj-X̄ᵢ)，两边平方求和，交叉项ΣΣ(X̄ᵢ-X̄)(Xᵢj-X̄ᵢ)=0（可证明），故得分解",d:"hard"},{q:"方差分析的三个前提条件是什么？",a:"1.各组样本独立 2.各组数据服从正态分布 3.各组方差齐性（方差相等）。其中方差齐性是最关键假设，可用Bartlett或Levene检验",d:"medium"},{q:"F=18.67，F₀·₀₁(2,12)=6.93，结论如何？",a:"F=18.67>6.93，拒绝H₀，认为各组均值不全相等，因素有极显著影响（p<0.01）",d:"easy"},{q:"Levene检验和Bartlett检验有什么区别？",a:"Bartlett检验适用于正态数据，对偏离正态敏感；Levene检验基于偏差的ANOVA，对非正态数据更稳健，适用范围更广，推荐优先使用",d:"medium"},{q:"4组数据每组6个样本，组间和组内自由度是多少？",a:"k=4, n=24。组间df=k-1=3，组内df=n-k=20，总df=n-1=23",d:"easy"}]},

"prob-9-1":{explanation:"【双因素方差分析概述】\n研究两个因素A（r个水平）和B（s个水平）对结果的影响\n与单因素相比，可同时考察两个因素，效率更高\n\n【两种设计类型】\n1. 无重复双因素（无交互）：每个组合(Aᵢ,Bⱼ)只做1次试验\n   → 无法分离交互效应\n   → 适用于确信无交互的情况\n2. 有重复双因素（有交互）：每个组合做r次重复试验（r≥2）\n   → 可单独估计交互效应\n   → 推荐使用，更全面\n\n【平方和分解——无重复】\nS_T=S_A+S_B+S_E\nS_A=ΣΣ(X̄ᵢ·-X̄)²→因素A的影响\nS_B=ΣΣ(X̄·j-X̄)²→因素B的影响\nS_E→随机误差（实际包含交互效应，无法分离）\n\n【平方和分解——有重复】\nS_T=S_A+S_B+S_{AB}+S_E\nS_{AB}=ΣΣ(X̄ᵢj·-X̄ᵢ·-X̄·j+X̄)²→交互效应\nS_E=ΣΣΣ(Xᵢjk-X̄ᵢj·)²→纯随机误差\n\n【交互效应详解】\n交互效应：因素A的影响随因素B的水平变化而变化\n\n无交互：A的影响在B的各水平下一致\n  → 图形上：各水平线平行\n有交互：A的影响在B的不同水平下不同\n  → 图形上：各水平线交叉（不平行）\n\n交互效应的意义：\n- 说明两个因素不是独立作用的\n- 需要联合考虑两个因素的最优组合\n- 例：温度×时间对反应产率的影响\n  （高温短时可能优于低温长时）\n\n【检验流程（有重复）】\n1. 检验交互效应：F_{AB}=MS_{AB}/MS_E~F((r-1)(s-1),rs(r-1))\n   若F_{AB}显著→存在交互效应→不能单独分析主效应\n   若F_{AB}不显著→可忽略交互，按无重复处理\n2. 检验因素A：F_A=MS_A/MS_E~F(r-1,rs(r-1))\n3. 检验因素B：F_B=MS_B/MS_E~F(s-1,rs(r-1))\n\n【检验流程（无重复）】\nF_A=MS_A/MS_E~F(r-1,(r-1)(s-1))\nF_B=MS_B/MS_E~F(s-1,(r-1)(s-1))\n注意：此时S_E包含交互效应，若实际有交互会降低检验功效\n\n【例题：温度和时间对产率的影响】\n温度3水平×时间2水平，每个组合3次重复\n因素A（温度）：X̄₁·=70, X̄₂·=78, X̄₃·=82\n因素B（时间）：X̄·₁=75, X̄·₂=79\n总均值X̄=77\n\n交互效应检验：\nF_{AB}=MS_{AB}/MS_E\n若F_{AB}<Fα→无交互，可分析主效应\n若F_{AB}>Fα→有交互，需分析简单效应\n\n【无重复vs有重复对比】\n无重复：试验次数少（rs次），省时省力\n  → 但无法分离交互效应\n  → 适用于先验知识表明无交互\n有重复：试验次数多（r×s×重复次），成本高\n  → 可全面分析主效应和交互效应\n  → 统计上更可靠\n\n【应用场景】\n1. 农业：品种×施肥量对产量影响\n2. 工业：温度×压力对产品强度影响\n3. 医学：药物×剂量对疗效影响\n4. 教育：教学方法×学生基础对成绩影响",problems:[{q:"什么时候需要做有重复的双因素方差分析？",a:"当两个因素可能存在交互效应（即一个因素的影响取决于另一个因素的水平）时，需要重复试验来分离交互效应",d:"medium"},{q:"交互效应的含义是什么？",a:"交互效应指因素A的影响随因素B的水平变化而变化。图形上表现为各水平线不平行（交叉），说明两因素非独立作用",d:"medium"},{q:"双因素无重复的S_T如何分解？",a:"S_T=S_A+S_B+S_E，其中S_E实际包含了交互效应和随机误差，无法单独分离交互项",d:"hard"},{q:"双因素有重复（3×4设计，每组合3次重复），交互效应自由度是多少？",a:"交互项df=(r-1)(s-1)=(3-1)(4-1)=2×3=6",d:"medium"},{q:"为什么交互效应显著时不能直接解释主效应？",a:"交互显著说明一个因素的影响依赖于另一个因素的水平。此时主效应的解释可能被交互掩盖，应改为分析简单效应（在固定一个因素水平下分析另一个因素的影响）",d:"hard"}]},

"prob-9-2":{explanation:"【一元线性回归模型】\nY=a+bX+ε, ε~N(0,σ²)\nY为因变量（响应变量），X为自变量（解释变量）\nε为随机误差，满足：(1)E(ε)=0 (2)D(ε)=σ²(常数)\n(3)各观测的ε相互独立\n\n【最小二乘法（OLS）】\n目标：使残差平方和Q=Σ(Yᵢ-ŷᵢ)²=Σ(Yᵢ-a-bxᵢ)²最小\n对a,b求偏导令其为0：\n∂Q/∂a=0, ∂Q/∂b=0\n\n解得回归系数：\nb̂=Σ(xᵢ-x̄)(yᵢ-ȳ)/Σ(xᵢ-x̄)²\n=Lxy/Lxx\nâ=ȳ-b̂x̄\n\n回归方程：ŷ=â+b̂x\n\n【回归线的性质】\n1. 回归线过样本中心点(x̄,ȳ)\n   代入ŷ=â+b̂x=ȳ-b̂x̄+b̂x=ȳ+b̂(x-x̄)\n   当x=x̄时ŷ=ȳ\n2. 残差和Σeᵢ=Σ(Yᵢ-ŷᵢ)=0\n3. ΣYᵢ=Σŷᵢ（观测值之和等于拟合值之和）\n4. X与Y的散点图中，回归线使各点到线的垂直距离平方和最小\n5. b̂的符号与Cov(X,Y)一致（正相关时b̂>0）\n\n【回归系数的显著性检验】\n检验H₀:b=0（X对Y无线性影响）\n\nt检验：t=b̂/SE(b̂)~t(n-2)\nSE(b̂)=√(σ̂²/Lxx)\nσ̂²=Σ(Yᵢ-ŷᵢ)²/(n-2)=S_E/(n-2)\n|t|>tα/2(n-2)→拒绝H₀→回归显著\n\nF检验：F=MS_R/MS_E~F(1,n-2)\n一元回归中t²=F（两者等价）\n\n【判定系数R²】\nR²=1-S_E/S_T=SSR/SST\n=回归平方和/总平方和\n含义：回归方程解释的Y变异比例\nR²∈[0,1]\nR²越接近1→拟合越好\nR²=0.85→回归解释了85%的Y变异\n\nR²与相关系数关系：R²=r²（一元回归中）\n\n【回归预测方法】\n1. 点预测：给定x₀，预测值ŷ₀=â+b̂x₀\n2. 区间预测：\n   均值预测（E(Y|x₀)）：ŷ₀±tα/2(n-2)·σ̂·√(1/n+(x₀-x̄)²/Lxx)\n   个体预测（Y₀）：ŷ₀±tα/2(n-2)·σ̂·√(1+1/n+(x₀-x̄)²/Lxx)\n\n注意：个体预测区间比均值预测区间更宽（多了1）\nx₀越远离x̄→预测区间越宽（外推风险大）\n\n【回归诊断】\n1. 残差分析：\n   残差eᵢ=Yᵢ-ŷᵢ应随机散布在0附近\n   若有趋势→模型可能不合适\n\n2. 残差图检查：\n   eᵢ vs xᵢ：应随机散布，无趋势\n   eᵢ vs ŷᵢ：检查线性假设、方差齐性\n   Q-Q图：检查正态性假设\n\n3. 异常值检测：\n   学生化残差rᵢ=eᵢ/σ̂√(1-hᵢᵢ)\n   |rᵢ|>2或3→可能的异常值\n   hᵢᵢ为杠杆率，hᵢᵢ>2p/n为高杠杆点\n\n4. 常见问题：\n   非线性→考虑多项式回归或变量变换\n   异方差→加权最小二乘\n   自相关→Durbin-Watson检验\n\n【例题：广告投入与销售额】\n数据：广告x（万元）与销售额y（万元）\nX̄=5, ȳ=50, Lxx=Σ(xᵢ-x̄)²=40\nLxy=Σ(xᵢ-x̄)(yᵢ-ȳ)=200\n\nb̂=200/40=5（每增加1万广告投入，销售额增5万）\nâ=50-5×5=25\n回归方程：ŷ=25+5x\n\n检验：σ̂²=S_E/(n-2), 若S_E=50, σ̂²=50/8=6.25\nSE(b̂)=√(6.25/40)=0.395\nt=5/0.395=12.66>t₀·₀₂₅(8)=2.306→回归显著\n\n【应用场景】\n1. 销售预测（广告→销售额）\n2. 质量控制（温度→产品强度）\n3. 金融分析（风险→收益）\n4. 教育评估（学习时间→成绩）",problems:[{q:"最小二乘法的核心思想是什么？",a:"选择a和b使残差平方和Σ(Yᵢ-a-bxᵢ)²最小，即让拟合直线与所有数据点最接近",d:"easy"},{q:"R²=0.85的含义",a:"回归方程解释了85%的Y变异，剩余15%由随机误差或其他因素解释",d:"medium"},{q:"回归线为什么一定过样本中心点(x̄,ȳ)？",a:"因为â=ȳ-b̂x̄，代入ŷ=â+b̂x=ȳ+b̂(x-x̄)，当x=x̄时ŷ=ȳ。这是最小二乘解的性质",d:"medium"},{q:"给定x₀=8，回归方程ŷ=25+5x，x̄=5，σ̂=2.5，n=10，Lxx=40，求均值预测区间(α=0.05)",a:"ŷ₀=25+5×8=65。SE=2.5×√(1/10+(8-5)²/40)=2.5×√(0.1+0.225)=2.5×0.570=1.425。区间=65±2.306×1.425=65±3.29=[61.71,68.29]",d:"hard"},{q:"个体预测区间为什么比均值预测区间宽？",a:"个体预测多了一个σ²的随机误差项。均值预测E(Y|x₀)的方差=σ²(1/n+(x₀-x̄)²/Lxx)，个体预测Y₀的方差=σ²(1+1/n+(x₀-x̄)²/Lxx)，多了常数1",d:"medium"},{q:"残差图发现有曲线趋势说明什么？",a:"说明线性假设不成立，存在非线性关系。应考虑变量变换（如对数、平方根）或使用多项式回归",d:"medium"}]},

"prob-9-3":{explanation:"【多元线性回归模型】\nY=β₀+β₁X₁+β₂X₂+...+βₖXₖ+ε, ε~N(0,σ²)\nY为因变量，X₁,...,Xₖ为k个自变量\nβⱼ为偏回归系数：在其他变量不变时，Xⱼ每变化1个单位对Y的平均影响\n\n【矩阵表示】\n模型：Y=Xβ+ε\n\nY = (y₁,...,yₙ)'  (n×1响应向量)\nX = [1 x₁₁ ... xₖ₁; ...; 1 x₁ₙ ... xₖₙ]  (n×(k+1)设计矩阵)\nβ = (β₀,β₁,...,βₖ)'  ((k+1)×1参数向量)\nε = (ε₁,...,εₙ)'  (n×1误差向量)\n\n最小二乘估计：β̂=(X'X)⁻¹X'Y\n前提条件：X'X可逆（X列满秩，即无完全多重共线性）\n\n预测：ŷ=X₀β̂\n残差：e=Y-Xβ̂\n\n【模型检验】\n1. 整体显著性F检验：\n   H₀:β₁=β₂=...=βₖ=0\n   F=(SSR/k)/(SSE/(n-k-1))~F(k,n-k-1)\n   F显著→回归方程整体有效\n\n2. 单个系数t检验：\n   H₀:βⱼ=0\n   t=β̂ⱼ/SE(β̂ⱼ)~t(n-k-1)\n   SE(β̂ⱼ)=σ̂√[(X'X)⁻¹ⱼⱼ]\n\n3. 调整R²：\n   调整R²=1-(1-R²)(n-1)/(n-k-1)\n   对自变量个数k做惩罚\n   增加无意义变量→调整R²可能下降\n   模型选择时比R²更可靠\n\n【多重共线性问题】\n多重共线性：自变量之间存在高度线性相关\n\n危害：\n1. 回归系数估计不稳定（方差增大）\n2. 系数符号可能与实际意义相反\n3. 单个系数可能不显著，但整体F检验显著\n4. 对样本变化敏感\n\n检测方法：\n1. 方差膨胀因子VIF：\n   VIFⱼ=1/(1-Rⱼ²)\n   Rⱼ²为Xⱼ对其余自变量回归的判定系数\n   VIF>10→严重多重共线性\n\n2. 条件数κ：\n   κ=λmax/λmin（X'X的特征值）\n   κ>30→存在多重共线性\n\n3. 相关系数矩阵：\n   |rⱼₘ|>0.8→可能存在共线性\n\n处理方法：\n1. 剔除相关变量：保留最有解释力的变量\n2. 逐步回归法（见下）\n3. 岭回归（Ridge Regression）：\n   β̂=(X'X+λI)⁻¹X'Y\n   加入惩罚项λ，牺牲无偏性换稳定性\n4. 主成分回归：用主成分代替原变量\n5. 偏最小二乘（PLS）回归\n\n【变量选择方法】\n1. 逐步回归法：\n   前向选择：从无变量开始，逐个加入显著的变量\n   后向删除：从全模型开始，逐个剔除不显著变量\n   双向逐步：结合前向和后向\n\n2. 信息准则：\n   AIC=2k-2ln(L)（越小越好）\n   BIC=kln(n)-2ln(L)（对小样本惩罚更重）\n   平衡拟合优度和模型复杂度\n\n3. 最优子集法：\n   枚举所有2^k个子集，选AIC/BIC最小者\n   仅适用于k较小的情况\n\n【因果关系提醒】\n回归分析是相关关系分析，不是因果关系证明！\n\n统计显著≠因果存在\n即使回归显著，也要注意：\n1. 混杂变量：可能存在未纳入模型的变量同时影响X和Y\n   例：冰淇淋销量与溺水人数正相关\n   但并非因果，因气温是混杂变量\n2. 反向因果：可能是Y影响X\n   例：警察数量与犯罪率正相关\n   可能是高犯罪率导致增派警力\n3. 时序性：因果需X在时间上先于Y\n4. 机制合理性：需要理论支撑统计关系\n\n建立因果关系的可靠方法：\n- 随机对照试验（RCT）\n- 工具变量法\n- 断点回归设计\n- 双重差分法\n\n【应用场景】\n1. 房价预测（面积、位置、楼层→价格）\n2. 信用评分（收入、负债、年龄→信用）\n3. 医学诊断（多项指标→疾病风险）\n4. 市场营销（广告渠道投入→销售）\n5. 经济预测（多经济指标→GDP增长）",problems:[{q:"为什么多元回归需要调整R²？",a:"增加自变量总会使R²增大（即使无关变量），调整R²=1-(1-R²)(n-1)/(n-k-1)对变量数做惩罚，防止过度拟合",d:"medium"},{q:"β̂=(X'X)⁻¹X'Y的前提条件是什么？",a:"X'X可逆，即设计矩阵X列满秩。若存在完全多重共线性（某自变量可被其他自变量线性表示），则X'X不可逆，无法计算",d:"medium"},{q:"VIF=15说明什么？如何处理？",a:"VIF=15>10，存在严重多重共线性。处理方法：剔除相关变量、岭回归、主成分回归等",d:"medium"},{q:"回归分析显著是否能证明因果关系？",a:"不能。回归只证明统计相关关系。因果关系的确认需要理论支撑、时序性、排除混杂变量，最好通过随机对照试验（RCT）验证",d:"hard"},{q:"逐步回归法中前向选择和后向删除的区别？",a:"前向选择从空模型开始逐个加入显著变量；后向删除从全模型开始逐个剔除不显著变量。双向逐步结合两者，每步可加入或剔除变量",d:"medium"},{q:"多元回归5个自变量，n=50，求误差自由度和调整R²计算中k值",a:"误差自由度=n-k-1=50-5-1=44。调整R²中k=5（自变量个数，不含常数项）",d:"easy"}]},
"prob-1-6":{explanation:"【几何概型定义】\n几何概型是古典概型向无限样本空间的推广。\n条件：(1)样本空间S是几何区域（线段、平面、立体）；(2)等可能性——每个样本点出现的概率只与其几何度量（长度、面积、体积）成正比。\n设S为有限几何区域，其度量（长度/面积/体积）为L(S)，事件A是S的几何子区域，度量L(A)，则\nP(A)=L(A)/L(S)\n\n【几何概型与古典概型对比】\n古典概型：样本空间有限（点数有限），P(A)=有利点数/总点数\n几何概型：样本空间无限（区域连续），P(A)=有利区域度量/总区域度量\n\n【常见几何概型问题】\n1. 随机取点型：在区域中随机取一点，落入某子区域的概率\n2. 约会问题：两人相约，先到者等t分钟后离开，求相遇概率\n3. 会面问题：三人相约在某时段内随机到达，求都能见面的概率\n\n【典型例题：约会问题】\n小李和小王约好8:00-9:00在某地会面，先到者等20分钟后离开。\n设两人到达时刻为X,Y~U(0,60)（分钟）。\n能会面条件：|X-Y|≤20\nP(能会面)=1²-(60-20)²/60²=1-40²/60²=1-1600/3600=1-4/9=5/9≈55.6%\n\n【典型例题：会面问题】\n甲乙丙三人相约在20分钟内会面，每人到达时刻均匀分布且独立。\n三人同时到达概率=0（连续分布概率为0）。\n任意两人先到，再等第三人的概率分析：可用三阶均匀分布分析。\n\n【难点：如何计算\"有利区域\"】\n关键技巧：设随机变量，在坐标系中表示满足条件的区域\n例：X~U(0,1), Y~U(0,1)独立，求|X-Y|<0.5的概率\n总区域：1×1正方形\n|X-Y|<0.5的区域：去掉两直角三角形\n区域面积=1-2×(0.5)²/2=1-0.25=0.75\nP=0.75\n\n【易错点】\n1. 几何概型的\"等可能性\"指按几何度量成比例\n2. 度量函数要选择正确（一维用长度、二维用面积、三维用体积）\n3. 与古典概型混淆：古典概型是离散的",problems:[{q:"几何概型的核心条件是什么？",a:"(1)样本空间是几何区域（连续）；(2)每个样本点等可能出现（按几何度量成比例）",d:"easy"},{q:"X,Y独立~U(0,1)，求XY<0.25的概率",a:"总区域面积1，XY<0.25区域积分：∫₀¹∫₀^min(1,0.25/x)dy dx。对x≤0.25时y上限1，x>0.25时y上限0.25/x。积分=0.25+0.25ln4≈0.597",d:"hard"},{q:"在线段[0,1]上随机取两点，求它们距离大于0.5的概率",a:"设x<y，区域x<y<1，0<x<1。满足y-x>0.5的区域：0<x<0.5, x+0.5<y<1。面积=½(0.5)²=0.125。由于有序无序因子：P=2×0.125=0.25",d:"medium"},{q:"约会问题：两人相约7:00-8:00到达，先到者等15分钟，求会面概率",a:"X,Y~U(0,60)。能会面条件|X-Y|≤15。等价1-(60-15)²/60²=1-45²/60²=1-0.5625=0.4375≈43.75%",d:"medium"},{q:"半径为R的圆内随机取一点，求到圆心距离小于r<R的概率",a:"P=πr²/(πR²)=(r/R)²，比值等于面积比。直观体现等可能性假设",d:"easy"}]},

"prob-1-7":{explanation:"【概率的公理化定义回顾】\n柯尔莫哥洛夫(1933)公理体系：\n公理1（非负性）：对任意事件A，P(A)≥0\n公理2（规范性）：P(S)=1\n公理3（可列可加性）：A₁,A₂,...两两互斥，则P(∪Aᵢ)=ΣP(Aᵢ)\n\n【有限可加性与可列可加性】\n有限可加：n个事件两两互斥，P(∪Aᵢ)=Σᵢ₌₁ⁿP(Aᵢ)\n可列可加：可数个事件两两互斥，P(∪Aᵢ)=Σᵢ₌₁^∞P(Aᵢ)\n\n公理3用的是可列可加（更强），由此可推出有限可加\n区别：可列可加能处理无穷多事件的并\n\n【重要性质的严格推导】\n1. P(∅)=0\n   证明：A₁=A, A₂=A₃=...=∅，则P(A∪∅∪∅...)=P(A)=P(A)+0+0...\n\n2. P(A̅)=1-P(A)\n   证明：P(A)+P(A̅)=P(A∪A̅)=P(S)=1\n\n3. 有限可加性\n   证明：设A₁,...,Aₙ互斥，取A_{n+1}=A_{n+2}=...=∅\n   应用可列可加性P(∪Aᵢ)=P(A₁)+...+P(Aₙ)+0+0...\n\n4. 加法公式 P(A∪B)=P(A)+P(B)-P(AB)\n   证明：P(A)+P(B)=P(A∪B)+P(AB)，移项得\n\n5. 单调性：若A⊂B则P(A)≤P(B)\n   证明：P(B)=P(A)+P(B-A)≥P(A)（非负性）\n\n【可列可加性的特殊例子】\n例：P(X=1/n)=2/3ⁿ，n=1,2,3,...\n则P(X=0)=Σ2/3ⁿ=1\n检查和=2/3+2/9+2/27+...=(2/3)/(1-1/3)=1 ✓\n\n【小概率原理】\n若P(A)=ε很小，则A在一次试验中几乎不发生（小概率事件）\nα=0.05, 0.01, 0.001为常用小概率阈值\n反过来说明：\n- 若一次试验中小概率事件居然发生→否定原假设H₀\n- 这是假设检验的理论基础\n\n【概率与频率的区别】\n频率：实际试验得到的比例，是具体的数\n概率：刻画事件发生可能性大小的理论值，是固定的\n大数定律保证：当n→∞时频率→概率",problems:[{q:"为什么公理3必须是可列可加性而非有限可加？",a:"可列可加性才能处理无穷多事件情形。有限可加不能推出'无穷事件'性质，且可列可加蕴含有限可加",d:"hard"},{q:"证明P(∅)=0",a:"利用可列可加性：A₁=∅, A₂=∅, ..., 全互斥。P(∪Aᵢ)=P(∅)=P(A₁)+P(A₂)+...=0+0+...=0",d:"medium"},{q:"若P(A)=0，A是否就是不可能事件？",a:"不一定。连续分布中P(X=a)=0但X=a可能发生。概率为0的事件不一定是不可能事件",d:"hard"},{q:"证明若A⊂B则P(A)≤P(B)",a:"B=A∪(B-A)，A与B-A互斥。由可列可加性P(B)=P(A)+P(B-A)≥P(A)（由非负性）",d:"medium"},{q:"小概率原理在假设检验中的作用",a:"小概率原理是假设检验的理论基础。若H₀为真时某事件A小概率发生，而实际试验中A发生了，则我们以充分大的把握否定H₀",d:"medium"}]},

"prob-1-8":{explanation:"【全概率公式再探】\n全概率公式的核心：将复杂事件A分解为简单情形下的概率组合。\n\n设B₁,B₂,...,Bₙ是样本空间S的一个划分（完备事件组），即\n(1) B₁,B₂,...,Bₙ两两互斥\n(2) B₁∪B₂∪...∪Bₙ=S\n(3) P(Bᵢ)>0\n则对任意事件A：P(A)=Σᵢ₌₁ⁿ P(Bᵢ)P(A|Bᵢ)\n\n【全概率公式的应用技巧】\n1. 找\"原因\"事件组Bᵢ：使A在不同Bᵢ下计算P(A|Bᵢ)简单\n2. 计算P(Bᵢ)：先验概率\n3. 计算P(A|Bᵢ)：条件概率\n\n经典例子：来自3个不同车间的产品，已知各车间产量比例和次品率，求随机抽到次品的概率\n设Bᵢ=产品来自第i车间，P(Bᵢ)=产量占比，P(A|Bᵢ)=第i车间次品率\n\n【贝叶斯公式再探】\nP(Bᵢ|A)=P(Bᵢ)P(A|Bᵢ) / Σⱼ P(Bⱼ)P(A|Bⱼ)\n\n应用：从\"结果\"推断\"原因\"的概率\n- 医学诊断：已知检测结果，推断实际患病概率\n- 邮件分类：已知邮件内容，推断是垃圾邮件概率\n- 雷达识别：已知雷达回波，推断是目标概率\n- 法律推断：已知证据，推断嫌疑人犯罪概率\n\n【常见错误】\n1. 把Bᵢ当作互斥但不完全覆盖S的事件组→全概率公式不适用\n2. 混淆P(A|B)和P(B|A)\n   P(A|B)是在B发生条件下A发生的概率\n   P(B|A)是在A发生条件下B发生的概率\n   两者可能完全不同！\n3. 忽略P(Bᵢ)>0条件：当某个P(Bᵢ)=0时该项无需考虑\n\n【例题：商品检验】\n甲、乙、丙三厂生产同种产品，分别占60%、30%、10%。\n甲厂次品率2%，乙厂3%，丙厂5%。\n随机取一件发现是次品，求是该厂产品的概率。\nP(甲|次品)=0.6×0.02/(0.6×0.02+0.3×0.03+0.1×0.05)=0.012/0.026≈0.462\nP(乙|次品)=0.3×0.03/0.026=0.009/0.026≈0.346\nP(丙|次品)=0.1×0.05/0.026=0.005/0.026≈0.192\n\n【例题：医学检测】\n某病发病率1%。检测阳性率95%（患病时），假阳性率2%（未患病时）。\n检测阳性时实际患病的概率？\n设A=患病, B=检测阳性\nP(A)=0.01, P(B|A)=0.95, P(B|A̅)=0.02\nP(A|B)=0.01×0.95/(0.01×0.95+0.99×0.02)=0.0095/0.0293≈0.324\n注意：即使检测阳性，患病概率也只有32.4%（这反映了贝叶斯公式的反直觉性）",problems:[{q:"全概率公式中完备事件组的条件",a:"(1)B₁,...,Bₙ两两互斥；(2)B₁∪...∪Bₙ=S；(3)P(Bᵢ)>0（实际应用中允许=0项舍去）",d:"medium"},{q:"P(A|B)与P(B|A)有何区别？举例说明",a:"P(A|B)是B发生时A的概率；P(B|A)是A发生时B的概率。例：P(患病|检测阳)≠P(检测阳|患病)。前者反映检测准确度，后者反映患病检测为阳的概率",d:"medium"},{q:"三厂次品问题再用贝叶斯：发现为次品，求来自乙厂的概率",a:"P(乙|次品)=0.3×0.03/0.026=0.009/0.026≈0.346",d:"easy"},{q:"100个产品中合格95个，从中抽2个都是合格的概率",a:"不放回：P=C(95,2)/C(100,2)=95×94/(100×99)=8930/9900≈0.902",d:"medium"},{q:"贝叶斯公式在机器学习中的应用",a:"朴素贝叶斯分类器用先验P(类别)和类条件概率P(特征|类别)估计后验P(类别|特征)，实现文本分类、垃圾邮件识别等任务",d:"hard"}]},

"prob-1-9":{explanation:"【伯努利概型与伯努利试验】\n伯努利试验：只有两种结果的试验，结果A和A̅，P(A)=p, P(A̅)=q=1-p\nn次独立重复伯努利试验 = n重伯努利概型\n\n【二项分布】\nX~B(n,p)：n次试验中A发生次数\nP(X=k)=C(n,k)pᵏqⁿ⁻ᵏ\n\n【二项分布的概率计算】\n1. 单点概率P(X=k)=C(n,k)pᵏ(1-p)ⁿ⁻ᵏ\n2. 累积概率P(X≤k)=Σᵢ₌₀ᵏC(n,i)pⁱ(1-p)ⁿ⁻ⁱ\n3. 区间概率P(a<X<b)=Σᵢ₌ₐ₊₁ᵇ⁻¹C(n,i)pⁱ(1-p)ⁿ⁻ⁱ\n\n【二项分布的性质】\nE(X)=np, D(X)=np(1-p)\n泊松近似（np小时）：P(X=k)≈(np)ᵏe⁻ⁿᵖ/k!\n正态近似（np,nq≥5）：X近似~N(np,npq)\n\n【多项分布】\n试验有k种结果，概率分别为p₁,...,pₖ（Σpᵢ=1），n次独立试验\n(X₁,...,Xₖ)~多项分布\nP(X₁=n₁,...,Xₖ=nₖ)=n!/(n₁!...nₖ!) · p₁ⁿ¹...pₖⁿᵏ\n其中Σnᵢ=n\nE(Xᵢ)=npᵢ, D(Xᵢ)=npᵢ(1-pᵢ)\nCov(Xᵢ,Xⱼ)=-npᵢpⱼ (i≠j)\n\n【分赌注问题】\n甲乙两人各赌若干局，谁先赢满n局就获胜。\n当双方各赢若干局时停止，未完成全部赌局，如何公平分配赌注？\n这就是著名的\"分赌注问题\"（Points Problem）\n\n【分赌注的解法】\n帕斯卡和费马1654年的通信提出解法：\n设甲还需a局获胜，乙还需b局获胜\n剩余最多a+b-1局决出胜负\n甲最终获胜概率P=Σ_{i=a}^{a+b-1}C(a+b-1,i)pⁱ(1-p)ᵇ⁻¹⁻ⁱ（若每局独立）\n赌注按P:1-P分配\n\n【应用场景】\n1. 产品质量检查：n件产品中次品数分布\n2. 抽样检验：从n个产品中抽m个，含次品数分布\n3. 射击命中次数：n次射击命中数\n4. 信号传输：n位二进制码中错误位数\n5. 生物医学：n个病例中治愈数\n\n【易错点】\n1. 伯努利试验要求各次独立\n2. 每次试验结果只有两种（成功/失败）\n3. 每次成功概率p相同（不放回抽样时p变化，超几何分布描述）\n4. 不要混淆\"试验次数\"n和\"关注的结果\"k",problems:[{q:"伯努利试验与伯努利概型的区别",a:"伯努利试验：单次试验只有两种结果，概率p固定；伯努利概型：n次独立重复伯努利试验，X=B(n,p)",d:"easy"},{q:"X~B(10,0.3)，求P(X=3)",a:"P(X=3)=C(10,3)·0.3³·0.7⁷=120×0.027×0.0824≈0.267",d:"easy"},{q:"X~B(100,0.05)，求P(X≤3)（泊松近似）",a:"λ=np=5，P(X≤3)≈P(Y≤3), Y~π(5)=Σᵢ₌₀³5ⁱe⁻⁵/i!≈0.265",d:"medium"},{q:"分赌注问题：甲需2局胜，乙需3局胜，每局独立甲胜率0.6，求甲最终胜概率",a:"剩余4局决胜。P(甲胜)=ΣC(4,i)0.6ⁱ0.4⁴⁻ⁱ(i=2,3,4)=0.6²·0.4²·6+0.6³·0.4·4+0.6⁴·1=0.2304+0.3456+0.1296=0.7056",d:"hard"},{q:"100件产品，次品率5%，抽10件不放回，求其中次品数X的分布",a:"X~H(100,5,10)（超几何分布）——非独立试验，每次抽取影响后次抽中概率",d:"medium"},{q:"5位学生参加考试，及格率0.8，求至少4人及格的概率",a:"P(X≥4)=C(5,4)0.8⁴×0.2+C(5,5)0.8⁵=0.4096+0.3277≈0.737",d:"easy"}]},

"prob-2-5":{explanation:"【几何分布】\n定义：进行独立重复试验，直到第一次成功为止。设每次成功概率p，则试验次数X~几何分布G(p)：\nP(X=k)=(1-p)^{k-1}·p, k=1,2,3,...\n\n性质：\nE(X)=1/p（平均需要1/p次试验获得首次成功）\nD(X)=(1-p)/p²\n\n【几何分布的无记忆性】\nP(X>m+n|X>m)=P(X>n)\n含义：即使已经失败了m次，下次成功的概率仍然是p\n这种\"无记忆性\"使几何分布在排队论、可靠性分析中很有用\n\n例：灯泡寿命X~G(p)。第一万小时没坏，再使用一万小时坏的概率仍是p\n\n【超几何分布】\n定义：N件产品中有M件次品，不放回抽n件，次品数X~H(N,M,n)：\nP(X=k)=C(M,k)C(N-M,n-k)/C(N,n), k=0,1,...,min(M,n)\n\nE(X)=n·M/N = n·p（p=M/N为总体次品率）\nD(X)=n·(M/N)·(1-M/N)·(N-n)/(N-1)\n与二项分布D(X)=np(1-p)对比：超几何多了(N-n)/(N-1)的\"有限总体修正系数\"\n\n当N大且n<<N时，超几何分布≈二项分布B(n,p)\n\n【负二项分布】\n定义：进行独立重复试验，直到第r次成功为止。设每次成功概率p，则总试验次数X~负二项分布NB(r,p)：\nP(X=k)=C(k-1,r-1)·pʳ·(1-p)^{k-r}, k=r,r+1,...\n\nE(X)=r/p, D(X)=r(1-p)/p²\n\n当r=1时退化为几何分布G(p)\n\n【重要分布的性质对比】\n| 分布 | 适用情景 | E(X) | D(X) |\n|------|----------|------|------|\n| 二项B(n,p) | n次独立试验，每次成功p | np | np(1-p) |\n| 几何G(p) | 首次成功试验数 | 1/p | (1-p)/p² |\n| 负二项NB(r,p) | 第r次成功试验数 | r/p | r(1-p)/p² |\n| 超几何H(N,M,n) | 不放回抽样 | nM/N | n(M/N)(1-M/N)(N-n)/(N-1) |\n| 泊松π(λ) | 稀有事件计数 | λ | λ |\n\n【应用场景】\n- 几何分布：设备首次故障时间、首次成功需要的尝试次数\n- 超几何分布：质量检验抽样、不放回抽样\n- 负二项分布：保险索赔次数、α粒子发射计数",problems:[{q:"几何分布为何具有无记忆性？",a:"P(X>m+n|X>m)=P(X>m+n)/P(X>m)=(1-p)^{m+n}/(1-p)ᵐ=(1-p)ⁿ=P(X>n)。与指数分布类似，由'剩余寿命独立于已用寿命'造成",d:"hard"},{q:"100件产品含10件次品，不放回抽3件，求3件全为合格品的概率",a:"P=C(90,3)/C(100,3)≈0.7255",d:"medium"},{q:"某射击手命中率0.8，求首次命中所需射击次数的期望",a:"E(X)=1/p=1/0.8=1.25次",d:"easy"},{q:"X~NB(3,0.4)，求P(X=5)",a:"P=C(4,2)·0.4³·0.6²=6×0.064×0.36≈0.138",d:"medium"},{q:"100人中有30个吸烟者，随机抽10人，求吸烟人数X≥2的概率",a:"X~H(100,30,10)。P(X≥2)=1-P(X=0)-P(X=1)≈0.791",d:"hard"},{q:"为什么排队论中服务时间常用几何分布？",a:"因为几何分布的无记忆性：剩余服务时间与已服务时间无关。这与排队系统'新顾客到达时间无关历史'的设定一致",d:"medium"}]},

"prob-2-6":{explanation:"【正态分布的完整形态】\nX~N(μ,σ²)：f(x)=1/(√(2π)σ)·e^{-(x-μ)²/(2σ²)}\n\n参数意义：\nμ：均值/位置参数（左右对称中心）\nσ²：方差/尺度参数（决定分布\"胖瘦\"）\nσ：标准差（与X同量纲）\n\n【标准正态分布】\nZ~N(0,1)：φ(z)=1/√(2π)·e^{-z²/2}, Φ(z)=∫_{-∞}^z φ(t)dt\n\n性质：\nΦ(0)=0.5, Φ(-z)=1-Φ(z)\nφ(z)最大值=1/√(2π)≈0.399 在z=0处\n\n【标准化的重要技巧】\n若X~N(μ,σ²)，则Z=(X-μ)/σ~N(0,1)\n故P(a<X<b)=Φ((b-μ)/σ)-Φ((a-μ)/σ)\n\n【3σ原则】\nP(|X-μ|<σ)=2Φ(1)-1≈0.6826\nP(|X-μ|<2σ)=2Φ(2)-1≈0.9544\nP(|X-μ|<3σ)=2Φ(3)-1≈0.9974\n→ 数据落在(μ-3σ, μ+3σ)外的概率小于0.3%\n→ 工程上视为\"几乎不可能\"，用于异常值检测\n\n【正态分布的分位数】\nu_α使P(X>u_α)=α，即u_α为上α分位数\n常用值：\nu_0.025=1.96（双侧0.05检验）\nu_0.05=1.645（单侧0.05检验）\nu_0.01=2.326\n\nu_{1-α/2} = u_α（正态分布对称）\n\n【正态分布的线性组合】\n若X~N(μ,σ²)，则aX+b~N(aμ+b, a²σ²)\n若X₁~N(μ₁,σ₁²)和X₂~N(μ₂,σ₂²)独立，则X₁+X₂~N(μ₁+μ₂, σ₁²+σ₂²)\n一般地：ΣcᵢXᵢ~N(Σcᵢμᵢ, Σcᵢ²σᵢ²)（独立正态）\n\n【正态分布与二项分布、泊松分布的关系】\n- 二项B(n,p)当n大且p适中(n≥30,np≥5,n(1-p)≥5)→N(np,np(1-p))\n- 泊松π(λ)当λ≥10→N(λ,λ)\n- 这是中心极限定理的应用\n\n【正态分布的偏度与峰度】\n偏度=0（对称）\n峰度=0（与正态同峰度，n>3时）",problems:[{q:"X~N(10,4)，求P(X>12)",a:"P(X>12)=P(Z>1)=1-Φ(1)=1-0.8413=0.1587",d:"easy"},{q:"某厂产品长度X~N(50,0.5²)（mm），规格为49.5±1.5mm，求不合格率",a:"规格通常写作μ±kσ，由3σ原则反推。题目参数异常需校正",d:"medium"},{q:"若X~N(μ,σ²)，求P(|X-μ|<kσ)",a:"P(|X-μ|<kσ)=P(|Z|<k)=2Φ(k)-1。k=1,2,3分别≈0.683,0.954,0.997",d:"easy"},{q:"X~N(100,10²)，求上0.025分位数",a:"上0.025分位数u_0.025=100+1.96×10=119.6",d:"medium"},{q:"X~N(μ,4), P(X>4)=0.2, 求μ",a:"(4-μ)/2=u_0.2=0.8416, μ=4-1.6832=2.317",d:"hard"},{q:"X₁~N(1,2), X₂~N(2,3)独立，求X₁-X₂+3的分布",a:"X₁-X₂~N(1-2,2+3)=N(-1,5), 加3得N(2,5)",d:"medium"}]},

"prob-2-7":{explanation:"【随机变量函数分布小结】\n离散型：先求Y=g(X)的可能取值yᵢ=Σᵢg(x)，再用全概率公式P(Y=y)=Σᵢ{xᵢ|g(xᵢ)=y}P(X=xᵢ)\n\n连续型：方法一（F⁻¹法）=CDF法；方法二（公式法）=换元积分法\n\n【离散型函数分布详细解法】\n例：X分布律P(X=-1)=0.2, P(X=0)=0.4, P(X=1)=0.4\nY=X²的分布：Y=0时P(X=0)=0.4；Y=1时P(X=±1)=0.2+0.4=0.6\n注意：多个xᵢ对应同一yᵢ时概率要合并！\n\n【连续型F⁻¹法（分布函数法）】\n步骤：\n1. 求Y=g(X)的值域\n2. F_Y(y)=P(g(X)≤y)=P(X∈g⁻¹(-∞,y])\n3. 用X的分布函数Fx表达\n4. 求导f_Y(y)=F'_Y(y)\n\n例：X~Exp(λ), Y=1-e^{-λX}（Y~U(0,1)）\nF_Y(y)=P(1-e^{-λX}≤y)=P(e^{-λX}≥1-y)=P(X≤-ln(1-y)/λ)\n     =1-e^{λ·ln(1-y)/λ}=1-(1-y)=y, 0<y<1\n所以Y~U(0,1) ✓\n\n【连续型公式法（单调函数）】\n若g(x)单调可微，反函数x=h(y)\n则f_Y(y)=f_X(h(y))·|h'(y)|，y在Y的值域内\n\n例：X~N(0,1), Y=X²\ny>0时：x=±√y，单调性反转\nf_Y(y)=f_X(√y)·(1/(2√y))+f_X(-√y)·(1/(2√y))\n      =2·(1/√(2π))·e^{-y/2}·(1/(2√y))\n      =1/√(2πy)·e^{-y/2}, y>0\n\n这就是自由度为1的χ²分布！\n\n【非单调函数的处理】\n若g(x)在X的不同范围内不是一一对应\n→ 把定义域分为若干段单独计算，再求和\n例：Y=X²在(-∞,0)和(0,∞)上分别单调，须分别积分再相加\n\n【多个随机变量的函数】\n（详见第3章多维函数分布）\n\n【易错点】\n1. 离散型函数分布要合并相同yᵢ对应xᵢ的概率\n2. 公式法只适合单调函数，且反函数可微\n3. F⁻¹法适用范围更广，但计算F_Y可能复杂\n4. 注意Y的值域上下界",problems:[{q:"X分布律0.2,0.3,0.5对应x=-1,0,1，求Y=X²+1的分布律",a:"Y=1时X=0，P=0.3；Y=2时X=±1，P=0.2+0.5=0.7",d:"easy"},{q:"X~U(0,1), Y=-ln(1-X)，求Y的分布",a:"Fx(x)=x (0<x<1)。Y的CDF：F_Y(y)=P(-ln(1-X)≤y)=P(1-X≥e^{-y})=P(X≤1-e^{-y})=1-e^{-y}, y>0。故Y~Exp(1)",d:"medium"},{q:"X~N(0,1), Y=e^X，求Y的密度",a:"Y>0时：F_Y(y)=P(e^X≤y)=P(X≤lny)=Φ(lny)。求导f_Y(y)=φ(lny)/y=1/(y√(2π))·e^{-(lny)²/2}。这是对数正态分布",d:"hard"},{q:"X~U(-π/2, π/2), Y=tanX，求Y的分布",a:"Y在(-∞,∞)。F_Y(y)=P(tanX≤y)=P(X≤arctany)=(arctany+π/2)/π。求导f_Y(y)=1/(π(1+y²))——柯西分布！",d:"hard"},{q:"公式法和F⁻¹法各自适用条件",a:"公式法：要求g单调可微且反函数存在；F⁻¹法：通用但CDF计算可能困难。一般先用公式法快速尝试，不行再用F⁻¹法",d:"medium"},{q:"X~Exp(1), Y=[X]，求Y的分布",a:"Y取非负整数k，P(Y=k)=P(k≤X<k+1)=e^{-k}-e^{-(k+1)}=e^{-k}(1-e^{-1})。这是几何分布",d:"medium"}]},

"prob-3-5":{explanation:"【二维随机变量函数分布概述】\n求Z=g(X,Y)的分布关键是处理X,Y的联合分布到单变量分布的转换\n\n【Z=X+Y的卷积公式】\n设X,Y独立，密度f_X, f_Y\n则Z=X+Y的密度：f_Z(z)=∫_{-∞}^∞ f_X(x)f_Y(z-x)dx （卷积）\n简写：f_Z=f_X*f_Y（卷积运算）\n\n【Z=max(X,Y), Z=min(X,Y)的分布】\nF_max(z)=P(X≤z,Y≤z)=F_X(z)·F_Y(z)（独立）\nf_max(z)=f_X(z)F_Y(z)+F_X(z)f_Y(z)\n\nF_min(z)=1-P(X>z,Y>z)=1-(1-F_X(z))(1-F_Y(z))\nf_min(z)=f_X(z)(1-F_Y(z))+(1-F_X(z))f_Y(z)\n\n【Z=X/Y的分布】\n设X,Y独立，密度f_X, f_Y\n则Z=X/Y的密度：f_Z(z)=∫_{-∞}^∞ |y|·f_X(zy)f_Y(y)dy\n特例：若X,Y独立同~N(0,1)，则Z~柯西分布（标准柯西）\n\n【Z=XY的分布】\n设X,Y独立\n则Z=XY的密度：f_Z(z)=∫_{-∞}^∞ f_X(x)f_Y(z/x)|1/x|dx\n\n【条件分布的应用】\n已知X=x条件下，Y的条件分布F(y|x)=P(Y≤y|X=x)\n若Y对X的回归已知，则可用条件期望E(Y|X=x)分析\n\n【几个分布的卷积结果总结】\n二项+二项：B(m,p)+B(n,p)=B(m+n,p)\n泊松+泊松：π(λ₁)+π(λ₂)=π(λ₁+λ₂)\n正态+正态：N(μ₁,σ₁²)+N(μ₂,σ₂²)=N(μ₁+μ₂,σ₁²+σ₂²)（独立）\nχ²(m)+χ²(n)=χ²(m+n)\n\n【应用场景】\n1. 信号处理：信号+噪声的和分布\n2. 可靠性：部件串联寿命总和\n3. 排队论：等待时间+服务时间\n4. 测量误差：仪器误差+人为误差",problems:[{q:"X~U(0,1), Y~U(0,1)独立，求Z=X+Y密度",a:"卷积：f_Z(z)=∫max(0,z-1)^min(z,1) 1dx=z(0<z≤1), 2-z(1<z≤2)；其他为0（梯形/三角形分布）",d:"medium"},{q:"X~Exp(λ₁), Y~Exp(λ₂)独立，求Z=X+Y密度",a:"f_Z(z)=λ₁λ₂(e^{-λ₁z}-e^{-λ₂z})/(λ₂-λ₁), z>0",d:"hard"},{q:"X,Y独立~U(0,2)，求Z=max(X,Y)密度",a:"F_Z(z)=P(X≤z,Y≤z)=(z/2)²=z²/4, 0<z<2。f_Z(z)=z/2, 0<z<2",d:"medium"},{q:"X,Y独立同~Exp(λ)，求min(X,Y)的分布",a:"P(min>z)=P(X>z,Y>z)=e^{-2λz}, 故min(X,Y)~Exp(2λ)",d:"medium"},{q:"什么叫卷积公式？几何意义？",a:"f_Z(z)=f_X*f_Y(z)=∫f_X(x)f_Y(z-x)dx。两个独立随机变量和的密度是各自密度的卷积",d:"hard"}]},

"prob-3-6":{explanation:"【二维正态分布定义】\n(X,Y)~N(μ₁,μ₂,σ₁²,σ₂²,ρ)\n联合密度：\nf(x,y)=1/(2πσ₁σ₂√(1-ρ²))·exp{-1/(2(1-ρ²))·[(x-μ₁)²/σ₁²-2ρ(x-μ₁)(y-μ₂)/(σ₁σ₂)+(y-μ₂)²/σ₂²]}\n\n五个参数：μ₁,μ₂（位置）, σ₁²,σ₂²（尺度）, ρ（相关性）\n\n【二维正态的边缘分布仍为正态】\nX~N(μ₁,σ₁²), Y~N(μ₂,σ₂²)\n注意：这意味着从联合正态求边缘是正态；反过来不一定\n即两个边缘正态不一定是二维正态！\n\n【二维正态中不相关与独立等价】\nX,Y满足二维正态：\nX,Y独立 ⟺ X,Y不相关（ρ=0）\n\n这是二维正态特有的性质，对一般分布成立的是：\n独立 → 不相关，反之不一定\n\n特殊例子（反例）：X~N(0,1), Y=X²，二维不构成正态分布，X,Y不相关但Y完全依赖于X\n\n【二维正态的线性变换仍为正态】\n若(X,Y)~二维正态，则对任意a,b,c,d：\n(aX+bY, cX+dY)仍是二维正态\n\n推广：任何服从二维正态向量的线性组合仍是正态\n\n【二维正态的条件分布】\n已知X=x条件下Y的条件分布也是正态：\nY|X=x ~ N(μ₂+ρσ₂/σ₁·(x-μ₁), σ₂²(1-ρ²))\n\n含义：在X=x条件下Y的均值=μ₂+ρσ₂/σ₁·(x-μ₁)（线性回归）\n条件方差=σ₂²(1-ρ²)（不受X影响）\n\n这是回归分析的理论基础\n\n【二维正态与相关系数】\n二维正态参数ρ就是X,Y的相关系数\n|ρ|≤1, ρ=±1时退化到一条直线\n\n【易错点】\n1. 二维正态比两个一维正态条件更强\n2. 二维正态的不相关与独立等价（但反之一般不成立）\n3. 二维正态的条件分布和条件期望是线性函数\n4. 二维正态的所有边缘分布、条件分布都是正态",problems:[{q:"二维正态的5个参数含义",a:"μ₁,μ₂是X,Y的均值（位置参数）；σ₁²,σ₂²是X,Y的方差（尺度参数）；ρ是X,Y的相关系数（相关性）",d:"easy"},{q:"若(X,Y)~二维正态且X,Y独立，则f(x,y)是什么形式？",a:"ρ=0时f(x,y)=1/(2πσ₁σ₂)·exp{-[(x-μ₁)²/σ₁²+(y-μ₂)²/σ₂²]/2}，可分离为f_X(x)·f_Y(y)",d:"medium"},{q:"二维正态中独立与不相关的关系",a:"二维正态：独立 ↔ 不相关（ρ=0）。这是二维正态特有的性质",d:"hard"},{q:"若Y|X=x~N(2+0.5x, 4)，求μ₂和ρσ₂/σ₁",a:"μ₂=2, ρσ₂/σ₁=0.5，说明Y的条件均值是X的线性函数",d:"medium"},{q:"二维正态中X,Y相关系数为0.6，σ_X=2, σ_Y=3，求Cov(X,Y)",a:"Cov(X,Y)=ρσ_Xσ_Y=0.6×2×3=3.6",d:"easy"},{q:"举一个二维分布不是正态但边缘都是正态的例子",a:"X~N(0,1), Y=X²。对(X,Y)联合分布不是二维正态（边缘Y的密度非正态），但X边缘正态",d:"hard"}]},

"prob-4-4":{explanation:"【条件数学期望定义】\n定义：E(Y|X)是以X为变量的随机变量\n\n对离散型：E(Y|X=x)=Σy·P(Y=y|X=x)，条件期望是x的函数\n对连续型：E(Y|X=x)=∫y·f(y|x)dy\n\n【全期望公式（双重期望）】\nE(Y)=E[E(Y|X)]\n含义：先在X=x条件下求Y的条件期望，再对X求期望\n\n离散型证明：\nE[E(Y|X)]=Σx E(Y|X=x)P(X=x)=Σx[Σy yP(Y=y|X=x)]P(X=x)\n=ΣxΣy y·P(Y=y,X=x)=Σy y·Σx P(X=x,Y=y)=Σy y·P(Y=y)=E(Y)\n\n【全方差公式】\nD(Y)=D[E(Y|X)]+E[D(Y|X)]\n含义：Y的总方差 = 条件均值的方差 + 条件期望的方差\n\n直观理解：Y的变异来自两部分\n- 条件均值随X变化的部分：即E(Y|X)的方差\n- 给定X后Y仍有变异：即D(Y|X)的期望\n\n【条件期望的应用：抽样推断】\n抽样调查：先抽n个地区，每个地区抽m户\nE(总户均收入)=E[E(地区均收入)]，可分阶段估计\n\n【例题：分层抽样】\n甲地区家庭收入N(μ₁,σ²)，乙地区N(μ₂,σ²)，各抽n户\n合并样本均值的期望E(X̄)=(μ₁+μ₂)/2\n条件期望E(X̄|地区)=μᵢ, i=1,2\nE(E(X̄|地区))=(μ₁+μ₂)/2=E(X̄) ✓\n\n【回归分析中的条件期望】\n在线性回归中E(Y|X=x)=a+bx，即X=x时Y的条件均值\n这正是回归直线的含义：X=x条件下Y的\"最佳预测\"是E(Y|X=x)\n\n【条件方差】\nD(Y|X=x)=E(Y²|X=x)-[E(Y|X=x)]²\n特殊地：二维正态中\nE(Y|X=x)=μ₂+ρσ₂/σ₁·(x-μ₁)\nD(Y|X=x)=σ₂²(1-ρ²)\n\n【应用场景】\n1. 抽样调查：分层抽样推断\n2. 金融：投资组合条件收益\n3. 机器学习：决策树中特征条件期望\n4. 信号处理：条件均值滤波器",problems:[{q:"全期望公式E(Y)=E[E(Y|X)]的几何含义",a:"E(Y|X)将Y的不确定性'压缩'到X条件下的均值；再对X求期望即'解开'这个条件，得到Y的总期望",d:"medium"},{q:"X,Y独立时，E(Y|X)=?",a:"X,Y独立意味着Y的分布与X取值无关，故E(Y|X=x)=E(Y)，即条件期望退化为无条件期望",d:"easy"},{q:"二维正态中，D(Y)=D[E(Y|X)]+E[D(Y|X)]具体如何展开？",a:"D[E(Y|X)]=σ₂²ρ² (X为正态)。E[D(Y|X)]=σ₂²(1-ρ²)。和=σ₂²=D(Y) ✓",d:"hard"},{q:"甲乙两车间合格率分别为90%和80%，各生产一半产品，随机抽一件产品，求其合格率的期望",a:"设X=合格(1)/不合格(0)。E(X|甲)=0.9, E(X|乙)=0.8, P(甲)=P(乙)=0.5。E(X)=0.5·0.9+0.5·0.8=0.85",d:"easy"},{q:"保险精算中如何用全期望公式",a:"以健康险为例：E(赔付)=E[E(赔付|是否患病)]=E[赔付|病]·P(病)+E[赔付|未病]·P(未病)。分层估计",d:"medium"},{q:"全方差公式如何解释金融投资组合风险？",a:"D(Y)=总风险=D[E(Y|X)]+E[D(Y|X)]:系统性风险(条件均值方差异)+非系统性风险(条件方差异)",d:"hard"}]},

"prob-4-5":{explanation:"【特征函数定义】\nX的特征函数：φ_X(t)=E(e^{itX})=E[cos(tX)+i·sin(tX)]\n\n离散型：φ_X(t)=Σe^{itxₖ}pₖ\n连续型：φ_X(t)=∫e^{itx}f(x)dx\n\n【特征函数的性质】\n1. φ(0)=E(1)=1\n2. |φ(t)|≤1（因为|E(e^{itX})|≤E|e^{itX}|=E(1)=1）\n3. φ(-t)=共轭(φ(t))（实随机变量）\n4. φ_{aX+b}(t)=e^{itb}φ_X(at)\n5. X,Y独立→φ_{X+Y}(t)=φ_X(t)·φ_Y(t)\n\n【矩与特征函数】\n若E(Xⁿ)存在，则φ(t)的n阶导数：\nφ^{(n)}(0)=iⁿ·E(Xⁿ)\nE(Xⁿ)=φ^{(n)}(0)/iⁿ\n\n这是求矩的强有力工具\nE(X)=φ'(0)/i\nE(X²)=φ''(0)/i²\n\n【唯一性定理】\n分布函数F₁,F₂的特征函数φ₁(t)=φ₂(t) ⟺ F₁=F₂\n特征函数与分布一一对应\n\n【逆变换公式】\n已知φ(t)可反求密度：\nf(x)=1/(2π)∫_{-∞}^∞ φ(t)e^{-itx}dt（傅里叶逆变换）\n这是求密度分布的另一种方法\n\n【常见分布的特征函数】\n| 分布 | 特征函数 |\n|------|----------|\n| 退化P(X=c) | e^{itc} |\n| (0-1分布) | 1-p+pe^{it} |\n| 二项B(n,p) | (1-p+pe^{it})ⁿ |\n| 泊松π(λ) | e^{λ(e^{it}-1)} |\n| 均匀U(a,b) | (e^{itb}-e^{ita})/(it(b-a)) |\n| 指数Exp(λ) | λ/(λ-it) |\n| 标准正态N(0,1) | e^{-t²/2} |\n| 一般正态N(μ,σ²) | e^{itμ-σ²t²/2} |\n\n【特征函数与矩母函数】\n矩母函数：M_X(t)=E(e^{tX})\n特征函数：φ_X(t)=M_X(it)\n\n特征函数优点：对所有分布都存在（不像矩母函数有时不收敛）\n\n【应用场景】\n1. 证明中心极限定理：用特征函数方法\n2. 求分布的矩（特别是高阶矩）\n3. 独立和的分布：φ_{X+Y}=φ_X·φ_Y",problems:[{q:"特征函数与分布函数的一一对应",a:"唯一性定理：F₁=F₂ ⟺ φ₁(t)=φ₂(t)。这意味着知道φ(t)就唯一确定分布",d:"medium"},{q:"X~N(0,1)，求φ_X(t)和E(X²)",a:"φ(t)=e^{-t²/2}。E(X²)=φ''(0)/i²=1",d:"hard"},{q:"X,Y独立时φ_{X+Y}(t)=?",a:"φ_{X+Y}(t)=E(e^{it(X+Y)})=E(e^{itX}e^{itY})=E(e^{itX})E(e^{itY})=φ_X(t)·φ_Y(t)",d:"easy"},{q:"X~π(λ)，求φ_X(t)",a:"φ_X(t)=E(e^{itX})=Σe^{itk}·λᵏe^{-λ}/k!=e^{-λ}Σ(λe^{it})ᵏ/k!=e^{-λ}·e^{λe^{it}}=e^{λ(e^{it}-1)}",d:"medium"},{q:"X~Exp(λ)，求φ_X(t)",a:"φ(t)=∫₀^∞ e^{itx}λe^{-λx}dx=λ/(λ-it)",d:"hard"},{q:"独立中心极限定理的特征函数证明思路",a:"设Xᵢ独立同分布，标准化为Yᵢ=(Xᵢ-μ)/σ。则ΣYᵢ的特征函数φ(t)=[φ_Y(t/n)]ⁿ，n→∞时φ_Y(t/n)≈1-t²/(2n)+o(1/n)，故φ(t)→e^{-t²/2}=N(0,1)特征函数",d:"hard"}]},

"prob-5-2":{explanation:"【切比雪夫不等式详解】\n定理：设随机变量X的方差D(X)存在，则对任意ε>0：\nP(|X-μ|≥ε)≤D(X)/ε²\n\n等价形式：P(|X-μ|<ε)≥1-D(X)/ε²\n\n切比雪夫不等式的关键意义：\n1. 不需要知道X的具体分布\n2. 给出了偏差≥ε的概率上界\n3. 当ε→0时，D(X)/ε²→∞，上界失效\n4. 当ε→∞时，D(X)/ε²→0，上界变得有意义\n\n【切比雪夫不等式的变形】\nP(|X-μ|≥kσ)≤1/k²\nP(|X-μ|<kσ)≥1-1/k²\n常用：\nk=2: P(|X-μ|<2σ)≥0.75\nk=3: P(|X-μ|<3σ)≥0.889\n\n注意：仅依赖σ，与分布无关，这就是它的'普适性'\n\n【正态分布情形对比】\nX~N(μ,σ²)时实际概率：\nk=1: 0.683 vs 0（切比雪夫）\nk=2: 0.954 vs 0.75\nk=3: 0.997 vs 0.889\n\n切比雪夫估计较粗，但保证适用于所有分布\n\n【利用切比雪夫估计概率】\n例：已知X的期望10，方差4，求P(|X-10|≥5)\nP≤4/25=0.16\n\n例：随机抛硬币1000次，至少需要多少次正面（保证比例偏差很小）\nP(|f_n-0.5|≥ε)≤0.25/(4nε²)\n当ε=0.05, n=1000: P≤0.25/(4×1000×0.0025)=0.025=2.5%\n\n【切比雪夫大数定律再探】\nX₁,X₂,...独立，E(Xᵢ)=μᵢ, D(Xᵢ)≤C（一致有界方差）\n则(X₁+...+Xₙ)/n-(μ₁+...+μₙ)/n→0（依概率）\n\n【辛钦大数定律再探】\nX₁,X₂,...独立同分布，E(Xᵢ)=μ存在（无需方差存在）\n则X̄ₙ→μ（依概率）\n\n辛钦比切比雪夫条件弱：无需方差有界\n\n【伯努利大数定律】\nμₙ/n→p（频率→概率）\n特例：n次试验A发生次kₙ，频率kₙ/n→P(A)\n\n【依概率收敛】\nXₙ→X（P）意义：\n对任意ε>0, lim_{n→∞}P(|Xₙ-X|>ε)=0\n注意：是依概率收敛（不一定必然收敛）\n\n【大数定律的统一形式】\n设X₁,X₂,...独立\n若ΣVar(Xᵢ)/i²<∞则Σ(Xᵢ-E(Xᵢ))/i依概率收敛\n具体形式：辛钦/伯努利/切比雪夫是不同的特例\n\n【应用】\n1. 频率稳定性的数学证明\n2. 蒙特卡洛方法的理论基础\n3. 统计推断：样本均值估计总体均值的合理性\n4. 保险：大数法则支撑保险定价",problems:[{q:"切比雪夫不等式中ε的取值与估计精度的关系",a:"ε越小→D/ε²越大→上界越粗；ε越大→上界越小→估计越精确",d:"medium"},{q:"若X的期望μ方差σ²，求P(μ-2σ<X<μ+2σ)下界",a:"P(|X-μ|<2σ)≥1-σ²/(4σ²)=3/4=0.75（切比雪夫）；实际正态为0.954",d:"easy"},{q:"辛钦大数定律与切比雪夫大数定律的对比",a:"辛钦：需独立同分布+期望存在；切比雪夫：仅需独立+方差有界。辛钦条件更弱但适用范围也更窄",d:"medium"},{q:"100次独立测量，每次误差E(εᵢ)=0, D(εᵢ)=1，求P(|X̄|<0.2)",a:"X̄的方差=σ²/n=1/100=0.01。P(|X̄|<0.2)≥1-0.01/0.04=0.75",d:"medium"},{q:"为什么伯努利大数定律称为'频率稳定性'的数学表达？",a:"它证明当n→∞时，事件A的频率fₙ(A)趋于概率P(A)",d:"medium"},{q:"500台机床工作，每台故障率0.01，假设独立。求至少8台故障的概率上界（用切比雪夫）",a:"X~B(500,0.01)近似。E(X)=5, D(X)=4.95。P(X≥8)≤P(|X-5|≥3)≤4.95/9=0.55",d:"hard"}]},

"prob-5-3":{explanation:"【拉普拉斯定理（棣莫弗-拉普拉斯定理）】\n设X~B(n,p)，当n充分大时：(X-np)/√(np(1-p))近似~N(0,1)\n\n精确陈述：设0<p<1为常数，n→∞时\nP((X-np)/√npq≤x)→Φ(x)\n\n这是中心极限定理的特例（X为n个独立Bernoulli之和）\n\n【使用条件】\nnp≥5且n(1-p)≥5（确保近似效果良好）\nn越大近似越好\n\n【连续性修正】\n离散型B(n,p)近似N(np,npq)时需进行±0.5的修正：\nP(X≤k)≈Φ((k+0.5-np)/√npq)\nP(X≥k)≈1-Φ((k-0.5-np)/√npq)\nP(a≤X≤b)≈Φ((b+0.5-np)/√npq)-Φ((a-0.5-np)/√npq)\n\n修正后精度显著提高\n\n【例题：选举预测】\n某候选人民意支持率p=0.55，n=1000人随机调查。\n求支持该候选人的被调查者人数在500-600之间的概率。\nμ=np=550, σ=√(1000×0.55×0.45)≈15.7\nP(500≤X≤600)≈Φ((600.5-550)/15.7)-Φ((499.5-550)/15.7)=Φ(3.21)-Φ(-3.22)≈0.999\n\n【例题：产品验收】\n某产品次品率p=0.05，n=100件抽样，求次品数≤5的概率。\nμ=5, σ²=4.75, σ≈2.18\n连续性修正：P(X≤5)≈Φ((5.5-5)/2.18)=Φ(0.23)≈0.591\n\n【与泊松近似的对比】\n当p小（p≤0.1）且n不太大时，泊松近似更好：\nB(n,p)≈π(np)即λ=np\n当n大、p适中时，正态近似B(n,p)≈N(np,np(1-p))更好\n\n【直方图与正态曲线】\n二项分布直方图随n增大越来越接近正态曲线\n- n=10：已有正态雏形\n- n=30：相当接近\n- n=100：高度吻合\n\n【与随机游走的关系】\n将抛硬币的±1随机游走视为n次独立Bernoulli\n中心极限给出了随机游走长时间行为的正态近似\n\n【应用】\n1. 选举预测：候选人得票数估计\n2. 质量检验：大批量抽样\n3. 保险精算：理赔次数预测\n4. 医学统计：大样本药物试验",problems:[{q:"拉普拉斯定理的使用条件",a:"n较大（通常n≥30），np≥5, n(1-p)≥5。p不可太接近0或1",d:"easy"},{q:"X~B(100,0.1)，求P(X≤8)（用正态近似+连续性修正）",a:"μ=10, σ²=9, σ=3。P(X≤8)≈Φ((8.5-10)/3)=Φ(-0.5)=0.3085",d:"medium"},{q:"X~B(50,0.5)，求P(X=25)（精确vs近似）",a:"精确P(X=25)≈0.1123。近似P=Φ((25.5-25)/√12.5)-Φ((24.5-25)/√12.5)≈0.1122",d:"hard"},{q:"为什么需要连续性修正？",a:"离散分布是整数值，正态是连续值。修正±0.5相当于在离散值附近\"嫁接\"正态曲线的对应概率",d:"medium"},{q:"某班40人中至少20人通过的概率，通过率p=0.6",a:"X~B(40,0.6)，μ=24, σ²=9.6。P(X≥20)=1-Φ((19.5-24)/√9.6)=1-Φ(-1.46)=0.928",d:"medium"},{q:"np≥5与n(1-p)≥5为什么需要？",a:"确保np和n(1-p)都足够大，使得(n-np)和np都近似正态",d:"hard"}]},

"prob-5-4":{explanation:"【大数定律与中心极限定理的联系】\n大数定律：X̄ₙ→μ（依概率）——回答\"样本均值稳定性\"\n中心极限定理：X̄ₙ→N(μ,σ²/n)——回答\"样本均值分布形态\"\n\n两个定理的关系：\n- 大数定律是定性：说明极限存在\n- 中心极限定理是定量：给出极限分布\n中心极限定理是大数定律的精细化\n\n【多个独立随机变量之和的极限分布】\n若X₁,...,Xₙ独立，分别服从Xᵢ~N(μᵢ,σᵢ²)\n则ΣXᵢ~N(Σμᵢ, Σσᵢ²)（精确正态，不是近似）\n\n若Xᵢ独立同分布E(Xᵢ)=μ, D(Xᵢ)=σ²，\n则ΣXᵢ/n ~ N(μ,σ²/n)近似\n\n【中心极限定理的实际应用】\n1. 用样本均值估计总体均值：误差≈σ/√n\n2. 大样本下置信区间构造：X̄±zσ/√n\n3. 假设检验：大样本统计量近似正态\n4. 蒙特卡洛模拟：误差控制\n\n【例题：零件重量】\n某零件重量X~U(0.5,1.5)（克），均值1，方差1/12\n一批100个零件，求总重量在95-105克的概率\n\n设Y=ΣXᵢ~近似N(100, 100/12)=N(100, 8.33)\nP(95<Y<105)=Φ((105-100)/√8.33)-Φ((95-100)/√8.33)\n         =Φ(1.73)-Φ(-1.73)≈0.916\n\n【例题：保险理赔】\n某保险公司承保10000份保单，每份理赔概率0.001，理赔额50元\n独立理赔总数X~B(10000,0.001)≈N(10, 9.99)\n求理赔总额超过600元的概率\nP(X>600)≈1-Φ((600-10)/√9.99)≈0\n\n【中心极限定理的非正态情形】\n中心极限定理的强大之处：不管Xᵢ是什么分布\n只要n足够大，ΣXᵢ/n都近似正态\n——这是为什么\"正态分布在自然界普遍\"的根本原因\n\n【几个具体类型的CLT】\n1. 林德伯格-莱维CLT：独立同分布\n2. 拉普拉斯CLT：二项分布\n3. 李雅普诺夫CLT：独立不同分布\n4. 林德伯格CLT：独立不同分布（最一般）\n\n【应用：估计n的范围】\n通常n≥30被视为\"大样本\"，可以使用CLT\n但具体问题：p接近0/1时需n≥100甚至更大\n\n【误差控制】\n要求|X̄-μ|<ε的概率≥1-α\n需n≥(z_α/2·σ/ε)²\n\n例：σ=2, ε=0.1, α=0.05 → n≥(1.96×2/0.1)²=1537",problems:[{q:"中心极限定理和大数定律的区别",a:"CLT给出ΣXᵢ/n的分布极限为正态（定量）；大数定律只说ΣXᵢ/n→μ（定性）。CLT是大数定律的精细化",d:"medium"},{q:"一批产品每件重量X~U(10,20)g，n=100件，求总重量在1400-1600g的概率",a:"μ=15, σ²=100/12≈8.33, Σ~N(1500, 833)。P(1400<Σ<1600)≈Φ((1600-1500)/√833)-Φ((1400-1500)/√833)≈0.999",d:"hard"},{q:"n次独立试验成功次数X~B(n,0.5)，证明X/n→0.5用伯努利大数定律",a:"每次试验Xᵢ∈{0,1}, E(Xᵢ)=p, Var(Xᵢ)=p(1-p)<∞。应用切比雪夫大数定律:X̄→p=0.5",d:"medium"},{q:"为什么说CLT是大数定律的精细化？",a:"大数定律只说X̄→μ（极限等于μ）；CLT进一步说X̄-N(μ,σ²/n)→0。后者不仅知道极限，还知道收敛速度",d:"hard"},{q:"独立随机变量之和的方差何时简化为各变量方差之和？",a:"独立时D(X+Y)=D(X)+D(Y)。与均值不同——无论是否独立，E(X+Y)=E(X)+E(Y)；但方差只有独立时才可加",d:"medium"},{q:"n位学生独立考试，每位得分~U(0,100)，求n=25时平均分在50-60的概率",a:"每Xᵢ~U(0,100)，E=50, σ²=10000/12≈833。X̄~近似N(50, 833/25)=N(50,33.3)。P(50<X̄<60)≈Φ(1.73)≈0.958",d:"hard"}]},

"prob-6-3":{explanation:"【经验分布函数定义】\n设X₁,X₂,...,Xₙ是来自总体F的样本，将它们按从小到大排列：\nX₍₁₎≤X₍₂₎≤...≤X₍ₙ₎\n\n定义经验分布函数Fₙ(x)：\nFₙ(x)=(1/n)·Σ_{i=1}^n I{Xᵢ≤x}\n\n含义：Fₙ(x)是样本中小于等于x的比例\n性质：\n- 0≤Fₙ(x)≤1\n- 单调非降\n- 右连续\n- Fₙ(-∞)=0, Fₙ(+∞)=1\n- 在每个X₍ᵢ₎处跳跃1/n\n\n【Fₙ(x)与总体F(x)的关系】\n对每个固定的x：\nI{Xᵢ≤x}是Bernoulli随机变量，P(I{Xᵢ≤x}=1)=F(x)\n故E[Fₙ(x)]=F(x)（无偏）\nD[Fₙ(x)]=F(x)(1-F(x))/n\n由大数定律Fₙ(x)→F(x)（依概率）\n\n【格里文科定理】\n当n→∞时：\nsup|Fₙ(x)-F(x)|→0（依概率）\n\n更精确地：\nP(lim_{n→∞} sup|Fₙ(x)-F(x)|=0)=1\n\n也即经验分布函数 Fₙ(x) 一致收敛于总体分布函数 F(x)\n\n【格里文科定理的意义】\n1. 是统计推断的理论基础：用样本推断总体的合理性\n2. 当n充分大时，Fₙ≈F，可近似估计总体的分布\n3. 为Kolmogorov-Smirnov检验提供依据（比较Fₙ与理论F的距离）\n\n【直方图与Fₙ(x)】\n直方图反映连续型总体的密度估计\nFₙ(x)反映离散化累积分布\n二者联系：Fₙ(x)在直方图各区间累加\n\n【经验分布函数的非参数统计应用】\n1. K-S检验：检验样本是否来自某分布\n   Dₙ=sup|Fₙ(x)-F₀(x)|\n   若Dₙ过大则拒绝H₀: F=F₀\n2. Q-Q图：通过分位数比较两个分布\n3. Bootstrap重抽样：从Fₙ抽样代替F\n\n【例题：5个样本值的Fₙ】\n样本值2,3,3,5,7\nFₙ(2)=0.2, Fₙ(3)=0.6（含两个3）, Fₙ(5)=0.8, Fₙ(7)=1\n\n【Fₙ的极限分布】\n若F连续，则√n(Fₙ(x)-F(x))的极限分布是\n均值为0的高斯过程\n协方差Cov(Fₙ(x),Fₙ(y))=F(min(x,y))(1-F(max(x,y)))/n\n\n这是Kolmogorov-Smirnov统计量的基础",problems:[{q:"Fₙ(x)的无偏性如何证明？",a:"E[Fₙ(x)]=(1/n)ΣE[I{Xᵢ≤x}]=(1/n)·n·F(x)=F(x)，因I{Xᵢ≤x}是Bernoulli变量，期望为F(x)",d:"medium"},{q:"格里文科定理的核心内容",a:"当n→∞时，经验分布函数Fₙ(x)在全域上一致收敛于总体分布F(x)（依概率/几乎处处）",d:"hard"},{q:"为何Fₙ(x)在跳跃点的跳跃幅度恒为1/n？",a:"每个Xᵢ对Fₙ贡献1/n。当Fₙ经过样本点X₍ᵢ₎时，恰好累积一个I{Xⱼ≤X₍ᵢ₎}=1，故跳跃1/n",d:"medium"},{q:"样本5,3,7,5,3中Fₙ(5)的值",a:"排序3,3,5,5,7。Fₙ(5)=#(Xᵢ≤5)/5=4/5=0.8",d:"easy"},{q:"K-S检验如何使用经验分布函数？",a:"计算Dₙ=sup|Fₙ(x)-F₀(x)|。若Dₙ>K_α（K-S表分位数），拒绝H₀:F=F₀",d:"hard"}]},

"prob-6-4":{explanation:"【顺序统计量定义】\n将样本X₁,...,Xₙ按从小到大排列：\nX₍₁₎≤X₍₂₎≤...≤X₍ₙ₎\nX₍ₖ₎称为第k个顺序统计量\n\n特别地：\n- X₍₁₎=min{X₁,...,Xₙ}：最小顺序统计量\n- X₍ₙ₎=max{X₁,...,Xₙ}：最大顺序统计量\n- 中位数 M=X₍₍ₙ₊₁₎/₂₎：第(n+1)/2个顺序统计量\n- 极差 R=X₍ₙ₎-X₍₁₎：最大值与最小值之差\n\n【顺序统计量的分布】\n\n设总体密度f，CDF F\nX₍ₖ₎的密度：\nf_{X₍ₖ₎}(x)=n!/(k-1)!(n-k)! [F(x)]^{k-1}[1-F(x)]^{n-k}f(x)\n\n特别地：\nX₍₁₎密度：f_{min}(x)=n[1-F(x)]^{n-1}f(x)\nX₍ₙ₎密度：f_{max}(x)=n[F(x)]^{n-1}f(x)\n\n【顺序统计量分布的推导思路】\n考虑X₍ₖ₎在(x, x+dx)的情形：\n- 一个观测落在(x, x+dx)——概率f(x)dx\n- k-1个观测落入(-∞, x]——C(n-1,k-1)[F(x)]^{k-1}\n- n-k个观测落入(x, ∞)——[1-F(x)]^{n-k}\n- 乘以n!/(k-1)!(n-k)! 的组合数\n\n【均匀分布样本的顺序统计量】\n若Xᵢ~U(0,1)，则X₍ₖ₎的密度：\nf_{X₍ₖ₎}(x)=n!/(k-1)!(n-k)! ·x^{k-1}(1-x)^{n-k}\n\n这是Beta分布：B(α=k, β=n-k+1)！\nE(X₍ₖ₎)=k/(n+1)\nD(X₍ₖ₎)=k(n-k+1)/[(n+1)²(n+2)]\n\n【中位数的渐近分布】\n中位数 M=X₍₍ₙ₊₁₎/₂₎ 渐近正态：\n√n(M-F⁻¹(0.5))→N(0, 1/[4f(F⁻¹(0.5))²])\n\n【极差的分布与性质】\n极差 R=X₍ₙ₎-X₍₁₎的分布计算复杂\n常用查表法：R/(σ)的均值和方差已编制统计表\nR用于质量控制图（极差图）\n\n【应用场景】\n1. 异常值检测：用X₍₁₎和X₍ₙ₎与四分位数比较\n2. 中位数估计：中位数是顺序统计量\n3. 极差控制图：质量控制中监控过程波动\n4. Q-Q图：分位数图比较两分布\n\n【与样本均值对比】\n| 统计量 | 类型 | 优点 |\n|--------|------|------|\n| X̄ | 利用所有数据 | 方差最小 |\n| M（中位数） | 仅利用中间数据 | 抗异常值 |\n| X₍ₖ₎ | 个别数据 | 信息不充分 |",problems:[{q:"Xᵢ~U(0,1)，求X₍ₖ₎的分布",a:"X₍ₖ₎~B(k, n-k+1)。Beta分布。验证∫₀¹ f(x)dx=1",d:"medium"},{q:"Xᵢ~Exp(λ)，求X₍₁₎=min的分布",a:"F_{min}(x)=1-[1-F(x)]ⁿ=1-(e^{-λx})ⁿ=1-e^{-nλx}，故min~Exp(nλ)",d:"medium"},{q:"如何理解顺序统计量与原样本的对应",a:"顺序统计量是原样本按大小重排后的版本，每个X₍ₖ₎是原样本中第k小的值",d:"easy"},{q:"为什么说样本均值是统计推断的最优选择？",a:"X̄是μ的MVUE（最小方差无偏估计）。在所有无偏估计中X̄方差最小",d:"hard"},{q:"极差R=E(X₍ₙ₎)-E(X₍₁₎)？如何用极差估计σ？",a:"R/d₂=σ的估计，其中d₂是依赖于n的常数（d₂(2)=1.128, d₂(5)=2.326等）",d:"hard"},{q:"用样本极差监控生产过程的稳定性",a:"极差控制图：上控制限UCL=D₄·R̄, 下控制限LCL=D₃·R̄",d:"medium"}]},

"prob-7-4":{explanation:"【双正态总体均值差μ₁-μ₂的置信区间】\n\n情形1：σ₁²,σ₂²已知\nX̄₁-X̄₂~N(μ₁-μ₂, σ₁²/n₁+σ₂²/n₂)\nμ₁-μ₂的(1-α)置信区间：\n(X̄₁-X̄₂)±z_α/2·√(σ₁²/n₁+σ₂²/n₂)\n\n情形2：σ₁²=σ₂²=σ²（方差相等但未知）\n使用合并方差Sp²：\nSp²=((n₁-1)S₁²+(n₂-1)S₂²)/(n₁+n₂-2)\n\nμ₁-μ₂的(1-α)置信区间：\n(X̄₁-X̄₂)±t_α/2(n₁+n₂-2)·Sp·√(1/n₁+1/n₂)\n\n情形3：σ₁²≠σ²（方差不等且未知）\n近似t检验（Welsh检验）：\n自由度ν=（σ̂₁²/n₁+σ̂₂²/n₂)²/[（σ̂₁²/n₁)²/(n₁-1)+(σ̂₂²/n₂)²/(n₂-1)]\n\n【双正态总体方差比σ₁²/σ₂²的置信区间】\nF=S₁²/S₂²~F(n₁-1,n₂-1)（σ₁²=σ₂²时）\n\nσ₁²/σ₂²的(1-α)置信区间：\n[S₁²/S₂²·1/F_α/2(n₁-1,n₂-1), S₁²/S₂²·1/F₁₋α/2(n₁-1,n₂-2)]\n\n利用F的分位数性质F₁₋α(m,n)=1/Fα(n,m)，可改写为：\n[S₁²/(S₂²·F_α/2(n₁-1,n₂-1)), S₁²·F_α/2(n₂-1,n₁-1)/S₂²]\n\n【例题：两个车间产品质量比较】\n甲车间n₁=10, X̄₁=100, S₁=5\n乙车间n₂=12, X̄₂=98, S₂=4\n假设σ₁²=σ₂², α=0.05\n\n计算Sp²=((9×25)+(11×16))/(10+12-2)=(225+176)/20=20.05\nSp=4.477\nt₀.₀₂₅(20)=2.086\n均值差置信区间=(100-98)±2.086×4.477×√(1/10+1/12)\n              =2±2.086×4.477×0.4365\n              =2±4.076\n              =[-2.076, 6.076]\n\n由于0在区间内，不能认为两车间均值有显著差异\n\n【应用场景】\n1. 比较两种生产工艺的产品质量\n2. 比较两种教学方法的效果\n3. 比较两个地区消费者的购买力\n4. 比较两种药物的疗效\n\n【选择方法的决策树】\n方差情况 → 方法\n两方差已知 → Z检验\n两方差未知但相等 → 合并t检验\n两方差未知且不等 → Welch近似t检验\n\n【与单总体置信区间的对比】\n相同点：都基于正态分布；都使用枢轴量\n不同点：双总体涉及两个样本，关心两总体的差异",problems:[{q:"两总体的t区间与Z区间何时用？",a:"σ₁²,σ₂²已知时用Z；未知但相等时用合并t；未知且不等时用Welch近似t",d:"medium"},{q:"σ₁²=σ₂²条件下，Sp²为何这样计算？",a:"Sp²是两样本方差的合并估计，方差相等时的最优加权平均：权重为自由度(nᵢ-1)",d:"hard"},{q:"F区间不对称的原因",a:"因为F分布不对称，χ²分布也不对称。两个非对称分布之比自然也不对称",d:"medium"},{q:"两车间均值差区间包含0，能下什么结论？",a:"不能拒绝H₀:μ₁=μ₂，认为两个车间均值无显著差异",d:"medium"},{q:"比较两个总体方差时，σ₁²=σ₂²与σ₁²≠σ₂²的检验方法有何不同？",a:"σ₁²=σ₂²: F=S₁²/S₂²~F(n₁-1,n₂-1)。σ₁²≠σ₂²: 方差齐性检验先决定",d:"hard"}]},

"prob-7-5":{explanation:"【样本容量确定的基本思路】\n在给定置信度1-α和允许误差E的条件下\n反推所需的最小样本量n\n\n核心公式：n=(z_α/2·σ/E)² （σ已知）\n或 n=(z_α/2·σ/E)² 当σ未知时用S代替σ（粗略估计）\n\n【均值μ的样本量】\n\n情形1：σ已知\nn=(z_α/2·σ/E)²\n\n情形2：σ未知\n需先做预试验得到σ的估计S\n或用极差R估计σ：σ≈R/4（粗略）\nn≈(z_α/2·S/E)²\n向上取整\n\n【比例p的样本量】\n置信区间公式：p̂±z_α/2·√(p̂(1-p̂)/n)\n允许误差E: z_α/2·√(p̂(1-p̂)/n)≤E\nn≥(z_α/2/E)²·p̂(1-p̂)\n\n当p未知时，最大化p(1-p)在p=0.5\n此时p(1-p)=0.25最大\nn≥0.25(z_α/2/E)²=(z_α/2/(2E))²\n\n【比例样本量的特例】\n| E (允许误差) | α=0.05(n) | α=0.01(n) |\n|--------------|-----------|-----------|\n| 0.01         | 9604      | 16589     |\n| 0.03         | 1068      | 1843      |\n| 0.05         | 384       | 664       |\n| 0.10         | 96        | 166       |\n\n【方差σ²的样本量】\n(n-1)S²/σ²~χ²(n-1)\n需n较大（如n≥30），使(n-1)近似正态\nσ²/E对应于|E-σ²|<E的精度要求\n\n【两类错误的样本量】\n假设检验中，根据两类错误概率反推样本量\n\nZ检验：n=((z_α+z_β)·σ/δ)²\n其中δ=μ₁-μ₀为待检验偏差\n\nt检验：n=((t_α(n-1)+t_β(n-1))·S/δ)²\n\n【估计精度的样本量】\n要求|X̄-μ|≤ε的概率≥1-α\nP(|X̄-μ|≤z_α/2·σ/√n)≥1-α\n要求z_α/2·σ/√n≤ε\nn≥(z_α/2·σ/ε)²\n\n【例题：选民调查】\n调查某候选人支持率，要求误差不超过3%，α=0.05\np未知，最大化为p=0.5\nn≥(1.96/(2×0.03))²=(32.67)²≈1067\n\n例：知情下p̂=0.6，则n=1.96²×0.6×0.4/0.03²=1024\n\n【应用】\n1. 民意调查：估计样本量确保精度\n2. 质量检验：抽样量确保检出率\n3. 医学试验：受试者数量满足统计功效\n4. 实验设计：平衡精度与成本",problems:[{q:"为何最坏情形估计p(1-p)用0.25？",a:"p(1-p)∈[0,0.25]，在p=0.5处最大。当p未知时为保守估计用最大值，保证n足够大",d:"medium"},{q:"σ=2, α=0.05, 要求E=0.5, 求均值μ的样本量n",a:"n=(z_α/2·σ/E)²=(1.96×2/0.5)²=(7.84)²=61.5, 取n=62",d:"easy"},{q:"为何p未知时用p=0.5而非p̂？",a:"p未知时无法估计p(1-p)。用最大可能值0.25保证n足够大",d:"medium"},{q:"允许误差E从0.05缩小到0.025，样本量变化？",a:"n与1/E²成正比。E缩小一半，n约增大4倍",d:"easy"},{q:"假设检验中功效1-β=0.8, α=0.05, 怎样求样本量？",a:"z_α/2=1.96, z_β=0.84。n=((z_α/2+z_β)·σ/δ)²=(2.8·σ/δ)²",d:"hard"},{q:"为什么样本量公式都需要σ的估计？",a:"精度要求E与σ的大小紧密相关",d:"medium"}]},

"prob-8-4":{explanation:"【单侧检验的基本思想】\n某些应用中只关心一个方向的偏离：\n- 是否不低于标准？H₀:μ≤μ₀ vs H₁:μ>μ₀\n- 是否不超出标准？H₀:μ≥μ₀ vs H₁:μ<μ₀\n\n单侧检验 vs 双侧检验：\n| 类型 | 假设 | 拒绝域 |\n|------|------|--------|\n| 双侧 | H₀:μ=μ₀, H₁:μ≠μ₀ | |T|>t_α/2 |\n| 左侧 | H₀:μ≥μ₀, H₁:μ<μ₀ | T<-t_α |\n| 右侧 | H₀:μ≤μ₀, H₁:μ>μ₀ | T>t_α |\n\n注意：单侧用t_α（而非t_α/2），与双侧临界值不同\n\n【单侧检验的实际应用】\n1. 产品质量：要求均值≥某标准值\n   H₀:μ<μ₀（不合格）vs H₁:μ≥μ₀（合格）——左侧检验\n2. 安全标准：某指标≤最大允许值\n   H₀:μ>μ₀（超标）vs H₁:μ≤μ₀（达标）——右侧检验\n3. 医学：新药是否优于旧药？\n   H₀:μ新≤μ旧 vs H₁:μ新>μ旧——右侧检验\n4. 工艺改进：改进后是否更好？\n   H₀:μ改进≤μ原 vs H₁:μ改进>μ原——右侧检验\n\n【Z单侧检验】\nσ已知，左侧：拒绝域 Z<-z_α\nσ已知，右侧：拒绝域 Z>z_α\n\n例如 z_0.05=1.645, z_0.025=1.96\n单侧α=0.05=1.645（注意不是1.96）\n\n【t单侧检验】\nσ未知，左侧：拒绝域 T<-t_α(n-1)\nσ未知，右侧：拒绝域 T>t_α(n-1)\n\n例如 t_0.05(15)=1.753, t_0.025(15)=2.131\n单侧α=0.05=1.753（注意不是2.131）\n\n【单侧检验的P值】\nP值是在H₀下观测到当前或更极端结果的概率\n（仅计算一侧）\n\n【单侧方差检验】\nχ²右侧检验：H₀:σ²≤σ₀² vs H₁:σ²>σ₀²，拒绝域χ²>χ²_α(n-1)\nχ²左侧检验：H₀:σ²≥σ₀² vs H₁:σ²<σ₀²，拒绝域χ²<χ²₁₋α(n-1)\n\n【单侧检验选择的方法】\n1. 由实际意义确定关心方向\n2. 等同检验 vs 不等同检验\n3. 服从对σ是否已知的判断\n\n【例题：电池寿命】\n某品牌电池标称寿命1000小时。25只样品测试X̄=980, S=120\n问：是否显著低于标称？α=0.05\nH₀:μ≥1000 vs H₁:μ<1000（左单侧）\nT=(980-1000)/(120/√25)=-1.667\n拒绝域：T<-t_0.05(24)=-1.711\n|-1.667|<1.711 → 不拒绝H₀\n\n解读：电池寿命虽低于标称但未达显著水平\n\n【单侧检验与置信区间的关系】\nα单侧检验 ↔ (1-α)单侧置信区间\n\n例：H₀:μ≥μ₀ vs H₁:μ<μ₀在α=0.05下拒绝H₀ ⟺ μ不在μ下限以上临界值",problems:[{q:"单侧与双侧α相同下，单侧临界值更小还是更大？",a:"更小。z_0.05=1.645比z_0.025=1.96小。意味着单侧更易拒绝H₀",d:"medium"},{q:"某品牌广告称产品平均寿命≥1000小时。25件样品：X̄=950, S=80。在α=0.05下验证广告",a:"H₀:μ≥1000 vs H₁:μ<1000（左侧检验）。T=(950-1000)/(80/5)=-3.125<-t_0.05(24)=-1.711，拒绝H₀。广告虚假",d:"medium"},{q:"单侧检验P值如何计算？",a:"P值=在H₀下观测到当前或更极端结果的概率。左侧检验P=P(T<T_obs)，右侧P=P(T>T_obs)",d:"easy"},{q:"为何单侧置信区间仅用一侧边界？",a:"单侧区间关心一个方向。如均值'至少为X̄-t_αS/√n'表示真值以95%把握不低于X̄-t_αS/√n",d:"medium"},{q:"产品质量要求均值≥100，样本X̄=98, S=4, n=25，是否合格？",a:"H₀:μ<100, H₁:μ≥100。T=(98-100)/(4/5)=-2.5。分位数表检查决定",d:"hard"}]},

"prob-8-5":{explanation:"【双正态总体均值差的假设检验】\n\n情形1：σ₁²,σ₂²已知（两样本Z检验）\nZ=(X̄₁-X̄₂)/√(σ₁²/n₁+σ₂²/n₂)~N(0,1)\n\nH₀:μ₁=μ₂ vs H₁:μ₁≠μ₂（双侧）：拒绝域|Z|>z_α/2\nH₀:μ₁≤μ₂ vs H₁:μ₁>μ₂（单侧）：拒绝域Z>z_α\n\n情形2：σ₁²=σ₂²=σ²（合并方差t检验）\nSp²=((n₁-1)S₁²+(n₂-1)S₂²)/(n₁+n₂-2)\nT=(X̄₁-X̄₂)/(Sp·√(1/n₁+1/n₂))~t(n₁+n₂-2)\n\n情形3：σ₁²≠σ²（Welch t检验）\nT'=(X̄₁-X̄₂)/√(S₁²/n₁+S₂²/n₂)\n近似t分布，自由度ν：\nν=(S₁²/n₁+S₂²/n₂)²/[(S₁²/n₁)²/(n₁-1)+(S₂²/n₂)²/(n₂-1)]\n\n【例题：两种教学方法】\n甲班（用新方法）35人，平均成绩78分，标准差8分\n乙班（用旧方法）30人，平均成绩74分，标准差7分\n假设两总体方差相等，问新方法是否显著优于旧方法？α=0.05\n\nSp²=(34×64+29×49)/(35+30-2)=(2176+1421)/63=57.16\nSp≈7.56\nT=(78-74)/(7.56·√(1/35+1/30))=4/(7.56×0.255)=2.08\nt_0.05(63)≈1.67（单侧α=0.05）\nT=2.08>1.67 → 拒绝H₀，新方法显著优于旧方法\n\n【配对样本t检验】\n当两样本非独立（如同一组对象前后对比）\n设dᵢ=Xᵢ-Yᵢ（差值）\nH₀:E(d)=0\nT=d̄/(S_d/√n)~t(n-1)\n\n例：10位病人治疗前/后血压\n治疗前：[120,130,115,128,122,118,125,130,121,124]\n治疗后：[115,125,112,120,118,114,120,124,118,121]\n差值d：-5,-5,-3,-8,-4,-4,-5,-6,-3,-3\nd̄=-4.6, S_d≈1.65\nT=-4.6/(1.65/√10)=-8.82\n|t|=8.82>t_0.05(9)=1.833 → 治疗显著有效\n\n【配对vs独立检验的选择】\n- 同一对象测两次：配对t检验\n- 两组独立对象：独立样本t检验\n- 配对检验更'灵敏'（消除了个体差异）\n\n【双正态总体方差比检验（F检验）】\nH₀:σ₁²=σ₂² vs H₁:σ₁²≠σ₂²\nF=S₁²/S₂²~F(n₁-1,n₂-1)\n拒绝域：F>F_α/2(n₁-1,n₂-1)或F<F₁₋α/2(n₁-1,n₂-1)\n\n使用F₁₋α/2(m,n)=1/F_α/2(n,m)简化计算\n\n【F检验的应用】\n1. 方差齐性检验（合并t检验前的准备）\n2. 方差分析（ANOVA）的核心\n3. 两个工艺精度的比较\n\n【与其他检验的关系】\n- 两样本Z检验是大样本两样本t检验的近似\n- 配对t检验 = 单样本t检验对差值\n- F检验 = 双样本χ²检验对两个方差",problems:[{q:"两样本Z检验与t检验的适用条件",a:"σ₁²,σ₂²已知时用Z；未知但相等时用合并t；未知且不等时用Welch近似t",d:"easy"},{q:"10位病人治疗前后血压的配对t检验",a:"设dᵢ=前-后。H₀:E(d)=0 vs H₁:E(d)<0。计算d̄, S_d, T=d̄/(S_d/√n)",d:"medium"},{q:"F₀.₀₅(10,15)=2.54, F₀.₉₅(10,15)=?",a:"F₁₋α/2(m,n)=1/Fα/2(n,m)。F₀.₉₅(10,15)=1/F₀.₀₅(15,10)=1/2.85=0.351",d:"medium"},{q:"合并方差Sp²为什么使用(nᵢ-1)加权？",a:"(nᵢ-1)Sᵢ²是σ²的无偏估计，加权平均保持无偏",d:"hard"},{q:"配对t检验为何比独立样本t检验更灵敏？",a:"配对t检验剔除了个体间差异（只关注'差'），方差更小",d:"medium"},{q:"F检验的应用场景",a:"1.合并t检验前检验方差齐性 2.方差分析（ANOVA）基础 3.两个方差相等的假设检验",d:"easy"}]},

"prob-8-6":{explanation:"【非参数检验的概念】\n非参数检验不依赖于总体的特定分布（如正态）\n适用范围更广，但功效通常低于参数检验\n\n参数检验 vs 非参数检验：\n- 参数检验：假设总体分布已知（如正态）\n- 非参数检验：仅基于数据排序/符号\n\n【符号检验】\n观察样本X₁,...,Xₙ，关心中位数M是否等于m₀\n方法：\n1. 比较Xᵢ与m₀，记号sign(Xᵢ-m₀)\n   +: Xᵢ>m₀, -: Xᵢ<m₀, 0: 舍去\n2. 设S₊=#正号, S₋=#负号\n3. 检验统计量S=min(S₊,S₋)\nP(S≤s₀)查符号检验表\n\n【例题：符号检验】\n某新药疗效。10位病人记录：[+2,+1,-1,+3,+2,+1,-2,+3,+2,-1]\n（正表示好转，数字是疗效评分）\n问：新药是否有效（中位数M>0）？\n检验H₀:M≤0 vs H₁:M>0\n正号8, 负号2, 总有效10\nP(S≤2)=P(2次以下负号)，对应binom(10,0.5)，P=11/1024≈0.011\n若α=0.05 → 拒绝H₀，认为新药有效\n\n【Wilcoxon符号秩检验】\n检验方法：\n1. 计算|Xᵢ-m₀|，取符号\n2. 按|差|从小到大排序赋秩（相同值取平均秩）\n3. 分别求正号秩和W₊, 负号秩和W₋\n4. 检验统计量W=min(W₊, W₋)\n5. 大样本时W近似正态\n\n比符号检验更精细，利用了差的绝对值大小信息\n\n【Wilcoxon秩和检验（Mann-Whitney U检验）】\n检验两个独立样本是否来自同一分布\n步骤：\n1. 合并两样本按从小到大排序\n2. 赋秩（相同值取平均秩）\n3. 计算第一组秩和W₁或第二组秩和W₂\n4. U=W₁-n₁(n₁+1)/2\n5. 大样本U近似正态\n\n【Kruskal-Wallis H检验（单因素ANOVA的非参数版）】\n多组数据比较，用秩代替数据\n\nH=[12/(N(N+1))]·ΣᵢRᵢ²/nᵢ - 3(N+1)\nN=总样本量, nᵢ=第i组样本量, Rᵢ=第i组秩和\nH近似χ²(k-1)\n\n【Spearman秩相关系数检验】\n检验两变量相关性（不要求正态）\nρₛ=1-6Σdᵢ²/(n(n²-1))\ndᵢ为两样本秩差\n\n【Kolmogorov-Smirnov检验】\n比较样本分布Fₙ与理论分布F₀\nDₙ=sup|Fₙ(x)-F₀(x)|\n\n【非参数检验的优缺点】\n优点：\n- 不依赖分布假设\n- 适用小样本或非正态\n- 抗异常值\n- 计算简单（基于排序）\n\n缺点：\n- 功效低于对应参数检验\n- 大量数据丢失（仅用顺序）\n- 不易控制犯两类错误",problems:[{q:"符号检验的适用情景",a:"配对样本差值比较、单样本中位数检验。优点：简单；缺点：仅利用方向信息，功效低",d:"easy"},{q:"Wilcoxon符号秩检验如何利用更多信息？",a:"不仅看方向还看差的绝对值（即大小）。克服符号检验只利用方向的缺点",d:"medium"},{q:"Mann-Whitney U检验的零假设",a:"H₀:两样本来自同一分布。U为第一组样本在合并排序中超过第二组的次数",d:"medium"},{q:"Spearman秩相关系数与Pearson相关系数区别",a:"Pearson度量线性关系（要求连续变量、近似正态）；Spearman度量单调关系（基于秩），对非正态、异常值稳健",d:"medium"},{q:"Kruskal-Wallis检验的应用",a:"多组（k≥3）独立样本均值比较的非参数方法。当数据非正态或方差严重不齐时的ANOVA替代",d:"hard"},{q:"为何非参数检验功效低于参数检验？",a:"非参数仅用顺序信息，丢失数据原始信息。在正态假设成立时正态检验更充分利用数据",d:"hard"}]},

"prob-9-4":{explanation:"【回归方程的拟合优度评价】\nR²=1-SSE/SST=SSR/SST\nR²接近1→拟合好，但不能无限接近1\n\n【R²的局限性】\n1. R²总是随自变量个数增加而增大，即使无关变量\n2. R²不能反映模型是否正确（线性模型可能错误但R²仍高）\n3. R²不反映预测能力\n\n【调整R²】\nR²_adj=1-(1-R²)(n-1)/(n-k-1)\nR²_adj对自变量个数k惩罚\n\n当R²_adj↑说明加入变量有效\n当R²_adj↓说明加入变量无效\n\n【残差分析】\n残差 eᵢ=Yᵢ-Ŷᵢ\n标准化残差：e*ᵢ=eᵢ/σ̂ (divided by σ̂)\n学生化残差：rᵢ=eᵢ/σ̂√(1-hᵢᵢ) = dᵢ（外在残差）\n\n【残差图分析】\n1. eᵢ vs Ŷᵢ：\n   残差随机散布在0附近→模型合适\n   残差呈U形或∩形→非线性\n   残差呈喇叭形→异方差\n\n2. eᵢ vs Xᵢ：\n   检查非线性、异方差\n\n3. Q-Q图：\n   检查残差正态性\n\n4. 时序图：\n   检查残差自相关\n\n【异常值检测】\n|rᵢ|>2或3 → 可能的异常值\n\n杠杆值 hᵢᵢ=xᵢ'(X'X)⁻¹xᵢ\nhᵢᵢ>2(k+1)/n → 高杠杆点（X离均值远）\n\n强影响点：Cook距离 Dᵢ>1\nDᵢ=rᵢ²/(k+1)·hᵢᵢ/(1-hᵢᵢ)\n\n【异方差检验】\nBP检验（Breusch-Pagan）：\n对eᵢ²对X回归，若R²显著则存在异方差\n\n【自相关检验（Durbin-Watson）】\nDW=Σ(eᵢ-eᵢ₋₁)²/Σeᵢ²\nDW≈2(1-ρ)\nρ为残差自相关系数\nDW≈2→无自相关\nDW小→正自相关\nDW接近4→负自相关\n\n【模型选择准则】\nAIC=2k-2ln(L)\nBIC=kln(n)-2ln(L)\n信息准则最小者最优\n\n【模型选择方法】\n1. 全子集法：检验所有2^k子集（k小时可行）\n2. 前向选择：从无变量逐步加入\n3. 后向删除：从全模型逐步删除\n4. 逐步回归：双向\n5. Lasso：L1正则化（变量自动收缩到0）\n6. Ridge：L2正则化（不能消除变量但抑制系数）\n\n【应用】\n预测变量选择\n模型复杂度控制\n防止过拟合\n提升预测精度",problems:[{q:"为什么R²不适用于变量选择？",a:"R²随变量个数增加而增大（即使无关变量），会倾向选择复杂模型。应使用调整R²或AIC/BIC",d:"medium"},{q:"残差图显示U形说明什么？",a:"说明可能存在非线性关系，线性假设不成立。应考虑多项式回归或变量变换（如x², log x等）",d:"medium"},{q:"Cook距离的含义",a:"Dᵢ衡量删除第i个观测后回归系数的变化。Dᵢ大说明第i点是强影响点",d:"hard"},{q:"DW统计量取值0-4对应什么？",a:"DW≈2→无自相关；DW<2→正自相关（越接近0越强）；DW>2→负自相关（越接近4越强）",d:"easy"},{q:"调整R²为何能解决R²的局限？",a:"调整R²引入(n-1)/(n-k-1)惩罚项，k大时调整R²减小，从而限制自变量个数过多",d:"medium"},{q:"BP检验思想",a:"若残差方差恒定，eᵢ²应与X无关。回归eᵢ²对X，看R²显著则拒绝方差齐假设",d:"hard"}]},

"prob-9-5":{explanation:"【可线性化的非线性回归】\n某些非线性模型可通过变量变换化为线性模型\n\n【常见的可线性化模型】\n1. 双曲线 1/y=a+b/x：\n   令y'=1/y, x'=1/x → y'=a+bx'\n\n2. 幂函数 y=axᵇ：\n   令y'=lny, x'=lnx, A=lna → y'=A+bx'\n\n3. 指数函数 y=ae^{bx}：\n   令y'=lny → y'=A+bx, A=lna\n\n4. 指数函数 y=ae^{bx²}：\n   令y'=lny → y'=A+bx²\n\n5. 对数函数 y=a+blnx：\n   令x'=lnx → y=a+bx'\n\n6. S型函数 y=e^{(a+bx)}：\n   令y'=1/y, x'=e^{-x} → y'=e^{a}·e^{bx}\n\n【变换方法】\n1. 选择变换使模型线性化\n2. 用OLS估计变换后的参数\n3. 反变换回原始参数\n\n注意：变换后参数的估计不是原始参数的最优估计\n若要求原始参数的最优估计，需用非线性最小二乘（迭代）\n\n【例题：指数曲线拟合】\ny=ae^{bx}\n数据：(xᵢ, yᵢ)，对y'=lny, x'=x\nOLS估计得 A=lna, b\n即a=e^A, b=b\n原模型：y=e^A·e^{bx}\n\n【例题：幂函数】\ny=axᵇ\n对lny=ln a+b lnx\n令y'=lny, x'=lnx, A=lna\nOLS估计A, b → a=e^A\n\n【多项式回归】\ny=β₀+β₁x+β₂x²+...+βₖxᵏ+ε\n化为多元线性：X₁=x, X₂=x², ..., Xₖ=xᵏ\n处理方式与一般多元回归相同\n\n【选择变换的方法】\n1. 根据散点图初步判断函数类型\n2. 尝试不同变换，比较R²\n3. 残差分析验证\n4. 残差最小者为优\n\n【非线性最小二乘（迭代法）】\n高斯-牛顿法：迭代求解\n使Q(a,b)=Σ(Yᵢ-a-bxᵢ²)² → 最小\n迭代公式：β^{(k+1)}=β^{(k)}-(J'J)⁻¹J'r\nJ为Jacobian矩阵\n\n【非线性回归vs线性回归】\n- 线性：可直接OLS，闭式解\n- 非线性：需迭代，可能不收敛\n\n【应用场景】\n1. 物理：放射性衰减 y=ae^{-λt}\n2. 化学：反应速率 y=ax/(b+x)\n3. 生物：种群增长 y=a·e^{bx}\n4. 经济：成本-产量 y=a+b/x\n5. 工程：强度-温度关系",problems:[{q:"为什么y=axᵇ可化为线性？",a:"两边取对数lny=lna+b lnx，令y'=lny, x'=lnx, A=lna，得y'=A+bx'",d:"medium"},{q:"线性化后OLS估计的a,b还最优吗？",a:"不是。变换后参数空间的OLS估计是变换空间的最优，但回到原空间不是最小残差平方和",d:"hard"},{q:"怎样判断该用哪种函数形式？",a:"1.画散点图观察趋势 2.尝试多种变换比较R² 3.残差分析验证 4.结合专业机理知识",d:"medium"},{q:"y=ae^{bx}的两边取常用对数是否也成立？",a:"lg y=lg a+bx·lge，即lgy=A+Bx仍线性化",d:"hard"},{q:"多项式回归是线性回归吗？",a:"形式上是非线性（对x），但参数线性（β₀,...,βₖ为线性）。可通过变量替换X₁=x, X₂=x², ... 化为多元线性",d:"medium"},{q:"为什么非线性最小二乘需要迭代？",a:"非线性模型对参数的偏导是参数的函数，无闭式解。需迭代求解（高斯-牛顿、Newton法等）",d:"hard"}]},

"prob-9-6":{explanation:"【回归诊断概述】\n回归诊断是利用残差分析、统计检验、可视化等方法，验证线性回归模型的合理性。\n主要诊断四个方面：\n1. 线性假设：Y与X是否满足线性关系\n2. 方差齐性：残差方差是否恒定\n3. 独立性：残差是否独立\n4. 正态性：残差是否近似正态\n\n违反任何一条假设都会影响回归分析的有效性。\n\n【一、线性诊断】\n散点图：Y对X的散点图，若呈直线趋势则线性假设合理\n残差图：残差eᵢ对拟合值ŷᵢ或Xᵢ的散点图\n  若残差随机散布在0附近 → 线性假设成立\n  若呈现U形、∩形、曲线趋势 → 存在非线性\n\n处理方法：\n- 添加二次项 X²\n- 对X或Y做变量变换（对数、平方根等）\n- 改用非线性回归\n\n【二、方差齐性诊断】\n若残差图中残差关于拟合值的散点呈\"喇叭形\"\n→ 异方差：小x时方差小，大x时方差大\n\n检验方法：\n1. BP检验（Breusch-Pagan）：\n   H₀:同方差\n   步骤：①算残差eᵢ，平方eᵢ²\n   ②回归eᵢ²对X₁,...,Xₖ\n   ③若F检验显著 → 拒绝H₀（异方差）\n2. White检验：eᵢ²回归X₁,X₂,...,X₁²,...,XᵢXⱼ\n3. Goldfeld-Quandt检验：排序分组比较方差\n\n处理方法：\n- 加权最小二乘（WLS）：用1/σ²(xᵢ)作为权重\n- 方差稳定变换：logY, √Y, 1/Y等\n\n【三、独立性诊断】\n时序数据中残差可能存在自相关\nDurbin-Watson检验：\nDW=Σ(eᵢ-eᵢ₋₁)²/Σeᵢ²\n\nDW≈2 → 无自相关\nDW显著小于2（如DW<1.5）→ 正自相关\nDW显著大于2 → 负自相关\n\n处理方法：\n- 广义最小二乘（GLS）\n- 加入滞后变量 Y_{t-1}\n- 时间序列模型（ARIMA）\n\n【四、正态性诊断】\nQ-Q图（Quantile-Quantile）：\n标准化残差的分位数与标准正态分位数对比\n  近似直线 → 正态假设成立\n  S形或反S形 → 偏离正态\n\n检验方法：\n- Shapiro-Wilk检验（小样本）\n- Kolmogorov-Smirnov检验\n- Anderson-Darling检验\n- Jarque-Bera检验（基于偏度、峰度）\n\n处理方法：\n- 对Y做Box-Cox变换\n- y(λ)=(y^λ-1)/λ (λ≠0); ln y (λ=0)\n- 选择λ使正态性最好\n\n【强影响点与异常值】\n1. 异常值：Y方向远离（Y异常）\n2. 高杠杆点：X空间远离（X异常）\n3. 强影响点：删除后模型显著变化\n\n识别方法：\n- 学生化残差 |rᵢ|>2或3\n- 杠杆值 hᵢᵢ>2(k+1)/n\n- Cook距离 Dᵢ>1 或4/n\n- DFFITS准则 |DFFITSᵢ|>2√((k+1)/n)\n\n处理方法：\n- 检验数据录入是否正确\n- 用稳健回归（如M-估计）\n- 删除并报告\n\n【多重共线性诊断】\nX'X接近奇异 → 多重共线性\n\n诊断方法：\n1. 特征值分析：κ=λmax/λmin，κ>30严重共线\n2. 方差膨胀因子 VIFⱼ=1/(1-Rⱼ²)\n   VIF>10 严重共线\n3. 容忍度 1/VIF<0.1 严重\n\n处理方法：\n- 剔除相关变量\n- 主成分回归\n- 岭回归 β̂=(X'X+λI)⁻¹X'Y\n- 偏最小二乘（PLS）\n\n【模型选择】\n比较多个候选模型：\n\n1. AIC = 2k - 2ln(L)\n   越小越好，平衡拟合与复杂度\n2. BIC = k·ln(n) - 2ln(L)\n   对样本量更敏感\n3. 调整R²：R²_adj=1-(1-R²)(n-1)/(n-k-1)\n4. 预测误差：PRESS残差 √Σ(eᵢ/(1-hᵢᵢ))²\n5. 交叉验证误差（CV）：将数据分为k折\n\n【逐步回归详解】\n前向选择：开始时无变量，逐步加入对模型贡献最大的变量\n后向删除：从全模型逐步删除贡献最小的变量\n逐步回归：前向+后向，每步可加可减\n\n加入准则：F检验显著\n删除准则：F检验不显著\n\n【完整回归诊断流程】\n1. 初步拟合OLS回归\n2. 检查R²、F检验\n3. 残差图分析 → 线性/异方差/自相关\n4. Q-Q图 → 正态性\n5. 强影响点检查（Cook距离）\n6. 多重共线性（VIF）\n7. 根据诊断结果改进模型\n8. 改进后再次诊断验证\n\n【建模规范流程】\n1. 数据探索：散点图、相关分析\n2. 初步建模：OLS\n3. 模型诊断：上面5个方面\n4. 模型修正：变换、剔除、添加变量\n5. 模型选择：AIC/BIC/R²_adj\n6. 模型验证：交叉验证、独立样本验证\n7. 报告结果：系数、标准误、置信区间\n\n【常用工具】\n- Python: statsmodels OLS + diagnostics\n- R: lm() + plot(), influence.measures\n- SAS: PROC REG + PROC GLM",problems:[{q:"线性回归的四个核心假设是什么？",a:"1.线性 2.方差齐性：D(εᵢ)=σ²恒定 3.独立性：εᵢ互相独立 4.正态性：εᵢ~N(0,σ²)",d:"easy"},{q:"DW≈0说明什么？如何处理？",a:"强正自相关（相邻残差高度相关）。处理方法：加入滞后项Y_{t-1}、广义最小二乘GLS、或用ARIMA",d:"medium"},{q:"Cook距离与杠杆值有什么区别？",a:"杠杆值hᵢᵢ衡量第i点X远离均值的程度（X方向异常）；Cook距离Dᵢ综合杠杆和残差，衡量删除第i点对回归系数的影响",d:"hard"},{q:"Box-Cox变换如何选择参数λ？",a:"λ使变换后残差最接近正态（对数似然最大），可通过profile likelihood方法选择",d:"hard"},{q:"如何诊断和处理多重共线性？",a:"诊断：VIF>10或特征值比>30表明共线。处理：①剔除高相关变量②岭回归（加λI抑制系数）③主成分回归",d:"medium"},{q:"AIC、BIC、调整R²各适合什么场景？",a:"AIC: 一般模型选择，平衡复杂度；BIC: 大样本时更倾向于简约；调整R²: 直观反映解释度",d:"medium"},{q:"为什么逐步回归得到的'最优'子集不一定是真正最优？",a:"逐步回归基于贪心策略（每步局部最优），可能陷入局部最优",d:"hard"},{q:"强影响点是否一定要删除？",a:"不一定。若是数据录入错误应删除；若是有意义的特殊点应保留并报告",d:"hard"},{q:"如何验证回归模型的预测能力？",a:"1.交叉验证（k折CV或留一法）2.独立测试集验证3.PRESS统计量4.考虑外部样本验证",d:"medium"}]},
'python-1-0': {explanation:'Python是Guido van Rossum于1991年发布的解释型、面向对象的高级编程语言。其设计哲学强调代码可读性和简洁性，使用缩进定义代码块而不是大括号。Python支持多种编程范式：面向对象、函数式和过程式编程。主要应用领域包括：Web开发（Django/Flask）、数据科学（NumPy/Pandas）、人工智能（PyTorch/TensorFlow）、自动化运维、网络爬虫等。Python拥有超过20万个第三方库的PyPI生态。\\n\\n易错点：Python是解释型语言（非编译型），代码逐行执行；Python 2和Python 3不兼容，学习时应以Python 3为准。',problems:[{q:'Python属于哪种类型的编程语言？',a:'解释型、面向对象的高级编程语言',d:'easy'},{q:'Python的设计哲学强调什么？',a:'代码可读性和简洁性（Python之禅：优美胜于丑陋，明确胜于隐晦）',d:'easy'},{q:'列举Python的三个主要应用领域',a:'Web开发、数据科学、人工智能/机器学习（也可答：自动化运维、网络爬虫、游戏开发等）',d:'medium'}]},
'python-1-1': {explanation:'Python开发环境配置需要三步：1.下载Python安装包（python.org），建议选择3.8以上版本；2.安装时勾选\'Add Python to PATH\'将Python添加到系统环境变量；3.命令行输入\'python --version\'验证安装。\\n\\n主流IDE选择：PyCharm（JetBrains出品，功能最全面的Python IDE，Community版免费）；VSCode + Python扩展（轻量级，高度可定制）；Jupyter Notebook（交互式编程，适合数据分析与教学）。\\n\\npip是Python的包管理工具，用于安装第三方库。使用\'pip install 包名\'即可从PyPI下载安装。',problems:[{q:'安装Python时为什么要勾选Add Python to PATH？',a:'将Python添加到系统PATH环境变量，使得在命令行任意目录下都可以直接运行python命令',d:'easy'},{q:'pip是什么？写出安装numpy库的命令',a:'pip是Python的包管理工具（Package Installer for Python）。安装命令：pip install numpy',d:'easy'},{q:'Jupyter Notebook相比PyCharm的优势是什么？',a:'交互式编程、代码和文档混合（Markdown）、单元格独立执行、适合数据探索和教学演示',d:'medium'}]},
'python-1-2': {explanation:'print()是Python最基础的内置函数，用于向控制台输出内容。基本用法：print(\'Hello World\')。多个参数时用逗号分隔自动空格间隔；sep参数指定分隔符（默认空格）；end参数指定结尾字符（默认换行）。\\n\\nPython注释：单行注释用#，多行注释用三个单引号或双引号包裹。注释是写给开发者看的说明文字，不会被解释器执行。\\n\\nPython用缩进定义代码块，同级代码块缩进量必须一致（推荐4个空格）。缩进不一致会导致IndentationError。',problems:[{q:'print(\'Hello\',\'World\',sep=\'-\',end=\'!\')的输出是什么？',a:'Hello-World!',d:'easy'},{q:'Python中的单行注释和多行注释分别用什么符号？',a:'单行注释用#开头；多行注释用三个单引号\'\'\'或三个双引号"""包裹',d:'easy'},{q:'以下代码为什么报错？\\nif True:\\nprint(\'Hello\')\\n    print(\'World\')',a:'两个print语句的缩进不一致。Python要求同一代码块的缩进量必须相同，都应为4个空格',d:'medium'}]},
'python-2-0': {explanation:'Python是动态类型语言，变量不需要声明类型，赋值即创建。变量名遵循标识符规则：只能包含字母、数字、下划线，不能以数字开头，不能是关键字。命名风格建议：普通变量用snake_case（蛇形命名），常量全大写，类名用PascalCase。\\n\\nPython支持多重赋值：a,b,c = 1,2,3 同时赋值；a=b=c=10 链式赋相同值；a,b = b,a 一行实现变量交换（无需临时变量）。Python变量本质是对象引用（标签），赋值是让变量名指向某个内存中的对象。\\n\\n易错点：Python中\'=\'是赋值，\'==\'才是比较；变量必须先赋值后使用，否则NameError。',problems:[{q:'以下哪些是合法的Python变量名？\\nA. 2name  B. _name  C. name!  D. my_var',a:'B和D合法。A以数字开头非法，C包含非法字符!',d:'easy'},{q:'写出交换变量a和b值的Python代码（一行完成）',a:'a, b = b, a',d:'easy'},{q:'执行x=y=z=[1,2,3]后，修改x[0]=99，y[0]的值是什么？为什么？',a:'y[0]也是99。因为x、y、z指向同一个列表对象（可变对象），修改任意一个都会影响所有引用',d:'hard'}]},
'python-2-1': {explanation:'Python有6种标准数据类型：数字（int/float/complex）、字符串（str）、列表（list）、元组（tuple）、字典（dict）、集合（set）。\\n\\n数字类型中int整数精度无限（仅受内存限制），float为双精度浮点数，complex支持复数运算。bool是int的子类，True和False的值分别为1和0。\\n\\n类型转换函数：int()转整数，float()转浮点数，str()转字符串，bool()转布尔。\\n\\ntype()函数可查看变量的类型，isinstance(obj, type)用于类型检查，比type()更推荐（支持继承判断）。',problems:[{q:'True + 1 的结果是多少？为什么？',a:'结果为2。因为bool是int的子类，True的值是1',d:'easy'},{q:'int(\'42\') + float(\'3.14\') 的结果是什么？类型是什么？',a:'结果为45.14，类型是float（int+float自动提升为float）',d:'medium'},{q:'Python中int类型的取值范围是多少？',a:'理论上无限，只受内存大小限制。这是Python区别于C/Java的重要特性',d:'medium'}]},
'python-2-2': {explanation:'Python运算符分为五大类：算术（+ - * / // % **）、关系（== != > < >= <=）、逻辑（and or not）、成员（in not in）、同一性（is is not）。\\n\\n关键区分：/ 返回浮点数（即使整除），// 返回整数（向下取整）；== 比较值是否相等，is 比较是否为同一对象（内存地址相同）。\\n\\n逻辑运算符支持短路求值：and遇到False立即返回False，or遇到True立即返回True。这可以用来避免除零等错误：\'if b!=0 and a/b>1\' 安全。\\n\\n运算符优先级：幂运算 > 正负号 > 算术 > 关系 > 逻辑。不确定时用小括号明确优先级。',problems:[{q:'17 / 5 与 17 // 5 的区别是什么？',a:'17/5=3.4（浮点数），17//5=3（整数，向下取整即地板除）',d:'easy'},{q:'a=[1,2]; b=[1,2]; print(a==b, a is b) 输出什么？',a:'True False。a==b比较值相同为True，a is b比较是否是同一对象为False',d:'medium'},{q:'解释：False and (10/0) 为什么不会报错？',a:'因为and短路求值：遇到False后表达式结果已确定，不再执行右侧的除零操作',d:'hard'}]},
'python-3-0': {explanation:'条件判断使用if/elif/else关键字。执行流程：从上到下依次判断条件，遇到第一个True的分支后执行对应代码块并跳过后续判断。\\n\\n三元表达式：\'value_if_true if condition else value_if_false\'（一行完成简单条件判断）。\\n\\nPython 3.10+引入match-case语句（类似switch），支持模式匹配和守卫条件，比多个elif更清晰。\\n\\n嵌套if：一个if语句内部包含另一个if，注意缩进层次。过于复杂的嵌套应重构为函数。\\n\\n易错点：if后面必须有冒号:；elif不是else if；条件表达式的结果必须是布尔值或可转换为布尔值。',problems:[{q:'写出判断一个数是正数、零还是负数的代码',a:'if num>0:print(\'正数\')\\nelif num==0:print(\'零\')\\nelse:print(\'负数\')',d:'easy'},{q:'用三元表达式改写：if age>=18: status=\'成年\' else: status=\'未成年\'',a:'status = \'成年\' if age >= 18 else \'未成年\'',d:'easy'},{q:'if year%4==0 and year%100!=0 or year%400==0 判断什么？',a:'判断year是否为闰年。闰年规则：能被4整除但不能被100整除，或能被400整除',d:'medium'}]},
'python-3-1': {explanation:'循环语句：for-in用于遍历序列（列表/元组/字符串/range等），while在条件为True时重复执行。\\n\\nrange(start, stop, step)生成整数序列：range(5) → 0,1,2,3,4；range(2,8,2) → 2,4,6。\\n\\nbreak：跳出整个循环；continue：跳过本次迭代进入下一次；pass：占位语句，什么都不做。\\n\\nfor-else语法：循环正常结束（非break退出）时执行else块，常用于查找+未找到处理。\\n\\nenumerate()可同时获取索引和值：\'for i, val in enumerate(list)\'。',problems:[{q:'for i in range(3): print(i) 输出什么？',a:'0\\n1\\n2（range(3)生成0,1,2，注意不包括3）',d:'easy'},{q:'break和continue的区别是什么？',a:'break完全终止循环（跳出循环体）；continue跳过本次迭代的剩余代码，直接进入下一次迭代',d:'easy'},{q:'for i in range(5):\\n    if i==3: break\\nelse:\\n    print(\'结束\')\\n会输出\'结束\'吗？',a:'不会。因为循环被break终止（非正常结束），所以else块不会执行',d:'medium'}]},
'python-3-2': {explanation:'综合运用条件与循环解决实际问题。嵌套循环：外层每执行一次，内层执行一轮。九九乘法表是嵌套循环的经典例子。\\n\\n斐波那契数列：a,b=0,1; a,b=b,a+b 一行完成递推，Python的并行赋值使递推极其简洁。\\n\\n素数判断：检查2到sqrt(n)范围，用%运算符检查整除性。列表推导式可以一行生成素数列表。\\n\\n累加器模式：初始化变量sum=0，循环中sum+=值，适用于求和、计数、求最值等场景。',problems:[{q:'用一行代码生成1-10的平方列表',a:'[x**2 for x in range(1,11)] 结果：[1,4,9,16,25,36,49,64,81,100]',d:'easy'},{q:'如何判断一个数n是否为素数？',a:'检查2到int(n**0.5)范围内是否有n的因子。若有因子则非素数，若无则n为素数',d:'medium'},{q:'用Python代码输出九九乘法表的前三行',a:'for i in range(1,4):\\n    for j in range(1,i+1):\\n        print(f\'{j}x{i}={i*j}\',end=\' \')\\n    print()',d:'medium'}]},
'python-4-0': {explanation:'列表（list）是Python最常用的序列类型，用方括号[]定义。支持索引访问（从0开始）、切片操作（[start:stop:step]）、增删改查。\\n\\n常用方法：append()末尾添加、insert(i,x)指定位置插入、remove(x)删除第一个匹配值、pop()弹出末尾、sort()排序、reverse()反转。\\n\\n列表推导式是Python精髓：[表达式 for 变量 in 序列 if 条件]。一行代码完成筛选+变换+生成列表。\\n\\n列表是可变对象，修改操作会影响原列表。sorted()返回新列表不修改原列表。\\n\\n易错点：列表索引越界（IndexError）；sort()就地修改且不返回值；切片是浅拷贝。',problems:[{q:'nums=[1,2,3]; nums.append(4); nums是什么？',a:'[1, 2, 3, 4]',d:'easy'},{q:'用列表推导式生成1到20中的所有偶数',a:'[x for x in range(1,21) if x%2==0]',d:'easy'},{q:'nums=[3,1,4,1,5]; result=nums.sort(); print(result) 输出什么？',a:'输出None。因为sort()方法就地排序不返回值（返回None），应该直接print(nums)',d:'medium'}]},
'python-4-1': {explanation:'元组（tuple）是不可变序列，用圆括号()定义。一旦创建，无法修改元素（不支持赋值、添加、删除）。\\n\\n与列表对比：列表适合需要频繁修改的数据，元组适合固定不变的数据（如坐标、配置项）。元组可哈希，可作为字典键。\\n\\n打包与解包：\'a,b,c = 1,2,3\' 右侧自动打包为元组后解包给左侧变量。函数的多返回值实际返回元组。\\n\\n单元素元组必须加逗号：(42,)才是元组，(42)只是括号表达式。\\n\\ncollections.namedtuple可以创建具名元组，兼具元组的不可变性和对象的可读性。',problems:[{q:'t=(1,2,3); t[0]=10 会怎样？',a:'报TypeError。元组是不可变类型，不支持元素修改',d:'easy'},{q:'手动实现a,b值交换（不用临时变量）',a:'a, b = b, a（利用元组的打包解包机制）',d:'easy'},{q:'def func(): return 1,2,3 的返回值类型是什么？',a:'返回值是元组(1,2,3)。Python函数用逗号分隔返回多个值时，自动打包为元组',d:'medium'}]},
'python-4-2': {explanation:'字符串（str）是不可变序列，支持索引、切片、len、in等通用操作。创建方式：单引号、双引号、三引号（可跨行）。\\n\\n常用方法：upper()/lower()大小写转换、strip()去空白、split()分割为列表、join()列表拼接为字符串、replace()替换、find()查找位置、startswith()/endswith()判断前后缀。\\n\\nPython 3.6+引入f-string：f\'{变量:格式}\'，是最高效、可读性最好的格式化方式。支持对齐、补零、小数位等格式控制。\\n\\n转义字符：\\n换行、\\t制表、\\\\反斜杠。r前缀创建原始字符串，不解析转义。',problems:[{q:'\' Hello \'.strip() 的结果是什么？',a:'\'Hello\'（去除首尾空白字符）',d:'easy'},{q:'用join方法将列表[\'a\',\'b\',\'c\']拼接为\'a-b-c\'',a:'\'-\'.join([\'a\',\'b\',\'c\'])',d:'easy'},{q:'name=\'张三\'; score=95.678; 用f-string输出\'张三得分: 95.68\'',a:'f\'{name}得分: {score:.2f}\'',d:'medium'}]},
'python-4-3': {explanation:'序列通用操作适用于所有序列类型（list/tuple/str/range）：\\n索引：seq[0]获取第一个元素，seq[-1]获取最后一个。\\n切片：seq[start:stop:step]返回子序列，左闭右开。seq[::-1]实现序列反转。\\n内置函数：len()长度、min()/max()最值、sum()求和（仅数值序列）。\\n成员检测：x in seq 检查元素是否存在，not in 检查不存在。\\n运算：seq1+seq2连接两个序列，seq*n重复n次。\\n\\nenumerate(seq)返回(index, value)的迭代器，用于需要索引的遍历场景。',problems:[{q:'seq=[1,2,3,4,5]; seq[::-1] 的结果是什么？',a:'[5,4,3,2,1]（步长为-1实现反转）',d:'easy'},{q:'seq=[1,2,3,4,5]; seq[1:4] 包含索引4的元素吗？',a:'不包含。切片是左闭右开区间[1,4)，即索引1、2、3的元素',d:'easy'},{q:'用enumerate遍历列表并打印每个元素的索引和值',a:'for i, val in enumerate(my_list):\\n    print(f\'索引{i}: {val}\')',d:'medium'}]},
'python-5-0': {explanation:'字典（dict）是键值对集合，键必须不可变（字符串/数字/元组），值可以是任意类型。字典基于哈希表实现，查找/插入/删除均为O(1)。\\n\\n创建方式：{\'key\':\'value\'}、dict()、字典推导式{x:x**2 for x in range(5)}。\\n\\n常用操作：dict[\'key\']访问（键不存在报KeyError）、dict.get(\'key\',default)安全访问、dict[\'key\']=value赋值（增/改）、del dict[\'key\']删除、dict.pop(\'key\')弹出。\\n\\n遍历：for k in dict（键）、for v in dict.values()（值）、for k,v in dict.items()（键值对）。\\n\\nsetdefault(key,default)在键不存在时设置默认值，常用于计数器模式。',problems:[{q:'如何安全地从字典中获取键\'age\'的值，若不存在则返回0？',a:'d.get(\'age\', 0)',d:'easy'},{q:'统计字符串中每个字符出现次数的代码',a:'freq={}; for c in s: freq[c]=freq.get(c,0)+1',d:'medium'},{q:'字典的键有什么限制？列表可以作为字典的键吗？',a:'键必须是不可变类型（可哈希）。列表是可变对象不可哈希，不能作为字典键；元组可以',d:'hard'}]},
'python-5-1': {explanation:'集合（set）是无序、不重复、可变的元素集合。创建：{1,2,3}或set([1,2,3])。空集合必须用set()（{}是空字典）。\\n\\n集合运算：&交集、|并集、-差集、^对称差，对标数学中的集合运算。\\n\\n成员检测（x in set）为O(1)复杂度，比列表的O(n)快得多，适合大量数据的去重和查找。\\n\\n常用方法：add()添加、remove()删除（不存在报错）、discard()安全删除、pop()随机弹出。\\n\\nfrozenset是不可变集合，可哈希，可作为字典键。',problems:[{q:'如何快速去除列表[1,2,2,3,3,3]中的重复元素？',a:'list(set([1,2,2,3,3,3])) 结果：[1,2,3]',d:'easy'},{q:'a={1,2,3,4}; b={3,4,5,6}; a & b 的结果是什么？',a:'{3, 4}（交集，两集合同有的元素）',d:'easy'},{q:'为什么\'3 in [1,2,3,4,5]\'比\'3 in {1,2,3,4,5}\'慢？',a:'列表in操作需要O(n)遍历；集合in操作基于哈希O(1)。数据量越大差距越明显',d:'medium'}]},
'python-6-0': {explanation:'函数用def关键字定义，是组织代码、实现复用的基本单元。def func(params): 后跟缩进的函数体，return返回值。无return时默认返回None。\\n\\n参数类型（按顺序）：位置参数（必填）、默认参数（可省略）、*args可变位置参数（打包为元组）、**kwargs可变关键字参数（打包为字典）。\\n\\n调用时可用关键字参数指定参数名（不依赖位置），也可用*和**解包序列/字典为参数。\\n\\n多返回值：return a,b,c 实际返回元组，调用方可解包获取各值。\\n\\n文档字符串（docstring）写在函数内部第一行，用三重引号包裹，通过func.__doc__访问。',problems:[{q:'写出一个接受任意数量参数并求和的函数',a:'def sum_all(*args):\\n    return sum(args)',d:'easy'},{q:'def f(a,b=2,*args,**kwargs)中各参数的含义是什么？',a:'a是位置参数（必填）；b是默认参数（可省略，默认2）；args接收额外位置参数（元组）；kwargs接收关键字参数（字典）',d:'medium'},{q:'def func(): return 1,2,3\\na,b,c = func()\\n第三行各变量值是什么？',a:'a=1, b=2, c=3。多返回值实际返回元组(1,2,3)，解包后分配给三个变量',d:'medium'}]},
'python-6-1': {explanation:'递归是函数调用自身的编程技巧。递归三要素：基线条件（终止递归）、递推公式（问题规模缩小）、函数自调用。\\n\\n经典例子：阶乘 n!=n*(n-1)!（基线：0!=1）；斐波那契 fib(n)=fib(n-1)+fib(n-2)（基线：n<=1返回n）；汉诺塔问题。\\n\\n递归优缺点：代码简洁优雅，但函数调用有开销，Python默认递归深度约1000层（可用sys.setrecursionlimit调整）。\\n\\n优化：functools.lru_cache装饰器可缓存递归结果，将指数级时间复杂度降至线性。\\n\\n易错点：忘记基线条件导致无限递归（RecursionError）；重复计算导致性能问题。',problems:[{q:'写出阶乘函数的递归实现',a:'def fact(n):\\n    if n<=1: return 1  # 基线条件\\n    return n*fact(n-1)  # 递归',d:'easy'},{q:'递归求fib(10)=55。无缓存时fib(10)调用了多少次fib(1)？',a:'55次。无缓存时每一层fib(1)都会被独立计算一次',d:'medium'},{q:'如何用lru_cache优化递归斐波那契？',a:'from functools import lru_cache\\n@lru_cache(maxsize=None)\\ndef fib(n):\\n    return n if n<=1 else fib(n-1)+fib(n-2)',d:'hard'}]},
'python-6-2': {explanation:'变量作用域遵循LEGB规则：Local（函数内）→ Enclosing（外层函数）→ Global（模块级）→ Built-in（内置）。查找变量时从内向外依次搜索，找到即停止。\\n\\n修改全局变量需用global声明：\'global var; var=new_value\'。修改外层函数变量需用nonlocal声明。\\n\\nlambda是匿名函数：\'lambda args: expression\'，只能包含单个表达式。常用于map()、filter()、sorted()等高阶函数的回调参数。\\n\\n易错点：函数内直接赋值而不声明global会创建局部变量而非修改全局变量；lambda功能受限，复杂逻辑请用def。',problems:[{q:'写出将列表中每个元素平方的lambda表达式',a:'list(map(lambda x: x**2, [1,2,3,4,5])) 结果：[1,4,9,16,25]',d:'easy'},{q:'x=10; def f(): x=5; f(); print(x) 输出什么？',a:'输出10。函数内x=5创建了局部变量，不影响全局x。若想修改全局变量需声明global x',d:'medium'},{q:'LEGB四个字母分别代表什么作用域？',a:'Local局部→Enclosing封闭（外层函数）→Global全局（模块级）→Built-in内置',d:'medium'}]},
'python-7-0': {explanation:'模块是包含Python代码的.py文件，是代码组织的基本单位。导入方式：import模块名、from模块import名称、import模块as别名。\\n\\n导入流程：解释器在sys.path指定的路径列表中搜索模块文件，找到后加载并创建独立的命名空间。\\n\\n__name__变量：文件直接运行时值为\'__main__\'，被导入时值为模块名。常用于\'if __name__=="__main__":\'判断程序入口。\\n\\n包（Package）是包含__init__.py文件的目录，用于组织多个相关模块。',problems:[{q:'import math 和 from math import sqrt 的区别？',a:'import math导入整个模块需math.sqrt()访问；from math import sqrt直接导入sqrt函数可直接调用sqrt()',d:'easy'},{q:'__name__ == \'__main__\' 的作用是什么？',a:'判断该文件是直接运行还是被导入。直接运行时执行if块内容，被导入时不执行',d:'easy'},{q:'自己写一个myutils.py模块并在另一个文件中导入使用',a:'# myutils.py中定义函数；另一个文件：import myutils; myutils.函数名() 或 from myutils import 函数名',d:'medium'}]},
'python-7-1': {explanation:'Python标准库是随解释器一起安装的模块集合，涵盖文件I/O、网络、数据处理、系统管理等。\\n\\nrandom：生成随机数，randint(a,b)随机整数，choice(seq)随机选取，shuffle(list)洗牌，sample(pop,k)抽样。\\n\\ndatetime：日期时间处理，datetime.now()当前时间，strftime()格式化，strptime()解析字符串。\\n\\njson：JSON序列化，dumps()对象转JSON字符串，loads()JSON字符串转对象。\\n\\nos/sys：操作系统接口，os.getcwd()工作目录，os.listdir()文件列表，sys.argv命令行参数。',problems:[{q:'如何生成一个1到100之间的随机整数？',a:'import random; random.randint(1, 100)',d:'easy'},{q:'如何将字典{\'name\':\'张三\'}转为JSON字符串？',a:'import json; json.dumps({\'name\':\'张三\'}, ensure_ascii=False)',d:'easy'},{q:'用time库测量一段代码的执行时间',a:'import time; start=time.perf_counter(); 执行代码; elapsed=time.perf_counter()-start',d:'medium'}]},
'python-8-0': {explanation:'open(file, mode, encoding)打开文件。常用模式：\'r\'只读、\'w\'写入（覆盖）、\'a\'追加、\'b\'二进制、\'+\'读写。\\n\\n读取方法：f.read()全部、f.readline()一行、f.readlines()全部行为列表。直接遍历文件对象是最推荐的方式。\\n\\nwith open(...) as f: 上下文管理器自动关闭文件，即使异常也会关闭，是最佳实践。\\n\\n编码参数：文本模式建议指定encoding=\'utf-8\'避免跨平台编码问题。',problems:[{q:'用with语句打开文件并读取全部内容的代码',a:'with open(\'file.txt\',\'r\',encoding=\'utf-8\') as f:\\n    content=f.read()',d:'easy'},{q:'\'w\'和\'a\'模式的区别是什么？',a:'\'w\'覆盖写入（文件存在则清空），\'a\'追加写入（在文件末尾添加）。都不存在时会创建文件',d:'easy'},{q:'为什么要用with语句而不是手动f.close()？',a:'with是上下文管理器，即使代码抛出异常也会自动关闭文件，避免资源泄露。更安全简洁',d:'medium'}]},
'python-8-1': {explanation:'csv模块处理逗号分隔值文件：csv.reader()读取、csv.writer()写入。读得的每行是字符串列表。\\n\\njson模块处理JSON数据：json.dump(obj,fp)写入文件、json.load(fp)读取文件。\\njson.dumps(obj)对象转为JSON字符串，json.loads(str)JSON字符串转为Python对象。\\n\\nensure_ascii=False参数确保中文正常显示（否则转为\\uXXXX形式）。\\n\\n大文件处理：分块读取（指定chunk_size），避免一次性加载导致内存溢出。',problems:[{q:'如何将一个字典写入JSON文件？',a:'with open(\'data.json\',\'w\',encoding=\'utf-8\') as f:\\n    json.dump(dict_data,f,ensure_ascii=False,indent=2)',d:'easy'},{q:'csv.reader返回的每一行是什么类型？',a:'字符串列表（list of strings）。即使原数据是数字，读取后也是字符串，需手动转换',d:'medium'},{q:'如何读取一个10GB的大文件而不会内存溢出？',a:'分块读取：with open(\'big.txt\') as f:\\n    while chunk:=f.read(4096):\\n        处理chunk',d:'hard'}]},
'python-8-2': {explanation:'异常处理结构：try块放置可能出错的代码，except捕获特定异常并处理，else在try成功时执行，finally无论如何都执行（常用于清理资源）。\\n\\n常见异常：ValueError（值错误）、TypeError（类型错误）、IndexError（索引越界）、KeyError（键不存在）、ZeroDivisionError（除零）、FileNotFoundError（文件未找到）。\\n\\nraise关键字主动抛出异常；自定义异常需继承Exception类。\\n\\n易错点：except后不指定异常类型会捕获所有异常（包括系统退出），不推荐；异常处理有性能开销，不要用于正常流程控制。',problems:[{q:'try-except-finally中finally块什么时候不执行？',a:'几乎总是执行。除非解释器崩溃或进程被强制终止（kill -9）',d:'easy'},{q:'捕获所有可能的异常并打印错误信息的代码',a:'try:\\n    代码\\nexcept Exception as e:\\n    print(f\'错误: {e}\')',d:'easy'},{q:'raise和return的区别是什么？',a:'return正常返回函数值；raise是主动抛出异常，调用方需要用try-except捕获处理',d:'medium'}]},
'python-9-0': {explanation:'类是对象的蓝图，用class定义。__init__()是构造方法，创建对象时自动调用，用于初始化实例属性。\\n\\nself参数代表实例本身，是实例方法的第一个参数（Python自动传递，调用时不需显式传入）。\\n\\n实例属性属于每个对象独立拥有；类属性属于类本身，所有实例共享。\\n\\n__str__()方法定义对象的字符串表示，print()或str()时自动调用。\\n\\nPython支持动态添加属性（obj.new_attr=value），但不建议滥用。',problems:[{q:'__init__方法的作用是什么？',a:'构造方法，创建对象时自动调用，用于初始化实例属性',d:'easy'},{q:'class Dog: legs=4; d1=Dog(); d2=Dog(); d1.legs=3; print(d2.legs)输出什么？',a:'输出4。修改d1.legs创建了实例属性（不影响类属性和其他实例），d2仍使用类属性legs=4',d:'medium'},{q:'self参数需要手动传入吗？为什么？',a:'不需要。Python在调用实例方法时自动将实例对象作为第一个参数传入self',d:'medium'}]},
'python-9-1': {explanation:'继承：子类继承父类的属性和方法，使用class Child(Parent):语法。子类可重写父类方法（方法重写）。\\n\\nsuper()函数调用父类方法，常用于子类构造方法中初始化父类属性。\\n\\n多态：同一方法在不同子类中有不同实现，调用方不关心具体子类类型，只需对象有该方法即可（鸭子类型）。\\n\\n类型检查：isinstance(obj,Class)判断对象是否为某类的实例（含子类），issubclass(Child,Parent)判断继承关系。\\n\\nPython支持多重继承（class C(A,B):），方法解析顺序（MRO）为C3线性化算法。',problems:[{q:'class Dog(Animal): 中Dog和Animal的关系是什么？',a:'Dog是子类（派生类），Animal是父类（基类）。Dog继承Animal的所有属性和方法',d:'easy'},{q:'super().__init__()的作用是什么？',a:'调用父类的构造方法，确保父类属性被正确初始化。通常写在子类构造方法的第一行',d:'easy'},{q:'什么是鸭子类型（Duck Typing）？',a:'如果它走路像鸭子，叫声像鸭子，那它就是鸭子。Python不检查对象的类型，只关心对象是否有需要的方法',d:'hard'}]},
'python-9-2': {explanation:'魔术方法（双下划线方法）以__开头和结尾，用于定制Python对象的特定行为，解释器在特定操作时自动调用。\\n\\n__add__(self,other)定义+运算符行为；__mul__(self,n)定义*运算符；__len__(self)定义len()行为；__eq__(self,other)定义==行为；__getitem__(self,i)定义索引行为obj[i]。\\n\\n@property装饰器将方法转为属性访问：调用obj.x看似访问属性，实际执行getter方法；@x.setter定义赋值时的验证。\\n\\n实现__iter__和__next__可使对象支持for-in迭代。',problems:[{q:'哪两个魔术方法可以让你自定义的对象支持len()函数？',a:'__len__(self)方法。在类中定义后，len(obj)时会自动调用此方法',d:'easy'},{q:'@property装饰器的作用是什么？',a:'将方法伪装为属性。访问时像属性但实际执行方法，可以添加验证逻辑',d:'medium'},{q:'要实现v1+v2（两个向量相加），需要定义哪个魔术方法？',a:'__add__(self, other)方法。return Vector(self.x+other.x, self.y+other.y)',d:'medium'}]},
'python-10-0': {explanation:'网络爬虫是利用程序自动获取网页数据的技术。基本流程：发送HTTP请求→获取响应→解析HTML→提取数据→存储。\\n\\nrequests库：get(url)发送GET请求，response.text获取响应文本，raise_for_status()检查HTTP错误。\\n\\nBeautifulSoup库：BeautifulSoup(html,\'html.parser\')解析HTML，select()用CSS选择器查找元素，find()/find_all()用标签属性查找，.text/.get(\'attr\')获取内容和属性。\\n\\n反爬策略：设置User-Agent头伪装浏览器，添加请求间隔，使用代理IP。务必遵守robots.txt和网站使用条款。',problems:[{q:'requests.get(url)返回的对象的.text属性是什么？',a:'响应体的文本内容（HTML源码）',d:'easy'},{q:'用BeautifulSoup如何获取页面的标题标签内容？',a:'soup = BeautifulSoup(html,\'html.parser\'); title = soup.find(\'title\').text',d:'easy'},{q:'为什么爬虫要设置User-Agent头？',a:'许多网站会检查User-Agent来识别爬虫，如果使用默认的Python/requests UA会被拦截。设置常见的浏览器UA可以模拟正常访问',d:'medium'}]},
'python-10-1': {explanation:'pandas是Python数据分析的核心库。DataFrame是二维表格数据结构，支持类似SQL的操作。\\n\\npd.read_csv()读取CSV文件，df.describe()生成描述性统计（计数、均值、标准差、四分位数等）。\\n\\n数据清洗：df.dropna()删除缺失值、df.fillna()填充缺失值、df[col].astype()类型转换。\\n\\n数据透视：df.groupby()分组聚合、df.sort_values()排序、df[df[col]>value]条件筛选。\\n\\nmatplotlib是基础可视化库：plt.plot()折线图、plt.bar()柱状图、plt.scatter()散点图。',problems:[{q:'pd.read_csv(\'data.csv\')返回什么类型？',a:'DataFrame（二维表格数据结构）',d:'easy'},{q:'df.describe()会显示哪些统计量？',a:'计数(count)、均值(mean)、标准差(std)、最小值(min)、25%分位数、50%分位数(中位数)、75%分位数、最大值(max)',d:'easy'},{q:'如何从DataFrame中筛选出年龄大于18的所有行？',a:'df[df[\'age\'] > 18]',d:'medium'}]},
'python-10-2': {explanation:'综合项目实战是将Python基础语法、数据结构、函数、面向对象、文件处理等知识融会贯通的练习。\\n\\n典型项目结构：数据输入层（文件读取/网络请求）→ 数据处理层（清洗/分析/计算）→ 数据输出层（打印/写入文件/生成报告）。\\n\\n项目开发流程：需求分析→设计架构→编码实现→测试验证→优化改进。\\n\\n班级成绩管理系统是一个经典的综合项目：类封装数据结构，字典存储学生信息，列表管理集合，文件持久化数据，函数处理业务逻辑，异常处理保证健壮性。',problems:[{q:'综合项目中数据输入、处理、输出三层分别负责什么？',a:'输入层：获取原始数据（读文件/网络）；处理层：清洗/分析/计算；输出层：展示/存储结果',d:'easy'},{q:'解释class GradeManager中__init__方法的作用',a:'初始化学生列表self.students=[]，为后续添加学生成绩准备数据容器',d:'easy'},{q:'综合项目开发需要用到Python哪些知识？',a:'基础语法（变量/循环/条件）、数据结构（列表/字典）、函数（封装/参数）、面向对象（类/继承）、文件操作（读写）、异常处理（try/except）、标准库（json/datetime）',d:'hard'}]},

});



/* ═══════ 题库：从 kpDetails 中提取所有习题，集中管理 ═══════ */

const questionBank = {};  // { courseId: { chapterNum: [ {q,a,d,kpName,kpIdx} ... ] } }



(function buildQuestionBank() {

  for (const key in kpDetails) {

    const entry = kpDetails[key];

    if (!entry.problems || !entry.problems.length) continue;

    const parts = key.split('-');

    const courseId = parts[0];

    const chNum = parseInt(parts[1]);

    const kpIdx = parseInt(parts[2]);

    // 查找知识点名称

    let kpName = '';

    const ch = chaptersData.find(c => c.courseId === courseId && c.num === chNum);

    if (ch && ch.kps && ch.kps[kpIdx]) kpName = ch.kps[kpIdx].name;

    if (!questionBank[courseId]) questionBank[courseId] = {};

    if (!questionBank[courseId][chNum]) questionBank[courseId][chNum] = [];

    entry.problems.forEach(p => {

      questionBank[courseId][chNum].push({

        q: p.q, a: p.a, d: p.d, kpName: kpName, kpIdx: kpIdx

      });

    });

    // 从 kpDetails 中删除 problems 字段

    delete entry.problems;

  }

})();



/* ═══════ 题库统计辅助函数 ═══════ */

function getQuestionCount(courseId, chNum) {

  if (chNum !== undefined) {

    const ch = questionBank[courseId] && questionBank[courseId][chNum];

    return ch ? ch.length : 0;

  }

  let total = 0;

  if (questionBank[courseId]) {

    for (const ch in questionBank[courseId]) total += questionBank[courseId][ch].length;

  }

  return total;

}



function getCourseTotalQuestions(courseId) {

  return getQuestionCount(courseId);

}



/* ═══════ 题库页面渲染 ═══════ */

function renderQuestionBankPage() {

  const el = document.getElementById('page-questions');

  if (!el) return;



  let html = `

    <div class="page-header">

      <div>

        <h1 class="page-title">课程题库</h1>

        <p class="page-subtitle">集中练习 · 随机组卷 · 答题评分</p>

      </div>

    </div>

    <div id="qb-content"></div>

  `;

  el.innerHTML = html;

  renderQBCourseSelect();

}



function renderQBCourseSelect() {

  const el = document.getElementById('qb-content');

  if (!el) return;



  let cards = '';

  coursesData.filter(c => c.available).forEach(c => {

    const totalQ = getCourseTotalQuestions(c.id);

    const chapterCount = questionBank[c.id] ? Object.keys(questionBank[c.id]).length : 0;

    cards += `

      <div class="content-card tilt-3d qb-course-card" style="cursor:pointer" onclick="renderQBChapters('${c.id}')">

        <div style="display:flex;align-items:center;gap:16px">

          <div style="width:52px;height:52px;border-radius:14px;background:${c.gradient};display:flex;align-items:center;justify-content:center;font-size:1.3rem;font-weight:700;color:white;flex-shrink:0">

            ${c.name.charAt(0)}

          </div>

          <div style="flex:1">

            <h3 style="margin:0 0 4px;font-size:1.05rem">${c.name}</h3>

            <p style="margin:0;color:var(--text-muted);font-size:0.85rem">${c.version} · ${chapterCount} 章有题 · 共 ${totalQ} 题</p>

          </div>

          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="color:var(--text-muted)"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>

        </div>

      </div>

    `;

  });



  el.innerHTML = `

    <div style="display:grid;gap:12px;margin-top:8px">${cards}</div>

  `;

}



function renderQBChapters(courseId) {

  // 数据结构课程：去除章节分类，直接进入整体题库（查找 + 整体随机组卷）
  if (courseId === 'ds') { renderDSQuestionBank(); return; }

  const course = coursesData.find(c => c.id === courseId);

  if (!course) return;

  const el = document.getElementById('qb-content');



  const chapters = chaptersData.filter(c => c.courseId === courseId);

  const diffDist = { easy: 0, medium: 0, hard: 0 };



  let groupMap = {};

  chapters.forEach(ch => {

    const g = ch.vol || '章节';

    if (!groupMap[g]) groupMap[g] = [];

    groupMap[g].push(ch);

  });



  let groupHTML = '';

  for (const g in groupMap) {

    let label = g;

    if (courseId !== 'gaoshu') {

      if (g === '基础' || g === '基础阶段') label = '基础阶段';

      else if (g === '核心' || g === '核心模块') label = '核心模块';

      else if (g === '进阶' || g === '进阶提升') label = '进阶提升';

    }

    const chs = groupMap[g];

    let chCards = '';

    chs.forEach(ch => {

      const qCount = getQuestionCount(courseId, ch.num);

      if (qCount > 0) {

        const chQs = questionBank[courseId][ch.num] || [];

        chQs.forEach(q => { if (diffDist[q.d]) diffDist[q.d]++; });

      }

      chCards += `

        <div class="content-card tilt-3d" style="padding:16px 20px;cursor:${qCount > 0 ? 'pointer' : 'default'};opacity:${qCount > 0 ? '1' : '0.5'}" ${qCount > 0 ? `onclick="renderQBChapterDetail('${courseId}',${ch.num})"` : ''}>

          <div style="display:flex;align-items:center;gap:12px">

            <div style="width:40px;height:40px;border-radius:10px;background:${course.color}22;color:${course.color};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;flex-shrink:0">${ch.num}</div>

            <div style="flex:1">

              <span style="font-weight:600;font-size:0.95rem">第${ch.num}章 · ${ch.title}</span>

              <span style="margin-left:8px;font-size:0.8rem;color:var(--text-muted)">${qCount} 题</span>

            </div>

            ${qCount > 0 ? `<button class="btn btn-primary" style="padding:4px 12px;font-size:0.8rem" onclick="event.stopPropagation();startRandomTest('${courseId}',${ch.num})">随机组卷</button>` : ''}

          </div>

        </div>

      `;

    });

    groupHTML += `

      <div style="margin-bottom:20px">

        <div style="font-size:0.85rem;font-weight:600;color:var(--text-muted);margin-bottom:8px;padding-left:4px">${label}</div>

        <div style="display:grid;gap:8px">${chCards}</div>

      </div>

    `;

  }



  el.innerHTML = `

    <div style="margin-bottom:16px">

      <button class="view-back-btn" onclick="renderQBCourseSelect()" style="margin-bottom:12px">

        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>

        返回课程列表

      </button>

      <h2 style="margin:0;font-size:1.2rem">${course.name} · 题库</h2>

      <p style="margin:4px 0 0;color:var(--text-muted);font-size:0.85rem">

        共 ${getCourseTotalQuestions(courseId)} 题 ·

        <span style="color:#10b981">基础 ${diffDist.easy}</span> ·

        <span style="color:#f59e0b">中等 ${diffDist.medium}</span> ·

        <span style="color:#ef4444">挑战 ${diffDist.hard}</span>

      </p>

    </div>

    ${groupHTML}

  `;

}



function renderQBChapterDetail(courseId, chNum) {

  const course = coursesData.find(c => c.id === courseId);

  const ch = chaptersData.find(c => c.courseId === courseId && c.num === chNum);

  if (!ch) return;

  const el = document.getElementById('qb-content');

  const questions = (questionBank[courseId] && questionBank[courseId][chNum]) || [];



  const diffLabel = {easy:'基础',medium:'中等',hard:'挑战'};

  const diffColor = {easy:'#10b981',medium:'#f59e0b',hard:'#ef4444'};



  let qCards = questions.map((q,i) => `

    <div class="vp-card">

      <div class="vp-head">

        <span class="vp-num">${i+1}</span>

        <span class="vp-diff" style="color:${diffColor[q.d]};background:${diffColor[q.d]}15">${diffLabel[q.d]||q.d}</span>

        ${q.kpName ? `<span style="font-size:0.75rem;color:var(--text-muted);margin-left:auto">${q.kpName}</span>` : ''}

      </div>

      <div class="vp-q">${q.q.replace(/</g,'&lt;')}</div>

      <div class="vp-answer" id="qb-answer-${i}" style="display:none">${q.a.replace(/</g,'&lt;').replace(/\n/g,'<br>')}</div>

      <button class="vp-btn" onclick="toggleAnswer(this,'qb-answer-${i}')">查看答案</button>

    </div>

  `).join('');



  el.innerHTML = `

    <div style="margin-bottom:16px">

      <button class="view-back-btn" onclick="renderQBChapters('${courseId}')" style="margin-bottom:12px">

        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>

        返回章节列表

      </button>

      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">

        <h2 style="margin:0;font-size:1.2rem">第${chNum}章 · ${ch.title}</h2>

        <span style="font-size:0.85rem;color:var(--text-muted)">${questions.length} 题</span>

        <button class="btn btn-primary" style="margin-left:auto;padding:6px 16px;font-size:0.85rem" onclick="startRandomTest('${courseId}',${chNum})">

          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="margin-right:4px;vertical-align:-2px"><path d="M16 3h5v5M21 3l-7 7M8 21H3v-5M3 21l7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>

          随机组卷

        </button>

      </div>

    </div>

    <div class="viz-problems-list">${qCards}</div>

  `;

  setTimeout(function(){ renderMath(el); }, 80);

}



/* ═══════ 数据结构整体题库（去章节 / 按难度编号 / 查找 / 整体组卷） ═══════ */

function filterDSQuestions(kw) {
  kw = (kw || '').trim().toLowerCase();
  if (!kw) return dsQuestions.slice();
  // 精确题号：基础3 / 中档3 / 拔高3 / B-03 / h3 / M-3 等
  const m = kw.match(/^(基础|中档|拔高|[bmh])\s*0*(\d+)$/i);
  if (m) {
    const map = { '基础':'B','b':'B','B':'B','中档':'M','m':'M','M':'M','拔高':'H','h':'H','H':'H' };
    const prefix = map[m[1]] || 'B';
    const num = m[2].padStart(2, '0');
    return dsQuestions.filter(q => q.id === prefix + '-' + num);
  }
  return dsQuestions.filter(q => {
    if (q.id.toLowerCase().includes(kw)) return true;
    if (dsDiffLabel[q.d].includes(kw)) return true;
    if (q.d.startsWith(kw)) return true;
    if (q.kp.toLowerCase().includes(kw)) return true;
    if (q.q.toLowerCase().includes(kw)) return true;
    if (q.a.toLowerCase().includes(kw)) return true;
    return false;
  });
}

function renderDSQuestionBank() {
  const el = document.getElementById('qb-content');
  if (!el) return;

  // 重置查找状态
  state.dsQBkw = '';
  state.dsQBDiff = 'all';

  const total = dsQuestions.length;
  const cnt = { easy:0, medium:0, hard:0 };
  dsQuestions.forEach(q => { if (cnt[q.d] !== undefined) cnt[q.d]++; });

  el.innerHTML = `
    <div style="margin-bottom:16px">
      <button class="view-back-btn" onclick="renderQBCourseSelect()" style="margin-bottom:12px">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        返回课程列表
      </button>
      <h2 style="margin:0;font-size:1.2rem">数据结构与算法 · 题库</h2>
      <p style="margin:4px 0 0;color:var(--text-muted);font-size:0.85rem">
        共 ${total} 题（按难度编号）·
        <span style="color:#10b981">基础 ${cnt.easy}</span> ·
        <span style="color:#f59e0b">中档 ${cnt.medium}</span> ·
        <span style="color:#ef4444">拔高 ${cnt.hard}</span>
      </p>
    </div>

    <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:14px">
      <div style="position:relative;flex:1;min-width:240px">
        <input id="ds-qb-search" type="text" placeholder="查找：题号(B-03 / 拔高3)、知识点(图 / 哈希)、关键词…"
          oninput="state.dsQBkw=this.value;renderDSQuestionList()"
          style="width:100%;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:10px;padding:10px 14px 10px 38px;color:var(--text-primary);font-size:0.9rem;outline:none" />
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-muted)"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </div>
      <button class="btn btn-primary" style="padding:10px 18px;font-size:0.9rem" onclick="startRandomTest('ds','all')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="margin-right:4px;vertical-align:-2px"><path d="M16 3h5v5M21 3l-7 7M8 21H3v-5M3 21l7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        整体随机组卷
      </button>
    </div>

    <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">
      <span class="ds-diff-chip ${state.dsQBDiff==='all'?'active':''}" onclick="state.dsQBDiff='all';renderDSQuestionList()">全部</span>
      <span class="ds-diff-chip ${state.dsQBDiff==='easy'?'active':''}" onclick="state.dsQBDiff='easy';renderDSQuestionList()" style="color:#10b981">基础</span>
      <span class="ds-diff-chip ${state.dsQBDiff==='medium'?'active':''}" onclick="state.dsQBDiff='medium';renderDSQuestionList()" style="color:#f59e0b">中档</span>
      <span class="ds-diff-chip ${state.dsQBDiff==='hard'?'active':''}" onclick="state.dsQBDiff='hard';renderDSQuestionList()" style="color:#ef4444">拔高</span>
    </div>

    <div id="ds-qb-list"></div>
  `;

  renderDSQuestionList();
}

function renderDSQuestionList() {
  const listEl = document.getElementById('ds-qb-list');
  if (!listEl) return;
  const kw = state.dsQBkw || '';
  const diff = state.dsQBDiff || 'all';
  let arr = filterDSQuestions(kw);
  if (diff !== 'all') arr = arr.filter(q => q.d === diff);
  arr = arr.slice().sort((a,b) => a.id < b.id ? -1 : (a.id > b.id ? 1 : 0));

  if (arr.length === 0) {
    listEl.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted)">未找到匹配 “${kw.replace(/</g,'&lt;')}” 的题目</div>`;
    return;
  }

  const cards = arr.map(q => `
    <div class="vp-card">
      <div class="vp-head">
        <span class="vp-num">${q.id}</span>
        <span class="vp-diff" style="color:${dsDiffColor[q.d]};background:${dsDiffColor[q.d]}15">${dsDiffLabel[q.d]}</span>
        <span style="font-size:0.75rem;color:var(--text-muted);margin-left:auto">${q.kp}</span>
      </div>
      <div class="vp-q">${q.q.replace(/</g,'&lt;')}</div>
      ${q.a && q.a.trim() ? `<div class="ds-ans" id="ds-ans-${q.id}" style="display:none">${q.a.replace(/</g,'&lt;')}</div>
      <button class="vp-btn" onclick="toggleAnswer(this,'ds-ans-${q.id}')">查看答案</button>` : ''}
    </div>
  `).join('');

  listEl.innerHTML = `<div class="viz-problems-list">${cards}</div>`;
  setTimeout(function(){ renderMath(listEl); }, 80);
}

function qbTestBack(courseId, chNum) {
  if (courseId === 'ds' && chNum === 'all') { renderDSQuestionBank(); return; }
  renderQBChapterDetail(courseId, chNum);
}

/* ═══════ 随机组卷与答题 ═══════ */

function startRandomTest(courseId, chNum) {

  let allQs;
  if (courseId === 'ds' && chNum === 'all') {
    allQs = dsQuestions;
  } else {
    allQs = (questionBank[courseId] && questionBank[courseId][chNum]) || [];
  }
  if (allQs.length === 0) return;



  const course = coursesData.find(c => c.id === courseId);

  const ch = (courseId === 'ds' && chNum === 'all') ? null : chaptersData.find(c => c.courseId === courseId && c.num === chNum);

  const testCount = (courseId === 'ds' && chNum === 'all') ? Math.min(allQs.length, 10) : Math.min(allQs.length, 5);

  // 随机抽取

  const shuffled = [...allQs].sort(() => Math.random() - 0.5);

  const testQuestions = shuffled.slice(0, testCount);



  state.currentTest = {

    courseId, chNum, course, ch,

    questions: testQuestions,

    answers: new Array(testCount).fill(''),

    submitted: false

  };



  renderTestView();

}



function renderTestView() {

  const t = state.currentTest;

  if (!t) return;

  const el = document.getElementById('qb-content');



  const diffLabel = {easy:'基础',medium:'中等',hard:'挑战'};

  const diffColor = {easy:'#10b981',medium:'#f59e0b',hard:'#ef4444'};



  let qHTML = t.questions.map((q,i) => `

    <div class="content-card tilt-3d" style="padding:20px 24px">

      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">

        <span style="width:28px;height:28px;border-radius:8px;background:${t.course.color}22;color:${t.course.color};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem">${i+1}</span>

        <span class="vp-diff" style="color:${diffColor[q.d]};background:${diffColor[q.d]}15">${diffLabel[q.d]||q.d}</span>

        ${q.kpName || q.kp ? `<span style="font-size:0.75rem;color:var(--text-muted)">${q.kpName || q.kp}</span>` : ''}

      </div>

      <div style="font-size:0.95rem;line-height:1.7;margin-bottom:14px">${q.q.replace(/</g,'&lt;')}</div>

      <div style="position:relative">

        <textarea

          id="test-answer-${i}"

          class="test-answer-input"

          placeholder="在此输入你的答案..."

          rows="3"

          oninput="state.currentTest.answers[${i}]=this.value"

          ${t.submitted ? 'disabled' : ''}

          style="width:100%;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:10px;padding:10px 14px;color:var(--text-primary);font-size:0.9rem;font-family:inherit;resize:vertical;outline:none"

        >${t.answers[i] || ''}</textarea>

      </div>

      ${t.submitted ? `

        <div style="margin-top:12px;padding:12px 16px;border-radius:10px;background:rgba(255,255,255,0.03);border:1px solid var(--border)">

          <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:4px">参考答案</div>

          <div style="font-size:0.9rem;line-height:1.7;color:var(--text-secondary)">${q.a.replace(/</g,'&lt;').replace(/\n/g,'<br>')}</div>

        </div>

      ` : ''}

    </div>

  `).join('');



  el.innerHTML = `

    <div style="margin-bottom:16px">

      <button class="view-back-btn" onclick="qbTestBack('${t.courseId}','${t.chNum}')" style="margin-bottom:12px">

        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>

        返回题库

      </button>

      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">

        <h2 style="margin:0;font-size:1.2rem">${t.course.name} · ${t.chNum === 'all' ? '整体随机测试' : '第'+t.chNum+'章 随机测试'}</h2>

        <span style="font-size:0.85rem;color:var(--text-muted)">${t.questions.length} 题</span>

      </div>

    </div>

    <div style="display:grid;gap:12px">${qHTML}</div>

    ${!t.submitted ? `

      <div style="margin-top:20px;text-align:center">

        <button class="btn btn-primary" style="padding:10px 32px;font-size:0.95rem" onclick="submitTest()">

          提交答卷

        </button>

      </div>

    ` : `

      <div style="margin-top:20px;text-align:center">

        <button class="btn btn-primary" style="padding:10px 24px;font-size:0.9rem;margin-right:8px" onclick="startRandomTest('${t.courseId}',${t.chNum})">

          重新组卷

        </button>

        <button class="btn btn-outline" style="padding:10px 24px;font-size:0.9rem" onclick="qbTestBack('${t.courseId}','${t.chNum}')">

          返回题库

        </button>

      </div>

    `}

  `;

  setTimeout(function(){ renderMath(el); }, 80);

}



function submitTest() {

  const t = state.currentTest;

  if (!t) return;

  t.submitted = true;



  // 简单评分：有答案即给分，按难度加权

  let answered = 0;

  let score = 0;

  const diffScore = { easy: 60, medium: 80, hard: 100 };

  const diffLabel = {easy:'基础',medium:'中等',hard:'挑战'};



  t.questions.forEach((q,i) => {

    const ans = (t.answers[i] || '').trim();

    if (ans.length > 0) {

      answered++;

      score += diffScore[q.d] || 70;

    }

  });



  const totalPossible = t.questions.reduce((s,q) => s + (diffScore[q.d]||70), 0);

  const finalScore = totalPossible > 0 ? Math.round(score / totalPossible * 100) : 0;



  // 弹出成绩

  const el = document.getElementById('qb-content');

  const grade = finalScore >= 90 ? '优秀' : finalScore >= 75 ? '良好' : finalScore >= 60 ? '及格' : '需努力';

  const gradeColor = finalScore >= 90 ? '#10b981' : finalScore >= 75 ? '#0ea5e9' : finalScore >= 60 ? '#f59e0b' : '#ef4444';



  const resultHTML = `

    <div style="text-align:center;padding:32px 20px">

      <div style="font-size:3rem;font-weight:800;color:${gradeColor};line-height:1">${finalScore}</div>

      <div style="font-size:0.9rem;color:var(--text-muted);margin-top:4px">总分 100</div>

      <div style="margin-top:12px;display:inline-block;padding:6px 20px;border-radius:20px;background:${gradeColor}22;color:${gradeColor};font-weight:600;font-size:1rem">${grade}</div>

      <div style="margin-top:16px;color:var(--text-muted);font-size:0.88rem">

        答题 ${answered}/${t.questions.length} · 每题作答后可查看参考答案

      </div>

    </div>

  `;



  renderTestView();

  // 在测试视图前插入成绩卡片

  const testView = el.querySelector('.content-card');

  if (testView) {

    testView.insertAdjacentHTML('beforebegin', `

      <div class="content-card tilt-3d" style="margin-bottom:16px;padding:0;overflow:hidden">

        ${resultHTML}

      </div>

    `);

  }

}



/* ═══════ LaTeX 公式对照表 (chNum-kpIndex → formula) ═══════ */

const kpFormulas = {

  // 第1章 函数与极限

  "1-0": "f: X \\to Y,\\quad y=f(x)",

  "1-1": "\\lim_{n \\to \\infty} x_n = a",

  "1-2": "\\lim_{x \\to x_0} f(x) = L",

  "1-3": "\\lim_{x \\to 0} \\alpha(x) = 0",

  "1-4": "\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1,\\; \\lim_{n \\to \\infty} \\left(1+\\frac{1}{n}\\right)^n = e",

  "1-5": "\\lim_{x \\to x_0} f(x) = f(x_0)",

  "1-6": "f \\in C[a,b] \\;\\Rightarrow\\; \\forall\\, y_0\\in[m,M],\\; \\exists\\xi\\in[a,b],\\; f(\\xi)=y_0",

  // 第2章 导数与微分

  "2-0": "f'(x_0) = \\lim_{\\Delta x \\to 0} \\frac{f(x_0+\\Delta x)-f(x_0)}{\\Delta x}",

  "2-1": "(uv)' = u'v + uv',\\quad \\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}",

  "2-2": "f^{(n)}(x) = \\frac{d^n f}{dx^n}",

  "2-3": "\\frac{dy}{dx} = -\\frac{F_x}{F_y}",

  "2-4": "dy = f'(x)dx",

  // 第3章 微分中值定理

  "3-0": "\\exists\\xi\\in(a,b),\\; f'(\\xi) = \\frac{f(b)-f(a)}{b-a}",

  "3-1": "\\lim \\frac{f(x)}{g(x)} = \\lim \\frac{f'(x)}{g'(x)}",

  "3-2": "f(x) = f(x_0) + f'(x_0)(x-x_0) + \\frac{f''(x_0)}{2!}(x-x_0)^2 + \\cdots",

  "3-3": "f'(x) > 0 \\Rightarrow \\text{增},\\; f''(x) > 0 \\Rightarrow \\text{凹}",

  "3-4": "f'(x_0)=0,\\; f''(x_0) \\neq 0 \\Rightarrow \\text{极值}",

  "3-5": "K = \\frac{|y''|}{(1+y'^2)^{3/2}},\\; \\rho = \\frac{1}{K}",

  // 第4章 不定积分

  "4-0": "\\int f(x)dx = F(x) + C",

  "4-1": "\\int f(\\varphi(x))\\varphi'(x)dx = \\int f(u)du",

  "4-2": "\\int u\\,dv = uv - \\int v\\,du",

  "4-3": "\\int \\frac{P(x)}{Q(x)}dx \\;\\text{部分分式分解}",

  "4-4": "\\int R(\\sin x, \\cos x)dx",

  // 第5章 定积分

  "5-0": "\\int_a^b f(x)dx = \\lim_{\\lambda \\to 0} \\sum_{i=1}^n f(\\xi_i)\\Delta x_i",

  "5-1": "\\int_a^b f(x)dx = F(b) - F(a)",

  "5-2": "\\int_a^b f(x)dx = \\int_\\alpha^\\beta f(\\varphi(t))\\varphi'(t)dt",

  "5-3": "\\int_a^{+\\infty} f(x)dx = \\lim_{b \\to +\\infty} \\int_a^b f(x)dx",

  "5-4": "\\Gamma(s) = \\int_0^{+\\infty} x^{s-1}e^{-x}dx",

  // 第6章 定积分的应用

  "6-0": "U = \\int_a^b dU",

  "6-1": "V = \\pi\\int_a^b [f(x)]^2 dx,\\; S = \\int_a^b 2\\pi f(x)\\sqrt{1+f'^2}dx",

  "6-2": "W = \\int_a^b F(x)dx",

  // 第7章 微分方程

  "7-0": "F(x, y, y', \\ldots, y^{(n)}) = 0",

  "7-1": "\\frac{dy}{dx} = g(x)h(y)",

  "7-2": "\\frac{dy}{dx} = \\varphi\\left(\\frac{y}{x}\\right)",

  "7-3": "y' + P(x)y = Q(x),\\; y = e^{-\\int Pdx}\\left(\\int Q e^{\\int Pdx}dx + C\\right)",

  "7-4": "y'' = f(x),\\; y'' = f(x,y'),\\; y'' = f(y,y')",

  "7-5": "y^{(n)} + p_1 y^{(n-1)} + \\cdots + p_n y = 0",

  "7-6": "\\lambda^n + p_1\\lambda^{n-1} + \\cdots + p_n = 0",

  // 第8章 向量与空间解析几何

  "8-0": "\\vec{a} + \\vec{b} = (a_x+b_x, a_y+b_y, a_z+b_z)",

  "8-1": "\\vec{a} \\cdot \\vec{b} = |a||b|\\cos\\theta,\\; \\vec{a} \\times \\vec{b}",

  "8-2": "F(x, y, z) = 0",

  "8-3": "\\vec{r}(t) = (x(t), y(t), z(t))",

  "8-4": "Ax + By + Cz + D = 0",

  "8-5": "\\frac{x-x_0}{m} = \\frac{y-y_0}{n} = \\frac{z-z_0}{p}",

  // 第9章 多元函数微分

  "9-0": "z = f(x, y)",

  "9-1": "\\frac{\\partial z}{\\partial x} = \\lim_{\\Delta x \\to 0} \\frac{f(x+\\Delta x, y)-f(x,y)}{\\Delta x}",

  "9-2": "dz = \\frac{\\partial z}{\\partial x}dx + \\frac{\\partial z}{\\partial y}dy",

  "9-3": "\\frac{\\partial z}{\\partial x} = \\frac{\\partial f}{\\partial u}\\frac{\\partial u}{\\partial x} + \\frac{\\partial f}{\\partial v}\\frac{\\partial v}{\\partial x}",

  "9-4": "\\frac{dy}{dx} = -\\frac{F_x}{F_y}",

  "9-5": "\\frac{x-x_0}{F_x} = \\frac{y-y_0}{F_y} = \\frac{z-z_0}{F_z}",

  "9-6": "\\frac{\\partial f}{\\partial \\vec{l}} = \\nabla f \\cdot \\vec{u}",

  "9-7": "H = f_{xx}f_{yy} - f_{xy}^2,\\; H>0:\\text{极值},\\; H<0:\\text{非极值}",

  // 第10章 重积分

  "10-0": "\\iint_D f(x,y)\\,d\\sigma",

  "10-1": "\\iint_D f(x,y)dxdy = \\int_a^b dx \\int_{y_1(x)}^{y_2(x)} f(x,y)dy",

  "10-2": "\\iiint_\\Omega f(x,y,z)\\,dV",

  "10-3": "\\iint_D f(x,y)\\,d\\sigma \\text{ (体积/面积/质心)}",

  // 第11章 曲线与曲面积分

  "11-0": "\\int_L f(x,y)\\,ds",

  "11-1": "\\int_L Pdx + Qdy",

  "11-2": "\\oint_L Pdx+Qdy = \\iint_D\\left(\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}\\right)dxdy",

  "11-3": "\\iint_\\Sigma f(x,y,z)\\,dS",

  "11-4": "\\iint_\\Sigma P\\,dydz + Q\\,dzdx + R\\,dxdy",

  "11-5": "\\iiint_\\Omega (\\frac{\\partial P}{\\partial x}+\\frac{\\partial Q}{\\partial y}+\\frac{\\partial R}{\\partial z})dV = \\oiint_\\Sigma Pdydz+Qdzdx+Rdxdy",

  // 第12章 级数

  "12-0": "\\sum_{n=1}^{\\infty} u_n,\\quad S_n = \\sum_{k=1}^n u_k",

  "12-1": "\\lim_{n\\to\\infty} \\frac{u_{n+1}}{u_n} = \\rho \\;\\begin{cases}<1 & \\text{收敛} \\\\ >1 & \\text{发散} \\\\ =1 & \\text{不确定}\\end{cases}",

  "12-2": "\\sum_{n=1}^{\\infty} (-1)^{n-1} u_n,\\; u_n \\to 0,\\; u_n \\searrow \\;\\Rightarrow\\; \\text{收敛}",

  "12-3": "\\sum_{n=0}^{\\infty} a_n (x-x_0)^n,\\; R = \\lim \\left|\\frac{a_n}{a_{n+1}}\\right|",

  "12-4": "f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(x_0)}{n!}(x-x_0)^n",

  "12-5": "f(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty}(a_n\\cos nx + b_n\\sin nx)",

  /* ═══ 概率论公式 ═══ */

  // 第1章 概率论的基本概念

  "p1-0": "S = \\{\\text{所有可能结果}\\},\\; A \\subset S",

  "p1-1": "A \\cup B,\\; A \\cap B,\\; \\bar{A},\\; A - B",

  "p1-2": "P(A) = \\frac{m}{n},\\; 0 \\le P(A) \\le 1",

  "p1-3": "P(A) = \\frac{\\text{有利事件数}}{\\text{样本点总数}}",

  "p1-4": "P(A|B) = \\frac{P(AB)}{P(B)},\\; P(A) = \\sum_{i} P(B_i)P(A|B_i)",

  "p1-5": "P(AB) = P(A)P(B),\\; P(A|B) = P(A)",

  // 第2章 随机变量及其分布

  "p2-0": "X: S \\to \\mathbb{R}",

  "p2-1": "P(X=x_k) = p_k,\\; \\sum p_k = 1",

  "p2-2": "F(x) = P(X \\le x),\\; F(-\\infty)=0,\\; F(+\\infty)=1",

  "p2-3": "f(x) = F'(x),\\; P(a<X<b) = \\int_a^b f(x)dx",

  "p2-4": "Y = g(X),\\; F_Y(y) = P(g(X) \\le y)",

  // 第3章 多维随机变量

  "p3-0": "F(x,y) = P(X \\le x, Y \\le y)",

  "p3-1": "F_X(x) = F(x, +\\infty),\\; F_Y(y) = F(+\\infty, y)",

  "p3-2": "f(x|y) = \\frac{f(x,y)}{f_Y(y)}",

  "p3-3": "F(x,y) = F_X(x) \\cdot F_Y(y)",

  "p3-4": "P(Z \\le z) = P(g(X,Y) \\le z)",

  // 第4章 数字特征

  "p4-0": "E(X) = \\sum x_k p_k = \\int_{-\\infty}^{+\\infty} xf(x)dx",

  "p4-1": "D(X) = E(X^2) - [E(X)]^2",

  "p4-2": "\\rho = \\frac{Cov(X,Y)}{\\sqrt{D(X)D(Y)}}",

  "p4-3": "\\mu_k = E(X^k),\\; C = (c_{ij})_{n \\times n}",

  // 第5章 大数定律及中心极限定理

  "p5-0": "\\frac{1}{n}\\sum_{i=1}^n X_i \\xrightarrow{P} \\mu",

  "p5-1": "\\frac{\\sum X_i - n\\mu}{\\sigma\\sqrt{n}} \\xrightarrow{d} N(0,1)",

  // 第6章 样本及抽样分布

  "p6-0": "X_1, X_2, \\ldots, X_n \\sim F,\\; \\bar{X}, S^2",

  "p6-1": "\\chi^2 = \\sum_{i=1}^n Z_i^2,\\; T = \\frac{Z}{\\sqrt{V/n}},\\; F = \\frac{U/m}{V/n}",

  "p6-2": "\\bar{X} \\sim N(\\mu, \\sigma^2/n),\\; \\frac{(n-1)S^2}{\\sigma^2} \\sim \\chi^2(n-1)",

  // 第7章 参数估计

  "p7-0": "\\hat{\\theta}_{\\text{矩}},\\; \\hat{\\theta}_{\\text{MLE}} = \\arg\\max L(\\theta)",

  "p7-1": "E(\\hat{\\theta}) = \\theta,\\; D(\\hat{\\theta}_1) \\le D(\\hat{\\theta}_2)",

  "p7-2": "P(\\hat{\\theta}_1 < \\theta < \\hat{\\theta}_2) = 1 - \\alpha",

  "p7-3": "P(\\theta > \\hat{\\theta}_L) = 1 - \\alpha",

  // 第8章 假设检验

  "p8-0": "H_0: \\theta = \\theta_0,\\; H_1: \\theta \\neq \\theta_0",

  "p8-1": "\\frac{\\bar{X} - \\mu_0}{\\sigma/\\sqrt{n}} \\sim Z,\\; \\frac{\\bar{X} - \\mu_0}{S/\\sqrt{n}} \\sim t",

  "p8-2": "\\frac{(n-1)S^2}{\\sigma_0^2} \\sim \\chi^2,\\; \\frac{S_1^2}{S_2^2} \\sim F",

  "p8-3": "\\chi^2 = \\sum \\frac{(f_i - np_i)^2}{np_i}",

  // 第9章 方差分析及回归分析

  "p9-0": "F = \\frac{MS_A}{MS_E},\\; S_T = S_A + S_E",

  "p9-1": "S_T = S_A + S_B + S_{AB} + S_E",

  "p9-2": "\\hat{y} = \\hat{a} + \\hat{b}x,\\; \\hat{b} = \\frac{\\sum(x_i-\\bar{x})(y_i-\\bar{y})}{\\sum(x_i-\\bar{x})^2}",

  "p9-3": "Y = \\beta_0 + \\beta_1 X_1 + \\cdots + \\beta_k X_k + \\epsilon",

  "la-1-0": "\\begin{vmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{vmatrix} = a_{11}a_{22} - a_{12}a_{21}",
  "la-1-1": "\\tau(p_1p_2\\cdots p_n) = t \\;\\text{(逆序数)}",
  "la-1-2": "D = \\sum_{p_1\\cdots p_n} (-1)^{\\tau(p_1\\cdots p_n)} a_{1p_1}a_{2p_2}\\cdots a_{np_n}",
  "la-1-3": "D = D^{\\mathsf{T}},\\; \\text{互换两行} \\Rightarrow -D",
  "la-1-4": "D = \\sum_{j=1}^n a_{ij}A_{ij} \\;\\text{(按第}i\\text{行展开)}",
  "la-1-5": "x_i = \\frac{D_i}{D},\\; D \\neq 0",
  "la-2-0": "A = (a_{ij})_{m \\times n}",
  "la-2-1": "A + B = (a_{ij} + b_{ij}),\\; kA = (k a_{ij})",
  "la-2-2": "C_{ij} = \\sum_{k=1}^n a_{ik}b_{kj} \\;\\text{(左行右列)}",
  "la-2-3": "(AB)^{\\mathsf{T}} = B^{\\mathsf{T}} A^{\\mathsf{T}}",
  "la-2-4": "|AB| = |A||B|",
  "la-2-5": "A^{-1} = \\frac{1}{|A|} A^*",
  "la-2-6": "A = \\begin{bmatrix} A_{11} & A_{12} \\\\ A_{21} & A_{22} \\end{bmatrix}",
  "la-3-0": "A \\xrightarrow{\\text{初等行变换}} U \\;\\text{(行阶梯形)}",
  "la-3-1": "E(i,j),\\; E(i(k)),\\; E(ij(k))",
  "la-3-2": "r(A) = \\text{非零子式最高阶数}",
  "la-3-3": "r(A) = r(A,b) \\Leftrightarrow \\text{有解}",
  "la-3-4": "\\begin{cases} a_{11}x_1 + \\cdots + a_{1n}x_n = b_1 \\\\ \\vdots \\\\ a_{m1}x_1 + \\cdots + a_{mn}x_n = b_m \\end{cases}",
  "la-4-0": "\\beta = k_1\\alpha_1 + \\cdots + k_m\\alpha_m",
  "la-4-1": "k_1\\alpha_1 + \\cdots + k_m\\alpha_m = 0 \\Rightarrow k_1=\\cdots=k_m=0",
  "la-4-2": "\\text{rank}\\{\\alpha_1,\\ldots,\\alpha_m\\} = r(A)",
  "la-4-3": "Ax = 0 \\;\\text{有基础解系:}\\; \\xi_1,\\ldots,\\xi_{n-r}",
  "la-4-4": "V = \\{k_1\\alpha_1 + \\cdots + k_r\\alpha_r\\}",
  "la-5-0": "(\\alpha,\\beta) = a_1b_1 + \\cdots + a_n b_n",
  "la-5-1": "A\\xi = \\lambda\\xi,\\quad |\\lambda I - A| = 0",
  "la-5-2": "P^{-1}AP = B",
  "la-5-3": "A = A^{\\mathsf{T}} \\Rightarrow \\exists Q\\;(Q^{\\mathsf{T}}AQ = \\Lambda)",
  "la-5-4": "f = x^{\\mathsf{T}}Ax = a_{11}x_1^2 + 2a_{12}x_1x_2 + \\cdots",
  "la-5-5": "f \\xrightarrow{\\text{配方法}} d_1y_1^2 + d_2y_2^2 + \\cdots + d_ny_n^2",
  "la-5-6": "\\forall x \\neq 0,\\; f(x) > 0 \\Leftrightarrow \\text{顺序主子式} > 0",
  "la-6-0": "V \\;\\text{满足八条公理}\\; \\Rightarrow \\;\\text{线性空间}",
  "la-6-1": "\\dim V = r,\\; \\mathcal{B} = \\{\\varepsilon_1,\\ldots,\\varepsilon_r\\}",
  "la-6-2": "(\\beta_1,\\ldots,\\beta_n) = (\\alpha_1,\\ldots,\\alpha_n)P",
  "la-6-3": "T(\\alpha+\\beta) = T(\\alpha)+T(\\beta),\\; T(k\\alpha)=kT(\\alpha)",
  "la-6-4": "T(\\alpha_1,\\ldots,\\alpha_n) = (\\alpha_1,\\ldots,\\alpha_n)A"};



function toggleAnswer(btn, elementId) {

  const el = document.getElementById(elementId);

  if (!el) return;

  const show = el.style.display === 'none';

  el.style.display = show ? 'block' : 'none';

  btn.textContent = show ? '收起答案' : '查看答案';

  btn.classList.toggle('active', show);

}



// 跳转到对应章节的题库

function goToChapterQB(courseId, chNum) {

  navigate('questions');

  if (courseId === 'ds') {
    setTimeout(renderDSQuestionBank, 100);
    return;
  }

  setTimeout(function() {

    renderQBChapters(courseId);

    setTimeout(function() {

      renderQBChapterDetail(courseId, chNum);

    }, 100);

  }, 200);

}



function switchVizTab(tab, btn) {

  const tabs = btn.parentElement.querySelectorAll('.viz-tab');

  tabs.forEach(t => t.classList.remove('active'));

  btn.classList.add('active');

  const content = document.getElementById('viz-tab-content');

  if (!content) return;

  const ch = state.currentChapter;

  const kp = state.currentKP;

  if (!ch || !kp) return;

  const kpIdx = ch.kps.indexOf(kp);

  const detail = getKPDetail(ch.courseId, ch.num, kpIdx);



  if (tab === 'detail') {

    const text = detail ? detail.explanation : '暂无详细讲解，后续持续更新中。';

    const html = text.replace(/\n/g, '<br>');

    content.innerHTML = '<div class="viz-detail-content"><div class="viz-detail-body">' + html + '</div></div>';

    setTimeout(function(){ renderMath(content); }, 80);

  }

  if (tab === 'practice') {

    goToChapterQB(ch.courseId, ch.num);

  }

}



// 辅助函数：绘制填充区域

VizEngine.drawFilledRegion = function(xMin,xMax,yMin,yMax, rxMin,rxMax,ryMin,ryMax,color) {

  const ctx = this.ctx;

  const [sx1, sy1] = this.toScreen(xMin, yMin, rxMin,rxMax,ryMin,ryMax);

  const [sx2, sy2] = this.toScreen(xMax, yMax, rxMin,rxMax,ryMin,ryMax);

  ctx.fillStyle = color;

  ctx.fillRect(sx1, sy2, sx2-sx1, sy1-sy2);

};



/* ═══════ 视图渲染函数 ═══════ */



function showCourseSelectView() {

  state.courseView = 'select';

  document.querySelectorAll('.course-view').forEach(v => v.classList.remove('active'));

  document.getElementById('courses-select-view').classList.add('active');

  const el = document.getElementById('courses-select-view');

  el.innerHTML = `

    <div class="page-header">

      <div>

        <h1 class="page-title">课程中心</h1>

        <p class="page-subtitle">选择课程，开始系统化学习</p>

      </div>

    </div>

    <div class="course-select-grid">

      ${coursesData.map(c => `

        <div class="course-select-card ${c.available ? '' : 'locked-card'}" onclick="${c.available ? `openCourse('${c.id}')` : ''}">

          <div class="csc-cover" style="background:${c.gradient}">

            <span class="csc-cover-text">${c.name.substring(0,2)}</span>

            <span class="csc-badge">${c.badge}</span>

          </div>

          <div class="csc-body">

            <h3>${c.name}</h3>

            <p>${c.desc}</p>

            <div class="csc-meta">

              ${c.available ? `<span>${c.chapters} 章</span><span>·</span><span>约 ${c.hours} 小时</span>` : '<span style="color:var(--text-muted)">敬请期待</span>'}

              <span class="tag tag-purple">${c.available ? '可选' : '即将'}</span>

            </div>

          </div>

        </div>

      `).join('')}

    </div>`;

}



function openCourse(courseId) {

  const course = coursesData.find(c => c.id === courseId);

  if (!course) return;

  state.currentCourse = course;

  state.courseView = 'chapters';

  document.querySelectorAll('.course-view').forEach(v => v.classList.remove('active'));

  document.getElementById('chapters-view').classList.add('active');

  renderChaptersView();

}



function renderChaptersView() {

  const el = document.getElementById('chapters-view');

  const cid = state.currentCourse.id;

  const courseChapters = chaptersData.filter(c => c.courseId === cid);



  // 高数特殊：分上下册；概率论分概率论/数理统计；其他课程按 vol 分组

  let bodyHtml = '';

  if (cid === 'gaoshu') {

    const vol1 = courseChapters.filter(c => c.vol === '上册');

    const vol2 = courseChapters.filter(c => c.vol === '下册');

    bodyHtml = `

    <div class="chapters-volume">

      <div class="chapters-volume-title">

        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" stroke-width="1.8"/></svg>

        上册 · 微积分基础

      </div>

      <div class="chapters-grid">

        ${vol1.map(ch => renderChapterCard(ch)).join('')}

      </div>

    </div>

    <div class="chapters-volume" style="margin-top:32px">

      <div class="chapters-volume-title">

        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" stroke-width="1.8"/></svg>

        下册 · 多元与级数

      </div>

      <div class="chapters-grid">

        ${vol2.map(ch => renderChapterCard(ch)).join('')}

      </div>

    </div>`;

  } else if (cid === 'prob') {

    const probPart = courseChapters.filter(c => c.vol === '概率论');

    const statPart = courseChapters.filter(c => c.vol === '数理统计');

    bodyHtml = `

    <div class="chapters-volume">

      <div class="chapters-volume-title">

        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" stroke-width="1.8"/></svg>

        概率论 · 随机性与分布理论

      </div>

      <div class="chapters-grid">

        ${probPart.map(ch => renderChapterCard(ch)).join('')}

      </div>

    </div>

    <div class="chapters-volume" style="margin-top:32px">

      <div class="chapters-volume-title">

        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" stroke-width="1.8"/></svg>

        数理统计 · 推断与决策方法

      </div>

      <div class="chapters-grid">

        ${statPart.map(ch => renderChapterCard(ch)).join('')}

      </div>

    </div>`;

  } else {

    // 按 vol 分组（基础/核心/进阶）

    const volGroups = [...new Set(courseChapters.map(c => c.vol))];

    const volLabels = { '基础':'基础阶段', '核心':'核心模块', '进阶':'进阶提升' };

    bodyHtml = volGroups.map(vol => `

    <div class="chapters-volume" style="margin-top:24px">

      <div class="chapters-volume-title">

        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" stroke-width="1.8"/></svg>

        ${vol} · ${volLabels[vol] || vol}

      </div>

      <div class="chapters-grid">

        ${courseChapters.filter(c => c.vol === vol).map(ch => renderChapterCard(ch)).join('')}

      </div>

    </div>`).join('');

  }



  const versionStr = state.currentCourse.version ? `（${state.currentCourse.version}）` : '';

  const courseProg = countStudiedInCourse(cid);
  const coursePct = courseProg.total ? Math.round(courseProg.done / courseProg.total * 100) : 0;

  el.innerHTML = `

    <div class="view-back-bar">

      <button class="view-back-btn" onclick="showCourseSelectView()">

        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>

        返回选课

      </button>

      <span class="view-back-title">${state.currentCourse.name}${versionStr}</span>

      ${(cid === 'clang' || cid === 'cpp') ? `<button class="btn btn-primary" style="margin-left:auto;font-size:0.82rem;padding:0.5rem 1rem" onclick="navigate('lab');setTimeout(()=>openCodingLab(),100)">🧠 打开内存练习</button>` : ''}

    </div>

      <div class="course-progress-summary">
        <div class="cps-info">
          <span class="cps-label">整体学习进度</span>
          <span class="cps-count">已学 ${courseProg.done} / ${courseProg.total} 个知识点</span>
        </div>
        <div class="cps-bar"><div class="cps-fill" style="width:${coursePct}%"></div></div>
        <span class="cps-pct">${coursePct}%</span>
      </div>

      ${cid === 'la' ? `<button class="btn btn-primary" style="margin-left:auto;font-size:0.82rem;padding:0.5rem 1.2rem;background:linear-gradient(135deg,#6366f1,#8b5cf6)" onclick="openQuizModal()">📝 测验</button>` : ''}
    ${bodyHtml}`;



  // render chapter cover canvases

  setTimeout(() => {

    courseChapters.forEach(ch => {

      const canvas = document.getElementById('ch-canvas-' + ch.courseId + '-' + ch.num);

      if (canvas) drawChapterCover(canvas, ch);

    });

  }, 50);

}



function renderChapterCard(ch) {

  const courseColors = {

    clang: ['#0ea5e9','#38bdf8','#0284c7','#7dd3fc','#bae6fd','#e0f2fe','#0369a1','#075985','#0c4a6e','#082f49'],

    cpp:   ['#8b5cf6','#a78bfa','#7c3aed','#c4b5fd','#ddd6fe','#ede9fe','#6d28d9','#5b21b6','#4c1d95','#3b0764','#2e1065','#1e1b4b'],

    prob:  ['#ec4899','#8b5cf6','#6366f1','#0ea5e9','#f59e0b','#10b981','#ef4444','#06b6d4','#14b8a6'],

  };

  const colors = courseColors[ch.courseId] || [];

  const probColorKey = 'p' + ch.num;

  const color = colors[(ch.num - 1) % colors.length] || chapterColors[probColorKey] || chapterColors[ch.num] || '#6366f1';

  const canvasId = 'ch-canvas-' + (ch.courseId || 'gaoshu') + '-' + ch.num;

  const totalKp = ch.kps ? ch.kps.length : 0;

  const doneKp = countStudiedInChapter(ch);

  const progress = totalKp ? Math.round(doneKp / totalKp * 100) : 0;

  const progressTag = progress === 100

    ? '<span class="cc-meta-tag done">已完成</span>'

    : progress > 0

      ? '<span class="cc-meta-tag progress">已学 ' + progress + '%</span>'

      : '<span class="cc-meta-tag locked">未开始</span>';

  return `

    <div class="chapter-card course-${ch.courseId || 'gaoshu'}" onclick="openChapterView(${ch.num}, '${ch.courseId || 'gaoshu'}')">

      <div class="cc-cover" style="${ch.courseId==='python'?'background:linear-gradient(135deg,#3776AB 0%,#3776AB 55%,#FFD43B 100%)':'background:linear-gradient(135deg,${color},${color}cc)'}">

        <canvas id="${canvasId}"></canvas>

        <span class="cc-num">${ch.courseId==='python'?'>>> ':''}${String(ch.num).padStart(2,'0')} ${ch.title}</span>

        <div class="cc-progress"><div class="cc-progress-fill" style="width:${progress}%"></div></div>

      </div>

      <div class="cc-body">

        <h3>${ch.title}</h3>

        <p>${ch.kps.slice(0,3).map(k=>k.name).join('、')}${ch.kps.length > 3 ? '...' : ''}</p>

        <div class="cc-meta">

          <span>${ch.kps.length} 个知识点</span>

          ${progressTag}

        </div>

      </div>

    </div>`;

}



function drawChapterCover(canvas, ch) {

  const ctx = canvas.getContext('2d');

  const dpr = window.devicePixelRatio || 1;

  const w = canvas.parentElement.offsetWidth;

  const h = canvas.parentElement.offsetHeight;

  canvas.width = w * dpr;

  canvas.height = h * dpr;

  canvas.style.width = w + 'px';

  canvas.style.height = h + 'px';

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);



  
  // Python: custom geometric patterns
  if (ch.courseId === "python") { drawPythonCover(ctx, w, h, ch.num); return; }

const pad = 30;

  const gw = w - 2 * pad;

  const gh = h - 2 * pad;

  const cx = w / 2, cy = h / 2;



  ctx.strokeStyle = 'rgba(255,255,255,0.12)';

  ctx.lineWidth = 1.5;



  if (ch.num === 1) {

    // converging dots

    for (let i = 0; i < 12; i++) {

      const t = i / 11;

      const x = pad + gw * t;

      const y = cy - 20 * Math.sin(t * 4) * (1 - t * 0.6);

      const r = 2 + t * 3;

      ctx.fillStyle = `rgba(255,255,255,${0.15 + t * 0.5})`;

      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();

    }

    // limit line

    ctx.setLineDash([4,3]); ctx.strokeStyle = 'rgba(255,255,255,0.3)';

    ctx.beginPath(); ctx.moveTo(pad + gw, cy - 5); ctx.lineTo(pad + gw, cy + 15); ctx.stroke();

    ctx.setLineDash([]);

    ctx.font = '12px Inter'; ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.textAlign = 'center';

    ctx.fillText('L', pad + gw + 10, cy + 8);

  } else if (ch.num === 2) {

    // tangent line

    ctx.beginPath();

    for (let i = 0; i <= gw; i++) {

      const x = pad + i;

      const y = cy + 25 * Math.sin((i / gw) * Math.PI * 1.5);

      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);

    }

    ctx.stroke();

    // tangent at midpoint

    const tx = pad + gw * 0.4;

    const ty = cy + 25 * Math.sin(0.4 * Math.PI * 1.5);

    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2;

    ctx.beginPath(); ctx.moveTo(tx - 40, ty - 30); ctx.lineTo(tx + 40, ty + 30); ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.6)';

    ctx.beginPath(); ctx.arc(tx, ty, 4, 0, Math.PI * 2); ctx.fill();

  } else if (ch.num === 3) {

    // mean value theorem

    ctx.beginPath();

    for (let i = 0; i <= gw; i++) {

      const x = pad + i;

      const t = i / gw;

      const y = cy - 30 * Math.sin(t * Math.PI) + 10 * Math.sin(t * Math.PI * 2);

      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);

    }

    ctx.stroke();

    // secant line

    const y1 = cy - 10, y2 = cy - 10;

    ctx.setLineDash([4,3]); ctx.strokeStyle = 'rgba(255,255,255,0.3)';

    ctx.beginPath(); ctx.moveTo(pad, y1); ctx.lineTo(pad + gw, y2); ctx.stroke();

    ctx.setLineDash([]);

  } else if (ch.num === 4 || ch.num === 5) {

    // integral area

    ctx.beginPath();

    for (let i = 0; i <= gw; i++) {

      const x = pad + i;

      const t = i / gw;

      const y = cy - 30 * t * (1 - t * 0.5);

      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);

    }

    ctx.stroke();

    // shaded area

    const rects = 15;

    for (let i = 0; i < rects; i++) {

      const x1 = pad + (gw * i / rects);

      const x2 = pad + (gw * (i + 1) / rects);

      const t1 = i / rects, t2 = (i + 1) / rects;

      const y = cy - 30 * ((t1 + t2) / 2) * (1 - ((t1 + t2) / 2) * 0.5);

      ctx.fillStyle = 'rgba(255,255,255,0.08)';

      ctx.fillRect(x1, y, x2 - x1, cy + 25 - y);

    }

  } else if (ch.num === 6) {

    // volume of revolution (ellipse-ish shape)

    ctx.beginPath();

    for (let i = 0; i <= gw; i++) {

      const x = pad + i;

      const t = i / gw;

      const y = cy - 20 * Math.sin(t * Math.PI);

      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);

    }

    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.stroke();

    ctx.beginPath();

    for (let i = 0; i <= gw; i++) {

      const x = pad + i;

      const t = i / gw;

      const y = cy + 20 * Math.sin(t * Math.PI) * 0.4;

      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);

    }

    ctx.stroke();

  } else if (ch.num === 7) {

    // direction field

    const step = 18;

    for (let xi = pad; xi <= pad + gw; xi += step) {

      for (let yi = pad; yi <= pad + gh; yi += step) {

        const nx = (xi - pad) / gw * 4 - 2;

        const ny = (yi - pad) / gh * 4 - 2;

        const m = nx - ny;

        const angle = Math.atan(Math.max(-2, Math.min(2, m)));

        const len = 6;

        ctx.strokeStyle = 'rgba(255,255,255,0.2)';

        ctx.lineWidth = 1;

        ctx.beginPath();

        ctx.moveTo(xi - Math.cos(angle)*len, yi + Math.sin(angle)*len);

        ctx.lineTo(xi + Math.cos(angle)*len, yi - Math.sin(angle)*len);

        ctx.stroke();

      }

    }

  } else if (ch.num === 8) {

    // 3D axes

    const o = [cx, cy + 10];

    const ax = [cx + 50, cy + 30], ay = [cx - 30, cy - 40], az = [cx + 40, cy - 25];

    ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,0.35)';

    [[o,ax],[o,ay],[o,az]].forEach(([a,b]) => {

      ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(b[0],b[1]); ctx.stroke();

    });

    ctx.font = '11px Inter'; ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.textAlign = 'center';

    ctx.fillText('x', ax[0]+8, ax[1]+4);

    ctx.fillText('y', ay[0]-4, ay[1]);

    ctx.fillText('z', az[0]+10, az[1]-2);

  } else if (ch.num === 9) {

    // contour lines

    for (let r = 10; r < 55; r += 10) {

      ctx.strokeStyle = `rgba(255,255,255,${0.08 + 0.04 * (r/55)})`;

      ctx.beginPath();

      ctx.ellipse(cx, cy, r * 1.3, r, 0.2, 0, Math.PI * 2);

      ctx.stroke();

    }

    ctx.fillStyle = 'rgba(255,255,255,0.3)';

    ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();

  } else if (ch.num === 10) {

    // 3D bars

    const bars = 8;

    for (let i = 0; i < bars; i++) {

      const x = pad + 10 + (gw - 20) * i / bars;

      const bw = (gw - 20) / bars * 0.6;

      const bh = 10 + 25 * Math.sin(i / bars * Math.PI);

      const offset = 4;

      // top face

      ctx.fillStyle = 'rgba(255,255,255,0.12)';

      ctx.beginPath();

      ctx.moveTo(x, cy - bh + offset); ctx.lineTo(x + bw, cy - bh + offset);

      ctx.lineTo(x + bw + offset, cy - bh); ctx.lineTo(x + offset, cy - bh);

      ctx.fill();

      // front face

      ctx.fillStyle = 'rgba(255,255,255,0.08)';

      ctx.fillRect(x, cy - bh + offset, bw, bh);

      ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;

      ctx.strokeRect(x, cy - bh + offset, bw, bh);

    }

  } else if (ch.num === 11) {

    // curved surface with arrows

    ctx.beginPath();

    for (let i = 0; i <= gw; i++) {

      const x = pad + i;

      const t = i / gw;

      const y = cy - 25 * Math.sin(t * Math.PI) + 8 * Math.cos(t * Math.PI * 3);

      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);

    }

    ctx.stroke();

    // small arrows along curve

    for (let i = 1; i < 8; i++) {

      const t = i / 8;

      const x = pad + gw * t;

      const y = cy - 25 * Math.sin(t * Math.PI) + 8 * Math.cos(t * Math.PI * 3);

      ctx.fillStyle = 'rgba(255,255,255,0.3)';

      ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();

    }

  } else if (ch.num === 12) {

    // series bars converging

    const bars = 12;

    for (let i = 0; i < bars; i++) {

      const bh = (pad + gh) * Math.pow(0.5, i) * 1.5;

      const x = pad + 8 + (gw - 16) * i / bars;

      const bw = (gw - 16) / bars * 0.7;

      ctx.fillStyle = `rgba(255,255,255,${0.15 + 0.5 * (1 - i/bars)})`;

      ctx.fillRect(x, pad + gh - bh, bw, bh);

    }

  }

}





/* ====== Python section cover art ====== */
function drawPythonCover(ctx, w, h, num) {
  var pad = 24, cx = w/2, cy = h/2;
  var themes = [
    null,
    function() { ctx.fillStyle = "rgba(55,118,171,0.2)"; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(w*0.6,0); ctx.lineTo(0,h*0.6); ctx.closePath(); ctx.fill(); ctx.fillStyle = "rgba(255,212,59,0.15)"; ctx.beginPath(); ctx.moveTo(w*0.4,h); ctx.lineTo(w,h); ctx.lineTo(w,h*0.4); ctx.closePath(); ctx.fill(); },
    function() { ctx.strokeStyle = "rgba(255,212,59,0.2)"; ctx.lineWidth = 2; ctx.beginPath(); for (var i=0;i<=w;i+=4){ var x=i+(Math.sin(i*0.03)*20), y=cy+Math.sin(i*0.04+num)*25; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); } ctx.stroke(); },
    function() { ctx.fillStyle = "rgba(255,255,255,0.04)"; [4,8,12,16,20,24].forEach(function(b){ctx.fillRect(pad+b*2,h*0.2,b*2,2);ctx.fillRect(pad+b*3,h*0.4,b*3,2);ctx.fillRect(pad+b*2,h*0.6,b*2,2);}); },
    function() { ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = 1; for (var row=0;row<5;row++) for (var col=0;col<6;col++){ var ox=pad+col*36+(row%2?18:0), oy=pad+row*28; for (var i2=0;i2<6;i2++){ var ang=i2*Math.PI/3-Math.PI/6, x2=ox+Math.cos(ang)*14, y2=oy+Math.sin(ang)*14; i2===0?(ctx.beginPath(),ctx.moveTo(x2,y2)):ctx.lineTo(x2,y2); } ctx.closePath(); ctx.stroke(); } },
    function() { ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.lineWidth=1.5; [0,1,2,3].forEach(function(i){var s=20+i*12;ctx.beginPath();ctx.moveTo(cx-s,cy-s/3);ctx.lineTo(cx-s,cy+s/3);ctx.stroke();ctx.beginPath();ctx.moveTo(cx+s,cy-s/3);ctx.lineTo(cx+s,cy+s/3);ctx.stroke();}); },
    function() { ctx.strokeStyle = "rgba(255,212,59,0.15)"; ctx.lineWidth=1.5; function br(x,y,ang,len,d){if(d>3)return;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(ang)*len,y+Math.sin(ang)*len);ctx.stroke();br(x+Math.cos(ang)*len,y+Math.sin(ang)*len,ang-0.4,len*0.7,d+1);br(x+Math.cos(ang)*len,y+Math.sin(ang)*len,ang+0.4,len*0.7,d+1);} br(w/2,h,-Math.PI/2,h*0.2,0); },
    function() { ctx.fillStyle = "rgba(55,118,171,0.15)"; var pts=[[w*0.3,h*0.3],[w*0.5,h*0.25],[w*0.7,h*0.35],[w*0.4,h*0.55],[w*0.6,h*0.5]]; pts.forEach(function(p,i){ctx.beginPath();ctx.arc(p[0],p[1],8+i*2,0,Math.PI*2);ctx.fill();}); ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth=1; [[0,1],[0,3],[1,2],[1,3],[2,4],[3,4]].forEach(function(a){ctx.beginPath();ctx.moveTo(pts[a[0]][0],pts[a[0]][1]);ctx.lineTo(pts[a[1]][0],pts[a[1]][1]);ctx.stroke();}); },
    function() { ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth=1; for (var i=0;i<8;i++){ctx.beginPath();ctx.moveTo(pad+i*20,pad);ctx.lineTo(w-pad-i*20,h-pad);ctx.stroke();} },
    function() { ctx.strokeStyle = "rgba(255,212,59,0.12)"; ctx.lineWidth=1; for (var i=0;i<4;i++){var s=pad+i*24;ctx.beginPath();ctx.rect(s,s,w-s*2,h-s*2);ctx.stroke();} },
    function() { ctx.fillStyle = "rgba(55,118,171,0.12)"; ctx.fillRect(w*0.15,h*0.2,w*0.3,h*0.25); ctx.fillStyle = "rgba(255,212,59,0.1)"; ctx.fillRect(w*0.55,h*0.15,w*0.25,h*0.3); ctx.fillStyle = "rgba(255,255,255,0.06)"; ctx.fillRect(w*0.3,h*0.5,w*0.4,h*0.3); },
  ];
  if (themes[num]) themes[num]();
  ctx.fillStyle = "rgba(255,212,59,0.15)"; ctx.beginPath(); ctx.moveTo(w-30,0); ctx.lineTo(w,0); ctx.lineTo(w,30); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "rgba(55,118,171,0.25)"; ctx.beginPath(); ctx.moveTo(0,h-20); ctx.lineTo(0,h); ctx.lineTo(20,h); ctx.closePath(); ctx.fill();
}

function openChapterView(num, courseId) {

  const cid = courseId || (state.currentCourse && state.currentCourse.id) || 'gaoshu';

  const ch = chaptersData.find(c => c.num === num && c.courseId === cid);

  if (!ch) return;

  state.currentChapter = ch;

  state.courseView = 'kp';

  document.querySelectorAll('.course-view').forEach(v => v.classList.remove('active'));

  document.getElementById('kp-view').classList.add('active');

  renderKPView();

}



function renderKPView() {

  const ch = state.currentChapter;

  const el = document.getElementById('kp-view');

  el.innerHTML = `

    <div class="view-back-bar">

      <button class="view-back-btn" onclick="backToChapters()">

        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>

        返回章节

      </button>

      <span class="view-back-title">第${ch.num}章 · ${ch.title}</span>

    </div>

    <div class="kp-list">

      ${ch.kps.map((kp, i) => {

        const fid = (ch.courseId === 'prob') ? ('p' + ch.num + '-' + i) : (ch.num + '-' + i);

        const formula = ((ch.courseId === 'gaoshu') || (ch.courseId === 'prob')) ? (kpFormulas[fid] || '') : '';

        const kpKey = ch.courseId + '-' + ch.num + '-' + i;

        const detail = kpDetails[kpKey];

        const probCount = (detail && detail.problems) ? detail.problems.length : 0;

        const studKey = studKPKey(ch.courseId, ch.num, i);

        const st = kpStatusInfo(ch.courseId, ch.num, i);

        return `

        <div class="kp-card" onclick="openVizView(${ch.num},${i})">

          <div class="kp-icon" style="background:${chapterColors[ch.num]}22;color:${chapterColors[ch.num]}">

            ${i + 1}

          </div>

          <div class="kp-info">

            <h4>${kp.name}</h4>

            <p>${kp.desc}</p>

            <div class="kp-expand">

              ${formula ? '<span class="kp-formula-preview">$' + formula + '$</span>' : ''}

              <div class="kp-tags">

                ${probCount > 0 ? '<span class="kp-tag kp-tag-prob">' + probCount + ' 道练习题</span>' : ''}

                ${formula ? '<span class="kp-tag kp-tag-formula">公式速览</span>' : ''}

              </div>

            </div>

          </div>

          <div class="kp-status kp-status-${st.cls}" title="点击切换「已学」状态" onclick="event.stopPropagation(); toggleStudied('${studKey}', null); renderKPView();">
            ${st.label}
          </div>

          <button class="fav-btn ${isFavorite(favKPKey(ch.courseId, ch.num, i)) ? 'active' : ''}" title="收藏知识点" onclick="event.stopPropagation();toggleFavorite('${favKPKey(ch.courseId, ch.num, i)}',this)">

            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>

          </button>

          <span class="kp-arrow">

            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>

          </span>

        </div>

      `}).join('')}

    </div>`;

  setTimeout(function(){ renderMath(el); }, 80);

}



function backToChapters() {

  state.courseView = 'chapters';

  document.querySelectorAll('.course-view').forEach(v => v.classList.remove('active'));

  document.getElementById('chapters-view').classList.add('active');

  setTimeout(() => {

    chaptersData.forEach(ch => {

      const canvas = document.getElementById('ch-canvas-' + ch.num);

      if (canvas) drawChapterCover(canvas, ch);

    });

  }, 50);

}



function openVizView(chNum, kpIndex) {

  const ch = state.currentChapter;

  const kp = ch.kps[kpIndex];

  if (!kp) return;

  state.currentKP = kp;

  state.courseView = 'viz';

  // stop any running animation

  if (state.vizAnimId) { cancelAnimationFrame(state.vizAnimId); state.vizAnimId = null; }



  document.querySelectorAll('.course-view').forEach(v => v.classList.remove('active'));

  document.getElementById('viz-view').classList.add('active');

  renderVizView(ch, kp);

}



// 上/下知识点切换（连续学习）——跨章节边界自动跳转

function navigateAdjacentKP(delta) {

  const ch = state.currentChapter;

  if (!ch) return;

  const kp = state.currentKP;

  if (!kp) return;

  const courseChapters = chaptersData.filter(c => c.courseId === ch.courseId);

  const ci = courseChapters.indexOf(ch);

  const ki = ch.kps.indexOf(kp);

  if (ki < 0) return;

  if (delta < 0) {

    if (ki > 0) {

      openVizView(ch.num, ki - 1);

    } else if (ci > 0) {

      const pc = courseChapters[ci - 1];

      if (pc.kps && pc.kps.length) {

        state.currentChapter = pc;

        openVizView(pc.num, pc.kps.length - 1);

      }

    }

  } else {

    if (ki < ch.kps.length - 1) {

      openVizView(ch.num, ki + 1);

    } else if (ci < courseChapters.length - 1) {

      const nc = courseChapters[ci + 1];

      if (nc.kps && nc.kps.length) {

        state.currentChapter = nc;

        openVizView(nc.num, 0);

      }

    }

  }

}



function renderVizView(ch, kp) {
  // Python course: dedicated py-viz renderer (prevents generic math viz fallback)
  if (ch.courseId === "python") {
    var py_el = document.getElementById("viz-view");
    var py_algo = pyVizMap[kp.name] || { kpId: "py-1-0", name: "Python演示" };
    var py_idx = ch.kps.indexOf(kp);
    var py_cObj = codeSamples[ch.courseId + "-" + ch.num + "-" + py_idx];
    var py_code = py_cObj ? py_cObj.code : "print('Hello Python!')";
    var py_kpD = getKPDetail(ch.courseId, ch.num, py_idx);
    var py_expl = py_kpD && py_kpD.explanation ? py_kpD.explanation.split(String.fromCharCode(10)).join("<br>") : "暂无详细讲解。";
    var py_probs = "";
    if (py_kpD && py_kpD.problems) {
      py_probs = py_kpD.problems.map(function(p, i) {
        return "<div class=practice-item><div class=practice-q><span class=q-num>Q"+(i+1)+"</span>"+p.q+"</div><div class=practice-a style=display:none><b>答：</b>"+p.a+"</div></div>";
      }).join("");
    } else { py_probs = "<p>暂无练习题</p>"; }
    py_el.innerHTML = "<div class=view-back-bar><button class=view-back-btn onclick=backToKP()>返回知识点</button><span class=view-back-title>第"+ch.num+"章 "+kp.name+"</span></div>"
      + "<div class=viz-panel><div class=viz-header><div class=viz-icon-lg style=background:#3776AB22;color:#3776AB>PY</div><div class=viz-title-area><h2>"+kp.name+"</h2><p>"+kp.desc+"</p></div></div>"
      + "<div class=sort-dual-wrap><div class=sort-anim-col><div class=sort-anim-header>"+py_algo.name+"演示</div>"
      + "<canvas id=pyVizCanvas style=display:block;width:100%;border-radius:10px;background:#0f172a></canvas>"
      + "<div class=sort-progress-wrap><div class=sort-progress-bar><div class=sort-progress-fill id=pyProgressFill></div></div></div>"
      + "<div class=sort-step-info id=pyStepInfo>准备中...</div>"
      + "<div class=sort-controls><button class=sort-btn id=pyPlayBtn onclick=PyVizEngine.play()>播放</button><button class=sort-btn onclick=PyVizEngine.pause()>暂停</button><button class=sort-btn onclick=PyVizEngine.prev()>上一步</button><button class=sort-btn onclick=PyVizEngine.next()>下一步</button><button class=sort-btn onclick=PyVizEngine.reset()>重置</button></div>"
      + "</div></div>"
      + "<div class=code-demo-col><div class=code-demo-col-header>示例代码</div>"
      + "<textarea id=inlineCodeEditor class=code-demo-editor spellcheck=false>"+py_code+"</textarea>"
      + "<div class=code-demo-actions><button id=inlineRunBtn class=code-demo-run onclick=runInlineCode()>运行代码</button><span id=inlineRunStatus class=code-demo-status></span></div>"
      + "<pre id=inlineCodeOutput class=code-demo-output></pre></div>"
      + "</div>"
      + "<div class=viz-tabs><button class='viz-tab active' onclick=switchVizTab('detail',this)>知识详解</button><button class=viz-tab onclick=switchVizTab('practice',this)>去题库练习</button></div>"
      + "<div id=viz-tab-content><div class=viz-detail-content><div class=viz-detail-body>"+py_expl+"</div></div><div class=viz-practice-content style=display:none>"+py_probs+"</div></div>"
      + "</div>";
    setTimeout(function() {
      var canvas = document.getElementById("pyVizCanvas");
      if (canvas && typeof PyVizEngine !== "undefined") {
        PyVizEngine.init(canvas);
        PyVizEngine.generateSteps(py_algo.kpId, py_algo);
        PyVizEngine.draw(); PyVizEngine.speed = 3;
        setTimeout(function() { PyVizEngine.play(); }, 600);
      }
    }, 120);
    return;
  }


    // Python course: py-viz renderer (handled by dedicated engine)
  if (ch.courseId === "python") {
    // pyVizMap and PyVizEngine from py-viz/py-core-viz.js handle all rendering
    // Fallback: generic KP view with Python branding
    var py_el = document.getElementById("viz-view");
    var py_idx = ch.kps.indexOf(kp);
    var py_kpD = getKPDetail(ch.courseId, ch.num, py_idx);
    var py_expl = py_kpD && py_kpD.explanation ? py_kpD.explanation.split(String.fromCharCode(10)).join("<br>") : "暂无详细讲解。";
    py_el.innerHTML = "<div class=view-back-bar><button class=view-back-btn onclick=backToKP()>← 返回知识点</button><span class=view-back-title>第"+ch.num+"章 "+kp.name+"</span></div>"+"<div class=viz-panel><div class=viz-header><div class=viz-icon-lg style=background:#3776AB22;color:#3776AB>PY</div><div class=viz-title-area><h2>"+kp.name+"</h2><p>"+kp.desc+"</p></div></div>"+"<div class=viz-formula><span class=hl>Python 程序设计</span></div>"+"<div class=viz-detail-content><div class=viz-detail-body>"+py_expl+"</div></div></div>";
    return;
  }



  const el = document.getElementById('viz-view');

  const viz = vizTypes[kp.viz] || vizTypes['generic'];

  const color = chapterColors[ch.num];

  const favKey = favKPKey(ch.courseId, ch.num, ch.kps.indexOf(kp));

  const studKey = studKPKey(ch.courseId, ch.num, ch.kps.indexOf(kp));



  el.innerHTML = `

    <div class="view-back-bar">

      <button class="view-back-btn" onclick="backToKP()">

        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>

        返回

      </button>

      <nav class="kp-breadcrumb">

        <a class="crumb crumb-link" onclick="backToKP()" title="返回第${ch.num}章知识点列表">第${ch.num}章 · ${ch.title}</a>

        <span class="crumb-sep">›</span>

        <span class="crumb crumb-current">${kp.name}</span>

      </nav>

    </div>

    <div class="viz-panel">

      <div class="viz-header">

        <div class="viz-icon-lg" style="background:${color}22;color:${color}">

          ${viz.title.charAt(0)}

        </div>

        <div class="viz-title-area">

          <h2>${kp.name}</h2>

          <p>${kp.desc}</p>

        </div>

        <button class="fav-btn fav-btn-lg ${isFavorite(favKey) ? 'active' : ''}" title="收藏此知识点" onclick="toggleFavorite('${favKey}',this)">

          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>

        </button>

        <button class="fav-btn fav-btn-lg kp-stud-btn ${isStudied(studKey) ? 'active' : ''}" title="${isStudied(studKey) ? '已学（点击取消）' : '标记为已学'}" onclick="toggleStudied('${studKey}', this); this.title = isStudied('${studKey}') ? '已学（点击取消）' : '标记为已学';">

          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>

        </button>

      </div>



      <div class="viz-formula">

        <span class="hl">${(()=>{const fid=ch.num+'-'+ch.kps.indexOf(kp);const f=(ch.courseId==='gaoshu')?kpFormulas[fid]:null;return f?'$'+f+'$':viz.formula;})()}</span>

      </div>



      <div class="viz-tabs">

        <button class="viz-tab active" onclick="switchVizDetailTab('explain',this)">

          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" stroke-width="1.6"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" stroke-width="1.6"/></svg>

          讲解

        </button>

        <button class="viz-tab" onclick="switchVizDetailTab('example',this)">

          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>

          例题

        </button>

        <button class="viz-tab" onclick="switchVizDetailTab('summary',this)">

          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 4 12 14.01l-3-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>

          小结

        </button>

        <button class="viz-tab viz-tab-action" onclick="navigate('questions');setTimeout(function(){renderQBChapters('${ch.courseId}');setTimeout(function(){renderQBChapterDetail('${ch.courseId}',${ch.num});},100);},200)">

          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="currentColor" stroke-width="1.6"/><rect x="9" y="3" width="6" height="4" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M9 14l2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>

          去题库练习

        </button>

      </div>

      <div id="viz-tab-content">

        <div class="viz-detail-content"><div class="viz-detail-body">${(function(){const d=getKPDetail(ch.courseId,ch.num,ch.kps.indexOf(kp));return d?d.explanation.replace(/\n/g,'<br>'):'暂无详细讲解，后续持续更新中。';})()}</div></div>

      </div>



      <div class="viz-collapsible collapsed" id="vizCollapsible">

        <button class="viz-collapse-header" onclick="toggleVizCollapse()">

          <span class="viz-collapse-title">

            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 3h18v18H3V3zm4 4v10h2V7H7zm4 0v10h2V7h-2zm4 0v10h2V7h-2z" stroke="currentColor" stroke-width="1.8"/></svg>

            函数可视化

          </span>

          <span class="viz-collapse-arrow">

            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>

          </span>

        </button>

        <div class="viz-collapse-body">

          <div class="viz-custom-bar">

            <label>f(x) =</label>

            <input type="text" id="customExprInput" placeholder="输入函数，如 sin(x), x^2+1, exp(-x), 1/(1+x^2)" onkeydown="if(event.key==='Enter')renderCustomExpr()">

            <button class="vc-btn draw" onclick="renderCustomExpr()">绘制</button>

            <button class="vc-btn reset" onclick="clearCustomExpr()">恢复</button>

            <span id="customExprHint"></span>

          </div>

          <div class="viz-canvas-wrap">

            <div class="viz-canvas-top">

              <span class="viz-canvas-label">${viz.title}</span>

              <span class="viz-canvas-hint">拖动下方参数或输入自定义函数</span>

            </div>

            <canvas id="vizCanvas"></canvas>

          </div>

          <div class="viz-controls">

            <div class="viz-controls-title">

              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/></svg>

              参数调节

            </div>

            <div class="viz-controls-grid">

              ${viz.params.map(p => `

                <div class="viz-param">

                  <label>${p.label} <span id="viz-val-${p.id}">${p.default}</span></label>

                  <input type="range" id="viz-param-${p.id}" min="${p.min}" max="${p.max}" step="${p.step}" value="${p.default}" oninput="updateViz()">

                </div>

              `).join('')}

            </div>

            ${kp.viz === 'riemann-sum' ? `

            <div class="viz-btn-row" style="margin-top:16px">

              <button class="viz-btn active" onclick="setRiemannType(0,this)">左端点</button>

              <button class="viz-btn" onclick="setRiemannType(1,this)">右端点</button>

              <button class="viz-btn" onclick="setRiemannType(2,this)">中点</button>

            </div>` : ''}

            ${kp.viz === 'important-limits' ? `

            <div class="viz-btn-row" style="margin-top:16px">

              <button class="viz-btn active" onclick="setLimitTab(0,this)">sin(x)/x</button>

              <button class="viz-btn" onclick="setLimitTab(1,this)">(1+1/n)ⁿ</button>

            </div>` : ''}

            ${kp.viz === 'series-convergence' ? `

            <div class="viz-btn-row" style="margin-top:16px">

              <button class="viz-btn active" onclick="setSeriesType(0,this)">等比级数</button>

              <button class="viz-btn" onclick="setSeriesType(1,this)">调和级数</button>

              <button class="viz-btn" onclick="setSeriesType(2,this)">交错级数</button>

            </div>` : ''}

            ${kp.viz === 'continuity' ? `

            <div class="viz-btn-row" style="margin-top:16px">

              <button class="viz-btn active" onclick="setContinuityType(0,this)">连续函数</button>

              <button class="viz-btn" onclick="setContinuityType(1,this)">跳跃间断</button>

              <button class="viz-btn" onclick="setContinuityType(2,this)">可去间断</button>

            </div>` : ''}

            ${kp.viz === 'direction-field' ? `

            <div class="viz-btn-row" style="margin-top:16px">

              <button class="viz-btn active" onclick="setDEType(0,this)">y'=x-y</button>

              <button class="viz-btn" onclick="setDEType(1,this)">y'=-x/y</button>

              <button class="viz-btn" onclick="setDEType(2,this)">y'=y·sin(x)</button>

            </div>` : ''}

          </div>

        </div>

      </div>

      ${(function(){
        const courseChapters = chaptersData.filter(c => c.courseId === ch.courseId);
        const ci = courseChapters.indexOf(ch);
        const ki = ch.kps.indexOf(kp);
        const escName = n => String(n).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        let prev = '', next = '';
        if (ki > 0) {
          const pk = ch.kps[ki-1];
          prev = '<button class="viz-nav-btn viz-nav-prev" onclick="navigateAdjacentKP(-1)"><span class="vn-arrow">‹</span><span class="vn-text"><span class="vn-label">上一篇</span><span class="vn-name">'+escName(pk.name)+'</span></span></button>';
        } else if (ci > 0) {
          const pc = courseChapters[ci-1];
          if (pc.kps && pc.kps.length) {
            const pk = pc.kps[pc.kps.length-1];
            prev = '<button class="viz-nav-btn viz-nav-prev" onclick="navigateAdjacentKP(-1)"><span class="vn-arrow">‹</span><span class="vn-text"><span class="vn-label">上一篇 · 上章末</span><span class="vn-name">'+escName(pk.name)+'</span></span></button>';
          }
        }
        if (ki < ch.kps.length - 1) {
          const nk = ch.kps[ki+1];
          next = '<button class="viz-nav-btn viz-nav-next" onclick="navigateAdjacentKP(1)"><span class="vn-text"><span class="vn-label">下一篇</span><span class="vn-name">'+escName(nk.name)+'</span></span><span class="vn-arrow">›</span></button>';
        } else if (ci < courseChapters.length - 1) {
          const nc = courseChapters[ci+1];
          if (nc.kps && nc.kps.length) {
            const nk = nc.kps[0];
            next = '<button class="viz-nav-btn viz-nav-next" onclick="navigateAdjacentKP(1)"><span class="vn-text"><span class="vn-label">下一篇 · 下章首</span><span class="vn-name">'+escName(nk.name)+'</span></span><span class="vn-arrow">›</span></button>';
          }
        }
        if (prev || next) return '<div class="viz-nav-bar">'+prev+next+'</div>';
        return '';
      })()}

    </div>`;



  // init canvas and render (only if collapsible is expanded)

  setTimeout(() => {

    const wrap = document.getElementById('vizCollapsible');

    const canvas = document.getElementById('vizCanvas');

    if (canvas && wrap && !wrap.classList.contains('collapsed')) {

      VizEngine.init(canvas);

      updateViz();

    }

  }, 50);

  // 渲染 KaTeX 公式

  setTimeout(function(){ renderMath(el); }, 120);

}


// 详情内容分段 Tab：讲解 / 例题 / 小结（替代单一长文，分段切换、信息密度可控）
function switchVizDetailTab(tab, btn) {

  const tabs = btn.parentElement.querySelectorAll('.viz-tab');

  tabs.forEach(t => t.classList.remove('active'));

  btn.classList.add('active');

  const content = document.getElementById('viz-tab-content');

  if (!content) return;

  const ch = state.currentChapter;

  const kp = state.currentKP;

  if (!ch || !kp) return;

  const kpIdx = ch.kps.indexOf(kp);

  const detail = getKPDetail(ch.courseId, ch.num, kpIdx);


  if (tab === 'explain') {

    const text = detail ? detail.explanation : '暂无详细讲解，后续持续更新中。';

    content.innerHTML = '<div class="viz-detail-content"><div class="viz-detail-body">' + text.replace(/\n/g, '<br>') + '</div></div>';

  } else if (tab === 'example') {

    const problems = detail ? (detail.problems || []) : [];

    if (!problems.length) {

      content.innerHTML = '<div class="viz-detail-content"><div class="viz-empty-hint">暂无例题，可前往「题库练习」巩固提升。</div></div>';

    } else {

      content.innerHTML = '<div class="viz-detail-content"><div class="viz-examples-list">' + problems.map(function(p, i) {

        return '<div class="viz-example-item"><div class="viz-example-q"><span class="eg-num">例' + (i + 1) + '</span>' + p.q + '</div><div class="viz-example-a" style="display:none"><strong>解答：</strong>' + p.a + '</div><button class="viz-example-toggle" onclick="var pa=this.previousElementSibling;pa.style.display=pa.style.display===\'none\'?\'block\':\'none\';this.textContent=pa.style.display===\'none\'?\'查看解答\':\'收起解答\'">查看解答</button></div>';

      }).join('') + '</div></div>';

    }

  } else if (tab === 'summary') {

    const text = (detail && detail.summary) ? detail.summary : '暂无小结，后续持续更新中。';

    content.innerHTML = '<div class="viz-detail-content"><div class="viz-summary-body">' + text.replace(/\n/g, '<br>') + '</div></div>';

  }

  setTimeout(function(){ renderMath(content); }, 80);

}



function backToKP() {

  state.courseView = 'kp';

  if (state.vizAnimId) { cancelAnimationFrame(state.vizAnimId); state.vizAnimId = null; }

  document.querySelectorAll('.course-view').forEach(v => v.classList.remove('active'));

  document.getElementById('kp-view').classList.add('active');

}



function toggleVizCollapse() {

  const el = document.getElementById('vizCollapsible');

  if (!el) return;

  const collapsed = el.classList.toggle('collapsed');

  if (!collapsed) {

    // expanded: init & render canvas after transition starts

    setTimeout(() => {

      const canvas = document.getElementById('vizCanvas');

      if (canvas) { VizEngine.init(canvas); updateViz(); }

    }, 50);

    // resize once the panel is fully open

    setTimeout(() => {

      if (VizEngine.canvas) { VizEngine.resize(); updateViz(); }

    }, 350);

  }

}



// button type helpers

function setRiemannType(t, btn) {

  const el = document.getElementById('viz-param-type');

  if (el) { el.value = t; updateViz(); }

  btn.parentElement.querySelectorAll('.viz-btn').forEach(b => b.classList.remove('active'));

  btn.classList.add('active');

}

function setLimitTab(t, btn) {

  const el = document.getElementById('viz-param-tab');

  if (el) { el.value = t; updateViz(); }

  btn.parentElement.querySelectorAll('.viz-btn').forEach(b => b.classList.remove('active'));

  btn.classList.add('active');

}

function setSeriesType(t, btn) {

  const el = document.getElementById('viz-param-type');

  if (el) { el.value = t; updateViz(); }

  btn.parentElement.querySelectorAll('.viz-btn').forEach(b => b.classList.remove('active'));

  btn.classList.add('active');

}

function setContinuityType(t, btn) {

  const el = document.getElementById('viz-param-fnType');

  if (el) { el.value = t; updateViz(); }

  btn.parentElement.querySelectorAll('.viz-btn').forEach(b => b.classList.remove('active'));

  btn.classList.add('active');

}

function setDEType(t, btn) {

  const el = document.getElementById('viz-param-type');

  if (el) { el.value = t; updateViz(); }

  btn.parentElement.querySelectorAll('.viz-btn').forEach(b => b.classList.remove('active'));

  btn.classList.add('active');

}



function updateViz() {

  const kp = state.currentKP;

  if (!kp) return;

  const viz = vizTypes[kp.viz] || vizTypes['generic'];

  const params = {};

  viz.params.forEach(p => {

    const el = document.getElementById('viz-param-' + p.id);

    const val = el ? parseFloat(el.value) : p.default;

    params[p.id] = val;

    // update display

    const display = document.getElementById('viz-val-' + p.id);

    if (display) display.textContent = Number.isInteger(val) ? val : val.toFixed(2);

  });

  viz.render(params);

}



/* ═══════ 页面导航 ═══════ */

function navigate(page) {

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const target = document.getElementById('page-' + page);

  if (target) target.classList.add('active');

  const navItem = document.querySelector(`[data-page="${page}"]`);

  if (navItem) navItem.classList.add('active');

  state.currentPage = page;

  updatePageTitle(page);

  const container = document.querySelector('.page-container');

  if (container) container.scrollTop = 0;



  // if navigating to courses, render the select view

  if (page === 'courses') {

    showCourseSelectView();

  }

  // if navigating to questions, render the question bank

  if (page === 'questions') {

    renderQuestionBankPage();

  }

  // if navigating to favorites, render the favorites list
  if (page === 'favorites') {

    renderFavoritesPage();

  }

  // 算法可视化: 进入时初始化引擎，离开时停止动画
  if (page === 'algo') {

    setTimeout(function () { if (window.initAlgoPage) initAlgoPage(); }, 60);

  } else if (window.stopAlgoViz) {

    stopAlgoViz();

  }

  // render KaTeX for pages that may contain math

  if (page === 'profile') { setTimeout(function() { renderProfileAchievements(); }, 120); }

  if (page === 'dashboard' || page === 'chat' || page === 'community' || page === 'lab' || page === 'questions') {

    setTimeout(function(){ renderMath(); }, 200);

  }

}



/* ═══════ 个人中心成就渲染 ═══════ */
function renderProfileAchievements() {
  var grid = document.getElementById("profile-achievements");
  if (!grid) return;
  if (!window.Achievements || !window.Achievements.getAll) { return; }
  var ach = window.Achievements;
  var all = ach.getAll();
  var total = all.length;
  var unlocked = ach.getUnlockedCount();
  var achState = ach.getState();
  var pct = total > 0 ? Math.round(unlocked/total*100) : 0;
  var cfg = {
    legendary:{bg:"rgba(207,181,59,0.12)",bd:"rgba(207,181,59,0.45)",cl:"#cfb53b",lb:"传说"},
    epic:{bg:"rgba(123,47,190,0.12)",bd:"rgba(123,47,190,0.45)",cl:"#a78bfa",lb:"史诗"},
    rare:{bg:"rgba(33,150,243,0.1)",bd:"rgba(33,150,243,0.4)",cl:"#60a5fa",lb:"稀有"},
    common:{bg:"rgba(76,175,80,0.08)",bd:"rgba(76,175,80,0.35)",cl:"#86efac",lb:"普通"}
  };
  var h="";
  all.forEach(function(a){
    var ok=!!achState.unlocked[a.id];
    var c=cfg[a.rarity]||cfg.common;
    var dt=achState.unlockedDates[a.id]||"";
    h+="<div class=ach-card"+(ok?" unlocked":" locked")+" style="+(ok?"border-color:"+c.bd+";background:"+c.bg:"")+">"
      +"<div class=ach-card-icon"+(ok?"":" dim")+">"+a.icon+"</div>"
      +"<div class=ach-card-info>"
      +"<div class=ach-card-name style=color:"+(ok?"#f0f0f5":"var(--text-muted)")+">"+a.name+"</div>"
      +"<div class=ach-card-desc>"+a.desc+"</div>"
      +(ok?"<div class=ach-card-date>"+dt+"</div>":"")
      +"</div>"
      +(ok?"<span class=ach-card-badge style=background:"+c.bg+";color:"+c.cl+";border-color:"+c.bd+">"+c.lb+"</span>":"<span class=ach-card-badge locked-badge>@</span>")
      +"</div>";
  });
  var hd=document.querySelector("#page-profile .card-title");
  if(hd) hd.innerHTML="成就系统 <span style=font-size:0.75rem;color:var(--text-muted);font-weight:400>"+unlocked+"/"+total+" ("+pct+"%)</span>";
  grid.innerHTML=h;
}

function updatePageTitle(page) {

  const titles = { dashboard:'仪表盘', chat:'AI 辅导', courses:'课程中心', lab:'公式实验室', community:'社区', questions:'课程题库', profile:'个人中心', settings:'设置', favorites:'我的收藏', algo:'算法可视化' };

  document.title = `${titles[page]||page} · 互动课堂`;

}



/* ══════ 收藏 / 书签（A3） ══════ */
const FAV_STORE_KEY = 'hdt_favorites_v1';
let favorites = loadFavorites();

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAV_STORE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}
function saveFavorites() {
  try { localStorage.setItem(FAV_STORE_KEY, JSON.stringify(favorites)); } catch (e) {}
}
function favKPKey(courseId, chNum, kpIdx) { return courseId + '|' + chNum + '|' + kpIdx; }
function isFavorite(key) { return favorites.indexOf(key) >= 0; }
function toggleFavorite(key, btn) {
  const i = favorites.indexOf(key);
  if (i >= 0) favorites.splice(i, 1); else favorites.push(key);
  saveFavorites();
  if (btn) btn.classList.toggle('active', isFavorite(key));
  updateFavBadge();
  return isFavorite(key);
}
function resolveFavorite(key) {
  const p = String(key).split('|');
  if (p.length < 3) return null;
  const cid = p[0];
  const chNum = parseInt(p[1], 10);
  const kpIdx = parseInt(p[2], 10);
  const ch = chaptersData.find(c => c.courseId === cid && c.num === chNum);
  if (!ch || !ch.kps || !ch.kps[kpIdx]) return null;
  return { courseId: cid, chNum: chNum, kpIdx: kpIdx, ch: ch, kp: ch.kps[kpIdx] };
}
function openFavorite(key) {
  const f = resolveFavorite(key);
  if (!f) return;
  state.currentCourse = coursesData.find(c => c.id === f.courseId) || state.currentCourse;
  state.currentChapter = f.ch;
  navigate('courses');
  openVizView(f.chNum, f.kpIdx);
}
function updateFavBadge() {
  const el = document.getElementById('favBadge');
  if (!el) return;
  const n = favorites.length;
  el.textContent = n > 99 ? '99+' : String(n);
  el.style.display = n > 0 ? 'inline-flex' : 'none';
}
function renderFavoritesPage() {
  const el = document.getElementById('page-favorites');
  if (!el) return;
  if (!favorites.length) {
    el.innerHTML = `
      <div class="page-header"><div>
        <h1 class="page-title">我的收藏</h1>
        <p class="page-subtitle">把常看的知识点收进这里，形成你的专属学习集</p>
      </div></div>
      <div class="fav-empty">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none"><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>
        <p>还没有收藏任何知识点</p>
        <span>在知识点卡片或详情页点击 ★ 即可收藏</span>
        <button class="btn btn-primary" onclick="navigate('courses')">去课程中心 →</button>
      </div>`;
    return;
  }
  const items = favorites.map(function(k) {
    const f = resolveFavorite(k);
    if (!f) return '';
    return `
      <div class="fav-item" onclick="openFavorite('${k}')">
        <div class="fav-item-icon" style="background:${chapterColors[f.chNum]}22;color:${chapterColors[f.chNum]}">${f.chNum}</div>
        <div class="fav-item-info">
          <span class="fav-item-chapter">第${f.chNum}章 · ${f.ch.title}</span>
          <h4>${f.kp.name}</h4>
          <p>${f.kp.desc}</p>
        </div>
        <button class="fav-remove" title="取消收藏" onclick="event.stopPropagation();toggleFavorite('${k}',null);renderFavoritesPage();">✕</button>
      </div>`;
  }).join('');
  el.innerHTML = `
    <div class="page-header"><div>
      <h1 class="page-title">我的收藏</h1>
      <p class="page-subtitle">共 ${favorites.length} 个知识点 · 你的专属学习集</p>
    </div></div>
    <div class="fav-list">${items}</div>`;
  setTimeout(function(){ renderMath(el); }, 120);
}



/* ═══════ 已学状态（B2） ═══════ */

const STUDY_STORE_KEY = 'hdt_studied_v1';
let studiedSet = loadStudied();
function loadStudied() {
  try {
    const raw = localStorage.getItem(STUDY_STORE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}
function saveStudied() {
  try { localStorage.setItem(STUDY_STORE_KEY, JSON.stringify(studiedSet)); } catch (e) {}
}
function studKPKey(courseId, chNum, kpIdx) { return courseId + '|' + chNum + '|' + kpIdx; }
function isStudied(key) { return studiedSet.indexOf(key) >= 0; }
function toggleStudied(key, btn) {
  const i = studiedSet.indexOf(key);
  if (i >= 0) studiedSet.splice(i, 1); else studiedSet.push(key);
  saveStudied();
  if (btn) btn.classList.toggle('active', isStudied(key));
  return isStudied(key);
}
function countStudiedInChapter(ch) {
  if (!ch || !ch.kps) return 0;
  let n = 0;
  for (let i = 0; i < ch.kps.length; i++) {
    if (isStudied(studKPKey(ch.courseId, ch.num, i))) n++;
  }
  return n;
}
function countStudiedInCourse(courseId) {
  const chs = chaptersData.filter(function(c) { return c.courseId === courseId; });
  let total = 0, done = 0;
  chs.forEach(function(ch) {
    const t = ch.kps ? ch.kps.length : 0;
    total += t;
    done += countStudiedInChapter(ch);
  });
  return { total: total, done: done };
}
function kpStatusInfo(courseId, chNum, kpIdx) {
  const favK = favKPKey(courseId, chNum, kpIdx);
  const studK = studKPKey(courseId, chNum, kpIdx);
  if (isFavorite(favK)) return { cls: 'fav', label: '★ 收藏' };
  if (isStudied(studK)) return { cls: 'studied', label: '✓ 已学' };
  return { cls: 'unstudied', label: '○ 未学' };
}


/* ═══════ 侧边栏 ═══════ */

function toggleSidebar() {

  const sidebar = document.getElementById('sidebar');

  const main = document.getElementById('mainContent');

  state.sidebarCollapsed = !state.sidebarCollapsed;

  sidebar.classList.toggle('collapsed', state.sidebarCollapsed);

  main.classList.toggle('expanded', state.sidebarCollapsed);

}

document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);



/* ═══════ 打开章节（兼容仪表盘调用） ═══════ */

function openChapter(num) {

  navigate('courses');

  setTimeout(() => openChapterView(num), 100);

}



/* ═══════ 设置页面 ═══════ */

function switchSettings(el, sectionId) {

  document.querySelectorAll('.settings-nav-item').forEach(b => b.classList.remove('active'));

  document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));

  el.classList.add('active');

  const section = document.getElementById('settings-' + sectionId);

  if (section) section.classList.add('active');

}



/* ═══════ 聊天功能 ═══════ */

function getTime() { return new Date().toLocaleTimeString('zh-CN', { hour:'2-digit', minute:'2-digit' }); }

function autoResize(textarea) { textarea.style.height='auto'; textarea.style.height=Math.min(textarea.scrollHeight,120)+'px'; }

function handleChatKey(e) { if (e.key==='Enter'&&!e.shiftKey) { e.preventDefault(); sendMessage(); } }

function sendQuick(text) { const i=document.getElementById('chatInput'); i.value=text; sendMessage(); }



function sendMessage() {

  const input = document.getElementById('chatInput');

  const text = input.value.trim();

  if (!text || state.isTyping) return;

  const welcome = document.querySelector('.chat-welcome');

  if (welcome) welcome.remove();

  appendMessage('user', text);

  state.chatMessages.push({ role:'user', content:text });

  input.value = ''; input.style.height = 'auto';

  showTyping();

  // 真实调用 DeepSeek API

  callAIAPI(text)

    .then(reply => {

      removeTyping();

      appendAIMessage(reply);

      state.chatMessages.push({ role:'assistant', content:reply });

    })

    .catch(err => {

      removeTyping();

      console.error('[DeepSeek API 错误]', err);

      const errMsg = '❌ 调用失败:' + (err.message || '网络异常') + '\n\n可能原因:\n1. key 已过期或被 DeepSeek 停用\n2. 月度额度已用完\n3. 浏览器 CORS 限制(可换 Edge/Chrome 重试)';

      appendAIMessage(errMsg);

      state.chatMessages.push({ role:'assistant', content:errMsg });

    });

}



function appendMessage(role, content) {

  const messages = document.getElementById('chatMessages');

  const div = document.createElement('div');

  div.className = `message ${role}`;

  const avatarContent = role === 'user' ? '林' : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';

  div.innerHTML = `<div class="msg-avatar">${avatarContent}</div><div><div class="msg-bubble">${escapeHtml(content).replace(/\n/g,'<br>')}</div><div class="msg-time">${getTime()}</div></div>`;

  messages.appendChild(div);

  setTimeout(function(){ renderMath(div); }, 50);

  scrollToBottom();

}



function showTyping() {

  state.isTyping = true;

  const messages = document.getElementById('chatMessages');

  const div = document.createElement('div');

  div.className = 'message ai'; div.id = 'typingIndicator';

  div.innerHTML = '<div class="msg-avatar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg></div><div class="msg-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';

  messages.appendChild(div); scrollToBottom();

}



function removeTyping() { const i=document.getElementById('typingIndicator'); if(i)i.remove(); state.isTyping=false; }

function scrollToBottom() { const m=document.getElementById('chatMessages'); m.scrollTop=m.scrollHeight; }

function escapeHtml(text) { return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }



function clearChat() {

  const messages = document.getElementById('chatMessages');

  messages.innerHTML = `<div class="chat-welcome"><div class="welcome-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg></div><h2>你好，我是互动课堂 AI</h2><p>你的高等数学 AI 辅导老师，随时帮你解题、讲概念、理思路</p><div class="quick-prompts"><button class="quick-btn" onclick="sendQuick('请详细讲解洛必达法则的使用条件和步骤')">洛必达法则</button><button class="quick-btn" onclick="sendQuick('不定积分的凑微分法和分部积分法有什么区别？')">积分方法对比</button><button class="quick-btn" onclick="sendQuick('帮我求 $\\lim_{x \\to 0} \\frac{\\sin x}{x}$ 并详细推导')">经典极限求解</button><button class="quick-btn" onclick="sendQuick('帮我制定高数期末复习计划')">制定复习计划</button></div></div>`;

  state.chatMessages = [];

  setTimeout(function(){ renderMath(messages); }, 80);

}



const mockResponses = [

  '这是一个很好的问题！\n\n**洛必达法则**的使用条件：\n1. 极限类型必须是 **0/0** 或 **∞/∞** 型未定式\n2. 分子分母在极限点附近**均可导**，且分母导数不为零\n\n**使用步骤**：\n- 第一步：判断是否为 0/0 或 ∞/∞ 型\n- 第二步：分别对分子分母求导\n- 第三步：求导后的极限值即为原极限\n- 注意：若仍为未定式，可**连续使用**洛必达法则',

  '关于不定积分的两种核心方法：\n\n**凑微分法（第一类换元）**\n思路：将 dx 前面的部分"凑"成 d(某函数)\n例：∫ 2x·cos(x²) dx = ∫ cos(x²) d(x²) = sin(x²) + C\n\n**分部积分法**\n公式：∫ u dv = uv - ∫ v du\n选 u 的口诀：**"反对幂三指"**',

  '**经典极限推导：lim(x→0) sin(x)/x = 1**\n\n证明过程（同济教材方法）：\n1. 作单位圆，设圆心角 x (弧度)\n2. 比较三个面积：sin(x)/2 < x/2 < tan(x)/2\n3. 化简得：cos(x) < sin(x)/x < 1\n4. 由**夹逼定理**得：lim(x→0) sin(x)/x = 1',

  '为你制定一份高数期末复习计划（同济第八版）：\n\n**第 1-2 周：基础巩固** - 极限、导数、中值定理\n**第 3-4 周：积分突破** - 不定积分 + 定积分\n**第 5 周：应用与进阶** - 定积分应用 + 微分方程\n**第 6 周：模拟冲刺** - 做近 5 年真题\n\n**核心原则**：每天至少 2 小时，**动手算**不能只看！',

];



function simulateAIResponse(userInput) {

  setTimeout(() => {

    removeTyping();

    const reply = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    appendAIMessage(reply);

    state.chatMessages.push({ role:'assistant', content:reply });

  }, 800 + Math.random() * 600);

}



function appendAIMessage(content) {

  const messages = document.getElementById('chatMessages');

  const div = document.createElement('div');

  div.className = 'message ai';

  div.innerHTML = '<div class="msg-avatar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg></div><div><div class="msg-bubble">'+formatMarkdown(content)+'</div><div class="msg-time">'+getTime()+'</div></div>';

  messages.appendChild(div);

  setTimeout(function(){ renderMath(div); }, 50);

  scrollToBottom();

}



function formatMarkdown(text) {

  return escapeHtml(text)

    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')

    .replace(/\*(.+?)\*/g,'<em>$1</em>')

    .replace(/`(.+?)`/g,'<code style="background:rgba(99,102,241,0.15);padding:1px 5px;border-radius:4px;font-size:92%">$1</code>')

    .replace(/^• (.+)$/gm,'<span style="display:block;padding-left:12px">• $1</span>')

    .replace(/^\d+\. (.+)$/gm,(m,p1)=>'<span style="display:block;padding-left:12px">'+m+'</span>')

    .replace(/\n/g,'<br>');

}



/* ─── 千问 API 接入（经 wgooold New API 中转） ─── */

// 千问 API 配置（key 明文存于前端,公开仓库部署请注意:key 全网可见,务必在平台后台设置月度额度上限以防盗刷）

const DEEPSEEK_API_KEY = "sk-FrCDClgwciZe12Omy9z7CUCAasv3m2KQWwXN6Zl3dac1T1aq";

const DEEPSEEK_API_URL = "https://wgooold.cn/v1/chat/completions";

const DEEPSEEK_MODEL = "Qwen3.6-27B";

// 月度额度告警(单位:元)。超过该值会在聊天界面顶部显示告警条

const MONTHLY_BUDGET_YUAN = 10;



async function callAIAPI(userMessage) {

  const response = await fetch(DEEPSEEK_API_URL, {

    method: 'POST',

    headers: {

      'Content-Type': 'application/json',

      'Authorization': 'Bearer ' + DEEPSEEK_API_KEY

    },

    body: JSON.stringify({

      model: DEEPSEEK_MODEL,

      messages: [

        { role: 'system', content: '你是互动课堂的 AI 辅导老师,擅长高等数学。用简体中文回答,分步讲解概念,公式用 LaTeX 包裹(如 $x^2$ 或 $$\\int x dx$$)。回答简洁清晰,关键步骤用编号列表。' },

        ...state.chatMessages,

        { role: 'user', content: userMessage }

      ],

      stream: false,

      temperature: 0.7

    })

  });

  if (!response.ok) {

    const err = await response.text();

    throw new Error('API 请求失败 ' + response.status + ': ' + err);

  }

  const data = await response.json();

  const reply = data.choices[0].message.content;

  // 累计本月用量(根据返回的 usage 字段估算费用)

  if (data.usage) {

    trackUsage(data.usage.prompt_tokens || 0, data.usage.completion_tokens || 0);

  }

  return reply;

}



function getAPIKey() { return DEEPSEEK_API_KEY; }

function getSelectedModel() { return DEEPSEEK_MODEL; }



/* ─── 用量追踪 & 额度告警 ─── */

function trackUsage(promptTokens, completionTokens) {

  // DeepSeek 定价:输入 ¥1/M tokens,输出 ¥2/M tokens(2026年6月参考价,以官网为准)

  const costYuan = (promptTokens / 1e6) * 1 + (completionTokens / 1e6) * 2;

  const now = new Date();

  const monthKey = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');

  const stored = JSON.parse(localStorage.getItem('hudongketang_usage') || '{}');

  if (stored.month !== monthKey) {

    stored.month = monthKey;

    stored.cost = 0;

    stored.tokens = 0;

    stored.count = 0;

  }

  stored.cost = +(stored.cost + costYuan).toFixed(6);

  stored.tokens += promptTokens + completionTokens;

  stored.count = (stored.count || 0) + 1;

  localStorage.setItem('hudongketang_usage', JSON.stringify(stored));

  renderBudgetBar(stored);

}



function getUsage() {

  const stored = JSON.parse(localStorage.getItem('hudongketang_usage') || '{}');

  const now = new Date();

  const monthKey = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');

  if (stored.month !== monthKey) {

    return { month: monthKey, cost: 0, tokens: 0, count: 0 };

  }

  return stored;

}



function renderBudgetBar(usage) {

  let bar = document.getElementById('budgetBar');

  if (!bar) {

    bar = document.createElement('div');

    bar.id = 'budgetBar';

    bar.style.cssText = 'position:sticky;top:0;z-index:50;padding:8px 16px;font-size:0.85rem;text-align:center;border-bottom:1px solid var(--border);backdrop-filter:blur(10px);transition:all 0.3s;';

    const chatMain = document.querySelector('.chat-main');

    if (chatMain) chatMain.insertBefore(bar, chatMain.firstChild);

  }

  const pct = Math.min((usage.cost / MONTHLY_BUDGET_YUAN) * 100, 100);

  const overBudget = usage.cost >= MONTHLY_BUDGET_YUAN;

  const nearBudget = usage.cost >= MONTHLY_BUDGET_YUAN * 0.8;

  let bg, fg, icon, msg;

  if (overBudget) {

    bg = 'rgba(239,68,68,0.18)';

    fg = '#fca5a5';

    icon = '🚨';

    msg = '本月额度已用完(¥' + usage.cost.toFixed(2) + ' / ¥' + MONTHLY_BUDGET_YUAN + '),请去 DeepSeek 后台充值或更换 key';

  } else if (nearBudget) {

    bg = 'rgba(245,158,11,0.15)';

    fg = '#fcd34d';

    icon = '⚠️';

    msg = '本月用量接近上限:¥' + usage.cost.toFixed(2) + ' / ¥' + MONTHLY_BUDGET_YUAN + ' (' + pct.toFixed(0) + '%)';

  } else {

    bg = 'rgba(16,185,129,0.12)';

    fg = '#6ee7b7';

    icon = '💰';

    msg = '本月 AI 用量:¥' + usage.cost.toFixed(4) + ' / ¥' + MONTHLY_BUDGET_YUAN + ' · ' + usage.count + ' 次对话 · ' + usage.tokens + ' tokens';

  }

  bar.style.background = bg;

  bar.style.color = fg;

  bar.innerHTML = icon + ' ' + msg + (overBudget ? '' : ' · <span style="opacity:0.7">key 公开,请在 DeepSeek 后台设置月度额度上限</span>');

}



function initBudgetBar() {

  const usage = getUsage();

  if (usage.cost > 0) renderBudgetBar(usage);

  renderSettingsUsage(usage);

}



function renderSettingsUsage(usage) {

  const panel = document.getElementById('settingsUsagePanel');

  if (!panel) return;

  const pct = Math.min((usage.cost / MONTHLY_BUDGET_YUAN) * 100, 100);

  const overBudget = usage.cost >= MONTHLY_BUDGET_YUAN;

  const barColor = overBudget ? '#ef4444' : (pct >= 80 ? '#f59e0b' : '#10b981');

  panel.innerHTML =

    '<div style="display:flex;justify-content:space-between;margin-bottom:6px"><span>' + usage.month + ' 用量</span><span style="color:' + barColor + ';font-weight:600">¥' + usage.cost.toFixed(4) + ' / ¥' + MONTHLY_BUDGET_YUAN + '</span></div>' +

    '<div style="height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;margin-bottom:8px"><div style="height:100%;width:' + pct + '%;background:' + barColor + ';transition:width 0.3s"></div></div>' +

    '<div style="display:flex;justify-content:space-between;font-size:0.78rem;color:var(--text-muted)"><span>' + (usage.count || 0) + ' 次对话</span><span>' + (usage.tokens || 0) + ' tokens</span></div>';

}



/* ─── 搜索 ─── */

document.getElementById('searchInput').addEventListener('keydown', e => {

  if (e.key === 'Enter') {

    var q = e.target.value.trim();

    if (!q) return;

    if (searchResultsCache.length === 0) handleSearch();

    if (searchResultsCache.length > 0) {

      searchNavigate(encodeURIComponent(JSON.stringify(searchResultsCache[0])));

    }

  } else if (e.key === 'Escape') {

    var dd = document.getElementById('searchDropdown');

    if (dd) dd.classList.remove('active');

  }

});



/* ─── 动态问候 ─── */

function updateGreeting() {

  const h = new Date().getHours();

  let g = h<12?'早上好':h<18?'下午好':'晚上好';

  const el = document.querySelector('#page-dashboard .page-title');

  if (el) el.textContent = `${g}，陈曦 ${h<12?'☀️':h<18?'🌤️':'🌙'}`;

}

updateGreeting();



/* ─── 初始化 ─── */

updateFavBadge();
navigate('dashboard');



/* ═══════ 主题切换 ═══════ */

function initTheme() {

  const saved = localStorage.getItem('hdt_theme') || 'dark';

  applyTheme(saved);

}



function applyTheme(theme) {

  document.body.classList.remove('light-theme', 'minimal-theme', 'glass-theme', 'textbook-theme');

  if (theme === 'light') {

    document.body.classList.add('light-theme');

  } else if (theme === 'minimal') {

    document.body.classList.add('minimal-theme');

  } else if (theme === 'glass') {

    document.body.classList.add('glass-theme');

  } else if (theme === 'textbook') {

    document.body.classList.add('textbook-theme');

  } else if (theme === 'auto') {

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (!prefersDark) document.body.classList.add('light-theme');

  }

  localStorage.setItem('hdt_theme', theme);

  updateThemeUI(theme);

}



function setTheme(theme) {

  applyTheme(theme);

}



function updateThemeUI(theme) {

  document.querySelectorAll('.theme-option').forEach(function(opt) {

    opt.classList.remove('active');

    var span = opt.querySelector('span');

    if (!span) return;

    var text = span.textContent;

    if (theme === 'dark' && text.indexOf('深色') !== -1) opt.classList.add('active');

    if (theme === 'light' && text.indexOf('浅色') !== -1 && text.indexOf('极简') === -1) opt.classList.add('active');

    if (theme === 'minimal' && text.indexOf('极简') !== -1) opt.classList.add('active');

    if (theme === 'glass' && text.indexOf('玻璃') !== -1) opt.classList.add('active');

    if (theme === 'textbook' && text.indexOf('教科书') !== -1) opt.classList.add('active');

    if (theme === 'auto' && text.indexOf('跟随') !== -1) opt.classList.add('active');

  });

}



document.addEventListener('DOMContentLoaded', initTheme);

document.addEventListener('DOMContentLoaded', initBudgetBar);



/* ══════ 搜索功能 ══════ */

var searchResultsCache = [];

function escapeHtml(s) {

  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) {

    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];

  });

}

function handleSearch() {

  var query = document.getElementById('searchInput').value.trim().toLowerCase();

  var dropdown = document.getElementById('searchDropdown');

  if (!query) { dropdown.classList.remove('active'); searchResultsCache = []; return; }



  var results = [];



  // 课程

  if (typeof coursesData !== 'undefined') {

    coursesData.forEach(function(course) {

      if ((course.name && course.name.toLowerCase().indexOf(query) !== -1) ||

          (course.desc && course.desc.toLowerCase().indexOf(query) !== -1)) {

        results.push({ kind:'course', type:'课程', title: course.name, desc: course.desc, id: course.id });

      }

    });

  }



  // 章节 + 知识点（基于动态 chaptersData，覆盖全部课程）

  if (typeof chaptersData !== 'undefined') {

    chaptersData.forEach(function(ch) {

      if (ch.title && ch.title.toLowerCase().indexOf(query) !== -1) {

        results.push({ kind:'chapter', type:'章节', title:'第'+ch.num+'章 · '+ch.title,

          desc:(ch.vol ? '卷'+ch.vol+' · ' : '') + '点击查看本章知识点',

          courseId: ch.courseId, chapterNum: ch.num });

      }

      if (ch.kps) {

        ch.kps.forEach(function(kp, i) {

          var hay = (kp.name || '') + ' ' + (kp.desc || '') + ' ' + (kp.formula || '');

          if (hay.toLowerCase().indexOf(query) !== -1) {

            results.push({ kind:'kp', type:'知识点', title:'第'+ch.num+'章 · '+kp.name,

              desc: ch.title + (kp.desc ? (' · '+kp.desc) : ''),

              courseId: ch.courseId, chapterNum: ch.num, kpIndex: i });

          }

        });

      }

    });

  }



  // 公式实验室工具

  var tools = [

    {key:'integral', name:'积分计算器'}, {key:'limit', name:'极限求解器'},
    {key:'derivative', name:'导数求导工具'}, {key:'series', name:'级数判敛器'},
    {key:'determinant', name:'行列式计算器'}, {key:'matrix-reduce', name:'矩阵行变换'},
    {key:'bayes', name:'全概率与贝叶斯'}, {key:'distribution', name:'概率分布计算'},
    {key:'normal-prob', name:'正态分布概率'}, {key:'expectation', name:'期望与方差'},
    {key:'hypothesis-test', name:'假设检验'}

  ];

  tools.forEach(function(t) {

    if (t.name.toLowerCase().indexOf(query) !== -1) {

      results.push({ kind:'tool', type:'工具', title: t.name, desc:'公式实验室 · 点击打开', key: t.key });

    }

  });



  searchResultsCache = results;



  if (results.length === 0) {

    dropdown.innerHTML = '<div class="search-no-results">没有找到匹配结果</div>';

  } else {

    dropdown.innerHTML = results.map(function(r) {

      var enc = encodeURIComponent(JSON.stringify(r));

      return '<div class="search-result-item" onclick="searchNavigate(\'' + enc + '\')">' +

        '<div class="search-result-type">' + escapeHtml(r.type) + '</div>' +

        '<div class="search-result-title">' + escapeHtml(r.title) + '</div>' +

        '<div class="search-result-desc">' + escapeHtml(r.desc || '') + '</div>' +

        '</div>';

    }).join('');

  }

  dropdown.classList.add('active');

}



function showSearch() {

  var query = document.getElementById('searchInput').value.trim();

  if (query) handleSearch();

}



function searchNavigate(dataStr) {

  var data;

  try { data = JSON.parse(decodeURIComponent(dataStr)); } catch(e) { return; }

  document.getElementById('searchDropdown').classList.remove('active');

  document.getElementById('searchInput').value = '';

  searchResultsCache = [];

  if (data.kind === 'course') {

    state.currentCourse = data.id;

    navigate('courses');

  } else if (data.kind === 'tool') {

    openFormulaTool(data.key);

  } else if (data.kind === 'chapter' || data.kind === 'kp') {

    navigate('courses');

    setTimeout(function() {

      var ch = (typeof chaptersData !== 'undefined')

        ? chaptersData.find(function(x) { return x.num === data.chapterNum && x.courseId === data.courseId; })

        : null;

      if (!ch) return;

      openChapterView(ch.num, ch.courseId);

      if (data.kind === 'kp') openVizView(ch.num, data.kpIndex);

    }, 80);

  }

}



/* ══════ 通知面板 ══════ */

function toggleNotif(event) {

  event.stopPropagation();

  var panel = document.getElementById('notifPanel');

  var isActive = panel.classList.contains('active');

  closeAllDropdowns();

  if (!isActive) {

    panel.classList.add('active');

    loadNotifications();

  }

}



function closeAllDropdowns() {

  var dd = document.getElementById('searchDropdown');

  if (dd) dd.classList.remove('active');

  var np = document.getElementById('notifPanel');

  if (np) np.classList.remove('active');

}



function loadNotifications() {

  var notifs = [];

  try { notifs = JSON.parse(localStorage.getItem('hdt_notifs') || '[]'); } catch(e) {}

  if (notifs.length === 0) {

    notifs = [

      { title: '欢迎来到互动课堂！', body: '开始你的高等数学学习之旅吧。', time: '刚刚', read: false },

      { title: '课程更新提醒', body: '第5章 定积分已基本完成，快去学习吧！', time: '2小时前', read: false },

      { title: '每日挑战已刷新', body: '今天的挑战题已更新，快来挑战！', time: '5小时前', read: true },

    ];

    localStorage.setItem('hdt_notifs', JSON.stringify(notifs));

  }

  renderNotifications(notifs);

  updateNotifDot(notifs);

}



function renderNotifications(notifs) {

  var list = document.getElementById('notifList');

  if (!list) return;

  if (notifs.length === 0) {

    list.innerHTML = '<div class="notif-empty">暂无通知</div>';

    return;

  }

  list.innerHTML = notifs.map(function(n, i) {

    return '<div class="notif-item' + (n.read ? '' : ' unread') + '" onclick="markNotifRead(' + i + ')">' +

      '<div class="notif-title">' + n.title + '</div>' +

      '<div class="notif-body">' + n.body + '</div>' +

      '<div class="notif-time">' + n.time + '</div>' +

      '</div>';

  }).join('');

}



function markNotifRead(idx) {

  var notifs = JSON.parse(localStorage.getItem('hdt_notifs') || '[]');

  if (notifs[idx]) notifs[idx].read = true;

  localStorage.setItem('hdt_notifs', JSON.stringify(notifs));

  loadNotifications();

}



function markAllRead() {

  var notifs = JSON.parse(localStorage.getItem('hdt_notifs') || '[]');

  notifs.forEach(function(n) { n.read = true; });

  localStorage.setItem('hdt_notifs', JSON.stringify(notifs));

  loadNotifications();

}



function updateNotifDot(notifs) {

  var dot = document.getElementById('notifDot');

  if (!dot) return;

  var hasUnread = notifs.some(function(n) { return !n.read; });

  dot.style.display = hasUnread ? 'block' : 'none';

}



document.addEventListener('click', function(e) {

  var dd = document.getElementById('searchDropdown');

  var inp = document.getElementById('searchInput');

  if (dd && !dd.contains(e.target) && e.target !== inp) {

    dd.classList.remove('active');

  }

  var np = document.getElementById('notifPanel');

  var nb = document.querySelector('[title="通知"]');

  if (np && !np.contains(e.target) && nb && !nb.contains(e.target)) {

    np.classList.remove('active');

  }

});



/* 页面加载时初始化通知红点 */

document.addEventListener('DOMContentLoaded', function() {

  var notifs = [];

  try { notifs = JSON.parse(localStorage.getItem('hdt_notifs') || '[]'); } catch(e) {}

  updateNotifDot(notifs);

});



/* ═════ 公式工具弹窗 ═════ */

  var forms = {

    'integral': [

      { label: '函数 f(x)', id: 'fmFunc', placeholder: '例: x*sin(x)' },

      { label: '下限 a', id: 'fmLower', placeholder: '例: 0', half: true },

      { label: '上限 b', id: 'fmUpper', placeholder: '例: PI', half: true },

      { label: '不定积分', type: 'checkbox', id: 'fmIndefinite' },

    ],

    'limit': [

      { label: '函数 f(x)', id: 'fmFunc', placeholder: '例: sin(x)/x' },

      { label: '趋近 x →', id: 'fmLimit', placeholder: '例: 0 或 inf' },

    ],

    'derivative': [

      { label: '函数 f(x)', id: 'fmFunc', placeholder: '例: x^2*exp(x)' },

      { label: '求导阶数', id: 'fmOrder', placeholder: '例: 1', value: '1' },

    ],

        'determinant': [
      { label: '行数', id: 'dmRows', type: 'select', options: ['2','3','4'], half: true },
      { label: '列数', id: 'dmCols', type: 'select', options: ['2','3','4'], half: true },
      { type: 'matrix-grid', id: 'dmGrid' },
      { label: '计算方法', id: 'fmMethod', type: 'select',
        options: ['自动选择最优','按行展开','化简为上三角'] },
    ],
    'matrix-reduce': [
      { label: '行数', id: 'dmRows', type: 'select', options: ['2','3','4'], half: true },
      { label: '列数', id: 'dmCols', type: 'select', options: ['3','4'], half: true },
      { type: 'matrix-grid', id: 'dmGrid' },
      { label: '目标形式', id: 'fmMethod', type: 'select',
        options: ['行最简形(RREF)','行阶梯形(REF)'] },
    ],
    'series': [

      { label: '级数通项 aₙ', id: 'fmFunc', placeholder: '例: 1/n^2' },

      { label: '判敛方法', id: 'fmMethod', type: 'select',

        options: ['比值法','根值法','比较法','积分法'] },

    ],

    'bayes': [

      { label: 'P(A|B) 条件概率', id: 'fmPAB', placeholder: '例: 0.95', value: '0.95' },

      { label: 'P(B) 先验概率', id: 'fmPB', placeholder: '例: 0.01', value: '0.01' },

      { label: 'P(A|¬B)', id: 'fmPANB', placeholder: '例: 0.05', value: '0.05' },

    ],

    'distribution': [

      { label: '分布类型', id: 'fmDist', type: 'select',

        options: ['二项分布 B(n,p)','泊松分布 P(λ)','几何分布 Geo(p)'] },

      { label: '参数 n / λ', id: 'fmParam1', placeholder: '例: 10', value: '10' },

      { label: '参数 p', id: 'fmParam2', placeholder: '例: 0.3', value: '0.3' },

      { label: '取值 k', id: 'fmK', placeholder: '例: 3', value: '3' },

    ],

    'normal-prob': [

      { label: '均值 μ', id: 'fmMu', placeholder: '例: 0', value: '0' },

      { label: '方差 σ²', id: 'fmSigma2', placeholder: '例: 1', value: '1' },

      { label: '区间左端 a', id: 'fmA', placeholder: '例: -1.96', value: '-1.96' },

      { label: '区间右端 b', id: 'fmB', placeholder: '例: 1.96', value: '1.96' },

    ],

    'expectation': [

      { label: '取值 x₁,x₂,…', id: 'fmXs', placeholder: '例: 0,1,2,3', value: '0,1,2,3' },

      { label: '概率 p₁,p₂,…', id: 'fmPs', placeholder: '例: 0.1,0.2,0.3,0.4', value: '0.1,0.2,0.3,0.4' },

    ],

    'hypothesis-test': [

      { label: '原假设 μ₀', id: 'fmMu0', placeholder: '例: 50', value: '50' },

      { label: '样本均值 x̄', id: 'fmMean', placeholder: '例: 52', value: '52' },

      { label: '样本量 n', id: 'fmN', placeholder: '例: 36', value: '36' },

      { label: '总体标准差 σ', id: 'fmSigma', placeholder: '例: 6', value: '6' },

      { label: '显著性水平 α', id: 'fmAlpha', placeholder: '例: 0.05', value: '0.05' },

      { label: '检验类型', id: 'fmType', type: 'select',

        options: ['双侧检验','右侧检验','左侧检验'] },

    ],

  };


function buildFormHtml(toolName) {

  var cfg = forms[toolName] || forms['integral'];

  var html = '';

  for (var i = 0; i < cfg.length; i++) {

    var f = cfg[i];

    if (f.half) {

      html += '<div class="form-group" style="flex:1;display:inline-block;"><label class="form-label">' +

        f.label + '</label><input class="form-input" id="' + f.id + '" placeholder="' + f.placeholder + '"></div>';

    } else if (f.type === 'checkbox') {

      html += '<div class="form-group"><label style="font-size:13px;display:flex;align-items:center;gap:6px;"><input type="checkbox" id="' + f.id + '"> ' + f.label + '</label></div>';

    } else if (f.type === 'matrix-grid') {

      html += '<div class="form-group"><label class="form-label">矩阵元素</label>';
      html += '<div id="'+f.id+'" class="matrix-grid" style="display:flex;flex-direction:column;gap:4px;margin-top:6px"></div></div>';

    } else if (f.type === 'select') {

      html += '<div class="form-group"><label class="form-label">' + f.label + '</label><select class="form-select" id="' + f.id + '">';

      for (var j = 0; j < f.options.length; j++) {

        html += '<option>' + f.options[j] + '</option>';

      }

      html += '</select></div>';

    } else {

      html += '<div class="form-group"><label class="form-label">' + f.label + '</label><input class="form-input" id="' + f.id + '" placeholder="' + f.placeholder + '"' + (f.value ? ' value="' + f.value + '"' : '') + '></div>';

    }

  }



  /* 两列并排的hack */

  html = html.replace(/inline-block;/g, 'inline-block;vertical-align:top;width:48%;');

  return html;

}



function switchProbTool(subTool) {

  var container = document.getElementById('probFormContainer');

  if (!container) return;

  container.dataset.tool = subTool;

  container.innerHTML = buildFormHtml(subTool);



  var tabs = document.querySelectorAll('.fm-tab');

  for (var i = 0; i < tabs.length; i++) {

    if (tabs[i].dataset.tool === subTool) tabs[i].classList.add('active');

    else tabs[i].classList.remove('active');

  }



  var result = document.getElementById('fmResult');

  if (result) { result.style.display = 'none'; result.innerHTML = ''; }

}



function openFormulaTool(toolName) {

  var modal = document.getElementById('formulaModal');

  var title = document.getElementById('formulaModalTitle');

  var body = document.getElementById('formulaModalBody');

  if (!modal || !body) return;







  var toolTitles = {

    'integral':'积分计算器', 'limit':'极限求解器',

    'derivative':'导数求导工具', 'series':'级数判敛器',
    'determinant':'行列式计算器', 'matrix-reduce':'矩阵行变换',
    'probability-suite':'概率论与数理统计工具箱',
    'bayes':'全概率与贝叶斯', 'distribution':'概率分布计算',
    'normal-prob':'正态分布概率', 'expectation':'期望与方差',
    'hypothesis-test':'假设检验'

  };



  title.textContent = toolTitles[toolName] || '工具';



  var html = '';

  if (toolName === 'probability-suite') {

    var probTools = [
      {key:'bayes', label:'全概率与贝叶斯'},
      {key:'distribution', label:'概率分布'},
      {key:'normal-prob', label:'正态概率'},
      {key:'expectation', label:'期望方差'},
      {key:'hypothesis-test', label:'假设检验'}
    ];

    html += '<div class="fm-tabs">';
    for (var t = 0; t < probTools.length; t++) {
      var pt = probTools[t];
      html += '<button class="fm-tab' + (pt.key === 'bayes' ? ' active' : '') + '" data-tool="' + pt.key + '" onclick="switchProbTool(\'' + pt.key + '\')">' + pt.label + '</button>';
    }
    html += '</div>';

    html += '<div id="probFormContainer" data-tool="bayes">' + buildFormHtml('bayes') + '</div>';

    html += '<button class="btn btn-primary full-width" style="margin-top:16px;" onclick="runFormulaTool(document.getElementById(\'probFormContainer\').dataset.tool)">计算</button>';

  } else {

    html += buildFormHtml(toolName);

    html += '<button class="btn btn-primary full-width" style="margin-top:16px;" onclick="runFormulaTool(\'' + toolName + '\')">计算</button>';

  }

  html += '<div id="fmResult" style="margin-top:16px;display:none;"></div>';



  body.innerHTML = html;

  /* 矩阵类工具：构建可编辑矩阵网格，并随行列数联动 */
  if (toolName === 'determinant' || toolName === 'matrix-reduce') {
    var dmRows = document.getElementById('dmRows');
    var dmCols = document.getElementById('dmCols');
    if (dmRows && dmCols) {
      buildMatrixGrid('dmGrid', dmRows, dmCols);
      dmRows.onchange = function () { buildMatrixGrid('dmGrid', dmRows, dmCols); };
      dmCols.onchange = function () { buildMatrixGrid('dmGrid', dmRows, dmCols); };
    }
  }

  modal.classList.add('active');

}



function closeFormulaModal() {

  var modal = document.getElementById('formulaModal');

  if (modal) modal.classList.remove('active');

}



/* ═══════ 真实计算引擎 (math.js + 数值算法) ═══════
   替代原"演示结果"占位字符串，输出真实数值与推导过程，
   可作为概率论 / 高等数学作业验证。依赖全局 math (vendor/math.min.js)。 */

function fmNum(x, prec) {
  if (x === null || x === undefined) return '—';
  if (typeof x === 'number' && isNaN(x)) return '—';
  prec = prec || 6;
  if (Math.abs(x) < 1e-12) return '0';
  if (Number.isInteger(x) && Math.abs(x) < 1e15) return x.toString();
  var s = x.toFixed(prec);
  return s.replace(/\.?0+$/, '');
}

function fmEvalExpr(expr, scope) {
  try { return Number(math.evaluate(expr, scope || {})); } catch (e) { return NaN; }
}

function fmCompile(expr) {
  var node = math.parse(expr);
  var code = node.compile();
  return function (x) {
    try { return Number(code.evaluate({ x: x })); } catch (e) { return NaN; }
  };
}

function fmFmtExprTex(expr) {
  try { return math.parse(expr).toTex(); } catch (e) { return expr; }
}

function fmSimpson(f, a, b) {
  var m = (a + b) / 2;
  return (b - a) / 6 * (f(a) + 4 * f(m) + f(b));
}
function fmAdaptiveIntegrate(f, a, b, tol, depth) {
  tol = tol || 1e-9; depth = depth || 16;
  function rec(a, b, fa, fb, fm, whole, d) {
    var m = (a + b) / 2;
    var lm = (a + m) / 2, rm = (m + b) / 2;
    var flm = f(lm), frm = f(rm);
    var left = (m - a) / 6 * (fa + 4 * flm + fm);
    var right = (b - m) / 6 * (fm + 4 * frm + fb);
    var delta = left + right - whole;
    if (d <= 0 || Math.abs(delta) <= 15 * tol) return left + right + delta / 15;
    return rec(a, m, fa, fm, flm, left, d - 1) + rec(m, b, fm, fb, frm, right, d - 1);
  }
  var fa = f(a), fb = f(b), fm = f((a + b) / 2);
  return rec(a, b, fa, fb, fm, fmSimpson(f, a, b), depth);
}

function fmNormalCDF(z) {
  if (typeof math !== 'undefined' && math.erf) return 0.5 * (1 + math.erf(z / Math.SQRT2));
  var t = 1 / (1 + 0.3275911 * Math.abs(z));
  var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z);
  return z >= 0 ? y : -y;
}

function fmProbit(p) {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  var a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
  var b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
  var c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
  var d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
  var plow = 0.02425, phigh = 1 - plow, q, r;
  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) / ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
  } else if (p <= phigh) {
    q = p - 0.5; r = q * q;
    return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q / (((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) / ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
  }
}

function fmGet(id, def) {
  var el = document.getElementById(id);
  if (!el) return def;
  var v = parseFloat(el.value);
  return isNaN(v) ? def : v;
}
function fmGetStr(id, def) {
  var el = document.getElementById(id);
  if (!el) return def;
  return (el.value || '').trim() || def;
}
function fmGetSel(id, def) {
  var el = document.getElementById(id);
  if (!el) return def;
  return el.value || def;
}
function fmComb(n, k) {
  if (typeof math !== 'undefined' && math.combinations) return math.combinations(n, k);
  k = Math.max(0, Math.min(k, n));
  var r = 1;
  for (var i = 0; i < k; i++) r = r * (n - i) / (i + 1);
  return r;
}
function fmFactorial(n) {
  if (typeof math !== 'undefined' && math.factorial) return math.factorial(n);
  var r = 1; for (var i = 2; i <= n; i++) r *= i; return r;
}

function renderFMResult(out) {
  var html = '<div class="fm-result-box">';
  html += '<div class="fm-result-label">结果（真实计算）</div>';
  html += '<div class="fm-result-value">' + (out.value || '') + '</div>';
  html += '</div>';
  if (out.note) html += '<div class="fm-result-note">' + out.note + '</div>';
  if (out.steps && out.steps.length) {
    html += '<div class="fm-steps" style="margin-top:12px;">';
    for (var i = 0; i < out.steps.length; i++) {
      html += '<div class="fm-step"><span class="fm-step-num">' + (i + 1) + '</span>' + out.steps[i] + '</div>';
    }
    html += '</div>';
  }
  return html;
}

/* 表达式符号积分（聚焦常见高数题型），返回表达式字符串 */
function fmHasX(node){ if(node.type==='SymbolNode') return node.name==='x'; if(node.args) return node.args.some(fmHasX); return false; }
function fmLinearCoeff(node){
  try{
    var ev=function(xv){ return Number(node.evaluate({x:xv})); };
    var b=ev(0), p1=ev(1);
    if(isNaN(b)||isNaN(p1)) return null;
    var a=p1-b, p2=ev(2);
    if(Math.abs((b+2*a)-p2)>1e-6) return null;
    return {a:a,b:b};
  }catch(e){ return null; }
}
function numStr0(n){ if(Number.isInteger(n)) return n.toString(); return parseFloat(n.toPrecision(8)).toString(); }
function fmIntNode(node){
  var t=node.type;
  if(t==='ConstantNode') return numStr0(node.value)+'*x';
  if(t==='SymbolNode') return node.name==='x' ? 'x^2/2' : node.name+'*x';
  if(t==='FunctionNode'){
    var fn=node.fn.name, arg=node.args[0], lc=fmLinearCoeff(arg);
    if(lc&&fn==='exp') return '(1/('+numStr0(lc.a)+'))*exp('+arg.toString()+')';
    if(lc&&fn==='sin') return '(-1/('+numStr0(lc.a)+'))*cos('+arg.toString()+')';
    if(lc&&fn==='cos') return '(1/('+numStr0(lc.a)+'))*sin('+arg.toString()+')';
    throw new Error('暂不支持函数 '+fn+' 的符号积分');
  }
  if(t==='OperatorNode'){
    var op=node.op;
    if(op==='+'||op==='-') return fmIntNode(node.args[0])+op+fmIntNode(node.args[1]);
    if(op==='*'){
      var nonX=node.args.filter(function(p){return !fmHasX(p);});
      var xs=node.args.filter(fmHasX);
      if(nonX.length===1&&xs.length===1) return '('+nonX[0].toString()+')*('+fmIntNode(xs[0])+')';
      var xn=node.args.find(function(p){return p.type==='SymbolNode'&&p.name==='x';});
      var gn=node.args.find(function(p){return !(p.type==='SymbolNode'&&p.name==='x');});
      if(xn&&gn&&gn.type==='FunctionNode'){
        var lc2=fmLinearCoeff(gn.args[0]);
        if(lc2){ var a=lc2.a, gs=gn.fn.name, ag=gn.args[0].toString();
          if(gs==='exp') return '(x*exp('+ag+')/'+numStr0(a)+' - exp('+ag+')/('+numStr0(a*a)+'))';
          if(gs==='sin') return '(-x*cos('+ag+')/'+numStr0(a)+' + sin('+ag+')/('+numStr0(a*a)+'))';
          if(gs==='cos') return '(x*sin('+ag+')/'+numStr0(a)+' + cos('+ag+')/('+numStr0(a*a)+'))';
        }
      }
      throw new Error('暂不支持该乘积形式');
    }
    if(op==='^'){
      var base=node.args[0], e=node.args[1];
      if(base.type==='SymbolNode'&&base.name==='x'&&e.type==='ConstantNode'){
        var n=e.value;
        if(typeof n==='number'&&n!==-1) return 'x^('+numStr0(n+1)+')/('+numStr0(n+1)+')';
      }
      throw new Error('暂不支持该幂次');
    }
    if(op==='/'){
      var nu=node.args[0], de=node.args[1], lc3=fmLinearCoeff(de);
      if(lc3&&!fmHasX(nu)) return '('+numStr0(1/lc3.a)+')*log(abs('+de.toString()+'))';
      throw new Error('暂不支持该分式');
    }
  }
  throw new Error('暂不支持的表达式类型');
}
function fmIntSymbolic(expr){ return fmIntNode(math.parse(expr)); }

/* 数值极限 */
function fmNumericLimit(f, target){
  if(!isFinite(target)){
    var xs=[1e1,1e2,1e3,1e4,1e5];
    var vs=xs.map(function(x){return f(target>0?x:-x);});
    if(vs.every(function(v){return isFinite(v);})){
      if(Math.abs(vs[4]-vs[3])<1e-3 && Math.abs(vs[3]-vs[2])<1e-3) return vs[4];
      if(Math.abs(vs[4])>1e6) return vs[4]>0?Infinity:-Infinity;
    }
    return 'DNE';
  }
  var hs=[1e-1,1e-2,1e-3,1e-4,1e-5,1e-6], L=[], R=[];
  for(var i=0;i<hs.length;i++){ L.push(f(target-hs[i])); R.push(f(target+hs[i])); }
  var l=L[L.length-1], r=R[R.length-1];
  if(!isFinite(l)&&!isFinite(r)){ if(l>0||r>0) return Infinity; return -Infinity; }
  if(!isFinite(l)) return isFinite(r)&&Math.abs(R[4]-R[3])<1e-4 ? r : 'DNE';
  if(!isFinite(r)) return isFinite(l)&&Math.abs(L[4]-L[3])<1e-4 ? l : 'DNE';
  if(Math.abs(l-r) < 1e-3*(Math.abs(l)+Math.abs(r)+1)) return (l+r)/2;
  return 'DNE';
}

function parsePoint(s){
  s=(s||'').trim().toLowerCase().replace('∞','inf');
  if(s==='') return null;
  if(s==='inf'||s==='+inf'||s==='infinity') return Infinity;
  if(s==='-inf') return -Infinity;
  try { return Number(math.evaluate(s)); } catch(e){ return null; }
}

var FMEngine = {
  'integral': function(){
    var expr=fmGetStr('fmFunc',''); if(!expr) throw new Error('请输入函数 f(x)');
    var f=fmCompile(expr);
    var indef=document.getElementById('fmIndefinite') && document.getElementById('fmIndefinite').checked;
    if(indef){
      var anti;
      try { anti=fmIntSymbolic(expr); } catch(e){ throw new Error(e.message+'，请取消“不定积分”改用定积分数值计算'); }
      var F=math.parse(anti).compile();
      var h=1e-5, ok=true;
      for(var xv=-2;xv<=2;xv+=0.5){ if(Math.abs(xv)<1e-9)continue; var dF=(F.evaluate({x:xv+h})-F.evaluate({x:xv-h}))/(2*h); var fx=f(xv); if(Math.abs(dF-fx)/(Math.abs(fx)+1e-9)>1e-3){ok=false;break;} }
      var tex=fmFmtExprTex(expr), antiTex=math.parse(anti).toTex();
      var steps=['对 f(x)='+expr+' 求不定积分','符号积分（聚焦常见题型）','∫ f(x)dx = '+anti+' + C','验算：对结果求导应回到 f(x)'+(ok?' ✓':' ✗')];
      return { value:'$$ \\int '+tex+'\\,dx = '+antiTex+' + C $$', steps:steps, note:'符号结果，可用作手算对照；若提示不支持请改用定积分' };
    }
    var aStr=fmGetStr('fmLower','0'), bStr=fmGetStr('fmUpper','PI');
    var av=parsePoint(aStr), bv=parsePoint(bStr);
    if(av===null||bv===null) throw new Error('积分上下限需为数值或常量（0, PI, E, inf）');
    if(!isFinite(av)||!isFinite(bv)) throw new Error('暂仅支持有限区间的定积分数值计算');
    var val=fmAdaptiveIntegrate(f, av, bv);
    if(!isFinite(val)) throw new Error('积分不收敛或区间含奇点');
    var tex2=fmFmtExprTex(expr);
    var steps=['被积函数 f(x) = '+expr,'积分区间 ['+aStr+', '+bStr+'] = ['+fmNum(av)+', '+fmNum(bv)+']','采用自适应 Simpson 数值积分（容差 1e-9）','∫ f(x)dx ≈ '+fmNum(val,8)];
    return { value:'$$ \\int_{'+aStr+'}^{'+bStr+'}'+tex2+'\\,dx \\approx '+fmNum(val,8)+' $$<br>数值结果 ≈ '+fmNum(val,8), steps:steps };
  },
  'limit': function(){
    var expr=fmGetStr('fmFunc',''); if(!expr) throw new Error('请输入函数 f(x)');
    var limStr=fmGetStr('fmLimit','0');
    var target=parsePoint(limStr); if(target===null) throw new Error('极限点无法识别：'+limStr);
    var f=fmCompile(expr);
    var L=fmNumericLimit(f,target);
    if(L==='DNE') throw new Error('该极限不存在（左右极限不一致或振荡）');
    if(!isFinite(L)) throw new Error('该极限发散到 '+(L>0?'+∞':'−∞'));
    var ls=f(target-1e-5), rs=f(target+1e-5);
    var steps=['计算 lim(x→'+limStr+') '+expr,'从两侧逼近 x = '+limStr,'左极限 ≈ '+fmNum(ls,6)+'，右极限 ≈ '+fmNum(rs,6),'数值极限 ≈ '+fmNum(L,8)];
    return { value:'lim(x→'+limStr+') '+expr+' = '+fmNum(L,8)+'<br>（数值极限，多步逼近）', steps:steps };
  },
  'derivative': function(){
    var expr=fmGetStr('fmFunc',''); if(!expr) throw new Error('请输入函数 f(x)');
    var order=Math.max(1, Math.round(fmGet('fmOrder',1)));
    var dNode=math.derivative(expr,'x');
    for(var i=1;i<order;i++) dNode=math.derivative(dNode,'x');
    var dTex=dNode.toTex();
    var f=fmCompile(expr);
    var dF=function(x){ try{ return Number(dNode.evaluate({x:x})); }catch(e){ return NaN; } };
    var x0=1, h=1e-5, numD=(f(x0+h)-f(x0-h))/(2*h);
    var steps=['对 f(x)='+expr+' 求 '+order+' 阶导数','应用符号求导法则（链式/乘积/商）','f^{('+order+')}(x) = '+dNode.toString(),'数值验证（x=1）：符号='+fmNum(dF(1))+'，中心差分='+fmNum(numD)];
    return { value:'$$ f^{('+order+')}(x) = '+dTex+' $$<br>数值验证 f\'(1) ≈ '+fmNum(dF(1),6), steps:steps, note:'基于 math.js 符号求导，可用作作业对照' };
  },
  'series': function(){
    var an=fmGetStr('fmFunc',''); if(!an) throw new Error('请输入级数通项 aₙ');
    var method=fmGetSel('fmMethod','比值法');
    var fn=function(n){ return fmEvalExpr(an,{n:n}); };
    if(method.indexOf('比值')>=0){
      var n0=1000;
      var r1=fn(n0+1)/fn(n0), r2=fn(n0+2)/fn(n0+1);
      var L=(r1+r2)/2;
      var inconcl = Math.abs(L-1) < 0.02;
      var concl = inconcl ? '比值法失效（L≈1），建议结合 p 判别 / 积分判别' : (L<1 ? '收敛（绝对收敛）' : '发散');
      return { value:'通项 aₙ = '+an+'<br>比值法：lim|aₙ₊₁/aₙ| ≈ '+fmNum(L,6)+'<br>⇒ '+concl, steps:['取大 n（n=1000）近似极限','|a_{n+1}/a_n| ≈ '+fmNum(r1,6)+'，'+fmNum(r2,6),'L '+(inconcl?'≈1 → 失效（p 级数等）':(L<1?'<1 → 收敛':L>1?'>1 → 发散':'=1 失效'))] };
    } else if(method.indexOf('根值')>=0){
      var n1=1000; var v1=Math.pow(Math.abs(fn(n1)),1/n1);
      var inconcl2 = Math.abs(v1-1) < 0.02;
      return { value:'根值法：lim|aₙ|^{1/n} ≈ '+fmNum(v1,6)+'<br>⇒ '+(inconcl2?'根值法失效（L≈1）':(v1<1?'收敛':v1>1?'发散':'根值法失效')), steps:['取 n=1000 近似','|a_n|^{1/n} ≈ '+fmNum(v1,6)] };
    } else if(method.indexOf('积分')>=0){
      var fInt=function(x){ return fmEvalExpr(an,{n:x}); };
      var I=fmAdaptiveIntegrate(fInt,1,1000);
      return { value:'积分判别法：∫_1^∞ f(x)dx ≈ '+fmNum(I,4)+'<br>⇒ '+(isFinite(I)?'积分收敛 ⇒ 级数收敛':'积分发散 ⇒ 级数发散'), steps:['构造 f(x)='+an,'数值积分近似（上限取 1000）'] };
    } else {
      var n2=1000; var ratio=fn(n2)/(1/Math.pow(n2,2));
      return { value:'比较法：aₙ 与 1/n² 的比值 ≈ '+fmNum(ratio,4)+'<br>∑1/n² 收敛 ⇒ 若比值有界则原级数收敛', steps:['取 n=1000 与基准 1/n² 比较'] };
    }
  },
  'bayes': function(){
    var pAB=fmGet('fmPAB',NaN), pB=fmGet('fmPB',NaN), pANB=fmGet('fmPANB',NaN);
    if([pAB,pB,pANB].some(isNaN)) throw new Error('请填写 P(A|B)、P(B)、P(A|¬B)');
    if(pB<0||pB>1||pAB<0||pAB>1||pANB<0||pANB>1) throw new Error('概率须在 [0,1] 区间');
    var pNotB=1-pB;
    var pA=pAB*pB+pANB*pNotB;
    if(pA<=0) throw new Error('P(A)=0，无法求后验');
    var pBgivenA=pAB*pB/pA;
    var steps=['完备事件组 B 与 ¬B：P(B)='+fmNum(pB)+'，P(¬B)='+fmNum(pNotB),'全概率 P(A)=P(A|B)P(B)+P(A|¬B)P(¬B)='+fmNum(pAB)+'×'+fmNum(pB)+'+'+fmNum(pANB)+'×'+fmNum(pNotB)+'='+fmNum(pA),'贝叶斯 P(B|A)=P(A|B)P(B)/P(A)='+fmNum(pAB)+'×'+fmNum(pB)+' / '+fmNum(pA)+' = '+fmNum(pBgivenA)];
    return { value:'P(B|A) ≈ '+fmNum(pBgivenA,6)+'<br>（真实数值，非占位演示）', steps:steps, note:'可扩展到多假设：列出 P(Bᵢ)、P(A|Bᵢ)，用全概率求 P(A) 后归一' };
  },
  'distribution': function(){
    var type=fmGetSel('fmDist','二项分布 B(n,p)');
    var p1=fmGet('fmParam1',NaN), p2=fmGet('fmParam2',NaN), k=fmGet('fmK',NaN);
    if([p1,p2,k].some(isNaN)) throw new Error('请填写参数与取值 k');
    var pmf,cdf=0,label;
    if(type.indexOf('二项')>=0){
      var n=Math.round(p1), pr=p2;
      if(n<0||pr<0||pr>1) throw new Error('二项需 n≥0，0≤p≤1');
      pmf=fmComb(n,k)*Math.pow(pr,k)*Math.pow(1-pr,n-k);
      for(var i=0;i<=k;i++) cdf+=fmComb(n,i)*Math.pow(pr,i)*Math.pow(1-pr,n-i);
      label='X~B('+n+','+pr+')';
    } else if(type.indexOf('泊松')>=0){
      var lam=p1; if(lam<0) throw new Error('泊松 λ≥0');
      pmf=Math.pow(lam,k)*Math.exp(-lam)/fmFactorial(Math.round(k));
      for(var j=0;j<=k;j++) cdf+=Math.pow(lam,j)*Math.exp(-lam)/fmFactorial(j);
      label='X~P('+lam+')';
    } else {
      var gp=p2; if(gp<=0||gp>=1) throw new Error('几何需 0<p<1');
      pmf=gp*Math.pow(1-gp,k-1);
      cdf=1-Math.pow(1-gp,k);
      label='X~Geo('+gp+')';
    }
    return { value:label+'<br>P(X = '+k+') ≈ '+fmNum(pmf,8)+'<br>P(X ≤ '+k+') ≈ '+fmNum(cdf,8), steps:[label,'概率质量 P(X=k) = '+fmNum(pmf,8),'累积概率 P(X≤k) = '+fmNum(cdf,8)] };
  },
  'normal-prob': function(){
    var mu=fmGet('fmMu',0), s2=fmGet('fmSigma2',1), a=fmGet('fmA',-1.96), b=fmGet('fmB',1.96);
    if(s2<=0) throw new Error('方差 σ² 须 > 0');
    var sigma=Math.sqrt(s2);
    var za=(a-mu)/sigma, zb=(b-mu)/sigma;
    var Pa=fmNormalCDF(za), Pb=fmNormalCDF(zb);
    var prob=Pb-Pa;
    var steps=['标准化 Z=(X-μ)/σ：μ='+fmNum(mu)+'，σ='+fmNum(sigma),'z_a='+fmNum(za)+'，z_b='+fmNum(zb),'Φ(z_a)='+fmNum(Pa,6)+'，Φ(z_b)='+fmNum(Pb,6),'P(a<X<b)=Φ(z_b)-Φ(z_a)='+fmNum(prob,6)];
    return { value:'X~N('+fmNum(mu)+', '+fmNum(s2)+')<br>P('+fmNum(a)+' < X < '+fmNum(b)+') ≈ '+fmNum(prob,8), steps:steps };
  },
  'expectation': function(){
    var xs=fmGetStr('fmXs','').split(',').map(function(s){return parseFloat(s.trim());});
    var ps=fmGetStr('fmPs','').split(',').map(function(s){return parseFloat(s.trim());});
    if(xs.length===0||ps.length===0) throw new Error('请输入取值与概率');
    if(xs.length!==ps.length) throw new Error('取值个数与概率个数不一致');
    if(ps.some(isNaN)) throw new Error('概率含非法数值');
    var sumP=ps.reduce(function(a,b){return a+b;},0);
    if(Math.abs(sumP-1)>1e-6) throw new Error('概率和应为 1，当前 Σp='+fmNum(sumP));
    var EX=0,EX2=0;
    for(var i=0;i<xs.length;i++){ EX+=xs[i]*ps[i]; EX2+=xs[i]*xs[i]*ps[i]; }
    var DX=EX2-EX*EX, sigma=Math.sqrt(DX);
    var steps=['E(X)=Σxᵢpᵢ = '+EX.toFixed(4),'E(X²)=Σxᵢ²pᵢ = '+EX2.toFixed(4),'D(X)=E(X²)-E(X)² = '+DX.toFixed(4),'σ(X)=√D(X) = '+sigma.toFixed(4)];
    return { value:'E(X) = '+fmNum(EX,6)+'<br>D(X) = '+fmNum(DX,6)+'<br>σ(X) = '+fmNum(sigma,6), steps:steps };
  },
  'hypothesis-test': function(){
    var mu0=fmGet('fmMu0',NaN), xbar=fmGet('fmMean',NaN), n=fmGet('fmN',NaN), sigma=fmGet('fmSigma',NaN), alpha=fmGet('fmAlpha',0.05);
    var type=fmGetSel('fmType','双侧检验');
    if([mu0,xbar,n,sigma].some(isNaN)||n<=0) throw new Error('请正确填写样本参数');
    var Z=(xbar-mu0)/(sigma/Math.sqrt(n));
    var tail=type.indexOf('右')>=0?'right':type.indexOf('左')>=0?'left':'two';
    var zCrit,pval;
    if(tail==='two'){ zCrit=fmProbit(1-alpha/2); pval=2*(1-fmNormalCDF(Math.abs(Z))); }
    else if(tail==='right'){ zCrit=fmProbit(1-alpha); pval=1-fmNormalCDF(Z); }
    else { zCrit=-fmProbit(1-alpha); pval=fmNormalCDF(Z); }
    var reject = tail==='two' ? Math.abs(Z)>zCrit : tail==='right' ? Z>zCrit : Z<zCrit;
    var concl=reject?'拒绝 H₀':'不拒绝 H₀';
    var steps=['H₀: μ='+fmNum(mu0)+'，'+(tail==='two'?'H₁: μ≠μ₀':'H₁: μ'+(tail==='right'?'>':'<')+mu0),'检验统计量 Z=(x̄-μ₀)/(σ/√n)=('+fmNum(xbar)+'-'+fmNum(mu0)+')/('+fmNum(sigma)+'/√'+n+') = '+fmNum(Z,4),'α='+alpha+'，临界值 z_α='+fmNum(zCrit,4),'p 值 = '+fmNum(pval,6)+(reject?' < α ⇒ 拒绝 H₀':' ≥ α ⇒ 不拒绝 H₀')];
    return { value:'Z = '+fmNum(Z,6)+'<br>临界值 z_α = '+fmNum(zCrit,6)+'<br>p 值 = '+fmNum(pval,6)+'<br>结论：'+concl, steps:steps };
  }
};

function runFormulaTool(toolName) {

  var result = document.getElementById('fmResult');

  if (!result) return;

  result.style.display = 'block';



  // ===== 真实计算引擎：math.js + 数值算法 =====
  if (typeof math === 'undefined') {
    result.innerHTML = '<div class="fm-error-box">⚠️ 计算引擎 math.js 未加载，请检查 vendor/math.min.js 或网络连接。</div>';
    setTimeout(function(){ renderMath(result); }, 50);
    return;
  }
  // 矩阵类由独立线性代数引擎处理
  if (toolName === 'determinant' || toolName === 'matrix-reduce') {
    runLinearAlgebraTool(toolName);
    return;
  }
  try {
    var eng = FMEngine[toolName];
    if (!eng) throw new Error('该工具暂未接入真实计算：' + toolName);
    var out = eng();
    if (!out || !out.value) throw new Error('未能得到结果，请检查输入格式');
    result.innerHTML = renderFMResult(out);
  } catch (e) {
    result.innerHTML = '<div class="fm-error-box">❌ ' + escapeHtml(e.message) + '</div>';
  }
  setTimeout(function(){ renderMath(result); }, 50);

}



/* ═══════════════════════════════════════════════════

   KaTeX 数学公式渲染 — 统一入口

   调用方式：renderMath(container) 对指定容器或 mainContent 渲染 $...$ / $$...$$ 公式

═══════════════════════════════════════════════════ */

function renderMath(container) {

  if (typeof renderMathInElement === 'undefined') {

    // KaTeX auto-render 尚未就绪，延迟重试

    setTimeout(function() { renderMath(container); }, 200);

    return;

  }

  var el = container || document.getElementById('mainContent') || document.body;

  try {

    renderMathInElement(el, {

      delimiters: [

        { left: '$$', right: '$$', display: true },

        { left: '$',  right: '$',  display: false },

        { left: '\\[', right: '\\]', display: true },

        { left: '\\(', right: '\\)', display: false }

      ],

      throwOnError: false,

      errorColor: '#ef4444',

      strict: false

    });

  } catch (e) {

    console.warn('KaTeX render error:', e.message);

  }

}



// 将纯 LaTeX 字符串渲染为 HTML（用于动态插入前预处理）

function katexRender(latex, displayMode) {

  if (typeof katex === 'undefined') return latex;

  try {

    return katex.renderToString(latex, { throwOnError: false, displayMode: !!displayMode, strict: false });

  } catch (e) {

    return '<span style="color:#ef4444">' + latex + '</span>';

  }

}



// 页面加载后首次渲染仪表盘

document.addEventListener('DOMContentLoaded', function() {

  setTimeout(function() { renderMath(); }, 350);

});



/* ═══════════════════════════════════════════════════

   移动端响应式 — 汉堡菜单

═══════════════════════════════════════════════════ */

function toggleMobileMenu() {

  var sidebar = document.getElementById('sidebar');

  var overlay = document.getElementById('mobileOverlay');

  if (!sidebar) return;

  var isOpen = sidebar.classList.contains('mobile-open');

  if (isOpen) {

    sidebar.classList.remove('mobile-open');

    if (overlay) overlay.classList.remove('active');

  } else {

    sidebar.classList.add('mobile-open');

    if (overlay) overlay.classList.add('active');

    if (!overlay) {

      var ov = document.createElement('div');

      ov.id = 'mobileOverlay';

      ov.className = 'mobile-overlay active';

      ov.onclick = function() { toggleMobileMenu(); };

      document.body.appendChild(ov);

    }

  }

}



// 注入移动端汉堡按钮（如果不存在）

document.addEventListener('DOMContentLoaded', function() {

  if (!document.getElementById('hamburgerBtn')) {

    var btn = document.createElement('button');

    btn.id = 'hamburgerBtn';

    btn.className = 'hamburger-btn';

    btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

    btn.onclick = toggleMobileMenu;

    btn.title = '菜单';

    var topbar = document.querySelector('.topbar');

    if (topbar) topbar.insertBefore(btn, topbar.firstChild);

  }

});



/* ═══════════════════════════════════════════════════

   社区页面交互 — 发帖 / 点赞 / 评论

═══════════════════════════════════════════════════ */



// 社区数据（存 localStorage）

function getCommunityPosts() {

  try {

    var saved = localStorage.getItem('community_posts');

    if (saved) return JSON.parse(saved);

  } catch(e) {}

  return [

    { id: 1, author: '陈同学', avatar: '陈', color: '#6366f1', tag: '讨论', tagClass: 'tag-purple',

      title: '分部积分法中 u 和 dv 怎么选？有没有什么技巧？',

      content: '每次遇到 $\\int x\\sin(x)\\,dx$ 这种题就纠结选谁做 u，有没有大佬总结过选 u 的优先级口诀？比如「反对幂三指」是什么意思？',

      time: '2小时前', likes: 56, comments: 23, shares: 12, liked: false },

    { id: 2, author: '王学霸', avatar: '王', color: '#10b981', tag: '笔记', tagClass: 'tag-green',

      title: '泰勒公式展开到第 n 阶的通用方法整理（附例题）',

      content: '把同济高数第三章泰勒公式部分整理了一份完整笔记，包含常见函数展开式和各类题型的通法……',

      time: '5小时前', likes: 128, comments: 45, shares: 67, liked: false },

    { id: 3, author: '李同学', avatar: '李', color: '#f59e0b', tag: '求助', tagClass: 'tag-amber',

      title: '二重积分在极坐标下的面积元素到底怎么推出来的？',

      content: '书上写的是 $d\\sigma = r\\,dr\\,d\\theta$，但怎么从直角坐标系变换过去的始终搞不明白，有没有直观的几何解释？',

      time: '昨天', likes: 34, comments: 19, shares: 5, liked: false },

    { id: 4, author: '张老师', avatar: '张', color: '#ef4444', tag: '经验', tagClass: 'tag-blue',

      title: '考研高数必备：易错知识点与常见陷阱总结',

      content: '从历年真题中总结出 50 个最常考的易错点，包括极限存在的充要条件、积分换元忘记改上下限等……',

      time: '昨天', likes: 267, comments: 89, shares: 134, liked: false }

  ];

}



function saveCommunityPosts(posts) {

  try { localStorage.setItem('community_posts', JSON.stringify(posts)); } catch(e) {}

}



function renderCommunityPosts() {

  var area = document.querySelector('#page-community .posts-area');

  if (!area) return;

  var posts = getCommunityPosts();

  area.innerHTML = posts.map(function(p) {

    return '<div class="post-card" data-post-id="' + p.id + '">' +

      '<div class="post-author">' +

        '<div class="post-avatar" style="background:' + p.color + '">' + p.avatar + '</div>' +

        '<div><span class="post-name">' + p.author + '</span><span class="post-time"> · ' + p.time + '</span></div>' +

        '<span class="tag ' + p.tagClass + '" style="margin-left:auto">' + p.tag + '</span>' +

      '</div>' +

      '<h3 class="post-title">' + p.title + '</h3>' +

      '<p class="post-excerpt">' + p.content + '</p>' +

      '<div class="post-footer">' +

        '<button class="post-action-btn' + (p.liked ? ' liked' : '') + '" onclick="toggleLike(' + p.id + ')">' +

          '<span class="post-stat">❤ ' + p.likes + '</span></button>' +

        '<button class="post-action-btn" onclick="openComments(' + p.id + ')">' +

          '<span class="post-stat">💬 ' + p.comments + '</span></button>' +

        '<span class="post-stat">🔁 ' + p.shares + '</span>' +

      '</div>' +

    '</div>';

  }).join('');

  // KaTeX 渲染

  setTimeout(function(){ renderMath(area); }, 60);

}



function toggleLike(postId) {

  var posts = getCommunityPosts();

  var post = posts.find(function(p) { return p.id === postId; });

  if (!post) return;

  post.liked = !post.liked;

  post.likes += post.liked ? 1 : -1;

  saveCommunityPosts(posts);

  renderCommunityPosts();

}



// 评论弹窗

function openComments(postId) {

  var posts = getCommunityPosts();

  var post = posts.find(function(p) { return p.id === postId; });

  if (!post) return;

  var comments = post.commentList || [];



  var modal = document.getElementById('commentModal');

  if (!modal) {

    modal = document.createElement('div');

    modal.id = 'commentModal';

    modal.className = 'modal-overlay';

    modal.onclick = function(e) { if (e.target === modal) closeCommentModal(); };

    document.body.appendChild(modal);

  }

  modal.innerHTML = '<div class="modal-card" style="max-width:560px">' +

    '<div class="modal-header"><h3>' + post.title.substring(0,30) + '…</h3>' +

      '<button class="modal-close" onclick="closeCommentModal()">✕</button></div>' +

    '<div class="modal-body">' +

      '<div id="commentList" style="max-height:300px;overflow-y:auto;margin-bottom:16px">' +

        (comments.length ? comments.map(function(c) {

          return '<div class="comment-item"><strong>' + c.author + '</strong><span class="post-time"> · ' + c.time + '</span><p style="margin:4px 0 0;color:var(--text-secondary)">' + c.text + '</p></div>';

        }).join('') : '<p style="color:var(--text-muted);text-align:center;padding:20px 0">还没有评论，来第一个！</p>') +

      '</div>' +

      '<div style="display:flex;gap:8px">' +

        '<input id="commentInput" class="search-input" placeholder="写下你的评论…" style="flex:1" onkeydown="if(event.key===\'Enter\')submitComment(' + postId + ')" />' +

        '<button class="btn btn-primary" onclick="submitComment(' + postId + ')">发送</button>' +

      '</div>' +

    '</div>' +

  '</div>';

  modal.classList.add('active');

  setTimeout(function(){ renderMath(modal); }, 100);

}



function closeCommentModal() {

  var modal = document.getElementById('commentModal');

  if (modal) modal.classList.remove('active');

}



function submitComment(postId) {

  var input = document.getElementById('commentInput');

  var text = input ? input.value.trim() : '';

  if (!text) return;

  var posts = getCommunityPosts();

  var post = posts.find(function(p) { return p.id === postId; });

  if (!post) return;

  if (!post.commentList) post.commentList = [];

  post.commentList.push({ author: '陈曦', time: '刚刚', text: text });

  post.comments++;

  saveCommunityPosts(posts);

  closeCommentModal();

  renderCommunityPosts();

  setTimeout(function() { openComments(postId); }, 50);

}



// 发布新帖弹窗

function openNewPostModal() {

  var modal = document.getElementById('newPostModal');

  if (!modal) {

    modal = document.createElement('div');

    modal.id = 'newPostModal';

    modal.className = 'modal-overlay';

    modal.onclick = function(e) { if (e.target === modal) modal.classList.remove('active'); };

    document.body.appendChild(modal);

  }

  var tags = ['讨论','笔记','求助','经验','资料'];

  modal.innerHTML = '<div class="modal-card" style="max-width:560px">' +

    '<div class="modal-header"><h3>发布帖子</h3>' +

      '<button class="modal-close" onclick="document.getElementById(\'newPostModal\').classList.remove(\'active\')">✕</button></div>' +

    '<div class="modal-body" style="display:flex;flex-direction:column;gap:12px">' +

      '<input id="newPostTitle" class="search-input" placeholder="帖子标题（必填）" style="width:100%" />' +

      '<textarea id="newPostContent" class="search-input" placeholder="正文内容，支持 $LaTeX$ 数学公式" rows="5" style="width:100%;resize:vertical"></textarea>' +

      '<div style="display:flex;gap:8px;flex-wrap:wrap">' +

        tags.map(function(t,i) {

          return '<label style="cursor:pointer"><input type="radio" name="newPostTag" value="' + t + '"' + (i===0?' checked':'') + ' style="margin-right:4px">' + t + '</label>';

        }).join('') +

      '</div>' +

      '<button class="btn btn-primary" onclick="submitNewPost()">发布</button>' +

    '</div>' +

  '</div>';

  modal.classList.add('active');

}



function submitNewPost() {

  var title = document.getElementById('newPostTitle').value.trim();

  var content = document.getElementById('newPostContent').value.trim();

  var tagEl = document.querySelector('input[name="newPostTag"]:checked');

  var tag = tagEl ? tagEl.value : '讨论';

  if (!title) { alert('请填写帖子标题'); return; }

  var posts = getCommunityPosts();

  var colors = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6'];

  var tagClasses = { '讨论':'tag-purple','笔记':'tag-green','求助':'tag-amber','经验':'tag-blue','资料':'tag-pink' };

  var newPost = {

    id: Date.now(),

    author: '陈曦',

    avatar: '陈',

    color: colors[Math.floor(Math.random() * colors.length)],

    tag: tag,

    tagClass: tagClasses[tag] || 'tag-purple',

    title: title,

    content: content || '（无正文）',

    time: '刚刚',

    likes: 0,

    comments: 0,

    shares: 0,

    liked: false,

    commentList: []

  };

  posts.unshift(newPost);

  saveCommunityPosts(posts);

  document.getElementById('newPostModal').classList.remove('active');

  renderCommunityPosts();

  navigate('community');

}



// 替换「发布帖子」按钮的默认行为

document.addEventListener('DOMContentLoaded', function() {

  var publishBtn = document.querySelector('#page-community .btn.btn-primary');

  if (publishBtn) publishBtn.onclick = openNewPostModal;

  renderCommunityPosts();

});



// 切换到社区页面时也刷新

var _origNavigate = navigate;

navigate = function(page, chapter, kp) {

  _origNavigate(page, chapter, kp);

  if (page === 'community') {

    setTimeout(renderCommunityPosts, 0);

  }

};



/* ═══════════════════════════════════════════════

   C / C++ 在线代码运行环境

   使用 Judge0 CE 公开 API（免费，无需 Key）

═══════════════════════════════════════════════ */



/* ═══════════════════════════════════════════════

   在线代码运行环境

   使用 Judge0 CE 社区公开实例（免费，无需 API Key）

═══════════════════════════════════════════════ */



// Judge0 CE 社区公开实例（无需 key，直接调用）

const JUDGE0_URL = 'https://ce.judge0.com';



// Judge0 标准 language_id 映射表

const JUDGE0_LANG_ID = {

  c:        50,   // C (GCC 9.4.0)

  cpp98:    44,   // C++ (GCC 9.4.0, C++98)

  cpp11:    45,   // C++ (GCC 9.4.0, C++11)

  cpp14:    52,   // C++ (GCC 9.4.0, C++14)

  cpp17:    54,   // C++ (GCC 9.4.0, C++) — 默认

  cpp20:    55,   // C++ (GCC 13.2.0, C++20)

  cpp23:    56,   // C++ (GCC 14.1.0, C++23)

  python3:  71,   // Python 3 (3.12.0)

  pypy3:    72,   // PyPy 3 (3.10)

  java8:    91,   // Java (OpenJDK 8.0)

  java21:   96,   // Java (OpenJDK 21.0)

  pascal:   76,   // Pascal (Free Pascal 3.2.2)

};









/* ═══════ C/C++ 做题模式 ═══════ */

let _codingLab = null;

// ═══════ C/C++ 语法高亮 ═══════
function _highlightSyntax(code) {
  // 转义 HTML 实体
  let html = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // 综合 token 正则：注释 → 字符串 → 预处理 → 数字 → 关键字（按优先级排列）
  const tokenRe = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#\s*\w+(?:\s*(?:<[^>]*>|"[^"]*"))?|0x[0-9a-fA-F]+|\b\d+\.?\d*[fFlL]?\b|\b(?:int|float|double|char|void|bool|short|long|signed|unsigned|if|else|for|while|do|switch|case|default|break|continue|return|struct|enum|union|typedef|sizeof|const|static|extern|volatile|register|auto|goto|include|define|ifdef|ifndef|endif|pragma|new|delete|class|public|private|protected|virtual|this|namespace|using|template|typename|try|catch|throw|nullptr|true|false|printf|scanf|malloc|free|sizeof|main)\b)/g;

  let result = '';
  let lastIdx = 0;
  let match;

  while ((match = tokenRe.exec(html)) !== null) {
    result += html.slice(lastIdx, match.index);
    const token = match[0];
    let cls = '';

    if (token.startsWith('//') || token.startsWith('/*')) {
      cls = 'color:#75715e;font-style:italic';
    } else if (token.startsWith('"') || token.startsWith("'")) {
      cls = 'color:#e6db74';
    } else if (token.startsWith('#')) {
      cls = 'color:#a6e22e';
    } else if (/^(0x[0-9a-fA-F]+|\d+(\.\d+)?[fFlL]?)$/.test(token)) {
      cls = 'color:#ae81ff';
    } else {
      const types = ['int','float','double','char','void','bool','short','long','signed','unsigned','struct','enum','union','class','auto'];
      const literals = ['true','false','nullptr'];
      if (types.includes(token)) {
        cls = 'color:#66d9ef;font-weight:bold';
      } else if (literals.includes(token)) {
        cls = 'color:#ae81ff';
      } else if (['printf','scanf','malloc','free','sizeof','main'].includes(token)) {
        cls = 'color:#a6e22e';
      } else {
        cls = 'color:#f92672;font-weight:bold';
      }
    }

    result += '<span style="' + cls + '">' + token + '</span>';
    lastIdx = tokenRe.lastIndex;
  }

  result += html.slice(lastIdx);
  return result;
}

function _refreshHighlight() {
  const ta = document.getElementById('clabCodeArea');
  const code = document.getElementById('clabHighlightCode');
  if (!ta || !code) return;
  code.innerHTML = _highlightSyntax(ta.value);
  // 同步滚动
  const pre = document.getElementById('clabHighlight');
  if (pre) pre.scrollTop = ta.scrollTop;
}

function openCodingLab() {
  const panel = document.getElementById('coding-lab-panel');
  if (!panel) return;
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (!_codingLab) {
    _codingLab = new CodingLabEngine();
    const codeArea = document.getElementById('clabCodeArea');
    const memoryView = document.getElementById('clabMemoryView');
    _codingLab.init(codeArea, memoryView);
  }

  const ta = document.getElementById('clabCodeArea');
  // 自动配对括号: () {} [] "" ''
  const PAIRS = { '(': ')', '{': '}', '[': ']', '"': '"', "'": "'" };
  const CLOSE_PAIRS = { ')': '(', '}': '{', ']': '[', '"': '"', "'": "'" };

  if (ta && !ta._ideHooked) {
    ta._ideHooked = true;
    let liveTimer = null;

    // 合成事件处理器
    ta.addEventListener('keydown', function(e) {
      const start = this.selectionStart;
      const end = this.selectionEnd;

      // Tab → 4 空格
      if (e.key === 'Tab') {
        e.preventDefault();
        if (start !== end) {
          // 多行缩进
          const lines = this.value.substring(0, start).split('\n');
          const lineStart = lines[lines.length - 1].length;
          const before = this.value.substring(0, start);
          const sel = this.value.substring(start, end);
          const after = this.value.substring(end);
          const indented = sel.split('\n').map(l => '    ' + l).join('\n');
          this.value = before + indented + after;
          this.selectionStart = start;
          this.selectionEnd = start + indented.length;
        } else {
          this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
          this.selectionStart = this.selectionEnd = start + 4;
        }
        _refreshHighlight();
        return;
      }

      // Shift+Tab → 反缩进
      if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        const lines = this.value.substring(0, start).split('\n');
        const lineStart = lines[lines.length - 1].length;
        const sel = this.value.substring(start, end);
        const unindented = sel.split('\n').map(l => l.replace(/^ {1,4}/, '')).join('\n');
        const before = this.value.substring(0, start);
        const after = this.value.substring(end);
        this.value = before + unindented + after;
        this.selectionStart = start;
        this.selectionEnd = start + unindented.length;
        _refreshHighlight();
        return;
      }

      // Enter → 保持缩进 + 自动缩进 {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const before = this.value.substring(0, start);
        const after = this.value.substring(end);
        const currentLine = before.split('\n').pop() || '';
        // 提取当前行前导空白
        const indent = currentLine.match(/^(\s*)/)[0];
        // 如果行末是 {，则下一行增加缩进
        const extraIndent = currentLine.trimEnd().endsWith('{') ? '    ' : '';
        const insertion = '\n' + indent + extraIndent;
        this.value = before + insertion + after;
        const newPos = start + insertion.length;
        this.selectionStart = this.selectionEnd = newPos;
        _refreshHighlight();
        // Enter 后 50ms 触发内存刷新
        clearTimeout(liveTimer);
        liveTimer = setTimeout(() => _autoRunClab(), 50);
        return;
      }

      // 自动配对括号
      if (PAIRS[e.key] && start === end) {
        const charAfter = this.value.charAt(start);
        const closingPair = PAIRS[e.key];
        // 如果下一个字符就是闭合对，不自动插入（由下方跳过逻辑处理）
        if (charAfter === closingPair) {
          // 不处理，fall through 到 CLOSE_PAIRS 跳过
        } else if (charAfter === '' || charAfter === '\n' || /\s/.test(charAfter) || /[;,.)\]}>]/.test(charAfter)) {
          e.preventDefault();
          this.value = this.value.substring(0, start) + e.key + closingPair + this.value.substring(end);
          this.selectionStart = this.selectionEnd = start + 1;
          _refreshHighlight();
          return;
        }
      }

      // Backspace: 删除配对括号
      if (e.key === 'Backspace' && start === end && start > 0) {
        const prevChar = this.value.charAt(start - 1);
        const nextChar = this.value.charAt(start);
        if (PAIRS[prevChar] && nextChar === PAIRS[prevChar]) {
          e.preventDefault();
          this.value = this.value.substring(0, start - 1) + this.value.substring(start + 1);
          this.selectionStart = this.selectionEnd = start - 1;
          _refreshHighlight();
          return;
        }
      }

      // 输入右括号：如果光标后已经是相同右括号，跳过
      if (CLOSE_PAIRS[e.key] && start === end) {
        const charAfter = this.value.charAt(start);
        if (charAfter === e.key) {
          e.preventDefault();
          this.selectionStart = this.selectionEnd = start + 1;
          return;
        }
      }
    });

    // 输入事件：语法高亮 + 内存解析 + 自动备份到本地
    ta.addEventListener('input', function() {
      _refreshHighlight();
      clearTimeout(liveTimer);
      liveTimer = setTimeout(() => _autoRunClab(), 200);
      if (typeof _clabAutoSave === 'function') _clabAutoSave();
    });

    // 滚动同步
    ta.addEventListener('scroll', function() {
      const pre = document.getElementById('clabHighlight');
      if (pre) pre.scrollTop = this.scrollTop;
      if (typeof _highlightClabLine === 'function') _highlightClabLine();
    });
  }

  _codingLab.reset();
  _updateClabStepInfo();
  _refreshHighlight();

  /* 恢复上次自动保存的代码（如果有） */
  if (typeof _clabRestore === 'function') _clabRestore();
}

function closeCodingLab() {
  if (_codingLab) _codingLab.pause();
  if (typeof _clabUiTimer !== 'undefined' && _clabUiTimer) { clearInterval(_clabUiTimer); _clabUiTimer = null; }
  // 清除所有 LeaderLine 箭头
  if (typeof globalMemoryArrows !== 'undefined') {
    for (const [key, arrow] of globalMemoryArrows) {
      try { arrow.remove(); } catch(e) {}
    }
    globalMemoryArrows.clear();
  }
  const panel = document.getElementById('coding-lab-panel');
  if (panel) panel.style.display = 'none';
}

// ═══════ ▶ 运行：双引擎（可视化 + 真实编译）═══════
async function clabRun() {
  const ta = document.getElementById('clabCodeArea');
  const out = document.getElementById('clabOutput');
  const status = document.getElementById('clabRunStatus');
  const btn = document.getElementById('clabRunBtn');
  const sel = document.getElementById('clabCodeLangSelect');
  if (!ta || !out) return;

  const code = ta.value;
  if (!code.trim()) { out.innerHTML = '<span style="color:#75715e">（请先编写代码）</span>'; status.textContent='⚠ 等待输入'; status.style.color='#fbbf24'; return; }

  const prevText = btn.textContent;
  const stdinEl = document.getElementById('clabStdinArea');

  /* ── 打开运行终端窗口（总是弹出，类似 Dev-C++ 运行窗口） ── */
  _clabBindModalEvents();
  const modal = document.getElementById('clabRunModal');
  const modalOut = document.getElementById('clabModalOutput');
  const modalStatus = document.getElementById('clabModalStatus');
  const inputWrap = document.getElementById('clabModalInputWrap');
  const modalInput = document.getElementById('clabRunModalInput');

  modal.style.display = 'flex';
  modalOut.innerHTML = '<span style="color:#75715e">⏳ 准备运行...</span>';
  modalStatus.textContent = '准备运行…';
  modalStatus.style.color = '#fbbf24';

  /* 检测代码是否需要 stdin 输入 */
  const needsStdin = /\b(scanf\s*\(|cin\s*>>|gets\s*\(|getline\s*\(|getchar\s*\(|readline\s*\(|input\s*\()/.test(code);
  if (needsStdin && stdinEl && !stdinEl.value.trim()) {
    inputWrap.style.display = 'block';
    modalInput.value = '';
    setTimeout(function () { modalInput.focus(); }, 60);
    /* 等待用户输入回车 / 点运行 / 跳过（提交后窗口保持打开，继续运行） */
    _clabModalCancelled = false;
    await new Promise(function (resolve) {
      _clabModalCtx = { resolve: resolve };
    });
    /* 用户点 ✕ / Esc 取消 → 不运行 */
    if (_clabModalCancelled) {
      btn.disabled = false;
      btn.textContent = prevText || '▶ 运行';
      return;
    }
  } else {
    inputWrap.style.display = 'none';
  }

  /* ① 可视化引擎：CMiniInterpreter 解析（即使失败也不影响 Judge0） */
  if (_codingLab) {
    try { _codingLab.showFinalState(); } catch (e) { /* 高级语法（vector/STL）不支持可视化，忽略 */ }
  }
  _updateClabStepInfo();

  /* ② 真实编译引擎：Judge0 在线编译 */
  const lang = sel ? sel.value : 'c';
  btn.disabled = true;
  btn.textContent = '⏳ 编译中…';
  status.textContent = '⏳ 编译中…';
  status.style.color = '#fbbf24';
  modalOut.innerHTML = '<span style="color:#fbbf24">⏳ 编译中...</span>';
  modalStatus.textContent = '编译中…';
  modalStatus.style.color = '#fbbf24';

  try {
    const stdinText = (stdinEl || {}).value || '';
    const submitRes = await fetch(JUDGE0_URL + '/submissions?base64_encoded=true&wait=false', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: btoa(unescape(encodeURIComponent(code))),
        language_id: JUDGE0_LANG_ID[lang] || 50,
        stdin: btoa(unescape(encodeURIComponent(stdinText))),
        cpu_time_limit: 15,
        memory_limit: 512000
      })
    });
    if (!submitRes.ok) throw new Error('Judge0 不可用 (HTTP ' + submitRes.status + ')');
    const { token } = await submitRes.json();

    let result = null;
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 800));
      const getRes = await fetch(JUDGE0_URL + '/submissions/' + token + '?base64_encoded=true');
      result = await getRes.json();
      if (result.status && result.status.id >= 3) break;
    }
    if (!result) throw new Error('获取结果超时');

    /* base64 解码输出字段 + 构造 IDE 风格多色输出 */
    const dec = function (s) { try { return s ? decodeURIComponent(escape(atob(s))) : s; } catch (e) { return s; } };
    const escHtml = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

    const statusId = result.status ? result.status.id : 0;
    const statusDesc = result.status ? result.status.description : '';
    const stdout = dec(result.stdout) || '';
    const stderr = dec(result.stderr) || '';
    const compileOutput = dec(result.compile_output) || '';
    const time = result.time || '';
    const mem = result.memory || '';
    const exitMsg = time ? '✓ Process exited with return value 0 (' + time + 's' + (mem ? ', ' + mem + ' KB' : '') + ')' : '';

    let html = '';
    if (statusId === 3) {
      if (compileOutput) html += '<span style="color:#9cdcfe">📋 编译信息:\n' + escHtml(compileOutput) + '\n</span>';
      if (stdout) html += '<span style="color:#cccccc">📤 输出:\n' + escHtml(stdout) + '\n</span>';
      if (exitMsg) html += '<span style="color:#4ec9b0">' + exitMsg + '\n</span>';
      html = html || '<span style="color:#75715e">（无输出）</span>';
      status.textContent = '✓ 运行成功';
      status.style.color = '#86efac';
      modalStatus.textContent = '✓ 运行成功';
      modalStatus.style.color = '#86efac';
    } else if (statusId === 6) {
      html = '<span style="color:#f48771">✗ 编译错误:\n' + escHtml(compileOutput || '未知错误') + '\n</span>' +
        (exitMsg ? '<span style="color:#4ec9b0">' + exitMsg + '</span>' : '');
      status.textContent = '✗ 编译错误';
      status.style.color = '#f87171';
      modalStatus.textContent = '✗ 编译错误';
      modalStatus.style.color = '#f87171';
    } else {
      html = '<span style="color:#f48771">✗ ' + escHtml(statusDesc || '运行错误') + '\n';
      if (stderr) html += escHtml(stderr);
      if (exitMsg) html += '\n<span style="color:#4ec9b0">' + exitMsg + '</span>';
      html += '</span>';
      status.textContent = '⚠ ' + (statusDesc || '运行错误');
      status.style.color = '#f87171';
      modalStatus.textContent = '⚠ ' + (statusDesc || '运行错误');
      modalStatus.style.color = '#f87171';
    }

    /* 双写：弹窗输出区 + 面板控制台 */
    modalOut.innerHTML = html;
    modalOut.style.color = '';
    out.innerHTML = html;
    out.style.color = '';
  } catch (err) {
    const errHtml = '<span style="color:#f87171">⚠ 在线编译服务连接失败\n' + escHtml(err.message) + '\n\n提示：内存可视化仍可使用（点击「▶ 播放」逐步执行）</span>';
    modalOut.innerHTML = errHtml;
    out.innerHTML = errHtml;
    status.textContent = '⚠ 网络错误';
    status.style.color = '#f87171';
    modalStatus.textContent = '⚠ 网络错误';
    modalStatus.style.color = '#f87171';
  } finally {
    btn.disabled = false;
    btn.textContent = prevText || '▶ 运行';
  }
}

/* ═══════ 运行终端窗口（点击 ▶ 运行总是弹出）═══════ */
let _clabModalCtx = null;

function _clabBindModalEvents() {
  const modal = document.getElementById('clabRunModal');
  if (!modal || modal._bound) return;
  modal._bound = true;

  const input = document.getElementById('clabRunModalInput');
  const okBtn = document.getElementById('clabModalOk');
  const skipBtn = document.getElementById('clabModalSkipBtn');
  const closeBtn = modal.querySelector('[onclick="clabRunModalSkip()"]');

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); _clabModalCommit(true); }
  });
  okBtn.addEventListener('click', function () { _clabModalCommit(true); });
  skipBtn.addEventListener('click', function () { _clabModalCommit(false); });
  if (closeBtn) closeBtn.addEventListener('click', function () { clabRunModalSkip(); });
  /* Esc 无条件关闭（运行前/运行后都生效） */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.getElementById('clabRunModal').style.display === 'flex') {
      clabRunModalSkip();
    }
  });
  /* 点击背景（非窗口区域）关闭 */
  modal.addEventListener('mousedown', function (e) {
    if (e.target === modal) clabRunModalSkip();
  });
}

/* 提交输入（Enter / ▶运行按钮 / 不输入直接运行）：窗口保持打开，继续运行 */
function _clabModalCommit(withInput) {
  const input = document.getElementById('clabRunModalInput');
  const stdinEl = document.getElementById('clabStdinArea');
  if (withInput && input && stdinEl) {
    stdinEl.value = input.value;          /* 输入值同步到面板 stdin 框 */
  } else if (!withInput && stdinEl) {
    stdinEl.value = '';                   /* 跳过 → 空 stdin */
  }
  _clabModalCancelled = false;
  /* 注意：不关闭窗口，让用户看到运行过程和结果 */
  if (_clabModalCtx) {
    const r = _clabModalCtx.resolve;
    _clabModalCtx = null;
    if (r) r();
  }
}

/* ✕ / Esc / 背景：取消并关闭窗口（若在等待输入也释放 Promise 避免悬挂） */
let _clabModalCancelled = false;

function clabRunModalSkip() {
  const modal = document.getElementById('clabRunModal');
  if (modal) modal.style.display = 'none';
  _clabModalCancelled = true;
  if (_clabModalCtx) {
    const r = _clabModalCtx.resolve;
    _clabModalCtx = null;
    if (r) r();
  }
}

// 编辑触发自动运行（debounce 后调用）
function _autoRunClab() {
  if (!_codingLab) return;
  _codingLab.showFinalState();
  _updateClabStepInfo();
}

function clabStep() {
  if (!_codingLab) return;
  if (_codingLab.totalSteps === 0) _codingLab.run();
  _codingLab.step();
  _updateClabStepInfo();
  _syncClabPlayBtn();
}

function clabStepBack() {
  if (!_codingLab) return;
  _codingLab.stepBack();
  _updateClabStepInfo();
  _syncClabPlayBtn();
}

function clabReset() {
  if (!_codingLab) return;
  _codingLab.reset();
  _updateClabStepInfo();
  _syncClabPlayBtn();
  // 重置后自动跑一次展示初始/完整状态
  _autoRunClab();
}

function _updateClabStepInfo() {
  const info = document.getElementById('clabStepInfo');
  if (info && _codingLab) {
    const total = _codingLab.totalSteps;
    const current = _codingLab.currentStepIdx + 1;
    if (total > 0) {
      const ln = _codingLab.getCurrentLineNum();
      info.innerHTML = '<span style="color:#a6e22e">● LIVE</span> ' + current + '/' + total + (ln ? ' · 第' + ln + '行' : '');
    } else {
      info.textContent = '步骤: 0/0';
    }
  }
  const lineEl = document.getElementById('clabCurrentLine');
  if (lineEl && _codingLab) {
    const desc = _codingLab.getCurrentStepDesc();
    if (desc) {
      const ln = _codingLab.getCurrentLineNum();
      lineEl.textContent = '▶ ' + (ln ? '第' + ln + '行: ' : '') + desc;
    } else if (_codingLab.totalSteps > 0 && _codingLab.currentStepIdx >= _codingLab.totalSteps - 1) {
      lineEl.textContent = '✅ 当前内存状态';
    } else {
      lineEl.textContent = '输入代码自动解析...';
    }
  }
  _highlightClabLine();
}

/* 代码区当前行高亮（黄色条跟随执行行） */
function _highlightClabLine() {
  const ta = document.getElementById('clabCodeArea');
  const bar = document.getElementById('clabLineBar');
  if (!ta || !bar || !_codingLab) { if (bar) bar.style.color = 'transparent'; return; }
  const ln = _codingLab.getCurrentLineNum();
  if (!ln || _codingLab.totalSteps === 0 || _codingLab.currentStepIdx < 0) {
    bar.style.top = '-100px';
    return;
  }
  /* 行高 = font-size 0.88rem × line-height 1.7 ≈ 24px，顶部 padding 16px */
  const top = 16 + (ln - 1) * 24 - ta.scrollTop;
  bar.style.top = top + 'px';
  /* 滚回当前行可见 */
  if (top < 16 || top > ta.clientHeight - 40) {
    ta.scrollTop = Math.max(0, (ln - 1) * 24 - ta.clientHeight / 2 + 16);
  }
}

/* ▶ 逐步播放 / 暂停 */
let _clabUiTimer = null;

function clabPlay() {
  if (!_codingLab) return;
  if (_codingLab.playing) {
    _codingLab.pause();
  } else {
    if (_codingLab.totalSteps === 0 || _codingLab.currentStepIdx >= _codingLab.totalSteps - 1) {
      _codingLab.reset();
      _codingLab.run();
    }
    _codingLab.play();
  }
  _updateClabStepInfo();
  _syncClabPlayBtn();
  /* 播放期间轮询同步 UI（引擎内部 interval 不通知 UI） */
  if (_codingLab.playing) {
    if (_clabUiTimer) clearInterval(_clabUiTimer);
    _clabUiTimer = setInterval(function () {
      _updateClabStepInfo();
      _syncClabPlayBtn();
      if (!_codingLab.playing) { clearInterval(_clabUiTimer); _clabUiTimer = null; }
    }, 120);
  }
}

function _syncClabPlayBtn() {
  const btn = document.getElementById('clabPlayBtn');
  if (btn && _codingLab) btn.textContent = _codingLab.playing ? '⏸ 暂停' : '▶ 播放';
}

/* 速度滑块（ms/步） */
function clabSpeedChange(v) {
  if (!_codingLab) return;
  v = parseInt(v, 10) || 3;
  const ms = Math.max(80, Math.round(1200 / v));
  _codingLab.setSpeed(ms);
}

/* 示例代码一键加载 */
function clabLoadExample(id) {
  const ta = document.getElementById('clabCodeArea');
  const sel = document.getElementById('clabExampleSelect');
  if (!ta || !id) { if (sel) sel.value = ''; return; }
  const EXAMPLES = {
    ptr: '#include <stdio.h>\n\nint main() {\n    int x = 10;\n    int *p = &x;\n    *p = 20;\n    printf("x = %d\\n", x);\n    return 0;\n}',
    array: '#include <stdio.h>\n\nint main() {\n    int arr[4] = {1,2,3,4};\n    int sum = 0;\n    sum = sum + arr[0];\n    sum = sum + arr[1];\n    sum = sum + arr[2];\n    sum = sum + arr[3];\n    printf("sum = %d\\n", sum);\n    return 0;\n}',
    struct: '#include <stdio.h>\n\nstruct Point {\n    int x;\n    int y;\n};\n\nint main() {\n    struct Point p;\n    p.x = 3;\n    p.y = 5;\n    printf("(%d, %d)\\n", p.x, p.y);\n    return 0;\n}',
    malloc: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *p = (int*)malloc(2 * sizeof(int));\n    p[0] = 100;\n    p[1] = 200;\n    free(p);\n    return 0;\n}',
    swap: '#include <stdio.h>\n\nvoid swap(int *a, int *b) {\n    int t = *a;\n    *a = *b;\n    *b = t;\n}\n\nint main() {\n    int x = 3;\n    int y = 7;\n    swap(&x, &y);\n    printf("x=%d y=%d\\n", x, y);\n    return 0;\n}',
  };
  if (EXAMPLES[id]) {
    ta.value = EXAMPLES[id];
    ta.dispatchEvent(new Event('input'));
    const out = document.getElementById('clabOutput');
    if (out) out.textContent = '';
    if (sel) sel.value = '';
  }
}

/* ═══════ 💾 保存 / 📂 打开 代码文件（磁盘） ═══════ */
const CLAB_STORE_KEY = 'hdt_clab_code_v1';

function clabSaveToDisk() {
  const ta = document.getElementById('clabCodeArea');
  if (!ta) return;
  const code = ta.value;
  if (!code.trim()) { _clabToast('代码为空，先写点东西再保存吧~'); return; }
  const sel = document.getElementById('clabCodeLangSelect');
  const lang = sel ? sel.value : 'c';
  const ext = lang === 'c' ? 'c' : (lang === 'python3' ? 'py' : 'cpp');
  const defaultName = 'main.' + ext;

  /* 优先：File System Access API（Chrome/Edge，可自由选择保存到任意磁盘位置） */
  if (window.showSaveFilePicker) {
    showSaveFilePicker({
      suggestedName: defaultName,
      types: [{ description: '源代码文件', accept: { 'text/plain': ['.' + ext] } }]
    }).then(async function (handle) {
      const writable = await handle.createWritable();
      await writable.write(code);
      await writable.close();
      _clabToast('✓ 已保存到磁盘：' + (handle.name || defaultName));
    }).catch(function (err) {
      if (err && err.name !== 'AbortError') _clabToast('⚠ 保存失败: ' + err.message);
    });
    return;
  }

  /* 降级：直接下载到浏览器下载目录 */
  const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = defaultName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
  _clabToast('✓ 已保存（建议使用 Chrome/Edge 可选择保存位置）');
}

function clabOpenFromDisk() {
  const ta = document.getElementById('clabCodeArea');
  if (!ta) return;

  /* 优先：File System Access API */
  if (window.showOpenFilePicker) {
    showOpenFilePicker({
      types: [{ description: '源代码文件', accept: { 'text/plain': ['.c', '.cpp', '.cc', '.cxx', '.h', '.hpp', '.py', '.txt'] } }],
      multiple: false
    }).then(async function (handles) {
      const file = await handles[0].getFile();
      const text = await file.text();
      _clabLoadCode(text, file.name);
    }).catch(function (err) {
      if (err && err.name !== 'AbortError') _clabToast('⚠ 打开失败: ' + err.message);
    });
    return;
  }

  /* 降级：隐藏 file input */
  let inp = document.getElementById('clabFileInput');
  if (!inp) {
    inp = document.createElement('input');
    inp.type = 'file';
    inp.id = 'clabFileInput';
    inp.accept = '.c,.cpp,.cc,.cxx,.h,.hpp,.py,.txt';
    inp.style.display = 'none';
    inp.addEventListener('change', function () {
      const f = this.files && this.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = function (e) { _clabLoadCode(String(e.target.result || ''), f.name); };
      reader.readAsText(f);
    });
    document.body.appendChild(inp);
  }
  inp.click();
}

/* 加载代码到编辑器（按扩展名智能切换语言） */
function _clabLoadCode(text, fileName) {
  const ta = document.getElementById('clabCodeArea');
  if (!ta) return;
  ta.value = text;
  const sel = document.getElementById('clabCodeLangSelect');
  if (sel && fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'c') sel.value = 'c';
    else if (ext === 'py') sel.value = 'python3';
    else if (/^(cpp|cc|cxx|h|hpp)$/.test(ext)) sel.value = 'cpp17';
  }
  ta.dispatchEvent(new Event('input'));
  const out = document.getElementById('clabOutput');
  if (out) out.textContent = '';
  _clabToast('✓ 已打开 ' + (fileName || '代码文件'));
}

/* 轻量 toast 提示 */
function _clabToast(msg) {
  let t = document.getElementById('clabToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'clabToast';
    t.style.cssText = 'position:fixed;top:70px;left:50%;transform:translateX(-50%);background:#272822;color:#e6db74;border:1px solid #fd971f;padding:8px 18px;border-radius:8px;font-size:0.82rem;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.4);transition:opacity .3s;pointer-events:none';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(function () { t.style.opacity = '0'; }, 2200);
}

/* 编辑时自动备份到浏览器本地（刷新/重开自动恢复，防止丢失） */
function _clabAutoSave() {
  try {
    const ta = document.getElementById('clabCodeArea');
    if (ta) localStorage.setItem(CLAB_STORE_KEY, ta.value);
  } catch (e) {}
}

function _clabRestore() {
  try {
    const ta = document.getElementById('clabCodeArea');
    if (!ta) return;
    const saved = localStorage.getItem(CLAB_STORE_KEY);
    if (saved && saved.trim()) {
      ta.value = saved;
      ta.dispatchEvent(new Event('input'));
    }
  } catch (e) {}
}

/* ═══════ C/C++ 代码示例映射 ═══════ */

const codeSamples = {

  'clang-1-0':{demo:'intro',code:'#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}'},

  'clang-1-1':{demo:'intro',code:'#include <stdio.h>\n\nint main() {\n    printf("环境配置完成!\\n");\n    return 0;\n}'},

  'clang-1-2':{demo:'intro',code:'#include <stdio.h>\n#define PI 3.14159\n\nint main() {\n    printf("PI=%f\\n",PI);\n    return 0;\n}'},

  'clang-2-0':{demo:'datatype',code:'#include <stdio.h>\n#include <limits.h>\n\nint main() {\n    printf("int:%d~%d\\n",INT_MIN,INT_MAX);\n    printf("sizeof(int)=%zu\\n",sizeof(int));\n    return 0;\n}'},

  'clang-2-1':{demo:'datatype',code:'#include <stdio.h>\n#define PI 3.14159\n\nint main() {\n    const int MAX=100;\n    int x=10;\n    printf("x=%d,MAX=%d\\n",x,MAX);\n    return 0;\n}'},

  'clang-2-2':{demo:'datatype',code:'#include <stdio.h>\n\nint main() {\n    int a=10; double b=3.14;\n    double r=a+b;\n    int c=(int)b;\n    printf("r=%f c=%d\\n",r,c);\n    return 0;\n}'},

  'clang-3-0':{demo:'operator',code:'#include <stdio.h>\n\nint main() {\n    int a=10,b=3;\n    printf("a+b=%d a-b=%d\\n",a+b,a-b);\n    printf("a*b=%d a/b=%d\\n",a*b,a/b);\n    return 0;\n}'},

  'clang-3-1':{demo:'operator',code:'#include <stdio.h>\n\nint main() {\n    int a=5,b=3;\n    printf("a&b=%d\\n",a&b);\n    printf("a|b=%d\\n",a|b);\n    printf("a^b=%d\\n",a^b);\n    return 0;\n}'},

  'clang-3-2':{demo:'operator',code:'#include <stdio.h>\n\nint main() {\n    int a=10,b=5;\n    a+=b; printf("a+=b:%d\\n",a);\n    int max=(a>b)?a:b;\n    printf("max=%d\\n",max);\n    return 0;\n}'},

  'clang-4-0':{demo:'control-flow',code:'#include <stdio.h>\n\nint main() {\n    int score=85;\n    if(score>=90) printf("A\\n");\n    else if(score>=80) printf("B\\n");\n    else printf("C\\n");\n    return 0;\n}'},

  'clang-4-1':{demo:'control-flow',code:'#include <stdio.h>\n\nint main() {\n    for(int i=1;i<=5;i++)\n        printf("第%d次循环\\n",i);\n    int j=1;\n    while(j<=5) printf("%d ",j++);\n    return 0;\n}'},

  'clang-4-2':{demo:'control-flow',code:'#include <stdio.h>\n\nint main() {\n    for(int i=0;i<10;i++){\n        if(i==5) break;\n        if(i%2==0) continue;\n        printf("%d ",i);\n    }\n    return 0;\n}'},

  'clang-5-0':{demo:'function',code:'#include <stdio.h>\n\nint add(int a,int b){return a+b;}\n\nint main(){\n    printf("3+5=%d\\n",add(3,5));\n    return 0;\n}'},

  'clang-5-1':{demo:'recursion',code:'#include <stdio.h>\n\nint fact(int n){\n    if(n<=1)return 1;\n    return n*fact(n-1);\n}\n\nint main(){\n    printf("5!=%d\\n",fact(5));\n    return 0;\n}'},

  'clang-5-2':{demo:'function',code:'#include <stdio.h>\n\nint global=100;\nvoid func(){\n    static int cnt=0; cnt++;\n    int local=10;\n    printf("g=%d l=%d c=%d\\n",global,local,cnt);\n}\n\nint main(){func();func();return 0;}'},

  'clang-6-0':{demo:'array',code:'#include <stdio.h>\n\nint main(){\n    int a[]={1,2,3,4,5};\n    for(int i=0;i<5;i++)\n        printf("a[%d]=%d\\n",i,a[i]);\n    return 0;\n}'},

  'clang-6-1':{demo:'array',code:'#include <stdio.h>\n#include <string.h>\n\nint main(){\n    char s[]="Hello";\n    printf("len=%zu\\n",strlen(s));\n    char t[20]; strcpy(t,s);\n    printf("t=%s\\n",t);\n    return 0;\n}'},

  'clang-6-2':{demo:'array',code:'#include <stdio.h>\n\nvoid printArr(int a[],int n){\n    for(int i=0;i<n;i++)\n        printf("%d ",a[i]);\n}\n\nint main(){\n    int a[]={1,2,3,4,5};\n    printArr(a,5);\n    return 0;\n}'},

  'clang-7-0':{demo:'pointer',code:'#include <stdio.h>\n\nint main(){\n    int x=42;\n    int *p=&x;\n    printf("x=%d addr=%p\\n",x,(void*)&x);\n    printf("*p=%d\\n",*p);\n    *p=100;\n    printf("x now=%d\\n",x);\n    return 0;\n}'},

  'clang-7-1':{demo:'pointer',code:'#include <stdio.h>\n\nint main(){\n    int a[]={10,20,30,40,50};\n    int *p=a;\n    for(int i=0;i<5;i++)\n        printf("*(p+%d)=%d\\n",i,*(p+i));\n    return 0;\n}'},

  'clang-7-2':{demo:'pointer',code:'#include <stdio.h>\n\nvoid swap(int *a,int *b){\n    int t=*a;*a=*b;*b=t;\n}\n\nint main(){\n    int x=3,y=5;\n    swap(&x,&y);\n    printf("x=%d y=%d\\n",x,y);\n    return 0;\n}'},

  'clang-7-3':{demo:'pointer',code:'#include <stdio.h>\n\nint main(){\n    int x=10;\n    int *p=&x;\n    int **pp=&p;\n    printf("x=%d *p=%d **pp=%d\\n",x,*p,**pp);\n    return 0;\n}'},

  'clang-8-0':{demo:'struct',code:'#include <stdio.h>\n\nstruct Student{\n    char name[20];\n    int age;\n    float score;\n};\n\nint main(){\n    struct Student s={"小明",20,95.5};\n    printf("%s %d岁 %.1f分\\n",s.name,s.age,s.score);\n    return 0;\n}'},

  'clang-8-1':{demo:'struct',code:'#include <stdio.h>\n\nunion Data{int i;float f;char c;};\nenum Color{RED,GREEN,BLUE};\n\nint main(){\n    union Data d;\n    d.i=10; printf("d.i=%d\\n",d.i);\n    d.f=3.14f; printf("d.f=%.2f\\n",d.f);\n    return 0;\n}'},

  'clang-8-2':{demo:'linked-list',code:'#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node{\n    int data;\n    struct Node* next;\n}Node;\n\nint main(){\n    Node*head=malloc(sizeof(Node));\n    head->data=1;head->next=NULL;\n    for(Node*p=head;p;p=p->next)\n        printf("%d ",p->data);\n    free(head);\n    return 0;\n}'},

  'clang-9-0':{demo:'file-io',code:'#include <stdio.h>\n\nint main(){\n    FILE*fp=fopen("test.txt","w");\n    fprintf(fp,"Hello File!\\n");\n    fclose(fp);\n    fp=fopen("test.txt","r");\n    char buf[100];\n    fgets(buf,100,fp);\n    printf("read:%s",buf);\n    fclose(fp);\n    return 0;\n}'},

  'clang-9-1':{demo:'file-io',code:'#include <stdio.h>\n\nint main(){\n    FILE*fp=fopen("data.txt","w");\n    for(int i=1;i<=5;i++)\n        fprintf(fp,"%d ",i*i);\n    fclose(fp);\n    fp=fopen("data.txt","r");\n    int num;\n    while(fscanf(fp,"%d",&num)==1)\n        printf("%d ",num);\n    fclose(fp);\n    return 0;\n}'},

  'clang-9-2':{demo:'file-io',code:'#include <stdio.h>\n\ntypedef struct{int id;char name[20];}Rec;\n\nint main(){\n    Rec r={1,"test"};\n    FILE*fp=fopen("data.bin","wb");\n    fwrite(&r,sizeof(Rec),1,fp);\n    fclose(fp);\n    return 0;\n}'},

  'clang-10-0':{demo:'memory-mgmt',code:'#include <stdio.h>\n#include <stdlib.h>\n\nint main(){\n    int*a=malloc(5*sizeof(int));\n    for(int i=0;i<5;i++) a[i]=i*10;\n    for(int i=0;i<5;i++) printf("%d ",a[i]);\n    free(a);\n    return 0;\n}'},

  'clang-10-1':{demo:'preprocessor',code:'#include <stdio.h>\n#define MAX(a,b) ((a)>(b)?(a):(b))\n#define DEBUG 1\n\nint main(){\n    printf("max=%d\\n",MAX(10,20));\n#ifdef DEBUG\n    printf("[debug info]\\n");\n#endif\n    return 0;\n}'},

  'clang-10-2':{demo:'memory-mgmt',code:'#include <stdio.h>\n#include <stdlib.h>\n\nint main(){\n    int*p=malloc(100);\n    free(p); p=NULL;\n    // 正确做法: 释放后置空\n    return 0;\n}'},

  'cpp-1-0':{demo:'cpp-intro',code:'#include <iostream>\n#include <string>\nusing namespace std;\n\nint main(){\n    string name; int age;\n    cout<<"name and age: ";\n    cin>>name>>age;\n    cout<<name<<","<<age<<endl;\n    return 0;\n}'},

  'cpp-1-1':{demo:'reference',code:'#include <iostream>\nusing namespace std;\n\nvoid swap(int &a,int &b){\n    int t=a;a=b;b=t;\n}\n\nint main(){\n    int x=3,y=5;\n    swap(x,y);\n    cout<<x<<" "<<y<<endl;\n    return 0;\n}'},

  'cpp-1-2':{demo:'function',code:'#include <iostream>\nusing namespace std;\n\nint add(int a,int b){return a+b;}\ndouble add(double a,double b){return a+b;}\n\nint main(){\n    cout<<add(1,2)<<" "<<add(1.5,2.5)<<endl;\n    return 0;\n}'},

  'cpp-2-0':{demo:'class',code:'#include <iostream>\nusing namespace std;\n\nclass Rectangle{\n    double w,h;\npublic:\n    Rectangle(double w,double h):w(w),h(h){}\n    double area(){return w*h;}\n};\n\nint main(){\n    Rectangle r(3,4);\n    cout<<"area="<<r.area()<<endl;\n    return 0;\n}'},

  'cpp-2-1':{demo:'constructor',code:'#include <iostream>\nusing namespace std;\n\nclass Demo{\npublic:\n    Demo(){cout<<"ctor\\n";}\n    Demo(const Demo&){cout<<"copy\\n";}\n    ~Demo(){cout<<"dtor\\n";}\n};\n\nint main(){\n    Demo a;\n    Demo b=a;\n    return 0;\n}'},

  'cpp-2-2':{demo:'class',code:'#include <iostream>\nusing namespace std;\n\nclass Counter{\n    int cnt;\npublic:\n    Counter():cnt(0){}\n    Counter& inc(){cnt++;return*this;}\n    void print(){cout<<cnt<<endl;}\n};\n\nint main(){\n    Counter c; c.inc().inc().print();\n    return 0;\n}'},

  'cpp-3-0':{demo:'operator',code:'#include <iostream>\nusing namespace std;\n\nclass Complex{\n    double r,i;\npublic:\n    Complex(double r=0,double i=0):r(r),i(i){}\n    Complex operator+(const Complex&c){\n        return Complex(r+c.r,i+c.i);\n    }\n    friend ostream& operator<<(ostream&os,const Complex&c){\n        os<<c.r<<"+"<<c.i<<"i"; return os;\n    }\n};\n\nint main(){\n    Complex a(1,2),b(3,4);\n    cout<<a+b<<endl;\n    return 0;\n}'},

  'cpp-3-1':{demo:'operator',code:'#include <iostream>\nusing namespace std;\n\nclass Vec2{\npublic:\n    double x,y;\n    Vec2(double x,double y):x(x),y(y){}\n    Vec2 operator+(const Vec2&v){return Vec2(x+v.x,y+v.y);}\n};\n\nint main(){\n    Vec2 a(1,2),b(3,4),c=a+b;\n    cout<<c.x<<","<<c.y<<endl;\n    return 0;\n}'},

  'cpp-3-2':{demo:'operator',code:'#include <iostream>\n#include <cstring>\nusing namespace std;\n\nclass String{\n    char*d;\npublic:\n    String(const char*s){\n        d=new char[strlen(s)+1];\n        strcpy(d,s);\n    }\n    String(const String&s){\n        d=new char[strlen(s.d)+1];\n        strcpy(d,s.d);\n    }\n    ~String(){delete[] d;}\n    void print(){cout<<d<<endl;}\n};\n\nint main(){\n    String a("Hello"),b=a;\n    b.print();\n    return 0;\n}'},

  'cpp-4-0':{demo:'inheritance',code:'#include <iostream>\nusing namespace std;\n\nclass Animal{\nprotected:\n    string name;\npublic:\n    Animal(string n):name(n){}\n    void eat(){cout<<name<<" eat\\n";}\n};\n\nclass Dog:public Animal{\npublic:\n    Dog(string n):Animal(n){}\n    void bark(){cout<<name<<" woof!\\n";}\n};\n\nint main(){\n    Dog d("Buddy");\n    d.eat(); d.bark();\n    return 0;\n}'},

  'cpp-4-1':{demo:'inheritance',code:'#include <iostream>\nusing namespace std;\n\nclass Base{\npublic:\n    Base(){cout<<"Base ctor\\n";}\n};\n\nclass Derived:public Base{\npublic:\n    Derived():Base(){cout<<"Derived ctor\\n";}\n};\n\nint main(){\n    Derived d;\n    return 0;\n}'},

  'cpp-4-2':{demo:'inheritance',code:'#include <iostream>\nusing namespace std;\n\nclass A{public:int a;};\nclass B:virtual public A{};\nclass C:virtual public A{};\nclass D:public B,public C{};\n\nint main(){\n    D d; d.a=10;\n    cout<<d.a<<endl;\n    return 0;\n}'},

  'cpp-5-0':{demo:'polymorphism',code:'#include <iostream>\nusing namespace std;\n\nclass Shape{\npublic:\n    virtual double area()=0;\n};\n\nclass Circle:public Shape{\n    double r;\npublic:\n    Circle(double r):r(r){}\n    double area()override{return 3.14*r*r;}\n};\n\nint main(){\n    Shape*s=new Circle(5);\n    cout<<s->area()<<endl;\n    delete s;\n    return 0;\n}'},

  'cpp-5-1':{demo:'polymorphism',code:'#include <iostream>\nusing namespace std;\n\nclass Animal{\npublic:\n    virtual void speak(){cout<<"???\\n";}\n};\n\nclass Cat:public Animal{\npublic:\n    void speak()override{cout<<"Meow~\\n";}\n};\n\nint main(){\n    Animal*a=new Cat();\n    a->speak();\n    delete a;\n    return 0;\n}'},

  'cpp-5-2':{demo:'polymorphism',code:'#include <iostream>\nusing namespace std;\n\nclass Base{\npublic:\n    virtual ~Base(){cout<<"~Base\\n";}\n};\n\nclass Derived:public Base{\npublic:\n    ~Derived(){cout<<"~Derived\\n";}\n};\n\nint main(){\n    Base*b=new Derived();\n    delete b;\n    return 0;\n}'},

  'cpp-6-0':{demo:'template',code:'#include <iostream>\nusing namespace std;\n\ntemplate<typename T>\nT maxVal(T a,T b){return(a>b)?a:b;}\n\nint main(){\n    cout<<maxVal(10,20)<<endl;\n    cout<<maxVal(3.14,2.72)<<endl;\n    return 0;\n}'},

  'cpp-6-1':{demo:'template',code:'#include <iostream>\nusing namespace std;\n\ntemplate<typename T>\nclass Stack{\n    T d[100]; int top;\npublic:\n    Stack():top(-1){}\n    void push(T v){d[++top]=v;}\n    T pop(){return d[top--];}\n};\n\nint main(){\n    Stack<int>s; s.push(1);\n    cout<<s.pop()<<endl;\n    return 0;\n}'},

  'cpp-6-2':{demo:'template',code:'#include <iostream>\nusing namespace std;\n\ntemplate<int N>\nstruct Fact{static const int v=N*Fact<N-1>::v;};\ntemplate<>struct Fact<0>{static const int v=1;};\n\nint main(){\n    cout<<"5!="<<Fact<5>::v<<endl;\n    return 0;\n}'},

  'cpp-7-0':{demo:'stl',code:'#include <iostream>\n#include <vector>\n#include <map>\nusing namespace std;\n\nint main(){\n    vector<int>v={1,2,3};\n    v.push_back(4);\n    for(int x:v)cout<<x<<" ";\n    cout<<endl;\n    map<string,int>m;\n    m["one"]=1;m["two"]=2;\n    cout<<m["one"]<<endl;\n    return 0;\n}'},

  'cpp-7-1':{demo:'stl',code:'#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main(){\n    vector<int>v={3,1,4,1,5,9};\n    sort(v.begin(),v.end());\n    for(int x:v)cout<<x<<" ";\n    auto it=find(v.begin(),v.end(),5);\n    if(it!=v.end())cout<<" found 5";\n    return 0;\n}'},

  'cpp-7-2':{demo:'stl',code:'#include <iostream>\n#include <vector>\n#include <numeric>\n#include <algorithm>\nusing namespace std;\n\nint main(){\n    vector<int>v={1,2,3,4,5};\n    int sum=accumulate(v.begin(),v.end(),0);\n    cout<<"sum="<<sum<<endl;\n    transform(v.begin(),v.end(),v.begin(),[](int x){return x*x;});\n    for(int x:v)cout<<x<<" ";\n    return 0;\n}'},

  'cpp-8-0':{demo:'control-flow',code:'#include <iostream>\nusing namespace std;\n\nint main(){\n    try{\n        int x=-1;\n        if(x<0)throw runtime_error("x<0!");\n    }catch(const exception&e){\n        cout<<"err:"<<e.what()<<endl;\n    }\n    return 0;\n}'},

  'cpp-8-1':{demo:'control-flow',code:'#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass MyErr:public exception{\npublic:\n    const char*what()const noexcept override{return "custom error";}\n};\n\nint main(){\n    try{throw MyErr();}\n    catch(const exception&e){cout<<e.what()<<endl;}\n    return 0;\n}'},

  'cpp-8-2':{demo:'class',code:'#include <iostream>\n#include <memory>\nusing namespace std;\n\nclass Res{\npublic:\n    Res(){cout<<"acquire\\n";}\n    ~Res(){cout<<"release\\n";}\n};\n\nint main(){\n    auto r=make_unique<Res>();\n    cout<<"RAII\\n";\n    return 0;\n}'},

  'cpp-9-0':{demo:'pointer',code:'#include <iostream>\n#include <memory>\nusing namespace std;\n\nint main(){\n    unique_ptr<int>p1=make_unique<int>(42);\n    cout<<*p1<<endl;\n    shared_ptr<int>p2=make_shared<int>(100);\n    shared_ptr<int>p3=p2;\n    cout<<"count:"<<p2.use_count()<<endl;\n    return 0;\n}'},

  'cpp-9-1':{demo:'pointer',code:'#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass BigData{\n    vector<int>d;\npublic:\n    BigData(int n):d(n){cout<<"create\\n";}\n    BigData(BigData&&o):d(move(o.d)){cout<<"move\\n";}\n};\n\nint main(){\n    BigData a(1000);\n    BigData b=move(a);\n    return 0;\n}'},

  'cpp-9-2':{demo:'function',code:'#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main(){\n    vector<int>v={1,2,3,4,5};\n    int sum=0;\n    for_each(v.begin(),v.end(),[&sum](int x){sum+=x;});\n    cout<<sum<<endl;\n    auto sq=[](int x){return x*x;};\n    cout<<sq(5)<<endl;\n    return 0;\n}'},

  'cpp-10-0':{demo:'file-io',code:'#include <iostream>\n#include <fstream>\nusing namespace std;\n\nint main(){\n    ofstream out("test.txt");\n    out<<"Hello C++!"<<endl;\n    out.close();\n    ifstream in("test.txt");\n    string line; getline(in,line);\n    cout<<line<<endl;\n    return 0;\n}'},

  'cpp-10-1':{demo:'file-io',code:'#include <iostream>\n#include <sstream>\nusing namespace std;\n\nint main(){\n    stringstream ss;\n    ss<<42<<" "<<3.14;\n    cout<<ss.str()<<endl;\n    stringstream ss2("10 20 30");\n    int a,b,c;\n    ss2>>a>>b>>c;\n    cout<<a+b+c<<endl;\n    return 0;\n}'},

  /* ═══ 数据结构与算法 C代码示例 ═══ */

  'ds-1-0':{demo:'intro',code:'#include <stdio.h>\n\n// 时间复杂度示例\nvoid example_O_n(int n){\n    int sum=0;\n    for(int i=0;i<n;i++) sum+=i;\n    printf("1+...+%d=%d\\n",n,sum);\n}\nvoid example_O_n2(int n){\n    int cnt=0;\n    for(int i=0;i<n;i++)\n        for(int j=0;j<n;j++) cnt++;\n    printf("n=%d 内层执行了%d次\\n",n,cnt);\n}\nvoid example_O_logn(int n){\n    int cnt=0;\n    for(int i=1;i<n;i*=2) cnt++;\n    printf("n=%d log次数=%d\\n",n,cnt);\n}\nint main(){\n    printf("=== 时间复杂度演示 ===\\n");\n    example_O_n(10);\n    example_O_n2(5);\n    example_O_logn(64);\n    return 0;\n}'},

  'ds-1-2':{demo:'intro',code:'#include <stdio.h>\n\n// 算法复杂度实测对比\nvoid bubble(int a[],int n){\n    for(int i=0;i<n-1;i++)\n        for(int j=0;j<n-i-1;j++)\n            if(a[j]>a[j+1]){int t=a[j];a[j]=a[j+1];a[j+1]=t;}\n}\nvoid show_logn(int n){\n    int steps=0;\n    for(int i=n;i>1;i/=2) steps++;\n    printf("log2(%d) = %d 步\\n",n,steps);\n}\nint main(){\n    int a[]={64,25,12,22,11};\n    int n=5;\n    printf("排序前: ");\n    for(int i=0;i<n;i++) printf("%d ",a[i]);\n    bubble(a,n);\n    printf("\\n排序后: ");\n    for(int i=0;i<n;i++) printf("%d ",a[i]);\n    printf("\\n\\n");\n    printf("各规模的log层数:\\n");\n    show_logn(8); show_logn(64); show_logn(1024);\n    return 0;\n}'},

  'ds-2-0':{demo:'array',code:'#include <stdio.h>\n#define MAXSIZE 20\ntypedef struct{int data[MAXSIZE];int length;}SqList;\n\nvoid Init(SqList*L){L->length=0;}\nvoid Insert(SqList*L,int i,int e){\n    if(L->length>=MAXSIZE){printf("表满!\\n");return;}\n    if(i<1||i>L->length+1){printf("位置不合法!\\n");return;}\n    for(int j=L->length;j>=i;j--) L->data[j]=L->data[j-1];\n    L->data[i-1]=e; L->length++;\n}\nvoid Delete(SqList*L,int i,int*e){\n    if(i<1||i>L->length){printf("位置不合法!\\n");return;}\n    *e=L->data[i-1];\n    for(int j=i;j<L->length;j++) L->data[j-1]=L->data[j];\n    L->length--;\n}\nvoid Print(SqList*L){\n    printf("[");\n    for(int i=0;i<L->length;i++) printf("%d%s",L->data[i],i<L->length-1?",":"");\n    printf("] 长度=%d\\n",L->length);\n}\nint main(){\n    SqList L; Init(&L);\n    Insert(&L,1,10);Insert(&L,2,20);Insert(&L,3,30);Insert(&L,2,15);\n    printf("插入后: "); Print(&L);\n    int e;\n    Delete(&L,2,&e);\n    printf("删除了%d, 剩余: ",e); Print(&L);\n    return 0;\n}'},

  'ds-2-1':{demo:'linked-list',code:'#include <stdio.h>\n#include <stdlib.h>\ntypedef struct LNode{int data;struct LNode*next;}LNode,*LinkList;\n\nLinkList Create(int a[],int n){\n    LNode*head=malloc(sizeof(LNode)); head->next=NULL;\n    LNode*tail=head;\n    for(int i=0;i<n;i++){\n        LNode*p=malloc(sizeof(LNode));\n        p->data=a[i]; p->next=NULL;\n        tail->next=p; tail=p;\n    }\n    return head;\n}\nvoid Insert(LinkList L,int i,int e){\n    LNode*p=L; int j=0;\n    while(p&&j<i-1){p=p->next;j++;}\n    if(!p){printf("位置错误\\n");return;}\n    LNode*s=malloc(sizeof(LNode));\n    s->data=e; s->next=p->next; p->next=s;\n}\nvoid Print(LinkList L){\n    printf("链表: ");\n    for(LNode*p=L->next;p;p=p->next) printf("%d->",p->data);\n    printf("NULL\\n");\n}\nvoid Reverse(LinkList L){\n    LNode*prev=NULL,*cur=L->next,*nxt;\n    while(cur){nxt=cur->next;cur->next=prev;prev=cur;cur=nxt;}\n    L->next=prev;\n}\nint main(){\n    int a[]={1,2,3,4,5};\n    LinkList L=Create(a,5);\n    Print(L);\n    Insert(L,3,99);\n    printf("在第3位插入99: "); Print(L);\n    Reverse(L);\n    printf("反转后: "); Print(L);\n    return 0;\n}'},

  'ds-3-0':{demo:'control-flow',code:'#include <stdio.h>\n#define MAXSIZE 10\ntypedef struct{int data[MAXSIZE];int top;}SqStack;\n\nvoid Init(SqStack*S){S->top=-1;}\nint Push(SqStack*S,int e){\n    if(S->top==MAXSIZE-1){printf("栈满!\\n");return 0;}\n    S->data[++S->top]=e; return 1;\n}\nint Pop(SqStack*S,int*e){\n    if(S->top==-1){printf("栈空!\\n");return 0;}\n    *e=S->data[S->top--]; return 1;\n}\nvoid Print(SqStack*S){\n    printf("栈(top->bottom): ");\n    for(int i=S->top;i>=0;i--) printf("%d ",S->data[i]);\n    printf("\\n");\n}\nint matchBrackets(const char*s){\n    SqStack st; Init(&st);\n    for(int i=0;s[i];i++){\n        char c=s[i];\n        if(c==\'(\'||c==\'[\'||c==\'{\'){ Push(&st,(int)c); }\n        else if(c==\')\'||c==\']\'||c==\'}\'){\n            int top; if(!Pop(&st,&top)) return 0;\n            if((c==\')\'&&top!=\'(\')||(c==\']\'&&top!=\'[\')||(c==\'}\'&&top!=\'{\')) return 0;\n        }\n    }\n    return st.top==-1;\n}\nint main(){\n    SqStack S; Init(&S);\n    Push(&S,10);Push(&S,20);Push(&S,30);\n    Print(&S);\n    int e; Pop(&S,&e);\n    printf("Pop出: %d\\n",e); Print(&S);\n    printf("括号匹配 (a+b)*[c-{d}]: %s\\n",matchBrackets("(a+b)*[c-{d}]")?"匹配":"不匹配");\n    printf("括号匹配 ([)]: %s\\n",matchBrackets("([)]")?"匹配":"不匹配");\n    return 0;\n}'},

  'ds-3-2':{demo:'control-flow',code:'#include <stdio.h>\n#define MAXSIZE 10\ntypedef struct{int data[MAXSIZE];int front,rear;}SqQueue;\n\nvoid Init(SqQueue*Q){Q->front=Q->rear=0;}\nint EnQueue(SqQueue*Q,int e){\n    if((Q->rear+1)%MAXSIZE==Q->front){printf("队满!\\n");return 0;}\n    Q->data[Q->rear]=e;\n    Q->rear=(Q->rear+1)%MAXSIZE;\n    return 1;\n}\nint DeQueue(SqQueue*Q,int*e){\n    if(Q->front==Q->rear){printf("队空!\\n");return 0;}\n    *e=Q->data[Q->front];\n    Q->front=(Q->front+1)%MAXSIZE;\n    return 1;\n}\nint Size(SqQueue*Q){return(Q->rear-Q->front+MAXSIZE)%MAXSIZE;}\nvoid Print(SqQueue*Q){\n    printf("队列(%d个元素): ",Size(Q));\n    for(int i=Q->front;i!=Q->rear;i=(i+1)%MAXSIZE) printf("%d ",Q->data[i]);\n    printf("\\n");\n}\nint main(){\n    SqQueue Q; Init(&Q);\n    EnQueue(&Q,1);EnQueue(&Q,2);EnQueue(&Q,3);EnQueue(&Q,4);\n    Print(&Q);\n    int e; DeQueue(&Q,&e);\n    printf("出队: %d\\n",e);\n    EnQueue(&Q,5);\n    Print(&Q);\n    printf("front=%d rear=%d size=%d\\n",Q.front,Q.rear,Size(&Q));\n    return 0;\n}'},

  'ds-4-1':{demo:'function',code:'#include <stdio.h>\n#include <string.h>\n\nint BF(const char*S,const char*T){\n    int i=0,j=0,n=strlen(S),m=strlen(T);\n    while(i<n&&j<m){\n        if(S[i]==T[j]){i++;j++;}\n        else{i=i-j+1;j=0;}\n    }\n    return j==m?i-m:-1;\n}\nvoid getNext(const char*T,int*next,int m){\n    next[0]=-1;\n    int i=0,j=-1;\n    while(i<m-1){\n        if(j==-1||T[i]==T[j]){i++;j++;next[i]=j;}\n        else j=next[j];\n    }\n}\nint KMP(const char*S,const char*T){\n    int n=strlen(S),m=strlen(T);\n    int next[50]; getNext(T,next,m);\n    printf("next数组: ");\n    for(int i=0;i<m;i++) printf("%d ",next[i]);\n    printf("\\n");\n    int i=0,j=0;\n    while(i<n&&j<m){\n        if(j==-1||S[i]==T[j]){i++;j++;}\n        else j=next[j];\n    }\n    return j==m?i-m:-1;\n}\nint main(){\n    const char*S="ababcabcacbab";\n    const char*T="abcac";\n    printf("主串: %s\\n模式: %s\\n",S,T);\n    printf("BF结果: 位置%d\\n",BF(S,T));\n    printf("KMP结果: 位置%d\\n",KMP(S,T));\n    return 0;\n}'},

  'ds-6-1':{demo:'recursion',code:'#include <stdio.h>\n#include <stdlib.h>\ntypedef struct BNode{char data;struct BNode*l,*r;}BNode,*BTree;\n\nBNode* newNode(char c){BNode*p=malloc(sizeof(BNode));p->data=c;p->l=p->r=NULL;return p;}\nBTree buildTree(){\n    BNode*A=newNode(\'A\'),*B=newNode(\'B\'),*C=newNode(\'C\');\n    BNode*D=newNode(\'D\'),*E=newNode(\'E\');\n    A->l=B;A->r=C;B->l=D;B->r=E;\n    return A;\n}\nvoid preOrder(BTree T){if(!T)return;printf("%c ",T->data);preOrder(T->l);preOrder(T->r);}\nvoid inOrder(BTree T){if(!T)return;inOrder(T->l);printf("%c ",T->data);inOrder(T->r);}\nvoid postOrder(BTree T){if(!T)return;postOrder(T->l);postOrder(T->r);printf("%c ",T->data);}\nint height(BTree T){if(!T)return 0;int l=height(T->l),r=height(T->r);return(l>r?l:r)+1;}\nint countNodes(BTree T){if(!T)return 0;return 1+countNodes(T->l)+countNodes(T->r);}\nint main(){\n    BTree T=buildTree();\n    printf("先序(根左右): ");preOrder(T);printf("\\n");\n    printf("中序(左根右): ");inOrder(T);printf("\\n");\n    printf("后序(左右根): ");postOrder(T);printf("\\n");\n    printf("树高: %d\\n",height(T));\n    printf("节点数: %d\\n",countNodes(T));\n    return 0;\n}'},

  'ds-7-2':{demo:'control-flow',code:'#include <stdio.h>\n#include <string.h>\n#define MAXV 8\n\nint G[MAXV][MAXV],n,visited[MAXV];\n\nvoid dfs(int v){\n    printf("DFS: %d  ",v);\n    visited[v]=1;\n    for(int w=0;w<n;w++)\n        if(G[v][w]&&!visited[w]) dfs(w);\n}\nvoid bfs(int v){\n    int queue[MAXV],front=0,rear=0;\n    printf("BFS: %d  ",v);\n    visited[v]=1; queue[rear++]=v;\n    while(front<rear){\n        int u=queue[front++];\n        for(int w=0;w<n;w++){\n            if(G[u][w]&&!visited[w]){\n                printf("%d  ",w);\n                visited[w]=1; queue[rear++]=w;\n            }\n        }\n    }\n}\nint main(){\n    n=5;\n    memset(G,0,sizeof(G));\n    int edges[][2]={{0,1},{0,2},{1,3},{2,4}};\n    for(int i=0;i<4;i++){\n        G[edges[i][0]][edges[i][1]]=1;\n        G[edges[i][1]][edges[i][0]]=1;\n    }\n    printf("图: 0-1,0-2,1-3,2-4\\n");\n    printf("=== 深度优先 ===\\n");\n    memset(visited,0,sizeof(visited));\n    dfs(0); printf("\\n");\n    printf("=== 广度优先 ===\\n");\n    memset(visited,0,sizeof(visited));\n    bfs(0); printf("\\n");\n    return 0;\n}'},

  'ds-9-0':{demo:'function',code:'#include <stdio.h>\n\nint SeqSearch(int a[],int n,int key){\n    a[0]=key;\n    int i=n;\n    while(a[i]!=key) i--;\n    return i;\n}\nint BinarySearch(int a[],int n,int key){\n    int low=1,high=n,mid;\n    int step=0;\n    while(low<=high){\n        mid=(low+high)/2; step++;\n        printf("  第%d次: 比较a[%d]=%d\\n",step,mid,a[mid]);\n        if(a[mid]==key) return mid;\n        else if(key<a[mid]) high=mid-1;\n        else low=mid+1;\n    }\n    return 0;\n}\nint main(){\n    int a[11]={-1,3,7,12,18,25,31,46,58,67,89};\n    int n=10;\n    printf("有序表: ");\n    for(int i=1;i<=n;i++) printf("%d ",a[i]);\n    printf("\\n\\n查找25:\\n");\n    int pos=BinarySearch(a,n,25);\n    printf("结果: 位置%d (值%d)\\n\\n",pos,a[pos]);\n    printf("查找100 (不存在):\\n");\n    printf("结果: 位置%d\\n",BinarySearch(a,n,100));\n    return 0;\n}'},

  'ds-9-1':{demo:'struct',code:'#include <stdio.h>\n#include <stdlib.h>\ntypedef struct BSTNode{int key;struct BSTNode*l,*r;}BSTNode,*BSTree;\n\nBSTNode* Insert(BSTree T,int k){\n    if(!T){\n        BSTNode*p=malloc(sizeof(BSTNode));\n        p->key=k;p->l=p->r=NULL;return p;\n    }\n    if(k<T->key) T->l=Insert(T->l,k);\n    else if(k>T->key) T->r=Insert(T->r,k);\n    return T;\n}\nvoid Search(BSTree T,int k,int depth){\n    if(!T){printf("未找到 %d (搜索了%d层)\\n",k,depth);return;}\n    printf("  第%d层比较: %d\\n",depth,T->key);\n    if(k==T->key){printf("找到 %d!\\n",k);return;}\n    if(k<T->key) Search(T->l,k,depth+1);\n    else Search(T->r,k,depth+1);\n}\nvoid InOrder(BSTree T){\n    if(!T)return;\n    InOrder(T->l);printf("%d ",T->key);InOrder(T->r);\n}\nint Height(BSTree T){if(!T)return 0;int l=Height(T->l),r=Height(T->r);return(l>r?l:r)+1;}\nint main(){\n    int keys[]={5,3,7,1,4,6,8,2};\n    BSTree T=NULL;\n    for(int i=0;i<8;i++) T=Insert(T,keys[i]);\n    printf("中序(有序): ");InOrder(T);printf("\\n");\n    printf("树高: %d\\n\\n",Height(T));\n    printf("查找4:\\n");Search(T,4,1);\n    printf("\\n查找9:\\n");Search(T,9,1);\n    return 0;\n}'},

  'ds-9-3':{demo:'struct',code:'#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#define P 11\n\ntypedef struct Node{int key;struct Node*next;}Node;\nNode*table[P];\n\nint hashFn(int k){return((k%P)+P)%P;}\nvoid Insert(int k){\n    int h=hashFn(k);\n    Node*s=malloc(sizeof(Node));\n    s->key=k;s->next=table[h];table[h]=s;\n    printf("Insert %d -> 桶[%d]\\n",k,h);\n}\nvoid Search(int k){\n    int h=hashFn(k);\n    int step=0;\n    for(Node*p=table[h];p;p=p->next){\n        step++;\n        if(p->key==k){printf("找到 %d, 桶[%d], 比较%d次\\n",k,h,step);return;}\n    }\n    printf("未找到 %d\\n",k);\n}\nvoid PrintTable(){\n    printf("\\n哈希表(除数p=%d):\\n",P);\n    for(int i=0;i<P;i++){\n        printf("[%2d]: ",i);\n        for(Node*n=table[i];n;n=n->next) printf("%d->",n->key);\n        printf("NULL\\n");\n    }\n}\nint main(){\n    memset(table,0,sizeof(table));\n    int keys[]={17,29,36,42,55,18,11,4};\n    for(int i=0;i<8;i++) Insert(keys[i]);\n    PrintTable();\n    printf("\\n查找测试:\\n");\n    Search(42);Search(99);\n    return 0;\n}'},


  /* === Python 程序设计代码示例 === */
  'python-1-0':{demo:'intro',code:'"""\nPython 简介\n- 创始人: Guido van Rossum (1991年)\n- 设计哲学: 优雅、明确、简单\n- 应用领域:\n  1. Web开发 (Django/Flask/FastAPI)\n  2. 数据科学 (NumPy/Pandas/Matplotlib)\n  3. AI/机器学习 (PyTorch/TensorFlow)\n  4. 自动化运维与测试\n  5. 网络爬虫 (Scrapy/BeautifulSoup)\n"""\nprint("Python 是最受欢迎的编程语言之一!")'},
  'python-1-1':{demo:'intro',code:'"""\n开发环境配置\n1. 下载: https://www.python.org/downloads/\n2. 安装: 勾选 Add Python to PATH\n3. 验证: 命令行输入 python --version\n\nIDE推荐:\n- PyCharm Community (免费, 功能全面)\n- VSCode + Python插件 (轻量, 高度可定制)\n- Jupyter Notebook (交互式, 适合数据分析)\n"""\nimport sys\nprint(f"Python 版本: {sys.version}")\nprint(f"安装路径: {sys.executable}")'},
  'python-1-2':{demo:'intro',code:'# 第一个Python程序\n# 这是单行注释\n"""\n这是多行文档字符串\n通常放在函数/类/模块的开头\n"""\n\n# Python 使用缩进表示代码块（通常是4个空格）\nif True:\n    print("Hello, Python!")\n    print("缩进必须一致")\n\n# print() 函数的常用参数\nprint("Hello", "World", sep=", ", end="!\\n")\n\n# 查看 Python 之禅（设计哲学）\nimport this'},
  'python-2-0':{demo:'datatype',code:'# 变量与命名规则\n# Python 是动态类型语言，变量无需声明类型\n\n# 命名规范：\n# - 普通变量: snake_case (蛇形命名法)\n# - 常量: ALL_CAPS\n# - 类名: PascalCase\nPI = 3.14159  # 约定：全大写表示常量\n\nuser_name = "张三"\nage = 20\nscore = 95.5\nis_pass = True\n\nprint(f"姓名: {user_name}, 年龄: {age}")\nprint(f"分数: {score}, 通过: {is_pass}")\n\n# 多重赋值（Python特性）\nx, y, z = 1, 2.5, "hello"\na = b = c = 10\nx, y = y, x  # 优雅的变量交换\nprint(f"交换后: x={x}, y={y}")'},
  'python-2-1':{demo:'datatype',code:'# 基本数据类型\n# Python 有6种标准数据类型: 数字、字符串、列表、元组、字典、集合\n\n# 数字类型\na = 10          # int (整数, 无大小限制)\nb = 3.14        # float (浮点数)\nc = 1 + 2j      # complex (复数)\nd = 0b1010      # 二进制 = 10\ne = 0o12        # 八进制 = 10\nf = 0x0A        # 十六进制 = 10\n\n# 布尔类型 (bool 是 int 的子类)\nprint(True == 1, False == 0)\nprint(True + 1)  # 2\n\n# 类型查询与转换\nnums = [10, 3.14, 1+2j, True, "42"]\nfor n in nums:\n    print(f"{str(n):>8} 类型: {type(n).__name__}")\n\n# 类型转换\nprint(int("42") + 8)      # 50\nprint(float("3.14") * 2)  # 6.28'},
  'python-2-2':{demo:'operator',code:'# 运算符与表达式\n\n# 算术运算符\na, b = 17, 5\nprint(a + b, a - b, a * b)\nprint(a / b, a // b, a % b, a ** b)\n\n# 关系运算符\nx, y = 10, 20\nprint(x < y, x >= y, x == y, x != y)\n\n# 逻辑运算符 (短路求值)\nprint(True and False, True or False, not True)\n\n# 成员运算符\nnums = [1, 2, 3, 4, 5]\nprint(3 in nums, 6 not in nums)\n\n# 同一性运算符\na_list = [1, 2]\nb_list = [1, 2]\nc_list = a_list\nprint(a_list == b_list, a_list is b_list, a_list is c_list)'},
  'python-3-0':{demo:'control-flow',code:'# 条件判断\n\n# if-elif-else 多分支\nscore = 85\nif score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelif score >= 70:\n    grade = "C"\nelif score >= 60:\n    grade = "D"\nelse:\n    grade = "F"\nprint(f"成绩: {score} -> 等级: {grade}")\n\n# 三元表达式\nage = 20\nstatus = "成年" if age >= 18 else "未成年"\nprint(status)\n\n# match-case (Python 3.10+)\ndef handle_cmd(cmd):\n    match cmd:\n        case "help":     return "显示帮助"\n        case "quit" | "exit" | "q": return "退出"\n        case _:          return "未知命令"\n\nprint(handle_cmd("help"), handle_cmd("exit"))\n\n# 闰年判断\nyear = 2024\nis_leap = (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)\nprint(f"{year} 是闰年" if is_leap else f"{year} 不是闰年")'},
  'python-3-1':{demo:'control-flow',code:'# 循环语句\n\n# for-in 循环 + range()\nprint("for 循环:")\nfor i in range(5):         # 0,1,2,3,4\n    print(i, end=" ")\nprint()\n\nfor i in range(2, 10, 2):  # 2,4,6,8\n    print(i, end=" ")\nprint()\n\n# 遍历字符串\nfor ch in "Python":\n    print(ch, end="-")\nprint()\n\n# enumerate 获取索引和值\nfruits = ["苹果", "香蕉", "橘子"]\nfor i, fruit in enumerate(fruits):\n    print(f"{i}: {fruit}")\n\n# while 循环\ni = 1\nwhile i <= 5:\n    print(i, end=" ")\n    i += 1\nprint()\n\n# break / continue / pass\nfor i in range(10):\n    if i == 3: continue\n    if i == 7: break\n    print(i, end=" ")\nprint()\n\n# for-else: 循环正常结束（非break）时执行else\nfor i in range(5):\n    pass\nelse:\n    print("循环正常结束")'},
  'python-3-2':{demo:'control-flow',code:'# 流程控制综合练习\n\n# 1. 九九乘法表\nprint("=== 九九乘法表 ===")\nfor i in range(1, 10):\n    for j in range(1, i + 1):\n        print(f"{j}*{i}={i*j:2}", end="  ")\n    print()\n\n# 2. 斐波那契数列前n项\ndef fib(n):\n    a, b = 0, 1\n    result = []\n    for _ in range(n):\n        result.append(a)\n        a, b = b, a + b\n    return result\nprint(f"斐波那契前10项: {fib(10)}")\n\n# 3. 素数判断\ndef is_prime(n):\n    if n < 2: return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0: return False\n    return True\n\nprimes = [n for n in range(2, 50) if is_prime(n)]\nprint(f"2-50的素数: {primes}")\n\n# 4. 水仙花数\nfor num in range(100, 1000):\n    a = num // 100\n    b = (num // 10) % 10\n    c = num % 10\n    if a**3 + b**3 + c**3 == num:\n        print(f"水仙花数: {num}", end=" ")\nprint()'},
  'python-4-0':{demo:'array',code:'# 列表操作\n\n# 创建列表\nnums = [1, 2, 3, 4, 5]\nmixed = [1, "hello", 3.14, True]\n\n# 索引与切片\nprint(nums[0], nums[-1])\nprint(nums[1:4], nums[::-1])\n\n# 增删改查\nnums.append(6)\nnums.insert(2, 99)\nnums.extend([7, 8])\nnums.remove(99)\npopped = nums.pop()\nprint(f"弹出: {popped}, 剩余: {nums}")\n\n# 排序\nnums = [3, 1, 4, 1, 5, 9, 2, 6]\nnums.sort()\nprint(f"升序: {nums}")\nnums.sort(reverse=True)\nprint(f"降序: {nums}")\n\n# 列表推导式\nsquares = [x**2 for x in range(1, 11)]\nprint(f"1-10的平方: {squares}")\n\nevens = [x for x in range(1, 21) if x % 2 == 0]\nprint(f"偶数: {evens}")'},
  'python-4-1':{demo:'array',code:'# 元组与不可变性\n\n# 元组: 不可变序列\nt = (1, 2, 3, 4, 5)\nprint(t[0], t[-1], t[1:4])\n\n# 单元素元组（逗号不能省）\nsingle = (42,)     # tuple\nnot_tuple = (42)   # int\n\n# 打包与解包\npacked = 1, 2, 3\na, b, c = packed\nprint(f"a={a}, b={b}, c={c}")\n\n# 交换变量\nx, y = 10, 20\nx, y = y, x\nprint(f"交换后: x={x}, y={y}")\n\n# 多返回值函数\ndef min_max(nums):\n    return min(nums), max(nums)\nmi, ma = min_max([3, 1, 4, 1, 5])\nprint(f"min={mi}, max={ma}")\n\n# namedtuple\nfrom collections import namedtuple\nPoint = namedtuple("Point", ["x", "y"])\np = Point(3, 4)\nprint(f"坐标: ({p.x}, {p.y})")'},
  'python-4-2':{demo:'array',code:'# 字符串处理\n\n# 创建字符串\ns1 = "单引号"\ns2 = "双引号"\ns3 = """三引号\n可以换行！"""\ns4 = f"f-string: {s1}"\n\n# 转义与原始字符串\nprint("换行\\n制表\\t引号"你好"")\nprint(r"C:\\new\\test")  # r前缀: 原始字符串, 不转义\n\n# 索引与切片\ns = "Python"\nprint(s[0], s[-1], s[0:3], s[::-1])\n\n# 常用方法\ntext = "  Hello Python World  "\nprint(text.strip(), text.upper(), text.lower())\n\n# 分割与连接\ncsv = "张三,85,95,78"\nparts = csv.split(",")\nprint(parts)\n\nwords = ["Python", "is", "awesome"]\nprint(" ".join(words))\n\n# 查找与替换\ns = "hello world hello"\nprint(s.find("hello"), s.count("hello"))\nprint(s.replace("hello", "你好"))'},
  'python-4-3':{demo:'array',code:'# 序列通用操作\n\nseq = [10, 20, 30, 40, 50]\n\n# 索引 (从0开始, 负数从末尾)\nprint(seq[0], seq[-1])\n\n# 切片 [start:stop:step]\nprint(seq[1:4], seq[:3], seq[2:], seq[::2])\n\n# 通用函数\nprint(len(seq), min(seq), max(seq), sum(seq))\n\n# 成员检测\nprint(3 in seq, 30 in seq)\nprint("th" in "Python")\n\n# 连接与重复\nprint([1, 2] + [3, 4])\nprint([1, 2] * 3)\n\n# enumerate 带索引遍历\nfor i, v in enumerate(seq):\n    print(f"seq[{i}]={v}", end="  ")\nprint()'},
  'python-5-0':{demo:'struct',code:'# 字典操作\n\n# 创建字典\nstudent = {"name": "张三", "age": 20, "score": 95}\npairs = dict([("a", 1), ("b", 2)])\nsquares = {x: x**2 for x in range(1, 6)}\nprint(squares)\n\n# 增删改查\ninfo = {}\ninfo["name"] = "张三"\ninfo["age"] = 20\nprint(info["name"])\nprint(info.get("score", 0))\ninfo["age"] = 21\ndel info["age"]\npopped = info.pop("name")\n\n# 遍历字典\nd = {"a": 1, "b": 2, "c": 3}\nprint(d.keys(), d.values())\nfor k, v in d.items():\n    print(f"{k}:{v}", end="  ")\nprint()\n\n# setdefault\nd.setdefault("d", 4)\nprint(d)\n\n# 词频统计\ntext = "apple banana apple orange banana apple"\nwords = text.split()\nfreq = {}\nfor w in words:\n    freq[w] = freq.get(w, 0) + 1\nprint(f"词频: {freq}")'},
  'python-5-1':{demo:'struct',code:'# 集合与运算\n\n# 创建集合（自动去重）\ns1 = {1, 2, 3, 4, 5}\ns2 = set([1, 2, 2, 3, 3])\n\n# 集合运算\na = {1, 2, 3, 4}\nb = {3, 4, 5, 6}\nprint(a & b, a | b, a - b, a ^ b)\n\n# 集合方法\ns = {1, 2, 3}\ns.add(4)\ns.remove(2)\ns.discard(999)\npopped = s.pop()\n\n# 成员检测 O(1)\nbig_set = set(range(100000))\nprint(99999 in big_set)\n\n# 快速去重\ndata = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4]\nunique = list(set(data))\nprint(f"去重结果: {sorted(unique)}")\n\n# 找共同元素\nlist1 = [1, 2, 3, 4, 5]\nlist2 = [4, 5, 6, 7, 8]\nprint(f"共同: {set(list1) & set(list2)}")'},
  'python-6-0':{demo:'function',code:'# 函数定义与参数\n\n# 基本定义\ndef greet(name):\n    """向用户问好"""\n    return f"你好, {name}!"\n\nprint(greet("张三"))\n\n# 多返回值\ndef stats(nums):\n    return min(nums), max(nums), sum(nums)/len(nums)\nmi, ma, avg = stats([85, 92, 78, 95])\nprint(f"最低:{mi}, 最高:{ma}, 平均:{avg:.1f}")\n\n# 默认参数\ndef power(base, exp=2):\n    return base ** exp\nprint(power(5), power(5, 3))\n\n# 关键字参数\ndef student(name, age):\n    print(f"{name}: {age}岁")\nstudent(age=22, name="李四")\n\n# 可变参数 *args\ndef sum_all(*args):\n    return sum(args)\nprint(sum_all(1, 2, 3, 4, 5))\n\n# 可变关键字参数 **kwargs\ndef print_info(**kwargs):\n    for k, v in kwargs.items():\n        print(f"{k}: {v}")\nprint_info(name="张三", age=20, score=95)\n\n# 解包传参\nnums = [10, 20, 30]\nprint(*nums)'},
  'python-6-1':{demo:'recursion',code:'# 递归函数\n# 三要素: 基线条件、递归条件、调用自身\n\n# 阶乘\ndef factorial(n):\n    if n <= 1: return 1\n    return n * factorial(n - 1)\nprint(f"5! = {factorial(5)}")\n\n# 斐波那契\ndef fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)\nprint(f"fib(10) = {fib(10)}")\n\n# 汉诺塔\ndef hanoi(n, src, dst, aux):\n    if n == 1:\n        print(f"  盘1: {src} -> {dst}")\n        return\n    hanoi(n-1, src, aux, dst)\n    print(f"  盘{n}: {src} -> {dst}")\n    hanoi(n-1, aux, dst, src)\n\nprint("汉诺塔 (3层):")\nhanoi(3, "A", "C", "B")\n\n# 递归优化: lru_cache\nfrom functools import lru_cache\n@lru_cache(maxsize=None)\ndef fib_fast(n):\n    if n <= 1: return n\n    return fib_fast(n-1) + fib_fast(n-2)\nprint(f"fib_fast(35) = {fib_fast(35)}")'},
  'python-6-2':{demo:'function',code:'# 变量作用域与lambda\n\n# LEGB 规则: Local -> Enclosing -> Global -> Built-in\nGLOBAL_VAR = "全局变量"\n\ndef show_scope():\n    local_var = "局部变量"\n    print("内部:", local_var, GLOBAL_VAR)\n\nshow_scope()\n\n# 修改全局需要 global\ncounter = 0\ndef increment():\n    global counter\n    counter += 1\nincrement(); increment()\nprint(f"counter: {counter}")\n\n# 闭包中使用 nonlocal\ndef outer():\n    x = "外层"\n    def inner():\n        nonlocal x\n        x = "内层修改了外层"\n    inner()\n    print(x)\nouter()\n\n# lambda 匿名函数\nsquare = lambda x: x ** 2\nadd = lambda a, b: a + b\nprint(square(7), add(3, 5))\n\n# lambda 与高阶函数\nnums = [1, 2, 3, 4, 5]\nsquared = list(map(lambda x: x**2, nums))\nevens = list(filter(lambda x: x % 2 == 0, nums))\nprint(f"平方: {squared}, 偶数: {evens}")'},
  'python-7-0':{demo:'function',code:'# 模块导入机制\n\n# 1. import 模块名\nimport math\nprint(math.sqrt(16), math.pi)\n\n# 2. from 模块 import 名称\nfrom random import randint, choice\nprint(randint(1, 100), choice(["A", "B", "C"]))\n\n# 3. import as 别名\nimport numpy as np\n\n# __name__ == "__main__"\nprint(f"当前模块名: {__name__}")\nif __name__ == "__main__":\n    print("这是主程序入口!")\n\n# 自定义模块示例:\n# 创建 mymodule.py:\n#   def hello(): return "Hello!"\n# 使用: import mymodule; mymodule.hello()'},
  'python-7-1':{demo:'function',code:'# 常用标准库实战\n\n# 1. random\nimport random\nprint(f"骰子: {random.randint(1, 6)}")\nprint(f"抽奖: {random.choice([1, 2, 3])}")\nnums = list(range(1, 11))\nrandom.shuffle(nums)\nprint(f"打乱: {nums}")\n\n# 2. time / datetime\nimport time\nfrom datetime import datetime\nnow = datetime.now()\nprint(f"当前: {now.strftime(\'%Y-%m-%d %H:%M:%S\')}")\n\n# 程序计时\nstart = time.perf_counter()\ntotal = sum(range(1000000))\nelapsed = time.perf_counter() - start\nprint(f"累加100万用时: {elapsed:.4f}秒")\n\n# 3. json\nimport json\ndata = {"name": "张三", "scores": [85, 92, 78]}\njson_str = json.dumps(data, ensure_ascii=False, indent=2)\nprint(f"JSON:\\n{json_str}")'},
  'python-8-0':{demo:'file-io',code:'# 文件读写操作\n\n# 写入文件\nwith open("demo.txt", "w", encoding="utf-8") as f:\n    f.write("第一行: Hello Python\\n")\n    f.write("第二行: 你好 Python\\n")\nprint("demo.txt 已创建!")\n\n# 读取方式\n# read() 读取全部\nwith open("demo.txt", "r", encoding="utf-8") as f:\n    content = f.read()\n    print(f"\\n=== read() ===\\n{content}")\n\n# readline() 逐行\nwith open("demo.txt", "r", encoding="utf-8") as f:\n    while (line := f.readline()):\n        print(line.strip())\n\n# 直接遍历文件对象（推荐）\nwith open("demo.txt", "r", encoding="utf-8") as f:\n    for i, line in enumerate(f, 1):\n        print(f"第{i}行: {line.strip()}")'},
  'python-8-1':{demo:'file-io',code:'# CSV与JSON处理\n\nimport csv, json\n\n# CSV写入\nstudents = [\n    ["张三", 85, 92, 88],\n    ["李四", 78, 95, 82],\n    ["王五", 90, 89, 91]\n]\nwith open("students.csv", "w", newline="", encoding="utf-8") as f:\n    writer = csv.writer(f)\n    writer.writerow(["姓名", "语文", "数学", "英语"])\n    writer.writerows(students)\n\n# CSV读取\nwith open("students.csv", "r", encoding="utf-8") as f:\n    reader = csv.reader(f)\n    header = next(reader)\n    for row in reader:\n        name = row[0]\n        scores = [int(s) for s in row[1:]]\n        avg = sum(scores) / len(scores)\n        print(f"{name}: 均分 {avg:.1f}")\n\n# JSON\ndata = {"course": "Python程序设计", "chapters": 10}\njson_str = json.dumps(data, ensure_ascii=False, indent=2)\nprint(json_str)'},
  'python-8-2':{demo:'control-flow',code:'# 异常捕获与处理\n\ndef safe_divide(a, b):\n    try:\n        result = a / b\n    except ZeroDivisionError:\n        print("错误: 除数不能为零!")\n        return None\n    except TypeError as e:\n        print(f"类型错误: {e}")\n        return None\n    else:\n        print("计算成功!")\n        return result\n    finally:\n        print("清理资源...")\n\nprint(safe_divide(10, 2))\nprint(safe_divide(10, 0))\n\n# raise 主动抛出异常\ndef validate_age(age):\n    if age < 0 or age > 150:\n        raise ValueError(f"年龄 {age} 不合法")\n    return age\n\ntry:\n    validate_age(200)\nexcept ValueError as e:\n    print(f"验证失败: {e}")\n\n# 自定义异常\nclass InsufficientFundsError(Exception):\n    pass\n\ntry:\n    balance = 100\n    amount = 500\n    if amount > balance:\n        raise InsufficientFundsError("余额不足")\nexcept InsufficientFundsError as e:\n    print(f"交易失败: {e}")'},
  'python-9-0':{demo:'struct',code:'# 类与对象\n\nclass Student:\n    """学生类"""\n    school = "中原工学院"  # 类属性\n\n    def __init__(self, name, age, score=0):\n        self.name = name\n        self.age = age\n        self.score = score\n\n    def study(self, hours):\n        self.score += hours * 2\n        print(f"{self.name} 学习了{hours}小时, 分数+{hours*2}")\n\n    def __str__(self):\n        return f"Student({self.name}, {self.age}岁, {self.score}分)"\n\n# 创建对象\ns1 = Student("张三", 20, 85)\ns2 = Student("李四", 19)\nprint(s1)\ns1.study(3)\nprint(f"s1分数: {s1.score}")\nprint(s1.__dict__)'},
  'python-9-1':{demo:'struct',code:'# 继承与多态\n\nclass Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return f"{self.name} 发出声音"\n\nclass Dog(Animal):\n    def speak(self):\n        return f"{self.name} 汪汪叫!"\n\nclass Cat(Animal):\n    def speak(self):\n        return f"{self.name} 喵喵叫!"\n\n# 多态: 同一方法，不同行为\nanimals = [Dog("旺财"), Cat("咪咪"), Dog("大黄")]\nfor animal in animals:\n    print(animal.speak())\n\n# super() 调用父类\nclass Puppy(Dog):\n    def __init__(self, name, toy):\n        super().__init__(name)\n        self.toy = toy\n    def speak(self):\n        parent_sound = super().speak()\n        return f"{parent_sound} （还是小狗呢！）"\n\np = Puppy("点点", "骨头")\nprint(p.speak())\nprint(isinstance(p, Dog), issubclass(Puppy, Dog))'},
  'python-9-2':{demo:'struct',code:'# 魔术方法与特性\n\nclass Vector:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n\n    def __add__(self, other):\n        return Vector(self.x + other.x, self.y + other.y)\n\n    def __mul__(self, scalar):\n        return Vector(self.x * scalar, self.y * scalar)\n\n    def __len__(self):\n        return int((self.x**2 + self.y**2) ** 0.5)\n\n    def __str__(self):\n        return f"Vector({self.x}, {self.y})"\n\nv1 = Vector(3, 4)\nv2 = Vector(1, 2)\nprint(v1 + v2, v1 * 3, len(v1))\n\n# @property 装饰器\nclass Circle:\n    def __init__(self, radius):\n        self._radius = radius\n\n    @property\n    def radius(self):\n        return self._radius\n\n    @radius.setter\n    def radius(self, value):\n        if value < 0:\n            raise ValueError("半径不能为负")\n        self._radius = value\n\n    @property\n    def area(self):\n        import math\n        return math.pi * self._radius ** 2\n\nc = Circle(5)\nprint(f"半径: {c.radius}, 面积: {c.area:.2f}")\nc.radius = 10\nprint(f"缩放后面积: {c.area:.2f}")'},
  'python-10-0':{demo:'control-flow',code:'# 爬虫入门\n# 注意: 遵守网站 robots.txt\n\nimport requests\nfrom bs4 import BeautifulSoup\n\n# HTTP请求\ndef fetch_page(url):\n    headers = {\n        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"\n    }\n    try:\n        r = requests.get(url, headers=headers, timeout=10)\n        r.raise_for_status()\n        r.encoding = r.apparent_encoding\n        return r.text\n    except Exception as e:\n        print(f"请求失败: {e}")\n        return None\n\n# HTML解析示例\nhtml = """\n<html><body>\n<h1 class="title">Python 爬虫</h1>\n<p class="content">Hello World!</p>\n<a href="http://example.com">Example</a>\n<ul><li>项目1</li><li>项目2</li></ul>\n</body></html>\n"""\nsoup = BeautifulSoup(html, "html.parser")\ntitle = soup.select_one("h1.title")\nprint(f"标题: {title.text}")\nlinks = soup.find_all("a")\nfor a in links:\n    print(f"链接: {a.get(\'href\')} -> {a.text}")'},
  'python-10-1':{demo:'control-flow',code:'# 数据分析基础 (pandas)\n\nimport pandas as pd\nimport io\n\n# 创建示例数据集\ncsv_data = """姓名,语文,数学,英语\n张三,85,92,88\n李四,78,95,82\n王五,90,89,91\n赵六,82,78,85\n钱七,95,91,94"""\n\ndf = pd.read_csv(io.StringIO(csv_data))\nprint("=== 原始数据 ===")\nprint(df)\n\n# 基本统计\nprint("\\n=== 描述统计 ===")\nprint(df.describe())\n\n# 数据透视\ndf["均分"] = df[["语文", "数学", "英语"]].mean(axis=1).round(1)\ndf_sorted = df.sort_values("均分", ascending=False)\nprint("\\n=== 按均分排序 ===")\nprint(df_sorted[["姓名", "均分"]])\n\n# 筛选\nhigh_perf = df[df["均分"] >= 90]\nprint(f"\\n均分>=90的高分学生: {len(high_perf)}人")'},
  'python-10-2':{demo:'control-flow',code:'# 综合项目实战：学生成绩管理系统\n\nimport json\nfrom datetime import datetime\n\nclass GradeManager:\n    """学生成绩管理系统"""\n    def __init__(self):\n        self.students = []\n\n    def add_student(self, name, scores_dict):\n        avg = sum(scores_dict.values()) / len(scores_dict)\n        record = {\n            "name": name,\n            "scores": scores_dict,\n            "avg": round(avg, 1),\n            "add_time": datetime.now().strftime("%Y-%m-%d %H:%M")\n        }\n        self.students.append(record)\n        print(f"OK 已添加 {name}, 均分: {avg:.1f}")\n\n    def get_ranking(self):\n        return sorted(self.students, key=lambda x: x["avg"], reverse=True)\n\n    def get_stats(self):\n        if not self.students: return {}\n        avgs = [s["avg"] for s in self.students]\n        return {\n            "总人数": len(self.students),\n            "平均分": round(sum(avgs) / len(avgs), 1),\n            "最高分": max(avgs),\n            "最低分": min(avgs)\n        }\n\n# 使用示例\ngm = GradeManager()\ngm.add_student("张三", {"语文": 85, "数学": 92, "英语": 88})\ngm.add_student("李四", {"语文": 78, "数学": 95, "英语": 82})\ngm.add_student("王五", {"语文": 90, "数学": 89, "英语": 91})\n\nprint("\\n=== 成绩排名 ===")\nfor i, s in enumerate(gm.get_ranking(), 1):\n    print(f"{i}. {s[\'name\']}: {s[\'avg\']}分")\n\nprint("\\n=== 班级统计 ===")\nfor k, v in gm.get_stats().items():\n    print(f"{k}: {v}")'},

};



/* ═══════ 视频演示引擎 ═══════ */

const VideoDemoEngine = {

  canvas:null, ctx:null, W:0, H:0, dpr:1,

  animId:null, frame:0, state:{}, type:'',

  init(canvasEl){

    this.canvas=canvasEl; this.ctx=canvasEl.getContext('2d');

    this.dpr=window.devicePixelRatio||1; this.resize();

  },

  resize(){

    const r=this.canvas.parentElement.getBoundingClientRect();

    this.W=r.width; this.H=Math.max(280,Math.min(400,this.W*0.6));

    this.canvas.width=this.W*this.dpr; this.canvas.height=this.H*this.dpr;

    this.canvas.style.width=this.W+'px'; this.canvas.style.height=this.H+'px';

    this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0);

  },

  start(type){this.stop();this.type=type;this.frame=0;this.state={};this.loop();},

  stop(){if(this.animId){cancelAnimationFrame(this.animId);this.animId=null;}},

  loop(){

    this.frame++;

    const c=this.ctx,w=this.W,h=this.H;

    c.fillStyle='#0a0c12';c.fillRect(0,0,w,h);

    c.strokeStyle='rgba(255,255,255,0.03)';c.lineWidth=0.5;

    for(let x=0;x<w;x+=40){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke();}

    for(let y=0;y<h;y+=40){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();}

    switch(this.type){

      case'intro':this._intro(c,w,h);break;

      case'datatype':this._datatype(c,w,h);break;

      case'operator':this._operator(c,w,h);break;

      case'control-flow':this._ctrlFlow(c,w,h);break;

      case'function':this._func(c,w,h);break;

      case'recursion':this._recursion(c,w,h);break;

      case'array':this._array(c,w,h);break;

      case'pointer':this._ptr(c,w,h);break;

      case'struct':this._struct(c,w,h);break;

      case'linked-list':this._llist(c,w,h);break;

      case'file-io':this._fileio(c,w,h);break;

      case'memory-mgmt':this._memmgmt(c,w,h);break;

      case'preprocessor':this._preproc(c,w,h);break;

      case'class':case'cpp-intro':this._classAnim(c,w,h);break;

      case'constructor':this._ctor(c,w,h);break;

      case'reference':this._ref(c,w,h);break;

      case'inheritance':this._inher(c,w,h);break;

      case'polymorphism':this._poly(c,w,h);break;

      case'template':this._tmpl(c,w,h);break;

      case'stl':this._stl(c,w,h);break;

      default:this._default(c,w,h);

    }

    this.animId=requestAnimationFrame(()=>this.loop());

  },

  _box(c,x,y,w,h,color,alpha){c.fillStyle=color+','+alpha+')';c.fillRect(x,y,w,h);c.strokeStyle=color+')';c.lineWidth=1.5;c.strokeRect(x,y,w,h);},

  _arrow(c,x1,y1,x2,y2,color){

    const a=Math.atan2(y2-y1,x2-x1),len=8;

    c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.strokeStyle=color;c.lineWidth=2;c.stroke();

    c.beginPath();c.moveTo(x2,y2);c.lineTo(x2-len*Math.cos(a-Math.PI/6),y2-len*Math.sin(a-Math.PI/6));

    c.lineTo(x2-len*Math.cos(a+Math.PI/6),y2-len*Math.sin(a+Math.PI/6));c.closePath();c.fillStyle=color;c.fill();

  },

  _intro(c,w,h){

    const cyc=Math.floor(this.frame/80)%4,steps=['#include <stdio.h>','int main()','printf(...)','return 0'];

    c.font='bold 16px monospace';c.textAlign='center';

    for(let i=0;i<4;i++){c.fillStyle=i<=cyc?'#818cf8':'#3a3f5c';c.fillText(steps[i],w/2,40+i*45);}

    if(cyc>=2){c.font='14px sans-serif';c.fillStyle='#86efac';c.fillText('-> Hello, World!',w/2,230);}

  },

  _datatype(c,w,h){

    const types=[{n:'char',s:1,co:'#ef4444'},{n:'int',s:4,co:'#f59e0b'},{n:'float',s:4,co:'#10b981'},{n:'double',s:8,co:'#6366f1'}];

    const f=Math.min(1,this.frame/60),barW=w*0.45;

    c.font='13px monospace';c.textAlign='right';

    types.forEach((t,i)=>{const y=40+i*70;c.globalAlpha=f;c.fillStyle='#8b9ab5';c.fillText(t.n+' ('+t.s+'B)',w*0.35-15,y+18);this._box(c,w*0.35,y,barW*(t.s/8)*f,30+t.s*15,'rgba('+parseInt(t.co.slice(1,3),16)+','+parseInt(t.co.slice(3,5),16)+','+parseInt(t.co.slice(5,7),16),0.2);c.globalAlpha=1;});

  },

  _operator(c,w,h){

    const exprs=[['10+3','13'],['10-3','7'],['10*3','30'],['10/3','3'],['10%3','1']];

    const idx=Math.floor(this.frame/100)%5;

    c.font='bold 20px monospace';c.textAlign='center';

    exprs.forEach((e,i)=>{c.fillStyle=i===idx?'#818cf8':'#3a3f5c';c.fillText(e[0]+' = '+e[1],w/2,40+i*45);});

  },

  _ctrlFlow(c,w,h){

    const f=this.frame%200,cx=w*0.3,cy=100;

    c.strokeStyle='#6366f1';c.lineWidth=2;

    c.beginPath();c.moveTo(cx,cy-30);c.lineTo(cx+60,cy);c.lineTo(cx,cy+30);c.lineTo(cx-60,cy);c.closePath();c.stroke();

    c.font='12px sans-serif';c.fillStyle='#818cf8';c.textAlign='center';c.fillText('if?',cx,cy+5);

    if(f<100){c.fillStyle='#86efac';c.fillText('true:printf("A")',cx-80,cy-25);}

    else{c.fillStyle='#f87171';c.fillText('false:printf("B")',cx-80,cy-25);}

    c.strokeStyle='#f59e0b';c.beginPath();c.ellipse(w*0.7,cy,50,35,0,0,Math.PI*2);c.stroke();

    c.fillStyle='#f59e0b';c.fillText('for(i=0;i<5;i++)',w*0.7,cy+5);c.fillText('i='+Math.min(5,Math.floor(f/30)),w*0.7,cy+50);

  },

  _func(c,w,h){

    const f=Math.floor(this.frame/80)%6;

    for(let i=0;i<=f;i++){

      this._box(c,20+i*15,h-80-i*15,w-40-2*i*15,55,'rgba(99,102,241',0.1+0.1*i);

      c.font='12px monospace';c.fillStyle='#a5b4fc';c.textAlign='left';

      c.fillText('factorial('+(5-i)+') {',35+i*15,h-55-i*15);

      if(i===f&&f>=4){c.fillStyle='#86efac';c.fillText('return '+(f===0?1:f),45,h-30);}

    }

  },

  _recursion(c,w,h){

    const depth=1+Math.floor(this.frame/60)%5;

    function drawTree(x,y,d,angle,da){

      if(d>depth)return;

      const len=Math.min(50,400/d),x2=x+len*Math.cos(angle),y2=y+len*Math.sin(angle);

      c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);

      c.strokeStyle=d===depth?'#86efac':'#6366f1';c.lineWidth=Math.max(1,4-d);c.stroke();

      c.font='11px monospace';c.fillStyle='#a5b4fc';c.textAlign='center';c.fillText('f('+d+')',x,y-8);

      drawTree(x2,y2,d+1,angle-da,da*0.7);drawTree(x2,y2,d+1,angle+da,da*0.7);

    }

    drawTree(w/2,h-20,1,-Math.PI/2,Math.PI/5);

  },

  _array(c,w,h){

    const n=8,vals=[10,20,30,40,50,60,70,80],i=Math.floor(this.frame/40)%n,cellW=(w-40)/n;

    for(let j=0;j<n;j++){

      this._box(c,10+j*cellW,80,cellW-4,50,'rgba('+(j===i?'245,158,11':'99,102,241'),j===i?0.3:0.1);

      c.font='bold 14px monospace';c.fillStyle='#f0f2f8';c.textAlign='center';c.fillText(vals[j],10+j*cellW+cellW/2-2,110);

      c.font='10px sans-serif';c.fillStyle='#8b9ab5';c.fillText('['+j+']',10+j*cellW+cellW/2-2,55);

    }

    c.font='13px sans-serif';c.fillStyle='#f59e0b';c.textAlign='center';c.fillText('arr['+i+']='+vals[i],w/2,170);

    c.fillStyle='#8b9ab5';c.fillText('数组在内存中连续存储',w/2,190);

  },

  _ptr(c,w,h){

    const cx=w/2,cy=80;

    this._box(c,cx-50,cy,60,60,'rgba(99,102,241',0.15);

    c.font='bold 16px monospace';c.fillStyle='#f0f2f8';c.textAlign='center';c.fillText('42',cx-20,cy+38);

    c.font='10px sans-serif';c.fillStyle='#8b9ab5';c.fillText('x',cx-20,cy-8);c.fillText('@0x1000',cx-20,cy+72);

    this._box(c,cx+80,cy,60,60,'rgba(245,158,11',0.15);

    c.font='bold 14px monospace';c.fillStyle='#f0f2f8';c.fillText('0x1000',cx+110,cy+38);

    c.font='10px sans-serif';c.fillStyle='#f59e0b';c.fillText('p',cx+110,cy-8);

    this._arrow(c,cx+80,cy+30,cx+10,cy+30,'#f59e0b');

    c.font='13px sans-serif';c.fillStyle='#a5b4fc';c.textAlign='center';c.fillText('int *p=&x; *p=100;',w/2,180);

  },

  _struct(c,w,h){

    const cols=[{l:'name',t:'char[20]',o:0,co:'#ef4444'},{l:'age',t:'int',o:20,co:'#f59e0b'},{l:'score',t:'float',o:24,co:'#10b981'}];

    const sx=(w-cols.length*90)/2,cy=80;

    cols.forEach((col,i)=>{this._box(c,sx+i*90,cy,80,70,'rgba('+parseInt(col.co.slice(1,3),16)+','+parseInt(col.co.slice(3,5),16)+','+parseInt(col.co.slice(5,7),16),0.15);

      c.font='11px monospace';c.fillStyle='#f0f2f8';c.textAlign='center';c.fillText(col.l,sx+i*90+40,cy+25);

      c.font='10px sans-serif';c.fillStyle=col.co;c.fillText(col.t,sx+i*90+40,cy+42);

      c.fillStyle='#8b9ab5';c.fillText('@'+col.o,sx+i*90+40,cy+58);

    });

    c.font='13px sans-serif';c.fillStyle='#a5b4fc';c.textAlign='center';c.fillText('struct Student 内存布局',w/2,180);

  },

  _llist(c,w,h){

    const n=4,vals=[1,2,3,4],f=Math.min(n-1,Math.floor(this.frame/60)%(n+1)),cx=30,cy=90;

    for(let i=0;i<n;i++){

      const x=cx+i*130;

      this._box(c,x,cy,55,45,'rgba('+(i===f?'245,158,11':'99,102,241'),i===f?0.3:0.1);

      c.font='bold 14px monospace';c.fillStyle='#f0f2f8';c.textAlign='center';c.fillText(vals[i],x+27,cy+30);

      if(i<n-1)this._arrow(c,x+58,cy+22,x+125,cy+22,'#a5b4fc');

    }

    c.font='13px sans-serif';c.fillStyle='#f59e0b';c.textAlign='center';c.fillText('data='+(vals[f]||'-'),w/2,170);

  },

  _fileio(c,w,h){

    const f=Math.floor(this.frame/100)%4,stages=['fopen("test.txt","w")','fprintf(fp,"Hello")','fclose(fp)','fgets(fp,buf,100)'];

    c.font='14px monospace';c.textAlign='center';

    stages.forEach((s,i)=>{c.fillStyle=i===f?'#86efac':(i<f?'#6366f1':'#3a3f5c');c.fillText(s,w/2,30+i*45);});

    this._box(c,w/2-30,200,60,50,'rgba(14,165,233',0.1);

    c.font='bold 14px';c.fillStyle='#0ea5e9';c.fillText('FILE',w/2,230);

  },

  _memmgmt(c,w,h){

    const f=Math.floor(this.frame/80)%5;

    for(let i=0;i<4;i++){const x=30+i*95,isAlloc=f>i,isFreed=f>3;

      this._box(c,x,60,80,50,'rgba('+(isFreed?'239,68,68':isAlloc?'16,185,129':'58,63,92'),isAlloc?0.2:0.05);

      c.font='11px monospace';c.fillStyle='#f0f2f8';c.textAlign='center';

      if(isAlloc&&!isFreed)c.fillText('malloc',x+40,90);else if(isFreed)c.fillText('free',x+40,90);else c.fillText('free',x+40,90);

    }

    this._box(c,30,125,80,25,'rgba(239,68,68',0.1);c.font='11px sans-serif';c.fillStyle='#f87171';c.textAlign='center';c.fillText('memory leak',30+40,142);

    c.font='13px sans-serif';c.fillStyle='#a5b4fc';c.textAlign='center';c.fillText('malloc() + free() !',w/2,180);

  },

  _preproc(c,w,h){

    const f=Math.floor(this.frame/90)%4,stages=['source code','#define replace','#include expand','#if #endif'];

    c.font='13px monospace';c.textAlign='center';

    stages.forEach((s,i)=>{c.fillStyle=i===f?'#f59e0b':(i<f?'#6366f1':'#3a3f5c');c.fillText(s,w/2,30+i*42);

      if(i<3){c.beginPath();c.moveTo(w/2,36+i*42);c.lineTo(w/2,44+i*42);c.strokeStyle='#6366f1';c.stroke();}

    });

  },

  _classAnim(c,w,h){

    const cx=w/2,cy=70;

    this._box(c,cx-80,cy,160,100,'rgba(139,92,246',0.12);

    c.font='bold 13px';c.fillStyle='#a78bfa';c.textAlign='center';c.fillText('class Rectangle',cx,cy+20);

    c.font='12px monospace';c.fillStyle='#f0f2f8';c.fillText('- w, h (private)',cx,cy+45);c.fillText('+ area() (public)',cx,cy+65);

    this._box(c,cx-30,200,60,30,'rgba(245,158,11',0.15);c.font='11px';c.fillStyle='#f59e0b';c.fillText('obj',cx,217);

    this._arrow(c,cx-10,200,cx+20,170,'#a5b4fc');

  },

  _ctor(c,w,h){

    const f=Math.floor(this.frame/100)%4,timeline=['Demo a; // ctor','Demo b=a; // copy ctor','} // out of scope','~Demo() ~Demo()'];

    c.font='13px monospace';c.textAlign='center';

    timeline.forEach((t,i)=>{c.fillStyle=i===f?'#86efac':(i<f?'#6366f1':'#3a3f5c');c.fillText(t,w/2,40+i*50);});

  },

  _ref(c,w,h){

    const cx=w/2,cy=70;

    this._box(c,cx-80,cy,70,45,'rgba(16,185,129',0.15);c.font='bold 14px';c.fillStyle='#f0f2f8';c.textAlign='center';c.fillText('x=3',cx-45,cy+28);

    this._box(c,cx+10,cy,70,45,'rgba(245,158,11',0.15);c.font='bold 14px';c.fillStyle='#f0f2f8';c.fillText('ref',cx+45,cy+28);

    this._arrow(c,cx+10,cy+22,cx-10,cy+22,'#f59e0b');

    c.font='13px sans-serif';c.fillStyle='#a5b4fc';c.textAlign='center';c.fillText('int &ref=x; // ref is alias',w/2,150);

  },

  _inher(c,w,h){

    const cx=w/2,f=Math.floor(this.frame/120)%3;

    this._box(c,cx-40,25,80,40,'rgba(99,102,241',0.15);c.font='12px';c.fillStyle='#818cf8';c.textAlign='center';c.fillText('Animal',cx,52);

    this._box(c,cx-40,100,80,40,'rgba(245,158,11',0.15);c.font='12px';c.fillStyle='#f59e0b';c.fillText('Dog',cx,127);

    this._arrow(c,cx-10,100,cx-10,65,'#f59e0b');

    if(f>=1){this._box(c,cx-120,100,80,40,'rgba(16,185,129',0.15);c.fillStyle='#10b981';c.fillText('Cat',cx-80,127);this._arrow(c,cx-70,100,cx-20,65,'#10b981');}

    if(f>=2){this._box(c,cx+40,100,80,40,'rgba(236,72,153',0.15);c.fillStyle='#ec4899';c.fillText('Bird',cx+80,127);this._arrow(c,cx+60,100,cx+10,65,'#ec4899');}

  },

  _poly(c,w,h){

    const f=Math.floor(this.frame/100)%3;

    c.font='14px monospace';c.textAlign='center';

    ['Shape *s;','s=new Circle(5)','s->area()=78.5'].forEach((t,i)=>{c.fillStyle=i===f?'#86efac':(i<f?'#6366f1':'#3a3f5c');c.fillText(t,w/2,40+i*50);});

    c.font='13px sans-serif';c.fillStyle='#a5b4fc';c.fillText('virtual -> dynamic binding',w/2,200);

  },

  _tmpl(c,w,h){

    const f=Math.floor(this.frame/100)%3;

    c.font='13px monospace';c.textAlign='center';

    ['template<typename T>','T maxVal(T a,T b){...}','int:10,20 -> 20  double:3.14,2.72->3.14'].forEach((t,i)=>{c.fillStyle=i===f?'#86efac':(i<f?'#6366f1':'#3a3f5c');c.fillText(t,w/2,30+i*50);});

  },

  _stl(c,w,h){

    const f=Math.floor(this.frame/90)%3;

    [{n:'vector',d:'dynamic array',co:'#6366f1'},{n:'list',d:'linked list',co:'#f59e0b'},{n:'map',d:'key-value',co:'#10b981'}].forEach((c2,i)=>{

      this._box(c,20,20+i*90,w-40,75,'rgba('+parseInt(c2.co.slice(1,3),16)+','+parseInt(c2.co.slice(3,5),16)+','+parseInt(c2.co.slice(5,7),16),i===f?0.2:0.08);

      c.font='bold 13px monospace';c.fillStyle=c2.co;c.textAlign='left';c.fillText(c2.n,35,45+i*90);

      c.font='11px sans-serif';c.fillStyle='#8b9ab5';c.fillText(c2.d,35,65+i*90);

    });

  },

  _default(c,w,h){c.font='15px sans-serif';c.fillStyle='#8b9ab5';c.textAlign='center';c.fillText('concept animation',w/2,h/2);}

};



/* ═══════ 3D 可视化引擎 ═══════ */

const Viz3DEngine={

  scene:null,camera:null,renderer:null,controls:null,container:null,animId:null,objects:[],W:0,H:0,

  async init(containerEl,type,kpName){

    this.cleanup();this.container=containerEl;

    const r=containerEl.getBoundingClientRect();this.W=r.width;this.H=Math.max(300,Math.min(450,r.width*0.7));

    containerEl.style.height=this.H+'px';

    const THREE=await import('three');

    const{OrbitControls}=(await import('three/addons/controls/OrbitControls.js'));

    this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x0a0c12);

    this.camera=new THREE.PerspectiveCamera(50,this.W/this.H,0.1,100);

    this.camera.position.set(5,4,8);this.camera.lookAt(0,0,0);

    this.renderer=new THREE.WebGLRenderer({antialias:true});this.renderer.setSize(this.W,this.H);

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

    containerEl.innerHTML='';containerEl.appendChild(this.renderer.domElement);

    this.controls=new OrbitControls(this.camera,this.renderer.domElement);

    this.controls.enableDamping=true;this.controls.dampingFactor=0.08;this.controls.minDistance=3;this.controls.maxDistance=20;

    this.scene.add(new THREE.AmbientLight(0x404060,2));

    const dl=new THREE.DirectionalLight(0xffffff,2);dl.position.set(5,10,5);this.scene.add(dl);

    const dl2=new THREE.DirectionalLight(0x8888ff,1);dl2.position.set(-5,0,-5);this.scene.add(dl2);

    this._buildScene(THREE,type,kpName);

    this._animate();

  },

  _animate(){

    if(!this.renderer)return;

    this.animId=requestAnimationFrame(()=>this._animate());

    this.controls.update();this.renderer.render(this.scene,this.camera);

  },

  _buildScene(THREE,type,kpName){

    const grid=new THREE.GridHelper(10,20,0x333355,0x1a1a33);this.scene.add(grid);

    // axes

    const axLen=5,axPts=[0,0,0,axLen,0,0,0,0,0,0,axLen,0,0,0,0,0,0,axLen];

    const axG=new THREE.BufferGeometry();axG.setAttribute('position',new THREE.Float32BufferAttribute(axPts,3));

    const axC=[1,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,1];

    axG.setAttribute('color',new THREE.Float32BufferAttribute(axC,3));

    this.scene.add(new THREE.LineSegments(axG,new THREE.LineBasicMaterial({vertexColors:true})));



    if(type==='volume-3d'){this._buildVolume(THREE);return;}

    if(kpName.includes('向量')){this._buildVectors(THREE);return;}

    if(kpName.includes('平面')||kpName.includes('直线')){this._buildPlane(THREE);return;}

    if(kpName.includes('偏导数')||kpName.includes('全微分')||kpName.includes('切')){this._buildSurface(THREE,true);return;}

    this._buildSurface(THREE,false);

  },

  _buildSurface(THREE,tangent){

    const res=60,size=3,geom=new THREE.BufferGeometry(),verts=[],indices=[];

    for(let i=0;i<=res;i++){

      const x=-size+2*size*i/res;

      for(let j=0;j<=res;j++){

        const y=-size+2*size*j/res,z=Math.sin(Math.sqrt(x*x+y*y)*2)*0.5;

        verts.push(x,z,y);

      }

    }

    for(let i=0;i<res;i++)for(let j=0;j<res;j++){

      const a=i*(res+1)+j,b=a+1,c=a+(res+1),d=c+1;indices.push(a,b,d,a,d,c);

    }

    geom.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geom.setIndex(indices);geom.computeVertexNormals();

    const mat=new THREE.MeshPhongMaterial({color:0x6366f1,specular:0x222244,shininess:30,side:THREE.DoubleSide,transparent:true,opacity:0.85});

    const mesh=new THREE.Mesh(geom,mat);mesh.rotation.x=-Math.PI/3;this.scene.add(mesh);this.objects.push(mesh);

    if(tangent){

      const pg=new THREE.PlaneGeometry(2,2),pm=new THREE.MeshBasicMaterial({color:0xf59e0b,side:THREE.DoubleSide,transparent:true,opacity:0.35});

      const p=new THREE.Mesh(pg,pm);p.rotation.x=-Math.PI/2;p.position.y=0.01;this.scene.add(p);this.objects.push(p);

    }

  },

  _buildVectors(THREE){

    const addArr=(from,to,color)=>{const dir=new THREE.Vector3().subVectors(to,from);const a=new THREE.ArrowHelper(dir.normalize(),from,dir.length(),color,0.2,0.1);this.scene.add(a);this.objects.push(a);};

    addArr(new THREE.Vector3(0,0,0),new THREE.Vector3(2,1,0),0xef4444);

    addArr(new THREE.Vector3(0,0,0),new THREE.Vector3(0,2,1),0x10b981);

    addArr(new THREE.Vector3(0,0,0),new THREE.Vector3(-1,0.5,2),0x6366f1);

    addArr(new THREE.Vector3(0,0,0),new THREE.Vector3(1,3.5,3),0xf59e0b);

  },

  _buildPlane(THREE){

    const pg=new THREE.PlaneGeometry(4,4),pm=new THREE.MeshBasicMaterial({color:0x6366f1,side:THREE.DoubleSide,transparent:true,opacity:0.3});

    const p=new THREE.Mesh(pg,pm);p.position.set(1,1,1);this.scene.add(p);this.objects.push(p);

    const n=new THREE.ArrowHelper(new THREE.Vector3(1,1,1).normalize(),new THREE.Vector3(1,1,1),1.5,0xf59e0b,0.15,0.08);

    this.scene.add(n);this.objects.push(n);

  },

  _buildVolume(THREE){

    const d=30,r=1.5,h=3;

    for(let i=0;i<d;i++){

      const t=i/d,rad=r*Math.sqrt(1-t*t),y=-h/2+t*h;

      const geo=new THREE.CylinderGeometry(rad,rad,h/d*0.9,20);

      const mat=new THREE.MeshPhongMaterial({color:new THREE.Color().setHSL(0.55+0.15*t,0.7,0.5+0.3*t),specular:0x111111,shininess:20,transparent:true,opacity:0.7});

      const disc=new THREE.Mesh(geo,mat);disc.position.y=y;this.scene.add(disc);this.objects.push(disc);

    }

  },

  cleanup(){

    if(this.animId){cancelAnimationFrame(this.animId);this.animId=null;}

    if(this.renderer){this.renderer.dispose();this.renderer=null;}

    if(this.container)this.container.innerHTML='';

    this.objects=[];this.scene=null;this.camera=null;this.controls=null;

  }

};



/* ═══════ 新增 vizTypes ═══════ */

Object.assign(vizTypes,{

  'code-demo':{title:'代码演示+概念动画',formula:'动手编写代码，左侧观察概念动画演示',params:[{id:'speed',label:'动画速度',min:1,max:5,step:1,default:2}]},

  'surface-3d':{title:'3D几何可视化',formula:'拖动鼠标旋转/缩放观察三维图形',params:[{id:'opacity',label:'透明度',min:0.2,max:1,step:0.1,default:0.8}]},

  'volume-3d':{title:'3D体积可视化',formula:'用微元法思想可视化立体体积',params:[{id:'opacity',label:'透明度',min:0.2,max:1,step:0.1,default:0.7}]},

  'sort-visualizer':{title:'排序算法可视化',formula:'动态演示排序过程，支持暂停和单步执行',params:[{id:'speed',label:'播放速度',min:1,max:10,step:1,default:1}]},

  'tree-visualizer':{title:'树结构可视化',formula:'动态演示树的操作过程，支持暂停和单步执行',params:[{id:'speed',label:'播放速度',min:1,max:10,step:1,default:1}]},

  'ds-basic-viz':{title:'数据结构基础演示',formula:'动态演示数据结构基础操作，支持暂停和单步执行',params:[{id:'speed',label:'播放速度',min:1,max:10,step:1,default:1}]},

  'graph-visualizer':{title:'图结构可视化',formula:'邻接矩阵/表·DFS/BFS·Prim·Dijkstra·拓扑排序',params:[{id:'speed',label:'播放速度',min:1,max:10,step:1,default:1}]},

});



/* ═══════ 排序可视化引擎 SortEngine ═══════ */

const SortEngine = {

  canvas: null, ctx: null, W: 0, H: 0, dpr: 1,

  steps: [], stepIdx: 0, arr: [], highlights: {},

  animId: null, playing: false, speed: 1,

  comparisons: 0, swaps: 0,



  init(canvasEl) {

    this.canvas = canvasEl;

    this.ctx = canvasEl.getContext('2d');

    this.dpr = window.devicePixelRatio || 1;

    this.resize();

  },

  resize() {

    const r = this.canvas.parentElement.getBoundingClientRect();

    this.W = r.width || 480;

    this.H = Math.max(240, Math.min(340, this.W * 0.55));

    this.canvas.width = this.W * this.dpr;

    this.canvas.height = this.H * this.dpr;

    this.canvas.style.width = this.W + 'px';

    this.canvas.style.height = this.H + 'px';

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

  },



  /* ──── 算法步骤预计算 ──── */

  generateSteps(type, inputArr) {

    this.steps = [];

    this.comparisons = 0;

    this.swaps = 0;

    const a = inputArr.slice();

    const push = (arr, hi, type2, msg) => {

      this.steps.push({ arr: arr.slice(), highlights: Object.assign({}, hi), type: type2 || 'compare', msg: msg || '' });

    };

    push(a, {}, 'init', '初始状态');

    if (type === 'insertion') {

      for (let i = 1; i < a.length; i++) {

        let key = a[i], j = i - 1;

        push(a, { [i]: 'current', [j]: 'compare' }, 'compare', '取第' + (i+1) + '个元素 ' + key + ' 准备插入');

        while (j >= 0 && a[j] > key) {

          this.comparisons++;

          push(a, { [j]: 'compare', [j+1]: 'current' }, 'compare', a[j] + ' > ' + key + '，后移');

          a[j + 1] = a[j]; j--;

          this.swaps++;

          push(a, { [j+1]: 'swap' }, 'swap', '后移完成');

        }

        if (j >= 0) { this.comparisons++; push(a, { [j]: 'compare', [j+1]: 'current' }, 'compare', a[j] + ' <= ' + key + '，找到插入位置'); }

        a[j + 1] = key;

        push(a, { [j+1]: 'placed' }, 'placed', '插入 ' + key + ' 到位置 ' + (j+2));

      }

    } else if (type === 'bubble') {

      let n = a.length;

      for (let i = 0; i < n - 1; i++) {

        let swapped = false;

        push(a, {}, 'init', '第 ' + (i+1) + ' 轮冒泡开始');

        for (let j = 0; j < n - i - 1; j++) {

          this.comparisons++;

          push(a, { [j]: 'compare', [j+1]: 'compare' }, 'compare', '比较 ' + a[j] + ' 和 ' + a[j+1]);

          if (a[j] > a[j + 1]) {

            [a[j], a[j+1]] = [a[j+1], a[j]]; this.swaps++;

            push(a, { [j]: 'swap', [j+1]: 'swap' }, 'swap', '交换！' + a[j+1] + ' > ' + a[j]);

            swapped = true;

          }

        }

        push(a, { [n-i-1]: 'placed' }, 'placed', '第 ' + (i+1) + ' 大元素归位');

        if (!swapped) { push(a, {}, 'placed', '无交换，已有序，提前结束'); break; }

      }

    } else if (type === 'selection') {

      let n = a.length;

      for (let i = 0; i < n - 1; i++) {

        let minIdx = i;

        push(a, { [i]: 'current' }, 'compare', '从位置 ' + (i+1) + ' 开始找最小值');

        for (let j = i + 1; j < n; j++) {

          this.comparisons++;

          push(a, { [minIdx]: 'current', [j]: 'compare' }, 'compare', '比较 a[' + (j+1) + ']=' + a[j] + ' 与当前最小 ' + a[minIdx]);

          if (a[j] < a[minIdx]) { minIdx = j; push(a, { [minIdx]: 'current' }, 'compare', '新的最小值: ' + a[minIdx]); }

        }

        if (minIdx !== i) {

          [a[i], a[minIdx]] = [a[minIdx], a[i]]; this.swaps++;

          push(a, { [i]: 'swap', [minIdx]: 'swap' }, 'swap', '交换位置 ' + (i+1) + ' 和 ' + (minIdx+1));

        }

        push(a, { [i]: 'placed' }, 'placed', a[i] + ' 已归位');

      }

      push(a, { [n-1]: 'placed' }, 'placed', '排序完成');

    } else if (type === 'merge') {

      const mergeSort = (arr, left, right) => {

        if (left >= right) return;

        const mid = Math.floor((left + right) / 2);

        push(a, { [left]: 'current', [mid]: 'compare', [right]: 'compare' }, 'compare', '分割 [' + (left+1) + '...' + (right+1) + '] mid=' + (mid+1));

        mergeSort(arr, left, mid);

        mergeSort(arr, mid + 1, right);

        // merge

        const L = arr.slice(left, mid + 1), R = arr.slice(mid + 1, right + 1);

        let i = 0, j = 0, k = left;

        push(a, {}, 'compare', '合并 [' + (left+1) + '..' + (mid+1) + '] 和 [' + (mid+2) + '..' + (right+1) + ']');

        while (i < L.length && j < R.length) {

          this.comparisons++;

          push(a, { [left+i]: 'compare', [mid+1+j]: 'compare' }, 'compare', '比较 ' + L[i] + ' 和 ' + R[j]);

          if (L[i] <= R[j]) { arr[k] = L[i++]; }

          else { arr[k] = R[j++]; this.swaps++; }

          a[k] = arr[k]; k++;

          push(a, { [k-1]: 'swap' }, 'swap', '放入 ' + arr[k-1]);

        }

        while (i < L.length) { arr[k] = L[i++]; a[k] = arr[k]; k++; push(a, { [k-1]: 'placed' }, 'placed', '剩余左段'); }

        while (j < R.length) { arr[k] = R[j++]; a[k] = arr[k]; k++; push(a, { [k-1]: 'placed' }, 'placed', '剩余右段'); }

        push(a, {}, 'init', '合并完成');

      };

      mergeSort(a, 0, a.length - 1);

    } else if (type === 'quick') {

      const partition = (arr, lo, hi) => {

        const pivot = arr[hi]; let i = lo;

        push(a, { [hi]: 'current' }, 'compare', '选枢轴 pivot=' + pivot);

        for (let j = lo; j < hi; j++) {

          this.comparisons++;

          push(a, { [j]: 'compare', [hi]: 'current', [i]: 'placed' }, 'compare', 'a[' + (j+1) + ']=' + arr[j] + (arr[j] <= pivot ? ' <= ' : ' > ') + pivot);

          if (arr[j] <= pivot) {

            [arr[i], arr[j]] = [arr[j], arr[i]]; a[i] = arr[i]; a[j] = arr[j]; this.swaps++;

            push(a, { [i]: 'swap', [j]: 'swap', [hi]: 'current' }, 'swap', '交换 ' + arr[j] + ' 和 ' + arr[i]);

            i++;

          }

        }

        [arr[i], arr[hi]] = [arr[hi], arr[i]]; a[i] = arr[i]; a[hi] = arr[hi]; this.swaps++;

        push(a, { [i]: 'placed' }, 'placed', '枢轴 ' + pivot + ' 归位于位置 ' + (i+1));

        return i;

      };

      const quickSort = (arr, lo, hi) => {

        if (lo < hi) { const p = partition(arr, lo, hi); quickSort(arr, lo, p - 1); quickSort(arr, p + 1, hi); }

      };

      quickSort(a, 0, a.length - 1);

    } else if (type === 'radix') {

      const max = Math.max(...a);

      let exp = 1;

      while (Math.floor(max / exp) > 0) {

        push(a, {}, 'compare', '按' + (exp===1?'个':exp===10?'十':'百') + '位排序');

        const count = new Array(10).fill(0);

        const output = new Array(a.length).fill(0);

        for (let x of a) count[Math.floor(x / exp) % 10]++;

        for (let i = 1; i < 10; i++) count[i] += count[i-1];

        for (let i = a.length - 1; i >= 0; i--) {

          const digit = Math.floor(a[i] / exp) % 10;

          output[--count[digit]] = a[i];

          this.comparisons++;

        }

        for (let i = 0; i < a.length; i++) { a[i] = output[i]; this.swaps++; }

        push(a, {}, 'swap', '按' + (exp===1?'个':exp===10?'十':'百') + '位分配收集完成');

        exp *= 10;

      }

    }

    push(a, Object.fromEntries(a.map((_,i)=>[i,'placed'])), 'placed', '排序完成！共比较' + this.comparisons + '次，交换' + this.swaps + '次');

    this.arr = this.steps[0].arr.slice();

    this.stepIdx = 0;

  },



  /* ──── 绘制 ──── */

  draw() {

    if (!this.ctx) return;

    const { ctx, W, H, steps, stepIdx } = this;

    const step = steps[stepIdx] || { arr: this.arr, highlights: {}, msg: '' };

    const arr = step.arr, hi = step.highlights;

    const n = arr.length;

    const maxVal = Math.max(...arr, 1);

    const pad = 18, barW = Math.max(4, Math.floor((W - pad * 2) / n) - 2);

    const totalBarW = (barW + 2) * n - 2;

    const startX = pad + (W - pad * 2 - totalBarW) / 2;



    ctx.clearRect(0, 0, W, H);

    // 背景

    ctx.fillStyle = '#0f172a';

    ctx.fillRect(0, 0, W, H);

    // 进度条

    const progress = steps.length > 1 ? stepIdx / (steps.length - 1) : 0;

    ctx.fillStyle = '#1e293b';

    ctx.fillRect(pad, H - 8, W - pad * 2, 4);

    ctx.fillStyle = '#10b981';

    ctx.fillRect(pad, H - 8, (W - pad * 2) * progress, 4);



    // 绘制条形

    const colorMap = { compare: '#f59e0b', swap: '#ef4444', placed: '#10b981', current: '#818cf8' };

    arr.forEach((val, i) => {

      const barH = Math.max(4, Math.floor((val / maxVal) * (H - 50)));

      const x = startX + i * (barW + 2);

      const y = H - 20 - barH;

      const color = colorMap[hi[i]] || '#334155';

      ctx.fillStyle = color;

      ctx.beginPath();

      ctx.roundRect ? ctx.roundRect(x, y, barW, barH, [3, 3, 0, 0]) : ctx.rect(x, y, barW, barH);

      ctx.fill();

      // 数字（条形够宽时显示）

      if (barW >= 16) {

        ctx.fillStyle = '#e2e8f0';

        ctx.font = 'bold ' + Math.min(11, barW - 2) + 'px monospace';

        ctx.textAlign = 'center';

        ctx.fillText(val, x + barW / 2, y - 3);

      }

    });

    // 步骤信息

    ctx.fillStyle = '#94a3b8';

    ctx.font = '12px sans-serif';

    ctx.textAlign = 'left';

    ctx.fillText('步骤 ' + (stepIdx + 1) + '/' + steps.length + '   ' + (step.msg || ''), pad, 16);

  },



  /* ──── 播放控制 ──── */

  play() {

    if (this.playing) return;

    if (this.stepIdx >= this.steps.length - 1) this.stepIdx = 0;

    this.playing = true;

    this._updateBtns();

    this._tick();

  },

  pause() {

    this.playing = false;

    if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }

    this._updateBtns();

  },

  next() {

    this.pause();

    if (this.stepIdx < this.steps.length - 1) { this.stepIdx++; this.draw(); this._updateBtns(); }

  },

  prev() {

    this.pause();

    if (this.stepIdx > 0) { this.stepIdx--; this.draw(); this._updateBtns(); }

  },

  reset() {

    this.pause();

    this.stepIdx = 0;

    this.draw();

    this._updateBtns();

  },

  _delay() { return Math.max(50, 1100 - this.speed * 100); },

  _tick() {

    this.draw();

    if (this.stepIdx < this.steps.length - 1) {

      this.animId = setTimeout(() => {

        if (!this.playing) return;

        this.stepIdx++;
        this._updProgress();
        this._tick();

      }, this._delay());

    } else {

      this.playing = false;

      this._updateBtns();

    }

  },

  _updateBtns() {

    const playBtn = document.getElementById('sortPlayBtn');

    if (playBtn) playBtn.textContent = this.playing ? '⏸ 暂停' : '▶ 播放';

    this._updProgress();

  },

  _updProgress() {
    const bar = document.getElementById('sortProgressFill');
    const info = document.getElementById('sortStepInfo');
    if (bar) bar.style.width = this.steps.length > 1 ? (this.stepIdx / (this.steps.length - 1) * 100) + '%' : '0%';
    if (info) {
      const s = this.steps[this.stepIdx];
      info.textContent = (s && s.msg) ? ('步骤 ' + (this.stepIdx + 1) + '/' + this.steps.length + ' · ' + s.msg) : ('步骤 ' + (this.stepIdx + 1) + '/' + this.steps.length);
    }
  },



  stop() { this.pause(); }

};



/* ─── 排序知识点与算法映射 ─── */

const sortAlgoMap = {

  '插入排序': { algo: 'insertion', name: '直接插入排序', arr: [38,65,97,76,13,27,49] },

  '交换排序': { algo: 'bubble', name: '冒泡排序', arr: [49,38,65,97,76,13,27] },

  '选择排序': { algo: 'selection', name: '简单选择排序', arr: [49,38,65,97,76,13,27] },

  '归并排序': { algo: 'merge', name: '归并排序', arr: [38,27,43,3,9,82,10] },

  '基数排序': { algo: 'radix', name: 'LSD基数排序', arr: [170,45,75,90,2,802,24,66] },

};

const sortCodeMap = {

  '插入排序': '#include <stdio.h>\n\n// 直接插入排序\nvoid insertionSort(int a[], int n) {\n    for (int i = 1; i < n; i++) {\n        int key = a[i], j = i - 1;\n        // 将比key大的元素向右移动\n        while (j >= 0 && a[j] > key) {\n            a[j + 1] = a[j];\n            j--;\n        }\n        a[j + 1] = key;\n    }\n}\n\n// 希尔排序\nvoid shellSort(int a[], int n) {\n    for (int gap = n/2; gap > 0; gap /= 2)\n        for (int i = gap; i < n; i++) {\n            int key = a[i], j = i - gap;\n            while (j >= 0 && a[j] > key) {\n                a[j + gap] = a[j]; j -= gap;\n            }\n            a[j + gap] = key;\n        }\n}\n\nint main() {\n    int a[] = {38, 65, 97, 76, 13, 27, 49};\n    int n = 7;\n    printf("原始: ");\n    for (int i = 0; i < n; i++) printf("%d ", a[i]);\n    insertionSort(a, n);\n    printf("\\n插入排序后: ");\n    for (int i = 0; i < n; i++) printf("%d ", a[i]);\n    int b[] = {38,65,97,76,13,27,49};\n    shellSort(b, n);\n    printf("\\n希尔排序后: ");\n    for (int i = 0; i < n; i++) printf("%d ", b[i]);\n    printf("\\n");\n    return 0;\n}',

  '交换排序': '#include <stdio.h>\n\n// 冒泡排序（优化版）\nvoid bubbleSort(int a[], int n) {\n    for (int i = 0; i < n-1; i++) {\n        int flag = 0;\n        for (int j = 0; j < n-i-1; j++) {\n            if (a[j] > a[j+1]) {\n                int t = a[j]; a[j] = a[j+1]; a[j+1] = t;\n                flag = 1;\n            }\n        }\n        if (!flag) break; // 已有序，提前退出\n    }\n}\n\n// 快速排序\nint partition(int a[], int lo, int hi) {\n    int pivot = a[hi], i = lo;\n    for (int j = lo; j < hi; j++)\n        if (a[j] <= pivot) {\n            int t = a[i]; a[i] = a[j]; a[j] = t; i++;\n        }\n    int t = a[i]; a[i] = a[hi]; a[hi] = t;\n    return i;\n}\nvoid quickSort(int a[], int lo, int hi) {\n    if (lo < hi) {\n        int p = partition(a, lo, hi);\n        quickSort(a, lo, p-1);\n        quickSort(a, p+1, hi);\n    }\n}\n\nint main() {\n    int a[] = {49,38,65,97,76,13,27};\n    int n = 7;\n    printf("原始: ");\n    for (int i=0;i<n;i++) printf("%d ",a[i]);\n    bubbleSort(a,n);\n    printf("\\n冒泡排序: ");\n    for (int i=0;i<n;i++) printf("%d ",a[i]);\n    int b[]={49,38,65,97,76,13,27};\n    quickSort(b,0,n-1);\n    printf("\\n快速排序: ");\n    for (int i=0;i<n;i++) printf("%d ",b[i]);\n    printf("\\n"); return 0;\n}',

  '选择排序': '#include <stdio.h>\n\n// 简单选择排序\nvoid selectionSort(int a[], int n) {\n    for (int i = 0; i < n-1; i++) {\n        int minIdx = i;\n        for (int j = i+1; j < n; j++)\n            if (a[j] < a[minIdx]) minIdx = j;\n        if (minIdx != i) {\n            int t = a[i]; a[i] = a[minIdx]; a[minIdx] = t;\n        }\n    }\n}\n\n// 堆排序\nvoid heapify(int a[], int n, int i) {\n    int largest = i, l = 2*i+1, r = 2*i+2;\n    if (l < n && a[l] > a[largest]) largest = l;\n    if (r < n && a[r] > a[largest]) largest = r;\n    if (largest != i) {\n        int t = a[i]; a[i] = a[largest]; a[largest] = t;\n        heapify(a, n, largest);\n    }\n}\nvoid heapSort(int a[], int n) {\n    for (int i=n/2-1; i>=0; i--) heapify(a,n,i); // 建堆\n    for (int i=n-1; i>0; i--) {\n        int t=a[0]; a[0]=a[i]; a[i]=t; // 堆顶换末\n        heapify(a,i,0); // 重建堆\n    }\n}\n\nint main() {\n    int a[]={49,38,65,97,76,13,27}; int n=7;\n    printf("原始: "); for(int i=0;i<n;i++) printf("%d ",a[i]);\n    selectionSort(a,n);\n    printf("\\n选择排序: "); for(int i=0;i<n;i++) printf("%d ",a[i]);\n    int b[]={49,38,65,97,76,13,27};\n    heapSort(b,n);\n    printf("\\n堆排序:   "); for(int i=0;i<n;i++) printf("%d ",b[i]);\n    printf("\\n"); return 0;\n}',

  '归并排序': '#include <stdio.h>\n\nvoid merge(int a[], int tmp[], int lo, int mid, int hi) {\n    for (int k=lo; k<=hi; k++) tmp[k]=a[k];\n    int i=lo, j=mid+1, k=lo;\n    while (i<=mid && j<=hi)\n        a[k++] = tmp[i]<=tmp[j] ? tmp[i++] : tmp[j++];\n    while (i<=mid) a[k++]=tmp[i++];\n    while (j<=hi)  a[k++]=tmp[j++];\n}\n\n// 递归归并排序\nvoid mergeSortR(int a[], int tmp[], int lo, int hi) {\n    if (lo >= hi) return;\n    int mid = (lo+hi)/2;\n    mergeSortR(a, tmp, lo, mid);\n    mergeSortR(a, tmp, mid+1, hi);\n    merge(a, tmp, lo, mid, hi);\n}\n\n// 非递归（自底向上）\nvoid mergeSortI(int a[], int n) {\n    int tmp[50];\n    for (int sub=1; sub<n; sub*=2)\n        for (int lo=0; lo<n-sub; lo+=2*sub) {\n            int mid=lo+sub-1;\n            int hi=lo+2*sub-1 < n-1 ? lo+2*sub-1 : n-1;\n            merge(a, tmp, lo, mid, hi);\n        }\n}\n\nint main() {\n    int a[]={38,27,43,3,9,82,10}; int n=7;\n    printf("原始: "); for(int i=0;i<n;i++) printf("%d ",a[i]);\n    int tmp[50]; mergeSortR(a,tmp,0,n-1);\n    printf("\\n归并排序: "); for(int i=0;i<n;i++) printf("%d ",a[i]);\n    int b[]={38,27,43,3,9,82,10};\n    mergeSortI(b,n);\n    printf("\\n非递归版: "); for(int i=0;i<n;i++) printf("%d ",b[i]);\n    printf("\\n"); return 0;\n}',

  '基数排序': '#include <stdio.h>\n#include <string.h>\n\nint getMax(int a[], int n) {\n    int m=a[0]; for(int i=1;i<n;i++) if(a[i]>m) m=a[i]; return m;\n}\n\n// LSD基数排序（最低位优先）\nvoid countSort(int a[], int n, int exp) {\n    int output[100], count[10]={0};\n    for(int i=0;i<n;i++) count[(a[i]/exp)%10]++;\n    for(int i=1;i<10;i++) count[i]+=count[i-1];\n    // 从后往前保证稳定性\n    for(int i=n-1;i>=0;i--){\n        output[--count[(a[i]/exp)%10]]=a[i];\n    }\n    for(int i=0;i<n;i++) a[i]=output[i];\n}\n\nvoid radixSort(int a[], int n) {\n    int m=getMax(a,n);\n    for(int exp=1; m/exp>0; exp*=10) {\n        countSort(a,n,exp);\n        printf("exp=%d: ", exp);\n        for(int i=0;i<n;i++) printf("%d ",a[i]);\n        printf("\\n");\n    }\n}\n\nint main() {\n    int a[]={170,45,75,90,2,802,24,66}; int n=8;\n    printf("原始: "); for(int i=0;i<n;i++) printf("%d ",a[i]);\n    printf("\\n按位排序过程:\\n");\n    radixSort(a,n);\n    printf("最终: "); for(int i=0;i<n;i++) printf("%d ",a[i]);\n    printf("\\n"); return 0;\n}',

};





const _origRenderVizView = renderVizView;

renderVizView = function(ch, kp) {

  const viz = vizTypes[kp.viz] || vizTypes['generic'];

  const color = (ch.courseId === 'prob') ? (chapterColors['p' + ch.num] || '#ec4899') : (chapterColors[ch.num] || '#6366f1');

  const kpIdx = ch.kps.indexOf(kp);

  const kpFid = (ch.courseId === 'prob') ? ('p' + ch.num + '-' + kpIdx) : (ch.num + '-' + kpIdx);

  const kpForm = ((ch.courseId === 'gaoshu') || (ch.courseId === 'prob')) ? (kpFormulas[kpFid] || '') : '';

  const formulaDisplay = kpForm ? '$' + kpForm + '$' : viz.formula;



  // code-demo: 双栏 (概念动画 + 代码沙箱)

    // py-viz: Python课程逐步动画可视化（参考DS课程风格）
  if (kp.viz === 'py-viz') {
    const el = document.getElementById('viz-view');
    const algoInfo = pyVizMap[kp.name] || { kpId:'py-1-0', name:'Python概念演示' };
    const pyCodeObj = codeSamples[ch.courseId + '-' + ch.num + '-' + ch.kps.indexOf(kp)];
    const pyCode = pyCodeObj ? pyCodeObj.code : 'print("Hello Python!")';
    const pyDetail = (function(){ const d=getKPDetail(ch.courseId,ch.num,ch.kps.indexOf(kp)); return d?d.explanation.replace(/\\n/g,'<br>'):'暂无详细讲解。'; })();
    const pyProblems = (function(){ const d=getKPDetail(ch.courseId,ch.num,ch.kps.indexOf(kp)); if(!d||!d.problems) return '<p>暂无练习题</p>'; return d.problems.map(function(p,i){ return '<div class="practice-item"><div class="practice-q"><span class="q-num">Q'+(i+1)+'</span>'+p.q+'</div><div class="practice-a" style="display:none"><strong>答：</strong>'+p.a+'</div><button class="practice-toggle" onclick="var p=this.previousElementSibling;p.style.display=p.style.display===\'none\'?\'block\':\'none\';this.textContent=p.style.display===\'none\'?\'查看答案\':\'收起答案\'">查看答案</button></div>'; }).join(''); })();
    el.innerHTML =
      '<div class="view-back-bar"><button class="view-back-btn" onclick="backToKP()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>返回知识点</button><span class="view-back-title">第'+ch.num+'章 · '+kp.name+'</span></div>'+
      '<div class="viz-panel">'+
      '<div class="viz-header"><div class="viz-icon-lg" style="background:'+color+'22;color:'+color+'">PY</div><div class="viz-title-area"><h2>'+kp.name+'</h2><p>'+kp.desc+'</p></div></div>'+
      '<div class="sort-dual-wrap">'+
        '<div class="sort-anim-col">'+
          '<div class="sort-anim-header"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polygon points="5 3 19 12 5 21" fill="currentColor"/></svg> '+algoInfo.name+'演示</div>'+
          '<canvas id="pyVizCanvas" style="display:block;width:100%;border-radius:10px;background:#0f172a"></canvas>'+
          '<div class="sort-progress-wrap"><div class="sort-progress-bar"><div class="sort-progress-fill" id="pyProgressFill"></div></div></div>'+
          '<div class="sort-step-info" id="pyStepInfo">准备中...</div>'+
          '<div class="sort-controls" id="pyControls">'+
            '<button class="sort-btn sort-btn-reset" onclick="PyVizEngine.reset()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="1 4 1 10 7 10" stroke="currentColor" stroke-width="2"/><path d="M3.51 15a9 9 0 1 0 .49-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>'+
            '<button class="sort-btn sort-btn-prev" onclick="PyVizEngine.prev()">◀</button>'+
            '<button class="sort-btn sort-btn-play" id="pyPlayBtn" onclick="if(PyVizEngine.playing)PyVizEngine.pause();else PyVizEngine.play()">▶ 播放</button>'+
            '<button class="sort-btn sort-btn-next" onclick="PyVizEngine.next()">▶</button>'+
            '<div class="sort-speed-wrap"><label style="font-size:11px;color:#94a3b8">速度 <span id="pySpeedVal">3</span></label>'+
            '<input type="range" id="pySpeedRange" min="1" max="10" value="3" step="1" style="width:70px;accent-color:'+color+'" oninput="PyVizEngine.speed=+this.value;document.getElementById(\'pySpeedVal\').textContent=this.value"></div>'+
          '</div>'+
        '</div>'+
        '<div class="sort-code-col">'+
          '<div class="sort-code-header"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M16 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> Python代码</div>'+
          '<textarea id="inlineCodeEditor" class="code-demo-editor sort-code-editor" spellcheck="false">'+pyCode+'</textarea>'+
          '<div class="code-demo-actions"><button id="inlineRunBtn" class="code-demo-run" onclick="runInlineCode()"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> 运行代码</button><span id="inlineRunStatus" class="code-demo-status"></span></div>'+
          '<pre id="inlineCodeOutput" class="code-demo-output sort-code-output"></pre>'+
        '</div>'+
      '</div>'+
      '<div class="viz-tabs"><button class="viz-tab active" onclick="switchVizTab(\'detail\',this)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" stroke-width="1.6"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" stroke-width="1.6"/></svg> 知识详解</button><button class="viz-tab" onclick="switchVizTab(\'practice\',this)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="4" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M9 14l2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg> 练习题</button></div>'+
      '<div id="viz-tab-content"><div class="viz-detail-content"><div class="viz-detail-body">'+pyDetail+'</div></div></div>'+
      '<div id="viz-tab-practice" style="display:none" class="viz-detail-content"><div class="viz-detail-body">'+pyProblems+'</div></div>'+
      '</div>';
    setTimeout(function() {
      const canvas = document.getElementById('pyVizCanvas');
      if (canvas) {
        PyVizEngine.init(canvas);
        PyVizEngine.generateSteps(algoInfo.kpId, algoInfo);
        PyVizEngine.draw();
        PyVizEngine.speed = 3;
        setTimeout(function() { PyVizEngine.play(); }, 600);
      }
    }, 120);
    return;
  }

if (kp.viz === 'code-demo') {

    const el = document.getElementById('viz-view');

    const csKey = ch.courseId + '-' + ch.num + '-' + ch.kps.indexOf(kp);

    const cs = codeSamples[csKey] || {demo:'intro',code:'#include <stdio.h>\nint main(){\n    printf("Hello!\\n");\n    return 0;\n}'};

    el.innerHTML = '<div class="view-back-bar"><button class="view-back-btn" onclick="backToKP()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>返回知识点</button><span class="view-back-title">第'+ch.num+'章 · '+kp.name+'</span></div>'+

    '<div class="viz-panel">'+

    '<div class="viz-header"><div class="viz-icon-lg" style="background:'+color+'22;color:'+color+'">'+viz.title.charAt(0)+'</div><div class="viz-title-area"><h2>'+kp.name+'</h2><p>'+kp.desc+'</p></div></div>'+

    '<div class="viz-formula"><span class="hl">'+formulaDisplay+'</span></div>'+

    '<div class="code-demo-dual">'+

    '<div class="code-demo-left"><div class="code-demo-left-header"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></svg> 概念演示</div><canvas id="demoAnimCanvas"></canvas></div>'+

    '<div class="code-demo-right"><div class="code-demo-right-header"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M16 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> 动手试试</div><textarea id="inlineCodeEditor" class="code-demo-editor" spellcheck="false">'+cs.code+'</textarea>'+

    '<div class="code-demo-actions"><button id="inlineRunBtn" class="code-demo-run" onclick="runInlineCode()"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> 运行</button><span id="inlineRunStatus" class="code-demo-status"></span></div><pre id="inlineCodeOutput" class="code-demo-output"></pre></div>'+

    '</div>'+

    '<div class="viz-controls"><div class="viz-controls-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/></svg> 参数调节</div><div class="viz-controls-grid"><div class="viz-param"><label>动画速度 <span id="viz-val-speed">2</span></label><input type="range" id="viz-param-speed" min="1" max="5" step="1" value="2" oninput="updateCodeDemoSpeed()"></div></div></div>'+

    '<div class="viz-tabs"><button class="viz-tab active" onclick="switchVizTab(\'detail\',this)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" stroke-width="1.6"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" stroke-width="1.6"/></svg> 知识详解</button><button class="viz-tab" onclick="switchVizTab(\'practice\',this)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="4" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M9 14l2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg> 去题库练习</button></div>'+

    '<div id="viz-tab-content"><div class="viz-detail-content"><div class="viz-detail-body">'+((function(){const d=getKPDetail(ch.courseId,ch.num,ch.kps.indexOf(kp));return d?d.explanation.replace(/\n/g,'<br>'):'暂无详细讲解，后续持续更新中。';})())+'</div></div></div></div>';

    setTimeout(()=>{const canvas=document.getElementById('demoAnimCanvas');if(canvas){VideoDemoEngine.init(canvas);VideoDemoEngine.start(cs.demo);}},100);

    setTimeout(function(){ renderMath(el); }, 120);

    return;

  }



  // surface-3d / volume-3d: Three.js 3D

  if (kp.viz === 'surface-3d' || kp.viz === 'volume-3d') {

    const el = document.getElementById('viz-view');

    const defOp = kp.viz==='volume-3d'?'0.7':'0.8';

    el.innerHTML = '<div class="view-back-bar"><button class="view-back-btn" onclick="backToKP()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>返回知识点</button><span class="view-back-title">第'+ch.num+'章 · '+kp.name+'</span></div>'+

    '<div class="viz-panel"><div class="viz-header"><div class="viz-icon-lg" style="background:'+color+'22;color:'+color+'">'+viz.title.charAt(0)+'</div><div class="viz-title-area"><h2>'+kp.name+'</h2><p>'+kp.desc+'</p></div></div>'+

    '<div class="viz-formula"><span class="hl">'+formulaDisplay+'</span><br><span style="font-size:12px;color:var(--text-muted)">拖拽旋转 · 滚轮缩放 · 右键平移</span></div>'+

    '<div class="viz3d-container" id="viz3dContainer"></div>'+

    '<div class="viz-controls"><div class="viz-controls-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/></svg> 显示参数</div><div class="viz-controls-grid"><div class="viz-param"><label>透明度 <span id="viz-val-opacity">'+defOp+'</span></label><input type="range" id="viz-param-opacity" min="0.2" max="1" step="0.1" value="'+defOp+'" oninput="updateViz3DOpacity()"></div></div></div>'+

    '<div class="viz-tabs"><button class="viz-tab active" onclick="switchVizTab(\'detail\',this)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" stroke-width="1.6"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" stroke-width="1.6"/></svg> 知识详解</button><button class="viz-tab" onclick="switchVizTab(\'practice\',this)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="4" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M9 14l2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg> 去题库练习</button></div>'+

    '<div id="viz-tab-content"><div class="viz-detail-content"><div class="viz-detail-body">'+((function(){const d=getKPDetail(ch.courseId,ch.num,ch.kps.indexOf(kp));return d?d.explanation.replace(/\n/g,'<br>'):'暂无详细讲解，后续持续更新中。';})())+'</div></div></div></div>';

    setTimeout(()=>{const c2=document.getElementById('viz3dContainer');if(c2)Viz3DEngine.init(c2,kp.viz,kp.name);},200);

    setTimeout(function(){ renderMath(el); }, 250);

    return;

  }



  // ds-basic-viz: 数据结构基础阶段可视化（左侧动画 + 右侧C代码）

  if (kp.viz === 'ds-basic-viz') {

    const el = document.getElementById('viz-view');

    const algoInfo = dsBasicAlgoMap[kp.name] || { kpId:'ds-1-0', name:'数据结构演示' };

    const basicCode = dsBasicCodeMap[kp.name] || '// 暂无代码示例';

    const kpDetail = (function(){ const d=getKPDetail(ch.courseId,ch.num,ch.kps.indexOf(kp)); return d?d.explanation.replace(/\n/g,'<br>'):'暂无详细讲解。'; })();

    const kpProblems = (function(){ const d=getKPDetail(ch.courseId,ch.num,ch.kps.indexOf(kp)); if(!d||!d.problems) return '<p>暂无练习题</p>'; return d.problems.map((p,i)=>'<div class="practice-item"><div class="practice-q"><span class="q-num">Q'+(i+1)+'</span>'+p.q+'</div><div class="practice-a" style="display:none"><strong>答：</strong>'+p.a+'</div><button class="practice-toggle" onclick="this.previousElementSibling.style.display=this.previousElementSibling.style.display===\'none\'?\'block\':\'none\';this.textContent=this.previousElementSibling.style.display===\'none\'?\'查看答案\':\'收起答案\'">查看答案</button></div>').join(''); })();

    el.innerHTML =

      '<div class="view-back-bar"><button class="view-back-btn" onclick="backToKP()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>返回知识点</button><span class="view-back-title">第'+ch.num+'章 · '+kp.name+'</span></div>'+

      '<div class="viz-panel">'+

      '<div class="viz-header"><div class="viz-icon-lg" style="background:'+color+'22;color:'+color+'">DS</div><div class="viz-title-area"><h2>'+kp.name+'</h2><p>'+kp.desc+'</p></div></div>'+

      '<div class="sort-dual-wrap">'+

        '<div class="sort-anim-col">'+

          '<div class="sort-anim-header"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polygon points="5 3 19 12 5 21" fill="currentColor"/></svg> '+algoInfo.name+'演示</div>'+

          '<canvas id="basicCanvas" style="display:block;width:100%;border-radius:10px;background:#0f172a"></canvas>'+

          '<div class="sort-progress-wrap"><div class="sort-progress-bar"><div class="sort-progress-fill" id="basicProgressFill"></div></div></div>'+

          '<div class="sort-step-info" id="basicStepInfo">准备中...</div>'+

          '<div class="sort-controls" id="basicControls">'+

            '<button class="sort-btn sort-btn-reset" onclick="DsBasicVizEngine.reset()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="1 4 1 10 7 10" stroke="currentColor" stroke-width="2"/><path d="M3.51 15a9 9 0 1 0 .49-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>'+

            '<button class="sort-btn sort-btn-prev" onclick="DsBasicVizEngine.prev()">◀</button>'+

            '<button class="sort-btn sort-btn-play" id="basicPlayBtn" onclick="if(DsBasicVizEngine.playing)DsBasicVizEngine.pause();else DsBasicVizEngine.play()">▶ 播放</button>'+

            '<button class="sort-btn sort-btn-next" onclick="DsBasicVizEngine.next()">▶</button>'+

            '<div class="sort-speed-wrap"><label style="font-size:11px;color:#94a3b8">速度 <span id="basicSpeedVal">1</span></label>'+

            '<input type="range" id="basicSpeedRange" min="1" max="10" value="1" step="1" style="width:70px;accent-color:'+color+'" oninput="DsBasicVizEngine.speed=+this.value;document.getElementById(\'basicSpeedVal\').textContent=this.value"></div>'+

          '</div>'+

        '</div>'+

        '<div class="sort-code-col">'+

          '<div class="sort-code-header"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M16 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> C语言实现</div>'+

          '<textarea id="inlineCodeEditor" class="code-demo-editor sort-code-editor" spellcheck="false">'+basicCode+'</textarea>'+

          '<div class="code-demo-actions"><button id="inlineRunBtn" class="code-demo-run" onclick="runInlineCode()"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> 运行代码</button><span id="inlineRunStatus" class="code-demo-status"></span></div>'+

          '<pre id="inlineCodeOutput" class="code-demo-output sort-code-output"></pre>'+

        '</div>'+

      '</div>'+

      '<div class="viz-tabs"><button class="viz-tab active" onclick="switchVizTab(\'detail\',this)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" stroke-width="1.6"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" stroke-width="1.6"/></svg> 知识详解</button><button class="viz-tab" onclick="switchVizTab(\'practice\',this)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="4" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M9 14l2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg> 去题库练习</button></div>'+

      '<div id="viz-tab-content"><div class="viz-detail-content"><div class="viz-detail-body">'+kpDetail+'</div></div></div>'+

      '</div>';

    setTimeout(() => {

      const canvas = document.getElementById('basicCanvas');

      if (canvas) {

        DsBasicVizEngine.init(canvas);

        DsBasicVizEngine.generateSteps(algoInfo.kpId, algoInfo);

        DsBasicVizEngine.draw();

        DsBasicVizEngine.speed = 1;

        setTimeout(() => DsBasicVizEngine.play(), 800);

      }

    }, 120);

    window._basicKP = kp; window._basicCh = ch;

    return;

  }



  // sort-visualizer: 排序算法可视化（左侧动画 + 右侧C代码）

  if (kp.viz === 'sort-visualizer') {

    const el = document.getElementById('viz-view');

    const algoInfo = sortAlgoMap[kp.name] || { algo: 'bubble', name: '冒泡排序', arr: [49,38,65,97,76,13,27] };

    const sortCode = sortCodeMap[kp.name] || '// 暂无代码示例';

    const kpDetail = (function(){ const d=getKPDetail(ch.courseId,ch.num,ch.kps.indexOf(kp)); return d?d.explanation.replace(/\n/g,'<br>'):'暂无详细讲解。'; })();

    const kpProblems = (function(){ const d=getKPDetail(ch.courseId,ch.num,ch.kps.indexOf(kp)); if(!d||!d.problems) return '<p>暂无练习题</p>'; return d.problems.map((p,i)=>'<div class="practice-item"><div class="practice-q"><span class="q-num">Q'+(i+1)+'</span>'+p.q+'</div><div class="practice-a" style="display:none"><strong>答：</strong>'+p.a+'</div><button class="practice-toggle" onclick="this.previousElementSibling.style.display=this.previousElementSibling.style.display===\'none\'?\'block\':\'none\';this.textContent=this.previousElementSibling.style.display===\'none\'?\'查看答案\':\'收起答案\'">查看答案</button></div>').join(''); })();

    el.innerHTML =

      '<div class="view-back-bar"><button class="view-back-btn" onclick="backToKP()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>返回知识点</button><span class="view-back-title">第'+ch.num+'章 · '+kp.name+'</span></div>'+

      '<div class="viz-panel">'+

      '<div class="viz-header"><div class="viz-icon-lg" style="background:'+color+'22;color:'+color+'">排</div><div class="viz-title-area"><h2>'+kp.name+'</h2><p>'+kp.desc+'</p></div></div>'+

      '<div class="sort-dual-wrap">'+

        '<div class="sort-anim-col">'+

          '<div class="sort-anim-header"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polygon points="5 3 19 12 5 21" fill="currentColor"/></svg> '+algoInfo.name+'演示</div>'+

          '<canvas id="sortCanvas" style="display:block;width:100%;border-radius:10px;background:#0f172a"></canvas>'+
          '<div class="sort-progress-wrap"><div class="sort-progress-bar"><div class="sort-progress-fill" id="sortProgressFill"></div></div></div>'+
          '<div class="sort-step-info" id="sortStepInfo">准备中...</div>'+
          '<div class="sort-controls" id="sortControls">'+

            '<button class="sort-btn sort-btn-reset" onclick="SortEngine.reset()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="1 4 1 10 7 10" stroke="currentColor" stroke-width="2"/><path d="M3.51 15a9 9 0 1 0 .49-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>'+

            '<button class="sort-btn sort-btn-prev" onclick="SortEngine.prev()">◀</button>'+

            '<button class="sort-btn sort-btn-play" id="sortPlayBtn" onclick="if(SortEngine.playing)SortEngine.pause();else SortEngine.play()">▶ 播放</button>'+

            '<button class="sort-btn sort-btn-next" onclick="SortEngine.next()">▶</button>'+

            '<div class="sort-speed-wrap"><label style="font-size:11px;color:#94a3b8">速度 <span id="sortSpeedVal">1</span></label>'+

            '<input type="range" id="sortSpeedRange" min="1" max="10" value="1" step="1" style="width:70px;accent-color:'+color+'" oninput="SortEngine.speed=+this.value;document.getElementById(\'sortSpeedVal\').textContent=this.value"></div>'+

          '</div>'+

        '</div>'+

        '<div class="sort-code-col">'+

          '<div class="sort-code-header"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M16 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> C语言实现</div>'+

          '<textarea id="inlineCodeEditor" class="code-demo-editor sort-code-editor" spellcheck="false">'+sortCode+'</textarea>'+

          '<div class="code-demo-actions"><button id="inlineRunBtn" class="code-demo-run" onclick="runInlineCode()"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> 运行代码</button><span id="inlineRunStatus" class="code-demo-status"></span></div>'+

          '<pre id="inlineCodeOutput" class="code-demo-output sort-code-output"></pre>'+

        '</div>'+

      '</div>'+

      '<div class="viz-tabs"><button class="viz-tab active" onclick="switchVizTab(\'detail\',this)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" stroke-width="1.6"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" stroke-width="1.6"/></svg> 知识详解</button><button class="viz-tab" onclick="switchVizTab(\'practice\',this)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="4" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M9 14l2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg> 去题库练习</button></div>'+

      '<div id="viz-tab-content"><div class="viz-detail-content"><div class="viz-detail-body">'+kpDetail+'</div></div></div>'+

      '</div>';

    // 初始化排序引擎

    setTimeout(() => {

      const canvas = document.getElementById('sortCanvas');

      if (canvas) {

        SortEngine.init(canvas);

        SortEngine.generateSteps(algoInfo.algo, algoInfo.arr.slice());

        SortEngine.draw();

        // 自动播放（慢速）

        SortEngine.speed = 1;

        setTimeout(() => SortEngine.play(), 800);

      }

    }, 120);

    // 修正 switchVizTab 以支持排序视图

    window._sortKP = kp; window._sortCh = ch;

    return;

  }



  // tree-visualizer: 树结构可视化（左侧动画 + 右侧C代码）

  if (kp.viz === 'tree-visualizer') {

    const el = document.getElementById('viz-view');

    const algoInfo = treeAlgoMap[kp.name] || { algo: 'definition', name: '树结构演示', data: {} };

    const treeCode = treeCodeMap[kp.name] || '// 暂无代码示例';

    const kpDetail = (function(){ const d=getKPDetail(ch.courseId,ch.num,ch.kps.indexOf(kp)); return d?d.explanation.replace(/\n/g,'<br>'):'暂无详细讲解。'; })();

    const kpProblems = (function(){ const d=getKPDetail(ch.courseId,ch.num,ch.kps.indexOf(kp)); if(!d||!d.problems) return '<p>暂无练习题</p>'; return d.problems.map((p,i)=>'<div class="practice-item"><div class="practice-q"><span class="q-num">Q'+(i+1)+'</span>'+p.q+'</div><div class="practice-a" style="display:none"><strong>答：</strong>'+p.a+'</div><button class="practice-toggle" onclick="this.previousElementSibling.style.display=this.previousElementSibling.style.display===\'none\'?\'block\':\'none\';this.textContent=this.previousElementSibling.style.display===\'none\'?\'查看答案\':\'收起答案\'">查看答案</button></div>').join(''); })();

    el.innerHTML =

      '<div class="view-back-bar"><button class="view-back-btn" onclick="backToKP()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>返回知识点</button><span class="view-back-title">第'+ch.num+'章 · '+kp.name+'</span></div>'+

      '<div class="viz-panel">'+

      '<div class="viz-header"><div class="viz-icon-lg" style="background:'+color+'22;color:'+color+'">树</div><div class="viz-title-area"><h2>'+kp.name+'</h2><p>'+kp.desc+'</p></div></div>'+

      '<div class="sort-dual-wrap">'+

        '<div class="sort-anim-col">'+

          '<div class="sort-anim-header"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polygon points="5 3 19 12 5 21" fill="currentColor"/></svg> '+algoInfo.name+'演示</div>'+

          '<canvas id="treeCanvas" style="display:block;width:100%;border-radius:10px;background:#0f172a"></canvas>'+
          '<div class="sort-progress-wrap"><div class="sort-progress-bar"><div class="sort-progress-fill" id="treeProgressFill"></div></div></div>'+
          '<div class="sort-step-info" id="treeStepInfo">准备中...</div>'+
          '<div class="sort-controls" id="treeControls">'+

            '<button class="sort-btn sort-btn-reset" onclick="TreeVizEngine.reset()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="1 4 1 10 7 10" stroke="currentColor" stroke-width="2"/><path d="M3.51 15a9 9 0 1 0 .49-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>'+

            '<button class="sort-btn sort-btn-prev" onclick="TreeVizEngine.prev()">◀</button>'+

            '<button class="sort-btn sort-btn-play" id="treePlayBtn" onclick="if(TreeVizEngine.playing)TreeVizEngine.pause();else TreeVizEngine.play()">▶ 播放</button>'+

            '<button class="sort-btn sort-btn-next" onclick="TreeVizEngine.next()">▶</button>'+

            '<div class="sort-speed-wrap"><label style="font-size:11px;color:#94a3b8">速度 <span id="treeSpeedVal">1</span></label>'+

            '<input type="range" id="treeSpeedRange" min="1" max="10" value="1" step="1" style="width:70px;accent-color:'+color+'" oninput="TreeVizEngine.speed=+this.value;document.getElementById(\'treeSpeedVal\').textContent=this.value"></div>'+

          '</div>'+

        '</div>'+

        '<div class="sort-code-col">'+

          '<div class="sort-code-header"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M16 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> C语言实现</div>'+

          '<textarea id="inlineCodeEditor" class="code-demo-editor sort-code-editor" spellcheck="false">'+treeCode+'</textarea>'+

          '<div class="code-demo-actions"><button id="inlineRunBtn" class="code-demo-run" onclick="runInlineCode()"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> 运行代码</button><span id="inlineRunStatus" class="code-demo-status"></span></div>'+

          '<pre id="inlineCodeOutput" class="code-demo-output sort-code-output"></pre>'+

        '</div>'+

      '</div>'+

      '<div class="viz-tabs"><button class="viz-tab active" onclick="switchVizTab(\'detail\',this)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" stroke-width="1.6"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" stroke-width="1.6"/></svg> 知识详解</button><button class="viz-tab" onclick="switchVizTab(\'practice\',this)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="4" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M9 14l2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg> 去题库练习</button></div>'+

      '<div id="viz-tab-content"><div class="viz-detail-content"><div class="viz-detail-body">'+kpDetail+'</div></div></div>'+

      '</div>';

    setTimeout(() => {

      const canvas = document.getElementById('treeCanvas');

      if (canvas) {

        TreeVizEngine.init(canvas);

        TreeVizEngine.generateSteps(algoInfo.algo, algoInfo.data);

        TreeVizEngine.draw();

        TreeVizEngine.speed = 1;

        setTimeout(() => TreeVizEngine.play(), 800);

      }

    }, 120);

    window._treeKP = kp; window._treeCh = ch;

    return;

  }



  // graph-visualizer: 图结构可视化（邻接矩阵/表、DFS/BFS、Prim、Dijkstra、拓扑排序）

  if (kp.viz === 'graph-visualizer') {

    const el = document.getElementById('viz-view');

    const algoInfo = dsCoreAlgoMap[kp.name] || { kpId:'ds-7-0', name:'图概念' };

    const coreCode = dsCoreCodeMap[kp.name] || '// 暂无代码示例';

    const kpDetail = (function(){ const d=getKPDetail(ch.courseId,ch.num,ch.kps.indexOf(kp)); return d?d.explanation.replace(/\n/g,'<br>'):'暂无详细讲解。'; })();

    el.innerHTML =

      '<div class="view-back-bar"><button class="view-back-btn" onclick="backToKP()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>返回知识点</button><span class="view-back-title">第'+ch.num+'章 · '+kp.name+'</span></div>'+

      '<div class="viz-panel">'+

      '<div class="viz-header"><div class="viz-icon-lg" style="background:'+color+'22;color:'+color+'">图</div><div class="viz-title-area"><h2>'+kp.name+'</h2><p>'+kp.desc+'</p></div></div>'+

      '<div class="sort-dual-wrap">'+

        '<div class="sort-anim-col">'+

          '<div class="sort-anim-header"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polygon points="5 3 19 12 5 21" fill="currentColor"/></svg> '+algoInfo.name+'演示</div>'+

          '<canvas id="coreCanvas" style="display:block;width:100%;border-radius:10px;background:#0f172a"></canvas>'+

          '<div class="sort-progress-wrap"><div class="sort-progress-bar"><div class="sort-progress-fill" id="coreProgressFill"></div></div></div>'+

          '<div class="sort-step-info" id="coreStepInfo">准备中...</div>'+

          '<div class="sort-controls" id="coreControls">'+

            '<button class="sort-btn sort-btn-reset" onclick="DsCoreVizEngine.reset()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="1 4 1 10 7 10" stroke="currentColor" stroke-width="2"/><path d="M3.51 15a9 9 0 1 0 .49-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>'+

            '<button class="sort-btn sort-btn-prev" onclick="DsCoreVizEngine.prev()">◀</button>'+

            '<button class="sort-btn sort-btn-play" id="corePlayBtn" onclick="if(DsCoreVizEngine.playing)DsCoreVizEngine.pause();else DsCoreVizEngine.play()">▶ 播放</button>'+

            '<button class="sort-btn sort-btn-next" onclick="DsCoreVizEngine.next()">▶</button>'+

            '<div class="sort-speed-wrap"><label style="font-size:11px;color:#94a3b8">速度 <span id="coreSpeedVal">1</span></label>'+

            '<input type="range" id="coreSpeedRange" min="1" max="10" value="1" step="1" style="width:70px;accent-color:'+color+'" oninput="DsCoreVizEngine.speed=+this.value;document.getElementById(\'coreSpeedVal\').textContent=this.value"></div>'+

          '</div>'+

        '</div>'+

        '<div class="sort-code-col">'+

          '<div class="sort-code-header"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M16 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> C语言实现</div>'+

          '<textarea id="inlineCodeEditor" class="code-demo-editor sort-code-editor" spellcheck="false">'+coreCode+'</textarea>'+

          '<div class="code-demo-actions"><button id="inlineRunBtn" class="code-demo-run" onclick="runInlineCode()"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> 运行代码</button><span id="inlineRunStatus" class="code-demo-status"></span></div>'+

          '<pre id="inlineCodeOutput" class="code-demo-output sort-code-output"></pre>'+

        '</div>'+

      '</div>'+

      '<div class="viz-tabs"><button class="viz-tab active" onclick="switchVizTab(\'detail\',this)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" stroke-width="1.6"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" stroke-width="1.6"/></svg> 知识详解</button><button class="viz-tab" onclick="switchVizTab(\'practice\',this)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="4" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M9 14l2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg> 去题库练习</button></div>'+

      '<div id="viz-tab-content"><div class="viz-detail-content"><div class="viz-detail-body">'+kpDetail+'</div></div></div>'+

      '</div>';

    setTimeout(() => {

      const canvas = document.getElementById('coreCanvas');

      if (canvas) {

        DsCoreVizEngine.init(canvas);

        DsCoreVizEngine.generateSteps(algoInfo.kpId, algoInfo);

        DsCoreVizEngine.draw();

        DsCoreVizEngine.speed = 1;

        setTimeout(() => DsCoreVizEngine.play(), 800);

      }

    }, 120);

    window._coreKP = kp; window._coreCh = ch;

    return;

  }



  // 原有 2D Canvas 渲染

  _origRenderVizView(ch, kp);

  setTimeout(function(){ renderMath(document.getElementById('viz-view')); }, 80);

};



/* ═══════ 辅助函数 ═══════ */

function updateCodeDemoSpeed(){

  const s=parseInt(document.getElementById('viz-param-speed')?.value)||2;

  document.getElementById('viz-val-speed').textContent=s;

  VideoDemoEngine.state.speed=s;

}

function updateViz3DOpacity(){

  const v=parseFloat(document.getElementById('viz-param-opacity')?.value)||0.8;

  document.getElementById('viz-val-opacity').textContent=v.toFixed(1);

  Viz3DEngine.objects.forEach(o=>{if(o.material){o.material.opacity=v;o.material.transparent=true;}});

}

function b64dec(s){try{return s?decodeURIComponent(escape(atob(s))):s}catch(e){return s}}
async function runInlineCode(){

  const editor=document.getElementById('inlineCodeEditor'),out=document.getElementById('inlineCodeOutput'),status=document.getElementById('inlineRunStatus'),btn=document.getElementById('inlineRunBtn');

  if(!editor||!out)return;

  const code=editor.value,lang=(function(){var cid=state.currentChapter?.courseId;return cid==='cpp'?52:cid==='python'?71:50;})();

  btn.disabled=true;status.textContent='编译中...';status.style.color='#f59e0b';out.textContent='';

  try{

const resp=await fetch(JUDGE0_URL+'/submissions?base64_encoded=true&wait=true',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({source_code:btoa(unescape(encodeURIComponent(code))),language_id:lang,stdin:btoa(unescape(encodeURIComponent(''))),cpu_time_limit:15,memory_limit:512000})});

    if(!resp.ok){out.style.color="#f87171";out.textContent="HTTP "+resp.status;status.textContent="请求失败";return;} const r=await resp.json(); if(r){r.stdout=b64dec(r.stdout);r.stderr=b64dec(r.stderr);r.compile_output=b64dec(r.compile_output);}

    if(r.stdout){out.style.color='#86efac';out.textContent=r.stdout;status.textContent='成功';status.style.color='#86efac';}

    else if(r.compile_output){out.style.color='#f87171';out.textContent='编译错误:\n'+r.compile_output;status.textContent='编译错误';status.style.color='#f87171';}

    else if(r.stderr){out.style.color='#f87171';out.textContent='运行时错误:\n'+r.stderr;status.textContent='运行错误';status.style.color='#f87171';}

    else{out.style.color='#f0f2f8';out.textContent=r.stdout||'(无输出)';status.textContent='完成';status.style.color='#86efac';}

  }catch(e){out.style.color='#f87171';out.textContent='网络错误: '+e.message;status.textContent='错误';status.style.color='#f87171';}

  finally{btn.disabled=false;}

}



/* ═══════════════════════════════════════════════════════════

   悬浮 AI 助手侧边面板

═══════════════════════════════════════════════════════════ */



const sideChat = {

  messages: [],      // { role, content }

  isTyping: false,

  open: false,

};



function toggleAIPanel() {

  sideChat.open = !sideChat.open;

  const panel  = document.getElementById('aiSidePanel');

  const btn    = document.getElementById('aiFloatBtn');

  const overlay = document.getElementById('aiPanelOverlay');



  if (sideChat.open) {

    panel.classList.add('open');

    btn.classList.add('panel-open');

    btn.classList.remove('normal-pos');

    overlay.classList.add('show');

    document.body.classList.add('ai-panel-open');

    // 面板打开后聚焦输入框

    setTimeout(() => {

      const inp = document.getElementById('aiPanelInput');

      if (inp) inp.focus();

    }, 300);

  } else {

    panel.classList.remove('open');

    btn.classList.remove('panel-open');

    btn.classList.add('normal-pos');

    overlay.classList.remove('show');

    document.body.classList.remove('ai-panel-open');

  }

}



function clearSideChat() {

  sideChat.messages = [];

  const container = document.getElementById('aiPanelMessages');

  container.innerHTML = `

    <div class="ai-panel-welcome">

      <div class="ai-pw-icon">✨</div>

      <p>遇到不懂的地方，随时问我！</p>

      <div class="ai-quick-chips">

        <button class="ai-chip" onclick="sendSideQuick('帮我解释一下这个概念')">解释概念</button>

        <button class="ai-chip" onclick="sendSideQuick('这道题怎么做？')">解题思路</button>

        <button class="ai-chip" onclick="sendSideQuick('举个例子说明一下')">举例说明</button>

      </div>

    </div>`;

}



function sendSideQuick(text) {

  const inp = document.getElementById('aiPanelInput');

  if (inp) { inp.value = text; autoResizeSide(inp); }

  sendSideMessage();

}



function handleSideChatKey(e) {

  if (e.key === 'Enter' && !e.shiftKey) {

    e.preventDefault();

    sendSideMessage();

  }

}



function autoResizeSide(el) {

  el.style.height = 'auto';

  el.style.height = Math.min(el.scrollHeight, 120) + 'px';

}



// 拼装上下文：若正在学习某知识点/章节，则在系统提示里加入

function buildSideSysPrompt() {

  let ctx = '你是互动课堂 AI，专注辅助学生学习高等数学及编程课程。回答简洁清晰，公式用 LaTeX 包裹（行内用 $...$，独立公式用 $$...$$）。';

  if (state.currentKP) {

    ctx += ` 学生当前正在学习「${state.currentKP.name}」，相关描述：${state.currentKP.desc}。请结合该知识点回答。`;

  } else if (state.currentChapter) {

    ctx += ` 学生当前正在学习「第${state.currentChapter.num}章 ${state.currentChapter.title}」。请结合该章节内容回答。`;

  } else if (state.currentCourse) {

    ctx += ` 学生当前正在学习「${state.currentCourse.name}」课程。`;

  }

  return ctx;

}



async function sendSideMessage() {

  if (sideChat.isTyping) return;

  const inp = document.getElementById('aiPanelInput');

  const text = inp.value.trim();

  if (!text) return;



  inp.value = '';

  inp.style.height = 'auto';



  // 移除欢迎区

  const welcome = document.querySelector('.ai-panel-welcome');

  if (welcome) welcome.remove();



  // 追加用户消息

  appendSideMsg('user', text);

  sideChat.messages.push({ role: 'user', content: text });



  // 显示 typing

  sideChat.isTyping = true;

  document.getElementById('aiPanelSendBtn').disabled = true;

  const typingId = appendSideTyping();



  try {

    const sysPrompt = buildSideSysPrompt();

    const body = {

      model: DEEPSEEK_MODEL,

      messages: [

        { role: 'system', content: sysPrompt },

        ...sideChat.messages,

      ],

      temperature: 0.7,

      max_tokens: 1024,

      stream: false,

    };

    const res = await fetch(DEEPSEEK_API_URL, {

      method: 'POST',

      headers: {

        'Content-Type': 'application/json',

        'Authorization': 'Bearer ' + DEEPSEEK_API_KEY,

      },

      body: JSON.stringify(body),

    });

    const data = await res.json();

    if (data.error) throw new Error(data.error.message || 'API Error');



    const reply = data.choices[0].message.content;

    sideChat.messages.push({ role: 'assistant', content: reply });



    // 更新用量

    if (data.usage) trackUsage(data.usage.prompt_tokens || 0, data.usage.completion_tokens || 0);



    removeSideTyping(typingId);

    appendSideMsg('ai', reply);

  } catch (err) {

    removeSideTyping(typingId);

    appendSideMsg('ai', `⚠️ 请求失败：${err.message}`);

  } finally {

    sideChat.isTyping = false;

    document.getElementById('aiPanelSendBtn').disabled = false;

  }

}



function appendSideMsg(role, content) {

  const container = document.getElementById('aiPanelMessages');

  const div = document.createElement('div');

  div.className = `ai-msg ${role === 'user' ? 'user-msg' : 'ai-msg-item'}`;



  const avatarText = role === 'user' ? '我' : 'AI';

  let html = content;

  // 简单 Markdown：**粗体**、`代码`、换行

  html = html

    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

    .replace(/`([^`]+)`/g, '<code>$1</code>')

    .replace(/\n/g, '<br>');



  div.innerHTML = `

    <div class="ai-msg-avatar">${avatarText}</div>

    <div class="ai-msg-bubble">${html}</div>

  `;

  container.appendChild(div);



  // KaTeX 渲染

  if (window.renderMathInElement) {

    try {

      renderMathInElement(div, {

        delimiters: [

          { left: '$$', right: '$$', display: true },

          { left: '$',  right: '$',  display: false },

        ],

        throwOnError: false,

      });

    } catch (_) {}

  }



  container.scrollTop = container.scrollHeight;

}



function appendSideTyping() {

  const container = document.getElementById('aiPanelMessages');

  const id = 'side-typing-' + Date.now();

  const div = document.createElement('div');

  div.className = 'ai-msg ai-msg-item';

  div.id = id;

  div.innerHTML = `

    <div class="ai-msg-avatar">AI</div>

    <div class="ai-msg-bubble">

      <div class="ai-typing-dots">

        <span></span><span></span><span></span>

      </div>

    </div>`;

  container.appendChild(div);

  container.scrollTop = container.scrollHeight;

  return id;

}



function removeSideTyping(id) {

  const el = document.getElementById(id);

  if (el) el.remove();

}



function switchVizTab(tab, btn) {
  const tabs = btn.parentElement.querySelectorAll('.viz-tab');
  tabs.forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const content = document.getElementById('viz-tab-content');
  if (!content) return;
  const ch = state.currentChapter;
  const kp = state.currentKP;
  if (!ch || !kp) return;
  const kpIdx = ch.kps.indexOf(kp);
  const detail = getKPDetail(ch.courseId, ch.num, kpIdx);
  const problems = detail ? detail.problems : [];

  if (tab === 'detail') {
    const text = detail ? detail.explanation : '暂无详细讲解，后续持续更新中。';
    content.innerHTML = '<div class="viz-detail-content"><div class="viz-detail-body">' + text.replace(/\n/g, '<br>') + '</div></div>';
  } else if (tab === 'practice') {
    // 单题练习模式（随机抽一题）
    if (problems.length === 0) {
      content.innerHTML = '<div class="vp-empty"><p>暂无练习题</p></div>';
    } else {
      renderVpProblem(content, problems);
    }
  } else if (tab === 'quiz') {
    // 测验模式：顺序做完全部题
    if (problems.length === 0) {
      content.innerHTML = '<div class="vp-empty"><p>暂无练习题</p></div>';
    } else {
      startVpQuiz(content, problems, ch, kp);
    }
  }
  setTimeout(function(){ renderMath(content); }, 80);
}

// 练习模式：显示单道题

function renderVpProblem(content, problems, forceIdx) {
  var idx = forceIdx !== undefined ? forceIdx : Math.floor(Math.random() * problems.length);
  var p = problems[idx];
  var diffLabel = {easy:'基础', medium:'中等', hard:'挑战'};
  var diffColor = {easy:'#10b981', medium:'#f59e0b', hard:'#ef4444'};
  content.innerHTML = `
    <div class="vp-card">
      <div class="vp-head">
        <span class="vp-num">第 ${idx+1}/${problems.length} 题</span>
        <span class="vp-diff" style="color:${diffColor[p.d]};background:${diffColor[p.d]}15">${diffLabel[p.d]||p.d}</span>
        <button class="vp-btn vp-btn-small" onclick="switchVizTab('practice',document.querySelector('.viz-tabs .viz-tab:nth-child(2)'))">换一题</button>
      </div>
      <div class="vp-q">${p.q.replace(/</g,'&lt;')}</div>
      <div class="vp-input-wrap">
        <input type="text" class="vp-input" id="vpUserAnswer" placeholder="在此输入答案..." onkeydown="if(event.key==='Enter')vpSubmit()">
        <button class="vp-btn vp-btn-primary" id="vpSubmitBtn" onclick="vpSubmit()">提交答案</button>
      </div>
      <div class="vp-result" id="vpResult" style="display:none"></div>
      <div class="vp-correct" id="vpCorrect" style="display:none">
        <div class="vp-correct-label">答案与解析</div>
        <div class="vp-correct-text">${p.a.replace(/</g,'&lt;').replace(/\n/g,'<br>')}</div>
      </div>
      <div id="vpKpDetail" style="display:none"></div>
    </div>`;
  content._vpCurIdx = idx;
  content._vpProblems = problems;
}

function vpSubmit() {
  var input = document.getElementById('vpUserAnswer');
  var result = document.getElementById('vpResult');
  var correct = document.getElementById('vpCorrect');
  var kpDiv = document.getElementById('vpKpDetail');
  var btn = document.getElementById('vpSubmitBtn');
  if (!input || !result) return;
  var userA = input.value.trim();
  var content = document.getElementById('viz-tab-content');
  if (!content) return;
  var p = content._vpProblems[content._vpCurIdx];
  var stdA = p.a;
  var ok = userA.replace(/\s/g,'') === stdA.replace(/\s/g,'') || userA === stdA;

  result.style.display = 'block';
  correct.style.display = 'block';
  if (kpDiv) kpDiv.style.display = 'block';
  btn.disabled = true;

  // 知识点详解（完整）
  var kpHtml = '';
  var ch = state.currentChapter;
  var kpIdx = ch ? ch.kps.indexOf(state.currentKP) : -1;
  if (ch && kpIdx >= 0) {
    var detail = getKPDetail(ch.courseId, ch.num, kpIdx);
    if (detail && detail.explanation) {
      var uid = 'kp-exp-' + Math.random().toString(36).slice(2,6);
      var fullExp = detail.explanation.replace(/\n/g, '<br>');
      kpHtml += '<div class="vp-kp-detail">';
      kpHtml += '<div style="font-size:13px;font-weight:600;color:#a78bfa;margin-bottom:6px">📖 相关知识点: ' + state.currentKP.name + '（第' + ch.num + '章 ' + ch.title + '）</div>';
      kpHtml += '<div id="' + uid + '" style="max-height:72px;overflow:hidden;transition:max-height 0.3s;font-size:13px;color:var(--text-secondary);line-height:1.8">' + fullExp + '</div>';
      if (detail.explanation.length > 100) {
        kpHtml += '<button onclick="var e=document.getElementById(\'' + uid + '\');if(e.style.maxHeight==\'72px\'){e.style.maxHeight=\'none\';this.textContent=\'收起\';}else{e.style.maxHeight=\'72px\';this.textContent=\'展开全部\';}" class="vp-expand-btn">展开全部</button>';
      }
      kpHtml += '</div>';
      if (kpDiv) kpDiv.innerHTML = kpHtml;
    }
  }

  if (ok) {
    result.innerHTML = '✅ 回答正确！';
    result.className = 'vp-result vp-result-ok';
  } else {
    result.innerHTML = '❌ 回答错误';
    result.className = 'vp-result vp-result-err';
  }

  if (ok) {
    result.innerHTML = '✅ 回答正确！';
    result.className = 'vp-result vp-result-ok';
  } else {
    result.innerHTML = '❌ 回答错误';
    result.className = 'vp-result vp-result-err';
  }
  setTimeout(function(){ renderMath(correct); }, 50);
}

// 测验模式

function startVpQuiz(content, problems, ch, kp) {
  var quiz = { idx: 0, score: 0, answers: [], t0: Date.now() };
  content._vpQuiz = quiz;
  renderVpQuizQ(content, problems, quiz);
}

function renderVpQuizQ(content, problems, quiz) {
  var p = problems[quiz.idx];
  var diffLabel = {easy:'基础', medium:'中等', hard:'挑战'};
  var diffColor = {easy:'#10b981', medium:'#f59e0b', hard:'#ef4444'};
  // 知识点信息
  var ch = state.currentChapter;
  var kp = state.currentKP;
  var kpInfo = (ch && kp) ? '第' + ch.num + '章 ' + ch.title + ' · ' + kp.name : '';
  content.innerHTML = `
    <div class="vp-card">
      <div class="vp-head">
        <span class="vp-num">第 ${quiz.idx+1}/${problems.length} 题</span>
        <span class="vp-diff" style="color:${diffColor[p.d]};background:${diffColor[p.d]}15">${diffLabel[p.d]||p.d}</span>
        <span style="font-size:12px;color:var(--text-muted);margin-left:auto">得分: ${quiz.score}</span>
      </div>
      <div class="vp-q">${p.q.replace(/</g,'&lt;')}</div>
      <div id="vpQuizInputArea">
        <div class="vp-input-wrap">
          <input type="text" class="vp-input" id="vpUserAnswer" placeholder="在此输入答案..." onkeydown="if(event.key==='Enter')vpQuizSubmit()">
          <button class="vp-btn vp-btn-primary" onclick="vpQuizSubmit()">提交答案</button>
        </div>
      </div>
      <div class="vp-result" id="vpQuizFeedback" style="display:none"></div>
      <div id="vpQuizNextBtn" style="display:none;margin-top:12px">
        <button class="vp-btn vp-btn-primary" onclick="vpQuizNext()">${quiz.idx === problems.length-1 ? '查看成绩' : '下一题 ▶'}</button>
      </div>
    </div>`;
}

function vpQuizSubmit() {
  var content = document.getElementById('viz-tab-content');
  if (!content || !content._vpQuiz) return;
  var quiz = content._vpQuiz;
  var problems = getKPDetail(state.currentChapter.courseId, state.currentChapter.num, state.currentChapter.kps.indexOf(state.currentKP)).problems;
  var input = document.getElementById('vpUserAnswer');
  var userA = input ? input.value.trim() : '';
  var p = problems[quiz.idx];
  var ok = userA.replace(/\s/g,'') === p.a.replace(/\s/g,'') || userA === p.a;
  if (ok) quiz.score++;

  // 隐藏输入区，显示反馈+知识点+下一题按钮
  var inputArea = document.getElementById('vpQuizInputArea');
  var feedback = document.getElementById('vpQuizFeedback');
  var nextBtn = document.getElementById('vpQuizNextBtn');
  if (inputArea) inputArea.style.display = 'none';
  if (nextBtn) nextBtn.style.display = 'block';
  if (feedback) {
    feedback.style.display = 'block';
    var ch = state.currentChapter;
    var kpIdx = ch ? ch.kps.indexOf(state.currentKP) : -1;
    var kpHtml = '';
    if (ch && kpIdx >= 0) {
      var detail = getKPDetail(ch.courseId, ch.num, kpIdx);
      if (detail && detail.explanation) {
        var uid = 'qz-kp-exp-' + Math.random().toString(36).slice(2,6);
        var fullExp = detail.explanation.replace(/\n/g, '<br>');
        kpHtml += '<div class="vp-kp-detail" style="margin-top:12px">';
        kpHtml += '<div style="font-size:13px;font-weight:600;color:#a78bfa;margin-bottom:6px">📖 相关知识点: ' + state.currentKP.name + '（第' + ch.num + '章 ' + ch.title + '）</div>';
        kpHtml += '<div id="' + uid + '" style="max-height:72px;overflow:hidden;transition:max-height 0.3s;font-size:13px;color:var(--text-secondary);line-height:1.8">' + fullExp + '</div>';
        if (detail.explanation.length > 100) {
          kpHtml += '<button onclick="var e=document.getElementById(\'' + uid + '\');if(e.style.maxHeight==\'72px\'){e.style.maxHeight=\'none\';this.textContent=\'收起\';}else{e.style.maxHeight=\'72px\';this.textContent=\'展开全部\';}" class="vp-expand-btn">展开全部</button>';
        }
        kpHtml += '</div>';
      }
    }
    if (ok) {
      feedback.innerHTML = '<div style="color:#34d399;font-weight:600">✅ 回答正确！</div><div class="vp-correct" style="margin-top:8px"><div class="vp-correct-label">答案与解析</div><div class="vp-correct-text">' + p.a.replace(/</g,'&lt;').replace(/\n/g,'<br>') + '</div></div>' + kpHtml;
    } else {
      feedback.innerHTML = '<div style="color:#f87171;font-weight:600">❌ 回答错误</div><div class="vp-correct" style="margin-top:8px"><div class="vp-correct-label">答案与解析</div><div class="vp-correct-text">' + p.a.replace(/</g,'&lt;').replace(/\n/g,'<br>') + '</div></div>' + kpHtml;
    }
    setTimeout(function(){ renderMath(feedback); }, 50);
  }
}

function vpQuizNext() {
  var content = document.getElementById('viz-tab-content');
  if (!content || !content._vpQuiz) return;
  var quiz = content._vpQuiz;
  var problems = getKPDetail(state.currentChapter.courseId, state.currentChapter.num, state.currentChapter.kps.indexOf(state.currentKP)).problems;

  if (quiz.idx === problems.length - 1) {
    // 交卷，显示结果
    var total = problems.length;
    var score = Math.round(quiz.score / total * 100);
    var grade = score >= 90 ? '🏆 优秀' : score >= 70 ? '👍 良好' : score >= 50 ? '📖 继续加油' : '💪 还需努力';
    var ch = state.currentChapter, kp = state.currentKP;
    content.innerHTML = `
      <div class="vp-card" style="text-align:center;padding:32px">
        <div style="font-size:48px;font-weight:700;color:#6366f1">${score}</div>
        <div style="font-size:18px;color:var(--text-secondary);margin-top:4px">${grade}</div>
        <div style="font-size:14px;color:var(--text-muted);margin-top:8px">共 ${total} 题 · 答对 ${quiz.score} 题</div>
        ${ch && kp ? '<div style="font-size:12px;color:var(--accent);margin-top:6px;padding:6px;background:rgba(99,102,241,0.06);border-radius:6px">📚 知识点: 第' + ch.num + '章 · ' + ch.title + ' → ' + kp.name + '</div>' : ''}
        <button class="vp-btn" style="margin-top:16px" onclick="switchVizTab('quiz',document.querySelector('.viz-tabs .viz-tab:nth-child(3)'))">重新测验</button>
      </div>`;
  } else {
    quiz.idx++;
    renderVpQuizQ(content, problems, quiz);
  }
  setTimeout(function(){ renderMath(content); }, 50);
}

// 辅助函数：绘制填充区域
VizEngine.drawFilledRegion = function(xMin,xMax,yMin,yMax, rxMin,rxMax,ryMin,ryMax,color) {
  const ctx = this.ctx;
  const [sx1, sy1] = this.toScreen(xMin, yMin, rxMin,rxMax,ryMin,ryMax);
  const [sx2, sy2] = this.toScreen(xMax, yMax, rxMin,rxMax,ryMin,ryMax);
  ctx.fillStyle = color;
  ctx.fillRect(sx1, sy2, sx2-sx1, sy1-sy2);
};

/* ═══════ 视图渲染函数 ═══════ */

// 绘制线性代数紫色书封封面（同济第七版风格）

function drawLACover(canvas) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.parentElement.clientWidth;
  const H = 220;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const PURPLE_DEEP = '#3a2d6e', PURPLE_MID = '#5944a8', PURPLE_LIGHT = '#8b7fc8';
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, PURPLE_DEEP); bg.addColorStop(0.5, PURPLE_MID); bg.addColorStop(1, PURPLE_DEEP);
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = 0.18;
  for (let r = 80; r < 800; r += 22) {
    ctx.beginPath(); ctx.arc(W * 0.18, H * 0.55, r, 0, Math.PI * 2);
    ctx.strokeStyle = PURPLE_LIGHT; ctx.lineWidth = 0.6; ctx.stroke();
  }
  ctx.restore();
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(0, 0, 8, H);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '600 10px "微软雅黑",sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  ctx.fillText('"十四五"普通高等教育本科国家级规划教材', 22, 12);
  ctx.beginPath(); ctx.arc(W - 24, 22, 10, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fill();
  ctx.beginPath(); ctx.arc(W - 24, 22, 7, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 14px "微软雅黑",sans-serif';
  ctx.fillText('工程数学', W / 2 - 30, H * 0.22);
  ctx.font = 'bold 32px "黑体","微软雅黑",sans-serif';
  ctx.fillText('线性代数', W / 2 - 56, H * 0.32);
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.fillRect(W / 2 - 28, H * 0.55, 56, 22);
  ctx.fillStyle = PURPLE_DEEP;
  ctx.font = 'bold 13px "黑体","微软雅黑",sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('第七版', W / 2, H * 0.55 + 5);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = '500 11px "宋体",sans-serif';
  ctx.fillText('同济大学数学科学学院 编', W / 2, H * 0.72);
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = '500 9px "宋体",sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('高等教育出版社', 22, H - 18);
  ctx.textAlign = 'right';
  ctx.fillText('HIGHER EDUCATION PRESS', W - 22, H - 18);
}

function drawLAChapterCover(ctx, w, h, ch) {
  const cx = w / 2, cy = h / 2;
  const palette = {
    1: ['#6366f1', '#a78bfa', '#c4b5fd'], 2: ['#8b5cf6', '#c4b5fd', '#ddd6fe'],
    3: ['#0ea5e9', '#38bdf8', '#7dd3fc'], 4: ['#10b981', '#34d399', '#6ee7b7'],
    5: ['#f59e0b', '#fbbf24', '#fcd34d'], 6: ['#ec4899', '#f472b6', '#f9a8d4'],
  };
  const [c1, c2, c3] = palette[ch.num] || ['#8b5cf6', '#a78bfa', '#c4b5fd'];

  if (ch.num === 1) {
    const cs = Math.min(w, h) * 0.13;
    const sx = cx - cs * 1.5, sy = cy - cs * 1.5;
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2;
    for (let i = 0; i <= 3; i++) {
      ctx.beginPath(); ctx.moveTo(sx + i*cs, sy); ctx.lineTo(sx + i*cs, sy + 3*cs); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sx, sy + i*cs); ctx.lineTo(sx + 3*cs, sy + i*cs); ctx.stroke();
    }
    ctx.lineWidth = 4; ctx.strokeStyle = c1;
    ctx.beginPath(); ctx.moveTo(sx - 12, sy); ctx.lineTo(sx - 12, sy + 3*cs); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sx + 3*cs + 12, sy); ctx.lineTo(sx + 3*cs + 12, sy + 3*cs); ctx.stroke();
    ctx.font = 'bold ' + (cs*0.5) + 'px "Times New Roman"'; ctx.fillStyle = c1;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const syms = ['a11','a12','a13','a21','a22','a23','a31','a32','a33'];
    let idx = 0;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) ctx.fillText(syms[idx++], sx + j*cs + cs/2, sy + i*cs + cs/2);
    ctx.lineWidth = 1.5; ctx.setLineDash([]); ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    [[0,0,2,2],[1,1,2,3],[2,2,0,3]].forEach(([r1,c1,r2,c2]) => {
      ctx.beginPath(); ctx.moveTo(sx + c1*cs+cs*0.2, sy + r1*cs+cs*0.2);
      ctx.lineTo(sx + c2*cs+cs*0.8, sy + r2*cs+cs*0.8); ctx.stroke();
    });
    ctx.setLineDash([4,3]); ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    [[0,2,2,0],[1,2,2,1],[2,1,0,2]].forEach(([r1,c1,r2,c2]) => {
      ctx.beginPath(); ctx.moveTo(sx + c1*cs+cs*0.8, sy + r1*cs+cs*0.2);
      ctx.lineTo(sx + c2*cs+cs*0.2, sy + r2*cs+cs*0.8); ctx.stroke();
    });
    ctx.setLineDash([]);
  } else if (ch.num === 2) {
    const cell = Math.min(w, h) * 0.11;
    const aX = cx - cell * 3.2, aY = cy - cell * 1.5;
    const bX = cx - cell * 0.5, bY = cy - cell * 1.5;
    const cX = cx + cell * 2.2, cY = cy - cell * 1.5;
    const drawMat = (x, y, lbl, color) => {
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, 2*cell, 2*cell);
      ctx.font = 'bold ' + (cell*0.4) + 'px "Times New Roman"'; ctx.fillStyle = color;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(lbl+'11', x + cell/2, y + cell/2);
      ctx.fillText(lbl+'12', x + cell*1.5, y + cell/2);
      ctx.fillText(lbl+'21', x + cell/2, y + cell*1.5);
      ctx.fillText(lbl+'22', x + cell*1.5, y + cell*1.5);
    };
    drawMat(aX, aY, 'a', c1); drawMat(bX, bY, 'b', c1); drawMat(cX, cY, 'c', c2);
    ctx.font = 'bold ' + (cell*1.0) + 'px "Times New Roman"'; ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('×', cx - cell*0.2, cy - cell*0.5);
    ctx.fillText('=', cx + cell*1.5, cy - cell*0.5);
  } else if (ch.num === 3) {
    const cell = Math.min(w, h) * 0.14;
    const sx = cx - cell * 2.5, sy = cy - cell * 1.5;
    const steps = [[1,1,1,8],[0,1,2,5],[0,0,1,2],[0,0,0,0]];
    ctx.font = 'bold ' + (cell*0.32) + 'px "Times New Roman"';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
      const v = steps[i][j]; const x = sx + j*cell, y = sy + i*cell;
      ctx.fillStyle = v !== 0 ? c1 : 'rgba(255,255,255,0.15)';
      ctx.fillText(v+'', x + cell/2, y + cell/2);
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1;
    ctx.strokeRect(sx, sy, 4*cell, 4*cell);
    const ax = sx + 4*cell + 20;
    ctx.strokeStyle = c2; ctx.fillStyle = c2; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ax, cy); ctx.lineTo(ax + 40, cy);
    ctx.lineTo(ax + 32, cy - 5); ctx.moveTo(ax + 40, cy); ctx.lineTo(ax + 32, cy + 5); ctx.stroke();
    ctx.font = (cell*0.35) + 'px "微软雅黑"'; ctx.fillText('行阶梯形', ax + 8, cy + cell*0.7);
  } else if (ch.num === 4) {
    const scale = Math.min(w, h) * 0.13;
    const o = [cx - 30, cy + 20];
    const v1 = [3*scale, -1.5*scale], v2 = [2*scale, 1.5*scale];
    const v3 = [v1[0]+v2[0], v1[1]+v2[1]];
    const drawArrow = (from, to, color, lw) => {
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw;
      ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.lineTo(to[0], to[1]); ctx.stroke();
      const ang = Math.atan2(to[1]-from[1], to[0]-from[0]);
      ctx.beginPath(); ctx.moveTo(to[0], to[1]);
      ctx.lineTo(to[0] - 8*Math.cos(ang-0.3), to[1] - 8*Math.sin(ang-0.3));
      ctx.lineTo(to[0] - 8*Math.cos(ang+0.3), to[1] - 8*Math.sin(ang+0.3));
      ctx.closePath(); ctx.fill();
    };
    drawArrow(o, [o[0]+v1[0], o[1]+v1[1]], c1, 3);
    drawArrow(o, [o[0]+v2[0], o[1]+v2[1]], c2, 3);
    ctx.setLineDash([6,4]);
    drawArrow(o, [o[0]+v3[0], o[1]+v3[1]], c3, 2);
    ctx.setLineDash([]);
    ctx.font = 'italic bold 14px "Times New Roman"';
    ctx.fillStyle = c1; ctx.fillText('a1', o[0]+v1[0]+8, o[1]+v1[1]+4);
    ctx.fillStyle = c2; ctx.fillText('a2', o[0]+v2[0]+8, o[1]+v2[1]+4);
    ctx.fillStyle = c3; ctx.fillText('a1+a2', o[0]+v3[0]+8, o[1]+v3[1]+4);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath(); ctx.arc(o[0], o[1], 3, 0, Math.PI*2); ctx.fill();
  } else if (ch.num === 5) {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-Math.PI/6);
    ctx.strokeStyle = c1; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(0, 0, Math.min(w,h)*0.32, Math.min(w,h)*0.16, 0, 0, Math.PI*2);
    ctx.stroke(); ctx.fillStyle = c1 + '30'; ctx.fill();
    ctx.strokeStyle = c2; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-Math.min(w,h)*0.32, 0); ctx.lineTo(Math.min(w,h)*0.32, 0); ctx.stroke();
    ctx.strokeStyle = c3;
    ctx.beginPath(); ctx.moveTo(0, -Math.min(w,h)*0.16); ctx.lineTo(0, Math.min(w,h)*0.16); ctx.stroke();
    ctx.restore();
    ctx.font = 'italic bold 16px "Times New Roman"';
    ctx.fillStyle = c2; ctx.textAlign = 'center';
    const la = Math.min(w,h)*0.32;
    ctx.fillText('λ1', cx + la*Math.cos(-Math.PI/6)*0.7, cy + la*Math.sin(-Math.PI/6)*0.7 + 4);
    ctx.fillText('λ2', cx - la*Math.sin(-Math.PI/6)*0.7, cy + la*Math.cos(-Math.PI/6)*0.7 + 4);
  } else if (ch.num === 6) {
    const o = [cx - 30, cy + 30];
    const scale = Math.min(w, h) * 0.16;
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(o[0]-scale*1.5, o[1]); ctx.lineTo(o[0]+scale*2, o[1]); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(o[0], o[1]+scale*1.5); ctx.lineTo(o[0], o[1]-scale*1.8); ctx.stroke();
    const drawBase = (color, drawX, drawY, label) => {
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.lineTo(drawX, drawY); ctx.stroke();
      ctx.beginPath(); ctx.arc(drawX, drawY, 3, 0, Math.PI*2); ctx.fill();
      ctx.font = 'italic bold 13px "Times New Roman"'; ctx.fillText(label, drawX+8, drawY+4);
    };
    drawBase(c1, o[0]+scale*1.4, o[1], 'e1');
    drawBase(c2, o[0], o[1]-scale*1.4, 'e2');
    ctx.save(); ctx.translate(o[0], o[1]); ctx.rotate(-Math.PI/8);
    drawBase(c3, scale*1.1*Math.cos(-Math.PI/8), scale*1.1*Math.sin(-Math.PI/8), '');
    ctx.restore();
  }
}

function buildMatrixGrid(gridId, rowsSel, colsSel) {
  var grid = document.getElementById(gridId);
  if (!grid) return;
  var rows = parseInt(rowsSel.value);
  var cols = parseInt(colsSel.value);
  var html = '';
  for (var r = 0; r < rows; r++) {
    html += '<div style="display:flex;gap:4px;justify-content:center">';
    for (var c = 0; c < cols; c++) {
      html += '<input class="matrix-cell" id="' + gridId + '_r' + r + 'c' + c + '" type="text" value="' + (r === c ? 1 : 0) + '" style="width:42px;text-align:center;background:var(--bg-input);border:1px solid var(--border);border-radius:6px;color:var(--text-primary);font-size:14px;font-family:Menlo,Consolas,monospace;padding:5px 2px" onfocus="this.select()">';
    }
    html += '</div>';
  }
  grid.innerHTML = html;
}

// 从格子读取矩阵

function readMatrixFromGrid(gridId, rowsSel, colsSel) {
  var rows = parseInt(rowsSel.value);
  var cols = parseInt(colsSel.value);
  var M = [];
  for (var r = 0; r < rows; r++) {
    var row = [];
    for (var c = 0; c < cols; c++) {
      var cell = document.getElementById(gridId + '_r' + r + 'c' + c);
      var val = cell ? parseFloat(cell.value) : 0;
      row.push(isNaN(val) ? 0 : val);
    }
    M.push(row);
  }
  return M;
}

function runLinearAlgebraTool(toolName) {
  var result = document.getElementById('fmResult');
  if (!result) return;
  result.style.display = 'block';

  // 从格子读取矩阵
  var rowsSel = document.getElementById('dmRows');
  var colsSel = document.getElementById('dmCols');
  var matrix;
  try {
    matrix = readMatrixFromGrid('dmGrid', rowsSel, colsSel);
    if (!matrix || matrix.length === 0) throw new Error('矩阵为空');
  } catch(e) {
    result.innerHTML = '<div style="color:#ef4444;padding:12px;background:rgba(239,68,68,0.08);border-radius:8px">❌ 读取矩阵失败：' + e.message + '</div>';
    return;
  }
  if (toolName === 'determinant') {
    var detSteps = computeDeterminantSteps(matrix);
    result.innerHTML = renderDeterminantResult(matrix, detSteps);
  } else {
    var target = document.getElementById('fmMethod').value;
    var wantRREF = target.indexOf('最简') >= 0;
    var reduceSteps = matrixRowReduce(matrix, wantRREF);
    result.innerHTML = renderRowReduceResult(matrix, reduceSteps, wantRREF);
  }
  setTimeout(function(){ renderMath(result); }, 50);
}

function cloneMatrix(M) { return M.map(function(r){return r.slice();}); }

function matStr(M) { return M.map(function(r){return r.map(function(x){return formatNum(x);}).join('  ');}).join('\n'); }

function formatNum(x) {
  if (Math.abs(x) < 1e-10) return '0';
  if (Number.isInteger(x) && Math.abs(x) < 10000) return x.toString();
  return x.toFixed(3).replace(/\.?0+$/, '');
}

function computeDeterminantSteps(M) {
  var steps = [];
  var n = M.length, A = cloneMatrix(M), det = 1, swapCount = 0;
  steps.push({type:'init', mat: cloneMatrix(A), msg: '原矩阵 ' + n + '×' + n});
  for (var k = 0; k < n - 1; k++) {
    var maxRow = k;
    for (var i = k + 1; i < n; i++) if (Math.abs(A[i][k]) > Math.abs(A[maxRow][k])) maxRow = i;
    if (Math.abs(A[maxRow][k]) < 1e-10) {
      steps.push({type:'zero', mat: cloneMatrix(A), msg: '第 ' + (k+1) + ' 列主元为0，det=0'});
      return {det:0, steps:steps};
    }
    if (maxRow !== k) {
      var t = A[k]; A[k] = A[maxRow]; A[maxRow] = t; swapCount++;
      steps.push({type:'swap', mat: cloneMatrix(A), msg: '互换 R' + (k+1) + ' ↔ R' + (maxRow+1) + '（行列式变号）'});
    }
    for (var ii = k + 1; ii < n; ii++) {
      var factor = A[ii][k] / A[k][k];
      if (Math.abs(factor) > 1e-10) {
        for (var jj = k; jj < n; jj++) A[ii][jj] -= factor * A[k][jj];
        steps.push({type:'elim', mat: cloneMatrix(A), msg: 'R' + (ii+1) + ' ← R' + (ii+1) + ' − ' + formatNum(factor) + '·R' + (k+1)});
      }
    }
  }
  var diag = []; for (var d = 0; d < n; d++) diag.push(A[d][d]);
  det = diag.reduce(function(a,b){return a*b;}, 1) * (swapCount % 2 === 0 ? 1 : -1);
  steps.push({type:'final', mat: cloneMatrix(A), msg: '上三角化完成，det = (' + diag.map(formatNum).join(' × ') + ') × (-1)^' + swapCount + ' = ' + formatNum(det)});
  return {det: det, steps: steps};
}

function matrixRowReduce(M, wantRREF) {
  var steps = [];
  var A = cloneMatrix(M), n = A.length, m = A[0].length, pivotRow = 0;
  steps.push({type:'init', mat: cloneMatrix(A), msg: '原矩阵 ' + n + '×' + m});
  for (var col = 0; col < m && pivotRow < n; col++) {
    var maxRow = pivotRow;
    for (var i = pivotRow + 1; i < n; i++) if (Math.abs(A[i][col]) > Math.abs(A[maxRow][col])) maxRow = i;
    if (Math.abs(A[maxRow][col]) < 1e-10) continue;
    if (maxRow !== pivotRow) {
      var t = A[pivotRow]; A[pivotRow] = A[maxRow]; A[maxRow] = t;
      steps.push({type:'swap', mat: cloneMatrix(A), msg: '互换 R' + (pivotRow+1) + ' ↔ R' + (maxRow+1)});
    }
    var pivot = A[pivotRow][col];
    if (Math.abs(pivot - 1) > 1e-10) {
      for (var j = 0; j < m; j++) A[pivotRow][j] /= pivot;
      steps.push({type:'scale', mat: cloneMatrix(A), msg: 'R' + (pivotRow+1) + ' ← R' + (pivotRow+1) + ' ÷ ' + formatNum(pivot)});
    }
    var endRow = wantRREF ? n : pivotRow + 1;
    for (var ii = 0; ii < endRow; ii++) {
      if (ii !== pivotRow && Math.abs(A[ii][col]) > 1e-10) {
        var f = A[ii][col];
        for (var jj = 0; jj < m; jj++) A[ii][jj] -= f * A[pivotRow][jj];
        steps.push({type:'elim', mat: cloneMatrix(A), msg: 'R' + (ii+1) + ' ← R' + (ii+1) + ' − ' + formatNum(f) + '·R' + (pivotRow+1)});
      }
    }
    pivotRow++;
  }
  steps.push({type:'final', mat: cloneMatrix(A), msg: wantRREF ? '行最简形（RREF）' : '行阶梯形（REF）'});
  return steps;
}

function renderDeterminantResult(origM, detSteps) {
  var uid = 'det-' + Math.random().toString(36).slice(2,8);
  var html = '';
  // 最终结果（始终显示）
  html += '<div style="padding:16px;background:linear-gradient(135deg,rgba(139,92,246,0.15),rgba(99,102,241,0.1));border-radius:10px;text-align:center;margin-bottom:12px">';
  html += '<div style="font-size:13px;color:#a78bfa;font-weight:600">计算完成</div>';
  html += '<div style="font-size:28px;font-weight:700;color:#fff;margin-top:6px">det = ' + formatNum(detSteps.det) + '</div>';
  html += '</div>';

  // 折叠按钮
  html += '<button onclick="var p=document.getElementById(\'' + uid + '\');var btn=this;if(p.style.display==\'none\'){p.style.display=\'block\';btn.textContent=\'▼ 收起 ' + detSteps.steps.length + ' 步计算过程\';}else{p.style.display=\'none\';btn.textContent=\'▶ 展开 ' + detSteps.steps.length + ' 步计算过程\';}" style="width:100%;padding:10px 16px;background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:8px;color:#a78bfa;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:8px">▶ 展开 ' + detSteps.steps.length + ' 步计算过程</button>';

  // 步骤面板（默认隐藏）
  html += '<div id="' + uid + '" style="display:none;display:flex;flex-direction:column;gap:10px;margin-top:8px">';
  for (var i = 0; i < detSteps.steps.length; i++) {
    var s = detSteps.steps[i];
    var bg = s.type === 'final' ? 'background:rgba(16,185,129,0.1);border-color:rgba(16,185,129,0.3)'
          : s.type === 'zero' ? 'background:rgba(239,68,68,0.08);border-color:rgba(239,68,68,0.3)'
          : 'background:rgba(99,102,241,0.06);border-color:rgba(99,102,241,0.2)';
    html += '<div style="padding:10px 12px;border:1px solid;border-radius:8px;' + bg + '">';
    html += '<div style="font-size:13px;color:#a78bfa;font-weight:600;margin-bottom:6px">第 ' + (i+1) + ' 步 · ' + s.msg + '</div>';
    html += '<pre style="font-family:Menlo,Consolas,monospace;font-size:13px;color:#e2e8f0;background:rgba(0,0,0,0.25);padding:10px;border-radius:6px;margin:0;overflow:auto;line-height:1.5">' + matStr(s.mat) + '</pre>';
    html += '</div>';
  }
  html += '</div>';
  return html;
}

function renderRowReduceResult(origM, steps, wantRREF) {
  var uid = 'rref-' + Math.random().toString(36).slice(2,8);
  var html = '';
  // 最终结果
  var finalStep = steps[steps.length - 1];
  html += '<div style="padding:14px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:8px;margin-bottom:12px">';
  html += '<div style="font-size:13px;color:#34d399;font-weight:600;margin-bottom:8px">' + finalStep.msg + '</div>';
  html += '<pre style="font-family:Menlo,Consolas,monospace;font-size:13px;color:#e2e8f0;background:rgba(0,0,0,0.25);padding:10px;border-radius:6px;margin:0;overflow:auto;line-height:1.5">' + matStr(finalStep.mat) + '</pre>';
  html += '</div>';

  // 折叠按钮
  html += '<button onclick="var p=document.getElementById(\'' + uid + '\');var btn=this;if(p.style.display==\'none\'){p.style.display=\'block\';btn.textContent=\'▼ 收起 ' + steps.length + ' 步变换过程\';}else{p.style.display=\'none\';btn.textContent=\'▶ 展开 ' + steps.length + ' 步变换过程\';}" style="width:100%;padding:10px 16px;background:rgba(14,165,233,0.08);border:1px solid rgba(14,165,233,0.2);border-radius:8px;color:#38bdf8;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:8px">▶ 展开 ' + steps.length + ' 步变换过程</button>';

  // 步骤面板（默认隐藏）
  html += '<div id="' + uid + '" style="display:none;display:flex;flex-direction:column;gap:8px;margin-top:8px">';
  for (var i = 0; i < steps.length; i++) {
    var s = steps[i];
    var isFinal = s.type === 'final';
    var bg = isFinal ? 'background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.3)'
          : 'background:rgba(14,165,233,0.05);border:1px solid rgba(14,165,233,0.18)';
    html += '<div style="padding:10px 12px;border-radius:8px;' + bg + '">';
    html += '<div style="font-size:13px;color:#38bdf8;font-weight:600;margin-bottom:6px">第 ' + (i+1) + ' 步 · ' + s.msg + '</div>';
    html += '<pre style="font-family:Menlo,Consolas,monospace;font-size:13px;color:#e2e8f0;background:rgba(0,0,0,0.25);padding:10px;border-radius:6px;margin:0;overflow:auto;line-height:1.5">' + matStr(s.mat) + '</pre>';
    html += '</div>';
  }
  html += '</div>';
  return html;
}

function openQuizModal() {
  if (!state.currentCourse || state.currentCourse.id !== 'la') return;
  var chs = chaptersData.filter(function(c){return c.courseId === 'la';});
  var html = '<div style="padding:8px 0">';
  html += '<div style="font-size:14px;color:var(--text-secondary);margin-bottom:12px">选择要测验的章节（可多选）</div>';
  html += '<div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">';
  html += '<button onclick="quizSelectAll(true)" style="padding:4px 12px;background:var(--bg-input);border:1px solid var(--border);border-radius:6px;color:var(--text-secondary);cursor:pointer;font-size:12px">全选</button>';
  html += '<button onclick="quizSelectAll(false)" style="padding:4px 12px;background:var(--bg-input);border:1px solid var(--border);border-radius:6px;color:var(--text-secondary);cursor:pointer;font-size:12px">取消</button>';
  html += '</div>';
  for (var i = 0; i < chs.length; i++) {
    html += '<label style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--bg-input);border-radius:8px;margin-bottom:8px;cursor:pointer">';
    html += '<input type="checkbox" id="qz-ch-' + chs[i].num + '" checked style="accent-color:#6366f1;width:16px;height:16px" checked>';
    html += '<span style="font-weight:600;color:var(--text-primary)">第' + chs[i].num + '章 ' + chs[i].title + '</span>';
    html += '<span style="color:var(--text-muted);font-size:12px;margin-left:auto">' + chs[i].kps.length + '个知识点</span>';
    html += '</label>';
  }
  html += '<button class="btn btn-primary full-width" style="margin-top:12px" onclick="startQuiz()">📝 开始测验</button>';
  html += '</div>';

  var modal = document.getElementById('formulaModal');
  var title = document.getElementById('formulaModalTitle');
  var body = document.getElementById('formulaModalBody');
  if (!modal || !body) return;
  title.textContent = '线性代数测验';
  body.innerHTML = html;
  modal.classList.add('active');
}

function quizSelectAll(select) {
  for (var i = 1; i <= 6; i++) {
    var cb = document.getElementById('qz-ch-' + i);
    if (cb) cb.checked = select;
  }
}

function startQuiz() {
  var chs = [];
  for (var i = 1; i <= 6; i++) {
    var cb = document.getElementById('qz-ch-' + i);
    if (cb && cb.checked) chs.push(i);
  }
  if (chs.length === 0) { alert('请至少选择一章'); return; }

  // 从选中章节的kpDetails抽题
  var allQ = [];
  chs.forEach(function(chNum) {
    var ch = chaptersData.find(function(c){return c.courseId === 'la' && c.num === chNum;});
    if (!ch) return;
    ch.kps.forEach(function(kp, idx) {
      var detail = getKPDetail('la', chNum, idx);
      if (detail && detail.problems) {
        detail.problems.forEach(function(p, pi) {
          allQ.push({q: p.q, a: p.a, d: p.d, chapter: chNum, kp: idx, kpName: ch.kps[idx].name, qi: pi});
        });
      }
    });
  });

  if (allQ.length === 0) { alert('题库为空'); return; }

  // 随机打乱 + 限制题数（max 30）
  for (var j = allQ.length - 1; j > 0; j--) {
    var r = Math.floor(Math.random() * (j + 1));
    var t = allQ[j]; allQ[j] = allQ[r]; allQ[r] = t;
  }
  if (allQ.length > 30) allQ = allQ.slice(0, 30);

  quizState = { questions: allQ, answers: new Array(allQ.length).fill(''), started: Date.now() };
  showQuizPage();
}

function showQuizPage() {
  if (!quizState) return;
  quizState.currentIdx = 0;
  quizState.answers = [];
  quizState.total = quizState.questions.length;
  for (var i = 0; i < quizState.total; i++) quizState.answers.push('');

  renderQuizCard();
}

function renderQuizCard() {
  if (!quizState) return;
  var body = document.getElementById('formulaModalBody');
  var title = document.getElementById('formulaModalTitle');
  if (!body) return;
  var idx = quizState.currentIdx;
  var total = quizState.total;
  title.textContent = '测验（' + (idx + 1) + '/' + total + '）';

  // 答题卡
  var cardHtml = '<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:18px;justify-content:center">';
  for (var i = 0; i < total; i++) {
    var hasAnswer = quizState.answers[i] && quizState.answers[i].trim();
    var isCurrent = i === idx;
    var dotStyle = isCurrent
      ? 'background:#6366f1;color:#fff;border-color:#6366f1;transform:scale(1.15);box-shadow:0 2px 8px rgba(99,102,241,0.4)'
      : hasAnswer
        ? 'background:rgba(99,102,241,0.2);color:#a78bfa;border-color:rgba(99,102,241,0.5)'
        : 'background:transparent;color:var(--text-muted);border-color:var(--border)';
    cardHtml += '<div onclick="quizState.currentIdx=' + i + ';saveCurrentAnswer();renderQuizCard()" style="width:28px;height:28px;border-radius:6px;border:1.5px solid;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s;' + dotStyle + '">' + (i + 1) + '</div>';
  }
  cardHtml += '</div>';

  // 当前题目
  var qi = quizState.questions[idx];
  var diffLabel = {easy:'基础', medium:'中等', hard:'挑战'};
  var diffColor = qi.d === 'easy' ? '#10b981' : qi.d === 'medium' ? '#f59e0b' : '#ef4444';
  var progress = Math.round((idx + 1) / total * 100);
  var progressBar = '<div style="height:3px;background:var(--border);border-radius:2px;margin-bottom:16px"><div style="height:100%;width:' + progress + '%;background:linear-gradient(90deg,#6366f1,#8b5cf6);border-radius:2px;transition:width .3s"></div></div>';

  var qHtml = progressBar + cardHtml;
  qHtml += '<div style="padding:16px;background:var(--bg-card);border-radius:12px;border:1px solid var(--border);border-left:3px solid #6366f1">';
  qHtml += '<div style="display:flex;gap:8px;align-items:center;margin-bottom:10px">';
  qHtml += '<span style="font-size:11px;color:var(--text-muted);padding:2px 8px;background:var(--bg-input);border-radius:4px">第' + qi.chapter + '章 · ' + qi.kpName + '</span>';
  qHtml += '<span style="font-size:10px;padding:2px 7px;border-radius:4px;background:' + diffColor + '15;color:' + diffColor + '">' + diffLabel[qi.d] + '</span>';
  qHtml += '</div>';
  qHtml += '<div style="font-size:15px;color:var(--text-primary);line-height:1.6;margin-bottom:14px"><b>' + (idx + 1) + '.</b> ' + qi.q + '</div>';
  qHtml += '<textarea id="qz-a-current" placeholder="在此输入答案..." style="width:100%;height:80px;background:var(--bg-input);border:1px solid var(--border);border-radius:8px;color:var(--text-primary);padding:10px;font-size:14px;resize:vertical;font-family:inherit;line-height:1.5">' + (quizState.answers[idx] || '') + '</textarea>';
  qHtml += '</div>';

  // 导航按钮
  qHtml += '<div style="display:flex;gap:10px;margin-top:14px;align-items:center">';
  qHtml += '<button onclick="saveCurrentAnswer();quizState.currentIdx=0;renderQuizCard()" style="padding:8px 12px;background:var(--bg-input);border:1px solid var(--border);border-radius:8px;color:var(--text-secondary);cursor:pointer;font-size:12px">⏮ 首题</button>';
  qHtml += '<button onclick="saveCurrentAnswer();quizState.currentIdx=Math.max(0,quizState.currentIdx-1);renderQuizCard()" style="padding:8px 16px;background:var(--bg-input);border:1px solid var(--border);border-radius:8px;color:var(--text-secondary);cursor:pointer;font-size:12px">◀ 上一题</button>';
  qHtml += '<button onclick="saveCurrentAnswer();quizState.currentIdx=Math.min(' + (total-1) + ',quizState.currentIdx+1);renderQuizCard()"' + (idx === total-1 ? ' disabled' : '') + ' style="padding:8px 16px;background:var(--bg-input);border:1px solid var(--border);border-radius:8px;color:var(--text-secondary);cursor:pointer;font-size:12px;flex:1">下一题 ▶</button>';
  qHtml += '<button onclick="saveCurrentAnswer();quizState.currentIdx=' + (total-1) + ';renderQuizCard()" style="padding:8px 12px;background:var(--bg-input);border:1px solid var(--border);border-radius:8px;color:var(--text-secondary);cursor:pointer;font-size:12px">末题 ⏭</button>';
  qHtml += '</div>';

  // 交卷按钮
  var answered = quizState.answers.filter(function(a){return a && a.trim();}).length;
  qHtml += '<button onclick="saveCurrentAnswer();submitQuiz()" style="width:100%;padding:12px;margin-top:12px;background:linear-gradient(135deg,#10b981,#34d399);color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer">✅ 交卷（已答 ' + answered + '/' + total + ' 题）</button>';

  body.innerHTML = qHtml;
  // autofocus
  setTimeout(function(){var ta=document.getElementById('qz-a-current');if(ta)ta.focus();}, 100);
}

function saveCurrentAnswer() {
  if (!quizState) return;
  var el = document.getElementById('qz-a-current');
  if (el) quizState.answers[quizState.currentIdx] = el.value;
}

function submitQuiz() {
  if (!quizState) return;
  saveCurrentAnswer();
  var total = quizState.total;
  var correct = 0, wrongInfo = [];
  for (var i = 0; i < total; i++) {
    var userA = (quizState.answers[i] || '').trim();
    var stdA = quizState.questions[i].a;
    var ok = userA.replace(/\s/g,'') === stdA.replace(/\s/g,'') || userA === stdA;
    if (ok) correct++;
    else wrongInfo.push({idx: i, q: quizState.questions[i], user: userA, std: stdA});
  }
  var score = Math.round(correct / total * 100);
  var grade = score >= 90 ? '🏆 优秀！' : score >= 70 ? '👍 良好' : score >= 50 ? '📖 加油' : '💪 继续努力';

  var body = document.getElementById('formulaModalBody');
  var title = document.getElementById('formulaModalTitle');
  title.textContent = '测验结果';
  var html = '<div style="text-align:center;padding:20px 0">';
  html += '<div style="font-size:48px;font-weight:700;color:#6366f1">' + score + '</div>';
  html += '<div style="font-size:18px;color:var(--text-secondary);margin-top:4px">' + grade + '</div>';
  html += '<div style="font-size:14px;color:var(--text-muted);margin-top:8px">共 ' + total + ' 题 · 答对 ' + correct + ' 题</div>';
  html += '</div>';

  if (wrongInfo.length > 0) {
    html += '<div style="margin-top:16px"><button onclick="var p=document.getElementById(\'qz-review\');if(p.style.display==\'none\'){p.style.display=\'block\';this.textContent=\'▼ 收起错题回顾\';}else{p.style.display=\'none\';this.textContent=\'▶ 展开错题回顾 (' + wrongInfo.length + '题)\';}" style="width:100%;padding:8px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:8px;color:#ef4444;font-size:12px;cursor:pointer">▶ 展开错题回顾 (' + wrongInfo.length + '题)</button></div>';
    html += '<div id="qz-review" style="display:none;margin-top:12px">';
    wrongInfo.forEach(function(w) {
      html += '<div style="padding:12px;background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.15);border-radius:8px;margin-bottom:10px">';
      html += '<div style="font-size:13px;color:var(--text-primary);margin-bottom:8px"><b>Q:</b> ' + w.q.q + '</div>';
      html += '<div style="font-size:12px;color:#ef4444;margin-bottom:4px">✗ 你的答案: ' + (w.user || '未作答') + '</div>';
      html += '<div style="font-size:12px;color:#10b981">✓ 正确答案: ' + w.std + '</div>';
      html += '</div>';
    });
    html += '</div>';
  }
  body.innerHTML = html;
}

/* ═════ 可视化自动播放动画 ═════ */
var vizAnimState = null;

function toggleVizAnimation() {
  if (vizAnimState && vizAnimState.running) { stopVizAnimation(); return; }
  if (!state.currentKP || !state.currentChapter) return;
  var ch = state.currentChapter;
  var viz = vizTypes[ch.kps[ch.kps.indexOf(state.currentKP)].viz];
  if (!viz) return;
  vizAnimState = { running: true, frame: 0, startTime: Date.now(), ch: ch, viz: viz };
  var btn = document.getElementById('vizPlayBtn');
  var txt = document.getElementById('vizPlayText');
  var icon = document.getElementById('vizPlayIcon');
  if (btn) btn.classList.add('playing');
  if (txt) txt.textContent = '停止';
  if (icon) icon.innerHTML = '<rect x="5" y="5" width="14" height="14" rx="1"/>';
  if (typeof viz.animate !== 'function') {
    startGenericVizAnimation(viz);
  } else {
    viz.animate(function(p) {
      viz.params.forEach(function(param) {
        var slider = document.getElementById('viz-param-' + param.id);
        var valSpan = document.getElementById('viz-val-' + param.id);
        if (slider && p[param.id] !== undefined) {
          slider.value = p[param.id];
          valSpan.textContent = Number.isInteger(p[param.id]) ? p[param.id] : p[param.id].toFixed(2);
        }
      });
      viz.render(p);
    }, showVizAnimHint);
  }
}

function startGenericVizAnimation(viz) {
  if (!viz.params || viz.params.length === 0) {
    showVizAnimHint('该可视化无可调节参数'); stopVizAnimation(); return;
  }
  var t0 = Date.now();
  var msgs = ['观察数学对象随参数变化', '调整参数观察规律', '动画演示中…'];
  showVizAnimHint(msgs[0]);
  function loop() {
    if (!vizAnimState || !vizAnimState.running) return;
    var elapsed = (Date.now() - t0) / 1000;
    var p = {};
    viz.params.forEach(function(param, idx) {
      var mid = (param.max + param.min) / 2;
      var amp = (param.max - param.min) * 0.4;
      var val = mid + amp * Math.sin(elapsed * 1.2 + idx * 0.7);
      p[param.id] = Number(val.toFixed(3));
      var slider = document.getElementById('viz-param-' + param.id);
      var valSpan = document.getElementById('viz-val-' + param.id);
      if (slider) slider.value = p[param.id];
      if (valSpan) valSpan.textContent = Number.isInteger(p[param.id]) ? p[param.id] : p[param.id].toFixed(2);
    });
    viz.render(p);
    showVizAnimHint(msgs[Math.floor(elapsed / 2) % msgs.length]);
    vizAnimState.frame = requestAnimationFrame(loop);
  }
  loop();
}

function stopVizAnimation() {
  if (vizAnimState && vizAnimState.frame) cancelAnimationFrame(vizAnimState.frame);
  vizAnimState = null;
  var btn = document.getElementById('vizPlayBtn');
  var txt = document.getElementById('vizPlayText');
  var icon = document.getElementById('vizPlayIcon');
  if (btn) btn.classList.remove('playing');
  if (txt) txt.textContent = '自动播放';
  if (icon) icon.innerHTML = '<polygon points="6,4 20,12 6,20"/>';
  showVizAnimHint('');
}

function showVizAnimHint(msg) {
  var el = document.getElementById('vizAnimationHint');
  if (el) el.textContent = msg || '点击 ▶ 自动播放 观看动画演示';
}
