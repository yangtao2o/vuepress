# Webpack 相关

## 有哪些常见的 Loader

**raw-loader**：加载文件原始内容（utf-8）

**file-loader**：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件 (处理图片和字体)

**url-loader**：与 **file-loader** 类似，区别是用户可以设置一个阈值，大于阈值时返回其 publicPath，小于阈值时返回文件 base64 形式编码 (处理图片和字体)

**source-map-loader**：加载额外的 Source Map 文件，以方便断点调试

**svg-inline-loader**：将压缩后的 SVG 内容注入代码中

**image-loader**：加载并且压缩图片文件

**json-loader** 加载 JSON 文件（默认包含）

**handlebars-loader**: 将 Handlebars 模版编译成函数并返回

**babel-loader**：把 ES6 转换成 ES5

**ts-loader**: 将 TypeScript 转换成 JavaScript

**awesome-typescript-loader**：将 TypeScript 转换成 JavaScript，性能优于 **ts-loader**

**sass-loader**：将 SCSS/SASS 代码转换成 CSS

**css-loader**：加载 CSS，支持模块化、压缩、文件导入等特性

**style-loader**：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS

**postcss-loader**：扩展 CSS 语法，使用下一代 CSS，可以配合 autoprefixer 插件自动补齐 CSS3 前缀

**eslint-loader**：通过 ESLint 检查 JavaScript 代码

**tslint-loader**：通过 TSLint 检查 TypeScript 代码

**mocha-loader**：加载 Mocha 测试用例的代码

**coverjs-loader**：计算测试的覆盖率

**vue-loader**：加载 Vue.js 单文件组件

**i18n-loader**: 国际化

**cache-loader**: 可以在一些性能开销较大的 Loader 之前添加，目的是将结果缓存到磁盘里

## 有哪些常见的 Plugin

**define-plugin**：定义环境变量 (Webpack4 之后指定 mode 会自动配置)

**ignore-plugin**：忽略部分文件

**html-webpack-plugin**：简化 HTML 文件创建 (依赖于 **html-loader**)

**web-webpack-plugin**：可方便地为单页应用输出 HTML，比 **html-webpack-plugin** 好用

**uglifyjs-webpack-plugin**：不支持 ES6 压缩 (Webpack4 以前)

**terser-webpack-plugin**: 支持压缩 ES6 (Webpack4)

**webpack-parallel-uglify-plugin**: 多进程执行代码压缩，提升构建速度

**mini-css-extract-plugin**: 分离样式文件，CSS 提取为独立文件，支持按需加载 (替代**extract-text-webpack-plugin**)

**serviceworker-webpack-plugin**：为网页应用增加离线缓存功能

**clean-webpack-plugin**: 目录清理

**ModuleConcatenationPlugin**: 开启 Scope Hoisting

**speed-measure-webpack-plugin**: 可以看到每个 Loader 和 Plugin 执行耗时 (整个打包耗时、每个 Plugin 和 Loader 耗时)

**webpack-bundle-analyzer**: 可视化 Webpack 输出文件的体积 (业务组件、依赖第三方模块)

## Loader 和 Plugin 的区别

**Loader 本质就是一个函数**，在该函数中对接收到的内容进行转换，返回转换后的结果。因为 Webpack 只认识 JavaScript，所以 Loader 就成了翻译官，对其他类型的资源进行转译的预处理工作。

**Plugin 就是插件**，基于事件流框架 Tapable，插件可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

Loader 在 module.rules 中配置，作为模块的解析规则，类型为数组。每一项都是一个 Object，内部包含了 test(类型文件)、loader、options (参数)等属性。

Plugin 在 plugins 中单独配置，类型为数组，每一项是一个 Plugin 的实例，参数都通过构造函数传入。

## Webpack 构建流程

Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

- 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数

- 开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译

- 确定入口：根据配置中的 entry 找出所有的入口文件

- 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理

- 完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系

- 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会

- 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。

简单说

- 初始化：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler

- 编译：从 Entry 出发，针对每个 Module 串行调用对应的 Loader 去翻译文件的内容，再找到该 Module 依赖的 Module，递归地进行编译处理

- 输出：将编译后的 Module 组合成 Chunk，将 Chunk 转换成文件，输出到文件系统中

## 模块打包原理

Webpack 实际上为每个模块创造了一个可以导出和导入的环境，本质上并没有修改 代码的执行逻辑，代码执行顺序与模块加载顺序也完全一致。

## Webpack 的热更新原理

Webpack 的热更新又称热替换（Hot Module Replacement），缩写为 **HMR**。这个机制可以做到不用刷新浏览器而将新变更的模块替换掉旧的模块。

HMR 的核心就是**客户端从服务端拉去更新后的文件**，准确的说是 chunk diff (chunk 需要更新的部分)，实际上 WDS 与浏览器之间维护了一个 Websocket，当本地资源发生变化时，WDS 会向浏览器推送更新，并带上构建时的 hash，让客户端与上一次资源进行对比。客户端对比出差异后会向 WDS 发起 Ajax 请求来获取更改内容(文件列表、hash)，这样客户端就可以再借助这些信息继续向 WDS 发起 jsonp 请求获取该 chunk 的增量更新。

后续的部分(拿到增量更新之后如何处理？哪些状态该保留？哪些又需要更新？)由 HotModulePlugin 来完成，提供了相关 API 以供开发者针对自身场景进行处理，像 **react-hot-loader** 和 **vue-loader** 都是借助这些 API 实现 HMR。

## 文件指纹是什么？怎么用

文件指纹是打包后输出的文件名的后缀。

- **Hash**：和整个项目的构建相关，只要项目文件有修改，整个项目构建的 hash 值就会更改
- **Chunkhash**：和 Webpack 打包的 chunk 有关，不同的 entry 会生出不同的 chunkhash
- **Contenthash**：根据文件内容来定义 hash，文件内容不变，则 contenthash 不变

### JS 的文件指纹设置

设置 output 的 filename，用 chunkhash。

```js
module.exports = {
  entry: {
    app: "./scr/app.js",
    search: "./src/search.js"
  },
  output: {
    filename: "[name][chunkhash:8].js",
    path: __dirname + "/dist"
  }
};
```

### CSS 的文件指纹设置

设置 MiniCssExtractPlugin 的 filename，使用 contenthash。

```js
module.exports = {
  entry: {
    app: "./scr/app.js",
    search: "./src/search.js"
  },
  output: {
    filename: "[name][chunkhash:8].js",
    path: __dirname + "/dist"
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `[name][contenthash:8].css`
    })
  ]
};
```

## 图片的文件指纹设置

设置 **file-loader**的 name，使用 hash。

占位符名称及含义

- ext 资源后缀名
- name 文件名称
- path 文件的相对路径
- folder 文件所在的文件夹
- contenthash 文件的内容 hash，默认是 md5 生成
- hash 文件内容的 hash，默认是 md5 生成
- emoji 一个随机的指代文件内容的 emoj

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: "**file-loader**",
            options: {
              name: "img/[name][hash:8].[ext]"
            }
          }
        ]
      }
    ]
  }
};
```

## 学习资料

- [「吐血整理」再来一打 Webpack 面试题](https://mp.weixin.qq.com/s/UdsP3u_LR64dzffNPCx-2g)
