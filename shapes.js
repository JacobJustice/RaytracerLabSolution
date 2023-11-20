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
    constructor(object, eye)
    {
        super(object)
        this.point = new Vector(object.point)
        this.n = new Vector(object.normal)
        if (eye.subtract(this.point).dotProduct(this.n) < 0)
        {
            this.n = this.n.negate()
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

        this.n = new Vector(this.pointB).crossProduct(new Vector(this.pointA)).normalize()
        if (eye.subtract({components:this.pointA}).dotProduct(this.n) < 0)
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
            return new Hit(-1,)
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
    constructor(object, eye)
    {
        super(object)
        this.root = object.root
        this.file = object.file
        this.generateTriangleList(eye)
    }
    async generateTriangleList(eye)
    {
        this.tris = []
        let objfile = await parseOBJFile(this.file)

        objfile.models[0].faces.forEach(face => {
            let surface = copyMaterial(this)
            surface.type = "triangle"
            surface.pointA = objfile.models[0].vertices[face.vertices[0].vertexIndex]
            surface.pointB = objfile.models[0].vertices[face.vertices[1].vertexIndex]
            surface.pointC = objfile.models[0].vertices[face.vertices[2].vertexIndex]
            this.tris.push(new Triangle(surface, eye))
        });
    }
    raycast(eye, rayDir, d_dot_d)
    {
        let tri_hits = []
        console.log(this.tris)
        this.tris.forEach(tri => {
            tri_hits.push(tri.rayCast(eye, rayDir, d_dot_d))
        })

        let t_ind = indexOfLowestNonNegativeValue(tri_hits)
        
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