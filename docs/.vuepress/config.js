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
    text: '我的博客',
    link: 'https://istaotao.com/'
  },
  {
    text: '前端开发',
    items: [
      { text: 'Vue', link: '/web/' + sidebar['/web/'][0]['children'][0] },
      { text: 'React', link: '/web/' + sidebar['/web/'][1]['children'][0] },
    ]
  },
  {
    text: '我的摄影',
    items: [
      { text: 'LOFTER', link: 'http://dataoboy.lofter.com/' },
      { text: '简书', link: 'https://www.jianshu.com/u/c6b5715f3016' },
      { text: '图虫', link: 'https://tuchong.com/2763959/' },
      { text: '印象', link: 'https://cc.adnonstop.com/index.php?r=Info/Home&user_id=160865486&pn=interphoto' },
    ]
  }
]

const config = {
  base: '/home/',  // 基准 URL
  title: '大涛子',
  description: '前端开发、摄影、电影、羽毛球',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],
  port: 8080,
  // dest: '.vuepress/dist',  // 指定 vuepress build 的输出目录
  ga: '',
  markdown: {  // markdown设置
    lineNumbers: true,
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