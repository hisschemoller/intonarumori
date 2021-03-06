/* eslint-disable new-cap */
import { Store } from 'vuex';
import Ammo from 'ammojs-typed';
import { Scene, Vector3 } from 'three';
import { useStore } from '../../store';
import { State } from '../../store/state';
import Population from '../population';
import createBox from '../primitives/box';
import createCylinder from '../primitives/cylinder';
import BoxConfiguration from '../primitives/BoxConfiguration';
import CylinderConfiguration from '../primitives/CylinderConfiguration';
import Bumper from './bumper';

export default class SecondPopulation extends Population {
  private store: Store<State>;

  private bumpers: Bumper[] = [];

  private backgroundColor = 0xffdd99;

  constructor(scene: Scene, physicsWorld: Ammo.btDiscreteDynamicsWorld) {
    super(physicsWorld);
    this.store = useStore();
    this.populate(scene, physicsWorld);
  }

  private createCalder(
    scene: Scene,
    physicsWorld: Ammo.btDiscreteDynamicsWorld,
    fixedBody: Ammo.btRigidBody,
  ) {
    const tube = createBox(scene, physicsWorld, new BoxConfiguration({
      w: 0.1, h: 1, d: 0.1, px: 0, py: 2, pz: 0, c: 0xff9933,
    }));
    this.meshes.push(tube);

    const constraint = new Ammo.btPoint2PointConstraint(
      fixedBody,
      tube.userData.physicsBody,
      // the offset from the center of each object
      new Ammo.btVector3(2.5, 3, -0.5),
      new Ammo.btVector3(0, 0.5, 0),
    );
    physicsWorld.addConstraint(constraint, true);

    const disc = createCylinder(scene, physicsWorld, new CylinderConfiguration({
      r: 1, h: 0.1, px: 0, py: 1.9, pz: 0, c: 0xff9933, m: 10,
    }));
    this.meshes.push(disc);
    disc.userData.physicsBody.setActivationState(4);

    const constraint2 = new Ammo.btPoint2PointConstraint(
      tube.userData.physicsBody,
      disc.userData.physicsBody,
      new Ammo.btVector3(0, -0.5, 0),
      new Ammo.btVector3(0, 0.1, 0),
    );
    physicsWorld.addConstraint(constraint2, true);
  }

  /**
   * Provide the background clearColor for the renderer.
   */
  getBackgroundColor(): number {
    return this.backgroundColor;
  }

  /**
   * Create the physics and 3D world population.
   */
  private populate(scene: Scene, physicsWorld: Ammo.btDiscreteDynamicsWorld) {
    const fix = createBox(scene, physicsWorld, new BoxConfiguration({
      w: 0.01, h: 0.01, d: 0.01, px: -2.5, pz: 0.5, m: 0, c: 0xffaa33,
    }));
    this.meshes.push(fix);

    this.createCalder(scene, physicsWorld, fix.userData.physicsBody);

    const { bumpers } = this.store.state;
    bumpers.forEach((bumperData, index) => {
      const position = new Vector3(1 + (index % 4), -1, -Math.floor(index / 4));
      const bumper = new Bumper(scene, physicsWorld, index, position, fix.userData.physicsBody);
      this.bumpers.push(bumper);
      this.meshes = [...this.meshes, ...bumper.getMeshes()];
    });
  }
}
