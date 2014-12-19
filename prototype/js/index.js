$(function(){
	//----------slider-------------//
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
	$(".slider-num").append(sliderLi);
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
		sliderNum.removeClass("active").eq(sliderIndex).addClass("active");
		sliderImg.removeClass("active").eq(sliderIndex).addClass("active");
	}



	//----------回到顶部-------------//
	$(window).scroll(function(){
		if($(window).scrollTop() > 600){
			$(".btn-top").fadeIn(500);
		}else{
			$(".btn-top").fadeOut(500);
		}
	})

	$(".btn-top").click(function(){  
        $("body,html").animate({scrollTop:0},1000);  
        return false;  
    }); 


    //----------限时特卖切换-------------// 
    $(".product-tab li").click(function(){
    	$(this).addClass("active").siblings().removeClass("active");
    	var index = $(".product-tab li").index(this);
    	$("#product-mb").animate({
    		left:-100 * index + "%"
    	},500);
    	return false;
    })


    //----------数量按钮-------------// 
    $(".btn-num").on("click",".btn-num-add",function(){
    	var input = $(this).siblings("input")
    	var value = input.val();
    	if(value < 2){
    		value ++;
    	}
    	input.val(value);
    	return false;
    })
    $(".btn-num").on("click",".btn-num-reduce",function(){
    	var input = $(this).siblings("input")
    	var value = input.val();
    	if(value > 0){
    		value --;
    	}
    	input.val(value);
    	return false;
    })
    //----------商品颜色-------------// 
    $('.btn-goods:not(".disable")').on("click",function(){
    	$(this).addClass("active").siblings().removeClass("active");
    });
    //----------select模拟-------------// 
    $(".btn-select").on("click",function(){
    	if($(this).hasClass("active")){
    		$(this).removeClass("active");
    		$(this).find("ul").hide();
    	}else{
    		$(this).addClass("active");
    		$(this).find("ul").show();
    	}
    });
    $(".btn-select").on("click","label",function(){
    	$(this).parents(".btn-select").removeClass("active");
    	var value=$(this).text();
    	$(".btn-select-num").text(value);
    	$(".btn-select ul").hide();
    	return false;
    })
    //----------商品图片切换-------------// 
    $(".goods-c1r2 li").on("click",function(){
    	$(this).addClass("active").siblings().removeClass("active");
    	var index = $(".goods-c1r2 li").index(this);
    	$(".goods-c1r1 li").eq(index).addClass("active").siblings().removeClass("active");
    	return false;
    })

    //----------注册切换-------------// 
    $(".register-h li").on("click",function(){
    	var index=$(".register-h li").index(this);
    	$(this).addClass("active").siblings().removeClass("active");
    	$(".register-b").eq(index).addClass("active").siblings().removeClass("active");
    	return false;
    })
    //----------关闭注册弹窗-------------//
    $(".register .btn-close").on("click",function(){
    	$(this).parents(".register").hide(300);
    	$(".mask").hide();
    	return false;
    }) 
    //----------品牌选择-------------//
    $(".btn-brand").on("click",function(){
    	$(this).toggleClass("active");
    	return false;
    });
})