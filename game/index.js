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

var geo = new THREE.BoxGeometry(1, 1, 1)
var mat = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 0xffffff
});
var box = new THREE.Mesh(geo, mat)
scene.add(box);
camera.position.set(0, 1, -3);
camera.lookAt(new THREE.Vector3())

let start = performance.now();
let prev = performance.now();

let light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);


// console.log();

let floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000, 8, 8), new THREE.MeshBasicMaterial({
    color: 0x555555,
    side: THREE.DoubleSide
}));
floor.rotateX(Math.PI / 2);
floor.position.z = -10;

let room = new Room(scene, {
    width: 10,
    height: 10,
}, {
    x: -5,
    y: -5
})

scene.add(floor);

window.addEventListener('resize', onWindowResize, false);

container.appendChild(renderer.domElement);
animate();
onWindowResize();

function animate() {
    let current = performance.now();
    let dt = current - prev;

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}