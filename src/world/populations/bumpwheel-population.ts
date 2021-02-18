/* eslint-disable new-cap */
import { computed, watch } from 'vue';
import { Store } from 'vuex';
import Ammo from 'ammojs-typed';
import { Euler, Quaternion, Scene } from 'three';
import { useStore } from '../../store';
import { State } from '../../store/state';
import { MutationType } from '../../store/mutations';
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

  private wheel!: Ammo.btRigidBody;

  private torque = new Ammo.btVector3(0, 0, -4);

  constructor(scene: Scene, physicsWorld: Ammo.btDiscreteDynamicsWorld) {
    super(physicsWorld);
    this.store = useStore();
    this.populate(scene, physicsWorld);
    this.setupListener();
  }

  /**
   * Add listener to changes in the app state.
   */
  private detectCollision(): void {
    const dispatcher = this.physicsWorld.getDispatcher();
    const numManifolds = dispatcher.getNumManifolds();
    for (let i = 0; i < numManifolds; i += 1) {
      const contactManifold = dispatcher.getManifoldByIndexInternal(i);
      const numContacts = contactManifold.getNumContacts();
      for (let j = 0; j < numContacts; j += 1) {
        const contactPoint = contactManifold.getContactPoint(j);
        const distance = contactPoint.getDistance();
        if (distance <= 0) {
          const impulse = contactPoint.getAppliedImpulse();
          if (impulse > 0.1) {
            this.store.commit(MutationType.PlaySound, {
              type: MIDIMessageType.NOTE_ON,
              channel: 1,
              data0: 60,
              data1: Math.max(127, Math.floor(impulse * 127)),
            });
          }
        }
      }
    }
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
      h: 0.8, r: 1.5, m: 10,
    }));

    const q = new Quaternion().setFromEuler(new Euler(0, 0, 0));
    const bump1 = createBox(scene, physicsWorld, new BoxConfiguration({
      w: 1, h: 0.15, d: 1, pz: 1.5, qx: q.x, qy: q.y, qz: q.z, qw: q.w,
    }));

    const compound = createCompoundShape(scene, physicsWorld, new CompoundConfiguration(
      {}, [cylinder1, bump1],
    ));
    this.meshes.push(compound);
    this.wheel = compound.userData.physicsBody;
    this.wheel.applyTorque(new Ammo.btVector3(1, 1, 1));
    this.wheel.setDamping(0.95, 0.95);

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
   * Add listener to changes in the app state.
   */
  private setupListener() {
    const midiMessageRef = computed(() => this.store.state.midiMessage);
    watch(midiMessageRef, () => {
      const { type, data0, data1 } = this.store.state.midiMessage;
      if (type === MIDIMessageType.CONTROL_CHANGE && data0 === 117) {
        this.torque.setZ(-3 + ((data1 / 127) * -7));
      }
    });
  }

  /**
   * Update after each step.
   */
  update(): void {
    super.update();
    this.detectCollision();
    this.wheel.applyTorque(this.torque);
  }
}
