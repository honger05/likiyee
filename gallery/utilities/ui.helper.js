
var TIMING = 1000

module.exports = {

  effectBody: function() {
    $(window).load(function() {
      $.AMUI.progress.done(true)
    })

    $(document).ready(function() {
      $.AMUI.progress.set(0.4)
    })
  },

  toastinit: function() {
    $('body').append(Handlebars.compile('{{>toast}}')())
    $('#toast').on('opened.modal.amui', function() {
      setTimeout(function() {
        $(this).modal('close')
      }.bind(this), TIMING)
    })
  },

  toast: function(msg, cb) {
    $('#toast-cnt').html(msg)
    $('#toast').modal('open')
    if (cb) {
      setTimeout(function() {
        cb()
      }, TIMING)
    }
  },

  alert: function(msg) {
  	if(!$('#alert').html()) {
  		$('.am-main').prepend(Handlebars.compile('{{>alert}}')({
	      msg: msg,
	      status: 'warning'
	    }))
	    $('#alert').alert()
	    setTimeout(function() {
	      $('#alert-close').click()
	    }, 3 * TIMING)
  	}
  }

}