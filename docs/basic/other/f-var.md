# 初探 JavaScript 的变量

## 基本类型和引用类型的值

`ECMAScript`变量一般有两种数据类型的值：**基本类型和引用类型**。
* 基本类型： 简单的数据段：`Undefined, Null, Boolean, Number, String`
* 引用类型：多个值构成的对象；

#### 1. 动态的属性

定义两者的值：创建一个变量并为其变量赋值；

执行两者的值：
* 引用类型：可以添加、删除属性和方法；
* 基本类型：不能添加、删除属性和方法；

比如：引用类型 a，可以添加属性 name age
```javascript
var a = new Object();
a.name = "杨子龙";
a.age = 24;
console.log(a.name);                      //杨子龙
```
基本类型 name 无法添加属性 age 
```javascript
var name = "杨子龙";
name.age  = 24;
console.log(name.age);                 //undefined
```
代码中可知：只能给引用类型值动态地添加属性，以便将来使用。

#### 2. 赋值变量值

从一个变量向另一个变量复制基本类型值和引用类型值时：

* 基本类型：在变量对象上创建一个新值，并将其值复制给新变量分配的位置上；（完全独立的两个变量）
例如：

```JavaScript
var a = 111;
var b = a;
console.log(b);                 //111
```
代码中可知：变量b的值只是变量a的值的一个副本，两者的值111是完全独立的。

* 引用类型：将存储在变量对象中的值复制一份放到为新变量分配的空间中；（引用同一个对象的两个变量）

引用类型的值的副本实际是一个指针，指向存储在堆中的一个对象。
例如：
```JavaScript
var obj1 = new Object;
var obj2 = obj1;
obj1.name = "杨子龙";
console.log(obj2,name);                 // Object { name="杨子龙"} 杨子龙
```
代码中可知：obj1和obj2都指向同一个对象Object；所以，为obj1添加的name属性，通过obj2也可以访问的到。

#### 3. 传递参数

我们都知道基本类型是**按值访问**的，因为可以访问保存在变量中的实际的值。
所有函数的参数都是**按值传递**的。

* 基本类型：基本类型值的传递如同基本类型变量的复制一样；
在向参数传递值，被传递的值会被复制给一个局部变量（命名参数），因此这个局部变量的变化不会反映在函数的外部。

例如：

```JavaScript
function fn(num) {
  num += 10;
  return num;
}
var a = 10;
var result = fn(a);
console.log(result);        //20
console.log(a);             //10
```
代码中可知：参数num和变量a互不相识，只是有着相同的值而已，用完之后，你还是你，我还是我，互不干政。

* 引用类型：引用类型的传递如同引用类型变量的复制一样；
在向参数传递值时，会把这个值在内存中的地址复制给一个局部变量，因此这个局部变量的变化会反映在函数的外部。

例如：
```JavaScript
function fn(obj) {
  obj.name = '杨子龙';
}
var person = new Object();
fn(person);
console.log(person.name);           //杨子龙
```
代码中可知：在这个函数内部，参数obj和变量person引用的是同一个对象Object，所以，你不动我也不动，你动我也动，你中有我，我中有你，情义绵绵，经久不息……

也就是说：即使变量person是按值传递的，但是参数obj（想象成局部变量）还是会按引用来访问同一个对象。
>  访问变量有按值和按引用两种方式，参数只能按值传递。

#### 4. 检测类型
* 基本类型：`typeof`
* 引用类型：`instanceof`（对象或null）

例如：

```JavaScript
var a = 'Yang Zilong';
var b = 24;
var c = '';
var d = true;
var e;
var g = undefined;
var f = null;  // 比较特殊
var h = new Object();

console.log(typeof a); //string
console.log(typeof b); //number 
console.log(typeof c); //string
console.log(typeof d); //boolean
console.log(typeof e); //undefined
console.log(typeof g); //undefined
console.log(typeof f); //object
console.log(typeof h); //object
```
> 所用引用类型的值都是Object的实例。

如下：
```JavaScript
var person = new Object();
var num = [1,2, 3];
var pattern = /.at/i;
console.log(person instanceof Object);     //true
console.log(num instanceof Object);        //true
console.log(num instanceof Array);         //true
console.log(pattern instanceof Object);    //true
console.log(pattern instanceof RegExp);    //true
```
> 使用`instanceof`检测基本类型，会返回`false`，基本类型不是对象。

* 参考资料：《JavaScript高级程序设计》（第三版）第四章
* 同步于： [掘金](https://juejin.im/post/5c73a28cf265da2de52d9390)、[慕课网](https://www.imooc.com/article/280082)