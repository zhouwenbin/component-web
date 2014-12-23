'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.center.id.photo');

/**
 * @class sf.b2c.mall.center.id.photo
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 显示用户列表信息
 */
sf.b2c.mall.center.id.photo = can.Control.extend({

  defaults: {
    pphoto: 'images/positive.png',
    nphoto: 'images/anti.png',
    alert: '电子照上传失败，大小请控制在5M以内'
  },

  helpers: {
    'sf-user-img': function (img) {
      if (img() == 'images/positive.png' || img() == 'images/anti.png') {
        return img();
      }else{
        return sf.b2c.mall.model.user.getUserPhotoUrl({n: img()})
      }
    }
  },

  init: function () {
    this.component = this.component || {};
    this.component.loading = new sf.b2c.mall.widget.loading('.sf-b2c-mall-loading');

    this.options.user = this.options.user || new can.Map({
      credtImgUrl1: this.defaults.pphoto,
      credtImgUrl2: this.defaults.nphoto
    });

    this.options.error = new can.Map({
      errorText: null
    })

    this.render();
    this.setPhotoP();
    this.setPhotoN();

    var that = this;
    this.element.on('click', function () {
      that.options.error.attr('errorText', null);
    })
  },

  render: function (data) {
    var html = can.view('templates/center/sf.b2c.mall.center.id.photo.mustache', this.options, this.helpers);
    this.element.html(html);
  },

  '.error-tips blur': function (element, event) {
    event && event.preventDefault();

    that.options.error.attr('errorText', null);
  },

  '#center-cancel-submit-photo click': function (element, event) {
    event && event.preventDefault();
    this.element.empty();
  },

  '#submit-file click': function (element, event) {
    event && event.preventDefault();

    if (_.isFunction(this.options.onUpload)) {
      var photos = this.options.user.attr();

      if (photos.credtImgUrl1 == this.defaults.pphoto) {
        delete photos.credtImgUrl1;
      }

      if (photos.credtImgUrl2 == this.defaults.nphoto) {
        delete photos.credtImgUrl2;
      }

      this.options.onUpload(photos);
    }

    this.element.empty();
  },

  setError: function (errorText) {
    this.options.error.attr('errorText', errorText);
    this.element.find('.error-tips').text(errorText);
  },

  setPhotoP: function () {
    this.component.uploaderPhotoP = new sf.b2c.mall.widget.file.uploader();

    var that = this;
    var callback = {
      onUploadSuccess: function (obj, data) {
        that.component.loading.hide();
        $('.error-tips').remove();
        if (sf.util.access(data)) {
          var img = data.content[0][that.cardPUpname];
          that.options.user.attr('credtImgUrl1', img);

          $('#file-submit-input-photo-p img').attr('src', sf.b2c.mall.model.user.getUserPhotoUrl({ n: img }))
        }

        that.component.uploaderPhotoP.reset();
      },

      onUploadError: function (data) {
        that.component.loading.hide();
        if(data.status === 413) {
          that.setError.call(that, that.defaults.alert);
        }

        that.component.uploaderPhotoP.reset();
      },

      onUploadBeforeSend: function (obj, data) {
        var filename = obj.file.name;
        that.cardPUpname = 'ID_CARD_1' + filename.substring(filename.lastIndexOf('.'), filename.length);
        that.component.uploaderPhotoP.setFileVal(that.cardPUpname);
        that.component.loading.show();
      },

      onError: function (errorCode) {
        that.component.uploaderPhotoP.reset();
        var map = {
          'Q_TYPE_DENIED': '电子照上传失败，选取的文件类型不支持',
          'Q_EXCEED_SIZE_LIMIT': '电子照上传失败，大小请控制在5M以内'
        }

        var errorText = map[errorCode] || that.defaults.alert;
        that.setError.call(that, errorText);
      }
    };

    this.component.uploaderPhotoP.config({ pick: '#file-submit-input-photo-p'}, callback);
  },

  setPhotoN: function () {
    this.component.uploaderPhotoN = new sf.b2c.mall.widget.file.uploader();

    var that = this;
    var callback = {
      onUploadSuccess: function (obj, data) {
        that.component.loading.hide();
        $('.error-tips').remove();
        if (sf.util.access(data)) {
          var img = data.content[0][that.cardPUpname];
          that.options.user.attr('credtImgUrl2', img);
          $('#file-submit-input-photo-n img').attr('src', sf.b2c.mall.model.user.getUserPhotoUrl({ n: img }))
        }

        that.component.uploaderPhotoN.reset();
      },

      onUploadError: function (data) {
        that.component.loading.hide();
        if(data.status === 413) {
          that.setError.call(that, that.defaults.alert);
        }

        that.component.uploaderPhotoN.reset();
      },

      onUploadBeforeSend: function (obj, data) {
        var filename = obj.file.name;
        that.cardPUpname = 'ID_CARD_2' + filename.substring(filename.lastIndexOf('.'), filename.length);
        that.component.uploaderPhotoN.setFileVal(that.cardPUpname);
        that.component.loading.show();
      },

      onError: function (errorCode) {
        that.component.uploaderPhotoP.reset();
        var map = {
          'Q_TYPE_DENIED': '电子照上传失败，选取的文件类型不支持',
          'Q_EXCEED_SIZE_LIMIT': '电子照上传失败，大小请控制在5M以内'
        }

        var errorText = map[errorCode] || that.defaults.alert;
        that.setError.call(that, errorText);
      }
    };

    this.component.uploaderPhotoN.config({ pick: '#file-submit-input-photo-n'}, callback);
  }

});