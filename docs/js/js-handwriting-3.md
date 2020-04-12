# JavaScript 各种手写源码实现·下篇

## 实现 EventEmitter

```js
class EventEmitter {
  constructor() {
    this._events = {};
  }

  on(type, listener) {
    // 同类型事件归纳在一起，触发的时候挨个触发
    let cb = this._events[type] || [];
    cb.push(listener);
    this._events[type] = cb;
    return this;
  }

  off(type, listener) {
    const callbacks = this._events[type];
    // 如果是删除所有事件，一次性删除，否则删除对应事件
    if (!listener) {
      callbacks.length = 0;
    } else {
      this._events[type] = callbacks && callbacks.filter(cb => cb !== listener);
    }
    return this;
  }

  once(type, listener) {
    // 绑定一个事件：执行完毕就解除
    const cb = (...args) => {
      listener.call(this, ...args);
      this.off(type, cb);
    };
    this.on(type, cb);
    return this;
  }

  emit(type, ...args) {
    const callbacks = this._events[type];
    if (Array.isArray(callbacks)) {
      callbacks.forEach(cb => cb.call(this, ...args));
    }
  }
}
```

### 发布-订阅模式与观察者模式的区别

发布-订阅模式：

```js
class EventEmitter {
  constructor() {
    this._events = {};
  }

  on(type, listener) {
    this._events[type] = listener;
  }

  emit(type, ...args) {
    if (this._events[type]) {
      this._events[type].call(this, ...args);
    }
  }
}
```

观察者模式：

```js
class Subject {
  constructor() {
    this.observers = [];
  }

  add(observer) {
    this.observers.push(observer);
  }

  notify(...args) {
    this.observers.forEach(observer => observer.log(...args));
  }
}

class Observer {
  log(...args) {
    console.log(...args);
  }
}

const ob1 = new Observer();
const ob2 = new Observer();
const sub = new Subject();
sub.add(ob1);
sub.add(ob2);
sub.notify("Event Fire");
```

可以看出同样是在事件被触发时打印出 Event Fire 字符串，在**观察者模式**中只存在两个角色：Subject 和 Observer，Subject 通知(notify)事件，然后所有的 observers 都触发回调函数；而在 **发布-订阅** 模式中，存在三个角色：Publisher(emit 方法)、Subscriber(on 方法)和 Event Channel(EventEmitter 本身)，如下图所示：

![发布订阅](https://user-images.githubusercontent.com/19526072/78503711-ec384100-779a-11ea-8f3e-1017eecce274.png)

在**观察者模式**中，Subject 和 Observer 是互相耦合的 (Subject 要直接 addObserver)，而在 **发布-订阅** 模式中，由于 Event Channel 扮演了一个数据通道的角色，Publisher 和 Subscriber 是解耦的，这也使得 发布-订阅模式 相对于观察者模式更加灵活。可以说，**发布-订阅模式是一种特殊的观察者模式**。

原文地址：[22 常见设计模式](https://www.imooc.com/read/68/article/1567)

## 实现一个简易版 Promise

```js
function Promise(excutor) {
  var self = this;
  self.onResolvedCallback = [];
  function resolve(value) {
    setTimeout(() => {
      self.data = value;
      self.onResolvedCallback.forEach(callback => callback(value));
    });
  }
  excutor(resolve.bind(self));
}
Promise.prototype.then = function(onResolved) {
  var self = this;
  return new Promise(resolve => {
    self.onResolvedCallback.push(function() {
      var result = onResolved(self.data);
      if (result instanceof Promise) {
        result.then(resolve);
      } else {
        resolve(result);
      }
    });
  });
};
```

学习资料

- [最简实现 Promise，支持异步链式调用（20 行）](https://juejin.im/post/5e6f4579f265da576429a907)
- [手写一个 Promise/A+,完美通过官方 872 个测试用例](https://juejin.im/post/5e8bec156fb9a03c4d40f4bc)

## async/await 实现

来自：[手写 async await 的最简实现（20 行）](https://juejin.im/post/5e79e841f265da5726612b6e)

```js
function asyncToGenerator(generatorFunc) {
  // 返回的是一个新的函数
  return function() {
    // 先调用generator函数 生成迭代器
    // 对应 var gen = testG()
    const gen = generatorFunc.apply(this, arguments);

    // 返回一个promise 因为外部是用.then的方式 或者await的方式去使用这个函数的返回值的
    // var test = asyncToGenerator(testG)
    // test().then(res => console.log(res))
    return new Promise((resolve, reject) => {
      // 内部定义一个step函数 用来一步一步的跨过yield的阻碍
      // key有next和throw两种取值，分别对应了gen的next和throw方法
      // arg参数则是用来把promise resolve出来的值交给下一个yield
      function step(key, arg) {
        let generatorResult;

        // 这个方法需要包裹在try catch中
        // 如果报错了 就把promise给reject掉 外部通过.catch可以获取到错误
        try {
          generatorResult = gen[key](arg);
        } catch (error) {
          return reject(error);
        }

        // gen.next() 得到的结果是一个 { value, done } 的结构
        const { value, done } = generatorResult;

        if (done) {
          // 如果已经完成了 就直接resolve这个promise
          // 这个done是在最后一次调用next后才会为true
          // 以本文的例子来说 此时的结果是 { done: true, value: 'success' }
          // 这个value也就是generator函数最后的返回值
          return resolve(value);
        } else {
          // 除了最后结束的时候外，每次调用gen.next()
          // 其实是返回 { value: Promise, done: false } 的结构，
          // 这里要注意的是Promise.resolve可以接受一个promise为参数
          // 并且这个promise参数被resolve的时候，这个then才会被调用
          return Promise.resolve(
            // 这个value对应的是yield后面的promise
            value
          ).then(
            // value这个promise被resove的时候，就会执行next
            // 并且只要done不是true的时候 就会递归的往下解开promise
            // 对应gen.next().value.then(value => {
            //    gen.next(value).value.then(value2 => {
            //       gen.next()
            //
            //      // 此时done为true了 整个promise被resolve了
            //      // 最外部的test().then(res => console.log(res))的then就开始执行了
            //    })
            // })
            function onResolve(val) {
              step("next", val);
            },
            // 如果promise被reject了 就再次进入step函数
            // 不同的是，这次的try catch中调用的是gen.throw(err)
            // 那么自然就被catch到 然后把promise给reject掉啦
            function onReject(err) {
              step("throw", err);
            }
          );
        }
      }
      step("next");
    });
  };
}
```

## 双向绑定实现

## 参考资料

- [前端面试常考的手写代码不是背出来的！](https://juejin.im/post/5e57048b6fb9a07cc845a9ef)
- [各种手写源码实现](https://mp.weixin.qq.com/s?__biz=Mzg5ODA5NTM1Mw==&mid=2247485202&idx=1&sn=1a668530cdce1eaf53c2ec6d796fdd7b&chksm=c0668684f7110f922045c7a4539f78c51458ccafd5204ba7d89ad461ed360a1c14ed07778068&mpshare=1&scene=23&srcid=0329UG1H5LSPIxcKsQwUWXlo&sharer_sharetime=1585447184050&sharer_shareid=73865875704bcba3caa8b09c62f6bd7a%23rd)
- [JavaScript 中各种源码实现（前端面试笔试必备）](https://maimai.cn/article/detail?fid=1414317645&efid=GX16EiGB-SbwDA5N9-zXBQ&use_rn=1&from=timeline&isappinstalled=0)
- [冴羽的博客之 JavaScript 专题系列](https://github.com/mqyqingfeng/Blog)
- [22 常见设计模式](https://www.imooc.com/read/68/article/1567)
