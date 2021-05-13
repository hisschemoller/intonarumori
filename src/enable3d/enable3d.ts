import {
  ExtendedObject3D, Project, Scene3D, PhysicsLoader,
} from 'enable3d';
import createWheel from './wheel';
import createFlag from './flag';

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

    this.wheel = createWheel(this, this.fix);

    createFlag(this, this.fix, 0.8, 1);
  }

  update() {
    this.wheel.body.applyTorque(0, -2.5, 0);
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
