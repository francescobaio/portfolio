import { useCallback, useMemo, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import type { BlogPost, Interest, Project, Route, SocialLinks } from '../../types';
import { COMMAND_NAMES } from './commands';
import { whoamiText } from './whoami';
import { navigateTo, routePath } from '../../lib/router';
import { setTheme } from '../../lib/theme';
import { sortByDateDesc, toFileName } from '../../lib/format';

export type Tone = 'default' | 'muted' | 'accent' | 'error';

export type StackRow = { name: string; count: number };

type EntryBody =
    | { kind: 'command'; text: string; path: string }
    | { kind: 'text'; text: string; tone?: Tone }
    | { kind: 'banner' }
    | { kind: 'help' }
    | { kind: 'projects'; items: Project[] }
    | { kind: 'posts'; items: BlogPost[] }
    | { kind: 'files'; items: string[] }
    | { kind: 'stack'; rows: StackRow[] }
    | { kind: 'timeline' }
    | { kind: 'snake' }
    | { kind: 'matrix' };

// `at` lets entries animate only when they are new, not when the terminal remounts.
export type HistoryEntry = EntryBody & { id: number; at: number };

type UseTerminalOpts = {
    route: Route;
    projects: Project[];
    posts: BlogPost[];
    interests: Interest[];
    social: SocialLinks;
    cvUrl: string;
};

// Top-level directories.
const SECTIONS: Record<string, Route> = {
    about: { page: 'about' },
    projects: { page: 'projects' },
    blog: { page: 'blog' },
    interests: { page: 'interests' },
};

const text = (t: string, tone?: Tone): EntryBody => ({ kind: 'text', text: t, tone });

// "~/projects/" → "projects"
const cleanPath = (p: string) => p.replace(/^~?\/?/, '').replace(/\/$/, '');

function downloadFile(url: string, filename?: string) {
    const a = document.createElement('a');
    a.href = url;
    if (filename) a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

function commonPrefix(words: string[]): string {
    return words.reduce((acc, w) => {
        let i = 0;
        while (i < acc.length && acc[i] === w[i]) i++;
        return acc.slice(0, i);
    });
}

export function useTerminal({ route, projects, posts, interests, social, cvUrl }: UseTerminalOpts) {
    const nextId = useRef(0);
    const withId = (e: EntryBody): HistoryEntry => ({ ...e, id: nextId.current++, at: Date.now() });

    const [history, setHistory] = useState<HistoryEntry[]>(() => [withId({ kind: 'banner' })]);
    const [input, setInput] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // previously run commands, for ↑/↓ navigation and suggestions
    const commandLog = useRef<string[]>([]);
    const logCursor = useRef(0);

    const path = routePath(route);

    const sortedProjects = useMemo(() => [...projects].sort((a, b) => b.year - a.year), [projects]);
    const sortedPosts = useMemo(() => sortByDateDesc(posts), [posts]);
    const projectsById = useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects]);
    const postsBySlug = useMemo(() => new Map(posts.map((p) => [p.slug, p])), [posts]);
    const interestFiles = useMemo(
        () => new Map(interests.map((it) => [toFileName(it.title), it])),
        [interests]
    );
    const stack = useMemo(() => {
        const counts = new Map<string, number>();
        projects.flatMap((p) => p.tech).forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1));
        return [...counts]
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);
    }, [projects]);

    function print(...entries: (EntryBody | string)[]) {
        setHistory((h) => [
            ...h,
            ...entries.map((e) => withId(typeof e === 'string' ? text(e) : e)),
        ]);
    }

    // The directory `ls` lists when called without arguments.
    function currentDir(): string {
        if (route.page === 'about' || route.page === 'projects' || route.page === 'blog' || route.page === 'interests') return route.page;
        if (route.page === 'post') return 'blog';
        if (route.page === 'project') return 'projects';
        return '';
    }

    function listDir(dir: string): EntryBody | null {
        if (!dir) return { kind: 'files', items: Object.keys(SECTIONS).map((s) => `${s}/`) };
        if (dir === 'projects') return { kind: 'projects', items: sortedProjects };
        if (dir === 'blog') return { kind: 'posts', items: sortedPosts };
        if (dir === 'interests') return { kind: 'files', items: [...interestFiles.keys()] };
        if (dir === 'about') return { kind: 'files', items: ['experience.log'] };
        return null;
    }

    function cmd_ls(arg: string) {
        const dir = arg ? cleanPath(arg) : currentDir();
        const listing = listDir(dir);
        if (listing) print(listing);
        else print(text(`ls: cannot access '${arg}': No such file or directory`, 'error'));
    }

    // Maps directory segments below ~ to a page, e.g. ['blog', 'my-post'].
    function routeFor(segs: string[]): Route | null {
        if (!segs.length) return { page: 'home' };
        if (segs.length === 1) return SECTIONS[segs[0]] ?? null;
        if (segs.length === 2 && segs[0] === 'blog' && postsBySlug.has(segs[1])) return { page: 'post', slug: segs[1] };
        if (segs.length === 2 && segs[0] === 'projects' && projectsById.has(segs[1])) return { page: 'project', id: segs[1] };
        return null;
    }

    function resolveCd(arg: string): Route | null {
        const absolute = /^[~/]/.test(arg) || !arg;
        const walk = (start: string[]) => {
            const segs = [...start];
            for (const part of arg.replace(/^~?\/?/, '').split('/')) {
                if (part === '..') segs.pop();
                else if (part && part !== '.') segs.push(part);
            }
            return routeFor(segs);
        };
        const here = path.split('/').slice(1); // "~/blog/x" → ["blog", "x"]
        // relative to the current directory first; `cd projects` from anywhere also works
        return absolute ? walk([]) : walk(here) ?? walk([]);
    }

    function cmd_cd(arg: string) {
        const next = resolveCd(arg);
        if (!next) return print(text(`cd: no such file or directory: ${arg}`, 'error'));
        navigateTo(next);
    }

    function showProject(p: Project) {
        setSelectedId(p.id);
        print(
            text(`# ${p.name} [${p.year}]`, 'accent'),
            p.description,
            text(`Tech: ${p.tech.join(', ')}`, 'muted'),
            ...(p.repo ? [`Repo: ${p.repo}`] : []),
            ...(p.demo ? [`Demo: ${p.demo}`] : []),
            { kind: 'files', items: [`projects/${p.id}/`] },
        );
    }

    function cmd_open(arg: string) {
        const target = cleanPath(arg);
        if (SECTIONS[target]) {
            navigateTo(SECTIONS[target]);
            return print(text(`opening ${target}…`, 'muted'));
        }
        const p = projectsById.get(target);
        if (p) return showProject(p);
        const slug = target.replace(/^blog\//, '');
        if (postsBySlug.has(slug)) {
            navigateTo({ page: 'post', slug });
            return print(text(`opening blog/${slug}…`, 'muted'));
        }
        print(text(`open: '${arg}': not found — try \`ls projects/\``, 'error'));
    }

    function cmd_cat(arg: string) {
        const target = cleanPath(arg).replace(/^(about|interests|blog|projects)\//, '');
        if (target === 'experience.log') return print({ kind: 'timeline' });
        const interest = interestFiles.get(target) ?? interestFiles.get(`${target}.md`);
        if (interest) {
            return print(
                text(`# ${interest.title}`, 'accent'),
                interest.bullets.map((b) => `• ${b}`).join('\n'),
                ...interest.links.map((l) => `${l.label}: ${l.href}`),
            );
        }
        const post = postsBySlug.get(target);
        if (post) {
            return print(
                text(`# ${post.title}`, 'accent'),
                text(`${post.date} · ${post.tags.join(', ')}`, 'muted'),
                post.summary,
                { kind: 'posts', items: [post] },
            );
        }
        const p = projectsById.get(target);
        if (p) return showProject(p);
        print(text(`cat: ${arg}: No such file or directory`, 'error'));
    }

    function cmd_grep(arg: string) {
        const q = arg.replace(/^["']|["']$/g, '').toLowerCase();
        if (!q) return print(text('usage: grep <text>', 'error'));
        const hit = (...fields: string[]) => fields.some((f) => f.toLowerCase().includes(q));
        const ps = sortedProjects.filter((p) => hit(p.id, p.name, p.description, ...p.tech));
        const bs = sortedPosts.filter((b) => hit(b.title, b.summary, b.content, ...b.tags));
        if (!ps.length && !bs.length) return print(text(`grep: no matches for '${arg}'`, 'muted'));
        print(
            text(`${ps.length + bs.length} match${ps.length + bs.length === 1 ? '' : 'es'}`, 'muted'),
            ...(ps.length ? [{ kind: 'projects', items: ps } as EntryBody] : []),
            ...(bs.length ? [{ kind: 'posts', items: bs } as EntryBody] : []),
        );
    }

    function runCommand(raw: string) {
        const line = raw.trim();
        if (!line) return;

        print({ kind: 'command', text: line, path });
        if (commandLog.current.at(-1) !== line) commandLog.current.push(line);
        logCursor.current = commandLog.current.length;

        const [cmd, ...rest] = line.split(/\s+/);
        const arg = rest.join(' ');

        switch (cmd) {
            case 'help':
                print({ kind: 'help' });
                break;
            case 'neofetch':
                print({ kind: 'banner' });
                break;
            case 'whoami':
                print(whoamiText);
                break;
            case 'ls':
                cmd_ls(arg);
                break;
            case 'cd':
                cmd_cd(arg);
                break;
            case 'pwd':
                print(path.replace(/^~/, '/home/francesco'));
                break;
            case 'open':
                if (!arg) print(text('open: missing project id or section', 'error'));
                else cmd_open(arg);
                break;
            case 'cat':
                if (!arg) print(text('cat: missing file — try `ls interests/`', 'error'));
                else cmd_cat(arg);
                break;
            case 'grep':
                cmd_grep(arg);
                break;
            case 'stack':
                print({ kind: 'stack', rows: stack });
                break;
            case 'experience':
                print({ kind: 'timeline' });
                break;
            case 'snake':
                print({ kind: 'snake' });
                break;
            case 'matrix':
                print({ kind: 'matrix' });
                break;
            case 'contact':
                print(`GitHub:   ${social.github}`, `LinkedIn: ${social.linkedin}`, `Email:    ${social.email.replace(/^mailto:/, '')}`);
                break;
            case 'cv':
                if (arg === 'open') {
                    window.open(cvUrl, '_blank');
                    print(text(`Opened ${cvUrl}`, 'muted'));
                } else {
                    downloadFile(cvUrl, 'Francesco_Baiocchi_CV.pdf');
                    print(text(`Downloading CV… If it didn't start, use the CV button above or run \`cv open\``, 'muted'));
                }
                break;
            case 'theme':
                if (arg.toLowerCase() !== 'toggle') {
                    print(text('Usage: theme toggle', 'error'));
                    break;
                }
                setTheme('toggle');
                print(text('theme toggled', 'muted'));
                break;
            case 'history':
                print(commandLog.current.map((c, i) => `${String(i + 1).padStart(4)}  ${c}`).join('\n'));
                break;
            case 'clear':
                clear();
                break;
            case 'echo':
                print(arg);
                break;
            case 'date':
                print(new Date().toString());
                break;
            case 'sudo':
                print(text('francesco is not in the sudoers file. This incident will be reported.', 'error'));
                break;
            case 'exit':
                print(text("There's no escape from this portfolio. Try `help` instead.", 'muted'));
                break;
            default:
                print(text(`${cmd}: command not found — type \`help\``, 'error'));
        }
    }

    function clear() {
        setHistory([]);
    }

    // Possible values for the argument of each command.
    const argOptions = useMemo<Record<string, string[]>>(() => {
        const dirs = Object.keys(SECTIONS).map((s) => `${s}/`);
        const slugs = posts.map((p) => p.slug);
        return {
            open: [...dirs, ...projects.map((p) => p.id), ...slugs],
            cd: [...dirs, '..', '~', ...slugs, ...projects.map((p) => `projects/${p.id}/`)],
            ls: dirs,
            cat: ['experience.log', ...interestFiles.keys(), ...slugs, ...projects.map((p) => p.id)],
            cv: ['open'],
            theme: ['toggle'],
        };
    }, [projects, posts, interestFiles]);

    function candidatesFor(line: string): { head: string; word: string; options: string[] } | null {
        const parts = line.trimStart().split(/\s+/);
        if (parts.length === 1) return { head: '', word: parts[0], options: COMMAND_NAMES };
        if (parts.length === 2) return { head: parts[0], word: parts[1], options: argOptions[parts[0]] ?? [] };
        return null;
    }

    // Fish-style inline suggestion: last matching command from history, else a completion.
    const suggestion = useMemo(() => {
        if (!input.trim()) return '';
        const fromLog = [...commandLog.current].reverse().find((c) => c.startsWith(input) && c !== input);
        if (fromLog) return fromLog.slice(input.length);
        const c = candidatesFor(input);
        const match = c?.options.find((o) => o.startsWith(c.word) && o !== c.word);
        return match ? match.slice(c!.word.length) : '';
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input, argOptions]);

    function complete() {
        const c = candidatesFor(input);
        if (!c) return;
        const matches = c.options.filter((o) => o.startsWith(c.word));
        if (!matches.length) return;

        const join = (w: string) => (c.head ? `${c.head} ${w}` : w);
        if (matches.length === 1) {
            const done = matches[0];
            setInput(join(done) + (done.endsWith('/') ? '' : ' '));
            return;
        }
        // several matches: complete the shared prefix and show the options, like bash
        setInput(join(commonPrefix(matches)));
        print({ kind: 'command', text: input, path }, { kind: 'files', items: matches });
    }

    function browseLog(step: -1 | 1) {
        const log = commandLog.current;
        if (!log.length) return;
        logCursor.current = Math.min(log.length, Math.max(0, logCursor.current + step));
        setInput(log[logCursor.current] ?? '');
    }

    function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        const atEnd = e.currentTarget.selectionStart === input.length;
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            browseLog(-1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            browseLog(1);
        } else if (e.key === 'ArrowRight' && atEnd && suggestion) {
            e.preventDefault();
            setInput(input + suggestion);
        } else if (e.key === 'Tab') {
            if (!input.trim()) return; // keep normal focus navigation
            e.preventDefault();
            complete();
        } else if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            clear();
        } else if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            print({ kind: 'command', text: `${input}^C`, path });
            setInput('');
        }
    }

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        runCommand(input);
        setInput('');
    }

    // For interactive entries (games) that report back when they end; stable across renders.
    const printLine = useCallback((line: string, tone?: Tone) => {
        setHistory((h) => [...h, { ...text(line, tone), id: nextId.current++, at: Date.now() } as HistoryEntry]);
    }, []);

    return {
        history,
        input,
        setInput,
        suggestion,
        path,
        selectedId,
        inputRef,
        runCommand,
        printLine,
        clear,
        onSubmit,
        onKeyDown,
        lastCommand: commandLog.current.at(-1),
        stats: { projects: projects.length, posts: posts.length, stack },
    };
}

export type UseTerminalReturn = ReturnType<typeof useTerminal>;
