# 常用 CSS 理论知识

## 基本概念

### 流

“流”又叫文档流，是 css 的一种基本定位和布局机制。流是 html 的一种抽象概念，暗喻这种排列布局方式好像水流一样自然自动。“流体布局”是 html 默认的布局机制，如你写的 html 不用 css，默认自上而下（块级元素如 div）从左到右（内联元素如 span）堆砌的布局方式。

### 块级元素和内联元素

块级元素是指单独撑满一行的元素，如`div、ul、li、table、p、h1`等元素。

这些元素的 display 值默认是`block、table、list-item`等。

内联元素又叫行内元素，指只占据它对应标签的边框所包含的空间的元素，这些元素如果父元素宽度足够则并排在一行显示的，如`span、a、em、i、img、td`等。

这些元素的 display 值默认是`inline、inline-block、inline-table、table-cell`等。

实际开发中，我们经常把 display 计算值为`inline inline-block inline-table table-cell`的元素叫做内联元素，而把 display 计算值为 block 的元素叫做块级元素。

### width: auto 和 height: auto

width、height 的默认值都是 auto。

对于块级元素，流体布局之下 `width: auto` 自适应撑满父元素宽度。这里的撑满并不同于`width: 100%`的固定宽度，而是像水一样能够根据 margin 不同而自适应父元素的宽度。

对于内联元素，`width: auto`则呈现出包裹性，即由子元素的宽度决定。

无论内联元素还是块级元素，`height: auto`都是呈现包裹性，即高度由子级元素撑开。

注意：父元素`height: auto`会导致子元素`height: 100%`百分比失效。

css 的属性非常有意思，正常流下，如果块级元素的 width 是个固定值，margin 是 auto，则 margin 会撑满剩下的空间；如果 margin 是固定值，width 是 auto，则 width 会撑满剩下的空间。这就是流体布局的根本所在。

### 外在盒子和内在盒子

外在盒子是决定元素排列方式的盒子，即决定盒子具有块级特性还是内联特性的盒子。外在盒子负责结构布局。

内在盒子是决定元素内部一些属性是否生效的盒子。内在盒子负责内容显示。

如 `display: inline-table`; 外在盒子就是 inline，内在盒子就是 table。外在盒子决定了元素要像内联元素一样并排在一排显示，内在盒子则决定了元素可以设置宽高、垂直方向的 margin 等属性。

### css 权重和超越!important

```css
/* 假设下面样式都作用于同一个节点元素`span`，判断下面哪个样式会生效 */
body#god div.dad span.son {
  width: 200px;
}
body#god span#test {
  width: 250px;
}
```

可以看到十一个 class 选择器的样式并没有覆盖一个 id 选择器的样式，因为：

当两个权值进行比较的时候，是从高到低逐级将等级位上的权重值来进行比较的，而不是 1000 个数 + 100 个数 + 10 个数 + 1 个数 的总和来进行比较的。

换句话说，低等级的选择器个数再多也不会超过高等级的选择器的优先级的。

正确规则：

- 先从高等级进行比较，高等级相同时，再比较低等级的，以此类推；
- 完全相同的话，就采用 后者优先 原则；

所以以后比较权重，就先比较 id 选择器个数，如果 id 一样多，再比较 class 选择器个数。

在 css 中，!important 的权重相当的高。如果出现了!important，则不管权重如何都取有!important 的属性值。但是宽高有例外情况，由于宽高会被 max-width/min-width 覆盖，所以!important 会失效。

```css
width: 100px !important;
min-width: 200px;
```

上面代码计算之后会被引擎解析成：`width: 200px;`

### 盒模型（盒尺寸）

元素的内在盒子是由`margin box`、`border box`、`padding box`、`content box`组成的，这四个盒子由外到内构成了盒模型。

- IE 模型： `box-sizing: border-box`。此模式下，元素的宽度计算为 border+padding+content 的宽度总和。
- w3c 标准模型： `box-sizing: content-box`。 此模式下，元素的宽度计算为 content 的宽度。

由于 content-box 在计算宽度的时候不包含 border pading，而且又是默认值，业内一般采用以下代码重置样式：

```css
:root {
  box-sizing: border-box;
}
* {
  box-sizing: inherit;
}
```

