'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.center.address.list');

/**
 * @class sf.b2c.mall.center.address
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 用户中心 -- 用户收货地址模块
 */
sf.b2c.mall.center.address.list = can.Control.extend({

  /**
   * @description 默认参数设置
   * @type {Map}
   */
  defaults: {

  },

  /**
   * @description 自定义mustache helpers
   * @type {Map}
   */
  helpers: {
    'sf-user-img': function(img) {
      if (img() == 'images/img03.png' || img() == 'images/img04.png') {
        return img();
      } else {
        return sf.b2c.mall.model.user.getUserPhotoUrl({
          n: img()
        })
      }
    }
  },

  /**
   * @description 初始化方法，当调用new时会执行init方法
   * @param  {Dom} element 当前dom元素
   * @param  {Map} options 传递的参数
   */
  init: function(element, options) {
    this.adapter = {};
    this.componnet = {};
    this.paint();
  },

  getSelectedAddress: function () {
    var addrId = this.adapter.addrs.input.attr('addrId');
    var addrs = this.adapter.addrs.addressList.attr();
    return _.findWhere(addrs, {addrId: window.parseInt(addrId)});
  },

  /**
   * @description 绘制页面
   */
  paint: function () {
    var that = this;
    can.when(
      sf.b2c.mall.model.user.getRecAddressList(),
      sf.b2c.mall.model.user.getIDCardUrlList(),
      sf.b2c.mall.model.user.getUserInfo())
      .done(function (reAddrs, reIds, userinfo) {
        if (sf.util.access(reAddrs[0]) && sf.util.access(reIds[0]) && sf.util.access(userinfo[0])) {

          //获得地址列表
          that.adapter.addrs = new sf.b2c.mall.adapter.address.list({addressList: reAddrs[0].content[0].items});
          that.adapter.ids = new sf.b2c.mall.adapter.ids({idList: reIds[0].content[0].items});

          that.adapter.addrs.addressList.each(function (el, index) {
            var user = that.adapter.ids.idList.filter(function(item, index, list){
              return item.recId == el.recId;
            });
            if(user.length == 0){
                return false;
            }else{
                el.attr(user[0].attr());
            }

          });


          //生成邀请码
          //step1 判断是否为顺丰邮箱，顺丰邮箱注册用户才能看到 ‘邀请码’
          that.adapter.addrs.attr("canViewInviteCodes", false);//  /(@sf-express.com)/.test(userinfo[0].content[0].mailId));
          //step2 如果是的话获取邀请码列表
          if (that.adapter.addrs.canViewInviteCodes)
          {
            can.when(sf.b2c.mall.model.user.getInviteCodeList())
            .done(function(codes){
              that.adapter.addrs.attr("inviteCodes", codes.content[0].items);
            })
          }


          //that.adapter.addrs.attr('mainTitle','新增收货地址');
          //进行渲染
          that.render(that.adapter.addrs);


          if (that.componnet.addressEditor) {
            that.componnet.addressEditor.destroy();
          }

          that.componnet.addressEditor = new sf.b2c.mall.center.address.editor('#address-editor', {
            onSuccess: _.bind(that.paint, that),
            onUserUpdate: _.bind(that.updateUserInfo, that)
          });
        }
      })
      .fail(function () {

      });
  },

  updateUserInfo: function (users) {
    var that = this;
    // this.adapter.ids = new sf.b2c.mall.adapter.ids({idList: users.items});
    this.adapter.ids.format({idList: users.items});

    this.adapter.addrs.addressList.each(function (el, index) {
      var user = that.adapter.ids.idList.filter(function(item, index, list){
        return item.recId == el.recId;
      });
      el.attr(user[0].attr());
    });
  },

  /**
   * @description event:删除用户收货地址
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '.center-address-delete click': function(element, event) {
    event && event.preventDefault();

    var isDelete = confirm("确认要删除此收货地址吗?");

    if (!isDelete) return false;

    var index = element.data('index');
    var addr = this.adapter.addrs.get(index);

    var that = this;
    can.when(sf.b2c.mall.model.user.delRecAddress({
        addrId: addr.addrId
      }))
      .done(function(data) {
        if (sf.util.access(data) && data.content[0].value) {
          that.adapter.addrs.remove(index);

          setTimeout(function() {
            alert('删除收货地址成功！');
          }, 0);

        }
      })
      .fail(function(data) {

      });
  },

  /**
   * @description event:
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '#center-add-address-btn click': function(element, event) {
    event && event.preventDefault();
    if(this.adapter.addrs.length() > 9 ){
      return alert('新增收货地址失败，每个人最多可添加10条收货地址。')
    }

    //this.adapter.addrs.attr('mainTitle','新增收货地址');
    this.componnet.addressEditor.show('create');
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function(data) {
    var html = can.view('templates/center/sf.b2c.mall.center.address.mustache', data, this.helpers);
    this.element.html(html);
  },

  '.center-address-modify click': function (element, event) {
    event && event.preventDefault();
    var index =  element.data('index');
    var addr = this.adapter.addrs.get(index);
    this.adapter.addrs.input.attr('addrId',addr.addrId);


    //this.adapter.addrs.attr('mainTitle','修改收货地址');

    this.componnet.addressEditor.show('editor', addr);

    var scrollTop = $('.i-upload').position().top;
    $(document).scrollTop(scrollTop);

  }

});