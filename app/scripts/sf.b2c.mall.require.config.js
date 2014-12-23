requirejs.config({
  paths: {
    // ----------------------------------------
    // Pre Define
    'can': 'http://www.google.com/bower_components/canjs/amd/can',
    'jquery': 'http://www.google.com/bower_components/jquery/dist/jquery',
    'underscore': 'http://www.google.com/bower_components/underscore/underscore-min',
    'jquery.cookie': 'http://www.google.com/bower_components/jquery.cookie/jquery.cookie',
    'md5': 'http://www.google.com/bower_components/blueimp-md5/js/md5.min',
    'underscore.string': 'http://www.google.com/bower_components/underscore.string/dist/underscore.string.min',

    'sf.b2c.mall.api.logistics.getUserRoutes': 'http://www.google.com/app/scripts/api/logistics/sf.b2c.mall.api.logistics.getUserRoutes',

    'sf.b2c.mall.api.order.submitOrder': 'http://www.google.com/app/scripts/api/order/sf.b2c.mall.api.order.submitOrder',
    'sf.b2c.mall.api.order.submitOrderV2': 'http://www.google.com/app/scripts/api/order/sf.b2c.mall.api.order.submitOrderV2',
    'sf.b2c.mall.api.order.cancelOrder': 'http://www.google.com/app/scripts/api/order/sf.b2c.mall.api.order.cancelOrder',
    'sf.b2c.mall.api.order.confirmReceive': 'http://www.google.com/app/scripts/api/order/sf.b2c.mall.api.order.confirmReceive',
    'sf.b2c.mall.api.order.getOrder': 'http://www.google.com/app/scripts/api/order/sf.b2c.mall.api.order.getOrder',
    'sf.b2c.mall.api.order.getOrderList': 'http://www.google.com/app/scripts/api/order/sf.b2c.mall.api.order.getOrderList',
    'sf.b2c.mall.api.order.getSubOrder': 'http://www.google.com/app/scripts/api/order/sf.b2c.mall.api.order.getSubOrder',
    'sf.b2c.mall.api.order.requestPay': 'http://www.google.com/app/scripts/api/order/sf.b2c.mall.api.order.requestPay',
    'sf.b2c.mall.api.order.requestPayV2': 'http://www.google.com/app/scripts/api/order/sf.b2c.mall.api.order.requestPayV2',
    'sf.b2c.mall.api.order.submitOrderForAllSys': 'http://www.google.com/app/scripts/api/order/sf.b2c.mall.api.order.submitOrderForAllSys',

    'sf.b2c.mall.api.products.getSKUBaseList': 'http://www.google.com/app/scripts/api/products/sf.b2c.mall.api.product.getSKUBaseList',
    'sf.b2c.mall.api.products.getSKUInfo': 'http://www.google.com/app/scripts/api/products/sf.b2c.mall.api.product.getSKUInfo',
    'sf.b2c.mall.api.products.getSPUInfo': 'http://www.google.com/app/scripts/api/products/sf.b2c.mall.api.product.getSPUInfo',
    'sf.b2c.mall.api.products.updateSkuSellStock': 'http://www.google.com/app/scripts/api/products/sf.b2c.mall.api.product.updateSkuSellStock',
    'sf.b2c.mall.api.products.getAllParents': 'http://www.google.com/app/scripts/api/products/sf.b2c.mall.api.products.getAllParents',
    'sf.b2c.mall.api.products.getCategories': 'http://www.google.com/app/scripts/api/products/sf.b2c.mall.api.products.getCategories',
    'sf.b2c.mall.api.products.search': 'http://www.google.com/app/scripts/api/products/sf.b2c.mall.api.products.search',

    'sf.b2c.mall.api.user.appLogin': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.appLogin',
    'sf.b2c.mall.api.user.changePassword': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.changePassword',
    'sf.b2c.mall.api.user.checkUserExist': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.checkUserExist',
    'sf.b2c.mall.api.user.checkVerifyCode': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.checkVerifyCode',
    'sf.b2c.mall.api.user.createRecAddress': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.createRecAddress',
    'sf.b2c.mall.api.user.createReceiverInfo': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.createReceiverInfo',
    'sf.b2c.mall.api.user.delRecAddress': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.delRecAddress',
    'sf.b2c.mall.api.user.deviceRegister': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.deviceRegister',
    'sf.b2c.mall.api.user.getIDCardUrlList': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.getIDCardUrlList',
    'sf.b2c.mall.api.user.getInviteCodeList': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.getInviteCodeList',
    'sf.b2c.mall.api.user.getRecAddressList': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.getRecAddressList',
    'sf.b2c.mall.api.user.getUserInfo': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.getUserInfo',
    'sf.b2c.mall.api.user.logout': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.logout',
    'sf.b2c.mall.api.user.mailRegister': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.mailRegister',
    'sf.b2c.mall.api.user.renewToken': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.renewToken',
    'sf.b2c.mall.api.user.resetPassword': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.resetPassword',
    'sf.b2c.mall.api.user.sendActivateMail': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.sendActivateMail',
    'sf.b2c.mall.api.user.sendResetPwdLink': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.sendResetPwdLink',
    'sf.b2c.mall.api.user.setDefaultAddr': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.setDefaultAddr',
    'sf.b2c.mall.api.user.upateUserInfo': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.upateUserInfo',
    'sf.b2c.mall.api.user.updateRecAddress': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.updateRecAddress',
    'sf.b2c.mall.api.user.updateReceiverInfo': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.updateReceiverInfo',
    'sf.b2c.mall.api.user.userActivate': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.userActivate',
    'sf.b2c.mall.api.user.webLogin': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.webLogin',
    'sf.b2c.mall.api.user.federatedLogin': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.federatedLogin',
    'sf.b2c.mall.api.user.checkLink':'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.checkLink',
    'sf.b2c.mall.api.user.checkSmsCode': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.checkSmsCode',
    'sf.b2c.mall.api.user.downSmsCode':'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.downSmsCode',
    'sf.b2c.mall.api.user.downMobileVfCode':'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.downMobileVfCode',
    'sf.b2c.mall.api.user.mobileRegister':'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.mobileRegister',
    'sf.b2c.mall.api.user.needVfCode':'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.needVfCode',

    'sf.b2c.mall.api.b2cmall.getBanner': 'http://www.google.com/app/scripts/api/b2cmall/sf.b2c.mall.api.b2cmall.getBanner',
    'sf.b2c.mall.api.b2cmall.getFastSaleInfoList': 'http://www.google.com/app/scripts/api/b2cmall/sf.b2c.mall.api.b2cmall.getFastSaleInfoList',
    'sf.b2c.mall.api.b2cmall.getItemInfo': 'http://www.google.com/app/scripts/api/b2cmall/sf.b2c.mall.api.b2cmall.getItemInfo',
    'sf.b2c.mall.api.b2cmall.getProductHotData': 'http://www.google.com/app/scripts/api/b2cmall/sf.b2c.mall.api.b2cmall.getProductHotData',
    'sf.b2c.mall.api.b2cmall.getProductHotDataList': 'http://www.google.com/app/scripts/api/b2cmall/sf.b2c.mall.api.b2cmall.getProductHotDataList',
    'sf.b2c.mall.api.b2cmall.getRecommendProducts': 'http://www.google.com/app/scripts/api/b2cmall/sf.b2c.mall.api.b2cmall.getRecommendProducts',
    'sf.b2c.mall.api.b2cmall.getSkuInfo': 'http://www.google.com/app/scripts/api/b2cmall/sf.b2c.mall.api.b2cmall.getSkuInfo',
    'sf.b2c.mall.api.b2cmall.getTimeLimitedSaleInfoList': 'http://www.google.com/app/scripts/api/b2cmall/sf.b2c.mall.api.b2cmall.getTimeLimitedSaleInfoList',

    'sf.b2c.mall.business.config': 'http://www.google.com/app/scripts/config/sf.b2c.mall.business.<%= config.target %>.config',
    'sf.b2c.mall.api.security.type': 'http://www.google.com/app/scripts/framework/sf.b2c.mall.api.security.type',
    'sf.b2c.mall.framework.adapter': 'http://www.google.com/app/scripts/framework/sf.b2c.mall.framework.adapter',
    'sf.b2c.mall.framework.comm': 'http://www.google.com/app/scripts/framework/sf.b2c.mall.framework.comm',
    'sf.b2c.mall.framework.multiple.comm': 'http://www.google.com/app/scripts/framework/sf.b2c.mall.framework.multiple.comm',
    'sf.b2c.mall.framework.view.controller': 'http://www.google.com/app/scripts/framework/sf.b2c.mall.framework.view.controller',
    'sf.b2c.mall.util.utils': 'http://www.google.com/app/scripts/util/sf.b2c.mall.util.utils',
    // --------------------------------------------


    'sf.b2c.mall.component.header': 'scripts/component/sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer': 'scripts/component/sf.b2c.mall.component.footer',
    'sf.b2c.mall.component.login': 'scripts/component/sf.b2c.mall.component.login',
    'sf.b2c.mall.component.register': 'scripts/component/sf.b2c.mall.component.register',
    'sf.b2c.mall.component.limitedtimesale': 'scripts/component/sf.b2c.mall.component.limitedtimesale',
    'sf.b2c.mall.component.rapidseabuy': 'scripts/component/sf.b2c.mall.component.rapidseabuy',
    'sf.b2c.mall.center.register': 'scripts/center/sf.b2c.mall.center.register',

    'sf.b2c.mall.widget.slide': 'scripts/widget/sf.b2c.mall.widget.slide',
    'sf.b2c.mall.widget.modal': 'scripts/widget/sf.b2c.mall.widget.modal',
    'sf.b2c.mall.adapter.limitedtimesale': 'scripts/adapter/sf.b2c.mall.adapter.limitedtimesale',
    'sf.b2c.mall.adapter.rapidSeaBuy': 'scripts/adapter/sf.b2c.mall.adapter.rapidSeaBuy',

    'sf.b2c.mall.product.breadscrumb': 'scripts/product/sf.b2c.mall.product.breadscrumb',
    'sf.b2c.mall.product.detailcontent':'scripts/product/sf.b2c.mall.product.detailcontent',
    'sf.b2c.mall.adapter.detailcontent': 'scripts/adapter/sf.b2c.mall.adapter.detailcontent',

    'sf.b2c.mall.page.main': 'scripts/page/sf.b2c.mall.page.main',
    'sf.b2c.mall.page.preheat.register': 'scripts/page/sf.b2c.mall.page.preheat.register',

    'sf.b2c.mall.page.order': 'scripts/page/sf.b2c.mall.page.order',

    'sf.b2c.mall.page.login': 'scripts/page/sf.b2c.mall.page.login',
    'sf.b2c.mall.page.register': 'scripts/page/sf.b2c.mall.page.register'
  }
});