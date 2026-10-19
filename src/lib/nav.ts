import type { Route } from '../types';

export const NAV_LINKS: { page: Route['page']; label: string; href: string }[] = [
    { page: 'home', label: '~ Home', href: '/' },
    { page: 'about', label: 'About', href: '/about' },
    { page: 'projects', label: 'Projects', href: '/projects' },
    { page: 'blog', label: 'Blog', href: '/blog' },
    { page: 'interests', label: 'Interests', href: '/interests' },
];

// a post / project page counts as its section
export const isCurrent = (active: Route['page'], page: Route['page']) =>
    active === page
    || (active === 'post' && page === 'blog')
    || (active === 'project' && page === 'projects');
