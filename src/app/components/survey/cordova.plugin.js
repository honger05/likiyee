
var phone_gap = {

 	// Application Constructor
  initialize: function() {
    phone_gap.bindEvents();
  },

  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener("deviceready", phone_gap.onDeviceReady, false);
  },

  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicity call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    $('#list-tmpl').on('tap', 'li', phone_gap.itemclick)
  },

  /**
  * [登陆成功回调]
  * sucCallback: 成功回调，返回结果。
  * failCallback：失败回调
  **/
  itemclick: function( sucCallback, failCallback, sno) {
    var applyno = $(this).find('[data-applyno]').data('applyno')
    sucCallback = sucCallback || function(){};
    failCallback = failCallback || function(){};
    cordova.exec(sucCallback, failCallback, "YJSPlugin", "chooseimage", [applyno]);
  },
};

module.exports = phone_gap;
