import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, TouchEvent } from 'react';
import type { UseTerminalReturn } from '../../features/terminal/useTerminal';

const W = 22;
const H = 14;
const BEST_KEY = 'snake-best';

type Pt = [number, number];
type Game = { snake: Pt[]; food: Pt; score: number; over: boolean };

const UP: Pt = [0, -1];
const DOWN: Pt = [0, 1];
const LEFT: Pt = [-1, 0];
const RIGHT: Pt = [1, 0];

const KEYS: Record<string, Pt> = {
    ArrowUp: UP, w: UP, W: UP,
    ArrowDown: DOWN, s: DOWN, S: DOWN,
    ArrowLeft: LEFT, a: LEFT, A: LEFT,
    ArrowRight: RIGHT, d: RIGHT, D: RIGHT,
};

const same = (a: Pt, b: Pt) => a[0] === b[0] && a[1] === b[1];

function randomFood(snake: Pt[]): Pt {
    for (;;) {
        const p: Pt = [Math.floor(Math.random() * W), Math.floor(Math.random() * H)];
        if (!snake.some((s) => same(s, p))) return p;
    }
}

function newGame(): Game {
    const snake: Pt[] = [[6, 7], [5, 7], [4, 7]];
    return { snake, food: randomFood(snake), score: 0, over: false };
}

function step(g: Game, dir: Pt): Game {
    if (g.over) return g;
    const head: Pt = [g.snake[0][0] + dir[0], g.snake[0][1] + dir[1]];
    const eats = same(head, g.food);
    const body = eats ? g.snake : g.snake.slice(0, -1);
    const hitWall = head[0] < 0 || head[0] >= W || head[1] < 0 || head[1] >= H;
    if (hitWall || body.some((s) => same(s, head))) return { ...g, over: true };
    const snake = [head, ...body];
    return eats
        ? { snake, food: randomFood(snake), score: g.score + 1, over: false }
        : { ...g, snake };
}

function readBest(): number {
    try {
        return Number(localStorage.getItem(BEST_KEY)) || 0;
    } catch {
        return 0;
    }
}

type Props = {
    term: UseTerminalReturn;
    // false when the entry is re-rendered after a remount: the game is over by then
    active: boolean;
};

