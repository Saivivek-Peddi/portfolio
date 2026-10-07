export type ResearchKind = 'Paper' | 'Technical report' | 'Benchmark report' | 'Benchmark note'

export type ResearchItem = {
  date: string
  kind: ResearchKind
  title: string
  authors: string
  abstract: string
  url: string
}

const AUTHOR = 'Sai Vivek Peddi'

// Mirrors https://mlpal.ai/research (newest first). Entries the site lists by
// month only use day 01; the UI renders month + year.
export const research: ResearchItem[] = [
  {
    date: '2026-09-10',
    kind: 'Paper',
    title: 'A HOP with Memory from Day One',
    authors: AUTHOR,
    abstract:
      'Versioned evals, a locked safety envelope and a capturable build process for an infrastructure agent across AWS, Azure, GCP and Kubernetes: it watches, answers from memory, fixes inside the envelope and stops at its edge.',
    url: 'https://mlpal.ai/research/hop-infra-memory-from-day-one',
  },
  {
    date: '2026-09-01',
    kind: 'Paper',
    title: 'Memory as Governed Infrastructure',
    authors: 'MLPal Research',
    abstract:
      'An ontology-grounded, scope-hierarchical memory system for enterprise agents: governance in the write path, bi-temporal supersession, and a deterministic read path with zero LLM calls per query.',
    url: 'https://mlpal.ai/research/memory-as-governed-infrastructure',
  },
  {
    date: '2026-08-25',
    kind: 'Paper',
    title: 'HOP: Harness Optimization Profiles',
    authors: 'yodex team · MLPal Research',
    abstract:
      'A declarative, versioned artifact binding a harness’s loop policy to an eval contract and a telemetry contract, with a typed optimization surface: tunable ranges and locked fields no prompt can move.',
    url: 'https://mlpal.ai/research/hop-harness-optimization-profiles',
  },
  {
    date: '2026-08-13',
    kind: 'Benchmark report',
    title: 'Five-harness panel on claude-opus-5',
    authors: 'yodex team · MLPal Research',
    abstract:
      'Five coding-agent harnesses, one pinned model, seven tasks, two reps: 70/70 correct, with up to several-fold spread in tokens and wall-clock for identical outcomes.',
    url: 'https://mlpal.ai/research/five-harness-panel-opus5',
  },
  {
    date: '2026-08-12',
    kind: 'Technical report',
    title: 'MLPal Gateway: Curation Over Breadth',
    authors: `${AUTHOR} · MLPal`,
    abstract:
      'Breadth is the wrong metric for AI gateways. A curated catalog behind an Anthropic-wire core: 8.5 ms median added TTFT with the full admission pipeline, byte-faithful cache passthrough, metering at provider list price.',
    url: 'https://mlpal.ai/research/mlpal-gateway-curation-over-breadth',
  },
  {
    date: '2026-08-11',
    kind: 'Benchmark note',
    title: 'SWE-bench recheck on claude-opus-5',
    authors: 'yodex team · MLPal Research',
    abstract:
      'A two-instance spot-check that the paper’s SWE-bench Lite margins survive a model-generation change, under the unmodified official harness. Explicitly not a full rerun.',
    url: 'https://mlpal.ai/research/swe-recheck-opus5',
  },
  {
    date: '2026-07-28',
    kind: 'Benchmark report',
    title: 'yodex vs Claude Code on claude-opus-5',
    authors: 'yodex team · MLPal Research',
    abstract:
      'Three same-model experiments: equal correctness on focused bug-fixes at roughly 1.6–1.8× lower cost, and about 10× lower sub-agent cost via catalog routing.',
    url: 'https://mlpal.ai/research/yodex-vs-claude-code-opus5',
  },
  {
    date: '2026-07-01',
    kind: 'Paper',
    title: 'Decoupling the Harness from the Model',
    authors: 'yodex team · MLPal Research',
    abstract:
      'Under same-model isolation, the yodex harness matches or beats Claude Code on resolution with 1.18–1.76× fewer output tokens, and resolves 12/15 vs 11/15 on real SWE-bench Lite.',
    url: 'https://mlpal.ai/research/decoupling-harness-from-model',
  },
]

// Papers on the home page: Sai's first-author work, the harness paper, and his
// UC Davis audio paper. The full mlpal index lives at mlpal.ai/research.
export type SelectedPaper = { year: string; title: string; venue: string; url: string; preview?: string }

export const selectedResearch: SelectedPaper[] = [
  {
    year: '2026',
    title: 'A HOP with Memory from Day One',
    venue: 'mlpal research, first author',
    url: 'https://mlpal.ai/research/hop-infra-memory-from-day-one',
    preview: '/work/paper-hop-infra.webp',
  },
  {
    year: '2026',
    title: 'MLPal Gateway: Curation Over Breadth',
    venue: 'Technical report, first author',
    url: 'https://mlpal.ai/research/mlpal-gateway-curation-over-breadth',
    preview: '/work/paper-gateway.webp',
  },
  {
    year: '2026',
    title: 'HOP: Harness Optimization Profiles',
    venue: 'mlpal research',
    url: 'https://mlpal.ai/research/hop-harness-optimization-profiles',
    preview: '/work/paper-hop.webp',
  },
  {
    year: '2026',
    title: 'Decoupling the Harness from the Model',
    venue: 'mlpal research',
    url: 'https://mlpal.ai/research/decoupling-harness-from-model',
    preview: '/work/paper-decoupling.webp',
  },
  {
    year: '2022',
    title: 'Application of Transformers in Audio Classification',
    venue: 'UC Davis',
    url: 'https://github.com/Saivivek-Peddi/audio_transformer',
  },
]

export const teaching = [
  { when: 'Fall 2021, Spring 2022', what: 'TA, Machine Learning', where: 'UC Davis' },
  { when: 'Winter 2022', what: 'TA, Programming Languages', where: 'UC Davis' },
  { when: 'Summer 2022', what: 'TA, Design & Analysis of Algorithms', where: 'UC Davis' },
  { when: '2023 —', what: 'Led 15 grad students on LLM hardware acceleration', where: 'UC Davis × AMD' },
]
