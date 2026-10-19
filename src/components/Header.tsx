import type { Route, SocialLinks } from '../types';
import { NAV_LINKS, isCurrent } from '../lib/nav';
import { modKey, openPalette } from '../features/terminal/context';
import ThemeToggle from './ThemeToggle';

const navButton =
    'px-3 py-1.5 text-sm rounded-md border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600';

const iconButton = 'inline-flex items-center justify-center w-8 h-8 md:w-auto md:h-auto md:p-1.5 rounded-md transition';

type Props = {
    avatarUrl: string;
    name?: string;
    subtitle?: string;
    cvUrl: string;
    social: SocialLinks;
    // current page, highlighted in the nav
    active: Route['page'];
    theme: { dark: boolean; toggle: () => void };
};

export default function Header({
    avatarUrl,
    name = 'Francesco Baiocchi',
    subtitle = 'MSc in AI. Student',
    cvUrl,
    social,
    active,
    theme,
}: Props) {
    return (
        <header className="mb-4 md:mb-6">
            <div className="flex items-center gap-3 md:gap-4">
                <a href="/" className="group flex items-center gap-3 md:gap-4 min-w-0 flex-1" title="cd ~">
                    <img
                        src={avatarUrl}
                        alt={name}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover border border-neutral-200 dark:border-neutral-800 shrink-0 group-hover:border-emerald-400 transition"
                    />
                    <div className="min-w-0 leading-tight md:leading-normal">
                        <div className="text-emerald-700 dark:text-emerald-400 text-xs md:text-base term-glow">$ whoami</div>
                        <div className="text-neutral-800 dark:text-neutral-200 truncate text-sm md:text-base">
                            {name}<span className="hidden md:inline"> — {subtitle}</span>
                        </div>
                        <div className="md:hidden text-neutral-500 dark:text-neutral-400 truncate text-xs">{subtitle}</div>
                    </div>
                </a>

                {/* Mobile: the page nav lives in the bottom bar, here only the quick actions */}
                <div className="md:hidden flex items-center gap-1 shrink-0">
                    <button
                        type="button"
                        onClick={openPalette}
                        aria-label="Open terminal"
                        className={`${iconButton} border border-neutral-200 dark:border-neutral-800 text-emerald-700 dark:text-emerald-400 text-sm`}
                    >
                        &gt;_
                    </button>
                    <ThemeToggle dark={theme.dark} onToggle={theme.toggle} inline />
                </div>

                {/* Desktop nav */}
                <nav className="hidden md:flex ml-auto flex-wrap items-center justify-end gap-2">
                    {NAV_LINKS.map((l) => {
                        const current = isCurrent(active, l.page);
                        return (
                            <a
                                key={l.page}
                                href={l.href}
                                aria-current={current ? 'page' : undefined}
                                className={`${navButton} ${current ? 'nav-active' : ''}`}
                            >
                                <span className={current ? '' : 'opacity-0'}>&gt;</span>
                                <span className="ml-1">{l.label}</span>
                            </a>
                        );
                    })}

                    <button
                        type="button"
                        onClick={openPalette}
                        title={`Open terminal (${modKey}K)`}
                        className={`${navButton} inline-flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400`}
                    >
                        <span className="text-emerald-700 dark:text-emerald-400">&gt;_</span>
                        <kbd className="text-[10px] opacity-70">{modKey}K</kbd>
                    </button>

                    <SocialLinksRow social={social} cvUrl={cvUrl} />
                </nav>
            </div>

            {/* Mobile: contacts + CV on their own row */}
            <div className="md:hidden mt-3 flex items-center gap-1">
                <SocialLinksRow social={social} cvUrl={cvUrl} />
            </div>
        </header>
    );
}

function SocialLinksRow({ social, cvUrl }: { social: SocialLinks; cvUrl: string }) {
    return (
        <>
            {/* GitHub */}
            <a
                href={social.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                title="GitHub"
                className={`${iconButton} text-neutral-900 dark:text-neutral-100 hover:opacity-80`}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 0 0 8.21 11.44c.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.35-1.76-1.35-1.76-1.1-.75.08-.74.08-.74 1.22.09 1.86 1.26 1.86 1.26 1.08 1.85 2.83 1.32 3.52 1.01.11-.78.42-1.32.76-1.62-2.67-.3-5.48-1.34-5.48-5.97 0-1.32.47-2.4 1.24-3.25-.12-.3-.54-1.51.12-3.15 0 0 1.01-.32 3.3 1.24a11.5 11.5 0 0 1 6 0c2.29-1.56 3.3-1.24 3.3-1.24.66 1.64.24 2.85.12 3.15.77.85 1.24 1.93 1.24 3.25 0 4.64-2.81 5.66-5.49 5.96.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.21.7.83.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
                </svg>
            </a>

            {/* LinkedIn */}
            <a
                href={social.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className={`${iconButton} hover:opacity-90`}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <rect width="24" height="24" rx="4" fill="#0A66C2" />
                    <path
                        fill="#ffffff"
                        d="M9 19H6V10h3v9Zm-1.5-10.29c-.97 0-1.75-.79-1.75-1.76S6.53 5.19 7.5 5.19c.96 0 1.75.79 1.75 1.76 0 .97-.79 1.76-1.75 1.76ZM20 19h-3v-4.7c0-1.12-.02-2.56-1.56-2.56-1.56 0-1.8 1.22-1.8 2.48V19h-3v-9h2.88v1.23h.04c.4-.76 1.38-1.56 2.85-1.56 3.05 0 3.61 2.01 3.61 4.63V19Z"
                    />
                </svg>
            </a>

            {/* Email */}
            <a
                href={social.email}
                aria-label="Email"
                title="Email"
                className={`${iconButton} text-rose-600 hover:opacity-80`}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 2v.01L12 13 4 6.01V6h16ZM4 18V8.24l7.4 6.17c.35.29.85.29 1.2 0L20 8.24V18H4Z" />
                </svg>
            </a>

            {/* CV */}
            <a
                href={cvUrl}
                download
                className={`${navButton} ml-1 md:ml-0 inline-flex items-center gap-1.5 text-neutral-800 dark:text-neutral-100 hover:bg-neutral-50 dark:bg-neutral-950 dark:hover:bg-neutral-900 transition`}
                title="Download CV (PDF)"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="opacity-80">
                    <path d="M12 3a1 1 0 0 1 1 1v9.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42L11 13.59V4a1 1 0 0 1 1-1Zm-7 14a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z" />
                </svg>
                CV
            </a>
        </>
    );
}
