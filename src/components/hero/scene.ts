import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { HELLO_POINTS } from './helloPath'

function bounds(points: [number, number][]) {
  const xs = points.map((p) => p[0])
  const ys = points.map((p) => p[1])
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  return { cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, width: maxX - minX, height: maxY - minY }
}
const BOUNDS = bounds(HELLO_POINTS)

export type Theme = 'light' | 'dark'

export type HeroScene = {
  setTheme: (theme: Theme) => void
  setActive: (active: boolean) => void
  dispose: () => void
}

type Palette = {
  deep: string
  mid: string
  light: string
  bands: number
  softness: number
  grain: number
  glass: string
  attenuation: string
  attenuationDistance: number
  exposure: number
  cursor: string
}

const PALETTES: Record<Theme, Palette> = {
  dark: { deep: '#000114', mid: '#0308ab', light: '#5872ff', bands: 0.75, softness: 1, grain: 0.035, glass: '#e4e9ff', attenuation: '#8fa2ff', attenuationDistance: 3.2, exposure: 1.05, cursor: '#3b74ff' },
  // Light: saturated sky with warm sun bands; the tube is tinted deep blue so it
  // reads against the sky instead of going milky.
  light: { deep: '#9ec8ee', mid: '#c6e2f7', light: '#fff4d8', bands: 0.8, softness: 0.55, grain: 0.012, glass: '#dbe6ff', attenuation: '#4a78f2', attenuationDistance: 1.7, exposure: 1, cursor: '#2f6bff' },
}

const UNITS_PER_PX = 1 / 46
const TUBE_RADIUS = 0.56
const TUBE_SEGMENTS = 900
const RADIAL_SEGMENTS = 40
const WRITE_SECONDS = 2.6
const CAMERA_Z = 16
const FOV = 32

// Soft diagonal bands of light, like sun through blinds shot out of focus.
const BACKGROUND_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uDeep;
  uniform vec3 uMid;
  uniform vec3 uLight;
  uniform float uBands;
  uniform float uSoft;
  uniform float uGrain;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.035;
    vec2 p = uv + (uMouse - 0.5) * 0.04;
    float warp = noise(p * 2.2 + t) * 0.35;
    float d = (p.x * 0.82 + p.y * 0.58) * 5.5 * uSoft + warp;
    float bands = 0.0;
    float lo = mix(0.0, 0.35, uSoft);
    bands += smoothstep(lo, 1.0, sin(d * 3.1 - t * 6.0) * 0.5 + 0.5) * 0.55;
    bands += smoothstep(lo + 0.2, 1.0, sin(d * 5.3 + 1.7 - t * 4.0) * 0.5 + 0.5) * 0.35;
    float vignette = smoothstep(1.15, 0.2, distance(uv, vec2(0.62, 0.58)));
    vec3 col = mix(uDeep, uMid, vignette);
    col = mix(col, uLight, bands * vignette * uBands);
    // Grain goes on after the sRGB conversion so it reads the same in both themes.
    gl_FragColor = linearToOutputTexel(vec4(col, 1.0));
    gl_FragColor.rgb += (hash(uv * 900.0 + uTime) - 0.5) * uGrain;
  }
