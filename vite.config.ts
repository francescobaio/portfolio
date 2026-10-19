import { execSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { SITE, allRoutes, metaFor } from './src/lib/seo'
import { routeHref } from './src/lib/routes'
import type { Route } from './src/types'

// Date of the last commit, shown in the footer.
function lastUpdate(): string {
  try {
    return execSync('git log -1 --format=%cs').toString().trim()
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function pageHtml(template: string, route: Route): string {
  const { title, description } = metaFor(route)
  const url = SITE.url + routeHref(route)
  const notFound = route.page === 'notfound'
  const tags = [
    `<meta name="description" content="${escape(description)}" />`,
    notFound ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${url}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${escape(SITE.name)}" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE.url}${SITE.image}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta name="twitter:card" content="summary_large_image" />',
  ].join('\n  ')
  return template
    .replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`)
    .replace('<!--page-meta-->', tags)
}

// GitHub Pages serves static files only: write one index.html per route (so every URL works
// on reload and crawlers see the right title/preview), plus a 404 fallback, sitemap and robots.txt.
function staticPages(): Plugin {
  let outDir = 'dist'
  return {
    name: 'static-pages',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const template = readFileSync(join(outDir, 'index.html'), 'utf8')
      const routes = allRoutes()
      for (const route of routes) {
        const file = join(outDir, routeHref(route), 'index.html')
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, pageHtml(template, route))
      }
      writeFileSync(join(outDir, '404.html'), pageHtml(template, { page: 'notfound', path: '' }))

      const today = lastUpdate()
      const urls = routes
        .map((r) => `  <url><loc>${SITE.url}${routeHref(r)}</loc><lastmod>${today}</lastmod></url>`)
        .join('\n')
      writeFileSync(
        join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
      )
      writeFileSync(join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`)
    },
  }
}

export default defineConfig({
  plugins: [react(), staticPages()],
  base: '/',
  define: {
    __LAST_UPDATE__: JSON.stringify(lastUpdate()),
  },
})
