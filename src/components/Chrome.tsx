import type { ReactNode } from 'react'
import { Overlay } from './Overlay'
import { SmoothScroll } from './SmoothScroll'

export function Chrome({ children }: { children: ReactNode }) {
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
