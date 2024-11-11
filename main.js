import {parseJsonFile
    , imageDataFromCanvas
    , colorIsNotBlack
    , indexOfLowestNonNegativeValue} from './helper.js'
import {Vector} from './library/vector.js'
import { EPSILON } from './library/constants.js'
import {Light, Sphere, Plane} from './shapes.js'
import { Triangle, Mesh, AABB } from './mesh.js'

import { parseOBJFile } from './library/OBJFile.js'
/*
Author: Jacob Justice
Assignment 03: Ray Tracing
CGA

This is the solution to the Assignment 03

It is a raytracer that operates on spheres, planes, triangles and meshes
Meshes are implemented using a bounding volume hierarchy as a means of optimization

*/

var AMBIENT_LIGHT=.1
var laser = false

// -------- DO NOT EDIT  --------
// on button click, load the scene file and raytrace that scene
var scene = null;
document.getElementById('submit').onclick = async function() {
    scene = await parseJsonFile(myfile.files[0]);
    scene.bunny = await parseOBJFile('./obj/bunny.obj');
    scene.dodecahedron =await parseOBJFile('./obj/dodecahedron.obj');
    scene.pyramid = await parseOBJFile('./obj/pyramid.obj');
    scene.cat = await parseOBJFile('./obj/cat.obj');
    console.time('raytrace');
    raytrace(scene);
    console.timeEnd('raytrace');
};
// -------- DO NOT EDIT ABOVE --------


