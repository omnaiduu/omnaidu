import { THEME_COOKIE, THEMES, type ThemeId } from '~/lib/themes'

export function applyTheme(theme: ThemeId) {
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000; samesite=lax`
  document.documentElement.dataset.theme = theme
}

export function ThemeToggle({ active }: { active: ThemeId }) {
  const other = active === 'parchment' ? 'ink' : 'parchment'
  const activeLabel = THEMES.find((t) => t.id === active)?.name ?? 'Light'
  const otherLabel = THEMES.find((t) => t.id === other)?.name ?? 'Dark'

  function switchTheme(theme: ThemeId) {
    applyTheme(theme)
    window.dispatchEvent(new CustomEvent('om-theme', { detail: theme }))
  }

  return (
    <div className="theme-toggle" role="group" aria-label="Color theme">
      <button
        type="button"
        className="theme-toggle-btn"
        data-active={active === 'parchment'}
        aria-pressed={active === 'parchment'}
        onClick={() => switchTheme('parchment')}
      >
        Light
      </button>
      <button
        type="button"
        className="theme-toggle-btn"
        data-active={active === 'ink'}
        aria-pressed={active === 'ink'}
        onClick={() => switchTheme('ink')}
      >
        Dark
      </button>
      <span className="theme-toggle-sr">{activeLabel} theme active. Switch to {otherLabel}.</span>
    </div>
  )
}
