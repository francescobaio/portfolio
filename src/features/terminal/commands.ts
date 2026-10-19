export type CommandInfo = {
    usage: string;
    description: string;
    // what gets run when the command is clicked in `help`
    example: string;
};

export const COMMANDS: CommandInfo[] = [
    { usage: 'help', description: 'show this message', example: 'help' },
    { usage: 'neofetch', description: 'system info, portfolio edition', example: 'neofetch' },
    { usage: 'whoami', description: 'brief bio', example: 'whoami' },
    { usage: 'experience', description: 'education & work timeline', example: 'experience' },
    { usage: 'ls [dir]', description: 'list the current (or given) directory', example: 'ls projects/' },
    { usage: 'cd <dir>', description: 'go to about, projects, blog, interests, .. or ~', example: 'cd blog' },
    { usage: 'open <id>', description: 'show a project, open a post or a page', example: 'open projects/' },
    { usage: 'cat <file>', description: 'print a project, post or interest', example: 'cat cycling.md' },
    { usage: 'grep <text>', description: 'search projects and posts', example: 'grep pytorch' },
    { usage: 'stack', description: 'tools I use most, by project count', example: 'stack' },
    { usage: 'contact', description: 'links & email', example: 'contact' },
    { usage: 'cv [open]', description: 'download (or open) my CV', example: 'cv open' },
    { usage: 'theme toggle', description: 'toggle light/dark', example: 'theme toggle' },
    { usage: 'snake', description: 'play snake (arrows/WASD, q to quit)', example: 'snake' },
    { usage: 'matrix', description: 'follow the white rabbit', example: 'matrix' },
    { usage: 'history', description: 'previously run commands', example: 'history' },
    { usage: 'clear', description: 'clear screen (or Ctrl+L)', example: 'clear' },
];

// Commands that work but are not advertised in `help`.
const HIDDEN = ['pwd', 'echo', 'date', 'sudo', 'exit'];

export const COMMAND_NAMES = [...COMMANDS.map((c) => c.usage.split(' ')[0]), ...HIDDEN];
