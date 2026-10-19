import type { BlogPost } from '../types';

// Short git-like hash, stable for a given string (FNV-1a).
export function shortHash(s: string): string {
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
}

// "Travel & Photography" → "travel-photography.md"
export function toFileName(title: string): string {
    return `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.md`;
}

export function readingMinutes(post: BlogPost): number {
    if (post.readingMinutes) return post.readingMinutes;
    const words = post.content.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
}

export const sortByDateDesc = (posts: BlogPost[]) =>
    [...posts].sort((a, b) => b.date.localeCompare(a.date));
