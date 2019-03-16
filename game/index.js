import * as THREE from 'three';
import OrbitControlConstructor from 'three-orbit-controls';
let OrbitControls = OrbitControlConstructor(THREE);


import {
    Hall,
    WaveRoom,
    Level
} from './game.js';
import {
    Player
} from './entity.js';
import {
    RangedWeapon
} from './weapon.js'

//#region Setup
let container = document.getElementById('canvas');
let renderer = new THREE.WebGLRenderer({
    antialias: true,
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
let gun = new RangedWeapon('asdf', 2, 60, 1.5, 260);
let player = new Player(camera, {
    x: 0,
    z: 0
});
let level = new Level({
    min: 4,
    max: 5,
});

// player.enter(room1);
player.equip(gun);
level.add(player);
level.generate();
level.draw(scene);

console.log(scene);

//#region Controls
controls.target = player.box.position;
controls.update();

controls.enableKeys = false;
controls.enabled = false;
// controls.maxPolarAngle = Math.PI / 2;
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
    level.keyDown(evt);
});
document.body.addEventListener('keyup', function (evt) {
    if (evt.key === 'Control') controls.enabled = false;
    level.keyUp(evt);
});
// document.body.addEventListener('keyreleased', function (evt) {
//     if (evt.key === 'Control') controls.enabled = false;
//     room1.keyUp(evt);
// });
document.body.addEventListener('mousemove', function (evt) {
    // if (evt.key === 'Control') controls.enabled = false;
    level.mouseMove(evt);
});
document.body.addEventListener('mousedown', function (evt) {
    // if (evt.key === 'Control') controls.enabled = false;
    level.mouseDown(evt);
});
document.body.addEventListener('mouseup', function (evt) {
    // if (evt.key === 'Control') controls.enabled = false;
    level.mouseUp(evt);
});
//#endregion

function animate() {

    requestAnimationFrame(animate);
    let current = +new Date;
    let dt = (current - prev) / 1000;

    level.update(dt);
    controls.update();

    prev = current;

    renderer.render(scene, camera);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}