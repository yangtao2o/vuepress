# Git之本地拉取Github代码、修改远程URL

![](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533488265900&di=91f78407d4ffda11e55202ceafda93c4&imgtype=jpg&src=http%3A%2F%2Fimg3.imgtn.bdimg.com%2Fit%2Fu%3D2417199588%2C1851489715%26fm%3D214%26gp%3D0.jpg)


```bash

    Workspace：工作区
    Index / Stage：暂存区
    Repository：仓库区（或本地仓库）
    Remote：远程仓库

```
#### 详细介绍如何使用git
* 博客推荐：
    * [如何使用Git上传项目代码到github](https://juejin.im/entry/5b66e89951882563522b78ae/) 
    * [Git远程操作详解---阮一峰](https://juejin.im/entry/5b66ec5c51882536e875be76/)
    * [常用 Git 命令清单---阮一峰](https://juejin.im/entry/5667d39d00b0ee7fa8c9f99f)
    
#### 本地拉取仓库代码 --- clone

```bash
git clone https://github.com/yangtao2o/yangtao2o.github.io.git
```

#### 修改远程URL --- remote

```bash
git remote -v    # 查看远程服务器地址和仓库名称
git remote show origin   # 查看远程服务器仓库状态
git remote add origin https://github.com/yangtao2o/yangtao2o.github.io.git  # 添加远程仓库地址
git remote set-url origin https://github.com/..io.git   # 设置远程仓库地址(用于修改远程仓库地址)
git remote rename <old name> <new name>  # 修改远程主机的名称
git remote rm <repository>   # 删除远程仓库
```

#### 代码回滚
* 如果是在workspace，未git push，使用以下命令会清空工作目录中所有未提交的内容
```bash
git reset --hard HEAD  # 全部撤销
git checkout -- hello.html  # 只恢复hello.html文件
```
* 如果已提交，使用`git revert`，使用一次新的commit，来回滚要你要回滚的位置
```bash
git revert HEAD
```

* 参考：[Git的撤消操作 - 重置, 签出 和 撤消](https://juejin.im/entry/5b6707f25188251ac22b6f0f/)
#### 使用过程中，遇到的一些问题
* `git pull`时`fatal:refusing to merge unrelated histories`
    * `git pull --allow-unrelated-histories`
    
* `origin`一般是我们自己创建的代码库，所以可以做任何的`git pull or git push`，但是如果我们引入了他人的代码库，就成了`upstream`，只能`git fetch`，通过`fork`到自己的仓库里，如同`origin`
    * 关于`fork、origin、upstream、clone`之间的关系博文推荐： [GitHub关于fork、origin、upstream、clone的藕断丝连](https://juejin.im/entry/5b66f8d5f265da0f574e0884/)

* [git submodule使用以及注意事项](https://juejin.im/entry/5b66ea75e51d45195312a173/)