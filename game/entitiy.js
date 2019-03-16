export class Entity {
    constructor(position, angle, size = 0) {
        this.position = position;
        this.angle = angle;
        this.size = size;
    }

    draw() {}
    update() {}

    unit() {}
    lookAt() {}
    moveForward() {}
    onCollideWithWall() {}
    // collides(entity) {}
}

export class Creature extends Entity {
    constructor(room, type, position) {
        super(position, Math.random() * 2 * Math.PI);
        this.type = type;
        this.room = room;
    }

    draw() {}

    update() {}

    on(event, func) {
        this.room.on(event, func.bind(this));
    }

    emit(event, ...data) {
        this.room.emit(this, event, ...data);
    }
}

export class Enemy extends Creature {
    constructor(seed, room) {
        super(room, 'enemy-' + seed);
        this.seed = seed;

        this.health = 10;

        ths
    }

    handleMelee(x, y, weapon, direction) {

    }

    draw() {

    }
}