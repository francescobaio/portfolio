import { modKey, openPalette } from '../../features/terminal/context';

export default function Footer({ compact = false }: { compact?: boolean }) {
    return (
        <footer className={`${compact ? 'mt-6 md:mt-4 pt-3' : 'mt-12 md:mt-16 pt-6'} border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-xs text-neutral-500 dark:text-neutral-400`}>
            <span>
                <span className="text-emerald-700 dark:text-emerald-400">$</span> exit 0 · © {new Date().getFullYear()} Francesco Baiocchi
            </span>
            <span className="flex flex-wrap items-center gap-x-3">
                <span>last update: {__LAST_UPDATE__}</span>
                <button type="button" onClick={openPalette} className="hidden md:inline hover:text-emerald-700 dark:hover:text-emerald-400">
                    press <kbd className="px-1.5 py-0.5 rounded border border-neutral-300 dark:border-neutral-700">{modKey}K</kbd> for a terminal
                </button>
            </span>
        </footer>
    );
}
