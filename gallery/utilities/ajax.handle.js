
$(document).ajaxStart(function() {
  $.AMUI.progress.inc(0.5)
});

$(document).ajaxStop(function() {
  setTimeout(function() {
    $.AMUI.progress.done()
  }, 500)
});
