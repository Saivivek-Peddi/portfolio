import { notes } from '../lib/notes'
import { NoteRow } from './NoteRow'

export function Writing() {
  if (notes.length === 0) return null
  return (
    <section id="writing" className="px-5 py-24 md:px-16 md:py-32" aria-labelledby="writing-title">
      <div className="ui flex items-baseline justify-between pb-3">
        <h2 id="writing-title">Writing</h2>
        <a href="/notes/" className="wipe text-dim">
          All notes ({String(notes.length).padStart(2, '0')})
        </a>
      </div>
      <div className="border-b border-line">
        {notes.slice(0, 4).map((n) => (
          <NoteRow key={n.slug} note={n} />
        ))}
      </div>
    </section>
  )
}
