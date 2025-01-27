{
  "eye": [50,30,50],
  "lookat": [5,10,0],
  "up": [0,1,0],
  "fov_angle": 50,
  "width" : 400,
  "height": 300,
  "surfaces": [
    {
      "type": "mesh",
      "root": [0,-2.7,0],
      "scale": [0.05,0.05,0.05],
      "obj": "cat",
      "ambient": [0.9,0.4,0.93],
      "diffuse": [0.9,0.4,0.93],
      "specular": [0.2,0.2,0.2],
      "mirror": [0,0,0],
      "phong_exponent": 20
    }
    ,
    {
      "type": "plane",
      "point": [0,-2.7,0],
      "normal": [0,1,0],
      "ambient": [0.4,0.4,0.4],
      "diffuse": [0.5,0.5,0.5],
      "specular": [0.2,0.2,0.2],
      "mirror": [0.5,0.5,0.5],
      "phong_exponent": 20
    }
  ],
  "lights": [
    {
      "position": [200,100,100],
      "color": [0.8,0.8,0.8]
    }
  ]
}