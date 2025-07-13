import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1) // color, intensity
// ambientLight.color = 0xffffff
// ambientLight.intensity = 1
scene.add(ambientLight)
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.0001)
gui.addColor(ambientLight, 'color')

const directionalLight = new THREE.DirectionalLight(0x00ffff, 1) // rays travel in parallel (sun)
directionalLight.position.set(1, 0.25, 0) // creates an infinite number of rays on a plane perpendicular to the center
scene.add(directionalLight)

const hemiSphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9) // first value is the color applied from the top, second is the color applied from the bottom, and the colors blend along the sides of objects
scene.add(hemiSphereLight)

const pointLight = new THREE.PointLight(0xff9000, 1.5, 10, 2) // color, intensity, fade distance, decay(how far the light travels, and how fast it's intensity decays)
pointLight.position.set(1, -0.5, 1)
scene.add(pointLight)

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1) // color, intensity, width, height (determines size of plane) // akin to a rectangular light for photo shoots
rectAreaLight.position.set(- 1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3()) // (0, 0, 0) by default
scene.add(rectAreaLight) // rectarealight only works

const spotLight = new THREE.SpotLight(0x78ff00, 4.5, 10, Math.PI * 0.1, 0.25, 1) // color, intensity, distance, angle, penumbra(blurs the edge of the light's shine), decay(how fast )
spotLight.position.set(0, 2, 3)
scene.add(spotLight)

spotLight.target.position.x = -1
scene.add(spotLight.target) // spotlight target needs to be added to the scene

// Minimal Cost Light - Ambient Light, Hemisphere Light
// Moderate Cost Light - Directional Light, Point Light
// High Cost Light - Rect Light, Spot Light

// light can be baked into the textures themselves, but if this is done, the light cannot be updated later
// baking can be used to create incredibly realistic light bouncing


// Helpers
const hemiSphereLightHelper = new THREE.HemisphereLightHelper(hemiSphereLight, 0.2)
scene.add(hemiSphereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)

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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()