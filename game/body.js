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
  constructor(defense,health,coords) {
    this.torso=new BodyPart({x:coords.x,y:coords.y,z:coords.z},4,"body",null,[],1,"body");
    this.random=new Math.seedrandom("Fox is weird!");
    this.defense=defense;
  }

  takeBullet(bullet){
    let damageDealt=torso.takeBullet(bullet);
    this.takeDamage(damageDealt);
  }

  takeDamage(damage){
    this.health-=damage;
    if(this.health<=0) this.unalive();
  }

  unalive(){
    alert("Dead! Oh no!");
  }

  takeSlash(){
    let damageDealt=this.torso.takeSlash();
    this.takeDamage(damageDealt);
  }

  update(dt){
  }

  walk(velocity,dt){
    this.torso.walk(velocity.dt);
  }

}
export default Body;
