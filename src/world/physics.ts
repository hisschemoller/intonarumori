/* eslint-disable new-cap */
import Ammo from 'ammojs-typed';
import { Mesh } from 'three';
import { computed, watch } from 'vue';
import { Store } from 'vuex';
import { State } from '../store/state';
import { useStore } from '../store';
import { getPopulation } from './population';
import { MIDIMessageType } from '../app/midi-types';

let physicsWorld: Ammo.btDiscreteDynamicsWorld;
let tmpTrans: Ammo.btTransform;
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
  tmpTrans = new Ammo.btTransform();
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

  getPopulation().forEach((mesh: Mesh) => {
    const body = mesh.userData.physicsBody;
    const motionState = body.getMotionState();
    if (motionState) {
      motionState.getWorldTransform(tmpTrans);
      const p = tmpTrans.getOrigin();
      const q = tmpTrans.getRotation();
      mesh.position.set(p.x(), p.y(), p.z());
      mesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
    }
  });
}
