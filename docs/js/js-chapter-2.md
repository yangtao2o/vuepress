# 学习《JavaScript经典实例》之第2章

## 第2章 JavaScript数组

### 2.1 在数组中搜索
* `indexOf()、lastIndexOf()`

```javascript
var animals = new Array('dog', 'cat', 'seal', 'elephant', 'walrus', 'lion');
var index = animals.indexOf('cat');
var index2 = animals.lastIndexOf('lion');
console.log('i',index);  //1
console.log('i2',index2);  //5
```

* [findIndex()](http://www.runoob.com/jsref/jsref-findindex.html) 方法返回传入一个测试条件（函数）符合条件的数组第一个元素位置。

```javascript
var nums = [2, 4, 199, 80, 400, 30, 90];
var over = nums.findIndex(function(ele) {
	return (ele >= 100);
});
console.log('nums',nums[over]);  //199
```

### 2.2 用concat()和apply()将一个二维数组扁平化

* concat() 方法用于连接两个或多个数组。该方法不会改变现有的数组，而仅仅会返回被连接数组的一个副本。
    * `arrayObject.concat(arrayX,arrayX,......,arrayX)`
    
```javascript
var fruitarray = [];
fruitarray[0] = ['stranwberry', 'orange'];
fruitarray[1] = ['lime', 'peach', 'banana'];
fruitarray[2] = ['tangerine', 'apricot'];
console.log('array',fruitarray.concat());
var newArray = fruitarray.concat.apply([], fruitarray);
console.log(newArray);
```

* [apply()与call()的区别](http://www.cnblogs.com/lengyuehuahun/p/5643625.html)
* [如何理解和熟练运用js中的call及apply？](https://www.zhihu.com/question/20289071)
    * `obj.call(thisObj, arg1, arg2, ...);`
    * `obj.apply(thisObj, [arg1, arg2, ...]);`
* call() & apply()，动态改变this

```javascript
function add(a, b) {
	console.log('add', this);
}
function sum(a, b) {
	console.log('sum', this);
}
add(1, 2);  //Window
sum(1, 2);  //Window

add.call(sum, 1, 2);  //sum(a, b)
sum.call(add, 1, 2);  //add(a ,b)
```

* arguments装换为数组, 返回的是数组，但是arguments本身保持不变

```javascript
var arg = [].slice.call(arguments);
// [].slice.call(document.getElementsByTagName('li'));
```

* 借用别人的方法

```javascript
var foo = {
	name: 'jack',
	showName: function() {
		console.log('this name:',this.name);
	}
}
var bar = {
	name: 'rose'
}
foo.showName();  //jack
foo.showName.call(bar);  //rose
```

* 实现继承

```javascript
var Student = function(name, age, high) {
	Person.call(this, name, age);
	this.high = high;
}
```

* 封装对象保证this的指向

```javascript
var _this = this;
_this.$box.on('mousedown', function()) {
	return _this.fndown.apply(_this);
}
```

### 2.3 删除或替换数组元素
* [splice()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) 方法与 [slice()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) 方法的作用是不同的，splice() 方法会直接对数组进行修改。

```javascript
var animals = new Array('dog', 'cat', 'rabbit', 'pig', 'apple');
// 从数组删除元素
animals.splice(animals.indexOf('apple'), 1);
console.log(animals);  // ["dog", "cat", "rabbit", "pig"]
// 替换
animals.splice(animals.indexOf('pig'), 1, 'monkey');
console.log(animals);  //["dog", "cat", "rabbit", "monkey"]

// 使用循环和分割来替换和删除元素
var charSets = ["ab", "bb", "cd", "ab", "cc", "ab", "dd", "ab"];
while(charSets.indexOf('ab') != -1) {
	charSets.splice(charSets.indexOf('ab'), 1, '**');
}
console.log(charSets);  //["**", "bb", "cd", "**", "cc", "**", "dd", "**"]
while(charSets.indexOf('**') != -1) {
	charSets.splice(charSets.indexOf('**'), 1);
}
console.log(charSets); //["bb", "cd", "cc", "dd"]
```

### 2.4 提取一个数组中的一部分
* 不更改原数组，使用[slice()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)

```javascript
var animals = new Array('dog', 'cat', 'rabbit', 'pig', 'apple');
var newAnimals = animals.slice(1, 2);
console.log(animals);  //["dog", "cat", "rabbit", "pig", "apple"]
console.log(newAnimals);  //["cat"]
```

### 2.5 对每一个数组元素应用一个函数
* [Array.prototype.forEach()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/forEach)

```javascript
var charSets = ["ab", "bb", "cd", "ab", "cc", "ab", "dd", "ab"];
charSets.forEach(function(element, index, array) {
	if(element == 'ab') array[index] = '**';
});
console.log(charSets);  //["**", "bb", "cd", "**", "cc", "**", "dd", "**"]
```

### 2.6 使用forEach()和call()遍历querySelectorAll()的结果
* [querySelectorAll()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/querySelectorAll)
* 可以将forEach()强制和一个NodeList一起使用

```javascript
var cells = document.querySelectorAll('td + td');
[].forEach.call(cells, function(cell) {
	sum += parseFloat(cell.firstChild.data);
});
```

### 2.7 对数组中的每个元素执行一个函数并返回一个新数组
* 将一个十进制的数组转化为新的等价的十六进制数组
* [map()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map)方法创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果。
* 与forEach()不同，不会修改原数组，但是必须返回一个值

```javascript
var decArray = [23, 3, 24, 45, 500, 9, 70];
var hexArray = decArray.map(function(ele) {
	return ele.toString(16);
});
console.log(decArray);  //[23, 3, 24, 45, 500, 9, 70]
console.log(hexArray);  //["17", "3", "18", "2d", "1f4", "9", "46"]
```

### 2.8 创建一个过滤后的数组
* [filter()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) 方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。 

```javascript
var charSet = ['**', 'bb', 'cc', '**', 'cd'];
var newArray = charSet.filter(function(element, index, array) {
	return element != "**";
});
console.log(newArray);  //["bb", "cc", "cd"]
```

### 2.9 验证数组内容
* 使用Array [every()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/every)方法来检查每个元素是否符合给定的条件
* [some()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some) 方法确保至少某些元素符合该条件
* 区别：every()方法只要函数返回一个false值，处理就会结束，而some()方法会继续测试每个元素，直至返回true，此时，不再验证其他元素，即可返回ture

```javascript
function testValue(element, index, array) {
	var testExp = /^[a-zA-Z]+$/;
	return testExp.test(element);
}
var elemSet = ['**', 123, 'adv', '-', 45, 'AAA'];
var result = elemSet.every(testValue);
var result2 = elemSet.some(testValue);
console.log(result);  //false
console.log(result2);  //true

var elemSet2 = ['aaa', 'animals', 'vvv'];
result = elemSet2.every(testValue);
result2 = elemSet2.some(testValue);
console.log(result);  //true
console.log(result2);  //true
```

### 2.10 使用一个关联数组来存储表单元素名和值

* [keys()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/keys) 方法返回一个新的Array迭代器，它包含数组中每个索引的键。

```javascript
var elemArray = {};
var elem = document.forms[0].elements[0];
elemArray[elem.id] = elem.value;
var elemArray = {name: 'yt', age:25};
Object.keys(elemArray).forEach(function(key) {
	var value = elemArray[key];
	console.log(value);
});
```

> 待续~