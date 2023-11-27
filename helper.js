import {OBJFile} from './library/OBJFile.js'
import { EPSILON } from './library/constants.js'

async function parseJsonFile(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onload = event => resolve(JSON.parse(event.target.result))
      fileReader.onerror = error => reject(error)
      fileReader.readAsText(file)
    })
}

function imageDataFromCanvas(canvas, scene) {
    var canvas = document.getElementById('canvas')
    canvas.width = scene.width
    canvas.height = scene.height
    var ctx = canvas.getContext('2d')
    var imageData = ctx.getImageData(0,0, scene.width, scene.height)
    return [imageData, ctx]
}

async function loadOBJFile(filePath) {
    try{
        const response = await fetch(filePath)
        const textString = await response.text()
        return textString
    }
    catch (error) {
        console.error('Error:', error)
    }
}

async function parseOBJFile(filePath) {
    let contents = await loadOBJFile(filePath)
    return new OBJFile(contents).parse()
}
  
function createImage(width, height){
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'rgba(0, 0, 0, 255)'
    ctx.fillRect(0, 0, width, height)
  
    const img = new Image(width, height)
    img.src = canvas.toDataURL()
  
    return img
}
function indexOfLowestNonNegativeValue(arr) {
    let minIndex = -1;
    let minValue = Infinity;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].t > EPSILON &&
            arr[i].t < minValue) {
          minValue = arr[i].t;
          minIndex = i;
        }
    }
    return minIndex;
}

function colorIsNotBlack(color)
{
    return (color[0]>0 && color[1]>0 && color[2]>0)
}

export {
    parseJsonFile,
    parseOBJFile,
    imageDataFromCanvas,
    colorIsNotBlack,
    indexOfLowestNonNegativeValue
}