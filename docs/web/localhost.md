# npm run 报错：getaddrinfo ENOTFOUND localhost


安装 Angular 的时候，启动 `ng serve --open`，报错如下：
```bash
➜  my-app git:(master) ng serve
getaddrinfo ENOTFOUND localhost
Error: getaddrinfo ENOTFOUND localhost
    at errnoException (dns.js:50:10)
    at GetAddrInfoReqWrap.onlookup [as oncomplete] (dns.js:92:26)
```

查了一下自己的hosts，原来我把默认的host给关掉了，重新启动即可：

```bash
127.0.0.1	localhost
255.255.255.255	broadcasthost
::1             localhost
```

重新 `ng serve --open`，然后：`ℹ ｢wdm｣: Compiled successfully.`
