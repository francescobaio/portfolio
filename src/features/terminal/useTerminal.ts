import { useEffect, useMemo, useRef, useState } from 'react';
import type { Project, SocialLinks } from '../../types';
import { helpText } from './helpText';
import { whoamiText } from './whoami';
import { navigateTo } from '../../lib/router';


type UseTerminalOpts = {
    user?: string;
    host?: string;
    path?: string;
    projects: Project[];
    social: SocialLinks;
    cvUrl: string;
};

function useAutoscroll(dep: unknown) {
    const ref = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
    }, [dep]);
    return ref;
}

function downloadFile(url: string, filename?: string) {
    try {
        const a = document.createElement('a');
        a.href = url;
        if (filename) a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (e) {
        console.warn('download failed', e);
    }
}

export function useTerminal({
    user = 'francesco',
    host = 'portfolio',
    path = '~',
    projects,
    social,
    cvUrl,
}: UseTerminalOpts) {
    const [history, setHistory] = useState<string[]>([whoamiText]);
    const [input, setInput] = useState('');
    const [activeSection, setActiveSection] = useState<'projects' | 'experience' | 'interests'>('projects');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // right-column filtered projects
    const [filtered, setFiltered] = useState<Project[]>(
        projects.slice().sort((a, b) => b.year - a.year)
    );

    const scrollRef = useAutoscroll(history.join('\n'));

    const promptStr = () => `${user}@${host}:${path}$ `;
    const promptPlain = promptStr();

    const projectIndex = useMemo(() => {
        const map = new Map<string, number>();
        projects.forEach((p, i) => map.set(p.id, i));
        return map;
    }, [projects]);

    function print(line = '') {
        setHistory((h) => [...h, line]);
    }
    function printBlock(lines: string[]) {
        setHistory((h) => [...h, ...lines]);
    }

    function syncListAll() {
        const all = projects.slice().sort((a, b) => b.year - a.year);
        setFiltered(all);
    }

    function cmd_ls(arg?: string) {
        if (!arg) return print(`about/\nprojects/\nblog/\ninterests/\ncontact/\ncv/`);
        if (arg.trim() === 'projects/') {
            const rows = projects
                .slice()
                .sort((a, b) => b.year - a.year)
                .map((p) => `${p.id}  —  ${p.name} [${p.year}]`);
            printBlock(rows.length ? rows : ['<empty>']);
            syncListAll();
            setActiveSection('projects');
            return;
        }
        print(`ls: cannot access '${arg}': No such file or directory`);
    }

    function cmd_open(id: string) {
        const clean = id.replace(/\/$/, '');
        if (clean === 'projects') {
            navigateTo({ page: 'projects' });
            print('opening projects…');
            return;
        }
        if (clean === 'blog') {
            navigateTo({ page: 'blog' });
            print('opening blog…');
            return;
        }
        if (clean === 'interests') {
            navigateTo({ page: 'interests' });
            print('opening interests…');
            return;
        }
        const idx = projectIndex.get(id);
        if (idx === undefined) return print(`open: '${id}': not found`);
        const p = projects[idx];
        setSelectedId(id);
        setActiveSection('projects');
        const lines = [
            `# ${p.name}`,
            `${p.description}`,
            `Tech: ${p.tech.join(', ')}`,
            p.repo ? `Repo: ${p.repo}` : '',
            p.demo ? `Demo: ${p.demo}` : '',
        ].filter(Boolean);
        printBlock(lines);
    }

    function cmd_search(term: string) {
        const q = term.toLowerCase();
        const matches = projects.filter(
            (p) =>
                p.id.toLowerCase().includes(q) ||
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.tech.join(' ').toLowerCase().includes(q)
        );
        const rows = matches.map((p) => `${p.id}  —  ${p.name}`);
        setFiltered(matches.slice().sort((a, b) => b.year - a.year));
        setSelectedId(matches.length ? matches[0].id : null);
        printBlock(rows.length ? rows : ['No results.']);
    }

    function runCommand(raw: string) {
        const line = raw.trim();
        if (!line) return;

        // print prompt + command
        print(`${promptStr()}${line}`);

        const [cmd, ...rest] = line.split(/[ ]+/);
        const arg = rest.join(' ');

        switch (cmd) {
            case 'help':
                printBlock(helpText.split('\n'));
                break;
            case 'whoami':
                printBlock([whoamiText]);
                break;
            case 'ls':
                cmd_ls(arg);
                break;
            case 'open':
                if (!arg) print('open: missing project id');
                else cmd_open(arg);
                break;
            case 'contact':
                printBlock([`GitHub: ${social.github}`, `LinkedIn: ${social.linkedin}`, `Email: ${social.email}`]);
                break;
            case 'cv':
                if (arg === 'open') {
                    window.open(cvUrl, '_blank');
                    print(`Opened ${cvUrl}`);
                } else {
                    downloadFile(cvUrl, 'Francesco_Baiocchi_CV.pdf');
                    print(`Downloading CV… If it didn't start, use the CV button above or open ${cvUrl}`);
                }
                break;
            case 'clear':
                setHistory([]);
                break;
            case 'theme': {
                if (arg?.toLowerCase() !== 'toggle') {
                    print('Usage: theme toggle');
                    break;
                }
                dispatchTheme('toggle');
                print('theme toggled');
                break;
            }

            default:
                print(`${cmd}: command not found`);
        }
    }

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        const value = input;
        setInput('');
        runCommand(value);
    }

    function onCardSearch(term: string) {
        const t = term.trim();
        if (!t) {
            syncListAll();
            setSelectedId(null);
            return;
        }
        cmd_search(t);
    }

    return {
        // state
        history,
        input,
        activeSection,
        selectedId,
        filtered,

        // refs
        scrollRef,

        // helpers
        promptPlain,
        setInput,
        setActiveSection,

        // actions
        runCommand,
        onSubmit,
        onCardSearch,
    };
}


function dispatchTheme(mode: 'light' | 'dark' | 'toggle') {
    window.dispatchEvent(new CustomEvent('portfolio-theme', { detail: { mode } }));
}


export type UseTerminalReturn = ReturnType<typeof useTerminal>;