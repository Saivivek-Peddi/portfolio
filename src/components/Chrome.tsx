import { useEffect, type ReactNode } from 'react'
import { sound } from '../lib/sound'
import { Overlay } from './Overlay'
import { SmoothScroll } from './SmoothScroll'

// One delegated listener gives every link and button a hover tick (only audible with sound on).
function useHoverTicks() {
  useEffect(() => {
    let last: Element | null = null
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const el = (e.target as Element).closest('a, button')
      if (el && el !== last) sound.tick()
      last = el
    }
    document.addEventListener('pointerover', onOver)
    return () => document.removeEventListener('pointerover', onOver)
  }, [])
}

export function Chrome({ children }: { children: ReactNode }) {
  useHoverTicks()
  return (
    <>
      <SmoothScroll />
      <a
        href="#main"
        className="ui sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-lime focus:px-3 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>
      <Overlay />
      <main id="main">{children}</main>
    </>
  )
}
