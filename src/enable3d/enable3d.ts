import {
  ExtendedObject3D, Project, Scene3D, PhysicsLoader, THREE,
} from 'enable3d';
import { renderBackground, resizeBackground, setupBackground } from './background';
import { setupClouds, updateClouds } from './clouds';

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
    this.cam.position.set(0, 2, 16);
    this.cam.lookAt(new THREE.Vector3(0, 4.2, 0));

    // HEMI LIGHT
    const hemiLight = new THREE.HemisphereLight();
    hemiLight.color.setHSL(0.55, 0.1, 0.3);
    hemiLight.groundColor.setHSL(0.1, 0.1, 0.3);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);

    // DIRECTIONAL LIGHT
    const SHADOW_SIZE = 10;
    const SHADOW_FAR = 13500;
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 17.5, 10);
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

    // setupBackground(
    // 'video/wouter_hisschemoller_-_matthaikirchplatz_clouds_-_2020_1920x1080.mp4');
    // setupBackground('video/30_seconds_of_frame_counter.mp4');
    setupBackground('video/matthaikirchplatz/berlijn-mathaïkirchplatz-2017-09-19-img_6786.mp4');
    setupClouds(this);

    this.add.box({
      x: 0, y: 0.5, z: 3, mass: 0, width: 1, height: 1, depth: 1,
    }, { phong: { color: 0x996600 } });

    const texture = new THREE.TextureLoader().load('img/matthaikirchplatz/mkp-ground.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 0.4);
    this.add.box({
      x: 0, y: -0.5, z: 8.2, mass: 0, width: 16, height: 1, depth: 2.9,
    }, { phong: { map: texture } });

    const texture1 = new THREE.TextureLoader().load('img/matthaikirchplatz/mkp-ground.jpg');
    texture1.wrapS = THREE.RepeatWrapping;
    texture1.wrapT = THREE.RepeatWrapping;
    texture1.repeat.set(1, 0.4);
    texture1.offset.set(0, 0.4);
    this.add.box({
      x: 0, y: -0.5, z: 5, mass: 0, width: 20, height: 1, depth: 2.9,
    }, { phong: { map: texture1 } });

    const texture2 = new THREE.TextureLoader().load('img/matthaikirchplatz/mkp-ground.jpg');
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    texture2.repeat.set(1, 0.2);
    texture2.offset.set(0, 0.6);
    this.add.box({
      x: 0, y: -0.5, z: 1.8, mass: 0, width: 26, height: 1, depth: 2.9,
    }, { phong: { map: texture2 } });

    const texture3 = new THREE.TextureLoader().load('img/matthaikirchplatz/mkp-ground.jpg');
    texture3.wrapS = THREE.RepeatWrapping;
    texture3.wrapT = THREE.RepeatWrapping;
    texture3.repeat.set(1, 0.2);
    texture3.offset.set(0, 0.7);
    this.add.box({
      x: 0, y: -0.5, z: -2.2, mass: 0, width: 32, height: 1, depth: 4,
    }, { phong: { map: texture3 } });

    const texture4 = new THREE.TextureLoader().load('img/matthaikirchplatz/mkp-ground.jpg');
    texture4.wrapS = THREE.RepeatWrapping;
    texture4.wrapT = THREE.RepeatWrapping;
    texture4.repeat.set(0.7, 0.2);
    texture4.offset.set(0.2, 0.8);
    this.add.box({
      x: 0, y: -0.5, z: -8, mass: 0, width: 40, height: 1, depth: 6,
    }, { phong: { map: texture4 } });

    const texture5 = new THREE.TextureLoader().load('img/matthaikirchplatz/mkp-ground.jpg');
    texture5.wrapS = THREE.RepeatWrapping;
    texture5.wrapT = THREE.RepeatWrapping;
    texture5.repeat.set(0.6, 0.2);
    texture5.offset.set(0.3, 0.55);
    this.add.box({
      x: 0, y: -0.5, z: -15.5, mass: 0, width: 56, height: 1, depth: 7,
    }, { phong: { map: texture5 } });

    const texture6 = new THREE.TextureLoader().load('img/matthaikirchplatz/mkp-ground.jpg');
    texture6.wrapS = THREE.RepeatWrapping;
    texture6.wrapT = THREE.RepeatWrapping;
    texture6.repeat.set(0.6, 0.2);
    texture6.offset.set(0.2, 0.55);
    this.add.box({
      x: 0, y: -0.5, z: -30, mass: 0, width: 70, height: 1, depth: 18,
    }, { phong: { map: texture6, transparent: true, opacity: 0.5 } });
  }

  update() {
    if (isResize) {
      isResize = false;
      this.onCanvasResize();
      resizeBackground(rootEl.offsetWidth, rootEl.offsetHeight);
    }
    renderBackground(this.renderer);
    updateClouds();
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

    // if (this.cam.aspect > PLANE_ASPECT_RATIO) {
    //   // window large enough
    //   this.cam.fov = FOV;
    // } else {
    //   // window too narrow
    //   const cameraHeight = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    //   const ratio = this.cam.aspect / PLANE_ASPECT_RATIO;
    //   const newCameraHeight = cameraHeight / ratio;
    //   this.cam.fov = THREE.MathUtils.radToDeg(Math.atan(newCameraHeight)) * 2;
    // }
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
