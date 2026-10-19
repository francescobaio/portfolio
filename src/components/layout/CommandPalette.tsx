import { useEffect, useState } from 'react';
import Terminal from '../Terminal';
import type { Route } from '../../types';
import { onOpenPalette, useTerm } from '../../features/terminal/context';
import { routeHref } from '../../lib/router';

// ⌘K / Ctrl+K: a floating terminal on every page. On the home page it focuses the inline terminal instead.
export default function CommandPalette({ route }: { route: Route }) {
    const term = useTerm();
    // The page the palette was opened on: navigating away (e.g. `cd blog`) closes it.
    const [openOn, setOpenOn] = useState<string | null>(null);
    const here = routeHref(route);
    const open = openOn === here;

    useEffect(() => {
        const toggle = () => {
            if (route.page === 'home') {
                term.inputRef.current?.focus();
                term.inputRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
                return;
            }
            setOpenOn((cur) => (cur === here ? null : here));
        };
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                toggle();
            }
        };
        window.addEventListener('keydown', onKey);
        const off = onOpenPalette(toggle);
        return () => {
            window.removeEventListener('keydown', onKey);
            off();
        };
    }, [route.page, here, term.inputRef]);

    if (!open) return null;
    const close = () => setOpenOn(null);

    return (
        <div className="fixed inset-0 z-40 flex items-start justify-center px-3 pt-[8vh] sm:pt-[12vh]" role="dialog" aria-modal="true" aria-label="Terminal">
            <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm palette-fade" onClick={close} />
            <div className="relative w-full max-w-2xl palette-in">
                <Terminal heightClass="h-[55vh]" autoFocus onClose={close} />
            </div>
        </div>
    );
}
