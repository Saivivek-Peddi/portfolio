import { useEffect, useRef, useState } from 'react'
import { profile } from '../content/profile'
import { prefs, usePrefs } from '../lib/prefs'
import { sound } from '../lib/sound'
import { scrollToHash } from './SmoothScroll'

const NAV = [
  { label: 'Story', href: '/#story' },
  { label: 'Built', href: '/#built' },
  { label: 'Life', href: '/#life' },
  { label: 'Lens', href: '/#lens' },
  { label: 'Writing', href: '/#writing' },
]

const MOUNTAIN_VIEW = { lat: 37.39, lon: -122.08 }

function navigate(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  const url = new URL(href, location.href)
  if (url.pathname === location.pathname && url.hash && scrollToHash(url.hash)) {
    e.preventDefault()
    history.replaceState(null, '', url.hash)
  }
}

function useLocalTime() {
  const [label, setLabel] = useState('')
  useEffect(() => {
    const tz = profile.timeZone
    const fmt = () => {
      const now = new Date()
      const time = now.toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit' })
      const offset =
        new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' })
          .formatToParts(now)
          .find((p) => p.type === 'timeZoneName')?.value ?? ''
      setLabel(`${offset} US ${time}`)
    }
    fmt()
    const id = window.setInterval(fmt, 20_000)
    return () => clearInterval(id)
  }, [])
  return label
}

const WEATHER_TIMEOUT_MS = 4000

function useTemperature() {
  const [temp, setTemp] = useState<number | null>(null)
  useEffect(() => {
    const ctrl = new AbortController()
    let timedOut = false
    // Give up after 4 s: the status bar then shows the time without a temperature.
    const timer = window.setTimeout(() => {
      timedOut = true
      ctrl.abort()
    }, WEATHER_TIMEOUT_MS)
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${MOUNTAIN_VIEW.lat}&longitude=${MOUNTAIN_VIEW.lon}&current=temperature_2m`,
      { signal: ctrl.signal },
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d) => setTemp(Math.round(d.current.temperature_2m)))
      .catch((e) => {
        if (timedOut) console.warn(`[status] weather timed out after ${WEATHER_TIMEOUT_MS} ms`)
        else if (e.name !== 'AbortError') console.warn('[status] weather unavailable:', e.message)
      })
      .finally(() => clearTimeout(timer))
    return () => {
      clearTimeout(timer)
      ctrl.abort()
    }
  }, [])
  return temp
}

function Coordinates() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const pad = (n: number) => String(Math.round(n)).padStart(4, '0')
    const onMove = (e: PointerEvent) => {
      if (ref.current) ref.current.textContent = `${pad(e.clientX)} X ${pad(e.clientY)} Y`
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  return (
    <span ref={ref} className="tabular-nums" aria-hidden>
      0000 X 0000 Y
    </span>
  )
}

function Globe() {
  return (
    <svg viewBox="0 0 40 24" className="h-5 w-8" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden>
      <ellipse cx="20" cy="12" rx="18" ry="10.5" />
      <path d="M2 12h36M5 6.5h30M5 17.5h30" />
      <ellipse className="globe-spin" cx="20" cy="12" rx="9" ry="10.5" />
      <ellipse className="globe-spin globe-spin-2" cx="20" cy="12" rx="9" ry="10.5" />
    </svg>
  )
}

type Ink = 'theme' | 'light'

// Which ink to use for a bar: sections marked data-ink="light" (black
// backgrounds) force white text regardless of theme.
function inkAt(overlay: HTMLElement, x: number, y: number): Ink {
  const hit = document.elementsFromPoint(x, y).find((el) => !overlay.contains(el))
  return hit?.closest('[data-ink="light"]') ? 'light' : 'theme'
}

function useInk(overlay: React.RefObject<HTMLDivElement | null>) {
  const [ink, setInk] = useState<{ top: Ink; bottom: Ink }>({ top: 'theme', bottom: 'theme' })
  useEffect(() => {
    let raf = 0
    const check = () => {
      raf = 0
      const el = overlay.current
      if (!el) return
      const x = window.innerWidth / 2
      const next = { top: inkAt(el, x, 40), bottom: inkAt(el, x, window.innerHeight - 30) }
      setInk((cur) => (cur.top === next.top && cur.bottom === next.bottom ? cur : next))
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    check()
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(raf)
    }
  }, [overlay])
  return ink
}

const inkClass = (ink: Ink) => (ink === 'light' ? 'text-white' : 'text-fg')

export function Overlay() {
  const overlay = useRef<HTMLDivElement>(null)
  const ink = useInk(overlay)
  const { pref, sound: soundOn } = usePrefs()
  const time = useLocalTime()
  const temp = useTemperature()
  const themeGlyph = { auto: 'A', light: 'L', dark: 'D' }[pref]

  return (
    <div ref={overlay} className="pointer-events-none fixed inset-0 z-40 flex flex-col justify-between">
      <header className={`pointer-events-auto flex items-start justify-between px-5 pt-5 transition-colors duration-300 md:px-16 md:pt-9 ${inkClass(ink.top)}`}>
        <a href="/" className="text-[0.95rem] font-bold uppercase tracking-tight">
          Sai Vivek Peddi
        </a>
        <nav aria-label="Primary" className="ui flex items-center gap-6 md:gap-14">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={(e) => navigate(e, n.href)}
              className="wipe hidden sm:inline"
            >
              {n.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              prefs.cycleTheme()
              sound.chime()
            }}
            className="wipe uppercase" aria-label={`Theme: ${pref}. Change theme`}>
            Theme[{themeGlyph}]
          </button>
          <button
            type="button"
            onClick={() => {
              prefs.toggleSound()
              sound.sync()
            }}
            className="wipe hidden uppercase md:inline"
            aria-pressed={soundOn}
          >
            Sound[<span className={soundOn ? 'sound-on' : ''}>{soundOn ? '|' : ' '}</span>]
          </button>
        </nav>
      </header>
      <footer className={`ui flex items-end justify-between px-5 pb-5 normal-case transition-colors duration-300 md:px-16 md:pb-8 ${inkClass(ink.bottom)}`}>
        <span className="uppercase">
          {time}
          {temp !== null && ` ${temp}°C`}
        </span>
        <span className="hidden md:inline">
          <Coordinates />
        </span>
        <Globe />
      </footer>
    </div>
  )
}
