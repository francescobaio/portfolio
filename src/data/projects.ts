import type { Project } from '../types';

export const projects: Project[] = [
    {
        id: "soccerai",
        name: "SoccerAI — End-to-end Sports Analytics (World Cup 2022)",
        description:
            "I co-built (with a team of three) SoccerAI: an end-to-end sports analytics system that predicts whether a possession will produce a shot in the next seconds using World Cup 2022 tracking + event data. We engineered dynamic pitch-graphs per frame and benchmarked multiple GNNs (GATv2, GCNII, …). The pipeline covers data ingestion/cleaning, temporal graph construction, training/evaluation, and lightweight explainability (attention/feature attributions). We documented everything with reproducible configs (W&B report) and Quarto slides. The project is actively evolving and we’re currently preparing a conference submission.",
        tech: ["PyTorch Geometric", "GNNs (GATv2, GCNII)", "W&B", "Quarto"],
        repo: "https://github.com/francescobaio/SoccerAI",
        demo: "https://wandb.ai/soccerai/soccerai/reports/SoccerAI--VmlldzoxMzUyMzAwOA?accessToken=fgaxkym52by5z4locrvbs58cax5xp9ovyhjfdi1r1i50d0fyegmosqeiwt7b8d3v",
        year: 2025,
    },
    {
        id: "nlp-sexism",
        name: "NLP Sexism Detection — EXIST 2023 / EDOS Task A",
        description:
            "End-to-end NLP pipelines for sexism detection on Twitter (EXIST 2023, EDOS Task A), benchmarking LSTM vs transformers and fine-tuning RoBERTa to outperform custom baselines with fully reproducible notebooks and reports. I designed few-shot and Chain-of-Thought prompting for ambiguous cases and ran targeted bias analyses (e.g., over-association of ‘woman’), turning findings into concrete dataset/labeling guidelines and documenting everything in a Quarto-powered website.",
        tech: ["Transformers (RoBERTa)", "sklearn", "polars", "Quarto"],
        repo: "https://github.com/francescobaio/NLP_Assignments",
        demo: "https://francescobaio.github.io/NLP_Assignments/",
        year: 2025,
    },
    {
        id: 'hiring-cv-bias',
        name: 'Hiring CV Bias — Auditing a CV Parsing Pipeline',
        description:
            'We inspect the end-to-end CV parsing pipeline to uncover and mitigate disparities. The project is structured into: Problem Statement — scope, data sources and fairness questions; Pipeline — full walkthrough from cleaning to bias analysis; Results — visualizations and statistics highlighting over/under-representation of skills; Future Work — validation steps and concrete mitigation strategies.',
        tech: ['NLP', 'spaCy', 'scikit-learn', 'polars', 'Quarto'],
        repo: 'https://github.com/francescobaio/hiring_cv_bias',
        demo: 'https://francescobaio.github.io/hiring_cv_bias/',
        year: 2025,
    },
    {
        id: 'multiple-couriers-cvrp',
        name: 'Multiple Couriers — Capacitated Vehicle Routing Problem (CVRP)',
        description:
            'End-to-end CVRP experimentation framework (CDMO-2024): Dockerized pipeline to reproduce results across four approaches—CP, SAT, SMT, and MIP—with pluggable solvers and model variants. Includes CLI flags for instances, approach, solver, model, and timeout; supports running all settings or targeted sweeps. Consistent runner, repeatable experiments, and clear report of performance per instance/solver/model.',
        tech: [
            'Docker',
            'CP',
            'SAT',
            'SMT',
            'MIP',
            'Z3',
            'cvc4/cvc5',
            'Gecode',
            'Chuffed',
            'HiGHS',
            'SCIP',
            'Gurobi'
        ],
        repo: 'https://github.com/francescobaio/multiple_couriers_CVRP',
        demo: '',
        year: 2024
    },
    {
        id: 'opencv-instance-detection',
        name: 'OpenCV Instance Detection — Product Recognition on Shelves',
        description:
            'Computer-vision pipeline to detect single and multiple instances of food products on store shelves. Uses SIFT feature matching + RANSAC homography for robust localization, LAB-space color consistency via KL divergence, and median/bilateral filtering to denoise real-world scenes. Outputs instance counts and bounding boxes.',
        tech: [
            'Python',
            'OpenCV',
            'SIFT',
            'RANSAC Homography',
            'LAB color histograms',
            'KL divergence',
            'Median/Bilateral filtering'
        ],
        repo: 'https://github.com/francescobaio/opencv-instance-detection',
        demo: '',
        year: 2024,
    },
    {
        id: 'grocery-store-cnn',
        name: 'Grocery Store CNN — Product Classification on Shelves',
        description:
            'End-to-end product classification for grocery shelves. Part 1: custom VGG-inspired CNN with ablations (no BN, fewer channels/convs/blocks). Part 2: transfer learning with ResNet-18, improved with data augmentation and a dropout-enhanced FC head + smaller batch size. Pipeline includes resizing/center-crop, flips/rotations/color jitter, and delivers target-range validation accuracy (≈80–90%).',
        tech: [
            'PyTorch',
            'CNN',
            'ResNet-18 (fine-tuning)',
            'Data Augmentation',
            'Dropout',
            'BatchNorm',
        ],
        repo: 'https://github.com/francescobaio/grocery_store_cnn',
        demo: '',
        year: 2024
    },
    {
        id: 'smm-homeworks',
        name: 'SMM Homeworks — Advanced Statistical & ML Solutions',
        description:
            'A collection of four homework solutions with code and analysis: Linear Algebra & Floating-Point arithmetic, SVD & PCA for ML, Optimization via Gradient Descent & SGD, MLE & MAP. Each notebook includes clean implementations, plots, and short theoretical discussions.',
        tech: [
            'NumPy',
            'SciPy',
            'scikit-learn',
            'Jupyter',
            'Matplotlib'
        ],
        repo: 'https://github.com/francescobaio/SMMhomeworks',
        demo: '',
        year: 2024
    },
    {
        id: 'sentence-reordering',
        name: 'Sentence Reordering with Transformers',
        description:
            'Transformer-based model that reorders shuffled sentences into coherent paragraphs. Includes clean preprocessing (tokenization/padding), custom validation callback and Cosine Decay with Restarts for training. Experiments and ablations; best test score ≈0.573.',
        tech: [
            'TensorFlow',
            'Keras',
            'Transformer',
            'NLP',
            'Cosine Decay Restarts',
            'Custom Callback',
            'Jupyter'
        ],
        repo: 'https://github.com/francescobaio/Sentence_Reordering',
        demo: '',
        year: 2024
    },
    {
        id: 'searchart',
        name: 'SearchArt — Artwork Discovery (YOLOv3)',
        description:
            'Framework-free web app (HTML/CSS/JS/PHP) that lets users upload custom image datasets and search artworks by speaking a label. Uses YOLOv3 object detection to match objects semantically related to the spoken word, with a preloaded tagged set for quick testing and an included project presentation.',
        tech: [
            'HTML', 'CSS', 'JavaScript', 'PHP',
            'YOLOv3', 'Object Detection',
            'Web Speech API (voice input)'
        ],
        repo: 'https://github.com/francescobaio/SearchArt',
        demo: '',
        year: 2023
    },
    {
        id: 'gaussian-bn',
        name: 'Gaussian-BN — Climate Network Reconstruction from Geospatial Time Series',
        description:
            'Early-stage library to reconstruct climate-related networks from geospatial time-series data. Performance-critical routines are implemented in Fortran and exposed via F2PY; includes tests to validate extension modules.',
        tech: [
            'bayes-nets',
            'Fortran',
            'F2PY',
            'NumPy',
            'CMake',
        ],
        repo: 'https://github.com/niccolozanotti/gaussian-bn',
        demo: '',
        year: 2025,
        status: 'in-progress',
    },
    {
        id: 'mlcv-streethazards',
        name: 'MLCV — Anomaly Segmentation on StreetHazards',
        description:
            'Open-set / anomaly segmentation for autonomous driving scenes using the StreetHazards dataset. Focus on predicting closed-set classes (mIoU) while detecting unexpected objects (AUPR). Includes baselines (e.g., Standardized Max Logits), ablations, and clear qualitative visualizations.',
        tech: [
            'PyTorch',
            'Semantic Segmentation',
            'Open-Set / OoD',
            'StreetHazards',
            'mIoU',
            'AUPR'
        ],
        repo: 'https://github.com/CVLAB-Unibo/ml4cv-assignment',
        demo: '',
        year: 2025,
        status: 'in-progress',
    },
    {
        id: 'bonita-minerva',
        name: 'BONITA — Italian LLM experiments on Minerva',
        description:
            'Hands-on experiments on an Italian LLM (Minerva): adapters/fine-tuning, prompt design, and evaluation.',
        tech: ['LLM', 'Adapters/LoRA', 'Evaluation', 'Prompting'],
        repo: 'https://huggingface.co/sapienzanlp/Minerva-1B-base-v1.0',
        demo: '',
        year: 2025,
        status: 'in-progress',
    },
    {
        id: 'cv-bias-mitigation',
        name: 'CV Bias — mitigation techniques',
        description:
            'Ethics-focused follow-up: evaluate and prototype mitigation strategies for bias introduced in CV parsing/selection pipelines.',
        tech: ['Fairness', 'Mitigation', 'NLP'],
        repo: 'https://github.com/francescobaio/hiring_cv_bias',
        demo: '',
        year: 2025,
        status: 'in-progress',
    },
];

export default projects;
