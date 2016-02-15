
var HOST = ''//'http://172.30.2.105:8083/'
var CONTEXT_URL = HOST + 'ceis/a/'

module.exports = {

  VALIDATA_IMG: HOST + 'ceis/servlet/validateCodeServlet',
  LOGIN: CONTEXT_URL + 'login',
  LOGOUT: CONTEXT_URL + 'logout',
  LIST_MENU: CONTEXT_URL + 'sys/user/listMenus.yy',
  RSA_KEY: CONTEXT_URL + 'getrsakey.yy',
  MODIFYPWD: CONTEXT_URL + 'sys/user/modifyPwd.yy',

  REPAY_LIST: CONTEXT_URL + 'repay/list.yy',
  REPAY_DETAIL: CONTEXT_URL + 'repay/detail.yy',
  REPAY_DEBIT: CONTEXT_URL + 'repay/debit.yy',

  SURVEY_LIST: CONTEXT_URL + 'apy/survey/list.yy',
  SURVEY_DETAIL: CONTEXT_URL + 'apy/survey/detail.yy',
  SURVEY_SAVE: CONTEXT_URL + 'apy/survey/save.yy'

}
