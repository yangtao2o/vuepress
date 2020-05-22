# MacBookPro 存储空间优化

## du 命令

```bash
du -d 1 -h ./
```

- `-d` 是指定要显示的文件夹层级数，我们这里只显示第一级目录的大小
- `-h` 是以 byte，KB，MB，GB 的单位来显示，最后一个参数是目标目录路径

了解了 du 命令后，我们开始一级一级的查找：

```bash
cd /
sudo du -d 1 -h ./
```

如：

```bash
/ ❯❯❯ sudo du -d 1 -h ./
2.8G  .//usr
2.4M  .//bin
1016K .//sbin
5.4G  .//Library
 49G  .//private
  0B  .//.vol
 99G  .//Users
 33G  .//Applications
  0B  .//opt
4.5K  .//dev
504M  .//Volumes
  0B  .//cores
394G  ./
/ ❯❯❯
```

继续：

```bash
/ ❯❯❯ cd /Users/
/Users ❯❯❯ sudo du -d 1 -h ./
Password:
5.7M  .//Shared
101G  .//yangtao
 36K  .//Guest
101G  ./
```

最终在 `/Users/yangtao/Library` 下一步步查找，一般都是一些软件的缓存，比如我的是 docker 以及 Lightroom 等软件的缓存比较大。

### 清除缓存和日志相关文件

```bash
# 删除所有系统日志
sudo rm -rf /private/var/log/*

# 删除临时文件
cd /private/var/tmp/
rm -rf TM*

# 删除快速查看生成的缓存文件
sudo rm -rf /private/var/folders/*

# 清除缓存文件
sudo rm -rf ~/Library/Caches/*
```

## 资料

- [给mac硬盘瘦身--释放硬盘空间](https://blog.csdn.net/xiaowu0124/article/details/44344527)