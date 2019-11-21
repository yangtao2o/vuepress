# CSS3 新特性总结

> 都要全民小康了，还不用新特性？

## 过渡

```
transition： CSS属性，花费时间，效果曲线(默认ease)，延迟时间(默认0)

/*宽度从原始值到制定值的一个过渡，运动曲线ease,运动时间0.5秒，0.2秒后执行过渡*/
transition：width,.5s,ease,.2s

/*所有属性从原始值到制定值的一个过渡，运动曲线ease,运动时间0.5秒*/
transition：all,.5s


transition-property: width;
transition-duration: 1s;
transition-timing-function: linear;
transition-delay: 2s;

```

## 动画

`animation`：动画名称，一个周期花费时间，运动曲线（默认 ease），动画延迟（默认 0），播放次数（默认 1），是否反向播放动画（默认 normal），是否暂停动画（默认 running）

执行一次 logo2-line 动画，运动时间 2 秒，运动曲线为 linear

```css
animation: logo2-line 2s linear;
```

2 秒后开始执行一次 logo2-line 动画，运动时间 2 秒，运动曲线为 linear

```css
animation: logo2-line 2s linear 2s;
```

无限执行 logo2-line 动画，每次运动时间 2 秒，运动曲线为 linear，并且执行反向动画

```css
animation: logo2-line 2s linear alternate infinite;
```

- none：不改变默认行为。
- forwards ：当动画完成后，保持最后一个属性值（在最后一个关键帧中定义）。
- backwards：在 animation-delay 所指定的一段时间内，在动画显示之前，应用开始属性值（在第一个关键帧中定义）。
- both：向前和向后填充模式都被应用。

```css
animation-fill-mode: none | forwards | backwards | both;
```

### animation

