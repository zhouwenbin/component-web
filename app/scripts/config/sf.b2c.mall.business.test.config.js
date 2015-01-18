define([], function () {
  'use strict';

  var MD5_KEY = 'test.sfht.com';

  var NONE_APPEND_WORD = 'sfhaitao.xyz!';

  var DEFAULT_REQUEST_HEADER = {
    _aid: 1,
    _sm: 'md5'
  };

  var host = window.location.hostname;
  var DEV_API_URL = {
    url: 'http://test.sfht.com/m.api',
    fileurl: 'http://test.sfht.com/file.api',
    detailurl: 'http://test-item.sfht.com',
    topicurl: 'http://test-topic.sfht.com',
    mainurl: 'http://test.sfht.com'
  };

  var DEV_FILE_LINK = {
    '404': 'http://test.sfht.com/404.html',
    'activated': 'http://test.sfht.com/activated.html',
    'agreement': 'http://test.sfht.com/agreement.html',
    'center': 'http://test.sfht.com/center.html',
    'gotopay': 'http://test.sfht.com/gotopay.html',
    'index': 'http://test.sfht.com/index.html',
    'login': 'http://test.sfht.com/login.html',
    'nullactivated':'http://test.sfht.com/nullactivated.html',
    'order': 'http://test.sfht.com/order.html',
    'orderdetail': 'http://test.sfht.com/orderdetail.html',
    'orderlist': 'http://test.sfht.com/orderlist.html',
    'passwordchange': 'http://test.sfht.com/password-change.html',
    'preheat': 'http://test.sfht.com/preheat.html',
    'process': 'http://test.sfht.com/process.html',
    'register': 'http://test.sfht.com/register.html',
    'retrieve': 'http://test.sfht.com/retrieve.html',
    'ilogin': 'http://test.sfht.com/i.login.html',
    'iregister': 'http://test.sfht.com/i.register.html'
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