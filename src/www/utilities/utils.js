require('amazeui/less/amazeui.less')

require('./ajax.handle.js')
require('./widgets.helper.js')

var progress = $.AMUI.progress

$(window).load(function() {
  progress.done(true)
})

$(document).ready(function() {
  progress.set(0.4)
})

var CONTEXT_URL = 'ceis/a/'

var Utils = {

  URL: {
    VALIDATA_IMG: 'ceis/servlet/validateCodeServlet',
    LOGINOUT: CONTEXT_URL + 'logout',
    LIST_MENU: CONTEXT_URL + 'sys/user/listMenus.do',
    RSA_KEY: CONTEXT_URL + 'getrsakey.do',
    LOGIN: CONTEXT_URL + 'login',
    MODIFYPWD: CONTEXT_URL + 'sys/user/modifyPwd.do'
  },

  forward: function(url) {
    window.location.replace(url)
  },

  storage: {
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

module.exports = Utils
