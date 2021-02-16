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
import createCompoundShape from './primitives/compound';
import createCylinder from './primitives/cylinder';
import CylinderConfiguration from './primitives/CylinderConfiguration';
import createSphere from './primitives/sphere';
import SphereConfiguration from './primitives/SphereConfiguration';
import CompoundConfiguration from './primitives/CompoundConfiguration';

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
    const wall = createBox(scene, physicsWorld, new BoxConfiguration({
      w: 0.1, h: 4, d: 5, px: -2, py: -2, m: 0,
    }));
    this.meshes.push(wall);

    const fixedBox = createBox(scene, physicsWorld, new BoxConfiguration({
      w: 0.1, h: 0.1, d: 0.1, pz: -0.3, m: 0,
    }));
    this.meshes.push(fixedBox);

    const cylinder1 = createCylinder(scene, physicsWorld, new CylinderConfiguration({
      h: 1, r: 0.05, px: 0.5, py: 0,
    }));
    this.meshes.push(cylinder1);
    // const box1 = createBox(scene, physicsWorld, new BoxConfiguration({
    //   w: 0.1, h: 1, d: 0.1, py: -0.5,
    // }));
    // this.meshes.push(box1);

    const cylinder2 = createCylinder(scene, physicsWorld, new CylinderConfiguration({
      h: 2, r: 0.05, py: 0.5,
    }));
    // this.meshes.push(cylinder2);
    // const box2 = createBox(scene, physicsWorld, new BoxConfiguration({
    //   w: 0.1, h: 2, d: 0.1, py: 0.5,
    // }));
    // this.meshes.push(box2);

    const sphere = createSphere(scene, physicsWorld, new SphereConfiguration({
      r: 0.2, py: -0.5,
    }));
    // this.meshes.push(sphere);
    // const box3 = createBox(scene, physicsWorld, new BoxConfiguration({
    //   w: 0.3, h: 0.3, d: 0.3, py: -0.5,
    // }));

    const compound = createCompoundShape(scene, physicsWorld, new CompoundConfiguration(
      {}, [cylinder2, sphere],
    ));
    this.meshes.push(compound);

    this.hinge1 = new Ammo.btHingeConstraint(
      fixedBox.userData.physicsBody,
      cylinder1.userData.physicsBody,
      new Ammo.btVector3(0, 0, 0.3),
      new Ammo.btVector3(0, 0.5, 0),
      new Ammo.btVector3(0, 0, 1),
      new Ammo.btVector3(0, 0, 1),
      false,
    );
    this.hinge1.enableAngularMotor(true, 3, 0.5);
    physicsWorld.addConstraint(this.hinge1, true);

    const hinge2 = new Ammo.btHingeConstraint(
      cylinder1.userData.physicsBody,
      compound.userData.physicsBody,
      new Ammo.btVector3(0, -0.5, 0), // pivot box1 local coords
      new Ammo.btVector3(0, 1.5, 0), // pivot compound
      new Ammo.btVector3(0, 0, 1),
      new Ammo.btVector3(0, 0, 1),
      false,
    );
    // hinge2.setAngularOnly(true);
    physicsWorld.addConstraint(hinge2, true);
    // console.log(hinge2.getPa;
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
    console.log(value);
    const isEnabled = value > 0;
    this.hinge1.enableAngularMotor(isEnabled, value * 6, 0.5);
  }
}
