# 大片段代码简汇之 JS 篇

## 手动实现 instanceof

> 判断 Object 的 prototype 是否在 a 的原型链上: `a instanceof Object`

```javascript
function myInstanceof(target, origin) {
  const proto = target.__proto__;
  if (proto) {
    if (origin.prototype === proto) {
      return true;
    } else {
      return myInstanceof(proto, origin);
    }
  } else {
    return false;
  }
}
```

## 函数柯里化

> 柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。

通俗滴说：用闭包把参数保存起来，当参数的数量足够执行函数了，就开始执行函数。

```javascript
function currying(fn, ...args) {
  if (args.length >= fn.length) {
    return fn(...args);
  } else {
    return (...args2) => currying(fn, ...args, ...args2);
  }
}
function getUrl(protocol, domain, path) {
  return protocol + "://" + domain + "/" + path;
}
let conardliSite = currying(getUrl)("http", "www.conardli.top");
let page1 = conardliSite("page1.html");
console.log({ page1 }); // {page1: "http://www.conardli.top/page1.html"}
```

## 浅拷贝和深拷贝

### 浅拷贝

```
arr.slice();
arr.concat();
```

### 深拷贝

```javascript
// 1
JSON.parse(JSON.stringify(obj));

// 2
function clone(target) {
  if (typeof target === "Object") {
    let cloneTarget;
    if (Array.isArray(target)) {
      cloneTarget = [];
      for (let i = 0; i < target.length; i++) {
        cloneTarget[i] = clone(target[i]);
      }
    } else {
      cloneTarget = {};
      for (const key in target) {
        cloneTarget[key] = clone(target[key]);
      }
    }
    return cloneTarget;
  } else {
    return target;
  }
}
let arr = [1, 3, 2, 4, 5];
let obj = {
  name: "yangtap",
  age: 20,
  love: {
    book: "hahah",
    car: "heihe"
  }
};
let newArr = clone(arr);
let newObj = clone(obj);
console.log({ newArr, newObj });
```

## 懒加载与预加载

- preload 是告诉浏览器页面必定需要的资源，浏览器一定会加载这些资源；
- prefetch 是告诉浏览器页面可能需要的资源，浏览器不一定会加载这些资源。
- preload 和 prefetch 混用的话，并不会复用资源，而是会重复加载。
- 避免错用 preload 加载跨域资源：对跨域的文件进行 preload 的时候，我们必须加上 crossorigin 属性

```html
<link
  rel="preload"
  as="font"
  crossorigin
  href="https://at.alicdn.com/t/font_zck90zmlh7hf47vi.woff"
/>
```

- [通过 rel="preload"进行内容预加载](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Preloading_content)

```html
<link
  rel="preload"
  as="font"
  href="https://at.alicdn.com/t/font_zck90zmlh7hf47vi.woff"
/>
<link rel="preload" as="script" href="https://a.xxx.com/xxx/PcCommon.js" />
<link rel="preload" as="script" href="https://a.xxx.com/xxx/TabsPc.js" />
```

## Debounce 和 Throttle

