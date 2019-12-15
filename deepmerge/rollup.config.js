// 使用node解析算法的插件: https://github.com/rollup/plugins/tree/master/packages/node-resolve
import resolve from 'rollup-plugin-node-resolve'
// 把CommonJS模块转成Es模块的插件：https://github.com/rollup/rollup-plugin-commonjs
import commonjs from 'rollup-plugin-commonjs'
import pkg from './package.json'

export default {
	input: `index.js`, // 入口
	plugins: [ // 插件
		commonjs(),
		resolve(),
	],
	output: [ // 出口
		{
			file: pkg.main,
			format: `cjs`
		},
		{
			name: 'deepmerge',
			file: 'dist/umd.js',
			format: `umd`
		},
	],
}
