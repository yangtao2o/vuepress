# 将 Hexo 和 Vuepress 静态资源推送至 Ubuntu

> 由于已经开通的 Hexo 和 Vuepress 博客，都挂在 github 的免费服务器上，加载速度不堪忍睹，所以打算挂在阿里云的服务器上，过程可以用举步维艰来形容。

## 使用 ssh 远程登录

- Ubuntu 常用命令：

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

使用 ssh 登录：

```bash
ssh root@47.101.33.81
```

由于之前我远程登录过 CentOS，所以换成 Ubuntu 之后，再次远程登录，就会出现如下无法连接信息：

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

所以，根据提示，我就进入目录下，删除了之前保留的信息：

```bash
~ ❯❯❯ vim /Users/yangtao/.ssh/known_hosts
```

然后，保存，再次登录，就会重新设置，也就远程登录成功。

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

查看版本：

```bash
root@istaotao ~# nginx -v
nginx version: nginx/1.14.0 (Ubuntu)
```

然后访问公网 ip，或者域名，就可以看到欢迎界面，如果长时间没有响应，说明你的服务器应该没有开启 80 端口。

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

### Nginx 文件和目录说明  

nginx 服务器配置文件：

- **/etc/nginx**

Nginx 配置目录。所有的 Nginx 配置文件都驻留在这里。

- **/etc/nginx/nginx.conf**

主要的 Nginx 配置文件。  这可以修改，以更改 Nginx 全局配置。

- **/etc/nginx/sites-available/**

可存储每个站点服务器块的目录。  除非将 Nginx 链接到`sites-enabled了sites-enabled`目录，否则 Nginx 不会使用此目录中的配置文件。  通常，所有服务器块配置都在此目录中完成，然后通过链接到其他目录启用。

- **/etc/nginx/sites-enabled/**

存储启用的每个站点服务器块的目录。  通常，这些是通过链接到 sites-available 目录中的配置文件创建的。

- **/etc/nginx/snippets**

这个目录包含可以包含在 Nginx 配置其他地方的配置片段。  可重复配置的片段可以重构为片段。

nginx 服务器日志文件：

- **/var/log/nginx/access.log**

除非 Nginx 配置为其他方式，否则每个对您的 Web 服务器的请求都会记录在此日志文件中。

- **/var/log/nginx/error.log**

任何 Nginx 错误都会记录在这个日志中。

### 虚拟站点的设置

Ubuntu 18.04 上的 Nginx 默认启用了一个服务器模块，该模块被配置为在`/var/www/html`目录下提供文档内容。

接下来，我们模拟一个虚拟网点。

创建`example.com`目录，使用`-p`标志创建任何必需的父目录：

```bash
sudo mkdir -p /var/www/example.com/html
```

使用\$USER 环境变量分配目录的所有权：

```bash
sudo chown -R $USER:$USER /var/www/example.com/html/
```

修改目录的权限：

```bash
sudo chmod -R 755 /var/www/example.com/html/
```

创建一个 index.html 页面：

```bash
/var/www/example.com/html/index.html
```

如：

```html
<html>
  <head>
    <title>Welcome to Example.com!</title>
  </head>
  <body>
    <h1>Success! The example.com server block is working!</h1>
  </body>
</html>
```

在不直接修改默认配置文件的情况下，可以在`/etc/nginx/sites-available/`上创建一个新文件`example.com`，并将如下内容复制到`example.com`：

```s
server {
        listen 80;
        listen [::]:80;

        root /var/www/example.com/html;
        index index.html index.htm index.nginx-debian.html;

        server_name example.com www.example.com;

        location / {
                try_files $uri $uri/ =404;
        }
}
```

操作方法：

```bash
cd /etc/nginx/sites-available/
touch example.com
vim example.com
```

常规复制完毕之后，按`:`之后，接着按`wq`，vim 就可以保存退出了。

创建一个软链接，连到默认启动`sites-enabled`目录来启用该文件，该目录是 Nginx 在启动过程中读取的：

```bash
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
```

现在启用两个服务器模块并将其配置为基于`listen`和`server_name`指令响应请求：

**example.com** ：将响应`example.com`和`www.example.com`请求。

**default** ：将响应端口`80`上与其他两个块不匹配的任何请求。

为了避免添加额外的服务器名称可能导致的哈希桶内存问题，有必要调整`/etc/nginx/nginx.conf`文件中的单个值。

修改配置文件：

```bash
sudo vim /etc/nginx/nginx.conf
```

