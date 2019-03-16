import * as THREE from 'three';
export class Entity {

  /**
   * Describes the Entity class, which handles movement, rendering and collision of objects.
   * @constructor
   * @param pos {Object {x {Number},z {Number}}} - The coordinates of the Entity's center.
   * @param angle {Number} - The angle by which the Entity (containing the children as well) is rotated about its origin.
   * @param size {Number} - The radius of the hitbox of the Entity.
   * @param speed {Number} - The initial speed of the Entity-like for bullets
   * @param vel {Object {x {Number},y {Number},z {Number}}} - The direction of the velocity vector.
   * @param angleComponents {Object {... {Number}}} - The individual components of the angle, which are summed to find the net angle.
   * @todo Add a y coordinate that defaults to 0
   */
  constructor(pos, angle, size, speed, angleComponents = {}, health = 5) {
    this.room = null;

    this.pos = pos;
    this.vel = {
      x: 0,
      z: 0
    };
    this.angle = angle;
    this.size = size;
    this.speed = speed;
    this.angleComponents = angleComponents;
    this.health = health;
  }

  takeDamage(damage) {
    this.health -= damage;
    if (this.health <= 0) this.die();
  }

  die() {}

  rotateComponent(changeObj) {
    return Object.assign(this.angleComponents, changeObj);
  }
  draw(scene) {
    if (this.initGeometry) {
      this.geom = this.initGeometry();
      this.geom.position.set(this.pos.x, 0, this.pos.z);
      this.geom.rotation.y = -this.angle;
      scene.add(this.geom);
    }
  }

  enter(room) {
    this.room = room;
  }
  exit() {
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
    this.angle = -Math.atan2(pos.x - this.pos.x, pos.z - this.pos.z);
  }

  unit() {
    return {
      x: Math.cos(this.angle),
      z: Math.sin(this.angle),
    };
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
  updateByVelocity(dt) {
    this.pos.x += dt * this.vel.x * this.speed;
    this.pos.z += dt * this.vel.z * this.speed;
    return {
      x: dt * this.vel.x * this.speed,
      z: dt * this.vel.z * this.speed,
    }
  }
  updateMeshPosition() {
    // console.log(this);
    this.geom.position.set(this.pos.x, 5, this.pos.z);
    this.geom.rotation.y = -this.angle;
  }

  dist(entity) {
    return Math.sqrt(['x', 'z'].reduce((a, b) => a + Math.pow(this.pos[b] - entity.pos[b], 2), 0));
  }

  collides(entity) {
    return this.dist(entity) <= this.size + entity.size;
  }

  contains(entity) {
    return this.dist(entity) + entity.radius > this.radius;
  }

  angleTo(pt) {
    return -Math.atan2(pt.x, pt.z) - this.angle;
  }

  isIn(entity) {
    // console.log(this.pos.x, entity.pos.x, entity.size.width,
    // this.pos.x > entity.pos.x + entity.size.width,
    //   this.pos.z > entity.pos.z + entity.size.depth,
    //   this.pos.x + this.size < entity.pos.x,
    //   this.pos.z + this.size < entity.pos.z);
    if (this.pos.x > entity.pos.x + entity.size.width) return false;
    if (this.pos.z > entity.pos.z + entity.size.depth) return false;
    if (this.pos.x + this.size < entity.pos.x) return false;
    if (this.pos.z + this.size < entity.pos.z) return false;
    return true;
  }

  clampTo(entity) {
    if (this.pos.x > entity.pos.x + entity.size.width) this.pos.x = entity.pos.x + entity.size.width;
    if (this.pos.z > entity.pos.z + entity.size.depth) this.pos.z = entity.pos.z + this.room.size.depth;
    if (this.pos.x < entity.pos.x) this.pos.x = entity.pos.x;
    if (this.pos.z < entity.pos.z) this.pos.z = entity.pos.z;
  }
}
export class Player extends Entity {
  constructor(camera, pos) {
    super(pos, 0, 3, 30);
    this.camera = camera;

    this.weapons = [];
    this.triggering = false;
  }

