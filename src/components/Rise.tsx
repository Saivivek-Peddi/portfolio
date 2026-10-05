import { createElement, useEffect, useRef, type ElementType } from 'react'

// Splits text into words that rise out of a mask when scrolled into view.
export function Rise({
  text,
  as = 'span',
  className = '',
  delay = 0,
}: {
  text: string
  as?: ElementType
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const lines = text.split('\n')
  let i = delay
  return createElement(
    as,
    { ref, className: `rise ${className}` },
    lines.flatMap((line, li) => [
      ...line.split(' ').map((word, wi) => (
        <span key={`${li}-${wi}`}>
          <span style={{ ['--i' as string]: i++ }}>{word}</span>
          {wi < line.split(' ').length - 1 ? ' ' : ''}
        </span>
      )),
      li < lines.length - 1 ? <br key={`br-${li}`} /> : null,
    ]),
  )
}
