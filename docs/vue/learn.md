# Vue 理论知识点

## Vue 的单向数据流

所有的 prop 都使得其父子 prop 之间形成了一个**单向下行绑定**：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。

这样会防止从子组件意外改变父级组件的状态，从而导致你的应用的数据流向难以理解。

额外的，每次父级组件发生更新时，子组件中所有的 prop 都将会刷新为最新的值。这意味着你不应该在一个子组件内部改变 prop。如果你这样做了，Vue 会在浏览器的控制台中发出警告。

子组件想修改时，只能**通过 `$emit` 派发一个自定义事件**，父组件接收到后，由父组件修改。

有两种常见的试图改变一个 prop 的情形 :

prop 用来传递一个初始值；这个子组件接下来希望将其作为一个本地的 prop 数据来使用。 在这种情况下，最好定义一个本地的 data 属性并将这个 prop 用作其初始值：

```js
props: ['initialCounter'],
data: function () {
  return {
    counter: this.initialCounter
  }
}
```

prop 以一种原始的值传入且需要进行转换。 在这种情况下，最好使用这个 prop 的值来定义一个计算属性

```js
props: ['size'],
computed: {
  normalizedSize: function () {
    return this.size.trim().toLowerCase()
  }
}
```

## SPA 优缺点是什么

**SPA（ single-page application ）** 仅在 Web 页面初始化时加载相应的 HTML、JavaScript 和 CSS。

一旦页面加载完成，SPA 不会因为用户的操作而进行页面的重新加载或跳转；取而代之的是利用路由机制实现 HTML 内容的变换，UI 与用户的交互，避免页面的重新加载。

### 优点

- **用户体验好、快**，内容的改变不需要重新加载整个页面，避免了不必要的跳转和重复渲染；
- 基于上面一点，**SPA 相对对服务器压力小**；
- **前后端职责分离，架构清晰**，前端进行交互逻辑，后端负责数据处理；

### 缺点

- **初次加载耗时多**：为实现单页 Web 应用功能及显示效果，需要在加载页面的时候将 JavaScript、CSS 统一加载，部分页面按需加载；
- **前进后退路由管理**：由于单页应用在一个页面中显示所有的内容，所以不能使用浏览器的前进后退功能，所有的页面切换需要自己建立堆栈管理；
- **SEO 难度较大**：由于所有的内容都在一个页面中动态替换显示，所以在 SEO 上其有着天然的弱势。

## Class 与 Style 如何动态绑定

Class 可以通过对象语法和数组语法进行动态绑定：

```js
<div v-bind:class="{ active: isActive, 'text-danger': hasError }"></div>
<div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>

data: {
  isActive: true,
  hasError: false
}
```

Style 也可以通过对象语法和数组语法进行动态绑定：

```js
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
<div v-bind:style="[styleColor, styleSize]"></div>

data: {
  activeColor: 'red',
  fontSize: 30
  styleColor: {
    color: 'red'
  },
  styleSize:{
    fontSize:'23px'
  }
}
```

## Vue 生命周期

Vue 实例有一个完整的生命周期：

1. 开始创建
1. 初始化数据
1. 编译模版
1. 挂载 Dom -> 渲染
1. 更新 -> 渲染
1. 卸载

这一系列过程，我们称这是 Vue 的生命周期。

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

1. 父 beforeCreate
1. 父 created
1. 父 beforeMount
1. 子 beforeCreate
1. 子 created
1. 子 beforeMount
1. 子 mounted
1. 父 mounted

### 子组件更新过程

1. 父 beforeUpdate
1. 子 beforeUpdate
1. 子 updated
1. 父 updated

### 父组件更新过程

1. 父 beforeUpdate
1. 父 updated

### 销毁过程

1. 父 beforeDestroy
1. 子 beforeDestroy
1. 子 destroyed
1. 父 destroyed

## 在哪个生命周期内调用异步请求

可以在钩子函数 **created、beforeMount、mounted** 中进行调用，因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。

但推荐在 created 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求有以下优点：

- 能更快获取到服务端数据，减少页面  loading 时间；
- **ssr  不支持 beforeMount 、mounted 钩子函数**，所以放在 created 中有助于一致性；

## 在什么阶段才能访问操作 DOM

在**钩子函数 mounted** 被调用前，Vue 已经将编译好的模板挂载到页面上。

所以在 mounted 中可以访问操作 DOM。

## 父组件可以监听到子组件的生命周期吗

比如有父组件 Parent 和子组件 Child，如果父组件监听到子组件挂载 mounted 就做一些逻辑处理，可以通过以下写法实现：

