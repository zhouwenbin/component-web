/**
 * Created by 魏志强 on 2014/12/26.
 */
define(
  [
    'can',
    'jquery',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.center.change.userinfo',
    'sf.b2c.mall.center.receiveperson',
    'sf.b2c.mall.center.receiveaddr'
  ],
  function(can, $, Header, Footer, ChangeUserInfo, SFReceiveperson, SFReceiveaddr) {

    var center = can.Control.extend({

      /**
       * [init 初始化]
       */
      init: function() {
        this.render();
        this.supplement();
      },

      /**
       * [render 渲染]
       */
      render: function() {
        new Header('.sf-b2c-mall-header');
        new Footer('.sf-b2c-mall-footer');
        new ChangeUserInfo('.user-basic-info');

        new SFReceiveperson('.sf-b2c-mall-center-personmanager');

        new SFReceiveaddr('.sf-b2c-mall-center-addressmanager');
      },

      /**
       * [supplement 补充渲染]
       * @return {[type]}
       */
      supplement: function() {
        //----------select模拟-------------//
        $(".btn-select").on("click", function() {
          if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            $(this).find("ul").hide();
          } else {
            $(this).addClass("active");
            $(this).find("ul").show();
          }
        });
        $(".btn-select").on("click", "label", function() {
          var btnSelect = $(this).parents(".btn-select")
          btnSelect.removeClass("active");
          var value = $(this).text();
          btnSelect.find(".btn-select-num").text(value);
          btnSelect.find("ul").hide();
          return false;
        })
      }
    });

    document.domain = 'sfht.com';
    new center('.center');
  })