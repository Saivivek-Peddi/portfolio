import { formatNoteDate, type Note } from '../lib/notes'

export function NoteRow({ note }: { note: Note }) {
  return (
    <a
      href={`/notes/${note.slug}/`}
      className="group grid grid-cols-12 gap-x-4 gap-y-2 border-t border-line py-8 transition-colors hover:bg-fg hover:text-bg md:py-10"
    >
      <span className="ui col-span-12 text-dim group-hover:text-bg/60 md:col-span-3">
        <time dateTime={note.date}>{formatNoteDate(note.date)}</time>
      </span>
      <span className="col-span-12 md:col-span-6">
        <span
          className="block text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.05] font-[560] tracking-[-0.015em] transition-transform duration-500 ease-out-expo group-hover:translate-x-3"
          style={{ viewTransitionName: `note-${note.slug}` }}
        >
          {note.title}
        </span>
        <span className="mt-3 block max-w-[52ch] text-dim group-hover:text-bg/70">{note.summary}</span>
      </span>
      <span className="ui col-span-12 text-dim group-hover:text-bg/60 md:col-span-3 md:text-right">{note.readingMinutes} min read</span>
    </a>
  )
}
