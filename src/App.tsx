import { useEffect, useState } from 'react';

import Header from './components/Header';
import ThemeToggle from './components/ThemeToggle';
import Footer from './components/layout/Footer';
import CommandPalette from './components/layout/CommandPalette';
import MobileNav from './components/layout/MobileNav';

import HomeView from './routes/HomeView';
import AboutView from './routes/AboutView';
import ProjectsView from './routes/ProjectsView';
import ProjectView from './routes/ProjectView';
import BlogListView from './routes/BlogListView';
import BlogPostView from './routes/BlogPostView';
import InterestsView from './routes/InterestsView';
import NotFoundView from './routes/NotFoundView';

import TerminalProvider from './features/terminal/TerminalProvider';
import { currentRoute, interceptLinks, onRouteChange, routeHref } from './lib/router';
import { metaFor } from './lib/seo';
import { useTheme } from './lib/theme';
import { avatarUrl, cvUrl, social } from './data/profile';

export default function App() {
  const [route, setRoute] = useState(currentRoute);
  useEffect(() => onRouteChange(setRoute), []);
  useEffect(() => interceptLinks(), []);

  // Start each page from the top and keep the tab title in sync.
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = metaFor(route).title;
  }, [route]);

  const theme = useTheme();
  // On desktop the home page fits exactly in the viewport: terminal and projects fill the space left.
  const fitScreen = route.page === 'home';

  return (
    <TerminalProvider route={route}>
      <div className={`${fitScreen ? 'min-h-screen md:h-screen' : 'min-h-screen'} w-full flex flex-col mobile-nav-pad bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-mono bg-dots`}>
        <div className="flex-1 min-h-0 w-full max-w-7xl mx-auto flex flex-col px-4 py-4 sm:px-8 sm:py-6">
          <Header
            avatarUrl={avatarUrl}
            cvUrl={cvUrl}
            social={social}
            name="Francesco Baiocchi"
            subtitle="MSc in AI. Student"
            active={route.page}
            theme={theme}
          />

          {/* Floating theme toggle (on phones it sits in the header) */}
          <ThemeToggle dark={theme.dark} onToggle={theme.toggle} className="hidden md:inline-flex" />

          {/* Routes; the key replays the enter animation on every page change */}
          <main key={routeHref(route)} className={`page-in ${fitScreen ? 'md:flex-1 md:min-h-0' : ''}`}>
            {route.page === 'home' && <HomeView />}
            {route.page === 'about' && <AboutView />}
            {route.page === 'projects' && <ProjectsView />}
            {route.page === 'project' && <ProjectView id={route.id} />}
            {route.page === 'blog' && <BlogListView />}
            {route.page === 'post' && <BlogPostView slug={route.slug} />}
            {route.page === 'interests' && <InterestsView />}
            {route.page === 'notfound' && <NotFoundView path={route.path} />}
          </main>

          <Footer compact={fitScreen} />
        </div>

        <MobileNav active={route.page} />
        <CommandPalette route={route} />
      </div>
    </TerminalProvider>
  );
}
