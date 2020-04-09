# 学习冴羽的 ES6 系列

## ES6 系列之 let 和 const

为了加强对变量生命周期的控制，ECMAScript 6 引入了**块级作用域**。

块级作用域存在于：

- 函数内部
- 块中(字符 { 和 } 之间的区域)

块级声明用于声明在指定块的作用域之外无法访问的变量。

let 和 const 都是块级声明的一种。特点有：

1. 不会被提升
2. 重复报错
3. 不绑定全局作用域

const 用于声明常量，其值一旦被设定不能再被修改，否则会报错。const 声明不允许修改绑定，但允许修改值。

**临时死区**(Temporal Dead Zone)，简写为 TDZ。

let 和 const 声明的变量不会被提升到作用域顶部，如果在声明之前访问这些变量，会导致报错：

```js
console.log(typeof value); // Uncaught SyntaxError: Identifier 'value' has already been declared
let value = 1;
```

这是因为 JavaScript 引擎在扫描代码发现变量声明时，要么将它们提升到作用域顶部(遇到 var 声明)，要么将声明放在 TDZ 中(遇到 let 和 const 声明)。访问 TDZ 中的变量会触发运行时错误。只有执行过变量声明语句后，变量才会从 TDZ 中移出，然后方可访问。

在 **for 循环中**使用 let 和 var，底层会使用不同的处理方式。

那么当使用 let 的时候底层到底是怎么做的呢？

简单的来说，就是在 `for (let i = 0; i < 3; i++)` 中，即圆括号之内建立一个隐藏的作用域。然后每次迭代循环时都创建一个新变量，并以之前迭代中同名变量的值将其初始化。类似这样的伪代码：

```js
(let i = 0) {
 funcs[0] = function() {
  console.log(i)
 };
}

(let i = 1) {
 funcs[1] = function() {
  console.log(i)
 };
}
```

