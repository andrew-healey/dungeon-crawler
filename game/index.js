import * as THREE from 'three';

let container = document.getElementById('canvas');
let renderer = new THREE.WebGLRenderer({
    antialiased: true,
});

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(50, 1);

let start = performance.now();
let prev = performance.now();

let floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000, 8, 8), new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide
}));

scene.add(floor);

window.addEventListener('resize', onWindowResize, false);

container.appendChild(renderer.domElement);
renderer.render(scene, camera);
animate();

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