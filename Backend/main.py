from fastapi import FastAPI
import random
import numpy as np
from matplotlib import pyplot as plt
from matplotlib import animation
from threading import Lock, Thread
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

gbest_fit = None
gbest_position = None

def fitness_function(x1,x2):
  f1=x1+2*-x2+3
  f2=2*x1+x2-8
  z = f1**2+f2**2
  return z

def update_velocity(particle, velocity, pbest, gbest, w_min=0.5, max=1.0, c=0.1):
  # Initialise new velocity array
  num_particle = len(particle)
  new_velocity = np.array([0.0 for i in range(num_particle)])
  # Randomly generate r1, r2 and inertia weight from normal distribution
  r1 = random.uniform(0,max)
  r2 = random.uniform(0,max)
  w = random.uniform(w_min,max)
  c1 = c
  c2 = c
  # Calculate new velocity
  for i in range(num_particle):
    new_velocity[i] = w*velocity[i] + c1*r1*(pbest[i]-particle[i])+c2*r2*(gbest[i]-particle[i])
  return new_velocity


def update_position(particle, velocity):
  # Move particles by adding velocity
  new_particle = particle + velocity
  return new_particle

def pso_2d(population, dimension, position_min, position_max, generation, fitness_criterion, lock):
  # Initialisation
  # Population
  particles = [[random.uniform(position_min, position_max) for j in range(dimension)] for i in range(population)]
  # Particle's best position
  pbest_position = particles
  # Fitness
  pbest_fitness = [fitness_function(p[0],p[1]) for p in particles]
  # Index of the best particle
  global gbest_fit, gbest_position

  with lock:
      temp = min(pbest_fitness)
      if gbest_fit is None or temp < gbest_fit:
        gbest_position = pbest_position[np.argmin(pbest_fitness)]
        gbest_fit = temp


  velocity = [[0.0 for j in range(dimension)] for i in range(population)]
  
  # Loop for the number of generation
  for t in range(generation):
    # Stop if the average fitness value reached a predefined success criterion
    if np.average(pbest_fitness) <= fitness_criterion:
      break
    else:
      for n in range(population):
        # Update the velocity of each particle
        velocity[n] = update_velocity(particles[n], velocity[n], pbest_position[n], gbest_position)
        # Move the particles to new position
        particles[n] = update_position(particles[n], velocity[n])
    # Calculate the fitness value
    pbest_fitness = [fitness_function(p[0],p[1]) for p in particles]
    # Find the index of the best particle
    with lock:
      temp = min(pbest_fitness)
      if gbest_fit is None or temp < gbest_fit:
        gbest_position = pbest_position[np.argmin(pbest_fitness)]
        gbest_fit = temp


  # Print the results
  results = {
  'Global Best Position: ': str(gbest_position), 'Best Fitness Value: ': min(pbest_fitness),
  'Average Particle Best Fitness Value: ': np.average(pbest_fitness),
  'Number of Generation:': t
  }

  return results
   
@app.get("/single")
async def single():
    lock = Lock()
    global gbest_fit, gbest_position
    gbest_fit = None
    gbest_position = None
    result = pso_2d(1000, 2, -100.0, 0.0, 400, 10e-4, lock)
    return result


@app.get("/Many")
async def root():
    lock = Lock()
    gbest_fit = None
    gbest_fit = None
    result = pso_2d(1000, 2, -100.0, 0.0, 400, 10e-4, lock)
    return result