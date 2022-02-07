# WebAI.js-Examples
English | [中文版](./README_CN.md)

## 1. Introduction
* This repo contains several webai.js examples

    |Type|Example|
    |:-:|:-:|
    |Face Detection|[ppdet](./ppdet)|
    |ImageNet Classification|[ppcls](./ppcls)|
    |Human Segmentation|[ppseg](./ppseg)|

## 2. Usage
* Clone this repo:

    ```bash
    $ git clone https://github.com/AgentMaker/WebAI.js-Examples
    ```

* Switch to the directory for the example, like './ppdet':

    ```
    $ cd ./ppdet
    ```

* Edit the model path in the code:

    ```js
    // main.js
    // It is recommended that models and configuration files be placed in the 'public' directory, where files can be referenced using the path '/*'

    ...
    const modelURL = [PATH TO MODEL]
    const modelConfig = [PATH TO CONFIG] 
    ...
    ```

* Install dependencies:

    ```bash
    $ npm install
    ```

* Develop the web page:

    ```bash
    $ npm run dev

    # Through the browser to http://localhost:3000 to check and test page
    ```

* Build the web page:

    ```bash
    $ npm run build
    ```

* Preview the built web page:

    ```bash
    $ npm run preview

    # Through the browser to http://localhost:5000 to preview the built page
    ```

* Build the web page to the '../docs' directory:

    ```bash
    $ npm run build:docs
    ```

* Deploy the web page to the Github/Gitee Page:

    1. fork the repo

    2. Complete web page development

    3. Build the web page to the '../docs' directory

    4. Enable the repo Page function

    5. set 'docs' as the source of the Page function