require('amazeui/less/amazeui.less')

require('./error.report')
require('./ajax.handle')
require('./widgets.helper')

var HOST = ''//'http://172.30.2.105:8083/'
var CONTEXT_URL = HOST + 'ceis/a/'

var Utils = {

  RSA: require('./rsa.helper'),

  REG: require('./regexp.helper'),

  IMAGE: require('./image.helper'),

  Pull: require('./pull'),

  UI: require('./ui.helper'),

  URL: {
    VALIDATA_IMG: HOST + 'ceis/servlet/validateCodeServlet',
    LOGIN: CONTEXT_URL + 'login',
    LOGOUT: CONTEXT_URL + 'logout',
    LIST_MENU: CONTEXT_URL + 'sys/user/listMenus.yy',
    RSA_KEY: CONTEXT_URL + 'getrsakey.yy',
    MODIFYPWD: CONTEXT_URL + 'sys/user/modifyPwd.yy',

    REPAY_LIST: CONTEXT_URL + 'repay/list.yy',
    REPAY_DETAIL: CONTEXT_URL + 'repay/detail.yy',
    REPAY_DEBIT: CONTEXT_URL + 'repay/debit.yy',

    SURVEY_LIST: CONTEXT_URL + 'apy/survey/list.yy',
    SURVEY_DETAIL: CONTEXT_URL + 'apy/survey/detail.yy',
    SURVEY_SAVE: CONTEXT_URL + 'apy/survey/save.yy'
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

  unload: function(cb) {
    window.onunload = cb
  },

  storage: {
    PAY_SESSION: 'sfsfjwekjfkwnvdksn',
    CEIS_SESSION: 'erotijbfkdjgdkfjgip',
    SURVEY_SESSION: 'rtoypmlmbcjfgkdjor',

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
  console.error([event, jqxhr, settings, thrownError])
  // Utils.UI.toast('系统异常，请稍后重试...')
  // Utils.forward('./unicorn.html')
})

$( document ).ajaxComplete(function( event, xhr, settings ) {
  // settings.url,
  var res_data = JSON.parse(xhr.responseText)
  console.log(res_data)

  switch (res_data.status) {
    case 'unlogin':
      debugger;
      Utils.replace('./login.html')
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
