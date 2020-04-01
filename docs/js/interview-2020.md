# 前端面试梳理疑难杂症

## var、let 及 const 区别

- **函数提升**优先于**变量提升**，函数提升会把整个函数挪到作用域顶部，变量提升只会把声明挪到作用域顶部
- var 存在提升，我们能在声明之前使用。let、const 因为**暂时性死区**的原因，不能在声明前使用
- var 在全局作用域下声明变量会导致变量挂载在 **window** 上，其他两者不会
- let 和 const 作用基本一致，但是后者声明的变量不能再次赋值

## 为什么要使用模块化

使用模块化可以给我们带来以下好处：

- 解决命名冲突
- 提供复用性
- 提高代码可维护性

### 立即执行函数

早期，使用**立即执行函数**实现模块化是常见的手段，通过函数作用域解决了命名冲突、污染全局作用域的问题

```js
(function(globalVariable) {
  globalVariable.test = function() {};
  // ... 声明各种变量、函数都不会污染全局作用域
})(globalVariable);
```

### AMD 和 CMD

```js
// AMD
define(["./a", "./b"], function(a, b) {
  // 加载模块完毕可以使用
  a.do();
  b.do();
});
// CMD
define(function(require, exports, module) {
  // 加载模块
  // 可以把 require 写在函数体的任意地方实现延迟加载
  var a = require("./a");
  a.doSomething();
});
```

### CommonJS

CommonJS 最早是 Node 在使用

```js
var module = require("./a.js");
module.a;
// 这里其实就是包装了一层立即执行函数，这样就不会污染全局变量了，
// 重要的是 module 这里，module 是 Node 独有的一个变量
module.exports = {
  a: 1
};
// module 基本实现
var module = {
  id: "xxxx", // 我总得知道怎么去找到他吧
  exports: {} // exports 就是个空对象
};
// 这个是为什么 exports 和 module.exports 用法相似的原因
var exports = module.exports;
var load = function(module) {
  // 导出的东西
  var a = 1;
  module.exports = a;
  return module.exports;
};
// 然后当我 require 的时候去找到独特的
// id，然后将要使用的东西用立即执行函数包装下，over
```

虽然 exports 和 module.exports 用法相似，但是不能对 exports 直接赋值。因为 `var exports = module.exports` 这句代码表明了 exports 和 module.exports 享有相同地址，通过改变对象的属性值会对两者都起效，但是如果直接对 exports 赋值就会导致两者不再指向同一个内存地址，修改并不会对 module.exports 起效。

### ES Module

ES Module 是原生实现的模块化方案，与 CommonJS 有以下几个区别:

- CommonJS 支持**动态导入**，也就是 `require(${path}/xx.js)`，后者目前不支持，但是已有提案
- CommonJS 是**同步导入**，因为用于服务端，文件都在本地，同步导入即使卡住主线程影响也不大。而后者是**异步导入**，因为用于浏览器，需要下载文件，如果也采用同步导入会对渲染有很大影响
- CommonJS 在导出时都是**值拷贝**，就算导出的值变了，导入的值也不会改变，所以如果想更新值，必须重新导入一次。但是 ES Module 采用**实时绑定**的方式，导入导出的值都指向同一个内存地址，所以导入值会跟随导出值变化
  ES Module 会编译成 `require/exports` 来执行的。

## Proxy 可以实现什么功能

Vue3.0 中将会通过 Proxy 来替换原本的 `Object.defineProperty` 来实现数据响应式。 Proxy 是 ES6 中新增的功能，它可以用来自定义对象中的操作。

```js
let p = new Proxy(target, handler);
```

- **target** 代表需要添加代理的对象
- **handler** 用来自定义对象中的操作，比如可以用来自定义 set 或者 get 函数。

接下来我们通过 Proxy 来实现一个数据响应式：

