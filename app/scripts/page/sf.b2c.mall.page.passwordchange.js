/**
 * Created by 魏志强 on 2014/12/26.
 */
define(
    [
      'can',
      'jquery',
      'sf.b2c.mall.component.header',
      'sf.b2c.mall.component.footer',
      'sf.b2c.mall.center.change.password'

    ],
    function(can, $, Header, Footer, ChangePassword) {

      var changePwd = can.Control.extend({

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
          new Header('.sf-b2c-mall-header', {isForceLogin: true});
          new Footer('.sf-b2c-mall-footer');
          new ChangePassword('.change-password-wrap');
        },

        /**
         * [supplement 补充渲染]
         * @return {[type]}
         */
        supplement: function() {


        }
      });

      window.name = 'sfht.com';
      new changePwd('.change-password-wrap');
    })