webpackJsonp([4],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {
	var Utils = __webpack_require__(3)
	__webpack_require__(2)
	
	$('#loginForm').submit(function(ev) {
	  ev.preventDefault()
	  $.AMUI.progress.set(1.0)
	  setTimeout(function() {
	    $.AMUI.progress.done()
	    document.location.href = 'index.html'
	  }, 500)
	})
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }
]);
//# sourceMappingURL=login.bundle.js.map