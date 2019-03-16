import BodyPart from "body-part";
import Entity from "entity";
import seedrandom from "seedrandom";

class Body extends Entity {
  /**
   * Describes the Body class, which interacts with bodies near it and coordinates the magical orchestra that is movement.
   * @constructor
   * @param defense {Number} - The defense of the Body.
   * @param health {Number} - The HP of the Body. Usually from 100-1000.
   * @param coords {Object {x {Number},z {Number}} - The coordinates on a 2D plane of the Body.
   */
  constructor(coords, defense, health,angle=0) {
    super(coords, angle, 3, 30);
    this.torso = new BodyPart({
      x: coords.x,
      y: coords.y,
      z: coords.z
    }, 3, "body", null, [], 1, "body");
    this.random = new Math.seedrandom("Fox is weird!");
    this.defense = defense;
    this.triggering = false;
  }

  initGeometry(){
    return torso.initGeometry();
  }

  takeBullet(bullet) {
    let damageDealt = torso.takeBullet(bullet);
    this.takeDamage(damageDealt);
  }

  takeDamage(damage) {
    this.health -= damage;
    if (this.health <= 0) this.unalive();
  }

  unalive() {
    alert("Dead! Oh no!");
  }

  trigger(v) {
    this.triggering = v;
  }

  takeSlash() {
    let damageDealt = this.torso.takeSlash();
    this.takeDamage(damageDealt);
  }

  update(dt) {
    if (this.triggering) {
      this.body.useWeapon()
    }
    this.updateByVelocity(dt);
    if (this.room) {
      this.clampTo(room);
    }
    this.updateMeshPosition();

  }

  walk(velocity, dt) {
    this.torso.walk(velocity.dt);
  }

  equip(weapon) {
    weapon.setOwner(this);
    weapon.onTrigger(this.handleWeapon.bind(this));
  }
  drop(weapon) {
    weapon.onTrigger(() => null);
  }
  enter(room) {
    this.room = room;
  }
  handleWeapon(t, b) {
    ({
      'ranged': () => this.room.addBullet(b),
      'melee': () => this.room.melee(b)
    })[t]();
  }

  die(){
    delete this;
  }

}
export default Body;
