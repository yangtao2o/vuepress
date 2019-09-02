# MacOS如何使用 tree 生成目录结构

## Homebrew安装

[homebrew官网](https://brew.sh/)

[Homebrew介绍和使用]([https://www.jianshu.com/p/de6f1d2d37bf](https://www.jianshu.com/p/de6f1d2d37bf)
)

根据官网的方法安装
```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
比如我的：
```bash
==> This script will install:
/usr/local/bin/brew
/usr/local/share/doc/homebrew
/usr/local/share/man/man1/brew.1
/usr/local/share/zsh/site-functions/_brew
/usr/local/etc/bash_completion.d/brew
/usr/local/Homebrew

Press RETURN to continue or any other key to abort
```
一路按照提示操作即可，不出意外的话，就安装成功了:
```bash
➜  ~ brew -v
Homebrew 2.1.9
Homebrew/homebrew-core (git revision c8ff; last commit 2019-08-01)
Homebrew/homebrew-cask (git revision 04bff; last commit 2019-08-02)
```

## Tree 安装

```bash
brew install tree
```
常用命令：
```bash
# 下载
brew install tree

# 显示某个文件夹下的所有文件
tree -a

# 只显示文件夹
tree -d

# 显示项目的层级，如三级
tree -L 3  

# 过滤，如除node_modules文件
tree -I "node_modules"

# 输出
tree > tree.md

# Help
tree --help
```
最后，我的输出：`tree -I "node_modules" > tree.md`
查看 `tree.md` 的内容如下：
```md
.
├── README.md
├── dist
├── package.json
├── src
│   ├── app.scss
│   ├── font-awesome
│   │   ├── fonts
│   │   │   ├── FontAwesome.otf
│   │   │   ├── fontawesome-webfont.eot
│   │   │   ├── fontawesome-webfont.svg
│   │   │   ├── fontawesome-webfont.ttf
│   │   │   ├── fontawesome-webfont.woff
│   │   │   └── fontawesome-webfont.woff2
│   │   └── scss
│   │       ├── _animated.scss
│   │       ├── _bordered-pulled.scss
│   │       ├── _core.scss
│   │       ├── _fixed-width.scss
│   │       ├── _icons.scss
│   │       ├── _larger.scss
│   │       ├── _list.scss
│   │       ├── _mixins.scss
│   │       ├── _path.scss
│   │       ├── _rotated-flipped.scss
│   │       ├── _screen-reader.scss
│   │       ├── _stacked.scss
│   │       ├── _variables.scss
│   │       └── font-awesome.scss
│   ├── index.html
│   ├── index.js
│   ├── index.jsx
│   ├── react.png
│   └── style.css
├── tree.md
├── webpack.config.js
└── yarn.lock

5 directories, 31 files
```

## tree命令行参数
| 命令行参数 | 含义 |
| --- | --- |
| -a |显示所有文件和目录。|
| -A |使用ASNI绘图字符显示树状图而非以ASCII字符组合。|
| -C |在文件和目录清单加上色彩，便于区分各种类型。|
| -d | 显示目录名称而非内容。 |
| -D | 列出文件或目录的更改时间。 |
| -f | 在每个文件或目录之前，显示完整的相对路径名称。 |
| -F | 在末尾追加描述性字符，如 ls -F  |
| -g | 列出文件或目录的所属群组名称，没有对应的名称时，则显示群组识别码。 |
| -i | 不以阶梯状列出文件或目录名称。 |
| -I | 不显示符合范本样式的文件或目录名称。 |
| -l | 如遇到性质为符号连接的目录，直接列出该连接所指向的原始目录。 |
| -n | 不在文件和目录清单加上色彩。 |
| -N | 直接列出文件和目录名称，包括控制字符。 |
| -p | 列出权限标示。 |
| -P | 只显示符合范本样式的文件或目录名称。 |
| -q | 用"?"号取代控制字符，列出文件和目录名称。 |
| -s | 列出文件或目录大小。 |
| -t | 用文件和目录的更改时间排序。 |
| -u | 列出文件或目录的拥有者名称，没有对应的名称时，则显示用户识别码。 |
| -x | 将范围局限在现行的文件系统中，若指定目录下的某些子目录，其存放于另一个文件系统上，则将该子目录予以排除在寻找范围外。 |

## 参考资料

* [mac tree命令](https://www.cnblogs.com/ayseeing/p/4097066.html)
* [Mac使用tree生成目录结构](https://blog.csdn.net/qq673318522/article/details/53713903)

