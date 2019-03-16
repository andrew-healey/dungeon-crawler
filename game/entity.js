import * as THREE from 'three';

export class Entity {

    /**
     * Describes the Entity class, which handles movement, rendering and collision of objects.
     * @constructor
     * @param pos {Object {x {Number},z {Number}}} - The coordinates of the Entity's center.
     */
    constructor(scene, pos, angle, size, speed) {
        this.room = null;

        this.pos = pos;
        this.vel = {
            x: 0,
            z: 0
        };
        this.angle = angle;
        this.size = size;
        this.speed = speed;


        this.scene = scene;
        this.initGeometry && this.scene.add(this.initGeometry());
    }

    mount(room) {
        this.room = room;
    }
    unmount() {
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

  contains(entity){
    return this.dist(entity)+entity.radius>this.radius;
  }

    angleTo(pt) {
        return -Math.atan2(pt.x, pt.z) - this.angle;
    }
}

export class Player extends Entity {
    constructor(scene, camera, pos) {
        super(scene, pos, 0, 3, 30);
        this.camera = camera;
        this.camera.lookAt(this.box.position);
        this.camera.controls.update();
        this.weapon = null;
        this.triggering = false;

        let material = new THREE.LineBasicMaterial({
            color: 0x0000ff
        });
        // window.setInterval(() => {
        //     this.angle += 0.001;
        // }, 1);
    }

    initGeometry() {
        this.box = new THREE.Mesh(new THREE.BoxGeometry(this.size, this.size, this.size), new THREE.MeshBasicMaterial({
            wireframe: true,
            color: 0xffffff
        }));
        this.box.position.set(this.pos.x, 0, this.pos.z);
        return this.box;
    }

    mountWeapon(weapon) {
        this.weapon = weapon;
        weapon.mount(this);
    }
    unmountWeapon() {
        this.weapon = null;
        weapon.unmount(this);
    }

    update(dt) {

        let cameraOffset = {
            x: this.camera.position.x - this.pos.x,
            z: this.camera.position.z - this.pos.z,
        };

        let p = Object.assign({}, this.pos);

        this.updateByVelocity(dt, this.box);

        if (this.room) {
            if (this.pos.x > this.room.pos.x + this.room.size.width) this.pos.x = this.room.pos.x + this.room.size.width;
            if (this.pos.z > this.room.pos.z + this.room.size.depth) this.pos.z = this.room.pos.z + this.room.size.depth;
            if (this.pos.x < this.room.pos.x) this.pos.x = this.room.pos.x;
            if (this.pos.z < this.room.pos.z) this.pos.z = this.room.pos.z;
        }
        this.box.position.x = this.pos.x;
        this.box.position.z = this.pos.z;
        this.box.rotation.y = -this.angle;

        if (this.weapon) this.weapon.update(dt);

        this.camera.position.set(
            cameraOffset.x + this.pos.x,
            this.camera.position.y,
            cameraOffset.z + this.pos.z);
        this.camera.controls.update();
    }

    trigger(v) {
        this.weapon.triggering = v;
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
        this.weapon && this.trigger(true)
    }

    mouseUp(evt) {
        this.weapon && this.trigger(false)
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
