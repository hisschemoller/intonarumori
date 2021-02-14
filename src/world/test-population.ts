/* eslint-disable new-cap */
import { computed, watch } from 'vue';
import { Store } from 'vuex';
import Ammo from 'ammojs-typed';
import { Scene } from 'three';
import { State } from '../store/state';
import { useStore } from '../store';
import { MIDIMessageType } from '../app/midi-types';
import Population from './population';
import createBox from './primitives/box';
import BoxConfiguration from './primitives/BoxConfiguration';

export default class TestPopulation extends Population {
  private store: Store<State>;

  private hinge1!: Ammo.btHingeConstraint;

  constructor(scene: Scene, physicsWorld: Ammo.btDiscreteDynamicsWorld) {
    super();
    this.store = useStore();
    this.populate(scene, physicsWorld);
    this.setupListener();
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

    this.hinge1 = new Ammo.btHingeConstraint(
      fixedBox.userData.physicsBody,
      box1.userData.physicsBody,
      new Ammo.btVector3(0, 0, 0.3),
      new Ammo.btVector3(-0.5, 0, 0),
      new Ammo.btVector3(0, 0, 1),
      new Ammo.btVector3(0, 0, 1),
      false,
    );
    this.hinge1.enableAngularMotor(true, 3, 0.5);
    physicsWorld.addConstraint(this.hinge1, true);

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

  /**
   * Add listener to changes in the app state.
   */
  private setupListener() {
    const midiMessageRef = computed(() => this.store.state.midiMessage);
    watch(midiMessageRef, () => {
      const { type, data0, data1 } = this.store.state.midiMessage;
      if (type === MIDIMessageType.CONTROL_CHANGE && data0 === 117) {
        this.updateMotor(data1 / 127);
      }
    });
  }

  private updateMotor(value: number): void {
    const isEnabled = value > 0;
    this.hinge1.enableAngularMotor(isEnabled, value * 6, 0.5);
  }
}
