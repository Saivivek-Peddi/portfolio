import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shots, type Shot } from '../content/lens'
import { profile } from '../content/profile'
import { Rise } from './Rise'

// Each column drifts at its own speed while the gallery scrolls past.
const DRIFT = [-6, 10, -14]

function Photo({ shot, onOpen }: { shot: Shot; onOpen: () => void }) {
  return (
    <figure className="group">
      <button type="button" onClick={onOpen} className="block w-full cursor-zoom-in overflow-hidden bg-card" aria-label={`Open photo: ${shot.title}`}>
        <picture>
          <source type="image/avif" srcSet={`/lens/${shot.id}.avif`} />
          <img
            src={`/lens/${shot.id}.webp`}
            alt={shot.title}
            width={shot.w}
            height={shot.h}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.04]"
          />
        </picture>
      </button>
      <figcaption className="ui mt-2 text-[0.7rem] text-dim">{shot.title}</figcaption>
    </figure>
  )
}

function Lightbox({ index, onClose, onStep }: { index: number; onClose: () => void; onStep: (d: number) => void }) {
  const shot = shots[index]
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    const html = document.documentElement
    html.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      html.style.overflow = ''
    }
  }, [onClose, onStep])

  return (
    <div role="dialog" aria-modal="true" aria-label={shot.title} className="lightbox fixed inset-0 z-[80] flex flex-col bg-black/95 text-white" onClick={onClose}>
      <div className="ui flex items-center justify-between px-5 py-5 md:px-16" onClick={(e) => e.stopPropagation()}>
        <span>
          {String(index + 1).padStart(2, '0')} / {String(shots.length).padStart(2, '0')} &nbsp; {shot.title}
        </span>
        <button ref={closeRef} type="button" onClick={onClose} className="wipe uppercase">
          Close [esc]
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-5 pb-10 md:px-16">
        <picture key={shot.id} className="lightbox-img contents">
          <source type="image/avif" srcSet={`/lens/${shot.id}.avif`} />
          <img src={`/lens/${shot.id}.webp`} alt={shot.title} className="max-h-full max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
        </picture>
        <button type="button" aria-label="Previous photo" onClick={(e) => (e.stopPropagation(), onStep(-1))} className="ui absolute top-1/2 left-3 -translate-y-1/2 px-3 py-6 hover:text-lime md:left-8">
          &larr;
        </button>
        <button type="button" aria-label="Next photo" onClick={(e) => (e.stopPropagation(), onStep(1))} className="ui absolute top-1/2 right-3 -translate-y-1/2 px-3 py-6 hover:text-lime md:right-8">
          &rarr;
        </button>
      </div>
    </div>
  )
}

export function Lens() {
  const gallery = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const cols = useRef<(HTMLDivElement | null)[]>([])
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const tweens = cols.current.map((col, i) =>
        gsap.fromTo(col, { yPercent: -DRIFT[i] / 2 }, { yPercent: DRIFT[i] / 2, ease: 'none', scrollTrigger: { trigger: gallery.current, start: 'top bottom', end: 'bottom top', scrub: true } }),
      )
      return () => tweens.forEach((t) => t.scrollTrigger?.kill())
    })
    return () => mm.revert()
  }, [])

  // The loop only downloads and plays while on screen.
  useEffect(() => {
    const v = video.current
    if (!v) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !reduced) {
        v.preload = 'auto'
        v.play().catch(() => {})
      } else v.pause()
    })
    io.observe(v)
    return () => io.disconnect()
  }, [])

  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + shots.length) % shots.length)), [])
  const close = useCallback(() => setOpen(null), [])

  const columns = (n: number) => Array.from({ length: n }, (_, c) => shots.map((s, i) => ({ s, i })).filter((_, i) => i % n === c))

  return (
    <section id="lens" aria-labelledby="lens-title">
      <div data-ink="light" className="relative h-[85svh] min-h-[520px] overflow-hidden bg-black text-white">
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          src="/lens/drone.mp4"
          poster="/lens/drone-poster.jpg"
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" aria-hidden />
        <div className="relative flex h-full flex-col justify-end px-5 pb-16 md:px-16">
          <p className="ui text-white/70">Photography</p>
          <h2 id="lens-title" className="shout mt-3 text-[clamp(3rem,10vw,10rem)]">
            <Rise text="Through my lens" />
          </h2>
          <p className="mono mt-5 max-w-[46ch] text-white/75">
            Skies, streets and the occasional bird. Shot on a Canon, graded by hand, and flown by drone when the view calls for it.
          </p>
        </div>
      </div>

      <div ref={gallery} className="overflow-hidden px-5 py-24 md:px-16 md:py-32">
        <div className="hidden grid-cols-3 gap-6 md:grid">
          {columns(3).map((col, c) => (
            <div
              key={c}
              ref={(el) => {
                cols.current[c] = el
              }}
              className={`flex flex-col gap-6 ${c === 1 ? 'pt-24' : ''}`}
            >
              {col.map(({ s, i }) => (
                <Photo key={s.id} shot={s} onOpen={() => setOpen(i)} />
              ))}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 md:hidden">
          {columns(2).map((col, c) => (
            <div key={c} className={`flex flex-col gap-4 ${c === 1 ? 'pt-12' : ''}`}>
              {col.map(({ s, i }) => (
                <Photo key={s.id} shot={s} onOpen={() => setOpen(i)} />
              ))}
            </div>
          ))}
        </div>
        <p className="ui mt-16 text-center">
          <a href={profile.links.instagram} className="wipe">
            More on Instagram @_forgotten_chornicles
          </a>
        </p>
      </div>

      {open !== null && <Lightbox index={open} onClose={close} onStep={step} />}
    </section>
  )
}
