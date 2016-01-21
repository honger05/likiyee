webpackJsonp([7],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {
	var Utils = __webpack_require__(3)
	__webpack_require__(2)
	
	$('#doc-form-file').on('change', function() {
	  var fileNames = '';
	  $.each(this.files, function() {
	    fileNames += '<span class="am-badge">' + this.name + '</span> ';
	  });
	  $('#file-list').html(fileNames);
	});
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }
]);
//# sourceMappingURL=dosurvey.bundle.js.map