```js
let onWatch = (obj, setBind, getLogger) => {
  let handler = {
    get(target, property, receiver) {
      getLogger(target, property);
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      setBind(value, property);
      return Reflect.set(target, property, value);
    }
  };
  return new Proxy(obj, handler);
};

let obj = { a: 1 };
let p = onWatch(
  obj,
  (v, property) => {
    console.log(`监听到属性${property}改变为${v}`);
  },
  (target, property) => {
    console.log(`'${property}' = ${target[property]}`);
  }
);
p.a = 2; // 监听到属性a改变
p.a; // 'a' = 2
```

在上述代码中，我们通过自定义 set 和 get 函数的方式，在原本的逻辑中插入了我们的函数逻辑，实现了在对对象任何属性进行读写时发出通知。

当然这是简单版的响应式实现，如果需要实现一个 Vue 中的响应式，需要我们在 get 中收集依赖，在 set 派发更新，之所以 Vue3.0 要使用 Proxy 替换原本的 API 原因在于 Proxy 无需一层层递归为每个属性添加代理，一次即可完成以上操作，性能上更好，并且原本的实现有一些数据更新不能监听到，但是 Proxy 可以完美监听到任何方式的数据改变，唯一缺陷可能就是浏览器的兼容性不好了。

Proxy 无需一层层递归为每个属性添加代理，以下是实现代码：

```js
get(target, property, receiver) {
    getLogger(target, property)
    // 这句判断代码是新增的
    if (typeof target[property] === 'object' && target[property] !== null) {
        return new Proxy(target[property], handler);
    } else {
        return Reflect.get(target, property);
    }
}
```

## JS 异步编程及常考面试题

### 并发（concurrency）和并行（parallelism）区别

**并发**是宏观概念，我分别有任务 A 和任务 B，在**一段时间内**通过任务间的切换完成了这两个任务，这种情况就可以称之为并发。

**并行**是微观概念，假设 CPU 中存在两个核心，那么我就可以**同时**完成任务 A、B。同时完成多个任务的情况就可以称之为并行。

### 回调函数（Callback）的问题

回调地狱的根本问题就是：

- 嵌套函数存在耦合性，一旦有所改动，就会牵一发而动全身
- 嵌套函数一多，就很难处理错误
  当然，回调函数还存在着别的几个缺点，比如不能使用 `try catch` 捕获错误，不能直接 `return`。

### 你理解的 Generator 是什么

Generator 最大的特点就是可以控制函数的执行。

```js
function* foo(x) {
  let y = 2 * (yield x + 1);
  let z = yield y / 3;
  return x + y + z;
}
let it = foo(5);
console.log(it.next()); // => {value: 6, done: false}
console.log(it.next(12)); // => {value: 8, done: false}
console.log(it.next(13)); // => {value: 42, done: true}
```

分析：

- 首先 Generator 函数调用和普通函数不同，它会返回一个迭代器
- 当执行第一次 next 时，传参会被忽略，并且函数暂停在 `yield (x + 1)` 处，所以返回 `5 + 1 = 6`
- 当执行第二次 next 时，传入的参数等于上一个 yield 的返回值，如果你不传参，yield 永远返回 undefined。此时 `let y = 2 * 12`，所以第二个 yield 等于 `2 * 12 / 3 = 8`
- 当执行第三次 next 时，传入的参数会传递给 z，所以 `z = 13, x = 5, y = 24`，相加等于 42

### Promise 的特点是什么

**Promise** 翻译过来就是承诺的意思，这个承诺会在未来有一个确切的答复，并且该承诺有三种状态，分别是：

- 等待中（pending）
- 完成了 （resolved）
- 拒绝了（rejected）

这个承诺一旦从等待状态变成为其他状态就永远不能更改状态了，也就是说一旦状态变为 resolved 后，就不能再次改变。

Promise 实现了链式调用，也就是说每次调用 then 之后返回的都是一个 Promise，并且是一个全新的 Promise，原因也是因为状态不可变。如果你在 then 中 使用了 return，那么 return 的值会被 Promise.resolve() 包装：

