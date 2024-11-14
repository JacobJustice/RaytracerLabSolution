{
  "eye": [2, 2.5, 4],
  "lookat": [0, 0.5, 0],
  "up": [0, 1, 0],
  "fov_angle": 80,
  "width": 400,
  "height": 400,
  "surfaces": [
    {
      "type": "aabb",
      "center": [0.5, 1, -1],
      "min": [-1, 0, -1],
      "max": [1, 2, 1],
      "ambient": [0.1, 0.1, 0.1],
      "diffuse": [0.2, 0.5, 0.2],
      "specular": [0.3, 0.3, 0.3],
      "mirror": [0, 0, 0],
      "phong_exponent": 100
    },
    {
      "type": "plane",
      "point": [0, 0, 0],
      "normal": [0, 1, 0],
      "ambient": [0.05, 0.05, 0.05],
      "diffuse": [0.3, 0.3, 0.3],
      "specular": [0.2, 0.2, 0.2],
      "mirror": [1, 1, 1],
      "phong_exponent": 100
    }
  ],
  "lights": [
    {
      "position": [-2, 8, -4],
      "color": [1, 1, 1],
      "intensity": 100
    },
    {
      "position": [2,2,4],
      "color": [0.8,0.8,0.8],
      "intensity":10
    }
  ]
}
