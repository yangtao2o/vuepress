# webpack 编译流程

## 前言

weback 在 web 构建工具的激烈竞争中逐渐脱引而出。 无论是编译速度、报错提示、可扩展性等都给前端开发者耳目一新的感觉。本篇文章是个人对 webpack 的一点小研究总结。

webpack 在开发者社区的反馈
类似 gulp 把自己定位为 stream building tools 一样，webpack 把自己定位为 module building system。
在 webpack 看来，所以的文件都是模块，只是处理的方式依赖不同的工具而已。

webpack 同时也把 node 的 IO 和 module system 发挥的淋漓尽致。 webpack 在配合`babel(ES6/7)`和`tsc(typescript)`等类似 DSL 语言预编译工具的时候，驾轻就熟，为开发者带来了几乎完美的体验。

- webpack 整体架构(以 webpack.config 主要部分进行划分)
- entry: 定义整个编译过程的起点
- output: 定义整个编译过程的终点
- module: 定义模块 module 的处理方式
- plugin 对编译完成后的内容进行二度加工
- resolve.alias 定义模块的别名

## webpack 的核心 module

无论你是`jsx,tsx,html,css,scss,less,png`文件，webpack 一视同仁为 module。并且每个文件`[module]`都会经过相同的编译工序 `loader==> plugin`。

关于以上这点，以如下一个简单的`webpack.config`文件为例。看下 webpack 会做什么

```js
module.exports = {
  watch: true,
  entry: "./index.js",
  devtool: "source-map",
  output: {
    path: path.resolve(process.cwd(), "dist/"),
    filename: "[name].js"
  },
  resolve: {
    alias: { jquery: "src/lib/jquery.js" }
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      _: "underscore",
      React: "react"
    }),
    new WebpackNotifierPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.less$/,
        loaders: ["style-loader", "css-loader", "less-loader"]
      },
      {
        test: /\.(png|jpg|gif|woff|woff2|ttf|eot|svg|swf)$/,
        loader: "file-loader?name=[name]_[sha512:hash:base64:7].[ext]"
      },
      {
        test: /\.html/,
        loader: "html-loader?" + JSON.stringify({ minimize: false })
      }
    ]
  }
};
```

## webpack 是如何处理如上`webpack.config`文件解析

1. 确定 webpack 编译上下文 context

默认情况下就是 node 启动的工作目录`process.cwd()`，当然也可以在配置中手动指定 context。

webpack 在确定`webpack.config`中 entry 的路径依赖时，会根据这个 context 确定每个要编译的文件(assets)的绝对路径。

2. entry 和 output 确定 webpack 的编译起点和终点

顾名思义，entry 定义 webpack 编译起点，入口模块。 对应的结果为`compolation.assets`

output 定义 webpack 编译的终点，导出目录

3. `module.loaders` 和 `module.test` 确定模块预编译处理方式

以 babel 为例，当 webpack 发现模块名称匹配 test 中的正则`/js[x]?`的时候。

它会将当前模块作为参数传入 babel 函数处理，babel([当前模块资源的引用])。

函数执行的结果将会缓存在 webpack 的 compilation 对象上，并分配唯一的 id 。

以上的这一步，非常非常关键。唯一的 id 值决定了 webpack 在最后的编译结果中，是否会存在重复代码。
而缓存在 compilation 对象上，则决定了 webpack 可以在 plugin 阶段直接拿取模块资源进行二度加工。

4. plugin 阶段贯穿于 webpack 的整个编译流程，一般用来做一些优化操作。

比如`webpack.ProvidePlugin`，它会在对编译结果再加工的操作过程中进行自定义的变量注入，当模块中碰到比如`_`这个变量的时候，webpack 将从缓存的 module 中取出 underscore 模块加载进引用`_`的文件(`compilation.assets`)。

比如 WebpackNotifierPlugin，它会在编译结果 ready 的时通知开发者，output 已经就绪。

5. `resolve.alias`的作用就是对 module 模块提供别名，并没有什么特殊的。

## 【副作用】 webpack 编译过程中的电脑卡慢

在 weback 经历以上流程的时候，查看你的内存，你会发现，内存飙升！！！

这一般都是 loader 阶段，对 DSL 进行 AST 抽象语法树分析的时候，由于大量应用递归，内存溢出的情
况也是非常常见。

output 目录不是一个渐进的编译目录，只有在最后 compilation 结果 ready 的时候，才会写入，造成开发者等待的时候，output 目录始终为空。

## 【webpack 编译对象 compilation】 webpack 将编译结果导出到 output 是怎么做到的

如上，webpack 在 plugin 结束前，将会在内存中生成一个 compilation 对象文件模块 tree。

这个阶段是 webpack 的 done 阶段: webpack 写入 output 目录的分割点。

这棵树的枝叶节点就是所有的 module[由 import 或者 require 为标志，并配备唯一 moduleId],

这棵树的主枝干就是所有的 assets，也就是我们最后需要写入到`output.path`文件夹里的文件内容。

最后，这个 compilation 对象也是所有 webpackPlugin 的处理的时候的 arguments。

## 总结

对于开发者来说，整体而言 webpack 的编译过程细节比较多，但是大体的框架还是比较直观。

里面涉及到的类似 DSL，AST 的概念及模块缓存等等，在构建工具中还是比较常见的，配合 watch 模式，debug 模式，对于开发者来说实在是一大利器。

一切文件皆为模块也和 react 的一切 dom 都可以变为 JS 一样，对前端世界带来了新的开发理念。

> 原文地址：[webpack编译流程漫谈](https://github.com/slashhuang/blog/issues/1)
