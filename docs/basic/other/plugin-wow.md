# 页面滑动时的动画插件 WOW.js

> 当初次加载页面的时候，需要一些动画渐入，并且当滑动到当前内容时也会出现动画，之后就恢复正常，所以就用到了 `WOW.js`。

比如：[RT-Thread](https://www.rt-thread.org/)

再比如设计师必备：[sketchapp](https://www.sketchapp.com/)

## WOW.js

文档：[WOW](https://www.delac.io/wow/index.html)

## Animate.css

模拟：[Animate](https://daneden.github.io/animate.css/)

`animate.css` 包含了一组炫酷、有趣、跨浏览器的动画，可以在你的项目中直接使用。

## CDN

```html
<link
  href="https://cdn.bootcss.com/animate.css/3.7.0/animate.min.css"
  rel="stylesheet"
/>
<script src="https://cdn.bootcss.com/wow/1.1.2/wow.min.js"></script>
```

## 用法

文档：[Setup WOW.js](https://www.delac.io/wow/docs.html)

```html
<div class="wow bounceInUp"  data-wow-duration="2s" data-wow-delay="5s">
    Content to Reveal Here
</div>

<script>
    new WOW().init();
</script>
```

ps：初始加载页面的时候，很有可能会出现内容再动画渲染，所以直接设置：

```css
.wow {
  visibility: hidden;
}
```
