define(['jquery'], function ($){
	function imgScroll(){
		$('.company-pic-list').animate({
			'left':'-628px'
		},500,function(){
			$('.company-pic-list li:first-child').appendTo('.company-pic-list');
			$('.company-pic-list').css({
				'left':'0'
			})
		})
	}
	imgScroll();
	setInterval(imgScroll,5000);
})
	