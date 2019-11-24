# 学习冴羽的 JS 深入系列简要总结

## 从原型到原型链

### 图示总结

`prototype`：每一个函数都有一个`prototype`属性，该属性指向了一个对象，此对象为调用该函数而创建的实例的原型

![构造函数和实例原型的关系图](https://ae01.alicdn.com/kf/Hacfcf286c7a7419db3e4c0932fb535923.png)

`__proto__`：每一个对象（除 null）都具有一个属性：`__proto__`，这个属性指向该对象的原型

![实例与实例原型的关系图](https://ae01.alicdn.com/kf/H0167f64ea5a14d00977d7347f3771ce7T.png)

`constructor`：每个原型都有一个`constructor`属性指向关联的构造函数

![constructor](https://ae01.alicdn.com/kf/Hb2d428716f6341b58ac36eefd3ab7398b.png)

`Object`：原型对象是通过 `Object` 构造函数生成的，最后`Object.prototype.__proto__ = null`

![原型链示意图](https://ae01.alicdn.com/kf/H162bf41c88784952a445c19c5ce3159e5.png)

原型链：由相互关联的原型(**proto**)组成的链状结构就是原型链，即图中蓝色的这条线

![原型链](https://ae01.alicdn.com/kf/H46dd0d5cd87243f4beb2d4c3e974a1e5K.png)

### 代码总结

每个函数都有一个 prototype 属性

```js
function Person() {}

Person.prototype.name = "Jake";
var person1 = new Person();
var person2 = new Person();
person1.name; // 'Jake'
person2.name; // 'Jake'
```

每一个 JavaScript 对象(除了 null )都具有的一个属性，叫**proto**，这个属性会指向该对象的原型。

构造函数的 prototype 属性，指向了调用该构造函数而创建的实例的原型 person.**proto**

```js
person.__proto__ === Person.prototype; // true
```

每个原型都有一个 constructor 属性指向关联的构造函数

```js
Person.prototype.constructor === Person; // true
```

原型对象就是通过 Object 构造函数生成的

```js
Person.prototype.__proto__ === Object.prototype; // true
```

Object.prototype.**proto** 的值为 null，即 Object.prototype 没有原型，终止查找

```js
Object.prototype.__proto__; // null
```

原文地址：[JavaScript 深入之从原型到原型链](https://github.com/mqyqingfeng/Blog/issues/2)

## 词法作用域和动态作用域

javascript 采用的是`词法作用域(lexical scoping)`，函数的作用域是在函数定义的时候就决定了，而不是调用的时候才决定

- 词法作用域，即静态作用域，函数的作用域在函数定义的时候就决定了
- 动态作用域，函数的作用域是在函数调用的时候才决定

```js
var scope = "global scope";
function checkscope() {
  var scope = "local scope";
  function f() {
    return scope;
  }
  return f();
}
checkscope(); // "local scope"
```

```js
var scope = "global scope";
function checkscope() {
  var scope = "local scope";
  function f() {
    return scope;
  }
  return f;
}
checkscope()(); // "local scope"
```

因为 JavaScript 采用的是词法作用域，函数的作用域基于函数创建的位置。

而引用《JavaScript 权威指南》的回答就是：

JavaScript 函数的执行用到了作用域链，这个作用域链是在函数定义的时候创建的。嵌套的函数 f() 定义在这个作用域链里，其中的变量 scope 一定是局部变量，不管何时何地执行函数 f()，这种绑定在执行 f() 时依然有效。

原文链接：[JavaScript 深入之词法作用域和动态作用域](https://github.com/mqyqingfeng/Blog/issues/3)

## 执行上下文栈

JavaScript 的可执行代码(executable code)的类型有哪些：

- 全局代码
- 函数代码
- eval 代码

函数那么多，如何管理创建的那么多执行上下文呢？

所以 JavaScript 引擎创建了执行上下文栈（`Execution context stack，ECS`）来管理执行上下文。

当执行一个函数的时候，就会创建一个`执行上下文(execution context)`，并且压入`执行上下文栈(Execution context stack, ESC)`

当函数执行完毕的时候，会将函数的`执行上下文栈`中弹出。

其实，这里就会联想到 `push pop 栈堆`(后进先出-LIFO)。

模拟执行上下文栈：

```js
// 执行上下文栈是一个数组 ECStack，整个应用程序结束的时候，才会被清空
ECStack = [
  // 程序结束之前， ECStack 最底部永远有个 globalContext
  globalContext // 全局执行上下文
];
```

运行如下代码：

```js
function fun3() {
  console.log("fun3");
}

function fun2() {
  fun3();
}

function fun1() {
  fun2();
}

fun1();
```

伪代码模拟执行：(根据 push pop 原理，后进先出)

```js
ECStack.push(<fun1> functionContext);  // 压入fun1上下文，发现了 fun2 被调用
ECStack.push(<fun2> functionContext);  // 继续压入fun2上下文，发现了 fun3 被调用
ECStack.push(<fun3> functionContext);  // 继续压入fun3上下文，并执行 fun3
ECStack.pop();  // fun3 执行结束，并弹出
ECStack.pop();  // fun2 执行结束，并弹出
ECStack.pop();  // fun1 执行结束，并弹出
// javascript接着执行下面的代码，但是ECStack底层永远有个globalContext
```

原文链接：[JavaScript 深入之执行上下文栈](https://github.com/mqyqingfeng/Blog/issues/4)

## 变量对象

1、全局上下文的变量对象初始化：全局对象

2、函数上下文的变量对象初始化：只包括`Arguments`对象

3、进入执行上下文时：给变量对象添加形参、函数声明、变量声明等初始的属性值

4、代码执行阶段：再次修改变量对象的属性值

### 执行过程

执行上下文过程可分为：进入执行上下文和代码执行（分析-执行）

```js
function foo(a) {
  var b = 2;
  function c() {}
  var d = function() {};

  b = 3;
}

foo(1);
```

进入执行上下文过程：

```js
AO = {
  arguments: {
    0: 1,
    length: 1
  },
  a: 1,
  b: undefined,
  c: reference function c() {},
  d: undefined
}
```

代码执行阶段：

```js
AO = {
  arguments: {
    0: 1,
    length: 1
  },
  a: 1,
  b: 3,
  c: reference function c() {},
  d: reference to FunctionExpression "d"
}
```

总结：未进入执行阶段之前，`变量对象(VO)`中的属性都不能访问！但是进入执行阶段之后，`变量对象(VO)`转变为了`活动对象(AO)`，里面的属性都能被访问了，然后开始进行执行阶段的操作。它们其实都是同一个对象，只是处于执行上下文的不同生命周期。

最后，函数是“第一等公民”，记住这个，变量名称和函数名称相同的声明，优先执行函数声明。

原文链接：[JavaScript 深入之变量对象](https://github.com/mqyqingfeng/Blog/issues/5)

## 作用域

对于每个执行上下文，都有三个重要属性：

- 变量对象(Variable object，VO)
- 作用域链(Scope chain)
- this

下面让我们以一个函数的创建和激活两个时期来讲解作用域链是如何创建和变化的。

### 函数创建

由上节内容可知：函数的作用域在函数定义的时候就决定了。

这是因为函数有一个内部属性 [[scope]]，当函数创建的时候，就会保存所有父变量对象到其中，你可以理解 [[scope]] 就是所有父变量对象的层级链，但是注意：[[scope]] 并不代表完整的作用域链！

如：

```js
function foo() {
  function bar() {}
}

// 各自的 [[scope]]:
foo.[[scope]] = [
  globalContext.VO
];
bar.[[scope]] = [
  fooContext.AO   // 保存父变量
  globalContext.VO
]
```

### 函数激活

当函数激活时，进入函数上下文，创建 VO/AO 后，就会将活动对象添加到作用链的前端。

这时候执行上下文的作用域链，我们命名为 Scope：

```js
Scope = [AO].concat([[Scope]]);
```

至此，作用域链创建完毕。

### 综合分析

以下面的例子为例，结合着之前讲的变量对象和执行上下文栈，我们来总结一下函数执行上下文中作用域链和变量对象的创建过程：

```js
var scope = "global scope";
function checkscope() {
  var scope2 = "local scope";
  return scope2;
}
checkscope();
```

执行过程如下：

1.checkscope 函数被创建，保存作用域链到 内部属性[[scope]]

```js
checkscope.[[scope]] = [
    globalContext.VO
];
```

2.执行 checkscope 函数，创建 checkscope 函数执行上下文，checkscope 函数执行上下文被压入执行上下文栈

```js
ECStack = [checkscopeContext, globalContext];
```

3.checkscope 函数并不立刻执行，开始做准备工作，第一步：复制函数[[scope]]属性创建作用域链

```js
checkscopeContext = {
    Scope: checkscope.[[scope]],
}
```

4.第二步：用 arguments 创建活动对象，随后初始化活动对象，加入形参、函数声明、变量声明

```js
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope2: undefined
    }，
    Scope: checkscope.[[scope]],
}
```

5.第三步：将活动对象压入 checkscope 作用域链顶端

```js
checkscopeContext = {
  AO: {
    arguments: {
      length: 0
    },
    scope2: undefined
  },
  Scope: [AO, [[Scope]]]
};
```

6.准备工作做完，开始执行函数，随着函数的执行，修改 AO 的属性值

```js
checkscopeContext = {
  AO: {
    arguments: {
      length: 0
    },
    scope2: "local scope"
  },
  Scope: [AO, [[Scope]]]
};
```

7.查找到 scope2 的值，返回后函数执行完毕，函数上下文从执行上下文栈中弹出

```js
ECStack = [globalContext];
```

原文链接：[JavaScript 深入之作用域链](https://github.com/mqyqingfeng/Blog/issues/6)

## 从 ECMAScript 规范解读 this

作者曰：在写文章之初，我就面临着这些问题，最后还是放弃从多个情形下给大家讲解 this 指向的思路，而是追根溯源的从 ECMASciript 规范讲解 this 的指向，尽管从这个角度写起来和读起来都比较吃力，但是一旦多读几遍，明白原理，绝对会给你一个全新的视角看待 this 。

原文链接：[JavaScript 深入之从 ECMAScript 规范解读 this](https://github.com/mqyqingfeng/Blog/issues/7)

## 执行上下文

对于每个执行上下文，都有三个重要属性：

- 变量对象(Variable object，VO)
- 作用域链(Scope chain)
- this

原文链接：[JavaScript 深入之执行上下文](https://github.com/mqyqingfeng/Blog/issues/8)

## 闭包

闭包是指那些能够访问自由变量的函数。

自由变量是指在函数中使用的，但既不是参数也不是函数的局部变量的变量。

那么，闭包 = 函数 + 函数能够访问的自由变量。

看这道刷题必刷，面试必考的闭包题：

```js
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = function() {
    console.log(i);
  };
}

data[0]();
data[1]();
data[2]();
```

循环结束后

```js
data[0] = function() {
  console.log(i);
};
data[1] = function() {
  console.log(i);
};
data[2] = function() {
  console.log(i);
};
```

执行`data[0]()，data[1]()，data[2]()`时，i=3,所以都打印 3

让我们改成闭包看看：

```js
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = (function(i) {
    return function() {
      console.log(i);
    };
  })(i);
}

data[0]();
data[1]();
data[2]();
```

原文链接：[JavaScript 深入之闭包](https://github.com/mqyqingfeng/Blog/issues/9)

## 参数按值传递

ECMAScript 中所有函数的参数都是按值传递的。 --- 《JavaScript 高级程序设计-第三版》

即，把函数外部的值复制给函数内部的参数，就和把值从一个变量复制给另一个变量一样。

但是通俗地理解，参数如果是基本类型是按值传递，参数如果是引用类型就按共享传递。

共享传递是指，在传递对象的时候，传递对象的引用的副本。

代码演示：

```js
// 参数是基本类型
var value = 1;
function foo(v) {
  v = 2;
  console.log(v); //2
}
foo(value);
console.log(value); // 1

// 参数是引用类型
var obj = {
  value: 1
};
function foo(o) {
  o.value = 2;
  console.log(o.value); //2
}
foo(obj);
console.log(obj.value); // 2
```

原文链接：[JavaScript 深入之参数按值传递](https://github.com/mqyqingfeng/Blog/issues/10)

## call 和 apply 的模拟实现

### call

`call()`在使用一个指定的 this 值和若干个指定的参数值的前提下，调用某个函数或方法。该方法的语法和作用与 apply() 方法类似，只有一个区别，就是 call() 方法接受的是一个参数列表，而 apply() 方法接受的是一个包含多个参数的数组。

使用 call 方法调用函数并且指定上下文的 'this'

```js
var value = 1;
var obj = {
  value: 2
};
function foo() {
  console.log(this.value);
}
foo(); // 1
foo.call(obj); // 2
```

使用 call 方法调用父构造函数

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}
function Tao(name, age, job) {
  Person.call(this, name, age);
  this.job = job;
}
var tao = new Tao("yangtao", 27, "Teacher");
```

所以我们模拟的步骤可以分为：

- 将函数设为对象的属性
- 执行该函数
- 删除该函数

```js
// 类似于：
var foo = {
  value: 1,
  bar: function() {
    return this.value;
  }
};
foo.bar(); // 1

// 第一步
foo.fn = bar;
// 第二步
foo.fn();
// 第三步
delete foo.fn;
```

第一版：绑定 this

```js
Function.prototype.mycall = function(context) {
  context.fn = this;
  context.fn();
  delete context.fn;
};
// 测试一下
var foo = {
  value: 1
};

function bar() {
  console.log(this.value);
}

bar.mycall(foo); // 1

// 如下所示
var foo = {
  value: 1,
  bar: function() {
    console.log(this.value);
  }
};
foo.bar();
```

第二版：给定参数

```js
Function.prototype.mycall = function(context, name, age) {
  context.fn = this;
  context.fn();
  var args = [];
  for (var i = 1, l = arguments.length; i < l; i++) {
    args.push("arguments[" + i + "]");
  }
  eval("context.fn(" + args + ")");
  delete context.fn;
};
```

第三版：传参为 null 和返回结果

```javascript
Function.prototype.mycall = function(context) {
  var context = context || window;
  //获取调用call的函数，用this可以获取
  context.fn = this;
  var args = []; // ["arguments[1]", "arguments[2]"]
  for (var i = 1, l = arguments.length; i < l; i++) {
    args.push("arguments[" + i + "]");
  }
  // 把传给call的参数传递给了context.fn函数
  // context.fn(args.join(','));
  // context.fn(...args)
  var result = eval("context.fn(" + args + ")");
  delete context.fn;
  return result;
};
```

第四版：考虑 context，以及 context.fn 的可能性

```js
Function.prototype.mycall = function(context) {
  // 这一步如果不强制是 object 类型，可以省略
  if (typeof context != "object") {
    throw new Error("Arguments error");
  }

  var context = context || window;
  var args = [],
    reslut;

  if ("fn" in context && context.hasOwnProperty("fn")) {
    var fn = context.fn;
    var fnFlag = true;
  }

  context.fn = this;

  for (var i = 1, l = arguments.length; i < l; i++) {
    args.push("arguments[" + i + "]");
  }

  result = eval("context.fn(" + args + ")");

  if (fnFlag) {
    context.fn = fn;
  } else {
    delete context.fn;
  }

  return result;
};
```

### apply

`apply()`同`call()`，只不过将多个参数值，以数组的形式传入而已。

用 apply 将数组添加到另一个数组：

```js
var arr = ["a", "b"];
var arr2 = [1, 2];
arr.push.apply(arr, arr2);
console.log(arr); // ["a", "b", 1, 2]
```

使用 apply 和内置函数：

```js
var nums = [1, 10, 3, 6, 2];
var max = Math.max.apply(null, nums); // 10
var min = Math.min.apply(null, nums); // 1

// ES6 写法：
var max = Math.max(...nums); // 10
var min = Math.min(...nums); // 1
```

```javascript
Function.prototype.myapply = function(context, arr) {
  var context = context || window;
  var reslut;

  context.fn = this;

  if (!arr) {
    reslut = context.fn();
  } else {
    var args = [];
    for (var i = 0, l = arr.length; i < l; i++) {
      args.push("arr[" + i + "]");
    }
    eval("context.fn(" + args + ")");
  }

  delete context.fn;
  return reslut;
};
```

原文链接：[JavaScript 深入之 call 和 apply 的模拟实现](https://github.com/mqyqingfeng/Blog/issues/11)

## bind 的模拟实现

> `bind()`方法会创建一个新函数。当这个新函数被调用，bind()第一个参数将作为它运行时的 this，之后的一系列参数将会在传递的实参前传入，作为它的参数。 --- 来自于 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

创建绑定函数

```js
var value = 1;
var obj = {
  value: 2,
  getValue: function() {
    return this.value;
  }
};
var getV = obj.getValue;
getV(); // 1
var getV2 = obj.getValue.bind(obj);
getV2(); // 2
```

配合 setTimeout

```js
var value = 1;
function Fn() {
  this.value = 2;
}
Fn.prototype.getValue = function() {
  // setTimeout(this.msg, 1000);  // 1
  setTimeout(this.msg.bind(this), 1000); //2
};
Fn.prototype.msg = function() {
  console.log("value: ", this.value);
};
var myFn = new Fn();
myFn.getValue();
```

由此我们可以首先得出 bind 函数的两个特点：

- 返回一个函数
- 可以传入参数

第一版：返回函数

```js
Function.prototype.mybind = function(context) {
  var self = this;
  return function() {
    return self.apply(context);
  };
};
var obj = {
  value: 1
};
function foo() {
  return this.value;
}
var bindFoo = foo.mybind(obj);
bindFoo(); //1
```

第二版：传参

```js
Function.prototype.mybind = function(context) {
  var self = this;
  // 获取除了第一个参数的剩余参数
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    // 这里获取的是返回函数调用时传入的参数
    var bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(context, args.concat(bindArgs));
  };
};
var obj = {
  value: 1
};
function foo(name, age) {
  console.log(this.value);
  console.log(name);
  console.log(age);
}
var bindFoo = foo.mybind(obj, "yang");
bindFoo(27);
// 1
// yang
// 27
```

第三版：构造函数效果

当 bind 返回的函数作为构造函数的时候，bind 时指定的 this 值会失效，但传入的参数依然生效。

```js
```

原文链接：[JavaScript 深入之 bind 的模拟实现](https://github.com/mqyqingfeng/Blog/issues/12)

## new 的模拟实现

new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象类型之一。

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.habit = "Games";
}

Person.prototype.getName = function() {
  console.log("I am " + this.name);
};

var person1 = new Person("Yang", "27");

console.log(person1.name); // Yang
console.log(person1.habit); // Games

person1.getName(); // I am Yang
```

由上可知，实例 person1 可以：

- 访问到 Person 构造函数里的属性
- 访问到 Person.prototype 中的属性

原文链接：[JavaScript 深入之 new 的模拟实现](https://github.com/mqyqingfeng/Blog/issues/13)

## 类数组对象与 arguments

类数组对象从读写、获取长度、遍历三个方面看，和数组貌似是一样的，但是无法直接使用数组的方法，需要借助 call 或 apply：

```js
var likeArr = {
  0: "a",
  1: "b",
  2: "c",
  length: 3
};

Array.prototype.slice.call(likeArr, 0); // ["a", "b", "c"]
Array.prototype.join.call(likeArr, "&"); // "a&b&c"
Array.prototype.map.call(likeArr, item => item.toUpperCase()); // ["A", "B", "C"]
```

### 类数组转数组

```js
// slice
Array.prototype.slice.call(likeArr);
// ES6
Array.from(likeArr);
// apply
Array.prototype.concat.apply([], likeArr);
// splice，会改变 linkeArr
Array.prototype.splice.call(likeArr, 0);
```

### Arguments

`Arguments` 对象只定义在函数体中，包括了函数的参数和其他属性。在函数体中，arguments 指代该函数的 Arguments 对象。

Arguments 对象的 length 属性，表示实参的长度。

Arguments 对象的 callee 属性，通过它可以调用函数自身。

将参数从一个函数传递到另一个函数：

```js
// 使用 apply 将 foo 的参数传递给 bar
function foo() {
  bar.apply(this, arguments);
}
function bar(a, b, c) {
  console.log(a, b, c);
}

foo(1, 2, 3);
```

使用 ES6 的`...`运算符，我们可以轻松转成数组。

```js
function func(...arguments) {
  console.log(arguments); // [1, 2, 3]
}

func(1, 2, 3);
```

arguments 的应用其实很多，如果要总结这些场景的话，暂时能想到的包括：

- 参数不定长
- 函数柯里化
- 递归调用
- 函数重载

原文链接：[JavaScript 深入之类数组对象与 arguments](https://github.com/mqyqingfeng/Blog/issues/14)

## 创建对象的多种方式以及优缺点

这篇文章更像是笔记，因为《JavaScript 高级程序设计》写得真是太好了！

### 工厂模式

```js
function createPerson(name) {
  var o = new Object();
  o.name = name;
  o.getName = function() {
    console.log(this.name);
  };

  return o;
}

var person1 = createPerson("kevin");
```

缺点：对象无法识别，因为所有的实例都指向一个原型

### 构造函数模式

```js
function Person(name) {
  this.name = name;
  this.getName = function() {
    console.log(this.name);
  };
}

var person1 = new Person("kevin");
```

优点：实例可以识别为一个特定的类型

缺点：每次创建实例时，每个方法都要被创建一次

- 构造函数模式优化

```js
function Person(name) {
  this.name = name;
  this.getName = getName;
}

function getName() {
  console.log(this.name);
}

var person1 = new Person("kevin");
```

优点：解决了每个方法都要被重新创建的问题

缺点：全局命名变量太多

### 原型模式

```js
function Person(name) {}

Person.prototype.name = "keivn";
Person.prototype.getName = function() {
  console.log(this.name);
};

var person1 = new Person();
```

优点：方法不会重新创建

缺点：1. 所有的属性和方法都共享； 2. 不能初始化参数；

- 原型模式优化 1

```js
function Person(name) {}

Person.prototype = {
  name: "kevin",
  getName: function() {
    console.log(this.name);
  }
};

var person1 = new Person();
```

优点：封装性好了一点

缺点：重写了原型，丢失了 constructor 属性

- 原型模式优化 2

```js
function Person(name) {}

Person.prototype = {
  constructor: Person,
  name: "kevin",
  getName: function() {
    console.log(this.name);
  }
};

var person1 = new Person();
```

优点：实例可以通过 constructor 属性找到所属构造函数

缺点：原型模式该有的缺点还是有

### 组合模式

构造函数模式与原型模式双剑合璧。

```js
function Person(name) {
  this.name = name;
}

Person.prototype = {
  constructor: Person,
  getName: function() {
    console.log(this.name);
  }
};

var person1 = new Person();
```

优点：该共享的共享，该私有的私有，使用最广泛的方式

缺点：有的人就是希望全部都写在一起，即更好的封装性

- 动态原型模式

```js
function Person(name) {
  this.name = name;
  if (typeof this.getName != "function") {
    Person.prototype.getName = function() {
      console.log(this.name);
    };
  }
}

var person1 = new Person();
```

注意：使用动态原型模式时，不能用对象字面量重写原型

解释下为什么：

```js
function Person(name) {
  this.name = name;
  if (typeof this.getName != "function") {
    Person.prototype = {
      constructor: Person,
      getName: function() {
        console.log(this.name);
      }
    };
  }
}

var person1 = new Person("kevin");
var person2 = new Person("daisy");

// 报错 并没有该方法
person1.getName();

// 注释掉上面的代码，这句是可以执行的。
person2.getName();
```

为了解释这个问题，假设开始执行`var person1 = new Person('kevin')`。

如果对 new 和 apply 的底层执行过程不是很熟悉，可以阅读底部相关链接中的文章。

我们回顾下 new 的实现步骤：

首先新建一个对象，然后将对象的原型指向 `Person.prototype`，然后 `Person.apply(obj)`返回这个对象。

注意这个时候，回顾下 apply 的实现步骤，会执行 `obj.Person` 方法，这个时候就会执行 if 语句里的内容，注意构造函数的 prototype 属性指向了实例的原型，使用字面量方式直接覆盖 `Person.prototype`，并不会更改实例的原型的值，person1 依然是指向了以前的原型，而不是 `Person.prototype`。而之前的原型是没有 getName 方法的，所以就报错了！

如果你就是想用字面量方式写代码，可以尝试下这种：

```js
function Person(name) {
  this.name = name;
  if (typeof this.getName != "function") {
    Person.prototype = {
      constructor: Person,
      getName: function() {
        console.log(this.name);
      }
    };

    return new Person(name);
  }
}

var person1 = new Person("kevin");
var person2 = new Person("daisy");

person1.getName(); // kevin
person2.getName(); // daisy
```

### 寄生构造函数模式

```js
function Person(name) {
  var o = new Object();
  o.name = name;
  o.getName = function() {
    console.log(this.name);
  };

  return o;
}

var person1 = new Person("kevin");
console.log(person1 instanceof Person); // false
console.log(person1 instanceof Object); // true
```

寄生构造函数模式，我个人认为应该这样读：寄生-构造函数-模式，也就是说寄生在构造函数的一种方法。

也就是说打着构造函数的幌子挂羊头卖狗肉，你看创建的实例使用 instanceof 都无法指向构造函数！

这样方法可以在特殊情况下使用。比如我们想创建一个具有额外方法的特殊数组，但是又不想直接修改 Array 构造函数，我们可以这样写：

```js
function SpecialArray() {
  var values = new Array();

  for (var i = 0, len = arguments.length; i < len; i++) {
    values.push(arguments[i]);
  }

  values.toPipedString = function() {
    return this.join("|");
  };
  return values;
}

var colors = new SpecialArray("red", "blue", "green");
var colors2 = SpecialArray("red2", "blue2", "green2");

console.log(colors);
console.log(colors.toPipedString()); // red|blue|green

console.log(colors2);
console.log(colors2.toPipedString()); // red2|blue2|green2
```

你会发现，其实所谓的寄生构造函数模式就是比工厂模式在创建对象的时候，多使用了一个 new，实际上两者的结果是一样的。

但是作者可能是希望能像使用普通 Array 一样使用 SpecialArray，虽然把 SpecialArray 当成函数也一样能用，但是这并不是作者的本意，也变得不优雅。

在可以使用其他模式的情况下，不要使用这种模式。

但是值得一提的是，上面例子中的循环：

```js
for (var i = 0, len = arguments.length; i < len; i++) {
  values.push(arguments[i]);
}
```

可以替换成：

```js
values.push.apply(values, arguments);
```

### 稳妥构造函数模式

```js
function person(name) {
  var o = new Object();
  o.sayName = function() {
    console.log(name);
  };
  return o;
}

var person1 = person("kevin");

person1.sayName(); // kevin

person1.name = "daisy";

person1.sayName(); // kevin

console.log(person1.name); // daisy
```

所谓稳妥对象，指的是没有公共属性，而且其方法也不引用 this 的对象。

与寄生构造函数模式有两点不同：

- 新创建的实例方法不引用 this
- 不使用 new 操作符调用构造函数
- 稳妥对象最适合在一些安全的环境中。

稳妥构造函数模式也跟工厂模式一样，无法识别对象所属类型。

原文链接：[JavaScript 深入之创建对象的多种方式以及优缺点](https://github.com/mqyqingfeng/Blog/issues/15)

## 继承的多种方式和优缺点

### 原型链继承

```js
function Parent() {
  this.name = 'Yang';
}
Parent.prototype.getName = function() {
  return this.name;
}

function Child() { }
Child.prototype = new Parent();

var myself = new Child();
myself.getName();  // 'Yang'
```

问题：

- 引用类型的属性被所有实例共享
- 在创建 Child 的实例时，不能向Parent传参

### 借用构造函数(经典继承)

```js
function Parent(name) {
  this.name = name;
}
function Child(name) {
  Parent.call(this, name);
}
var myself1 = new Child('Yang');
var myself2 = new Child('Wang');
console.log(myself1.name)  // 'Yang'
console.log(myself2.name)  // 'Wang'
```

优点：

- 避免了引用类型的属性被所有实例共享
- 可以在 Child 中向 Parent 传参

缺点：

- 方法都在构造函数中定义，每次创建实例都会创建一遍方法

### 组合继承

原型链继承和经典继承双剑合璧。

```js
function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}
Parent.prototype.getName = function() {
  return this.name;
}

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}
Child.prototype = new Parent();
Child.prototype.constructor = Child;

var child1 = new Child('yang', 27);
child1.colors.push('white');

console.log(child1.name);  // "yang"
console.log(child1.age);  // 27
console.log(child1.colors);  // ["red", "blue", "green", "white"]

var child2 = new Child('ming', 20);

console.log(child2.name);  // "ming"
console.log(child2.age);  // 20
console.log(child2.colors);  // ["red", "blue", "green"]
child2.getName();  // "ming"
```

优点：融合原型链继承和构造函数的优点，是 JavaScript 中最常用的继承模式。

### 原型式继承

就是 ES5 `[Object.create](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)` 的模拟实现，将传入的对象作为创建的对象的原型。

```js
function createObj(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
}
```

缺点：包含引用类型的属性值始终都会共享相应的值，这点跟原型链继承一样。

### 寄生式继承

创建一个仅用于封装继承过程的函数，该函数在内部以某种形式来做增强对象，最后返回对象。

```js
function createObj(o) {
  var clone = Object.create(o);
  clone.sayName = function() {
    console.log('hi');
  };
  return clone;
}
```

缺点：跟借用构造函数模式一样，每次创建对象都会创建一遍方法。

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

引用《JavaScript高级程序设计》中对寄生组合式继承的夸赞就是：

> 这种方式的高效率体现它只调用了一次 Parent 构造函数，并且因此避免了在 Parent.prototype 上面创建不必要的、多余的属性。与此同时，原型链还能保持不变；因此，还能够正常使用 instanceof 和 isPrototypeOf。开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。

原文链接：[JavaScript深入之继承的多种方式和优缺点](https://github.com/mqyqingfeng/Blog/issues/16)
