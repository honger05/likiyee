
var Utils = require('utils')
require('../../common/common.scss')
require('./dosurvey.scss')
var _ = require('underscore')

var survey_session = Utils.Storage.get(Utils.Storage.SURVEY_SESSION)

// Utils.Utilities.checkStatus(survey_session.applySerialNo, Utils.Storage.SURVEY_SESSION)

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
  upBtn.button('loading')

  var isAllImg = _(files).every(function(file) {
    return Utils.IMAGE.checkExtention(file.name)
  })

  if (!isAllImg) {
    Utils.UI.toast('只能选择图片')
    upBtn.button('reset')
    return;
  }

  var filePromises = Array.prototype.map.call(files, function(file) {
    return new Promise(function(resolve, reject) {
      Utils.IMAGE.resizeImageFile(file, 2280, 2280, function(dataURL) {
        resolve({"img": dataURL})
      })
    })
  })

  Promise.all(filePromises).then(function(dataURL) {
    if (!$(zoom).html()) {
      galleryData[name].content = dataURL
      $(zoom).append(galleryTemplate(galleryData[name]))
    }
    else {
      var li_template = '{{#each this}}<li><a class="am-close am-close-alt am-icon-times am-img-close"></a><div class="am-gallery-item"><img src={{img}}></div></li>{{/each}}'
      $(zoom).find('.am-gallery').append(Handlebars.compile(li_template)(dataURL))
    }

    $(zoom).find('.am-gallery').pureview()
    upBtn.button('reset')
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
          Utils.Utilities.forward('./survey.html')
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

$(document).on('click', '.am-img-close', function() {
  var $li = $(this).parent()
  var index = $li.parent().find('li').index($li)
  $li.remove()
  $li.parent().pureview()
})
