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
      "diffuse": [1.0,1.0,1.0],
      "specular": [0.2,0.2,0.2],
      "mirror": [0.3,0.3,0.3],
      "phong_exponent": 20
    }

  ],
  "lights": [
        {
      "position": [50,-705,300],
      "color": [0,0,1.0],
      "intensity": 900000
    },
    {
      "position": [-250,-705,300],
      "color": [0,1.0,0],
      "intensity": 900000
    },
    {
      "position": [250,-705,300],
      "color": [1.0,0,0],
      "intensity": 900000
    }

]
}