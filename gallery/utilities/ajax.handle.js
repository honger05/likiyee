
var UI = require('./ui.helper')
var Utilities = require('./utilities')
var _ = require('underscore')

$(document).ajaxStart(function() {
  $.AMUI.progress.inc(0.5)
});

$(document).ajaxStop(function() {
  setTimeout(function() {
    $.AMUI.progress.done()
  }, 500)
});

$(document).ajaxSend(function(event, request, settings) {
  if (settings.data) {
    settings.data += '&mobileLogin=true'
  }
  else {
    settings.data = 'mobileLogin=true'
  }
  // settings.data = _.assign({}, settings.data, {mobileLogin: true})
  console.log('[ajax send =======] ' + settings.data)
});

$( document ).ajaxComplete(function( event, xhr, settings ) {
  // settings.url,
  var res_data = JSON.parse(xhr.responseText)
  console.log(res_data)
  console.table(res_data.content)

  switch (res_data.status) {
    case 'unlogin':
      Utilities.replace('./login.html')
      break;
    case 'warning':
      UI.toast(res_data.msg)
      break;
    case 'error':
      UI.toast(res_data.msg)
      break;
    default:
      // no code
  }

})

$( document ).ajaxError(function(event, jqxhr, settings, thrownError) {
  console.log(['Ajax Error', event, jqxhr, settings, thrownError])
  UI.toast('系统异常，请稍后重试...')
  $.AMUI.progress.done()
  // Utilities.forward('./unicorn.html')
})
