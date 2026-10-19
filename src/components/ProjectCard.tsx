import type { CSSProperties } from 'react';
import type { Project } from '../types';

type Props = {
    p: Project;
    active?: boolean;
    onOpen?: (id: string) => void;
    // when set, tech tags become filter buttons
    onTagClick?: (tag: string) => void;
    activeTag?: string | null;
    style?: CSSProperties;
    compact?: boolean;
};

export default function ProjectCard({ p, active = false, onOpen, onTagClick, activeTag, style, compact = false }: Props) {
    const wip = p.status === 'in-progress';
    const tags = activeTag && p.tech.includes(activeTag)
        ? [activeTag, ...p.tech.filter((t) => t !== activeTag)].slice(0, 4)
        : p.tech.slice(0, compact ? 3 : 4);

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => onOpen?.(p.id)}
            onKeyDown={(e) => {
                // ignore keys bubbling up from the inner links and tags
                if (e.target !== e.currentTarget) return;
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpen?.(p.id);
                }
            }}
            style={style}
            className={`term-card rounded-xl ${compact ? 'p-3.5' : 'p-3.5 sm:p-4'} cursor-pointer ${active ? 'term-card-active' : ''}`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="text-[15px] sm:text-base leading-snug font-semibold text-neutral-900 dark:text-neutral-100">{p.name}</div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                    <span
                        className={`inline-block w-2 h-2 rounded-full ${wip ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`}
                        title={wip ? 'in progress' : 'completed'}
                    />
                    {p.year}
                </div>
            </div>

            <p className={`mt-2 text-[13px] text-neutral-700 dark:text-neutral-300 ${compact ? 'line-clamp-2' : 'line-clamp-2 sm:line-clamp-3'}`}>
                {p.description}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                {tags.map((t, i) => {
                    const cls = `${i >= 3 ? 'hidden sm:inline-block' : ''} text-[10px] px-2 py-1 rounded border transition ${t === activeTag
                        ? 'border-emerald-400 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                        : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                        }`;
                    return onTagClick ? (
                        <button
                            key={t}
                            type="button"
                            title={`filter by ${t}`}
                            onClick={(e) => { e.stopPropagation(); onTagClick(t); }}
                            className={`${cls} hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-400`}
                        >
                            {t}
                        </button>
                    ) : (
                        <span key={t} className={cls}>{t}</span>
                    );
                })}
            </div>

            <div className="mt-3 flex items-center gap-4 sm:gap-3 text-sm">
                {p.repo && (
                    <a
                        href={p.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-emerald-700 dark:text-emerald-400 hover:text-emerald-600"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Repo
                    </a>
                )}
                {p.demo && (
                    <a
                        href={p.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-sky-700 dark:text-sky-400 hover:text-sky-600"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Demo
                    </a>
                )}
            </div>
        </div>
    );
}
