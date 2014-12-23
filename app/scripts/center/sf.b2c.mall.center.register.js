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
      user: new can.Map({
        mobileNum: null,
        mobileCode: null,
        password: null
      })
    },

    init:function(element,options){

    },

    paint:function(data){

      //重置输入框内容
      this.defaults.user.attr({
        mobileNum: null,
        mobileCode: null,
        password: null
      });

      this.data = this.parse(this.defaults);
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

    //注册
    '.btn-register click':function(ele,event){
      event && event.preventDefault();

      //重置错误信息
      $('#mobileNumErrorTips').hide();
      $('#mobileCodeErorTips').hide();
      $('#pwdErrorTips').hide();

      var that = this;

      var params = {
        mobileNum:this.data.user.attr('mobileNum'),
        mobileCode:this.data.user.attr('mobileCode'),
        password:this.data.user.attr('password')
      };
      var validateMobileNum = /^1\d{10}$/.test(params.mobileNum);//电话号码正则验证（以1开始，11位验证）
      var validateMobileCode= /\d{6}$/.test(params.mobileCode);//验证码6位数字验证
      var validatePwd = /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,18}$/.test(params.password);//密码正则验证

      if(!params.mobileNum || !validateMobileNum){
         $('#mobileNumErrorTips').show();
         return this.setMobileNumError('您的手机号码输入有误');
      }

      if(!params.mobileCode || !validateMobileCode){
        $('#mobileCodeErorTips').show();
        return this.setMobileCodeError('您输入的验证码有误，请重新输入');
      }

      if(!params.password || !validatePwd){
        $('#pwdErrorTips').show();
        return this.setPwdError('密码请设置6-18位字母、数字或标点符号');
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
              var html = '<div class="register-h"><h2>抢先预约</h2><a href="#" class="btn btn-close">关闭</a></div>'+
              '<div class="register-b1"><span class="icon icon27"></span><h3>恭喜您预约成功!</h3><p>顺丰海淘即将正式开放，<br />'+
              '届时使用手机号码<span>'+data.mobile+'</span>访问网站,抢购明星产品</p><a href="#" id="btn-close-window" class="btn btn-register btn-send">确认</a></div>';
              sfb2cmallregister.html(html);

            }
          })
          .fail(function(errorCode){
            debugger;
            var map ={
              '1000240':'手机验证码错误',
              '1000250':'手机验证码已过期'
            };
            var errorText = map[errorCode].toString();
            $('#mobileCodeErorTips').show();
            that.setMobileCodeError(errorText);
          })

    },
    //验证码倒计时
    countTime:function(ele,wait){
      var that = this;
      if (wait == 0) {

        $(ele).removeAttr('disabled');
        $(ele).removeClass('disable');
        $(ele).text('发送验证码');
        wait = 60;
      } else {
        $(ele).attr('disabled','disabled');
        $(ele).addClass('disable');
        $(ele).text(wait+"s后重新发送");

        wait--;
        setTimeout(function() {
          that.countTime(ele,wait);
        },
        1000)
      }
    },
    //发送手机验证码
    '#btn-send-mobilecode click':function(ele,event){
      event && event.preventDefault();

      var that = this;
      var wait = 60;//初始化倒计时时间

      $(ele).attr('state','false');
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



          })
          .fail(function(errorCode){
            var map ={
              '1000020':'账户已注册',
              '1000270':'短信请求太频繁',
              '1000290':'短信请求太多'
            };
            var errorText = map[errorCode].toString();
            $('#mobileNumErrorTips').show();
            that.setMobileNumError(errorText);
          })
    },
    //手机号码输入框光标移上错误提示消失
    '#input-mobile-num focus':function(ele,event){
      event && event.preventDefault();

      $('#mobileNumErrorTips').fadeOut(1000);

    },
    //手机号码输入框失去焦点验证
    '#input-mobile-num blur':function(ele,event){
      event && event.preventDefault();

      var state =$('#btn-send-mobilecode').attr('state');
      var mobileNum = $(ele).val();
      if( mobileNum.length > 0 && mobileNum.length <11 || mobileNum.length > 11){
        $('#mobileNumErrorTips').show();
        return this.setMobileNumError('您的手机号码输入有误');
      }

      if(!mobileNum.length){
        $('#mobileNumErrorTips').show();
        return this.setMobileNumError('请输入您的手机号码');
      }

      if(mobileNum.length === 11){
        $('#mobileNumErrorTips').fadeOut(1000);
        if(state === "true"){
          $('#btn-send-mobilecode').removeAttr('disabled');
          $('#btn-send-mobilecode').removeClass('disable');
        }
      }

    },

    '#input-mobile-num keyup':function(ele,event){
      event && event.preventDefault();

      $('#btn-send-mobilecode').addClass('disable');

    },
    //关闭注册悬浮框
    '.btn-close click':function(ele,event){
      event && event.preventDefault();

      $('.sf-b2c-mall-register').html('');

    },
    '#btn-close-window click':function(ele,event){
      event && event.preventDefault();

      $('.sf-b2c-mall-register').html('');

    },

    //验证码框光标移上错误提示消失
    '#input-mobile-code focus':function(ele,event){
      event && event.preventDefault();

      $('#mobileCodeErorTips').fadeOut(1000);

    },

    //密码框光标移上错误提示消失
    '#input-user-password focus':function(ele,event){
      event && event.preventDefault();

      $('#pwdErrorTips').fadeOut(1000);

    },
    //checkbox是否选中
    '#ischecked change':function(ele,event){
      event && event.preventDefault();

      if($(ele).attr('state') === 'true'){

        $(ele).attr('checked','checked');
        $('.btn-register').removeAttr('disabled');

        $(ele).attr('state','false');
        $('.btn-register').removeClass('disable');

      }else{

        $(ele).removeAttr('checked');
        $('.btn-register').attr('disabled','disabled');
        $(ele).attr('state','true');
        $('.btn-register').addClass('disable');
      }
    }
  })
})