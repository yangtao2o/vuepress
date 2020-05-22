# ES6 常用技巧总结

## 拓展运算符

### arguments 转数组

```js
// bad
function sortNumbers() {
  return Array.prototype.slice.call(arguments).sort();
}

// good
const sortNumbers = (...numbers) => numbers.sort();
```

### 调用参数

```js
// bad
Math.max.apply(null, [14, 3, 77]);

// good
Math.max(...[14, 3, 77]);
// 等同于
Math.max(14, 3, 77);
```

### 构建对象

剔除部分属性，将剩下的属性构建一个新的对象

```js
let [a, b, ...arr] = [1, 2, 3, 4, 5];

const { a, b, ...others } = { a: 1, b: 2, c: 3, d: 4, e: 5 };
```

有条件的构建对象：

```js
function pick({ id, name, age }) {
  return {
    guid: id,
    ...(name && { name }),
    ...(age && { age })
  };
}
```

合并参数：

```js
let obj1 = { a: 1, b: 2, c: 3 };
let obj2 = { b: 4, c: 5, d: 6 };
let merged = { ...obj1, ...obj2 };
```

### React

将对象全部传入组件

```jsx
const parmas =  {value1: 1, value2: 2, value3: 3}
<Test {...parmas} />
```

## 解构赋值

### 对象的基本解构

```js
componentWillReceiveProps(newProps) {
	this.setState({
		active: newProps.active
	})
}

componentWillReceiveProps({active}) {
	this.setState({active})
}
```

```js
handleEvent = () => {
  this.setState(({ data }) => ({
    data: data.set("key", "value")
  }));
};
```

```js
Promise.all([Promise.resolve(1), Promise.resolve(2)]).then(([x, y]) => {
  console.log(x, y);
});
```

### 对象深度解构

```js
function test({ name } = {}) {
  console.log(name || "unknown");
}
```

```js
let obj = {
  a: {
    b: {
      c: 1
    }
  }
};

const { a: { b: { c = "" } = "" } = "" } = obj;
```

### 数组解构

```js
const locale = "中文-上海";
const [language, country] = locale.split("-");

console.log(language); // "中文"
console.log(country); // "上海"
```

### 变量重命名

```js
let { foo: baz } = { foo: "aaa", bar: "bbb" };

console.log(baz); // "aaa"
```

### 仅获取部分属性

```js
function test(input) {
  return [left, right, top, bottom];
}
const [left, __, top] = test(input);

function test(input) {
  return { left, right, top, bottom };
}
const { left, right } = test(input);
```

## Set 和 Map

### 数组去重

```js
[...new Set(array)];
```

### 条件语句的优化

```js
const fruitColor = new Map()
  .set("red", ["apple", "strawberry"])
  .set("yellow", ["banana", "pineapple"])
  .set("purple", ["grape", "plum"]);

function test(color) {
  return fruitColor.get(color) || [];
}
```

## Symbol

### 唯一值

```js
var element;
var isMoving = Symbol("isMoving");

if (element[isMoving]) {
  smoothAnimations(element);
}

element[isMoving] = true;
```

### 魔法字符串

魔术字符串指的是在代码之中多次出现、与代码形成**强耦合**的某一个具体的**字符串或者数值**。

魔术字符串不利于修改和维护，风格良好的代码，应该尽量消除魔术字符串，改由含义清晰的变量代替。

```js
const TYPE_AUDIO = Symbol();
const TYPE_VIDEO = Symbol();
const TYPE_IMAGE = Symbol();

function handleFileResource(resource) {
  switch (resource.type) {
    case TYPE_AUDIO:
      playAudio(resource);
      break;
    case TYPE_VIDEO:
      playVideo(resource);
      break;
    case TYPE_IMAGE:
      previewImage(resource);
      break;
    default:
      throw new Error("Unknown type of resource");
  }
}
```

### 私有变量

```js
const Example = (function() {
  var _private = Symbol("private");

  class Example {
    constructor() {
      this[_private] = "private";
    }
    getName() {
      return this[_private];
    }
  }

  return Example;
})();

var ex = new Example();

console.log(ex.getName()); // private
console.log(ex.name); // undefined
```

