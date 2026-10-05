// Renders every route to static HTML after `vite build` (client) and
// `vite build --ssr` (server). GitHub Pages serves dist/client as-is:
// /notes/x/ -> notes/x/index.html, unknown paths -> 404.html.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const clientDir = join(root, 'dist/client')
const serverEntry = join(root, 'dist/server/entry-server.js')

const template = await readFile(join(clientDir, 'index.html'), 'utf8')
for (const marker of ['<!--app-head-->', '<!--app-html-->', '<!--app-path-->']) {
  if (!template.includes(marker)) throw new Error(`prerender: template is missing ${marker}`)
}

const { render, paths, rss, sitemap } = await import(pathToFileURL(serverEntry).href)

const outFile = (path) => (path === '/404' ? '404.html' : join(path.slice(1), 'index.html'))

for (const path of paths) {
  const { html, head } = render(path)
  const page = template
    .replace('<!--app-head-->', head)
    .replace('<!--app-path-->', path)
    .replace('<!--app-html-->', html)
  const file = join(clientDir, outFile(path))
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, page)
  console.log(`prerendered ${path} -> ${outFile(path)}`)
}

await writeFile(join(clientDir, 'rss.xml'), rss())
await writeFile(join(clientDir, 'sitemap.xml'), sitemap())
await rm(join(root, 'dist/server'), { recursive: true, force: true })
console.log(`prerendered ${paths.length} pages + rss.xml + sitemap.xml`)
