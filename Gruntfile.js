// Generated on 2014-12-11 using
// generator-webapp 0.5.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Configurable paths
  var config = {
    app: 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= config.app %>/scripts/{,*/}*.js'],
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      jstest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['test:watch']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      styles: {
        files: ['<%= config.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= config.app %>/images/{,*/}*'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        open: true,
        livereload: 35729,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect.static(config.app)
            ];
          }
        }
      },
      test: {
        options: {
          open: false,
          port: 9001,
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect.static(config.app)
            ];
          }
        }
      },
      dist: {
        options: {
          base: '<%= config.dist %>',
          livereload: false
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= config.app %>/scripts/{,*/}*.js',
        '!<%= config.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },

    // Mocha testing framework configuration options
    mocha: {
      all: {
        options: {
          run: true,
          reporter: 'Spec',
          urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
        }
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the HTML file
    wiredep: {
      app: {
        ignorePath: /^\/|\.\.\//,
        src: ['<%= config.app %>/index.html']
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= config.dist %>/scripts/{,*/}*.js',
            '<%= config.dist %>/styles/{,*/}*.css',
            '<%= config.dist %>/images/{,*/}*.*',
            '<%= config.dist %>/styles/fonts/{,*/}*.*',
            '<%= config.dist %>/*.{ico,png}'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%= config.dist %>'
      },
      html: '<%= config.app %>/index.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [
          '<%= config.dist %>',
          '<%= config.dist %>/images',
          '<%= config.dist %>/styles'
        ]
      },
      html: ['<%= config.dist %>/{,*/}*.html'],
      css: ['<%= config.dist %>/styles/{,*/}*.css']
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: '{,*/}*.html',
          dest: '<%= config.dist %>'
        }]
      }
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care
    // of minification. These next options are pre-configured if you do not
    // wish to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= config.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%= config.app %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= config.dist %>/scripts/scripts.js': [
    //         '<%= config.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            'img/{,*/}*',
            '{,*/}*.html',
            'styles/fonts/{,*/}*.*',
            'scripts/base/*.js',
            'templates/**/*.mustache'
          ]
        }, {
          src: 'node_modules/apache-server-configs/dist/.htaccess',
          dest: '<%= config.dist %>/.htaccess'
        }]
      },
      styles: {
        expand: true,
        dot: true,
        cwd: '<%= config.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    requirejs: {
      business: {
        options: {
          preserveLicenseComments: false,
          baseUrl: '.',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.business.js',
          paths: {
            'can': 'http://www.google.com/bower_components/canjs/amd/can',
            'jquery': 'http://www.google.com/bower_components/jquery/dist/jquery',
            'underscore': 'http://www.google.com/bower_components/underscore/underscore-min',
            'jquery.cookie': 'http://www.google.com/bower_components/jquery.cookie/jquery.cookie',
            'md5': 'http://www.google.com/bower_components/blueimp-md5/js/md5.min',
            'underscore.string': 'http://www.google.com/bower_components/underscore.string/dist/underscore.string.min',

            'sf.b2c.mall.api.logistics.getUserRoutes': 'http://www.google.com/app/scripts/api/logistics/sf.b2c.mall.api.logistics.getUserRoutes',

            'sf.b2c.mall.api.order.submitOrder': 'http://www.google.com/app/scripts/api/order/sf.b2c.mall.api.order.submitOrder',
            'sf.b2c.mall.api.order.submitOrderV2': 'http://www.google.com/app/scripts/api/order/sf.b2c.mall.api.order.submitOrderV2',
            'sf.b2c.mall.api.order.cancelOrder': 'http://www.google.com/app/scripts/api/order/sf.b2c.mall.api.order.cancelOrder',
            'sf.b2c.mall.api.order.confirmReceive': 'http://www.google.com/app/scripts/api/order/sf.b2c.mall.api.order.confirmReceive',
            'sf.b2c.mall.api.order.getOrder': 'http://www.google.com/app/scripts/api/order/sf.b2c.mall.api.order.getOrder',
            'sf.b2c.mall.api.order.getOrderList': 'http://www.google.com/app/scripts/api/order/sf.b2c.mall.api.order.getOrderList',
            'sf.b2c.mall.api.order.getSubOrder': 'http://www.google.com/app/scripts/api/order/sf.b2c.mall.api.order.getSubOrder',
            'sf.b2c.mall.api.order.requestPay': 'http://www.google.com/app/scripts/api/order/sf.b2c.mall.api.order.requestPay',
            'sf.b2c.mall.api.order.requestPayV2': 'http://www.google.com/app/scripts/api/order/sf.b2c.mall.api.order.requestPayV2',
            'sf.b2c.mall.api.order.submitOrderForAllSys': 'http://www.google.com/app/scripts/api/order/sf.b2c.mall.api.order.submitOrderForAllSys',

            'sf.b2c.mall.api.products.getSKUBaseList': 'http://www.google.com/app/scripts/api/products/sf.b2c.mall.api.product.getSKUBaseList',
            'sf.b2c.mall.api.products.getSKUInfo': 'http://www.google.com/app/scripts/api/products/sf.b2c.mall.api.product.getSKUInfo',
            'sf.b2c.mall.api.products.getSPUInfo': 'http://www.google.com/app/scripts/api/products/sf.b2c.mall.api.product.getSPUInfo',
            'sf.b2c.mall.api.products.updateSkuSellStock': 'http://www.google.com/app/scripts/api/products/sf.b2c.mall.api.product.updateSkuSellStock',
            'sf.b2c.mall.api.products.getAllParents': 'http://www.google.com/app/scripts/api/products/sf.b2c.mall.api.products.getAllParents',
            'sf.b2c.mall.api.products.getCategories': 'http://www.google.com/app/scripts/api/products/sf.b2c.mall.api.products.getCategories',
            'sf.b2c.mall.api.products.search': 'http://www.google.com/app/scripts/api/products/sf.b2c.mall.api.products.search',

            'sf.b2c.mall.api.user.appLogin': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.appLogin',
            'sf.b2c.mall.api.user.changePassword': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.changePassword',
            'sf.b2c.mall.api.user.checkUserExist': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.checkUserExist',
            'sf.b2c.mall.api.user.checkVerifyCode': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.checkVerifyCode',
            'sf.b2c.mall.api.user.createRecAddress': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.createRecAddress',
            'sf.b2c.mall.api.user.createReceiverInfo': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.createReceiverInfo',
            'sf.b2c.mall.api.user.delRecAddress': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.delRecAddress',
            'sf.b2c.mall.api.user.deviceRegister': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.deviceRegister',
            'sf.b2c.mall.api.user.getIDCardUrlList': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.getIDCardUrlList',
            'sf.b2c.mall.api.user.getInviteCodeList': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.getInviteCodeList',
            'sf.b2c.mall.api.user.getRecAddressList': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.getRecAddressList',
            'sf.b2c.mall.api.user.getUserInfo': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.getUserInfo',
            'sf.b2c.mall.api.user.logout': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.logout',
            'sf.b2c.mall.api.user.mailRegister': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.mailRegister',
            'sf.b2c.mall.api.user.renewToken': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.renewToken',
            'sf.b2c.mall.api.user.resetPassword': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.resetPassword',
            'sf.b2c.mall.api.user.sendActivateMail': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.sendActivateMail',
            'sf.b2c.mall.api.user.sendResetPwdLink': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.sendResetPwdLink',
            'sf.b2c.mall.api.user.setDefaultAddr': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.setDefaultAddr',
            'sf.b2c.mall.api.user.upateUserInfo': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.upateUserInfo',
            'sf.b2c.mall.api.user.updateRecAddress': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.updateRecAddress',
            'sf.b2c.mall.api.user.updateReceiverInfo': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.updateReceiverInfo',
            'sf.b2c.mall.api.user.userActivate': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.userActivate',
            'sf.b2c.mall.api.user.webLogin': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.webLogin',
            'sf.b2c.mall.api.user.federatedLogin': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.federatedLogin',
            'sf.b2c.mall.api.user.checkLink':'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.checkLink',
            'sf.b2c.mall.api.user.checkSmsCode': 'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.checkSmsCode',
            'sf.b2c.mall.api.user.downSmsCode':'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.downSmsCode',
            'sf.b2c.mall.api.user.downMobileVfCode':'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.downMobileVfCode',
            'sf.b2c.mall.api.user.mobileRegister':'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.mobileRegister',
            'sf.b2c.mall.api.user.needVfCode':'http://www.google.com/app/scripts/api/user/sf.b2c.mall.api.user.needVfCode',

            'sf.b2c.mall.api.b2cmall.getBanner': 'http://www.google.com/app/scripts/api/b2cmall/sf.b2c.mall.api.b2cmall.getBanner',
            'sf.b2c.mall.api.b2cmall.getFastSaleInfoList': 'http://www.google.com/app/scripts/api/b2cmall/sf.b2c.mall.api.b2cmall.getFastSaleInfoList',
            'sf.b2c.mall.api.b2cmall.getItemInfo': 'http://www.google.com/app/scripts/api/b2cmall/sf.b2c.mall.api.b2cmall.getItemInfo',
            'sf.b2c.mall.api.b2cmall.getProductHotData': 'http://www.google.com/app/scripts/api/b2cmall/sf.b2c.mall.api.b2cmall.getProductHotData',
            'sf.b2c.mall.api.b2cmall.getProductHotDataList': 'http://www.google.com/app/scripts/api/b2cmall/sf.b2c.mall.api.b2cmall.getProductHotDataList',
            'sf.b2c.mall.api.b2cmall.getRecommendProducts': 'http://www.google.com/app/scripts/api/b2cmall/sf.b2c.mall.api.b2cmall.getRecommendProducts',
            'sf.b2c.mall.api.b2cmall.getSkuInfo': 'http://www.google.com/app/scripts/api/b2cmall/sf.b2c.mall.api.b2cmall.getSkuInfo',
            'sf.b2c.mall.api.b2cmall.getTimeLimitedSaleInfoList': 'http://www.google.com/app/scripts/api/b2cmall/sf.b2c.mall.api.b2cmall.getTimeLimitedSaleInfoList',

            'sf.b2c.mall.business.config': 'http://www.google.com/app/scripts/config/sf.b2c.mall.business.<%= config.target %>.config',
            'sf.b2c.mall.api.security.type': 'http://www.google.com/app/scripts/framework/sf.b2c.mall.api.security.type',
            'sf.b2c.mall.framework.adapter': 'http://www.google.com/app/scripts/framework/sf.b2c.mall.framework.adapter',
            'sf.b2c.mall.framework.comm': 'http://www.google.com/app/scripts/framework/sf.b2c.mall.framework.comm',
            'sf.b2c.mall.framework.multiple.comm': 'http://www.google.com/app/scripts/framework/sf.b2c.mall.framework.multiple.comm',
            'sf.b2c.mall.framework.view.controller': 'http://www.google.com/app/scripts/framework/sf.b2c.mall.framework.view.controller',
            'sf.b2c.mall.util.utils': 'http://www.google.com/app/scripts/util/sf.b2c.mall.util.utils',


            'sf.b2c.mall.component.header': 'app/scripts/component/sf.b2c.mall.component.header',
            'sf.b2c.mall.component.footer': 'app/scripts/component/sf.b2c.mall.component.footer',
            'sf.b2c.mall.component.limitedtimesale': 'app/scripts/component/sf.b2c.mall.component.limitedtimesale',
            'sf.b2c.mall.component.rapidseabuy': 'app/scripts/component/sf.b2c.mall.component.rapidseabuy',
            'sf.b2c.mall.center.register': 'app/scripts/center/sf.b2c.mall.center.register',
            'sf.b2c.mall.widget.slide': 'app/scripts/widget/sf.b2c.mall.widget.slide',
            'sf.b2c.mall.adapter.limitedtimesale': 'app/scripts/adapter/sf.b2c.mall.adapter.limitedtimesale',
            'sf.b2c.mall.adapter.rapidSeaBuy': 'app/scripts/adapter/sf.b2c.mall.adapter.rapidSeaBuy',
            'sf.b2c.mall.product.breadscrumb': 'app/scripts/product/sf.b2c.mall.product.breadscrumb',
            'sf.b2c.mall.product.detailcontent':'app/scripts/product/sf.b2c.mall.product.detailcontent',
            'sf.b2c.mall.adapter.detailcontent': 'app/scripts/adapter/sf.b2c.mall.adapter.detailcontent'
          },
          include: [
            'sf.b2c.mall.component.header',
            'sf.b2c.mall.component.footer',
            'sf.b2c.mall.component.limitedtimesale',
            'sf.b2c.mall.component.rapidseabuy',
            'sf.b2c.mall.center.register',
            'sf.b2c.mall.widget.slide',
            'sf.b2c.mall.adapter.limitedtimesale',
            'sf.b2c.mall.adapter.rapidSeaBuy',
            'sf.b2c.mall.product.breadscrumb',
            'sf.b2c.mall.product.detailcontent',
            'sf.b2c.mall.adapter.detailcontent'
          ]
        }
      }
    }
  });


  grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function (target) {
    if (grunt.option('allow-remote')) {
      grunt.config.set('connect.options.hostname', '0.0.0.0');
    }
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run([target ? ('serve:' + target) : 'serve']);
  });

  grunt.registerTask('test', function (target) {
    if (target !== 'watch') {
      grunt.task.run([
        'clean:server',
        'concurrent:test',
        'autoprefixer'
      ]);
    }

    if (target === 'browser') {
      grunt.task.run([
        // 'jshint',
        'connect:test',
        'watch'
      ]);
    }else{
      grunt.task.run([
        'connect:test',
        'mocha'
      ]);
    }

    grunt.task.run([
      'connect:test',
      'mocha'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'cssmin',
    'uglify',
    'copy:dist',
    'requirejs:business',
    // 'rev',
    'usemin',
    // 'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
