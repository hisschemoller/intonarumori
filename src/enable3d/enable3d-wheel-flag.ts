import {
  ExtendedObject3D, Project, Scene3D, PhysicsLoader, THREE,
} from 'enable3d';
import createWheel from './wheel';
import createFlag from './flag';

const FOV = 45;
const PLANE_ASPECT_RATIO = 16 / 9;

let rootEl: HTMLDivElement;
let isResize: boolean;

class MainScene extends Scene3D {
  private cam!: THREE.PerspectiveCamera;

  private orbitControls!: THREE.OrbitControls;

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
    const warpSpeedContent = await this.warpSpeed();
    if (warpSpeedContent.orbitControls) {
      this.orbitControls = warpSpeedContent.orbitControls;
    }

    this.camera.position.set(2, 1, 4);

    this.cam = this.camera as THREE.PerspectiveCamera;

    if (this.physics.debug) {
      // this.physics.debug.enable();
    }

    this.fix = this.physics.add.box({
      x: 0, y: -0.05, z: 0, mass: 0, width: 0.1, height: 0.1, depth: 0.1,
    }, { lambert: { color: 'blue' } });

    this.wheel = createWheel(this, this.fix);

    createFlag(this, this.fix, 0.8, 1);
  }

  /**
   * Root element resize event handler.
   * We have an actual width and a target width and want to move the camera back to cover the width.
   * https://discourse.threejs.org/t/keeping-an-object-scaled-based-on-the-bounds-of-the-canvas
   * -really-battling-to-explain-this-one/17574/9
   */
  onCanvasResize() {
    this.renderer.setSize(rootEl.offsetWidth, rootEl.offsetHeight, true);
    this.cam.aspect = rootEl.offsetWidth / rootEl.offsetHeight;

    if (this.cam.aspect > PLANE_ASPECT_RATIO) {
      // window large enough
      this.cam.fov = FOV;
    } else {
      // window too narrow
      const cameraHeight = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
      const ratio = this.cam.aspect / PLANE_ASPECT_RATIO;
      const newCameraHeight = cameraHeight / ratio;
      this.cam.fov = THREE.MathUtils.radToDeg(Math.atan(newCameraHeight)) * 2;
    }
    this.cam.updateProjectionMatrix();

    if (this.orbitControls) {
      this.orbitControls.update();
    }
  }

  update() {
    if (isResize) {
      isResize = false;
      this.onCanvasResize();
    }
    this.wheel.body.applyTorque(0, -2.5, 0);
  }
}

function setupResizeObserver() {
  const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
    entries.forEach((entry: ResizeObserverEntry) => {
      if (entry.target === rootEl && (entry.contentBoxSize || entry.contentRect)) {
        isResize = true;
      }
    });
  });
  resizeObserver.observe(rootEl);
}

/**
 * General setup of the module.
 */
export default function setup(
  rootElm: HTMLDivElement,
): void {
  rootEl = rootElm;
  setupResizeObserver();
  PhysicsLoader('/lib/kripken', () => new Project({
    scenes: [MainScene],
  }));
}
