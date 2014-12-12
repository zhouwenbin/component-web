'use strict';

var filter = sf.util.namespace('b2c.mall.product.filter');

/**
 * @description 筛选
 *
 * @bug 多选功能，需要参考淘宝
 */
filter.panel = can.Control.extend({

  init: function (element, options) {
    this.paint(options.data);
  },

  paint: function (data) {
    // this.data = this.parse(data);
    // this.data.attrs = can.compute(this.data.attrs);
    this.data = data;
    this.render({filters: this.data});
  },

  change: function (data) {
    var viewmodel = this.parse(data);
    this.data.attrs(viewmodel.attrs);
  },

  helpers: {
    equal: function (source, target, options) {
      if (source == target) {
        return options.fn(options.scope || this);
      }else{
        return options.inverse(options.scope || this);
      }
    },
    over: function (list, options) {
      if (list.length > 12) {
        return options.fn(options.scope || this);
      }else{
        return options.inverse(options.scope || this);
      }
    }
  },

  render: function (data) {
    var html = can.view('templates/product/sf.b2c.mall.product.filter.panel.mustache', data, this.helpers);
    this.element.html(html);
  },

  parse: function (data) {
    _.each(data.value, function(attr){
      if (attr.values && attr.values.length > 0 && attr.values[0].imgUrl) {
        attr.type = 'media';
      }else{
        attr.type = 'plain';
      }
    });

    return {
      attrs: data.value
    };
  },

  '.filter-panel-attrs li a click': function (element, event) {
    event && event.preventDefault();

    var attr = element.closest('.filter-panel-attrs').attr('data-attr');
    var value = element.attr('data-name');

    var param = {};
    param[attr] = value;

    can.route.attr(param);
  },

  '.filter-panel-more click': function (element, event) {
    event && event.preventDefault();

    var status = element.attr('data-status');

    var node = element.closest('.nav-Country.clearfix');
    if (status === 'open') {
      node.find('.nav-Country-left2.fl').removeAttr('style');
      node.find('.nav-Country-right2.fr.clearfix').removeAttr('style');

      element.find('.filter-panel-text-more').text('更多');
      element.attr('data-status', 'close');

    }else{
      node.find('.nav-Country-left2.fl').css({'height': '260px'});
      node.find('.nav-Country-right2.fr.clearfix').css({'height': '260px', 'overflow':'auto'});

      element.find('.filter-panel-text-more').text('收起');
      element.attr('data-status', 'open');
    }
  }
});