```js
Promise.resolve(1)
  .then(res => {
    console.log(res); // => 1
    return 2; // 包装成 Promise.resolve(2)
  })
  .then(res => {
    console.log(res); // => 2
  });
```

一些**缺点**，比如无法取消 Promise，错误需要通过回调函数捕获。

### async 及 await 的特点

一个函数如果加上 async ，那么该函数就会返回一个 Promise 对象。async 就是将函数返回值使用 `Promise.resolve()` 包裹了下，和 then 中处理返回值一样，并且 await 只能配套 async 使用：

```js
async function test() {
  let value = await sleep();
}
console.log(test()); // Promise {<pending>}
```

async 和 await 可以说是异步终极解决方案了，相比直接使用 Promise 来说，优势在于处理 then 的调用链，能够更清晰准确的写出代码，毕竟写一大堆 then 也很恶心，并且也能优雅地解决回调地狱问题。当然也存在一些缺点，因为 await 将异步代码改造成了同步代码，如果多个异步代码没有依赖性却使用了 await 会导致性能上的降低。

await 内部实现了 generator，其实 await 就是 generator 加上 Promise 的语法糖，且内部实现了自动执行 generator。如果你熟悉 co 的话，其实自己就可以实现这样的语法糖。

### 常用定时器函数

常见的定时器函数有 setTimeout、setInterval、requestAnimationFrame。

[window.requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/window/requestAnimationFrame)你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。你可以传这个值给 window.cancelAnimationFrame() 以取消回调函数。

```js
function setInterval(callback, interval) {
  let timer;
  const now = Date.now;
  let startTime = now();
  let endTime = startTime;
  const loop = () => {
    timer = window.requestAnimationFrame(loop);
    endTime = now();
    if (endTime - startTime >= interval) {
      startTime = endTime = now();
      callback(timer);
    }
  };
  timer = window.requestAnimationFrame(loop);
  return timer;
}

let a = 0;
setInterval(timer => {
  console.log(1);
  a++;
  if (a === 3) cancelAnimationFrame(timer);
}, 1000);
```

**requestAnimationFrame** 自带函数节流功能，基本可以保证在 16.6 毫秒内只执行一次（不掉帧的情况下），并且该函数的延时效果是精确的，没有其他定时器时间不准的问题。

## 进程与线程

- **进程**描述了 CPU 在运行指令及加载和保存上下文所需的时间，放在应用上来说就代表了一个程序。
- **线程**是进程中的更小单位，描述了执行一段指令所需的时间。

### 进程

**浏览器是多进程**，再来看看它到底包含哪些进程：（为了简化理解，仅列举主要进程）

**Browser 进程**：浏览器的主进程（负责协调、主控），只有一个。作用有

- 负责浏览器界面显示，与用户交互。如前进，后退等
- 负责各个页面的管理，创建和销毁其他进程
- 将 Renderer 进程得到的内存中的 Bitmap，绘制到用户界面上
- 网络资源的管理，下载等

**第三方插件进程**：每种类型的插件对应一个进程，仅当使用该插件时才创建

**GPU 进程**：最多一个，用于 3D 绘制等

**浏览器渲染进程**（浏览器内核）（Renderer 进程，内部是多线程的）：默认每个 Tab 页面一个进程，互不影响。主要作用为：页面渲染，脚本执行，事件处理等

### 线程

当你打开一个 Tab 页时，其实就是创建了一个进程，一个进程中可以有多个线程，比如渲染线程、JS 引擎线程、HTTP 请求线程等等。当你发起一个请求时，其实就是创建了一个线程，当请求结束后，该线程可能就会被销毁。

