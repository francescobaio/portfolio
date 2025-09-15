import { useEffect, useMemo, useState } from 'react';

import Header from './components/Header';
import ThemeToggle from './components/ThemeToggle';

import HomeView from './routes/HomeView';
import ProjectsView from './routes/ProjectsView';
import BlogListView from './routes/BlogListView';
import BlogPostView from './routes/BlogPostView';
import InterestsView from './routes/InterestsView';

import { parseHash, onHashChange } from './lib/router';
import { avatarUrl, cvUrl, social } from './data/profile';
import './index.css';

export default function App() {
  const [route, setRoute] = useState(parseHash());
  useEffect(() => onHashChange(setRoute), []);

  const prefersDark = useMemo(
    () => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false,
    []
  );
  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return prefersDark;
  });

  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => {
    const onTheme = (e: Event) => {
      const mode = (e as CustomEvent).detail?.mode as 'light' | 'dark' | 'toggle' | undefined;
      if (!mode) return;
      setDark((prev) => (mode === 'toggle' ? !prev : mode === 'dark'));
    };
    window.addEventListener('portfolio-theme', onTheme as EventListener);
    return () => window.removeEventListener('portfolio-theme', onTheme as EventListener);
  }, []);


  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen w-full bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-mono">
        <div className="max-w-6xl mx-auto p-4 sm:p-8">
          <Header
            avatarUrl={avatarUrl}
            cvUrl={cvUrl}
            social={social}
            name="Francesco Baiocchi"
            subtitle="MSc in AI. Student"
          />

          {/* Floating theme toggle */}
          <ThemeToggle dark={dark} onToggle={() => setDark(v => !v)} />

          {/* Routes */}
          {route.page === 'home' && <HomeView />}
          {route.page === 'projects' && <ProjectsView />}
          {route.page === 'blog' && <BlogListView />}
          {route.page === 'post' && <BlogPostView slug={route.slug!} />}
          {route.page === 'interests' && <InterestsView />}
        </div>
      </div>
    </div>
  );
}
