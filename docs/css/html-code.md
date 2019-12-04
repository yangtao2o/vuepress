# Html 理论

## NodeList 和 HTMLCollection

主要区别是，NodeList 可以包含各种类型的节点，HTMLCollection 只能包含 HTML 元素节点。

### NodeList 接口

NodeList 实例是一个类似数组的对象，它的成员是节点对象。通过以下方法可以得到 NodeList 实例。

- `Node.childNodes`
- `document.querySelectorAll()` 等节点搜索方法

NodeList 实例很像数组，可以使用 length 属性和 forEach 方法。但是，它不是数组，不能使用 pop 或 push 之类数组特有的方法。

如果 NodeList 实例要使用数组方法，可以将其转为真正的数组。

除了使用 forEach 方法遍历 NodeList 实例，还可以使用 for 循环。

- `NodeList.prototype.length`，length 属性返回 NodeList 实例包含的节点数量
- `NodeList.prototype.forEach()`，遍历 NodeList 的所有成员
- `NodeList.prototype.item()`，item 方法接受一个整数值作为参数，表示成员的位置，返回该位置上的成员。

下面三个方法，都返回一个 ES6 的遍历器对象，`for...of` 可获取每一个成员信息：

- `NodeList.prototype.keys()`，返回键名的遍历器
- `NodeList.prototype.values()`，返回键值的遍历器
- `NodeList.prototype.entries()`，返回的遍历器

### HTMLCollection 接口

HTMLCollection 是一个节点对象的集合，只能包含元素节点（element），不能包含其他类型的节点。

它的返回值是一个类似数组的对象，但是与 NodeList 接口不同，HTMLCollection 没有 forEach 方法，只能使用 for 循环遍历。

返回 HTMLCollection 实例的，主要是一些 Document 对象的集合属性，比如 `document.links`、`document.forms`、`document.images` 等。

- `HTMLCollection.prototype.length`
- `HTMLCollection.prototype.item()`
- `HTMLCollection.prototype.namedItem()`，参数是一个字符串，表示 id 属性或 name 属性的值，返回对应的元素节点。如果没有对应的节点，则返回 null。

### 对比

共同点：

- 类数组对象，有 length 属性
- 共同的方法：item，可以通过 item(index) 或者 item(id) 来访问返回结果中的元素
- 实时变动的（live），document 上的更改会反映到相关对象上（例外：`document.querySelectorAll` 返回的 NodeList 不是实时的）

区别：

- NodeList 可以包含任何节点类型，HTMLCollection 只包含元素节点（elementNode），elementNode 就是 HTML 中的标签
- HTMLCollection 比 NodeList 多一项方法：namedItem，可以通过传递 id 或 name 属性来获取节点信息

参考资料：

- [NodeList 接口，HTMLCollection 接口](http://wangdoc.com/javascript/dom/nodelist.html)
- [HTMLCollection vs. NodeList](https://www.jianshu.com/p/f6ff5ebe45fd)
