import PrimitiveConfiguration from './PrimitiveConfiguration';

export default class CylinderConfiguration extends PrimitiveConfiguration {
  constructor({
    c = 0, m = 1, px = 0, py = 0, pz = 0, qx = 0, qy = 0, qz = 0, qw = 1, h = 1, r = 1,
  }) {
    super({
      c, m, px, py, pz, qx, qy, qz, qw,
    });
    this.height = h;
    this.radius = r;
  }

  height: number;

  radius: number;
}
