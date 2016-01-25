
var Utils = require('utils')
require('../../common/common.scss')

var IScroll = $.AMUI.iScroll

// var myScroll = new IScroll('#wrapper', {
//   click: true
// })

var PullDown = require('./pulldown.js')

var pd = new PullDown()

pd.init()
