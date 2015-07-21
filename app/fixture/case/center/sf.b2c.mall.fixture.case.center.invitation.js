'use strict';

define('sf.b2c.mall.fixture.case.center.invitation', ['can',
    'fixture',
    'sf.b2c.mall.fixture.framework.common'
  ],
  function(can, fixture, fixtureFramework) {

    var invitationFixture = can.Construct.extend({

      init: function() {
        fixtureFramework.registerSuccessFixtureMethod({
          "getCashActTransList": function(requestData) {
            return {
              "infos": [{
                "income": 10000,
                "reason": "abc",
                "gmtOrder": "2015-05-15 14:43:42",
                "gmtCreate": "2015-05-15 14:43:42"
              }, {
                "income": -2000,
                "reason": "abc",
                "gmtOrder": "2015-05-16 14:43:42",
                "gmtCreate": "2015-05-16 14:43:42"
              }]
            };
          },

          "getCashActInfo": function(requestData) {
            return {
              "actBalance": 0,
              "lastestIncome": 0,
              "totalIncome": 0,
              "userId": 643084
            };
          }
        })
      }

    });

    new invitationFixture();
  })