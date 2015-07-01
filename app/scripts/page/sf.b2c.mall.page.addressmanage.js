'use strict';

define(
	'sf.b2c.mall.page.addressmanage', [
		'can',
		'jquery',
		'sf.b2c.mall.center.receiveaddr',
		'sf.b2c.mall.framework.comm',
		'sf.b2c.mall.business.config',
		'sf.b2c.mall.component.header',
		'sf.b2c.mall.component.centerleftside',
		'sf.b2c.mall.component.footer'
	],
	function(can, $, SFReceiveaddr, SFFrameworkComm,SFBusiness, Header, Centerleftside, Footer) {

		SFFrameworkComm.register(1);

		var addressmanage = can.Control.extend({

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
				new SFReceiveaddr('.sf-b2c-mall-address-manage');
			}

		});

		new addressmanage('.sf-b2c-mall-address-manage');
	})