import { work, type WorkItem } from '../content/work'
import { repos } from '../content/openSource'
import { useInView } from './useInView'

const COLS = 10
const ROWS = 8
// Deterministic shuffle so server and client render identical delays.
const DELAYS = Array.from({ length: COLS * ROWS }, (_, i) => ((i * 7919) % (COLS * ROWS)) / (COLS * ROWS))

// Blocks of page color that dissolve away in random order, revealing the image.
function PixelReveal({ on }: { on: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }} aria-hidden>
      {DELAYS.map((d, i) => (
        <span key={i} className="pixel bg-bg" data-on={on} style={{ transitionDelay: `${Math.round(d * 700)}ms` }} />
      ))}
    </div>
  )
}

// Placement on the 12-column grid, offset like a contact sheet.
const LAYOUT = [
  'md:col-start-6 md:col-span-7',
  'md:col-start-1 md:col-span-5 md:-mt-48',
  'md:col-start-7 md:col-span-6 md:mt-10',
  'md:col-start-2 md:col-span-5 md:-mt-32',
]

function Card({ item, className }: { item: WorkItem; className: string }) {
  const [ref, inView] = useInView<HTMLAnchorElement>()
  return (
    <a ref={ref} href={item.href} className={`group col-span-12 block ${className}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-card">
        <img
          src={item.image}
          alt={`${item.title}: screenshot`}
          loading="lazy"
          decoding="async"
          width={1200}
          height={750}
          className="absolute top-[13%] left-[9%] w-[118%] max-w-none rounded-tl-md shadow-[0_30px_60px_-20px_rgb(0_0_0/0.45)] transition-transform duration-700 ease-out-expo group-hover:-translate-x-[3%] group-hover:-translate-y-[3%]"
        />
        <span className="ui absolute top-3 right-3 bg-lime px-1.5 py-0.5 text-[0.62rem] text-black">{item.tag}</span>
        <PixelReveal on={inView} />
      </div>
      <div className="ui mt-3 flex items-baseline justify-between gap-4 text-[0.72rem]">
        <span>{item.title}</span>
        <span className="text-dim">{item.years}</span>
      </div>
      <p className="mono mt-1 max-w-[46ch] text-dim opacity-0 transition-opacity duration-500 group-hover:opacity-100">{item.blurb}</p>
    </a>
  )
}

export function Work() {
  const extras = repos.filter((r) => r.install)
  return (
    <section id="work" className="px-5 py-24 md:px-16 md:py-32" aria-labelledby="work-title">
      <div className="ui flex items-baseline justify-between border-b border-line pb-3">
        <h2 id="work-title">Selected work</h2>
        <span className="text-dim">({String(work.length).padStart(2, '0')})</span>
      </div>
      <div className="mt-16 grid grid-cols-12 gap-x-4 gap-y-20 md:gap-y-28">
        {work.map((item, i) => (
          <Card key={item.href} item={item} className={LAYOUT[i % LAYOUT.length]} />
        ))}
      </div>
      <p className="mono mt-24 max-w-[60ch] text-dim">
        Also open:{' '}
        {extras.map((r, i) => (
          <span key={r.name}>
            <a href={r.url} className="wipe text-fg">
              {r.name}
            </a>{' '}
            <code className="text-fg/70">{r.install}</code>
            {i < extras.length - 1 ? ', ' : '.'}
          </span>
        ))}
      </p>
    </section>
  )
}
