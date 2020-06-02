module.exports = {
  base: "/vuepress/", // 基准 URL
  title: "大涛子客栈",
  description: "前端知识体系",
  head: [
    [
      "link",
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  ],
  port: 8080,
  dest: "docs/.vuepress/dist", // 指定 vuepress build 的输出目录
  markdown: {
    lineNumbers: false,
  },
  themeConfig: {
    logo: "/favicon.ico",
    repo: "yangtao2o/vuepress", // 项目的 github 地址
    repoLabel: "Github", // github 地址的链接名
    lastUpdated: "Last Updated",
    nav: require("./config/nav"),
    sidebar: require("./config/sidebar"),
    smoothScroll: true,
  },
  evergreen: true, // 浏览器兼容性，只设置现代浏览器
  plugins: ["@vuepress/back-to-top"],
  extraWatchFiles: [
    ".vuepress/config/nav.js", // 使用相对路径
    ".vuepress/config/sidebar.js", // 使用相对路径
    // '/path/to/bar.js'   // 使用绝对路径
  ],
};
