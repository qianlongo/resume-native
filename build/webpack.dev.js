const path = require('path')
const merge = require('webpack-merge')
const webpackBase = require('./webpack.base')

module.exports = merge(webpackBase, {
  devtool: 'inline-source-map',
  devServer: {
    host: '0.0.0.0',
    contentBase: path.resolve(__dirname, '../dist'),
    historyApiFallback: true
  }
})
