# 小片段代码简汇之CSS篇

> 总结在平时开发中遇到的一些小问题，大概很长一段时间就会来这么一次，小片段剧场.

## 布局

* [干货!各种常见布局实现+知名网站实例分析](https://juejin.im/post/5aa252ac518825558001d5de#heading-55)
* [CSS 灵感](https://chokcoco.github.io/CSS-Inspiration/#/) - 这里可以让你寻找到使用或者是学习 CSS 的灵感，以分类的形式，展示不同 CSS 属性或者不同的课题使用 CSS 来解决的各种方法。

## white-space | word-break | word-wrap

* [彻底搞懂word-break、word-wrap、white-space](https://juejin.im/post/5b8905456fb9a01a105966b4)

#### `white-space`

控制空白字符的显示，同时还能控制是否自动换行。它有五个值：`normal | nowrap | pre | pre-wrap | pre-line`

#### `word-break`

控制单词如何被拆分换行。它有三个值：`normal | break-all | keep-all`

#### `word-wrap（overflow-wrap）`

控制长度超过一行的单词是否被拆分换行，是word-break的补充，它有两个值：`normal | break-word`


## 兼容Windows、Mac的 font-family

```css
font-family: Helvetica Neue For Number,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,PingFang SC,"PingFangSC-Light" ,"Microsoft yahei", Arial, Helvetica, sans-serif
```

## 关于ios下的input输入框光标上移的问题

> 一般外框设置高度为`auto`,取消掉`line-height`,input本身设置字号大小，使用padding撑开，取消'height、line-height'


## 下拉框箭头重写

```css
/* --ie清除--*/
select::-ms-expand{ display: none; }

/* --火狐、谷歌清除--*/
select{
  appearance:none;  
  -moz-appearance:none;  
  -webkit-appearance:none;
  padding-right: 30px!important;
  background: #fafafb url("/select-logo.png") 98% 50% no-repeat!important;
}
```

## 用CSS写三角形箭头

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

## border边框渐变+圆角

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
  background: linear-gradient(155deg,red, blue);
  z-index: -1;
}
```