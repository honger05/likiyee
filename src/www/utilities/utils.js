require('amazeui/less/amazeui.less')

require('./widgets.helper.js')

var progress = $.AMUI.progress

$(window).load(function() {
  progress.done(true)
})

$(document).ready(function() {
  progress.set(0.4)
})

var Utils = {

  CONTEXT_URL: 'ceis/a/',

  log: function(msg) {
    console.log(msg)
  }

}

module.exports = Utils
