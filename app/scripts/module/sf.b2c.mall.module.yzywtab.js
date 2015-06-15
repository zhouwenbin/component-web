define(
  'sf.b2c.mall.module.yzywtab', [
    'jquery',
    'can',
    'underscore',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.module.price'
  ],

  function($, can, _, SFFrameworkComm, SFPrice) {

    SFFrameworkComm.register(1);

    var tab = can.Control.extend({

      init: function(element, options) {
        $(".cms-src-tabbtn").on("click", "li", function() {
          var targetElement = $(this);
          if (targetElement.hasClass("active")) {
            return;
          }
          var parent = targetElement.parents(".cms-module-filltab");
          parent.find(".cms-src-tabbtn .active").removeClass("active");
          targetElement.addClass("active");
          var parentTabBtn = targetElement.parents(".cms-src-tabbtn");
          var index = parentTabBtn.find(targetElement).index();

          parent.find(".cms-src-tabcontent").hide();
          parent.find(".cms-src-tabcontent").eq(index).show();
        })
      }
    });

    new tab();
  });
