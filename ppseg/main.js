// import WebAI
import WebAI from 'webai-js'

// set wasm path of the onnxruntime-web
WebAI.ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/webai-js/dist/"

// set cv as the global variable
window.cv = WebAI.cv

// get elements
const imgDom = document.getElementById('imgDom')
const canvasDom = document.getElementById('canvasDom')
const inputFile = document.getElementById('inputFile')

// set model URL/configs
const modelURL = './ppseg_lite_portrait_398x224/model.onnx'
const modelConfig = './ppseg_lite_portrait_398x224/configs.json'

// when window is onload
window.onload = async function (e) {
    // load model
    window.model = await WebAI.Seg.create(modelURL, modelConfig)

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
    let seg = await model.infer(imgRGBA)

    // overlay mixes the segmentation result with the original image
    cv.addWeighted(imgRGBA, 0.5, seg.colorRGBA, 0.5, 0.0, imgRGBA)

    // show the results
    cv.imshow(canvasDom, imgRGBA)

    // delete image objects
    imgRGBA.delete()
    seg.delete()
}

