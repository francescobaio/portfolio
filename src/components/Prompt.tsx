type PromptProps = {
    user?: string;
    host?: string;
    path?: string;
    className?: string;
};

export default function Prompt({
    user = 'francesco',
    host = 'portfolio',
    path = '~',
    className = '',
}: PromptProps) {
    return (
        <div className={`flex flex-wrap items-center gap-2 select-none ${className}`}>
            <span className="text-emerald-600 dark:text-emerald-400">{user}</span>
            <span className="text-neutral-500 dark:text-neutral-400">@</span>
            <span className="text-emerald-600 dark:text-emerald-400">{host}</span>
            <span className="text-neutral-500 dark:text-neutral-400">:</span>
            <span className="text-sky-600 dark:text-sky-400">{path}</span>
            <span className="text-neutral-500 dark:text-neutral-400">$</span>
        </div>
    );
}
