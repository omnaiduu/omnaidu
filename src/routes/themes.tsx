import { createFileRoute } from '@tanstack/react-router'
import { applyTheme } from '~/components/ThemeToggle'
import { THEME_SWATCH, THEMES } from '~/lib/themes'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/themes')({
  head: () => ({
    meta: seo({
      title: 'Themes — Om Naidu',
      description: 'Light or dark. Same site, two canvases.',
      url: '/themes',
    }),
  }),
  component: ThemesPage,
})

function ThemesPage() {
  return (
    <section className="wrap article">
      <p className="section-label">Appearance</p>
      <h1 className="article-title">Light or dark.</h1>
      <p style={{ color: 'var(--muted)', maxWidth: '54ch', marginBottom: 28 }}>
        Parchment is the warm cream lab. Ink is the night reading version. Pick one — the toggle in the
        header works on every page.
      </p>
      <div className="theme-preview-grid">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            type="button"
            className="theme-preview-card"
            data-recommended={theme.recommended ? 'true' : undefined}
            onClick={() => {
              applyTheme(theme.id)
              window.dispatchEvent(new CustomEvent('om-theme', { detail: theme.id }))
            }}
          >
            {theme.recommended ? <span className="theme-preview-badge">Default</span> : null}
            <div className="theme-preview-frame" data-theme={theme.id}>
              <span className="theme-preview-wordmark">omnaidu</span>
              <p className="theme-preview-kicker">Engineering lab</p>
              <h2 className="theme-preview-headline">Hard systems.</h2>
              <span className="theme-preview-line" aria-hidden />
              <div className="theme-preview-swatches">
                {THEME_SWATCH[theme.id].map((color) => (
                  <i key={color} style={{ background: color }} />
                ))}
              </div>
            </div>
            <div className="theme-preview-meta">
              <b>{theme.name}</b>
              <span>{theme.blurb}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
