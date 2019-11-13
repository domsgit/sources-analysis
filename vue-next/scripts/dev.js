/*
Run Rollup in watch mode for development.
在开发监听模式下启动Rollup。

To specific the package to watch, simply pass its name and the desired build
formats to watch (defaults to "global"):
要指定要监听的软件包，只需传递其名称和所需的监听格式（默认为“全局”）：

```
# name supports fuzzy match. will watch all packages with name containing "dom"
# 名称支持模糊匹配。 将监视所有名称包含“ dom”的软件包
yarn dev dom

# specify the format to output
# 指定输出格式
yarn dev core --formats cjs

# Can also drop all __DEV__ blocks with:
# 也可以删除所有__DEV__块：
__DEV__=false yarn dev
```
*/

const execa = require('execa')
const { fuzzyMatchTarget } = require('./utils')
// yarn dev compiler-core compiler-dom
// =>
// args 为 { _: [ 'compiler-core', 'compiler-dom' ] }
const args = require('minimist')(process.argv.slice(2))
const target = args._.length ? fuzzyMatchTarget(args._)[0] : 'vue'
// yarn dev --formats umd
// =>
// formats 为 umd
const formats = args.formats || args.f
// git rev-parse HEAD 结果取前七位
const commit = execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7)

execa(
  'rollup',
  [
    '-wc',
    '--environment',
    [
      `COMMIT:${commit}`,
      `TARGET:${target}`,
      `FORMATS:${formats || 'global'}`
    ].join(',')
  ],
  {
    stdio: 'inherit'
  }
)
