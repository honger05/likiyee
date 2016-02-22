
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
    phone_gap.addListener('house')
    phone_gap.addListener('company')
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
    var new_sucCallback = function(data){
      data = JSON.parse(data)
      sucCallback(data)
    };
    failCallback = failCallback || function(){};
    cordova.exec(new_sucCallback, failCallback, "YJSPlugin", "chooseimage", []);
  },

  getlocalFile: function(localFiles, cb) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
      var fileArray = []
      localFiles.forEach(function(filePath, index) {
        fileSystem.root.getFile(filePath, null, function(fileEntry) {
          fileEntry.file(function(file) {
            fileArray.push(file)
            if (index === localFiles.length - 1) {
              cb(fileArray)
            }
          })
        }, function() {
          alert('文件拉取失败')
        })
      })
    })
  },

  addListener: function(type) {
    $('#up-' + type + '-btn').on('click', function() {
      var that = this;
      phone_gap.chooseImage(function(filePaths) {
        phone_gap.getlocalFile(filePaths, function(fileEntrys) {
          phone_gap.successCB(fileEntrys, '#file-list-' + type, $(that), type, false)
        })
      }, phone_gap.errorCB)
    })
  }

};

module.exports = phone_gap;
