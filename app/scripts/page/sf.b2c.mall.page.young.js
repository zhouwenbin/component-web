'use strict';
define(
  'sf.b2c.mall.page.young', [
    'can',
    'jquery',
    'jquery.cookie',
    'sf.b2c.mall.api.user.getVoteNum',
    'sf.b2c.mall.api.user.vote',
    'sf.b2c.mall.framework.comm',
    'sf.util',
    'jquery.stackslider',
    'sf.b2c.mall.api.coupon.receiveCoupon',
     'sf.b2c.mall.api.coupon.hasReceivedCp',
     'sf.b2c.mall.widget.message',
    'sf.b2c.mall.business.config'
  ],
  function(can, $, cookie, VoteNum, Vote, SFFrameworkComm, SFFn, stackslider, SFReceiveCoupon,SFHasReceivedCp, SFMessage,SFBusiness) {
    SFFrameworkComm.register(1);
    SFFn.monitor();
    var ticketList = [];
    var index = 1;
    var defaultNum = 14;
    var flag = true;   //判断用户是否领过优惠券
     var times = 10;
    var young = can.Control.extend({
      /**
       * [init 初始化]
       */
      init: function() {
        var that = this;
        $('#st-stack').stackslider({
          "firstCallback": function() {
            index = index > 1 ? index - 1 : index;
            //获取票数
            that.getTicketCount(index);
          },
          "lastCallback": function() {
            index = index > defaultNum ? index : index + 1;
            //获取票数
            that.getTicketCount(index);
          }
        });

        $('.young-tab-h li').click(function() {
          var index = $('.young-tab-h li').index(this);
          $(this).addClass('active').siblings().removeClass('active');
          $('.young-tab-b>li').eq(index).addClass('active').siblings().removeClass('active');
        });

        this.initCookie();

          //投票代码
        var params = {
          'voteType': 'XXMAN',
          'voteNo': index
        };

        $(".pm  a.btn").click(function() {
          var voteTicket = new Vote(params);
          voteTicket.sendRequest()
            .done(function(data) {
              ticketList = data.infos;
              $(".young-time-inner").text(data.voteTotalNum);
              that.getTicketCount(index);
              var clickTimes = $.cookie('clickTimes');
              if (clickTimes && clickTimes.split("-")[1] > 0) {
                $.cookie('clickTimes', clickTimes.split("-")[0] + "-" + (parseInt(clickTimes.split("-")[1]) - 1));
                  times = parseInt(clickTimes.split("-")[1]) - 1;
                $("#clickTimes").text(times);
              }
            })
            .fail(function(error) {
              console.error(error);
            })
            $('#coupon').unbind("click");
            if(!flag){
                if(times < 10){
                    $("#coupon").text("点我领券");
                }
                else{
                    $("#coupon").text("扒下欧巴就能领券啦");
                }
                $("#coupon").click(function(element,event){
                    event && event.preventDefault();
                    that.getCoupon();
                });
            }
            else{
                $("#coupon").text("今日已领，明天还有哦");
            }
        });

          return false;
      },

        //查看是否已经领过优惠券
        hasRecieveCoupon:function(){
            var hasReceivedCp = new SFHasReceivedCp({
                "bagType": "CARD",
                "bagId": '337'
            });

            hasReceivedCp
                .sendRequest()
                .done(function(data) {
                    flag = data.value;
                })
                .fail(function(error) {
                    console.error(error);
                })
        },
        //初始化每日可以扒衣的次数
       initCookie:function(){
           var that = this;
           var obj = $.cookie('clickTimes');
           var currentDate = new Date();
           if (typeof obj == "undefined" || obj == null) {
               var obj = currentDate.getDate() + "-" + 10;
               times = 10;
               $.cookie('clickTimes', obj);
           } else {
               if (parseInt(obj.split("-")[0]) != currentDate.getDate()) {
                   $.cookie('clickTimes', currentDate.getDate() + "-" + 10);
               } else {
                   times = parseInt(obj.split("-")[1]);
                   $("#clickTimes").text(times);
                   if(times < 10){
                       $("#coupon").click(function(element,event){
                           event && event.preventDefault();
                           that.getCoupon();
                       });
                   }
               }
           }
           return false;
       },

      //根据序号获取小鲜肉的投票数
      getTicketCount: function(index) {
        for (var i = 0; i < ticketList.length; i++) {
          if (parseInt(ticketList[i].voteNo) == index) {
            $(".young-slider-r2 span").text(ticketList[i].voteNum);
          }
        }
      },


      //领取优惠券
    getCoupon:function(){
        if (!SFFrameworkComm.prototype.checkUserLogin.call(this)) {
            new SFMessage(null, {
                'tip': '抱歉！需要登录后才可以领取优惠券！',
                'type': 'success',
                'okFunction': function(){
                    window.component.showLogin();
                }
            });
            return false;
        }

        var params = {
            bagId: "CARD",
            type: "337"
        }
        that.receiveCpCodeData(params);

    },

        errorMap: {
            "11000020": "卡券不存在",
            "11000030": "卡券已作废",
            "11000050": "卡券已领完",
            "11000100": "您已领过该券",
            "11000130": "卡包不存在",
            "11000140": "卡包已作废"
        },

        receiveCpCodeData: function(params) {
            params.receiveChannel = 'B2C';
            params.receiveWay = 'ZTLQ';
            var that = this;
            var receiveCouponData = new SFReceiveCoupon(params);
            return can.when(receiveCouponData.sendRequest())
                .done(function(userCouponInfo) {
                    new SFMessage(null, {
                        'tip': '领取成功！',
                        'type': 'success'
                    });
                })
                .fail(function(error) {
                    new SFMessage(null, {
                        'tip': that.errorMap[error] || '领取失败',
                        'type': 'error'
                    });
                });
        },

      //查询票数
      getTicketList: function() {
        var voteNum = new VoteNum({
          'voteType': 'XXMAN'
        });
        ticketList = new can.Map([{
          'voteNo': '0',
          'voteNum': 1000
        }, {
          'voteNo': '1',
          'voteNum': 1001
        }, {
          'voteNo': '2',
          'voteNum': 1002
        }, {
          'voteNo': '3',
          'voteNum': 1003
        }, {
          'voteNo': '4',
          'voteNum': 1004
        }, {
          'voteNo': '5',
          'voteNum': 1000
        }, {
          'voteNo': '6',
          'voteNum': 1001
        }, {
          'voteNo': '7',
          'voteNum': 1002
        }, {
          'voteNo': '8',
          'voteNum': 1003
        }, {
          'voteNo': '9',
          'voteNum': 1004
        }, {
          'voteNo': '10',
          'voteNum': 1000
        }, {
          'voteNo': '11',
          'voteNum': 1001
        }]);
        //                voteNum.sendRequest()
        //                    .done(function(data) {
        //                        ticketList =  new can.Map(data.infos);
        //                    })
        //                    .fail(function(error) {
        //                        console.error(error);
        //                    })
      }
    });
    new young('body');
    console.log("23");
  })