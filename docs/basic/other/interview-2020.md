# 前端面试梳理疑难杂症

## 事件循环

### 浏览器端

每次循环会先后执行两类任务，**task**和**microtask**，每一类任务都由一个队列组成，其中 task 主要包括如下几类任务：

- index.js(entry)
- setTimeout
- setInterval
- 网络 I/O

而 microtask 主要包括：

- promise
- MutationObserver

因此 microtask 的执行事件结点是在两次 task 执行间隙。

总结一下**浏览器端的事件队列**，共包括四个事件队列：

- task 队列
- requestAnimationFrame 队列
- requestIdleCallback 队列
- microtask 队列

![web](https://user-images.githubusercontent.com/19526072/78853148-c63bc680-7a50-11ea-8035-c932a48b6b3f.png)

javascript 脚本加载完成后首先执行第一个 task 队列任务，即初始化任务，然后执行所有 microtask 队列任务，接着再次执行第二个 task 队列任务，以此类推，这其中穿插着 60HZ 的渲染过程。

先执行谁后执行谁现在了解清楚了，可是到每个事件队列执行的轮次时，分别会有多少个事件出队执行呢？

在一次事件循环中：

- 普通 task 每次出队一项回调函数去执行
- requestAnimationFrame 每次出队所有当前队列的回调函数去执行（requestIdleCallback 一样）
- microtask 每次出队所有当前队列的回调函数以及自己轮次执行过程中又新增到队尾的回调函数。

这三种不同的调度方式正好覆盖了所有场景。

### node 端

node 端的 task 可以分为 4 类任务队列：

- index.js(entry)、setTimeout、setInterval
- 网络 I/O、fs(disk)、child_process
- setImmediate
- close 事件

而 microtask 包括：

- process.nextTick
- promise

![node](https://user-images.githubusercontent.com/19526072/78853190-dce21d80-7a50-11ea-8370-0c88813e0fda.png)

[javascript 事件循环(浏览器/node)](https://juejin.im/post/5c0cb3acf265da61362248f3)

## var、let 及 const 区别

- **函数提升**优先于**变量提升**，函数提升会把整个函数挪到作用域顶部，变量提升只会把声明挪到作用域顶部
- var 存在提升，我们能在声明之前使用。let、const 因为**暂时性死区**的原因，不能在声明前使用
- var 在全局作用域下声明变量会导致变量挂载在 **window** 上，其他两者不会
- let 和 const 作用基本一致，但是后者声明的变量不能再次赋值

## 在 ES5 环境下实现 let、const

babel 在 let 定义的变量前加了道下划线，避免在块级作用域外访问到该变量，除了对变量名的转换，我们也可以通过自执行函数来模拟块级作用域：

```js
(function() {
  for (var i = 0; i < 5; i++) {
    console.log(i); // 0 1 2 3 4
  }
})();

console.log(i); // Uncaught ReferenceError: i is not defined
```

实现 const 的关键在于`Object.defineProperty()`这个 API，这个 API 用于在一个对象上增加或修改属性。通过配置属性描述符，可以精确地控制属性行为。

```js
function _const(key, value) {
  const desc = {
    value,
    writable: false,
  };
  Object.defineProperty(window, key, desc);
}

_const("obj", { a: 1 }); //定义obj
obj.b = 2; //可以正常给obj的属性赋值
obj = {}; //抛出错误，提示对象read-only
```

## ES5 如何实现继承

### 原型链继承

直接让子类的原型对象指向父类实例，当子类实例找不到对应的属性和方法时，就会往它的原型对象，也就是父类实例上找，从而实现对父类的属性和方法的继承。

```js
function Parent() {
  this.name = "Yang";
}
Parent.prototype.getName = function() {
  return this.name;
};

function Child() {}
Child.prototype = new Parent();

var myself = new Child();

myself.getName(); // 'Yang'
```

问题：

- 引用类型的属性被所有实例共享
- 在创建 Child 的实例时，不能向 Parent 传参

### 构造函数模式

在子类的构造函数中执行父类的构造函数，并为其绑定子类的 this，让父类的构造函数把成员属性和方法都挂到子类的 this 上去，这样既能避免实例之间共享一个原型实例，又能向父类构造方法传参：

```js
function Parent(name) {
  this.name = name;
}
function Child(name) {
  Parent.call(this, name);
}
var myself1 = new Child("Yang");
var myself2 = new Child("Wang");

console.log(myself1.name); // 'Yang'
console.log(myself2.name); // 'Wang'
```

优点：

- 避免了引用类型的属性被所有实例共享
- 可以在 Child 中向 Parent 传参

缺点：

- 方法都在构造函数中定义，每次创建实例都会创建一遍方法

### 组合模式

构造函数模式与原型模式双剑合璧。

```js
function Parent(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
Parent.prototype.getName = function() {
  return this.name;
};

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}
Child.prototype = new Parent();
Child.prototype.constructor = Child;

var child1 = new Child("yang", 27);
child1.colors.push("white");

console.log(child1.name); // "yang"
console.log(child1.age); // 27
console.log(child1.colors); // ["red", "blue", "green", "white"]

var child2 = new Child("ming", 20);

console.log(child2.name); // "ming"
console.log(child2.age); // 20
console.log(child2.colors); // ["red", "blue", "green"]
child2.getName(); // "ming"
```

优点：融合原型链继承和构造函数的优点，是 JavaScript 中最常用的继承模式。

### 寄生组合式继承

组合继承最大的缺点是会调用两次父构造函数。

- 设置子类型实例的原型的时候：`Child.prototype = new Parent();`
- 创建子类型实例的时候：`Parent.call(this, name);`

```js
function object(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
}

function prototype(child, parent) {
  var prototype = object(parent.prototype);
  child.prototype.constructor = child;
  child.prototype = prototype;
}

prototype(Child, Parent);
```

引用《JavaScript 高级程序设计》中对寄生组合式继承的夸赞就是：

> 这种方式的高效率体现它只调用了一次 Parent 构造函数，并且因此避免了在 Parent.prototype 上面创建不必要的、多余的属性。与此同时，原型链还能保持不变；因此，还能够正常使用 instanceof 和 isPrototypeOf。开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。

参考资料：[JavaScript 深入之继承的多种方式和优缺点](https://github.com/mqyqingfeng/Blog/issues/16)

原型链继承，通过把子类实例的原型指向父类实例来继承父类的属性和方法，但原型链继承的缺陷在于对子类实例继承的引用类型的修改会影响到所有的实例对象以及无法向父类的构造方法传参。

因此我们引入了构造函数继承, 通过在子类构造函数中调用父类构造函数并传入子类 this 来获取父类的属性和方法，但构造函数继承也存在缺陷，构造函数继承不能继承到父类原型链上的属性和方法。

所以我们综合了两种继承的优点，提出了组合式继承，但组合式继承也引入了新的问题，它每次创建子类实例都执行了两次父类构造方法，我们通过将子类原型指向父类实例改为子类原型指向父类原型的浅拷贝来解决这一问题，也就是最终实现 —— 寄生组合式继承。

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
  a: 1,
};
// module 基本实现
var module = {
  id: "xxxx", // 我总得知道怎么去找到他吧
  exports: {}, // exports 就是个空对象
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
    },
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
  .then((res) => {
    console.log(res); // => 1
    return 2; // 包装成 Promise.resolve(2)
  })
  .then((res) => {
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
setInterval((timer) => {
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

## V8 如何执行一段 JS 代码

- 预解析：检查语法错误但不生成 AST
- 生成 AST：经过词法/语法分析，生成抽象语法树
- 生成字节码：基线编译器(Ignition)将 AST 转换成字节码
- 生成机器码：优化编译器(Turbofan)将字节码转换成优化过的机器码，此外在逐行执行字节码的过程中，如果一段代码经常被执行，那么 V8 会将这段代码直接转换成机器码保存起来，下一次执行就不必经过字节码，优化了执行速度

详细资料：[V8 是怎么跑起来的 —— V8 的 JavaScript 执行管道](https://juejin.im/post/5dc4d823f265da4d4c202d3b)

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

其他资料：

- [聊聊V8引擎的垃圾回收](https://juejin.im/post/5ad3f1156fb9a028b86e78be#heading-10)

## Git 相关知识

### 概念

Git 是**分布式版本控制系统**（DVCS）。它可以跟踪文件的更改，并允许你恢复到任何特定版本的更改。还有一个中央云存储库（远程存储库），开发人员可以向其提交更改，并与其他团队成员进行共享。

Git 使用 C 语言编写。 GIT 很快，C 语言通过减少运行时的开销来做到这一点。

### 如何还原已经 push 并公开的提交

删除或修复新提交中的错误文件，并将其推送到远程存储库。这是修复错误的最自然方式。对文件进行必要的修改后，将其提交到我将使用的远程存储库

```sh
git commit -m "commit message"
```

创建一个新的提交，撤消在错误提交中所做的所有更改。可以使用命令：

```sh
git revert <name of bad commit>
```

## 怎样将 N 次提交压缩成一次提交

**git reset**命令用于将当前 HEAD 复位到指定状态。一般用于撤消之前的一些操作(如：git add,git commit 等)。

如果要从头开始编写新的提交消息，请使用以下命令：

```sh
git reset –soft HEAD~3
git commit
```

如果你想在新的提交消息中串联现有的提交消息，那么需要提取这些消息并将它们传给 git commit，可以这样：

```sh
git reset –soft HEAD~3
git commit –edit -m"$(git log –format=%B –reverse .HEAD@{3})"
```

永久删除最后几个提交：

```sh
git commit ## 执行一些提交
# 最后三个提交(即HEAD, HEAD^和HEAD~2)提交有问题，想永久删除这三个提交
git reset --hard HEAD~3
```

### git pull 和 git fetch

- git pull 命令从中央存储库中提取特定分支的新更改或提交，并更新本地存储库中的目标分支。
- git fetch 也用于相同的目的，但它的工作方式略有不同。如果要在目标分支中反映这些更改，还需要 `git merge`

### 什么是 git stash

stash 会将你的工作目录，即修改后的跟踪文件和暂存的更改保存在一堆未完成的更改中，你可以随时重新应用这些更改。

`git stash drop` 命令用于删除隐藏的项目。默认情况下，它将删除最后添加的存储项，如果提供参数的话，它还可以删除特定项。

如果要从隐藏项目列表中删除特定的存储项目，可以使用以下命令：

`git stash list`：它将显示隐藏项目列表，如：

```sh
stash@{0}: WIP on master: 049d078 added the index file
stash@{1}: WIP on master: c264051 Revert “added file_size”
stash@{2}: WIP on master: 21d80a5 added number to log
```

如果要删除名为 `stash@{0}` 的项目，请使用命令 `git stash drop stash@{0}`。

### 如何找到特定提交中已更改的文件列表

要获取特定提交中已更改的列表文件，请使用以下命令：

```sh
git diff-tree -r {hash}
```

给定提交哈希，这将列出在该提交中更改或添加的所有文件。 **-r** 标志使命令列出单个文件，而不是仅将它们折叠到根目录名称中。

输出还将包含一些额外信息，可以通过包含两个标志把它们轻松的屏蔽掉：

```sh
git diff-tree –no-commit-id –name-only -r {hash}
```

这里 `-no-commit-id` 将禁止提交哈希值出现在输出中，而 `-name-only` 只会打印文件名而不是它们的路径。

### git config 的功能是什么

git config 命令可用来更改你的 git 配置，包括你的用户名。

```sh
# 获取当前用户的配置信息
git config --list
# 设置用户名
git config –global user.name "tao"
# 设置邮箱
git config –global user.email "istaotao@aliyun.com"
```

### 如何知道分支是否已合并为 master

```sh
# 列出了已合并到当前分支的分支
git branch –merged

# 列出了尚未合并的分支
git branch –no-merged
```

### 描述一下你所使用的分支策略

可以参考以下提到的要点：

- **功能分支**（Feature branching）
  要素分支模型将特定要素的所有更改保留在分支内。当通过自动化测试对功能进行全面测试和验证时，该分支将合并到主服务器中。

- **任务分支**（Task branching）
  在此模型中，每个任务都在其自己的分支上实现，任务键包含在分支名称中。很容易看出哪个代码实现了哪个任务，只需在分支名称中查找任务键。

- **发布分支**（Release branching）
  一旦开发分支获得了足够的发布功能，你就可以克隆该分支来形成发布分支。创建该分支将会启动下一个发布周期，所以在此之后不能再添加任何新功能，只有错误修复，文档生成和其他面向发布的任务应该包含在此分支中。一旦准备好发布，该版本将合并到主服务器并标记版本号。此外，它还应该再将自发布以来已经取得的进展合并回开发分支。

分支策略因团队而异，记住基本的分支操作，如删除、合并、检查分支等。

### 学习资料

- [2万字 | 前端基础拾遗90问](https://juejin.im/post/5e8b261ae51d4546c0382ab4)
- [关于 Git 的 20 个面试题](https://segmentfault.com/a/1190000019315509)
- [Git 教程](https://www.yiibai.com/git)

## 参考资料

- 掘金手册[前端面试之道](https://juejin.im/book/5bdc715fe51d454e755f75ef)
- 慕课网专栏[高薪之路—前端面试精选集](https://www.imooc.com/read/68)