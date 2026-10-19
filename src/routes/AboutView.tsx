import PageHeader from '../components/layout/PageHeader';
import { timeline } from '../data/timeline';
import type { TimelineEntry } from '../types';

const KIND: Record<TimelineEntry['kind'], { label: string; dot: string; text: string }> = {
    work: { label: 'work', dot: 'border-emerald-500', text: 'text-emerald-700 dark:text-emerald-400' },
    education: { label: 'edu', dot: 'border-sky-500', text: 'text-sky-700 dark:text-sky-400' },
    award: { label: 'award', dot: 'border-amber-500', text: 'text-amber-600 dark:text-amber-400' },
};

export default function AboutView() {
    return (
        <div className="min-w-0">
            <PageHeader
                path={['about']}
                command="cat experience.log"
                title="About"
                subtitle="Where I've studied and worked, newest first."
            />

            <ol className="relative max-w-3xl">
                {timeline.map((e, i) => {
                    const k = KIND[e.kind];
                    return (
                        <li
                            key={`${e.org}-${e.title}`}
                            className="relative pl-6 sm:pl-8 pb-5 sm:pb-8 last:pb-0 term-row"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            {/* rail + dot */}
                            {i < timeline.length - 1 && (
                                <span className="absolute left-[7px] top-4 bottom-0 w-px bg-neutral-300 dark:bg-neutral-700" />
                            )}
                            <span className={`absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 bg-white dark:bg-neutral-950 ${k.dot}`} />

                            <div className="term-card rounded-xl p-3.5 sm:p-4 -mt-2">
                                <div className="flex flex-wrap items-baseline gap-x-2 text-xs">
                                    <span className={k.text}>[{k.label}]</span>
                                    {e.period && <span className="text-neutral-500 dark:text-neutral-400">{e.period}</span>}
                                    <span className="text-neutral-500 dark:text-neutral-400">· {e.place}</span>
                                </div>
                                <div className="mt-1 text-base sm:text-lg font-semibold">{e.title}</div>
                                <div className="text-sm text-neutral-600 dark:text-neutral-400">{e.org}</div>
                                <ul className="mt-2 text-[13px] text-neutral-700 dark:text-neutral-300 space-y-1">
                                    {e.bullets.map((b) => (
                                        <li key={b} className="flex gap-2">
                                            <span className={`shrink-0 ${k.text}`}>▸</span>
                                            <span>{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}
