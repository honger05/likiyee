webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($, Handlebars) {
	var Utils = __webpack_require__(2)

	__webpack_require__(32)

	$('#logout').on('click', function() {
	  $.post(Utils.URL.LOGOUT)
	    .done(function(data) {
	      if (data.status === 'success') {
	        Utils.Storage.set('ceis')
	        Utils.Utilities.forward('./login.html')
	      }
	    })
	})

	$.post(Utils.URL.LIST_MENU, {a:1})
	  .done(function(data) {
	    if (data && data.content) {
	      $('#menu-list').prepend(Handlebars.compile('{{>menulist}}')(data.content))
	    }
	  })

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(3)))

/***/ },

/***/ 32:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Handlebars) {
	!function (hbs) {

	  hbs.registerPartial('menulist', '{{#each this}}<li class="am-animation-slide-bottom"><a href="{{href}}"><i class="am-{{icon}} am-icon-fw"></i> {{name}}<i class="am-icon-angle-right am-fr"></i></a></li>{{/each}}')

	}(Handlebars)

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }

});