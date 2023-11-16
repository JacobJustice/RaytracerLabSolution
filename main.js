import {parseJsonFile, imageDataFromCanvas, parseOBJFile} from './helper.js'
import {Vector} from './library/vector.js'
import { EPSILON } from './library/constants.js'
import {Light, Sphere, Plane} from './shapes.js'

/*
Author: Jacob Justice
Assignment 01: Ray Tracing
CGA

This is the solution to the Assignment 01

It is a raytracer that operates on spheres and planes

*/

var AMBIENT_LIGHT=.2

// -------- DO NOT EDIT  --------
// on button click, load the scene file and raytrace that scene
var scene = null;
document.getElementById('submit').onclick = async function() {
    scene = await parseJsonFile(myfile.files[0])
    raytrace(scene)
}
// -------- DO NOT EDIT ABOVE --------

function raytrace(scene){
    var [imageData, ctx] = imageDataFromCanvas(document.getElementById('canvas'), scene)

    // run raytracing algorithm on the scene
    var eye = new Vector(scene.eye) // location of the eye
    var up = new Vector(scene.up) // up vector
    var lookat = new Vector(scene.lookat) // point the eye is looking at
    
    var forwardDir = lookat.subtract(eye)
    var focalLength = forwardDir.length()// save for later use
    var forward = forwardDir.normalize() //-w
    var right = up.crossProduct(forward).normalize().scaleBy(-1) // u
    var eyeup = forward.crossProduct(right).normalize() // v

    var heightWidthRatio = scene.width/scene.height
    var fov_rads = scene.fov_angle*(Math.PI/180)
    var t = Math.tan(fov_rads/2)*focalLength
    var b = -t
    var r = heightWidthRatio*(t)
    var l = -r

    var surfaces = []
    scene.surfaces.forEach(function(surface){
            if (surface.type == "sphere")
            {
                surfaces.push(new Sphere(surface))
            }
            else if (surface.type == "plane")
            {
                surfaces.push(new Plane(surface))
            }
    })
    var lights = []
    scene.lights.forEach(function(light){
        lights.push(new Light(light))
    })
  

    // loop over every pixel
    for(let i = 0; i < imageData.data.length; i += 4) {
        // compute viewing ray
        var pixel_i = (i/4)%scene.width
        var pixel_j = Math.floor((i/4)/scene.width)
        var uScale = l + (r - l)*(pixel_i + .5)/scene.width
        var vScale = b + (t - b)*(pixel_j + .5)/scene.height
        var rayDir = forward.scaleBy(focalLength).add(right.scaleBy(uScale).add(eyeup.scaleBy(vScale)))

        let surface_hits = raycastIntoScene(eye, rayDir, surfaces)
    
        // set pixel color to value computed from hit point, light and n
        // console.log(surface_hits)
        var t_ind = indexOfLowestNonNegativeValue(surface_hits)
        // console.log(t_ind)
        if (t_ind != -1)
        {
            let hitPoint = eye.add(rayDir.scaleBy(surface_hits[t_ind].t))
            let color = colorPixel(hitPoint, lights, surfaces, eye, rayDir, surface_hits[t_ind], 0)
            // console.log("Color", color)
            imageData.data[i] = color[0]
            imageData.data[i + 1] = color[1]
            imageData.data[i + 2] = color[2]
            imageData.data[i + 3] = 255     
            // break
        }
        else // ray hit no object, color background color
        {
            imageData.data[i] = 0;       // red
            imageData.data[i + 1] = 0;   // green
            imageData.data[i + 2] = 0;   // blue
            imageData.data[i + 3] = 255; // alpha
        }
    }
    // display image on canvas element
    ctx.putImageData(imageData, 0, 0)
}

/*
eye: starting position
rayDir: ray direction
surfaces: list of surfaces with a raycast function
*/
function raycastIntoScene(eye, rayDir, surfaces)
{
    let d_dot_d = rayDir.dotProduct(rayDir)
    let surface_hits = []
    for (let s = 0; s < surfaces.length; s++) {
        let hit = surfaces[s].raycast(eye, rayDir, d_dot_d)
        surface_hits.push(hit)
    }
    return surface_hits
}

