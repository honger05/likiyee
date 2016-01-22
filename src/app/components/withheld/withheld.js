
var Utils = require('utils')
require('../../common/common.scss')

$('#searchForm').submit(function(ev) {
  ev.preventDefault()
  $('#smtBtn').button('loading')
  $.AMUI.progress.inc(0.5)
})
