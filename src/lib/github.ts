import { useEffect, useState } from 'react';

export type RepoRef = { owner: string; repo: string };

export function parseRepo(url?: string): RepoRef | null {
    const m = url?.match(/github\.com\/([^/]+)\/([^/#?]+)/);
    return m ? { owner: m[1], repo: m[2].replace(/\.git$/, '') } : null;
}

const isRelative = (url: string) => !/^([a-z]+:|\/\/|#|data:)/i.test(url);
const clean = (path: string) => path.replace(/^\.?\//, '');

// GitHub renders the README for us (sanitized HTML); we only fix relative links and harden it a bit.
function processReadme(html: string, { owner, repo }: RepoRef): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const raw = (p: string) => `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${clean(p)}`;
    const blob = (p: string) => `https://github.com/${owner}/${repo}/blob/HEAD/${clean(p)}`;

    doc.querySelectorAll('script, style, iframe, object, embed').forEach((el) => el.remove());
    doc.querySelectorAll('*').forEach((el) => {
        for (const attr of [...el.attributes]) {
            if (attr.name.startsWith('on')) el.removeAttribute(attr.name);
        }
    });

    doc.querySelectorAll('img').forEach((img) => {
        const src = img.getAttribute('src');
        if (src && isRelative(src)) img.setAttribute('src', raw(src));
        img.setAttribute('loading', 'lazy');
    });
    doc.querySelectorAll('source[srcset]').forEach((s) => {
        const src = s.getAttribute('srcset')!;
        if (isRelative(src)) s.setAttribute('srcset', raw(src));
    });

    doc.querySelectorAll('a[href]').forEach((a) => {
        const href = a.getAttribute('href')!;
        if (href.startsWith('#')) {
            // in-page anchors would clash with the hash router: handled by the page on click
            a.setAttribute('data-anchor', `user-content-${href.slice(1)}`);
            a.removeAttribute('href');
            a.setAttribute('role', 'link');
            a.setAttribute('tabindex', '0');
            return;
        }
        if (isRelative(href)) a.setAttribute('href', blob(href));
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noreferrer');
    });

    // GitHub's permalink icons next to headings
    doc.querySelectorAll('a.anchor').forEach((el) => el.remove());

    return doc.body.innerHTML;
}

const cache = new Map<string, string>();

async function fetchReadme(ref: RepoRef): Promise<string> {
    const key = `readme:${ref.owner}/${ref.repo}`;
    const hit = cache.get(key) ?? safeSessionGet(key);
    if (hit) return hit;

    const res = await fetch(`https://api.github.com/repos/${ref.owner}/${ref.repo}/readme`, {
        headers: { Accept: 'application/vnd.github.html+json' },
    });
    if (!res.ok) {
        throw new Error(
            res.status === 404 ? 'no public README in this repository'
                : res.status === 403 || res.status === 429 ? 'GitHub rate limit reached, try again later'
                    : `HTTP ${res.status}`
        );
    }
    const html = processReadme(await res.text(), ref);
    cache.set(key, html);
    try {
        sessionStorage.setItem(key, html);
    } catch {
        // storage full or unavailable: the in-memory cache is enough
    }
    return html;
}

function safeSessionGet(key: string): string | null {
    try {
        return sessionStorage.getItem(key);
    } catch {
        return null;
    }
}

export type ReadmeState =
    | { status: 'loading' }
    | { status: 'ok'; html: string }
    | { status: 'error'; message: string };

export function useReadme(ref: RepoRef | null): ReadmeState {
    const key = ref ? `${ref.owner}/${ref.repo}` : '';
    const [state, setState] = useState<{ key: string; value: ReadmeState }>({ key: '', value: { status: 'loading' } });

    useEffect(() => {
        if (!ref) return;
        let cancelled = false;
        fetchReadme(ref).then(
            (html) => !cancelled && setState({ key, value: { status: 'ok', html } }),
            (e: Error) => !cancelled && setState({ key, value: { status: 'error', message: e.message } })
        );
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    if (!ref) return { status: 'error', message: 'no GitHub repository' };
    // a result for a previous repo still means "loading" for this one
    return state.key === key ? state.value : { status: 'loading' };
}
