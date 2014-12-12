'use strict';

var center = sf.util.namespace('b2c.mall.center');

center.binding = can.Control.extend({

  /**
   * @param  {DOM} element 容器element
   * @param  {Object} options 传递的参数
   */
  init: function (element, options) {

    this.data = {};
    this.render(this.data);
    this.supplement(this.data);
  },

  render: function (data) {
    var html = can.view('templates/center/sf.b2c.mall.center.binding.mustache')(data);
    this.element.html(html);
  },

  defaults: {
    data: {
      process: [
        { name: '验证身份', num: 1, tag: 'confirm' },
        { name: '修改邮箱', num: 2, tag: 'reset' },
        { name: '完成', num: 3, tag: 'finish' }
      ],
      active: null,
      classname: 'order-d fl clearfix'
    },
    style: {
      last: 'margin-right:0px',
      common: 'margin-right:28px'
    }
  },

  supplement: function (data) {
    var process = data.process;

    if (process) {
      var map = {
        1: 'templates/center/sf.b2c.mall.center.binding.confirm.mustache',
        2: 'templates/center/sf.b2c.mall.center.binding.reset.mustache',
        3: 'templates/center/sf.b2c.mall.center.binding.finish.mustache'
      };

      var templateUrl = map[process];
      if (!templateUrl) {
        templateUrl = map[1];
      }

      var html = can.view(templateUrl)({});
      this.element.html(html);

      this.defaults.data.active = process;
      new sf.b2c.mall.widget.board('.sf-b2c-mall-center-board', this.defaults);
    }
  },

  '{can.route} change': function (ev, attr, how, newVal, oldVal) {
    var tag = can.route.attr('type');
    var process = can.route.attr('process');

    if (tag === 'binding' && process) {
      this.supplement({process: process});
    }
  }
});