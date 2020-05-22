# Sass 使用总结

> 世界上最成熟、最稳定、最强大的专业级 CSS 扩展语言！ - Sass 官网

主要内容：

- Sass 使用总结
- Bootstrap@4 关于 float 组件的实现

## 安装

我本地结合 gulp+sass 自动化工具使用，主要如下：

```shell
npm install node-sass gulp-sass --save-dev
```

`gulpfile.js` 文件主要配置如下，详情可以参考[这里](https://github.com/yangtao2o/gulp-project/tree/master/src/mygulp)。

```js
const { src, dest, watch } = require("gulp");
const sass = require("gulp-sass");
sass.compiler = require("node-sass");

function scss() {
  return src(scssGlobSrc)
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(dest("dist/sass"));
}

exports.scss = scss;
```

启动：`gulp scss`。

- [如何安装 Sass](https://www.sass.hk/install/)

## 四种编译排版

```css
/*未编译样式*/
.box {
  width: 300px;
  height: 400px;
  &-title {
    height: 30px;
    line-height: 30px;
  }
}
```

nested 编译排版格式

```css
/*命令行内容*/
sass style.scss:style.css --style nested

/*编译过后样式*/
.box {
  width: 300px;
  height: 400px;
}
.box-title {
  height: 30px;
  line-height: 30px;
}
```

expanded 编译排版格式

```css
/*命令行内容*/
sass style.scss:style.css --style expanded

/*编译过后样式*/
.box {
  width: 300px;
  height: 400px;
}
.box-title {
  height: 30px;
  line-height: 30px;
}
```

compact 编译排版格式

```css
/*命令行内容*/
sass style.scss:style.css --style compact

/*编译过后样式*/
.box {
  width: 300px;
  height: 400px;
}
.box-title {
  height: 30px;
  line-height: 30px;
}
```

compressed 编译排版格式

```css
/*命令行内容*/
sass style.scss:style.css --style compressed

/*编译过后样式*/
.box {
  width: 300px;
  height: 400px;
}
.box-title {
  height: 30px;
  line-height: 30px;
}
```

## 静默注释

```scss
body {
  // 这种注释内容不会出现在生成的css文件中
  color: #333;
  /* 这种注释内容会出现在生成的css文件中 */
  padding: 0;
}
```

```css
body {
  color: #333;
  /* 这种注释内容会出现在生成的css文件中 */
  padding: 0;
}
```

## 使用变量

非常简单明了，变量申明：`$color: #4a4a4a;`，变量引用：`color: $color;`，具体例子演示如下：

```scss
$bg-color: #f90;
$font-color: #444;
body {
  background: $bg-color;
  color: $font-color;
}
.selected {
  border: 1px solid $font-color;
}
```

```css
body {
  background: #f90;
  color: #444;
}

.selected {
  border: 1px solid #444;
}
```

## 嵌套 CSS 规则

文档：在 Sass 中，你可以像俄罗斯套娃那样在规则块中嵌套规则块。sass 在输出 css 时会帮你把这些嵌套规则处理好，避免你的重复书写。

看个例子，基本就知道什么意思：

```scss
ul {
  li {
    a {
      color: $font-color;
      &:hover {
        color: red;
      }
      &::after {
        content: "...";
      }
    }
  }
}
```

```css
ul li a {
  color: #444;
}

ul li a:hover {
  color: red;
}

ul li a::after {
  content: "...";
}
```

够简洁，不过有一些嵌套规则，需要稍稍留意，比如：

- 父选择器的标识符`&`
- 群组选择器的嵌套
- 子组合选择器和同层组合选择器：`>、+ 和 ~`
- 属性嵌套

### 父选择器的标识符

父选择器的标识符`&`，记住`&`是爸爸，你可以在爸爸的后边，也可以在爸爸的前边，随你，哈哈哈哈：

```scss
nav a {
  color: $font-color;
  /* Dad after */
  &:hover {
    color: red;
  }
  /* Dad before */
  .header & {
    color: #000;
  }
}
```

```css
nav a {
  color: #444;
}

/* Dad after */
nav a:hover {
  color: red;
}

/* Dad before */
.header nav a {
  color: #000;
}
```

Dad 是爸爸们：`nav a`，什么场景能用到`Dad before`？想想`nav a`是通用样式，我想给 header 组件单独`nav a`的样式，即`.header nav a`，即`.header &`。

当然，还可以这样用：

```scss
.main {
  color: black;
  &-sidebar {
    border: 1px solid;
  }
}

// css
.main {
  color: black;
}

.main-sidebar {
  border: 1px solid;
}
```

### 群组选择器的嵌套

文档例子：

```scss
.container {
  h1,
  h2,
  h3 {
    margin-bottom: 0.8em;
  }
}
nav,
aside {
  a {
    color: blue;
  }
}
```

```css
.container h1,
.container h2,
.container h3 {
  margin-bottom: 0.8em;
}

nav a,
aside a {
  color: blue;
}
```

名字就已经告诉咱们这个规则的要点是：群组。大括号`{`前端的都可以是一个群组，比如`.container`，比如`nav, aside`，不论多少。

做为群组的任何一员，有权利获取子嗣，而且还得跟其他群组成员一模一样，若 Ta 有 三个（`h1, h2, h3`）子嗣，那群组的任何一员也得各自有三个子嗣；Ta 如果只有一个（`a`）子嗣，即使群组人很多，也得每个成员一人一个。

演练：有三个组件`header article footer`，我希望字体颜色有默认值，链接例外，并且有 hover 变化。

```scss
.header,
.acticle,
.footer {
  color: $font-color;
  a {
    color: #999;
    &:hover {
      color: red;
    }
  }
}
```

```css
.header,
.acticle,
.footer {
  color: #444;
}

.header a,
.acticle a,
.footer a {
  color: #999;
}

.header a:hover,
.acticle a:hover,
.footer a:hover {
  color: red;
}
```

### 子组合和同层组合

子组合选择器 `>` 和同层组合选择器 `+、~`，和 CSS 的规则一致。

```css
/* 选择article 后的同层所有 article 元素 */
article ~ article {
  border-top: 1px dashed #ccc;
}
/* 选择nav元素后紧跟的article元素 */
nav + article {
  margin-top: 0;
}
/* 选择article下的所有命中section选择器的元素 */
article > section {
  background: #eee;
}
```

文档例子：

```css
article {
  ~ article {
    border-top: 1px dashed #ccc;
  }
  > section {
    background: #eee;
  }
  dl > {
    dt {
      color: #333;
    }
    dd {
      color: #555;
    }
  }
  nav + & {
    margin-top: 0;
  }
}
```

```css
article ~ article {
  border-top: 1px dashed #ccc;
}

article > section {
  background: #eee;
}

article dl > dt {
  color: #333;
}

article dl > dd {
  color: #555;
}

nav + article {
  margin-top: 0;
}
```

### 嵌套属性

> 规则：把属性名从中划线-的地方断开，在根属性后边添加一个冒号`:`，紧跟一个`{ }`块，把子属性部分写在这个`{ }`块中。就像 css 选择器嵌套一样，sass 会把你的子属性一一解开，把根属性和子属性部分通过中划线`-`连接起来，最后生成的效果与你手动一遍遍写的 css 样式一样：

```scss
nav {
  border: {
    style: solid;
    width: 1px;
    color: #ccc;
  }
}
nav {
  border: 1px solid #ccc {
    left: 0px;
  }
}

// css
nav {
  border-style: solid;
  border-width: 1px;
  border-color: #ccc;
}

nav {
  border: 1px solid #ccc;
  border-left: 0px;
}
```

一句话：我要把`border-style`里的`-`打断，拆散左右，并替换成`:`，重新使用`{}`嵌套使用，宗旨就是不破不立，有破才有立，把所有重复的东西统统归并，只写关键部位。

## @-Rules

### @import 导入

在单独使用 css 的 `@import` 规则导入文件，是不及 `link` 的效率，比如加载字体库，有次在项目中就吃过这个亏，那会发誓打死我也不用这个规则。

sass 的`@import` 规则是在生成 css 文件时就把相关文件导入进来，所以，和 css 的`@import`没有什么关系，放心食用。

但是由于 sass 兼容原生的 css，所以它也支持原生的 CSS`@import`，比如导入文件或者 url 是以 `.css`结尾的。

使用：

```scss
// 常用方法
@import "header";
@import "footer";

// 多个导入
@import "rounded-corners", "text-shadow";

// 嵌套导入
.blue-theme {
  @import "blue-theme";
}
```

如果将文件命名为 `_colors.scss`，便不会编译`_colours.css` 文件，但是导入时依然是`@import "colors";`。

### @media 媒体查询

Sass 中 @media 指令与 CSS 中用法一样，不过还允许其在 CSS 规则中嵌套，编译时，@media 将被编译到文件的最外层，包含嵌套的父选择器。

```scss
.sidebar {
  width: 300px;
  @media screen and (orientation: landscape) {
    width: 500px;
  }
}

/* 拼接 and */
@media screen {
  .sidebar {
    @media (max-width: 1140px) {
      width: 960px;
    }
  }
  .other {
    @media (max-width: 640px) {
      width: 100%;
    }
  }
}
```

```css
.sidebar {
  width: 300px;
}

@media screen and (orientation: landscape) {
  .sidebar {
    width: 500px;
  }
}

/* 拼接 and */
@media screen and (max-width: 1140px) {
  .sidebar {
    width: 960px;
  }
}

@media screen and (max-width: 640px) {
  .other {
    width: 100%;
  }
}
```

### @extend

和其他语言一样，就是继承。比如代码中的`.error`，以及同级`.intrusion`，都会被继承：

```scss
.error {
  border: 1px #f00;
  background-color: #fdd;
}
.error.intrusion {
  background-image: url("/image/hacked.png");
}
.seriousError {
  @extend .error;
  border-width: 3px;
}
```

```css
.error,
.seriousError {
  border: 1px #f00;
  background-color: #fdd;
}

.error.intrusion,
.intrusion.seriousError {
  background-image: url("/image/hacked.png");
}

.seriousError {
  border-width: 3px;
}
```

## 控制指令

### @if

和 JavaScript 的 if 一样：

```scss
$type: monster;
p {
  @if $type == ocean {
    color: blue;
  } @else if $type == monster {
    color: green;
  } @else {
    color: black;
  }
}
```

```css
p {
  color: green;
}
```

### @for

区别在于 through 与 to 的含义：through 包含最后一位，而 to 不包含：

```scss
@for $i from 1 to 3 {
  .list-#{$i} {
    width: 1em * $i;
  }
}
@for $i from 1 through 3 {
  .item-#{$i} {
    width: 2rem * $i;
  }
}
```

```css
.list-1 {
  width: 1em;
}

.list-2 {
  width: 2em;
}

.item-1 {
  width: 2rem;
}

.item-2 {
  width: 4rem;
}

.item-3 {
  width: 6rem;
}
```

### @each

类似于 JavaScript 的 `for...in`：

```scss
@each $kind in small, middle, large {
  .#{$kind}-icon {
    background-image: url("/images/#{$kind}-icon.png");
  }
}
```

```css
.small-icon {
  background-image: url("/images/small-icon.png");
}

.middle-icon {
  background-image: url("/images/middle-icon.png");
}

.large-icon {
  background-image: url("/images/large-icon.png");
}
```

## 混合器

混合器使用`@mixin`标识符定义，通过`@include`来使用这个混合器，用来解决大段重用的代码。

```scss
@mixin clearfix {
  display: inline-block;
  &:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  * html & {
    height: 1px;
  }
}

.clearfix {
  @include clearfix;
}
```

```css
.clearfix {
  display: inline-block;
}

.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

* html .clearfix {
  height: 1px;
}
```

最强大的一点就是如同函数一般，可以传参，不仅可以指定默认值，并且可以使用关键词参数，这样就不用管参数前后顺序了：

```scss
@mixin border-value($width: 1px, $color: #333, $style: solid) {
  border-width: $width;
  border-color: $color;
  border-style: $style;
}
/*不传参*/
h1 {
  @include border-value;
}
/*传参*/
h2 {
  @include border-value(2px, #666, dashed);
}
/*关键词传参*/
h3 {
  @include border-value($style: dashed, $width: 3px, $color: #999);
}
```

```css
/*不传参*/
h1 {
  border-width: 1px;
  border-color: #333;
  border-style: solid;
}

/*传参*/
h2 {
  border-width: 2px;
  border-color: #666;
  border-style: dashed;
}

/*关键词传参*/
h3 {
  border-width: 3px;
  border-color: #999;
  border-style: dashed;
}
```

## 函数指令

与 mixin 相同，也可以传递若干个全局变量给函数作为参数。一个函数可以含有多条语句，需要调用 `@return` 输出结果。

```scss
$grid-width: 40px;
$gutter-width: 10px;

@function grid-width($n) {
  @return $n * $grid-width + ($n - 1) * $gutter-width;
}

.sidebar1 {
  width: grid-width(5);
}
.sidebar2 {
  width: grid-width($n: 10);
}
```

```css
.sidebar1 {
  width: 240px;
}

.sidebar2 {
  width: 490px;
}
```

## SassScript

### 数据类型

SassScript 支持 6 种主要的数据类型：

- 数字，`1, 2, 13, 10px`
- 字符串，有引号字符串与无引号字符串，`"foo", 'bar', baz`
- 颜色，`blue, #04a3f9, rgba(255,0,0,0.5)`
- 布尔型，`true, false`
- 空值，`null`
- 数组 (list)，用空格或逗号作分隔符，`1.5em 1em 0 2em, Helvetica, Arial, sans-serif`
- maps, 相当于 JavaScript 的 object，`(key1: value1, key2: value2)`

### 运算

SassScript 支持数字的加减乘除、取整等运算 `(+, -, *, /, %)`，关系运算 `<, >, <=, >=` 也可用于数字运算，相等运算 `==`, `!=` 可用于所有数据类型。

### 插值语句 #{}

通过 `#{}` 插值语句可以在选择器或属性名中使用变量，避免 Sass 运行运算表达式。

## Bootstrap@4

- [Bootstrap v4.4.1](https://getbootstrap.com/)

入口文件 `bootstrap.scss`的引入组件很多，我们就挑一个看看，比如下面是我们最终的 float 内容：

```css
.float-left {
  float: left !important;
}

.float-right {
  float: right !important;
}

.float-none {
  float: none !important;
}

@media (min-width: 576px) {
  .float-sm-left {
    float: left !important;
  }
  .float-sm-right {
    float: right !important;
  }
  .float-sm-none {
    float: none !important;
  }
}

@media (min-width: 768px) {
  .float-md-left {
    float: left !important;
  }
  .float-md-right {
    float: right !important;
  }
  .float-md-none {
    float: none !important;
  }
}

@media (min-width: 992px) {
  .float-lg-left {
    float: left !important;
  }
  .float-lg-right {
    float: right !important;
  }
  .float-lg-none {
    float: none !important;
  }
}

@media (min-width: 1200px) {
  .float-xl-left {
    float: left !important;
  }
  .float-xl-right {
    float: right !important;
  }
  .float-xl-none {
    float: none !important;
  }
}
```

然后，我们去看看 bootstrap 是如何实现的：

### 第一步：找路

根据 `bootstrap.scss`里的内容`@import "mixins";`，进入当前目录下的`_mixins.scss`，看到`@import "mixins/float";`，所以继续打开`mixins` 目录下的 `_float.scss`。

### 第二步：内容

`_float.scss`所有内容如下：

```scss
// stylelint-disable declaration-no-important

@each $breakpoint in map-keys($grid-breakpoints) {
  @include media-breakpoint-up($breakpoint) {
    $infix: breakpoint-infix($breakpoint, $grid-breakpoints);

    .float#{$infix}-left {
      float: left !important;
    }
    .float#{$infix}-right {
      float: right !important;
    }
    .float#{$infix}-none {
      float: none !important;
    }
  }
}
```

接着，有三个地方，我不知道是什么，如`map-keys()`，`media-breakpoint-up()`，`breakpoint-infix()`。

### 第三步：解惑

- `map-keys()` 返回 map 里面所有的 key：

```scss
$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px
) !default;

@each $breakpoint in map-keys($grid-breakpoints) {
  .#{$breakpoint} {
    color: red;
  }
}

// css
.xs {
  color: red;
}

.sm {
  color: red;
}

.md {
  color: red;
}

.lg {
  color: red;
}

.xl {
  color: red;
}
```

资料：[Sass map 详解](https://www.cnblogs.com/whqet/p/Sassmap.html)

- `media-breakpoint-up()`，自定义函数，主要是根据媒体查询给出不同的结果

```scss
// Media of at least the minimum breakpoint width. No query for the smallest breakpoint.
// Makes the @content apply to the given breakpoint and wider.
@mixin media-breakpoint-up($name, $breakpoints: $grid-breakpoints) {
  $min: breakpoint-min($name, $breakpoints);
  @if $min {
    @media (min-width: $min) {
      @content;
    }
  } @else {
    @content;
  }
}
```

这里`breakpoint-min()`也是个函数：

```scss
// Minimum breakpoint width. Null for the smallest (first) breakpoint.
//
//    >> breakpoint-min(sm, (xs: 0, sm: 576px, md: 768px, lg: 992px, xl: 1200px))
//    576px
@function breakpoint-min($name, $breakpoints: $grid-breakpoints) {
  $min: map-get($breakpoints, $name);
  @return if($min != 0, $min, null);
}
```

这里的`map-get`同 `map-keys`用法，返回 map 里面指定可以的 `value`：

```scss
$min-num: breakpoint-min(sm, $grid-breakpoints);

@media (min-width: $min-num) {
  p {
    color: #444;
  }
}

// css
@media (min-width: 576px) {
  p {
    color: #444;
  }
}
```

`@content`用在`mixin`里面的，当定义一个`mixin`后，并且设置了`@content`之后，、`@include`的时候可以传入相应的内容到`mixin`里面：

```scss
$color: white;
@mixin colors($color: blue) {
  background-color: $color;
  @content;
  border-color: $color;
}
.colors {
  @include colors {
    color: $color;
  }
}

// css
.colors {
  background-color: blue;
  color: white;
  border-color: blue;
}
```

资料：[sass 语法中的@content](https://segmentfault.com/q/1010000004119350)

- `breakpoint-infix()`，自定义函数：

```scss
// Returns a blank string if smallest breakpoint, otherwise returns the name with a dash in front.
// Useful for making responsive utilities.
//
//    >> breakpoint-infix(xs, (xs: 0, sm: 576px, md: 768px, lg: 992px, xl: 1200px))
//    ""  (Returns a blank string)
//    >> breakpoint-infix(sm, (xs: 0, sm: 576px, md: 768px, lg: 992px, xl: 1200px))
//    "-sm"
@function breakpoint-infix($name, $breakpoints: $grid-breakpoints) {
  @return if(breakpoint-min($name, $breakpoints) == null, "", "-#{$name}");
}
```

根据注释我们演示一下：

```scss
$min-value-sm: breakpoint-infix(sm, $grid-breakpoints);
$min-value-xs: breakpoint-infix(xs, $grid-breakpoints);

.float#{$min-value-sm}-left {
  float: left;
}
.float#{$min-value-xs}-left {
  float: left;
}

// css
.float-sm-left {
  float: left;
}

.float-left {
  float: left;
}
```

### 整合

最后，我们把所有关于 float 的内容组合在一起：

```scss
$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px
) !default;

@function breakpoint-min($name, $breakpoints: $grid-breakpoints) {
  $min: map-get($breakpoints, $name);
  @return if($min != 0, $min, null);
}

@function breakpoint-infix($name, $breakpoints: $grid-breakpoints) {
  @return if(breakpoint-min($name, $breakpoints) == null, "", "-#{$name}");
}

@mixin media-breakpoint-up($name, $breakpoints: $grid-breakpoints) {
  $min: breakpoint-min($name, $breakpoints);
  @if $min {
    @media (min-width: $min) {
      @content;
    }
  } @else {
    @content;
  }
}

@each $breakpoint in map-keys($grid-breakpoints) {
  @include media-breakpoint-up($breakpoint) {
    $infix: breakpoint-infix($breakpoint, $grid-breakpoints);

    .float#{$infix}-left {
      float: left !important;
    }
    .float#{$infix}-right {
      float: right !important;
    }
    .float#{$infix}-none {
      float: none !important;
    }
  }
}
```

这样直接就可以在环境里跑起来了。
