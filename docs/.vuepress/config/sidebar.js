module.exports = {
  "/basic/": [
    {
      title: "HTML CSS",
      // collapsable: false, // 可选的, 默认值是 true,
      sidebarDepth: 1, // 可选的, 默认值是 1
      children: [
        "",
        "html/css",
        "html/css-fragment",
        "html/css-code",
        "html/css3",
        "html/css-rem",
        "html/sass",
        "html/article",
        "html/html-edm",
      ],
    },
    {
      title: "JS 冴羽系列",
      children: [
        "js/series-summary",
        "js/series-1",
        "js/series-2",
        "js/series-3",
        "js/theme-1",
        "js/theme-2",
        "js/theme-3",
        "js/es6-series",
        "js/es6",
      ],
    },
    {
      title: "JS 手写系列",
      children: [
        "js/handwriting-1",
        "js/handwriting-2",
        "js/handwriting-3",
        "js/handwriting-polyfill",
      ],
    },
    {
      title: "JS 经典实例",
      children: ["js/chapter-1", "js/chapter-2", "js/chapter-3"],
    },
    {
      title: "学习总结",
      children: [
        "other/f-var",
        "other/f-prototype",
        "other/f-this-apply-call",
        "other/f-class",
        "other/mode-1",
        "other/interview-2020",
        "other/js-code",
        "other/js-code-big",
        "other/throttle-debounce",
      ],
    },
    {
      title: "数据结构与算法",
      children: ["other/js-data"],
    },
    {
      title: "插件等资源",
      children: [
        "other/js-doc",
        "other/plugin-purl",
        "other/plugin-wow",
        "other/plugin-jquery-1",
      ],
    },
  ],
  "/advanced/": [
    {
      title: "Vue 知识体系",
      children: [
        "",
        // "vue/doc-basic",
        "vue/doc-advanced",
        "vue/doc-others",
        "vue/props-methods",
        "vue/v-webpack",
        "vue/v-router",
      ],
    },
    {
      title: "React 知识体系",
      collapsable: false, // 可选的, 默认值是 true,
      children: [
        "react/doc-basic",
        "react/doc-advanced",
        "react/doc-others",
        "react/state-methods",
        "react/demo",
        "react/webpack-v3",
        "react/article",
      ],
    },
  ],
  "/tool/": [
    {
      title: "Node",
      children: [
        "",
        "node/connect",
        "node/tcp",
        "node/http",
        "node/event",
        "node/node-stream",
        "node/node-5-util",
        "node/express-init",
        "node/express-spider",
        "node/express-spider-more",
        "node/node-event",
        "node/middleware",
        "node/nginx",
        "node/module",
        "node/commonjs-amd",
      ],
    },
    {
      title: "Webpack",
      children: ["webpack-learn", "webpack-thinking", "webpack-v3"],
    },
    {
      title: "开发工具",
      children: [
        "git-command",
        "git-revert",
        "git-learn",
        "gnvm",
        "macos-bash",
        "tool-tree",
        "linux-shell",
        "macos-du",
        "doc-rule",
      ],
    },
  ],
  "/protocol/": [
    {
      title: "网络协议基础理论",
      children: [
        "",
        "https",
        "http2",
        "tcp-ip",
        "websocket",
        "http-use",
        "http-url",
        "header-response",
        "http-tool",
      ],
    },
    {
      title: "前端性能优化、跨域、安全等",
      collapsable: false,
      children: [
        "web-cache",
        "cross-jsonp",
        "cross-cors",
        "storage",
        "web-xss",
        "web-performance",
      ],
    },
  ],
  "/other/": [
    {
      title: "学习与生活",
      children: ["", "learn-js", "mylife"],
    },
    {
      title: "日常报错",
      children: [
        "error-localhost",
        "error-git-push",
        "error-github-file",
        "error-macos-brew",
        "error-macos-node",
      ],
    },
    {
      title: "面试相关",
      children: ["interview"],
    },
    {
      title: "博客相关",
      children: ["vuepress-blog", "ubuntu-aliyun", "hexo", "hexo-order"],
    },
  ],
};
