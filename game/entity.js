import * as THREE from 'three';
export class Entity {
    /**
     * Describes the Entity class, which handles movement, rendering and collision of objects.
     * @constructor
     * @param pos {Object {x {Number},z {Number}}} - The coordinates of the Entity's center.
     */
    constructor(pos = {
        x: 0,
        z: 0
    }, angle = 0, size = 1, speed = 1) {
        this.room = null;

        this.pos = pos;
        this.vel = {
            x: 0,
            z: 0
        };
        this.angle = angle;
        this.size = size;
        this.speed = speed;
    }

    render() {
        this.scene = this.room.scene;
        this.initGeometry && this.scene.add(this.initGeometry());
    }

    enter(room) {
        this.room = room;
    }
    exit() {
        this.room = null;
    }

    walkX(x) {
        this.vel.x = x;
    }
    walkZ(z) {
        this.vel.z = z;
    }

    moveX(x) {
        this.pos.x = x;
    }
    moveZ(z) {
        this.pos.z = z;
    }

    lookAt(pos) {
        this.angle = -Math.atan2(pos.x, pos.z);
    }

    unit() {
        return {
            x: Math.cos(this.angle),
            z: Math.sin(this.angle),
        }
    }


    updateByDirection(dt) {
        let unit = this.unit();
        this.pos.x += dt * unit.x * this.speed;
        this.pos.z += dt * unit.z * this.speed;

        // mesh.position.x += dt * unit.x * this.speed;
        // mesh.position.z += dt * unit.z * this.speed;
        return {
            x: dt * unit.x * this.speed,
            z: dt * unit.z * this.speed,
        }
    }
    updateByVelocity(dt, mesh) {
        this.pos.x += dt * this.vel.x * this.speed;
        this.pos.z += dt * this.vel.z * this.speed;
        return {
            x: dt * this.vel.x * this.speed,
            z: dt * this.vel.z * this.speed,
        }
    }

    draw() {}
    update() {}

    /**
     * Determines if the entity is contacting the given entity.
     * @param entity {Entity} - The entity with which this might be colliding.
     */
    dist(entity) {
        return Math.sqrt(['x', 'z'].reduce((a, b) => a + Math.pow(this.pos[b] - entity.pos[b], 2), 0));
    }

    collides(entity) {
        console.log(this.dist(entity), this.size + entity.size)
        return this.dist(entity) <= this.size + entity.size;
    }

    angleTo(pt) {
        return -Math.atan2(pt.x, pt.z) - this.angle;
    }

    isIn(entity) {
        // console.log(entity, this)
        // console.log(this.pos.x, entity.pos.x + entity.size.width);
        // console.log(this.pos.z > entity.pos.z + entity.size.depth);
        // console.log(this.pos.x + this.size < entity.pos.x);
        // console.log(this.pos.z + this.size < entity.pos.z);
        if (this.pos.x > entity.pos.x + entity.size.width) return false;
        if (this.pos.z > entity.pos.z + entity.size.depth) return false;
        if (this.pos.x + this.size < entity.pos.x) return false;
        if (this.pos.z + this.size < entity.pos.z) return false;
        return true;
    }
    clampTo(entity) {
        if (this.pos.x > entity.pos.x + entity.size.width) this.pos.x = entity.pos.x + entity.size.width;
        if (this.pos.z > entity.pos.z + entity.size.depth) this.pos.z = entity.pos.z + this.room.size.depth;
        if (this.pos.x < entity.pos.x) this.pos.x = entity.pos.x;
        if (this.pos.z < entity.pos.z) this.pos.z = entity.pos.z;
    }
}
export class Player extends Entity {
    constructor(scene, camera, pos) {
        super(scene, pos, 0, 3, 30);

        this.camera = camera;
        this.camera.lookAt(this.box.position);
        this.camera.controls.update();

        this.weapons = [];
        this.triggering = false;
    }

    initGeometry() {
        this.box = new THREE.Mesh(
            new THREE.BoxGeometry(this.size, this.size, this.size),
            new THREE.MeshBasicMaterial({
                wireframe: true,
                color: 0xffffff
            }))
        this.box.position.set(this.pos.x, 0, this.pos.z);
        return this.box;
    }

