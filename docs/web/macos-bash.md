# Mac 终端简易学习总结

#### 一、目录基本操作
##### 1. `pwd` --- 获取当前所在路径
```bash

yangtaodeMacBook-Pro:test yangtao$ pwd
/Users/yangtao/Desktop/文件创建/test
```
##### 2. `ls` --- 列出当前目录下的所有文件
* `ls -l` --- 用长格式列出来
* `ls -a` --- 列出文件（包括隐藏的文件）
* `ls -al` --- 以长格式列出文件（包括隐藏的文件）

##### 3. `cd` --- 目录间的切换
可以使用`tab`键补全目录名称，将文件拖入终端，可以显示该文件的目录
* `cd` --- (无参数)返回home目录
* `cd ~` --- 返回home目录，可以使用`cd ~/Music`快速到达该目录，使用`cd ~Guest/`进入Guest用户的home目录
* `cd -` --- 返回上一次操作的目录，可与当前目录进行切换
* `cd ..` --- 返回上一层目录，`..`表示上一层目录，而`.`表示当前目录，如`./Music`，表示当前目录下的Music文件

##### 4. `mkdir 文件名` --- （make dir）新建文件夹
##### 5. `rmdir 文件名` --- （remove dir）删除文件夹
如果文件夹内不为空，则无法用rmdir删除文件夹

##### 6. `rm 文件名` --- （remove dir）删除文件
注意：用`rm`删除掉的文件是无法从回收站中找回的！而且不能使用rm来删除文件夹

##### 7. `mv 原文件 目标目录/新文件名 ` --- 移动
把文件从一个地方移到另一个地方，但是当没有给出另外一个目录时，移动的现象就是为其更改了名字

##### 8. `cp 带目录文件 目标目录` --- 复制粘贴

##### 9. `man 命令` --- 查看使用手册

##### 10. `touch` --- 创建文件

##### 11. `cat` --- 查看文件内容 
#### 二、历史操作
##### 1. `向上（向下）箭头`
查看上一个（下一个）命令，可以一直向前查看之前执行过的命令

##### 2. `!l` --- 找出与你最近一次的l开头的命令，并执行

##### 3. `history` --- 查看之前执行过命令的历史记录

#### 三、进程管理操作
##### 1. `ps` --- 查看当前终端运行的程序
```bash

yangtaodeMacBook-Pro:test yangtao$ ps
  PID TTY           TIME CMD
19083 ttys000    0:00.40 -bash
```

##### 2. `ps ax` ---列出这台电脑正在运行的所有程序
```bash

20008   ??  S      0:00.12 /System/Library/Frameworks/QuickLook.framework/Resources/quicklookd.app/Contents/MacOS/quicklookd
19082 s000  Ss     0:00.02 login -pf yangtao
19083 s000  S      0:00.40 -bash
20079 s000  R+     0:00.00 ps ax
yangtaodeMacBook-Pro:test yangtao$ 
```

##### 3. `top` --- 显示这台计算机上有哪些进程，显示内存、CPU、负载等
```bash

PID    COMMAND      %CPU TIME     #TH   #WQ  #PORT MEM    PURG   CMPRS  PGRP  PPID  STATE    BOOSTS           %CPU_ME %CPU_OTHRS UID  FAULTS    COW
20088  top          4.1  00:00.99 1/1   0    23    6724K  0B     0B     20088 19083 running  *0[1]            0.00000 0.00000    0    7185+     105
20087  AGSService   0.0  00:00.03 2     1    36    1716K  0B     0B     20087 1     sleeping *0[1]            0.00000 0.00000    0    3076      
```

##### 4. `kill [PID]` --- 结束指定进程ID的进程
__具体做法：__ 先使用top命令查看想要结束进程的PID，然后使用命令`kill [PID]`

__Tips：__ 如果遇到无法杀掉的进程，输入命令`sudo kill -9 [PID]` (伪装超级管理员，强迫杀掉该进程)，接着输入自己用户的密码（前提是自己这个用户具有sudo的资格）

