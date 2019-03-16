import * as THREE from 'three';
import {
    Creature
} from './entity.js';

// import {
//     Player
// } from './'
// export RangedWeapon;


export class Hall {
    constructor(size = 5, from, to) {
        let vertical = from.pos.z !== to.pos.z;

        this.drawn = false;
        this.vertical = vertical;
        this.from = from;
        this.to = to;

        this.pos = vertical ? {
            x: from.pos.x + from.size.width / 2 - size / 2,
            z: from.pos.z + from.size.depth,
        } : {
            x: from.pos.x + from.size.width,
            z: from.pos.z + from.size.depth / 2 - size / 2,
        }
        this.size = vertical ? {
            x: size,
            z: to.pos.z - from.pos.z - from.size.z,
        } : {
            x: to.pos.x - from.pos.x - from.size.x,
            z: size,
        }
    }

    drawFloor(group) {
        this.floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(this.size.width, this.size.depth, 8, 8), new THREE.MeshBasicMaterial({
            color: 0x555555,
            side: THREE.DoubleSide
        }));
        this.floor.rotateX(Math.PI / 2);
        this.floor.position.y = -2;
        this.floor.position.x = -this.pos.x;
        this.floor.position.z = -this.pos.z;
        group.add(this.floor)
    }
    drawWalls(group) {
        let walls = (!this.vertical ? [
            [0, 0, 1, 0],
            [0, 1, 1, 0],
        ] : [
            [0, 0, 0, 1]
            [1, 0, 0, 1],
        ]).map(([x, z, width, depth], i) => {
            let boxWidth = width * this.size.width;
            let boxHeight = depth * this.size.depth;
            let geom = new THREE.BoxGeometry(boxWidth + 3, 5, boxHeight + 3);
            let wall = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({
                color: 0x00ff00 + (i * 0xff / 4),
            }));
            wall.position.set(x * this.size.width + boxWidth / 2 + (z * boxHeight), 0, z * this.size.depth + boxHeight / 2 + (x * boxWidth));
            return wall;
        });
        walls.forEach(w => group.add(w))
    }
    draw(scene) {
        if (!this.drawn) {
            this.drawn = true;
            let group = new THREE.Group();
            this.drawFloor(group);
            this.drawWalls(group);

            group.position.x = this.pos.x;
            group.position.z = this.pos.z;

            scene.add(group);
            // this.scene = scene;
        }
        console.log(this);
    }
}
export class Room {
    constructor(level, size, pos) {
        this.level = level;

        this.bullets = [];

        this.activated = true;
        this.unlocked = true;

        this.listeners = {};
        this.player = null;

        this.pos = pos;
        this.size = size;
        this.connections = {
            n: null,
            s: null,
            e: null,
            w: null,
        };
        this.hallways = {
            n: null,
            s: null,
            e: null,
            w: null
        };
    }

    drawFloor(group) {
        this.floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(this.size.width, this.size.depth, 8, 8), new THREE.MeshBasicMaterial({
            color: 0x555555,
            side: THREE.DoubleSide
        }));
        this.floor.rotateX(Math.PI / 2);
        this.floor.position.y = -2;
        this.floor.position.x = -this.pos.x;
        this.floor.position.z = -this.pos.z;
        group.add(this.floor)
    }
    drawWalls(group) {
        let walls = [
            [0, 0, 1, 0],
            [0, 0, 0, 1],
            [0, 1, 1, 0],
            [1, 0, 0, 1],
        ].map(([x, z, width, depth], i) => {
            let boxWidth = width * this.size.width;
            let boxHeight = depth * this.size.depth;
            let geom = new THREE.BoxGeometry(boxWidth + 3, 5, boxHeight + 3);
            let wall = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({
                color: 0x00ff00 + (i * 0xff / 4),
            }));
            wall.position.set(x * this.size.width + boxWidth / 2 + (z * boxHeight), 0, z * this.size.depth + boxHeight / 2 + (x * boxWidth));
            return wall;
        });
        walls.forEach(w => group.add(w))
    }
    draw(scene) {
        let group = new THREE.Group();
        this.drawFloor(group);
        this.drawWalls(group);

        group.position.x = this.pos.x;
        group.position.z = this.pos.z;

        scene.add(group);
        this.scene = scene;
    }

    //* Player
    entered(player) {
        this.player = player;
    }
    exit() {
        this.player = null;
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
        this.bullets.forEach(b => {
            b.update(dt);
            for (let i = 0; i < this.enemies.length; i++) {
                let e = this.enemies[i];
                if (b.collides(e)) {
                    e.takeDamage(b.damage);
                }
            }
        });
    }
    updatePlayer(dt) {
        this.player && this.player.update(dt);
    }
    update(dt) {
        this.updateBullets(dt);
        this.updatePlayer(dt);
    }

    addBullet(bullet) {
        // console.log(this.scene);
        this.bullets.push(bullet);
        bullet.draw(this.scene);
    }
    deleteBullet(bullet) {
        this.scene.remove(bullet.geom);
        bullet.geom.geometry.dispose();
        bullet.geom.material.dispose();
        delete this.bullets.splice(this.bullets.indexOf(bullet), 1);
    }

    connect(side, room, hallway) {
        this.connections[side] = room;
        this.halls[side] = hallway;
    }

}

