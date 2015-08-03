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
          }
        })
      }

    });

    new invitationFixture();
  })