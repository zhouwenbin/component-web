'use strict';

define(
	'sf.b2c.mall.page.pointmanage', [
		'can',
		'jquery',
		'sf.b2c.mall.center.mypoint',
		'sf.b2c.mall.framework.comm',
		'sf.b2c.mall.business.config',
		'sf.b2c.mall.component.header',
		'sf.b2c.mall.component.footer'
	],
	function(can, $, SFMyPoint, SFFrameworkComm,SFBusiness, Header, Footer) {

		SFFrameworkComm.register(1);

		var pointmanage = can.Control.extend({

			init: function() {

				this.render();
			},

			render: function() {
				var header = new Header('.sf-b2c-mall-header', {
					channel: '首页',
					isForceLogin: true
				});
				new Footer('.sf-b2c-mall-footer');
				new SFMyPoint('.sf-b2c-mall-point-manage');
			}

		});
		new pointmanage('.sf-b2c-mall-point-manage');
	})