找到`server_names_hash_bucket_size 64`指令并删除 # 符号以取消注释该行：

接下来，测试以确保您的 Nginx 文件中没有语法错误：

```bash
sudo nginx -t

nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

重启 nginx：

```bash
sudo systemctl restart nginx
```

然后，需要在本地 hosts 文件添加对应 host：

```text
# ip 换成自己的阿里云 ip
47.101.33.81 www.example.com
```

这样，不出意外的话，就可以通过 `http://example.com`来访问刚刚设置的内容，而访问`http://47.101.33.81`，依旧是默认的内容。

## hexo 部署到服务器上

整个流程就是本地将 \*.md 渲染成静态文件，然后 Git 推送到服务器的 repository,服务器再通过 git-hooks 同步网站根目录。

![hexo的架构](https://ae01.alicdn.com/kf/H1aadf5b0baac42aaa45b753358768293V.jpg)

### 服务器配置

主要使用 `git hooks` 来实现自动化部署。以下步骤为其他博客完整内容，但是我是直接在 root 下操作的，所以关于权限等问题，是直接略过的，等后期熟悉了再加上。

#### 第一步

安装 git：

```bash
sudo apt-get install git
```

#### 第二步

创建一个 git 用户，用来运行 git 服务：

```bash
sudo adduser git
```

虽说现在的仓库只有我们自己在使用，新建一个 git 用户显得不是很有必要，但是为了安全起见，还是建议使用单独的 git 用户来专门运行 git 服务。

#### 第三步

创建证书登录，把自己电脑的公钥，也就是 `~/.ssh/id_rsa.pub` 文件里的内容添加到服务器的 `/home/git/.ssh/authorized_keys` 文件中，添加公钥之后可以防止每次 push 都输入密码。

如果你之前没有生成过公钥，则可能就没有 id_rsa.pub 文件，具体的生成方法，可以[Generating a new SSH key and adding it to the ssh-agent](https://help.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)。

#### 第四步

初始化 Git 仓库，我是将其放在 `/var/repo/hexo.git` 目录下的

```bash
sudo mkdir /var/repo
cd /var/repo
sudo git init --bare hexo.git
```

使用 `--bare` 参数，Git 就会创建一个裸仓库，裸仓库没有工作区，我们不会在裸仓库上进行操作，它只为共享而存在。

#### 第五步

配置 git hooks，关于 hooks 的详情内容可以[自定义 Git - Git 钩子](https://git-scm.com/book/zh/v2/%E8%87%AA%E5%AE%9A%E4%B9%89-Git-Git-%E9%92%A9%E5%AD%90)。

我们这里要使用的是 `post-receive` 的 hook，这个 hook 会在整个 git 操作过程完结以后被运行。

在 `hexo.git/hooks` 目录下新建一个 `post-receive` 文件：

```bash
cd /var/repo/blog.git/hooks
vim post-receive
```

在 `post-receive` 文件中写入如下内容：

```sh
#!/bin/sh
git --work-tree=/var/www/hexo --git-dir=/var/repo/hexo.git checkout -f
```

注意，`/var/www/hexo` 要换成你自己的部署目录，一般可能都是 `/var/www/html`。上面那句 git 命令可以在我们每次 push 完之后，把部署目录更新到博客的最新生成状态。这样便可以完成达到自动部署的目的了。

不要忘记设置这个文件的可执行权限：

```bash
chmod +x post-receive
```

#### 第六步

改变 hexo.git 目录的拥有者为 git 用户：

```bash
sudo chown -R git:git blog.git
```

#### 第七步

禁用 git 用户的 shell 登录权限。

出于安全考虑，我们要让 git 用户不能通过 shell 登录。可以编辑 `/etc/passwd` 来实现，在 `/etc/passwd` 中找到类似下面的一行：

```bash
git:x:1001:1001:,,,:/home/git:/bin/bash
```

将其改为：

```bash
git:x:1001:1001:,,,:/home/git:/usr/bin/git-shell
```

这样 git 用户可以通过 ssh 正常使用 git，但是无法登录 sehll。

#### 第八步

修改 nginx 配置文件：

```bash
vim /etc/nginx/sites-enabled/default

# 修改默认目录为自己的目录
root /var/www/hexo/;

# 保存退出
Esc
:wq
```

至此，服务器端的配置就完成了。

### 本地配置

修改 Hexo 博客站点配置文件 \_config.yml, 如下修改:

```yml
deploy:
  type: git
  repo: root@47.101.33.81:/var/repo/hexo.git
  branch: master
```

repo 格式：用户名@域名或 IP 地址:/var/repo/hexo.git，如：

```code
# root 域名
root@istaotao.com:/var/repo/hexo.git

# root ip
root@47.101.33.81:/var/repo/hexo.git

# git 域名
git@istaotao.com:/var/repo/hexo.git
```

然后就是 hexo 的常规操作了：

```bash
# 清楚缓存
hexo clean

# 构建并部署
hexo g -d
```

可以多部署几次，然后去 `/var/www/hexo` 看是否已经有对应内容，如果推送完之后，提示已无更新内容可提交，可以改写东西，重新构建部署等步骤，多试几次。

到这里，基本完成 Hexo 推送到 ubuntu 的任务, 通过服务器 IP 或者域名应该就可以看到博客的内容了。

## vuepress 部署到服务器上

有了部署 Hexo 的经验，再部署 vuepress，就简单多了。

我的想法是：hexo 做首页，vuepress 做子页内容，比如：`http:yangtao.site/vuepress`。所以，建立 git hooks 就应该可以了。

### 服务端配置

第一步：修改 nginx 配置文件：

```bash
vim /etc/nginx/sites-enabled/default
```

找到 `location / {`，然后在其后面，输入一段：

```s
# 找到如下
location / {
    # First attempt to serve request as file, then
    # as directory, then fall back to displaying a 404.
    try_files $uri $uri/ =404;
}

# 输入如下
location /vuepress {
    root /var/www/;
    try_files $uri $uri/ =404;
}
```

然后在`var/www`下新建 vuepress 目录：

```bash
cd /var/www/
mkdir vuepress
```

这样，对用要访问的目录已经创建好了。

注：以上操作都是在 root 权限下操作的，如果是其他用户，记得该加 sudo 的加 sudo，该修改文件权限就修改。

第二步：建立 git hooks

如同建立 `hexo.git` 一样：

初始化：

```bash
cd /var/repo
git init --bare vuepress.git
```

建立 `post-receive`:

```bash
cd vuepress.git/hooks/
touch post-receive
```

并写入：

```sh
#!/bin/sh
git --work-tree=/var/www/vuepress --git-dir=/var/repo/vuepress.git checkout -f
```

设置这个文件的可执行权限：

```bash
chmod +x post-receive
```

好了，服务端的配置差不多就这些。

### 本地配置

具体的可以参考[官方部署方法](https://vuepress.vuejs.org/zh/guide/deploy.html#github-pages)。

第一步：根目录下创建执行脚本`deploy.sh`:

```sh
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

git push -f root@47.101.33.81:/var/repo/vuepress.git master
cd -
```

第二步：修改`config.js`的基准 url

```js
const config = {
  base: "/vuepress/" // 基准 URL
};
```

这样，访问 `http://47.101.33.81/vuepress`，就可以正常访问,这里非常关键，如果是根目录，直接去掉 vuepress，重新构建部署。

第三步：部署线上

```bash
sh deploy.sh

# 开始自动构建、部署...
# 输入服务端密码...
# ...
# success
```

注意：可以多部署几次，访问资源如有问题，估计是第二步出问题了，可以排查哪里出错了。

好了，截止到现在，访问`http://47.101.33.81`，访问的是 hexo 的博客资源，而访问`http://47.101.33.81/vuepress`，访问的是 vuepress 的博客资源。

主要是 nginx 的配置文件，以及 git hooks 的建立，还有本地部署文件的建设，一个简单的个人网站算是颤颤巍巍地站起来了。

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
- [简明 VIM 练级攻略](https://www.cnblogs.com/chengjiawei/p/9339951.html)
- [阿里云 ubuntu nginx 无法访问，求解答](https://segmentfault.com/q/1010000009437407)
- [Hexo 个人博客部署到 CentOS 个人服务器](https://segmentfault.com/a/1190000010680022)
- [Hexo 部署在阿里云服务器上](https://www.jianshu.com/p/e1ccd49b4e5d)
- [通过 Git 将 Hexo 博客部署到服务器](https://www.jianshu.com/p/e03e363713f9)
- [使用 Git Hook 自动部署 Hexo 到个人 VPS](http://www.swiftyper.com/2016/04/17/deploy-hexo-with-git-hook/)
- [超详细动手搭建一个 Vuepress 站点及开启 PWA 与自动部署](https://yq.aliyun.com/articles/603815)
