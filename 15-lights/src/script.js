import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
gui.close();
const parameters = {
    directionalLight: {
        dirLightPos: {
            inclination: Math.PI * 0.73,
            azimuth: Math.PI * 1.2,
        },
        helperVisible: false,
    },
    pointLight: {
        helperVisible: true,
    },
    rALight: {
        helperVisible: true,
    },
    spotLight: {
        helperVisible: false,
    }
};

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)

// const pointLight = new THREE.PointLight(0xffffff, 0.5)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)

// Ambient
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const aLightGUI = gui.addFolder('Ambient Light');
aLightGUI.close();
aLightGUI.add(ambientLight, 'intensity').name('Intensity').min(0).max(2).step(0.001);
aLightGUI.add(ambientLight, 'visible').name('Visible');

// Directional
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
scene.add(directionalLight);
directionalLight.position.x = - Math.sin(parameters.directionalLight.dirLightPos.azimuth) * Math.sin(parameters.directionalLight.dirLightPos.inclination);
directionalLight.position.z = - Math.cos(parameters.directionalLight.dirLightPos.azimuth) * Math.sin(parameters.directionalLight.dirLightPos.inclination);
directionalLight.position.y = - Math.cos(parameters.directionalLight.dirLightPos.inclination);
directionalLight.lookAt(new THREE.Vector3())

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
if (parameters.directionalLight.helperVisible) scene.add(directionalLightHelper);

const dirLightGUI = gui.addFolder('Directional Light');
dirLightGUI.close();
dirLightGUI.add(directionalLight, 'intensity').name('Intensity').min(0).max(2).step(0.001);
dirLightGUI.add(directionalLight, 'visible').name('Visible').onChange(() => {
    scene.remove(directionalLightHelper);
    parameters.directionalLight.helperVisible = directionalLight.visible;
    if (directionalLight.visible) {
        scene.add(directionalLightHelper);
        dirLightHelperGUI.enable();
    } else {
        dirLightHelperGUI.disable();
    }
});
const dirLightHelperGUI = dirLightGUI.add(parameters.directionalLight, 'helperVisible').name('Show Helper');
dirLightHelperGUI.onChange(() => {
    scene.remove(directionalLightHelper);
    if (parameters.directionalLight.helperVisible) {
        scene.add(directionalLightHelper);
    }
})
const posDirLightGUI = dirLightGUI.addFolder('Position');
posDirLightGUI.close();
posDirLightGUI.add(parameters.directionalLight.dirLightPos, 'azimuth').name('Azimuth').min(0).max(2 * Math.PI).step(0.01)
.onChange(() => {
    directionalLight.position.x = - Math.sin(parameters.directionalLight.dirLightPos.azimuth) * Math.sin(parameters.directionalLight.dirLightPos.inclination);
    directionalLight.position.z = - Math.cos(parameters.directionalLight.dirLightPos.azimuth) * Math.sin(parameters.directionalLight.dirLightPos.inclination);
})
posDirLightGUI.add(parameters.directionalLight.dirLightPos, 'inclination').name('Inclination').min(Math.PI * 0.5).max(Math.PI * 1.5).step(0.01)
.onChange(() => {
    directionalLight.position.x = - Math.sin(parameters.directionalLight.dirLightPos.azimuth) * Math.sin(parameters.directionalLight.dirLightPos.inclination);
    directionalLight.position.z = - Math.cos(parameters.directionalLight.dirLightPos.azimuth) * Math.sin(parameters.directionalLight.dirLightPos.inclination);
    directionalLight.position.y = - Math.cos(parameters.directionalLight.dirLightPos.inclination);
})

// Hemisphere
const hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0xff0000, 0.3)
scene.add(hemisphereLight);
const hemisphereLightGUI = gui.addFolder('Hemisphere Light');
hemisphereLightGUI.close();
hemisphereLightGUI.add(hemisphereLight, 'visible').name('Visible');
hemisphereLightGUI.add(hemisphereLight, 'intensity').name('Intensity').min(0).max(2).step(0.001);

// Point
const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);
scene.add(pointLight);
pointLight.position.set(1, - 0.5, 1)
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
if (parameters.pointLight.helperVisible) scene.add(pointLightHelper);

const pointLightGUI = gui.addFolder('Point Light');
pointLightGUI.close();
pointLightGUI.add(pointLight, 'intensity').name('Intensity').min(0).max(2).step(0.001);
pointLightGUI.add(pointLight, 'visible').name('Visible').onChange(() => {
    scene.remove(pointLightHelper);
    parameters.pointLight.helperVisible = pointLight.visible;
    if (pointLight.visible) {
        scene.add(pointLightHelper);
        pointLightHelperGUI.enable();
    } else {
        pointLightHelperGUI.disable();
    }
});
const pointLightHelperGUI = pointLightGUI.add(parameters.pointLight, 'helperVisible').name('Show Helper');
pointLightHelperGUI.onChange(() => {
    scene.remove(pointLightHelper);
    if (parameters.pointLight.helperVisible) {
        scene.add(pointLightHelper);
    }
})
pointLightGUI.add(pointLight, 'distance').name('Distance').min(0.01).max(10).step(0.01)
pointLightGUI.add(pointLight, 'decay').name('Decay').min(1).max(5).step(0.001)
const posPointLightGUI = pointLightGUI.addFolder('Position');
posPointLightGUI.close();
posPointLightGUI.add(pointLight.position, 'x').min(-2).max(2).step(0.01)
posPointLightGUI.add(pointLight.position, 'y').min(-2).max(2).step(0.01)
posPointLightGUI.add(pointLight.position, 'z').min(-2).max(2).step(0.01)


