{
  "eye": [5,5,25],
  "lookat": [0,0,0],
  "up": [0,1,0],
  "fov_angle": 60,
  "width": 500,
  "height":350,
  "surfaces": [
    {
      "type": "sphere",
      "center": [-8,5,0],
      "radius": 5,
      "ambient": [0.5,0.75,0.25],
      "diffuse": [0.5,0.75,0.25],
      "specular": [0.2,0.2,0.2],
      "mirror": [0.05,0.05,0.05],
      "phong_exponent": 20
    },
    {
      "type": "sphere",
      "center": [0,6,-10],
      "radius": 7,
      "ambient": [0.75,0.5,0.25],
      "diffuse": [0.75,0.5,0.25],
      "specular": [0.2,0.2,0.2],
      "mirror": [0.2,0.2,0.2],
      "phong_exponent": 20
    },
    {
      "type": "sphere",
      "center": [10,4,0],
      "radius": 4,
      "ambient": [0.25,0.5,0.75],
      "diffuse": [0.25,0.5,0.75],
      "specular": [0.2,0.2,0.2],
      "mirror": [0.05,0.05,0.05],
      "phong_exponent": 200
    },
    {
      "type": "plane",
      "point": [0,0,0],
      "normal": [0,1,0],
      "ambient": [0.125,0.125,0.125],
      "diffuse": [0.5,0.5,0.5],
      "specular": [0.1,0.1,0.1],
      "mirror": [0.2,0.2,0.2],
      "phong_exponent": 0
    }
  ],
  "lights": [
    {
      "position": [2,5,5],
      "color": [0.8,0.8,0.6],
      "intensity": 25
    }
  ]
}
