class BodyPart extends Entity {

  /**
   * Describes the BodyPart class, which holds a Body together and is in charge of determining structure of a body to render. It can send events such as a damage-taking event to the main Body, as well as receive and pass down hits.
   * @constructor
   * @param coords {Object {x {Number},z {Number}}} - The relative coordinates of the BodyPart.
   * @param size {Number} - The size of the BodyPart - Determines what body parts can follow others.
   * @param parent {BodyPart} - The parent BodyPart that will control this BodyPart.
   * @param children {BodyPart[]} - The children BodyParts that this BodyPart will control - of a specified BodyPart type.
   * @param defense {Number} - The defense by which to divide raw damage taken.
   */
  constructor(coords, size = 4, type = "body", parent, children = [], defense = 1) {
    this.parent = parent;
    this.children = children;
    super(coords, angle, size);
    this.defense = defense;
    this.type=type;
    this.yRotation=0;
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
   */
  takeBullet(bullet, damage) {
    let currDamage = 0;
    let isTouching = this.collidesWith(bullet);
    if (isTouching) {
      currDamage = damage;
    } else {
      for (child of children) {
        let modifiedBulletOrigin = {
          x: bullet.position.x - this.position.x,
          z: bullet.position.z - this.position.z
        };
        let newBullet=new Entity(modifiedBulletOrigin,bullet.angle,bullet.size);
        currDamage+=child.takeBullet(newBullet,damage);
      }
    }
    return currDamage / this.defense;
  }

  /**
   * Moves the entity in a direction.
   */
  walk(velocity,timeSpent){
    if(this.type=="body"){
      this.position.x+=cos(rotation)*velocity;
      this.position.y+=sin(rotation)*velocity;
    }
    else if(this.type=="appendage"){
      //TODO
    }
  }

}
export default BodyPart;
