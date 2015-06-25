//绑定账号js
'use strict'

define(
  'sf.b2c.mall.component.bindalipay', [
    'jquery',
    'can',
    'store',
    'md5',
    'sf.b2c.mall.business.config',
    'sf.util',
    'text!template_component_bindalipay',
    'sf.b2c.mall.widget.dialog'
  ],
  function($, can, store, md5, SFBizConf, SFFn, template_component_bindalipay, SFDialog) {


    return SFDialog.extend({

      init: function() {
        // this._super();
        SFDialog.prototype.init.apply(this, [{"title": "支付宝账号绑定"}]);
      },

      /**
       * [getHtml 供父类调用]
       * @return {[type]} [description]
       */
      getHtml: function(){
        var template = can.view.mustache(template_component_bindalipay);
        return template(this.getData(), this.helpers);
      },

      getData: function(){
        return {};
      },

      ".btn-send click": function(element, event){
        // 调用绑定接口  绑定成功后调用体现接口
      },

      /** 提现接口 */
      getMoney: function(){

      }
    });
  })