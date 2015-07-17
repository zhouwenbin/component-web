$(function(){
  //文字滚动
  setInterval(scroll,3000);
  function scroll(){
  	$(".m81-info ul").animate({
	  	top:-36
	},300,function(){
		$('.m81-info li').eq(0).appendTo('.m81-info ul');
		$(".m81-info ul").css({
			top:0
		})
	});
  }
  //时间倒计时
  var target_day=27;
  var date = new Date();
  var current_day=date.getDate();
  var last_day=target_day-current_day;
  $('.m81-day').text(last_day);
  //播放视频
  $('.m81-play').click(function(){
  	$('.m81-video').show();
  	return false;
  })
  $('html').click(function(){
  	$('.m81-video').hide();
  })
})