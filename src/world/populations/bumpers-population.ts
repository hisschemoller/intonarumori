/* eslint-disable new-cap */
import { Store } from 'vuex';
import Ammo from 'ammojs-typed';
import { Scene, Vector3 } from 'three';
import { useStore } from '../../store';
import { State } from '../../store/state';
import Population from '../population';
import createBox from '../primitives/box';
import BoxConfiguration from '../primitives/BoxConfiguration';
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
      w: 0.1, h: 0.1, d: 0.1, px: -2.5, pz: 0.5, m: 0, c: 0xffaa33,
    }));
    this.meshes.push(fix);

    const { bumpers } = this.store.state;
    bumpers.forEach((bumperData, index) => {
      const position = new Vector3(1 + (index % 4), 0, -Math.floor(index / 4));
      const bumper = new Bumper(scene, physicsWorld, index, position, fix.userData.physicsBody);
      this.bumpers.push(bumper);
      this.meshes = [...this.meshes, ...bumper.getMeshes()];
    });
  }

  /**
   * Update after each step, received from webgl.draw()
   */
  update(): void {
    super.update();
  }
}
