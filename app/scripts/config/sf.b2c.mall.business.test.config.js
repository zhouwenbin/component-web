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
    url: 'http://test1.www.sfht.net/m.api',
    fileurl: 'http://test1.www.sfht.net/file.api',
    detailurl: 'http://test-item.sfht.com',
    topicurl: 'http://test-topic.sfht.com',
    mainurl: 'http://test1.www.sfht.net'
  };

  var DEV_FILE_LINK = {
    '404': 'http://test1.www.sfht.net/404.html',
    'activated': 'http://test1.www.sfht.net/activated.html',
    'agreement': 'http://test1.www.sfht.net/agreement.html',
    'center': 'http://test1.www.sfht.net/center.html',
    'gotopay': 'http://test1.www.sfht.net/gotopay.html',
    'index': 'http://test1.www.sfht.net/index.html',
    'login': 'http://test1.www.sfht.net/login.html',
    'nullactivated':'http://test1.www.sfht.net/nullactivated.html',
    'order': 'http://test1.www.sfht.net/order.html',
    'orderdetail': 'http://test1.www.sfht.net/orderdetail.html',
    'orderlist': 'http://test1.www.sfht.net/orderlist.html',
    'passwordchange': 'http://test1.www.sfht.net/password-change.html',
    'preheat': 'http://test1.www.sfht.net/preheat.html',
    'process': 'http://test1.www.sfht.net/process.html',
    'register': 'http://test1.www.sfht.net/register.html',
    'retrieve': 'http://test1.www.sfht.net/retrieve.html',
    'ilogin': 'http://test1.www.sfht.net/i.login.html',
    'iregister': 'http://test1.www.sfht.net/i.register.html'
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