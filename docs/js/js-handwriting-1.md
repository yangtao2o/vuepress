# JavaScript 各种手写源码实现·上篇

## 前言

[前端面试常考的手写代码不是背出来的！](https://juejin.im/post/5e57048b6fb9a07cc845a9ef#heading-41)

## call、apply 以及 bind 实现

### call 实现

我们模拟的步骤可以分为：

1. 将函数设为对象的属性
2. 执行该函数
3. 删除该函数

```js
Function.prototype.myCall = function(context) {
  if (typeof this !== "function") {
    throw new Error(`${this} is not a function.`);
  }
  if (typeof context != "object") {
    throw new Error("Arguments error");
  }

  var args = [];
  var result;
  context = context || window;
  // 如果本身存在 fn 属性，先保存，使用完毕，后恢复
  if ("fn" in context && context.hasOwnProperty("fn")) {
    var fn = context.fn;
    var fnFlag = true;
  }

  // 1. 将函数设为对象的属性
  context.fn = this;

  for (var i = 1, l = arguments.length; i < l; i++) {
    // args = ["arguments[1]", "arguments[2]"]
    args.push("arguments[" + i + "]");
  }
  // 2. 执行该函数
  result = eval("context.fn(" + args + ")");

  if (fnFlag) {
    // 恢复
    context.fn = fn;
  } else {
    // 3. 删除该函数
    delete context.fn;
  }

  return result;
};
```

ES6:

```js
Function.prototype.myCall = function(context) {
  if (typeof this !== "function") {
    throw new Error(`${this} is not a function.`);
  }
  const args = [...arguments].slice(1);
  context = context || window;
  // 1. 将函数设为对象的属性
  context.fn = this;
  // 2. 执行该函数
  const result = context.fn(...args);
  // 3. 删除该函数
  delete context.fn;
  return result;
};
```

### apply 实现

```js
Function.prototype.myapply = function(context, arr) {
  if (typeof this !== "function") {
    throw new Error(`${this} is not a function.`);
  }
  context = context || window;
  context.fn = this;

  let result;
  if (!arr) {
    result = context.fn();
  } else {
    let args = [];
    for (var i = 0, l = arr.length; i < l; i++) {
      args.push("arr[" + i + "]");
    }
    result = eval("context.fn(" + args + ")");
  }
  delete context.fn;
  return result;
};
```

ES6:

```js
Function.prototype.myapply = function(context) {
  if (typeof this !== "function") {
    throw new Error(`${this} is not a function.`);
  }
  context = context || window;
  context.fn = this;

  const args = arguments[1];
  let result;

  if (!args) {
    result = context.fn();
  } else {
    result = context.fn(...args);
  }

  delete context.fn;
  return result;
};
```

### bind 实现

我们可以首先得出 bind 函数的两个特点：

- 返回一个函数
- 可以传入参数

如：

```js
var foo = {
  value: 1
};

function bar(name, age) {
  console.log(this.value);
  console.log(name);
  console.log(age);
}

var bindFoo = bar.bind(foo, "yyy");
bindFoo("28");
```

**第一步**：返回一个函数

```js
Function.prototype.mybind1 = function(context) {
  const self = this;
  return function() {
    return self.apply(context);
  };
};
```

**第二步**：可以传参，并且可以这样：函数需要传 name 和 age 两个参数，可以在 bind 的时候，只传一个 name，在执行返回的函数的时候，再传另一个参数 age!

```js
Function.prototype.mybind2 = function(context) {
  const self = this;
  // 截取参数，如：
  // context = [].shift.call(arguments)
  // args = [].slice.call(arguments)
  const args = Array.prototype.slice.call(arguments, 1);
  return function() {
    const bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(context, args.concat(bindArgs));
  };
};
```

**第三步**：当 bind 返回的函数作为构造函数的时候，bind 时指定的 this 值会失效，但传入的参数依然生效。

```js
Function.prototype.mybind3 = function(context) {
  const self = this;
  const args = Array.prototype.slice.call(arguments, 1);

  // 通过一个空函数来进行中转
  const fNOP = function() {};

  const fBound = function() {
    const bindArgs = Array.prototype.slice.call(arguments);
    // this 指向 实例，说明是构造函数，需要将绑定函数的 this 指向该实例，
    // 可以让实例获得来自绑定函数的值
    // this 指向 window，说明使普通函数调用，将绑定函数的 this 指向 context
    return self.apply(
      this instanceof fNOP ? this : context,
      args.concat(bindArgs)
    );
  };

  fNOP.prototype = this.prototype;
  // 让实例继承绑定函数的原型(this.prototype)中的值
  fBound.prototype = new fNOP();

  return fBound;
};
```

**最终版**：

```js
Function.prototype.mybind = function(context) {
  if (typeof this !== "function") {
    throw new Error(
      "Function.prototype.bind - what is trying to be bound is not callable"
    );
  }
  const self = this;
  const args = Array.prototype.slice.call(arguments, 1);
  const fNOP = function() {};

  const fBound = function() {
    const bindArgs = Array.prototype.slice.call(arguments);
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

## new 实现

我们看下 new 做了什么：

1. 创建一个新对象；
1. 将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象）
1. 执行构造函数中的代码（为这个新对象添加属性）
1. 返回新对象。

```js
function objectFactory() {
  // 1. 新建一个对象 obj
  const obj = new Object();

  // 2. 取出第一个参数，就是我们要传入的构造函数 Constructor。
  // 此外因为 shift 会修改原数组，所以 arguments 会被去除第一个参数
  const Constructor = [].shift.call(arguments);

  // 3. 将 obj 的原型指向构造函数，这样 obj 就可以访问到构造函数原型中的属性
  obj.__proto__ = Constructor.prototype;

  // 4. 使用 apply，改变构造函数 this 的指向到新建的对象，这样 obj 就可以访问到构造函数中的属性
  // 如果构造函数返回值是对象则返回这个对象，如果不是对象则返回新的实例对象
  const ret = Constructor.apply(obj, arguments);

  // 5. 返回 obj
  return typeof ret === "object" ? ret : obj;
}
```

ES6：

```js
function createNew(Con, ...args) {
  this.obj = {};

  this.obj = Object.create(Con.prototype);
  // Object.setPrototypeOf(this.obj, Con.prototype);

  const ret = Con.apply(this.obj, args);
  return ret instanceof Object ? ret : this.obj;
}
```

## Object.create 实现

[Object.create()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)方法创建一个新对象，使用现有的对象来提供新创建的对象的`__proto__`。

### 使用 Object.create

```js
var o;
// 创建原型为 null 的空对象
o = Object.create(null);

o = {};
// 以字面量方式创建的空对象就相当于：
o = Object.create(Object.prototype);

function Constructor() {}
o = new Constructor();
// 上面的一句就相当于:
o = Object.create(Constructor.prototype);
// 相当于
Object.setPrototypeOf(o, Constructor.prototype);
// 再相当于
o.__proto__ === Constructor.prototype);
// 哇哦，完美

