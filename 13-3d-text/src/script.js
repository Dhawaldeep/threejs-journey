import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import * as dat from 'lil-gui'

/**
 * Base
 */

// Debug
const gui = new dat.GUI()
const parameters = {
    text: 'Meena Gaur',
    textureUrl: '/textures/matcaps/4.png',
    textures: {
        '1': '/textures/matcaps/1.png',
        '2': '/textures/matcaps/2.png',
        '3': '/textures/matcaps/3.png',
        '4': '/textures/matcaps/4.png',
        '5': '/textures/matcaps/5.png',
        '6': '/textures/matcaps/6.png',
        '7': '/textures/matcaps/7.png',
        '8': '/textures/matcaps/8.png',
    }
};

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures & Material
 */
const textureLoader = new THREE.TextureLoader()
let matCapTexture = textureLoader.load(parameters.textureUrl);
const material = new THREE.MeshMatcapMaterial({ matcap: matCapTexture });
const textMatCapTexture = textureLoader.load(parameters.textures[8]);
const textMaterial = new THREE.MeshMatcapMaterial({ matcap: textMatCapTexture });
/**
 * Fonts
 */
const fontLoader = new FontLoader()


fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    let textGeometry = new TextGeometry(parameters.text, {
        font,
        size: 0.5,
        height: 0.2,
        curveSegments: 6,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
    })
    // textGeometry.computeBoundingBox();
    // const boundingBox = textGeometry.boundingBox
    // textGeometry.translate(
    //     - (boundingBox.min.x - 0.02) * 0.5,
    //     - (boundingBox.min.y - 0.02) * 0.5,
    //     - (boundingBox.min.z - 0.03) * 0.5,
    // )
    textGeometry.center();
    let text = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(text);
    gui.add(parameters, 'text')
        .name('Text')
        .onChange(() => {
            if (text) {
                scene.remove(text);
            }
            textGeometry = new TextGeometry(parameters.text, {
                font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5,
            })
            textGeometry.center();
            text = new THREE.Mesh(textGeometry, textMaterial);
            scene.add(text);
        })

    gui.add(parameters, 'textureUrl', parameters.textures)
        .name('Donut MatCap Texture')
        .onChange((textureUrl) => {
            matCapTexture = textureLoader.load(parameters.textureUrl);
            material.matcap = matCapTexture;
        })

    for (let index = 0; index < 300; index++) {
        const donut = new THREE.Mesh(
            new THREE.TorusGeometry(0.3, 0.2, 20, 45),
            material
        );
        scene.add(donut);
        donut.position.x = (Math.random() - 0.5) * 10;
        donut.position.y = (Math.random() - 0.5) * 10;
        donut.position.z = (Math.random() - 0.5) * 10;

        donut.rotation.x = Math.random() * Math.PI;
        donut.rotation.y = Math.random() * Math.PI;

        const scale = Math.random()
        donut.scale.set(scale, scale, scale)
    }
})

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()