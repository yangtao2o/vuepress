# 初探JavaScript之Prototype

## `Array.prototype`

**每一个函数，都有一个 prototype 属性**，不管是你自定义的，还是函数内置的。

```javascript
var fn = function() {}
console.log(fn.prototype)  // {constructor: ƒ}
console.log(fn.prototype.constructor === fn)  // true
```
![](https://pic.superbed.cn/item/5d6c902c451253d1786d5569.png)

这里的 `fn.prototype` 打印出一个对象，对象里的 `constructor` 属性又指回了该函数本身 fn。

即**每个原型都有一个 consctructor 属性指向关联的构造函数**，比如：

```javascript
Array === Array.prototype.constructor //true
```
![](https://pic.superbed.cn/item/5d6c902c451253d1786d556b.png)

我们接着看：

```javascript
console.log(Array.prototype) // [constructor: ƒ, concat: ƒ, copyWithin: ƒ, fill: ƒ, find: ƒ, …]
```

这里，除了 constructor 属性，还有其他内置的属性，即我们经常使用的操作数组的方法。

## `__proto__`(隐式原型)

**所有通过函数 `new` （构造函数）出来的东西，都有一个 `__proto__` 指向该函数的 `prototype`**，比如：

```javascript
var arr = new Array()
arr.__proto__ === Array.prototype // true
Array === Array.prototype.constructor //true
```
![](https://pic.superbed.cn/item/5d6c902c451253d1786d556d.png)

说白了，通过构造函数 new 出来的函数，该函数的`__proto__`属性指向构造函数的原型对象（即`Array.prototype`），所以，该函数与构造函数之间没有什么关联，是通过 原型对象 产生了联系，这也就是原型链继承的雏形吧。

举个关于继承 extends 的例子：

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
var dog = new Dog()

dog.eat()  // Animal eat
dog.bark()  // Dog bark
```

上面看明白了，那么ES6的继承我们也就可以明白原理了，即 `class Dog extends Animal` 相当于 `Dog.prototype = new Animal()`

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

const dog = new Dog('哈士奇')
dog.eat()
dog.bark()
```

接下来，我们就清楚为什么能这样：

**当我们要使用一个对象（数组）的某个功能时，如果该对象本身具有这个功能，直接调用，没有的话，那就去自身的`__proto__`属性中去找**

```javascript
var obj = {
  myfn: function() {
    console.log('myfn')
  }
}
obj.myfn() // 'myfn'
obj.hasOwnProperty('myfn')  //true
obj.toString()  // "[object Object]"
obj.hasOwnProperty('toString')  // false
obj.__proto__.hasOwnProperty('toString')  // true
```

`hasOwnProperty()`就可以得出这个属性是否是属于该对象本身的属性:
* myfn 是我们自定义的，`obj.hasOwnProperty('myfn')`为 true
* toString() 我们不是自定义的，却可以使用，查一下是否属于自定义属性，`obj.hasOwnProperty('toString')`，答案为false
* 既然不属于自定义属性，那就去自身的`__proto__`去找，然后去原型对象上查一下，`obj.__proto__.hasOwnProperty('toString')`，哦，原来在这儿

在源码中，我们经常看到`Array.prototype.concat`，其实就是我们使用的`[].concat`，`[]`，因为`[].__proto__ === Array.prototype`

## `__proto__`是可修改的

比如，我们新增一个`addClass()`方法：
```javascript
var arr = [1,2,3];
arr.__proto__.addClass = function () {
    console.log(123);
}
arr.push(4);
arr.addClass();   // 123
```
![](https://pic.superbed.cn/item/5d6c902c451253d1786d556f.png)

但是，这里要注意，如下重写之后，就没有了诸如 push、concat等方法：

```javascript
arr.__proto__ = {
    addClass: function () {
        console.log(123);
    }
};
arr.push(3)  //Uncaught TypeError: arr.push is not a function
```

### `Object.prototype`的原型

万物皆对象，到最后依旧是对象，最后这个东东是个啥，我们来看一下：
```javascript
// 构造函数 Person
function Person() {}

// 实例对象 myfn，它的 隐式原型 指向了其构造函数的 原型对象
var myfn = new Person()
myfn.__proto__ === Person.prototype  //true

// 那构造函数 Person 的 隐式原型又指向了谁呢
Person.prototype.__proto__ === Object.prototype  //true

// Function呐
Function.prototype.__proto__ === Object.prototype  //true

// 这个呢
var fn = function() {}
fn.prototype.__proto__ === Object.prototype  //true
Object.prototype.__proto__ === null  //true
typeof null  //"object"
```
### 总结：
* 所有的函数都有一个 `prototype`属性，该属性指向了一个对象，该对象就是调用该构造函数而创建出来的实例（如myfn）的原型（如`myfn.__proto__`）,即：`myfn.__proto__ === Person.prototype`
  
* 所有的对象（除null）都具有一个`__proto__`属性，该属性指向该对象的原型，比如：`myfn.__proto__ === Person.prototype`

* 原型也是一个对象，根据上条，那原型的原型，就是`Object.prototype`

* 最后的null对象，可以当做是 什么都没有
  
盗一张图，我们就更加清楚了（蓝色这条表示的是原型链）
![](https://pic.superbed.cn/item/5d6c902c451253d1786d5572.png)

PS: 关于原型对象这一块本来就很绕，自己看懂了不一定就真的懂了，自己梳理的时候还是漏洞百出，而且还乱，就算现在我梳理了一遍，过些日子，我要是不再继续翻阅，应该又讲不通了，下面的资料很详细，在我学习的过程中提供了很大的帮助，在此感谢作者们！

参考资料：
* [js原型链基础](https://www.kancloud.cn/wangfupeng/zepto-design-srouce/173684)
* [JavaScript深入之从原型到原型链 ](https://github.com/mqyqingfeng/Blog/issues/2)
* [深入理解javascript原型和闭包（3）——prototype原型](https://www.cnblogs.com/wangfupeng1988/p/3978131.html)

同步于 [掘金](https://juejin.im/post/5c73950651882562276c4bb2) 、[QDfuns](https://www.qdfuns.com/article.php?mod=view&id=27061d05c8bcf1e650ddddc75ad9c127&uid=32286)
