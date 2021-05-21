/* eslint-disable no-param-reassign */
import {
  Scene3D, THREE,
} from 'enable3d';
import { getVisibleWidthAtZDepth } from './helpers';

const NUM_CLOUDS = 5;
const clouds: {
  // eslint-disable-next-line @typescript-eslint/member-delimiter-style
  mesh: THREE.Mesh, isActive: boolean, endX: number, speed: number, rotation: number }[] = [];

let camera: THREE.PerspectiveCamera;
let cloudIndex = 0;

function addCloud(scene3d: Scene3D, startX = 0, startZ = 0) {
  const z = startZ !== 0 ? 0 : 4 - (Math.random() * 20);
  const width = getVisibleWidthAtZDepth(z, camera);
  const cloud = clouds[cloudIndex];
  cloud.isActive = true;
  cloud.speed = 0.0015 + (Math.random() * 0.002);
  cloud.rotation = 0.001 + (Math.random() * 0.001);
  cloud.endX = (width * 0.5) + 4;
  const x = startX !== 0 ? startX : (width * -0.5) - 3;
  const y = 8 + (Math.random() * 5);
  cloud.mesh.position.set(x, y, z);
  scene3d.scene.add(cloud.mesh);

  cloudIndex = (cloudIndex + 1) % NUM_CLOUDS;
}

async function createCloud(scene3d: Scene3D, gltf: THREE.GLTF, index: number) {
  const texture = await scene3d.load.texture('img/matthaikirchplatz/sky.png');
  const cloud = gltf.scene.getObjectByName(`cloud${index}`) as THREE.Mesh;
  cloud.position.set(0, 8, 0);
  cloud.material = new THREE.MeshPhongMaterial({
    color: 0xffffff, map: texture, transparent: true, opacity: 0.7,
  });
  cloud.castShadow = true;
  cloud.receiveShadow = true;
  clouds.push({
    mesh: cloud, isActive: false, endX: 0, speed: 0, rotation: 0,
  });
}

export async function setupClouds(scene3d: Scene3D, cam: THREE.PerspectiveCamera) {
  camera = cam;
  const gltf = await scene3d.load.gltf('3d/matthaikirchplatz.glb');
  await Promise.all(Array(NUM_CLOUDS).fill(0).map((value, index) => (
    createCloud(scene3d, gltf, index)
  )));

  const z = 4 - (Math.random() * 10);
  const width = getVisibleWidthAtZDepth(z, camera);
  addCloud(scene3d, width * -0.25, z);
  addCloud(scene3d, width * 0.01, z);
  addCloud(scene3d, width * 0.25, z);
  addCloud(scene3d);
}

export function updateClouds(scene3d: Scene3D) {
  clouds.forEach((cloud) => {
    if (cloud.isActive) {
      cloud.mesh.position.x += cloud.speed;
      cloud.mesh.rotation.x += cloud.rotation;
      if (cloud.mesh.position.x > cloud.endX) {
        scene3d.scene.remove(cloud.mesh);
        cloud.isActive = false;
        addCloud(scene3d);
      }
    }
  });
}
