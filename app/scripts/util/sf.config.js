sf.config = {
  dev: {
    url: 'http://dev.sfht.com/m.api',
    word: 'www.sfht.com',
    fileurl: 'file.api',
    captcha: 'http://checkcode.sfht.com/captcha/',
    swf: 'http://dev.sfht.com/scripts/'
  },
  test: {
    url: 'http://test.sfht.com/m.api',
    word: 'www.sfht.com', //不能改！！！
    swf: 'http://test.sfht.com/scripts/',
    fileurl: 'file.api',
    captcha: 'http://checkcode.sfht.com/captcha/'
  },
  internal: {
    url: 'http://10.32.151.46/m.api',
    word: 'www.sfht.com', //不能改！！！
    swf: 'http://10.32.151.46/scripts/',
    fileurl: 'file.api',
    captcha: 'http://checkcode.sfht.com/captcha/'
  },
  prd: {
    url: 'http://www.sfht.com/m.api',
    word: 'www.sfht.com', //不能改！！！
    swf: 'http://www.sfht.com/scripts/',
    fileurl: 'file.api',
    captcha: 'http://checkcode.sfht.com/captcha/',
    secret: 'https://www.sfht.com/m.api'
  }
};

sf.config.current = sf.config.test;