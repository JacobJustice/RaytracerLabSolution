{
  "eye": [-35,-55,-12],
  "lookat": [20,20,3],
  "up": [0,0,1],
  "fov_angle": 70,
  "width": 500,
  "height": 300,
  "surfaces": [
    {
      "type": "mesh",
      "root": [10,0,0],
      "scale": [18,18,18],
      "obj": "dodecahedron",
      "ambient": [0.93,0.58,0.93],
      "diffuse": [0.93,0.58,0.93],
      "specular": [0.2,0.2,0.2],
      "mirror": [0.2,0.2,0.2],
      "phong_exponent": 20
    },
    {
      "type": "mesh",
      "root": [135,25,20],
      "scale": [40,40,40],
      "obj": "dodecahedron",
      "ambient": [0.39,0.93,0.93],
      "diffuse": [0.39,0.93,0.93],
      "specular": [0.2,0.2,0.2],
      "mirror": [0.2,0.2,0.2],
      "phong_exponent": 20
    },
    {
      "type": "mesh",
      "root": [-30,-30,-10],
      "scale": [8,8,8],
      "obj": "dodecahedron",
      "ambient": [0.39,0.58,0.93],
      "diffuse": [0.39,0.58,0.93],
      "specular": [0.2,0.2,0.2],
      "mirror": [0.2,0.2,0.2],
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
      "position": [25,-85,33],
      "color": [0.8,0.8,0.8],
      "intensity":10000
    }
  ]
}