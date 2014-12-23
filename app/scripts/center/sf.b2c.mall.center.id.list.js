'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.center.id.list');

/**
 * @class sf.b2c.mall.center.id.list
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 显示用户列表信息
 */
sf.b2c.mall.center.id.list = can.Control.extend({

  helpers: {
    'sf-id-status': function (status) {
      var map = {
        '0': '未上传身份证',
        '1': '已上传身份证',
        '2': '身份证审核通过',
        '3': '身份证审核未通过'
      };

      return map[status()];
    },

    'sf-allow': function (status, options) {
      if (status() == 2) {
        return options.inverse(options.scope || this);
      }else{
        return options.fn(options.scope || this);
      }
    }
  },

  init: function (element, options) {
    this.adapter = {};
    this.paint();
  },

  paint: function () {
    var that = this;
    can.when(sf.b2c.mall.model.user.getIDCardUrlList())
      .done(function (response) {
        if (sf.util.access(response, true)) {
          that.adapter.ids = new sf.b2c.mall.adapter.ids({idList: response.content[0].items});

          if (that.options.recId) {
            that.adapter.input = new can.Map({recId: that.options.recId});
          }else{
            if (that.adapter.ids.idList) {
              var id = that.adapter.ids.idList.attr(0);
              that.adapter.input = new can.Map({recId: id.recId});
            }
          }

          that.render(that.adapter);
          if (_.isFunction(that.options.onRender)) {
            that.options.onRender(response.content[0])
          }
        }
      })
      .fail(function (data) {

      });
  },

  getSelectedIdcard: function () {
    if (this.adapter && this.adapter.input) {
      var recId = this.adapter.input.attr('recId');
      return this.adapter.ids.getById(window.parseInt(recId));
    }
  },

  render: function (data) {
    var html = can.view('templates/center/sf.b2c.mall.center.id.list.mustache', data, this.helpers);
    this.element.html(html);
  },

  '#center-add-user-btn click': function (element, event) {
    event && event.preventDefault();
    if (_.isFunction(this.options.switchView)) {
      this.options.switchView('editor');
    }
  },

  '.name-x click': function (element, event) {
    event && event.preventDefault();
    var index = element.data('index');
    var user = this.adapter.ids.get(index);
    if (user) {
      this.options.switchView('editor', user);
    }
  }

});