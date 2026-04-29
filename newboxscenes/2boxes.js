{
  "eye": [1,3,8],
  "lookat": [0,0,0],
  "up": [0,1,0],
  "fov_angle": 80,
  "width": 400,
  "height": 400,
  "surfaces": [
    {
      "type": "aabb",
      "center": [2,0,0],
      "min": [-1,0,-1],
      "max": [1,2,1],
      "ambient": [0.9,0.3,0.3],
      "diffuse": [0.9,0.3,0.3],
      "specular": [0.5,0.5,0.5],
      "mirror": [0,0,0],
      "phong_exponent": 20
    },
    {
      "type": "aabb",
      "center": [-2,0,0],
      "min": [-2,0,-2],
      "max": [2,4,2],
      "ambient": [0.3,0.3,0.8],
      "diffuse": [0.3,0.3,0.8],
      "specular": [0.5,0.5,0.5],
      "mirror": [0,0,0],
      "phong_exponent": 20
    },    {
      "type": "plane",
      "point": [0,0,0],
      "normal": [0,1,0],
      "ambient": [0.125,0.125,0.125],
      "diffuse": [0.5,0.5,0.5],
      "specular": [0.1,0.1,0.1],
      "mirror": [0.1,0.1,0.1],
      "phong_exponent": 0
    }
  ],
  "lights": [
    {
      "position": [2,6,6],
      "color": [0.8,0.8,0.8],
      "intensity": 50
    }
  ]
}