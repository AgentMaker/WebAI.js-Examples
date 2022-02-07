// import WebAI
import WebAI from 'webai-js'

// set wasm path of the onnxruntime-web
WebAI.ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/webai-js/dist/"

// set cv as the global variable
window.cv = WebAI.cv

// get elements
const imgDom = document.getElementById('imgDom')
const inputFile = document.getElementById('inputFile')
const textProbs = document.getElementById('textProbs')

// set model URL/configs
const modelURL = './pplcnet_x0_25_imagenet/model.onnx'
const modelConfig = './pplcnet_x0_25_imagenet/configs.json'

// when window is onload
window.onload = async function (e) {
    // load model
    window.model = await WebAI.Cls.create(modelURL, modelConfig)

    // enabele upload image button
    inputFile.disabled = false
}

// when input element is on change
inputFile.onchange = function (e) {
    // set image to the img element
    if (e.target.files[0]) {
        imgDom.src = URL.createObjectURL(e.target.files[0])
    }
}

// when img element is onload
imgDom.onload = async function (e) {
    // read image 
    let imgRGBA = cv.imread(imgDom)

    // get the class probability of the image
    let probs = await model.infer(imgRGBA)

    // show the results
    textProbs.innerHTML = JSON.stringify(probs, null, 4)

    // delete image object
    imgRGBA.delete()
}

