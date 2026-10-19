import { useEffect, useState } from 'react';

const STORAGE_KEY = 'theme';
const THEME_EVENT = 'portfolio-theme';

type ThemeMode = 'light' | 'dark' | 'toggle';

function readInitialTheme(): boolean {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'dark') return true;
        if (saved === 'light') return false;
    } catch {
        // storage unavailable (e.g. private mode): fall back to system preference
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

// Lets components outside the theme owner (e.g. the terminal) change the theme.
export function setTheme(mode: ThemeMode) {
    window.dispatchEvent(new CustomEvent<ThemeMode>(THEME_EVENT, { detail: mode }));
}

export function useTheme() {
    const [dark, setDark] = useState(readInitialTheme);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark);
        try {
            localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
        } catch {
            // ignore
        }
    }, [dark]);

    useEffect(() => {
        const onTheme = (e: Event) => {
            const mode = (e as CustomEvent<ThemeMode>).detail;
            setDark((prev) => (mode === 'toggle' ? !prev : mode === 'dark'));
        };
        window.addEventListener(THEME_EVENT, onTheme);
        return () => window.removeEventListener(THEME_EVENT, onTheme);
    }, []);

    return { dark, toggle: () => setDark((v) => !v) };
}
