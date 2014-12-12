'use strict';

var launcher = sf.util.namespace('b2c.mall.launcher');

launcher.shopconfirm = function () {

  // 初始化header
  new sf.b2c.mall.header('.sf-b2c-mall-header');

  // 初始化footer
  new sf.b2c.mall.footer('.sf-b2c-mall-footer');

  // 初始化nav
  new sf.b2c.mall.component.nav.search('.sf-b2c-mall-nav');

  var BookingList = new can.Map({
    list: [
      {
        countryImgUrl: 'images/ico10.png',
        country: '美国',
        products: [
          {
            name: 'Minnetonka 迷你唐卡 2013新款半豹纹 豆豆单鞋',
            imgUrl: 'images/img19.jpg',
            attrs: [
              { name: '颜色', value: '蓝色' },
              { name: '尺码', value: '美国6/中国37'}
            ],
            country: '美国',
            price: 38,
            postage: 30,
            countryImgUrl: 'images/ico10.png'
          }
        ]
      },
      {
        countryImgUrl: 'images/ico10.png',
        country: '美国',
        products: [
          {
            name: 'Minnetonka 迷你唐卡 2013新款半豹纹 豆豆单鞋',
            imgUrl: 'images/img19.jpg',
            attrs: [
              { name: '颜色', value: '蓝色' },
              { name: '尺码', value: '美国6/中国37'}
            ],
            country: '美国',
            price: 38,
            postage: 30,
            countryImgUrl: 'images/ico10.png'
          }
        ]
      },
      {
        countryImgUrl: 'images/ico10.png',
        country: '美国',
        products: [
          {
            name: 'Minnetonka 迷你唐卡 2013新款半豹纹 豆豆单鞋',
            imgUrl: 'images/img19.jpg',
            attrs: [
              { name: '颜色', value: '蓝色' },
              { name: '尺码', value: '美国6/中国37'}
            ],
            country: '美国',
            price: 38,
            postage: 30,
            countryImgUrl: 'images/ico10.png'
          }
        ]
      }
    ],
    price: 789.20,
    postage: 29.30,
    sum: 1992.90,
    point: 300,
    pointPrice: can.compute(0),
    finalPrice: 1890,
    givenPrice: 90
  });

  var Board = new can.Map({
    process: [
      { name: '我的购物车', num: 1, tag: 'mycar' },
      { name: '填写并核对订单信息', num: 2, tag: 'confirm' },
      { name: '成功提交订单', num: 3, tag: 'submit' }
    ],
    active: 2,
    classname: 'order-d fl clearfix'
  });

  var BoardStyle = new can.Map({
    last: 'margin-right:0px',
    common: ''
  });

  new sf.b2c.mall.common('#sf-b2c-mall-shop-confirm', {
    tag: '#sf-b2c-mall-shop-confirm',
    data: BookingList,
    callback: function () {
      new sf.b2c.mall.widget.board('.sf-b2c-mall-shop-car-board', { data: Board, style: BoardStyle });

      var data = {
        countryImgUrl: 'images/ico10.png',
        country: '美国',
        products: [
          {
            name: 'Minnetonka 迷你唐卡 2013新款半豹纹 豆豆单鞋',
            imgUrl: 'images/img19.jpg',
            attrs: [
              { name: '颜色', value: '蓝色' },
              { name: '尺码', value: '美国6/中国37'}
            ],
            country: '美国',
            price: 38,
            postage: 30,
            countryImgUrl: 'images/ico10.png'
          }
        ]
      };
      new sf.b2c.mall.booking.list('.sf-b2c-mall-booking-list', {data: data});
    }
  });
};

launcher.shopconfirm();