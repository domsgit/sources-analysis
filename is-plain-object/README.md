
> Returns true if an object was created by the `Object` constructor.
> 当对象是通过`Object`构造函数创建的时候，返回true。

## Install 安装

Install with [npm](https://www.npmjs.com/):
以 [npm](https://www.npmjs.com/) 安装：

```sh
$ npm install --save is-plain-object
```

Use [isobject](https://github.com/jonschlinkert/isobject) if you only want to check if the value is an object and not an array or null.
如果你只想判断某值不是数组或空的对象时，使用 [isobject](https://github.com/jonschlinkert/isobject) 。

## Usage

```js
import isPlainObject from 'is-plain-object';
```

**true** when created by the `Object` constructor. 当是通过`Object`构造函数创建的时候。

```js
isPlainObject(Object.create({}));
//=> true
isPlainObject(Object.create(Object.prototype));
//=> true
isPlainObject({foo: 'bar'});
//=> true
isPlainObject({});
//=> true
```

**false** when not created by the `Object` constructor. 当不是`Object`构造函数创建的时候。

```js
isPlainObject(1);
//=> false
isPlainObject(['foo', 'bar']);
//=> false
isPlainObject([]);
//=> false
isPlainObject(new Foo);
//=> false
isPlainObject(null);
//=> false
isPlainObject(Object.create(null));
//=> false
```
