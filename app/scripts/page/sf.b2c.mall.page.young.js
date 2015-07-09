'use strict';
define(
  'sf.b2c.mall.page.young',
  [
    'can',
    'jquery',
     'jquery.cookie',
     'sf.b2c.mall.api.user.getVoteNum',
     'sf.b2c.mall.api.user.vote',
    'sf.b2c.mall.framework.comm',
    'sf.util',
      'jquery.stackslider',
    'sf.b2c.mall.business.config'
  ],
  function(can, $, cookie, VoteNum, Vote, SFFrameworkComm, SFFn, stackslider, SFBusiness) {
    SFFrameworkComm.register(1);
    SFFn.monitor();
     var ticketList = null ;
      var index = 1;
      var defaultNum = 14;
    var young = can.Control.extend({
      /**
       * [init 初始化]
       */
      init: function() {
          var that = this;
          $( '#st-stack' ).stackslider();
         $(function(){

             if($(".st-wrapper nav span") && $(".st-wrapper nav span").length > 0){
                 //后退
                 $(".st-wrapper nav span")[0].click(function(){
                     index = index > 1? index-1:index;
                     //获取票数
                     that.getTicketCount(index);
                 });

                 //前进
                 $(".st-wrapper nav span")[0].click(function(){
                     index = index > defaultNum? index:index+1;
                     //获取票数
                     that.getTicketCount(index);
                 });
             }

             $('.young-tab-h li').click(function() {
                 var index = $('.young-tab-h li').index(this);
                 $(this).addClass('active').siblings().removeClass('active');
                 $('.young-tab-b>li').eq(index).addClass('active').siblings().removeClass('active');
             });

             var params = {
                 'voteType': 'XXMAN',
                 'voteNo':index
             };

             //投票代码
             $(".pm  a.btn").click(function(){
//                 var clickTimes = $.cookie('clickTimes');
//                 if(clickTimes && clickTimes.split("-")[1] > 0){
//                     $.cookie('clickTimes',  clickTimes.split("-")[0] + "-" + (parseInt(clickTimes.split("-")[1]) -1));
//                     $("#clickTimes").text( parseInt(clickTimes.split("-")[1]) -1 );
//                 }

                 var voteTicket = new Vote(params);
                 voteTicket.sendRequest()
                     .done(function(data) {
                         ticketList = data.infos;
                         $(".young-time-inner").text(data.voteTotalNum);
                         that.getTicketCount(index);
                         var clickTimes = $.cookie('clickTimes');
                         if(clickTimes && clickTimes.split("-")[1] > 0){
                             $.cookie('clickTimes',  clickTimes.split("-")[0] + "-" + (parseInt(clickTimes.split("-")[1]) -1));;
                             $("#clickTimes").text( parseInt(clickTimes.split("-")[1]) -1 );
                         }
                     })
                     .fail(function(error) {
                         console.error(error);
                     })
             });

             //初始化每日可以扒衣的次数
             var obj = $.cookie('clickTimes');
             var currentDate = new Date();
             if(typeof obj == "undefined" || obj == null){
                 var obj =  currentDate.getDate() + "-" + 10;
                 $.cookie('clickTimes', obj);
             }
             else{
                 if(parseInt(obj.split("-")[0]) != currentDate.getDate()){
                     $.cookie('clickTimes',  currentDate.getDate() + "-" + 10);
                 }
                 else{
                     $("#clickTimes").text( parseInt(obj.split("-")[1]));
                 }
             }
         });

      },

        //根据序号获取小鲜肉的投票数
        getTicketCount:function(index){
            for(var i = 0; i < ticketList.length; i++ ){
                if(parseInt(ticketList[i].voteNo) == index){
                    $(".young-slider-r2 span").text(ticketList[i].voteNum);
                }
            }
        },

        //查询票数
        getTicketList: function(){
            var voteNum = new VoteNum({'voteType':'XXMAN'});
            ticketList = new can.Map([{'voteNo':'0','voteNum':1000},{'voteNo':'1','voteNum':1001},{'voteNo':'2','voteNum':1002},{'voteNo':'3','voteNum':1003},{'voteNo':'4','voteNum':1004},
                {'voteNo':'5','voteNum':1000},{'voteNo':'6','voteNum':1001},{'voteNo':'7','voteNum':1002},{'voteNo':'8','voteNum':1003},{'voteNo':'9','voteNum':1004},
                {'voteNo':'10','voteNum':1000},{'voteNo':'11','voteNum':1001}]);
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
