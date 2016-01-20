
var Utils = require('utils')
require('../../common/common.scss')

$('#loginForm').submit(function(ev) {
  ev.preventDefault()
  $.AMUI.progress.set(1.0)
  setTimeout(function() {
    $.AMUI.progress.done()
    document.location.href = 'index.html'
  }, 500)
})
