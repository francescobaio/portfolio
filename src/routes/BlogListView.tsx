import PageHeader from '../components/layout/PageHeader';
import { blogPosts } from '../data/blog';
import { readingMinutes, shortHash, sortByDateDesc } from '../lib/format';

const posts = sortByDateDesc(blogPosts);

export default function BlogListView() {
    return (
        <div className="min-w-0">
            <PageHeader
                path={['blog']}
                command="git log --graph"
                title="Blog"
                subtitle="Short notes on the ideas behind the commits."
            />

            {/* git-log style timeline */}
            <ol className="relative max-w-3xl">
                {posts.map((p, i) => (
                    <li
                        key={p.slug}
                        className="relative pl-6 sm:pl-8 pb-5 sm:pb-8 last:pb-0 term-row"
                        style={{ animationDelay: `${i * 60}ms` }}
                    >
                        {/* graph rail + commit dot */}
                        {i < posts.length - 1 && (
                            <span className="absolute left-[7px] top-4 bottom-0 w-px bg-neutral-300 dark:bg-neutral-700" />
                        )}
                        <span className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-emerald-500 bg-white dark:bg-neutral-950" />

                        <a href={`/blog/${p.slug}`} className="group block term-card rounded-xl p-3.5 sm:p-4 -mt-2">
                            <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
                                <span className="text-amber-600 dark:text-amber-400">{shortHash(p.slug)}</span>
                                {i === 0 && <span className="text-sky-700 dark:text-sky-400">(HEAD → main)</span>}
                                {p.tags.map((t) => (
                                    <span key={t} className="text-fuchsia-700 dark:text-fuchsia-400">#{t}</span>
                                ))}
                            </div>
                            <div className="mt-1 text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                {p.title}
                            </div>
                            <div className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                Date: {p.date} · {readingMinutes(p)} min read
                            </div>
                            <p className="mt-2 text-[13px] text-neutral-700 dark:text-neutral-300">{p.summary}</p>
                        </a>
                    </li>
                ))}
            </ol>
        </div>
    );
}
