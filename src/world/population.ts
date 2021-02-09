/* eslint-disable new-cap */
import Ammo from 'ammojs-typed';
import { Mesh, Scene } from 'three';
import createBox from './primitives/box';
import BoxConfiguration from './primitives/BoxConfiguration';
import createCylinder from './primitives/cylinder';
import CylinderConfiguration from './primitives/CylinderConfiguration';

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
  meshes.push(createCylinder(scene, physicsWorld, new CylinderConfiguration({
    h: 0.1, r: 2.5, py: 2,
  })));
  meshes.push(createBox(scene, physicsWorld, new BoxConfiguration({
    m: 0, w: 5, d: 5, h: 0.1, px: 0, py: -2,
  })));
}
