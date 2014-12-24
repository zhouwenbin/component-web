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
        password: null,
        ischecked: true
      });

      this.data = this.parse(this.defaults);
      this.render(this.data);
      this.functionPlaceHolder(document.getElementById("input-mobile-num"));
      this.functionPlaceHolder(document.getElementById("input-mobile-code"));
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

      if(!params.mobileNum){
        $('#mobileNumErrorTips').show();
        return this.setMobileNumError('请输入您的手机号码');
      }else if(!validateMobileNum){
         $('#mobileNumErrorTips').show();
         return this.setMobileNumError('您的手机号码输入有误');
      }


      if(!params.mobileCode){
        $('#mobileCodeErorTips').show();
        return this.setMobileCodeError('请输入验证码');
      }else if(!validateMobileCode){
        $('#mobileCodeErorTips').show();
        return this.setMobileCodeError('您输入的验证码有误，请重新输入');
      }

      if(!params.password){
        $('#pwdErrorTips').show();
        return this.setPwdError('请设置登录密码');
      }else if(!validatePwd){
        $('#pwdErrorTips').show();
        return this.setPwdError('密码请设置6-18位字母、数字或标点符号');
      }

      var data ={
        mobile:params.mobileNum,
        smsCode:params.mobileCode,
        password:md5(params.password + 'www.sfht.com')
      };
      var number = data.mobile;
      var mobileRegister = new SFUserMobileRegister(data);
      mobileRegister
          .sendRequest()
          .done(function(data){
            if(data.csrfToken){

              var sfb2cmallregister = $('.sf-b2c-mall-register .register');
              var html = '<div class="register-h"><h2>抢先预约</h2><a href="#" class="btn btn-close">关闭</a></div>'+
              '<div class="register-b1"><span class="icon icon27"></span><h3>恭喜您预约成功!</h3><p>顺丰海淘即将正式开放，<br />'+
              '届时使用手机号码<span>'+number+'</span>访问网站,抢购明星产品</p><a href="#" id="btn-close-window" class="btn btn-register btn-send">确认</a></div>';
              sfb2cmallregister.html(html);

            }
          })
          .fail(function(errorCode){
            var map ={
              '1000020':'账户已注册',
              '1000240':'手机验证码错误',
              '1000250':'手机验证码错误'
            };
            var errorText = map[errorCode].toString();
            if(errorText === "账户已注册"){
              $('#mobileNumErrorTips').show();
              that.setMobileNumError('用户已注册，上线时将短信提醒');
            }else{
              $('#mobileCodeErorTips').show();
              that.setMobileCodeError(errorText);
            }

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
      //this.countTime(ele,wait);

      var mobileNum = this.data.user.attr('mobileNum');
      var data ={
        mobile:mobileNum,
        askType:'REGISTER'
      };
      var downSmsCode = new SFUserDownSmsCode(data);
      downSmsCode
          .sendRequest()
          .done(function(data){
            that.countTime(ele,wait);
          })
          .fail(function(errorCode){

            var map ={
              '-140':'请输入您的手机号码',
              '1000020':'用户已注册，上线时将短信提醒',
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
      var mobileNum = $(ele).val();
      var validateMobileNum = /^1\d{10}$/.test(mobileNum);//电话号码正则验证（以1开始，11位验证

      if(!mobileNum.length){
        $('#mobileNumErrorTips').show();
        return this.setMobileNumError('请输入您的手机号码');
      }else if(!validateMobileNum){
        $('#mobileNumErrorTips').show();
        return this.setMobileNumError('您的手机号码输入有误');
      }

      if(mobileNum.length === 11){
        $('#btn-send-mobilecode').attr('state','true');
        $('#mobileNumErrorTips').fadeOut(1000);
        if($('#btn-send-mobilecode').attr('state') === "true" && $('#btn-send-mobilecode').html() ==="发送验证码" ){
          $('#btn-send-mobilecode').removeAttr('disabled');
          $('#btn-send-mobilecode').removeClass('disable');
        }
      }

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

      $(ele).css('color','#333');
      var mobileCode = $('#input-mobile-code').val();
      var validateMobileCode= /\d{6}$/.test(mobileCode);
      if(!mobileCode.length){
        $('#mobileCodeErorTips').show();
        this.setMobileCodeError('请输入验证码');
      }else if(!validateMobileCode){
        $('#mobileCodeErorTips').show();
        this.setMobileCodeError('您输入的验证码有误');
      }
      $('#pwdErrorTips').fadeOut(1000);

    },
    '#input-user-password keyup':function(ele,event){
      $(ele).siblings('label').hide();
    },
    '#input-user-password blur':function(ele,event){
      var password = $(ele).val();
      $(ele).css('color','#999');
      if(password){
        $(ele).siblings('label').hide();
      }else{
        $(ele).siblings('label').show();
      }
    },
    '#default-text click':function(){
      $('#input-user-password').focus();
    },
    //checkbox是否选中
    '#ischecked click':function($el,event){
      // event && event.preventDefault();

      var ischecked = this.defaults.user.attr('ischecked');
      if (ischecked) {
        $('.btn-register').removeAttr('disabled').removeClass('disable');
        $el.attr('state','false');
      }else{
        $('.btn-register').attr('disabled','disabled').addClass('disable');
        $el.attr('state','true');
      }
    },
    //ie7,8,9输入框默认值
    functionPlaceHolder:function(element){
      var placeholder = '';
      if (element && !("placeholder" in document.createElement("input")) && (placeholder = element.getAttribute("placeholder"))) {
        element.style.color = '#999';
        element.onfocus = function() {
          if (this.value === placeholder) {
            this.value = "";
          }
          this.style.color = '#333';
        };
        element.onblur = function() {
          if (this.value === "") {
            this.value = placeholder;
          }
          this.style.color = '#999';
        };

        //样式初始化
        if (element.value === "") {
          element.value = placeholder;
        }
      }
    }
  });
})