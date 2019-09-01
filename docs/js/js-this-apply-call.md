# 初探 this、call 和 apply

### this

> JavaScript 中 this 总是指向一个对象

#### this 的指向

1. 作为对象的方法调用

this 指向该对象，如：

```js
var obj = {
  a: 1,
  getA: function() {
    console.log(this === obj); // true
    console.log(this.a); // 1
  }
};

obj.getA();
```

2. 作为普通函数调用

当函数不作为对象的属性被调用时，普通函数的 this 总是指向全局对象，浏览器里就是 window 对象。

```js
var name = "globalName";
var obj = {
  name: "tyang",
  getName: function() {
    return this.name;
  }
};
var getName = obj.getName;
console.log(obj.getName()); // tyang
console.log(getName()); // globalName
```

`obj.getName()` 作为 obj 对象的属性被调用，this 指向 obj 对象;

`getName()` 使用变量 getName 引用 obj.getName，此时是函数调用方式，this 指向全局 window;

在严格模式，情况有所不同：this 不会指向全局对象，而是 undefined：

```js
function func() {
  "use strict";
  console.log(this); // undefined
}

func();
```

当函数作为某个对象的方法调用时，this 等于那个对象。不过，匿名函数的执行环境具有全局性，因此其 this 对象通常指向 window。

```js
var gName = "The window";
var gObject = {
  gName: "My object",
  getName: function() {
    return function() {
      // 返回一个匿名函数
      return this.gName;
    };
  }
};

console.log(gObject.getName()()); // 'The window'
var getNameFunc = gObject.getName();
console.log(getNameFunc()); // 'The window'
```

创建了一个全局对象 `gName`，这个对象包含一个方法 `getName()`， 这个方法返回一个匿名函数，这个匿名函数返回 `this.name`。因此调用 `gObject.getName()()` 会立即执行匿名函数，并返回一个字符串 `'The window'`。

为什么匿名函数没有取得包含作用域的 this 对象呢？

每个函数再被调用的时候，会自动取得两个特殊变量：this 和 arguments，内部函数在搜索这两个变量时，只会搜索到其活动对象为止，因此永远不可能直接访问外部函数中的这两个变量。

所以，可以在外部作用域中设置一个变量来保存 this 对象：

```js
var gName = "The window";
var gObject = {
  gName: "My object",
  getName: function() {
    var that = this; // 将 this 对象赋值给 that 变量
    return function() {
      return that.gName; // that 引用着 gObject
    };
  }
};

console.log(gObject.getName()()); // 'My object'
```

当然，arguments 对象也可以如此使用：对该对象的引用保存到另一个闭包能够访问的变量中。

1. 构造器调用

当使用 new 运算符调用函数时，该函数会返回一个对象，一般情况下，构造器里的 this 指向返回的这个对象，如：

```js
var MyClass = function() {
  this.name = "Lisi";
};
var nameObj = new MyClass();
console.log(nameObj.name); // Lisi
```

但是，当显式返回一个 object 类型的对象时，那最终会返回这个对象，并不是之前的 this：

```js
var MyClass = function() {
  this.name = "Lisi";
  return {
    // 如果这里不会烦 object 类型的数据，如：return 'wangwu'，就不会返回显式对象
    name: "wangwu"
  };
};
var nameObj = new MyClass();
console.log(nameObj.name); // wangwu
```

4. Function.prototype.call 或 Function.prototype.apply 调用

call 和 apply 可以动态地改变传入函数的 this：

```js
var personObj = {
  name: "ytao",
  age: "22"
};
function person() {
  return this.name + this.age;
}
console.log(person.call(personObj)); // ytao22
```

#### 丢失的 this

我们一般会重写这个获取 id 的方法：

```js
var getId = function(id) {
  return document.getElementById(id);
};

getId("divBox");
```

那可不可以这样呢：

```js
getId2 = document.getElementById;
getId2("divBox"); // Uncaught TypeError: Illegal invocation
```

结果直接报错，当 `getElementById` 方法作为 document 对象的属性被调用时， 方法内部的 this 是指向 document 的。如果 `getId2('divBox')`，相当于是普通函数调用，函数内部的 this 指向的是 window。

所以，按照这个思路，我们可以这样模拟一下它的实现：

```js
document.getElementById = (function(func) {
  return function() {
    return func.apply(document, arguments);
  };
})(document.getElementById);

getId3 = document.getElementById;
getId3("divBox");
```

### call 和 apply

> fun.apply(thisArg, [argsArray])
>
> fun.call(thisArg, arg1, arg2, ...)

在函数式编程中，call 和 apply 方法尤为有用，两者用法一致，只是传参的形式上有所区别而已。

#### 区别

apply() 接受两个参数，第一个参数指定了函数体内 this 对象，第二个是数组或者类数组，apply() 方法将这个集合中的元素作为参数传递给被调用的函数。

