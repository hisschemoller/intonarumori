import {
  THREE,
} from 'enable3d';

// found at
// https://discourse.threejs.org/t/
// functions-to-calculate-the-visible-width-height-at-a-given-z-depth-from-a-perspective-camera/269

export function getVisibleHeightAtZDepth(distance: number, camera: THREE.PerspectiveCamera) {
  // compensate for cameras not positioned at z=0
  const cameraOffset = camera.position.z;
  const depth = distance < cameraOffset ? distance - cameraOffset : distance + cameraOffset;

  // vertical fov in radians
  const vFOV = (camera.fov * Math.PI) / 180;

  // Math.abs to ensure the result is always positive
  return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
}

export function getVisibleWidthAtZDepth(depth: number, camera: THREE.PerspectiveCamera) {
  const height = getVisibleHeightAtZDepth(depth, camera);
  return height * camera.aspect;
}
