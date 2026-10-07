export type Chapter = {
  when: string
  place: string
  line: string
  detail: string
}

// The path so far, told as chapters. Facts only: résumé, public posts and
// Sai's own answers. Never frame a departure; each chapter is what he did there.
export const chapters: Chapter[] = [
  {
    when: 'Origin',
    place: 'Hyderabad',
    line: 'Grew up here and studied my way into BITS Pilani.',
    detail: 'Home.',
  },
  {
    when: '2015',
    place: 'BITS Pilani',
    line: 'Electronics and communication engineering. Signals first, then machine learning.',
    detail: 'B.E. (Hons.), Hyderabad campus.',
  },
  {
    when: '2018',
    place: 'IIIT Hyderabad',
    line: 'Research assistant in the speech processing lab. My first real taste of ML research.',
    detail: 'ML and speech processing.',
  },
  {
    when: '2019',
    place: 'KFintech',
    line: 'Architected Digix, the reporting platform for 18 asset managers.',
    detail: '$137B AUM, 100M investor accounts. Led five engineers; Spark pipelines cut query times 40×.',
  },
  {
    when: '2021',
    place: 'UC Davis',
    line: 'M.S. in Computer Science with a 4.0, and four terms as a TA.',
    detail: 'Research with Prof. Dipak Ghosal on GPUs, networks and distributed training.',
  },
  {
    when: '2023',
    place: 'JPMorgan Chase',
    line: 'Senior ML engineer. Brought coding agents to more than a thousand engineers.',
    detail: 'Multi-agent systems in production, 1M+ requests a day at 99.9% uptime.',
  },
  {
    when: '2026',
    place: 'mlpal',
    line: 'Co-founded mlpal with Dipak, to give companies ownership of the loop around the model.',
    detail: 'Gateway, harness and memory. Open source, research-led.',
  },
]
