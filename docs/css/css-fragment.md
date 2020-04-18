# CSS 理论碎片

## BFC(块格式化上下文)

**格式化上下文**, 它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互渲染作用。

BFC 即 Block Formatting Contexts (块级格式化上下文)，它属于上述定位方案的普通流。

### 触发 BFC

只要元素满足下面任一条件即可触发：

- 根元素(`<html>`)
- 浮动元素（元素的 float 不是 none）
- 绝对定位元素（元素的 position 为 absolute 或 fixed）
- 行内块元素（元素的 display 为 inline-block）
- overflow 值不为 visible 的块元素
- 弹性元素（display 为 flex 或 inline-flex 元素的直接子元素）
- 网格元素（display 为 grid 或 inline-grid 元素的直接子元素）

### BFC 特性及应用

1. 属于同一个 BFC 下两个相邻 Box 的 margin 会发生重叠，如果想要避免外边距的重叠，可以将其放在不同的 BFC 容器中
2. BFC 可以包含浮动的元素（清除浮动）
3. BFC 可以阻止元素被浮动元素覆盖（文字环绕浮动图片）

学习资料：[10 分钟理解 BFC 原理](https://zhuanlan.zhihu.com/p/25321647)

## CSS 的优先级规则

优先级由高到低：

- `!important`
- 匹配优先级计算 如果存在内联样式，那么 A = 1, 否则 A = 0;
- B 的值等于 ID 选择器 出现的次数;
- C 的值等于 类选择器 和 属性选择器 和 伪类 出现的总次数;
- D 的值等于 标签选择器 和 伪元素 出现的总次数 。
  若以上规则都无法解决，后来者优先级高
  user agent stylesheet

## 行内元素的`margin`起作用吗

- 对于 **行内替换元素** 来说，4 个方向的`margin`都是起作用的；
- 对于 **行内非替换元素** 来说，只有`margin-left`和`margin-right`起作用，`margin-top`和`margin-bottom`是不起作用的。

## `vertical-align`

`vertical-align`只有在 display 属性为 `inline` 和 `table-cell` 时起作用，最常使用的应用场景是对齐图片和文字。

需要注意它的生效条件：

- 内联元素`span、strong、em、img、button、input`等
- display 值为`inline、inline-block、inline-table或table-cell`的元素
- 需要注意浮动和绝对定位会让元素块状化，因此此元素绝对不会生效

## 元素垂直居中的方法

1. 当不需要指定元素的高度时，可以直接给一个相同的 padding-top 和 padding-bottom，让元素和 padding 一起撑起来容器；
1. 需要指定容器高度，或者不能使用 padding 的时候，设置元素 display: table-cell 和 vertical-align: middle；
1. 不需要严格的兼容，可以用 flexbox 的话，就使用 flexbox；
1. 内容只有一行文本时，把容器的 line-height 属性设置为和容器的高度一样；
1. 上面的方法都不能用时，如果知道容器和元素的高度，用绝对定位；
1. 如果不知道元素的高度时，结合定位和 transform 一起用。

## 伪类和伪元素

**伪类** 用于当元素处于某个状态时，为其添加对应的样式，这个状态是根据用户行为而动态变化的。比如说，用户悬停在指定的元素时，我们可以通`:hover`来描述这个元素的状态。 虽然它和普通的 css 类类似，可以为已有的元素添加样式，但是它只有处于 dom 树无法描述的状态下才能为元素添加样式，所以将其称为伪类。

**伪元素** 用于创建不在文档树中的元素，并为其添加样式，比如说，我们可以通过：before 来在一个元素前添加一些文本，并为这些文本添加样式。虽然用户可以看到这些文本，但是这些文本实际上不在文档树中。

CSS3 规范中的要求使用双冒号 `(::)` 表示伪元素，以此来区分伪元素和伪类，比如`::before` 和`::after` 等伪元素使用双冒号 `(::)`，`:hover` 和`:active` 等伪类使用单冒号 `(:)`。虽然 CSS3 标准要求伪元素使用双冒号的写法，但也依然支持单冒号的写法。

## 层叠上下文

层叠上下文是用来描述页面中元素在垂直于屏幕方向排列规则而创建出的模型。

层叠上下文中重叠的元素按照一定的规则在垂直方向排列。层叠上下文是 HTML 元素层级的一个子层级，因为只有一部分元素可以生成自己的层叠上下文。

### 定位元素|未定位元素

从是否定位的角度可以把页面中的元素分为两类：

- 定位元素，position 的值为 relative,absolute,fixed 或 sticky 的元素；
- 未定位元素，不是定位元素的都是未定位元素。

### `z-index`

我们知道定位元素覆盖在未定位元素上面，那么已定位元素之间如何覆盖呢？`z-index` 就是一个可以让我们精确地控制已定位元素之间的渲染顺序的工具：`z-index`的值可以是任意整数 (正数、负数或 0)，值越大，越覆盖在上面。

当一个元素被显示设置`z-index`值，不管是正数、负数还是 0，所有这个元素和它的所有后代元素形成一个层叠上下文。层叠上下文的后代元素只参与和根元素的对比，不参与和根元素以外的元素对比。

### 在一个独立的层叠上下文中，元素如何排列

- 层叠上下文的根元素
- z-index 为负值的已定位元素（包括它们的子元素）
- 未定位元素
- z-index 为 auto 的已定位元素（包括它们的子元素）
- z-index 为正值的已定位元素（包括它们的子元素）

注意 z-index 值为负时，要排在未定位元素下面。这个顺序是一定要记住的，就像 Event Loop，几乎所有层叠上下文的问题，都可以适用于这个顺序列表。

## flex: 1 完整写法

一些简写：

- flex: 1 = flex: 1 1 0%
- flex: 2 = flex: 2 1 0%
- flex: auto = flex: 1 1 auto;
- flex: none = flex: 0 0 auto; // 常用于固定尺寸 不伸缩

flex:1 和 flex:auto 的区别，其实可以归结于 `flex-basis:0` 和 `flex-basis:auto` 的区别。

flex-basis 是指定初始尺寸，当设置为 0 时（绝对弹性元素），此时相当于告诉 flex-grow 和 flex-shrink 在伸缩的时候不需要考虑我的尺寸；相反当设置为 auto 时（相对弹性元素），此时则需要在伸缩时将元素尺寸纳入考虑。

flex 属性是 flex-grow, flex-shrink 和 flex-basis, 默认值为 `0 1 auto`。后两个属性可选。

- flex-grow 属性定义项目的放大比例，默认为 0，即如果存在剩余空间，也不放大。
- flex-shrink 属性定义了项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小。
- flex-basis 属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为 auto，即项目的本来大小。

## em 和 rem

- `1em`，等于本元素的字体大小，所以在不同的元素里 1em 的绝对大小是不一样的。
- `1rem`，等于根元素的字体大小，在一个页面中，无论在哪个元素上 1rem 都是一样的。
- `em` 适合于用在需要大小需要跟随字体变化的属性上，比如 padding、margin、height、width 等等，元素继承了不同的字体大小，这些属性最好也能跟着变化；
- `rem`适用于字体，这样就可以通过改变根元素的字体大小来改变整个页面的字体大小。

## rem 实现原理及相应的计算方案

rem 布局的本质是等比缩放，一般是基于宽度.
需要了解的基础知识：

- 默认浏览器设置的字体大小为 16px
- viewport 属性

`width、height、initial-scale、maximum-scale、minimum-scale、user-scalable`这些属性，分别表示宽度、高度、初始缩放比例、最大缩放比例、最小缩放比例、是否允许用户缩放

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1.0, user-scalable=no"
/>
```

- dpr, dpr 是设备像素比，是 css 里面 1px 所能显示的像素点的个数，dpr 的值越大，显示的越精细；`window.devicePixelRatio`获取到当前设备的 dpr。

rem 实现适配的原理：

- 核心思想： 百分比布局可实现响应式布局，而 rem 相当于百分比布局。
- 实现原理：动态获取当前视口宽度 width，除以一个固定的数 n，得到 rem 的值。表达式为`rem = width / n`。
  通过此方法，rem 大小始终为 width 的 n 等分。

- 计算方案：

通过 dpr 设置缩放比，实现布局视口大小

```js
var scale = 1 / devicePixelRatio;
document
  .querySelector('meta[name="viewport"]')
  .setAttribute(
    "content",
    "initial-scale=" +
      scale +
      ", maximum-scale=" +
      scale +
      ", minimum-scale=" +
      scale +
      ", user-scalable=no"
  );
```

动态计算 html 的 font-size

```js
// 设置根元素字体大小。此时为宽的100等分
document.documentElement.style.fontSize =
  ocument.documentElement.clientWidth / 100 + "px";
```

实际开发过程中，可以使用 lib-flexible 库，但是如果每次写的时候都要手动去计算有点太过麻烦了，我们可以通过在 webpack 中配置 px2rem-loader, 或者 pxrem-loader，主要原理就是需要自己配置 px 转 rem 的计算规则，在编辑的时候直接计算转成 rem。所以在开发的时候直接按照设计稿的尺寸写 px，编译后会直接转化成 rem。

学习资料：[rem 实现原理及相应的计算方案](https://juejin.im/post/5e8d5268f265da480f0f9c6e#heading-17)

## 物理像素，逻辑像素和像素密度

了解两个概念，一个是**像素**（pixel）可以简写为 px，另外一个是**设备像素比**（DPR）。

- 像素 ：指在由一个数字序列表示的图像中的一个最小单元，单位是 px，不可再次分割了。
- 设备像素比（DPR）: 设备像素比 = 设备像素 / 设备独立像素。

几个概念：

- 物理像素（设备像素）：设备的实际像素，比如 iPhoneXS 有 `1242 X 2688` 物理像素
- 逻辑像素（CSS 像素）：在写 CSS 代码时，针对于我们的单位 px，其宽度为 414px & 896px，也就是说当我们赋予一个 DIV 414px，这个 DIV 就会填满手机的宽度
- 像素密度：`1242/414=3`，也就是说，在单边上，一个逻辑像素 = 3 个物理像素，我们就说这个屏幕的像素密度为 3，也就是我们常说的 3 倍屏。

也就是说，**当逻辑像素是 1pt 时，在 DPR 为 2 的 设备上显示为 2px 的物理像素**

对于图片来说，为了保证其不失真，1 个图片像素至少要对应一个物理像素，假如原始图片是 500X300 像素，那么在 3 倍屏上就要放一个 1500X900 像素的图片才能保证 1 个物理像素至少对应一个图片像素，才能不失真。

会有人好奇，为什么设计稿上显示是 750x1334 呢，这是因为设计稿是显示的物理像素。

而我们 css 中的像素是逻辑像素应该为 375x 667，在编写代码时要将自定义宽度设置成 375px。

那么此时设计稿上的 1px 宽度，实际代表的 css 参数应该是 0.5px 对应物理像素 1px，那么怎么实现这个物理像素为 1px 呢？

## 移动端 1px

### 利用 css 的 伪元素`::after` + `transfrom` 进行缩放

为什么用伪元素？因为伪元素`::after`或`::before`是独立于当前元素，可以单独对其缩放而不影响元素本身的缩放。

```css
.cell {
  width: 100px;
  height: 100px;
}
/* 全部边框 */
.border-1px::after {
  content: "";
  position: absolute;
  box-sizing: border-box;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  border: 1px solid #000;
  border-radius: 4px;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  -webkit-transform-origin: top left;
}
/* 单边框，以上边框为例 */
.border-1px-top::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  border-top: 1px solid red;
  transform: scaleY(0.5);
  transform-origin: left top;
}
```

学习资料：

- [吃透移动端 1px ｜从基本原理到开源解决方案](https://juejin.im/post/5df3053ce51d45583d425ada)

## 移动端适配

### 纬度

移动端适配主要有两个维度：

- 适配不同像素密度。这一部分比较简单，针对不同的像素密度，使用 CSS 媒体查询，选择不同精度的图片，以保证图片不会失真

- 适配不同屏幕大小。由于不同的屏幕有着不同的逻辑像素大小，所以如果直接使用 px 作为开发单位，会使得开发的页面在某一款手机上可以准确显示，但是在另一款手机上就会失真。为了适配不同屏幕的大小，应按照比例来还原设计稿的内容。

为了能让页面的尺寸自适应，可以使用 rem，em，vw，vh 等相对单位。

### 百分比

将所有元素的尺寸都设置成百分比，这样来实现移动端适配，可行吗？

不可行。

因为 width 、height 、margin/padding 等属性虽然支持百分比，但是其默认的相对参考值是包含块而不是屏幕的尺寸。font-size 也支持百分比，但其相对参考值是父元素的 font-size 值。border-radius 、box-shadow 等属性也只能部分或完全不支持百分比值。

使用 vw 和 vh 是可行的，因为其比例是相对于屏幕尺寸的。

## 响应式开发

- 移动端优先。由于移动端页面限制条件比较多，如视口面积小、网速慢、考虑 touch 事件等等因素，从移动端页面扩展到 PC 端页面要更容易一些
- 使用媒体查询根据不同的视口宽度调整样式
- 使用流式布局来保证布局会随着视口宽度的改变进行调整
- 调整 viewport，避免浏览器使用虚拟 viewport

## 移动端 H5 响应式布局

### 解决方案一：rem + pxToRem

原理

监听屏幕视窗的宽度，通过一定比例换算赋值给 html 的 font-size。此时，根字体大小就会随屏幕宽度而变化。
将 px 转换成 rem, 常规方案有两种：

- 利用 sass/less 中的自定义函数 pxToRem，写 px 时，利用 pxToRem 函数转换成 rem。
- 直接写 px，编译过程利用插件全部转成 rem。这样 dom 中元素的大小，就会随屏幕宽度变化而变化了。

实现

动态更新根字体大小

```js
const MAX_FONT_SIZE = 420;

