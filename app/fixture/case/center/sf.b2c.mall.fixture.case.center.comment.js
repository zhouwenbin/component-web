'use strict';

define('sf.b2c.mall.fixture.case.center.comment', ['can',
    'fixture',
    'sf.b2c.mall.fixture.framework.common'
  ],
  function(can, fixture, fixtureFramework) {

    var invitationFixture = can.Construct.extend({

      init: function() {
        fixtureFramework.registerSuccessFixtureMethod({
          "publishComment": function(requestData) {
            return {
              "value": true
            };
          },

          "findCommentLabels": function(requestData) {
            return {
              "skuId": 1,
              "itemId": 1,
              "satisfaction": 100,
              "CommentGoodsLabels": [{
                "id": 1,
                "name": "送人不错的",
                "count": 2
              }, {
                "id": 2,
                "name": "功能挺多",
                "count": 3
              }]
            }
          },

          "findCommentInfoList": function(requestData) {
            debugger;
            if (requestData.type == 2) {
              return {
                "commentGoods": [{
                  "commentGoodsInfo": {
                    "commentId": 1,
                    "pId": 0,
                    "orderId": 100,
                    "skuId": 1,
                    "itemId": 1,
                    "score": 100,
                    "content": "abc2",
                    "extralContent": "efg2",
                    "imgs": ["http://img0.sfht.com/sf/bundefined/5415d8c2b1dc83eecb37a75a92bb778a.jpg@63h_63w.jpg"],
                    "isAnonym": false,
                    "terminalType": 1,
                    "skuLabels": [{
                      "id": 1,
                      "name": "送人不错的2",
                      "count": 2
                    }, {
                      "id": 2,
                      "name": "功能挺多2",
                      "count": 3
                    }],
                    "commentGoodsLabels": [{
                      "id": 1,
                      "name": "送人不错的2",
                      "count": 2
                    }, {
                      "id": 2,
                      "name": "功能挺多2",
                      "count": 3
                    }],
                    "userId": "123",
                    "userNick": "海淘用户2",
                    "itemPro": "规格：红色2",
                    "gmtCreate": "12334343",
                    "gmtExtral": "12343434"
                  },
                  "children": [{
                    "commentGoodsInfo": {
                      "commentId": 1,
                      "pId": 0,
                      "orderId": 100,
                      "skuId": 1,
                      "itemId": 1,
                      "content": "abc",
                      "terminalType": 1,
                      "userNick": "海淘用户",
                      "gmtCreate": "12334343",
                      "gmtExtral": "12343434"
                    },
                    "children": {}
                  }]
                }],
                "page": {
                  "pageNum": 10,
                  "currentNum": 10,
                  "totalNum": 100,
                  "pageSize": 0
                },
                "keyValuePaires": {
                  "0": 100,
                  "1": 100,
                  "2": 100,
                  "3": 100,
                  "4": 100,
                  "5": 200
                }
              }
            }
            return {
              "commentGoods": [{
                "commentGoodsInfo": {
                  "commentId": 1,
                  "pId": 0,
                  "orderId": 100,
                  "skuId": 1,
                  "itemId": 1,
                  "score": 100,
                  "content": "abc",
                  "extralContent": "efg",
                  "imgs": ["http://img0.sfht.com/sf/bundefined/5415d8c2b1dc83eecb37a75a92bb778a.jpg@63h_63w.jpg"],
                  "isAnonym": false,
                  "terminalType": 1,
                  "skuLabels": [{
                    "id": 1,
                    "name": "送人不错的",
                    "count": 2
                  }, {
                    "id": 2,
                    "name": "功能挺多",
                    "count": 3
                  }],
                  "commentGoodsLabels": [{
                    "id": 1,
                    "name": "送人不错的",
                    "count": 2
                  }, {
                    "id": 2,
                    "name": "功能挺多",
                    "count": 3
                  }],
                  "userId": "123",
                  "userNick": "海淘用户",
                  "itemPro": "规格：红色",
                  "gmtCreate": "12334343",
                  "gmtExtral": "12343434"
                },
                "children": [{
                  "commentGoodsInfo": {
                    "commentId": 1,
                    "pId": 0,
                    "orderId": 100,
                    "skuId": 1,
                    "itemId": 1,
                    "content": "abc",
                    "terminalType": 1,
                    "userNick": "海淘用户",
                    "gmtCreate": "12334343",
                    "gmtExtral": "12343434"
                  },
                  "children": {}
                }]
              }],
              "page": {
                "pageNum": 10,
                "currentNum": 0,
                "totalNum": 100,
                "pageSize": 0
              },
              "keyValuePaires": {
                "0": 100,
                "1": 100,
                "2": 100,
                "3": 100,
                "4": 100,
                "5": 200
              }
            }
          },

          "publishCompreComment": function(requestData) {
            return {
              "value": true
            }
          },

          "getComments": function(requestData) {
            return {
              "value": [{
                "commentGoodsInfo": {
                  "commentId": 1,
                  "orderId": 1,
                  "itemId": 1,
                  "score": 4,
                  "content": "这个小伙不错",
                  "isAnonym": false,
                  "imgs": ["http://img0.sfht.com/sf/bundefined/5415d8c2b1dc83eecb37a75a92bb778a.jpg@63h_63w.jpg"]
                },
                "children": {
                  "commentId": 1,
                  "orderId": 1,
                  "itemId": 1,
                  "score": 4,
                  "content": "这个小伙不错2",
                  "isAnonym": false,
                  "imgs": ["http://img0.sfht.com/sf/bundefined/5415d8c2b1dc83eecb37a75a92bb778a.jpg@63h_63w.jpg"]
                }
              }]
            }
          },

          "findCommentInfoListByType": function(requestData) {
            return {
              "commentGoods":[{
                "commentGoodsInfo": [{
                  "commentId":1,
                  "pId":1,
                  "orderId":1,
                  "skuId":1,
                  "itemId":1,
                  "score":500,
                  "content":"小章鱼祝您购物愉快哦~~本月27号顺丰海淘有大促活动哦~希望您能继续支持，见证顺丰海淘的成长！",
                  "extralContent":"追评",
                  "imgs": ["http://img0.sfht.com/sf/bundefined/5415d8c2b1dc83eecb37a75a92bb778a.jpg@63h_63w.jpg"],
                  "isAnonym":true,
                  "terminalType":"pc",
                  "commentStatus":0,
                  "commentStatus2":0,
                  "skuLabels":[{
                    "id":1,
                    "name":"好用",
                    "count":10
                  }],
                  "commentGoodsLabels":[{
                    "id":1,
                    "name":"好用",
                    "count":10
                  }],
                  "userId":1,
                  "userHeadImageUrl":"http://img0.sfht.com/sf/bundefined/5415d8c2b1dc83eecb37a75a92bb778a.jpg@63h_63w.jpg",
                  "userNick":"昵称",
                  "itemPro":"",
                  "gmtCreate":"2015-07-26",
                  "gmtExtral":"2015-07-26"
                }],
                "children":[{
                  "commentGoodsInfo": [{
                    "commentId":1,
                    "pId":1,
                    "orderId":1,
                    "skuId":1,
                    "itemId":1,
                    "score":500,
                    "content":"小章鱼祝您购物愉快哦~~本月27号顺丰海淘有大促活动哦~希望您能继续支持，见证顺丰海淘的成长！",
                    "extralContent":"追评",
                    "imgs": ["http://img0.sfht.com/sf/bundefined/5415d8c2b1dc83eecb37a75a92bb778a.jpg@63h_63w.jpg"],
                    "isAnonym":true,
                    "terminalType":"pc",
                    "commentStatus":0,
                    "commentStatus2":0,
                    "skuLabels":[{
                      "id":1,
                      "name":"好用",
                      "count":10
                    }],
                    "commentGoodsLabels":[{
                      "id":1,
                      "name":"好用",
                      "count":10
                    }],
                    "userId":1,
                    "userHeadImageUrl":"http://img0.sfht.com/sf/bundefined/5415d8c2b1dc83eecb37a75a92bb778a.jpg@63h_63w.jpg",
                    "userNick":"昵称",
                    "itemPro":"",
                    "gmtCreate":"2015-07-26",
                    "gmtExtral":"2015-07-26"
                  }]
                }]           

              }]
            }
          }

        })
      }

    });

    new invitationFixture();
  })