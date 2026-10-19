// Page titles and descriptions. Used at runtime (document.title) and at build time
// (vite.config.ts writes one static HTML file per route), so keep it free of browser APIs.
import type { Route } from '../types';
import { projects } from '../data/projects';
import { blogPosts } from '../data/blog';

export const SITE = {
    url: 'https://francescobaiocchi.eu',
    name: 'Francesco Baiocchi',
    description:
        'Francesco Baiocchi — MSc student in Artificial Intelligence at the University of Bologna. Vision-Language Models, Document AI, GNNs. Projects, blog and a terminal you can type into.',
    image: '/og.png',
};

export type PageMeta = { title: string; description: string };

const clip = (s: string, n = 160) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

export function metaFor(route: Route): PageMeta {
    const page = (title: string, description = SITE.description) => ({
        title: `${title} — ${SITE.name}`,
        description: clip(description),
    });
    switch (route.page) {
        case 'home':
            return { title: `${SITE.name} — Portfolio`, description: SITE.description };
        case 'about':
            return page('About', 'Education and work: MSc in AI at the University of Bologna, AI internship at LetXbe AI in Paris (2026), BSc in Computer Engineering in Florence.');
        case 'projects':
            return page('Projects', `${projects.length} projects in deep learning, computer vision, NLP and optimization — with code, reports and demos.`);
        case 'project': {
            const p = projects.find((x) => x.id === route.id);
            return p ? page(p.name, p.description) : page('Project not found');
        }
        case 'blog':
            return page('Blog', 'Short notes on the ideas behind the commits.');
        case 'post': {
            const post = blogPosts.find((x) => x.slug === route.slug);
            return post ? page(post.title, post.summary) : page('Post not found');
        }
        case 'interests':
            return page('Interests', 'Cycling, chess, travel and photography.');
        case 'notfound':
            return page('Not found');
    }
}

// Every page that should exist as a static file and in the sitemap.
export function allRoutes(): Route[] {
    return [
        { page: 'home' },
        { page: 'about' },
        { page: 'projects' },
        ...projects.map((p) => ({ page: 'project', id: p.id }) as Route),
        { page: 'blog' },
        ...blogPosts.map((p) => ({ page: 'post', slug: p.slug }) as Route),
        { page: 'interests' },
    ];
}
