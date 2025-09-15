import Prompt from './Prompt';
import type { UseTerminalReturn } from '../features/terminal/useTerminal';

type Props = {
    term: UseTerminalReturn;
    heightClass?: string;
};

export default function Terminal({ term, heightClass = 'h-[50vh] md:h-[65vh]' }: Props) {
    const {
        history,
        input,
        setInput,
        onSubmit,
        runCommand,
        promptPlain,
        scrollRef,
    } = term;

    return (
        <div className="rounded-2xl overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-800 min-w-0">
            {/* window header */}
            <div className="flex items-center justify-between px-3 py-2 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-red-400" />
                    <span className="inline-block w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="inline-block w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">bash — /home/francesco</div>
            </div>

            {/* history */}
            <div ref={scrollRef as any} className={`${heightClass} overflow-y-auto bg-neutral-50 dark:bg-neutral-950 px-4 py-3`}>
                <div className="text-neutral-500 dark:text-neutral-400 text-xs mb-2">
                    Last login: {new Date().toDateString()} on ttys001
                </div>

                <div className="mt-3 space-y-2">
                    {history.map((line, i) => {
                        if (line.startsWith(promptPlain)) {
                            const cmd = line.slice(promptPlain.length);
                            return (
                                <div key={i} className="whitespace-pre-wrap break-words flex items-center gap-2">
                                    <Prompt />
                                    <span className="text-emerald-700 dark:text-emerald-400">{cmd}</span>
                                </div>
                            );
                        }
                        return (
                            <div key={i} className="whitespace-pre-wrap break-words">
                                {line.startsWith('# ') ? (
                                    <div className="text-emerald-700 dark:text-emerald-400">{line}</div>
                                ) : (
                                    line
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* input */}
            <form onSubmit={onSubmit} className="flex items-center gap-2 px-4 py-3 bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
                <Prompt />
                <input
                    autoFocus
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="type a command and hit Enter (e.g., help)"
                    className="flex-1 bg-transparent outline-none placeholder:text-neutral-400"
                    aria-label="terminal-input"
                />
            </form>

            {/* quick buttons */}
            <div className="px-4 py-2 flex flex-wrap gap-2 text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900">
                {['help', 'whoami', 'ls projects/', 'contact', 'cv'].map((cmd) => (
                    <button
                        key={cmd}
                        onClick={() => runCommand(cmd)}
                        className="px-2 py-1 rounded border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600"
                    >
                        {cmd}
                    </button>
                ))}
            </div>
        </div>
    );
}
