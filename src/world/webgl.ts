import Ammo from 'ammojs-typed';
import {
  AxesHelper,
  Clock,
  Color,
  DirectionalLight,
  GridHelper,
  HemisphereLight,
  PCFShadowMap,
  PerspectiveCamera,
  Raycaster,
  Scene,
  WebGLRenderer,
  Vector3,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { step } from './physics';
import addWindowResizeCallback from '../utils/windowresize';
import TestPopulation from './test-population';
import PopulationInterface from './population-interface';

let renderer: WebGLRenderer;
let clock: Clock;
let raycaster: Raycaster;
let intersection: Vector3;
let scene: Scene;
let camera: PerspectiveCamera;
let orbitControls: OrbitControls;
let canvasRect: DOMRect;
let population: PopulationInterface;

/**
 * Update the physics world and render the results in 3D.
 */
function draw() {
  const deltaTime = clock.getDelta();
  step(deltaTime);
  population.update();
  renderer.render(scene, camera);
  requestAnimationFrame(draw);
}

/**
 * Window resize event handler.
 */
function onWindowResize() {
  canvasRect = renderer.domElement.getBoundingClientRect();
  renderer.setSize(window.innerWidth, window.innerHeight - canvasRect.top);
  camera.aspect = window.innerWidth / (window.innerHeight - canvasRect.top);
  camera.updateProjectionMatrix();
  canvasRect = renderer.domElement.getBoundingClientRect();

  // move camera further back when viewport height increases so objects stay the same size
  const scale = 0.01; // 0.15;
  const fieldOfView = camera.fov * (Math.PI / 180); // convert fov to radians
  const targetZ = canvasRect.height / (2 * Math.tan(fieldOfView / 2));
  camera.position.set(camera.position.x, camera.position.y, targetZ * scale);

  // orbitControls.saveState();

  // new viewport size in 3D units at a given distance from the camera.
  // @see https://stackoverflow.com/questions/13350875/three-js-width-of-view/13351534#13351534
  // const dist = camera.position.z;
  // const vFOV = MathUtils.degToRad(camera.fov); // convert vertical fov to radians
  // const visibleHeight = 2 * Math.tan(vFOV / 2) * dist;
  // const visibleWidth = visibleHeight * camera.aspect;
}

/**
 * Create the 3D scene, lights, cameras.
 */
function setupWebGLWorld(rootEl: HTMLDivElement) {
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setClearColor(0xbfd1e5);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap; // PCFSoftShadowMap
  rootEl.appendChild(renderer.domElement);

  clock = new Clock();

  raycaster = new Raycaster();

  intersection = new Vector3();

  scene = new Scene();
  scene.background = new Color(0xbfd1e5);

  camera = new PerspectiveCamera(45, 1, 1, 500);
  camera.name = 'camera';
  camera.lookAt(new Vector3(0, 0, 0));
  scene.add(camera);

  // AMBIENT LIGHT
  // const ambientLight = new AmbientLight(0xffffff);
  // scene.add(ambientLight);

  // HEMI LIGHT
  const hemiLight = new HemisphereLight(0xffffff, 0xffffff, 0.1);
  hemiLight.color.setHSL(0.6, 0.6, 0.6);
  hemiLight.groundColor.setHSL(0.1, 1, 0.4);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  // DIRECTIONAL LIGHT
  const SHADOW_SIZE = 50;
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

  // GRID
  const grid = new GridHelper(5, 5);
  grid.position.set(0, 0, 0);
  scene.add(grid);

  // AXES
  const axesHelper = new AxesHelper(10);
  scene.add(axesHelper);
}

/**
 * General setup of the module.
 */
export default function setup(
  rootEl: HTMLDivElement,
  physicsWorld: Ammo.btDiscreteDynamicsWorld,
): void {
  setupWebGLWorld(rootEl);
  population = new TestPopulation(scene, physicsWorld);
  addWindowResizeCallback(onWindowResize);
  onWindowResize();
  draw();
}
