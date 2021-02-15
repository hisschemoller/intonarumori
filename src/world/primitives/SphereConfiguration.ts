import PrimitiveConfiguration from './PrimitiveConfiguration';

export default class SphereConfiguration extends PrimitiveConfiguration {
  constructor({
    m = 1, px = 0, py = 0, pz = 0, qx = 0, qy = 0, qz = 0, qw = 1, r = 1,
  }) {
    super({
      m, px, py, pz, qx, qy, qz, qw,
    });
    this.radius = r;
  }

  radius: number;
}
