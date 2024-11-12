{
  "eye": [-3,-3,1],
  "lookat": [0,0,0],
  "up": [0,0,1],
  "fov_angle": 40,
  "width": 400,
  "height": 400,
  "surfaces": [
    {
      "type": "mesh",
      "root": [0,0,0],
      "scale": [1,1,1],
      "obj": "dodecahedron",
      "ambient": [0.9,0.3,0.3],
      "diffuse": [0.9,0.3,0.3],
      "specular": [0.2,0.2,0.2],
      "mirror": [0,0,0],
      "phong_exponent": 20
    },
    {
      "type": "plane",
      "point": [0,0,-0.7],
      "normal": [0,0,1],
      "ambient": [0.5,0.5,0.5],
      "diffuse": [0.5,0.5,0.5],
      "specular": [0.2,0.2,0.2],
      "mirror": [0.1,0.1,0.1],
      "phong_exponent": 20
    }

  ],
  "lights": [
    {
      "position": [-5,-5,10],
      "color": [0.8,0.8,0.8],
      "intensity": 200
    }
  ]
}