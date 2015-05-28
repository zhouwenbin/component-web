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

      if (!this.isInShowPage()) {
        $(".banner-scroll3").hide();
        return false;
      }

      $('.banner-scroll3').delay(100).animate({
        "height": 90
      }, 300);
    },

    '.banner-scroll3 click': function(element, event){
      window.location.href = "http://www.sfht.com/61.html";
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