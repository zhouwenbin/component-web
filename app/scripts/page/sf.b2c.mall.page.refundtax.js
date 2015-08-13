define(
	'sf.b2c.mall.page.refundtax', [
		'can',
		'jquery',
		'sf.b2c.mall.framework.comm',
		'sf.util',
		'sf.b2c.mall.business.config',
		'sf.b2c.mall.api.finance.createRefundTax',
		'sf.b2c.mall.api.order.getOrderV2',
		'plupload'
	],
	function(can, $, SFFrameworkComm, SFFn, SFBusiness, SFCreateRefundTax, SFGetOrderV2, plupload) {

		SFFrameworkComm.register(1);
		SFFn.monitor();

		var refundtax = can.Control.extend({


			init: function(options) {
				var that = this;
				$('#errorAlipayAccount').hide();
				var params = can.deparam(window.location.search.substr(1));

				var getOrder = new SFGetOrderV2({
					"orderId": params.orderid
				});

				getOrder.sendRequest()
					.done(function(data) {
						that.options.data = new can.Map(data);
					});


			},
			'#alipayaccount blur': function(element, event) {
				var alipayAccount = $(element).val();
				this.checkAlipayAccount(alipayAccount);
			},
			'alipayname blur': function(element, event) {
				var alipayname = $(element).val();
				if (!alipayname) {
					$('#errorAlipayAccount').show();
				}
			},
			checkAlipayAccount: function(account) {
				var isTelNum = /^1\d{10}$/.test(account);
				var isMail = /^([a-zA-Z0-9-_]*[-_\.]?[a-zA-Z0-9]+)*@([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)+[\.][a-zA-Z]{2,3}([\.][a-zA-Z]{2})?$/.test(account);
				if (!account) {
					$('#errorAlipayAccount').text('请输入支付宝账号').show();
				} else if (!isTelNum || !isMail) {
					$('#errorAlipayAccount').show();
					return false;
				} else {
					$('#errorAlipayAccount').hide();
					return true;
				}
			},
			'.btn-refer-tax click': function(element, event) {
				event && event.preventDefault();
				var params = can.deparam(window.location.search.substr(1));
				var alipayAccount = $('#alipayaccount').val();
				var alipayname = $('#alipayname').val();
				var buyerName = this.options.data.orderItem.orderAddressItem.receiveName;
				var buyerTelephone = this.options.data.orderItem.orderAddressItem.telephone;
				if (this.checkAlipayAccount && alipayname) {
					var params = can.deparam(window.location.search.substr(1));

					var createRefundTax = new SFCreateRefundTax({
						'bizId': params.bizId,
						'masterBizId': params.orderid,
						'mailNo': params.mailNo,
						'buyerName': buyerName,
						'buyerTelephone': buyerTelephone,
						'alipayAccount': alipayAccount,
						'alipayUserName': alipayname,
						'url':
					});

					createRefundTax.sendRequest()
						.done(function() {

						})
				};
			},

			//初始化图片上传控件
			initPic: function() {

				// 如果有照片就只能查看了
				if (this.options.imgData && this.options.imgData.length > 0) {
					this.view = true;
					this.listImg();
					$(".comment-add-img-del").remove();
					$("#pickbutton").hide();
					$("#imgtip1").css({
						"visibility": "hidden"
					});
					$("#imgtip2").css({
						"visibility": "hidden"
					});
					return false;
				}

				// 如果查看状态下没有图片 则不展示任何东西
				if (this.options.view && (!this.options.imgData || this.options.imgData.length == 0)) {
					$("#img").remove();
					return false;
				}

				// 如果没有照片，则可以上传图片
				var that = this;

				that.imgCount = 0;
				var filename = "天朝进贡-banner-H5.jpg";
				// 上传组件
				var plupload = new window.plupload.Uploader({
					runtimes: "gears,html5,flash",
					browse_button: "pickbutton",
					file_data_name: 'CPRODUCT_IMG' + filename.substring(filename.lastIndexOf("."), filename.length),
					urlstream_upload: true,
					container: "img",
					max_file_size: "4mb",
					multipart_params: {
						fileVal: 'CPRODUCT_IMG' + filename.substring(filename.lastIndexOf("."), filename.length)
					},
					url: SFBizConf.setting.api.fileurl + "?_aid=1",
					flash_swf_url: "../img/plupload.flash.swf?r=" + Math.random(),
					silverlight_xap_url: "../img/plupload.silverlight.xap",
					filters: [{
						title: "Image files",
						extensions: "jpg,jpeg,gif,png,bmp"
					}]
				});

				plupload.bind("Init", function() {
					for (var i = 1; 5 >= i; i++) {
						$("input[name=imgs" + i + "]").val("");
					}
					$("#pickbutton").show();
				});

				plupload.bind("FilesAdded", function(a, uploadingFiles) {
					var imglistUl = $(".img-list-ul");
					var imglistLi = $("li", imglistUl);
					var uploadBtn = $(".upload-btn");
					if (imglistLi.length + uploadingFiles.length > 5) {
						return false;
					} else if (imglistLi.length + uploadingFiles.length == 5) {
						$(".comment-add-img-add").hide();
					}

					_.each(uploadingFiles, function(item) {
						var itemHTML = '<li id="' + item.id + '"><span>0%</span><a href="javascript:" class="comment-add-img-del">X</a></li>';
						$(itemHTML).appendTo(imglistUl);
					})
				});

				plupload.bind("UploadProgress", function(a, uploadingFile) {
					var delHTML = "";
					if (100 == uploadingFile.percent) {
						// delHTML = '<em value="删除">X</em>';
						delHTML = '<span>0%</span>';
					} else {
						// delHTML = "<span>" + uploadingFile.percent + "%</span>";
						delHTML = '<a href="javascript:" class="comment-add-img-del">X</a>';
					}

					$("#" + uploadingFile.id + " .del").html(delHTML);
				});

				plupload.bind("UploadFile", function() {});

				plupload.bind("UploadComplete", function() {
					$("#divFileProgressStatus").slideUp(1500)
				});

				plupload.bind("Error", function(a, b) {
					var c = {
						e100: "\u51fa\u73b0\u901a\u7528\u9519\u8bef\u3002",
						e200: "\u51fa\u73b0Http\u9519\u8bef\u3002",
						e300: "\u51fa\u73b0IO\u9519\u8bef\u3002",
						e400: "\u51fa\u73b0\u5b89\u5168\u8ba4\u8bc1\u9519\u8bef\u3002",
						e500: "\u51fa\u73b0\u63a7\u4ef6\u521d\u59cb\u5316\u9519\u8bef\u3002",
						e600: "\u51fa\u73b0\u9009\u62e9\u6587\u4ef6\u5c3a\u5bf8\u4e0d\u7b26\u5408\u9519\u8bef\u3002",
						e601: "\u51fa\u73b0\u9009\u62e9\u6587\u4ef6\u7c7b\u578b\u4e0d\u5339\u914d\u9519\u8bef\u3002",
						e700: "\u51fa\u73b0\u9009\u62e9\u56fe\u7247\u683c\u5f0f\u4e0d\u5339\u914d\u9519\u8bef\u3002",
						e701: "\u51fa\u73b0\u9009\u62e9\u56fe\u7247\u5185\u5b58\u95ee\u9898\u3002",
						e702: "\u51fa\u73b0\u9009\u62e9\u56fe\u7247\u5c3a\u5bf8\u4e0d\u5339\u914d\u9519\u8bef\u3002"
					};
					var d = c["e" + (0 - b.code)];
					"" != a.runtime && (SFFn.tip("\u4e0a\u4f20\u6587\u4ef6" + d), $("#" + b.file.id).remove(), a.stop())
				});

				plupload.bind("QueueChanged", function(a) {
					plupload.start()
				});

				plupload.bind("FileUploaded", function(a, file, result) {
					var response = result.response;
					if ("" != response) {
						var filename = JSON.parse(response).content[0]["CPRODUCT_IMG.jpg"];
						var imgURL = that.imgPrefix + filename;
						that.setValue(file.id, imgURL)
					} else {
						$("#" + file.id).remove();
						plupload.stop();
					};

					if (file.size > 0) {
						$("#" + file.id).children("b").html("<em>X</em>")
					} else {
						$("#" + file.id).remove();
					}
				})

				plupload.init();
			},

		});
		new refundtax('body');
	})