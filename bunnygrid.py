import copy
import random

bunny = {
      "type": "mesh",
    #   "root": [-20,-45,-10],
      "scale": [40,40,40],
      "obj": "bunny",
    #   "ambient": [0.9,0.93,0.93],
    #   "diffuse": [0.9,0.93,0.93],
      "specular": [0.2,0.2,0.2],
      "mirror": [0,0,0],
      "phong_exponent": 20
}

def lerp(start_color, end_color, t):
    # Linear interpolation between two colors
    return [
        (1 - t) * start_color[0] + t * end_color[0],
        (1 - t) * start_color[1] + t * end_color[1],
        (1 - t) * start_color[2] + t * end_color[2]
    ]

def generate_grid(min_point, max_point, step_size=10, start_color=(1, 0, 0), end_color=(0, 0, 1), jitter_range=(-2,2)):
    grid = []

    for x in range(min_point[0], max_point[0] + 1, step_size):
        for y in range(min_point[1], max_point[1] + 1, step_size):
            t_x = (x - min_point[0]) / (max_point[0] - min_point[0])
            t_y = (y - min_point[1]) / (max_point[1] - min_point[1])
            
            jitter_x = random.uniform(jitter_range[0], jitter_range[1])
            jitter_y = random.uniform(jitter_range[0], jitter_range[1])

            x_jittered = x + jitter_x
            y_jittered = y + jitter_y

            color = lerp(start_color, end_color, (t_x + t_y)/2)
            bunnycopy = copy.deepcopy(bunny)
            bunnycopy.update(
                            {
                                "root" : [x_jittered,-45,y_jittered],
                                "ambient" : color,
                                "diffuse": color
                            }
                        )
            grid.append(bunnycopy)

    return grid


# Example usage:
min_point = (-100, -100)
max_point = (100, 100)
step_size = 10

grid_points = generate_grid(min_point, max_point, step_size)

with open('bunnypoints.txt','w') as file:
    for point in grid_points:
        file.write(str(point)+",\n")
        # file.write('test')
