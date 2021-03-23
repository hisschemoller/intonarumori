/* eslint-disable new-cap */
import { computed, watch } from 'vue';
import { Store } from 'vuex';
import {
  Object3D, Scene, Vector3,
} from 'three';
import Ammo from 'ammojs-typed';
import { useStore } from '../../store';
import { State } from '../../store/state';
import createBox from '../primitives/box';
import BoxConfiguration from '../primitives/BoxConfiguration';

export default class Bumper {
  private store: Store<State>;

  private meshes: Object3D[] = [];

  private tubeBody!: Ammo.btRigidBody;

  private slider!: Ammo.btSliderConstraint;

  private index: number;

  constructor(
    scene: Scene,
    physicsWorld: Ammo.btDiscreteDynamicsWorld,
    index: number,
    position: Vector3,
    fixedBody: Ammo.btRigidBody,
  ) {
    this.store = useStore();
    this.index = index;
    this.create(scene, physicsWorld, position, fixedBody);
    this.setupListener();
  }

  /**
   * Create the physics and 3D world population.
   */
  private create(
    scene: Scene,
    physicsWorld: Ammo.btDiscreteDynamicsWorld,
    position: Vector3,
    fixedBody: Ammo.btRigidBody,
  ): void {
    // eslint-disable-next-line no-bitwise
    const color = 0xff3300 + ((this.index * 0x14) << 8);

    const tube = createBox(scene, physicsWorld, new BoxConfiguration({
      w: 1, h: 3, d: 1, py: 0, c: color,
    }));
    this.meshes.push(tube);
    this.tubeBody = tube.userData.physicsBody;

    const localA = new Ammo.btTransform();
    const localB = new Ammo.btTransform();
    localA.setIdentity();
    localB.setIdentity();

    // slide along x-axis is default, so rotate 90 degrees around the z-axis to slide y-axis
    localA.getBasis().setEulerZYX(0, 0, Math.PI * 0.5);
    localB.getBasis().setEulerZYX(0, 0, Math.PI * 0.5);
    localA.setOrigin(new Ammo.btVector3(position.x, 0, position.z));
    localB.setOrigin(new Ammo.btVector3(0, 0, 0));
    this.slider = new Ammo.btSliderConstraint(
      fixedBody,
      tube.userData.physicsBody,
      localA,
      localB,
      true,
    );
    this.slider.setLowerLinLimit(0);
    this.slider.setUpperLinLimit(0.5);
    this.slider.setLowerAngLimit(0);
    this.slider.setUpperAngLimit(0);
    physicsWorld.addConstraint(this.slider, true);
  }

  /**
   * Provide 3D objects.
   */
  public getMeshes(): Object3D[] {
    return this.meshes;
  }

  /**
   * Add listener to changes in the app state.
   */
  private setupListener() {
    const isPressedRef = computed(
      () => this.store.state.bumpers[this.index].kiboPadVelocity,
    );
    watch(isPressedRef, () => {
      // this.setEnabled(isEnabledRef.value === 127);
    });
  }
}
