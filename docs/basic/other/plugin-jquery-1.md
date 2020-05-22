# jQuery插件写法小结之重写轮播图功能

> 最近在维护老网站的时候，发现一些jQuery库的使用有些臃肿，并且大部分自定义的js文件很容易污染全局变量，所以想着重写下，虽然jQuery的辉煌时代已经过去了，但是他的思想，依旧灿烂（滚去维护去）

## 先举个栗子

```js
;(function($) {
  var methods = {
    init: function(options) {
      // 可自定义扩展项
      options = $.extend(
        true,
        {}, 
        $.fn.myPlugin.defaults,
        options
      );
      console.log('options', options, this)
  
      return this;
    },
    getName: function() {
      console.log('Name is ', $.fn.myPlugin.defaults.name, '.')
    },
    getAge: function() {
      console.log('Age is ', $.fn.myPlugin.defaults.age, '.')
    },
    show: function(){
      return this.each(function(){
        this.style.display == "none" && (this.style.display = '')
        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
          this.style.display = defaultDisplay(this.nodeName)
      })
    },
    hide: function() {
      return this.css("display", "none")
    }
  };

  // 命名空间最好只有一个
  $.fn.myPlugin = function(method) {

    // 方法调用，可满足三种情况：1. method, 2. init, 3. error
    if(methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));  //将具有length属性的对象转成数组
    } else if(typeof method === 'object' || !method) {
      // 如果没有参数或者参数
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method' + method + 'does not exist on jQuery.myPlugin.');
    }
  }

  $.fn.myPlugin.defaults =  {
    'name': 'zhangsan',
    'age': '20'
  };
})(jQuery)

/* --- 测试 --- */

// 初始化init
$('#testPara').myPlugin()

// 修改参数
$('#testPara').myPlugin({
    'name': 'wuwang',
    'age': '27'
})

// 调取方法
$('#testPara').myPlugin('hide')
$('#testPara').myPlugin('show')

```

简单易懂，但是五脏俱全，接下来简单说明：

#### 搞定复杂参数列表

首先，我们一般传参如下：

```js
function foo(a1, a2, a3, a4) { }

foo(1, 2, 3, 4)
```

那如果不传参呐？

```js
foo(1, null, 3, 4)
```
就需要如上使用 null 来站位，参数多了，保证你晕。

所以，我们使用 **可选哈希参数（options hash）**，如：
```js
foo(1, null, null, 4)
// 改成
foo(1, {
    a4: 4
})
```
接着，我们使用 jQuery 的 $.extend() 工具函数合并可选参数，并设置默认值：
```js
function foo (a1, options) {
    var settings = $.extend({
        a2: value2,
        a3: value3,
        a4: value4
    }, options || {} );
}
```
最后，就有了栗子中形态：

```js
var settings = $.extend(
    true,  // 是否为深拷贝
    {},    // 使用源元素属性来扩展目标对象
    $.fn.myPlugin.defaults,  // 默认的一个对象，将属性添加到 target（即{}） 目标对象中
    options  // 多个源后会覆盖前面同名的属性
);
```

这样，就再也不会纠结参数的不传或者多个占位传参，挺好。

实际操作下：先看一个多个参数的：

```js
$('#btn').myPlugin({
  'mynewname': 'lisi',
  'mynewage': 22
})
// 打印settings： {name: "zhangsan", age: "20", mynewname: "lisi", mynewage: 22}
```

再看一个：
```js
$('#btn').myPlugin({
  'name': 'lisi',
  'mynewage': 22
})

// {name: "lisi", age: "20", mynewage: 22}
```

一看就懂，有则覆盖，无则添加，完美。

#### 统一命名空间

由于是jQuery插件，都挂载在 jQuery 对象下，所以恰当命名空间的插件尽可能不与其他插件冲突，甚至是 jQuery 的核心库方法。

比如：
```js
(function($) {
    var defaults = {}  // 定义默认项
    var methods = {}  // 定义方法
    $.fn.myPlugin = function(method) {}  // 定义 myPlugin 命名空间并赋值一个匿名函数
}(jQuery)
```

#### 允许公开访问默认设置
为了更加的定制化，我们需要暴露默认的设置，这样我们就可以修改设置了。

