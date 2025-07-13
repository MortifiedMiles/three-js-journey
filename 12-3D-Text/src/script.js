import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
// import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('#ffc0cb')

// // Axes helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Fonts
 */
const fontLoader = new FontLoader()
const assetLoader = new GLTFLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        const textGeometry = new TextGeometry(
            'I Love You',
            {
                font: font,
                size: 0.5,
                depth: 0.2,
                curveSegments: 8,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4
            }
        )
        // textGeometry.computeBoundingBox()
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x + 0.0005) * 0.5,
        //     - (textGeometry.boundingBox.max.y - 0.033) * 0.5,
        //     - (textGeometry.boundingBox.max.z - 0.03) * 0.5
        // )
        textGeometry.center()

        const material = new THREE.MeshMatcapMaterial()
        material.matcap = matcapTexture
        // textMaterial.wireframe = true
        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)

        // const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
        console.time('hearts')
            // const donut = new THREE.Mesh(donutGeometry, material)
        const redMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })
        assetLoader.load(
            './assets/heart.glb',
            (gltf) => {
                const heart = gltf.scene;
                for(let i = 0; i < 300; i++)
                    {
                    const heartInstance = heart.clone(true)
                    
                    heartInstance.position.x = (Math.random() - 0.5) * 10
                    heartInstance.position.y = (Math.random() - 0.5) * 10
                    heartInstance.position.z = (Math.random() - 0.5) * 10

                    heartInstance.rotation.x = Math.PI * 1.5
                    heartInstance.rotation.y = Math.random() - 0.5

                    const scale = Math.random() / 15

                    heartInstance.scale.set(scale, scale, scale)

                    heartInstance.traverse((child) => {
                        if (child.isMesh) {
                          child.material = redMaterial;
                        }
                      });

                    scene.add(heartInstance)
                    }
                }
            )
        
        console.timeEnd('hearts')
    }
)

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
camera.position.x = -1
camera.position.y = 1
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambientLight)



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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()