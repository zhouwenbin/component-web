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
    url: 'http://dev.sfht.com/m.api',
    fileurl: 'http://dev.sfht.com/file.api',
    detailurl: 'http://dev-item.sfht.com',
    topicurl: 'http://dev-topic.sfht.com',
    mainurl: 'http://dev.sfht.com'
  };

  var DEV_FILE_LINK = {
    '404': 'http://dev.sfht.com/404.html',
    'activated': 'http://dev.sfht.com/activated.html',
    'agreement': 'http://dev.sfht.com/agreement.html',
    'center': 'http://dev.sfht.com/center.html',
    'gotopay': 'http://dev.sfht.com/gotopay.html',
    'index': 'http://dev.sfht.com/index.html',
    'login': 'http://dev.sfht.com/login.html',
    'nullactivated':'http://dev.sfht.com/nullactivated.html',
    'order': 'http://dev.sfht.com/order.html',
    'orderdetail': 'http://dev.sfht.com/orderdetail.html',
    'orderlist': 'http://dev.sfht.com/orderlist.html',
    'passwordchange': 'http://dev.sfht.com/password-change.html',
    'preheat': 'http://dev.sfht.com/preheat.html',
    'process': 'http://dev.sfht.com/process.html',
    'register': 'http://dev.sfht.com/register.html',
    'retrieve': 'http://dev.sfht.com/retrieve.html',
    'ilogin': 'http://dev.sfht.com/i.login.html',
    'iregister': 'http://dev.sfht.com/i.register.html'
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