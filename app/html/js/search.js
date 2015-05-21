$(function(){
	//更多
  $('#classify').on('click','#classify-more',function(){
  	$(this).parents('li').toggleClass('active');
  })
  //取消选择
  $('#classify').on('click','.btn-search-close',function(){
  	$('.classify-list>li').show();
  	$('.classify-select').hide();
  	$(this).parents('.btn-search').remove();

  })
  //选择品牌
  $('#classify').on('click','#classify-logo li',function(){
  	$('.classify-select').show();
  	$('#classify-logo').parents('li').hide();
  	var brand_name=$(this).find('img').attr('alt');
  	$('#classify-select').append('<li><a class="btn-search" href="javascript:">品牌：<strong>'+brand_name+'</strong><span class="btn-search-close"></span></a></li>')
  })
  $('#classify').on('click','.classify-text a',function(){
  	$('.classify-select').show();
  	$(this).parents('.classify-text').hide();
  	var text=$(this).text();
  	var label=$(this).parents('.classify-text').find('label').text();
  	$('#classify-select').append('<li><a class="btn-search" href="javascript:">'+label+'<strong>'+text+'</strong><span class="btn-search-close"></span></a></li>')
  })
})