# Purl.js-JS获取地址栏信息用例测试

> Purl.js可以帮助我们来获取地址栏的一些信息， 可以使用原生js，也可以使用jQuery

* [Purl.js官方文档](https://www.bootcdn.cn/purl/readme/)

|Attributes	|Info|
|:----|------|
|source |	The whole url being parsed|
|protocol	| eg. http, https, file, etc|
|host	| eg. www.mydomain.com, localhost etc|
|port	| eg. 80|
|relative	| The relative path to the file including the querystring (eg. /folder/dir/index.html?item=value)|
|path	| The path to the file (eg. /folder/dir/index.html)|
|directory |	The directory part of the path (eg. /folder/dir/)|
|file	| The basename of the file eg. index.html|
|query |	The entire query string if it exists, eg. item=value&item2=value2|
|fragment or anchor	| The entire string after the # symbol|

#### 初始化：
```javascript
var url;
var myurl;

$("#clickBtn").find('button').click(function(e) {
  var res, resInfo;

  myurl = $("#urlArea").val();
  // 如果myurl为空，则会获取当前页面的url
  url = purl(myurl);

  $("#urlArea").val(myurl);

  res = $(this).text();
  resInfo = getUrlInfo(url, res);

  $("#inputRes").val(resInfo);
});

function getUrlInfo(url, res) {
  if (res === 'param') {
    return url.param();
  } else if (res === 'segment') {
    return url.segment();
  } else {
    return url.attr(res);
  }
}
```
#### 运行试试看：
* [codepen完整代码](https://codepen.io/istaotao/pen/EeJoKP) 

#### 截图如下所示：
![截图](https://cdn.files.qdfuns.com/article/content/picture/201807/20/221014v16gkkkdks3eegac.png)

#### 记录在QDfuns:
* [Purl.js-使用JS获取URL信息](https://www.qdfuns.com/article/32286/0a69e234cca1cab2f2005425338623a8.html)