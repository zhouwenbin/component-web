'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.center.register.confirminfo');

/**
 * @class sf.b2c.mall.product.list
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 加载商品列表数据并且进行显示
 */
sf.b2c.mall.center.register.confirminfo = can.Control.extend({

  helpers: {
    'sf-email-host-url': function (emailHost) {
      var map = {
        '163.com': 'http://mail.163.com/',
        'qq.com': 'https://mail.qq.com/',
        'sina.com.cn': 'https://mail.sina.com.cn',
        'sohu.com': 'http://mail.sohu.com/',
        '21cn.com': 'http://mail.21cn.com/',
        'hotmail.com': 'http://www.hotmail.com/',
        'gmail.com': 'http://mail.google.com/gmail',
        '126.com': 'http://mail.126.com',
        'sf-express.com': 'https://hqmail.sf-express.com/'
      };

      return map[emailHost];
    },

    //todo
    'sf-is-email-exist': function (emailHost, options) {
      var arr = ['163.com','qq.com','sina.com.cn','sohu.com','21cn.com','hotmail.com','gmail.com','sf-express.com','126.com'];

      if (arr.indexOf(emailHost) == -1) {
        return options.inverse(options.scope || this);
      }else{
        return options.fn(options.scope || this);
      }
    }
  },
  /**
   * @description 初始化方法，当调用new时会执行init方法
   * @param  {Dom} element 当前dom元素
   * @param  {Map} options 传递的参数
   */
  init: function (element, options) {
    this.component = this.component || {};
    this.component.loading = new sf.b2c.mall.widget.loading();

    this.paint(options.data);
  },

  /**
   * @description 对页面做第一次绘制
   * @param  {Map} data 绘制页面的数据
   */
  paint: function (data) {
    this.data = this.parse(data);

    if (this.options.verify) {
      // deparam过程 -- 从url中获取需要请求的sku参数
      var params = can.deparam(window.location.search.substr(1));

      var that = this;

      this.component.loading.show();
      can.when(sf.b2c.mall.model.user.userActivate(params))
        .done(function (data) {
          if (sf.util.access(data) && data.content[0].value) {
            that.component.loading.hide();
            can.route.attr({tag: 'success'})
          }else{
            that.renderError(that.data);
          }
        })
        .fail(function (data) {

        })
    }else{
      this.buildData(this.data);
      this.render(this.data);
    }


  },

  buildData: function(data){
    var email = data.email;

    data.emailHost = _.str.words(data.email,/@/)[1];
    
    data.isSFEmail = ('sf-express.com' == data.emailHost);

    var canRedictedToEmailURL = _.find(['163.com','qq.com','sina.com.cn','sohu.com','21cn.com','hotmail.com','gmail.com','sf-express.com','126.com'], function(item){ return item == data.emailHost; });
    data.canRedictedToEmailURL = (typeof canRedictedToEmailURL != 'undefined');
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function (data) {
    var html = can.view('templates/center/sf.b2c.mall.center.register.confirminfo.mustache', data, this.helpers);
    this.element.html(html);
  },

  renderError: function (data) {
    var html = can.view('templates/center/sf.b2c.mall.center.register.confirminfo.error.mustache', data);
    this.element.html(html);
  },

  /**
   * @description 将datamodel转化为viewmodel
   * @param  {Map} data datamodel
   * @return {Map}      viewmodel
   */
  parse: function (data) {
    return data;
  },

  /**
   * @description event:重新发送email
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '#register-resend-confirm-email click': function(element, event){
    event && event.preventDefault();

    if (!this.data.email) {
      return '重新发送激活邮件失败';
    }

    can.when(sf.b2c.mall.model.user.resendActivateMail({username: this.data.email}))
      .done(function (data) {
        if (data.stat.code === 0 && data.content[0].value) {
          setTimeout(function() {
            window.alert('重新发送激活邮件成功');
          }, 0);
        }else{
          var errorMap = {
            '1000010': '未找到用户',
            '1000160': '邮件请求频繁'
          }

          var errorCode = data.stat.stateList[0].code;
          var errorText = errorMap[errorCode] || '重新发送激活邮件失败';
          alert(errorText);
        }
      })
      .fail(function () {

      });
  }

});