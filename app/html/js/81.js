$(function(){
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
})