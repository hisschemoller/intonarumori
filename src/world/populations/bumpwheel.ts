/* eslint-disable new-cap */
import { computed, watch } from 'vue';
import { Store } from 'vuex';
import { Object3D, Scene } from 'three';
import Ammo from 'ammojs-typed';
import { useStore } from '../../store';
import { State } from '../../store/state';
import createBox from '../primitives/box';
import BoxConfiguration from '../primitives/BoxConfiguration';
import createCompoundShape from '../primitives/compound';
import createCylinder from '../primitives/cylinder';
import CylinderConfiguration from '../primitives/CylinderConfiguration';
import CompoundConfiguration from '../primitives/CompoundConfiguration';
import { MIDIMessageType } from '../../app/midi-types';
import { MIDI_CCS } from '../../app/config';

export default class Bumpwheel {
  private store: Store<State>;

  private meshes: Object3D[] = [];

  private wheel!: Ammo.btRigidBody;

  private torque = new Ammo.btVector3(0, 0, -4);

  private index: number;

  constructor(
    scene: Scene, physicsWorld: Ammo.btDiscreteDynamicsWorld, index: number, positionZ: number,
  ) {
    this.store = useStore();
    this.index = index;
    this.create(scene, physicsWorld, positionZ);
    this.setupListener();
  }

  /**
   * Create the physics and 3D world population.
   */
  private create(
    scene: Scene, physicsWorld: Ammo.btDiscreteDynamicsWorld, positionZ: number,
  ): void {
    const fix = createBox(scene, physicsWorld, new BoxConfiguration({
      w: 0.1, h: 0.1, d: 0.1, pz: positionZ - 0.3, m: 0,
    }));
    this.meshes.push(fix);

    const cylinder1 = createCylinder(scene, physicsWorld, new CylinderConfiguration({
      h: 0.8, r: 1.5, m: 10,
    }));

    const bump1 = createBox(scene, physicsWorld, new BoxConfiguration({
      w: 1, h: 0.15, d: 1, pz: 1.5,
    }));

    const compound = createCompoundShape(scene, physicsWorld, new CompoundConfiguration(
      { pz: positionZ }, [cylinder1, bump1],
    ));
    this.meshes.push(compound);
    this.wheel = compound.userData.physicsBody;
    this.wheel.setDamping(0.95, 0.95);
    this.wheel.setUserIndex(this.index + 100);

    const hinge1 = new Ammo.btHingeConstraint(
      fix.userData.physicsBody,
      compound.userData.physicsBody,
      new Ammo.btVector3(0, 0, 0.3),
      new Ammo.btVector3(0, 0, 0),
      new Ammo.btVector3(0, 0, 1),
      new Ammo.btVector3(0, 1, 0),
      true,
    );
    // hinge1.enableAngularMotor(true, -1.5, 3);
    physicsWorld.addConstraint(hinge1, true);

    const stick = createBox(scene, physicsWorld, new BoxConfiguration({
      w: 0.3, h: 2, d: 0.3, m: 0.3,
    }));
    this.meshes.push(stick);

    const stickHinge = new Ammo.btHingeConstraint(
      fix.userData.physicsBody,
      stick.userData.physicsBody,
      new Ammo.btVector3(0, 3.9, 0.3),
      new Ammo.btVector3(0, 1, 0),
      new Ammo.btVector3(0, 0, 1),
      new Ammo.btVector3(0, 0, 1),
      true,
    );
    stickHinge.setLimit(0, 1, 1, 1);
    physicsWorld.addConstraint(stickHinge, true);
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
    const midiMessageRef = computed(() => this.store.state.midiMessage);
    watch(midiMessageRef, () => {
      const { type, data0, data1 } = this.store.state.midiMessage;
      if (type === MIDIMessageType.CONTROL_CHANGE && data0 === MIDI_CCS[this.index]) {
        this.torque.setZ(-3 + ((data1 / 127) * -7));
      }
    });
  }

  /**
   * Update after each step.
   */
  update(): void {
    this.wheel.applyTorque(this.torque);
  }
}
