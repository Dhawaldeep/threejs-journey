import './style.css'
import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// const mesh = new THREE.Mesh(geometry, material)
// // mesh.position.x = 1;
// // mesh.position.y = -1;
// // mesh.position.z = -2;
// mesh.position.set(1, -1, -2);
// scene.add(mesh);

// mesh.scale.set(2, 0.5, 1);
// mesh.rotation.reorder('YXZ');
// mesh.rotation.x = Math.PI * 0.25;
// mesh.rotation.y = Math.PI * 0.25;


/**
 * Group
 */
const group = new THREE.Group();
scene.add(group);
group.position.y = -2;
group.position.x = -1;
group.scale.y = 1.4;
group.rotation.y = Math.PI * 0.25;

const cubes = [
    new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000})),
    new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0x00ff00})),
]
group.add(...cubes);
cubes.forEach((cube, i) => {
    cube.position.set(i + 1, i + 1, i + 1);
})

/**
 * Axes Helper
 */

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 5
scene.add(camera)
camera.lookAt(cubes[0].position);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)