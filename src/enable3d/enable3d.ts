import {
  ExtendedObject3D, Project, Scene3D, PhysicsLoader,
} from 'enable3d';
import createWheel from './wheel';

let rootEl: HTMLDivElement;

class MainScene extends Scene3D {
  private fix!: ExtendedObject3D;

  private wheel!: ExtendedObject3D;

  constructor() {
    super({ key: 'MainScene' });
  }

  async init() {
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(rootEl.offsetWidth, rootEl.offsetHeight, true);
    rootEl.appendChild(this.renderer.domElement);
  }

  async create() {
    this.warpSpeed();
    this.camera.position.set(2, 1, 4);

    if (this.physics.debug) {
      // this.physics.debug.enable();
    }

    this.fix = this.physics.add.box({
      x: 0, y: -0.05, z: 0, mass: 0, width: 0.1, height: 0.1, depth: 0.1,
    }, { lambert: { color: 'blue' } });

    // simple sphere
    const sphere0 = this.add.sphere({ z: 2, mass: 1, radius: 0.2 });
    this.physics.add.existing(sphere0);

    this.wheel = createWheel(this, this.fix);
  }

  update() {
    this.wheel.body.applyTorque(0, -1.5, 0);
  }
}

/**
 * General setup of the module.
 */
export default function setup(
  rootElm: HTMLDivElement,
): void {
  rootEl = rootElm;
  PhysicsLoader('/lib/kripken', () => new Project({
    scenes: [MainScene],
  }));
}
