'use strict';

define(
  'sf.b2c.mall.component.retrieve',

  [
    'jquery',
    'can',
    'underscore',
    'sf.b2c.mall.framework.comm'
  ],

  function ($, can, _, SFFrameworkComm) {

    var DEFAULT_FILLINFO_TAG = 'fillinfo';

    return can.Control.extend({
      init: function () {
        this.paint();
      },

      paint: function () {

        this.data = new can.Map({});

        var tag = can.route.attr('tag') || DEFAULT_FILLINFO_TAG
        this.dataMap[tag].call(this);
        this.render(tag, this.data);
      },

      dataMap: {
        'fillinfo': function () {
          this.data.attr('mobile', true);
          this.data.attr('mail', false);
        }
      },

      '{can.route} change': function() {
        var tag = can.route.attr('tag') || DEFAULT_FILLINFO_TAG;
        this.dataMap[tag].call(this);
        this.render.call(this, tag, this.data);
      },

      renderMap: {
        'fillinfo': 'templates/component/sf.b2c.mall.component.retrieve.fillinfo.mustache',
        'setpwd': 'templates/component/sf.b2c.mall.component.retrieve.setpwd.mustache',
        'success': 'templates/component/sf.b2c.mall.component.retrieve.success.mustache'
      },

      render: function (tag, data) {
        var path = this.renderMap[tag];
        if (path) {
          var html = can.view(path, data);
          this.element.html(html);
        }
      },

      '.radio click': function ($element, event) {
        var tag = $element.data('tag');
        this.switchTab(tag);
      },

      switchTab: function (tag) {
        this.data.attr('mobile', false);
        this.data.attr('mail', false);
        this.data.attr(tag, true);
      }


    })
  })