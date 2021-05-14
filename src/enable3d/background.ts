import { THREE } from 'enable3d';

let texture: THREE.VideoTexture;
let video: HTMLVideoElement;
let videoCanvasCtx: CanvasRenderingContext2D;
let backgroundCamera: THREE.Camera;
let backgroundScene: THREE.Scene;

/**
 * @param {Object} renderer WebGL 3D renderer.
 */
export function renderBackground(renderer: THREE.WebGLRenderer) {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    // draw video to canvas starting from upper left corner
    videoCanvasCtx.drawImage(video, 0, 0);
    texture.needsUpdate = true;
  }
  renderer.render(backgroundScene, backgroundCamera);
}

/**
 * Setup.
 */
export function setupBackground(videoURL: string) {
  video = document.createElement('video');
  video.src = videoURL;
  video.load();
  video.play();

  const videoCanvas = document.createElement('canvas');
  videoCanvas.width = 640;
  videoCanvas.height = 480;

  // draw a black rectangle so that your plane doesn't start out transparent
  videoCanvasCtx = videoCanvas.getContext('2d');
  videoCanvasCtx.fillStyle = '#000000';
  videoCanvasCtx.fillRect(0, 0, 640, 480);

  texture = new THREE.VideoTexture(video);
  texture.needsUpdate = true;

  const material = new THREE.MeshBasicMaterial({ map: texture });
  const geometry = new THREE.PlaneBufferGeometry(2, 2, 0);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.material.depthTest = false;
  mesh.material.depthWrite = false;

  backgroundCamera = new THREE.Camera();
  backgroundScene = new THREE.Scene();
  backgroundScene.add(backgroundCamera);
  backgroundScene.add(mesh);
}
