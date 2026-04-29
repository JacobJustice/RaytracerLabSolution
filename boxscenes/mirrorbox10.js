{
  "eye": [0,-0.1,2],
  "lookat": [0,0,0],
  "up": [0,1,0],
  "fov_angle": 80,
  "width": 500,
  "height": 500,
  "surfaces": [
    {
      "type": "aabb",
      "center": [-0.9,-0.89,-0.8],
      "min": [-0.2,-0.2,-0.2],
      "max": [0.3,0.3,0.3],
      "ambient": [0.25,0.25,0.25],
      "diffuse": [0.75,0.75,0.75],
      "specular": [0.25,0.25,0.25],
      "mirror": [0.15,0.15,0.15],
      "phong_exponent": 50
    },
    {
      "type": "aabb",
      "center": [0.8,-0.89,-0.1],
      "min": [-0.2,-0.2,-0.2],
      "max": [0.4,0.4,0.4],
      "ambient": [0.01,0.01,0.01],
      "diffuse": [0.25,0.25,0.25],
      "specular": [0.75,0.75,0.75],
      "mirror": [0.15,0.15,0.15],
      "phong_exponent": 50
    },
    {
      "type": "plane",
      "point": [0,-1.5,0],
      "normal": [0,1,0],
      "ambient": [0.25,0.25,0.25],
      "diffuse": [0.5,0.5,0.5],
      "specular": [0.0,0.0,0.0],
      "mirror": [0.8,0.8,0.8],
      "phong_exponent": 0
    },

    {
      "type": "plane",
      "point": [0,0,-2.0],
      "normal": [0,0,1],
      "ambient": [0.025,0.025,0.025],
      "diffuse": [0.4,0.8,0.4],
      "specular": [0.0,0.0,0.0],
      "mirror": [0.8,0.8,0.8],
      "phong_exponent": 0
    },
    {
      "type": "plane",
      "point": [2.0,0,0],
      "normal": [-1,0,0],
      "ambient": [0.025,0.025,0.025],
      "diffuse": [0.4,0.4,0.8],
      "specular": [0.0,0.0,0.0],
      "mirror": [0.8,0.8,0.8],
      "phong_exponent": 0
    },
    {
      "type": "plane",
      "point": [-2.0,0,0],
      "normal": [1,0,0],
      "ambient": [0.025,0.025,0.025],
      "diffuse": [0.8,0.4,0.4],
      "specular": [0.0,0.0,0.0],
      "mirror": [0.8,0.8,0.8],
      "phong_exponent": 0
    },
    {
      "type": "plane",
      "point": [0,0,4.5],
      "normal": [0,0,-1],
      "ambient": [0.025,0.025,0.025],
      "diffuse": [0.8,0.8,0.8],
      "specular": [0.0,0.0,0.0],
      "mirror": [0.8,0.8,0.8],
      "phong_exponent": 0
    }
  ],
  "lights": [
    {
      "position": [0,0.5,0],
      "color": [1,1,1],
      "intensity": 4
    }
  ]
}
