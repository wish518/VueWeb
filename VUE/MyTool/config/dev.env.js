'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  post:'"8080"',
  NODE_ENV: '"development"',
  GameAPI_URL:'"http://localhost:8080/GameAPI/Api/"',
  CoreAPI_URL:'"http://localhost:8080/CoreAPI/Api/"',
  JumpPath:'"http://localhost"'
})
