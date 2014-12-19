/**
 * Created by 魏志强 on 2014/12/18.
 */
define('sf.b2c.mall.center.register',[
    'can',
    'jquery'
],function(can,$){
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

      //重置错误信息
      this.resetMobileNumError();
      this.resetMobileCodeError();
      this.resetPwdError();

      //重置输入框内容
      this.defaults.user.attr({
        mobileNum: null,
        mobileCode: null,
        password: null
      });

      this.paint(this.defaults);
    },

    paint:function(data){
      this.data = this.parse(data);
      this.render(this.data);
    },

    render:function(){
      var html = can.view('templates/component/sf.b2c.mall.register.mustache');

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
     * @description 重置手机号码提示信息
     */
    resetMobileNumError: function(){
      this.defaults.mobileNum.attr({
        numError:''
      });
    },
    /**
     * @description 重置手机验证码错误提示信息
     */
    resetMobileCodeError: function()
    {
      this.defaults.mobileCode.attr({
        codeError:''
      });
    },
    /**
     * @description 重置密码错误提示信息
     */
    resetPwdError:function(){
      this.defaults.password.attr({
        pwdError:''
      });
    },

    '.btn-register click':function(ele,event){
      event && event.preventDefault();

      //重置错误信息
      this.resetMobileNumError();
      this.resetMobileCodeError();
      this.resetPwdError();

      var params = {
        mobileNum:this.data.attr('mobileNum'),
        mobileCode:this.data.attr('mobileCode'),
        password:this.data.attr('password')
      }
      if(params.mobileNum.length){

      }

    },
    '#btn-send-mobilecode click':function(ele,event){
      event && event.preventDefault();


    }


  })
})