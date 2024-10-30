{
  "eye": [-0.8,-1.65,3],
  "lookat": [-0.45,-2,0],
  "up": [0,1,0],
  "fov_angle": 50,
  "width" : 800,
  "height": 800,
  "surfaces": [
    {
      "type": "mesh",
      "root": [0,-3,0],
      "scale": [10,10,10],
      "obj": "bunny",
      "ambient": [0.39,0.58,0.93],
      "diffuse": [0.39,0.58,0.93],
      "specular": [0.2,0.2,0.2],
      "mirror": [0,0,0],
      "phong_exponent": 20
    }
    ,
    {
      "type": "plane",
      "point": [0,-2.7,0],
      "normal": [0,1,0],
      "ambient": [0.5,0.5,0.5],
      "diffuse": [0.5,0.5,0.5],
      "specular": [0.2,0.2,0.2],
      "mirror": [0.1,0.1,0.1],
      "phong_exponent": 20
    }
  ],
  "lights": [
    {
      "position": [3,3,5],
      "color": [0.8,0.8,0.8],
      "intensity": 100
    }
  ]
}