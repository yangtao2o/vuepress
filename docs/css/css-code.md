# 常用 CSS 使用总结

## 页面布局

- [干货!各种常见布局实现+知名网站实例分析](https://juejin.im/post/5aa252ac518825558001d5de#heading-55)
- [CSS 灵感](https://chokcoco.github.io/CSS-Inspiration/#/) - 这里可以让你寻找到使用或者是学习 CSS 的灵感，以分类的形式，展示不同 CSS 属性或者不同的课题使用 CSS 来解决的各种方法。

## 水平垂直居中的方式

### 水平居中

- 行内元素: text-align:center
- 块级元素: margin:0 auto
- 绝对定位和移动: absolute + transform
- 绝对定位和负边距: absolute + margin
- flex 布局: flex + justify-content:center

### 垂直居中

- 子元素为单行文本: line-height:height
- absolute + transform
- flex + align-items:center
- table: display:table-cell; vertical-align: middle
- 利用 position 和 top 和负 margin

flex

```css
// 父容器
display: flex;
justify-content: center;
align-items: center;
```

position

```css
// 父容器
position: relative;

// 子容器
position: absolute;
margin: auto;
top: 0;
bottom: 0;
left: 0;
right: 0;
```

position+transform

```css
// 父容器
position: relative;

// 子容器
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
```

table-cell

```html
<div class="box">
  <div class="content">
    <div class="inner"></div>
  </div>
</div>
```

```css
html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
}
.box {
  display: table;
  height: 100%;
  width: 100%;
}
.content {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
.inner {
  background-color: #000;
  display: inline-block;
  width: 200px;
  height: 200px;
}
```

## 文本超出部分显示省略号

单行

```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

多行

```css
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3; // 最多显示几行
overflow: hidden;
```

## 去除 inline-block 元素间间距的方法

- 移除空格
- 使用 margin 负值
- 使用 font-size:0 (Chrome 有最小字体限制，可使用`-webkit-text-size-adjust:none;`)
- letter-spacing
- word-spacing

底部产生的间隙，设置`vertical-align`是`top/bottom/middle`都可以解决此问题。

资料：[去除 inline-block 元素间间距的 N 种方法](https://www.zhangxinxu.com/wordpress/2012/04/inline-block-space-remove-%E5%8E%BB%E9%99%A4%E9%97%B4%E8%B7%9D/) - 张鑫旭

## link 与 @import 的区别

- 从属关系区别

@import 是 CSS 提供的语法规则，只有导入样式表的作用；link 是 HTML 提供的标签，不仅可以加载 CSS 文件，还可以定义 RSS、rel 连接属性等

- 加载顺序区别

加载页面时，link 标签引入的 CSS 被同时加载；@import 引入的 CSS 将在页面加载完毕后被加载。

- 兼容性区别

@import 是 CSS2.1 才有的语法，故只可在 IE5+ 才能识别；link 标签作为 HTML 元素，不存在兼容性问题。

- DOM 可控性区别

可以通过 JS 操作 DOM ，插入 link 标签来改变样式；由于 DOM 方法是基于文档的，无法使用@import 的方式插入样式。

## white-space | word-break | word-wrap

- [彻底搞懂 word-break、word-wrap、white-space](https://juejin.im/post/5b8905456fb9a01a105966b4)

### `white-space`

控制空白字符的显示，同时还能控制是否自动换行。它有五个值：`normal | nowrap | pre | pre-wrap | pre-line`

### `word-break`

控制单词如何被拆分换行。它有三个值：`normal | break-all | keep-all`

### `word-wrap（overflow-wrap）`

控制长度超过一行的单词是否被拆分换行，是 word-break 的补充，它有两个值：`normal | break-word`

## 兼容 Windows、Mac 的 font-family

```css
font-family: Helvetica Neue For Number, -apple-system, BlinkMacSystemFont,
  Segoe UI, Roboto, PingFang SC, "PingFangSC-Light", "Microsoft yahei", Arial,
  Helvetica, sans-serif;
```

## 关于 ios 下的 input 输入框光标上移的问题

> 一般外框设置高度为`auto`,取消掉`line-height`,input 本身设置字号大小，使用 padding 撑开，取消'height、line-height'

## 下拉框箭头重写

```css
/* --ie清除--*/
select::-ms-expand {
  display: none;
}

/* --火狐、谷歌清除--*/
select {
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  padding-right: 30px !important;
  background: #fafafb url("/select-logo.png") 98% 50% no-repeat !important;
}
```

## 利用伪元素画三角

```css
.info-tab {
  position: relative;
}
.info-tab::after {
  content: "";
  border: 4px solid transparent;
  border-top-color: #2c8ac2;
  position: absolute;
  top: 0;
}
```

写三角形箭头，比如有三角边框：

```css
.wx-wper-con:before,
.wx-wper-con:after {
  position: absolute;
  top: -9.5px;
  right: 20px;
  display: inline-block;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #dadada;
  border-left: 8px solid transparent;
  content: "";
}
.wx-wper-con:after {
  top: -8.5px;
  border-bottom: 8px solid #fff;
}
```

## border 边框渐变+圆角

```css
.border-test {
  width: 200px;
  height: 200px;
  position: relative;
  border: 4px solid transparent;
  background-color: #fff;
  border-top-right-radius: 50px;
  background-clip: padding-box;
}
.border-test::after {
  content: "";
  display: block;
  position: absolute;
  top: -4px;
  right: -4px;
  bottom: -4px;
  left: -4px;
  border-top-right-radius: 50px;
  background: linear-gradient(155deg, red, blue);
  z-index: -1;
}
```

## 文字两端对齐

```css
text-align: justify;
text-align-last: justify;
```

## 每个单词的首字母大写

```css
text-transform: uppercase;
```

- [text-transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-transform)

> 这是 CSS2 中的属性，参数有 capitalize | uppercase | lowercase | none

参数介绍：

- none： 默认。定义带有小写字母和大写字母的标准的文本。
- capitalize： 文本中的每个单词以大写字母开头。
- uppercase： 定义仅有大写字母。
- lowercase： 定义无大写字母，仅有小写字母。

## 单选高亮

[原文](https://juejin.im/post/5d6ffb676fb9a06b1c744bd5#heading-12)

```css
.input:checked + .colors {
  border-color: #e63838;
  color: #e63838;
}

<div class="single-check">
    <input class="input" type="radio" name="colors" value="1">
    <div class="colors">天空之境</div>
</div>
```

- `~ 选择器`：查找某个元素后面的所有兄弟元素
- `+ 选择器`：查找某个元素后面紧邻的兄弟元素

## 多列等高问题

1. `padding + margin`：每列设置一个比较大的`padding-bottom`，然后通过取负值的 `margin-bottom`，缺点很明显：如下方无法看到圆角，无法看到 `border-bottom` 等
2. `display: table`
3. `display: flex`

## img 铺满父级盒子且图片不能变形

需求：已知父级盒子的宽高，子级 img 宽高未知，想让 img 铺满父级盒子且图片不能变形。

`object-fit` CSS 属性指定可替换元素的内容应该如何适应到其使用的高度和宽度确定的框。

`fill | contain | cover | none | scale-down`

```css
div {
  width: 200px;
  height: 200px;
}
img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
```

## 过渡与动画的区别是什么

- transition

可以在一定的时间内实现元素的状态过渡为最终状态，用于模拟以一种过渡动画效果，但是功能有限，只能用于制作简单的动画效果而动画属性

- animation

可以制作类似 Flash 动画，通过关键帧控制动画的每一步，控制更为精确，从而可以制作更为复杂的动画。

## 1px 方案

```css
.min-device-pixel-ratio(@scale2, @scale3) {
  @media screen and (min-device-pixel-ratio: 2),
    (-webkit-min-device-pixel-ratio: 2) {
    transform: @scale2;
  }
  @media screen and (min-device-pixel-ratio: 3),
    (-webkit-min-device-pixel-ratio: 3) {
    transform: @scale3;
  }
}

.border-1px(@color: #DDD, @radius: 2px, @style: solid) {
  &::before {
    content: "";
    pointer-events: none;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    transform-origin: 0 0;
    border: 1px @style @color;
    border-radius: @radius;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    @media screen and (min-device-pixel-ratio: 2),
      (-webkit-min-device-pixel-ratio: 2) {
      width: 200%;
      height: 200%;
      border-radius: @radius * 2;
      transform: scale(0.5);
    }
    @media screen and (min-device-pixel-ratio: 3),
      (-webkit-min-device-pixel-ratio: 3) {
      width: 300%;
      height: 300%;
      border-radius: @radius * 3;
      transform: scale(0.33);
    }
  }
}

.border-top-1px(@color: #DDD, @style: solid) {
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border-top: 1px @style @color;
    transform-origin: 0 0;
    .min-device-pixel-ratio(scaleY(0.5), scaleY(0.33));
  }
}
```

- [原文](https://juejin.im/post/5d6ffb676fb9a06b1c744bd5#heading-5)

## css3 实现 0.5px 的细线

```css
.line {
  position: relative;
}
.line:after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 1px;
  background-color: #000000;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
```

## css 之 flex 和 grid

### flex

- [flex - CSS（层叠样式表）| MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex)
- [Aligning Items in a Flex Container
  ](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Aligning_Items_in_a_Flex_Container)
- [Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html) - 阮一峰
- [Flex 布局教程：实例篇](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html) - 阮一峰
- [30 分钟彻底弄懂 flex 布局](https://cloud.tencent.com/developer/article/1354252) --- 可以直接读这篇总结文章，讲的很详细
- [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) --- 比较生动形象，自身网站就很好看

### grid

- [Bootstrap 4](https://v4.bootcss.com/docs/4.0/layout/grid/) 的布局在使用 grid
- [CSS Grid 网格布局教程](http://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html) - 阮一峰

### 使用 flex 还是 grid

- [最全～ Grid vs Flex](https://zhuanlan.zhihu.com/p/46757975)

## 如何用 css 实现瀑布流布局

利用`column-count`和`break-inside`这两个 CSS3 属性即可。

- `column-count` CSS 属性，描述元素的列数。
- `column-gap` CSS 属性用来设置元素列之间的间隔 (gutter) 大小。
- `break-inside` CSS 属性描述了在多列布局页面下的内容盒子如何中断，如果多列布局没有内容盒子，这个属性会被忽略。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        margin: 0;
      }
      .waterfall-container {
        /*分几列*/
        column-count: 4;
        width: 100%;
        /* 列间距 */
        column-gap: 10px;
      }

      .waterfall-item {
        break-inside: avoid;
        width: 100%;
        height: 100px;
        margin-bottom: 10px;
        background: #ddd;
        column-gap: 0;
        text-align: center;
        color: #fff;
        font-size: 40px;
      }
    </style>
  </head>
  <body>
    <div class="waterfall-container">
      <div class="waterfall-item" style="height: 100px">1</div>
      <!--省略2...9-->
      <div class="waterfall-item" style="height: 600px">10</div>
    </div>
  </body>
</html>
```

## 实现三栏布局有哪些方法

三栏布局，顾名思义就是两边固定，中间自适应。即左右模块固定宽度，中间模块随浏览器变化自适应。

下面列出实现方式, 在开发中可以根据实际需求选择适合自己的方法进行编码：

### Flex 布局

```html
<style>
  .container {
    display: flex;
    justify-content: center;
    height: 200px;
    background: #eee;
  }
  .left {
    width: 200px;
    background-color: red;
    height: 100%;
  }
  .main {
    background-color: yellow;
    flex: 1;
  }
  .right {
    width: 200px;
    background-color: green;
  }
</style>
<div class="container">
  <div class="left">1</div>
  <div class="main">2</div>
  <div class="right">3</div>
</div>
```

### CSS3 的 calc 函数

思路非常容易理解，就是中间三块区域加 float 浮动起来，从左到右依次按顺序排列，因为左右两侧宽度已知，而中间块宽度需要自适应，所以只要在屏幕宽度变化的时候，通过 css3 的方法实时计算出中间内容块自适应的宽度即可，非常符合人们的思维习惯。

```html
<style>
  header {
    height: 60px;
    width: 100%;
    background: #ffd34e;
  }

  footer {
    height: 100px;
    width: 100%;
    background: rgb(210, 209, 208);
  }

  .content {
    overflow: hidden;
  }

  .main {
    float: left;
    width: calc(100% - 400px);
  }

  .left {
    float: left;
    width: 200px;
    height: 500px;
    background: rgb(131, 124, 104);
  }

  .right {
    float: left;
    width: 200px;
    height: 500px;
    background: rgb(131, 124, 104);
  }
</style>
<header class="header">头部</header>
<div class="content">
  <div class="left">左侧栏</div>
  <div class="main">主要内容</div>
  <div class="right">右侧栏</div>
</div>
<footer class="footer">底部</footer>
```

calc() 的使用注意点：

- 运算符前后都需要保留一个空格，例如：width: calc(100% - 400px)；
- 任何长度值都可以使用 calc()函数进行计算；
- calc()函数支持 "+", "-", "\*", "/" 运算；
- calc()函数使用标准的数学运算优先级规则；

### 绝对定位布局

这种方案也简单实用, 并且可以将 `<div class="main"></div>`元素放到第一位,使得主要内容优先加载!

```html
<style>
  .container {
    position: relative;
    background: #eee;
    height: 200px;
  }
  .main {
    height: 200px;
    margin: 0 120px;
    background-color: yellow;
  }
  .left {
    position: absolute;
    width: 100px;
    height: 200px;
    left: 0;
    top: 0;
    background-color: red;
  }
  .right {
    position: absolute;
    width: 100px;
    height: 200px;
    background-color: green;
    right: 0;
    top: 0;
  }
</style>

<div class="container">
  <div class="main">2</div>
  <div class="left">1</div>
  <div class="right">3</div>
</div>
```

### 圣杯布局

```html
<style>
  .container {
    margin-left: 120px;
    margin-right: 220px;
  }
  .main {
    float: left;
    width: 100%;
    height: 300px;
    background-color: yellow;
  }
  .left {
    float: left;
    width: 100px;
    height: 300px;
    margin-left: -100%;
    position: relative;
    left: -120px;
    background-color: blue;
  }
  .right {
    float: left;
    width: 200px;
    height: 300px;
    margin-left: -200px;
    position: relative;
    right: -220px;
    background-color: green;
  }
</style>
<div class="container">
  <div class="main"></div>
  <div class="left"></div>
  <div class="right"></div>
</div>
```

### 双飞翼布局

双飞翼布局解决问题的方案在前一半和圣杯布局是相同的，也就是三栏全部 float 浮动，但左右两栏加上负 margin 让其跟中间栏 div 并排，以形成三栏布局。

```html
<style>
  .content {
    float: left;
    width: 100%;
  }
  .main {
    height: 200px;
    margin-left: 110px;
    margin-right: 220px;
    background-color: yellow;
  }
  .left {
    float: left;
    height: 200px;
    width: 100px;
    margin-left: -100%;
    background-color: red;
  }
  .right {
    width: 200px;
    height: 200px;
    float: right;
    margin-left: -200px;
    background-color: green;
  }
</style>

<div>
  <div class="content">
    <div class="main"></div>
  </div>
  <div class="left"></div>
  <div class="right"></div>
  <div></div>
</div>
```

### 双飞翼和圣杯布局区别

圣杯布局和双飞翼布局解决问题的方案在前一半是相同的，也就是三栏全部 float 浮动，但左右两栏加上负 margin 让其跟中间栏 div 并排，以形成三栏布局。

```html
<style>
  .layout {
    margin: 20px auto;
    box-sizing: border-box;
  }
  .layout-1 .middle {
    box-sizing: border-box;
    float: left;
    width: 100%;
    padding-left: 100px;
    padding-right: 200px;
    background: #f10;
  }
  .layout-1 .left,
  .layout-2 .left {
    float: left;
    width: 100px;
    margin-left: -100%;
    background-color: #999;
  }
  .layout-1 .right,
  .layout-2 .right {
    float: left;
    width: 200px;
    margin-left: -200px;
    background-color: #999;
  }
</style>
<div class="layout layout-1">
  <div class="middle">middle</div>
  <div class="left">left</div>
  <div class="right">right</div>
</div>
<hr />
<style>
  .layout-2 .middle {
    box-sizing: border-box;
    float: left;
    width: 100%;
    background: #f10;
  }

  .layout-2 .middle-content {
    margin-left: 100px;
    margin-right: 200px;
  }
</style>
<div class="layout layout-2">
  <div class="middle">
    <div class="middle-content">middle</div>
  </div>
  <div class="left">left</div>
  <div class="right">right</div>
</div>
```

双飞翼布局与圣杯布局相同点：

1. 三者都设置向左浮动。
2. 设置 middle 宽度为 100%。
3. 设置 负边距，left 设置负左边距为 100%，right 设置负左边距为负的自身宽度
4. 设置 middle-content 的 margin 值给左右两个子面板留出空间。

双飞翼布局与圣杯布局的主要差别：

1. 双飞翼布局给主面板（中间元素）添加了一个父标签用来通过 margin 给子面板腾出空间
2. 圣杯布局采用的是 padding,而双飞翼布局采用的 margin, 解决了圣杯布局的问题
3. 双飞翼布局不用设置相对布局，以及对应的 left 和 right 值

- [sunshine 小小倩](https://juejin.im/post/599970f4518825243a78b9d5)
- [面试必考点：前端布局知识](https://mp.weixin.qq.com/s?__biz=MzA4ODUzNTE2Nw==&mid=2451046552&idx=1&sn=b0be51400f8b742ddef6ccb470d06d72&chksm=87c41988b0b3909e7b308c6163cc86ecfd322a9047d3bb95693626ab9aed406b6d4de169ab80&mpshare=1&scene=23&srcid&sharer_sharetime=1574820784872&sharer_shareid=73865875704bcba3caa8b09c62f6bd7a%23rd) - 详细介绍

## 学习资料

- [【前端词典】11 个 CSS 知识搭配 11 个 JS 特性 （实用合集）](https://juejin.im/post/5d6ffb676fb9a06b1c744bd5#heading-12)
- [web 前端面试中 10 个关于 css 高频面试题,你都会吗?](https://mp.weixin.qq.com/s?__biz=MzI4NDYxNTM0OQ==&mid=2247484312&idx=1&sn=f4c51d7c3b7dc49f234d119ca0983bb4&chksm=ebf9f442dc8e7d54e2c29761fe9b8c9909a475aca434543759ddd5c1a6e2e8ac10e406bb99ef&mpshare=1&scene=23&srcid=1121SGoxE9Vgb66UMridQbbF&sharer_sharetime=1574331417826&sharer_shareid=73865875704bcba3caa8b09c62f6bd7a%23rd)
- [2019 前端最全面试题](https://zhuanlan.zhihu.com/p/63962882) - 基础理论超详细，可以做自检预备
- [面试必考点：前端布局知识](https://mp.weixin.qq.com/s?__biz=MzA4ODUzNTE2Nw==&mid=2451046552&idx=1&sn=b0be51400f8b742ddef6ccb470d06d72&chksm=87c41988b0b3909e7b308c6163cc86ecfd322a9047d3bb95693626ab9aed406b6d4de169ab80&mpshare=1&scene=23&srcid&sharer_sharetime=1574820784872&sharer_shareid=73865875704bcba3caa8b09c62f6bd7a%23rd)
- [【面试题】CSS知识点整理(附答案)](https://juejin.im/post/5e8d5268f265da480f0f9c6e)