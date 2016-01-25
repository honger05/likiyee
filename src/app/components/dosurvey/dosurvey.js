
var Utils = require('utils')
require('../../common/common.scss')
require('./dosurvey.scss')
var Promise = window.Promise || require('es6-promise').Promise

// var myScroll = new $.AMUI.iScroll('#wrapper')

$('#up-house').on('change', function() {
  displayImages(this.files, '#file-list-house', $(this).prev(), 'house')
})

$('#up-address').on('change', function() {
  displayImages(this.files, '#file-list-address', $(this).prev(), 'address')
})

var galleryTemplate = Handlebars.compile('{{>gallery}}')

var options = {
  "cols": 6,
  "gallery": true
}

var galleryData = {
  house: {
    "options": options,
    "content": []
  },
  address: {
    "options": options,
    "content": []
  }
}

function displayImages(files, zoom, upBtn, name) {
  upBtn.button('loading')
  var filePromises = Array.prototype.map.call(files, function(file) {
    return new Promise(function(resolve, reject) {
      ResizeImageFile(file, 280, 280, function(dataURL) {
        resolve({"img": dataURL})
      })
    })
  })

  Promise.all(filePromises).then(function(dataURL) {
    galleryData[name].content = galleryData[name].content.concat(dataURL)
    $(zoom).find('.am-gallery').remove()
    $(zoom).append(galleryTemplate(galleryData[name]))
    $(zoom).find('.am-gallery').pureview()
    setTimeout(function() {
      upBtn.button('reset')
      // myScroll.refresh()
    }, 800)
  })

}

function ResizeImageFile(file, maxWidth, maxHeight, callback) {
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

		// $('body').append(canvas)

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
}
