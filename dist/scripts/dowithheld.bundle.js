webpackJsonp([6],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($, Handlebars) {
	var Utils = __webpack_require__(2)

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
	      var _html = Handlebars.compile(__webpack_require__(20))(data.content)
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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(3)))

/***/ },

/***/ 20:
/***/ function(module, exports) {

	module.exports = "<div class=\"yj-form\">\r\n  <div class=\"yj-form-item\">\r\n    <label for=\"\" class=\"yj-label\">借款人:</label>\r\n    <p class=\"yj-form-text\">{{customerName}}</p>\r\n  </div>\r\n  <div class=\"yj-form-item\">\r\n    <label for=\"\" class=\"yj-label\">借据编号:</label>\r\n    <p class=\"yj-form-text\">{{loanApplySerialNo}}</p>\r\n  </div>\r\n  <div class=\"yj-form-item\">\r\n    <label for=\"\" class=\"yj-label\">身份证后四位:</label>\r\n    <p class=\"yj-form-text\">{{certId}}</p>\r\n  </div>\r\n  <div class=\"yj-form-item\">\r\n    <label for=\"\" class=\"yj-label\">还款日期:</label>\r\n    <p class=\"yj-form-text\">{{repayDate}}</p>\r\n  </div>\r\n  <div class=\"yj-form-item\">\r\n    <label for=\"\" class=\"yj-label\">总计应还:</label>\r\n    <p class=\"yj-form-text\"><span class=\"am-rmb\">{{repayAmount}}</span>元</p>\r\n  </div>\r\n</div>\r\n"

/***/ }

});