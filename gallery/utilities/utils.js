
require('amazeui/less/amazeui.less')

require('./error.report')
require('./ajax.handle')
require('./widgets.helper')

var Utils = {

  RSA: require('./rsa.helper'),

  REG: require('./regexp.helper'),

  IMAGE: require('./image.helper'),

  Pull: require('./pull'),

  UI: require('./ui.helper'),

  Storage: require('./storage.helper'),

  Utilities: require('./utilities'),

  URL: require('./url.helper')

}

module.exports = Utils

Utils.UI.toastinit()
