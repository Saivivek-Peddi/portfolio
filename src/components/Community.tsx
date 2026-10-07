import { useEffect, useRef } from 'react'
import { useInView } from './useInView'
import { profile } from '../content/profile'
import { Rise } from './Rise'

const BITSIANS = 11_000

// Counts up once when the number scrolls into view.
function CountUp({ to, play }: { to: number; play: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !play) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const start = performance.now()
    const dur = 1800
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur)
      const eased = 1 - Math.pow(1 - t, 4)
      el.textContent = Math.round(eased * to).toLocaleString('en-US')
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, play])
  return (
    <span ref={ref} className="tabular-nums">
      {to.toLocaleString('en-US')}
    </span>
  )
}

export function Community() {
  const [ref, inView] = useInView<HTMLElement>()
  return (
    <section id="community" ref={ref} className="grid grid-cols-12 gap-x-4 px-5 py-24 md:px-16 md:py-36" aria-labelledby="community-title">
      <div className="ui col-span-12 flex items-baseline justify-between border-b border-line pb-3">
        <h2 id="community-title">Community</h2>
        <a href={profile.links.bitsaa} className="wipe text-dim">
          BITS Pilani Alumni Association, Silicon Valley
        </a>
      </div>
      <p className="shout col-span-12 mt-12 text-[clamp(4.5rem,17vw,17rem)] leading-[0.85] text-cobalt dark:text-lime">
        <CountUp to={BITSIANS} play={inView} />
      </p>
      <p className="ui col-span-12 mt-3 text-dim">BITSians in the Bay Area</p>
      <div className="col-span-12 mt-12 md:col-span-7 md:col-start-6">
        <p className="text-[clamp(1.5rem,2.6vw,2.5rem)] leading-[1.1] font-[440] tracking-[-0.015em]">
          <Rise text="I co-lead the BITS Pilani Alumni Association in the Bay Area as its COO. We're a registered nonprofit, and we run events all year to bring this community together." />
        </p>
        <p className="mono mt-6 max-w-[52ch] text-dim">
          Lots of events, one goal: keep the BITS spirit alive a long way from campus.
        </p>
        <p className="mt-8 text-[1.05rem]">
          Want to learn more or see upcoming events? Find us on Instagram:{' '}
          <a href={profile.links.bitsaa} className="text-fg underline decoration-1 underline-offset-[0.15em] hover:bg-lime hover:text-black">
            @bitsaa.svc
          </a>
        </p>
      </div>
    </section>
  )
}
