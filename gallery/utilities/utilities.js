
var Storage = require('./storage.helper')

module.exports = {

  checkStatus: function(value, key) {
    if (!value) {
      this.replace('./index.html')
    }

    this.unload(function() {
      Storage.set(key)
    })
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

  log: function(msg) {
    console.log(msg)
  }

}
