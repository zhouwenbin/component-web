'use strict';

define(
  'sf.b2c.mall.widget.file.uploader',

  [
    'jquery',
    'can',
    'webuploader',
    'sf.b2c.mall.business.config'
  ],

  function($, can, WebUploader, SFConfig) {
    return can.Control.extend({

      init: function() {
        if (!WebUploader.Uploader.support()) {
          alert('图片上传工具，不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
        }

        this.params = {};
      },

      setFileVal: function(name) {
        this.uploader.option('fileVal', name);
      },

      config: function(data, callback) {
        this.uploader = WebUploader.create({

          // 选完文件后，是否自动上传。
          auto: true,

          // swf文件路径
          // !注意这里的路径一定要配置正确
          //swf: sf.config.current.swf + 'Uploader.swf',
          swf: 'scripts/vendor/' + 'Uploader.swf',

          // 文件接收服务端。
          //server: sf.config.current.fileurl,
          server: SFConfig.setting.api.fileurl + "?_aid=1",

          // 选择文件的按钮。可选。
          // 内部根据当前运行是创建，可能是input元素，也可能是flash.
          // pick: data.pick,

          // 只允许选择图片文件。
          accept: {
            title: 'Images',
            extensions: 'jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
          },

          fileSingleSizeLimit: 10 * 1024 * 1024
        });

        this.uploader.addButton({
          id: data.pick
        });

        var that = this;
        this.uploader.on('uploadSuccess', callback.onUploadSuccess);
        this.uploader.on('uploadError', callback.onUploadError);
        this.uploader.on('uploadBeforeSend', callback.onUploadBeforeSend);
        this.uploader.on('fileQueued', function(file) {
          that.uploader.trigger('startUpload');
        });
        this.uploader.on('error', callback.onError);
      },

      reset: function() {
        this.uploader.reset();
      }
    });
  })