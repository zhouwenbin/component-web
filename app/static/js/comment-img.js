//评论图片交互
  function CommentImg(){
    var that=this;
    that.index=0;
    
    that.checkBtn=function(){
      if(that.bigImg.find('li').hasClass('active')){
        that.bigImg.find('a').show();
        if(that.index==0){
          that.bigImg.find('.comment-img-big-prev').hide();
        }else{
          that.bigImg.find('.comment-img-big-prev').show();
        }
        if(that.index==that.num-1){
          that.bigImg.find('.comment-img-big-next').hide();
        }else{
          that.bigImg.find('.comment-img-big-next').show();
        }
      }else{
        that.bigImg.find('a').hide();
      }
        
    }
    
    //图片放大
    $('.comment-img li').click(function(){
      that.smallImg=$(this).parents('.comment-img');
      that.bigImg=that.smallImg.siblings('.comment-img-big');
      that.num=that.smallImg.find('li').length;
      that.index=that.smallImg.find('li').index(this);
      $(this).toggleClass('active').siblings().removeClass('active');
      that.bigImg.find('li').eq(that.index).toggleClass('active').siblings().removeClass('active');
      
      that.checkBtn();
    });
    
    //图片缩小
    $('.comment-img-big li').click(function(){
      that.smallImg.find('li').removeClass('active');
      that.bigImg.find('li').removeClass('active');
      that.bigImg.find('a').hide();
    });
    
    //向前
    $('.comment-img-big-prev').click(function(){
      that.index--;
      that.smallImg.find('li').eq(that.index).addClass('active').siblings().removeClass('active');
      that.bigImg.find('li').eq(that.index).addClass('active').siblings().removeClass('active');
      that.checkBtn();
    })

    //向后
    $('.comment-img-big-next').click(function(){
      that.index++;
      that.smallImg.find('li').eq(that.index).addClass('active').siblings().removeClass('active');
      that.bigImg.find('li').eq(that.index).addClass('active').siblings().removeClass('active');
      that.checkBtn();
    })
  }