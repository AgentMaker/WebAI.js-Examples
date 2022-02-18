# PaddleDetection 模型导出和 WebAI.js 部署
中文版 | [English](./README_EN.md)

## 1. 介绍
* 本教程将介绍如何使用 PaddleDetection 套件导出推理模型并使用 WebAI.js 部署到网页前端

## 2. 导出 Paddle 推理模型
* PaddleDetection 的导出脚本位于 PaddleDetection/tools/export_model.py

* 更多详细的使用方法可参考 [PaddleDetection 官方文档](https://github.com/PaddlePaddle/PaddleDetection/blob/release/2.3/deploy/EXPORT_MODEL.md)

* 作为演示，所以使用官方提供的 [PPYOLO tiny](https://github.com/PaddlePaddle/PaddleDetection/blob/release/2.3/configs/ppyolo/README_cn.md#pp-yolo-tiny%E6%A8%A1%E5%9E%8B) 预训练模型进行导出，具体步骤如下：

1. 克隆 PaddleDetection 代码

    ```bash
    $ git clone https://github.com/PaddlePaddle/PaddleDetection --depth 1
    ```

2. 切换工作目录

    ```bash
    $ cd ./PaddleDetection
    ```

3. 安装依赖

    ```bash
    $ pip install -r requirements.txt
    ```

4. 导出 Paddle 格式的推理模型

    ```bash
    # 使用脚本时通过命令行参数指定模型的配置文件、预训练模型、保存目录和当前运行的设备类型

    $ python tools/export_model.py \
        -c configs/ppyolo/ppyolo_tiny_650e_coco.yml \
        --output_dir=../inference_model \
        -o weights=https://paddledet.bj.bcebos.com/models/ppyolo_tiny_650e_coco.pdparams \
        use_gpu=False
    ```

## 3. 转换为 ONNX 模型
1. 安装 Paddle2ONNX

    ```bash
    $ pip install paddle2onnx
    ```

2. 模型转换

    ```bash
    # 使用时通过命令行参数指定 Paddle 推理模型的模型路径、模型文件名、参数文件名、保存文件路径和 ONNX 算子集的版本

    $ paddle2onnx \
        --model_dir ../inference_model/ppyolo_tiny_650e_coco \
        --model_filename model.pdmodel \
        --params_filename model.pdiparams \
        --save_file ../inference_model/ppyolo_tiny_650e_coco/model.onnx \
        --opset_version 12
    ```

## 4. 生成配置文件

1. 使用配置文件转换器

    * [WebAI 的体验网站](https://agentmaker.github.io/WebAI.js) 中包含一个配置文件转换生成器

    * 可通过这个程序快速将 PaddleDetection 的配置文件转换为 WebAI.js 推理所需的配置文件

    * 转换器目前仍在持续开发中，目前可能无法兼容所有 PaddleDetection 的配置文件

    * PaddleDetection 导出的推理配置文件位于 ./inference_model/infer_cfg.yml

2. 手动编写配置文件，样例如下：

    ```json
    // configs.json
    {
        "Preprocess": [
            {
                "type": "Decode", // 图像解码
                "mode": "RGB" // RGB 或 BGR
            },
            {
                "type": "Resize", //  图像缩放
                "interp": 1, // 插值方式
                "keep_ratio": false, // 保持长宽比
                "limit_max": false, // 限制图片的最大尺寸
                "target_size": [300, 300] // 目标尺寸 [H, W]
            },
            /*
            {
                "type": "Crop", // 图像中心裁切
                "crop_size": [224, 224] // 目标尺寸 [H, W]
            },
            */
            {
                "type": "Normalize", // 归一化
                "is_scale": false, // 是否缩放 (img /= 255.0)
                "mean": [127.5, 127.5, 127.5], // 均值
                "std": [127.5, 127.5, 127.5] // 标准差
            },
            {
                "type": "Permute" // 转置 (HWC -> CHW)
            }
        ],
        "label_list": [
            "aeroplane", "bicycle", "bird", "boat", "bottle", "bus", "car", 
            "cat", "chair", "cow", "diningtable", "dog", "horse", "motorbike", 
            "person", "pottedplant", "sheep", "sofa", "train", "tvmonitor"
        ] // 标签列表
    }
    ```

## 5. 快速部署
1. 克隆 WebAI.js-Examples 项目：

    ```bash
    $ git clone https://github.com/AgentMaker/WebAI.js-Examples
    ```

2. 切换至示例目录：

    ```bash
    $ cd ./ppdet
    ```

3. 目录结构：

    ```yaml
    - public # 服务器公开目录
      - blazeface_1000e # 模型文件目录
        - configs.json # 配置文件
        - model.onnx # 模型文件
    - index.html # 网页
    - main.js # 功能代码
    - package.json # 项目配置文件
    ```

4. 项目详情：
    * 网页中包含如下几个简单组件：

        * 图像上传按钮：用于上传图像

        * 隐藏图像：用于读取图像

        * 画布：用于显示检测结果图像

        * 功能代码：用于实现功能

    * 网页功能：

        1. 加载目标检测模型

        2. 对上传的图像进行目标检测

        3. 将检测结果图像输出显示至网页中

    * 网页预览：

        ![](https://ai-studio-static-online.cdn.bcebos.com/85a139fb6502485e82bbe1325ebda34329ceae2270ed4fc3a98475f45a1e38d8)
    
    * 更多详情请参考代码实现：[index.html](index.html) / [main.js](main.js)

5. 在代码中修改模型路径:

    ```js
    // main.js
    // 模型和配置文件建议放置于 'public' 目录下，使用路径 '/*' 即可以引用该目录中的文件

    ...
    const modelURL = "/inference_model/model.onnx"
    const modelConfig = "/inference_model/configs.json"
    ...
    ```

6. 安装依赖:

    ```bash
    $ npm install
    ```

7. 开发网页:

    ```bash
    $ npm run dev

    # 通过浏览器访问 http://localhost:3000 来查看和测试网页
    ```

8. 构建网页:

    ```bash
    $ npm run build
    ```

9. 预览构建完成的网页:

    ```bash
    $ npm run preview

    # 通过浏览器访问 http://localhost:5000 来预览构建完成的网页
    ```

10. 构建网页至 '../docs' 目录中:

    ```bash
    $ npm run build:docs
    ```

11. 部署网页至 Github/Gitee Page:

    1. fork 这个项目

    2. 完成网页开发

    3. 构建网页至 '../docs' 目录中

    4. 启用项目的 Page 功能

    5. 设置 '../docs' 目录为 Page 功能的源目录
