# 小片段代码简汇之JS篇

> 总结在平时开发中遇到的一些小问题，大概很长一段时间就会来这么一次，小片段剧场。

## 多行文本截取clamp.js
```javascript
<script src = "https://cdn.bootcss.com/Clamp.js/0.5.1/clamp.min.js" ></script>

clampFunc("obj-content-header", 2);

function clampFunc(className, clampNum) {
  var $module = $("." + className);
  clampNum = clampNum ? clampNum : 1;
  $.each($module, function (i, index) {
    $clamp($(this).get(0), {
      clamp: clampNum
    });
  });
}
```
## 判断本地是否存在jquery写法
```javascript
<script type="text/javascript">
  if (typeof jQuery == 'undefined') {
    document.write(unescape("%3Cscript src='https://cdn.bootcss.com/jquery/1.9.0/jquery.min.js' type='text/javascript'%3E%3C/script%3E"));
  }
</script>
```
## 截流函数 AND 节流函数
```javascript
/** 截流函数 **/
/**
  * fn 执行函数
  * context 绑定上下文
  * timeout 延时数值
  **/
let debounce = function(fn, context, timeout) {
	let timer;
	// 使用闭包将内容传递出去
	return function() {
		if(timer) {
			clearTimeout(timer);
		} else {
			timer = setTimeout(function() {
				fn.apply(context, arguments);
			}, timeout);
		}
	}
}
/** 节流函数 **/
var throttle = function(fn, delay, mustRunDelay) {
	var timer = null;
	var t_start;
	return function() {
		var context = this;
		var args = arguments;
		var t_curr = +new Date();
		clearTimeout(timer);
		// 初始化
		if(!t_start) {
			t_start = t_curr;
		} 
		// 超时判断
		if(t_curr - t_start >= mustRunDelay) {
			fn.apply(context, args);
			t_start = t_curr;
		} else {

		}
	}
}
```

## for循环添加点击事件
```javascript
var elems = document.getElementsByTagName('a');
for (var i = 0, l = elems.length; i < l; i++) {
  (function(index) {
    elems[index].addEventListener('click', function(e) {
      e.preventDefault();
      console.log(index);
    }, 'false');
  })(i);
}

```
## 判断浏览器是否开启本地cookie
```javascript
var nd = new Date();
nd.setSeconds(nd.getSeconds() + 60);
document.cookie = "cookietest=1; expires=" + nd.toGMTString();
var cookiesEnabled = document.cookie.indexOf("cookietest=") != -1;
if (!cookiesEnabled) {
  //没有启用cookie   
  alert("没有启用cookie ");
} else {
  //已经启用cookie   
  alert("已经启用cookie ");
}
```
## 解决同级元素鼠标移入移出效果
```html
<a class="member-card-item" id="memberCard" href="#"></a>
<div class="member-card-wper" id="memberProfile">
  <i class="drop-icon"></i>
  <span class="card-item"></span>
  <span class="card-item"></span>
</div>
```
```javascript
var cardTimer = null;
var $mCard = $('#rightNav .wx-wper');
var $mProfile = $('#rightNav .wx-outer');
$mCard.get(0).onmouseover = $mProfile.get(0).onmouseover = function() {
  clearCardTime();
}
$mCard.get(0).onmouseout = $mProfile.get(0).onmouseout = function() {
  cardTime();
}

function cardTime() {
  cardTimer = setTimeout(function() {
    $mProfile.hide();
  }, 400);
}

function clearCardTime() {
  clearTimeout(cardTimer);
  $mProfile.show();
}
```
## placeholder样式兼容&&属性IE兼容
```css
.common-form-control::-webkit-input-placeholder,
.common-form-control::-moz-placeholder,
.common-form-control:-ms-input-placeholder,
.common-form-control::placeholder {
    color: #9b9b9b;
    opacity: 1;
}
```
```javascript
;(function($) {
  $.fn.placeholder = function(options) {
    var opts = $.extend({}, $.fn.placeholder.defaults, options);
    var isIE = document.all ? true : false;
    return this.each(function() {
      var _this = this,
        placeholderValue = _this.getAttribute("placeholder"); //缓存默认的placeholder值
      if (isIE) {
        _this.setAttribute("value", placeholderValue);
        _this.onfocus = function() {
          $.trim(_this.value) == placeholderValue ? _this.value = "" : '';
        };
        _this.onblur = function() {
          $.trim(_this.value) == "" ? _this.value = placeholderValue : '';
        };
      }
    });
  };
})(jQuery);

<script type="text/javascript">
	$("input").placeholder();
</script>
```
## 返回顶部函数
```javascript
// 返回顶部
function gotoTop(acceleration,stime) {
  acceleration = acceleration || 0.1;
  stime = stime || 10;
  var x1 = 0;
  var y1 = 0;
  var x2 = 0;
  var y2 = 0;
  var x3 = 0;
  var y3 = 0;
  if (document.documentElement) {
    x1 = document.documentElement.scrollLeft || 0;
    y1 = document.documentElement.scrollTop || 0;
  }
  if (document.body) {
    x2 = document.body.scrollLeft || 0;
    y2 = document.body.scrollTop || 0;
  }
  var x3 = window.scrollX || 0;
  var y3 = window.scrollY || 0;

  var x = Math.max(x1, Math.max(x2, x3));
  var y = Math.max(y1, Math.max(y2, y3));

  var speeding = 1 + acceleration;
  window.scrollTo(Math.floor(x / speeding), Math.floor(y / speeding));

  if(x > 0 || y > 0) {
    var run = "gotoTop(" + acceleration + ", " + stime + ")";
    window.setTimeout(run, stime);
  }
}
```
## 滚动监听垂直联动
```javascript
$(window).scroll(function (event) {
  var i = 0,
    sTop = $(this).scrollTop(),
    windowH = $(window).height() / 2,
    pos = parseFloat($('#area3').offset().top) / 2,
    pos1 = $('#area3').offset().top - windowH,
    pos2 = $('#area4').offset().top - windowH,
    pos3 = $('#area5').offset().top - windowH,
    pos4 = $('#area6').offset().top - windowH
  $target = $('#navList').parent().parent();

  if (sTop >= pos) {
    $target.show();
  } else {
    $target.hide();
  }

  if (sTop >= pos4) {
    i = 3;
  } else if (sTop >= pos3) {
    i = 2;
  } else if (sTop >= pos2) {
    i = 1;
  } else {
    i = 0;
  }
  $('#navList li').eq(i).addClass('active').siblings().removeClass('active');
});
```
## 右侧浮动导航平滑切换
```javascript
$("#navList a").click(function () {
  var href = $(this).attr("href");
  var pos = $(href).offset().top - 48;
  $(this).parent().addClass('active').siblings().removeClass('active');
  if (!$("body").is(":animated")) {
    $("html,body").animate({
      scrollTop: pos
    }, 600);
  }
  return false;
});
```
## 判断浏览器是否为IE（包括IE11）
```javascript
function isIE() {
  if (!!window.ActiveXObject || "ActiveXObject" in window) {
    alert("is IE");
    return true;
  } else {
    alert("is not IE");
    return false;
  }
}

```

