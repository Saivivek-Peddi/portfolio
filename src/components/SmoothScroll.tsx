import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let lenis: Lenis | null = null

export function scrollToHash(hash: string): boolean {
  const el = document.querySelector<HTMLElement>(hash)
  if (!el) return false
  if (lenis) lenis.scrollTo(el, { duration: 1.4 })
  else el.scrollIntoView({ block: 'start' })
  return true
}

// Lenis driven by GSAP's ticker, so ScrollTrigger and smooth scroll share one
// clock. Skipped entirely for reduced motion.
export function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    lenis = new Lenis({ lerp: 0.1, anchors: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis?.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis?.destroy()
      lenis = null
    }
  }, [])
  return null
}
