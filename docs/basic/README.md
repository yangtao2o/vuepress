# Html 基础理论

## HTML5 语义化

什么是语义化？就是用 **合理、正确的标签** 来展示内容，比如 h1~h6 定义标题。

好处

- 易于用户阅读，样式丢失的时候能让页面呈现清晰的结构。
- 有利于 SEO，搜索引擎根据标签来确定上下文和各个关键字的权重。
- 方便其他设备解析，如盲人阅读器根据语义渲染网页
- 有利于开发和维护，语义化更具可读性，代码更好维护，与 CSS3 关系更和谐。

## Doctype 有什么用

**Doctype** 是一种 **标准通用标记语言** 的文档类型声明，目的是告诉标准通用标记 **语言解析器** 要使用什么样的文档类型定义（DTD）来解析文档。

**声明** 是用来指示 web 浏览器关于页面使用哪个 HTML 版本进行编写的指令。 声明必须是 HTML 文档的第一行，位于 html 标签之前。

浏览器本身分为两种模式，一种是 **标准模式**，一种是 **怪异模式**，浏览器通过 Doctype 来区分这两种模式。

如果 html 中省略了 doctype，浏览器就会进入到 Quirks 模式的怪异状态，在这种模式下，有些样式会和标准模式存在差异，而 html 标准和 dom 标准值规定了标准模式下的行为，没有对怪异模式做出规定，因此不同浏览器的处理也是不同的，所以一定要在 html 开头使用 doctype。

## Viewport 属性值

- width 设置 layout viewport 的宽度，为一个正整数，或字符串"width-device"
- initial-scale 设置页面的初始缩放值，为一个数字，可以带小数
- minimum-scale 允许用户的最小缩放值，为一个数字，可以带小数
- maximum-scale 允许用户的最大缩放值，为一个数字，可以带小数
- height 设置 layout viewport 的高度，这个属性对我们并不重要，很少使用
- user-scalable 是否允许用户进行缩放，值为"no"或"yes", no 代表不允许，yes 代表允许这些属性可以同时使用，也可以单独使用或混合使用，多个属性同时使用时用逗号隔开就行了。

另，viewport 可分为可见视口和视窗视口，可见视口是实际的设备大小，视窗视口是网页的实际宽度。

## http-equive 属性的作用和参数

- expires，指定过期时间
- progma，设置no-cache可以禁止缓存
- refresh，定时刷新
- set-cookie，可以设置cookie
- X-UA-Compatible，使用浏览器版本
- apple-mobile-web-app-status-bar-style，针对WebApp全屏模式，隐藏状态栏/设置状态栏颜色

## 渲染引擎

渲染引擎的作用是根据资源文件的内容渲染出用户可见的界面。目前市面上主要的浏览器和它们所对应的渲染引擎有：

- IE，引擎为 Trident
- Firefox(Mozilla)，引擎为 Gecko
- Safari，引擎为 Webkit
- Chrome，引擎为 Blink
- Opera，引擎同样为 Blink

## 浏览器的渲染过程

1. 解析 HTML 生成 DOM 树。
2. 解析 CSS 生成 CSSOM 规则树。
3. 将 DOM 树与 CSSOM 规则树合并在一起生成渲染树。
4. 遍历渲染树开始布局，计算每个节点的位置大小信息。
5. 将渲染树每个节点绘制到屏幕。

## User-Agent 是什么

User-Agent 是一个特征字符串，用来标识发起请求的用户代理软件的应用类型、操作系统、软件开发商和版本号的信息。

Chrome 浏览器，输入`window.navigator.userAgent`：

```bash
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"
```

网景 (Netscape) 浏览器曾经是世界浏览器市场的霸主，网景浏览器把 User-Agent 中自己的标识名定位：Mozilla。

所以那时候的程序员就利用 `User-Agent` 来判断浏览器的特性，比如是否支持 frame，对于不符合要求的浏览器直接显示不兼容内容。就像现在程序员不喜欢IE一样。

所以后来微软推出 IE 浏览器的时候，为了能够兼容那些用来兼容 Netscape 的网页，就在自己的 `User-Agent` 中也加入了 Mozilla 用来伪装成 Netscape。后来渐渐地这种作法就成为事实标准了。

## Reflow 和 Repaint

### Reflow

当涉及到 DOM 节点的布局属性发生变化时，就会重新计算该属性，浏览器会重新描绘相应的元素，此过程叫 Reflow（回流或重排）。

### Repaint

当影响 DOM 元素可见性的属性发生变化 (如 color) 时, 浏览器会重新描绘相应的元素, 此过程称为 Repaint（重绘）。因此重排必然会引起重绘。

### 引起 Repaint 和 Reflow 的一些操作

- 调整窗口大小
- 字体大小
- 样式表变动
- 元素内容变化，尤其是输入控件
- CSS 伪类激活，在用户交互过程中发生
- DOM 操作，DOM 元素增删、修改
- width, clientWidth, scrollTop 等布局宽高的计算

