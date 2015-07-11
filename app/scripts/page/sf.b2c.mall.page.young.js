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
    'sf.b2c.mall.widget.message',
    'sf.b2c.mall.module.getcoupon',
    'sf.b2c.mall.module.slider',
    'sf.b2c.mall.business.config'
  ],
  function(can, $, cookie, VoteNum, Vote, SFFrameworkComm, SFFn, stackslider, SFMessage, SFGetcoupon, Slider, SFBusiness) {

    SFFrameworkComm.register(1);

    SFFn.monitor();

    var ticketList = null;
    var index = 1;
    var defaultNum = 14;

    var defaultCouponid = "100";
    var MESSAGE_CLOSE_TIME = 3000;

    var young = can.Control.extend({
      /**
       * [init 初始化]
       */
      init: function() {

        this.drawOubaVote();

        this.getAllTickets();

        this.initCouponStatus();

        this.bindEvent();
      },

      drawOubaVote: function() {
        var that = this;
        $('#st-stack').stackslider({
          "firstCallback": function() {
            index = index > 1 ? index - 1 : index;
            that.initOnePersonInfo();
          },
          "lastCallback": function() {
            index = index > defaultNum ? index : index + 1;
            that.initOnePersonInfo();
          }
        });
      },

      initCouponStatus: function() {
        var obj = $.cookie('clickTimes');
        var currentDate = new Date();
        if (typeof obj == "undefined" || obj == null) {
          $("#getCoupon1").text("扒下欧巴就能领券啦！");
          $("#clickTimes").text(10);
        } else {
          if (parseInt(obj.split("-")[0]) != currentDate.getDate()) {
            $("#getCoupon1").text("扒下欧巴就能领券啦！");
            $("#clickTimes").text(10);
          } else {
            $("#clickTimes").text(parseInt(obj.split("-")[1]));
          }
        }

        var day = currentDate.getDate();
        var coupon1id = this.coupon1Map[day] || defaultCouponid;
        var coupon2id = this.coupon2Map[day] || defaultCouponid;

        $("#getCoupon1").attr("data-cms-couponbagid", coupon1id);
        $("#getCoupon2").attr("data-cms-couponbagid", coupon2id);
      },

      bindEvent: function() {
        this.bindVoteEvent();
      },

      bindVoteEvent: function() {
        var that = this;

        $(".young-coupon .pm  a.btn").click(function() {

          // 如果当天已经投过10次票了，则不要再投票了
          var obj = $.cookie('clickTimes');
          var currentDate = new Date();
          if (typeof obj == "undefined" || obj == null) {

          } else {
            if (parseInt(obj.split("-")[0]) != currentDate.getDate()) {

            } else {
              if (parseInt(obj.split("-")[1]) == 0) {
                return false;
              }
            }
          }

          var params = {
            'voteType': 'XXMAN',
            'voteNo': index
          };
          var voteTicket = new Vote(params);
          voteTicket.sendRequest()
            .done(function(data) {
              ticketList = data.infos;

              // 设定总票数
              $("#totalVoteCount").text(data.voteTotalNum);

              // 获得该小鲜肉的投票数
              var num = that.getTicketCount(index);
              $(".young-slider-r2 span").text(num);
              that.setStep(num);

              // 记录本人投票数到cookie中去
              var clickTimes = $.cookie('clickTimes');
              if (clickTimes && clickTimes.split("-")[1] > 0) {
                $.cookie('clickTimes', clickTimes.split("-")[0] + "-" + (parseInt(clickTimes.split("-")[1]) - 1));
                $("#clickTimes").text(parseInt(clickTimes.split("-")[1]) - 1);
              }

              var message = new SFMessage(null, {
                'tip': that.getRandomAlertInfo(),
                'type': 'success',
                'closeTime': MESSAGE_CLOSE_TIME
              });

            })
            .fail(function(error) {
              console.error(error);
            })
        });
      },

      // 获得随机信息
      getRandomAlertInfo: function() {
        var map = {
          "0": "哎呀，欧巴还差一点就脱了，继续扒！",
          "1": "欧巴就要脱了！叫上闺蜜一起来！人多扒的快",
          "2": "欧巴的衣服很脆弱，继续扒！根本停不下来！"
        };
        var random = Math.random().toString(3).substr(2, 1);
        return map[random];
      },

      getAllTickets: function() {
        var that = this;

        var getVoteNum = new VoteNum({
          "voteType": "XXMAN"
        });
        getVoteNum.sendRequest()
          .done(function(data) {
            ticketList = data.infos;

            data.voteTotalNum = data.voteTotalNum.toString();
            if (data.voteTotalNum.length == 1) {
              data.voteTotalNum = "000000" + data.voteTotalNum;
            } else if (data.voteTotalNum.length == 2) {
              data.voteTotalNum = "00000" + data.voteTotalNum;
            } else if (data.voteTotalNum.length == 3) {
              data.voteTotalNum = "0000" + data.voteTotalNum;
            } else if (data.voteTotalNum.length == 4) {
              data.voteTotalNum = "000" + data.voteTotalNum;
            } else if (data.voteTotalNum.length == 5) {
              data.voteTotalNum = "00" + data.voteTotalNum;
            } else if (data.voteTotalNum.length == 6) {
              data.voteTotalNum = "0" + data.voteTotalNum;
            }
            $(".young-time-inner").text(data.voteTotalNum);
            that.initOnePersonInfo();
          })
          .fail(function(error) {
            console.error(error)
          })

      },

      initOnePersonInfo: function() {

        var num = this.getTicketCount(index);
        $(".young-slider-r2 span").text(num);
        this.setStep(num);
      },

      //根据序号获取小鲜肉的投票数
      getTicketCount: function(index) {
        var result = 0;
        _.each(ticketList, function(item) {
          if (parseInt(item.voteNo) == index) {
            result = item.voteNum;
          }
        })
        return result;
      },

      photoMap: {
        "1": {
          "1": "/img/young/photo/1/1.jpg",
          "2": "/img/young/photo/1/2.jpg",
          "3": "/img/young/photo/1/3.jpg",
          "4": "/img/young/photo/1/4.jpg"
        },
        "2": {
          "1": "/img/young/photo/2/1.jpg",
          "2": "/img/young/photo/2/2.jpg",
          "3": "/img/young/photo/2/3.jpg",
          "4": "/img/young/photo/2/4.jpg"
        },
        "3": {
          "1": "/img/young/photo/3/1.jpg",
          "2": "/img/young/photo/3/2.jpg",
          "3": "/img/young/photo/3/3.jpg",
          "4": "/img/young/photo/3/4.jpg"
        },
        "4": {
          "1": "/img/young/photo/4/1.jpg",
          "2": "/img/young/photo/4/2.jpg",
          "3": "/img/young/photo/4/3.jpg",
          "4": "/img/young/photo/4/4.jpg"
        },
        "5": {
          "1": "/img/young/photo/5/1.jpg",
          "2": "/img/young/photo/5/2.jpg",
          "3": "/img/young/photo/5/3.jpg",
          "4": "/img/young/photo5/4.jpg"
        },
        "6": {
          "1": "/img/young/photo/6/1.jpg",
          "2": "/img/young/photo/6/2.jpg",
          "3": "/img/young/photo/6/3.jpg",
          "4": "/img/young/photo/6/4.jpg"
        },
        "7": {
          "1": "/img/young/photo/7/1.jpg",
          "2": "/img/young/photo/7/2.jpg",
          "3": "/img/young/photo/7/3.jpg",
          "4": "/img/young/photo/7/4.jpg"
        },
        "8": {
          "1": "/img/young/photo/8/1.jpg",
          "2": "/img/young/photo/8/2.jpg",
          "3": "/img/young/photo/8/3.jpg",
          "4": "/img/young/photo/8/4.jpg"
        },
        "9": {
          "1": "/img/young/photo/9/1.jpg",
          "2": "/img/young/photo/9/2.jpg",
          "3": "/img/young/photo/9/3.jpg",
          "4": "/img/young/photo/9/4.jpg"
        },
        "10": {
          "1": "/img/young/photo/10/1.jpg",
          "2": "/img/young/photo/10/2.jpg",
          "3": "/img/young/photo/10/3.jpg",
          "4": "/img/young/photo/10/4.jpg"
        },
        "11": {
          "1": "/img/young/photo/11/1.jpg",
          "2": "/img/young/photo/11/2.jpg",
          "3": "/img/young/photo/11/3.jpg",
          "4": "/img/young/photo/11/4.jpg"
        }
      },

      coupon1Map: {
        "13": '1',
        "14": '2',
        "15": '3',
        "16": '4',
        "17": '5',
        "18": '6',
        "19": '7',
        "20": '8'
      },

      coupon2Map: {
        "13": '1',
        "14": '2',
        "15": '3',
        "16": '4',
        "17": '5',
        "18": '6',
        "19": '7',
        "20": '8'
      },

      setStep: function(num) {
        if (num < 60000) {
          $("#step1").addClass("active");
          $("#step2").removeClass("active");
          $("#step3").removeClass("active");
          $("#step4").removeClass("active");
          $("#stepline")[0].style.width = "25%";
          $($(".st-item")[index]).find('img').attr("src", this.photoMap[index][1]);
        } else if (60000 <= num && num < 80000) {
          $("#step1").addClass("active");
          $("#step2").addClass("active");
          $("#step3").removeClass("active");
          $("#step4").removeClass("active");
          $("#stepline")[0].style.width = "50%";
          $($(".st-item")[index]).find('img').attr("src", this.photoMap[index][2]);
        } else if (80000 <= num && num < 200000) {
          $("#step1").addClass("active");
          $("#step2").addClass("active");
          $("#step3").addClass("active");
          $("#step4").removeClass("active");
          $("#stepline")[0].style.width = "75%";
          $($(".st-item")[index]).find('img').attr("src", this.photoMap[index][3]);
        } else if (200000 <= num) {
          $("#step1").addClass("active");
          $("#step2").addClass("active");
          $("#step3").addClass("active");
          $("#step4").addClass("active");
          $("#stepline")[0].style.width = "100%";
          $($(".st-item")[index]).find('img').attr("src", this.photoMap[index][4]);
        }
      }
    });
    new young('body');
  })