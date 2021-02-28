/* eslint-disable new-cap */
import { Store } from 'vuex';
import Ammo from 'ammojs-typed';
import { Scene } from 'three';
import { useStore } from '../../store';
import { State } from '../../store/state';
import { MutationType } from '../../store/mutations';
import { MIDIMessageType } from '../../app/midi-types';
import Population from '../population';
import Bumpwheel from './bumpwheel';
import createBox from '../primitives/box';
import BoxConfiguration from '../primitives/BoxConfiguration';

export default class BumpwheelPopulation extends Population {
  private store: Store<State>;

  private wheels: Bumpwheel[] = [];

  constructor(scene: Scene, physicsWorld: Ammo.btDiscreteDynamicsWorld) {
    super(physicsWorld);
    this.store = useStore();
    this.populate(scene, physicsWorld);
  }

  /**
   * Add listener to changes in the app state.
   */
  private detectCollision(): void {
    const dispatcher = this.physicsWorld.getDispatcher();
    const numManifolds = dispatcher.getNumManifolds();
    for (let i = 0; i < numManifolds; i += 1) {
      const contactManifold = dispatcher.getManifoldByIndexInternal(i);
      const body0: Ammo.btRigidBody = contactManifold.getBody0() as Ammo.btRigidBody;
      const body1: Ammo.btRigidBody = contactManifold.getBody1() as Ammo.btRigidBody;

      // wheel bodies have their userIndex set from 100 upwards
      let userIndex = 0;
      if (body0.getUserIndex() > 0) {
        userIndex = body0.getUserIndex();
      } else if (body1.getUserIndex() > 0) {
        userIndex = body1.getUserIndex();
      }
      if (userIndex > 0) {
        const numContacts = contactManifold.getNumContacts();
        for (let j = 0; j < numContacts; j += 1) {
          const contactPoint = contactManifold.getContactPoint(j);
          const distance = contactPoint.getDistance();
          if (distance <= 0.2) {
            const impulse = contactPoint.getAppliedImpulse();
            if (impulse > 0.1) {
              this.store.commit(MutationType.PlaySound, {
                type: MIDIMessageType.NOTE_ON,
                channel: 1,
                data0: 60 + (userIndex - 100),
                data1: Math.min(127, Math.floor(impulse * 127)),
              });
            }
          }
        }
      }
    }
  }

  /**
   * Create the physics and 3D world population.
   */
  private populate(scene: Scene, physicsWorld: Ammo.btDiscreteDynamicsWorld) {
    const fix = createBox(scene, physicsWorld, new BoxConfiguration({
      w: 0.1, h: 0.1, d: 0.1, pz: 4.5, m: 0, c: 0x224400,
    }));
    this.meshes.push(fix);

    const { wheels } = this.store.state;
    wheels.forEach((wheelData, index) => {
      const positionZ = 3.5 - index;
      const wheel = new Bumpwheel(scene, physicsWorld, index, positionZ, fix.userData.physicsBody);
      this.wheels.push(wheel);
      this.meshes = [...this.meshes, ...wheel.getMeshes()];
    });
  }

  /**
   * Update after each step, received from webgl.draw()
   */
  update(): void {
    super.update();
    this.detectCollision();
    this.wheels.forEach((wheel) => wheel.update());
  }
}
