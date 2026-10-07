// Die-cut stickers drawn as standalone SVG (rasterized once, then drawn to a
// canvas by the physics layer). Text uses system fonts because SVG rendered as
// an image cannot load web fonts.

const SIZE = 160

const DIE_CUT = `
  <filter id="cut" x="-25%" y="-25%" width="150%" height="150%">
    <feMorphology in="SourceAlpha" operator="dilate" radius="6" result="grow"/>
    <feFlood flood-color="#ffffff"/>
    <feComposite in2="grow" operator="in" result="border"/>
    <feGaussianBlur in="grow" stdDeviation="2.5" result="soft"/>
    <feOffset in="soft" dy="3" result="drop"/>
    <feFlood flood-color="#000" flood-opacity="0.28"/>
    <feComposite in2="drop" operator="in" result="shadow"/>
    <feMerge><feMergeNode in="shadow"/><feMergeNode in="border"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>`

const HEAVY = `font-family="Arial Black, Arial, Helvetica, sans-serif" font-weight="900"`

function sticker(body: string, defs = ''): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
    <defs>${DIE_CUT}${defs}</defs><g filter="url(#cut)">${body}</g></svg>`
}

export type StickerArt = { id: string; svg: string; label: string }

export const STICKERS: StickerArt[] = [
  {
    id: 'smiley',
    label: 'smiley with glasses',
    svg: sticker(
      `<circle cx="80" cy="80" r="52" fill="url(#sy)"/>
       <circle cx="62" cy="72" r="14" fill="#fff" stroke="#151515" stroke-width="5"/>
       <circle cx="98" cy="72" r="14" fill="#fff" stroke="#151515" stroke-width="5"/>
       <path d="M76 72h8" stroke="#151515" stroke-width="5"/>
       <circle cx="64" cy="74" r="5" fill="#151515"/><circle cx="100" cy="74" r="5" fill="#151515"/>
       <path d="M58 98c12 14 32 14 44 0" fill="none" stroke="#151515" stroke-width="6" stroke-linecap="round"/>`,
      `<radialGradient id="sy" cx="0.38" cy="0.32"><stop offset="0" stop-color="#fff38a"/><stop offset="1" stop-color="#ffb400"/></radialGradient>`,
    ),
  },
  {
    id: 'star',
    label: 'star with a cheeky face',
    svg: sticker(
      `<path d="M80 22l16 34 37 4-27 25 8 37-34-19-34 19 8-37-27-25 37-4z" fill="url(#st)" stroke="#e08a00" stroke-width="3" stroke-linejoin="round"/>
       <circle cx="68" cy="76" r="5" fill="#151515"/><circle cx="92" cy="76" r="5" fill="#151515"/>
       <path d="M70 92c6 6 14 6 20 0" fill="none" stroke="#151515" stroke-width="5" stroke-linecap="round"/>
       <path d="M80 96c0 8 9 8 9 0" fill="#ff5b7f"/>`,
      `<linearGradient id="st" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe45c"/><stop offset="1" stop-color="#ffb21f"/></linearGradient>`,
    ),
  },
  {
    id: 'heart',
    label: 'glossy heart',
    svg: sticker(
      `<path d="M80 130C40 104 26 82 26 62c0-17 13-30 29-30 11 0 20 6 25 15 5-9 14-15 25-15 16 0 29 13 29 30 0 20-14 42-54 68z" fill="url(#ht)"/>
       <ellipse cx="54" cy="56" rx="12" ry="7" fill="#fff" opacity="0.7" transform="rotate(-30 54 56)"/>`,
      `<radialGradient id="ht" cx="0.35" cy="0.3"><stop offset="0" stop-color="#ff7aa0"/><stop offset="1" stop-color="#e8174a"/></radialGradient>`,
    ),
  },
  {
    id: 'bolt',
    label: 'lightning bolt',
    svg: sticker(`<path d="M92 18L40 90h34l-10 52 56-76H84z" fill="#d7ff3a" stroke="#151515" stroke-width="5" stroke-linejoin="round"/>`),
  },
  {
    id: 'mlpal',
    label: 'mlpal mark',
    svg: sticker(
      `<rect x="26" y="26" width="108" height="108" rx="26" fill="#121212"/>
       <path d="M80 48L110 102H50Z M64 76L80 102L96 76" fill="none" stroke="#ffd166" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>`,
    ),
  },
  {
    id: 'hop',
    label: 'HOP',
    svg: sticker(
      `<rect x="16" y="50" width="128" height="60" rx="30" fill="url(#hp)"/>
       <text x="80" y="93" text-anchor="middle" font-size="38" fill="#fff" ${HEAVY} letter-spacing="1">HOP</text>`,
      `<linearGradient id="hp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fb2ff"/><stop offset="0.5" stop-color="#2f6bff"/><stop offset="1" stop-color="#1b31d6"/></linearGradient>`,
    ),
  },
  {
    id: 'ship',
    label: 'SHIP IT',
    svg: sticker(
      `<circle cx="80" cy="80" r="54" fill="#ff5a1f"/>
       <circle cx="80" cy="80" r="44" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="4 6"/>
       <text x="80" y="76" text-anchor="middle" font-size="24" fill="#fff" ${HEAVY}>SHIP</text>
       <text x="80" y="102" text-anchor="middle" font-size="24" fill="#fff" ${HEAVY}>IT</text>`,
    ),
  },
  {
    id: 'lgtm',
    label: 'LGTM',
    svg: sticker(
      `<g transform="rotate(-10 80 80)"><rect x="22" y="54" width="116" height="52" rx="10" fill="#19c37d"/>
       <text x="80" y="91" text-anchor="middle" font-size="30" fill="#fff" ${HEAVY}>LGTM</text></g>`,
    ),
  },
  {
    id: 'coffee',
    label: 'coffee',
    svg: sticker(
      `<path d="M58 30c-6 8 6 12 0 20M80 26c-6 8 6 12 0 20M102 30c-6 8 6 12 0 20" fill="none" stroke="#9aa0a6" stroke-width="4" stroke-linecap="round"/>
       <path d="M40 60h80l-8 66a8 8 0 0 1-8 7H56a8 8 0 0 1-8-7z" fill="#fff" stroke="#151515" stroke-width="5" stroke-linejoin="round"/>
       <path d="M120 74c18 0 18 30 0 30" fill="none" stroke="#151515" stroke-width="5"/>
       <ellipse cx="80" cy="62" rx="38" ry="6" fill="#7a4a24"/>`,
    ),
  },
  {
    id: 'loop',
    label: 'infinity loop',
    svg: sticker(
      `<path d="M80 80c-16-30-60-30-60 0s44 30 60 0 60-30 60 0-44 30-60 0z" fill="none" stroke="url(#lp)" stroke-width="14" stroke-linecap="round"/>`,
      `<linearGradient id="lp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7cf7ff"/><stop offset="0.35" stop-color="#8a7bff"/><stop offset="0.7" stop-color="#ff7bd5"/><stop offset="1" stop-color="#ffe27a"/></linearGradient>`,
    ),
  },
  {
    id: 'gpu',
    label: 'GPU chip',
    svg: sticker(
      `${[44, 62, 80, 98, 116].map((p) => `<rect x="${p - 3}" y="24" width="6" height="14" fill="#d9a441"/><rect x="${p - 3}" y="122" width="6" height="14" fill="#d9a441"/><rect x="24" y="${p - 3}" width="14" height="6" fill="#d9a441"/><rect x="122" y="${p - 3}" width="14" height="6" fill="#d9a441"/>`).join('')}
       <rect x="36" y="36" width="88" height="88" rx="10" fill="#1d3a2b"/>
       <rect x="50" y="50" width="60" height="60" rx="6" fill="#2c5a41" stroke="#62d69a" stroke-width="2"/>
       <circle cx="70" cy="76" r="5" fill="#d7ff3a"/><circle cx="90" cy="76" r="5" fill="#d7ff3a"/>
       <path d="M70 92c6 5 14 5 20 0" fill="none" stroke="#d7ff3a" stroke-width="4" stroke-linecap="round"/>`,
    ),
  },
  {
    id: 'cursor',
    label: 'cursor',
    svg: sticker(
      `<path d="M50 30v86l22-20 14 34 16-7-14-33h30z" fill="url(#cr)" stroke="#0d1a6e" stroke-width="4" stroke-linejoin="round"/>`,
      `<linearGradient id="cr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6f9bff"/><stop offset="1" stop-color="#1b31d6"/></linearGradient>`,
    ),
  },
  {
    id: 'ms',
    label: '+8.5 ms',
    svg: sticker(
      `<rect x="18" y="56" width="124" height="48" rx="24" fill="#d7ff3a"/>
       <text x="80" y="88" text-anchor="middle" font-size="24" fill="#151515" font-family="Menlo, Consolas, monospace" font-weight="700">+8.5ms</text>`,
    ),
  },
  {
    id: 'eyes',
    label: 'googly eyes',
    svg: sticker(
      `<circle cx="56" cy="80" r="28" fill="#fff" stroke="#151515" stroke-width="5"/>
       <circle cx="104" cy="80" r="28" fill="#fff" stroke="#151515" stroke-width="5"/>
       <circle cx="64" cy="88" r="12" fill="#151515"/><circle cx="96" cy="88" r="12" fill="#151515"/>
       <circle cx="60" cy="84" r="4" fill="#fff"/><circle cx="92" cy="84" r="4" fill="#fff"/>`,
    ),
  },
  {
    id: 'dosa',
    label: 'dosa',
    svg: sticker(
      `<path d="M18 104C40 50 120 50 142 104z" fill="url(#ds)" stroke="#8a4b12" stroke-width="4" stroke-linejoin="round"/>
       ${[44, 62, 80, 98, 116].map((x, i) => `<circle cx="${x}" cy="${86 - (i % 2) * 8}" r="3" fill="#a85a17" opacity="0.6"/>`).join('')}
       <ellipse cx="44" cy="120" rx="16" ry="9" fill="#fff" stroke="#151515" stroke-width="3"/>
       <ellipse cx="116" cy="120" rx="16" ry="9" fill="#e8562a" stroke="#151515" stroke-width="3"/>`,
      `<linearGradient id="ds" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6c260"/><stop offset="1" stop-color="#d98a2b"/></linearGradient>`,
    ),
  },
  {
    id: 'bread',
    label: 'homemade bread',
    svg: sticker(
      `<path d="M28 116c-8-44 20-68 52-68s60 24 52 68z" fill="#d9a35b" stroke="#151515" stroke-width="4" stroke-linejoin="round"/>
       <path d="M58 70c8 8 8 22 0 32M80 64c8 9 8 26 0 38M102 70c8 8 8 22 0 32" fill="none" stroke="#9c6526" stroke-width="4" stroke-linecap="round"/>`,
    ),
  },
  {
    id: 'ball',
    label: 'cricket ball',
    svg: sticker(
      `<circle cx="80" cy="80" r="46" fill="url(#cb)"/>
       <path d="M52 44c18 22 18 50 0 72M108 44c-18 22-18 50 0 72" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="5 5"/>
       <ellipse cx="64" cy="62" rx="12" ry="7" fill="#fff" opacity="0.45" transform="rotate(-30 64 62)"/>`,
      `<radialGradient id="cb" cx="0.35" cy="0.3"><stop offset="0" stop-color="#ff4d5e"/><stop offset="1" stop-color="#a3101e"/></radialGradient>`,
    ),
  },
  {
    id: 'shuttle',
    label: 'shuttlecock',
    svg: sticker(
      `<g transform="rotate(-30 80 80)"><path d="M52 30h56l-16 70H68z" fill="#fff" stroke="#151515" stroke-width="4" stroke-linejoin="round"/>
       <path d="M64 30l10 70M80 30v70M96 30l-10 70M56 54h48M60 78h40" stroke="#151515" stroke-width="2" opacity="0.4"/>
       <path d="M66 100h28v10a14 14 0 0 1-28 0z" fill="#d7ff3a" stroke="#151515" stroke-width="4"/></g>`,
    ),
  },
  {
    id: 'headphones',
    label: 'headphones',
    svg: sticker(
      `<path d="M34 96V82a46 46 0 0 1 92 0v14" fill="none" stroke="#151515" stroke-width="10" stroke-linecap="round"/>
       <rect x="24" y="86" width="28" height="44" rx="12" fill="#8a5cff" stroke="#151515" stroke-width="4"/>
       <rect x="108" y="86" width="28" height="44" rx="12" fill="#8a5cff" stroke="#151515" stroke-width="4"/>
       <path d="M74 64v26a8 8 0 1 1-6-8" fill="none" stroke="#d7ff3a" stroke-width="5" stroke-linecap="round"/>`,
    ),
  },
  {
    id: 'book',
    label: 'book',
    svg: sticker(
      `<g transform="rotate(-8 80 80)"><rect x="40" y="26" width="80" height="108" rx="6" fill="#1b31d6" stroke="#151515" stroke-width="4"/>
       <rect x="40" y="26" width="12" height="108" fill="#0d1a6e"/>
       <circle cx="88" cy="66" r="14" fill="#d7ff3a"/><circle cx="88" cy="66" r="5" fill="#1b31d6"/>
       <path d="M62 108h44M62 118h30" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g>`,
    ),
  },
]

export const STICKER_SIZE = SIZE