call() 方法的作用和 apply() 方法类似，区别就是 call()方法接受的是参数列表，而 apply()方法接受的是一个参数数组。

- [Function​.prototype​.apply()
  ](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
- [Function​.prototype​.call()
  ](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

第一个参数为 null，函数体内的 this 会指向默认的宿主对象，但是在严格模式下，依然是 null。

```js
var applyFunc = function(a, b, c) {
  console.log(this === window);
};
applyFunc.apply(null, [1, 2, 3]); // true

var applyFunc = function(a, b, c) {
  "use strict";
  console.log(this === null);
};
applyFunc.apply(null, [1, 2, 3]); // true
```

#### 用途

1. 改变 this 指向

假如在一个点击事件函数中有一个内部函数 func，当点击事件被触发时，就会出现如下情况：

```js
document.getElementById("divBox").onclick = function() {
  console.log(this.id); // divBox
  var func = function() {
    console.log(this.id); // undefined，这里的 this 指向了 window
  };
  func();
};
```

这时，我们用 call() 来改变一下：

```js
document.getElementById("divBox").onclick = function() {
  console.log(this.id); // divBox
  var func = function() {
    console.log(this.id); // divBox
  };
  func.call(this);
};
```

2. 模拟 bind 方法

> function.bind(thisArg[, arg1[, arg2[, ...]]])

bind()方法创建一个新的函数，在调用时设置 this 关键字为提供的值。并在调用新函数时，将给定参数列表作为原函数的参数序列的前若干项。

```js
Function.prototype.bind = function(context) {
  var self = this; // 保存原函数
  return function() {
    // 返回新函数
    return self.apply(context, arguments); // 将传入的 context 当做新函数体内的 this
  };
};

var bindObj = {
  name: "tyang"
};

var bindFunc = function() {
  console.log(this.name); // tyang
}.bind(bindObj);

bindFunc();
```

这是一个简化版的 `Function.prototype.bind`实现，`self.apply(context, arguments)`才是执行原来的 bindFunc 函数，并且指定 context 对象为 bindFunc 函数体内的 this。

我们再继续修改下，使之可以预先添加一些参数：

```js
Function.prototype.bind = function() {
  var self = this,
    context = [].shift.call(arguments), // 获取参数中第一个为绑定的this上下文
    args = [].slice.call(arguments); // 将剩余的参数转化为数组

  // 返回新函数
  return function() {
    return self.apply(context, [].concat.call(args, [].slice.call(arguments))); //arguments 为新函数的参数，即传入的 3，4
  };
};

var bindObj = {
  name: "lisisi"
};

var bindFunc = function(a, b, c, d) {
  console.log(this.name); // lisisi
  console.log([a, b, c, d]); // [1, 2, 3, 4]
}.bind(bindObj, 1, 2);

bindFunc(3, 4);
```

`self.apply(context, [].concat.call(args, [].slice.call(arguments)));`，执行新函数的时候，会把之前传入的 context 作为 this，`[].slice.call(arguments)`将新函数传入的参数转化为数组，并作为`[].concat.call(args)`的给定参数，组合两次，作为新函数最终的参数。

3. 借用其他对象的方法

第一种，”借用构造函数“实现一些类似继承的效果：

```js
var A = function(name) {
  this.name = name;
};
var B = function() {
  A.apply(this, arguments);
};
B.prototype.getName = function() {
  return this.name;
};
var bbb = new B("Yangtao");
console.log(bbb.getName()); //Yangtao
```

第二种，给类数组对象使用数组方法，比如：

```js
(function() {
  Array.prototype.push.call(arguments, 3);
  console.log(arguments); // [1, 2, 3]
})(1, 2);
```

再比如之前用到的，把 arguments 转成真正的数组的时候可以借用 `Array.prototype.slice.call(arguments)`，想截去头一个元素时，借用`Array.prototype.shift.call(arguments)`

虽然我们可以把”任意“对象传入 `Array.prototype.push`:

```js
var aObj = {};
Array.prototype.push.call(aObj, "first");
console.log(aObj.length); // 1
console.log(aObj[0]); // first
```

但是，这个对象也得满足以下两个条件：

- 对象本身要可以存取属性
- 对象的 length 属性可读写

如果是其他类型，比如 number，无法存取；比如函数，length 属性不可写，使用 call 或 apply 就会报错：

```js
var num = 1;
Array.prototype.push.call(num, "2");
console.log(num.length); // undefined
console.log(num[0]); // undefined

var funcObj = function() {};
Array.prototype.push.call(funcObj, "3");
console.log(funcObj.length); // Uncaught TypeError: Cannot assign to read only property 'length' of function 'function () {}'
```

学习资料：

- 《JavaScript 高程 3》第七章
- 《JavaScript 设计模式与开发实践 · 曾探》第 2 章

发布：

- 掘金[《初探 this、call 和 apply》](https://juejin.im/post/5cb915546fb9a0688539b53b)