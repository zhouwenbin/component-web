$(function(){
    $('.discovery-index ul').masonry({  
        // options  
        itemSelector : '.discovery-index li',  
        columnWidth : 610  
      });
    $('.discovery-icon1').click(function(){
        $(this).toggleClass('active');
    })
})