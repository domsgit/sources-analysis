
> Loop over each item in an array and call the given function on every element.
> 遍历数组上的每一个元素，并且调用给定的函数作用于每个元素。

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save array-each
```

## Usage

### [each](index.js#L34)

Loop over each item in an array and call the given function on every element.
遍历数组上的每一个元素，并且调用给定的函数作用于每个元素。

**Params**

* `array` **{Array}**
* `fn` **{Function}**
* `thisArg` **{Object}**: (optional) pass a `thisArg` to be used as the context in which to call the function. 回调函数的作用域。
* `returns` **{undefined}**

**Example**

```js
each(['a', 'b', 'c'], function(ele) {
  return ele + ele;
});
//=> ['aa', 'bb', 'cc']

each(['a', 'b', 'c'], function(ele, i) {
  return i + ele;
});
//=> ['0a', '1b', '2c']
```
