import * as THREE from 'three';
import OrbitControlConstructor from 'three-orbit-controls';
import {
    Room,
    WaveRoom
} from './game.js';
import {
    Player
} from './entity.js';
import {
    RangedWeapon
} from './weapon.js'

//#region Setup
let OrbitControls = OrbitControlConstructor(THREE);

let container = document.getElementById('canvas');
let renderer = new THREE.WebGLRenderer({
    antialiased: true,
});

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(50, 16 / 9, 1, 1000);
camera.position.set(0, 40, -80);

let controls = new OrbitControls(camera);
camera.controls = controls;
//#endregion

//#region Misc

let start = performance.now();
let prev = performance.now();

let light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);
//#endregion

//#region Player
let gun = new RangedWeapon(scene, 'asdf', 2, 60, 1.5, 560);
let player = new Player(scene, camera, {
    x: 0,
    z: 0
});
let room = new WaveRoom(scene, player, {
    width: 100,
    depth: 100,
}, {
    x: -50,
    z: -50
});
room.mountPlayer();
player.mountWeapon(gun);
gun.onTrigger((t, b) => room.addBullet(b));


controls.target = player.box.position;
controls.update();

controls.enableKeys = false;
controls.enabled = false;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 10;
controls.maxDistance = 200;

// controls.minAzimuthAngle = Math.PI;
// controls.maxAzimuthAngle = 2 * Math.PI;
//#endregion

//#region Dom
window.addEventListener('resize', onWindowResize, false);

container.appendChild(renderer.domElement);
animate();
onWindowResize();

document.body.addEventListener('keydown', function (evt) {
    if (evt.key === 'Control') controls.enabled = true;
    room.keyDown(evt);
});
document.body.addEventListener('keyup', function (evt) {
    if (evt.key === 'Control') controls.enabled = false;
    room.keyUp(evt);
});
// document.body.addEventListener('keyreleased', function (evt) {
//     if (evt.key === 'Control') controls.enabled = false;
//     room.keyUp(evt);
// });
document.body.addEventListener('mousemove', function (evt) {
    // if (evt.key === 'Control') controls.enabled = false;
    room.mouseMove(evt);
});
document.body.addEventListener('mousedown', function (evt) {
    // if (evt.key === 'Control') controls.enabled = false;
    room.mouseDown(evt);
});
document.body.addEventListener('mouseup', function (evt) {
    // if (evt.key === 'Control') controls.enabled = false;
    room.mouseUp(evt);
});
//#endregion

function animate() {

    requestAnimationFrame(animate);

    let current = +new Date;
    let dt = (current - prev) / 1000;

    room.update(dt);
    controls.update();

    prev = current;

    renderer.render(scene, camera);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}