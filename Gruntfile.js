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
    dist: 'dist',
    target: 'dev',
    base: null
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
      extra: {
        files:[{
          dot: true,
          src: [
            '<%= config.dist %>/base',
            '<%= config.dist %>/com',
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
      html: [
        '<%= config.app %>/index.html',
        '<%= config.app %>/preheat.html',
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
            if(block.dest === 'base'){
              block.dest = config.base.dest;
              block.src = config.base.src
            }else if (block.dest === 'com') {
              block.dest = config.com;
              block.src = config.com
            }

            return '<script src="'+block.dest+'"></script>';
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
            // 'index.html',
            'preheat.html',
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
            '<%= config.com %>',
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
      all: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.all.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          include: [
            'vendor.jquery.imagezoom',

            'sf.b2c.mall.component.header',
            'sf.b2c.mall.component.footer',
            'sf.b2c.mall.component.login',
            'sf.b2c.mall.component.register',
            'sf.b2c.mall.component.limitedtimesale',
            'sf.b2c.mall.component.rapidseabuy',
            'sf.b2c.mall.center.register',

            'sf.b2c.mall.widget.slide',
            'sf.b2c.mall.widget.modal',
            'sf.b2c.mall.adapter.limitedtimesale',
            'sf.b2c.mall.adapter.rapidSeaBuy',

            'sf.b2c.mall.product.breadscrumb',
            'sf.b2c.mall.product.detailcontent',
            'sf.b2c.mall.adapter.detailcontent',

            'sf.b2c.mall.page.main',
            'sf.b2c.mall.page.preheat.register',

            'sf.b2c.mall.page.order',
            'sf.b2c.mall.order.step',
            'sf.b2c.mall.order.selectreceiveaddr',
            'sf.b2c.mall.order.selectreceiveperson',
            'sf.b2c.mall.order.iteminfo',
            'sf.b2c.mall.page.login',
            'sf.b2c.mall.page.register',
            'sf.b2c.mall.page.detail'
          ]
        }
      },
      headerandfooter: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.headerandfooter.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            // 'fastclick': '../bower_components/fastclick/lib/fastclick'
          },
          include: [
            'sf.b2c.mall.component.header',
            'sf.b2c.mall.component.footer',
            'sf.b2c.mall.widget.modal',
            'sf.b2c.mall.widget.not.support',
          ]
        }
      },
      main: {
        options: {
          optimize: 'none',
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.main.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          include: [
            'sf.b2c.mall.component.header',
            'sf.b2c.mall.component.login.status.scanner',
            'sf.b2c.mall.component.footer',
            'sf.b2c.mall.component.limitedtimesale',
            'sf.b2c.mall.component.rapidseabuy',
            'sf.b2c.mall.widget.slide',
            'sf.b2c.mall.widget.modal',
            'sf.b2c.mall.adapter.limitedtimesale',
            'sf.b2c.mall.adapter.rapidSeaBuy',
            'sf.b2c.mall.widget.not.support',
            'sf.b2c.mall.page.main'
          ],
          paths: {
            'moment':'../bower_components/momentjs/min/moment.min',
            'moment-zh-cn': '../bower_components/momentjs/locale/zh-cn',
            // 'fastclick': '../bower_components/fastclick/lib/fastclick'
          },
          insertRequire: ['sf.b2c.mall.page.main']
        }
      },
      preheat: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.preheat.register.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          include: [
            'sf.b2c.mall.center.register',
            'sf.b2c.mall.page.preheat.register',
            'vendor.jquery.jcountdown'
          ],
          insertRequire: ['sf.b2c.mall.page.preheat.register']
        }
      },
      detail: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.detail.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'moment':'../bower_components/momentjs/min/moment.min',
            // 'fastclick': '../bower_components/fastclick/lib/fastclick'
          },
          include: [
            'sf.b2c.mall.component.header',
            'sf.b2c.mall.component.login.status.scanner',
            'sf.b2c.mall.component.footer',
            'sf.b2c.mall.widget.modal',
            'sf.b2c.mall.product.breadscrumb',
            'sf.b2c.mall.product.detailcontent',
            'vendor.jquery.imagezoom',
            'sf.b2c.mall.adapter.detailcontent',
            'sf.b2c.mall.widget.not.support',
            'moment',
            'sf.helpers',
            'sf.b2c.mall.widget.message',
            'sf.b2c.mall.page.detail'
          ],
          insertRequire: ['sf.b2c.mall.page.detail']
        }
      },
      login: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.login.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          include: [
            'sf.b2c.mall.component.login',
            'sf.b2c.mall.page.login'
          ],
          insertRequire: ['sf.b2c.mall.page.login']
        }
      },
      ilogin: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.i.login.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          include: [
            'sf.b2c.mall.component.i.login',
            'sf.b2c.mall.page.i.login'
          ],
          insertRequire: ['sf.b2c.mall.page.i.login']
        }
      },
      register: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.register.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders': '../bower_components/Placeholders/build/placeholders',
          },
          include: [
            'placeholders',
            'sf.b2c.mall.component.register',
            'sf.b2c.mall.page.register'
          ],
          insertRequire: ['sf.b2c.mall.page.register']
        }
      },
      iregister: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.i.register.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders': '../bower_components/Placeholders/build/placeholders',
          },
          include: [
            'placeholders',
            'sf.b2c.mall.component.i.register',
            'sf.b2c.mall.page.i.register'
          ],
          insertRequire: ['sf.b2c.mall.page.i.register']
        }
      },
      process: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.process.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          include: [
            'sf.b2c.mall.page.process'
          ],
          insertRequire: ['sf.b2c.mall.page.process']
        }
      },
      activated: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.activated.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            // 'fastclick': '../bower_components/fastclick/lib/fastclick'
          },
          include: [
            'sf.b2c.mall.component.header',
            'sf.b2c.mall.component.login.status.scanner',
            'sf.b2c.mall.component.footer',
            'sf.b2c.mall.widget.modal',
            'sf.b2c.mall.widget.not.support',
            'sf.b2c.mall.page.activated'
          ],
          insertRequire: ['sf.b2c.mall.page.activated']
        }
      },
      nullactivated: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.nullactivated.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            // 'fastclick': '../bower_components/fastclick/lib/fastclick'
          },
          include: [
            'sf.b2c.mall.component.header',
            'sf.b2c.mall.component.login.status.scanner',
            'sf.b2c.mall.component.footer',
            'sf.b2c.mall.widget.modal',
            'sf.b2c.mall.widget.not.support',
            'sf.b2c.mall.page.nullactivated'
          ],
          insertRequire: ['sf.b2c.mall.page.nullactivated']
        }
      },
      retrieve: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.retrieve.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            // 'fastclick': '../bower_components/fastclick/lib/fastclick'
          },
          include: [
            'sf.b2c.mall.component.header',
            'sf.b2c.mall.component.login.status.scanner',
            'sf.b2c.mall.component.footer',
            'sf.b2c.mall.widget.modal',
            'sf.b2c.mall.component.retrieve',
            'sf.b2c.mall.page.retrieve',
          ],
          insertRequire: ['sf.b2c.mall.page.retrieve']
        }
      },
      order: {
        options: {
          optimize: 'none',
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.order.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'moment':'../bower_components/momentjs/min/moment.min',
            'placeholders': '../bower_components/Placeholders/build/placeholders'
          },
          include: [
            'placeholders',
            'sf.b2c.mall.component.header',
            'sf.b2c.mall.component.login.status.scanner',
            'sf.b2c.mall.component.footer',
            'sf.b2c.mall.widget.not.support',
            'sf.b2c.mall.widget.modal',
            'sf.b2c.mall.order.step',
            'sf.b2c.mall.order.selectreceiveperson',
            'sf.b2c.mall.order.selectreceiveaddr',
            'sf.b2c.mall.order.iteminfo',
            'sf.b2c.mall.order.vendor.info',
            'sf.b2c.mall.adapter.address.list',
            'sf.b2c.mall.component.addreditor',
            'sf.b2c.mall.adapter.order',
            'sf.b2c.mall.adapter.regions',
            'sf.b2c.mall.order.fn',
            'placeholders',
            'sf.b2c.mall.page.order'
          ],
          insertRequire: ['sf.b2c.mall.page.order']
        }
      },
      orderlist: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.order.list.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'moment':'../bower_components/momentjs/min/moment.min',
            'placeholders': '../bower_components/Placeholders/build/placeholders',
            // 'fastclick': '../bower_components/fastclick/lib/fastclick'
          },
          include: [
            'placeholders',
            'sf.b2c.mall.component.header',
            'sf.b2c.mall.component.login.status.scanner',
            'sf.b2c.mall.component.footer',
            'sf.b2c.mall.widget.not.support',
            'sf.b2c.mall.widget.modal',
            'sf.b2c.mall.order.step',
            'sf.b2c.mall.order.selectreceiveperson',
            'sf.b2c.mall.order.selectreceiveaddr',
            'sf.b2c.mall.order.iteminfo',
            'sf.b2c.mall.adapter.address.list',
            'sf.b2c.mall.component.addreditor',
            'sf.b2c.mall.adapter.order',
            'sf.b2c.mall.adapter.regions',
            'sf.b2c.mall.order.orderlistcontent',
            'moment',
            'placeholders',
            'sf.b2c.mall.order.fn',
            'sf.b2c.mall.widget.message',
            'sf.b2c.mall.page.orderlist'
          ],
          insertRequire: ['sf.b2c.mall.page.orderlist']
        }
      },
      orderdetail: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.order.detail.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'moment':'../bower_components/momentjs/min/moment.min',
            'placeholders': '../bower_components/Placeholders/build/placeholders',
          },
          include: [
            'placeholders',
            'sf.b2c.mall.component.header',
            'sf.b2c.mall.component.login.status.scanner',
            'sf.b2c.mall.component.footer',
            'sf.b2c.mall.widget.not.support',
            'sf.b2c.mall.widget.modal',
            'sf.b2c.mall.order.orderdetailcontent',
            'sf.helpers',
            'moment',
            'sf.b2c.mall.order.fn',
            'sf.b2c.mall.page.orderdetail'
          ],
          insertRequire: ['sf.b2c.mall.page.orderdetail']
        }
      },
      center: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.center.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'moment':'../bower_components/momentjs/min/moment.min',
            'placeholders': '../bower_components/Placeholders/build/placeholders',
            // 'fastclick': '../bower_components/fastclick/lib/fastclick'
          },
          include: [
            'placeholders',
            'sf.b2c.mall.component.header',
            'sf.b2c.mall.component.login.status.scanner',
            'sf.b2c.mall.component.footer',
            'sf.b2c.mall.widget.modal',
            'sf.b2c.mall.widget.not.support',
            'sf.b2c.mall.center.change.userinfo',
            'sf.b2c.mall.center.receiveperson',
            'sf.b2c.mall.center.receiveaddr',
            'sf.b2c.mall.component.receivepersoneditor',
            'sf.b2c.mall.adapter.receiveperson.list',
            'sf.b2c.mall.component.addreditor',
            'sf.b2c.mall.adapter.regions',
            'sf.b2c.mall.widget.message',
            'placeholders',
            'sf.b2c.mall.page.center'
          ],
          insertRequire: ['sf.b2c.mall.page.center']
        }
      },
      gotopay: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.gotopay.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'moment':'../bower_components/momentjs/min/moment.min',
            // 'fastclick': '../bower_components/fastclick/lib/fastclick'
          },
          include: [
            'sf.b2c.mall.component.header',
            'sf.b2c.mall.component.login.status.scanner',
            'sf.b2c.mall.component.footer',
            'sf.b2c.mall.widget.modal',
            'sf.b2c.mall.widget.not.support',
            'sf.b2c.mall.order.step',
            'sf.helpers',
            'moment',
            'sf.b2c.mall.order.fn',
            'sf.b2c.mall.page.gotopay'
          ],
          insertRequire: ['sf.b2c.mall.page.gotopay']
        }
      },
      passwordchange: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.passwordchange.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'moment':'../bower_components/momentjs/min/moment.min',
            // 'fastclick': '../bower_components/fastclick/lib/fastclick'
          },
          include: [
            'sf.b2c.mall.component.header',
            'sf.b2c.mall.component.login.status.scanner',
            'sf.b2c.mall.component.footer',
            'sf.b2c.mall.widget.not.support',
            'sf.b2c.mall.widget.modal',
            'sf.b2c.mall.center.change.password',
            'sf.b2c.mall.page.passwordchange'
          ],
          insertRequire: ['sf.b2c.mall.page.passwordchange']
        }
      },
      proxy:{
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.proxy.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          include: [
            'sf.b2c.mall.page.proxy'
          ],
          insertRequire: ['sf.b2c.mall.page.proxy']
        }
      },
      federallogin: {
        options: {
          optimize: 'none',
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.federal.login.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          include: [
            'sf.b2c.mall.page.federal.login'
          ],
          insertRequire: ['sf.b2c.mall.page.federal.login']
        }
      },
      common: {
        options: {
          optimize: 'none',
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.dist %>/scripts/sf.b2c.mall.page.common.min.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'moment':'../bower_components/momentjs/min/moment.min',
            // 'fastclick': '../bower_components/fastclick/lib/fastclick'
          },
          include: [
            'sf.b2c.mall.page.common',
            'sf.b2c.mall.component.header',
            'sf.b2c.mall.component.login.status.scanner',
            'sf.b2c.mall.component.footer',
            'sf.b2c.mall.widget.modal',
            'sf.b2c.mall.widget.not.support'
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

  grunt.registerTask('build', function(target){
    grunt.file.recurse('app/scripts/base', function callback(abspath, rootdir, subdir, filename) {
      var arr = filename.split('.')
      if (arr[2] == 'com') {
        config.com = 'scripts/base/'+filename
      }

      if (filename.indexOf(target) > -1 && arr[2] == target) {
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
          'requirejs:preheat',
          'requirejs:main',
          'requirejs:detail',
          'requirejs:headerandfooter',
          'requirejs:login',
          'requirejs:ilogin',
          'requirejs:register',
          'requirejs:iregister',
          'requirejs:process',
          'requirejs:activated',
          'requirejs:nullactivated',
          'requirejs:retrieve',
          'requirejs:order',
          'requirejs:orderlist',
          'requirejs:orderdetail',
          'requirejs:center',
          'requirejs:gotopay',
          'requirejs:passwordchange',
          'requirejs:proxy',
          'requirejs:common',
          'requirejs:federallogin',

          'usemin',
          // 'htmlmin',
          'strip:main',
          'clean:extra'
        ]);
      }
    })
  })

  // grunt.registerTask('build', [
  //   'clean:dist',
  //   'wiredep',
  //   'useminPrepare',
  //   'concurrent:dist',
  //   'autoprefixer',
  //   'concat',
  //   'cssmin',
  //   'uglify',
  //   'copy:dist',
  //   'requirejs:preheat',
  //   'rev',
  //   'usemin',
  //   'htmlmin'
  // ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
