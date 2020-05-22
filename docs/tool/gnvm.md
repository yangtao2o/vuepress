# Windows下Node.js 多版本管理器-Gnvm

我们在平时的项目开发中，经常需要指定 Node 的版本，所有版本控制管理，就很有必要，需要哪个切哪个。

#### MacOS
主要有 `n` 和 `nvm`,具体可以自行百度，查之，用之

```bash
sudo npm install -g n

# 直接输入 n ,然后回车，可上下选择版本

# 安装最新版/稳定版
n latest/stable

# 删除
n rm 8.11.3
```

#### 主要安利 Windows下的 gnvm
官方地址：[GNVM - Node.js 多版本管理器](https://github.com/kenshin/gnvm)

##### 下载
```bash
# 使用 git bash，其它下载方式如 go、curl等可查看官方文档
git clone git@github.com:Kenshin/gnvm-bin.git
```

##### 安装
将解压后的 `gnvm.exe` 保存到 `node.js` 所在的文件夹下，如：
```bash
C:\Program Files\nodejs
```

##### 验证
管理员身份进入 `cmd`，输入 `gnvm version`
```bash
C:\WINDOWS\system32>gnvm version
Current version 0.2.0 64 bit.
Copyright (C) 2014-2016 Kenshin Wang <kenshin@ksria.com>
See https://github.com/kenshin/gnvm for more information.
```
##### 配置
```bash
C:\WINDOWS\system32>gnvm config
Waring: config file C:\Program Files\nodejs\\.gnvmrc is not exist.
Notice: Config file C:\Program Files\nodejs\\.gnvmrc create success.
Notice: config file path C:\Program Files\nodejs\\.gnvmrc
gnvm config registry is http://nodejs.org/dist/
gnvm config noderoot is C:\Program Files\nodejs\
gnvm config globalversion is 10.14.2-x86
gnvm config latestversion is unknown
```
##### 查询需要下载的 node 版本
```bash
C:\WINDOWS\system32>gnvm search 8.*.*
Search Node.js version rules [8.*.*] from http://nodejs.org/dist/index.json, please wait.
+--------------------------------------------------+
| No.   date         node ver    exec      npm ver |
+--------------------------------------------------+
  1     2018-12-18   8.14.1      x86 x64   6.4.1
  2     2018-11-27   8.14.0      x86 x64   6.4.1
  3     2018-11-20   8.13.0      x86 x64   6.4.1
  4     2018-09-10   8.12.0      x86 x64   6.4.1
  5     2018-08-15   8.11.4      x86 x64   5.6.0
  6     2018-06-12   8.11.3      x86 x64   5.6.0
  7     2018-05-15   8.11.2      x86 x64   5.6.0
  8     2018-03-29   8.11.1      x86 x64   5.6.0
  9     2018-03-28   8.11.0      x86 x64   5.6.0
  10    2018-03-06   8.10.0      x86 x64   5.6.0
  11    2018-01-02   8.9.4       x86 x64   5.6.0
  12    2017-12-07   8.9.3       x86 x64   5.5.1
  13    2017-12-05   8.9.2       x86 x64   5.5.1
  14    2017-11-07   8.9.1       x86 x64   5.5.1
  15    2017-10-31   8.9.0       x86 x64   5.5.1
  16    2017-10-25   8.8.1       x86 x64   5.4.2
  17    2017-10-24   8.8.0       x86 x64   5.4.2
  18    2017-10-11   8.7.0       x86 x64   5.4.2
  19    2017-09-26   8.6.0       x86 x64   5.3.0
  20    2017-09-12   8.5.0       x86 x64   5.3.0
  21    2017-08-15   8.4.0       x86 x64   5.3.0
  22    2017-08-08   8.3.0       x86 x64   5.3.0
  23    2017-07-20   8.2.1       x86 x64   5.3.0
  24    2017-07-19   8.2.0       x86 x64   5.3.0
  25    2017-07-11   8.1.4       x86 x64   5.0.3
  26    2017-06-29   8.1.3       x86 x64   5.0.3
  27    2017-06-15   8.1.2       x86 x64   5.0.3
  28    2017-06-13   8.1.1       x86 x64   5.0.3
  29    2017-06-08   8.1.0       x86 x64   5.0.3
  30    2017-05-30   8.0.0       x86 x64   5.0.0
+--------------------------------------------------+

```
##### 下载帮助文档
```bash
C:\WINDOWS\system32>gnvm help node-version
Show and fix [global] [latest] Node.js version e.g. :
gnvm node-version            :Show Node.js global and latest version, and fix it.
gnvm node-version latest     :Show Node.js latest version, and fix it.
gnvm node-version global     :Show Node.js global version, and fix it.
```
##### 下载node
```bash
C:\WINDOWS\system32>gnvm install 8.11.3 --global
```
##### 查看已下载的版本列表
```bash
C:\WINDOWS\system32>gnvm ls
Notice: gnvm.exe root is C:\Program Files\nodejs\\
v10.14.2 -- x86
v8.11.2
v8.11.3 -- global
```
##### 使用指定版本
```bash
C:\WINDOWS\system32>gnvm use 8.11.3
Set success, global Node.js version is 8.11.3.
```
##### 查看当前Node版本
```bash
C:\WINDOWS\system32>node -v
v8.11.3
```

基本上可以解决版本切换问题，详情可查询[官方文档](http://ksria.com/gnvm/)