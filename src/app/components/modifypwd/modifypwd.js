
var Utils = require('utils')
require('../../common/common.scss')

$('#toast').on('opened.modal.amui', function() {
  setTimeout(function() {
    $(this).modal('close')
  }.bind(this), 1000)
})

$('#cfrPassword').on('change', function() {
  if (this.value !== $('[name=newPassword]').val()) {
    this.value = ''
    $('#toast-cnt').html('前后输入不一致')
    $('#toast').modal('open')
  }
})

$('#modify-form').on('submit', function(ev) {
  ev.preventDefault()


})
