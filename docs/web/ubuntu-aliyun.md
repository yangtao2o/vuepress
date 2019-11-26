# 关于 Ubuntu 上使用 Nginx 的问题总结

## 使用 ssh 远程登录

由于之前我远程登录过 CentOS，所以换成 Ubuntu 之后，再次远程登录

```bash
ssh root@47.101.33.81
```

就会出现如下信息：

```bash
~ ❯❯❯ ssh root@47.101.33.81
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the ECDSA key sent by the remote host is
SHA256:neXCznmpgVyF/0YSiDxOjD/8A1+4ND2D9+fZjUozbzc.
Please contact your system administrator.
Add correct host key in /Users/yangtao/.ssh/known_hosts to get rid of this message.
Offending ECDSA key in /Users/yangtao/.ssh/known_hosts:5
ECDSA host key for 47.101.33.81 has changed and you have requested strict checking.
Host key verification failed.
```

所以，我就进入目录下，删除了之前保留的信息：

```bash
~ ❯❯❯ vim /Users/yangtao/.ssh/known_hosts
```

然后，保存，再次登录，就会重新设置，也就远程登录成功。

常用命令：

```bash
# 更新源列表
apt-get update

# 安装 SSH
apt-get install openssh-server

# 查看 SSH 服务是否启动
ps -e | grep ssh

# 停止、重启
service ssh stop
service ssh start

# 查看 ip
ifconfig
```

## 在 Ubuntu 18.04 上安装和配置 Nginx

### 安装 Nginx

我习惯 fish，可以预装一下：

```bash
apt install fish

root@istaotao:~# fish
Welcome to fish, the friendly interactive shell
```

注：如果遇到权限问题，需要 `sudo`，如：`sudo apt install fish`。

Nginx 的软件包在 Ubuntu 默认软件仓库中可用。 安装非常简单，只需键入以下命令：

```bash
apt update
apt install nginx
```

检查 Nginx 服务的状态：

```bash
systemctl status nginx
```

如：

```bash
root@istaotao:~# systemctl status nginx
● nginx.service - A high performance web server and a reverse proxy se
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor
   Active: active (running) since Mon 2019-11-25 11:51:52 CST; 1min 10
     Docs: man:nginx(8)
  Process: 17879 ExecStart=/usr/sbin/nginx -g daemon on; master_proces
  Process: 17875 ExecStartPre=/usr/sbin/nginx -t -q -g daemon on; mast
 Main PID: 17880 (nginx)
    Tasks: 2 (limit: 2340)
   CGroup: /system.slice/nginx.service
           ├─17880 nginx: master process /usr/sbin/nginx -g daemon on;
           └─17881 nginx: worker process

Nov 25 11:51:52 istaotao systemd[1]: Starting A high performance web s
Nov 25 11:51:52 istaotao systemd[1]: nginx.service: Failed to parse PI
Nov 25 11:51:52 istaotao systemd[1]: Started A high performance web se
```

查看版本：

```bash
root@istaotao ~# nginx -v
nginx version: nginx/1.14.0 (Ubuntu)
```

然后 访问 公网 ip，就可以看到欢迎界面，如果长时间没有响应，说明你的服务器应该没有开启 80 端口。

