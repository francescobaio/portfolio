import type { Project } from '../types';

type Props = {
    p: Project;
    active?: boolean;
    onOpen?: (id: string) => void;
};

export default function ProjectCard({ p, active = false, onOpen }: Props) {
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => onOpen?.(p.id)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen?.(p.id)}
            className={`border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 hover:border-neutral-300 dark:hover:border-neutral-600 transition cursor-pointer ${active ? 'ring-1 ring-emerald-300/60' : ''
                }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="text-base font-semibold text-neutral-900 dark:text-neutral-100">{p.name}</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">{p.year}</div>
            </div>

            <p
                className="mt-2 text-[13px] text-neutral-700 dark:text-neutral-300 overflow-hidden text-ellipsis"
                style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
            >
                {p.description}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
                {p.tech.slice(0, 4).map((t) => (
                    <span
                        key={t}
                        className="text-[10px] px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400"
                    >
                        {t}
                    </span>
                ))}
            </div>

            <div className="mt-3 flex items-center gap-3 text-sm">
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
                        className="underline text-sky-700 hover:text-sky-600"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Demo
                    </a>
                )}
            </div>
        </div>
    );
}
