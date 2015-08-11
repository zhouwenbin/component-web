#新手指南

##新建页面

在app目录下新建一个html文件，比如message.html,修改最下面的一行脚本

    ```
    require(['sf.b2c.mall.page.message']);
    ```

在scripts/page目录下新建sf.b2c.mall.page.message.js文件，把需要的模块引进来。
在scripts/center新建sf.b2c.mall.center.message.js文件，业务逻辑在这个文件开发。
在templates/center新建sf.b2c.mall.center.message.mustache文件，模板在这个文件开发。

##修改Gruntfile.js

    ```
    message: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './app/',
          out: './<%= config.tmp %>/concat/scripts/sf.b2c.mall.page.message.js',
          mainConfigFile: "./<%= config.app %>/scripts/sf.b2c.mall.require.config.js",
          paths: {
            'placeholders': '../bower_components/Placeholders/dist/placeholders',
            'moment': '../bower_components/momentjs/min/moment.min',
            'moment-zh-cn': '../bower_components/momentjs/locale/zh-cn',
            'text': '../bower_components/text/text',
            'sf.b2c.mall.business.config': 'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include: ["sf.b2c.mall.page.message"],
          insertRequire: ['sf.b2c.mall.page.message']
        }
      }
    }
    ```

##修改sf.b2c.mall.require.config.js

    ```
    'sf.b2c.mall.center.message': 'scripts/center/sf.b2c.mall.center.message',
    'sf.b2c.mall.page.message': 'scripts/page/sf.b2c.mall.page.message',
    'template_center_message': 'templates/center/sf.b2c.mall.center.message.mustache',
    ```

##添加nproxy代理

    ```
    {
    pattern: 'http://www.sfht.com/message.html',
    responder: '/Users/user/git/haitao-b2c-web/app/message.html'
    },
    {
      pattern: 'http://www.sfht.com/scripts/',
      responder: '/Users/user/git/haitao-b2c-web/app/scripts/'
    },

    {
      pattern: 'http://www.sfht.com/css/',
      responder: '/Users/user/git/haitao-b2c-web/app/css/'
    },
    {
      pattern: 'http://wwww.sfht.com/bower_components/',
      responder: '/Users/user/git/haitao-b2c-web/bower_components/'
    },
    ```

启动代理就可以本地进行调试了。
