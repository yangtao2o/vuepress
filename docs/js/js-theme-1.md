# 学习冴羽的 JS 专题系列·上篇

## 跟着 underscore 学防抖

在前端开发中会遇到一些频繁的事件触发，比如：

- window 的 resize、scroll
- mousedown、mousemove
- keyup、keydown

### 防抖

防抖的原理就是：

你尽管触发事件，但是我一定在事件触发 n 秒后才执行，如果你在一个事件触发的 n 秒内又触发了这个事件，那我就以新的事件的时间为准，n 秒后才执行。

总之，就是要等你触发完事件 n 秒内不再触发事件，我才执行!

### 起步

```js
function debounce(func, wait) {
  var timer;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(func, wait);
  };
}
```

### this、arguments、返回值

```js
function debounce(func, wait) {
  var timer;
  return function() {
    var _this = this;
    var args = arguments;

    clearTimeout(timer);
    timer = setTimeout(function() {
      var result = func.apply(_this, args);
    }, wait);

    return result;
  };
}
```

### 立刻执行

这个需求就是：

我不希望非要等到事件停止触发后才执行，我希望立刻执行函数，然后等到停止触发 n 秒后，才可以重新触发执行。

```js
function debounce(func, wait, immediate) {
  var timerId, result;

  return function() {
    var _this = this;
    var _args = arguments;

    if (timerId) clearTimeout(timerId);
    if (immediate) {
      var callNow = !timerId;
      timerId = setTimeout(function() {
        timerId = null;
      }, wait);

      if (callNow) {
        result = func.apply(_this, _args);
      }
    } else {
      timerId = setTimeout(function() {
        result = func.apply(_this, _args);
      }, wait);
    }
    return result;
  };
}
```

需要理解：

- `timeId` 是闭包变量，初始化时是 `undefined`
- `setTimeout` 返回的是定时器的 id ，一个 > 0 的数字
- `clearTimeout` 不会改变 `timeId` 的值
- 若 `timeId` 经历过赋值，即执行过 `setTimeout` ，则 `!timeId` 为假

### 取消防抖

比如说我 debounce 的时间间隔是 10 秒钟，immediate 为 true，这样的话，我只有等 10 秒后才能重新触发事件，现在我希望有一个按钮，点击后，取消防抖，这样我再去触发，就可以又立刻执行啦。

```js
function debounce(func, wait, immediate) {
  var timerId, result;

  var debounced = function() {
    var _this = this;
    var _args = arguments;
    if (timerId) clearTimeout(timerId);
    if (immediate) {
      var callNow = !timerId;
      timerId = setTimeout(function() {
        timerId = null;
      }, wait);
      if (callNow) {
        result = func.apply(_this, _args);
      }
    } else {
      timerId = setTimeout(function() {
        result = func.apply(_this, _args);
      }, wait);
    }
    return result;
  };

  debounced.cancel = function() {
    clearTimeout(timerId);
    timerId = null;
  };

  return debounced;
}
```

用法：

```js
var setUseAction = debounce(getUserAction, 10000, true);
container.onmousemove = setUseAction;
button.addEventListener("click", function() {
  setUseAction.cancel();
});
```

