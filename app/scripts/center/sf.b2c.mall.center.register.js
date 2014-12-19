/**
 * Created by 魏志强 on 2014/12/18.
 */
define('sf.b2c.mall.center.register',[
    'can',
    'jquery',
    'md5',
    'sf.b2c.mall.api.user.downSmsCode',
    'sf.b2c.mall.api.user.mobileRegister'
],function(can,$,md5,SFUserDownSmsCode,SFUserMobileRegister){
  return can.Control.extend({

    defaults:{

      mobileNum:new can.Map({
        numError:''
      }),
      mobileCode:new can.Map({
        codeError:''
      }),
      password:new can.Map({
        pwdError:''
      }),
      repeatPwd:new can.Map({
        repeatPwdError:''
      }),
      user: new can.Map({
        mobileNum: null,
        mobileCode: null,
        password: null,
        repeatPwd:null
      })
    },

    init:function(element,options){

      //重置输入框内容
      this.defaults.user.attr({
        mobileNum: null,
        mobileCode: null,
        password: null,
        repeatPwd:null
      });

      this.paint(this.defaults);
    },

    paint:function(data){
      this.data = this.parse(data);
      this.render(this.data);
    },

    render:function(data){
      var html = can.view('templates/component/sf.b2c.mall.register.mustache', data);

      this.element.html(html);
    },

    supplement:function(){

    },
    parse:function(data){
      return data;
    },
    /**
     * @description 手机号码错误提示
     * @param {String} data 提示的文字信息
     * @return {Boolean} 返回执行情况
     */
    setMobileNumError: function(data) {
      this.data.mobileNum.attr({
        numError:data
      });
    },
    /**
     * @description 手机验证码错误提示
     * @param {String} data 提示的文字信息
     * @return {Boolean} 返回执行情况
     */
    setMobileCodeError: function(data) {
      this.data.mobileCode.attr({
        codeError:data
      });
    },
    /**
     * @description 密码错误提示
     * @param {String} data 提示的文字信息
     * @return {Boolean} 返回执行情况
     */
    setPwdError:function(data){
      this.data.password.attr({
        pwdError:data
      });
    },
    /**
     * @description 重复密码错误提示
     * @param {String} data 提示的文字信息
     * @return {Boolean} 返回执行情况
     */
    setRepeatPwdError:function(data){
      this.data.repeatPwd.attr({
        repeatPwdError:data
      });
    },
    '.btn-register click':function(ele,event){
      event && event.preventDefault();

      //重置错误信息
      $('#mobileNumErrorTips').hide();
      $('#mobileCodeErorTips').hide();
      $('#pwdErrorTips').hide();
      $('#repeatPwdErrorTips').hide();
      var params = {
        mobileNum:this.data.user.attr('mobileNum'),
        mobileCode:this.data.user.attr('mobileCode'),
        password:this.data.user.attr('password'),
        repeatPwd:this.data.user.attr('repeatPwd')
      };
      var validateMobileNum = /^1\d{10}$/.test(params.mobileNum);
      var validateMobileCode= /\d{6}$/.test(params.mobileCode);
      var validatePwd = /^\w{5,17}$/.test(params.password);
      //var ischecked = $('#ischecked');
      if(!params.mobileNum || !validateMobileNum){
         $('#mobileNumErrorTips').show();
         return this.setMobileNumError('手机号码有误');
      }

      if(!params.mobileCode || !validateMobileCode){
        $('#mobileCodeErorTips').show();
        return this.setMobileCodeError('验证码有误');
      }

      if(!params.password){
        $('#pwdErrorTips').show();
        return this.setPwdError('密码有误');
      }

      if(!params.repeatPwd || params.repeatPwd !== params.password){
        $('#repeatPwdErrorTips').show();
        return this.setRepeatPwdError('重复密码有误')
      }
      if(!$('#ischecked:checked')){
        return false;
      }

      var data ={
        mobile:params.mobileNum,
        smsCode:params.mobileCode,
        password:md5(params.password + 'www.sfht.com')
      };
      var mobileRegister = new SFUserMobileRegister(data);
      mobileRegister
          .sendRequest()
          .done(function(data){
            if(data.csrfToken){

              var sfb2cmallregister = $('.sf-b2c-mall-register .register');
              var time = 5;
              var html = '<div class="register-h"><h2>注册成功</h2><a href="#" class="btn btn-close">关闭</a></div>'+
              '<div class="register-b1"><span class="icon icon27"></span><h3>注册成功</h3><p>'+ time +'秒后页面将自动跳转</p></div>';
              sfb2cmallregister.html(html);
              setTimeout($('.sf-b2c-mall-register').html(''),time*1000);
            }
          })

    },
    countTime:function(ele,wait){
      var that = this;
      if (wait == 0) {
        $(ele).css('cursor','pointer');
        $(ele).removeClass('disable');
        $(ele).text('发送验证码');
        wait = 60;
      } else {
        $(ele).css('cursor','not-allowed');
        $(ele).addClass('disable');
        $(ele).text(wait+"s后重新发送");
        wait--;
        setTimeout(function() {
          that.countTime(ele,wait);
        },
        1000)
      }
    },
    '#btn-send-mobilecode click':function(ele,event){
      event && event.preventDefault();
      var wait = 60;
      this.countTime(ele,wait);

      var mobileNum = this.data.user.attr('mobileNum');
      var data ={
        mobile:mobileNum,
        askType:'REGISTER'
      };
      var downSmsCode = new SFUserDownSmsCode(data);
      downSmsCode
          .sendRequest()
          .done(function(data){
            debugger;
          })
    },
    '#input-mobile-num keyup':function(ele,event){
      event && event.preventDefault();

      var mobileNum = $(ele).val();
      if(mobileNum.length === 11){
        $('#mobileNumErrorTips').fadeOut(1000);
        $('#btn-send-mobilecode').css('cursor','pointer');
        $('#btn-send-mobilecode').removeClass('disable');
      }
    },
    '.btn-close click':function(ele,event){
      event && event.preventDefault();

      $('.sf-b2c-mall-register').html('');

    }


  })
})