o = Object.create(Object.prototype, {
  // foo会成为所创建对象的数据属性
  foo: {
    writable: true,
    configurable: true,
    value: "hello"
  },
  // bar会成为所创建对象的访问器属性
  bar: {
    configurable: false,
    get: function() {
      return 10;
    },
    set: function(value) {
      console.log("Setting `o.bar` to", value);
    }
  }
});
```

### 模拟 Object.create 实现原理

采用了**原型式继承**：将传入的对象作为创建的对象的原型。

```js
Object.mycreate = function(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
};
```

详细 Polyfill，见 MDN：[Object.create()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)，其实就多了参数的判断等信息。

## Object.setPrototypeOf 实现

**Object.setPrototypeOf()** 方法设置一个指定的对象的原型 ( 即, 内部`[[Prototype]]`属性）到另一个对象或 `null`。

**注意**：由于性能问题，你应该使用 **Object.create()** 来创建带有你想要的`[[Prototype]]`的新对象。详情见：[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)。

使用较旧的 `Object.prototype.__proto__` 属性，我们可以很容易地定义 `setPrototypeOf`：

```js
// 仅适用于Chrome和FireFox，在IE中不工作：
Object.setPrototypeOf =
  Object.setPrototypeOf ||
  function(obj, proto) {
    obj.__proto__ = proto;
    return obj;
  };
```

## instanceof 实现

**用法**：`instanceof` 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

**原理**：其实就是沿着原型链一直询问，直到`__proto__`为 `null`为止。

**注意**：`Object.prototype.isPrototypeOf()`用于测试一个对象是否存在于另一个对象的原型链上。`isPrototypeOf()` 与 `instanceof` 运算符不同。在表达式 "`object instanceof AFunction`"中，object 的原型链是针对 `AFunction.prototype` 进行检查的，而不是针对 `AFunction` 本身。

如果你有段代码只在需要操作继承自一个特定的原型链的对象的情况下执行，同 `instanceof` 操作符一样 `isPrototypeOf()` 方法就会派上用场:

```js
function Car() {}
var mycar = new Car();

