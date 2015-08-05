$(function(){
  //评分
  $.fn.raty.defaults.path = 'lib/raty/lib/images';
  $('.rating').raty({ readOnly: true,score: 5 });
  
  //切换
  $('.detail-tab-h li').click(function(){
    var index=$('.detail-tab-h li').index(this);
    $(this).addClass('active').siblings().removeClass('active');
    $('.detail-tab-b').eq(index).addClass('active').siblings().removeClass('active');
  })
  
  $('.comment-tab li').click(function(){
    $(this).addClass('active').siblings().removeClass('active');
  })
  
  new CommentImg();
  
  //评论图片交互
  function CommentImg(){
    var that=this;
    that.index=0;
    
    that.checkBtn=function(){
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
    }
    
    //图片放大
    $('.comment-img li').click(function(){
      that.smallImg=$(this).parents('.comment-img');
      that.bigImg=that.smallImg.siblings('.comment-img-big');
      that.num=that.smallImg.find('li').length;
      that.index=that.smallImg.find('li').index(this);
      $(this).toggleClass('active').siblings().removeClass('active');
      that.bigImg.find('li').eq(that.index).toggleClass('active').siblings().removeClass('active');
      if($(this).hasClass('active')){
        that.bigImg.find('a').show();
      }else{
        that.bigImg.find('a').hide();
      }
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
    
})