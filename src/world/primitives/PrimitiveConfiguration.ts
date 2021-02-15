export default class PrimitiveConfiguration {
  constructor({
    m = 1, px = 0, py = 0, pz = 0, qx = 0, qy = 0, qz = 0, qw = 1,
  } = {}) {
    this.mass = m;
    this.position = { x: px, y: py, z: pz };
    this.quaternion = {
      x: qx, y: qy, z: qz, w: qw,
    };
  }

  mass: number;

  position = {
    x: 0,
    y: 0,
    z: 0,
  };

  quaternion = {
    x: 0,
    y: 0,
    z: 0,
    w: 1,
  };
}
