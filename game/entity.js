export class Entity {

  /**
   * Describes the Entity class, which handles movement, rendering and collision of objects.
   * @constructor
   * @param position {Object {x {Number},z {Number}}} - The coordinates of the Entity's center.
   */
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

  /**
   * Determines if the entity is contacting the given entity.
   * @param entity {Entity} - The entity with which this might be colliding.
   */
  collidesWith(entity) {
    return Math.sqrt([0, "x", /*"y" */ , "z"].reduce((old, i) => (old + [0, this, entity].reduce((old, e) => old - e.position[i]) ** 2))) > entity.size + this.size;
  }
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
