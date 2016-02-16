webpackJsonp([4],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {
	var Utils = __webpack_require__(2)

	var _ = __webpack_require__(4)

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
	  item_tmpl: __webpack_require__(22),
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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },

/***/ 22:
/***/ function(module, exports) {

	module.exports = "{{#each this}}\r\n<li>\r\n  <a href=\"javascript:void(0)\">\r\n    <div class=\"item-main\">\r\n      <div class=\"item-title-row\">\r\n        <h3 class=\"item-title\" data-objectno={{loanApplySerialNo}}>{{loanApplySerialNo}}</h3>\r\n        <div class=\"item-subtitle-l am-fr\">身份证后四位：<span class=\"am-cid\">{{certId}}</span></div>\r\n        <div class=\"item-after\">{{customerName}}</div>\r\n        <i class=\"icon am-icon-angle-right am-fr\"></i>\r\n      </div>\r\n      <div class=\"item-subtitle\">\r\n        <div class=\"item-subtitle-r\">应还金额：<span class=\"am-rmb\">{{repayAmount}}</span> 元</div>\r\n      </div>\r\n    </div>\r\n  </a>\r\n</li>\r\n{{/each}}\r\n"

/***/ }

});