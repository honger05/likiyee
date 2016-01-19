
require('amazeui/less/amazeui.less')
require('../../common/common.scss')

$('.am-form').submit(function(ev) {
  ev.preventDefault();
  $.AMUI.progress.start();
  // document.location.href = 'index.html'
})
