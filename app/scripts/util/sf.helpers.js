'use strict';

define('sf.helpers', ['jquery',
  'jquery.cookie',
  'can',
  'underscore',
  'md5',
  'moment'
], function($, cookie, can, _, md5, moment) {

  can.Mustache.registerHelper('sf.toggle', function(value) {
    return function(el) {
      new Toggle(el, {
        value: value
      });
    };
  });

  can.Mustache.registerHelper('sf.time', function(time, format) {
    if (_.isFunction(time)) {
      time = time();
    }

    if (_.isObject(arguments[1])) {
      format = 'YYYY-MM-DD HH:mm:ss';
    }

    return moment(time).format(format);
  });

  can.Mustache.registerHelper('sf.split', function(str) {
    if (_.isFunction(str)) {
      str = str();
    }

    if (str.length > 3){
      return str;
    }

    return str.split("").join(" ");
  });

  /**
   * @description sf.price
   * @param  {int} price Price
   */
  can.Mustache.registerHelper('sf.price', function(price) {

    var getValue = function(v) {
      if (_.isFunction(v)) {
        price = v();
      }
    };

    while (_.isFunction(price)) {
      getValue(price);
    }

    // return (price/100).toFixed(2).toString();
    // return (price / 100).toString();

    if (parseInt(price) > 0) {
      return (price / 100).toString();
    }else{
      return (price / 100).toString();
    }
  });

  can.Mustache.registerHelper('sf.img', function(img, options) {
    if (_.isFunction(img)) {
      img = img();
    }

    var arr = [];
    if (_.isString(img)) {
      arr = img.split(',');
    } else if (_.isArray(img)) {
      arr = img;
    }

    //做线上兼容，如果有http了 就不要再加前缀
    var hasURL = _.str.include(arr[0], 'http://')
    if (hasURL){
      return arr[0];
    }

    return 'http://img0.sfht.com/' + arr[0];
  });

});
