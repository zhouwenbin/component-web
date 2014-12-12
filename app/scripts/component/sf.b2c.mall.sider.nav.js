'use strict';

// @description 声明命名空间
sf.util.namespace('b2c.mall.sider.nav');

/**
 * @description 右侧聚合的导航栏
 *
 * @bug 导航栏应该是点击大字或者父节点，而不是点击加号，体验不好
 */
sf.b2c.mall.sider.nav = can.Control.extend({

  init: function(element, options) {

    this.data = this.parse(this.options);
    this.render(this.data)
  },

  render: function(data) {
    var html = can.view('templates/component/sf.b2c.mall.sider.nav.mustache', data);
    this.element.html(html)
  },

  '.sf-sider-nav-close click': function(el, event) {
    var title = can.$(el).attr('data-title');
    for(var index in this.data.catagories){
      if (title === this.data.catagories[index].title) {
        this.data.catagories[index].on(false)
      }
    }
  },

  '.sf-sider-nav-open click': function(el, event) {
    var title = can.$(el).attr('data-title');
    for(var index in this.data.catagories){
      if (title === this.data.catagories[index].title) {
        this.data.catagories[index].on(true);
      }else{
        this.data.catagories[index].on(false);
      }
    }
  },

  '.sider-category click': function (el, event) {
    event && event.preventDefault()

    var category = el.data('category');
    var id = category.categoryInfo.categoryId;

    var params = can.deparam(window.location.search.substr(1));
    params = _.extend(params, {category: id});
    var iparams = can.route.attr();

    window.location.href = window.location.pathname + '?' + $.param(params) + '#!' + $.param(iparams);

    // window.location.search = window.location.search + '&' + 'frontcategory='+id;
  },

  parse: function(data) {

    return {
      catagories: data
    }
  }
})