### 内联盒模型

内联元素是指外在盒子是内联盒子的元素。

从表现来说，内联元素的典型特征就是可以和文字在一行显示。文字也是内联元素。图片、按钮、输入框、下拉框等替换元素也是内联元素。

内联盒模型是指内联元素包含的几个盒子，理解记忆下面的几个概念对 css 的深入学习极其重要。

- 内容区域：本质上是字符盒子。在浏览器中，文字选中状态的背景色就是内容区域。

- 内联盒子：内联盒子就是指元素的外在盒子是内联的，会和其他内联盒子排成一行。

- 行框盒子：由内联元素组成的每一行都是一个行框盒子。如果一行里面没有内联元素如一个空的 div 标签，则不会形成行框盒子。行框盒子由一个个内联盒子组成，如果换行，那就是两个行框盒子。比如一个包含了很多字符的换行的的 p 标签，每一行都存在一个行框盒子。值得注意的是，如果给元素设置 display: inline-block，则创建了一个独立的行框盒子。line-height 是作用在行框盒子上的，并最终决定高度。

- 包含盒子：就是包含块。多行文字组成一个包含块，一个包含块有若干个行框盒子。

- 幽灵空白节点：内联元素的每个行框盒子前面有一个“空白节点”，这个“空白节点”不占据任何宽度，无法选中获取，但是又实实在在存在，表现就如同文本节点一样（本文中大量例子会用字母 x 模拟幽灵空白节点）。

### 替换元素

替换元素是指内容可以替换的元素，实际上就是`content box`可以被替换的元素。

如存在`src=""`属性的`<img> <audio> <video> <iframe>`元素和可以输入文本的`<input> <select> <textarea>`元素等。

所有替换元素都是内联元素，默认 display 属性是 inline 或 inline-block（除了`input[type="hidden"]`默认 display: none;）。

替换元素有自己默认的样式、尺寸（根据浏览器不同而不同），而且其 vertical-align 属性默认是 bottom（非替换元素默认值是 baseline）。

## 盒模型四大金刚

### content

- 对于非替换元素如 div，其 content 就是 div 内部的元素。
- 而对于替换元素，其 content 就是可替换部分的内容。

CSS 中的 content 属性主要用于伪元素`:before/:after`。

### padding

padding 是四大金刚中最稳定的了，少见有什么异常。

尽管如此还是有些需要注意的地方：

大部分情况下我们会将元素重置为 `box-sizing: border-box`，宽高的计算是包含了 padding 的，给人一种 padding 也是 content box 一部分的感觉，好像 line-height 属性也作用于 padding 上。

但实际上，元素真正的内容的宽高只是 content box 的宽高，而 line-height 属性是不作用于 padding 的。

padding 不可为负值，但是可以为百分比值。

为百分比时水平和垂直方向的 padding 都是相对于父级元素宽度计算的。

将一个 div 设为 `padding: 100%`就能得到一个正方形，`padding: 10% 50%`可以得到一个宽高比 5:1 的矩形。

```css
body {
  width: 400px;
}
.box {
  padding: 10% 50%;
}
```

padding 配合 `background-clip` 属性，可以制作一些特殊形状：

```css
/* 三道杠 */
.icon1 {
  box-sizing: border-box;
  display: inline-block;
  width: 12px;
  height: 10px;
  padding: 2px 0;
  border-top: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  background: currentColor; /*注意如果此处背景颜色属性用缩写的话，需要放到其他背景属性的前面，否则会覆盖前面的属性值（此处为 background-clip）为默认值*/
  background-clip: content-box;
}

/* 双层圆点*/
.icon2 {
  display: inline-block;
  width: 12px;
  height: 12px;
  padding: 2px;
  border: 2px solid currentColor;
  border-radius: 50%;
  background-color: currentColor;
  background-clip: content-box;
}
```

currentColor 是 css 中为数不多的变量，指当前文字的颜色值，非常好用。

### margin

作为外边距，margin 属性并不会参与盒子宽度的计算。

但通过设置 margin 为负值，却能改变元素**水平方向**的尺寸。不过这种情况只会发生在元素是**流布局**的时候。

