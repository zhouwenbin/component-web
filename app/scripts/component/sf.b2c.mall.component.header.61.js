'use strict';

/**
 * [description]
 * @param  {[type]} can
 * @return {[type]}
 */
define('sf.b2c.mall.component.header.61', [
  'text',
  'jquery',
  'jquery.cookie',
  'can',
  'underscore',
  'md5',
  'store',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.business.config',
  'sf.util',
  'sf.b2c.mall.widget.message',
  'text!template_header_61'
], function(text, $, cookie, can, _, md5, store, SFComm, SFConfig, SFFn, SFMessage, template_header_61) {

  return can.Control.extend({

    /**
     * @description 初始化方法，当调用new时会执行init方法
     * @param  {Dom} element 当前dom元素
     * @param  {Map} options 传递的参数
     */
    init: function(element, options) {
      this.render(this.data);
    },

    render: function(data) {
      //渲染页面
      var renderFn = can.mustache(template_header_61);
      var html = renderFn(data, this.helpers);
      this.element.prepend(html);

      this.showAD();
    },

    showAD: function() {

      if (SFComm.prototype.checkUserLogin.call(this)) {
        $(".banner-scroll3").hide();
        return false;
      }

      if (!this.isInShowPage()) {
        $(".banner-scroll3").hide();
        return false;
      }

      if (store.get("closed") === 'true') {
        $(".banner-scroll3").hide();
        $('.banner-scroll').delay(1000).animate({
          "height": 100
        }, 300);
      } else {
        $('.banner-scroll3').delay(100).animate({
          "height": 400
        }, 300);
      }

    },

    '.close click': function(element, event) {
      $('.banner-scroll3')
        .animate({
          'height': 0
        }, 1000, function() {
          $(".close").hide();
        });

      $('.banner-scroll').delay(1000).animate({
        "height": 100
      }, 300);

      store.set("closed", "true");
    },

    '.banner-scroll click': function(element, event) {
      $('.banner-scroll')
        .animate({
          'height': 0
        }, 300)

      $(".banner-scroll3").show();
      $('.banner-scroll3').delay(100).animate({
        "height": 400
      }, 1000, function() {
        $(".close").show();
      });

    },

    '.bigpic click': function(element, event) {
      this.options.originheader.showRegister("http://www.sfht.com/activity/251.html?_spm=0.229.1719.1");
    },

    isInShowPage: function() {

      var url = window.location.href;

      //URL补齐
      if (url == "http://www.sfht.com/") {
        url = url + "index.html";
      }

      // 如果不是详情页 首页和活动页 则不显示广告
      var isShowURL = /index|activity|detail|y.html/.test(url);
      if (!isShowURL) {
        return false;
      }

      return true;
    }

  });

});