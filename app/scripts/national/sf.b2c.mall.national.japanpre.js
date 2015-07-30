'use strict';

define('sf.b2c.mall.national.japanpre', 
  [
  	'text', 
  	'can'
	], 
	function(text, can) {
	  return can.Control.extend({

	    /**
	     * 初始化slide控件
	     * @param  {DOM} element 容器element
	     * @param  {Object} options 传递的参数
	     */
	    init: function(element, options) {
	      if(!this.element.hasClass('serverRendered')){
	        this.render();
	      }
	    },

	    render: function () {
	      var renderFn = can.mustache(template_footer);
	      var html = renderFn({});

	      // var html = can.view('templates/component/sf.b2c.mall.footer.mustache')({});
	      this.element.html(html);
	    }
  	});
});