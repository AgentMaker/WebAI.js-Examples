# WebAI.js 示例
[English](./README.md) | 中文版

## 1. 介绍
* 这个项目中包含了多个 WebAI.js 的示例

    |类型|示例|
    |:-:|:-:|
    |Face Detection|[ppdet](./ppdet)|
    |ImageNet Classification|[ppcls](./ppcls)|
    |Human Segmentation|[ppseg](./ppseg)|

## 2. 使用
* 克隆项目：

    ```bash
    $ git clone https://github.com/AgentMaker/WebAI.js-Examples
    ```

* 切换至示例目录，比如 './ppdet'：

    ```
    $ cd ./ppdet
    ```

* 在代码中修改模型路径:

    ```js
    // ./ppdet/main.js
    // 模型和配置文件最好放置于 'public' 目录下

    ...
    const modelURL = './blazeface_1000e/model.onnx'
    const modelConfig = './blazeface_1000e/configs.json'
    ...
    ```

* 安装依赖:

    ```bash
    $ npm install
    ```

* 开发网页:

    ```bash
    $ npm run dev
    ```

* 构建网页:

    ```bash
    $ npm run build
    ```

* 预览构建完成的网页:

    ```bash
    $ npm run preview
    ```

* 构建网页至 '../docs' 目录中:

    ```bash
    $ npm run build:docs
    ```

* 部署网页至 Github/Gitee Page:

    1. fork 这个项目

    2. 完成网页开发

    3. 构建网页至 '../docs' 目录中

    4. 启用项目的 Page 功能

    5. 设置 '../docs' 目录为 Page 功能的源目录