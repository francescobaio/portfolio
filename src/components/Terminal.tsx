import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Prompt from './Prompt';
import Entry from './terminal/Entry';
import { useTerm } from '../features/terminal/context';

// Avoid popping up the on-screen keyboard on touch devices.
const finePointer = window.matchMedia?.('(pointer: fine)').matches ?? true;

const QUICK_COMMANDS = ['help', 'whoami', 'ls projects/', 'experience', 'snake', 'contact', 'cv'];

type Props = {
    heightClass?: string;
    autoFocus?: boolean;
    // shown in the palette, where Esc closes the window
    onClose?: () => void;
    // from md up, stretch to the parent's height instead of using heightClass
    fill?: boolean;
};

export default function Terminal({ heightClass = 'h-[50vh] md:h-[65vh]', autoFocus = finePointer, onClose, fill = false }: Props) {
    const term = useTerm();
    const { history, input, setInput, suggestion, path, onSubmit, onKeyDown, runCommand, clear, lastCommand, inputRef } = term;

    const scrollRef = useRef<HTMLDivElement>(null);
    const [caret, setCaret] = useState(0);
    const [focused, setFocused] = useState(false);
    const [loginDate] = useState(() => new Date().toDateString());
    const [minimized, setMinimized] = useState(false);
    const [maximized, setMaximized] = useState(false);

    // Keep the view pinned to the bottom, also while output is being typed out.
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const toBottom = () => { el.scrollTop = el.scrollHeight; };
        const observer = new MutationObserver(toBottom);
        observer.observe(el, { childList: true, subtree: true, characterData: true });
        toBottom();
        return () => observer.disconnect();
    }, [minimized]);

    // When the input is replaced programmatically (history, autocomplete) put the caret at the end.
    const typed = useRef(false);
    useLayoutEffect(() => {
        if (typed.current) {
            typed.current = false;
            return;
        }
        inputRef.current?.setSelectionRange(input.length, input.length);
        setCaret(input.length);
    }, [input, inputRef]);

    // Esc leaves full screen.
    useEffect(() => {
        if (!maximized) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMaximized(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [maximized]);

    const syncCaret = () => setCaret(inputRef.current?.selectionStart ?? input.length);

    // Click anywhere in the terminal to focus the prompt, unless the user is selecting text.
    const focusInput = () => {
        if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
    };

    const showSuggestion = focused && suggestion && caret === input.length;

    const windowButton = 'inline-block w-3 h-3 rounded-full transition hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500';

    return (
        <>
            {maximized && <div className="fixed inset-0 z-40 bg-neutral-950/40 backdrop-blur-sm" onClick={() => setMaximized(false)} />}
            <div
                className={`term-shell rounded-2xl overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-800 min-w-0 bg-neutral-50 dark:bg-neutral-950 ${maximized ? 'fixed inset-3 sm:inset-8 z-50 flex flex-col shadow-2xl' : fill ? 'md:h-full md:flex md:flex-col' : ''
                    }`}
            >
                {/* window header */}
                <div className="flex items-center justify-between gap-3 px-3 py-2 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-2 shrink-0">
                        <button type="button" onClick={onClose ?? clear} className={`${windowButton} bg-red-400`}
                            title={onClose ? 'Close (Esc)' : 'Clear'} aria-label={onClose ? 'Close terminal' : 'Clear terminal'} />
                        <button type="button" onClick={() => setMinimized((v) => !v)} className={`${windowButton} bg-yellow-400`}
                            title={minimized ? 'Restore' : 'Minimize'} aria-label="Minimize terminal" />
                        <button type="button" onClick={() => setMaximized((v) => !v)} className={`${windowButton} bg-green-400`}
                            title={maximized ? 'Exit full screen (Esc)' : 'Full screen'} aria-label="Toggle full screen" />
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                        francesco@portfolio: {path} — {lastCommand?.split(/\s+/)[0] ?? 'bash'}
                    </div>
                </div>

                {!minimized && (
                    <>
                        {/* history + prompt */}
                        <div
                            ref={scrollRef}
                            onClick={focusInput}
                            className={`${maximized ? 'flex-1' : `${heightClass} ${fill ? 'md:h-auto md:flex-1 md:min-h-0' : ''}`} overflow-y-auto overscroll-contain term-screen px-3 sm:px-4 py-3 text-[13px] sm:text-sm cursor-text`}
                        >
                            <div className="text-neutral-500 dark:text-neutral-400 text-xs mb-3">
                                Last login: {loginDate} on ttys001
                            </div>

                            <div className="space-y-2">
                                {history.map((entry) => (
                                    <Entry key={entry.id} entry={entry} term={term} />
                                ))}
                            </div>

                            {/* input line */}
                            <form onSubmit={onSubmit} className="mt-2 flex flex-wrap items-center gap-x-2">
                                <Prompt path={path} />
                                <div className="relative flex-1 min-w-[8rem]">
                                    <input
                                        ref={inputRef}
                                        autoFocus={autoFocus}
                                        value={input}
                                        onChange={(e) => {
                                            typed.current = true;
                                            setInput(e.target.value);
                                            setCaret(e.target.selectionStart ?? e.target.value.length);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Escape' && onClose) return onClose();
                                            onKeyDown(e);
                                        }}
                                        onKeyUp={syncCaret}
                                        onSelect={syncCaret}
                                        onFocus={() => setFocused(true)}
                                        onBlur={() => setFocused(false)}
                                        autoComplete="off"
                                        autoCapitalize="off"
                                        autoCorrect="off"
                                        spellCheck={false}
                                        aria-label="terminal-input"
                                        // 16px: iOS zooms the page when focusing a smaller input
                                        className="absolute inset-0 w-full opacity-0 text-base"
                                    />
                                    <div aria-hidden className="whitespace-pre overflow-hidden">
                                        {input.slice(0, caret)}
                                        <span className={`term-cursor ${focused ? 'term-cursor-active' : ''}`}>
                                            {input[caret] ?? (showSuggestion ? suggestion[0] : ' ')}
                                        </span>
                                        {input.slice(caret + 1)}
                                        {showSuggestion && (
                                            <span className="text-neutral-400 dark:text-neutral-600">{suggestion.slice(1)}</span>
                                        )}
                                        {!input && !focused && (
                                            <span className="text-neutral-400 dark:text-neutral-500"> {finePointer ? 'click' : 'tap'} here and type `help`</span>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* quick buttons */}
                        <div className="px-3 sm:px-4 py-2 flex flex-nowrap sm:flex-wrap overflow-x-auto scroll-strip items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
                            {QUICK_COMMANDS.map((cmd) => (
                                <button
                                    key={cmd}
                                    type="button"
                                    onClick={() => runCommand(cmd)}
                                    className="shrink-0 whitespace-nowrap px-2.5 py-1.5 sm:px-2 sm:py-1 rounded border border-neutral-200 dark:border-neutral-800 hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                                >
                                    <span className="opacity-50">$ </span>{cmd}
                                </button>
                            ))}
                            <span className="ml-auto hidden lg:inline opacity-60">Tab ⇥ complete · → accept · ↑↓ history</span>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
