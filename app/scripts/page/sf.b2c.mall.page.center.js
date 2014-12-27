/**
 * Created by 魏志强 on 2014/12/26.
 */
define(
  [
    'can',
    'jquery',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.center.change.userinfo'
  ],
  function(can,$,Header, Footer,ChangeUserInfo){
    var center = can.Control.extend({
      init:function(){
        this.render();
        this.supplement();
      },
      render:function(){
        new Header('.sf-b2c-mall-header');
        new Footer('.sf-b2c-mall-footer');
        new ChangeUserInfo('.user-basic-info');
      },
      supplement:function(){
        //----------select模拟-------------//
        $(".btn-select").on("click",function(){
          if($(this).hasClass("active")){
            $(this).removeClass("active");
            $(this).find("ul").hide();
          }else{
            $(this).addClass("active");
            $(this).find("ul").show();
          }
        });
        $(".btn-select").on("click","label",function(){
          var btnSelect=$(this).parents(".btn-select")
          btnSelect.removeClass("active");
          var value=$(this).text();
          btnSelect.find(".btn-select-num").text(value);
          btnSelect.find("ul").hide();
          return false;
        })
      }
    });
    new center('.center');
})