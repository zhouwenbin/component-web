'use strict';

// @description 申明命名空间
sf.util.namespace('b2c.mall.center.register.board');

can.route.ready();

sf.b2c.mall.center.register.board = can.Control.extend({

  /**
   * 初始化slide控件
   * @param  {DOM} element 容器element
   * @param  {Object} options 传递的参数
   */
  init: function(element, options) {
    this.data = this.defaults;
    this.render(this.data);

    this.user = {};

    var tag = can.route.attr('tag');
    if (tag) {
      this.data.active(tag);
    }

    var action = this.supplementMap[this.data.active()];
    if (_.isFunction(action)) {
      action.call(this, this.data);
    }
  },

  defaults: {
    active: can.compute('fillinfo'),
    process: [{
      tag: 'fillinfo',
      num: 1,
      name: '填写账户信息'
    }, {
      tag: 'confirminfo',
      num: 2,
      name: '验证账户信息'
    }, {
      tag: 'success',
      num: 3,
      name: '注册成功'
    }],
    classname: 'order-d fl clearfix',
    style: {
      common: 'margin-right:28px',
      last: 'margin-right:0px'
    }
  },

  render: function(data) {

    var html = can.view('templates/center/sf.b2c.mall.center.register.board.mustache', {});
    this.element.html(html);

    new sf.b2c.mall.widget.board('.sf-b2c-mall-widget-board', {
      data: data
    });
  },

  supplement: function(tag, data) {
    var oldTag = this.data.active();
    if (tag !== oldTag) {
      this.data.active(tag);
      var action = this.supplementMap[tag];
      if (_.isFunction(action)) {
        action.call(this, data);
      }
    }
  },

  supplementMap: {
    'fillinfo': function(params) {
      this.user.fillinfo = new sf.b2c.mall.center.register.fillinfo('.sf-b2c-mall-register-container');
    },

    'confirminfo': function(params) {
      if (this.user.fillinfo && this.user.fillinfo.getEmail()) {
        var email = this.user.fillinfo.getEmail();
        if (email) {
          new sf.b2c.mall.center.register.confirminfo('.sf-b2c-mall-register-container', {data: {email: email}});
        }
      }else{
        var params = can.deparam(window.location.search.substr(1));
        if (params.mailId) {
          new sf.b2c.mall.center.register.confirminfo('.sf-b2c-mall-register-container', {data: {email: params.mailId}, verify: true});
        }else{
          can.route.attr('tag', 'fillinfo');
        }
      }
    },

    'success': function(params) {
      new sf.b2c.mall.center.register.success('.sf-b2c-mall-register-container');
    }
  },

  '{can.route} change': function() {
    var tag = can.route.attr('tag');
    this.supplement.call(this, tag);
  }
});