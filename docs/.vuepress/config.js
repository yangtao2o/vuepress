const sidebar = {
  '/js/': [
    {
      title: '基础修炼',
      collapsable: false,
      children: [
        'js-var',
        'js-prototype',
        'js-this-apply-call',
        'es-class',
        'js算法',
        'mode-单例模式',
        'js-chapter-1',
        'js-chapter-2',
        'js-chapter-3',
        'js-learn',
      ]
    },
    {
      title: '日常杂记',
      collapsable: false,
      children: [
        'js-code',
      ]
    },
    {
      title: '插件',
      collapsable: false,
      children: [
        'plugin-purl',
        'plugin-wow',
        'plugin-jquery-1',
      ]
    }
  ],
  '/css/': [
    {
      title: 'CSS',
      collapsable: false,
      children: [
        'css-code',
      ]
    },
    {
      title: 'HTML',
      collapsable: false,
      children: [
        'html-edm',
      ]
    }
  ],
  '/vue/': [
    {
      title: 'Vue.js',
      collapsable: false,
      children: [
        'vuepress-blog',
        'v-webpack',
        'v-router',
      ]
    }
  ],
  '/react/': [
    {
      title: 'React.js',
      collapsable: false,
      children: [
        'react-demo',
        'webpack-v3',
      ]
    }
  ],
  '/node/': [
    {
      title: 'Node.js',
      collapsable: false,
      children: [
        'node-event',
        'node-express'
      ]
    }
  ],
  '/web/': [
    {
      title: '前端开发',
      collapsable: false,
      children: [
        'header-response'
      ]
    },
    {
      title: '开发工具',
      collapsable: false,
      children: [
        'git-command',
        'git-revert',
        'gnvm',
        'macos-bash',
      ]
    },
    {
      title: '日常报错',
      collapsable: false,
      children: [
        'localhost',
        'error-git-push',
        'error-github-file',
        'error-macos-brew',
        'error-macos-node',
        ''
      ]
    },
    {
      title: '其他',
      collapsable: false,
      children: [
        'hexo',
        'hexo-order',
      ]
    }
  ],
  
}

const nav = [
  { text: 'Home', link: '/' },
  {
    text: '开发日志',
    items: [
      { text: 'Javascript', link: '/js/' + sidebar['/js/'][0]['children'][0] },
      { text: 'CSS', link: '/css/' + sidebar['/css/'][0]['children'][0] },
      { text: 'Vue.js', link: '/vue/' + sidebar['/vue/'][0]['children'][0] },
      { text: 'React.js', link: '/react/' + sidebar['/react/'][0]['children'][0] },
      { text: 'Node.js', link: '/node/' + sidebar['/node/'][0]['children'][0] },
      { text: '前端开发', link: '/web/' + sidebar['/web/'][0]['children'][0] },
    ]
  },
  {
    text: '计算机',
    items: [
      {
        text: '文档',
        items: [
          { text: 'Vue技术揭秘', link: 'https://ustbhuangyi.github.io/vue-analysis/' },
        ]
      },
      {
        text: '网络',
        items: [
          { text: '网络基础', link: 'https://juejin.im/post/5c591fda6fb9a049dc02b1cc' },
        ]
      },
    ]
  },
  {
    text: '博客',
    link: 'https://istaotao.com/'
  },
  {
    text: '网栈',
    items: [
      {
        text: '我的小站',
        items: [
          { text: 'Hexo博客', link: 'https://istaotao.com/' },
          { text: '牛客网博客', link: 'https://blog.nowcoder.net/istaotao' },
          { text: '掘金分享', link: 'https://juejin.im/user/58b67dd58fd9c50061238e38/shares/' },
          { text: '掘金收藏', link: 'https://juejin.im/user/58b67dd58fd9c50061238e38/collections' },
          { text: 'CodePen', link: 'https://codepen.io/istaotao/' },
          // { text: 'QDfuns', link: 'https://www.qdfuns.com/u/32286.html' },
          { text: 'CSDN', link: 'https://blog.csdn.net/qq_42840269' },
          { text: 'SegmentFault', link: 'https://segmentfault.com/u/taoboy/notes' },
        ]
      },
      {
        text: '大牛别墅',
        items: [
          { text: '廖雪峰', link: 'https://www.liaoxuefeng.com/' },
          { text: '阮一峰', link: 'http://www.ruanyifeng.com/blog/' },
          { text: '张鑫旭', link: 'http://www.zhangxinxu.com/' },
        ]
      },
      {
        text: '造车工具',
        items: [
          { text: '收藏夹', link: 'http://collect.w3ctrain.com/' },
          { text: '在线工具', link: 'https://tool.lu/c/developer/' },
          { text: '', link: '' },
        ]
      }
    ]
  },
  {
    text: '摄影',
    items: [
      { text: 'LOFTER', link: 'http://dataoboy.lofter.com/' },
      { text: '简书', link: 'https://www.jianshu.com/u/c6b5715f3016' },
      { text: '图虫', link: 'https://tuchong.com/2763959/' },
      { text: '印象', link: 'https://cc.adnonstop.com/index.php?r=Info/Home&user_id=160865486&pn=interphoto' },
    ]
  },
  {
    text: '友链',
    items: [
      { text: '友链', link: 'https://istaotao.com/friends/'},
      { text: '木易杨前端进阶', link: 'https://muyiy.vip/' },
      { text: '大雷子', link: 'https://isliulei.com/' },
      { text: '大贵子', link: 'https://zguii.com/' },
      { text: 'xaoxuu', link: 'https://xaoxuu.com' },
    ]
  }
]

const config = {
  base: '/home/',  // 基准 URL
  title: '大涛子客栈',
  description: '前端开发、摄影、羽毛球、电影',
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
    repo: 'yangtao2o/blog',  // 项目的 github 地址
    repoLabel: '代码',  // github 地址的链接名
    editLinks: true,  // 当前 markdown 的 github 代码链接
    editLinkText: '查看原文|编辑此页',
    lastUpdated: 'Last Updated', 
    nav,
    sidebar,
  },
}

module.exports = config