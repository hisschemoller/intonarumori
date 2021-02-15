/* eslint-disable new-cap */
import Ammo from 'ammojs-typed';
import {
  Group,
  Object3D,
  Scene,
} from 'three';
import CompoundConfiguration from './CompoundConfiguration';

const MARGIN = 0.05;
const RESTITUTION = 0.8;

/**
 * Create a three.js group and physics compound shape.
 * @param {object} scene
 * @param {object} physicsWorld
 */
export default function createCompoundShape(
  scene: Scene,
  physicsWorld: Ammo.btDiscreteDynamicsWorld,
  config: CompoundConfiguration,
): Object3D {
  const {
    mass, position: pos, quaternion: quat, children,
  } = config;

  // three.js section
  const group = new Group();
  group.position.set(pos.x, pos.y, pos.z);
  scene.add(group);
  children.forEach((child) => {
    group.add(child);
  });

  // ammo.js section
  const transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
  const motionState = new Ammo.btDefaultMotionState(transform);

  const shape = new Ammo.btCompoundShape();
  children.forEach((child) => {
    const body: Ammo.btRigidBody = child.userData.physicsBody;
    shape.addChildShape(body.getWorldTransform(), body.getCollisionShape());
  });
  shape.setMargin(MARGIN);

  const localInertia = new Ammo.btVector3(0, 0, 0);
  shape.calculateLocalInertia(mass, localInertia);

  const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
  const body = new Ammo.btRigidBody(rbInfo);
  body.setRestitution(RESTITUTION);

  physicsWorld.addRigidBody(body);

  group.userData.physicsBody = body;
  return group;
}
