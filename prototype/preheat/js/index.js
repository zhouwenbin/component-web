$(function(){
	//----------回到顶部-------------//
	$(window).scroll(function(){
		if($(window).scrollTop() > 300){
			$(".m1").stop(true,false).animate({
				"height":522
			},700);
		}else{
			$(".m1").stop(true,false).animate({
				"height":0
			},700);
		}
	});
	//----------倒计时-------------//
	$("#time").countdown({
        "date" : "july 30, 2011"
    });
})