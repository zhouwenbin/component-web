/**
 * Created by 张可 on 2015/3/9.
 */
define(
  'sf.b2c.mall.page.paysuccess',
  [
    'can',
    'jquery',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.order.step',
    'sf.b2c.mall.order.paysuccess',
    'sf.b2c.mall.framework.comm'
  ],
  function(can, $, Header, Footer, OrderSetp, PaySuccess, SFFrameworkComm) {
    SFFrameworkComm.register(1);

    var paySuccess = can.Control.extend({

      /**
       * [init 初始化]
       */
      init: function() {
        this.render();
      },

      /**
       * [render 渲染]
       */
      render: function() {
        new Header('.sf-b2c-mall-header', {isForceLogin: true});
        new Footer('.sf-b2c-mall-footer');
        //step
        new OrderSetp('.sf-b2c-mall-order-step', {
          "thirdstep": "active"
        });
        new PaySuccess(".sf-b2c-mall-order-paysuccess");
      }
    });

    new paySuccess('.paySuccess');
  })
