# PaddleClas model export and WebAI.js deployment
[中文版](./README.md) | English

## 1. Introduction
* This tutorial will cover how to export inference model using the PaddleClas toolkit and deploy it to web using WebAI.js

## 2. Clone the repo
* Clone the PaddleClas repo

    ```bash
    $ git clone https://github.com/PaddlePaddle/PaddleClas --depth 1
    ```

## 2. Export Paddle inference model
* The PaddleClas export script is located at PaddleClas/tools/export_model.py

* For more detailed usage, please refer to [PaddleClas official documentation](https://github.com/PaddlePaddle/PaddleClas/blob/release/2.3/docs/en/inference_deployment/export_model_en.md)

* As a demonstration, use the sample model provided in the official documentation for model export. The steps are as follows:

1. Switch to the working directory:

    ```bash
    $ cd ./PaddleClas
    ```

2. Download the official ResNet50 pretrained model:

    ```bash
    $ wget -P ./cls_pretrain/ https://paddle-imagenet-models-name.bj.bcebos.com/dygraph/legendary_models/ResNet50_vd_pretrained.pdparams
    ```

3. Export Paddle inference model

    ```bash
    # When using scripts, you specify the configuration file, pre-training model, save directory, and currently running device type of the model through command line parameters

    $ python tools/export_model.py \
        -c ./ppcls/configs/ImageNet/ResNet/ResNet50_vd.yaml \
        -o Global.pretrained_model=./cls_pretrain/ResNet50_vd_pretrained \
        -o Global.save_inference_dir=./deploy/models/class_ResNet50_vd_ImageNet_infer \
        -o Global.device=cpu
    ```

## 3. Convert to the ONNX model

1. Install Paddle2ONNX

    ```bash
    $ pip install paddle2onnx
    ```

2. Convert to the ONNX model

    ```bash
    # When used, specify the model path, model file name, parameter file name, save file path, and version of the ONNX operator set for the Paddle inference model with command line arguments

    $ paddle2onnx \
        --model_dir=./deploy/models/class_ResNet50_vd_ImageNet_infer \
        --model_filename=inference.pdmodel \
        --params_filename=inference.pdiparams \
        --save_file=./deploy/models/class_ResNet50_vd_ImageNet_infer/model.onnx \
        --opset_version=12
    ```

## 4. Generating a configuration file

1. Use the configuration converter

    * [WebAI's experience site](https://agentmaker.github.io/WebAI.js) includes a configuration converter

    * This program can be used to quickly convert PaddleClas configuration files to the required configuration files for webai.js reasoning

    * The converter is currently under continuous development and may not be compatible with all PaddleClas configuration files at this time

    * The default PaddleClas inference configuration file is located at PaddleClas/deploy/configs/inference_cls.yaml

    * The content of [the default configuration file](./public/pplcnet_x0_25_imagenet/configs.json) after conversion is as follows :

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

2. Write a configuration file manually, for example:

    ```json
    // configs.json
    {
        "Preprocess": [
            {
                "type": "Decode", // Image Decode
                "mode": "RGB" // RGB or BGR
            },
            {
                "type": "Resize", //  Image Resize
                "interp": 1, // Interpolation method
                "keep_ratio": false, // Whether to keep the aspect ratio
                "limit_max": false, // Whether to limit the max size of image
                "target_size": [300, 300] // Target size [H, W]
            },
            /*
            {
                "type": "Crop", // Image Center Crop
                "crop_size": [224, 224] // Crop size [H, W]
            },
            */
            {
                "type": "Normalize", // Normalize
                "is_scale": false, // Whether to scale the image (img /= 255.0)
                "mean": [127.5, 127.5, 127.5], // Mean of normalize
                "std": [127.5, 127.5, 127.5] // Std of normalize
            },
            {
                "type": "Permute" // permute (HWC -> CHW)
            }
        ],
        "label_list": [
            "aeroplane", "bicycle", "bird", "boat", "bottle", "bus", "car", 
            "cat", "chair", "cow", "diningtable", "dog", "horse", "motorbike", 
            "person", "pottedplant", "sheep", "sofa", "train", "tvmonitor"
        ] // Label list
    }
    ```

## 5. Rapid deployment

1. Clone WebAI.js-Examples repo:

    ```bash
    $ git clone https://github.com/AgentMaker/WebAI.js-Examples
    ```

2. Switch to the directory for the example:

    ```
    $ cd ./ppcls
    ```

3. Edit the model path in the code:

    ```js
    // main.js
    // It is recommended that models and configuration files be placed in the 'public' directory, where files can be referenced using the path '/*'

    ...
    const modelURL = "/class_ResNet50_vd_ImageNet_infer/model.onnx"
    const modelConfig = "/class_ResNet50_vd_ImageNet_infer/configs.json"
    ...
    ```

4. Install dependencies:

    ```bash
    $ npm install
    ```

5. Develop the web page:

    ```bash
    $ npm run dev

    # Through the browser to http://localhost:3000 to check and test page
    ```

6. Build the web page:

    ```bash
    $ npm run build
    ```

7. Preview the built web page:

    ```bash
    $ npm run preview

    # Through the browser to http://localhost:5000 to preview the built page
    ```

8. Build the web page to the '../docs' directory:

    ```bash
    $ npm run build:docs
    ```

9. Deploy the web page to the Github/Gitee Page:

    1. fork the repo

    2. Complete web page development

    3. Build the web page to the '../docs' directory

    4. Enable the repo Page function

    5. set 'docs' as the source of the Page function