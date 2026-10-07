import type { ArtKind } from '../content/built'

// Small generative covers, one per project, drawn from what the project does.
// Deterministic (seeded) so server and client render the same markup.

function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const LIME = 'var(--color-lime)'
const COBALT = '#3b5bff'

function Sparse() {
  const r = rng(7)
  const cells = []
  for (let y = 0; y < 14; y++)
    for (let x = 0; x < 20; x++) {
      const on = r() < 0.15
      cells.push(
        <rect key={`${x}-${y}`} x={x * 20 + 2} y={y * 20 + 2} width="16" height="16" rx="2" fill={on ? LIME : 'currentColor'} opacity={on ? 1 : 0.08} className={on ? 'art-blink' : ''} style={{ animationDelay: `${(x + y) * 60}ms` }} />,
      )
    }
  return <>{cells}</>
}

function Hetero() {
  const out = []
  for (let i = 0; i < 6; i++)
    for (let j = 0; j < 4; j++) {
      const amd = (i + j) % 2 === 0
      out.push(<rect key={`${i}-${j}`} x={30 + i * 58} y={40 + j * 52} width="46" height="40" rx="6" fill={amd ? '#ed1c24' : '#76b900'} opacity="0.9" className="art-pulse" style={{ animationDelay: `${(i * 4 + j) * 90}ms` }} />)
    }
  return <>{out}</>
}

function Spectrogram() {
  const r = rng(21)
  const out = []
  for (let x = 0; x < 50; x++) {
    const h = 30 + Math.abs(Math.sin(x / 4)) * 120 + r() * 70
    out.push(<rect key={x} x={10 + x * 7.6} y={150 - h / 2} width="5" height={h} rx="2.5" fill={`hsl(${260 - h / 1.4} 90% 62%)`} className="art-eq" style={{ animationDelay: `${x * 40}ms` }} />)
  }
  return <>{out}</>
}

function Partition() {
  const blocks = [
    [10, 10, 180, 130], [196, 10, 194, 70], [196, 86, 94, 54], [296, 86, 94, 54],
    [10, 146, 110, 144], [126, 146, 150, 64], [126, 216, 150, 74], [282, 146, 108, 144],
  ]
  return (
    <>
      {blocks.map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="6" fill={i % 3 === 0 ? LIME : 'currentColor'} opacity={i % 3 === 0 ? 0.95 : 0.12 + (i % 3) * 0.08} className="art-pulse" style={{ animationDelay: `${i * 120}ms` }} />
      ))}
    </>
  )
}

function Isosurface() {
  return (
    <>
      {Array.from({ length: 11 }, (_, i) => (
        <ellipse key={i} cx={200 + Math.sin(i) * 14} cy={150 + Math.cos(i * 1.3) * 8} rx={20 + i * 16} ry={12 + i * 11} fill="none" stroke="#5cf2ff" strokeWidth="1.5" opacity={1 - i * 0.07} className="art-spin" style={{ animationDelay: `${i * -400}ms` }} />
      ))}
    </>
  )
}

function Deadline() {
  const r = rng(3)
  return (
    <>
      {Array.from({ length: 9 }, (_, i) => {
        const x = 20 + r() * 120
        const w = 60 + r() * 200
        return <rect key={i} x={x} y={22 + i * 29} width={w} height="18" rx="4" fill={x + w > 300 ? '#ff5a4f' : COBALT} className="art-grow" style={{ animationDelay: `${i * 90}ms` }} />
      })}
      <line x1="300" y1="10" x2="300" y2="290" stroke={LIME} strokeWidth="2" strokeDasharray="6 6" />
    </>
  )
}

function Grader() {
  const r = rng(11)
  const out = []
  for (let y = 0; y < 6; y++)
    for (let x = 0; x < 9; x++) {
      const ok = r() > 0.12
      const cx = 30 + x * 42
      const cy = 40 + y * 44
      out.push(
        ok ? (
          <path key={`${x}-${y}`} d={`M${cx - 9} ${cy} l6 7 l12 -14`} fill="none" stroke={LIME} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="art-pulse" style={{ animationDelay: `${(x + y * 9) * 30}ms` }} />
        ) : (
          <path key={`${x}-${y}`} d={`M${cx - 7} ${cy - 7} l14 14 m0 -14 l-14 14`} stroke="#ff5a4f" strokeWidth="3" strokeLinecap="round" />
        ),
      )
    }
  return <>{out}</>
}

const ART: Record<ArtKind, () => React.ReactElement> = {
  sparse: Sparse,
  hetero: Hetero,
  spectrogram: Spectrogram,
  partition: Partition,
  isosurface: Isosurface,
  deadline: Deadline,
  grader: Grader,
}

export function BuiltArt({ kind }: { kind: ArtKind }) {
  const Art = ART[kind]
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full text-fg" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <Art />
    </svg>
  )
}
