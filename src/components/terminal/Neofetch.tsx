import type { CSSProperties } from 'react';
import type { StackRow } from '../../features/terminal/useTerminal';

const LOGO = String.raw`
███████╗██████╗
██╔════╝██╔══██╗
█████╗  ██████╔╝
██╔══╝  ██╔══██╗
██║     ██████╔╝
╚═╝     ╚═════╝`.slice(1);

const PALETTE = [
    'bg-neutral-800', 'bg-rose-500', 'bg-emerald-500', 'bg-amber-400',
    'bg-sky-500', 'bg-fuchsia-500', 'bg-cyan-400', 'bg-neutral-200',
];

const SUGGESTIONS = ['whoami', 'ls projects/', 'experience', 'snake', 'matrix'];

type Props = {
    stats: { projects: number; posts: number; stack: StackRow[] };
    run: (cmd: string) => void;
};

export default function Neofetch({ stats, run }: Props) {
    const info: [string, string][] = [
        ['Role', 'MSc student, Artificial Intelligence @ UniBo'],
        ['Focus', 'Vision-Language Models · Document AI'],
        ['Previous', 'AI intern @ LetXbe AI (Station F, Paris)'],
        ['Projects', String(stats.projects)],
        ['Posts', String(stats.posts)],
        ['Stack', stats.stack.slice(0, 3).map((s) => s.name).join(', ')],
    ];
    const rows = info.length + 2;
    const stagger = (i: number): CSSProperties => ({ animationDelay: `${i * 60}ms` });

    return (
        <div>
            <div className="flex gap-6">
                <pre className="hidden sm:block term-row term-glow text-emerald-600 dark:text-emerald-400 leading-[1.15] text-[11px] select-none">
                    {LOGO}
                </pre>
                <div className="min-w-0">
                    <div className="term-row font-semibold" style={stagger(0)}>
                        <span className="text-emerald-700 dark:text-emerald-400 term-glow">francesco</span>
                        <span className="text-neutral-500">@</span>
                        <span className="text-emerald-700 dark:text-emerald-400 term-glow">portfolio</span>
                    </div>
                    <div className="term-row text-neutral-400 dark:text-neutral-600" style={stagger(1)}>
                        ───────────────────
                    </div>
                    {info.map(([k, v], i) => (
                        <div key={k} className="term-row break-words" style={stagger(i + 2)}>
                            <span className="text-sky-700 dark:text-sky-400 font-semibold">{k}:</span> {v}
                        </div>
                    ))}
                    <div className="term-row mt-2 flex gap-0.5" style={stagger(rows)}>
                        {PALETTE.map((c) => (
                            <span key={c} className={`inline-block w-4 h-3 ${c}`} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="term-row mt-3 text-neutral-500 dark:text-neutral-400" style={stagger(rows + 1)}>
                Type{' '}
                <button type="button" onClick={() => run('help')} className="text-emerald-700 dark:text-emerald-400 hover:underline">
                    help
                </button>{' '}
                to get started, or try:{' '}
                {SUGGESTIONS.map((cmd, i) => (
                    <span key={cmd}>
                        {i > 0 && ' · '}
                        <button type="button" onClick={() => run(cmd)} className="text-emerald-700 dark:text-emerald-400 hover:underline">
                            {cmd}
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
}
