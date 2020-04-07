# 学习冴羽的 JS 专题系列·下篇

## 函数柯里化

在数学和计算机科学中，**柯里化**是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。关于函数式编程文档：[函数式编程指北](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/)。

先来个高颜值写法：

```js
var curry = fn =>
  (judge = (...args) =>
    args.length === fn.length
      ? fn(...args)
      : (...arg) => judge(...args, ...arg));
```

第一种方式：

```js
function curry(fn, args) {
  const len = fn.length;
  args = args || [];
  return function() {
    let newArgs = [].slice.call(arguments, 0);
    let _args = args.concat(newArgs);
    if (_args.length < len) {
      return curry(fn, _args);
    } else {
      return fn.apply(this, _args);
    }
  };
}
```

调用：

```js
var fn = curry(function(a, b, c) {
  return [a, b, c];
});

console.log(fn(1, 2, 3));  // [1, 2, 3]
console.log(fn(1)(2, 3));  // [1, 2, 3]
console.log(fn(1, 2), 3));  // [1, 2, 3]
```

第二种方式：

```js
function sub_curry(fn) {
  var args = [].slice.call(arguments, 1);
  return function() {
    // 执行 fn(1, 2)
    return fn.apply(this, args.concat([].slice.call(arguments)));
  };
}

function curry(fn, length) {
  length = length || fn.length;
  var slice = Array.prototype.slice;
  return function() {
    var argsLen = arguments.length;
    // 如：combined = [fn, 1, 2]
    var combined = [fn].concat(slice.call(arguments, 0));
    if (argsLen < length) {
      // 如：fn = sub_curry(fn, 1, 2)
      // curry(fn, length)
      return curry(sub_curry.apply(this, combined), length - argsLen);
    } else {
      // 执行 fn(1, 2, 3)
      return fn.apply(this, arguments);
    }
  };
}

fn(1, 2), 3);
// 类似于
// (function(a, b) {
//   return function(c) {
//     console.log(a, b, c);
//   };
// })(1, 2)(3);
```

我们以下面的例子为例：

```js
var fn0 = function(a, b, c, d) {
  return [a, b, c, d];
};

var fn1 = curry(fn0);

fn1("a", "b")("c")("d");
```

当执行 `fn1("a", "b")`时：

```js
fn1("a", "b")
// 相当于
curry(fn0)("a", "b")

// 相当于
curry(sub_curry(fn0, "a", "b"))

// 相当于
// 注意 ... 只是一个示意，表示该函数执行时传入的参数会作为 fn0 后面的参数传入
curry(function(...){
    return fn0("a", "b", ...)
})
```

当执行`fn1("a", "b")("c")`时，函数返回：

```js
curry(sub_curry(function(...){
    return fn0("a", "b", ...)
}), "c")

// 相当于
curry(function(...){
    return (function(...) {return fn0("a", "b", ...)})("c")
})

// 相当于
curry(function(...){
     return fn0("a", "b", "c", ...)
})
```

当执行 `fn1("a", "b")("c")("d")`时，此时`arguments.length < length` 为 false ，执行`fn(arguments)`，相当于：

```js
(function(...){
    return fn0("a", "b", "c", ...)
})("d")

// 相当于
fn0("a", "b", "c", "d")
```

函数执行结束。

所以，其实整段代码又很好理解：

`sub_curry` 的作用就是用函数包裹原函数，然后给原函数传入之前的参数，当执行 `fn0(...)(...)`的时候，执行包裹函数，返回原函数，然后再调用 `sub_curry` 再包裹原函数，然后将新的参数混合旧的参数再传入原函数，直到函数参数的数目达到要求为止。

