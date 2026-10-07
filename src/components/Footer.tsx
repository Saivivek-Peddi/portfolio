import { useState } from 'react'
import { profile } from '../content/profile'

const LINKS = [
  { label: 'LinkedIn', href: profile.links.linkedin },
  { label: 'GitHub', href: profile.links.github },
  { label: 'Instagram', href: profile.links.instagram },
  { label: 'mlpal.ai', href: profile.links.mlpal },
  { label: 'RSS', href: '/rss.xml' },
]

export function Footer() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      location.href = `mailto:${profile.email}`
    }
  }

  return (
    <footer id="contact" data-ink="light" className="relative bg-black px-5 pt-32 pb-36 text-white md:px-16 md:pb-40">
      <p className="ui text-white/50">Say hi</p>
      <a href={`mailto:${profile.email}`} className="shout mt-6 block text-[clamp(2.4rem,9.2vw,10rem)] transition-colors duration-300 hover:text-lime">
        {profile.email}
      </a>
      <div className="ui mt-14 grid grid-cols-12 gap-4 border-t border-white/15 pt-6">
        <button type="button" onClick={copy} className="wipe col-span-12 text-left uppercase md:col-span-3" aria-live="polite">
          {copied ? 'Copied' : 'Copy email'}
        </button>
        <ul className="col-span-12 flex flex-wrap gap-x-8 gap-y-2 md:col-span-6">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="wipe">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="col-span-12 text-white/50 md:col-span-3 md:text-right">&copy; 2026 {profile.name}</p>
      </div>
    </footer>
  )
}