// 定义最大的屏幕宽度
document.addEventListener("DOMContentLoaded", () => {
  const html = document.querySelector("html");
  let fontSize = window.innerWidth / 10;
  fontSize = fontSize > MAX_FONT_SIZE ? MAX_FONT_SIZE : fontSize;
  html.style.fontSize = fontSize + "px";
});
```

px 转 rem

```scss
$rootFontSize: 375 / 10;
// 定义 px 转化为 rem 的函数
@function px2rem($px) {
  @return $px / $rootFontSize + rem;
}

.demo {
  width: px2rem(100);
  height: px2rem(100);
}
```

### 解决方案二：vh + vw

原理

vw 相对于视窗宽度的单位，随宽度变化而变化。由此看来，方案一其实是方案二的一种 "Hack", 通过使用监听实现了方案二的效果。

实现

与 rem 类似做法，直接使用 `postcss-px-to-viewport` 插件进行配置, 配置方式也是和 `postcss-pxtorem` 大同小异。

```js
function createPxReplace(opts, viewportUnit, viewportSize) {
  return function(m, $1) {
    if (!$1) return m;
    var pixels = parseFloat($1);
    if (pixels <= opts.minPixelValue) return m;
    var parsedVal = toFixed((pixels / viewportSize) * 100, opts.unitPrecision);
    return parsedVal === 0 ? "0" : parsedVal + viewportUnit;
  };
}
```

学习资料：[吃透移动端 H5 响应式布局 ｜深入原理到目前最佳实践方案](https://juejin.im/post/5df59139518825123e7af459)

## 使用 Viewport 单位及 rem

### 方法 1 - 仅使用 vw 作为 CSS 长度单位

在仅使用 vw 单位作为唯一 CSS 单位时，我们需遵守：

利用 Sass 函数将设计稿元素尺寸的像素单位转换为 vw 单位

```scss
// iPhone 6尺寸作为设计稿基准
$vw_base: 375;
@function vw($px) {
  @return ($px / $vm_base) * 100vw;
}
```

无论是文本字号大小还是布局高宽、间距、留白等都使用 vw 作为 CSS 单位

```scss
.mod_nav {
  background-color: #fff;
  &_list {
    display: flex;
    padding: vw(15) vw(10) vw(10); // 内间距
    &_item {
      flex: 1;
      text-align: center;
      font-size: vw(10); // 字体大小
      &_logo {
        display: block;
        margin: 0 auto;
        width: vw(40); // 宽度
        height: vw(40); // 高度
        img {
          display: block;
          margin: 0 auto;
          max-width: 100%;
        }
      }
      &_name {
        margin-top: vw(2);
      }
    }
  }
}
```

1 物理像素线（也就是普通屏幕下 1px ，高清屏幕下 0.5px 的情况）采用 transform 属性 scale 实现

```scss
.mod_grid {
    position: relative;
    &::after {
        // 实现1物理像素的下边框线
        content: '';
        position: absolute;
        z-index: 1;
        pointer-events: none;
        background-color: #ddd;
        height: 1px;
        left: 0;
        right: 0;
        top: 0;
        @media only screen and (-webkit-min-device-pixel-ratio: 2) {
            -webkit-transform: scaleY(0.5);
            -webkit-transform-origin: 50% 0%;
        }
    }
    ...
}
```

对于需要保持高宽比的图，应改用 padding-top 实现

```scss
.mod_banner {
  position: relative;
  // 使用padding-top 实现宽高比为 100:750 的图片区域
  padding-top: percentage(100/750);
  height: 0;
  overflow: hidden;
  img {
    width: 100%;
    height: auto;
    position: absolute;
    left: 0;
    top: 0;
  }
}
```

由此，我们不需要增加其他任何额外的脚本代码就能够轻易实现一个常见布局的响应式页面，效果如：[体验地址](https://jdc.jd.com/demo/ting/vw_layout.html)

### vw 搭配 rem，寻找最优解

方法 1 实现的响应式页面虽然看起来适配得很好，但是你会发现由于它是利用 Viewport 单位实现的布局，依赖于视窗大小而自动缩放，无论视窗过大还是过小，它也随着视窗过大或者过小，失去了最大最小宽度的限制，有时候不一定是我们所期待的展示效果。试想一下一个 750px 宽的设计稿在 1920px 的大屏显示器上的糟糕样子。

当然，你可以不在乎移动端页面在 PC 上的展现效果，但如果有低成本却有效的办法来修复这样的小瑕疵，是真切可以为部分用户提升体验的。

我们可以结合 rem 单位来实现页面的布局。rem 弹性布局的核心在于根据视窗大小变化动态改变根元素的字体大小，那么我们可以通过以下步骤来进行优化：

- 给根元素的字体大小设置随着视窗变化而变化的 vw 单位，这样就可以实现动态改变其大小
- 其他元素的文本字号大小、布局高宽、间距、留白都使用 rem 单位
- 限制根元素字体大小的最大最小值，配合 body 加上最大宽度和最小宽度，实现布局宽度的最大最小限制

核心代码实现如下，[线上体验地址](https://jdc.jd.com/demo/ting/vw_rem_layout.html)

```scss
// rem 单位换算：定为 75px 只是方便运算，750px-75px、640-64px、1080px-108px，如此类推
$vw_fontsize: 75; // iPhone 6尺寸的根元素大小基准值
@function rem($px) {
  @return ($px / $vw_fontsize) * 1rem;
}
// 根元素大小使用 vw 单位
$vw_design: 750;
html {
  font-size: ($vw_fontsize / ($vw_design / 2)) * 100vw;
  // 同时，通过Media Queries 限制根元素最大最小值
  @media screen and (max-width: 320px) {
    font-size: 64px;
  }
  @media screen and (min-width: 540px) {
    font-size: 108px;
  }
}
// body 也增加最大最小宽度限制，避免默认100%宽度的 block 元素跟随 body 而过大过小
body {
  max-width: 540px;
  min-width: 320px;
}
```

原文地址：大厂 H5 开发实战手册 [响应式页面开发](https://juejin.im/book/5a7bfe595188257a7349b52a/section/5a7c54335188257a666efdaf)

## 移动端 H5 实践踩坑 12 种问题汇总

移动端 H5 相关问题汇总：

- 1px 问题
- 响应式布局
- iOS 滑动不流畅
- iOS 上拉边界下拉出现白色空白
- 页面件放大或缩小不确定性行为
- click 点击穿透与延迟
- 软键盘弹出将页面顶起来、收起未回落问题
- iPhone X 底部栏适配问题
- 保存页面为图片和二维码问题和解决方案
- 微信公众号 H5 分享问题
- H5 调用 SDK 相关问题及解决方案
- H5 调试相关方案与策略

原文地址：[吃透移动端 H5 与 Hybrid ｜实践踩坑 12 种问题汇总](https://juejin.im/post/5dfadb91e51d45584006e486)

## 滑屏应用开发

> 利用 JavaScript 和 CSS3 来实现单页面应用的滑屏效果，包括上下滑屏、左右滑屏，以及局部元素的滑动切换效果。

在开发滑屏应用的时候，我们应该尽可能做到以下几点来保证页面的顺畅体验：

- 做到延迟加载，避免浪费资源和并发加载资源数过高。
- 做到预加载，预加载必要的资源，避免白屏。
- 在滑屏动画过渡期间，不要做繁重的任务，避免因占用资源过高而导致卡顿。

利器：

- [Swiper](https://github.com/nolimits4web/Swiper)
- 凹凸实验室自研开源的 [HTML5 构建工具 ELF](https://elf.aotu.io/)

判断手势动作的插件：

- [hammerjs](https://hammerjs.github.io/)
- [zeptojs touch 模块](https://zeptojs.com/#touch)

## 参考资料

- [【面试题】CSS 知识点整理(附答案)](https://juejin.im/post/5e8d5268f265da480f0f9c6e)
