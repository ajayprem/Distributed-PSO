from fastapi import FastAPI
import random
import numpy as np
from matplotlib import pyplot as plt
from matplotlib import animation
from threading import Lock, Thread
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from numpy import exp
from numpy import sqrt
from numpy import cos
from numpy import e
from numpy import pi
from numpy import*
import math 

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
fitness_function = None

results = None

def Euclidean(x1,x2):
  f1=x1 
  f2=x2
  z = f1**2+f2**2
  return z

#Ackley function
def Ackley(x,y):
  z = -20.0 * exp(-0.2 * sqrt(0.5 * (x**2 + y**2)))-exp(0.5 * (cos(2 * 
  pi * x)+cos(2 * pi * y))) + e + 20
  return z

#Egg holder function min - 959.6407
def Egg(x1,x2):
  a=sqrt(fabs(x2+x1/2+47))
  b=sqrt(fabs(x1-(x2+47)))
  c=-(x2+47)*sin(a)-x1*sin(b)
  return c

#Schaffer function
def Schaffer(x,y):
  num = (np.sin((x**2 + y**2)**2)**2) - 0.5
  den = (1 + 0.001*(x**2 + y**2))**2 
  return 0.5 + num/den

#Easom function min -1
def Easom(x1,x2):
  return -(np.cos(x1)*np.cos(x2))*np.exp(-(x1-math.pi)**2-(x2-math.pi)**2)

def update_velocity(particle, velocity, pbest, gbest, w_min=0.5, max=1.0, c1=0.1, c2=0.1):
  # Initialise new velocity array
  num_particle = len(particle)
  new_velocity = np.array([0.0 for i in range(num_particle)])
  # Randomly generate r1, r2 and inertia weight from normal distribution
  r1 = random.uniform(0,max)
  r2 = random.uniform(0,max)
  w = random.uniform(w_min,max)
  # Calculate new velocity
  for i in range(num_particle):
    new_velocity[i] = w*velocity[i] + c1*r1*(pbest[i]-particle[i])+c2*r2*(gbest[i]-particle[i])
  return new_velocity


def update_position(particle, velocity):
  # Move particles by adding velocity
  new_particle = particle + velocity
  return new_particle

def pso_2d(population, dimension, position_min, position_max, generation, fitness_criterion, lock, pos, c1, c2):
  # Initialisation
  # Population
  particles = [[random.uniform(position_min, position_max) for j in range(dimension)] for i in range(population)]
  # Particle's best position
  pbest_position = particles
  # Fitness
  pbest_fitness = [fitness_function(p[0],p[1]) for p in particles]
  # Index of the best particle
  global gbest_fit, gbest_position, results

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
        velocity[n] = update_velocity(particles[n], velocity[n], pbest_position[n], gbest_position, c1=c1, c2=c2)
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
  temp = 'Global best position:\t' +  str(gbest_position) + ' \nBest Fitness:\t' + str(gbest_fit) + '\nAverage Fitness:\t' + str(np.average(pbest_fitness)) + '\nGenerations:\t' + str(t)

  results[pos] = temp

class Input(BaseModel):
    systems: str
    generations: int
    population: int
    minPos: float
    maxPos: float
    func: str
   
functions = {
  'eu':Euclidean,
  'ack': Ackley,
  'egg':Egg,
  'sch':Schaffer,
  'ea':Easom
}

@app.post("/run")
async def single(body: Input):
    num_of_systems = int(body.systems)
    generations = int(body.generations)
    population = int(body.population)
    minPos = int(body.minPos)
    maxPos = int(body.maxPos)
    func = body.func

    print(body)

    criteria = 10e-4

    if func == 'ea':
      criteria -= 1
    
    elif func == 'egg':
      criteria -= 959.6407

    lock = Lock()
    global gbest_fit, gbest_position, results, fitness_function

    fitness_function = functions[func]

    gbest_fit = None
    gbest_position = None
    results = {}

    threads = []
    c1 = []
    c2 = []
    for i in range(num_of_systems):
      c = random.choice([0.1, 0.15, 0.2, 0.25])
      c1.append(c)
      c = random.choice([0.1, 0.15, 0.2, 0.25])
      c2.append(c)

    print(c1, c2)

    for i in range(num_of_systems):
      thread = Thread(target=pso_2d, args=(population, 2, minPos, maxPos, generations, criteria, lock, i, c1[i], c2[i]))
      thread.start()
      threads.append(thread)
    
    for thread in threads:
      thread.join()

    return results
