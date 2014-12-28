/**
 * Created by 魏志强 on 2014/12/26.
 */
define(
    'sf.b2c.mall.center.change.userinfo',
    [
      'can',
      'jquery',
      'jquery.cookie',
      'sf.b2c.mall.api.user.getUserInfo',
      'sf.b2c.mall.api.user.upateUserInfo'
    ],
    function(can,$, $cookie, SFGetUserInfo, UpateUserInfo){

      var GENDER_MAP = {
        'INVALID_GENDER': '男',
        'MALE': '男',
        'FEMALE': '女'
      }

      return can.Control.extend({

        defaults:{

        },

        init:function(){
          this.component = {};
          this.component.updateInfo = new UpateUserInfo();
          this.component.getUserInfo = new SFGetUserInfo();

          this.data = new can.Map({
            isModified:false,
             user:{
               nick: $.cookie('nick'),
               gender: GENDER_MAP[$.cookie('gender')],
             },
            input:{
              nick:null,
              gender:null
            }
          });
          this.render(this.data);
        },
        render:function(data){
          var html = can.view('templates/center/sf.b2c.mall.center.userinfo.mustache', data);
          this.element.html(html);

          var that = this;
          if (!this.data.user.nick) {
            this.component.getUserInfo.sendRequest()
              .done(function (data) {

                $.cookie('gender', data.gender);
                $.cookie('nick', data.nick);

                that.data.user.attr({
                  nick: data.nick,
                  gender: GENDER_MAP[data.gender]
                });

              })
              .fail(function (errorCode) {
                throw new Error(errorCode)
              })
          }
        },

        /**
         * @description event:用户需要修改用户信息
         * @param  {Dom} element 触发事件的元素
         * @param  {Event} event   事件对象
         */
        '#user-info-modify-btn click': function (element, event) {
          event && event.preventDefault();
          if (!this.data.isModified) {
            this.data.attr('isModified',true);
          }
        },
        /**
         * @description event:用户确认修改用户信息
         * @param  {Dom} element 触发事件的元素
         * @param  {Event} event   事件对象
         */
        '#user-info-confirm-btn click': function (element, event) {
          event && event.preventDefault();

          if (this.data.isModified) {

            var nickName = this.data.input.attr('nick');
            if(nickName.length >10){
              window.alert('您的昵称太长，不能超过10个字节');
              return false;
            }

            var params = {
              gender: this.data.input.attr('gender'),
              nick: this.data.input.attr('nick')
            };

            // @todo 向服务器提交修改
            var that = this;
            this.component.updateInfo.setData(params);
            this.component.updateInfo.sendRequest()
                .done(function (data) {
                  if (sf.util.access(data) && data.content[0].value) {
                    var nick = that.data.input.attr('nick');
                    var gender = that.data.input.attr('gender');

                    that.data.user.attr({'nick': nick, 'gender': gender, 'genderStr': gender === 'FEMALE' ? '女' : '男'});

                    that.data.attr('isModified',false);
                    window.location.reload();
                  }
                })
                .fail(function () {
                  that.data.isModified(false);
                });
          }
        }
      })
    }
)