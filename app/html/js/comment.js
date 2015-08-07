$(function(){
  //评分
  $.fn.raty.defaults.path = 'lib/raty/lib/images';
  $('.satisfaction .rating').raty();
  $('.comment-add .rating').raty({
     click: function(score, evt) {
      $(this).siblings('.tooltip-cart').removeClass('hide').find('.comment-add-score').text(score);
    }
  });
   
  //默认显示第一个评论窗口
  $('.comment-add').eq(0).removeClass('hide');
  //发表评论
	$('.comment').on('click','.comment-view',function(){
    $('.comment-add').addClass('hide');
    $(this).parent().siblings('.comment-add').removeClass('hide');
  })
  //删除晒单图片
  $('.comment').on('click','.comment-add-img-del',function(){
    $(this).parent().remove();
  })
  //标签选择
  $('.comment').on('click','.js-comment-add .btn-goods',function(){
    $(this).toggleClass('active');
  })
  //自定义标签
  $('.comment').on('keydown','.comment-add-custom',function(e){
    var text=$(this).val();
    if(e.keyCode==13){
       $(this).before('<span class="btn btn-goods active">'+text+'<span class="icon icon23"></span></span>');
       $(this).val('');
    }
  });
  //评论并继续
  $('.comment').on('click','.btn-danger',function(){
    $('.comment-add').addClass('hide');
    $(this).parents('.comment-list').next().find('.comment-add').removeClass('hide');
  })
  //满意度提交
  $('.satisfaction').on('click','.btn',function(){
    $('.satisfaction').html('<p><img src="../img/comment-icon.png">非常感谢您的评价，顺丰海淘会继续努力哦~</p>');
  })
  //图片缩放
  new CommentImg();
})