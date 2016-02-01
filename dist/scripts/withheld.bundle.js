webpackJsonp([3],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {
	var Utils = __webpack_require__(9)
	__webpack_require__(12)
	var _ = __webpack_require__(13)

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
	  $('#smtBtn').button('loading')
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
	      $('#smtBtn').button('reset')
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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {
	$(document).ajaxStart(function() {
	  $.AMUI.progress.inc(0.5)
	});

	$(document).ajaxStop(function() {
	  setTimeout(function() {
	    $.AMUI.progress.done()
	  }, 500)
	});

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 4 */
/***/ function(module, exports) {

	
	window.onerror = function(msg) {
	  console.error('window.onerror ' + msg);
	}


/***/ },
/* 5 */
/***/ function(module, exports) {

	
	module.exports = {

	  resizeImageFile: function(file, maxWidth, maxHeight, callback) {
	  	var Img = new Image()
	  	var canvas = document.createElement('canvas')
	  	var ctx = canvas.getContext('2d')

	  	var urlCreator = window.URL || window.webkitURL
	  	// dataURL = urlCreator.createObjectURL(blob)

	  	Img.onload = function() {
	  		if (Img.width > maxWidth || Img.height > maxHeight) {
	  			// eg: mw: 300, mh: 300. iw: 300, ih: 400.
	  			var maxRatio = Math.max(Img.width/maxWidth, Img.height/maxHeight)
	  			// 除以最大比例，得到缩小比例
	  			canvas.width = Img.width/maxRatio
	  			canvas.height = Img.height/maxRatio
	  		}
	  		else {
	  			canvas.width = Img.width
	  			canvas.height = Img.height
	  		}

	  		ctx.drawImage(Img, 0, 0, Img.width, Img.height, 0, 0, canvas.width, canvas.height)

	  		callback(canvas.toDataURL('image/jpeg', 0.5))
	  	}

	  	try {
	  		Img.src = URL.createObjectURL(file)
	  	}
	  	catch(err) {
	  		try {
	  			Img.src = window.webkitURL.createObjectURL(file)
	  		}
	  		catch (ex) {
	  			console.error(ex.message)
	  		}
	  	}
	  },

	  checkExtention: function(filename) {
	     var exts = ['jpg', 'gif', 'png', 'jpeg']
	     var file_chunk = filename.split('.')
	     var file_ext = file_chunk[file_chunk.length - 1].toLowerCase()
	     return exts.some(function(ext) {
	       return file_ext === ext
	     })
	  }

	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($, Handlebars) {
	var Pull = function(element, options) {

	  var $main = $('#wrapper')
	  var $list = $main.find(options.list_id)
	  var $pullDown = $main.find('#pull-down')
	  var $pullDownLabel = $main.find('#pull-down-label')
	  var $pullUp = $main.find('#pull-up')
	  var topOffset = -$pullDown.outerHeight()
	  var iScroll = $.AMUI.iScroll

	  this.compiler = Handlebars.compile($(options.item_id).html())
	  this.prev = this.next = this.start = options.start
	  this.total = null

	  this.renderList = function(start, type) {
	    var _this = this
	    var $el = $pullDown

	    if (type === 'load') {
	      $el = $pullUp
	    }

	    var page = options.pagenation(start, options.count)

	    var html = _this.compiler(page[0])

	    _this.total = page[1]

	    setTimeout(function() {
	      if (type === 'refresh') {
	        $list.children('li').first().before(html)
	      } else if (type === 'load') {
	        $list.append(html)
	      } else {
	        $list.html(html)
	      }

	      setTimeout(function() {
	        _this.iScroll.refresh()
	      }, 100)

	      _this.resetLoading($el)

	      if (type !== 'load') {
	        _this.iScroll.scrollTo(0, topOffset, 800, iScroll.utils.circular)
	      }

	    }, 1000)
	  }

	  this.setLoading = function($el) {
	    $el.addClass('loading');
	  };

	  this.resetLoading = function($el) {
	    $el.removeClass('loading');
	  };

	  this.init = function() {
	    var myScroll = this.iScroll = new iScroll('#wrapper', {
	      click: true
	    })

	    var _this = this, pullFormTop = false, pullStart

	    this.renderList(this.start)

	    myScroll.on('scrollStart', function() {
	      if (this.y >= topOffset) {
	        pullFormTop = true
	      }
	      pullStart = this.y
	    })

	    myScroll.on('scrollEnd', function() {
	      if (pullFormTop && this.directionY === -1) {
	        _this.handlePullDown()
	      }
	      pullFormTop = false;

	      if (pullStart === this.y && (this.directionY === 1)) {
	        _this.handlePullUp()
	      }
	    })

	    this.handlePullDown = function() {
	      console.log('handle pull down')
	      if (this.prev > 0) {
	        this.prev -= options.count
	        this.setLoading($pullDown)
	        this.renderList(this.prev, 'refresh')
	      } else {
	        console.log('别刷了，没有了');
	      }
	    }

	    this.handlePullUp = function() {
	      console.log('handle pull up');
	      if (this.next < this.total) {
	        this.setLoading($pullUp);
	        this.next += options.count;
	        this.renderList(this.next, 'load');
	      } else {
	        console.log(this.next);
	        // this.iScroll.scrollTo(0, topOffset);
	      }
	    }
	  }
	}

	module.exports = Pull

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(2)))

/***/ },
/* 7 */
/***/ function(module, exports) {

	
	module.exports = {

	  // 校验是否全由数字组成
	  isDigit: function(s) {
	    var pattern = /^[0-9]{1,20}$/;
	    if (!pattern.exec(s)) return false
	    return true
	  }

	}


/***/ },
/* 8 */
/***/ function(module, exports) {

	/*
	 * RSA, a suite of routines for performing RSA public-key computations in JavaScript.
	 * Copyright 1998-2005 David Shapiro.
	 * Dave Shapiro
	 * dave@ohdave.com
	 * changed by Fuchun, 2010-05-06
	 * fcrpg2005@gmail.com
	 */

	var RSAUtils = {};

	var biRadixBase = 2;
	var biRadixBits = 16;
	var bitsPerDigit = biRadixBits;
	var biRadix = 1 << 16; // = 2^16 = 65536
	var biHalfRadix = biRadix >>> 1;
	var biRadixSquared = biRadix * biRadix;
	var maxDigitVal = biRadix - 1;
	var maxInteger = 9999999999999998;

	//maxDigits:
	//Change this to accommodate your largest number size. Use setMaxDigits()
	//to change it!
	//
	//In general, if you're working with numbers of size N bits, you'll need 2*N
	//bits of storage. Each digit holds 16 bits. So, a 1024-bit key will need
	//
	//1024 * 2 / 16 = 128 digits of storage.
	//
	var maxDigits;
	var ZERO_ARRAY;
	var bigZero, bigOne;

	var BigInt = BigInt = function(flag) {
		if (typeof flag == "boolean" && flag == true) {
			this.digits = null;
		} else {
			this.digits = ZERO_ARRAY.slice(0);
		}
		this.isNeg = false;
	};

	RSAUtils.setMaxDigits = function(value) {
		maxDigits = value;
		ZERO_ARRAY = new Array(maxDigits);
		for (var iza = 0; iza < ZERO_ARRAY.length; iza++) ZERO_ARRAY[iza] = 0;
		bigZero = new BigInt();
		bigOne = new BigInt();
		bigOne.digits[0] = 1;
	};
	RSAUtils.setMaxDigits(20);

	//The maximum number of digits in base 10 you can convert to an
	//integer without JavaScript throwing up on you.
	var dpl10 = 15;

	RSAUtils.biFromNumber = function(i) {
		var result = new BigInt();
		result.isNeg = i < 0;
		i = Math.abs(i);
		var j = 0;
		while (i > 0) {
			result.digits[j++] = i & maxDigitVal;
			i = Math.floor(i / biRadix);
		}
		return result;
	};

	//lr10 = 10 ^ dpl10
	var lr10 = RSAUtils.biFromNumber(1000000000000000);

	RSAUtils.biFromDecimal = function(s) {
		var isNeg = s.charAt(0) == '-';
		var i = isNeg ? 1 : 0;
		var result;
		// Skip leading zeros.
		while (i < s.length && s.charAt(i) == '0') ++i;
		if (i == s.length) {
			result = new BigInt();
		}
		else {
			var digitCount = s.length - i;
			var fgl = digitCount % dpl10;
			if (fgl == 0) fgl = dpl10;
			result = RSAUtils.biFromNumber(Number(s.substr(i, fgl)));
			i += fgl;
			while (i < s.length) {
				result = RSAUtils.biAdd(RSAUtils.biMultiply(result, lr10),
						RSAUtils.biFromNumber(Number(s.substr(i, dpl10))));
				i += dpl10;
			}
			result.isNeg = isNeg;
		}
		return result;
	};

	RSAUtils.biCopy = function(bi) {
		var result = new BigInt(true);
		result.digits = bi.digits.slice(0);
		result.isNeg = bi.isNeg;
		return result;
	};

	RSAUtils.reverseStr = function(s) {
		var result = "";
		for (var i = s.length - 1; i > -1; --i) {
			result += s.charAt(i);
		}
		return result;
	};

	var hexatrigesimalToChar = [
		'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
		'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
		'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
		'u', 'v', 'w', 'x', 'y', 'z'
	];

	RSAUtils.biToString = function(x, radix) { // 2 <= radix <= 36
		var b = new BigInt();
		b.digits[0] = radix;
		var qr = RSAUtils.biDivideModulo(x, b);
		var result = hexatrigesimalToChar[qr[1].digits[0]];
		while (RSAUtils.biCompare(qr[0], bigZero) == 1) {
			qr = RSAUtils.biDivideModulo(qr[0], b);
			digit = qr[1].digits[0];
			result += hexatrigesimalToChar[qr[1].digits[0]];
		}
		return (x.isNeg ? "-" : "") + RSAUtils.reverseStr(result);
	};

	RSAUtils.biToDecimal = function(x) {
		var b = new BigInt();
		b.digits[0] = 10;
		var qr = RSAUtils.biDivideModulo(x, b);
		var result = String(qr[1].digits[0]);
		while (RSAUtils.biCompare(qr[0], bigZero) == 1) {
			qr = RSAUtils.biDivideModulo(qr[0], b);
			result += String(qr[1].digits[0]);
		}
		return (x.isNeg ? "-" : "") + RSAUtils.reverseStr(result);
	};

	var hexToChar = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
	        'a', 'b', 'c', 'd', 'e', 'f'];

	RSAUtils.digitToHex = function(n) {
		var mask = 0xf;
		var result = "";
		for (i = 0; i < 4; ++i) {
			result += hexToChar[n & mask];
			n >>>= 4;
		}
		return RSAUtils.reverseStr(result);
	};

	RSAUtils.biToHex = function(x) {
		var result = "";
		var n = RSAUtils.biHighIndex(x);
		for (var i = RSAUtils.biHighIndex(x); i > -1; --i) {
			result += RSAUtils.digitToHex(x.digits[i]);
		}
		return result;
	};

	RSAUtils.charToHex = function(c) {
		var ZERO = 48;
		var NINE = ZERO + 9;
		var littleA = 97;
		var littleZ = littleA + 25;
		var bigA = 65;
		var bigZ = 65 + 25;
		var result;

		if (c >= ZERO && c <= NINE) {
			result = c - ZERO;
		} else if (c >= bigA && c <= bigZ) {
			result = 10 + c - bigA;
		} else if (c >= littleA && c <= littleZ) {
			result = 10 + c - littleA;
		} else {
			result = 0;
		}
		return result;
	};

	RSAUtils.hexToDigit = function(s) {
		var result = 0;
		var sl = Math.min(s.length, 4);
		for (var i = 0; i < sl; ++i) {
			result <<= 4;
			result |= RSAUtils.charToHex(s.charCodeAt(i));
		}
		return result;
	};

	RSAUtils.biFromHex = function(s) {
		var result = new BigInt();
		var sl = s.length;
		for (var i = sl, j = 0; i > 0; i -= 4, ++j) {
			result.digits[j] = RSAUtils.hexToDigit(s.substr(Math.max(i - 4, 0), Math.min(i, 4)));
		}
		return result;
	};

	RSAUtils.biFromString = function(s, radix) {
		var isNeg = s.charAt(0) == '-';
		var istop = isNeg ? 1 : 0;
		var result = new BigInt();
		var place = new BigInt();
		place.digits[0] = 1; // radix^0
		for (var i = s.length - 1; i >= istop; i--) {
			var c = s.charCodeAt(i);
			var digit = RSAUtils.charToHex(c);
			var biDigit = RSAUtils.biMultiplyDigit(place, digit);
			result = RSAUtils.biAdd(result, biDigit);
			place = RSAUtils.biMultiplyDigit(place, radix);
		}
		result.isNeg = isNeg;
		return result;
	};

	RSAUtils.biDump = function(b) {
		return (b.isNeg ? "-" : "") + b.digits.join(" ");
	};

	RSAUtils.biAdd = function(x, y) {
		var result;

		if (x.isNeg != y.isNeg) {
			y.isNeg = !y.isNeg;
			result = RSAUtils.biSubtract(x, y);
			y.isNeg = !y.isNeg;
		}
		else {
			result = new BigInt();
			var c = 0;
			var n;
			for (var i = 0; i < x.digits.length; ++i) {
				n = x.digits[i] + y.digits[i] + c;
				result.digits[i] = n % biRadix;
				c = Number(n >= biRadix);
			}
			result.isNeg = x.isNeg;
		}
		return result;
	};

	RSAUtils.biSubtract = function(x, y) {
		var result;
		if (x.isNeg != y.isNeg) {
			y.isNeg = !y.isNeg;
			result = RSAUtils.biAdd(x, y);
			y.isNeg = !y.isNeg;
		} else {
			result = new BigInt();
			var n, c;
			c = 0;
			for (var i = 0; i < x.digits.length; ++i) {
				n = x.digits[i] - y.digits[i] + c;
				result.digits[i] = n % biRadix;
				// Stupid non-conforming modulus operation.
				if (result.digits[i] < 0) result.digits[i] += biRadix;
				c = 0 - Number(n < 0);
			}
			// Fix up the negative sign, if any.
			if (c == -1) {
				c = 0;
				for (var i = 0; i < x.digits.length; ++i) {
					n = 0 - result.digits[i] + c;
					result.digits[i] = n % biRadix;
					// Stupid non-conforming modulus operation.
					if (result.digits[i] < 0) result.digits[i] += biRadix;
					c = 0 - Number(n < 0);
				}
				// Result is opposite sign of arguments.
				result.isNeg = !x.isNeg;
			} else {
				// Result is same sign.
				result.isNeg = x.isNeg;
			}
		}
		return result;
	};

	RSAUtils.biHighIndex = function(x) {
		var result = x.digits.length - 1;
		while (result > 0 && x.digits[result] == 0) --result;
		return result;
	};

	RSAUtils.biNumBits = function(x) {
		var n = RSAUtils.biHighIndex(x);
		var d = x.digits[n];
		var m = (n + 1) * bitsPerDigit;
		var result;
		for (result = m; result > m - bitsPerDigit; --result) {
			if ((d & 0x8000) != 0) break;
			d <<= 1;
		}
		return result;
	};

	RSAUtils.biMultiply = function(x, y) {
		var result = new BigInt();
		var c;
		var n = RSAUtils.biHighIndex(x);
		var t = RSAUtils.biHighIndex(y);
		var u, uv, k;

		for (var i = 0; i <= t; ++i) {
			c = 0;
			k = i;
			for (j = 0; j <= n; ++j, ++k) {
				uv = result.digits[k] + x.digits[j] * y.digits[i] + c;
				result.digits[k] = uv & maxDigitVal;
				c = uv >>> biRadixBits;
				//c = Math.floor(uv / biRadix);
			}
			result.digits[i + n + 1] = c;
		}
		// Someone give me a logical xor, please.
		result.isNeg = x.isNeg != y.isNeg;
		return result;
	};

	RSAUtils.biMultiplyDigit = function(x, y) {
		var n, c, uv;

		result = new BigInt();
		n = RSAUtils.biHighIndex(x);
		c = 0;
		for (var j = 0; j <= n; ++j) {
			uv = result.digits[j] + x.digits[j] * y + c;
			result.digits[j] = uv & maxDigitVal;
			c = uv >>> biRadixBits;
			//c = Math.floor(uv / biRadix);
		}
		result.digits[1 + n] = c;
		return result;
	};

	RSAUtils.arrayCopy = function(src, srcStart, dest, destStart, n) {
		var m = Math.min(srcStart + n, src.length);
		for (var i = srcStart, j = destStart; i < m; ++i, ++j) {
			dest[j] = src[i];
		}
	};

	var highBitMasks = [0x0000, 0x8000, 0xC000, 0xE000, 0xF000, 0xF800,
	        0xFC00, 0xFE00, 0xFF00, 0xFF80, 0xFFC0, 0xFFE0,
	        0xFFF0, 0xFFF8, 0xFFFC, 0xFFFE, 0xFFFF];

	RSAUtils.biShiftLeft = function(x, n) {
		var digitCount = Math.floor(n / bitsPerDigit);
		var result = new BigInt();
		RSAUtils.arrayCopy(x.digits, 0, result.digits, digitCount,
		          result.digits.length - digitCount);
		var bits = n % bitsPerDigit;
		var rightBits = bitsPerDigit - bits;
		for (var i = result.digits.length - 1, i1 = i - 1; i > 0; --i, --i1) {
			result.digits[i] = ((result.digits[i] << bits) & maxDigitVal) |
			                   ((result.digits[i1] & highBitMasks[bits]) >>>
			                    (rightBits));
		}
		result.digits[0] = ((result.digits[i] << bits) & maxDigitVal);
		result.isNeg = x.isNeg;
		return result;
	};

	var lowBitMasks = [0x0000, 0x0001, 0x0003, 0x0007, 0x000F, 0x001F,
	        0x003F, 0x007F, 0x00FF, 0x01FF, 0x03FF, 0x07FF,
	        0x0FFF, 0x1FFF, 0x3FFF, 0x7FFF, 0xFFFF];

	RSAUtils.biShiftRight = function(x, n) {
		var digitCount = Math.floor(n / bitsPerDigit);
		var result = new BigInt();
		RSAUtils.arrayCopy(x.digits, digitCount, result.digits, 0,
		          x.digits.length - digitCount);
		var bits = n % bitsPerDigit;
		var leftBits = bitsPerDigit - bits;
		for (var i = 0, i1 = i + 1; i < result.digits.length - 1; ++i, ++i1) {
			result.digits[i] = (result.digits[i] >>> bits) |
			                   ((result.digits[i1] & lowBitMasks[bits]) << leftBits);
		}
		result.digits[result.digits.length - 1] >>>= bits;
		result.isNeg = x.isNeg;
		return result;
	};

	RSAUtils.biMultiplyByRadixPower = function(x, n) {
		var result = new BigInt();
		RSAUtils.arrayCopy(x.digits, 0, result.digits, n, result.digits.length - n);
		return result;
	};

	RSAUtils.biDivideByRadixPower = function(x, n) {
		var result = new BigInt();
		RSAUtils.arrayCopy(x.digits, n, result.digits, 0, result.digits.length - n);
		return result;
	};

	RSAUtils.biModuloByRadixPower = function(x, n) {
		var result = new BigInt();
		RSAUtils.arrayCopy(x.digits, 0, result.digits, 0, n);
		return result;
	};

	RSAUtils.biCompare = function(x, y) {
		if (x.isNeg != y.isNeg) {
			return 1 - 2 * Number(x.isNeg);
		}
		for (var i = x.digits.length - 1; i >= 0; --i) {
			if (x.digits[i] != y.digits[i]) {
				if (x.isNeg) {
					return 1 - 2 * Number(x.digits[i] > y.digits[i]);
				} else {
					return 1 - 2 * Number(x.digits[i] < y.digits[i]);
				}
			}
		}
		return 0;
	};

	RSAUtils.biDivideModulo = function(x, y) {
		var nb = RSAUtils.biNumBits(x);
		var tb = RSAUtils.biNumBits(y);
		var origYIsNeg = y.isNeg;
		var q, r;
		if (nb < tb) {
			// |x| < |y|
			if (x.isNeg) {
				q = RSAUtils.biCopy(bigOne);
				q.isNeg = !y.isNeg;
				x.isNeg = false;
				y.isNeg = false;
				r = biSubtract(y, x);
				// Restore signs, 'cause they're references.
				x.isNeg = true;
				y.isNeg = origYIsNeg;
			} else {
				q = new BigInt();
				r = RSAUtils.biCopy(x);
			}
			return [q, r];
		}

		q = new BigInt();
		r = x;

		// Normalize Y.
		var t = Math.ceil(tb / bitsPerDigit) - 1;
		var lambda = 0;
		while (y.digits[t] < biHalfRadix) {
			y = RSAUtils.biShiftLeft(y, 1);
			++lambda;
			++tb;
			t = Math.ceil(tb / bitsPerDigit) - 1;
		}
		// Shift r over to keep the quotient constant. We'll shift the
		// remainder back at the end.
		r = RSAUtils.biShiftLeft(r, lambda);
		nb += lambda; // Update the bit count for x.
		var n = Math.ceil(nb / bitsPerDigit) - 1;

		var b = RSAUtils.biMultiplyByRadixPower(y, n - t);
		while (RSAUtils.biCompare(r, b) != -1) {
			++q.digits[n - t];
			r = RSAUtils.biSubtract(r, b);
		}
		for (var i = n; i > t; --i) {
	    var ri = (i >= r.digits.length) ? 0 : r.digits[i];
	    var ri1 = (i - 1 >= r.digits.length) ? 0 : r.digits[i - 1];
	    var ri2 = (i - 2 >= r.digits.length) ? 0 : r.digits[i - 2];
	    var yt = (t >= y.digits.length) ? 0 : y.digits[t];
	    var yt1 = (t - 1 >= y.digits.length) ? 0 : y.digits[t - 1];
			if (ri == yt) {
				q.digits[i - t - 1] = maxDigitVal;
			} else {
				q.digits[i - t - 1] = Math.floor((ri * biRadix + ri1) / yt);
			}

			var c1 = q.digits[i - t - 1] * ((yt * biRadix) + yt1);
			var c2 = (ri * biRadixSquared) + ((ri1 * biRadix) + ri2);
			while (c1 > c2) {
				--q.digits[i - t - 1];
				c1 = q.digits[i - t - 1] * ((yt * biRadix) | yt1);
				c2 = (ri * biRadix * biRadix) + ((ri1 * biRadix) + ri2);
			}

			b = RSAUtils.biMultiplyByRadixPower(y, i - t - 1);
			r = RSAUtils.biSubtract(r, RSAUtils.biMultiplyDigit(b, q.digits[i - t - 1]));
			if (r.isNeg) {
				r = RSAUtils.biAdd(r, b);
				--q.digits[i - t - 1];
			}
		}
		r = RSAUtils.biShiftRight(r, lambda);
		// Fiddle with the signs and stuff to make sure that 0 <= r < y.
		q.isNeg = x.isNeg != origYIsNeg;
		if (x.isNeg) {
			if (origYIsNeg) {
				q = RSAUtils.biAdd(q, bigOne);
			} else {
				q = RSAUtils.biSubtract(q, bigOne);
			}
			y = RSAUtils.biShiftRight(y, lambda);
			r = RSAUtils.biSubtract(y, r);
		}
		// Check for the unbelievably stupid degenerate case of r == -0.
		if (r.digits[0] == 0 && RSAUtils.biHighIndex(r) == 0) r.isNeg = false;

		return [q, r];
	};

	RSAUtils.biDivide = function(x, y) {
		return RSAUtils.biDivideModulo(x, y)[0];
	};

	RSAUtils.biModulo = function(x, y) {
		return RSAUtils.biDivideModulo(x, y)[1];
	};

	RSAUtils.biMultiplyMod = function(x, y, m) {
		return RSAUtils.biModulo(RSAUtils.biMultiply(x, y), m);
	};

	RSAUtils.biPow = function(x, y) {
		var result = bigOne;
		var a = x;
		while (true) {
			if ((y & 1) != 0) result = RSAUtils.biMultiply(result, a);
			y >>= 1;
			if (y == 0) break;
			a = RSAUtils.biMultiply(a, a);
		}
		return result;
	};

	RSAUtils.biPowMod = function(x, y, m) {
		var result = bigOne;
		var a = x;
		var k = y;
		while (true) {
			if ((k.digits[0] & 1) != 0) result = RSAUtils.biMultiplyMod(result, a, m);
			k = RSAUtils.biShiftRight(k, 1);
			if (k.digits[0] == 0 && RSAUtils.biHighIndex(k) == 0) break;
			a = RSAUtils.biMultiplyMod(a, a, m);
		}
		return result;
	};


	BarrettMu = function(m) {
		this.modulus = RSAUtils.biCopy(m);
		this.k = RSAUtils.biHighIndex(this.modulus) + 1;
		var b2k = new BigInt();
		b2k.digits[2 * this.k] = 1; // b2k = b^(2k)
		this.mu = RSAUtils.biDivide(b2k, this.modulus);
		this.bkplus1 = new BigInt();
		this.bkplus1.digits[this.k + 1] = 1; // bkplus1 = b^(k+1)
		this.modulo = BarrettMu_modulo;
		this.multiplyMod = BarrettMu_multiplyMod;
		this.powMod = BarrettMu_powMod;
	};

	function BarrettMu_modulo(x) {
		var $dmath = RSAUtils;
		var q1 = $dmath.biDivideByRadixPower(x, this.k - 1);
		var q2 = $dmath.biMultiply(q1, this.mu);
		var q3 = $dmath.biDivideByRadixPower(q2, this.k + 1);
		var r1 = $dmath.biModuloByRadixPower(x, this.k + 1);
		var r2term = $dmath.biMultiply(q3, this.modulus);
		var r2 = $dmath.biModuloByRadixPower(r2term, this.k + 1);
		var r = $dmath.biSubtract(r1, r2);
		if (r.isNeg) {
			r = $dmath.biAdd(r, this.bkplus1);
		}
		var rgtem = $dmath.biCompare(r, this.modulus) >= 0;
		while (rgtem) {
			r = $dmath.biSubtract(r, this.modulus);
			rgtem = $dmath.biCompare(r, this.modulus) >= 0;
		}
		return r;
	}

	function BarrettMu_multiplyMod(x, y) {
		/*
		x = this.modulo(x);
		y = this.modulo(y);
		*/
		var xy = RSAUtils.biMultiply(x, y);
		return this.modulo(xy);
	}

	function BarrettMu_powMod(x, y) {
		var result = new BigInt();
		result.digits[0] = 1;
		var a = x;
		var k = y;
		while (true) {
			if ((k.digits[0] & 1) != 0) result = this.multiplyMod(result, a);
			k = RSAUtils.biShiftRight(k, 1);
			if (k.digits[0] == 0 && RSAUtils.biHighIndex(k) == 0) break;
			a = this.multiplyMod(a, a);
		}
		return result;
	}

	var RSAKeyPair = function(encryptionExponent, decryptionExponent, modulus) {
		var $dmath = RSAUtils;
		this.e = $dmath.biFromHex(encryptionExponent);
		this.d = $dmath.biFromHex(decryptionExponent);
		this.m = $dmath.biFromHex(modulus);
		// We can do two bytes per digit, so
		// chunkSize = 2 * (number of digits in modulus - 1).
		// Since biHighIndex returns the high index, not the number of digits, 1 has
		// already been subtracted.
		this.chunkSize = 2 * $dmath.biHighIndex(this.m);
		this.radix = 16;
		this.barrett = new BarrettMu(this.m);
	};

	RSAUtils.getKeyPair = function(encryptionExponent, decryptionExponent, modulus) {
		return new RSAKeyPair(encryptionExponent, decryptionExponent, modulus);
	};

	if(typeof twoDigit === 'undefined') {
		twoDigit = function(n) {
			return (n < 10 ? "0" : "") + String(n);
		};
	}

	// Altered by Rob Saunders (rob@robsaunders.net). New routine pads the
	// string after it has been converted to an array. This fixes an
	// incompatibility with Flash MX's ActionScript.
	RSAUtils.encryptedString = function(key, s) {
		var a = [];
		var sl = s.length;
		var i = 0;
		while (i < sl) {
			a[i] = s.charCodeAt(i);
			i++;
		}

		while (a.length % key.chunkSize != 0) {
			a[i++] = 0;
		}

		var al = a.length;
		var result = "";
		var j, k, block;
		for (i = 0; i < al; i += key.chunkSize) {
			block = new BigInt();
			j = 0;
			for (k = i; k < i + key.chunkSize; ++j) {
				block.digits[j] = a[k++];
				block.digits[j] += a[k++] << 8;
			}
			var crypt = key.barrett.powMod(block, key.e);
			var text = key.radix == 16 ? RSAUtils.biToHex(crypt) : RSAUtils.biToString(crypt, key.radix);
			result += text + " ";
		}
		return result.substring(0, result.length - 1); // Remove last space.
	};

	RSAUtils.decryptedString = function(key, s) {
		var blocks = s.split(" ");
		var result = "";
		var i, j, block;
		for (i = 0; i < blocks.length; ++i) {
			var bi;
			if (key.radix == 16) {
				bi = RSAUtils.biFromHex(blocks[i]);
			}
			else {
				bi = RSAUtils.biFromString(blocks[i], key.radix);
			}
			block = key.barrett.powMod(bi, key.d);
			for (j = 0; j <= RSAUtils.biHighIndex(block); ++j) {
				result += String.fromCharCode(block.digits[j] & 255,
				                              block.digits[j] >> 8);
			}
		}
		// Remove trailing null, if any.
		if (result.charCodeAt(result.length - 1) == 0) {
			result = result.substring(0, result.length - 1);
		}
		return result;
	};

	RSAUtils.setMaxDigits(130);

	module.exports = RSAUtils;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($, Handlebars) {__webpack_require__(11)

	__webpack_require__(4)
	__webpack_require__(3)
	__webpack_require__(10)

	var HOST = ''//'http://172.30.2.105:8083/'
	var CONTEXT_URL = HOST + 'ceis/a/'
	var TIMING = 1000

	var Utils = {

	  RSA: __webpack_require__(8),

	  REG: __webpack_require__(7),

	  IMAGE: __webpack_require__(5),

	  URL: {
	    VALIDATA_IMG: HOST + 'ceis/servlet/validateCodeServlet',
	    LOGIN: CONTEXT_URL + 'login',
	    LOGOUT: CONTEXT_URL + 'logout',
	    LIST_MENU: CONTEXT_URL + 'sys/user/listMenus.yy',
	    RSA_KEY: CONTEXT_URL + 'getrsakey.yy',
	    MODIFYPWD: CONTEXT_URL + 'sys/user/modifyPwd.yy',

	    REPAY_LIST: CONTEXT_URL + 'repay/list.yy',
	    REPAY_DETAIL: CONTEXT_URL + 'repay/detail.yy',
	    REPAY_DEBIT: CONTEXT_URL + 'repay/debit.yy',

	    SURVEY_LIST: CONTEXT_URL + 'apy/survey/list.yy',
	    SURVEY_DETAIL: CONTEXT_URL + 'apy/survey/detail.yy',
	    SURVEY_SAVE: CONTEXT_URL + 'apy/survey/save.yy'
	  },

	  UI: {

	    Pull: __webpack_require__(6),

	    effectBody: function() {
	      $(window).load(function() {
	        $.AMUI.progress.done(true)
	      })

	      $(document).ready(function() {
	        $.AMUI.progress.set(0.4)
	      })
	    },

	    toastinit: function() {
	      $('body').append(Handlebars.compile('{{>toast}}')())
	      $('#toast').on('opened.modal.amui', function() {
	        setTimeout(function() {
	          $(this).modal('close')
	        }.bind(this), TIMING)
	      })
	    },

	    toast: function(msg) {
	      $('#toast-cnt').html(msg)
	      $('#toast').modal('open')
	    },

	    alert: function(msg) {
	      $('.am-main').prepend(Handlebars.compile('{{>alert}}')({
	        msg: msg,
	        status: 'warning'
	      }))
	      $('#alert').alert()
	      setTimeout(function() {
	        $('#alert-close').click()
	      }, 3 * TIMING)
	    }

	  },

	  getQueryString: function(name) {
	    var val = ''
	    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
	    var r = window.location.search.substr(1).match(reg)
	    if (r !== null) {
	      val = unescape(r[2])
	    }
	    return val
	  },

	  replace: function(url) {
	    window.location.replace(url)
	  },

	  forward: function(url) {
	    window.location.assign(url)
	  },

	  unload: function(cb) {
	    window.onunload = cb
	  },

	  storage: {
	    PAY_SESSION: 'sfsfjwekjfkwnvdksn',
	    CEIS_SESSION: 'erotijbfkdjgdkfjgip',
	    SURVEY_SESSION: 'rtoypmlmbcjfgkdjor',

	    set: function(key, val) {
	      try {
	        var val_str = JSON.stringify(val || {})
	        window.sessionStorage.setItem('$' + key, val_str)
	      }
	      catch (ex) {
	        console.error('json stringify error!');
	      }
	    },
	    get: function(key) {
	      try {
	        var val = window.sessionStorage.getItem('$' + key) || '{}'
	        return JSON.parse(val)
	      }
	      catch (ex) {
	        console.error('json parse error!');
	      }
	    }
	  },

	  log: function(msg) {
	    console.log(msg)
	  }

	}

	Utils.UI.toastinit()

	$( document ).ajaxError(function(event, jqxhr, settings, thrownError) {
	  console.error([event, jqxhr, settings, thrownError])
	  Utils.UI.toast('系统异常，请稍后重试...')
	  // Utils.forward('./unicorn.html')
	})

	$( document ).ajaxComplete(function( event, xhr, settings ) {
	  // settings.url,
	  var res_data = JSON.parse(xhr.responseText)
	  console.log(res_data)

	  switch (res_data.status) {
	    case 'unlogin':
	      debugger;
	      Utils.replace('./login.html')
	      break;
	    case 'warning':
	      Utils.UI.toast(res_data.msg)
	      break;
	    case 'error':
	      Utils.UI.toast(res_data.msg)
	      break;
	    default:
	      // no code
	  }

	})

	module.exports = Utils

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(2)))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Handlebars) {
	var registerIfCondHelper = function(hbs) {
	hbs.registerHelper('ifCond', function(v1, operator, v2, options) {
	  switch (operator) {
	    case '==':
	      return (v1 == v2) ? options.fn(this) : options.inverse(this);
	      break;
	    case '===':
	      return (v1 === v2) ? options.fn(this) : options.inverse(this);
	      break;
	    case '<':
	      return (v1 < v2) ? options.fn(this) : options.inverse(this);
	      break;
	    case '<=':
	      return (v1 <= v2) ? options.fn(this) : options.inverse(this);
	      break;
	    case '>':
	      return (v1 > v2) ? options.fn(this) : options.inverse(this);
	      break;
	    case '>=':
	      return (v1 >= v2) ? options.fn(this) : options.inverse(this);
	      break;
	    default:
	      return options.inverse(this);
	      break;
	  }
	  return options.inverse(this);
	});
	};

	registerIfCondHelper(Handlebars);


	var registerAMUIPartials = function(hbs) {
	hbs.registerPartial('accordion', "{{#this}}\n  <section data-am-widget=\"accordion\" class=\"am-accordion {{#if theme}}am-accordion-{{theme}}{{else}}am-accordion-default{{/if}}{{#if widgetId}} {{widgetId}}{{/if}}{{#if className}} {{className}}{{/if}}\"{{#if id}} id=\"{{id}}\"{{/if}} data-am-accordion='{ {{#if options.multiple}}\"multiple\": true{{/if}} }'>\n    {{#each content}}\n      <dl class=\"am-accordion-item{{#if active}} am-active{{/if}}{{#if disabled}} am-disabled{{/if}}\">\n        <dt class=\"am-accordion-title\">\n          {{{title}}}\n        </dt>\n        <dd class=\"am-accordion-bd am-collapse {{#if active}}am-in{{/if}}\">\n          <!-- 规避 Collapase 处理有 padding 的折叠内容计算计算有误问题， 加一个容器 -->\n          <div class=\"am-accordion-content\">\n            {{{content}}}\n          </div>\n        </dd>\n      </dl>\n    {{/each}}\n  </section>\n{{/this}}\n");

	hbs.registerPartial('divider', "{{#this}}\n  <hr data-am-widget=\"divider\" style=\"{{#if options.width}}width:{{{options.width}}};{{/if}}{{#if options.height}}height:{{{options.height}}};{{/if}}\" class=\"am-divider {{#if theme}}am-divider-{{theme}}{{else}}am-divider-default{{/if}}{{#if widgetId}} {{widgetId}}{{/if}}{{#if className}} {{className}}{{/if}}\"{{#if id}} id=\"{{id}}\"{{/if}} />\n{{/this}}\n");

	hbs.registerPartial('duoshuo', "{{#this}}\n  <div data-am-widget=\"duoshuo\" class=\"am-duoshuo{{#if theme}} am-duoshuo-{{theme}}{{else}} am-duoshuo-default{{/if}}{{#if widgetId}} {{widgetId}}{{/if}}{{#if className}} {{className}}{{/if}}\"{{#if id}} id=\"{{id}}\"{{/if}} {{#if options.shortName}}data-ds-short-name=\"{{options.shortName}}\"{{/if}}>\n    <div class=\"ds-thread\" {{#if content}}{{#each content}}{{#ifCond @key '==' 'threadKey'}}  data-thread-key=\"{{this}}\"{{else}} data-{{@key}}=\"{{this}}\"{{/ifCond}}{{/each}}{{/if}}>\n    </div>\n  </div>\n{{/this}}");

	hbs.registerPartial('figure', "{{#this}}\n  <figure data-am-widget=\"figure\" class=\"am am-figure {{#if theme}}am-figure-{{theme}}{{else}}am-figure-default{{/if}} {{#if widgetId}} {{widgetId}}{{/if}}{{#if className}} {{className}}{{/if}}\" {{#if id}}\n      id=\"{{id}}\"{{/if}}  data-am-figure=\"{ {{#if options.zoomAble}} pureview: '{{options.zoomAble}}'{{/if}} }\">\n    {{#if content.link}}<a href=\"{{content.link}}\" title=\"{{content.figcaption}}\" class=\"{{className}}\">{{/if}}\n\n    {{#if options.figcaptionPosition}}\n      {{#ifCond options.figcaptionPosition '==' 'top'}}\n        {{#if content.figcaption}}\n          <figcaption class=\"am-figure-capition-top\">\n            {{content.figcaption}}\n          </figcaption>\n        {{/if}}\n      {{/ifCond}}\n    {{/if}}\n\n    {{#if content.img}}\n      <img src=\"{{content.img}}\" {{#if content.rel}}data-rel=\"{{content.rel}}\"{{/if}} alt=\"{{#if content.imgAlt}}{{content.imgAlt}}{{else}}{{content.figcaption}}{{/if}}\"/>\n    {{/if}}\n    {{#if options.figcaptionPosition}}\n      {{#ifCond options.figcaptionPosition '==' 'bottom'}}\n        {{#if content.figcaption}}\n          <figcaption class=\"am-figure-capition-btm\">\n            {{content.figcaption}}\n          </figcaption>\n        {{/if}}\n      {{/ifCond}}\n    {{else}}\n      {{#if content.figcaption}}\n        <figcaption class=\"am-figure-capition-btm\">\n          {{content.figcaption}}\n        </figcaption>\n      {{/if}}\n    {{/if}}\n\n    {{#if content.link}}</a>{{/if}}\n  </figure>\n{{/this}}\n");

	hbs.registerPartial('footer', "{{#this}}\n  <footer data-am-widget=\"footer\"\n          class=\"am-footer {{#if theme}}am-footer-{{theme}}{{else}}am-footer-default {{/if}}{{#if widgetId}} {{widgetId}}{{/if}}{{#if className}} {{className}}{{/if}}\"\n          {{#if id}}id=\"{{id}}\"{{/if}} data-am-footer=\"{ {{#if options.addToHS}}addToHS: 1{{/if}} }\">\n    <div class=\"am-footer-switch\">\n    <span class=\"{{#if options.modal}}am-footer-ysp{{/if}}\" data-rel=\"mobile\"\n          data-am-modal=\"{target: '#am-switch-mode'}\">\n      {{#unless content.switchName}}\n        {{#ifCond content.lang '==' 'en'}}\n          Mobile\n        {{else}}\n          云适配版\n        {{/ifCond}}\n      {{else}}\n        {{content.switchName}}\n      {{/unless}}\n    </span>\n      <span class=\"am-footer-divider\"> | </span>\n      <a id=\"godesktop\" data-rel=\"desktop\" class=\"am-footer-desktop\" href=\"javascript:\">\n        {{#ifCond content.lang '==' 'en'}}\n          Desktop\n        {{else}}\n          电脑版\n        {{/ifCond}}\n      </a>\n    </div>\n    <div class=\"am-footer-miscs {{#if options.textPosition}}am-text-left{{/if}}\">\n\n      {{#if options.techSupportCo}}\n        {{#ifCond content.lang '==' 'en'}}\n          <p>Supported by {{#if options.techSupportSite}}<a href=\"{{options.techSupportSite}}\"\n                                                            title=\"{{options.techSupportCo}}\"\n                                                            target=\"_blank\"> class=\"{{className}}\"{{{options.techSupportCo}}}</a>{{else}}{{{options.techSupportCo}}}{{/if}}\n            .</p>\n        {{else}}\n          <p>由 {{#if options.techSupportSite}}<a href=\"{{options.techSupportSite}}\" title=\"{{options.techSupportCo}}\"\n                                                target=\"_blank\" class=\"{{techSupportClassName}}\">{{{options.techSupportCo}}}</a>{{else}}{{{options.techSupportCo}}}{{/if}}\n            提供技术支持</p>\n        {{/ifCond}}\n      {{/if}}\n      {{#each content.companyInfo}}\n        <p>{{{detail}}}</p>\n      {{/each}}\n    </div>\n  </footer>\n\n  <div id=\"am-footer-modal\"\n       class=\"am-modal am-modal-no-btn am-switch-mode-m {{#if theme}}am-switch-mode-m-{{theme}}{{/if}}\">\n    <div class=\"am-modal-dialog\">\n      <div class=\"am-modal-hd am-modal-footer-hd\">\n        <a href=\"javascript:void(0)\" data-dismiss=\"modal\" class=\"am-close am-close-spin {{className}}\" data-am-modal-close>&times;</a>\n      </div>\n      <div class=\"am-modal-bd\">\n        {{#ifCond content.lang '==' 'en'}}\n          You are visiting\n        {{else}}\n          您正在浏览的是\n        {{/ifCond}}\n\n        <span class=\"am-switch-mode-owner\">\n          {{#if content.owner}}\n            {{content.owner}}\n          {{else}}\n            云适配\n          {{/if}}\n        </span>\n\n        <span class=\"am-switch-mode-slogan\">\n          {{#if content.slogan}}\n            {{{content.slogan}}}\n          {{else}}\n            {{#ifCond content.lang '==' 'en'}}\n              mobilized version for your device.\n            {{else}}\n              为您当前手机订制的移动网站。\n            {{/ifCond}}\n          {{/if}}\n        </span>\n      </div>\n    </div>\n  </div>\n{{/this}}\n");

	hbs.registerPartial('gallery', "{{#this}}\n  <ul data-am-widget=\"gallery\" class=\"am-gallery{{#if options.cols}} am-avg-sm-{{options.cols}}{{else}} am-avg-sm-2{{/if}}\n  am-avg-md-3 am-avg-lg-4 {{#if\n  theme}}am-gallery-{{theme}}{{else}}am-gallery-default{{/if}}{{#if widgetId}} {{widgetId}}{{/if}}{{#if className}} {{className}}{{/if}}\" data-am-gallery=\"{ {{#if options.gallery}}pureview: true{{/if}} }\" {{#if id}}id=\"{{id}}\"{{/if}}>\n    {{#each content}}\n      <li>\n        <div class=\"am-gallery-item\">\n          {{#if link}}\n            <a href=\"{{link}}\" class=\"{{className}}\">\n              {{#if img}}<img src=\"{{img}}\" {{#if rel}}data-rel=\"{{rel}}\"{{/if}} alt=\"{{title}}\"/>{{/if}}\n              {{#if title}}\n                <h3 class=\"am-gallery-title\">{{{title}}}</h3>\n              {{/if}}\n              {{#if desc}}\n                <div class=\"am-gallery-desc\">{{{desc}}}</div>\n              {{/if}}\n            </a>\n          {{else}}\n            {{#if img}}<img src=\"{{img}}\" {{#if rel}}data-rel=\"{{rel}}\"{{/if}} alt=\"{{title}}\"/>{{/if}}\n            {{#if title}}\n              <h3 class=\"am-gallery-title\">{{{title}}}</h3>\n            {{/if}}\n            {{#if desc}}\n              <div class=\"am-gallery-desc\">{{{desc}}}</div>\n            {{/if}}\n          {{/if}}\n        </div>\n      </li>\n    {{/each}}\n  </ul>\n{{/this}}\n");

	hbs.registerPartial('gotop', "{{#this}}\n  <div data-am-widget=\"gotop\" class=\"am-gotop {{#if theme}}am-gotop-{{theme}}{{else}}am-gotop-default{{/if}}{{#if widgetId}} {{widgetId}}{{/if}}{{#if className}} {{className}}{{/if}}\" {{#if id}}id=\"{{id}}\"{{/if}}>\n    <a href=\"#top\" title=\"{{content.title}}\">\n      {{#if content.title}}\n        <span class=\"am-gotop-title\">{{content.title}}</span>\n      {{/if}}\n      {{#if content.customIcon}}\n        <img class=\"am-gotop-icon-custom\" src=\"{{content.customIcon}}\" />\n      {{else}}\n        {{#if content.icon}}\n          <i class=\"am-gotop-icon am-icon-{{content.icon}}\"></i>\n        {{else}}\n          <i class=\"am-gotop-icon am-icon-chevron-up\"></i>\n        {{/if}}\n      {{/if}}\n    </a>\n  </div>\n{{/this}}\n");

	hbs.registerPartial('header', "{{#this}}\n  <header data-am-widget=\"header\"\n          class=\"am-header{{#if theme}} am-header-{{theme}}{{else}} am-header-default{{/if}}{{#if options.fixed}} am-header-fixed{{/if}}{{#if widgetId}} {{widgetId}}{{/if}}{{#if className}} {{className}}{{/if}}\"{{#if id}}\n          id=\"{{id}}\"{{/if}}>\n    {{#if content.left}}\n      <div class=\"am-header-left am-header-nav\">\n        {{#each content.left}}\n          <a href=\"{{link}}\" class=\"{{className}}\">\n            {{#if title}}\n              <span class=\"am-header-nav-title\">\n                {{title}}\n              </span>\n            {{/if}}\n\n            {{# if customIcon}}\n              <img class=\"am-header-icon-custom\" src=\"{{customIcon}}\" alt=\"\"/>\n            {{else}}\n              {{#if icon}}\n                <i class=\"am-header-icon am-icon-{{icon}}\"></i>\n              {{/if}}\n            {{/if}}\n          </a>\n        {{/each}}\n      </div>\n    {{/if}}\n\n    {{#if content.title}}\n      <h1 class=\"am-header-title\">\n        {{#if content.link}}\n          <a href=\"{{content.link}}\" class=\"{{content.className}}\">\n            {{{content.title}}}\n          </a>\n        {{else}}\n          {{{content.title}}}\n        {{/if}}\n      </h1>\n    {{/if}}\n\n    {{#if content.right}}\n      <div class=\"am-header-right am-header-nav\">\n        {{#each content.right}}\n          <a href=\"{{link}}\" class=\"{{className}}\">\n            {{#if title}}\n              <span class=\"am-header-nav-title\">\n                {{title}}\n              </span>\n            {{/if}}\n\n            {{# if customIcon}}\n              <img class=\"am-header-icon-custom\" src=\"{{customIcon}}\" alt=\"\"/>\n            {{else}}\n              {{#if icon}}\n                <i class=\"am-header-icon am-icon-{{icon}}\"></i>\n              {{/if}}\n            {{/if}}\n          </a>\n        {{/each}}\n      </div>\n    {{/if}}\n  </header>\n{{/this}}\n");

	hbs.registerPartial('intro', "{{#this }}\n  <div data-am-widget=\"intro\"\n       class=\"am-intro am-cf {{#if theme}}am-intro-{{theme}}{{else}}am-intro-default{{/if}}{{#if widgetId}} {{widgetId}}{{/if}}{{#if className}} {{className}}{{/if}}\"\n       {{#if id}}id=\"{{id}}\"{{/if}}>\n    {{#if content.title}}\n      <div class=\"am-intro-hd\">\n        <h2 class=\"am-intro-title\">{{{content.title}}}</h2>\n        {{#if content.more.link}}\n          {{#ifCond options.position '==' 'top'}}\n            <a class=\"am-intro-more am-intro-more-top {{content.more.className}}\" href=\"{{content.more.link}}\">{{content.more.title}}</a>\n          {{/ifCond}}\n        {{/if}}\n      </div>\n    {{/if}}\n\n    <div class=\"am-g am-intro-bd\">\n      {{#if content.left}}\n        <div\n            class=\"am-intro-left {{#if options.leftCols}}am-u-sm-{{options.leftCols}}{{/if}}\">{{{content.left}}}</div>\n      {{/if}}\n      {{#if content.right}}\n        <div\n            class=\"am-intro-right {{#if options.rightCols}}am-u-sm-{{options.rightCols}}{{/if}}\">{{{content.right}}}</div>\n      {{/if}}\n    </div>\n    {{#ifCond options.position '==' 'bottom'}}\n      <div class=\"am-intro-more-bottom\">\n        <a class=\"am-btn am-btn-default {{content.more.className}}\"\n           href=\"{{content.more.link}}\">{{content.more.title}}</a>\n      </div>\n    {{/ifCond}}\n  </div>\n{{/this}}\n");

	hbs.registerPartial('list_news', "{{#this}}\n  <div data-am-widget=\"list_news\" class=\"am-list-news{{#if theme}} am-list-news-{{theme}}{{else}} am-list-news-default{{/if}}{{#if widgetId}} {{widgetId}}{{/if}}{{#if className}} {{className}}{{/if}}\" {{#if id}}id=\"{{id}}\"{{/if}}>\n  <!--列表标题-->\n  {{#if content.header.title}}\n    <div class=\"am-list-news-hd am-cf\">\n      {{#if content.header.link}} <!--带更多链接-->\n        <a href=\"{{content.header.link}}\" class=\"{{content.header.className}}\">\n          <h2>{{{content.header.title}}}</h2>\n          {{#ifCond content.header.morePosition '==' 'top'}}\n            <span class=\"am-list-news-more am-fr\">{{{content.header.moreText}}}</span>\n          {{/ifCond}}\n        </a>\n      {{else}} <!--不带更多链接-->\n        <h2>{{{content.header.title}}}</h2>\n      {{/if}}\n    </div>\n  {{/if}}\n\n  <div class=\"am-list-news-bd\">\n  <ul class=\"am-list\">\n  {{#ifCond options.type '==' 'thumb'}}\n    {{#ifCond options.thumbPosition '==' 'top'}} <!--缩略图在标题上方-->\n    {{#each content.main}}\n      <li class=\"am-g{{#if date}} am-list-item-dated{{/if}}{{#if desc}} am-list-item-desced{{/if}}{{#if img}} am-list-item-thumbed am-list-item-thumb-top{{/if}}\">\n        {{!--\n          am-list-item-dated - 带日期\n          am-list-item-desced - 带描述\n          am-list-item-thumbed - 带缩略图的\n        --}}\n        {{#if img}}\n        <div class=\"am-list-thumb am-u-sm-12\">\n          <a href=\"{{link}}\" class=\"{{className}}\">\n            <img src=\"{{img}}\" alt=\"{{title}}\"/>\n          </a>\n          {{#if thumbAddition}}\n            <div class=\"am-list-thumb-addon\">{{{thumbAddition}}}</div>\n          {{/if}}\n        </div>\n        {{/if}}\n\n        <div class=\"{{#if img}}{{/if}} am-list-main\">\n          {{#if title}}\n            <h3 class=\"am-list-item-hd\"><a href=\"{{link}}\" class=\"{{className}}\">{{{title}}}</a></h3>\n          {{/if}}\n\n          {{#if date}}\n            <span class=\"am-list-date\">{{date}}</span>\n          {{/if}}\n\n          {{#if desc}}\n            <div class=\"am-list-item-text\">{{{desc}}}</div>\n          {{/if}}\n\n          {{#if mainAddition}}\n            <div class=\"am-list-news-addon\">{{{mainAddition}}}</div>\n          {{/if}}\n        </div>\n      </li>\n    {{/each}}\n    {{/ifCond}}\n\n    {{#ifCond options.thumbPosition '==' 'bottom-left'}} <!--缩略图在标题下方居左-->\n    {{#each content.main}}\n      <li class=\"am-g{{#if date}} am-list-item-dated{{/if}}{{#if desc}} am-list-item-desced{{/if}}{{#if img}} am-list-item-thumbed am-list-item-thumb-bottom-left{{/if}}\">\n        {{!--\n          am-list-item-dated - 带日期\n          am-list-item-desced - 带描述\n          am-list-item-thumbed - 带缩略图的\n        --}}\n        {{#if title}}\n          <h3 class=\"am-list-item-hd\"><a href=\"{{link}}\" class=\"{{className}}\">{{{title}}}</a></h3>\n        {{/if}}\n        {{#if img}}\n        <div class=\"am-u-sm-4 am-list-thumb\">\n          <a href=\"{{link}}\" class=\"{{className}}\">\n            <img src=\"{{img}}\" alt=\"{{title}}\"/>\n          </a>\n          {{#if thumbAddition}}\n            <div class=\"am-list-thumb-addon\">{{{thumbAddition}}}</div>\n          {{/if}}\n        </div>\n        {{/if}}\n\n        <div class=\"{{#if img}} am-u-sm-8 {{/if}} am-list-main\">\n          {{#if date}}\n            <span class=\"am-list-date\">{{date}}</span>\n          {{/if}}\n\n          {{#if desc}}\n            <div class=\"am-list-item-text\">{{{desc}}}</div>\n          {{/if}}\n\n          {{#if mainAddition}}\n            <div class=\"am-list-news-addon\">{{{mainAddition}}}</div>\n          {{/if}}\n        </div>\n      </li>\n    {{/each}}\n    {{/ifCond}}\n\n    {{#ifCond options.thumbPosition '==' 'bottom-right'}} <!--缩略图在标题下方居右-->\n    {{#each content.main}}\n      <li class=\"am-g{{#if date}} am-list-item-dated{{/if}}{{#if desc}} am-list-item-desced{{/if}}{{#if img}} am-list-item-thumbed am-list-item-thumb-bottom-right{{/if}}\">\n        {{!--\n          am-list-item-dated - 带日期\n          am-list-item-desced - 带描述\n          am-list-item-thumbed - 带缩略图的\n        --}}\n        {{#if title}}\n          <h3 class=\"am-list-item-hd\"><a href=\"{{link}}\" class=\"{{className}}\">{{{title}}}</a></h3>\n        {{/if}}\n\n        <div class=\"{{#if img}} am-u-sm-8{{/if}} am-list-main\">\n          {{#if date}}\n            <span class=\"am-list-date\">{{date}}</span>\n          {{/if}}\n\n          {{#if desc}}\n            <div class=\"am-list-item-text\">{{{desc}}}</div>\n          {{/if}}\n\n          {{#if mainAddition}}\n            <div class=\"am-list-news-addon\">{{{mainAddition}}}</div>\n          {{/if}}\n        </div>\n        {{#if img}}\n        <div class=\"am-list-thumb am-u-sm-4\">\n          <a href=\"{{link}}\" class=\"{{className}}\">\n            <img src=\"{{img}}\" alt=\"{{title}}\"/>\n          </a>\n          {{#if thumbAddition}}\n            <div class=\"am-list-thumb-addon\">{{{thumbAddition}}}</div>\n          {{/if}}\n        </div>\n        {{/if}}\n      </li>\n    {{/each}}\n    {{/ifCond}}\n\n    {{#ifCond options.thumbPosition '==' 'left'}} <!--缩略图在标题左边-->\n    {{#each content.main}}\n      <li class=\"am-g{{#if date}} am-list-item-dated{{/if}}{{#if desc}} am-list-item-desced{{/if}}{{#if img}} am-list-item-thumbed am-list-item-thumb-left{{/if}}\">\n        {{!--\n          am-list-item-dated - 带日期\n          am-list-item-desced - 带描述\n          am-list-item-thumbed - 带缩略图的\n        --}}\n        {{#if img}}\n        <div class=\"am-u-sm-4 am-list-thumb\">\n          <a href=\"{{link}}\" class=\"{{className}}\">\n            <img src=\"{{img}}\" alt=\"{{title}}\"/>\n          </a>\n          {{#if thumbAddition}}\n            <div class=\"am-list-thumb-addon\">{{{thumbAddition}}}</div>\n          {{/if}}\n        </div>\n        {{/if}}\n\n        <div class=\"{{#if img}} am-u-sm-8{{/if}} am-list-main\">\n          {{#if title}}\n            <h3 class=\"am-list-item-hd\"><a href=\"{{link}}\" class=\"{{className}}\">{{{title}}}</a></h3>\n          {{/if}}\n          {{#if date}}\n            <span class=\"am-list-date\">{{date}}</span>\n          {{/if}}\n\n          {{#if desc}}\n            <div class=\"am-list-item-text\">{{{desc}}}</div>\n          {{/if}}\n\n          {{#if mainAddition}}\n            <div class=\"am-list-news-addon\">{{{mainAddition}}}</div>\n          {{/if}}\n        </div>\n      </li>\n    {{/each}}\n    {{/ifCond}}\n\n    {{#ifCond options.thumbPosition '==' 'right'}} <!--缩略图在标题右边-->\n    {{#each content.main}}\n      <li class=\"am-g{{#if date}} am-list-item-dated{{/if}}{{#if desc}} am-list-item-desced{{/if}}{{#if img}} am-list-item-thumbed am-list-item-thumb-right{{/if}}\">\n        {{!--\n          am-list-item-dated - 带日期\n          am-list-item-desced - 带描述\n          am-list-item-thumbed - 带缩略图的\n        --}}\n        <div class=\"{{#if img}} am-u-sm-8{{/if}} am-list-main\">\n          {{#if title}}\n            <h3 class=\"am-list-item-hd\"><a href=\"{{link}}\" class=\"{{className}}\">{{{title}}}</a></h3>\n          {{/if}}\n\n          {{#if date}}\n            <span class=\"am-list-date\">{{date}}</span>\n          {{/if}}\n\n          {{#if desc}}\n            <div class=\"am-list-item-text\">{{{desc}}}</div>\n          {{/if}}\n\n          {{#if mainAddition}}\n            <div class=\"am-list-news-addon\">{{{mainAddition}}}</div>\n          {{/if}}\n        </div>\n        {{#if img}}\n          <div class=\"am-u-sm-4 am-list-thumb\">\n            <a href=\"{{link}}\" class=\"{{className}}\">\n              <img src=\"{{img}}\" alt=\"{{title}}\"/>\n            </a>\n            {{#if thumbAddition}}\n              <div class=\"am-list-thumb-addon\">{{{thumbAddition}}}</div>\n            {{/if}}\n          </div>\n        {{/if}}\n      </li>\n    {{/each}}\n    {{/ifCond}}\n\n  {{else}}{{!--不带缩略图--}}\n    {{#each content.main}}\n      <li class=\"am-g{{#if date}} am-list-item-dated{{/if}}{{#if desc}} am-list-item-desced{{/if}}{{#if img}} am-list-item-thumbed{{/if}}\">\n        {{!--\n          am-list-item-dated - 带日期\n          am-list-item-desced - 带描述\n          am-list-item-thumbed - 带缩略图的\n        --}}\n        {{#if title}}\n          <a href=\"{{link}}\" class=\"am-list-item-hd {{className}}\">{{{title}}}</a>\n        {{/if}}\n\n        {{#if date}}\n          <span class=\"am-list-date\">{{date}}</span>\n        {{/if}}\n\n        {{#if desc}}\n          <div class=\"am-list-item-text\">{{{desc}}}</div>\n        {{/if}}\n\n        {{#if mainAddition}}\n          <div class=\"am-list-news-addon\">{{{mainAddition}}}</div>\n        {{/if}}\n      </li>\n    {{/each}}\n  {{/ifCond}}\n  </ul>\n  </div>\n\n  {{#ifCond content.header.morePosition '==' 'bottom'}}<!--更多在底部-->\n    {{#if content.header.link}}\n      <div class=\"am-list-news-ft\">\n        <a class=\"am-list-news-more am-btn am-btn-default {{content.header.className}}\" href=\"{{content.header.link}}\">{{{content.header.moreText}}}</a>\n      </div>\n    {{/if}}\n  {{/ifCond}}\n  </div>\n{{/this}}\n");

	hbs.registerPartial('map', "{{#this}}\n  <div data-am-widget=\"map\" class=\"am-map {{#if theme}}am-map-{{theme}}{{else}}am-map-default{{/if}}{{#if widgetId}} {{widgetId}}{{/if}}{{#if className}} {{className}}{{/if}}\"\n      data-name=\"{{options.name}}\" data-address=\"{{options.address}}\" data-longitude=\"{{options.longitude}}\" data-latitude=\"{{options.latitude}}\" data-scaleControl=\"{{options.scaleControl}}\" data-zoomControl=\"{{options.zoomControl}}\" data-setZoom=\"{{options.setZoom}}\" data-icon=\"{{options.icon}}\">\n    <div id=\"bd-map\"></div>\n  </div>\n{{/this}}");

	hbs.registerPartial('mechat', "{{#this}}\n  <section data-am-widget=\"mechat\" class=\"am-mechat{{#if theme}} am-mechat-{{theme}}{{else}} am-mechat-default{{/if}}{{#if widgetId}} {{widgetId}}{{/if}}{{#if className}} {{className}}{{/if}}\" {{#if id}} id=\"{{id}}\" {{/if}} {{#if options.unitid}}data-am-mechat-unitid=\"{{options.unitid}}\"{{/if}}>\n    <div id=\"mechat\"></div>\n  </section>\n{{/this}}");

	hbs.registerPartial('menu', "{{#this}}\n  <nav data-am-widget=\"menu\" class=\"am-menu {{#if theme}} am-menu-{{theme}}{{else}} am-menu-default{{/if}}{{#if widgetId}} {{widgetId}}{{/if}}{{#if className}} {{className}}{{/if}}\" {{options.dataset}} {{#if id}}id=\"{{id}}\"{{/if}}\n    {{#ifCond theme '==' 'dropdown1'}} data-am-menu-collapse{{/ifCond}}\n    {{#ifCond theme '==' 'dropdown2'}} data-am-menu-collapse{{/ifCond}}\n    {{#ifCond theme '==' 'slide1'}} data-am-menu-collapse{{/ifCond}}\n    {{#ifCond theme '==' 'offcanvas1'}} data-am-menu-offcanvas{{/ifCond}}\n    {{#ifCond theme '==' 'offcanvas2'}} data-am-menu-offcanvas{{/ifCond}}> {{!-- 与模板深耦合，与 JS 浅耦合 --}}\n    <a href=\"javascript: void(0)\" class=\"am-menu-toggle\">\n      {{#if options.toggleTitle}}\n        <span class=\"am-menu-toggle-title\">{{options.toggleTitle}}</span>\n      {{/if}}\n      {{#if options.toggleCustomIcon}}\n        <img src=\"{{options.toggleCustomIcon}}\" alt=\"Menu Toggle\"/>\n      {{else}}\n        {{#if options.toggleIcon}}\n          <i class=\"am-menu-toggle-icon am-icon-{{options.toggleIcon}}\"></i>\n          {{else}}\n          <i class=\"am-menu-toggle-icon am-icon-bars\"></i>\n        {{/if}}\n      {{/if}}\n    </a>\n\n    {{!-- offCanvas menu Wrap --}}\n    {{!-- 问题：方便用户，但是与主题名称（类名）耦合过深 --}}\n    {{#ifCond theme '==' 'offcanvas1'}}\n    <div class=\"am-offcanvas\" {{#if options.closeOffCanvasOnclick}}data-dismiss-on=\"click\"{{/if}}>\n      <div class=\"am-offcanvas-bar{{#if options.offCanvasFlip}} am-offcanvas-bar-flip{{/if}}\">\n    {{/ifCond}}\n    {{#ifCond theme '==' 'offcanvas2'}}\n    <div class=\"am-offcanvas\">\n      <div class=\"am-offcanvas-bar{{#if options.offCanvasFlip}} am-offcanvas-bar-flip{{/if}}\">\n    {{/ifCond}}\n\n    {{#if content}}\n      <ul class=\"am-menu-nav {{#if options.cols}}am-avg-sm-{{options\n      .cols}}{{else}}am-avg-sm-1{{/if}}{{#ifCond theme '==' 'dropdown1'}} am-collapse{{/ifCond}}{{#ifCond theme\n      '==' 'dropdown2'}} am-collapse{{/ifCond}}{{#ifCond theme\n      '==' 'slide1'}} am-collapse{{/ifCond}}\">\n        {{#each content}}\n          <li class=\"{{#if subMenu}}am-parent{{/if}}{{#if className}} {{className}}{{/if}}\">\n            <a href=\"{{link}}\" class=\"{{className}}\" {{#if target}}target=\"{{target}}\" {{/if}}>{{{title}}}</a>\n            {{#if subMenu}}\n              <ul class=\"am-menu-sub am-collapse {{#if subCols}} am-avg-sm-{{subCols}}{{else}}\n              am-avg-sm-1{{/if}} {{subMenuClassName}}\">\n                {{#each subMenu}}\n                  <li class=\"{{#if subMenu}} am-parent{{/if}}{{#if className}} {{className}}{{/if}}\">\n                    <a href=\"{{link}}\" class=\"{{className}}\" {{#if target}}target=\"{{target}}\" {{/if}}>{{{title}}}</a>\n                  </li>\n                {{/each}}\n                {{!-- 显示进入栏目链接 --}}\n                {{#if channelLink}}\n                  <li class=\"am-menu-nav-channel\"><a href=\"{{link}}\" class=\"{{className}}\" title=\"{{title}}\">{{{channelLink}}}</a></li>\n                {{/if}}\n              </ul>\n            {{/if}}\n          </li>\n        {{/each}}\n      </ul>\n    {{/if}}\n\n    {{#ifCond theme '==' 'offcanvas1'}}\n      </div>\n    </div>\n    {{/ifCond}}\n    {{#ifCond theme '==' 'offcanvas2'}}\n      </div>\n    </div>\n    {{/ifCond}}\n    {{!-- 不要问我为什么这样写，我也不想这样 --}}\n  </nav>\n{{/this}}\n");

	hbs.registerPartial('navbar', "{{#this}}\n  <div data-am-widget=\"navbar\" class=\"am-navbar am-cf {{#if theme}}am-navbar-{{theme}}{{else}}am-navbar-default{{/if}} {{#if options.iconPosition}}am-navbar-inline{{/if}}{{#if widgetId}} {{widgetId}}{{/if}}{{#if className}} {{className}}{{/if}}\"\n      id=\"{{id}}\">\n    {{#if content}}\n      <ul class=\"am-navbar-nav am-cf {{#if options.cols}}am-avg-sm-{{options.cols}}{{/if}}\">\n        {{#each content}}\n          <li {{{dataApi}}}>\n            <a href=\"{{link}}\" class=\"{{className}}\">\n              {{#if customIcon}}\n                <img src=\"{{customIcon}}\" alt=\"{{title}}\"/>\n              {{else}}\n                {{#if icon}}\n                  <span class=\"am-icon-{{icon}}\"></span>\n                {{/if}}\n              {{/if}}\n              {{#if title}}\n                <span class=\"am-navbar-label\">{{title}}</span>\n              {{/if}}\n            </a>\n          </li>\n        {{/each}}\n      </ul>\n    {{/if}}\n  </div>\n{{/this}}\n");

	hbs.registerPartial('pagination', "{{#this}}\n  <ul data-am-widget=\"pagination\"\n      class=\"am-pagination {{#if theme}}am-pagination-{{theme}}{{else}}am-pagination-default{{/if}}{{#if widgetId}} {{widgetId}}{{/if}}{{#if className}} {{className}}{{/if}}\"\n      {{#if id}}id=\"{{id}}\"{{/if}}>\n\n    {{#if content.firstTitle}}\n      <li class=\"am-pagination-first {{content.firstClassName}}\">\n        <a href=\"{{content.firstLink}}\" class=\"{{content.firstClassName}}\">{{{content.firstTitle}}}</a>\n      </li>\n    {{/if}}\n\n    {{#if content.prevTitle}}\n      <li class=\"am-pagination-prev {{content.prevClassName}}\">\n        <a href=\"{{content.prevLink}}\" class=\"{{content.prevClassName}}\">{{{content.prevTitle}}}</a>\n      </li>\n    {{/if}}\n\n    {{! 移除 options.select，根据主题来判断结构，无奈 handlebars 逻辑处理...}}\n\n    {{#if content.page}}\n      {{#ifCond theme '==' 'select'}}\n        <li class=\"am-pagination-select\">\n          <select>\n            {{#each content.page}}\n              <option value=\"{{link}}\" class=\"{{className}}\">{{title}}{{#if ../content.total}}\n                / {{../../content.total}}{{/if}}\n              </option>\n            {{/each}}\n          </select>\n        </li>\n      {{else}}\n        {{#ifCond theme '==' 'one'}}\n          <li class=\"am-pagination-select\">\n            <select>\n              {{#each content.page}}\n                {{content.total}}\n                <option value=\"{{link}}\" class=\"{{className}}\">{{title}}{{#if ../content.total}}\n                  / {{../../content.total}}{{/if}}\n                </option>\n              {{/each}}\n            </select>\n          </li>\n        {{else}}\n          {{#each content.page}}\n            <li class=\"{{className}}\">\n              <a href=\"{{link}}\" class=\"{{className}}\">{{{title}}}</a>\n            </li>\n          {{/each}}\n        {{/ifCond}}\n      {{/ifCond}}\n\n    {{/if}}\n\n    {{#if content.nextTitle}}\n      <li class=\"am-pagination-next {{content.nextClassName}}\">\n        <a href=\"{{content.nextLink}}\" class=\"{{content.nextClassName}}\">{{{content.nextTitle}}}</a>\n      </li>\n    {{/if}}\n\n    {{#if content.lastTitle}}\n      <li class=\"am-pagination-last {{content.lastClassName}}\">\n        <a href=\"{{content.lastLink}}\" class=\"{{content.lastClassName}}\">{{{content.lastTitle}}}</a>\n      </li>\n    {{/if}}\n  </ul>\n{{/this}}\n");

	hbs.registerPartial('paragraph', "{{#this}}\n  <article data-am-widget=\"paragraph\"\n           class=\"am-paragraph {{#if theme}}am-paragraph-{{theme}}{{else}}am-paragraph-default{{/if}}{{#if widgetId}} {{widgetId}}{{/if}}{{#if className}} {{className}}{{/if}}\"\n           {{#if id}}id=\"{{id}}\"{{/if}}\n           data-am-paragraph=\"{ {{#if options.tableScrollable}}tableScrollable: true,{{/if}} {{#if options.imgLightbox}}pureview: true{{/if}} }\">\n\n    {{#if content}}\n      {{{ content.content }}}\n    {{/if}}\n  </article>\n{{/this}}\n");

	hbs.registerPartial('slider', "{{#this}}\n  <div data-am-widget=\"slider\" class=\"am-slider {{#if theme}}am-slider-{{theme}}{{else}}am-slider-default{{/if}}{{#if widgetId}} {{widgetId}}{{/if}}{{#if className}} {{className}}{{/if}}\" data-am-slider='{{sliderConfig}}' {{#if id}}id=\"{{id}}\"{{/if}}>\n  <ul class=\"am-slides\">\n    {{#each content}}\n      <li{{#if thumb}} data-thumb=\"{{thumb}}\"{{/if}}>\n        {{#if link}}\n          <a href=\"{{link}}\" class=\"{{className}}\">\n        {{/if}}\n        {{#if img}}\n        \t<img src=\"{{img}}\">\n        {{/if}}\n        {{#if desc}}\n          <div class=\"am-slider-desc\">{{{desc}}}</div>\n        {{/if}}\n        {{#if link}}</a>{{/if}} {{!--/end link--}}\n      </li>\n    {{/each}}\n  </ul>\n</div>\n{{/this}}");

	hbs.registerPartial('tabs', "{{#this}}\n  <div data-am-widget=\"tabs\"\n       class=\"am-tabs{{#if theme}} am-tabs-{{theme}}{{else}} am-tabs-default{{/if}}{{#if widgetId}} {{widgetId}}{{/if}}{{#if className}} {{className}}{{/if}}\"\n       {{#if id}}id=\"{{id}}\"{{/if}} {{#if options.noSwipe}}data-am-tabs-noswipe=\"1\"{{/if}}>\n    {{#if content}}\n      <ul class=\"am-tabs-nav am-cf\">\n        {{#each content}}\n          <li class=\"{{#if active}}am-active{{/if}}\"><a href=\"[data-tab-panel-{{@index}}]\">{{{title}}}</a></li>\n        {{/each}}\n      </ul>\n      <div class=\"am-tabs-bd\">\n        {{#each content}}\n          <div data-tab-panel-{{@index}} class=\"am-tab-panel {{#if active}}am-active{{/if}}\">\n            {{{content}}}\n          </div>\n        {{/each}}\n      </div>\n    {{/if}}\n  </div>\n{{/this}}\n");

	hbs.registerPartial('titlebar', "{{#this}}\n<div data-am-widget=\"titlebar\" class=\"am-titlebar {{#if theme}}am-titlebar-{{theme}}{{else}}am-titlebar-default{{/if}}{{#if widgetId}} {{widgetId}}{{/if}}{{#if className}} {{className}}{{/if}}\" {{#if id}}id=\"{{id}}\"{{/if}}>\n  {{#if content.title}}\n    <h2 class=\"am-titlebar-title {{#unless content.link}}{{content.className}}{{/unless}}\">\n      {{#if content.link}}\n        <a href=\"{{content.link}}\" class=\"{{content.className}}\">{{{content.title}}}</a>\n      {{else}}\n        {{{content.title}}}\n      {{/if}}\n    </h2>\n  {{/if}}\n\n  {{#if content.nav}}\n    <nav class=\"am-titlebar-nav\">\n      {{#each content.nav}}\n        <a href=\"{{link}}\" class=\"{{className}}\">{{{title}}}</a>\n      {{/each}}\n    </nav>\n  {{/if}}\n</div>\n{{/this}}\n");

	hbs.registerPartial('wechatpay', "{{#this}}\n  <div data-am-widget=\"wechatpay\" class=\"am-wechatpay{{#if theme}} am-wechatpay-{{theme}}{{else}} am-wechatpay-default{{/if}}{{#if widgetId}} {{widgetId}}{{/if}}{{#if className}} {{className}}{{/if}}\"{{#if id}} id=\"{{id}}\"{{/if}} data-wechat-pay=\"{ {{#each content.order}} {{@key}}: '{{this}}',{{/each}} }\">\n      <button type=\"button\" class=\"am-btn am-btn-primary am-btn-block am-wechatpay-btn\">\n        {{#if content.title}}\n          {{content.title}}\n        {{else}}\n          微信支付\n        {{/if}}\n      </button>\n  </div>\n{{/this}}\n");

	hbs.registerPartial('toast', ' <div class="am-modal am-modal-no-btn" tabindex="-1" id="toast"><div class="am-modal-dialog"><div class="am-modal-bd" id="toast-cnt"></div></div></div>')

	hbs.registerPartial('alert', '<div class="am-alert am-alert-{{status}}" id="alert"><button type="button" class="am-close" id="alert-close">&times;</button><p id="alert-cnt">{{msg}}</p></div>')

	};

	registerAMUIPartials(Handlebars);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 11 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 12 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
	//     http://underscorejs.org
	//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Underscore may be freely distributed under the MIT license.

	(function() {

	  // Baseline setup
	  // --------------

	  // Establish the root object, `window` in the browser, or `exports` on the server.
	  var root = this;

	  // Save the previous value of the `_` variable.
	  var previousUnderscore = root._;

	  // Save bytes in the minified (but not gzipped) version:
	  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

	  // Create quick reference variables for speed access to core prototypes.
	  var
	    push             = ArrayProto.push,
	    slice            = ArrayProto.slice,
	    toString         = ObjProto.toString,
	    hasOwnProperty   = ObjProto.hasOwnProperty;

	  // All **ECMAScript 5** native function implementations that we hope to use
	  // are declared here.
	  var
	    nativeIsArray      = Array.isArray,
	    nativeKeys         = Object.keys,
	    nativeBind         = FuncProto.bind,
	    nativeCreate       = Object.create;

	  // Naked function reference for surrogate-prototype-swapping.
	  var Ctor = function(){};

	  // Create a safe reference to the Underscore object for use below.
	  var _ = function(obj) {
	    if (obj instanceof _) return obj;
	    if (!(this instanceof _)) return new _(obj);
	    this._wrapped = obj;
	  };

	  // Export the Underscore object for **Node.js**, with
	  // backwards-compatibility for the old `require()` API. If we're in
	  // the browser, add `_` as a global object.
	  if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	      exports = module.exports = _;
	    }
	    exports._ = _;
	  } else {
	    root._ = _;
	  }

	  // Current version.
	  _.VERSION = '1.8.3';

	  // Internal function that returns an efficient (for current engines) version
	  // of the passed-in callback, to be repeatedly applied in other Underscore
	  // functions.
	  var optimizeCb = function(func, context, argCount) {
	    if (context === void 0) return func;
	    switch (argCount == null ? 3 : argCount) {
	      case 1: return function(value) {
	        return func.call(context, value);
	      };
	      case 2: return function(value, other) {
	        return func.call(context, value, other);
	      };
	      case 3: return function(value, index, collection) {
	        return func.call(context, value, index, collection);
	      };
	      case 4: return function(accumulator, value, index, collection) {
	        return func.call(context, accumulator, value, index, collection);
	      };
	    }
	    return function() {
	      return func.apply(context, arguments);
	    };
	  };

	  // A mostly-internal function to generate callbacks that can be applied
	  // to each element in a collection, returning the desired result — either
	  // identity, an arbitrary callback, a property matcher, or a property accessor.
	  var cb = function(value, context, argCount) {
	    if (value == null) return _.identity;
	    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
	    if (_.isObject(value)) return _.matcher(value);
	    return _.property(value);
	  };
	  _.iteratee = function(value, context) {
	    return cb(value, context, Infinity);
	  };

	  // An internal function for creating assigner functions.
	  var createAssigner = function(keysFunc, undefinedOnly) {
	    return function(obj) {
	      var length = arguments.length;
	      if (length < 2 || obj == null) return obj;
	      for (var index = 1; index < length; index++) {
	        var source = arguments[index],
	            keys = keysFunc(source),
	            l = keys.length;
	        for (var i = 0; i < l; i++) {
	          var key = keys[i];
	          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
	        }
	      }
	      return obj;
	    };
	  };

	  // An internal function for creating a new object that inherits from another.
	  var baseCreate = function(prototype) {
	    if (!_.isObject(prototype)) return {};
	    if (nativeCreate) return nativeCreate(prototype);
	    Ctor.prototype = prototype;
	    var result = new Ctor;
	    Ctor.prototype = null;
	    return result;
	  };

	  var property = function(key) {
	    return function(obj) {
	      return obj == null ? void 0 : obj[key];
	    };
	  };

	  // Helper for collection methods to determine whether a collection
	  // should be iterated as an array or as an object
	  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
	  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	  var getLength = property('length');
	  var isArrayLike = function(collection) {
	    var length = getLength(collection);
	    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	  };

	  // Collection Functions
	  // --------------------

	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles raw objects in addition to array-likes. Treats all
	  // sparse array-likes as if they were dense.
	  _.each = _.forEach = function(obj, iteratee, context) {
	    iteratee = optimizeCb(iteratee, context);
	    var i, length;
	    if (isArrayLike(obj)) {
	      for (i = 0, length = obj.length; i < length; i++) {
	        iteratee(obj[i], i, obj);
	      }
	    } else {
	      var keys = _.keys(obj);
	      for (i = 0, length = keys.length; i < length; i++) {
	        iteratee(obj[keys[i]], keys[i], obj);
	      }
	    }
	    return obj;
	  };

	  // Return the results of applying the iteratee to each element.
	  _.map = _.collect = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length,
	        results = Array(length);
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      results[index] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  };

	  // Create a reducing function iterating left or right.
	  function createReduce(dir) {
	    // Optimized iterator function as using arguments.length
	    // in the main function will deoptimize the, see #1991.
	    function iterator(obj, iteratee, memo, keys, index, length) {
	      for (; index >= 0 && index < length; index += dir) {
	        var currentKey = keys ? keys[index] : index;
	        memo = iteratee(memo, obj[currentKey], currentKey, obj);
	      }
	      return memo;
	    }

	    return function(obj, iteratee, memo, context) {
	      iteratee = optimizeCb(iteratee, context, 4);
	      var keys = !isArrayLike(obj) && _.keys(obj),
	          length = (keys || obj).length,
	          index = dir > 0 ? 0 : length - 1;
	      // Determine the initial value if none is provided.
	      if (arguments.length < 3) {
	        memo = obj[keys ? keys[index] : index];
	        index += dir;
	      }
	      return iterator(obj, iteratee, memo, keys, index, length);
	    };
	  }

	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`.
	  _.reduce = _.foldl = _.inject = createReduce(1);

	  // The right-associative version of reduce, also known as `foldr`.
	  _.reduceRight = _.foldr = createReduce(-1);

	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, predicate, context) {
	    var key;
	    if (isArrayLike(obj)) {
	      key = _.findIndex(obj, predicate, context);
	    } else {
	      key = _.findKey(obj, predicate, context);
	    }
	    if (key !== void 0 && key !== -1) return obj[key];
	  };

	  // Return all the elements that pass a truth test.
	  // Aliased as `select`.
	  _.filter = _.select = function(obj, predicate, context) {
	    var results = [];
	    predicate = cb(predicate, context);
	    _.each(obj, function(value, index, list) {
	      if (predicate(value, index, list)) results.push(value);
	    });
	    return results;
	  };

	  // Return all the elements for which a truth test fails.
	  _.reject = function(obj, predicate, context) {
	    return _.filter(obj, _.negate(cb(predicate)), context);
	  };

	  // Determine whether all of the elements match a truth test.
	  // Aliased as `all`.
	  _.every = _.all = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (!predicate(obj[currentKey], currentKey, obj)) return false;
	    }
	    return true;
	  };

	  // Determine if at least one element in the object matches a truth test.
	  // Aliased as `any`.
	  _.some = _.any = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (predicate(obj[currentKey], currentKey, obj)) return true;
	    }
	    return false;
	  };

	  // Determine if the array or object contains a given item (using `===`).
	  // Aliased as `includes` and `include`.
	  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
	    if (!isArrayLike(obj)) obj = _.values(obj);
	    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	    return _.indexOf(obj, item, fromIndex) >= 0;
	  };

	  // Invoke a method (with arguments) on every item in a collection.
	  _.invoke = function(obj, method) {
	    var args = slice.call(arguments, 2);
	    var isFunc = _.isFunction(method);
	    return _.map(obj, function(value) {
	      var func = isFunc ? method : value[method];
	      return func == null ? func : func.apply(value, args);
	    });
	  };

	  // Convenience version of a common use case of `map`: fetching a property.
	  _.pluck = function(obj, key) {
	    return _.map(obj, _.property(key));
	  };

	  // Convenience version of a common use case of `filter`: selecting only objects
	  // containing specific `key:value` pairs.
	  _.where = function(obj, attrs) {
	    return _.filter(obj, _.matcher(attrs));
	  };

	  // Convenience version of a common use case of `find`: getting the first object
	  // containing specific `key:value` pairs.
	  _.findWhere = function(obj, attrs) {
	    return _.find(obj, _.matcher(attrs));
	  };

	  // Return the maximum element (or element-based computation).
	  _.max = function(obj, iteratee, context) {
	    var result = -Infinity, lastComputed = -Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value > result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };

	  // Return the minimum element (or element-based computation).
	  _.min = function(obj, iteratee, context) {
	    var result = Infinity, lastComputed = Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value < result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed < lastComputed || computed === Infinity && result === Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };

	  // Shuffle a collection, using the modern version of the
	  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	  _.shuffle = function(obj) {
	    var set = isArrayLike(obj) ? obj : _.values(obj);
	    var length = set.length;
	    var shuffled = Array(length);
	    for (var index = 0, rand; index < length; index++) {
	      rand = _.random(0, index);
	      if (rand !== index) shuffled[index] = shuffled[rand];
	      shuffled[rand] = set[index];
	    }
	    return shuffled;
	  };

	  // Sample **n** random values from a collection.
	  // If **n** is not specified, returns a single random element.
	  // The internal `guard` argument allows it to work with `map`.
	  _.sample = function(obj, n, guard) {
	    if (n == null || guard) {
	      if (!isArrayLike(obj)) obj = _.values(obj);
	      return obj[_.random(obj.length - 1)];
	    }
	    return _.shuffle(obj).slice(0, Math.max(0, n));
	  };

	  // Sort the object's values by a criterion produced by an iteratee.
	  _.sortBy = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    return _.pluck(_.map(obj, function(value, index, list) {
	      return {
	        value: value,
	        index: index,
	        criteria: iteratee(value, index, list)
	      };
	    }).sort(function(left, right) {
	      var a = left.criteria;
	      var b = right.criteria;
	      if (a !== b) {
	        if (a > b || a === void 0) return 1;
	        if (a < b || b === void 0) return -1;
	      }
	      return left.index - right.index;
	    }), 'value');
	  };

	  // An internal function used for aggregate "group by" operations.
	  var group = function(behavior) {
	    return function(obj, iteratee, context) {
	      var result = {};
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index) {
	        var key = iteratee(value, index, obj);
	        behavior(result, value, key);
	      });
	      return result;
	    };
	  };

	  // Groups the object's values by a criterion. Pass either a string attribute
	  // to group by, or a function that returns the criterion.
	  _.groupBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
	  });

	  // Indexes the object's values by a criterion, similar to `groupBy`, but for
	  // when you know that your index values will be unique.
	  _.indexBy = group(function(result, value, key) {
	    result[key] = value;
	  });

	  // Counts instances of an object that group by a certain criterion. Pass
	  // either a string attribute to count by, or a function that returns the
	  // criterion.
	  _.countBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key]++; else result[key] = 1;
	  });

	  // Safely create a real, live array from anything iterable.
	  _.toArray = function(obj) {
	    if (!obj) return [];
	    if (_.isArray(obj)) return slice.call(obj);
	    if (isArrayLike(obj)) return _.map(obj, _.identity);
	    return _.values(obj);
	  };

	  // Return the number of elements in an object.
	  _.size = function(obj) {
	    if (obj == null) return 0;
	    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
	  };

	  // Split a collection into two arrays: one whose elements all satisfy the given
	  // predicate, and one whose elements all do not satisfy the predicate.
	  _.partition = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var pass = [], fail = [];
	    _.each(obj, function(value, key, obj) {
	      (predicate(value, key, obj) ? pass : fail).push(value);
	    });
	    return [pass, fail];
	  };

	  // Array Functions
	  // ---------------

	  // Get the first element of an array. Passing **n** will return the first N
	  // values in the array. Aliased as `head` and `take`. The **guard** check
	  // allows it to work with `_.map`.
	  _.first = _.head = _.take = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[0];
	    return _.initial(array, array.length - n);
	  };

	  // Returns everything but the last entry of the array. Especially useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N.
	  _.initial = function(array, n, guard) {
	    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	  };

	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array.
	  _.last = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[array.length - 1];
	    return _.rest(array, Math.max(0, array.length - n));
	  };

	  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
	  // Especially useful on the arguments object. Passing an **n** will return
	  // the rest N values in the array.
	  _.rest = _.tail = _.drop = function(array, n, guard) {
	    return slice.call(array, n == null || guard ? 1 : n);
	  };

	  // Trim out all falsy values from an array.
	  _.compact = function(array) {
	    return _.filter(array, _.identity);
	  };

	  // Internal implementation of a recursive `flatten` function.
	  var flatten = function(input, shallow, strict, startIndex) {
	    var output = [], idx = 0;
	    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
	      var value = input[i];
	      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
	        //flatten current level of array or arguments object
	        if (!shallow) value = flatten(value, shallow, strict);
	        var j = 0, len = value.length;
	        output.length += len;
	        while (j < len) {
	          output[idx++] = value[j++];
	        }
	      } else if (!strict) {
	        output[idx++] = value;
	      }
	    }
	    return output;
	  };

	  // Flatten out an array, either recursively (by default), or just one level.
	  _.flatten = function(array, shallow) {
	    return flatten(array, shallow, false);
	  };

	  // Return a version of the array that does not contain the specified value(s).
	  _.without = function(array) {
	    return _.difference(array, slice.call(arguments, 1));
	  };

	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // Aliased as `unique`.
	  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
	    if (!_.isBoolean(isSorted)) {
	      context = iteratee;
	      iteratee = isSorted;
	      isSorted = false;
	    }
	    if (iteratee != null) iteratee = cb(iteratee, context);
	    var result = [];
	    var seen = [];
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var value = array[i],
	          computed = iteratee ? iteratee(value, i, array) : value;
	      if (isSorted) {
	        if (!i || seen !== computed) result.push(value);
	        seen = computed;
	      } else if (iteratee) {
	        if (!_.contains(seen, computed)) {
	          seen.push(computed);
	          result.push(value);
	        }
	      } else if (!_.contains(result, value)) {
	        result.push(value);
	      }
	    }
	    return result;
	  };

	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  _.union = function() {
	    return _.uniq(flatten(arguments, true, true));
	  };

	  // Produce an array that contains every item shared between all the
	  // passed-in arrays.
	  _.intersection = function(array) {
	    var result = [];
	    var argsLength = arguments.length;
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var item = array[i];
	      if (_.contains(result, item)) continue;
	      for (var j = 1; j < argsLength; j++) {
	        if (!_.contains(arguments[j], item)) break;
	      }
	      if (j === argsLength) result.push(item);
	    }
	    return result;
	  };

	  // Take the difference between one array and a number of other arrays.
	  // Only the elements present in just the first array will remain.
	  _.difference = function(array) {
	    var rest = flatten(arguments, true, true, 1);
	    return _.filter(array, function(value){
	      return !_.contains(rest, value);
	    });
	  };

	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  _.zip = function() {
	    return _.unzip(arguments);
	  };

	  // Complement of _.zip. Unzip accepts an array of arrays and groups
	  // each array's elements on shared indices
	  _.unzip = function(array) {
	    var length = array && _.max(array, getLength).length || 0;
	    var result = Array(length);

	    for (var index = 0; index < length; index++) {
	      result[index] = _.pluck(array, index);
	    }
	    return result;
	  };

	  // Converts lists into objects. Pass either a single array of `[key, value]`
	  // pairs, or two parallel arrays of the same length -- one of keys, and one of
	  // the corresponding values.
	  _.object = function(list, values) {
	    var result = {};
	    for (var i = 0, length = getLength(list); i < length; i++) {
	      if (values) {
	        result[list[i]] = values[i];
	      } else {
	        result[list[i][0]] = list[i][1];
	      }
	    }
	    return result;
	  };

	  // Generator function to create the findIndex and findLastIndex functions
	  function createPredicateIndexFinder(dir) {
	    return function(array, predicate, context) {
	      predicate = cb(predicate, context);
	      var length = getLength(array);
	      var index = dir > 0 ? 0 : length - 1;
	      for (; index >= 0 && index < length; index += dir) {
	        if (predicate(array[index], index, array)) return index;
	      }
	      return -1;
	    };
	  }

	  // Returns the first index on an array-like that passes a predicate test
	  _.findIndex = createPredicateIndexFinder(1);
	  _.findLastIndex = createPredicateIndexFinder(-1);

	  // Use a comparator function to figure out the smallest index at which
	  // an object should be inserted so as to maintain order. Uses binary search.
	  _.sortedIndex = function(array, obj, iteratee, context) {
	    iteratee = cb(iteratee, context, 1);
	    var value = iteratee(obj);
	    var low = 0, high = getLength(array);
	    while (low < high) {
	      var mid = Math.floor((low + high) / 2);
	      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
	    }
	    return low;
	  };

	  // Generator function to create the indexOf and lastIndexOf functions
	  function createIndexFinder(dir, predicateFind, sortedIndex) {
	    return function(array, item, idx) {
	      var i = 0, length = getLength(array);
	      if (typeof idx == 'number') {
	        if (dir > 0) {
	            i = idx >= 0 ? idx : Math.max(idx + length, i);
	        } else {
	            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
	        }
	      } else if (sortedIndex && idx && length) {
	        idx = sortedIndex(array, item);
	        return array[idx] === item ? idx : -1;
	      }
	      if (item !== item) {
	        idx = predicateFind(slice.call(array, i, length), _.isNaN);
	        return idx >= 0 ? idx + i : -1;
	      }
	      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
	        if (array[idx] === item) return idx;
	      }
	      return -1;
	    };
	  }

	  // Return the position of the first occurrence of an item in an array,
	  // or -1 if the item is not included in the array.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
	  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

	  // Generate an integer Array containing an arithmetic progression. A port of
	  // the native Python `range()` function. See
	  // [the Python documentation](http://docs.python.org/library/functions.html#range).
	  _.range = function(start, stop, step) {
	    if (stop == null) {
	      stop = start || 0;
	      start = 0;
	    }
	    step = step || 1;

	    var length = Math.max(Math.ceil((stop - start) / step), 0);
	    var range = Array(length);

	    for (var idx = 0; idx < length; idx++, start += step) {
	      range[idx] = start;
	    }

	    return range;
	  };

	  // Function (ahem) Functions
	  // ------------------

	  // Determines whether to execute a function as a constructor
	  // or a normal function with the provided arguments
	  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
	    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	    var self = baseCreate(sourceFunc.prototype);
	    var result = sourceFunc.apply(self, args);
	    if (_.isObject(result)) return result;
	    return self;
	  };

	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	  // available.
	  _.bind = function(func, context) {
	    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
	    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
	    var args = slice.call(arguments, 2);
	    var bound = function() {
	      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
	    };
	    return bound;
	  };

	  // Partially apply a function by creating a version that has had some of its
	  // arguments pre-filled, without changing its dynamic `this` context. _ acts
	  // as a placeholder, allowing any combination of arguments to be pre-filled.
	  _.partial = function(func) {
	    var boundArgs = slice.call(arguments, 1);
	    var bound = function() {
	      var position = 0, length = boundArgs.length;
	      var args = Array(length);
	      for (var i = 0; i < length; i++) {
	        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
	      }
	      while (position < arguments.length) args.push(arguments[position++]);
	      return executeBound(func, bound, this, this, args);
	    };
	    return bound;
	  };

	  // Bind a number of an object's methods to that object. Remaining arguments
	  // are the method names to be bound. Useful for ensuring that all callbacks
	  // defined on an object belong to it.
	  _.bindAll = function(obj) {
	    var i, length = arguments.length, key;
	    if (length <= 1) throw new Error('bindAll must be passed function names');
	    for (i = 1; i < length; i++) {
	      key = arguments[i];
	      obj[key] = _.bind(obj[key], obj);
	    }
	    return obj;
	  };

	  // Memoize an expensive function by storing its results.
	  _.memoize = function(func, hasher) {
	    var memoize = function(key) {
	      var cache = memoize.cache;
	      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
	      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
	      return cache[address];
	    };
	    memoize.cache = {};
	    return memoize;
	  };

	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  _.delay = function(func, wait) {
	    var args = slice.call(arguments, 2);
	    return setTimeout(function(){
	      return func.apply(null, args);
	    }, wait);
	  };

	  // Defers a function, scheduling it to run after the current call stack has
	  // cleared.
	  _.defer = _.partial(_.delay, _, 1);

	  // Returns a function, that, when invoked, will only be triggered at most once
	  // during a given window of time. Normally, the throttled function will run
	  // as much as it can, without ever going more than once per `wait` duration;
	  // but if you'd like to disable the execution on the leading edge, pass
	  // `{leading: false}`. To disable execution on the trailing edge, ditto.
	  _.throttle = function(func, wait, options) {
	    var context, args, result;
	    var timeout = null;
	    var previous = 0;
	    if (!options) options = {};
	    var later = function() {
	      previous = options.leading === false ? 0 : _.now();
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    };
	    return function() {
	      var now = _.now();
	      if (!previous && options.leading === false) previous = now;
	      var remaining = wait - (now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0 || remaining > wait) {
	        if (timeout) {
	          clearTimeout(timeout);
	          timeout = null;
	        }
	        previous = now;
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      } else if (!timeout && options.trailing !== false) {
	        timeout = setTimeout(later, remaining);
	      }
	      return result;
	    };
	  };

	  // Returns a function, that, as long as it continues to be invoked, will not
	  // be triggered. The function will be called after it stops being called for
	  // N milliseconds. If `immediate` is passed, trigger the function on the
	  // leading edge, instead of the trailing.
	  _.debounce = function(func, wait, immediate) {
	    var timeout, args, context, timestamp, result;

	    var later = function() {
	      var last = _.now() - timestamp;

	      if (last < wait && last >= 0) {
	        timeout = setTimeout(later, wait - last);
	      } else {
	        timeout = null;
	        if (!immediate) {
	          result = func.apply(context, args);
	          if (!timeout) context = args = null;
	        }
	      }
	    };

	    return function() {
	      context = this;
	      args = arguments;
	      timestamp = _.now();
	      var callNow = immediate && !timeout;
	      if (!timeout) timeout = setTimeout(later, wait);
	      if (callNow) {
	        result = func.apply(context, args);
	        context = args = null;
	      }

	      return result;
	    };
	  };

	  // Returns the first function passed as an argument to the second,
	  // allowing you to adjust arguments, run code before and after, and
	  // conditionally execute the original function.
	  _.wrap = function(func, wrapper) {
	    return _.partial(wrapper, func);
	  };

	  // Returns a negated version of the passed-in predicate.
	  _.negate = function(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    };
	  };

	  // Returns a function that is the composition of a list of functions, each
	  // consuming the return value of the function that follows.
	  _.compose = function() {
	    var args = arguments;
	    var start = args.length - 1;
	    return function() {
	      var i = start;
	      var result = args[start].apply(this, arguments);
	      while (i--) result = args[i].call(this, result);
	      return result;
	    };
	  };

	  // Returns a function that will only be executed on and after the Nth call.
	  _.after = function(times, func) {
	    return function() {
	      if (--times < 1) {
	        return func.apply(this, arguments);
	      }
	    };
	  };

	  // Returns a function that will only be executed up to (but not including) the Nth call.
	  _.before = function(times, func) {
	    var memo;
	    return function() {
	      if (--times > 0) {
	        memo = func.apply(this, arguments);
	      }
	      if (times <= 1) func = null;
	      return memo;
	    };
	  };

	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  _.once = _.partial(_.before, 2);

	  // Object Functions
	  // ----------------

	  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
	  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
	  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
	                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

	  function collectNonEnumProps(obj, keys) {
	    var nonEnumIdx = nonEnumerableProps.length;
	    var constructor = obj.constructor;
	    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

	    // Constructor is a special case.
	    var prop = 'constructor';
	    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

	    while (nonEnumIdx--) {
	      prop = nonEnumerableProps[nonEnumIdx];
	      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
	        keys.push(prop);
	      }
	    }
	  }

	  // Retrieve the names of an object's own properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`
	  _.keys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (_.has(obj, key)) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };

	  // Retrieve all the property names of an object.
	  _.allKeys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    var keys = [];
	    for (var key in obj) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };

	  // Retrieve the values of an object's properties.
	  _.values = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var values = Array(length);
	    for (var i = 0; i < length; i++) {
	      values[i] = obj[keys[i]];
	    }
	    return values;
	  };

	  // Returns the results of applying the iteratee to each element of the object
	  // In contrast to _.map it returns an object
	  _.mapObject = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys =  _.keys(obj),
	          length = keys.length,
	          results = {},
	          currentKey;
	      for (var index = 0; index < length; index++) {
	        currentKey = keys[index];
	        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
	      }
	      return results;
	  };

	  // Convert an object into a list of `[key, value]` pairs.
	  _.pairs = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var pairs = Array(length);
	    for (var i = 0; i < length; i++) {
	      pairs[i] = [keys[i], obj[keys[i]]];
	    }
	    return pairs;
	  };

	  // Invert the keys and values of an object. The values must be serializable.
	  _.invert = function(obj) {
	    var result = {};
	    var keys = _.keys(obj);
	    for (var i = 0, length = keys.length; i < length; i++) {
	      result[obj[keys[i]]] = keys[i];
	    }
	    return result;
	  };

	  // Return a sorted list of the function names available on the object.
	  // Aliased as `methods`
	  _.functions = _.methods = function(obj) {
	    var names = [];
	    for (var key in obj) {
	      if (_.isFunction(obj[key])) names.push(key);
	    }
	    return names.sort();
	  };

	  // Extend a given object with all the properties in passed-in object(s).
	  _.extend = createAssigner(_.allKeys);

	  // Assigns a given object with all the own properties in the passed-in object(s)
	  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
	  _.extendOwn = _.assign = createAssigner(_.keys);

	  // Returns the first key on an object that passes a predicate test
	  _.findKey = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = _.keys(obj), key;
	    for (var i = 0, length = keys.length; i < length; i++) {
	      key = keys[i];
	      if (predicate(obj[key], key, obj)) return key;
	    }
	  };

	  // Return a copy of the object only containing the whitelisted properties.
	  _.pick = function(object, oiteratee, context) {
	    var result = {}, obj = object, iteratee, keys;
	    if (obj == null) return result;
	    if (_.isFunction(oiteratee)) {
	      keys = _.allKeys(obj);
	      iteratee = optimizeCb(oiteratee, context);
	    } else {
	      keys = flatten(arguments, false, false, 1);
	      iteratee = function(value, key, obj) { return key in obj; };
	      obj = Object(obj);
	    }
	    for (var i = 0, length = keys.length; i < length; i++) {
	      var key = keys[i];
	      var value = obj[key];
	      if (iteratee(value, key, obj)) result[key] = value;
	    }
	    return result;
	  };

	   // Return a copy of the object without the blacklisted properties.
	  _.omit = function(obj, iteratee, context) {
	    if (_.isFunction(iteratee)) {
	      iteratee = _.negate(iteratee);
	    } else {
	      var keys = _.map(flatten(arguments, false, false, 1), String);
	      iteratee = function(value, key) {
	        return !_.contains(keys, key);
	      };
	    }
	    return _.pick(obj, iteratee, context);
	  };

	  // Fill in a given object with default properties.
	  _.defaults = createAssigner(_.allKeys, true);

	  // Creates an object that inherits from the given prototype object.
	  // If additional properties are provided then they will be added to the
	  // created object.
	  _.create = function(prototype, props) {
	    var result = baseCreate(prototype);
	    if (props) _.extendOwn(result, props);
	    return result;
	  };

	  // Create a (shallow-cloned) duplicate of an object.
	  _.clone = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	  };

	  // Invokes interceptor with the obj, and then returns obj.
	  // The primary purpose of this method is to "tap into" a method chain, in
	  // order to perform operations on intermediate results within the chain.
	  _.tap = function(obj, interceptor) {
	    interceptor(obj);
	    return obj;
	  };

	  // Returns whether an object has a given set of `key:value` pairs.
	  _.isMatch = function(object, attrs) {
	    var keys = _.keys(attrs), length = keys.length;
	    if (object == null) return !length;
	    var obj = Object(object);
	    for (var i = 0; i < length; i++) {
	      var key = keys[i];
	      if (attrs[key] !== obj[key] || !(key in obj)) return false;
	    }
	    return true;
	  };


	  // Internal recursive comparison function for `isEqual`.
	  var eq = function(a, b, aStack, bStack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b) return a !== 0 || 1 / a === 1 / b;
	    // A strict comparison is necessary because `null == undefined`.
	    if (a == null || b == null) return a === b;
	    // Unwrap any wrapped objects.
	    if (a instanceof _) a = a._wrapped;
	    if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className !== toString.call(b)) return false;
	    switch (className) {
	      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
	      case '[object RegExp]':
	      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
	      case '[object String]':
	        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	        // equivalent to `new String("5")`.
	        return '' + a === '' + b;
	      case '[object Number]':
	        // `NaN`s are equivalent, but non-reflexive.
	        // Object(NaN) is equivalent to NaN
	        if (+a !== +a) return +b !== +b;
	        // An `egal` comparison is performed for other numeric values.
	        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
	      case '[object Date]':
	      case '[object Boolean]':
	        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	        // millisecond representations. Note that invalid dates with millisecond representations
	        // of `NaN` are not equivalent.
	        return +a === +b;
	    }

	    var areArrays = className === '[object Array]';
	    if (!areArrays) {
	      if (typeof a != 'object' || typeof b != 'object') return false;

	      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
	      // from different frames are.
	      var aCtor = a.constructor, bCtor = b.constructor;
	      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
	                               _.isFunction(bCtor) && bCtor instanceof bCtor)
	                          && ('constructor' in a && 'constructor' in b)) {
	        return false;
	      }
	    }
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

	    // Initializing stack of traversed objects.
	    // It's done here since we only need them for objects and arrays comparison.
	    aStack = aStack || [];
	    bStack = bStack || [];
	    var length = aStack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (aStack[length] === a) return bStack[length] === b;
	    }

	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);

	    // Recursively compare objects and arrays.
	    if (areArrays) {
	      // Compare array lengths to determine if a deep comparison is necessary.
	      length = a.length;
	      if (length !== b.length) return false;
	      // Deep compare the contents, ignoring non-numeric properties.
	      while (length--) {
	        if (!eq(a[length], b[length], aStack, bStack)) return false;
	      }
	    } else {
	      // Deep compare objects.
	      var keys = _.keys(a), key;
	      length = keys.length;
	      // Ensure that both objects contain the same number of properties before comparing deep equality.
	      if (_.keys(b).length !== length) return false;
	      while (length--) {
	        // Deep compare each member
	        key = keys[length];
	        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
	      }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return true;
	  };

	  // Perform a deep comparison to check if two objects are equal.
	  _.isEqual = function(a, b) {
	    return eq(a, b);
	  };

	  // Is a given array, string, or object empty?
	  // An "empty" object has no enumerable own-properties.
	  _.isEmpty = function(obj) {
	    if (obj == null) return true;
	    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
	    return _.keys(obj).length === 0;
	  };

	  // Is a given value a DOM element?
	  _.isElement = function(obj) {
	    return !!(obj && obj.nodeType === 1);
	  };

	  // Is a given value an array?
	  // Delegates to ECMA5's native Array.isArray
	  _.isArray = nativeIsArray || function(obj) {
	    return toString.call(obj) === '[object Array]';
	  };

	  // Is a given variable an object?
	  _.isObject = function(obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	  };

	  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
	  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
	    _['is' + name] = function(obj) {
	      return toString.call(obj) === '[object ' + name + ']';
	    };
	  });

	  // Define a fallback version of the method in browsers (ahem, IE < 9), where
	  // there isn't any inspectable "Arguments" type.
	  if (!_.isArguments(arguments)) {
	    _.isArguments = function(obj) {
	      return _.has(obj, 'callee');
	    };
	  }

	  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
	  // IE 11 (#1621), and in Safari 8 (#1929).
	  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
	    _.isFunction = function(obj) {
	      return typeof obj == 'function' || false;
	    };
	  }

	  // Is a given object a finite number?
	  _.isFinite = function(obj) {
	    return isFinite(obj) && !isNaN(parseFloat(obj));
	  };

	  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
	  _.isNaN = function(obj) {
	    return _.isNumber(obj) && obj !== +obj;
	  };

	  // Is a given value a boolean?
	  _.isBoolean = function(obj) {
	    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	  };

	  // Is a given value equal to null?
	  _.isNull = function(obj) {
	    return obj === null;
	  };

	  // Is a given variable undefined?
	  _.isUndefined = function(obj) {
	    return obj === void 0;
	  };

	  // Shortcut function for checking if an object has a given property directly
	  // on itself (in other words, not on a prototype).
	  _.has = function(obj, key) {
	    return obj != null && hasOwnProperty.call(obj, key);
	  };

	  // Utility Functions
	  // -----------------

	  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
	  // previous owner. Returns a reference to the Underscore object.
	  _.noConflict = function() {
	    root._ = previousUnderscore;
	    return this;
	  };

	  // Keep the identity function around for default iteratees.
	  _.identity = function(value) {
	    return value;
	  };

	  // Predicate-generating functions. Often useful outside of Underscore.
	  _.constant = function(value) {
	    return function() {
	      return value;
	    };
	  };

	  _.noop = function(){};

	  _.property = property;

	  // Generates a function for a given object that returns a given property.
	  _.propertyOf = function(obj) {
	    return obj == null ? function(){} : function(key) {
	      return obj[key];
	    };
	  };

	  // Returns a predicate for checking whether an object has a given set of
	  // `key:value` pairs.
	  _.matcher = _.matches = function(attrs) {
	    attrs = _.extendOwn({}, attrs);
	    return function(obj) {
	      return _.isMatch(obj, attrs);
	    };
	  };

	  // Run a function **n** times.
	  _.times = function(n, iteratee, context) {
	    var accum = Array(Math.max(0, n));
	    iteratee = optimizeCb(iteratee, context, 1);
	    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
	    return accum;
	  };

	  // Return a random integer between min and max (inclusive).
	  _.random = function(min, max) {
	    if (max == null) {
	      max = min;
	      min = 0;
	    }
	    return min + Math.floor(Math.random() * (max - min + 1));
	  };

	  // A (possibly faster) way to get the current timestamp as an integer.
	  _.now = Date.now || function() {
	    return new Date().getTime();
	  };

	   // List of HTML entities for escaping.
	  var escapeMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#x27;',
	    '`': '&#x60;'
	  };
	  var unescapeMap = _.invert(escapeMap);

	  // Functions for escaping and unescaping strings to/from HTML interpolation.
	  var createEscaper = function(map) {
	    var escaper = function(match) {
	      return map[match];
	    };
	    // Regexes for identifying a key that needs to be escaped
	    var source = '(?:' + _.keys(map).join('|') + ')';
	    var testRegexp = RegExp(source);
	    var replaceRegexp = RegExp(source, 'g');
	    return function(string) {
	      string = string == null ? '' : '' + string;
	      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	    };
	  };
	  _.escape = createEscaper(escapeMap);
	  _.unescape = createEscaper(unescapeMap);

	  // If the value of the named `property` is a function then invoke it with the
	  // `object` as context; otherwise, return it.
	  _.result = function(object, property, fallback) {
	    var value = object == null ? void 0 : object[property];
	    if (value === void 0) {
	      value = fallback;
	    }
	    return _.isFunction(value) ? value.call(object) : value;
	  };

	  // Generate a unique integer id (unique within the entire client session).
	  // Useful for temporary DOM ids.
	  var idCounter = 0;
	  _.uniqueId = function(prefix) {
	    var id = ++idCounter + '';
	    return prefix ? prefix + id : id;
	  };

	  // By default, Underscore uses ERB-style template delimiters, change the
	  // following template settings to use alternative delimiters.
	  _.templateSettings = {
	    evaluate    : /<%([\s\S]+?)%>/g,
	    interpolate : /<%=([\s\S]+?)%>/g,
	    escape      : /<%-([\s\S]+?)%>/g
	  };

	  // When customizing `templateSettings`, if you don't want to define an
	  // interpolation, evaluation or escaping regex, we need one that is
	  // guaranteed not to match.
	  var noMatch = /(.)^/;

	  // Certain characters need to be escaped so that they can be put into a
	  // string literal.
	  var escapes = {
	    "'":      "'",
	    '\\':     '\\',
	    '\r':     'r',
	    '\n':     'n',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };

	  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

	  var escapeChar = function(match) {
	    return '\\' + escapes[match];
	  };

	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  // NB: `oldSettings` only exists for backwards compatibility.
	  _.template = function(text, settings, oldSettings) {
	    if (!settings && oldSettings) settings = oldSettings;
	    settings = _.defaults({}, settings, _.templateSettings);

	    // Combine delimiters into one regular expression via alternation.
	    var matcher = RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');

	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset).replace(escaper, escapeChar);
	      index = offset + match.length;

	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      } else if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      } else if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }

	      // Adobe VMs need the match returned to produce the correct offest.
	      return match;
	    });
	    source += "';\n";

	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + 'return __p;\n';

	    try {
	      var render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }

	    var template = function(data) {
	      return render.call(this, data, _);
	    };

	    // Provide the compiled source as a convenience for precompilation.
	    var argument = settings.variable || 'obj';
	    template.source = 'function(' + argument + '){\n' + source + '}';

	    return template;
	  };

	  // Add a "chain" function. Start chaining a wrapped Underscore object.
	  _.chain = function(obj) {
	    var instance = _(obj);
	    instance._chain = true;
	    return instance;
	  };

	  // OOP
	  // ---------------
	  // If Underscore is called as a function, it returns a wrapped object that
	  // can be used OO-style. This wrapper holds altered versions of all the
	  // underscore functions. Wrapped objects may be chained.

	  // Helper function to continue chaining intermediate results.
	  var result = function(instance, obj) {
	    return instance._chain ? _(obj).chain() : obj;
	  };

	  // Add your own custom functions to the Underscore object.
	  _.mixin = function(obj) {
	    _.each(_.functions(obj), function(name) {
	      var func = _[name] = obj[name];
	      _.prototype[name] = function() {
	        var args = [this._wrapped];
	        push.apply(args, arguments);
	        return result(this, func.apply(_, args));
	      };
	    });
	  };

	  // Add all of the Underscore functions to the wrapper object.
	  _.mixin(_);

	  // Add all mutator Array functions to the wrapper.
	  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      var obj = this._wrapped;
	      method.apply(obj, arguments);
	      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
	      return result(this, obj);
	    };
	  });

	  // Add all accessor Array functions to the wrapper.
	  _.each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      return result(this, method.apply(this._wrapped, arguments));
	    };
	  });

	  // Extracts the result from a wrapped and chained object.
	  _.prototype.value = function() {
	    return this._wrapped;
	  };

	  // Provide unwrapping proxy for some methods used in engine operations
	  // such as arithmetic and JSON stringification.
	  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

	  _.prototype.toString = function() {
	    return '' + this._wrapped;
	  };

	  // AMD registration happens at the end for compatibility with AMD loaders
	  // that may not enforce next-turn semantics on modules. Even though general
	  // practice for AMD registration is to be anonymous, underscore registers
	  // as a named module because, like jQuery, it is a base library that is
	  // popular enough to be bundled in a third party lib, but not be part of
	  // an AMD load request. Those cases could generate an error when an
	  // anonymous define() is called outside of a loader request.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}.call(this));


/***/ }
]);