学习资料：[JavaScript 专题之函数柯里化](https://github.com/mqyqingfeng/Blog/issues/42)

## 偏函数

### 定义

对偏函数 (Partial application) 的定义：在计算机科学中，局部应用是指固定一个函数的一些参数，然后产生另一个更小元的函数。

什么是元？元是指函数参数的个数，比如一个带有两个参数的函数被称为二元函数。

```js
function add(a, b) {
  return a + b;
}

// 执行 add 函数，一次传入两个参数即可
add(1, 2); // 3

// 假设有一个 partial 函数可以做到局部应用
var addOne = partial(add, 1);

addOne(2); // 3
```

### 与柯里化的区别

**柯里化**是将一个多参数函数转换成多个单参数函数，也就是将一个 n 元函数转换成 n 个一元函数。

**局部应用**则是固定一个函数的一个或者多个参数，也就是将一个 n 元函数转换成一个 n - x 元函数。

### 第一版

```js
function partial(fn) {
  var args = [].slice.call(arguments, 1);
  return function() {
    var newArgs = args.concat([].slice.call(arguments));
    return fn.apply(this, newArgs);
  };
}

function add(a, b) {
  return a + b + this.value;
}

// var addOne = add.bind(null, 1);
var addOne = partial(add, 1);

var value = 1;
var obj = {
  value: 2,
  addOne: addOne
};
var res = obj.addOne(2); // ???
// 使用 bind 时，结果为 4
// 使用 partial 时，结果为 5
```

### 第二版

我们希望 partial 函数也使用占位符：

```js
var _ = {};

function partial(fn) {
  var args = [].slice.call(arguments, 1);
  return function() {
    var position = 0,
      len = args.length;
    for (var i = 0; i < len; i++) {
      args[i] = args[i] === _ ? arguments[position++] : args[i];
    }
    while (position < arguments.length) args.push(arguments[position++]);
    return fn.apply(this, args);
  };
}

var subtract = function(a, b) {
  return b - a;
};
subFrom20 = partial(subtract, _, 20);
var res = subFrom20(5);
console.log(res); //15
```

学习资料：[JavaScript 专题之偏函数](https://github.com/mqyqingfeng/Blog/issues/42)

## 惰性函数

惰性函数就是解决每次都要进行判断的这个问题，解决原理很简单，重写函数。

```js
var foo = function() {
  var t = new Date();
  foo = function() {
    return t;
  };
  return foo();
};
```

让我们看一下打印结果，是不是如此：

```js
console.log("初始化：", foo);
console.log("调用：", foo());
console.log("之后：", foo);
// 初始化： ƒ () {
//   var t = new Date();
//   foo = function() {
//     return t;
//   };
//   return foo();
// }
// 调用： Sun Apr 05 2020 17:17:41 GMT+0800 (中国标准时间)
// 之后： ƒ () {
//     return t;
//   }
```

再比如 DOM 事件判断，每次都需要判断：

```js
function addEvent(type, el, fn) {
  if (window.addEventListener) {
    el.addEventListener(type, fn, false);
  } else if (window.attachEvent) {
    el.attachEvent("on" + type, fn);
  }
}
```

利用惰性函数，我们可以这样做：

```js
function addEvent(type, el, fn) {
  if (window.addEventListener) {
    el.addEventListener(type, fn, false);
    addEvent = function(type, el, fn) {
      el.addEventListener(type, fn, false);
    };
  } else if (window.attachEvent) {
    el.attachEvent("on" + type, fn);
    addEvent = function(type, el, fn) {
      el.attachEvent("on" + type, fn);
    };
  }
}
```

测试：

```js
var container = document.getElementById("container");

console.log("初始化：", addEvent);

var handle = function() {
  console.log("被触发了");
  console.log("之后：", addEvent);
};

addEvent("click", container, handle);
```

触发结果：

```js
// 初始化： ƒ addEvent(type, el, fn) {
//   if (window.addEventListener) {
//     el.addEventListener(type, fn, false);
//     addEvent = function(type, el, fn) {
//       el.addEventListener(type, fn, false);
//     }
//   } else …
// 被触发了
// 之后： ƒ (type, el, fn) {
//       el.addEventListener(type, fn, false);
//     }
```

使用闭包，初始化就完成对应事件：

```js
var addEvent = (function(type, el, fn) {
  if (window.addEventListener) {
    return function(type, el, fn) {
      el.addEventListener(type, fn, false);
    };
  } else if (window.attachEvent) {
    return function(type, el, fn) {
      el.attachEvent("on" + type, fn);
    };
  }
})();

// 初始化： ƒ (type, el, fn) {
//       el.addEventListener(type, fn, false);
//     }
// 被触发了
// 之后： ƒ (type, el, fn) {
//       el.addEventListener(type, fn, false);
//     }
```

学习资料：[JavaScript 专题之惰性函数](https://github.com/mqyqingfeng/Blog/issues/44)

## 函数组合

原文链接：[JavaScript 专题之函数组合](https://github.com/mqyqingfeng/Blog/issues/42)

## 函数记忆

原文链接：[JavaScript 专题之函数记忆](https://github.com/mqyqingfeng/Blog/issues/42)

## 递归

程序调用自身的编程技巧称为**递归**(recursion)。

### 阶乘

例如 5 的阶乘计算公式为：

```js
5! = 5 * 4 * 3 * 2 * 1 = 120
```

方式一：迭代

```js
function factorialIterative(number) {
  if (number < 0) return undefined;
  let total = 1;
  for (let n = number; n > 1; n--) {
    total = total * n;
  }
  return total;
}
```

方式一：递归

```js
function factorial(n) {
  if (n <= 1) return n;
  return n * factorial(n - 1);
}
```

### 斐波拉契数

用文字来说，就是由 0 和 1 开始，之后的斐波那契数就是由之前的两数相加而得出，如：0、1、1、2、3、5、8、13、21。

传入参数为斐波那契数列的下标，而返回值为斐波那契数列对应下标的值。

方式一：迭代

```js
function fibonacciIterative(n) {
  if (n < 1) return 0;
  if (n <= 2) return 1;
  let fibNMinus2 = 0;
  let fibNMinus1 = 1;
  let fibN = n;
  // n >= 2
  for (let i = 2; i <= n; i++) {
    fibN = fibNMinus1 + fibNMinus2; // f(n-1) + f(n-2)
    fibNMinus2 = fibNMinus1;
    fibNMinus1 = fibN;
  }
  return fibN;
}
```

方式二：递归

```js
function fibonacci(n) {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(5)); // 1 1 2 3 5
```

### 构成递归条件

构成递归需具备**边界条件**、**递归前进段**和**递归返回段**，当边界条件不满足时，递归前进，当边界条件满足时，递归返回。阶乘中的 `n == 1` 和 斐波那契数列中的 `n < 2` 都是边界条件。

总结一下递归的特点：

- 子问题须与原始问题为同样的事，且更为简单；
- 不能无限制地调用本身，须有个出口，化简为非递归状况处理。

### 尾调用优化

**递归**会不停的创建执行上下文压入执行上下文栈，对于内存而言，维护这么多的执行上下文也是一笔不小的开销，这时候可以借助**尾调用**。

```js
function f() {
  let m = 1;
  let n = 2;
  return g(m + n);
}
f();

// 等同于
function f() {
  return g(3);
}
f();

// 等同于
g(3);
```

尾调用，是指函数内部的最后一个动作是**函数调用**。该调用的返回值，直接返回给函数。

尾调用函数执行时，虽然也调用了一个函数，但是因为原来的的函数执行完毕，执行上下文会被弹出，执行上下文栈中相当于只多压入了一个执行上下文。然而非尾调用函数，就会创建多个执行上下文压入执行上下文栈。

### 尾递归

函数调用自身，称为递归。如果尾调用自身，就称为**尾递归**。对于尾递归来说，由于只存在一个调用记录，所以永远不会发生“栈溢出”错误。

**阶乘函数**尾递归调用：

```js
function factorial(n, res = 1) {
  if (n <= 1) return res;
  return factorial(n - 1, n * res);
}

console.log(factorial(5)); // 120
```

调用过程：

```js
factorial(5, 1);
factorial(4, 5);
factorial(3, 20);
factorial(2, 60);
factorial(1, 120);
// 120
```

**斐波拉契数**尾递归调用：

```js
function fibonacci(n, sum1 = 1, sum2 = 1) {
  if (n <= 2) return sum2;
  return fibonacci(n - 1, sum2, sum1 + sum2);
}
fibonacci(5);
```

调用过程：

```js
fibonacci(5, 1, 1);
fibonacci(4, 1, 2);
fibonacci(3, 2, 3);
fibonacci(2, 3, 5);
// 5
```

### 迭代-递归-尾递归

**求和**过程：

```js
// 迭代
function sum(n) {
  if (n <= 1) return n;
  var res = 0;
  for (var i = n; i > 0; i--) {
    res += i;
  }
  return res;
}

// 递归
function sum(n) {
  if (n <= 1) return n;
  return n + sum(n - 1);
}

// 尾递归
function sum(n, res = 0) {
  if (n < 1) return res;
  return sum(n - 1, n + res);
}

sum(5); // 15
```

### 尾递归总结

```js
// 求和
function sum(n, res = 0) {
  if (n < 1) return res;
  return sum(n - 1, n + res);
}
sum(5); // 15

// 斐波拉契数
function fibonacci(n, sum1 = 1, sum2 = 1) {
  if (n <= 2) return sum2;
  return fibonacci(n - 1, sum2, sum1 + sum2);
}
fibonacci(5); // 5

// 阶乘
function factorial(n, res = 1) {
  if (n <= 1) return res;
  return factorial(n - 1, n * res);
}
```

学习资料：

- [JavaScript 专题之递归](https://github.com/mqyqingfeng/Blog/issues/42)
- [尾调用优化](http://www.ruanyifeng.com/blog/2015/04/tail-call.html) - 阮一峰

## 乱序

原文链接：[JavaScript 专题之乱序](https://github.com/mqyqingfeng/Blog/issues/42)

## 解读 v8 排序源码

原文链接：[JavaScript 专题之解读 v8 排序源码](https://github.com/mqyqingfeng/Blog/issues/42)
