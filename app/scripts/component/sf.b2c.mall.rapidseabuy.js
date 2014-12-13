'use strict';

define('sf.b2c.mall.rapidseabuy', ['can','jquery'], function(can,$) {
  return can.Control.extend({

    /**
     * [init description]
     * @param  {[type]} element
     * @param  {[type]} options
     * @return {[type]}
     */
    init: function(element, options) {
      this.render();
      this.supplement();
    },
    render:function(){
      var that = this;
      can.ajax({
        url:'json/sf-b2c.mall.index.rapidseabuy.json'
      }).done(function(data){
        var html = can.view('templates/component/sf.b2c.mall.rapidseabuy.mustache',data);
        that.element.html(html);
      })
    },
    supplement:function(){

    }
  });
})