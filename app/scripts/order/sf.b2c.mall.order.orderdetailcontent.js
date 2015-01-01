'use strict';

define('sf.b2c.mall.order.orderdetailcontent', [
    'can',
    'sf.b2c.mall.api.order.getOrder',
    'sf.helpers',
    'webuploader',
    'sf.b2c.mall.widget.file.uploader',
    'sf.b2c.mall.widget.loading',
    'sf.b2c.mall.framework.comm',
    'sf.util',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.api.user.updateReceiverInfo',
    'sf.b2c.mall.api.user.getIDCardUrlList'
  ],
  function(can, SFGetOrder, helpers, Webuploader, FileUploader, loading, FrameworkComm, Utils, SFConfig, SFUpdateReceiverInfo, SFGetIDCardUrlList) {

    return can.Control.extend({

      /**
       * [defaults 定义默认值]
       */
      defaults: {
        'steps': ['SUBMITED', 'AUDITING', 'WAIT_SHIPPING', 'SHIPPING', 'COMPLETED']
      },

      /**
       * 初始化
       * @param  {DOM} element 容器element
       * @param  {Object} options 传递的参数
       */
      init: function(element, options) {
        this.component = {};
        this.render();
      },

      /**
       * [render 执行渲染]
       * @param  {[type]} data 数据
       */
      render: function(data) {
        var that = this;

        var params = can.deparam(window.location.search.substr(1));

        var getOrder = new SFGetOrder({
          "orderId": params.orderid
        });

        var getIDCardUrlList = new SFGetIDCardUrlList();

        can.when(getOrder.sendRequest(), getIDCardUrlList.sendRequest())
          .done(function(data, idcardList) {

            that.options.orderId = data.orderId;
            that.options.recId = data.orderItem.rcvrId;

            var idcardItem = _.find(idcardList.items, function(item) {
              return item.recId == that.options.recId
            });

            that.options.status = that.statsMap[data.orderItem.orderStatus];
            that.options.nextStep = that.optionHTML[that.nextStepMap[data.orderItem.orderStatus]]
            that.options.currentStepTips = that.currentStepTipsMap[data.orderItem.orderStatus];

            data.orderItem.rcvrState = 0;

            that.options.user = new can.Map();
            that.options.IDCard = {};
            that.options.IDCard.needUpload = (data.orderItem.rcvrState == 0 || data.orderItem.rcvrState == 1 || data.orderItem.rcvrState == 3);
            that.options.IDCard.state = data.orderItem.rcvrState;
            if (that.options.IDCard.needUpload) {
              $('#uploadidcard').show();
              //读取身份证的状态
              that.options.IDCard.state = idcardItem.status;
              that.options.idcardDescription = that.cardStatusMap[that.options.IDCard.state] || ''
              that.options.currentStepTips = "尊敬的客户，该笔订单清关时需要上传收货人的身份证照片，为了您更快的收到商品，请尽快上传收货人的身份证照片。"
            }

            that.options.traceList = data.orderActionTraceItemList;

            var map = {
              'SUBMITED': function(trace) {
                that.options.submitedTime = trace.gmtHappened;
                that.options.submitedActive = "active";
              },

              'AUDITING': function(trace) {
                that.options.auditingTime = trace.gmtHappened;
                that.options.auditingActive = "active";
              },

              'WAIT_SHIPPING': function(trace) {
                that.options.wait_shippingTime = trace.gmtHappened;
                that.options.wait_shippingActive = "active";
              },

              'SHIPPING': function(trace) {
                that.options.shippingTime = trace.gmtHappened;
                that.options.shippingActive = "active";
              },

              'COMPLETED': function(trace) {
                that.options.completedTime = trace.gmtHappened;
                that.options.completedActive = "active";
              }
            }
            _.each(that.options.traceList, function(trace) {
              trace.operator = that.operatorMap[trace.operator];
              trace.description = that.statusDescription[trace.status];

              if (typeof map[trace.status] != 'undefined') {
                map[trace.status].call(that, trace);
              }
            })

            that.options.receiveInfo = data.orderItem.orderAddressItem;
            that.options.productList = data.orderItem.orderGoodsItemList;

            _.each(that.options.productList, function(item) {
              item.totalPrice = item.price * item.quantity;
              item.imageUrl = JSON.parse(item.imageUrl)[0];
            })
            that.options.allTotalPrice = that.options.productList[0].totalPrice;

            //是否是宁波保税，是得话才展示税额
            that.options.showTax = that.options.productList[0].bonded;
            that.options.shouldPayPrice = that.options.allTotalPrice;

            var html = can.view('templates/order/sf.b2c.mall.order.orderdetail.mustache', that.options);
            that.element.html(html);

            if (that.options.IDCard.needUpload) {
              that.component.loading = new loading('.sf-b2c-mall-loading');
              that.setPhotoP();
              that.setPhotoN();

              if (null != idcardItem.credtImgUrl1 && "" != idcardItem.credtImgUrl1) {
                that.options.user.attr('credtImgUrl1', idcardItem.credtImgUrl1);
                $('#file-submit-input-photo-p img').attr('src', that.getUserPhotoUrl({
                  n: idcardItem.credtImgUrl1
                }))
              }

              if (null != idcardItem.credtImgUrl2 && "" != idcardItem.credtImgUrl2) {
                that.options.user.attr('credtImgUrl2', idcardItem.credtImgUrl2);
                $('#file-submit-input-photo-n img').attr('src', that.getUserPhotoUrl({
                  n: idcardItem.credtImgUrl2
                }))
              }
            }
          })
          .fail(function(error) {
            console.error(error);
          })
      },

      cardStatusMap: {
        0: "<font color=red>待上传身份证照片</font>",
        1: "<font color=red>已上传身份证照片，等待审核</font>",
        2: "<font color=red>身份证照片审核通过</font>",
        3: "<font color=red>身份证照片审核未通过</font>"
      },

      getUserPhotoUrl: function(param) {

        var data = Utils.sign({
          level: 'USERLOGIN',
          data: {
            n: param.n
          }
        })
        return SFConfig.setting.api.fileurl + '?' + $.param(data);
      },

      setPhotoP: function() {

        this.component.uploaderPhotoP = new FileUploader();

        var that = this;
        var callback = {
          onUploadSuccess: function(obj, data) {

            that.component.loading.hide();
            $('.error-tips').remove();

            var img = data.content[0][that.cardPUpname];
            that.options.user.attr('credtImgUrl1', img);

            $('#file-submit-input-photo-p img').attr('src', that.getUserPhotoUrl({
              n: img
            }))

            that.component.uploaderPhotoP.reset();
          },

          onUploadError: function(data) {
            that.component.loading.hide();
            if (data.status === 413) {
              that.setError.call(that, that.defaults.alert);
            }

            that.component.uploaderPhotoP.reset();
          },

          onUploadBeforeSend: function(obj, data) {
            var filename = obj.file.name;
            that.cardPUpname = 'ID_CARD_1' + filename.substring(filename.lastIndexOf('.'), filename.length);
            that.component.uploaderPhotoP.setFileVal(that.cardPUpname);
            that.component.loading.show();
          },

          onError: function(errorCode) {
            that.component.uploaderPhotoP.reset();
            var map = {
              'Q_TYPE_DENIED': '电子照上传失败，选取的文件类型不支持',
              'Q_EXCEED_SIZE_LIMIT': '电子照上传失败，大小请控制在5M以内'
            }

            var errorText = map[errorCode] || that.defaults.alert;
            that.setError.call(that, errorText);
          }
        };

        this.component.uploaderPhotoP.config({
          pick: '#file-submit-input-photo-p'
        }, callback);
      },

      setPhotoN: function() {

        this.component.uploaderPhotoN = new FileUploader();

        var that = this;
        var callback = {
          onUploadSuccess: function(obj, data) {
            that.component.loading.hide();
            $('.error-tips').remove();
            var img = data.content[0][that.cardPUpname];
            that.options.user.attr('credtImgUrl2', img);
            $('#file-submit-input-photo-n img').attr('src', that.getUserPhotoUrl({
              n: img
            }))

            that.component.uploaderPhotoN.reset();
          },

          onUploadError: function(data) {
            that.component.loading.hide();
            if (data.status === 413) {
              that.setError.call(that, that.defaults.alert);
            }

            that.component.uploaderPhotoN.reset();
          },

          onUploadBeforeSend: function(obj, data) {
            var filename = obj.file.name;
            that.cardPUpname = 'ID_CARD_2' + filename.substring(filename.lastIndexOf('.'), filename.length);
            that.component.uploaderPhotoN.setFileVal(that.cardPUpname);
            that.component.loading.show();
          },

          onError: function(errorCode) {
            that.component.uploaderPhotoP.reset();
            var map = {
              'Q_TYPE_DENIED': '电子照上传失败，选取的文件类型不支持',
              'Q_EXCEED_SIZE_LIMIT': '电子照上传失败，大小请控制在5M以内'
            }

            var errorText = map[errorCode] || that.defaults.alert;
            that.setError.call(that, errorText);
          }
        };

        this.component.uploaderPhotoN.config({
          pick: '#file-submit-input-photo-n'
        }, callback);
      },

      statusDescription: {
        'SUBMITED': '您提交了订单，请等待系统确认',
        'AUTO_CANCEL': '系统自动取消',
        'USER_CANCEL': '用户取消',
        'AUDITING': '您的订单已经付款成功，请等待审核',
        'OPERATION_CANCEL': '运营取消',
        'BUYING': '您的宝贝已经审核通过，正在采购',
        'BUYING_EXCEPTION': '采购异常',
        'WAIT_SHIPPING': '您的宝贝已经采购到，请等待发货',
        'SHIPPING': '您的宝贝已经发货，请保持手机畅通',
        'LOGISTICS_EXCEPTION': '物流异常',
        'SHIPPED': '发货成功',
        'COMPLETED': '已完成'
      },

      getOptionHTML: function(operationsArr) {
        var that = this;
        var result = [];
        _.each(operationsArr, function(option) {
          if (that.optionHTML[option]) {
            result.push(that.optionHTML[option]);
          }
        })

        return result.join("");
      },

      operatorMap: {
        "USER": "用户"
      },

      optionHTML: {
        "NEEDPAY": '<a href="#" class="btn btn-send">立即支付</a>',
        "INFO": '<a href="#" class="btn btn-add">查看订单</a>',
        "CANCEL": '<a href="#" class="btn btn-add">取消订单</a>'
      },

      statsMap: {
        'SUBMITED': '已提交',
        'AUTO_CANCEL': '自动取消',
        'USER_CANCEL': '用户取消',
        'AUDITING': '待审核',
        'OPERATION_CANCEL': '运营取消',
        'BUYING': '采购中',
        'BUYING_EXCEPTION': '采购异常',
        'WAIT_SHIPPING': '待发货',
        'SHIPPING': '发货中',
        'LOGISTICS_EXCEPTION': '物流异常',
        'SHIPPED': '已发货',
        'COMPLETED': '已完成'
      },

      stepMap: {
        'SUBMITED': '<li class="active"><div><h3>提交订单</h3><p></p>2014/12/23 11:34:23<p></p></div><span></span><div class="line"></div></li>',
        'AUDITING': '<li><div><h3>付款成功</h3></div><span></span><div class="line"></div></li>',
        'BUYING': '<li><div><h3>采购中</h3></div><span></span><div class="line"></div></li>',
        'SHIPPING': '<li><div><h3>商品出库</h3></div><span></span><div class="line"></div></li>',
        'COMPLETED': '<li><div><h3>订单完成</h3></div><span></span><div class="line"></div></li>'
      },

      nextStepMap: {
        'SUBMITED': 'NEEDPAY'
      },

      currentStepTipsMap: {
        'SUBMITED': '尊敬的客户，我们还未收到该订单的款项，请您尽快付款（在线支付帮助）。<br />' +
          '该订单会为您保留2小时（从下单时间算起），2小时后系统将自动取消未付款的订单。',
        'AUTO_CANCEL': '尊敬的客户，我们由于2小时内未收到您的订单款项，订单已被自动取消。<br />' +
          '订单取消规则：订单会为您保留2小时（从下单时间算起），2小时后系统将自动取消未付款的订单。',
        'USER_CANCEL': '尊敬的客户，您的订单已成功取消，退款将会自动完成，请耐心等待。',
        'AUDITING': '尊敬的客户，您的订单正在等待顺丰海淘运营审核。',
        'OPERATION_CANCEL': '尊敬的客户，您的订单已成功取消，退款将会自动完成，请耐心等待。',
        'BUYING': '尊敬的客户，您的订单已经审核通过，不能修改。<br />' +
          '订单正在进行境外采购，请等待采购结果。',
        'WAIT_SHIPPING': '尊敬的客户，您的订单已经通过系统审核，不能修改。<br />' +
          '订单正在等待仓库发货。',
        'SHIPPING': '尊敬的客户，您的订单正在顺丰海外仓进行出库操作。。<br />' +
          '网上订单已被打印，目前订单正在等待海外仓库人员进行出库处理。',
        'SHIPPED': '尊敬的客户，您的订单已从顺丰海外仓出库完成，正在进行跨境物流配送。',
        'COMPLETED': '尊敬的客户，您的订单已经完成，感谢您在顺丰海淘购物。'
      },

      IDCardStatusTipsMap: {
        0: '<p class="orderdetail-r2"><strong>尊敬的客户，该笔订单清关时需要上传收货人的身份证照片，为了您更快的收到商品，请尽快上传收货人的身份证照片。</strong></p>'
      },

      "#orderdetail-view click": function(element, event) {

        $(".orderdetail-upload").show();
        $(".mask").show();
        return false;
      },

      "#orderdetail-save click": function(element, event) {

        var that = this;
        var user = this.options.user.attr();

        if (typeof user.credtImgUrl1 == 'undefined' || user.credtImgUrl1 == null) {
          alert("请上传身份证正面！");
          return false;
        }
        if (typeof user.credtImgUrl2 == 'undefined' || user.credtImgUrl2 == null) {
          alert("请上传身份证反面！");
          return false;
        }

        var person = {};
        person.credtImgUrl1 = user.credtImgUrl1;
        person.credtImgUrl2 = user.credtImgUrl2;
        person.recId = this.options.recId;

        var updateReceiverInfo = new SFUpdateReceiverInfo(person);
        updateReceiverInfo
          .sendRequest()
          .done(function(data) {
            that.render();
          })
          .fail(function(error) {
            console.error(error)
          });

        return false;
      },

      "#closeDialog click": function(element, event) {

        $(element).parents(".register").hide(300);
        $(".mask").hide();
        return false;
      }

    });
  })