# Github报错fatal unable to access No such file or directory

之前有安装过github旧版，一直正常，后来更新了新版，但是`git pull`的时候如有如下报错：

```console
fatal: unable to access 'https://github.com/eefocus/deploy.git/': schannel: failed to open CA file 'C:/Users/Administrator/AppData/Local/GitHubDesktop/app-1.2.3/resources/app/git/mingw64/bin/curl-ca-bundle.crt': No such file or directory
```

* 找到`C:\ProgramData\Git\config`，打开，修改`sslCAinfo`（路径得看自己文件相对应的位置）如下：

```config
[core]
	symlinks = true
	autocrlf = true
	fscache = true
[color]
	diff = auto
	status = auto
	branch = auto
	interactive = true
[pack]
[help]
	format = html
[https]
	sslCAinfo = C:/Users/Administrator/AppData/Local/GitHubDesktop/app-1.2.6/resources/app/git/mingw64/ssl/certs/curl-ca-bundle.crt
[sendemail]
	smtpserver = /bin/msmtp.exe

[diff "astextplain"]
	textconv = astextplain
[rebase]
	autosquash = true

```
* __重点提示__：默认的是`[http]`，如果有必要你需要改成`[https]`
* 如果找不到`C:\ProgramData`文件（我的是win10），在查看下将隐藏的项目打个勾
![打开隐藏文件](https://user-images.githubusercontent.com/19526072/43298424-81590c1a-9188-11e8-8968-666bdd839ced.png)

> 参考：[GitHub Desktop报错fatal: unable to access 'https://github.com……: schannel: failed to open CA file 'C:/Users……bundle.crt': No such file or directory的解决办法](http://www.mamicode.com/info-detail-2368065.html)