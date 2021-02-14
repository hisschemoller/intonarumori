/* eslint-disable new-cap */
import Ammo from 'ammojs-typed';
import { computed, watch } from 'vue';
import { Store } from 'vuex';
import { State } from '../store/state';
import { useStore } from '../store';
import { MIDIMessageType } from '../app/midi-types';

let physicsWorld: Ammo.btDiscreteDynamicsWorld;
let store: Store<State>;

/**
 * Add listener to changes in the app state.
 */
function setupListener() {
  store = useStore();
  const midiMessageRef = computed(() => store.state.midiMessage);
  watch(midiMessageRef, () => {
    const { type, data0, data1 } = store.state.midiMessage;
    if (type === MIDIMessageType.CONTROL_CHANGE && data0 === 117) {
      console.log(data1);
    }
  });
}

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
      setupListener();
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
