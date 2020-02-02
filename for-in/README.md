
> Iterate over the own and inherited enumerable properties of an object, and return an object with properties that evaluate to true from the callback. Exit early by returning `false`. JavaScript/Node.js
> 遍历对象的自身和继承的可数属性，返回回调为true的属性。返回`false`则提前退出。

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save for-in
```

## Usage

```js
var forIn = require('for-in');

var obj = {a: 'foo', b: 'bar', c: 'baz'};
var values = [];
var keys = [];

forIn(obj, function (value, key, o) {
  keys.push(key);
  values.push(value);
});

console.log(keys);
//=> ['a', 'b', 'c'];

console.log(values);
//=> ['foo', 'bar', 'baz'];
```
