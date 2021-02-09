/* eslint-disable new-cap */
import Ammo from 'ammojs-typed';
import {
  SphereBufferGeometry,
  Mesh,
  MeshPhongMaterial,
  Scene,
} from 'three';
import SphereConfiguration from './SphereConfiguration';

const COLOR = 0xff0505;
const MARGIN = 0.05;
const SEGMENTS = 16;
const RESTITUTION = 0.8;

/**
 * Create a sphere 3D mesh and physics body.
 * @param {object} scene
 * @param {object} physicsWorld
 */
export default function createSphere(
  scene: Scene,
  physicsWorld: Ammo.btDiscreteDynamicsWorld,
  config: SphereConfiguration,
): Mesh {
  const {
    mass, position: pos, quaternion: quat, radius,
  } = config;

  // three.js section
  const sphere = new Mesh(
    new SphereBufferGeometry(radius, SEGMENTS, SEGMENTS),
    new MeshPhongMaterial({ color: COLOR }),
  );
  sphere.position.set(pos.x, pos.y, pos.z);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  scene.add(sphere);

  // Ammojs Section
  const transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
  const motionState = new Ammo.btDefaultMotionState(transform);

  const colShape = new Ammo.btSphereShape(radius);
  colShape.setMargin(MARGIN);

  const localInertia = new Ammo.btVector3(0, 0, 0);
  colShape.calculateLocalInertia(mass, localInertia);

  const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
  const body = new Ammo.btRigidBody(rbInfo);
  body.setRestitution(RESTITUTION);

  // eslint-disable-next-line no-bitwise
  physicsWorld.addRigidBody(body);

  sphere.userData.physicsBody = body;
  return sphere;
}
