// Generated on 2015-02-03 using
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

  // Configurable paths
  var config = {
    app: 'app',
    dist: 'dist',
    tmp: '.tmp',
    publish: 'publish',
    oss: 'web-oss',
    statics: 'web-static',
    timestamp: Date.now()
  };

  var OSS_HOST = 'http://img.sfht.com/sfht';

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
      server: '.tmp',
      publish:{
        files: [{
          dot: true,
          src: [
            '<%= config.publish %>/*'
          ]
        }]
      },
      oss: {
        files: [{
          dot: true,
          src: [
            '<%= config.oss %>/*'
          ]
        }]
      },
      statics: {
        files: [{
          dot: true,
          src: [
            '<%= config.statics %>/*'
          ]
        }]
      },
      extra: {
        files: [{
          dot: true,
          src: [
            '<%= config.dist %>/index.html'
          ]
        }]
      }
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
        src: ['<%= config.app %>/index.html'],
        exclude: ['bower_components/bootstrap/dist/js/bootstrap.js']
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
        '<%= config.app %>/*.html',
      ]
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [
          '<%= config.dist %>',
          '<%= config.dist %>/img',
          '<%= config.dist %>/scripts',
          '<%= config.dist %>/styles'
        ],
        blockReplacements: {
          js: function (block) {
            if (config.version) {
              if (block.dest[0] != '/') {
                return '<script src="'+ OSS_HOST + '/' + config.version + '/' + block.dest +'"></script>';
              }else{
                return '<script src="'+ OSS_HOST + '/' + config.version +  block.dest +'"></script>';
              }
            }else{
              if (block.dest[0] != '/') {
                return '<script src="' + '/' + block.dest +'"></script>';
              }else{
                return '<script src="' + block.dest +'"></script>';
              }
            }
          },
          css: function (block) {
            if (config.version) {
              if (block.dest[0] !='/') {
                return '<link rel="stylesheet" href="'+ OSS_HOST + '/' + config.version + '/' + block.dest +'">';
              }else{
                return '<link rel="stylesheet" href="'+ OSS_HOST + '/' + config.version  + block.dest +'">';
              }
            }else{
              if (block.dest[0] != '/') {
                return '<link rel="stylesheet" href="'+ '/' + block.dest +'">';
              }else{
                return '<link rel="stylesheet" href="'+ block.dest +'">';
              }
            }
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
          timestamp: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.webp',

            // 不需要static中的html
            // '{,*/}*.html',

            'json/{,*/}*.json',
            // 'templates/{,*/}*.mustache',
            // '*.html',
            'font/{,*/}*.*'
          ]
        }]
      },

      html: {
        expand: true,
        dot: true,
        timestamp: true,
        cwd: '<%= config.app %>',
        dest: '<%= config.dist %>',
        src: [
          '*.html',
          'header/*.html',
          'footer/*.html'
        ],
        options:{
          process: function (content, srcpath) {
            // if (config.version) {
            //   content = content.replace(/\{version\}/g, config.timestamp);
            //   content = content.replace(/img\/qrcode.png/g, OSS_HOST+ '/'+ config.version +'/img/qrcode.png');
            // }
            return content;
          }
        }
      },

      image: {
        expand: true,
        dot: true,
        timestamp: true,
        cwd: '<%= config.app %>',
        dest: '<%= config.dist %>',
        src: [
          'img/{,*/}*.*',
        ]
      },

      // @todo需要修改，自动笔变化图片
      templates: {
        expand: true,
        dot: true,
        timestamp: true,
        cwd: '<%= config.app %>',
        dest: '<%= config.dist %>',
        src: [
          'templates/{,*/}*.mustache'
        ],
        options:{
          process: function (content, srcpath) {
            // if (config.version) {
            //   return content.replace(/img\/recommend.jpg/g, OSS_HOST+ '/'+ config.version +'/img/recommend.jpg')
            // }else{
            //   return content;
            // }
            return content;
          }
        }
      },

      styles: {
        expand: true,
        dot: true,
        cwd: '<%= config.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    compress: {
      oss: {
        options: {
          archive: '<%=config.oss%>/target/<%=config.oss%>.zip',
          store: true
        // archive: '<%=config.oss%>/oss.release.<%=config.version%>.zip'
        },
        files: [
          {
            expand: true,
            cwd: '<%=config.dist%>',
            src: ['scripts/**', 'styles/**', 'img/**', 'font/**'],
            dest: '<%=config.version%>'
          }
        ]
      },
      statics: {
        options: {
          archive: '<%=config.statics%>/target/<%=config.statics%>.zip',
          store: true
          // archive: '<%=config.statics%>/statics.release.<%=config.version%>.zip'
        },
        files: [
          {
            expand: true,
            cwd: '<%=config.dist%>',
            src: ['templates/**', '*.html', 'json/**', 'header/*.html', 'footer/*.html', '*.ico'],
            dest: 'ROOT'
            // dest: 'statics.web.<%=config.version%>'
          }
        ]
      },
      test: {
        options: {
          archive: '<%=config.publish%>/statics.<%=config.target%>.<%=config.timestamp%>.tar'
        },
        files: [
          {
            expand: true,
            cwd: '<%=config.dist%>',
            src: ['templates/**', '*.html', 'header/*.html', 'footer/*.html', 'img/**', 'json/**', 'scripts/**', 'styles/**', 'font/**'],
            dest: '<%=config.version%>'
          }
        ]
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
      campaign: {
        options: {
          preserveLicenseComments: false,
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.campaign.page.common.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.campaign.page.common"],
          insertRequire:  ['sf.b2c.mall.campaign.page.common']
        }
      },

      main: {
        options: {
          preserveLicenseComments: false,
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.page.main.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.page.main"],
          insertRequire:  ['sf.b2c.mall.page.main']
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
      //       'sf.b2c.mall.page.preheat.register',
      //     ],
      //     insertRequire: ['sf.b2c.mall.page.preheat.register']
      //   }
      // },

      detail: {
        options: {
          preserveLicenseComments: false,
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.page.detail.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.page.detail"],
          insertRequire:  ['sf.b2c.mall.page.detail']
        }
      },

      login: {
        options: {
          preserveLicenseComments: false,
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.page.login.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.page.login"],
          insertRequire:  ['sf.b2c.mall.page.login']
        }
      },

      ilogin: {
        options: {
          preserveLicenseComments: false,
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.page.i.login.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.page.i.login"],
          insertRequire:  ['sf.b2c.mall.page.i.login']
        }
      },

      register: {
        options: {
          preserveLicenseComments: false,
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.page.register.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.page.register"],
          insertRequire:  ['sf.b2c.mall.page.register']
        }
      },

      iregister: {
        options: {
          preserveLicenseComments: false,
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.page.i.register.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", 'sf.b2c.mall.page.i.register'],
          insertRequire:  ['sf.b2c.mall.page.i.register']
        }
      },

      process: {
        options: {
          preserveLicenseComments: false,
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.page.process.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.page.process"],
          insertRequire:  ['sf.b2c.mall.page.process']
        }
      },

      activated: {
        options: {
          preserveLicenseComments: false,
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.page.activated.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", 'sf.b2c.mall.page.activated'],
          insertRequire:  ['sf.b2c.mall.page.activated']
        }
      },

      nullactivated: {
        options: {
          preserveLicenseComments: false,
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.page.nullactivated.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.page.nullactivated"],
          insertRequire:  ['sf.b2c.mall.page.nullactivated']
        }
      },

      retrieve: {
        options: {
          preserveLicenseComments: false,
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.page.retrieve.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.page.retrieve"],
          insertRequire:  ['sf.b2c.mall.page.retrieve']
        }
      },

      order: {
        options: {
          preserveLicenseComments: false,
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.page.order.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.page.order"],
          insertRequire:  ['sf.b2c.mall.page.order']
        }
      },

      orderlist: {
        options: {
          preserveLicenseComments: false,
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.page.order.list.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.page.orderlist"],
          insertRequire:  ['sf.b2c.mall.page.orderlist']
        }
      },

      orderdetail: {
        options: {
          preserveLicenseComments: false,
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.page.order.detail.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.page.orderdetail"],
          insertRequire:  ['sf.b2c.mall.page.orderdetail']
        }
      },

      center: {
        options: {
          preserveLicenseComments: false,
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.page.center.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", 'sf.b2c.mall.page.center'],
          insertRequire:  ['sf.b2c.mall.page.center']
        }
      },

      gotopay: {
        options: {
          preserveLicenseComments: false,
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.page.gotopay.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.page.gotopay"],
          insertRequire:  ['sf.b2c.mall.page.gotopay']
        }
      },

      passwordchange: {
        options: {
          preserveLicenseComments: false,
          baseUrl:          './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.page.passwordchange.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.page.passwordchange"],
          insertRequire:  ['sf.b2c.mall.page.passwordchange']
        }
      },

      coupon: {
        options: {
          preserveLicenseComments: false,
          baseUrl:          './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.page.coupon.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.page.coupon"],
          insertRequire:  ['sf.b2c.mall.page.coupon']
        }
      },

      paysuccess: {
        options: {
          preserveLicenseComments: false,
          baseUrl:          './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.page.paysuccess.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.page.paysuccess"],
          insertRequire:  ['sf.b2c.mall.page.paysuccess']
        }
      },

      weixincenter: {
        options: {
          preserveLicenseComments: false,
          baseUrl:          './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.page.weixincenter.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.page.weixincenter"],
          insertRequire:  ['sf.b2c.mall.page.weixincenter']
        }
      },

      404: {
        options: {
          preserveLicenseComments: false,
          baseUrl:          './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.page.404.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.page.404"],
          insertRequire:  ['sf.b2c.mall.page.404']
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
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.page.federal.login.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths:{
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.page.federal.login"],
          insertRequire:  ['sf.b2c.mall.page.federal.login']
        }
      },

      common: {
        options: {
          preserveLicenseComments: false,
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.page.common.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.page.common"],
          insertRequire:  ['sf.b2c.mall.page.common']
        }
      },

      slider: {
        options: {
          preserveLicenseComments: false,
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.module.slider.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.module.slider"],
          insertRequire:  ['sf.b2c.mall.module.slider']
        }
      },

      price: {
        options: {
          preserveLicenseComments: false,
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.module.price.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.module.price"],
          insertRequire:  ['sf.b2c.mall.module.price']
        }
      },

      time: {
        options: {
          preserveLicenseComments: false,
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.module.time.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.module.time"],
          insertRequire:  ['sf.b2c.mall.module.time']
        }
      },

      header: {
        options: {
          preserveLicenseComments: false,
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.module.header.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.module.header"],
          insertRequire:  ['sf.b2c.mall.module.header']
        }
      },

      footer: {
        options: {
          preserveLicenseComments: false,
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.module.footer.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.module.footer"],
          insertRequire:  ['sf.b2c.mall.module.footer']
        }
      },

      lazyload: {
        options: {
          preserveLicenseComments: false,
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.module.lazyload.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.module.lazyload"],
          insertRequire:  ['sf.b2c.mall.module.lazyload']
        }
      },

      feedback: {
        options: {
          preserveLicenseComments: false,
          baseUrl:        './app/',
          out:            './<%= config.tmp %>/concat/scripts/sf.b2c.mall.page.feedback.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders':                 '../bower_components/Placeholders/dist/placeholders',
            'moment':                       '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn':                 '../bower_components/momentjs/locale/zh-cn',
            'text':                         '../bower_components/text/text',
            'JSON':                         '../bower_components/JSON-js/json2',
            'sf.b2c.mall.business.config':  'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include:        ["JSON", "sf.b2c.mall.page.feedback"],
          insertRequire:  ['sf.b2c.mall.page.feedback']
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

  grunt.registerTask('create', function () {
    var done = this.async();
    generator.autogen(grunt, done);
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

    grunt.task.run([
      'connect:test',
      'mocha'
    ]);
  });


  grunt.registerTask('build', function (target) {
    config.target = target;

    if (config.target) {
      grunt.task.run([
        'clean:dist',
        'wiredep',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'requirejs',
        'cssmin',
        'uglify',
        'copy:dist',
        'copy:html',
        'copy:image',
        'copy:templates',
        'usemin',
        'htmlmin',
        'clean:extra',
        'clean:publish',
        'compress:test'
      ]);
    }else{
      grunt.fail.fatal('缺少环境参数!');
    }
  });

  grunt.registerTask('release', function (version) {
    config.version = version;

    if (config.version) {
      config.target = 'prd';

      grunt.task.run([
        'clean:dist',
        'wiredep',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'requirejs',
        'cssmin',
        'uglify',
        'copy:dist',
        'copy:html',
        'copy:image',
        'copy:templates',
        'usemin',
        'htmlmin',
        'clean:extra',
        'clean:publish',
        'clean:oss',
        'clean:statics',
        'compress:oss',
        'compress:statics'
      ]);
    }else{
      grunt.fail.fatal('缺少版本号!');
    }
  })

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
