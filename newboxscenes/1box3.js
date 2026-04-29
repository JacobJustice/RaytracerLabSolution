{
  "eye": [15.5,15.2,30],
  "lookat": [2,1,0],
  "up": [0,1,0],
  "fov_angle": 15,
  "width": 600,
  "height": 600,
  "surfaces": [
    {
      "type": "aabb",
      "center": [0.5,0,-1],
      "min": [-1,0,-1],
      "max": [1,2,1],
      "ambient": [0.9,0.9,0.9],
      "diffuse": [0.9,0.9,0.9],
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
      "mirror": [0.2,0.2,0.2],
      "phong_exponent": 0
    }
  ],
  "lights": [
    {
      "position": [-15,12,4],
      "color": [0.0,0.0,0.8],
      "intensity": 400
    },
    {
      "position": [-15,12,10],
      "color": [0.0,0.8,0.0],
      "intensity": 500
    },
    {
      "position": [-15,12,16],
      "color": [0.8,0.0,0.0],
      "intensity": 600
    }
  ]
}


