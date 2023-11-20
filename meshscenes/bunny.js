{
  "eye": [0,-10,6],
  "lookat": [0,0,0],
  "up": [0,0,1],
  "fov_angle": 70,
  "width": 400,
  "height": 400,
  "surfaces": [
    {
      "type": "mesh",
      "root": [0,0,0],
      "file": "obj/bunny.obj",
      "ambient": [0.39,0.58,0.93],
      "diffuse": [0.39,0.58,0.93],
      "specular": [0.2,0.2,0.2],
      "mirror": [0,0,0],
      "phong_exponent": 20
    },
    {
      "type": "plane",
      "point": [0,0,-5],
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
      "position": [-20,-10,50],
      "color": [0.8,0.8,0.8]
    }
  ]
}