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
                "children": {}
              }]
            }
          }
        })
      }

    });

    new invitationFixture();
  })