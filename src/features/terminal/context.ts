import { createContext, useContext } from 'react';
import type { UseTerminalReturn } from './useTerminal';

export const TerminalContext = createContext<UseTerminalReturn | null>(null);

// The terminal session is shared by the home page and the ⌘K palette.
export function useTerm(): UseTerminalReturn {
    const term = useContext(TerminalContext);
    if (!term) throw new Error('useTerm must be used inside <TerminalProvider>');
    return term;
}

const PALETTE_EVENT = 'portfolio-palette';

// Opens the ⌘K terminal (or focuses the home terminal) from anywhere.
export function openPalette() {
    window.dispatchEvent(new Event(PALETTE_EVENT));
}

export function onOpenPalette(handler: () => void): () => void {
    window.addEventListener(PALETTE_EVENT, handler);
    return () => window.removeEventListener(PALETTE_EVENT, handler);
}

export const modKey = /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘' : 'Ctrl ';
