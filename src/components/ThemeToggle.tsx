type Props = {
    dark: boolean;
    onToggle: () => void;
    className?: string;
};

export default function ThemeToggle({ dark, onToggle, className = '' }: Props) {
    return (
        <button
            onClick={onToggle}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
            className={`fixed bottom-4 right-4 z-50 inline-flex items-center justify-center w-10 h-10 rounded-full shadow-lg
                 border border-neutral-200 dark:border-neutral-700
                 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200
                 hover:opacity-90 ${className}`}
        >
            {dark ? (
                // Sun icon 
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
            ) : (
                // Moon icon 
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                </svg>
            )}
        </button>
    );
}
