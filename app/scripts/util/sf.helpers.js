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

  can.Mustache.registerHelper('sf.time', function(time) {
    if (_.isFunction(time)) {
      time = time();
    }

    return moment(time).format('YYYY-MM-DD HH:mm:ss');
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
    return (price / 100).toString();
  });

});