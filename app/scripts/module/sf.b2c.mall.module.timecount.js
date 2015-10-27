'use strict';

define(
'sf.b2c.mall.module.timecount', [
  'can',
  'jquery',
  'underscore'
],
function(can, $, _) {
  var deadTime = can.Control.extend({
      init: function(element, options) {
        var timecountsrc = element.find(".cms-src-timecount");
        if(timecountsrc != 'undefined' && timecountsrc.length > 0){
          var deadTimeLine = timecountsrc.attr("data-timecount");
          var dayElement = timecountsrc.find(".cms-fill-day");
          var hourElement = timecountsrc.find(".cms-fill-hour");
          var minElement = timecountsrc.find(".cms-fill-minute");
          var secondElement = timecountsrc.find(".cms-fill-second");
          this.refeshTime(deadTimeLine, dayElement, hourElement, minElement, secondElement);
        }
      },
      refeshTime: function(deadTimeLine, dayElement, hourElement, minElement, secondElement) {
        setInterval(function() {
          var left = deadTimeLine - new Date();
          if (left > 0) {
            var day = left / (24 * 60 * 60 * 1000);
            var hour = left % (24 * 60 * 60 * 1000) / (60 * 60 * 1000);
            var min = left % (60 * 60 * 1000) / (60 * 1000);
            var second = left % (60 * 1000) / 1000;
            dayElement.text(parseInt(day));
            hourElement.text(parseInt(hour) > 9 ? parseInt(hour) : ("0" + parseInt(hour)));
            minElement.text(parseInt(min) > 9 ? parseInt(min) : ("0" + parseInt(min)));
            secondElement.text(parseInt(second) > 9 ? parseInt(second) : ("0" + parseInt(second)))
          } else {
            dayElement.text(parseInt(0));
          }
        }, 1000);
      },
  });
  var timeCountModules = $(".cms-module-filltimecount");
  _.each(timeCountModules,function(timeCountModule){
      new deadTime($(timeCountModule));
  });
})