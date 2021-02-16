/* eslint-disable new-cap */
import { computed, watch } from 'vue';
import { Store } from 'vuex';
import Ammo from 'ammojs-typed';
import { Euler, Quaternion, Scene } from 'three';
import { State } from '../../store/state';
import { useStore } from '../../store';
import { MIDIMessageType } from '../../app/midi-types';
import Population from '../population';
import createBox from '../primitives/box';
import BoxConfiguration from '../primitives/BoxConfiguration';
import createCompoundShape from '../primitives/compound';
import createCylinder from '../primitives/cylinder';
import CylinderConfiguration from '../primitives/CylinderConfiguration';
import CompoundConfiguration from '../primitives/CompoundConfiguration';

export default class DrumwheelPopulation extends Population {
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
    const fix = createBox(scene, physicsWorld, new BoxConfiguration({
      w: 0.1, h: 0.1, d: 0.1, pz: -0.3, m: 0,
    }));
    this.meshes.push(fix);

    const cylinder1 = createCylinder(scene, physicsWorld, new CylinderConfiguration({
      h: 0.8, r: 1.5,
    }));

    const q = new Quaternion().setFromEuler(new Euler(0, 0, 0));
    const bump1 = createBox(scene, physicsWorld, new BoxConfiguration({
      w: 1, h: 0.15, d: 1, pz: 1.5, qx: q.x, qy: q.y, qz: q.z, qw: q.w,
    }));

    const compound = createCompoundShape(scene, physicsWorld, new CompoundConfiguration(
      {}, [cylinder1, bump1],
    ));
    this.meshes.push(compound);

    this.hinge1 = new Ammo.btHingeConstraint(
      fix.userData.physicsBody,
      compound.userData.physicsBody,
      new Ammo.btVector3(0, 0, 0.3),
      new Ammo.btVector3(0, 0, 0),
      new Ammo.btVector3(0, 0, 1),
      new Ammo.btVector3(0, 1, 0),
      true,
    );
    this.hinge1.enableAngularMotor(true, -1.5, 0.5);
    physicsWorld.addConstraint(this.hinge1, true);

    const stick = createBox(scene, physicsWorld, new BoxConfiguration({
      w: 0.3, h: 2, d: 0.3, m: 0.5,
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
   * Add listener to changes in the app state.
   */
  private setupListener() {
    const midiMessageRef = computed(() => this.store.state.midiMessage);
    watch(midiMessageRef, () => {
      const { type, data0, data1 } = this.store.state.midiMessage;
      if (type === MIDIMessageType.CONTROL_CHANGE && data0 === 117) {
        // this.updateMotor(data1 / 127);
      }
    });
  }
}
