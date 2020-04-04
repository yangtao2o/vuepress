# JavaScript 各种手写源码实现·中篇

## 防抖 Debounce

**防抖**的原理：你尽管触发事件，但是我一定在事件触发 n 秒后才执行，如果你在一个事件触发的 n 秒内又触发了这个事件，那我就以新的事件的时间为准，n 秒后才执行，总之，就是要等你触发完事件 n 秒内不再触发事件，我才执行。

```js
function debounce(func, wait, immediate) {
  var timer, result;
  var debounced = function() {
    var context = this;
    var args = arguments;
    clearTimeout(timer); // 每次只要你触发 func，我就清除定时器，从新计算
    if (immediate) {
      // 触发 func 从队尾提到队前。记住：func同步执行，timer异步执行
      // 1. callNow 初始值是 true, 同步立即执行；随后 timer 才开始执行
      // 2. wait 期间，timer 是一个 ID 数字，所以 callNow 为 false，func 在此期间永远不会执行
      // 3. wait 之后，timer 赋值 null，callNow 为 true，func 又开始立即执行。
      // 依次循环
      var callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      if (callNow) {
        result = func.apply(context, args);
      }
    } else {
      timer = setTimeout(() => {
        // 无法获取异步的 result，考虑 promise
        func.apply(context, args);
      }, wait);
    }
    return result;
  };
  debounced.cancel = function() {
    clearTimeout(func);
    timer = null;
  };
  return debounced;
}
```

## 节流 Throttle

**节流**的原理：如果你持续触发事件，每隔一段时间，只执行一次事件。

根据首次是否执行以及结束后是否执行，效果有所不同，实现的方式也有所不同。
我们用 leading 代表首次是否执行，trailing 代表结束后是否再执行一次。

关于节流的实现，有两种主流的实现方式，一种是使用**时间戳**，一种是设置**定时器**。

时间戳：

```js
function throttle(func, wait) {
  var context, args;
  var previous = 0;
  return function() {
    var now = +new Date();
    context = this;
    args = arguments;
    // 立即执行，毕竟 now = 1585799501128
    if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  };
}
```

定时器：当触发事件的时候，我们设置一个定时器，再触发事件的时候，如果定时器存在，就不执行，直到定时器执行，然后执行函数，清空定时器，这样就可以设置下个定时器

```js
function throttle(func, wait) {
  var timer, context, args;
  return function() {
    context = this;
    args = arguments;
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, wait);
    }
  };
}
```

所以比较两个方法：

- 第一种事件会立刻执行，第二种事件会在 n 秒后第一次执行
- 第一种事件停止触发后没有办法再执行事件，第二种事件停止触发后依然会再执行一次事件

双剑合璧：

```js
function throttle(func, wait, options) {
  var timeout, context, args;
  var previous = 0;
  // leading：false 表示禁用第一次执行
  // trailing: false 表示禁用停止触发的回调
  if (!options) options = {};

  var later = function() {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function() {
    var now = new Date().getTime();
    if (!previous && options.leading === false) previous = now;
    //下次触发 func 剩余的时间
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    // 如果没有剩余的时间了或者你改了系统时间
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
  };
  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = null;
  };
  return throttled;
}
```

