import type { ReactNode } from 'react';

type Props = {
    // path below ~, e.g. ['blog', 'my-post']
    path: string[];
    command: string;
    title?: ReactNode;
    subtitle?: ReactNode;
};

// A shell prompt as page header: `francesco@portfolio:~/blog$ git log▌`, every path segment is a link.
export default function PageHeader({ path, command, title, subtitle }: Props) {
    return (
        <div className="mb-5 md:mb-8 page-in">
            <div className="flex flex-wrap items-center text-[13px] sm:text-base break-all">
                <span className="hidden sm:inline text-emerald-700 dark:text-emerald-400 term-glow">francesco@portfolio</span>
                <span className="hidden sm:inline text-neutral-500">:</span>
                <a href="/" className="text-sky-700 dark:text-sky-400 hover:underline" title="cd ~">~</a>
                {path.map((seg, i) => {
                    const href = `/${path.slice(0, i + 1).join('/')}`;
                    const last = i === path.length - 1;
                    return (
                        <span key={href} className="text-sky-700 dark:text-sky-400">
                            /
                            {last ? seg : <a href={href} className="hover:underline" title={`cd ${href.slice(1)}`}>{seg}</a>}
                        </span>
                    );
                })}
                <span className="text-neutral-500 mr-2">$</span>
                <span className="text-neutral-800 dark:text-neutral-200">{command}</span>
                <span className="term-cursor term-cursor-active ml-1 inline-block w-[0.6em]">&nbsp;</span>
            </div>
            {title && <h1 className="mt-2 sm:mt-3 text-xl sm:text-2xl font-semibold">{title}</h1>}
            {subtitle && <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{subtitle}</p>}
        </div>
    );
}
