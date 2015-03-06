requirejs.config({
  paths: {
    'can': 'http://www.google.com/bower_components/canjs/amd/can',
    'jquery': 'http://www.google.com/bower_components/jquery/dist/jquery',
    'underscore': 'http://www.google.com/bower_components/underscore/underscore-min',
    'jquery.cookie': 'http://www.google.com/bower_components/jquery.cookie/jquery.cookie',
    'md5': 'http://www.google.com/bower_components/blueimp-md5/js/md5.min',
    'underscore.string': 'http://www.google.com/bower_components/underscore.string/dist/underscore.string.min',
    'store': 'http://www.google.com/bower_components/store/dist/store',

    'sf.b2c.mall.api.security.type': 'http://www.google.com/app/scripts/framework/sf.b2c.mall.api.security.type',
    'sf.b2c.mall.framework.adapter': 'http://www.google.com/app/scripts/framework/sf.b2c.mall.framework.adapter',
    'sf.b2c.mall.framework.comm': 'http://www.google.com/app/scripts/framework/sf.b2c.mall.framework.comm',
    'sf.b2c.mall.framework.multiple.comm': 'http://www.google.com/app/scripts/framework/sf.b2c.mall.framework.multiple.comm',
    'sf.b2c.mall.framework.view.controller': 'http://www.google.com/app/scripts/framework/sf.b2c.mall.framework.view.controller',
    'sf.b2c.mall.util.utils': 'http://www.google.com/app/scripts/util/sf.b2c.mall.util.utils',

    'sf.b2c.mall.api.sc.getUserRoutes': 'scripts/api/sf.b2c.mall.api.sc.getUserRoutes',

    'sf.b2c.mall.api.order.submitOrder': 'scripts/api/sf.b2c.mall.api.order.submitOrder',
    'sf.b2c.mall.api.order.submitOrderV2': 'scripts/api/sf.b2c.mall.api.order.submitOrderV2',
    'sf.b2c.mall.api.order.cancelOrder': 'scripts/api/sf.b2c.mall.api.order.cancelOrder',
    'sf.b2c.mall.api.order.confirmReceive': 'scripts/api/sf.b2c.mall.api.order.confirmReceive',
    'sf.b2c.mall.api.order.getOrder': 'scripts/api/sf.b2c.mall.api.order.getOrder',
    'sf.b2c.mall.api.order.getOrderList': 'scripts/api/sf.b2c.mall.api.order.getOrderList',
    'sf.b2c.mall.api.order.getSubOrder': 'scripts/api/sf.b2c.mall.api.order.getSubOrder',
    'sf.b2c.mall.api.order.requestPay': 'scripts/api/sf.b2c.mall.api.order.requestPay',
    'sf.b2c.mall.api.order.requestPayV2': 'scripts/api/sf.b2c.mall.api.order.requestPayV2',
    'sf.b2c.mall.api.order.submitOrderForAllSys': 'scripts/api/sf.b2c.mall.api.order.submitOrderForAllSys',
    'sf.b2c.mall.api.order.getOrderConfirmInfo': 'scripts/api/sf.b2c.mall.api.order.getOrderConfirmInfo',


    'sf.b2c.mall.api.products.getSKUBaseList': 'scripts/api/sf.b2c.mall.api.product.getSKUBaseList',
    'sf.b2c.mall.api.products.getSKUInfo': 'scripts/api/sf.b2c.mall.api.product.getSKUInfo',
    'sf.b2c.mall.api.products.getSPUInfo': 'scripts/api/sf.b2c.mall.api.product.getSPUInfo',
    'sf.b2c.mall.api.products.updateSkuSellStock': 'scripts/api/sf.b2c.mall.api.product.updateSkuSellStock',
    'sf.b2c.mall.api.products.getAllParents': 'scripts/api/sf.b2c.mall.api.products.getAllParents',
    'sf.b2c.mall.api.products.getCategories': 'scripts/api/sf.b2c.mall.api.products.getCategories',
    'sf.b2c.mall.api.products.search': 'scripts/api/sf.b2c.mall.api.products.search',
    'sf.b2c.mall.api.product.findRecommendProducts': 'scripts/api/sf.b2c.mall.api.product.findRecommendProducts',

    'sf.b2c.mall.api.user.appLogin': 'scripts/api/sf.b2c.mall.api.user.appLogin',
    'sf.b2c.mall.api.user.changePassword': 'scripts/api/sf.b2c.mall.api.user.changePassword',
    'sf.b2c.mall.api.user.checkUserExist': 'scripts/api/sf.b2c.mall.api.user.checkUserExist',
    'sf.b2c.mall.api.user.checkVerifyCode': 'scripts/api/sf.b2c.mall.api.user.checkVerifyCode',
    'sf.b2c.mall.api.user.createRecAddress': 'scripts/api/sf.b2c.mall.api.user.createRecAddress',
    'sf.b2c.mall.api.user.createReceiverInfo': 'scripts/api/sf.b2c.mall.api.user.createReceiverInfo',
    'sf.b2c.mall.api.user.delRecAddress': 'scripts/api/sf.b2c.mall.api.user.delRecAddress',
    'sf.b2c.mall.api.user.deviceRegister': 'scripts/api/sf.b2c.mall.api.user.deviceRegister',
    'sf.b2c.mall.api.user.getIDCardUrlList': 'scripts/api/sf.b2c.mall.api.user.getIDCardUrlList',
    'sf.b2c.mall.api.user.getInviteCodeList': 'scripts/api/sf.b2c.mall.api.user.getInviteCodeList',
    'sf.b2c.mall.api.user.getRecAddressList': 'scripts/api/sf.b2c.mall.api.user.getRecAddressList',
    'sf.b2c.mall.api.user.getUserInfo': 'scripts/api/sf.b2c.mall.api.user.getUserInfo',
    'sf.b2c.mall.api.user.logout': 'scripts/api/sf.b2c.mall.api.user.logout',
    'sf.b2c.mall.api.user.mailRegister': 'scripts/api/sf.b2c.mall.api.user.mailRegister',
    'sf.b2c.mall.api.user.renewToken': 'scripts/api/sf.b2c.mall.api.user.renewToken',
    'sf.b2c.mall.api.user.resetPassword': 'scripts/api/sf.b2c.mall.api.user.resetPassword',
    'sf.b2c.mall.api.user.sendActivateMail': 'scripts/api/sf.b2c.mall.api.user.sendActivateMail',
    'sf.b2c.mall.api.user.sendResetPwdLink': 'scripts/api/sf.b2c.mall.api.user.sendResetPwdLink',
    'sf.b2c.mall.api.user.setDefaultAddr': 'scripts/api/sf.b2c.mall.api.user.setDefaultAddr',
    'sf.b2c.mall.api.user.upateUserInfo': 'scripts/api/sf.b2c.mall.api.user.upateUserInfo',
    'sf.b2c.mall.api.user.updateRecAddress': 'scripts/api/sf.b2c.mall.api.user.updateRecAddress',
    'sf.b2c.mall.api.user.updateReceiverInfo': 'scripts/api/sf.b2c.mall.api.user.updateReceiverInfo',
    'sf.b2c.mall.api.user.userActivate': 'scripts/api/sf.b2c.mall.api.user.userActivate',
    'sf.b2c.mall.api.user.webLogin': 'scripts/api/sf.b2c.mall.api.user.webLogin',
    'sf.b2c.mall.api.user.federatedLogin': 'scripts/api/sf.b2c.mall.api.user.federatedLogin',
    'sf.b2c.mall.api.user.checkLink': 'scripts/api/sf.b2c.mall.api.user.checkLink',
    'sf.b2c.mall.api.user.checkSmsCode': 'scripts/api/sf.b2c.mall.api.user.checkSmsCode',
    'sf.b2c.mall.api.user.downSmsCode': 'scripts/api/sf.b2c.mall.api.user.downSmsCode',
    'sf.b2c.mall.api.user.downMobileVfCode': 'scripts/api/sf.b2c.mall.api.user.downMobileVfCode',
    'sf.b2c.mall.api.user.mobileRegister': 'scripts/api/sf.b2c.mall.api.user.mobileRegister',
    'sf.b2c.mall.api.user.needVfCode': 'scripts/api/sf.b2c.mall.api.user.needVfCode',
    'sf.b2c.mall.api.user.updateUserInfo': 'scripts/api/sf.b2c.mall.api.user.updateUserInfo',
    'sf.b2c.mall.api.user.delRecvInfo': 'scripts/api/sf.b2c.mall.api.user.delRecvInfo',
    'sf.b2c.mall.api.user.getBirthInfo': 'scripts/api/sf.b2c.mall.api.user.delRecvInfo',
    'sf.b2c.mall.api.user.setDefaultRecv': 'scripts/api/sf.b2c.mall.api.user.setDefaultRecv',
    'sf.b2c.mall.api.user.getRecvInfo': 'scripts/api/sf.b2c.mall.api.user.getRecvInfo',

    'sf.b2c.mall.api.b2cmall.getBanner': 'scripts/api/sf.b2c.mall.api.b2cmall.getBanner',
    'sf.b2c.mall.api.b2cmall.getFastSaleInfoList': 'scripts/api/sf.b2c.mall.api.b2cmall.getFastSaleInfoList',
    'sf.b2c.mall.api.b2cmall.getItemInfo': 'scripts/api/sf.b2c.mall.api.b2cmall.getItemInfo',
    'sf.b2c.mall.api.b2cmall.getProductHotData': 'scripts/api/sf.b2c.mall.api.b2cmall.getProductHotData',
    'sf.b2c.mall.api.b2cmall.getProductHotDataList': 'scripts/api/sf.b2c.mall.api.b2cmall.getProductHotDataList',
    'sf.b2c.mall.api.b2cmall.getRecommendProducts': 'scripts/api/sf.b2c.mall.api.b2cmall.getRecommendProducts',
    'sf.b2c.mall.api.b2cmall.getSkuInfo': 'scripts/api/sf.b2c.mall.api.b2cmall.getSkuInfo',
    'sf.b2c.mall.api.b2cmall.getTimeLimitedSaleInfoList': 'scripts/api/sf.b2c.mall.api.b2cmall.getTimeLimitedSaleInfoList',
    'sf.b2c.mall.api.b2cmall.getItemSummary': 'scripts/api/sf.b2c.mall.api.b2cmall.getItemSummary',
    'sf.b2c.mall.api.b2cmall.checkLogistics': 'scripts/api/sf.b2c.mall.api.b2cmall.checkLogistics',

    'sf.b2c.mall.api.coupon.getCpCode': 'scripts/api/sf.b2c.mall.api.coupon.getCpCode',
    'sf.b2c.mall.api.coupon.getUserCouponList': 'scripts/api/sf.b2c.mall.api.coupon.getUserCouponList',

    'sf.b2c.mall.business.config': 'scripts/config/sf.b2c.mall.business.prd.config',

    'placeholders': 'bower_components/Placeholders/build/placeholders',
    'vendor.jquery.imagezoom': 'scripts/vendor/vendor.jquery.imagezoom.min',
    'vendor.jquery.jcountdown': 'scripts/vendor/vendor.jquery.jcountdown.min',
    'moment': 'bower_components/momentjs/min/moment.min',
    'moment-zh-cn': 'bower_components/momentjs/locale/zh-cn',
    'webuploader': 'scripts/vendor/vendor.webuploader',
    'zoom': 'scripts/vendor/vendro.jquery.zoom',
    'sf.helpers': 'scripts/util/sf.helpers',
    'sf.util': 'scripts/util/sf.util.fn',

    'sf.b2c.mall.component.header': 'scripts/component/sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer': 'scripts/component/sf.b2c.mall.component.footer',
    'sf.b2c.mall.component.login': 'scripts/component/sf.b2c.mall.component.login',
    'sf.b2c.mall.component.i.login': 'scripts/component/sf.b2c.mall.component.i.login',
    'sf.b2c.mall.component.register': 'scripts/component/sf.b2c.mall.component.register',
    'sf.b2c.mall.component.i.register': 'scripts/component/sf.b2c.mall.component.i.register',
    'sf.b2c.mall.component.limitedtimesale': 'scripts/component/sf.b2c.mall.component.limitedtimesale',
    'sf.b2c.mall.component.rapidseabuy': 'scripts/component/sf.b2c.mall.component.rapidseabuy',

    'sf.b2c.mall.component.freshfood': 'scripts/component/sf.b2c.mall.component.freshfood',
    'sf.b2c.mall.component.addreditor': 'scripts/component/sf.b2c.mall.component.addreditor',
    'sf.b2c.mall.component.retrieve': 'scripts/component/sf.b2c.mall.component.retrieve',
    'sf.b2c.mall.component.receivepersoneditor': 'scripts/component/sf.b2c.mall.component.receivepersoneditor',
    'sf.b2c.mall.component.login.status.scanner': 'scripts/component/sf.b2c.mall.component.login.status.scanner',

    'sf.b2c.mall.center.register': 'scripts/center/sf.b2c.mall.center.register',
    'sf.b2c.mall.center.change.userinfo': 'scripts/center/sf.b2c.mall.center.change.userinfo',
    'sf.b2c.mall.center.change.password': 'scripts/center/sf.b2c.mall.center.change.password',
    'sf.b2c.mall.center.receiveperson': 'scripts/center/sf.b2c.mall.center.receiveperson',
    'sf.b2c.mall.center.receiveaddr': 'scripts/center/sf.b2c.mall.center.receiveaddr',
    'sf.b2c.mall.center.coupon': 'scripts/center/sf.b2c.mall.center.coupon',

    'sf.b2c.mall.widget.slide': 'scripts/widget/sf.b2c.mall.widget.slide',
    'sf.b2c.mall.widget.modal': 'scripts/widget/sf.b2c.mall.widget.modal',
    'sf.b2c.mall.widget.pagination': 'scripts/widget/sf.b2c.mall.widget.pagination',
    'sf.b2c.mall.widget.file.uploader': 'scripts/widget/sf.b2c.mall.widget.file.uploader',
    'sf.b2c.mall.widget.loading': 'scripts/widget/sf.b2c.mall.widget.loading',
    'sf.b2c.mall.widget.message': 'scripts/widget/sf.b2c.mall.widget.message',
    'sf.b2c.mall.widget.not.support': 'scripts/widget/sf.b2c.mall.widget.not.support',

    'sf.b2c.mall.adapter.limitedtimesale': 'scripts/adapter/sf.b2c.mall.adapter.limitedtimesale',
    'sf.b2c.mall.adapter.rapidSeaBuy': 'scripts/adapter/sf.b2c.mall.adapter.rapidSeaBuy',

    'sf.b2c.mall.product.breadscrumb': 'scripts/product/sf.b2c.mall.product.breadscrumb',
    'sf.b2c.mall.product.detailcontent': 'scripts/product/sf.b2c.mall.product.detailcontent',

    'sf.b2c.mall.adapter.address.list': 'scripts/adapter/sf.b2c.mall.adapter.address.list',
    'sf.b2c.mall.adapter.regions': 'scripts/adapter/sf.b2c.mall.adapter.regions',
    'sf.b2c.mall.adapter.detailcontent': 'scripts/adapter/sf.b2c.mall.adapter.detailcontent',
    'sf.b2c.mall.adapter.pagination': 'scripts/adapter/sf.b2c.mall.adapter.pagination',
    'sf.b2c.mall.adapter.order': 'scripts/adapter/sf.b2c.mall.adapter.order',
    'sf.b2c.mall.adapter.receiveperson.list': 'scripts/adapter/sf.b2c.mall.adapter.receiveperson.list',

    'sf.b2c.mall.page.main': 'scripts/page/sf.b2c.mall.page.main',
    'sf.b2c.mall.page.preheat.register': 'scripts/page/sf.b2c.mall.page.preheat.register',
    'sf.b2c.mall.page.order': 'scripts/page/sf.b2c.mall.page.order',
    'sf.b2c.mall.page.order2': 'scripts/page/sf.b2c.mall.page.order2',
    'sf.b2c.mall.page.gotopay': 'scripts/page/sf.b2c.mall.page.gotopay',
    'sf.b2c.mall.page.gotopay2': 'scripts/page/sf.b2c.mall.page.gotopay2',
    'sf.b2c.mall.page.orderlist': 'scripts/page/sf.b2c.mall.page.orderlist',
    'sf.b2c.mall.page.orderdetail': 'scripts/page/sf.b2c.mall.page.orderdetail',
    'sf.b2c.mall.page.login': 'scripts/page/sf.b2c.mall.page.login',
    'sf.b2c.mall.page.i.login': 'scripts/page/sf.b2c.mall.page.i.login',
    'sf.b2c.mall.page.register': 'scripts/page/sf.b2c.mall.page.register',
    'sf.b2c.mall.page.i.register': 'scripts/page/sf.b2c.mall.page.i.register',
    'sf.b2c.mall.page.process': 'scripts/page/sf.b2c.mall.page.process',
    'sf.b2c.mall.page.activated': 'scripts/page/sf.b2c.mall.page.activated',
    'sf.b2c.mall.page.detail': 'scripts/page/sf.b2c.mall.page.detail',
    'sf.b2c.mall.page.nullactivated': 'scripts/page/sf.b2c.mall.page.nullactivated',
    'sf.b2c.mall.page.center': 'scripts/page/sf.b2c.mall.page.center',
    'sf.b2c.mall.page.retrieve': 'scripts/page/sf.b2c.mall.page.retrieve',
    'sf.b2c.mall.page.passwordchange': 'scripts/page/sf.b2c.mall.page.passwordchange',
    'sf.b2c.mall.page.proxy': 'scripts/page/sf.b2c.mall.page.proxy',
    'sf.b2c.mall.page.common': 'scripts/page/sf.b2c.mall.page.common',
    'sf.b2c.mall.page.federal.login': 'scripts/page/sf.b2c.mall.page.federal.login',
    'sf.b2c.mall.page.coupon': 'scripts/page/sf.b2c.mall.page.coupon',

    'sf.b2c.mall.campaign.common.fill.price': 'scripts/campaign/sf.b2c.mall.campaign.common.fill.price',
    'sf.b2c.mall.campaign.page.common': 'scripts/campaign/sf.b2c.mall.campaign.page.common',

    'sf.b2c.mall.order.step': 'scripts/order/sf.b2c.mall.order.step',
    'sf.b2c.mall.order.selectreceiveaddr': 'scripts/order/sf.b2c.mall.order.selectreceiveaddr',
    'sf.b2c.mall.order.selectreceiveperson': 'scripts/order/sf.b2c.mall.order.selectreceiveperson',
    'sf.b2c.mall.order.iteminfo': 'scripts/order/sf.b2c.mall.order.iteminfo',
    'sf.b2c.mall.order.iteminfo2': 'scripts/order/sf.b2c.mall.order.iteminfo2',
    'sf.b2c.mall.order.orderlistcontent': 'scripts/order/sf.b2c.mall.order.orderlistcontent',
    'sf.b2c.mall.order.orderdetailcontent': 'scripts/order/sf.b2c.mall.order.orderdetailcontent',
    'sf.b2c.mall.order.fn': 'scripts/order/sf.b2c.mall.order.fn',
    'sf.b2c.mall.widget.showArea':'scripts/widget/sf.b2c.mall.widget.showArea',

    'sf.b2c.mall.order.vendor.info': 'scripts/order/sf.b2c.mall.order.vendor.info'
  }
});
