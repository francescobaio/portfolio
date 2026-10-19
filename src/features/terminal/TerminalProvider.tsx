import type { ReactNode } from 'react';
import type { Route } from '../../types';
import { TerminalContext } from './context';
import { useTerminal } from './useTerminal';
import { projects } from '../../data/projects';
import { blogPosts } from '../../data/blog';
import { cvUrl, interestsMain, social } from '../../data/profile';

export default function TerminalProvider({ route, children }: { route: Route; children: ReactNode }) {
    const term = useTerminal({ route, projects, posts: blogPosts, interests: interestsMain, social, cvUrl });
    return <TerminalContext.Provider value={term}>{children}</TerminalContext.Provider>;
}
