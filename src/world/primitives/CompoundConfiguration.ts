import { Object3D } from 'three';
import PrimitiveConfiguration from './PrimitiveConfiguration';

export default class CompoundConfiguration extends PrimitiveConfiguration {
  constructor({
    c = 0, m = 1, px = 0, py = 0, pz = 0, qx = 0, qy = 0, qz = 0, qw = 1,
  }, ch: Object3D[]) {
    super({
      c, m, px, py, pz, qx, qy, qz, qw,
    });
    this.children = ch;
  }

  children: Object3D[];
}
