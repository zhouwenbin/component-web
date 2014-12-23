'use strict';

sf.util.namespace('b2c.mall.model.adv');

sf.b2c.mall.model.adv = can.Model.extend({

  findSlidesAll: function (data) {
    // return can.ajax('http://mdocshare.qiniudn.com/sf.b2c.mall.slide.json?'+Date.now());
    return can.ajax('json/sf.b2c.mall.slide.json');
  },

  findLoginAdv: function () {
    return can.ajax('json/sf.b2c.mall.login.adv.json');
  }

},{});