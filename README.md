# POE CN Export
POE腾讯服务器数据导出工具，主要提供：

- 支持导出BD到社区版POB
- 可装备物品中译英
- 基础数据库中英查询

# Dev

本项目使用`electron`和`vue`进行开发，因为`electron`使用到的是`vue`的编译结果，固然能将两部分合在一起，但不利于开发、阅读。

因此选择拆分为`main`和`renderer`两部分，两者都是可以独立开发调试的子项目，完整的开发调试模式需要先执行`renderer`的`yarn dev`，再执行`main`的`yarn dev`。

## 环境要求

要求以下开发环境：

- Node.js 18.0.0 及其以上版本