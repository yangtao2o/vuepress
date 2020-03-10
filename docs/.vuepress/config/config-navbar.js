const sidebar = require("./config-sidebar");

module.exports = [
  {
    text: "主页",
    link: "/"
  },
  {
    text: "分类",
    items: [
      {
        text: "JS",
        link: "/js/" + sidebar["jsCont"][0]["children"][0]
      },
      {
        text: "CSS",
        link: "/css/" + sidebar["cssCont"][0]["children"][0]
      },
      {
        text: "Vue.js",
        link: "/vue/" + sidebar["vueCont"][0]["children"][0]
      },
      {
        text: "React.js",
        link: "/react/" + sidebar["reactCont"][0]["children"][0]
      },
      {
        text: "Node.js",
        link: "/node/" + sidebar["nodeCont"][0]["children"][0]
      },
      {
        text: "前端开发",
        link: "/web/" + sidebar["webCont"][0]["children"][0]
      }
    ]
  },
  {
    text: "博文",
    link: "http://www.yangtao.site"
  },
  {
    text: "秘籍",
    items: [
      {
        text: "大牛博客",
        items: [
          {
            text: "Vue技术揭秘",
            link: "https://ustbhuangyi.github.io/vue-analysis/"
          },
          {
            text: "ConardLi的blog",
            link: "http://www.conardli.top/blog/"
          },
          {
            text: "awesome-coding-js",
            link: "http://www.conardli.top/docs/"
          },
          {
            text: "木易杨前端进阶",
            link: "https://muyiy.vip/"
          },
          {
            text: "冴羽的博客",
            link: "https://github.com/mqyqingfeng/Blog"
          }
        ]
      },
      {
        text: "面试宝典",
        items: [
          {
            text: "前端面试与进阶指南",
            link: "https://www.cxymsg.com/guide/"
          },
          {
            text: "前端硬核面试专题",
            link: "https://yangtao2o.github.io/learn/#/docs/Interview"
          },
          {
            text: "全栈修炼",
            link:
              "https://biaochenxuying.github.io/blog/guide/#%E7%AE%80%E4%BB%8B"
          }
        ]
      },
      {
        text: "大佬人物",
        items: [
          {
            text: "廖雪峰",
            link: "https://www.liaoxuefeng.com/"
          },
          {
            text: "阮一峰",
            link: "http://www.ruanyifeng.com/blog/"
          },
          {
            text: "张鑫旭",
            link: "http://www.zhangxinxu.com/"
          }
        ]
      },
      {
        text: "造车工具",
        items: [
          {
            text: "收藏夹",
            link: "http://collect.w3ctrain.com/"
          },
          {
            text: "在线工具",
            link: "https://tool.lu/c/developer/"
          }
        ]
      },
      {
        text: "前端工程",
        items: [
          {
            text: "网络基础",
            link: "https://juejin.im/post/5c591fda6fb9a049dc02b1cc"
          },
          {
            text: "数据结构和算法",
            link: "https://juejin.im/post/5d5b307b5188253da24d3cd1"
          }
        ]
      }
    ]
  },
  {
    text: "MySite",
    items: [
      {
        text: "Hexo博客",
        link: "https://istaotao.com/"
      },
      {
        text: "牛客网博客",
        link: "https://blog.nowcoder.net/istaotao"
      },
      {
        text: "掘金分享",
        link: "https://juejin.im/user/58b67dd58fd9c50061238e38/shares/"
      },
      {
        text: "掘金收藏",
        link: "https://juejin.im/user/58b67dd58fd9c50061238e38/collections"
      },
      {
        text: "CodePen",
        link: "https://codepen.io/istaotao/"
      },
      // { text: 'QDfuns', link: 'https://www.qdfuns.com/u/32286.html' },
      {
        text: "CSDN",
        link: "https://blog.csdn.net/qq_42840269"
      },
      {
        text: "SegmentFault",
        link: "https://segmentfault.com/u/taoboy/notes"
      }
    ]
  },
  {
    text: "摄影",
    items: [
      {
        text: "LOFTER",
        link: "http://dataoboy.lofter.com/"
      },
      {
        text: "简书",
        link: "https://www.jianshu.com/u/c6b5715f3016"
      },
      {
        text: "图虫",
        link: "https://tuchong.com/2763959/"
      },
      {
        text: "印象",
        link:
          "https://cc.adnonstop.com/index.php?r=Info/Home&user_id=160865486&pn=interphoto"
      }
    ]
  },
  {
    text: "友链",
    items: [
      {
        text: "友链",
        link: "https://istaotao.com/friends/"
      },
      {
        text: "木易杨前端进阶",
        link: "https://muyiy.vip/"
      },
      {
        text: "大雷子",
        link: "https://isliulei.com/"
      },
      {
        text: "大贵子",
        link: "https://zguii.com/"
      },
      {
        text: "xaoxuu",
        link: "https://xaoxuu.com"
      }
    ]
  }
];
