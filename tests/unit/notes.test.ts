import { describe, expect, it } from 'vitest'
import { notes, parseMeta, slugFromPath } from '../../src/lib/notes'
import remarkReadingTime, { countWords } from '../../scripts/remark-reading-time.mjs'

describe('slugFromPath', () => {
  it('uses the file name without extension', () => {
    expect(slugFromPath('../notes/the-loop-should-be-yours.mdx')).toBe('the-loop-should-be-yours')
  })
})

describe('remarkReadingTime', () => {
  const text = (value: string) => ({ type: 'text', value })
  const tree = (words: number) => ({
    type: 'root',
    children: [
      { type: 'yaml', value: 'title: x' },
      { type: 'paragraph', children: [text(Array(words).fill('word').join(' '))] },
    ],
  })

  it('ignores frontmatter when counting words', () => {
    expect(countWords(tree(10))).toBe(10)
  })

  it('appends readingMinutes to the frontmatter, never zero', () => {
    const t = tree(5)
    remarkReadingTime()(t)
    expect(t.children[0].value).toBe('title: x\nreadingMinutes: 1')
  })

  it('scales with word count', () => {
    const t = tree(2300)
    remarkReadingTime()(t)
    expect(t.children[0].value).toContain('readingMinutes: 10')
  })
})

describe('parseMeta', () => {
  const valid = { title: 'T', date: '2026-10-05', summary: 'S', tags: ['a'], readingMinutes: 3 }

  it('accepts valid frontmatter', () => {
    expect(parseMeta('x', valid)).toEqual(valid)
  })

  it('normalizes YAML dates parsed as Date objects', () => {
    expect(parseMeta('x', { ...valid, date: new Date('2026-10-05T00:00:00Z') }).date).toBe('2026-10-05')
  })

  it('defaults tags to an empty list', () => {
    const { tags: _tags, ...noTags } = valid
    expect(parseMeta('x', noTags).tags).toEqual([])
  })

  it.each([
    ['title', { ...valid, title: '' }],
    ['summary', { ...valid, summary: undefined }],
    ['date', { ...valid, date: '10/05/2026' }],
    ['tags', { ...valid, tags: 'a,b' }],
    ['readingMinutes', { ...valid, readingMinutes: undefined }],
  ])('rejects a bad %s with the note slug in the message', (_field, fm) => {
    expect(() => parseMeta('my-note', fm)).toThrow(/my-note/)
  })
})

describe('notes collection', () => {
  it('loads every note through the real MDX pipeline, newest first', () => {
    expect(notes.length).toBeGreaterThan(0)
    const dates = notes.map((n) => n.date)
    expect([...dates].sort().reverse()).toEqual(dates)
    for (const n of notes) expect(n.readingMinutes).toBeGreaterThan(0)
  })
})