// 注意下面 instanceof 和 isPrototypeOf() 之间的区别：
// instanceof 中的 mycar 原型链是针对 Car.prototype，而不是 Car 本身
var a = mycar instanceof Car; // 返回 true
var b = mycar instanceof Object; // 返回 true

// isPrototypeOf() 也是 Car.prototype，不过是显式的，注意这点小小区别
var aa = Car.prototype.isPrototypeOf(mycar); // true
var bb = Object.prototype.isPrototypeOf(mycar); // true
```

要检测对象不是某个构造函数的实例时，你可以这样做:

```js
if (!(mycar instanceof Car)) {
  // Do something
}
if (!Car.prototype.isPrototypeOf(mycar)) {
  // Do something
}
```

**instanceof 模拟实现**：主要是沿着`__proto__`判断：`L.__proto__`是否等于`R.prototype`：

```js
function myinstanceof(L, R) {
  const O = R.prototype;
  L = L.__proto__;
  while (true) {
    if (L === null) return false;
    if (O === L) return true;
    L = L.__proto__;
  }
}

var a = myinstanceof(mycar, Car); // 返回 true
var b = myinstanceof(mycar, Object); // 返回 true
```

## getOwnPropertyNames 实现

[Object.getOwnPropertyNames()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames)方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括 Symbol 值作为名称的属性）组成的数组。

使用`Array.forEach`输出属性名和属性值：

```js
var obj = { 0: "a", 1: "b", 2: "c" };
Object.getOwnPropertyNames(obj).forEach(function(val, idx, array) {
  console.log(val + " -> " + obj[val]);
});
// 0 -> a
// 1 -> b
// 2 -> c
```

而且能获取不可枚举属性：

```js
var myobj = Object.create(
  {},
  {
    getFoo: {
      value: function() {
        return this.foo;
      },
      enumerable: false
    }
  }
);
myobj.foo = 1;
Object.getOwnPropertyNames(myobj); // ["getFoo", "foo"]
```

模拟只实现了可枚举属性：

```js
function myGetOwnPropertyNames(obj) {
  if (typeof obj !== "object") {
    throw TypeError(obj + "is not an object");
  }
  const props = [];
  for (let p in obj) {
    // 只能获取可枚举属性
    // 过滤掉原型链上的属性，只取本身属性
    if (Object.prototype.hasOwnProperty.call(obj, p)) {
      props.push(p);
    }
  }
  return props;
}

var result1 = myGetOwnPropertyNames(obj); // ["0", "1", "2"]
var result2 = myGetOwnPropertyNames(arr); // ["0", "1", "2", "3"]
```

## 原型链继承实现

### 用法

```js
function Parent(name) {
  this.name = name;
}

Parent.prototype.getName = function() {
  return this.name;
};

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

Child.prototype.getMsg = function() {
  return `My name is ${this.name}, ${this.age} years old.`;
};
```

ES6:

```js
class Parent {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name);
    this.age = age;
  }
  getMsg() {
    return `My name is ${this.name}, ${this.age} years old.`;
  }
}
```

### 封装继承方法

第一版：

```js
function prototype(child, parent) {
  const F = function() {};
  F.prototype = parent.prototype;
  child.prototype = new F();
  child.prototype.constructor = child;
}
```

第二版：

```js
function create(o) {
  const F = function() {};
  F.prototype = o;
  return new F();
}

function prototype(child, parent) {
  child.prototype = create(parent.prototype);
  child.prototype.constructor = child;
}
```

第三版：

```js
function prototype(child, parent) {
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
}
```

### 使用到的几种继承方式

**组合式继承**：融合原型链继承和构造函数的优点，是 JavaScript 中最常用的继承模式。组合继承最大的缺点是会调用两次父构造函数。

**原型式继承**：`Object.create` 的模拟实现，将传入的对象作为创建的对象的原型。

**寄生组合式继承**：只调用了一次 Parent 构造函数，并且因此避免了在 Parent.prototype 上面创建不必要的、多余的属性。

PS：其他几种继承方式见这里[JavaScript 深入之继承的多种方式和优缺点](https://github.com/mqyqingfeng/Blog/issues/16)。

引用《JavaScript 高级程序设计》中对**寄生组合式继承**的夸赞就是：

这种方式的高效率体现它只调用了一次 `Parent` 构造函数，并且因此避免了在 `Parent.prototype` 上面创建不必要的、多余的属性。与此同时，原型链还能保持不变；因此，还能够正常使用 `instanceof` 和 `isPrototypeOf`。开发人员普遍认为寄生组合式继承是**引用类型**最理想的继承范式。

## class 实现

主要是模拟使用`extends`，并模拟`super`可以给其父构造函数传值，如 Parent 中的 opt：

```js
class Parent {
  constructor(opt) {
    this.name = opt.name;
  }
  getName() {
    return this.name;
  }
}

