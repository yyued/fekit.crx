# fekit.crx

> chrome插件 前端工具箱


### <a name="top"></a>目录
* [主要功能](#intro)
* [开发环境](#sys-env)
* [文件结构](#file-tree)
* [任务说明](#task-dtls)
* [License](#license)


### <a name="intro"></a>主要功能 [[⬆]](#top)
插件地址：[fekit 0.1.1][fekit]

这是一个前端工具箱的Chrome插件：
* 代码压缩、格式化
* base64转码
* 二维码生成
* 正则表达式
* 其他辅助工具：设计师颜色标注、css代码片段生成


### <a name="sys-env"></a>开发环境 [[⬆]](#top)
1. Node 环境：*默认此步骤已完成*  （Mac建议使用 [Brew] 安装 [Node.js]） 
2. 公共模块：`npm install -g gulp webpack`


### <a name="file-tree"></a>文件结构 [[⬆]](#top)
`generator-lego` 初始化和执行任务涉及的文件结构：

```
.
├── dest/
├── node_modules/
├── scripts/
├── tasks/
├── gulpfile.js
├── src/
│   ├── biz/
│   ├── css/
│   ├── img/
│   ├── js/
│   │   ├── lib/
│   │   ├── node_modules/
│   │   └── package.json
│   ├── main.html
│   └── manifest.json
│
├── webpack.config.js
└── package.json

```


### <a name="task-dtls"></a>任务说明 [[⬆]](#top)
#### 初始化项目
* 执行`npm i`，拉取依赖模块

#### 开发
* `gulp` 创建一个链接，自动检测`src`文件夹下的静态文件，自动刷新。

#### 调试
* 在页面`chrome://extensions/`点击`加载已解压的扩展程序`，选择`src`目录。

#### 打包
* `gulp zip` 执行文件压缩、文件过滤，生成可直接发布成插件的压缩包。


### <a name="license"></a>License [[⬆]](#top)
Released under [MIT] LICENSE


---
[Brew]: http://brew.sh/
[Node.js]: http://nodejs.org/
[gulp]:https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#getting-started
[MIT]: http://rem.mit-license.org/
[fekit]: https://chrome.google.com/webstore/detail/fekit/nfjjcdimlmacifcilpamgfneddoianpj?hl=zh-CN&gl=CN