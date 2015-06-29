'use strict';

define('sf.b2c.mall.center.invitationcontent', [
    'can',
    'jquery',
    'qrcode',
    'sf.helpers',
    'canvasjs',
    'sf.b2c.mall.widget.message',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.component.bindalipay',
    'sf.b2c.mall.api.user.getUserInfo',
    'sf.b2c.mall.api.user.getCashActInfo',
    'sf.b2c.mall.api.user.getCashActTransList',
    'sf.b2c.mall.api.user.rqCash',
    'text!template_center_invitationcontent'
  ],
  function(can, $, qrcode, helpers, canvasjs, SFMessage, SFConfig, SFBindalipay, SFGetUserInfo, SFGetCashActInfo, SFGetCashActTransList, SFRqCash, template_center_invitationcontent) {

    return can.Control.extend({

      helpers: {
        hasIncome: function(infoList, options) {
          if (infoList.length > 0) {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        }
      },

      init: function(element, options) {
        this.render();
      },

      render: function() {
        this.data = {};
        var that = this;

        var getCashActInfo = new SFGetCashActInfo();
        var getCashActTransList = new SFGetCashActTransList({
          "pgIndex": 0,
          "pgSize": 100
        });

        can.when(getCashActInfo.sendRequest(), getCashActTransList.sendRequest())
          .done(function(mainInfo, infoList) {

            that.data = _.extend(that.data, mainInfo);
            var renderFn = can.mustache(template_center_invitationcontent);
            that.options.html = renderFn(that.data, that.helpers);
            that.element.html(that.options.html);
            that.supplement();
          })
          .fail(function(error) {
            console.error(error);
            var mainInfo = {
              "bindAliAct": null,
              "lastestIncome": "200",
              "totalIncome": 400,
              "actBalance": "10000"
            }
            var infoList = {
              "infos": [{
                "income": 100,
                "reason": "abc",
                "gmtOrder": "2015-05-15 14:43:42",
                "gmtCreate": "2015-05-15 14:43:42"
              }]
            }

            that.data = _.extend(that.data, mainInfo);
            that.data.infoList = infoList.infos;
            var renderFn = can.mustache(template_center_invitationcontent);
            that.options.html = renderFn(that.data, that.helpers);
            that.element.html(that.options.html);
            that.supplement();
          })
      },

      supplement: function() {
        this.renderQrcode();
        this.renderChart();
      },

      renderChart: function() {
        var dataPoints = [];
        _.each(this.data.infoList, function(item) {
          dataPoints.push({
            x: new Date(item.gmtCreate.substring(0, 4), parseInt(item.gmtCreate.substring(5, 7), 10) - 1, item.gmtCreate.substring(8, 10)),
            y: item.income,
            indexLabel: item.income + "",
            indexLabelFontColor: "#FF9E36",
            markerColor: "#FF9E36"
          });
        })

        var chart = new CanvasJS.Chart("chartContainer", {
          theme: "theme4",
          animationEnabled: true,
          axisX: {
            valueFormatString: "MM.DD",
            interval: 1,
            intervalType: "day",
            lineColor: "#50E3C2",
            lineDashType: "dash",
            labelFontColor: "#50E3C2",
            tickColor: "#50E3C2",
            tickThickness: 1,
            labelAngle: -45

          },
          axisY: {
            includeZero: false,
            lineColor: "#fff",
            labelFontColor: "#fff",
            tickColor: "#fff"

          },
          data: [{
            type: "line",
            lineThickness: 4,
            color: "rgba(255,158,54,0.15)",
            dataPoints: dataPoints
          }]
        });

        chart.render();
        $(".canvasjs-chart-credit")[0].style.display = "none";
      },

      /** 渲染二维码 */
      renderQrcode: function() {
        var getUserInfo = new SFGetUserInfo();
        getUserInfo.sendRequest()
          .done(function(userinfo) {
            var url = "http://www.sfht.com?_src=" + userinfo.userId;
            var qrParam = {
              width: 125,
              height: 125,
              text: url
            };

            $('#shareURLQrcode').html("").qrcode(qrParam);
            $('#urlinput').val(url);
          })
          .fail()
      },

      '#getmoney click': function(element, event) {
        var that = this;

        if (!this.data.bindAliAct) {
          new SFBindalipay();
        } else {
          if (this.data.actBalance < 5000) {
            var message = new SFMessage(null, {
              'tip': '您的账户余额少于50元，无法提现！',
              'type': 'error'
            });
          } else {
            var rqCash = new SFRqCash();
            rqCash.sendRequest()
              .done(function(data) {
                if (data.value) {
                  var message = new SFMessage(null, {
                    'tip': '提现成功！',
                    'type': 'success'
                  });
                }
              })
              .fail(function(error) {
                console.error(error);
                var message = new SFMessage(null, {
                  'tip': that.errorMap[error] || '提现失败！',
                  'type': 'error'
                });
              })
          }
        }

      },

      "#switchwiew click": function(element, event){
        $('.invite-account-b').toggleClass('active');
      },

      errorMap: {
        1000420: '尚未绑定支付宝账户',
        1000430: '未达到提现金额限制'
      },

      '#gotohome click': function() {
        window.location.href = "http://www.sfht.com";
      }

    });
  })