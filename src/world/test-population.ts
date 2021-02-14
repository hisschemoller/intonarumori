/* eslint-disable new-cap */
import Ammo from 'ammojs-typed';
import { Scene } from 'three';
import Population from './population';
import createBox from './primitives/box';
import BoxConfiguration from './primitives/BoxConfiguration';

export default class TestPopulation extends Population {
  constructor(scene: Scene, physicsWorld: Ammo.btDiscreteDynamicsWorld) {
    super();
    this.populate(scene, physicsWorld);
  }

  /**
   * Create the physics and 3D world population.
   * @param {Object} scene 3D scene.
   * @param {Object} physicsWorld Ammo world.
   */
  private populate(scene: Scene, physicsWorld: Ammo.btDiscreteDynamicsWorld) {
    // HINGE CONSTRAINT AND MOTOR
    const fixedBox = createBox(scene, physicsWorld, new BoxConfiguration({
      w: 0.1, h: 0.1, d: 0.1, pz: -0.3, m: 0,
    }));
    this.meshes.push(fixedBox);

    const box1 = createBox(scene, physicsWorld, new BoxConfiguration({
      w: 1, h: 0.2, d: 0.2, px: 0.5, py: 0, m: 1,
    }));
    this.meshes.push(box1);

    const box2 = createBox(scene, physicsWorld, new BoxConfiguration({
      w: 1, h: 0.2, d: 0.2, px: 1, py: 1, m: 1,
    }));
    this.meshes.push(box2);

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
  }
}
