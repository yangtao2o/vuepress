# 学习冴羽的 JS 深入系列·中篇

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