## 判断浏览器是否为移动端
```javascript
var isMobile = false;
if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
  isMobile = true;
} else {
  isMobile = false;
}
```
## 将时间戳转换为时间
```javascript
function getMyDate(str) {
  var oDate = new Date(str),
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth() + 1,
    oDay = oDate.getDate(),
    oHour = oDate.getHours(),
    oMin = oDate.getMinutes(),
    oSen = oDate.getSeconds(),
    oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen); //最后拼接时间  
  return oTime;
};

function getzf(num) {
  if (parseInt(num) < 10) {
    num = '0' + num;
  }
  return num;
}

```

## Node实现JavaScript模块的原理简单介绍
[原文](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/001434502419592fd80bbb0613a42118ccab9435af408fd000)
```
/** Node实现JavaScript模块的一个简单的原理介绍
 * Node利用JavaScript的函数式编程的特性，轻而易举地实现了模块的隔离
 * 变量module是Node在加载js文件前准备的一个变量，并将其传入加载函数
 **/
(function() {
  var s = 'Hello'; //读取Hello.js代码
  var name = 'Taotao';

  console.log('Hell0 ' + name + '!');
})();

// 准备module对象
var module = {
  id: 'hello',
  exports: {}
};
var load = function(module) {
  //读取Hello.js代码
  function greet(module) {
    console.log('Hell0 ' + name + '!');
  }
  module.exports = greet;
  return module.exports;
}
var exported = load(module);
//保存
save(module, exported);
```
## Nodejs基本模块fs

[Node.js内置的fs模块就是文件系统模块，负责读写文件。](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/001434501497361a4e77c055f5c4a8da2d5a1868df36ad1000)

```javascript
'use strict';
var fs = require("fs");

// 异步读文件
fs.readFile('test1.txt', 'utf-8', function(err, data) {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
});

// 异步写文件
var writeData = 'Hello,Node.js';
fs.writeFile('test1.txt', writeData, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('OK!');
  }
});

// 同步读文件
try {
  var data = fs.readFileSync('test1.txt', 'utf-8');
  console.log(data);
} catch (err) {
  console.log(err);
}

// 同步读文件
try {
  fs.writeFileSync('test1.txt', writeData);
  console.log("OK!");
} catch (err) {
  console.log(err);
}

// 异步读取文件相关信息
fs.stat('test1.txt', function(err, stat) {
  if (err) {
    console.log(err);
  } else {
    console.log('isFile: ' + stat.isFile()); // 是否是文件
    console.log('isDirectory: ' + stat.isDirectory()); // 是否是目录
    if (stat.isFile()) {
      console.log('size: ' + stat.size);  // 文件大小
      console.log('birth time: ' + stat.birthtime);  // 创建时间，Date对象
      console.log('modifier time: ' + stat.mtime);  // 修改时间，Date对象
    }
  }
});

// 同步读取文件 statSync() 

```
## Nodejs基本模块http
[廖雪峰的官方网站之Node中的Http](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/0014345015296018cac40c198b543fead5c549865b9bd4a000)
```javascript
'use strict';
// 导入http模块
var fs = require('fs'),
    url = require('url'),
    path = require('path'),
    http = require('http');

// 从命令行参数获取root目录，默认是当前目录：
var root = path.resolve(process.argv[2] || '.');

console.log('Static root dir: ' + root);

// 创建http server
var server = http.createServer(function(request, response) {
  // 获得URL的path
  var pathname = url.parse(request.url).pathname;
  // 获得对应的本地文件路径
  var filepath = path.join(root, pathname);
  // 获取文件状态
  fs.stat(filepath, function(err, stats) {
    if(!err && stats.isFile()) {
      console.log('200 ' + request.url);
      response.writeHead(200);
      // 将文件流导向response
      fs.createReadStream(filepath).pipe(response);
    } else {
      console.log('404 ' + request.url);
      response.writeHead(404);
      response.end('404 Not Found');
    }
  });
});


// 让服务器监听8080端口
server.listen(8080);

console.log('Server is running at http:127.0.0.1:8080/');
```