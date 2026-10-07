import { renderToString } from 'react-dom/server'
import { App } from './App'
import { absoluteUrl, matchRoute, NOT_FOUND_PATH, routes, type PageMeta } from './routes'
import { profile, SITE_URL } from './content/profile'
import { notes } from './lib/notes'

const OG_IMAGE = absoluteUrl('/og.jpg')

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function personJsonLd(): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    url: SITE_URL,
    image: absoluteUrl('/img/portrait-880.jpg'),
    jobTitle: 'Co-founder',
    homeLocation: { '@type': 'Place', name: 'Hyderabad, India' },
    worksFor: { '@type': 'Organization', name: 'mlpal', url: profile.links.mlpal },
    alumniOf: ['University of California, Davis', 'Birla Institute of Technology and Science, Pilani'],
    sameAs: [profile.links.linkedin, profile.links.github],
  }
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`
}

function head(meta: PageMeta): string {
  const url = absoluteUrl(meta.path === NOT_FOUND_PATH ? '/' : meta.path)
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="author" content="${profile.name}" />`,
    meta.path === NOT_FOUND_PATH ? `<meta name="robots" content="noindex" />` : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    meta.published ? `<meta property="article:published_time" content="${meta.published}" />` : '',
    meta.path === '/' ? personJsonLd() : '',
  ]
  return tags.filter(Boolean).join('\n    ')
}

export function render(path: string): { html: string; head: string } {
  const route = matchRoute(path)
  return { html: renderToString(<App route={route} />), head: head(route) }
}

export const paths = [...routes.map((r) => r.path), NOT_FOUND_PATH]

export function rss(): string {
  const items = notes
    .map(
      (n) => `    <item>
      <title>${escapeHtml(n.title)}</title>
      <link>${absoluteUrl(`/notes/${n.slug}/`)}</link>
      <guid>${absoluteUrl(`/notes/${n.slug}/`)}</guid>
      <pubDate>${new Date(`${n.date}T16:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeHtml(n.summary)}</description>
    </item>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Notes by ${profile.name}</title>
    <link>${absoluteUrl('/notes/')}</link>
    <description>Notes on harnesses, agents, memory and building mlpal.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`
}

export function sitemap(): string {
  const urls = routes.map((r) => `  <url><loc>${absoluteUrl(r.path)}</loc>${r.published ? `<lastmod>${r.published}</lastmod>` : ''}</url>`)
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`
}
