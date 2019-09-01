# 小片段代码简汇之CSS篇

> 总结在平时开发中遇到的一些小问题，大概很长一段时间就会来这么一次，小片段剧场.

#### 兼容Windows、Mac的 font-family
```css
font-family: Helvetica Neue For Number,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,PingFang SC,"PingFangSC-Light" ,"Microsoft yahei", Arial, Helvetica, sans-serif
```
#### 关于ios下的input输入框光标上移的问题
> 一般外框设置高度为`auto`,取消掉`line-height`,input本身设置字号大小，使用padding撑开，取消'height、line-height'

#### 下拉框箭头重写
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
#### 用CSS写三角形箭头
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
#### border边框渐变+圆角
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