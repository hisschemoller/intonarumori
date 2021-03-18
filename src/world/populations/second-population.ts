/* eslint-disable new-cap */
import { Store } from 'vuex';
import Ammo from 'ammojs-typed';
import { Scene } from 'three';
import { useStore } from '../../store';
import { State } from '../../store/state';
import Population from '../population';

export default class SecondPopulation extends Population {
  private store: Store<State>;

  private backgroundColor = 0xffdd99;

  constructor(scene: Scene, physicsWorld: Ammo.btDiscreteDynamicsWorld) {
    super(physicsWorld);
    this.store = useStore();
    // this.populate(scene, physicsWorld);
  }

  /**
   * Provide the background clearColor for the renderer.
   */
  getBackgroundColor(): number {
    return this.backgroundColor;
  }

  /**
   * Update after each step, received from webgl.draw()
   */
  update(): void {
    super.update();
  }
}
