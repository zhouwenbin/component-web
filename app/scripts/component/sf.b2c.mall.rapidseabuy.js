'use strict';

define('sf.b2c.mall.rapidseabuy', ['can'], function(can) {
  return can.Control.extend({

    /**
     * [init description]
     * @param  {[type]} element
     * @param  {[type]} options
     * @return {[type]}
     */
    init: function(element, options) {
      var html = can.view('templates/component/sf.b2c.mall.rapidseabuy.mustache')({});
      this.element.html(html);
    }
  });
})