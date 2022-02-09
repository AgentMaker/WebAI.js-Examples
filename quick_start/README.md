# WebAI.js 快速使用
中文版 | [English](./README_EN.md)

## 1. 简介
* 本教程以人脸检测模型为例，简单介绍如何使用 WebAI.js 在网页前端完成模型部署

* 作为演示，示例网页的搭建非常简单，只包含一个简单的 HTML 网页

## 2. 编写网页
* 网页比较简单，其中只包含如下几个元素:

    * 上传按钮：用于上传图像

    * 画布：用于绘制结果图像

    * 隐藏的图像：用于读取图像

    * 两个 JavaScript 脚本：一个用于加载 WebAI.js，另一个用于实现网页的功能

* 具体的代码如下：

    ```html
    <!-- index.html -->
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>WebAI.js PaddleDet Example</title>
    </head>
    <body>
        <div>
            Image:
            <!-- 上传按钮 -->
            <input type="file" accept="image/*" id="inputFile" disabled='true'>
        </div>
        <div>
            <!-- 图像元素 -->
            <img src="" alt="" id="imgDom" style="display: none">

            <!-- 画布元素 -->
            <canvas id='canvasDom'></canvas>
        </div>

        <!-- 加载 WebAI.js -->
        <script src='https://cdn.jsdelivr.net/npm/webai-js/dist/webai.min.js'></script>

        <!-- 功能脚本 -->
        <script>
        // 获取各个网页元素
        const imgDom = document.getElementById('imgDom')
        const canvasDom = document.getElementById('canvasDom')
        const inputFile = document.getElementById('inputFile')

        // 设置模型的路径
        const modelURL = './blazeface_1000e/model.onnx'
        const modelConfig = './blazeface_1000e/configs.json'

        // 当窗口加载完成时
        window.onload = async function (e) {
            // 加载模型
            window.model = await WebAI.Det.create(modelURL, modelConfig)

            // 启用图片上传按钮
            inputFile.disabled = false
        }

        // 当上传的图像改变时
        inputFile.onchange = function (e) {
            // 设置图像
            if (e.target.files[0]) {
                imgDom.src = URL.createObjectURL(e.target.files[0])
            }
        }

        // 当图像完成加载时
        imgDom.onload = async function (e) {
            // 读取图像
            let imgRGBA = cv.imread(imgDom)

            // 获取检测结果
            let bboxes = await model.infer(imgRGBA)

            // 绘制检测结果
            let imgShow = await WebAI.drawBBoxes(imgRGBA, bboxes)

            // 显示结果图像
            cv.imshow(canvasDom, imgShow)

            // 删除图像对象
            imgRGBA.delete()
            imgShow.delete()
        }
        </script>
    </body>
    </html>
    ```

## 3. 网页部署
1. 克隆 WebAI.js-Examples 项目：

    ```bash
    $ git clone https://github.com/AgentMaker/WebAI.js-Examples
    ```

2. 切换至示例目录：

    ```bash
    $ cd ./quick_start
    ```

3. 启动服务器：

    ```bash
    $ npx light-server -s . -p 8080
    ```

4. 通过浏览器访问网页：http://localhost:8080/

## 4. 网页预览
* 部署完成的网页预览图如下：

    ![](https://ai-studio-static-online.cdn.bcebos.com/b73ec8fabedc40abaecc9941e574ddf9383267aca41c44289c736ddc12c09037)