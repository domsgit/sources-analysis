
`node-extend` is a port of the classic extend() method from jQuery. It behaves as you expect. It is simple, tried and true.
`node-extend`是jQuery中经典的extend()函数的一部分。它如你所期。它简单且正确。

Notes: 注意：

* Since Node.js >= 4,
  [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  now offers the same functionality natively (but without the "deep copy" option).
  See [ECMAScript 2015 (ES6) in Node.js](https://nodejs.org/en/docs/es6).
* 自 Node.js >= 4,
  [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  也提供同样的函数原生实现(但是没有深度复制的选项).
  见 [ECMAScript 2015 (ES6) in Node.js](https://nodejs.org/en/docs/es6).
* Some native implementations of `Object.assign` in both Node.js and many
  browsers (since NPM modules are for the browser too) may not be fully
  spec-compliant.
  Check [`object.assign`](https://www.npmjs.com/package/object.assign) module for
  a compliant candidate.
* 一些原生的`Object.assign`实现在Node.js和浏览器（自从NPM模块也可用在浏览器上）可能不是很兼容。
  试试用 [`object.assign`](https://www.npmjs.com/package/object.assign) 模块以便更好的兼容。

## Installation 安装

This package is available on [npm][npm-url] as: `extend`
该包可以使用[npm][npm-url]以`extend`安装

``` sh
npm install extend
```

## Usage 用法

**Syntax:** extend **(** [`deep`], `target`, `object1`, [`objectN`] **)**

*Extend one object with one or more others, returning the modified object.*
*扩展一个或多个对象，返回修改后的对象*

**Example:** **例子：**

``` js
var extend = require('extend');
extend(targetObject, object1, object2);
```

Keep in mind that the target object will be modified, and will be returned from extend().
请记住，目标对象将被修改，并将从extend()返回。

If a boolean true is specified as the first argument, extend performs a deep copy, recursively copying any objects it finds. Otherwise, the copy will share structure with the original object(s).
Undefined properties are not copied. However, properties inherited from the object's prototype will be copied over.
Warning: passing `false` as the first argument is not supported.
如果将布尔值true指定为第一个参数，则extend会执行深度复制，并递归复制其找到的所有对象。 否则，副本将与原始对象共享结构。
未定义的属性不会被复制。 但是，将从对象原型继承的属性复制过来。
警告：不支持将`false`作为第一个参数传递。

### Arguments 参数

* `deep` *Boolean* (optional) 可选
If set, the merge becomes recursive (i.e. deep copy).
如果设置了，则合并是递归的（也就是说：深度复制）。
* `target`	*Object*
The object to extend.
目标对象。
* `object1`	*Object*
The object that will be merged into the first.
会跟第一个对象合并。
* `objectN` *Object* (Optional)
More objects to merge into the first.
跟第一个对象合并的更多的对象。
