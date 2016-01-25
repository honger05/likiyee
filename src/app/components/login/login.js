
var RSA_KEY_URL = 'ceis/a/getrsakey.do'

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

$.post(RSA_KEY_URL, {}, function(data) {
  console.log(data)
})
