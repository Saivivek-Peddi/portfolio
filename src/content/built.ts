// Things Sai built across the years. `art` picks the generative cover drawn
// for the card (see components/BuiltArt.tsx); `image` overrides it.
export type ArtKind = 'sparse' | 'hetero' | 'spectrogram' | 'partition' | 'isosurface' | 'deadline' | 'grader'

export type BuiltItem = {
  title: string
  tag: string
  year: string
  blurb: string
  href?: string
  art?: ArtKind
  image?: string
}

const GH = 'https://github.com/Saivivek-Peddi'

export const built: BuiltItem[] = [
  {
    title: 'mlpal',
    tag: 'Co-founder',
    year: '2026',
    blurb: 'A model gateway, a tunable harness and governed memory that companies own. Open source.',
    href: 'https://mlpal.ai',
    image: '/work/mlpal-home.webp',
  },
  {
    title: 'Sparse attention kernels',
    tag: 'CUDA',
    year: '2022',
    blurb: 'Custom kernels for ViT self-attention: 100× faster at 85% sparsity, 97.5% of the GPU busy.',
    art: 'sparse',
  },
  {
    title: 'Training across AMD + NVIDIA',
    tag: 'Research lead',
    year: '2023',
    blurb: 'Heterogeneous CUDA + ROCm training with AMD researchers. Led a team of 15 grad students.',
    href: `${GH}/heterogenous-training`,
    art: 'hetero',
  },
  {
    title: 'Transformers that listen',
    tag: 'Paper',
    year: '2022',
    blurb: 'ViT, MAE, DeiT and Swin on mel-spectrograms. Beat the CNN state of the art by 8%.',
    href: `${GH}/audio_transformer`,
    art: 'spectrogram',
  },
  {
    title: 'ML database partitioning',
    tag: 'Research',
    year: '2022',
    blurb: 'Learns partitions from past queries, privacy first. Up to 9× faster.',
    href: `${GH}/ml_horizontal_partitioning`,
    art: 'partition',
  },
  {
    title: 'Volumes, super-resolved',
    tag: 'Visualization',
    year: '2021',
    blurb: 'Interactive isosurface rendering of CT scans and supernovae, sharpened with deep learning.',
    art: 'isosurface',
  },
  {
    title: 'Latency-aware Kubernetes',
    tag: 'Systems',
    year: '2022',
    blurb: 'An EDF scheduler on Prometheus telemetry that holds QoE targets at 75% utilization.',
    art: 'deadline',
  },
  {
    title: 'Canvas auto-grader',
    tag: 'For TAs',
    year: '2022',
    blurb: 'Pulls submissions from Canvas, grades them, posts the grades back. Built to free up TA hours.',
    href: `${GH}/canvas_automated_grading`,
    art: 'grader',
  },
]
