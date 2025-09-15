import { useMemo, useState } from 'react';
import ProjectGrid from '../components/ProjectGrid';
import { projects } from '../data/projects';

type Filter = 'completed' | 'in-progress';

export default function ProjectsView() {
    // Default: show finished projects
    const [filter, setFilter] = useState<Filter>('completed');

    const counts = useMemo(() => {
        const inProg = projects.filter(p => p.status === 'in-progress').length;
        const completed = projects.length - inProg;
        return { inProg, completed };
    }, []);

    const items = useMemo(() => {
        const byUpdatedDesc = (a: typeof projects[number], b: typeof projects[number]) =>
            (b.year - a.year);
        const byYearDesc = (a: typeof projects[number], b: typeof projects[number]) =>
            b.year - a.year;

        if (filter === 'in-progress') {
            return projects
                .filter(p => p.status === 'in-progress')
                .sort(byUpdatedDesc);
        }
        return projects
            .filter(p => p.status !== 'in-progress') // includes undefined
            .sort(byYearDesc);
    }, [filter]);

    return (
        <div className="min-w-0">
            {/* Header */}
            <div className="mb-4 md:mb-6 flex items-center justify-between gap-3">
                <div className="text-lg font-semibold">Projects</div>
                <a href="#/" className="text-sm underline text-emerald-700 dark:text-emerald-400">
                    ← Back home
                </a>
            </div>

            {/* Filter bar: Completed | In progress */}
            <div className="mb-4 flex flex-wrap items-center gap-2" role="tablist" aria-label="Project filters">
                <FilterChip
                    label={`Completed (${counts.completed})`}
                    active={filter === 'completed'}
                    onClick={() => setFilter('completed')}
                />
                <FilterChip
                    label={`In progress (${counts.inProg})`}
                    active={filter === 'in-progress'}
                    onClick={() => setFilter('in-progress')}
                />
            </div>

            {/* Grid */}
            <ProjectGrid
                items={items}
                cols="grid-cols-1 sm:grid-cols-2"
                onOpen={(id) => {
                    const p = items.find(it => it.id === id);
                    const url = p?.repo || p?.demo;
                    if (url) window.open(url, '_blank', 'noopener,noreferrer');
                }}
            />
        </div>
    );
}

function FilterChip({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            role="tab"
            aria-selected={active}
            onClick={onClick}
            className={[
                'text-sm px-3 py-1.5 rounded-lg border transition',
                active
                    ? 'border-neutral-400 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700',
            ].join(' ')}
        >
            {label}
        </button>
    );
}
