$(function(){
    $('.slidebar-c1>li').hover(function(){
        var index = $('.slidebar-c1>li').index(this);
        $('.slidebar-hover').css({
            top : 80 * index + 75,
            opacity : 1
        })
    },function(){
        $('.slidebar-hover').css({
            opacity : 0
        })
    })  
})