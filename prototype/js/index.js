$(function(){
	var sliderIndex=0;
	var sliderImg=$(".slider-img li");
	var sliderLength=sliderImg.length;
	var sliderPrev=$(".slider .btn-prev");
	var sliderNext=$(".slider .btn-next");
	var sliderLi="";
	var silderTimer=setInterval(sliderNexting,5000);
	for(var i = 0; i < sliderLength; i++){
	   sliderLi += '<li><a href="###"></a></li>'
	}
	$('.slider-num').append(sliderLi);
	var sliderNum=$(".slider-num li");
	sliderNum.eq(0).addClass("active");
	

	//左右按钮hover
	$(".slider").hover(function(){
		sliderPrev.stop(true,false).animate({
			left : 0,
			opacity : 1
		},500);
		sliderNext.stop(true,false).animate({
			right : 0,
			opacity : 1
		},500);
		clearInterval(silderTimer);
	},function(){
		sliderPrev.stop(true,false).animate({
			left : "-50px",
			opacity : 0
		},500);
		sliderNext.stop(true,false).animate({
			right : "-50px",
			opacity : 0
		},500);
		silderTimer=setInterval(sliderNexting,5000);
	})

	//向前按钮click
	sliderPrev.click(function(){		
		sliderPreving();
	})
	//向后按钮click
	sliderNext.click(function(){
		sliderNexting()	
	})

	//数字click
	sliderNum.click(function(){
		sliderIndex = sliderNum.index(this);
		sliderSwitch();
		clearInterval(silderTimer);
	})

	
	//向前
	function sliderPreving(){
		sliderIndex--;
		if(sliderIndex < 0){
			sliderIndex = sliderLength-1;
		}
		sliderSwitch();
	}
	//向后
	function sliderNexting(){
		sliderIndex++;
		if(sliderIndex > sliderLength-1){
			sliderIndex = 0;
		}
		sliderSwitch();
	}
	//状态切换
	function sliderSwitch(){
		sliderNum.removeClass('active').eq(sliderIndex).addClass("active");
		sliderImg.removeClass('active').eq(sliderIndex).addClass("active");
	}



	//回到顶部
	$(window).scroll(function(){
		if($(window).scrollTop() > 600){
			$('.btn-top').fadeIn(500);
		}else{
			$('.btn-top').fadeOut(500);
		}
	})

	$(".btn-top").click(function(){  
        $('body,html').animate({scrollTop:0},1000);  
        return false;  
    });  
})