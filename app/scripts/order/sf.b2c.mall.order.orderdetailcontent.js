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
    'sf.b2c.mall.api.user.getIDCardUrlList',
    'sf.b2c.mall.order.fn',
    'sf.b2c.mall.api.sc.getUserRoutes',
    'sf.b2c.mall.api.user.getRecvInfo',
    'sf.b2c.mall.widget.message'
  ],
  function(can, SFGetOrder, helpers, Webuploader, FileUploader, loading, FrameworkComm, Utils, SFConfig, SFUpdateReceiverInfo, SFGetIDCardUrlList, SFOrderFn, SFGetUserRoutes, SFGetRecvInfo, SFMessage) {

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

        //模板外要绑定事件。 todo：针对弹出层 要做一个公用组件出来
        $('#closeExample')[0].onclick = function() {
          $(".orderdetail-upload").hide();
          $(".mask2").hide();
          return false;
        }
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

        var getRecvInfo = new SFGetRecvInfo({"recId": params.recid});

        var getUserRoutes = new SFGetUserRoutes({
          'bizId': params.orderid
        });

        this.options.userRoutes = new Array();

        can.when(getOrder.sendRequest(), getRecvInfo.sendRequest())
          .done(function(data, idcard) {

            that.options.orderId = data.orderId;
            that.options.recId = data.orderItem.rcvrId;

            //data.orderItem.orderStatus = "SUBMITED";
            //data.orderItem.rcvrState = 0
            that.options.status = that.statsMap[data.orderItem.orderStatus];
            that.options.nextStep = that.optionHTML[that.nextStepMap[data.orderItem.orderStatus]];
            that.options.currentStepTips = that.currentStepTipsMap[data.orderItem.orderStatus];

            that.options.user = new can.Map();
            that.options.IDCard = {};
            that.options.IDCard.needUpload = (data.orderItem.rcvrState == 0 || data.orderItem.rcvrState == 1 || data.orderItem.rcvrState == 3);
            that.options.IDCard.state = data.orderItem.rcvrState;
            if (that.options.IDCard.needUpload) {
              $('#uploadidcard').show();
              //读取身份证的状态
              that.options.currentStepTips = that.cardTipsMap[idcard.status] || '';
              that.options.currentStatus = that.cardStatusMap[idcard.status] || '';
            }

            that.options.traceList = data.orderActionTraceItemList;
            //            that.options.traceList =  [
            //              {"gmtHappened":"2015/01/01 20:43:32","operator":"USER","status":"SUBMITED"},
            //              {"gmtHappened":"2015/01/01 20:44:32","operator":"USER","status":"AUDITING"},
            //              {"gmtHappened":"2015/01/01 20:45:58","operator":"SYSTEM","status":"WAIT_SHIPPING"},
            //              {"gmtHappened":"2015/01/01 20:46:05","operator":"SYSTEM","status":"SHIPPING"},
            //              {"gmtHappened":"2015/01/01 21:08:57","operator":"LOGISTICS","status":"SHIPPED"},
            //              {"gmtHappened":"2015/01/02 11:09:10","operator":"SYSTEM","status":"COMPLETED"}
            //            ];

            var map = {
              'SUBMITED': function(trace) {
                that.options.submitedTime = trace.gmtHappened;
                that.options.submitedActive = "active";
              },

              'AUDITING': function(trace) {
                that.options.auditingTime = trace.gmtHappened;
                that.options.auditingActive = "active";
              },
              'BUYING': function(trace) {},
              'WAIT_SHIPPING': function(trace) {},

              'SHIPPING': function(trace) {
                that.options.wait_shippingTime = trace.gmtHappened;
                that.options.wait_shippingActive = "active";
              },

              'SHIPPED': function(trace) {
                that.options.shippingTime = trace.gmtHappened;
                that.options.shippingActive = "active";
              },

              'COMPLETED': function(trace) {
                that.options.completedTime = trace.gmtHappened;
                that.options.completedActive = "active";
              },

              'AUTO_COMPLETED': function(trace) {
                that.options.completedTime = trace.gmtHappened;
                that.options.completedActive = "active";
              }
            }
            _.each(that.options.traceList, function(trace) {
              trace.operator = that.operatorMap[trace.operator] || '系统';
              trace.description = that.statusDescription[trace.status];

              if (typeof map[trace.status] != 'undefined') {
                map[trace.status].call(that, trace);
              }
            })

            //加入路由
            _.each(that.options.traceList, function(trace) {
              if (trace.status != 'SHIPPED' && trace.status != 'COMPLETED') {
                that.options.userRoutes.push(trace);
              }
            })

            that.options.receiveInfo = data.orderItem.orderAddressItem;
            that.options.receiveInfo.certNo = idcard.credtNum;
            that.options.productList = data.orderItem.orderGoodsItemList;

            _.each(that.options.productList, function(item) {
              item.totalPrice = item.price * item.quantity;
              if(typeof that.options.productList[0].spec !== "undefined"){
                item.spec = that.options.productList[0].spec.split(',').join("&nbsp;/&nbsp;");
              }
              item.imageUrl = JSON.parse(item.imageUrl)[0];
            });

            that.options.allTotalPrice = that.options.productList[0].totalPrice;
            //that.options.allTotalPrice = that.options.productList[0].totalPrice;

            var cancelArr = new Array();
            cancelArr.push('AUTO_CANCEL');
            cancelArr.push('USER_CANCEL');
            cancelArr.push('OPERATION_CANCEL');
            //判断浏览器是否支持indexOf方法，如果不支持执行下面方法
            if(!Array.prototype.indexOf){
              Array.prototype.indexOf = function(obj, start) {
                for (var i = (start || 0), j = this.length; i < j; i++) {
                  if (this[i] === obj) { return i; }
                }
                return -1;
              }
            }
            that.options.showShouldPayPrice = (cancelArr.indexOf(data.orderItem.orderStatus) === -1);
            //是否是宁波保税，是得话才展示税额
            that.options.showTax = that.options.productList[0].bonded;
            that.options.shouldPayPrice = that.options.allTotalPrice;

            var html = can.view('templates/order/sf.b2c.mall.order.orderdetail.mustache', that.options);
            that.element.html(html);

            if (that.options.IDCard.needUpload) {
              that.component.loading = new loading('.sf-b2c-mall-loading');
              that.setPhotoP();
              that.setPhotoN();

              if (null != idcard.credtImgUrl1 && "" != idcard.credtImgUrl1) {
                // $('#leftTip').empty();
                that.options.user.attr('credtImgUrl1', idcard.credtImgUrl1);
                $('#file-submit-input-photo-p img').attr('src', that.getUserPhotoUrl({
                  n: idcard.credtImgUrl1
                }))
              }

              if (null != idcard.credtImgUrl2 && "" != idcard.credtImgUrl2) {
                // $('#rightTip').empty();
                that.options.user.attr('credtImgUrl2', idcard.credtImgUrl2);
                $('#file-submit-input-photo-n img').attr('src', that.getUserPhotoUrl({
                  n: idcard.credtImgUrl2
                }))
              }
            }
          })
          .fail(function(error) {
            console.error(error);
          })
          .then(function() {
            return getUserRoutes.sendRequest();
          })
          .done(function(routes) {
            _.each(routes, function(route) {
              that.options.userRoutes.push({
                "gmtHappened": route.eventTime,
                "description": reoute.position + " " + reoute.remark,
                "operator": "系统"
              });
            })
          })
          .fail()
      },

      cardStatusMap: {
        1: "<span class='label label-disabled'>身份证照片正在审核</span>",
        2: "<span class='label label-success'>身份证照片已审核</span>",
        3: "<span class='label label-error'>身份证照片审核不通过，请重新上传</span>"
      },

      cardTipsMap: {
        0: "<span class='label label-error'>尊敬的客户，该笔订单清关时需要上传收货人的身份证照片，为了您更快的收到商品，请尽快上传收货人的身份证照片。</span>",
        1: "<span class='label label-error'>尊敬的客户，您上传的身份证照片正在审核中，请耐心等待。</span>",
        3: "<span class='label label-error'>尊敬的客户，您上传的身份证照片审核不通过，请重新上传！为了您更快的收到商品，请尽快上传正确的身份证照片。</span>"
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

      setError: function(errorText) {
        //this.options.error.attr('errorText', errorText);
        this.element.find('.error-tips').text(errorText);
      },

      setPhotoP: function() {

        this.component.uploaderPhotoP = new FileUploader();

        var that = this;
        var callback = {
          onUploadSuccess: function(obj, data) {

            that.component.loading.hide();
            $('.error-tips').empty();
            $('#leftTip').empty();

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
              'F_EXCEED_SIZE': '电子照上传失败，大小请控制在5M以内'
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
            $('.error-tips').empty();
            $('#rightTip').empty();
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
              'F_EXCEED_SIZE': '电子照上传失败，大小请控制在5M以内'
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
        'SUBMITED': '用户已经下单，正在等待用户支付',
        'AUTO_CANCEL': '超时未支付，订单自动取消',
        'USER_CANCEL': '用户取消订单成功',
        'AUDITING': '订单正在等待顺丰审核',
        'OPERATION_CANCEL': '订单取消成功',
        'BUYING': '尊敬的用户，您的订单已经审核通过，不能修改。订单进入顺丰海外采购阶段',
        // 'BUYING_EXCEPTION': '采购异常',
        'WAIT_SHIPPING': '订单正在等待仓库发货',
        'SHIPPING': '您的订单正在顺丰海外仓进行出库操作。网上订单已被打印，目前订单正在等待海外仓库人员进行出库处理',
        // 'LOGISTICS_EXCEPTION': '物流异常',
        'SHIPPED': '尊敬的用户，您的订单已从顺丰海外仓出库完成，正在进行跨境物流配送',
        'COMPLETED': '用户确认收货，订单已完成',
        'AUTO_COMPLETED':'系统确认订单已签收超过7天，订单自动完成'
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
        "NEEDPAY": '<a href="#" class="btn btn-send" id="pay">立即支付</a>',
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
        'SHIPPING': '正在出库',
        'LOGISTICS_EXCEPTION': '物流异常',
        'SHIPPED': '已发货',
        'COMPLETED': '已完成',
        'AUTO_COMPLETED': '自动完成'
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
        'AUTO_CANCEL': '尊敬的客户，由于我们2小时内未收到您的订单款项，订单已被自动取消。<br />' +
          '订单取消规则：订单会为您保留2小时（从下单时间算起），2小时后系统将自动取消未付款的订单。',
        'USER_CANCEL': '尊敬的客户，您的订单已成功取消，期待您再次使用顺丰海淘。',
        'AUDITING': '尊敬的客户，您的订单正在等待顺丰海淘运营审核。',
        'OPERATION_CANCEL': '尊敬的客户，您的订单已成功取消，退款将会自动完成，请耐心等待。',
        'BUYING': '尊敬的客户，您的订单已经审核通过，不能修改。<br />' +
          '订单正在进行境外采购，请等待采购结果。',
        'WAIT_SHIPPING': '尊敬的客户，您的订单已经通过系统审核，不能修改。<br />' +
          '订单正在等待仓库发货。',
        'SHIPPING': '尊敬的客户，您的订单正在顺丰海外仓进行出库操作。。<br />' +
          '网上订单已被打印，目前订单正在等待海外仓库人员进行出库处理。',
        'SHIPPED': '尊敬的客户，您的订单已从顺丰海外仓出库完成，正在进行跨境物流配送。',
        'COMPLETED': '尊敬的客户，您的订单已经完成，感谢您在顺丰海淘购物。',
        'AUTO_COMPLETED':'尊敬的用户，您的订单已经签收超过7天，已自动完成。期待您再次使用顺丰海淘'
      },

      "#orderdetail-view click": function(element, event) {
        $(".orderdetail-upload").show();
        $(".mask2").show();
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
            alert("保存成功");
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
      },

      '#pay click': function(element, event) {
        event && event.preventDefault();
        var that = this;
        var callback = {
          error: function() {
            var message = new SFMessage(null, {
              'tip': '支付失败！',
              'type': 'error',
              'okFunction': function(){that.render();}
            });
          }
        }

        var params = can.deparam(window.location.search.substr(1));
        SFOrderFn.payV2({
          orderid: params.orderid
        }, callback)
      }

    });
  })