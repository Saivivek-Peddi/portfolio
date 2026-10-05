export type Repo = {
  name: string
  role: string
  blurb: string
  url: string
  lang: string
  install?: string
}

export const repos: Repo[] = [
  {
    name: 'mlpal-gateway',
    role: 'Model gateway',
    blurb: 'One API for Anthropic, OpenAI, Google, Bedrock and your own models. Routing, cost metering, budgets. +8.5 ms with full governance.',
    url: 'https://github.com/mlpal-ai/mlpal-gateway',
    lang: 'Python',
  },
  {
    name: 'mlpal-harness',
    role: 'Harness engine',
    blurb: 'The engine that runs the loop: what to read, which model runs, when to verify, when to stop.',
    url: 'https://github.com/mlpal-ai/mlpal-harness',
    lang: 'TypeScript',
  },
  {
    name: 'hop',
    role: 'Open spec',
    blurb: 'Harness Optimization Profiles: versioned loop policy + evals + a locked safety envelope. CC-BY-4.0.',
    url: 'https://github.com/mlpal-ai/hop',
    lang: 'Spec',
  },
  {
    name: 'yodex',
    role: 'Coding HOP',
    blurb: 'mlpal\u2019s coding agent: one tunable harness for Anthropic, OpenAI, Google and open-weight models. Benchmarks public.',
    url: 'https://github.com/mlpal-ai/yodex',
    lang: 'CLI',
    install: 'npm i -g @mlpal/yodex',
  },
  {
    name: 'mlpal-memory',
    role: 'Governed memory',
    blurb: 'Institutional memory for agents: bi-temporal, ontology-typed, governed, deterministic on the read path.',
    url: 'https://github.com/mlpal-ai/mlpal-memory',
    lang: 'Python',
  },
  {
    name: 'mlpal-assistants-sdk',
    role: 'Python SDK',
    blurb: 'Anthropic-wire inference, streaming, tools, and key/budget management from Python.',
    url: 'https://github.com/mlpal-ai/mlpal-assistants-sdk',
    lang: 'Python',
    install: 'pip install mlpal-assistants',
  },
]
