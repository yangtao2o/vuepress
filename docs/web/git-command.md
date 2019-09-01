# Git 常用命令练习

> 使用 `git bash` 的过程中，除了常用的那几条，其它的总需要查找手册，索性跟着大牛总结的文章走一遍吧

## 前言
* Workspace: 工作区
* Index / Stage: 暂存区
* Repository: 仓库区（或本地仓库）
* Remote: 远程仓库
  
![image](https://user-images.githubusercontent.com/19526072/49999253-4c690980-ffd1-11e8-892a-bff60b374d12.png)

### 新建
```bash
# 在当前目录 git-command 下新建 Git 代码库，（会生成 .git 文件）
git init

# 新建目录 git-command 并将其初始化为 Git 代码库
git init git-command

# 从线上获取一个完整的项目代码
git clone https://github.com/yangtao2o/git-command.git
```

### 配置
Git的设置文件为 `.gitconfig` ，它可以在用户主目录下（全局配置），也可以在项目目录下（项目配置）。

```bash
# 显示配置信息
git config --list

# 修改
git config --global

git config --global user.name "yangtao"
git config --global user.email "xxx@.qq.com"
```

### 增加、删除文件
```bash
# 添加指定文件到暂存区
git add index.html

# 添加指定目录到暂存区，包括子目录
git add assets

# 添加当前目录的所有文件到暂存区
git add .

# 添加每个变化前，都会要求确认
# 对于同一个文件的多处变化，可以实现分次提交
git add -p

# 删除工作区文件，并将这次删除加入暂存区
git rm [file1] [file2] ...

# 停止追踪指定文件，但该文件会保留在工作区
git rm --cached [file]

# 修改文件名，并放入暂存区
git mv index.html index-new.html
```

### 代码提交
```bash
# 暂存区提交到仓库区 ( -m (msg) )
git commit -m "My first commit"

# 指定文件提交
git commit [file1] [file2] ... -m [message]

# 提交工作区自上次 commit 之后的变化，直接到仓库区
git commit -a

# 提交时显示所有的 diff 信息
git commit -v

# 使用一次新的 commit ，提交上一次提交
# 如果代码没有任何变化，则用来改写上一次 commit 的提交信息
git commit --amend -m "new commit"

# 重做上一次 commit ，并包括指定文件的新变化
git commit --amend [file1] [file2] ...

```

### 分支
```bash
# 列出所有的本地分支
git branch

# 列出所有的远程分支 ( -r (remotes))
git branch -r

# 列出所有的本地分支和远程分支
git branch -a

# 新建一个分支，但依然停留在当前分支
git branch primary

# 新建，并切换至 该分支
git checkout -b primary-yt

# 新建，指向指定 commit
git branch [branch] [commitID]

# 新建，与指定的远程分支建立追踪关系
git branch --track [branch] [remote-branch]

# 切换到指定分支，并更新工作区
git checkout [branch-name]

# 切换到上一个分支
git checkout -

# 建立追踪关系，在现有分支与指定的远程分支之间
git branch --set-upstream [branch] [remote-branch]

# 合并指定分支 master-yt 到当前分支 master
git merge master-yt

# 选择一个 commit，合并进当前分支
git cherry-pick [commitid]

# 删除分支
git branch -d master-ytt

# 删除远程分支
git push origin --delete [branch-name]
git branch -dr [remote/branch]
```
### 标签

```bash
# 列出标签
git tag
```
### 查看信息

```bash 
# 显示有变更的文件
git status

# 显示当前分支的版本历史
git log
```
## 参考目录
* [Git 常用命令](http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html)
* [Git教程 - 廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)

[练习 Demo](https://github.com/yangtao2o/git-command)