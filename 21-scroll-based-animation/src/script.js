import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new dat.GUI()

const objectDistance = 4;
const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        material.color.set(parameters.materialColor);
        pointsMaterial.color.set(parameters.materialColor);
    })

/**
 * Scroll
 */
let scroll = window.scrollY;
let currentSection = 0;
window.addEventListener('scroll', () => {
    scroll = window.scrollY;
    const newSection = Math.round(scroll / sizes.height);
    if (newSection !== currentSection) {
        currentSection = newSection;
        gsap.to(
            sectionsObjects[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3',
                z: '+=1.5',
            }
        )
    }
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test cube
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial({ color: '#ff0000' })
// )
// scene.add(cube)

/**
 * Sections Objects
 */
// Texture
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load('textures/gradients/3.jpg');
gradientTexture.magFilter = THREE.NearestFilter;

// Material
const material = new THREE.MeshToonMaterial({ color: parameters.materialColor });
material.gradientMap = gradientTexture;
const sectionsObjects = [
    new THREE.Mesh(
        new THREE.TorusGeometry(1, 0.4, 16, 60),
        material,
    ),
    new THREE.Mesh(
        new THREE.ConeGeometry(1, 2, 32),
        material,
    ),
    new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
        material,
    )
];

scene.add(...sectionsObjects);
sectionsObjects.forEach((obj, i) => {
    obj.position.y = - i * objectDistance;
    obj.position.x = 2 * (i % 2 === 0 ? 1 : -1)
})

/**
 * Particles
 */
// Geometry
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)

const geometry = new THREE.BufferGeometry();
for (let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance * sectionsObjects.length;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const pointsMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    size: 0.02,
    sizeAttenuation: true,
});

const points = new THREE.Points(geometry, pointsMaterial);
scene.add(points);

/**
 * Lights
 */
const dLight = new THREE.DirectionalLight('#ffffff', 1);
scene.add(dLight);
dLight.position.set(1, 1, 0);

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
// Camera Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime;

    // Update Objects
    sectionsObjects.forEach(obj => {
        obj.rotation.x += deltaTime * 0.1;
        obj.rotation.y += deltaTime * 0.12;
    })

    // Animate camera
    camera.position.y = - scroll / sizes.height * objectDistance;

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()