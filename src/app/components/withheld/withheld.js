
var Utils = require('utils')
require('../../common/common.scss')

requestRepayList()

var params = Utils.getQueryString('p')

var repayType = params === '1' ? 'PREPAY' : 'OVERPAY'

var repay_list = []

$('#searchForm').submit(function(ev) {
  ev.preventDefault()
  $('#smtBtn').button('loading')
  $.AMUI.progress.inc(0.5)
})

function pagenation(start, count) {
  return [ repay_list.slice(start - 1, count +　start - 1), repay_list.length ]
}

function requestRepayList() {
  $.post(Utils.URL.REPAY_LIST, {repayType: repayType})
    .done(function(data) {
      if (data.status === 'success') {
        repay_list = data.content
        pull.init()
      }
    })
}

var pull = new Utils.UI.Pull(null, {
  start: 1,
  count: 10,
  item_id: '#repay-item',
  list_id: '#repay-list',
  pagenation: pagenation
})
