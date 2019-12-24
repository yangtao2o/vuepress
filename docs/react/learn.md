# React 理论知识点

## JSX 语法

JSX 是一个 JavaScript 的语法扩展。

JSX 可以被 Babel 转码器转为正常的 JavaScript 语法。Babel 会把 JSX 转译成一个名为 `React.createElement()` 函数调用。

React 认为渲染逻辑本质上与其他 UI 逻辑内在耦合，比如，在 UI 中需要绑定处理事件、在某些时刻状态发生变化时需要通知到 UI，以及需要在 UI 中展示准备好的数据。

React 并没有采用将标记与逻辑进行分离到不同文件这种人为地分离方式，而是通过将二者共同存放在称之为“组件”的松散耦合单元之中，来实现关注点分离。

```js
export default () => {
  return <div className="greeting">hello world</div>;
};
```

可以转化为：

```js
export default = function() {
  return React.createElement(
    'div',
    {className: 'greeting'},
    'hello world'
  )
}
```

`React.createElement()` 会预先执行一些检查，以帮助你编写无错代码，但实际上它创建了一个这样的对象：

```js
// 注意：这是简化过的结构
const element = {
  type: "div",
  props: {
    className: "greeting",
    children: "hello world"
  }
};
```

所以，可以回答为什么要引入 React?

babel 里进行转化一下，发现 babel 会把代码转化成:

```js
return React.createElement("div", { className: "greeting" }, "hello world");
```

因为从本质上讲，JSX 只是为 `React.createElement(component, props, ...children)` 函数提供的语法糖。

