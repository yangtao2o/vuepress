
# 设置Cookie总结

```javascript
 // 收藏功能
  function addFavorite() {
    var title = '意法半导体STM32/STM8技术社区 - 提供最新的ST资讯和技术交流';
    var URL = 'http://www.stmcu.org.cn/'; 
    // IE10
    if(document.all) {
      window.external.addFavorite(URL, title);
    } else {
      alert('手动 Ctrl+D 可以收藏我们的网站哦');
    }
  }

  // 设置cookie，同一域名都可获取
  function setCookie(name, value, exdays) {
    var exdays = exdays || 1024;
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + escape(value) + ";path=/;expires=" + d.toGMTString();
  }
  // 读取cookies，判断是否存在设置的name
  function getCookie(name) {
    var name = name + "=";
    var ca = document.cookie.split(';');
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
    var width = window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;
    if(width >= 1080) {
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
    setCookie("msgCookie", 'msgCookie');
  }
  function msgHide() {
    document.getElementById('newsTipsModal').style.display = 'none';
  }
  function msgShow() {
    document.getElementById('newsTipsModal').style.display = 'block';
  }

  // init
  checkCookie();

```