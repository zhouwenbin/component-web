'use strict';

define('sf.b2c.mall.fixture.case.center.invitation', ['can',
    'fixture',
    'sf.b2c.mall.fixture.framework.common'
  ],
  function(can, fixture, fixtureFramework) {

    var invitationFixture = can.Construct.extend({

      init: function() {
        fixtureFramework.registerSuccessFixtureMethod({
          "getCashActTransList": function(response, data) {
            return {
              "totalCount": 0,
              "userId": 643084
            };
          }
        })
      }

    });

    new invitationFixture();
  })