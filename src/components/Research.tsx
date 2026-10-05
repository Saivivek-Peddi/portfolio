import { useEffect, useRef, useState } from 'react'
import { formatResearchDate, research } from '../content/research'
import { researchPreviews } from '../content/work'
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
        <h2 id="research-title">Research</h2>
        <a href={profile.links.research} className="wipe text-dim">
          All on mlpal.ai ({String(research.length).padStart(2, '0')})
        </a>
      </div>
      <ul onPointerLeave={() => preview.setSrc(null)}>
        {research.map((r) => (
          <li key={r.url} className="border-b border-line">
            <a
              href={r.url}
              onPointerEnter={() => preview.setSrc(researchPreviews[r.url] ?? null)}
              className="group grid grid-cols-12 items-baseline gap-x-4 gap-y-1 py-6 md:py-7"
            >
              <span className="ui col-span-6 text-dim md:col-span-2">{formatResearchDate(r.date)}</span>
              <span className="ui col-span-6 text-right text-dim md:order-last md:col-span-2">{r.kind}</span>
              <span className="col-span-12 text-[clamp(1.35rem,2.4vw,2.2rem)] leading-[1.08] font-[520] tracking-[-0.015em] transition-transform duration-500 ease-out-expo group-hover:translate-x-3 md:col-span-8">
                <span className="bg-[linear-gradient(var(--color-lime),var(--color-lime))] bg-[length:0%_100%] bg-no-repeat transition-[background-size] duration-500 ease-out-expo group-hover:bg-[length:100%_100%] group-hover:text-black">
                  {r.title}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
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
