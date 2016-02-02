
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

$('#with-smtBtn').on('click', function(ev) {
  var $certId = $('#certId'),
      $userName = $('#userName'),
      userName_val = $.trim($userName.val()),
      certId_val = $.trim($certId.val())

  if (certId_val !== '' && userName_val === '') {
    Utils.UI.alert('必须输入姓名才能查询')
  }
  else {
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
  $('#with-smtBtn').button('loading')
  params = _.extend({}, params, {
    repayType: repayType
  })
  $.post(Utils.URL.REPAY_LIST, params)
    .done(function(data) {
      if (data.status === 'success') {
        repay_list = data.content || []
        pull.init()
      }
    })
    .always(function() {
      $('#with-smtBtn').button('reset')
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
    Utils.storage.set(Utils.storage.PAY_SESSION, {
      objectNo: objectno,
      repayType: repayType
    })
    Utils.forward('./dowithheld.html')
  }
})

requestRepayList()
