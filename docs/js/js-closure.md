# 关于闭包的一道面试题

原文地址：[依次点击4个li标签，哪一个选项是正确的运行结果](https://www.nowcoder.com/questionTerminal/da4115e308c948169a9a73e50d09a3e7?toCommentId=2555046)

### 题目
现有如下html结构：
```html
<ul>
 <li>click me</li>
 <li>click me</li>
 <li>click me</li>
 <li>click me</li>
</ul>
```
依次点击4个li标签，运行结果是什么
```javascript
var elements=document.getElementsByTagName('li');
  var length=elements.length;
  for(var i=0;i<length;i++){
      elements[i].onclick=function(){
      alert(i);
  }
}
```
### 回答（依次弹出4，4，4，4）
以下是我当时在牛客网回答时从《JavaScript高级程序设计》书中抄的：

> 这是由于作用域链的这种配置机制引出的一个副作用，即闭包只能取得包含函数中任何变量的最后一个值。闭包所保存的是整个变量对象，而不是某个特殊的变量。

这里的闭包函数`elements[i].onclick=function(){alert(i);}`的作用域链中保存着闭包的活动对象（这里为空）和全局变量对象（主要是i）,所以，它们引用的是同一个变量i；当点击完成后，变量i=4,也就是每个内部函数i的值都是4；

可以通过创建另一个匿名函数强制让闭包的行为符合预期：
```javascript
window.onload  = function() {
    var elements=document.getElementsByTagName('li');
    var length=elements.length;
    for(var i=0;i<length;i++){
        elements[i].onclick=function(num){
        return function() {
                alert(num);
        };
    }(i);
    }
}
```

在调用匿名函数时，我们传入变量i，由于参数是按值传递的，所以就会将变量i的当前值复制给参数num。而这个匿名函数内部，又创建并alert了一个访问num的闭包。这样，每一次点击都有num变量的一个副本，因此可以返回各自不同的数值。