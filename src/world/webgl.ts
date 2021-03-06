import Ammo from 'ammojs-typed';
import {
  AxesHelper,
  Clock,
  Color,
  DirectionalLight,
  GridHelper,
  HemisphereLight,
  MathUtils,
  PCFShadowMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Vector3,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { step } from './physics';
import PopulationInterface from './population-interface';
import BumpersPopulation from './populations/bumpers-population';

const FOV = 45;
const PLANE_ASPECT_RATIO = 16 / 9;

let rootEl: HTMLDivElement;
let renderer: WebGLRenderer;
let clock: Clock;
let scene: Scene;
let camera: PerspectiveCamera;
let orbitControls: OrbitControls;
let population: PopulationInterface;
let isResize: boolean;

/**
 * Grid and axes helpers.
 */
function addHelpers() {
  const grid = new GridHelper(10, 10);
  grid.position.set(0, 0, 0);
  scene.add(grid);

  const axesHelper = new AxesHelper(10);
  scene.add(axesHelper);
}

/**
 * Root element resize event handler.
 * We have an actual width and a target width and want to move the camera back to cover the width.
 * https://discourse.threejs.org/t/keeping-an-object-scaled-based-on-the-bounds-of-the-canvas
 * -really-battling-to-explain-this-one/17574/9
 */
function onCanvasResize() {
  renderer.setSize(rootEl.offsetWidth, rootEl.offsetHeight, true);
  camera.aspect = rootEl.offsetWidth / rootEl.offsetHeight;

  if (camera.aspect > PLANE_ASPECT_RATIO) {
    // window large enough
    camera.fov = FOV;
  } else {
    // window too narrow
    const cameraHeight = Math.tan(MathUtils.degToRad(FOV / 2));
    const ratio = camera.aspect / PLANE_ASPECT_RATIO;
    const newCameraHeight = cameraHeight / ratio;
    camera.fov = MathUtils.radToDeg(Math.atan(newCameraHeight)) * 2;
  }
  camera.updateProjectionMatrix();

  if (orbitControls) {
    orbitControls.update();
  }
}

/**
 * Update the physics world and render the results in 3D.
 */
function draw() {
  if (isResize) {
    isResize = false;
    onCanvasResize();
  }
  const deltaTime = clock.getDelta();
  step(deltaTime);
  population.update();
  renderer.render(scene, camera);
  requestAnimationFrame(draw);
}

/**
 * Create the 3D scene, lights, cameras.
 */
function setupWebGLWorld() {
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setClearColor(0xbbddff);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap; // PCFSoftShadowMap
  rootEl.appendChild(renderer.domElement);

  clock = new Clock();

  scene = new Scene();
  scene.background = new Color(0xbbddff);

  camera = new PerspectiveCamera(FOV, 1, 1, 500);
  camera.name = 'camera';
  camera.position.set(-2, 2.5, 6);
  camera.lookAt(new Vector3(0, 2, 0));
  scene.add(camera);

  // AMBIENT LIGHT
  // const ambientLight = new AmbientLight(0xffffff);
  // scene.add(ambientLight);

  // HEMI LIGHT
  const hemiLight = new HemisphereLight();
  hemiLight.color.setHSL(0.6, 0.6, 0.6);
  hemiLight.groundColor.setHSL(0.1, 1, 0.4);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  // DIRECTIONAL LIGHT
  const SHADOW_SIZE = 10;
  const SHADOW_FAR = 13500;
  const directionalLight = new DirectionalLight(0xffffff, 1);
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
  scene.add(directionalLight);

  // ORBIT
  orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.update();
  orbitControls.saveState();
  orbitControls.enabled = true;
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
  physicsWorld: Ammo.btDiscreteDynamicsWorld,
): void {
  rootEl = rootElm;
  isResize = false;
  setupWebGLWorld();
  addHelpers();
  population = new BumpersPopulation(scene, physicsWorld);
  renderer.setClearColor(population.getBackgroundColor());
  scene.background = new Color(population.getBackgroundColor());
  setupResizeObserver();
  onCanvasResize();
  draw();
}
