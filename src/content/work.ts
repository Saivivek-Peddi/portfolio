export type WorkItem = {
  title: string
  tag: string
  years: string
  blurb: string
  image: string
  href: string
}

// Screenshots are real captures of mlpal.ai (public/work/*.webp).
export const work: WorkItem[] = [
  {
    title: 'mlpal',
    tag: 'Company',
    years: '2024 — now',
    blurb: 'Gateway, harness and memory, owned by the company that runs them.',
    image: '/work/mlpal-home.webp',
    href: 'https://mlpal.ai',
  },
  {
    title: 'Model gateway',
    tag: 'Open source',
    years: '2026',
    blurb: 'Every model behind one contract. +8.5 ms with full governance on.',
    image: '/work/mlpal-gateway.webp',
    href: 'https://github.com/mlpal-ai/mlpal-gateway',
  },
  {
    title: 'Harness + HOP',
    tag: 'Open spec',
    years: '2026',
    blurb: 'One engine, many HOPs: versioned loop policy with fields no prompt can move.',
    image: '/work/mlpal-harness.webp',
    href: 'https://github.com/mlpal-ai/hop',
  },
  {
    title: 'Governed memory',
    tag: 'Open source',
    years: '2026',
    blurb: 'The next run starts smarter. Zero model calls per memory read.',
    image: '/work/mlpal-memory.webp',
    href: 'https://github.com/mlpal-ai/mlpal-memory',
  },
]

// Research rows that have a captured preview of the paper page.
export const researchPreviews: Record<string, string> = {
  'https://mlpal.ai/research/hop-infra-memory-from-day-one': '/work/paper-hop-infra.webp',
  'https://mlpal.ai/research/memory-as-governed-infrastructure': '/work/paper-memory.webp',
  'https://mlpal.ai/research/hop-harness-optimization-profiles': '/work/paper-hop.webp',
  'https://mlpal.ai/research/mlpal-gateway-curation-over-breadth': '/work/paper-gateway.webp',
  'https://mlpal.ai/research/decoupling-harness-from-model': '/work/paper-decoupling.webp',
}
