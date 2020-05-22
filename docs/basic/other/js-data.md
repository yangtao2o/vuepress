# JavaScript算法初级练习

## # 需要定义一个最小值和一个最大值之间的随机数

```javascript
function ourFunction(ourMin, ourMax) {
  return Math.floor(Math.random() * (ourMax - ourMin + 1)) + ourMin;
}

ourFunction(1, 9);

```

## # 计算一个整数的阶乘

```javascript
function factorialize(num) {
  // 请把你的代码写在这里
  if(num <= 1) {
    return 1;
  } else {
    return num *= factorialize(num - 1);
  }
}

factorialize(5);
```

## # 来一段回文
* [JavaScript算法练习： JavaScript中回文(Palindromes)处理](http://www.w3cplus.com/javascript/palindrome-check-in-javascript.html)

```javascript
//方法一
function palindrome(str) {
  // 请把你的代码写在这里
  var re = /[\W_]/g;
  
  var lowRegStr = str.toLowerCase().replace(re, '');
  var reveRegStr = lowRegStr.split('').reverse().join('');
  return lowRegStr == reveRegStr;
}

palindrome("eye");

//方法二
function palindrome(str) {
  // 请把你的代码写在这里
  var re = /[\W_]/g;
  
  var lowRegStr = str.toLowerCase().replace(re, '');
  for(var i=0, l=lowRegStr.length; i<l/2; i++) {
    if(lowRegStr[i] != lowRegStr[l - 1 -i]) {
      return false;
    }
  }
  return true;
}

palindrome("eye");
```

## # 在句子中找出最长的单词，并返回它的长度。
* [js 数组排序和算法排序](http://www.cnblogs.com/chenjinxinlove/p/5579043.html)

```javascript
function findLongestWord(str) {
  var strArr = str = str.split(' ');
  var newArr = [];
  for(var i=0;i<strArr.length; i++) {
    newArr.push(strArr[i].length);
  }
  newArr.sort(function(a, b) {
     return b - a;
  });
  return newArr[0];
}

findLongestWord("What if we try a super-long word such as otorhinolaryngology");
```

## # 确保字符串的每个单词首字母都大写，其余部分小写。

```javascript
function titleCase(str) {
  var strArr = str.split(' ');
  var newStrArr = [];
  var newStr = '';
  for(var i=0; i<strArr.length; i++) {
    newStr = strArr[i][0].toUpperCase();
    newStr += strArr[i].substr(1).toLowerCase();
    newStrArr.push(newStr);
  }

  newStrArr = newStrArr.join(' ');

  return newStrArr;
}

titleCase("I'm a little tea pot");
```

## # 找出多个数组中的最大数

```javascript
function largestOfFour(arr) {
  var newArr = [];
  var num = [];
  for(var i=0; i<arr.length; i++) {
    num = arr[i].sort(function(a, b) {
      return b - a;
    });
    newArr.push(num[0]);
  }
  return newArr;
}

largestOfFour([[4, 5, 1, 3], [13, 27, 18, 26], [32, 35, 37, 39], [1000, 1001, 857, 1]]);
```

## # 判断一个字符串(str)是否以指定的字符串(target)结尾。

```javascript
function confirmEnding(str, target) {
  var len = target.length;
  if(str.substr(-len) == target) {
    return true;
  } else {
    return false;
  }
  
}

confirmEnding("He has to give me a new name", "name");
confirmEnding("Bastian", "n");
```

## # 重复一个指定的字符串 num次，如果num是一个负数则返回一个空字符串。

```javascript
function repeat(str, num) {
  // 请把你的代码写在这里
  var newArr = [];
  var newStr = '';
  if(num < 0) {
    newStr = '';
  } else {
    for(var i=0; i<num; i++) {
      newArr.push(str);
    }
    newStr = newArr.join('');
  }
  return newStr;
}

repeat("abc", 4);
```

## # 如果字符串的长度比指定的参数num长...
* 如果字符串的长度比指定的参数num长，则把多余的部分用...来表示。切记，插入到字符串尾部的三个点号也会计入字符串的长度。但是，如果指定的参数num小于或等于3，则添加的三个点号不会计入字符串的长度。

```javascript
function truncate(str, num) {
  var newStr='';
  if(num >= str.length) {
    newStr = str.slice(0);
  } else if(num > 3) {
    newStr = str.slice(0, num-3) + '...';
  } else {
    newStr = str.slice(0, num) + '...';
  }
  return newStr;
}

truncate("A-tisket a-tasket A green and yellow basket", 11);
```

## # 把一个数组arr按照指定的数组大小size分割成若干个数组块。
* [js将一位数组分割成每三个一组](https://segmentfault.com/q/1010000004921251)

```javascript
function chunk(arr, size) {
  var newArr = [];
  for(var i=0; i<arr.length; i+=size) {
    newArr.push(arr.slice(i, i+size));
  }
  return newArr;
}

chunk(["a", "b", "c", "d"], 2);
```

## # 返回一个数组被截断n个元素后还剩余的元素，截断从索引0开始。

```javascript
function slasher(arr, howMany) {
  arr.splice(0, howMany);
  return arr;
}

slasher([1, 2, 3], 2);
```

## # 如果数组第一个字符串元素包含了第二个字符串元素的所有字符，函数返回true。

```javascript
function mutation(arr) {
  var str1 = arr[0].toLowerCase();  
  var str2 = arr[1].toLowerCase();
  for(var i=0; i<str2.length; i++) {
    if(str1.indexOf(str2[i]) == -1) {
      return false;
    }
  }
  return true;
}

mutation(["hello", "hey"]);
```

## # 删除数组中的所有假值。

```javascript
function bouncer(arr) {
  var newArr = [];
  newArr = arr.filter(function(val) {
    if(val !== (undefined && null && "" && NaN && false && 0)) {
      return val;
    }
  });
  return newArr;
}

bouncer([7, "ate", "", false, 9]);
```

## # 数组排序并找出元素索引，先给数组排序，然后找到指定的值在数组的位置，最后返回位置对应的索引。

```javascript
function where(arr, num) {
  arr.push(num);
  arr.sort(function(a, b) {
    return a-b;
  });  
  return arr.indexOf(num);
}

where([40, 60], 50);
```

## # 实现一个摧毁(destroyer)函数，第一个参数是待摧毁的数组，其余的参数是待摧毁的值。
* [FCC--Seek and Destroy（摧毁数组）](http://blog.csdn.net/wangmc0827/article/details/72529116)
* [Seek and Destroy(算法)](http://www.cnblogs.com/codepen2010/p/6824934.html)

```javascript
function destroyer(arr) {
  var newArr = [];
  var arg = arguments;
  for(var i=1; i<arg.length; i++) {
    newArr.push(arg[i]);
  }
  arr = arr.filter(function(val) {
    return newArr.indexOf(val) < 0;
  });
  return arr;
}

destroyer([1, 2, 3, 1, 2, 3], 2, 3);
```

> 发表于[慕课网手记](http://www.imooc.com/article/20814)

> 题目来自： **FreeCodeCamp** [BasicAlgorithmScripting](https://freecodecamp.cn/map-aside#nested-collapseBasicAlgorithmScripting)
参考资料： [JavaScript标准库](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects)