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
    'sf.b2c.mall.widget.slide',
    'sf.b2c.mall.business.config'
  ],
  function(can, $, cookie, VoteNum, Vote, SFFrameworkComm, SFFn, stackslider, SFMessage, SFGetcoupon, Slider, SFBusiness) {

    SFFrameworkComm.register(1);

    SFFn.monitor();

    var ticketList = null;
    var index = 1;
    var defaultNum = 14;
    var freshNum = 11;

    var defaultCouponid = "100";
    var MESSAGE_CLOSE_TIME = 3000;

    var young = can.Control.extend({
      /**
       * [init 初始化]
       */
      init: function() {
        var that = this;
        //无缝滚动
        new Slider($(".cms-module-slider"), {
          "preCallback": function() {
            index = index > 1 ? index - 1 : index;
            that.initOnePersonInfo();
          },
          "nextCallback": function() {
            index = index > defaultNum ? index : index + 1;
            that.initOnePersonInfo();
          }
        })

        this.getAllTickets();

        this.initCouponStatus();
        $("#getCoupon1").removeClass("disabled");
        $("#getCoupon1").text("点我领券");

        this.bindEvent();
      },

      initCouponStatus: function() {
        var obj = $.cookie('clickTimes');
        var currentDate = new Date();
        // if (typeof obj == "undefined" || obj == null) {
        //   $("#getCoupon1").text("扒下欧巴就能领券啦！");
        //   $("#getCoupon1").addClass("disabled");
        //   $("#clickTimes").text(10);
        // } else {
        //   if (parseInt(obj.split("-")[0]) != currentDate.getDate()) {
        //     $("#getCoupon1").text("扒下欧巴就能领券啦！");
        //     $("#getCoupon1").addClass("disabled");
        //     $("#clickTimes").text(10);
        //   } else {
        //     $("#clickTimes").text(parseInt(obj.split("-")[1]));
        //     if (parseInt(obj.split("-")[1]) == 0) {
        //       $("#voteTA").addClass("disabled");
        //     }
        //   }
        // }

        var day = currentDate.getDate();
        var coupon1id = this.coupon1Map[day] || defaultCouponid;
        var coupon2id = this.coupon2Map[day] || defaultCouponid;

        $("#getCoupon1").attr("data-cms-couponbagid", coupon1id);
        // $("#getCoupon2").attr("data-cms-couponbagid", coupon2id);
      },

      bindEvent: function() {
        this.bindVoteEvent();
        this.bindPreNextEvent();
        this.bindTabEvent();
      },

      bindTabEvent: function() {
        var that = this;
        //tab切换
        $('.tab li').click(function() {
          var tab_index = $('.tab li').index(this);

          var liIndex = index - 1;
          $('#people>li').eq(liIndex).find('img').attr('src', that.photoMap[index][tab_index + 1]);
          $(this).addClass('active').siblings().removeClass('active');

          if ($(this)[0].id == "step2") {
            $('#people>li').eq(liIndex).find("p").text("被扒100,000次就看到啦！");
          } else if ($(this)[0].id == "step3") {
            $('#people>li').eq(liIndex).find("p").text("被扒150,000次就看到啦！");
          }
          if ($(this)[0].id == "step4") {
            $('#people>li').eq(liIndex).find("p").text("被扒300,000次就看到啦！");
          }

          if ($(this).find("span").hasClass('lock')) {

            $('#people>li').eq(liIndex).find('.mask').addClass("show");
            $('#people>li').eq(liIndex).find('img').addClass('blur');
          } else {

            $('#people>li').eq(liIndex).find('.mask').removeClass("show");
            $('#people>li').eq(liIndex).find('img').removeClass('blur');
          }
        })
      },

      //锁的文案
      textMap: {
        "1": "被扒1,000,00次就看到啦！",
        "2": "被扒1,500,00次就看到啦！",
        "3": "被扒3,000,00次就看到啦！"
      },

      bindPreNextEvent: function() {
        var that = this;

        // $(".btn-prev").on("click", function() {
        //   index = index > 1 ? index - 1 : index;
        //   that.initOnePersonInfo();
        // });

        // $(".btn-next").on("click", function() {
        //   index = index > defaultNum ? index : index + 1;
        //   that.initOnePersonInfo();
        // });
      },

      bindVoteEvent: function() {
        var that = this;

        $("#voteTA").click(function() {

          // 如果当天已经投过10次票了，则不要再投票了
          var obj = $.cookie('clickTimes');
          var currentDate = new Date();
          if (typeof obj == "undefined" || obj == null) {

          } else {
            if (parseInt(obj.split("-")[0]) != currentDate.getDate()) {

            } else {
              if (parseInt(obj.split("-")[1]) == 0) {
                $("#voteTA").addClass("disabled");
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
         //     ticketList = data.infos;

              data.voteTotalNum = that.addPrefix4VoteNum(data.voteTotalNum);

              // 设定总票数
              $("#totalVoteCount").text(data.voteTotalNum);

              // 获得该小鲜肉的投票数
              $(".young-slider-r2 span").text(data.infos[0].voteNum);
              that.setStep(data.infos[0].voteNum);

              // 记录本人投票数到cookie中去
              var clickTimes = $.cookie('clickTimes');
              if (clickTimes && clickTimes.split("-")[1] > 0) {
                if (clickTimes.split("-")[1] == 1) {
                  $("#voteTA").addClass("disabled");
                }
                $.cookie('clickTimes', clickTimes.split("-")[0] + "-" + (parseInt(clickTimes.split("-")[1]) - 1));
                $("#clickTimes").text(parseInt(clickTimes.split("-")[1]) - 1);
              } else {
                $.cookie('clickTimes', new Date().getDate() + "-" + 9);
                $("#clickTimes").text(9);
              }

              var $el = $('<div class="dialog-cart" style="z-index:9999;"><div class="dialog-cart-inner" style="width:242px;padding:20px 60px;"><p style="margin-bottom:10px;">' + that.getRandomAlertInfo() + '</p></div><a href="javascript:" class="icon icon108 closeDialog">关闭</a></div>');

              $(document.body).append($el);
              $('.closeDialog').click(function(event) {
                $el.remove();
              });
              setTimeout(function() {
                $el.remove();
              }, 3000);

              if ($("#getCoupon1").hasClass("disabled")) {
                $("#getCoupon1").removeClass("disabled");
                $("#getCoupon1").text("点我领券");
              }

              // var message = new SFMessage(null, {
              //   'tip': that.getRandomAlertInfo(),
              //   'type': 'success',
              //   'closeTime': MESSAGE_CLOSE_TIME
              // });

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

            data.voteTotalNum = that.addPrefix4VoteNum(data.voteTotalNum);

            $(".young-time-inner").text(data.voteTotalNum);
            that.initOnePersonInfo();
          })
          .fail(function(error) {
            console.error(error)
          })

      },


      addPrefix4VoteNum: function(num){
        num = num.toString();
        if (num.length == 1) {
              num = "000000" + num;
            } else if (num.length == 2) {
              num = "00000" + num;
            } else if (num.length == 3) {
              num = "0000" + num;
            } else if (num.length == 4) {
              num = "000" + num;
            } else if (num.length == 5) {
              num = "00" + num;
            } else if (num.length == 6) {
              num = "0" + num;
            }

            return num;
      },

      initOnePersonInfo: function() {

        var num = this.getTicketCount(index);
        $(".young-slider-r2 span").text(num);
        $('#people>li').eq(index - 1).find('.mask').removeClass("show");
        //var num = 300001;
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
          "1": "http://img.sfht.com/sfht/1.1.148/img/young/photo/1/1.jpg",
          "2": "http://img.sfht.com/sfht/1.1.148/img/young/photo/1/2.jpg",
          "3": "http://img.sfht.com/sfht/1.1.148/img/young/photo/1/3.jpg",
          "4": "http://img.sfht.com/sfht/1.1.148/img/young/photo/1/4.jpg"
        },
        "2": {
          "1": "http://img.sfht.com/sfht/1.1.148/img/young/photo/2/1.jpg",
          "2": "http://img.sfht.com/sfht/1.1.148/img/young/photo/2/2.jpg",
          "3": "http://img.sfht.com/sfht/1.1.148/img/young/photo/2/3.jpg",
          "4": "http://img.sfht.com/sfht/1.1.148/img/young/photo/2/4.jpg"
        },
        "3": {
          "1": "http://img.sfht.com/sfht/1.1.148/img/young/photo/3/1.jpg",
          "2": "http://img.sfht.com/sfht/1.1.148/img/young/photo/3/2.jpg",
          "3": "http://img.sfht.com/sfht/1.1.148/img/young/photo/3/3.jpg",
          "4": "http://img.sfht.com/sfht/1.1.148/img/young/photo/3/4.jpg"
        },
        "4": {
          "1": "http://img.sfht.com/sfht/1.1.148/img/young/photo/4/1.jpg",
          "2": "http://img.sfht.com/sfht/1.1.148/img/young/photo/4/2.jpg",
          "3": "http://img.sfht.com/sfht/1.1.148/img/young/photo/4/3.jpg",
          "4": "http://img.sfht.com/sfht/1.1.148/img/young/photo/4/4.jpg"
        },
        "5": {
          "1": "http://img.sfht.com/sfht/1.1.148/img/young/photo/5/1.jpg",
          "2": "http://img.sfht.com/sfht/1.1.148/img/young/photo/5/2.jpg",
          "3": "http://img.sfht.com/sfht/1.1.148/img/young/photo/5/3.jpg",
          "4": "http://img.sfht.com/sfht/1.1.148/img/young/photo/5/4.jpg"
        },
        "6": {
          "1": "http://img.sfht.com/sfht/1.1.148/img/young/photo/6/1.jpg",
          "2": "http://img.sfht.com/sfht/1.1.148/img/young/photo/6/2.jpg",
          "3": "http://img.sfht.com/sfht/1.1.148/img/young/photo/6/3.jpg",
          "4": "http://img.sfht.com/sfht/1.1.148/img/young/photo/6/4.jpg"
        },
        "7": {
          "1": "http://img.sfht.com/sfht/1.1.148/img/young/photo/7/1.jpg",
          "2": "http://img.sfht.com/sfht/1.1.148/img/young/photo/7/2.jpg",
          "3": "http://img.sfht.com/sfht/1.1.148/img/young/photo/7/3.jpg",
          "4": "http://img.sfht.com/sfht/1.1.148/img/young/photo/7/4.jpg"
        },
        "8": {
          "1": "http://img.sfht.com/sfht/1.1.148/img/young/photo/8/1.jpg",
          "2": "http://img.sfht.com/sfht/1.1.148/img/young/photo/8/2.jpg",
          "3": "http://img.sfht.com/sfht/1.1.148/img/young/photo/8/3.jpg",
          "4": "http://img.sfht.com/sfht/1.1.148/img/young/photo/8/4.jpg"
        },
        "9": {
          "1": "http://img.sfht.com/sfht/1.1.148/img/young/photo/9/1.jpg",
          "2": "http://img.sfht.com/sfht/1.1.148/img/young/photo/9/2.jpg",
          "3": "http://img.sfht.com/sfht/1.1.148/img/young/photo/9/3.jpg",
          "4": "http://img.sfht.com/sfht/1.1.148/img/young/photo/9/4.jpg"
        },
        "10": {
          "1": "http://img.sfht.com/sfht/1.1.148/img/young/photo/10/1.jpg",
          "2": "http://img.sfht.com/sfht/1.1.148/img/young/photo/10/2.jpg",
          "3": "http://img.sfht.com/sfht/1.1.148/img/young/photo/10/3.jpg",
          "4": "http://img.sfht.com/sfht/1.1.148/img/young/photo/10/4.jpg"
        },
        "11": {
          "1": "http://img.sfht.com/sfht/1.1.148/img/young/photo/11/1.jpg",
          "2": "http://img.sfht.com/sfht/1.1.148/img/young/photo/11/2.jpg",
          "3": "http://img.sfht.com/sfht/1.1.148/img/young/photo/11/3.jpg",
          "4": "http://img.sfht.com/sfht/1.1.148/img/young/photo/11/4.jpg"
        },
        "12": {
          "1": "http://img.sfht.com/sfht/1.1.148/img/young/photo/12/1.jpg",
          "2": "http://img.sfht.com/sfht/1.1.148/img/young/photo/12/2.jpg",
          "3": "http://img.sfht.com/sfht/1.1.148/img/young/photo/12/3.jpg",
          "4": "http://img.sfht.com/sfht/1.1.148/img/young/photo/12/4.jpg"
        },
        "13": {
          "1": "http://img.sfht.com/sfht/1.1.148/img/young/photo/13/1.jpg",
          "2": "http://img.sfht.com/sfht/1.1.148/img/young/photo/13/2.jpg",
          "3": "http://img.sfht.com/sfht/1.1.148/img/young/photo/13/3.jpg",
          "4": "http://img.sfht.com/sfht/1.1.148/img/young/photo/13/4.jpg"
        },
        "14": {
          "1": "http://img.sfht.com/sfht/1.1.148/img/young/photo/14/1.jpg",
          "2": "http://img.sfht.com/sfht/1.1.148/img/young/photo/14/2.jpg",
          "3": "http://img.sfht.com/sfht/1.1.148/img/young/photo/14/3.jpg",
          "4": "http://img.sfht.com/sfht/1.1.148/img/young/photo/14/4.jpg"
        },
        "15": {
          "1": "http://img.sfht.com/sfht/1.1.148/img/young/photo/15/1.jpg",
          "2": "http://img.sfht.com/sfht/1.1.148/img/young/photo/15/2.jpg",
          "3": "http://img.sfht.com/sfht/1.1.148/img/young/photo/15/3.jpg",
          "4": "http://img.sfht.com/sfht/1.1.148/img/young/photo/15/4.jpg"
        }
      },

      coupon1Map: {
        "13": '289',
        "14": '290',
        "15": '291',
        "16": '292',
        "17": '293',
        "18": '294',
        "19": '295',
        "20": '296'
      },

      coupon2Map: {
        "13": '289',
        "14": '290',
        "15": '291',
        "16": '292',
        "17": '293',
        "18": '294',
        "19": '295',
        "20": '296'
      },

      setStep: function(num) {
        if (num < 100000) {

          $("#step1").addClass("active").siblings('li').removeClass('active');
          $('.tab li').find('span').removeClass("lock");
          // $('.tab li').eq(0).find('span').addClass("unlock").removeClass('lock');
          $("#step1").find("span").addClass("unlock");
          $("#step2").find("span").addClass("lock");
          $("#step3").find("span").addClass("lock");
          $("#step4").find("span").addClass("lock");

          // $($(".st-item")[index]).find('img').attr("src", this.photoMap[index][1]);
          $('#people>li').eq(index - 1).find('img').attr("src", this.photoMap[index][1]);
        } else if (100000 <= num && num < 150000) {
          $("#step2").addClass("active").siblings('li').removeClass('active');

          // $("#step1").removeClass("active");
          // $("#step2").addClass("active");
          // $("#step3").removeClass("active");
          // $("#step4").removeClass("active");


          $('.tab li').find('span').removeClass("lock");
          $("#step1").find("span").addClass("unlock");
          $("#step2").find("span").addClass("unlock");
          $("#step3").find("span").addClass("lock");
          $("#step4").find("span").addClass("lock");

          //$($(".st-item")[index]).find('img').attr("src", this.photoMap[index][2]);
          $('#people>li').eq(index - 1).find('img').attr("src", this.photoMap[index][2]);
        } else if (150000 <= num && num < 300000) {
          $("#step3").addClass("active").siblings('li').removeClass('active');
          // $("#step1").removeClass("active");
          // $("#step2").removeClass("active");
          // $("#step3").addClass("active");
          // $("#step4").removeClass("active");
          $('.tab li').find('span').removeClass("lock");
          $("#step1").find("span").addClass("unlock");
          $("#step2").find("span").addClass("unlock");
          $("#step3").find("span").addClass("unlock");
          $("#step4").find("span").addClass("lock");

          $('#people>li').eq(index - 1).find('img').attr("src", this.photoMap[index][3]);
        } else if (300000 <= num) {
          $("#step4").addClass("active").siblings('li').removeClass('active');

          // $("#step1").removeClass("active");
          // $("#step2").removeClass("active");
          // $("#step3").removeClass("active");
          // $("#step4").addClass("active");
          $('.tab li').find('span').removeClass("lock");
          $("#step1").find("span").addClass("unlock");
          $("#step2").find("span").addClass("unlock");
          $("#step3").find("span").addClass("unlock");
          $("#step4").find("span").addClass("unlock");

          $('#people>li').eq(index - 1).find('img').attr("src", this.photoMap[index][4]);
        }
      }
    });
    new young('body');
  })