function raytrace(scene){
    var [imageData, ctx] = imageDataFromCanvas(document.getElementById('canvas'), scene)
    console.log(scene)

    // run raytracing algorithm on the scene
    
    // compute image plane
    var eye = new Vector(scene.eye) // location of the eye
    var up = new Vector(scene.up) // up vector
    var lookat = new Vector(scene.lookat) // point the eye is looking at
    var forwardDir = lookat.subtract(eye)
    var lookAtDist = forwardDir.length()// save for later use
    var forward = forwardDir.normalize() //-w
    var right = forward.crossProduct(up).normalize() // u
    var eyeup = forward.crossProduct(right).normalize() // v

    var heightWidthRatio = scene.width/scene.height
    var fov_rads = scene.fov_angle*(Math.PI/180)
    var t = Math.tan(fov_rads/2)*lookAtDist
    var b = -t
    var r = heightWidthRatio*(t)
    var l = -r

    var surfaces = []
    scene.surfaces.forEach(function(surface){
        switch(surface.type) {
            case("sphere"):
                surfaces.push(new Sphere(surface))
                break
            case("plane"):
                surfaces.push(new Plane(surface, eye))
                break
            case("triangle"):
                surfaces.push(new Triangle(surface, eye))
                break
            case("aabb"):
                surfaces.push(new AABB(surface, eye))
                break
            case("mesh"):
                surfaces.push(new Mesh(surface, eye, scene[surface.obj]))
                break
        }
    })
    var lights = []
    scene.lights.forEach(function(light){
        lights.push(new Light(light))
    })

    let pixel_times = []

    // loop over every pixel
    for(let i = 0; i < imageData.data.length; i += 4) {
        // compute viewing ray
        laser = false
        var pixel_i = (i/4)%scene.width
        var pixel_j = Math.floor((i/4)/scene.width)
        var uScale = l + (r - l)*(pixel_i + .5)/scene.width
        var vScale = b + (t - b)*(pixel_j + .5)/scene.height
        var rayDir = forward.scaleBy(lookAtDist).add(right.scaleBy(uScale).add(eyeup.scaleBy(vScale)))

        if (i % 8000 == 0)
        {
            console.log("progress:", i/4, '/', imageData.data.length/4, "pixels")
        }

        // if (pixel_i == 200 && pixel_j == 149)
        // {
        //     laser = true
        // }

        let surface_hits = raycastIntoScene(eye, rayDir, surfaces)
        // set pixel color to value computed from hit point, light and n
        var t_ind = indexOfLowestNonNegativeValue(surface_hits)
        // console.log(t_ind)

        if (t_ind != -1)
        {
            let hitPoint = eye.add(rayDir.scaleBy(surface_hits[t_ind].t))
            
            let old_now = performance.now()
            let color = colorPixel(hitPoint, lights, surfaces, eye, rayDir, surface_hits[t_ind], 0)
            let new_now = performance.now()
            pixel_times.push(new_now - old_now)

            imageData.data[i] = color[0] * 255
            imageData.data[i + 1] = color[1] * 255
            imageData.data[i + 2] = color[2] * 255
            imageData.data[i + 3] = 255     
        }
        else // ray hit no object, color background color
        {
            imageData.data[i] = 0;       // red
            imageData.data[i + 1] = 0;   // green
            imageData.data[i + 2] = 0;   // blue
            imageData.data[i + 3] = 255; // alpha
        }
        
        // break
    }
    window.surfaces = surfaces
    ctx.putImageData(imageData, 0, 0)
    const average = array => array.reduce((a, b) => a + b) / array.length;
    console.log("average pixel times ", average(pixel_times))
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

function ambient(surface)
{
    return new Vector([
        surface.ambient[0]*AMBIENT_LIGHT,
        surface.ambient[1]*AMBIENT_LIGHT,
        surface.ambient[2]*AMBIENT_LIGHT])
}

function lambertian_old(hit, light, lDir, nDir)
{
    let n_dot_l = nDir.dotProduct(lDir)
    return {components:[light.color[0]*hit.surface.diffuse[0]*Math.max(0, n_dot_l),
                        light.color[1]*hit.surface.diffuse[1]*Math.max(0, n_dot_l),
                        light.color[2]*hit.surface.diffuse[2]*Math.max(0, n_dot_l)]}
}

function lambertian(hit, light)
{
    // console.log(hitPoint, light.position, distance)
    return  {components:[light.color[0]*hit.surface.diffuse[0],
                         light.color[1]*hit.surface.diffuse[1],
                         light.color[2]*hit.surface.diffuse[2]]};
}

function shadow(hitPoint, lDir, l_dist, surfaces)
{
    // check if a there is any object between the hitpoint and the current light
    let l_dot_l = lDir.dotProduct(lDir);
    for (let i = 0; i < surfaces.length; i++){
        let surfhit = surfaces[i].raycast(hitPoint.add(lDir.scaleBy(0.000001)), lDir, l_dot_l)

        if ((surfhit.t > EPSILON) && (l_dist > surfhit.t)) {
            return true
        }
    }
    return false

}

function mirror(hit, rayDir, hitPoint, surfaces, lights, iter) {
    let nDir = hit.surface.normal(hitPoint)
    let reflectDir = rayDir.subtract(nDir.scaleBy(2*rayDir.dotProduct(nDir))).normalize()
    let reflectHits = raycastIntoScene(hitPoint, reflectDir, surfaces)
    let ind = indexOfLowestNonNegativeValue(reflectHits)
    if (ind != -1) 
    {
        let reflectHit = reflectHits[ind]
        let reflectHitPoint = hitPoint.add(reflectDir.scaleBy(reflectHit.t))
        let reflectColor = colorPixel(reflectHitPoint, lights, surfaces, hitPoint, reflectDir, reflectHit, iter+1)
        return [(reflectColor[0]*hit.surface.mirror[0]),
                (reflectColor[1]*hit.surface.mirror[1]),
                (reflectColor[2]*hit.surface.mirror[2])]
    }
    return null
}

function specular(eye, hitPoint, lDir, nDir, hit){
    let v_vec = eye.subtract(hitPoint).normalize()
    let v_add_l = v_vec.add(lDir)
    let h_vec = v_add_l.scaleBy(1/v_add_l.length()).normalize()
    let n_dot_h = nDir.dotProduct(h_vec)
    return {components:[
        (hit.surface.specular[0]*(Math.max(0, n_dot_h)**hit.surface.phong_exponent)),
        (hit.surface.specular[1]*(Math.max(0, n_dot_h)**hit.surface.phong_exponent)),
        (hit.surface.specular[2]*(Math.max(0, n_dot_h)**hit.surface.phong_exponent))
    ]}

}

function colorPixel(hitPoint, lights, surfaces, eye, rayDir, hit, iter)
{
    // Ambient Shading
    let outColor = new Vector(0,0,0)

    let nDir = hit.surface.normal(hitPoint)
    let mirrorReflective = colorIsNotBlack(hit.surface.mirror) && iter < 10;

    lights.forEach((light) => {
        let lDir = light.position.subtract(hitPoint)
        let l_dist = lDir.length()
        lDir = lDir.normalize()
        let distance = hitPoint.subtract(light.position).length();
        let n_dot_l = nDir.dotProduct(lDir)

        let lightColor = new Vector(0, 0, 0);

        let irradiance = light.irradiance(distance, n_dot_l)
        if (!shadow(hitPoint, lDir, l_dist, surfaces) && irradiance > EPSILON)
        {

            // Lambertian Shading (diffuse)
            let lambertianColor = lambertian(hit, light)
            lightColor = lightColor.add(lambertianColor).scaleBy(irradiance)
        
            // Specular Reflections/
            let specularColor = specular(eye, hitPoint, lDir, nDir, hit)
            lightColor = lightColor.add(specularColor).scaleBy(irradiance)
            // console.log(outColor, lambertianColor, specularColor)

        }

        // Ideal Specular Reflection
        if (mirrorReflective)
        {
            let mirrorColor = mirror(hit, rayDir, hitPoint, surfaces, lights, iter)
            if (mirrorColor)
            {
                // console.log("pre", outColor)
                lightColor = lightColor.add(lightColor.multiply(mirrorColor))
                // console.log(outColor)
            }
        }

        outColor = outColor.add(lightColor);
    })

    // outColor = hit.surface.normal(hitPoint).scaleBy(255)
    outColor = outColor.add(ambient(hit.surface))
    return outColor.components
    return new Vector(hit.surface.diffuse).components
}