#### 四、万能的grep操作
##### 1. `grep 800 log.txt` --- 从log.txt中找出800位置的数据
##### 2. `grep -n 800 log.txt` --- 从log.txt中找出800位置的数据,并在前面加上行号
##### 3. `grep (-n) Hello * (是否加上行号)` --- 从当前目录下的所有文件中找出出现过Hello的文件
##### 4. `ls /usr/bin | grep ls` --- 查看/usr/bin目录下面带ls的目录
##### 5. `ls /usr/bin | grep ls | wc` --- 计算出单词的数量
```bash

yangtaodeMacBook-Pro:test yangtao$ ls /usr/bin | grep ls | wc
      16      16     124
# 16行 16个单词 124个字符
```

#### 五、环境变量操作
##### 1. `set | grep PATH` --- 查看环境变量
```bash

yangtaodeMacBook-Pro:~ yangtao$ set | grep PATH
PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

```
##### 2. `set | grep PATH` --- 将其他文件夹路径（本机用户下面的bin目录）添加到PATH
这样做只是一次性的，也就是说在当前终端，是可以直接生效的，但是当你关闭后，重新打开终端，这个操作是不被保存的。

在`/etc/profile`这个文件是任何人打开终端都会执行的，是系统级的profile。

如果我们想自定义自己的profile，可以在自己的家目录下新建文件命名为：`.profile`，这个文件会在你打开终端时自动执行。

我们将刚刚的命令2输入其中，然后保存退出（vim下使用`:wq`）
这样的话，在我们刚刚已经登录的终端里面它还是不起作用的，假如你希望它可以立刻生效，你可以使用`source`命令。

##### 3. `source` --- 例如：`source .profile`
使Shell读入指定的Shell程序文件并依次执行文件中的所有语句，通常用于重新执行刚修改的初始化文件，使之立即生效，而不必注销并重新登录

#### 六、网络配置操作
##### 1. `ifconfig` --- 列出本机所有的网络设备以及其上面的配置，主要指的是ip地址和mac地址
我的连的是en5，它的状态时active（最后一行），原文是en4

```bash

en5: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
	ether ac:de:48:00:11:22 
	inet6 fe80::aede:48ff:fe00:1122%en5 prefixlen 64 scopeid 0x7 
	nd6 options=201<PERFORMNUD,DAD>
	media: autoselect
	status: active
```
_其他用法：_

* `ifconfig en4 down/up` --- 关闭（或打开）某个网络接口，比如en4,一般需要管理员权限，所以需要在前面加sudo命令

* `sudo ifconfig en4 add 10.10.10.12 netmask 255.255.255.0` --- 给en4加入别的网段
* `sudo ifconfig en4 delete 10.10.10.12` --- 给en4删除指定网段

```bash
# 临时修改MAC地址
ifconfig en0 down // 关闭网卡设备（这里假设是en0）
ifconfig en0 hw ether [MAC地址] // 修改MAC地址
ifconfig en0 up // 重启网卡

# 临时修改内网ip地址
ifconfig en0 down
ifconfig en0 192.168.169.245 netmask 255.255.255.0
```

##### 2. `ping` --- 检测网络是否是连通状态
##### 3. `netstat` --- 显示各种网络相关信息
_其他用法：_

* `netstat -l` --- 列出本机进行监听的端口

* `netstat -lt` --- 只列出tcp的连接，同理在l后面跟上u的话，将会列出各种udp的监听端口

* `netstat -s` --- 查看统计数据

* `netstat -p` --- 列出进程信息，你可以了解是哪一个程序在哪一个端口上做些什么事情

* `netstat -pc` --- 会显示出实时更新的进程信息

* `netstat -r` --- 查看路由表
* `netstat -i` --- 查看接口信息


> 详情参考
[Mac终端学习系列](https://www.jianshu.com/p/0e43268f01db)