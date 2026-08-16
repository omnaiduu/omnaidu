import { THEME_COOKIE, THEME_SWATCH, THEMES, type ThemeId } from '~/lib/themes'

export function applyTheme(theme: ThemeId) {
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000; samesite=lax`
  document.documentElement.dataset.theme = theme
}

export function ThemeDock({ active }: { active: ThemeId }) {
  return (
    <div className="theme-dock">
      <div className="wrap theme-dock-inner">
        <span className="section-label" style={{ margin: 0, paddingRight: 8 }}>
          Themes
        </span>
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            type="button"
            className="theme-card"
            data-active={active === theme.id}
            onClick={() => {
              applyTheme(theme.id)
              window.dispatchEvent(new CustomEvent('om-theme', { detail: theme.id }))
            }}
          >
            <b>
              {theme.name}
              {theme.recommended ? ' · try this' : ''}
            </b>
            <span>{theme.blurb}</span>
            <div className="swatches">
              {THEME_SWATCH[theme.id].map((color) => (
                <i key={color} style={{ background: color }} />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