function colorPixel(hitPoint, lights, surfaces, eye, rayDir, hit, iter)
{
    // Ambient Shading
    // console.log(hit.surface)
    let outColor = new Vector(
        hit.surface.ambient[0]*AMBIENT_LIGHT*255,
        hit.surface.ambient[1]*AMBIENT_LIGHT*255,
        hit.surface.ambient[2]*AMBIENT_LIGHT*255)

    var inShadow = false
    lights.forEach(function(light){
        var l_dir = light.position.subtract(hitPoint)
        let l_dist = l_dir.length()
        l_dir = l_dir.normalize()

        // check if a there is any object between the hitpoint and the current light
        for (let i = 0; i < surfaces.length; i++){
            let surfhit = surfaces[i].raycast(hitPoint, l_dir, l_dir.dotProduct(l_dir))
            inShadow = (surfhit.t > EPSILON) && (l_dist > surfhit.t)
            if (inShadow) {break}
        }
        if (!inShadow)
        {
            // console.log(hit)
            var nDir = hit.surface.normal(hitPoint)
            var n_dot_l = nDir.dotProduct(l_dir)
            // Lambertian Shading (diffuse)
            outColor = outColor.add({components:[light.color[0]*hit.surface.diffuse[0]*Math.max(0, n_dot_l)*255,
                                                 light.color[1]*hit.surface.diffuse[1]*Math.max(0, n_dot_l)*255,
                                                 light.color[2]*hit.surface.diffuse[2]*Math.max(0, n_dot_l)*255]})
        
            // Specular Reflections
            let v_vec = eye.subtract(hitPoint).normalize()
            let v_add_l = v_vec.add(l_dir)
            let h_vec = v_add_l.scaleBy(1/v_add_l.length()).normalize()
            let n_dot_h = nDir.dotProduct(h_vec)
            outColor = outColor.add({components:[(light.color[0]*hit.surface.specular[0]*(Math.max(0, n_dot_h))**hit.surface.phong_exponent)*255,
                                                 (light.color[1]*hit.surface.specular[1]*(Math.max(0, n_dot_h))**hit.surface.phong_exponent)*255,
                                                 (light.color[2]*hit.surface.specular[2]*(Math.max(0, n_dot_h))**hit.surface.phong_exponent)*255]})
        }
    })

    // Ideal Specular Reflection
    if (colorIsNotBlack(hit.surface.mirror) && iter < 20)
    {
        let nDir = hit.surface.normal(hitPoint)
        let reflectDir = rayDir.subtract(nDir.scaleBy(2*rayDir.dotProduct(nDir))).normalize()
        let reflectHits = raycastIntoScene(hitPoint, reflectDir, surfaces)
        let ind = indexOfLowestNonNegativeValue(reflectHits)
        if (ind != -1) 
        {
            let reflectHit = reflectHits[ind]
            let reflectHitPoint = hitPoint.add(reflectDir.scaleBy(reflectHit.t))
            let reflectColor = colorPixel(reflectHitPoint, lights, surfaces, hitPoint, reflectDir, reflectHit, iter+1)
            outColor = outColor.add({components:[(reflectColor[0]*hit.surface.mirror[0]),
                                                 (reflectColor[1]*hit.surface.mirror[1]),
                                                 (reflectColor[2]*hit.surface.mirror[2])]})
        }
    }
    return outColor.components
}

function colorIsNotBlack(color)
{
    return (color[0]>0 && color[1]>0 && color[2]>0)
}

function indexOfLowestNonNegativeValue(arr) {
  let minIndex = -1;
  let minValue = Infinity;

  for (let i = 0; i < arr.length; i++) {
    if (
         arr[i].t > EPSILON &&
         arr[i].t < minValue) {
      minValue = arr[i].t;
      minIndex = i;
    }
  }

  return minIndex;
}