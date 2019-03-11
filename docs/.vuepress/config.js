const sidebar = {
  '/web/': [
    {
      title: 'Vue',
      children: [ 'vue/vuepress-blog' ]
    },
    {
      title: 'React',
      children: [ 'react/react-router' ]
    }
  ]
}

const nav = [
  {
    text: '前端',
    items: [
      { text: 'Vue', link: '/web/' + sidebar['/web/'][0]['children'][0] },
      { text: 'React', link: '/web/' + sidebar['/web/'][1]['children'][0] },
    ]
  }
]

const config = {
  base: '/vuepress-blog/',  // 基准 URL
  title: '大涛子',
  description: '大涛子的小客栈',
  head: ['link', { rel: 'icon', href: `/favicon.ico` }],
  port: 8080,
  dest: '.vuepress/dist',  // 指定 vuepress build 的输出目录
  ga: '',
  markdown: {
    lineNumbers: true
  },
  themeConfig: {  // 主题配置
    repo: 'yangtao2o/vuepress-blog',  // 项目的 github 地址
    repoLabel: '代码',  // github 地址的链接名
    editLinks: true,  // 当前 markdown 的 github 代码链接
    editLinkText: '查看原文|编辑此页',
    nav,
    sidebar,
  },
}

module.exports = config