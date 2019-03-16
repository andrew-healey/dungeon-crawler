import {
    Entity
} from "./entity.js";

//TODO:
/*
    - Draw Bullet
    - Draw Melee
    - Draw Ranged

*/

export class Weapon {
    constructor(name, {
        damage,
        speed
    }) {
        this.name = name;
        this.type = "weapon";

        this.damage = damage;
        this.speed = speed;

        this.enabled = true;
        this.triggerListener = null;
        this.player = null;

        this.triggerCB = null;

        this.modifiers = [];
    }

    mount(player) {
        this.player = player;
    }

    unmount() {
        this.player = null;
    }

    onTrigger(cb) {
        this.triggerListener = cb;
    }

    trigger() {
        if (this.enabled && this.player) {
            this.triggerListener();
            this.enabled = false;
            setTimeout(() => {
                this.enabled = true;
            }, 1000 / this.speed);
        }
    }
}

export class Bullet extends Entity {
    constructor(gun, position, angle, {
        speed = 1,
        size = 1
    }) {
        super(position, angle, size);
        this.speed = speed;
        this.gun = gun;
    }

    update(dt) {
        this.moveForward(dt * this.speed);
    }

    onCollideWithWall() {

    }
}

export class RangedWeapon extends Weapon {
    constructor(name, {
        damage,
        speed = 1,
        bulletSize = 5,
        bulletSpeed = 1
    }) {
        super(name, damage);
        this.speed = speed;
        this.bulletSize = bulletSize;
        this.bulletSpeed = bulletSpeed;
    }

    triggerCB() {
        this.triggerListener(
            "ranged",
            new Bullet(this, this.position, this.angle, {
                size: this.bulletSize,
                speed: this.bulletSpeed
            })
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