`

const BACKGROUND_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

function wordCurve(): THREE.CatmullRomCurve3 {
  const { cx, cy } = BOUNDS
  const n = HELLO_POINTS.length
  // A gentle z wave lifts retraced strokes off each other so crossings read in 3D.
  const points = HELLO_POINTS.map(([x, y], i) => {
    const t = i / (n - 1)
    return new THREE.Vector3((x - cx) * UNITS_PER_PX * 2.1, -(y - cy) * UNITS_PER_PX * 2.1, Math.sin(t * Math.PI * 7) * 0.32)
  })
  return new THREE.CatmullRomCurve3(points, false, 'centripetal')
}

function cursorGeometry(): THREE.ExtrudeGeometry {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.lineTo(0, -1.62)
  s.lineTo(0.42, -1.22)
  s.lineTo(0.72, -1.86)
  s.lineTo(0.98, -1.74)
  s.lineTo(0.69, -1.12)
  s.lineTo(1.2, -1.12)
  s.closePath()
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.22,
    bevelEnabled: true,
    bevelThickness: 0.14,
    bevelSize: 0.12,
    bevelSegments: 8,
    curveSegments: 4,
  })
  geo.center()
  return geo
}

function findCusps(curve: THREE.Curve<THREE.Vector3>, samples = 600): number[] {
  const out: number[] = []
  const prev = new THREE.Vector3()
  const cur = new THREE.Vector3()
  curve.getTangentAt(0, prev)
  for (let i = 1; i <= samples; i++) {
    const u = i / samples
    curve.getTangentAt(u, cur)
    if (prev.dot(cur) < 0.2 && (out.length === 0 || u - out[out.length - 1] > 0.01)) out.push(u)
    prev.copy(cur)
  }
  return out
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export function createHeroScene(canvas: HTMLCanvasElement, opts: { theme: Theme; reducedMotion: boolean }): HeroScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
  let pixelRatio = Math.min(window.devicePixelRatio, 1.75)
  renderer.setPixelRatio(pixelRatio)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100)
  camera.position.set(0, 0, CAMERA_Z)

  const pmrem = new THREE.PMREMGenerator(renderer)
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = envTexture

  const bgUniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uDeep: { value: new THREE.Color() },
    uMid: { value: new THREE.Color() },
    uLight: { value: new THREE.Color() },
    uBands: { value: 0.75 },
    uSoft: { value: 1 },
    uGrain: { value: 0.035 },
  }
  const background = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.ShaderMaterial({ uniforms: bgUniforms, vertexShader: BACKGROUND_VERTEX, fragmentShader: BACKGROUND_FRAGMENT, depthWrite: false }),
  )
  background.position.z = -8
  scene.add(background)

  const glass = new THREE.MeshPhysicalMaterial({
    transmission: 0.94,
    thickness: 2.4,
    roughness: 0.16,
    ior: 1.32,
    iridescence: 0.75,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [120, 520],
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    envMapIntensity: 1.25,
    specularIntensity: 1,
  })

  const word = new THREE.Group()
  scene.add(word)

  const curve = wordCurve()
  const tubeGeo = new THREE.TubeGeometry(curve, TUBE_SEGMENTS, TUBE_RADIUS, RADIAL_SEGMENTS, false)
  const tube = new THREE.Mesh(tubeGeo, glass)
  word.add(tube)

  const capGeo = new THREE.SphereGeometry(TUBE_RADIUS, 32, 16)
  const startCap = new THREE.Mesh(capGeo, glass)
  startCap.position.copy(curve.getPointAt(0))
  const tipCap = new THREE.Mesh(capGeo, glass)
  word.add(startCap, tipCap)

  // Where the stroke doubles back on itself the tube's frame flips and leaves a
  // seam; a glass bead at each cusp hides it (revealed as the stroke reaches it).
  const cusps = findCusps(curve).map((u) => {
    const bead = new THREE.Mesh(capGeo, glass)
    bead.position.copy(curve.getPointAt(u))
    bead.visible = false
    word.add(bead)
    return { u, bead }
  })


  const cursorMat = new THREE.MeshPhysicalMaterial({ roughness: 0.22, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08 })
  const cursor = new THREE.Mesh(cursorGeometry(), cursorMat)
  cursor.scale.setScalar(0.62)
  scene.add(cursor)

  const applyTheme = (theme: Theme) => {
    const p = PALETTES[theme]
    bgUniforms.uDeep.value.set(p.deep)
    bgUniforms.uMid.value.set(p.mid)
    bgUniforms.uLight.value.set(p.light)
    bgUniforms.uBands.value = p.bands
    bgUniforms.uSoft.value = p.softness
    bgUniforms.uGrain.value = p.grain
    glass.color.set(p.glass)
    glass.attenuationColor.set(p.attenuation)
    glass.attenuationDistance = p.attenuationDistance
    renderer.toneMappingExposure = p.exposure
    cursorMat.color.set(p.cursor)
  }
  applyTheme(opts.theme)

  // Fit the background plane to the frustum and the word to the viewport width.
  let viewW = 1
  let viewH = 1
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    const depth = CAMERA_Z - background.position.z
    const bgH = 2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * depth
    background.scale.set(bgH * camera.aspect * 1.1, bgH * 1.1, 1)
    viewH = 2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAMERA_Z
    viewW = viewH * camera.aspect
    // Fit the word inside the band between the top copy and the headline, by width and by height.
    const unit = UNITS_PER_PX * 2.1
    const byWidth = ((w < 768 ? 0.9 : 0.56) * viewW) / (BOUNDS.width * unit)
    const byHeight = ((w < 768 ? 0.3 : 0.4) * viewH) / (BOUNDS.height * unit)
    word.scale.setScalar(Math.min(1.25, byWidth, byHeight))
    // Centered horizontally on every screen size.
    word.position.set(0, w < 768 ? viewH * 0.06 : viewH * 0.1, 0)
    // No pointer to follow on touch screens, and no room beside the headline.
    cursor.visible = w >= 768 && matchMedia('(pointer: fine)').matches
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  // Pointer in normalized device coordinates, relative to the canvas.
  const pointer = new THREE.Vector2(0.55, -0.55)
  const pointerTarget = pointer.clone()
  let pointerInside = false
  const onPointerMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect()
    pointerInside = e.clientY >= r.top && e.clientY <= r.bottom
    pointerTarget.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true })

  const restPosition = new THREE.Vector3()
  const cursorTarget = new THREE.Vector3()
  const lastCursor = new THREE.Vector3()

  let active = true
  let raf = 0
  let writeStart = -1
  const clock = new THREE.Clock()
  // Scene time only advances while rendering, so pausing never skips the write-on.
  let elapsed = 0
  const indexCount = tubeGeo.index!.count
  const perSegment = RADIAL_SEGMENTS * 6

  const setWrite = (p: number) => {
    const segments = Math.max(1, Math.floor(p * TUBE_SEGMENTS))
    tubeGeo.setDrawRange(0, Math.min(indexCount, segments * perSegment))
    const u = Math.min(1, segments / TUBE_SEGMENTS)
    tipCap.position.copy(curve.getPointAt(u))
    for (const c of cusps) c.bead.visible = c.u <= u
  }

  const frame = () => {
    raf = requestAnimationFrame(frame)
    elapsed += Math.min(clock.getDelta(), 0.1)
    const t = elapsed

    if (writeStart < 0) writeStart = t
    const w = opts.reducedMotion ? 1 : Math.min(1, (t - writeStart - 0.25) / WRITE_SECONDS)
    setWrite(Math.max(0, easeInOutCubic(Math.max(0, w))))

    pointer.lerp(pointerTarget, 0.06)
    bgUniforms.uTime.value = t
    bgUniforms.uMouse.value.set(pointer.x * 0.5 + 0.5, pointer.y * 0.5 + 0.5)

    const float = opts.reducedMotion ? 0 : Math.sin(t * 0.9) * 0.08
    word.rotation.y = THREE.MathUtils.lerp(word.rotation.y, pointer.x * 0.28, 0.05)
    word.rotation.x = THREE.MathUtils.lerp(word.rotation.x, -pointer.y * 0.18 + float * 0.3, 0.05)

    // The 3D cursor drifts toward the pointer, or rests bottom-right.
    restPosition.set(viewW * 0.36, -viewH * 0.24, 2)
    if (pointerInside) cursorTarget.set((pointerTarget.x * viewW) / 2 + 0.6, (pointerTarget.y * viewH) / 2 - 0.9, 2)
    else cursorTarget.copy(restPosition)
    lastCursor.copy(cursor.position)
    cursor.position.lerp(cursorTarget, 0.075)
    const vx = cursor.position.x - lastCursor.x
    const vy = cursor.position.y - lastCursor.y
    cursor.rotation.z = THREE.MathUtils.lerp(cursor.rotation.z, 0.5 - vx * 0.9, 0.12)
    cursor.rotation.x = THREE.MathUtils.lerp(cursor.rotation.x, -0.35 + vy * 1.2 + float, 0.12)
    cursor.rotation.y = THREE.MathUtils.lerp(cursor.rotation.y, 0.35 + vx * 1.5, 0.12)

    const before = performance.now()
    renderer.render(scene, camera)
    adapt(performance.now() - before)
  }

  // If the device can't keep up, render at a lower resolution; if it still
  // can't, keep the last frame on screen and stop animating.
  let slowFrames = 0
  let frozen = false
  const adapt = (ms: number) => {
    slowFrames = ms > 34 ? slowFrames + 1 : Math.max(0, slowFrames - 1)
    if (slowFrames < 20) return
    slowFrames = 0
    if (pixelRatio > 1) {
      pixelRatio = 1
      renderer.setPixelRatio(pixelRatio)
      resize()
      console.info('[hero] slow frames; dropping to 1x resolution')
    } else {
      frozen = true
      setWrite(1)
      renderer.render(scene, camera)
      stop()
      console.info('[hero] still slow; holding a static frame')
    }
  }

  const start = () => {
    if (!raf && !frozen) {
      clock.getDelta()
      frame()
    }
  }
  const stop = () => {
    cancelAnimationFrame(raf)
    raf = 0
  }
  start()

  const onVisibility = () => (document.hidden || !active ? stop() : start())
  document.addEventListener('visibilitychange', onVisibility)

  return {
    setTheme: applyTheme,
    setActive: (a) => {
      active = a
      onVisibility()
    },
    dispose: () => {
      stop()
      ro.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibility)
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose()
          const m = o.material as THREE.Material | THREE.Material[]
          ;(Array.isArray(m) ? m : [m]).forEach((x) => x.dispose())
        }
      })
      envTexture.dispose()
      pmrem.dispose()
      renderer.dispose()
    },
  }
}
