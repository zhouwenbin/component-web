define([], function () {
  'use strict';

  var MD5_KEY = 'test2.sfht.com';

  var NONE_APPEND_WORD = 'sfhaitao.xyz!';

  var DEFAULT_REQUEST_HEADER = {
    _aid: 1,
    _sm: 'md5'
  };

  var host = window.location.hostname;
  var DEV_API_URL = {
    url: 'http://test2.sfht.com/m.api',
    fileurl: 'http://test2.sfht.com/file.api',
    detailurl: 'http://test2-item.sfht.com',
    topicurl: 'http://test2-topic.sfht.com',
    mainurl: 'http://test2.sfht.com'
  };

  var DEV_FILE_LINK = {
    '404': 'http://test2.sfht.com/404.html',
    'activated': 'http://test2.sfht.com/activated.html',
    'agreement': 'http://test2.sfht.com/agreement.html',
    'center': 'http://test2.sfht.com/center.html',
    'gotopay': 'http://test2.sfht.com/gotopay.html',
    'index': 'http://test2.sfht.com/index.html',
    'login': 'http://test2.sfht.com/login.html',
    'nullactivated':'http://test2.sfht.com/nullactivated.html',
    'order': 'http://test2.sfht.com/order.html',
    'orderdetail': 'http://test2.sfht.com/orderdetail.html',
    'orderlist': 'http://test2.sfht.com/orderlist.html',
    'passwordchange': 'http://test2.sfht.com/password-change.html',
    'preheat': 'http://test2.sfht.com/preheat.html',
    'process': 'http://test2.sfht.com/process.html',
    'register': 'http://test2.sfht.com/register.html',
    'retrieve': 'http://test2.sfht.com/retrieve.html',
    'ilogin': 'http://test2.sfht.com/i.login.html',
    'iregister': 'http://test2.sfht.com/i.register.html'
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