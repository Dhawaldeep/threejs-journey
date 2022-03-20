import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {
    environmentMapIntensity: 2.5,
};

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Update materials
 */
const updateMaterials = () => {
    scene.traverse(child => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            // child.material.envMap = environmentMap;
            child.material.envMapIntensity = debugObject.environmentMapIntensity;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    })
}

/**
 * Environment Map
 */
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',
]);
environmentMap.encoding = THREE.sRGBEncoding;
scene.background = environmentMap;
scene.environment = environmentMap;
gui.add(debugObject, 'environmentMapIntensity').min(0).max(10).step(0.1).onChange(updateMaterials).name('Env Intensity');

/**
 * Test sphere
 */
// const testSphere = new THREE.Mesh(
//     new THREE.SphereGeometry(1, 32, 32),
//     new THREE.MeshStandardMaterial()
// )
// scene.add(testSphere)

/**
 * Lights
 */
const directionlLight = new THREE.DirectionalLight('#ffffff', 3);
directionlLight.position.set(0.25, 3, -2.25);
directionlLight.shadow.camera.far = 15;
directionlLight.shadow.mapSize.set(1024, 1024);
directionlLight.castShadow = true;
directionlLight.shadow.normalBias = 0.02;
scene.add(directionlLight);

// const directionlLightShadowCameraHelper = new THREE.CameraHelper(directionlLight.shadow.camera);
// scene.add(directionlLightShadowCameraHelper);

gui.add(directionlLight, 'intensity').min(0).max(10).step(0.001).name('D. Light Intensity');
gui.add(directionlLight.position, 'x').min(-5).max(5).step(0.001).name('D. Light X');
gui.add(directionlLight.position, 'y').min(-5).max(5).step(0.001).name('D. Light Y');
gui.add(directionlLight.position, 'z').min(-5).max(5).step(0.001).name('D. Light Z');

/**
 * Models
 */
gltfLoader.load(
    '/models/hamburger.glb',
    (gltf) => {
        scene.add(gltf.scene);
        gltf.scene.scale.set(0.3, 0.3, 0.3);
        gltf.scene.position.set(0, -1, 0);
        gltf.scene.rotation.y = Math.PI * 0.5;
        gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).name('Model Rotation');

        updateMaterials();
    }
);

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
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 3;
renderer.shadowMap.enabled = true;

gui
.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
})
.name('Tone Mapping')
.onFinishChange(updateMaterials);

gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.1).name('Tone Mapping Exposure')

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()