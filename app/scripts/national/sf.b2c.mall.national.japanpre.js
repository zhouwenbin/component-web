'use strict';

define('sf.b2c.mall.national.japanpre', 
  [
  	'text', 
  	'can'
	], 
	function(text, can) {
	  return can.Control.extend({

	    init: function(element, options) {
	    	this.initCarousel();
	    },

	    render: function () {
	    },

	    initCarousel: function() {
	    	var thumbList = $(".japan-video-list-pic-list");

	    	$(".japan-video-box").on("click", ".up", function() {
	    		var top = getTop();
	    		if (top === 0) {
	    			return;
	    		}
	    		thumbList.animate({
	    			top: top - 66
	    		})
	    		return false;
	    	})
	    	.on("click", ".down", function() {

	    		var top = getTop();
	    		if (top === 0) {
	    			return;
	    		}
	    		thumbList.animate({
	    			top: top + 66
	    		})
	    		return false;
	    	});

	    	$(".japan-video-box .japan-video-list-pic-list").on("click", "li", function() {
	    		$(this).siblings(".active").removeClass("active");
	    		$(this).addClass("active");
	    		var imgSrc = $(this).find("img").attr("src");
	    		$(".japan-video-list:visible img").attr("src", imgSrc);
	    	});


	    	var getTop = function() {
					var top = thumbList.css("top");
	    		if (top == "auto") {
	    			top = 0;
	    		} else {
	    			top = top.substr(0, top.length - 2);
	    		}
	    		
	    		return Number.parseInt(top, 10);
	    	};
	    },
  	});
});