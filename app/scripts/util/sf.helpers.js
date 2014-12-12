'use strict';

var Toggle = can.Control({
  init: function (options) {
    if (this.options.value()) {
      this.element.show();
    }else{
      this.element.hide();
    }
  },

  '{value} change': function (value, el, newVal) {
    if (newVal) {
      this.element.show();
    }else{
      this.element.hide();
    }
  }
});

can.Mustache.registerHelper('sf.toggle', function (value) {
  return function (el) {
    new Toggle(el, { value: value });
  };
});

var Untoggle = can.Control({
  init: function (options) {
    if (!this.options.value()) {
      this.element.show();
    }else{
      this.element.hide();
    }
  },

  '{value} change': function (value, el, newVal) {
    if (!newVal) {
      this.element.show();
    }else{
      this.element.hide();
    }
  }
});

can.Mustache.registerHelper('sf.time', function (time) {
  if (_.isFunction(time)) {
    time = time();
  }

  return moment(time).format('YYYY-MM-DD HH:mm:ss');
});

/**
 * @description sf.price
 * @param  {int} price Price
 */
can.Mustache.registerHelper('sf.price', function (price) {

  var getValue = function (v) {
    if (_.isFunction(v)) {
      price = v();
    }
  };

  while(_.isFunction(price)){
    getValue(price);
  }

  // return (price/100).toFixed(2).toString();
  return (price/100)
});

can.Mustache.registerHelper('sf.untoggle', function (value) {
  return function (el) {
    new Untoggle(el, { value: value });
  };
});

can.Mustache.registerHelper('sf.nation.img', function (id) {
  var map = {
    '1': 'images/china.jpg',
    '2': 'images/america.jpg',
    '3': 'images/japan.jpg',
    '4': 'images/australia.jpg',
    '5': 'images/newz.jpg',
    '6': 'images/hk.jpg',
    '7': 'images/holland.jpg',
    '8': 'images/german.jpg',
    '9': 'images/britain.jpg',
    '10': 'images/europe.jpg'
  }

  if(_.isFunction(id)){
    id = id()
  }

  return map[id];
});

can.Mustache.registerHelper('sf.nation.name', function (id) {
  var map = {
    '1': '中国',
    '2': '美国',
    '3': '日本',
    '4': '澳大利亚',
    '5': '新西兰',
    '6': '中国香港',
    '7': '荷兰',
    '8': '德国',
    '9': '英国',
    '10': '欧洲'
  }

  if(_.isFunction(id)){
    id = id()
  }

  return map[id];
});

can.Mustache.registerHelper('sf.pay.status', function (status) {
  if (_.isFunction(status)) {
    status = status();
  }

  var map = {
    'undefined': '未知',
    'NULL': '未知',
    'SUBMITED': '待付款',
    'AUTO_CANCEL': '已取消',
    'USER_CANCEL': '已取消',
    'AUDITING': '已付款',
    'OPERATION_CANCEL': '已取消',
    'BUYING': '已付款',
    'LOGISTICS_EXCEPTION': '已付款',
    'WAIT_SHIPPING': '已付款',
    'BUYING_EXCEPTION':'已付款',
    'SHIPPING': '已付款',
    'SHIPPED': '已发货',
    'COMPLETED': '交易完成'
  };

  return map[status];
});

can.Mustache.registerHelper('sf.img', function (img, options) {
  if (_.isFunction(img)) {
    img = img();
  }

  var arr = [];
  if (_.isString(img)) {
    arr = img.split(',');
  }else if (_.isArray(img)) {
    arr = img;
  }

  return 'http://img0.sfht.com/spu/'+arr[0];
});

can.Mustache.registerHelper('sf.contain.img', function (img, options) {
  var image = img();
  if (_.isEmpty(image)) {
    return options.inverse(options.scope || this);
  }else{
    return options.fn(options.scope || this);
  }
});
