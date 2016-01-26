
var Utils = require('utils')
require('../../common/common.scss')
var RSAUtils = require('./rsautils')
var CEIS = {}

var RSA_KEY_URL = Utils.CONTEXT_URL + 'getrsakey.do'
var LOGIN_URL = Utils.CONTEXT_URL + 'login'

$.post(RSA_KEY_URL, {}, function(data) {
  if (data && data.content) {
    CEIS.exponent = data.content.e;
    CEIS.modulus = data.content.n;
  }
})

$('#toast').on('opened.modal.amui', function() {
  setTimeout(function() {
    $(this).modal('close')
  }.bind(this), 1000)
})

$('#account').on('change', function() {
  var $username = $(this);
  $username.val($.trim($username.val()).toUpperCase());
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

  var $account = $('#account')
  var $password = $('#password')
  var pwd_str = $.trim($password.val()),
      act_str = $.trim($account.val())

  if (act_str === '') {
    $('#toast-cnt').html('请输入账号')
    $('#toast').modal('open')
  }
  else if (pwd_str === '') {
    $('#toast-cnt').html('请输入密码')
    $('#toast').modal('open')
  }
  else {
    effectStart()

    var $loginForm = $(this)
    if (CEIS.exponent && CEIS.modulus) {
      var key = RSAUtils.getKeyPair(CEIS.exponent, '', CEIS.modulus);
      var encryptedPwd = RSAUtils.encryptedString(key, pwd_str);
      $password.val(encryptedPwd);
    }

    $.post(LOGIN_URL, $loginForm.serializeArray(), function(data) {
      if (data && data.sessionid) {
        CEIS.sessionid = data.sessionid;
        CEIS.firstLogin = data.firstLogin;
        if (data.firstLogin) {
          $('#toast-cnt').html('首次登陆或密码过期，请修改密码！')
          $('#toast').modal('open')
        } else {
          $('#toast-cnt').html('登录成功！')
          $('#toast').modal('open')
        }
      }
      else {
        $password.val('')
        $('#toast-cnt').html('账号或密码错误！')
        $('#toast').modal('open')
        effectDone()
      }
    })

    // setTimeout(function() {
    //   $.AMUI.progress.done()
    //   document.location.href = 'index.html'
    // }, 1500)
  }

})