- [2019 年了，你还不会 CSS 动画？](https://mp.weixin.qq.com/s?__biz=MzA4ODUzNTE2Nw==&mid=2451046550&idx=1&sn=57d53bfd555557b1b7f42cc03a822073&chksm=87c41986b0b3909074ba64c699109569bb122be2876329c30c96c6888faec2b7204504426b56&mpshare=1&scene=23&srcid&sharer_sharetime=1574303452539&sharer_shareid=73865875704bcba3caa8b09c62f6bd7a%23rd) - 老姚

通过开发者工具可以发现，`animation`（动画）属性是 8 个属性的简写。

```css
element.style {
  animation: move 2s linear 3 alternate both;

  animation-duration: 2s;
  animation-timing-function: linear;
  animation-delay: 0s;
  animation-iteration-count: 3;
  animation-direction: alternate;
  animation-fill-mode: both;
  animation-play-state: running;
  animation-name: move;
}
```

### @keyframes

CSS 动画，也称关键帧动画。通过 @keyframes 来定义关键帧。如：

```css
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

定义好了关键帧后，下来就可以直接用它了：

```css
animation: rotate 2s;

// or
animation-name: rotate;
animation-duration: 2s;
```

### animation-timing-function

动画速度的属性 `animation-timing-function` 默认值是 `ease`，即先快后慢。

`animation-timing-function` 常见值有：`linear、ease、ease-in、ease-out、ease-in-out`。

### animation-fill-mode

`@keyframes` 只是定义了动画过程中每一帧的值，然而在动画开始前和动画结束后，元素改处于什么状态呢？

`animation-fill-mode` 说的就是这个事情。除了默认值 none 外，还有另外 3 个值：

- `forwards`，表示，动画完成后，元素状态保持为最后一帧的状态。
- `backwards`，表示，有动画延迟时，动画开始前，元素状态保持为第一帧的状态。
- `both`，表示上述二者效果都有。

### animation-play-state

CSS 动画是可以暂停的。属性 `animation-play-state` 表示动画播放状态，默认值 running 表示播放， paused 表示暂停。

### animation-iteration-count

`animation-iteration-count` 表示动画播放次数。它很好懂，只有一点要注意，无限播放时使用 `infinite`。

### animation-direction

另一个是播放方向 `animation-direction`，它的意思说指定动画按照指定顺序来播放 `@keyframes` 定义的关键帧。其值有：

- `normal` 默认值。
- `reverse` 表示动画反向播放。
- `alternate` 表示正向和反向交叉进行。
- `alternate-reverse` 表示反向和正向交叉进行。

### 代码综合演练

根据老姚的例子，也写个金箍棒吧：

```css
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes color {
  20% {
    background-color: aqua;
  }
  60% {
    background-color: blueviolet;
  }
}
@keyframes width {
  0%,
  100% {
    width: 40%;
  }
  25%,
  75% {
    width: 60%;
  }
  50% {
    width: 80%;
  }
}
.box {
  position: fixed;
  top: 50%;
  left: 30%;
  margin-left: -250px;
  margin-top: -10px;
  width: 500px;
  height: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: linear-gradient(45deg, #f40, #f40);
  background-repeat: no-repeat;
  background-size: 0;
  animation: width 2.5s infinite ease-in-out, color 2.5s infinite ease-in-out,
    rotate 2.5s infinite ease-in-out;
}
.box:hover {
  animation-play-state: paused;
}
```

## 形状转换

```
transform:适用于2D或3D转换的元素
transform-origin：转换元素的位置（围绕那个点进行转换）。默认(x,y,z)：(50%,50%,0)

transform:rotate(30deg);

transform:translate(30px,30px);

transform:scale(.8);

transform: skew(10deg,10deg);

transform:rotateX(180deg);

transform:rotateY(180deg);

transform:rotate3d(10,10,10,90deg);
```

## 阴影

```
box-shadow: 水平阴影的位置 垂直阴影的位置 模糊距离 阴影的大小 阴影的颜色 阴影开始方向

（默认是从里往外，设置inset就是从外往里）;

```

## 边框

```
border-image: 图片url 图像边界向内偏移 图像边界的宽度(默认为边框的宽度)
用于指定在边框外部绘制偏移的量（默认0）
铺满方式--重复（repeat）、拉伸（stretch）或铺满（round）（默认：拉伸（stretch））;

border-radius: n1,n2,n3,n4;
border-radius: n1,n2,n3,n4/n1,n2,n3,n4;
/*n1-n4四个值的顺序是：左上角，右上角，右下角，左下角。*/

```

## 背景

```
制定背景绘制（显示）区域
background-clip: border-box | padding-box | content-box

指定 background-position 属性应该是相对位置
background-origin: border-box | padding-box | content-box

制定背景的大小
background-size: contain | cover | repeat-x | center

多张背景图
background:url('test.jpg') no-repeat left,url(logo.png) no-repeat right;
```

## 反射

```
-webkit-box-reflect:方向[ above-上 | below-下 | right-右 | left-左 ]，偏移量，遮罩图片
```

## 文字

```
换行
word-break: normal | break-all | keep-all;

超出省略号: 禁止换行，超出隐藏，超出省略号
overflow:hidden;
white-space:nowrap;
text-overflow:ellipsis;

多行
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
overflow : hidden;
text-overflow: ellipsis;

文字阴影
text-shadow:水平阴影，垂直阴影，模糊的距离，以及阴影的颜色
text-shadow: 0 0 10px #f00;
```

## 颜色

```
rgba
一个是rgba（rgb为颜色值，a为透明度）

color: rgba(255,00,00,1);
background: rgba(00,00,00,.5);

hsla
h:色相”，“s：饱和度”，“l：亮度”，“a：透明度”

color: hsla( 112, 72%, 33%, 0.68);
background-color: hsla( 49, 65%, 60%, 0.68);
```

## 渐变

## 滤镜

```
filter
```

## 弹性布局

```
flex
```

## 栅格系统

```
grid
```

## 多列布局

```
    column-count: 3;
    -webkit-column-count: 3;
    -moz-column-count: 3;
    column-rule:2px solid #000;
    -webkit-column-rule:2px solid #000;
    -mox-column-rule:2px solid #000;

```

## 盒模型

```
box-sizing 这个属性，网上说法是：属性允许您以特定的方式定义匹配某个区域的特定元素。
```

## 媒体查询

```
监听屏幕尺寸的变化，在不同尺寸的时候显示不同的样式

@media screen and (max-width: 960px) {
    body {
        background-color: darkgoldenrod;
    }
}
@media screen and (max-width: 480px) {
    body {
        background-color: lightgreen;
    }
}
```
