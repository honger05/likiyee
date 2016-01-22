
var Utils = require('utils')
require('../../common/common.scss')

$('#searchForm').submit(function(ev) {
  ev.preventDefault()

  $('#my-confirm').modal({
    onConfirm: function(options) {
      $('#smtBtn').button('loading')
    }
  });
})
