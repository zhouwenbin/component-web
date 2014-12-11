'use strict';

/**
 * [description]
 * @param  {[type]} $
 * @param  {[type]} can
 * @param  {[type]} _
 * @param  {[type]} utils
 * @param  {[type]} SFBizConfig
 * @return {[type]}
 */
define('sf.b2c.mall.util.testUtils', [
    'jquery',
    'can',
    'underscore',
    'sf.b2c.mall.util.utils',
    'sf.b2c.mall.business.config',
  ],
  function($, can, _, utils, SFBizConfig) {

    return {

      /**
       * [testData 测试数据。]
       * @type {Object}
       */
      testData: {
        address: {
          "addrId": 495,
          "cityName": "北京市",
          "defaultAddr": 0,
          "detail": "test",
          "mobile": "15295755750",
          "nationName": "中国 ",
          "provinceName": "北京",
          "recId": 462,
          "recName": "季严亮",
          "regionName": "东城区",
          "zipCode": "222222",
          "credtNum": "320724198401063011",
          "status": 0,
          "type": "ID"
        },
        skuInfo: {
          "sku": "68",
          "num": "1",
          "price": 24812
        },
        skuInfo2: {
          "sku": "69"
        },
        spuInfo: {
          "spu": "20"
        },
        cid: 1,
        searchKeyWord: '洗发',
        user4Login: {
          accountId: 'jiyanliang@sf-express.com',
          type: 'MAIL',
          password: utils.md5('123456')
        },
        newPassword: utils.md5('1234567'),
        notExistAccountId: 'jiyanliang123456@sf-express.com',
        resetPassword: {
          'tm': '1418132175711',
          'sign': 'd1417bfcce54ea98d93099a19b7ebdef'
        }
      }
    }

  });