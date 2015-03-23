$(window).scroll(function(){
      if($(window).scrollTop() > 166){
          $(".nav").addClass('nav-fixed');
          $(".nav-inner").animate({
            top:'0px'
          },300);
      }else{
          $(".nav").removeClass('nav-fixed');
          $(".nav-inner").css({
            top:'-56px'
          });
      }
  })
  $('#js-focus').click(function(){
    $('.nav-qrcode').toggleClass('show');
    return false;
  })