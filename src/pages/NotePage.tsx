import { formatNoteDate, type Note } from '../lib/notes'
import { profile } from '../content/profile'

export function NotePage({ note }: { note: Note }) {
  const { Body } = note
  return (
    <article className="px-5 pt-36 pb-40 md:px-16 md:pt-44">
      <div className="grid grid-cols-12 gap-x-4">
        <div className="ui col-span-12 mb-10 text-dim md:col-span-3 md:mb-0">
          <a href="/notes/" className="wipe">
            &larr; Writing
          </a>
          <p className="mt-6">
            <time dateTime={note.date}>{formatNoteDate(note.date)}</time>
          </p>
          <p>{note.readingMinutes} min read</p>
        </div>
        <div className="col-span-12 md:col-span-9">
          <h1
            className="max-w-[18ch] text-[clamp(2.6rem,6vw,5.4rem)] leading-[0.98] font-[640] tracking-[-0.025em]"
            style={{ viewTransitionName: `note-${note.slug}` }}
          >
            {note.title}
          </h1>
          <div className="prose-note mt-16">
            <Body />
          </div>
          <p className="mono mt-20 max-w-[40rem] border-t border-line pt-6 text-dim">
            {profile.name}. Thoughts on this? I read everything at{' '}
            <a href={`mailto:${profile.email}`} className="wipe text-fg">
              {profile.email}
            </a>
          </p>
        </div>
      </div>
    </article>
  )
}
