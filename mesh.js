import {Plane, Primitive, Hit, copyMaterial} from './shapes.js'
import { EPSILON } from './library/constants.js'
import { indexOfLowestNonNegativeValue } from './helper.js'
import { Vector } from './library/vector.js'

var OPTIMIZATION = true

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

        this.n = A_C.crossProduct(B_C).normalize()

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

class BVHNode extends Primitive
{
    constructor(triangles, axis = 0, object={ // use this weird default material properties to solve bad code design
                                      ambient: [0.9,0.3,0.3],
                                      diffuse: [0.9,0.3,0.3],
                                      specular: [0.2,0.2,0.2],
                                      mirror: [0,0,0],
                                      phong_exponent: 20,
                                      type:"bvhnode"})
    {
        super(object)
        this.triangles = triangles
        this.calculateAABB(object)
        this.calculateChildren(object, axis)
    }

    calculateAABB(object)
    {
        let min = [Infinity,Infinity,Infinity]
        let max = [-Infinity,-Infinity,-Infinity]
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
        object.center = [0,0,0]
        this.aabb = new AABB(object)
    }

    // calculates child nodes
    calculateChildren(object, axis)
    {
        this.children = []
        let trilen = this.triangles.length
        if (trilen <= 2) {
            this.children.push(...this.triangles);
        }
        else
        {
            // sort this.triangles along axis
            this.triangles.sort((tri1, tri2) => {
                return tri1[axis] - tri2[axis]
            })
            this.children.push(new BVHNode(this.triangles.slice(0, trilen/2), axis= (axis+1) % 3))
            this.children.push(new BVHNode(this.triangles.slice(trilen/2), axis= (axis+1) % 3))
        }
    }

    raycast(eye, rayDir, d_dot_d)
    {
        if (this.aabb.raycast(eye, rayDir, d_dot_d))
        {
            let childHits = []
            this.children.forEach(child => {
                childHits.push(child.raycast(eye, rayDir, d_dot_d))
            })

            let minT = indexOfLowestNonNegativeValue(childHits)
            if (minT != -1)
            {
                return childHits[minT]
            }
            return new Hit(-1, this)
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
            surface.pointA = new Vector(obj.models[0].vertices[face.vertices[0].vertexIndex-1]).multiply(this.scale).add(this.root).components
            surface.pointB = new Vector(obj.models[0].vertices[face.vertices[1].vertexIndex-1]).multiply(this.scale).add(this.root).components
            surface.pointC = new Vector(obj.models[0].vertices[face.vertices[2].vertexIndex-1]).multiply(this.scale).add(this.root).components
            this.triangles.push(new Triangle(surface, eye))
        });
    }
    raycast(eye, rayDir, d_dot_d)
    {
        if (OPTIMIZATION)
        {
            return this.bvhtree.raycast(eye, rayDir, d_dot_d)
        }
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
}

class AABB extends Primitive
{
    constructor(object, eye=[0,0,0])
    {
        super(object)
        this.max = object.max
        this.min = object.min 
        for (let i = 0; i < 3; i++)
        {
            this.max[i] += object.center[i]
            this.min[i] += object.center[i]
        }
        this.flippedX = false
        this.flippedY = false
        this.flippedZ = false
        this.max = object.max 
        this.min = object.min  
    }

    raycast(eye, rayDir, d_dot_d) {
        const invDirX = 1 / rayDir.components[0];
        const invDirY = 1 / rayDir.components[1];
        const invDirZ = 1 / rayDir.components[2];

        const tMinX = invDirX * (this.min[0] - eye.components[0]);
        const tMaxX = invDirX * (this.max[0] - eye.components[0]);

        const tMinY = invDirY * (this.min[1] - eye.components[1]);
        const tMaxY = invDirY * (this.max[1] - eye.components[1]);

        const tMinZ = invDirZ * (this.min[2] - eye.components[2]);
        const tMaxZ = invDirZ * (this.max[2] - eye.components[2]);

        const tNear = Math.max(tMinX, tMinY, tMinZ);
        const tFar = Math.min(tMaxX, tMaxY, tMaxZ);

        if (tNear > tFar || tFar < 0) {
            return new Hit(-1, this); // No hit
        }
        return new Hit(tNear > 0 ? tNear : tFar, this); // Hit detected
    }

    normal(hitPoint) {
        // return new Vector(1,1,1)
        // Calculate the distances from the hitPoint to each face of the AABB
        const xDistMin = Math.abs(hitPoint.components[0] - this.min[0]);
        const xDistMax = Math.abs(hitPoint.components[0] - this.max[0]);

        const yDistMin = Math.abs(hitPoint.components[1] - this.min[1]);
        const yDistMax = Math.abs(hitPoint.components[1] - this.max[1]);

        const zDistMin = Math.abs(hitPoint.components[2] - this.min[2]);
        const zDistMax = Math.abs(hitPoint.components[2] - this.max[2]);

        // Find the minimum distance and corresponding face
        const minDist = Math.min(xDistMin, xDistMax, yDistMin, yDistMax, zDistMin, zDistMax);

        // Determine which face has the minimum distance
        if (minDist === xDistMin) {
            return new Vector(-1, 0, 0); // Normal pointing towards the negative X face
        } else if (minDist === xDistMax) {
            return new Vector(1, 0, 0);  // Normal pointing towards the positive X face
        } else if (minDist === yDistMin) {
            return new Vector(0, -1, 0); // Normal pointing towards the negative Y face
        } else if (minDist === yDistMax) {
            return new Vector(0, 1, 0);  // Normal pointing towards the positive Y face
        } else if (minDist === zDistMin) {
            return new Vector(0, 0, -1); // Normal pointing towards the negative Z face
        } else if (minDist === zDistMax) {
            return new Vector(0, 0, 1);  // Normal pointing towards the positive Z face
        }

        // If no faces are found, return a default normal (can also be handled as an error)
        return new Vector(0, 0, 0); 
    }
}


export {
    BVHNode,
    AABB,
    Triangle,
    Mesh
}