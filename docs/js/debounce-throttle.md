# Debounce 和 Throttle

原文地址：[Debounce 和 Throttle 的原理及实现](https://www.tuicool.com/articles/YvyQRrv)

### 防抖和节流

#### 防抖
如输入框时，只在最后提交的时候校验，即：将多次高频率操作优化为只在最后一次执行

思路：每次触发事件时，清除之前的定时器方法

```javascript
function debounce(fn, wait, immediate) {
  let timer = null;
  console.log('in');
  return function() {
    let context = this;
    let args = arguments;

    if(immediate && !timer) {
      fn.apply(context, args)
    }

    if(timer) clearTimeout(timer)
    timer = setTimeout(() => {
      console.log('timer')
      fn.apply(context, args)
    }, wait);

  }
}
function test() {
  console.log('被触发了');
}
document.getElementById('btn').onfocus = debounce(test, 1000)
```

#### 节流
降低频率，每隔一段时间后执行一次，将高频率操作优化为低频率操作，如滚动条事件，resize事件

思路：每次触发事件时都判断当前是否有等待执行的延时函数
```javascript
function throtte(fn, wait, immediate) {
  let timer = null
  let callNow = immediate
  return function() {
    let args = arguments
    let context = this

    if(callNow) {
      fn.apply(context, args)
      callNow = false
    }
    if(!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args)
        timer = null
      }, wait);
    }

  }
}

window.addEventListener('resize', throtte(test, 1000))
```