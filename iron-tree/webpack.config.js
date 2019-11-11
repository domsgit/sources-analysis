var path = require('path'); // node中跟路径文件相关的内建包
var webpack = require('webpack'); // webpack npm包

module.exports = {
  entry: './src/tree.js', // 入口文件
  output: { // 出口
    path: path.resolve(__dirname, 'dist'), // 目录
    filename: 'index.js', // 文件名
    libraryTarget: 'umd', // 打包目标：umd
    globalObject: "this", // 全局对象
  },
  module: { // 模块
    rules: [ // 规则
      {
        test: /\.js$/, // 针对.js为后缀的文件
        loader: 'babel-loader', // 使用 babel-loader
        options: { // babel-loader规则配置
          presets: ['es2015']
        }
      }
    ]
  },
  resolve: { // 解析
  },
  stats: { // 状态
    colors: true // 颜色状态
  },
  devtool: 'source-map', // 开启 源文件映射
};