import random from 'seed-random';

class Room {
    constructor() {
        this.enitities = [];
        this.bullets = [];
        this.player = [];

        this.activated = false;
        this.unlocked = false;

        this.connections = {
            'n': null,
            's': null,
            'e': null,
            'w': null
        }
    }

    connect(rooms) {
        this.connections = {
            ...this.connections,
            ...rooms,
        }
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