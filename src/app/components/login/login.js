
var Utils = require('utils')
require('../../common/common.scss')
require('./login.scss')

var CEIS = {}

$.post(Utils.URL.RSA_KEY)
 .done(function(data) {
  if (data && data.content) {
    CEIS.exponent = data.content.e;
    CEIS.modulus = data.content.n;
  }
 })

$('#username').on('change', function() {
  var $username = $(this);
  $username.val($.trim($username.val()).toUpperCase());
})

$('#validateCodeDiv').on('click', 'a', function() {
  var img = $(this).prev()[0]
  img.src = Utils.URL.VALIDATA_IMG + '?' + Math.random()
})

var $loginBtn = $('#loginBtn')

function effectStart() {
  $.AMUI.progress.set(0.8)
  $loginBtn.button('loading')
}

function effectDone() {
  $.AMUI.progress.done()
  $loginBtn.button('reset')
}

$('#loginForm').submit(function(ev) {
  ev.preventDefault()

  var $username = $('#username')
  var $password = $('#password')
  var $validate = $('#validateCode')
  var pwd_str = $.trim($password.val()),
      act_str = $.trim($username.val()),
      vali_str = $.trim($validate.val())

  if (act_str === '') {
    Utils.UI.toast('请填写用户名')
  }
  else if (pwd_str === '') {
    Utils.UI.toast('请填写密码')
  }
  else if ($('#validateCodeDiv').is(':visible') && vali_str === '') {
    Utils.UI.toast('请填写验证码')
  }
  else {
    effectStart()

    var $loginForm = $(this)
    if (CEIS.exponent && CEIS.modulus) {
      var key = Utils.RSAUtils.getKeyPair(CEIS.exponent, '', CEIS.modulus);
      var encryptedPwd = Utils.RSAUtils.encryptedString(key, pwd_str);
      $password.val(encryptedPwd);
    }

    $.post(Utils.URL.LOGIN, $loginForm.serializeArray())
     .done(function(data) {
       if (data && data.status === 'success') {
         CEIS.sessionid = data.content.sessionid;
         CEIS.firstLogin = data.content.firstLogin;
         Utils.storage.set('ceis', CEIS)
         if (CEIS.firstLogin) {
           Utils.UI.toast('首次登陆或密码过期，请修改密码！')
           Utils.forward('./modifypwd.html')
         }
         else {
           Utils.UI.toast('登录成功！')
           Utils.forward('./index.html')
         }
       }
       else {
         $password.val('')
         Utils.UI.toast(data.msg)
         effectDone()

         if (data.content && data.content.shiroLoginFailure == 'org.apache.shiro.authc.AuthenticationException'){
           $('#validateCodeDiv').show()
         }
         $('#validateCodeDiv a').click()
       }
     })
     .always(function(data) {
       effectDone()
     })

  }

})
