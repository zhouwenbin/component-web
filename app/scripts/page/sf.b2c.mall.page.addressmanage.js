'use strict';

define(
	'sf.b2c.mall.page.addressmanage', [
		'can',
		'jquery',
		'sf.b2c.mall.center.receiveaddr',
		'sf.b2c.mall.framework.comm',
		'sf.b2c.mall.business.config'
	],
	function(can, $, SFReceiveaddr, SFFrameworkComm) {

		SFFrameworkComm.register(1);

		var addressmanage = can.Control.extend({

			init:function(){
				
				this.render();
			},

			render:function(){

				new SFReceiveaddr('.sf-b2c-mall-address-manage');
			},

		});

		new addressmanage('.sf-b2c-mall-address-manage');
	})