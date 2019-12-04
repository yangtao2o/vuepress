# 学习冴羽的 JS 深入系列·上篇

## 从原型到原型链

### 代码演示

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

> 作者曰：在写文章之初，我就面临着这些问题，最后还是放弃从多个情形下给大家讲解 this 指向的思路，而是追根溯源的从 ECMASciript 规范讲解 this 的指向，尽管从这个角度写起来和读起来都比较吃力，但是一旦多读几遍，明白原理，绝对会给你一个全新的视角看待 this 。

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

例子一：

```js
var value = 1;
function foo(v) {
  v = 2;
  console.log(v); //2
}
foo(value);
console.log(value); // 1
```

内存分布如下：

改变前：

<table>
  <tr>
    <td colspan="2"  align="center">栈内存</td>
    <td colspan="2"  align="center">堆内存</td>
  </tr>
  <tr>
    <td>value</td>
    <td>1</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>v</td>
    <td>1</td>
    <td></td>
    <td></td>
  </tr>
</table>

改变后：

<table>
  <tr>
    <td colspan="2"  align="center">栈内存</td>
    <td colspan="2"  align="center">堆内存</td>
  </tr>
  <tr>
    <td>value</td>
    <td>1</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>v</td>
    <td>2</td>
    <td></td>
    <td></td>
  </tr>
</table>

例子二：

```js
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

内存分布如下：

改变前：

<table>
  <tr>
    <td colspan="2"  align="center">栈内存</td>
    <td  align="center">堆内存</td>
  </tr>
  <tr>
    <td>obj，o</td>
    <td>指针地址</td>
    <td>{value: 1}</td>
  </tr>
</table>

改变后：

<table>
  <tr>
    <td colspan="2"  align="center">栈内存</td>
    <td  align="center">堆内存</td>
  </tr>
  <tr>
    <td>obj，o</td>
    <td>指针地址</td>
    <td>{value: 2}</td>
  </tr>
</table>

例子三：

```js
var obj = {
  value: 1
};
function foo(o) {
  o = 2;
  console.log(o); //2
}
foo(obj);
console.log(obj.value); // 1
```

内存分布如下：

改变前：

<table>
  <tr>
    <td colspan="2"  align="center">栈内存</td>
    <td  align="center">堆内存</td>
  </tr>
  <tr>
    <td>obj，o</td>
    <td>指针地址</td>
    <td>{value: 1}</td>
  </tr>
</table>

改变后：

<table>
  <tr>
    <td colspan="2"  align="center">栈内存</td>
    <td  align="center">堆内存</td>
  </tr>
  <tr>
    <td>obj</td>
    <td>指针地址</td>
    <td>{value: 1}</td>
  </tr>
  <tr>
    <td>o</td>
    <td>2</td>
    <td></td>
  </tr>
</table>

以上解释来自：[sunsl516 commented](https://github.com/mqyqingfeng/Blog/issues/10#issuecomment-305645497) on 2 Jun 2017.

原文链接：[JavaScript 深入之参数按值传递](https://github.com/mqyqingfeng/Blog/issues/10)
