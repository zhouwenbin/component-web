'use strict';

define(
	'sf.b2c.mall.page.pointmanage', [
		'can',
		'jquery',
		'sf.b2c.mall.framework.comm',
		'sf.b2c.mall.business.config',
		'sf.b2c.mall.component.header',
		'sf.b2c.mall.component.footer'
	],
	function(can, $, SFFrameworkComm,SFBusiness, Header, Footer) {

		SFFrameworkComm.register(1);

		var integralActive = can.Control.extend({

			init: function() {

				this.render();
			},

			render: function() {
				var header = new Header('.sf-b2c-mall-header', {
					channel: '首页',
					isForceLogin: true
				});
				new Footer('.sf-b2c-mall-footer');
			},

            '.integral-active-r1 click': function(el, event) {
                event && event.preventDefault();
                if (SFFrameworkComm.prototype.checkUserLogin.call(this)) {
                    window.location.href = "http://www.sfht.com/integral-active.html";
                } else {
                    can.trigger(window, 'showLogin', [window.location.href]);
                }
            },
            '.integral-active-r4 click': function(el, event) {
                event && event.preventDefault();
                if (SFFrameworkComm.prototype.checkUserLogin.call(this)) {
                    window.location.href = "http://www.sfht.com/integral-active.html";
                } else {
                    can.trigger(window, 'showLogin', [window.location.href]);
                }
            }

		});
	})