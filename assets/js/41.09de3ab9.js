(window.webpackJsonp=window.webpackJsonp||[]).push([[41],{208:function(t,s,e){"use strict";e.r(s);var a=e(0),n=Object(a.a)({},function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"content"},[t._m(0),t._v(" "),t._m(1),t._v(" "),t._m(2),t._m(3),t._v(" "),t._m(4),t._m(5),t._v(" "),e("blockquote",[e("p",[t._v("参考："),e("a",{attrs:{href:"http://www.mamicode.com/info-detail-2368065.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("GitHub Desktop报错fatal: unable to access 'https://github.com……: schannel: failed to open CA file 'C:/Users……bundle.crt': No such file or directory的解决办法"),e("OutboundLink")],1)])])])},[function(){var t=this.$createElement,s=this._self._c||t;return s("h1",{attrs:{id:"github报错fatal-unable-to-access-no-such-file-or-directory"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#github报错fatal-unable-to-access-no-such-file-or-directory","aria-hidden":"true"}},[this._v("#")]),this._v(" Github报错fatal unable to access No such file or directory")])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[this._v("之前有安装过github旧版，一直正常，后来更新了新版，但是"),s("code",[this._v("git pull")]),this._v("的时候如有如下报错：")])},function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"language-console line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[this._v("fatal: unable to access 'https://github.com/eefocus/deploy.git/': schannel: failed to open CA file 'C:/Users/Administrator/AppData/Local/GitHubDesktop/app-1.2.3/resources/app/git/mingw64/bin/curl-ca-bundle.crt': No such file or directory\n")])]),this._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[this._v("1")]),s("br")])])},function(){var t=this.$createElement,s=this._self._c||t;return s("ul",[s("li",[this._v("找到"),s("code",[this._v("C:\\ProgramData\\Git\\config")]),this._v("，打开，修改"),s("code",[this._v("sslCAinfo")]),this._v("（路径得看自己文件相对应的位置）如下：")])])},function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"language-config line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v('[core]\n\tsymlinks = true\n\tautocrlf = true\n\tfscache = true\n[color]\n\tdiff = auto\n\tstatus = auto\n\tbranch = auto\n\tinteractive = true\n[pack]\n[help]\n\tformat = html\n[https]\n\tsslCAinfo = C:/Users/Administrator/AppData/Local/GitHubDesktop/app-1.2.6/resources/app/git/mingw64/ssl/certs/curl-ca-bundle.crt\n[sendemail]\n\tsmtpserver = /bin/msmtp.exe\n\n[diff "astextplain"]\n\ttextconv = astextplain\n[rebase]\n\tautosquash = true\n\n')])]),t._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[t._v("1")]),e("br"),e("span",{staticClass:"line-number"},[t._v("2")]),e("br"),e("span",{staticClass:"line-number"},[t._v("3")]),e("br"),e("span",{staticClass:"line-number"},[t._v("4")]),e("br"),e("span",{staticClass:"line-number"},[t._v("5")]),e("br"),e("span",{staticClass:"line-number"},[t._v("6")]),e("br"),e("span",{staticClass:"line-number"},[t._v("7")]),e("br"),e("span",{staticClass:"line-number"},[t._v("8")]),e("br"),e("span",{staticClass:"line-number"},[t._v("9")]),e("br"),e("span",{staticClass:"line-number"},[t._v("10")]),e("br"),e("span",{staticClass:"line-number"},[t._v("11")]),e("br"),e("span",{staticClass:"line-number"},[t._v("12")]),e("br"),e("span",{staticClass:"line-number"},[t._v("13")]),e("br"),e("span",{staticClass:"line-number"},[t._v("14")]),e("br"),e("span",{staticClass:"line-number"},[t._v("15")]),e("br"),e("span",{staticClass:"line-number"},[t._v("16")]),e("br"),e("span",{staticClass:"line-number"},[t._v("17")]),e("br"),e("span",{staticClass:"line-number"},[t._v("18")]),e("br"),e("span",{staticClass:"line-number"},[t._v("19")]),e("br"),e("span",{staticClass:"line-number"},[t._v("20")]),e("br"),e("span",{staticClass:"line-number"},[t._v("21")]),e("br"),e("span",{staticClass:"line-number"},[t._v("22")]),e("br")])])},function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("ul",[e("li",[e("strong",[t._v("重点提示")]),t._v("：默认的是"),e("code",[t._v("[http]")]),t._v("，如果有必要你需要改成"),e("code",[t._v("[https]")])]),t._v(" "),e("li",[t._v("如果找不到"),e("code",[t._v("C:\\ProgramData")]),t._v("文件（我的是win10），在查看下将隐藏的项目打个勾\n"),e("img",{attrs:{src:"https://user-images.githubusercontent.com/19526072/43298424-81590c1a-9188-11e8-8968-666bdd839ced.png",alt:"打开隐藏文件"}})])])}],!1,null,null,null);s.default=n.exports}}]);