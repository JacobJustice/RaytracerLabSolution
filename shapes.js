import { EPSILON } from "./library/constants.js"
import { Vector } from "./library/vector.js"
import {indexOfLowestNonNegativeValue, parseOBJFile } from "./helper.js"

class Primitive
{
    constructor(object){
        this.type = object.type
        this.ambient =  object.ambient
        this.diffuse =  object.diffuse
        this.specular = object.specular
        this.mirror = object.mirror
        this.phong_exponent = object.phong_exponent
    }

    /*
    given a parametric equation:
        solves for the t value that returns a point on the surface of the object
        if it exists
    d_dot_d is passed in to prevent calculating the same thing multiple times
    */
    raycast(eye, rayDir, d_dot_d)
    {
        return new Hit(-1)
    }

    normal(hitPoint)
    {
        return null
    }
}

class Sphere extends Primitive
{    
    constructor(object){
        super(object)
        this.center = new Vector(object.center)
        this.radius = object.radius
    }
    raycast(eye, rayDir, d_dot_d)
    {
        let e_minus_c = eye.subtract(this.center)
        let d_dot_emc = rayDir.dotProduct(e_minus_c)
        let emc_dot_emc = (e_minus_c.dotProduct(e_minus_c))
        let discriminant = Math.pow(d_dot_emc,2) - d_dot_d*(emc_dot_emc - Math.pow(this.radius,2))
        let t_ = -1
        if (discriminant >= 0) {
            t_ = (-d_dot_emc - Math.pow(discriminant,0.5))/d_dot_d
            if (t_ < 0) {
                t_ = (-d_dot_emc + Math.pow(discriminant,0.5))/d_dot_d
            }
        }
        return new Hit(t_, this)
    }
    normal(hitPoint)
    {
        return hitPoint.subtract(this.center).normalize()
    }
}
class Plane extends Primitive
{
    constructor(object, eye, point=null, n=null)
    {
        super(object)
        if (point == null){
            this.point = new Vector(object.point)
            this.n = new Vector(object.normal)
            if (eye.subtract(this.point).dotProduct(this.n) < 0)
            {
                this.n = this.n.negate()
            }
        }
        else{
            this.point = new Vector(point)
            this.n = new Vector(n)
            if (eye.subtract(this.point).dotProduct(this.n) < 0)
            {
                this.n = this.n.negate()
            }
        }
    }
    raycast(eye, rayDir, d_dot_d)
    {
        // console.log(this.normal)
        let denom = this.n.dotProduct(rayDir)
        if (Math.abs(denom) > 0.0001)
        {
            var t = this.point.subtract(eye).dotProduct(this.n) / denom
            return new Hit(t, this)
        }
        else return new Hit(-1, this)
    }
    normal(hitPoint)
    {
        return this.n
    }
}

class Triangle extends Primitive
{
    constructor(object, eye)
    {
        super(object)
        this.pointA = object.pointA
        this.pointB = object.pointB
        this.pointC = object.pointC

        let A_C = new Vector(this.pointA).subtract(new Vector(this.pointC))
        let B_C = new Vector(this.pointB).subtract(new Vector(this.pointC))

        this.n = A_C.crossProduct(B_C).normalize().negate()

        // console.log(this.pointA, this.pointB, this.pointC, this.n)
        if (isNaN(this.n.components[0]) || isNaN(this.n.components[1]) || isNaN(this.n.components[2])) 
        {
            // console.log("nan detected")
            this.n = new Vector(this.pointB).crossProduct(new Vector(this.pointC)).normalize()
            // console.log(this.n)
        }
        if (eye.subtract(new Vector(this.pointA)).dotProduct(this.n) < 0)
        {
            this.n = this.n.negate()
        }
    }
    
    // implemented using Cramer's Rule, there are other ways but this is the fastest supposedly
    raycast(eye, rayDir, d_dot_d, t_min = Infinity, t_max = Infinity)
    {
        let a = this.pointA[0] - this.pointB[0]
        let b = this.pointA[1] - this.pointB[1]
        let c = this.pointA[2] - this.pointB[2]
        let d = this.pointA[0] - this.pointC[0]
        let e = this.pointA[1] - this.pointC[1]
        let f = this.pointA[2] - this.pointC[2]
        let g = rayDir.components[0]
        let h = rayDir.components[1]
        let i = rayDir.components[2]
        let j = this.pointA[0] - eye.components[0]
        let k = this.pointA[1] - eye.components[1]
        let l = this.pointA[2] - eye.components[2]

        let ei_minus_hf = e*i - h*f
        let jc_minus_al = j*c - a*l
        let bl_minus_kc = b*l - k*c
        let dh_minus_eg = d*h - e*g
        let gf_minus_di = g*f - d*i
        let ak_minus_jb = a*k - j*b

        let M = a*ei_minus_hf + b*gf_minus_di + c*dh_minus_eg
        let t = -(f*ak_minus_jb+ e*jc_minus_al + d*bl_minus_kc)/M
        if (t < EPSILON || t > t_max)
        {
            return new Hit(-1, this)
        }
        let gamma = (i*ak_minus_jb + h*jc_minus_al + g*bl_minus_kc)/M
        if (gamma < 0 || gamma > 1)
        {
            return new Hit(-1,this)
        }
        let beta = (j*ei_minus_hf + k*gf_minus_di + l*dh_minus_eg)/M
        if (beta < 0 || beta > 1 - gamma)
        {
            return new Hit(-1, this)
        }
        
        return new Hit(t, this)
    }

