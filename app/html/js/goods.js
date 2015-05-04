$(function(){
  $('.goods-activity').click(function(){
  	$(this).toggleClass('active');
  	var active = $(this).hasClass('active');
  	var $text = $(this).find('.goods-activity-text');
  	var $info = $(this).find('.goods-activity-info');
  	if(active){
  		$text.text('收起');
  		$info.text('共2条 优惠信息')
  	}else{
  		$text.text('更多优惠');
  		$info.html('买一送一活动 <a class="goods-activity-link" href="#">去看看</a>')

  	}
  })
})