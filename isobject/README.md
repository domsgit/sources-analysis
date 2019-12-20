
> Returns true if the value is an object and not an array or null.
> 如果值是对象且不是数组和空，则返回true。

## Install 安装

Install with [npm](https://www.npmjs.com/):
用 [npm](https://www.npmjs.com/) 安装

```sh
$ npm install --save isobject
```

Use [is-plain-object](https://github.com/jonschlinkert/is-plain-object) if you want only objects that are created by the `Object` constructor.
如果你只想要判别`Object`构造函数创建的对象，使用 [is-plain-object](https://github.com/jonschlinkert/is-plain-object) 。

## Usage 用法

```js
import isObject from 'isobject';
```

**True**

All of the following return `true`:
以下所有返回`true`：

```js
isObject({});
isObject(Object.create({}));
isObject(Object.create(Object.prototype));
isObject(Object.create(null));
isObject({});
isObject(new Foo);
isObject(/foo/);
```

**False**

All of the following return `false`:
以下所有返回`false`：

```js
isObject();
isObject(function () {});
isObject(1);
isObject([]);
isObject(undefined);
isObject(null);
```