    normal(hitPoint)
    {
        return this.n
    }
}

class Mesh extends Primitive
{
    constructor(object, eye, obj)
    {
        super(object)
        this.root = new Vector(object.root)
        this.scale = object.scale
        this.generateTriangleList(eye, obj)
    }
    generateTriangleList(eye, obj)
    {
        this.tris = []

        obj.models[0].faces.forEach(face => {
            let surface = copyMaterial(this)
            surface.type = "triangle"
            // console.log(obj.models[0].vertices,face)
            surface.pointA = new Vector(obj.models[0].vertices[face.vertices[0].vertexIndex-1]).multiply(this.scale).add(this.root).components
            surface.pointB = new Vector(obj.models[0].vertices[face.vertices[1].vertexIndex-1]).multiply(this.scale).add(this.root).components
            surface.pointC = new Vector(obj.models[0].vertices[face.vertices[2].vertexIndex-1]).multiply(this.scale).add(this.root).components
            this.tris.push(new Triangle(surface, eye))
        });
        // console.log(this.tris)
    }
    raycast(eye, rayDir, d_dot_d)
    {
        let tri_hits = []
        this.tris.forEach(tri => {
            tri_hits.push(tri.raycast(eye, rayDir, d_dot_d))
        })

        let t_ind = indexOfLowestNonNegativeValue(tri_hits)
        if (t_ind != -1)
        {
            return tri_hits[t_ind]
        }
        else
        {
            return new Hit(-1,this)
        }
    }
}

class Box extends Primitive
{
    constructor(object, eye)
    {
        super(object)
        this.max = object.max //
        this.min = object.min // 
        this.flippedX = false
        this.flippedY = false
        this.flippedZ = false
    }
    raycast(eye, rayDir, d_dot_d)
    {
        // check x_d, y_d, z_d etc.
        let a = 1/rayDir.components[0]
        if (a >= 0){
            var t_minX = a*(this.min[0] - eye[0])
            var t_maxX = a*(this.max[0] - eye[0])
        }
        else{
            var t_minX = a*(this.max[0] - eye[0])
            var t_maxX = a*(this.min[0] - eye[0])
        }

        a = 1/rayDir.components[1]
        if (a >= 0){
            var t_minY = a*(this.min[1] - eye[1])
            var t_maxY = a*(this.max[1] - eye[1])
        }
        else{
            var t_minY = a*(this.max[1] - eye[1])
            var t_maxY = a*(this.min[1] - eye[1])
        } 

        a = 1/rayDir.components[2]
        if (a >= 0){
            var t_minZ = a*(this.min[2] - eye[2])
            var t_maxZ = a*(this.max[2] - eye[2])
        }
        else{
            var t_minZ = a*(this.max[2] - eye[2])
            var t_maxZ = a*(this.min[2] - eye[2])
        }
        let hit = false

        // if within the bounds of the polygons that make up the box
        if (t_minX < t_maxY || t_minX < tmaxZ ||
            t_minY < t_maxX || t_minX < tmaxZ ||
            t_minZ < t_maxX || t_minX < tmaxY
            )
        {
            if (t_minX < t_minY && t_minX < t_minZ)
            {
                if(!this.flippedX) {
                    return new Hit(t_minX, new Plane(copyMaterial(this), eye, this.min, new Vector(1,0,0)))
                }
                else {
                    return new Hit(t_minX, new Plane(copyMaterial(this), eye, this.min, new Vector(1,0,0)))
                }
            }
            else if (t_minY < t_minX && t_minY < t_minZ)
            {
                if(!this.flippedY) {
                    return new Hit(t_minY, new Plane(copyMaterial(this), eye, this.min, new Vector(1,0,0)))
                }
                else {
                    return new Hit(t_minY, new Plane(copyMaterial(this), eye, this.min, new Vector(1,0,0)))
                }
            }
            else
            {
                if(!this.flippedY) {
                    return new Hit(t_minY, new Plane(copyMaterial(this), eye, this.min, new Vector(1,0,0)))
                }
                else {
                    return new Hit(t_minY, new Plane(copyMaterial(this), eye, this.min, new Vector(1,0,0)))
                }
            }
        }
        return new Hit(-1, this)
    }
    normal(hitPoint)
    {
        return new Vector(-1,-1,-1)
    }
}

class Light
{
    constructor(object)
    {
        this.position = new Vector(object.position)
        this.color = object.color
    }
}

class Hit
{
    constructor(t, surfaceRef){
        this.t = t
        this.surface = surfaceRef
    }
}

function copyMaterial(surface)
{
    return {
        ambient : surface.ambient,
        diffuse : surface.diffuse,
        specular : surface.specular,
        mirror : surface.mirror,
        phong_exponent : surface.phong_exponent
    }
}

export{
    Sphere,
    Triangle,
    Mesh,
    Plane,
    Light
}