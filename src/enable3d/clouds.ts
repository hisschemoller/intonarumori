/* eslint-disable no-param-reassign */
import {
  ExtendedObject3D, Scene3D, THREE,
} from 'enable3d';

let cloud0: THREE.Mesh;

export async function setupClouds(scene3d: Scene3D) {
  const texture = await scene3d.load.texture('img/matthaikirchplatz/sky.png');
  const gltf = await scene3d.load.gltf('3d/matthaikirchplatz.glb');
  cloud0 = gltf.scene.getObjectByName('cloud0') as THREE.Mesh;
  cloud0.position.set(0, 8, 0);
  cloud0.material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture });
  cloud0.castShadow = true;
  cloud0.receiveShadow = true;
  // const cloud = new ExtendedObject3D();
  // cloud.add(cloud0);
  scene3d.scene.add(cloud0);
  // scene3d.physics.add.existing(cloud);
}

export function updateClouds() {
  if (cloud0) {
    cloud0.rotation.x += 0.002;
  }
}
