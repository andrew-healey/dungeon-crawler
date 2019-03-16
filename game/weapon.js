import {
    Entity
} from "./entity.js";
import * as THREE from 'three';

//TODO:
/*
    - Draw Bullet
    - Draw Melee
    - Draw Ranged
*/

export class Weapon {
    constructor(scene, name, damage, rate) {
        this.scene = scene;
        this.name = name;
        this.type = "weapon";

        // this.mount(player);

        this.damage = damage;
        this.rate = rate;

        this.enabled = true;
        this.triggerListener = () => console.log('triggering');
        this.player = null;

        // this.triggerCB = null;
        this.triggering = false;

        this.modifiers = [];
    }

    mount(player) {
        this.player = player;
        this.room = player.room;
    }

    unmount() {
        this.room = null;
        this.player = null;
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

    update(dt) {
        if (this.triggering) this.trigger();
    }
}
let count = 0;
export class Bullet extends Entity {
    constructor(scene, gun, pos, angle, speed = 1, size = 1) {
        super(scene, pos, angle, size, speed);
        this.gun = gun;
        this.id = count++;
        this.room = this.gun.room;
    }
    initGeometry() {
        this.bullet = new THREE.Mesh(new THREE.BoxGeometry(this.size, this.size, this.size), new THREE.MeshBasicMaterial({
            color: 0x8800000
        }));
        this.bullet.position.x = this.pos.x;
        this.bullet.position.z = this.pos.z;
        return this.bullet;
    }

    update(dt) {
        this.updateByDirection(dt);

        if (this.vel.x === 0 && this.vel.y === 0) this.room.deleteBullet(this);
        if (this.room) {
            if (this.pos.x > this.room.pos.x + this.room.size.width - 3) this.room.deleteBullet(this);
            if (this.pos.z > this.room.pos.z + this.room.size.depth - 3) this.room.deleteBullet(this);
            if (this.pos.x < this.room.pos.x + 3) this.room.deleteBullet(this);
            if (this.pos.z < this.room.pos.z + 3) this.room.deleteBullet(this);
        }

        this.bullet.position.x = this.pos.x;
        this.bullet.position.z = this.pos.z;
    }
}

export class RangedWeapon extends Weapon {
    constructor(scene, name, damage, rate = 1, bulletSize = 0.5, bulletSpeed = 10) {
        super(scene, name, damage, rate);
        // this.speed = rate;
        this.bulletSize = bulletSize;
        this.bulletSpeed = bulletSpeed;
    }

    triggerCB() {
        this.triggerListener(
            "ranged",
            new Bullet(this.scene, this, Object.assign({}, this.player.pos), this.player.angle + Math.PI / 2, this.bulletSpeed, this.bulletSize)
        );
    }
}

export class MeleeWeapon extends Weapon {
    constructor(name, {
        damage,
        range,
        radius,
        speed
    }) {
        super(name, damage);
        this.range = range;
        this.radius = radius;
    }

    triggerCB() {
        this.triggerListener("melee", this);
    }
}