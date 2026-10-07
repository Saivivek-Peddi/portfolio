import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { chapters } from '../content/story'

// Chapters scroll sideways while the section is pinned (desktop). On small
// screens or with reduced motion they simply stack.
export function Story() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = section.current
    const rail = track.current
    if (!el || !rail) return
    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => rail.scrollWidth - window.innerWidth
      const tween = gsap.to(rail, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`
          },
        },
      })
      return () => tween.scrollTrigger?.kill()
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="story" ref={section} className="relative overflow-hidden py-24 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0" aria-labelledby="story-title">
      <div className="ui flex items-baseline justify-between px-5 md:px-16">
        <h2 id="story-title">The story so far</h2>
        <span className="text-dim">Hyderabad &rarr; Mountain View</span>
      </div>

      <div ref={track} className="mt-12 flex flex-col gap-14 px-5 md:px-16 lg:mt-16 lg:w-max lg:flex-row lg:gap-0">
        {chapters.map((c, i) => (
          <article key={c.place} className="relative lg:w-[38vw] lg:border-l lg:border-line lg:pr-16 lg:pl-8 lg:first:border-l-0 lg:first:pl-0">
            <p className="ui text-dim">
              {String(i + 1).padStart(2, '0')} / {c.place}
            </p>
            <p className="shout mt-4 text-[clamp(4rem,9vw,9.5rem)]">{c.when}</p>
            <p className="mt-6 max-w-[26ch] text-[clamp(1.35rem,1.9vw,1.9rem)] leading-[1.15] font-[450] tracking-[-0.01em]">{c.line}</p>
            <p className="mono mt-4 max-w-[40ch] text-dim">{c.detail}</p>
          </article>
        ))}
        <div className="hidden lg:block lg:w-[16vw]" aria-hidden />
      </div>

      <div className="mx-5 mt-14 hidden h-px bg-line md:mx-16 lg:block" aria-hidden>
        <div ref={bar} className="h-px origin-left scale-x-0 bg-fg" />
      </div>
    </section>
  )
}
