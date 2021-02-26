/* eslint-disable new-cap */
import { computed, watch } from 'vue';
import { Store } from 'vuex';
import {
  Euler, Object3D, Quaternion, Scene,
} from 'three';
import Ammo from 'ammojs-typed';
import { useStore } from '../../store';
import { State } from '../../store/state';
import createBox from '../primitives/box';
import BoxConfiguration from '../primitives/BoxConfiguration';
import createCompoundShape from '../primitives/compound';
import createCylinder from '../primitives/cylinder';
import CylinderConfiguration from '../primitives/CylinderConfiguration';
import CompoundConfiguration from '../primitives/CompoundConfiguration';

export default class Bumpwheel {
  private store: Store<State>;

  private meshes: Object3D[] = [];

  private wheel!: Ammo.btRigidBody;

  private torque = new Ammo.btVector3(0, 0, 0);

  private index: number;

  private control: string;

  constructor(
    scene: Scene,
    physicsWorld: Ammo.btDiscreteDynamicsWorld,
    index: number,
    control: string,
    positionZ: number,
  ) {
    this.store = useStore();
    this.index = index;
    this.control = control;
    this.create(scene, physicsWorld, positionZ);
    this.setupListener();
    this.setTorque(this.store.state.wheels.byId[this.control].torqueControl);
    this.update();
  }

  /**
   * Create the physics and 3D world population.
   */
  private create(
    scene: Scene, physicsWorld: Ammo.btDiscreteDynamicsWorld, positionZ: number,
  ): void {
    // eslint-disable-next-line no-bitwise
    const color = 0x224400 + ((this.index * 10) << 8);
    const fix = createBox(scene, physicsWorld, new BoxConfiguration({
      w: 0.1, h: 0.1, d: 0.1, pz: positionZ - 0.3, m: 0, c: color,
    }));
    this.meshes.push(fix);

    const wheel = createCylinder(scene, physicsWorld, new CylinderConfiguration({
      h: 0.8, r: 1.5, m: 10, c: color,
    }));

    const bump = createBox(scene, physicsWorld, new BoxConfiguration({
      w: 1, h: 0.15, d: 1, pz: 1.5, c: color,
    }));

    const compound = createCompoundShape(scene, physicsWorld, new CompoundConfiguration(
      { pz: positionZ }, [wheel, bump],
    ));
    this.meshes.push(compound);
    this.wheel = compound.userData.physicsBody;
    this.wheel.setDamping(0.99, 0.99);
    this.wheel.setUserIndex(this.index + 100);
    this.wheel.setActivationState(4);

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

    const q = new Quaternion().setFromEuler(new Euler(0, 0, Math.PI * -0.25));
    const tube = createCylinder(scene, physicsWorld, new CylinderConfiguration({
      h: 2, r: 0.18, m: 0.3, c: color, qx: q.x, qy: q.y, qz: q.z, qw: q.w,
    }));
    this.meshes.push(tube);

    const stickHinge = new Ammo.btHingeConstraint(
      fix.userData.physicsBody,
      tube.userData.physicsBody,
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
    const torqueControlRef = computed(
      () => this.store.state.wheels.byId[this.control].torqueControl,
    );
    watch(torqueControlRef, () => {
      this.setTorque(torqueControlRef.value);
    });
  }

  private setTorque(torque: number): void {
    if (torque > 0) {
      this.torque.setZ(-1 + ((torque / 127) * -19));
    } else {
      this.torque.setZ(0);
    }
  }

  /**
   * Update after each step.
   */
  update(): void {
    this.wheel.applyTorque(this.torque);
  }
}
