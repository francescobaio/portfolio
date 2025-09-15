import type { Route } from '../types';

export function parseHash(): Route {
    const hash = window.location.hash || '';
    const parts = hash.replace(/^#\/?/, '').split('/');
    if (!parts[0]) return { page: 'home' };
    if (parts[0] === 'projects') return { page: 'projects' };
    if (parts[0] === 'interests') return { page: 'interests' };
    if (parts[0] === 'blog') {
        if (parts[1]) return { page: 'post', slug: parts.slice(1).join('/') };
        return { page: 'blog' };
    }
    return { page: 'home' };
}

export function navigateTo(route: Route) {
    switch (route.page) {
        case 'home': window.location.hash = '#/'; break;
        case 'projects': window.location.hash = '#/projects'; break;
        case 'interests': window.location.hash = '#/interests'; break;
        case 'blog': window.location.hash = '#/blog'; break;
        case 'post': window.location.hash = `#/blog/${route.slug}`; break;
    }
}

export function onHashChange(handler: (route: Route) => void): () => void {
    const listener = () => handler(parseHash());
    window.addEventListener('hashchange', listener);
    return () => window.removeEventListener('hashchange', listener);
}
