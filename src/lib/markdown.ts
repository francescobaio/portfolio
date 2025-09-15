export function mdToHtml(md: string): string {
    let html = (md || '').trim();

    html = html.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
        .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
        .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>');

    html = html.replace(/\[(.+?)\]\((https?:[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');

    html = html.replace(/(^|\n)[\t ]*-\s+(.+)(?=\n|$)/g, '$1<li>$2</li>');

    html = html.replace(/(?:<li>.*<\/li>)(?!\s*<\/ul>)/gs, (m) => `<ul>${m}</ul>`);

    html = html.replace(/(^|\n)([^<\n][^\n]*)/g, (m, br, line) => {
        if (/^<h\d|^<ul>|^<li>|^<\/ul>|^<\/li>/.test(line)) return m;
        const trimmed = line.trim();
        if (!trimmed) return m;
        return `${br}<p>${line}</p>`;
    });

    return html;
}
