{
  "eye": [0,1,15],
  "lookat": [-1,1,-10],
  "up": [0,1,0],
  "fov_angle": 60,
  "width": 480,
  "height": 270,
  "surfaces": [
    {
      "type": "sphere",
      "center": [0.5,1,-5],
      "radius": 3.5,
      "ambient": [0.3,0.75,0.4],
      "diffuse": [0.3,0.75,0.4],
      "specular": [0.25,0.25,0.25],
      "mirror": [0.1,0.1,0.1],
      "phong_exponent": 50
    },
    {
      "type": "sphere",
      "center": [-4,1,7],
      "radius": 3,
      "ambient": [0.75,0.75,0.75],
      "diffuse": [0.5,0.5,0.5],
      "specular": [0.25,0.8,0.25],
      "mirror": [0.1,0.1,0.1],
      "phong_exponent": 100
    },
    {
      "type": "sphere",
      "center": [8,1,-15],
      "radius": 3,
      "ambient": [0.75,0.3,0.4],
      "diffuse": [0.75,0.3,0.4],
      "specular": [0.25,0.25,0.25],
      "mirror": [0.1,0.1,0.1],
      "phong_exponent": 50
    },
    {
      "type": "plane",
      "point": [0,-3,-10],
      "normal": [0,1,0],
      "ambient": [0.025,0.025,0.05],
      "diffuse": [0.25,0.25,0.5],
      "specular": [0.0,0.0,0.0],
      "mirror": [0.0,0.0,0.0],
      "phong_exponent": 0
    }
  ],
  "lights": [
    {
      "position": [10,20,20],
      "color": [0.8,0.8,0.8]
    },
    {
      "position": [-30,30,0],
      "color": [0.8,0.3,0.3]
    }
  ]
}
