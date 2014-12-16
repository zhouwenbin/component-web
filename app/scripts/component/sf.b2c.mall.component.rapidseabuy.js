'use strict';
define('sf.b2c.mall.component.rapidseabuy', ['can','underscore','jquery','sf.b2c.mall.api.b2cmall.getFastSaleInfoList'],
    function(can,$,_,SFGetFastSaleInfoList) {
  return can.Control.extend({

    /**
     * [init description]
     * @param  {[type]} element
     * @param  {[type]} options
     * @return {[type]}
     */
    init: function(element, options) {
      var $el = this.element.find('sf-b2c-mall-rapidseabuy.serverRendered');
      if($el.length === 0){
        this.render();
      }else{
        this.supplement();
      }
        

    },
    render:function(){
      var that = this;
      can.ajax({
        url:'json/sf-b2c.mall.index.rapidseabuy.json'
      }).done(function(data){
        if(data){
          var html = can.view('templates/component/sf.b2c.mall.rapidseabuy.mustache',data);
          that.element.html(html);
        }
      })
    },
    supplement:function(){


    },
    '.btn-more click':function(el,event){
      var that = this;
      event && event.preventDefault();
      can.ajax({
        url:'json/sf-b2c.mall.index.rapidseabuy.json'
      }).done(function(data){
        if(data){
//          _.each(data,function(element,index,list){
//            console.log(element[index]);
//          })
          $.each(data,function(i,item){
            var addHtml = '<li><div class="product-r1"><a href="'+ i.link+'"><img src="'+ i.imgUrl+'" alt="" ></a><span></span></div>'
                +'<h3><a href="'+ i.link+'">'+ i.title +'</a></h3>'
                +'<p>'+ i.subTitle+'</p>'
                +'<div class="product-r2 clearfix">'
                +'<div class="product-r2c1 fl"><span class="icon icon6"><b>'+ i.limitedTime+'</b>天到<i></i></span></div>'
                +'<div class="product-r2c2 fr"><img src="'+ i.homePageProductInfo.showNationalUrl+'" alt="" /></div>'
                +'</div>'
                +'<div class="product-r3 clearfix">'
                +'<div class="product-r3c1 fl">'
                +'<strong>￥1280</strong>'
                +'<del>￥1680</del>'
                +'</div>'
                +'<div class="product-r3c2 fr">'
                +'<strong>2.3</strong>折'
                +'</div>'
                +'</div>'
                +'</li>';
          })
        }
      })
      var addHtml = '';
    }

  });
})