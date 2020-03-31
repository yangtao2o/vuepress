# JavaScript 各种手写源码实现·上篇

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

[Object.getOwnPropertyNames()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames)方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组。

使用`Array.forEach`输出属性名和属性值：

```js
var obj = { 0: "a", 1: "b", 2: "c"};
Object.getOwnPropertyNames(obj).forEach(function(val, idx, array) {
  console.log(val + " -> " + obj[val]);
});
// 0 -> a
// 1 -> b
// 2 -> c
```

而且能获取不可枚举属性：

```js
var myobj = Object.create({}, {
  getFoo: {
    value: function() { return this.foo; },
    enumerable: false
  }
});
myobj.foo = 1;
Object.getOwnPropertyNames(myobj);  // ["getFoo", "foo"]
```

模拟只实现了可枚举属性：

```js
function myGetOwnPropertyNames(obj) {
  if (typeof obj !== "object") {
    throw TypeError(obj + "is not an object");
  }
  const props = [];
  for (let p in obj) {  // 只能获取可枚举属性
    // 过滤掉原型链上的属性，只取本身属性
    if (Object.prototype.hasOwnProperty.call(obj, p)) {
      props.push(p);
    }
  }
  return props;
}

var result1 = myGetOwnPropertyNames(obj);  // ["0", "1", "2"]
var result2 = myGetOwnPropertyNames(arr);  // ["0", "1", "2", "3"]
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
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
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

## Array.isArray 实现

可以通过 **toString()** 来获取每个对象的类型。为了每个对象都能通过 `Object.prototype.toString()` 来检测，需要以 `Function.prototype.call()` 或者 `Function.prototype.apply()` 的形式来调用，传递要检查的对象作为第一个参数。

```js
Array.myIsArray = function(o) {
  return Object.prototype.toString.call(o) === "[object Array]";
};
console.log(Array.myIsArray([])); // true
```

## Array.prototype.reduce 实现

[reduce()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) 方法对数组中的每个元素执行一个由您提供的`reducer`函数(升序执行)，将其结果汇总为单个返回值。由 reduce 返回的值将是最后一次回调返回值。语法：

```js
arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])
```

- callback
  - accumulator 累计器
  - currentValue 当前值
  - currentIndex 当前索引，可选
  - array 数组，可选
- initialValue 可选，作为第一次调用 callback 函数时的第一个参数的值。 如果没有提供初始值，则将使用数组中的第一个元素。

### 栗子

求数组之和：

```js
const array1 = [1, 2, 3, 4];
let result = array1.reduce((prev, curr) => prev + curr); //10
```

数组去重：

```js
let arr = [1, 2, 1, 2, 3, 5, 4, 5, 3, 4, 4, 4, 4];
let result = arr.sort().reduce((init, current) => {
  if (init.length === 0 || init[init.length - 1] !== current) {
    init.push(current);
  }
  return init;
}, []);
console.log(result); //[1,2,3,4,5]
```

按顺序运行 Promise：

```js
function runPromiseInSequence(arr, input) {
  return arr.reduce(
    (promiseChain, currentFunction) => promiseChain.then(currentFunction),
    Promise.resolve(input)
  );
}
// p1, p2, f3, p4 is promise function or normal function
function p1(a) {
  return new Promise((resolve, reject) => {
    resolve(a * 5);
  });
}

const promiseArr = [p1, p2, f3, p4];
runPromiseInSequence(promiseArr, 10).then(console.log);
```

功能型函数管道：

```js
// Building-blocks to use for composition
const double = x => x + x;
const triple = x => 3 * x;

// Function composition enabling pipe functionality
const pipe = (...functions) => input =>
  functions.reduce((acc, fn) => fn(acc), input);

// 这里其实就是
const pipe = function(...functions) {
  return function(input) {
    return functions.reduce(function(acc, fn) {
      return fn(acc);
    }, input);
  };
};

// Composed functions for multiplication of specific values
const multiply6 = pipe(double, triple);

