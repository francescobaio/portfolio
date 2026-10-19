export type ProjectStatus = 'in-progress' | 'completed';

export type Project = {
    id: string;
    name: string;
    description: string;
    tech: string[];
    repo?: string;
    demo?: string;
    year: number;
    status?: ProjectStatus;
};

export type BlogPost = {
    slug: string;
    title: string;
    date: string;
    tags: string[];
    summary: string;
    cover?: string;
    readingMinutes?: number;
    content: string;
};

export type SocialLinks = {
    github: string;
    linkedin: string;
    email: string;
};

export type Interest = {
    title: string;
    bullets: string[];
    links: { label: string; href: string }[];
};

export type TravelPlace = {
    id: string;
    city: string;
    country: string;
    year: number;
    photos?: string[];
};

export type TimelineEntry = {
    kind: 'work' | 'education' | 'award';
    title: string;
    org: string;
    place: string;
    // free text, e.g. "Sep 2023 – present"; empty when unknown
    period: string;
    bullets: string[];
};

export type Route =
    | { page: 'home' }
    | { page: 'about' }
    | { page: 'projects' }
    | { page: 'project'; id: string }
    | { page: 'blog' }
    | { page: 'interests' }
    | { page: 'post'; slug: string }
    | { page: 'notfound'; path: string };
