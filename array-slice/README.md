
> Array-slice method. Slices `array` from the `start` index up to, but not including, the `end` index.
> 数组切片方法。数组`array`切片，从不包含`start`索引开始，到`end`索引结束。

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save array-slice
```

This function is used instead of `Array#slice` to support node lists in IE < 9 and to ensure dense arrays are returned. This is also faster than native slice in some cases.
这个函数用于替换`Array#slice`以支持node在IE<9的情况，并且确保不改变原数组。这个函数某些情况下比原生的快。

## Usage

```js
var slice = require('array-slice');
var arr = ['a', 'b', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

slice(arr, 3, 6);
//=> ['e', 'f', 'g']
```
