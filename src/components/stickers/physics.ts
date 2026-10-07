import Matter from 'matter-js'
import { STICKERS } from './art'
import { sound } from '../../lib/sound'

export type StickerField = {
  burst: (clientX: number, clientY: number, count?: number) => void
  setActive: (active: boolean) => void
  dispose: () => void
}

const MAX_STICKERS = 64
const WALL = 200

type Sprite = { body: Matter.Body; image: HTMLImageElement; size: number }

function loadImages(): Promise<HTMLImageElement[]> {
  return Promise.all(
    STICKERS.map(
      (s) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve(img)
          img.onerror = () => reject(new Error(`sticker ${s.id} failed to rasterize`))
          img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(s.svg)}`
        }),
    ),
  )
}

// A canvas of die-cut stickers with real physics. Clicking empty space bursts
// new stickers; pressing on a sticker picks it up so it can be thrown.
export async function createStickerField(canvas: HTMLCanvasElement, host: HTMLElement): Promise<StickerField> {
  const images = await loadImages()
  const ctx = canvas.getContext('2d')!
  const engine = Matter.Engine.create({ gravity: { x: 0, y: 1.15 }, enableSleeping: true })
  const sprites: Sprite[] = []
  let width = 0
  let height = 0
  let dpr = 1
  let walls: Matter.Body[] = []
  let next = Math.floor(Math.random() * images.length)

  const layout = () => {
    const r = host.getBoundingClientRect()
    width = r.width
    height = r.height
    dpr = Math.min(window.devicePixelRatio, 2)
    canvas.width = width * dpr
    canvas.height = height * dpr
    Matter.Composite.remove(engine.world, walls)
    const opts = { isStatic: true, friction: 0.6, restitution: 0.2 }
    walls = [
      Matter.Bodies.rectangle(width / 2, height + WALL / 2, width * 3, WALL, opts),
      Matter.Bodies.rectangle(-WALL / 2, height / 2 - height, WALL, height * 4, opts),
      Matter.Bodies.rectangle(width + WALL / 2, height / 2 - height, WALL, height * 4, opts),
    ]
    Matter.Composite.add(engine.world, walls)
  }
  layout()
  const ro = new ResizeObserver(layout)
  ro.observe(host)

  const stickerSize = () => (width < 768 ? 64 : 96)

  const add = (x: number, y: number) => {
    const size = stickerSize() * (0.85 + Math.random() * 0.35)
    const body = Matter.Bodies.circle(x, y, size * 0.4, {
      restitution: 0.45,
      friction: 0.3,
      frictionAir: 0.012,
      density: 0.0015,
      angle: (Math.random() - 0.5) * 1.2,
    })
    Matter.Body.setVelocity(body, { x: (Math.random() - 0.5) * 18, y: -6 - Math.random() * 10 })
    Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.35)
    Matter.Composite.add(engine.world, body)
    sprites.push({ body, image: images[next++ % images.length], size })
    if (sprites.length > MAX_STICKERS) {
      const old = sprites.shift()!
      Matter.Composite.remove(engine.world, old.body)
    }
  }

  // Dragging: a spring from the grabbed sticker to the pointer.
  let grab: Matter.Constraint | null = null
  const toLocal = (clientX: number, clientY: number) => {
    const r = host.getBoundingClientRect()
    return { x: clientX - r.left, y: clientY - r.top }
  }
  const onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest('a,button')) return
    const p = toLocal(e.clientX, e.clientY)
    const hit = Matter.Query.point(
      sprites.map((s) => s.body),
      p,
    )[0]
    if (hit) {
      Matter.Sleeping.set(hit, false)
      grab = Matter.Constraint.create({ pointA: p, bodyB: hit, pointB: { x: 0, y: 0 }, stiffness: 0.12, damping: 0.08, length: 0 })
      Matter.Composite.add(engine.world, grab)
      host.setPointerCapture(e.pointerId)
      e.preventDefault()
    } else {
      burst(e.clientX, e.clientY)
    }
  }
  const onPointerMove = (e: PointerEvent) => {
    if (grab) grab.pointA = toLocal(e.clientX, e.clientY)
  }
  const onPointerUp = () => {
    if (grab) Matter.Composite.remove(engine.world, grab)
    grab = null
  }
  host.addEventListener('pointerdown', onPointerDown)
  host.addEventListener('pointermove', onPointerMove)
  host.addEventListener('pointerup', onPointerUp)
  host.addEventListener('pointercancel', onPointerUp)

  Matter.Events.on(engine, 'collisionStart', (ev) => {
    const hard = ev.pairs.find((p) => p.collision.depth > 4)
    if (hard) sound.thud(hard.collision.depth)
  })

  const burst = (clientX: number, clientY: number, count = 5) => {
    const p = toLocal(clientX, clientY)
    for (let i = 0; i < count; i++) add(p.x + (Math.random() - 0.5) * 30, p.y + (Math.random() - 0.5) * 30)
    sound.pop()
  }

  let raf = 0
  let settled = false
  let last = performance.now()
  const draw = (now: number) => {
    raf = requestAnimationFrame(draw)
    const dt = Math.min(now - last, 32)
    last = now
    if (sprites.length === 0) return
    Matter.Engine.update(engine, dt)
    // Once everything has come to rest, stop repainting until something moves.
    if (!grab && sprites.every((sp) => sp.body.isSleeping)) {
      if (settled) return
      settled = true
    } else {
      settled = false
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)
    for (const s of sprites) {
      const { x, y } = s.body.position
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(s.body.angle)
      ctx.drawImage(s.image, -s.size / 2, -s.size / 2, s.size, s.size)
      ctx.restore()
    }
  }
  const start = () => {
    if (raf) return
    last = performance.now()
    raf = requestAnimationFrame(draw)
  }
  const stop = () => {
    cancelAnimationFrame(raf)
    raf = 0
  }
  start()

  return {
    burst,
    setActive: (active) => (active ? start() : stop()),
    dispose: () => {
      stop()
      ro.disconnect()
      host.removeEventListener('pointerdown', onPointerDown)
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerup', onPointerUp)
      host.removeEventListener('pointercancel', onPointerUp)
      Matter.Engine.clear(engine)
    },
  }
}

