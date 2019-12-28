'use strict'

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {  //设置代理，虽然调试器访问的是localhost:8080/users/login,但实际上是访问的localhost:3000的。解决了跨域问题
      '/goods':{
        target:'http://localhost:3000'
      },
      '/goods/*':{
        target:'http://localhost:3000'
      },
      '/users/**':{
        target:'http://localhost:3000'
      }
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, 

    
 
    devtool: 'cheap-module-eval-source-map',
    cacheBusting: true,
    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    productionSourceMap: true,
    devtool: '#source-map',

    
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

   
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
