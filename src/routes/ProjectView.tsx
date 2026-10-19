import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import PageHeader from '../components/layout/PageHeader';
import { projects } from '../data/projects';
import { parseRepo, useReadme } from '../lib/github';

const sorted = [...projects].sort((a, b) => b.year - a.year);

const SPINNER = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';

function Spinner() {
    const [i, setI] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setI((n) => (n + 1) % SPINNER.length), 80);
        return () => clearInterval(t);
    }, []);
    return <span className="text-emerald-600 dark:text-emerald-400">{SPINNER[i]}</span>;
}

export default function ProjectView({ id }: { id: string }) {
    const index = sorted.findIndex((p) => p.id === id);
    const p = sorted[index];
    const repo = parseRepo(p?.repo);
    const readme = useReadme(repo);

    if (!p) {
        return (
            <div className="min-w-0">
                <PageHeader path={['projects', id]} command="cat README.md" />
                <div className="text-rose-600 dark:text-rose-400">cd: projects/{id}: No such file or directory</div>
                <a href="/projects" className="mt-2 inline-block text-sm underline text-emerald-700 dark:text-emerald-400">← back to projects</a>
            </div>
        );
    }

    const wip = p.status === 'in-progress';
    const prev = sorted[index - 1];
    const next = sorted[index + 1];

    // README in-page links (#section) are rewritten to data-anchor: scroll instead of changing the route.
    const onReadmeClick = (e: MouseEvent<HTMLDivElement>) => {
        const a = (e.target as HTMLElement).closest('a[data-anchor]');
        if (!a) return;
        e.preventDefault();
        document.getElementById(a.getAttribute('data-anchor')!)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="min-w-0">
            <PageHeader path={['projects', p.id]} command="cat README.md" />

            {/* summary card */}
            <div className="term-card rounded-xl p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <h1 className="text-xl sm:text-2xl font-semibold leading-tight">{p.name}</h1>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                        <span className={`inline-block w-2 h-2 rounded-full ${wip ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
                        {wip ? 'in progress' : 'completed'} · {p.year}
                    </div>
                </div>
                <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                        <span key={t} className="text-[11px] px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
                            {t}
                        </span>
                    ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                    {p.repo && (
                        <a href={p.repo} target="_blank" rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg border border-emerald-400/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition">
                            → GitHub ↗
                        </a>
                    )}
                    {p.demo && (
                        <a href={p.demo} target="_blank" rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg border border-sky-400/60 text-sky-700 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition">
                            → Demo ↗
                        </a>
                    )}
                </div>
            </div>

            {/* README from GitHub */}
            <div className="mt-8">
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                    <span className="text-emerald-700 dark:text-emerald-400">$</span> curl github.com/{repo ? `${repo.owner}/${repo.repo}` : '…'}/README.md
                </div>

                {readme.status === 'loading' && (
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        <Spinner /> fetching README…
                    </div>
                )}
                {readme.status === 'error' && (
                    <div className="text-sm">
                        <div className="text-rose-600 dark:text-rose-400">curl: could not load the README ({readme.message})</div>
                        {p.repo && (
                            <a href={p.repo} target="_blank" rel="noreferrer" className="mt-1 inline-block underline text-emerald-700 dark:text-emerald-400">
                                read it on GitHub ↗
                            </a>
                        )}
                    </div>
                )}
                {readme.status === 'ok' && (
                    <div
                        className="readme page-in rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/70 p-4 sm:p-8"
                        onClick={onReadmeClick}
                        dangerouslySetInnerHTML={{ __html: readme.html }}
                    />
                )}
            </div>

            {/* prev / next */}
            <nav className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {prev ? (
                    <a href={`/projects/${prev.id}`} className="term-card rounded-xl p-3">
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">← cd ../{prev.id}</div>
                        <div className="mt-1 font-semibold">{prev.name}</div>
                    </a>
                ) : (
                    <a href="/projects" className="term-card rounded-xl p-3">
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">← cd ..</div>
                        <div className="mt-1 font-semibold">All projects</div>
                    </a>
                )}
                {next ? (
                    <a href={`/projects/${next.id}`} className="term-card rounded-xl p-3 sm:text-right">
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">cd ../{next.id} →</div>
                        <div className="mt-1 font-semibold">{next.name}</div>
                    </a>
                ) : (
                    <a href="/projects" className="term-card rounded-xl p-3 sm:text-right">
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">cd .. →</div>
                        <div className="mt-1 font-semibold">All projects</div>
                    </a>
                )}
            </nav>
        </div>
    );
}
