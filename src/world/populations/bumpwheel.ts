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

  private slider!: Ammo.btSliderConstraint

  private sliderBlockBody!: Ammo.btRigidBody;

  private index: number;

  constructor(
    scene: Scene,
    physicsWorld: Ammo.btDiscreteDynamicsWorld,
    index: number,
    positionZ: number,
    fixedBody: Ammo.btRigidBody,
  ) {
    this.store = useStore();
    this.index = index;
    this.create(scene, physicsWorld, positionZ, fixedBody);
    this.setupListener();
    this.setTorque(this.store.state.wheels[this.index].torqueControl);
    this.update();
  }

  /**
   * Create the physics and 3D world population.
   */
  private create(
    scene: Scene,
    physicsWorld: Ammo.btDiscreteDynamicsWorld,
    positionZ: number,
    fixedBody: Ammo.btRigidBody,
  ): void {
    // eslint-disable-next-line no-bitwise
    const color = 0x224400 + ((this.index * 10) << 8);

    const wheel = createCylinder(scene, physicsWorld, new CylinderConfiguration({
      h: 0.8, r: 1.5, m: 10, c: color,
    }));

    const bump = createBox(scene, physicsWorld, new BoxConfiguration({
      w: 0.4, h: 0.4, d: 1, pz: 1.5, c: color,
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
      fixedBody,
      compound.userData.physicsBody,
      new Ammo.btVector3(0, 0, positionZ - 4.5),
      new Ammo.btVector3(0, 0, 0),
      new Ammo.btVector3(0, 0, 1),
      new Ammo.btVector3(0, 1, 0),
      true,
    );
    // hinge1.enableAngularMotor(true, -1.5, 3);
    physicsWorld.addConstraint(hinge1, true);

    const sliderBlock = createBox(scene, physicsWorld, new BoxConfiguration({
      w: 0.2, h: 0.2, d: 0.2, py: 5, c: color,
    }));
    this.meshes.push(sliderBlock);
    this.sliderBlockBody = sliderBlock.userData.physicsBody;

    const localA = new Ammo.btTransform();
    const localB = new Ammo.btTransform();
    localA.setIdentity();
    localB.setIdentity();

    // slide along x-axis is default, so rotate 90 degrees around the z-axis to slide y-axis
    localA.getBasis().setEulerZYX(0, 0, Math.PI * 0.5);
    localB.getBasis().setEulerZYX(0, 0, Math.PI * 0.5);
    localA.setOrigin(new Ammo.btVector3(0, 4.1, positionZ - 4.5));
    localB.setOrigin(new Ammo.btVector3(0, 0, 0));
    this.slider = new Ammo.btSliderConstraint(
      fixedBody,
      sliderBlock.userData.physicsBody,
      localA,
      localB,
      true,
    );
    this.slider.setLowerLinLimit(0);
    this.slider.setUpperLinLimit(0.5);
    this.slider.setLowerAngLimit(0);
    this.slider.setUpperAngLimit(0);
    physicsWorld.addConstraint(this.slider, true);

    const q = new Quaternion().setFromEuler(new Euler(0, 0, Math.PI * -0.25));
    const tube = createCylinder(scene, physicsWorld, new CylinderConfiguration({
      h: 2, r: 0.18, m: 0.3, c: color, qx: q.x, qy: q.y, qz: q.z, qw: q.w,
    }));
    this.meshes.push(tube);

    const tubeHinge = new Ammo.btHingeConstraint(
      sliderBlock.userData.physicsBody,
      tube.userData.physicsBody,
      new Ammo.btVector3(0, -0.25, 0),
      new Ammo.btVector3(0, 1, 0),
      new Ammo.btVector3(0, 0, 1),
      new Ammo.btVector3(0, 0, 1),
      true,
    );
    tubeHinge.setLimit(0, 1, 1, 1);
    physicsWorld.addConstraint(tubeHinge, true);
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
      () => this.store.state.wheels[this.index].torqueControl,
    );
    watch(torqueControlRef, () => {
      this.setTorque(torqueControlRef.value);
    });

    const isEnabledRef = computed(
      () => this.store.state.wheels[this.index].hingeControl,
    );
    watch(isEnabledRef, () => {
      this.setEnabled(isEnabledRef.value === 127);
    });
  }

  private setEnabled(isEnabled: boolean): void {
    const limit = isEnabled ? 0 : 0.5;
    this.sliderBlockBody.activate();
    this.slider.setLowerLinLimit(limit);
    this.slider.setUpperLinLimit(limit);
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