    equip(weapon) {
        this.weapons.unshift(weapon);
        this.weapon.setOwner(this);
    }
    drop(weapon) {
        this.weapons.splice(this.weapons.indexof(weapons), 1);
        weapon.unmount(this);
    }

    enter(room) {
        this.room = room;
        room.entered(this);
    }

    update(dt) {

        let cameraOffset = {
            x: this.camera.position.x - this.pos.x,
            y: this.camera.position.y,
            z: this.camera.position.z - this.pos.z,
        };

        this.updateByVelocity(dt, this.box);

        if (this.room) {
            console.log(this.halls, this.isIn(this.halls[0]));
            if (!this.halls.some(h => this.isIn(h)) && !this.room.activated) {
                this.clampTo(this.room);
            }
        }
        this.box.position.x = this.pos.x;
        this.box.position.z = this.pos.z;
        this.box.rotation.y = -this.angle;

        if (this.weapons.length >= 1 && this.triggering) {
            this.weapons[0].trigger();
        }

        this.camera.position.set(
            cameraOffset.x + this.pos.x,
            cameraOffset.y,
            cameraOffset.z + this.pos.z);
        this.camera.controls.update();
    }

    trigger(v) {
        this.triggering = v;
    }

    keyDown(evt) {
        let key = evt.code;
        (({
            'ArrowLeft': () => this.walkX(1),
            'ArrowRight': () => this.walkX(-1),
            'ArrowUp': () => this.walkZ(1),
            'ArrowDown': () => this.walkZ(-1),
            'KeyA': () => this.walkX(1),
            'KeyD': () => this.walkX(-1),
            'KeyW': () => this.walkZ(1),
            'KeyS': () => this.walkZ(-1),
            'Space': () => (this.weapon && this.trigger(true))
        })[key] || (() => 1))();
    }
    keyUp(evt) {
        let key = evt.code;
        (({
            'ArrowLeft': () => this.walkX(0),
            'ArrowRight': () => this.walkX(0),
            'ArrowUp': () => this.walkZ(0),
            'ArrowDown': () => this.walkZ(0),
            'KeyA': () => this.walkX(0),
            'KeyD': () => this.walkX(0),
            'KeyW': () => this.walkZ(0),
            'KeyS': () => this.walkZ(0),
            'Space': () => (this.weapon && this.trigger(false)),
        })[key] || (() => 1))();
    }
    mouseDown(evt) {
        this.weapon.length >= 1 && this.trigger(true)
    }
    mouseUp(evt) {
        this.trigger(false)
    }
}
export class Creature extends Entity {
    constructor(room, scene, pos, size) {
        super(scene, pos, Math.random() * Math.PI * 2, size, 20);
        this.room = room;
    }

    initGeometry() {
        this.box = new THREE.Mesh(new THREE.BoxGeometry(this.size, this.size, this.size), new THREE.MeshBasicMaterial({
            wireframe: false,
            color: 0xffffff
        }));
        this.box.position.set(this.pos.x, 0, this.pos.z);
        return this.box;
    }

    update(dt) {
        if (Math.random() > 0.9) this.angle += Math.random() - 0.5

        this.updateByDirection(dt, this.box);

        if (this.room) {
            if (this.pos.x > this.room.pos.x + this.room.size.width - 3) {
                this.pos.x = this.room.pos.x + this.room.size.width - 3;
                let a = this.unit();
                a.x = -a.x;
                this.lookAt(a);
            }
            if (this.pos.z > this.room.pos.z + this.room.size.depth - 3) {
                this.pos.z = this.room.pos.z + this.room.size.depth - 3;
                let a = this.unit();
                a.z = -a.z;
                this.lookAt(a);
            }
            if (this.pos.x < this.room.pos.x + 3) {
                this.pos.x = this.room.pos.x + 3;
                let a = this.unit();
                a.x = -a.x;
                this.lookAt(a);
            }
            if (this.pos.z < this.room.pos.z + 3) {
                this.pos.z = this.room.pos.z + 3;
                let a = this.unit();
                a.z = -a.z;
                this.lookAt(a);
            }
        }
        this.box.position.x = this.pos.x;
        this.box.position.z = this.pos.z;
        this.box.rotation.y = -this.angle;
    }
}