  initGeometry() {
    this.core = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({
      color: 0xffffff,
    }));
    this.boxes = Array(3).fill(0).map(a => new THREE.Mesh(
      new THREE.BoxGeometry(this.size, this.size, this.size),
      new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 0xffffff
      })));
    this.group = new THREE.Group();
    this.group.add(this.core);

    this.boxes.forEach(b => this.group.add(b));

    this.group.position.set(0, 0, 0);
    this.group.name = 'playersprite'
    this.camera.controls.target = this.group.position;
    this.camera.controls.update();

    setInterval(() => {
      this.boxes.forEach(b => {
        b.rotation.x += (Math.random() - 0.5);
        b.rotation.y += (Math.random() - 0.5);
        b.rotation.z += (Math.random() - 0.5);
      })
      // this.box2.rotation.x += 0.01
      // this.box2.rotation.y += 0.01
      // this.box2.rotation.z += 0.01
      // // this.core.rotation.y += 0.07
      // // this.core.rotation.x += 0.07
      // // this.core.rotation.z += 0.07
    }, 10);

    // this.debugger = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({
    //     color: 0xAAFFAA
    // }));
    // scene.add(this.debugger);
    return this.group;
  }

  // initGeometryCB() {
  // }

  equip(weapon) {
    this.weapons.unshift(weapon);
    weapon.setOwner(this);
    weapon.onTrigger(this.handleWeapon.bind(this));
  }
  drop(weapon) {
    this.weapons.splice(this.weapons.indexof(weapons), 1);
    weapon.unmount(this);
  }

  enter(room) {
    this.room = room;
    room.entered(this);
  }

  handleWeapon(t, b) {
    ({
      'ranged': () => this.room.addBullet(b),
      'melee': () => this.room.melee(b)
    })[t]();
  }

  update(dt) {

    let cameraOffset = {
      x: this.camera.position.x - this.pos.x,
      y: this.camera.position.y,
      z: this.camera.position.z - this.pos.z,
    };

    this.updateByVelocity(dt);

    if (this.room) {
      // console.log(this.room.halls, this.room.halls.some(h => this.isIn(h)))
      if (this.room.activated && !this.room.halls.some(h => this.isIn(h))) {
        this.clampTo(this.room);
      }
      for (let i = 0; i < this.room.neighbors.length; i++) {
        if (this.isIn(this.room.neighbors[i])) {
          this.room.exit();
          this.enter(this.room.neighbors[i]);
        }
      }
    }

    this.updateMeshPosition();

    if (this.weapons.length >= 1 && this.triggering) {
      this.weapons[0].trigger();
    }

    this.camera.position.set(
      cameraOffset.x + this.pos.x,
      cameraOffset.y,
      cameraOffset.z + this.pos.z);
    this.camera.controls.target = this.geom.position;
    this.camera.controls.update();
  }

  trigger(v) {
    this.triggering = v;
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
      'Space': () => (this.weapons && this.trigger(true))
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
      'Space': () => (this.trigger(false)),
    })[key] || (() => 1))();
  }
  mouseDown(evt) {
    this.weapons.length >= 1 && this.trigger(true)
  }

  mouseUp(evt) {
    this.trigger(false);
  }
}
export class Creature extends Entity {
  constructor(room, pos, size) {
    super(pos, Math.random() * Math.PI * 2, size, 20, [], 10);
    this.room = room;
    this.damage = Math.floor(Math.random() * 5);
    this.pLoc = null;
    this.waiting = false;
  }

  alertTo(player) {
    this.pLoc = player.pos;
  }

  initGeometry() {
    this.geom = new THREE.Mesh(new THREE.BoxGeometry(this.size, this.size, this.size), new THREE.MeshBasicMaterial({
      wireframe: false,
      color: 0xffffff
    }));
    return this.geom;
  }

  wait(t){
    this.waiting = true;
    setTimeout(() => {
      this.waiting = false;
    }, t);
  }

  update(dt) {
    if (this.pLoc) {
      this.lookAt(this.pLoc);
    } else {
      if (Math.random() > 0.9) this.angle += Math.random() - 0.5;
    }
    this.updateByDirection(dt);


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

    this.updateMeshPosition();
  }

  die() {
    this.room.deleteEnemy(this);
    delete this;
  }
}