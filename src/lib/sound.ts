import { prefs } from './prefs'

// Everything is synthesized (no audio files). Nothing is created until the
// visitor turns sound on, which is also the user gesture browsers require.

type Graph = { ctx: AudioContext; master: GainNode; fx: GainNode; music: GainNode }

let graph: Graph | null = null

function build(): Graph {
  const ctx = new AudioContext()
  const limiter = ctx.createDynamicsCompressor()
  limiter.threshold.value = -14
  limiter.ratio.value = 6
  const master = ctx.createGain()
  master.gain.value = 0.9
  master.connect(limiter).connect(ctx.destination)

  // A short feedback delay gives the pad and chimes some room.
  const delay = ctx.createDelay(1)
  delay.delayTime.value = 0.32
  const feedback = ctx.createGain()
  feedback.gain.value = 0.35
  const wet = ctx.createGain()
  wet.gain.value = 0.3
  delay.connect(feedback).connect(delay)
  delay.connect(wet).connect(master)

  const fx = ctx.createGain()
  fx.connect(master)
  fx.connect(delay)
  const music = ctx.createGain()
  music.gain.value = 0
  music.connect(master)
  music.connect(delay)
  return { ctx, master, fx, music }
}

function live(): Graph | null {
  if (!prefs.get().sound) return null
  graph ??= build()
  if (graph.ctx.state === 'suspended') void graph.ctx.resume()
  return graph
}

function tone(freq: number, opts: { to?: number; dur: number; gain: number; type?: OscillatorType; at?: number }) {
  const g = live()
  if (!g) return
  const t = g.ctx.currentTime + (opts.at ?? 0)
  const osc = g.ctx.createOscillator()
  const env = g.ctx.createGain()
  osc.type = opts.type ?? 'sine'
  osc.frequency.setValueAtTime(freq, t)
  if (opts.to) osc.frequency.exponentialRampToValueAtTime(opts.to, t + opts.dur)
  env.gain.setValueAtTime(0.0001, t)
  env.gain.exponentialRampToValueAtTime(opts.gain, t + 0.008)
  env.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur)
  osc.connect(env).connect(g.fx)
  osc.start(t)
  osc.stop(t + opts.dur + 0.05)
}

/* ---------- Ambient pad ---------- */

// Cmaj9 -> Am9 -> Fmaj7(#11) -> G6/9, voiced low and warm.
const CHORDS = [
  [130.81, 196.0, 246.94, 293.66, 329.63],
  [110.0, 164.81, 196.0, 246.94, 261.63],
  [87.31, 174.61, 220.0, 246.94, 329.63],
  [98.0, 146.83, 196.0, 220.0, 329.63],
]
const CHORD_SECONDS = 7
const PAD_LEVEL = 0.16

let padTimer = 0
let chord = 0

function playChord(g: Graph) {
  const t = g.ctx.currentTime
  const filter = g.ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(500, t)
  filter.frequency.linearRampToValueAtTime(1300, t + CHORD_SECONDS / 2)
  filter.frequency.linearRampToValueAtTime(600, t + CHORD_SECONDS + 2)
  filter.Q.value = 0.6
  const env = g.ctx.createGain()
  env.gain.setValueAtTime(0.0001, t)
  env.gain.linearRampToValueAtTime(1, t + 2.5)
  env.gain.setValueAtTime(1, t + CHORD_SECONDS - 0.5)
  env.gain.linearRampToValueAtTime(0.0001, t + CHORD_SECONDS + 2.5)
  filter.connect(env).connect(g.music)
  for (const f of CHORDS[chord % CHORDS.length]) {
    for (const detune of [-6, 6]) {
      const osc = g.ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.value = f
      osc.detune.value = detune
      const voice = g.ctx.createGain()
      voice.gain.value = 0.11
      osc.connect(voice).connect(filter)
      osc.start(t)
      osc.stop(t + CHORD_SECONDS + 3)
    }
  }
  chord++
}

function startPad() {
  const g = live()
  if (!g || padTimer) return
  const t = g.ctx.currentTime
  g.music.gain.cancelScheduledValues(t)
  g.music.gain.setValueAtTime(g.music.gain.value, t)
  g.music.gain.linearRampToValueAtTime(PAD_LEVEL, t + 2)
  playChord(g)
  padTimer = window.setInterval(() => playChord(g), CHORD_SECONDS * 1000)
}

function stopPad() {
  clearInterval(padTimer)
  padTimer = 0
  if (!graph) return
  const t = graph.ctx.currentTime
  graph.music.gain.cancelScheduledValues(t)
  graph.music.gain.setValueAtTime(graph.music.gain.value, t)
  graph.music.gain.linearRampToValueAtTime(0, t + 0.6)
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopPad()
    else if (prefs.get().sound) startPad()
  })
}

/* ---------- Public API ---------- */

export const sound = {
  // Call after the preference flips; also the user gesture that unlocks audio.
  sync: () => (prefs.get().sound ? (startPad(), sound.chime()) : stopPad()),
  tick: () => tone(2400, { to: 1800, dur: 0.05, gain: 0.05 }),
  pop: () => {
    const f = 380 + Math.random() * 260
    tone(f, { to: f * 2.2, dur: 0.12, gain: 0.32 })
    tone(f * 1.5, { to: f * 3, dur: 0.08, gain: 0.12, at: 0.02 })
  },
  thud: (strength: number) => tone(150, { to: 55, dur: 0.14, gain: Math.min(0.3, 0.06 + strength * 0.02), type: 'triangle' }),
  chime: () => [784, 1175].forEach((f, i) => tone(f, { dur: 0.6, gain: 0.12, at: i * 0.07 })),
  // Rocky talks in chords.
  chord: () => [523.25, 659.25, 783.99].forEach((f, i) => tone(f, { dur: 0.45, gain: 0.16, type: 'triangle', at: i * 0.14 })),
}
