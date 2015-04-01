define(
  'sf.b2c.mall.module.lazyload', [
    'can',
    'underscore',
    'imglazyload',
    'sf.b2c.mall.framework.comm'
  ],

  function(can, _, SFImglazyload, SFFrameworkComm) {

    SFFrameworkComm.register(1);

    var lazyloadObj = can.Control.extend({

      init: function(element, options) {
        $(".img-lazyload").imglazyload();
      }
    })

    new lazyloadObj();
  });