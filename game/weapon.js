import {
  Entity
} from "./entity.js";
import * as THREE from 'three';

export class Weapon extends BodyPart {
  constructor(coords, parent, name, damage, rate) {
    this.name = name;
    super(coords, 2, "weapon", parent, [], 1, "gun");
    // this.mount(player);

    this.damage = damage;
    this.rate = rate;

    this.enabled = true;
    this.triggerListener = () => console.log('triggering');
    //TODO Link this with Body events...
    this.parent.addChild(parent);

    this.modifiers = [];
  }

  setOwner(body) {
    this.body = body;
  }

  onTrigger(cb) {
    this.triggerListener = cb;
  }

  trigger() {
    if (this.enabled && this.player) {
      this.triggerCB && this.triggerCB();
      this.enabled = false;
      setTimeout(() => {
        this.enabled = true;
      }, this.rate);
    }
  }

}
export class Bullet extends Entity {
  constructor(gun, pos, angle, size = 1, speed = 1, damage = gun.damage) {
    super(pos, angle, size, speed);
    this.gun = gun;
    this.room = this.gun.room;
    this.damage = damage;
  }

  initGeometry() {
    this.geom = new THREE.Mesh(new THREE.BoxGeometry(this.size, this.size, this.size), new THREE.MeshBasicMaterial({
      color: 0x8800000
    }));
    return this.geom;
  }

  update(dt) {
    this.updateByDirection(dt);
    this.updateMeshPosition();
  }
}

export class RangedWeapon extends Weapon {
  constructor(name, damage = 1, rate = 1, bulletSize = 0.5, bulletSpeed = 10) {
    super(name, damage, rate);
    this.bulletSize = bulletSize;
    this.bulletSpeed = bulletSpeed;
  }

  triggerCB() {
    this.triggerListener(
      "ranged",
      new Bullet(this, Object.assign({}, this.player.pos), this.player.angle + Math.PI / 2, this.bulletSize, this.bulletSpeed, this.damage)
    );
  }
}

export class MeleeWeapon extends Weapon {
  constructor(name, damage, range, radius, rate) {
    super(name, damage, rate);
    this.range = range;
    this.radius = radius;
  }

  triggerCB() {
    this.triggerListener("melee", this);
  }
}
