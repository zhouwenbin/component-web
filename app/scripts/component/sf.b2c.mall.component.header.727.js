'use strict';

/**
 * [description]
 * @param  {[type]} can
 * @return {[type]}
 */
define('sf.b2c.mall.component.header.727', [
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
  'text!template_header_727'
], function(text, $, cookie, can, _, md5, store, SFComm, SFConfig, SFFn, SFMessage, template_header_727) {

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
      var renderFn = can.mustache(template_header_727);
      var html = renderFn(data, this.helpers);
      this.element.prepend(html);dddddd

      // 88元包邮上线希望banner不要点击，切记，下次要去掉！！！！！！！！！
      // $('.banner-scroll').css({'cursor': 'default'});

      this.showAD();
    },

    showAD: function() {

      if (!this.isInShowPage()) {
        $(".banner-scroll").hide();
        return false;
      }

      $('.banner-scroll').delay(1000).animate({
          "height": 100
        }, 300);
    },

    ".banner-scroll click": function() {
      // return false;
      // window.location.href = "http://www.sfht.com/activity/705.html?_spm=0.404.2830.1";
      window.location.href = "http://www.sfht.com/activity/737.html?_spm=0.404.2830.1";
    },

    isInShowPage: function() {

      var url = window.location.href;

      //URL补齐
      if (url == "http://www.sfht.com/") {
        url = url + "index.html";
      }

      // 如果不是详情页 首页和活动页 则不显示广告
      var isShowURL = /index|activity|detail|y.html/.test(url);
      if (!isShowURL && window.location.pathname != "/") {
        return false;
      }

      // 小鲜肉活动，如果是438页面则不显示
      if (window.location.href.indexOf('737.html') > -1) {
        return false;
      }

      return true;
    }

  });

});