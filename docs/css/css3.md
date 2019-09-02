# css 之 css3 新特性总结

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

```
animation：动画名称，一个周期花费时间，运动曲线（默认ease），动画延迟（默认0），播放次数（默认1），是否反向播放动画（默认normal），是否暂停动画（默认running）

/*执行一次logo2-line动画，运动时间2秒，运动曲线为 linear*/
animation: logo2-line 2s linear;

/*2秒后开始执行一次logo2-line动画，运动时间2秒，运动曲线为 linear*/
animation: logo2-line 2s linear 2s;

/*无限执行logo2-line动画，每次运动时间2秒，运动曲线为 linear，并且执行反向动画*/
animation: logo2-line 2s linear alternate infinite;

animation-fill-mode : none | forwards | backwards | both;
/*none：不改变默认行为。    
forwards ：当动画完成后，保持最后一个属性值（在最后一个关键帧中定义）。    
backwards：在 animation-delay 所指定的一段时间内，在动画显示之前，应用开始属性值（在第一个关键帧中定义）。 
both：向前和向后填充模式都被应用。  */      
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