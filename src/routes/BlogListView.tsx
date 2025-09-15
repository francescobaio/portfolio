import { blogPosts } from '../data/blog';

export default function BlogListView() {
    const items = [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));

    return (
        <div className="min-w-0">
            <div className="mb-3 flex items-center justify-between gap-3">
                <div className="text-lg font-semibold">Blog</div>
                <a href="#/" className="text-sm underline text-emerald-700 dark:text-emerald-400">← Back home</a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map(p => (
                    <a
                        key={p.slug}
                        href={`#/blog/${p.slug}`}
                        className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 hover:border-neutral-300 dark:hover:border-neutral-600"
                    >
                        <div className="text-base font-semibold text-neutral-900 dark:text-neutral-100">{p.title}</div>
                        <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                            {p.date} • {p.readingMinutes ?? 5} min • {p.tags.join(', ')}
                        </div>
                        <p className="mt-2 text-[13px] text-neutral-700 dark:text-neutral-300">{p.summary}</p>
                    </a>
                ))}
            </div>
        </div>
    );
}