// Usage
multiply6(6); // 36
```

### 模拟实现

第一版：

```js
Array.prototype.myreduce = function(callback, initialValue) {
  // 判断第一次调用 callback 函数时的第一个参数的值。
  // 如果没有提供初始值，则将使用数组中的第一个元素。
  const _this = this;
  let accumulator = initialValue ? initialValue : this[0];

  for (let i = initialValue ? 0 : 1; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, _this);
  }
  return accumulator;
};
```

第二版：

```js
Array.prototype.myreduce = function reduce(callbackfn) {
  const O = this; // 保存原数组
  const len = O.length >>> 0; // typeof ('1' >>> 0) -> number
  let k = 0, // 下标值初始化
    accumulator = undefined, // 累加器初始化
    kPresent = false, // k下标对应的值是否存在
    initialValue = arguments.length > 1 ? arguments[1] : undefined; // 初始值

  if (typeof callbackfn !== "function") {
    thrownewTypeError(callbackfn + " is not a function");
  }

  // 数组为空，并且有初始值，报错
  if (len === 0 && arguments.length < 2) {
    thrownewTypeError("Reduce of empty array with no initial value");
  }

  // 如果初始值存在，累加器为初始值，否则使用数组中的第一个元素
  if (arguments.length > 1) {
    accumulator = initialValue;
  } else {
    accumulator = O[k++];
  }

  while (k < len) {
    // 判断是否为 empty [,,,]
    kPresent = O.hasOwnProperty(k);

    if (kPresent) {
      const kValue = O[k]; // 当前值
      // 调用 callbackfn
      accumulator = callbackfn(accumulator, kValue, k, O);
    }
    k++;
  }

  return accumulator;
};
```

## Array.prototype.flat 实现

[flat()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flat) 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

```js
var newArray = arr.flat([depth]);
// depth 可选
// 指定要提取嵌套数组的结构深度，默认值为 1

// 返回值
// 一个包含将数组与子数组中所有元素的新数组。
```

例子：

```js
var arr = [1, 2, [3, 4]];

// 展开一层数组
arr.flat();
// 等效于
arr.reduce((acc, val) => acc.concat(val), []);
// [1, 2, 3, 4]

// 使用扩展运算符 ...
const flattened = arr => [].concat(...arr);

// 展开两层数组
arr.flat(2);

// 使用 Infinity，可展开任意深度的嵌套数组
arr.flat(Infinity);
```

使用 **reduce**、**concat** 和**递归**展开无限多层嵌套的数组：

```js
function flatDeep(arr, d = 1) {
  return d > 0
    ? arr.reduce(
        (acc, val) =>
          acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val),
        []
      )
    : arr.slice();
}
```

**forEach**：

```js
// forEach 遍历数组会自动跳过空元素
const eachFlat = (arr = [], depth = 1) => {
  const result = []; // 缓存递归结果
  // 开始递归
  (function flat(arr, depth) {
    // forEach 会自动去除数组空位
    arr.forEach(item => {
      // 控制递归深度
      if (Array.isArray(item) && depth > 0) {
        // 递归数组
        flat(item, depth - 1);
      } else {
        // 缓存元素
        result.push(item);
      }
    });
  })(arr, depth);
  // 返回递归结果
  return result;
};

