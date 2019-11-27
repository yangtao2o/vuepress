# 常用 CSS 技巧使用

> 总结平时开发学习中遇到的一些问题，大概很长一段时间就会来这么一次。

## 页面布局

- [干货!各种常见布局实现+知名网站实例分析](https://juejin.im/post/5aa252ac518825558001d5de#heading-55)
- [CSS 灵感](https://chokcoco.github.io/CSS-Inspiration/#/) - 这里可以让你寻找到使用或者是学习 CSS 的灵感，以分类的形式，展示不同 CSS 属性或者不同的课题使用 CSS 来解决的各种方法。

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

## 用 CSS 写三角形箭头

```css
.wx-wper-con {
  position: absolute;
  left: 0;
  top: 40px;
  width: 158px;
  height: auto;
  background-color: #fff;
  border: 1px solid #e9e9e9;
  padding: 0px 5px;
  text-align: center;
  z-index: 100;
  box-shadow: 0 0 6px -2px #aaa;
}
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

## 学习资料

- [【前端词典】11 个 CSS 知识搭配 11 个 JS 特性 （实用合集）](https://juejin.im/post/5d6ffb676fb9a06b1c744bd5#heading-12)
- [web 前端面试中 10 个关于 css 高频面试题,你都会吗?](https://mp.weixin.qq.com/s?__biz=MzI4NDYxNTM0OQ==&mid=2247484312&idx=1&sn=f4c51d7c3b7dc49f234d119ca0983bb4&chksm=ebf9f442dc8e7d54e2c29761fe9b8c9909a475aca434543759ddd5c1a6e2e8ac10e406bb99ef&mpshare=1&scene=23&srcid=1121SGoxE9Vgb66UMridQbbF&sharer_sharetime=1574331417826&sharer_shareid=73865875704bcba3caa8b09c62f6bd7a%23rd)
