# Purl.js-JS 获取地址栏信息用例测试

> Purl.js 可以帮助我们来获取地址栏的一些信息， 可以使用原生 js，也可以使用 jQuery

- [Purl.js 官方文档](https://www.bootcdn.cn/purl/readme/)

| Attributes         | Info                                                                                            |
| :----------------- | ----------------------------------------------------------------------------------------------- |
| source             | The whole url being parsed                                                                      |
| protocol           | eg. http, https, file, etc                                                                      |
| host               | eg. www.mydomain.com, localhost etc                                                             |
| port               | eg. 80                                                                                          |
| relative           | The relative path to the file including the querystring (eg. /folder/dir/index.html?item=value) |
| path               | The path to the file (eg. /folder/dir/index.html)                                               |
| directory          | The directory part of the path (eg. /folder/dir/)                                               |
| file               | The basename of the file eg. index.html                                                         |
| query              | The entire query string if it exists, eg. item=value&item2=value2                               |
| fragment or anchor | The entire string after the # symbol                                                            |

#### 初始化：

```javascript
var url;
var myurl;

$("#clickBtn")
  .find("button")
  .click(function(e) {
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
  if (res === "param") {
    return url.param();
  } else if (res === "segment") {
    return url.segment();
  } else {
    return url.attr(res);
  }
}
```

#### 运行试试看：

- [codepen 完整代码](https://codepen.io/istaotao/pen/EeJoKP)
