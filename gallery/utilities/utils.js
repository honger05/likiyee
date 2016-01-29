require('amazeui/less/amazeui.less')

require('./error.report')
require('./ajax.handle')
require('./widgets.helper')

var CONTEXT_URL = 'ceis/a/'
var TIMING = 1000

var Utils = {

  RSAUtils: require('./rsautils'),

  REG: require('./regexp.helper'),

  URL: {
    VALIDATA_IMG: 'ceis/servlet/validateCodeServlet',
    LOGIN: CONTEXT_URL + 'login',
    LOGOUT: CONTEXT_URL + 'logout',
    LIST_MENU: CONTEXT_URL + 'sys/user/listMenus.yy',
    RSA_KEY: CONTEXT_URL + 'getrsakey.yy',
    MODIFYPWD: CONTEXT_URL + 'sys/user/modifyPwd.yy',

    REPAY_LIST: CONTEXT_URL + 'repay/list.yy',
    REPAY_DETAIL: CONTEXT_URL + 'repay/detail.yy',
    REPAY_DEBIT: CONTEXT_URL + 'repay/debit.yy'
  },

  UI: {

    Pull: require('./pull'),

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

    toast: function(msg) {
      $('#toast-cnt').html(msg)
      $('#toast').modal('open')
    },

    alert: function(msg) {
      $('.am-main').prepend(Handlebars.compile('{{>alert}}')({
        msg: msg,
        status: 'warning'
      }))
      $('#alert').alert()
      setTimeout(function() {
        $('#alert-close').click()
      }, 3 * TIMING)
    }

  },

  getQueryString: function(name) {
    var val = ''
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.search.substr(1).match(reg)
    if (r !== null) {
      val = unescape(r[2])
    }
    return val
  },

  replace: function(url) {
    window.location.replace(url)
  },

  forward: function(url) {
    window.location.assign(url)
  },

  storage: {
    PAY_SESSION: 'sfsfjwekjfkwnvdksn',
    CEIS_SESSION: 'erotijbfkdjgdkfjgip',

    set: function(key, val) {
      try {
        var val_str = JSON.stringify(val || {})
        window.sessionStorage.setItem('$' + key, val_str)
      }
      catch (ex) {
        console.error('json stringify error!');
      }
    },
    get: function(key) {
      try {
        var val = window.sessionStorage.getItem('$' + key) || '{}'
        return JSON.parse(val)
      }
      catch (ex) {
        console.error('json parse error!');
      }
    }
  },

  log: function(msg) {
    console.log(msg)
  }

}

Utils.UI.toastinit()

$( document ).ajaxError(function(event, jqxhr, settings, thrownError) {
  Utils.UI.toast('服务器异常，请重试...')
  console.error([event, jqxhr, settings, thrownError])
})

$( document ).ajaxComplete(function( event, xhr, settings ) {
  // settings.url,
  var res_data = JSON.parse(xhr.responseText)
  console.log(res_data)

  switch (res_data.status) {
    case 'unlogin':
      Utils.forward('./login.html')
      break;
    case 'warning':
      Utils.UI.toast(res_data.msg)
      break;
    case 'error':
      Utils.UI.toast(res_data.msg)
      break;
    default:
      // no code
  }

})

module.exports = Utils
