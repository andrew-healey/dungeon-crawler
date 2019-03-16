import random from 'seed-random';
import * as THREE from 'three';
import {
    MeleeWeapon,
    RangedWeapon,
    Bullet
} from './weapon.js';

export class Player {
    constructor(scene, pos) {
        this.pos = pos;
        var geo = new THREE.BoxGeometry(1, 1, 1)
        var mat = new THREE.MeshBasicMaterial({
            wireframe: true,
            color: 0xffffff
        });
        var box = new THREE.Mesh(geo, mat)
        scene.add(box);
        this.box = box;

        this.room = null

        this.speed = 30;
        this.moving = {
            x: 0,
            z: 0,
        };
    }

    mount(room) {
        this.room = room;
    }

    moveX(x) {
        this.moving.x = x;
    }
    moveZ(z) {
        this.moving.z = z;
    }

    update(dt) {
        this.pos.x += dt * this.moving.x * this.speed;
        this.pos.z += dt * this.moving.z * this.speed;

        if (this.room) {
            if (this.pos.x > this.room.pos.x + this.room.size.width) this.pos.x = this.room.pos.x + this.room.size.width;
            if (this.pos.z > this.room.pos.z + this.room.size.depth) this.pos.z = this.room.pos.z + this.room.size.depth;
            if (this.pos.x < this.room.pos.x) this.pos.x = this.room.pos.x;
            if (this.pos.z < this.room.pos.z) this.pos.z = this.room.pos.z;
        }
    }

    keyDown(evt) {
        let key = evt.code;
        (({
            'ArrowLeft': () => this.moveX(1),
            'ArrowRight': () => this.moveX(-1),
            'ArrowUp': () => this.moveZ(1),
            'ArrowDown': () => this.moveZ(-1),
            'KeyA': () => this.moveX(1),
            'KeyD': () => this.moveX(-1),
            'KeyW': () => this.moveZ(1),
            'KeyS': () => this.moveZ(-1)
        })[key] || (() => 1))();
    }
    keyUp(evt) {
        console.log(evt);
        let key = evt.code;
        (({
            'ArrowLeft': () => this.moveX(0),
            'ArrowRight': () => this.moveX(0),
            'ArrowUp': () => this.moveZ(0),
            'ArrowDown': () => this.moveZ(0),
            'KeyA': () => this.moveX(0),
            'KeyD': () => this.moveX(0),
            'KeyW': () => this.moveZ(0),
            'KeyS': () => this.moveZ(0)
        })[key] || (() => 1))();
    }
}
export class Room {
    constructor(scene, player, size, pos) {
        this.scene = scene;

        this.activated = false;
        this.unlocked = false;

        this.connections = {
            'n': null,
            's': null,
            'e': null,
            'w': null
        }

        this.listeners = {};

        this.player = player;
        this.playerEntered = false;

        this.pos = pos;
        this.size = size;

        let floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(size.width, size.depth, 8, 8), new THREE.MeshBasicMaterial({
            color: 0x555555,
            side: THREE.DoubleSide
        }));
        floor.rotateX(Math.PI / 2);
        floor.position.y = -2;
        floor.position.x = -pos.x;
        floor.position.z = -pos.z;

        this.walls = new THREE.Group();
        this.walls.add(floor);
        // console.log(this.pos);

        let walls = [
            [0, 0, 1, 0],
            [0, 0, 0, 1],
            [0, 1, 1, 0],
            [1, 0, 0, 1],
        ].map(([x, z, width, depth], i) => {
            // console.log(i)
            let boxWidth = width * size.width;
            let boxHeight = depth * size.depth;
            let geom = new THREE.BoxGeometry(boxWidth + 3, 5, boxHeight + 3);
            let wall = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({
                color: 0x00ff00,
            }));
            wall.position.set(x * size.width + boxWidth / 2 + (z * boxHeight), 0, z * size.depth + boxHeight / 2 + (x * boxWidth));
            return wall;
        });
        walls.forEach(w => this.walls.add(w));
        scene.add(this.walls);
        console.log(this.walls);

    }
    //* Events

    on(event, func) {
        if (this.listeners.hasOwnProperty(event)) {
            this.listeners[event].push(func);
        } else {
            this.listeners[event] = [func];
        }
    }

    emit(emitter, event, ...data) {
        if (this.listeners.hasOwnProperty(event)) {
            this.listeners[event].forEach(func => func({
                name: event,
                data,
                emitter,
                room: this
            }, ...data));
        }
    }

    //* Player
    mountPlayer() {
        this.playerEntered = true;
        this.player.mount(this);
    }
    unmountPlayer() {
        this.playerEntered = false;
    }

    //* Structure/layout
    connect(rooms) {
        this.connections = {
            ...this.connections,
            ...rooms,
        }
    }

    //*
    keyDown(evt) {
        if (this.player) this.player.keyDown(evt);
    }
    keyUp(evt) {
        if (this.player) this.player.keyUp(evt);
    }

    //*

    update(dt) {
        if (this.player && this.playerEntered) {
            this.player.update(dt);

            this.walls.position.x = this.pos.x - this.player.pos.x;
            this.walls.position.z = this.pos.z - this.player.pos.z;
        }
    }

}

class NormalRoom extends Room {
    constructor(_difficulty) {
        this.enemies = [];
        this.bullets = [];
    }


    //* Generation/reset
    reset() {
        this.enitities = [];
    }
    generateWave(number) {
        this.entities = Array(number).fill(seed()).map(s => new Entity(this));
    }


    //* draw+update;
    draw() {}

    update(dt) {
        if (this.playerEntered) {
            this.player.update(dt);
            this.entities.forEach(entity => entity.update(dt));
            this.bullets.forEach(bullet => bullet.update(dt));
        }
    }
}
class EntryRoom extends Room {
    constructor(seed) {}

    generate() {
        // let
    }

    extend(x, y, l) {

    }
}