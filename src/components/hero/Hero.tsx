import { useEffect, useRef, useState } from 'react'
import { usePrefs } from '../../lib/prefs'
import { Rise } from '../Rise'
import type { HeroScene } from './scene'
import type { StickerField } from '../stickers/physics'

type GlSupport = 'ok' | 'none' | 'software'

// Software rasterizers (no GPU) can't run the glass shader at interactive rates.
function webglSupport(): GlSupport {
  try {
    const gl = document.createElement('canvas').getContext('webgl2')
    if (!gl) return 'none'
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : ''
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return /swiftshader|llvmpipe|softpipe|software/i.test(renderer) ? 'software' : 'ok'
  } catch {
    return 'none'
  }
}

// Hairline column guides with + marks where they cross the row lines.
function Guides() {
  const cols = [0, 1 / 3, 2 / 3, 1]
  const rows = [1 / 3, 2 / 3]
  return (
    <div className="pointer-events-none absolute inset-y-0 right-5 left-5 hidden md:right-16 md:left-16 md:block" aria-hidden>
      {cols.map((c) => (
        <span key={c} className="absolute inset-y-0 w-px bg-fg/10" style={{ left: `${c * 100}%` }} />
      ))}
      {rows.flatMap((r) =>
        cols.map((c) => (
          <span key={`${r}-${c}`} className="absolute -translate-x-1/2 -translate-y-1/2 text-[0.8rem] leading-none text-fg/45" style={{ left: `${c * 100}%`, top: `${r * 100}%` }}>
            +
          </span>
        )),
      )}
      {rows.map((r) => (
        <span key={r} className="absolute inset-x-0 h-px bg-fg/10" style={{ top: `${r * 100}%` }} />
      ))}
    </div>
  )
}

export function Hero() {
  const { theme } = usePrefs()
  const section = useRef<HTMLElement>(null)
  const glCanvas = useRef<HTMLCanvasElement>(null)
  const stickerCanvas = useRef<HTMLCanvasElement>(null)
  const scene = useRef<HeroScene | null>(null)
  const stickers = useRef<StickerField | null>(null)
  const [glReady, setGlReady] = useState(false)

  useEffect(() => {
    const host = section.current
    if (!host || !glCanvas.current || !stickerCanvas.current) return
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
    let disposed = false
    const initialTheme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'

    const support = webglSupport()
    if (support === 'ok') {
      import('./scene')
        .then(({ createHeroScene }) => {
          if (disposed || !glCanvas.current) return
          scene.current = createHeroScene(glCanvas.current, { theme: initialTheme, reducedMotion })
          setGlReady(true)
        })
        .catch((e) => console.warn('[hero] 3D scene failed; keeping the static backdrop', e))
    } else {
      console.info(`[hero] WebGL ${support}; keeping the static backdrop`)
    }

    let dropTimer = 0
    import('../stickers/physics')
      .then(({ createStickerField }) => createStickerField(stickerCanvas.current!, host))
      .then((field) => {
        if (disposed) return field.dispose()
        stickers.current = field
        if (!reducedMotion) {
          // A first handful of stickers drops in after the word is written.
          dropTimer = window.setTimeout(() => {
            const r = host.getBoundingClientRect()
            field.burst(r.left + r.width * 0.72, r.top + r.height * 0.18, 6)
          }, 3400)
        }
      })
      .catch((e) => console.error('[hero] stickers failed to load', e))

    const io = new IntersectionObserver(([entry]) => {
      scene.current?.setActive(entry.isIntersecting)
      stickers.current?.setActive(entry.isIntersecting)
    })
    io.observe(host)

    return () => {
      disposed = true
      clearTimeout(dropTimer)
      io.disconnect()
      scene.current?.dispose()
      stickers.current?.dispose()
      scene.current = null
      stickers.current = null
    }
  }, [])

  useEffect(() => {
    scene.current?.setTheme(theme)
  }, [theme, glReady])

  return (
    <section
      ref={section}
      className="hero-backdrop relative h-[100svh] min-h-[600px] cursor-crosshair overflow-hidden select-none"
      aria-labelledby="hero-title"
    >
      <canvas
        ref={glCanvas}
        className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${glReady ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden
      />
      <Guides />

      <div className="relative z-10 grid h-full grid-cols-12 grid-rows-[auto_1fr_auto] gap-x-4 px-5 pt-24 pb-20 md:px-16 md:pt-28 md:pb-24">
        <p className="col-span-12 text-[1.65rem] leading-[1.1] font-[450] md:col-span-4 md:text-[2rem]">
          <Rise text={'Founder,\nmlpal'} />
        </p>
        <p className="mono col-span-6 mt-6 hidden md:col-span-4 md:mt-1 md:block">
          Thinking in loops.
          <br />
          Shipping with evals.
        </p>
        <p className="mono col-span-12 mt-4 max-w-[46ch] md:col-span-4 md:mt-1">
          I&rsquo;m Sai Vivek Peddi. I build mlpal: a model gateway, a tunable harness and governed memory that companies
          own, and that gets better against their own evals.
        </p>

        <div className="col-span-12 row-start-3 flex items-end justify-between gap-6">
          <h1 id="hero-title" className="shout text-[clamp(2.6rem,6.4vw,6.4rem)]">
            <Rise text={'I build the loop\naround the model'} delay={2} />
          </h1>
          <p className="ui mb-2 hidden shrink-0 text-fg/60 lg:block">[ Click anywhere ]</p>
        </div>
      </div>

      <canvas ref={stickerCanvas} className="pointer-events-none absolute inset-0 z-20 h-full w-full" aria-hidden />
    </section>
  )
}
