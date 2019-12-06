# 前端面试题目学习总结

## 闭包

- [破解前端面试（80% 应聘者不及格系列）：从闭包说起](https://juejin.im/post/58f1fa6a44d904006cf25d22)

```javascript
for (var i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(new Date(), i);
  }, 1000);
}

console.log(new Date(), i);

// 5 -> 5,5,5,5,5
```

> 期望代码的输出变成：5 -> 0,1,2,3,4

利用 IIFE（Immediately Invoked Function Expression：声明即执行的函数表达式）

```javascript
for (var i = 0; i < 5; i++) {
  (function(j) {
    // j = i
    setTimeout(function() {
      console.log(new Date(), j);
    }, 1000);
  })(i);
}

console.log(new Date(), i);
```

```javascript
for (var i = 0; i < 5; i++) {
  setTimeout(
    function(j) {
      console.log(new Date(), j);
    },
    1000,
    i
  );
}

console.log(new Date(), i);
```

利用 JS 中基本类型（Primitive Type）的参数传递是**按值传递**（Pass by Value）的特征

```javascript
var output = function(i) {
  setTimeout(function() {
    console.log(new Date(), i);
  }, 1000);
};

for (var i = 0; i < 5; i++) {
  output(i); // 这里传过去的 i 值被复制了
}

console.log(new Date(), i);
```

### 在循环中使用闭包

```javascript
const arr = [10, 12, 15, 21];
// 1
for (var i = 0, l = arr.length; i < l; i++) {
  (function(index) {
    setTimeout(function() {
      console.log(index);
    }, 3000);
  })(i);
}

// 2
for (var i = 0, l = arr.length; i < l; i++) {
  setTimeout(
    (function(index) {
      return function() {
        console.log(index);
      };
    })(i),
    3000
  );
}

// 3
for (let i = 0, l = arr.length; i < l; i++) {
  setTimeout(function() {
    console.log(i);
  }, 3000);
}
```

## Promise 和 async/await

期望代码的输出变成 0 -> 1 -> 2 -> 3 -> 4 -> 5

- Promise

```javascript
const tasks = []; // 这里存放异步操作的 Promise
const output = i =>
  new Promise(resolve => {
    setTimeout(() => {
      console.log(new Date(), i);
      resolve();
    }, 1000 * i);
  });

// 生成全部的异步操作
for (var i = 0; i < 5; i++) {
  tasks.push(output(i));
}

// 异步操作完成之后，输出最后的 i
Promise.all(tasks).then(() => {
  setTimeout(() => {
    console.log(new Date(), i);
  }, 1000);
});
```

- async/await

```javascript
// 模拟其他语言中的 sleep，实际上可以是任何异步操作
const sleep = timeountMS =>
  new Promise(resolve => {
    setTimeout(resolve, timeountMS);
  });

(async () => {
  // 声明即执行的 async 函数表达式
  for (var i = 0; i < 5; i++) {
    if (i > 0) {
      await sleep(1000);
    }
    console.log(new Date(), i);
  }

  await sleep(1000);
  console.log(new Date(), i);
})();
```

## 事件委托代理

```html
<ul id="todoApp">
  <li class="item">我爱笑</li>
  <li class="item">我爱笑234</li>
  <li class="item">4321我爱234笑1</li>
  <li class="item">我二分爱笑</li>
</ul>
```

第一种常见绑定方法：

```javascript
// 1
document.addEventListener("DOMContentLoaded", function() {
  let app = document.getElementById("todoApp");
  let items = app.getElementsByClassName("item");
  for (let item of items) {
    item.addEventListener("click", function() {
      console.log("You clicked on item: " + item.innerHTML);
    });
  }
});
```

第二种时间委托方法：

```javascript
let app = document.getElementById("todoApp");
app.addEventListener("click", function(e) {
  console.log(this, e);
  if (e.target && e.target.nodeName === "LI") {
    console.log("You clicked on item: " + e.target.innerHTML);
  }
});
```

## 类数组转数组

```js
var arrayLike = {0: 'name', 1: 'age', 2: 'sex', length: 3 }
// 1. slice
Array.prototype.slice.call(arrayLike); // ["name", "age", "sex"] 
// 2. splice
Array.prototype.splice.call(arrayLike, 0); // ["name", "age", "sex"] 
// 3. ES6 Array.from
Array.from(arrayLike); // ["name", "age", "sex"] 
// 4. apply
Array.prototype.concat.apply([], arrayLike)
```

## 学习资料

- [通过 20 个棘手的ES6面试问题来提高咱们的 JS 技能](https://juejin.im/post/5dc8a231f265da4d40712f8a)