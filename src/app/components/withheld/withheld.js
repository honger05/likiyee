
var Utils = require('utils')
require('../../common/common.scss')
var _ = require('underscore')

var params = Utils.getQueryString('p'), repayType

switch (params) {
  case '1':
    repayType = 'PREPAY'
    $('#title').html('预扣款')
    break;
  case '2':
    repayType = 'OVERPAY'
    $('#title').html('逾期扣款')
    break;
  default:
    Utils.forward('./index.html')
}

var repay_list = []

requestRepayList()

function effectStart() {
  $('#smtBtn').button('loading')
  $.AMUI.progress.inc(0.5)
}

function effectDone() {
  $('#smtBtn').button('reset')
  $.AMUI.progress.done()
}

$('#searchForm').submit(function(ev) {
  ev.preventDefault()
  var $certId = $('#certId'),
      $userName = $('#userName'),
      userName_val = $.trim($userName.val()),
      certId_val = $.trim($certId.val())

  if (certId_val !== '' && userName_val === '') {
    Utils.UI.alert('必须输入姓名才能查询')
  } else {
    requestRepayList({
      certId: certId_val,
      userName: userName_val
    })
  }
})

function pagenation(start, count) {
  return [ repay_list.slice(start - 1, count +　start - 1), repay_list.length ]
}

function requestRepayList(params) {
  effectStart()
  params = _.extend({}, params, {
    repayType: repayType
  })
  console.log(params);
  $.post(Utils.URL.REPAY_LIST, params)
    .done(function(data) {
      if (data.status === 'success') {
        repay_list = data.content || []
        pull.init()
      }
    })
    .always(function() {
      effectDone()
    })
}

var pull = new Utils.UI.Pull(null, {
  start: 1,
  count: 10,
  item_id: '#repay-item',
  list_id: '#repay-list',
  pagenation: pagenation
})

$('#repay-list').on('click', 'li', function() {
  var objectno = $(this).find('[data-objectno]').data('objectno')
  if (objectno) {
    utils.storage.set(Utils.storage.PAY_SESSTION, {
      objectNo: objectno,
      repayType: repayType
    })
  }
})
