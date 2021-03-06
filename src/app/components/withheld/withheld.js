
var Utils = require('utils')

var _ = require('underscore')

var params = Utils.Utilities.getQueryString('p'), repayType

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
    Utils.Utilities.forward('./index.html')
}

var repay_list = []

var pull = new Utils.Pull(null, {
  start: 1,
  count: 10,
  item_tmpl: require('./item.hbs'),
  list_id: '#repay-list',
  pagenation: pagenation
})

requestRepayList()

function searchList(ev) {
  ev.preventDefault()
  ev.stopPropagation()
  
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
}

function tabItem() {
 var objectno = $(this).find('[data-objectno]').data('objectno')
 if (objectno) {
   Utils.Storage.set(Utils.Storage.PAY_SESSION, {
     objectNo: objectno,
     repayType: repayType
   })
   Utils.Utilities.forward('./dowithheld.html')
 }
}

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

$('#repay-list').on('tap', 'li', tabItem)

$(document).on('tap', '#with-smtBtn', searchList)
