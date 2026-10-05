import { prefs } from './prefs'

// Tiny synthesized UI sounds (no audio files). Silent unless the visitor
// switched sound on, and the AudioContext is only created after that gesture.
let ctx: AudioContext | null = null

function audio(): AudioContext | null {
  if (!prefs.get().sound) return null
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function blip(freqFrom: number, freqTo: number, duration: number, gain: number, type: OscillatorType = 'sine') {
  const a = audio()
  if (!a) return
  const t = a.currentTime
  const osc = a.createOscillator()
  const g = a.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freqFrom, t)
  osc.frequency.exponentialRampToValueAtTime(freqTo, t + duration)
  g.gain.setValueAtTime(gain, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.connect(g).connect(a.destination)
  osc.start(t)
  osc.stop(t + duration + 0.02)
}

export const sound = {
  pop: () => blip(520 + Math.random() * 380, 160, 0.16, 0.12),
  tick: () => blip(1800, 1400, 0.03, 0.03, 'square'),
  thud: (strength: number) => blip(140, 60, 0.12, Math.min(0.08, strength * 0.01), 'triangle'),
}
