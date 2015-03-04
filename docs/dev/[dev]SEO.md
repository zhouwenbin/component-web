
+ 有更多内容的话，在下面放一个a标签，点击a标签能加载到更多的内容，同样可以被爬虫爬到

这些是影响SEO排名的因素，更加重要的是竞价

1. 关键字个数
2. title标签
3. 页面的重要性（PR）
4. 带连接图片的alt说明（很多不写alt的朋友注意了哦，想想图片为什么会被百度搜到）
5. 页面上含有特殊标记的文字和链接
6. 页面的大小
7. 页面链接个数
8. 链接的目录结构

建议

1. 修改长的链接变成层数少的短连接
2. 处理好页面上的元素
3. title要包含关键字，尤其是专题和栏目
4. 出现图片就必须带上alt
5. 栏目专题页面上尽量多的添加关键字，不要超过70个
6. 合理利用h1与meta
7. 控制页面大小，70-80最佳
8. 在pr高的页面添加外链（可遇不可求啊），可以互换链接
9. 作弊要谨慎，交友要慎重，一个道理
10. 政府/学校虽然PR值虽然低，但是百度会特别关注，所以我们去和做学院网站的学生联系吧，很便宜的


webapp方案

每个页面都是一个动态页面，并且包含lizard-config关键配置
webapp流程（单页跳转方式）
l 根据url向服务端发get请求，拿到对应动态页面编译后的HTML字符串
l 解析字符串中的lizard-config配置，请求数据、渲染模板
l 根据lizard-config中的controller配置，拿到对应视图的构造函数，根据上一步渲染好的视图节点完成View的实例化
l 显示新的视图
（首页载入）
l 请求页面document文档，下载JS,CSS等资源
l 解析页面中的lizard-config配置，后面的步骤同频道见跳转

SEO方式
携程的URL规则为，真实应用均部署于webapp目录下，投放的URL为html5/....即把真实应用路径从webapp提换为html5
SEO流程为
html5 请求首先到Ctrip负载均衡器，
负载均衡判断如果路径为html5/channel规则的路由到SEO服务器，否则路由到业务的web应用
SEO服务器吧html5提换为webapp拿到html字符串
SEO根据拿到的字符串解析lizardconfig 拿数据，渲染，把渲染好的 html提换到原html的对应位置，最终的html作为http response返回

SEO下，其实是在做字符串操作

由于是.net调用V8所以和服务端渲染相关的前端JS代码都不能使用BOM或者DOM方法，如果用NODE做会比Ctrip的方式灵活一些