import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const geometry = new THREE.SphereGeometry(0.5, 16, 16);
const objects = new Array(3).fill(0).map(() => (
    new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({ color: '#ff0000' })
    )
))
objects[0].position.x = - 2
objects[2].position.x = 2

scene.add(...objects)


/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();

// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDestination = new THREE.Vector3(10, 0, 0);

// const line = new THREE.Line(
//     (new THREE.BufferGeometry()).setFromPoints([rayOrigin, rayDestination]),
//     new THREE.LineBasicMaterial(),
// );
// scene.add(line);

// const rayDirection = rayDestination.clone();
// rayDirection.normalize()

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

const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = - ((event.clientY / sizes.height) * 2 - 1);
});

let currentIntersect = null;

window.addEventListener('click', () => {
    if (currentIntersect) {
        const idx = objects.findIndex(object => currentIntersect.object === object);
        if (idx > -1) {
            console.log(idx + 1);
        } 
        switch(currentIntersect.object)
        {
            case objects[0]:
                console.log('click on object 1')
                break

            case objects[1]:
                console.log('click on object 2')
                break

            case objects[2]:
                console.log('click on object 3')
                break
        }
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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

    objects[0].position.y = Math.sin(elapsedTime * 0.3) * 1.3;
    objects[1].position.y = Math.sin(elapsedTime * 0.8) * 1.3;
    objects[2].position.y = Math.sin(elapsedTime * 1.4) * 1.3;
    
    raycaster.setFromCamera(mouse, camera);
    const intersections = raycaster.intersectObjects(objects);

    for (const object of objects) {
        object.material.color.set('#ff0000');
    }

    for (const intersect of intersections) {
        intersect.object.material.color.set('#0000ff');
    }

    if (intersections.length > 0) {
        if (!currentIntersect) {
            console.log('mouse enter');
        }
        currentIntersect = intersections[0]
    } else {
        if (currentIntersect) {
            console.log('mouse leave');
        }
        currentIntersect = null;
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()