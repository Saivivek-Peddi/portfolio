import one from '../assets/svg/projects/one.svg'
import two from '../assets/svg/projects/two.svg'
import three from '../assets/svg/projects/three.svg'
import four from '../assets/svg/projects/four.svg'
import five from '../assets/svg/projects/five.svg'
import six from '../assets/svg/projects/six.svg'
import seven from '../assets/svg/projects/seven.svg'
import eight from '../assets/svg/projects/eight.svg'


export const projectsData = [
    {
        id: 1,
        projectName: 'ML Pal - Multi-Agent RAG System',
        projectDesc:
            'Production-ready multi-agent RAG framework with LangGraph and LangChain, featuring structured outputs, intelligent tool calls, and async PostgreSQL persistence for state management, checkpoints, and long-term memory. Includes AWS Metrics Agent with natural language to SQL conversion.',
        tags: ['LangChain', 'LangGraph', 'PostgreSQL', 'RAG'],
        code: 'https://github.com/Saivivek-Peddi',
        demo: 'https://github.com/Saivivek-Peddi',
        image: one,
    },
    {
        id: 2,
        projectName: 'LLM Hardware Acceleration Suite',
        projectDesc:
            'Leading team of 15 CS graduate students with AMD researchers on next-gen hardware accelerators for LLMs. Research spans heterogeneous training/inference for cross-vendor GPU compatibility, DPU-based Smart NICs for task offloading, and memory optimization for multi-GPU deployments.',
        tags: ['CUDA', 'ROCm', 'DPUs', 'AMD'],
        code: 'https://github.com/Saivivek-Peddi',
        demo: 'https://github.com/Saivivek-Peddi',
        image: two,
    },
    {
        id: 3,
        projectName: 'Sparse GPU Kernels for Vision Transformers',
        projectDesc:
            'Custom CUDA kernels implementing sparse attention mechanisms achieving 100x speedup over baseline. Exploiting 85% post-softmax sparsity with cuSPARSE SPMM operations, achieving 97.5% GPU utilization by transforming memory-bound operations into arithmetic-bound ones.',
        tags: ['CUDA', 'cuSparse', 'Vision Transformer', 'GPU'],
        code: 'https://github.com/Saivivek-Peddi',
        demo: 'https://github.com/Saivivek-Peddi',
        image: three,
    },
    {
        id: 4,
        projectName: 'Network Delay Variability for QoE',
        projectDesc:
            'Kubernetes modules with custom control planes for cloud scaling using Prometheus telemetry. Implemented Earliest Deadline First (EDF) scheduler guaranteeing QoE targets for over 75% utilization—15% improvement over FCFS scheduling.',
        tags: ['Kubernetes', 'Prometheus', 'Scheduling', 'QoE'],
        code: 'https://github.com/Saivivek-Peddi',
        demo: 'https://github.com/Saivivek-Peddi',
        image: four,
    },
    {
        id: 5,
        projectName: 'Transformers for Audio Classification',
        projectDesc:
            'Applied transformer architectures (ViT, MAE, DeiT, and Swin Transformers) to audio classification via Mel-Spectrograms, achieving 8% improvement over state-of-the-art. Addressed inductive bias inherent in CNN-based approaches. Published in academic venues.',
        tags: ['PyTorch', 'Transformers', 'Audio', 'ViT'],
        code: 'https://github.com/Saivivek-Peddi',
        demo: 'https://github.com/Saivivek-Peddi',
        image: five,
    },
    {
        id: 6,
        projectName: 'Privacy-First Query Optimized DB Partitioning',
        projectDesc:
            'ML model using KModes clustering to automatically generate optimal database partitions based on query patterns. Achieved up to 3x speedup with vertical partitioning and 9x speedup with horizontal partitioning, demonstrating ML power in systems optimization.',
        tags: ['Machine Learning', 'Database', 'KModes', 'Privacy'],
        code: 'https://github.com/Saivivek-Peddi',
        demo: 'https://github.com/Saivivek-Peddi',
        image: six,
    },
    {
        id: 7,
        projectName: 'Digital Twin for LLM Inference',
        projectDesc:
            'SimPy-based simulator modeling compute, memory, and network interactions with less than 20% error for time-to-first-token and token-between-time metrics. Enables rapid testing of optimization strategies without expensive production deployments.',
        tags: ['SimPy', 'LLM', 'Simulation', 'Performance'],
        code: 'https://github.com/Saivivek-Peddi',
        demo: 'https://github.com/Saivivek-Peddi',
        image: seven,
    },
]


// Do not remove any fields.
// Leave it blank instead as shown below

/* 
{
    id: 1,
    projectName: 'Car Pooling System',
    projectDesc: '',
    tags: ['Flutter', 'React'],
    code: '',
    demo: '',
    image: ''
}, 
*/