// Rect Area Light
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
scene.add(rectAreaLight)
rectAreaLight.position.set(- 1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())

const rALHelper = new RectAreaLightHelper(rectAreaLight);
if (parameters.rALight.helperVisible) scene.add(rALHelper);

const rALGUI = gui.addFolder('Rect Area Light');
rALGUI.close();
rALGUI.add(rectAreaLight, 'intensity').name('Intensity').min(0).max(5).step(0.001);
rALGUI.add(rectAreaLight, 'visible').name('Visible').onChange(() => {
    scene.remove(rALHelper);
    parameters.rALight.helperVisible = rectAreaLight.visible;
    if (rectAreaLight.visible) {
        scene.add(rALHelper);
        rALHelperGUI.enable();
    } else {
        rALHelperGUI.disable();
    }
})

const rALHelperGUI = rALGUI.add(parameters.rALight, 'helperVisible');
rALHelperGUI.name('Show Helper').onChange(() => {
    scene.remove(rALHelper);
    if (parameters.rALight.helperVisible) {
        scene.add(rALHelper);
    }
})

const rALPositionGUI = rALGUI.addFolder('Position');
rALPositionGUI.close();
rALPositionGUI.add(rectAreaLight.position, 'x').min(-2).max(2).step(0.01).onChange(() => {
    rectAreaLight.lookAt(new THREE.Vector3());
})
rALPositionGUI.add(rectAreaLight.position, 'y').min(-2).max(2).step(0.01).onChange(() => {
    rectAreaLight.lookAt(new THREE.Vector3());
})
rALPositionGUI.add(rectAreaLight.position, 'z').min(-2).max(2).step(0.01).onChange(() => {
    rectAreaLight.lookAt(new THREE.Vector3());
})


// Spot Light
const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);
scene.add(spotLight.target);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
if (parameters.spotLight.helperVisible) scene.add(spotLightHelper);

const spLGUI = gui.addFolder('Spot Light');
spLGUI.close();
spLGUI.add(spotLight, 'intensity').name('Intensity').min(0).max(3).step(0.001)
spLGUI.add(spotLight, 'distance').name('Distance').min(0.01).max(10).step(0.01)
spLGUI.add(spotLight, 'angle').name('FOV').min(Math.PI * 0.001).max(Math.PI * 0.5).step(0.001)
spLGUI.add(spotLight, 'penumbra').name('Penumbra').min(0).max(3).step(0.001)
spLGUI.add(spotLight, 'decay').name('Decay').min(0).max(3).step(0.001)
spLGUI.add(spotLight, 'visible').name('Visible').onChange(() => {
    scene.remove(spotLightHelper);
    parameters.spotLight.helperVisible = spotLight.visible;
    if (spotLight.visible) {
        scene.add(spotLightHelper);
        spotLHelperGUI.enable();
    } else {
        spotLHelperGUI.disable();
    }
})

const spotLHelperGUI = spLGUI.add(parameters.spotLight, 'helperVisible');
spotLHelperGUI.name('Show Helper').onChange(() => {
    scene.remove(spotLightHelper);
    if (parameters.spotLight.helperVisible) {
        scene.add(spotLightHelper);
    }
})

const spotLPositionGUI = spLGUI.addFolder('Spot Light Position');
spotLPositionGUI.close();
spotLPositionGUI.add(spotLight.position, 'x').min(-2).max(2).step(0.01);
spotLPositionGUI.add(spotLight.position, 'y').min(-2).max(2).step(0.01);
spotLPositionGUI.add(spotLight.position, 'z').min(-2).max(2).step(0.01);

const spotLTPositionGUI = spLGUI.addFolder('Target Position');
spotLTPositionGUI.close();
spotLTPositionGUI.add(spotLight.target.position, 'x').min(-2).max(2).step(0.01);
spotLTPositionGUI.add(spotLight.target.position, 'y').min(-2).max(2).step(0.01);
spotLTPositionGUI.add(spotLight.target.position, 'z').min(-2).max(2).step(0.01);


/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    directionalLightHelper.update();
    spotLightHelper.update();

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    pointLight.position.x = Math.sin(elapsedTime * Math.PI * 0.25) * 1.5;
    pointLight.position.z = Math.cos(elapsedTime * Math.PI * 0.25) * 1.5;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()