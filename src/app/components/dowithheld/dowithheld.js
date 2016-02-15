
var Utils = require('utils')
require('../../common/common.scss')

var pay_session = Utils.Storage.get(Utils.Storage.PAY_SESSION)

switch (pay_session.repayType) {
  case 'PREPAY':
    $('#title').html('预扣款操作')
    $('#chevron-left').on('click', function() {
      Utils.Utilities.replace('./withheld.html?p=1')
    })
    break;
  case 'OVERPAY':
    $('#title').html('逾期扣款操作')
    $('#chevron-left').on('click', function() {
      Utils.Utilities.replace('./withheld.html?p=2')
    })
    break;
  default:
    Utils.Utilities.replace('./index.html')
}

Utils.Utilities.unload(function() {
  Utils.Storage.set(Utils.Storage.PAY_SESSION)
})

$.post(Utils.URL.REPAY_DETAIL, pay_session)
  .done(function(data) {
    if (data.status === 'success') {
      var _html = Handlebars.compile($('#detail-tmpl').html())(data.content)
      $('#main').append(_html)
    }
  })

  $('#searchForm').submit(function(ev) {
    ev.preventDefault()
    var payment_val = $.trim($('#payment').val())

    if (payment_val === '') {
      Utils.UI.toast('请输入扣款金额')
    }
    else if (!Utils.REG.isDigit(payment_val)) {
      Utils.UI.toast('请输入合法金额')
    }
    else {
      $('#confirm-modal').modal({
        onConfirm: function(options) {
          confirmPay(payment_val)
        }
      });
    }
  })

  function confirmPay(payment_val) {
    $('#smtBtn').button('loading')
    $.post(Utils.URL.REPAY_DEBIT, {
      objectNo: pay_session.objectNo,
      repayType: pay_session.repayType,
      payMoney: Number(payment_val)
    })
    .done(function(data) {
      Utils.UI.toast(data.msg)
    })
    .always(function() {
      $('#smtBtn').button('reset')
    })
  }
