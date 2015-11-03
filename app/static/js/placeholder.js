$(function(){
  //----------placeholder兼容-------------//
  $(".password").keyup(function(){

      if($(this).val()){
          $(this).siblings("label").hide();
      }else{
          $(this).siblings("label").show();
      }
  })
})