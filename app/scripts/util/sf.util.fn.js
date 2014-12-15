'use strict';

define('sf.util', ['jquery',
  'jquery.cookie',
  'can',
  'underscore',
  'md5'
], function($, cookie, can, _, md5) {

  //$(window).hashchange();
  can.route.ready();

  return {
    checkEmail: function(data) {
      return /^([a-zA-Z0-9-_]*[-_\.]?[a-zA-Z0-9]+)*@([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)+[\.][a-zA-Z]{2,3}([\.][a-zA-Z]{2})?$/.test(data)
    },

    isLogin: function() {
      if ($.cookie('ct') == 1) {
        return true;
      } else {
        return false;
      }
    },

    namespace: function(name) {
      var arr = name.split('.');
      var container = sf;

      for (var i = 0; i < arr.length; i++) {
        container[arr[i]] = container[arr[i]] || {};
        container = container[arr[i]];
      }

      return container;
    },

    access: function(data, isForce) {
      if (data.stat.code === 0 && data.content[0] && data.stat.stateList[0].code === 0) {
        return true;
      } else if (data.stat.code == -180 || data.stat.code == -360) {
        if (isForce) {
          var pathname = window.location.pathname;
          if (pathname != '/login.html') {
            window.location.href = '/login.html';
          }
        }
      } else {
        return false;
      }
    },

    clean: function(params) {
      _.each(params, function(value, key, list) {
        if (_.isUndefined(value) || _.isNull(value)) {
          delete params[key];
        }
      });

      return params;
    },

    encrypt: function(params, word) {
      _.each(params, function(value, key, list) {
        if (_.isUndefined(value)) {
          delete params[key];
        }
      });

      var arr = [];
      _.each(params, function(value, key, list) {
        arr.push(key + '=' + value);
      });

      arr.sort();

      var str = arr.join('');
      str = str + word;

      return md5(str);
    },

    sign: function(params, isForce) {
      var map = {
        'NONE': function(data, force) {
          var word = 'sfhaitao.xyz!';
          return _.extend(data, {
            _sig: sf.util.encrypt(data, word)
          });
        },

        'USERLOGIN': function(data, force) {
          var csrf = null;

          if (window.localStorage) {
            csrf = localStorage.getItem('csrfToken');
          } else {
            csrf = $.jStorage.get('csrfToken');
          }

          if (csrf) {
            return _.extend(data, {
              _sig: sf.util.encrypt(data, csrf)
            });
          } else {

            if (force) {
              var pathname = window.location.pathname;
              if (pathname != '/login.html') {
                window.location.href = '/login.html';
              }
            } else {
              return data;
            }
          }
        }
      };

      var action = map[params.level];
      if (_.isFunction(action)) {
        var p = _.extend(params.data, {
          _aid: 1,
          _sm: 'md5'
        });
        return action(p);
      } else {
        return params.data;
      }
    }
  };

});