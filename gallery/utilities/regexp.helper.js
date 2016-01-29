
module.exports = {

  // 校验是否全由数字组成
  isDigit: function(s) {
    var pattern = /^[0-9]{1,20}$/;
    if (!pattern.exec(s)) return false
    return true
  }

}
