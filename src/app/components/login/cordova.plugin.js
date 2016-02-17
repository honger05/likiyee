
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
    document.addEventListener("backbutton", phone_gap.onBackKeyDown, false);
  },

  /**
  * [登陆成功回调]
  * sucCallback: 成功回调，返回结果。
  * failCallback：失败回调
  **/
  itemclick: function( sucCallback, failCallback, sno) {
    sucCallback = sucCallback || function(){};
    failCallback = failCallback || function(){};
    alert(cordova.exec)
    cordova.exec(sucCallback, failCallback, "YJSPlugin", "chooseimage", [sno]);
    alert(00000000000)
  }

};

window.phoneGap = phone_gap;
