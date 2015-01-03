##发布测试

example: [http://121.40.196.70/jira/browse/RELEASE-37](http://121.40.196.70/jira/browse/RELEASE-37)\

+ merge开发的代码到test分支
+ 准备好本次修复的bug列表
+ 进入jira，点击导航栏上"创建问题按钮"
+ 填写内容
    + 项目选择: "顺丰海淘发布管理"
    + 问题类型选择: "任务提测"
    + 主题: 本次提测的内容模块
    + 服务名: github上的项目名称，我们是haitao-b2c-web
    + 经办人: 写具体负责发布的测试人员
    + 描述: 本次发布的修复的bug
    + 提测版本号: git上的hash号
    + 其他按文字内容选，部署顺序写："部署haitao-b2c-web 切换到test分支获取最新代码 运行命令grunt build "
    + 自测是否完成写dev上的地址，并且注释测试的页面
    + 最后写到期日
+ 和测试人员确认发布情况