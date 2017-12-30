const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const webpackBase = require('./webpack.base')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = merge(webpackBase, {
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../')
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
})
