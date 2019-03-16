import * as THREE from 'three';
import OrbitControlConstructor from 'three-orbit-controls';
import {
    Room,
    Player
} from './game.js';

let OrbitControls = OrbitControlConstructor(THREE);

let container = document.getElementById('canvas');
let renderer = new THREE.WebGLRenderer({
    antialiased: true,
});

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(50, 16 / 9, 1, 1000);
let controls = new OrbitControls(camera);
controls.enableKeys = false;
controls.enabled = false;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 10;
controls.maxDistance = 200;
controls.minAzimuthAngle = 0; // radians
controls.maxAzimuthAngle = Math.PI; // radians

// var geo = new THREE.BoxGeometry(1, 1, 1)
// var mat = new THREE.MeshBasicMaterial({
//     wireframe: true,
//     color: 0xffffff
// });
// var box = new THREE.Mesh(geo, mat)
// scene.add(box);
camera.position.set(0, 40, -80);
camera.lookAt(new THREE.Vector3())

let start = performance.now();
let prev = performance.now();

let light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);


// console.log();

let player = new Player(scene, {
    x: 0,
    z: 0
});
let room = new Room(scene, player, {
    width: 100,
    depth: 100,
}, {
    x: -50,
    z: -50
})
room.mountPlayer();
console.log(room.player);

// scene.add(floor);

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

function animate() {
    let current = performance.now();
    let dt = (current - prev) / 1000;
    room.update(dt);

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    prev = current;
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}