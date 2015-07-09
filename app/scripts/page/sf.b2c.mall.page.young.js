/**
 * Created by 魏志强 on 2014/12/26.
 */
define(
  'sf.b2c.mall.page.young',
  [
    'can',
    'jquery',
     'sf.b2c.mall.api.user.getVoteNum',
     'sf.b2c.mall.api.user.vote',
    'sf.b2c.mall.framework.comm',
    'sf.util',
    'sf.b2c.mall.business.config'
  ],
  function(can, $, VoteNum, Vote, SFFrameworkComm, SFFn, SFBusiness) {

    SFFrameworkComm.register(1);
    SFFn.monitor();
    var young = can.Control.extend({

      /**
       * [init 初始化]
       */
      init: function() {

      }

    });

    new young('body');
  })
