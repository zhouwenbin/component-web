$(function(){
	$('.tab-h li').click(function(){
    $(this).addClass('active').siblings().removeClass('active');
    var index=$('.tab-h li').index(this);
    $('.tab-b').eq(index).addClass('active').siblings().removeClass('active');
    return false;
  })
  $('.children-day .a1').click(function(){
    $('.m-dialog').show();
    return false;
  })
  $('.m-dialog .close').click(function(){
    $('.m-dialog').hide();
    return false;
  })
})