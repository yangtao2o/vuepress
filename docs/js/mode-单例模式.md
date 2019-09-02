# js设计模式学习之单例模式

> 保证一个类仅有一个实例，并提供一个访问它的全局访问点

## 实现一个单例模式

用一个变量标志当前是否已经为某个类型创建过对象，如果是，则下次直接返回之前创建的对象。

```js
var Singleton = function (name) {
  this.name = name;
  this.instance = null;
}

Singleton.prototype.getName = function () {
  console.log(this.name);
}

Singleton.getInstance = function (name) {
  if (!this.instance) {
    this.instance = new Singleton(name);
  }
  return this.instance;
}

var a = Singleton.getInstance('Tony1');
var b = Singleton.getInstance('Tony2');

console.log(a === b); // true
```
通过 `Singleton.getInstance `来获取 Singleton 类的唯一对象，里边使用了 new 来获取，导致了这个类的“不透明性”。

## 透明的单例模式

创建一个“透明”的单例类，就是让我们从这个类中创建对象的时候可以和使用其他普通类一样：`var aa = new CreateDiv('Sisi1');`

```js
var CreateDiv = (function () {
  var instance;

  var CreateDiv = function (html) {
    if (instance) {
      return instance;
    }
    this.html = html;
    this.init();
    return instance = this;
  };

  CreateDiv.prototype.init = function () {
    var div = document.createElement('div');
    div.innerHTML = this.html;
    document.body.appendChild(div);
  };

  return CreateDiv;

})();

var aa = new CreateDiv('Sisi1');
var bb = new CreateDiv('Sisi2');

console.log(aa === bb);  // true
```

下面这段代码中，CreateDiv 的构造函数负责了两件事：创建对象和执行初始化 init 方法，及保证只有一个对象：

```js
var CreateDiv = function (html) {
  if (instance) {
    return instance;
  }
  this.html = html;
  this.init();
  return instance = this;
};
```

但是，如果我们要创建很多的div，这里的 `return instance = this;` 就需要删掉。

## 用代理实现单例模式

这时候，为了避免上面不能复用的尴尬，通过引入代理类的方式，把负责管理单例的逻辑移交至代理类`ProxySingletonCreateDiv`，这样`CreateDiv`只是一个普通的类。

```js
var CreateDiv = function (html) {
  this.html = html;
  this.init();
};

CreateDiv.prototype.init = function () {
  var div = document.createElement('div');
  div.innerHTML = this.html;
  document.body.appendChild(div);
}

var ProxySingletonCreateDiv = (function () {
  var instance;
  return function (html) {
    if (!instance) {
      instance = new CreateDiv(html);
    }
    return instance;
  }
})();

var aa = new ProxySingletonCreateDiv('Tony1');
var bb = new ProxySingletonCreateDiv('Tony2');

console.log(aa === bb); // true
```

## JavaScript 中的单例模式

单例模式的核心是：确保只有一个实例，并提供全局访问。

1. 使用命名空间

对象字面量的方式: 

```js

var namespace1 = {
  a: function() {
    console.log(1);
  },
  b: function() {
    console.log(2);
  }
}
namespace1.a(); //1
```
把a和b都定义为 namespace1 的属性，减少了变量和全局作用域打交道的机会，还可以动态地创建命名空间：

```js
var MyApp = {};

MyApp.namespace = function (name) {
  var parts = name.split('.');
  var current = MyApp;
  for (var i in parts) {
    if (!current[parts[i]]) {
      current[parts[i]] = {};
    }
    current = current[parts[i]];
  }
}

MyApp.namespace('event');
MyApp.namespace('dom.style');

console.log(MyApp);

// 相当于：
var MyApp = {
  event: {},
  dom: {
    style: {}
  }
}
``` 

2. 使用闭包封装私有变量

使用下划线约定私有变量 _name 和 _age。

```js
var user = (function () {
  var _name = 'Seven';
  var _age = 27;

  return {
    getUserInfo: function () {
      return _name + '-' + _age;
    }
  }
})();

console.log(user.getUserInfo()) // Seven-27
```

## 惰性单例

宗旨：在需要的时候才创建对象！！！

栗子：QQ的登录浮窗

第一种方案：页面加载完成的时候便创建好浮窗。

```js
var loginLayer = (function () {
  var div = document.createElement('div');
  div.innerHTML = '我是一个小小的悬浮框';
  div.style.display = 'none';
  document.body.appendChild(div);
  return div;
})();

document.getElementById('loginBtn').addEventListener('click', function () {
  loginLayer.style.display = 'block';
});
```

但是，不管我们登录与否，都会创建悬浮窗，所以我们可以修改为：在点击登录的时候再创建悬浮窗。

```js
var createLoginLayer = function () {
  var div = document.createElement('div');
  div.innerHTML = '我是一个小小的悬浮框';
  div.style.display = 'none';
  document.body.appendChild(div);
  return div;
};

document.getElementById('loginBtn').addEventListener('click', function () {
  var loginLayer = createLoginLayer();
  loginLayer.style.display = 'block';
});
```

这时候，虽然达到了惰性的目的，却失去了单例的效果，每次点击登录，都会创建一个新的悬浮窗。

所以我们需要一个变量来判断是否已经创建过悬浮窗：

```js
var createLoginLayer = (function () {
  var div;
  return function () {
    if (!div) { // 判断是否已创建
      div = document.createElement('div');
      div.innerHTML = '我是一个小小的悬浮框';
      div.style.display = 'none';
      document.body.appendChild(div);
    }
    return div;
  }
})();

document.getElementById('loginBtn').addEventListener('click', function () {
  var loginLayer = createLoginLayer();
  loginLayer.style.display = 'block';
});
```

## 通用的惰性单例

虽然上面的悬浮框是一个可用的惰性单例，但是仍然违反了单一职责原则，如果我们要创建其他的标签，就需要把创建悬浮窗的函数复制一份，再修修改改，无法做到复用。

所以，我们需要把不变的部分隔离出来，进行抽象，无论创建什么标签，都是一样的逻辑：

```js
var obj;
if(!obj) {
  obj = xxx;
}
```

接着，继续：

```js
var getSingle = function (fn) {
  var result;
  return function () {
    return result || (result = fn.apply(this, arguments));
  }
}

var createLoginLayer = function () {
  var div = document.createElement('div');
  div.innerHTML = '我是一个小小的悬浮框';
  div.style.display = 'none';
  document.body.appendChild(div);
  return div;
}

var createSingleLoginLayer = getSingle(createLoginLayer);

document.getElementById('loginBtn').addEventListener('click', function () {
  var loginLayer = createSingleLoginLayer();
  loginLayer.style.display = 'block';
});
```

这时，我们创建其他标签就只需要关系如何创建该标签就可以：

```js
var createIframe = function () {
  var iframe = document.createElement('iframe');
  iframe.src = 'https://baidu.com';
  document.body.appendChild(iframe);
  return iframe;
}

var createSingleIframe = getSingle(createIframe);

document.getElementById('loginBtn2').addEventListener('click', function () {
  createSingleIframe();
});
```

## 小结

单例模式是一种简单却非常常用的模式，特别是惰性单例技术，在合适的时候才创建对象，并且只创建唯一的一个。

*创建对象* 和 *管理单例* 的职责被分布在两个不同的方法中，两个方法组合起来才具有单例模式的威力。

学习资料：
* 《JavaScript 设计模式与开发实践》第 4 章

发布：
* 掘金[《js设计模式学习之单例模式》](https://juejin.im/post/5ccb927a6fb9a0324936c2c6)
