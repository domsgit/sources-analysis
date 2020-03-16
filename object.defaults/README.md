
> Like `extend` but only copies missing properties/values to the target object.
> 类似 `extend` 但仅复制不存在的属性/值到目标对象上。

## Install 安装

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save object.defaults
```

Install with [bower](https://bower.io/)

```sh
$ bower install object.defaults --save
```

## Usage 用法

```js
var defaults = require('object.defaults');

var obj = {a: 'c'};
defaults(obj, {a: 'bbb', d: 'c'});
console.log(obj);
//=> {a: 'c', d: 'c'}
```

Or immutable defaulting:
或者不改变原对象的方式：

```js
var defaults = require('object.defaults/immutable');
var obj = {a: 'c'};
var defaulted = defaults(obj, {a: 'bbb', d: 'c'});
console.log(obj !== defaulted);
//=> true
```
