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

学习资料

- [手写一个Promise/A+,完美通过官方872个测试用例](https://juejin.im/post/5e8bec156fb9a03c4d40f4bc)

## async/await 实现

## 双向绑定实现

## 参考资料

- [前端面试常考的手写代码不是背出来的！](https://juejin.im/post/5e57048b6fb9a07cc845a9ef)
- [各种手写源码实现](https://mp.weixin.qq.com/s?__biz=Mzg5ODA5NTM1Mw==&mid=2247485202&idx=1&sn=1a668530cdce1eaf53c2ec6d796fdd7b&chksm=c0668684f7110f922045c7a4539f78c51458ccafd5204ba7d89ad461ed360a1c14ed07778068&mpshare=1&scene=23&srcid=0329UG1H5LSPIxcKsQwUWXlo&sharer_sharetime=1585447184050&sharer_shareid=73865875704bcba3caa8b09c62f6bd7a%23rd)
- [JavaScript 中各种源码实现（前端面试笔试必备）](https://maimai.cn/article/detail?fid=1414317645&efid=GX16EiGB-SbwDA5N9-zXBQ&use_rn=1&from=timeline&isappinstalled=0)
- [冴羽的博客之 JavaScript 专题系列](https://github.com/mqyqingfeng/Blog)
- [22 常见设计模式](https://www.imooc.com/read/68/article/1567)