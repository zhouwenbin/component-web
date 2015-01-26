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

  var generator = require('./apigen');
  var _ = require('underscore');

  // Configurable paths
  var config = {
    app: 'app',
    dist: 'dist',
    target: 'dev',
    version: 'ver.1.0',
    build: 'build.'+Date.now(),
    base: null,
    release: false
  };

  var isRelease = function () {
    return config.release?'static.sfht.com/':''
  }

  var DEFAULT_JS_OUTPUT = function (block) {
    return '<script src="'+ isRelease() +block.dest+'.'+config.version+'.'+config.build+'.min.js"></script>';
  }
  var JS_OUTPUT_MAP = {
    'require': function (block) {
      return '<script src="'+ isRelease() +'scripts/require.min.js"></script>';
    },
    'base': function (block) {
      block.dest = config.base.dest;
      block.src = config.base.src;
      return '<script src="'+ isRelease() +block.dest+'"></script>';
    },
    'com': function (block) {
      block.dest = config.com;
      block.src = config.com;
      return '<script src="'+ isRelease() +block.dest+'"></script>';
    }
  }

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
      extra: {
        files:[{
          dot: true,
          src: [
            '<%= config.dist %>/base',
            '<%= config.dist %>/com',
            '<%= config.dist %>/scripts/sf.b2c.mall.page.activated',
            '<%= config.dist %>/scripts/sf.b2c.mall.page.center',
            '<%= config.dist %>/scripts/sf.b2c.mall.page.common',
            '<%= config.dist %>/scripts/sf.b2c.mall.page.detail',
            '<%= config.dist %>/scripts/sf.b2c.mall.page.gotopay',
            '<%= config.dist %>/scripts/sf.b2c.mall.page.i.login',
            '<%= config.dist %>/scripts/sf.b2c.mall.page.i.register',
            '<%= config.dist %>/scripts/sf.b2c.mall.page.login',
            '<%= config.dist %>/scripts/sf.b2c.mall.page.main',
            '<%= config.dist %>/scripts/sf.b2c.mall.page.nullactivated',
            '<%= config.dist %>/scripts/sf.b2c.mall.page.order',
            '<%= config.dist %>/scripts/sf.b2c.mall.page.order.detail',
            '<%= config.dist %>/scripts/sf.b2c.mall.page.order.list',
            '<%= config.dist %>/scripts/sf.b2c.mall.page.passwordchange',
            '<%= config.dist %>/scripts/sf.b2c.mall.page.process',
            '<%= config.dist %>/scripts/sf.b2c.mall.page.proxy',
            '<%= config.dist %>/scripts/sf.b2c.mall.page.register',
            '<%= config.dist %>/scripts/sf.b2c.mall.page.retrieve'
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

    rename: {
      main: {
        files: [
          { src: '<%= config.dist %>/styles/sf.b2c.mall.404', dest: '<%= config.dist %>/styles/sf.b2c.mall.404.<%= config.version %>.<%= config.build %>.min.css' },
          { src: '<%= config.dist %>/styles/sf.b2c.mall.common', dest: '<%= config.dist %>/styles/sf.b2c.mall.common.<%= config.version %>.<%= config.build %>.min.css' },
          { src: '<%= config.dist %>/styles/sf.b2c.mall.activated', dest: '<%= config.dist %>/styles/sf.b2c.mall.activated.<%= config.version %>.<%= config.build %>.min.css' },
          { src: '<%= config.dist %>/styles/sf.b2c.mall.agreement', dest: '<%= config.dist %>/styles/sf.b2c.mall.agreement.<%= config.version %>.<%= config.build %>.min.css' },
          { src: '<%= config.dist %>/styles/sf.b2c.mall.center', dest: '<%= config.dist %>/styles/sf.b2c.mall.center.<%= config.version %>.<%= config.build %>.min.css' },
          { src: '<%= config.dist %>/styles/sf.b2c.mall.detail', dest: '<%= config.dist %>/styles/sf.b2c.mall.detail.<%= config.version %>.<%= config.build %>.min.css' },
          { src: '<%= config.dist %>/styles/sf.b2c.mall.gotopay', dest: '<%= config.dist %>/styles/sf.b2c.mall.gotopay.<%= config.version %>.<%= config.build %>.min.css' },
          { src: '<%= config.dist %>/styles/sf.b2c.mall.register', dest: '<%= config.dist %>/styles/sf.b2c.mall.register.<%= config.version %>.<%= config.build %>.min.css' },
          { src: '<%= config.dist %>/styles/sf.b2c.mall.index', dest: '<%= config.dist %>/styles/sf.b2c.mall.index.<%= config.version %>.<%= config.build %>.min.css' },
          { src: '<%= config.dist %>/styles/sf.b2c.mall.order', dest: '<%= config.dist %>/styles/sf.b2c.mall.order.<%= config.version %>.<%= config.build %>.min.css' },
          { src: '<%= config.dist %>/styles/sf.b2c.mall.order.detail', dest: '<%= config.dist %>/styles/sf.b2c.mall.order.detail.<%= config.version %>.<%= config.build %>.min.css' },
          { src: '<%= config.dist %>/styles/sf.b2c.mall.order.list', dest: '<%= config.dist %>/styles/sf.b2c.mall.order.list.<%= config.version %>.<%= config.build %>.min.css' },
          { src: '<%= config.dist %>/styles/sf.b2c.mall.process', dest: '<%= config.dist %>/styles/sf.b2c.mall.process.<%= config.version %>.<%= config.build %>.min.css' },
          { src: '<%= config.dist %>/styles/sf.b2c.mall.retrieve', dest: '<%= config.dist %>/styles/sf.b2c.mall.retrieve.<%= config.version %>.<%= config.build %>.min.css' }
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%= config.dist %>'
      },
      html: [
        '<%= config.app %>/index.html',
        '<%= config.app %>/agreement.html',
        '<%= config.app %>/detail.html',
        '<%= config.app %>/login.html',
        '<%= config.app %>/register.html',
        '<%= config.app %>/process.html',
        '<%= config.app %>/activated.html',
        '<%= config.app %>/nullactivated.html',
        '<%= config.app %>/retrieve.html',
        '<%= config.app %>/order.html',
        '<%= config.app %>/orderlist.html',
        '<%= config.app %>/orderdetail.html',
        '<%= config.app %>/center.html',
        '<%= config.app %>/gotopay.html',
        '<%= config.app %>/404.html',
        '<%= config.app %>/p404.html',
        '<%= config.app %>/password-change.html',
        '<%= config.app %>/proxy.html',
        '<%= config.app %>/i.login.html',
        '<%= config.app %>/i.register.html',
        '<%= config.app %>/helpcenter-*.html',
        '<%= config.app %>/aboutus-*.html',
        '<%= config.app %>/federatedLogin.html',
        '<%= config.app %>/error.html'
      ]
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [
          '<%= config.dist %>',
          '<%= config.dist %>/images',
          '<%= config.dist %>/styles'
        ],
        blockReplacements: {
          js: function (block) {
            var fn = JS_OUTPUT_MAP[block.dest] || DEFAULT_JS_OUTPUT;
            if(typeof fn == 'function'){
              return fn(block);
            }
          },
          css: function (block) {
            return '<link rel="stylesheet" href="'+block.dest+'.'+config.version+'.'+config.build+'.min.css">'
          }
        }
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
          removeOptionalTags: false,
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

            // '{,*/}*.html',
            'agreement.html',
            'detail.html',
            'login.html',
            'register.html',
            'i.login.html',
            'i.register.html',
            'process.html',
            'activated.html',
            'nullactivated.html',
            'retrieve.html',
            'order.html',
            'orderlist.html',
            'orderdetail.html',
            'center.html',
            'gotopay.html',
            '404.html',
            'p404.html',
            'password-change.html',
            'proxy.html',
            'helpcenter-*.html',
            'aboutus-*.html',
            'federatedLogin.html',
            'error.html',

            'json/*.json',

            'styles/fonts/{,*/}*.*',
            '<%= config.base.dest %>',
            'templates/**/*.mustache'
          ]
        }, {
          src: 'node_modules/apache-server-configs/dist/.htaccess',
          dest: '<%= config.dist %>/.htaccess'
        }, {
          src: '<%= config.app %>/scripts/vendor/Uploader.swf',
          dest: '<%= config.dist %>/scripts/Uploader.swf'
        }, {
          src: '<%= config.app %>/css/browser.css',
          dest: '<%= config.dist %>/css/browser.css'
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

    strip:{
      main: {
        src: '<%= config.dist %>/scripts/**/*.js',
        options: {
          inline: true
        }
      }
    },

    requirejs: {
      headerandfooter: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.headerandfooter.<%= config.version %>.<%= config.build %>.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'sf.b2c.mall.business.config': 'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include: [
            "sf.b2c.mall.business.config",
            'sf.b2c.mall.component.header',
            'sf.b2c.mall.component.footer',
            'sf.b2c.mall.widget.modal',
            'sf.b2c.mall.widget.not.support',
            "sf.b2c.mall.api.user.getUserInfo",
            "sf.b2c.mall.api.user.logout"
          ]
        }
      },
      main: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.main.<%= config.version %>.<%= config.build %>.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          include: [
            "sf.b2c.mall.page.main",
            "sf.b2c.mall.component.header",
            "sf.b2c.mall.component.footer",
            "sf.b2c.mall.component.limitedtimesale",
            "sf.b2c.mall.component.rapidseabuy",
            "sf.b2c.mall.api.b2cmall.getBanner",
            "sf.b2c.mall.widget.slide",
            "sf.b2c.mall.api.user.getUserInfo",
            "sf.b2c.mall.api.user.logout",
            "sf.b2c.mall.widget.modal",
            "sf.b2c.mall.business.config",
            "sf.b2c.mall.widget.not.support",
            "sf.b2c.mall.api.b2cmall.getTimeLimitedSaleInfoList",
            "sf.b2c.mall.adapter.limitedtimesale",
            "sf.b2c.mall.api.b2cmall.getProductHotDataList",
            "moment-zh-cn",
            "moment",
            "sf.b2c.mall.adapter.rapidSeaBuy",
            "sf.b2c.mall.api.b2cmall.getFastSaleInfoList"
          ],
          paths: {
            'moment':'../bower_components/momentjs/min/moment.min',
            'moment-zh-cn': '../bower_components/momentjs/locale/zh-cn',
            'sf.b2c.mall.business.config': 'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          insertRequire: ['sf.b2c.mall.page.main']
        }
      },
      // @deprecated
      // 线上代码已经发布不在需要preheat页面
      // preheat: {
      //   options: {
      //     preserveLicenseComments: false,
      //     baseUrl: './app/',
      //     out: './<%= config.dist %>/scripts/sf.b2c.mall.page.preheat.register.min.js',
      //     mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
      //     include: [
      //       'sf.b2c.mall.center.register',
      //       'sf.b2c.mall.page.preheat.register',
      //       'vendor.jquery.jcountdown'
      //     ],
      //     insertRequire: ['sf.b2c.mall.page.preheat.register']
      //   }
      // },
      detail: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.detail.<%= config.version %>.<%= config.build %>.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'moment':'../bower_components/momentjs/min/moment.min',
            'sf.b2c.mall.business.config': 'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include: [
            "sf.b2c.mall.page.detail",
            "sf.b2c.mall.component.header",
            "sf.b2c.mall.component.footer",
            "sf.b2c.mall.product.breadscrumb",
            "sf.b2c.mall.product.detailcontent",
            "sf.b2c.mall.api.user.getUserInfo",
            "sf.b2c.mall.api.user.logout",
            "sf.b2c.mall.widget.modal",
            "sf.b2c.mall.business.config",
            "sf.b2c.mall.widget.not.support",
            "sf.util",
            "zoom",
            "sf.b2c.mall.adapter.detailcontent",
            "sf.b2c.mall.api.b2cmall.getProductHotData",
            "sf.b2c.mall.api.b2cmall.getSkuInfo",
            "sf.b2c.mall.api.product.findRecommendProducts",
            "sf.helpers",
            "sf.b2c.mall.widget.message"
          ],
          insertRequire: ['sf.b2c.mall.page.detail']
        }
      },
      login: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.login.<%= config.version %>.<%= config.build %>.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'sf.b2c.mall.business.config': 'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include: [
            "sf.b2c.mall.page.login",
            "sf.b2c.mall.component.login",
            "sf.b2c.mall.business.config",
            "sf.b2c.mall.api.user.webLogin",
            "sf.b2c.mall.api.user.needVfCode"
          ],
          insertRequire: ['sf.b2c.mall.page.login']
        }
      },
      ilogin: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.i.login.<%= config.version %>.<%= config.build %>.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'sf.b2c.mall.business.config': 'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include: [
            "sf.b2c.mall.business.config",
            "sf.b2c.mall.page.i.login",
            "sf.b2c.mall.component.i.login",
            "sf.b2c.mall.api.user.webLogin",
            "sf.b2c.mall.api.user.needVfCode"
          ],
          insertRequire: ['sf.b2c.mall.page.i.login']
        }
      },
      register: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.register.<%= config.version %>.<%= config.build %>.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders': '../bower_components/Placeholders/build/placeholders',
            'sf.b2c.mall.business.config': 'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include: [
            "sf.b2c.mall.page.register",
            "sf.b2c.mall.component.register",
            "placeholders",
            "sf.b2c.mall.api.user.downSmsCode",
            "sf.b2c.mall.api.user.mobileRegister",
            "sf.b2c.mall.api.user.sendActivateMail",
            "sf.b2c.mall.business.config"
          ],
          insertRequire: ['sf.b2c.mall.page.register']
        }
      },
      iregister: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.i.register.<%= config.version %>.<%= config.build %>.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders': '../bower_components/Placeholders/build/placeholders',
            'sf.b2c.mall.business.config': 'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include: [
            "sf.b2c.mall.page.i.register",
            "sf.b2c.mall.component.i.register",
            "placeholders",
            "sf.b2c.mall.api.user.downSmsCode",
            "sf.b2c.mall.api.user.mobileRegister",
            "sf.b2c.mall.api.user.sendActivateMail",
            "sf.b2c.mall.business.config"
          ],
          insertRequire: ['sf.b2c.mall.page.i.register']
        }
      },
      process: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.process.<%= config.version %>.<%= config.build %>.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'sf.b2c.mall.business.config': 'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include: [
            "sf.b2c.mall.business.config",
            "sf.b2c.mall.page.process",
            "sf.b2c.mall.api.user.checkLink"
          ],
          insertRequire: ['sf.b2c.mall.page.process']
        }
      },
      activated: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.activated.<%= config.version %>.<%= config.build %>.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'sf.b2c.mall.business.config': 'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include: [
            "sf.b2c.mall.business.config",
            "sf.b2c.mall.component.header",
            "sf.b2c.mall.component.footer",
            "sf.b2c.mall.api.user.mailRegister",
            "sf.b2c.mall.api.user.getUserInfo",
            "sf.b2c.mall.api.user.logout",
            "sf.b2c.mall.widget.modal",
            "sf.b2c.mall.widget.not.support",
            "sf.util",
            'sf.b2c.mall.page.activated'
          ],
          insertRequire: ['sf.b2c.mall.page.activated']
        }
      },
      nullactivated: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.nullactivated.<%= config.version %>.<%= config.build %>.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'sf.b2c.mall.business.config': 'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include: [
            "sf.b2c.mall.business.config",
            "sf.b2c.mall.page.nullactivated",
            "sf.b2c.mall.component.header",
            "sf.b2c.mall.component.footer",
            "sf.b2c.mall.api.user.sendActivateMail",
            "sf.b2c.mall.api.user.sendResetPwdLink",
            "sf.b2c.mall.api.user.getUserInfo",
            "sf.b2c.mall.api.user.logout",
            "sf.b2c.mall.widget.modal",
            "sf.b2c.mall.widget.not.support"
          ],
          insertRequire: ['sf.b2c.mall.page.nullactivated']
        }
      },
      retrieve: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.retrieve.<%= config.version %>.<%= config.build %>.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'sf.b2c.mall.business.config': 'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include: [
            "sf.b2c.mall.page.retrieve",
            "sf.b2c.mall.component.header",
            "sf.b2c.mall.component.footer",
            "sf.b2c.mall.component.retrieve",
            "sf.b2c.mall.api.user.getUserInfo",
            "sf.b2c.mall.api.user.logout",
            "sf.b2c.mall.widget.modal",
            "sf.b2c.mall.business.config",
            "sf.b2c.mall.widget.not.support",
            "sf.util",
            "sf.b2c.mall.api.user.downSmsCode",
            "sf.b2c.mall.api.user.checkSmsCode",
            "sf.b2c.mall.api.user.resetPassword",
            "sf.b2c.mall.api.user.sendResetPwdLink"
          ],
          insertRequire: ['sf.b2c.mall.page.retrieve']
        }
      },
      order: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.order.<%= config.version %>.<%= config.build %>.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'moment':'../bower_components/momentjs/min/moment.min',
            'placeholders': '../bower_components/Placeholders/build/placeholders',
            'sf.b2c.mall.business.config': 'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include: [
            "sf.b2c.mall.page.order",
            "sf.b2c.mall.component.header",
            "sf.b2c.mall.component.footer",
            "sf.b2c.mall.order.step",
            "sf.b2c.mall.order.selectreceiveperson",
            "sf.b2c.mall.order.selectreceiveaddr",
            "sf.b2c.mall.order.iteminfo",
            "sf.b2c.mall.order.vendor.info",
            "sf.b2c.mall.api.user.getUserInfo",
            "sf.b2c.mall.api.user.logout",
            "sf.b2c.mall.widget.modal",
            "sf.b2c.mall.business.config",
            "sf.b2c.mall.widget.not.support",
            "sf.b2c.mall.api.user.getIDCardUrlList",
            "sf.b2c.mall.api.user.webLogin",
            "sf.b2c.mall.api.user.createReceiverInfo",
            "sf.b2c.mall.api.user.updateReceiverInfo",
            "sf.b2c.mall.adapter.order",
            "sf.b2c.mall.adapter.receiveperson.list",
            "sf.b2c.mall.component.receivepersoneditor",
            "sf.b2c.mall.api.user.getRecAddressList",
            "sf.b2c.mall.adapter.address.list",
            "sf.b2c.mall.component.addreditor",
            "sf.b2c.mall.api.b2cmall.getProductHotData",
            "sf.b2c.mall.api.b2cmall.getItemSummary",
            "sf.b2c.mall.api.order.submitOrderForAllSys",
            "sf.helpers",
            "sf.b2c.mall.api.user.setDefaultAddr",
            "sf.b2c.mall.api.user.setDefaultRecv",
            "sf.b2c.mall.widget.message"
          ],
          insertRequire: ['sf.b2c.mall.page.order']
        }
      },
      // order2: {
      //   options: {
      //     optimize: 'none',
      //     preserveLicenseComments: false,
      //     baseUrl: './app/',
      //     out: './<%= config.dist %>/scripts/sf.b2c.mall.page.order2.min.js',
      //     mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
      //     paths: {
      //       'moment':'../bower_components/momentjs/min/moment.min',
      //       'placeholders': '../bower_components/Placeholders/build/placeholders'
      //     },
      //     include: [
      //       'placeholders',
      //       'sf.b2c.mall.component.header',
      //       'sf.b2c.mall.component.login.status.scanner',
      //       'sf.b2c.mall.component.footer',
      //       'sf.b2c.mall.widget.not.support',
      //       'sf.b2c.mall.widget.modal',
      //       'sf.b2c.mall.order.step',
      //       'sf.b2c.mall.order.selectreceiveperson',
      //       'sf.b2c.mall.order.selectreceiveaddr',
      //       'sf.b2c.mall.order.iteminfo2',
      //       'sf.b2c.mall.order.vendor.info',
      //       'sf.b2c.mall.adapter.address.list',
      //       'sf.b2c.mall.component.addreditor',
      //       'sf.b2c.mall.adapter.order',
      //       'sf.b2c.mall.adapter.regions',
      //       'sf.b2c.mall.order.fn',
      //       'placeholders',
      //       'sf.b2c.mall.page.order2'
      //     ],
      //     insertRequire: ['sf.b2c.mall.page.order2']
      //   }
      // },
      orderlist: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.order.list.<%= config.version %>.<%= config.build %>.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'moment':'../bower_components/momentjs/min/moment.min',
            'placeholders': '../bower_components/Placeholders/build/placeholders',
            'sf.b2c.mall.business.config': 'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include: [
            "sf.b2c.mall.page.orderlist",
            "sf.b2c.mall.component.header",
            "sf.b2c.mall.component.footer",
            "sf.b2c.mall.order.orderlistcontent",
            "sf.b2c.mall.api.user.getUserInfo",
            "sf.b2c.mall.api.user.logout",
            "sf.b2c.mall.widget.modal",
            "sf.b2c.mall.business.config",
            "sf.b2c.mall.widget.not.support",
            "sf.util",
            "sf.b2c.mall.api.order.getOrderList",
            "sf.b2c.mall.adapter.pagination",
            "sf.b2c.mall.widget.pagination",
            "sf.b2c.mall.api.order.getOrder",
            "sf.helpers",
            "sf.b2c.mall.api.order.cancelOrder",
            "sf.b2c.mall.api.order.requestPayV2",
            "sf.b2c.mall.api.order.confirmReceive",
            "sf.b2c.mall.order.fn",
            "sf.b2c.mall.api.sc.getUserRoutes",
            "sf.b2c.mall.widget.message"
          ],
          insertRequire: ['sf.b2c.mall.page.orderlist']
        }
      },
      orderdetail: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.order.detail.<%= config.version %>.<%= config.build %>.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'moment':'../bower_components/momentjs/min/moment.min',
            'placeholders': '../bower_components/Placeholders/build/placeholders',
            'sf.b2c.mall.business.config': 'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include: [
            "sf.b2c.mall.page.orderdetail",
            "sf.b2c.mall.component.header",
            "sf.b2c.mall.component.footer",
            "sf.b2c.mall.order.orderdetailcontent",
            "sf.b2c.mall.api.user.getUserInfo",
            "sf.b2c.mall.api.user.logout",
            "sf.b2c.mall.widget.modal",
            "sf.b2c.mall.business.config",
            "sf.b2c.mall.widget.not.support",
            "sf.util",
            "sf.b2c.mall.api.order.getOrder",
            "sf.helpers",
            "webuploader",
            "sf.b2c.mall.widget.file.uploader",
            "sf.b2c.mall.widget.loading",
            "sf.b2c.mall.api.user.updateReceiverInfo",
            "sf.b2c.mall.api.user.getIDCardUrlList",
            "sf.b2c.mall.order.fn",
            "sf.b2c.mall.api.sc.getUserRoutes",
            "sf.b2c.mall.api.user.getRecvInfo",
            "sf.b2c.mall.widget.message",
            "moment",
            "sf.b2c.mall.api.order.confirmReceive"
          ],
          insertRequire: ['sf.b2c.mall.page.orderdetail']
        }
      },
      center: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.center.<%= config.version %>.<%= config.build %>.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'moment':'../bower_components/momentjs/min/moment.min',
            'placeholders': '../bower_components/Placeholders/build/placeholders',
            'sf.b2c.mall.business.config': 'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include: [
            'placeholders',
            "sf.util",
            "sf.b2c.mall.component.header",
            "sf.b2c.mall.component.footer",
            "sf.b2c.mall.center.change.userinfo",
            "sf.b2c.mall.center.receiveperson",
            "sf.b2c.mall.center.receiveaddr",
            "sf.b2c.mall.api.user.getUserInfo",
            "sf.b2c.mall.api.user.logout",
            "sf.b2c.mall.widget.modal",
            "sf.b2c.mall.business.config",
            "sf.b2c.mall.widget.not.support",
            "sf.b2c.mall.api.user.updateUserInfo",
            "sf.b2c.mall.widget.message",
            "sf.b2c.mall.api.user.getIDCardUrlList",
            "sf.b2c.mall.api.user.webLogin",
            "sf.b2c.mall.component.receivepersoneditor",
            "sf.b2c.mall.adapter.receiveperson.list",
            "sf.b2c.mall.api.user.delRecvInfo",
            "sf.b2c.mall.api.user.getRecAddressList",
            "sf.b2c.mall.adapter.address.list",
            "sf.b2c.mall.component.addreditor",
            "sf.b2c.mall.api.user.delRecAddress",
            'sf.b2c.mall.page.center'
          ],
          insertRequire: ['sf.b2c.mall.page.center']
        }
      },
      gotopay: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.gotopay.<%= config.version %>.<%= config.build %>.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'moment':'../bower_components/momentjs/min/moment.min',
            'sf.b2c.mall.business.config': 'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include: [
            "sf.b2c.mall.page.gotopay",
            "sf.b2c.mall.component.header",
            "sf.b2c.mall.component.footer",
            "sf.b2c.mall.order.step",
            "sf.b2c.mall.api.order.getOrder",
            "sf.b2c.mall.api.order.requestPayV2",
            "sf.b2c.mall.order.fn",
            "sf.b2c.mall.widget.message",
            "sf.b2c.mall.api.user.getUserInfo",
            "sf.b2c.mall.api.user.logout",
            "sf.b2c.mall.widget.modal",
            "sf.b2c.mall.business.config",
            "sf.b2c.mall.widget.not.support",
            "sf.util"
          ],
          insertRequire: ['sf.b2c.mall.page.gotopay']
        }
      },
      // gotopay2: {
      //   options: {
      //     preserveLicenseComments: false,
      //     baseUrl: './app/',
      //     out: './<%= config.dist %>/scripts/sf.b2c.mall.page.gotopay2.min.js',
      //     mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
      //     paths: {
      //       'moment':'../bower_components/momentjs/min/moment.min',
      //       // 'fastclick': '../bower_components/fastclick/lib/fastclick'
      //     },
      //     include: [
      //       'sf.b2c.mall.component.header',
      //       'sf.b2c.mall.component.login.status.scanner',
      //       'sf.b2c.mall.component.footer',
      //       'sf.b2c.mall.widget.modal',
      //       'sf.b2c.mall.widget.not.support',
      //       'sf.b2c.mall.order.step',
      //       'sf.helpers',
      //       'moment',
      //       'sf.b2c.mall.order.fn',
      //       'sf.b2c.mall.page.gotopay2'
      //     ],
      //     insertRequire: ['sf.b2c.mall.page.gotopay2']
      //   }
      // },
      passwordchange: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.passwordchange.<%= config.version %>.<%= config.build %>.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'moment':'../bower_components/momentjs/min/moment.min',
            'sf.b2c.mall.business.config': 'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include: [
            "sf.b2c.mall.page.passwordchange",
            "sf.b2c.mall.component.header",
            "sf.b2c.mall.component.footer",
            "sf.b2c.mall.center.change.password",
            "sf.b2c.mall.api.user.getUserInfo",
            "sf.b2c.mall.api.user.logout",
            "sf.b2c.mall.widget.modal",
            "sf.b2c.mall.business.config",
            "sf.b2c.mall.widget.not.support",
            "sf.util",
            "sf.b2c.mall.api.user.changePassword"
          ],
          insertRequire: ['sf.b2c.mall.page.passwordchange']
        }
      },
      // @deprecated
      // proxy:{
      //   options: {
      //     preserveLicenseComments: false,
      //     baseUrl: './app/',
      //     out: './<%= config.dist %>/scripts/sf.b2c.mall.page.proxy.<%= config.version %>.<%= config.build %>.min.js',
      //     mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
      //     paths: {
      //       'sf.b2c.mall.business.config': 'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
      //     },
      //     include: [
      //       'sf.b2c.mall.page.proxy'
      //     ],
      //     insertRequire: ['sf.b2c.mall.page.proxy']
      //   }
      // },
      federallogin: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.federal.login.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths:{
            'sf.b2c.mall.business.config': 'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include: [
            "sf.b2c.mall.business.config",
            "sf.b2c.mall.api.user.federatedLogin",
            "sf.b2c.mall.page.federal.login"
          ],
          insertRequire: ['sf.b2c.mall.page.federal.login']
        }
      },
      common: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.common.<%= config.version %>.<%= config.build %>.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'moment':'../bower_components/momentjs/min/moment.min',
            'sf.b2c.mall.business.config': 'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include: [
            "sf.b2c.mall.page.common",
            "sf.b2c.mall.component.header",
            "sf.b2c.mall.component.footer",
            "sf.b2c.mall.api.user.getUserInfo",
            "sf.b2c.mall.api.user.logout",
            "sf.b2c.mall.widget.modal",
            "sf.b2c.mall.business.config",
            "sf.b2c.mall.widget.not.support",
            "sf.util"
          ],
          insertRequire: ['sf.b2c.mall.page.common']
        }
      },
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

  grunt.registerTask('create', function () {
    var done = this.async();
    generator.autogen(grunt, done);
  });

  grunt.registerTask('modules', function () {
    var folders = ['adapter', 'center', 'component', 'config', 'order', 'product', 'util', 'widget']
    var list = {}
    var define = function (name, deps) {
      list[name]=deps
    }

    for(var i in folders){
      grunt.file.recurse('app/scripts/'+folders[i], function (abspath, rootdir, subdir, filename) {
        var arr = filename.split('.');
        if (arr[arr.length-1] == 'js') {

          var content = grunt.file.read('app/scripts/'+folders[i]+'/'+filename, {encoding: 'utf8'});
          eval(content)
        };
      })
    }

    var pages = {};
    var define = function (name, deps) {
      pages[name]=deps
    }
    grunt.file.recurse('app/scripts/page', function (abspath, rootdir, subdir, filename) {
      var content = grunt.file.read('app/scripts/page/'+filename, {encoding: 'utf8'});
      eval(content);
    });

    var modules = {}
    for(var i in pages){
      var deps = pages[i];
      for(var j in deps){
        if (list[deps[j]]) {
          deps = _.union(deps, list[deps[j]]);
          deps = _.uniq(deps);
        }
      }
      modules[i] = deps;
    }

    grunt.file.write('page.modules.json', JSON.stringify(modules));
  });

  grunt.registerTask('build', function(target){
    grunt.file.recurse('app/scripts/base', function callback(abspath, rootdir, subdir, filename) {
      if (filename.indexOf('sf.web.base')> -1) {
        config.target = target;
        config.base = {
          dest: 'scripts/base/'+filename,
          src: 'scripts/base/'+filename
        }

        grunt.task.run([
          'clean:dist',
          'useminPrepare',
          'concurrent:dist',
          'autoprefixer',
          'concat',
          'cssmin',
          'uglify',
          'copy:dist',
          'requirejs',
          'rename',
          'usemin',
          'htmlmin',
          'strip:main',
          'clean:extra'
        ]);
      };
    })
  });

  grunt.registerTask('release', function () {
    config.release = true;
    grunt.task.run(['build']);
  });

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
