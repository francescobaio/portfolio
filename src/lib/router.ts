import type { Route } from '../types';
import { parsePath, routeHref } from './routes';

export { parsePath, routeHref, routePath } from './routes';

const NAVIGATE_EVENT = 'portfolio-navigate';

export function currentRoute(): Route {
    // Old links used hash routing (`/#/projects`): move them to the real path.
    const { hash } = window.location;
    if (hash.startsWith('#/')) window.history.replaceState(null, '', hash.slice(1));
    return parsePath(window.location.pathname);
}

export function navigateTo(route: Route | string) {
    const href = typeof route === 'string' ? route : routeHref(route);
    if (href !== window.location.pathname) window.history.pushState(null, '', href);
    window.dispatchEvent(new Event(NAVIGATE_EVENT));
}

export function onRouteChange(handler: (route: Route) => void): () => void {
    const listener = () => handler(parsePath(window.location.pathname));
    window.addEventListener('popstate', listener);
    window.addEventListener(NAVIGATE_EVENT, listener);
    return () => {
        window.removeEventListener('popstate', listener);
        window.removeEventListener(NAVIGATE_EVENT, listener);
    };
}

// Turns clicks on same-site <a href="/..."> links into client-side navigation.
export function interceptLinks(): () => void {
    const onClick = (e: MouseEvent) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
        if (!a || a.target || a.hasAttribute('download')) return;
        const url = new URL(a.href, window.location.href);
        if (url.origin !== window.location.origin || /\.[a-z0-9]+$/i.test(url.pathname)) return; // files like the CV
        e.preventDefault();
        navigateTo(url.pathname);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
}
