// Minimal Markdown → HTML for blog posts: headings, paragraphs, lists,
// horizontal rules, bold/italic/code and http(s) links. Content is escaped first.

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function inline(s: string): string {
    return escapeHtml(s)
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

export function mdToHtml(md: string): string {
    const blocks: string[] = [];
    let paragraph: string[] = [];
    let list: string[] = [];

    const flush = () => {
        if (paragraph.length) blocks.push(`<p>${paragraph.join('<br>')}</p>`);
        if (list.length) blocks.push(`<ul>${list.map((li) => `<li>${li}</li>`).join('')}</ul>`);
        paragraph = [];
        list = [];
    };

    // Lines are trimmed, so posts can be indented inside template literals.
    for (const line of (md || '').split('\n').map((l) => l.trim())) {
        const heading = line.match(/^(#{1,3})\s+(.+)$/);
        const item = line.match(/^[-*]\s+(.+)$/);

        if (!line) {
            flush();
        } else if (/^(-{3,}|\*{3,})$/.test(line)) {
            flush();
            blocks.push('<hr>');
        } else if (heading) {
            flush();
            const level = heading[1].length;
            blocks.push(`<h${level}>${inline(heading[2])}</h${level}>`);
        } else if (item) {
            if (paragraph.length) flush();
            list.push(inline(item[1]));
        } else {
            if (list.length) flush();
            paragraph.push(inline(line));
        }
    }
    flush();

    return blocks.join('\n');
}
