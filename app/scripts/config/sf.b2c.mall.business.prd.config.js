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
    url: 'http://www.sfht.com/m.api',
    fileurl: 'http://www.sfht.com/file.api',
    detailurl: 'http://item.sfht.com',
    topicurl: 'http://topic.sfht.com',
    mainurl: 'http://www.sfht.com'
  };

  var DEV_FILE_LINK = {
    '404': 'http://www.sfht.com/404.html',
    'activated': 'http://www.sfht.com/activated.html',
    'agreement': 'http://www.sfht.com/agreement.html',
    'center': 'http://www.sfht.com/center.html',
    'gotopay': 'http://www.sfht.com/gotopay.html',
    'index': 'http://www.sfht.com/index.html',
    'login': 'http://www.sfht.com/login.html',
    'nullactivated':'http://www.sfht.com/nullactivated.html',
    'order': 'http://www.sfht.com/order.html',
    'orderdetail': 'http://www.sfht.com/orderdetail.html',
    'orderlist': 'http://www.sfht.com/orderlist.html',
    'passwordchange': 'http://www.sfht.com/password-change.html',
    'preheat': 'http://www.sfht.com/preheat.html',
    'process': 'http://www.sfht.com/process.html',
    'register': 'http://www.sfht.com/register.html',
    'retrieve': 'http://www.sfht.com/retrieve.html',
    'ilogin': 'http://www.sfht.com/i.login.html',
    'iregister': 'http://www.sfht.com/i.register.html'
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