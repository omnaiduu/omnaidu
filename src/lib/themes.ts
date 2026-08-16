export const THEMES = [
  {
    id: 'parchment',
    name: 'Light',
    blurb: 'Warm cream canvas. Ember links, quiet geometry.',
    recommended: true,
  },
  {
    id: 'ink',
    name: 'Dark',
    blurb: 'Warm near-black canvas. Same geometry, inverted.',
    recommended: false,
  },
] as const

export type ThemeId = (typeof THEMES)[number]['id']

export const THEME_SWATCH: Record<ThemeId, string[]> = {
  parchment: ['#f7f7f4', '#26251e', '#f54e00'],
  ink: ['#14120b', '#efece6', '#ff6a2a'],
}

export const DEFAULT_THEME: ThemeId = 'parchment'
export const THEME_COOKIE = 'om-theme'

const LEGACY_THEME_MAP: Record<string, ThemeId> = {
  paper: 'parchment',
  terminal: 'ink',
}

export function normalizeThemeId(value: string | undefined | null): ThemeId {
  if (!value) return DEFAULT_THEME
  if (value === 'parchment' || value === 'ink') return value
  return LEGACY_THEME_MAP[value] ?? DEFAULT_THEME
}

export function isThemeId(value: string | undefined | null): value is ThemeId {
  return value === 'parchment' || value === 'ink'
}
