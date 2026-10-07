// Off the clock, in Sai's own words where possible (from his answers, 2026-10-06).
export const life = {
  kitchen: {
    lines: ['I make a great dosa.', 'I bake my own bread.', 'Two new recipe books, working through them.'],
    photos: [
      { src: '/kitchen/naan.webp', alt: 'Naan with curry and lime, plated on a dark table' },
      { src: '/kitchen/plated.webp', alt: 'A plated dish with greens beside a glass of red wine' },
      { src: '/kitchen/curry.webp', alt: 'Curry and naan, shot from above' },
    ],
  },
  cricket: {
    lines: ['All-rounder: I bat and I bowl.', 'Big-time Dhoni fan.'],
    jersey: '7',
  },
  badminton: {
    line: 'Badminton, any day.',
  },
  music: {
    quote: 'Music has no language and no boundaries.',
    note: 'It changes from time to time. Right now: indie from India and Pakistan, and lately some Italian.',
    playing: ['Abhijeet Srivastava', 'Maanu', 'Hasan Raheem', 'Annural Khalid', 'Something Italian'],
  },
  books: {
    finished: { title: 'The Secret of Secrets', author: 'Dan Brown', note: 'Just finished' },
    favorite: { title: 'Project Hail Mary', author: 'Andy Weir', note: 'Recent favorite. Rocky is love.' },
  },
} as const

// The lines Sai keeps coming back to (from his interview and LinkedIn).
export const beliefs = {
  churchill: "Success is not final. Failure is not fatal. It's the courage to continue that counts.",
  own: "Things you think will happen might not, and things you don't expect might.",
  banner: 'Stay hungry, stay foolish.',
}
