{
  "eye": [-0.8,-2.0,3],
  "lookat": [0.0,-2.8,0],
  "up": [0,1,0],
  "fov_angle": 70,
  "width" : 400,
  "height": 300,
  "surfaces": [
    {
      "type": "mesh",
      "root": [-0.4,-3.0,1],
      "scale": [8,8,8],
      "obj": "bunny",
      "ambient": [0.9,0.9,0.9],
      "diffuse": [0.9,0.9,0.9],
      "specular": [0.2,0.2,0.2],
      "mirror": [0.2,0.2,0.2],
      "phong_exponent": 20
    },
    {
      "type": "mesh",
      "root": [0,-2.85,2.1],
      "scale": [4,4,4],
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
      "ambient": [0.0,0.0,0.0],
      "diffuse": [0.2,0.2,0.5],
      "specular": [0.2,0.2,0.2],
      "mirror": [0.2,0.2,0.2],
      "phong_exponent": 20
    }
  ],
  "lights": [
    {
      "position": [3,3,5],
      "color": [0.8,0.8,0.8],
      "intensity": 50
    }
  ]
}