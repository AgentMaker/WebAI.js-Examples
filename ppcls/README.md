# PaddleClas 模型导出和 WebAI.js 部署
中文版 | [English](./README_EN.md)

## 1. 介绍
* 本教程将介绍如何使用 PaddleClas 套件导出推理模型并使用 WebAI.js 部署到网页前端

## 2. 同步代码
* 克隆 PaddleClas 代码

    ```bash
    $ git clone https://github.com/PaddlePaddle/PaddleClas --depth 1
    ```

## 2. 导出 Paddle 推理模型
* PaddleClas 的导出脚本位于 PaddleClas/tools/export_model.py

* 更多详细的使用方法可参考 [PaddleClas 官方文档](https://github.com/PaddlePaddle/PaddleClas/blob/release/2.3/docs/zh_CN/inference_deployment/export_model.md)

* 作为演示，所以使用官方文档中提供的示例模型进行模型导出，具体步骤如下：

1. 切换工作目录

    ```bash
    $ cd ./PaddleClas
    ```

2. 下载官方提供的 ResNet50 预训练模型

    ```bash
    $ wget -P ./cls_pretrain/ https://paddle-imagenet-models-name.bj.bcebos.com/dygraph/legendary_models/ResNet50_vd_pretrained.pdparams
    ```

3. 导出 Paddle 格式的推理模型

    ```bash
    # 使用脚本时通过命令行参数指定模型的配置文件、预训练模型、保存目录和当前运行的设备类型

    $ python tools/export_model.py \
        -c ./ppcls/configs/ImageNet/ResNet/ResNet50_vd.yaml \
        -o Global.pretrained_model=./cls_pretrain/ResNet50_vd_pretrained \
        -o Global.save_inference_dir=./deploy/models/class_ResNet50_vd_ImageNet_infer \
        -o Global.device=cpu
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
        --model_dir=./deploy/models/class_ResNet50_vd_ImageNet_infer \
        --model_filename=inference.pdmodel \
        --params_filename=inference.pdiparams \
        --save_file=./deploy/models/class_ResNet50_vd_ImageNet_infer/model.onnx \
        --opset_version=12
    ```

## 4. 生成配置文件

1. 使用配置文件转换器

    * [WebAI 的体验网站](https://agentmaker.github.io/WebAI.js) 中包含一个配置文件转换生成器

    * 可通过这个程序快速将 PaddleClas 的配置文件转换为 WebAI.js 推理所需的配置文件

    * 转换器目前仍在持续开发中，目前可能无法兼容所有 PaddleClas 的配置文件

    * 默认的 PaddleClas 推理配置文件位于 PaddleClas/deploy/configs/inference_cls.yaml

    * 转换后的 [默认配置文件](./public/pplcnet_x0_25_imagenet/configs.json) 内容如下：

        ```json
        // configs.json
        {
            "Preprocess": [
                {
                    "type": "Decode",
                    "mode": "RGB"
                },
                {
                    "type": "Resize",
                    "interp": 1,
                    "keep_ratio": true,
                    "limit_max": false,
                    "target_size": [256, 256]
                },
                {
                    "type": "Crop",
                    "crop_size": [224, 224]
                },
                {
                    "type": "Normalize",
                    "is_scale": true,
                    "mean": [0.485, 0.456, 0.406],
                    "std": [0.229, 0.224, 0.225]
                },
                {
                    "type": "Permute"
                }
            ],
            "label_list": [
                "0 tench, Tinca tinca",
                "1 goldfish, Carassius auratus",
                "2 great white shark, white shark, man-eater, man-eating shark, Carcharodon carcharias",
                "...",
                "997 bolete",
                "998 ear, spike, capitulum",
                "999 toilet tissue, toilet paper, bathroom tissue"
            ]
        }
        ```

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

    ```
    $ cd ./ppcls
    ```

3. 在代码中修改模型路径:

    ```js
    // main.js
    // 模型和配置文件建议放置于 'public' 目录下，使用路径 '/*' 即可以引用该目录中的文件

    ...
    const modelURL = "/class_ResNet50_vd_ImageNet_infer/model.onnx"
    const modelConfig = "/class_ResNet50_vd_ImageNet_infer/configs.json"
    ...
    ```

4. 安装依赖:

    ```bash
    $ npm install
    ```

5. 开发网页:

    ```bash
    $ npm run dev

    # 通过浏览器访问 http://localhost:3000 来查看和测试网页
    ```

6. 构建网页:

    ```bash
    $ npm run build
    ```

7. 预览构建完成的网页:

    ```bash
    $ npm run preview

    # 通过浏览器访问 http://localhost:5000 来预览构建完成的网页
    ```

8. 构建网页至 '../docs' 目录中:

    ```bash
    $ npm run build:docs
    ```

9. 部署网页至 Github/Gitee Page:

    1. fork 这个项目

    2. 完成网页开发

    3. 构建网页至 '../docs' 目录中

    4. 启用项目的 Page 功能

    5. 设置 '../docs' 目录为 Page 功能的源目录