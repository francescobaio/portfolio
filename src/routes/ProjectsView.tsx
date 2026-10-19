import { useMemo, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import PageHeader from '../components/layout/PageHeader';
import { projects } from '../data/projects';
import { navigateTo } from '../lib/router';
import type { Project } from '../types';

type Filter = 'all' | 'completed' | 'wip';

const isWip = (p: Project) => p.status === 'in-progress';

const FILTERS: { key: Filter; test: (p: Project) => boolean }[] = [
    { key: 'all', test: () => true },
    { key: 'completed', test: (p) => !isWip(p) }, // a missing status counts as completed
    { key: 'wip', test: isWip },
];

const sorted = [...projects].sort((a, b) => b.year - a.year);

export default function ProjectsView() {
    const [filter, setFilter] = useState<Filter>('completed');
    const [query, setQuery] = useState('');
    const [tag, setTag] = useState<string | null>(null);

    const items = useMemo(() => {
        const q = query.trim().toLowerCase();
        const test = FILTERS.find((f) => f.key === filter)!.test;
        return sorted.filter(
            (p) =>
                test(p) &&
                (!tag || p.tech.includes(tag)) &&
                (!q || [p.id, p.name, p.description, ...p.tech].some((f) => f.toLowerCase().includes(q)))
        );
    }, [filter, query, tag]);

    // The page header shows the "command" equivalent to the current filters.
    const command = [
        `ls projects/ --${filter}`,
        tag && `--tech="${tag}"`,
        query.trim() && `| grep -i "${query.trim()}"`,
    ].filter(Boolean).join(' ');

    const reset = () => { setFilter('all'); setQuery(''); setTag(null); };

    return (
        <div className="min-w-0">
            <PageHeader path={['projects']} command={command} title="Projects" subtitle="Things I've built, studied and broken along the way." />

            {/* Controls */}
            <div className="mb-5 space-y-3">
                <label className="flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 px-3 py-2 text-sm focus-within:border-emerald-400 transition">
                    <span className="text-emerald-700 dark:text-emerald-400 shrink-0">$ grep -i</span>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="pytorch, segmentation, gnn…"
                        spellCheck={false}
                        className="flex-1 min-w-0 bg-transparent outline-none placeholder:text-neutral-400 text-base sm:text-sm"
                        aria-label="Search projects"
                    />
                    {query && (
                        <button type="button" onClick={() => setQuery('')} className="text-neutral-400 hover:text-neutral-600" aria-label="Clear search">✕</button>
                    )}
                </label>

                <div className="flex items-center gap-2 overflow-x-auto scroll-strip -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap" role="tablist" aria-label="Project filters">
                    {FILTERS.map((f) => (
                        <Flag
                            key={f.key}
                            label={`--${f.key}`}
                            count={projects.filter(f.test).length}
                            active={filter === f.key}
                            onClick={() => setFilter(f.key)}
                        />
                    ))}
                    {tag && (
                        <button
                            type="button"
                            onClick={() => setTag(null)}
                            className="shrink-0 whitespace-nowrap text-[13px] sm:text-sm px-3 py-1.5 rounded-lg border border-emerald-400 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
                            title="Remove tech filter"
                        >
                            --tech="{tag}" ✕
                        </button>
                    )}
                    <span className="ml-auto shrink-0 whitespace-nowrap text-xs text-neutral-500 dark:text-neutral-400">
                        {items.length} result{items.length === 1 ? '' : 's'}
                    </span>
                </div>
            </div>

            {/* Grid */}
            {items.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {items.map((p, i) => (
                        <ProjectCard
                            key={p.id}
                            p={p}
                            activeTag={tag}
                            onTagClick={(t) => setTag((cur) => (cur === t ? null : t))}
                            onOpen={() => navigateTo({ page: 'project', id: p.id })}
                            style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-6 text-sm">
                    <div className="text-rose-600 dark:text-rose-400">grep: no matches found</div>
                    <button type="button" onClick={reset} className="mt-2 underline text-emerald-700 dark:text-emerald-400">
                        reset filters
                    </button>
                </div>
            )}
        </div>
    );
}

function Flag({ label, count, active, onClick }: {
    label: string;
    count: number;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            role="tab"
            aria-selected={active}
            onClick={onClick}
            className={[
                'shrink-0 whitespace-nowrap text-[13px] sm:text-sm px-3 py-1.5 rounded-lg border transition',
                active
                    ? 'border-emerald-400 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700',
            ].join(' ')}
        >
            {label} <span className="opacity-60">({count})</span>
        </button>
    );
}
