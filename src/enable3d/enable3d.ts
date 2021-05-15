import {
  Project, Scene3D, PhysicsLoader, THREE,
} from 'enable3d';
import { renderBackground, resizeBackground, setupBackground } from './background';

const FOV = 45;
const PLANE_ASPECT_RATIO = 16 / 9;

let rootEl: HTMLDivElement;
let isResize: boolean;

class MainScene extends Scene3D {
  private cam!: THREE.PerspectiveCamera;

  private orbitControls?: THREE.OrbitControls;

  constructor() {
    super({ key: 'MainScene' });
  }

  async init() {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(rootEl.offsetWidth, rootEl.offsetHeight, true);
    this.renderer.setClearColor(0xbbddff);
    this.renderer.autoClear = false;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap; // PCFSoftShadowMap
    rootEl.appendChild(this.renderer.domElement);
  }

  async create() {
    if (this.physics.debug) {
      // this.physics.debug.enable();
    }

    // CAMERA
    this.cam = this.camera as THREE.PerspectiveCamera;
    this.cam.position.set(-2, 2.5, 6);
    this.cam.lookAt(new THREE.Vector3(0, 2, 0));

    // HEMI LIGHT
    const hemiLight = new THREE.HemisphereLight();
    hemiLight.color.setHSL(0.6, 0.6, 0.6);
    hemiLight.groundColor.setHSL(0.1, 1, 0.4);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);

    // DIRECTIONAL LIGHT
    const SHADOW_SIZE = 10;
    const SHADOW_FAR = 13500;
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1.75, 1);
    directionalLight.position.multiplyScalar(100);
    directionalLight.color.setHSL(0.1, 1, 0.95);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -SHADOW_SIZE;
    directionalLight.shadow.camera.right = SHADOW_SIZE;
    directionalLight.shadow.camera.top = SHADOW_SIZE;
    directionalLight.shadow.camera.bottom = -SHADOW_SIZE;
    directionalLight.shadow.camera.far = SHADOW_FAR;
    this.scene.add(directionalLight);

    setupBackground('video/wouter_hisschemoller_-_matthaikirchplatz_clouds_-_2020_1920x1080.mp4');
    // setupBackground('video/berlijn-mathaïkirchplatz-2017-09-19-img_6786.mov');
    // setupBackground('video/30_seconds_of_frame_counter.mp4');

    this.physics.add.box({
      x: 0, y: -0.05, z: 0, mass: 0, width: 0.1, height: 0.1, depth: 0.1,
    }, { lambert: { color: 'blue' } });
  }

  update() {
    if (isResize) {
      isResize = false;
      this.onCanvasResize();
      resizeBackground(rootEl.offsetWidth, rootEl.offsetHeight);
    }
    renderBackground(this.renderer);
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
