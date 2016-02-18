
var phone_gap, isAndroid = (window.navigator.userAgent || '').indexOf('YJS_Android') !== -1

if (isAndroid) {
  require('./cordova.min')
  phone_gap = require('./cordova.plugin')
}

var Utils = require('utils')

var _list = []

$.post(Utils.URL.SURVEY_LIST)
  .done(function(data) {
    if (data.status === 'success') {
      _list = data.content || []
      pull.init()
    }
  })

function pagenation(start, count) {
  return [ _list.slice(start - 1, count +　start - 1), _list.length ]
}

var pull = new Utils.Pull(null, {
  start: 1,
  count: 10,
  item_tmpl: require('./survey-item.hbs'),
  list_id: '#list-tmpl',
  pagenation: pagenation
})

$('#list-tmpl').on('tap', 'li', function() {
  var applyno = $(this).find('[data-applyno]').data('applyno')
  if (applyno) {
    if (isAndroid) {
      phone_gap.itemclick(null, null, applyno)
    } else {
      Utils.Storage.set(Utils.Storage.SURVEY_SESSION, {
        applySerialNo: applyno
      })
      Utils.Utilities.forward('./dosurvey.html')
    }
  }
})
