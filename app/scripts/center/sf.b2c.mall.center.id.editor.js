'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.center.id.editor');

/**
 * @class sf.b2c.mall.center.id.editor
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 显示用户列表信息
 */
sf.b2c.mall.center.id.editor = can.Control.extend({

  defaults: {
    pphoto: 'images/positive.png',
    nphoto: 'images/anti.png',
    spphoto: 'images/img03.png',
    snphoto: 'images/img04.png'
  },

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

  init: function(element, options) {
    this.adapter = {};
    this.component = {};
    this.paint();
    this.resetNameError();
    this.resetCardIdError();
  },

  paint: function() {
    if (!this.options.input) {
      this.options.input = new can.Map({
        recName: null,
        credtNum: null,
        recId: null,
        type: 'ID'
      });
    }

    this.options.image = new can.Map({
      spphoto: this.options.input.credtImgUrl1,
      snphoto: this.options.input.credtImgUrl2
    });

   this.options.consigneeName = new can.Map({
       nameError:""
   });
    this.options.consigneeCardId = new can.Map({
       cardIdError:""
    });
    this.render(this.options);
  },

  render: function(data) {
    var html = can.view('templates/center/sf.b2c.mall.center.id.editor.mustache', data, this.helpers);
    this.element.html(html);
  },

  update: function(user) {
    var that = this;
    can.when(sf.b2c.mall.model.user.updateReceiverInfo(user))
      .done(function(data) {
        if (sf.util.access(data, true) && data.content[0].value) {
          that.onSuccess.call(that, user.recId);
        }
      })
      .fail(function() {

      });
  },

  add: function(user) {
    var that = this;
    can.when(sf.b2c.mall.model.user.createReceiverInfo(user))
      .done(function(data) {
        if (sf.util.access(data, true) && data.content[0].value) {
          that.onSuccess.call(that, data.content[0].value);
        }
      })
      .fail(function() {

      });
  },

  back: function(recId) {
    if (_.isFunction(this.options.switchView)) {
      this.options.switchView('list', {
        recId: recId
      });
    }
  },

  onSuccess: function(data) {
    setTimeout(function() {
      window.alert('保存成功！');
    }, 0);

    this.back(data);
  },
/*
* 重置用户名错误提示
* */
    resetNameError:function(){
        this.options.consigneeName.attr({
            nameError:''
        })
    },
/*
* 重置身份证错误提示
* */
    resetCardIdError:function(){
        this.options.consigneeCardId.attr({
            cardIdError:''
        })
    },
    /*
    * 设置收货人错误提示
    * */
    setconsignessNameError:function(data){
        this.options.consigneeName.attr({
            nameError:data
        })

    },
    /*
     * 设置身份证错误提示
     * */
    setcardIdError:function(data){
        this.options.consigneeCardId.attr({
            cardIdError:data
        })
    },
//   checkMap: {
//    'recName': '请输入用户名!',
//    'credtNum': '请输入身份证号'
//  },

  '.name-submit click': function(element, event) {
    event && event.preventDefault();

    this.resetNameError();
    this.resetCardIdError();
    var user = this.options.input.attr();
    var cardNo = this.options.input.attr('credtNum');
    var info = {
      isTrue : false,
      year : null,
      month : null,
      day : null,
      isMale : false,
      isFemale : false
    };
    this.resetNameError();
    this.resetCardIdError();

    if(!user.recName){
        this.setconsignessNameError('请输入收货人姓名');
        return false;
    }
    var testRecName = /^[\u4e00-\u9fa5]{0,8}$/.test($.trim(user.recName));
    if(testRecName){
    }else{
        this.setconsignessNameError('您输入的收货人姓名有误');
        return false;
    }
    if(!cardNo){
        this.setcardIdError('请输入收货人身份证号');
        return false;
    }
    if(cardNo.length < 18 || cardNo.length>18){
        this.setcardIdError('身份证位数不正确');
        return false;
    }
    if (cardNo.length == 18) {
      var year = cardNo.substring(6, 10);
      var month = cardNo.substring(10, 12);
      var day = cardNo.substring(12, 14);
      var p = cardNo.substring(14, 17)
      var birthday = new Date(year, parseFloat(month) - 1,
          parseFloat(day));
      // 这里用getFullYear()获取年份，避免千年虫问题
      if (birthday.getFullYear() != parseFloat(year)
          || birthday.getMonth() != parseFloat(month) - 1
          || birthday.getDate() != parseFloat(day)) {
          info.isTrue = false;
      }
      var Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];// 加权因子
      var Y = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];// 身份证验证位值.10代表X
      // 验证校验位
      var sum = 0; // 声明加权求和变量
      var _cardNo = cardNo.split("");
      if (_cardNo[17].toLowerCase() == 'x') {
          _cardNo[17] = 10;// 将最后位为x的验证码替换为10方便后续操作
      }
      for ( var i = 0; i < 17; i++) {
          sum += Wi[i] * _cardNo[i];// 加权求和
      }
      var i = sum % 11;// 得到验证码所位置
      if (_cardNo[17] != Y[i]) {
         info.isTrue = false;
      }else{
         info.isTrue = true;
      }
      info.year = birthday.getFullYear();
      info.month = birthday.getMonth() + 1;
      info.day = birthday.getDate();
      if (p % 2 == 0) {
          info.isFemale = true;
          info.isMale = false;
      } else {
          info.isFemale = false;
          info.isMale = true
      }

    }
    if(info.isTrue) {
        if (user.recId) {
            this.update.call(this, sf.util.clean(user));
        } else {
            this.add.call(this, sf.util.clean(user));
        }
    }else{
        this.setcardIdError('身份证不合法');
    }
  },

  '.name-x click': function(element, event) {
    event && event.preventDefault();

    var index = element.data('index');
  },

  onUpload: function(photo) {
    this.options.input.attr('credtImgUrl1', photo.credtImgUrl1);
    this.options.input.attr('credtImgUrl2', photo.credtImgUrl2);

    if (photo.credtImgUrl1) {
      this.options.image.attr('spphoto', photo.credtImgUrl1);
    }

    if (photo.credtImgUrl2) {
      this.options.image.attr('snphoto', photo.credtImgUrl2);
    }
  },

  '.name-img click': function(element, event) {
    event && event.preventDefault();

    var user = new can.Map({
      credtImgUrl1: this.options.input.credtImgUrl1 || this.defaults.pphoto,
      credtImgUrl2: this.options.input.credtImgUrl2 || this.defaults.nphoto
    });

    if (this.component.idPhoto) {
      this.component.idPhoto.destroy();
    }
    this.component.idPhoto = new sf.b2c.mall.center.id.photo('#center-id-photo-editor', {
      user: user,
      onUpload: _.bind(this.onUpload, this)
    });
  },

  '.name-q click': function(element, event) {
    event && event.preventDefault();

    this.back();
  }

});