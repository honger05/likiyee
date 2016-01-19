
var progress = $.AMUI.progress

$(window).load(function() {
  progress.done(true)
})

$(document).ready(function() {
  progress.set(0.4)
})

var Utils = {

  log: function(msg) {
    console.log(msg)
  }

}

module.exports = Utils
