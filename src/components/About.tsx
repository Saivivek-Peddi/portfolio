import { profile } from '../content/profile'
import { Rise } from './Rise'
import { useInView } from './useInView'
import { SAI_PATH, SAI_VIEWBOX } from './hero/saiPath'

// The same "sai" stroke as the hero, written in lime over the portrait.
function Signature({ play }: { play: boolean }) {
  return (
    <svg
      viewBox={`0 0 ${SAI_VIEWBOX.width} ${SAI_VIEWBOX.height}`}
      className="pointer-events-none absolute -top-[18%] -left-[22%] w-[115%] -rotate-[9deg] text-lime drop-shadow-[0_2px_10px_rgb(0_0_0/0.35)]"
      aria-hidden
    >
      <path
        d={SAI_PATH}
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="signature"
        data-play={play}
      />
    </svg>
  )
}

export function About() {
  const [ref, inView] = useInView<HTMLElement>()
  return (
    <section id="about" ref={ref} className="grid grid-cols-12 gap-x-4 px-5 py-32 md:px-16 md:py-48" aria-label="About">
      <figure className="relative col-span-8 mb-16 sm:col-span-5 md:col-span-3 md:mb-0">
        <picture>
          <source type="image/avif" srcSet="/img/portrait-480.avif 480w, /img/portrait-880.avif 880w" sizes="(min-width: 768px) 24vw, 66vw" />
          <source type="image/webp" srcSet="/img/portrait-480.webp 480w, /img/portrait-880.webp 880w" sizes="(min-width: 768px) 24vw, 66vw" />
          <img
            src="/img/portrait-880.jpg"
            alt={profile.photoAlt}
            width={880}
            height={1100}
            loading="lazy"
            decoding="async"
            className="aspect-[4/5] w-full object-cover"
          />
        </picture>
        <Signature play={inView} />
      </figure>

      <div className="col-span-12 md:col-span-8 md:col-start-5">
        <p className="text-[clamp(1.75rem,3.1vw,3.1rem)] leading-[1.08] font-[420] tracking-[-0.015em]">
          <Rise text="I explore how agents should run: what they read, when they check their own work, what they remember, and when they stop." />
        </p>
        <p className="mt-10 text-[clamp(1.75rem,3.1vw,3.1rem)] leading-[1.08] font-[420] tracking-[-0.015em] text-dim">
          I&rsquo;m building{' '}
          <a href={profile.links.mlpal} className="text-fg underline decoration-1 underline-offset-[0.12em] hover:bg-lime hover:text-black">
            mlpal
          </a>
          <sup className="text-[0.4em]">&trade;</sup>, and before that shipped coding agents at JPMorgan Chase, wrote
          sparse GPU kernels at UC Davis, and built data platforms at KFintech. Everything we measure is{' '}
          <a href={profile.links.research} className="text-fg underline decoration-1 underline-offset-[0.12em] hover:bg-lime hover:text-black">
            published
          </a>
          .
        </p>
      </div>
    </section>
  )
}
