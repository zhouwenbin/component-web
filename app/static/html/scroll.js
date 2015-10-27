$(function(){
    for(var i = 0,num = $('.scroll').length;i<num;i++){
        new Scroll($('.scroll').eq(i));
    }
})
function Scroll(element){
    var scrollPrev = element.find('.scroll-prev');
    var scrollNext = element.find('.scroll-next');
    var scrollUL = element.find('ul');
    var scrollLi = element.find('li');
    var scrollLiHeight = scrollLi.height() + 8;
    var scrollLiLength = scrollLi.length;
    var index = 0;
    scrollPrev.click(function(){
        index--;
        if(index < 0){
            index = scrollLiLength - 6;
        }
        scrollUL.animate({
            top:-scrollLiHeight * index
        },300)
    })
    scrollNext.click(function(){
        index ++;
        if(index > scrollLiLength - 6){
            index = 0;
        }
        scrollUL.animate({
            top:-scrollLiHeight * index
        },300)
    })
    
}