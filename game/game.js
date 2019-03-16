import random from 'seed-random';
import * as THREE from 'three';
import {
    Creature
} from './entity.js';

// import {
//     Player
// } from './'
// export RangedWeapon;


export class Hall {
    constructor(scene, player, size, from, to, vertical) {
        if (vertical) {
            //     this.size = {
            //         width: size,
            //         depth: from.pos.z > to.pos.z ?
            //             from.pos.z - from.size.depth - to.pos.z : to.pos.z - to.size.depth - from.pos.z
            //     }
            //     this.pos = {
            //         z: from.pos.z > to.pos.z ?
            //             from.pos.z - from.size.depth - to.pos.z : to.pos.z - to.size.depth - from.pos.z,
            //         x:
            //     }
            // } else {
            //     this.size = {
            //         depth: size,
            //         width: from.pos.x > to.pos.x ?
            //             from.pos.x - from.size.width - to.pos.x : to.pos.x - to.size.width - from.pos.x
            //     }
            //     this.pos = {
            //         x: from.pos.x > to.pos.x ?
            //             from.pos.x - from.size.width - to.pos.x : to.pos.x - to.size.width - from.pos.x
            //         z:
            //     }
        }

    }
}
export class Room {
    constructor(scene, player, size, pos) {
        this.scene = scene;

        this.bullets = [];

        this.activated = false;
        this.unlocked = true;

        this.connections = {
            'n': null,
            's': null,
            'e': null,
            'w': null
        }

        this.listeners = {};

        this.player = player;
        player.mount(this)
        this.playerEntered = false;

        this.pos = pos;
        this.size = size;

        this.floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(size.width, size.depth, 8, 8), new THREE.MeshBasicMaterial({
            color: 0x555555,
            side: THREE.DoubleSide
        }));
        this.floor.rotateX(Math.PI / 2);
        this.floor.position.y = -2;
        this.floor.position.x = -pos.x;
        this.floor.position.z = -pos.z;

        this.walls = new THREE.Group();
        this.walls.add(this.floor);

        let walls = [
            [0, 0, 1, 0],
            [0, 0, 0, 1],
            [0, 1, 1, 0],
            [1, 0, 0, 1],
        ].map(([x, z, width, depth], i) => {
            let boxWidth = width * size.width;
            let boxHeight = depth * size.depth;
            let geom = new THREE.BoxGeometry(boxWidth + 3, 5, boxHeight + 3);
            let wall = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({
                color: 0x00ff00 + (i * 0xff / 4),
            }));
            wall.position.set(x * size.width + boxWidth / 2 + (z * boxHeight), 0, z * size.depth + boxHeight / 2 + (x * boxWidth));
            return wall;
        });
        walls.forEach(w => this.walls.add(w));
        scene.add(this.walls);

        this.walls.position.x = this.pos.x;
        this.walls.position.z = this.pos.z;
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
    mouseMove(evt) {
        if (this.player) this.player.mouseMove(evt);
    }
    mouseDown(evt) {
        if (this.player) this.player.mouseDown(evt);
    }
    mouseUp(evt) {
        if (this.player) this.player.mouseUp(evt);
    }

    //*

    updateBullets(dt) {
        this.bullets.forEach(b => b.update(dt));
    }
    updatePlayer(dt) {
        if (this.player && this.playerEntered) {
            this.player.update(dt);
        }
    }

    update(dt) {
        this.updateBullets(dt);
        this.updatePlayer(dt);
    }

    addBullet(bullet) {
        this.bullets.push(bullet);
    }
    deleteBullet(bullet) {
        this.scene.remove(bullet.bullet);
        bullet.bullet.geometry.dispose();
        bullet.bullet.material.dispose();
        // .dispose();
        delete this.bullets.splice(this.bullets.indexOf(bullet), 1);
    }

}
export class WaveRoom extends Room {
    constructor(scene, player, size, pos) {
        super(scene, player, size, pos);
        this.enemies = [];

        this.raycaster = new THREE.Raycaster();
        this.mouse = {
            x: 0,
            y: 0
        };

        this.generateWave();

    }

    generateWave() {
        this.enemies = Array(5).fill(0).map(a => new Creature(this, this.scene, {
            x: Math.random() * this.size.width + this.pos.x,
            z: Math.random() * this.size.depth + this.pos.z
        }, 2));
    }

    updateEnemies(dt) {
        this.enemies.forEach(e => {
            e.update(dt);
            for (let i = 0; i < this.bullets.length; i++) {
                let b = this.bullets[i];
                if (b.collides(e)) {
                    this.deleteBullet(b);
                    this.deleteEnemy(e);
                    return;
                }
            }
        });
    }

    update(dt) {
        this.raycaster.setFromCamera(this.mouse, this.player.camera);
        let i = this.raycaster.intersectObject(this.floor);

        if (i.length > 0) {
            let pt = i[0].point;
            this.player.lookAt(pt);
            for (let i = 0; i < this.enemies.length; i++) {
                if (Math.abs(this.player.angleTo(this.enemies[i].pos)) <= 0.5) this.player.lookAt(this.enemies[i].pos);
            }
        }


        this.updateBullets(dt);
        this.updatePlayer(dt);
        this.updateEnemies(dt);
    }

    deleteEnemy(enemy) {
        this.scene.remove(enemy.box);
        enemy.box.geometry.dispose();
        enemy.box.material.dispose();
        delete this.enemies.splice(this.enemies.indexOf(enemy), 1);
    }

    mouseMove(evt) {
        this.mouse.x = (evt.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(evt.clientY / window.innerHeight) * 2 + 1;
    }

    // this.reset = []
}