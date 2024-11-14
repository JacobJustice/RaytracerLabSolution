import { Vector } from "./library/vector.js"

class Material
{
    constructor(object)
    {
        this.ambient = ambient
        this.diffuse =  diffuse
        this.specular = specular
        this.mirror = mirror
        this.phong_exponent = phong_exponent
    }

    ambientColor()
    {
        return new Vector([
            ambient[0]*AMBIENT_LIGHT,
            ambient[1]*AMBIENT_LIGHT,
            ambient[2]*AMBIENT_LIGHT])
    }
    diffuseColor(light, n_dot_l)
    {
        return {components:[light.color[0]*diffuse[0]*Math.max(0, n_dot_l)*255,
                            light.color[1]*diffuse[1]*Math.max(0, n_dot_l)*255,
                            light.color[2]*diffuse[2]*Math.max(0, n_dot_l)*255]}
                }
    specularColor()
    {
        let v_vec = eye.subtract(hitPoint).normalize()
        let v_add_l = v_vec.add(lDir)
        let h_vec = v_add_l.scaleBy(1/v_add_l.length()).normalize()
        let n_dot_h = nDir.dotProduct(h_vec)
        return {components:[(hit.surface.specular[0]*(Math.max(0, n_dot_h))**hit.surface.phong_exponent),
                            (hit.surface.specular[1]*(Math.max(0, n_dot_h))**hit.surface.phong_exponent),
                            (hit.surface.specular[2]*(Math.max(0, n_dot_h))**hit.surface.phong_exponent)
        ]}


    }
    mirrorColor()
    {
    }

    evaluate(l, v, n, light)
    {
        let n_dot_l = n.dotProduct(l);

    }
}

export {
    Material
}