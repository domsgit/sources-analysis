

```js
{
  "name": "@denq/iron-tree", // 模块名
  "version": "1.3.2", // 版本
  "description": "Build tree and many method for manipulation", // 模块描述
  "main": "./dist/index.js", // 入口
  "scripts": { // 脚本
    "test": "mocha", // 测试
    "build": "webpack -p", // 编译
    "watch": "webpack -p --watch" // 实时编译
  },
  "repository": { // 仓库
    "type": "git",
    "url": "git+https://github.com/DenQ/iron-tree.git"
  },
  "keywords": [ // 关键词
    "tree",
    "node",
    "criteria",
    "iron-tree",
    "sort tree",
    "remove nodes",
    "contains",
    "move nodes",
    "toJson"
  ],
  "author": "DenQ", // 作者
  "license": "MIT", // 版权
  "bugs": { // bug地址
    "url": "https://github.com/DenQ/iron-tree/issues"
  },
  "homepage": "https://github.com/DenQ/iron-tree#readme", // 主页
  "devDependencies": { // 依赖包
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.5",
    "babel-preset-env": "^1.7.0",
    "babel-preset-es2015": "^6.24.1",
    "chai": "^4.1.1",
    "mocha": "^3.5.0",
    "webpack": "^4.16.3",
    "webpack-cli": "^3.1.0"
  }
}
```