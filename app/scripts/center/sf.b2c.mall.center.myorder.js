'use strict';

define(
	'sf.b2c.mall.center.myorder',
	[
		'can',
		'jquery',
		'sf.helpers',
		'sf.b2c.mall.api.order.getOrderList',
    'sf.b2c.mall.adapter.pagination',
    'sf.b2c.mall.widget.pagination',
    'sf.b2c.mall.api.order.cancelOrder',
    'sf.b2c.mall.api.sc.getUserRoutes',
    'sf.b2c.mall.widget.message'
	],function(can,$,SFHelpers,SFGetOrderList, PaginationAdapter, Pagination,SFCancelOrder,SFGetUserRoutes,SFMessage){

		return can.Control.extend({

			init:function(){

			},

			render:function(){

			}

		})
	})