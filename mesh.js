import {Plane, Primitive, Hit, copyMaterial} from './shapes.js'
import { EPSILON } from './library/constants.js'
import { indexOfLowestNonNegativeValue } from './helper.js'
import { Vector } from './library/vector.js'

class BVHNode
{
    constructor(triangles, object={ // use this weird default material properties to solve bad code design
                              ambient: [0.9,0.3,0.3],
                              diffuse: [0.9,0.3,0.3],
                              specular: [0.2,0.2,0.2],
                              mirror: [0,0,0],
                              phong_exponent: 20,
                              type:"aabb"})
    {
        this.triangles = triangles
        this.calculateAABB(object)
        // this.calculateChildren()
    }

    calculateAABB(object)
    {
        let min = [Infinity,Infinity,Infinity]
        let max = [-Infinity,-Infinity,-Infinity]
        console.log(this)
        this.triangles.forEach(tri => {
            tri.getPointList().forEach(point => {
                for (let i = 0; i < point.length; i++)
                {
                    if (point[i] < min[i])
                    {
                        min[i] = point[i]
                    }
                    if (point[i] > max[i])
                    {
                        max[i] = point[i]
                    }
                }
            })
        });
        object.min = min
        object.max = max
        this.aabb = new AABB(object)
    }

    raycast(eye, rayDir, d_dot_d)
    {
        if (this.aabb.raycast(eye, rayDir, d_dot_d).hit)
        {
            let tri_hits = []
            this.triangles.forEach(tri => {
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
        else return new Hit(-1, this)
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
        this.bvhtree = new BVHNode(this.triangles)
    }
    generateTriangleList(eye, obj)
    {
        this.triangles = []

        obj.models[0].faces.forEach(face => {
            let surface = copyMaterial(this)
            surface.type = "triangle"
            // console.log(obj.models[0].vertices,face)
            surface.pointA = new Vector(obj.models[0].vertices[face.vertices[0].vertexIndex-1]).multiply(this.scale).add(this.root).components
            surface.pointB = new Vector(obj.models[0].vertices[face.vertices[1].vertexIndex-1]).multiply(this.scale).add(this.root).components
            surface.pointC = new Vector(obj.models[0].vertices[face.vertices[2].vertexIndex-1]).multiply(this.scale).add(this.root).components
            this.triangles.push(new Triangle(surface, eye))
        });
        // console.log(this.tris)
    }
    raycast(eye, rayDir, d_dot_d)
    {
        return this.bvhtree.raycast(eye, rayDir, d_dot_d)
    }
}

class AABB extends Primitive
{
    constructor(object, eye=[0,0,0])
    {
        super(object)
        this.max = object.max 
        this.min = object.min  
        this.minXPlane = new Plane(object, eye, this.min, [0,0,-1])
        this.maxXPlane = new Plane(object, eye, this.max, [0,0,1])
        this.minYPlane = new Plane(object, eye, this.min, [-1,0,0])
        this.maxYPlane = new Plane(object, eye, this.max, [1,0,0])
        this.minZPlane = new Plane(object, eye, this.min, [0,-1,0])
        this.maxZPlane = new Plane(object, eye, this.max, [0,1,0])
        this.flippedX = false
        this.flippedY = false
        this.flippedZ = false
    }
    raycast(eye, rayDir, d_dot_d)
    {
        let flippedX = false
        let flippedY = false
        let flippedZ = false
        let a = 1/rayDir.components[0]
        if (a >= 0){
            var t_minX = a*(this.min[0] - eye.components[0])
            var t_maxX = a*(this.max[0] - eye.components[0])
        }
        else{
            flippedX = true
            var t_minX = a*(this.max[0] - eye.components[0])
            var t_maxX = a*(this.min[0] - eye.components[0])
        }

        a = 1/rayDir.components[1]
        if (a >= 0){
            var t_minY = a*(this.min[1] - eye.components[1])
            var t_maxY = a*(this.max[1] - eye.components[1])
        }
        else{
            flippedY = true
            var t_minY = a*(this.max[1] - eye.components[1])
            var t_maxY = a*(this.min[1] - eye.components[1])
        } 

        a = 1/rayDir.components[2]
        if (a >= 0){
            var t_minZ = a*(this.min[2] - eye.components[2])
            var t_maxZ = a*(this.max[2] - eye.components[2])
        }
        else{
            flippedZ = true
            var t_minZ = a*(this.max[2] - eye.components[2])
            var t_maxZ = a*(this.min[2] - eye.components[2])
        }

        // if within the bounds of the polygons that make up the box
        if (t_minX > t_maxY || t_minX > t_maxZ ||
            t_minY > t_maxX || t_minY > t_maxZ ||
            t_minZ > t_maxX || t_minZ > t_maxY ||
            t_maxX < 0 || t_maxY < 0 || t_maxZ < 0)
        {
            return new Hit(-1, this)
        }
        else
        {
            return new Hit(1, this)
            if (t_minX < t_minY && t_minX < t_minZ)
            {
                let hitPoint = eye.add(rayDir.scaleBy(t_minX))
                if(!flippedX) {
                    return new Hit(t_minX, this.minXPlane)
                }
                else {
                    return new Hit(t_minX, this.maxXPlane)
                }
            }
            else if (t_minY < t_minX && t_minY < t_minZ)
            {
                let hitPoint = eye.add(rayDir.scaleBy(t_minY))
                if(!flippedY) {
                    return new Hit(t_minY, this.minYPlane)
                }
                else {
                    return new Hit(t_minY, this.maxYPlane)
                }
            }
            else
            {
                let hitPoint = eye.add(rayDir.scaleBy(t_minZ))
                if(!flippedZ) {
                    return new Hit(t_minZ, this.minZPlane)
                }
                else {
                    return new Hit(t_minZ, this.maxZPlane)
                }
            }
        }
    }
    normal(hitPoint)
    {
        return new Vector(-1,-1,-1)
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

    getPointList()
    {
        return [this.pointA, this.pointB, this.pointC]
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

export {
    BVHNode,
    AABB,
    Triangle,
    Mesh
}