export class WaveRoom extends Room {
    constructor(level, size, pos) {
        super(level, size, pos);
        this.enemies = [];

        this.raycaster = new THREE.Raycaster();
        this.mouse = {
            x: 0,
            y: 0
        };

        this.generateWave();
    }

    generateWave() {
        this.enemies = Array(5).fill(0).map(a => new Creature(this, {
            x: Math.random() * this.size.width + this.pos.x,
            z: Math.random() * this.size.depth + this.pos.z
        }, 2));
    }

    draw(scene) {
        this.debugger = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({
            color: 0xAAFFAA
        }));
        scene.add(this.debugger);
        // this.geometry = new THREE.Geometry();
        // this.geometry.vertices.push(
        //     new THREE.Vector3(-10, 0, 0),
        //     new THREE.Vector3(10, 0, 0)
        //     new THREE.Vector3(0, 10, 0),
        // );
        // this.debugger = new THREE.Mesh(this.geometry, new THREE.LineBasicMaterial({
        //     color: 0xAAFFAA
        // }));
        // scene.add(this.debugger);

        let group = new THREE.Group();
        this.drawFloor(group);
        this.drawWalls(group);
        this.enemies.map(a => a.draw(scene))

        group.position.x = this.pos.x;
        group.position.z = this.pos.z;

        scene.add(group);
        this.scene = scene;
    }

    updateEnemies(dt) {
        this.enemies.forEach(e => {
            e.update(dt);
            for (let i = 0; i < this.bullets.length; i++) {
                let b = this.bullets[i];
                if (b.collides(e)) {
                    this.deleteBullet(b);
                    e.takeDamage(b.damage);
                    // this.deleteEnemy(e);
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
            this.debugger.position.set(pt.x, pt.y, pt.z);
            // for (let i = 0; i < this.enemies.length; i++) {
            //     if (Math.abs(this.player.angleTo(this.enemies[i].pos)) <= 0.5) this.player.lookAt(this.enemies[i].pos);
            // }
        }
        this.updateBullets(dt);
        this.updatePlayer(dt);
        this.updateEnemies(dt);
    }

    deleteEnemy(enemy) {
        // console.log(enemy);
        this.scene.remove(enemy.geom);
        enemy.geom.geometry.dispose();
        enemy.geom.material.dispose();
        delete this.enemies.splice(this.enemies.indexOf(enemy), 1);
    }

    mouseMove(evt) {
        this.mouse.x = (evt.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(evt.clientY / window.innerHeight) * 2 + 1;
    }

    melee(weapon) {
        // let pos = weapon.player.pos;
        for (let i = 0; i < this.enemies.length; i++) {
            let e = this.enemies[i];
            if (e.dist(weapon.player) <= weapon.radius && Math.abs(weapon.player.angleTo(e)) < weapon.range) {
                e.takeDamage(weapon.damage);
            }
        }
    }
}

export class Level {
    constructor({
        min,
        max
    }) {
        this.rooms = [];
        this.currentRoom = null;
        this.player = null;
        this.halls = [];

        this.min = min;
        this.max = max;

    }


    generate() {

        let step = 100 + 20;
        let stack = [];
        // let start = Array(width, )
        this.rooms = [new WaveRoom(1, {
            width: 100,
            depth: 100
        }, {
            x: -50,
            z: -50
        }), new WaveRoom(1, {
            width: 100,
            depth: 100
        }, {
            x: -50,
            z: 60
        })];
        this.halls = [new Hall(10, this.rooms[0], this.rooms[1])]
        this.currentRoom = this.rooms[0];
        if (this.player) this.currentRoom.player = this.player;
        this.player.enter(this.rooms[0]);
    }

    add(player) {
        this.player = player;
        if (this.currentRoom) this.currentRoom.player = player;
    }

    draw(scene) {
        // let drawRoom = ([room, neighbors]) => {
        //     room.draw(scene);
        //     (neighbors || []).map(drawRoom);
        // }

        this.rooms.map(a => a.draw(scene));
        this.halls.forEach(a => a.draw(scene));
        this.player.draw(scene);
    }

    update(dt) {
        this.player.update(dt);
        this.currentRoom.update(dt);
    }

    keyDown(evt) {
        if (this.player && this.player.keyDown) this.player.keyDown(evt);
    }
    keyUp(evt) {
        if (this.player && this.player.keyUp) this.player.keyUp(evt);
    }
    mouseMove(evt) {
        if (this.player && this.player.mouseMove) this.player.mouseMove(evt);
        this.currentRoom.mouseMove(evt);
    }
    mouseDown(evt) {
        if (this.player && this.player.mouseDown) this.player.mouseDown(evt);
    }
    mouseUp(evt) {
        if (this.player && this.player.mouseUp) this.player.mouseUp(evt);
    }
}