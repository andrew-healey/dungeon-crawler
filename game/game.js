import random from 'seed-random';
import * as THREE from 'three';
import {
    MeleeWeapon,
    RangedWeapon,
    Bullet
} from './weapon.js';

class Player {
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

        this.speed = 1;
    }

    move(x, z, dt) {
        this.pos.x += x * this.speed * dt;
        this.pos.z += z * this.speed * dt;
    }
}
export class Room {
    constructor(scene, size, pos) {
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

        this.player = null;
        this.playerEntered = false;

        this.pos = pos;
        this.size = size;

        this.walls = new THREE.Group();

        let walls = [
            [0, 0, 1, 0],
            [0, 0, 0, 1],
            [0, 1, 1, 0],
            [1, 0, 0, 1],
        ].map(([x, y, width, height]) => {
            let geom = new THREE.BoxGeometry((width * size.width || 3), 5, (height * size.height || 3));
            let wall = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({
                color: 0x00ff00,
            }));
            wall.position.set(x * size.width, 0, y * size.height);
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
    mountPlayer(player) {
        this.playerEntered = true;
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
    handleEvent(evt) {
        this.player.handleEvent(evt);
    }

    //*

    draw() {
        this.walls.position.x = this.pos.x - this.player.pos.x;
        this.walls.position.z = this.pos.z - this.player.pos.z;
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