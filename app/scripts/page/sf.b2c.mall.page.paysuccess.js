/**
 * Created by 张可 on 2015/3/9.
 *
 *
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
       * @description 页面初始化
       */
      init: function() {
        this.render();
      },

      /**
       * @description 页面渲染
       */
      render: function() {
        var header = new Header('.sf-b2c-mall-header', {isForceLogin: true});
        var footer = new Footer('.sf-b2c-mall-footer');

        // @deprecated 不再渲染order-step
        // @author Michael.Lee
        // step
        // new OrderSetp('.sf-b2c-mall-order-step', {
        //   "thirdstep": "active"
        // });

        var paySuccess = new PaySuccess(".sf-b2c-mall-order-paysuccess");
      }
    });

    var pagePaySuccess = new paySuccess('.paySuccess');
  })
