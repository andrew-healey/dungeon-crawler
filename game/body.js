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
  constructor(defense) {
    this.random=new Math.seedrandom("Fox is weird!");
    this.defense=defense;
  }

  takeBullet(){

  }
  takeSword(){

  }

}
export default Body;