学习资料：[ES6 系列之 let 和 const](https://github.com/mqyqingfeng/Blog/issues/82)

## ES6 系列之模板字符串

如果你碰巧要在字符串中使用反撇号，你可以使用反斜杠转义：

```js
let message = `Hello \` World`;
console.log(message); // Hello ` World
```

值得一提的是，在模板字符串中，空格、缩进、换行都会被保留。

模板字符串支持**嵌入变量**，只需要将变量名写在 `${}` 之中，其实不止变量，任意的 JavaScript 表达式都是可以的。值得一提的是，模板字符串支持**嵌套**：

```js
let arr = [{ value: 1 }, { value: 2 }];
let message = `
  <ul>
    ${arr
      .map(item => {
        return `
        <li>${item.value}</li>
      `;
      })
      .join("")}
  </ul>
`;
console.log(message);
```

**模板标签**是一个非常重要的能力，模板字符串可以紧跟在一个函数名后面，该函数将被调用来处理这个模板字符串，举个例子：

```js
let x = "Hi",
  y = "Kevin";
var res = messagefn`${x}, I am ${y}`;
console.log(res);

function messagefn(literals, value1, value2) {
  console.log(literals); // [ "", ", I am ", "" ]
  console.log(value1); // Hi
  console.log(value2); // Kevin
}
```

原文链接：[ES6 系列之模板字符串](https://github.com/mqyqingfeng/Blog/issues/84)

## ES6 系列之箭头函数

如果需要直接返回一个对象：

```js
let func = (value, num) => ({ total: value * num });
```

与变量解构结合：

```js
let func = ({ value, num }) => ({ total: value * num });

// 使用
var result = func({
  value: 10,
  num: 10
});

console.log(result); // {total: 100}
```

比如在 React 与 Immutable 的技术选型中，我们处理一个事件会这样做：

```js
handleEvent = () => {
  this.setState({
    data: this.state.data.set("key", "value")
  });
};
```

其实就可以简化为：

```js
handleEvent = () => {
  this.setState(({ data }) => ({
    data: data.set("key", "value")
  }));
};
```

比较一下箭头函数与普通函数**主要区别**包括：

**1. 没有 this**

箭头函数没有 this，所以需要通过查找**作用域链**来确定 this 的值。

这就意味着如果箭头函数被非箭头函数包含，this 绑定的就是最近一层非箭头函数的 this。

比如绑定一个事件：

```js
// ES5
Button.prototype.bindEvent = function() {
  this.element.addEventListener("click", this.setBgColor.bind(this), false);
};

// ES6
Button.prototype.bindEvent = function() {
  this.element.addEventListener(
    "click",
    event => this.setBgColor(event),
    false
  );
};
```

由于箭头函数没有 this，所以会向外层查找 this 的值，即 bindEvent 中的 this，此时 this 指向实例对象，所以可以正确的调用 this.setBgColor 方法， 而 this.setBgColor 中的 this 也会正确指向实例对象。

最后，因为箭头函数没有 this，所以也**不能用 call()、apply()、bind()** 这些方法改变 this 的指向，可以看一个例子：

```js
var value = 1;
var result = (() => this.value).bind({ value: 2 })();
console.log(result); // 1
```

**2. 没有 arguments**

箭头函数没有自己的 arguments 对象，可以通过命名参数或者 rest 参数的形式访问参数:

```js
let nums = (...nums) => nums;
console.log(nums(1, 2, 3)); // [1, 2, 3]
```

**3. 不能通过 new 关键字调用**

JavaScript 函数有两个内部方法：`[[Call]]` 和 `[[Construct]]`。

当通过 new 调用函数时，执行 `[[Construct]]` 方法，创建一个实例对象，然后再执行函数体，将 this 绑定到实例上。

当直接调用的时候，执行 `[[Call]]` 方法，直接执行函数体。

箭头函数并没有 `[[Construct]]` 方法，不能被用作构造函数，如果通过 new 的方式调用，会报错。

```js
var Foo = () => {};
var foo = new Foo(); // TypeError: Foo is not a constructor
```

由于不能使用 new 调用，也就没有了：

- 4.没有 new.target
- 5.没有原型
- 6.没有 super

**总结：**

**箭头函数表达式**的语法比函数表达式更短，并且不绑定自己的 this，arguments，super 或 new.target。这些函数表达式最适合用于**非方法函数**(non-method functions)，并且它们不能用作构造函数。

那么什么是 non-method functions 呢？

我们先来看看 method 的定义：

> A method is a function which is a property of an object.

对象属性中的函数就被称之为 method，那么 non-mehtod 就是指不被用作对象属性中的函数了，可是为什么说箭头函数更适合 non-method 呢？

让我们来看一个例子就明白了：

```js
var obj = {
  i: 10,
  b: () => console.log(this.i, this), // method
  c: function() {
    // method
    console.log(this.i, this);
  }
};
obj.b(); // 由于箭头函数没有 this, 这里指向了 window
// undefined Window
obj.c();
// 10, Object {...}
```

原文链接：[ES6 系列之箭头函数](https://github.com/mqyqingfeng/Blog/issues/85)

## ES6 系列之 Symbol 类型

ES6 引入了一种新的原始数据类型 Symbol，表示独一无二的值。

1. Symbol 值通过 Symbol 函数生成，使用 typeof，结果为 "symbol"

```js
var s = Symbol();
console.log(typeof s); // "symbol"
```

2. Symbol 函数前不能使用 new 命令，否则会报错。这是因为生成的 Symbol 是一个原始类型的值，不是对象。

3. instanceof 的结果为 false

```js
var s = Symbol("foo");
console.log(s instanceof Symbol); // false
```

4. Symbol 函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。

```js
var s1 = Symbol("foo");
console.log(s1); // Symbol(foo)
```

5. 如果 Symbol 的参数是一个对象，就会调用该对象的 toString 方法，将其转为字符串，然后才生成一个 Symbol 值。

```js
const obj = {
  toString() {
    return "abc";
  }
};
const sym = Symbol(obj);
console.log(sym); // Symbol(abc)
```

6. Symbol 函数的参数只是表示对当前 Symbol 值的描述，相同参数的 Symbol 函数的返回值是不相等的。

```js
// 没有参数的情况
var s1 = Symbol();
var s2 = Symbol();

console.log(s1 === s2); // false

// 有参数的情况
var s1 = Symbol("foo");
var s2 = Symbol("foo");

console.log(s1 === s2); // false
```

7. Symbol 值不能与其他类型的值进行运算，会报错。

```js
var sym = Symbol("My symbol");

console.log("your symbol is " + sym); // TypeError: can't convert symbol to string
```

8. Symbol 值可以显式转为字符串。

```js
var sym = Symbol("My symbol");

console.log(String(sym)); // 'Symbol(My symbol)'
console.log(sym.toString()); // 'Symbol(My symbol)'
```

9. Symbol 值可以作为标识符，用于对象的属性名，可以保证不会出现同名的属性。

```js
var mySymbol = Symbol();

// 第一种写法
var a = {};
a[mySymbol] = "Hello!";

// 第二种写法
var a = {
  [mySymbol]: "Hello!"
};

// 第三种写法
var a = {};
Object.defineProperty(a, mySymbol, { value: "Hello!" });

// 以上写法都得到同样结果
console.log(a[mySymbol]); // "Hello!"
```

10. Symbol 作为属性名，该属性不会出现在 `for...in`、`for...of` 循环中，也不会被 `Object.keys()`、`Object.getOwnPropertyNames()`、`JSON.stringify()` 返回。但是，它也不是私有属性，有一个 `Object.getOwnPropertySymbols` 方法，可以获取指定对象的所有 Symbol 属性名。

```js
var obj = {};
var a = Symbol("a");
var b = Symbol("b");

obj[a] = "Hello";
obj[b] = "World";

var objectSymbols = Object.getOwnPropertySymbols(obj);

console.log(objectSymbols);
// [Symbol(a), Symbol(b)]
```

11. 如果我们希望使用同一个 Symbol 值，可以使用 `Symbol.for`。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就新建并返回一个以该字符串为名称的 Symbol 值。

```js
var s1 = Symbol.for("foo");
var s2 = Symbol.for("foo");

console.log(s1 === s2); // true
```

12. `Symbol.keyFor` 方法返回一个已登记的 Symbol 类型值的 key。

```js
var s1 = Symbol.for("foo");
console.log(Symbol.keyFor(s1)); // "foo"

var s2 = Symbol("foo");
console.log(Symbol.keyFor(s2)); // undefined
```

原文链接：[ES6 系列之模拟实现 Symbol 类型](https://github.com/mqyqingfeng/Blog/issues/87)

## ES6 系列之迭代器与 for of

所谓**迭代器**，其实就是一个具有 next() 方法的对象，每次调用 next() 都会返回一个结果对象，该结果对象有两个属性，value 表示当前的值，done 表示遍历是否结束。

用 ES5 的语法创建一个迭代器：

```js
function createIterator(item) {
  var i = 0;
  return {
    next: function() {
      var done = i >= item.length;
      var value = !done ? item[i++] : undefined;
      return {
        done: done,
        value: value
      };
    }
  };
}

var itera = createIterator([1, 2, 3]);
itera.next(); // {value: 1, done: false}
itera.next(); // {value: 2, done: false}
itera.next(); // {value: 3, done: false}
itera.next(); // {value: undefined, done: true}
```

除了迭代器之外，我们还需要一个可以遍历迭代器对象的方式，ES6 提供了 **for of** 语句，我们无法直接用 for of 遍历对象，需要部署了 Iterator 接口“可遍历的”（iterable）对象，for of 遍历的其实是对象的 `Symbol.iterator` 属性。如：

```js
var o = {
  value: 1
};

for (value of o) {
  console.log(value); // Uncaught TypeError: o is not iterable
}

// 给该对象添加 Symbol.iterator 属性
o[Symbol.iterator] = function() {
  return createIterator([1, 2, 3]);
};

for (value of o) {
  console.log(value);
}
// 1
// 2
// 3
```

所以，优化下 createIterator：

```js
function createIterator(items) {
  function addIterator(items) {
    let i = 0;
    let done = false;
    return {
      next() {
        done = i >= items.length;
        return {
          value: items[i++],
          done
        };
      }
    };
  }
  let iterator = addIterator(items);
  iterator[Symbol.iterator] = () => addIterator(items);
  return iterator;
}
```

一些数据结构默认部署了 **Symbol.iterator** 属性：

1. 数组
1. Set
1. Map
1. 类数组对象，如 arguments 对象、DOM NodeList 对象
1. Generator 对象
1. 字符串

模拟实现 for of：

```js
function forOf(obj, cb) {
  let iterable, result;

  if (typeof obj[Symbol.iterator] !== "function")
    throw new TypeError(result + " is not iterable");
  if (typeof cb !== "function") throw new TypeError("cb must be callable");

  iterable = obj[Symbol.iterator]();

  result = iterable.next();
  while (!result.done) {
    cb(result.value);
    result = iterable.next();
  }
}
```

ES6 为数组、Map、Set 集合内建了以下三种**迭代器**：

- **entries()** 返回一个遍历器对象，用来遍历`[键名, 键值]`组成的数组。对于数组，键名就是索引值。
- **keys()** 返回一个遍历器对象，用来遍历所有的键名。
- **values()** 返回一个遍历器对象，用来遍历所有的键值。

Map 类型与数组类似，Set 类型的 keys() 和 values() 返回的是相同的迭代器，这也意味着在 Set 这种数据结构中键名与键值相同。

```js
const values = new Set([1, 2, 3]);
const valuess = new Map([
  ["key1", "value1"],
  ["key2", "value2"]
]);

for (let value of values) {
  console.log(value);
}
// 1
// 2
// 3

for (let [key, value] of valuess) {
  console.log(key + ":" + value);
}
// key1:value1
// key2:value2
```

原文链接：[ES6 系列之迭代器与 for of](https://github.com/mqyqingfeng/Blog/issues/90)

## ES6 系列之模拟实现一个 Set 数据结构

Set 函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。

```js
let set = new Set([1, 2, 3, 4, 4]);
console.log(set); // Set(4) {1, 2, 3, 4}

set = new Set(new Set([1, 2, 3, 4]));
console.log(set.size); // 4
```

**操作方法**有：

- **add(value)**：添加某个值，返回 Set 结构本身。
- **delete(value)**：删除某个值，返回一个布尔值，表示删除是否成功。
- **has(value)**：返回一个布尔值，表示该值是否为 Set 的成员。
- **clear()**：清除所有成员，无返回值。

**遍历方法**有：

- **keys()**：返回键名的遍历器
- **values()**：返回键值的遍历器
- **entries()**：返回键值对的遍历器
- **forEach()**：使用回调函数遍历每个成员，无返回值

注意 keys()、values()、entries() 返回的是**遍历器**。

**属性**：

- **Set.prototype.constructor**：构造函数，默认就是 Set 函数。
- **Set.prototype.size**：返回 Set 实例的成员总数。

模拟实现一个 Set 数据结构：

```js
(function(global) {
  var NaNSymbol = Symbol("NaN");

  var encodeVal = function(value) {
    return value !== value ? NaNSymbol : value;
  };

  var decodeVal = function(value) {
    return value === NaNSymbol ? NaN : value;
  };

  var makeIterator = function(array, iterator) {
    var nextIndex = 0;

    // new Set(new Set()) 会调用这里
    var obj = {
      next: function() {
        return nextIndex < array.length
          ? { value: iterator(array[nextIndex++]), done: false }
          : { value: void 0, done: true };
      }
    };

    // [...set.keys()] 会调用这里
    obj[Symbol.iterator] = function() {
      return obj;
    };

    return obj;
  };

  function forOf(obj, cb) {
    let iterable, result;

    if (typeof obj[Symbol.iterator] !== "function")
      throw new TypeError(obj + " is not iterable");
    if (typeof cb !== "function") throw new TypeError("cb must be callable");

    iterable = obj[Symbol.iterator]();

    result = iterable.next();
    while (!result.done) {
      cb(result.value);
      result = iterable.next();
    }
  }

  function Set(data) {
    this._values = [];
    this.size = 0;

    forOf(data, item => {
      this.add(item);
    });
  }

  Set.prototype["add"] = function(value) {
    value = encodeVal(value);
    if (this._values.indexOf(value) == -1) {
      this._values.push(value);
      ++this.size;
    }
    return this;
  };

  Set.prototype["has"] = function(value) {
    return this._values.indexOf(encodeVal(value)) !== -1;
  };

  Set.prototype["delete"] = function(value) {
    var idx = this._values.indexOf(encodeVal(value));
    if (idx == -1) return false;
    this._values.splice(idx, 1);
    --this.size;
    return true;
  };

  Set.prototype["clear"] = function(value) {
    this._values = [];
    this.size = 0;
  };

  Set.prototype["forEach"] = function(callbackFn, thisArg) {
    thisArg = thisArg || global;
    for (var i = 0; i < this._values.length; i++) {
      callbackFn.call(thisArg, this._values[i], this._values[i], this);
    }
  };

  Set.prototype["values"] = Set.prototype["keys"] = function() {
    return makeIterator(this._values, function(value) {
      return decodeVal(value);
    });
  };

  Set.prototype["entries"] = function() {
    return makeIterator(this._values, function(value) {
      return [decodeVal(value), decodeVal(value)];
    });
  };

  Set.prototype[Symbol.iterator] = function() {
    return this.values();
  };

  Set.prototype["forEach"] = function(callbackFn, thisArg) {
    thisArg = thisArg || global;
    var iterator = this.entries();

    forOf(iterator, item => {
      callbackFn.call(thisArg, item[1], item[0], this);
    });
  };

  Set.length = 0;

  global.Set = Set;
})(this);
```

测试：

```js
let set = new Set(new Set([1, 2, 3]));
console.log(set.size); // 3

console.log([...set.keys()]); // [1, 2, 3]
console.log([...set.values()]); // [1, 2, 3]
console.log([...set.entries()]); // [1, 2, 3]
```

原文链接：[ES6 系列之模拟实现一个 Set 数据结构](https://github.com/mqyqingfeng/Blog/issues/91)

## ES6 系列之 WeakMap

### WeakMap 特性

**1.WeakMap 只接受对象作为键名**

```js
const map = new WeakMap();
map.set(1, 2);
// Uncaught TypeError: Invalid value used as weak map key
map.set(null, 2);
// Uncaught TypeError: Invalid value used as weak map key
```

**2.WeakMap 的键名所引用的对象是弱引用**

就是 WeakMaps 保持了对键名所引用的对象的弱引用，即**垃圾回收机制**不将该引用考虑在内。只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会**自动消失**，不用手动删除引用。

也正是因为这样的特性，WeakMap 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此 ES6 规定 **WeakMap 不可遍历**。

所以 WeakMap 不像 Map，一是**没有遍历操作**（即没有 keys()、values()和 entries()方法），也**没有 size 属性**，也**不支持 clear 方法**，所以 WeakMap 只有四个方法可用：**get()、set()、has()、delete()**。

### WeakMap 应用

**1.在 DOM 对象上保存相关数据**

```js
let wm = new WeakMap(),
  element = document.querySelector(".element");
wm.set(element, "data");

let value = wm.get(elemet);
console.log(value); // data

element.parentNode.removeChild(element);
element = null;
```

**2.数据缓存**

```js
const cache = new WeakMap();
function countOwnKeys(obj) {
  if (cache.has(obj)) {
    console.log("Cached");
    return cache.get(obj);
  } else {
    console.log("Computed");
    const count = Object.keys(obj).length;
    cache.set(obj, count);
    return count;
  }
}
```

**3.数据缓存**

```js
const privateData = new WeakMap();

class Person {
  constructor(name, age) {
    privateData.set(this, { name: name, age: age });
  }

  getName() {
    return privateData.get(this).name;
  }

  getAge() {
    return privateData.get(this).age;
  }
}

export default Person;
```

原文链接：[ES6 系列之 WeakMap](https://github.com/mqyqingfeng/Blog/issues/92)

## ES6 系列之 Promise

总结一下**回调函数**的情况：

- 回调函数执行多次
- 回调函数没有执行
- 回调函数有时同步执行有时异步执行

对于这些情况，可能都要在回调函数中做些处理，并且每次执行回调函数的时候都要做些处理，这就带来了很多重复的代码。

**回调地狱**的其他问题：

- 难以复用
- 堆栈信息被断开
- 借助外层变量

**Promise** 使得以上绝大部分的问题都得到了解决。

1. 嵌套问题

```js
request(url)
  .then(function(result) {
    return writeFileAsynv("1.txt", result);
  })
  .then(function(result) {
    return request(url2);
  })
  .catch(function(e) {
    handleError(e);
  });
```

2. 控制反转再反转

使用第三方回调 API 的时候，可能会遇到如下问题：

1. 回调函数执行多次
1. 回调函数没有执行
1. 回调函数有时同步执行有时异步执行

对于第一个问题，Promise 只能 resolve 一次，剩下的调用都会被忽略。

对于第二个问题，我们可以使用 Promise.race 函数来解决。

对于第三个问题，即使 promise 对象立刻进入 resolved 状态，即同步调用 resolve 函数，then 函数中指定的方法依然是异步进行的。

PromiseA+ 规范也有明确的规定：

> 实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。

**Promise 的局限性**：

1. 错误被吃掉

其实这并不是 Promise 独有的局限性，try catch 也是这样，同样会捕获一个异常并简单的吃掉错误。

而正是因为错误被吃掉，Promise 链中的错误很容易被忽略掉，这也是为什么会一般推荐在 Promise 链的最后添加一个 catch 函数，因为对于一个没有错误处理函数的 Promise 链，任何错误都会在链中被传播下去，直到你注册了错误处理函数。

2. 单一值

Promise 只能有一个完成值或一个拒绝原因，当需要传递多个值时，构造成一个对象或数组，然后再传递，then 中获得这个值后，又会进行取值赋值的操作。使用 ES6 的解构赋值：

```js
Promise.all([Promise.resolve(1), Promise.resolve(2)]).then(([x, y]) => {
  console.log(x, y); // 1 2
});
```

3. 无法取消

Promise 一旦新建它就会立即执行，无法中途取消。

4. 无法得知 pending 状态

当处于 pending 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

原文链接：[ES6 系列之我们来聊聊 Promise](https://github.com/mqyqingfeng/Blog/issues/98)

## ES6 系列之 Generator 的自动执行

```js
function run(gen) {
  return new Promise(function(resolve, reject) {
    if (typeof gen == "function") gen = gen();

    // 如果 gen 不是一个迭代器
    if (!gen || typeof gen.next !== "function") return resolve(gen);

    onFulfilled();

    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    function onRejected(err) {
      var ret;
      try {
        ret = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    function next(ret) {
      if (ret.done) return resolve(ret.value);
      var value = toPromise(ret.value);
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
      return onRejected(
        new TypeError(
          "You may only yield a function, promise " +
            'but the following object was passed: "' +
            String(ret.value) +
            '"'
        )
      );
    }
  });
}

function isPromise(obj) {
  return "function" == typeof obj.then;
}

function toPromise(obj) {
  if (isPromise(obj)) return obj;
  if ("function" == typeof obj) return thunkToPromise(obj);
  return obj;
}

function thunkToPromise(fn) {
  return new Promise(function(resolve, reject) {
    fn(function(err, res) {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

module.exports = run;
```

原文链接：[ES6 系列之 Generator 的自动执行](https://github.com/mqyqingfeng/Blog/issues/99)

## ES6 系列之 Async

ES2017 标准引入了 **async** 函数，使得异步操作变得更加方便。在异步处理上，async 函数就是 Generator 函数的语法糖。

其实 async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里。

```js
async function fn(args) {
  // ...
}

// 等同于
function fn(args) {
  // spawn 函数指的是自动执行器，就比如说 co
  return spawn(function*() {
    // ...
  });
}
```

使用 async 会比使用 Promise 更优雅的处理异步流程。

1. 代码更加简洁

```js
function fetch() {
  return (
    fetchData()
    .then(() => {
      return "done"
    });
  )
}

async function fetch() {
  await fetchData()
  return "done"
};
```

2. 错误处理

```js
function fetch() {
  try {
    fetchData()
      .then(result => {
        const data = JSON.parse(result);
      })
      .catch(err => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
}
```

`try/catch` 能捕获 fetchData() 中的一些 Promise 构造错误，但是不能捕获 JSON.parse 抛出的异常，如果要处理 JSON.parse 抛出的异常，需要添加 catch 函数重复一遍异常处理的逻辑。

`async/await` 的出现使得 `try/catch` 就可以捕获同步和异步的错误。

```js
async function fetch() {
  try {
    const data = JSON.parse(await fetchData());
  } catch (err) {
    console.log(err);
  }
}
```

3. 调试

因为 then 中的代码是异步执行，所以当你打断点的时候，代码不会顺序执行。而使用 async 的时候，则可以像调试同步代码一样调试。

**问题：给定一个 URL 数组，如何实现接口的继发和并发？**

async 继发实现：

```js
// 继发一
async function loadData() {
  var res1 = await fetch(url1);
  var res2 = await fetch(url2);
  var res3 = await fetch(url3);
  return "whew all done";
}
// 继发二
async function loadData(urls) {
  for (const url of urls) {
    const response = await fetch(url);
    console.log(await response.text());
  }
}
```

async 并发实现：

```js
// 并发一
async function loadData() {
  var res = await Promise.all([fetch(url1), fetch(url2), fetch(url3)]);
  return "whew all done";
}
// 并发二
async function loadData(urls) {
  // 并发读取 url
  const textPromises = urls.map(async url => {
    const response = await fetch(url);
    return response.text();
  });

  // 按次序输出
  for (const textPromise of textPromises) {
    console.log(await textPromise);
  }
}
```

**async 错误捕获**：为了简化比较复杂的捕获，我们可以给 await 后的 promise 对象添加 catch 函数:

```js
// to.js
export default function to(promise) {
  return promise
    .then(data => {
      return [null, data];
    })
    .catch(err => [err]);
}
// 使用
[err, user] = await to(UserModel.findById(1));
```

**async 会取代 Generator 吗？**

Generator 本来是用作生成器，使用 Generator 处理异步请求只是一个比较 hack 的用法，在异步方面，async 可以取代 Generator，但是 async 和 Generator 两个语法本身是用来解决不同的问题的。

**async 会取代 Promise 吗？**

- async 函数返回一个 Promise 对象
- 面对复杂的异步流程，Promise 提供的 all 和 race 会更加好用
- Promise 本身是一个对象，所以可以在代码中任意传递
- async 的支持率还很低，即使有 Babel，编译后也要增加 1000 行左右。

## ES6 系列之我们来聊聊 Async

原文链接：[ES6 系列之我们来聊聊 Async](https://github.com/mqyqingfeng/Blog/issues/100)

## ES6 系列之异步处理实战

原文链接：[ES6 系列之异步处理实战](https://github.com/mqyqingfeng/Blog/issues/101)

原文链接：[ES6 系列之 Babel 将 Generator 编译成了什么样子](https://github.com/mqyqingfeng/Blog/issues/102)

原文链接：[ES6 系列之 Babel 将 Async 编译成了什么样子](https://github.com/mqyqingfeng/Blog/issues/103)

## ES6 系列之 Class

### class

ES6 的 class 可以看作一个语法糖，它的绝大部分功能，ES5 都可以做到，新的 class 写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。

```js
class Person {
  // 类的内部所有定义的方法，都是不可枚举的
  constructor(name) {
    // 实例属性
    this.name = name;
  }

  // 实例方法
  sayHello() {
    return "hello, I am " + this.name;
  }

  // 静态属性
  static _name = "ming";

  // 静态方法
  static _getName() {
    return "my name is " + this._name;
  }

  // getter 和 setter
  get age() {
    return "20 years old";
  }
  set age(newAge) {
    console.log("new age 为：" + newAge);
  }
}
// 静态属性
// Person._name = "ming";

var me = new Person("tao");

me.age = 28;
// new age 为：28

console.log(me.age); // 20 years old
console.log(me.name); // tao
console.log(me._name); // undefined
console.log(me._getName()); // Uncaught TypeError: me.getName is not a function

console.log(Person._name); // ming
console.log(Person._getName()); // my name is ming

Person(); // Uncaught TypeError: Class constructor Person cannot be invoked without 'new'
```

转换成 ES5：

```js
function Person(name) {
  // 实例属性
  this.name = name;
}

// 静态属性、方法
Person._name = "ming";
Person._getName = function() {
  return "my name " + this._name;
};

Person.prototype = {
  constructor: Person,
  // getter 和 setter
  get age() {
    return "20 years old";
  },
  set age(newAge) {
    console.log("new age 为：" + newAge);
  },
  // 实例方法
  sayHello() {
    return "hello, I am " + this.name;
  }
};

var me = new Person("tao");

me.age = 28;
// new age 为：28

console.log(me.age); // 20 years old
console.log(me.name); // tao
console.log(me._name); // undefined
// console.log(me._getName()); // Uncaught TypeError: me.getName is not a function

console.log(Person._name); // ming
console.log(Person._getName()); // my name is ming

Person(); // 无报错
```

Babel 编译结果：[地址](https://babel.docschina.org/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=MYGwhgzhAEAKCmAnCB7AdtA3gKGtA9PtIN4-gIW6ChioBcJgAkaCQ5oFnagknKmCdpoKs2gMP-C_CYPRmgsHKB75UBZ5oD45UrmjB0EAC6IArsBkpEACjRgAtvACUWCXkLRAedqBo-UB6OoHIDA9BkALAJYQAdBu3QAvNDfwA3DfsnZzAAc3hPaAAmAAZ_PABfbAkjM3YJCDAATwAJeBAQFFU9HDw8RHgZeUQMACI7PIKAGmgASWgtaBroAGpbRxcfOOhE5KJATXTAQAMrUehZMBkHYGgAfR8Ims0HNBCa_xnJtLw5haXlsJkAOS14Iv1S6HLK6ugAck1M72voJ1eevqDVtchiNDERzjIkNBADEqswqEMQEnO7TCtxKpUeVQwLxi0Ey8DAyGgKBAABMXsD0hVkTc0PAAO4AQTCxRsUjQqBA8GcBRCqhetLp1OggC45QBY_y8_gKmboJIkRkZJtMEMh0M5Ae4vG8tiFyUA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Ces2016%2Ces2017%2Cstage-0%2Cstage-1%2Cstage-2%2Cstage-3%2Ces2015-loose&prettier=true&targets=&version=6.26.0&envVersion=)。

### ES6 extend

Class 通过 **extends** 关键字实现继承，这比 ES5 的通过修改原型链实现继承，要清晰和方便很多。

```js
class Parent {
  constructor(name) {
    this.name = name;
  }
}

class Child extends Parent {
  constructor(name, age) {
    // super 关键字表示父类的构造函数，相当于 ES5 的 Parent.call(this)
    super(name);
    this.age = age;
  }
}

var child1 = new Child("kevin", "18");

console.log(child1);
```

对应 ES5 寄生组合式继承：

```js
function Parent(name) {
  this.name = name;
}

Parent.prototype.getName = function() {
  console.log(this.name);
};

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

var child1 = new Child("kevin", "18");
console.log(child1);
```

### 子类的 **proto**

在 ES6 中，父类的静态方法，可以被子类继承。

这是因为 Class 作为构造函数的语法糖，同时有 prototype 属性和 `__proto__` 属性，因此同时存在两条继承链。

1. 子类的 `__proto__` 属性，表示构造函数的继承，总是指向父类。
1. 子类 prototype 属性的 `__proto__`属性，表示方法的继承，总是指向父类的 prototype 属性。

```js
class Parent {}

class Child extends Parent {}

// 相比寄生组合式继承，ES6 的 class 多了一个 Object.setPrototypeOf(Child, Parent) 的步骤。
console.log(Child.__proto__ === Parent); // true
console.log(Child.prototype.__proto__ === Parent.prototype); // true
```

原文链接：

- [ES6 系列之 Babel 是如何编译 Class 的(上)](https://github.com/mqyqingfeng/Blog/issues/105)
- [ES6 系列之 Babel 是如何编译 Class 的(下)](https://github.com/mqyqingfeng/Blog/issues/106)

## ES6 系列之 defineProperty 与 proxy

### definePropety

ES5 提供了 **Object.defineProperty** 方法，该方法可以在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回这个对象。

语法

```js
Object.defineProperty(obj, prop, descriptor);
```

参数

- **obj**: 要在其上定义属性的对象。
- **prop**: 要定义或修改的属性的名称。
- **descriptor**: 将被定义或修改的属性的描述符。

```js
var obj = {};
Object.defineProperty(obj, "num", {
  value: 1,
  writable: true,
  enumerable: true,
  configurable: true
});
//  对象 obj 拥有属性 num，值为 1
```

函数的第三个参数 **descriptor** 所表示的属性描述符有两种形式：**数据描述符**和**存取描述符**。

**两者均具有以下两种键值**：

- configurable

当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，也能够被删除。默认为 false。

- enumerable

当且仅当该属性的 enumerable 为 true 时，该属性才能够出现在对象的枚举属性中。默认为 false。

**数据描述符同时具有以下可选键值**：

- value

该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined。

- writable

当且仅当该属性的 writable 为 true 时，该属性才能被赋值运算符改变。默认为 false。

**存取描述符同时具有以下可选键值**：

- get

一个给属性提供 getter 的方法，如果没有 getter 则为 undefined。该方法返回值被用作属性值。默认为 undefined。

- set

一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。该方法将接受唯一参数，并将该参数的新值分配给该属性。默认为 undefined。

**注意**：属性描述符必须是数据描述符或者存取描述符两种形式之一，不能同时是两者 。

此外，所有的属性描述符都是非必须的，但是 **descriptor 这个字段是必须**的，如果不进行任何配置，你可以这样：

```js
var obj = Object.defineProperty({}, "num", {});
console.log(obj.num); // undefined
```

### Setters 和 Getters

我们要使用存取描述符中的 get 和 set，这两个方法又被称为 getter 和 setter。由 getter 和 setter 定义的属性称做”存取器属性“。

例子：watch 可以监控对象属性值的改变，并且可以根据属性值的改变，添加回调函数

```js
(function() {
  var root = this;
  function watch(obj, name, fn) {
    var value = obj[name];
    Object.defineProperty(obj, name, {
      get: function() {
        return value;
      },
      set: function(newValue) {
        value = newValue;
        fn(value);
      }
    });
    if (value) obj[name] = value;
  }
  this.watch = watch;
})();
```

使用：

```js
var obj = {
  value: 1
};

watch(obj, "value", function(newvalue) {
  document.getElementById("container").innerHTML = newvalue;
});

document.getElementById("button").addEventListener("click", function() {
  obj.value += 1;
});
```

### proxy

使用 defineProperty 只能重定义属性的读取（get）和设置（set）行为，到了 ES6，提供了 Proxy，可以重定义更多的行为，比如 in、delete、函数调用等更多行为。

Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例。

```js
var proxy = new Proxy(target, handler);
```

new Proxy()表示生成一个 Proxy 实例，target 参数表示所要拦截的目标对象，handler 参数也是一个对象，用来定制拦截行为。

例子：

```js
(function() {
  var root = this;
  function watch(target, fn) {
    return new Proxy(target, {
      get(target, prop) {
        return target[prop];
      },
      set(target, prop, value) {
        target[prop] = value;
        fn(prop, value);
      }
    });
  }
  this.watchProxy = watch;
})();

var obj = {
  value: 1
};

var newObj = watchProxy(obj, function(key, newvalue) {
  if (key === "value") {
    document.getElementById("container").innerHTML = newvalue;
  }
});

document.getElementById("button").addEventListener("click", function() {
  newObj.value += 1;
});
```

可以发现，使用 defineProperty 和 proxy 的**区别**，当使用 defineProperty，我们修改原来的 obj 对象就可以触发拦截，而使用 proxy，就必须修改代理对象，即 Proxy 的实例才可以触发拦截。

**Proxy**：

- 代理的是 对象
- 可以拦截到数组的变化
- 拦截的方法多达 13 种
- 返回一个拦截后的数据

**Object.defineProperty**：

- 代理的是属性
- 对数组数据的变化无能为力
- 直接修改原始数据

原文链接：[ES6 系列之 defineProperty 与 proxy](https://github.com/mqyqingfeng/Blog/issues/107)

## ES6 系列之模块加载方案

### AMD 与 CMD 的区别

- CMD 推崇**依赖就近**，AMD 推崇**依赖前置**。

require.js:

```js
// main.js
// 依赖必须一开始就写好
require(["./add", "./square"], function(addModule, squareModule) {
  console.log(addModule.add(1, 1));
  console.log(squareModule.square(3));
});

// square.js
define(["./multiply"], function(multiplyModule) {
  console.log("加载了 square 模块");
  return {
    square: function(num) {
      return multiplyModule.multiply(num, num);
    }
  };
});
```

sea.js 例子中的 main.js

```js
define(function(require, exports, module) {
  var addModule = require("./add");
  console.log(addModule.add(1, 1));

  // 依赖可以就近书写
  var squareModule = require("./square");
  console.log(squareModule.square(3));
});

// square.js
define(function(require, exports, module) {
  console.log("加载了 square 模块");
  var multiplyModule = require("./multiply");
  module.exports = {
    square: function(num) {
      return multiplyModule.multiply(num, num);
    }
  };
});
```

- 对于依赖的模块，**AMD 是提前执行，CMD 是延迟执行**。打印顺序：

```js
// require.js
加载了 add 模块
加载了 multiply 模块
加载了 square 模块
2
9

// sea.js
加载了 add 模块
2
加载了 square 模块
加载了 multiply 模块
9
```

AMD 是将需要使用的模块先加载完再执行代码，而 CMD 是在 require 的时候才去加载模块文件，加载完再接着执行。

### CommonJS

AMD 和 CMD 都是用于浏览器端的模块规范，而在服务器端比如 node，采用的则是 CommonJS 规范。

跟 sea.js 的执行结果一致，也是在 require 的时候才去加载模块文件，加载完再接着执行。

导出模块的方式：

```js
var add = function(x, y) {
  return x + y;
};

module.exports.add = add;
```

引入模块的方式：

```js
var add = require("./add.js");
```

### CommonJS 与 AMD

引用**阮一峰**老师的《JavaScript 标准参考教程（alpha）》:

CommonJS 规范加载模块是**同步**的，也就是说，只有加载完成，才能执行后面的操作。

AMD 规范则是**非同步**加载模块，允许指定回调函数。

由于 Node.js 主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以 CommonJS 规范比较适用。

但是，如果是浏览器环境，要从服务器端加载模块，这时就**必须采用非同步模式**，因此浏览器端一般采用 AMD 规范。

### ES6

导出模块的方式：

```js
// profile.js
var firstName = "Michael";
var lastName = "Jackson";
var year = 1958;

export { firstName, lastName, year };
```

引入模块的方式：

```js
import { firstName, lastName, year } from "./profile";
```

跟 require.js 的执行结果是一致的，也就是将需要使用的模块先加载完再执行代码。

### ES6 与 CommonJS

引用阮一峰老师的 《ECMAScript 6 入门》：

它们有**两个重大差异**。

1. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
1. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

第一个差异：

ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令 import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。

换句话说，ES6 的 import 有点像 Unix 系统的“符号连接”，原始值变了，import 加载的值也会跟着变。因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。

第二个差异可以从两个项目的打印结果看出，导致这种差别的原因是：

因为 CommonJS 加载的是一个**对象**（即 module.exports 属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种**静态定义**，在代码静态解析阶段就会生成。

### Babel

鉴于浏览器支持度的问题，如果要使用 ES6 的语法，一般都会借助 Babel。

不过 Babel 只是把 ES6 模块语法转为 CommonJS 模块语法，然而浏览器是不支持这种模块语法的，所以直接跑在浏览器会报错的，如果想要在浏览器中运行，还是需要使用打包工具将代码打包，如 webpack。

但是 webpack 又是怎么做的打包的呢？它该如何将这些文件打包在一起，从而能保证正确的处理依赖，以及能在浏览器中运行呢？

首先为什么浏览器中不支持 CommonJS 语法呢？

这是因为浏览器环境中并没有 module、 exports、 require 等环境变量。

换句话说，webpack 打包后的文件之所以在浏览器中能运行，就是靠模拟了这些变量的行为。比如：

```js
console.log("加载了 square 模块");

var multiply = require("./multiply.js");

var square = function(num) {
  return multiply.multiply(num, num);
};

module.exports.square = square;
```

webpack 会将其包裹一层，注入这些变量：

```js
(function(module, exports, require) {
  console.log("加载了 square 模块");

  var multiply = require("./multiply");
  module.exports = {
    square: function(num) {
      return multiply.multiply(num, num);
    }
  };
})();
```

原文链接：[ES6 系列之模块加载方案](https://github.com/mqyqingfeng/Blog/issues/108)

## ES6 系列之我们来聊聊装饰器

原文链接：[ES6 系列之我们来聊聊装饰器](https://github.com/mqyqingfeng/Blog/issues/109)

## ES6 系列之私有变量的实现

1. 约定

实现

```js
class Example {
  constructor() {
    this._private = "private";
  }
  getName() {
    return this._private;
  }
}

var ex = new Example();

console.log(ex.getName()); // private
console.log(ex._private); // private
```

优点

- 写法简单
- 调试方便
- 兼容性好

缺点

- 外部可以访问和修改
- 语言没有配合的机制，如 for in 语句会将所有属性枚举出来
- 命名冲突

2. 闭包

```js
class Example {
  constructor() {
    var _private = "";
    _private = "private";
    this.getName = function() {
      return _private;
    };
  }
}

var ex = new Example();

console.log(ex.getName()); // private
console.log(ex._private); // undefined
```

优点

- 无命名冲突
- 外部无法访问和修改

缺点

- constructor 的逻辑变得复杂。构造函数应该只做对象初始化的事情，现在为了实现私有变量，必须包含部分方法的实现，代码组织上略不清晰。
- 方法存在于实例，而非原型上，子类也无法使用 super 调用
- 构建增加一点点开销

1. Symbol

```js
const Example = (function() {
  var _private = Symbol("private");

  class Example {
    constructor() {
      this[_private] = "private";
    }
    getName() {
      return this[_private];
    }
  }

  return Example;
})();

var ex = new Example();

console.log(ex.getName()); // private
console.log(ex._private); // undefined
```

优点

- 无命名冲突
- 外部无法访问和修改
- 无性能损失

缺点

- 写法稍微复杂
- 兼容性也还好

4. WeakMap

```js
const Example = (function() {
  var _private = new WeakMap(); // 私有成员存储容器

  class Example {
    constructor() {
      _private.set(this, "private");
    }
    getName() {
      return _private.get(this);
    }
  }

  return Example;
})();

var ex = new Example();

console.log(ex.getName()); // private
console.log(ex._private); // undefined
```

优点

- 无命名冲突
- 外部无法访问和修改

缺点

- 写法比较麻烦
- 兼容性有点问题
- 有一定性能代价

5. 最新提案

```js
class Point {
  #x;
  #y;

  constructor(x, y) {
    this.#x = x;
    this.#y = y;
  }

  equals(point) {
    return this.#x === point.#x && this.#y === point.#y;
  }
}
```

原文链接：[ES6 系列之私有变量的实现](https://github.com/mqyqingfeng/Blog/issues/110)

## ES6 完全使用手册

原文链接：[ES6 完全使用手册](https://github.com/mqyqingfeng/Blog/issues/111)
