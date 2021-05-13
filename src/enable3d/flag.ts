import {
  ExtendedObject3D, Scene3D,
} from 'enable3d';

export default function createFlag(
  scene: Scene3D, fix: ExtendedObject3D, x = 0, y = 0, z = 0,
): ExtendedObject3D {
  const color = 0xffcc99;
  const radius = 0.02;
  const mass = 1;
  const height = 1;
  const spokeLength = 0.4;
  const numSpokes = 3;

  const pole = scene.add.cylinder({
    height, radiusBottom: radius, radiusTop: radius, x, y, z, mass,
  }, { lambert: { color } });

  const flag = scene.add.box({
    x: 0.15 + radius, y: (height * 0.5) - 0.15, depth: radius * 1.1, height: 0.3, width: 0.3,
  }, { lambert: { color: 'red' } });
  pole.add(flag);

  for (let i = 0; i < numSpokes; i += 1) {
    const a = i / numSpokes;
    const spoke = scene.add.cylinder({
      height: spokeLength,
      radiusBottom: radius,
      radiusTop: radius,
      mass,
      x: Math.sin(a * Math.PI * 2) * spokeLength * 0.5,
      y: height * -0.5,
      z: Math.cos(a * Math.PI * 2) * spokeLength * 0.5,
    }, { lambert: { color: i === 0 ? 'red' : color } });
    // spoke.
    spoke.rotation.z = Math.PI * 0.5;
    spoke.rotation.y = Math.PI * 1.2; // (a * Math.PI * 2);
    // spoke.rotation.x = -a * Math.PI;
    pole.add(spoke);
  }

  scene.physics.add.existing(pole);

  scene.physics.add.constraints.hinge(fix.body, pole.body, {
    pivotA: { x, y: 0.05, z },
    pivotB: { y: -y },
    axisA: { y: 1 },
    axisB: { y: 1 },
  });
  pole.body.ammo.setDamping(0.99, 0.1);

  return pole;
}