参考：[阿里云 ubuntu nginx 无法访问，求解答](https://segmentfault.com/q/1010000009437407)

### 使用 systemctl 管理 Nginx 服务

您可以像任何其他 systemd 单位一样管理 Nginx 服务：

```bash
# 要停止Nginx服务，请运行：
systemctl stop nginx

# 要再次启动，请键入：
systemctl start nginx

# 重新启动Nginx服务：
systemctl restart nginx

# 在进行一些配置更改后重新加载Nginx服务：
systemctl reload nginx

# 如果你想禁用Nginx服务在启动时启动：
systemctl disable nginx

# 并重新启用它：
systemctl enable nginx

# 检查Web服务器是否在运行
systemctl status nginx
```

也可以使用 service 管理 Nginx 服务：

```bash
# 停止Nginx服务，请运行：
service nginx stop

# 要再次启动，请键入：
service nginx start

#重新启动Nginx服务：
service nginx restart

#在进行一些配置更改后重新加载Nginx服务：
service nginx reload
```

### 其他命令

获得应用程序配置文件的列表：`ufw app list`，查看状态：`ufw status`

```bash
root@istaotao ~# ufw app list
Available applications:
  Nginx Full
  Nginx HTTP
  Nginx HTTPS
  OpenSSH
```

### 熟悉重要的 Nginx 文件和目录  

nginx 服务器配置文件：

`/etc/nginx` ：Nginx 配置目录。  所有的 Nginx 配置文件都驻留在这里。

`/etc/nginx/nginx.conf` ：主要的 Nginx 配置文件。  这可以修改，以更改 Nginx 全局配置。

`/etc/nginx/sites-available/` ：可存储每个站点服务器块的目录。  除非将 Nginx 链接到`sites-enabled了sites-enabled`目录，否则 Nginx 不会使用此目录中的配置文件。  通常，所有服务器块配置都在此目录中完成，然后通过链接到其他目录启用。

`/etc/nginx/sites-enabled/` ：存储启用的每个站点服务器块的目录。  通常，这些是通过链接到 sites-available 目录中的配置文件创建的。

`/etc/nginx/snippets` ：这个目录包含可以包含在 Nginx 配置其他地方的配置片段。  可重复配置的片段可以重构为片段。

nginx 服务器日志文件：

`/var/log/nginx/access.log` ：除非 Nginx 配置为其他方式，否则每个对您的 Web 服务器的请求都会记录在此日志文件中。

`/var/log/nginx/error.log` ：任何 Nginx 错误都会记录在这个日志中。

### 设置服务器块

## hexo 部署到服务器上



## 资料

### 学习资料

- [在 Ubuntu Server 下搭建 LAMP 环境](https://www.imooc.com/learn/170) - 让你理解 LAMP 环境各个组件之间的关系与作用，并能掌握从无到有的在 Ubuntu Server 操作系统下搭建 LAMP 环境、配置虚拟主机、数据库远程维护等常见的服务器搭建维护技能
- [优雅玩转 Vim](https://www.imooc.com/learn/1049) - 本课程系统提炼 vim 的精华、通过抛砖引玉把它展现到你的面前，更能让你的工作如虎添翼、事半功倍。
- [玩转 Vim 从放弃到爱不释手](https://www.imooc.com/learn/1129) - 本课程从 vim 最基础的操作和概念开始讲起，带领大家学会使用和配置 vim，安装强大的 vim 插件，真正掌握编辑器之神 vim 的使用。
- [项目上线流程](https://www.imooc.com/learn/1004) - 主要讲解了一个项目想要发布到公网的流程，包括服务器的购买、以及域名的购买，以及需要注意的事项。
- [Linux 达人养成计划 I](https://www.imooc.com/learn/175) - 课程以 CentOS 操作系统为例，为你带来 Linux 的简介、系统安装和常用命令等内容。让您在轻松的氛围中感受到 Linux 之美。

### 参考资料

- [Nginx 使用及配置](https://www.jianshu.com/p/849343f679aa)
- [在 Ubuntu 18.04 上安装和配置 Nginx](https://www.jianshu.com/p/ac27fdb0b86a)
- [Ubuntu18.04 搭建 nginx 服务器](https://blog.csdn.net/fengfeng0328/article/details/82828224)
- [阿里云 Ubuntu 16.04 系统下安装 Nginx](https://www.pingfangushi.com/posts/35448/)
- [Linux 系统下如何查看及修改文件读写权限](https://www.cnblogs.com/CgenJ/archive/2011/07/28/2119454.html)
- [vim 基本操作](https://www.cnblogs.com/chenlogin/p/6245958.html)
- [阿里云 ubuntu nginx 无法访问，求解答](https://segmentfault.com/q/1010000009437407)
- [Hexo 个人博客部署到 CentOS 个人服务器](https://segmentfault.com/a/1190000010680022)
- [Hexo部署在阿里云服务器上](https://www.jianshu.com/p/e1ccd49b4e5d)
- [通过 Git 将 Hexo 博客部署到服务器](https://www.jianshu.com/p/e03e363713f9)
- [使用 Git Hook 自动部署 Hexo 到个人 VPS](http://www.swiftyper.com/2016/04/17/deploy-hexo-with-git-hook/)