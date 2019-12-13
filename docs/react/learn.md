# React 理论知识点

## JSX 语法

JSX 是一个 JavaScript 的语法扩展。

JSX 可以被 Babel 转码器转为正常的 JavaScript 语法。Babel 会把 JSX 转译成一个名为 `React.createElement()` 函数调用。

React 认为渲染逻辑本质上与其他 UI 逻辑内在耦合，比如，在 UI 中需要绑定处理事件、在某些时刻状态发生变化时需要通知到 UI，以及需要在 UI 中展示准备好的数据。

React 并没有采用将标记与逻辑进行分离到不同文件这种人为地分离方式，而是通过将二者共同存放在称之为“组件”的松散耦合单元之中，来实现关注点分离。

```js
export default () => {
  return <div className="greeting">hello world</div>;
}
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
  type: 'div',
  props: {
    className: 'greeting',
    children: 'hello world'
  }
};
```

参考：[JSX简介](https://zh-hans.reactjs.org/docs/introducing-jsx.html)

## 受控组件与非受控组件

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

`componentWillMount，componentWillUpdate, componentWillReceiveProps` 等生命周期方法在 React16 中被重命名为 `UNSAFE_componentWillMount，UNSAFE_componentWillUpdate，UNSAFE_componentWillReceiveProps`，而在更下个大版本中他们会被废弃。

参考：[React 的生命周期](https://www.yuque.com/ant-design/course/lifemethods) - 语雀
