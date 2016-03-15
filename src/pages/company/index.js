define(['jquery'], function ($){
	setInterval(function(){
		$('.company-pic-list').animate({
			'left':'-666px'
		},500,function(){
			$('.company-pic-list li:first-child').appendTo('.company-pic-list');
			$('.company-pic-list').css({
				'left':'0'
			})
		})
	},5000)
})
	