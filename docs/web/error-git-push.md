# 'git push 报错之 Permission to userA.git denied to userB'

报错信息：
```bash
➜  git-command git:(master) git push
remote: Permission to xxx.git denied to zguii.
fatal: unable to access 'https://github.com/xxx.git/': The requested URL returned error: 403
```
### 解决过程

#### 原因
之前我有登录过其他账号，如zguii，并进行了一系列操作，后来我要使用自己的账号的时候，就会出现如上的报错信息。

刚开始嫌麻烦，我使用客户端发布操作，正常，后来，多次使用 `git bash`，就很痛苦了，索性就改一下。 

#### 思路
既然是用户权限被占用了，而且我也不需要那个用户了，那就删除吧。

#### 过程

```bash
# 重新创建文件，暂时设置密码为空，并且会产生 `id_rsa`、`id_rsa.pub`，（有可能会产生 config ，但有可能是空文件）
ssh-keygen -t rsa -C "yangtaobanner@foxmail.com"

➜  git-command git:(master) ssh-keygen -t rsa -C "yangtaobanner@foxmail.com"
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/yangtao/.ssh/id_rsa): 
/Users/yangtao/.ssh/id_rsa already exists.
Overwrite (y/n)? y
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /Users/yangtao/.ssh/id_rsa.
Your public key has been saved in /Users/yangtao/.ssh/id_rsa.pub.
The key fingerprint is:

# 复制 `id_rsa.pub` 里的所有内容，将此粘贴到你要新建的 `SSH key`里

# 查看配置
git config --list

git config --list --global

# 测试是否可以连接
ssh -T git@github.com
Hi yangtao2o! You've successfully authenticated, but GitHub does not provide shell access.

```

设置完毕，再次 `git push`，额...依旧报错...
想到可能是缓存，好吧，清！呃呃...依然如此...

好多分钟之后，忽然想起还能访问默认账户，说明账户依然存在，笨！

然后，我就去钥匙串查看了一下 `github.com`，我去，还真是岿然不动地躺在那儿...

恶狠狠地删之！！！

然后，`git push`，输入用户、密码，熬过几秒，刷刷刷，看到了久违的 `Done`

其实，归根结底，如果Git设置里的账户是你自己的，只要删除钥匙串账户就行，我竟然走了这么久的弯路，脚很疼，哦不，脑瓜子疼！

PS：MacOS 隐藏文件开启快捷键：
```bash
command + ^ + .
```

### windows解决方法
[解决 github push failed （remote: Permission to userA/repo.git denied to userB.）](https://blog.csdn.net/klxh2009/article/details/76019742)

➜ 主要是删除之前的用户，如我的之前的账户是 `zguii`

### MacOS解决方法

[mac下配置多个git账号并进行账号切换](https://www.jianshu.com/p/6621c42ef112)

[解决git本地多ssh key的问题](https://www.jianshu.com/p/b29a3c275f68)

[多个 SSH KEY 的管理](https://www.zybuluo.com/yangfch3/note/172120)
