/* eslint-disable new-cap */
import Ammo from 'ammojs-typed';
import { Object3D } from 'three';

export default class Population {
  protected meshes: Object3D[] = [];

  private tmpTrans: Ammo.btTransform;

  constructor() {
    this.tmpTrans = new Ammo.btTransform();
  }

  // eslint-disable-next-line class-methods-use-this
  update(): void {
    this.meshes.forEach((mesh: Object3D) => {
      const body = mesh.userData.physicsBody;
      const motionState = body.getMotionState();
      if (motionState) {
        motionState.getWorldTransform(this.tmpTrans);
        const p = this.tmpTrans.getOrigin();
        const q = this.tmpTrans.getRotation();
        mesh.position.set(p.x(), p.y(), p.z());
        mesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
      }
    });
  }
}
