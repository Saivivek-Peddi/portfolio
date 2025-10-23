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
            'Production-ready multi-agent RAG framework with LangGraph and LangChain, featuring structured outputs, intelligent tool calls, and async PostgreSQL persistence for state management, checkpoints, and long-term memory.',
        tags: ['LangChain', 'LangGraph', 'PostgreSQL', 'RAG'],
        code: 'https://github.com/Saivivek-Peddi',
        demo: 'https://github.com/Saivivek-Peddi',
        image: one,
        fullDescription: `
            <p>ML Pal represents a cutting-edge implementation of multi-agent RAG (Retrieval-Augmented Generation) systems,
            designed to handle complex AI workflows with production-grade reliability and performance. This framework showcases
            expertise in building sophisticated AI systems that combine the power of large language models with structured data access.</p>
        `,
        keyFeatures: [
            'Deterministic multi-agent workflows using LangGraph and LangChain for orchestrating complex AI tasks',
            'Structured outputs with intelligent tool calls enabling precise control over agent behavior',
            'Async persistence layers built with PostgreSQL for robust state management and checkpoints',
            'Long-term memory capabilities allowing agents to maintain context across sessions',
            'AWS Metrics Agent featuring natural language to SQL conversion',
            'Vector-based similarity search for intelligent query understanding',
            'Production-ready architecture with scalability and fault tolerance built-in'
        ],
        technicalDetails: `The system leverages LangGraph's state management capabilities to create deterministic agent workflows,
        ensuring predictable behavior in production environments. The PostgreSQL-based persistence layer provides ACID guarantees
        for critical agent states, while the vector search component enables semantic understanding of user queries. The AWS Metrics
        Agent demonstrates advanced capabilities in translating natural language queries into optimized SQL statements, bridging the
        gap between human communication and structured data access.`,
        impact: `This framework serves as a foundation for building enterprise-grade AI applications, demonstrating patterns and
        practices for deploying reliable multi-agent systems at scale. The architecture decisions prioritize maintainability,
        observability, and extensibility, making it suitable for production deployment in mission-critical environments.`
    },
    {
        id: 2,
        projectName: 'LLM Hardware Acceleration Suite',
        projectDesc:
            'Leading team of 15 CS graduate students with AMD researchers on next-gen hardware accelerators for LLMs. Research spans heterogeneous training/inference, DPU-based Smart NICs for task offloading, and memory optimization.',
        tags: ['CUDA', 'ROCm', 'DPUs', 'AMD'],
        code: 'https://github.com/Saivivek-Peddi',
        demo: 'https://github.com/Saivivek-Peddi',
        image: two,
        fullDescription: `
            <p>This collaborative research project with AMD represents cutting-edge work in hardware acceleration for Large Language Models,
            addressing critical challenges in making LLMs more efficient and accessible. Leading a team of 15 graduate students alongside
            AMD researchers, this project pushes the boundaries of what's possible in AI hardware acceleration.</p>
        `,
        keyFeatures: [
            'Heterogeneous training and inference systems enabling cross-vendor GPU compatibility',
            'Support for both NVIDIA CUDA and AMD ROCm platforms',
            'DPU-based Smart NICs for offloading LLM tasks from GPUs to specialized processors',
            'Advanced memory optimization strategies for multi-GPU deployments',
            'Novel approaches to distributed training across heterogeneous hardware',
            'Performance profiling and optimization tools for LLM workloads',
            'Collaborative research environment bridging academia and industry'
        ],
        technicalDetails: `The project tackles three fundamental challenges: (1) Heterogeneous computing by developing abstraction layers
        that work seamlessly across NVIDIA and AMD hardware, (2) Smart offloading using DPU-based NICs to handle specific LLM operations
        like attention mechanism computation, and (3) Memory optimization through innovative caching strategies and tensor partitioning
        techniques for efficient multi-GPU utilization. The research combines low-level kernel programming with high-level system design.`,
        impact: `This research has the potential to democratize access to LLM training and inference by reducing hardware lock-in and
        improving resource utilization. The heterogeneous computing approaches being developed could enable organizations to leverage
        mixed GPU environments, while the DPU offloading strategies promise to increase overall system throughput and reduce costs.`
    },
    {
        id: 3,
        projectName: 'Sparse GPU Kernels for Vision Transformers',
        projectDesc:
            'Custom CUDA kernels implementing sparse attention mechanisms achieving 100x speedup. Exploiting 85% post-softmax sparsity with cuSPARSE, achieving 97.5% GPU utilization.',
        tags: ['CUDA', 'cuSparse', 'Vision Transformer', 'GPU'],
        code: 'https://github.com/Saivivek-Peddi',
        demo: 'https://github.com/Saivivek-Peddi',
        image: three,
        fullDescription: `
            <p>This research project represents a breakthrough in GPU optimization for Vision Transformers, addressing the computational
            bottleneck of attention mechanisms. By exploiting the natural sparsity that emerges after softmax operations and implementing
            custom CUDA kernels, this work achieves unprecedented performance improvements while maintaining accuracy.</p>
        `,
        keyFeatures: [
            'Achieved 100x speedup over baseline implementations through sparse attention',
            'Exploited 85% post-softmax sparsity in attention matrices',
            'Utilized cuSPARSE SPMM operations for efficient sparse matrix multiplication',
            'Reached 97.5% of theoretical GPU compute capacity utilization',
            'Transformed memory-bound operations into arithmetic-bound operations',
            'Deep understanding of GPU memory hierarchies and warp-level primitives',
            'Novel optimization strategies for sparse matrix operations'
        ],
        technicalDetails: `The implementation leverages CUDA's cuSPARSE library for sparse matrix-matrix multiplication (SPMM), specifically
        optimized for the sparse patterns that emerge in Vision Transformer attention matrices. By analyzing the sparsity structure
        post-softmax (averaging 85% zeros), custom kernels were developed that skip unnecessary computations and memory accesses.
        The optimization journey involved profiling memory access patterns, optimizing shared memory usage, and implementing warp-level
        primitives to maximize arithmetic intensity. The result is a transformation from a memory-bound kernel (limited by DRAM bandwidth)
        to an arithmetic-bound kernel (limited by GPU compute units), achieving 97.5% utilization.`,
        impact: `This work demonstrates how domain knowledge of transformer architectures combined with low-level GPU programming can
        yield dramatic performance improvements. The 100x speedup makes Vision Transformers practical for real-time applications and
        significantly reduces the computational cost of training and inference. The techniques developed are applicable to other
        transformer-based models and have influenced subsequent research in efficient attention mechanisms.`
    },
    {
        id: 4,
        projectName: 'Network Delay Variability for QoE',
        projectDesc:
            'Kubernetes modules with custom control planes for cloud scaling using Prometheus telemetry. Implemented EDF scheduler guaranteeing QoE targets for 75% utilization—15% improvement over FCFS.',
        tags: ['Kubernetes', 'Prometheus', 'Scheduling', 'QoE'],
        code: 'https://github.com/Saivivek-Peddi',
        demo: 'https://github.com/Saivivek-Peddi',
        image: four,
        fullDescription: `
            <p>This project demonstrates advanced systems engineering skills by developing custom Kubernetes control planes for
            intelligent cloud scaling. By combining Prometheus telemetry with sophisticated scheduling algorithms, it achieves
            superior quality-of-experience guarantees compared to traditional scheduling approaches.</p>
        `,
        keyFeatures: [
            'Custom Kubernetes modules with tailored control planes for dynamic cloud scaling',
            'Prometheus-based telemetry system for real-time performance monitoring',
            'Earliest Deadline First (EDF) scheduler implementation',
            'Guaranteed QoE targets at over 75% system utilization',
            '15% improvement over First-Come-First-Served (FCFS) scheduling',
            'Predictive scaling based on workload patterns and deadlines',
            'Production-ready with comprehensive monitoring and alerting'
        ],
        technicalDetails: `The system uses Prometheus to collect real-time metrics on request latencies, resource utilization, and queue
        depths. This data feeds into a custom EDF scheduler that prioritizes requests based on their deadlines, ensuring time-sensitive
        workloads complete within their QoE constraints. The Kubernetes control plane integration enables automatic pod scaling decisions
        based on both current load and predicted future demand, maintaining high utilization without sacrificing service quality.`,
        impact: `By achieving 75% utilization while maintaining QoE guarantees (versus 60% for FCFS), this system enables significant
        cost savings through better resource utilization. The 15% improvement translates directly to either reduced infrastructure
        costs or increased capacity for handling traffic spikes.`
    },
    {
        id: 5,
        projectName: 'Transformers for Audio Classification',
        projectDesc:
            'Applied transformer architectures (ViT, MAE, DeiT, Swin) to audio classification via Mel-Spectrograms, achieving 8% improvement over SOTA. Published in academic venues.',
        tags: ['PyTorch', 'Transformers', 'Audio', 'ViT'],
        code: 'https://github.com/Saivivek-Peddi',
        demo: 'https://github.com/Saivivek-Peddi',
        image: five,
        fullDescription: `
            <p>This research project challenged the conventional wisdom that CNNs are optimal for audio classification by successfully
            applying Vision Transformer architectures to audio data. By treating Mel-Spectrograms as images and leveraging transformers'
            ability to learn long-range dependencies, this work achieved state-of-the-art results and was published in academic venues.</p>
        `,
        keyFeatures: [
            'Application of Vision Transformers (ViT) to audio classification tasks',
            'Experimentation with MAE (Masked Autoencoder), DeiT, and Swin Transformers',
            'Novel approach treating Mel-Spectrograms as 2D image representations',
            'Achieved 8% improvement over state-of-the-art CNN-based methods',
            'Addressed inductive bias limitations in convolutional approaches',
            'Published findings in peer-reviewed academic conferences',
            'Comprehensive ablation studies and model comparisons'
        ],
        technicalDetails: `The approach converts audio signals into Mel-Spectrogram representations, which are then processed by transformer
        architectures originally designed for computer vision. Unlike CNNs which have built-in inductive biases for local patterns,
        transformers learn attention patterns directly from data, enabling them to capture both local and global temporal-spectral
        relationships in audio. The research explored various transformer variants, with careful hyperparameter tuning and data
        augmentation strategies to achieve optimal performance.`,
        impact: `This work demonstrates the versatility of transformer architectures beyond their original domains and challenges the
        assumption that domain-specific inductive biases are always beneficial. The 8% improvement over SOTA opens new avenues for
        audio processing research and has implications for other signal processing tasks.`
    },
    {
        id: 6,
        projectName: 'Privacy-First Query Optimized DB Partitioning',
        projectDesc:
            'ML model using KModes clustering to generate optimal database partitions based on query patterns. Achieved 3x speedup with vertical and 9x with horizontal partitioning.',
        tags: ['Machine Learning', 'Database', 'KModes', 'Privacy'],
        code: 'https://github.com/Saivivek-Peddi',
        demo: 'https://github.com/Saivivek-Peddi',
        image: six,
        fullDescription: `
            <p>This innovative project combines machine learning with database optimization to automatically discover optimal partitioning
            strategies. By analyzing query patterns while preserving privacy, the system determines how to partition databases for
            maximum performance without requiring manual database tuning expertise.</p>
        `,
        keyFeatures: [
            'ML-based automatic database partitioning using KModes clustering',
            'Privacy-preserving query pattern analysis',
            'Support for both vertical and horizontal partitioning strategies',
            'Up to 3x speedup with vertical partitioning',
            'Up to 9x speedup with horizontal partitioning',
            'Adaptive partitioning that evolves with changing query patterns',
            'No manual tuning required from database administrators'
        ],
        technicalDetails: `The system uses KModes clustering (optimized for categorical data) to analyze query access patterns and
        identify natural data groupings. For vertical partitioning, it groups frequently co-accessed columns together. For horizontal
        partitioning, it identifies data segments that are queried independently. The privacy-first design ensures query patterns are
        analyzed without exposing sensitive data or query specifics. The ML model learns optimal partitioning strategies that minimize
        cross-partition queries while balancing data distribution.`,
        impact: `This work demonstrates the power of applying machine learning to traditional systems optimization problems. The dramatic
        speedups (3x-9x) make previously impractical queries feasible and reduce infrastructure costs. The automatic nature of the
        solution democratizes database optimization, making enterprise-grade performance accessible without requiring deep database
        expertise.`
    },
    {
        id: 7,
        projectName: 'Digital Twin for LLM Inference',
        projectDesc:
            'SimPy-based simulator modeling compute, memory, and network interactions with <20% error. Enables rapid testing of optimization strategies without expensive production deployments.',
        tags: ['SimPy', 'LLM', 'Simulation', 'Performance'],
        code: 'https://github.com/Saivivek-Peddi',
        demo: 'https://github.com/Saivivek-Peddi',
        image: seven,
        fullDescription: `
            <p>This research project addresses the challenge of optimizing LLM inference systems by creating a high-fidelity digital
            twin that accurately simulates compute, memory, and network interactions. This enables rapid iteration on optimization
            strategies without the cost and complexity of production deployments.</p>
        `,
        keyFeatures: [
            'High-fidelity SimPy-based discrete event simulator',
            'Accurate modeling of GPU compute operations, memory hierarchies, and network communication',
            'Less than 20% error for time-to-first-token (TTFT) metrics',
            'Less than 20% error for token-between-time (TBT) metrics',
            'Enables rapid testing of KV cache strategies, batching policies, and parallelism approaches',
            'Significantly faster than real system experimentation',
            'Validated against production LLM inference workloads'
        ],
        technicalDetails: `The simulator models the complete LLM inference pipeline including request queuing, batch formation, KV cache
        management, GPU kernel execution times, memory bandwidth constraints, and multi-GPU communication patterns. Built using SimPy's
        discrete event simulation framework, it captures the complex interactions between compute, memory, and network resources. The
        simulator was calibrated using real production traces and validated to maintain <20% error on critical metrics like TTFT and TBT,
        making it suitable for evaluating optimization strategies before production deployment.`,
        impact: `This digital twin dramatically accelerates LLM inference research and optimization. Instead of expensive and time-consuming
        production experiments, researchers can rapidly prototype and evaluate new ideas. The <20% accuracy ensures insights gained from
        simulation translate to real-world improvements, reducing the risk and cost of optimization efforts.`
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