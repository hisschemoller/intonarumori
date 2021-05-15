import { THREE } from 'enable3d';

const VIDEO_ASPECT = 16 / 9;

let backgroundCamera: THREE.Camera;
let backgroundScene: THREE.Scene;
let mesh: THREE.Mesh;
let texture: THREE.Texture;
let video: HTMLVideoElement;

/**
 * Render background.
 */
export function renderBackground(renderer: THREE.WebGLRenderer) {
  renderer.render(backgroundScene, backgroundCamera);
}

/**
 * Resize background.
 */
export function resizeBackground(width: number, height: number) {
  mesh.scale.set((height / width) * VIDEO_ASPECT, 1, 1);
}

/**
 * Setup background.
 */
export function setupBackground(videoURL: string) {
  video = document.createElement('video');
  video.src = videoURL;
  video.loop = true;
  video.load();
  video.play();

  texture = new THREE.VideoTexture(video);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const geometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  material.depthTest = false;
  material.depthWrite = false;
  mesh = new THREE.Mesh(geometry, material);

  backgroundCamera = new THREE.Camera();
  backgroundScene = new THREE.Scene();
  backgroundScene.add(backgroundCamera);
  backgroundScene.add(mesh);
}