Repaint 和 Reflow 是不可避免的，只能说对性能的影响减到最小，给出下面几条建议：

- 避免逐条更改样式。建议集中修改样式，例如操作 className。
- 避免频繁操作 DOM。创建一个 documentFragment 或 div，在它上面应用所有 DOM 操作，最后添加到文档里。设置 display:none 的元素上操作，最后显示出来。
- 避免频繁读取元素几何属性（例如 scrollTop）。绝对定位具有复杂动画的元素。
- 绝对定位使它脱离文档流，避免引起父元素及后续元素大量的回流

[减少页面重排与重绘（Reflow & Repaint）](https://harttle.land/2015/08/11/reflow-repaint.html)

## NodeList 和 HTMLCollection

主要区别是，NodeList 可以包含各种类型的节点，HTMLCollection 只能包含 HTML 元素节点。

### NodeList 接口

NodeList 实例是一个类似数组的对象，它的成员是节点对象。通过以下方法可以得到 NodeList 实例。

- `Node.childNodes`
- `document.querySelectorAll()` 等节点搜索方法

NodeList 实例很像数组，可以使用 length 属性和 forEach 方法。但是，它不是数组，不能使用 pop 或 push 之类数组特有的方法。

如果 NodeList 实例要使用数组方法，可以将其转为真正的数组。

除了使用 forEach 方法遍历 NodeList 实例，还可以使用 for 循环。

- `NodeList.prototype.length`，length 属性返回 NodeList 实例包含的节点数量
- `NodeList.prototype.forEach()`，遍历 NodeList 的所有成员
- `NodeList.prototype.item()`，item 方法接受一个整数值作为参数，表示成员的位置，返回该位置上的成员。

下面三个方法，都返回一个 ES6 的遍历器对象，`for...of` 可获取每一个成员信息：

- `NodeList.prototype.keys()`，返回键名的遍历器
- `NodeList.prototype.values()`，返回键值的遍历器
- `NodeList.prototype.entries()`，返回的遍历器

### HTMLCollection 接口

HTMLCollection 是一个节点对象的集合，只能包含元素节点（element），不能包含其他类型的节点。

它的返回值是一个类似数组的对象，但是与 NodeList 接口不同，HTMLCollection 没有 forEach 方法，只能使用 for 循环遍历。

返回 HTMLCollection 实例的，主要是一些 Document 对象的集合属性，比如 `document.links`、`document.forms`、`document.images` 等。

- `HTMLCollection.prototype.length`
- `HTMLCollection.prototype.item()`
- `HTMLCollection.prototype.namedItem()`，参数是一个字符串，表示 id 属性或 name 属性的值，返回对应的元素节点。如果没有对应的节点，则返回 null。

### 对比

共同点：

- 类数组对象，有 length 属性
- 共同的方法：item，可以通过 item(index) 或者 item(id) 来访问返回结果中的元素
- 实时变动的（live），document 上的更改会反映到相关对象上（例外：`document.querySelectorAll` 返回的 NodeList 不是实时的）

区别：

- NodeList 可以包含任何节点类型，HTMLCollection 只包含元素节点（elementNode），elementNode 就是 HTML 中的标签
- HTMLCollection 比 NodeList 多一项方法：namedItem，可以通过传递 id 或 name 属性来获取节点信息

参考资料：

- [NodeList 接口，HTMLCollection 接口](http://wangdoc.com/javascript/dom/nodelist.html)
- [HTMLCollection vs. NodeList](https://www.jianshu.com/p/f6ff5ebe45fd)

## 什么是渐进式渲染（progressive rendering）

渐进式渲染是用于提高网页性能（尤其是提高用户感知的加载速度），以尽快呈现页面的技术。

在以前互联网带宽较小的时期，这种技术更为普遍。如今，移动终端的盛行，而移动网络往往不稳定，渐进式渲染在现代前端开发中仍然有用武之地。

举例：

- 图片懒加载——页面上的图片不会一次性全部加载。当用户滚动页面到图片部分时，JavaScript 将加载并显示图像。
- 确定显示内容的优先级（分层次渲染）——为了尽快将页面呈现给用户，页面只包含基本的最少量的 CSS、脚本和内容，然后可以使用延迟加载脚本或监听 DOMContentLoaded/load 事件加载其他资源和内容。
- 异步加载 HTML 片段——当页面通过后台渲染时，把 HTML 拆分，通过异步请求，分块发送给浏览器。

[Async Fragments: Rediscovering Progressive HTML Rendering with Marko](https://tech.ebayinc.com/engineering/async-fragments-rediscovering-progressive-html-rendering-with-marko/)

## img 中的 alt 和元素的 title 属性作用

- img 的 alt 属性
  如果无法显示图像，浏览器将显示 alt 指定的内容

- 元素 title 属性
  在鼠标移到元素上时显示 title 的内容

## href 和 src 区别

### href

href 标识超文本引用，用在 link 和 a 等元素上，href 是引用和页面关联，是在当前元素和引用资源之间建立联系。

若在文档中添加 href ，浏览器会识别该文档为 CSS 文件，就会并行下载资源并且不会停止对当前文档的处理。这也是为什么建议使用 link 方式加载 CSS，而不是使用 @import 方式。

### src

src 表示引用资源，替换当前元素，用在 img，script，iframe 上，src 是页面内容不可缺少的一部分。

当浏览器解析到 src ，会暂停其他资源的下载和处理（图片不会暂停其他资源下载），直到将该资源加载、编译、执行完毕，类似于将所指向资源应用到当前内容。这也是为什么建议把 js 脚本放在底部而不是头部的原因。

## 为何会出现浏览器兼容问题

- 同一产品，版本越老 bug 越多
- 同一产品，版本越新，功能越多
- 不同产品，不同标准，不同实现方式

## 处理兼容问题的思路

1. 要不要做？

- 产品的角度（产品的受众、受众的浏览器比例、效果优先还是基本功能优先）
- 成本的角度 (有无必要做某件事)

1. 做到什么程度？让哪些浏览器支持哪些效果？

1. 如何做

- 根据兼容需求选择技术框架/库(jquery) 根据兼容需求选择兼容工具(`html5shiv.js、respond.js、css reset、normalize.css、Modernizr`)
- postCSS
- 条件注释、CSS Hack、js 能力检测做一些修补
  - 渐进增强(progressive enhancement): 针对低版本浏览器进行构建页面，保证最基本的功能，然后再针对高级浏览器进行效果、交互等改进和追加功能达到更好的用户体验
  - 优雅降级 (graceful degradation): 一开始就构建完整的功能，然后再针对低版本浏览器进行兼容。

[为何会出现浏览器兼容问题](https://github.com/jirengu/frontend-interview/issues/35)

## DOM 和 BOM 有什么区别

### DOM

Document Object Model，文档对象模型

DOM 是为了操作文档出现的 API，document 是其的一个对象

DOM 和文档有关，这里的文档指的是网页，也就是 html 文档。DOM 和浏览器无关，他关注的是网页本身的内容。

### BOM

Browser Object Model，浏览器对象模型

BOM 是为了操作浏览器出现的 API，window 是其的一个对象

window 对象既为 javascript 访问浏览器提供 API，同时在 ECMAScript 中充当 Global 对象

## 行内元素和块级元素有哪些

### 行内元素

- 一个行内元素只占据它对应标签的边框所包含的空间
- 一般情况下，行内元素只能包含数据和其他行内元素

```text
b, big, i, small, tt

abbr, acronym, cite, code, dfn, em, kbd, strong, samp, var

a, bdo, br, img, map, object, q, script, span, sub, sup

button, input, label, select, textarea
```

### 块级元素

- 占据一整行
- 高度、行高、内边距和外边距都可以改变，可以容纳块级标签和其他行内标签

```text
header,form,ul,ol,table,article,div

hr,aside,figure,canvas,video,audio,footer
```

## label 标签有什么作用

label 标签通常是写在表单内，它关联一个控件，使用 label 可以实现点击文字选取对应的控件。

```html
<input type="checkbox" id="test" /> <label for="test">test</label>
```

## HTML5 的 form 如何关闭自动完成功能

将不想要自动完成的 form 或 input 设置为 `autocomplete=off`

```html
<form method="post" action="/form" autocomplete="off">
  […]
</form>

<label for="cc">信用卡：</label>
<input type="text" id="cc" name="cc" autocomplete="off" />
```

在这里设置 `autocomplete="off"` 会有两种效果：

- 它会阻止浏览器为了以后自动完成类似的表单来自动保存表单数据，但是浏览器是不一样的。
- 它会阻止浏览器历史记录缓存中的表单数据。当表单数据来自缓存的时候，当用户点击返回按钮来返回的时候，用户填写的信息是可见的。

[如何关闭表单自动填充](https://developer.mozilla.org/zh-CN/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion)

## iframe 框架有那些优缺点

优点：

- iframe 能够原封不动的把嵌入的网页展现出来。
- 如果有多个网页引用 iframe，那么你只需要修改 iframe 的内容，就可以实现调用的每一个页面内容的更改，方便快捷。
- 网页如果为了统一风格，头部和版本都是一样的，就可以写成一个页面，用 iframe 来嵌套，可以增加代码的可重用。
- 如果遇到加载缓慢的第三方内容如图标和广告，这些问题可以由 iframe 来解决。

缺点：

- 搜索引擎的爬虫程序无法解读这种页面
- 框架结构中出现各种滚动条
- 使用框架结构时，保证设置正确的导航链接。
- iframe 页面会增加服务器的 http 请求

## 学习资料

- [2019 前端最全面试题-HTML](https://github.com/woai3c/Front-end-basic-knowledge/blob/master/HTML.md)
