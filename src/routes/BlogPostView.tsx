import { blogPosts } from '../data/blog';
import { mdToHtml } from '../lib/markdown';

type Props = { slug: string };

export default function BlogPostView({ slug }: Props) {
    const post = blogPosts.find(p => p.slug === slug);
    if (!post) {
        return (
            <div className="min-w-0">
                <a href="#/blog" className="text-sm underline text-emerald-700 dark:text-emerald-400">← Back to blog</a>
                <div className="mt-4 text-neutral-700 dark:text-neutral-300">Post not found.</div>
            </div>
        );
    }

    const html = mdToHtml(post.content);

    return (
        <div className="min-w-0">
            <a href="#/blog" className="text-sm underline text-emerald-700 dark:text-emerald-400">← Back to blog</a>
            <h1 className="mt-2 text-2xl font-semibold">{post.title}</h1>
            <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                {post.date} • {post.readingMinutes ?? 5} min • {post.tags.join(', ')}
            </div>

            {post.cover && (
                <img
                    src={post.cover}
                    alt="cover"
                    className="mt-4 w-full rounded-lg border border-neutral-200 dark:border-neutral-800"
                    loading="lazy"
                />
            )}

            <article className="blog-content">
                <div
                    className="blog-body"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </article>
        </div>
    );
}
