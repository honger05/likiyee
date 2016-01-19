
require('amazeui/less/amazeui.less')
require('../../common/common.scss')

var Utils = require('utils')

$('.am-form').submit(function(ev) {
  ev.preventDefault()
  $.AMUI.progress.start()
  setTimeout(function() {
    $.AMUI.progress.done()
    document.location.href = 'index.html'
  }, 1500)
})
