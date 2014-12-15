##引用基础框架包

1、使用script标签在html文件中引入压缩后的文件sf.web.ver1.0.build1418273546702.js

    该文件包含了常用的库函数和所有接口生成的API接口文件。

2、使用该压缩文件中的模块

    因为该文件中的API接口在定义时候都有了包名，所以在直接使用script标签引入sf.web.ver1.0.build1418273546702.js文件后就可以使用如下方式去访问了

    ```
    define(['sf.b2c.mall.api.user.webLogin', 'sf.b2c.mall.api.user.getRecAddressList', 'sf.b2c.mall.util.utils', 'sf.b2c.mall.util.testUtils'], function(SFUserWebLogin, SFGetRecAddressList, utils, testUtils) {
    ...
    })
    ```

##使用QINIU作为fixture数据

1. 在`fixture`中编辑接口模拟数据，以`fixture/sf.b2c.mall.fixture.b2cmall.getFastSaleInfoList.json`为例

    ```
    {
      "stat": {
        "cid": "a:4426e0|t:78|s:1418613503146",
        "code": 0,
        "stateList": [{
          "code": 0,
          "length": 1468,
          "msg": "成功"
        }],
        "systime": 1418613503232
      },
      "content": [
        {
          "pageIndex": 1,
          "pageSize": 36,
          "hasMore": true,
          "totalCount": 360,
          "totalPageCount": 10,
          "fastSaleInfos": [{
            "title": "COACH Madison 单肩包",
            "subTitle": "白色 上等牛皮 有质感 光泽度好 手感极佳",
            "imgUrl": "79b18fd4-c4f2-4cec-a597-5d67fa6e5900.png",
            "link": "http://www.sfht.com/detail.html?sku=199911",
            "fastSaleContentType": "PRODUCT",
            "homePageProductInfo": {
              "skuId": "199911",
              "saleId": "28931",
              "showNationalUrl": "http://www.sfht.com/images/america.jpg"
            },
            "homepageTopicInfo": "null"
          },{
            "title": "Gerber美国嘉宝3段苹果肉桂燕麦米粉 227g",
            "subTitle": "宝宝第一辅食选择，美国原装营养燕麦米粉，营养丰富易吸收",
            "imgUrl": "aus/images/I/81ImExhVRAL._SL1500_.jpg",
            "link": "http://www.sfht.com/detail.html?sku=198637",
            "fastSaleContentType": "PRODUCT",
            "homePageProductInfo": {
              "skuId": "198637",
              "saleId": "17931",
              "showNationalUrl": "http://www.sfht.com/images/america.jpg"
            },
            "homepageTopicInfo": "null"
          }]
        }
      ]
    }
    ```
2. 将`json`文件上传到[`QINIU`](https://portal.qiniu.com/signin)，登录用户名和密码
    ```
    用户名: leewind1981209@gmail.com
    密码: 13512172423
    ```
3. 登录之后在[上传文件](https://portal.qiniu.com/bucket/mdocshare/resource#1)中提交`json`文件
