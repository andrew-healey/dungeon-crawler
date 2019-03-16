/**
 * Describes the BodyPart class, which holds a Body together and is in charge of determining structure of a body to render. It can send events such as a damage-taking event to the main Body, as well as receive and pass down hits.
 * @constructor
 * @param size {Number} - The size of the BodyPart - Determines what body parts can follow others.
 */
function BodyPart(size=4,type="body"){
  let ret={};
  
  /**
   * Initializes the body part
   * @param parent {BodyPart} - The parent BodyPart that will control this BodyPart.
   * @param children {BodyPart[]} - The children BodyParts that this BodyPart will control - of a specified BodyPart type.
   */
  function init(){
      
  }

}
export default BodyPart;
