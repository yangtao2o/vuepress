# CSS 基础理论

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

## 流的破坏

### float 特性

float 属性的特性：

- **包裹性**：即此时元素 width 会像 height 一样由子元素决定，而不是默认撑满父元素
- **块状化并格式化上下文**：`display:block`，会创建一个 BFC
- **没有任何 margin 合并**
- **脱离文档流**

float 设计的初衷就是为了“文字环绕”效果，为了让文字环绕图片，就需要具备两个条件：

- 元素高度坍塌
- 行框盒子不可与浮动元素重叠

而元素高度坍塌就导致元素后面的非浮动块状元素会和其重叠，于是他就像脱离文档流了。这时候要用到 clear 来清除浮动。

### clear 的作用和不足

clear 的定义是：元素盒子的边不能与前面的浮动元素相邻。

也就是虽然浮动元素高度坍塌，但是设置了`clear: both`的元素却将其高度视为仍然占据位置。

clear 只能作用于**块级元素**，并且其并不能解决后面元素可能发生的文字环绕问题。

### 块级格式化上下文 BFC

**块格式化上下文**（Block Formatting Context，BFC） 是 Web 页面的可视化 CSS 渲染的一部分，是块盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域。 - MDN

BFC 就好像一个结界，结界里面的东西不能影响外面的布局，也就是说，BFC 的子元素再翻江倒海，都不会影响外面的元素。 所以：

- BFC 本身不会发生 margin 重叠。
- BFC 可以彻底解决子元素浮动带来的的高度坍塌和文字环绕问题。

**创建块格式化上下文**：

- 根元素(`<html>`)
- 浮动元素（元素的 float 不是 none）
- 绝对定位元素（元素的 position 为 absolute 或 fixed）
- 行内块元素（元素的 display 为 inline-block）
- 表格单元格（元素的 display 为 table-cell，HTML 表格单元格默认为该值）
- overflow 值不为 visible 的块元素
- display 值为 flow-root 的元素
- contain 值为 layout、content 或 paint 的元素
- 弹性元素（display 为 flex 或 inline-flex 元素的直接子元素）
- 网格元素（display 为 grid 或 inline-grid 元素的直接子元素）
- 多列容器（元素的 column-count 或 column-width 不为 auto，包括 column-count 为 1）
- column-span 为 all 的元素始终会创建一个新的 BFC，即使该元素没有包裹在一个多列容器中（标准变更，Chrome bug）。

注意：BFC 包含创建该上下文元素的所有子元素，但不包括创建了新 BFC 的子元素的内部元素。

**特性**：

- 内部的盒会在垂直方向一个接一个排列（可以看作 BFC 中有一个的常规流）；
- Box 垂直方向的距离由 margin 决定。属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠；
- 每一个盒子的左外边距应该和包含块的左边缘相接触。即使存在浮动也是如此，除非子盒子形成了一个新的 BFC。
- BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然；
- 计算 BFC 的高度时，考虑 BFC 所包含的所有元素，连浮动元素也参与计算；
- BFC 的区域不会与 float box 重叠；

### position

CSS position 属性用于指定一个元素在文档中的定位方式。top，right，bottom 和 left 属性则决定了该元素的最终位置。

**定位类型**：

定位元素是其计算后位置属性为 **relative, absolute, fixed 或 sticky** 的一个元素（换句话说，除 static 以外的任何东西）。

**绝对定位**：

和浮动元素一样，绝对定位也具有块状化、BFC、包裹性、脱离文档流、没有 margin 合并的特性。

但和浮动不同的是，绝对定位是完全的脱离文档流。

当`overflow: hidden`元素在绝对定位元素和其包含块之间的时候，绝对定位元素不会被剪裁。

以下两种绝对定位元素不会被剪裁:

```html
<div style="overflow: hidden;">
  <img src="big.jpg" style="position: absolute;" />
</div>
<div style="position: relative;">
  <div style="overflow: hidden;">
    <img src="big.jpg" style="position: absolute;" />
  </div>
</div>
```

以下两种绝对定位元素会被剪裁：

```html
<div style="overflow: hidden; position: relative;">
  <img src="big.jpg" style="position: absolute;" />
</div>
<div style="overflow: hidden;">
  <div style="position: relative;">
    <img src="big.jpg" style="position: absolute;" />
  </div>
</div>
```

**position: absolute 的流体特性**：

当绝对定位元素的水平方向(left/right)或垂直方向(top/bottom)的两个定位属性同时存在的时候，绝对元素在该方向上便具有了流体特性。此时的 width/height 属性具有自动撑满的特性，和一个正常流的 div 元素的 width 属性别无二致。

