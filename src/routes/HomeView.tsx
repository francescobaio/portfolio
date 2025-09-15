import Terminal from '../components/Terminal';
import ProjectGrid from '../components/ProjectGrid';
import ProjectCard from '../components/ProjectCard';
import { useTerminal } from '../features/terminal/useTerminal';
import { projects } from '../data/projects';
import { social, cvUrl } from '../data/profile';

export default function HomeView() {
    const term = useTerminal({
        projects,
        social,
        cvUrl,
        user: 'francesco',
        host: 'portfolio',
        path: '~',
    });

    const featured = [...projects].sort((a, b) => b.year - a.year).slice(0, 3);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 items-start text-[15px] leading-[1.7] w-full">
            {/* LEFT: Terminal */}
            <Terminal term={term} heightClass="h-[46vh] sm:h-[55vh] md:h-[65vh] min-h-[260px]" />

            {/* RIGHT: Featured */}
            <div className="min-w-0">
                <div className="mb-3 md:mb-4 flex items-center justify-between gap-3">
                    <div className="text-base md:text-lg font-semibold">Recent projects</div>
                    <a href="#/projects" className="text-sm underline text-emerald-700 dark:text-emerald-400">
                        All Projects →
                    </a>
                </div>

                {/* Mobile */}
                <div className="md:hidden -mx-4 px-4">
                    <div className="flex gap-3 overflow-x-auto snap-x">
                        {featured.map((p) => (
                            <div key={p.id} className="min-w-[85%] snap-center">
                                <ProjectCard p={p} onOpen={(id) => term.runCommand(`open ${id}`)} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Desktop */}
                <div className="hidden md:block">
                    <ProjectGrid
                        items={featured}
                        cols="grid-cols-1"
                        onOpen={(id) => term.runCommand(`open ${id}`)}
                    />
                </div>

                <div className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
                    Tip: tap a card to run <span className="text-emerald-700 dark:text-emerald-400">open {'<id>'}</span> in the terminal.
                </div>
            </div>
        </div>
    );
}
