webpackJsonp([6],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {
	var Utils = __webpack_require__(9)
	__webpack_require__(12)

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

/***/ }
]);