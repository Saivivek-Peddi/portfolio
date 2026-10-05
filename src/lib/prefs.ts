import { useSyncExternalStore } from 'react'

export type ThemePref = 'auto' | 'light' | 'dark'
export type Theme = 'light' | 'dark'

const THEME_CYCLE: ThemePref[] = ['auto', 'light', 'dark']

export function nextThemePref(p: ThemePref): ThemePref {
  return THEME_CYCLE[(THEME_CYCLE.indexOf(p) + 1) % THEME_CYCLE.length]
}

export function resolveTheme(pref: ThemePref, systemDark: boolean): Theme {
  return pref === 'auto' ? (systemDark ? 'dark' : 'light') : pref
}

type State = { pref: ThemePref; theme: Theme; sound: boolean }

const listeners = new Set<() => void>()
// Server render and first client render agree on this; the real values come
// from <html data-*> (set by the inline head script) after hydration.
const SERVER_STATE: State = { pref: 'auto', theme: 'dark', sound: false }
let state: State = SERVER_STATE

function emit(next: State) {
  state = next
  listeners.forEach((l) => l())
}

function readDom(): State {
  const root = document.documentElement
  return {
    pref: (root.dataset.themePref as ThemePref) ?? 'auto',
    theme: root.dataset.theme === 'light' ? 'light' : 'dark',
    sound: state.sound,
  }
}

function subscribe(l: () => void) {
  if (listeners.size === 0 && typeof window !== 'undefined') {
    state = readDom()
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (state.pref === 'auto') applyTheme('auto', e.matches)
    })
  }
  listeners.add(l)
  return () => listeners.delete(l)
}

function applyTheme(pref: ThemePref, systemDark = matchMedia('(prefers-color-scheme: dark)').matches) {
  const theme = resolveTheme(pref, systemDark)
  const root = document.documentElement
  root.dataset.theme = theme
  root.dataset.themePref = pref
  try {
    localStorage.setItem('theme', pref)
  } catch {
    // Storage blocked: the choice lasts for this page view only.
  }
  emit({ ...state, pref, theme })
}

export const prefs = {
  cycleTheme: () => applyTheme(nextThemePref(state.pref)),
  toggleSound: () => emit({ ...state, sound: !state.sound }),
  get: () => state,
}

export function usePrefs(): State {
  return useSyncExternalStore(subscribe, () => state, () => SERVER_STATE)
}
