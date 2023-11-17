{
  "eye": [-50,-50,60],
  "lookat": [2.5,2.5,1.667],
  "up": [0,0,1],
  "fov_angle": 100,
  "width": 400,
  "height": 400,
  "surfaces": [
    {
      "type": "triangle",
      "pointA": [0,10,0],
      "pointB": [10,0,0],
      "pointC": [5,5,10],
      "ambient": [0.75,0.5,0.25],
      "diffuse": [0.75,0.5,0.25],
      "specular": [0.2,0.2,0.2],
      "mirror": [0,0,0],
      "phong_exponent": 20
    },
    {
      "type": "plane",
      "point": [0,0,-50],
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
      "position": [-10,-10,25],
      "color": [0.8,0.8,0.8]
    }
  ]
}