即元素 width 是默认的 auto 并且可以撑满一行的时候。如果元素设定了宽度，或者元素设置了`float: left / position: absolute`这样的属性改变了流体布局，那么 margin 为负也无法改变元素的宽度了。

块级元素的垂直方向会发生 margin 合并，存在以下三种场景：

- **相邻兄弟元素**之间 margin 合并
- **父元素** margin-top/margin-bottom 和**子元素** margin-top/margin-bottom
- **空块级元素自身**的 margin-top 和 margin-botom 合并

要阻止 margin 合并，可以：

1. 把元素放到 **bfc** 中；
2. 设置 **border** 或 **padding** 阻隔 margin；
3. 用**内联元素**（如文字）阻隔；
4. 给父元素**设定高度**。

margin 的百分比值跟 padding 一样，垂直方向的 margin 和水平方向上的一样都是**相对于父元素宽度**计算的。

```html
<div class="box">
  <div></div>
</div>
<style>
  .box {
    overflow: hidden;
    background-color: lightblue;
  }
  .box > div {
    margin: 50%;
  }
</style>
```

此时 .box 是一个宽高比 **2:1** 的矩形，因为空块级元素自身的垂直方向的 margin 发生了合并。

这里父元素设置 `overflow: hidden` 是利用 bfc 的特性阻止子元素的 margin 和父元素合并，换成其他 bfc 特性或者设置 1px 的 border / padding 都是可以达到效果的。

`margin: auto` 能在块级元素设定宽高之后自动填充剩余宽高。

`margin: auto` 自动填充触发的**前提条件**是元素在对应的**水平或垂直**方向具有自动填充特性，显然默认情况下块级元素的高度是不具备这个条件的。

典型应用是块级元素水平局中的实现：

```css
div {
  display: block;
  width: 200px;
  margin: 0 auto;
}
```

auto 的特性是，如果两侧都是 auto，则**两侧均分剩余宽度**；如果一侧 margin 是固定的，另一侧是 auto，则这一侧 auto 为剩余宽度。

这个特性鲜为人知，且很实用。

除了水平方向，垂直方向的 margin 也能实现垂直居中，但是需要元素在垂直方向具有自动填充特性，而这个特性可以**利用 position 实现**：

```css
div {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 200px;
  height: 200px;
  margin: auto;
}
```

### border

border 主要作用是做边框。

- `border-style` 属性的值有 `none/solid/dashed/dotted/double`。
- `border-width` 属性的**默认值是 3px**，是为了照顾小弟 `border-style: double`
- `border-color` 默认是跟随字体的颜色，相当于默认设置了 `border-color: currentColor` 一样。

`border` 另一广受欢迎的功能就是图形构建，特别是做应用广泛的三角形：

```css
div {
  border: 20px solid;
  border-color: blue transparent transparent transparent;
}
```

其实就是将其他三个边框的颜色设置透明，并把宽高设为 0 。

## line-height 和 vertical-align

### line-height

**line-height** 属性用于设置多行元素的空间量，如多行文本的间距。

- 对块级元素来说，line-height 决定了行框盒子的最小高度。
- 对于非替代的 inline 元素，它用于计算行框盒子的高度。此时内联元素的行框盒子的高度完全由 line-height 决定，不受其他任何属性的影响。

**行距**是指一行文本和相邻文本之间的距离。`行距 = line-height — font-size`。行距具有上下等分的机制：意思就是文字上下的行距是一样的，各占一半，这也是 line-height 能让内联元素垂直居中的原因。

**内联元素的大值特性**：无论内联元素的 line-height 如何设置，最终父元素的高度都是数值大的那个 line-height 决定的。

### vertical-align

**vertical-align** 属性起作用的前提必须是作用在**内联元素**上。

即 display 计算值为 `inline inline-block inline-table table-cell` 的元素。

所以如果元素设置了 `float: left` 或者 `position: absolute`，则其 vertical-align 属性不能生效，因为此时元素的 display 计算值为 block 了。

vertical-align 的属性值：

