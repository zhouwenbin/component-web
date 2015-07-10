$(function(){
  	var people_num=$('.people>li').length;
  	//----------slider-------------//
    var sliderIndex=0;
    var sliderImg=$(".slider-img li");
    var sliderLength=sliderImg.length;
    var sliderPrev=$(".slider .btn-prev");
    var sliderNext=$(".slider .btn-next");
    var sliderLi="";
    sliderImg.eq(0).addClass('active');
    for(var i = 0; i < sliderLength; i++){
       sliderLi += '<li><a href="###"></a></li>'
    }
    $(".slider-num").append(sliderLi);
    var sliderNum=$(".slider-num li");
    sliderNum.eq(0).addClass("active");


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
	//tab切换
	$('.tab li').click(function(){
		var tab_index=$('.tab li').index(this);
		var people_index=people_num-sliderIndex;
		var photo_index=tab_index+1;
		$('.people>li').eq(people_num-1-sliderIndex).find('img').attr('src','../img/young/photo/'+people_index+'/'+photo_index+'.jpg');
		$(this).addClass('active').siblings().removeClass('active');
		if($(this).hasClass('tab-lock')){
			$('.people>li').eq(people_num-1-sliderIndex).find('.people-lock').show();
		}else{
			$('.people>li').eq(people_num-1-sliderIndex).find('.people-lock').hide();
		}
	})


	$('.young-tab-h li').click(function(){
	    var index = $('.young-tab-h li').index(this);
	    $(this).addClass('active').siblings().removeClass('active');
	    $('.young-tab-b>li').eq(index).addClass('active').siblings().removeClass('active');
	  })
})