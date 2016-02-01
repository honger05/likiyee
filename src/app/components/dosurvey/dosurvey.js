
var Utils = require('utils')
require('../../common/common.scss')
require('./dosurvey.scss')
var _ = require('underscore')

var survey_session = Utils.storage.get(Utils.storage.SURVEY_SESSION)

if (!survey_session.applySerialNo) {
  Utils.replace('./index.html')
}

Utils.unload(function() {
  Utils.storage.set(Utils.storage.SURVEY_SESSION)
})

var Promise = window.Promise || require('es6-promise').Promise

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
  company: {
    "options": options,
    "content": []
  }
}

requestSurveyDetail()

function requestSurveyDetail() {
  $.post(Utils.URL.SURVEY_DETAIL, {
    applySerialNo: survey_session.applySerialNo
  })
  .done(function(data) {
    if (data.status === 'success') {
      var _html = Handlebars.compile($('#detail-tmpl').html())(data.content)
      $('#main').append(_html)
    }
  })
}

function displayImages(files, zoom, upBtn, name) {

  var isAllImg = _(files).every(function(file) {
    return Utils.IMAGE.checkExtention(file.name)
  })

  if (!isAllImg) {
    Utils.UI.toast('只能选择图片')
    return;
  }

  upBtn.button('loading')
  var filePromises = Array.prototype.map.call(files, function(file) {
    return new Promise(function(resolve, reject) {
      Utils.IMAGE.resizeImageFile(file, 2280, 2280, function(dataURL) {
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
    }, 400)
  })

}

function submitSurvey() {
  var req_data = {
    homefiles: ['sdsdsdsd'].concat(_.pluck(galleryData.house.content, 'img')),
    companyfiles: ['sdsdsdsd'].concat(_.pluck(galleryData.company.content, 'img')),
    applySerialNo: survey_session.applySerialNo,
    remarks: $('#remark-txa').val()
  }
  $.post(Utils.URL.SURVEY_SAVE, req_data)
    .done(function(data) {
      if (data.status === 'success') {
        Utils.UI.toast(data.msg, function() {
          Utils.forward('./survey.html')
        })
      }
    })
}

$('#up-house').on('change', function() {
  displayImages(this.files, '#file-list-house', $(this).prev(), 'house')
})

$('#up-company').on('change', function() {
  displayImages(this.files, '#file-list-company', $(this).prev(), 'company')
})

$('#submitBtn').on('click', submitSurvey)
