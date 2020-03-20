'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

//------------------------------------开始----------------------------
const Express = require('./Express')
const app = Express.app;
/*// 引用express
const express = require('express')
const app = express();
const request = require("request");
const GameAPI = "http://localhost:11123/GameAPI/Api";
const CoreAPI = "http://localhost:11123/CoreAPI/Api";
//在处理post的接口时需要特定的数据处理程序（若只是get接口则不需要。）
const bodyParser = require('body-parser')
*/
/*app.listen(3000, function () {
  console.log('Success app listening on port 3000!');
});*/
// 使用express的路由router
/*var approuter = express.Router()
app.use('/', approuter)

function httprequest(url, data) {
  var Data = null;
  return new Promise(function (resolve, reject) {
    request({
      url: url,
      method: "POST",
      json: true,
      headers: {
        "content-type": "application/json",
      },
      body: data
    }, async function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body)
      }
    })
  });
};
*/
//------------------------------------END----------------------------
const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },

    //------------------------------------ express模拟接口的位置------------------
    before(app) {
      Express.use(app);
     /* app.use('/', function (req, res, next) {
        console.log('gg');
        next();
      });
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(bodyParser.json());
      app.get('/GameAPI/Api/WORK/GetRecord', (req, res) => {
        console.log('YAP');
        //res.json(httprequest(GameAPI+'/WORK/GetRecord',req))

      });
      app.post('/GameAPI/Api/WORK/GetRecord', async (req, res) => {
        console.log(req.body);
        console.log("post GetRecord");
        var result = await httprequest(GameAPI + '/WORK/GetRecord', req.body);
        res.json(result)
      });
      app.post('/CoreAPI/Api/ChkLogin', async (req, res) => {
        console.log(req.body);
        console.log("post ChkLogin");
        var result = await httprequest(CoreAPI + '/ChkLogin', req.body);
        res.json(result)
      });*/
    }
    ///-------------------------------结束--------------------

  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
