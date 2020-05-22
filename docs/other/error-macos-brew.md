# macOS安装homebrew报错 LibreSSL SSL_read SSL_ERROR_SYSCALL errno 54

> LibreSSL SSL_read: SSL_ERROR_SYSCALL, errno 54

#### # 安装

```bash

curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"
```

#### # 报错

```bash

==> Tapping homebrew/core
Cloning into '/usr/local/Homebrew/Library/Taps/homebrew/homebrew-core'...
fatal: unable to access 'https://github.com/Homebrew/homebrew-core/': LibreSSL SSL_read: SSL_ERROR_SYSCALL, errno 54
Error: Failure while executing; `git clone https://github.com/Homebrew/homebrew-core /usr/local/Homebrew/Library/Taps/homebrew/homebrew-core --depth=1` exited with 128.
Error: Failure while executing; `/usr/local/bin/brew tap homebrew/core` exited with 1.
```
#### # 解决：
* 执行下面这句命令，更换为中科院的镜像：

```bash

git clone git://mirrors.ustc.edu.cn/homebrew-core.git/ /usr/local/Homebrew/Library/Taps/homebrew/homebrew-core --depth=1
```

* 把homebrew-core的镜像地址也设为中科院的国内镜像

```bash

cd "$(brew --repo)" 

git remote set-url origin https://mirrors.ustc.edu.cn/brew.git

cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core" 

git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-core.git
```

* 更新

```bash
brew update
```
* 使用

```bash
brew install node
```
### 参考
* 报错解决：[macOS High Sierra10.13.3安装homebrew报错LibreSSL SSL_read: SSL_ERROR_SYSCALL, errno 54解决方法](https://blog.csdn.net/qq_35624642/article/details/79682979)
* [Mac安装，简单实用，卸载homebrew详细教程](https://blog.csdn.net/qq_41234116/article/details/79366454) 