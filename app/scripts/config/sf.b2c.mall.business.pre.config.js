define([], function () {
  'use strict';

  var MD5_KEY = 'pre.sfht.com';

  var NONE_APPEND_WORD = 'sfhaitao.xyz!';

  var DEFAULT_REQUEST_HEADER = {
    _aid: 1,
    _sm: 'md5'
  };

  var host = window.location.hostname;
  var DEV_API_URL = {
    url: 'http://pre.sfht.com/m.api',
    fileurl: 'http://pre.sfht.com/file.api',
    detailurl: 'http://pre-item.sfht.com',
    topicurl: 'http://pre-topic.sfht.com',
    mainurl: 'http://pre.sfht.com'
  };

  var DEV_FILE_LINK = {
    '404': 'http://pre.sfht.com/404.html',
    'activated': 'http://pre.sfht.com/activated.html',
    'agreement': 'http://pre.sfht.com/agreement.html',
    'center': 'http://pre.sfht.com/center.html',
    'gotopay': 'http://pre.sfht.com/gotopay.html',
    'index': 'http://pre.sfht.com/index.html',
    'login': 'http://pre.sfht.com/login.html',
    'nullactivated':'http://pre.sfht.com/nullactivated.html',
    'order': 'http://pre.sfht.com/order.html',
    'orderdetail': 'http://pre.sfht.com/orderdetail.html',
    'orderlist': 'http://pre.sfht.com/orderlist.html',
    'passwordchange': 'http://pre.sfht.com/password-change.html',
    'preheat': 'http://pre.sfht.com/preheat.html',
    'process': 'http://pre.sfht.com/process.html',
    'register': 'http://pre.sfht.com/register.html',
    'retrieve': 'http://pre.sfht.com/retrieve.html',
    'ilogin': 'http://pre.sfht.com/i.login.html',
    'iregister': 'http://pre.sfht.com/i.register.html'
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