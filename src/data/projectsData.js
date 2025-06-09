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
        projectName: 'ML Pal - Multi-Agent RAG Framework',
        projectDesc:
            'Deterministic multi-agent RAG built with LangGraph and async Postgres persistence.',
        tags: ['LangChain', 'LangGraph', 'PostgreSQL'],
        code: 'https://github.com/Saivivek-Peddi',
        demo: 'https://github.com/Saivivek-Peddi',
        image: one,
    },
    {
        id: 2,
        projectName: 'LLM Hardware Acceleration Suite',
        projectDesc:
            'Research on heterogeneous training and DPU-based offloading for large language models.',
        tags: ['CUDA', 'ROCm', 'DPUs'],
        code: 'https://github.com/Saivivek-Peddi',
        demo: 'https://github.com/Saivivek-Peddi',
        image: two,
    },
    {
        id: 3,
        projectName: 'Sparse GPU Kernels for Attention',
        projectDesc:
            'CUDA kernels for sparse self-attention achieving 100x speedup on a 1660 Ti.',
        tags: ['CUDA', 'cuSparse', 'Vision Transformer'],
        code: 'https://github.com/Saivivek-Peddi',
        demo: 'https://github.com/Saivivek-Peddi',
        image: three,
    },
    {
        id: 4,
        projectName: 'Latency-Critical QoE with K8s',
        projectDesc:
            'Kubernetes modules using Prometheus telemetry to guarantee SLOs for latency-critical services.',
        tags: ['Kubernetes', 'Prometheus', 'Scheduling'],
        code: 'https://github.com/Saivivek-Peddi',
        demo: 'https://github.com/Saivivek-Peddi',
        image: four,
    },
    {
        id: 5,
        projectName: 'Transformers for Audio Classification',
        projectDesc:
            'Self-supervised transformer models on Mel-Spectrograms beating the previous SOTA by 8%.',
        tags: ['PyTorch', 'Transformers'],
        code: 'https://github.com/Saivivek-Peddi',
        demo: 'https://github.com/Saivivek-Peddi',
        image: five,
    },
    {
        id: 6,
        projectName: 'Query Optimized Partitioning',
        projectDesc:
            'Machine learning approach using KModes to create privacy-aware database partitions.',
        tags: ['Machine Learning', 'Database'],
        code: 'https://github.com/Saivivek-Peddi',
        demo: 'https://github.com/Saivivek-Peddi',
        image: six,
    },
    {
        id: 7,
        projectName: 'Volumetric Isosurface Rendering',
        projectDesc:
            'Deep-learning-based super-resolution for interactive 3D volumetric data rendering.',
        tags: ['Visualization', 'Deep Learning'],
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