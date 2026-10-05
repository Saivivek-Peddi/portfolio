import type { ReactElement } from 'react'
import { description, profile, SITE_URL } from './content/profile'
import { notes } from './lib/notes'
import { Home } from './pages/Home'
import { NotesIndex } from './pages/NotesIndex'
import { NotePage } from './pages/NotePage'
import { NotFound } from './pages/NotFound'

export type PageMeta = {
  title: string
  description: string
  path: string
  type: 'website' | 'article'
  published?: string
}

export type Route = PageMeta & { element: () => ReactElement }

export const NOT_FOUND_PATH = '/404'

export const routes: Route[] = [
  {
    path: '/',
    title: `${profile.name}, founder of mlpal`,
    description,
    type: 'website',
    element: () => <Home />,
  },
  {
    path: '/notes/',
    title: `Notes, ${profile.name}`,
    description: 'Notes on harnesses, agents, memory and building mlpal.',
    type: 'website',
    element: () => <NotesIndex />,
  },
  ...notes.map<Route>((note) => ({
    path: `/notes/${note.slug}/`,
    title: note.title,
    description: note.summary,
    type: 'article',
    published: note.date,
    element: () => <NotePage note={note} />,
  })),
]

const notFound: Route = {
  path: NOT_FOUND_PATH,
  title: `Not found, ${profile.name}`,
  description,
  type: 'website',
  element: () => <NotFound />,
}

export function normalizePath(pathname: string): string {
  if (pathname === '' || pathname === '/') return '/'
  const clean = pathname.replace(/\/index\.html$/, '/')
  return clean.endsWith('/') ? clean : `${clean}/`
}

export function matchRoute(pathname: string): Route {
  const path = normalizePath(pathname)
  return routes.find((r) => r.path === path) ?? notFound
}

export const absoluteUrl = (path: string) => `${SITE_URL}${path}`