在 JS 运行的时候可能会阻止 UI 渲染，这说明了两个线程是互斥的。这其中的原因是因为 JS 可以修改 DOM，如果在 JS 执行的时候 UI 线程还在工作，就可能导致不能安全的渲染 UI。这其实也是一个单线程的好处，得益于 JS 是单线程运行的，可以达到节省内存，节约上下文切换时间，没有锁的问题的好处。

文章：[从浏览器多进程到 JS 单线程，JS 运行机制最全面的一次梳理](https://juejin.im/post/5a6547d0f265da3e283a1df7#heading-11)。

## Event Loop

文章：[10 分钟理解 JS 引擎的执行机制](https://segmentfault.com/a/1190000012806637)

## 手写 call、apply 及 bind 函数

```js
Function.prototype.myCall = function(context) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  context = context || window;
  context.fn = this;
  const args = [...arguments].slice(1);
  const result = context.fn(...args);
  delete context.fn;
  return result;
};
```

```js
Function.prototype.myApply = function(context) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  context = context || window;
  context.fn = this;
  let result;
  // 处理参数和 call 有区别
  if (arguments[1]) {
    result = context.fn(...arguments[1]);
  } else {
    result = context.fn();
  }
  delete context.fn;
  return result;
};
```

```js
Function.prototype.myBind = function(context) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  const _this = this;
  const args = [...arguments].slice(1);
  // 返回一个函数
  return function F() {
    // 因为返回了一个函数，我们可以 new F()，所以需要判断
    if (this instanceof F) {
      return new _this(...args, ...arguments);
    }
    return _this.apply(context, args.concat(...arguments));
  };
};
```

## new 的原理

在调用 new 的过程中会发生以上四件事情：

1. 新生成了一个对象
1. 链接到原型
1. 绑定 this
1. 返回新对象

```js
function create() {
  let obj = {};
  let Con = [].shift.call(arguments);
  obj.__proto__ = Con.prototype;
  let result = Con.apply(obj, arguments);
  return result instanceof Object ? result : obj;
}
```

## instanceof 的原理

instanceof 可以正确的判断对象的类型，因为内部机制是通过判断对象的原型链中是不是能找到类型的 prototype。

```js
function myInstanceof(left, right) {
  let prototype = right.prototype;
  left = left.__proto__;
  while (true) {
    if (left == null) return false;
    if (prototype === left) return true;
    left = left.__proto__;
  }
}
```

## 为什么 `0.1 + 0.2 != 0.3`

因为 JS 采用 IEEE 754 双精度版本（64 位），并且只要采用 IEEE 754 的语言都有该问题。

我们都知道计算机是通过二进制来存储东西的，那么 0.1 在二进制中会表示为：

```js
// (0011) 表示循环
0.1 = 2 ^ (-4 * 1.10011(0011));
```

我们可以发现，0.1 在二进制中是无限循环的一些数字，其实不只是 0.1，其实很多十进制小数用二进制表示都是无限循环的。这样其实没什么问题，但是 JS 采用的浮点数标准却会裁剪掉我们的数字。

IEEE 754 双精度版本（64 位）将 64 位分为了三段：

- 第一位用来表示符号
- 接下去的 11 位用来表示指数
- 其他的位数用来表示有效位，也就是用二进制表示 0.1 中的 10011(0011)

那么这些循环的数字被裁剪了，就会出现精度丢失的问题，也就造成了 0.1 不再是 0.1 了，而是变成了 0.100000000000000002

```js
0.100000000000000002 === 0.1; // true
```

那么同样的，0.2 在二进制也是无限循环的，被裁剪后也失去了精度变成了 0.200000000000000002

```js
0.200000000000000002 === 0.2; // true
```

所以这两者相加不等于 0.3 而是 0.300000000000000004

```js
0.1 + 0.2 === 0.30000000000000004; // true
```

那么可能你又会有一个疑问，既然 0.1 不是 0.1，那为什么 `console.log(0.1)` 却是正确的呢？

因为在输入内容的时候，二进制被转换为了十进制，十进制又被转换为了字符串，在这个转换的过程中发生了取近似值的过程，所以打印出来的其实是一个近似值，你也可以通过以下代码来验证

```js
console.log(0.100000000000000002); // 0.1
```

怎么解决这个问题？其实解决的办法有很多，这里我们选用原生提供的方式来最简单的解决问题：

```js
// toFixed() 方法使用定点表示法来格式化一个数值
parseFloat((0.1 + 0.2).toFixed(10)) === 0.3; // true
```

## V8 下的垃圾回收机制是怎么样的

V8 实现了准确式 GC，GC 算法采用了分代式垃圾回收机制。因此，V8 将内存（堆）分为新生代和老生代两部分。

### 新生代算法

新生代中的对象一般存活时间较短，使用 **Scavenge GC 算法**。

在新生代空间中，内存空间分为两部分，分别为 From 空间和 To 空间。在这两个空间中，必定有一个空间是使用的，另一个空间是空闲的。新分配的对象会被放入 From 空间中，当 From 空间被占满时，新生代 GC 就会启动了。算法会检查 From 空间中存活的对象并复制到 To 空间中，如果有失活的对象就会销毁。当复制完成后将 From 空间和 To 空间互换，这样 GC 就结束了。

### 老生代算法

老生代中的对象一般存活时间较长且数量也多，使用了两个算法：

- 标记清除算法
- 标记压缩算法

在讲算法前，先来说下什么情况下对象会出现在老生代空间中：

新生代中的对象是否已经经历过一次 Scavenge 算法，如果经历过的话，会将对象从新生代空间移到老生代空间中。
To 空间的对象占比大小超过 25 %。在这种情况下，为了不影响到内存分配，会将对象从新生代空间移到老生代空间中。

老生代中的空间很复杂，有如下几个空间：

```js
enum AllocationSpace {
  // TODO(v8:7464): Actually map this space's memory as read-only.
  RO_SPACE,    // 不变的对象空间
  NEW_SPACE,   // 新生代用于 GC 复制算法的空间
  OLD_SPACE,   // 老生代常驻对象空间
  CODE_SPACE,  // 老生代代码对象空间
  MAP_SPACE,   // 老生代 map 对象
  LO_SPACE,    // 老生代大空间对象
  NEW_LO_SPACE,  // 新生代大空间对象

  FIRST_SPACE = RO_SPACE,
  LAST_SPACE = NEW_LO_SPACE,
  FIRST_GROWABLE_PAGED_SPACE = OLD_SPACE,
  LAST_GROWABLE_PAGED_SPACE = MAP_SPACE
};
```

在老生代中，以下情况会先启动标记清除算法：

- 某一个空间没有分块的时候
- 空间中被对象超过一定限制
- 空间不能保证新生代中的对象移动到老生代中

在这个阶段中，会遍历堆中所有的对象，然后标记活的对象，在标记完成后，销毁所有没有被标记的对象。

在标记大型对内存时，可能需要几百毫秒才能完成一次标记。

这就会导致一些性能上的问题。为了解决这个问题，2011 年，V8 从 stop-the-world 标记切换到增量标志。在增量标记期间，GC 将标记工作分解为更小的模块，可以让 JS 应用逻辑在模块间隙执行一会，从而不至于让应用出现停顿情况。

但在 2018 年，GC 技术又有了一个重大突破，这项技术名为并发标记。该技术可以让 GC 扫描和标记对象时，同时允许 JS 运行。

清除对象后会造成堆内存出现碎片的情况，当碎片超过一定限制后会启动**压缩算法**。在压缩过程中，将活的对象像一端移动，直到所有对象都移动完成然后清理掉不需要的内存。

## 参考资料

- 掘金手册[前端面试之道](https://juejin.im/book/5bdc715fe51d454e755f75ef)
- 慕课网专栏[高薪之路—前端面试精选集](https://www.imooc.com/read/68)
