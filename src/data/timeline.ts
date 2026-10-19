import type { TimelineEntry } from '../types';

// Newest first.
export const timeline: TimelineEntry[] = [
    {
        kind: 'work',
        title: 'AI Intern — Document AI',
        org: 'LetXbe AI',
        place: 'Paris (Station F)',
        period: 'Feb 2026 – Jun 2026',
        bullets: [
            'Benchmarked open-weight Vision-Language Models for Document VQA on PDFs, scans, forms and tables.',
            'Improved the evaluation pipeline: dataset quality, ground-truth validation, error analysis, reproducibility.',
            'Studied how prompt format, image resolution and input representation affect VLM performance.',
            'Investigated interpretability via attention maps to locate the visual evidence behind each answer — the basis of my MSc thesis.',
        ],
    },
    {
        kind: 'education',
        title: 'MSc in Artificial Intelligence',
        org: 'University of Bologna',
        place: 'Bologna, Italy',
        period: 'Sep 2023 – present',
        bullets: [
            'Machine Learning, Deep Learning, Computer Vision, NLP, Data Mining.',
            'Awarded ERGO Scholarship.',
        ],
    },
    {
        kind: 'education',
        title: 'BSc in Computer Engineering — 110/110 cum laude',
        org: 'University of Florence',
        place: 'Florence, Italy',
        period: 'Sep 2019 – Apr 2023',
        bullets: [
            'Thesis: anomaly detection in intracardiac EGMs with dictionary learning, supervised by Prof. Paolo Frasconi.',
            'Received the DSU Scholarship three times.',
        ],
    },
    {
        kind: 'work',
        title: 'Website Developer',
        org: 'Terminillo Trekking 360',
        place: 'Rieti, Italy',
        period: 'Feb 2020 – Apr 2020',
        bullets: [
            'Built and maintained the WordPress site for booking outdoor events.',
            'Improved SEO with Google Search Console and streamlined the reservation flow.',
        ],
    },
    {
        kind: 'award',
        title: 'Winner — School Chess Team National Championship (Juniores)',
        org: 'Trofeo Scacchi Scuola',
        place: 'Montesilvano, Italy',
        period: '2019',
        bullets: ['National title with my high-school chess team.'],
    },
    {
        kind: 'education',
        title: 'High-school diploma (scientific)',
        org: 'Liceo Scientifico Carlo Jucci',
        place: 'Rieti, Italy',
        period: 'Sep 2014 – Jul 2019',
        bullets: ['Advanced mathematics, physics and introductory programming.'],
    },
    {
        kind: 'award',
        title: 'National Final Award — Best Business Plan',
        org: 'Junior Achievement Italy (Impresa in Azione)',
        place: 'Milan, Italy',
        period: 'May 2018',
        bullets: ['Created a mini-enterprise with a student team and wrote its business plan.'],
    },
];
