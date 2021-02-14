/* eslint-disable new-cap */
import Ammo from 'ammojs-typed';

let physicsWorld: Ammo.btDiscreteDynamicsWorld;

/**
 * Ammo physics world setup.
 */
function setupPhysicsWorld() {
  // full collision detection algorithm configuration
  const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();

  // dispatcher to register callbacks for collisions
  const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);

  // bounding box collision detection algorithm
  const overlappingPairCache = new Ammo.btDbvtBroadphase();

  // solver for collisions
  const solver = new Ammo.btSequentialImpulseConstraintSolver();

  // the world's gravity
  const gravity = new Ammo.btVector3(0, -9.82, 0);

  // the physics world
  physicsWorld = new Ammo.btDiscreteDynamicsWorld(
    dispatcher,
    overlappingPairCache,
    solver,
    collisionConfiguration,
  );
  physicsWorld.setGravity(gravity);
}
/**
 * Create the physics world.
 */
export function setup(): Promise<Ammo.btDiscreteDynamicsWorld> {
  return new Promise((resolve, reject) => {
    Ammo(Ammo).then(() => {
      console.log('Ammo physics initialised.');
      setupPhysicsWorld();
      resolve(physicsWorld);
    }).catch((error) => {
      reject(error);
    });
  });
}

/**
 * Step physics world.
 * @param {Number} deltaTime Elapsed time.
 */
export function step(deltaTime: number): void {
  physicsWorld.stepSimulation(deltaTime, 10);
}
