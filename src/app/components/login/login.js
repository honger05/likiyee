
require('../../common/common.scss')

var $ = require('jquery');

window.jQuery = $;

$('.am-form').submit(function(ev) {
  ev.preventDefault();
  $.AMUI.progress.start();
  // document.location.href = 'index.html'
})
