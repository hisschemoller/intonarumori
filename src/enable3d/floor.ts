import {
  Scene3D, THREE,
} from 'enable3d';

function createFloorBoard(scene3d: Scene3D, repeatX = 1, repeatY = 1, offsetX = 0, offsetY = 0,
  z = 0, width = 10, depth = 2, opacity = 1) {
  const texture = new THREE.TextureLoader().load('img/matthaikirchplatz/mkp-ground.jpg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.offset.set(offsetX, offsetY);
  scene3d.add.box({
    x: 0, y: -0.5, z, mass: 0, width, height: 1, depth,
  }, { phong: { map: texture, transparent: opacity < 1, opacity } });
}

/**
 * Setup floor.
 */
export default function setupFloor(scene3d: Scene3D) {
  createFloorBoard(scene3d, 1, 0.4, 0, 0, 8.2, 16, 2.9);
  createFloorBoard(scene3d, 1, 0.4, 0, 0.4, 5, 20, 2.9);
  createFloorBoard(scene3d, 1, 0.2, 0, 0.6, 1.8, 26, 2.9);
  createFloorBoard(scene3d, 1, 0.2, 0, 0.7, -2.2, 32, 4);
  createFloorBoard(scene3d, 0.7, 0.2, 0.2, 0.8, -8, 40, 6);
  createFloorBoard(scene3d, 0.6, 0.2, 0.3, 0.55, -15.5, 56, 7);
  createFloorBoard(scene3d, 0.6, 0.2, 0.3, 0.55, -30, 70, 18, 0.5);
}
