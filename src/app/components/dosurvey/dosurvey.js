
var isAndroid = (window.navigator.userAgent || '').indexOf('YJS_Android') !== -1

if (isAndroid) {
  require('./cordova.min')
  require('./cordova.plugin').initialize(displayImages)
} else {
  addListener('house')
  addListener('company')
}


//=========================
var Utils = require('utils')
require('./dosurvey.scss')

var _ = require('underscore')

var survey_session = Utils.Storage.get(Utils.Storage.SURVEY_SESSION)

// Utils.Utilities.checkStatus(survey_session.applySerialNo, Utils.Storage.SURVEY_SESSION)

requestSurveyDetail()

var Promise = window.Promise || require('es6-promise').Promise

var galleryTemplate = Handlebars.compile('{{>gallery}}')

var MAXNUM = 200, MAXIMG = 50

var up_ing = false

var options = {
  "cols": 6,
  "gallery": true
}

var galleryData = {
  house: {
    "options": options,
    "content": []
  },
  company: {
    "options": options,
    "content": []
  }
}

var firstFlag = true

function requestSurveyDetail() {
  $.post(Utils.URL.SURVEY_DETAIL, {
    applySerialNo: survey_session.applySerialNo
  })
  .done(function(data) {
    if (data.status === 'success') {
      var apply = data.content
      if (!apply) {
        Utils.UI.toast('该笔申请无数据')
        return
      }
      switch (apply.customerType) {
        case "001":
          apply.customerType = '标准受薪'
          break;
        case "002":
          apply.customerType = '优良职业'
          break;
        case "003":
          apply.customerType = '自雇人士'
          break;
        case "004":
          apply.customerType = '用友企业客户'
          break;
        default:
          // no code
      }

      var _html = Handlebars.compile(require('./detail.hbs'))(apply)
      $('#main').append(_html)
    }
  })
}

function displayImages(files, zoom, upBtn, name, base64) {

  if (base64) {
    createGallery(files)
    return;
  }

  upBtn.button('loading')

  var isAllImg = _(files).every(function(file) {
    return Utils.IMAGE.checkExtention(file.name)
  })

  if (!isAllImg) {
    Utils.UI.toast('只能选择图片')
    upBtn.button('reset')
    return;
  }

  var isOverSize = _(files).every(function(file) {
    console.log(file.size / 1024 + ' KB');
    return file.size < 4 * 1024 * 1024
  })

  if (!isOverSize) {
    Utils.UI.toast('单张图片大小不能大于 4 MB')
    upBtn.button('reset')
    return;
  }

  var filePromises = Array.prototype.map.call(files, function(file) {
    return new Promise(function(resolve, reject) {
      Utils.IMAGE.resizeImageFile(file, 2280, 2280, 0.2, function(dataURL) {
        console.log(dataURL.length / 1024 + ' KB');
        resolve({"img": dataURL})
      })
    })
  })

  Promise.all(filePromises).then(createGallery)

  function createGallery(dataURL) {
    galleryData[name].content = galleryData[name].content.concat(dataURL)
    if (!$(zoom).html()) {
      $(zoom).append(galleryTemplate(galleryData[name]))
    }
    else {
      var li_template = require('./img-item.hbs')
      $(zoom).find('.am-gallery').append(Handlebars.compile(li_template)(dataURL))
    }

    $(zoom).find('.am-gallery').pureview()
    upBtn.button('reset')

    if (firstFlag) {
      firstFlag = false
      galleryData[name].firstFlag = true
    }
  }

}

function deleteImages() {
  var $li = $(this).parent()
  var $gallery = $li.parent()
  var index = $gallery.find('li').index($li)
  $li.remove()
  var name = $gallery.parent().attr('data-name')
  galleryData[name].content.splice(index, 1)
  var name_index = 1
  if (galleryData[name].firstFlag) {
    name_index = 0
  }
  $('.am-pureview-slider').eq(name_index).find('li').eq(index).remove()
}

function submitSurvey() {
  var remark_str = $('#remark-txa').val()

  if (galleryData.house.content.length === 0 &&
    galleryData.company.content.length === 0 && remark_str === '') {
    Utils.UI.toast('图片和备注必填一项！')
    return false
  }

  if (remark_str.length > MAXNUM) {
    Utils.UI.toast('备注信息不能大于' + MAXNUM + '个字符')
    return false
  }

  if (galleryData.house.content.length + galleryData.company.content.length > MAXIMG) {
    Utils.UI.toast('上传图片不能超过 ' +　MAXIMG + ' 张')
    return false
  }

  if (up_ing) {
    Utils.UI.toast('正在上传中...')
    return false
  }

  var req_data = {
    homefiles: ['test'].concat(_.pluck(galleryData.house.content, 'img')),
    companyfiles: ['test'].concat(_.pluck(galleryData.company.content, 'img')),
    applySerialNo: survey_session.applySerialNo,
    remarks: remark_str
  }

  up_ing = true
  Utils.UI.toast('正在上传...')
  $.post(Utils.URL.SURVEY_SAVE, req_data)
    .done(function(data) {
      if (data.status === 'success') {
        Utils.UI.toast(data.msg, function() {
          Utils.Utilities.forward('./survey.html')
        })
      }
    })
    .always(function() {
      up_ing = false
    })
}

function addListener(type) {
  $('#up-' + type + '-btn').on('click', function() {
    var that = this
    var $input = $('<input type="file" accept="image/*" multiple style="display:none">')
    $input.change(function() {
      displayImages(this.files, '#file-list-' + type, $(that), type)
      $input.remove()
    })
    $('body').append($input)
    $input.click()
  })
}

$('#submitBtn').on('click', submitSurvey)

$(document).on('click', '.am-img-close', deleteImages)
