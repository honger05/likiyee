
module.exports = {

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

}
