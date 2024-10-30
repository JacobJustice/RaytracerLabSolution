{
  "eye": [45,-55,53],
  "lookat": [1,1,1],
  "up": [0,0,1],
  "fov_angle": 70,
  "width": 400,
  "height": 400,
  "surfaces": [
    {
      "type": "mesh",
      "root": [0,0,0],
      "scale": [18,18,18],
      "obj": "dodecahedron",
      "ambient": [0.39,0.58,0.93],
      "diffuse": [0.39,0.58,0.93],
      "specular": [0.2,0.2,0.2],
      "mirror": [0,0,0],
      "phong_exponent": 20
    },
    {
      "type": "plane",
      "point": [0,0,-15],
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
      "position": [25,-35,70],
      "color": [1.0,0,0],
      "intensity": 5000
    },
    {
      "position": [5,-35,70],
      "color": [0,0,1.0],
      "intensity": 5000
    },
    {
      "position": [-25,-35,70],
      "color": [0,1.0,0],
      "intensity": 5000
    }
]
}