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
    'sf.b2c.mall.widget.message',
    'sf.b2c.mall.api.user.bindAliAct',
    'text!template_component_bindalipay',
    'sf.b2c.mall.widget.dialog'
  ],
  function($, can, store, md5, SFBizConf, SFFn, SFMessage, SFBindAliAct, template_component_bindalipay, SFDialog) {


    return SFDialog.extend({

      init: function() {
        // this._super();
        SFDialog.prototype.init.apply(this, [{
          "title": "支付宝账号绑定"
        }]);
      },

      /**
       * [getHtml 供父类调用]
       * @return {[type]} [description]
       */
      getHtml: function() {
        var template = can.view.mustache(template_component_bindalipay);
        return template(this.getData(), this.helpers);
      },

      getData: function() {
        this.data = new can.Map({
          "alipayaccount": "",
          "alipayaccounterror": "",
          "realipayaccount": "",
          "realipayaccounterror": "",
          "alipayname": "",
          "alipaynameerror": "",
          "rule": false,
          "ruleerror": ""
        });
        return this.data;
      },

      ".btn-send click": function(element, event) {
        // 调用绑定接口  绑定成功后调用体现接口
        var data = this.data.attr();

        if (!data.rule) {
          $("#ruleerror")[0].style.display = "";
          this.data.attr("ruleerror", "需同意规则条款");
          return false;
        }

        if (!data.alipayaccount) {
          $("#alipayaccounterror")[0].style.display = "";
          this.data.attr("alipayaccounterror", "不能为空");
          return false;
        }

        if (!data.realipayaccount) {
          $("#realipayaccounterror")[0].style.display = "";
          this.data.attr("realipayaccounterror", "不能为空");
          return false;
        }

        if (data.alipayaccount != data.realipayaccount) {
          $("#realipayaccounterror")[0].style.display = "";
          this.data.attr("realipayaccounterror", "输入的账号不一致");
          return false;
        }

        if (!data.alipayname) {
          $("#alipaynameerror")[0].style.display = "";
          this.data.attr("alipaynameerror", "不能为空");
          return false;
        }

        var bindAliAct = new SFBindAliAct({
          "aliAct": data.alipayaccount,
          "aliActName": data.alipayname
        });

        var that = this;

        bindAliAct.sendRequest()
          .done(function(data) {
            if (data.value) {debugger;
              that.close();
              new SFMessage(null, {
                'tip': '支付宝账号绑定成功！',
                'type': 'success',
                'okFunction': _.bind(function() {
                  window.location.reload();
                })
              });
            }
          })
          .fail(function(error) {
            $("#alipaynameerror")[0].style.display = "";
            that.data.attr("alipaynameerror", "支付宝账号绑定失败！");
          })

      },

      "#rule click": function(element, event) {
        $("#ruleerror")[0].style.display = "none";
      },

      "#alipayaccount blur": function() {
        $("#alipayaccounterror")[0].style.display = "none";
      },

      "#realipayaccount blur": function() {
        $("#realipayaccounterror")[0].style.display = "none";
      },

      "#alipayname blur": function() {
        $("#alipaynameerror")[0].style.display = "none";
      }
    });
  })