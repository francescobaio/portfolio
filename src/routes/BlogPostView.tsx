import { useEffect, useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import { blogPosts } from '../data/blog';
import { mdToHtml } from '../lib/markdown';
import { readingMinutes, shortHash, sortByDateDesc } from '../lib/format';

const posts = sortByDateDesc(blogPosts);

type Props = { slug: string };

function useReadingProgress(): number {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const update = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 1);
        };
        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        return () => {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
    }, []);
    return progress;
}

export default function BlogPostView({ slug }: Props) {
    const progress = useReadingProgress();
    const index = posts.findIndex((p) => p.slug === slug);
    const post = posts[index];

    if (!post) {
        return (
            <div className="min-w-0">
                <PageHeader path={['blog', slug]} command={`cat ${slug}.md`} />
                <div className="text-rose-600 dark:text-rose-400">cat: {slug}.md: No such file or directory</div>
                <a href="/blog" className="mt-2 inline-block text-sm underline text-emerald-700 dark:text-emerald-400">← back to blog</a>
            </div>
        );
    }

    // posts are sorted newest first
    const newer = posts[index - 1];
    const older = posts[index + 1];

    return (
        <div className="min-w-0">
            {/* reading progress */}
            <div className="fixed top-0 left-0 right-0 h-0.5 z-30">
                <div className="h-full bg-emerald-500 dark:bg-emerald-400 origin-left transition-transform duration-100" style={{ transform: `scaleX(${progress})` }} />
            </div>

            <PageHeader path={['blog', slug]} command={`cat ${slug}.md`} />

            <div className="max-w-3xl">
                <h1 className="text-2xl sm:text-3xl font-semibold leading-tight">{post.title}</h1>
                <div className="mt-2 flex flex-wrap gap-x-3 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="text-amber-600 dark:text-amber-400">{shortHash(post.slug)}</span>
                    <span>{post.date}</span>
                    <span>{readingMinutes(post)} min read</span>
                    {post.tags.map((t) => (
                        <span key={t} className="text-fuchsia-700 dark:text-fuchsia-400">#{t}</span>
                    ))}
                </div>

                {post.cover && (
                    <img
                        src={post.cover}
                        alt=""
                        className="mt-4 w-full rounded-lg border border-neutral-200 dark:border-neutral-800"
                        loading="lazy"
                    />
                )}

                <article className="blog-body" dangerouslySetInnerHTML={{ __html: mdToHtml(post.content) }} />

                {/* prev / next */}
                <nav className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {older ? (
                        <a href={`/blog/${older.slug}`} className="term-card rounded-xl p-3">
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">← git checkout HEAD~1</div>
                            <div className="mt-1 font-semibold">{older.title}</div>
                        </a>
                    ) : <span />}
                    {newer ? (
                        <a href={`/blog/${newer.slug}`} className="term-card rounded-xl p-3 sm:text-right">
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">git checkout HEAD@{'{1}'} →</div>
                            <div className="mt-1 font-semibold">{newer.title}</div>
                        </a>
                    ) : (
                        <a href="/blog" className="term-card rounded-xl p-3 sm:text-right">
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">cd ..</div>
                            <div className="mt-1 font-semibold">All posts</div>
                        </a>
                    )}
                </nav>
            </div>
        </div>
    );
}
