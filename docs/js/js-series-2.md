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

bind 还有一个特点，就是:一个绑定函数也能使用 new 操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。

也就是说，当 bind 返回的函数作为构造函数的时候，bind 时指定的 this 值会失效，但传入的参数依然生效。

所以我们可以通过修改返回的函数的原型来实现：

```js
Function.prototype.mybind = function(context) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);
  var fBound = function() {
    var bindArgs = Array.prototype.slice.call(arguments);
    // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
    // 以上面的是 demo 为例，如果改成 `this instanceof fBound ? null : context`，实例只是一个空对象，将 null 改成 this ，实例会具有 habit 属性
    // 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
    return self.apply(
      this instanceof fBound ? this : context,
      args.concat(bindArgs)
    );
  };

  // 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值
  fBound.prototype = this.prototype;
  return fBound;
};
```

优化：

```js
Function.prototype.mybind = function(context) {
  if (typeof this !== "function") {
    throw new Error(
      "Function.prototype.bind - what is trying to be bound is not callable"
    );
  }

  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);

  var fNOP = function() {};
  var fBound = function() {
    var bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(
      this instanceof fNOP ? this : context,
      args.concat(bindArgs)
    );
  };

  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
};
```

那别忘了做个兼容：

```js
Function.prototype.bind = Function.prototype.bind || function () {
    ……
};
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

### 初步实现

分析：

因为 new 的结果是一个新对象，所以在模拟实现的时候，我们也要建立一个新对象，这个新对象会具有构造函数里的属性。

实例的 `__proto__` 属性会指向构造函数的 `prototype`，也正是因为建立起这样的关系，实例可以访问原型上的属性。

```js
function objectFactory() {
  // 用new Object() 的方式新建了一个对象 obj
  var obj = new Object();

  // 取出第一个参数，就是我们要传入的构造函数
  // 此外因为 shift 会修改原数组，所以 arguments 会被去除第一个参数
  var Constructor = [].shift.call(arguments);

  // 将 obj 的原型指向构造函数，这样 obj 就可以访问到构造函数原型中的属性
  obj.__proto__ = Constructor.prototype;

  // 使用 apply，改变构造函数 this 的指向到新建的对象，这样 obj 就可以访问到构造函数中的属性
  Constructor.apply(obj, arguments);

  // 返回 obj
  return obj;
}
```

### 返回值效果实现

需要判断返回的值是不是一个对象，如果是一个对象，我们就返回这个对象，如果没有，我们该返回什么就返回什么

```js
function objectFactory() {
  var obj = new Object();
  var Constructor = [].shift.call(arguments);

  obj.__proto__ = Constructor.prototype;

  var ret = Constructor.apply(obj, arguments);

  return typeof ret === "object" ? ret : obj;
}
```

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
