import random from 'seed-random';
import * as THREE from 'three';
import {
    MeleeWeapon,
    RangedWeapon,
    Bullet
} from './weapon.js';


class Room {
    constructor() {
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
        this.player = player;
    }
    unmountPlayer() {
        this.player = null;
    }

    //* Structure/layout
    connect(rooms) {
        this.connections = {
            ...this.connections,
            ...rooms,
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
        this.player.update(dt);
        this.entities.forEach(entity => entity.update(dt));
        this.bullets.forEach(bullet => bullet.update(dt));
    }
}
class EntryRoom extends Room {
    constructor(seed) {}

    generate() {
        let
    }

    extend(x, y, l) {

    }
}