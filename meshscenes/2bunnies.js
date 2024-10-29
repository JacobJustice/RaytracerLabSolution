{
  "eye": [-0.8,-0.65,3],
  "lookat": [-0.45,-2,0],
  "up": [0,1,0],
  "fov_angle": 80,
  "width" : 500,
  "height": 400,
  "surfaces": [
    {
      "type": "mesh",
      "root": [-1.2,-3.1,0],
      "scale": [10,10,10],
      "obj": "bunny",
      "ambient": [0.9,0.9,0.9],
      "diffuse": [0.9,0.9,0.9],
      "specular": [0.2,0.2,0.2],
      "mirror": [0.2,0.2,0.2],
      "phong_exponent": 20
    },
    {
      "type": "mesh",
      "root": [1,-3.21,1],
      "scale": [14,14,14],
      "obj": "bunny",
      "ambient": [0.9,0.4,0.7],
      "diffuse": [0.9,0.4,0.7],
      "specular": [0.2,0.2,0.2],
      "mirror": [0,0,0],
      "phong_exponent": 20
    },
    {
      "type": "plane",
      "point": [0,-2.7,0],
      "normal": [0,1,0],
      "ambient": [0.2,0.2,0.5],
      "diffuse": [0.2,0.2,0.5],
      "specular": [0.2,0.2,0.2],
      "mirror": [0.2,0.2,0.2],
      "phong_exponent": 20
    }
  ],
  "lights": [
    {
      "position": [3,3,5],
      "color": [0.8,0.8,0.8]
    }
  ]
}