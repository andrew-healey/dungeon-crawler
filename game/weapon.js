import {
    Entity
} from "./entity.js";
import * as THREE from 'three';

export class Weapon {
    constructor(name, damage, rate) {
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

    setOwner(player) {
        this.player = player;
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
let count = 0;
export class Bullet extends Entity {
    constructor(gun, speed = 1, size = 1) {
        console.log(gun)
        super();
        this.gun = gun;
        this.id = count++;
        this.room = this.gun.room;
    }

    initGeometry() {
        this.bullet = new THREE.Mesh(new THREE.BoxGeometry(this.size, this.size, this.size), new THREE.MeshBasicMaterial({
            color: 0x8800000
        }));
        return this.bullet;
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
        console.log(this)
        this.triggerListener(
            "ranged",
            new Bullet(this, Object.assign({}, this.player.pos), this.player.angle + Math.PI / 2, this.bulletSpeed, this.bulletSize)
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