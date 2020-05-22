# 初探Class、继承、Promise 及 ES6 常用功能

### Class - 语法糖
* Class 在语法上更贴合面向对象的写法
* Class 实现继承更加易读、易理解
* 更易于写 java 等后端语言的使用
* 本质还是语法糖，使用 prototype

#### ES5中的写法

获取实例对象的原型对象`Object.getPrototypeOf(m2)`

判断实例与构造函数的原型对象是否有关系`MathHandle2.prototype.isPrototypeOf(m2)`
```javascript
function MathHandle2(x, y) {
  this.x = x
  this.y = y
}
MathHandle2.prototype.add = function () {
  return this.x + this.y
}

var m2 = new MathHandle2(1,3)
console.log(m2.add())
console.log(m2.__proto__ === MathHandle2.prototype)  //true

// 获取实例对象的原型对象Object.getPrototypeOf()
console.log(Object.getPrototypeOf(m2) === MathHandle2.prototype)  //true
// 判断实例与构造函数的原型对象是否有关系isPrototypeOf()
console.log(MathHandle2.prototype.isPrototypeOf(m2))  //true
```

#### ES6中的写法

对象实例的隐式原型（属性）指向构造函数的原型对象`m.__proto__ === MathHandle.prototype`

构造函数的原型对象的constructor属性指回了构造函数本身`MathHandle.prototype.constructor === MathHandle`
```javascript
class MathHandle {   // 构造函数
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  add() {
    return this.x + this.y
  }
}

const m = new MathHandle(1, 3)
console.log(m.add())  //4

// 对象实例的隐式原型（属性）指向构造函数的原型对象
console.log(m.__proto__ === MathHandle.prototype)  //true

// 构造函数的原型对象的constructor属性指回了构造函数本身
console.log(MathHandle.prototype.constructor === MathHandle)  //true
```


### 继承

#### prototype

```javascript
function Animal() {
  this.eat = function() {
    console.log('Animal eat')
  }
}
function Dog() {
  this.bark = function() {
    console.log('Dog bark')
  }
}
// 绑定原型，实现继承
Dog.prototype = new Animal()
var hashiqi = new Dog()
hashiqi.eat()  // Animal eat
hashiqi.bark()  // Dog bark
```

#### extends

```javascript
class Animal {
  constructor(name) {
    this.name = name
  }
  eat() {
    console.log('Animal eat!' + this.name)
  }
}
class Dog extends Animal {
  constructor(name) {
    super(name) 
    this.name = name
  }
  bark() {  
    console.log('Dog bark!' + this.name)
  }
}

const hashiqi = new Dog('哈士奇')
hashiqi.eat()
hashiqi.bark()
```

### Promise

* new Promise 实例，而且要 return
* new Promise 时要传入函数，函数有 resolve、reject 两个函数
* 成功时执行 resolve()，失败时执行 reject()
* then 监听结果

```javascript
function loadImg(src) {
  var promise = new Promise(function(resolve, reject) {
    var img = document.createElement('img')
    img.onload = function() {
      resolve(img)
    }
    img.onerror = function() {
      reject()
    }
    img.src = src
  })
  return promise
}

  var src1 = 'https://img3.mukewang.com/5c611772085966af06000338-240-135.jpg'
  var src2 = 'https://img2.mukewang.com/5c6b7cff08d6895906000338-240-135.jpg'
  var result1 = loadImg(src1)
  var result2 = loadImg(src2)

  result1.then(function(img) {
    console.log('第一张图片', img.src)
    return result2  //串联操作
  }).then(function(img) {
    console.log('第二张图片', img.src)
  }).catch(function(ex) {  // 统一捕获错误信息
    console.log(ex)
  })

  // Promise.all 接受一个 promise 对象的数组，待全部完成之后，统一执行 success
  
  var result3 = loadImg(src1)
  var result4 = loadImg(src2)
  Promise.all([result3, result4]).then(function(data) {
    console.log(data)
  })

  // Promise.race 接受一个包含多个 promise 对象的数组，只要有一个完成，就执行 success
  Promise.race([result3,result4]).then(function(data) {
    console.log('race:', data)
  })
```

### ES6常用功能

* let const
* 多行字符串、模板变量
* 解构赋值
* 块级作用域
* 函数默认参数
* 箭头函数

```javascript
// let const
let i = 10;
i = 20;  // Uncaught SyntaxError: Identifier 'i' has already been declared
const j = 100
j = 20  // Uncaught TypeError: Assignment to constant variable.

// 多行字符串、模板变量
const name = 'yangtao', age = 27;
const html = `
  <div>
    <p>${name}</p>
    <p>${age}</p>
  </div>`;

// 结构赋值
const obj = {a: 100, b: 200}
const {a, b} = obj
// 等同于（对象按照属性）
var obj = {a: 100, b: 200}
var a = obj.a,
    b = obj.b;

const arr = ['xxx', 'yyy', 'zzz']
const [x, z] = arr
// 等同于(数组按照索引)
var arr = ['xxx', 'yyy', 'zzz']
var x = arr[0],
    z = arr[1];

// 块级作用域
const myObj = {a: 1, b: 2}
for(let item in obj) {
  console.log(item)
}
console.log(item)
// 等同于
var myObj = { a: 1, b: 2 };
for (var _item in obj) {
  console.log(_item);
}
console.log(item);

// 函数参数
function num(a,b=0) {
}
// 等同于
function num2(a) {
  var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
}

// 箭头函数
const myarr = [1,3,4]
myarr.map(item => item + 1)
myarr.map((item, index) => console.log(item, index))
// 等同于
var myarr = [1, 3, 4];
myarr.map(function (item) {
  return item + 1;
});
myarr.map(function (item, index) {
  return console.log(item, index);
});

// this指向很诡异
function fn() {
  console.log('real', this)  // real {a: 10}

  var arr = [1,2,3];
  arr.map(function(item) {
    console.log(this)  // window
  })
}
fn.call({a: 10})
// 使用箭头函数修改
function fn() {
  console.log('real', this)  // real {a: 10}

  var arr = [1,2,3];
  arr.map(item => console.log(this))  // {a: 10}
}
fn.call({a: 10})
// 等同于
function fn() {
  var _this = this;

  console.log('real', this); // real {a: 10}

  var arr = [1, 2, 3];
  arr.map(function (item) {
    return console.log(_this);
  }); // {a: 10}
}
fn.call({ a: 10 });
```

### 关于 JS 众多模块化标准

* 没有模块化
* AMD成为标准，require.js(也有CMD)
* 前端打包工具，是node.js模块化可以被使用
* ES6出现，想统一现在所有模块化标准
* nodejs积极支持，浏览器尚未统一

#### 模块化

* 语法：import export(注意有无default)
* 环境：babel编译 ES6 语法，模块化可用 webpack 和 rollup
* 扩展：对模块化标准统一的期待


### Rollup
* rollup 功能单一，webpack 功能强大
* 参考设计原则和《Linux/Unix设计思想》
* 工具要尽量功能单一，可集成，可扩展
* gulp + rollup