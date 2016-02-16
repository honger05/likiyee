webpackJsonp([8],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {
	var Utils = __webpack_require__(2)

	$('#modify-form').on('submit', function(ev) {
	  ev.preventDefault()

	  var $oldPassword = $('#oldPassword'),
	      $newPassword = $('#newPassword'),
	      $cfrPassword = $('#cfrPassword'),
	      old_val = $.trim($oldPassword.val()),
	      new_val = $.trim($newPassword.val()),
	      cfr_val = $.trim($cfrPassword.val())

	  if (old_val === '') {
	    Utils.UI.toast('请填写原始密码')
	  } else if (new_val === '') {
	    Utils.UI.toast('请填写新密码')
	  } else if (new_val !== cfr_val) {
	    $cfrPassword.val('')
	    Utils.UI.toast('前后输入不一致')
	  } else {
	    var CEIS = Utils.storage.get(Utils.storage.CEIS_SESSION)
	    if (CEIS.exponent && CEIS.modulus) {
	      var key = Utils.RSA.getKeyPair(CEIS.exponent, '', CEIS.modulus)
	      old_val = Utils.RSA.encryptedString(key, old_val)
	      new_val = Utils.RSA.encryptedString(key, new_val)
	    }
	    var req_data = {
	      oldPassword: old_val,
	      newPassword: new_val
	    }
	    $.post(Utils.URL.MODIFYPWD, req_data)
	      .done(function(data) {
	        if (data.status === 'success') {
	          Utils.UI.toast('密码修改成功！')
	        } else {
	          Utils.UI.toast(data.msg)
	        }
	      })
	  }
	})

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }
]);