```js
// Parent.vue
<Child @mounted="doSomething"/>

// Child.vue
mounted() {
  this.$emit("mounted");
}
```

以上需要手动通过 \$emit 触发父组件的事件，更简单的方式可以在父组件引用子组件时通过 @hook 来监听即可，如下所示：

```js
//  Parent.vue
<Child @hook:mounted="doSomething" ></Child>

doSomething() {
   console.log('父组件监听到 mounted 钩子函数 ...');
},

//  Child.vue
mounted(){
   console.log('子组件触发 mounted 钩子函数 ...');
},

// 以上输出顺序为：
// 子组件触发 mounted 钩子函数 ...
// 父组件监听到 mounted 钩子函数 ...
```

## Vue 组件间通信方式

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

学习资料：

- [Vue 的计算属性真的会缓存吗？（保姆级教学，原理深入揭秘）](https://juejin.im/post/5e8fd7a3f265da47c35d7d29)
- [手把手带你实现一个最精简的响应式系统来学习Vue的data、computed、watch源码](https://juejin.im/post/5db6433b51882564912fc30f)

## 双向数据绑定 v-model

v-model 本质上不过是语法糖，v-model 在内部为不同的输入元素使用不同的属性并抛出不同的事件：

- text 和 textarea 元素使用 value 属性和 input 事件；
- checkbox 和 radio 使用 checked 属性和 change 事件；
- select 字段将 value 作为 prop 并将 change 作为事件。

```html
<input v-model="message" />
<!-- 相当于 -->
<input :value="message" @input="message = $event.target.value" />
```

所以，自定义组件 v-model 默认会利用名为 value 的 prop 和名为 input 的事件：

```js
// 父组件
<ChildA v-model="message" />
// 或者
<ChildA :value="message" @input="handle" />

// 子组件
<input type="text" @input="handle" />
// ...
props: ['value'],
methods: {
  handle(e) {
    this.$emit('input', e.target.value)
  }
}
```

## 什么是 MVVM

**Model–View–ViewModel** （MVVM） 是一个软件架构设计模式，由微软 WPF 和 Silverlight 的架构师 Ken Cooper 和 Ted Peters 开发，是一种简化用户界面的事件驱动编程方式。由 John Gossman（同样也是 WPF 和 Silverlight 的架构师）于 2005 年在他的博客上发表。

MVVM 源自于经典的 Model–View–Controller（MVC）模式 ，MVVM 的出现促进了前端开发与后端业务逻辑的分离，极大地提高了前端开发效率。

MVVM 的核心是 ViewModel 层，它就像是一个中转站（value converter），负责转换 Model 中的数据对象来让数据变得更容易管理和使用，该层向上与视图层进行双向数据绑定，向下与 Model 层通过接口请求进行数据交互，起呈上启下作用。

### View 层

View 是视图层，也就是用户界面。前端主要由 HTML 和 CSS 来构建。如：

```html
<div id="app">
  <p>{{message}}</p>
  <button v-on:click="showMessage()">Click me</button>
</div>
```

### Model 层

Model 是指数据模型，泛指后端进行的各种业务逻辑处理和数据操控，对于前端来说就是后端提供的 api 接口。

### ViewModel 层

ViewModel 是由前端开发人员组织生成和维护的视图数据层。

在这一层，前端开发者对从后端获取的 Model 数据进行转换处理，做二次封装，以生成符合 View 层使用预期的视图数据模型。

需要注意的是 ViewModel 所封装出来的数据模型包括视图的**状态和行为**两部分，而 Model 层的数据模型是只包含状态的，比如页面的这一块展示什么，而页面加载进来时发生什么，点击这一块发生什么，这一块滚动时发生什么这些都属于视图行为（交互），视图状态和行为都封装在了 ViewModel 里。

这样的封装使得 ViewModel 可以完整地去描述 View 层。

```js
var app = new Vue({
  el: "#app",
  data: {
    // 用于描述视图状态
    message: "Hello Vue!"
  },
  methods: {
    // 用于描述视图行为
    showMessage() {
      let vm = this;
      alert(vm.message);
    }
  },
  created() {
    let vm = this;
    // Ajax 获取 Model 层的数据
    ajax({
      url: "/your/server/data/api",
      success(res) {
        vm.message = res;
      }
    });
  }
});
```

MVVM 框架实现了双向绑定，这样 ViewModel 的内容会实时展现在 View 层，前端开发者再也不必低效又麻烦地通过操纵 DOM 去更新视图，MVVM 框架已经把最脏最累的一块做好了，我们开发者只需要处理和维护 ViewModel，更新数据视图就会自动得到相应更新。

这样 View 层展现的不是 Model 层的数据，而是 ViewModel 的数据，由 ViewModel 负责与 Model 层交互，这就完全解耦了 View 层和 Model 层，这个解耦是至关重要的，它是前后端分离方案实施的重要一环。

## 如何实现 MVVM 数据双向绑定

MVVM 数据双向绑定主要是指：数据变化更新视图，视图变化更新数据。

通过实现以下 4 个步骤，来实现数据的双向绑定：

1. 实现一个**监听器** Observer，用来劫持并监听所有属性，如果属性发生变化，就通知订阅者；
1. 实现一个**订阅器** Dep，用来收集订阅者，对监听器 Observer 和 订阅者 Watcher 进行统一管理；
1. 实现一个**订阅者** Watcher，可以收到属性的变化通知并执行相应的方法，从而更新视图；
1. 实现一个**解析器** Compile，可以解析每个节点的相关指令，对模板数据和订阅器进行初始化。

资料：[0 到 1 掌握：Vue 核心之数据双向绑定](https://juejin.im/post/5d421bcf6fb9a06af23853f1)

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

## keep-alive 组件有什么作用

如果你需要在组件切换的时候，保存一些组件的状态防止多次渲染，就可以使用 keep-alive 组件包裹需要保存的组件。

对于 keep-alive 组件来说，它拥有两个独有的生命周期钩子函数，分别为 **activated** 和 **deactivated**。

用 keep-alive 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 deactivated 钩子函数，命中缓存渲染后会执行 actived 钩子函数。

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

## Vue 中的 key 有什么作用

key 是为 Vue 中 vnode 的唯一标记，通过这个 key，我们的 diff 操作可以更准确、更快速。

Vue 的 diff 过程可以概括为：oldCh 和 newCh 各有两个头尾的变量 oldStartIndex、oldEndIndex 和 newStartIndex、newEndIndex，它们会新节点和旧节点会进行两两对比。

即一共有 4 种比较方式：

- newStartIndex 和 oldStartIndex
- newEndIndex 和 oldEndIndex
- newStartIndex 和 oldEndIndex
- newEndIndex 和 oldStartIndex

如果以上 4 种比较都没匹配，如果设置了 key，就会用 key 再进行比较，在比较的过程中，遍历会往中间靠，一旦 StartIdx > EndIdx 表明 oldCh 和 newCh 至少有一个已经遍历完了，就会结束比较。

所以 Vue 中 key 的作用是：**key 是为 Vue 中 vnode 的唯一标记，通过这个 key，我们的 diff 操作可以更准确、更快速**。

- 更准确：因为带 key 就不是就地复用了，在 sameNode 函数  `a.key === b.key` 对比中可以避免就地复用的情况。所以会更加准确。
- 更快速：利用 key 的唯一性生成 map 对象来获取对应节点，比遍历方式更快。

源码如下：

```js
function createKeyToOldIdx(children, beginIdx, endIdx) {
  let i, key;
  const map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) map[key] = i;
  }
  return map;
}
```

## Vue 中的 key 为什么不能用 index

主要原因：

- 导致性能损耗
- 在删除子节点的场景下还会造成更严重的错误

用组件唯一的 id（一般由后端返回）作为它的 key，实在没有的情况下，可以在获取到列表的时候通过某种规则为它们创建一个 key，并保证这个 key 在组件整个生命周期中都保持稳定。

如果你的列表顺序会改变，别用 index 作为 key，和没写基本上没区别，因为不管你数组的顺序怎么颠倒，index 都是 0, 1, 2 这样排列，导致 Vue 会复用错误的旧子节点，做很多额外的工作。

千万别用随机数作为 key，不然旧节点会被全部删掉，新节点重新创建。

详细解读：[为什么 Vue 中不要用 index 作为 key？（diff 算法详解）](https://juejin.im/post/5e8694b75188257372503722)

## 虚拟 DOM 的优缺点

优点：

- **保证性能下限：** 框架的虚拟 DOM 需要适配任何上层 API 可能产生的操作，它的一些 DOM 操作的实现必须是普适的，所以它的性能并不是最优的；但是比起粗暴的 DOM 操作性能要好很多，因此框架的虚拟 DOM 至少可以保证在你不需要手动优化的情况下，依然可以提供还不错的性能，即保证性能的下限；
- **无需手动操作 DOM：** 我们不再需要手动去操作 DOM，只需要写好 View-Model 的代码逻辑，框架会根据虚拟 DOM 和 数据双向绑定，帮我们以可预期的方式更新视图，极大提高我们的开发效率；
- **跨平台：** 虚拟 DOM 本质上是 JavaScript 对象,而 DOM 与平台强相关，相比之下虚拟 DOM 可以进行更方便地跨平台操作，例如服务器渲染、weex 开发等等。

缺点:

- **无法进行极致优化**： 虽然虚拟 DOM + 合理的优化，足以应对绝大部分应用的性能需求，但在一些性能要求极高的应用中虚拟 DOM 无法进行针对性的极致优化。

## 虚拟 DOM 实现原理

虚拟 DOM 的实现原理主要包括以下 3 部分：

- 用 JavaScript 对象模拟真实 DOM 树，对真实 DOM 进行抽象；
- diff 算法 — 比较两棵虚拟 DOM 树的差异；
- pach 算法 — 将两个虚拟 DOM 对象的差异应用到真正的 DOM 树。

学习资料：[深入剖析：Vue核心之虚拟DOM](https://juejin.im/post/5d36cc575188257aea108a74)

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

vue-router 有 3 种路由模式：hash、history、abstract，对应的源码如下所示：

```js
switch (mode) {
  case "history":
    this.history = new HTML5History(this, options.base);
    break;
  case "hash":
    this.history = new HashHistory(this, options.base, this.fallback);
    break;
  case "abstract":
    this.history = new AbstractHistory(this, options.base);
    break;
  default:
    if (process.env.NODE_ENV !== "production") {
      assert(false, `invalid mode: ${mode}`);
    }
}
```

其中，3 种路由模式的说明如下：

- **hash**: 使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History Api 的浏览器；
- **history**: 依赖 HTML5 History API 和服务器配置。具体可以查看 HTML5 History 模式；
- **abstract**: 支持所有 JavaScript 运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式.

## vue-router 中常用路由模式实现原理

### hash 模式的实现原理

早期的前端路由的实现就是基于 location.hash 来实现的。

location.hash 的值就是 URL 中 # 后面的内容。比如下面这个网站，它的 location.hash 的值为 '#search'：

```url
https://www.word.com#search
```

hash 路由模式的实现主要是基于下面几个特性：

- URL 中 hash 值只是客户端的一种状态，也就是说当向服务器端发出请求时，hash 部分不会被发送；
- hash 值的改变，都会在浏览器的访问历史中增加一个记录。因此我们能通过浏览器的回退、前进按钮控制 hash 的切换；
- 可以通过  a  标签，并设置  href  属性，当用户点击这个标签后，URL  的 hash 值会发生改变；或者使用  JavaScript 来对  loaction.hash  进行赋值，改变 URL 的 hash 值；
- 我们可以使用 hashchange 事件来监听 hash 值的变化，从而对页面进行跳转（渲染）。

### history 模式的实现原理

HTML5 提供了 History API 来实现 URL 的变化。

其中做最主要的 API 有以下两个：`history.pushState()` 和 `history.repalceState()`。

这两个 API 可以在不进行刷新的情况下，操作浏览器的历史纪录。

唯一不同的是，前者是新增一个历史记录，后者是直接替换当前的历史记录，如下所示：

```js
window.history.pushState(null, null, path);
window.history.replaceState(null, null, path);
```

history 路由模式的实现主要基于存在下面几个特性：

- pushState 和 repalceState 两个 API 来操作实现 URL 的变化 ；
- 我们可以使用 popstate 事件来监听 url 的变化，从而对页面进行跳转（渲染）；
- `history.pushState()` 或 `history.replaceState()` 不会触发 popstate 事件，这时我们需要手动触发页面跳转（渲染）。

学习资料：[深度剖析：前端路由原理](https://juejin.im/post/5d469f1e5188254e1c49ae78)

## Proxy 与 Object.defineProperty 优劣对比

Proxy 的优势如下:

- Proxy 可以直接监听对象而非属性；
- Proxy 可以直接监听数组的变化；
- Proxy 有多达 13 种拦截方法,不限于 apply、ownKeys、deleteProperty、has 等等是 Object.defineProperty 不具备的；
- Proxy 返回的是一个新对象,我们可以只操作新的对象达到目的,而 Object.defineProperty 只能遍历对象属性直接修改；
- Proxy 作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的新标准的性能红利；

Object.defineProperty 的优势如下:

- 兼容性好，支持 IE9，而 Proxy 的存在浏览器兼容性问题，而且无法用 polyfill 磨平。

## Proxy & Reflect

学习资料：[深入实践 ES6 Proxy & Reflect](https://zhuanlan.zhihu.com/p/60126477)

## 服务端渲染 SSR 的优缺点

### 服务端渲染的优点

- 更好的 SEO

因为 SPA 页面的内容是通过 Ajax 获取，而搜索引擎爬取工具并不会等待 Ajax 异步完成后再抓取页面内容，所以在 SPA 中是抓取不到页面通过 Ajax 获取到的内容；而 SSR 是直接由服务端返回已经渲染好的页面（数据已经包含在页面中），所以搜索引擎爬取工具可以抓取渲染好的页面；

- 更快的内容到达时间（首屏加载更快）

SPA 会等待所有 Vue 编译后的 js 文件都下载完成后，才开始进行页面的渲染，文件下载等需要一定的时间等，所以首屏渲染需要一定的时间；SSR 直接由服务端渲染好页面直接返回显示，无需等待下载 js 文件及再去渲染等，所以 SSR 有更快的内容到达时间；

### 服务端渲染的缺点

- 更多的开发条件限制

例如服务端渲染**只支持 beforCreate 和 created** 两个钩子函数，这会导致一些外部扩展库需要特殊处理，才能在服务端渲染应用程序中运行；并且与可以部署在任何静态文件服务器上的完全静态单页面应用程序 SPA 不同，服务端渲染应用程序，需要处于 Node.js server 运行环境；

- 更多的服务器负载

在 Node.js 中渲染完整的应用程序，显然会比仅仅提供静态文件的 server 更加大量占用 CPU 资源 (CPU-intensive - CPU 密集)，因此如果你预料在高流量环境 ( high traffic ) 下使用，请准备相应的服务器负载，并明智地采用缓存策略。

## Vue 性能优化

学习资料：

- [为什么说 Vue 的响应式更新精确到组件级别？（原理深度解析）](https://juejin.im/post/5e854a32518825736c5b807f)
- [Vue 项目性能优化 — 实践指南（网上最全 / 详细）](https://juejin.im/post/5d548b83f265da03ab42471d)

## Vue 前端工程化开发技巧

- [吃透 Vue 项目开发实践｜16个方面深入前端工程化开发技巧《上》](https://juejin.im/post/5e0202fc6fb9a0165721e39a)

## Vue 源码解析

- [Vue源码解析](https://www.bilibili.com/video/BV1qJ411W7YR) - 小马哥_老师 视频
- [剖析 Vue.js 内部运行机制](https://juejin.im/book/5a36661851882538e2259c0f/section/5a37bbb35188257d167a4d64)
- [Vue.js 技术揭秘](https://ustbhuangyi.github.io/vue-analysis/)
- [Vue逐行级别的源码分析](https://github.com/HcySunYang/vue-design/tree/master) - HcySunYang大佬
- [Vuex 源码解析](https://github.com/answershuto/learnVue/blob/master/docs/Vuex%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90.MarkDown)

## Vue 学习资料

- [Vue 官方文档 API](https://cn.vuejs.org/v2/api/)
- [Vuex](https://vuex.vuejs.org/zh/)
- [「进击的前端工程师」从源码解读 Vue 生命周期，让面试官对你刮目相看](https://juejin.im/post/5d1b464a51882579d824af5b)
- [「面试题」20+Vue 面试题整理 🔥(持续更新)](https://juejin.im/post/5e649e3e5188252c06113021)
- [30 道 Vue 面试题，内含详细讲解（涵盖入门到精通，自测 Vue 掌握程度）](https://juejin.im/post/5d59f2a451882549be53b170)
- [Vue 组件间通信六种方式（完整版）](https://juejin.im/post/5cde0b43f265da03867e78d3)
- [Vue 开发必须知道的 36 个技巧【近 1W 字】](https://juejin.im/post/5d9d386fe51d45784d3f8637)
- [Vue.js 技术揭秘](https://ustbhuangyi.github.io/vue-analysis/)
- [深入实践 ES6 Proxy & Reflect](https://zhuanlan.zhihu.com/p/60126477)

## 掘金优质作者

- [晨曦时梦见兮](https://juejin.im/user/5b13f11d5188257da1245183/posts) - Vue、React、JavaScript、TypeScript
- [我是你的超级英雄](https://juejin.im/user/5bc7de8e5188255c6c626f96/posts) - 成为前端领域有影响力的人
