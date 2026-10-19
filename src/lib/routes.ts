// Route ⇄ URL mapping, free of browser APIs (also used by vite.config.ts at build time).
import type { Route } from '../types';

export function parsePath(pathname: string): Route {
    const path = decodeURIComponent(pathname).replace(/^\/+|\/+$/g, '');
    const parts = path.split('/');
    if (!parts[0] || parts[0] === 'index.html') return { page: 'home' };
    if (parts.length === 1 && (parts[0] === 'about' || parts[0] === 'projects' || parts[0] === 'interests' || parts[0] === 'blog')) {
        return { page: parts[0] };
    }
    if (parts[0] === 'blog' && parts.length === 2) return { page: 'post', slug: parts[1] };
    if (parts[0] === 'projects' && parts.length === 2) return { page: 'project', id: parts[1] };
    return { page: 'notfound', path };
}

export function routeHref(route: Route): string {
    switch (route.page) {
        case 'home': return '/';
        case 'post': return `/blog/${route.slug}`;
        case 'project': return `/projects/${route.id}`;
        case 'notfound': return `/${route.path}`;
        default: return `/${route.page}`;
    }
}

// The shell-style working directory for a route, e.g. `~/blog/my-post`.
export function routePath(route: Route): string {
    if (route.page === 'home' || route.page === 'notfound') return '~';
    return `~${routeHref(route)}`;
}
