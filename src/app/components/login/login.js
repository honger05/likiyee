
var Utils = require('utils')
require('../../common/common.scss')

$('#loginForm').submit(function(ev) {
  ev.preventDefault()
  $.AMUI.progress.set(0.8)
  $('#loginBtn').button('loading')
  setTimeout(function() {
    $.AMUI.progress.done()
    document.location.href = 'index.html'
  }, 1500)
})
