let series = require('run-series')
let copyShared = require('./_copy-shared')
let copyViews = require('./_copy-views')
let copyArc = require('./_copy-arc')
let envVars = require('./_env-vars')

module.exports = function env(callback) {
  series([
    copyShared,
    copyViews,
    copyArc,
    envVars,
  ], callback)
}