class Child extends Parent {
  constructor(opt) {
    super(opt);
    this.age = opt.age;
  }
  getAge() {
    return this.age + " years old.";
  }
}

const me = new Child({ name: "Yang", age: 28 });
```

开始模拟实现：

```js
function _extends(child, parent) {
  child.prototype = Object.create(parent && parent.prototype);
  child.prototype.constructor = child;
  Object.setPrototypeOf
    ? Object.setPrototypeOf(child, parent)
    : (child.__proto__ = parent);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Parent = (function() {
  function Parent(opt) {
    _classCallCheck(this, Parent);

    this.name = opt.name;
  }

  Parent.prototype.getName = function getName() {
    return this.name;
  };

  return Parent;
})();

var Child = (function(_Parent) {
  _extends(Child, _Parent);

  function Child(opt) {
    _classCallCheck(this, Child);
    // Constrctor => _Parent.call(this, opt)
    var _this = (_Parent != null && _Parent.call(this, opt)) || this;
    _this.age = opt.age;

    return _this;
  }

  Child.prototype.getAge = function getAge() {
    return this.age + " years old.";
  };

  return Child;
})(Parent);

const myself = new Child({ name: "YyY", age: 18 });
```

附加两篇文章：

- [ES6 系列之 Babel 是如何编译 Class 的(上)](https://github.com/mqyqingfeng/Blog/issues/105)
- [ES6 系列之 Babel 是如何编译 Class 的(下)](https://github.com/mqyqingfeng/Blog/issues/106)

## type API 实现

写一个 type 函数能检测各种类型的值，如果是基本类型，就使用 `typeof`，引用类型就使用 `toString`。

此外鉴于 `typeof` 的结果是小写，我也希望所有的结果都是小写。

```js
var class2type = {};

"Boolean Number String Function Array Date RegExp Object Error Null Undefined Symbol Set Map BigInt"
  .split(" ")
  .map(function(item) {
    // 格式如："[object Array]": "array"
    class2type["[object " + item + "]"] = item.toLowerCase();
  });

function type(obj) {
  if (obj == null) {
    return obj + ""; // IE6
  }
  return typeof obj === "object" || typeof obj === "function"
    ? class2type[Object.prototype.toString.call(obj)]
    : typeof obj;
}

function isFunction(obj) {
  return type(obj) === "function";
}

var isArray =
  Array.isArray ||
  function(obj) {
    return type(obj) === "array";
  };
```

参考资料：[JavaScript 专题之类型判断(上)](https://github.com/mqyqingfeng/Blog/issues/28)

## 参考资料

- [前端面试常考的手写代码不是背出来的！](https://juejin.im/post/5e57048b6fb9a07cc845a9ef)
- [各种手写源码实现](https://mp.weixin.qq.com/s?__biz=Mzg5ODA5NTM1Mw==&mid=2247485202&idx=1&sn=1a668530cdce1eaf53c2ec6d796fdd7b&chksm=c0668684f7110f922045c7a4539f78c51458ccafd5204ba7d89ad461ed360a1c14ed07778068&mpshare=1&scene=23&srcid=0329UG1H5LSPIxcKsQwUWXlo&sharer_sharetime=1585447184050&sharer_shareid=73865875704bcba3caa8b09c62f6bd7a%23rd)
- [JavaScript 中各种源码实现（前端面试笔试必备）](https://maimai.cn/article/detail?fid=1414317645&efid=GX16EiGB-SbwDA5N9-zXBQ&use_rn=1&from=timeline&isappinstalled=0)
- [JavaScript 深入之 call 和 apply 的模拟实现](https://github.com/mqyqingfeng/Blog/issues/11)
- [JavaScript 深入之 bind 的模拟实现](https://github.com/mqyqingfeng/Blog/issues/12)
- [JavaScript 深入之 new 的模拟实现](https://github.com/mqyqingfeng/Blog/issues/13)
- [JavaScript 深入之类数组对象与 arguments](https://github.com/mqyqingfeng/Blog/issues/14)
