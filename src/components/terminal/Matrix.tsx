import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { UseTerminalReturn } from '../../features/terminal/useTerminal';

const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>/{}$#';
const FONT = 16;

type Props = {
    term: UseTerminalReturn;
    active: boolean;
};

// Full-screen "digital rain"; any key, click or tap exits.
export default function Matrix({ term, active }: Props) {
    const [running, setRunning] = useState(active && !reducedMotion);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { printLine, inputRef } = term;

    const skipped = useRef(false);
    useEffect(() => {
        if (active && reducedMotion && !skipped.current) {
            skipped.current = true;
            printLine('Wake up, Neo… (animation skipped: reduced motion is on)', 'accent');
        }
    }, [active, printLine]);

    useEffect(() => {
        if (!running) return;
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        let drops: number[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drops = Array.from({ length: Math.ceil(canvas.width / FONT) }, () => Math.random() * -50);
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };
        resize();

        let frame = 0;
        let last = 0;
        const draw = (t: number) => {
            frame = requestAnimationFrame(draw);
            if (t - last < 40) return; // ~25 fps is enough for rain
            last = t;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = `${FONT}px ui-monospace, monospace`;
            drops.forEach((y, i) => {
                const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                // bright head, green trail
                ctx.fillStyle = Math.random() > 0.96 ? '#ecfdf5' : '#34d399';
                ctx.fillText(ch, i * FONT, y * FONT);
                drops[i] = y * FONT > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
            });
        };
        frame = requestAnimationFrame(draw);

        const exit = () => setRunning(false);
        // let the click/keypress that started the command finish first
        const arm = setTimeout(() => {
            window.addEventListener('keydown', exit);
            window.addEventListener('pointerdown', exit);
        }, 300);
        window.addEventListener('resize', resize);

        return () => {
            cancelAnimationFrame(frame);
            clearTimeout(arm);
            window.removeEventListener('keydown', exit);
            window.removeEventListener('pointerdown', exit);
            window.removeEventListener('resize', resize);
        };
    }, [running]);

    // Print the epilogue once the rain stops.
    const wasRunning = useRef(running);
    useEffect(() => {
        if (wasRunning.current && !running) {
            printLine('Wake up, Neo… The Matrix has you. 🐇', 'accent');
            inputRef.current?.focus({ preventScroll: true });
        }
        wasRunning.current = running;
    }, [running, printLine, inputRef]);

    if (!running) return null;

    return createPortal(
        <div className="fixed inset-0 z-[60] bg-black cursor-pointer" aria-label="Matrix animation, press any key to exit">
            <canvas ref={canvasRef} className="block w-full h-full" />
            <div className="absolute bottom-4 inset-x-0 text-center text-xs font-mono text-emerald-300/80">
                press any key to exit
            </div>
        </div>,
        document.body
    );
}
