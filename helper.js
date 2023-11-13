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
    var ctx = canvas.getContext('2d', {willReadFrequently : true})
    var imageData = ctx.getImageData(0,0, scene.width, scene.height)
    return [imageData, ctx]
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

export {
    parseJsonFile,
    imageDataFromCanvas
}