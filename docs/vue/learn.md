# Vue 理论知识点

## Vue 生命周期

![Vue Lifecycle](https://cn.vuejs.org/images/lifecycle.png)

### beforeCreate

new Vue()之后触发的第一个钩子，在当前阶段 data、methods、computed 以及 watch 上的数据和方法都不能被访问。

### created

在实例创建完成后发生，当前阶段已经完成了数据观测，也就是可以使用数据，更改数据，在这里更改数据不会触发 updated 函数。可以做一些初始数据的获取，在当前阶段无法与 Dom 进行交互，如果非要想，可以通过 `vm.$nextTick` 来访问 Dom。

### beforeMounted

发生在挂载之前，在这之前 template 模板已导入渲染函数编译。而当前阶段虚拟 Dom 已经创建完成，即将开始渲染。在此时也可以对数据进行更改，不会触发 updated。

### mounted

在挂载完成后发生，在当前阶段，真实的 Dom 挂载完毕，数据完成双向绑定，可以访问到 Dom 节点，使用 `$ref` 属性对 Dom 进行操作。

### beforeUpdate

发生在更新之前，也就是响应式数据发生更新，虚拟 dom 重新渲染之前被触发，你可以在当前阶段进行更改数据，不会造成重渲染。

### updated

发生在更新完成之后，当前阶段组件 Dom 已完成更新。要注意的是避免在此期间更改数据，因为这可能会导致无限循环的更新。

### beforeDestroy

发生在实例销毁之前，在当前阶段实例完全可以被使用，我们可以在这时进行善后收尾工作，比如清除计时器。

### destroyed

发生在实例销毁之后，这个时候只剩下了 dom 空壳。组件已被拆解，数据绑定被卸除，监听被移出，子实例也统统被销毁。

### activated

keep-alive 组件激活时调用，该钩子在服务器端渲染期间不被调用。

### deactivated

keep-alive 组件停用时调用，该钩子在服务器端渲染期间不被调用。

### errorCaptured

当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 false 以阻止该错误继续向上传播。

你可以在此钩子中修改组件的状态。因此在模板或渲染函数中设置其它内容的短路条件非常重要，它可以防止当一个错误被捕获时该组件进入一个无限的渲染循环。

### 注意点

在使用生命周期时有几点注意事项需要我们牢记。

1. 除了 beforeCreate 和 created 钩子之外，其他钩子均在服务器端渲染期间不被调用，所以接口请求一般放在 mounted 中，但是服务端渲染需要放到 created 中。
2. 上文曾提到过，在 updated 的时候千万不要去修改 data 里面赋值的数据，否则会导致死循环。
3. Vue 的所有生命周期函数都是自动绑定到 this 的上下文上。所以，你这里使用箭头函数的话，就会出现 this 指向的父级作用域，就会报错。

### 学习资料

- [从源码解读 Vue 生命周期，让面试官对你刮目相看](https://juejin.im/post/5d1b464a51882579d824af5b)
- [「面试题」20+Vue 面试题整理 🔥(持续更新)](https://juejin.im/post/5e649e3e5188252c06113021)

## Vue 组件生命周期调用顺序

- 组件的调用顺序都是 **先父后子**，渲染完成的顺序是 **先子后父**。
- 组件的销毁操作是 **先父后子**，销毁完成的顺序是 **先子后父**。

### 加载渲染过程

父 beforeCreate->父 created->父 beforeMount->子 beforeCreate->子 created->子 beforeMount- >子 mounted->父 mounted

### 子组件更新过程

父 beforeUpdate->子 beforeUpdate->子 updated->父 updated

### 父组件更新过程

父 beforeUpdate -> 父 updated

### 销毁过程

父 beforeDestroy->子 beforeDestroy->子 destroyed->父 destroyed

## Vue 组件间通信六种方式

### 父子通信 `props/$emit`

- 父向子传递数据是通过 `props`，子向父是通过 `events（$emit）`
- 通过`$parent/$children`也可以通信；`ref` 也可以访问组件实例
- `$attrs/$listeners`（信息转发）
- `provide/inject`（祖先组件传递信息给后代组件）

### 兄弟通信 `Bus`

- `vuex`
- `Bus`，通过一个空的 Vue 实例作为中央事件总线（事件中心），用它来触发事件和监听事件,巧妙而轻量地实现了任何组件间的通信，包括父子、兄弟、跨级

**注意**：记得销毁自定义事件，否则容易造成内存泄露

### 跨级通信 `vuex`

- `vuex`（信息处理）
- `$attrs/$listeners`（信息转发）
- `provide/inject`（祖先组件传递信息给后代组件）

学习资料：[Vue 组件间通信六种方式（完整版）](https://juejin.im/post/5cde0b43f265da03867e78d3#heading-17)

## Computed 和 Watch

`Computed` 本质是一个具备缓存的 watcher，依赖的属性发生变化就会更新视图。
适用于计算比较消耗性能的计算场景。当表达式过于复杂时，在模板中放入过多逻辑会让模板难以维护，可以将复杂的逻辑放入计算属性中处理。

`Watch` 没有缓存性，更多的是观察的作用，可以监听某些数据执行回调。当我们需要深度监听对象中的属性时，可以打开 deep：true 选项，这样便会对对象中的每一项进行监听。这样会带来性能问题，优化的话可以使用字符串形式监听，如果没有写到组件中，不要忘记使用 unWatch 手动注销哦。

## 双向数据绑定 v-model

## nextTick

Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部对异步队列尝试使用原生的 `Promise.then、MutationObserver 和 setImmediate`，如果执行环境不支持，则会采用 `setTimeout(fn, 0)` 代替。

但是如果你想基于更新后的 DOM 状态来做点什么，nextTick 就会有用武之地了。

`vm.$nextTick( [callback] )`将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。它跟全局方法 Vue.nextTick 一样，不同的是回调的 this 自动绑定到调用它的实例上。

- 异步渲染，待 DOM 渲染完成后再回调
- 页面渲染会将 data 进行整合，多次渲染只会发生一次

```js
// 修改数据
vm.msg = "Hello";
// DOM 还没有更新
Vue.nextTick(function() {
  // DOM 更新了
});

// 作为一个 Promise 使用
Vue.nextTick().then(function() {
  // DOM 更新了
});

// 实例
new Vue({
  // ...
  methods: {
    // ...
    example: function() {
      // 修改数据
      this.message = "changed";
      // DOM 还没有更新
      this.$nextTick(function() {
        // DOM 现在更新了
        // `this` 绑定到当前实例
        this.doSomethingElse();
      });
    }
  }
});
```

## slot 是什么

Vue 实现了一套内容分发的 API，将 `<slot>` 元素作为承载分发内容的出口。

- 具名插槽：`<slot>` 元素有一个特殊的 `attribute：name`，可以用来定义额外的插槽
- 作用域插槽：插槽内容能够访问子组件中的数据

`v-slot:header`也可以缩写：`#header`，而且`v-slot`指令只能与`template`绑定，一个不带 name 的 `<slot>` 出口会带有隐含的名字`“default”`。

```js
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

## Vue 如何缓存组件

`<keep-alive>` 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。和 `<transition>` 相似，`<keep-alive>` 是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在组件的父组件链中。

当组件在 `<keep-alive>` 内被切换，它的 activated 和 deactivated 这两个生命周期钩子函数将会被对应执行。

```html
<!-- 失活的组件将会被缓存！-->
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>

<!-- 多个条件判断的子组件 -->
<keep-alive>
  <comp-a v-if="a > 1"></comp-a>
  <comp-b v-else></comp-b>
</keep-alive>

<!-- 和 `<transition>` 一起使用 -->
<transition>
  <keep-alive>
    <component :is="view"></component>
  </keep-alive>
</transition>
```

## Vue 如何异步加载组件

- 加载大组件
- 异步路由

在大型应用中，我们可能需要将应用分割成小一些的代码块，并且只在需要的时候才从服务器加载一个模块。

Vue 允许你以一个工厂函数的方式定义你的组件，这个工厂函数会异步解析你的组件定义。Vue 只有在这个组件需要被渲染的时候才会触发该工厂函数，且会把结果缓存起来供未来重渲染。

当使用局部注册的时候，你也可以直接提供一个返回 Promise 的函数：

```js
new Vue({
  // ...
  components: {
    "my-component": () => import("./my-async-component")
  }
});
```

## 混入 mixin

混入 (mixin) 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。

```js
// 定义一个混入对象
var myMixin = {
  created: function() {
    this.hello();
  },
  methods: {
    hello: function() {
      console.log("hello from mixin!");
    }
  }
};

// 定义一个使用混入对象的组件
var Component = Vue.extend({
  mixins: [myMixin]
});

var component = new Component(); // => "hello from mixin!"
```

选项合并：

- 数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先
- 同名钩子函数将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子之前调用
- 值为对象的选项，例如 methods、components 和 directives，将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对

注意：`Vue.extend()` 也使用同样的策略进行合并。

## Vuex

### 什么是“状态管理模式”

这个状态自管理应用包含以下几个部分：

- state，驱动应用的数据源；
- view，以声明方式将 state 映射到视图；
- actions，响应在 view 上的用户输入导致的状态变化。

### Vuex 核心思想

Vuex 应用的核心就是 store（仓库）。“store”基本上就是一个容器，它包含着你的应用中大部分的状态 (state)。有些同学可能会问，那我定义一个全局对象，再去上层封装了一些数据存取的接口不也可以么？

Vuex 和单纯的全局对象有以下两点不同：

Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。

你不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。

另外，通过定义和隔离状态管理中的各种概念并强制遵守一定的规则，我们的代码将会变得更结构化且易维护。

![Vuex](https://vuex.vuejs.org/vuex.png)

### State

Vuex 使用单一状态树，用一个对象就包含了全部的应用层级状态。至此它便作为一个“唯一数据源”而存在。这也意味着，每个应用将仅仅包含一个 store 实例。

在 Vue 组件中通过计算属性（computed）获得 Vuex 状态，Vuex 通过 store 选项，提供了一种机制将状态从根组件“注入”到每一个子组件中（需调用 `Vue.use(Vuex)`），子组件能通过 `this.$store` 访问到。

可以使用 `mapState` 辅助函数，帮助我们生成计算属性。

### Getter

Vuex 允许我们在 store 中定义“getter”（可以认为是 store 的计算属性）。就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。

- 属性访问：`store.getters.doneTodos`
- 对象访问：通过让 getter 返回一个函数，来实现给 getter 传参，`store.getters.getTodoById(2)`

注意，getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果。

`mapGetters` 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性

### Mutation

### Action

### Module

学习资料：

- [Vuex](https://vuex.vuejs.org/zh/)
- [Vue.js 技术揭秘之 Vuex](https://ustbhuangyi.github.io/vue-analysis/v2/vuex/#vuex)

## Vue Router

## Proxy & Reflect

学习资料：[深入实践 ES6 Proxy & Reflect](https://zhuanlan.zhihu.com/p/60126477)

## 学习资料

- [Vue 官方文档 API](https://cn.vuejs.org/v2/api/)
- [Vuex](https://vuex.vuejs.org/zh/)
- [「进击的前端工程师」从源码解读 Vue 生命周期，让面试官对你刮目相看](https://juejin.im/post/5d1b464a51882579d824af5b)
- [「面试题」20+Vue 面试题整理 🔥(持续更新)](https://juejin.im/post/5e649e3e5188252c06113021)
- [Vue 组件间通信六种方式（完整版）](https://juejin.im/post/5cde0b43f265da03867e78d3)
- [Vue 开发必须知道的 36 个技巧【近 1W 字】](https://juejin.im/post/5d9d386fe51d45784d3f8637)
- [Vue.js 技术揭秘](https://ustbhuangyi.github.io/vue-analysis/)
- [深入实践 ES6 Proxy & Reflect](https://zhuanlan.zhihu.com/p/60126477)