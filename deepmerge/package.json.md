
```js
{
  "name": "deepmerge", // 包名
  "description": "A library for deep (recursive) merging of Javascript objects", // 包描述：js对象深度（递归）合并的库
  "keywords": [ // 关键词
    "merge",
    "deep",
    "extend",
    "copy",
    "clone",
    "recursive"
  ],
  "version": "4.2.2", // 版本
  "homepage": "https://github.com/TehShrike/deepmerge", // 主页
  "repository": { // 仓库
    "type": "git",
    "url": "git://github.com/TehShrike/deepmerge.git"
  },
  "main": "dist/cjs.js", // 主入口
  "engines": { // 引擎
    "node": ">=0.10.0"
  },
  "scripts": { // 脚本
    "build": "rollup -c",
    "test": "npm run build && tape test/*.js && jsmd readme.md && npm run test:typescript",
    "test:typescript": "tsc --noEmit test/typescript.ts && ts-node test/typescript.ts",
    "size": "npm run build && uglifyjs --compress --mangle -- ./dist/umd.js | gzip -c | wc -c"
  },
  "devDependencies": { // 开发依赖包
    "@types/node": "^8.10.54",
    "is-mergeable-object": "1.1.0",
    "is-plain-object": "^2.0.4",
    "jsmd": "^1.0.2",
    "rollup": "^1.23.1",
    "rollup-plugin-commonjs": "^10.1.0",
    "rollup-plugin-node-resolve": "^5.2.0",
    "tape": "^4.11.0",
    "ts-node": "7.0.1",
    "typescript": "=2.2.2",
    "uglify-js": "^3.6.1"
  },
  "license": "MIT", // 协议
  "dependencies": {} // 依赖包
}
```