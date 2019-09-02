# css 之 rem 和 em

## 动态 rem

* 获取设备dpr
* 算出缩放比例 scale = 1/dpr
* 创建meta以及属性
* 将scale值赋给initial-scale，maximum-scale
* meta插入到文档中
* 创建屏幕大小改变重新计算函数并监听

```javascript
(function(doc, win) {
  console.log("dpr:" + win.devicePixelRatio);
  var docEle = doc.documentElement,
    isIos = navigator.userAgent.match(/iphone|ipod|ipad/gi),
    dpr = Math.min(win.devicePixelRatio, 3);
  (scale = 1 / dpr),
    (resizeEvent =
      "orientationchange" in window ? "orientationchange" : "resize");

  docEle.dataset.dpr = dpr;

  var metaEle = doc.createElement("meta");
  metaEle.name = "viewport";
  metaEle.content = "initial-scale=" + scale + ",maximum-scale=" + scale;
  docEle.firstElementChild.appendChild(metaEle);

  var recalCulate = function() {
    var width = docEle.clientWidth;
    if (width / dpr > 640) {
      width = 640 * dpr;
    }
    docEle.style.fontSize = 20 * (width / 750) + "px";
  };

  recalCulate();

  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvent, recalCulate, false);
})(document, window);

```

## 使用sass同步psd
```scss
@function px2rem( $px ){
    @return $px*750/$designWidth/20 + rem; //这句是不是感觉很熟悉 这句其实跟上面的那段js是对应的 
}
$designWidth : 750; //如设计图是750

// index.scss
@import 'px2rem.scss';
$designWidth : 750; //如设计图是750
.banner{width:px2rem(300)}//如设计稿上的banner是300px 就免去计算环节
```
## rem 与 em
### rem 单位如何转换为像素值

当使用 rem 单位，他们转化为像素大小取决于页根元素的字体大小，即 html 元素的字体大小。 根元素字体大小乘以你 rem 值。

### em 单位如何转换为像素值

当使用em单位时，像素值将是em值乘以使用em单位的元素的字体大小。

### 为什么使用 em 单位
em 单位取决于一个font-size值而非 html 元素的字体大小。

为此，em 单位的主要目的应该是允许保持在一个特定的设计元素范围内的可扩展性。

例如，您可能使用em 值设置导航菜单项的`padding、 margin，line-height`等值。

我建议，当您使用 em 单位，`他们使用的元素的字体大小应设置对rem单位，以保留的可扩展性，但避免继承混淆`。

### 通常不使用 em 单位控制字体大小

### 使用 rem 单位
不需要 em 单位，并且根据浏览器的字体大小设置缩放的任何尺寸。

这几乎在一个标准的设计中占据了一切，包括`heights，widths，padding，margin，border，font-size，shadows`，几乎包括你布局的每部分。

简单地说，一切可扩展都应该使用 rem 单位。

### 提示

创建布局时，往往要以像素为单位更方便，但部署时应使用rem单位。

你可以使用预处理比如`Stylus / Sass / Less`，来自动转换单位或`PostCSS`之类的插件。

或者，您可以使用 `PXtoEM` 手动做您的转换。

**始终使用 rem 单位做媒体查询**

### 不要使用 em 或 rem 

#### 多列布局
布局中的列宽通常应该是 %，因此他们可以流畅适应无法预知大小的视区。

然而单一列一般仍然应使用 rem 值来设置最大宽度。

#### 当元素应该是严格不可缩放的时候

## 总结
让我们以一个快速符号点概括我们介绍的内容:

* rem 和 em 单位是由浏览器基于你的设计中的字体大小计算得到的像素值。
* em 单位基于使用他们的元素的字体大小。
* rem 单位基于 html 元素的字体大小。
* em 单位可能受任何继承的父元素字体大小影响
* rem 单位可以从浏览器字体设置中继承字体大小。
* 使用 em 单位应根据组件的字体大小而不是根元素的字体大小。
* 在不需要使用em单位，并且需要根据浏览器的字体大小设置缩放的情况下使用rem。
* 使用rem单位，除非你确定你需要 em 单位，包括对字体大小。
* 媒体查询中使用 rem 单位
* 不要在多列布局中使用 em 或 rem -改用 %。
* 不要使用 em 或 rem，如果缩放会不可避免地导致要打破布局元素。

## 资料
* [rem与em的使用和区别详解](http://caibaojian.com/rem-vs-em.html)
* [Rem自适应js之精简版flexible.js](http://caibaojian.com/simple-flexible.html)
* [使用Flexible实现手淘H5页面的终端适配](https://www.w3cplus.com/mobile/lib-flexible-for-html5-layout.html) --- 这种方案现在已经被官方弃用
* [再聊移动端页面的适配](https://juejin.im/entry/5a619c62518825734a74c2cc#comment)
* [关于移动端适配，你必须要知道的](https://juejin.im/post/5cddf289f265da038f77696c) --- 非常详细