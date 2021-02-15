import { Object3D } from 'three';
import PrimitiveConfiguration from './PrimitiveConfiguration';

export default class CompoundConfiguration extends PrimitiveConfiguration {
  constructor({
    m = 1, px = 0, py = 0, pz = 0, qx = 0, qy = 0, qz = 0, qw = 1,
  }, c: Object3D[]) {
    super({
      m, px, py, pz, qx, qy, qz, qw,
    });
    this.children = c;
  }

  children: Object3D[];
}
