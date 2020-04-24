const nav = require("./config/config-nav");
const sidebar = require("./config/config-sidebar");
module.exports = {
  base: "/vuepress/", // 基准 URL
  title: "大涛子客栈",
  description: "前端开发、摄影、羽毛球、电影",
  head: [
    [
      "link",
      {
        rel: "icon",
        href: "/favicon.ico"
      }
    ]
  ],
  port: 8080,
  // dest: '.vuepress/dist',  // 指定 vuepress build 的输出目录
  ga: "",
  markdown: {
    // markdown设置
    lineNumbers: true
  },
  themeConfig: {
    // 主题配置
    repo: "yangtao2o/vuepress", // 项目的 github 地址
    repoLabel: "代码", // github 地址的链接名
    editLinks: false, // 当前 markdown 的 github 代码链接
    editLinkText: "查看原文|编辑此页",
    lastUpdated: "Last Updated",
    sidebar,
    nav
  },
  evergreen: true,
  plugins: ['@vuepress/back-to-top']
};
