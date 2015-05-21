/**
 * Created by 魏志强 on 2014/12/26.
 */
define(
  'sf.b2c.mall.center.change.userinfo', [
    'can',
    'jquery',
    'jquery.cookie',
    'sf.b2c.mall.api.user.getUserInfo',
    'sf.b2c.mall.api.user.updateUserInfo',
    'sf.b2c.mall.widget.message'
  ],
  function(can, $, $cookie, SFGetUserInfo, UpdateUserInfo, SFMessage) {

    var GENDER_MAP = {
      'INVALID_GENDER': '男',
      'MALE': '男',
      'FEMALE': '女'
    };
    return can.Control.extend({

      init: function() {
        this.component = {};
        this.component.updateUserInfo = new UpdateUserInfo();
        this.component.getUserInfo = new SFGetUserInfo();

        var that = this;
        this.component.getUserInfo.sendRequest()
            .done(function(data) {

              that.data = new can.Map({
                isModified: false,
                user: {
                  nick: data.nick,
                  gender: GENDER_MAP[data.gender]
                },
                input: {
                  nick: data.nick,
                  gender: data.gender
                }
              });

              that.render(that.data);

            })
            .fail(function(errorCode) {
              throw new Error(errorCode)
            })
      },
      render: function(data) {

        var html = can.view('templates/center/sf.b2c.mall.center.userinfo.mustache', data);
        this.element.html(html);

      },

      /**
       * @description event:用户需要修改用户信息
       * @param  {Dom} element 触发事件的元素
       * @param  {Event} event   事件对象
       */
      '#user-info-modify-btn click': function(element, event) {
        event && event.preventDefault();
        if (!this.data.isModified) {
          this.data.attr('isModified', true);
        }
      },

      '#select-sex change': function(element, event) {
        this.data.input.attr('gender');
      },
      /**
       * @description event:用户确认修改用户信息
       * @param  {Dom} element 触发事件的元素
       * @param  {Event} event   事件对象
       */
      '#user-info-confirm-btn click': function(element, event) {
        event && event.preventDefault();

        if (this.data.isModified) {

          var nickName = this.data.input.attr('nick');
          var index = nickName.indexOf(',');
          if(index >=0){
            window.alert('您的昵称中有非法字符');
            return false;
          }
          if (nickName.length > 10) {
            window.alert('您的昵称太长，请返回修改');
            return false;
          }

          var params = {
            gender: this.data.input.attr('gender'),
            nick: this.data.input.attr('nick')
          };

          // @todo 向服务器提交修改
          var that = this;
          this.component.updateUserInfo.setData(params);
          this.component.updateUserInfo.sendRequest()
            .done(function(data) {
              if (data.value) {
                var nick = that.data.input.attr('nick');
                var gender = that.data.input.attr('gender');
                that.data.user.attr({
                  'nick': nick,
                  'gender': GENDER_MAP[gender]
                });
                that.data.attr('isModified', false);

                var message = new SFMessage(null, {
                  'tip': '修改资料成功！',
                  'type': 'success'
                });

                // $.cookie('gender', gender);
                // $.cookie('nick', nick);
              }
            })
            .fail(function() {
              that.data.attr('isModified', false);
            });
        }
      }
    })
  }
)