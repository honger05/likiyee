
var phone_gap = {

 	// Application Constructor
  initialize: function(successCB, errorCB) {
    this.successCB = successCB;
    this.errorCB = errorCB;
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
    $('#up-house').on('click', function() {
      var that = this;
      phone_gap.chooseImage(function(files) {
        files = JSON.parse(files)
        phone_gap.successCB(files, '#file-list-house', $(that).prev(), 'house')
      }, phone_gap.errorCB)
    })
    $('#up-company').on('click', function() {
      var that = this;
      phone_gap.chooseImage(function(files) {
        files = JSON.parse(files)
        phone_gap.successCB(files, '#file-list-company', $(that).prev(), 'company')
      }, phone_gap.errorCB)
    })
  },

  selectPicture: function() {
    navigator.camera.getPicture(function(dataurl) {
      alert(111)
    }, function() {}, {
      quality: 40,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      mediaType:Camera.MediaType.PICTURE,
      allowEdit:false
    })
  },

  chooseImage: function(sucCallback, failCallback) {
    sucCallback = sucCallback || function(){};
    failCallback = failCallback || function(){};
    cordova.exec(sucCallback, failCallback, "YJSPlugin", "chooseimage", []);
  },

  getlocalFile: function(localFiles, cb) {
    localFiles = JSON.parse(localFiles)
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
      localFiles.forEach(function(file) {
        fileSystem.root.getFile(file, null, function(fileEntry) {
          cb([fileEntry])
        }, function() {
          alert(11)
        })
      })
    })
  }

};

module.exports = phone_gap;
