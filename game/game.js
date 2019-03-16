import random from 'seed-random';
import {
    MeleeWeapon,
    RangedWeapon,
    Bullet
} from './game.js';

class Room {
    constructor() {
        this.enitities = [];
        this.bullets = [];
        this.player = null;

        this.activated = false;
        this.unlocked = false;

        this.connections = {
            'n': null,
            's': null,
            'e': null,
            'w': null
        }

        this.listeners = {};
    }

    //* Events

    on(event, func) {
        if (this.listeners.hasOwnProperty(event)) {
            this.listeners[event].push(func);
        } else {
            this.listeners[event] = [];
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

    //* Generation/reset
    reset() {
        this.enitities = [];
        // this.bullets = 
    }
    generateWave(number) {
        this.entities = Array(number).fill(seed()).map(s => new Entity())
    }

    connect(rooms) {
        this.connections = {
            ...this.connections,
            ...rooms,
        }
    }

    enterPlayer(player) {
        this.player = player;
    }

    draw() {

    }

    update() {

    }
}
class Level {
    constructor(seed) {
        this.seed = seed;
    }

    generate() {
        let
    }
}