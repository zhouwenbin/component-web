define([], function () {
  'use strict';

  var MD5_KEY = 'www.sfht.com';

  var NONE_APPEND_WORD = 'sfhaitao.xyz!';

  var DEFAULT_REQUEST_HEADER = {
    _aid: 1,
    _sm: 'md5'
  };

  var host = window.location.hostname;
  var DEV_API_URL = {
    url: 'http://'+host+'/m.api',
    fileurl: 'http://'+host+'/file.api',
    detailurl: 'http://'+host,
    topicurl: 'http://'+host,
    mainurl: 'http://'+host
  };

  var main = 'www.sfht.com';
  var DEV_FILE_LINK = {
    '404': 'http://'+main+'/404.html',
    'activated': 'http://'+main+'/activated.html',
    'agreement': 'http://'+main+'/agreement.html',
    'center': 'http://'+main+'/orderlist.html',
    'gotopay': 'http://'+main+'/gotopay.html',
    'index': 'http://'+main+'/index.html',
    'login': 'http://'+main+'/login.html',
    'nullactivated':'http://'+main+'/nullactivated.html',
    'order': 'http://'+main+'/order.html',
    'orderdetail': 'http://'+main+'/orderdetail.html',
    'orderlist': 'http://'+main+'/orderlist.html',
     'pointlist': 'http://'+main+'/point-manage.html',
    'passwordchange': 'http://'+main+'/accountmanage.html',
    'preheat': 'http://'+main+'/preheat.html',
    'process': 'http://'+main+'/process.html',
    'register': 'http://'+main+'/register.html',
    'retrieve': 'http://'+main+'/retrieve.html',
    'ilogin': 'http://'+main+'/i.login.html',
    'iregister': 'http://'+main+'/i.register.html',
    'coupon': 'http://'+main+'/coupon.html',
    'bindaccount':'http://'+main+'/bindaccount.html',//@note 绑定账号
    'setpassword':'http://'+main+'/setpassword.html',//@note 设置密码并登录
    'paysuccess': 'http://'+main+'/paysuccess.html',
    'search': 'http://'+main+'/search.html',
    'usercenter': 'http://'+main+'/accountmanage.html',
  }

  return {
    setting:{
      'none_append_word': NONE_APPEND_WORD,
      'default_header': DEFAULT_REQUEST_HEADER,
      'md5_key': MD5_KEY,
      'api': DEV_API_URL,
      'link': DEV_FILE_LINK
    }
  };
});
