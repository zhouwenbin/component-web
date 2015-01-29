### [dev]API接口生成

##### 安装环境

1. 安装nodejs环境
2. 安装npm环境
3. 安装bower包管理器


##### 引用配置

1. 安装npm的依赖包
  ```
  npm install
  ```
2. 生成api接口文档
  ```
  grunt create
  ```
3. 这样就在`app/scripts/api/`目录下就生成了需要的接口文件
4. 在`sf.b2c.mall.require.config.js`里配置接口文件，例如
  ```
  'sf.b2c.mall.api.order.submitOrder': 'scripts/api/sf.b2c.mall.api.order.submitOrder',
  ```
5. 在需要引用的地方引用接口，例如
  ```
  [
    'jquery',
    'can',
    'underscore',
    'sf.b2c.mall.api.order.requestPayV2'
  ],
  ```