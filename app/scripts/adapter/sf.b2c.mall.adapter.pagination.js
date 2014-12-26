'use strict';

define('sf.b2c.mall.adapter.pagination', ['can'], function(can) {
  return can.Map({

    // @todo 计算sarr和larr
    calc: function(options) {
      var sarr = [];
      var larr = [];
      var requireMore = false;

      var current = options.pageNum;
      var all = Math.ceil(options.totalNum / options.pageSize);

      if (all < 7) {
        for (var i = all; i > 0; i--) {
          sarr.push(i);
        }
        sarr.reverse();
        larr = null;
        requireMore = false;
      } else if (current < 3 || current > all - 2) {
        sarr = [1, 2, 3];
        larr = [all - 2, all - 1, all];
        requireMore = true;
      } else if (current < all / 2) {
        sarr = [current - 1, current, current + 1];
        larr = [all - 2, all - 1, all];
        requireMore = true;
      } else {
        sarr = [1, 2, 3];
        larr = [current - 1, current, current + 1];
        requireMore = true;
      }

      // @todo 后续的业务逻辑需要补充，情况比较复杂


      /**
       * 数据结构
       *
       * - sarr [array]小数编码
       * - larr [array]大数编码
       * - requireMore 是否需要省略号
       * - current 当前页码
       */
      return {
        all: all,
        sarr: sarr,
        larr: larr,
        requireMore: requireMore,
        current: options.pageNum
      };
    },

    format: function(params) {
      var data = this.calc(params);

      this.attr('all', data.all);
      this.attr('sarr', data.sarr);
      this.attr('larr', data.larr);
      this.attr('requireMore', data.requireMore);
      this.attr('current', data.current);
    }

  })
})