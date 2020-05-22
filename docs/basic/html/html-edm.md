# 从零制作 edm 邮件的规则

> 因为电子邮件客户端预览窗口通常只是一小部分屏幕宽度，你最好上你的电子邮件的宽度设计在大约 600px。没有人喜欢水平滚动条

## 一、初见

### table

- `<table>` 标签定义 HTML 表格
- 简单的 HTML 表格由 `table` 元素以及一个或多个 `tr`、`th` 或 `td` 元素组成
- `tr(table row)` 元素定义表格行，`th(table head)` 元素定义表头，`td(table data)` 元素定义表格单元
- 更复杂的 HTML 表格也可能包括 `caption`、`col`、`colgroup`、`thead`、`tfoot` 以及 `tbody` 元素
- [HTML table 标签](http://www.w3school.com.cn/tags/tag_table.asp)

### table 属性

- `border` --- 规定表格边框的宽度
- `align` --- 规定表格相对周围元素的对齐方式 `(left,center,right)`
- `valign` --- 垂直，默认是`valign="middle"`，但是会修改为`valign="top"`
- `cellspacing` --- 规定单元格之间的空间
- `cellpadding` --- 规定单元边沿与其内容之间的空白
- `width` --- 规定表格的宽度
- `height` --- 规定表格的高度
- `background` --- 背景图像
- `bgcolor` --- 背景颜色

```html
<table
  border="1"
  width="600"
  align="center"
  bgcolor="#cccccc"
  cellspacing="10"
  cellpadding="20"
>
  <tr>
    <td>语文</td>
    <td>数学</td>
    <td>英语</td>
  </tr>
</table>
```

### style

- `width、height`
- `font-family`
- `font-size`
- `font-weight`
- `color`
- `line-height`
- `border`
- `background-color`
- `background-image`
- `vertical-align`

### 标签

#### 行内元素

- `<a href="http://www.eefocus.com" target="_blank">`
- `<img src="http://baidu.com/hao123.png" alt="hao123图片">`
- `<span>我也可以是一段话，只是没法自主设置宽度而已</span>`

#### 块级元素

- `<p>我是一段话...</p>`

## 二、了解

### 基本格式

#### Area-1

- HTML 编码格式：`utf-8`
- 页面尽量保持宽（600px~800px）、高（1024px），整体邮件不要太大，比如 15k（各个邮箱不同）左右，不然很容易走垃圾邮箱
- 样式使用行间样式，如：`<td style="font-family:Arial, Helvetica, sans-serif;font-size:12px;color:#000000;" >文字</td>`其他的方式会被无视

#### Area-2

- `font-family` 属性不能为空
- 使用`<table>`布局，居中显示使用`align="center`
- 不使用 table 以外的 `body`、`meta`和`html`之类的标签，部分邮箱系统会把这些过滤掉
- 不使用 `flash、java、javascript、frames、iframe、activeX` 以及 `dhtml`
- 不要出现`onmouseover`、`onmouseout`，即使设定了，也会被过滤掉

#### Area-3

- 区域与区域之间的上下、左右之间的空白间隙，使用标准的`<td width=15>&nbsp;</td>`或`<td height="15">&nbsp;</td>`，不要使用`padding="15px"` --- 防止各个邮箱的解析不同

### 图片

- 图片的每个属性都要定义完整，如：`<img src="http://www.eefocus.com/logo.png" style="vertical-align:top;display:block;" width="210" height="100" alt="logo"/>`
- 定义`style="vertical-align:top;"` --- 防止图片之间会有缝隙、变形等显示异常的情况
- 定义`display:block` --- 解决 Outlook 电子邮件客户中图片底部增加空白间距的问题
- 限制每张图片的大小`width="200 height="200"`或者`style="width:200px;height:200px;"`
- 添加每张图片 alt 属性，如：`alt="我是干啥的"` --- 防止图片无法加载，也可以知晓这是做什么的
- 图片格式使用`jpg、png`，尽量不要使用`gif`
- 地址使用绝对路径（以`http/https`开头的）
- 尽量不使用背景图片`background-image`（Outlook 不显示，但是可以显示背景色：`bgColor="f3f3f3"`），直接使用图片`<img src="">`
- 为了保持各个邮箱的一致性，尽量使用图片，大图可拆分成几张小图拼接，每张图片不要太大（15K 以内）

### 链接

- 地址绝对路径：`<a href="http://www.eefocus.com">Logo Plus</a>`
- 地址不可过长（超过 255 个字符），尽量简短
- 数量尽量不超过 10 个
- 地址不要使用特殊符号，避免解析错误
- 文字中出现链接地址，被屏蔽的风险比较高，一般是文字+链接、图片+链接
- 不要使用地图功能链接，很容易被划分为垃圾邮箱
- 为避免用户收到的邮件图片无法浏览，请制作一份和邮件内容一样的 web 页面，然后在邮件顶部写一句话：“如果您无法查看邮件内容，请点击这里”， 链接到放有同样内容的 web 页面

### Outlook 邮箱规则

- 内敛元素的`padding`无效、`vertical-align`不能被识别，可定义在`td`
- 别想着继承的事儿，某一块的样式都单独设置，比如链接样式，文字样式等
- `p`标签的`width`不起作用，可定义在`td`
- `p`标签的字体颜色会被覆盖，可单独使用诸如`span`等重新设置字体颜色，或者使用`style`定义在 td
- 当设置 `<img align="left" />` 或 `<img align="right" />`时，图片会脱离文档流，在其父元素设置了 `margin` 或 `padding` 的话，都无法使其下移，左移或右移
- `line-height`默认为`1.6`
- `#FFFFFF`关于颜色值，使用六位并且大写，使用简写在 outlook 下被忽略（很神奇）
- 关于链接，可以单独设置：

```css
<style>
    a:link,
    a:visited {
      color: white;
      text-decoration: none;
    }

    a:hover,
    a:active {
      text-decoration: none;
      color: white;
    }

    a:focus {
      text-decoration: none;
      color: white;
    }
  </style>
```

#### Tips

- 避免使用`margin padding`等属性，定义宽高的属性放在`td`，定义样式放在`p`或者`span`等标签内
- 一般而言，指定表格单元格宽度要比指定表格自身宽度要好
- 使用 bgcolor 来替找 style="background:",在电子邮件客户端中 HTML 属性要比 CSS 样式更好，但是优先等级依旧是：css 样式>html 属性
- 新浪邮箱会忽略掉`cellpadding`，一般设置为`0`

## 三、悟道

### 邮件设计

- 电子邮件的设计过程是非常纠结的，为了美还得考虑制作过程的煎熬

#### 保持简单

- 当设计一个 HTML 电子邮件时，请记住保持简单，编码的时候考虑坚持两列布局，这样能为您省去很多麻烦的事情

#### 减少图像的使用甚至避免使用

- 记住你的设计不能太花哨，因为 Outlook 不支持背景图像

#### 窄屏最好

- 因为电子邮件客户端预览窗口通常只是一小部分屏幕宽度，你最好上你的电子邮件的宽度设计在大约 600px。没有人喜欢水平滚动条

#### 保持一致

- 记住，我们使用固定的元素属性 cellpadding 和 cellspacing 设置单元格的边距和单元格的间距。这样保持元素之间的间距一致性是正确的与谨慎的
  > 节选自：[开始制作 HTML Email ](http://www.w3cplus.com/css/getting-started-with-html-emails.html)之邮件设计

### 邮件制作

- 电子邮件的制作过程是非常煎熬的，一不小心就乱了、乱了。

### 邮件测试

- 电子邮件的测试过程是非常痛苦的，也是最让人奔溃的，因为你很有可能拆了西墙补东墙

## 最后

#### 我们看一下测试邮件：[效果图](https://www.qdfuns.com/article.php?mod=view&id=333432fb9305a8331f6cc39998a2626e&uid=32286)