参考：[JSX 简介](https://zh-hans.reactjs.org/docs/introducing-jsx.html)

## 受控组件与非受控组件

| 受控组件                                       | 非受控组件               |
| ---------------------------------------------- | ------------------------ |
| 1. 没有维持自己的状态                          | 1. 保持着自己的状态      |
| 2.数据由父组件控制                             | 2.数据由 DOM 控制        |
| 3. 通过 props 获取当前值，然后通过回调通知更改 | 3. Refs 用于获取其当前值 |

参考：[受控组件与非受控组件](https://www.yuque.com/ant-design/course/goozth)

## 生命周期

[生命周期图谱](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)速查表。

React 16 的生命周期，总的来说 React 组件的生命周期分为三（四）个部分:

- 装载期间(Mounting)
- 更新期间(Updating)
- 卸载期间(Unmounting)
- 捕捉错误（React16）componentDidCatch()

### 装载期间

组件被实例化并挂载在到 DOM 树这一过程称为装载，在装载期调用的生命周期函数依次为

- constructor() - 初始化这个组件的一些状态和操作
- getDerivedStateFromProps() - 会在 render 函数被调用之前调用
- render() - 根据状态 state 和属性 props 渲染一个 React 组件
- componentDidMount() - 在 render 方法之后立即被调用，只会被调用一次

示例 contructor 实现如下：

```js
constructor(props) {
  super(props);
  this.state = {
    color: '#fff'
  };

  this.handleClick = this.handleClick.bind(this);
}
```

getDerivedStateFromProps 配合 componentDidUpdate 的写法如下:

```js
class ExampleComponent extends React.Component {
  state = {
    isScrollingDown: false,
    lastRow: null
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    // 不再提供 prevProps 的获取方式
    if (nextProps.currentRow !== prevState.lastRow) {
      return {
        isScrollingDown: nextProps.currentRow > prevState.lastRow,
        lastRow: nextProps.currentRow
      };
    }

    // 默认不改动 state
    return null;
  }

  componentDidUpdate() {
    // 仅在更新触发后请求数据
    this.loadAsyncData();
  }

  loadAsyncData() {
    /* ... */
  }
}
```

如何在 componentDidMount 加载数据并设置状态:

```js
componentDidMount() {
  fetch("https://api.github.com/search/repositories?q=language:java&sort=stars")
    .then(res => res.json())
    .then((result) => {
        this.setState({ // 触发render
          items: result.items
        });
      })
    .catch((error) => { console.log(error)});
  // this.setState({color: xxx}) // 不要这样做
}
```

### 更新期间

当组件的状态或属性变化时会触发更新，更新过程中会依次调用以下方法:

- getDerivedStateFromProps()
- shouldComponentUpdate(nextProps, nextState) - 是否要进行下一次 render()，默认这个函数放回 true
- render()
- getSnapshotBeforeUpdate() - 触发时间为 update 发生的时候，在 render 之后 dom 渲染之前返回一个值，作为 componentDidUpdate 的第三个参数
- componentDidUpdate() - 在更新完成后被立即调用，可以进行 DOM 操作，或者做一些异步调用

### 卸载期间

卸载期间是指组件被从 DOM 树中移除时，调用的相关方法为:

- componentWillUnmount()

该方法会在组件被卸载之前被调用，你可以在这个函数中进行相关清理工作，比如删除定时器。

```js
componentWillUnmount() {
  // 清除timer
  clearInterval(this.timerID1);
  clearTimeout(this.timerID2);

  // 关闭socket
  this.myWebsocket.close();

  // 取消消息订阅...
}
```

### 错误捕获

React16 中新增了一个生命周期函数:

- componentDidCatch(error, info)

### React16 中的生命周期函数变化

React 16 之后有三个生命周期被废弃(但并未删除)

- componentWillMount
- componentWillReceiveProps
- componentWillUpdate

官方计划在 17 版本完全删除这三个函数，只保留 UNSAVE\_前缀的三个函数，目的是为了向下兼容，但是对于开发者而言应该尽量避免使用他们，而是使用新增的生命周期函数替代它们。

### 总结

挂载阶段:

- constructor: 构造函数，最先被执行,我们通常在构造函数里初始化 state 对象或者给自定义方法绑定 this
- getDerivedStateFromProps: `static getDerivedStateFromProps(nextProps, prevState)`,这是个静态方法,当我们接收到新的属性想去修改我们 state，可以使用 getDerivedStateFromProps
- render: render 函数是纯函数，只返回需要渲染的东西，不应该包含其它的业务逻辑,可以返回原生的 DOM、React 组件、Fragment、Portals、字符串和数字、Boolean 和 null 等内容
- componentDidMount: 组件装载之后调用，此时我们可以获取到 DOM 节点并操作，比如对 canvas，svg 的操作，服务器请求，订阅都可以写在这个里面，但是记得在 componentWillUnmount 中取消订阅

更新阶段:

- getDerivedStateFromProps: 此方法在更新个挂载阶段都可能会调用
  `shouldComponentUpdate: shouldComponentUpdate(nextProps, nextState)`,有两个参数 nextProps 和 nextState，表示新的属性和变化之后的 state，返回一个布尔值，true 表示会触发重新渲染，false 表示不会触发重新渲染，默认返回 true,我们通常利用此生命周期来优化 React 程序性能
- render: 更新阶段也会触发此生命周期
- getSnapshotBeforeUpdate: `getSnapshotBeforeUpdate(prevProps, prevState)`,这个方法在 render 之后，componentDidUpdate 之前调用，有两个参数 prevProps 和 prevState，表示之前的属性和之前的 state，这个函数有一个返回值，会作为第三个参数传给 componentDidUpdate，如果你不想要返回值，可以返回 null，此生命周期必须与 componentDidUpdate 搭配使用
- componentDidUpdate: `componentDidUpdate(prevProps, prevState, snapshot)`,该方法在 getSnapshotBeforeUpdate 方法之后被调用，有三个参数 prevProps，prevState，snapshot，表示之前的 props，之前的 state，和 snapshot。第三个参数是 getSnapshotBeforeUpdate 返回的,如果触发某些回调函数时需要用到 DOM 元素的状态，则将对比或计算的过程迁移至 getSnapshotBeforeUpdate，然后在 componentDidUpdate 中统一触发回调或更新状态。

卸载阶段:

- componentWillUnmount: 当我们的组件被卸载或者销毁了就会调用，我们可以在这个函数里去清除一些定时器，取消网络请求，清理无效的 DOM 元素等垃圾清理工作

参考：

- [React 的生命周期](https://www.yuque.com/ant-design/course/lifemethods) - 语雀
- [2019 年 17 道高频 React 面试题及详解](https://juejin.im/post/5d5f44dae51d4561df7805b4)

## React 是如何处理事件的

React 的事件是合成事件， 内部原理非常复杂，我这里只把关键性，可以用来解答这个问题的原理部分进行介绍即可。

jsx 实际上是 React.createElement(component, props, …children) 函数提供的语法糖，那么这段 jsx 代码：

```js
<button onClick={this.handleClick}>Click me</button>
```

会被转化为：

```js
React.createElement(
  "button",
  {
    onClick: this.handleClick
  },
  "Click me"
);
```

React 在组件加载(mount)和更新(update)时，将事件通过 addEventListener 统一注册到 document 上，然后会有一个事件池存储了所有的事件，当事件触发的时候，通过 dispatchEvent 进行事件分发。

所以你可以简单的理解为，最终 `this.handleClick` 会作为一个回调函数调用。

### 四种事件处理对比

对于事件处理的写法也有好几种，咱们来进行对比一下：

- 直接 bind this 型

就是像文章开始的那样，直接在事件那里 bind this

```js
class Foo extends React.Component {
  handleClick() {
    this.setState({ xxx: aaa });
  }

  render() {
    return <button onClick={this.handleClick.bind(this)}>Click me</button>;
  }
}
```

优点：写起来顺手，一口气就能把这个逻辑写完，不用移动光标到其他地方。

缺点：性能不太好，这种方式跟 react 内部帮你 bind 一样的，每次 render 都会进行 bind，而且如果有两个元素的事件处理函数式同一个，也还是要进行 bind，这样会多写点代码，而且进行两次 bind，性能不是太好。(其实这点性能往往不会是性能瓶颈的地方，如果你觉得顺手，这样写完全没问题)

- constuctor 手动 bind 型

```js
class Foo extends React.Component {
  constuctor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({ xxx: aaa });
  }

  render() {
    return <button onClick={this.handleClick}>Click me</button>;
  }
}
```

优点：相比于第一种性能更好，因为构造函数只执行一次，那么只会 bind 一次，而且如果有多个元素都需要调用这个函数，也不需要重复 bind，基本上解决了第一种的两个缺点。

缺点：没有明显缺点，硬要说的话就是太丑了，然后不顺手(我觉得丑，你觉得不丑就这么写就行了)。

- 箭头函数型

```js
class Foo extends React.Component {
  handleClick() {
    this.setState({ xxx: aaa });
  }

  render() {
    return <button onClick={e => this.handleClick(e)}>Click me</button>;
  }
}
```

优点：顺手，好看。

缺点：每次 render 都会重复创建函数，性能会差一点。

- public class fields 型

```js
class Foo extends React.Component {
  handleClick = () => {
    this.setState({ xxx: aaa });
  };

  render() {
    return <button onClick={this.handleClick}>Click me</button>;
  }
}
```

优点：好看，性能好。

缺点：没有明显缺点，如果硬要说可能就是要多装一个 babel 插件来支持这种语法。

原文：[新手学习 react 迷惑的点(二)](https://juejin.im/post/5d6f127bf265da03cf7aab6d)

## setState 是同步还是异步相关问题

- setState 是同步还是异步？

我的回答是执行过程代码同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形式了所谓的“异步”，所以表现出来有时是同步，有时是“异步”。

- 何时是同步，何时是异步呢？

只在合成事件和钩子函数中是“异步”的，在原生事件和 `setTimeout/setInterval`等原生 API 中都是同步的。简单的可以理解为被 React 控制的函数里面就会表现出“异步”，反之表现为同步。

- 那为什么会出现异步的情况呢？

为了做性能优化，将 state 的更新延缓到最后批量合并再去渲染对于应用的性能优化是有极大好处的，如果每次的状态改变都去重新渲染真实 dom，那么它将带来巨大的性能消耗。

- 那如何在表现出异步的函数里可以准确拿到更新后的 state 呢？

通过第二个参数 `setState(partialState, callback)` 中的 callback 拿到更新后的结果。

或者可以通过给 setState 传递函数来表现出同步的情况：

```js
this.setState(state => {
  return { val: newVal };
});
```

setState  的批量更新优化也是建立在“异步”（合成事件、钩子函数）之上的，在原生事件和 setTimeout 中不会批量更新，在“异步”中如果对同一个值进行多次 setState，setState 的批量更新策略会对其进行覆盖，取最后一次的执行，如果是同时 setState 多个不同的值，在更新时会对其进行合并批量更新。

- 那表现出异步的原理是怎么样的呢？

我这里还是用最简单的语言让你理解：在 React 的 setState 函数实现中，会根据 `isBatchingUpdates`(默认是 false) 变量判断是否直接更新 `this.state` 还是放到队列中稍后更新。然后有一个 `batchedUpdate` 函数，可以修改 `isBatchingUpdates` 为 true，当 React 调用事件处理函数之前，或者生命周期函数之前就会调用 `batchedUpdate` 函数，这样的话，setState 就不会同步更新 `this.state`，而是放到更新队列里面后续更新。

这样你就可以理解为什么原生事件和 `setTimeout/setinterval` 里面调用 `this.state` 会同步更新了吧，因为通过这些函数调用的 React 没办法去调用 `batchedUpdate` 函数将 `isBatchingUpdates` 设置为 true，那么这个时候 setState 的时候默认就是 false，那么就会同步更新。

原文：[新手学习 react 迷惑的点(二)](https://juejin.im/post/5d6f127bf265da03cf7aab6d)

## Virtual DOM

### Real DOM VS Virtual DOM

| Real DOM                        | Virtual DOM                    |
| ------------------------------- | ------------------------------ |
| 1. 更新缓慢。                   | 1. 更新更快。                  |
| 2. 可以直接更新 HTML。          | 2. 无法直接更新 HTML。         |
| 3. 如果元素更新，则创建新 DOM。 | 3. 如果元素更新，则更新 JSX 。 |
| 4. DOM 操作代价很高。           | 4. DOM 操作非常简单。          |
| 5. 消耗的内存较多。             | 5. 很少的内存消耗。            |

### Virtual DOM 的工作原理

Virtual DOM 是一个轻量级的 JavaScript 对象，它最初只是 real DOM 的副本。

它是一个节点树，它将元素、它们的属性和内容作为对象及其属性。

React 的渲染函数从 React 组件中创建一个节点树。然后它响应数据模型中的变化来更新该树，该变化是由用户或系统完成的各种动作引起的。

Virtual DOM 工作过程有三个简单的步骤:

1. 每当底层数据发生改变时，整个 UI 都将在 Virtual DOM 描述中重新渲染。
2. 然后计算之前 DOM 表示与新表示的之间的差异。
3. 完成计算后，将只用实际更改的内容更新 real DOM。

资料：[必须要会的 50 个 React 面试题](https://segmentfault.com/a/1190000018604138)

## React 与 Angular 有何不同

| 主题        | React                | Angular       |
| ----------- | -------------------- | ------------- |
| 1. 体系结构 | 只有 MVC 中的 View   | 完整的 MVC    |
| 2. 渲染     | 可以进行服务器端渲染 | 客户端渲染    |
| 3. DOM      | 使用 virtual DOM     | 使用 real DOM |
| 4. 数据绑定 | 单向数据绑定         | 双向数据绑定  |
| 5. 调试     | 编译时调试           | 运行时调试    |
| 6. 作者     | Facebook             | Google        |

## 高阶组件（HOC）

高阶组件是重用组件逻辑的高级方法，是一种源于 React 的组件模式。

HOC 是自定义组件，在它之内包含另一个组件。它们可以接受子组件提供的任何动态，但不会修改或复制其输入组件中的任何行为。你可以认为 HOC 是“纯（Pure）”组件。

HOC 可用于许多任务，例如：

- 代码重用，逻辑和引导抽象
- 渲染劫持
- 状态抽象和控制
- Props 控制

## 纯组件

纯（Pure） 组件是可以编写的最简单、最快的组件。

它们可以替换任何只有 render() 的组件。这些组件增强了代码的简单性和应用的性能。

## React 中 key 的重要性是什么

key 用于识别唯一的 Virtual DOM 元素及其驱动 UI 的相应数据。

它们通过回收 DOM 中当前所有的元素来帮助 React 优化渲染。

这些 key 必须是唯一的数字或字符串，React 只是重新排序元素而不是重新渲染它们。这可以提高应用程序的性能。

## React组件通信如何实现

React组件间通信方式:

- 父组件向子组件通讯: 父组件可以向子组件通过传 props 的方式，向子组件进行通讯

```js
class Son extends React.Component {
  render() {
    return <p>{this.props.text}</p>;
  }
}

class Father extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Son text="这是父组件传给子组件的内容"/>
      </div>
    );
  }
}
```

- 子组件向父组件通讯: props+回调的方式,父组件向子组件传递props进行通讯，此props为作用域为父组件自身的函数，子组件调用该函数，将子组件想要传递的信息，作为参数，传递到父组件的作用域中

```js
class Son extends React.Component {
  render() {
    return <p onClick={this.props.onClick}>{this.props.text}</p>;
  }
}

class Father extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fatherToSonText: "父组件传给子组件的内容",
      sonToFatherText: "子组件传给父组件的内容"
    };
  }
  handleClick(text) {
    alert(text);
  }
  render() {
    return (
      <Son
        text={this.state.fatherToSonText}
        onClick={e => this.handleClick(this.state.sonToFatherText, e)}
      />
    );
  }
}
```

- 兄弟组件通信: 找到这两个兄弟节点共同的父节点,结合上面两种方式由父节点转发信息进行通信

```js
class FirstSon extends React.Component {
  render() {
    return <h2 onClick={this.props.onClick}>戳我，我要让旁边那位变成红色</h2>;
  }
}

class SecondSon extends React.Component {
  render() {
    return <h2 style={{ color: this.props.color }}>我是你旁边那位</h2>;
  }
}

class Father extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "#666"
    };
  }
  handleClick() {
    this.setState({
      color: "red"
    });
  }
  render() {
    return (
      <div>
        <FirstSon onClick={() => this.handleClick()} />
        <SecondSon color={this.state.color} />
      </div>
    );
  }
}
```

- 跨层级通信: Context设计目的是为了共享那些对于一个组件树而言是“全局”的数据，例如当前认证的用户、主题或首选语言,对于跨越多层的全局数据通过Context通信再适合不过

```js
const MyContext = React.createContext(defaultValue);
```

- 发布订阅模式: 发布者发布事件，订阅者监听事件并做出反应,我们可以通过引入event模块进行通信

- 全局状态管理工具: 借助Redux或者Mobx等全局状态管理工具进行通信,这种工具会维护一个全局状态中心Store,并根据不同的事件产生新的状态

![Redux](https://user-gold-cdn.xitu.io/2019/8/23/16cbc24e6fd6847c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

原文：[2019 年 17 道高频 React 面试题及详解](https://juejin.im/post/5d5f44dae51d4561df7805b4)

## MVC 框架的主要问题是什么

- 对 DOM 操作的代价非常高
- 程序运行缓慢且效率低下
- 内存浪费严重
- 由于循环依赖性，组件模型需要围绕 models 和 views 进行创建

## 解释一下 Flux

Flux 将一个应用分成四个部分:

- View： 视图层
- Action（动作）：视图层发出的消息（比如 mouseClick）
- Dispatcher（派发器）：用来接收 Actions、执行回调函数
- Store（数据层）：用来存放应用的状态，一旦发生变动，就提醒 Views 要更新页面

![Flux](https://image-static.segmentfault.com/115/853/1158536343-5c935016e51c7_articlex)

Flux 是一种强制单向数据流的架构模式(MVC)。

它控制派生数据，并使用具有所有数据权限的中心 store 实现多个组件之间的通信。整个应用中的数据更新必须只能在此处进行。

Flux 为应用提供稳定性并减少运行时的错误。

- [Flux 架构入门教程](http://www.ruanyifeng.com/blog/2016/01/flux.html) - 阮一峰

## 什么是 Redux

Redux 是 JavaScript 状态容器，提供可预测化的状态管理。Redux 由以下组件组成：

- Action – 这是一个用来描述发生了什么事情的对象。
- Reducer – 这是一个确定状态将如何变化的地方。
- Store – 整个程序的状态/对象树保存在 Store 中。
- View – 只显示 Store 提供的数据。

![Redux 数据流动](https://image-static.segmentfault.com/966/439/96643934-5c935008d48ce_articlex)

Redux 遵循的三个原则：

**单一事实来源**：整个应用的状态存储在单个 store 中的对象/状态树里。单一状态树可以更容易地跟踪随时间的变化，并调试或检查应用程序。

**状态是只读的**：改变状态的唯一方法是去触发一个动作。动作是描述变化的普通 JS 对象。就像 state 是数据的最小表示一样，该操作是对数据更改的最小表示。

**使用纯函数进行更改**：为了指定状态树如何通过操作进行转换，你需要纯函数。纯函数是那些返回值仅取决于其参数值的函数。

Redux 与 Flux 有何不同?

| Flux                               | Redux                            |
| ---------------------------------- | -------------------------------- |
| 1. Store 包含状态和更改逻辑        | 1. Store 和更改逻辑是分开的      |
| 2. 有多个 Store                    | 2. 只有一个 Store                |
| 3. 所有 Store 都互不影响且是平级的 | 3. 带有分层 reducer 的单一 Store |
| 4. 有单一调度器                    | 4. 没有调度器的概念              |
| 5. React 组件订阅 store            | 5. 容器组件是有联系的            |
| 6. 状态是可变                      | 6. 状态是不可改变的              |

Redux 的优点如下：

- 结果的可预测性 - 由于总是存在一个真实来源，即 store ，因此不存在如何将当前状态与动作和应用的其他部分同步的问题。

- 可维护性 - 代码变得更容易维护，具有可预测的结果和严格的结构。

- 服务器端渲染 - 你只需将服务器上创建的 store 传到客户端即可。这对初始渲染非常有用，并且可以优化应用性能，从而提供更好的用户体验。

- 开发人员工具 - 从操作到状态更改，开发人员可以实时跟踪应用中发生的所有事情。

- 社区和生态系统 - Redux 背后有一个巨大的社区，这使得它更加迷人。一个由才华横溢的人组成的大型社区为库的改进做出了贡献，并开发了各种应用。

- 易于测试 - Redux 的代码主要是小巧、纯粹和独立的功能。这使代码可测试且独立。
  组织 - Redux 准确地说明了代码的组织方式，这使得代码在团队使用时更加一致和简单。

关于 Redux 的资料：

- [Redux 中文文档](https://www.redux.org.cn/)
- [Redux 入门教程（一）：基本用法](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html)
- [Redux 入门教程（二）：中间件与异步操作](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_two_async_operations.html)
- [Redux 入门教程（三）：React-Redux 的用法](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_three_react-redux.html)

## 学习资料

- [新手学习 react 迷惑的点(一)](https://juejin.im/post/5d6be5c95188255aee7aa4e0)
- [新手学习 react 迷惑的点(二)](https://juejin.im/post/5d6f127bf265da03cf7aab6d)
- [必须要会的 50 个 React 面试题](https://segmentfault.com/a/1190000018604138)
- [2019 年 17 道高频 React 面试题及详解](https://juejin.im/post/5d5f44dae51d4561df7805b4)
- [Redux 中文文档](https://www.redux.org.cn/)
- [Redux 入门教程（一）：基本用法](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html)
- [Redux 入门教程（二）：中间件与异步操作](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_two_async_operations.html)
- [Redux 入门教程（三）：React-Redux 的用法](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_three_react-redux.html)
