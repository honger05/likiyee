
var Utils = require('utils')
require('../../common/common.scss')

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
  item_str: require('./survey-item.hbs'),
  list_id: '#list-tmpl',
  pagenation: pagenation
})

$('#list-tmpl').on('tap', 'li', function() {
  var applyno = $(this).find('[data-applyno]').data('applyno')
  if (applyno) {
    Utils.Storage.set(Utils.Storage.SURVEY_SESSION, {
      applySerialNo: applyno
    })
    Utils.Utilities.forward('./dosurvey.html')
  }
})
