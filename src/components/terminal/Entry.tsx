import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Prompt from '../Prompt';
import Neofetch from './Neofetch';
import Snake from './Snake';
import Matrix from './Matrix';
import { timeline } from '../../data/timeline';
import TypedText from './TypedText';
import { COMMANDS } from '../../features/terminal/commands';
import type { HistoryEntry, Tone, UseTerminalReturn } from '../../features/terminal/useTerminal';
import { shortHash } from '../../lib/format';

const TONES: Record<Tone, string> = {
    default: '',
    muted: 'text-neutral-500 dark:text-neutral-400',
    accent: 'text-emerald-700 dark:text-emerald-400 font-semibold term-glow',
    error: 'text-rose-600 dark:text-rose-400',
};

// Fades rows in one after the other.
const stagger = (i: number): CSSProperties => ({ animationDelay: `${i * 35}ms` });

function CmdLink({ cmd, run, className = '', children }: {
    cmd: string;
    run: (c: string) => void;
    className?: string;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={() => run(cmd)}
            title={`run: ${cmd}`}
            className={`text-left hover:underline underline-offset-2 ${className || 'text-emerald-700 dark:text-emerald-400'}`}
        >
            {children}
        </button>
    );
}

type Props = {
    entry: HistoryEntry;
    term: UseTerminalReturn;
};

export default function Entry({ entry, term }: Props) {
    // Only entries printed just now animate; older ones render instantly when the terminal remounts.
    const [fresh] = useState(() => Date.now() - entry.at < 1500);
    return (
        <div className={fresh ? '' : 'no-anim'}>
            <EntryBody entry={entry} term={term} fresh={fresh} />
        </div>
    );
}

function EntryBody({ entry, term, fresh }: Props & { fresh: boolean }) {
    const run = term.runCommand;

    switch (entry.kind) {
        case 'command':
            return (
                <div className="flex flex-wrap items-center gap-x-2 break-words">
                    <Prompt path={entry.path} />
                    <span className="text-neutral-900 dark:text-neutral-100">{entry.text}</span>
                </div>
            );

        case 'text':
            return (
                <div className={`whitespace-pre-wrap break-words ${TONES[entry.tone ?? 'default']}`}>
                    <TypedText text={entry.text} animate={fresh} />
                </div>
            );

        case 'banner':
            return <Neofetch stats={term.stats} run={run} />;

        case 'help':
            return (
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5">
                    <div className="col-span-2 text-neutral-500 dark:text-neutral-400 mb-1">
                        Available commands (click to run · Tab to complete · → to accept a suggestion):
                    </div>
                    {COMMANDS.map((c, i) => (
                        <div key={c.usage} className="contents">
                            <div className="term-row" style={stagger(i)}>
                                <CmdLink cmd={c.example} run={run}>{c.usage}</CmdLink>
                            </div>
                            <div className="term-row text-neutral-600 dark:text-neutral-400" style={stagger(i)}>
                                {c.description}
                            </div>
                        </div>
                    ))}
                </div>
            );

        case 'files':
            return (
                <div className="flex flex-wrap gap-x-5 gap-y-0.5">
                    {entry.items.map((f, i) => {
                        const isDir = f.endsWith('/');
                        return (
                            <span key={f} className="term-row" style={stagger(i)}>
                                <CmdLink
                                    cmd={isDir ? `cd ${f}` : `cat ${f}`}
                                    run={run}
                                    className={isDir ? 'text-sky-700 dark:text-sky-400 font-semibold' : 'text-neutral-800 dark:text-neutral-200'}
                                >
                                    {f}
                                </CmdLink>
                            </span>
                        );
                    })}
                </div>
            );

        case 'projects':
            if (!entry.items.length) return <div>&lt;empty&gt;</div>;
            return (
                <div className="space-y-0.5">
                    {entry.items.map((p, i) => (
                        <div key={p.id} className="term-row flex flex-wrap gap-x-3" style={stagger(i)}>
                            <span className="text-neutral-500 dark:text-neutral-400 w-10 shrink-0">{p.year}</span>
                            <CmdLink cmd={`open ${p.id}`} run={run}>{p.id}</CmdLink>
                            <span className="text-neutral-600 dark:text-neutral-400 truncate min-w-0 flex-1 hidden sm:inline">
                                {p.name}
                            </span>
                            {p.status === 'in-progress' && (
                                <span className="text-amber-600 dark:text-amber-400">● wip</span>
                            )}
                        </div>
                    ))}
                </div>
            );

        case 'posts':
            if (!entry.items.length) return <div>&lt;empty&gt;</div>;
            return (
                <div className="space-y-0.5">
                    {entry.items.map((p, i) => (
                        <div key={p.slug} className="term-row flex flex-wrap gap-x-3" style={stagger(i)}>
                            <span className="text-amber-600 dark:text-amber-400">{shortHash(p.slug)}</span>
                            <span className="text-neutral-500 dark:text-neutral-400">{p.date}</span>
                            <a href={`/blog/${p.slug}`} className="text-sky-700 dark:text-sky-400 hover:underline">
                                {p.title}
                            </a>
                        </div>
                    ))}
                </div>
            );

        case 'snake':
            return <Snake term={term} active={fresh} />;

        case 'matrix':
            return <Matrix term={term} active={fresh} />;

        case 'timeline':
            return (
                <div className="space-y-0.5">
                    {timeline.map((e, i) => (
                        <div key={`${e.org}-${e.title}`} className="term-row flex flex-wrap gap-x-3" style={stagger(i)}>
                            <span className="text-neutral-500 dark:text-neutral-400 w-44 shrink-0">{e.period || '—'}</span>
                            <span className={e.kind === 'work' ? 'text-emerald-700 dark:text-emerald-400' : e.kind === 'award' ? 'text-amber-600 dark:text-amber-400' : 'text-sky-700 dark:text-sky-400'}>
                                {e.title}
                            </span>
                            <span className="text-neutral-600 dark:text-neutral-400">@ {e.org}</span>
                        </div>
                    ))}
                    <div className="term-row pt-1" style={stagger(timeline.length)}>
                        <CmdLink cmd="cd about" run={run}>→ cd about</CmdLink>
                        <span className="text-neutral-500 dark:text-neutral-400"> for the full timeline</span>
                    </div>
                </div>
            );

        case 'stack': {
            const max = Math.max(1, ...entry.rows.map((r) => r.count));
            return (
                <div className="space-y-0.5">
                    {entry.rows.map((r, i) => (
                        <div key={r.name} className="term-row flex items-center gap-3" style={stagger(i)}>
                            <span className="w-28 sm:w-40 shrink-0 truncate">{r.name}</span>
                            <span className="flex-1 max-w-[12rem] h-2.5 rounded-sm bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                                <span
                                    className="block h-full bg-emerald-500 dark:bg-emerald-400 term-bar"
                                    style={{ width: `${(r.count / max) * 100}%`, ...stagger(i) }}
                                />
                            </span>
                            <span className="text-neutral-500 dark:text-neutral-400 tabular-nums">{r.count}</span>
                        </div>
                    ))}
                </div>
            );
        }
    }
}
