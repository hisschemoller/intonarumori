import {
  ExtendedObject3D, Scene3D,
} from 'enable3d';

export default function createWheel(scene: Scene3D, fix: ExtendedObject3D): ExtendedObject3D {
  const color = 0xff9999;
  const radius = 0.02;
  const wheelRadius = 1;
  const mass = 1;
  const wheelY = 0.25;

  // wheel
  const torus: ExtendedObject3D = scene.add.torus({
    y: wheelY, tubularSegments: 40, radius: wheelRadius, tube: radius, mass,
  }, { lambert: { color } });
  torus.rotation.x = Math.PI * 0.5;

  // pin
  const pin = scene.add.cylinder({
    x: wheelRadius, z: -0.25, height: 0.5, radiusBottom: radius, radiusTop: radius, mass,
  }, { lambert: { color } });
  pin.rotation.x = Math.PI * 0.5;
  torus.add(pin);

  scene.physics.add.existing(torus);

  // wheel hinge
  scene.physics.add.constraints.hinge(fix.body, torus.body, {
    pivotA: { y: 0.05 },
    pivotB: { z: wheelY },
    axisA: { y: 1 },
    axisB: { y: 0 },
  });
  torus.body.ammo.setDamping(0.99, 0.99);

  return torus;
}