原文地址：[JavaScript 专题之跟着 underscore 学防抖](https://github.com/mqyqingfeng/Blog/issues/22)

## 跟着 underscore 学节流

### 节流

节流的原理很简单：

如果你持续触发事件，每隔一段时间，只执行一次事件。

根据首次是否执行以及结束后是否执行，效果有所不同，实现的方式也有所不同。
我们用 leading 代表首次是否执行，trailing 代表结束后是否再执行一次。

关于节流的实现，有两种主流的实现方式，一种是使用时间戳，一种是设置定时器。

### 时间戳

当触发事件的时候，我们取出当前的时间戳，然后减去之前的时间戳(最一开始值设为 0 )，如果大于设置的时间周期，就执行函数，然后更新时间戳为当前的时间戳，如果小于，就不执行。

```js
function throttle(func, wait) {
  var context, args;
  var previous = 0;
  return function() {
    var now = +new Date();
    context = this;
    args = arguments;
    if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  };
}
```

### 定时器

当触发事件的时候，我们设置一个定时器，再触发事件的时候，如果定时器存在，就不执行，直到定时器执行，然后执行函数，清空定时器，这样就可以设置下个定时器。

```js
function throttle(func, wait) {
  var context, args, timeout;
  return function() {
    context = this;
    args = arguments;
    if (!timeout) {
      timeout = setTimeout(function() {
        timeout = null;
        func.apply(context, args);
      }, wait);
    }
  };
}
```

所以比较两个方法：

- 第一种事件会立刻执行，第二种事件会在 n 秒后第一次执行
- 第一种事件停止触发后没有办法再执行事件，第二种事件停止触发后依然会再执行一次事件

### 双剑合璧

鼠标移入能立刻执行，停止触发的时候还能再执行一次！

```js
function throttle(func, wait) {
  var context, args, timeout, result;
  var previous = 0;

  var later = function() {
    previous = +new Date();
    timeout = null;
    result = func.apply(context, args);
  };

  var throttled = function() {
    var now = +new Date();
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      result = func.apply(context, args);
      previous = now;
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  return throttled;
}
```

### 优化

设置个 options 作为第三个参数，然后根据传的值判断到底哪种效果，我们约定:

- `leading：false` 表示禁用第一次执行
- `trailing: false` 表示禁用停止触发的回调

```js
function throttle(func, wait, options) {
  var context, args, timeout, result;
  var previous = 0;

  if (!options) {
    options = {};
  }

  var later = function() {
    previous = options.leading ? 0 : new Date().getTime();
    timeout = null;
    result = func.apply(context, args);
  };

  var throttled = function() {
    var now = new Date().getTime();
    if (!previous && options.leading === false) {
      previous = now;
    }
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      result = func.apply(context, args);
      previous = now;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  // 取消
  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = null;
  };

  return throttled;
}
```

注意：就是 `leading：false` 和 `trailing: false` 不能同时设置。

原文地址：[JavaScript 专题之跟着 underscore 学节流](https://github.com/mqyqingfeng/Blog/issues/26)

## 数组去重

### 双层循环

在这个方法中，我们使用循环嵌套，最外层循环 array，里面循环 res，如果 `array[i]` 的值跟 `res[j]` 的值相等，就跳出循环，如果都不等于，说明元素是唯一的，这时候 j 的值就会等于 res 的长度，根据这个特点进行判断，将值添加进 res。

```js
function unique(arr) {
  var res = [];

  for (var i = 0, arrLen = arr.length; i < arrLen; i++) {
    for (var j = 0, resLen = res.length; j < resLen; j++) {
      if (arr[i] === res[j]) {
        break;
      }
    }

    if (j === resLen) {
      res.push(arr[i]);
    }
  }
  return res;
}
```

### indexOf

```js
function unique(arr) {
  var res = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    var current = arr[i];
    if (res.indexOf(current) === -1) {
      res.push(current);
    }
  }
  return res;
}
```

### 排序后去重

先将要去重的数组使用 sort 方法排序后，相同的值就会被排在一起，然后我们就可以只判断当前元素与上一个元素是否相同，相同就说明重复，不相同就添加进 res。

```js
function unique(arr) {
  var res = [];
  var sortArr = arr.concat().sort();
  var seen;
  for (var i = 0, len = sortArr.length; i < len; i++) {
    if (!i || seen !== sortArr[i]) {
      res.push(sortArr[i]);
    }
    seen = sortArr[i];
  }
  return res;
}
```

### unique API

写一个名为 unique 的工具函数，我们根据一个参数 isSorted 判断传入的数组是否是已排序的，如果为 true，我们就判断相邻元素是否相同，如果为 false，我们就使用 indexOf 进行判断

```js
function unique(arr, isSorted) {
  var res = [];
  var seen;

  for (var i = 0, len = arr.length; i < len; i++) {
    var value = arr[i];
    if (isSorted) {
      if (!i || seen !== value) {
        res.push(value);
      }
      seen = value;
    } else if (res.indexOf(value) === -1) {
      res.push(value);
    }
  }
  return res;
}
```

### 优化

在这一版实现中，函数传递三个参数：

- array：表示要去重的数组，必填
- isSorted：表示函数传入的数组是否已排过序，如果为 true，将会采用更快的方法进行去重
- iteratee：传入一个函数，可以对每个元素进行重新的计算，然后根据处理的结果进行去重

```js
function unique(array, isSorted, iteratee) {
  var res = [];
  var seen = [];

  for (var i = 0, len = array.length; i < len; i++) {
    var value = array[i];
    var computed = iteratee ? iteratee(value, i, array) : value;

    if (isSorted) {
      if (!i || seen !== value) {
        res.push(value);
      }
      seen = value;
    } else if (iteratee) {
      if (seen.indexOf(computed) === -1) {
        seen.push(computed);
        res.push(value);
      }
    } else if (res.indexOf(value) === -1) {
      res.push(value);
    }
  }

  return res;
}
```

如：

```js
var arr = [1, 1, 2, 90, 1, "1", "a", "A"];
console.log(
  unique(arr, false, function(item) {
    return typeof item === "string" ? item.toLowerCase() : item;
  })
);
// [ 1, 2, 90, '1', 'a' ]
```

### filter

indexOf 方法：

```js
function unique(array) {
  return array.filter(function(value, index, array) {
    return array.indexOf(value) === index;
  });
}
```

排序去重方法：

```js
function unique(array) {
  return array
    .concat()
    .sort()
    .filter(function(value, index, array) {
      return !index || value !== array[index - 1];
    });
}
```

### Object 键值对

使用 `typeof item + item` （或者`item += typeof item`) 拼成字符串作为 key 值，避免 1 和 '1' 是相同的问题，比如：`'1number'`和`1string`。

```js
function unique(array) {
  var obj = {};
  return array.filter(function(item, index, array) {
    item += typeof item;
    return obj.hasOwnProperty(item) ? false : (obj[item] = true);
  });
}
```

### ES6

Set 去重：

```js
// 初始化
function unique(array) {
  return Array.from(new Set(array));
}

// 变形
function unique(array) {
  return [...new Set(array)];
}

// 超级变幻形态
let unique = arr => [...new Set(arr)];
```

数组去重合并：

```js
function combine() {
  const arr = [].concat.apply([], arguments);
  return Array.from(new Set(arr));
}
```

Map 去重：

```js
function unique(arr) {
  const seen = new Map();
  return arr.filter(item => !seen.has(item) && seen.set(item, null));
}
```

原文地址：[JavaScript 专题之数组去重](https://github.com/mqyqingfeng/Blog/issues/27)

## 类型判断

### typeof

最新的 ECMAScript 标准定义了 8 种数据类型:

7 种原始类型:

- Boolean
- Null
- Undefined
- Number
- String
- Symbol 
- BigInt

和 Object

使用 typeof 检测类型如下：

```js
Number is:  number
String is:  string
Boolean is:  boolean
Undefined is:  undefined
Null is:  object
Symbol is:  symbol
BigInt is:  bigint
Object is:  object
```

所以 typeof 能检测出七种基本类型的值，但是，除此之外 Object 下还有很多细分的类型呐，如 Array、Function、Date、RegExp、Error 等。

如果用 typeof 去检测这些类型，返回的都是 object，除了 Function：

```js
var date = new Date();
var error = new Error();
var fn = function() {};
console.log(typeof date);   // object
console.log(typeof error);  // object
console.log(typeof fn);   // function
```

### Object.prototype.toString

所有，该如何区分 object 呢？我们用`Object.prototype.toString`。

规范：当 toString 方法被调用的时候，下面的步骤会被执行：

- 如果 this 值是 undefined，就返回 `[object Undefined]`
- 如果 this 的值是 null，就返回 `[object Null]`
- 让 O 成为 `ToObject(this)` 的结果
- 让 class 成为 O 的内部属性 `[[Class]]` 的值
- 最后返回由 `"[object "` 和 `class` 和 `"]"` 三个部分组成的字符串

通过规范，我们至少知道了调用 `Object.prototype.toString` 会返回一个由 `"[object " 和 class 和 "]"` 组成的字符串，而 class 是要判断的对象的内部属性。

我们可以了解到这个 class 值就是识别对象类型的关键！

正是因为这种特性，我们可以用 `Object.prototype.toString` 方法识别出更多类型！

先看下常见的 15 种（ES6新增：Symbol Set Map，还有 BigInt）：

```js
var number = 1;            // [object Number]
var string = '123';        // [object String]
var boolean = true;        // [object Boolean]
var und = undefined;       // [object Undefined]
var nul = null;            // [object Null]
var obj = {a: 1}           // [object Object]
var array = [1, 2, 3];     // [object Array]
var date = new Date();     // [object Date]
var error = new Error();   // [object Error]
var reg = /a/g;            // [object RegExp]
var func = function a(){}; // [object Function]
var symb = Symbol('test'); // [object Symbol]
var set = new Set();       // [object Set]
var map = new Map();       // [object Map]
var bigI = BigInt(1);      // [object BigInt]

function checkType() {
  for(var i = 0, l = arguments.length; i < l; i++) {
    console.log(Object.prototype.toString.call(arguments[i]));
  }
}

checkType(number, string, boolean, und, nul, obj, array, date, error, reg, func, symb, set, map, bigI);
```

除了以上 15 种，还有以下 3 种：

```js
console.log(Object.prototype.toString.call(Math));  // [object Math]
console.log(Object.prototype.toString.call(JSON));  // [object JSON]

var fn = function() {
  console.log(Object.prototype.toString.call(arguments));  // [object Arguments]
}

fn();
```

### type API

写一个 type 函数能检测各种类型的值，如果是基本类型，就使用 typeof，引用类型就使用 toString。

此外鉴于 typeof 的结果是小写，我也希望所有的结果都是小写。

```js
var class2type = {};

"Boolean Number String Function Array Date RegExp Object Error Null Undefined"
  .split(" ")
  .map(function(item) {
    class2type["[object " + item + "]"] = item.toLowerCase(); // e.g. '[object Boolean]': 'boolean'
  });

function type(obj) {
  if (obj == null) {
    return obj + "";  // IE6
  }
  return typeof obj === "object" || typeof obj === "function"
    ? class2type[Object.prototype.toString.call(obj)] || "object"
    : typeof obj;
}
```

这里`class2type[Object.prototype.toString.call(obj)] || "object"`的 object，为了 ES6 新增的 Symbol、Map、Set 等类型返回 object。

当然也可以添加进去，返回的就是对应的类型：

```js
var class2type = {};

"Boolean Number String Function Array Date RegExp Object Error Null Undefined Symbol Set Map BigInt"
  .split(" ")
  .map(function(item) {
    class2type["[object " + item + "]"] = item.toLowerCase();
  });

function type(obj) {
  if (obj == null) {
    return obj + "";  // IE6
  }
  return typeof obj === "object" || typeof obj === "function"
    ? class2type[Object.prototype.toString.call(obj)]
    : typeof obj;
}
```

### isFunction

```js
function isFunction(obj) {
  return type(obj) === "function";
}
```

### isArray

```js
var isArray = Array.isArray || function (obj) {
  return type(obj) === "array";
}
```

### plainObject

`plainObject` 来自于 jQuery，可以翻译成纯粹的对象，所谓"纯粹的对象"，就是该对象是通过 "{}" 或 "new Object" 创建的，该对象含有零个或者多个键值对。

之所以要判断是不是 `plainObject`，是为了跟其他的 JavaScript 对象如 null，数组，宿主对象（documents）等作区分，因为这些用 typeof 都会返回 object。

### EmptyObject

jQuery提供了 `isEmptyObject` 方法来判断是否是空对象，代码简单：

```js
function isEmptyObject(obj) {
  var name;
  // 判断是否有属性，for 循环一旦执行，就说明有属性，有属性就会返回 false
  for (name in obj) {
    return false;
  }
  return true;
}

console.log(isEmptyObject({})); // true
console.log(isEmptyObject([])); // true
console.log(isEmptyObject(null)); // true
console.log(isEmptyObject(undefined)); // true
console.log(isEmptyObject(1)); // true
console.log(isEmptyObject('')); // true
console.log(isEmptyObject(true)); // true
```

### Window对象

Window 对象作为客户端 JavaScript 的全局对象，它有一个 window 属性指向自身。我们可以利用这个特性判断是否是 Window 对象。

```js
function isWindow(obj) {
  return obj !== null && obj === obj.window
}
```

### isArrayLike

### isElement

判断是不是 DOM 元素

```js
function isElement(obj) {
  return !!(obj && obj.nodeType === 1);
}
var div = document.createElement('div');
console.log(isElement(div));  // true
console.log(isElement(''));   // false
```

原文地址：

- [JavaScript 专题之类型判断(上)](https://github.com/mqyqingfeng/Blog/issues/28)
- [JavaScript 专题之类型判断(下)](https://github.com/mqyqingfeng/Blog/issues/30)

## 深浅拷贝

### 数组的浅拷贝

如果数组元素是基本类型，就会拷贝一份，互不影响，而如果是对象或者数组，就会只拷贝对象和数组的引用，这样我们无论在新旧数组进行了修改，两者都会发生变化。

我们把这种复制引用的拷贝方法称之为浅拷贝，与之对应的就是深拷贝，深拷贝就是指完全的拷贝一个对象，即使嵌套了对象，两者也相互分离，修改一个对象的属性，也不会影响另一个。

比如，数组的一些方法：`concat、slice`：

```js
var arr = ["old", 1, true, null, undefined];

var newArr = arr.concat();
newArr.shift();
console.log(arr); // [ 'old', 1, true, null, undefined ]
console.log(newArr); // [ 1, true, null, undefined ]

var newArr2 = arr.slice();
console.log(newArr2); // [ 'old', 1, true, null, undefined ]
```

但是如果数组嵌套了对象或者数组的话，就会都受影响，比如：

```js
var arrObj = [{ a: 1 }, { b: 2 }];

var newArrObj = arrObj.concat();
newArrObj[0].a = "aaa";
console.log(newArrObj); // [ { a: 'aaa' }, { b: 2 } ]
console.log(arrObj); // [ { a: 'aaa' }, { b: 2 } ]
```

### 数组的深拷贝

使用 `JSON.stringify()`和`JSON.parse()`，不管是数组还是对象，都可以实现深拷贝，但是不能拷贝函数，会返回一个 null：

```js
var arr1 = ["old", 1, true, ["old1", "old2"], { old: 1 }, function() {}];
var newArr1 = JSON.parse(JSON.stringify(arr1));
newArr1.shift();
console.log(arr1); // [ 'old', 1, true, [ 'old1', 'old2' ], { old: 1 }, [Function] ]
console.log(newArr1); // [ 1, true, [ 'old1', 'old2' ], { old: 1 }, null ]
```

### 浅拷贝的实现

技巧型的拷贝，如上边使用的 `concat、slice、JSON.stringify`等，如果要实现一个对象或者数组的浅拷贝，该怎么实现呢？

思路：既然是浅拷贝，那就只需要遍历，把对应的属性及属性值添加到新的对象，并返回。

代码实现：

```js
var shallowCopy = function(obj) {
  if (typeof obj !== "object") return;

  // 判断新建的是数组还是对象
  var newObj = obj instanceof Array ? [] : {};
  // 遍历obj，并且判断是obj的属性才拷贝
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key];
    }
  }

  return newObj;
};

var arr20 = ["old", 1, true, ["old1", "old2"], { old: 1 }, function() {}];
var newArr20 = shallowCopy(arr20);

console.log({ newArr20 });
// [ 'old', 1, true, [ 'old1', 'old2' ], { old: 1 }, [Function] ]
```

### 深拷贝的实现

思路：如果是对象，通过递归调用拷贝函数

代码实现：

```js
var deepCopy = function(obj) {
  if (typeof obj !== "object") return;
  var newObj = obj instanceof Array ? [] : {};

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] =
        typeof obj[key] !== "object" ? obj[key] : deepCopy(obj[key]);
    }
  }

  return newObj;
};

var obj = {
  a: function() {},
  b: {
    name: "Tony",
    age: 10
  },
  c: [1, 2, 3]
};

var newObj = deepCopy(obj);
console.log(newObj);
// { a: [Function: a],
// b: { name: 'Tony', age: 10 },
// c: [ 1, 2, 3 ] }
```

原文地址：[JavaScript 专题之深浅拷贝](https://github.com/mqyqingfeng/Blog/issues/32)
