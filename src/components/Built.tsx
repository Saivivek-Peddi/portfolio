import { built, type BuiltItem } from '../content/built'
import { BuiltArt } from './BuiltArt'
import { useInView } from './useInView'

const COLS = 10
const ROWS = 8
// Deterministic shuffle so server and client render identical delays.
const DELAYS = Array.from({ length: COLS * ROWS }, (_, i) => ((i * 7919) % (COLS * ROWS)) / (COLS * ROWS))

// Blocks of page color that dissolve away in random order, revealing the cover.
function PixelReveal({ on }: { on: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }} aria-hidden>
      {DELAYS.map((d, i) => (
        <span key={i} className="pixel bg-bg" data-on={on} style={{ transitionDelay: `${Math.round(d * 700)}ms` }} />
      ))}
    </div>
  )
}

const SPAN = ['md:col-span-7', 'md:col-span-5']

function Card({ item, index }: { item: BuiltItem; index: number }) {
  const [ref, inView] = useInView<HTMLElement>()
  const Tag = item.href ? 'a' : 'div'
  return (
    <article ref={ref} className={`group col-span-12 ${SPAN[index] ?? 'md:col-span-4'}`}>
      <Tag {...(item.href ? { href: item.href } : {})} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-card">
          {item.image ? (
            <img
              src={item.image}
              alt={`${item.title}: screenshot`}
              loading="lazy"
              decoding="async"
              width={1200}
              height={750}
              className="absolute top-[13%] left-[9%] w-[118%] max-w-none rounded-tl-md shadow-[0_30px_60px_-20px_rgb(0_0_0/0.45)] transition-transform duration-700 ease-out-expo group-hover:-translate-x-[3%] group-hover:-translate-y-[3%]"
            />
          ) : (
            item.art && (
              <div className="absolute inset-[8%] transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]">
                <BuiltArt kind={item.art} />
              </div>
            )
          )}
          <span className="ui absolute top-3 right-3 bg-lime px-1.5 py-0.5 text-[0.62rem] text-black">{item.tag}</span>
          <PixelReveal on={inView} />
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-4">
          <h3 className="text-[1.15rem] font-[560] tracking-[-0.01em]">
            <span className={item.href ? 'wipe' : ''}>{item.title}</span>
          </h3>
          <span className="ui text-dim">{item.year}</span>
        </div>
        <p className="mono mt-1.5 max-w-[48ch] text-dim">{item.blurb}</p>
      </Tag>
    </article>
  )
}

export function Built() {
  return (
    <section id="built" className="px-5 py-24 md:px-16 md:py-32" aria-labelledby="built-title">
      <div className="ui flex items-baseline justify-between border-b border-line pb-3">
        <h2 id="built-title">Things I&rsquo;ve built</h2>
        <span className="text-dim">({String(built.length).padStart(2, '0')})</span>
      </div>
      <div className="mt-12 grid grid-cols-12 gap-x-4 gap-y-14 md:gap-x-6 md:gap-y-20">
        {built.map((item, i) => (
          <Card key={item.title} item={item} index={i} />
        ))}
      </div>
    </section>
  )
}
