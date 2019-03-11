<template>
  <div id="vcomments"></div>
</template>

<script>
export default {
  name: 'Valine',
  mounted: function(){
    // require window 
    const Valine = require('valine');
    if (typeof window !== 'undefined') {
      this.window = window
      window.AV = require('leancloud-storage')
    }
     
    new Valine({
      el: '#vcomments' ,
      appId: 'BXbRzdRWKuKAzooJu0Gin1mO-gzGzoHsz',// your appId
      appKey: 'WEzG2CMtkcbmqrmqMkgIGIRL', // your appKey
      notify: false, 
      verify: false, 
      avatar: 'monsterid',   // mm monsterid
      placeholder: '说点什么吧~' 
    });
  },
}
</script>