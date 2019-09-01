# 学习《JavaScript经典实例》之第1章

> 《JavaScript经典实例》各节中的完整代码解决了常见的编程问题，并且给出了在任何浏览器中构建Web应用程序的技术。只需要将这些代码示例复制并粘贴到你自己的项目中就行了，可以快速完成工作，并且在此过程中学习JavaScript的很多知识。

## 第1章 JavaScript不只是简单的构件块
### 1.1 JavaScript对象、基本类型和字面值之间的区别
* 5种基本类型：字符串、数值、布尔值、null、undefined，有3个有对应的构造方法对象:string、Number、Boolean 

* 基本类型变量严格等于字面值，而对象实例则不会，因为基本类型是按值来比较的，而值是字面值

```javascript
var num1 = 123;
var num2 = new Number(123);
console.log(typeof num1);  //number 
console.log(typeof num2);  //object
```
### 1.2 从字符串提取一个列表
* 提取之前：`This is a list of items: cherries, limes, oranges, apples.`
* 提取之后：`['cherries','limes','oranges','apples']`
* **[indexOf()](http://www.w3school.com.cn/jsref/jsref_indexOf.asp)** 方法可返回某个指定的字符串值在字符串中首次出现的位置。
* **[substring()](http://www.w3school.com.cn/jsref/jsref_substring.asp)** 方法用于提取字符串中介于两个指定下标之间的字符。
* **[split()](http://www.w3school.com.cn/jsref/jsref_split.asp)** 方法用于把一个字符串分割成字符串数组。

```javascript
var sentence = 'This is one sentence. This is a sentence with a list of items: cherries, oranges, apples, bananas. That was the list of items.';
var start = sentence.indexOf(':');
var end = sentence.indexOf('.', start+1);
var listStr = sentence.substring(start+1, end);
var fruits = listStr.split(',');
console.log(fruits);  //[" cherries", " oranges", " apples", " bananas"]

//取出空格等
fruits.forEach(function(elmnt,indx,arry) {
    arry[indx] = elmnt.trim();
});
console.log(fruits);  //["cherries", "oranges", "apples", "bananas"]
```
### 1.3 检查一个存在的、非空的字符串
* 想要验证一个变量已经定义了，是一个字符串，并且它不为空

```javascript
if(typeof unknowVariable === 'string' && unknowVariable.length > 0) {...}
```
### 1.4 插入特殊字符
* 想要向字符串中插入一个特殊字符，例如一个换行
* 转义序列都以一个*反斜杠* 开始（\）

### 1.5 使用新字符串替换模式
* 使用String对象的replace方法和一个 **[正则表达式](http://www.runoob.com/js/js-regexp.html)**
* **[replace()](http://www.w3school.com.cn/jsref/jsref_replace.asp)** 方法用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。

#### 正则表达式特殊字符

| 字符 | 匹配  | 例子 |
| -----  | ----- | ----- |
| ^ | 匹配输入的开头     | /^This/ 匹配This is... |
| $ | 匹配输入的结束     | /end$/ 匹配This is the end |
| \* | 匹配0次或多次     | /se\*/ 匹配s seeee或se |
| ? | 匹配0次或1次      | /ap?/ 匹配apple and and |
| + | 匹配1次或多次     | /ap+/ 匹配apple 但是不匹配and |
| {n} | 严格匹配n次     | /ap{2}/ 严格匹配apple 但是不匹配apie |
| {n,} | 匹配n次或多次  | /ap{2,}/ 匹配apple中的p，但是不匹配apie中的p |
| {n,m} | 至少匹配n次，之多匹配m<br>除换行以外的任何字符 | /ap{2,4}/ 匹配apppppple中的4个p<br>/a.e/ 匹配ape和axe |
| [...] | 方括号中的任何字符 | /a[px]e/ 匹配ape axe 但是不匹配apxe |
| [^...] | 除了方括号以外的任何字符 | /a[^px]/ 匹配ale 但是不匹配ape axe  |
| \b  | 匹配单词边界 | /\bno/ 匹配nono中的第一个no |
| \B | 匹配非单词边界 | /\Bno/ 匹配nono中的第二个no |
| \d | 数字0到9 | /\d{3}/ 匹配Now in 123 中的123 |
| \D | 匹配任何非数字字符 | /\D{2,4}/ 匹配Now in 123 中的Now in |
| \w | 匹配任何单词字符（字母、数组和下划线 | /\w/ 匹配javaScript中的j |
| \W | 匹配任何非单词字符（非字母、数组和下划线） | /\W/ 匹配100%中的% |
| \n | 匹配一个换行 |  |
| \s | 一个单个的空白字符 |  |
| \S | 一个单个的非空白字符 |  |
| \t | 一个制表符 |  |
| (x) | 捕获括号 | 记住匹配的字符  |


```javascript
var searchString = "Now is the time, this is the tame";
var re = /t\w{2}e/g;
var replacement = searchString.replace(re, 'place');
console.log(replacement);  //Now is the place, this is the place
```

### 1.6 找到并突出显示一个模式的所有实例
* RegExp **[exec()](http://www.w3school.com.cn/jsref/jsref_exec_regexp.asp)** 方法用于检索字符串中的正则表达式的匹配
* RegExpObject.exec(string)
* 返回一个数组，其中存放匹配的结果。如果未找到匹配，则返回值为 null

```javascript
var searchString2 = "Now is the time and this is the time and that is the time";
var parttern = /t\w*e/g;  //\w 匹配任何单词字符
var matchArray;

var str = "";

//用regexp exec检查模式，如果不为空，处理它
while((matchArray = parttern.exec(searchString2)) != null) {
	str += "at " + matchArray.index + " we found " + matchArray[0] + "\n";
}
console.log(str);
// at 7 we found the
// at 11 we found time
// at 28 we found the
// at 32 we found time
// at 49 we found the
// at 53 we found time
```

```javascript
//实例1-1
document.getElementById("searchSubmit").onclick = function() {

    //获取模式
    var pattern = document.getElementById("pattern").value;
    var re = new RegExp(pattern, "g");
    //获取字符串
    var searchString = document.getElementById("inComing").value;
    
    var matchArray;
    var resultString = "<pre>";
    var first = 0;
    var last = 0;
    
    //找到每一个匹配
    while((matchArray = re.exec(searchString)) != null) {
    	last = matchArray.index;
    
    	//获取所有匹配的字符串，将其连接起来
    	resultString += searchString.substring(first, last);
    
    	//使用class，添加匹配的字符串
    	resultString += '<span class="found">' + matchArray[0] + '</span>';
    	first = re.lastIndex;
    }
    
    //完成字符串
    resultString += searchString.substring(first, searchString.length);
    resultString += "</pre>";
    
    //插入页面
    document.getElementById("searchResult").innerHTML = resultString;

}
```
### 1.7 使用捕获圆括号交换一个字符串中的单词
* 交换名称，让姓氏先出现
* 解决：使用捕获圆括号和一个正则表达式在字符串中找到并记住他们的名字，然后互换他们
* **[replace()](http://www.w3school.com.cn/jsref/jsref_replace.asp)** 方法用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。
 
| 字符 | 替换文本 |
| ------ | ------|
| $1、$2、...、$99 | 与 regexp 中的第 1 到第 99 个子表达式相匹配的文本。  |
| $&  | 与 regexp 相匹配的子串。 |
| $` | 位于匹配子串左侧的文本。 |
| $' | 位于匹配子串右侧的文本。 |
| $$ | 允许替换中有一个字面值美元符号($) |
| $n | 插入使用RegExp的第n次捕获圆括号的值 |

```javascript
var myName = "Tao Yang";
var nameRe = /^(\w+)\s(\w+)$/;
var myNewName = myName.replace(nameRe, "$2 $1");
console.log(myNewName);  //Yang Tao
```

### 1.8 使用命名实体来替代HTML标签
* 使用正则表达式把尖括号(<>)转换为命名的实体：&lt;和&gt;

```javascript
var pieceOfHtml = "<p>This is a <span>paragraph</span></p>";
pieceOfHtml = pieceOfHtml.replace(/</g, "&lt;");
pieceOfHtml = pieceOfHtml.replace(/>/g, "&gt;");
console.log(pieceOfHtml); //&lt;p&gt;This is a &lt;span&gt;paragraph&lt;/span&gt;&lt;/p&gt;
```
### 1.9 ISO 8610格式的日期转换为Date对象可接受的一种形式

```javascript
var dtstr = "2014-3-04T19:35:32Z";
dtstr = dtstr.replace(/\D/g, " ");
console.log(dtstr);  //2014 3 04 19 35 32
var dtcomps = dtstr.split(" ");
//在基于1的ISO 8610月份和基于0的日期格式之间转换
dtcomps[1]--;

var convdt = new Date(Date.UTC.apply(null, dtcomps));
console.log(convdt.toString());  //Wed Mar 05 2014 03:35:32 GMT+0800 (中国标准时间)
```
### 1.10 使用带有定时器的函数闭包
* 使用一个匿名函数作为setInterval()或setTimeout()方法调用的第一个参数

```javascript
var intervalId = null;
document.getElementById("redbox").addEventListener('click', startBox, false);
function startBox() {
    if(intervalId == null) {
        var x = 100;
        intervalId = setInterval(function() {
            x += 5;
            var left = x + "px";
            document.getElementById("redbox").style.left = left;
        }, 500);
    } else {
        clearInterval(intervalId);
        intervalId = null;
    }
}
```
### 1.11 记录两个事件之间消耗的时间
* 在第一个事件发生的时候，创建一个Date对象，当第二个时间发生的时候，创建一个新的Date对象，并且从第二个对象中减去第一个对象。两者之间的差以毫秒表示的，要转换为秒，就除以1000
* 两个日期可以相减，但是相加就成了拼接字符串

```javascript
var firstDate = new Date();
setTimeout(function() {
    doEvent(firstDate);
}, 25000);

function doEvent() {
    var secondDate = new Date();
    var diff = secondDate - firstDate;
    console.log(diff);   //25001
}
```
### 1.12 十进制数转化为十六进制值
* 使用Number对象的 **[toString()](http://www.w3school.com.cn/jsref/jsref_toString_boolean.asp)** 方法

```javascript
var num = 255;
console.log(num.toString(16));  //ff
```
### 1.13 想要将表中一列的所有数字加和
* 遍历表中包含了数字值的列，将其转换为数字，并加和
* **[querySelector()](http://www.runoob.com/jsref/met-document-queryselector.html)**  方法返回文档中匹配指定 CSS 选择器的一个元素
* 如果你需要返回所有的元素，请使用 querySelectorAll() 方法替代
* 全局函数 **[parseInt()](http://www.runoob.com/jsref/jsref-parseint.html)** 和 **[parseFloat()](http://www.runoob.com/jsref/jsref-parsefloat.html)** 都把字符串转化为数字

```javascript
var sum = 0;
//使用querySelectorAll找到第二列的所有单元格
var cells = document.querySelectorAll("td:nth-of-type(2)");
for(var i=0, l=cells.length; i<l; i++) {
    sum += parseFloat(cells[i].firstChild.data);
}
```
### 1.14 在角度和弧度之间转换
* 将角度转换为弧度

```javascript
var radians = degrees * (Math.PI / 180);

```
* 将弧度转化为角度

```javascript
var degrees = radians * (180 / Math.PI);
```
### 1.15 找到页面元素可容纳的一个圆的半径和圆心
* [Math.min(x,y)](http://www.w3school.com.cn/jsref/jsref_min.asp)方法可返回指定的数字中带有最低值的数字。
* 求出宽度和高度中较小的一个，用其除以2得到半径

```javascript
var circleRadius = Math.min(elemengWidth, elemengHeight) / 2;
```

* 给指定页面元素的宽度、高度，通过将二者都除以2来找到其中心点

```javascript
var x = elemengWidth / 2;
var y = elemengHeight / 2;
```
* [Window.getComputedStyle()](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/getComputedStyle)方法给出应用活动样式表后的元素的所有CSS属性的值，并解析这些值可能包含的任何基本计算。
* [getComputedStyle()](http://www.zhangxinxu.com/wordpress/2012/05/getcomputedstyle-js-getpropertyvalue-currentstyle/)

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>将一个SVG圆放入到一个div元素中</title>
	<style type="text/css">
		#elem {
			width: 100%;
			height: 500px;
			border: 1px solid #ddd;
			background-color: #ddd;
		}
	</style>
</head>
<body>

	<div id="elem">
		<svg width="100%" height="100%">
			<circle id="circ" width="10" height="10" r="10" fill="#f90">
		</svg>
	</div>


	<script type="text/javascript">
	window.onload = window.onresize = function() {
		var box = document.getElementById("elem");
		var style = window.getComputedStyle(box, null);
		var width = parseInt(style.getPropertyValue("width"));
		var height = parseInt(style.getPropertyValue("height"));
		console.log('w', width, 'h', height);
		var x = width / 2;
		var y = height / 2;

		var circleRadius = Math.min(width, height) / 2;

		var circ = document.getElementById("circ");
		circ.setAttribute("r", circleRadius);
		circ.setAttribute("cx", x);
		circ.setAttribute("cy", y);
		console.log('r', circleRadius, ' cx', x, ' cy', y);
	}
	</script>
</body>
</html>
```
### 1.16 计算圆弧的长度
* 给定了一个圆的半径及圆弧角的角度值，求该圆弧的长度
* 使用`Math.PI`把角度转换为弧度，并在公式中使用该结果来求得圆弧的长度

```javascript
var radians = degrees * (Math.PI / 180);
var arclength = radians * radians;
```


> 待续~