首先修改 defaults 变量，为了暴露给外部世界，需要把它赋值给 $.fn 属性。并且为了统一命名空间原则，需要把它作为 myPlugin 的属性，如：
```js
$.fn.myPlugin.defaults =  {
    'name': 'zhangsan',
    'age': '20'
};
```
接着，当使用默认值来合并参数选项时，在项目中只出现一次，即在 init() 方法里，如：
```js
var methods = {
    init: function(options) {
      // 可自定义扩展项
      options = $.extend(
        true,
        {}, 
        $.fn.myPlugin.defaults,
        options
      );
    }
}
```

这样，当我们在浏览器里直接测试：
```js
// 获取
$.fn.myPlugin.defaults.name   // zhangsan

// 修改
$.fn.myPlugin.defaults.name = 'wangwu'
// "wangwu"
```

#### 维护链式调用性

使用 ` return this` ，可以维护链式调用性。

#### Array.prototype.slice.call()
`Array.prototype.slice.call(arguments)`能将具有length属性的对象转成数组 （`arguments.toArray().slice()`）

```js
var a={length:2,0:'first',1:'second'};
Array.prototype.slice.call(a);   //Array [ "first", "second" ]
```

## 再举个栗子
项目中经常使用轮播图，我们就在前人的基础上，模仿一下吧（你就说是抄的不就行了麽）：

```js
;
(function ($) {
    function showPhoto(options, index) {
        var $photoElement = $(options.photoElement);
        if (!$photoElement.is(':animated')) {
          $photoElement.animate({
            opacity: 0.5
          }, 0).attr(
            'src',
            options.transformer(options.$thumbnails[index].src)
          ).animate({
            opacity: 1
          }, 800);
          options.current = index;
        }
    }
   var methods = {
      init: function (options) {
         options = $.extend(
            true, {},
            $.fn.slidePhoto.defaults,
            options, {
               current: 0, // 初始值为0
               $thumbnails: this.filter('img'), //选出所有的图片
               delay: options.delay >= 1000 ? options.delay : 1000,
            }
         );

         // 点击图片，切换对应大图
         options.$thumbnails.click(function () {
            showPhoto(options, options.$thumbnails.index(this));
         });

         // 显示下一张
         $(options.nextControl + ', ' + options.photoElement).click(function () {
            var index = (options.current + 1) % options.$thumbnails.length; // 取模

            showPhoto(options, index);
         });

         // 显示上一张
         $(options.previousControl).click(function () {
            var index = options.current === 0 ? options.$thumbnails.length - 1 : options.current - 1;

            showPhoto(options, index);
         });

         // 显示第一张
         $(options.firstControl).click(function () {
            showPhoto(options, 0);
         }).triggerHandler('click'); // 主要是初始时触发，触发被选元素上指定的事件，返回事件处理函数的返回值

         // 显示最后一张
         $(options.lastControl).click(function () {
            showPhoto(options, options.$thumbnails.length - 1);
         })

         // 自动播放
         var tick;

         function autoPlay() {
            tick = window.setInterval(
               function () {
                  $(options.nextControl).triggerHandler('click')
               }, options.delay);
         }
         // 鼠标移入移出状态
         function mouserStatus(obj) {
            $(obj).mouseenter(function () {
               if (tick) {
                  window.clearInterval(tick);
               }
            }).mouseleave(autoPlay);
         }

         if (options.autoPlayControl) {
            autoPlay();
         }

         // 鼠标滑动暂停、播放
         mouserStatus(options.photoElement);
         mouserStatus(options.$thumbnails);

         return this;
      }
   };

   $.fn.slidePhoto = function (method) {
      if (methods[method]) {
         return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if ($.type(method) === 'object') {
         return methods.init.apply(this, arguments);
      } else {
         $.error('Method ' + method + ' does not exist on jQuery.slidePhoto');
      }
   };

   $.fn.slidePhoto.defaults = {
      photoElement: 'img.photomatic-photo', // 大图显示
      transformer: function (name) {
         return name.replace('thumbnail', 'photo'); // 将'thumbnail' 替换为 'photo'，即最终返回大图的src属性值
      },
      nextControl: null, // 下一张
      previousControl: null, // 前一张
      firstControl: null, // 第一张
      lastControl: null, // 最后一张
      autoPlayControl: false,
      delay: 3000 // 延时
   };

})(jQuery)

```

用法：
```js
$('#thumbnails-pane img').slidePhoto({
    photoElement: '#photo-display',
    previousControl: '#previous-button',
    nextControl: '#next-button',
    firstControl: '#first-button',
    lastControl: '#last-button',
    autoPlayControl: true,
    delay: 3000
 });
```

参考：
* 《jQuery实战 第三版》