# 学习 Git 原理详解与实操指南之基础篇

## 版本控制系统

版本控制器有不同的类型，最为常见的就是：

- 分布式版本控制系统 - GIT
- 中央版本控制系统 - SVN

## 初始化 Git

使用 `git init` 命令初始化一个仓库，并查看仓库目录：

```bash
~/D/g/git-command ❯❯❯ mkdir test && cd test
~/D/g/g/test ❯❯❯ git init
已初始化空的 Git 仓库于 /Users/yangtao/Documents/github/git-command/test/.git/
~/D/g/g/test ❯❯❯ ls -la
total 0
drwxr-xr-x  3 yangtao  staff   96 11 23 14:47 .
drwxr-xr-x  9 yangtao  staff  288 11 23 14:47 ..
drwxr-xr-x  9 yangtao  staff  288 11 23 14:47 .git
~/D/g/g/test ❯❯❯ cd .git
~/D/g/g/t/.git ❯❯❯ ls -la
total 24
drwxr-xr-x   9 yangtao  staff  288 11 23 14:47 .
drwxr-xr-x   3 yangtao  staff   96 11 23 14:47 ..
-rw-r--r--   1 yangtao  staff   23 11 23 14:47 HEAD
-rw-r--r--   1 yangtao  staff  137 11 23 14:47 config
-rw-r--r--   1 yangtao  staff   73 11 23 14:47 description
drwxr-xr-x  13 yangtao  staff  416 11 23 14:47 hooks
drwxr-xr-x   3 yangtao  staff   96 11 23 14:47 info
drwxr-xr-x   4 yangtao  staff  128 11 23 14:47 objects
drwxr-xr-x   4 yangtao  staff  128 11 23 14:47 refs
~/D/g/g/t/.git ❯❯❯
```

- HEAD 文件指示目前被检出的分支
- branches 新版本已经废弃无须理会
- description 用来显示对仓库的描述信息
- config 文件包含项目特有的配置选项
- info 目录包含一个全局性排除文件
- hooks 目录包含客户端或服务端的钩子脚本
- index 文件保存暂存区信息
- objects 目录存储所有数据内容
- refs 目录存储分支的提交对象的指针

查看配置信息：

```bash
~/D/g/g/t/.git ❯❯❯ git config user.name
yangtao
~/D/g/g/t/.git ❯❯❯ git config user.email
istaotao@aliyun.com
```

设置配置信息：

```bash
git config --global user.name "yangtao"
git config --global user.email "istaotao@aliyun.com"
```

修改配置信息：

```bash
git config --global --replace-all user.name "yangming"
```

或者文件修改：

```bash
vim ~/.gitconfig
```

比如：

```config
[user]
        name = yangtao
        email = istaotao@aliyun.com
```

检查配置：`git config --list`，如：

```bash
user.name=yangtao
user.email=istaotao@aliyun.com
```

## 拉取远端代码

### https

git clone 版本库地址 [本地文件夹名称]

```bash
~/D/g/git-command ❯❯❯ git clone https://github.com/yangtao2o/git-command.git git-clone-test
正克隆到 'git-clone-test'...
remote: Enumerating objects: 6, done.
remote: Counting objects: 100% (6/6), done.
remote: Compressing objects: 100% (6/6), done.
remote: Total 28 (delta 1), reused 0 (delta 0), pack-reused 22
展开对象中: 100% (28/28), 完成.
```

git pull - 更新代码

记住密码

```bash
# 临时，默认 15 分钟
git config –-global credential.helper cache

# 临时，设置 1 小时
git config credential.helper 'cache –timeout=3600'

# 永久
git config --global credential.helper store
```

### SSH

现在我们再来看看 SSH 方式，相比 HTTP(S) 来说更加安全，因为使用的是非对称加密，采用公钥与私钥的方式，不过相对来说配置起来会麻烦一些；好处是一次配置之后，后续不需要每次都进行认证，也更加安全。

```bash
~/D/g/git-command ❯❯❯ git clone git@github.com:yangtao2o/git-command.git ssh-test
正克隆到 'ssh-test'...
remote: Enumerating objects: 6, done.
remote: Counting objects: 100% (6/6), done.
remote: Compressing objects: 100% (6/6), done.
remote: Total 28 (delta 1), reused 0 (delta 0), pack-reused 22
接收对象中: 100% (28/28), 7.65 KiB | 3.82 MiB/s, 完成.
处理 delta 中: 100% (5/5), 完成.
```