`position: fixed` 是相对于屏幕视口的位置来指定元素位置，祖先元素设置 `position: relative` 并不会对其产生影响。

粘性定位 `position: sticky`:

```css
#one {
  position: sticky;
  top: 10px;
}
```

在 viewport 视口滚动到元素 top 距离小于 10px 之前，元素为相对定位。之后，元素将固定在与顶部距离 10px 的位置，直到 viewport 视口回滚到阈值以下。

需注意当 `position: sticky` 的父元素的 overflow 属性设置了默认值 visible 以外的值时，`position: sticky` 将失效。

## 层叠规则

层叠规则是指当网页中的元素发生层叠时侯的遵循的规则。

z-index 属性设定了一个定位元素及其后代元素或 flex 项目的 z-order。

对于一个已经定位的盒子（即其 position 属性值不是 static，这里要注意的是 CSS 把元素看作盒子），z-index 属性指定：

- 盒子在当前堆叠上下文中的堆叠层级。
- 盒子是否创建一个本地堆叠上下文。

### 层叠上下文

层叠上下文好像是一个结界，层叠上下文内的元素如果跟层叠上下文外的元素发生层叠，则比较该层叠上下文和外部元素的层叠上下文的层叠水平高低。

![z-index](https://user-images.githubusercontent.com/19526072/78873436-76272900-7a7d-11ea-91cd-c427db6000ae.png)

创建一个层叠上下文的方法就是给 position 值为 relative/aboslute/fixed 的元素设置 z-index 不为 auto 的值。

1. 最底层 border/background 是当前层叠上下文元素的边框和背景色（注意不包括文字，文字相当于内联盒子）。z-index 为负值的元素在其之上。

2. 当块级元素和内联元素发生层叠，内联元素居于块级元素之上。

3. 普通定位元素层叠水平在普通元素之上。普通定位元素是指 z-index 为 auto 的定位元素。

### CSS3 新增层叠上下文

CSS3 带来了很多新属性，增加了很多会自动创建层叠上下文的属性：

- 元素的 opacity 值不为 1，也就是透明元素；
- 元素的 transform 值不为 none；
- 元素的 filter 值不为 none；
- 元素的设置-webkit-overflow-scrolling: touch；
- z-index 不为 auto 的弹性盒子的子元素；
- 元素的 isolation 值为 isolate；
- 元素的 mix-blend-mode 值不为 normal；
- 元素的 will-change 值为 opacity/transform/filter/isolation/mix-blend-mode 中的一个。

这些属性大都不支持 z-index，所以他们都默认`z-index: auto`，跟普通定位元素层叠水平一样，所以如果发生层叠会后来居上。

但是弹性盒子`display: flex`不同，弹性盒子的子元素支持设置 z-index，且设置了数值的 z-index 也会自动创建层叠上下文。

## 文本控制

### `::first-letter`选中首个字符

```css
p {
  font-weight: bold;
  font-size: 22px;
}
p::first-letter {
  font-size: 44px;
  color: red;
}
```

### text-transform 应用

假设有个输入框只能输入大写字母，那么如下设置，输入小写字母出现的却是大写字母，可用于身份证输入框或验证码输入框等：

```css
input {
  text-transform: uppercase;
}
```

### word-spacing 空格间隙

word-spacing 指的是**字符“空格”**的间隙。如果一段文字中没有空格，则该属性无效。

下面代码设定空格间隙是 20px，也就是说空格现在占据的宽度是原有的空格宽度+20px 的宽度：

```html
<p>我有空 格，我该死......</p>
<style>
  p {
    word-spacing: 20px;
  }
</style>
```

### white-space 空白处理

在 html 中输入多个空白符，默认会被当成一个空白符处理，实际上就是这个属性控制的：

- normal：合并空白符和换行符；
- nowrap：合并空白符，但不许换行；
- pre：不合并空白符，并且只在有换行符的地方换行；
- pre-wrap：不合并空白符，允许换行符换行和文本自动换行；

### text-align: justify

`text-align: justify`为两端对齐。除了实现文字的两端对齐，还能用来做一些两端对齐的布局。

## 元素的显示与隐藏

`display: none`与`visibility: hidden`的区别：

- display: none 的元素不占据任何空间，visibility: hidden 的元素空间保留；
- display: none 会影响 css3 的 transition 过渡效果，visibility: hidden 不会；
- display: none 隐藏产生重绘 ( repaint ) 和回流 ( relfow )，visibility: hidden 只会触发重绘；
- 株连性：display: none 的节点和子孙节点元素全都不可见，visibility: hidden 的节点的子孙节点元素可以设置 visibility: visible 显示。visibility: hidden 属性值具有继承性，所以子孙元素默认继承了 hidden 而隐藏，但是当子孙元素重置为 visibility: visible 就不会被隐藏。

**元素隐藏方法总结**：

- 不占据空间、资源会加载、DOM 可访问： display: none；
- 不能点击、但占据空间、资源会加载，可以使用： visibility: hidden；
- 可以点击、占据空间，可以使用： opacity: 0；
- 可以点击、不占据空间，可以使用： opacity: 0; position: absolute;；
- 不能点击、占据空间，可以使用： position: relative; z-index: -1;；
- 不能点击、不占据空间，可以使用： position: absolute ; z-index: -1;；
- 不占据空间、显隐时可以又 transition 淡入淡出效果

```css
div {
  position: absolute;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.5s linear;
  background: cyan;
}
div.active {
  visibility: visible;
  opacity: 1;
}
```

这里使用 visibility: hidden 而不是 display: none，是因为 display: none 会影响 css3 的 transition 过渡效果。
但是 display: none 并不会影响 cssanimation 动画的效果。

## 弹性布局

弹性布局是指`display: flex`或`display: inline-flex`的布局。注意，设为弹性布局以后，**子元素的 float、clear、vertical-align 属性都会失效**。

父容器上有六个属性：

- flex-direction：主轴的方向。
- flex-wrap：超出父容器子容器的排列样式。
- flex-flow：flex-direction 属性和 flex-wrap 属性的简写形式。
- justify-content：子容器在主轴的排列方向。
- align-items：子容器在交叉轴的排列方向。
- align-content：多根轴线的对齐方式。

子容器也有 6 个属性：

- order：子容器的排列顺序
- flex-grow：子容器剩余空间的拉伸比例
- flex-shrink：子容器超出空间的压缩比例
- flex-basis：子容器在不伸缩情况下的原始尺寸
- flex：子元素的 flex 属性是 flex-grow,flex-shrink 和 flex-basis 的简写
- align-self

### flex 弹性盒模型

对于某个元素只要声明了`display: flex;`，那么这个元素就成为了弹性容器，具有 flex 弹性布局的特性。

1. 每个弹性容器都有两根轴：**主轴和交叉轴**，两轴之间成**90 度关系**。注意：水平的不一定就是主轴。
1. 每根轴都有**起点和终点**，这对于元素的对齐非常重要。
1. 弹性容器中的所有子元素称为**弹性元素**，弹性元素永远沿主轴排列。
1. 弹性元素也可以通过`display:flex`设置为另一个弹性容器，形成**嵌套关系**。因此一个元素既可以是弹性容器也可以是弹性元素。

### 主轴

flex 布局大部分的属性都是作用于主轴的，在交叉轴上很多时候只能被动地变化。

主轴的方向：`flex-direction: row | row-reverse | column | column-reverse`。如果主轴方向修改了，那么：

- 交叉轴就会相应地旋转 90 度。
- 弹性元素的排列方式也会发生改变，因为**弹性元素永远沿主轴排列**。

那么如果主轴排不下，该如何处理？

通过设置`flex-wrap: nowrap | wrap | wrap-reverse`可使得主轴上的元素不折行、折行、反向折行。

默认是 nowrap 不折行，难道任由元素直接溢出容器吗？当然不会，那么这里就涉及到元素的**弹性伸缩应对**。

复合属性：`flex-flow = flex-drection + flex-wrap`。flex-flow 相当于规定了 flex 布局的“工作流(flow)”

```css
flex-flow: row nowrap;
```

### 元素如何弹性伸缩应对

当`flex-wrap: nowrap;`不折行时，容器宽度有剩余/不够分，弹性元素们该怎么“弹性”地伸缩应对？

这里针对上面两种场景，引入两个属性(需应用在弹性元素上)

- flex-grow：**放大比例**（容器宽度>元素总宽度时如何伸展）
- flex-shrink：**缩小比例**（容器宽度<元素总宽度时如何收缩）

### 弹性处理与刚性尺寸

在进行弹性处理之余，其实有些场景我们更希望元素尺寸固定，不需要进行弹性调整。设置元素尺寸除了 width 和 height 以外，flex 还提供了一个`flex-basis`属性。

`flex-basis`设置的是元素在主轴上的初始尺寸，所谓的初始尺寸就是元素在`flex-grow`和`flex-shrink`生效前的尺寸。

**与 width/height 的区别**：

- 两者都为 0：`width: 0` —— 完全没显示；`flex-basis: 0` —— 根据内容撑开宽度
- 两者非 0：数值相同时两者等效；同时设置，`flex-basis`优先级高
- flex-basis 为 auto：如设置了 width 则元素尺寸由 width 决定；没有设置则由内容决定
- **flex-basis == 主轴上的尺寸 != width**

### 常用的复合属性 flex

`flex = flex-grow + flex-shrink + flex-basis`

一些简写:

- flex: 1 = flex: 1 1 0%
- flex: 2 = flex: 2 1 0%
- flex: auto = flex: 1 1 auto;
- flex: none = flex: 0 0 auto; // 常用于固定尺寸 不伸缩

`flex:1` 和 `flex:auto` 的区别：其实可以归结于`flex-basis: 0`和`flex-basis: auto`的区别。

flex-basis 是指定初始尺寸，当设置为 0 时（绝对弹性元素），此时相当于告诉 flex-grow 和 flex-shrink 在伸缩的时候不需要考虑我的尺寸；相反当设置为 auto 时（相对弹性元素），此时则需要在伸缩时将元素尺寸纳入考虑。

### 容器内如何对齐

主轴上的对齐方式：

```css
justify-content: flex-start | flex-end | center | space-between | space-around;
```

交叉轴上的对齐方式：

```css
/* 交叉轴上的单行对齐 */
align-items: stretch | flex-start | flex-end | center | baseline;

/* 交叉轴上的多行对齐 */
align-content: stretch | flex-start | flex-end | center | baseline |
  space-between | space-around;
```

除了在容器上设置交叉轴对齐，还可以通过**align-self**单独对某个元素设置交叉轴对齐方式。

- 值与 align-items 相同
- 可覆盖容器的 align-items 属性
- 默认值为 auto，表示继承父元素的 align-items 属性

### order

order：可设置元素之间的排列顺序

- 数值越小，越靠前，默认为 0
- 值相同时，以 dom 中元素排列为准

学习资料：

- [Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html) - 阮一峰
- [Flex 布局教程：实例篇](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html) - 阮一峰
- [30 分钟彻底弄懂 flex 布局](https://cloud.tencent.com/developer/article/1354252) --- 可以直接读这篇总结文章，讲的很详细
- [CSS 常见布局方式](https://juejin.im/post/599970f4518825243a78b9d5#heading-5)

## 网格布局

网格布局是目前最强大的 CSS 布局方案。

- [CSS Grid 网格布局教程](http://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html) - 阮一峰
- [Grid 网格布局实例](https://juejin.im/post/5da1749cf265da5b86013198)

## 学习资料

- [我的掘金收藏集](https://juejin.im/collection/5bc456df6fb9a040cff4649d)
- [前端基础篇之 CSS 世界](https://juejin.im/post/5ce607a7e51d454f6f16eb3d)
- [CSS 常见布局方式](https://juejin.im/post/599970f4518825243a78b9d5) - 作者整理非常详细
- [web 前端面试中 10 个关于 css 高频面试题,你都会吗?](https://mp.weixin.qq.com/s?__biz=MzI4NDYxNTM0OQ==&mid=2247484312&idx=1&sn=f4c51d7c3b7dc49f234d119ca0983bb4&chksm=ebf9f442dc8e7d54e2c29761fe9b8c9909a475aca434543759ddd5c1a6e2e8ac10e406bb99ef&mpshare=1&scene=23&srcid=1121SGoxE9Vgb66UMridQbbF&sharer_sharetime=1574331417826&sharer_shareid=73865875704bcba3caa8b09c62f6bd7a%23rd)
- [面试必考点：前端布局知识](https://mp.weixin.qq.com/s?__biz=MzA4ODUzNTE2Nw==&mid=2451046552&idx=1&sn=b0be51400f8b742ddef6ccb470d06d72&chksm=87c41988b0b3909e7b308c6163cc86ecfd322a9047d3bb95693626ab9aed406b6d4de169ab80&mpshare=1&scene=23&srcid&sharer_sharetime=1574820784872&sharer_shareid=73865875704bcba3caa8b09c62f6bd7a%23rd)
- [剖析一些经典的 CSS 布局问题，为前端开发+面试保驾护航](https://mp.weixin.qq.com/s?__biz=MzA4ODUzNTE2Nw==&mid=2451046565&idx=1&sn=9d3a8dc9541b03389a68dfca3149adf3&chksm=87c419b5b0b390a36b8b5ab23f6261e1e54af5b3a23ecc94eec569f2b4d706c40240da85aa06&mpshare=1&scene=23&srcid&sharer_sharetime=1574822522579&sharer_shareid=73865875704bcba3caa8b09c62f6bd7a%23rd)
