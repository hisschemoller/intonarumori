/* eslint-disable new-cap */
import Ammo from 'ammojs-typed';
import { Mesh, Scene } from 'three';
import createBox from './primitives/box';
import BoxConfiguration from './primitives/BoxConfiguration';
import createCylinder from './primitives/cylinder';
import CylinderConfiguration from './primitives/CylinderConfiguration';
import createSphere from './primitives/sphere';
import SphereConfiguration from './primitives/SphereConfiguration';

const meshes: Mesh[] = [];

/**
 * Get the list of bodies in the physics world.
 * @returns {Array}
 */
export function getPopulation(): Mesh[] {
  return meshes;
}

/**
 * Create the physics and 3D world population.
 * @param {Object} scene 3D scene.
 * @param {Object} physicsWorld Ammo world.
 */
export function populateWorld(scene: Scene, physicsWorld: Ammo.btDiscreteDynamicsWorld): void {
  // HINGE CONSTRAINT AND MOTOR
  const fixedBox = createBox(scene, physicsWorld, new BoxConfiguration({
    w: 0.1, h: 0.1, d: 0.1, pz: -0.3, m: 0,
  }));
  meshes.push(fixedBox);

  const box1 = createBox(scene, physicsWorld, new BoxConfiguration({
    w: 1, h: 0.2, d: 0.2, px: 0.5, py: 0, m: 1,
  }));
  meshes.push(box1);

  const box2 = createBox(scene, physicsWorld, new BoxConfiguration({
    w: 1, h: 0.2, d: 0.2, px: 1, py: 1, m: 1,
  }));
  meshes.push(box2);

  const hinge1 = new Ammo.btHingeConstraint(
    fixedBox.userData.physicsBody,
    box1.userData.physicsBody,
    new Ammo.btVector3(0, 0, 0.3),
    new Ammo.btVector3(-0.5, 0, 0),
    new Ammo.btVector3(0, 0, 1),
    new Ammo.btVector3(0, 0, 1),
    false,
  );
  hinge1.enableAngularMotor(true, 3, 0.5);
  physicsWorld.addConstraint(hinge1, true);

  const hinge2 = new Ammo.btHingeConstraint(
    box1.userData.physicsBody,
    box2.userData.physicsBody,
    new Ammo.btVector3(0.5, 0, 0),
    new Ammo.btVector3(-0.5, 0, 0),
    new Ammo.btVector3(0, 0, 1),
    new Ammo.btVector3(0, 0, 1),
    false,
  );
  physicsWorld.addConstraint(hinge2, true);

  // FIRST TEST
  // meshes.push(createCylinder(scene, physicsWorld, new CylinderConfiguration({
  //   h: 0.1, r: 2.5, py: 2,
  // })));
  // meshes.push(createBox(scene, physicsWorld, new BoxConfiguration({
  //   m: 0, w: 5, d: 5, h: 0.1, px: 0, py: -2,
  // })));
  // meshes.push(createSphere(scene, physicsWorld, new SphereConfiguration({
  //   r: 0.6, px: -0.1, py: 6,
  // })));
}
