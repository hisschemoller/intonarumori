/* eslint-disable new-cap */
import Ammo from 'ammojs-typed';
import {
  BoxBufferGeometry,
  Mesh,
  MeshPhongMaterial,
  Scene,
} from 'three';
import BoxConfiguration from './BoxConfiguration';

const COLOR = 0xff0505;
const MARGIN = 0.05;
const RESTITUTION = 0.8;

/**
 * Create a box 3D mesh and physics body.
 * @param {object} scene
 * @param {object} physicsWorld
 */
export default function createBox(
  scene: Scene,
  physicsWorld: Ammo.btDiscreteDynamicsWorld,
  config: BoxConfiguration,
): Mesh {
  const {
    mass, position: pos, quaternion: quat, size,
  } = config;

  // three.js section
  console.log(size);
  const box = new Mesh(
    new BoxBufferGeometry(size.w, size.h, size.d),
    new MeshPhongMaterial({ color: COLOR }),
  );
  box.position.set(pos.x, pos.y, pos.z);
  box.castShadow = true;
  box.receiveShadow = true;
  scene.add(box);

  // Ammojs Section
  const transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
  const motionState = new Ammo.btDefaultMotionState(transform);

  const colShape = new Ammo.btBoxShape(
    new Ammo.btVector3(size.w * 0.5, size.h * 0.5, size.d * 0.5),
  );
  colShape.setMargin(MARGIN);

  const localInertia = new Ammo.btVector3(0, 0, 0);
  colShape.calculateLocalInertia(mass, localInertia);

  const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
  const body = new Ammo.btRigidBody(rbInfo);
  body.setRestitution(RESTITUTION);

  physicsWorld.addRigidBody(body);

  box.userData.physicsBody = body;
  return box;
}
