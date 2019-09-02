# 学习JavaScript深入系列简要总结

## 从原型到原型链
原文地址：[JavaScript深入之从原型到原型链](https://github.com/mqyqingfeng/Blog/issues/2)
> 每一个函数都有一个`prototype`属性，该属性指向了一个对象，此对象为调用该函数而创建的实例的原型

![构造函数和实例原型的关系图](https://github.com/mqyqingfeng/Blog/raw/master/Images/prototype1.png)

> 每一个对象（除null）都具有一个属性：`__proto__`，这个属性指向该对象的原型

![实例与实例原型的关系图](https://github.com/mqyqingfeng/Blog/raw/master/Images/prototype2.png)

> 每个原型都有一个constructor属性指向关联的构造函数

![](https://raw.githubusercontent.com/mqyqingfeng/Blog/master/Images/prototype3.png)

> 原型对象是通过 `Object` 构造函数生成的，最后`Object.prototype.__proto__ = null`

![原型链示意图](https://github.com/mqyqingfeng/Blog/raw/master/Images/prototype5.png)

## 词法作用域和动态作用域 
原文链接：[JavaScript深入之词法作用域和动态作用域](https://github.com/mqyqingfeng/Blog/issues/3)
> javascript采用的是`词法作用域(lexical scoping)`，函数的作用域是在函数定义的时候就决定了，而不是调用的时候才决定

* 词法作用域，即静态作用域，函数的作用域在函数定义的时候就决定了
* 动态作用域，函数的作用域是在函数调用的时候才决定

## 执行上下文栈
当执行一个函数的时候，就会创建一个`执行上下文(execution context)`，并且压入`执行上下文栈(Execution context stack, ESC)`

当函数执行完毕的时候，会将函数的`执行上下文栈`中弹出

## 变量对象
1、全局上下文的变量对象初始化：全局对象

2、函数上下文的变量对象初始化：只包括`Arguments`对象

3、进入执行上下文时：给变量对象添加形参、函数声明、变量声明等初始的属性值

4、代码执行阶段：再次修改变量对象的属性值

总结：未进入执行阶段之前，`变量对象(VO)`中的属性都不能访问！但是进入执行阶段之后，`变量对象(VO)`转变为了`活动对象(AO)`，里面的属性都能被访问了，然后开始进行执行阶段的操作。它们其实都是同一个对象，只是处于执行上下文的不同生命周期。

最后，函数是“第一等公民”，记住这个，变量名称和函数名称相同的声明，优先执行函数声明

## 作用域

## 从ECMAScript规范解读this

## 执行上下文

## 闭包
闭包是指那些能够访问自由变量的函数。

自由变量是指在函数中使用的，但既不是参数也不是函数的局部变量的变量。

那么，闭包 = 函数 + 函数能够访问的自由变量。

## 参数按值传递

ECMAScript中所有函数的参数都是按值传递的。

即，把函数外部的值复制给函数内部的参数，就和把值从一个变量复制给另一个变量一样。

参数如果是基本类型是按值传递，如果是引用类型按共享传递。

共享传递是指，在传递对象的时候，传递对象的引用的副本。

## call和apply的模拟实现

`call()`在使用一个指定的this值和若干个指定的参数值的前提下，调用某个函数或方法。

```javascript
Function.prototype.mycall = function(context) {
  var context = context || window;
  //获取调用call的函数，用this可以获取
  context.fn = this;
  var args = [];
  for (var i = 1, l = arguments.length; i < l; i++) {
    args.push('arguments[' + i + ']');
  }
  // 把传给call的参数传递给了context.fn函数
  var result = eval('context.fn(' + args + ')');
  delete context.fn;
  return result;
}

```
`apply()`同`call()`，只不过将多个参数值，以数组的形式传入而已。

```javascript
Function.prototype.myapply = function(context, arr) {
  var context = Object(context) || window;
  context.fn = this;
  var result;
  if (!arr) {
    result = context.fn();
  } else {
    var args = [];
    for (var index = 0; index < arr.length; index++) {
      args.push('arr[' + index + ']');
    }
    result = eval('context.fn(' + args + ')');
  }
  delete context.fn;
  return result;
}
```

## bind的模拟实现

`bind()`方法会创建一个新函数。当这个新函数被调用，bind()第一个参数将作为它运行时的this，之后的一系列参数将会在传递的实参前传入，作为它的参数。

## new的模拟实现

new运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象类型之一。