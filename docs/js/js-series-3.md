# 学习冴羽的 JS 深入系列·下篇

## 创建对象的多种方式以及优缺点

这篇文章更像是笔记，因为《JavaScript 高级程序设计》写得真是太好了！

### 工厂模式

```js
function createPerson(name) {
  var o = new Object();
  o.name = name;
  o.getName = function() {
    console.log(this.name);
  };

  return o;
}

var person1 = createPerson("kevin");
```

缺点：对象无法识别，因为所有的实例都指向一个原型

### 构造函数模式

```js
function Person(name) {
  this.name = name;
  this.getName = function() {
    console.log(this.name);
  };
}

var person1 = new Person("kevin");
```

优点：实例可以识别为一个特定的类型

缺点：每次创建实例时，每个方法都要被创建一次

- 构造函数模式优化

```js
function Person(name) {
  this.name = name;
  this.getName = getName;
}

function getName() {
  console.log(this.name);
}

var person1 = new Person("kevin");
```

优点：解决了每个方法都要被重新创建的问题

缺点：全局命名变量太多

### 原型模式

```js
function Person(name) {}

Person.prototype.name = "keivn";
Person.prototype.getName = function() {
  console.log(this.name);
};

var person1 = new Person();
```

优点：方法不会重新创建

缺点：1. 所有的属性和方法都共享； 2. 不能初始化参数；

- 原型模式优化 1

```js
function Person(name) {}

Person.prototype = {
  name: "kevin",
  getName: function() {
    console.log(this.name);
  }
};

var person1 = new Person();
```

优点：封装性好了一点

缺点：重写了原型，丢失了 constructor 属性

- 原型模式优化 2

```js
function Person(name) {}

Person.prototype = {
  constructor: Person,
  name: "kevin",
  getName: function() {
    console.log(this.name);
  }
};

var person1 = new Person();
```

优点：实例可以通过 constructor 属性找到所属构造函数

缺点：原型模式该有的缺点还是有

### 组合模式

构造函数模式与原型模式双剑合璧。

```js
function Person(name) {
  this.name = name;
}

Person.prototype = {
  constructor: Person,
  getName: function() {
    console.log(this.name);
  }
};

var person1 = new Person();
```

优点：该共享的共享，该私有的私有，使用最广泛的方式

缺点：有的人就是希望全部都写在一起，即更好的封装性

- 动态原型模式

```js
function Person(name) {
  this.name = name;
  if (typeof this.getName != "function") {
    Person.prototype.getName = function() {
      console.log(this.name);
    };
  }
}

var person1 = new Person();
```

注意：使用动态原型模式时，不能用对象字面量重写原型

解释下为什么：

```js
function Person(name) {
  this.name = name;
  if (typeof this.getName != "function") {
    Person.prototype = {
      constructor: Person,
      getName: function() {
        console.log(this.name);
      }
    };
  }
}

var person1 = new Person("kevin");
var person2 = new Person("daisy");

// 报错 并没有该方法
person1.getName();

// 注释掉上面的代码，这句是可以执行的。
person2.getName();
```

为了解释这个问题，假设开始执行`var person1 = new Person('kevin')`。

如果对 new 和 apply 的底层执行过程不是很熟悉，可以阅读底部相关链接中的文章。

我们回顾下 new 的实现步骤：

首先新建一个对象，然后将对象的原型指向 `Person.prototype`，然后 `Person.apply(obj)`返回这个对象。

注意这个时候，回顾下 apply 的实现步骤，会执行 `obj.Person` 方法，这个时候就会执行 if 语句里的内容，注意构造函数的 prototype 属性指向了实例的原型，使用字面量方式直接覆盖 `Person.prototype`，并不会更改实例的原型的值，person1 依然是指向了以前的原型，而不是 `Person.prototype`。而之前的原型是没有 getName 方法的，所以就报错了！

如果你就是想用字面量方式写代码，可以尝试下这种：

```js
function Person(name) {
  this.name = name;
  if (typeof this.getName != "function") {
    Person.prototype = {
      constructor: Person,
      getName: function() {
        console.log(this.name);
      }
    };

    return new Person(name);
  }
}

var person1 = new Person("kevin");
var person2 = new Person("daisy");

person1.getName(); // kevin
person2.getName(); // daisy
```

### 寄生构造函数模式

```js
function Person(name) {
  var o = new Object();
  o.name = name;
  o.getName = function() {
    console.log(this.name);
  };

  return o;
}

var person1 = new Person("kevin");
console.log(person1 instanceof Person); // false
console.log(person1 instanceof Object); // true
```

寄生构造函数模式，我个人认为应该这样读：寄生-构造函数-模式，也就是说寄生在构造函数的一种方法。

也就是说打着构造函数的幌子挂羊头卖狗肉，你看创建的实例使用 instanceof 都无法指向构造函数！

这样方法可以在特殊情况下使用。比如我们想创建一个具有额外方法的特殊数组，但是又不想直接修改 Array 构造函数，我们可以这样写：