- **线类**：baseline（默认值） top middle bottom
- **文本类**：text-top text-bottom（使元素的顶部与父元素的字体顶部对齐。）
- **上标下标**：sub super（使元素的基线与父元素的下标基线对齐。）
- **数值**：20px 2em （默认值 baseline 相当于数值的 0 。数值正值是基线往上偏移，负值是往下偏移，借此可以实现元素垂直方向精确对齐。）
- **百分比**：20% （使元素的基线对齐到父元素的基线之上的给定百分比，该百分比是 line-height 属性的百分比。）

一个设置了`display: inline-block`的元素：

- 如果元素内部没有内联元素，则该元素基线就是该元素下边缘；
- 如果元素设置了 overflow 为 hidden auto scroll，则其基线就是该元素下边缘；
- 如果元素内部还有内联元素，则其基线就是内部最后一行内联元素的基线。

有时候会遇见高度和设置不一致的情况，为什么？

原来是**幽灵空白节点**搞的鬼。此时 span 的行框盒子前，还存在一个幽灵空白节点。由于 span 元素默认基线对齐，所以 span 元素的基线也就是其下边缘是和幽灵空白节点的基线对齐的。从而导致幽灵空白节点基线下面的半行距撑高了 div 元素，造成空隙。

间隙产生本质上是由**基线对齐引发的错位**造成的，源头上是 vertical-align 和 line-height 共同造成的，所以要想解决这个问题，只要直接或间接改造两个属性中的一个就行了：

- 给元素设置块状化 display: block 使 vertical-align 属性失效；
- 尝试不同的 vertical-align 值如 bottom/middle/top；
- 直接修改 line-height 值；
- 如果 line-height 为相对值如 1.4，设置 font-size: 0 间接改变 line-height。

张鑫旭大佬利用 vertical-align 实现的**水平垂直居中弹框**：

```html
<div class="container">
  <div class="dialog">自适应弹出层</div>
</div>
```

```css
.container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.15);
  text-align: center;
  font-size: 0;
  white-space: nowrap;
  overflow: auto;
}
.container:after {
  content: "";
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}
.dialog {
  display: inline-block;
  width: 400px;
  height: 400px;
  vertical-align: middle;
  text-align: left;
  font-size: 14px;
  white-space: normal;
  background: white;
}
```

## 学习资料

- [我的掘金收藏集](https://juejin.im/collection/5bc456df6fb9a040cff4649d)
- [前端基础篇之 CSS 世界](https://juejin.im/post/5ce607a7e51d454f6f16eb3d)
- [CSS 常见布局方式](https://juejin.im/post/599970f4518825243a78b9d5) - 作者整理非常详细
- [web 前端面试中 10 个关于 css 高频面试题,你都会吗?](https://mp.weixin.qq.com/s?__biz=MzI4NDYxNTM0OQ==&mid=2247484312&idx=1&sn=f4c51d7c3b7dc49f234d119ca0983bb4&chksm=ebf9f442dc8e7d54e2c29761fe9b8c9909a475aca434543759ddd5c1a6e2e8ac10e406bb99ef&mpshare=1&scene=23&srcid=1121SGoxE9Vgb66UMridQbbF&sharer_sharetime=1574331417826&sharer_shareid=73865875704bcba3caa8b09c62f6bd7a%23rd)
- [面试必考点：前端布局知识](https://mp.weixin.qq.com/s?__biz=MzA4ODUzNTE2Nw==&mid=2451046552&idx=1&sn=b0be51400f8b742ddef6ccb470d06d72&chksm=87c41988b0b3909e7b308c6163cc86ecfd322a9047d3bb95693626ab9aed406b6d4de169ab80&mpshare=1&scene=23&srcid&sharer_sharetime=1574820784872&sharer_shareid=73865875704bcba3caa8b09c62f6bd7a%23rd)
- [剖析一些经典的 CSS 布局问题，为前端开发+面试保驾护航](https://mp.weixin.qq.com/s?__biz=MzA4ODUzNTE2Nw==&mid=2451046565&idx=1&sn=9d3a8dc9541b03389a68dfca3149adf3&chksm=87c419b5b0b390a36b8b5ab23f6261e1e54af5b3a23ecc94eec569f2b4d706c40240da85aa06&mpshare=1&scene=23&srcid&sharer_sharetime=1574822522579&sharer_shareid=73865875704bcba3caa8b09c62f6bd7a%23rd)
