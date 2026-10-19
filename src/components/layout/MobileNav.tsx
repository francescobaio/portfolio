import type { Route } from '../../types';
import { NAV_LINKS, isCurrent } from '../../lib/nav';

// Bottom tab bar on phones: the page nav stays one thumb away instead of wrapping in the header.
export default function MobileNav({ active }: { active: Route['page'] }) {
    return (
        <nav
            aria-label="Pages"
            className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
        >
            <div className="grid grid-cols-5">
                {NAV_LINKS.map((l) => {
                    const current = isCurrent(active, l.page);
                    return (
                        <a
                            key={l.page}
                            href={l.href}
                            aria-current={current ? 'page' : undefined}
                            className={`relative flex flex-col items-center justify-center gap-0.5 h-14 text-[11px] transition-colors ${current
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : 'text-neutral-500 dark:text-neutral-400'
                                }`}
                        >
                            {current && <span className="absolute top-0 inset-x-4 h-0.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />}
                            <span className={`text-sm leading-none ${current ? 'term-glow' : 'opacity-60'}`}>{current ? '>' : '$'}</span>
                            <span>{l.page === 'home' ? 'home' : l.label.toLowerCase()}</span>
                        </a>
                    );
                })}
            </div>
        </nav>
    );
}
