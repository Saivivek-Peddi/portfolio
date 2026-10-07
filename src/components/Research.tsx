import { useEffect, useRef, useState } from 'react'
import { research, selectedResearch, teaching } from '../content/research'
import { profile } from '../content/profile'

// A preview of the paper floats beside the cursor while a row is hovered.
function useFloatingPreview() {
  const ref = useRef<HTMLDivElement>(null)
  const [src, setSrc] = useState<string | null>(null)
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  // Follow the cursor only while a preview is showing.
  useEffect(() => {
    if (!src) return
    let { x, y } = target.current
    let raf = 0
    const tick = () => {
      x += (target.current.x - x) * 0.14
      y += (target.current.y - y) * 0.14
      if (ref.current) ref.current.style.transform = `translate3d(${x + 28}px, ${y - 90}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [src])

  return { ref, src, setSrc }
}

export function Research() {
  const preview = useFloatingPreview()
  return (
    <section id="research" className="px-5 py-24 md:px-16 md:py-32" aria-labelledby="research-title">
      <div className="ui flex items-baseline justify-between border-b border-line pb-3">
        <h2 id="research-title">Research &amp; teaching</h2>
        <a href={profile.links.research} className="wipe text-dim">
          All mlpal research ({String(research.length).padStart(2, '0')})
        </a>
      </div>
      <div className="grid grid-cols-12 gap-x-4">
        <ul className="col-span-12 lg:col-span-8" onPointerLeave={() => preview.setSrc(null)}>
          {selectedResearch.map((r) => (
            <li key={r.url} className="border-b border-line">
              <a href={r.url} onPointerEnter={() => preview.setSrc(r.preview ?? null)} className="group grid grid-cols-8 items-baseline gap-x-4 gap-y-1 py-6">
                <span className="ui col-span-2 text-dim md:col-span-1">{r.year}</span>
                <span className="col-span-8 text-[clamp(1.3rem,2.2vw,2rem)] leading-[1.08] font-[520] tracking-[-0.015em] transition-transform duration-500 ease-out-expo group-hover:translate-x-3 md:col-span-5">
                  <span className="bg-[linear-gradient(var(--color-lime),var(--color-lime))] bg-[length:0%_100%] bg-no-repeat transition-[background-size] duration-500 ease-out-expo group-hover:bg-[length:100%_100%] group-hover:text-black">
                    {r.title}
                  </span>
                </span>
                <span className="ui col-span-8 text-dim md:col-span-2 md:text-right">{r.venue}</span>
              </a>
            </li>
          ))}
        </ul>
        <aside className="col-span-12 mt-14 lg:col-span-3 lg:col-start-10 lg:mt-6">
          <p className="ui text-dim">Teaching &amp; mentoring</p>
          <ul className="mt-4 space-y-5">
            {teaching.map((t) => (
              <li key={t.what}>
                <p className="text-[1.05rem] leading-snug font-[520]">{t.what}</p>
                <p className="mono text-dim">
                  {t.where}, {t.when}
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
      <div
        ref={preview.ref}
        className={`pointer-events-none fixed top-0 left-0 z-30 hidden w-[340px] overflow-hidden shadow-2xl transition-opacity duration-300 lg:block ${preview.src ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden
      >
        {preview.src && <img src={preview.src} alt="" className="block w-full" />}
      </div>
    </section>
  )
}
