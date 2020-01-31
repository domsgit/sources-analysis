# homedir-polyfill [![NPM version](https://img.shields.io/npm/v/homedir-polyfill.svg?style=flat)](https://www.npmjs.com/package/homedir-polyfill) [![NPM monthly downloads](https://img.shields.io/npm/dm/homedir-polyfill.svg?style=flat)](https://npmjs.org/package/homedir-polyfill) [![NPM total downloads](https://img.shields.io/npm/dt/homedir-polyfill.svg?style=flat)](https://npmjs.org/package/homedir-polyfill) [![Linux Build Status](https://img.shields.io/travis/doowb/homedir-polyfill.svg?style=flat&label=Travis)](https://travis-ci.org/doowb/homedir-polyfill) [![Windows Build Status](https://img.shields.io/appveyor/ci/doowb/homedir-polyfill.svg?style=flat&label=AppVeyor)](https://ci.appveyor.com/project/doowb/homedir-polyfill)

> Node.js os.homedir polyfill for older versions of node.js.
> node.js旧版本的 Node.js os.homedir 垫片

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save homedir-polyfill
```

## Usage

```js
var homedir = require('homedir-polyfill');
console.log(homedir());
//=> /Users/doowb
```

## Reasoning 缘由

This library is a polyfill for the [node.js os.homedir](https://nodejs.org/api/os.html#os_os_homedir) method found in modern versions of node.js.
这个库是高版本 [node.js os.homedir](https://nodejs.org/api/os.html#os_os_homedir) 方法的垫片。

This implementation tries to follow the implementation found in `libuv` by finding the current user using the `process.geteuid()` method and the `/etc/passwd` file. This should usually work in a linux environment, but will also fallback to looking at user specific environment variables to build the user's home directory if neccessary.
这个实现试着以`libuv`找到当前用户使用`process.geteuid()`方法和`/etc/passwd`文件的结果实现。可用于linux环境，如果需要，也可以指定用户家目录的环境。

Since `/etc/passwd` is not available on windows platforms, this implementation will use environment variables to find the home directory.
自从`/etc/passwd`在windows平台上不可用，这个实现将使用环境变量来找到家目录。

In modern versions of node.js, [os.homedir](https://nodejs.org/api/os.html#os_os_homedir) is used.
在高版本的node.js，[os.homedir](https://nodejs.org/api/os.html#os_os_homedir)是必须的。
