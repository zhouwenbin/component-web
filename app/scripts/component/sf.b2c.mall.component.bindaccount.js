//绑定账号js
'use strict'

define(
	'sf.b2c.mall.component.bindaccount', 
	[
		'jquery',
		'can',
		'sf.b2c.mall.business.config',
		'sf.util',
		'sf.b2c.mall.api.user.reqLoginAuth'
	]
	function($, can, SFConfig, SFFn, SFReqLoginAuth) {

		init:function(){

			this.data = new can.Map({

			});

			this.render(this.render());

		},

		render:function(){

		}








	})