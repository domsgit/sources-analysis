> Returns a filtered copy of an object with only the specified keys, similar to `_.pick` from lodash / underscore.
> 返回对象所需要的键名的过滤的拷贝对象。跟lodash/underscore的`_.pick`类似。

You might also be interested in [object.omit](https://github.com/jonschlinkert/object.omit).
你也许对 [object.omit](https://github.com/jonschlinkert/object.omit) 感兴趣。

## Install 安装

Install with [npm](https://www.npmjs.com/):
用 [npm](https://www.npmjs.com/) 安装：

```sh
$ npm install --save object.pick
```

## benchmarks 性能

This is the [fastest implementation](http://jsperf.com/pick-props) I tested. Pull requests welcome!
这是我测试的 [最快实现](http://jsperf.com/pick-props)。欢迎提交改善意见。

## Usage 用法

```js
var pick = require('object.pick');

pick({a: 'a', b: 'b'}, 'a')
//=> {a: 'a'}

pick({a: 'a', b: 'b', c: 'c'}, ['a', 'b'])
//=> {a: 'a', b: 'b'}
```

### Running tests 跑测试

Install dev dependencies:
安装开发依赖：

```sh
$ npm install -d && npm test
```