## for of

### 遍历范围

可遍历具有 `Symbol[iterator]` 属性的对象：

- 数组
- Set
- Map
- 类数组对象，如 arguments 对象、DOM NodeList 对象
- Generator 对象
- 字符串

### 遍历 map

```js
let map = new Map(arr);

// 遍历 key 值
for (let key of map.keys()) {
  console.log(key);
}

// 遍历 value 值
for (let value of map.values()) {
  console.log(value);
}

// 遍历 key 和 value 值(一)
for (let item of map.entries()) {
  console.log(item[0], item[1]);
}

// 遍历 key 和 value 值(二)
for (let [key, value] of data) {
  console.log(key);
}
```

## 函数 - 默认值

```js
doSomething({ foo: 'Hello', bar: 'Hey!', baz: 42 });

// good
function doSomething({ foo = 'Hi', bar = 'Yo!', baz = 13 }) {
  ...
}

// better
function doSomething({ foo = 'Hi', bar = 'Yo!', baz = 13 } = {}) {
  ...
}
```

```jsx
// good
const Button = ({className = 'default-size'}) => (
  <span className={classname}></span>
);

// better
const Button = ({className}) =>
  <span className={className}></span>
}

Button.defaultProps = {
  className: 'default-size'
}
```

```js
const required = () => {
  throw new Error("Missing parameter");
};

const add = (a = required(), b = required()) => a + b;

add(1, 2); // 3
add(1); // Error: Missing parameter.
```

## 双冒号运算符

```js
foo::bar;
// 等同于
bar.bind(foo);

foo::bar(...arguments);
// 等同于
bar.apply(foo, arguments);
```

如果双冒号左边为空，右边是一个对象的方法，则等于将该方法绑定在该对象上面。

```js
var method = obj::obj.foo;
// 等同于
var method = ::obj.foo;

let log = ::console.log;
// 等同于
var log = console.log.bind(console);
```

## 增强的对象字面量

```js
// bad
const something = "y";
const x = {
  something: something
};

// good
const something = "y";
const x = {
  something
};
```

动态属性

```js
const x = {
  ["a" + "_" + "b"]: "z"
};

console.log(x.a_b); // z
```

## Promise

```js
fetch("file.json")
  .then(data => data.json())
  .catch(error => console.error(error))
  .finally(() => console.log("finished"));
```

## Async

```js
async function fetch() {
  const value1 = await fetchData();
  const value2 = await fetchMoreData(value1);
  return fetchMoreData2(value2);
}
```

错误处理：

```js
// good
function fetch() {
  try {
    fetchData()
      .then(result => {
        const data = JSON.parse(result);
      })
      .catch(err => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
}

// better
async function fetch() {
  try {
    const data = JSON.parse(await fetchData());
  } catch (err) {
    console.log(err);
  }
}
```

async 地狱：

```js
// bad
(async () => {
  const getList = await getList();
  const getAnotherList = await getAnotherList();
})();

// good
(async () => {
  const listPromise = getList();
  const anotherListPromise = getAnotherList();
  await listPromise;
  await anotherListPromise;
})();

// good
(async () => {
  Promise.all([getList(), getAnotherList()]).then(...);
})();
```

## Class

```js
class Shape {
  constructor(width, height) {
    this._width = width;
    this._height = height;
  }
  get area() {
    return this._width * this._height;
  }
}

const square = new Shape(10, 10);
```

## Decorator

### debounce

```js
class Toggle extends React.Component {
  @debounce(500, true)
  handleClick() {
    console.log("toggle");
  }

  render() {
    return <button onClick={this.handleClick}>button</button>;
  }
}
```

### React 与 Redux

```jsx
// good
class MyReactComponent extends React.Component {}

export default connect(mapStateToProps, mapDispatchToProps)(MyReactComponent);

// better
@connect(mapStateToProps, mapDispatchToProps)
export default class MyReactComponent extends React.Component {}
```

## 学习资料

- [ES6 完全使用手册](https://github.com/mqyqingfeng/Blog/issues/111)
