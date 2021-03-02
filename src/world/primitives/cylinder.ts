/* eslint-disable new-cap */
import Ammo from 'ammojs-typed';
import {
  CylinderBufferGeometry,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  Scene,
} from 'three';
import CylinderConfiguration from './CylinderConfiguration';

const MARGIN = 0.05;
const RADIAL_SEGMENTS = 64;
const RESTITUTION = 0.8;

/**
 * Create a cylinder 3D mesh and physics body.
 * @param {object} scene
 * @param {object} physicsWorld
 */
export default function createCylinder(
  scene: Scene,
  physicsWorld: Ammo.btDiscreteDynamicsWorld,
  config: CylinderConfiguration,
): Object3D {
  const {
    color, mass, height, position: pos, quaternion: quat, radius,
  } = config;

  // three.js section
  const geometry = new CylinderBufferGeometry(radius, radius, height, RADIAL_SEGMENTS);
  const cylinder = new Mesh(
    geometry,
    new MeshPhongMaterial({ color, flatShading: false }),
  );
  cylinder.position.set(pos.x, pos.y, pos.z);
  cylinder.castShadow = true;
  cylinder.receiveShadow = true;
  scene.add(cylinder);

  // ammo.js section
  const transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
  const motionState = new Ammo.btDefaultMotionState(transform);

  const shape = new Ammo.btCylinderShape(
    new Ammo.btVector3(radius * 0.5, height * 0.5, radius * 0.5),
  );
  shape.setMargin(MARGIN);

  const localInertia = new Ammo.btVector3(0, 0, 0);
  shape.calculateLocalInertia(mass, localInertia);

  const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
  const body = new Ammo.btRigidBody(rbInfo);
  body.setRestitution(RESTITUTION);

  // eslint-disable-next-line no-bitwise
  physicsWorld.addRigidBody(body);

  cylinder.userData.physicsBody = body;
  return cylinder;
}
