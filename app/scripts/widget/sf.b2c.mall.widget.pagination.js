'use strict';

define('sf.b2c.mall.widget.pagination', ['can'], function(can) {
  return can.Control.extend({

    /**
     * @param  {DOM} element 容器element
     * @param  {Object} options 传递的参数
     */
    init: function(element, options) {
      this.paint();
    },

    paint: function() {
      this.render(this.options.page);
    },

    helpers: {
      equal: function(index, current) {
        if (index() === current) {
          return 'active';
        }
      },

      nextequal: function(current, all) {
        if (current() === all()) {
          return 'disable';
        }
      },

      preequal: function(current) {
        if (current() < 2) {
          return 'disable';
        }
      }
    },

    jump: function(page) {
      if (page > 0 && page < this.options.page.all + 1) {
        if (_.isFunction(this.callback)) {
          this.callback({
            page: page
          });
        }

        can.route.attr({
          page: page
        });
      }
    },

    '.pagination-set-page click': function(element, event) {
      event && event.preventDefault();

      if (document.documentElement && document.documentElement.scrollTop) {
        document.documentElement.scrollTop = 0;
      } else if (document.body) {
        document.body.scrollTop = 0;
      }

      var page = can.$(element).attr('data-target');
      this.jump(page);
    },

    '.pagination-prev click': function(element, event) {
      event && event.preventDefault();
      if (document.documentElement && document.documentElement.scrollTop) {
        document.documentElement.scrollTop = 0;
      } else if (document.body) {
        document.body.scrollTop = 0;
      }

      var routeParams = can.route.attr();
      var page = parseInt(routeParams.page, 10) - 1;
      this.jump(page);
    },

    '.pagination-next click': function(element, event) {
      event && event.preventDefault();
      if (document.documentElement && document.documentElement.scrollTop) {
        document.documentElement.scrollTop = 0;
      } else if (document.body) {
        document.body.scrollTop = 0;
      }

      var routeParams = can.route.attr();
      var page = parseInt(routeParams.page, 10) + 1;
      this.jump(page);
    },

    render: function(data) {
      var html = can.view('templates/widget/sf.b2c.mall.pagination.mustache', data, this.helpers);
      this.element.html(html);
    }

  })
})