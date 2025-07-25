import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { texture } from 'three/tsl'

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('./textures/particles/10.png')

/**
 * Particles
 */
// Geometry
// const particleGeometry = new THREE.SphereGeometry(1, 32, 32)
// const particleGeometry = new THREE.BufferGeometry()
// const points = new Float32Array(
// [
//     1, 0, 1,
//     1, 0, -1,
//     -1, 0, 1,
//     -1, 0, -1, 
//     0, 1, 0,
// ])
// const indices = [
//     0, 1, 2,
//     2, 3, 0,
//     0, 1, 4
// ]
// particleGeometry.setIndex( indices )
// particleGeometry.setAttribute( 'position',
//     new THREE.BufferAttribute(
//         points, 3
//     )
// )
const particleGeometry = new THREE.BufferGeometry()
const count = 10000
const positions = new Float32Array(count * 3)

const colors = new Float32Array(count * 3)

for(let i = 0; i < count * 3; i++)
{
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}

particleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)

particleGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
)

// Material
const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true, // size is dependent on proximity to camera
    // color: new THREE.Color('#ff88cc'),
    alphaMap: particleTexture,
    transparent: true,
    // alphaTest: 0.001
    // depthTest: false // particles even on the other side of objects will be drawn over them
    depthWrite: false, // almost flawless, but there may be bugs in strange edge cases
    blending: THREE.AdditiveBlending, // adds all of the colors on the same pixel, impacts the performance
    vertexColors: true
})

// Points
const particles = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particles)

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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update particles
    // particles.rotation.y = - elapsedTime * 0.2
    for(let i = 0; i < count; i ++)
    {
        const i3 = i * 3
        
        const x = particleGeometry.attributes.position.array[i3]
        const z = particleGeometry.attributes.position.array[i3 +2]
        particleGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x) + Math.sin(elapsedTime + z)
    }

    particleGeometry.attributes.position.needsUpdate = true
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()