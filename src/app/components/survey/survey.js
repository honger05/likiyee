
var Utils = require('utils')
require('../../common/common.scss')

var IScroll = $.AMUI.iScroll

// var myScroll = new IScroll('#wrapper', {
//   click: true
// })

var Pull = require('./pull.js')

var pl = new Pull()

pl.init()
