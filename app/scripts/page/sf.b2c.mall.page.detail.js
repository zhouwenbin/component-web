'use strict';

require(
  [
    'can',
    'jquery',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.product.breadscrumb',
    'sf.b2c.mall.product.detailcontent'
  ],

  function(can, $, Header, Footer, Breadscrumb, DetailContent) {

    var home = can.Control.extend({

      init: function(element, options) {
        this.component = {};

        this.render();
        this.supplement();
      },

      render: function() {

        new Header('.sf-b2c-mall-header');
        new Footer('.sf-b2c-mall-footer');

        //面包屑
        new Breadscrumb('.sf-b2c-mall-product-breadcrumb');

        //详情页
        new DetailContent('.sf-b2c-mall-detail-content');

      },

      supplement: function() {

      }
    });

    new home('#content');
  });