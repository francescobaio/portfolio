export type ProjectStatus = 'in-progress' | 'completed';
export type Milestone = { title: string; due?: string; done?: boolean };

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

export type Experience = {
    company: string;
    role: string;
    period: string;
    bullets: string[];
};

export type Passion = {
    title: string;
    text: string;
};

export type SocialLinks = {
    github: string;
    linkedin: string;
    email: string;
};

export type Route =
    | { page: 'home' }
    | { page: 'projects' }
    | { page: 'blog' }
    | { page: 'interests' }
    | { page: 'post'; slug: string };
