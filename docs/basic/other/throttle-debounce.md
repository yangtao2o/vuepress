# 事件的节流（throttle）与防抖（debounce）

> 出现滚动、窗口大小调整或按下键等事件请务必提及 防抖(Debouncing) 和 函数节流（Throttling）来提升页面速度和性能。这两兄弟的本质都是以闭包的形式存在。通过对事件对应的回调函数进行包裹、以自由变量的形式缓存时间信息，最后用 setTimeout 来控制事件的触发频率。

## 节流 throttle

**所谓的“节流”**，是通过在一段时间内无视后来产生的回调请求来实现的。只要 裁判宣布比赛开始，裁判就会开启计时器，在这段时间内，参赛者就尽管不断的吃，谁也无法知道最终结果

节流（throttle）:不管事件触发频率多高，只在单位时间内执行一次。

### 实现

- 时间戳
- 定时器

时间戳：第一次事件肯定触发，最后一次不会触发

```JavaScript
function throttle(fn, interval) {
  let last = 0;
  return function() {
    let context = this;
    let args = arguments;
    let now = +new Date();
    if(now - last >= interval) {
      last = now;
      fn.apply(context, args);
    }
  }
}

// es6
function throttle(event, delay) {
  let pre = 0;
  return function (...args) {
    let now = Date.now();
    if(now - pre > delay) {
      pre = now;
      event.apply(this, args);
    }
  }
}

const better_scroll = throttle(() => console.log('触发了滚动事件'), 3000)
document.addEventListener('scroll', better_scroll);
```

定时器：第一次事件不会触发，最后一次一定触发

```javascript
function throttle(event, delay) {
  let timer = null;
  return function(...args) {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        event.apply(this, args);
      }, delay);
    }
  };
}
```

## 防抖 debounce

**防抖**的主要思想在于：我会等你到底。在某段时间内，不管你触发了多少次回调，我都只认最后一次。

防抖（debounce）：不管事件触发频率多高，一定在事件触发 n 秒后才执行，如果你在一个事件触发的 n 秒内又触发了这个事件，就以新的事件的时间为准，n 秒后才执行，总之，触发完事件 n 秒内不再触发事件，n 秒后再执行。

### 应用场景

- 窗口大小变化、调整样式
- 搜索框，输入后 1000 毫秒搜索
- 表单验证，输入 1000 毫秒后验证

### 实现

在 debounce 函数中返回一个闭包，这里用的普通 function，里面的 setTimeout 则用的箭头函数，这样做的意义是让 this 的指向准确，this 的真实指向并非 debounce 的调用者，而是返回闭包的调用者。

对传入闭包的参数进行透传。

```javascript
function debounce(fn, delay) {
  let timer = null;
  return function() {
    let context = this;
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, delay);
  };
}

const better_scroll = debounce(() => console.log("触发了滚动事件"), 1000);
document.addEventListener("scroll", better_scroll);
```

ES6

```javascript
function debounce(event, delay) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      event.apply(this, args);
    }, delay);
  };
}
```

有时候我们需要让函数立即执行一次，再等后面事件触发后等待 n 秒执行，我们给 debounce 函数一个 flag 用于标示是否立即执行。

当定时器变量 timer 为空时，说明是第一次执行，我们立即执行它。

```JavaScript
function debounce(event, delay, flag) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    if(flag && !timer) {
      event.apply(this, args);
    }
    timer = setTimeout(() => {
      event.apply(this, args);
    }, delay);
  }
}
```

**升级版**

我们需要借力 throttle 的思想，打造一个“有底线”的 debounce——等你可以，但我有我的原则：delay 时间内，我可以为你重新生成定时器；但只要 delay 的时间到了，我必须要给用户一个响应。这个 throttle 与 debounce “合体”思路，已经被很多成熟的前端库应用到了它们的加强版 throttle 函数的实现中。

加强版：定时器和时间戳的结合版，也相当于节流和防抖的结合版，第一次和最后一次都会触发

```javascript
function throttle(fn, delay) {
  let timer = null;
  let last = 0;
  return function() {
    let context = this;
    let args = arguments;
    let now = +new Date();
    if (timer) {
      clearTimeout(timer);
    }
    if (now - last < delay) {
      timer = setTimeout(function() {
        fn.apply(context, args);
      }, delay);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

// es6
function throttle(event, delay) {
  let pre = 0;
  let timer = null;
  return function(...args) {
    let now = Date.now();
    if (now - pre > delay) {
      clearTimeout(timer);
      timer = null;
      pre = now;
      event.apply(this, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        event.apply(this, args);
      }, delay);
    }
  };
}

const better_scroll = throttle(function() {
  console.log("滚动了");
}, 3000);
document.addEventListener("scroll", better_scroll);
```

### underscore

```javascript
// 默认的（有头有尾），设置 { leading: false } 的，以及设置 { trailing: false } 的
const throttle = function(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;

  if (!options) options = {};

  var later = function() {
    previous = options.leading === false ? 0 : _.now();

    timeout = null;

    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function() {
    var now = _.now();
    if (!previous && options.leading === false) previous = now;

    var remaining = wait - (now - previous);
    context = this;
    args = arguments;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, ramaining);
    }
    return result;
  };

  throttle.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };
  return throttled;
};

// 此处的三个参数上文都有解释
_.debounce = function(func, wait, immediate) {
  // timeout 表示定时器
  // result 表示 func 执行返回值
  var timeout, result;

  // 定时器计时结束后
  // 1、清空计时器，使之不影响下次连续事件的触发
  // 2、触发执行 func
  var later = function(context, args) {
    timeout = null;
    // if (args) 判断是为了过滤立即触发的
    // 关联在于 _.delay 和 restArguments
    if (args) result = func.apply(context, args);
  };

  // 将 debounce 处理结果当作函数返回
  var debounced = restArguments(function(args) {
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      // 第一次触发后会设置 timeout，
      // 根据 timeout 是否为空可以判断是否是首次触发
      var callNow = !timeout;
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(this, args);
    } else {
      // 设置定时器
      timeout = _.delay(later, wait, this, args);
    }

    return result;
  });

  // 新增 手动取消
  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
};

// 根据给定的毫秒 wait 延迟执行函数 func
_.delay = restArguments(function(func, wait, args) {
  return setTimeout(function() {
    return func.apply(null, args);
  }, wait);
});
```

## 资料

- [Javascript 面试中经常被问到的三个问题！](https://segmentfault.com/a/1190000018257074)
- [防抖](http://www.conardli.top/docs/JavaScript/%E9%98%B2%E6%8A%96.html#%E5%8E%9F%E7%90%86)
- [【进阶 6-7 期】浅出篇 | 7 个角度吃透 Lodash 防抖节流原理](https://juejin.im/post/5d253402e51d45108f254284#comment) --- 木易杨说
