
var Utils = require('utils')

require('./widgets.index.js')

$('#logout').on('click', function() {
  $.post(Utils.URL.LOGOUT)
    .done(function(data) {
      if (data.status === 'success') {
        Utils.Storage.set('ceis')
        Utils.Utilities.forward('./login.html')
      }
    })
})

$.post(Utils.URL.LIST_MENU, {a:1})
  .done(function(data) {
    if (data && data.content) {
      $('#menu-list').prepend(Handlebars.compile('{{>menulist}}')(data.content))
    }
  })
