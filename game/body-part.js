class BodyPart extends Entity {

  /**
   * Describes the BodyPart class, which holds a Body together and is in charge of determining structure of a body to render. It can send events such as a damage-taking event to the main Body, as well as receive and pass down hits.
   * @constructor
   * @param coords {Object {x {Number},z {Number}}} - The relative coordinates of the BodyPart.
   * @param size {Number} - The size of the BodyPart - Determines what body parts can follow others.
   * @param parent {BodyPart} - The parent BodyPart that will control this BodyPart.
   * @param children {BodyPart[]} - The children BodyParts that this BodyPart will control - of a specified BodyPart type.
   * @param defense {Number} - The defense by which to divide raw damage taken.
   * @param specificType {string} - A string representing what type of weapon it is.
   */
  constructor(coords, size = 4, type = "body", parent, children = [], defense = 1, specificType) {
    this.parent = parent;
    this.children = children;
    super(coords, angle, size);
    this.defense = defense;
    this.type = type;
    if (type === "weapon") this.specificType = specificType || "sword";
    else if (type === "appendage") this.specificType = specificType || "leg";
    this.yRotation = 0;
    this.animationTime = 0;
    this.period = this.size / 2;
    this.customAnimation = false;
  }

  initGeometry() {
    const ALL_TYPES = ["gun": {
      x: 0.6,
      y: 0.6,
      z: 1
    }, "sword": {
      x: 0.3,
      y: 0.1,
      z: 1
    }, "hand": {
      x: 0.5,
      y: 1,
      z: 1
    }, "body": {
      radius: 1
    }, "leg": {
      x: 0.2,
      y: 1,
      z: 0.2
    }, "arm": {
      x: 0.2,
      y: 0.2,
      z: 1
    }];
    let thisType = ALL_TYPES[specificId] || thisType[weaponId];
    this.model = new THREE.Group();
    this.piece = new THREE.BoxGeometry(this.size * thisType.x, this.size * thisType.y, this.size * thisType.z);
    for (child of children) {
      this.model.add(child.initGeometry());
    }
    this.model.position.set(this.position.x, this.position.y, this.position.z);
    this.model.rotateY(0); //TODO change this to the real y value, or something that will support BodyPart
    this.model.rotateX(this.angle);
    return this.model;
  }

  /**
   * Takes damage--or not--from a slash attack, returning the taken damage.
   * @param sword {Entity} - The sword Entity whose size is the length of the blade.
   * @param rotation {Number} - The delta theta of the sword's swing range.
   * @param damage {Number} - The damage that the sword will do on a successful hit.
   */
  takeSlash(sword, rotation, damage) {
    let distance = Math.sqrt(sword.position.x ** 2 + sword.position.z ** 2);
    let phi = Math.arccos(sword.position.x / distance);
    let deltAng = Math.abs(sword.angle - phi);
    let currDamage = 0;
    if (deltAng <= rotation && distance <= length) {
      currDamage += damage;
    }

    //Add net child damage to total.
    for (child of children) {
      //Next one uses sword location relative to the child.
      let modifiedSwordOrigin = {
        x: sword.position.x - this.position.x,
        z: sword.position.z - this.position.z
      };
      let newSword = new Entity(modifiedSwordOrigin);
      currDamage += child.takeSlash(newSword, rotation, damage);
    }

    //Apply defense at the end
    return currDamage / this.defense;
  }

  /**
   * Takes a bullet and returns the damage that it inflicted.
   * @param bullet {Entity} - The bullet to take.
   * @todo Make bullet hit method that takes a BodyPart that cannot be hit anymore - also deals 'damage' to a bullet, which makes it disappear in the next frame
   */
  takeBullet(bullet, damage) {
    let currDamage = 0;
    let isTouching = this.collidesWith(bullet);
    if (isTouching) {
      currDamage = damage;
      bullet.hit(this);
    } else {
      for (child of children) {
        let modifiedBulletOrigin = {
          x: bullet.position.x - this.position.x,
          z: bullet.position.z - this.position.z
        };
        let newBullet = new Entity(modifiedBulletOrigin, bullet.angle, bullet.size);
        currDamage += child.takeBullet(newBullet, damage);
      }
    }
    return currDamage / this.defense;
  }

  /**
   * Moves the entity in a direction.
   */
  walk(velocity, timeSpent) {
    if (this.type == "body") {
      this.position.x += cos(rotation) * velocity;
      this.position.y += sin(rotation) * velocity;
    } else if (this.type == "appendage") {
      baseRotation = (baseRotation + timeSpent) / this.period
      //Set the y position over time equal to the 
      this.yRotation = Math.atan(Math.tan(Math.abs(baseRotation)) ** 3);
    }
  }

  /*
   * Attack animation.
   * @param weaponNum {Number} - The index of the weapon that is attacking.
   * @param weaponId {string} - The specific type of the weapon to discharge.
   * @param directionSign {Boolean} - The sign of the direction that the sword will attack.
   * @param timeUsed {Number} - The time that the weapon has been attacking for.
   */
  useWeapon(weaponNum, weaponName, directionSign, timeUsed) {
    if (this.type == "weapon") {
      if (this.specificType !== weaponId) return weaponNum;
      if (weaponNum > 0) return weaponNum - 1;
      if (this.specificType === "sword") this.parent.angle = Math.atan(Math.tan(Math.abs(timeUsed * velocity / this.period)));
      else if (this.specificType === "gun") {
        if (timeUsed < this.period / 4 || timeUsed > 3 * this.period / 4) return -1;
        this.customAnimation = true;
      }
      return -1;
    }

    for (let i = 0; i < children.length; i++) {
      weaponNum = child.useWeapon(weaponNum, weaponId, directionSign, timeUsed);
      if (weaponNum < 0) return weaponNum;
    }
    return weaponNum;
  }

}
export default BodyPart;
