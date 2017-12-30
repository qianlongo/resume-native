let webpack = require('webpack')
let webpackProd = require('./webpack.prod')

webpack(webpackProd, function (err, stats) {
  if (err) throw err
  console.log('Build complete')
})
