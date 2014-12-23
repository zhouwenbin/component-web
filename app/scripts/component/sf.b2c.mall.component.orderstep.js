'use strict';

define('sf.b2c.mall.component.orderstep', [
      'can'
    ],
    function(can) {
      return can.Control.extend({

        /**
         * 初始化
         * @param  {DOM} element 容器element
         * @param  {Object} options 传递的参数
         */
        init: function(element, options) {
          this.data = options.data;
          this.render(this.data);
        },

        /**
         * [render 进行渲染]
         * @param  {[type]} data
         * @return {[type]}
         */
        render: function(data) {
          var html = can.view('templates/component/sf.b2c.mall.component.orderstep.mustache', data);
          this.element.html(html);
        }


      })
    )