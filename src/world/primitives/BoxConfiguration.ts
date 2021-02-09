import PrimitiveConfiguration from './PrimitiveConfiguration';

export default class BoxConfiguration extends PrimitiveConfiguration {
  constructor({
    m = 1, px = 0, py = 0, pz = 0, qx = 0, qy = 0, qz = 0, qw = 1, d = 1, h = 1, w = 1,
  }) {
    super({
      m, px, py, pz, qx, qy, qz, qw,
    });
    this.size = { d, h, w };
  }

  size = {
    d: 1,
    h: 1,
    w: 1,
  };
}
