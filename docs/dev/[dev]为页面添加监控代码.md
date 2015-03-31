# [dev]为页面添加监控代码

1. 在`sf.b2c.mall.page.xxx.js`依赖代码中加入`'sf.util'`模块

```
define(
  'sf.b2c.mall.page.detail',
  [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.product.breadscrumb',
    'sf.b2c.mall.product.detailcontent',
    'sf.util',
    'sf.b2c.mall.business.config'
  ]
```

2. 在入口添加监控代码`SFFn.monitor();`

```
function(can, $, SFFrameworkComm, Header, Footer, Breadscrumb, DetailContent, SFFn) {
    SFFrameworkComm.register(1);
    SFFn.monitor();
```