export default function Snake({ term, active }: Props) {
    const [game, setGame] = useState(newGame);
    const [status, setStatus] = useState<'playing' | 'over' | 'quit'>(active ? 'playing' : 'quit');
    const [focused, setFocused] = useState(false);
    const [best, setBest] = useState(readBest);
    const boardRef = useRef<HTMLDivElement>(null);

    // Direction changes are queued so two quick key presses inside one tick both count.
    const dir = useRef<Pt>(RIGHT);
    const queue = useRef<Pt[]>([]);

    useEffect(() => {
        if (active) boardRef.current?.focus({ preventScroll: true });
    }, [active]);

    const running = status === 'playing' && focused;

    useEffect(() => {
        if (!running) return;
        const delay = Math.max(60, 150 - game.score * 4);
        const t = setInterval(() => {
            const next = queue.current.shift();
            if (next) dir.current = next;
            const d = dir.current;
            setGame((g) => step(g, d));
        }, delay);
        return () => clearInterval(t);
    }, [running, game.score]);

    function end(how: 'over' | 'quit') {
        setStatus(how);
        const record = game.score > best;
        if (record) {
            setBest(game.score);
            try {
                localStorage.setItem(BEST_KEY, String(game.score));
            } catch {
                // ignore
            }
        }
        term.printLine(
            `snake: ${how === 'over' ? 'game over' : 'quit'} — score ${game.score}${record ? ' (new best!)' : ` · best ${best}`}`,
            how === 'over' ? 'error' : 'muted'
        );
        term.inputRef.current?.focus({ preventScroll: true });
    }

    // Report the end of the game once.
    const reported = useRef(false);
    useEffect(() => {
        if (game.over && status === 'playing' && !reported.current) {
            reported.current = true;
            end('over');
        }
    });

    function turn(d: Pt) {
        const last = queue.current.at(-1) ?? dir.current;
        // ignore reversing into yourself and repeated directions
        if (same(d, last) || (d[0] === -last[0] && d[1] === -last[1])) return;
        if (queue.current.length < 3) queue.current.push(d);
    }

    function onKeyDown(e: KeyboardEvent) {
        if (status !== 'playing') return;
        const d = KEYS[e.key];
        if (d) {
            e.preventDefault();
            turn(d);
        } else if (e.key === 'q' || e.key === 'Escape') {
            e.preventDefault();
            end('quit');
        }
    }

    // Swipe support on touch screens.
    const touch = useRef<Pt | null>(null);
    const onTouchStart = (e: TouchEvent) => {
        touch.current = [e.touches[0].clientX, e.touches[0].clientY];
    };
    const onTouchEnd = (e: TouchEvent) => {
        if (!touch.current) return;
        const dx = e.changedTouches[0].clientX - touch.current[0];
        const dy = e.changedTouches[0].clientY - touch.current[1];
        touch.current = null;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
        turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? RIGHT : LEFT) : (dy > 0 ? DOWN : UP));
    };

    if (status === 'quit' && !active) {
        return <div className="text-neutral-500 dark:text-neutral-400">snake: session ended</div>;
    }

    const cells = new Map<string, string>();
    game.snake.forEach(([x, y], i) => cells.set(`${x},${y}`, i === 0 ? 'bg-emerald-400 dark:bg-emerald-300' : 'bg-emerald-600 dark:bg-emerald-500'));
    cells.set(`${game.food[0]},${game.food[1]}`, 'bg-rose-500 rounded-full scale-75');

    const playing = status === 'playing';

    return (
        <div className="inline-block max-w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-wrap gap-x-4 text-xs mb-1">
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold term-glow">SNAKE</span>
                <span>score <span className="tabular-nums">{game.score}</span></span>
                <span className="text-neutral-500 dark:text-neutral-400">best {Math.max(best, game.score)}</span>
                {playing && <span className="text-neutral-500 dark:text-neutral-400">arrows/WASD · q to quit</span>}
            </div>

            <div
                ref={boardRef}
                tabIndex={playing ? 0 : -1}
                onKeyDown={onKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                aria-label="Snake game board"
                className="relative grid gap-px p-1 rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-200/60 dark:bg-neutral-900 outline-none focus:border-emerald-400 touch-none"
                style={{ gridTemplateColumns: `repeat(${W}, 0.7rem)` }}
            >
                {Array.from({ length: W * H }, (_, i) => {
                    const cls = cells.get(`${i % W},${Math.floor(i / W)}`);
                    return <div key={i} className={`w-[0.7rem] h-[0.7rem] rounded-[2px] ${cls ?? 'bg-white/70 dark:bg-neutral-950/60'}`} />;
                })}

                {playing && !focused && (
                    <button
                        type="button"
                        onClick={() => boardRef.current?.focus()}
                        className="absolute inset-0 flex items-center justify-center bg-neutral-950/50 text-white text-sm"
                    >
                        paused — click to resume
                    </button>
                )}
                {!playing && (
                    <div className="absolute inset-0 flex items-center justify-center text-center px-3 bg-neutral-950/50 text-white text-sm">
                        {status === 'over' ? 'GAME OVER' : 'quit'} · type `snake` to play again
                    </div>
                )}
            </div>

            {/* on-screen controls for touch devices */}
            {playing && (
                <div className="mt-2 grid grid-cols-3 gap-1 w-28 sm:hidden">
                    {([['', null], ['↑', UP], ['', null], ['←', LEFT], ['↓', DOWN], ['→', RIGHT]] as [string, Pt | null][]).map(([label, d], i) =>
                        d ? (
                            <button
                                key={i}
                                type="button"
                                onClick={() => { turn(d); boardRef.current?.focus({ preventScroll: true }); }}
                                className="h-8 rounded border border-neutral-300 dark:border-neutral-700"
                            >
                                {label}
                            </button>
                        ) : <span key={i} />
                    )}
                </div>
            )}
        </div>
    );
}
