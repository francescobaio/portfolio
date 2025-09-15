import type { BlogPost } from '../types';

export const blogPosts: BlogPost[] = [

    {
        slug: 'why-write-not-just-code',
        title: 'Why Write, Not Just Code',
        date: '2025-09-10',
        tags: ['meta', 'writing'],
        summary:
            'I build things, but not everything fits a README. This blog is for the ideas behind the commits—written plainly and honestly.',
        readingMinutes: 1,
        content: `
        ---
        I’ve shipped a lot of technical work. Repos, reports, plots.
        But not everything worth saying fits in a README.

        This blog is for **words**: the why behind choices, the trade-offs, the blind spots.
        It also serves me to surface the few things that really matter after months of work and to make those fundamentals explicit.
        Short notes. Plain language. No grandstanding.
        ---
        **Ground rules**

        - One idea per post. One clear takeaway.
        - Write to contribute: something a peer can reuse today.
        - Update openly when new evidence wins.
        - Evidence only: link runs/data/configs — otherwise call it a hunch.

        ---
        **What to expect**
        - Reflections on design decisions that don’t show up in code.
        - Occasional meta posts on learning, attention and focus.

        I’ll keep posts small. When an idea deserves more, I’ll write more.
        For everything else, a paragraph is enough.

        Thanks for reading.`
    },

];

export default blogPosts;
