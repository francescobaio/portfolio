import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

const URL_RE = /(https?:\/\/[^\s]+|[\w.+-]+@[\w-]+\.[\w.]+)/g;

// Turns URLs and email addresses into links.
function linkify(text: string): ReactNode[] {
    return text.split(URL_RE).map((part, i) => {
        if (i % 2 === 0) return part;
        const href = part.includes('@') && !part.startsWith('http') ? `mailto:${part}` : part;
        return (
            <a
                key={i}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-dotted underline-offset-2 text-sky-700 dark:text-sky-400 hover:decoration-solid"
            >
                {part}
            </a>
        );
    });
}

// Types `text` out over ~0.4s on mount, then renders it with clickable links.
export default function TypedText({ text, animate = true }: { text: string; animate?: boolean }) {
    const [shown, setShown] = useState(reducedMotion || !animate ? text.length : 0);

    useEffect(() => {
        if (shown >= text.length) return;
        const step = Math.max(2, Math.ceil(text.length / 25));
        const t = setTimeout(() => setShown((n) => Math.min(text.length, n + step)), 16);
        return () => clearTimeout(t);
    }, [shown, text]);

    if (shown < text.length) return <>{text.slice(0, shown)}</>;
    return <>{linkify(text)}</>;
}
