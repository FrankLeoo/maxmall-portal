# MaxMall-Portal 前端项目
## 简介
该项目为MaxMall分销系统管理平台-web，基于Vue+Element实现。主要包括商品管理、订单管理、营销管理、会员管理、统计报表、财务管理、权限管理、设置等功能。由于首次使用vue开发项目，代码中没有使用组件化开发 在以后进度中会慢慢优化vue组件。
## 项目演示
演示地址：[http://106.52.183.251/](http://106.52.183.251/)
![1.gif](https://github.com/FrankLeoo/maxmall/blob/master/document/系统微服务/1.gif)

![2.gif](https://github.com/FrankLeoo/maxmall/blob/master/document/系统微服务/2.gif)

![3.gif](https://github.com/FrankLeoo/maxmall/blob/master/document/系统微服务/3.gif)

![4.gif](https://github.com/FrankLeoo/maxmall/blob/master/document/系统微服务/4.gif)

## 技术选型

| 技术 | 说明 | 官网 |
| --- | --- | --- |
| Vue | 前端框架 | [https://vuejs.org/](https://vuejs.org/) |
| Vue-router | 路由框架 | [https://router.vuejs.org/](https://router.vuejs.org/) |
| Vuex | 全局状态管理框架 | [https://vuex.vuejs.org/](https://vuex.vuejs.org/) |
| Element | 前端UI框架 | [https://element.eleme.io/](https://element.eleme.io/) |
| Axios | 前端HTTP框架 | [https://github.com/axios/axios](https://github.com/axios/axios) |
| v-charts | 基于Echarts的图表框架 | [https://v-charts.js.org/](https://v-charts.js.org/) |
| Js-cookie | cookie管理工具 | [https://github.com/js-cookie/js-cookie](https://github.com/js-cookie/js-cookie) |
| nprogress | 进度条控件 | [https://github.com/rstacruz/nprogress](https://github.com/rstacruz/nprogress) |
| vue-element-admin | 项目脚手架参考 | [https://github.com/PanJiaChen/vue-element-admin](https://github.com/PanJiaChen/vue-element-admin) |

## 项目架构
```
src -- 源码目录
├── api -- axios网络请求定义
├── assets -- 静态图片资源文件
├── components -- 通用组件封装
├── icons -- svg矢量图片文件
├── router -- vue-router路由配置
├── store -- vuex的状态管理
├── styles -- 全局css样式
├── utils -- 工具类
└── views -- 前端页面
    ├── home -- 首页
    ├── layout -- 通用页面加载框架
    ├── login -- 登录页
    ├── oms -- 订单模块页面
    ├── pms -- 商品模块页面
    └── sms -- 营销模块页面
```
## 开发

```source-shell
# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```
浏览器访问 [http://localhost:9527](http://localhost:9527/)

## 发布
```
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```
