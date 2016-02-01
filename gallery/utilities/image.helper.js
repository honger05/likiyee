
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
