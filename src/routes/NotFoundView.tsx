import PageHeader from '../components/layout/PageHeader';

const SUGGESTIONS = [
    { href: '/', label: 'cd ~' },
    { href: '/about', label: 'cd about' },
    { href: '/projects', label: 'cd projects' },
    { href: '/blog', label: 'cd blog' },
    { href: '/interests', label: 'cd interests' },
];

export default function NotFoundView({ path }: { path: string }) {
    return (
        <div className="min-w-0">
            <PageHeader path={[]} command={`cd ${path}`} />
            <div className="text-rose-600 dark:text-rose-400">
                bash: cd: {path}: No such file or directory
            </div>
            <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">exit status 404</div>

            <div className="mt-6 text-sm">
                <div className="text-neutral-600 dark:text-neutral-400">Did you mean:</div>
                <ul className="mt-2 space-y-1">
                    {SUGGESTIONS.map((s) => (
                        <li key={s.href}>
                            <a href={s.href} className="text-emerald-700 dark:text-emerald-400 hover:underline">
                                <span className="text-neutral-400">$ </span>{s.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