详细解析见：[JavaScript 专题之跟着 underscore 学节流](https://github.com/mqyqingfeng/Blog/issues/26)

## 数组去重

### 双层循环

第一种：使用循环嵌套，最外层循环 array，里面循环 res，如果 `array[i]` 的值跟 `res[j]` 的值相等，就跳出循环，如果都不等于，说明元素是唯一的，这时候 j 的值就会等于 res 的长度，根据这个特点进行判断，将值添加进 res

```js
function unique(array) {
  // res用来存储结果
  var res = [];
  for (var i = 0, arrayLen = array.length; i < arrayLen; i++) {
    for (var j = 0, resLen = res.length; j < resLen; j++) {
      if (array[i] === res[j]) {
        break;
      }
    }
    // 如果array[i]是唯一的，那么执行完循环，j等于resLen
    if (j === resLen) {
      res.push(array[i]);
    }
  }
  return res;
}
```

第二种：两个指针 i 和 j，循环对比，如有相同，删除之，并将数组长度恢复

```js
function unique(arr) {
  let arrary = [].concat(arr); // 避免修改原数组，存个副本
  for (let i = 0, len = arrary.length; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      if (arrary[i] === arrary[j]) {
        arrary.splice(j, 1); // splice() 修改原数组，所以需要手动修改长度
        len--;
        j--;
      }
    }
  }
  return arrary;
}
```

使用 `indexOf()`，减少一次循环

```js
if (result.indexOf(arr[i]) === -1) {
  result.push(arr[i]);
}
```

### filter + indexOf

```js
function unique(arr) {
  return arr.filter(function(item, i) {
    return arr.indexOf(item) === i;
  });
}
// ES6
let unique = arr =>
  arr.filter((item, index, arr) => arr.indexOf(item) === index);
```

如果我们对一个已经排好序的数组去重，这种方法效率肯定高于使用 indexOf：

```js
let unique = arr =>
  arr
    .concat()
    .sort()
    .filter((item, index, arr) => !index || item !== arr[index - 1]);
```

不过对于下面这种就会失效：

```js
const arr = [2, 1, 1, 3, "1", 1, "1"];
// 输出 [ 1, '1', 1, '1', 2, 3 ]
```

### Object 键值对

利用一个空的 Object 对象，我们把数组的值存成 Object 的 key 值，比如 `Object[value1] = true`，在判断另一个值的时候，如果 `Object[value2]`存在的话，就说明该值是重复的。

```js
let unique = arr => {
  const obj = {};
  return arr.filter(item =>
    obj.hasOwnProperty(typeof item + JSON.stringify(item))
      ? false
      : (obj[typeof item + JSON.stringify(item)] = true)
  );
};

// typeof item + item 是为了区分 1 还是 ‘1’
// typeof item + JSON.stringify(item) 是为了区分 {value: 1}, {value: 1}
// 如：[1, "1", { value: 1 }, { value: 1 }]
// 结果：["number1", "string"1"", "object{"value":1}", "object{"value":1}"]
```

### Set 集合 和 Map 集合

```js
// Set
let unique = arr => Array.from(new Set(arr));
// or
let unique = arr => [...new Set(arr)];

// Map
let unique = arr => {
  const seen = new Map();
  return arr.filter(item => !seen.has(item) && seen.set(item, 1));
};
```

## 类型判断

```js
var class2type = {};
"Boolean Number String Function Array Date RegExp Object Error Null Undefined"
  .split(" ")
  .map(function(item) {
    class2type["[object " + item + "]"] = item.toLowerCase();
    // e.g. '[object Boolean]': 'boolean'
  });

function type(obj) {
  // ES6 新增的 Symbol、Map、Set 等类型返回 object，当然也可以添加进去，返回的就是对应的类型
  return typeof obj === "object" || typeof obj === "function"
    ? class2type[Object.prototype.toString.call(obj)] || "object"
    : typeof obj;
}
```

## 深浅拷贝

如果数组元素是基本类型，就会拷贝一份，互不影响，而如果是对象或者数组，就会只拷贝对象和数组的引用，这样我们无论在新旧数组进行了修改，两者都会发生变化。

我们把这种复制引用的拷贝方法称之为浅拷贝，与之对应的就是深拷贝，深拷贝就是指完全的拷贝一个对象，即使嵌套了对象，两者也相互分离，修改一个对象的属性，也不会影响另一个。

比如，数组的一些方法：**concat**、**slice**，对象的一些方法：**Object.assign**

```js
// 浅拷贝
function copy(arr) {
  return [].concat(arr);
}

// 赋值一个对象
const obj = { a: 1 };
const copy = Object.assign({}, obj);
console.log(copy); // { a: 1 }
```

使用 `JSON.stringify()`和`JSON.parse()`，不管是数组还是对象，都可以实现深拷贝，但是不能拷贝函数，会返回一个 null

```js
function copy(arr) {
  var res = JSON.parse(JSON.stringify(arr));
  return res;
}
```

**浅拷贝**的实现：既然是浅拷贝，那就只需要遍历，把对应的属性及属性值添加到新的对象，并返回

```js
function shallowCopy(obj) {
  if (typeof obj !== "object") return;
  const newObj = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}
```

**深拷贝**的实现：如果是对象，通过递归调用拷贝函数

```js
function deepCopy(obj) {
  if (typeof obj !== "object") return;
  const newObj = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    const current = obj[key];
    if (obj.hasOwnProperty(key)) {
      newObj[key] = typeof current === "object" ? deepCopy(current) : current;
    }
  }
  return newObj;
}
```

## 求数组的最大值

JavaScript 提供了 Math.max 函数返回一组数中的最大值，用法是：

```js
Math.max([value1[,value2, ...]])
```

值得注意的是：

- 如果有任一参数不能被转换为数值，则结果为 NaN。
- max 是 Math 的静态方法，所以应该像这样使用：`Math.max()`，而不是作为 Math 实例的方法 (简单的来说，就是不使用 new )
- 如果没有参数，则结果为 **-Infinity** (注意是负无穷大)

**循环**：

```js
function max(arr) {
  var res = arr[0];
  for (var i = 1, len = arr.length; i < length; i++) {
    res = Math.max(res, arr[i]);
  }
  return res;
}
```

**reduce**：

```js
let getMax = arr => arr.reduce((prev, next) => Math.max(prev, next));
```

**排序 sort**：

```js
// a > b, a 和 b 交换位置，数组原地以升序排列
var getMax = arr => arr.sort((a, b) => a - b)[arr.length - 1];
```

**eval**：

```js
var max = eval("Math.max(" + arr + ")");
// arr + "" <= 这里隐式转换，一般要先转换成基本数据类型
console.log([1, 2, 3] + ""); // "1,2,3"
console.log("Math.max(" + [1, 2, 3] + ")"); // "Math.max(1,2,3)"
```

**apply**：

```js
var getMax = arr => Math.max.apply(null, arr);
```

**ES6**：

```js
var getMax = arr => Math.max(...arr);
```

## 数组扁平化

**数组的扁平化**，就是将一个嵌套多层的数组 array (嵌套可以是任何层数)转换为只有一层的数组。

1.递归循环：

```js
function flatten(arr) {
  var result = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flatten(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}
```

2.forEach 遍历数组会自动跳过空元素：

```js
const eachFlat = (arr = [], depth = 1) => {
  const result = [];
  (function flat(arr, depth) {
    arr.forEach(item => {
      if (Array.isArray(item) && depth > 0) {
        flat(item, depth - 1);
      } else {
        result.push(item);
      }
    });
  })(arr, depth);
  return result;
};

eachFlat([1, 2, [3, [4, [5]]]], Infinity); //[1, 2, 3, 4, 5]
```

3.for...of：

```js
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

4.如果数组的元素都是数字，那么我们可以考虑使用 toString 方法：

```js
function flatten(arr) {
  return arr
    .toString()
    .split(",")
    .map(function(item) {
      return +item;
    });
}
```

5.既然是对数组进行处理，最终返回一个值，我们就可以考虑使用 reduce 来简化代码：

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

6.`Array.prototype.flat`方法：

```js
var arr = [1, 2, [3, 4]];

// 展开一层数组
arr.flat();
// 等效于
arr.reduce((acc, val) => acc.concat(val), []);
// [1, 2, 3, 4]
```

7.使用 ES6 扩展运算符：

```js
const flattened = arr => [].concat(...arr);

function flatten(arr) {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}
```

## 参考资料

- [前端面试常考的手写代码不是背出来的！](https://juejin.im/post/5e57048b6fb9a07cc845a9ef)
- [各种手写源码实现](https://mp.weixin.qq.com/s?__biz=Mzg5ODA5NTM1Mw==&mid=2247485202&idx=1&sn=1a668530cdce1eaf53c2ec6d796fdd7b&chksm=c0668684f7110f922045c7a4539f78c51458ccafd5204ba7d89ad461ed360a1c14ed07778068&mpshare=1&scene=23&srcid=0329UG1H5LSPIxcKsQwUWXlo&sharer_sharetime=1585447184050&sharer_shareid=73865875704bcba3caa8b09c62f6bd7a%23rd)
- [JavaScript 中各种源码实现（前端面试笔试必备）](https://maimai.cn/article/detail?fid=1414317645&efid=GX16EiGB-SbwDA5N9-zXBQ&use_rn=1&from=timeline&isappinstalled=0)
- [冴羽的博客之 JavaScript 专题系列](https://github.com/mqyqingfeng/Blog)
