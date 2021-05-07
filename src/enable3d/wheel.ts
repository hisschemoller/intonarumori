import {
  ExtendedObject3D, Scene3D,
} from 'enable3d';

export default function createWheel(scene: Scene3D): void {
  const color = 0xff9999;
  const radius = 0.02;
  const wheelRadius = 1;
  const mass = 1;

  const torus: ExtendedObject3D = scene.add.torus({
    y: 5, tubularSegments: 20, radius: wheelRadius, tube: radius, mass,
  }, { lambert: { color } });

  const pin = scene.add.cylinder({
    height: 0.5, radiusBottom: radius, radiusTop: radius, mass,
  }, { lambert: { color } });
  torus.add(pin);

  scene.physics.add.existing(torus);
}
