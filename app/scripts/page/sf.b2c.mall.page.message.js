'use strict';

define(
	'sf.b2c.mall.page.message', [
		'can',
		'jquery',
		'sf.b2c.mall.center.message',
		'sf.b2c.mall.framework.comm',
		'sf.b2c.mall.business.config',
		'sf.b2c.mall.component.header',
		'sf.b2c.mall.component.footer',
		'sf.b2c.mall.component.centerleftside'
	],
	function(can, $, SFmessage, SFFrameworkComm,SFBusiness, Header, Footer, Centerleftside) {

		SFFrameworkComm.register(1);

		var Message = can.Control.extend({

			init: function() {

				this.render();
			},

			render: function() {
				var header = new Header('.sf-b2c-mall-header', {
					channel: '首页',
					isForceLogin: true
				});
				new Footer('.sf-b2c-mall-footer');
				new Centerleftside('.sf-b2c-mall-center-leftside');
				new SFmessage('.sf-b2c-mall-message');
			}

		});
		new Message('.sf-b2c-mall-message');
	})