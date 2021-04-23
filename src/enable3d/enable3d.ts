import {
  ExtendedObject3D, Project, Scene3D, PhysicsLoader,
} from 'enable3d';

let rootEl: HTMLDivElement;

class MainScene extends Scene3D {
  box!: ExtendedObject3D;

  constructor() {
    super({ key: 'MainScene' });
  }

  async init() {
    console.log('init');
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(rootEl.offsetWidth, rootEl.offsetHeight, true);
    rootEl.appendChild(this.renderer.domElement);
  }

  // async preload() {
  //   // preload your assets here
  // }

  async create() {
    console.log('create');

    // set up scene (light, ground, grid, sky, orbitControls)
    this.warpSpeed();

    // enable physics debug
    if (this.physics.debug) {
      this.physics.debug.enable();
    }

    // position camera
    this.camera.position.set(10, 10, 20);

    // blue box (without physics)
    this.box = this.add.box({ y: 2 }, { lambert: { color: 'deepskyblue' } });

    // pink box (with physics)
    this.physics.add.box({ y: 10 }, { lambert: { color: 'hotpink' } });
  }

  update() {
    this.box.rotation.x += 0.01;
    this.box.rotation.y += 0.01;
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
