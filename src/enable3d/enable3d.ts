import {
  ExtendedObject3D, Project, Scene3D, PhysicsLoader,
} from 'enable3d';

let rootEl: HTMLDivElement;

class MainScene extends Scene3D {
  private fix!: ExtendedObject3D;

  private flags: ExtendedObject3D[] = [];

  constructor() {
    super({ key: 'MainScene' });
  }

  async init() {
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(rootEl.offsetWidth, rootEl.offsetHeight, true);
    rootEl.appendChild(this.renderer.domElement);
  }

  // async preload() {
  //   // preload your assets here
  // }

  async create() {
    // set up scene (light, ground, grid, sky, orbitControls)
    this.warpSpeed();

    // enable physics debug
    // if (this.physics.debug) {
    //   this.physics.debug.enable();
    // }

    this.camera.position.set(10, 10, 20);

    this.fix = this.physics.add.box({
      x: 0, y: -0.05, z: 0, mass: 0, width: 0.1, height: 0.1, depth: 0.1,
    }, { lambert: { color: 'blue' } });

    this.flags.push(this.createFlag(0, 0));
    this.flags.push(this.createFlag(-2, 1));
    this.flags.push(this.createFlag(1, 2));
    this.flags.push(this.createFlag(1, -1));
  }

  createFlag(x: number, z: number) {
    const pole = this.add.cylinder({
      height: 4, radiusBottom: 0.05, radiusTop: 0.05, x, y: 2, z, mass: 0.1,
    }, { lambert: { color: 'white' } });

    const flag = this.add.box({
      depth: 0.1, x: 0.55, y: 1.5,
    }, { lambert: { color: 'red' } });

    pole.add(flag);
    this.physics.add.existing(pole);

    this.physics.add.constraints.hinge(this.fix.body, pole.body, {
      pivotA: { x, y: 0.05, z },
      pivotB: { y: -2 },
      axisA: { y: 1 },
      axisB: { y: 1 },
    });
    pole.body.ammo.setDamping(0.99, 0.99);
    return pole;
  }

  update() {
    this.flags.forEach((flag) => flag.body.applyTorque(0, 0.5, 0));
  }
}

/**
 * General setup of the module.
 */
export default function setup(
  rootElm: HTMLDivElement,
): void {
  rootEl = rootElm;
  // set your project configs
  const config = { scenes: [MainScene] };
  // load the ammo.js file from the /lib folder and start the project
  PhysicsLoader('/lib/kripken', () => new Project(config));
}