生成公钥密钥：

```bash
ssh-keygen
```

查看公钥：

```bash
cat ~/.ssh/id_rsa.pub
```

然后，将公钥放到远程 git 仓库里。

小结：

- Git 远程交互通常同时支持 HTTP(S) 和 SSH 协议访问
- HTTP(S) 协议交互默认每次需要输入账号密码，但可以通过缓存认证方式处理
- SSH 协议需要将生成的公钥放到 Git 服务器当中去，配置之后 Git 会自动通过 ssh 协议进行鉴权，不需要通过账号加密码

## 提交代码

同步远端代码：`git pull`

检查改动文件: `git status`

```bash
~/D/g/git-command ❯❯❯ git status
位于分支 master
您的分支落后 'origin/master' 共 2 个提交，并且可以快进。
  （使用 "git pull" 来更新您的本地分支）

尚未暂存以备提交的变更：
  （使用 "git add <文件>..." 更新要提交的内容）
  （使用 "git checkout -- <文件>..." 丢弃工作区的改动）

        修改：     README.md

未跟踪的文件:
  （使用 "git add <文件>..." 以包含要提交的内容）

        git-clone-test/
        ssh-test/

修改尚未加入提交（使用 "git add" 和/或 "git commit -a"）
```

状态：

- Untracked: 未跟踪，一般为新增文件，此文件在文件夹中，但并没有加入到 git 库，不参与版本控制。通过 git add 状态变为 Staged.
- Modified: 文件已修改，仅仅是修改，并没有进行其他的操作
- deleted： 文件已删除，本地删除，服务器上还没有删除
- renamed：文件名称被改变

撤销更改

```bash
git checkout README.md
```

添加文件到缓存

- 提交指定文件或目录至缓存的格式：`git add README.md`
- 提交全部文件或目录至缓存的格式：`git add .`

```bash
~/D/g/git-command ❯❯❯ git add README.md
~/D/g/git-command ❯❯❯ git status
位于分支 master
您的分支落后 'origin/master' 共 2 个提交，并且可以快进。
  （使用 "git pull" 来更新您的本地分支）

要提交的变更：
  （使用 "git reset HEAD <文件>..." 以取消暂存）

        修改：     README.md

未跟踪的文件:
  （使用 "git add <文件>..." 以包含要提交的内容）

        .gitignore
        git-clone-test/
        ssh-test/

~/D/g/git-command ❯❯❯ git add .
~/D/g/git-command ❯❯❯ git status
位于分支 master
您的分支落后 'origin/master' 共 2 个提交，并且可以快进。
  （使用 "git pull" 来更新您的本地分支）

要提交的变更：
  （使用 "git reset HEAD <文件>..." 以取消暂存）

        新文件：   .gitignore
        修改：     README.md
        新文件：   git-clone-test
        新文件：   ssh-test
```

提交代码：`git commit . -m '这是备注信息'`

```bash
~/D/g/git-command ❯❯❯ git commit . -m "docs: new file"
[master 63d7ac1] docs: new file
 2 files changed, 92 insertions(+), 9 deletions(-)
 create mode 100644 .gitignore
~/D/g/git-command ❯❯❯ git status
位于分支 master
您的分支和 'origin/master' 出现了偏离，
并且分别有 1 和 2 处不同的提交。
  （使用 "git pull" 来合并远程分支）

无文件要提交，干净的工作区
~/D/g/git-command ❯❯❯ 
```

推送代码：`git push`

```bash
~/D/g/git-command ❯❯❯ git push
枚举对象: 11, 完成.
对象计数中: 100% (11/11), 完成.
使用 8 个线程进行压缩
压缩对象中: 100% (7/7), 完成.
写入对象中: 100% (7/7), 1.57 KiB | 1.57 MiB/s, 完成.
总共 7 （差异 3），复用 0 （差异 0）
remote: Resolving deltas: 100% (3/3), completed with 1 local object.
To https://github.com/yangtao2o/git-command.git
   670ed03..a0bd8c4  master -> master
```

小结：

- 要将代码推送到服务器通常会经历五个步骤：更新、检查，提交 暂存，正式提交，推送
- git 提交代码可以选择全部提交或者部分提交，全部提交可以用 `.` 替代，部分提交则输入目录名或文件名
- 提交代码之后还需要使用 `git push` 命令把代码推送到远程服务器

## 查看代码修改