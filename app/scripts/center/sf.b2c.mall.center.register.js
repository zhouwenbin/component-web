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

  var ERROR_NO_INPUT_MOBILE = '请输入您的手机号码';
  var ERROR_INPUT_MOBILE = '您的手机号码输入有误';
  var ERROR_NO_MOBILE_CHECKCODE = '请输入验证码';
  var ERROR_MOBILE_CHECKCODE = '您输入的验证码有误，请重新输入';
  var ERROR_NO_PASSWORD = '请设置登录密码';
  var ERROR_PASSWORD = '密码请设置6-18位字母、数字或标点符号';

  var DEFAULT_MOBILE_ACTIVATE_ERROR_MAP = {
    '1000020': '账户已注册',
    '1000230': '手机号错误，请输入正确的手机号',
    '1000240': '手机验证码错误',
    '1000250': '手机验证码错误'
  };

  var DEFAULT_DOWN_SMS_ERROR_MAP = {
    '-140' :'请输入您的手机号码',
    '1000010' : '未找到手机用户',
    '1000020' : '手机号已存在',
    '1000070' : '参数错误',
    '1000230' : '手机号错误，请输入正确的手机号',
    '1000270' : '短信请求太过频繁,请稍后重试',
    '1000290' : '短信请求太多'
  };

  return can.Control.extend({

    init:function(){
      this.component = {};
      this.component.downSmsCode = new SFUserDownSmsCode();
      this.component.mobileRegister = new SFUserMobileRegister();
      //this.component.getBirthInfo = new SFGetBirthInfo();

      this.data = new can.Map({
        mobileNum:null,
        mobileCode:null,
        password:null,
        ischecked:true
      });
      this.render(this.data);
      this.functionPlaceHolder(document.getElementById("input-mobile-num"));
      this.functionPlaceHolder(document.getElementById("input-mobile-code"));
    },

    render:function(data){
      var html = can.view('templates/component/sf.b2c.mall.register.mustache', data);
      this.element.html(html);
    },

    checkMobile: function (mobile) {
      if (!mobile) {
        this.element.find('#input-mobile-error').text(ERROR_NO_INPUT_MOBILE).show();
        return false;
      }else if(!/^1\d{10}$/.test(mobile)){
        this.element.find('#input-mobile-error').text(ERROR_INPUT_MOBILE).show();
        return false;
      }else{
        return true;
      }
    },

    checkCode: function (code) {
      if (!code) {
        this.element.find('#mobile-code-error').text(ERROR_NO_MOBILE_CHECKCODE).show();
        return false;
      }else if (!/^\d{6}$/.test(code)) {
        this.element.find('#mobile-code-error').text(ERROR_MOBILE_CHECKCODE).show();
        return false;
      }else{
        return true;
      }
    },

    checkPassword: function (password) {
      if (!password) {
        this.element.find('#pwdErrorTips').text(ERROR_NO_PASSWORD).show();
        return false;
      }else if (!/^[0-9a-zA-Z~!@#\$%\^&\*\(\)_+=-\|~`,./<>\[\]\{\}]{6,18}$/.test(password)) {
        this.element.find('#pwdErrorTips').text(ERROR_PASSWORD).show();
        return false;
      }else{
        return true;
      }
    },

    //注册
    '#agree-and-register click':function(ele,event){
      event && event.preventDefault();

      //重置错误信息
      $('#input-mobile-error').hide();
      $('#mobile-code-error').hide();
      $('#pwdErrorTips').hide();

      var params = {
        mobileNum:this.data.attr('mobileNum'),
        mobileCode:this.data.attr('mobileCode'),
        password:this.data.attr('password')
      }

      if(this.checkMobile.call(this,params.mobileNum) && this.checkCode.call(this,params.mobileCode) && this.checkPassword.call(this,params.password)){
        this.component.mobileRegister.setData({
          mobile:params.mobileNum,
          smsCode:params.mobileCode,
          password:md5(params.password + 'www.sfht.com')
        });
        var number = params.mobileNum;
        this.component.mobileRegister.sendRequest()
          .done(function(data){
            if(data.csrfToken){

              var sfb2cmallregister = $('.sf-b2c-mall-register .register');
              var html = '<div class="register-h"><h2>抢先注册</h2><a href="#" class="btn btn-close">关闭</a></div>'+
                  '<div class="register-b1"><span class="icon icon27"></span><h3>恭喜您注册成功!</h3><p>顺丰海淘即将正式开放，<br />'+
                  '届时使用手机号码<span>'+number+'</span>访问网站,抢购明星产品</p><a href="" id="btn-close-window" class="btn btn-register btn-send">确认</a></div>';
              sfb2cmallregister.html(html);
            }
          })
          .fail(function(errorCode){
            if(_.isNumber(errorCode)){
              var defaultText = '注册失败';
              var errorText = DEFAULT_MOBILE_ACTIVATE_ERROR_MAP[errorCode.toString()] || defaultText;
              if(errorCode == 1000020 || errorCode == 1000230){
                $('#input-mobile-error').text(errorText).show();
              }else{
                $('#mobile-code-error').text(errorText).show();
              }
            }
          })
      }

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
      // var mobileNum = this.data.attr('mobileNum');
      var mobileNum = this.element.find('#input-mobile-num').val();
      if(this.checkMobile.call(this,mobileNum)){
        this.component.downSmsCode.setData({
          mobile:mobileNum,
          askType:'REGISTER'
        });
        this.component.downSmsCode.sendRequest()
          .done(function(data){
            that.countTime(ele,wait);
          })
          .fail(function(errorCode){
            if (_.isNumber(errorCode)) {
              var defaultText = '短信请求发送失败';
              var errorText = DEFAULT_DOWN_SMS_ERROR_MAP[errorCode.toString()] || defaultText;
              if (errorCode === 1000020) {
                $('#input-mobile-error').html(errorText).show();
              }else{
                $('#mobile-code-error').html(errorText).show();
              }
            }
          })
      }
    },
    //手机号码输入框光标移上错误提示消失
    '#input-mobile-num focus':function(ele,event){
      event && event.preventDefault();

      $('#input-mobile-error').hide();

    },
    //手机号码输入框失去焦点验证
    '#input-mobile-num blur':function(ele,event){
      event && event.preventDefault();
      var mobileNum = $(ele).val();
      if(mobileNum.length === 11 && this.checkMobile.call(this,mobileNum)){
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
      window.location.reload();

    },

    '#input-mobile-code focus':function(ele,event){
      event && event.preventDefault();

      $('#mobile-code-error').hide();
    },

    '#input-user-password focus':function(ele,event){
      event && event.preventDefault();

      $(ele).css('color','#333');
      // var mobileCode = this.data.attr('mobileCode');
      var mobileCode = this.element.find('#input-mobile-code').val();
      this.checkCode.call(this,mobileCode);
      $('#pwdErrorTips').hide();

    },
    '#input-user-password keyup':function(ele,event){
      $(ele).siblings('label').hide();
    },
    '#input-user-password blur':function(ele,event){
      var password = this.data.attr('password');
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
    '#ischecked change':function($el,event){
      // event && event.preventDefault();

      var ischecked = this.data.attr('ischecked');
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