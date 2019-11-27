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

原文地址：[JavaScript 专题之跟着 underscore 学防抖](https://juejin.im/post/5931561fa22b9d0058c5b87d)

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

原文地址：[JavaScript 专题之跟着 underscore 学节流](https://juejin.im/post/5947312a61ff4b006cf66be9)

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

原文地址：[JavaScript 专题之数组去重](https://juejin.im/post/5949d85f61ff4b006c0de98b)

## 类型判断(上) 

原文地址：[JavaScript专题之类型判断(上)](https://juejin.im/post/5951ba9f6fb9a06bbd6f5a12)

