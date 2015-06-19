'use strict';
define(
    'sf.b2c.mall.module.newpage', [
        'can',
        'jquery'
    ],
    function(can, $) {
        //功能：选中与当前页面的url相匹配的的li
        var pageSwitch = can.Control.extend({
            init: function(element) {
                var currentUrl = window.location.pathname;
                $(".cms-fill-nav li").each(function(limodule){
                    var urlValue = $(this).find("a").attr("href");
                    if(($(this).find("a").attr("href")).indexOf(currentUrl) > 0){
                        $(this).remove("active").addClass("active");
                    }
                });
            }
        })
        new pageSwitch();
    })