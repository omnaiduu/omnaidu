export const THEMES = [
  {
    id: 'parchment',
    name: 'Parchment',
    blurb: 'Cursor-like cream lab. Warm ink, ember links, weight-400 titles.',
    recommended: true,
  },
  {
    id: 'ink',
    name: 'Ink lab',
    blurb: 'Warm near-black canvas. Same geometry, inverted. Night reading.',
    recommended: false,
  },
  {
    id: 'paper',
    name: 'Research paper',
    blurb: 'Brighter white, serif titles, hairline rules. More journal, less product.',
    recommended: false,
  },
  {
    id: 'terminal',
    name: 'Terminal',
    blurb: 'Phosphor on charcoal. Mono labels, amber links. Systems notebook.',
    recommended: false,
  },
] as const

export type ThemeId = (typeof THEMES)[number]['id']

export const THEME_SWATCH: Record<ThemeId, string[]> = {
  parchment: ['#f7f7f4', '#26251e', '#f54e00'],
  ink: ['#14120b', '#efece6', '#ff6a2a'],
  paper: ['#fbfaf6', '#1b1a16', '#9a3412'],
  terminal: ['#0b0f0c', '#d7f7dc', '#e7b549'],
}

export const DEFAULT_THEME: ThemeId = 'parchment'
export const THEME_COOKIE = 'om-theme'

export function isThemeId(value: string | undefined | null): value is ThemeId {
  return THEMES.some((theme) => theme.id === value)
}
