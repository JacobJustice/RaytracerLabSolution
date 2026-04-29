{
  "eye": [5,10,25],
  "lookat": [1,4,0],
  "up": [0,1,0],
  "fov_angle": 60,
  "width": 400,
  "height": 400,
  "surfaces": [
    {
      "type": "sphere",
      "center": [0,6,0],
      "radius": 6,
      "ambient": [0.2,0.2,0.2],
      "diffuse": [0.75,0.75,0.5],
      "specular": [0,0,0],
      "mirror": [0.2,0.2,0.2],
      "phong_exponent": 20
    },
    {
      "type": "sphere",
      "center": [12,3,12],
      "radius": 3,
      "ambient": [0.65,0.5,0.5],
      "diffuse": [0.65,0.5,0.5],
      "specular": [0,0,0],
      "mirror": [0,0,0],
      "phong_exponent": 20
    },
    {
      "type": "plane",
      "point": [0,0,0],
      "normal": [0,1,0],
      "ambient": [0.125,0.125,0.125],
      "diffuse": [0.3,0.3,0.5],
      "specular": [0,0,0],
      "mirror": [0,0,0],
      "phong_exponent": 0
    }
  ],
  "lights": [
    {
      "position": [30,45,10],
      "color": [0.8,0.8,0.8]
    }
  ]
}
