# HTTP/HTTPS

## HTTP

简概：

- HTTP 协议传输信息的基础：TCP/IP 协议模型
- HTTP 协议属于最高层的应用层
- HTTP 在 应用层 交互数据的方式 = 报文
- HTTP 的报文分为：请求报文 & 响应报文

### 报文

#### 请求报文的组成

1、请求行

- 方法：
  - GET 获取资源
  - POST 向服务器端发送数据，传输实体主体
  - PUT 传输文件
  - HEAD 获取报文首部
  - DELETE 删除文件
  - OPTIONS 询问支持的方法
  - TRACE 追踪路径
- 协议/版本号
- URL（`username:password@www.baidu.com:80/a.html?limi…`）
  - 协议 （HTTP）
  - 登录信息（username:password）
  - 主机名（www.baidu.com）
  - 端口号 （80）
  - 路径 （/a.html）
  - 查询参数 （limit=1）
  - hahs 值（hash，服务器收不到 hash 值，一般为前端的路由跳转）

2、请求头

- 通用首部(General Header)
- 请求首部(Request Header)
- 实体首部(Entity Header Fields)

3、请求体

#### 响应报文的组成

1、响应行

- 协议/版本号
- 状态码：

- 1XX Informational(信息性状态码)
- 2XX Success(成功状态码)
  - 200(OK 客户端发过来的数据被正常处理
  - 204(Not Content 正常响应，没有实体
  - 206(Partial Content 范围请求，返回部分数据，响应报文中由 content-Range 指定实体内容)
- 3XX Redirection(重定向)
  - 301(Moved Permanently) 永久重定向
  - 302(Found)临时重定向，规范要求，方法名不变，但是都会改变
  - 303(See Other) 和 302 类似，但必须用 GET 方法
  - 304(Not Modified)状态未改变，配合(If-Match、If-Modified-Since、If-None_Match、If-Range、If-Unmodified-Since)
  - 307(Temporary Redirect) 临时重定向，不该改变请求方法
- 4XX Client Error(客户端错误状态码)
  - 400(Bad Request) 请求报文语法错误
  - 401 (unauthorized) 需要认证
  - 403(Forbidden) 服务器拒绝访问对应的资源
  - 404(Not Found) 服务器上无法找到资源
- 5XX Server Error(服务器错误状态吗)
  - 500(Internal Server Error)服务器故障
  - 503(Service Unavailable)服务器处于超负载或正在停机维护
- 状态码原因短语

2、响应头

- 通用首部(General Header)
- 响应首部(Response Header)
- 实体首部(Entity Header Fields)

3、响应体

#### 报文首部

通用首部（通信管理）

|                  |                            |
| ---------------- | -------------------------- |
| Cache-Control    | 控制缓存行为               |
| Connection       | 链接的管理                 |
| Date             | 报文日期                   |
| Pragma           | 报文指令                   |
| Trailer          | 报文尾部的首部             |
| Trasfer-Encoding | 指定报文主体的传输编码方式 |
| Upgrade          | 升级为其他协议             |
| Via              | 代理服务器信息             |
| Warning          | 错误通知                   |

请求首部（请求资源的范围、限制和处理）

|                     |                                               |
| ------------------- | --------------------------------------------- |
| Accept              | 用户代理可处理的媒体类型                      |
| Accept-Charset      | 优先的字符集                                  |
| Accept-Encoding     | 优先的编码                                    |
| Accept-Langulage    | 优先的语言                                    |
| Authorization Web   | 认证信息                                      |
| Expect              | 期待服务器的特定行为                          |
| From                | 用户的电子邮箱地址                            |
| Host                | 请求资源所在的服务器                          |
| If-Match            | 比较实体标记                                  |
| If-Modified-Since   | 比较资源的更新时间，用于缓存                  |
| If-None-Match       | 比较实体标记                                  |
| If-Range            | 资源未更新时发送实体 Byte 的范围请求          |
| If-Unmodified-Since | 比较资源的更新时间(和 If-Modified-Since 相反) |
| Max-Forwards        | 最大传输跳数                                  |
| Proxy-Authorization | 代理服务器需要客户端认证                      |
| Range               | 实体字节范围请求                              |
| Referer             | 请求中的 URI 的原始获取方                     |
| TE                  | 传输编码的优先级                              |
| User-Agent HTTP     | 客户端程序的信                                |

## HTTPS(HTTP+TLS/SSL)

HTTP 为什么不安全？由于是明文传输，可能被窃听，可能被篡改，无法认证确认对方身份。

攻击手段：

- XSS，即为（Cross Site Scripting），中文名为跨站脚本，主要方式是嵌入一段远程或者第三方域上的 JS 代码
- CSRF（Cross-site request forgery），中文名为跨站请求伪造，攻击者盗用了你的身份，以你的名义发送恶意请求。

### TLS/SSL

TLS/SSL 的功能实现主要依赖于三类基本算法：

- 非对称加密实现身份认证和密钥协商
- 对称加密算法采用协商的密钥对数据加密
- 散列函数验证信息的完整性，针对于密钥泄露的不安全性

结合三类算法的特点，TLS 的基本工作方式:

- 客户端使用非对称加密与服务器进行通信，实现身份验证并协商对称加密使用的密钥
- 然后对称加密算法采用协商密钥对信息以及信息摘要进行加密通信，不同的节点之间采用的对称密钥不同，从而可以保证信息只能通信双方获取

### 对称加密

- 相同的密钥可以用于信息的加密和解密，掌握密钥才能获取信息，能够防止信息窃听，通信方式是 1 对 1(前提示密钥不泄露)
- 算法公开、计算量小、加密速度快、加密效率高
- 客户端、服务器双方都需要维护大量的密钥，维护成本很高
- 因每个客户端、服务器的安全级别不同，密钥容易泄露，交易双方都使用同样钥匙，安全性得不到保证

### 非对称加密

- 非对称加密算法的特点加密和解密分别使用不同的密钥,客户端用公钥对请求内容加密，服务器使用私钥对内容解密，反之亦然。
- 相对来说加解密速度较慢，使用非对称加密在数据加密解密过程需要消耗一定时间，降低了数据传输效率
- 公钥是公开的，所以针对私钥加密的信息，黑客截获后可以使用公钥进行解密，获取其中的内容
- 公钥并不包含服务器的信息，使用非对称加密算法无法确保服务器身份的合法性，存在中间人攻击的风险，服务器发送给客户端的公钥可能在传送过程中被中间人截获并篡改

### 完整性验证算法

- 常见的有 MD5、SHA1、SHA256，该类函数特点是函数单向不可逆、对输入非常敏感、输出长度固定，针对数据的任何修改都会改变散列函数的结果，用于防止信息篡改并验证数据的完整性
- 在信息传输过程中，散列函数不能单独实现信息防篡改，因为明文传输，中间人可以修改信息之后重新计算信息摘要，因此需要对传输的信息以及信息摘要进行加密

### 密钥协商

### 身份验证

服务方 Server 向第三方机构 CA 提交公钥、组织信息、个人信息(域名)等信息并申请认证。

## 浏览器输入 URL 之后

大致流程：

- 浏览器中输入网址
- 域名解析（DNS），找到 IP 服务器
- 发起 TCP 连接，HTTP 三次握手,发送请求（Request）
- 服务器响应 HTTP(Response)
- 浏览器下载资源 html css js images 等
- 浏览器解析代码（如果服务器有 gzip 压缩，浏览器先解压）
- 浏览器渲染呈现给用户

[当我们在浏览器中输入一个URL后，发生了什么？](https://kmknkk.xin/2018/03/04/%E5%BD%93%E6%88%91%E4%BB%AC%E5%9C%A8%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%AD%E8%BE%93%E5%85%A5%E4%B8%80%E4%B8%AAURL%E5%90%8E%EF%BC%8C%E5%8F%91%E7%94%9F%E4%BA%86%E4%BB%80%E4%B9%88%EF%BC%9F/)

[「真 ® 全栈之路 - DNS 篇」故事从输入 URL 开始.....](https://juejin.im/post/5ceebb7251882507266414b7)

[在浏览器输入 URL 回车之后发生了什么（超详细版）](https://4ark.me/post/b6c7c0a2.html)

## 资料

- [前端必须懂的计算机网络知识—(HTTP)](https://juejin.im/post/5ba9d5075188255c652d4208)
- [前端必须懂的计算机网络知识—(跨域、代理、本地存储)](https://juejin.im/post/5bb1cc2af265da0ae5052496)
- [计算机网络：这是一份全面& 详细 HTTP 知识讲解](https://www.jianshu.com/p/a6d086a3997d)
- [面试带你飞：这是一份全面的 计算机网络基础 总结攻略](https://juejin.im/post/5ad7e6c35188252ebd06acfa)
- [「真 ® 全栈之路 - DNS 篇」故事从输入 URL 开始.....](https://juejin.im/post/5ceebb7251882507266414b7)
- [在浏览器输入 URL 回车之后发生了什么（超详细版）](https://4ark.me/post/b6c7c0a2.html)
- [一次完整的 HTTP 请求与响应涉及了哪些知识？](https://www.jianshu.com/p/c1d6a294d3c0)
- [深入理解 Http 请求、DNS 劫持与解析](https://juejin.im/post/59ba146c6fb9a00a4636d8b6)
