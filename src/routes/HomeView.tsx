import Terminal from '../components/Terminal';
import ProjectCard from '../components/ProjectCard';
import { useTerm } from '../features/terminal/context';
import { projects } from '../data/projects';

const featured = [...projects].sort((a, b) => b.year - a.year).slice(0, 3);

export default function HomeView() {
    const term = useTerm();
    const openInTerminal = (id: string) => term.runCommand(`open ${id}`);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 items-start md:items-stretch md:h-full text-[15px] leading-[1.7] w-full">
            {/* LEFT: Terminal (fills the column height on desktop) */}
            <Terminal heightClass="h-[46vh] sm:h-[55vh] min-h-[260px]" fill />

            {/* RIGHT: Featured */}
            <div className="min-w-0 md:min-h-0 md:flex md:flex-col">
                <div className="mb-3 md:mb-4">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        <span className="text-emerald-700 dark:text-emerald-400">$</span> ls -t projects/ | head -3
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <div className="text-base md:text-lg font-semibold">Recent projects</div>
                        <a href="/projects" className="text-sm underline text-emerald-700 dark:text-emerald-400">
                            All Projects →
                        </a>
                    </div>
                </div>

                {/* Mobile */}
                <div className="md:hidden -mx-4 px-4">
                    <div className="flex gap-3 overflow-x-auto snap-x">
                        {featured.map((p) => (
                            <div key={p.id} className="min-w-[85%] snap-center">
                                <ProjectCard p={p} active={term.selectedId === p.id} onOpen={openInTerminal} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Desktop: as many cards as fit; on short screens the list scrolls inside the column */}
                <div className="hidden md:block md:flex-1 md:min-h-0 overflow-y-auto thin-scroll -mx-1 px-1 py-1">
                    <div className="grid grid-cols-1 gap-3">
                        {featured.map((p, i) => (
                            // the third card only on tall screens, instead of showing it cut in half
                            <div key={p.id} className={i === 2 ? '[@media(max-height:880px)]:hidden' : ''}>
                                <ProjectCard p={p} active={term.selectedId === p.id} onOpen={openInTerminal} compact />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-3 text-xs text-neutral-500 dark:text-neutral-400 [@media(max-height:760px)]:hidden">
                    Tip: tap a card to run <span className="text-emerald-700 dark:text-emerald-400">open {'<id>'}</span> in the terminal.
                </div>
            </div>
        </div>
    );
}
