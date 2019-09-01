# macOS下node版本管理下载新版本时中断返回Segmentation fault 11

> 前记：安装node的时候安装了最新版本，但是我需要指定某一个版本，所以安装了n模块，来进行版本切换，但是途中发生了报错：Segmentation fault：11，导致npm命令无法使用，由于使用的macOS，大家都推荐HomeBrew，于是连滚带爬地从一个坑跳到另一个坑，好疼啊...

#### n模块
* 首先 __n模块不支持Windows！！！__
* 安装：`sudo npm install -g n `
* 参考：[node版本更新的简便方法——神奇的n模块](https://blog.csdn.net/kiddd_fu/article/details/78655672)
* 版本切换：`n`，然后上下切换，圆点在哪儿就是哪个，但是问题两个或者多个都是灰色，即没有圆点，怎么办？
    * 这时，切回去使用`node -v`就会报错：`Segmentation fault: 11` ，当然，npm 直接`npm: command not found`
* 解决：`sudo n 8.1.3`


![](https://user-gold-cdn.xitu.io/2018/8/4/165046762420dadb?w=1268&h=478&f=jpeg&s=170090)

* 参考：[n模块管理node版本遇到的问题](https://blog.csdn.net/Dcatfly/article/details/75201172)
* 但是切换到8.11.3，问题依旧存在，所以删除：`sudo n rm 8.11.3`
* 卸载npm：`sudo npm uninstall npm -g`，然后去node官网重新下载`8.11.3LTS`，安装成功，但是使用`n list`，并未查看到此版本
* 于是，重新再走一遍：`sudo n 8.11.3`，成功。