import {
  ExtendedObject3D, Project, Scene3D, PhysicsLoader,
} from 'enable3d';

let rootEl: HTMLDivElement;

class MainScene extends Scene3D {
  private box!: ExtendedObject3D;

  private pole!: ExtendedObject3D;

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

    // position camera
    this.camera.position.set(10, 10, 20);

    // blue box (without physics)
    // this.box = this.add.box({ y: 2 }, { lambert: { color: 'deepskyblue' } });

    // pink box (with physics)
    // this.physics.add.box({ y: 10 }, { lambert: { color: 'hotpink' } });
    // this.physics.add.cylinder({ x: 0.1, y: 15 }, { lambert: { color: 'blue' } });

    // const hinge = (x) => {

    //   this.physics.add.constraints.hinge(box1.body, box2.body, {
    //     pivotA: { y: -0.65 },
    //     pivotB: { y: 0.65 },
    //     axisA: { x: 1 },
    //     axisB: { x: 1 }
    //   })
    //   this.physics.add.constraints.hinge(box2.body, box3.body, {
    //     pivotA: { y: -0.65 },
    //     pivotB: { y: 0.65 },
    //     axisA: { x: 1 },
    //     axisB: { x: 1 }
    //   })
    // }

    const fix = this.physics.add.box({
      x: 0, y: 0.5, z: 0, mass: 0,
    }, { lambert: { color: 'blue' } });

    this.pole = this.add.cylinder({
      height: 4, radiusBottom: 0.05, radiusTop: 0.05, y: 3, mass: 0.1,
    }, { lambert: { color: 'white' } });

    const flag = this.add.box({
      depth: 0.1, x: 0.55, y: 1.5,
    }, { lambert: { color: 'red' } });

    this.pole.add(flag);
    this.physics.add.existing(this.pole);

    this.physics.add.constraints.hinge(fix.body, this.pole.body, {
      pivotA: { x: 0, y: 0.5, z: 0 },
      pivotB: { x: 0, y: -2, z: 0 },
      axisA: { y: 1 },
      axisB: { y: 1 },
    });
    // this.pole.body.setFriction(0.95);
    this.pole.body.ammo.setDamping(0.99, 0.99);
  }

  update() {
    this.pole.body.applyTorque(0, -0.5, 0);
  }
}

/**
 * General setup of the module.
 */
export default function setup(
  rootElm: HTMLDivElement,
): void {
  rootEl = rootElm;
  console.log('setup');
  // set your project configs
  const config = { scenes: [MainScene] };
  // load the ammo.js file from the /lib folder and start the project
  PhysicsLoader('/lib/kripken', () => new Project(config));
}
