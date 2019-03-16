class BodyPart extends Entity{

  /**
   * Describes the BodyPart class, which holds a Body together and is in charge of determining structure of a body to render. It can send events such as a damage-taking event to the main Body, as well as receive and pass down hits.
   * @constructor
   * @param size {Number} - The size of the BodyPart - Determines what body parts can follow others.
   * @param parent {BodyPart} - The parent BodyPart that will control this BodyPart.
   * @param children {BodyPart[]} - The children BodyParts that this BodyPart will control - of a specified BodyPart type.
   * @param defense {Number} - The defense by which to divide raw damage taken.
   */
  constructor(size = 4, type = "body", parent, children = [], defense = 1) {
    this.parent = parent;
    this.children = children;
    super({x:0,z:0},angle,size);
    this.defense=defense;
    //Take care of some things, might get phased out
    if (this.type == "body") {

    } else if (this.type == "appendage") {

    } else if (this.type = "weapon") {

    }
  }

  /**
   * Takes damage--or not--from a slash attack, returning the taken damage.
   * @param swordOrigin {Number[2]} - The x and y position of the sword's hilt.
   * @param length {Number} - The length of the sword.
   * @param startTheta {Number} - The starting orientation of the sword.
   * @param rotation {Number} - The delta theta of the sword's swing range.
   * @param damage {Number} - The damage that the sword will do on a successful hit.
   */
  takeSlash(swordOrigin, length, startTheta, rotation, damage) {
    let distance = Math.sqrt(swordOrigin.position.x ** 2 + swordOrigin.position.z ** 2);
    let phi = Math.arccos(swordOrigin.position.x / distance);
    let deltAng = Math.abs(startTheta - phi);
    let currDamage = 0;
    if (deltAng <= rotation && distance <= length) {
      currDamage += damage;
    }

    //Add net child damage to total
    for (child of children) {
      //Next one uses sword location relative to the child.
      let modifiedSwordOrigin = {
        x: swordOrigin.position.x - child.position.x,
        z: swordOrigin.position.z - child.position.z
      };
      currDamage += child.takeSlash(modifiedSwordOrigin, length, startTheta, rotation, damage);
    }

    //Apply defense at the end
    return currDamage / this.defense;
  }

  /**
   * Takes a bullet and returns the damage that it inflicted.
   * @param bullet {Entity} - The bullet to take.
   */
  takeBullet(bullet){
      
  }

}
export default BodyPart;
