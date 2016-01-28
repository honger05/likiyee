
var Utils = require('utils')
require('../../common/common.scss')

var params = Utils.getQueryString('p')

$('#searchForm').submit(function(ev) {
  ev.preventDefault()
  $('#smtBtn').button('loading')
  $.AMUI.progress.inc(0.5)
})

$.post(Utils.URL.REPAY_LIST, {repayType: 'PREPAY'})
  .done(function(data) {

  })
