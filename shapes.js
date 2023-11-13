import { Vector } from "./library/vector.js"
class Primitive
{
    constructor(object){
        this.type = object.type
        this.ambient =  object.ambient
        this.diffuse =  object.diffuse
        this.specular = object.specular
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
    constructor(object)
    {
        super(object)
        this.point = new Vector(object.point)
        this.n = new Vector(object.normal)
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
export{
    Sphere,
    Plane,
    Light
}