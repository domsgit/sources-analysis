> Bash-like tilde expansion for node.js. Expands a leading tilde in a file path to the user home directory, or `~+` to the cwd.
> node.js中的类似Bash中的波浪号扩展。扩展一个文件路径前缀到家目录，或者`~+`到当前工作目录。

## Install 安装

Install with [npm](https://www.npmjs.com/):
以 [npm](https://www.npmjs.com/) 安装:

```sh
$ npm install --save expand-tilde
```

## Usage 用法

See the [Bash documentation for Tilde Expansion](https://www.gnu.org/software/bash/manual/html_node/Tilde-Expansion.html).
查看 [Bash 文档之波浪号扩展](https://www.gnu.org/software/bash/manual/html_node/Tilde-Expansion.html)。

```js
var expandTilde = require('expand-tilde');

expandTilde('~')
//=> '/Users/jonschlinkert'

expandTilde('~+')
//=> process.cwd()
```
