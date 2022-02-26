import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

const parameters = {
    color: '#3fc819',
    color2: '#ff88cc',
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const pointsTexture = textureLoader.load('textures/particles/2.png');

// /**
//  * Sphere Points
//  */
// const sphereGeom = new THREE.SphereGeometry(1, 32, 32);
// const pointsMaterial = new THREE.PointsMaterial({ sizeAttenuation: true, size: 0.02, });

// const sphere = new THREE.Points(sphereGeom, pointsMaterial);
// scene.add(sphere);

/**
 * Points
 */
// Geometry
const geometry = new THREE.BufferGeometry();

const count = 5000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

// const angle = 2 * Math.PI * Math.random();
// const radius = 2 + Math.random() * 5;
for (let i = 0; i < count * 3; i++) {
    // const remainder = i % 3;
    // // x
    // if (remainder === 0) {
    //     positions[i] = (Math.sin(angle) - 0.5) * radius;
    // }

    // // y
    // if (remainder === 1) {
    //     positions[i] = 0;

    // }
    // // z
    // if (remainder === 2) {
    //     positions[i] = (Math.cos(angle) - 0.5) * radius;
    // }
    positions[i] = (Math.random() - 0.5) * 10;
    // colors[i] = Math.random();
}
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
// geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));


// Geometry
const geometry2 = new THREE.BufferGeometry();
    
const positions2 = new Float32Array(count * 3);

// const angle = 2 * Math.PI * Math.random();
// const radius = 2 + Math.random() * 5;
for (let i = 0; i < count * 3; i++) {
    // const remainder = i % 3;
    // // x
    // if (remainder === 0) {
    //     positions[i] = (Math.sin(angle) - 0.5) * radius;
    // }

    // // y
    // if (remainder === 1) {
    //     positions[i] = 0;

    // }
    // // z
    // if (remainder === 2) {
    //     positions[i] = (Math.cos(angle) - 0.5) * radius;
    // }
    positions2[i] = (Math.random() - 0.5) * 10;
    // colors[i] = Math.random();
}
geometry2.setAttribute('position', new THREE.BufferAttribute(positions2, 3));
geometry2.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Material
const material = new THREE.PointsMaterial();
material.color = new THREE.Color(parameters.color);
material.size = 0.1;
material.sizeAttenuation = true;
material.transparent = true;
material.alphaMap = pointsTexture;
// material.alphaTest = 0.001;
// material.depthTest = false;
material.depthWrite = false;
material.blending = THREE.AdditiveBlending;
// material.vertexColors = true
gui.addColor(parameters, 'color').name('Sin Color').onChange(() => {
    material.color = new THREE.Color(parameters.color);
})

const material2 = new THREE.PointsMaterial();
material2.color = new THREE.Color(parameters.color2);
material2.size = 0.1;
material2.sizeAttenuation = true;
material2.transparent = true;
material2.alphaMap = pointsTexture;
// material2.alphaTest = 0.001;
// material2.depthTest = false;
material2.depthWrite = false;
material2.blending = THREE.AdditiveBlending;
// material.vertexColors = true
gui.addColor(parameters, 'color2').name('Cos Color').onChange(() => {
    material2.color = new THREE.Color(parameters.color2);
})

const points = new THREE.Points(geometry, material);
scene.add(points);
points.position.x = -2.5

const points2 = new THREE.Points(geometry2, material2);
scene.add(points2);

/**
 * Test cube
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 10
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Update Points
    // points.rotation.y = elapsedTime * 0.2

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = geometry.attributes.position.array[i3];
        const x2 = geometry2.attributes.position.array[i3];
        geometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x);
        geometry2.attributes.position.array[i3 + 1] = Math.cos(elapsedTime + x2);
        // geometry.attributes.position.array[i3 + 1] = Math.cos(elapsedTime + x);
        // geometry.attributes.position.array[i3 + 1] = Math.tan(elapsedTime + x);
    }

    geometry.attributes.position.needsUpdate = true;
    geometry2.attributes.position.needsUpdate = true;

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()