```js
function SpecialArray() {
  var values = new Array();

  for (var i = 0, len = arguments.length; i < len; i++) {
    values.push(arguments[i]);
  }

  values.toPipedString = function() {
    return this.join("|");
  };
  return values;
}

var colors = new SpecialArray("red", "blue", "green");
var colors2 = SpecialArray("red2", "blue2", "green2");

console.log(colors);
console.log(colors.toPipedString()); // red|blue|green

console.log(colors2);
console.log(colors2.toPipedString()); // red2|blue2|green2
```

你会发现，其实所谓的寄生构造函数模式就是比工厂模式在创建对象的时候，多使用了一个 new，实际上两者的结果是一样的。

但是作者可能是希望能像使用普通 Array 一样使用 SpecialArray，虽然把 SpecialArray 当成函数也一样能用，但是这并不是作者的本意，也变得不优雅。

在可以使用其他模式的情况下，不要使用这种模式。

但是值得一提的是，上面例子中的循环：

```js
for (var i = 0, len = arguments.length; i < len; i++) {
  values.push(arguments[i]);
}
```

可以替换成：

```js
values.push.apply(values, arguments);
```

### 稳妥构造函数模式

```js
function person(name) {
  var o = new Object();
  o.sayName = function() {
    console.log(name);
  };
  return o;
}

var person1 = person("kevin");

person1.sayName(); // kevin

person1.name = "daisy";

person1.sayName(); // kevin

console.log(person1.name); // daisy
```

所谓稳妥对象，指的是没有公共属性，而且其方法也不引用 this 的对象。

与寄生构造函数模式有两点不同：

- 新创建的实例方法不引用 this
- 不使用 new 操作符调用构造函数
- 稳妥对象最适合在一些安全的环境中。

稳妥构造函数模式也跟工厂模式一样，无法识别对象所属类型。

原文链接：[JavaScript 深入之创建对象的多种方式以及优缺点](https://github.com/mqyqingfeng/Blog/issues/15)

## 继承的多种方式和优缺点

### 原型链继承

```js
function Parent() {
  this.name = 'Yang';
}
Parent.prototype.getName = function() {
  return this.name;
}

function Child() { }
Child.prototype = new Parent();

var myself = new Child();
myself.getName();  // 'Yang'
```

问题：

- 引用类型的属性被所有实例共享
- 在创建 Child 的实例时，不能向Parent传参

### 借用构造函数(经典继承)

```js
function Parent(name) {
  this.name = name;
}
function Child(name) {
  Parent.call(this, name);
}
var myself1 = new Child('Yang');
var myself2 = new Child('Wang');
console.log(myself1.name)  // 'Yang'
console.log(myself2.name)  // 'Wang'
```

优点：

- 避免了引用类型的属性被所有实例共享
- 可以在 Child 中向 Parent 传参

缺点：

- 方法都在构造函数中定义，每次创建实例都会创建一遍方法

### 组合继承

原型链继承和经典继承双剑合璧。

```js
function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}
Parent.prototype.getName = function() {
  return this.name;
}

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}
Child.prototype = new Parent();
Child.prototype.constructor = Child;

var child1 = new Child('yang', 27);
child1.colors.push('white');

console.log(child1.name);  // "yang"
console.log(child1.age);  // 27
console.log(child1.colors);  // ["red", "blue", "green", "white"]

var child2 = new Child('ming', 20);

console.log(child2.name);  // "ming"
console.log(child2.age);  // 20
console.log(child2.colors);  // ["red", "blue", "green"]
child2.getName();  // "ming"
```

优点：融合原型链继承和构造函数的优点，是 JavaScript 中最常用的继承模式。

### 原型式继承

就是 ES5 `[Object.create](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)` 的模拟实现，将传入的对象作为创建的对象的原型。

```js
function createObj(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
}
```

缺点：包含引用类型的属性值始终都会共享相应的值，这点跟原型链继承一样。

### 寄生式继承

创建一个仅用于封装继承过程的函数，该函数在内部以某种形式来做增强对象，最后返回对象。

```js
function createObj(o) {
  var clone = Object.create(o);
  clone.sayName = function() {
    console.log('hi');
  };
  return clone;
}
```

缺点：跟借用构造函数模式一样，每次创建对象都会创建一遍方法。

### 寄生组合式继承

组合继承最大的缺点是会调用两次父构造函数。

- 设置子类型实例的原型的时候：`Child.prototype = new Parent();`
- 创建子类型实例的时候：`Parent.call(this, name);`

```js
function object(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
}
function prototype(child, parent) {
  var prototype = object(parent.prototype);
  child.prototype.constructor = child;
  child.prototype = prototype;
}

prototype(Child, Parent);
```

引用《JavaScript高级程序设计》中对寄生组合式继承的夸赞就是：

> 这种方式的高效率体现它只调用了一次 Parent 构造函数，并且因此避免了在 Parent.prototype 上面创建不必要的、多余的属性。与此同时，原型链还能保持不变；因此，还能够正常使用 instanceof 和 isPrototypeOf。开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。

原文链接：[JavaScript深入之继承的多种方式和优缺点](https://github.com/mqyqingfeng/Blog/issues/16)
