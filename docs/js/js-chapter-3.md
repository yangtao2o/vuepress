# 学习《JavaScript经典实例》之第3章

## 第3章 JavaScript的构建块

### 3种基本的创建函数方式：
* 声明式函数
* 匿名函数或函数构造函数
* 函数字面值或函数表达式

### 3.1 放置函数并提升
* 声明式函数，可以放置在代码中的任何位置；函数表达式，必须将其放置在使用函数的位置之前

```javascript
// 在声明一个变量之前打印a
console.log('a', a);  //undefined
var a;
// 在声明一个变量并赋值
console.log('aa', aa);  //undefined
var aa = 1;

// 声明变量发生了提升，但是赋值并没有，赋值是在相应的位置发生的

// 声明式函数，在访问该函数之前，提升将确保把函数声明移动到当前作用域的顶部
console.log(mytest());  //success
function mytest() {
	return 'success';
}
// 使用函数表达式就会报错，变量可能声明了，但没有实例化，但是你的代码试图将这个变量当做一个函数对待
console.log(mytest2());  //TypeError: mytest2 is not a function
var mytest2 = function() {
	return 'success2';
}

```

### 3.2 把一个函数当做参数传递给另一个函数

```javascript
function otherFunction(x, y, z) {
	x(y, z);
}
// 可以像传递一个命名的变量一样，将一个函数作为参数传递给另一个函数
var param = function func(a1, a2) { alert(a1 + " " + a2); };
otherFunction(param, "Hello", "World");
```
* 函数式编程和JavaScript
    * **高阶函数：** 一个函数接受另一个函数作为参数，或者返回一个函数，或者两者都具备
    * **函数式编程：** 对应用程序复杂性进行抽象的一种方式，使用整齐、干净的函数调用替代了复杂的循环和条件语句（代码可读性高）
    * 比如：将数组中的所有数字相加

```javascript
// for循环相加
var nums = [1, 34, 3, 15, 4, 18];
var sum = 0;
for(var i = 0; i < nums.length; i++) {
	sum += nums[i];
}
console.log('sum', sum);  //75

var nums2 = [1, 34, 3, 15, 4, 18];
var sum2 = nums2.reduce(function(n1, n2) {
	return n1 + n2;
});
console.log('sum2', sum2);  //75
```

* [arr.reduce([callback, initialValue])](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce_clone) 方法接收一个函数作为累加器（accumulator），数组中的每个值（从左到右）开始缩减，最终为一个值。

### 3.3 实现递归算法
* 想要实现一个函数，它递归地遍历一个数组并返回一个反向的数组字符串
* 缺点：递归很消耗内存

```javascript
// 阶乘
function factorial(n) {
	return n == 1 ? n : n * factorial(n - 1);
}
console.log('阶乘', factorial(4));  // 24

// 斐波那契
var fibonacci = function(n) {
	return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}
console.log('斐波那契', fibonacci(10));  //55

// 使用一个递归函数字面值来反转数组元素，从最大长度开始，每次迭代都将这个值自减
// 当为 0 时，返回字符串
var reverseArrary = function(x, index, str) {
	return index == 0 ? str : reverseArrary(x, --index, (str += " " + x[index]));
}
var arr = ['apple', 'orange', 'peach', 'lime'];
var str = reverseArrary(arr, arr.length, "");
console.log('str', str);  //lime peach orange apple

// 如果要反过来，按照顺序把数组连接为一个字符串
var orderArray = function(x, i, str) {
	return i == x.length - 1 ? str : orderArray(x, ++i, (str += x[i] + " "));
}

var numArr = [1, 2, 3, 4];
var numStr = orderArray(numArr, -1, "");
console.log('numStr', numStr);  //1 2 3 4 
```

### 3.4 使用一个定时器和回调防止代码阻塞
* 在程序的输出中，3个外围的 `console.log()` 立即被处理了
* 队列中下一个事件是第一个 `noBlock()` 函数调用，其中又调用了 `factorial()` ，记录了其运行时候的活动，最后跟着回调函数的调用
* 第二次同样地调用了 `callBack()`
* 第三次调用 `callBack()` 的时候，回调函数中的调用针对第一次 `callBack()` ，并使用了第一次函数调用的最终结果：6

```javascript
<script type="text/javascript">
function factorial(n) {
	console.log('n', n);
	return n == 1 ? 1 : n * factorial(n - 1);
}
function noBlock(n, callback) {
	setTimeout(function() {
		var val = factorial(n);
		if(callback && typeof callback == 'function') {
			callback(val);
		}
	}, 0);
}
console.log('Top of the morning to you');
noBlock(3, function(n) {
	console.log('first call ends width ' + n);
	noBlock(n, function(m) {
		console.log('final result is ' + m);
	});
});

var tst = 0;
for(var i = 0; i < 10; i++) {
	tst += i;
}
console.log('value of tst is ' + tst);
noBlock(4, function(n) {
	console.log('end result is ' + n);
});
console.log('not doing too much');
</script>
```

> 待续~