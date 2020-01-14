# fined

Find a file given a declaration of locations.
在给定的位置上找文件。

## Usage

```js
var fined = require('fined');

fined({ path: 'path/to/file', extensions: ['.js', '.json'] });
// => { path: '/absolute/path/to/file.js', extension: '.js' }  (if file exists)
// => null  (if file does not exist)

var opts = {
  name: '.app',
  cwd: '.',
  extensions: {
    'rc': 'default-rc-loader',
    '.yml': 'default-yml-loader',
  },
};

fined({ path: '.' }, opts);
// => { path: '/absolute/of/cwd/.app.yml', extension: { '.yml': 'default-yml-loader' } }

fined({ path: '~', extensions: { 'rc': 'some-special-rc-loader' } }, opts);
// => { path: '/User/home/.apprc', extension: { 'rc': 'some-special-rc-loader' } }
```

## API

### fined(pathObj, opts) => object | null

#### Arguments:

* **pathObj** [string | object] : a path setting for finding a file. 搜索路径。
* **opts** [object] : a plain object supplements `pathObj`. 配置项。

   `pathObj` and `opts` can have same properties: 两者具有相同的属性。

   * **path** [string] : a path string. 路径字符串
   * **name** [string] : a basename. 文件名
   * **extensions**: [string | array | object] : extensions. 扩展名
   * **cwd**: a base directory of `path` and for finding up. 当前工作目录
   * **findUp**: [boolean] : a flag to find up. 是否向上查找

#### Return:

This function returns a plain object which consists of following properties if a file exists otherwise null.
这个函数如果文件存在返回一个包含下面属性的对象，否则返回null。

   * **path** : an absolute path 绝对路径
   * **extension** : a string or a plain object of extension. 扩展字符串或是原生对象
