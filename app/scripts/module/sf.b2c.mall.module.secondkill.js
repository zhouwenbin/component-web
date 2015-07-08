'use strict';

define(
  'sf.b2c.mall.module.secondkill', [
    'can',
    'jquery',
    'moment',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.framework.comm'
  ],
  function(can, $, moment, SFConfig, SFFrameworkComm) {

    SFFrameworkComm.register(1);

    var deadTime = can.Control.extend({

      init: function(element, options) {
        var currentTime = new Date();
        var format = 'YYYYMMDDHHmmss';

        var formatTime = moment(currentTime).format(format);
        var day = formatTime.substring(0,8);

        var dayList = $(".cms-src-dayline");
        _.each(dayList, function(item){
          if ($(item).attr('data-dayline') === (day + '000000')){

          }
        })
      }
    });

    deadTime();
  })