eachFlat([1, 2, [3, [4, [5]]]], Infinity); //[1, 2, 3, 4, 5]
```

**for...of**：

```js
// for of 循环不能去除数组空位，需要手动去除
const forFlat = (arr = [], depth = 1) => {
  const result = [];
  (function flat(arr, depth) {
    for (let item of arr) {
      if (Array.isArray(item) && depth > 0) {
        flat(item, depth - 1);
      } else {
        // 去除空元素，添加非undefined元素
        item !== void 0 && result.push(item);
      }
    }
  })(arr, depth);
  return result;
};
```

其他方法见[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)。

## Array.prototype.forEach 实现

## Array.prototype.every 实现

## Array.prototype.some 实现

## Array.prototype.map 实现

## Array.prototype.filter 实现

## Array 迭代方法

1. `Array.prototype.forEach()`
   为数组中的每个元素执行一次回调函数。

1. `Array.prototype.entries()`
   返回一个数组迭代器对象，该迭代器会包含所有数组元素的键值对。

1. `Array.prototype.every()`
   如果数组中的每个元素都满足测试函数，则返回 true，否则返回 false。

1. `Array.prototype.some()`
   如果数组中至少有一个元素满足测试函数，则返回 true，否则返回 false。

1. `Array.prototype.filter()`
   将所有在过滤函数中返回 true 的数组元素放进一个新数组中并返回。

1. `Array.prototype.find()`
   找到第一个满足测试函数的元素并返回那个元素的值，如果找不到，则返回 undefined。

1. `Array.prototype.findIndex()`
   找到第一个满足测试函数的元素并返回那个元素的索引，如果找不到，则返回 -1。

1. `Array.prototype.keys()`
   返回一个数组迭代器对象，该迭代器会包含所有数组元素的键。

1. `Array.prototype.map()`
   返回一个由回调函数的返回值组成的新数组。

1. `Array.prototype.reduce()`
   从左到右为每个数组元素执行一次回调函数，并把上次回调函数的返回值放在一个暂存器中传给下次回调函数，并返回最后一次回调函数的返回值。

1. `Array.prototype.reduceRight()`
   从右到左为每个数组元素执行一次回调函数，并把上次回调函数的返回值放在一个暂存器中传给下次回调函数，并返回最后一次回调函数的返回值。

1. `Array.prototype.values()`
   返回一个数组迭代器对象，该迭代器会包含所有数组元素的值。

1. `Array.prototype[@@iterator]()`
   和上面的 values() 方法是同一个函数。

## Object 构造函数的方法

1. `Object.assign()`
   通过复制一个或多个对象来创建一个新的对象。

1. `Object.create()`
   使用指定的原型对象和属性创建一个新对象。

1. `Object.defineProperty()`
   给对象添加一个属性并指定该属性的配置。

1. `Object.defineProperties()`
   给对象添加多个属性并分别指定它们的配置。

1. `Object.entries()`
   返回给定对象自身可枚举属性的 [key, value] 数组。

1. `Object.freeze()`
   冻结对象：其他代码不能删除或更改任何属性。

1. `Object.getOwnPropertyDescriptor()`
   返回对象指定的属性配置。

1. `Object.getOwnPropertyNames()`
   返回一个数组，它包含了指定对象所有的可枚举或不可枚举的属性名。

1. `Object.getOwnPropertySymbols()`
   返回一个数组，它包含了指定对象自身所有的符号属性。

1. `Object.getPrototypeOf()`
   返回指定对象的原型对象。

1. `Object.is()`
   比较两个值是否相同。所有 NaN 值都相等（这与==和===不同）。

1. `Object.isExtensible()`
   判断对象是否可扩展。

1. `Object.isFrozen()`
   判断对象是否已经冻结。

1. `Object.isSealed()`
   判断对象是否已经密封。

1. `Object.keys()`
   返回一个包含所有给定对象自身可枚举属性名称的数组。

1. `Object.preventExtensions()`
   防止对象的任何扩展。

1. `Object.seal()`
   防止其他代码删除对象的属性。

1. `Object.setPrototypeOf()`
   设置对象的原型（即内部 [[Prototype]] 属性）。

1. `Object.values()`
   返回给定对象自身可枚举值的数组。

## 参考资料

- [MDN Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN Object](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/object)
- [前端面试常考的手写代码不是背出来的！](https://juejin.im/post/5e57048b6fb9a07cc845a9ef)
- [各种手写源码实现](https://mp.weixin.qq.com/s?__biz=Mzg5ODA5NTM1Mw==&mid=2247485202&idx=1&sn=1a668530cdce1eaf53c2ec6d796fdd7b&chksm=c0668684f7110f922045c7a4539f78c51458ccafd5204ba7d89ad461ed360a1c14ed07778068&mpshare=1&scene=23&srcid=0329UG1H5LSPIxcKsQwUWXlo&sharer_sharetime=1585447184050&sharer_shareid=73865875704bcba3caa8b09c62f6bd7a%23rd)
- [JavaScript 中各种源码实现（前端面试笔试必备）](https://maimai.cn/article/detail?fid=1414317645&efid=GX16EiGB-SbwDA5N9-zXBQ&use_rn=1&from=timeline&isappinstalled=0)
- [JavaScript 深入之 call 和 apply 的模拟实现](https://github.com/mqyqingfeng/Blog/issues/11)
- [JavaScript 深入之 bind 的模拟实现](https://github.com/mqyqingfeng/Blog/issues/12)
- [JavaScript 深入之 new 的模拟实现](https://github.com/mqyqingfeng/Blog/issues/13)
- [JavaScript 深入之类数组对象与 arguments](https://github.com/mqyqingfeng/Blog/issues/14)
