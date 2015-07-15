'use strict';

define('sf.b2c.mall.fixture.framework.common', ['can',
    'fixture'
  ],
  function(can, fixture) {

    can.fixture.on = true;

    var SFBaseComm = can.Construct.extend({

      init: function() {

        this.successMethod = {};

        this.fixtureAPI();
      },

      fixtureAPI: function() {
        var that = this;

        fixture('POST /m.api', function(request, response) {

          var _mt = request.data._mt;

          var module = _mt.split(".")[0];
          var action = _mt.split(".")[1];

          var result = {};

          if (that.successMethod[action]) {
            result = that.successMethod[action].apply(that, [response, request.data]);
          }

          response(
            200,
            "success", {
              "stat": {
                "cid": "a:a16d6a|t:367|s:1436868414345",
                "code": 0,
                "notificationList": [],
                "stateList": [{
                  "code": 0,
                  "length": 32,
                  "msg": "成功"
                }],
                "systime": 1436868414358
              },
              "content": [result]
            })
        });
      },

      registerSuccessFixtureMethod: function(callback) {
        var that = this;
        _.map(callback, function(value, key) {
          that.successMethod[key] = value;
        })
      }

    });

    return new SFBaseComm();
  })