原文地址：[Debounce 和 Throttle 的原理及实现](https://www.tuicool.com/articles/YvyQRrv)

### 防抖和节流

#### 防抖

如输入框时，只在最后提交的时候校验，即：将多次高频率操作优化为只在最后一次执行

思路：每次触发事件时，清除之前的定时器方法

```javascript
function debounce(fn, wait, immediate) {
  let timer = null;
  console.log("in");
  return function() {
    let context = this;
    let args = arguments;

    if (immediate && !timer) {
      fn.apply(context, args);
    }

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      console.log("timer");
      fn.apply(context, args);
    }, wait);
  };
}
function test() {
  console.log("被触发了");
}
document.getElementById("btn").onfocus = debounce(test, 1000);
```

#### 节流

降低频率，每隔一段时间后执行一次，将高频率操作优化为低频率操作，如滚动条事件，resize 事件

思路：每次触发事件时都判断当前是否有等待执行的延时函数

```javascript
function throtte(fn, wait, immediate) {
  let timer = null;
  let callNow = immediate;
  return function() {
    let args = arguments;
    let context = this;

    if (callNow) {
      fn.apply(context, args);
      callNow = false;
    }
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args);
        timer = null;
      }, wait);
    }
  };
}

window.addEventListener("resize", throtte(test, 1000));
```

## 关于闭包的一道面试题

原文地址：[依次点击 4 个 li 标签，哪一个选项是正确的运行结果](https://www.nowcoder.com/questionTerminal/da4115e308c948169a9a73e50d09a3e7?toCommentId=2555046)

### 题目

现有如下 html 结构：

```html
<ul>
  <li>click me</li>
  <li>click me</li>
  <li>click me</li>
  <li>click me</li>
</ul>
```

依次点击 4 个 li 标签，运行结果是什么

```javascript
var elements = document.getElementsByTagName("li");
var length = elements.length;
for (var i = 0; i < length; i++) {
  elements[i].onclick = function() {
    alert(i);
  };
}
```

### 回答（依次弹出 4，4，4，4）

以下是我当时在牛客网回答时从《JavaScript 高级程序设计》书中抄的：

> 这是由于作用域链的这种配置机制引出的一个副作用，即闭包只能取得包含函数中任何变量的最后一个值。闭包所保存的是整个变量对象，而不是某个特殊的变量。

这里的闭包函数`elements[i].onclick=function(){alert(i);}`的作用域链中保存着闭包的活动对象（这里为空）和全局变量对象（主要是 i）,所以，它们引用的是同一个变量 i；当点击完成后，变量 i=4,也就是每个内部函数 i 的值都是 4；

可以通过创建另一个匿名函数强制让闭包的行为符合预期：

```javascript
window.onload = function() {
  var elements = document.getElementsByTagName("li");
  var length = elements.length;
  for (var i = 0; i < length; i++) {
    elements[i].onclick = (function(num) {
      return function() {
        alert(num);
      };
    })(i);
  }
};
```

在调用匿名函数时，我们传入变量 i，由于参数是按值传递的，所以就会将变量 i 的当前值复制给参数 num。而这个匿名函数内部，又创建并 alert 了一个访问 num 的闭包。这样，每一次点击都有 num 变量的一个副本，因此可以返回各自不同的数值。

## 设置 Cookie 总结

```javascript
// 收藏功能
function addFavorite() {
  var title = "意法半导体STM32/STM8技术社区 - 提供最新的ST资讯和技术交流";
  var URL = "http://www.stmcu.org.cn/";
  // IE10
  if (document.all) {
    window.external.addFavorite(URL, title);
  } else {
    alert("手动 Ctrl+D 可以收藏我们的网站哦");
  }
}

// 设置cookie，同一域名都可获取
function setCookie(name, value, exdays) {
  var exdays = exdays || 1024;
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  document.cookie =
    name + "=" + escape(value) + ";path=/;expires=" + d.toGMTString();
}
// 读取cookies，判断是否存在设置的name
function getCookie(name) {
  var name = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  var user = getCookie("msgCookie");
  var width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  if (width >= 1080) {
    if (user != "") {
      msgHide();
    } else {
      msgShow();
    }
  }
}

// 关闭时设置cookie
function closeModal() {
  msgHide();
  setCookie("msgCookie", "msgCookie");
}
function msgHide() {
  document.getElementById("newsTipsModal").style.display = "none";
}
function msgShow() {
  document.getElementById("newsTipsModal").style.display = "block";
}

// init
checkCookie();
```

## 实现文字的无缝滚动、间歇性向上翻滚

> 文字向上滚动分为：无缝滚动、间歇性滚动

### 间歇性滚动

#### 使用 jQuery 的 `animate`

一般情况下，向上翻滚一行内容，即一个`<li></li>`，但是如果是一行有多个`li`标签，要使用常见的插件就会出现问题了...

所以自己改吧改吧：

```javascript
(function($) {
  $.fn.myScroll = function(options) {
    var init = {
      items: 1, //一行有几项内容
      speed: 3000, //滚动速度
      moveHeight: 22 // 行高
    };

    var intId = [];
    var opts = $.extend({}, init, options);

    function moveUp(obj) {
      obj.animate(
        {
          marginTop: "-" + opts.moveHeight + "px"
        },
        1000,
        function() {
          var $this = $(this);
          $this
            .find("li")
            .slice(0, opts.items)
            .appendTo($this);
          $this.css("margin-top", 0);
        }
      );
    }

    this.each(function(i) {
      var sh = opts.moveHeight,
        speed = opts.speed,
        items = opts.items,
        $this = $(this);

      intId[i] = setInterval(timerEvent, speed);

      $this.hover(
        function() {
          clearInterval(intId[i]);
        },
        function() {
          intId[i] = setInterval(timerEvent, speed);
        }
      );
      var len = $this.find("li").length;
      if (len > items && len <= items * 2) {
        $this.html($this.html() + $this.html());
      }
      function timerEvent() {
        var len = $this.find("li").length;
        if (len > items && len <= items * 2) {
          len /= 2;
        }
        if (len <= items) {
          clearInterval(intId[i]);
        } else {
          moveUp($this, sh);
        }
      }
    });
  };
})(jQuery);
$("#scrollLists").myScroll({
  items: 3,
  speed: 3000,
  moveHeight: 22
});
```

以下的都是单行内容翻滚，搬过来记录下：

#### 使用 JavaScript

```javascript
function Scroll() {}
Scroll.prototype.upScroll = function(dom, _h, interval) {
  var dom = document.getElementById(dom);
  var timer = setTimeout(function() {
    var _field = dom.children[0];
    _field.style.marginTop = _h;
    clearTimeout(timer);
  }, 1000);
  setInterval(function() {
    var _field = dom.children[0];
    _field.style.marginTop = "0px";
    dom.appendChild(_field);
    var _field = dom.children[0];
    _field.style.marginTop = _h;
  }, interval);
};
var myScroll = new Scroll();
```

用法：

```javascript
/*
 * demo 父容器(ul)的id
 * -36px 子元素li的高度
 * 3000  滚动间隔时间
 * 每次滚动持续时间可到css文件中修改
 * （找不到原文了-.-）
 */
myScroll.upScroll("demo", "-36px", 3000);
```

### 无缝滚动

下载地址：[简单的 jQuery 无缝向上滚动效果](http://www.jq22.com/jquery-info6631)

```javascript
(function($) {
  $.fn.myScroll = function(options) {
    //默认配置
    var defaults = {
      speed: 40, //滚动速度,值越大速度越慢
      rowHeight: 24 //每行的高度
    };

    var opts = $.extend({}, defaults, options),
      intId = [];

    function marquee(obj, step) {
      obj.find("ul").animate(
        {
          marginTop: "-=1"
        },
        0,
        function() {
          var s = Math.abs(parseInt($(this).css("margin-top")));
          if (s >= step) {
            $(this)
              .find("li")
              .slice(0, 1)
              .appendTo($(this));
            $(this).css("margin-top", 0);
          }
        }
      );
    }

    this.each(function(i) {
      var sh = opts["rowHeight"],
        speed = opts["speed"],
        _this = $(this);
      intId[i] = setInterval(function() {
        if (_this.find("ul").height() <= _this.height()) {
          clearInterval(intId[i]);
        } else {
          marquee(_this, sh);
        }
      }, speed);

      _this.hover(
        function() {
          clearInterval(intId[i]);
        },
        function() {
          intId[i] = setInterval(function() {
            if (_this.find("ul").height() <= _this.height()) {
              clearInterval(intId[i]);
            } else {
              marquee(_this, sh);
            }
          }, speed);
        }
      );
    });
  };
})(jQuery);

$(function() {
  $(".myscroll").myScroll({
    speed: 40, //数值越大，速度越慢
    rowHeight: 26 //li的高度
  });
});
```

## 九宫格抽奖

九宫格抽奖记录：

```JavaScript
  // 九宫格抽奖
  var click=false;
  var luck={

    index: 0,	//当前转动到哪个位置，起点位置
    count: 0,	//总共有多少个位置
    timer: 0,	//setTimeout的ID，用clearTimeout清除
    speed: 30,	//初始转动速度
    times: 0,	//转动次数
    cycle: 70,	//转动基本次数：即至少需要转动多少次再进入抽奖环节
    prize: -1,	//中奖位置

    init:function(id){
      if ($("#"+id).find(".luck-unit").length>0) {
        $luck = $("#"+id);
        $units = $luck.find(".luck-unit");
        this.obj = $luck;
        this.count = $units.length;
        // $luck.find(".luck-unit-"+this.index).addClass("active");
      };
    },
    roll:function(){
      var index = this.index;
      var count = this.count;
      var luck = this.obj;
      $(luck).find(".luck-unit-"+index).removeClass("active");
      index += 1;
      if (index>count-1) {
        index = 0;
      };
      $(luck).find(".luck-unit-"+index).addClass("active");
      this.index=index;
      return false;
    },
    stop:function(index){
      this.prize=index;
      return false;
    }
  };

  function roll(which){
    luck.times += 1;
    luck.roll();

    if (luck.times > luck.cycle+10 && luck.prize==luck.index) {
      var title = '';
      var content = '';
      var desc = '';
      var prize = '';
      // 最终停下来的位置
      // 初始化
      clearTimeout(luck.timer);
      luck.prize=-1;
      luck.times=0;
      click=false;

      switch(which) {
        case 0:
          prize = '小米鼠标';
          break;
        case 1:
          prize = '固态硬盘';
          break;
        case 2:
          prize = '乐扣保温杯';
          break;
        case 3:
          prize = '京东券';
          break;
        case 4:
          prize = '谢谢参与';
          break;
        case 5:
          prize = '万用表';
          break;
        case 6:
          prize = '摩尔吧课程折扣券';
          break;
        case 7:
          prize = '小米耳机';
          break;
      }

      if(which == 4) {
        title = '谢谢参与';
        content = '再接再厉'
        desc = '请查看活动详情，获取更多抽奖资格';
      } else {
        title = '恭喜您';
        content = '获得 <span class="blue">'+ prize +'</span>';
        if(which == 6) {
          desc = '请至您的”个人中心“查收';
        } else {
          desc = '奖品将于活动结束后统一发送';
        }
      }
      // 展示中奖状态
      setTimeout(function() {
        modalShow(title,content,desc);
      }, 800);
    } else {
      if (luck.times<luck.cycle) {
        luck.speed -= 10;
      } else if (luck.times==luck.cycle) {
        // 最终中奖位置的索引
        luck.prize = which;
      } else {
        if (luck.times > luck.cycle+10 && ((luck.prize==0 && luck.index==7) || luck.prize==luck.index+1)) {
          luck.speed += 110;
        } else {
          luck.speed += 20;
        }
      }

      if (luck.speed<40) {
        luck.speed=40;
      }

      luck.timer = setTimeout(function() {
        roll(which);
      },luck.speed);
    }
    return false;
  }

  $(function() {

    // Lottery init
    luck.init('luckArea');

    $("#startBtn").click(function(){
      if(click) {
        return false;
      }else{
        click=true;
        luck.speed=100;
        $.get("http://www.moore8.com/campaign/lotteryAct", function (data) {
          var data = $.parseJSON(data);
          console.log('data:', data);
          if(data.code == 1) {
            var which = data.type;
            // 调取抽奖并传值
            roll(which);
          } else {
            if(data.msg == '请先登录！') {
              loginFunc('course_gift');
            } else {
              var desc = '请查看活动详情，获取更多抽奖资格';
              modalShow('对不起', data.msg, desc);
            }
            click = false;
          }
        });
        return false;
      }
    });
  })

  function modalShow(title, body, desc) {
    var title = title || '温馨提示';
    var body = body || '';
    var desc = desc || '';
    $('#mTitle').html(title);
    $('#mBody').html(body);
    $('#mDesc').html(desc);
    $('#myModal').modal('show');
  }

  function loginFunc(id) {
    var href = window.location.href;
    var id = id ? "%23" + id : '';
    window.location.href = "/login/?referer=" + href + id;
  }
```

## 自定义单选框、复选框样式

开发过程中，为了兼容 IE 低版本浏览器，我们重写单选框、复选框等的样式，就需要借助 js 来实现。

### Javascript

```javascript
// 重写多选框,单选框样式
(function($) {
  $.fn.hcheckbox = function(options) {
    $(":checkbox+label", this)
      .each(function() {
        $(this).addClass("disabled");
        if (
          $(this)
            .prev()
            .is(":disabled") == false
        ) {
          if (
            $(this)
              .prev()
              .is(":checked")
          )
            $(this).addClass("checked");
        } else {
          $(this).addClass("disabled");
          return false;
        }
      })
      .click(function(event) {
        var ischeckbox = $(this)
          .prev()
          .is(":checked");
        if (!ischeckbox) {
          $(this).addClass("checked");
          $(this).prev().checked = true;
        } else {
          $(this).removeClass("checked");
          $(this).prev().checked = false;
        }
        event.stopPropagation();
      })
      .prev()
      .hide();
  };
  $.fn.hradio = function(options) {
    var self = this;
    return $(":radio+label", this)
      .each(function() {
        $(this).addClass("hRadio");
        if (
          $(this)
            .prev()
            .is("checked")
        )
          $(this).addClass("hRadio-Checked");
      })
      .click(function(event) {
        $(this)
          .parent()
          .siblings()
          .find(":radio+label")
          .removeClass("hRadio-Checked");
        if (
          !$(this)
            .prev()
            .is(":checked")
        ) {
          $(this).addClass("hRadio-Checked");
          $(this).prev()[0].checked = true;
        }
        event.stopPropagation();
      })
      .prev()
      .hide();
  };
})(jQuery);

$(function() {
  $(".checkbox").hcheckbox();
  $(".radio-wper").hradio();
});
```

### Style

```css
.checkbox input,
.radio-wper input {
  display: none;
}
.checkbox label,
.radio-wper label {
  padding-left: 22px;
  position: relative;
}
.checkbox .disabled:before,
.checkbox .checked:before,
.radio-wper .hRadio:before,
.radio-wper .hRadio-Checked:before {
  content: "";
  display: inline-block;
  width: 14px;
  height: 14px;
  position: absolute;
  top: 3px;
  left: 0;
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.checkbox .disabled:before {
  background-image: url("../../images/activities/adi2018/check-01.png");
}
.checkbox .checked:before {
  background-image: url("../../images/activities/adi2018/check-02.png");
}
.radio-wper .hRadio:before {
  background-image: url("../../images/activities/adi2018/radio-01.png");
}
.radio-wper .hRadio-Checked:before {
  background-image: url("../../images/activities/adi2018/radio-02.png");
}
```

## 活动之整点秒杀功能优化

```javascript
var starttime1 = "2018/11/14 14:00",
  endtime1 = "2018/11/15 14:00",
  starttime7 = "2018/11/19 14:00",
  endtime7 = "2018/11/20 14:00",
  // 中 5~8 组（省略）

  // 下 9~12 组（省略）

  starttime22 = "2018/11/29 14:00",
  endtime22 = "2018/11/30 14:00",
  starttime23 = "2018/12/14 14:00",
  endtime23 = "2018/12/15 14:00";
/**
 * 获取 整点秒杀状态
 */
var getShopStatus = function() {
  var statuShop = [];
  $.ajax({
    url: "",
    dataType: "json",
    cache: false,
    async: false,
    type: "GET",
    success: function(data) {
      var arr8 = data.data.eight;
      // 整点秒杀状态
      if (!arr8) {
        arr8 = [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false
        ];
      }
      var d1over = arr8[0],
        d2over = arr8[1],
        d3over = arr8[2],
        d4over = arr8[3],
        d5over = arr8[4],
        d6over = arr8[5],
        d7over = arr8[6],
        d8over = arr8[7],
        d9over = arr8[8],
        d10over = arr8[9],
        d11over = arr8[10],
        d12over = arr8[11];

      statuShop = [
        d1over,
        d1over,
        d2over,
        d2over,
        d3over,
        d3over,
        d4over,
        d5over,
        d5over,
        d6over,
        d6over,
        d7over,
        d7over,
        d8over,
        d8over,
        d9over,
        d9over,
        d10over,
        d10over,
        d11over,
        d11over,
        d12over,
        d12over
      ];

      return statuShop;
    },
    error: function(error) {
      // console.log('商城接口报错---');
      // console.log(error);
    }
  });
  return statuShop;
};
var shopStatusArr = getShopStatus();
/**
 * 时间状态函数
 */
function timeStatus(start, end) {
  var status = "load",
    nowTime = parseFloat(new Date().getTime()),
    startTime = parseFloat(new Date(start).getTime()),
    endTime = parseFloat(new Date(end).getTime()),
    lastStartTime = parseFloat(startTime - nowTime),
    lastEndTime = parseFloat(endTime - nowTime);

  // 未开始
  if (lastStartTime > 0) {
    return (status = "load");
  } else if (lastStartTime <= 0 && lastEndTime > 0) {
    // 进行中
    return (status = "start");
  } else if (lastEndTime <= 0) {
    // 已结束
    return (status = "end");
  }
}
/**
 * 各个时间段状态切换函数
 */
function isTimeStartEvent() {
  var timer;
  var timersArr = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23
  ];
  // 判断时间状态
  $.each(timersArr, function(i, item) {
    var start = eval("starttime" + item);
    var end = eval("endtime" + item);
    var status = timeStatus(start, end);

    switchCaseEvent(item, status);
  });
}

/*
 *	秒杀时间监控：判断时间段函数
 */
function intervalStartEvent(start, end) {
  var bigTimer;
  var isClear = false;
  var status = timeStatus(start, end);
  // 时间截止，清除定时器
  if (status === "end") {
    isClear = true;
  }
  if (isClear) {
    clearTimeout(bigTimer);
  } else {
    bigTimer = setTimeout("intervalStartEvent(starttime1, endtime23);", 1000);
  }
  // 监控时间段函数
  isTimeStartEvent();
}

/**
 * 提示及button状态切换函数
 */
function switchCaseEvent(item, type) {
  item = item || 1;
  type = type || "end";

  switch (item) {
    case 1:
    case 2:
      startAndEndEvent($("#qiangbtn1"), item, type);
      break;
    case 3:
    case 4:
      startAndEndEvent($("#qiangbtn2"), item, type);
      break;
    case 5:
    case 6:
      startAndEndEvent($("#qiangbtn3"), item, type);
      break;
    case 7:
      startAndEndEvent($("#qiangbtn4"), item, type);
      break;
    case 8:
    case 9:
      startAndEndEvent($("#qiangbtn5"), item, type);
      break;
    case 10:
    case 11:
      startAndEndEvent($("#qiangbtn6"), item, type);
      break;
    case 12:
    case 13:
      startAndEndEvent($("#qiangbtn7"), item, type);
      break;
    case 14:
    case 15:
      startAndEndEvent($("#qiangbtn8"), item, type);
      break;
    case 16:
    case 17:
      startAndEndEvent($("#qiangbtn9"), item, type);
      break;
    case 18:
    case 19:
      startAndEndEvent($("#qiangbtn10"), item, type);
      break;
    case 20:
    case 21:
      startAndEndEvent($("#qiangbtn11"), item, type);
      break;
    case 22:
    case 23:
      startAndEndEvent($("#qiangbtn12"), item, type);
      break;
    default:
      break;
  }
}
/**
 * 文字状态切换函数
 */
function startAndEndEvent(obj, item, type) {
  if (!obj) return;
  if (type === "start") {
    var status = shopStatusArr[item - 1];
    if (status) {
      $("#qiang-time0" + item).text("开始秒杀");
      obj.removeClass("unclick").text("开始秒杀");
    } else {
      $("#qiang-time0" + item)
        .text("已抢光")
        .css("color", "#9b9b9b");
      obj.addClass("unclick unclick-over").text("已抢光");
    }
    return false;
  } else if (type === "end") {
    $("#qiang-time0" + item)
      .text("已抢光")
      .css("color", "#9b9b9b");
    obj.addClass("unclick unclick-time").text("已抢光");
  } else {
    $("#qiang-time0" + item).text("即将开始");
    // 两对时间段对应同一个按钮，判断本段时间是否截止，再开启另一段时间的状态
    if (obj.hasClass("unclick-time")) {
      obj.removeClass("unclick").text("即将开始");
    }
  }
}
```
