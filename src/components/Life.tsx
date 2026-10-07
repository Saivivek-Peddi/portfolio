import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { life } from '../content/life'
import { sound } from '../lib/sound'
import { useInView } from './useInView'

function Tile({ label, className = '', children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div className={`relative col-span-12 flex min-h-[320px] flex-col overflow-hidden bg-card p-5 md:p-7 ${className}`}>
      <p className="ui text-dim">{label}</p>
      {children}
    </div>
  )
}

/* ---------- Badminton: keep the rally going ---------- */

const GRAVITY = 1500
const HIT_RADIUS = 90

function Shuttle() {
  return (
    <svg viewBox="0 0 40 64" className="h-16 w-10" aria-hidden>
      <path d="M6 4 L34 4 L26 40 L14 40 Z" fill="#f4f4ef" stroke="#0b0b0b" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 4 L17 40 M20 4 L20 40 M28 4 L23 40 M8 16 H32 M10 28 H30" stroke="#0b0b0b" strokeWidth="1" opacity="0.45" />
      <path d="M13 40 H27 V46 a7 7 0 0 1 -14 0 Z" fill="var(--color-lime)" stroke="#0b0b0b" strokeWidth="1.5" />
    </svg>
  )
}

function Badminton() {
  const court = useRef<HTMLDivElement>(null)
  const shuttle = useRef<HTMLDivElement>(null)
  const state = useRef({ x: 0, y: 0, vx: 0, vy: 0, flying: false })
  const raf = useRef(0)
  const rallyRef = useRef(0)
  const [rally, setRally] = useState(0)
  const [best, setBest] = useState(0)

  const floor = () => (court.current?.clientHeight ?? 300) - 70
  const place = () => {
    const s = state.current
    const angle = s.flying ? (Math.atan2(s.vy, s.vx) * 180) / Math.PI - 90 : 0
    if (shuttle.current) shuttle.current.style.transform = `translate3d(${s.x - 20}px, ${s.y}px, 0) rotate(${angle + 180}deg)`
  }

  useEffect(() => {
    const s = state.current
    s.x = (court.current?.clientWidth ?? 400) / 2
    s.y = floor()
    place()
    return () => cancelAnimationFrame(raf.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loop = (last: number) => (now: number) => {
    const s = state.current
    const dt = Math.min((now - last) / 1000, 0.033)
    const w = court.current?.clientWidth ?? 400
    s.vy += GRAVITY * dt
    s.vx *= 0.992
    s.vy *= 0.992
    s.x += s.vx * dt
    s.y += s.vy * dt
    if (s.x < 20 || s.x > w - 20) {
      s.vx *= -0.6
      s.x = Math.min(w - 20, Math.max(20, s.x))
    }
    if (s.y >= floor()) {
      s.y = floor()
      s.flying = false
      place()
      setBest((b) => Math.max(b, rallyRef.current))
      rallyRef.current = 0
      setRally(0)
      return
    }
    place()
    raf.current = requestAnimationFrame(loop(now))
  }

  const hit = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = court.current!.getBoundingClientRect()
    const px = e.clientX - r.left
    const py = e.clientY - r.top
    const s = state.current
    if (Math.hypot(px - s.x, py - (s.y + 30)) > HIT_RADIUS) return
    // Launch so the arc peaks inside the court: v = sqrt(2gh).
    s.vy = -Math.sqrt(2 * GRAVITY * Math.max(60, s.y - 20)) * (0.8 + Math.random() * 0.2)
    s.vx = (s.x - px) * 7 + (Math.random() - 0.5) * 260
    sound.pop()
    rallyRef.current += 1
    setRally(rallyRef.current)
    if (!s.flying) {
      s.flying = true
      raf.current = requestAnimationFrame(loop(performance.now()))
    }
  }

  return (
    <Tile label="Badminton" className="md:col-span-7">
      <p className="mt-3 max-w-[30ch] text-[1.6rem] leading-[1.1] font-[500] tracking-[-0.015em]">{life.badminton.line}</p>
      <p className="ui mt-2 text-dim">
        Tap the shuttle. Rally {rally} &middot; Best {best}
      </p>
      <div ref={court} onPointerDown={hit} className="relative mt-4 min-h-[240px] flex-1 cursor-pointer touch-none select-none" role="application" aria-label="Badminton mini-game: tap the shuttlecock to keep the rally going">
        <div className="absolute inset-x-0 bottom-6 h-px bg-line" aria-hidden />
        <div className="absolute bottom-6 left-1/2 h-16 w-px -translate-x-1/2 bg-line" aria-hidden />
        <div ref={shuttle} className="absolute top-0 left-0 will-change-transform">
          <Shuttle />
        </div>
      </div>
    </Tile>
  )
}

/* ---------- Cricket: the helicopter shot ---------- */

function Cricket() {
  const [swing, setSwing] = useState(0)
  return (
    <Tile label="Cricket" className="md:col-span-5">
      <div className="relative mt-3 flex-1">
        <p className="ui text-dim">Dhoni</p>
        <p className="shout text-[9rem] leading-[0.8] text-transparent [-webkit-text-stroke:2px_var(--fg)]">{life.cricket.jersey}</p>
        <svg key={swing} viewBox="0 0 120 120" className={`absolute top-2 right-0 h-36 w-36 ${swing ? 'helicopter' : ''}`} aria-hidden>
          <g transform="rotate(-35 60 60)">
            <rect x="54" y="8" width="12" height="30" rx="5" fill="var(--fg)" />
            <rect x="48" y="36" width="24" height="70" rx="7" fill="#e7c48a" stroke="var(--fg)" strokeWidth="2" />
          </g>
        </svg>
        {swing > 0 && <span key={`ball-${swing}`} className="sixer absolute right-16 bottom-10 h-5 w-5 rounded-full bg-[#d7263d]" aria-hidden />}
      </div>
      <ul className="mt-4 space-y-1 text-[1.05rem]">
        {life.cricket.lines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => {
          setSwing((n) => n + 1)
          sound.pop()
        }}
        className="ui mt-4 self-start bg-fg px-3 py-1.5 text-bg transition-transform hover:-translate-y-0.5"
      >
        Play the helicopter shot
      </button>
    </Tile>
  )
}

/* ---------- Kitchen ---------- */

function Kitchen() {
  return (
    <Tile label="Kitchen" className="group md:col-span-4">
      <svg viewBox="0 0 200 110" className="mt-4 h-28 w-full" aria-hidden>
        <path className="steam" d="M70 28c-8-10 8-14 0-24M100 24c-8-10 8-14 0-24M130 28c-8-10 8-14 0-24" fill="none" stroke="var(--fg)" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
        <g className="proof">
          <path d="M30 96c-6-40 24-60 70-60s76 20 70 60z" fill="#d9a35b" stroke="var(--fg)" strokeWidth="2.5" />
          <path d="M66 52c8 8 8 20 0 30M100 48c8 8 8 22 0 34M134 52c8 8 8 20 0 30" fill="none" stroke="#9c6526" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>
      <ul className="mt-auto space-y-1 text-[1.05rem]">
        {life.kitchen.lines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </Tile>
  )
}

/* ---------- Music ---------- */

function Music() {
  const [ref, inView] = useInView<HTMLDivElement>()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (!inView) return
    const id = window.setInterval(() => setI((n) => (n + 1) % life.music.playing.length), 2400)
    return () => clearInterval(id)
  }, [inView])
  return (
    <div ref={ref} className="col-span-12 flex md:col-span-5">
      <Tile label="Music" className="w-full">
        <p className="mt-3 text-[1.6rem] leading-[1.1] font-[500] tracking-[-0.015em]">&ldquo;{life.music.quote}&rdquo;</p>
        <p className="mono mt-3 text-dim">{life.music.note}</p>
        <div className="mt-auto flex items-end gap-4 pt-6">
          <div className="flex h-10 items-end gap-1" aria-hidden>
            {[0, 1, 2, 3, 4].map((b) => (
              <span key={b} className="eq w-1.5 bg-lime" style={{ animationDelay: `${b * -230}ms` }} />
            ))}
          </div>
          <div>
            <p className="ui text-dim">On repeat</p>
            <p key={i} className="track text-[1.3rem] font-[560]" aria-live="off">
              {life.music.playing[i]}
            </p>
          </div>
        </div>
      </Tile>
    </div>
  )
}

/* ---------- Books ---------- */

function Books() {
  const { finished, favorite } = life.books
  const [bumped, setBumped] = useState(false)
  return (
    <Tile label="Books" className="md:col-span-3">
      <div className="mt-4 flex flex-1 flex-col gap-3">
        <div className="bg-fg p-3 text-bg">
          <p className="ui text-[0.65rem] opacity-60">{finished.note}</p>
          <p className="mt-1 text-[1.05rem] leading-tight font-[600]">{finished.title}</p>
          <p className="mono text-[0.72rem] opacity-60">{finished.author}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setBumped(true)
            sound.chord()
          }}
          className="group bg-lime p-3 text-left text-black"
          aria-label={`${favorite.title} by ${favorite.author}. ${favorite.note}`}
        >
          <p className="ui text-[0.65rem] opacity-60">Recent favorite</p>
          <p className="mt-1 text-[1.05rem] leading-tight font-[600]">{favorite.title}</p>
          <p className="mono text-[0.72rem] opacity-60">{favorite.author}</p>
          <p className="mono mt-2 text-[0.8rem]">{bumped ? 'Fist my bump. ♪♫♪' : 'Rocky is love.'}</p>
        </button>
      </div>
    </Tile>
  )
}

export function Life() {
  return (
    <section id="life" className="px-5 py-24 md:px-16 md:py-32" aria-labelledby="life-title">
      <div className="ui flex items-baseline justify-between border-b border-line pb-3">
        <h2 id="life-title">Off the clock</h2>
        <span className="text-dim">Courts, kitchen, headphones</span>
      </div>
      <div className="mt-12 grid grid-cols-12 gap-4">
        <Badminton />
        <Cricket />
        <Kitchen />
        <Music />
        <Books />
      </div>
    </section>
  )
}
