{
  "eye": [2.5,2.2,5],
  "lookat": [0,1,0],
  "up": [0,1,0],
  "fov_angle": 60,
  "width": 400,
  "height": 400,
  "surfaces": [
    {
      "type": "aabb",
      "center": [0.5,0,-1],
      "min": [-1,0,-1],
      "max": [1,2,2],
      "ambient": [0.9,0.3,0.3],
      "diffuse": [0.9,0.3,0.3],
      "specular": [0.5,0.5,0.5],
      "mirror": [0,0,0],
      "phong_exponent": 20
    },
    {
      "type": "plane",
      "point": [0,0,0],
      "normal": [0,1,0],
      "ambient": [0.125,0.125,0.125],
      "diffuse": [0.5,0.5,0.5],
      "specular": [0.1,0.1,0.1],
      "mirror": [1,1,1],
      "phong_exponent": 0
    }
  ],
  "lights": [
    {
      "position": [25,12,10],
      "color": [0.8,0.8,0.8],
      "intensity": 1200
    }
  ]
}


