import type { ComponentType } from 'react'

export type NoteMeta = {
  title: string
  date: string
  summary: string
  tags: string[]
  readingMinutes: number
}

export type Note = NoteMeta & {
  slug: string
  Body: ComponentType
}

type NoteModule = { default: ComponentType; frontmatter: Record<string, unknown> }

const modules = import.meta.glob<NoteModule>('../notes/*.mdx', { eager: true })

export function slugFromPath(path: string): string {
  const file = path.split('/').pop() ?? ''
  return file.replace(/\.mdx$/, '')
}

// Frontmatter is author input: fail the build loudly instead of rendering a broken card.
export function parseMeta(slug: string, fm: Record<string, unknown>): NoteMeta {
  const { title, date, summary, tags, readingMinutes } = fm
  if (typeof title !== 'string' || !title) throw new Error(`note "${slug}": missing title`)
  if (typeof summary !== 'string' || !summary) throw new Error(`note "${slug}": missing summary`)
  const iso = date instanceof Date ? date.toISOString().slice(0, 10) : date
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    throw new Error(`note "${slug}": date must be YYYY-MM-DD`)
  }
  if (tags !== undefined && !(Array.isArray(tags) && tags.every((t) => typeof t === 'string'))) {
    throw new Error(`note "${slug}": tags must be a list of strings`)
  }
  if (typeof readingMinutes !== 'number') throw new Error(`note "${slug}": readingMinutes missing (remark plugin not run?)`)
  return { title, date: iso, summary, tags: (tags as string[] | undefined) ?? [], readingMinutes }
}

export const notes: Note[] = Object.entries(modules)
  .map(([path, mod]) => {
    const slug = slugFromPath(path)
    return {
      slug,
      ...parseMeta(slug, mod.frontmatter),
      Body: mod.default,
    }
  })
  .sort((a, b) => b.date.localeCompare(a.date))

export function formatNoteDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
