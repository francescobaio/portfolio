import { useEffect } from 'react';

// `thumb` is a smaller version for previews; `src` is shown enlarged.
export type LightboxItem = { src: string; thumb: string; file: string; caption: string };

type Props = {
    items: LightboxItem[];
    index: number | null;
    onChange: (index: number | null) => void;
};

export default function Lightbox({ items, index, onChange }: Props) {
    const open = index !== null;

    useEffect(() => {
        if (index === null) return;
        const step = (d: number) => onChange((index + d + items.length) % items.length);
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onChange(null);
            else if (e.key === 'ArrowRight') step(1);
            else if (e.key === 'ArrowLeft') step(-1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [index, items.length, onChange]);

    if (!open) return null;
    const item = items[index];
    const navButton = 'absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl';

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950/90 p-4 palette-fade"
            role="dialog"
            aria-modal="true"
            aria-label={item.caption}
            onClick={() => onChange(null)}
        >
            <img
                src={item.src}
                alt={item.caption}
                className="max-h-[80vh] max-w-full rounded-lg shadow-2xl object-contain palette-in"
                onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-3 text-xs sm:text-sm text-neutral-300 font-mono text-center">
                <span className="text-emerald-400">{item.file}</span> — {item.caption}
                <span className="ml-3 text-neutral-500">{index + 1}/{items.length}</span>
            </div>

            {items.length > 1 && (
                <>
                    <button type="button" aria-label="Previous photo" className={`${navButton} left-3 sm:left-6`}
                        onClick={(e) => { e.stopPropagation(); onChange((index - 1 + items.length) % items.length); }}>‹</button>
                    <button type="button" aria-label="Next photo" className={`${navButton} right-3 sm:right-6`}
                        onClick={(e) => { e.stopPropagation(); onChange((index + 1) % items.length); }}>›</button>
                </>
            )}
            <button type="button" aria-label="Close" className="absolute top-4 right-4 text-neutral-300 hover:text-white text-sm"
                onClick={() => onChange(null)}>[esc] ✕</button>
        </div>
    );
}
