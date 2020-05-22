# 学习冴羽的 JS 专题系列·中篇

## 模拟 jQuery 的 extend

**extend** 的用法：合并两个或者更多的对象的内容到第一个对象中。

```js
jQuery.extend( [deep], target, object1 [, objectN ] )
```

- **deep**，布尔值，如果为 true，进行深拷贝；false 做浅拷贝，target 就往后移动到第二个参数
- **target**，表示要拓展的目标，我们就称它为目标对象吧。
- 后面的参数，都传入对象，内容都会复制到目标对象中，我们就称它们为待复制对象吧。

```js
var toString = class2type.toString;
var hasOwn = class2type.hasOwnProperty;

function isPlainObject(obj) {
  var proto, Ctor;
  if (!obj || toString.call(obj) !== "[object Object]") {
    return false;
  }
  proto = Object.getPrototypeOf(obj);
  if (!proto) {
    return true;
  }
  Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
  return (
    typeof Ctor === "function" &&
    hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object)
  );
}

function extend() {
  // 默认不进行深拷贝
  var deep = false;
  var name, options, src, copy, clone, copyIsArray;
  var length = arguments.length;
  // 记录要复制的对象的下标
  var i = 1;
  // 第一个参数不传布尔值的情况下，target 默认是第一个参数
  var target = arguments[0] || {};
  // 如果第一个参数是布尔值，第二个参数是 target
  if (typeof target == "boolean") {
    deep = target;
    target = arguments[i] || {};
    i++;
  }
  // 如果target不是对象，我们是无法进行复制的，所以设为 {}
  if (typeof target !== "object" && !isFunction(target)) {
    target = {};
  }

  // 循环遍历要复制的对象们
  for (; i < length; i++) {
    // 获取当前对象
    options = arguments[i];
    // 要求不能为空 避免 extend(a,,b) 这种情况
    if (options != null) {
      for (name in options) {
        // 目标属性值
        src = target[name];
        // 要复制的对象的属性值
        copy = options[name];

        // 解决循环引用
        if (target === copy) {
          continue;
        }

        // 要递归的对象必须是 plainObject 或者数组
        if (
          deep &&
          copy &&
          (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))
        ) {
          // 要复制的对象属性值类型需要与目标属性值相同
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && Array.isArray(src) ? src : [];
          } else {
            clone = src && isPlainObject(src) ? src : {};
          }

          target[name] = extend(deep, clone, copy);
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  return target;
}
```

原文地址：[JavaScript 专题之从零实现 jQuery 的 extend](https://github.com/mqyqingfeng/Blog/issues/33)

## 如何求数组的最大值和最小值

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

原文地址：[JavaScript 专题之如何求数组的最大值和最小值](https://github.com/mqyqingfeng/Blog/issues/35)

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

### underscore 中的 flatten

```js
// 数组扁平化
/**
 * 数组扁平化
 * @param  {Array} input   要处理的数组
 * @param  {boolean} shallow 是否只扁平一层
 * @param  {boolean} strict  是否严格处理元素，下面有解释
 * @param  {Array} output  这是为了方便递归而传递的参数
 * 源码地址：https://github.com/jashkenas/underscore/blob/master/underscore.js#L528
 */
function flatten(input, shallow, strict, output) {
  // 递归使用的时候会用到output
  output = output || [];
  var idx = output.length;

  for (var i = 0, len = input.length; i < len; i++) {
    var value = input[i];
    // 如果是数组，就进行处理
    if (Array.isArray(value)) {
      // 如果是只扁平一层，遍历该数组，依此填入 output
      if (shallow) {
        var j = 0,
          length = value.length;
        while (j < length) output[idx++] = value[j++];
      }
      // 如果是全部扁平就递归，传入已经处理的 output，递归中接着处理 output
      else {
        flatten(value, shallow, strict, output);
        idx = output.length;
      }
    }
    // 不是数组，根据 strict 的值判断是跳过不处理还是放入 output
    else if (!strict) {
      output[idx++] = value;
    }
  }

  return output;
}
```

解释下 strict，在代码里我们可以看出，当遍历数组元素时，如果元素不是数组，就会对 strict 取反的结果进行判断，如果设置 strict 为 true，就会跳过不进行任何处理，这意味着可以过滤非数组的元素，举个例子：

```js
var arr = [1, 2, [3, 4]];
console.log(flatten(arr, true, true)); // [3, 4]
```

那么设置 strict 到底有什么用呢？不急，我们先看下 shallow 和 strct 各种值对应的结果：

- shallow true + strict false ：正常扁平一层
- shallow false + strict false ：正常扁平所有层
- shallow true + strict true ：去掉非数组元素
- shallow false + strict true ： 返回一个[]

原文地址：[JavaScript 专题之数组扁平化](https://github.com/mqyqingfeng/Blog/issues/36)

## 学 underscore 在数组中查找指定元素

原文地址：[JavaScript 专题之学 underscore 在数组中查找指定元素](https://github.com/mqyqingfeng/Blog/issues/37)

## jQuery 通用遍历方法 each 的实现

原文地址：[JavaScript 专题之 jQuery 通用遍历方法 each 的实现](https://github.com/mqyqingfeng/Blog/issues/40)

## 如何判断两个对象相等

原文地址：[JavaScript 专题之如何判断两个对象相等](https://github.com/mqyqingfeng/Blog/issues/41)
