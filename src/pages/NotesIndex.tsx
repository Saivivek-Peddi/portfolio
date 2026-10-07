import { notes } from '../lib/notes'
import { NoteRow } from '../components/NoteRow'
import { Rise } from '../components/Rise'

export function NotesIndex() {
  return (
    <div className="min-h-screen px-5 pt-36 pb-40 md:px-16 md:pt-44">
      <h1 className="shout text-[clamp(3.5rem,12vw,11rem)]">
        <Rise text="Writing" />
      </h1>
      <p className="mono mt-8 max-w-[44ch] text-dim">
        Notes on harnesses, agents, memory, and building mlpal. In my own words.{' '}
        <a href="/rss.xml" className="wipe text-fg">
          RSS
        </a>
      </p>
      <div className="mt-20 border-b border-line">
        {notes.map((n) => (
          <NoteRow key={n.slug} note={n} />
        ))}
      </div>
    </div>
  )
}
