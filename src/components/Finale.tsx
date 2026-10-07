import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { beliefs } from '../content/life'
import { Rise } from './Rise'

const COLORS = ['#5cf2ff', '#3a6bff', '#8a5cff', '#ffffff', '#20d7ff', '#3a6bff']
const STARS = 640

type Star = { a: number; d: number; v: number; c: string; w: number }

function spawn(near = false): Star {
  return {
    a: Math.random() * Math.PI * 2,
    d: near ? Math.random() * 1.2 : 0.02 + Math.random() * 0.12,
    v: 0.4 + Math.random() * 0.9,
    c: COLORS[Math.floor(Math.random() * COLORS.length)],
    w: 1 + Math.random() * 1.6,
  }
}

// Lines streaming out of the center, faster while you scroll.
function useWarp(canvasRef: React.RefObject<HTMLCanvasElement | null>, active: boolean, boost: React.RefObject<number>) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !active) return
    const ctx = canvas.getContext('2d')!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const stars = Array.from({ length: STARS }, () => spawn(true))
    let raf = 0
    let last = performance.now()
    const fit = () => {
      const dpr = Math.min(devicePixelRatio, 2)
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
    }
    fit()
    window.addEventListener('resize', fit)

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const { width: w, height: h } = canvas
      const cx = w / 2
      const cy = h / 2
      const reach = Math.hypot(cx, cy)
      const speed = reduced ? 0 : 0.55 + (boost.current ?? 0)
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, w, h)
      ctx.lineCap = 'round'
      for (const s of stars) {
        s.d *= 1 + s.v * speed * dt * 1.6
        if (s.d > 1.25) Object.assign(s, spawn())
        const r0 = s.d * reach
        const r1 = r0 * (1 + 0.08 + speed * 0.12 * s.v)
        const cos = Math.cos(s.a)
        const sin = Math.sin(s.a)
        ctx.strokeStyle = s.c
        ctx.globalAlpha = Math.min(1, s.d * 2.2)
        ctx.lineWidth = s.w * (0.6 + s.d) * (w / canvas.clientWidth)
        ctx.beginPath()
        ctx.moveTo(cx + cos * r0, cy + sin * r0)
        ctx.lineTo(cx + cos * r1, cy + sin * r1)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', fit)
    }
  }, [canvasRef, active, boost])
}

export function Finale() {
  const section = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const boost = useRef(0)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = section.current
    if (!el) return
    gsap.registerPlugin(ScrollTrigger)
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => setActive(self.isActive),
      onUpdate: (self) => {
        boost.current = Math.min(3, Math.abs(self.getVelocity()) / 900)
      },
    })
    const decay = () => {
      boost.current *= 0.94
    }
    gsap.ticker.add(decay)
    return () => {
      st.kill()
      gsap.ticker.remove(decay)
    }
  }, [])

  useWarp(canvas, active, boost)

  // One quote, whole, on one screen. No pinning: the page keeps scrolling.
  return (
    <section ref={section} data-ink="light" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-black text-white" aria-label="Closing quote">
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />
      <figure className="relative px-5 text-center">
        <blockquote className="mx-auto max-w-[19ch] text-[clamp(2rem,4.8vw,4.6rem)] leading-[1.05] font-[620] tracking-[-0.02em] text-balance">
          <Rise text={beliefs.churchill} />
        </blockquote>
        <figcaption className="ui mt-8 text-white/60">Winston Churchill</figcaption>
      </figure>
    </section>
  )
}
